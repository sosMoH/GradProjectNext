"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { PlusCircle, MinusCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Custom FAQ Item Component ---
const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-500/25 py-4 last:border-0">
      {/* Question Row (Clickable) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 text-left focus:outline-none"
      >
        <span className="text-[18px] md:text-[20px] text-[#A7F3D0] font-medium">
          {question}
        </span>
        {/* Toggle Icon */}
        <div className="text-gray-400 flex-shrink-0">
          {isOpen ? (
            <MinusCircle strokeWidth={1} size={28} />
          ) : (
            <PlusCircle strokeWidth={1} size={28} />
          )}
        </div>
      </button>

      {/* Smooth Expanding Answer Area */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* The Answer Content */}
            <div className="pt-3 pb-2 text-[#ffffff] text-[16px] leading-relaxed pr-8 md:pr-16">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN FAQs Page Component ---
const FaqsPage: React.FC = () => {
  // All the data extracted directly from your Figma design
  const faqs = [
    {
      question: "What does this system do?",
      answer:
        "This system monitors indoor air quality by measuring dust particles (PM2.5), harmful gases, temperature, and humidity, while also providing early warning for fire and hazardous gas conditions.",
    },
    {
      question: "What happens during a fire or gas hazard?",
      answer:
        "If dangerous levels of carbon monoxide, flammable gases, or smoke are detected, the system immediately disables the ionizer and sends emergency alerts through email and SMS notifications.",
    },
    {
      question: "How is data transmitted?",
      answer:
        "Sensor data is sent securely through Wi-Fi using the MQTT protocol to AWS IoT Core for cloud processing, storage, and alert management.",
    },
    {
      question: "Who can we use this system?",
      answer:
        "The system is suitable for homes, laboratories, universities, offices, industrial zones, and other indoor environments where air quality and safety monitoring are important.",
    },
    {
      question: "Is the system cost-effective?",
      answer:
        "Yes. The system uses low-cost sensors, cloud-based services, and scalable IoT architecture to provide an affordable alternative to traditional air quality monitoring stations.",
    },
    {
      question: "Which sensors are used in the system?",
      // Using a React Fragment allows us to perfectly format your bulleted list!
      answer: (
        <div className="flex flex-col gap-1">
          <p>The system uses:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>GP2Y1010AU0F for dust and PM2.5 detection</li>
            <li>MQ9 for carbon monoxide and flammable gases</li>
            <li>MQ135 for VOCs and general air quality</li>
            <li>DHT22 for temperature and humidity monitoring</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full min-h-full bg-[#04070C] font-sans flex flex-col pb-[70px] md:pb-0 overflow-x-hidden">
      <main className="flex-1 flex flex-col w-full">
        {/* Header */}
        <Header
          title="AIR QUALITY MONITORING AND CONTROL"
          dateColor="text-white"
          bellColor="text-[#0A7C56]"
        />

        <div className="px-6 md:px-12 py-8 flex flex-col max-w-[1440px] mx-auto w-full">
          {/* Main FAQ Container Box */}
          <div className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[25px] p-8 md:p-12 w-full">
            {/* Headers */}
            <h1 className="text-white text-[32px] md:text-[40px] font-semibold mb-2">
              Frequently asked questions
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-[500px] mb-12">
              In this section, you will find clear and up-to-date answers to the
              most common questions about environmental monitoring, air quality
            </p>

            {/* Split Layout: FAQs on left, Card on right */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
              {/* Left Column: The FAQ List */}
              <div className="flex-1 w-full flex flex-col">
                {faqs.map((faq, index) => (
                  <FaqItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>

              {/* Right Column: Info Card */}
              <div className="w-full lg:w-[380px] bg-[#0A0D12] border border-gray-500/25 rounded-[20px] p-8 flex-shrink-0">
                <h3 className="text-white text-[28px] font-medium mb-4">
                  For more information
                </h3>
                <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
                  Download the full documentation to explore detailed
                  specifications, system architecture, and implementation
                  guides.
                </p>
                <button
                  onClick={() =>
                    window.open(
                      "https://drive.google.com/uc?export=download&id=187BdH_oiOTd43g24AUtFd5sc0CGUDo5v",
                      "_blank",
                    )
                  }
                  className="flex items-center gap-4 text-white border border-gray-500 rounded-full px-6 py-2.5 hover:border-[#A7F3D0]
                hover:px-8 hover:text-[#A7F3D0] transition-colors cursor-pointer"
                >
                  <span className="text-sm">Book Download</span>
                  <ArrowRight size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaqsPage;
