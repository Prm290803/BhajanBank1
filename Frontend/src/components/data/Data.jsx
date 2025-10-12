// import { useState, useEffect } from "react";
// import { useAuth } from "../../Auth/AuthContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "../Navbar/Navbar";
// // Divine Motifs
// import LotusDivider from "../Data/LotusDivider";


// // Motion Variants with devotional feel
// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };

// const glow = {
//   hidden: { opacity: 0, scale: 0.8 },
//   visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
// };

// function Data() {
//   const { user, token, logout } = useAuth();
//   const backend_url = import.meta.env.VITE_BACKENDURL || "http://localhost:5000";
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [tasks, setTasks] = useState([{ task: "", points: 1, count: "" }]);
//   const [todayWinner, setTodayWinner] = useState(null);
//   const [musicPlaying, setMusicPlaying] = useState(false);
//   const [dailyQuote, setDailyQuote] = useState(null);

//   // Divine tasks with Sanskrit names where appropriate
//   const taskPoints = {
//     "Vachnamrut (વચનામૃત)": 10,
//     "BhaktChintamani (ભક્તચિંતામણિ)": 10,
//     "Vandu Sahajanand (વંદુ સહજાનંદ)": 10,
//     "Janmangal Stotra/Namavali (જનમંગલ સ્તોત્ર/નામાવલિ)": 10,
//     "Parcha-Prakrn (પરચા-પ્રકરણ)": 10,
//     "Bhram-Mohurat-Pooja (બ્રહ્મમુહૂર્ત પૂજા)": 50,
//     "Mantra Japp (મંત્ર જપ)": 0.1,
//     "Kirtan Bhajan (કીર્તન ભજન)": 5,
//     "Satsang Participation (સત્સંગ સહભાગિતા)": 15,
//     "shikshapatri shlok Vanchan (શિક્ષાપત્રી શ્લોક વાંચન)": 5,
//     "Nitya Niyam (નિયમ-ચેષ્ટા)": 20,
//     "Harismruti (હરિસ્મૃતિ)": 10,
//     "Pradakshina (પ્રદક્ષિણા)" : 5,
//   };

//   const toggleMusic = () => {
//     setMusicPlaying(!musicPlaying);
//     // Implementation for playing temple bells/bhajan would go here
//   };

//   const handleTaskChange = (index, field, value) => {
//     const updated = [...tasks];
//     if (field === "count") {
//       if (!/^\d*$/.test(value)) return;
//       updated[index][field] = value === "" ? "" : parseInt(value, 10);
//     } else {
//       updated[index][field] = value;
//     }

//     if (field === "task" && value !== "other") {
//       updated[index].points = taskPoints[value] || 1;
//     }
//     setTasks(updated);
//   };

//   const addNewTask = () => {
//     setTasks([...tasks, { task: "", points: 1, count: "" }]);
//   };

//   const removeTask = (i) => {
//     setTasks(tasks.filter((_, idx) => idx !== i));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${backend_url}/api/tasks`, {
//         date: new Date(),
//         tasks,
//       });
//       setTasks([{ task: "", points: 1, count: "" }]);
//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };
// const dailyQuotes = [
//   {
//     text: "Regular bhajan is the key to eternal peace and divine bliss.",
//     author: "Shriji Maharaj"
//   },
//   {
//     text: "The mind that constantly remembers God becomes pure like water in the Ganges.",
//     author: "Gunatitanand Swami"
//   },
//   {
//     text: "Just as a lamp cannot burn without oil, the soul cannot shine without bhajan.",
//     author: "Swaminarayan Bhagwan"
//   },
//   {
//     text: "God's name is the boat that carries us across the ocean of worldly existence.",
//     author: "Nishkulanand Swami"
//   },
//   {
//     text: "જે મન ઈશ્વરને સતત યાદ કરે છે, તે ગંગાના જળ જેવું શુદ્ધ બની જાય છે.",
//     author: "ગુણતીતાનંદ સ્વામી"
//   },
//   {
//     text: "One who remembers God with love will never be forsaken.",
//     author: "Swaminarayan Bhagwan"
//   },
//   {
//     text: "He who worships with faith and devotion will be granted divine bliss.",
//     author: "Shriji Maharaj"
//   },
//   {
//     text: "Bhakti without dharma is like a lamp without light.",
//     author: "Gunatitanand Swami"
//   },
//   {
//     text: "The soul finds peace only in the remembrance of God.",
//     author: "Muktanand Swami"
//   },
//   {
//     text: "ભગવાનનું નામ એવાં છે કે તે જ મનોવાંછિત ફળ આપે છે.",
//     author: "મુક્તાનંદ સ્વામી"
//   },
//   {
//     text: "Whoever chants 'Swaminarayan' even once with faith will be liberated.",
//     author: "Swaminarayan Bhagwan"
//   },
//   {
//     text: "Bhajan is the food of the soul; without it, the soul remains weak.",
//     author: "Nishkulanand Swami"
//   },
//   {
//     text: "સત્સંગી જે રોજ ભજન કરે છે, તેનું જીવન દિવ્ય બની જાય છે.",
//     author: "ગુણતીતાનંદ સ્વામી"
//   }
// ];

