export const aqiSafeLevel = {
  markers: [
    { value: "50", left: "25%" },
    { value: "200", left: "75%" },
  ],
  ranges: [
    { label: "Good:", value: "0–50", color: "#00E400" },
    { label: "Moderate:", value: "51–100", color: "#FFFF00" },
    { label: "Unhealthy:", value: "151–200", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "201–300", color: "#8F3F97" },
    { label: "Hazardous:", value: "301–500", color: "#7E0023" },
  ],
};

export const pm25SafeLevel = {
  markers: [
    { value: "13", left: "20%" },
    { value: "150", left: "75%" },
  ],
  ranges: [
    { label: "Good:", value: "0–12", color: "#00E400" },
    { label: "Moderate:", value: "13–35", color: "#FFFF00" },
    { label: "Unhealthy:", value: "56–150", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "151–250", color: "#8F3F97" },
    { label: "Hazardous:", value: "251–500", color: "#7E0023" },
  ],
};

export const co2SafeLevel = {
  markers: [
    { value: "800", left: "25%" },
    { value: "1500", left: "60%" },
  ],
  ranges: [
    { label: "Good:", value: "0–50", color: "#00E400" },
    { label: "Moderate:", value: "51–100", color: "#FFFF00" },
    { label: "Unhealthy:", value: "151–200", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "201–300", color: "#8F3F97" },
    { label: "Hazardous:", value: "301–500", color: "#7E0023" },
  ],
};

export const no2SafeLevel = {
  markers: [{ value: "200", left: "70%" }],
  ranges: [
    { label: "Good:", value: "0–21", color: "#00E400" },
    { label: "Moderate:", value: "22–53", color: "#FFFF00" },
    { label: "Unhealthy:", value: "101–360", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "361–500", color: "#8F3F97" },
    { label: "Hazardous:", value: "501–650", color: "#7E0023" },
  ],
};