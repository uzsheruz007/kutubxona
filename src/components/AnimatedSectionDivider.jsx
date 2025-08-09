import { Book } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedSectionDivider() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 0.5) % 100); // Smoother increment
    }, 50); // Slower, smoother animation
    
    return () => clearInterval(interval);
  }, []);

  // Better calculation for smooth expansion and contraction
  const getLineWidths = () => {
    if (progress <= 50) {
      // Expanding phase: lines grow from center outward
      const expansionProgress = progress / 50; // 0 to 1
      return {
        left: `${expansionProgress * 35}%`,  // Goes up to 45%
        right: `${expansionProgress * 35}%`  // Goes up to 45%
      };
    } else {
      // Contracting phase: lines shrink back to center
      const contractionProgress = (progress - 50) / 50; // 0 to 1
      return {
        left: `${45 - (contractionProgress * 45)}%`,  // Goes from 45% to 0%
        right: `${45 - (contractionProgress * 45)}%`  // Goes from 45% to 0%
      };
    }
  };

  const { left, right } = getLineWidths();

  // Icon animation based on progress
  const getIconAnimation = () => {
    const cycle = progress % 100;
    if (cycle < 25) {
      return { scale: 1 + (cycle / 25) * 0.3, rotate: 0 }; // Scale up
    } else if (cycle < 50) {
      return { scale: 1.3, rotate: ((cycle - 25) / 25) * 180 }; // Rotate
    } else if (cycle < 75) {
      return { scale: 1.3 - ((cycle - 50) / 25) * 0.3, rotate: 180 }; // Scale down
    } else {
      return { scale: 1, rotate: 180 - ((cycle - 75) / 25) * 180 }; // Rotate back
    }
  };

  const iconAnimation = getIconAnimation();

  return (
    <div className="relative w-full max-w-3xl h-12 mx-auto flex items-center justify-center px-4">
      
      {/* Left Line */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-blue-600 relative overflow-hidden"
        style={{ width: left }}
        animate={{ width: left }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: 1 
          }}
        />
      </motion.div>

      {/* Central Icon Container */}
      <motion.div
        className="relative mx-4 flex items-center justify-center"
        animate={iconAnimation}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        {/* Icon background with glow */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md scale-120"></div>
          
          {/* Icon container */}
          <div className="relative bg-white border-2 border-blue-500 rounded-full p-2 shadow-lg">
            <Book className="w-4 h-4 text-blue-600" />
          </div>
          
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 border-2 border-blue-400 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1], 
              opacity: [0.8, 0, 0.8] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>

      {/* Right Line */}
      <motion.div
        className="h-0.5 bg-gradient-to-l from-transparent via-blue-500 to-blue-600 relative overflow-hidden"
        style={{ width: right }}
        animate={{ width: right }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: 1 
          }}
        />
      </motion.div>

      {/* Background particles for extra flair */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              top: "50%",
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}