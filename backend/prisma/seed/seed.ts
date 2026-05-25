import { PrismaClient } from '@prisma/client';

// String literals used in place of enums (SQLite compatibility)
const Role = { STUDENT: 'STUDENT', INSTRUCTOR: 'INSTRUCTOR', ADMIN: 'ADMIN' } as const;
const Difficulty = { BEGINNER: 'BEGINNER', INTERMEDIATE: 'INTERMEDIATE', ADVANCED: 'ADVANCED', EXPERT: 'EXPERT' } as const;
import bcrypt from 'bcryptjs';

// Use a local instance for seeding (no middleware needed here)
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AIRO BOTS database...');

  // Create users
  const adminHash = await bcrypt.hash('admin123', 12);
  const studentHash = await bcrypt.hash('student123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@airobots.dev' },
    update: {},
    create: {
      email: 'admin@airobots.dev',
      username: 'admin',
      passwordHash: adminHash,
      displayName: 'AIRO Admin',
      role: Role.ADMIN,
      xp: 9999,
      level: 10,
      streak: 30,
      isEmailVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@airobots.dev' },
    update: {},
    create: {
      email: 'student@airobots.dev',
      username: 'alex_ai',
      passwordHash: studentHash,
      displayName: 'Alex Chen',
      role: Role.STUDENT,
      xp: 1250,
      level: 2,
      streak: 7,
      isEmailVerified: true,
    },
  });

  console.log('✅ Users created:', admin.email, student.email);

  // Create achievements
  const achievements = [
    { slug: 'first-step', title: 'First Step', description: 'Complete your first chapter', icon: '🚀', xpReward: 100, condition: { type: 'chapters', threshold: 1 } },
    { slug: 'quiz-master', title: 'Quiz Master', description: 'Pass 10 quizzes', icon: '🏆', xpReward: 500, condition: { type: 'quizzes', threshold: 10 } },
    { slug: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', xpReward: 300, condition: { type: 'streak', threshold: 7 } },
    { slug: 'xp-1000', title: 'Knowledge Seeker', description: 'Earn 1000 XP', icon: '⭐', xpReward: 200, condition: { type: 'xp', threshold: 1000 } },
    { slug: 'coder', title: 'Code Warrior', description: 'Save 5 playground projects', icon: '💻', xpReward: 200, condition: { type: 'saves', threshold: 5 } },
    { slug: 'ai-pioneer', title: 'AI Pioneer', description: 'Complete the ML Foundations course', icon: '🤖', xpReward: 1000, condition: { type: 'course', courseSlug: 'ml-foundations' } },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { slug: ach.slug },
      update: {},
      create: { ...ach, condition: JSON.stringify(ach.condition) },
    });
  }
  console.log('✅ Achievements created');

  // === COURSES ===
  const courses = [
    {
      slug: 'foundations',
      title: 'AI Foundations',
      description: 'Start your journey from zero. Learn programming, math, and the basics of AI.',
      icon: '🌱',
      level: 0,
      orderIndex: 0,
    },
    {
      slug: 'ml-foundations',
      title: 'Machine Learning',
      description: 'Understand supervised, unsupervised, and reinforcement learning.',
      icon: '🧠',
      level: 2,
      orderIndex: 1,
    },
    {
      slug: 'deep-learning',
      title: 'Deep Learning',
      description: 'Master neural networks, CNNs, RNNs, and Transformers.',
      icon: '⚡',
      level: 3,
      orderIndex: 2,
    },
    {
      slug: 'computer-vision',
      title: 'Computer Vision',
      description: 'Teach machines to see and interpret the visual world.',
      icon: '👁️',
      level: 4,
      orderIndex: 3,
    },
    {
      slug: 'robotics-basics',
      title: 'Robotics Basics',
      description: 'Sensors, actuators, Arduino, Raspberry Pi, and embedded systems.',
      icon: '🤖',
      level: 5,
      orderIndex: 4,
    },
    {
      slug: 'ros-slam',
      title: 'ROS & Autonomous Robotics',
      description: 'Robot Operating System, SLAM, path planning, and autonomous navigation.',
      icon: '🗺️',
      level: 6,
      orderIndex: 5,
    },
    {
      slug: 'generative-ai',
      title: 'Generative AI & LLMs',
      description: 'From GPT to diffusion models — build and deploy GenAI applications.',
      icon: '✨',
      level: 4,
      orderIndex: 6,
    },
    {
      slug: 'ai-deployment',
      title: 'AI Deployment & MLOps',
      description: 'Production AI systems, MLOps, edge AI, and AI infrastructure.',
      icon: '🚀',
      level: 8,
      orderIndex: 7,
    },
  ];

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: courseData,
    });

    // Create chapters for each course
    const chapters = getChaptersForCourse(courseData.slug);
    for (const chapterData of chapters) {
      const existing = await prisma.chapter.findUnique({
        where: { courseId_slug: { courseId: course.id, slug: chapterData.slug } },
      });
      if (!existing) {
        const chapter = await prisma.chapter.create({
          data: { ...chapterData, courseId: course.id },
        });

        // Create a quiz for each chapter
        await prisma.quiz.create({
          data: {
            chapterId: chapter.id,
            title: `${chapterData.title} Quiz`,
            description: `Test your knowledge of ${chapterData.title}`,
            timeLimit: 300,
            passingScore: 70,
            xpReward: 100,
            questions: {
              create: getQuestionsForChapter(chapterData.slug).map(q => ({
                ...q,
                options: JSON.stringify(q.options),
              })),
            },
          },
        });
      }
    }
  }

  console.log('✅ Courses and chapters created');

  // Give student some progress
  const foundations = await prisma.course.findUnique({ where: { slug: 'foundations' } });
  if (foundations) {
    const firstChapter = await prisma.chapter.findFirst({
      where: { courseId: foundations.id },
      orderBy: { orderIndex: 'asc' },
    });
    if (firstChapter) {
      await prisma.progress.upsert({
        where: { userId_chapterId: { userId: student.id, chapterId: firstChapter.id } },
        update: {},
        create: {
          userId: student.id,
          courseId: foundations.id,
          chapterId: firstChapter.id,
          completed: true,
          completedAt: new Date(),
        },
      });
    }
  }

  // Give student the first-step achievement
  const firstStepAch = await prisma.achievement.findUnique({ where: { slug: 'first-step' } });
  if (firstStepAch) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: student.id, achievementId: firstStepAch.id } },
      update: {},
      create: { userId: student.id, achievementId: firstStepAch.id },
    });
  }

  // Sample activities
  for (let i = 0; i < 15; i++) {
    const date = new Date(Date.now() - i * 2 * 86400000);
    await prisma.activity.create({
      data: {
        userId: student.id,
        type: i % 3 === 0 ? 'chapter_complete' : i % 3 === 1 ? 'quiz_attempt' : 'login',
        xpGained: i % 3 === 0 ? 50 : i % 3 === 1 ? 100 : 0,
        createdAt: date,
      },
    });
  }

  console.log('✅ Sample data created');
  console.log('\n🎉 AIRO BOTS database seeded successfully!');
  console.log('\n📧 Demo accounts:');
  console.log('   Admin: admin@airobots.dev / admin123');
  console.log('   Student: student@airobots.dev / student123');
}

