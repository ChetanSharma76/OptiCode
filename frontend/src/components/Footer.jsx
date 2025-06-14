import { FaTwitter, FaLinkedin, FaEnvelope, FaGithub, FaDiscord, FaHeart } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { motion } from "framer-motion";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: FaEnvelope, href: "mailto:contact@theoj.com", color: "hover:text-red-400", label: "Email" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/chetan-sharma-70ba70270", color: "hover:text-blue-400", label: "LinkedIn" },
    { icon: FaTwitter, href: "https://twitter.com/theoj", color: "hover:text-sky-400", label: "Twitter" },
    { icon: FaGithub, href: "https://github.com/ChetanSharma76", color: "hover:text-gray-300", label: "GitHub" },
    { icon: FaDiscord, href: "https://discord.gg/theoj", color: "hover:text-indigo-400", label: "Discord" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#0a1930] via-[#0d1b2a] to-[#1b263b] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/3 rounded-full blur-2xl"></div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <FiArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <div className="relative z-10">
        {/* Compact Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              
              {/* Copyright & Made with Love - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3"
              >
                <p className="text-gray-400 text-xs sm:text-sm">
                  © 2025 <span className="text-blue-400 font-semibold">THE OJ</span>. All rights reserved.
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-gray-300 text-xs sm:text-sm">Made with</span>
                  <FaHeart className="w-3 h-3 text-red-400 animate-pulse" />
                  <span className="text-blue-400 text-xs sm:text-sm font-medium">by Chetan Sharma</span>
                </div>
              </motion.div>

              {/* Brand Section - Center (Hidden on Mobile) */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden sm:flex items-center gap-2"
              >
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={logo}
                  onClick={() => navigate("/")}
                  alt="THE OJ Logo"
                  className="h-8 w-8 rounded-full cursor-pointer shadow-lg border border-blue-500/30"
                />
                <div>
                  <h3 className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    THE OJ
                  </h3>
                  <p className="text-gray-300 text-xs">Code. Compete. Conquer.</p>
                </div>
              </motion.div>

              {/* Social Links - Right Side */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <span className="text-gray-300 text-xs sm:text-sm font-medium hidden sm:inline">Follow:</span>
                <div className="flex gap-1">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-gray-400 ${social.color} transition-all duration-300 p-1.5 rounded-full hover:bg-white/5`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
