import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [hasSeenHowTo, setHasSeenHowTo] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState("getting-started");

  useEffect(() => {
    // Check if user has seen the how-to guide before
    const hasSeen = localStorage.getItem('hasSeenHowToUse');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShowHowToUse(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setHasSeenHowTo(true);
    }

    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;

    if (isIos && !isInStandaloneMode) {
      setShowInstall(true);
    }

    const handler = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      if (!isIos) setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!window.deferredPrompt) return;
    setIsInstalling(true);
    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    window.deferredPrompt = null;
    setIsInstalling(false);
  };

  const handleCloseHowTo = () => {
    setShowHowToUse(false);
    localStorage.setItem('hasSeenHowToUse', 'true');
    setHasSeenHowTo(true);
  };

  // Guide sections data with step-by-step instructions
  // const guideSections = {
  //   "getting-started": {
  //     title: "Getting Started",
  //     icon: "🚀",
  //     steps: [
  //       {
  //         title: "Enter Divine Portal",
  //         description: "Click on 'Enter Divine Portal' button on the homepage to access the login screen.",
  //         image: "/guides/IMG_4538.PNG", // Replace with your actual image path
  //         imageAlt: "Click on Enter Divine Portal button",
  //         tips: "You'll find this button prominently displayed below the main heading."
  //       },
  //       {
  //         title: "Login or Create Account",
  //         description: "New users click 'Create Account' / 'Sign Up'. Existing users enter email & password.",
  //         image: "/guides/IMG_4539.PNG", 
  //         image1: "/guides/IMG_4540.PNG",// Replace with your actual image path
  //         imageAlt: "Login and Sign Up screen",
  //         tips: "Keep your login credentials safe."
  //       },
  //       {
  //         title: "Google Sign-In Option",
  //         description: "Click 'Continue with Google' for quick, secure access without creating a new password.",
  //         image: "/guides/IMG_4539.PNG", // Replace with your actual image path
  //         imageAlt: "Google Sign In button",
  //         tips: "Google Sign-In is the fastest way to get started!"
  //       },
  //       {
  //         title: "Create Account Manually",
  //         description: "Click 'Create Account' and fill in the required information.",
  //         image: "/guides/IMG_4540.PNG", // Replace with your actual image path
  //         imageAlt: "Create Account button",
  //         tips: "If you prefer not to use Google, manual registration is simple and secure."
  //       }
  //     ]
  //   },
  //   "create-account": {
  //     title: "Create Account",
  //     icon: "📝",
  //     steps: [
  //       {
  //         title: "Fill Registration Form",
  //         description: "Enter your name, email, mobile number, and create a strong password.",
  //         image: "/guides/register-form.png",
  //         imageAlt: "Registration form with fields",
  //         tips: "Use a valid email to receive important updates."
  //       },
  //       {
  //         title: "Verify Your Email",
  //         description: "Check your inbox for a verification link. Click it to activate your account.",
  //         image: "/guides/email-verification.png",
  //         imageAlt: "Email verification screen",
  //         tips: "Check spam folder if you don't see the email."
  //       },
  //       {
  //         title: "Complete Profile",
  //         description: "Add profile photo and basic details to personalize your spiritual journey.",
  //         image: "/guides/profile-setup.png",
  //         imageAlt: "Profile completion page",
  //         tips: "A profile photo helps family members recognize you."
  //       }
  //     ]
  //   },
  //   "family-setup": {
  //     title: "Family Setup",
  //     icon: "👨‍👩‍👧‍👦",
  //     steps: [
  //       {
  //         title: "Create New Family",
  //         description: "Click 'Create Family', enter family name, and set your role as Family Head.",
  //         image: "/guides/IMG_4543.PNG",
  //         imageAlt: "Create family form",
  //         tips: "Choose a meaningful family name like 'Sharma Family'."
  //       },
  //       {
  //         title: "Get Family Code",
  //         description: "After creation, you'll receive a unique 6-digit family code to share.",
  //         image: "/guides/IMG_4547.PNG",
  //         imageAlt: "Family code display",
  //         tips: "Share this code only with family members."
  //       },
  //       {
  //         title: "Join Existing Family",
  //         description: "If joining, click 'Join Family' and enter the family code shared by your Family Head.",
  //         image: "/guides/IMG_4556.PNG",
  //         imageAlt: "Join family with code",
  //         tips: "Ask your Family Head for the correct code."
  //       }
  //     ]
  //   },
  //   "add-bhajan": {
  //     title: "Add Bhajan",
  //     icon: "📿",
  //     steps: [
  //       {
  //         title: "Navigate to Add Bhajan",
  //         description: "When you Login to the app, the first thing you see is Your Bhajan Bank where you can add your bhajan and seva.",
  //         image: "/guides/IMG_4541.PNG",
  //         imageAlt: "Add Bhajan button location",
  //         tips: "Look for the floating action button Where u can add more Seva that you done in your entire day."
  //       },
  //       {
  //         title: "Enter Bhajan Details",
  //         description: "Select the type of seva (Tap, Bhajan, Satsang or Path) now select the type of seve you have in the entire day and then Add count How many times you have donr that Seva  FOR EXAMPLE: If you have done 11 malas then select Tap Mala and add count 11.",
  //         image: "/guides/IMG_4542.PNG",
  //         imageAlt: "Enter bhajan details",
  //         tips: "You can Add multiple Seva at once like FOR Example: If you have done 11 malas and 5 bhajans then you can add both just adter adding mala hit Add more seva and then add bhajan and then submit both together."
  //       },
        
  //     ]
  //   },
  //   "daily-goals": {
  //     title: "Daily Goals",
  //     icon: "🎯",
  //     steps: [
  //       {
  //         title: "View Daily Goals",
  //         description: "On your dashboard, see your daily target for bhajans and seva.",
  //         image: "/guides/IMG_4548.PNG",
  //         imageAlt: "Daily goals dashboard",
  //         tips: "Default goal is 5 bhajans per day."
  //       },
  //       {
  //         title: "Mark Progress",
  //         description: "Click on the 'Complete' button next to each bhajan you've recited today.",
  //         image: "/guides/IMG_4549.PNG",
  //         imageAlt: "Mark bhajan as complete",
  //         tips: "You can mark multiple bhajans throughout the day."
  //       },
  //       {
  //         title: "Track Streak",
  //         description: "Watch your daily streak grow as you consistently meet your goals.",
  //         image: "/guides/IMG_4550.PNG",
  //         imageAlt: "Streak tracking display",
  //         tips: "7-day streak gives you a 'Saptahik Sadhak' badge!"
  //       }
  //     ]
  //   },
    // "update-bhajan": {
    //   title: "Update/Delete Bhajan",
    //   icon: "✏️",
    //   steps: [
    //     {
    //       title: "Find Your Bhajan",
    //       description: "Go to 'My Bhajans' section to see all your submitted bhajans.",
    //       image: "/guides/IMG_4543.PNG",
    //       imageAlt: "My Bhajans list",
    //       tips: "Use search or filter to find specific bhajans."
    //     },
    //     {
    //       title: "Edit Bhajan",
    //       description: "Click the edit (✏️) icon on any bhajan card to modify title, content, or audio.",
    //       image: "/guides/IMG_4544.PNG",
    //       imageAlt: "Edit bhajan option",
    //       tips: "Changes reflect immediately for family members."
    //     },
    //     {
    //       title: "Delete Bhajan",
    //       description: "Click delete (🗑️) icon and confirm to permanently remove a bhajan.",
    //       image: "/guides/IMG_4545.PNG",
    //       imageAlt: "Delete bhajan confirmation",
    //       tips: "Deleted bhajans cannot be recovered."
    //     }
    //   ]
    // },
    
  //   "leaderboard": {
  //     title: "Family Leaderboard",
  //     icon: "🏆",
  //     steps: [
  //       {
  //         title: "Leaderboard Daily Rankings Every USer can see the overall rankings on daily basis.",
  //         description: "Click on 'Leaderboard' tab in main navigation to see family rankings.",
  //         image: "/guides/IMG_4543.PNG",
  //         imageAlt: "Leaderboard navigation",
  //         tips: "Leaderboard updates in real-time."
  //       },
  //       {
  //         title: "Daily Competition Family Rankings",
  //         description: "Daily Competation between all Families.",
  //         image: "/guides/IMG_4552.PNG",
  //         imageAlt: "Leaderboard time filters",
  //         tips: "Compete for the top spot in Daily basis rankings!"
  //       },
  //       {
  //         title: "Check Your Rank",
  //         description: "See your position, total bhajans count, and progress to next rank.",
  //         image: "/guides/IMG_4557.PNG",
  //         imageAlt: "User rank position",
  //         tips: "Encourage family members to increase collective seva."
  //       }
  //     ]
  //   }
  // };
