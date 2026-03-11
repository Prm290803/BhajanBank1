import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

const IntroScreen = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);

  const mantras = [
    "ॐ श्री स्वामिनारायणाय नमः",
    "ॐ श्री सहजानन्दाय नमः", 
    "ॐ श्री हरिकृष्णाय नमः",
    "ॐ श्री घनश्यामाय नमः",
    "ॐ श्री भक्तवत्सलाय नमः",
    "ॐ श्री नारायणमुनये नमः",
    "ॐ श्री धर्मनन्दनाय नमः",
    "ॐ श्री अक्षरपुरुषोत्तमाय नमः"
  ];

  // Different font styles for variety
  const fontStyles = [
    { size: '10px', weight: '300', family: "'Noto Sans Devanagari', sans-serif" },
    { size: '14px', weight: '400', family: "'Tiro Devanagari Sanskrit', serif" },
    { size: '12px', weight: '500', family: "'Poppins', sans-serif" },
    { size: '16px', weight: '300', family: "'Noto Serif Devanagari', serif" },
    { size: '11px', weight: '600', family: "'Noto Sans Devanagari', sans-serif" },
    { size: '15px', weight: '400', family: "'Tiro Devanagari Sanskrit', serif" },
    { size: '13px', weight: '500', family: "'Poppins', sans-serif" },
    { size: '17px', weight: '300', family: "'Noto Serif Devanagari', serif" },
  ];

  // Different animation patterns
  const animationPatterns = [
    { duration: 8, ease: "easeInOut" },     // Slow smooth
    { duration: 10, ease: "anticipate" },    // Very slow with anticipation
    { duration: 7, ease: "easeOut" },        // Medium slow
    { duration: 9, ease: [0.43, 0.13, 0.23, 0.96] } // Custom cubic bezier
  ];

  useEffect(() => {
    const img = new Image();
    img.src = "/1.png";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 200;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      const coords = [];

      // Adjust sampling density for more particles
      for (let y = 0; y < size; y += 4) {
        for (let x = 0; x < size; x += 4) {
          const index = (y * size + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 120) {
            coords.push({
              x: x - size / 2,
              y: y - size / 2
            });
          }
        }
      }

      // Create particles with different styles and animations
      const particlesData = coords.slice(0, 150).map((p, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 1200; // Increased distance for slower appearance
        
        // Select different styles based on index
        const fontStyle = fontStyles[i % fontStyles.length];
        const pattern = animationPatterns[i % animationPatterns.length];
        
        // Add random rotation for some mantras
        const rotation = i % 4 === 0 ? Math.random() * 10 - 5 : 0;
        
        // Vary the starting distance for layered effect
        const layerDistance = distance + (i % 3) * 200;

        return {
          id: i,
          text: mantras[i % mantras.length],
          startX: Math.cos(angle) * layerDistance,
          startY: Math.sin(angle) * layerDistance,
          targetX: p.x * 3.5, // Slightly spread out
          targetY: p.y * 3.5,
          fontSize: fontStyle.size,
          fontWeight: fontStyle.weight,
          fontFamily: fontStyle.family,
          duration: pattern.duration,
          ease: pattern.ease,
          rotation: rotation,
          delay: (i % 4) * 0.3, // Staggered start
          opacity: 0.7 + (i % 3) * 0.15 // Varied opacity
        };
      });

      setParticles(particlesData);
    };

    // Extended timeout for slower overall animation
    setTimeout(() => {
      navigate("/home");
    }, 12000); // Increased to 12 seconds

  }, []);

  return (
    <div className="intro">
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_100%)]"></div>
      
      {/* mantra particles with enhanced animations */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="mantra"
          style={{
            fontSize: p.fontSize,
            fontWeight: p.fontWeight,
            fontFamily: p.fontFamily,
            opacity: p.opacity,
            rotate: p.rotation,
            filter: `blur(${p.id % 5 === 0 ? '0.5px' : '0px'})` // Slight blur on some
          }}
          initial={{
            x: p.startX,
            y: p.startY,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x: p.targetX,
            y: p.targetY,
            opacity: [0, p.opacity, 0],
            scale: [0.5, 1.2, 0.8],
            rotate: [p.rotation * 2, 0, p.rotation]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: p.ease,
            times: [0, 0.6, 1],
            opacity: {
              duration: p.duration,
              times: [0, 0.3, 1]
            }
          }}
        >
          {p.text}
        </motion.div>
      ))}

      {/* real logo with enhanced animation */}
      <motion.img
        src="/1.png"
        className="logo"
        initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: ["blur(2px)", "blur(0px)", "blur(0px)"]
        }}
        transition={{
          delay: 7,
          duration: 2.5,
          ease: "easeOut"
        }}
      />

      {/* title with enhanced animation */}
      <motion.div
        className="title"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1,
          textShadow: [
            "0 0 0px rgba(255,111,0,0)",
            "0 0 20px rgba(255,111,0,0.5)",
            "0 0 0px rgba(255,111,0,0)"
          ]
        }}
        transition={{
          delay: 9,
          duration: 2,
          ease: "easeOut"
        }}
      >
        Bhajan Bank Vadtal
      </motion.div>
    </div>
  );
};

export default IntroScreen;