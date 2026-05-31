/**
 * aiFoundationsNoobBlock2.ts
 * AI Foundations — NOOB Tier — Block 2 (Chapters 6–10)
 *
 * Ch 6  — Classes & Object-Oriented Programming
 * Ch 7  — Python Standard Library & Modules
 * Ch 8  — NumPy — Arrays & Indexing
 * Ch 9  — NumPy — Operations & Broadcasting
 * Ch 10 — NumPy — Linear Algebra Essentials
 *
 * Run: cd backend && npm run seed:af-noob-b2
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function q(
  text: string,
  options: { id: string; text: string }[],
  correctAnswer: string,
  explanation: string,
  orderIndex: number,
) {
  return { text, options: JSON.stringify(options), correctAnswer, explanation, orderIndex };
}

const COURSE_SLUG = 'foundations';

const CHAPTERS = [

  // ══════════════════════════════════════════════
  // CHAPTER 6 — Classes & OOP
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-6-oop',
    title: 'Classes & Object-Oriented Programming',
    description: 'Define classes with __init__, methods, inheritance, and encapsulation — the pattern used by every modern AI framework.',
    orderIndex: 6,
    xpReward: 65,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 6 — Classes & Object-Oriented Programming

## 🎯 Learning Goals
Build classes that model real AI objects, use inheritance to extend behavior, and understand why PyTorch/TensorFlow are built on OOP.

---

## 1. Defining a Class

\`\`\`python
class NeuralLayer:
    def __init__(self, in_features, out_features):
        self.in_features  = in_features
        self.out_features = out_features
        self.weights = [[0.0]*out_features for _ in range(in_features)]

    def forward(self, x):
        return [sum(x[i] * self.weights[i][j]
                    for i in range(self.in_features))
                for j in range(self.out_features)]
\`\`\`

---

## 2. __init__ — The Constructor

Called automatically when you create an instance. It initialises instance attributes.

---

## 3. Inheritance

\`\`\`python
class Animal:
    def speak(self): return "..."

class Dog(Animal):
    def speak(self): return "Woof!"   # override

d = Dog()
print(d.speak())  # Woof!
\`\`\`

PyTorch's \`nn.Module\` uses inheritance — you inherit from it and override \`forward()\`.

---

## 4. Encapsulation

\`\`\`python
class Model:
    def __init__(self):
        self._weights = []      # protected
        self.__lr = 0.001       # private (name-mangled)

    @property
    def lr(self): return self.__lr
\`\`\`

---

## 5. Special Methods (Dunder)

\`\`\`python
class Vector:
    def __init__(self, x, y): self.x, self.y = x, y
    def __repr__(self):  return f"Vector({self.x}, {self.y})"
    def __add__(self, o): return Vector(self.x+o.x, self.y+o.y)
    def __len__(self):   return 2
\`\`\``,
    codeExample: `# ── Chapter 6: OOP ──────────────────────────────────────────────
import math

# 1. A Model class — blueprint for any ML model
class Model:
    def __init__(self, name, lr=0.01):
        self.name    = name
        self.lr      = lr
        self.history = {"loss": [], "acc": []}

    def train_step(self, loss, acc):
        self.history["loss"].append(round(loss, 4))
        self.history["acc"].append(round(acc, 4))

    def summary(self):
        losses = self.history["loss"]
        print(f"Model : {self.name}  lr={self.lr}")
        print(f"Epochs: {len(losses)}")
        if losses:
            print(f"Best loss: {min(losses):.4f}")
            print(f"Last acc : {self.history['acc'][-1]:.4f}")

# 2. Inheritance — LinearModel extends Model
class LinearModel(Model):
    def __init__(self, in_dim, lr=0.01):
        super().__init__("LinearModel", lr)
        self.weights = [0.0] * in_dim
        self.bias    = 0.0

    def predict(self, x):
        return sum(w * xi for w, xi in zip(self.weights, x)) + self.bias

# 3. Usage
model = LinearModel(in_dim=3, lr=0.001)
print("=== Simulated Training ===")
for epoch in range(1, 6):
    fake_loss = 1.0 / epoch
    fake_acc  = 1 - 1 / (epoch + 1)
    model.train_step(fake_loss, fake_acc)
    print(f"  Epoch {epoch}: loss={fake_loss:.4f} acc={fake_acc:.4f}")

print()
model.summary()

# 4. Dunder methods — Vector class (think: tensor operations)
class Vector:
    def __init__(self, *vals): self.vals = list(vals)
    def __repr__(self):  return f"Vec{tuple(self.vals)}"
    def __len__(self):   return len(self.vals)
    def __add__(self, o): return Vector(*[a+b for a,b in zip(self.vals, o.vals)])
    def dot(self, o):    return sum(a*b for a,b in zip(self.vals, o.vals))
    def norm(self):      return math.sqrt(sum(v**2 for v in self.vals))

v1 = Vector(1, 2, 3)
v2 = Vector(4, 5, 6)
print(f"\\nv1={v1}  v2={v2}")
print(f"v1+v2  = {v1+v2}")
print(f"dot    = {v1.dot(v2)}")
print(f"|v1|   = {v1.norm():.4f}")`,
    questions: [
      q('What is the purpose of __init__ in a Python class?',
        [{id:'a',text:'It destroys the object'},{id:'b',text:'It initialises instance attributes when the object is created'},{id:'c',text:'It is called when the class is imported'},{id:'d',text:'It compiles the class'}],
        'b','__init__ is the constructor — it runs automatically when you create an instance with ClassName().',0),
      q('What keyword is used to inherit from a parent class?',
        [{id:'a',text:'extends'},{id:'b',text:'implements'},{id:'c',text:'The parent class name in parentheses'},{id:'d',text:'inherit'}],
        'c','Python inheritance uses class Child(Parent): — no special keyword, just parentheses.',1),
      q('What does super().__init__() do inside a child class?',
        [{id:'a',text:'Creates a new parent object'},{id:'b',text:'Calls the parent\'s __init__ to initialize inherited attributes'},{id:'c',text:'Deletes the parent class'},{id:'d',text:'Overrides all parent methods'}],
        'b','super().__init__() calls the parent constructor so inherited attributes are properly set up.',2),
      q('In PyTorch, why do you inherit from nn.Module?',
        [{id:'a',text:'To access the GPU'},{id:'b',text:'To get automatic parameter tracking, gradient computation, and standard training APIs'},{id:'c',text:'To read data from files'},{id:'d',text:'To speed up Python'}],
        'b','nn.Module provides parameter management, gradient tracking, and .to(device) — core to PyTorch.',3),
      q('What is encapsulation in OOP?',
        [{id:'a',text:'Inheriting from multiple classes'},{id:'b',text:'Bundling data and methods, controlling access with public/private/protected'},{id:'c',text:'Making a class abstract'},{id:'d',text:'Calling the parent constructor'}],
        'b','Encapsulation hides internal state and exposes controlled interfaces via methods and properties.',4),
      q('What does the __repr__ method define?',
        [{id:'a',text:'How to add two objects'},{id:'b',text:'The string representation shown when printing or inspecting an object'},{id:'c',text:'The length of an object'},{id:'d',text:'How to compare objects'}],
        'b','__repr__ returns a developer-friendly string representation of the object.',5),
      q('What does "self" refer to inside a method?',
        [{id:'a',text:'The class itself'},{id:'b',text:'The current instance of the class'},{id:'c',text:'The parent class'},{id:'d',text:'A global variable'}],
        'b','self is a reference to the specific instance on which the method was called.',6),
      q('Which naming convention signals a "private" attribute in Python?',
        [{id:'a',text:'#attribute'},{id:'b',text:'_attribute (single underscore — convention only)'},{id:'c',text:'__attribute (double underscore — name mangled)'},{id:'d',text:'Both B and C'}],
        'd','Single underscore is a convention for "protected"; double underscore triggers name mangling (truly private).',7),
      q('What is polymorphism in OOP?',
        [{id:'a',text:'Multiple inheritance from the same class'},{id:'b',text:'The ability of different classes to define the same method name with different behaviours'},{id:'c',text:'Defining multiple __init__ methods'},{id:'d',text:'Converting between data types'}],
        'b','Polymorphism lets you call .forward() on different model classes and each does its own thing.',8),
      q('Why is OOP fundamental to AI frameworks like PyTorch and TensorFlow?',
        [{id:'a',text:'OOP is required for GPU access'},{id:'b',text:'Models, layers, optimizers, and datasets are all objects — OOP makes them composable'},{id:'c',text:'Python only supports OOP'},{id:'d',text:'OOP runs faster than functions'}],
        'b','Every component (Layer, Loss, Optimizer, Dataset) is a class — inheritance and composition build the whole framework.',9),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 7 — Python Standard Library & Modules
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-7-stdlib',
    title: 'Python Standard Library & Modules',
    description: 'math, random, os, sys, time, collections, itertools — the built-in toolkit that makes AI experimentation scripts faster and cleaner.',
    orderIndex: 7,
    xpReward: 60,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 7 — Python Standard Library & Modules

## 🎯 Learning Goals
Use Python's built-in battery of modules so you don't reinvent the wheel in AI projects.

---

## 1. math

\`\`\`python
import math
math.sqrt(16)       # 4.0
math.log(math.e)    # 1.0
math.exp(1)         # 2.718...
math.pi             # 3.14159...
\`\`\`

Used everywhere: activation functions, loss computations, geometric transforms.

---

## 2. random

\`\`\`python
import random
random.seed(42)              # reproducibility
random.random()              # uniform [0, 1)
random.randint(0, 9)         # integer in range
random.shuffle(my_list)      # in-place shuffle
random.sample(population, k) # sample without replace
\`\`\`

---

## 3. os & sys

\`\`\`python
import os, sys
os.getcwd()                  # current directory
os.path.join("data", "train.csv")
os.makedirs("outputs", exist_ok=True)
sys.argv                     # command-line arguments
\`\`\`

---

## 4. time

\`\`\`python
import time
start = time.time()
# ... do work ...
elapsed = time.time() - start
print(f"Took {elapsed:.2f}s")
\`\`\`

---

## 5. collections & itertools

\`\`\`python
from collections import Counter, defaultdict, deque
Counter("banana")  # {'a':3, 'n':2, 'b':1}
defaultdict(list)  # auto-creates missing keys

from itertools import chain, product, combinations
list(product([0,1],[0,1]))  # cartesian product
\`\`\``,
    codeExample: `# ── Chapter 7: Standard Library ─────────────────────────────────
import math, random, os, sys, time
from collections import Counter, defaultdict, deque

# 1. math — activation & loss functions
print("=== math module ===")
def sigmoid(x): return 1 / (1 + math.exp(-x))
def log_loss(y, p): return -(y*math.log(p+1e-9) + (1-y)*math.log(1-p+1e-9))

for z in [-2, 0, 2]:
    p = sigmoid(z)
    print(f"  z={z:+d}  sigmoid={p:.4f}  log_loss(1,p)={log_loss(1,p):.4f}")

# 2. random — reproducible experiments
random.seed(42)
dataset = list(range(100))
random.shuffle(dataset)
train, test = dataset[:80], dataset[80:]
print(f"\\nTrain size={len(train)}  Test size={len(test)}")
print(f"First 5 train indices: {train[:5]}")

# 3. os — file paths
data_dir = os.path.join("data", "raw")
print(f"\\nData path : {data_dir}")
print(f"CWD       : {os.getcwd()}")

# 4. time — benchmarking training steps
start = time.perf_counter()
acc = 0.0
for _ in range(1_000_000):
    acc += math.sqrt(random.random())
elapsed = time.perf_counter() - start
print(f"\\n1M sqrt ops in {elapsed:.3f}s  (avg={acc/1e6:.4f})")

# 5. collections — word frequency (NLP basics)
text = "the cat sat on the mat the cat ate the rat"
word_freq = Counter(text.split())
print(f"\\nWord frequencies: {word_freq.most_common(4)}")

# defaultdict — build an inverted index
inv_idx = defaultdict(list)
corpus = ["cat and dog", "dog and fish", "cat and fish"]
for doc_id, doc in enumerate(corpus):
    for word in doc.split():
        inv_idx[word].append(doc_id)
print(f"'cat' in docs: {inv_idx['cat']}")
print(f"'dog' in docs: {inv_idx['dog']}")`,
    questions: [
      q('What does random.seed(42) do?',
        [{id:'a',text:'Generates a random number'},{id:'b',text:'Sets the RNG state so results are reproducible'},{id:'c',text:'Shuffles a list'},{id:'d',text:'Resets the random module'}],
        'b','Seeding fixes the random number generator so experiments produce the same results each run.',0),
      q('Which function measures elapsed time for benchmarking code?',
        [{id:'a',text:'time.now()'},{id:'b',text:'time.clock()'},{id:'c',text:'time.perf_counter()'},{id:'d',text:'time.elapsed()'}],
        'c','time.perf_counter() returns a high-resolution timer value; difference before/after gives elapsed time.',1),
      q('What does Counter(["a","b","a","c","a"]) return?',
        [{id:'a',text:'A list'},{id:'b',text:'A dict-like object: {"a":3, "b":1, "c":1}'},{id:'c',text:'A set of unique elements'},{id:'d',text:'An error'}],
        'b','Counter counts occurrences of each element, returning a dict-like Counter object.',2),
      q('How do you construct a platform-independent file path?',
        [{id:'a',text:'path = "data/train.csv"'},{id:'b',text:'path = "data\\\\train.csv"'},{id:'c',text:'path = os.path.join("data", "train.csv")'},{id:'d',text:'path = sys.path("data", "train.csv")'}],
        'c','os.path.join handles / vs \\ automatically across Windows, Mac, and Linux.',3),
      q('What is the purpose of math.log() in ML?',
        [{id:'a',text:'Converting floats to integers'},{id:'b',text:'Computing cross-entropy loss and information gain'},{id:'c',text:'Rounding numbers'},{id:'d',text:'Building file paths'}],
        'b','Cross-entropy loss uses log to penalise confident wrong predictions: -log(p).',4),
      q('What does defaultdict(list) do?',
        [{id:'a',text:'Creates a dict that only accepts list keys'},{id:'b',text:'Creates a dict that auto-creates an empty list for missing keys instead of raising KeyError'},{id:'c',text:'Converts a list to a dict'},{id:'d',text:'Creates an immutable dictionary'}],
        'b','defaultdict auto-initialises missing keys with the default factory — list gives [] for new keys.',5),
      q('Why is reproducibility (random.seed) critical in ML research?',
        [{id:'a',text:'It makes training faster'},{id:'b',text:'It ensures experiments can be reproduced exactly, allowing fair comparison of algorithms'},{id:'c',text:'It prevents overfitting'},{id:'d',text:'It is required by Python'}],
        'b','Without a fixed seed, results vary each run — reproducibility is essential for scientific validity.',6),
      q('What does os.makedirs("dir", exist_ok=True) do?',
        [{id:'a',text:'Deletes the directory'},{id:'b',text:'Creates the directory (and parents), ignoring the error if it already exists'},{id:'c',text:'Lists files in the directory'},{id:'d',text:'Renames the directory'}],
        'b','exist_ok=True prevents the error that would normally occur if the directory already exists.',7),
      q('Which module provides combinations and cartesian products?',
        [{id:'a',text:'math'},{id:'b',text:'random'},{id:'c',text:'itertools'},{id:'d',text:'os'}],
        'c','itertools provides combinations, permutations, product, chain, and other iteration tools.',8),
      q('What is sys.argv used for?',
        [{id:'a',text:'Measuring time'},{id:'b',text:'Accessing command-line arguments passed to a Python script'},{id:'c',text:'Reading environment variables'},{id:'d',text:'Listing installed packages'}],
        'b','sys.argv is a list where argv[0] is the script name and argv[1:] are the passed arguments.',9),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 8 — NumPy — Arrays & Indexing
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-8-numpy-arrays',
    title: 'NumPy — Arrays & Indexing',
    description: 'Creating ndarrays, dtypes, shapes, reshaping, slicing, fancy indexing — the data container for every tensor operation in AI.',
    orderIndex: 8,
    xpReward: 70,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 8 — NumPy — Arrays & Indexing

## 🎯 Learning Goals
Create and manipulate NumPy arrays with confidence — every ML framework (PyTorch, TensorFlow, scikit-learn) is built on top of the ndarray.

---

## 1. Creating Arrays

\`\`\`python
import numpy as np

a = np.array([1, 2, 3])              # 1-D
b = np.array([[1,2],[3,4],[5,6]])     # 2-D (3×2)
c = np.zeros((3, 4))                 # all zeros
d = np.ones((2, 3))                  # all ones
e = np.eye(3)                        # identity matrix
f = np.arange(0, 10, 2)             # [0,2,4,6,8]
g = np.linspace(0, 1, 5)            # 5 evenly spaced
h = np.random.randn(3, 3)           # normal distribution
\`\`\`

---

## 2. Shape, Dtype, Ndim

\`\`\`python
b.shape     # (3, 2)
b.dtype     # int64
b.ndim      # 2
b.size      # 6  (total elements)
\`\`\`

---

## 3. Indexing & Slicing

\`\`\`python
a[0]        # 1  (first element)
b[1, 0]     # 3  (row 1, col 0)
b[:, 0]     # column 0: [1, 3, 5]
b[0:2, :]   # rows 0 and 1
\`\`\`

---

## 4. Boolean Indexing

\`\`\`python
data = np.array([3, -1, 5, -2, 8])
positive = data[data > 0]           # [3, 5, 8]
data[data < 0] = 0                  # ReLU in one line!
\`\`\`

---

## 5. Reshape & Flatten

\`\`\`python
x = np.arange(12)
x.reshape(3, 4)    # 1-D → 2-D
x.reshape(2, 2, 3) # 1-D → 3-D
x.flatten()        # any-D → 1-D
\`\`\``,
    codeExample: `# ── Chapter 8: NumPy Arrays & Indexing ──────────────────────────
import numpy as np

np.random.seed(0)

# 1. Creating arrays
print("=== Creating Arrays ===")
a = np.arange(1, 7)           # [1,2,3,4,5,6]
b = a.reshape(2, 3)           # 2×3 matrix
c = np.zeros((3, 3))
d = np.eye(3)
print(f"1-D : {a}")
print(f"2-D :\\n{b}")
print(f"zeros:\\n{c}")
print(f"identity:\\n{d}")

# 2. Shape inspection
print("\\n=== Shape & Dtype ===")
img = np.random.randint(0, 256, (28, 28, 1), dtype=np.uint8)
print(f"Image shape : {img.shape}")
print(f"Image dtype : {img.dtype}")
print(f"Image ndim  : {img.ndim}")
print(f"Total pixels: {img.size}")

# 3. Slicing
print("\\n=== Indexing & Slicing ===")
data = np.arange(20).reshape(4, 5)
print(f"Full matrix:\\n{data}")
print(f"Row 0       : {data[0]}")
print(f"Col 2       : {data[:, 2]}")
print(f"Sub-matrix  :\\n{data[1:3, 1:4]}")

# 4. Boolean indexing — ReLU activation
print("\\n=== Boolean Indexing (ReLU) ===")
z = np.random.randn(8)
print(f"Pre-relu : {np.round(z, 3)}")
relu_out = np.maximum(0, z)       # ReLU in one op!
print(f"Post-relu: {np.round(relu_out, 3)}")
print(f"Sparsity : {(relu_out == 0).sum()} zeros out of {len(relu_out)}")

# 5. Reshape — flatten a batch of images
batch = np.random.randn(32, 28, 28)    # 32 greyscale images
flat  = batch.reshape(32, -1)          # -1 auto-infers
print(f"\\nBatch shape     : {batch.shape}")
print(f"Flattened shape : {flat.shape}")`,
    questions: [
      q('What does np.zeros((3, 4)) create?',
        [{id:'a',text:'A list of 12 zeros'},{id:'b',text:'A 3×4 NumPy array filled with zeros'},{id:'c',text:'A tuple of shape (3,4)'},{id:'d',text:'An error because zeros is not a function'}],
        'b','np.zeros((rows, cols)) creates a float64 ndarray of all zeros with the given shape.',0),
      q('What does array.shape return?',
        [{id:'a',text:'The total number of elements'},{id:'b',text:'A tuple representing the size of each dimension'},{id:'c',text:'The data type of the array'},{id:'d',text:'The number of dimensions'}],
        'b','.shape returns a tuple like (3,4) for a 3-row 4-column 2-D array.',1),
      q('How do you select the entire third column of a 2-D array "a"?',
        [{id:'a',text:'a[3]'},{id:'b',text:'a[:, 2]'},{id:'c',text:'a[2, :]'},{id:'d',text:'a[3, :]'}],
        'b','a[:, 2] selects all rows (:) and column index 2 (third column).',2),
      q('What is the shape of np.random.randn(32, 28, 28)?',
        [{id:'a',text:'(32,)'},{id:'b',text:'(32, 784)'},{id:'c',text:'(32, 28, 28)'},{id:'d',text:'(28, 28)'}],
        'c','randn(32,28,28) creates a 3-D array with axes of size 32, 28, 28.',3),
      q('What does boolean indexing data[data > 0] return?',
        [{id:'a',text:'The index positions where data > 0'},{id:'b',text:'A new array with only the elements that satisfy the condition'},{id:'c',text:'True or False'},{id:'d',text:'The count of elements greater than 0'}],
        'b','Boolean indexing filters the array, returning only elements where the condition is True.',4),
      q('What does reshape(batch, (32, -1)) do when batch.shape is (32, 28, 28)?',
        [{id:'a',text:'Fails with an error'},{id:'b',text:'Flattens the last two dims to 784, giving shape (32, 784)'},{id:'c',text:'Adds a new dimension'},{id:'d',text:'Transposes the array'}],
        'b','-1 tells NumPy to infer the size: 28×28=784, so the result is (32, 784).',5),
      q('What is np.eye(3)?',
        [{id:'a',text:'A 3×3 array of ones'},{id:'b',text:'A 3×3 identity matrix (1s on diagonal, 0s elsewhere)'},{id:'c',text:'An array of 3 random values'},{id:'d',text:'A 1-D array [1,2,3]'}],
        'b','np.eye(n) creates an n×n identity matrix — fundamental in linear algebra.',6),
      q('What is the ndim of a shape (32, 28, 28) array?',
        [{id:'a',text:'1'},{id:'b',text:'2'},{id:'c',text:'3'},{id:'d',text:'32'}],
        'c','ndim counts the number of axes — (32, 28, 28) has 3 dimensions.',7),
      q('Which NumPy function creates evenly spaced values between start and stop?',
        [{id:'a',text:'np.arange'},{id:'b',text:'np.linspace'},{id:'c',text:'np.range'},{id:'d',text:'np.space'}],
        'b','np.linspace(0, 1, 5) creates [0.0, 0.25, 0.5, 0.75, 1.0] — n points inclusive.',8),
      q('Why are NumPy arrays preferred over Python lists in ML?',
        [{id:'a',text:'They use less RAM'},{id:'b',text:'They support element-wise math without loops, and are backed by optimised C code'},{id:'c',text:'They are mutable unlike lists'},{id:'d',text:'They support negative indexing'}],
        'b','NumPy arrays vectorise operations — no Python loops — giving 10-100x speed gains on math.',9),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 9 — NumPy Operations & Broadcasting
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-9-numpy-ops',
    title: 'NumPy — Operations & Broadcasting',
    description: 'Element-wise math, aggregations, universal functions, and broadcasting — the vectorised computation model that powers every neural network layer.',
    orderIndex: 9,
    xpReward: 75,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 9 — NumPy Operations & Broadcasting

## 🎯 Learning Goals
Apply vectorised operations to entire arrays without Python loops, and master broadcasting rules.

---

## 1. Element-wise Operations

\`\`\`python
import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

a + b          # [5, 7, 9]
a * b          # [4, 10, 18]
a ** 2         # [1, 4, 9]
np.sqrt(a)     # [1.0, 1.414, 1.732]
np.exp(a)      # [2.718, 7.389, 20.09]
\`\`\`

These replace Python for-loops and run in optimised C.

---

## 2. Aggregations

\`\`\`python
data = np.array([[1,2,3],[4,5,6]])
np.sum(data)           # 21  (all elements)
np.sum(data, axis=0)   # [5, 7, 9]  (per column)
np.sum(data, axis=1)   # [6, 15]    (per row)
np.mean(data)          # 3.5
np.std(data)           # std deviation
np.argmax(data, axis=1) # index of max per row
\`\`\`

---

## 3. Universal Functions (ufuncs)

\`\`\`python
np.abs, np.sin, np.cos, np.log, np.exp
np.maximum(a, b)    # element-wise max (ReLU!)
np.clip(a, 0, 1)    # clamp to [0, 1]
\`\`\`

---

## 4. Broadcasting

Broadcasting lets NumPy operate on arrays of different shapes by expanding dimensions automatically.

\`\`\`python
X = np.ones((3, 4))   # 3×4
b = np.array([1,2,3,4]) # shape (4,)

X + b   # adds b to EVERY row of X → shape (3, 4)
\`\`\`

**Rule**: shapes are compatible if each dimension is equal OR one of them is 1.`,
    codeExample: `# ── Chapter 9: NumPy Operations & Broadcasting ──────────────────
import numpy as np

np.random.seed(42)

# 1. Element-wise ops — simulating a forward pass
print("=== Forward Pass (Element-wise Ops) ===")
W = np.random.randn(4, 3)    # weight matrix
x = np.random.randn(3)       # input vector
b = np.zeros(4)              # bias vector

z = W @ x + b                # linear layer: Wx + b
a = np.maximum(0, z)         # ReLU activation
print(f"Input   : {np.round(x, 3)}")
print(f"z=Wx+b  : {np.round(z, 3)}")
print(f"ReLU(z) : {np.round(a, 3)}")

# 2. Aggregations — batch statistics
print("\\n=== Batch Statistics ===")
batch = np.random.randn(32, 10)   # 32 samples, 10 features
print(f"Batch shape : {batch.shape}")
print(f"Mean per col: {np.round(np.mean(batch, axis=0), 3)}")
print(f"Std  per col: {np.round(np.std( batch, axis=0), 3)}")
print(f"Global mean : {np.mean(batch):.4f}")

# 3. Softmax — numerically stable version
def softmax(z):
    e = np.exp(z - np.max(z))    # subtract max for stability
    return e / e.sum()

logits = np.array([2.0, 1.0, 0.1])
probs  = softmax(logits)
print(f"\\nLogits : {logits}")
print(f"Softmax: {np.round(probs, 4)}")
print(f"Sum    : {probs.sum():.6f}")

# 4. Broadcasting — batch normalisation step
print("\\n=== Broadcasting ===")
X  = np.random.randn(5, 3)    # 5 samples, 3 features
mu = X.mean(axis=0)           # shape (3,)
s  = X.std(axis=0)            # shape (3,)
X_norm = (X - mu) / (s + 1e-8)  # broadcasts (3,) over (5,3)
print(f"X shape     : {X.shape}")
print(f"mu shape    : {mu.shape}")
print(f"X_norm mean : {np.round(X_norm.mean(axis=0), 6)}")
print(f"X_norm std  : {np.round(X_norm.std(axis=0), 4)}")`,
    questions: [
      q('What does np.sum(data, axis=0) compute for a 2-D array?',
        [{id:'a',text:'Sum of all elements'},{id:'b',text:'Sum along rows, resulting in column sums'},{id:'c',text:'Sum along columns, resulting in row sums'},{id:'d',text:'Number of rows'}],
        'b','axis=0 collapses along rows — summing across rows gives one value per column.',0),
      q('What is the shape result of adding a (3,4) array and a (4,) array using broadcasting?',
        [{id:'a',text:'Error'},{id:'b',text:'(4,)'},{id:'c',text:'(3,4)'},{id:'d',text:'(3,)'}],
        'c','The (4,) array is broadcast across all 3 rows, resulting in shape (3,4).',1),
      q('Which NumPy function implements element-wise ReLU?',
        [{id:'a',text:'np.relu()'},{id:'b',text:'np.maximum(0, x)'},{id:'c',text:'np.abs(x)'},{id:'d',text:'np.clip(x, 0, 1)'}],
        'b','np.maximum(0, x) returns max(0, xi) for each element — the standard ReLU formula.',2),
      q('What does np.argmax(a, axis=1) return?',
        [{id:'a',text:'The maximum value in each row'},{id:'b',text:'The index of the maximum value in each row'},{id:'c',text:'The maximum value in each column'},{id:'d',text:'A boolean array'}],
        'b','argmax returns the INDEX of the maximum, not the maximum value. axis=1 means per row.',3),
      q('Why is batch normalisation implemented using broadcasting?',
        [{id:'a',text:'To avoid using loops when subtracting the per-feature mean and std from a batch matrix'},{id:'b',text:'To speed up GPU operations'},{id:'c',text:'To reduce memory usage'},{id:'d',text:'Because NumPy does not support subtraction on 2-D arrays'}],
        'a','Broadcasting subtracts mean (shape (F,)) from batch (shape (N,F)) without writing any loop.',4),
      q('What does np.clip(x, 0, 1) do?',
        [{id:'a',text:'Normalises x to [0,1]'},{id:'b',text:'Clamps every element to the range [0,1]'},{id:'c',text:'Rounds x to 0 or 1'},{id:'d',text:'Computes the sigmoid of x'}],
        'b','np.clip replaces values < 0 with 0 and values > 1 with 1, leaving the rest unchanged.',5),
      q('What is a ufunc in NumPy?',
        [{id:'a',text:'A user-defined function'},{id:'b',text:'A universal function that operates element-wise on arrays in compiled C code'},{id:'c',text:'A function that requires broadcasting'},{id:'d',text:'A function that only works on 1-D arrays'}],
        'b','Universal functions (np.exp, np.sin, etc.) are C-compiled and vectorised — no Python loop.',6),
      q('Why subtract max before applying softmax?',
        [{id:'a',text:'To normalise the output to [0,1]'},{id:'b',text:'To prevent numerical overflow when exponentiating large values'},{id:'c',text:'To speed up computation'},{id:'d',text:'Because softmax requires non-negative inputs'}],
        'b','exp(large_number) overflows. Subtracting max shifts values so the largest is 0, preventing overflow.',7),
      q('What does np.std(X, axis=0) compute for a (N, F) matrix?',
        [{id:'a',text:'One standard deviation per sample'},{id:'b',text:'One standard deviation per feature (column)'},{id:'c',text:'The global standard deviation'},{id:'d',text:'The variance'}],
        'b','axis=0 collapses along the N dimension, yielding F standard deviations — one per feature.',8),
      q('Why are vectorised NumPy operations faster than Python for-loops?',
        [{id:'a',text:'NumPy uses more CPU cores'},{id:'b',text:'NumPy operations are implemented in compiled C/Fortran and avoid Python interpreter overhead'},{id:'c',text:'NumPy skips error checking'},{id:'d',text:'NumPy uses GPU by default'}],
        'b','Python loops have per-iteration interpreter overhead. NumPy\'s C code processes arrays without it.',9),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 10 — NumPy Linear Algebra Essentials
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-10-numpy-linalg',
    title: 'NumPy — Linear Algebra Essentials',
    description: 'Matrix multiplication, transpose, inverse, eigenvalues, dot products, norms — the operations that power forward passes, PCA, and gradient updates.',
    orderIndex: 10,
    xpReward: 75,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 10 — NumPy Linear Algebra Essentials

## 🎯 Learning Goals
Use NumPy's linalg module to implement the core operations behind neural network forward passes and principal component analysis.

---

## 1. Matrix Multiplication

\`\`\`python
import numpy as np
A = np.random.randn(3, 4)  # 3 rows, 4 cols
B = np.random.randn(4, 5)  # 4 rows, 5 cols
C = A @ B                  # 3×5 — inner dims must match
C = np.dot(A, B)           # identical
\`\`\`

The \`@\` operator is the matrix multiply in every neural network layer.

---

## 2. Transpose

\`\`\`python
A.T      # swap rows and cols
A.T.shape  # (4, 3) from (3, 4)
\`\`\`

Used in gradient computation: \`dW = X.T @ dZ\`.

---

## 3. Norms

\`\`\`python
v = np.array([3.0, 4.0])
np.linalg.norm(v)        # 5.0  (L2 / Euclidean)
np.linalg.norm(v, ord=1) # 7.0  (L1 / Manhattan)
\`\`\`

L1/L2 norms appear in regularisation (weight decay), cosine similarity, and distance metrics.

---

## 4. Inverse & Solving Linear Systems

\`\`\`python
A = np.array([[2,1],[5,3]])
np.linalg.inv(A)           # A^{-1}
np.linalg.solve(A, b)      # faster than inv(A)@b
\`\`\`

---

## 5. Eigenvalues & SVD

\`\`\`python
vals, vecs = np.linalg.eig(A)     # eigendecomposition
U, S, Vt   = np.linalg.svd(A)    # singular value decomp
\`\`\`

PCA computes the eigenvectors of the covariance matrix — the principal components.`,
    codeExample: `# ── Chapter 10: Linear Algebra ──────────────────────────────────
import numpy as np

np.random.seed(1)

# 1. Matrix multiplication — neural network layer
print("=== Neural Network Forward Pass ===")
batch_size, in_dim, out_dim = 4, 3, 5
X = np.random.randn(batch_size, in_dim)   # input batch
W = np.random.randn(in_dim, out_dim)      # weight matrix
b = np.zeros(out_dim)                     # bias

Z = X @ W + b    # (4,3) @ (3,5) + (5,) = (4,5)
print(f"X shape : {X.shape}")
print(f"W shape : {W.shape}")
print(f"Z shape : {Z.shape}")
print(f"Z[0]    : {np.round(Z[0], 3)}")

# 2. Transpose — gradient of W
print("\\n=== Gradient Computation ===")
dZ = np.ones_like(Z)               # upstream gradient
dW = X.T @ dZ                      # (3,4) @ (4,5) = (3,5)
db = dZ.sum(axis=0)
print(f"dW shape: {dW.shape}  (same as W — ✓)")
print(f"db shape: {db.shape}  (same as b — ✓)")

# 3. Norms — L2 and cosine similarity
print("\\n=== Norms & Similarity ===")
v1 = np.array([1.0, 2.0, 3.0])
v2 = np.array([4.0, 5.0, 6.0])
l2 = np.linalg.norm(v1)
cos_sim = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
print(f"|v1| L2      : {l2:.4f}")
print(f"cosine(v1,v2): {cos_sim:.4f}")

# 4. PCA via SVD
print("\\n=== PCA via SVD ===")
data = np.random.randn(100, 5)
data -= data.mean(axis=0)          # centre data
U, S, Vt = np.linalg.svd(data, full_matrices=False)
explained = S**2 / (S**2).sum()
print(f"Data shape   : {data.shape}")
print(f"Singular vals: {np.round(S, 2)}")
print(f"Var explained: {np.round(explained * 100, 1)}%")

# Project to 2 principal components
proj = data @ Vt[:2].T            # (100,5)@(5,2) = (100,2)
print(f"Projected    : {proj.shape}")`,
    questions: [
      q('What are the shape requirements for matrix multiplication A @ B?',
        [{id:'a',text:'A and B must have the same shape'},{id:'b',text:'The number of columns in A must equal the number of rows in B'},{id:'c',text:'Both must be square matrices'},{id:'d',text:'A must be larger than B'}],
        'b','For A (m×n) @ B (n×p), the inner dimensions (n) must match. The result is (m×p).',0),
      q('What does A.T return?',
        [{id:'a',text:'The inverse of A'},{id:'b',text:'The transpose of A (rows and columns swapped)'},{id:'c',text:'The determinant of A'},{id:'d',text:'A copy of A'}],
        'b','.T transposes: rows become columns and columns become rows.',1),
      q('In gradient descent, why is the transpose used to compute dW?',
        [{id:'a',text:'Because dW must be the same shape as W'},{id:'b',text:'To speed up computation'},{id:'c',text:'Because transposing reduces memory'},{id:'d',text:'Because W.T is always positive'}],
        'a','dW = X.T @ dZ: the shapes must align so dW has the same (in, out) shape as W.',2),
      q('What does np.linalg.norm(v) compute by default?',
        [{id:'a',text:'L1 norm (sum of absolute values)'},{id:'b',text:'L2 norm (Euclidean length)'},{id:'c',text:'L-infinity norm'},{id:'d',text:'The maximum value'}],
        'b','Default ord=None gives the L2 (Frobenius for matrices, Euclidean for vectors) norm.',3),
      q('What is cosine similarity used for in AI?',
        [{id:'a',text:'Training speed measurement'},{id:'b',text:'Measuring semantic similarity between word/document embeddings'},{id:'c',text:'Computing gradients'},{id:'d',text:'Loss function'}],
        'b','Cosine similarity measures the angle between vectors — high value means similar direction (meaning).',4),
      q('What does np.linalg.svd return?',
        [{id:'a',text:'Eigenvalues only'},{id:'b',text:'U, S, Vt — the three components of singular value decomposition'},{id:'c',text:'The inverse matrix'},{id:'d',text:'The rank of the matrix'}],
        'b','SVD decomposes A = U @ diag(S) @ Vt — U, S, Vt are the singular vectors and values.',5),
      q('Why is SVD used for PCA?',
        [{id:'a',text:'SVD is faster than eigendecomposition for non-square covariance matrices'},{id:'b',text:'SVD directly provides the principal components (Vt rows) and explained variance (S²)'},{id:'c',text:'SVD works on any matrix, while eigen only works on square ones'},{id:'d',text:'All of the above'}],
        'd','All three reasons make SVD the standard algorithm for PCA in practice.',6),
      q('What is the result of np.linalg.norm([3, 4])?',
        [{id:'a',text:'7.0'},{id:'b',text:'12.0'},{id:'c',text:'5.0'},{id:'d',text:'25.0'}],
        'c','L2 norm = sqrt(3²+4²) = sqrt(9+16) = sqrt(25) = 5.0.',7),
      q('Which operation is equivalent to A @ B in NumPy?',
        [{id:'a',text:'A * B'},{id:'b',text:'np.multiply(A, B)'},{id:'c',text:'np.dot(A, B)'},{id:'d',text:'A.dot(B) and np.dot(A, B) (both identical)'}],
        'd','np.dot and A.dot(B) are both equivalent to the @ operator for 2-D arrays.',8),
      q('Why do you centre data (subtract mean) before applying PCA?',
        [{id:'a',text:'To speed up computation'},{id:'b',text:'To ensure the principal components capture variance, not just the mean offset'},{id:'c',text:'Because SVD requires zero-mean input'},{id:'d',text:'To normalise the scale of each feature'}],
        'b','PCA finds directions of maximum variance. Without centering, the first PC would point at the mean, not the spread.',9),
    ],
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const course = await prisma.course.findUnique({ where: { slug: COURSE_SLUG } });
  if (!course) throw new Error(`Course "${COURSE_SLUG}" not found — run seed.ts first`);

  for (const ch of CHAPTERS) {
    const existing = await prisma.chapter.findFirst({
      where: { courseId: course.id, slug: ch.slug },
    });
    if (existing) { console.log(`⏭  Skip  ${ch.slug}`); continue; }

    const { questions, ...chapterData } = ch;
    const chapter = await prisma.chapter.create({
      data: { ...chapterData, courseId: course.id },
    });

    await prisma.quiz.create({
      data: {
        chapterId:   chapter.id,
        title:       `${ch.title} Quiz`,
        description: `Test your knowledge of ${ch.title}`,
        timeLimit:   600,
        passingScore: 70,
        xpReward:    Math.round(ch.xpReward * 0.8),
        questions:   { create: questions },
      },
    });

    console.log(`✅ Created ch ${ch.orderIndex}: ${ch.title}`);
  }

  console.log('\n🎉 AI Foundations NOOB Block 2 seeded!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