// useEffect(() => {
//   // Get day of year to select quote (0-364)
//   const now = new Date();
//   const start = new Date(now.getFullYear(), 0, 0);
//   const diff = now - start;
//   const oneDay = 1000 * 60 * 60 * 24;
//   const dayOfYear = Math.floor(diff / oneDay);
  
//   // Select quote based on day of year
//   const quoteIndex = dayOfYear % dailyQuotes.length;
//   setDailyQuote(dailyQuotes[quoteIndex]);
// }, []);

//   const fetchData = async () => {
//     try {
//       const res = await fetch(`${backend_url}/api/tasks`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       const userMap = {};
//       data.forEach((entry) => {
//         const uName = entry.user?.name || "Anonymous";
//         if (!userMap[uName]) userMap[uName] = { name: uName, points: 0, count: 0 };
//         userMap[uName].points += entry.summary?.grandTotalPoints || 0;
//         userMap[uName].count += entry.summary?.totalCount || 0;
//       });
//       const sorted = Object.values(userMap).sort((a, b) => b.points - a.points);
//       setUsers(sorted);
//       setTodayWinner(sorted[0] || null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//   fetchData(); // fetch initially

//   const interval = setInterval(() => {
//     fetchData();
//   }, 1000); // every 1 second

//   return () => clearInterval(interval); // cleanup on unmount
// }, []);

//  useEffect(() => {
//     if (!token) {
//       navigate('/login');
//     } else {
//       fetchData();
//     }
//   }, [token, navigate]);

  
// // useEffect(() => {
// //   if (!token) {
// //     const storedToken = localStorage.getItem('authToken');
// //     if (storedToken) {
// //       // Token exists in storage but not context - reload properly
// //       window.location.reload();
// //     } else {
// //       navigate('/login');
// //     }
// //   } else {
// //     fetchData();
// //   }
// // }, [token, navigate]);

//   return (
//     <div className="min-h-screen   bg-[url('/Maharaj.jpg')] bg-cover bg-center  p-6">
//       {/* Divine Glow Effect */}
//       <div className="fixed inset-0 bg-radial-gradient from-yellow-100/30 via-transparent to-transparent  pointer-events-none"></div>
      
//       <div className="max-w-7xl mx-auto space-y-8 relative">
//         {/* Divine Presence */}
        

//   {/* Header */}
//         <Navbar />

// {/* Center Title Section (below navbar) */}
// <div className="pt-28 text-center px-6">
//   <h1 className="text-4xl md:text-5xl font-bold text-[#FF7722] font-serif">
//     <span className="text-gold-500">श्री</span> Bhajan Bank
//   </h1>
//   <p className="text-gray-200 italic text-base md:text-lg mt-2">
//     "Your daily bhajan recorded as divine offering"
//   </p>
// </div>

//         <LotusDivider className="my-8" />

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left: Seva Offering */}
//           <motion.div
//             className=" bg-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/30"
//             variants={fadeUp}
//             initial="hidden"
//             animate="visible"
//           >
//             {/* Divine light effect */}
            
