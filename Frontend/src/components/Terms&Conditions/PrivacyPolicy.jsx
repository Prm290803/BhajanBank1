import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const PrivacyPolicy = () => {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sections = [
    {
      title: "1. Introduction",
      icon: "📋",
      content: "Bhajan Bank Vadtal ('we', 'our', or 'us') respects your privacy and is committed to protecting the personal information of users who use our mobile application. This Privacy Policy explains how we collect, use, store, and protect your information when you use the Bhajan Bank Vadtal mobile application. By installing or using the application, you agree to the collection and use of information in accordance with this Privacy Policy."
    },
    {
      title: "2. Information We Collect",
      icon: "📊",
      subsections: [
        {
          subtitle: "Personal Information",
          content: "When you create an account, we may collect the following information: Full Name, Email Address, Password (stored in encrypted form). This information is used to create and manage your account."
        },
        {
          subtitle: "Devotional Activity Data",
          content: "To provide the core functionality of the application, we collect devotional activity information including: Daily seva entries, Bhajan counts, Devotional task submissions, Spiritual points (Punya), Activity history. This data helps users track their spiritual discipline and devotional consistency."
        },
        {
          subtitle: "Family Participation Data",
          content: "If you join or create a devotional family within the application, we may collect and store: Family membership information, Family devotional contributions, Family leaderboard statistics. This information is visible to members of the same family group within the app."
        },
        {
          subtitle: "Technical Information",
          content: "We may collect limited technical information to ensure proper functionality of the application, such as: Authentication tokens, Device information (basic technical data), Application usage logs. These help maintain security and improve performance."
        }
      ]
    },
    {
      title: "3. How We Use Your Information",
      icon: "⚙️",
      content: "The information collected may be used for the following purposes:",
      list: [
        "To create and manage user accounts",
        "To authenticate users securely",
        "To record and display devotional activity",
        "To calculate spiritual points and statistics",
        "To enable family leaderboards and community participation",
        "To improve the application and user experience",
        "To maintain application security"
      ]
    },
    {
      title: "4. Data Storage and Security",
      icon: "🔒",
      content: "User data is stored securely using modern backend technologies. Security measures include:",
      list: [
        "Encrypted password storage",
        "Secure authentication using JWT tokens",
        "Secure database storage (MongoDB)",
        "Industry-standard security protocols"
      ],
      note: "We take reasonable precautions to protect user data from unauthorized access, loss, or misuse. However, no internet-based system can guarantee complete security."
    },
    {
      title: "5. Data Sharing",
      icon: "🤝",
      content: "Bhajan Bank Vadtal does NOT sell, rent, or trade personal information. User data may only be shared in the following situations:",
      list: [
        "When required by law",
        "To comply with legal obligations",
        "To protect the security and integrity of the platform"
      ]
    },
    {
      title: "6. Third-Party Services",
      icon: "🔌",
      content: "The application may use third-party services to support functionality such as:",
      list: [
        "Cloud services",
        "Authentication libraries",
        "Backend infrastructure",
        "Notification services"
      ],
      note: "These services may process limited data required for the operation of the application."
    },
    {
      title: "7. Notifications",
      icon: "🔔",
      content: "The application may send notifications such as:",
      list: [
        "Daily devotional reminders",
        "Activity updates",
        "Important service announcements"
      ],
      note: "Users can disable notifications through their device settings."
    },
    {
      title: "8. Children's Privacy",
      icon: "👶",
      content: "The application is not specifically designed for children under the age of 13. We do not knowingly collect personal data from children. If we become aware that a child has provided personal information, we will take steps to remove that data."
    },
    {
      title: "9. User Rights",
      icon: "⚖️",
      content: "Users have the right to:",
      list: [
        "Access their personal information",
        "Update their account information",
        "Request deletion of their account (if supported by the system)"
      ],
      note: "Requests related to user data can be submitted through the contact information below."
    },
    {
      title: "10. Changes to This Privacy Policy",
      icon: "📝",
      content: "We may update this Privacy Policy periodically to reflect changes in the application or legal requirements. Any updates will be reflected by updating the Last Updated date at the top of this page. Users are encouraged to review this Privacy Policy periodically."
    },
    {
      title: "11. Contact Us",
      icon: "📞",
      content: "If you have any questions regarding this Privacy Policy or the handling of your data, please contact us:"
    }
  ];

  const contactInfo = [
    { 
      icon: "📧", 
      label: "Email", 
      value: "buildcrew.co@gmail.com", 
      link: "mailto:buildcrew.co@gmail.com",
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-100"
    },
    { 
      icon: "🌐", 
      label: "Website", 
      value: "www.buildcrew.co.in", 
      link: "https://www.buildcrew.co.in",
      bg: "from-purple-50 to-pink-50",
      border: "border-purple-100"
    },
    { 
      icon: "📱", 
      label: "Phone",
        value: "+91 97374 30904",
        link: "tel:+919737430904",
        bg: "from-green-50 to-teal-50",
        border: "border-green-100"
    }
  ];

  const playStoreNote = {
    title: "📱 Google Play Store Requirements",
    content: "When submitting your app to Google Play Store, you must:",
    steps: [
      "Host this Privacy Policy on a public webpage",
      "Provide the Privacy Policy URL in the Play Console",
      "Ensure the policy matches your Data Safety Form"
    ],
    example: "Example URL: https://bhajanbankvadtal.com/privacy-policy"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
      
      <Navbar />

      <div className="pt-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl rotate-45 flex items-center justify-center shadow-lg">
                <div className="-rotate-45">
                  <span className="text-4xl">🔒</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy <span className="text-[#FF7722]">Policy</span>
            </h1>
            
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-4 rounded-full"></div>
            
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Bhajan Bank Vadtal – Devotional Seva & Spiritual Discipline Tracker
            </p>
            
            <div className="inline-block mt-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-sm">
                Last Updated: <span className="font-medium text-gray-700">March 2026</span>
              </p>
            </div>
          </motion.div>

          {/* Play Store Note - Important for submission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-gradient-to-r from-orange-100 to-amber-100 border-l-4 border-orange-500 rounded-xl p-4 sm:p-6 mb-8 shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">📢</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{playStoreNote.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{playStoreNote.content}</p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-2 space-y-1">
                  {playStoreNote.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
                <p className="text-sm font-mono bg-white/50 p-2 rounded border border-orange-200">
                  {playStoreNote.example}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 mb-8"
          >
            <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <span className="text-lg">📋</span>
              Quick Navigation:
            </p>
            <div className="flex flex-wrap gap-2">
              {sections.slice(0, 5).map((section, index) => (
                <a
                  key={index}
                  href={`#section-${index + 1}`}
                  className="text-xs px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                >
                  {section.icon} {section.title.split('.')[0]}
                </a>
              ))}
              <span className="text-xs px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full">
                +{sections.length - 5} more
              </span>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                id={`section-${index + 1}`}
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:border-orange-200"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                    {section.icon}
                  </span>
                  {section.title}
                </h2>
                
                {/* Handle sections with subsections */}
                {section.subsections ? (
                  <div className="space-y-4">
                    {section.subsections.map((sub, idx) => (
                      <div key={idx} className="pl-4 border-l-2 border-orange-200">
                        <h3 className="font-semibold text-gray-800 mb-2">{sub.subtitle}</h3>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                          {sub.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {section.content}
                    </div>
                    
                    {/* Handle lists */}
                    {section.list && (
                      <ul className="mt-3 space-y-2">
                        {section.list.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {/* Handle notes */}
                    {section.note && (
                      <p className="mt-3 text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                        {section.note}
                      </p>
                    )}
                  </>
                )}

                {/* Contact Info for last section */}
                {index === sections.length - 1 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {contactInfo.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`bg-gradient-to-br ${item.bg} rounded-lg p-4 text-center border ${item.border} hover:shadow-md transition-shadow`}
                      >
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        {item.link ? (
                          <a 
                            href={item.link}
                            className="text-sm font-medium text-[#FF7722] hover:text-orange-700 hover:underline break-all"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-gray-700">{item.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-6 rounded-full"></div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
              <p className="text-gray-600 text-sm mb-4">
                By using Bhajan Bank Vadtal, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/termsandconditions"
                  className="text-[#FF7722] hover:text-orange-700 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span>📜</span> Terms & Conditions
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/"
                  className="text-[#FF7722] hover:text-orange-700 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span>🏠</span> Return to App
                </Link>
                <span className="text-gray-300">|</span>
                <a
                  href="#"
                  onClick={() => window.print()}
                  className="text-[#FF7722] hover:text-orange-700 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span>🖨️</span> Print Policy
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-xs text-gray-400">
              <p>© {new Date().getFullYear()} Bhajan Bank Vadtal. All rights reserved.</p>
              <p className="mt-2">Developed with <span className="text-red-500">❤️</span> for the devotional community By</p>
              <a 
                href="https://buildcrew.co.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium hover:underline"
              >
                Build Crew
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;