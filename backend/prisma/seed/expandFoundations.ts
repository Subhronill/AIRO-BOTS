/**
 * expandFoundations.ts
 * Replaces the 3 placeholder chapters in "AI Foundations" with the full
 * roadmap chapter set (Phase 0 + Phase 1 detailed, Phase 2-7 overviews).
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed/expandFoundations.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─── helpers ────────────────────────────────────────────────────────────────
function q(
  text: string,
  options: { id: string; text: string }[],
  correctAnswer: string,
  explanation: string,
  orderIndex: number,
) {
  return { text, options: JSON.stringify(options), correctAnswer, explanation, orderIndex };
}

// ─── chapter definitions ─────────────────────────────────────────────────────
// Each entry: slug, title, description, content (markdown), codeExample, xpReward, difficulty, orderIndex, questions[]
const CHAPTERS = [
  // ══════════════════════════════════════════════
  // PHASE 0 — FOUNDATIONS BEFORE AI
  // ══════════════════════════════════════════════
  {
    slug: 'ch0-0-what-is-ai',
    title: 'What is Artificial Intelligence?',
    description: 'Definition, history, Narrow vs General AI, and the modern AI ecosystem.',
    orderIndex: 0,
    xpReward: 50,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `# Your very first AI-flavored Python line!
print("Hello, AI World!")

# A tiny rule-based "AI" — the simplest kind
def is_spam(message):
    keywords = ["win", "prize", "click here", "free money"]
    for word in keywords:
        if word in message.lower():
            return True
    return False

print(is_spam("You won a free prize!"))  # True
print(is_spam("Meeting at 3pm today"))   # False`,
    content: `# Chapter 0.0 — What is Artificial Intelligence?

## 🎯 What You'll Learn
By the end of this chapter you'll know what AI actually is (and isn't), its 70-year history in plain English, how it differs from Machine Learning and Deep Learning, and where AI shows up in everyday life.

---

## 1. What Is Intelligence?

Before we define *Artificial* Intelligence, let's think about natural intelligence.

**Intelligence** is the ability to:
- Learn from experience
- Solve problems
- Adapt to new situations
- Understand and use language
- Recognize patterns

Humans, animals, and even some insects demonstrate forms of intelligence. **Artificial Intelligence (AI)** is our attempt to give these same abilities to machines.

> 💡 **Simple definition:** AI is software that can do things that would normally require human intelligence.

---

## 2. A Brief History of AI

| Year | Event |
|------|-------|
| **1950** | Alan Turing asks *"Can machines think?"* and proposes the Turing Test |
| **1956** | John McCarthy coins the term **"Artificial Intelligence"** at Dartmouth College |
| **1960s** | Early chatbot ELIZA created at MIT — fooled people into thinking it was human |
| **1980s** | "Expert systems" boom — rule-based programs that mimicked specialists |
| **1997** | IBM's Deep Blue defeats world chess champion Garry Kasparov |
| **2012** | Deep Learning revolution — AlexNet crushes image recognition benchmarks |
| **2017** | Google introduces the **Transformer** architecture (the brain behind GPT) |
| **2022** | ChatGPT launches — AI becomes mainstream overnight |
| **Today** | AI is in your phone, your search engine, your car, and your doctor's office |

### Why did AI take so long?

Three things had to come together:
1. **Algorithms** — clever mathematical methods (we had some since the 50s)
2. **Data** — massive datasets to learn from (the internet provided this)
3. **Compute** — fast GPUs to crunch numbers (affordable from ~2012)

All three aligned around 2012 and the modern AI era began.

---

## 3. AI vs Machine Learning vs Deep Learning

These three terms are often used interchangeably. They shouldn't be.

\`\`\`diagram
ARTIFICIAL INTELLIGENCE: any technique that lets machines simulate human thinking
  MACHINE LEARNING: systems that learn from data without being explicitly programmed
    DEEP LEARNING: ML using multi-layer neural networks
\`\`\`

- **AI** is the broad field — the goal
- **ML** is one approach to AI — learning from data
- **Deep Learning** is a powerful subset of ML using neural networks

**Analogy:** AI is like "transportation." ML is like "cars." Deep Learning is like "electric self-driving cars."

---

## 4. Narrow AI vs General AI vs Super AI

### Narrow AI (ANI — Artificial Narrow Intelligence)
- Does **one specific thing** very well
- Every AI system that exists today is Narrow AI
- Examples: Face ID on your phone, Netflix recommendations, Siri, chess engines, spam filters

### General AI (AGI — Artificial General Intelligence)
- Hypothetical AI that can do **anything a human can do**
- Can reason, learn, and adapt across completely different domains
- Does not exist yet — researchers disagree on whether it's 5 years or 50 years away

### Super AI (ASI — Artificial Super Intelligence)
- Hypothetical AI that **surpasses human intelligence** in every domain
- Currently science fiction
- The subject of much debate among AI safety researchers

> 🔑 **Key fact:** Everything you see in the news today — ChatGPT, image generators, self-driving cars — is Narrow AI.

---

## 5. The AI Domains (Big Picture)

AI is not one thing. It's a collection of fields:

| Domain | What it does | Example |
|--------|-------------|---------|
| **Machine Learning** | Learns patterns from data | Spam filter |
| **Deep Learning** | Uses neural networks for complex patterns | Image recognition |
| **Natural Language Processing (NLP)** | Understands and generates text | ChatGPT, translation |
| **Computer Vision** | Understands images and video | Face unlock, medical scans |
| **Robotics** | Physical AI systems that act in the world | Robot arms, autonomous vehicles |
| **Reinforcement Learning** | Learns by trial and error with rewards | Game-playing AI, robot locomotion |

You'll study all of these on this roadmap.

---

## 6. AI in the Real World

AI is already all around you, often invisibly:

**Your phone:**
- Face ID = Computer Vision
- Keyboard autocomplete = NLP
- Photo organization = Machine Learning

**The internet:**
- Google Search ranking = ML + NLP
- YouTube/Netflix recommendations = Recommender systems (ML)
- Email spam filtering = Classification (ML)

**Healthcare:**
- Detecting cancer in X-rays
- Drug discovery acceleration
- Predicting patient outcomes

**Finance:**
- Fraud detection on credit cards
- Algorithmic trading
- Credit scoring

**Transport:**
- Tesla Autopilot = Computer Vision + RL
- Google Maps routing = Optimization algorithms

---

## 7. AI Myths vs Reality

| Myth | Reality |
|------|---------|
| AI is always right | AI makes mistakes — often confidently |
| AI will replace all jobs | AI changes jobs; creates new ones too |
| AI is conscious/sentient | Current AI has zero consciousness — it's pattern matching |
| AI "understands" language | LLMs predict the next token — they don't "understand" like humans |
| AI is too hard to learn | You're learning it right now — one chapter at a time |

---

## 8. The Modern AI Ecosystem

When you work in AI, you'll use tools from this ecosystem:

**Languages:** Python (dominant), R, Julia
**ML Frameworks:** TensorFlow, PyTorch, scikit-learn
**Data Tools:** Pandas, NumPy, Spark
**Cloud Platforms:** AWS, Google Cloud, Azure (all have AI services)
**Model Hubs:** Hugging Face (thousands of pre-built models)
**Notebooks:** Jupyter, Google Colab

You'll learn every one of these in this course.

---

## ✅ Key Takeaways

1. AI = making machines do things that normally require human intelligence
2. All AI today is **Narrow AI** — extremely good at one thing
3. ML ⊂ AI, Deep Learning ⊂ ML (nested, not interchangeable)
4. AI needs three things: algorithms + data + compute
5. AI is already in your daily life, mostly invisibly

---

## 🔜 What's Next
Chapter 0.1 — **Computer Fundamentals**: Before building AI, you need to understand the machine that runs it.`,
    questions: [
      q('What does the acronym "AI" stand for?',
        [{ id: 'a', text: 'Automated Intelligence' }, { id: 'b', text: 'Artificial Intelligence' }, { id: 'c', text: 'Advanced Integration' }, { id: 'd', text: 'Algorithmic Interface' }],
        'b', 'AI stands for Artificial Intelligence — the field of making machines simulate human-like thinking.', 0),
      q('Which type of AI exists in the real world today?',
        [{ id: 'a', text: 'Artificial General Intelligence (AGI)' }, { id: 'b', text: 'Artificial Super Intelligence (ASI)' }, { id: 'c', text: 'Artificial Narrow Intelligence (ANI)' }, { id: 'd', text: 'Both AGI and ASI' }],
        'c', 'All AI systems today are Narrow AI — great at one specific task but unable to generalize across domains.', 1),
      q('Which relationship correctly describes ML and AI?',
        [{ id: 'a', text: 'AI is a subset of ML' }, { id: 'b', text: 'They are completely separate fields' }, { id: 'c', text: 'ML is a subset of AI' }, { id: 'd', text: 'Deep Learning and AI are the same thing' }],
        'c', 'Machine Learning is one approach within the broader field of Artificial Intelligence.', 2),
      q('Who coined the term "Artificial Intelligence"?',
        [{ id: 'a', text: 'Alan Turing' }, { id: 'b', text: 'Geoffrey Hinton' }, { id: 'c', text: 'John McCarthy' }, { id: 'd', text: 'Elon Musk' }],
        'c', 'John McCarthy coined the term "Artificial Intelligence" at the 1956 Dartmouth Conference.', 3),
      q('Which of the following is a real-world example of Narrow AI?',
        [{ id: 'a', text: 'A robot that can do any job a human can do' }, { id: 'b', text: 'Netflix recommendation system' }, { id: 'c', text: 'An AI that fully understands human emotions' }, { id: 'd', text: 'AGI-level reasoning assistant' }],
        'b', 'Netflix recommendations is Narrow AI — it does one thing (recommend content) very well using machine learning.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch0-1-computer-fundamentals',
    title: 'Computer Fundamentals',
    description: 'How computers work, CPU/RAM/Storage, binary, operating systems, internet, APIs, and cloud basics.',
    orderIndex: 1,
    xpReward: 50,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `import platform, psutil

# See your own system information with Python
print("OS:", platform.system(), platform.release())
print("CPU cores:", psutil.cpu_count())
print("RAM (GB):", round(psutil.virtual_memory().total / 1e9, 1))
print("Disk (GB):", round(psutil.disk_usage('/').total / 1e9, 1))

# Binary — how computers represent numbers
number = 42
print(f"\\n{number} in binary is: {bin(number)}")
print(f"{number} in hex is:    {hex(number)}")`,
    content: `# Chapter 0.1 — Computer Fundamentals

## 🎯 What You'll Learn
How computers actually work under the hood — hardware components, binary numbers, operating systems, the internet, APIs, and cloud computing. This is the foundation AI runs on.

---

## 1. How Computers Work

A computer is a machine that:
1. **Receives input** (keyboard, mouse, sensors, microphone)
2. **Processes data** (CPU does the math)
3. **Stores results** (RAM for now, disk for later)
4. **Produces output** (screen, speakers, network)

**Analogy:** Think of a computer like a kitchen:
- CPU = the chef (does the work)
- RAM = the counter space (fast, temporary workspace)
- Hard Drive = the pantry (slow, permanent storage)
- Input devices = ingredients coming in
- Output devices = finished dishes going out

---

## 2. The Core Hardware Components

### CPU — Central Processing Unit
- The "brain" of the computer
- Executes billions of instructions per second
- Speed measured in GHz (e.g., 3.5 GHz = 3.5 billion cycles/sec)
- AI training uses CPUs for general work, GPUs for heavy math
- Modern CPUs have **multiple cores** (like having multiple chefs)

### RAM — Random Access Memory
- Temporary, ultra-fast storage
- Holds data your programs are **actively using**
- When you close a program, its RAM is cleared
- Measured in GB (8 GB, 16 GB, 32 GB...)
- **For AI work:** 16 GB minimum, 32 GB+ preferred

### Storage (HDD / SSD)
- Permanent storage — data survives power off
- **HDD (Hard Disk Drive):** Mechanical, slower, cheap, large capacity
- **SSD (Solid State Drive):** Flash memory, much faster, more expensive
- Measured in GB and TB (1 TB = 1000 GB)

### GPU — Graphics Processing Unit
- Originally for rendering games and graphics
- Turns out to be **perfect for AI** — can do thousands of math operations in parallel
- NVIDIA GPUs (CUDA) are the industry standard for AI training
- Training large AI models without a GPU would take weeks or months

### How They Work Together
\`\`\`
CPU reads a task from RAM
  ↓
CPU sends heavy math to GPU
  ↓
GPU processes in parallel (thousands of cores)
  ↓
Result stored back in RAM
  ↓
Eventually saved to disk
\`\`\`

---

## 3. Binary & Data Representation

Computers only understand **two states**: ON (1) and OFF (0). This is **binary**.

### Why Binary?
Electrical circuits are easiest to build with two states — current flowing or not.

### Binary Numbers
| Decimal | Binary |
|---------|--------|
| 0 | 0000 |
| 1 | 0001 |
| 2 | 0010 |
| 4 | 0100 |
| 8 | 1000 |
| 42 | 101010 |

### Bits and Bytes
- **1 bit** = a single 0 or 1
- **8 bits** = 1 byte
- **1,024 bytes** = 1 kilobyte (KB)
- **1,024 KB** = 1 megabyte (MB)
- **1,024 MB** = 1 gigabyte (GB)
- **1,024 GB** = 1 terabyte (TB)

### How Text is Stored
Every character maps to a number (ASCII/Unicode): A=65, B=66, a=97...
- "Hi" = [72, 105] = binary representation

### How Images are Stored
- A pixel = 3 numbers (Red, Green, Blue), each 0–255
- A 1920×1080 image = 1920 × 1080 × 3 = ~6 million numbers
- **This is why AI image models need so much data and compute**

---

## 4. Operating Systems

An **Operating System (OS)** is the software that manages all hardware and provides a platform for other software.

| OS | Used For |
|----|---------|
| **Windows** | Personal computers, most common |
| **macOS** | Apple computers |
| **Linux** | Servers, supercomputers, AI research (most AI runs on Linux) |
| **Android/iOS** | Mobile |

### Why Linux Matters for AI
- Most AI servers and cloud machines run Linux
- Free and open-source
- Stable, powerful, customizable
- Docker, Kubernetes, most AI tools are built for Linux first

---

## 5. Internet Basics

The internet is a global network of computers communicating via standardized protocols.

### Key Concepts
- **IP Address** — unique address for every device (like a postal address)
- **DNS** — translates domain names (google.com) to IP addresses
- **HTTP/HTTPS** — protocol for web pages (S = secure/encrypted)
- **Client-Server model** — your browser (client) requests from a server

### Protocols for AI Work
- **HTTP REST API** — how AI services communicate over the web
- **WebSockets** — real-time, two-way communication (used in chatbots)

---

## 6. APIs & Servers

### What is a Server?
A server is just a computer running 24/7, waiting to respond to requests. When you visit a website, a server sends back the page.

### What is an API?
**API = Application Programming Interface**

It's a way for programs to talk to each other. Think of an API as a **waiter** at a restaurant:
- You (client) tell the waiter (API) what you want
- The waiter goes to the kitchen (server/database)
- The waiter brings back your food (response)

### REST API Example (how you'll use AI services)
\`\`\`
GET  https://api.example.com/courses        → get list of courses
POST https://api.example.com/courses        → create a new course
GET  https://api.example.com/courses/42     → get course with ID 42
\`\`\`

You'll use APIs constantly in AI — calling OpenAI, Hugging Face, cloud services, etc.

---

## 7. Cloud Computing Basics

**Cloud computing** = using someone else's computers (servers) over the internet.

Instead of buying an expensive GPU server, you rent one from:
- **AWS (Amazon Web Services)** — largest cloud provider
- **Google Cloud Platform (GCP)** — strong AI/ML tools
- **Microsoft Azure** — enterprise-friendly, OpenAI partnership

### Why Cloud Matters for AI
- Train models on powerful GPUs without buying them
- Scale up instantly (rent 100 GPUs for one day)
- Deploy AI apps accessible worldwide

### Key Cloud Concepts
- **Instance** — a virtual machine you rent
- **Storage bucket** — like a hard drive in the cloud
- **Serverless** — run code without managing a server yourself

---

## ✅ Key Takeaways

1. CPU = thinking, RAM = workspace, SSD = memory, GPU = AI's best friend
2. Everything in a computer is ultimately 0s and 1s (binary)
3. Linux is the preferred OS for AI servers and research
4. APIs are how AI services communicate — you'll use them constantly
5. Cloud computing lets you access massive compute power on demand

---

## 🔜 What's Next
Chapter 0.2 — **Linux Fundamentals**: AI runs on Linux. Time to get comfortable with the terminal.`,
    questions: [
      q('What does CPU stand for?',
        [{ id: 'a', text: 'Central Programming Unit' }, { id: 'b', text: 'Central Processing Unit' }, { id: 'c', text: 'Computer Processing Utility' }, { id: 'd', text: 'Core Power Unit' }],
        'b', 'CPU stands for Central Processing Unit — it is the primary component that executes instructions.', 0),
      q('Which hardware component is most important for training AI models?',
        [{ id: 'a', text: 'HDD' }, { id: 'b', text: 'CPU' }, { id: 'c', text: 'GPU' }, { id: 'd', text: 'Monitor' }],
        'c', 'GPUs have thousands of cores for parallel math operations, making them ideal for AI/ML training.', 1),
      q('How many bits make up one byte?',
        [{ id: 'a', text: '4' }, { id: 'b', text: '16' }, { id: 'c', text: '2' }, { id: 'd', text: '8' }],
        'd', 'One byte = 8 bits. This is the fundamental unit of digital information storage.', 2),
      q('What does RAM stand for?',
        [{ id: 'a', text: 'Read Access Memory' }, { id: 'b', text: 'Random Access Memory' }, { id: 'c', text: 'Rapid Application Memory' }, { id: 'd', text: 'Rapid Access Module' }],
        'b', 'RAM = Random Access Memory. It stores data your programs are actively using — cleared when powered off.', 3),
      q('What is an API?',
        [{ id: 'a', text: 'A type of programming language' }, { id: 'b', text: 'A hardware component' }, { id: 'c', text: 'An interface that lets programs communicate with each other' }, { id: 'd', text: 'A cloud storage service' }],
        'c', 'API = Application Programming Interface — a set of rules that lets programs talk to each other.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch0-2-linux-fundamentals',
    title: 'Linux Fundamentals',
    description: 'Shell basics, file system, permissions, processes, package managers, and SSH — essential for AI work.',
    orderIndex: 2,
    xpReward: 60,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `import subprocess, os

# Run shell commands from Python (how AI scripts call system tools)
result = subprocess.run(['echo', 'Hello from the shell!'], capture_output=True, text=True)
print(result.stdout)

# Get current directory (like 'pwd' in Linux)
print("Current dir:", os.getcwd())

# List files (like 'ls' in Linux)
files = os.listdir('.')
print("Files here:", files[:5])`,
    content: `# Chapter 0.2 — Linux Fundamentals

## 🎯 What You'll Learn
Why AI runs on Linux, how to navigate the terminal, manage files, understand permissions, and use package managers. These skills are essential for every AI engineer.

---

## 1. Why Linux for AI?

> "If you want to work in AI, you need to be comfortable with Linux."

Here's why:
- **Cloud servers** (AWS, GCP, Azure) run Linux by default
- **Docker containers** are Linux-based
- **AI frameworks** (TensorFlow, PyTorch) are developed on Linux first
- **NVIDIA CUDA** (GPU computing) works best on Linux
- It's **free, open-source, and stable**

Even if you daily-drive Windows or Mac, you'll SSH into Linux machines constantly.

---

## 2. The Linux File System

Linux organizes everything in a single tree starting at **/** (root):

