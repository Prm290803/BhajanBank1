import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LotusDivider from './data/LotusDivider';

function Home() {
  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{ 
        backgroundImage: "url('/temple2.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Divine overlay - saffron with 10% opacity */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(255, 153, 51, 0.06)" }} // #FF9933 with 10% opacity
      ></div>
      
      <div className="relative z-10 text-center w-full max-w-2xl px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Animated welcome text */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-serif text-center"
            style={{ color: "#E56210" }} // Dark saffron/bhagwa
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ color: "#FFD700" }}>श्री</span> Welcome to Bhajan Bank
          </motion.h1>

          <LotusDivider className="my-6 w-full max-w-xs" />

          <motion.p 
            className="text-lg sm:text-xl mb-8 italic text-center"
            style={{ color: "#CC4D00" }} // Medium saffron/bhagwa
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            "Track your spiritual journey with divine grace"
          </motion.p>

          {/* Centered button container */}
          <div className="w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <Link to="/data" className="inline-block">
                <button 
                  className="text-lg font-medium py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{
                    background: "linear-gradient(to right, #FF7722, #E56210)", // Saffron gradient
                    color: "#FFFFFF", // White text
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, #E56210, #CC4D00)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, #FF7722, #E56210)";
                  }}
                >
                  <span>Enter Divine Portal</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Footer blessing */}
          <motion.div 
            className="mt-12 text-sm w-full text-center"
            style={{ color: "#FF9933" }} // Light saffron
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p>श्री स्वामिनारायणाय नमः</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Home;