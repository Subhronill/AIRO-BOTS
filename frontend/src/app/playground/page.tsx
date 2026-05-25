'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

const STARTER_SNIPPETS: Record<string, string> = {
  python: `# AIRO BOTS - Python AI Playground
import math
import random

# Simple Neural Network from scratch
class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        self.W1 = [[random.gauss(0, 0.1) for _ in range(hidden_size)] for _ in range(input_size)]
        self.W2 = [[random.gauss(0, 0.1) for _ in range(output_size)] for _ in range(hidden_size)]
        self.b1 = [0.0] * hidden_size
        self.b2 = [0.0] * output_size
    
    def sigmoid(self, x):
        return 1 / (1 + math.exp(-max(-500, min(500, x))))
    
    def forward(self, x):
        # Hidden layer
        hidden = []
        for j in range(len(self.W1[0])):
            z = self.b1[j]
            for i in range(len(x)):
                z += x[i] * self.W1[i][j]
            hidden.append(self.sigmoid(z))
        
        # Output layer
        output = []
        for j in range(len(self.W2[0])):
            z = self.b2[j]
            for i in range(len(hidden)):
                z += hidden[i] * self.W2[i][j]
            output.append(self.sigmoid(z))
        
        return output

# XOR dataset
X = [[0,0],[0,1],[1,0],[1,1]]
y = [0, 1, 1, 0]

nn = NeuralNetwork(2, 4, 1)
print("Neural Network initialized!")
print(f"Architecture: 2 -> 4 -> 1")
print(f"Input layer: 2 neurons")
print(f"Hidden layer: 4 neurons (sigmoid)")
print(f"Output layer: 1 neuron (sigmoid)")
print()
print("Testing forward pass on XOR dataset:")
for xi, yi in zip(X, y):
    pred = nn.forward(xi)
    print(f"Input: {xi} | Expected: {yi} | Predicted: {pred[0]:.4f}")

print()
print("Ready for training! Add backpropagation to improve accuracy.")
`,
  javascript: `// AIRO BOTS - JavaScript AI Playground

// Gradient Descent Visualizer
class GradientDescent {
  constructor(learningRate = 0.1) {
    this.lr = learningRate;
    this.history = [];
  }
  
  // Minimize f(x) = x^2 + 3x + 2
  objective(x) {
    return x * x + 3 * x + 2;
  }
  
  gradient(x) {
    return 2 * x + 3;  // derivative of f(x)
  }
  
  optimize(startX, iterations = 20) {
    let x = startX;
    this.history = [];
    
    for (let i = 0; i < iterations; i++) {
      const fx = this.objective(x);
      const grad = this.gradient(x);
      this.history.push({ iteration: i, x, fx, gradient: grad });
      x = x - this.lr * grad;
    }
    
    return x;
  }
}

const optimizer = new GradientDescent(0.1);
const minimum = optimizer.optimize(10.0, 25);

console.log("=== Gradient Descent Optimization ===");
console.log("Function: f(x) = x² + 3x + 2");
console.log("Minimum at x = -1.5, f(-1.5) = -0.25");
console.log("");
console.log("Training Progress:");

optimizer.history.forEach((h, i) => {
  if (i % 5 === 0 || i === optimizer.history.length - 1) {
    console.log(\`Iter \${String(h.iteration).padStart(2)}: x=\${h.x.toFixed(6)}, f(x)=\${h.fx.toFixed(6)}, grad=\${h.gradient.toFixed(6)}\`);
  }
});

console.log(\`\\nFinal x = \${minimum.toFixed(8)}\`);
console.log(\`Minimum value = \${optimizer.objective(minimum).toFixed(8)}\`);
console.log("Optimization complete! ✓");
`,
  robotics: `# AIRO BOTS - Robotics Simulation
import math

class Robot:
    """2D differential drive robot simulation"""
    
    def __init__(self, x=0.0, y=0.0, theta=0.0):
        self.x = x
        self.y = y
        self.theta = theta  # heading in radians
        self.wheel_base = 0.5  # meters
        self.path = [(x, y)]
        self.sensors = {}
    
    def move(self, v_left, v_right, dt=0.1):
        """Update robot pose using differential drive kinematics"""
        v = (v_left + v_right) / 2.0
        omega = (v_right - v_left) / self.wheel_base
        
        self.x += v * math.cos(self.theta) * dt
        self.y += v * math.sin(self.theta) * dt
        self.theta += omega * dt
        
        # Normalize angle to [-pi, pi]
        self.theta = math.atan2(math.sin(self.theta), math.cos(self.theta))
        self.path.append((round(self.x, 3), round(self.y, 3)))
    
    def read_lidar(self, obstacles):
        """Simulate LIDAR sensor readings"""
        readings = {}
        angles = range(0, 360, 45)
        for angle in angles:
            rad = math.radians(angle)
            dist = 10.0  # max range
            for obs in obstacles:
                dx = obs[0] - self.x
                dy = obs[1] - self.y
                dist_to_obs = math.sqrt(dx**2 + dy**2)
                if dist_to_obs < dist:
                    dist = round(dist_to_obs, 2)
            readings[angle] = dist
        return readings
    
    def pose(self):
        return f"Pose: x={self.x:.2f}m, y={self.y:.2f}m, θ={math.degrees(self.theta):.1f}°"

# Simulate a robot navigating a square path
robot = Robot(0, 0, 0)
obstacles = [(3, 3), (5, 1), (2, 6)]

print("=== AIRO BOTS Robot Simulation ===")
print("Robot initialized at origin")
print(robot.pose())
print()

# Navigate square path
commands = [
    ("Forward", 1.0, 1.0, 20),
    ("Turn Left", 0.2, 0.8, 10),
    ("Forward", 1.0, 1.0, 20),
    ("Turn Left", 0.2, 0.8, 10),
    ("Forward", 1.0, 1.0, 20),
    ("Turn Left", 0.2, 0.8, 10),
    ("Forward", 1.0, 1.0, 20),
]

for cmd_name, vl, vr, steps in commands:
    for _ in range(steps):
        robot.move(vl, vr, 0.1)
    print(f"After '{cmd_name}': {robot.pose()}")

print()
print(f"Path points recorded: {len(robot.path)}")
lidar = robot.read_lidar(obstacles)
print("LIDAR readings (degrees: distance):")
for angle, dist in lidar.items():
    bar = "█" * int(dist)
    print(f"  {angle:3d}°: {dist:.2f}m {bar}")
`
};

