"use client";

import { useState, useEffect } from "react";

export interface SensorData {
  aqi: number;
  pm25: number;
  co: number;
  h2: number;
  temp: number;
  humidity: number;
}

export const useSensorData = (isSystemOn: boolean = true) => {
  const [data, setData] = useState<SensorData>({
    aqi: 0,
    pm25: 0,
    co: 0,
    h2: 0,
    temp: 0,
    humidity: 0,
  });

  useEffect(() => {
    if (!isSystemOn) return;

    const fetchLatestData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error(
          "Environment variable NEXT_PUBLIC_API_URL is missing! Check your .env file.",
        );
        return; // Stop the function here
      }

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error("API Response not OK");

        const json = await response.json();

        // Ensure data exists before mapping
        if (json && Object.keys(json).length > 0) {
          setData({
            aqi: json.MQ135_AQI || 0,
            pm25: json.PM2_5 || 0,
            co: json.MQ9_CO || 0,
            h2: json.MQ8_H2 || 0,
            temp: json.Temperature || 0,
            humidity: json.Humidity || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch live sensor data:", err);
      }
    };

    // Fetch instantly on load
    fetchLatestData();

    // Poll the database every 3 seconds for live updates
    const realInterval = setInterval(fetchLatestData, 3000);
    return () => clearInterval(realInterval);
  }, [isSystemOn]);

  return data;
};
