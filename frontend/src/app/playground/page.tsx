'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import toast from 'react-hot-toast';

// Default blank-slate starters — one comment per language
const STARTER_SNIPPETS: Record<string, string> = {
  python: `# Write your Python code here\n`,
  javascript: `// Write your JavaScript code here\n`,
  robotics:   `# Write your Python robotics code here\n`,
};

// Full example programs — loaded by the "Quick Load" buttons
const EXAMPLES: Record<string, string> = {
  python: `# AIRO BOTS — Neural Network from scratch
import math
import random

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        self.W1 = [[random.gauss(0, 0.1) for _ in range(hidden_size)] for _ in range(input_size)]
        self.W2 = [[random.gauss(0, 0.1) for _ in range(output_size)] for _ in range(hidden_size)]
        self.b1 = [0.0] * hidden_size
        self.b2 = [0.0] * output_size

    def sigmoid(self, x):
        return 1 / (1 + math.exp(-max(-500, min(500, x))))

    def forward(self, x):
        hidden = [self.sigmoid(self.b1[j] + sum(x[i] * self.W1[i][j] for i in range(len(x)))) for j in range(len(self.W1[0]))]
        output = [self.sigmoid(self.b2[j] + sum(hidden[i] * self.W2[i][j] for i in range(len(hidden)))) for j in range(len(self.W2[0]))]
        return output

X = [[0,0],[0,1],[1,0],[1,1]]
y = [0, 1, 1, 0]
nn = NeuralNetwork(2, 4, 1)
print("Neural Network — XOR forward pass")
for xi, yi in zip(X, y):
    pred = nn.forward(xi)
    print(f"  Input: {xi}  Expected: {yi}  Predicted: {pred[0]:.4f}")
print("Done! Add backpropagation to train.")
`,
  javascript: `// AIRO BOTS — Gradient Descent visualizer
class GradientDescent {
  constructor(lr = 0.1) { this.lr = lr; this.history = []; }
  objective(x) { return x * x + 3 * x + 2; }
  gradient(x)  { return 2 * x + 3; }
  optimize(x0, steps = 20) {
    let x = x0;
    for (let i = 0; i < steps; i++) {
      this.history.push({ i, x, fx: this.objective(x) });
      x -= this.lr * this.gradient(x);
    }
    return x;
  }
}

const gd  = new GradientDescent(0.1);
const min = gd.optimize(10, 25);
console.log("=== Gradient Descent: f(x) = x² + 3x + 2 ===");
gd.history.filter((_, i) => i % 5 === 0).forEach(h =>
  console.log(\`Iter \${String(h.i).padStart(2)}: x=\${h.x.toFixed(5)}, f(x)=\${h.fx.toFixed(5)}\`)
);
console.log(\`\\nMinimum ≈ x=\${min.toFixed(8)}, f(x)=\${gd.objective(min).toFixed(8)}\`);
`,
  robotics: `# AIRO BOTS — 2D Differential Drive Robot
import math

class Robot:
    def __init__(self, x=0.0, y=0.0, theta=0.0):
        self.x, self.y, self.theta = x, y, theta
        self.wheel_base = 0.5
        self.path = [(x, y)]

    def move(self, vl, vr, dt=0.1):
        v = (vl + vr) / 2.0
        omega = (vr - vl) / self.wheel_base
        self.x += v * math.cos(self.theta) * dt
        self.y += v * math.sin(self.theta) * dt
        self.theta = math.atan2(math.sin(self.theta + omega * dt), math.cos(self.theta + omega * dt))
        self.path.append((round(self.x, 3), round(self.y, 3)))

    def pose(self):
        return f"x={self.x:.2f}m  y={self.y:.2f}m  θ={math.degrees(self.theta):.1f}°"

robot = Robot()
print("=== Robot Simulation — Square Path ===")
for name, vl, vr, steps in [("Forward",1,1,20),("Turn",0.2,0.8,10)]*4:
    for _ in range(steps): robot.move(vl, vr)
    print(f"  After {name}: {robot.pose()}")
print(f"\\nPath points: {len(robot.path)}")
`,
};

