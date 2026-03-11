import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const IntroScreen = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);

  const mantras = [
    "ॐ श्रीकृष्णाय नमः",
    "ॐ श्रीवासुदेवाय नमः",
    "ॐ श्रीनरनारायणाय नमः",
    "ॐ श्रीप्रभवे नमः",
    "ॐ श्रीभक्तिधर्मात्मजाय नमः",
    "ॐ श्रीअजन्मने नमः",
    "ॐ श्रीकृष्णनारायणाय नमः",
    "ॐ श्रीहरये नमः",
    "ॐ श्रीहरिकृष्णाय नमः",
    "ॐ श्रीघनश्यामाय नमः"
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
    { duration: 5, ease: "easeInOut" },
    { duration: 6, ease: "anticipate" },
    { duration: 5.5, ease: "easeOut" },
    { duration: 6, ease: [0.43, 0.13, 0.23, 0.96] }
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

      const particlesData = coords.slice(0, 150).map((p, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 1000;
        
        const fontStyle = fontStyles[i % fontStyles.length];
        const pattern = animationPatterns[i % animationPatterns.length];
        
        const rotation = i % 4 === 0 ? Math.random() * 10 - 5 : 0;
        const layerDistance = distance + (i % 3) * 150;

        return {
          id: i,
          text: mantras[i % mantras.length],
          startX: Math.cos(angle) * layerDistance,
          startY: Math.sin(angle) * layerDistance,
          targetX: p.x * 3,
          targetY: p.y * 3,
          fontSize: window.innerWidth < 768 ? '12px' : fontStyle.size,
          fontWeight: fontStyle.weight,
          fontFamily: fontStyle.family,
          duration: pattern.duration,
          ease: pattern.ease,
          rotation: rotation,
          delay: (i % 4) * 0.2,
          opacity: 0.8 + (i % 3) * 0.1
        };
      });

      setParticles(particlesData);
    };

    setTimeout(() => {
      navigate("/home");
    }, 9000); // 9 seconds total

  }, []);

  return (
    <div className="intro">
      {/* Light gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"></div>
      
      {/* Decorative pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] opacity-30"></div>
      
      {/* mantra particles - now stay visible longer */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="mantra"
          style={{
            fontSize: p.fontSize,
            fontWeight: p.fontWeight,
            fontFamily: p.fontFamily,
            rotate: p.rotation,
          }}
          initial={{
            x: p.startX,
            y: p.startY,
            opacity: 0,
            scale: 0.6
          }}
          animate={{
            x: p.targetX,
            y: p.targetY,
            opacity: [0, p.opacity, p.opacity, p.opacity, 0.5, 0], // Stay visible longer
            scale: [0.6, 1.1, 1, 1, 1, 0.7],
            rotate: [p.rotation * 2, 0, 0, 0, 0, p.rotation]
          }}
          transition={{
            duration: p.duration + 2, // Longer duration
            delay: p.delay,
            ease: p.ease,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1], // Adjusted timing
            opacity: {
              duration: p.duration + 2,
              times: [0, 0.15, 0.5, 0.7, 0.9, 1] // Maintain opacity through most of animation
            }
          }}
        >
          {p.text}
        </motion.div>
      ))}

      {/* logo with enhanced animation */}
      <motion.img
        src="/1.png"
        className="logo"
        alt="logo"
        initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          delay: 5,
          duration: 2,
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
        }}
        transition={{
          delay: 6.5,
          duration: 1.8,
          ease: "easeOut"
        }}
      >
        Bhajan Bank Vadtal
      </motion.div>
    </div>
  );
};

export default IntroScreen;