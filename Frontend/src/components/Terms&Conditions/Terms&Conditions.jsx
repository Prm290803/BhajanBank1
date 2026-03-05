import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const TermsAndConditions = () => {
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
      content: "Welcome to Bhajan Bank Vadtal. These Terms and Conditions govern your use of our devotional tracking mobile application and related services. Bhajan Bank Vadtal is a spiritual discipline platform that allows users to record daily devotional activities such as bhajan, seva, and other spiritual practices. By downloading, installing, or using this application, you agree to comply with and be bound by these Terms. If you do not agree with any part of these terms, please discontinue the use of the application immediately."
    },
    {
      title: "2. Purpose of the Application",
      content: "Bhajan Bank Vadtal is designed to encourage spiritual discipline and devotional consistency by allowing users to: Record daily seva and bhajan offerings, Track personal spiritual activities, Maintain devotion consistency, Participate in family-based devotional tracking, View devotional points and leaderboards. The platform serves as a personal devotional tracker and community encouragement system. All points, rankings, and achievements shown within the app are symbolic and meant for motivational purposes only, not as any form of religious certification."
    },
    {
      title: "3. User Eligibility",
      content: "To use the application, users must be at least 13 years of age. Users must provide accurate and complete information during registration, maintain the confidentiality of their login credentials, and use the application responsibly and respectfully. Users are fully responsible for all activities performed through their account. The app reserves the right to verify user information and suspend accounts found to be in violation of these terms."
    },
    {
      title: "4. Account Registration",
      content: "To access core features of the application, users are required to create an account. During registration, we collect: Full Name, Email Address, and a secure Password. Users agree to provide accurate and complete information when creating an account. We reserve the right to suspend or terminate accounts that contain false, misleading, or fraudulent information. Users are responsible for keeping their login credentials secure and must notify us immediately of any unauthorized account access."
    },
    {
      title: "5. Acceptable Use Policy",
      content: "Users agree NOT to: Attempt to gain unauthorized access to the system or other users' accounts, Disrupt or damage the application infrastructure or services, Manipulate devotional entries dishonestly or create虚假 entries, Use the application for any unlawful purposes, Attempt to reverse engineer, copy, or replicate the platform's code or design, Harass other users or post inappropriate content. Any violation of this policy may result in immediate account suspension or permanent termination without warning."
    },
    {
      title: "6. Devotional Entries and Points System",
      content: "Users can record various devotional activities through the daily task system including: Japa (rounds), Scripture reading, Temple seva, Meditation, Kirtan, and other spiritual practices. Once a devotional entry is submitted for a specific day, the entry becomes locked for that date to maintain data integrity. Editing or modifying submitted entries may be restricted after submission. Devotional points (Punya) are calculated based on the type of seva, duration, and the number of repetitions recorded. These points are intended solely for personal motivation and family encouragement, and hold no monetary or official religious value."
    },
    {
      title: "7. Family Participation and Leaderboards",
      content: "The application allows users to create or join devotional families with unique family codes. Family features include: Viewing all members within a family, Seeing individual devotional contributions, Tracking combined family devotional points, Viewing family leaderboard rankings, Setting collective family goals. Family points are calculated as the aggregate of devotional activities performed by all members during the daily cycle (2 AM to next day 2 AM). Leaderboards are intended to encourage healthy spiritual competition and community participation, fostering collective devotion."
    },
    {
      title: "8. Data Privacy and Security",
      content: "We take your privacy seriously. All personal information is encrypted and stored securely. We do not sell or share your personal data with third parties. Your devotional entries are private by default but may be visible to family members you join. We implement industry-standard security measures including JWT authentication and encrypted database storage. For complete details, please refer to our separate Privacy Policy document."
    },
    {
      title: "9. Service Availability",
      content: "We strive to keep Bhajan Bank Vadtal available and functional 24/7. However, we do not guarantee that the application will always be: Free from interruptions or downtime, Completely error-free, Available at all times without maintenance. Scheduled maintenance, necessary updates, or technical issues may temporarily affect service availability. We will make reasonable efforts to notify users of significant downtime in advance."
    },
    {
      title: "10. Intellectual Property Rights",
      content: "All content within Bhajan Bank Vadtal including but not limited to: App design and user interface, Source code and architecture, Branding and logos, Graphics and visual elements, Text and documentation, Features and functionality are the exclusive intellectual property of Bhajan Bank Vadtal and its developers. Users may not copy, reproduce, distribute, or create derivative works from any part of the application without explicit written permission. Unauthorized use may result in legal action."
    },
    {
      title: "11. Account Suspension and Termination",
      content: "We reserve the right to suspend or terminate user accounts under the following circumstances: Violation of these Terms and Conditions, Suspected fraudulent activity or misuse, Security concerns or breaches, Extended periods of inactivity, Requests from law enforcement or regulatory bodies. Account termination may occur without prior notice if necessary for platform security or legal compliance. Users may also request account deletion at any time by contacting support."
    },
    {
      title: "12. Limitation of Liability",
      content: "Bhajan Bank Vadtal is provided as a devotional tracking tool 'AS IS' without warranties of any kind. We are not responsible for: Personal interpretations of devotional points or rankings, Loss of data due to technical failures or user error, Service interruptions caused by external factors beyond our control, Any indirect, incidental, or consequential damages arising from app use, Decisions made based on app data or statistics. Users agree that the application is used at their own discretion and risk."
    },
    {
      title: "13. Modifications to Terms",
      content: "We may update these Terms and Conditions periodically to reflect: Changes in our practices, Legal or regulatory requirements, New features or functionality, User feedback and improvements. Any updates will be reflected by updating the Effective Date at the top of this document. Material changes will be notified to users via email or app notification. Continued use of the application after changes constitutes acceptance of the modified terms. Users are encouraged to review these terms periodically."
    },
    {
      title: "14. Governing Law",
      content: "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in [Your City], India. This provision survives any termination of your account or these Terms."
    },
    {
      title: "15. Contact Information",
      content: "If you have any questions, concerns, or requests regarding these Terms and Conditions, please contact us through any of the following channels:"
    }
  ];

  const contactInfo = [
    { icon: "📧", label: "Email", value: "buildcrew.co@gmail.com", link: "mailto:buildcrew.co@gmail.com" },
    { icon: "🌐", label: "Website", value: "www.buildcrew.co.in", link: "https://www.buildcrew.co.in" },
    { icon: "📱", label: "Phone", value: "+91 97374 30904", link: "tel:+919737430904" }

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern - Using the exact texture from your example */}
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
                  <span className="text-4xl">📿</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms & <span className="text-[#FF7722]">Conditions</span>
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
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {section.content}
                </div>

                {/* Contact Info for last section */}
                {index === sections.length - 1 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {contactInfo.map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 text-center border border-orange-100">
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        {item.link ? (
                          <a 
                            href={item.link}
                            className="text-sm font-medium text-[#FF7722] hover:text-orange-700 hover:underline"
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
                By using Bhajan Bank Vadtal, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/privacy-policy"
                  className="text-[#FF7722] hover:text-orange-700 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span>🔒</span> Privacy Policy
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
                  <span>🖨️</span> Print Terms
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

export default TermsAndConditions;