import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import LotusDivider from "../Common/LotusDivider";
import { ChevronsUpDown, Check, Sparkles, Plus, Trash2, Trophy, Medal, Award } from "lucide-react";

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
  const backend_url = import.meta.env.VITE_BACKENDURL;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([{ task: "", points: 1, count: "", category: "" }]);
  const [todayWinner, setTodayWinner] = useState(null);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [taskCategories, setTaskCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showTaskList, setShowTaskList] = useState({});
  
  // Group tasks by category for easier access
  const [tasksByCategory, setTasksByCategory] = useState({});

  const dailyQuotes = [
    {
      text: "નિયમિત ભજન એ શાશ્વત શાંતિ અને દિવ્ય આનંદની ચાવી છે.",
      author: "શ્રીજી મહારાજ"
    },
    {
      text: "જે મન ઈશ્વરને સતત યાદ કરે છે, તે ગંગાના જળ જેવું શુદ્ધ બની જાય છે.",
      author: "ગુણતીતાનંદ સ્વામી"
    },
    {
      text: "જેમ દીવો તેલ વગર બળી શકતો નથી, તેમ આત્મા ભજન વગર ચમકી શકતો નથી.",
      author: "સ્વામિનારાયણ ભગવાન"
    },
    {
      text: "ભગવાનનું નામ એ હોડી છે જે આપણને સંસાર સાગર પાર કરાવે છે.",
      author: "નિષ્કુળાનંદ સ્વામી"
    },
    {
      text: "ભગવાનનું નામ એવાં છે કે તે જ મનોવાંછિત ફળ આપે છે.",
      author: "મુક્તાનંદ સ્વામી"
    },
    {
      text: "જે પ્રેમથી ભગવાનને યાદ કરે છે, તે ક્યારેય ત્યજાતો નથી.",
      author: "સ્વામિનારાયણ ભગવાન"
    },
    {
      text: "શ્રદ્ધા અને ભક્તિથી પૂજા કરનારને દિવ્ય આનંદ પ્રાપ્ત થાય છે.",
      author: "શ્રીજી મહારાજ"
    },
    {
      text: "ધર્મ વિનાની ભક્તિ એ દીવા વિનાના દીપક જેવી છે.",
      author: "ગુણતીતાનંદ સ્વામી"
    },
    {
      text: "આત્માને શાંતિ ફક્ત ભગવાનના સ્મરણમાં જ મળે છે.",
      author: "મુક્તાનંદ સ્વામી"
    },
    {
      text: "જે કોઈ શ્રદ્ધાપૂર્વક 'સ્વામિનારાયણ' નો જાપ કરે છે, તે મુક્ત થાય છે.",
      author: "સ્વામિનારાયણ ભગવાન"
    },
    {
      text: "ભજન એ આત્માનો આહાર છે; તેના વગર આત્મા નબળો રહે છે.",
      author: "નિષ્કુળાનંદ સ્વામી"
    },
    {
      text: "સત્સંગી જે રોજ ભજન કરે છે, તેનું જીવન દિવ્ય બની જાય છે.",
      author: "ગુણતીતાનંદ સ્વામી"
    }
  ];

  useEffect(() => {
    const fetchTaskCategories = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/taskcategories`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTaskCategories(response.data);
        
        // Group tasks by category for easier access
        const grouped = {};
        response.data.forEach(cat => {
          if (!grouped[cat.categoryType]) {
            grouped[cat.categoryType] = [];
          }
          grouped[cat.categoryType].push(cat);
        });
        setTasksByCategory(grouped);
        
      } catch (error) {
        console.error("Error fetching task categories:", error);
      }
    };

    if (token) {
      fetchTaskCategories();
    }
  }, [backend_url, token]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const quoteIndex = dayOfYear % dailyQuotes.length;
    setDailyQuote(dailyQuotes[quoteIndex]);
  }, []);

  // Handle category selection with automatic task suggestion
  const handleCategorySelect = (index, category) => {
    const updated = tasks.map((t, i) => (i === index ? { ...t, category: category, task: "", points: 1 } : t));
    setTasks(updated);
    setShowTaskList({ ...showTaskList, [index]: true });
    
    // Auto-scroll to task list for better UX
    setTimeout(() => {
      const taskListElement = document.getElementById(`task-list-${index}`);
      if (taskListElement) {
        taskListElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Handle task selection with one click
  const handleTaskSelect = (index, task) => {
    const updated = tasks.map((t, i) => (i === index ? { 
      ...t, 
      task: task.name,
      points: task.points,
      category: t.category
    } : t));
    setTasks(updated);
    setShowTaskList({ ...showTaskList, [index]: false });
    
    // Auto-focus on count input after task selection
    setTimeout(() => {
      const countInput = document.getElementById(`count-input-${index}`);
      if (countInput) {
        countInput.focus();
      }
    }, 100);
  };

  const handleTaskChange = (index, field, value) => {
    const updated = tasks.map((t, i) => (i === index ? { ...t } : t));
    
    if (field === "count") {
      if (!/^\d*$/.test(value)) return;
      updated[index][field] = value === "" ? "" : parseInt(value, 10);
    } else if (field === "task") {
      updated[index][field] = value;
      
      if (value !== "other" && value !== "") {
        const selectedTask = taskCategories.find(
          (cat) => cat.categoryType === updated[index].category && 
                   (cat.name === value || cat.displayName === value)
        );
        
        if (selectedTask) {
          updated[index].points = selectedTask.points;
        } else {
          updated[index].points = 1;
        }
      }
    }
    
    setTasks(updated);
  };

  const addNewTask = () => {
    setTasks([...tasks, { task: "", points: 1, count: "", category: "" }]);
    setShowTaskList({});
  };

  const removeTask = (i) => {
    setTasks(tasks.filter((_, idx) => idx !== i));
    const newShowTaskList = { ...showTaskList };
    delete newShowTaskList[i];
    setShowTaskList(newShowTaskList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const invalidTasks = tasks.some(t => !t.category || (!t.task && t.task !== "other") || !t.count);
    if (invalidTasks) {
      alert("કૃપા કરીને બધી સેવા વિગતો ભરો | Please fill all seva details");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${backend_url}/api/tasks`, {
        date: new Date(),
        tasks,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks([{ task: "", points: 1, count: "", category: "" }]);
      setShowTaskList({});
      fetchData();
      
      alert("🙏 આપની સેવા સ્વીકાર કરી લેવામાં આવી | Your seva has been offered successfully");

    } catch (err) {
      console.error(err);
      alert("Error submitting seva. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${backend_url}/api/leaderboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("Leaderboard fetch failed:", res.status);
        return;
      }

      const data = await res.json();
      // Limit to top 10 users only
      const top10Users = data.slice(0, 10);
      setUsers(top10Users);
      setTodayWinner(top10Users[0] || null);

    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchData();
  }, [loading, token, navigate]);

  // Function to get medal icon based on rank
  const getMedalIcon = (rank) => {
    switch(rank) {
      case 0:
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
      case 2:
        return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">લોડ થઈ રહ્યું છે... | Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
      
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative px-4 sm:px-6 lg:px-8">
        <Navbar />

        {/* Header Section */}
        <motion.div 
          className="pt-16 sm:pt-20"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-center">
            <div className="w-10 sm:w-12 md:w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-sans px-4">
           Bhajan Bank
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light max-w-md px-4">
              તમારી દૈનિક ભજન સેવા | Your daily bhajan offering
            </p>
            <div className="w-10 sm:w-12 md:w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
          </div>
        </motion.div>

        <div className="px-2 sm:px-4">
          <LotusDivider className="my-4 sm:my-6 md:my-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Daily Seva Offering */}
          <motion.div
            className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="relative z-10">
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                  <span className="text-xl sm:text-2xl">🙏</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 text-center">
                   Daily Seva Offering
                </h2>
                
                {user && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center mt-2">
                    જય સ્વામિનારાયણ <span className="text-orange-700 font-medium">{user.name}!</span>
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                <AnimatePresence>
                  {tasks.map((t, i) => (
                    <motion.div
                      key={i}
                      className="p-3 sm:p-4 md:p-5 lg:p-6 bg-white border border-gray-200 rounded-lg sm:rounded-xl space-y-3 sm:space-y-4 relative shadow-sm hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                    >
                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(i)}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 z-10"
                          aria-label="Remove task"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}

                      {/* Step 1: Category Selection - Responsive grid */}
                      <div>
                        <label className="block text-sm sm:text-base font-semibold text-orange-700 mb-2 sm:mb-3">
                          📿 1. શ્રેણી પસંદ કરો | Select Category
                        </label>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                          {[...new Set(taskCategories.map((cat) => cat.categoryType))].map((catType) => (
                            <button
                              key={catType}
                              type="button"
                              onClick={() => handleCategorySelect(i, catType)}
                              className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-200 ${
                                t.category === catType
                                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105"
                                  : "bg-gradient-to-r from-orange-50 to-orange-100 text-gray-700 hover:from-orange-100 hover:to-orange-200 border border-orange-200"
                              }`}
                            >
                              <span className="block text-center">{catType}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Step 2: Task Selection - Automatic popup when category selected */}
                      {t.category && !t.task && showTaskList[i] && tasksByCategory[t.category] && (
                        <motion.div
                          id={`task-list-${i}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-blue-200"
                        >
                          <label className="block text-sm sm:text-base font-semibold text-blue-700 mb-2 sm:mb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                            ✨ 2. સેવા પસંદ કરો | Select Seva
                          </label>
                          
                          <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                            {tasksByCategory[t.category].map((task) => (
                              <button
                                key={task._id}
                                type="button"
                                onClick={() => handleTaskSelect(i, task)}
                                className="w-full text-left p-2 sm:p-3 bg-white rounded-lg hover:bg-orange-50 transition-all duration-200 border border-gray-200 hover:border-orange-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                              >
                                <span className="font-medium text-sm sm:text-base text-gray-800">{task.name}</span>
                                <span className="text-xs sm:text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                  {task.points} પુણ્ય
                                </span>
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => handleTaskSelect(i, { name: "અન્ય સેવા | Other Seva", points: 1 })}
                              className="w-full text-left p-2 sm:p-3 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                            >
                              <span className="font-medium text-sm sm:text-base text-gray-600">અન્ય સેવા | Other Seva</span>
                              <span className="text-xs sm:text-sm text-gray-500">Custom</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Selected Task Display */}
                      {t.task && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-green-50 p-2.5 sm:p-3 rounded-lg border border-green-200"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="flex-1">
                              <span className="text-xs sm:text-sm text-green-700">✓ પસંદ કરેલ સેવા | Selected Seva:</span>
                              <p className="font-semibold text-sm sm:text-base text-gray-800 mt-1">{t.task}</p>
                            </div>
                            <span className="text-sm sm:text-base font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                              {t.points} પુણ્ય
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Count Input - Auto-focused after task selection */}
                      {t.task && (
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                            🔢 3. સંખ્યા દાખલ કરો | Enter Count
                          </label>
                          <input
                            id={`count-input-${i}`}
                            type="text"
                            value={t.count}
                            onChange={(e) => handleTaskChange(i, "count", e.target.value)}
                            placeholder={t.task.includes("Mantra") ? "જપની સંખ્યા | Number of Japps" : "સંખ્યા | Count"}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            required
                            autoFocus={t.task !== ""}
                          />
                          {t.count === "" && (
                            <p className="text-xs text-red-500 mt-1">કૃપા કરીને સંખ્યા દાખલ કરો | Please enter count</p>
                          )}
                        </div>
                      )}

                      {/* Points Calculation */}
                      {t.task && t.count && (
                        <div className="bg-blue-50 p-2.5 sm:p-3 rounded-lg border border-blue-200">
                          <p className="text-blue-700 font-bold text-center text-sm sm:text-base">
                            કુલ પુણ્ય | Total Punya: {Math.round((t.count || 0) * (t.points || 0))} ✨
                          </p>
                        </div>
                      )}
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
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  વધુ સેવા ઉમેરો | Add More Seva
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white inline-block mr-2"></div>
                      અર્પણ કરી રહ્યા છે... | Offering...
                    </>
                  ) : (
                    "મહારાજને અર્પણ કરો | Offer to Maharaj 🪔"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right: Satsangi Seva Board - Top 10 Users Only */}
          <motion.div
            className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] opacity-30 rounded-xl sm:rounded-2xl"></div>

            <div className="relative h-full z-10">
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                  <span className="text-xl sm:text-2xl">📿</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Satsangi Seva Board
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">સત્સંગી સેવા બોર્ડ</p>
                <p className="text-xs text-gray-500 mt-1">Top 10 Devotees</p>
              </div>

              {todayWinner && (
                <motion.div
                  className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                  variants={fadeUp}
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    Today's Divine Champion
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="font-medium text-sm sm:text-base text-gray-800 break-all">{todayWinner.name}</span>
                    <span className="px-3 py-1 sm:px-4 sm:py-2 bg-amber-500 text-white rounded-full font-bold text-xs sm:text-sm text-center">
                      {Math.round(todayWinner.points)} પુણ્ય
                    </span>
                  </div>
                </motion.div>
              )}  

              {/* Leaderboard - Top 10 Users Only */}
              {users.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-3 sm:mb-4 px-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Rank</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Devotee</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">પુણ્ય | Punya</span>
                  </div>
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
                        className={`flex items-center justify-between p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-300 border ${
                          i === 0
                            ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg"
                            : i === 1
                            ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                            : i === 2
                            ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                            : "bg-white hover:bg-orange-50 border-gray-200"
                        } hover:shadow-md hover:translate-x-1`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
                            {i === 0 && <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />}
                            {i === 1 && <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />}
                            {i === 2 && <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />}
                            {i > 2 && (
                              <div className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold text-xs sm:text-sm ${
                                i === 0 ? "bg-amber-500 text-white" :
                                i === 1 ? "bg-gray-400 text-white" :
                                i === 2 ? "bg-amber-400 text-white" :
                                "bg-orange-200 text-orange-700"
                              }`}>
                                {i + 1}
                              </div>
                            )}
                          </div>
                          <span className={`font-medium text-xs sm:text-sm md:text-base truncate ${
                            i === 0 ? "text-amber-700 font-bold" :
                            i === 1 ? "text-gray-700" :
                            i === 2 ? "text-amber-700" :
                            "text-gray-700"
                          }`}>
                            {u.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <span className="px-2 py-1 rounded sm:rounded-lg font-bold text-xs sm:text-sm md:text-base min-w-[50px] sm:min-w-[60px] md:min-w-[70px] text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                            {Math.round(u.points)}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  {/* Show message if there are more than 10 users */}
                  {users.length === 10 && (
                    <p className="text-center text-xs text-gray-500 mt-4">
                     Top 10 devotees are shown
                    </p>
                  )}
                </>
              ) : (
                <motion.div 
                  className="text-center py-6 sm:py-8 md:py-12"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4">🌼</div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-1 sm:mb-2">હજુ સુધી કોઈ સેવા નોંધાઈ નથી</p>
                  <p className="text-xs sm:text-sm text-gray-500">No seva offerings recorded yet</p>
                  <p className="text-xs text-gray-400 mt-2">પ્રથમ વ્યક્તિ બનો! | Be the first!</p>
                </motion.div>
              )}

              {/* Daily Inspiration */}
              <motion.div 
                className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <p className="text-gray-700 italic text-center mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                  "{dailyQuote?.text || dailyQuotes[0].text}"
                </p>
                <p className="text-gray-600 text-[10px] sm:text-xs text-center">
                  – {dailyQuote?.author || dailyQuotes[0].author}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="text-center py-4 sm:py-6 md:py-8 px-4 sm:px-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="px-2 sm:px-4">
            <LotusDivider className="mb-3 sm:mb-4 md:mb-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">શ્રી સ્વામિનારાયણાય નમઃ</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">May your devotion blossom like a lotus in the divine light</p>
          <p className="text-[10px] sm:text-xs text-gray-400">
            Developed by{' '}
            <a 
              href="https://buildcrew.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Build Crew
            </a>
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default Data;