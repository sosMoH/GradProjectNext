"use client";

import { useState, useEffect } from "react";

export interface SensorData {
  aqi: number;
  pm25: number;
  co2: number;
  no2: number;
}

// 1. We now accept 'isSystemOn' as a parameter
export const useSensorData = (isSystemOn: boolean = true) => {
  const [data, setData] = useState<SensorData>({
    aqi: 153,
    pm25: 143,
    co2: 250,
    no2: 100,
  });

  useEffect(() => {
    // 2. If the system is OFF, do not run the interval at all!
    if (!isSystemOn) return;

    // --- PRESENTATION DEMO MODE ---
    const interval = setInterval(() => {
      setData((prev) => ({
        aqi: Math.max(0, prev.aqi + Math.floor(Math.random() * 11) - 5),
        pm25: Math.max(0, prev.pm25 + Math.floor(Math.random() * 7) - 3),
        co2: Math.max(0, prev.co2 + Math.floor(Math.random() * 41) - 20),
        no2: Math.max(0, prev.no2 + Math.floor(Math.random() * 5) - 2),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isSystemOn]); // 3. Re-run this effect whenever the power button is clicked

  return data;
};

/* --- REAL API IMPLEMENTATION (For later) ---
    const fetchLatestData = async () => {
      const response = await fetch("https://YOUR_API_GATEWAY_URL/latest");
      const json = await response.json();
      setData(json); 
    };
    fetchLatestData();
    const realInterval = setInterval(fetchLatestData, 3000); 
    return () => clearInterval(realInterval);
    */