const LANGUAGES = [
  { id: 'python', label: 'Python', icon: '🐍', color: 'text-yellow-400' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡', color: 'text-yellow-300' },
  { id: 'robotics', label: 'Robotics (Python)', icon: '🤖', color: 'text-cyber-cyan' },
];

export default function PlaygroundPage() {
  const { user } = useAuthStore();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_SNIPPETS['python'] ?? '# Write your Python code here\n');
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
      // Allow up to 20 s for Python cold-starts on Piston
      const res = await api.post('/playground/execute', { code, language }, { timeout: 20000 });
      setOutput(res.data.output || '✓ Executed (no output)');
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setOutput('Error: execution timed out — try a shorter snippet');
      } else {
        setOutput(err.response?.data?.error || 'Execution failed');
      }
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
    // Ctrl+Enter / Cmd+Enter → run code (check before Enter handler)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      runCode();
      return;
    }

    // Tab → insert 4 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end   = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd   = start + 4;
        }
      }, 0);
    }

    // Enter → auto-indent (preserve current indent; add +4 after Python block openers)
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end   = e.currentTarget.selectionEnd;

      // Grab the text of the current line (up to the cursor)
      const textBefore  = code.substring(0, start);
      const lineStart   = textBefore.lastIndexOf('\n') + 1;
      const currentLine = textBefore.substring(lineStart);

      // Current indentation (leading spaces/tabs)
      const indent      = currentLine.match(/^(\s*)/)?.[1] ?? '';

      // Python block-opener keywords — lines ending with ':'
      const extraIndent = currentLine.trimEnd().endsWith(':') ? '    ' : '';

      const insertion = '\n' + indent + extraIndent;
      setCode(code.substring(0, start) + insertion + code.substring(end));

      const newPos = start + insertion.length;
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd   = newPos;
        }
      }, 0);
    }
  };

  const switchLanguage = (lang: string) => {
    setLanguage(lang);
    setCode(STARTER_SNIPPETS[lang] ?? '');
    setOutput('');
  };

  const loadExample = (lang: string) => {
    setLanguage(lang);
    setCode(EXAMPLES[lang] ?? STARTER_SNIPPETS[lang] ?? '');
    setOutput('');
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="pt-16 sm:pt-20 h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-cyber-blue/20 bg-cyber-dark/80 backdrop-blur px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-cyber-blue font-mono text-xs sm:text-sm font-bold">AIRO BOTS — Playground</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 overflow-x-auto">
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => switchLanguage(l.id)}
                  className={`px-2 sm:px-3 py-1.5 rounded text-xs font-mono transition-all whitespace-nowrap ${
                    language === l.id
                      ? 'bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {l.icon} <span className="hidden sm:inline">{l.label}</span>
                  <span className="sm:hidden">{l.id === 'robotics' ? 'Robot' : l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main area — vertical on mobile, horizontal on lg+ */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left panel: editor / saves */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
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
                          <span className="text-white font-mono text-sm font-medium group-hover:text-cyber-blue transition-colors">{save.name ?? save.title}</span>
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
            <div className="border-t border-cyber-blue/20 bg-cyber-dark/80 px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 flex-shrink-0">
              <motion.button
                onClick={runCode}
                disabled={isRunning}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-cyber-green/20 border border-cyber-green/50 text-cyber-green rounded font-mono text-xs sm:text-sm hover:bg-cyber-green/30 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {isRunning ? (
                  <><span className="animate-spin">⚙</span> Running...</>
                ) : (
                  <><span>▶</span> Run <span className="hidden sm:inline">(Ctrl+Enter)</span></>
                )}
              </motion.button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  placeholder="snippet name..."
                  className="flex-1 min-w-0 bg-transparent border border-cyber-blue/20 rounded px-3 py-1.5 text-xs font-mono text-white placeholder-slate-600 outline-none focus:border-cyber-blue/50"
                />
                <button
                  onClick={saveCode}
                  className="px-3 py-1.5 bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue rounded font-mono text-xs hover:bg-cyber-blue/20 transition-all whitespace-nowrap"
                >
                  💾 Save
                </button>
              </div>
              <span className="hidden sm:block text-slate-600 text-xs font-mono whitespace-nowrap">
                {code.split('\n').length} lines · {code.length} chars
              </span>
            </div>
          </div>

          {/* Right panel: output — full-width on mobile, fixed sidebar on lg+ */}
          <div className="h-56 sm:h-64 lg:h-auto lg:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-cyber-blue/20 flex flex-col">
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
                <div className="space-y-2 font-mono text-xs text-cyber-green">
                  <div className="flex items-center gap-2">
                    <span className="animate-spin inline-block">⚙</span>
                    <span className="animate-pulse">Executing {language === 'javascript' ? 'JavaScript' : 'Python'}…</span>
                  </div>
                  {language !== 'javascript' && (
                    <div className="text-slate-600">
                      Running via local Python interpreter…
                    </div>
                  )}
                </div>
              ) : output ? (
                <pre className={`font-mono text-xs leading-relaxed whitespace-pre-wrap ${
                  output.startsWith('Error:') || output.startsWith('[stderr]')
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}>{output}</pre>
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
              <div className="text-xs font-mono text-slate-500 mb-2">Load Example:</div>
              <div className="flex flex-wrap gap-1">
                {Object.keys(EXAMPLES).map(lang => {
                  const meta = LANGUAGES.find(l => l.id === lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => loadExample(lang)}
                      className="px-2 py-1 rounded text-xs font-mono bg-cyber-dark border border-cyber-blue/20 text-slate-400 hover:text-white hover:border-cyber-blue/50 transition-all"
                    >
                      {meta?.icon} {meta?.label ?? lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
