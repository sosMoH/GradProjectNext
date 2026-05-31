"use client";

import { useState } from "react";
import { HelpCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- NEW: Helper function to calculate the color based on the value! ---
const getDynamicColor = (val: number, safeData: any) => {
  if (typeof val !== "number" || isNaN(val)) return "#4B5563"; // Fallback safety color

  for (const range of safeData.ranges) {
    // Splits the string "0-50" or "0–50" into an array [0, 50]
    const bounds = range.value.split(/[-–]/);
    const min = parseInt(bounds[0], 10);
    const max = bounds.length > 1 ? parseInt(bounds[1], 10) : Infinity;

    // If the value falls in this range, return this specific color!
    if (val >= min && val <= max) {
      return range.color;
    }
  }
  // If it goes above the highest max (Hazardous), return the final color
  return safeData.ranges[safeData.ranges.length - 1].color;
};

// Added 'isSystemOn' to the props
const GaugeCard = ({
  title,
  value,
  unit,
  percentage,
  safeLevelData,
  isSystemOn,
}: any) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // --- NEW: Get the exact color dynamically! ---
  // If the system is OFF, it turns grey. If ON, it calculates the color.
  const activeColor = isSystemOn
    ? getDynamicColor(value, safeLevelData)
    : "#4B5563";

  const safePercentage = Math.min(Math.max(percentage, 0), 1);
  const arcLength = 314.16;
  const offset = arcLength - safePercentage * arcLength;
  const rotation = -120 + safePercentage * 240;

  return (
    <div
      className={`bg-[#0B0F14]/60 border border-gray-500/25 rounded-[25px] p-6 flex flex-col items-center relative w-full max-w-[250px] aspect-square justify-between transition-all duration-300 ${isTooltipOpen ? "z-50 border-gray-400/50" : "z-10"}`}
    >
      <h3 className="text-white text-2xl w-full text-left font-semibold">
        {title}
      </h3>

      <div className="relative w-full flex justify-center mt-2">
        <svg
          viewBox="0 0 200 160"
          className="w-[160px] h-[130px] overflow-visible"
        >
          <path
            d="M 35 137.5 A 75 75 0 1 1 165 137.5"
            fill="none"
            stroke="#EAEAEA"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* We now pass activeColor to the SVG stroke */}
          <path
            d="M 35 137.5 A 75 75 0 1 1 165 137.5"
            fill="none"
            stroke={activeColor}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <g
            transform={`rotate(${rotation}, 100, 100)`}
            className="transition-all duration-1000 ease-out"
          >
            <polygon points="100,14 94,2 106,2" fill="#FFF" />
          </g>
        </svg>
        <div className="absolute top-[42%] flex flex-col items-center">
          {/* We now pass activeColor to the text color */}
          <span
            className="text-[32px] font-semibold leading-none transition-all duration-1000"
            style={{ color: activeColor }}
          >
            {value}
          </span>
          <span className="text-gray-400 text-sm mt-1">{unit}</span>
        </div>
      </div>

      <HelpCircle
        size={18}
        className={`text-gray-500 mt-2 cursor-pointer transition-colors relative z-20 ${isTooltipOpen ? "text-white" : "hover:text-white"}`}
        onClick={() => setIsTooltipOpen(!isTooltipOpen)}
      />

      <AnimatePresence>
        {isTooltipOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%-25px)] left-[-1px] right-[-1px] bg-[#0B0F14] border border-gray-500/50 rounded-[20px] p-5 shadow-2xl flex flex-col z-50"
          >
            <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#0B0F14] border-t border-l border-gray-500/50 rotate-45 rounded-tl-[2px]" />
            <div className="flex justify-between items-center mb-6 relative">
              <span className="text-white text-[15px] font-medium w-full text-center">
                {title} safe level
              </span>
              <XCircle
                size={20}
                className="text-gray-500 cursor-pointer hover:text-white transition-colors absolute right-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTooltipOpen(false);
                }}
              />
            </div>

            <div
              className="relative w-full h-2 rounded-full mb-6 mt-2"
              style={{
                background:
                  "linear-gradient(to right, #00E400, #FFFF00, #FF0000, #8F3F97, #7E0023)",
              }}
            >
              {safeLevelData.markers.map((marker: any, idx: number) => (
                <div
                  key={idx}
                  className="absolute top-[-16px] flex flex-col items-center -translate-x-1/2"
                  style={{ left: marker.left }}
                >
                  <span className="text-[10px] text-gray-300 leading-none">
                    {marker.value}
                  </span>
                  <div className="w-[1px] h-[6px] bg-white mt-1" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              {safeLevelData.ranges.map((row: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-[13px] font-medium tracking-wide"
                >
                  <span style={{ color: row.color }}>{row.label}</span>
                  <span className="text-gray-100">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GaugeCard;
