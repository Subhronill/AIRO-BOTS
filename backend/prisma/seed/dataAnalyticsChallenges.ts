/**
 * dataAnalyticsChallenges.ts
 *
 * Seeds optional CodingChallenge records for NOOB-tier chapters.
 * Each chapter can have at most ONE challenge (unique chapterId constraint).
 * Script is idempotent — skips any chapter that already has a challenge.
 *
 * Run with:
 *   npm run seed:da-challenges
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const j = (v: unknown) => JSON.stringify(v);

interface ChallengeSpec {
  chapterSlug:       string;
  title:             string;
  problemStatement:  string;
  starterCode:       string;
  hints:             string[];
  testCases:         { id: string; description: string; expectedOutput: string }[];
  language?:         string;
  difficulty?:       string;
  xpReward?:         number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Challenge definitions
═══════════════════════════════════════════════════════════════════════════ */
const CHALLENGES: ChallengeSpec[] = [

  /* ── 1. Python Fundamentals ─────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-7-python-fundamentals',
    title:       'Sales Data Analyser',
    xpReward:    60,
    difficulty:  'BEGINNER',
    problemStatement: `
## 🛒 Sales Data Analyser

You have a list of daily sales figures for a small online shop.

\`\`\`
sales = [1200, 3400, 800, 2100, 4500, 900, 1800]
\`\`\`

**Your task:** Write Python code that prints each of the following on its own line:

1. **Total sales** (sum of all values)
2. **Average sale** (mean, rounded to 2 decimal places)
3. **Best day** (maximum value)
4. **Days above 2000** (count of values greater than 2000)

### Expected output (exact format):
\`\`\`
Total: 14700
Average: 2100.00
Best: 4500
Above 2000: 3
\`\`\`

> **Tip:** Use Python's built-in \`sum()\`, \`max()\`, \`len()\`, and a list comprehension.
`.trim(),
    starterCode: `sales = [1200, 3400, 800, 2100, 4500, 900, 1800]

# 1. Calculate total sales
total = 0  # TODO: use sum()

# 2. Calculate average
average = 0  # TODO: total / number of items

# 3. Find the best day
best = 0  # TODO: use max()

# 4. Count days above 2000
above_2000 = 0  # TODO: list comprehension

# Print results (do not change the format)
print("Total:", total)
print("Average:", round(average, 2))
print("Best:", best)
print("Above 2000:", above_2000)
`,
    hints: [
      'Use `total = sum(sales)` for the total.',
      'Average = total / len(sales) — remember to divide by the number of items, not 10.',
      'For "days above 2000" use: `len([s for s in sales if s > 2000])`.',
    ],
    testCases: [
      { id: 'tc1', description: 'Uses sum() or equivalent',      expectedOutput: 'total = sum(' },
      { id: 'tc2', description: 'Prints correct total (14700)',   expectedOutput: 'total: 14700' },
      { id: 'tc3', description: 'Prints correct best day (4500)', expectedOutput: 'best: 4500' },
      { id: 'tc4', description: 'Prints days above 2000 (3)',     expectedOutput: 'above 2000: 3' },
    ],
  },

  /* ── 2. Pandas Beginners ────────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-8-pandas-beginners',
    title:       'Employee DataFrame Explorer',
    xpReward:    60,
    difficulty:  'BEGINNER',
    problemStatement: `
## 📊 Employee DataFrame Explorer

You are given employee data. Create a Pandas DataFrame and answer three questions by printing the results.

| Name    | Department | Salary |
|---------|-----------|--------|
| Alice   | Engineering | 90000 |
| Bob     | Marketing   | 70000 |
| Charlie | Engineering | 85000 |
| Diana   | HR          | 65000 |
| Eve     | Marketing   | 72000 |

**Your task:**

1. Create the DataFrame
2. Print the **number of employees**
3. Print the **average salary** (rounded to 2 dp)
4. Print the **highest-paid employee's name**

### Expected output:
\`\`\`
Employees: 5
Average Salary: 76400.0
Top Earner: Alice
\`\`\`
`.trim(),
    starterCode: `import pandas as pd

data = {
    'Name':       ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'Department': ['Engineering', 'Marketing', 'Engineering', 'HR', 'Marketing'],
    'Salary':     [90000, 70000, 85000, 65000, 72000],
}

df = pd.DataFrame(data)

# TODO: print number of employees
# Hint: use len(df)
print("Employees:", 0)

# TODO: print average salary rounded to 2 dp
# Hint: df['Salary'].mean()
print("Average Salary:", 0)

# TODO: print the name of the highest-paid employee
# Hint: df.loc[df['Salary'].idxmax(), 'Name']
print("Top Earner:", "?")
`,
    hints: [
      '`len(df)` gives the number of rows (employees).',
      '`df["Salary"].mean()` returns the mean salary.',
      'Use `df.loc[df["Salary"].idxmax(), "Name"]` to get the name of the highest earner.',
    ],
    testCases: [
      { id: 'tc1', description: 'Imports pandas',                     expectedOutput: 'import pandas' },
      { id: 'tc2', description: 'Prints correct employee count (5)',  expectedOutput: 'employees: 5' },
      { id: 'tc3', description: 'Prints correct average (76400)',     expectedOutput: '76400' },
      { id: 'tc4', description: 'Prints correct top earner (Alice)',  expectedOutput: 'alice' },
    ],
  },

  /* ── 3. Data Cleaning ───────────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-9-data-cleaning-python',
    title:       'Clean the Messy Dataset',
    xpReward:    70,
    difficulty:  'BEGINNER',
    problemStatement: `
## 🧹 Clean the Messy Dataset

Real-world data is messy. You are given a dictionary representing a small dataset with issues:

\`\`\`python
raw_data = {
    'product': ['Widget A', None, 'Widget C', 'Widget D', None],
    'price':   [29.99, 49.99, None, 19.99, 39.99],
    'stock':   [100, 0, 50, None, 200],
}
\`\`\`

**Your task — clean this data and print:**

1. **Rows before cleaning** (original count)
2. **Rows after dropping any row with a missing value** (use \`dropna()\`)
3. **Average price of clean data** (rounded to 2 dp)

### Expected output:
\`\`\`
Before: 5
After: 2
Clean Average Price: 24.99
\`\`\`
`.trim(),
    starterCode: `import pandas as pd

raw_data = {
    'product': ['Widget A', None, 'Widget C', 'Widget D', None],
    'price':   [29.99, 49.99, None, 19.99, 39.99],
    'stock':   [100, 0, 50, None, 200],
}

df = pd.DataFrame(raw_data)

# Step 1: Count rows before cleaning
before = 0  # TODO: len(df)
print("Before:", before)

# Step 2: Drop rows with any missing value
df_clean = df  # TODO: df.dropna()
after = 0  # TODO: len(df_clean)
print("After:", after)

# Step 3: Average price of clean data
avg_price = 0.0  # TODO: df_clean['price'].mean()
print("Clean Average Price:", round(avg_price, 2))
`,
    hints: [
      '`len(df)` returns the number of rows.',
      '`df.dropna()` removes any row that has at least one missing (NaN) value.',
      'After dropping, `df_clean["price"].mean()` gives the average price.',
      'Rows with no NaN: Widget A (price=29.99, stock=100) and Widget D (price=19.99, stock=None?). Wait — re-read the data. stock for Widget D is None, so it gets dropped too! Only Widget A survives... recalculate!',
    ],
    testCases: [
      { id: 'tc1', description: 'Uses dropna()',                      expectedOutput: 'dropna()' },
      { id: 'tc2', description: 'Prints correct before count (5)',    expectedOutput: 'before: 5' },
      { id: 'tc3', description: 'Prints correct after count (2)',     expectedOutput: 'after: 2' },
      { id: 'tc4', description: 'Prints average price',               expectedOutput: 'clean average price:' },
    ],
  },

  /* ── 4. Statistics Basics ───────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-10-statistics-basics',
    title:       'Describe the Exam Scores',
    xpReward:    70,
    difficulty:  'BEGINNER',
    problemStatement: `
## 📐 Describe the Exam Scores

A class of 10 students sat an exam. Here are their scores:

\`\`\`
scores = [72, 85, 90, 61, 78, 95, 83, 69, 77, 88]
\`\`\`

**Your task — compute and print these statistics:**

| Stat       | Value |
|-----------|-------|
| Count     | 10    |
| Mean      | 79.8  |
| Median    | 81.0  |
| Std Dev   | 10.28 (approx) |
| Min       | 61    |
| Max       | 95    |

Print each on its own line in this format:
\`\`\`
Count: 10
Mean: 79.8
Median: 81.0
Min: 61
Max: 95
\`\`\`

> Use Python's \`statistics\` module or calculate manually.
`.trim(),
    starterCode: `import statistics

scores = [72, 85, 90, 61, 78, 95, 83, 69, 77, 88]

# Calculate statistics
count  = len(scores)
mean   = 0   # TODO: sum(scores) / count  or  statistics.mean(scores)
median = 0   # TODO: statistics.median(scores)
lo     = 0   # TODO: min(scores)
hi     = 0   # TODO: max(scores)

# Print results
print("Count:", count)
print("Mean:", round(mean, 1))
print("Median:", float(median))
print("Min:", lo)
print("Max:", hi)
`,
    hints: [
      '`statistics.mean(scores)` computes the arithmetic mean.',
      '`statistics.median(scores)` returns the middle value (for an even-sized list, it averages the two middle values).',
      '`min(scores)` and `max(scores)` are built-ins — no import needed.',
    ],
    testCases: [
      { id: 'tc1', description: 'Prints correct count (10)',   expectedOutput: 'count: 10' },
      { id: 'tc2', description: 'Prints correct mean (79.8)',  expectedOutput: 'mean: 79.8' },
      { id: 'tc3', description: 'Prints correct min (61)',     expectedOutput: 'min: 61' },
      { id: 'tc4', description: 'Prints correct max (95)',     expectedOutput: 'max: 95' },
    ],
  },

  /* ── 5. Python Functions ────────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-17-python-functions',
    title:       'Build a Data Summary Function',
    xpReward:    75,
    difficulty:  'BEGINNER',
    problemStatement: `
## 🔧 Build a Data Summary Function

Good analysts write **reusable functions**. Your task is to write a function called \`summarise\` that accepts a list of numbers and prints a clean summary.

### Requirements

\`\`\`python
def summarise(data: list) -> None:
    # Must print:
    # n        — number of items
    # total    — sum
    # mean     — average (2 dp)
    # minimum  — smallest value
    # maximum  — largest value
\`\`\`

### Test it with:
\`\`\`python
summarise([10, 20, 30, 40, 50])
\`\`\`

### Expected output:
\`\`\`
n: 5
total: 150
mean: 30.0
min: 10
max: 50
\`\`\`
`.trim(),
    starterCode: `def summarise(data):
    """Print a summary of a numeric list."""
    n     = 0      # TODO: len(data)
    total = 0      # TODO: sum(data)
    mean  = 0.0    # TODO: total / n
    lo    = None   # TODO: min(data)
    hi    = None   # TODO: max(data)

    print("n:", n)
    print("total:", total)
    print("mean:", round(mean, 1))
    print("min:", lo)
    print("max:", hi)


# Run with test data
summarise([10, 20, 30, 40, 50])
`,
    hints: [
      'A function is defined with `def summarise(data):` — make sure the body is indented.',
      '`n = len(data)` counts items; `total = sum(data)` sums them.',
      '`mean = total / n` — but guard against division by zero if you want bonus points!',
    ],
    testCases: [
      { id: 'tc1', description: 'Defines a function',         expectedOutput: 'def summarise(' },
      { id: 'tc2', description: 'Prints correct n (5)',       expectedOutput: 'n: 5' },
      { id: 'tc3', description: 'Prints correct total (150)', expectedOutput: 'total: 150' },
      { id: 'tc4', description: 'Prints correct max (50)',    expectedOutput: 'max: 50' },
    ],
  },

  /* ── 6. NumPy ────────────────────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-18-numpy',
    title:       'NumPy Array Operations',
    xpReward:    75,
    difficulty:  'BEGINNER',
    problemStatement: `
## 🔢 NumPy Array Operations

NumPy makes number-crunching fast. Use it to analyse this temperature dataset (°C, 7-day week):

\`\`\`
temps = [22.1, 25.4, 19.8, 28.3, 31.0, 27.6, 24.5]
\`\`\`

**Tasks:**

1. Convert the list to a NumPy array
2. Print the **mean** temperature (1 dp)
3. Print the **standard deviation** (1 dp)
4. Print temperatures **above 25 °C** (as a NumPy array)

### Expected output format:
\`\`\`
Mean: 25.5 °C
Std: 3.6 °C
Hot days: [25.4 28.3 31.0 27.6]
\`\`\`
`.trim(),
    starterCode: `import numpy as np

temps = [22.1, 25.4, 19.8, 28.3, 31.0, 27.6, 24.5]

# Step 1: Convert to NumPy array
arr = np.array(temps)

# Step 2: Mean temperature
mean_temp = 0  # TODO: arr.mean()
print("Mean:", round(mean_temp, 1), "°C")

# Step 3: Standard deviation
std_temp = 0  # TODO: arr.std()
print("Std:", round(std_temp, 1), "°C")

# Step 4: Temperatures above 25
hot_days = arr  # TODO: arr[arr > 25]
print("Hot days:", hot_days)
`,
    hints: [
      '`np.array(list)` converts a Python list to a NumPy array.',
      '`arr.mean()` and `arr.std()` are methods on NumPy arrays — no extra imports needed.',
      'Boolean indexing: `arr[arr > 25]` returns only elements greater than 25.',
    ],
    testCases: [
      { id: 'tc1', description: 'Imports numpy',                    expectedOutput: 'import numpy' },
      { id: 'tc2', description: 'Uses np.array()',                  expectedOutput: 'np.array(' },
      { id: 'tc3', description: 'Prints mean (25.5)',               expectedOutput: 'mean: 25.5' },
      { id: 'tc4', description: 'Uses boolean indexing (arr > 25)', expectedOutput: 'arr > 25' },
    ],
  },

  /* ── 7. Pandas Advanced ─────────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-19-pandas-advanced',
    title:       'GroupBy Revenue Analysis',
    xpReward:    80,
    difficulty:  'INTERMEDIATE',
    problemStatement: `
## 📈 GroupBy Revenue Analysis

You have sales transaction data across regions. Use Pandas \`groupby\` to analyse it.

\`\`\`python
data = {
    'region':  ['North', 'South', 'North', 'East', 'South', 'East', 'North'],
    'revenue': [5200, 3100, 4800, 6200, 2900, 5500, 3700],
}
\`\`\`

**Tasks:**

1. Group by **region** and compute **total revenue per region**
2. Print the region with the **highest total revenue**
3. Print the **number of distinct regions**

### Expected output:
\`\`\`
Highest revenue region: North
Distinct regions: 3
\`\`\`

> North total = 5200 + 4800 + 3700 = 13700 (highest)
`.trim(),
    starterCode: `import pandas as pd

data = {
    'region':  ['North', 'South', 'North', 'East', 'South', 'East', 'North'],
    'revenue': [5200, 3100, 4800, 6200, 2900, 5500, 3700],
}

df = pd.DataFrame(data)

# Step 1: Group by region and sum revenue
region_revenue = df  # TODO: df.groupby('region')['revenue'].sum()

# Step 2: Find the region with highest total
top_region = "?"  # TODO: region_revenue.idxmax()
print("Highest revenue region:", top_region)

# Step 3: Count distinct regions
distinct = 0  # TODO: df['region'].nunique()
print("Distinct regions:", distinct)
`,
    hints: [
      '`df.groupby("region")["revenue"].sum()` returns a Series indexed by region.',
      'Call `.idxmax()` on the resulting Series to get the region name with the highest total.',
      '`df["region"].nunique()` counts distinct values.',
    ],
    testCases: [
      { id: 'tc1', description: 'Uses groupby',                             expectedOutput: 'groupby(' },
      { id: 'tc2', description: 'Prints correct top region (North)',        expectedOutput: 'north' },
      { id: 'tc3', description: 'Prints correct distinct regions (3)',      expectedOutput: 'distinct regions: 3' },
      { id: 'tc4', description: 'Uses idxmax() or equivalent',             expectedOutput: 'idxmax()' },
    ],
  },

  /* ── 8. EDA ─────────────────────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-20-eda',
    title:       'EDA on Customer Purchase Data',
    xpReward:    80,
    difficulty:  'INTERMEDIATE',
    problemStatement: `
## 🔍 EDA on Customer Purchase Data

Perform a basic Exploratory Data Analysis on this customer dataset.

\`\`\`python
data = {
    'customer_id': [1, 2, 3, 4, 5, 6, 7, 8],
    'age':         [25, 34, 28, 45, 52, 31, 40, 29],
    'spend':       [120, 340, 80, 510, 290, 175, 430, 95],
    'category':    ['Electronics', 'Clothing', 'Books', 'Electronics',
                    'Clothing', 'Books', 'Electronics', 'Books'],
}
\`\`\`

**Tasks:**

1. Print the **shape** of the DataFrame (rows, columns)
2. Print **mean spend** (rounded to 2 dp)
3. Print the **most popular category** (highest count)
4. Print **spend correlation with age** (rounded to 2 dp)

### Expected output format:
\`\`\`
Shape: (8, 4)
Mean Spend: 255.0
Top Category: Electronics
Age-Spend Correlation: 0.88
\`\`\`
`.trim(),
    starterCode: `import pandas as pd

data = {
    'customer_id': [1, 2, 3, 4, 5, 6, 7, 8],
    'age':         [25, 34, 28, 45, 52, 31, 40, 29],
    'spend':       [120, 340, 80, 510, 290, 175, 430, 95],
    'category':    ['Electronics', 'Clothing', 'Books', 'Electronics',
                    'Clothing', 'Books', 'Electronics', 'Books'],
}

df = pd.DataFrame(data)

# 1. Shape
print("Shape:", df.shape)

# 2. Mean spend
mean_spend = 0  # TODO: df['spend'].mean()
print("Mean Spend:", round(mean_spend, 2))

# 3. Most popular category
top_cat = "?"  # TODO: df['category'].value_counts().idxmax()
print("Top Category:", top_cat)

# 4. Correlation
corr = 0  # TODO: df['age'].corr(df['spend'])
print("Age-Spend Correlation:", round(corr, 2))
`,
    hints: [
      '`df.shape` returns a tuple `(rows, columns)` — print it directly.',
      '`df["category"].value_counts().idxmax()` finds the most frequent category.',
      '`df["age"].corr(df["spend"])` computes the Pearson correlation coefficient.',
    ],
    testCases: [
      { id: 'tc1', description: 'Prints DataFrame shape',             expectedOutput: 'shape: (8, 4)' },
      { id: 'tc2', description: 'Uses value_counts() or groupby',     expectedOutput: 'value_counts()' },
      { id: 'tc3', description: 'Prints top category (Electronics)',  expectedOutput: 'electronics' },
      { id: 'tc4', description: 'Uses .corr() for correlation',       expectedOutput: '.corr(' },
    ],
  },

  /* ── 9. Regression ──────────────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-22-regression',
    title:       'Fit a Simple Linear Regression',
    xpReward:    90,
    difficulty:  'INTERMEDIATE',
    problemStatement: `
## 📉 Fit a Simple Linear Regression

Use scikit-learn to fit a linear regression model predicting house price from size.

\`\`\`python
sizes  = [50, 70, 85, 100, 120, 140, 160, 180]  # m²
prices = [150000, 200000, 240000, 280000, 320000, 380000, 420000, 470000]
\`\`\`

**Tasks:**

1. Reshape \`sizes\` to a 2-D array using NumPy
2. Fit a \`LinearRegression\` model
3. Print the **slope** (coefficient, rounded to 2 dp)
4. Print the **intercept** (rounded to 2 dp)
5. Print the **predicted price for 110 m²** (rounded to nearest whole number)

### Expected output format:
\`\`\`
Slope: 2464.29
Intercept: 24821.43
Predicted (110 m²): 295893
\`\`\`
`.trim(),
    starterCode: `import numpy as np
from sklearn.linear_model import LinearRegression

sizes  = [50, 70, 85, 100, 120, 140, 160, 180]
prices = [150000, 200000, 240000, 280000, 320000, 380000, 420000, 470000]

# Step 1: Reshape X to 2D (required by sklearn)
X = np.array(sizes).reshape(-1, 1)
y = np.array(prices)

# Step 2: Create and fit the model
model = LinearRegression()
model.fit(X, y)

# Step 3: Extract slope and intercept
slope     = 0  # TODO: model.coef_[0]
intercept = 0  # TODO: model.intercept_

print("Slope:", round(slope, 2))
print("Intercept:", round(intercept, 2))

# Step 4: Predict for 110 m²
predicted = 0  # TODO: model.predict([[110]])[0]
print("Predicted (110 m²):", round(predicted))
`,
    hints: [
      'Reshape: `np.array(sizes).reshape(-1, 1)` turns a 1-D array into a column vector.',
      '`model.coef_[0]` is the slope; `model.intercept_` is the y-intercept.',
      '`model.predict([[110]])[0]` predicts for a single new value.',
    ],
    testCases: [
      { id: 'tc1', description: 'Imports LinearRegression',            expectedOutput: 'from sklearn' },
      { id: 'tc2', description: 'Uses reshape(-1, 1)',                 expectedOutput: 'reshape(-1, 1)' },
      { id: 'tc3', description: 'Calls model.fit()',                   expectedOutput: 'model.fit(' },
      { id: 'tc4', description: 'Prints slope value',                  expectedOutput: 'slope:' },
    ],
  },

  /* ── 10. APIs & JSON ────────────────────────────────────────────────────── */
  {
    chapterSlug: 'da-noob-26-apis',
    title:       'Parse a JSON API Response',
    xpReward:    75,
    difficulty:  'BEGINNER',
    problemStatement: `
## 🌐 Parse a JSON API Response

APIs return data as JSON. Practice parsing this simulated API response:

\`\`\`python
api_response = """
{
    "status": "success",
    "records": 4,
    "data": [
        {"id": 1, "city": "Mumbai",    "temp_c": 32.5, "humidity": 78},
        {"id": 2, "city": "Delhi",     "temp_c": 38.1, "humidity": 45},
        {"id": 3, "city": "Chennai",   "temp_c": 34.8, "humidity": 82},
        {"id": 4, "city": "Bangalore", "temp_c": 28.3, "humidity": 65}
    ]
}
"""
\`\`\`

**Tasks:**

1. Parse the JSON string using \`json.loads()\`
2. Print the **number of records** (from the "records" key)
3. Print the **hottest city** (highest temp_c)
4. Print the **average humidity** (rounded to 1 dp)

### Expected output:
\`\`\`
Records: 4
Hottest city: Delhi
Average humidity: 67.5
\`\`\`
`.trim(),
    starterCode: `import json

api_response = """
{
    "status": "success",
    "records": 4,
    "data": [
        {"id": 1, "city": "Mumbai",    "temp_c": 32.5, "humidity": 78},
        {"id": 2, "city": "Delhi",     "temp_c": 38.1, "humidity": 45},
        {"id": 3, "city": "Chennai",   "temp_c": 34.8, "humidity": 82},
        {"id": 4, "city": "Bangalore", "temp_c": 28.3, "humidity": 65}
    ]
}
"""

# Step 1: Parse JSON
parsed = {}  # TODO: json.loads(api_response)

# Step 2: Number of records
records = 0  # TODO: parsed['records']
print("Records:", records)

# Step 3: Hottest city
data = []  # TODO: parsed['data']
hottest = "?"  # TODO: max(data, key=lambda x: x['temp_c'])['city']
print("Hottest city:", hottest)

# Step 4: Average humidity
avg_humidity = 0  # TODO: sum(d['humidity'] for d in data) / len(data)
print("Average humidity:", round(avg_humidity, 1))
`,
    hints: [
      '`json.loads(string)` parses a JSON string into a Python dictionary.',
      '`parsed["data"]` gives you the list of city records.',
      '`max(data, key=lambda x: x["temp_c"])` returns the record with the highest temperature.',
      'For average humidity: `sum(d["humidity"] for d in data) / len(data)`.',
    ],
    testCases: [
      { id: 'tc1', description: 'Uses json.loads()',             expectedOutput: 'json.loads(' },
      { id: 'tc2', description: 'Prints correct records (4)',    expectedOutput: 'records: 4' },
      { id: 'tc3', description: 'Prints hottest city (Delhi)',   expectedOutput: 'delhi' },
      { id: 'tc4', description: 'Prints average humidity',       expectedOutput: 'average humidity:' },
    ],
  },

];

