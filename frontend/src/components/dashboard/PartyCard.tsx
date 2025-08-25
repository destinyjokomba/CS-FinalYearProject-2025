import React, { useEffect, useState } from "react";
import { CheckCircle, Medal } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type PartyMeta = {
  color: string;
  logo: string;
  ethos: string[];
  slogan?: string;
};

type Prediction = {
  party: string;
  confidence: number;
  runnerUp: string;
};

interface PartyCardProps {
  prediction: Prediction;
}

// ─── Local Fallback Metadata ───────────────────────────────
const fallbackPartyMeta: Record<string, PartyMeta> = {
  labour: {
    color: "#E4003B",
    logo: "/logos/labour.png",
    ethos: ["Workers' rights", "Public services", "Equality"],
    slogan: "For the many, not the few",
  },
  conservative: {
    color: "#0087DC",
    logo: "/logos/conservative.svg.png",
    ethos: ["Strong economy", "Free markets", "Personal responsibility"],
    slogan: "Build a better future",
  },
  libdem: {
    color: "#FDBB30",
    logo: "/logos/libdem.png",
    ethos: ["Civil liberties", "Environment", "Education"],
    slogan: "Open, tolerant, united",
  },
  green: {
    color: "#6AB023",
    logo: "/logos/green.svg.png",
    ethos: ["Climate action", "Sustainability", "Equality"],
    slogan: "Fairer, greener future",
  },
  reform: {
    color: "#00BFFF",
    logo: "/logos/reform.svg.png",
    ethos: ["Tax cuts", "National sovereignty", "Border control"],
    slogan: "Britain first, always",
  },
  snp: {
    color: "#FFF95D",
    logo: "/logos/snp.svg.png",
    ethos: ["Scottish independence", "Social justice", "Green energy"],
    slogan: "Stronger for Scotland",
  },
};

// Map for nice display labels
const displayNames: Record<string, string> = {
  labour: "Labour",
  conservative: "Conservative",
  libdem: "Liberal Democrat",
  green: "Green",
  reform: "Reform UK",
  snp: "SNP",
};

// Normalize keys
const normalizeKey = (key: string): string => {
  const k = key.trim().toLowerCase();
  if (k === "lib dem" || k === "liberal democrat") return "libdem";
  if (k === "reform uk") return "reform";
  if (k === "scottish national party") return "snp";
  if (k === "tories" || k === "cons") return "conservative";
  return k;
};

const PartyCard: React.FC<PartyCardProps> = ({ prediction }) => {
  const [partyInfo, setPartyInfo] = useState<Record<string, PartyMeta>>(fallbackPartyMeta);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Fetch metadata with fallback
  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/api/partyMeta`;
    console.log("🌍 Fetching metadata from:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Loaded party metadata:", data);
        setPartyInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching party metadata, using fallback:", err);
        setPartyInfo(fallbackPartyMeta); // fallback if API fails
        setLoading(false);
      });
  }, []);

  // Animate confidence ring
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      setProgress(start);
      if (start >= prediction.confidence) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [prediction.confidence]);

  // Normalize prediction + runnerUp keys
  const normalizedParty = normalizeKey(prediction.party);
  const normalizedRunnerUp = normalizeKey(prediction.runnerUp);

  const party = partyInfo[normalizedParty];

  // If still loading
  if (loading) {
    return (
      <div className="p-6 bg-gray-200 dark:bg-slate-700 rounded-2xl">
        Fetching {displayNames[normalizedParty] || prediction.party} info...
      </div>
    );
  }

  // If metadata not found even after fallback
  if (!party) {
    return (
      <div className="p-6 bg-red-200 dark:bg-red-700 rounded-2xl">
        ❌ Could not find metadata for: {prediction.party} (normalized:{" "}
        {normalizedParty})
        <br />
        Available keys: {Object.keys(partyInfo).join(", ")}
      </div>
    );
  }

  // Confidence ring styling
  let confidenceLabel = "Low confidence";
  let ringColor = "#f87171";
  if (prediction.confidence >= 70) {
    confidenceLabel = "High confidence";
    ringColor = "#4ade80";
  } else if (prediction.confidence >= 40) {
    confidenceLabel = "Medium confidence";
    ringColor = "#fbbf24";
  }

  return (
    <div
      className="relative rounded-2xl shadow-lg p-6 text-white overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${party.color}, ${party.color}dd)`,
      }}
    >
      {/* Watermark */}
      <img
        src={party.logo}
        alt=""
        className="absolute inset-0 m-auto w-48 h-48 opacity-10"
      />

      <div className="relative flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <img
            src={party.logo}
            alt={`${displayNames[normalizedParty]} logo`}
            className="w-12 h-12"
          />
          <div>
            <h3 className="text-2xl font-bold">
              {displayNames[normalizedParty] || prediction.party}
            </h3>
            {party.slogan && (
              <p className="text-sm italic opacity-80">{party.slogan}</p>
            )}
          </div>
        </div>

        {/* Confidence ring */}
        <div className="w-16 h-16 text-center">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: ringColor,
              trailColor: `${party.color}66`,
            })}
          />
          <p className="text-xs mt-1">{confidenceLabel}</p>
        </div>
      </div>

      {/* Ethos */}
      <ul className="mt-5 space-y-2 relative z-10">
        {party.ethos.map((point, idx) => (
          <li key={idx} className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 opacity-90" />
            {point}
          </li>
        ))}
      </ul>

      {/* Runner-up */}
      <div className="mt-5 flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full w-fit">
        <Medal className="w-4 h-4 text-yellow-300" />
        <span className="text-sm font-semibold">
          Runner-up: {displayNames[normalizedRunnerUp] || prediction.runnerUp}
        </span>
      </div>
    </div>
  );
};

export default PartyCard;
