'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';

const ROADMAP_LEVELS = [
  {
    level: 0,
    title: 'FOUNDATIONS',
    subtitle: 'Zero to Hero Basics',
    color: 'from-slate-500 to-slate-400',
    borderColor: 'border-slate-500/50',
    glowColor: 'shadow-slate-500/20',
    icon: '🌱',
    topics: [
      { name: 'Computer Science Basics', slug: 'cs-basics', duration: '3h', done: true },
      { name: 'Linux & Terminal', slug: 'linux-basics', duration: '4h', done: true },
      { name: 'Git & GitHub', slug: 'git-github', duration: '3h', done: false },
      { name: 'Python Fundamentals', slug: 'python-fundamentals', duration: '8h', done: false },
      { name: 'Math for AI (Linear Algebra)', slug: 'math-for-ai', duration: '6h', done: false },
      { name: 'Statistics & Probability', slug: 'statistics', duration: '5h', done: false },
    ],
    description: 'Build the essential foundation every AI engineer needs. Master Python, math, and developer tools before diving into AI.',
  },
  {
    level: 1,
    title: 'DATA SCIENCE',
    subtitle: 'Python for Data',
    color: 'from-blue-600 to-blue-400',
    borderColor: 'border-blue-500/50',
    glowColor: 'shadow-blue-500/20',
    icon: '📊',
    topics: [
      { name: 'NumPy & Arrays', slug: 'numpy', duration: '4h', done: false },
      { name: 'Pandas & DataFrames', slug: 'pandas', duration: '5h', done: false },
      { name: 'Matplotlib & Seaborn', slug: 'data-visualization', duration: '4h', done: false },
      { name: 'Data Cleaning', slug: 'data-cleaning', duration: '3h', done: false },
      { name: 'Exploratory Data Analysis', slug: 'eda', duration: '4h', done: false },
    ],
    description: 'Learn to wrangle, clean, and visualize data — the most critical skill in any AI workflow.',
  },
  {
    level: 2,
    title: 'MACHINE LEARNING',
    subtitle: 'Core ML Algorithms',
    color: 'from-cyber-blue to-cyan-400',
    borderColor: 'border-cyber-blue/50',
    glowColor: 'shadow-cyber-blue/20',
    icon: '🧠',
    topics: [
      { name: 'ML Foundations', slug: 'ml-foundations', duration: '5h', done: false },
      { name: 'Linear Regression', slug: 'linear-regression', duration: '3h', done: false },
      { name: 'Logistic Regression', slug: 'logistic-regression', duration: '3h', done: false },
      { name: 'Decision Trees & Random Forests', slug: 'decision-trees', duration: '4h', done: false },
      { name: 'SVM & KNN', slug: 'svm-knn', duration: '4h', done: false },
      { name: 'Clustering (K-Means)', slug: 'clustering', duration: '3h', done: false },
      { name: 'Model Evaluation & Metrics', slug: 'model-evaluation', duration: '4h', done: false },
    ],
    description: 'Master the core ML algorithms powering modern AI systems. From regression to ensemble methods.',
  },
  {
    level: 3,
    title: 'DEEP LEARNING',
    subtitle: 'Neural Networks',
    color: 'from-violet-600 to-violet-400',
    borderColor: 'border-violet-500/50',
    glowColor: 'shadow-violet-500/20',
    icon: '🔮',
    topics: [
      { name: 'Neural Networks from Scratch', slug: 'neural-networks', duration: '6h', done: false },
      { name: 'Backpropagation', slug: 'backprop', duration: '4h', done: false },
      { name: 'CNNs — Image Recognition', slug: 'cnn', duration: '6h', done: false },
      { name: 'RNNs & LSTMs', slug: 'rnn-lstm', duration: '5h', done: false },
      { name: 'Attention & Transformers', slug: 'transformers', duration: '7h', done: false },
      { name: 'PyTorch / TensorFlow', slug: 'pytorch', duration: '8h', done: false },
    ],
    description: 'Build and train deep neural networks. Understand the architecture behind modern AI breakthroughs.',
  },
  {
    level: 4,
    title: 'NLP & VISION',
    subtitle: 'Perception & Language',
    color: 'from-pink-600 to-pink-400',
    borderColor: 'border-pink-500/50',
    glowColor: 'shadow-pink-500/20',
    icon: '👁️',
    topics: [
      { name: 'NLP Basics & Tokenization', slug: 'nlp-basics', duration: '4h', done: false },
      { name: 'Word Embeddings (Word2Vec)', slug: 'word-embeddings', duration: '3h', done: false },
      { name: 'BERT & Language Models', slug: 'bert', duration: '5h', done: false },
      { name: 'Computer Vision Fundamentals', slug: 'computer-vision', duration: '5h', done: false },
      { name: 'Object Detection (YOLO)', slug: 'object-detection', duration: '5h', done: false },
      { name: 'Generative AI & Diffusion', slug: 'generative-ai', duration: '6h', done: false },
      { name: 'LLMs & Prompt Engineering', slug: 'llms', duration: '6h', done: false },
    ],
    description: 'Teach machines to see, read, and understand human language. Build the AI behind chatbots and vision systems.',
  },
  {
    level: 5,
    title: 'ROBOTICS BASICS',
    subtitle: 'Hardware & Sensing',
    color: 'from-amber-600 to-amber-400',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-amber-500/20',
    icon: '🤖',
    topics: [
      { name: 'Robotics Foundations', slug: 'robotics-basics', duration: '4h', done: false },
      { name: 'Sensors & Actuators', slug: 'sensors-actuators', duration: '4h', done: false },
      { name: 'Arduino Programming', slug: 'arduino', duration: '5h', done: false },
      { name: 'Raspberry Pi & Embedded AI', slug: 'raspberry-pi', duration: '5h', done: false },
      { name: 'Robot Kinematics', slug: 'kinematics', duration: '4h', done: false },
      { name: 'Control Systems', slug: 'control-systems', duration: '5h', done: false },
    ],
    description: 'Bridge software and hardware. Build real robots from scratch using embedded systems and control theory.',
  },
  {
    level: 6,
    title: 'ROS & AUTONOMY',
    subtitle: 'Autonomous Systems',
    color: 'from-red-600 to-orange-500',
    borderColor: 'border-red-500/50',
    glowColor: 'shadow-red-500/20',
    icon: '🛸',
    topics: [
      { name: 'ROS 2 Fundamentals', slug: 'ros-basics', duration: '6h', done: false },
      { name: 'SLAM (Mapping & Localization)', slug: 'slam', duration: '6h', done: false },
      { name: 'Path Planning Algorithms', slug: 'path-planning', duration: '5h', done: false },
      { name: 'Reinforcement Learning', slug: 'reinforcement-learning', duration: '7h', done: false },
      { name: 'Autonomous Navigation', slug: 'autonomous-navigation', duration: '6h', done: false },
      { name: 'Drone Programming', slug: 'drone-programming', duration: '5h', done: false },
    ],
    description: 'Build fully autonomous robots. Master ROS 2, SLAM navigation, and reinforcement learning for real-world deployment.',
  },
  {
    level: 7,
    title: 'AI AGENTS',
    subtitle: 'Agentic Systems',
    color: 'from-cyber-cyan to-teal-400',
    borderColor: 'border-cyber-cyan/50',
    glowColor: 'shadow-cyber-cyan/20',
    icon: '⚡',
    topics: [
      { name: 'AI Agent Architectures', slug: 'ai-agents', duration: '5h', done: false },
      { name: 'Multi-Agent Systems', slug: 'multi-agent', duration: '5h', done: false },
      { name: 'Tool Use & Function Calling', slug: 'tool-use', duration: '4h', done: false },
      { name: 'Edge AI & TinyML', slug: 'edge-ai', duration: '5h', done: false },
      { name: 'AI + Robotics Integration', slug: 'ai-robotics', duration: '6h', done: false },
      { name: 'RAG & Knowledge Systems', slug: 'rag', duration: '5h', done: false },
    ],
    description: 'Build intelligent autonomous agents that can reason, plan, and act in the real world. The cutting edge of AI.',
  },
  {
    level: 8,
    title: 'PRODUCTION AI',
    subtitle: 'MLOps & Deployment',
    color: 'from-cyber-green to-emerald-400',
    borderColor: 'border-cyber-green/50',
    glowColor: 'shadow-cyber-green/20',
    icon: '🚀',
    topics: [
      { name: 'AI Deployment (FastAPI)', slug: 'ai-deployment', duration: '5h', done: false },
      { name: 'Docker for AI/ML', slug: 'docker-ml', duration: '4h', done: false },
      { name: 'MLOps & Model Monitoring', slug: 'mlops', duration: '6h', done: false },
      { name: 'AI Infrastructure (K8s)', slug: 'ai-infrastructure', duration: '6h', done: false },
      { name: 'AI Security', slug: 'ai-security', duration: '4h', done: false },
      { name: 'Real-world AI Pipelines', slug: 'ai-pipelines', duration: '6h', done: false },
      { name: 'Capstone: Full AI System', slug: 'capstone', duration: '10h', done: false },
    ],
    description: 'Ship AI to production. Master the infrastructure, monitoring, and operations behind real AI systems at scale.',
  },
];

