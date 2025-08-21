import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaLightbulb } from "react-icons/fa";

const facts = [
  "In the 2019 UK General Election, voter turnout was 67.3%.",
  "Young voters are more likely to support Greens and Labour.",
  "The Conservatives have won the most seats in 20 of the last 29 general elections.",
  "The UK uses a 'First Past the Post' voting system.",
  "Women under 30 are more likely to vote Labour than Conservative.",
];

const DidYouKnowCard: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextFact = () => setIndex((prev) => (prev + 1) % facts.length);
  const prevFact = () => setIndex((prev) => (prev - 1 + facts.length) % facts.length);

  return (
    <div className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 dark:from-pink-500 dark:via-red-500 dark:to-yellow-400 text-black dark:text-white rounded-2xl shadow-xl p-8 min-h-[220px] flex flex-col justify-between">
      {/* Icon + Title + Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-extrabold flex items-center gap-2">
          <FaLightbulb className="text-yellow-600 dark:text-yellow-300" />
          Did You Know?
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevFact}
            className="p-2 rounded-full bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 transition"
            aria-label="Previous Fact"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextFact}
            className="p-2 rounded-full bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 transition"
            aria-label="Next Fact"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Fact Content */}
      <div className="flex-grow flex items-center justify-center mt-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="text-xl font-semibold text-center leading-snug"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            {facts[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className="text-sm text-center mt-6 text-black/70 dark:text-white/70">
        Created with <span className="text-red-600">❤️</span> by Destiny
      </p>
    </div>
  );
};

export default DidYouKnowCard;