const LANGUAGES = [
  { id: 'python', label: 'Python', icon: '🐍', color: 'text-yellow-400' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡', color: 'text-yellow-300' },
  { id: 'robotics', label: 'Robotics (Python)', icon: '🤖', color: 'text-cyber-cyan' },
];

export default function PlaygroundPage() {
  const { user } = useAuthStore();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_SNIPPETS['python']);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saves, setSaves] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'saves'>('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user) loadSaves();
  }, [user]);

  const loadSaves = async () => {
    try {
      const res = await api.get('/playground');
      setSaves(res.data);
    } catch {}
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const res = await api.post('/playground/execute', { code, language });
      setOutput(res.data.output || 'No output');
    } catch (err: any) {
      setOutput(err.response?.data?.error || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = async () => {
    if (!user) { toast.error('Login to save code'); return; }
    if (!saveName.trim()) { toast.error('Enter a name'); return; }
    try {
      await api.post('/playground', { name: saveName, code, language });
      toast.success('Saved!');
      setSaveName('');
      loadSaves();
    } catch {
      toast.error('Failed to save');
    }
  };

  const loadSave = (save: any) => {
    setCode(save.code);
    setLanguage(save.language);
    setActiveTab('editor');
    toast.success(`Loaded: ${save.name}`);
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      runCode();
    }
  };

  const switchLanguage = (lang: string) => {
    setLanguage(lang);
    setCode(STARTER_SNIPPETS[lang] || '');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="pt-20 h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-cyber-blue/20 bg-cyber-dark/80 backdrop-blur px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-cyber-blue font-mono text-sm font-bold">AIRO BOTS — Code Playground</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => switchLanguage(l.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                    language === l.id
                      ? 'bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {l.icon} {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel: editor / saves */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tab bar */}
            <div className="flex border-b border-cyber-blue/20 bg-cyber-dark/50">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 text-xs font-mono transition-colors ${activeTab === 'editor' ? 'text-cyber-blue border-b border-cyber-blue' : 'text-slate-500 hover:text-slate-300'}`}
              >
                📝 Editor
              </button>
              <button
                onClick={() => { setActiveTab('saves'); loadSaves(); }}
                className={`px-4 py-2 text-xs font-mono transition-colors ${activeTab === 'saves' ? 'text-cyber-blue border-b border-cyber-blue' : 'text-slate-500 hover:text-slate-300'}`}
              >
                💾 Saved ({saves.length})
              </button>
            </div>

            {activeTab === 'editor' ? (
              <div className="flex-1 relative overflow-hidden">
                {/* Line numbers + code */}
                <div className="absolute inset-0 flex overflow-auto">
                  {/* Line numbers */}
                  <div className="w-12 flex-shrink-0 bg-cyber-dark/80 border-r border-cyber-blue/10 pt-4 pb-4 text-right pr-3 select-none">
                    {code.split('\n').map((_, i) => (
                      <div key={i} className="text-slate-600 text-xs font-mono leading-6">{i + 1}</div>
                    ))}
                  </div>
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    onKeyDown={handleTabKey}
                    spellCheck={false}
                    className="flex-1 bg-transparent text-green-300 font-mono text-sm leading-6 p-4 resize-none outline-none"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                {saves.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <div className="text-4xl mb-3">💾</div>
                    <p className="font-mono text-sm">No saved snippets yet</p>
                    <p className="text-xs mt-1">Write code and save it here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {saves.map((save: any) => (
                      <div
                        key={save.id}
                        onClick={() => loadSave(save)}
                        className="p-3 rounded border border-cyber-blue/20 bg-cyber-dark/50 hover:border-cyber-blue/50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-mono text-sm font-medium group-hover:text-cyber-blue transition-colors">{save.name}</span>
                          <span className="text-xs text-slate-500 font-mono">{save.language}</span>
                        </div>
                        <div className="text-slate-500 text-xs font-mono truncate">
                          {save.code.split('\n').slice(0, 2).join(' | ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom bar */}
            <div className="border-t border-cyber-blue/20 bg-cyber-dark/80 px-4 py-2 flex items-center gap-3 flex-shrink-0">
              <motion.button
                onClick={runCode}
                disabled={isRunning}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2 bg-cyber-green/20 border border-cyber-green/50 text-cyber-green rounded font-mono text-sm hover:bg-cyber-green/30 transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <><span className="animate-spin">⚙</span> Running...</>
                ) : (
                  <><span>▶</span> Run (Ctrl+Enter)</>
                )}
              </motion.button>
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  placeholder="snippet name..."
                  className="flex-1 bg-transparent border border-cyber-blue/20 rounded px-3 py-1.5 text-xs font-mono text-white placeholder-slate-600 outline-none focus:border-cyber-blue/50"
                />
                <button
                  onClick={saveCode}
                  className="px-3 py-1.5 bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue rounded font-mono text-xs hover:bg-cyber-blue/20 transition-all"
                >
                  💾 Save
                </button>
              </div>
              <span className="text-slate-600 text-xs font-mono">
                {code.split('\n').length} lines · {code.length} chars
              </span>
            </div>
          </div>

          {/* Right panel: output */}
          <div className="w-96 flex-shrink-0 border-l border-cyber-blue/20 flex flex-col">
            <div className="border-b border-cyber-blue/20 px-4 py-2 flex items-center justify-between bg-cyber-dark/50">
              <span className="text-xs font-mono text-slate-400">⚡ Output Console</span>
              <button
                onClick={() => setOutput('')}
                className="text-xs text-slate-600 hover:text-slate-400 font-mono"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-black/30">
              {isRunning ? (
                <div className="flex items-center gap-2 text-cyber-green font-mono text-sm">
                  <span className="animate-spin">⚙</span>
                  <span className="animate-pulse">Executing...</span>
                </div>
              ) : output ? (
                <pre className="text-green-400 font-mono text-xs leading-relaxed whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="text-slate-600 font-mono text-xs">
                  <div className="mb-4">Press <span className="text-cyber-blue">▶ Run</span> or <span className="text-cyber-blue">Ctrl+Enter</span> to execute</div>
                  <div className="space-y-1 text-slate-700">
                    <div>// Console output appears here</div>
                    <div>// Errors shown in red</div>
                    <div>// Tip: Use print() in Python</div>
                    <div>// Tip: Use console.log() in JS</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick examples */}
            <div className="border-t border-cyber-blue/20 p-3 bg-cyber-dark/50">
              <div className="text-xs font-mono text-slate-500 mb-2">Quick Load:</div>
              <div className="flex flex-wrap gap-1">
                {Object.keys(STARTER_SNIPPETS).map(lang => (
                  <button
                    key={lang}
                    onClick={() => switchLanguage(lang)}
                    className="px-2 py-1 rounded text-xs font-mono bg-cyber-dark border border-cyber-blue/20 text-slate-400 hover:text-white hover:border-cyber-blue/50 transition-all"
                  >
                    {LANGUAGES.find(l => l.id === lang)?.icon} {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
