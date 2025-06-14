import { motion } from "framer-motion";
import heroIcon from "../assets/heroIcon.png"; // Replace with your own image
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="w-full py-35 px-4 bg-[#07034d] relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] dark:bg-grid-gray-800/[0.2]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07034d]"></div>
        </div>
        
        {/* Animated floating elements */}
        <motion.div
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [0, 15, 0, -15, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-purple-500/20 blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0, 30, 0],
            y: [0, -20, 0, 20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-pink-500/20 blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 40, 0, -40, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-amber-300/20 blur-xl"
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10 relative z-10">
        {/* Left: Text Content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-amber-300"
          >
            Master Competitive Coding on{" "}
            <motion.span 
              className="text-purple-400"
              animate={{
                textShadow: [
                  "0 0 8px rgba(192, 132, 252, 0.5)",
                  "0 0 12px rgba(192, 132, 252, 0.8)",
                  "0 0 8px rgba(192, 132, 252, 0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              THE OJ
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-white max-w-2xl"
          >
            A modern online judge platform for problem-solving, contests, and learning — fast and reliable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex gap-6 flex-wrap"
          >
            <motion.button
              onClick={()=>navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.75 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden group border-transparent hover:border-white animate-borderMove"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/problems')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-transparent border-2 border-purple-400 text-white font-semibold text-lg hover:bg-purple-500/20 transition-all duration-300 relative overflow-hidden group hover:border-white animate-borderMove"
            >
              <span className="relative z-10">View Problems</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-transparent hover:border-white animate-borderMove"></span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          className="flex-1 flex justify-center rounded-2xl"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={heroIcon}
              alt="Hero Illustration"
              className="w-full max-w-md rounded-xl drop-shadow-[0_25px_25px_rgba(192,132,252,0.4)] hover:drop-shadow-[0_25px_25px_rgba(192,132,252,0.6)] transition-all duration-300"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 dark:bg-gray-400/20"
          style={{
            width: Math.random() * 10 + 5 + 'px',
            height: Math.random() * 10 + 5 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 100],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </section>
  );
}