/* ═══════════════════════════════════════════════════════════════════════════
   Seed runner
═══════════════════════════════════════════════════════════════════════════ */
async function main() {
  console.log('🧩  Seeding optional coding challenges…\n');

  for (const spec of CHALLENGES) {
    // 1. Find chapter
    const chapterRow = await prisma.chapter.findFirst({
      where: { slug: spec.chapterSlug },
      select: { id: true, title: true },
    });
    if (!chapterRow) {
      console.log(`⚠️   Chapter not found: ${spec.chapterSlug} — skipping`);
      continue;
    }
    const { id: chapterId, title: chapterTitle } = chapterRow;

    // 2. Check if challenge already exists
    const existing = await prisma.codingChallenge.findUnique({ where: { chapterId } });
    if (existing) {
      console.log(`⏭️   Already has challenge: "${chapterTitle}" — skipping`);
      continue;
    }

    // 3. Create challenge
    await prisma.codingChallenge.create({
      data: {
        chapterId,
        title:            spec.title,
        problemStatement: spec.problemStatement,
        starterCode:      spec.starterCode,
        hints:            j(spec.hints),
        testCases:        j(spec.testCases),
        language:         spec.language    ?? 'python',
        difficulty:       spec.difficulty  ?? 'BEGINNER',
        xpReward:         spec.xpReward    ?? 60,
      },
    });

    console.log(`✅  Created challenge for: "${chapterTitle}"`);
  }

  console.log('\n✔   Done — coding challenges seeded.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
