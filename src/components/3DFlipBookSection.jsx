import { Book } from "lucide-react";
import React from "react";
import HTMLFlipBook from "react-pageflip";
import AnimatedSectionDivider from "./AnimatedSectionDivider";
import { useState, useEffect } from "react";

const Page = React.forwardRef(({ title, text }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 shadow-inner rounded-sm border-r border-amber-200 p-6 flex flex-col justify-between relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(45deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%, transparent),
          linear-gradient(-45deg, transparent 24%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '12px 12px'
      }}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-amber-100 to-orange-100"></div>
      
      {/* Binding holes */}
      <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-red-300 bg-gradient-to-r from-red-50 to-transparent">
        <div className="absolute left-3 top-8 w-1 h-1 bg-red-400 rounded-full"></div>
        <div className="absolute left-3 top-16 w-1 h-1 bg-red-400 rounded-full"></div>
        <div className="absolute left-3 bottom-16 w-1 h-1 bg-red-400 rounded-full"></div>
      </div>
      
      <div className="relative z-10 ml-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed font-serif">{text}</p>
      </div>
      
      {/* Page number */}
      <div className="absolute bottom-4 right-6 text-xs text-gray-500 font-serif">
        {Math.floor(Math.random() * 100) + 1}
      </div>
    </div>
  );
});

const CoverPage = React.forwardRef((props, ref) => (
  <div
    ref={ref}
    className="w-full h-full relative rounded-sm overflow-hidden"
    style={{
      background: `
        linear-gradient(145deg, #0f172a 0%, #1e293b 15%, #334155 30%, #475569 45%, #64748b 100%),
        radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)
      `
    }}
  >
    {/* Solid base to prevent background bleeding */}
    <div className="absolute inset-0 bg-slate-800"></div>
    
    {/* Rich leather texture overlay */}
    <div 
      className="absolute inset-0 opacity-80"
      style={{
        background: `
          linear-gradient(145deg, #0f172a 0%, #1e293b 20%, #334155 40%, #475569 60%, #64748b 100%)
        `,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(0,0,0,0.4) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px),
          linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.08) 49%, rgba(255,255,255,0.08) 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(0,0,0,0.1) 49%, rgba(0,0,0,0.1) 51%, transparent 52%)
        `,
        backgroundSize: '6px 6px, 8px 8px, 4px 4px, 4px 4px'
      }}
    ></div>
    
    {/* Enhanced embossed effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40"></div>
    
    {/* Content */}
    <div className="relative z-20 p-8 h-full flex flex-col items-center justify-center text-white">
      {/* Enhanced title with stronger emboss */}
      <div className="relative mb-6">
        <h1 className="text-3xl font-bold font-serif tracking-wide relative z-10 drop-shadow-2xl">
          e-Library
        </h1>
        <div className="absolute inset-0 text-3xl font-bold font-serif tracking-wide text-black/60 transform translate-x-1 translate-y-1">
          e-Library
        </div>
        <div className="absolute inset-0 text-3xl font-bold font-serif tracking-wide text-white/20 transform -translate-x-0.5 -translate-y-0.5">
          e-Library
        </div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-amber-300"></div>
        <Book className="w-7 h-7 text-amber-300 drop-shadow-lg" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent via-amber-400 to-amber-300"></div>
      </div>
      
      <p className="text-sm font-serif tracking-widest text-amber-100 drop-shadow-md">
        Your Gateway to Knowledge
      </p>
      
      {/* Enhanced publisher mark */}
      <div className="absolute bottom-6 right-6 text-xs text-amber-200/80 font-serif drop-shadow-sm">
        Premium Edition
      </div>
    </div>
    
    {/* Enhanced corner details */}
    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-amber-400/70 rounded-tl-sm"></div>
    <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/70 rounded-tr-sm"></div>
    <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-amber-400/70 rounded-bl-sm"></div>
    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-amber-400/70 rounded-br-sm"></div>
  </div>
));

const BackCover = React.forwardRef((props, ref) => (
  <div
    ref={ref}
    className="w-full h-full relative rounded-sm overflow-hidden"
    style={{
      background: `
        linear-gradient(145deg, #0f172a 0%, #1e293b 15%, #334155 30%, #475569 45%, #64748b 100%),
        radial-gradient(circle at 70% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)
      `
    }}
  >
    {/* Solid base to prevent background bleeding */}
    <div className="absolute inset-0 bg-slate-800"></div>
    
    {/* Same enhanced texture as front cover */}
    <div 
      className="absolute inset-0 opacity-80"
      style={{
        background: `
          linear-gradient(145deg, #0f172a 0%, #1e293b 20%, #334155 40%, #475569 60%, #64748b 100%)
        `,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(0,0,0,0.4) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px),
          linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.08) 49%, rgba(255,255,255,0.08) 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(0,0,0,0.1) 49%, rgba(0,0,0,0.1) 51%, transparent 52%)
        `,
        backgroundSize: '6px 6px, 8px 8px, 4px 4px, 4px 4px'
      }}
    ></div>
    
    <div className="absolute inset-0 bg-gradient-to-tl from-white/20 via-transparent to-black/40"></div>
    
    <div className="relative z-20 p-8 h-full flex flex-col justify-center text-white">
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold font-serif mb-4 drop-shadow-lg">About This Collection</h2>
        <p className="text-sm leading-relaxed text-gray-200 font-serif drop-shadow-sm">
          Discover a world of knowledge at your fingertips. This digital library contains 
          carefully curated content designed to inspire and educate readers of all backgrounds.
        </p>
      </div>
      
      <div className="mt-auto text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Book className="w-8 h-8 text-amber-300 drop-shadow-lg" />
        </div>
        <p className="text-xs font-serif text-amber-200/90 drop-shadow-sm">
          Digital Publishing House
        </p>
      </div>
    </div>
  </div>
));

