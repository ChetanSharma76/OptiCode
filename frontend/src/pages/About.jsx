import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-20 bg-gradient-to-br from-[#07034d] to-[#1e0750]"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 sm:p-10 space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              About OPTICODE
            </h1>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg max-w-3xl mx-auto"
            >
              Welcome to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-violet-300">OPTICODE</span> – your go-to online judge platform built by developers, for developers.
            </motion.p>
          </motion.div>

          {/* Grid Sections */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Our Mission */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
              </div>
              <p className="text-gray-300">
                We aim to make coding accessible and enjoyable by providing a streamlined interface for submitting, testing, and evaluating solutions to algorithmic problems in real time.
              </p>
              <p className="text-gray-300">
                Whether you're preparing for interviews, contests, or just want to grow your problem-solving skills — OPTICODE is here to help.
              </p>
            </motion.div>

            {/* What Makes Us Different */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">What Makes Us Different</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Clean, minimal, and intuitive interface",
                  "Real-time result feedback and runtime analysis",
                  "Admin panel to manage problems efficiently",
                  "Support for hidden and sample test cases",
                  "Focus on speed, simplicity, and accuracy"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Our Vision */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-indigo-400/30 transition-all duration-300 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Our Vision</h2>
              </div>
              <p className="text-gray-300">
                To build a collaborative and open-source platform that not only supports problem solving but encourages community contribution and learning.
              </p>
              <p className="text-gray-300">
                We believe in building a space where every learner can grow — with confidence, creativity, and curiosity.
              </p>
            </motion.div>

            {/* Our Team */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-violet-400/30 transition-all duration-300 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Our Team</h2>
              </div>
              <p className="text-gray-300">
                THE OJ is developed and maintained by a passionate group of developers and educators who understand the challenges of coding education and want to make it better for everyone.
              </p>
              <p className="text-gray-300">
                We constantly evolve based on user feedback — because your journey is our priority.
              </p>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-10 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-white mb-3">Ready to start solving?</h3>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">Create an account and join the coding revolution today.</p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Go to Home
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;