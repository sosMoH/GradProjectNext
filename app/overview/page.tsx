"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Power,
  AlertCircle,
} from "lucide-react";

import Header, { getFormattedDate } from "@/components/Header";
import { useSensorData } from "@/hooks/useSensorData";
import GaugeCard from "@/components/GaugeCard";
import AlarmRow from "@/components/AlarmRow";
import AlarmSkeleton from "@/components/AlarmSkeleton";
import ExpandedAlarmsModal from "@/components/ExpandedAlarmsModal";

import {
  aqiSafeLevel,
  pm25SafeLevel,
  coSafeLevel,
  h2SafeLevel,
} from "@/data/safeLevels";

export interface AlarmItem {
  alarmId: string;
  locationName: string;
  time: string;
  rawTimestamp: number;
  type: string;
  aqi: string;
  pm25: string;
  co: string;
  h2: string;
  image: string;
  isSolved: boolean;
}

const imgRoom = "/assets/alarms_locations/bedroom.png";
const imgGarden = "/assets/alarms_locations/garden.png";
const imgRoof = "/assets/alarms_locations/roof.png";

const translations = {
  en: {
    title: "AIR QUALITY MONITORING AND CONTROL",
    latestStatus: "Latest status",
    historyData: "History data",
    stopSystem: "Stop System",
    startSystem: "Start System",
    allMeasurements: "All measurements",
    oneDayRange: "One-day range",
    twoDayRange: "Two-days range",
    threeDayRange: "Three-days range",
    unsolvedAlarms: "Unsolved Alarms",
    solvedAlarms: "Solved Alarms",
    viewAll: "View All",
    headerAlert: "concentration has reached hazardous levels!",
    popupAlert: "concentration has reached hazardous levels.",
    close: "Close",
  },
  ar: {
    title: "مراقبة جودة الهواء والتحكم بها",
    latestStatus: "أحدث الحالات",
    historyData: "البيانات التاريخية",
    stopSystem: "إيقاف النظام",
    startSystem: "تشغيل النظام",
    allMeasurements: "جميع القياسات",
    oneDayRange: "نطاق يوم واحد",
    twoDayRange: "نطاق يومين",
    threeDayRange: "نطاق ثلاثة أيام",
    unsolvedAlarms: "إنذارات غير محلولة",
    solvedAlarms: "إنذارات محلولة",
    viewAll: "عرض الكل",
    headerAlert: "وصلت إلى مستويات خطيرة!",
    popupAlert: "وصلت إلى مستويات خطيرة.",
    close: "إغلاق",
  },
};

