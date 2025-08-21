// src/components/common/InfoCard.tsx
import { useState, useEffect } from "react";

interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

const InfoCard: React.FC<InfoCardProps> = ({ title, icon, items }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="relative bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-black rounded-xl shadow-md p-4 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold flex items-center text-sm sm:text-base">
          {icon} <span className="ml-2">{title}</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="px-2 text-xs bg-white bg-opacity-30 rounded hover:bg-opacity-50"
          >
            ←
          </button>
          <button
            onClick={() => setIndex((prev) => (prev + 1) % items.length)}
            className="px-2 text-xs bg-white bg-opacity-30 rounded hover:bg-opacity-50"
          >
            →
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm sm:text-base font-medium">{items[index]}</p>
    </div>
  );
};

export default InfoCard;
