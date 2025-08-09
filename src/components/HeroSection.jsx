import BookShowcase from "./BookShowcase";
import { useTranslation } from "react-i18next";
import { Parallax } from "react-parallax";

export default function HeroSection({ onScrollClick }) {
  const { t } = useTranslation();
  
  return (
    <Parallax
    // bg image 2400x1800
      bgImage="/images/backgroundbook.png" 
      strength={300}
      blur={{ min: 0, max: 2 }}
      bgImageStyle={{
        objectFit: "cover",
        objectPosition: "center top",
      }}
      className="py-24 sm:py-42 md:py-48 flex items-center overflow-hidden"
    >
      {/* Dark overlay for better text readability */}
      {/* <div className="absolute inset-0 bg-black/40 z-0"></div> */}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left side - text content */}
          <div className="w-full lg:w-1/2 md:pl-30 text-center lg:text-left text-white order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight">
              {t("hero.welcome")}
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-none sm:max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t("hero.description")}
            </p>
            
            <button
              onClick={onScrollClick}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
            >
              {t("hero.viewBooks")}
            </button>
          </div>
          
          {/* Right side - BookShowcase */}
          <div className="w-full lg:w-1/2 flex md:pl-30 justify-center items-center order-1 lg:order-2">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <BookShowcase />
            </div>
          </div>
          
        </div>
      </div>
    </Parallax>
  );
}