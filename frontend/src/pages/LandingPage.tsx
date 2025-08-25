// src/pages/LandingPage.tsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPoll,
  FaChartLine,
  FaHistory,
  FaUserCog,
  FaLightbulb,
  FaNewspaper,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAuth } from "@/context/useAuth"; 

const predictionData = [
  { party: "Lab", share: 30, color: "#E4003B" },
  { party: "Con", share: 17.8, color: "#0087DC" },
  { party: "Green", share: 8.9, color: "#6AB023" },
  { party: "LD", share: 14.5, color: "#FDBB30" },
  { party: "Reform", share: 22.5, color: "#00B2FF" },
  { party: "SNP", share: 2.6, color: "#FFF95D" },
  { party: "Other", share: 3.6, color: "#888888" },
];

const headlines = [
  "Conservatives launch new campaign on national security",
  "Labour unveils bold new housing plan",
  "Green Party gains momentum with Gen Z",
  "Lib Dems focus on education reforms",
];

const facts = [
  "The UK uses a 'First Past the Post' voting system.",
  "Turnout is historically highest among older age groups.",
  "In 2019, the Conservatives won an 80-seat majority.",
];

const InfoCard = ({
  title,
  icon,
  items,
  gradient,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  gradient: string;
}) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % items.length),
      5000
    );
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div
      className={`relative ${gradient} text-white rounded-xl shadow-lg p-5 transition`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold flex items-center text-lg">
          {icon} <span className="ml-2">{title}</span>
        </h2>
      </div>
      <p className="text-base sm:text-lg font-medium">{items[index]}</p>
    </div>
  );
};

const NationalPredictionCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
    <h2 className="text-lg font-bold mb-4">National Prediction</h2>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={predictionData}>
        <XAxis dataKey="party" stroke="currentColor" />
        <YAxis stroke="currentColor" />
        <Tooltip />
        <Bar dataKey="share">
          {predictionData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      🏆 Predicted Winner:{" "}
      <span className="font-bold text-red-600">Labour</span>
    </p>
  </div>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); 

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const electionDate = useMemo(() => new Date("2029-05-02T07:00:00"), []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = electionDate.getTime() - now;
      if (distance <= 0) clearInterval(interval);
      else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [electionDate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col items-center px-6 py-10">
      <h1 className="text-5xl font-extrabold mb-4">Welcome to Votelytics</h1>
      <p className="text-lg mb-10 text-center max-w-xl text-slate-600 dark:text-slate-300">
        Discover your political alignment, track national trends, and see how
        the nation might vote.
      </p>

      {/* Countdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-10 text-center w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-3">
          🗳️ Next General Election Countdown
        </h2>
        <p className="text-xl font-mono text-blue-600 dark:text-blue-400">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
          {timeLeft.seconds}s
        </p>
      </div>

      {/* CTA */}
      {!isLoggedIn ? (
        <div className="space-x-4 mb-10">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-gray-300 dark:bg-slate-700 dark:text-white hover:opacity-90 rounded-lg transition"
          >
            Register
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/survey")}
          className="px-8 py-3 mb-10 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
        >
          Take the Survey
        </button>
      )}

      {/* Quick Access */}
      {isLoggedIn && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          <div
            onClick={() => navigate("/survey")}
            className="cursor-pointer p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <FaPoll className="text-3xl mx-auto text-blue-600" />
            <p className="mt-2 font-semibold">Survey</p>
          </div>
          <div
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <FaChartLine className="text-3xl mx-auto text-green-600" />
            <p className="mt-2 font-semibold">Dashboard</p>
          </div>
          <div
            onClick={() => navigate("/history")}
            className="cursor-pointer p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <FaHistory className="text-3xl mx-auto text-purple-600" />
            <p className="mt-2 font-semibold">History</p>
          </div>
          <div
            onClick={() => navigate("/settings")}
            className="cursor-pointer p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <FaUserCog className="text-3xl mx-auto text-red-600" />
            <p className="mt-2 font-semibold">Settings</p>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
        <InfoCard
          title="📰 Political Headlines"
          icon={<FaNewspaper />}
          items={headlines}
          gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
        />
        <InfoCard
          title="💡 Did You Know?"
          icon={<FaLightbulb />}
          items={facts}
          gradient="bg-gradient-to-r from-pink-500 to-orange-500"
        />
        <NationalPredictionCard />
      </div>

      <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        🔒 We never share your data. All data is securely stored | Created ❤️ by
        Destiny Jokomba
      </p>
    </div>
  );
};

export default LandingPage;