export default function RoadmapPage() {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(0);

  const totalTopics = ROADMAP_LEVELS.reduce((sum, l) => sum + l.topics.length, 0);
  const totalHours = ROADMAP_LEVELS.reduce((sum, l) => 
    sum + l.topics.reduce((s, t) => s + parseInt(t.duration), 0), 0
  );

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-20 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue text-sm font-mono mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
            Complete Learning Path
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white mb-4">
            AI & Robotics{' '}
            <span className="bg-clip-text text-transparent bg-cyber-gradient">Roadmap</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
            The complete structured path from absolute beginner to production AI engineer and robotics specialist.
          </p>
          <div className="flex justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl font-black text-cyber-blue font-mono">{ROADMAP_LEVELS.length}</div>
              <div className="text-xs text-slate-500 font-mono">Levels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-cyber-cyan font-mono">{totalTopics}</div>
              <div className="text-xs text-slate-500 font-mono">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-cyber-green font-mono">{totalHours}h</div>
              <div className="text-xs text-slate-500 font-mono">Content</div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap levels */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-slate-500 via-cyber-blue to-cyber-green opacity-30" />

          <div className="space-y-4">
            {ROADMAP_LEVELS.map((level, idx) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Level row */}
                <div
                  className={`relative ml-12 sm:ml-16 rounded-xl border cursor-pointer transition-all ${level.borderColor} ${
                    expandedLevel === level.level ? 'bg-cyber-dark/80' : 'bg-cyber-dark/40 hover:bg-cyber-dark/60'
                  } shadow-lg ${expandedLevel === level.level ? level.glowColor : ''}`}
                  onClick={() => setExpandedLevel(expandedLevel === level.level ? null : level.level)}
                >
                  {/* Circle on timeline */}
                  <div className={`absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-sm shadow-lg`}>
                    {level.icon}
                  </div>

                  <div className="p-4 sm:p-5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent border ${level.borderColor} flex-shrink-0`}>
                        L{level.level}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-display font-bold text-sm sm:text-lg leading-tight truncate">{level.title}</h3>
                        <p className="text-slate-500 text-xs font-mono truncate">{level.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex gap-4 text-right">
                        <div>
                          <div className="text-white font-mono text-sm font-bold">{level.topics.length}</div>
                          <div className="text-slate-600 text-xs font-mono">topics</div>
                        </div>
                        <div>
                          <div className="text-white font-mono text-sm font-bold">
                            {level.topics.reduce((s, t) => s + parseInt(t.duration), 0)}h
                          </div>
                          <div className="text-slate-600 text-xs font-mono">total</div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedLevel === level.level ? 180 : 0 }}
                        className="text-slate-400 text-lg"
                      >
                        ▾
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedLevel === level.level && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 px-5 pt-4 pb-5">
                          <p className="text-slate-400 text-sm mb-4">{level.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {level.topics.map((topic, ti) => (
                              <Link
                                key={ti}
                                href={`/learn/${topic.slug}`}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                  topic.done
                                    ? 'border-cyber-green/30 bg-cyber-green/10 hover:bg-cyber-green/20'
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                }`}
                                onClick={e => e.stopPropagation()}
                              >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs flex-shrink-0 ${
                                  topic.done ? 'border-cyber-green bg-cyber-green text-black' : 'border-slate-600'
                                }`}>
                                  {topic.done ? '✓' : ''}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white text-sm font-medium truncate">{topic.name}</div>
                                </div>
                                <div className="text-slate-500 text-xs font-mono flex-shrink-0">{topic.duration}</div>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4">
                            <Link
                              href="/learn"
                              onClick={e => e.stopPropagation()}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${level.color} text-black text-sm font-mono font-bold hover:opacity-90 transition-opacity`}
                            >
                              Start Level {level.level} →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-10 sm:mt-16 text-center p-6 sm:p-8 rounded-2xl border border-cyber-blue/30 bg-cyber-dark/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative z-10">
            <div className="text-3xl sm:text-4xl mb-4">🚀</div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">Ready to Start?</h3>
            <p className="text-slate-400 mb-6">Begin your journey from Level 0. No prior experience required.</p>
            <Link href="/learn">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="cyber-btn-primary text-white px-8 py-3 font-mono font-bold"
              >
                Begin Learning →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
