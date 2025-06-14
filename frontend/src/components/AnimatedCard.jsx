import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const advantages = [
  {
    title: "Fast Submissions",
    icon: "⚡",
    description: "Get instant feedback with our lightning-fast compiler.",
    from: "left",
  },
  {
    title: "Live Judge System",
    icon: "⚖️",
    description: "Real-time judging with detailed verdicts and insights.",
    from: "bottom",
  },
  {
    title: "Contest Simulation",
    icon: "🏆",
    description: "Train with virtual contests modeled after real ones.",
    from: "right",
  },
];

const cardVariants = {
  left: { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
  bottom: { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } },
  right: { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
};

export default function AnimatedCards() {
  return (
    <section className="py-20 px-4 bg-[#07034d]">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        Why Choose <span className="text-purple-400">THE OJ ?</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {advantages.map((card, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            variants={cardVariants[card.from]}
          >
            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
              <div
                className="bg-white p-6 rounded-xl shadow-xl text-center transform transition-transform duration-300 
                border-2 border-transparent hover:border-purple-500 hover:shadow-[0_0_15px_#a855f7]"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold text-black">{card.title}</h3>
                <p className="mt-2 text-gray-600">{card.description}</p>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