const formatDummyDate = (dateObj: Date, timeStr: string) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d} ${timeStr}`;
};

const OverviewPage: React.FC = () => {
  const { today, minDate } = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const m = new Date(t);
    m.setDate(t.getDate() - 2);
    return { today: t, minDate: m };
  }, []);

  const [lang, setLang] = useState<"en" | "ar">("en");
  const t = (key: keyof (typeof translations)["en"]) => translations[lang][key];

  const [expandedView, setExpandedView] = useState<
    "unsolved" | "solved" | null
  >(null);
  const [isSystemOn, setIsSystemOn] = useState(true);

  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [dayRange, setDayRange] = useState<1 | 2 | 3>(1);
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false);

  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);
  const liveSensors = useSensorData(isSystemOn);

  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH HISTORICAL ALARMS ON LOAD ---
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true); // <-- Turn on loading
      try {
        const res = await fetch("/api/getAlarms");
        if (res.ok) {
          const historicalAlarms = await res.json();
          historicalAlarms.sort(
            (a: AlarmItem, b: AlarmItem) => b.rawTimestamp - a.rawTimestamp,
          );
          setAlarms(historicalAlarms);
        }
      } catch (err) {
        console.error("Failed to load historical alarms:", err);
      } finally {
        setIsLoading(false); // <-- Turn off loading when done
      }
    };

    fetchHistory();
  }, []);

  const activeHazardousSensors = useMemo(() => {
    const hazardous = [];
    if (liveSensors.aqi >= 50) hazardous.push("AQI");
    if (liveSensors.pm25 >= 25) hazardous.push("PM2.5");
    if (liveSensors.co >= 100) hazardous.push("CO");
    if (liveSensors.h2 >= 50) hazardous.push("H₂");
    return hazardous;
  }, [liveSensors]);

  useEffect(() => {
    setAcknowledgedAlerts((prev) =>
      prev.filter((sensor) => activeHazardousSensors.includes(sensor)),
    );
  }, [activeHazardousSensors]);

  // --- AUTO-ADD ALARMS TO TABLE ---
  useEffect(() => {
    if (activeHazardousSensors.length === 0) return;

    setAlarms((prevAlarms) => {
      let newAlarms = [...prevAlarms];
      let addedNew = false;

      activeHazardousSensors.forEach((sensorType) => {
        // Prevent spam: Check if an unsolved alarm for this specific sensor type already exists
        const alreadyHasActiveAlarm = newAlarms.some(
          (a) => a.type === sensorType && !a.isSolved,
        );

        if (!alreadyHasActiveAlarm) {
          const now = new Date();
          const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

          newAlarms.unshift({
            alarmId: crypto.randomUUID(), // <-- NEW: Creates the unique ID DynamoDB needs
            locationName: "Main Node",
            time: formatDummyDate(now, timeString),
            rawTimestamp: now.getTime(),
            type: sensorType,
            aqi: liveSensors.aqi.toString(),
            pm25: `${liveSensors.pm25}µg/m³`,
            co: `${liveSensors.co}ppm`,
            h2: `${liveSensors.h2}ppb`,
            image: imgRoom,
            isSolved: false,
          });
          addedNew = true;
        }
      });

      return addedNew ? newAlarms : prevAlarms;
    });
  }, [activeHazardousSensors, liveSensors]);

  const currentPopupAlert = activeHazardousSensors.find(
    (sensor) => !acknowledgedAlerts.includes(sensor),
  );

  const handleCloseAlert = (sensor: string) => {
    setAcknowledgedAlerts([...acknowledgedAlerts, sensor]);
  };

  const handleToggleSystem = async () => {
    if (
      !window.confirm(
        `Are you sure you want to ${isSystemOn ? "stop" : "start"} the system?`,
      )
    )
      return;
    setIsSystemOn(!isSystemOn);
  };

  const toggleAlarm = async (alarmToSolve: AlarmItem) => {
    // 1. Optimistically update UI
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.alarmId === alarmToSolve.alarmId
          ? { ...alarm, isSolved: true }
          : alarm,
      ),
    );

    // 2. Send the full object to proxy
    try {
      const updatedAlarm = { ...alarmToSolve, isSolved: true };

      const response = await fetch("/api/updateAlarm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAlarm), // <-- Send the whole object!
      });

      if (!response.ok)
        throw new Error(`Proxy returned status: ${response.status}`);
      console.log("DynamoDB successfully updated via Proxy!");
    } catch (err) {
      console.error("Failed to update database, reverting UI:", err);
      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.alarmId === alarmToSolve.alarmId
            ? { ...alarm, isSolved: false }
            : alarm,
        ),
      );
    }
  };

  const isPrevDisabled = currentDate.getTime() <= minDate.getTime();
  const isNextDisabled = currentDate.getTime() >= today.getTime();

  const handlePrevDay = () => {
    if (!isPrevDisabled)
      setCurrentDate((prev) => new Date(prev.getTime() - 86400000));
  };
  const handleNextDay = () => {
    if (!isNextDisabled)
      setCurrentDate((prev) => new Date(prev.getTime() + 86400000));
  };

  const filteredAlarms = useMemo(() => {
    return alarms.filter((alarm) => {
      const alarmDate = new Date(alarm.time.split(" ")[0]);
      alarmDate.setHours(0, 0, 0, 0);

      const endDate = new Date(currentDate);
      endDate.setHours(0, 0, 0, 0);

      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - (dayRange - 1));

      return alarmDate >= startDate && alarmDate <= endDate;
    });
  }, [alarms, currentDate, dayRange]);

  const unsolvedAlarms = filteredAlarms.filter((a) => !a.isSolved);
  const solvedAlarms = filteredAlarms.filter((a) => a.isSolved);
  const displayedExpandedAlarms =
    expandedView === "unsolved" ? unsolvedAlarms : solvedAlarms;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative w-full min-h-screen bg-[#04070C] font-sans flex flex-col pb-[70px] md:pb-0 overflow-x-hidden"
    >
      <AnimatePresence>
        {expandedView && (
          <ExpandedAlarmsModal
            expandedView={expandedView}
            setExpandedView={setExpandedView}
            displayedExpandedAlarms={displayedExpandedAlarms}
            toggleAlarm={toggleAlarm}
          />
        )}

        {currentPopupAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-[#11161D] border border-gray-600 rounded-2xl p-6 md:p-8 flex flex-col items-center w-full max-w-sm text-center shadow-[0_0_30px_rgba(255,107,107,0.15)] pointer-events-auto">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-4">
                <AlertCircle size={28} className="text-white" />
              </div>
              <p className="text-white text-lg font-medium leading-snug mb-6">
                {currentPopupAlert} {t("popupAlert")}
              </p>
              <button
                onClick={() => handleCloseAlert(currentPopupAlert)}
                className="bg-[#242C36] text-white px-8 py-2 rounded-full hover:bg-gray-700 transition-colors w-full"
              >
                {t("close")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={`flex-1 flex flex-col w-full relative z-10 ${currentPopupAlert ? "blur-sm transition-all duration-300" : ""}`}
      >
        <Header
          title={t("title")}
          dateColor="text-white"
          bellColor="text-[#0A7C56]"
          lang={lang}
          setLang={setLang}
          currentDate={currentDate}
          activeAlerts={activeHazardousSensors}
          t={t}
        />

        <div className="px-4 sm:px-6 md:px-12 py-6 md:py-8 flex flex-col gap-8 md:gap-10 max-w-[1440px] mx-auto w-full">
          <section className="relative z-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-[26px] md:text-[32px] text-[#0A7C56]">
                {t("latestStatus")}
              </h2>
              <button
                onClick={handleToggleSystem}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] transition-all duration-300 shadow-lg text-sm sm:text-base w-full sm:w-auto ${
                  isSystemOn
                    ? "bg-[#993737]/20 border border-[#993737] text-[#ff6b6b] hover:bg-[#993737] hover:text-white shadow-[0_0_15px_rgba(153,55,55,0.3)]"
                    : "bg-[#3E9479]/20 border border-[#3E9479] text-[#A7F3D0] hover:bg-[#3E9479] hover:text-white shadow-[0_0_15px_rgba(62,148,121,0.3)]"
                }`}
              >
                <Power size={18} />
                <span className="font-semibold tracking-wide">
                  {isSystemOn ? t("stopSystem") : t("startSystem")}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center md:justify-items-start z-20 relative">
              <GaugeCard
                title="AQI"
                value={liveSensors.aqi}
                unit=""
                percentage={isSystemOn ? liveSensors.aqi / 100 : 0}
                safeLevelData={aqiSafeLevel}
                isSystemOn={isSystemOn}
              />
              <GaugeCard
                title="PM2.5"
                value={liveSensors.pm25}
                unit="µg/m³"
                percentage={isSystemOn ? liveSensors.pm25 / 100 : 0}
                safeLevelData={pm25SafeLevel}
                isSystemOn={isSystemOn}
              />
              <GaugeCard
                title="CO"
                value={liveSensors.co}
                unit="ppm"
                percentage={isSystemOn ? liveSensors.co / 150 : 0}
                safeLevelData={coSafeLevel}
                isSystemOn={isSystemOn}
              />
              <GaugeCard
                title="H₂"
                value={liveSensors.h2}
                unit="ppb"
                percentage={isSystemOn ? liveSensors.h2 / 100 : 0}
                safeLevelData={h2SafeLevel}
                isSystemOn={isSystemOn}
              />
            </div>
            {/* --- PILLS SECTION --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-8 z-10 relative justify-items-center md:justify-items-start">
              {/* Empty Spacer for Column 1 (Under AQI) */}
              <div className="hidden lg:block w-full"></div>

              {/* Temperature Pill (Under PM2.5) */}
              <div className="w-full max-w-[250px]">
                <div className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg h-full">
                  <span className="text-gray-300 text-[16px] tracking-wide">
                    Temperature
                  </span>
                  <div className="text-white text-[18px] font-medium font-mono">
                    {isSystemOn ? liveSensors.temp.toFixed(1) : "--"}
                    <span className="text-gray-400 text-sm ml-1 font-sans">
                      °C
                    </span>
                  </div>
                </div>
              </div>

              {/* Humidity Pill (Under CO) */}
              <div className="w-full max-w-[250px]">
                <div className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg h-full">
                  <span className="text-gray-300 text-[16px] tracking-wide">
                    Humidity
                  </span>
                  <div className="text-white text-[18px] font-medium font-mono">
                    {isSystemOn ? liveSensors.humidity.toFixed(1) : "--"}
                    <span className="text-gray-400 text-sm ml-1 font-sans">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Empty Spacer for Column 4 (Under H2) */}
              <div className="hidden lg:block w-full"></div>
            </div>
            {/* --- END PILLS SECTION --- */}
          </section>

          <section className="relative z-10">
            <h2 className="text-[26px] md:text-[32px] text-[#0A7C56] mb-4 md:mb-6">
              {t("historyData")}
            </h2>

            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 text-white w-full">
              {/* Filter Row - Made flex to sit side-by-side cleanly on mobile */}
              <div className="flex flex-row w-full sm:w-auto bg-[#0B0F14]/60 border border-gray-500/25 rounded-[12px] md:rounded-[15px] relative overflow-visible">
                <button
                  className={`flex-1 sm:flex-none justify-center sm:justify-start px-3 py-2.5 sm:px-6 sm:py-3 ${lang === "ar" ? "border-l rounded-r-[12px]" : "border-r rounded-l-[12px]"} border-gray-500/25 flex items-center gap-2 hover:bg-white/5 transition-colors text-xs sm:text-base font-medium`}
                >
                  <span className="truncate">{t("allMeasurements")}</span>{" "}
                  <ChevronDown size={14} className="flex-shrink-0" />
                </button>

                <div className="flex-1 sm:flex-none relative">
                  <button
                    onClick={() => setIsRangeMenuOpen(!isRangeMenuOpen)}
                    className={`w-full justify-center sm:justify-start px-3 py-2.5 sm:px-6 sm:py-3 flex items-center gap-2 hover:bg-white/5 transition-colors h-full text-xs sm:text-base font-medium ${lang === "ar" ? "rounded-l-[12px]" : "rounded-r-[12px]"}`}
                  >
                    <span className="truncate">
                      {dayRange === 1
                        ? t("oneDayRange")
                        : dayRange === 2
                          ? t("twoDayRange")
                          : t("threeDayRange")}
                    </span>
                    <ChevronDown size={14} className="flex-shrink-0" />
                  </button>
                  {isRangeMenuOpen && (
                    <div className="absolute top-full left-0 w-full min-w-[150px] sm:min-w-[200px] bg-[#0B0F14] border border-gray-500/25 rounded-xl shadow-2xl z-50 mt-2 overflow-hidden">
                      <button
                        onClick={() => {
                          setDayRange(1);
                          setIsRangeMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-white/10 text-xs sm:text-sm transition-colors"
                      >
                        {t("oneDayRange")}
                      </button>
                      <button
                        onClick={() => {
                          setDayRange(2);
                          setIsRangeMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-white/10 text-xs sm:text-sm transition-colors"
                      >
                        {t("twoDayRange")}
                      </button>
                      <button
                        onClick={() => {
                          setDayRange(3);
                          setIsRangeMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-white/10 text-xs sm:text-sm transition-colors"
                      >
                        {t("threeDayRange")}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Navigator */}
              <div
                className="flex items-center justify-between w-full xl:w-auto gap-4 sm:gap-6"
                dir="ltr"
              >
                <button
                  onClick={handlePrevDay}
                  disabled={isPrevDisabled}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-black border border-gray-500/25 rounded flex justify-center items-center transition-colors ${isPrevDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"}`}
                >
                  <ChevronLeft size={18} className="text-gray-400" />
                </button>

                <span className="text-[18px] sm:text-[22px] md:text-[26px] font-medium text-center flex-1">
                  {getFormattedDate(currentDate, lang)}
                </span>

                <button
                  onClick={handleNextDay}
                  disabled={isNextDisabled}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-black border border-gray-500/25 rounded flex justify-center items-center transition-colors ${isNextDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"}`}
                >
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <motion.div
                layoutId="card-unsolved"
                className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[12px] md:rounded-[15px] p-4 sm:p-6 relative"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-[#993737]">
                    {t("unsolvedAlarms")}
                  </h3>
                  <button
                    onClick={() => setExpandedView("unsolved")}
                    className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-[15px] flex items-center gap-1 sm:gap-2 hover:bg-white/10 transition-colors z-10 relative flex-shrink-0"
                  >
                    {t("viewAll")}{" "}
                    {lang === "ar" ? (
                      <ChevronLeft size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                </div>
                <div className="flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      // Show 3 skeletons while loading
                      <>
                        <AlarmSkeleton />
                        <AlarmSkeleton />
                      </>
                    ) : unsolvedAlarms.length > 0 ? (
                      unsolvedAlarms.map((alarm) => (
                        <AlarmRow
                          key={alarm.alarmId}
                          {...alarm}
                          onToggle={toggleAlarm}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-xs sm:text-sm">
                        No alarms found for selected dates.
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                layoutId="card-solved"
                className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[12px] md:rounded-[15px] p-4 sm:p-6 relative"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-[#3E9479]">
                    {t("solvedAlarms")}
                  </h3>
                  <button
                    onClick={() => setExpandedView("solved")}
                    className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-[15px] flex items-center gap-1 sm:gap-2 hover:bg-white/10 transition-colors z-10 relative flex-shrink-0"
                  >
                    {t("viewAll")}{" "}
                    {lang === "ar" ? (
                      <ChevronLeft size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                </div>
                <div className="flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      // Show 3 skeletons while loading
                      <>
                        <AlarmSkeleton />
                        <AlarmSkeleton />
                      </>
                    ) : solvedAlarms.length > 0 ? (
                      solvedAlarms.map((alarm) => (
                        <AlarmRow
                          key={alarm.alarmId}
                          {...alarm}
                          onToggle={toggleAlarm}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-xs sm:text-sm">
                        No alarms found for selected dates.
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