const guideSections = {
  "getting-started": {
    title: "Getting Started\n  શરૂઆત કરો",
    icon: "🚀",
    steps: [
      {
        title: "Enter Divine Portal\n  દિવ્ય પોર્ટલમાં પ્રવેશ કરો",
        description: "Click on 'Enter Divine Portal' button on the homepage to access the login screen.''લૉગિન સ્ક્રીન ખોલવા માટે હોમપેજ પર 'Enter Divine Portal' બટન પર ક્લિક કરો.''",
        image: "/guides/IMG_4538.PNG",
        imageAlt: "Click on Enter Divine Portal button",
        tips: "You'll find this button prominently displayed below the main heading.\nઆ બટન મુખ્ય શીર્ષકની નીચે સરળતાથી દેખાશે."
      },
      {
        title: "Login or Create Account\nલૉગિન કરો અથવા એકાઉન્ટ બનાવો",
        description: "New users click 'Create Account' / 'Sign Up'. Existing users enter email & password.\nનવા યુઝર 'Create Account' ક્લિક કરે. જૂના યુઝર ઈમેલ અને પાસવર્ડ દાખલ કરે.",
        image: "/guides/IMG_4539.PNG",
        image1: "/guides/IMG_4540.PNG",
        imageAlt: "Login and Sign Up screen",
        tips: "Keep your login credentials safe.\nતમારા લૉગિન વિગતો સુરક્ષિત રાખો."
      },
      {
        title: "Google Sign-In Option\nGoogle દ્વારા લૉગિન",
        description: "Click 'Continue with Google' for quick, secure access.\nઝડપી અને સુરક્ષિત લૉગિન માટે 'Continue with Google' નો ઉપયોગ કરો.",
        image: "/guides/IMG_4539.PNG",
        imageAlt: "Google Sign In button",
        tips: "Google Sign-In is the fastest way to get started!\nGoogle દ્વારા લૉગિન સૌથી ઝડપી રીત છે."
      }
    ]
  },

  "create-account": {
    title: "Create Account\nએકાઉન્ટ બનાવો",
    icon: "📝",
    steps: [
      {
        title: "Fill Registration Form\nરજીસ્ટ્રેશન ફોર્મ ભરો",
        description: "Enter your name, email, mobile number, and password.\nતમારું નામ, ઈમેલ, મોબાઈલ નંબર અને પાસવર્ડ દાખલ કરો.",
        image: "/guides/register-form.png",
        imageAlt: "Registration form with fields",
        tips: "Use a valid email to receive updates.\nઅપડેટ માટે માન્ય ઈમેલનો ઉપયોગ કરો."
      },
      {
        title: "Verify Your Email\nઈમેલ ચકાસો",
        description: "Check your inbox and verify your email.\nતમારા ઈમેલમાં જઈને વેરિફિકેશન કરો.",
        image: "/guides/email-verification.png",
        imageAlt: "Email verification screen",
        tips: "Check spam folder if needed.\nજરૂર હોય તો સ્પેમ ફોલ્ડર પણ ચકાસો."
      }
    ]
  },

  "family-setup": {
    title: "Family Setup\nપરિવાર સેટઅપ",
    icon: "👨‍👩‍👧‍👦",
    steps: [
      {
        title: "Create New Family\nનવો પરિવાર બનાવો",
        description: "Click 'Create Family', enter family name, and set your role as Family Head.\n'Create Family' ક્લિક કરો, પરિવારનું નામ દાખલ કરો અને Family Head તરીકે સેટ કરો.",
        image: "/guides/IMG_4543.PNG",
        imageAlt: "Create family form",
        tips: "Choose a meaningful family name.\nઅર્થપૂર્ણ પરિવારનું નામ પસંદ કરો."
      },
      {
        title: "Get Family Code\nપરિવાર કોડ મેળવો",
        description: "You'll receive a unique family code to share.\nતમને અનન્ય પરિવાર કોડ મળશે.",
        image: "/guides/IMG_4547.PNG",
        imageAlt: "Family code display",
        tips: "Share only with trusted members.\nફક્ત વિશ્વાસપાત્ર સભ્યો સાથે શેર કરો."
      }
    ]
  },

  "add-bhajan": {
    title: "Add Bhajan\nભજન ઉમેરો",
    icon: "📿",
    steps: [
      {
        title: "Navigate to Add Bhajan\nભજન ઉમેરવા જાઓ",
        description: "Open Bhajan Bank after login.\nલૉગિન પછી ભજન બેન્ક ખોલો.",
        image: "/guides/IMG_4541.PNG",
        imageAlt: "Add Bhajan button",
        tips: "Use floating button to add seva.\nસેવા ઉમેરવા માટે ફ્લોટિંગ બટનનો ઉપયોગ કરો."
      },
      {
        title: "Enter Bhajan Details\nભજન વિગતો દાખલ કરો",
        description: "Select seva type and add count.\nસેવાનો પ્રકાર પસંદ કરો અને સંખ્યા દાખલ કરો.",
        image: "/guides/IMG_4542.PNG",
        imageAlt: "Bhajan details",
        tips: "You can add multiple seva.\nતમે અનેક સેવાઓ ઉમેરો શકો છો."
      }
    ]
  },

  "daily-goals": {
    title: "Daily Goals\nદૈનિક લક્ષ્ય",
    icon: "🎯",
    steps: [
      {
        title: "View Daily Goals\nદૈનિક લક્ષ્ય જુઓ",
        description: "Check your daily goals on dashboard.\nડેશબોર્ડ પર તમારા લક્ષ્યો જુઓ.",
        image: "/guides/IMG_4548.PNG",
        imageAlt: "Dashboard"
      },
      {
        title: "Track Progress\nપ્રગતિ ટ્રેક કરો",
        description: "Mark completed bhajans.\nપૂર્ણ થયેલા ભજનને માર્ક કરો.",
        image: "/guides/IMG_4549.PNG",
        imageAlt: "Progress"
      }
    ]
  },
 "update-bhajan": {
      title: "Update/Delete Bhajan",
      icon: "✏️",
      steps: [
        {
          title: "Find Your Bhajan",
          description: "Go to 'My Bhajans' section to see all your submitted bhajans.",
          image: "/guides/IMG_4543.PNG",
          imageAlt: "My Bhajans list",
          tips: "Use search or filter to find specific bhajans."
        },
        {
          title: "Edit Bhajan",
          description: "Click the edit (✏️) icon on any bhajan card to modify title, content, or audio.",
          image: "/guides/IMG_4544.PNG",
          imageAlt: "Edit bhajan option",
          tips: "Changes reflect immediately for family members."
        },
        {
          title: "Delete Bhajan",
          description: "Click delete (🗑️) icon and confirm to permanently remove a bhajan.",
          image: "/guides/IMG_4545.PNG",
          imageAlt: "Delete bhajan confirmation",
          tips: "Deleted bhajans cannot be recovered."
        }
      ]
    },
    
  "leaderboard": {
    title: "Leaderboard\nલીડરબોર્ડ",
    icon: "🏆",
    steps: [
      {
        title: "View Rankings\nરેન્કિંગ જુઓ",
        description: "Check daily rankings.\nદૈનિક રેન્કિંગ જુઓ.",
        image: "/guides/IMG_4543.PNG",
        imageAlt: "Leaderboard"
      },
      {
        title: "Check Your Rank\nતમારી રેન્ક જુઓ",
        description: "See your position and progress.\nતમારી સ્થિતિ અને પ્રગતિ જુઓ.",
        image: "/guides/IMG_4557.PNG",
        imageAlt: "Rank"
      }
    ]
  }
};
  const tabs = [
    { id: "getting-started", label: "🚀 Getting Started" },
    // { id: "create-account", label: "📝 Create Account" },
    { id: "add-bhajan", label: "📿 Add Bhajan" },
    { id: "family-setup", label: "👨‍👩‍👧‍👦 Family Setup" },
    // { id: "daily-goals", label: "🎯 Daily Family Goals" },
    { id: "update-bhajan", label: "✏️ Update/Delete" },
    // { id: "wrong-count", label: "🔄 Fix Wrong Count" },
    { id: "leaderboard", label: "🏆 Leaderboard" }
  ];

  const currentGuide = guideSections[activeGuideTab];
  const currentIndex = tabs.findIndex(t => t.id === activeGuideTab);
  const prevTab = tabs[currentIndex - 1];
  const nextTab = tabs[currentIndex + 1];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_100%)]"></div>
     
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-4 w-48 h-48 sm:top-20 sm:left-10 sm:w-72 sm:h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-4 w-48 h-48 sm:bottom-20 sm:right-10 sm:w-72 sm:h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -15, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Help Button */}
      {(hasSeenHowTo || !showHowToUse) && (
        <motion.button
          onClick={() => setShowHowToUse(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-200 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>
      )}

      {/* How to Use Modal with Picture Guide */}
      <AnimatePresence>
        {showHowToUse && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseHowTo}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 sm:p-6 rounded-t-2xl z-10">
                <button
                  onClick={handleCloseHowTo}
                  className="absolute right-4 top-4 text-white hover:text-orange-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📖</div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Complete Visual Guide</h2>
                    <p className="text-orange-100 text-sm mt-1">Step-by-step picture tutorial for Bhajan Bank</p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="sticky top-[72px] sm:top-[88px] bg-white border-b border-gray-200 z-10 overflow-x-auto">
                <div className="flex px-4 gap-1 min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveGuideTab(tab.id)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                        activeGuideTab === tab.id
                          ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                          : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6">
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-200">
                  <span className="text-3xl">{currentGuide.icon}</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{currentGuide.title}</h3>
                </div>

                {/* Steps with Pictures */}
                <div className="space-y-8">
                  {currentGuide.steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="md:w-1/2 bg-gradient-to-br from-orange-100 to-amber-100 p-4 flex items-center justify-center min-h-[250px]">
                          <div className="relative w-full max-w-[300px]">
                            {/* Actual Image - Replace with your screenshots */}
                            <img
                              src={step.image}
                              alt={step.imageAlt}
                              className="w-full h-auto rounded-lg shadow-lg border-2 border-white"
                              onError={(e) => {
                                // Fallback if image doesn't exist
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x250/FF8C00/FFFFFF?text=Step+Image+Coming+Soon";
                              }}
                            />
                            {/* Step Number Badge */}
                            <div className="absolute -top-3 -left-3 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                              {idx + 1}
                            </div>
                          </div>
                        </div>
                        
                        {/* Description Section */}
                        <div className="md:w-1/2 p-5">
                          <h4 className="font-bold text-lg text-gray-800 mb-2">
                            Step {idx + 1}: {step.title}
                          </h4>
                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {step.description}
                          </p>
                          <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                            <div className="flex items-start gap-2">
                              <span className="text-blue-500 text-sm">💡</span>
                              <p className="text-sm text-blue-700">
                                <span className="font-semibold">Pro Tip:</span> {step.tips}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation Buttons - Fixed version without repetition */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-4 border-t border-gray-200">
                  <div className="flex gap-3 w-full">
                    {prevTab && (
                      <button
                        onClick={() => setActiveGuideTab(prevTab.id)}
                        className="px-5 py-2.5 border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <span>←</span> Previous: {prevTab.label.split(' ')[1]}
                      </button>
                    )}
                    {nextTab && (
                      <button
                        onClick={() => setActiveGuideTab(nextTab.id)}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2 ml-auto"
                      >
                        Next: {nextTab.label.split(' ')[1]} <span>→</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                  <Link to="/register" className="flex-1" onClick={handleCloseHowTo}>
                    <motion.button
                      className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🙏 Begin My Journey
                    </motion.button>
                  </Link>
                  <button
                    onClick={handleCloseHowTo}
                    className="flex-1 px-6 py-3 border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all"
                  >
                    Explore Later
                  </button>
                </div>

                {/* Help Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                  Need more help? Contact support at support@bhajanbank.com
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Responsive Logos */}
      <div className="relative lg:fixed z-20 w-full">
        <div className="absolute top-4 left-3 sm:top-6 sm:left-4 md:top-6 md:left-6 lg:top-8 lg:left-8">
          <img
            src="https://res.cloudinary.com/dq85wnwj3/image/upload/v1772954400/vadtal_h6egqf.png"
            alt="Vadtal Logo"
            className="w-auto h-15 sm:h-15 md:h-18 lg:h-25 object-contain"
          />
        </div>
        <motion.div
          className="mb-1 flex items-end justify-center sm:mb-3 md:mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs sm:text-sm mt-3 md:text-base lg:text-lg font-bold text-orange-600">
            ।। श्री स्वामिनारायणो विजयतेतराम् ।।
          </p>
        </motion.div> 
        <div className="absolute top-4 right-3 sm:top-6 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8">
          <img
            src="https://res.cloudinary.com/dq85wnwj3/image/upload/v1772957604/umreth-Photoroom_bkmtqg.png"
            alt="Umreth Logo"
            className="w-auto h-15 sm:h-15 md:h-18 lg:h-25 object-contain"
          />
        </div>
      </div>

      {/* Main Content - Keep your existing content here */}
      <div className="relative z-10 mt-1 lg:mt-25 md:mt-15 min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 text-center pt-20 sm:pt-24 md:pt-16">
        {/* Your existing main content remains exactly the same */}
        <div className="flex flex-wrap items-end justify-center gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-40 mb-4 sm:mb-6 md:mb-8 px-2">
          <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="relative overflow-hidden rounded-xl shadow-sm border-2 sm:border-3 border-orange-300 bg-white">
              <img src="/dev1.png" alt="Laxminarayan Bhagwan" className="h-26 w-26 xs:h-28 xs:w-28 sm:h-32 sm:w-32 md:h-38 md:w-38 lg:h-40 lg:w-40 object-cover" />
            </div>
            <p className="mt-3 text-[10px] xs:text-xs sm:text-sm font-semibold text-orange-700 whitespace-nowrap">श्री लक्ष्मीनारायण देव</p>
          </motion.div>
          <motion.div className="flex flex-col items-center -mb-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="relative">
              <img src="https://res.cloudinary.com/dq85wnwj3/image/upload/v1772954406/img2_dcfres.png" alt="Shri Maharaj" className="h-36 w-20 xs:h-40 xs:w-24 sm:h-44 sm:w-28 md:h-52 md:w-32 lg:h-60 lg:w-36 object-contain" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 99%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 99%)' }} />
              <div className="absolute bottom-0 left-0 right-0 h-6 xs:h-8 sm:h-10 bg-gradient-to-t from-saffron-50 to-transparent"></div>
            </div>
          </motion.div>
          <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="relative overflow-hidden rounded-xl shadow-sm border-2 sm:border-3 border-orange-300 bg-white">
              <img src="/maharajshree.png" alt="Acharya Maharaj Shree" className="h-24 w-24 xs:h-28 xs:w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 object-cover p-1" />
            </div>
            <div className="mt-2 text-[10px] xs:text-xs sm:text-sm text-center">
              <p className="font-semibold text-orange-700 whitespace-nowrap">પ.પૂ. ધ.ધુ. ૧૦૦૮ આચાર્ય</p>
              <p className="font-semibold text-orange-700 whitespace-nowrap"> શ્રી રાકેશ પ્રસાદજી મહારાજ</p>
            </div>
          </motion.div>
        </div>
        <motion.h1 className="text-2xl mt-5 xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <span className="bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">BHAJAN BANK VADTAL</span>
        </motion.h1>
        <motion.p className="text-sm xs:text-base sm:text-lg md:text-xl text-orange-600 font-bold mb-4 sm:mb-6 md:mb-8 max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed px-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          તમારી ભક્તિ, હવે ડિજિટલ ડાયરીમાં!
        </motion.p>
        <motion.p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed px-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          Track your spiritual journey with divine grace
          <br />
          <span className="text-xs xs:text-sm sm:text-base text-gray-500">Record your daily bhajan and seva offerings</span>
        </motion.p>
        <motion.div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 w-full max-w-[280px] xs:max-w-sm sm:max-w-md mx-auto px-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
          <Link to="/login" className="flex-1">
            <motion.button className="w-full px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg xs:rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs xs:text-sm sm:text-base" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span className="text-sm xs:text-base sm:text-lg">🙏</span>
              <span className="whitespace-nowrap">Enter Divine Portal</span>
            </motion.button>
          </Link>
          <Link to="/register" className="flex-1">
            <motion.button className="w-full px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold rounded-lg xs:rounded-xl shadow-lg transition-all duration-200 text-xs xs:text-sm sm:text-base whitespace-nowrap" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Begin Spiritual Journey
            </motion.button>
          </Link>
        </motion.div>
        <motion.div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl mx-auto w-full px-2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
          {[
            { icon: "📿", title: "Daily Bhajan Tracking", desc: "Record your spiritual practices" },
            { icon: "👨‍👩‍👧‍👦", title: "Family Leaderboards", desc: "Compete with family in seva" },
            { icon: "🌱", title: "Spiritual Growth", desc: "Track your divine progress" }
          ].map((feature) => (
            <motion.div key={feature.title} className="bg-white/70 backdrop-blur-sm p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border border-orange-100 shadow-lg" whileHover={{ scale: 1.03, y: -3 }} transition={{ duration: 0.2 }}>
              <div className="text-xl xs:text-2xl sm:text-3xl mb-1 sm:mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 text-xs xs:text-sm sm:text-base">{feature.title}</h3>
              <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        {showInstall && (
          <motion.div className="mb-4 sm:mb-6 px-2">
            {/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) ? (
              <div className="px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 bg-yellow-100 border border-yellow-300 rounded-lg xs:rounded-xl text-gray-800 max-w-[260px] xs:max-w-xs sm:max-w-sm mx-auto">
                <p className="font-semibold mb-0.5 sm:mb-1 text-xs xs:text-sm">📱 Add to Home Screen</p>
                <p className="text-[10px] xs:text-xs sm:text-sm">Tap the <span className="font-medium">Share</span> button and choose <span className="font-medium"> "Add to Home Screen"</span> to install.</p>
              </div>
            ) : (
              <motion.button onClick={handleInstall} disabled={isInstalling} className="px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-70 text-xs xs:text-sm sm:text-base mx-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {isInstalling ? (
                  <><div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Installing...</>
                ) : (
                  <><span>📱</span>Install App</>
                )}
              </motion.button>
            )}
          </motion.div>
        )}
        <motion.div className="text-center px-2 pb-3 sm:pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}>
          <p className="text-xs xs:text-sm sm:text-base font-semibold text-gray-700 mb-0.5 sm:mb-1">श्री स्वामिनारायणाय नमः</p>
          <p className="text-gray-500 text-[10px] xs:text-xs sm:text-sm">May your devotion blossom like a lotus in divine light</p>
          <p className="text-xs mt-2 text-gray-400">Developed with <span className="text-red-500">❤️</span> for the devotional community By {' '}
            <a href="https://buildcrew.co.in" target="_blank" rel="noopener noreferrer" className="text-gray-600 block hover:text-gray-900 transition-colors duration-200 font-medium">Build Crew</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}