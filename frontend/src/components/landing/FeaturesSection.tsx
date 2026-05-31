'use client';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: '🧠',
    title: 'Adaptive Learning Path',
    description: 'Personalized roadmap from zero to mastery across AI, ML, Deep Learning, and Robotics.',
    color: 'border-cyber-blue/30 hover:border-cyber-blue/60',
    glow: 'hover:shadow-neon-blue',
  },
  {
    icon: '⚡',
    title: 'Interactive Playground',
    description: 'Write, run, and debug Python, JavaScript, and C++ code directly in the browser.',
    color: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    glow: 'hover:shadow-neon-cyan',
  },
  {
    icon: '🤖',
    title: 'Robotics Simulation',
    description: 'Simulate robot movements, sensor data, SLAM, and autonomous navigation concepts.',
    color: 'border-purple-500/30 hover:border-purple-500/60',
    glow: 'hover:shadow-neon-purple',
  },
  {
    icon: '📊',
    title: 'AI Experiment Lab',
    description: 'Train ML models, visualize neural networks, tune hyperparameters, and watch loss curves in real-time.',
    color: 'border-cyber-green/30 hover:border-cyber-green/60',
    glow: 'hover:shadow-neon-green',
  },
  {
    icon: '🏆',
    title: 'Gamified Progress',
    description: 'Earn XP, unlock achievements, maintain streaks, and climb the global leaderboard.',
    color: 'border-yellow-500/30 hover:border-yellow-500/60',
    glow: '',
  },
  {
    icon: '🎯',
    title: 'Assessments & Quizzes',
    description: 'Chapter quizzes, timed tests, coding challenges, and AI-generated practice problems.',
    color: 'border-red-500/30 hover:border-red-500/60',
    glow: '',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-14 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue text-sm font-mono mb-4">
            Platform Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-4">
            Everything You Need to{' '}
            <span className="text-cyber-blue">Become an AI Engineer</span>
          </h2>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Not just theory. Real code, real projects, real skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`cyber-card p-6 transition-all duration-300 ${feature.color} ${feature.glow}`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-display font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TRACKS = [
  { level: 0, title: 'Foundations', topics: ['Programming Basics', 'Python', 'Math for AI', 'Linux'], color: '#22c55e', icon: '🌱' },
  { level: 1, title: 'Data Science', topics: ['NumPy', 'Pandas', 'Visualization', 'Statistics'], color: '#0ea5e9', icon: '📊' },
  { level: 2, title: 'Machine Learning', topics: ['Supervised', 'Unsupervised', 'Evaluation', 'Sklearn'], color: '#06b6d4', icon: '🧠' },
  { level: 3, title: 'Deep Learning', topics: ['Neural Nets', 'CNNs', 'RNNs', 'Transformers'], color: '#a855f7', icon: '⚡' },
  { level: 4, title: 'AI Applications', topics: ['NLP', 'Computer Vision', 'GenAI', 'LLMs'], color: '#ec4899', icon: '🎯' },
  { level: 5, title: 'Robotics Basics', topics: ['Sensors', 'Actuators', 'Arduino', 'RPi'], color: '#f59e0b', icon: '🤖' },
  { level: 6, title: 'Autonomous Robots', topics: ['ROS2', 'SLAM', 'Path Planning', 'RL'], color: '#ef4444', icon: '🗺️' },
  { level: 7, title: 'Production AI', topics: ['MLOps', 'Edge AI', 'Deployment', 'AI Agents'], color: '#8b5cf6', icon: '🚀' },
];

export function RoadmapPreview() {
  return (
    <section className="py-14 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-mono mb-4">
            Learning Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-4">
            Zero to{' '}
            <span className="text-purple-400">AI Mastery</span>
          </h2>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto">
            8 progressive levels. Each builds on the last. No gaps, no confusion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRACKS.map((track, i) => (
            <motion.div
              key={track.level}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="cyber-card p-5 cursor-pointer"
              style={{ borderColor: `${track.color}30` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                  style={{ background: `${track.color}30`, color: track.color, border: `1px solid ${track.color}50` }}
                >
                  L{track.level}
                </div>
                <span className="text-xl">{track.icon}</span>
              </div>
              <h3 className="font-display font-bold text-white mb-2">{track.title}</h3>
              <div className="flex flex-wrap gap-1">
                {track.topics.map(topic => (
                  <span
                    key={topic}
                    className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: `${track.color}15`, color: `${track.color}`, border: `1px solid ${track.color}20` }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: '50K+', label: 'Students Learning', icon: '👩‍💻' },
  { value: '98%', label: 'Completion Rate', icon: '🎯' },
  { value: '200+', label: 'Code Examples', icon: '💻' },
  { value: '4.9/5', label: 'Student Rating', icon: '⭐' },
];

export function StatsSection() {
  return (
    <section className="py-10 sm:py-16 border-y border-cyber-gray/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-display font-black text-cyber-blue mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-400 font-mono">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'ML Engineer @ Google',
    text: 'AIRO BOTS took me from knowing nothing about AI to deploying my first model in 3 months. The robotics section is absolutely mind-blowing.',
    avatar: 'SC',
    stars: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'Robotics PhD Student',
    text: 'Best platform I\'ve used for learning ROS and SLAM. The interactive simulations make concepts click instantly. No other platform comes close.',
    avatar: 'MW',
    stars: 5,
  },
  {
    name: 'Priya Patel',
    role: 'AI Researcher',
    text: 'The deep learning curriculum is comprehensive and modern. Transformers, LLMs, GenAI — it\'s all here with hands-on code you can actually run.',
    avatar: 'PP',
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-4">
            What Our <span className="text-cyber-green">Students Say</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="cyber-card p-6"
            >
              <div className="flex mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic leading-relaxed">{`"${t.text}"`}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyber-gradient flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-cyber-blue">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
