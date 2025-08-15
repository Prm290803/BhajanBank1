// LotusDivider.jsx
import React from "react";

const LotusDivider = ({ className = "" }) => {
  return (
    <div className={`relative flex justify-center items-center ${className}`}>
      {/* Lotus petals */}
      <div className="relative w-16 h-16">
        {/* Outer petals */}
        <div className="absolute inset-0 flex justify-center items-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={`outer-${i}`}
              className="absolute w-8 h-8 bg-pink-300 rounded-full"
              style={{
                transform: `rotate(${i * 45}deg) translateX(20px)`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        
        {/* Inner petals */}
        <div className="absolute inset-0 flex justify-center items-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={`inner-${i}`}
              className="absolute w-6 h-6 bg-pink-400 rounded-full"
              style={{
                transform: `rotate(${i * 45}deg) translateX(12px)`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
        
        {/* Center */}
        <div className="absolute inset-0 m-auto w-4 h-4 bg-yellow-300 rounded-full" />
      </div>
      
      {/* Divine lines extending outward */}
      <div className="absolute inset-y-0 left-0 w-full flex items-center -z-10">
        <div className="w-full border-t border-bhagwa-300 border-dashed" />
      </div>
    </div>
  );
};

export default LotusDivider;