"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Inbox } from "lucide-react";

const ExpandedAlarmsModal = ({
  expandedView,
  setExpandedView,
  displayedExpandedAlarms,
  toggleAlarm,
}: any) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-[#04070C]/90 backdrop-blur-sm">
      <motion.div
        layoutId={`card-${expandedView}`}
        className="w-full max-w-[1200px] h-full max-h-[750px] bg-[#0B0F14] border border-gray-500/25 rounded-[15px] p-8 md:p-12 flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            {expandedView === "unsolved" ? (
              <AlertCircle fill="#830202" color="white" size={36} />
            ) : (
              <CheckCircle2 color="#3E9479" size={36} />
            )}
            <div>
              <h2
                className={`text-[32px] font-bold leading-tight ${expandedView === "unsolved" ? "text-[#830202]" : "text-[#3E9479]"}`}
              >
                {expandedView === "unsolved"
                  ? "Unsolved Alarms"
                  : "Solved Alarms"}
              </h2>
              <p className="text-gray-500 text-sm">
                {displayedExpandedAlarms.length}{" "}
                {expandedView === "unsolved"
                  ? "active alarms"
                  : "solved alarms"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpandedView(null)}
            className="w-10 h-10 border border-gray-500/25 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        </div>

        <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-[900px] flex flex-col">
            <div className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 text-[#888888] font-semibold text-[20px] pb-4 border-b border-gray-500/25 text-center px-4">
              <div className="text-left pl-2">location</div>
              <div className="text-left">Time</div>
              <div>AQI</div>
              <div>PM2.5</div>
              <div>CO</div>
              <div>NO₂</div>
              <div>Status</div>
            </div>

            <div className="flex flex-col overflow-y-auto max-h-[40vh] md:max-h-[500px]">
              <AnimatePresence mode="popLayout">
                {displayedExpandedAlarms.map((alarm: any) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    // Dynamic Exit: Unsolved exits right (+80), Solved exits left (-80)
                    exit={{
                      opacity: 0,
                      x: expandedView === "unsolved" ? 80 : -80,
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    key={alarm.id}
                    className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 items-center py-6 text-white/90 text-[18px] border-b border-gray-500/10 text-center px-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left border-r border-gray-500/25">
                      <img
                        src={alarm.image}
                        className="w-16 h-16 rounded-[10px] object-cover flex-shrink-0"
                        alt="Location"
                      />
                      <span className="whitespace-nowrap">
                        {alarm.locationName}
                      </span>
                    </div>
                    <div className="text-left font-mono border-r border-gray-500/25 pl-4 whitespace-nowrap">
                      {alarm.time}
                    </div>
                    <div className="border-r border-gray-500/25">
                      {alarm.aqi}
                    </div>
                    <div className="border-r border-gray-500/25">
                      {alarm.pm25}
                    </div>
                    <div className="border-r border-gray-500/25">
                      {alarm.co}
                    </div>
                    <div className="border-r border-gray-500/25">
                      {alarm.h2}
                    </div>
                    <div className="flex justify-center">
                      <div
                        onClick={() => toggleAlarm(alarm.id)}
                        className={`w-6 h-6 border rounded-sm flex-shrink-0 cursor-pointer transition-colors duration-200 ${alarm.isSolved ? "bg-[#3E9479] border-[#3E9479]" : "border-gray-500"}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center justify-center pt-8 opacity-40">
          <div className="relative mb-2">
            <Inbox size={60} strokeWidth={1} className="text-[#3E9479]" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-1 h-3 bg-[#3E9479] rounded-full rotate-[-45deg]" />
              <div className="w-1 h-4 bg-[#3E9479] rounded-full" />
              <div className="w-1 h-3 bg-[#3E9479] rounded-full rotate-[45deg]" />
            </div>
          </div>
          <p className="text-[16px] font-medium text-gray-400">
            {expandedView === "unsolved"
              ? "No More Unsolved Alarms"
              : "No More Solved Alarms"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpandedAlarmsModal;