export default function FlipBookSection() {
  const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-100 relative overflow-hidden">
      {/* Wood grain background */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(139,69,19,0.1) 50%, transparent 50%),
            linear-gradient(rgba(160,82,45,0.05) 50%, transparent 50%)
          `,
          backgroundSize: '120px 4px, 60px 2px'
        }}
      ></div>
      
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 font-serif mb-4">Free Books To Read</h2>
          <p className="text-gray-600 text-lg font-serif">The Most Popular Books Today are available in Book Library</p>
          <AnimatedSectionDivider />
        </div>

        {/* Table surface */}
        <div className="relative flex justify-center items-center">
          {/* Table shadow */}
          <div className="absolute inset-0 bg-gradient-radial from-black/10 via-black/5 to-transparent rounded-full transform scale-150"></div>
          
          {/* Book container with 3D perspective */}
          <div className="relative transform-gpu perspective-1000">
            {/* Multiple shadow layers for depth */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 w-[340px] h-[460px] bg-black/20 blur-xl rounded-lg transform rotate-x-60 scale-y-50"></div>
            <div className="absolute left-1/2 top-2 -translate-x-1/2 w-[335px] h-[455px] bg-black/15 blur-lg rounded-lg transform rotate-x-45 scale-y-60"></div>
            <div className="absolute left-1/2 top-1 -translate-x-1/2 w-[330px] h-[450px] bg-black/10 blur-md rounded-lg transform rotate-x-30 scale-y-70"></div>
            
            {/* Book spine shadow */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-2 w-2 h-[440px] bg-gradient-to-b from-black/30 via-black/20 to-black/30 rounded-full blur-sm transform -rotate-2"></div>
            
            {/* Main book */}
            <div className="relative z-20 transform hover:scale-105 transition-transform duration-300 ease-out">
              <HTMLFlipBook
                width={isMobile ? 280 : 320}
                height={isMobile ? 390: 440}
                size="stretch"
                minWidth={isMobile ? 280 : 300}
                maxWidth={isMobile ? 320 : 360}
                minHeight={isMobile ? 380: 420}
                maxHeight={isMobile ? 420: 480}
                usePortrait={isMobile}
                maxShadowOpacity={0.8}
                showCover={!isMobile}
                startPage={isMobile ? 0 : 1}
                mobileScrollSupport={true}
                className="book-shadow"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                }}
                flippingTime={800}
                startZIndex={100}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={50}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                <CoverPage />
                <Page title="Chapter 1: Introduction" text={sampleText} />
                <Page title="Chapter 2: Fundamentals" text={sampleText} />
                <Page title="Chapter 3: Advanced Topics" text={sampleText} />
                <Page title="Chapter 4: Case Studies" text={sampleText} />
                <Page title="Chapter 5: Implementation" text={sampleText} />
                <Page title="Chapter 6: Best Practices" text={sampleText} />
                <BackCover />
              </HTMLFlipBook>
            </div>
            
            {/* Ambient lighting effect */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-8 w-[400px] h-[500px] bg-gradient-radial from-blue-200/20 via-transparent to-transparent rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .book-shadow {
          transition: all 0.3s ease;
        }
        .book-shadow:hover {
          filter: drop-shadow(0 30px 60px rgba(0,0,0,0.4)) drop-shadow(0 15px 25px rgba(0,0,0,0.3)) !important;
        }
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-x-60 {
          transform: rotateX(60deg);
        }
        .rotate-x-45 {
          transform: rotateX(45deg);
        }
        .rotate-x-30 {
          transform: rotateX(30deg);
        }
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}