import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
const IntroScreen = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    // Handle window resize for responsive subtitle
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    const PARTICLE_COUNT = windowWidth < 768 ? 25 : 50;
    
    const img = new Image();
    img.src = "/1.png";

    img.onload = () => {
      requestAnimationFrame(() => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 100;
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        const coords = [];
        const step = 6;
        
        for (let y = 0; y < size; y += step) {
          for (let x = 0; x < size; x += step) {
            const index = (y * size + x) * 4;
            const alpha = data[index + 3];
            
            if (alpha > 200) {
              coords.push({ x: x - size / 2, y: y - size / 2 });
            }
          }
        }

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

        const particlesData = coords
          .sort(() => Math.random() - 0.5)
          .slice(0, PARTICLE_COUNT)
          .map((p, i) => {
            const angle = (i * (Math.PI * 2)) / PARTICLE_COUNT;
            const distance = 800;
            
            return {
              id: i,
              text: mantras[i % mantras.length],
              startX: Math.cos(angle) * distance,
              startY: Math.sin(angle) * distance,
              targetX: p.x * 2.5,
              targetY: p.y * 2.5,
              delay: (i % 5) * 0.1,
              opacity: 0.9,
              animationConfig: {
                duration: 4 + (i % 3),
                ease: [0.43, 0.13, 0.23, 0.96]
              }
            };
          });

        setParticles(particlesData);
      });
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        navigate("/home");
      });
    }, 7000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate, windowWidth]);

  return (
    <div className="intro">
      <div className="fixed inset-0 bg-amber-50"></div>
     <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_100%)]"></div>
    
      
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="mantra"
          style={{
            fontSize: windowWidth < 768 ? '12px' : `${12 + (p.id % 4)}px`,
            fontWeight: 400,
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            willChange: 'transform',
          }}
          initial={{
            x: p.startX,
            y: p.startY,
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            x: p.targetX,
            y: p.targetY,
            opacity: [0, p.opacity, p.opacity, 0.5, 0],
            scale: [0.8, 1.1, 1, 1, 0.8]
          }}
          transition={{
            duration: p.animationConfig.duration,
            delay: p.delay,
            ease: p.animationConfig.ease,
            opacity: {
              duration: p.animationConfig.duration,
              times: [0, 0.2, 0.6, 0.9, 1]
            }
          }}
        >
          {p.text}
        </motion.div>
      ))}

      <motion.img
        src="/1.png"
        className="logo"
        alt="logo"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 4.5,
          duration: 1.5,
          ease: "easeOut"
        }}
        loading="eager"
      />

      <motion.div
        className="title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 5.5,
          duration: 1.2,
          ease: "easeOut"
        }}
      >
        Bhajan Bank Vadtal
      </motion.div>
      
      {/* Optimized Subtitle with proper responsive sizing */}
      <motion.div
        className="subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 6,
          duration: 1,
          ease: "easeOut"
        }}
      >
        {windowWidth < 480 ? "તમારી ભક્તિ, ડિજિટલ ડાયરીમાં!" : "તમારી ભક્તિ, હવે ડિજિટલ ડાયરીમાં!"}
      </motion.div>
    </div>
  );
};

export default IntroScreen;