//             <h2 className="text-2xl font-semibold text-[#FF9933] mb-4 flex items-center gap-2">
//               <span className="text-gold-500">🙏</span>
//               Daily Seva Offering
//             </h2>

//             {user && (
//               <p className="text-lg mb-6 text-[#800000] font-medium">
//                 Jay Swaminarayan {user.name} ! Maharaj awaits your devotion today. 🙏
//               </p>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <AnimatePresence>
//                 {tasks.map((t, i) => (
//                   <motion.div
//                     key={i}
//                     className="p-4 bg-white-100 bg-opacity-50 rounded-xl shadow-sm space-y-4 relative border"
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -15 }}
//                   >
//                     {tasks.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeTask(i)}
//                         className="absolute top-2 right-2 text-[#800000] hover:text-[#b33a3a]"
//                       >
//                         Remove
//                       </button>
//                     )}

//                     <div>
//                       <label className="block text-bhagwa-700 mb-1 font-medium">Type of Seva</label>
//                       <select
//                         value={t.task}
//                         onChange={(e) => handleTaskChange(i, "task", e.target.value)}
//                         className="w-full px-3 py-2 border border-gold-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933]"
//                         required
//                       >
//                         <option value="">Select your devotional offering</option>
//                         {Object.keys(taskPoints).map((task) => (
//                           <option key={task} value={task}>
//                             {task}
//                           </option>
//                         ))}
//                         <option value="other">Other Seva</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-bhagwa-700 mb-1 font-medium">
//                         {t.task.includes("Mantra Japp") ? "Number of Japps" : "Count (संख्या)"}
//                       </label>
//                       <input
//                         type="text"
//                         value={t.count}
//                         onChange={(e) => handleTaskChange(i, "count", e.target.value)}
//                         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933]"
//                         required
//                       />
//                       {t.count === "" && (
//                         <p className="text-sm text-red-500 mt-1">Please enter count</p>
//                       )}
//                     </div>

//                     <div className="bg-peacock-50 p-3 rounded-lg text-[#fffff] font-medium border border-peacock-100">
//                       {t.task.includes("Mantra Japp")
//                         ? `${t.count || 0} japps = ${Math.floor((t.count || 0) / 10)} punya`
//                         : `Punya: ${t.count || 0} × ${t.points} = ${(t.count || 0) * t.points}`}
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>

//               <button
//                 type="button"
//                 onClick={addNewTask}
//                 className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-peacock-600 flex items-center justify-center gap-2 transition-all"
//               >
//                 <span className="text-xl">+</span>
//                 Add More Seva
//               </button>

//               <button
//                 type="submit"
//                 className="w-full py-3 bg-[#FF7733] text-white rounded-lg hover:bg-[#FF9933] flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all hover:shadow-[#FF9933]/50"
//               >
//                 Offer to Maharaj
//                 <span className="text-xl">🪔</span>
//               </button>
//             </form>
//           </motion.div>

//           {/* Right: Satsangi Seva Board */}
//                <motion.div
//       className="relative bg-white/20 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
//       variants={fadeUp}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* Liquid glass highlights */}
//       <div className="absolute -top-32 -left-32 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
//       <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-orange-400 rounded-full blur-3xl opacity-20"></div>

//       {/* Heading */}
//       <h2 className="text-3xl font-bold text-bhagwa-800 mb-6 flex items-center gap-2 relative z-10">
//         <span className="text-yellow-500 text-2xl">📿</span>
//         Satsangi Seva Board
//       </h2>

//       {/* Today’s Winner */}
//       {todayWinner && (
//         <motion.div
//           className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-yellow-100/70 to-gold-50/50 border border-yellow-300 relative overflow-hidden shadow-lg"
//           variants={fadeUp}
//         >
//           <div className="absolute -top-10 -right-10 w-28 h-28 bg-yellow-200 rounded-full blur-2xl opacity-30"></div>
//           <h3 className="text-xl font-semibold text-bhagwa-800 flex items-center gap-2 relative z-10">
//             <span className="text-yellow-500 text-2xl">👑</span>
//             Today’s Divine Champion
//           </h3>
//           <p className="flex justify-between items-center mt-2 relative z-10">
//             <span className="font-medium text-bhagwa-700">{todayWinner.name}</span>
//             <span className="px-4 py-1 bg-bhagwa-100 text-bhagwa-800 rounded-full font-bold text-sm">
//               {todayWinner.points} पुण्य
//             </span>
//           </p>
//         </motion.div>
//       )}