function getChaptersForCourse(courseSlug: string) {
  const chaptersMap: Record<string, Array<{
    slug: string; title: string; description: string; content: string;
    codeExample: string; language: string; orderIndex: number; xpReward: number; difficulty: string;
  }>> = {
    foundations: [
      {
        slug: 'intro-to-ai',
        title: 'Introduction to Artificial Intelligence',
        description: 'What is AI? History, applications, and the future.',
        content: `# Introduction to Artificial Intelligence

## What is Artificial Intelligence?

Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include **learning** (acquiring information and rules), **reasoning** (using rules to reach approximate or definite conclusions), and **self-correction**.

## A Brief History of AI

- **1950**: Alan Turing proposes the "Turing Test"
- **1956**: The term "Artificial Intelligence" is coined at Dartmouth
- **1960s-70s**: Early AI programs like ELIZA
- **1980s**: Expert systems boom
- **1990s**: Machine learning emerges
- **2012**: Deep learning revolution begins
- **2017**: Transformers architecture introduced
- **2022-present**: Large Language Models era

## Types of AI

### Narrow AI (ANI)
Designed for a specific task. Examples: Siri, chess engines, recommendation systems.

### General AI (AGI)
Hypothetical AI with human-like reasoning across domains.

### Super AI (ASI)
Theoretical AI surpassing human intelligence in all areas.

## Real-World Applications

| Domain | Application |
|--------|-------------|
| Healthcare | Disease diagnosis, drug discovery |
| Robotics | Autonomous robots, manufacturing |
| NLP | Translation, chatbots |
| Computer Vision | Self-driving cars, facial recognition |
| Finance | Fraud detection, trading |

## The AI Stack

\`\`\`
┌─────────────────────────┐
│    Applications         │ ← What users see
├─────────────────────────┤
│    AI/ML Models         │ ← Neural networks, transformers
├─────────────────────────┤
│    Frameworks           │ ← TensorFlow, PyTorch
├─────────────────────────┤
│    Math & Statistics    │ ← Linear algebra, calculus
├─────────────────────────┤
│    Hardware             │ ← GPUs, TPUs
└─────────────────────────┘
\`\`\`

## Getting Started

AI development requires knowledge of:
1. **Programming** (Python is dominant)
2. **Mathematics** (Linear Algebra, Calculus, Statistics)
3. **Data** (Collection, cleaning, analysis)
4. **Algorithms** (Classical ML + Deep Learning)

> "AI is not about building machines that think — it's about solving real problems intelligently." — AIRO Academy`,
        codeExample: `# Your first AI-inspired Python script
import random

def simple_ai_decision(temperature: float) -> str:
    """A simple rule-based AI system"""
    if temperature < 0:
        return "🧊 Decision: Wear heavy coat"
    elif temperature < 15:
        return "🧥 Decision: Wear jacket"
    elif temperature < 25:
        return "👕 Decision: T-shirt weather"
    else:
        return "☀️ Decision: Stay hydrated!"

# Test the AI
temperatures = [-5, 10, 20, 35]
for temp in temperatures:
    print(f"Temperature: {temp}°C → {simple_ai_decision(temp)}")

# Simple learning simulation
print("\\n🧠 Learning simulation:")
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
mean = sum(data) / len(data)
print(f"Dataset: {data}")
print(f"Mean (learned pattern): {mean}")`,
        language: 'python',
        orderIndex: 0,
        xpReward: 50,
        difficulty: Difficulty.BEGINNER,
      },
      {
        slug: 'python-for-ai',
        title: 'Python for AI Development',
        description: 'Master Python fundamentals essential for AI/ML development.',
        content: `# Python for AI Development

## Why Python?

Python has become the language of AI for good reasons:
- **Readable syntax** — Focus on logic, not language
- **Vast ecosystem** — NumPy, Pandas, TensorFlow, PyTorch
- **Community** — Millions of developers and resources
- **Speed of development** — Prototype quickly

## Essential Python Concepts for AI

### Variables and Data Types

\`\`\`python
# Numeric types
integer_val = 42
float_val = 3.14
complex_val = 2 + 3j

# Sequences
my_list = [1, 2, 3, 4, 5]      # Mutable
my_tuple = (1, 2, 3)            # Immutable
my_array = [0] * 100            # Initialize array

# Dictionaries (key-value pairs - used everywhere in AI)
model_config = {
    "layers": 3,
    "learning_rate": 0.001,
    "epochs": 100,
    "batch_size": 32
}
\`\`\`

### Functions — The Building Blocks

\`\`\`python
def train_model(data, epochs=10, lr=0.01):
    """Train a simple model"""
    losses = []
    for epoch in range(epochs):
        # Simulated training step
        loss = 1.0 / (epoch + 1) * lr * 100
        losses.append(loss)
    return losses

losses = train_model(data=[], epochs=5)
print(f"Training losses: {losses}")
\`\`\`

### List Comprehensions — Pythonic Data Processing

\`\`\`python
# Traditional way
squares = []
for x in range(10):
    squares.append(x ** 2)

# Pythonic way (much faster!)
squares = [x ** 2 for x in range(10)]
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]

print("Squares:", squares)
print("Even squares:", even_squares)
\`\`\`

### NumPy — The Heart of AI Computing

\`\`\`python
import numpy as np

# Create arrays (the foundation of ML)
data = np.array([1, 2, 3, 4, 5], dtype=float)
matrix = np.array([[1, 2], [3, 4], [5, 6]])

# Mathematical operations
print("Mean:", np.mean(data))
print("Std Dev:", np.std(data))
print("Matrix shape:", matrix.shape)

# Matrix operations (critical for neural networks)
weights = np.random.randn(2, 3)
bias = np.zeros(3)
output = data[:2] @ weights + bias
print("Neural layer output:", output)
\`\`\`

## Practice Exercise

Build a data preprocessing pipeline — a critical skill in AI.`,
        codeExample: `import numpy as np

# Data preprocessing pipeline
def normalize(data):
    """Min-Max normalization"""
    min_val = np.min(data)
    max_val = np.max(data)
    return (data - min_val) / (max_val - min_val)

def standardize(data):
    """Z-score standardization"""
    mean = np.mean(data)
    std = np.std(data)
    return (data - mean) / std

# Sample dataset
raw_data = np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100], dtype=float)

print("Original data:", raw_data)
print("Normalized:", normalize(raw_data))
print("Standardized:", standardize(raw_data))

# Feature matrix simulation
features = np.random.randn(100, 5)  # 100 samples, 5 features
labels = (np.sum(features, axis=1) > 0).astype(int)

print(f"\\nDataset shape: {features.shape}")
print(f"Class distribution: {np.bincount(labels)}")`,
        language: 'python',
        orderIndex: 1,
        xpReward: 75,
        difficulty: Difficulty.BEGINNER,
      },
      {
        slug: 'math-for-ai',
        title: 'Mathematics for AI',
        description: 'Linear algebra, calculus, and statistics — the math behind AI.',
        content: `# Mathematics for AI

## Why Math Matters

Every AI algorithm is built on mathematical foundations. Understanding the math helps you:
- Debug models effectively
- Design better architectures  
- Interpret results correctly
- Innovate beyond existing approaches

## Linear Algebra

The language of data transformation.

### Vectors
A vector is an ordered list of numbers:
$$\\vec{v} = [v_1, v_2, ..., v_n]$$

### Matrices
A 2D array of numbers — the core data structure of neural networks.

### Key Operations
- **Dot product**: Measures similarity
- **Matrix multiplication**: Transforms data
- **Eigenvalues**: Capture principal directions

## Calculus — How Models Learn

### Derivatives
The derivative tells us how a function changes:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

### Gradient Descent
The core optimization algorithm:
$$w_{new} = w_{old} - \\alpha \\cdot \\nabla L(w)$$

Where:
- $\\alpha$ = learning rate
- $\\nabla L$ = gradient of loss function

## Statistics — Understanding Data

- **Mean, Variance, Std Dev** — Describe distributions
- **Probability** — Quantify uncertainty
- **Bayes' Theorem** — Update beliefs with evidence
- **Distributions** — Normal, Bernoulli, Poisson`,
        codeExample: `import numpy as np

# Linear Algebra fundamentals
print("=== LINEAR ALGEBRA ===")

# Vectors
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

print(f"Vector 1: {v1}")
print(f"Vector 2: {v2}")
print(f"Dot product: {np.dot(v1, v2)}")
print(f"Cosine similarity: {np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)):.4f}")

# Matrix operations
print("\\n=== MATRICES ===")
W = np.array([[0.5, -0.3], [0.8, 0.2], [-0.1, 0.9]])
x = np.array([1.0, 2.0])
output = W @ x
print(f"Weight matrix W:\\n{W}")
print(f"Input x: {x}")
print(f"Output W @ x: {output}")

# Gradient descent simulation
print("\\n=== GRADIENT DESCENT ===")
def loss(w):
    return (w - 3) ** 2  # Minimum at w=3

def gradient(w):
    return 2 * (w - 3)

w = 0.0
lr = 0.1
for step in range(20):
    grad = gradient(w)
    w = w - lr * grad
    if step % 5 == 0:
        print(f"Step {step}: w={w:.4f}, loss={loss(w):.4f}")

print(f"\\nConverged to w={w:.4f} (true minimum: 3.0)")`,
        language: 'python',
        orderIndex: 2,
        xpReward: 100,
        difficulty: Difficulty.BEGINNER,
      },
    ],
    'ml-foundations': [
      {
        slug: 'intro-to-ml',
        title: 'Introduction to Machine Learning',
        description: 'Types of ML, the ML pipeline, and your first model.',
        content: `# Introduction to Machine Learning

## What is Machine Learning?

Machine Learning is a subset of AI where systems **learn from data** without being explicitly programmed.

> "Machine learning is giving computers the ability to learn without being explicitly programmed." — Arthur Samuel, 1959

## Types of Machine Learning

### Supervised Learning
Learn from labeled examples.
- **Input**: (feature, label) pairs
- **Goal**: Predict labels for new inputs
- **Examples**: Email spam detection, price prediction

### Unsupervised Learning  
Find patterns in unlabeled data.
- **Input**: Features only (no labels)
- **Goal**: Discover structure
- **Examples**: Customer clustering, anomaly detection

### Reinforcement Learning
Learn through trial and reward.
- **Input**: State, Action, Reward
- **Goal**: Maximize cumulative reward
- **Examples**: Game playing, robotics control

## The ML Pipeline

\`\`\`
Data Collection → Data Cleaning → Feature Engineering 
→ Model Selection → Training → Evaluation → Deployment
\`\`\`

## Your First ML Model: Linear Regression

Predict continuous values using a line:
$$y = wx + b$$`,
        codeExample: `import numpy as np

class LinearRegression:
    """Linear Regression from scratch"""
    
    def __init__(self, learning_rate=0.01, epochs=1000):
        self.lr = learning_rate
        self.epochs = epochs
        self.weights = None
        self.bias = None
    
    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        for epoch in range(self.epochs):
            y_pred = np.dot(X, self.weights) + self.bias
            
            # Gradients
            dw = (1/n_samples) * np.dot(X.T, (y_pred - y))
            db = (1/n_samples) * np.sum(y_pred - y)
            
            # Update
            self.weights -= self.lr * dw
            self.bias -= self.lr * db
            
            if epoch % 200 == 0:
                loss = np.mean((y_pred - y) ** 2)
                print(f"Epoch {epoch}: Loss = {loss:.4f}")
    
    def predict(self, X):
        return np.dot(X, self.weights) + self.bias

# Generate sample data: house prices
np.random.seed(42)
X = np.random.randn(100, 1) * 1000 + 2000  # Square footage
y = 200 * X[:, 0] + 50000 + np.random.randn(100) * 10000

X_norm = (X - X.mean()) / X.std()
y_norm = (y - y.mean()) / y.std()

model = LinearRegression(learning_rate=0.1, epochs=1000)
model.fit(X_norm, y_norm)

print(f"\\nLearned weight: {model.weights[0]:.4f}")
print(f"Learned bias: {model.bias:.4f}")`,
        language: 'python',
        orderIndex: 0,
        xpReward: 100,
        difficulty: Difficulty.INTERMEDIATE,
      },
    ],
    'deep-learning': [
      {
        slug: 'neural-networks',
        title: 'Neural Networks from Scratch',
        description: 'Build a neural network from scratch and understand every piece.',
        content: `# Neural Networks from Scratch

## Biological Inspiration

Artificial neural networks are loosely inspired by the brain. The **neuron** is the basic computational unit.

## Architecture

A neural network consists of:
- **Input Layer**: Receives raw features
- **Hidden Layers**: Learn representations
- **Output Layer**: Produces predictions

## Forward Propagation

$$z^{[l]} = W^{[l]} \\cdot a^{[l-1]} + b^{[l]}$$
$$a^{[l]} = g(z^{[l]})$$

## Activation Functions

| Function | Formula | Use Case |
|----------|---------|----------|
| ReLU | max(0, x) | Hidden layers |
| Sigmoid | 1/(1+e^-x) | Binary output |
| Softmax | e^x/Σe^x | Multi-class |
| Tanh | (e^x-e^-x)/(e^x+e^-x) | Hidden layers |

## Backpropagation

The algorithm that makes learning possible by computing gradients efficiently using the chain rule.`,
        codeExample: `import numpy as np

class NeuralNetwork:
    """2-layer neural network from scratch"""
    
    def __init__(self, input_size, hidden_size, output_size, lr=0.01):
        # Xavier initialization
        self.W1 = np.random.randn(input_size, hidden_size) * np.sqrt(2.0/input_size)
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * np.sqrt(2.0/hidden_size)
        self.b2 = np.zeros((1, output_size))
        self.lr = lr
    
    def relu(self, z): return np.maximum(0, z)
    def relu_deriv(self, z): return (z > 0).astype(float)
    def sigmoid(self, z): return 1 / (1 + np.exp(-np.clip(z, -500, 500)))
    
    def forward(self, X):
        self.z1 = X @ self.W1 + self.b1
        self.a1 = self.relu(self.z1)
        self.z2 = self.a1 @ self.W2 + self.b2
        self.a2 = self.sigmoid(self.z2)
        return self.a2
    
    def backward(self, X, y):
        m = X.shape[0]
        dz2 = self.a2 - y.reshape(-1, 1)
        dW2 = self.a1.T @ dz2 / m
        db2 = np.sum(dz2, axis=0, keepdims=True) / m
        da1 = dz2 @ self.W2.T
        dz1 = da1 * self.relu_deriv(self.z1)
        dW1 = X.T @ dz1 / m
        db1 = np.sum(dz1, axis=0, keepdims=True) / m
        
        self.W1 -= self.lr * dW1
        self.b1 -= self.lr * db1
        self.W2 -= self.lr * dW2
        self.b2 -= self.lr * db2
    
    def train(self, X, y, epochs=1000):
        for epoch in range(epochs):
            output = self.forward(X)
            self.backward(X, y)
            if epoch % 200 == 0:
                loss = -np.mean(y * np.log(output + 1e-8) + (1-y) * np.log(1-output + 1e-8))
                acc = np.mean((output.flatten() > 0.5) == y)
                print(f"Epoch {epoch}: Loss={loss:.4f}, Accuracy={acc:.4f}")

# XOR problem
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([0, 1, 1, 0], dtype=float)

nn = NeuralNetwork(input_size=2, hidden_size=4, output_size=1, lr=0.5)
nn.train(X, y, epochs=1000)
preds = nn.forward(X).flatten()
print("\\nXOR predictions:", np.round(preds, 2))`,
        language: 'python',
        orderIndex: 0,
        xpReward: 150,
        difficulty: Difficulty.ADVANCED,
      },
    ],
    'robotics-basics': [
      {
        slug: 'intro-robotics',
        title: 'Introduction to Robotics',
        description: 'What makes a robot? Components, types, and the robotics ecosystem.',
        content: `# Introduction to Robotics

## What is a Robot?

A robot is a machine that can **sense**, **think**, and **act**.

\`\`\`
Sense → Think → Act
(Sensors) → (Processor/AI) → (Actuators)
\`\`\`

## Core Components

### Sensors (Input)
- **Lidar**: 360° laser scanning
- **Camera**: Visual perception
- **IMU**: Motion/orientation
- **Ultrasonic**: Distance measurement
- **Encoders**: Motor position feedback

### Actuators (Output)
- **DC Motors**: Wheels, conveyors
- **Servo Motors**: Precise positioning
- **Stepper Motors**: Accurate steps
- **Pneumatics**: Industrial arms
- **Hydraulics**: Heavy machinery

### Processors
- **Microcontrollers**: Arduino (simple tasks)
- **Single-board computers**: Raspberry Pi (complex tasks)
- **FPGA**: Real-time processing
- **GPUs**: AI computation

## Types of Robots

| Type | Example | Application |
|------|---------|-------------|
| Industrial | Robot arm | Manufacturing |
| Mobile | Wheeled robot | Delivery |
| Humanoid | Atlas | Research |
| Aerial | Drone | Surveillance |
| Underwater | AUV | Exploration |
| Medical | Surgical robot | Surgery |`,
        codeExample: `# Robotics simulation in Python
import math

class Robot:
    """Simple 2D robot simulation"""
    
    def __init__(self, x=0, y=0, heading=0):
        self.x = x          # Position X
        self.y = y          # Position Y
        self.heading = heading  # Degrees (0 = North)
        self.path = [(x, y)]
    
    def move_forward(self, distance):
        """Move robot forward"""
        rad = math.radians(self.heading)
        self.x += distance * math.sin(rad)
        self.y += distance * math.cos(rad)
        self.path.append((round(self.x, 2), round(self.y, 2)))
        print(f"Moved forward {distance}m → Position: ({self.x:.2f}, {self.y:.2f})")
    
    def turn(self, degrees):
        """Turn robot"""
        self.heading = (self.heading + degrees) % 360
        print(f"Turned {degrees}° → Heading: {self.heading}°")
    
    def get_distance(self, target_x, target_y):
        """Ultrasonic-like distance to target"""
        return math.sqrt((target_x - self.x)**2 + (target_y - self.y)**2)
    
    def status(self):
        print(f"Robot: pos=({self.x:.2f}, {self.y:.2f}), heading={self.heading}°")

# Simulate a square path
robot = Robot()
print("=== Robot Navigation Simulation ===")
robot.status()

for side in range(4):
    print(f"\\n--- Side {side+1} ---")
    robot.move_forward(5)
    robot.turn(90)

print(f"\\nPath traced: {robot.path}")
target = (10, 10)
dist = robot.get_distance(*target)
print(f"Distance to target {target}: {dist:.2f}m")`,
        language: 'python',
        orderIndex: 0,
        xpReward: 100,
        difficulty: Difficulty.INTERMEDIATE,
      },
    ],
  };

  return chaptersMap[courseSlug] || [
    {
      slug: 'introduction',
      title: 'Introduction',
      description: 'Getting started with this topic.',
      content: `# Introduction\n\nWelcome to this course. You'll learn the fundamentals and build up to advanced topics.\n\n## Overview\n\nThis chapter covers the essential concepts you need to get started.\n\n## Key Concepts\n\n- Concept 1: Foundation knowledge\n- Concept 2: Core principles\n- Concept 3: Practical applications\n\n## Learning Objectives\n\nBy the end of this chapter, you will:\n1. Understand the basic principles\n2. Be able to write your first programs\n3. Apply concepts to real-world problems`,
      codeExample: `# Hello, AIRO BOTS!\nprint("Welcome to the AI & Robotics Academy")\nprint("Let's start learning!")\n\n# Simple example\nfor i in range(1, 6):\n    print(f"Step {i}: Learning in progress...")`,
      language: 'python',
      orderIndex: 0,
      xpReward: 50,
      difficulty: Difficulty.BEGINNER,
    },
  ];
}

