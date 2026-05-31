/**
 * aiFoundationsNoobBlock1.ts
 * AI Foundations — NOOB Tier — Block 1 (Chapters 1–5)
 *
 * Ch 1  — Variables, Data Types & Print
 * Ch 2  — Operators, Conditions & Loops
 * Ch 3  — Functions & Recursion
 * Ch 4  — Lists, Tuples, Sets & Dictionaries
 * Ch 5  — File I/O & Error Handling
 *
 * Run: cd backend && npm run seed:af-noob-b1
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
  // CHAPTER 1 — Variables, Data Types & Print
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-1-variables',
    title: 'Variables, Data Types & Print',
    description: 'Python variables, int/float/str/bool, type(), and formatted output — the very first building blocks of every AI program.',
    orderIndex: 1,
    xpReward: 50,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 1 — Variables, Data Types & Print

## 🎯 Learning Goals
Understand how Python stores data, the four fundamental data types, and how to display output clearly.

---

## 1. What is a Variable?

A variable is a **named container** that stores a value in memory.

\`\`\`python
age = 22          # int
pi  = 3.14159     # float
name = "Subhronil" # str
is_ai = True      # bool
\`\`\`

Python is **dynamically typed** — you never declare the type; Python infers it automatically.

---

## 2. The Four Core Data Types

| Type | Example | Used For |
|------|---------|----------|
| \`int\` | \`42\` | Whole numbers, counts, indices |
| \`float\` | \`3.14\` | Decimals, scientific values, weights |
| \`str\` | \`"hello"\` | Text, names, labels |
| \`bool\` | \`True\` | Flags, conditions, binary states |

Use \`type(x)\` to inspect any variable.

---

## 3. Formatted Output

\`\`\`python
score = 92.5
print(f"Your score is {score:.1f}%")   # f-string
print("Score:", score)                  # comma-separated
print("Score: " + str(score))          # concatenation
\`\`\`

F-strings (prefix \`f"..."\`) are the modern, readable way to embed variables in strings.

---

## 4. Type Conversion

\`\`\`python
x = int("42")     # str → int
y = float(7)      # int → float
z = str(3.14)     # float → str
\`\`\`

Type conversion is critical when reading user input or parsing data files.

---

## 5. Why This Matters for AI

Every neural network works with **numbers**. You'll constantly convert strings from datasets into floats, check boolean flags for training conditions, and use integers for indexing tensors. Mastering data types is step one.`,
    codeExample: `# ── Chapter 1: Variables, Data Types & Print ───────────────────
# Run this to see Python's type system in action

# 1. Variable assignment
name       = "AIRO Learner"
age        = 20
gpa        = 3.85
is_student = True

# 2. type() inspection
print("=== Data Types ===")
print(type(name),       name)
print(type(age),        age)
print(type(gpa),        gpa)
print(type(is_student), is_student)

# 3. F-string formatting
print()
print(f"Hello, {name}!")
print(f"Age : {age}")
print(f"GPA : {gpa:.2f}")
print(f"Student? {is_student}")

# 4. Type conversion — simulating reading CSV data
raw_score = "87.5"          # came as string from file
score = float(raw_score)    # convert for math
grade = int(score)          # truncate to integer
print()
print(f"Raw  : '{raw_score}' ({type(raw_score).__name__})")
print(f"Float: {score}       ({type(score).__name__})")
print(f"Int  : {grade}       ({type(grade).__name__})")

# 5. AI context: a learning rate is always a float
learning_rate = 0.001
epochs        = 100
model_name    = "SimpleNet"
print()
print(f"Training {model_name} for {epochs} epochs at lr={learning_rate}")`,
    questions: [
      q('What data type does Python assign to the value 3.14?',
        [{id:'a',text:'int'},{id:'b',text:'float'},{id:'c',text:'str'},{id:'d',text:'complex'}],
        'b','3.14 is a decimal number, so Python assigns it the float type.',0),
      q('Which function checks the type of a variable in Python?',
        [{id:'a',text:'typeof()'},{id:'b',text:'datatype()'},{id:'c',text:'type()'},{id:'d',text:'check()'}],
        'c','type() is Python\'s built-in function to inspect the data type of any value.',1),
      q('What is the output of print(f"{2 + 3}")?',
        [{id:'a',text:'"2 + 3"'},{id:'b',text:'5'},{id:'c',text:'23'},{id:'d',text:'Error'}],
        'b','Inside f-string curly braces, Python evaluates the expression 2+3=5.',2),
      q('Which statement converts the string "42" to an integer?',
        [{id:'a',text:'str("42")'},{id:'b',text:'int("42")'},{id:'c',text:'float("42")'},{id:'d',text:'bool("42")'}],
        'b','int() converts a string containing a whole number to an integer type.',3),
      q('Python is described as "dynamically typed". What does this mean?',
        [{id:'a',text:'Variables can only hold one type forever'},{id:'b',text:'You must declare types before using variables'},{id:'c',text:'Python infers types automatically; no explicit declaration needed'},{id:'d',text:'All variables are stored as strings internally'}],
        'c','Dynamic typing means Python determines the type at runtime based on the assigned value.',4),
      q('What is the boolean value of 0 in Python?',
        [{id:'a',text:'True'},{id:'b',text:'False'},{id:'c',text:'None'},{id:'d',text:'Error'}],
        'b','In Python, 0 evaluates to False; any non-zero number evaluates to True.',5),
      q('Which of the following is a valid f-string?',
        [{id:'a',text:'f"Hello {name}"'},{id:'b',text:'"Hello {name}"'},{id:'c',text:'f"Hello name"'},{id:'d',text:'f(Hello {name})'}],
        'a','F-strings require the f prefix before the opening quote, with expressions in curly braces.',6),
      q('What does int(3.9) return in Python?',
        [{id:'a',text:'4'},{id:'b',text:'3'},{id:'c',text:'3.9'},{id:'d',text:'Error'}],
        'b','int() truncates (does not round) a float toward zero, so int(3.9) returns 3.',7),
      q('In AI/ML, learning rates are stored as which data type?',
        [{id:'a',text:'int'},{id:'b',text:'bool'},{id:'c',text:'str'},{id:'d',text:'float'}],
        'd','Learning rates (e.g. 0.001) are decimal values, so they are stored as floats.',8),
      q('What is the difference between = and == in Python?',
        [{id:'a',text:'Both are assignment operators'},{id:'b',text:'= assigns a value; == checks equality'},{id:'c',text:'= checks equality; == assigns'},{id:'d',text:'They are interchangeable'}],
        'b','= is assignment (store a value); == is a comparison operator (test if two values are equal).',9),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 2 — Operators, Conditions & Loops
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-2-operators-loops',
    title: 'Operators, Conditions & Loops',
    description: 'Arithmetic, comparison and logical operators; if/elif/else branching; for and while loops — the control flow that drives every training algorithm.',
    orderIndex: 2,
    xpReward: 55,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 2 — Operators, Conditions & Loops

## 🎯 Learning Goals
Master Python's operators, write conditional logic, and build loops that power iterative AI training.

---

## 1. Arithmetic Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`+\` \`-\` \`*\` \`/\` | Basic math | \`5/2 = 2.5\` |
| \`//\` | Integer division | \`5//2 = 2\` |
| \`%\` | Modulo (remainder) | \`5%2 = 1\` |
| \`**\` | Exponent | \`2**10 = 1024\` |

---

## 2. Comparison & Logical Operators

\`\`\`python
x = 10
x > 5   # True
x == 10  # True
x != 7   # True

# Logical
(x > 5) and (x < 20)   # True
(x < 5) or  (x == 10)  # True
not (x > 5)             # False
\`\`\`

---

## 3. if / elif / else

\`\`\`python
score = 85
if score >= 90:
    grade = 'A'
elif score >= 75:
    grade = 'B'
else:
    grade = 'C'
print(grade)  # B
\`\`\`

---

## 4. for Loop

\`\`\`python
for epoch in range(5):
    print(f"Epoch {epoch}")
\`\`\`

\`range(start, stop, step)\` generates integers. In ML, the epoch loop is the most common pattern.

---

## 5. while Loop

\`\`\`python
loss = 1.0
while loss > 0.01:
    loss *= 0.9   # simulate decrease
print("Converged!")
\`\`\`

Use \`while\` when the number of iterations is not known in advance — common in optimization.`,
    codeExample: `# ── Chapter 2: Operators, Conditions & Loops ───────────────────

# 1. Arithmetic operators
a, b = 17, 5
print(f"{a} + {b} = {a + b}")
print(f"{a} // {b} = {a // b}")   # integer division
print(f"{a} % {b}  = {a % b}")    # remainder
print(f"2 ** 8  = {2 ** 8}")      # exponent

# 2. Comparisons
score = 78
print(f"\\nscore={score}  >=75? {score >= 75}  ==80? {score == 80}")

# 3. Grading system (if/elif/else)
def get_grade(s):
    if s >= 90:   return 'A'
    elif s >= 80: return 'B'
    elif s >= 70: return 'C'
    elif s >= 60: return 'D'
    else:         return 'F'

for s in [95, 82, 73, 61, 45]:
    print(f"  score={s} → {get_grade(s)}")

# 4. For loop — simulating epochs
print("\\n=== Training Loop ===")
losses = []
for epoch in range(1, 6):
    loss = 1.0 / epoch          # fake decreasing loss
    losses.append(round(loss, 4))
    print(f"Epoch {epoch}: loss={loss:.4f}")

# 5. While loop — converge to threshold
print("\\n=== Convergence ===")
loss = 10.0
step = 0
while loss > 0.5:
    loss *= 0.7
    step += 1
print(f"Converged after {step} steps. Final loss: {loss:.4f}")`,
    questions: [
      q('What does the // operator do in Python?',
        [{id:'a',text:'Floating-point division'},{id:'b',text:'Integer (floor) division'},{id:'c',text:'Modulo'},{id:'d',text:'Exponentiation'}],
        'b','// performs floor division, discarding any fractional part and returning an integer.',0),
      q('What is 10 % 3 in Python?',
        [{id:'a',text:'3'},{id:'b',text:'1'},{id:'c',text:'0'},{id:'d',text:'3.33'}],
        'b','The modulo operator returns the remainder of division. 10 ÷ 3 = 3 remainder 1.',1),
      q('Which keyword is used for the "else if" branch in Python?',
        [{id:'a',text:'else if'},{id:'b',text:'elseif'},{id:'c',text:'elif'},{id:'d',text:'otherwise'}],
        'c','Python uses elif (short for "else if") for additional conditional branches.',2),
      q('What does range(0, 10, 2) produce?',
        [{id:'a',text:'[0,1,2,3,4,5,6,7,8,9]'},{id:'b',text:'[0,2,4,6,8]'},{id:'c',text:'[2,4,6,8,10]'},{id:'d',text:'[1,3,5,7,9]'}],
        'b','range(start, stop, step) with step=2 produces 0,2,4,6,8 (stop is exclusive).',3),
      q('Which loop is best when the number of iterations is unknown in advance?',
        [{id:'a',text:'for loop'},{id:'b',text:'while loop'},{id:'c',text:'do-while loop'},{id:'d',text:'loop-while'}],
        'b','while loops run as long as a condition is True, ideal when the count is not predetermined.',4),
      q('What does "not True" evaluate to?',
        [{id:'a',text:'True'},{id:'b',text:'False'},{id:'c',text:'None'},{id:'d',text:'Error'}],
        'b','The "not" operator inverts a boolean: not True is False.',5),
      q('What is the result of 2 ** 10?',
        [{id:'a',text:'20'},{id:'b',text:'200'},{id:'c',text:'1024'},{id:'d',text:'512'}],
        'c','2 ** 10 means 2 raised to the power 10 = 1024.',6),
      q('In AI, why are for loops essential?',
        [{id:'a',text:'For loading datasets from disk'},{id:'b',text:'For iterating over training epochs'},{id:'c',text:'For reading user input'},{id:'d',text:'For type conversion'}],
        'b','Training loops iterate over epochs, and batch loops iterate over mini-batches — both use for loops.',7),
      q('What does the keyword "break" do inside a loop?',
        [{id:'a',text:'Pauses the loop temporarily'},{id:'b',text:'Skips to the next iteration'},{id:'c',text:'Immediately exits the loop'},{id:'d',text:'Restarts the loop from the beginning'}],
        'c','break immediately terminates the enclosing loop, useful for early stopping in training.',8),
      q('Which is the correct way to check if x is between 0 and 1 (exclusive)?',
        [{id:'a',text:'0 < x < 1'},{id:'b',text:'0 < x and x < 1 (both are valid)'},{id:'c',text:'Both A and B are valid Python'},{id:'d',text:'x > 0 or x < 1'}],
        'c','Python supports chained comparisons (0 < x < 1) and also the explicit and form — both work.',9),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 3 — Functions & Recursion
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-3-functions',
    title: 'Functions & Recursion',
    description: 'Defining functions with def, parameters, default arguments, return values, lambda, and recursion — the building blocks of reusable AI code.',
    orderIndex: 3,
    xpReward: 60,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 3 — Functions & Recursion

## 🎯 Learning Goals
Write reusable functions, understand scope, use lambdas, and apply recursion for tree-structured problems in AI.

---

## 1. Defining a Function

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("AI"))          # Hello, AI!
print(greet("AI", "Hi"))    # Hi, AI!
\`\`\`

- \`def\` declares a function
- Parameters can have **default values**
- \`return\` sends a value back to the caller

---

## 2. *args and **kwargs

\`\`\`python
def summarize(*args):          # variable positional args
    return sum(args) / len(args)

def config(**kwargs):          # variable keyword args
    for k, v in kwargs.items():
        print(f"{k}: {v}")

config(lr=0.001, epochs=50)
\`\`\`

---

## 3. Lambda Functions

\`\`\`python
relu = lambda x: max(0, x)     # one-liner function
print(relu(-3), relu(5))       # 0  5
\`\`\`

Lambdas are anonymous functions — common in data preprocessing pipelines.

---

## 4. Scope: Local vs Global

Variables inside a function are **local** by default. Use \`global\` to modify module-level variables (rare — prefer return values).

---

## 5. Recursion

A function that calls itself. Base case stops the recursion.

\`\`\`python
def factorial(n):
    if n == 0: return 1        # base case
    return n * factorial(n-1)  # recursive case
\`\`\`

Decision trees, recursive neural networks, and tree traversal all rely on recursive thinking.`,
    codeExample: `# ── Chapter 3: Functions & Recursion ───────────────────────────

# 1. Basic function with default argument
def activation(x, func="relu"):
    if func == "relu":    return max(0, x)
    elif func == "tanh":
        import math
        return math.tanh(x)
    else:                 return x

print("=== Activation Functions ===")
for z in [-2, -0.5, 0, 0.5, 2]:
    print(f"  relu({z:5.1f}) = {activation(z):.4f}  "
          f"tanh({z:5.1f}) = {activation(z, 'tanh'):.4f}")

# 2. *args — average of any number of values
def mean(*values):
    return sum(values) / len(values)

print(f"\\nmean(1,2,3)    = {mean(1,2,3):.2f}")
print(f"mean(10,20,30,40) = {mean(10,20,30,40):.2f}")

# 3. Lambda — used in data pipelines
normalize = lambda x, lo, hi: (x - lo) / (hi - lo)
data = [10, 25, 40, 55, 70]
lo, hi = min(data), max(data)
normed = [round(normalize(x, lo, hi), 3) for x in data]
print(f"\\nOriginal : {data}")
print(f"Normalized: {normed}")

# 4. Recursion — fibonacci (pattern used in memoized RL trees)
def fib(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1:    return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]

print("\\n=== Fibonacci (memoized) ===")
print([fib(i) for i in range(10)])`,
    questions: [
      q('What keyword defines a function in Python?',
        [{id:'a',text:'function'},{id:'b',text:'def'},{id:'c',text:'fn'},{id:'d',text:'define'}],
        'b','Python uses "def" followed by the function name and parentheses to define a function.',0),
      q('What does a function with no return statement return?',
        [{id:'a',text:'0'},{id:'b',text:'""'},{id:'c',text:'None'},{id:'d',text:'False'}],
        'c','Functions without an explicit return statement automatically return None.',1),
      q('What is a default argument in Python?',
        [{id:'a',text:'An argument that is always required'},{id:'b',text:'A parameter with a pre-assigned value used when the caller does not provide it'},{id:'c',text:'The first argument of any function'},{id:'d',text:'An argument that must be passed as a keyword'}],
        'b','Default arguments have values like def f(x, lr=0.01) — lr is optional for the caller.',2),
      q('What does *args allow in a function?',
        [{id:'a',text:'Passing keyword arguments'},{id:'b',text:'Accepting any number of positional arguments as a tuple'},{id:'c',text:'Returning multiple values'},{id:'d',text:'Creating a lambda'}],
        'b','*args collects any number of positional arguments into a tuple inside the function.',3),
      q('What is a lambda function?',
        [{id:'a',text:'A function that returns None'},{id:'b',text:'A recursive function'},{id:'c',text:'An anonymous single-expression function'},{id:'d',text:'A function that accepts only keywords'}],
        'c','Lambda creates a small anonymous function in one line: lambda x: x**2.',4),
      q('What is the base case in recursion?',
        [{id:'a',text:'The first recursive call'},{id:'b',text:'The condition that stops the recursion'},{id:'c',text:'The largest possible input'},{id:'d',text:'The return type of the function'}],
        'b','The base case is the terminating condition that prevents infinite recursion.',5),
      q('Which of the following computes relu(x) = max(0, x) as a lambda?',
        [{id:'a',text:'def relu(x): return max(0,x)'},{id:'b',text:'relu = lambda x: max(0, x)'},{id:'c',text:'relu = max(0)'},{id:'d',text:'lambda: max(0,x)'}],
        'b','lambda x: max(0, x) creates an anonymous function that accepts x and returns max(0,x).',6),
      q('What is memoization in recursion?',
        [{id:'a',text:'A way to limit recursion depth'},{id:'b',text:'Caching computed results to avoid redundant calls'},{id:'c',text:'Converting recursion to a loop'},{id:'d',text:'Logging function calls'}],
        'b','Memoization stores results of expensive recursive calls so they are not re-computed.',7),
      q('In AI, functions are important because:',
        [{id:'a',text:'Python requires functions for all code'},{id:'b',text:'They allow reuse — define once, apply to datasets, layers, training loops everywhere'},{id:'c',text:'They make code run on GPUs'},{id:'d',text:'They replace loops'}],
        'b','Functions enable reuse and abstraction — critical for building modular, maintainable AI systems.',8),
      q('What happens if a recursive function has no base case?',
        [{id:'a',text:'It returns 0'},{id:'b',text:'It runs once and stops'},{id:'c',text:'It causes infinite recursion and a RecursionError'},{id:'d',text:'Python automatically adds a base case'}],
        'c','Without a base case, a recursive function keeps calling itself until Python hits the recursion limit.',9),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 4 — Lists, Tuples, Sets & Dicts
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-4-data-structures',
    title: 'Lists, Tuples, Sets & Dictionaries',
    description: 'Python\'s four core data structures — mutability, slicing, comprehensions, and when to use each in AI data pipelines.',
    orderIndex: 4,
    xpReward: 60,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 4 — Lists, Tuples, Sets & Dictionaries

## 🎯 Learning Goals
Choose the right data structure for any AI task, and use comprehensions for efficient data transformation.

---

## 1. List — Ordered, Mutable

\`\`\`python
scores = [85, 92, 78, 95]
scores.append(88)         # add
scores[0] = 90            # modify
scores[1:3]               # slice → [92, 78]
\`\`\`

Lists are the bread-and-butter of AI: feature vectors, training histories, mini-batches.

---

## 2. Tuple — Ordered, Immutable

\`\`\`python
shape = (28, 28, 1)       # MNIST image shape
width, height, channels = shape  # unpacking
\`\`\`

Tuples are used for **fixed** data (image shapes, model configs) — they can be dictionary keys.

---

## 3. Set — Unique, Unordered

\`\`\`python
vocab = {"cat", "dog", "cat", "bird"}
print(vocab)              # {'cat', 'dog', 'bird'} — no duplicates
\`\`\`

Sets shine for vocabulary building (NLP) and removing duplicate labels.

---

## 4. Dictionary — Key-Value Pairs

\`\`\`python
config = {"lr": 0.001, "epochs": 100, "batch_size": 32}
config["dropout"] = 0.5   # add key
print(config.get("lr", 0.01))  # safe access
\`\`\`

Dictionaries power everything: model configs, label mappings, metric tracking.

---

## 5. Comprehensions

\`\`\`python
squares   = [x**2 for x in range(10)]
even_sq   = [x**2 for x in range(10) if x % 2 == 0]
word_len  = {w: len(w) for w in ["cat", "elephant"]}
\`\`\`

Comprehensions replace verbose for-loops and are faster in CPython.`,
    codeExample: `# ── Chapter 4: Data Structures ─────────────────────────────────

# 1. List — training loss history
losses = []
for epoch in range(1, 8):
    losses.append(round(1.0 / epoch, 4))

print("=== Loss History (list) ===")
print(losses)
print(f"Best loss : {min(losses)}")
print(f"Last 3    : {losses[-3:]}")     # slicing

# 2. Tuple — image shape (immutable)
img_shape = (224, 224, 3)               # ImageNet size
h, w, c = img_shape                     # unpacking
print(f"\\nImage: {h}x{w}, {c} channels")

# 3. Set — unique class labels
raw_labels = ["cat","dog","cat","bird","dog","bird","fish"]
unique_labels = set(raw_labels)
print(f"\\nAll labels  : {raw_labels}")
print(f"Unique set  : {unique_labels}")
print(f"Vocab size  : {len(unique_labels)}")

# 4. Dictionary — model hyperparameters
config = {
    "lr":         0.001,
    "epochs":     50,
    "batch_size": 32,
    "optimizer":  "adam",
}
config["dropout"] = 0.5          # add new key
print("\\n=== Model Config (dict) ===")
for key, val in config.items():
    print(f"  {key:<12}: {val}")

# 5. Comprehensions — data preprocessing
data = [3, -1, 5, -2, 8, 0, -4, 7]
positive = [x for x in data if x > 0]
scaled   = {x: round(x / max(data), 3) for x in positive}
print(f"\\nPositive values : {positive}")
print(f"Scaled dict     : {scaled}")`,
    questions: [
      q('Which Python data structure is MUTABLE and ORDERED?',
        [{id:'a',text:'Tuple'},{id:'b',text:'Set'},{id:'c',text:'List'},{id:'d',text:'Frozenset'}],
        'c','Lists are ordered (indexed) and mutable — you can change, add, or remove elements.',0),
      q('What makes a tuple different from a list?',
        [{id:'a',text:'Tuples can hold more elements'},{id:'b',text:'Tuples are immutable — elements cannot be changed after creation'},{id:'c',text:'Tuples are faster for iteration only'},{id:'d',text:'Tuples can only hold integers'}],
        'b','Tuples are immutable; once created, their elements cannot be modified.',1),
      q('What does list slicing scores[1:4] return?',
        [{id:'a',text:'Elements at indices 1, 2, 3, 4'},{id:'b',text:'Elements at indices 1, 2, 3 (stop is exclusive)'},{id:'c',text:'The element at index 4'},{id:'d',text:'A copy of the whole list'}],
        'b','Python slicing a[start:stop] includes start but excludes stop, so [1:4] gives indices 1,2,3.',2),
      q('Which data structure guarantees no duplicate elements?',
        [{id:'a',text:'List'},{id:'b',text:'Tuple'},{id:'c',text:'Set'},{id:'d',text:'Dictionary'}],
        'c','Sets automatically discard duplicates — each element appears at most once.',3),
      q('In a dictionary, what happens if you access a key that does not exist using []?',
        [{id:'a',text:'Returns None'},{id:'b',text:'Returns 0'},{id:'c',text:'Raises KeyError'},{id:'d',text:'Returns an empty string'}],
        'c','Accessing a missing key with [] raises KeyError. Use .get(key, default) for safe access.',4),
      q('What does this comprehension return: [x**2 for x in range(5)]?',
        [{id:'a',text:'[0,1,2,3,4]'},{id:'b',text:'[1,4,9,16,25]'},{id:'c',text:'[0,1,4,9,16]'},{id:'d',text:'[0,2,4,6,8]'}],
        'c','range(5) gives 0,1,2,3,4 and squaring gives 0,1,4,9,16.',5),
      q('How do you safely get a value from a dict with a fallback default?',
        [{id:'a',text:'dict[key]'},{id:'b',text:'dict.get(key, default)'},{id:'c',text:'dict.fetch(key)'},{id:'d',text:'dict.find(key, default)'}],
        'b','.get(key, default) returns the value if the key exists, or the default if it does not.',6),
      q('In NLP, which structure is used to build a vocabulary of unique words?',
        [{id:'a',text:'List'},{id:'b',text:'Tuple'},{id:'c',text:'Set'},{id:'d',text:'Float'}],
        'c','Sets eliminate duplicates, making them ideal for building vocabularies from text corpora.',7),
      q('What is the time complexity of key lookup in a Python dictionary?',
        [{id:'a',text:'O(n)'},{id:'b',text:'O(log n)'},{id:'c',text:'O(1) average case'},{id:'d',text:'O(n log n)'}],
        'c','Dictionary lookups use hash tables, giving O(1) average-case time — much faster than list search.',8),
      q('Which data structure is used to store model hyperparameters like lr and batch_size?',
        [{id:'a',text:'List'},{id:'b',text:'Set'},{id:'c',text:'Tuple'},{id:'d',text:'Dictionary'}],
        'd','Dictionaries map parameter names (keys) to their values — perfect for model configs.',9),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 5 — File I/O & Error Handling
  // ══════════════════════════════════════════════
  {
    slug: 'af-noob-5-file-io',
    title: 'File I/O & Error Handling',
    description: 'Reading and writing files, working with CSV and JSON, and using try/except/finally to write robust AI data pipelines that never crash silently.',
    orderIndex: 5,
    xpReward: 65,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 5 — File I/O & Error Handling

## 🎯 Learning Goals
Read training data from files, write results to disk, handle errors gracefully, and work with JSON configs.

---

## 1. Reading Files

\`\`\`python
with open("data.txt", "r") as f:
    content = f.read()       # entire file as string
    lines = f.readlines()    # list of lines
\`\`\`

The \`with\` statement ensures the file is automatically closed — always prefer this.

---

## 2. Writing Files

\`\`\`python
with open("results.txt", "w") as f:
    f.write("Accuracy: 94.5%\\n")

with open("log.txt", "a") as f:  # append mode
    f.write("Epoch 10 complete\\n")
\`\`\`

---

## 3. CSV Files

\`\`\`python
import csv
with open("dataset.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["label"], row["feature"])
\`\`\`

---

## 4. JSON — Model Configs & API Data

\`\`\`python
import json
config = {"lr": 0.001, "epochs": 100}
with open("config.json", "w") as f:
    json.dump(config, f, indent=2)

with open("config.json") as f:
    loaded = json.load(f)
\`\`\`

---

## 5. try / except / finally

\`\`\`python
try:
    data = int(input("Enter value: "))
except ValueError as e:
    print(f"Bad input: {e}")
finally:
    print("Always runs — clean up here")
\`\`\`

Robust AI pipelines catch bad data gracefully instead of crashing mid-training.`,
    codeExample: `# ── Chapter 5: File I/O & Error Handling ────────────────────────
import json, os, csv

# 1. Write a JSON config (simulating saving model hyperparameters)
config = {
    "model":      "SimpleNet",
    "lr":         0.001,
    "epochs":     50,
    "batch_size": 32,
    "dropout":    0.5,
}
config_path = "model_config.json"
with open(config_path, "w") as f:
    json.dump(config, f, indent=2)
print(f"Config saved to {config_path}")

# 2. Read it back
with open(config_path) as f:
    loaded = json.load(f)
print(f"Loaded lr={loaded['lr']}, epochs={loaded['epochs']}")

# 3. Write a CSV training log
log_path = "training_log.csv"
rows = [{"epoch": i, "loss": round(1/i, 4), "acc": round(1 - 1/(i+1), 4)}
        for i in range(1, 6)]
with open(log_path, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["epoch","loss","acc"])
    writer.writeheader()
    writer.writerows(rows)
print(f"Training log saved ({len(rows)} rows)")

# 4. Read the CSV back
print("\\n=== Training Log ===")
with open(log_path) as f:
    for row in csv.DictReader(f):
        print(f"  Epoch {row['epoch']}: loss={row['loss']} acc={row['acc']}")

# 5. Robust error handling — safe data conversion
def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError) as e:
        print(f"  Warning: could not convert '{value}' ({e})")
        return default

raw_inputs = ["1.5", "3.2", "bad_data", None, "2.7"]
print("\\n=== Safe Conversion ===")
clean = [safe_float(v) for v in raw_inputs]
print(f"Input  : {raw_inputs}")
print(f"Cleaned: {clean}")

# Cleanup temp files
for p in [config_path, log_path]:
    os.remove(p)`,
    questions: [
      q('What does the "with open(...) as f:" pattern ensure?',
        [{id:'a',text:'The file is read faster'},{id:'b',text:'The file is automatically closed after the block'},{id:'c',text:'The file is opened in binary mode'},{id:'d',text:'The file is locked against other processes'}],
        'b','The with statement (context manager) guarantees the file is properly closed when the block exits.',0),
      q('Which file mode appends data without overwriting existing content?',
        [{id:'a',text:'"r"'},{id:'b',text:'"w"'},{id:'c',text:'"a"'},{id:'d',text:'"x"'}],
        'c','"a" (append) mode adds data to the end of the file without erasing existing content.',1),
      q('Which Python module handles CSV file reading and writing?',
        [{id:'a',text:'os'},{id:'b',text:'sys'},{id:'c',text:'csv'},{id:'d',text:'io'}],
        'c','The built-in csv module provides DictReader and DictWriter for CSV processing.',2),
      q('What does json.load(f) do?',
        [{id:'a',text:'Writes a Python object to a JSON file'},{id:'b',text:'Reads a JSON file and returns a Python object (dict/list)'},{id:'c',text:'Validates JSON syntax'},{id:'d',text:'Compresses a JSON file'}],
        'b','json.load() reads a JSON file and deserializes it into a Python dictionary or list.',3),
      q('When is try/except most useful in an AI pipeline?',
        [{id:'a',text:'To speed up training'},{id:'b',text:'To handle bad or malformed data without crashing the entire pipeline'},{id:'c',text:'To write to files faster'},{id:'d',text:'To load models from disk'}],
        'b','try/except lets pipelines skip or log bad data rows instead of halting on a single error.',4),
      q('What does the "finally" block do?',
        [{id:'a',text:'Runs only when an exception occurs'},{id:'b',text:'Runs only when no exception occurs'},{id:'c',text:'Always runs, regardless of whether an exception occurred'},{id:'d',text:'Re-raises the caught exception'}],
        'c','finally always executes — used for cleanup like closing files or database connections.',5),
      q('Which format is most commonly used to save ML model configurations?',
        [{id:'a',text:'CSV'},{id:'b',text:'TXT'},{id:'c',text:'JSON'},{id:'d',text:'XML'}],
        'c','JSON is the standard for model configs: human-readable, hierarchical, and natively supported.',6),
      q('What does csv.DictReader return for each row?',
        [{id:'a',text:'A list of values'},{id:'b',text:'A dictionary mapping column names to values'},{id:'c',text:'A tuple'},{id:'d',text:'A set'}],
        'b','DictReader maps each row to an OrderedDict using the header row as keys.',7),
      q('What exception is raised when you try to convert "abc" to float?',
        [{id:'a',text:'TypeError'},{id:'b',text:'KeyError'},{id:'c',text:'ValueError'},{id:'d',text:'IndexError'}],
        'c','float("abc") raises ValueError because the string cannot be parsed as a floating-point number.',8),
      q('In production AI, why is error handling critical?',
        [{id:'a',text:'It makes code run on GPUs'},{id:'b',text:'Real-world data is messy — corrupt records should be skipped, not crash the job'},{id:'c',text:'It speeds up file reading'},{id:'d',text:'Python requires it for all file operations'}],
        'b','Production datasets always have bad rows. Graceful error handling keeps training jobs alive.',9),
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
    if (existing) {
      console.log(`⏭  Skip  ${ch.slug}`);
      continue;
    }

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

  console.log('\n🎉 AI Foundations NOOB Block 1 seeded!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
