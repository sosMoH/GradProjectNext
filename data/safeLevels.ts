export const aqiSafeLevel = {
  markers: [
    { value: "50", left: "25%" },
    { value: "200", left: "75%" },
  ],
  ranges: [
    { label: "Good:", value: "0–20", color: "#00E400" },
    { label: "Moderate:", value: "21–50", color: "#FFFF00" },
    { label: "Unhealthy:", value: "51–70", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "71–90", color: "#8F3F97" },
    { label: "Hazardous:", value: "91–100", color: "#7E0023" },
  ],
};

export const pm25SafeLevel = {
  markers: [
    { value: "13", left: "20%" },
    { value: "150", left: "75%" },
  ],
  ranges: [
    { label: "Good:", value: "0–20", color: "#00E400" },
    { label: "Moderate:", value: "21–50", color: "#FFFF00" },
    { label: "Unhealthy:", value: "51–70", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "71–90", color: "#8F3F97" },
    { label: "Hazardous:", value: "91–100", color: "#7E0023" },
  ],
};

export const coSafeLevel = {
  markers: [
    { value: "800", left: "25%" },
    { value: "1500", left: "60%" },
  ],
  ranges: [
    { label: "Good:", value: "0–20", color: "#00E400" },
    { label: "Moderate:", value: "21–50", color: "#FFFF00" },
    { label: "Unhealthy:", value: "51–70", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "71–90", color: "#8F3F97" },
    { label: "Hazardous:", value: "91–150", color: "#7E0023" },
  ],
};

export const h2SafeLevel = {
  markers: [{ value: "200", left: "70%" }],
  ranges: [
    { label: "Good:", value: "0–20", color: "#00E400" },
    { label: "Moderate:", value: "21–50", color: "#FFFF00" },
    { label: "Unhealthy:", value: "51–70", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "71–90", color: "#8F3F97" },
    { label: "Hazardous:", value: "91–100", color: "#7E0023" },
  ],
};