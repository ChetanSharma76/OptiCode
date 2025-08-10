import React from "react";
import {NavLink, useNavigate} from 'react-router-dom'
import { motion } from "framer-motion";

const CallToAction = () => {

  const navigate = useNavigate()

  return (
    <div className="bg-[#07034d] py-30 text-white text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold">
        Ready to level up your <span className="text-amber-300">coding?</span>
      </h2>
      <br />
      <p className="mb-6 text-lg">Join <span className="text-purple-400">THE OJ</span> community and start solving real challenges today.</p>
      <motion.button
        onClick={() => navigate('/login')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 rounded-full bg-transparent border-2 border-purple-400 text-white font-semibold text-lg hover:bg-purple-500/20 transition-all duration-300 relative overflow-hidden group  hover:border-white animate-borderMove"
        >
        <span className="relative z-10">Create Account</span>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300  border-transparent hover:border-white animate-borderMove"></span>
        </motion.button>
    </div>
  );
};

export default CallToAction;