function getQuestionsForChapter(chapterSlug: string) {
  const defaultQuestions = [
    {
      text: 'What is the primary purpose of the topic covered in this chapter?',
      options: [
        { id: 'a', text: 'To entertain users' },
        { id: 'b', text: 'To solve real-world problems intelligently' },
        { id: 'c', text: 'To replace all human workers' },
        { id: 'd', text: 'None of the above' },
      ],
      correctAnswer: 'b',
      explanation: 'AI and robotics exist to solve real-world problems intelligently.',
      orderIndex: 0,
    },
    {
      text: 'Which programming language is most commonly used in AI development?',
      options: [
        { id: 'a', text: 'Java' },
        { id: 'b', text: 'PHP' },
        { id: 'c', text: 'Python' },
        { id: 'd', text: 'COBOL' },
      ],
      correctAnswer: 'c',
      explanation: 'Python is the dominant language in AI/ML development due to its ecosystem.',
      orderIndex: 1,
    },
    {
      text: 'What does "training" a model mean in machine learning?',
      options: [
        { id: 'a', text: 'Downloading the model from the internet' },
        { id: 'b', text: 'Adjusting model parameters based on data to minimize error' },
        { id: 'c', text: 'Cleaning the training data' },
        { id: 'd', text: 'Writing documentation' },
      ],
      correctAnswer: 'b',
      explanation: 'Training means iteratively adjusting model parameters to fit the training data.',
      orderIndex: 2,
    },
    {
      text: 'What is overfitting in machine learning?',
      options: [
        { id: 'a', text: 'When a model performs well on training data but poorly on new data' },
        { id: 'b', text: 'When a model is too simple to learn from data' },
        { id: 'c', text: 'When the training dataset is too large' },
        { id: 'd', text: 'When learning rate is too small' },
      ],
      correctAnswer: 'a',
      explanation: 'Overfitting occurs when a model memorizes training data and fails to generalize.',
      orderIndex: 3,
    },
    {
      text: 'What is gradient descent used for?',
      options: [
        { id: 'a', text: 'Data visualization' },
        { id: 'b', text: 'Network communication' },
        { id: 'c', text: 'Optimizing model parameters to minimize loss' },
        { id: 'd', text: 'Database queries' },
      ],
      correctAnswer: 'c',
      explanation: 'Gradient descent minimizes the loss function by following the negative gradient.',
      orderIndex: 4,
    },
  ];

  // Return different questions based on chapter
  if (chapterSlug === 'intro-to-ai') {
    return [
      {
        text: 'Who coined the term "Artificial Intelligence"?',
        options: [
          { id: 'a', text: 'Alan Turing' },
          { id: 'b', text: 'John McCarthy' },
          { id: 'c', text: 'Marvin Minsky' },
          { id: 'd', text: 'Claude Shannon' },
        ],
        correctAnswer: 'b',
        explanation: 'John McCarthy coined "Artificial Intelligence" at the 1956 Dartmouth conference.',
        orderIndex: 0,
      },
      ...defaultQuestions.slice(1),
    ];
  }

  return defaultQuestions;
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
