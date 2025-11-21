import { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import LotusDivider from "../Common/LotusDivider";
import { Listbox } from "@headlessui/react";
import { ChevronsUpDown } from "lucide-react";

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
  const { user, token, loading } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL ;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([{ task: "", points: 1, count: "" }]);
  const [todayWinner, setTodayWinner] = useState(null);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [taskCategories, setTaskCategories] = useState([]);

  useEffect(() => {
    const fetchTaskCategories = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/taskcategories`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTaskCategories(response.data);
      } catch (error) {
        console.error("Error fetching task categories:", error);
      }
    };

    fetchTaskCategories();
  }, [backend_url, token]);

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


  //handle tack change 
  const handleTaskChange = (index, field, value) => {
  const updated = tasks.map((t, i) => (i === index ? { ...t } : t));
    if (field === "count") {
      if (!/^\d*$/.test(value)) return;
      updated[index][field] = value === "" ? "" : parseInt(value, 10);
    } else {
      updated[index][field] = value;
    }
    if (field === "task" && value !== "other") {
      const selectedTask = taskCategories.find(
        (cat) =>
          cat.name === value ||
          cat.displayName === value ||
          value.includes(cat.name) ||
          value.includes(cat.displayName)
          
      );
      console.log("Task Categories:", value);
      console.log("Selected Task:", selectedTask);
      updated[index].points = selectedTask ? selectedTask.points : 0;
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

    if (!res.ok) {
      console.error("Fetch failed:", res.status);
      return;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error("Expected array but got:", data);
      return;
    }

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
    console.error("Error fetching data:", err);
  }
};



  useEffect(() => {
  if (!token) return; // Wait until token is ready

  fetchData(); // Initial fetch

  // Optional: periodic refresh (every 60 seconds instead of 1)
  const interval = setInterval(() => {
    fetchData();
  }, 60000);

  return () => clearInterval(interval);
}, [token]); // 👈 React runs this effect whenever token changes

const [checking, setChecking] = useState(true);

useEffect(() => {
  if (!loading) {
    if (!token) {
      navigate('/login', { replace: true }); // 👉 instant redirect
      return;
    }
    
    setChecking(false);
    fetchData(); // normal fetch
  }
}, [loading, token, navigate]);



if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading your data...</p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative">
        <Navbar />

        {/* Header Section */}
        <motion.div 
          className="pt-20 px-4 sm:px-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center gap-3 mb-6 text-center">
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-sans px-4">
              Bhajan Bank
            </h1>
            <p className="text-gray-600 text-base sm:text-lg font-light max-w-md px-4">
              Your daily bhajan recorded as divine offering
            </p>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
          </div>
        </motion.div>

        <div className="px-4 sm:px-6">
          <LotusDivider className="my-6 sm:my-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-6">
          {/* Left: Daily Seva Offering */}
          <motion.div
            className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 bg-orange-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 bg-orange-50 rounded-full opacity-70"></div>

            <div className="relative z-10">
              <div className=" mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">🙏</span>
                </div>
                <h2 className="text-xl text-center sm:text-2xl font-bold text-gray-900 mb-2">
                  Daily Seva Offering
                </h2>
                {user && (
                  <p className="text-gray-600 text-md lg:text-lg text-center">
                    Jay Swaminarayan <span className="text-orange-700">{user.name}!</span> Maharaj awaits your devotion today.
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <AnimatePresence>
                  {tasks.map((t, i) => (
                    <motion.div
                      key={i}
                      className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg sm:rounded-xl space-y-3 sm:space-y-4 relative shadow-sm hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                    >
                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(i)}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}

                                  

              {/* Category Select */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                  <ChevronsUpDown className="h-4 w-4 text-orange-500" />
                  Select Category
                </label>

                <div className="relative">
                  <select
                    value={t.category || ""}
                    onChange={(e) => handleTaskChange(i, "category", e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 
                      rounded-xl text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 
                      focus:border-transparent transition-all duration-200 text-sm sm:text-base hover:shadow-lg
                      cursor-pointer appearance-none"
                    required
                  >
                    <option value="">Select category of seva</option>
                    {[...new Set(taskCategories.map((cat) => cat.categoryType))].map((catType) => (
                      <option key={catType} value={catType}>
                        {catType}
                      </option>
                    ))}
                  </select>

                  {/* Dropdown icon */}
                  <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400 pointer-events-none" />
                </div>
              </div>

              {/* Task (Seva) Select */}
              <div>
                <label className="block text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                  <ChevronsUpDown className="h-4 w-4 text-orange-500" />
                  Type of Seva
                </label>

                <div className="relative">
                  <select
                    value={t.task || ""}
                    onChange={(e) => handleTaskChange(i, "task", e.target.value)}
                    className={`w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 
                      rounded-xl text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 
                      focus:border-transparent transition-all duration-200 text-sm sm:text-base hover:shadow-lg
                      cursor-pointer appearance-none ${!t.category ? "opacity-60 cursor-not-allowed" : ""}`}
                    required
                    disabled={!t.category}
                  >
                    <option value="">Select your devotional offering</option>
                    {taskCategories
                      .filter((cat) => cat.categoryType === t.category)
                      .map((cat) => (
                     <option key={cat._id} value={cat.displayName}>
                          {cat.name}
                        </option>
                      ))}
                    <option value="other">Other Seva</option>
                  </select>

                  {/* Dropdown icon */}
                  <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400 pointer-events-none" />
                </div>
              </div>



                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.task.includes("Mantra Japp") ? "Number of Japps" : "Count"}
                        </label>
                        <input
                          type="text"
                          value={t.count}
                          onChange={(e) => handleTaskChange(i, "count", e.target.value)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                          required
                        />
                        {t.count === "" && (
                          <p className="text-xs sm:text-sm text-red-500 mt-1">Please enter count</p>
                        )}
                      </div>

                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-700 font-medium text-center text-sm sm:text-base">
                        {t.task.includes("Mantra Japp")
                        ? `${t.count || 0} japps = ${(t.count || 0) * (t.points || 0)} punya`
                        : `Punya: ${t.count || 0} × ${t.points || 1} = ${Math.round((t.count || 0) * (t.points || 0))}`}
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
                  className="w-full py-3 sm:py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span className="text-lg sm:text-xl">+</span>
                  Add More Seva
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  Offer to Maharaj
                  <span className="text-lg sm:text-xl">🪔</span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right: Satsangi Seva Board */}
          <motion.div
            className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] opacity-30 rounded-xl sm:rounded-2xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">📿</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Satsangi Seva Board
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">Today's devotional contributions</p>
              </div>

              {/* Today's Winner */}
              {todayWinner && (
                <motion.div
                  className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                  variants={fadeUp}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <span className="text-amber-500 text-lg sm:text-xl">👑</span>
                    Today's Divine Champion
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <span className="font-medium text-gray-800 text-sm sm:text-base">{todayWinner.name}</span>
                    <span className="px-3 py-1 sm:px-4 sm:py-2 bg-amber-500 text-white rounded-full font-bold text-xs sm:text-sm">
                      {Math.round(todayWinner.points)} पुण्य
                    </span>
                  </div>
                </motion.div>
              )}  

              {/* Leaderboard */}
              {users.length > 0 ? (
                <motion.ul 
                  className="space-y-2 sm:space-y-3"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {users.map((u, i) => (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 border ${
                        i === 0
                          ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm"
                          : i === 1
                          ? "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200"
                          : i === 2
                          ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                          : "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200"
                      } hover:shadow-md hover:translate-x-1`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm ${
                          i === 0 ? "bg-amber-500 text-white" :
                          i === 1 ? "bg-orange-500 text-white" :
                          i === 2 ? "bg-amber-400 text-white" :
                          "bg-orange-500 text-white"
                        }`}>
                          {i + 1}
                        </div>
                        <span className={`font-medium text-sm sm:text-base ${
                          i === 0 ? "text-amber-700" :
                          i === 1 ? "text-orange-700" :
                          i === 2 ? "text-amber-700" :
                          "text-orange-700"
                        }`}>
                          {u.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">पुण्य</span>
                        <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded sm:rounded-lg font-bold text-xs sm:text-sm min-w-12 sm:min-w-16 text-center ${
                          i === 0 ? "bg-amber-500 text-white" :
                          i === 1 ? "bg-orange-500 text-white" :
                          i === 2 ? "bg-amber-400 text-white" :
                          "bg-orange-500 text-white"
                        }`}>
                          {Math.round(u.points.toFixed(0))}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div 
                  className="text-center py-8 sm:py-12"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🌼</div>
                  <p className="text-gray-600 text-base sm:text-lg mb-2">No seva offerings recorded yet</p>
                  <p className="text-gray-500 text-sm sm:text-base">Be the first to offer your devotion!</p>
                </motion.div>
              )}

              {/* Daily Inspiration */}
              <motion.div 
                className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <p className="text-gray-700 italic text-center mb-2 text-sm sm:text-base">
                  "{dailyQuote?.text || dailyQuotes[0].text}"
                </p>
                <p className="text-gray-600 text-xs sm:text-sm text-center">
                  – {dailyQuote?.author || dailyQuotes[0].author}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="text-center py-6 sm:py-8 px-4 sm:px-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="px-4 sm:px-6">
            <LotusDivider className="mb-4 sm:mb-6" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-2">श्री स्वामिनारायणाय नमः</p>
          <p className="text-xs text-gray-500">May your devotion blossom like a lotus in the divine light</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default Data;