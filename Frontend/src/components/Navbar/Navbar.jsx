// import React, { useState } from "react";
// import { useAuth } from '../../Auth/AuthContext';
// import { Link, useLocation } from "react-router-dom";

// const Navbar = () => {
//   const { logout, user } = useAuth();
//   const location = useLocation();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const navigation = [
//     { name: "My Profile", href: "/profile", current: location.pathname === "/profile" },
//     { name: "Tasks", href: "/data", current: location.pathname === "/data" },
   
//     { name: "Family Dashboard", href: "/family-dashboard", current: location.pathname === "/family-dashboard" },
   
//   ];

//   const handleLogout = () => {
//     logout();
//     setIsMenuOpen(false);
//   };

//   return (
//     <nav className="max-w-screen w-full bg-white/10 backdrop-blur shadow-sm fixed top-0 left-0 right-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo and Brand */}
//           <div className="flex items-center space-x-3">
//             <div className="flex-shrink-0">
//               <img
//                 src="/1.png"
//                 alt="Bhajan Bank Logo"
//                 className="w-10 h-10  "
//               />
//             </div>
//             <div className="hidden sm:block">
//               <span className="text-2xl font-bold text-orange-600 font-serif">
//                 Bhajan Bank
//               </span>
//               {user && (
//                 <p className="text-xs text-gray-500 mt-[-2px]">
//                   Welcome, {user.name}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                     item.current
//                       ? "text-orange-700  border-orange-500"
//                       : "text-gray-600 hover:text-orange-600"
//                   }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Right Section - Desktop */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user?.family && (
//               <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm border border-orange-200">
//                 {user.family.name}
//               </div>
//             )}
//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-4 h-4"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
//                 />
//               </svg>
//               <span className="text-sm">Logout</span>
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center space-x-2">
//             {user?.family && (
//               <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs border border-orange-200">
//                 {user.family.name}
//               </div>
//             )}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
//             >
//               <svg
//                 className="h-6 w-6"
//                 stroke="currentColor"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 {isMenuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white border-t border-orange-100 shadow-lg">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 onClick={() => setIsMenuOpen(false)}
//                 className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
//                   item.current
//                     ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
//                     : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//             ))}
//             <div className="border-t border-gray-200 pt-2">
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
//                   />
//                 </svg>
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { useAuth } from '../../Auth/AuthContext';
import { Link, useNavigate, useLocation } from "react-router-dom";

import { motion } from "framer-motion";

const Navbar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 const navigate = useNavigate();
  const navigation = [
    { name: "My Profile", href: "/profile", current: location.pathname === "/profile", icon: "👤" },
    { name: "Tasks", href: "/data", current: location.pathname === "/data", icon: "📝" },
    { name: "Family Dashboard", href: "/family-dashboard", current: location.pathname === "/family-dashboard", icon: "🏠" },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex-shrink-0">
              <img
                src="/1.png"
                alt="Bhajan Bank Logo"
                className="w-10 h-10 rounded-lg"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-gray-900 font-sans">
                Bhajan Bank
              </span>
              {user && (
                <p className="text-xs text-gray-500 mt-[-2px]">
                  Welcome, {user.name}
                </p>
              )}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    item.current
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user?.family && (
                  <div className="flex items-center gap-2">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 px-4 py-2 rounded-full text-sm border border-orange-200 font-medium flex items-center gap-1"
                      onClick={() => navigate("/family")}

                    >
                      👨‍👩‍👧‍👦 {user.family.name}
                    </motion.div>
                  </div>
                )}

                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg"
                >
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {user?.family && (
              <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs border border-orange-200">
                {user.family.name}
              </div>
            )}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-all duration-200"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  item.current
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full text-left px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center w-full text-left px-3 py-3 rounded-xl text-base font-medium text-green-600 hover:bg-green-50 transition-all duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
