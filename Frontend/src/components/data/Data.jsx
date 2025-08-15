import { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Divine Motifs
import LotusDivider from "./LotusDivider";


// Motion Variants with devotional feel
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const glow = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

function Data() {
  const { user, token, logout } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "http://localhost:5000";
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([{ task: "", points: 1, count: "" }]);
  const [todayWinner, setTodayWinner] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Divine tasks with Sanskrit names where appropriate
  const taskPoints = {
    "Vachnamrut (વચનામૃત)": 10,
    "BhaktChintamani (ભક્તચિંતામણિ)": 10,
    "Vandu Sahajanand (વંદુ સહજાનંદ)": 10,
    "Janmangal Stotra/Namavali (જન્માંગળ સ્તોત્ર/નામાવલિ)": 10,
    "Parcha-Prakrn (પરચા-પ્રકરણ)": 10,
    "Bhram-Mohurat-Pooja (બ્રહ્મમુહૂર્ત પૂજા)": 50,
    "Mantra Japp (મંત્ર જપ)": 0.1,
    "Kirtan Bhajan (કીર્તન ભજન)": 5,
    "Satsang Participation (સત્સંગ સહભાગિતા)": 15,
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
    // Implementation for playing temple bells/bhajan would go here
  };

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
    if (!token) navigate("/login");
    else fetchData();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-saffron-50 bg-opacity-20 bg-[url('./assets/temple-bg-pattern.svg')] bg-repeat p-6">
      {/* Divine Glow Effect */}
      <div className="fixed inset-0 bg-radial-gradient from-yellow-100/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Divine Presence */}
        <SwaminarayanIcon className="absolute -top-10 -right-10 opacity-10 w-64 h-64" />

        {/* Header */}
        <header className="flex justify-between items-center relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-bhagwa-700 font-serif">
              <span className="text-gold-500">श्री</span> Bhajan Bank
            </h1>
            <p className="text-gray-600 italic">"Your daily bhajan recorded as divine offering"</p>
          </div>
          <div className="flex gap-4">
          
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-maroon-700 flex items-center gap-2"
            >
              <span>Logout</span>
            </button>
          </div>
        </header>

        <LotusDivider className="my-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Seva Offering */}
          <motion.div
            className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg border border-gold-200 relative overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Divine light effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-100 rounded-full filter blur-3xl opacity-30"></div>
            
            <h2 className="text-2xl font-semibold text-bhagwa-800 mb-4 flex items-center gap-2">
              <span className="text-gold-500">🪔</span>
              Daily Seva Offering
            </h2>

            {user && (
              <p className="text-lg mb-6 text-maroon-600 font-medium">
                Hari Om {user.name}! Maharaj awaits your devotion today. 🙏
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {tasks.map((t, i) => (
                  <motion.div
                    key={i}
                    className="p-4 bg-saffron-50 bg-opacity-50 rounded-xl shadow-sm space-y-4 relative border border-gold-200"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(i)}
                        className="absolute top-2 right-2 text-maroon-500 hover:text-maroon-700"
                      >
                        X
                      </button>
                    )}

                    <div>
                      <label className="block text-bhagwa-700 mb-1 font-medium">Type of Seva</label>
                      <select
                        value={t.task}
                        onChange={(e) => handleTaskChange(i, "task", e.target.value)}
                        className="w-full px-3 py-2 border border-gold-300 rounded-lg focus:ring-2 focus:ring-bhagwa-400 bg-white"
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
                      <label className="block text-bhagwa-700 mb-1 font-medium">
                        {t.task.includes("Mantra Japp") ? "Number of Japps" : "Count (संख्या)"}
                      </label>
                      <input
                        type="text"
                        value={t.count}
                        onChange={(e) => handleTaskChange(i, "count", e.target.value)}
                        className="w-full px-3 py-2 border border-gold-300 rounded-lg focus:ring-2 focus:ring-bhagwa-400"
                        required
                      />
                      {t.count === "" && (
                        <p className="text-sm text-maroon-500 mt-1">Please enter count</p>
                      )}
                    </div>

                    <div className="bg-peacock-50 p-3 rounded-lg text-peacock-800 font-medium border border-peacock-100">
                      {t.task.includes("Mantra Japp")
                        ? `${t.count || 0} japps = ${Math.floor((t.count || 0) / 10)} punya`
                        : `Punya: ${t.count || 0} × ${t.points} = ${(t.count || 0) * t.points}`}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                type="button"
                onClick={addNewTask}
                className="w-full py-3 bg-green-400 text-white rounded-lg hover:bg-peacock-600 flex items-center justify-center gap-2 transition-all"
              >
                <span className="text-xl">+</span>
                Add More Seva
              </button>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF9933] text-white rounded-lg hover:bg-bhagwa-700 flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all hover:shadow-bhagwa-200/50"
              >
                Offer to Maharaj
                <span className="text-xl">🪔</span>
              </button>
            </form>
          </motion.div>

          {/* Right: Satsangi Seva Board */}
          <motion.div
            className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg border border-gold-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-semibold text-bhagwa-800 mb-4 flex items-center gap-2">
              <span className="text-gold-500">📿</span>
              Satsangi Seva Board
            </h2>
            
            {todayWinner && (
              <motion.div 
                className="mb-6 p-4 bg-gold-50 border border-gold-300 rounded-lg relative overflow-hidden"
                variants={glow}
              >
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-200 rounded-full filter blur-xl opacity-40"></div>
                <h3 className="text-lg font-semibold text-bhagwa-800 flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">👑</span>
                  Today's Divine Champion
                </h3>
                <p className="flex justify-between items-center mt-2">
                  <span className="font-medium text-bhagwa-700">{todayWinner.name}</span>
                  <span className="px-3 py-1 bg-bhagwa-100 text-bhagwa-800 rounded-full font-bold">
                    {todayWinner.points} पुण्य
                  </span>
                </p>
              </motion.div>
            )}
            
            {users.length > 0 ? (
              <ul className="space-y-3">
                {users.map((u, i) => (
                  <motion.li
                    key={i}
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      i === 0 
                        ? "bg-gradient-to-r from-gold-100 to-yellow-50 border border-gold-300 shadow-sm" 
                        : "bg-saffron-50 border border-saffron-200"
                    } relative overflow-hidden`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {i === 0 && (
                      <div className="absolute -top-5 -right-5 w-16 h-16 bg-yellow-200 rounded-full filter blur-lg opacity-30"></div>
                    )}
                    <div className="flex items-center gap-3">
                      {i === 0 ? (
                        <div className="relative">
                          <span className="text-yellow-500 text-2xl">👑</span>
                          <div className="absolute inset-0 rounded-full bg-yellow-300 animate-ping opacity-30"></div>
                        </div>
                      ) : (
                        <span className="text-bhagwa-500">{i + 1}.</span>
                      )}
                      <span className={i === 0 ? "text-bhagwa-700 font-semibold" : "text-bhagwa-600"}>
                        {u.name}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      i === 0 ? "bg-yellow-100 text-bhagwa-700" : "bg-saffron-100 text-bhagwa-600"
                    }`}>
                      {u.points} पुण्य
                    </span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-bhagwa-600">
                <p className="text-lg">No seva offerings recorded yet</p>
                <p className="mt-2 text-sm">Be the first to offer your devotion!</p>
              </div>
            )}

            {/* Daily Inspiration */}
            <div className="mt-8 p-4 bg-peacock-50 bg-opacity-70 rounded-lg border border-peacock-200">
              <p className="text-peacock-800 italic text-center">
                "Regular bhajan is the key to eternal peace and divine bliss."<br />
                - Shriji Maharaj
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="text-center text-bhagwa-600 text-sm mt-12">
          <LotusDivider className="mb-4" />
          <p>श्री स्वामिनारायणाय नमः</p>
          <p>May your devotion blossom like a lotus in the divine light</p>
        </footer>
      </div>
    </div>
  );
}

export default Data;