\`\`\`
/                    ← root of everything
├── home/
│   └── subhronil/   ← your home directory (~)
│       ├── Desktop/
│       ├── Documents/
│       └── projects/
├── etc/             ← system configuration files
├── var/             ← logs, databases
├── usr/             ← installed programs
├── tmp/             ← temporary files
└── bin/             ← essential commands (ls, cp, mv...)
\`\`\`

**Key symbol:** \`~\` means your home directory. \`~/projects\` = \`/home/yourname/projects\`

---

## 3. Essential Shell Commands

The **shell** (terminal) is how you control Linux with text commands.

### Navigation
\`\`\`bash
pwd                    # Print Working Directory — where am I?
ls                     # List files
ls -la                 # List ALL files with details (including hidden)
cd projects            # Change into 'projects' folder
cd ..                  # Go up one level
cd ~                   # Go to home directory
\`\`\`

### Files & Folders
\`\`\`bash
mkdir ai-project       # Make directory
touch notes.txt        # Create empty file
cp notes.txt backup.txt # Copy file
mv notes.txt moved.txt  # Move / rename file
rm old-file.txt        # Delete file (careful — no trash!)
rm -rf old-folder/     # Delete folder and all contents (very careful!)
cat notes.txt          # Show file contents
nano notes.txt         # Edit file in terminal
\`\`\`

### Finding Things
\`\`\`bash
find . -name "*.py"    # Find all Python files
grep "import" main.py  # Find text in a file
which python3          # Where is this program installed?
\`\`\`

---

## 4. File Permissions

Every file in Linux has permissions controlling who can read, write, or execute it.

\`\`\`
-rwxr-xr--  1 subhronil users  4096 Jan 1 script.py
 │││││││││
 ││││││││└── other: r-- (read only)
 │││││││└─── group: r-x (read + execute)
 ││││││└──── owner: rwx (read + write + execute)
 │└───────── type: - = file, d = directory
\`\`\`

\`\`\`bash
chmod +x script.py     # Make a file executable
chmod 755 script.py    # rwx for owner, r-x for others
chown user:group file  # Change owner
\`\`\`

---

## 5. Processes

\`\`\`bash
ps aux                 # List all running processes
top                    # Live process monitor (htop is better)
kill 1234              # Kill process with PID 1234
kill -9 1234           # Force kill
python3 train.py &     # Run in background
jobs                   # List background jobs
\`\`\`

When your AI training script is running for hours, you run it in the background or inside **tmux/screen** so it keeps going even if you disconnect.

---

## 6. Package Managers

Package managers install, update, and remove software.

### apt (Ubuntu / Debian)
\`\`\`bash
sudo apt update                    # Refresh package list
sudo apt install python3-pip       # Install a package
sudo apt remove old-package        # Remove package
sudo apt upgrade                   # Update all packages
\`\`\`

### pip (Python packages — you'll use this constantly)
\`\`\`bash
pip install numpy                  # Install NumPy
pip install torch torchvision      # Install PyTorch
pip install -r requirements.txt    # Install from a list
pip list                           # Show installed packages
\`\`\`

---

## 7. SSH — Secure Shell

SSH lets you remotely control another Linux machine securely.

\`\`\`bash
ssh username@192.168.1.100         # Connect to IP address
ssh user@gpu-server.cloud.com      # Connect to cloud GPU server
scp file.py user@server:~/         # Copy file to remote server
\`\`\`

**Workflow you'll use constantly:**
1. Rent a GPU server on cloud
2. SSH into it from your laptop
3. Copy your training code there
4. Run training, leave it going
5. Come back hours later, collect results

---

## 8. Useful Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl + C\` | Stop running program |
| \`Ctrl + Z\` | Pause program |
| \`Ctrl + L\` | Clear screen |
| \`Tab\` | Autocomplete command/path |
| \`↑ / ↓\` | Navigate command history |
| \`Ctrl + R\` | Search command history |

---

## ✅ Key Takeaways

1. Linux is the OS of AI infrastructure — get comfortable with it
2. Everything in Linux is a file, organized in a tree from /
3. Learn 10 core commands: pwd, ls, cd, mkdir, touch, cp, mv, rm, cat, grep
4. Permissions control who can read/write/execute every file
5. pip is your best friend for installing Python AI libraries
6. SSH is how you control remote GPU servers

---

## 🔜 What's Next
Chapter 0.3 — **Git & GitHub**: Never lose your code again. Track every change.`,
    questions: [
      q('Which Linux command shows your current directory?',
        [{ id: 'a', text: 'ls' }, { id: 'b', text: 'cd' }, { id: 'c', text: 'pwd' }, { id: 'd', text: 'dir' }],
        'c', 'pwd = Print Working Directory. It shows the full path of the directory you are currently in.', 0),
      q('What does the symbol ~ represent in Linux?',
        [{ id: 'a', text: 'Root directory' }, { id: 'b', text: 'Parent directory' }, { id: 'c', text: 'Home directory' }, { id: 'd', text: 'Temporary directory' }],
        'c', '~ is shorthand for the current user\'s home directory, e.g., /home/username.', 1),
      q('Which command installs Python packages?',
        [{ id: 'a', text: 'apt install' }, { id: 'b', text: 'pip install' }, { id: 'c', text: 'npm install' }, { id: 'd', text: 'brew install' }],
        'b', 'pip is the Python package manager. pip install <package> installs any Python library.', 2),
      q('What does chmod +x script.py do?',
        [{ id: 'a', text: 'Deletes the file' }, { id: 'b', text: 'Makes the file executable' }, { id: 'c', text: 'Copies the file' }, { id: 'd', text: 'Changes the file owner' }],
        'b', 'chmod +x adds execute permission to a file, allowing it to be run directly.', 3),
      q('What is SSH used for?',
        [{ id: 'a', text: 'Installing software packages' }, { id: 'b', text: 'Editing files locally' }, { id: 'c', text: 'Connecting to remote machines securely' }, { id: 'd', text: 'Compiling code' }],
        'c', 'SSH (Secure Shell) creates an encrypted connection to control a remote Linux machine from your terminal.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch0-3-git-github',
    title: 'Git & GitHub',
    description: 'Version control, Git workflow, branching, pull requests, and open-source collaboration.',
    orderIndex: 3,
    xpReward: 60,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `# Git isn't Python, but here's the git workflow you'll use every day
# (run these in your terminal)

# 1. Start a new project
# git init my-ai-project
# cd my-ai-project

# 2. Save your first file
# echo "# My AI Project" > README.md
# git add README.md
# git commit -m "Initial commit"

# 3. Push to GitHub
# git remote add origin https://github.com/you/my-ai-project.git
# git push -u origin main

# Python: automate git with subprocess
import subprocess

def git_status():
    result = subprocess.run(['git', 'status'], capture_output=True, text=True)
    print(result.stdout)

git_status()`,
    content: `# Chapter 0.3 — Git & GitHub

## 🎯 What You'll Learn
What version control is, why every developer and AI engineer uses Git, the core Git workflow, and how to collaborate on GitHub.

---

## 1. The Problem Git Solves

Imagine building an AI model over 3 months:
- Week 1: working code ✅
- Week 4: you change something... now it's broken ❌
- You can't remember what you changed
- You deleted the old version

**This is why version control exists.**

Git tracks every change you make, who made it, and when. You can always go back to any previous state.

---

## 2. What is Git?

**Git** is a distributed version control system created by Linus Torvalds (same person who created Linux) in 2005.

**What it does:**
- Takes **snapshots** of your code over time (commits)
- Lets you work on different features simultaneously (branches)
- Lets multiple people work on the same code (collaboration)
- Lets you roll back any mistake

**What GitHub is:**
GitHub is a website that hosts Git repositories in the cloud. Think of it as Google Drive, but specifically designed for code, with powerful collaboration tools.

---

## 3. Core Git Concepts

### Repository (Repo)
A project folder tracked by Git. Contains all your files + the entire history of changes.

### Commit
A **snapshot** of your code at a point in time. Like saving a checkpoint in a video game.

\`\`\`
commit 1: "Initial project setup"
commit 2: "Add data loading module"
commit 3: "Fix bug in preprocessing"  ← you are here
\`\`\`

### Branch
An **independent copy** of the code where you can experiment without breaking the main version.

\`\`\`
main ──●──●──●──●──●──────────►
             │
feature  ────●──●──●──(merge)
\`\`\`

### Remote
A copy of your repository on another computer (like GitHub). Lets you back up code and collaborate.

---

## 4. The Git Workflow

This is what you'll do every single day:

\`\`\`bash
# SETUP (once per machine)
git config --global user.name "Your Name"
git config --global user.email "you@email.com"

# START A PROJECT
git init                        # Initialize git in current folder
git clone <url>                 # OR download an existing repo

# THE DAILY LOOP
git status                      # What changed?
git add filename.py             # Stage a specific file
git add .                       # Stage ALL changes
git commit -m "Add data loader" # Save snapshot with a message
git push                        # Upload to GitHub

# STAY UP TO DATE
git pull                        # Download latest changes from GitHub
\`\`\`

---

## 5. Branching & Merging

\`\`\`bash
git branch                      # List branches
git checkout -b feature-x       # Create and switch to new branch
git checkout main               # Switch back to main

# After working on feature-x:
git checkout main
git merge feature-x             # Merge feature into main
git branch -d feature-x         # Delete the branch (no longer needed)
\`\`\`

**Why branch?**
In AI projects you might have:
- \`main\` — stable, working model
- \`experiment-transformer\` — testing a new architecture
- \`data-augmentation\` — trying new data processing

Each experiment lives in its own branch, safely.

---

## 6. Pull Requests

A **Pull Request (PR)** is a request to merge your branch into the main codebase. Used heavily in teams and open source.

**Workflow:**
1. Fork a repo (make your own copy on GitHub)
2. Create a branch
3. Make your changes
4. Push to GitHub
5. Open a Pull Request
6. Team reviews, suggests changes
7. PR is merged

---

## 7. Essential .gitignore

Some files should **never** go to GitHub:
- Passwords / API keys
- Huge datasets
- Generated files (model weights, __pycache__)

Create a \`.gitignore\` file:
\`\`\`
# .gitignore for AI projects
.env                    # API keys and secrets!
*.pyc                   # Python compiled files
__pycache__/
*.h5                    # Model weight files (too large)
*.pkl
data/raw/               # Raw datasets
.ipynb_checkpoints/     # Jupyter auto-saves
node_modules/
venv/
\`\`\`

---

## 8. Git for AI Projects — Common Commands

\`\`\`bash
# See what changed
git diff                         # Changes not yet staged
git log --oneline               # Compact history

# Oops — undo things
git restore filename.py          # Discard changes in a file
git revert <commit-hash>         # Undo a commit safely
git stash                        # Temporarily save uncommitted work

# Working with GitHub
git remote -v                    # Show remote connections
git fetch origin                 # Download without merging
\`\`\`

---

## ✅ Key Takeaways

1. Git tracks every change — you can always go back
2. Commit often with meaningful messages
3. Use branches for experiments — never break main
4. .gitignore keeps secrets and large files off GitHub
5. Pull Requests are how teams review code before merging

---

## 🔜 What's Next
Chapter 0.4 — **Python Programming Fundamentals**: The language of AI.`,
    questions: [
      q('What is the purpose of version control?',
        [{ id: 'a', text: 'To make code run faster' }, { id: 'b', text: 'To track changes over time and allow rollback' }, { id: 'c', text: 'To compile code' }, { id: 'd', text: 'To deploy applications' }],
        'b', 'Version control tracks every change made to code over time, allowing you to review history and roll back mistakes.', 0),
      q('What does "git commit -m" do?',
        [{ id: 'a', text: 'Uploads code to GitHub' }, { id: 'b', text: 'Downloads the latest changes' }, { id: 'c', text: 'Saves a snapshot of the current state with a message' }, { id: 'd', text: 'Creates a new branch' }],
        'c', 'git commit saves a snapshot (checkpoint) of your staged changes with a descriptive message.', 1),
      q('What is a Git branch?',
        [{ id: 'a', text: 'A backup copy of GitHub' }, { id: 'b', text: 'An independent line of development' }, { id: 'c', text: 'A type of commit' }, { id: 'd', text: 'A remote server' }],
        'b', 'A branch is an independent copy of the codebase where you can experiment without affecting the main version.', 2),
      q('Which command uploads your commits to GitHub?',
        [{ id: 'a', text: 'git pull' }, { id: 'b', text: 'git clone' }, { id: 'c', text: 'git commit' }, { id: 'd', text: 'git push' }],
        'd', 'git push uploads your local commits to the remote repository (e.g., GitHub).', 3),
      q('What should you NEVER commit to a public GitHub repository?',
        [{ id: 'a', text: 'README.md files' }, { id: 'b', text: 'Python source code' }, { id: 'c', text: 'API keys and passwords' }, { id: 'd', text: 'Test files' }],
        'c', 'API keys and passwords must be kept in .env files listed in .gitignore — never committed to public repos.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch0-4-python-fundamentals',
    title: 'Python Programming Fundamentals',
    description: 'Variables, data types, loops, functions, OOP, modules, and error handling — Python for AI.',
    orderIndex: 4,
    xpReward: 75,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `# Python fundamentals demo
# 1. Variables and types
name = "AIRO"
version = 2.0
is_active = True
scores = [95, 87, 92, 78]

# 2. Functions
def calculate_average(numbers):
    return sum(numbers) / len(numbers)

avg = calculate_average(scores)
print(f"Average score: {avg:.1f}")

# 3. List comprehension (very Pythonic)
passed = [s for s in scores if s >= 80]
print(f"Passed: {passed}")

# 4. Simple class
class AIModel:
    def __init__(self, name):
        self.name = name
        self.trained = False

    def train(self):
        self.trained = True
        return f"{self.name} is now trained!"

model = AIModel("MyFirstNet")
print(model.train())`,
    content: `# Chapter 0.4 — Python Programming Fundamentals

## 🎯 What You'll Learn
Python is the language of AI. This chapter covers everything you need to read, write, and understand Python code for data science and machine learning projects.

---

## 1. Why Python for AI?

Python didn't win by being the fastest language — it won because of its **ecosystem**:
- NumPy, Pandas, Matplotlib — data tools
- TensorFlow, PyTorch, scikit-learn — ML/DL frameworks
- Jupyter Notebooks — interactive computing
- Huge community and endless tutorials

Python's simple syntax means you spend time thinking about AI, not fighting the language.

---

## 2. Variables & Data Types

\`\`\`python
# Basic types
name = "Neural Network"      # str
layers = 3                   # int
learning_rate = 0.001        # float
is_training = True           # bool

# Check the type
print(type(learning_rate))   # <class 'float'>

# Type conversion
epochs = int("100")          # string → int
rate = float("0.01")         # string → float
\`\`\`

---

## 3. Data Structures

\`\`\`python
# List — ordered, changeable, allows duplicates
losses = [2.5, 1.8, 1.2, 0.9]
losses.append(0.7)           # Add to end
losses[0]                    # Access by index: 2.5
losses[-1]                   # Last item: 0.7
losses[1:3]                  # Slice: [1.8, 1.2]

# Tuple — ordered, UNCHANGEABLE
dimensions = (224, 224, 3)   # Image: height, width, channels

# Dictionary — key-value pairs (like JSON)
model_config = {
    "name": "ResNet50",
    "layers": 50,
    "accuracy": 0.92
}
model_config["layers"]       # Access: 50
model_config["lr"] = 0.001   # Add new key

# Set — unique values only
labels = {"cat", "dog", "cat", "bird"}
print(labels)                # {'cat', 'dog', 'bird'}
\`\`\`

---

## 4. Control Flow

\`\`\`python
# if / elif / else
accuracy = 0.95
if accuracy > 0.90:
    print("Excellent model!")
elif accuracy > 0.75:
    print("Good model")
else:
    print("Needs improvement")

# for loop
for epoch in range(1, 6):        # 1, 2, 3, 4, 5
    print(f"Epoch {epoch}")

# while loop
loss = 10.0
while loss > 0.5:
    loss *= 0.7
    print(f"Loss: {loss:.2f}")

# List comprehension (very common in AI code)
squares = [x**2 for x in range(10)]
filtered = [x for x in range(10) if x % 2 == 0]
\`\`\`

---

## 5. Functions

\`\`\`python
# Basic function
def greet(name):
    return f"Hello, {name}!"

# Default arguments
def train_model(epochs=10, lr=0.001, verbose=True):
    if verbose:
        print(f"Training for {epochs} epochs at lr={lr}")
    # ... training code

train_model()                    # uses defaults
train_model(epochs=50, lr=0.01) # override defaults

# *args (variable positional arguments)
def average(*numbers):
    return sum(numbers) / len(numbers)

print(average(1, 2, 3, 4, 5))  # 3.0

# Lambda (one-line anonymous function)
relu = lambda x: max(0, x)     # ReLU activation function!
print(relu(-3))                 # 0
print(relu(5))                  # 5
\`\`\`

---

## 6. Object-Oriented Programming (OOP)

AI frameworks heavily use OOP. Understanding classes is essential.

\`\`\`python
class NeuralNetwork:
    """A simple neural network class."""

    def __init__(self, input_size, hidden_size, output_size):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.trained = False

    def train(self, data, labels):
        """Train the network."""
        print(f"Training on {len(data)} samples...")
        self.trained = True

    def predict(self, input_data):
        """Make a prediction."""
        if not self.trained:
            raise ValueError("Model not trained yet!")
        return "prediction"

    def summary(self):
        return f"NN({self.input_size}→{self.hidden_size}→{self.output_size})"

# Create an instance
model = NeuralNetwork(784, 128, 10)
print(model.summary())          # NN(784→128→10)
\`\`\`

**Key OOP concepts:**
- **Class** — blueprint for creating objects
- **Instance** — a specific object created from a class
- **\`__init__\`** — constructor, called when creating an instance
- **self** — refers to the current instance
- **Method** — a function inside a class
- **Inheritance** — one class can extend another

---

## 7. Error Handling

\`\`\`python
# Try-except (crucial for robust AI code)
def load_dataset(path):
    try:
        with open(path, 'r') as f:
            data = f.read()
        return data
    except FileNotFoundError:
        print(f"Dataset not found: {path}")
        return None
    except PermissionError:
        print("Permission denied")
        return None
    finally:
        print("Load attempt complete")  # always runs

# Custom exception
class ModelNotTrainedError(Exception):
    pass

def predict(model, data):
    if not model.trained:
        raise ModelNotTrainedError("Train the model first!")
\`\`\`

---

## 8. Modules & Imports

\`\`\`python
# Import a whole module
import math
print(math.sqrt(144))          # 12.0

# Import specific functions
from math import sqrt, pi
print(sqrt(144))               # 12.0

# Import with alias (standard in AI)
import numpy as np             # always 'np'
import pandas as pd            # always 'pd'
import matplotlib.pyplot as plt # always 'plt'

# Import from your own file
# from my_utils import load_data, preprocess
\`\`\`

---

## 9. File Handling

\`\`\`python
# Write a file
with open('results.txt', 'w') as f:
    f.write("Accuracy: 95%\\n")
    f.write("Loss: 0.12\\n")

# Read a file
with open('results.txt', 'r') as f:
    content = f.read()
    print(content)

# Read line by line
with open('data.csv', 'r') as f:
    for line in f:
        print(line.strip())
\`\`\`

---

## ✅ Key Takeaways

1. Python's simple syntax makes it perfect for AI and data science
2. Master lists, dicts, and list comprehensions — used everywhere in ML code
3. Functions and classes are the building blocks of all ML frameworks
4. Always use try-except when loading files or calling external APIs
5. Learn the standard aliases: np, pd, plt — they're universal

---

## 🔜 What's Next
Chapter 0.5 — **Mathematics for AI**: Vectors, matrices, derivatives, and statistics — the math that makes ML work.`,
    questions: [
      q('Which Python data structure maps keys to values?',
        [{ id: 'a', text: 'List' }, { id: 'b', text: 'Tuple' }, { id: 'c', text: 'Dictionary' }, { id: 'd', text: 'Set' }],
        'c', 'A dictionary (dict) stores key-value pairs. It is used extensively in AI for configs, results, and mappings.', 0),
      q('What keyword is used to define a function in Python?',
        [{ id: 'a', text: 'function' }, { id: 'b', text: 'define' }, { id: 'c', text: 'fun' }, { id: 'd', text: 'def' }],
        'd', 'In Python, functions are defined using the def keyword followed by the function name.', 1),
      q('What does OOP stand for?',
        [{ id: 'a', text: 'Optimized Output Programming' }, { id: 'b', text: 'Object-Oriented Programming' }, { id: 'c', text: 'Open-source Operation Protocol' }, { id: 'd', text: 'Ordered Output Processing' }],
        'b', 'OOP = Object-Oriented Programming. It organizes code into classes and objects.', 2),
      q('Which block always executes in a try-except-finally statement?',
        [{ id: 'a', text: 'try' }, { id: 'b', text: 'except' }, { id: 'c', text: 'finally' }, { id: 'd', text: 'else' }],
        'c', 'The finally block always runs regardless of whether an exception was raised — perfect for cleanup.', 3),
      q('What is the standard alias for NumPy when importing?',
        [{ id: 'a', text: 'num' }, { id: 'b', text: 'npy' }, { id: 'c', text: 'np' }, { id: 'd', text: 'numpy' }],
        'c', 'import numpy as np is the universal convention. You will see np used in virtually all AI/data science code.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch0-5-math-for-ai',
    title: 'Mathematics for AI',
    description: 'Linear algebra, calculus, statistics and probability — the math that powers machine learning.',
    orderIndex: 5,
    xpReward: 75,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `import numpy as np

# VECTORS
v = np.array([1, 2, 3])
w = np.array([4, 5, 6])
print("Dot product:", np.dot(v, w))         # 32

# MATRICES
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print("Matrix multiply:\\n", A @ B)

# STATISTICS
data = np.array([85, 90, 78, 92, 88, 76])
print("Mean:", np.mean(data))               # 84.8
print("Std Dev:", np.std(data))             # 5.7
print("Median:", np.median(data))           # 86.5

# GRADIENT (derivative concept)
# f(x) = x^2, f'(x) = 2x
x = 3
gradient = 2 * x   # derivative at x=3 is 6
print(f"Gradient of x² at x={x}: {gradient}")`,
    content: `# Chapter 0.5 — Mathematics for AI

## 🎯 What You'll Learn
The mathematical foundations that make AI work. You don't need to be a mathematician — you need intuition for vectors, matrices, derivatives, and statistics. That's exactly what this chapter gives you.

---

## Why Math for AI?

AI is fundamentally applied mathematics. When a neural network "learns," it's doing:
- **Linear algebra** to transform data
- **Calculus** to calculate how to improve
- **Statistics** to understand data and measure performance
- **Probability** to make predictions under uncertainty

Understanding the math helps you debug models, tune hyperparameters, and design architectures.

---

## 1. Linear Algebra

### Scalars, Vectors, and Matrices

**Scalar** — a single number
\`\`\`
learning_rate = 0.001     ← scalar
\`\`\`

**Vector** — an ordered list of numbers (1D array)
\`\`\`
[1.2, 0.8, 3.5, 2.1]    ← a feature vector (one data sample)
\`\`\`

Think of a vector as **coordinates in space**. A house with 4 features (size, rooms, age, price) is a vector in 4-dimensional space.

**Matrix** — a 2D grid of numbers (rows × columns)
\`\`\`
[[1, 2, 3],       ← a 2×3 matrix
 [4, 5, 6]]
\`\`\`

In ML: a dataset of 1000 samples with 10 features = 1000×10 matrix

**Tensor** — generalization to N dimensions (3D, 4D...)
- A grayscale image: 2D tensor (height × width)
- A color image: 3D tensor (height × width × 3 channels)
- A batch of images: 4D tensor (batch × height × width × channels)

---

### Vector Operations

\`\`\`python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Addition (element-wise)
print(a + b)           # [5, 7, 9]

# Scalar multiplication
print(2 * a)           # [2, 4, 6]

# Dot product — measures similarity between vectors
dot = np.dot(a, b)     # 1×4 + 2×5 + 3×6 = 32
print(dot)             # 32

# Magnitude (length) of vector
magnitude = np.linalg.norm(a)   # √(1+4+9) = 3.74
\`\`\`

**Dot product intuition:** If two vectors point in the same direction, dot product is large. If perpendicular, it's 0. This is how attention mechanisms in transformers work!

---

### Matrix Operations

\`\`\`python
A = np.array([[1, 2], [3, 4]])   # 2×2 matrix
B = np.array([[5, 6], [7, 8]])   # 2×2 matrix

# Matrix multiplication
C = A @ B
# [[1×5+2×7, 1×6+2×8],   =   [[19, 22],
#  [3×5+4×7, 3×6+4×8]]        [43, 50]]

# Transpose (flip rows and columns)
print(A.T)    # [[1, 3], [2, 4]]
\`\`\`

**Why matrix multiplication matters:** A neural network layer is literally a matrix multiplication. The model weights ARE a matrix that transforms your input data.

---

## 2. Calculus — Derivatives & Gradients

### What is a Derivative?

A derivative measures **how fast a function changes** at a point.

If \`f(x) = x²\`, then \`f'(x) = 2x\`

At x=3: f'(3) = 6 — the function is increasing at rate 6 at that point.

**Visual intuition:** The derivative is the slope of the curve at a point.

---

### Why AI Needs Derivatives

During training, a neural network tries to **minimize its loss** (error). To do this, it needs to know:
- *"If I increase this weight slightly, does the loss go up or down?"*

That answer is the **gradient** — the multi-dimensional derivative.

\`\`\`
Loss goes up → weight is going the wrong way → decrease it
Loss goes down → we're on the right track → keep going
\`\`\`

This process — using gradients to minimize loss — is called **Gradient Descent**, and it's the engine behind all neural network training.

---

### Gradient Descent Intuition

Imagine you're blindfolded on a hilly landscape and want to reach the lowest valley:
1. Feel the slope under your feet (calculate gradient)
2. Take a step downhill (update weights in opposite direction of gradient)
3. Repeat until you can't go lower

\`\`\`python
# Gradient descent in 5 lines (conceptually)
w = 10.0              # starting weight
lr = 0.1              # learning rate (step size)

for step in range(20):
    gradient = 2 * w  # derivative of w² (our "loss" = w²)
    w = w - lr * gradient  # step downhill
    print(f"Step {step}: w={w:.4f}")
# w converges to 0 (the minimum of w²)
\`\`\`

---

## 3. Statistics

Statistics helps us **understand data** before we model it.

### Measures of Center

\`\`\`python
data = [85, 90, 78, 92, 88, 76, 95, 88]

mean   = sum(data) / len(data)        # 86.5 — average
median = sorted(data)[len(data)//2]   # 88 — middle value
mode   = 88                           # most frequent
\`\`\`

**When to use which:**
- Mean: symmetric data, no extreme outliers
- Median: skewed data or outliers (e.g., house prices)

### Measures of Spread

\`\`\`python
import numpy as np
data = np.array([85, 90, 78, 92, 88, 76])

variance = np.var(data)       # average squared distance from mean
std_dev  = np.std(data)       # square root of variance — in original units
print(f"Std Dev: {std_dev:.2f}")  # How spread out is the data?
\`\`\`

**Why it matters:** High std dev = data is spread out. Low = clustered near the mean. AI models need to handle both.

---

## 4. Probability

Probability quantifies **uncertainty** — how likely is an event?

\`\`\`
P(event) = 0       ← impossible
P(event) = 0.5     ← 50/50
P(event) = 1.0     ← certain
\`\`\`

### Why AI Needs Probability

- A classifier doesn't say "this is a cat" — it says "P(cat) = 0.92, P(dog) = 0.08"
- Language models predict the **probability** of the next word
- Bayesian methods use probability to update beliefs as new data arrives

### Key Concepts

**Conditional Probability** — P(A | B) = probability of A given B happened
- P(spam | contains "win prize") = 0.95

**Independence** — two events don't affect each other
- Coin flips are independent; each flip is 50/50 regardless of history

**Bayes' Theorem** — how to update probability based on evidence
\`\`\`
P(A|B) = P(B|A) × P(A) / P(B)
\`\`\`
This is the foundation of many ML algorithms (Naive Bayes, Bayesian networks).

---

## 5. Essential Math Intuitions for AI

| Concept | AI Use |
|---------|--------|
| Dot product | Similarity between vectors, attention mechanisms |
| Matrix multiply | Neural network layers |
| Gradient | Direction to update weights |
| Mean/Std | Normalizing data (essential preprocessing step) |
| Probability | Model outputs, loss functions |
| Log | Log loss (cross-entropy), numerical stability |

---

## ✅ Key Takeaways

1. Data = vectors; datasets = matrices; images = tensors
2. Dot product measures how similar two vectors are
3. Derivatives tell us which direction to move to reduce error
4. Gradient descent = repeatedly taking small steps downhill on the loss surface
5. Mean, median, std dev describe your data before you model it
6. AI outputs are probabilities — the model is always expressing uncertainty

---

## 🔜 What's Next
**PHASE 1 BEGINS:** Chapter 1.0 — **Introduction to Artificial Intelligence** — now that you have the foundations, you officially enter AI.`,
    questions: [
      q('What is a vector in the context of machine learning?',
        [{ id: 'a', text: 'A type of neural network' }, { id: 'b', text: 'An ordered list of numbers representing a data point' }, { id: 'c', text: 'A visualization tool' }, { id: 'd', text: 'A Python library' }],
        'b', 'In ML, a vector is an ordered list of numbers. A data sample with 10 features is represented as a vector in 10-dimensional space.', 0),
      q('What does a derivative measure?',
        [{ id: 'a', text: 'The average value of a function' }, { id: 'b', text: 'How fast a function changes at a point' }, { id: 'c', text: 'The maximum value of a function' }, { id: 'd', text: 'The probability of an event' }],
        'b', 'A derivative measures the rate of change (slope) of a function at a specific point.', 1),
      q('What is the mean of [2, 4, 6, 8, 10]?',
        [{ id: 'a', text: '5' }, { id: 'b', text: '7' }, { id: 'c', text: '6' }, { id: 'd', text: '8' }],
        'c', 'Mean = (2+4+6+8+10) / 5 = 30 / 5 = 6.', 2),
      q('What is gradient descent used for in AI?',
        [{ id: 'a', text: 'Visualizing data' }, { id: 'b', text: 'Loading datasets' }, { id: 'c', text: 'Minimizing the model\'s loss by updating weights' }, { id: 'd', text: 'Splitting data into training and test sets' }],
        'c', 'Gradient descent iteratively adjusts model weights in the direction that reduces loss — it is the core learning algorithm.', 3),
      q('What does a probability of 0 mean?',
        [{ id: 'a', text: '50% likely' }, { id: 'b', text: 'Certain to happen' }, { id: 'c', text: 'Impossible — will never happen' }, { id: 'd', text: 'Unknown probability' }],
        'c', 'Probability ranges from 0 (impossible) to 1 (certain). P=0 means the event cannot occur.', 4),
    ],
  },

  // ══════════════════════════════════════════════
  // PHASE 1 — INTRODUCTION TO AI
  // ══════════════════════════════════════════════
  {
    slug: 'ch1-0-intro-to-ai',
    title: 'Introduction to Artificial Intelligence',
    description: 'What AI really is, types, all major domains, the AI workflow, real-world use-cases, and ethical AI.',
    orderIndex: 6,
    xpReward: 100,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `# A simple demonstration of AI concepts in code

# 1. Rule-based AI (the old way)
def classify_temperature_rule(temp):
    if temp > 35: return "HOT"
    elif temp > 20: return "WARM"
    elif temp > 10: return "COOL"
    else: return "COLD"

# 2. ML-style AI (learns from data)
# Here we simulate what an ML model does after training:
# it learns weights from examples and uses them to predict.

training_data = [
    (5, "COLD"), (12, "COOL"), (22, "WARM"),
    (30, "HOT"), (3, "COLD"), (25, "WARM"),
]

def simple_learned_classifier(temp):
    # In real ML, these thresholds would be learned from data
    thresholds = {"COLD": 10, "COOL": 20, "WARM": 30}
    for label, threshold in thresholds.items():
        if temp <= threshold:
            return label
    return "HOT"

for temp in [3, 15, 25, 38]:
    print(f"{temp}°C → Rule: {classify_temperature_rule(temp)}, Learned: {simple_learned_classifier(temp)}")`,
    content: `# Chapter 1.0 — Introduction to Artificial Intelligence

## 🎯 Phase 1 Begins!

You've built your foundations. Now you officially enter the world of AI. This chapter gives you a complete mental model of what AI is, how it's structured, how it works end-to-end, and how it's used responsibly.

---

## 1. What AI Really Is

**Artificial Intelligence** is not magic. It's mathematics + data + computation, combined to create systems that can:

- **Recognize patterns** in data
- **Make predictions** about new, unseen data
- **Make decisions** based on learned knowledge
- **Generate content** — text, images, audio, code

### The Core Idea: Learning from Examples

Traditional programming:
\`\`\`
Rules + Data → Output
\`\`\`

Machine Learning (modern AI):
\`\`\`
Data + Output (examples) → Rules (model learns them)
\`\`\`

Instead of you writing every rule, the AI **discovers rules from patterns in data**.

---

## 2. Types of AI (by capability)

### Reactive Machines
- No memory, no learning — reacts to current input only
- Example: IBM Deep Blue (chess AI) — sees the board, makes a move
- Cannot learn from past games

### Limited Memory AI
- Can look at recent history to inform decisions
- Example: Self-driving cars — remember recent road conditions
- Most AI today is this type

### Theory of Mind (Theoretical)
- Would understand human emotions, intentions, beliefs
- Doesn't exist yet
- Required for true social intelligence

### Self-Aware AI (Science Fiction)
- Would be conscious and understand itself
- Completely hypothetical

> 🔑 Every AI system working today is either Reactive or Limited Memory.

---

## 3. The AI Domains — Your Learning Map

\`\`\`diagram
ARTIFICIAL INTELLIGENCE
  MACHINE LEARNING: learn patterns from data without explicit programming
    DEEP LEARNING: multi-layer neural networks inspired by the brain
      CNN: images, vision, spatial patterns
      RNN / TRANSFORMERS: sequences, text, language
  COMPUTER VISION: enabling machines to see and understand visual information
  NATURAL LANGUAGE PROCESSING: understanding and generating human language
\`\`\`

### Machine Learning
Systems that learn patterns from data without explicit programming.
- Spam filters, fraud detection, recommendations

### Deep Learning
ML using multi-layer neural networks inspired by the human brain.
- Image recognition, speech recognition, translation

### Natural Language Processing (NLP)
Teaching machines to read, understand, and generate human language.
- ChatGPT, Google Translate, Siri, search engines

### Computer Vision
Teaching machines to interpret images and video.
- Self-driving cars, medical imaging, facial recognition

### Robotics
Physical AI systems that perceive and act in the real world.
- Manufacturing robots, autonomous drones, surgical robots

### Reinforcement Learning (RL)
AI that learns by trial and error — gets rewards for good actions.
- Game-playing AI (AlphaGo), robot locomotion, recommendation systems

---

## 4. The AI Workflow — How AI Projects Work

Every AI project follows this pipeline:

\`\`\`
1. DEFINE THE PROBLEM
   What are we predicting? What counts as success?
           ↓
2. COLLECT DATA
   Gather enough labelled examples
           ↓
3. EXPLORE & CLEAN DATA
   Handle missing values, outliers, inconsistencies
           ↓
4. FEATURE ENGINEERING
   Transform raw data into useful inputs for the model
           ↓
5. CHOOSE & TRAIN A MODEL
   Select algorithm, feed training data, it learns
           ↓
6. EVALUATE
   Test on unseen data: accuracy, precision, recall, F1
           ↓
7. IMPROVE
   Tune hyperparameters, add data, change architecture
           ↓
8. DEPLOY
   Put the model in production (API, app, device)
           ↓
9. MONITOR
   Watch for performance drift, retrain as needed
\`\`\`

This cycle repeats. AI is never "done" — you monitor and improve continuously.

---

## 5. AI in the Real World — Domain by Domain

### Healthcare
- **Radiology AI:** Detects tumors in X-rays/MRIs with radiologist-level accuracy
- **Drug discovery:** Predicts which molecules might be effective drugs (saved years of lab time)
- **Patient risk scoring:** Identifies patients at risk before emergencies occur

### Autonomous Vehicles
- Computer Vision detects lanes, pedestrians, signs
- LiDAR point clouds build 3D maps of the environment
- Reinforcement Learning trains decision-making
- Planning algorithms compute safe trajectories

### Language & Communication
- **Translation:** Google Translate serves 500M users/day
- **Writing assistants:** Grammarly, ChatGPT
- **Summarization:** Summarize a 50-page document in seconds

### Financial Services
- **Fraud detection:** Every time your card is swiped, AI checks if it's you
- **Algorithmic trading:** AI executes millions of trades per second
- **Credit scoring:** More factors than traditional credit bureaus

### Recommendation Systems
- Netflix: predicts which show you'll watch next
- Spotify: generates personalized playlists
- Amazon: "customers also bought" (drives 35% of revenue)

### Robotics & Manufacturing
- Robot arms that assemble electronics with micron precision
- Quality control cameras that reject defective parts
- Warehouse robots (Amazon has 750,000+ robots)

---

## 6. How Neural Networks Learn — A Mental Model

A neural network is layers of connected "neurons":

\`\`\`
Input layer → Hidden layers → Output layer
  (data)       (processing)    (prediction)
\`\`\`

**Training process:**
1. Show the network an image (say, a cat)
2. Network makes a guess (70% cat, 30% dog)
3. We know it's a cat — the error is 30%
4. Backpropagation: calculate how each weight contributed to that error
5. Gradient descent: adjust all weights to reduce the error
6. Repeat millions of times
7. Network gets better and better at recognizing cats

---

## 7. Ethical AI — Why It Matters

AI has enormous power, and that comes with responsibility.

### Bias
- If training data is biased, the AI is biased
- Example: facial recognition systems that work better on lighter skin (because training data was mostly lighter-skinned faces)
- **Fix:** Diverse training data, fairness metrics

### Privacy
- AI systems often need huge amounts of personal data
- Who has access? How is it stored? Can it be misused?
- **Regulations:** GDPR (Europe), CCPA (California)

### Transparency (Explainability)
- Some AI decisions affect people's lives (loan approval, medical diagnosis)
- "Black box" AI is problematic when you can't explain the decision
- **Fix:** Explainable AI (XAI) techniques

### Job Displacement
- AI will automate certain tasks — this is real
- Historically, technology creates new categories of jobs
- The engineers building, maintaining, and auditing AI systems are in high demand

### AI Safety
- As AI becomes more powerful, ensuring it stays aligned with human values is critical
- Active research area — labs like Anthropic, OpenAI, DeepMind work on this

---

## 8. The AI Engineer's Mindset

To succeed in AI, cultivate these habits:
1. **Data-first thinking** — before algorithms, think about your data
2. **Start simple** — a linear model often beats a complex one
3. **Measure everything** — you can't improve what you don't measure
4. **Fail fast** — experiment often, fail cheaply, learn quickly
5. **Ethical awareness** — always ask "who could be harmed by this system?"

---

## ✅ Key Takeaways

1. AI learns rules from data, rather than following hand-coded rules
2. All AI today is Narrow AI — great at specific tasks
3. The 6 main domains: ML, Deep Learning, NLP, CV, Robotics, RL
4. The AI workflow: define → collect → clean → engineer → train → evaluate → deploy → monitor
5. Neural networks learn by repeatedly adjusting weights to reduce error
6. Ethical AI considers bias, privacy, explainability, and safety

---

## 🔜 What's Next
Chapter 1.1 — **AI Development Environment**: Set up your professional AI workspace.`,
    questions: [
      q('In machine learning, what does the model learn from?',
        [{ id: 'a', text: 'Explicit rules programmed by developers' }, { id: 'b', text: 'Patterns in data (examples)' }, { id: 'c', text: 'Random weight initialization' }, { id: 'd', text: 'Internet searches' }],
        'b', 'ML models learn patterns from labeled examples (training data), discovering rules automatically rather than following hand-coded logic.', 0),
      q('Which AI domain focuses on understanding and generating human language?',
        [{ id: 'a', text: 'Computer Vision' }, { id: 'b', text: 'Reinforcement Learning' }, { id: 'c', text: 'Robotics' }, { id: 'd', text: 'Natural Language Processing' }],
        'd', 'NLP (Natural Language Processing) deals with teaching machines to read, understand, and generate human language.', 1),
      q('What is the first step in the AI workflow?',
        [{ id: 'a', text: 'Train a model' }, { id: 'b', text: 'Collect data' }, { id: 'c', text: 'Define the problem' }, { id: 'd', text: 'Deploy to production' }],
        'c', 'You must define the problem clearly before anything else — what are you predicting and what counts as success?', 2),
      q('What does "backpropagation" do in neural network training?',
        [{ id: 'a', text: 'Loads data into the network' }, { id: 'b', text: 'Calculates how each weight contributed to the error' }, { id: 'c', text: 'Deploys the model to production' }, { id: 'd', text: 'Visualizes training results' }],
        'b', 'Backpropagation calculates gradients — how much each weight contributed to the prediction error — so gradient descent can correct them.', 3),
      q('What is a major ethical concern with AI systems trained on biased data?',
        [{ id: 'a', text: 'The model will train too slowly' }, { id: 'b', text: 'The model will produce biased predictions that can harm people' }, { id: 'c', text: 'The model will use too much memory' }, { id: 'd', text: 'The model will be too accurate' }],
        'b', 'Biased training data produces biased models. This can result in unfair decisions in hiring, lending, healthcare, and law enforcement.', 4),
    ],
  },
  // ──────────────────────────────────────────────
  {
    slug: 'ch1-1-ai-dev-environment',
    title: 'AI Development Environment',
    description: 'Set up Python, Jupyter, VS Code, virtual environments, and the core AI libraries.',
    orderIndex: 7,
    xpReward: 75,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `# Verify your AI environment is set up correctly
import sys
print("Python version:", sys.version)

# Check libraries (run after installing them)
try:
    import numpy as np
    print("NumPy:", np.__version__)
    import pandas as pd
    print("Pandas:", pd.__version__)
    import sklearn
    print("scikit-learn:", sklearn.__version__)
    import matplotlib
    print("Matplotlib:", matplotlib.__version__)
    print("\\n✅ All core AI libraries installed!")
except ImportError as e:
    print(f"Missing library: {e}")
    print("Run: pip install numpy pandas scikit-learn matplotlib")`,
    content: `# Chapter 1.1 — AI Development Environment

## 🎯 What You'll Learn
How to set up a professional, reproducible AI development environment — the same setup used by AI engineers at top companies.

---

## 1. Why Environment Setup Matters

In AI, your environment is everything. A mismatch between library versions can break your entire project.
- "It works on my machine" is a real problem in AI/ML
- Virtual environments solve this
- Consistent setups are reproducible and shareable

---

## 2. Python Installation

AI work requires **Python 3.9+** (3.11 recommended as of 2024).

**Check your version:**
\`\`\`bash
python3 --version   # Should show 3.9 or higher
\`\`\`

**Install if missing:**
- **Windows:** Download from python.org, check "Add to PATH"
- **Mac:** \`brew install python3\`
- **Linux:** \`sudo apt install python3 python3-pip\`

---

## 3. Virtual Environments

A **virtual environment** is an isolated Python installation for each project. It prevents conflicts between projects that need different library versions.

\`\`\`bash
# Create a virtual environment
python3 -m venv ai-env

# Activate it
source ai-env/bin/activate       # Linux/Mac
ai-env\\Scripts\\activate          # Windows

# Your terminal prompt now shows (ai-env)
# Install packages — they go into THIS env only
pip install numpy pandas scikit-learn matplotlib

# Save your dependencies
pip freeze > requirements.txt

# Deactivate when done
deactivate
\`\`\`

**Rule:** One virtual environment per project.

---

## 4. VS Code Setup for AI

Visual Studio Code is the most popular editor for AI development.

**Essential extensions:**
- **Python** (Microsoft) — syntax highlighting, debugging, linting
- **Jupyter** — run notebooks inside VS Code
- **Pylance** — fast type checking and IntelliSense
- **GitLens** — enhanced Git integration
- **GitHub Copilot** — AI pair programmer (optional)

**Key shortcuts:**
| Action | Shortcut |
|--------|----------|
| Run Python file | F5 |
| Open terminal | Ctrl+\` |
| Format code | Shift+Alt+F |
| Quick file open | Ctrl+P |
| Command palette | Ctrl+Shift+P |

---

## 5. Jupyter Notebooks

Jupyter Notebooks are the standard tool for AI research and experimentation. They mix code, output, visualizations, and explanations in one document.

\`\`\`bash
pip install jupyter
jupyter notebook    # Opens in browser at localhost:8888
\`\`\`

**Notebook cells:**
- **Code cell** — runs Python, shows output immediately below
- **Markdown cell** — formatted text, equations, explanations

**Key shortcuts inside Jupyter:**
| Action | Shortcut |
|--------|----------|
| Run cell | Shift+Enter |
| New cell below | B |
| New cell above | A |
| Delete cell | DD |
| Switch to Markdown | M |

**Google Colab** — Jupyter notebooks in the cloud with free GPU access. No setup required. Go to colab.research.google.com.

---

## 6. The Core AI Libraries

### NumPy — Numerical Computing
\`\`\`python
import numpy as np
# Fast array operations — the foundation of ML
a = np.array([1, 2, 3, 4, 5])
print(a * 2)           # [2, 4, 6, 8, 10] — all at once
print(a.mean())        # 3.0
print(a.std())         # 1.41
\`\`\`

### Pandas — Data Analysis
\`\`\`python
import pandas as pd
# DataFrames — like Excel spreadsheets in Python
df = pd.read_csv('data.csv')
print(df.head())       # First 5 rows
print(df.describe())   # Stats summary
df = df.dropna()       # Remove missing values
\`\`\`

### Matplotlib — Visualization
\`\`\`python
import matplotlib.pyplot as plt
# Plot training curves, data distributions, etc.
plt.plot([1, 2, 3, 4], [0.9, 0.7, 0.5, 0.3])
plt.xlabel("Epoch"), plt.ylabel("Loss")
plt.title("Training Loss"), plt.show()
\`\`\`

### scikit-learn — Machine Learning
\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
# The go-to library for classical ML algorithms
model = LogisticRegression()
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)
\`\`\`

---

## 7. Install Everything at Once

\`\`\`bash
# Create and activate env
python3 -m venv ai-env
source ai-env/bin/activate

# Core AI stack
pip install numpy pandas matplotlib scikit-learn jupyter

# Save for teammates
pip freeze > requirements.txt
\`\`\`

---

## ✅ Key Takeaways

1. Always use a virtual environment — one per project
2. VS Code + Python extension = the standard AI dev setup
3. Jupyter notebooks are for exploration; .py scripts are for production
4. The four essential libraries: NumPy, Pandas, Matplotlib, scikit-learn
5. Google Colab gives you free GPU access with zero setup

---

## 🔜 What's Next
Chapter 1.2 — **Data Fundamentals**: AI is only as good as its data.`,
    questions: [
      q('What is the purpose of a Python virtual environment?',
        [{ id: 'a', text: 'To speed up Python code' }, { id: 'b', text: 'To create isolated, project-specific Python installations' }, { id: 'c', text: 'To compile Python to machine code' }, { id: 'd', text: 'To connect to cloud servers' }],
        'b', 'Virtual environments isolate dependencies per project, preventing version conflicts between different projects.', 0),
      q('What library is used for data manipulation and analysis in Python?',
        [{ id: 'a', text: 'NumPy' }, { id: 'b', text: 'Matplotlib' }, { id: 'c', text: 'Pandas' }, { id: 'd', text: 'Requests' }],
        'c', 'Pandas provides the DataFrame — a powerful table-like structure for data analysis, similar to a spreadsheet.', 1),
      q('What is Google Colab?',
        [{ id: 'a', text: 'A cloud database service' }, { id: 'b', text: 'A code editor' }, { id: 'c', text: 'A free Jupyter notebook environment with GPU access' }, { id: 'd', text: 'A Python package manager' }],
        'c', 'Google Colab provides free Jupyter notebooks with GPU/TPU access in the browser — perfect for AI experimentation.', 2),
      q('Which library is the standard for machine learning algorithms in Python?',
        [{ id: 'a', text: 'NumPy' }, { id: 'b', text: 'Pandas' }, { id: 'c', text: 'Matplotlib' }, { id: 'd', text: 'scikit-learn' }],
        'd', 'scikit-learn provides clean, consistent APIs for hundreds of ML algorithms — the go-to library for classical ML.', 3),
      q('What command saves all installed packages to a file?',
        [{ id: 'a', text: 'pip list > packages.txt' }, { id: 'b', text: 'pip save' }, { id: 'c', text: 'pip freeze > requirements.txt' }, { id: 'd', text: 'pip export' }],
        'c', 'pip freeze outputs all installed packages with versions. Redirecting to requirements.txt lets teammates replicate your exact environment.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch1-2-data-fundamentals',
    title: 'Data Fundamentals',
    description: 'Structured vs unstructured data, datasets, CSV/JSON, preprocessing, and feature engineering.',
    orderIndex: 8,
    xpReward: 75,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `import pandas as pd
import numpy as np

# Load a sample dataset
data = {
    'age':    [25, 32, None, 41, 28, 35],
    'income': [50000, 80000, 72000, None, 60000, 90000],
    'bought': [0, 1, 1, 1, 0, 1]
}
df = pd.DataFrame(data)
print("Raw data:")
print(df)

# Handle missing values
df['age'].fillna(df['age'].mean(), inplace=True)
df['income'].fillna(df['income'].median(), inplace=True)
print("\\nAfter filling missing values:")
print(df)

# Feature engineering
df['income_per_age'] = df['income'] / df['age']
print("\\nWith new feature:")
print(df[['age', 'income', 'income_per_age', 'bought']])`,
    content: `# Chapter 1.2 — Data Fundamentals

## 🎯 What You'll Learn
How to think about data, work with real datasets, handle messy data, and engineer features that make models perform better.

---

## The Golden Rule of AI

> **"Garbage in, garbage out."**

No matter how powerful your model, bad data produces bad results. The best AI engineers spend most of their time on data, not models.

---

## 1. Types of Data

### Structured Data
Organized in rows and columns — like a spreadsheet.
- CSV files (Excel-compatible)
- SQL databases
- Easy for traditional ML

### Unstructured Data
No predefined format — requires more processing.
- Images (pixels)
- Audio (waveforms)
- Text (raw strings)
- Video
- Most of the world's data is unstructured

### Semi-Structured Data
Has some organization but not tabular.
- JSON (key-value pairs)
- XML
- Email (headers + body)

---

## 2. Common Data Formats

### CSV (Comma-Separated Values)
\`\`\`
age,income,job,bought
25,50000,engineer,1
32,80000,doctor,0
\`\`\`

\`\`\`python
import pandas as pd
df = pd.read_csv('customers.csv')
df.head()                          # First 5 rows
df.info()                          # Column types & non-null counts
df.describe()                      # Statistical summary
\`\`\`

### JSON (JavaScript Object Notation)
\`\`\`json
{
  "user_id": 42,
  "name": "Alex",
  "purchases": [101, 205, 307],
  "active": true
}
\`\`\`

\`\`\`python
import json
with open('data.json') as f:
    data = json.load(f)
# Convert to DataFrame
df = pd.DataFrame(data)
\`\`\`

---

## 3. Exploring a Dataset (EDA)

**Exploratory Data Analysis (EDA)** — understanding your data before modeling.

\`\`\`python
# Shape
print(df.shape)             # (rows, columns)

# Column types
print(df.dtypes)

# Missing values
print(df.isnull().sum())    # Count per column

# Value distribution
print(df['age'].describe())
print(df['category'].value_counts())

# Correlation
print(df.corr())            # Which features correlate with target?
\`\`\`

Always ask:
- How many rows/columns?
- Any missing values?
- What are the ranges of each column?
- Is the data balanced? (equal examples of each class)

---

## 4. Data Preprocessing

Raw data is almost always messy. Preprocessing fixes it.

### Handling Missing Values
\`\`\`python
# Remove rows with any missing value
df.dropna()

# Fill with mean (good for numerical data)
df['age'].fillna(df['age'].mean(), inplace=True)

# Fill with mode (most common — good for categories)
df['city'].fillna(df['city'].mode()[0], inplace=True)

# Fill with a constant
df['score'].fillna(0, inplace=True)
\`\`\`

### Handling Outliers
\`\`\`python
# Remove values more than 3 std devs from mean
mean = df['income'].mean()
std = df['income'].std()
df = df[abs(df['income'] - mean) < 3 * std]
\`\`\`

### Encoding Categorical Variables
ML models need numbers — categories must be converted.

\`\`\`python
# Label encoding (for ordered categories)
df['size'] = df['size'].map({'S': 0, 'M': 1, 'L': 2, 'XL': 3})

# One-hot encoding (for unordered categories)
df = pd.get_dummies(df, columns=['city'])
# Creates: city_London, city_Paris, city_Tokyo (0/1 columns)
\`\`\`

### Scaling / Normalization
Different features on different scales confuse ML models.

\`\`\`python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# StandardScaler: mean=0, std=1
scaler = StandardScaler()
df['income_scaled'] = scaler.fit_transform(df[['income']])

# MinMaxScaler: scales to [0, 1]
scaler = MinMaxScaler()
df['age_scaled'] = scaler.fit_transform(df[['age']])
\`\`\`

---

## 5. Feature Engineering

**Feature engineering** = creating new, better inputs for the model from existing data.

\`\`\`python
# Derive new features
df['age_group'] = pd.cut(df['age'], bins=[0, 25, 45, 65, 100],
                          labels=['young', 'mid', 'senior', 'elder'])

df['income_per_family'] = df['income'] / df['family_size']

# Extract from datetime
df['signup_year'] = pd.to_datetime(df['signup_date']).dt.year
df['day_of_week'] = pd.to_datetime(df['signup_date']).dt.dayofweek

# Text length
df['review_length'] = df['review_text'].str.len()
\`\`\`

Good features come from **domain knowledge** — understanding the problem.

---

## 6. Splitting Data

Every ML project splits data into:
- **Training set (70–80%)** — model learns from this
- **Validation set (10–15%)** — tune hyperparameters
- **Test set (10–15%)** — final evaluation on unseen data (use ONCE)

\`\`\`python
from sklearn.model_selection import train_test_split

X = df.drop('target', axis=1)   # features
y = df['target']                 # labels

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
\`\`\`

---

## ✅ Key Takeaways

1. Data quality determines model quality — always
2. EDA first: understand shape, types, missing values, distributions
3. Preprocessing: handle missing values, encode categories, scale features
4. Feature engineering can boost model performance more than changing algorithms
5. Always split data before preprocessing to avoid data leakage

---

## 🔜 What's Next
Chapter 1.3 — **Introduction to Machine Learning**.`,
    questions: [
      q('What is structured data?',
        [{ id: 'a', text: 'Data stored in image format' }, { id: 'b', text: 'Data organized in rows and columns like a spreadsheet' }, { id: 'c', text: 'Data that cannot be processed by computers' }, { id: 'd', text: 'Data that has no labels' }],
        'b', 'Structured data is organized in a tabular format (rows and columns) — like CSV files or SQL database tables.', 0),
      q('What does EDA stand for?',
        [{ id: 'a', text: 'Estimated Data Analysis' }, { id: 'b', text: 'Exploratory Data Analysis' }, { id: 'c', text: 'Enhanced Data Algorithm' }, { id: 'd', text: 'External Data Access' }],
        'b', 'EDA = Exploratory Data Analysis — the process of understanding your dataset before building models.', 1),
      q('Why do we scale features like age and income before training?',
        [{ id: 'a', text: 'To make the data look nicer' }, { id: 'b', text: 'To reduce file size' }, { id: 'c', text: 'Because features on different scales can confuse ML models' }, { id: 'd', text: 'To remove outliers' }],
        'c', 'Features on very different scales can dominate distance-based algorithms. Scaling puts them on equal footing.', 2),
      q('What is feature engineering?',
        [{ id: 'a', text: 'Deleting unnecessary columns' }, { id: 'b', text: 'Creating new, more informative inputs from existing data' }, { id: 'c', text: 'Collecting more data' }, { id: 'd', text: 'Choosing a machine learning algorithm' }],
        'b', 'Feature engineering creates new inputs (e.g., income_per_age from income and age) that give the model more useful information.', 3),
      q('Why should the test set be used only ONCE?',
        [{ id: 'a', text: 'To save computation time' }, { id: 'b', text: 'Because test data is too large' }, { id: 'c', text: 'To get an unbiased estimate of real-world performance' }, { id: 'd', text: 'Because it reduces accuracy' }],
        'c', 'Using the test set multiple times lets you accidentally overfit to it. A single use gives an honest estimate of model performance.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch1-3-intro-to-ml',
    title: 'Introduction to Machine Learning',
    description: 'Supervised, unsupervised, and reinforcement learning — features, labels, training, and your first model.',
    orderIndex: 9,
    xpReward: 100,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Load the classic Iris dataset
iris = load_iris()
X, y = iris.data, iris.target
print("Features:", iris.feature_names)
print("Classes:", iris.target_names)
print("Dataset shape:", X.shape)   # 150 samples, 4 features

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train a simple model
model = DecisionTreeClassifier(max_depth=3)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"\\nAccuracy: {accuracy:.1%}")  # ~93%+`,
    content: `# Chapter 1.3 — Introduction to Machine Learning

## 🎯 What You'll Learn
The three types of machine learning, the key vocabulary every ML engineer knows, and how to train and evaluate your first real model.

---

## 1. What is Machine Learning?

> **Machine Learning:** A system that automatically learns and improves from experience without being explicitly programmed.

**Traditional programming:**
\`\`\`
Rules + Data → Answer
\`\`\`

**Machine Learning:**
\`\`\`
Data + Answers → Rules (the model learns them)
\`\`\`

**Example:** You want to detect spam emails.
- Traditional: You write 1000 rules ("if contains 'free money', it's spam")
- ML: You show 10,000 labelled emails (spam/not-spam), the model learns the patterns itself

---

## 2. The Three Types of Machine Learning

### Supervised Learning
The model learns from **labelled** examples — each data point has an answer.

\`\`\`
Input: house (size, bedrooms, location)
Label: price ($450,000)
→ Model learns: size + location predict price
\`\`\`

**Use cases:** spam detection, image classification, price prediction, medical diagnosis

**Two sub-types:**
- **Classification** — predict a category (spam/not-spam, cat/dog)
- **Regression** — predict a number (house price, temperature)

### Unsupervised Learning
The model finds patterns in **unlabelled** data — no answers provided.

\`\`\`
Input: 10,000 customer purchase histories (no labels)
→ Model discovers: 5 customer segments (budget buyers, luxury buyers, etc.)
\`\`\`

**Use cases:** customer segmentation, anomaly detection, data compression, recommendation systems

**Common algorithms:** K-Means clustering, PCA (dimensionality reduction)

### Reinforcement Learning
The model learns by taking actions and receiving **rewards or penalties**.

\`\`\`
Agent → Action → Environment → Reward/Penalty → Agent learns
\`\`\`

Like training a dog: good behavior gets a treat, bad behavior gets nothing.

**Use cases:** game-playing AI (AlphaGo), robot locomotion, autonomous driving, trading bots

---

## 3. Key Vocabulary

| Term | Definition |
|------|-----------|
| **Feature** | An input variable (column in your dataset) |
| **Label / Target** | The output you're predicting |
| **Training set** | Data the model learns from |
| **Test set** | Unseen data used to evaluate the model |
| **Model** | The mathematical function learned from data |
| **Hyperparameter** | Settings you choose before training (e.g., learning rate) |
| **Overfitting** | Model memorizes training data, fails on new data |
| **Underfitting** | Model is too simple to capture patterns |
| **Epoch** | One full pass through the training data |
| **Batch** | Subset of training data processed in one step |

---

## 4. Common ML Algorithms (Overview)

### For Classification
| Algorithm | Analogy |
|-----------|---------|
| Logistic Regression | Draws a line separating classes |
| Decision Tree | Series of yes/no questions |
| Random Forest | Many decision trees vote together |
| SVM | Finds the widest margin between classes |
| K-Nearest Neighbors | "What do my nearest neighbors look like?" |

### For Regression
| Algorithm | Analogy |
|-----------|---------|
| Linear Regression | Draws the best-fit line through points |
| Ridge / Lasso | Linear regression with penalty for complexity |
| Decision Tree Regressor | Splits data into groups, predicts avg per group |
| Random Forest Regressor | Ensemble of tree regressors |

---

## 5. How Training Works

\`\`\`
1. Initialize model with random parameters (weights)
2. Feed training data through the model → get predictions
3. Measure error (loss function)
4. Adjust parameters to reduce error (gradient descent)
5. Repeat thousands of times until loss stops decreasing
\`\`\`

---

## 6. Model Evaluation Metrics

### Classification Metrics
\`\`\`python
from sklearn.metrics import (accuracy_score, precision_score,
                              recall_score, f1_score)

# Accuracy: what % of predictions are correct?
accuracy = accuracy_score(y_true, y_pred)

# Precision: of all "positive" predictions, how many were right?
precision = precision_score(y_true, y_pred)

# Recall: of all actual positives, how many did we catch?
recall = recall_score(y_true, y_pred)

# F1: balance between precision and recall
f1 = f1_score(y_true, y_pred)
\`\`\`

**Example — Medical AI detecting cancer:**
- High recall = catch all cancers (even if some false alarms)
- High precision = only flag when you're very sure

### Regression Metrics
\`\`\`python
from sklearn.metrics import mean_squared_error, r2_score

mse = mean_squared_error(y_true, y_pred)     # Average squared error
rmse = mse ** 0.5                             # In original units
r2 = r2_score(y_true, y_pred)                # 0 to 1: how much variance explained?
\`\`\`

---

## 7. Overfitting vs Underfitting

| Problem | What Happens | Fix |
|---------|-------------|-----|
| **Underfitting** | Model too simple, misses patterns | More complex model, more features |
| **Good fit** | Learns patterns, generalizes well | ✅ Keep this |
| **Overfitting** | Memorizes training data, fails on test | More data, simpler model, regularization, dropout |

\`\`\`
Training accuracy: 99% | Test accuracy: 62%  → Overfitting
Training accuracy: 65% | Test accuracy: 63%  → Underfitting
Training accuracy: 93% | Test accuracy: 91%  → Good fit ✅
\`\`\`

---

## ✅ Key Takeaways

1. Supervised = learns from labelled data; Unsupervised = finds structure in unlabelled data; RL = learns from rewards
2. Features = inputs; Labels = what you predict
3. Training loop: predict → measure error → adjust → repeat
4. Evaluate on unseen test data — training accuracy is not enough
5. Aim for good generalization: similar train and test performance

---

## 🔜 What's Next
Chapter 1.4 — **AI Visualization & Analytics**.`,
    questions: [
      q('Which type of ML uses labelled training data?',
        [{ id: 'a', text: 'Unsupervised Learning' }, { id: 'b', text: 'Reinforcement Learning' }, { id: 'c', text: 'Supervised Learning' }, { id: 'd', text: 'Transfer Learning' }],
        'c', 'Supervised Learning trains on labelled data — each sample has an input and a known correct answer.', 0),
      q('A spam filter predicts whether an email is spam or not. This is an example of:',
        [{ id: 'a', text: 'Regression' }, { id: 'b', text: 'Clustering' }, { id: 'c', text: 'Reinforcement Learning' }, { id: 'd', text: 'Classification' }],
        'd', 'Classification predicts discrete categories. Spam/not-spam is a binary classification problem.', 1),
      q('What is overfitting?',
        [{ id: 'a', text: 'A model that is too simple to learn anything' }, { id: 'b', text: 'A model that memorizes training data and fails on new data' }, { id: 'c', text: 'A model that takes too long to train' }, { id: 'd', text: 'A model with too few parameters' }],
        'b', 'Overfitting occurs when a model learns the training data too specifically and cannot generalize to new, unseen examples.', 2),
      q('In RL, what signal does the agent receive to guide its learning?',
        [{ id: 'a', text: 'Labelled examples' }, { id: 'b', text: 'Cluster assignments' }, { id: 'c', text: 'Rewards and penalties' }, { id: 'd', text: 'Gradient updates' }],
        'c', 'In Reinforcement Learning, the agent learns by receiving rewards for good actions and penalties for bad ones.', 3),
      q('What does a high recall score mean in a cancer detection model?',
        [{ id: 'a', text: 'Very few false alarms' }, { id: 'b', text: 'The model caught most actual cancer cases' }, { id: 'c', text: 'The model is very precise' }, { id: 'd', text: 'Training was fast' }],
        'b', 'High recall means the model identifies most actual positive cases. In medical AI, missing a cancer (false negative) is more dangerous than a false alarm.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch1-4-ai-visualization',
    title: 'AI Visualization & Analytics',
    description: 'Data visualization, model metrics, accuracy/loss curves, and confusion matrices with Matplotlib.',
    orderIndex: 10,
    xpReward: 75,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `import matplotlib.pyplot as plt
import numpy as np

# Simulate training metrics
epochs = range(1, 21)
train_loss = [2.0 * 0.8**e for e in epochs]
val_loss   = [2.2 * 0.78**e + 0.05 for e in epochs]
train_acc  = [1 - l/2 for l in train_loss]
val_acc    = [1 - l/2.2 for l in val_loss]

# 1. Loss curve
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

ax1.plot(epochs, train_loss, label='Train Loss', color='#0ea5e9')
ax1.plot(epochs, val_loss,   label='Val Loss',   color='#a855f7', linestyle='--')
ax1.set_title('Training & Validation Loss')
ax1.set_xlabel('Epoch'), ax1.set_ylabel('Loss')
ax1.legend()

# 2. Accuracy curve
ax2.plot(epochs, train_acc, label='Train Acc', color='#22c55e')
ax2.plot(epochs, val_acc,   label='Val Acc',   color='#f59e0b', linestyle='--')
ax2.set_title('Training & Validation Accuracy')
ax2.set_xlabel('Epoch'), ax2.set_ylabel('Accuracy')
ax2.legend()

plt.tight_layout()
plt.savefig('training_curves.png')
print("Chart saved!")`,
    content: `# Chapter 1.4 — AI Visualization & Analytics

## 🎯 What You'll Learn
How to visualize data, understand model performance through charts, interpret training curves, and read confusion matrices.

---

## 1. Why Visualization Matters in AI

> "A picture is worth a thousand data points."

Visualization helps you:
- **Understand your data** before modeling (spot outliers, distributions, correlations)
- **Debug your model** (is it learning? overfitting?)
- **Communicate results** to non-technical stakeholders
- **Find patterns** humans miss in raw numbers

---

## 2. Data Visualization Basics with Matplotlib

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Line plot — training curves
plt.figure(figsize=(10, 4))
plt.plot([1,2,3,4,5], [0.9, 0.6, 0.4, 0.3, 0.25], label='Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.title('Training Loss Over Time')
plt.legend()
plt.show()

# Bar chart — comparing model accuracy
models = ['Linear', 'Tree', 'Forest', 'Neural Net']
accuracy = [0.72, 0.81, 0.89, 0.94]
plt.figure(figsize=(8, 4))
plt.bar(models, accuracy, color=['#0ea5e9','#22c55e','#a855f7','#f59e0b'])
plt.ylim(0.5, 1.0)
plt.ylabel('Accuracy')
plt.title('Model Comparison')
plt.show()
\`\`\`

---

## 3. Distribution Plots

Understanding your data's shape is crucial before modeling.

\`\`\`python
import pandas as pd

df = pd.DataFrame({'age': np.random.normal(35, 10, 1000)})

# Histogram
plt.hist(df['age'], bins=30, color='#0ea5e9', edgecolor='white')
plt.xlabel('Age'), plt.ylabel('Count')
plt.title('Age Distribution')
plt.show()

# Box plot — shows median, quartiles, outliers
plt.boxplot(df['age'])
plt.title('Age Box Plot')
plt.show()

# Scatter plot — relationship between two variables
x = np.random.rand(100)
y = 2*x + np.random.rand(100)*0.3
plt.scatter(x, y, alpha=0.6, color='#a855f7')
plt.xlabel('Feature'), plt.ylabel('Target')
plt.title('Feature vs Target')
plt.show()
\`\`\`

---

## 4. Training Curves — Reading Model Health

Training curves are the heartbeat monitor of your model.

**Healthy training:**
\`\`\`
Loss:     ↓↓↓ (both curves decrease together)
Accuracy: ↑↑↑ (both curves increase together)
\`\`\`

**Overfitting detected:**
\`\`\`
Train loss: ↓↓↓ (keeps improving)
Val loss:   ↓↓→↑ (starts going UP after a point)
\`\`\`

**Underfitting detected:**
\`\`\`
Train loss: ↓ then plateau (stuck high)
Val loss:   ↓ then plateau (stuck high)
Both are high — model hasn't learned enough
\`\`\`

---

## 5. Confusion Matrix

A confusion matrix shows the full breakdown of a classifier's predictions.

For a binary (yes/no) classifier:

\`\`\`
                Predicted: No   Predicted: Yes
Actual: No       True Neg (TN)   False Pos (FP)
Actual: Yes      False Neg (FN)  True Pos (TP)
\`\`\`

| Cell | Meaning |
|------|---------|
| **True Positive** | Correctly predicted YES |
| **True Negative** | Correctly predicted NO |
| **False Positive** | Said YES, actually NO (false alarm) |
| **False Negative** | Said NO, actually YES (missed it!) |

\`\`\`python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

cm = confusion_matrix(y_true, y_predicted)
disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot()
plt.title('Confusion Matrix')
plt.show()
\`\`\`

---

## 6. Key Model Metrics Explained

| Metric | Formula | Use When |
|--------|---------|---------|
| **Accuracy** | (TP+TN) / Total | Balanced classes |
| **Precision** | TP / (TP+FP) | False alarms are costly |
| **Recall** | TP / (TP+FN) | Missing positives is costly |
| **F1 Score** | 2×(P×R)/(P+R) | Imbalanced classes |
| **ROC-AUC** | Area under ROC curve | Overall model quality |

---

## 7. Correlation Heatmap

\`\`\`python
import seaborn as sns

# Heatmap shows which features are correlated with each other
corr = df.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', center=0)
plt.title('Feature Correlation Matrix')
plt.show()
\`\`\`

**Interpretation:**
- +1 = perfect positive correlation
- -1 = perfect negative correlation
- 0 = no relationship
- High correlation between two features = redundant (consider dropping one)

---

## ✅ Key Takeaways

1. Always visualize data before modeling — histograms, scatter plots, box plots
2. Training curves diagnose model health — healthy, overfitting, or underfitting
3. Confusion matrix breaks down classification errors by type
4. Choose metrics based on the cost of different error types
5. Correlation heatmaps reveal redundant features

---

## 🔜 What's Next
Chapter 1.5 — **AI Mini Projects**: Apply everything you've learned.`,
    questions: [
      q('What does a validation loss curve that starts increasing (while train loss keeps decreasing) indicate?',
        [{ id: 'a', text: 'Underfitting' }, { id: 'b', text: 'Overfitting' }, { id: 'c', text: 'Perfect model convergence' }, { id: 'd', text: 'Missing data' }],
        'b', 'Diverging train/val loss curves are the classic sign of overfitting — the model memorizes training data but fails on validation data.', 0),
      q('What does a confusion matrix show?',
        [{ id: 'a', text: 'Training speed' }, { id: 'b', text: 'The breakdown of correct and incorrect predictions by class' }, { id: 'c', text: 'Feature importance' }, { id: 'd', text: 'Data distribution' }],
        'b', 'A confusion matrix displays true positives, true negatives, false positives, and false negatives for every class.', 1),
      q('What is a False Negative in a cancer detection model?',
        [{ id: 'a', text: 'The model flags a healthy patient as sick' }, { id: 'b', text: 'The model correctly identifies cancer' }, { id: 'c', text: 'The model misses a patient who actually has cancer' }, { id: 'd', text: 'The model rejects all predictions' }],
        'c', 'A False Negative means the model predicted NO (healthy) when the actual answer was YES (cancer) — the most dangerous error type in medical AI.', 2),
      q('When should you prefer Recall over Accuracy as a metric?',
        [{ id: 'a', text: 'When the classes are perfectly balanced' }, { id: 'b', text: 'When missing a positive case is very costly (e.g., disease detection)' }, { id: 'c', text: 'When the dataset is small' }, { id: 'd', text: 'When training is slow' }],
        'b', 'Recall (sensitivity) measures how many actual positives were caught. It is prioritized when false negatives are more dangerous than false alarms.', 3),
      q('What does a correlation of +1 between two features mean?',
        [{ id: 'a', text: 'They are completely unrelated' }, { id: 'b', text: 'One causes the other' }, { id: 'c', text: 'They move in perfectly opposite directions' }, { id: 'd', text: 'They move in perfect lockstep (one increases when the other does)' }],
        'd', 'A correlation of +1 means a perfect positive linear relationship — as one feature increases, the other increases proportionally.', 4),
    ],
  },

  // ──────────────────────────────────────────────
  {
    slug: 'ch1-5-ai-mini-projects',
    title: 'AI Mini Project Series',
    description: 'Beginner AI projects: spam detector, movie recommender, image classifier, chatbot, and sentiment analyzer.',
    orderIndex: 11,
    xpReward: 100,
    difficulty: 'BEGINNER',
    language: 'python',
    codeExample: `# PROJECT 1: Simple Spam Detector
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Training data
emails = [
    "Win a free iPhone now!",
    "Meeting rescheduled to 3pm",
    "Claim your prize — click here!",
    "Can you review my pull request?",
    "FREE MONEY — limited time offer!",
    "Lunch at 1pm today?",
]
labels = [1, 0, 1, 0, 1, 0]  # 1=spam, 0=not spam

# Build and train pipeline
spam_detector = Pipeline([
    ('vectorizer', TfidfVectorizer()),
    ('classifier', MultinomialNB()),
])
spam_detector.fit(emails, labels)

# Test it
test = ["Congratulations! You won a free trip!", "Code review done"]
predictions = spam_detector.predict(test)
for email, pred in zip(test, predictions):
    print(f"{'SPAM' if pred else 'HAM':4s}: {email}")`,
    content: `# Chapter 1.5 — AI Mini Project Series

## 🎯 What You'll Build
Five beginner-friendly AI projects that use everything from Phase 0 and Phase 1. Each project introduces a core AI pattern you'll use for the rest of your career.

---

## Why Projects Matter

> "The best way to learn AI is to build AI."

Reading about machine learning is essential — but building projects is where concepts truly stick. Each project here is a **template** for a whole category of real-world AI applications.

---

## Project 1: Spam Detector

**What it is:** Binary text classifier — spam (1) or not spam (0)

**Core concepts:** Text processing, TF-IDF vectorization, Naive Bayes

**Real-world version:** Gmail's spam filter uses exactly this approach (plus deep learning)

**How it works:**
1. Convert emails to numeric features (TF-IDF: word frequency scores)
2. Train a Naive Bayes classifier on labelled spam/ham examples
3. Predict on new emails

\`\`\`python
# The TF-IDF vectorizer converts text → numbers
# "win prize free" → [0.8, 0.7, 0.9, 0, 0, ...]
# Naive Bayes then learns: high TF-IDF on "win","free","prize" → spam
\`\`\`

**Extend it:** Use a real spam dataset (SpamAssassin, SMS Spam Collection on Kaggle)

---

## Project 2: Movie Recommender

**What it is:** Content-based recommendation system

**Core concepts:** Cosine similarity, feature vectors, similarity search

**Real-world version:** Netflix, YouTube, Spotify all use variants of this

**How it works:**
1. Represent each movie as a vector of features (genre, cast, rating...)
2. For a movie a user liked, find movies with similar feature vectors
3. Recommend the most similar ones

\`\`\`python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Movie feature vectors: [action, comedy, romance, sci-fi, horror]
movies = {
    "The Matrix":       [0.9, 0.1, 0.0, 1.0, 0.2],
    "Inception":        [0.8, 0.0, 0.3, 0.9, 0.1],
    "The Hangover":     [0.2, 1.0, 0.3, 0.0, 0.0],
    "Avengers":         [1.0, 0.3, 0.1, 0.7, 0.0],
    "Interstellar":     [0.5, 0.0, 0.4, 1.0, 0.0],
}

def recommend(liked_movie, n=2):
    names = list(movies.keys())
    vectors = np.array(list(movies.values()))
    idx = names.index(liked_movie)
    sims = cosine_similarity([vectors[idx]], vectors)[0]
    ranked = sorted(zip(names, sims), key=lambda x: x[1], reverse=True)
    return [(m, f"{s:.2f}") for m, s in ranked if m != liked_movie][:n]

print(recommend("The Matrix"))
# [('Inception', '0.98'), ('Interstellar', '0.89')]
\`\`\`

---

## Project 3: Image Classifier

**What it is:** Classify images into categories

**Core concepts:** Pixel features, simple classifiers (or CNNs for advanced)

**Real-world version:** Google Photos, Instagram filters, medical imaging

**With scikit-learn (beginner approach):**
\`\`\`python
from sklearn.datasets import load_digits
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Digits dataset: 8×8 pixel images of handwritten numbers
digits = load_digits()
X, y = digits.data, digits.target   # X: 1797×64 (64 pixels per image)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)
print(f"Accuracy: {clf.score(X_test, y_test):.1%}")  # ~97%
\`\`\`

**Next step:** Use PyTorch + CNN for real image classification (you'll do this in Phase 3).

---

## Project 4: Simple Chatbot

**What it is:** Rule-based + ML intent classifier chatbot

**Core concepts:** Pattern matching, intent classification, response generation

**Real-world version:** Customer support bots, FAQ bots

\`\`\`python
import re

responses = {
    r"hello|hi|hey": "Hello! How can I help you today?",
    r"what is ai|explain ai": "AI stands for Artificial Intelligence — systems that simulate human thinking!",
    r"help|support": "I can answer questions about AI. What would you like to know?",
    r"bye|goodbye": "Goodbye! Keep learning!",
}

def chatbot(user_input):
    user_input = user_input.lower()
    for pattern, response in responses.items():
        if re.search(pattern, user_input):
            return response
    return "I'm not sure about that. Try asking about AI!"

# Chat loop
print("AIRO Bot (type 'bye' to quit)")
while True:
    user = input("You: ").strip()
    if not user: continue
    reply = chatbot(user)
    print(f"Bot: {reply}")
    if "goodbye" in reply.lower(): break
\`\`\`

**Next step:** Use Hugging Face transformers for a neural chatbot (Phase 4).

---

## Project 5: Sentiment Analyzer

**What it is:** Classify text as positive, negative, or neutral

**Core concepts:** NLP, text vectorization, classification

**Real-world version:** Brand monitoring, review analysis, social media analytics

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

reviews = [
    ("This product is amazing! Love it.", "positive"),
    ("Terrible quality. Total waste of money.", "negative"),
    ("It's okay, nothing special.", "neutral"),
    ("Absolutely fantastic experience!", "positive"),
    ("Disappointing. Would not recommend.", "negative"),
    ("Average product. Does the job.", "neutral"),
]
texts, labels = zip(*reviews)

model = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression()),
])
model.fit(texts, labels)

test_reviews = [
    "This is the best purchase I've ever made!",
    "Broke after 2 days. Never again.",
]
for review in test_reviews:
    sentiment = model.predict([review])[0]
    print(f"{sentiment.upper():8s}: {review}")
\`\`\`

---

## What's Common Across All Projects

Every project follows the same pattern:
1. **Get data** (create, download, or use a built-in dataset)
2. **Preprocess** (clean, vectorize, encode)
3. **Train** (fit a model)
4. **Evaluate** (score on test set)
5. **Use it** (predict on new inputs)

This is the core ML loop. Master it here, and you'll apply it to any domain.

---

## ✅ Key Takeaways

1. Spam detection = text + Naive Bayes (fastest NLP starter)
2. Recommenders = cosine similarity between feature vectors
3. Image classification starts simple (pixel features + RF) and grows to CNNs
4. Rule-based chatbots → intent classifiers → neural chatbots (your progression)
5. Sentiment analysis = NLP + classification — used by every major brand

---

## 🔜 What's Next
**PHASE 2 BEGINS:** Machine Learning Core — supervised algorithms, ensemble methods, and model evaluation in depth.`,
    questions: [
      q('What technique converts text into numerical feature vectors for ML?',
        [{ id: 'a', text: 'One-hot encoding' }, { id: 'b', text: 'TF-IDF vectorization' }, { id: 'c', text: 'StandardScaler' }, { id: 'd', text: 'PCA' }],
        'b', 'TF-IDF (Term Frequency-Inverse Document Frequency) converts text into numerical vectors weighted by word importance.', 0),
      q('What does a recommendation system use to find similar items?',
        [{ id: 'a', text: 'Random selection' }, { id: 'b', text: 'Cosine similarity between feature vectors' }, { id: 'c', text: 'Sorting by price' }, { id: 'd', text: 'Alphabetical ordering' }],
        'b', 'Recommendation systems compute similarity (often cosine similarity) between item feature vectors and recommend the most similar ones.', 1),
      q('Which algorithm is commonly used for beginners building a spam detector?',
        [{ id: 'a', text: 'Neural network' }, { id: 'b', text: 'K-Means' }, { id: 'c', text: 'Naive Bayes' }, { id: 'd', text: 'LSTM' }],
        'c', 'Naive Bayes is fast, interpretable, and works well on text data — the classic algorithm for spam detection.', 2),
      q('What is sentiment analysis?',
        [{ id: 'a', text: 'Detecting spam in emails' }, { id: 'b', text: 'Classifying text as positive, negative, or neutral' }, { id: 'c', text: 'Translating text between languages' }, { id: 'd', text: 'Summarizing long documents' }],
        'b', 'Sentiment analysis classifies the emotional tone of text — positive, negative, or neutral. Used in brand monitoring and review analysis.', 3),
      q('What is the core ML loop that all 5 projects share?',
        [{ id: 'a', text: 'Design → Code → Debug → Deploy' }, { id: 'b', text: 'Get data → Preprocess → Train → Evaluate → Predict' }, { id: 'c', text: 'Research → Experiment → Publish → Scale' }, { id: 'd', text: 'Collect → Clean → Visualize → Report' }],
        'b', 'Every ML project follows: get data, preprocess it, train a model, evaluate on test set, then use it for predictions.', 4),
    ],
  },

  // ══════════════════════════════════════════════
  // PHASE OVERVIEWS (2-7 + Final)
  // ══════════════════════════════════════════════
  {
    slug: 'ch2-ml-core-overview',
    title: 'Phase 2: Machine Learning Core',
    description: 'Deep dive into regression, classification, clustering, ensemble methods, and model tuning.',
    orderIndex: 12,
    xpReward: 50,
    difficulty: 'INTERMEDIATE',
    language: 'python',
    codeExample: `from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, n_features=20, random_state=42)

# Gradient Boosting — often wins Kaggle competitions
model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1)
model.fit(X[:800], y[:800])
print(f"Accuracy: {model.score(X[800:], y[800:]):.1%}")

# Feature importance
importances = model.feature_importances_
top_features = sorted(enumerate(importances), key=lambda x: x[1], reverse=True)[:5]
print("Top 5 features:", [f"Feature {i}" for i, _ in top_features])`,
    content: `# Phase 2: Machine Learning Core

## What This Phase Covers

Phase 2 is where ML gets serious. You'll go from simple models to the algorithms that win Kaggle competitions and power production systems.

---

## Topics in This Phase

### Regression Algorithms
- **Linear Regression** — find the best-fit line
- **Ridge & Lasso** — regularized linear models (prevent overfitting)
- **Polynomial Regression** — model non-linear relationships
- **Elastic Net** — combination of Ridge and Lasso

### Classification Algorithms
- **Logistic Regression** — probabilistic classification
- **Decision Trees** — interpretable, hierarchical rules
- **K-Nearest Neighbors (KNN)** — classify by similarity to neighbors
- **Support Vector Machines (SVM)** — find the optimal decision boundary

### Ensemble Methods (Most Powerful)
- **Random Forest** — hundreds of decision trees voting together
- **Gradient Boosting** — trees built sequentially, each fixing the previous
- **XGBoost / LightGBM** — the tools that dominate Kaggle competitions
- **Stacking** — combine multiple models with a meta-learner

### Unsupervised Learning
- **K-Means Clustering** — group similar data points
- **DBSCAN** — density-based clustering, handles irregular shapes
- **PCA** — reduce dimensions while preserving variance
- **t-SNE / UMAP** — visualize high-dimensional data in 2D

### Feature Engineering & Selection
- Polynomial features
- Interaction terms
- Recursive Feature Elimination (RFE)
- SHAP values (explain model decisions)

### Model Evaluation & Tuning
- Cross-validation (k-fold)
- Grid Search & Random Search for hyperparameters
- Learning curves
- Bias-variance tradeoff

---

## Key Skills You'll Build

By the end of Phase 2, you will:
- Choose the right algorithm for any tabular dataset
- Tune models with cross-validation
- Explain model decisions with feature importance and SHAP
- Build production-ready ML pipelines with scikit-learn

---

## Phase 2 Projects
- House price predictor (regression)
- Customer churn predictor (classification)
- Customer segmentation dashboard (clustering)
- Credit risk scorer (ensemble)

---

## 🔜 Next
Phase 3 — **Deep Learning**: Neural networks, backpropagation, CNNs, and beyond.`,
    questions: [
      q('What is the advantage of ensemble methods like Random Forest over a single Decision Tree?',
        [{ id: 'a', text: 'They train faster' }, { id: 'b', text: 'They use less memory' }, { id: 'c', text: 'They combine many weak learners for better accuracy and less overfitting' }, { id: 'd', text: 'They are easier to interpret' }],
        'c', 'Ensemble methods combine many models — their errors tend to cancel out, resulting in better generalization.', 0),
      q('What does PCA (Principal Component Analysis) do?',
        [{ id: 'a', text: 'Classifies data into categories' }, { id: 'b', text: 'Reduces the number of features while preserving variance' }, { id: 'c', text: 'Generates new training data' }, { id: 'd', text: 'Increases model accuracy directly' }],
        'b', 'PCA is a dimensionality reduction technique that projects high-dimensional data to fewer dimensions while keeping the most important variance.', 1),
      q('What is cross-validation used for?',
        [{ id: 'a', text: 'Training the model faster' }, { id: 'b', text: 'Visualizing data' }, { id: 'c', text: 'Getting a reliable estimate of model performance on unseen data' }, { id: 'd', text: 'Downloading datasets automatically' }],
        'c', 'Cross-validation trains and evaluates a model multiple times on different data splits, giving a more reliable performance estimate than a single train/test split.', 2),
      q('What is the bias-variance tradeoff?',
        [{ id: 'a', text: 'The tradeoff between training speed and accuracy' }, { id: 'b', text: 'The balance between underfitting (high bias) and overfitting (high variance)' }, { id: 'c', text: 'The tradeoff between data size and model size' }, { id: 'd', text: 'The balance between precision and recall' }],
        'b', 'High bias = underfitting (too simple); high variance = overfitting (too complex). Finding the sweet spot is the core ML challenge.', 3),
      q('Which algorithm is known for winning most Kaggle tabular competitions?',
        [{ id: 'a', text: 'Linear Regression' }, { id: 'b', text: 'K-Nearest Neighbors' }, { id: 'c', text: 'XGBoost / Gradient Boosting' }, { id: 'd', text: 'Naive Bayes' }],
        'c', 'Gradient Boosting variants (XGBoost, LightGBM, CatBoost) dominate structured/tabular data competitions due to their power and efficiency.', 4),
    ],
  },

  {
    slug: 'ch3-deep-learning-overview',
    title: 'Phase 3: Deep Learning',
    description: 'Neural networks, backpropagation, CNNs, RNNs, Transformers, TensorFlow, and PyTorch.',
    orderIndex: 13,
    xpReward: 50,
    difficulty: 'INTERMEDIATE',
    language: 'python',
    codeExample: `import torch
import torch.nn as nn

# A simple neural network in PyTorch
class SimpleNet(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, output_dim),
        )

    def forward(self, x):
        return self.layers(x)

model = SimpleNet(input_dim=784, hidden_dim=256, output_dim=10)
print(model)
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")`,
    content: `# Phase 3: Deep Learning

## What This Phase Covers

Deep Learning is the technology behind virtually every state-of-the-art AI system today — image recognition, language models, voice assistants, protein structure prediction, and more.

---

## Topics in This Phase

### Neural Network Fundamentals
- **Perceptrons** — the simplest neuron
- **Activation functions** — ReLU, Sigmoid, Tanh, GELU
- **Layers** — input, hidden, output
- **Forward pass** — data flows through layers
- **Backpropagation** — gradients flow backwards to update weights
- **Loss functions** — MSE (regression), Cross-Entropy (classification)

### Training Deep Networks
- **Gradient Descent variants** — SGD, Adam, AdamW
- **Learning rate scheduling**
- **Batch normalization**
- **Dropout** (regularization)
- **Early stopping**
- **Transfer learning** — use pre-trained model weights

### Convolutional Neural Networks (CNNs)
- Designed for images
- **Convolutional layers** — learn local patterns (edges, textures)
- **Pooling layers** — reduce spatial size
- **Classic architectures** — LeNet, AlexNet, VGG, ResNet, EfficientNet
- **Applications** — image classification, object detection, segmentation

### Recurrent Neural Networks (RNNs)
- Designed for sequences (time series, text)
- **Vanilla RNN** — suffers from vanishing gradients
- **LSTM** — Long Short-Term Memory, solves vanishing gradients
- **GRU** — Gated Recurrent Unit, lighter than LSTM
- **Applications** — text generation, time series forecasting

### Transformers
- The architecture behind GPT, BERT, and most modern AI
- **Self-attention** — every token attends to every other token
- **Multi-head attention** — multiple attention patterns simultaneously
- **Positional encoding** — gives transformers a sense of order
- **BERT** — encoder-only, great for understanding
- **GPT** — decoder-only, great for generation

### Frameworks
- **PyTorch** — research favourite, dynamic computation graph
- **TensorFlow / Keras** — production favourite, great deployment tools

---

## Phase 3 Projects
- Handwritten digit recognizer (CNN)
- Sentiment classifier (LSTM + embeddings)
- Image generator (basic GAN)
- Text classifier using BERT (transfer learning)

---

## 🔜 Next
Phase 4 — **Generative AI & LLMs**.`,
    questions: [
      q('What is the role of activation functions in neural networks?',
        [{ id: 'a', text: 'They load the training data' }, { id: 'b', text: 'They introduce non-linearity so the network can learn complex patterns' }, { id: 'c', text: 'They speed up training' }, { id: 'd', text: 'They reduce the number of parameters' }],
        'b', 'Without non-linear activations, stacking layers is equivalent to a single linear transformation. Activations let networks learn complex non-linear patterns.', 0),
      q('What are CNNs (Convolutional Neural Networks) specifically designed for?',
        [{ id: 'a', text: 'Time series data' }, { id: 'b', text: 'Text generation' }, { id: 'c', text: 'Image and spatial data' }, { id: 'd', text: 'Tabular structured data' }],
        'c', 'CNNs exploit the spatial structure of images through convolutional filters that detect local patterns like edges and textures.', 1),
      q('What problem do LSTMs solve compared to vanilla RNNs?',
        [{ id: 'a', text: 'LSTMs train faster' }, { id: 'b', text: 'LSTMs solve the vanishing gradient problem for long sequences' }, { id: 'c', text: 'LSTMs use less memory' }, { id: 'd', text: 'LSTMs work with images' }],
        'b', 'Vanilla RNNs struggle to learn long-range dependencies due to vanishing gradients. LSTMs use gates to control information flow across long sequences.', 2),
      q('What is the key innovation of the Transformer architecture?',
        [{ id: 'a', text: 'Convolutional filters' }, { id: 'b', text: 'Recurrent hidden states' }, { id: 'c', text: 'Self-attention — every token attends to every other token' }, { id: 'd', text: 'Random forest ensembling' }],
        'c', 'Self-attention allows transformers to model relationships between any two positions in a sequence regardless of distance — the key breakthrough over RNNs.', 3),
      q('What is transfer learning in deep learning?',
        [{ id: 'a', text: 'Moving data between servers' }, { id: 'b', text: 'Starting training from a pre-trained model\'s weights instead of random initialization' }, { id: 'c', text: 'Training on multiple GPUs simultaneously' }, { id: 'd', text: 'Copying model architecture between frameworks' }],
        'b', 'Transfer learning reuses weights learned on a large dataset (e.g., ImageNet) as a starting point, dramatically reducing training time for new tasks.', 4),
    ],
  },

  {
    slug: 'ch4-generative-ai-overview',
    title: 'Phase 4: Generative AI & LLMs',
    description: 'LLMs, prompt engineering, RAG, AI agents, vector databases, and fine-tuning.',
    orderIndex: 14,
    xpReward: 50,
    difficulty: 'ADVANCED',
    language: 'python',
    codeExample: `# Using an LLM via API (conceptual — replace with your API key)
import os

# Example of how you'd call Claude or GPT
# from anthropic import Anthropic
# client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# Prompt engineering patterns
system_prompt = """You are an expert AI tutor.
Explain concepts clearly with analogies.
Always give a practical example."""

few_shot_examples = """
Q: What is gradient descent?
A: Gradient descent is like hiking downhill blindfolded...

Q: What is a transformer?
A: A transformer uses attention to look at all words simultaneously...
"""

user_question = "What is a neural network?"

final_prompt = f"{system_prompt}\\n\\n{few_shot_examples}\\nQ: {user_question}\\nA:"
print("Prompt built. In production, send this to the LLM API.")
print(f"Prompt length: {len(final_prompt)} characters")`,
    content: `# Phase 4: Generative AI & LLMs

## What This Phase Covers

Generative AI is the most exciting frontier in AI today — systems that create text, images, code, audio, and video. This phase covers how to build with LLMs, not just use them.

---

## Topics in This Phase

### Large Language Models (LLMs)
- How LLMs work at a high level (next token prediction)
- Major models: GPT-4, Claude, Gemini, Llama, Mistral
- Tokenization — how text is split into tokens
- Context window — how much the model "remembers"
- Temperature — controlling randomness
- Using LLM APIs (OpenAI, Anthropic, etc.)

### Prompt Engineering
- **Zero-shot prompting** — no examples, just instruction
- **Few-shot prompting** — give examples in the prompt
- **Chain-of-thought** — ask the model to reason step by step
- **System prompts** — set the model's role and behaviour
- **Output formatting** — get JSON, markdown, structured data
- **Prompt injection** — security risks to understand

### Retrieval-Augmented Generation (RAG)
- Problem: LLMs have outdated/limited knowledge
- Solution: give the model relevant documents at query time
- **Vector databases**: store text as embeddings, search by similarity
- **Popular vector DBs**: Pinecone, Weaviate, Chroma, pgvector
- Build a Q&A system over your own documents

### AI Agents
- LLMs that can use **tools** (search, code, calculators, APIs)
- **ReAct pattern** — Reason + Act loops
- **LangChain / LlamaIndex** — frameworks for building agents
- **Multi-agent systems** — multiple LLMs collaborating

### Fine-Tuning
- Adapt a pre-trained model to your specific domain
- **LoRA** — Low-Rank Adaptation (efficient fine-tuning)
- **RLHF** — Reinforcement Learning from Human Feedback (how ChatGPT was trained)
- When to fine-tune vs. when to use RAG

### Diffusion Models (Image Generation)
- How Stable Diffusion, DALL-E, and Midjourney work
- Text-to-image generation
- Image-to-image, inpainting

---

## Phase 4 Projects
- Build a document Q&A chatbot with RAG
- Create an AI agent with web search + calculator tools
- Fine-tune an LLM on custom data with LoRA
- Build an AI-powered writing assistant

---

## 🔜 Next
Phase 5 — **Robotics Foundations**.`,
    questions: [
      q('What does RAG stand for in the context of LLMs?',
        [{ id: 'a', text: 'Rapid AI Generation' }, { id: 'b', text: 'Retrieval-Augmented Generation' }, { id: 'c', text: 'Recurrent Attention Graph' }, { id: 'd', text: 'Random Attention Gradient' }],
        'b', 'RAG = Retrieval-Augmented Generation. It gives LLMs access to external knowledge by retrieving relevant documents at query time.', 0),
      q('What is prompt engineering?',
        [{ id: 'a', text: 'Writing Python code for AI' }, { id: 'b', text: 'Designing and optimizing inputs to get better outputs from LLMs' }, { id: 'c', text: 'Training a language model from scratch' }, { id: 'd', text: 'Deploying models to production' }],
        'b', 'Prompt engineering is the skill of crafting inputs to language models that produce accurate, useful, and formatted outputs.', 1),
      q('What is the purpose of a vector database in a RAG system?',
        [{ id: 'a', text: 'To store images' }, { id: 'b', text: 'To store and search text by semantic similarity' }, { id: 'c', text: 'To train the language model' }, { id: 'd', text: 'To host the frontend' }],
        'b', 'Vector databases store text as numerical embeddings and allow fast similarity search — finding the most relevant documents for a given query.', 2),
      q('What is fine-tuning an LLM?',
        [{ id: 'a', text: 'Using the model with a good prompt' }, { id: 'b', text: 'Adapting a pre-trained model to a specific domain by further training on domain data' }, { id: 'c', text: 'Making the model answer faster' }, { id: 'd', text: 'Deploying the model on a GPU' }],
        'b', 'Fine-tuning continues training a pre-trained model on domain-specific data, adjusting weights to specialise its knowledge and style.', 3),
      q('What are AI agents?',
        [{ id: 'a', text: 'Physical robots controlled by AI' }, { id: 'b', text: 'LLMs that can use tools, search the web, and take actions' }, { id: 'c', text: 'Simple chatbots with fixed responses' }, { id: 'd', text: 'Models that only generate images' }],
        'b', 'AI agents combine LLMs with tools (web search, code execution, APIs) allowing them to take multi-step actions to complete complex tasks.', 4),
    ],
  },

  {
    slug: 'ch5-robotics-foundations-overview',
    title: 'Phase 5: Robotics Foundations',
    description: 'Sensors, actuators, embedded systems, Arduino, Raspberry Pi, and robotics mathematics.',
    orderIndex: 15,
    xpReward: 50,
    difficulty: 'ADVANCED',
    language: 'python',
    codeExample: `# Robotics math — coordinate transformations
import numpy as np

# 2D rotation matrix
def rotation_matrix_2d(angle_degrees):
    angle = np.radians(angle_degrees)
    return np.array([
        [np.cos(angle), -np.sin(angle)],
        [np.sin(angle),  np.cos(angle)]
    ])

# Rotate a point 45 degrees
point = np.array([1.0, 0.0])
R = rotation_matrix_2d(45)
rotated = R @ point
print(f"Original: {point}")
print(f"Rotated 45°: {rotated.round(3)}")  # [0.707, 0.707]

# Simulate sensor reading with noise
def simulate_ultrasonic_sensor(true_distance, noise_std=0.02):
    noise = np.random.normal(0, noise_std)
    return max(0, true_distance + noise)

for _ in range(5):
    reading = simulate_ultrasonic_sensor(1.0)
    print(f"Sensor reading: {reading:.3f}m")`,
    content: `# Phase 5: Robotics Foundations

## What This Phase Covers

Robotics combines hardware and software — sensors that perceive the world, actuators that move through it, and embedded systems that control everything. This phase gives you the hardware side of AI.

---

## Topics in This Phase

### How Robots Perceive
**Sensors** let robots sense their environment:
- **Camera** — RGB, depth (RealSense, ZED), fisheye
- **LiDAR** — laser scanner that creates 3D point clouds
- **Ultrasonic** — measure distance (used in parking sensors)
- **IMU** (Inertial Measurement Unit) — accelerometer + gyroscope (orientation)
- **GPS** — outdoor positioning
- **Encoders** — measure motor rotation for odometry

### How Robots Act
**Actuators** let robots move and interact:
- **DC motors** — continuous rotation (wheels)
- **Servo motors** — precise angle control (robot arms)
- **Stepper motors** — precise step control (3D printers)
- **Linear actuators** — push/pull linear motion
- **Pneumatic/hydraulic** — heavy industrial systems

### Embedded Systems
- **Arduino** — beginner microcontroller, C/C++, controls motors/sensors directly
- **Raspberry Pi** — mini Linux computer, runs Python, handles complex logic
- **Jetson Nano/Orin** — NVIDIA's AI edge computer, runs neural networks at the edge
- **ESP32** — WiFi-enabled microcontroller for IoT

### Robotics Mathematics
- **Coordinate systems** — represent positions in space (x, y, z)
- **Rotation matrices** — represent orientation
- **Homogeneous transforms** — combine rotation + translation
- **Forward kinematics** — given joint angles, where is the end effector?
- **Inverse kinematics** — given target position, what joint angles are needed?
- **PID control** — Proportional-Integral-Derivative controller for smooth movement

### Communication Protocols
- **UART / Serial** — simple wire communication
- **I2C** — connect multiple sensors to one board
- **SPI** — fast sensor communication
- **ROS topics** — publish/subscribe messaging between robot components

---

## Phase 5 Projects
- Build a line-following robot (Arduino)
- Create an obstacle avoidance system (ultrasonic + servo)
- Program a robotic arm to reach target positions
- Build a Raspberry Pi robot car with camera streaming

---

## 🔜 Next
Phase 6 — **Advanced Robotics + AI**: ROS, SLAM, and autonomous navigation.`,
    questions: [
      q('What does LiDAR do in a robot?',
        [{ id: 'a', text: 'Controls motor speed' }, { id: 'b', text: 'Creates 3D maps of the environment using laser scanning' }, { id: 'c', text: 'Connects to WiFi' }, { id: 'd', text: 'Measures temperature' }],
        'b', 'LiDAR (Light Detection And Ranging) emits laser pulses and measures their return time to build precise 3D point clouds of the environment.', 0),
      q('What is the difference between Arduino and Raspberry Pi?',
        [{ id: 'a', text: 'They are the same device' }, { id: 'b', text: 'Arduino is a microcontroller for direct hardware control; Raspberry Pi is a mini Linux computer' }, { id: 'c', text: 'Raspberry Pi only runs Java' }, { id: 'd', text: 'Arduino is more powerful than Raspberry Pi' }],
        'b', 'Arduino is a simple microcontroller great for real-time hardware control. Raspberry Pi is a full Linux computer capable of running complex software like OpenCV.', 1),
      q('What is inverse kinematics in robotics?',
        [{ id: 'a', text: 'Moving the robot backwards' }, { id: 'b', text: 'Given a target position, calculate the required joint angles' }, { id: 'c', text: 'Measuring sensor noise' }, { id: 'd', text: 'Controlling motor speed' }],
        'b', 'Inverse kinematics calculates what joint angles a robot arm needs to position its end-effector (gripper/tool) at a desired location in space.', 2),
      q('What type of motor provides precise angle control?',
        [{ id: 'a', text: 'DC motor' }, { id: 'b', text: 'Stepper motor' }, { id: 'c', text: 'Servo motor' }, { id: 'd', text: 'Induction motor' }],
        'c', 'Servo motors have built-in position control and can rotate to a specific angle — used in robot arms, pan-tilt cameras, and RC vehicles.', 3),
      q('What does an IMU sensor measure?',
        [{ id: 'a', text: 'Distance to obstacles' }, { id: 'b', text: 'Temperature and humidity' }, { id: 'c', text: 'Orientation, acceleration, and angular velocity' }, { id: 'd', text: 'Color and light' }],
        'c', 'An IMU (Inertial Measurement Unit) combines an accelerometer and gyroscope to measure orientation, acceleration, and rotation — essential for robot navigation.', 4),
    ],
  },

  {
    slug: 'ch6-advanced-robotics-overview',
    title: 'Phase 6: Advanced Robotics + AI',
    description: 'ROS, SLAM, path planning, autonomous navigation, and computer vision for robotics.',
    orderIndex: 16,
    xpReward: 50,
    difficulty: 'ADVANCED',
    language: 'python',
    codeExample: `# Simulating a simple A* path planning algorithm
import heapq

def astar(grid, start, goal):
    """Simple A* pathfinder on a 2D grid. 0=free, 1=obstacle."""
    def h(a, b): return abs(a[0]-b[0]) + abs(a[1]-b[1])

    open_set = [(0, start)]
    came_from = {}
    g_score = {start: 0}

    while open_set:
        _, current = heapq.heappop(open_set)
        if current == goal:
            path = []
            while current in came_from:
                path.append(current); current = came_from[current]
            return path[::-1]
        for dx, dy in [(0,1),(0,-1),(1,0),(-1,0)]:
            nx, ny = current[0]+dx, current[1]+dy
            neighbor = (nx, ny)
            if 0 <= nx < len(grid) and 0 <= ny < len(grid[0]) and grid[nx][ny] == 0:
                tentative_g = g_score[current] + 1
                if tentative_g < g_score.get(neighbor, float('inf')):
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    heapq.heappush(open_set, (tentative_g + h(neighbor, goal), neighbor))
    return []

grid = [[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]
path = astar(grid, (0,0), (3,3))
print("Path found:", path)`,
    content: `# Phase 6: Advanced Robotics + AI

## What This Phase Covers

This is where robots become truly autonomous — combining ROS, SLAM, path planning, and AI to navigate real environments.

---

## Topics in This Phase

### ROS — Robot Operating System
- Not actually an OS — it's a middleware framework for robotics
- **ROS Topics** — publish/subscribe message passing
- **ROS Nodes** — independent processes (sensor driver, planner, controller)
- **ROS Services** — synchronous request/response
- **ROS Actions** — long-running tasks with feedback
- **URDF** — XML format for describing robot geometry
- **RViz** — 3D visualization tool for ROS
- **Gazebo** — physics simulation for testing without hardware

### SLAM — Simultaneous Localization and Mapping
- The robot builds a map of an unknown environment AND knows where it is in that map
- Solves the chicken-and-egg problem: need map to localize, need location to map
- **Algorithms**: GMapping, Cartographer, ORB-SLAM, RTAB-Map
- **Input**: LiDAR scans + odometry
- **Output**: occupancy grid map + robot pose

### Path Planning
- **Global planner** — finds route from A to B on the full map (A*, Dijkstra)
- **Local planner** — avoids dynamic obstacles in real-time (DWA, TEB)
- **Nav2** — the standard navigation stack for ROS 2
- **Behavior trees** — structured control flow for complex robot tasks

### Computer Vision for Robotics
- **Object detection** — YOLO, SSD running on robot cameras
- **Depth estimation** — stereo cameras or monocular depth prediction
- **Visual odometry** — track robot motion from camera alone
- **Point cloud processing** — PCL library for LiDAR data

### Reinforcement Learning for Robots
- Train robots in simulation (MuJoCo, IsaacGym)
- Transfer learned policy to real hardware (sim-to-real transfer)
- Boston Dynamics uses RL for legged robot locomotion

---

## Phase 6 Projects
- Navigate a simulated environment with ROS + Nav2
- Build a SLAM system on a Raspberry Pi robot
- Object detection + pick-and-place with a robot arm
- Autonomous obstacle course in Gazebo simulation

---

## 🔜 Next
Phase 7 — **Production AI Systems**: Deploy AI to the real world.`,
    questions: [
      q('What does SLAM stand for?',
        [{ id: 'a', text: 'Sequential Learning and Mapping' }, { id: 'b', text: 'Simultaneous Localization and Mapping' }, { id: 'c', text: 'Spatial Learning Algorithm Module' }, { id: 'd', text: 'Sensor-based Locomotion and Movement' }],
        'b', 'SLAM = Simultaneous Localization and Mapping. The robot builds a map of an unknown environment while simultaneously tracking its own position within that map.', 0),
      q('What is ROS?',
        [{ id: 'a', text: 'A new operating system replacing Linux' }, { id: 'b', text: 'A middleware framework for robot software communication' }, { id: 'c', text: 'A type of robot hardware' }, { id: 'd', text: 'A Python library for robotics math' }],
        'b', 'ROS (Robot Operating System) is a middleware framework providing tools and communication infrastructure for building robot software systems.', 1),
      q('What is the role of Gazebo in robotics development?',
        [{ id: 'a', text: 'A tool for 3D printing robot parts' }, { id: 'b', text: 'A physics simulator for testing robots without physical hardware' }, { id: 'c', text: 'A cloud platform for deploying robots' }, { id: 'd', text: 'A sensor calibration tool' }],
        'b', 'Gazebo is a physics simulation environment where you can test robots virtually before deploying to real hardware — saving time and preventing damage.', 2),
      q('What is the A* algorithm used for in robotics?',
        [{ id: 'a', text: 'Training neural networks' }, { id: 'b', text: 'Processing camera images' }, { id: 'c', text: 'Finding the shortest path from start to goal on a map' }, { id: 'd', text: 'Controlling servo motor angles' }],
        'c', 'A* is a popular path planning algorithm that finds the optimal route from a start to goal position on a grid or graph.', 3),
      q('What is sim-to-real transfer in robot RL?',
        [{ id: 'a', text: 'Moving simulation data to a database' }, { id: 'b', text: 'Training a policy in simulation and deploying it to a physical robot' }, { id: 'c', text: 'Converting 2D images to 3D models' }, { id: 'd', text: 'Transferring between ROS versions' }],
        'b', 'Sim-to-real transfer trains RL policies in simulated environments (faster, safer, cheaper) and then deploys the learned behaviour to real hardware.', 4),
    ],
  },

  {
    slug: 'ch7-production-ai-overview',
    title: 'Phase 7: Production AI Systems',
    description: 'MLOps, Docker, Kubernetes, AI deployment, GPU infrastructure, cloud AI, and edge AI.',
    orderIndex: 17,
    xpReward: 50,
    difficulty: 'EXPERT',
    language: 'python',
    codeExample: `# FastAPI — the standard for deploying ML models as APIs
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="AIRO Model API")

class PredictRequest(BaseModel):
    features: list[float]

class PredictResponse(BaseModel):
    prediction: float
    confidence: float

# Simulated trained model
def fake_model(features):
    score = np.mean(features)
    return round(score, 3), round(abs(np.std(features)), 3)

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    pred, conf = fake_model(request.features)
    return PredictResponse(prediction=pred, confidence=conf)

@app.get("/health")
async def health():
    return {"status": "ok", "model": "v1.0"}

# Run: uvicorn main:app --host 0.0.0.0 --port 8000`,
    content: `# Phase 7: Production AI Systems

## What This Phase Covers

Building AI models is only half the job. Getting them into production — reliably, scalably, and monitored — is the other half. This is MLOps.

---

## Topics in This Phase

### MLOps Fundamentals
- **ML Pipeline** — data → training → evaluation → deployment → monitoring
- **Reproducibility** — same code + same data = same model
- **Model versioning** — track model versions (MLflow, Weights & Biases)
- **Data versioning** — track dataset versions (DVC)
- **CI/CD for ML** — automated testing and deployment of models

### Model Serving
- **FastAPI** — build REST APIs for your models in Python
- **TorchServe** — serve PyTorch models at scale
- **TensorFlow Serving** — serve TensorFlow models
- **Triton Inference Server** — NVIDIA's high-performance serving platform
- **Batch vs real-time inference**

### Docker for ML
- Package your model + dependencies in a container
- Containers run identically everywhere (dev, staging, production)
\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
\`\`\`

### Kubernetes for Scale
- Orchestrate hundreds of model serving containers
- Auto-scale based on traffic
- Rolling updates (update model with zero downtime)
- GPU node pools for inference

### Cloud AI Services
- **AWS SageMaker** — end-to-end ML platform
- **Google Vertex AI** — Google's MLOps platform
- **Azure ML** — Microsoft's ML platform
- **Lambda functions** — serverless inference for light models

### Model Monitoring
- **Data drift** — input distribution shifts over time
- **Concept drift** — relationship between features and target changes
- **Performance degradation** — accuracy drops in production
- **Tools** — Evidently AI, WhyLabs, Great Expectations

### Edge AI
- Run models directly on devices (no cloud required)
- **NVIDIA Jetson** — powerful edge AI hardware
- **TensorRT** — optimize PyTorch/TF models for NVIDIA hardware
- **ONNX** — open model format, works across frameworks
- **TensorFlow Lite** — run models on mobile/embedded

---

## Phase 7 Projects
- Containerize and deploy a model with Docker + FastAPI
- Set up a full MLOps pipeline with MLflow
- Deploy to Kubernetes with auto-scaling
- Optimize a model for edge deployment with TensorRT

---

## 🔜 What's Next
The **AIRO Master Path** — your final large projects.`,
    questions: [
      q('What is MLOps?',
        [{ id: 'a', text: 'A new machine learning algorithm' }, { id: 'b', text: 'Practices and tools for deploying and maintaining ML models in production' }, { id: 'c', text: 'A type of neural network architecture' }, { id: 'd', text: 'A cloud computing service' }],
        'b', 'MLOps (ML Operations) applies DevOps principles to machine learning — automating the pipeline from training to deployment to monitoring.', 0),
      q('What is the main benefit of containerizing an ML model with Docker?',
        [{ id: 'a', text: 'It makes the model more accurate' }, { id: 'b', text: 'It ensures the model runs identically across all environments' }, { id: 'c', text: 'It speeds up training' }, { id: 'd', text: 'It reduces model size' }],
        'b', 'Docker containers package the model with all its dependencies, ensuring it behaves identically on any machine — dev, staging, or production.', 1),
      q('What is data drift in the context of deployed ML models?',
        [{ id: 'a', text: 'Missing values in training data' }, { id: 'b', text: 'A change in the distribution of input data over time' }, { id: 'c', text: 'Incorrect data labels' }, { id: 'd', text: 'Data loading errors' }],
        'b', 'Data drift occurs when the statistical properties of real-world input data change from what the model was trained on, causing performance degradation.', 2),
      q('What does edge AI mean?',
        [{ id: 'a', text: 'AI running at the edge of the internet' }, { id: 'b', text: 'Running AI inference directly on devices without cloud connectivity' }, { id: 'c', text: 'AI that processes data at the boundaries of datasets' }, { id: 'd', text: 'AI systems with high uncertainty' }],
        'b', 'Edge AI runs models on local hardware (phones, Jetson, Raspberry Pi) without sending data to the cloud — enabling low-latency, private, offline AI.', 3),
      q('What is Kubernetes used for in AI deployment?',
        [{ id: 'a', text: 'Training neural networks' }, { id: 'b', text: 'Orchestrating and scaling containerized model serving' }, { id: 'c', text: 'Preprocessing datasets' }, { id: 'd', text: 'Drawing architecture diagrams' }],
        'b', 'Kubernetes orchestrates containers at scale — automatically scaling model serving pods based on traffic, enabling zero-downtime deployments.', 4),
    ],
  },

  {
    slug: 'ch-final-airo-master-path',
    title: 'Final Stage: AIRO Master Path',
    description: 'Capstone projects — AI Assistant, Autonomous Robot, AI SaaS, Multi-Agent Systems, and more.',
    orderIndex: 18,
    xpReward: 200,
    difficulty: 'EXPERT',
    language: 'python',
    codeExample: `# The kind of system you'll build by the end of AIRO BOTS
# A multi-component AI pipeline (conceptual architecture)

class AIROAssistant:
    """
    Full-stack AI assistant combining:
    - LLM for reasoning and generation
    - RAG for knowledge retrieval
    - Tools for web search, code execution
    - Memory for conversation history
    - Vector DB for semantic search
    """
    def __init__(self):
        self.memory = []
        self.tools = ["web_search", "code_executor", "calculator"]
        print("AIRO Assistant initialized")
        print(f"Tools available: {self.tools}")

    def process(self, user_input: str) -> str:
        self.memory.append({"role": "user", "content": user_input})
        # In reality: call LLM API with memory + retrieved context
        response = f"[AI reasoning over: '{user_input}' with {len(self.tools)} tools]"
        self.memory.append({"role": "assistant", "content": response})
        return response

assistant = AIROAssistant()
print(assistant.process("Explain gradient descent"))
print(f"Conversation history: {len(assistant.memory)} messages")`,
    content: `# Final Stage: AIRO Master Path

## 🏆 You Made It Here

If you've completed all phases and arrived at this chapter, you've built a formidable foundation. The final stage is about integration — combining everything into large, real-world systems.

---

## The 8 Capstone Projects

### Project 1: AI Assistant
A full-stack conversational AI with:
- LLM backend (Claude/GPT)
- RAG over custom documents
- Tools: web search, calculator, code runner
- Memory across conversations
- Web interface

**Skills:** LLMs, RAG, vector DBs, FastAPI, React

---

### Project 2: Autonomous Mobile Robot
A physical robot that:
- Maps its environment (SLAM)
- Plans paths to goals
- Avoids dynamic obstacles
- Executes manipulation tasks

**Skills:** ROS 2, SLAM, Nav2, computer vision, Raspberry Pi

---

### Project 3: AI-Powered Drone
A drone that:
- Flies autonomously using GPS waypoints
- Uses computer vision for obstacle avoidance
- Can track a target object
- Lands automatically

**Skills:** PX4 autopilot, ROS, object tracking, OpenCV

---

### Project 4: Computer Vision Security System
A real-time security system that:
- Detects people and objects
- Recognizes faces (with consent)
- Sends alerts for unauthorized access
- Logs events with video clips

**Skills:** YOLO, DeepFace, FastAPI, OpenCV, database

---

### Project 5: Multi-Agent AI System
Multiple AI agents collaborating:
- Research agent (web search)
- Writing agent (drafts content)
- Critic agent (reviews and improves)
- Orchestrator (coordinates the team)

**Skills:** LLM agents, LangGraph, async Python, prompt engineering

---

### Project 6: Voice Assistant
A real-time voice assistant:
- Speech-to-text (Whisper)
- LLM reasoning
- Text-to-speech
- Wake word detection
- Home automation integration

**Skills:** Whisper, TTS, audio processing, IoT

---

### Project 7: AI SaaS Platform
A full commercial-ready web application:
- User authentication
- AI features (generation, analysis, chat)
- Usage-based billing
- API access for developers
- Admin dashboard

**Skills:** Full stack (Next.js + FastAPI), Stripe, LLMs, deployment

---

### Project 8: Robotics Simulation Platform
A web-based robotics simulator:
- 3D robot simulation in the browser
- Code the robot in Python
- Real physics simulation
- Competition challenges

**Skills:** Three.js, WebAssembly, ROS, physics simulation

---

## After Completing the Roadmap

You will be ready for:

| Role | What You'll Build |
|------|------------------|
| **AI Engineer** | LLM apps, RAG systems, AI agents |
| **ML Engineer** | Training pipelines, model optimization |
| **Robotics Engineer** | ROS systems, autonomous navigation |
| **MLOps Engineer** | Production ML infrastructure |
| **AI Researcher** | Novel architectures and methods |

---

## Final Word

> "The best AI engineers are not just coders — they are problem solvers who understand data, algorithms, hardware, and human needs."

Every chapter you completed on this platform was a step toward mastery. The field of AI is vast, fast-moving, and endlessly exciting. Keep building. Keep shipping. Keep learning.

**Welcome to the AIRO BOTS graduate circle. 🤖**`,
    questions: [
      q('What is the primary goal of the capstone AI Assistant project?',
        [{ id: 'a', text: 'Build a simple chatbot with pre-written responses' }, { id: 'b', text: 'Combine LLM, RAG, tools, and memory into a full-stack assistant' }, { id: 'c', text: 'Create a mobile app' }, { id: 'd', text: 'Train a neural network from scratch' }],
        'b', 'The capstone AI Assistant integrates multiple technologies — LLM, RAG for knowledge, tools for actions, and memory for context — into a complete system.', 0),
      q('Which technology enables a drone to avoid obstacles using a camera?',
        [{ id: 'a', text: 'SLAM' }, { id: 'b', text: 'Gradient descent' }, { id: 'c', text: 'Computer vision (YOLO / object detection)' }, { id: 'd', text: 'TF-IDF' }],
        'c', 'Object detection models like YOLO run on drone cameras in real-time to identify obstacles, allowing the flight controller to adjust the trajectory.', 1),
      q('In a multi-agent AI system, what does an orchestrator agent do?',
        [{ id: 'a', text: 'It writes all the code' }, { id: 'b', text: 'It coordinates multiple specialized agents to complete complex tasks' }, { id: 'c', text: 'It handles database storage' }, { id: 'd', text: 'It renders the user interface' }],
        'b', 'The orchestrator agent manages the workflow, deciding which specialized agent to call next and synthesizing their outputs into a coherent result.', 2),
      q('What is Whisper used for in the Voice Assistant project?',
        [{ id: 'a', text: 'Text-to-speech conversion' }, { id: 'b', text: 'Speech-to-text (converting audio to text)' }, { id: 'c', text: 'Language model inference' }, { id: 'd', text: 'Wake word detection' }],
        'b', "OpenAI's Whisper is a speech recognition model that converts spoken audio to text — the first step in any voice-driven AI pipeline.", 2),
      q('Which career path focuses on deploying and maintaining ML models at scale?',
        [{ id: 'a', text: 'AI Researcher' }, { id: 'b', text: 'Robotics Engineer' }, { id: 'c', text: 'MLOps Engineer' }, { id: 'd', text: 'Frontend Developer' }],
        'c', 'MLOps Engineers build and maintain the infrastructure for training, deploying, monitoring, and retraining ML models reliably in production.', 4),
    ],
  },
] as const;

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Expanding AI Foundations chapters (Phase 0 + beginning of Phase 1)...\n');

  const course = await prisma.course.findUnique({ where: { slug: 'foundations' } });
  if (!course) {
    console.error('❌ "foundations" course not found. Run the main seed first.');
    process.exit(1);
  }

  console.log(`✅ Found course: ${course.title} (${course.id})`);

  // Delete existing chapters for clean slate
  const deleted = await prisma.chapter.deleteMany({ where: { courseId: course.id } });
  console.log(`🗑  Deleted ${deleted.count} existing chapters\n`);

  for (const ch of CHAPTERS) {
    const { questions, ...chapterData } = ch as any;
    const chapter = await prisma.chapter.create({
      data: { ...chapterData, courseId: course.id },
    });

    await prisma.quiz.create({
      data: {
        chapterId: chapter.id,
        title: `${chapterData.title} — Quiz`,
        description: `Test your understanding of ${chapterData.title}`,
        timeLimit: 300,
        passingScore: 70,
        xpReward: 100,
        questions: { create: questions },
      },
    });

    console.log(`✅ [${chapterData.orderIndex}] ${chapterData.title}`);
  }

  console.log('\n🎉 Done! Foundations course now has', CHAPTERS.length, 'detailed chapters.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
