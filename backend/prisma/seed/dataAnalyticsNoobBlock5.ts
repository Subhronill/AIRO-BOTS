/**
 * dataAnalyticsNoobBlock5.ts
 *
 * Noob Level — Block 5: Python & Statistics Deep Dive
 * Chapters 13-19 (orderIndex 13-19) after capstone reorder.
 *
 * Topics:
 *   13 — Python Functions, Modules & File I/O
 *   14 — NumPy — Arrays, Broadcasting & Numerical Operations
 *   15 — Pandas Advanced — Merging, Reshaping & GroupBy
 *   16 — Exploratory Data Analysis (EDA) — The Complete Workflow
 *   17 — Probability & Statistical Distributions
 *   18 — Correlation, Causation & Simple Linear Regression
 *   19 — Interactive Data Visualization with Plotly
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const IDX_TO_ID = ['a', 'b', 'c', 'd'];

// ---------------------------------------------------------------------------

const CHAPTERS = [

  // ── 1 of 7 ────────────────────────────────────────────────────────────────
  {
    title:       'Python Functions, Modules & File I/O',
    slug:        'da-noob-17-python-functions',
    description: 'Master Python functions, lambda expressions, module imports, and file handling — the building blocks that transform scripts into reusable, professional data pipelines.',
    tier:        'NOOB' as const,
    orderIndex:  13,
    xpReward:    75,
    content: `# Python Functions, Modules & File I/O

## Why This Chapter Matters

Writing the same code over and over wastes time and creates bugs. Functions let you package logic into reusable units; modules give you access to thousands of pre-built tools; and file I/O lets your scripts read CSVs, write reports, and automate data processing tasks.

---

## 1. Defining Functions

The \`def\` keyword creates a named, reusable function.

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))  # Hello, Alice!
\`\`\`

### Default Parameter Values

\`\`\`python
def calculate_mean(numbers, round_to=2):
    return round(sum(numbers) / len(numbers), round_to)

data = [12, 45, 23, 67, 34]
print(calculate_mean(data))     # 36.2
print(calculate_mean(data, 0))  # 36.0
\`\`\`

---

## 2. *args and **kwargs

\`\`\`python
def sum_all(*args):
    return sum(args)   # args is a tuple

def show_info(**kwargs):
    for key, val in kwargs.items():
        print(f"{key}: {val}")

show_info(name="Alice", role="Analyst")
\`\`\`

- **\`*args\`** — any number of positional arguments → **tuple**
- **\`**kwargs\`** — any number of keyword arguments → **dict**

---

## 3. Lambda Functions

Compact, anonymous one-liners — ideal for \`map()\`, \`filter()\`, and \`sorted()\`:

\`\`\`python
double = lambda x: x * 2

# Sort list of dicts by salary
employees = [{"name": "Bob", "salary": 45000},
             {"name": "Alice", "salary": 62000}]
by_salary = sorted(employees, key=lambda e: e["salary"])

# Filter values above threshold
scores = [45, 78, 55, 32, 91]
passing = list(filter(lambda s: s > 50, scores))  # [78, 55, 91]
\`\`\`

---

## 4. Essential Standard Library Modules

\`\`\`python
import os           # file paths, directory listing
import math         # sqrt, log, pi, ceil, floor
import json         # parse and write JSON
import csv          # read and write CSV files
from datetime import datetime, timedelta
from collections import Counter, defaultdict
\`\`\`

| Module | Key Use |
|--------|---------|
| \`os\` | \`os.listdir()\`, \`os.path.join()\`, \`os.environ\` |
| \`math\` | \`math.sqrt()\`, \`math.log()\`, \`math.ceil()\` |
| \`datetime\` | Date arithmetic, formatting, parsing |
| \`json\` | Convert Python dicts to/from JSON |
| \`collections\` | \`Counter\` for frequencies, \`defaultdict\` for safe access |

---

## 5. Reading and Writing Files

### CSV Files

\`\`\`python
import csv

# Read as list of dicts (header row = keys)
with open("sales.csv", "r", encoding="utf-8") as f:
    data = list(csv.DictReader(f))

# Write list of dicts to CSV
fields = ["date", "region", "revenue"]
rows   = [{"date": "2024-01", "region": "North", "revenue": 12000}]

with open("output.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)
\`\`\`

### JSON Files

\`\`\`python
import json

with open("config.json", "r") as f:
    config = json.load(f)          # file  → Python dict

result = {"model": "v1", "score": 0.87}
with open("result.json", "w") as f:
    json.dump(result, f, indent=2) # Python dict → file
\`\`\`

---

## 6. Error Handling

\`\`\`python
def safe_read(filepath):
    try:
        with open(filepath, "r") as f:
            return list(csv.DictReader(f))
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        return []
    except PermissionError:
        print("No permission to read file")
        return []
\`\`\`

Always wrap file operations in \`try/except\` — real-world data is messy.

---

## 7. Building a Mini Data Pipeline

\`\`\`python
from collections import Counter

def load_csv(path):
    with open(path, "r") as f:
        return list(csv.DictReader(f))

def filter_by(data, key, value):
    return [r for r in data if r.get(key) == value]

def top_values(data, key, n=5):
    return Counter(r[key] for r in data if key in r).most_common(n)

sales = load_csv("sales.csv")
north = filter_by(sales, "region", "North")
print(top_values(north, "product"))
\`\`\`

---

## Summary

| Concept | Syntax |
|---------|--------|
| Define function | \`def name(params):\` |
| Return value | \`return value\` |
| Default param | \`def f(x=10):\` |
| Positional variadic | \`*args\` (tuple) |
| Keyword variadic | \`**kwargs\` (dict) |
| Lambda | \`lambda x: x * 2\` |
| Read file | \`with open(path, "r") as f:\` |
| Handle errors | \`try: ... except Error:\` |
`,
    codeExample: `import csv, json
from collections import Counter

def load_csv(filepath):
    """Load CSV file into a list of dicts."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return list(csv.DictReader(f))
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        return []

def top_regions(data, n=3):
    """Return top N regions by number of sales."""
    return Counter(r["region"] for r in data).most_common(n)

def total_revenue(data, region=None):
    """Sum revenue, optionally for a specific region."""
    rows = data if region is None else [r for r in data if r.get("region") == region]
    return sum(float(r.get("revenue", 0)) for r in rows)

def save_summary(summary, output_path):
    """Save analysis summary as JSON."""
    with open(output_path, "w") as f:
        json.dump(summary, f, indent=2)
    print(f"Summary saved to {output_path}")

# --- Usage ---
sales = load_csv("sales.csv")
summary = {
    "total_revenue": total_revenue(sales),
    "top_regions":   top_regions(sales),
    "north_revenue": total_revenue(sales, "North"),
}
save_summary(summary, "summary.json")`,
    quizzes: [
      {
        question: 'Which keyword is used to define a named function in Python?',
        options: ['function', 'def', 'fn', 'lambda'],
        correctAnswer: 1,
        explanation: '"def" is the Python keyword for defining a named function.',
      },
      {
        question: 'What does *args capture in a function definition?',
        options: [
          'A single required keyword argument',
          'Any number of positional arguments as a tuple',
          'A dictionary of keyword arguments',
          'Only the first argument passed',
        ],
        correctAnswer: 1,
        explanation: '*args collects all extra positional arguments into a tuple.',
      },
      {
        question: 'What is a lambda function in Python?',
        options: [
          'A multi-line function with named parameters',
          'A method defined inside a class',
          'An anonymous one-line function',
          'A built-in function like print()',
        ],
        correctAnswer: 2,
        explanation: 'Lambda creates a compact, anonymous function for simple one-liner operations.',
      },
      {
        question: 'Which standard library module provides mathematical functions like sqrt and log?',
        options: ['sys', 'os', 'math', 'numeric'],
        correctAnswer: 2,
        explanation: 'The math module provides sqrt(), log(), pi, ceil(), floor(), and more.',
      },
      {
        question: 'What does "with open(file, \'r\') as f:" guarantee?',
        options: [
          'The file is created if it does not exist',
          'The file is opened in write mode',
          'The file is automatically closed after the block exits',
          'The file contents are cached in memory permanently',
        ],
        correctAnswer: 2,
        explanation: 'The "with" context manager guarantees file closure even if an exception occurs inside the block.',
      },
      {
        question: 'What does csv.DictReader return for each row?',
        options: [
          'A list of string values in column order',
          'A dictionary with column headers as keys',
          'A raw unparsed string',
          'A tuple of (index, value) pairs',
        ],
        correctAnswer: 1,
        explanation: 'DictReader maps each row to a dict using the header row as keys.',
      },
      {
        question: 'Which exception is raised when a file path does not exist?',
        options: ['ValueError', 'TypeError', 'FileNotFoundError', 'PathError'],
        correctAnswer: 2,
        explanation: 'FileNotFoundError is raised when open() cannot locate the specified file.',
      },
      {
        question: 'What does json.load(f) do?',
        options: [
          'Converts a Python dict to a JSON-formatted string',
          'Reads a JSON file object and returns a Python dict',
          'Writes Python data to a JSON file',
          'Validates whether a string is valid JSON',
        ],
        correctAnswer: 1,
        explanation: 'json.load() reads a file object and returns the parsed Python dict or list.',
      },
      {
        question: 'What does **kwargs capture in a function?',
        options: [
          'Positional arguments as a list',
          'The first two keyword arguments only',
          'All extra keyword arguments as a dictionary',
          'Module import aliases',
        ],
        correctAnswer: 2,
        explanation: '**kwargs collects all extra keyword arguments passed to the function into a dict.',
      },
      {
        question: 'What does the "return" statement do in a function?',
        options: [
          'Prints the result to the terminal',
          'Exits the function and passes a value back to the caller',
          'Imports a value from another module',
          'Reads data from a file into a variable',
        ],
        correctAnswer: 1,
        explanation: '"return" exits the function immediately and sends the specified value back to whoever called it.',
      },
    ],
  },

  // ── 2 of 7 ────────────────────────────────────────────────────────────────
  {
    title:       'NumPy — Arrays, Broadcasting & Numerical Operations',
    slug:        'da-noob-18-numpy',
    description: 'Discover NumPy, the engine behind all scientific Python. Learn to create multi-dimensional arrays, slice data efficiently, broadcast operations, and compute statistics 100x faster than plain Python.',
    tier:        'NOOB' as const,
    orderIndex:  14,
    xpReward:    80,
    content: `# NumPy — Arrays, Broadcasting & Numerical Operations

## Why NumPy?

Python lists are flexible but slow for numbers. NumPy provides the \`ndarray\` — a strongly-typed, multi-dimensional array that is **10-100x faster** than native Python for numerical work. It is the foundation of Pandas, Matplotlib, SciPy, and scikit-learn.

---

## 1. Creating Arrays

\`\`\`python
import numpy as np

a = np.array([1, 2, 3, 4, 5])           # from Python list
b = np.zeros((3, 4))                     # 3×4 matrix of 0.0
c = np.ones((2, 3))                      # 2×3 matrix of 1.0
d = np.arange(0, 20, 2)                 # [0, 2, 4, 6, …, 18]
e = np.linspace(0, 1, 5)                # [0.0, 0.25, 0.5, 0.75, 1.0]
f = np.random.rand(3, 3)               # 3×3 uniform random [0, 1)
g = np.random.randint(1, 100, (4, 5))  # 4×5 random integers
\`\`\`

---

## 2. Shape, Reshape & Transpose

\`\`\`python
arr = np.arange(12)          # shape: (12,)
mat = arr.reshape(3, 4)      # shape: (3, 4)  — must have same total elements
flat = mat.flatten()         # back to 1-D
T    = mat.T                 # transpose: (4, 3)

print(mat.shape)             # (3, 4)
print(mat.ndim)              # 2
print(mat.size)              # 12  — total elements
\`\`\`

---

## 3. Indexing and Slicing

\`\`\`python
arr = np.array([10, 20, 30, 40, 50])
arr[0]          # 10        — first element
arr[-1]         # 50        — last element
arr[1:4]        # [20,30,40]
arr[::2]        # [10,30,50] — every second element

# 2-D arrays
m = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])

m[1, 2]         # 6         — row 1, col 2
m[:, 1]         # [2, 5, 8] — entire column 1
m[0, :]         # [1, 2, 3] — entire row 0
m[1:, 1:]       # bottom-right 2×2 sub-matrix
\`\`\`

---

## 4. Element-wise Operations

\`\`\`python
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

a + b           # [11, 22, 33, 44]
a * b           # [10, 40, 90, 160]
a ** 2          # [1, 4, 9, 16]
np.sqrt(a)      # [1.0, 1.41, 1.73, 2.0]
np.log(a)       # natural log of each element
np.exp(a)       # e^x for each element
\`\`\`

---

## 5. Aggregations

\`\`\`python
scores = np.array([85, 92, 78, 95, 67, 88])

np.mean(scores)     # 84.17
np.median(scores)   # 86.5
np.std(scores)      # 9.24  — population std
np.var(scores)      # 85.47
np.min(scores)      # 67
np.max(scores)      # 95
np.sum(scores)      # 505
np.argmax(scores)   # 3  — index of the maximum value
np.argsort(scores)  # indices that would sort the array
np.percentile(scores, 75)  # 75th percentile
\`\`\`

For 2-D arrays, specify an axis:
\`\`\`python
m = np.array([[1, 2, 3], [4, 5, 6]])
m.sum(axis=0)   # column sums: [5, 7, 9]
m.sum(axis=1)   # row sums:    [6, 15]
\`\`\`

---

## 6. Boolean Indexing

\`\`\`python
data = np.array([12, 45, 7, 89, 23, 56])

mask        = data > 30         # [F, T, F, T, F, T]
above_30    = data[mask]        # [45, 89, 56]

# Conditional replacement with np.where(condition, if_true, if_false)
cleaned = np.where(data > 50, data, 0)  # [0, 0, 0, 89, 0, 56]
\`\`\`

---

## 7. Broadcasting

Broadcasting lets you operate on arrays with different shapes without writing loops:

\`\`\`python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])

row = np.array([10, 20, 30])

result = matrix + row   # row is broadcast to every row of matrix
# [[11, 22, 33],
#  [14, 25, 36],
#  [17, 28, 39]]
\`\`\`

**Broadcasting rule:** dimensions are compatible when they are equal, or one of them is 1.

---

## 8. Normalisation and Standardisation

\`\`\`python
def min_max_normalize(arr):
    """Scale to [0, 1] range."""
    return (arr - arr.min()) / (arr.max() - arr.min())

def z_score_standardize(arr):
    """Zero mean, unit variance."""
    return (arr - arr.mean()) / arr.std()

prices = np.array([120, 450, 230, 89, 670])
print(min_max_normalize(prices))
print(z_score_standardize(prices))
\`\`\`

---

## Summary

| Task | NumPy Syntax |
|------|-------------|
| Create 1-D array | \`np.array([1, 2, 3])\` |
| Zeros matrix | \`np.zeros((rows, cols))\` |
| Range | \`np.arange(start, stop, step)\` |
| Even spacing | \`np.linspace(start, stop, n)\` |
| Reshape | \`arr.reshape(rows, cols)\` |
| Boolean filter | \`arr[arr > 5]\` |
| Conditional replace | \`np.where(cond, x, y)\` |
| Statistics | \`np.mean()\`, \`np.std()\`, \`np.median()\` |
| Index of max | \`np.argmax(arr)\` |
`,
    codeExample: `import numpy as np

# Simulate monthly sales data — 12 months, 4 regions
np.random.seed(42)
sales = np.random.randint(10_000, 80_000, size=(12, 4))
regions = ["North", "South", "East", "West"]

# Totals per region (column sum)
region_totals = sales.sum(axis=0)
print("Region totals:", dict(zip(regions, region_totals)))

# Best month per region (row index of max per column)
best_months = np.argmax(sales, axis=0) + 1   # +1 for human month numbering
print("Best month per region:", dict(zip(regions, best_months)))

# Normalize each region's sales to [0, 1]
normalized = (sales - sales.min(axis=0)) / (sales.max(axis=0) - sales.min(axis=0))
print("\\nNormalized (first 3 months, North):", normalized[:3, 0].round(2))

# Months where ALL regions exceeded 30 000
all_above_30k = np.all(sales > 30_000, axis=1)
print("\\nMonths where all regions > 30k:", np.where(all_above_30k)[0] + 1)`,
    quizzes: [
      {
        question: 'What does np.arange(0, 10, 2) produce?',
        options: [
          'Array [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]',
          'Array [0, 2, 4, 6, 8]',
          'Array [2, 4, 6, 8, 10]',
          'A 2-element array [0, 10]',
        ],
        correctAnswer: 1,
        explanation: 'arange(start, stop, step) generates values from 0 up to (not including) 10 in steps of 2.',
      },
      {
        question: 'How do you create a 3×4 matrix of zeros?',
        options: ['np.zeros(3, 4)', 'np.zeros((3, 4))', 'np.empty(3, 4)', 'np.array(zeros=12)'],
        correctAnswer: 1,
        explanation: 'np.zeros() takes a shape tuple — np.zeros((3, 4)) creates a 3-row, 4-column matrix.',
      },
      {
        question: 'What does arr.shape return for a 3×4 array?',
        options: ['12', '(3, 4)', '[3, 4]', 'shape(3, 4)'],
        correctAnswer: 1,
        explanation: 'The .shape attribute returns a tuple of dimensions: (rows, columns).',
      },
      {
        question: 'How do you select all elements greater than 10 from array arr?',
        options: ['arr.filter(10)', 'arr[arr > 10]', 'arr.where(arr > 10)', 'arr.select("> 10")'],
        correctAnswer: 1,
        explanation: 'Boolean indexing — a boolean mask is generated and applied to the array.',
      },
      {
        question: 'What is NumPy broadcasting?',
        options: [
          'Sending data to multiple computers simultaneously',
          'Automatically expanding a smaller array to match a larger array\'s shape for operations',
          'Converting data types between arrays',
          'Printing array contents to the terminal',
        ],
        correctAnswer: 1,
        explanation: 'Broadcasting lets NumPy perform operations on arrays of different shapes without explicit loops.',
      },
      {
        question: 'What does np.argmax(arr) return?',
        options: [
          'The maximum value in the array',
          'The index of the maximum value',
          'A boolean array of max positions',
          'The second largest value',
        ],
        correctAnswer: 1,
        explanation: 'np.argmax() returns the index (position) of the largest element, not the value itself.',
      },
      {
        question: 'What does np.where(arr > 5, arr, 0) produce?',
        options: [
          'The count of elements greater than 5',
          'Keeps arr values where > 5, replaces others with 0',
          'Removes all elements less than 5',
          'Returns indices of elements greater than 5',
        ],
        correctAnswer: 1,
        explanation: 'np.where(condition, value_if_true, value_if_false) applies element-wise conditional selection.',
      },
      {
        question: 'How do you access column 1 of a 2-D array m?',
        options: ['m[1]', 'm[:, 1]', 'm[1, :]', 'm.col(1)'],
        correctAnswer: 1,
        explanation: 'm[:, 1] means "all rows, column index 1" — the standard NumPy 2-D slice syntax.',
      },
      {
        question: 'What does arr.reshape(2, 6) do to a 12-element 1-D array?',
        options: [
          'Splits it into 2 separate arrays of 6 elements',
          'Rearranges it into a 2-row, 6-column 2-D matrix',
          'Pads it to length 12 with zeros',
          'Fails because the dimensions are incompatible',
        ],
        correctAnswer: 1,
        explanation: 'reshape() rearranges the data into a new shape; 2×6=12 elements, so it is compatible.',
      },
      {
        question: 'What does m.sum(axis=0) compute for a 2-D array?',
        options: [
          'Sum of all elements in the array',
          'Sum of each column (one value per column)',
          'Sum of each row (one value per row)',
          'The maximum value in each row',
        ],
        correctAnswer: 1,
        explanation: 'axis=0 collapses the row dimension — you get one sum per column (column-wise aggregation).',
      },
    ],
  },

  // ── 3 of 7 ────────────────────────────────────────────────────────────────
  {
    title:       'Pandas Advanced — Merging, Reshaping & GroupBy',
    slug:        'da-noob-19-pandas-advanced',
    description: 'Go beyond the basics: combine DataFrames with merge and concat, reshape data with pivot_table and melt, and unlock powerful multi-column GroupBy aggregations.',
    tier:        'NOOB' as const,
    orderIndex:  15,
    xpReward:    85,
    content: `# Pandas Advanced — Merging, Reshaping & GroupBy

## What You Will Learn

Most real datasets live in multiple tables that must be joined. Data often arrives in the wrong shape (too wide or too long). And analytical questions always require aggregation. This chapter covers the Pandas tools that handle all three.

---

## 1. Merging DataFrames (Joins)

\`pd.merge()\` combines two DataFrames on a common key — exactly like SQL JOINs.

\`\`\`python
import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3, 4],
    "name":        ["Alice", "Bob", "Carol", "Dave"],
})

orders = pd.DataFrame({
    "order_id":   [101, 102, 103],
    "customer_id": [1, 2, 1],
    "amount":     [150, 200, 90],
})

# Inner join — only customers with orders
inner = pd.merge(customers, orders, on="customer_id", how="inner")

# Left join — all customers, NaN if no order
left  = pd.merge(customers, orders, on="customer_id", how="left")
\`\`\`

| how | Result |
|-----|--------|
| \`inner\` | Rows that exist in BOTH tables |
| \`left\` | All rows from left, matched rows from right |
| \`right\` | All rows from right, matched rows from left |
| \`outer\` | All rows from both tables |

---

## 2. Concatenating DataFrames

\`pd.concat()\` stacks DataFrames vertically (rows) or horizontally (columns).

\`\`\`python
q1 = pd.DataFrame({"month": ["Jan","Feb","Mar"], "sales": [120,145,162]})
q2 = pd.DataFrame({"month": ["Apr","May","Jun"], "sales": [189,200,175]})

full_year = pd.concat([q1, q2], ignore_index=True)

# Stack side by side (same number of rows)
combined = pd.concat([df_A, df_B], axis=1)
\`\`\`

---

## 3. pivot_table — Summarise in Two Dimensions

\`\`\`python
sales = pd.DataFrame({
    "region":  ["North","North","South","South","East"],
    "product": ["A","B","A","B","A"],
    "revenue": [100,150,200,130,90],
    "units":   [10,15,20,13,9],
})

pivot = sales.pivot_table(
    values=["revenue","units"],
    index="region",
    columns="product",
    aggfunc="sum",
    fill_value=0,
)
\`\`\`

---

## 4. melt — Wide to Long (Unpivot)

\`\`\`python
wide = pd.DataFrame({
    "country": ["USA","UK"],
    "2022":    [100, 80],
    "2023":    [120, 95],
    "2024":    [135, 110],
})

long = pd.melt(wide, id_vars="country",
               var_name="year", value_name="sales")
\`\`\`

\`melt()\` is the inverse of \`pivot_table\` — it turns column headers into row values.

---

## 5. GroupBy with Multiple Aggregations

\`\`\`python
df = pd.read_csv("sales.csv")

# Single aggregation
monthly = df.groupby("month")["revenue"].sum()

# Multiple aggregations with .agg()
stats = df.groupby("region").agg(
    total_revenue=("revenue", "sum"),
    avg_order=("revenue", "mean"),
    num_orders=("order_id", "count"),
    max_sale=("revenue", "max"),
).reset_index()

# Group by multiple columns
by_region_product = (
    df.groupby(["region", "product"])["revenue"]
    .sum()
    .reset_index()
)
\`\`\`

---

## 6. apply() — Row/Column Custom Logic

\`\`\`python
# Apply a function to each row (axis=1)
def classify_sale(row):
    if row["revenue"] > 500:
        return "High"
    elif row["revenue"] > 200:
        return "Medium"
    return "Low"

df["tier"] = df.apply(classify_sale, axis=1)

# Apply a function to each column (axis=0)
df[["revenue", "cost"]].apply(lambda col: col - col.mean())
\`\`\`

---

## 7. String and Datetime Accessors

\`\`\`python
# .str accessor for string columns
df["name"] = df["name"].str.strip().str.title()
df["email_domain"] = df["email"].str.split("@").str[1]
mask = df["product"].str.contains("Pro", case=False)

# .dt accessor for datetime columns
df["date"] = pd.to_datetime(df["date"])
df["year"]  = df["date"].dt.year
df["month"] = df["date"].dt.month
df["day_of_week"] = df["date"].dt.day_name()
\`\`\`

---

## 8. Useful Tidying Operations

\`\`\`python
df.rename(columns={"old_name": "new_name"})   # rename columns
df.drop_duplicates(subset=["order_id"])         # remove duplicate rows
df.sort_values("revenue", ascending=False)      # sort
df.query("region == 'North' and revenue > 100") # filter with query string
df.assign(profit=df["revenue"] - df["cost"])    # add computed column
\`\`\`

---

## Summary

| Operation | Function |
|-----------|---------|
| Join tables | \`pd.merge(left, right, on="key", how="inner")\` |
| Stack rows | \`pd.concat([df1, df2], ignore_index=True)\` |
| Cross-tab summary | \`df.pivot_table(values, index, columns, aggfunc)\` |
| Wide → long | \`pd.melt(df, id_vars, var_name, value_name)\` |
| Group & aggregate | \`df.groupby("col").agg({...})\` |
| Row-wise function | \`df.apply(func, axis=1)\` |
| String operations | \`df["col"].str.upper()\` |
| Date parts | \`df["col"].dt.year\` |
`,
    codeExample: `import pandas as pd

# --- Sample data: orders and products ---
orders = pd.DataFrame({
    "order_id":   [1, 2, 3, 4, 5, 6],
    "product_id": [101, 102, 101, 103, 102, 103],
    "region":     ["North","South","North","East","East","South"],
    "revenue":    [250, 180, 310, 420, 95, 530],
    "date":       pd.to_datetime(["2024-01-15","2024-01-22","2024-02-10",
                                  "2024-02-18","2024-03-05","2024-03-20"]),
})

products = pd.DataFrame({
    "product_id":   [101, 102, 103],
    "product_name": ["Analytics Pro", "Dashboard Lite", "Data Studio"],
})

# 1. Enrich orders with product names
df = pd.merge(orders, products, on="product_id", how="left")

# 2. Add month column
df["month"] = df["date"].dt.strftime("%Y-%m")

# 3. Revenue by region and product
pivot = df.pivot_table(
    values="revenue", index="region",
    columns="product_name", aggfunc="sum", fill_value=0
)
print("Revenue by Region × Product:")
print(pivot)

# 4. Monthly summary
monthly = df.groupby("month").agg(
    total_revenue=("revenue", "sum"),
    num_orders=("order_id", "count"),
    avg_order=("revenue", "mean"),
).round(2)
print("\\nMonthly Summary:")
print(monthly)`,
    quizzes: [
      {
        question: 'What does pd.merge(left, right, on="id", how="left") return?',
        options: [
          'Only rows that exist in both DataFrames',
          'All rows from left, with NaN where right has no match',
          'All rows from right, with NaN where left has no match',
          'Only rows that exist in neither DataFrame',
        ],
        correctAnswer: 1,
        explanation: 'A left join keeps all rows from the left DataFrame and fills NaN where the right has no matching key.',
      },
      {
        question: 'What does pd.concat([df1, df2], ignore_index=True) do?',
        options: [
          'Joins df1 and df2 on a common column',
          'Stacks df2 rows below df1 and resets the row index',
          'Merges column-by-column',
          'Creates a pivot table from two DataFrames',
        ],
        correctAnswer: 1,
        explanation: 'pd.concat() with ignore_index=True stacks DataFrames vertically and resets the index to 0, 1, 2…',
      },
      {
        question: 'What does df.pivot_table(values="revenue", index="region", columns="product", aggfunc="sum") create?',
        options: [
          'A bar chart of revenue by region',
          'A 2-D summary table of total revenue for each region-product combination',
          'A long-format list of revenue values',
          'A new column called "revenue"',
        ],
        correctAnswer: 1,
        explanation: 'pivot_table creates a cross-tabulation — regions as rows, products as columns, summed revenue as values.',
      },
      {
        question: 'What is pd.melt() used for?',
        options: [
          'Combining two DataFrames by column',
          'Converting a wide DataFrame into a long (tidy) format',
          'Filling missing values with the column mean',
          'Sorting rows by multiple columns',
        ],
        correctAnswer: 1,
        explanation: 'melt() "unpivots" a wide DataFrame — column headers become row values in a new variable column.',
      },
      {
        question: 'How do you compute multiple aggregations in one groupby call?',
        options: [
          'df.groupby("col").multi(["sum","mean"])',
          'df.groupby("col").agg({"revenue": "sum", "orders": "count"})',
          'df.groupby("col").apply(["sum","mean"])',
          'df.groupby("col").pivot(aggfunc="sum")',
        ],
        correctAnswer: 1,
        explanation: '.agg() accepts a dict mapping column names to aggregation functions for multiple simultaneous aggregations.',
      },
      {
        question: 'What does df.apply(func, axis=1) do?',
        options: [
          'Applies func to each column',
          'Applies func to each row',
          'Applies func to the entire DataFrame at once',
          'Applies func only to numeric columns',
        ],
        correctAnswer: 1,
        explanation: 'axis=1 means "for each row" — the function receives the full row as a Series.',
      },
      {
        question: 'How do you extract the year from a datetime column "date"?',
        options: ['df["date"].year', 'df["date"].dt.year', 'df.year("date")', 'datetime.year(df["date"])'],
        correctAnswer: 1,
        explanation: 'The .dt accessor exposes datetime attributes like .dt.year, .dt.month, .dt.day on a Series.',
      },
      {
        question: 'What does df["name"].str.strip().str.title() do?',
        options: [
          'Removes the name column and adds a title column',
          'Trims whitespace then capitalises each word in the name',
          'Counts characters in the name column',
          'Converts name to all uppercase',
        ],
        correctAnswer: 1,
        explanation: '.str accessor chains string methods: strip() removes leading/trailing spaces, title() capitalises each word.',
      },
      {
        question: 'What does df.drop_duplicates(subset=["order_id"]) do?',
        options: [
          'Removes rows where order_id is null',
          'Keeps only the first occurrence of each unique order_id',
          'Removes the order_id column entirely',
          'Sorts rows by order_id',
        ],
        correctAnswer: 1,
        explanation: 'drop_duplicates with a subset keeps the first row for each unique value of order_id and removes the rest.',
      },
      {
        question: 'What does the "how" parameter in pd.merge() control?',
        options: [
          'The column used as the join key',
          'Which rows from each DataFrame to include in the result',
          'Whether to sort the result after merging',
          'The aggregation function applied after joining',
        ],
        correctAnswer: 1,
        explanation: '"how" determines the join type: inner, left, right, or outer — exactly like SQL JOIN types.',
      },
    ],
  },

  // ── 4 of 7 ────────────────────────────────────────────────────────────────
  {
    title:       'Exploratory Data Analysis (EDA) — The Complete Workflow',
    slug:        'da-noob-20-eda',
    description: 'Learn the step-by-step EDA framework every data analyst uses: understanding structure, finding missing values, detecting outliers, visualising distributions, and uncovering relationships — before any modelling or reporting.',
    tier:        'NOOB' as const,
    orderIndex:  16,
    xpReward:    90,
    content: `# Exploratory Data Analysis (EDA) — The Complete Workflow

## What is EDA?

EDA is the process of *understanding your data before drawing any conclusions*. Pioneered by statistician John Tukey, it involves summarising, visualising, and questioning the dataset to uncover structure, anomalies, patterns, and assumptions.

**Why EDA first?** Because every downstream decision — cleaning, feature engineering, modelling — depends on what you find here.

---

## The 6-Step EDA Framework

### Step 1 — Understand the Structure

\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv("customers.csv")

df.shape          # (rows, columns)
df.dtypes         # data type of each column
df.head(5)        # first 5 rows
df.tail(5)        # last 5 rows
df.info()         # non-null counts + dtypes
df.columns.tolist()  # column names as list
\`\`\`

Questions to answer:
- How many rows and columns?
- What are the column names and types?
- Do types match what you expect (dates as strings? categories as ints)?

---

### Step 2 — Analyse Missing Values

\`\`\`python
# Count missing values per column
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)

missing_report = pd.DataFrame({
    "missing_count": missing,
    "missing_pct":   missing_pct,
}).query("missing_count > 0").sort_values("missing_pct", ascending=False)

print(missing_report)
\`\`\`

**Decision guide:**
- < 5% missing → safe to drop rows or impute with median/mode
- 5–30% missing → impute carefully, note in documentation
- > 30% missing → consider dropping the column or using ML imputation

---

### Step 3 — Univariate Analysis (One Variable at a Time)

\`\`\`python
import matplotlib.pyplot as plt

# Numeric summary
df["age"].describe()
# count, mean, std, min, 25%, 50%, 75%, max

# Distribution — histogram
df["revenue"].hist(bins=30, figsize=(8, 4))
plt.title("Revenue Distribution")
plt.xlabel("Revenue")
plt.show()

# Categorical counts
df["region"].value_counts().plot(kind="bar")
\`\`\`

---

### Step 4 — Outlier Detection

**IQR Method:**
\`\`\`python
Q1  = df["revenue"].quantile(0.25)
Q3  = df["revenue"].quantile(0.75)
IQR = Q3 - Q1

lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

outliers = df[(df["revenue"] < lower) | (df["revenue"] > upper)]
print(f"Outliers found: {len(outliers)}")
\`\`\`

**Z-Score Method:**
\`\`\`python
from scipy import stats
z_scores = np.abs(stats.zscore(df["revenue"].dropna()))
outliers  = df[z_scores > 3]  # more than 3 standard deviations from mean
\`\`\`

---

### Step 5 — Bivariate Analysis (Relationships)

\`\`\`python
import seaborn as sns

# Scatter plot: two numeric variables
sns.scatterplot(data=df, x="age", y="revenue", hue="region")
plt.show()

# Box plot: numeric by category
sns.boxplot(data=df, x="region", y="revenue")
plt.show()

# Correlation heatmap
corr = df.select_dtypes("number").corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
plt.show()
\`\`\`

---

### Step 6 — Correlation Analysis

\`\`\`python
corr = df.select_dtypes("number").corr()

# Find highly correlated pairs
import itertools
high_corr = []
for col1, col2 in itertools.combinations(corr.columns, 2):
    val = corr.loc[col1, col2]
    if abs(val) > 0.7:
        high_corr.append((col1, col2, round(val, 2)))

print("High correlations:", high_corr)
\`\`\`

---

## Interpreting What You Find

| Finding | Possible Action |
|---------|----------------|
| High missing % in column | Drop column or advanced imputation |
| Severe right skew | Log-transform before modelling |
| Outliers present | Investigate — data error or real signal? |
| High correlation (> 0.9) | Potential multicollinearity — check if both needed |
| Categorical imbalance | Note for modelling; may need resampling |

---

## EDA Template

Every EDA should answer these questions before you move on:
1. What does each column represent?
2. What is the shape and quality of the data?
3. Are there missing values — where and how many?
4. What does the distribution of each variable look like?
5. Are there outliers — are they errors or real extremes?
6. Which variables correlate strongly?
7. What surprises did you find?

---

## Summary

EDA is not a step you rush. A thorough EDA takes 20-30% of total project time and prevents costly mistakes downstream. Document every finding with code, plots, and written observations.
`,
    codeExample: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def full_eda(df, target_col=None):
    """Run a standard EDA report on a DataFrame."""

    print("=" * 50)
    print("1. STRUCTURE")
    print(f"   Shape: {df.shape[0]} rows × {df.shape[1]} columns")
    print(f"   Dtypes:\\n{df.dtypes.value_counts().to_string()}")

    print("\\n2. MISSING VALUES")
    miss = df.isnull().sum()
    miss = miss[miss > 0]
    if miss.empty:
        print("   No missing values!")
    else:
        pct = (miss / len(df) * 100).round(1)
        print(pd.concat([miss, pct], axis=1, keys=["count", "%"]).to_string())

    print("\\n3. NUMERIC SUMMARY")
    print(df.describe().round(2).to_string())

    print("\\n4. OUTLIERS (IQR method)")
    for col in df.select_dtypes("number").columns:
        Q1, Q3 = df[col].quantile([0.25, 0.75])
        IQR = Q3 - Q1
        n_out = ((df[col] < Q1 - 1.5*IQR) | (df[col] > Q3 + 1.5*IQR)).sum()
        if n_out > 0:
            print(f"   {col}: {n_out} outliers")

    if target_col and target_col in df.columns:
        print(f"\\n5. CORRELATIONS WITH '{target_col}'")
        corrs = df.select_dtypes("number").corr()[target_col].drop(target_col)
        print(corrs.sort_values(ascending=False).round(3).to_string())

# Usage example
# df = pd.read_csv("sales.csv")
# full_eda(df, target_col="revenue")`,
    quizzes: [
      {
        question: 'What does df.info() show?',
        options: [
          'Statistical summary with mean, std, min and max',
          'Column names, data types, and non-null counts for each column',
          'The first five rows of the DataFrame',
          'A bar chart of column value counts',
        ],
        correctAnswer: 1,
        explanation: 'df.info() prints a concise summary: index dtype, column names, non-null counts, and memory usage.',
      },
      {
        question: 'How do you count missing values per column?',
        options: [
          'df.missing()',
          'df.isnull().sum()',
          'df.count_nulls()',
          'df.na.count()',
        ],
        correctAnswer: 1,
        explanation: 'df.isnull() creates a boolean mask; .sum() then counts True values (missing) per column.',
      },
      {
        question: 'In the IQR outlier detection method, outliers are values…',
        options: [
          'More than 2 standard deviations from the mean',
          'Below Q1 − 1.5×IQR or above Q3 + 1.5×IQR',
          'In the bottom or top 5% of the distribution',
          'Below the minimum or above the maximum',
        ],
        correctAnswer: 1,
        explanation: 'The Tukey fence method defines outliers as values beyond 1.5 × IQR from the first or third quartile.',
      },
      {
        question: 'What does df.describe() return?',
        options: [
          'A text description of each column\'s purpose',
          'Statistical summary: count, mean, std, min, quartiles, max for numeric columns',
          'The data type of each column',
          'The number of unique values per column',
        ],
        correctAnswer: 1,
        explanation: 'describe() computes the 8-number summary (count, mean, std, min, 25%, 50%, 75%, max) for all numeric columns.',
      },
      {
        question: 'What visualisation best shows the distribution of a single numeric variable?',
        options: ['Scatter plot', 'Correlation heatmap', 'Histogram or box plot', 'Bar chart of categories'],
        correctAnswer: 2,
        explanation: 'Histograms show frequency distributions; box plots show median, quartiles, and outliers for a single variable.',
      },
      {
        question: 'What is a correlation heatmap used for in EDA?',
        options: [
          'Showing the geographic distribution of values',
          'Visualising pairwise correlations between numeric columns',
          'Comparing the means of two groups',
          'Plotting time-series trends',
        ],
        correctAnswer: 1,
        explanation: 'A correlation heatmap shows df.corr() results as a coloured grid — easy to spot strong/weak relationships.',
      },
      {
        question: 'What does value_counts() do?',
        options: [
          'Returns the number of columns',
          'Counts the frequency of each unique value in a Series',
          'Counts non-null values across all columns',
          'Returns the sum of each numeric column',
        ],
        correctAnswer: 1,
        explanation: 'value_counts() returns a Series sorted by frequency — ideal for understanding categorical distributions.',
      },
      {
        question: 'If a column has 40% missing values, what is the best immediate action?',
        options: [
          'Fill all missing values with zero',
          'Investigate the cause; consider dropping the column or using advanced imputation',
          'Ignore it — pandas handles nulls automatically',
          'Replace with the column maximum',
        ],
        correctAnswer: 1,
        explanation: 'High missingness (>30%) usually signals data quality issues; investigate before blindly imputing.',
      },
      {
        question: 'What does df.select_dtypes("number").corr() compute?',
        options: [
          'Number of numeric columns',
          'Pairwise Pearson correlations between all numeric columns',
          'Standard deviation of each numeric column',
          'Percentage of numeric vs categorical columns',
        ],
        correctAnswer: 1,
        explanation: 'select_dtypes filters to numeric columns; .corr() computes the pairwise Pearson correlation matrix.',
      },
      {
        question: 'What is the primary goal of EDA?',
        options: [
          'To train a machine learning model',
          'To understand the data\'s structure, quality, and patterns before analysis',
          'To create a final business presentation',
          'To write SQL queries against a database',
        ],
        correctAnswer: 1,
        explanation: 'EDA is about understanding the data first — its shape, quality, distributions, and relationships — before drawing conclusions.',
      },
    ],
  },

  // ── 5 of 7 ────────────────────────────────────────────────────────────────
  {
    title:       'Probability & Statistical Distributions',
    slug:        'da-noob-21-probability',
    description: 'Build the mathematical intuition behind data analytics: probability rules, conditional probability, the Normal/Binomial/Poisson distributions, the Central Limit Theorem, and why all of these matter when you interpret real data.',
    tier:        'NOOB' as const,
    orderIndex:  17,
    xpReward:    85,
    content: `# Probability & Statistical Distributions

## Why Probability Matters for Analysts

Every A/B test, confidence interval, and anomaly alert is built on probability. Without this foundation you can read dashboards but cannot reason about uncertainty — and in data analytics, uncertainty is everywhere.

---

## 1. Probability Basics

**Probability** is a number between 0 and 1 that measures how likely an event is:
- P = 0 → impossible
- P = 1 → certain
- P = 0.5 → equally likely either way

**Sample space (Ω):** all possible outcomes.

\`\`\`python
# Rolling a fair six-sided die
outcomes = [1, 2, 3, 4, 5, 6]
P_rolling_a_4 = 1 / 6            # ≈ 0.167
P_rolling_even = 3 / 6           # = 0.5
P_rolling_gt_4 = 2 / 6           # ≈ 0.333
\`\`\`

### Addition Rule
P(A or B) = P(A) + P(B) − P(A and B)

For *mutually exclusive* events (can't both happen):
P(A or B) = P(A) + P(B)

### Multiplication Rule (Independent Events)
P(A and B) = P(A) × P(B)

---

## 2. Conditional Probability

P(A | B) = "probability of A **given** that B has already happened"

\`\`\`
P(A | B) = P(A and B) / P(B)
\`\`\`

**Example:** 30% of users click an ad (event A). Of those who click, 20% purchase (event B|A).
- P(click) = 0.30
- P(purchase | click) = 0.20
- P(click and purchase) = 0.30 × 0.20 = **0.06** (6% of all users)

---

## 3. Bayes' Theorem (Intuition)

Bayes' theorem lets you *update your belief* given new evidence:

\`\`\`
P(A | B) = P(B | A) × P(A) / P(B)
\`\`\`

Real-world use: spam filters update the probability that an email is spam given the words it contains.

---

## 4. Key Probability Distributions

### Normal Distribution (Bell Curve)
The most important distribution in statistics — many natural measurements approximate it.
- Defined by **mean (μ)** and **standard deviation (σ)**
- Symmetric around the mean
- 68-95-99.7 rule: 68% of data falls within ±1σ, 95% within ±2σ, 99.7% within ±3σ

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

x = np.linspace(-4, 4, 300)
plt.plot(x, stats.norm.pdf(x, loc=0, scale=1))
plt.title("Standard Normal Distribution (μ=0, σ=1)")
plt.show()
\`\`\`

### Binomial Distribution
Models the number of successes in **n** independent trials, each with probability **p**.

\`\`\`python
# P(exactly 3 heads in 10 coin flips)
from scipy.stats import binom
P = binom.pmf(k=3, n=10, p=0.5)   # ≈ 0.117
\`\`\`

Use cases: A/B test click-through, defect rates, survey responses (yes/no).

### Poisson Distribution
Models the number of events occurring in a **fixed interval** when events happen at a known average rate.

\`\`\`python
from scipy.stats import poisson

# Average 5 support tickets per hour.
# Probability of exactly 8 tickets in one hour?
P = poisson.pmf(k=8, mu=5)  # ≈ 0.065
\`\`\`

Use cases: website requests per second, customer arrivals, rare event counts.

---

## 5. Central Limit Theorem (CLT)

**The most important theorem in statistics for analysts:**

> If you take sufficiently large random samples from *any* population (regardless of its distribution), the distribution of the **sample means** will be approximately **Normal**.

In practice: samples of n ≥ 30 are usually sufficient.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Skewed population: exponential distribution
population = np.random.exponential(scale=2, size=100_000)

# Draw 1 000 samples of size 50 and compute means
sample_means = [np.mean(np.random.choice(population, 50)) for _ in range(1_000)]

plt.hist(sample_means, bins=40)
plt.title("CLT: Sample Means Approach Normal Distribution")
plt.show()
\`\`\`

---

## 6. Confidence Intervals (Intuition)

A 95% confidence interval (CI) means: if you repeated the experiment 100 times, ~95 of the resulting intervals would contain the true population parameter.

\`\`\`python
from scipy import stats

sample = [23, 25, 28, 22, 26, 30, 24, 27]
mean   = np.mean(sample)
ci     = stats.t.interval(0.95, df=len(sample)-1,
                           loc=mean,
                           scale=stats.sem(sample))
print(f"Mean: {mean:.2f}, 95% CI: ({ci[0]:.2f}, {ci[1]:.2f})")
\`\`\`

---

## 7. p-values (Basic Intuition)

A **p-value** is the probability of observing your data (or something more extreme) if the null hypothesis were true.

- p < 0.05 → the result is "statistically significant" at the 5% level
- p ≥ 0.05 → fail to reject the null hypothesis
- p-value is NOT the probability that the null hypothesis is true

---

## Summary

| Concept | Key Formula / Insight |
|---------|----------------------|
| Basic probability | 0 ≤ P(A) ≤ 1 |
| Independent events | P(A and B) = P(A) × P(B) |
| Conditional probability | P(A\|B) = P(A∩B) / P(B) |
| Normal dist. | Defined by μ and σ, 68-95-99.7 rule |
| Binomial dist. | Fixed n trials, probability p per trial |
| Poisson dist. | Count of events in fixed interval |
| CLT | Sample means → Normal for large n |
| Confidence interval | Range likely containing true parameter |
| p-value | How surprising is this result under H₀? |
`,
    codeExample: `import numpy as np
from scipy import stats

# ── A/B Test probability example ──────────────────────────────────────────
# Version A: 200 visitors, 24 conversions
# Version B: 200 visitors, 36 conversions

n_a, conv_a = 200, 24
n_b, conv_b = 200, 36

rate_a = conv_a / n_a   # 0.12 = 12%
rate_b = conv_b / n_b   # 0.18 = 18%

print(f"Conversion rate A: {rate_a:.1%}")
print(f"Conversion rate B: {rate_b:.1%}")
print(f"Relative lift:     {(rate_b - rate_a) / rate_a:.1%}")

# ── Confidence intervals for each rate ────────────────────────────────────
ci_a = stats.binom.interval(0.95, n=n_a, p=rate_a)
ci_b = stats.binom.interval(0.95, n=n_b, p=rate_b)
print(f"\\n95% CI for A: {ci_a[0]/n_a:.1%} – {ci_a[1]/n_a:.1%}")
print(f"95% CI for B: {ci_b[0]/n_b:.1%} – {ci_b[1]/n_b:.1%}")

# ── Two-proportion z-test ──────────────────────────────────────────────────
p_pool = (conv_a + conv_b) / (n_a + n_b)
se     = np.sqrt(p_pool * (1 - p_pool) * (1/n_a + 1/n_b))
z_stat = (rate_b - rate_a) / se
p_val  = 1 - stats.norm.cdf(z_stat)   # one-tailed

print(f"\\nZ-statistic: {z_stat:.3f}")
print(f"p-value:     {p_val:.4f}")
print("Significant (p<0.05):", p_val < 0.05)`,
    quizzes: [
      {
        question: 'What is probability?',
        options: [
          'A count of how many times an event occurred',
          'A number between 0 and 1 measuring how likely an event is',
          'The average of a dataset',
          'The range between the minimum and maximum values',
        ],
        correctAnswer: 1,
        explanation: 'Probability is always between 0 (impossible) and 1 (certain), measuring likelihood.',
      },
      {
        question: 'If P(A)=0.4 and P(B)=0.3 and they are independent, what is P(A and B)?',
        options: ['0.7', '0.12', '0.1', '0.04'],
        correctAnswer: 1,
        explanation: 'For independent events, P(A and B) = P(A) × P(B) = 0.4 × 0.3 = 0.12.',
      },
      {
        question: 'What does conditional probability P(A | B) mean?',
        options: [
          'The probability of A and B both occurring simultaneously',
          'The probability of A given that B has already occurred',
          'The probability of A minus the probability of B',
          'The probability that A causes B',
        ],
        correctAnswer: 1,
        explanation: 'P(A|B) is the probability of event A under the assumption that B is known to have occurred.',
      },
      {
        question: 'Which distribution models the number of successes in a fixed number of independent trials?',
        options: ['Normal distribution', 'Binomial distribution', 'Poisson distribution', 'Exponential distribution'],
        correctAnswer: 1,
        explanation: 'The Binomial distribution counts successes in n trials each with probability p.',
      },
      {
        question: 'Which distribution is best for modelling the number of customer support tickets per hour?',
        options: ['Binomial', 'Normal', 'Poisson', 'Uniform'],
        correctAnswer: 2,
        explanation: 'Poisson models the count of rare, independent events in a fixed time interval at a known average rate.',
      },
      {
        question: 'What does the Central Limit Theorem state?',
        options: [
          'All populations are normally distributed',
          'Sample means approach a Normal distribution as sample size grows',
          'The mean equals the median in any distribution',
          'Outliers always follow a Poisson distribution',
        ],
        correctAnswer: 1,
        explanation: 'CLT: regardless of the population distribution, the distribution of sample means is approximately Normal for large n.',
      },
      {
        question: 'What does the 68-95-99.7 rule describe about the Normal distribution?',
        options: [
          'The percentiles at which outliers occur',
          'The percentage of data within 1σ, 2σ, and 3σ of the mean',
          'The sample sizes needed for CLT to apply',
          'The confidence levels used in hypothesis testing',
        ],
        correctAnswer: 1,
        explanation: '68% of data falls within ±1σ, 95% within ±2σ, and 99.7% within ±3σ of the mean.',
      },
      {
        question: 'A 95% confidence interval for a sample mean means…',
        options: [
          '95% of individual data points fall inside the interval',
          'If the experiment were repeated many times, ~95% of such intervals would contain the true mean',
          'There is a 95% chance the null hypothesis is false',
          'The estimate is 95% accurate',
        ],
        correctAnswer: 1,
        explanation: 'A CI is about the procedure: 95% of CIs built this way contain the true parameter — not a probability about the specific interval.',
      },
      {
        question: 'What does a p-value < 0.05 indicate?',
        options: [
          'The null hypothesis is definitively false',
          'The result is statistically significant at the 5% level',
          'There is a 95% chance the alternative hypothesis is true',
          'The effect size is large',
        ],
        correctAnswer: 1,
        explanation: 'p < 0.05 means the result is unlikely under H₀ (by convention). It does not prove H₀ is false.',
      },
      {
        question: 'The Normal distribution is fully defined by…',
        options: [
          'Minimum and maximum values',
          'Mean (μ) and standard deviation (σ)',
          'Sample size and variance',
          'Median and interquartile range',
        ],
        correctAnswer: 1,
        explanation: 'The Normal distribution\'s shape is completely determined by its mean (centre) and standard deviation (spread).',
      },
    ],
  },

  // ── 6 of 7 ────────────────────────────────────────────────────────────────
  {
    title:       'Correlation, Causation & Simple Linear Regression',
    slug:        'da-noob-22-regression',
    description: 'Understand the critical difference between correlation and causation, measure the strength of relationships with Pearson\'s r, and build your first predictive model with simple linear regression.',
    tier:        'NOOB' as const,
    orderIndex:  18,
    xpReward:    85,
    content: `# Correlation, Causation & Simple Linear Regression

## The Most Important Distinction in Data Analytics

**Correlation ≠ Causation.**

Ice cream sales and drowning rates are highly correlated — but eating ice cream does not cause drowning. Both are caused by a third variable: hot weather. This "confounding variable" problem is everywhere in data, and missing it leads to catastrophically wrong decisions.

---

## 1. Correlation — Measuring Relationships

The **Pearson correlation coefficient (r)** measures the linear relationship between two variables:

\`\`\`
r = Σ[(xᵢ − x̄)(yᵢ − ȳ)] / √[Σ(xᵢ − x̄)² × Σ(yᵢ − ȳ)²]
\`\`\`

**Range:** −1 ≤ r ≤ +1

| r value | Interpretation |
|---------|---------------|
| +0.9 to +1.0 | Very strong positive relationship |
| +0.7 to +0.9 | Strong positive |
| +0.4 to +0.7 | Moderate positive |
| −0.4 to +0.4 | Weak or no linear relationship |
| −0.7 to −0.4 | Moderate negative |
| −1.0 to −0.7 | Strong negative |

\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv("sales.csv")

r = df["marketing_spend"].corr(df["revenue"])
print(f"Pearson r = {r:.3f}")

# Full correlation matrix
corr_matrix = df.select_dtypes("number").corr()
\`\`\`

---

## 2. Visualising Correlation

\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns

# Scatter plot
sns.scatterplot(data=df, x="marketing_spend", y="revenue")
plt.title(f"Marketing Spend vs Revenue (r = {r:.2f})")
plt.show()

# Heatmap for multiple variables
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f", center=0)
plt.title("Correlation Heatmap")
plt.show()
\`\`\`

---

## 3. Spurious Correlations

Famous spurious correlations:
- Nicolas Cage films per year ↔ pool drownings (r > 0.9!)
- Per capita cheese consumption ↔ deaths by tangled bedsheets

Always ask: **Is there a plausible causal mechanism, or could a third variable explain this?**

---

## 4. Simple Linear Regression

Regression goes further than correlation — it builds a **predictive model**:

\`\`\`
ŷ = β₀ + β₁x
\`\`\`

Where:
- **ŷ** — predicted value of y
- **β₀** — intercept (value of y when x = 0)
- **β₁** — slope (how much y changes per unit increase in x)
- **x** — predictor (independent variable)
- **y** — outcome (dependent variable)

---

## 5. Fitting a Regression in Python

\`\`\`python
from sklearn.linear_model import LinearRegression
import numpy as np

X = df[["marketing_spend"]].values   # 2-D array required
y = df["revenue"].values

model = LinearRegression()
model.fit(X, y)

intercept = model.intercept_         # β₀
slope     = model.coef_[0]           # β₁

print(f"Model: revenue = {intercept:.2f} + {slope:.4f} × marketing_spend")

# Predict
new_spend = np.array([[15_000]])
predicted = model.predict(new_spend)
print(f"Predicted revenue at $15k spend: \${predicted[0]:,.0f}")
\`\`\`

---

## 6. Evaluating Model Quality — R²

**R-squared (R²)** tells you the proportion of variance in y explained by x:
- R² = 1.0 → perfect fit (rare and suspicious)
- R² = 0.85 → model explains 85% of variance
- R² = 0.1 → weak model — other factors dominate

\`\`\`python
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

y_pred = model.predict(X)

r2  = r2_score(y, y_pred)
mae = mean_absolute_error(y, y_pred)
rmse = np.sqrt(mean_squared_error(y, y_pred))

print(f"R²   = {r2:.3f}")
print(f"MAE  = \${mae:,.0f}")
print(f"RMSE = \${rmse:,.0f}")
\`\`\`

---

## 7. Residuals — The Story the Model Missed

Residuals = actual − predicted values. Analysing them reveals model problems:

\`\`\`python
residuals = y - y_pred

plt.scatter(y_pred, residuals, alpha=0.5)
plt.axhline(0, color="red", linestyle="--")
plt.xlabel("Predicted values")
plt.ylabel("Residuals")
plt.title("Residual Plot — should look like random scatter")
plt.show()
\`\`\`

**What good residuals look like:** random scatter around zero, no patterns.
**Red flags:** curves (non-linear relationship), fan shapes (heteroscedasticity).

---

## 8. Key Assumptions of Linear Regression

1. **Linearity** — true relationship between X and y is linear
2. **Independence** — observations are independent
3. **Homoscedasticity** — constant variance of residuals
4. **Normality of residuals** — residuals approximately Normal

Always check these before trusting your model.

---

## Summary

| Concept | Key Point |
|---------|----------|
| Pearson r | −1 to +1; measures linear strength |
| r = 0 | No *linear* relationship (could still be non-linear) |
| Correlation ≠ Causation | Always check for confounders |
| Simple linear regression | ŷ = β₀ + β₁x |
| R² | % of variance in y explained by x |
| Residuals | Actual − predicted; should be random |
`,
    codeExample: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error

np.random.seed(42)

# Simulate marketing spend → revenue data
marketing_spend = np.linspace(1000, 50000, 80)
revenue = 20000 + 3.5 * marketing_spend + np.random.normal(0, 8000, 80)

df = pd.DataFrame({"marketing_spend": marketing_spend, "revenue": revenue})

# Pearson correlation
r = df["marketing_spend"].corr(df["revenue"])
print(f"Pearson r = {r:.3f}")

# Fit linear regression
X = df[["marketing_spend"]].values
y = df["revenue"].values

model = LinearRegression().fit(X, y)
y_pred = model.predict(X)

print(f"\\nModel: revenue = {model.intercept_:,.0f} + {model.coef_[0]:.4f} x spend")
print(f"R²   = {r2_score(y, y_pred):.3f}")
print(f"MAE  = \${mean_absolute_error(y, y_pred):,.0f}")

# Plot
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].scatter(df["marketing_spend"], df["revenue"], alpha=0.6)
axes[0].plot(df["marketing_spend"], y_pred, "r-", linewidth=2)
axes[0].set_title(f"Regression Line  (r={r:.2f}, R²={r2_score(y, y_pred):.2f})")

residuals = y - y_pred
axes[1].scatter(y_pred, residuals, alpha=0.6)
axes[1].axhline(0, color="red", linestyle="--")
axes[1].set_title("Residual Plot")

plt.tight_layout()
plt.show()`,
    quizzes: [
      {
        question: 'What range does the Pearson correlation coefficient r fall within?',
        options: ['0 to 1', '−1 to +1', '−100 to +100', '0 to 100'],
        correctAnswer: 1,
        explanation: 'Pearson r is always between −1 (perfect negative) and +1 (perfect positive), with 0 indicating no linear relationship.',
      },
      {
        question: 'An r value of −0.85 indicates…',
        options: [
          'A weak positive relationship',
          'A strong negative linear relationship',
          'No meaningful relationship',
          'A perfect negative relationship',
        ],
        correctAnswer: 1,
        explanation: '−0.85 is a strong negative correlation: as one variable increases, the other reliably decreases.',
      },
      {
        question: 'What does "correlation ≠ causation" mean?',
        options: [
          'Variables that are correlated can never be causally linked',
          'Two variables can move together without one causing the other',
          'Correlation is always weaker than causation',
          'Causation requires r > 0.95',
        ],
        correctAnswer: 1,
        explanation: 'Correlation can be driven by a third confounding variable — a causal link requires controlled experiments or strong domain reasoning.',
      },
      {
        question: 'In simple linear regression ŷ = β₀ + β₁x, what does β₁ represent?',
        options: [
          'The predicted value of y when x = 0',
          'The slope — how much ŷ changes per unit increase in x',
          'The correlation coefficient between x and y',
          'The error term for each prediction',
        ],
        correctAnswer: 1,
        explanation: 'β₁ (the slope/coefficient) tells you by how many units y increases for each 1-unit increase in x.',
      },
      {
        question: 'What does R² = 0.78 mean?',
        options: [
          'The model is 78% accurate on all data points',
          'The model explains 78% of the variance in y',
          'The Pearson r is 0.78',
          '78% of predictions are within the confidence interval',
        ],
        correctAnswer: 1,
        explanation: 'R² (coefficient of determination) is the proportion of variance in y that the model accounts for.',
      },
      {
        question: 'What are residuals in linear regression?',
        options: [
          'The coefficients that are not statistically significant',
          'The differences between actual and predicted values',
          'The variables excluded from the model',
          'Rows removed during data cleaning',
        ],
        correctAnswer: 1,
        explanation: 'Residuals = actual y − predicted ŷ. Analysing them reveals whether the model assumptions hold.',
      },
      {
        question: 'What should a well-behaved residual plot look like?',
        options: [
          'A clear upward curve',
          'Random scatter around zero with no patterns',
          'A funnel shape widening to the right',
          'Points clustered near the diagonal',
        ],
        correctAnswer: 1,
        explanation: 'Random scatter indicates the model has captured the linear trend. Patterns suggest violated assumptions.',
      },
      {
        question: 'Which Python library class is used to fit a linear regression?',
        options: [
          'numpy.Regression',
          'sklearn.linear_model.LinearRegression',
          'pandas.LinearModel',
          'scipy.stats.linregress only',
        ],
        correctAnswer: 1,
        explanation: 'sklearn.linear_model.LinearRegression is the standard class for linear regression in Python.',
      },
      {
        question: 'What is a "confounding variable"?',
        options: [
          'A variable with too many missing values',
          'A hidden third variable that explains an observed correlation between two other variables',
          'The intercept term in a regression model',
          'An outlier that distorts the regression line',
        ],
        correctAnswer: 1,
        explanation: 'A confounder causes both X and Y to change, creating a spurious correlation between them.',
      },
      {
        question: 'If R² = 0 for a linear regression model, what does that mean?',
        options: [
          'The model perfectly predicts y',
          'The linear model explains none of the variance in y',
          'x and y have no data points in common',
          'The intercept is zero',
        ],
        correctAnswer: 1,
        explanation: 'R²=0 means the regression line is no better than predicting the mean for every observation.',
      },
    ],
  },

  // ── 7 of 7 ────────────────────────────────────────────────────────────────
  {
    title:       'Interactive Data Visualization with Plotly',
    slug:        'da-noob-23-plotly',
    description: 'Go beyond static charts: build interactive bar charts, scatter plots, line graphs, histograms, box plots, and geographic maps with Plotly Express — and learn when interactive visualisations add real value.',
    tier:        'NOOB' as const,
    orderIndex:  19,
    xpReward:    80,
    content: `# Interactive Data Visualization with Plotly

## Why Interactive Charts?

Matplotlib and Seaborn produce beautiful *static* images. But dashboards, web reports, and exploratory analysis benefit enormously from **interactivity**:
- **Hover tooltips** — see exact values without squinting at axes
- **Zoom and pan** — explore dense scatter plots
- **Click-to-filter** — isolate one category in the legend
- **Export** — save as HTML and share without Python

---

## 1. Plotly Express — High-Level API

\`plotly.express\` (aliased as \`px\`) creates common charts in one line:

\`\`\`python
import plotly.express as px
import pandas as pd

df = px.data.gapminder()   # built-in sample dataset

# Scatter plot
fig = px.scatter(df.query("year == 2007"),
                 x="gdpPercap", y="lifeExp",
                 size="pop", color="continent",
                 hover_name="country",
                 log_x=True,
                 title="GDP per Capita vs Life Expectancy (2007)")
fig.show()
\`\`\`

Every chart object is fully interactive — hover, zoom, pan, download are built-in.

---

## 2. Common Chart Types

### Bar Chart

\`\`\`python
sales = pd.DataFrame({
    "region":  ["North","South","East","West"],
    "revenue": [125000, 98000, 143000, 87000],
})

fig = px.bar(sales, x="region", y="revenue",
             color="region",
             title="Revenue by Region",
             text_auto=True)          # show values on bars
fig.show()
\`\`\`

### Line Chart

\`\`\`python
fig = px.line(df_monthly, x="month", y="sales",
              color="product",       # separate line per product
              markers=True,          # show data points
              title="Monthly Sales by Product")
fig.show()
\`\`\`

### Scatter Plot

\`\`\`python
fig = px.scatter(df, x="age", y="revenue",
                 color="tier",
                 size="orders",
                 hover_data=["customer_name", "city"],
                 trendline="ols")     # add regression line
fig.show()
\`\`\`

---

## 3. Distribution Charts

### Histogram

\`\`\`python
fig = px.histogram(df, x="revenue",
                   nbins=40,
                   color="region",
                   barmode="overlay",
                   opacity=0.6,
                   title="Revenue Distribution by Region")
fig.show()
\`\`\`

### Box Plot

\`\`\`python
fig = px.box(df, x="region", y="revenue",
             color="region",
             points="outliers",      # show individual outlier points
             title="Revenue Distribution — Box Plot")
fig.show()
\`\`\`

### Violin Plot (combines box + distribution)

\`\`\`python
fig = px.violin(df, x="region", y="revenue",
                color="region", box=True, points="all")
fig.show()
\`\`\`

---

## 4. Correlation Heatmap

\`\`\`python
import plotly.graph_objects as go
import numpy as np

corr = df.select_dtypes("number").corr()
fig  = go.Figure(go.Heatmap(
    z=corr.values,
    x=corr.columns.tolist(),
    y=corr.columns.tolist(),
    colorscale="RdBu",
    zmin=-1, zmax=1,
    text=corr.round(2).values,
    texttemplate="%{text}",
))
fig.update_layout(title="Correlation Heatmap")
fig.show()
\`\`\`

---

## 5. Geographic Map (Choropleth)

\`\`\`python
df_world = px.data.gapminder().query("year == 2007")

fig = px.choropleth(df_world,
                    locations="iso_alpha",
                    color="lifeExp",
                    hover_name="country",
                    color_continuous_scale="Viridis",
                    title="Life Expectancy by Country (2007)")
fig.show()
\`\`\`

---

## 6. Customising Layouts

\`\`\`python
fig.update_layout(
    template="plotly_dark",            # dark theme
    font=dict(family="Inter", size=12),
    legend=dict(orientation="h",       # horizontal legend
                yanchor="bottom", y=1.02),
    xaxis_title="Month",
    yaxis_title="Revenue ($)",
    hovermode="x unified",             # unified tooltip across traces
)
\`\`\`

---

## 7. Exporting Charts

\`\`\`python
# Interactive HTML (shareable without Python)
fig.write_html("chart.html")

# Static image (requires kaleido: pip install kaleido)
fig.write_image("chart.png", width=1200, height=600)

# Embed JSON in a Jupyter notebook
fig.write_json("chart.json")
\`\`\`

---

## 8. Plotly vs Matplotlib — When to Use Each

| Use Case | Best Choice |
|---------|------------|
| Exploratory analysis — quick look | Matplotlib/Seaborn |
| Dashboard / web report | Plotly |
| Publication-ready printed figure | Matplotlib |
| Data story with hover details | Plotly |
| Simple histogram for internal notes | Matplotlib |
| Geospatial / map visualisation | Plotly |

---

## Summary

Plotly Express gives you stunning interactive charts with minimal code. Use \`fig.show()\` to render, \`fig.write_html()\` to share, and \`update_layout()\` to customise. The gap between "analyst chart" and "polished dashboard" is just a few lines of Plotly.
`,
    codeExample: `import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

np.random.seed(42)

# Build sample e-commerce dataset
months = pd.date_range("2024-01", periods=12, freq="MS")
regions = ["North", "South", "East", "West"]

records = []
for m in months:
    for r in regions:
        records.append({
            "month": m, "region": r,
            "revenue": np.random.randint(60_000, 200_000),
            "orders":  np.random.randint(300, 1200),
        })

df = pd.DataFrame(records)
df["month_label"] = df["month"].dt.strftime("%b %Y")
df["aov"] = (df["revenue"] / df["orders"]).round(2)  # average order value

# ── 1. Line chart: monthly revenue per region ────────────────────────────
fig1 = px.line(df, x="month_label", y="revenue", color="region",
               markers=True, title="Monthly Revenue by Region")
fig1.write_html("revenue_trend.html")
print("Saved: revenue_trend.html")

# ── 2. Box plot: revenue distribution per region ─────────────────────────
fig2 = px.box(df, x="region", y="revenue", color="region",
              points="all", title="Revenue Distribution by Region")
fig2.write_html("revenue_distribution.html")
print("Saved: revenue_distribution.html")

# ── 3. Scatter: orders vs revenue, sized by AOV ──────────────────────────
fig3 = px.scatter(df, x="orders", y="revenue", color="region",
                  size="aov", hover_data=["month_label"],
                  trendline="ols", title="Orders vs Revenue")
fig3.write_html("scatter.html")
print("Saved: scatter.html")`,
    quizzes: [
      {
        question: 'What is the main advantage of Plotly charts over Matplotlib?',
        options: [
          'Plotly renders faster on large datasets',
          'Plotly charts are interactive — hover, zoom, and filter work by default',
          'Plotly requires no Python knowledge',
          'Plotly produces higher-resolution static images',
        ],
        correctAnswer: 1,
        explanation: 'Plotly\'s key advantage is built-in interactivity: hover tooltips, zoom, pan, and legend click-filtering.',
      },
      {
        question: 'How do you create a bar chart with Plotly Express?',
        options: [
          'px.chart(df, type="bar")',
          'px.bar(df, x="col", y="col")',
          'go.Bar(df["col"])',
          'px.plot(df, kind="bar")',
        ],
        correctAnswer: 1,
        explanation: 'px.bar() is the Plotly Express function for bar charts — specify x, y, and optional color.',
      },
      {
        question: 'What does fig.write_html("chart.html") do?',
        options: [
          'Saves the chart as a PNG image',
          'Exports an interactive HTML file that works in any browser without Python',
          'Uploads the chart to a web server',
          'Creates a JSON config file for the chart',
        ],
        correctAnswer: 1,
        explanation: 'write_html() exports a self-contained interactive HTML file — shareable with anyone who has a browser.',
      },
      {
        question: 'What does the "hover_data" parameter add to a scatter plot?',
        options: [
          'A tooltip showing additional column values when hovering over a point',
          'Data labels printed directly on each point',
          'An animation that plays on mouse-over',
          'A filter button for each column',
        ],
        correctAnswer: 0,
        explanation: 'hover_data specifies extra columns shown in the tooltip when you hover over a data point.',
      },
      {
        question: 'What is a choropleth map?',
        options: [
          'A scatter plot with geographic coordinates',
          'A map where regions are shaded by a data variable\'s value',
          'A bar chart with country flags on the x-axis',
          'A time-lapse animation of global data',
        ],
        correctAnswer: 1,
        explanation: 'Choropleth maps colour geographic regions (countries, states) according to a numeric or categorical value.',
      },
      {
        question: 'What does px.box(df, x="region", y="revenue", points="outliers") show?',
        options: [
          'A box plot per region with outlier points plotted individually',
          'A scatter plot where boxes indicate regions',
          'A bar chart with error bars',
          'A box-shaped heatmap of region × revenue',
        ],
        correctAnswer: 0,
        explanation: 'px.box() creates box plots; points="outliers" adds individual data points beyond the whiskers.',
      },
      {
        question: 'What does trendline="ols" add to a Plotly Express scatter plot?',
        options: [
          'Connecting lines between adjacent data points',
          'An ordinary least squares regression line',
          'A smoothed spline curve through the data',
          'A threshold line at the data mean',
        ],
        correctAnswer: 1,
        explanation: 'trendline="ols" fits and overlays a linear (OLS) regression line on the scatter plot.',
      },
      {
        question: 'What does fig.update_layout(template="plotly_dark") do?',
        options: [
          'Applies a dark colour scheme to the chart',
          'Makes the chart background transparent',
          'Reduces the font size for dark backgrounds',
          'Exports the chart in dark mode PNG',
        ],
        correctAnswer: 0,
        explanation: 'template sets the overall visual theme; "plotly_dark" switches to a dark background style.',
      },
      {
        question: 'When should you prefer Matplotlib over Plotly?',
        options: [
          'When building a web dashboard for business stakeholders',
          'For exploratory notebook charts and publication-ready printed figures',
          'When you need hover tooltips on all data points',
          'When creating geographic choropleth maps',
        ],
        correctAnswer: 1,
        explanation: 'Matplotlib is ideal for quick EDA and static, print-quality figures; Plotly shines for interactive web-facing outputs.',
      },
      {
        question: 'What does px.histogram(df, x="revenue", nbins=40) create?',
        options: [
          'A line chart of revenue values',
          'A frequency distribution chart of the revenue column with 40 bins',
          'A scatter plot with 40 data points',
          'A box plot divided into 40 sections',
        ],
        correctAnswer: 1,
        explanation: 'px.histogram groups values into nbins bins and plots the count (or other aggregation) per bin.',
      },
    ],
  },

]; // end CHAPTERS

// ---------------------------------------------------------------------------

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: 'data-analytics' } });
  if (!course) {
    console.error('❌  Course "data-analytics" not found — run the main seed first.');
    process.exit(1);
  }

  console.log(`\n📚  Seeding Block 5 — Python & Statistics Deep Dive (${CHAPTERS.length} chapters)…\n`);

  for (const ch of CHAPTERS) {
    const questions = ch.quizzes.map((qz, i) => ({
      text:          qz.question,
      options:       JSON.stringify(
        qz.options.map((opt: string, idx: number) => ({ id: IDX_TO_ID[idx], text: opt })),
      ),
      correctAnswer: IDX_TO_ID[qz.correctAnswer],
      explanation:   qz.explanation,
      orderIndex:    i + 1,
    }));

    // ── Idempotency check ──────────────────────────────────────────────────
    const existing = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM Chapter WHERE slug = ? LIMIT 1`,
      ch.slug,
    );

    let chapterId: string;

    if (existing.length) {
      chapterId = existing[0].id;

      const existingQuiz = await prisma.$queryRawUnsafe<{ id: string }[]>(
        `SELECT id FROM Quiz WHERE chapterId = ? LIMIT 1`,
        chapterId,
      );

      if (existingQuiz.length) {
        console.log(`⏭   Skipping  "${ch.title}" — already seeded`);
        continue;
      }

      // Chapter exists but quiz is missing — repair
      await prisma.quiz.create({
        data: {
          chapterId,
          title:        `${ch.title} — Quiz`,
          description:  `Test your understanding of ${ch.title}`,
          timeLimit:    1800,
          passingScore: 70,
          xpReward:     Math.round(ch.xpReward * 1.5),
          questions:    { create: questions },
        },
      });
      console.log(`🔧  Repaired quiz for "${ch.title}"`);
      continue;
    }

    // ── Create chapter + quiz ──────────────────────────────────────────────
    const { quizzes: _qs, ...chapterData } = ch;
    const chapter = await prisma.chapter.create({
      data: { ...chapterData, courseId: course.id },
    });
    chapterId = chapter.id;

    await prisma.quiz.create({
      data: {
        chapterId,
        title:        `${ch.title} — Quiz`,
        description:  `Test your understanding of ${ch.title}`,
        timeLimit:    1800,
        passingScore: 70,
        xpReward:     Math.round(ch.xpReward * 1.5),
        questions:    { create: questions },
      },
    });

    console.log(`✅  Seeded   "${ch.title}"  (orderIndex ${ch.orderIndex})`);
  }

  console.log('\n🎉  Block 5 complete!\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
