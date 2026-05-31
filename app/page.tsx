"use client";

import Header from "@/components/Header";

const MainPage: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-sans text-white flex flex-col">
      
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-[10px]"
        style={{ backgroundImage: `url('/assets/air-quality-monitors.png')` }}
      />

      <main className="relative z-10 flex-1 flex flex-col h-full overflow-y-auto md:overflow-hidden">
        
        <Header
          title="AIR QUALITY MONITORING AND CONTROL"
          dateColor="text-white"
          bellColor="text-white"
        />

        <div className="flex-1 flex flex-col md:flex-row items-stretch justify-between px-6 md:px-12 mt-4 md:mt-0">
          
          <div className="flex-1 order-1 md:order-2 flex flex-col justify-center max-w-[800px] z-10 md:pl-8 lg:pl-0">
            <h2 className="text-[32px] md:text-[48px] font-bold leading-tight md:leading-[60px] mb-4 md:mb-8">
              Cut costs and boost performance with reliable, real-time air
              quality data
            </h2>
            <p className="text-[20px] md:text-[32px] leading-snug md:leading-[40px] text-gray-200">
              Control your emissions and optimize the efficiency of your
              operations
            </p>
          </div>

          <div className="flex-1 order-2 md:order-1 flex justify-center items-end w-full mt-8 md:mt-0">
            <img
              src="/assets/device.png"
              alt="Air Quality Monitor Device"
              className="max-h-[50vh] md:max-h-[85vh] w-full object-contain object-bottom drop-shadow-2xl"
            />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default MainPage;