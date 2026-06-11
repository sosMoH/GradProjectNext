"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface AlarmRowProps {
  id: number;
  locationName: string;
  time: string;
  rawTimestamp: number; // 1. Added rawTimestamp here
  type: string;
  aqi: string;
  pm25: string;
  co: string;
  h2: string;
  image: string;
  isSolved: boolean;
  onToggle: (id: number, rawTimestamp: number) => void; // 2. Changed timeStr to rawTimestamp number
}

const AlarmRow: React.FC<AlarmRowProps> = ({
  id,
  locationName,
  time,
  rawTimestamp, // 3. Destructured it here!
  type,
  aqi,
  pm25,
  co,
  h2,
  image,
  isSolved,
  onToggle,
}) => {
  const displayValue =
    type === "PM2.5" ? pm25 : type === "CO" ? co : type === "H₂" ? h2 : aqi;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="flex items-center justify-between py-3 md:py-4 border-b border-gray-500/25 last:border-0 gap-3 sm:gap-6"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
        <img
          src={image}
          alt={locationName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col sm:flex-row flex-1 justify-between items-start sm:items-center gap-1 sm:gap-4 overflow-hidden">
        <div className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
          {time}
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-bold text-sm sm:text-base text-white">
            {type}
          </span>
          <span className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">
            {displayValue}
          </span>
        </div>
      </div>

      <button
        onClick={() => onToggle(id, rawTimestamp)} // 4. Passed rawTimestamp here instead of time!
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
          isSolved
            ? "bg-transparent border-[#3E9479]"
            : "border-gray-500/50 hover:border-gray-300"
        }`}
      >
        {isSolved && <Check size={16} className="text-[#3E9479]" />}
      </button>
    </motion.div>
  );
};

export default AlarmRow;
