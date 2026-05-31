"use client";

import { useState, useEffect } from "react";
import { Bell, ChevronDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  title: string;
  dateColor?: string;
  bellColor?: string;
  lang?: "en" | "ar";
  setLang?: (lang: "en" | "ar") => void;
  currentDate?: Date;
  activeAlerts?: string[];
  t?: (key: any) => string; 
}

export const getFormattedDate = (date: Date, lang: "en" | "ar"): string => {
  const day = date.getDate();
  const year = date.getFullYear();

  if (lang === "ar") {
    const month = date.toLocaleDateString("ar-EG", { month: "long" });
    return `${day} ${month}، ${year}`;
  } else {
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const getOrdinalSuffix = (d: number) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  }
};

const Header: React.FC<HeaderProps> = ({
  title,
  dateColor = "text-white",
  bellColor = "text-white",
  lang = "en",
  setLang = () => {}, 
  currentDate = new Date(),
  activeAlerts = [],
  t = (key: any) => key, 
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [alertIndex, setAlertIndex] = useState(0);

  useEffect(() => {
    if (activeAlerts.length > 1) {
      const interval = setInterval(() => {
        setAlertIndex((prev) => (prev + 1) % activeAlerts.length);
      }, 3000); 
      return () => clearInterval(interval);
    } else {
      setAlertIndex(0); 
    }
  }, [activeAlerts.length]);

  const getAlertMessage = () => {
    const translated = t("headerAlert");
    return translated === "headerAlert" ? "concentration has reached hazardous levels!" : translated;
  };

  const currentIndex = alertIndex >= activeAlerts.length ? 0 : alertIndex;

  return (
    // Adjusted padding for mobile
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 px-4 sm:px-6 md:pt-8 md:pr-12 md:pl-8 gap-4 sm:gap-0 relative z-50">
      
      {/* Removed the fixed h-[50px] and overflow-hidden that was clipping the title */}
      <div className="w-full sm:w-2/3 flex flex-col justify-center min-h-[50px]">
        <AnimatePresence mode="wait">
          {activeAlerts.length > 0 ? (
            
            <motion.div
              key="alert-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start sm:items-center gap-2 sm:gap-3 text-[#ff6b6b] w-full"
            >
              <AlertCircle className="min-w-[20px] min-h-[20px] sm:min-w-[24px] sm:min-h-[24px] animate-pulse mt-0.5 sm:mt-0 flex-shrink-0" />
              
              {/* Only apply overflow-hidden to this specific text row, allowing it to wrap if necessary */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 font-semibold tracking-wide text-xs sm:text-sm md:text-base leading-snug">
                <div className="relative h-5 sm:h-6 overflow-hidden min-w-[50px]">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeAlerts[currentIndex]}
                      initial={{ opacity: 0, y: 20, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -20, rotateX: 90 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
                      className="font-bold whitespace-nowrap absolute"
                    >
                      {activeAlerts[currentIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <span>
                  {getAlertMessage()}
                </span>
              </div>
            </motion.div>

          ) : (
            <motion.div
              key="normal-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Adjusted text sizing for mobile */}
              <h1 className="text-base sm:text-lg md:text-[20px] tracking-wider font-semibold leading-snug text-white uppercase break-words">
                {title}
              </h1>
              <p className={`text-xs md:text-sm mt-1 sm:mt-1 ${dateColor}`}>
                {getFormattedDate(currentDate, lang)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 md:gap-6 self-end sm:self-auto relative w-full sm:w-auto justify-end">
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="bg-[#0B0F14]/50 border border-gray-500/25 text-white pl-2 pr-3 sm:pr-4 py-1.5 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={lang === "en" ? "https://flagcdn.com/w40/us.png" : "https://flagcdn.com/w40/sa.png"}
                alt="Flag"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold">{lang === "en" ? "Eng(US)" : "العربية"}</span>
            <ChevronDown size={14} className="md:w-4 md:h-4 text-gray-400" />
          </button>

          {isLangMenuOpen && (
            <div className="absolute top-full mt-2 right-0 w-[120px] sm:w-full bg-[#0B0F14] border border-gray-500/25 rounded-xl overflow-hidden shadow-lg z-50">
              <button onClick={() => { setLang("en"); setIsLangMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10">English</button>
              <button onClick={() => { setLang("ar"); setIsLangMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10">العربية</button>
            </div>
          )}
        </div>

        <div className={`relative cursor-pointer ${bellColor}`}>
          <Bell size={22} className="sm:w-7 sm:h-7" />
          {activeAlerts.length > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#9C0D0D] rounded-full border-2 border-[#04070C] animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;