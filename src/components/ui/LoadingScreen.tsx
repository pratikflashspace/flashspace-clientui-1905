import React from "react";
import { motion } from "framer-motion";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FEF8C3]/30 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Animated Outer Rings */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="w-24 h-24 rounded-[2rem] border-t-4 border-r-4 border-[#35503F] absolute"
        />
        
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-20 h-20 rounded-[1.5rem] border-b-4 border-l-4 border-[#35503F]/30 absolute"
        />

        {/* Center Logo/Icon Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-12 h-12 bg-[#35503F] rounded-2xl flex items-center justify-center shadow-lg shadow-[#35503F]/20"
        >
          <div className="w-6 h-6 border-2 border-[#FEF8C3] rounded-full animate-pulse" />
        </motion.div>

        {/* Text Animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-16 flex flex-col items-center"
        >
          <h2 className="text-[#35503F] text-xl font-black tracking-[0.2em] uppercase italic">
            Flash<span className="text-primary">Space</span>
          </h2>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-1.5 h-1.5 rounded-full bg-[#35503F]"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