//       {/* Leaderboard */}
//       {users.length > 0 ? (
//         <ul className="space-y-4 relative z-10">
//           {users.map((u, i) => (
//             <motion.li
//               key={i}
//               className={`flex justify-between items-center p-4 rounded-xl relative overflow-hidden backdrop-blur-md ${
//                 i === 0
//                   ? "bg-gradient-to-r from-gold-100 to-yellow-50 border border-gold-300 shadow-md"
//                   : "bg-saffron-50/80 border border-saffron-200"
//               }`}
//               initial={{ opacity: 0, x: -15 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: i * 0.1 }}
//             >
//               {i === 0 && (
//                 <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-300 rounded-full blur-xl opacity-30"></div>
//               )}

//               <div className="flex items-center gap-3">
//                 {i === 0 ? (
//                   <div className="relative">
//                     <span className="text-yellow-500 text-2xl">👑</span>
//                     <div className="absolute inset-0 rounded-full bg-yellow-300 animate-ping opacity-30"></div>
//                   </div>
//                 ) : (
//                   <span className="text-bhagwa-500 font-semibold">{i + 1}.</span>
//                 )}
//                 <span
//                   className={`${
//                     i === 0
//                       ? "text-[#FF9933] font-semibold"
//                       : "text-[#FF9933]"
//                   }`}
//                 >
//                   {u.name}
//                 </span>
//               </div>

//               <span
//                 className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                   i === 0
//                     ? "bg-yellow-100 text-bhagwa-800"
//                     : "bg-saffron-100 text-bhagwa-700"
//                 }`}
//               >
//                 {u.points.toFixed(0)} पुण्य
//               </span>
//             </motion.li>
//           ))}
//         </ul>
//       ) : (
//         <div className="text-center py-10 text-bhagwa-600 relative z-10">
//           <p className="text-lg">No seva offerings recorded yet</p>
//           <p className="mt-2 text-sm">Be the first to offer your devotion!</p>
//         </div>
//       )}

//       {/* Daily Inspiration */}
//       <div className="mt-10 p-5 bg-[#B3EDED]/70 backdrop-blur-lg rounded-xl border border-[#26BFBF] shadow-inner relative z-10">
//   <p className="text-[#003D3D] italic font-semibold text-center">
//     "{dailyQuote?.text || dailyQuotes[0].text}"
//     <br />– {dailyQuote?.author || dailyQuotes[0].author}
//   </p>
// </div>
//     </motion.div>
//     </div>

//         {/* Footer */}
//         <footer className="text-center text-[#FFFFFF] font-semibold text-sm mt-12">
//           <LotusDivider className="mb-4" />
//           <p>श्री स्वामिनारायणाय नमः</p>
//           <p>May your devotion blossom like a lotus in the divine light</p>
//         </footer>
//       </div>
//     </div>
//   );
// }

// export default Data;

import { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import LotusDivider from "../Common/LotusDivider";

// Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function Data() {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "http://localhost:5000";
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([{ task: "", points: 1, count: "" }]);
  const [todayWinner, setTodayWinner] = useState(null);
  const [dailyQuote, setDailyQuote] = useState(null);

  // Divine tasks with Sanskrit names where appropriate
  const taskPoints = {
    "Vachnamrut (વચનામૃત)": 10,
    "BhaktChintamani (ભક્તચિંતામણિ)": 10,
    "Vandu Sahajanand (વંદુ સહજાનંદ)": 10,
    "Janmangal Stotra/Namavali (જનમંગલ સ્તોત્ર/નામાવલિ)": 10,
    "Parcha-Prakrn (પરચા-પ્રકરણ)": 10,
    "Bhram-Mohurat-Pooja (બ્રહ્મમુહૂર્ત પૂજા)": 50,
    "Mantra Japp (મંત્ર જપ)": 0.1,
    "Kirtan Bhajan (કીર્તન ભજન)": 5,
    "Satsang Participation (સત્સંગ સહભાગિતા)": 15,
    "shikshapatri shlok Vanchan (શિક્ષાપત્રી શ્લોક વાંચન)": 5,
    "Nitya Niyam (નિયમ-ચેષ્ટા)": 20,
    "Harismruti (હરિસ્મૃતિ)": 10,
    "Pradakshina (પ્રદક્ષિણા)": 5,
  };

  const dailyQuotes = [
    {
      text: "Regular bhajan is the key to eternal peace and divine bliss.",
      author: "Shriji Maharaj"
    },
    {
      text: "The mind that constantly remembers God becomes pure like water in the Ganges.",
      author: "Gunatitanand Swami"
    },
    {
      text: "Just as a lamp cannot burn without oil, the soul cannot shine without bhajan.",
      author: "Swaminarayan Bhagwan"
    },
    {
      text: "God's name is the boat that carries us across the ocean of worldly existence.",
      author: "Nishkulanand Swami"
    },
    {
      text: "જે મન ઈશ્વરને સતત યાદ કરે છે, તે ગંગાના જળ જેવું શુદ્ધ બની જાય છે.",
      author: "ગુણતીતાનંદ સ્વામી"
    },
    {
      text: "One who remembers God with love will never be forsaken.",
      author: "Swaminarayan Bhagwan"
    },
    {
      text: "He who worships with faith and devotion will be granted divine bliss.",
      author: "Shriji Maharaj"
    },
    {
      text: "Bhakti without dharma is like a lamp without light.",
      author: "Gunatitanand Swami"
    },
    {
      text: "The soul finds peace only in the remembrance of God.",
      author: "Muktanand Swami"
    },
    {
      text: "ભગવાનનું નામ એવાં છે કે તે જ મનોવાંછિત ફળ આપે છે.",
      author: "મુક્તાનંદ સ્વામી"
    },
    {
      text: "Whoever chants 'Swaminarayan' even once with faith will be liberated.",
      author: "Swaminarayan Bhagwan"
    },
    {
      text: "Bhajan is the food of the soul; without it, the soul remains weak.",
      author: "Nishkulanand Swami"
    },
    {
      text: "સત્સંગી જે રોજ ભજન કરે છે, તેનું જીવન દિવ્ય બની જાય છે.",
      author: "ગુણતીતાનંદ સ્વામી"
    }
  ];

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const quoteIndex = dayOfYear % dailyQuotes.length;
    setDailyQuote(dailyQuotes[quoteIndex]);
  }, []);

  const handleTaskChange = (index, field, value) => {
    const updated = [...tasks];
    if (field === "count") {
      if (!/^\d*$/.test(value)) return;
      updated[index][field] = value === "" ? "" : parseInt(value, 10);
    } else {
      updated[index][field] = value;
    }

    if (field === "task" && value !== "other") {
      updated[index].points = taskPoints[value] || 1;
    }
    setTasks(updated);
  };

  const addNewTask = () => {
    setTasks([...tasks, { task: "", points: 1, count: "" }]);
  };

  const removeTask = (i) => {
    setTasks(tasks.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backend_url}/api/tasks`, {
        date: new Date(),
        tasks,
      });
      setTasks([{ task: "", points: 1, count: "" }]);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${backend_url}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const userMap = {};
      data.forEach((entry) => {
        const uName = entry.user?.name || "Anonymous";
        if (!userMap[uName]) userMap[uName] = { name: uName, points: 0, count: 0 };
        userMap[uName].points += entry.summary?.grandTotalPoints || 0;
        userMap[uName].count += entry.summary?.totalCount || 0;
      });
      const sorted = Object.values(userMap).sort((a, b) => b.points - a.points);
      setUsers(sorted);
      setTodayWinner(sorted[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative">
        <Navbar />

        {/* Header Section */}
        <motion.div 
          className="pt-24 text-center px-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-sans">
              Bhajan Bank
            </h1>
            <p className="text-gray-600 text-lg font-light max-w-md">
              Your daily bhajan recorded as divine offering
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
          </div>
        </motion.div>

        <LotusDivider className="my-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6">
          {/* Left: Daily Seva Offering */}
          <motion.div
            className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-50 rounded-full opacity-70"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🙏</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Daily Seva Offering
                </h2>
                {user && (
                  <p className="text-gray-600">
                    Jay Swaminarayan {user.name}! Maharaj awaits your devotion today.
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {tasks.map((t, i) => (
                    <motion.div
                      key={i}
                      className="p-6 bg-white border border-gray-200 rounded-xl space-y-4 relative shadow-sm hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                    >
                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(i)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type of Seva</label>
                        <select
                          value={t.task}
                          onChange={(e) => handleTaskChange(i, "task", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value="">Select your devotional offering</option>
                          {Object.keys(taskPoints).map((task) => (
                            <option key={task} value={task}>
                              {task}
                            </option>
                          ))}
                          <option value="other">Other Seva</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.task.includes("Mantra Japp") ? "Number of Japps" : "Count"}
                        </label>
                        <input
                          type="text"
                          value={t.count}
                          onChange={(e) => handleTaskChange(i, "count", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                        {t.count === "" && (
                          <p className="text-sm text-red-500 mt-1">Please enter count</p>
                        )}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-700 font-medium text-center">
                          {t.task.includes("Mantra Japp")
                            ? `${t.count || 0} japps = ${Math.floor((t.count || 0) / 10)} punya`
                            : `Punya: ${t.count || 0} × ${t.points} = ${(t.count || 0) * t.points}`}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={addNewTask}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">+</span>
                  Add More Seva
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  Offer to Maharaj
                  <span className="text-xl">🪔</span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right: Satsangi Seva Board */}
          <motion.div
            className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] opacity-30 rounded-2xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📿</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Satsangi Seva Board
                </h2>
                <p className="text-gray-600">Today's devotional contributions</p>
              </div>

              {/* Today's Winner */}
              {todayWinner && (
                <motion.div
                  className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                  variants={fadeUp}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-amber-500 text-xl">👑</span>
                    Today's Divine Champion
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{todayWinner.name}</span>
                    <span className="px-4 py-2 bg-amber-500 text-white rounded-full font-bold text-sm">
                      {todayWinner.points} पुण्य
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Leaderboard */}
              {users.length > 0 ? (
                <motion.ul 
                  className="space-y-3"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {users.map((u, i) => (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${
                        i === 0
                          ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm"
                          : i === 1
                          ? "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200"
                          : i === 2
                          ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                          : "bg-white border border-gray-100"
                      } hover:shadow-md hover:translate-x-1`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          i === 0 ? "bg-amber-500 text-white" :
                          i === 1 ? "bg-orange-500 text-white" :
                          i === 2 ? "bg-amber-400 text-white" :
                          "bg-gray-200 text-gray-600"
                        }`}>
                          {i + 1}
                        </div>
                        <span className={`font-medium ${
                          i === 0 ? "text-amber-700" :
                          i === 1 ? "text-orange-700" :
                          i === 2 ? "text-amber-700" :
                          "text-gray-700"
                        }`}>
                          {u.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">पुण्य</span>
                        <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
                          i === 0 ? "bg-amber-500 text-white" :
                          i === 1 ? "bg-orange-500 text-white" :
                          i === 2 ? "bg-amber-400 text-white" :
                          "bg-gray-500 text-white"
                        }`}>
                          {u.points.toFixed(0)}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="text-4xl mb-4">🌼</div>
                  <p className="text-gray-600 text-lg mb-2">No seva offerings recorded yet</p>
                  <p className="text-gray-500">Be the first to offer your devotion!</p>
                </motion.div>
              )}

              {/* Daily Inspiration */}
              <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <p className="text-gray-700 italic text-center mb-2">
                  "{dailyQuote?.text || dailyQuotes[0].text}"
                </p>
                <p className="text-gray-600 text-sm text-center">
                  – {dailyQuote?.author || dailyQuotes[0].author}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="text-center py-8 px-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <LotusDivider className="mb-6" />
          <p className="text-sm font-semibold text-gray-700 mb-2">श्री स्वामिनारायणाय नमः</p>
          <p className="text-xs text-gray-500">May your devotion blossom like a lotus in the divine light</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default Data;