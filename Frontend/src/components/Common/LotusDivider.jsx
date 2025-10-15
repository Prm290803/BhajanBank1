// LotusDivider.jsx
import React from "react";
import { motion } from "framer-motion";

const LotusDivider = ({ className = "" }) => {
  // Animation variants for the larger lotus
  const outerPetalVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotate: -180
    },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      rotate: i * 45,
      transition: {
        delay: i * 0.08,
        duration: 0.8,
        type: "spring",
        stiffness: 60
      }
    })
  };

  const middlePetalVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotate: 180
    },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      rotate: i * 45,
      transition: {
        delay: i * 0.08 + 0.3,
        duration: 0.7,
        type: "spring",
        stiffness: 80
      }
    })
  };

  const innerPetalVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotate: -90
    },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      rotate: i * 45,
      transition: {
        delay: i * 0.08 + 0.6,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const centerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1.0,
        duration: 0.5,
        type: "spring",
        stiffness: 120
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`relative flex justify-center items-center py-5 ${className}`}>
      {/* Large Elegant Lotus Flower */}
      <div className="relative w-32 h-32"> {/* Increased from w-20 h-20 to w-32 h-32 */}
        
        {/* Outer Layer - Large Petals */}
        <div className="absolute inset-0 flex justify-center items-center">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`outer-${i}`}
              className="absolute w-20 h-10 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full shadow-sm"
              style={{
                transform: `translateX(44px)`,
              }}
              custom={i}
              variants={outerPetalVariants}
              initial="hidden"
              animate="visible"
            />
          ))}
        </div>
        
        {/* Middle Layer - Medium Petals */}
        <div className="absolute inset-0 flex justify-center items-center">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`middle-${i}`}
              className="absolute w-16 h-8 bg-gradient-to-b from-pink-300 to-pink-500 rounded-full shadow-sm"
              style={{
                transform: `translateX(32px)`,
              }}
              custom={i}
              variants={middlePetalVariants}
              initial="hidden"
              animate="visible"
            />
          ))}
        </div>
        
        {/* Inner Layer - Small Petals */}
        <div className="absolute inset-0 flex justify-center items-center">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`inner-${i}`}
              className="absolute w-12 h-6 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full shadow-sm"
              style={{
                transform: `translateX(20px)`,
              }}
              custom={i}
              variants={innerPetalVariants}
              initial="hidden"
              animate="visible"
            />
          ))}
        </div>
        
        {/* Center - Large Stamen */}
        <motion.div 
          className="absolute inset-0 m-auto w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full shadow-md"
          variants={centerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Center details */}
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-amber-400 rounded-full" />
          <div className="absolute inset-0 m-auto w-3 h-3 bg-amber-700 rounded-full" />
        </motion.div>
      </div>
      
      {/* Extended Lines */}
      <motion.div 
        className="absolute inset-y-0 left-0 w-full flex items-center -z-10"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full border-t-2 border-gray-300" />
      </motion.div>
    </div>
  );
};

export default LotusDivider;