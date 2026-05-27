/**
 * dataAnalytics.ts
 * Creates the "Data Analytics" course (Module 2) and seeds its first 5 chapters
 * with full content and 15-question quizzes each.
 *
 * Run:
 *   cd backend
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed/dataAnalytics.ts
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

// ─── course metadata ─────────────────────────────────────────────────────────
const COURSE = {
  slug:        'data-analytics',
  title:       'Data Analytics',
  description: 'Master the complete data analytics pipeline — from raw data to actionable business insights. Covers Python (Pandas, NumPy), SQL, data cleaning, EDA, visualization, statistics, and real-world case studies.',
  icon:        '📊',
  level:       1,
  orderIndex:  1,   // slot 1 → AI Foundations(0) · Data Analytics(1) · ML(2) …
  isPublished: true,
};

// ─── chapter definitions ─────────────────────────────────────────────────────
const CHAPTERS = [

  // ══════════════════════════════════════════════
  // CHAPTER 0 — INTRODUCTION TO DATA ANALYTICS
  // ══════════════════════════════════════════════
  {
    slug:        'da0-intro-to-data-analytics',
    title:       'Introduction to Data Analytics',
    description: 'What data analytics is, its four types, the analytics lifecycle, key tools, and real-world applications across industries.',
    orderIndex:  0,
    xpReward:    50,
    difficulty:  'BEGINNER',
    language:    'python',
    codeExample: `# ── Your first data analytics program ──────────────────────────────
# We manually represent a tiny sales dataset and compute basic analytics

sales = [1200, 1850, 980, 2100, 1630, 2400, 1750]
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

# Descriptive analytics — summarise what happened
total   = sum(sales)
average = total / len(sales)
minimum = min(sales)
maximum = max(sales)

print("=== Sales Analytics Dashboard ===")
for month, revenue in zip(months, sales):
    print(f"  {month}: \${revenue:,}")

print(f"\\nTotal Revenue : \${total:,}")
print(f"Average / Month: \${average:,.0f}")
print(f"Best Month     : \${maximum:,}")
print(f"Worst Month    : \${minimum:,}")

# Diagnostic analytics — WHY was April the best?
best_idx = sales.index(maximum)
print(f"\\nBest Month was {months[best_idx]} — investigate marketing spend that month!")

# Simple trend (up or down vs previous month?)
print("\\nMonth-over-month trend:")
for i in range(1, len(sales)):
    change = sales[i] - sales[i-1]
    arrow  = "📈" if change > 0 else "📉"
    print(f"  {months[i-1]} → {months[i]}: {arrow} {change:+,}")`,
    content: `# Chapter 0 — Introduction to Data Analytics

## 🎯 What You'll Learn
By the end of this chapter you'll understand what data analytics actually means, the four fundamental types of analytics, how the data analytics lifecycle works, which tools professionals use, and where analytics creates value in the real world.

---

## 1. What Is Data Analytics?

**Data Analytics** is the process of examining, cleaning, transforming, and modelling data to discover useful information, draw conclusions, and support decision-making.

Every business generates data constantly — sales transactions, website clicks, sensor readings, customer support tickets. Analytics is what turns that raw, noisy data into **decisions that move the needle**.

> 💡 **One-line definition:** Data Analytics = turning raw data into useful insights.

A Data Analyst's typical day includes:
- Pulling data from databases using SQL
- Cleaning messy datasets in Python or Excel
- Building dashboards in Tableau or Power BI
- Finding patterns and telling a story with numbers
- Presenting recommendations to stakeholders

---

## 2. The Four Types of Analytics

Understanding these four types is the cornerstone of any analytics career:

| Type | Question Answered | Example |
|------|------------------|---------|
| **Descriptive** | *What happened?* | "We sold 2,400 units in June." |
| **Diagnostic** | *Why did it happen?* | "June sales spiked because of the summer sale campaign." |
| **Predictive** | *What will happen?* | "Based on trends, Q3 revenue will be ≈ $1.8M." |
| **Prescriptive** | *What should we do?* | "Increase ad spend by 20% in July to hit $2M target." |

Most business analytics work lives in the **descriptive** and **diagnostic** quadrants. Predictive and prescriptive analytics blur into the domain of Data Science and Machine Learning, which you'll explore in other AIRO BOTS modules.

---

## 3. The Data Analytics Lifecycle

Real analytics work is not linear — it's iterative. But a typical project follows these phases:

\`\`\`
1. DEFINE     → Understand the business question
2. COLLECT    → Identify and gather data sources
3. CLEAN      → Remove errors, handle missing values
4. EXPLORE    → EDA — patterns, distributions, anomalies
5. ANALYZE    → Apply statistical / analytical techniques
6. VISUALISE  → Charts, dashboards, reports
7. COMMUNICATE→ Present insights to decision-makers
8. ACT & MONITOR → Business acts on insights; track results
\`\`\`

> 🔑 **Data analysts spend 60–80 % of their time on steps 3 and 4** (cleaning and exploration). Clean data is the foundation of every reliable insight.

---

## 4. Types of Data

Data comes in many shapes. Knowing the type determines how you analyse it:

### Structured vs Unstructured
- **Structured** — rows and columns, stored in databases (SQL tables, CSV files, Excel sheets)
- **Semi-structured** — has some organisation but not rigid (JSON, XML, logs)
- **Unstructured** — free-form (text documents, images, audio, video)

### Quantitative vs Qualitative
- **Quantitative (numerical)** — can be measured: revenue, temperature, age
  - *Continuous* → can take any value (height = 1.734 m)
  - *Discrete* → whole numbers only (children = 2)
- **Qualitative (categorical)** — labels or categories: country, product name, satisfaction rating
  - *Nominal* → no natural order (colour: red / blue / green)
  - *Ordinal* → ordered categories (rating: poor / average / excellent)

---

## 5. Key Tools in the Data Analytics Ecosystem

| Layer | Tools |
|-------|-------|
| **Programming** | Python (Pandas, NumPy, Matplotlib, Seaborn), R |
| **Query Language** | SQL (PostgreSQL, MySQL, BigQuery, Snowflake) |
| **Spreadsheets** | Microsoft Excel, Google Sheets |
| **BI & Dashboards** | Tableau, Power BI, Looker, Metabase |
| **Notebooks** | Jupyter Notebook, Google Colab |
| **Version Control** | Git + GitHub |
| **Cloud Platforms** | AWS, Google Cloud, Azure |

In this course we'll focus on **Python + SQL** — the two most in-demand skills in every data analytics job description worldwide.

---

## 6. Real-World Applications

Data analytics is used in every industry:

- **E-commerce** — Which products are users browsing but not buying? (funnel analysis)
- **Healthcare** — Which patients are at risk of readmission? (predictive modelling)
- **Finance** — Is this credit card transaction fraudulent? (anomaly detection)
- **Sports** — Which players provide the best value per dollar? (performance analytics)
- **Marketing** — Which campaigns have the highest ROI? (attribution analysis)
- **Manufacturing** — Which machines will fail next week? (predictive maintenance)

> 🚀 **The Global Data Analytics Market** was valued at $51 billion in 2023 and is projected to reach $279 billion by 2030. Demand for analysts is growing 25% faster than the average profession.

---

## 7. What Makes a Great Data Analyst?

Beyond technical skills, the best analysts are:
1. **Curious** — they ask *why* before accepting numbers at face value
2. **Sceptical** — they question data quality and methodology
3. **Communicative** — they can explain complex findings to non-technical audiences
4. **Business-minded** — they connect data to commercial outcomes

You're about to build all of this. Let's go. 🏁`,
    questions: [
      q('Which type of analytics answers the question "What happened?"',
        [{ id: 'a', text: 'Predictive' }, { id: 'b', text: 'Prescriptive' }, { id: 'c', text: 'Descriptive' }, { id: 'd', text: 'Diagnostic' }],
        'c', 'Descriptive analytics summarises historical data to answer "what happened." Examples include monthly sales reports and website traffic summaries.', 0),
      q('Which analytics type answers "Why did it happen?"',
        [{ id: 'a', text: 'Descriptive' }, { id: 'b', text: 'Diagnostic' }, { id: 'c', text: 'Predictive' }, { id: 'd', text: 'Prescriptive' }],
        'b', 'Diagnostic analytics investigates root causes — drilling down into data to understand why a particular outcome occurred.', 1),
      q('What percentage of an analyst\'s time is typically spent on data cleaning and exploration?',
        [{ id: 'a', text: '10–20%' }, { id: 'b', text: '20–40%' }, { id: 'c', text: '60–80%' }, { id: 'd', text: '90–100%' }],
        'c', 'Industry surveys consistently show that data professionals spend 60–80% of project time on data cleaning and exploratory analysis — a critical reason to master these skills early.', 2),
      q('A product manager asks: "Which discount strategy will maximise Q4 profit?" This is an example of which analytics type?',
        [{ id: 'a', text: 'Descriptive' }, { id: 'b', text: 'Diagnostic' }, { id: 'c', text: 'Predictive' }, { id: 'd', text: 'Prescriptive' }],
        'd', 'Prescriptive analytics recommends actions to take to achieve a desired outcome — in this case, maximising profit through an optimal discounting strategy.', 3),
      q('Which of the following is an example of UNSTRUCTURED data?',
        [{ id: 'a', text: 'A CSV file of customer orders' }, { id: 'b', text: 'A SQL table of transactions' }, { id: 'c', text: 'Customer support chat transcripts' }, { id: 'd', text: 'An Excel spreadsheet of product prices' }],
        'c', 'Unstructured data has no predefined schema. Customer chat transcripts are free-form text — unlike CSV files or SQL tables which are structured.', 4),
      q('What type of variable is "Number of products sold"?',
        [{ id: 'a', text: 'Nominal categorical' }, { id: 'b', text: 'Ordinal categorical' }, { id: 'c', text: 'Continuous quantitative' }, { id: 'd', text: 'Discrete quantitative' }],
        'd', 'Products sold is counted in whole numbers and cannot be fractional — making it a discrete quantitative variable.', 5),
      q('A customer satisfaction rating of Poor / Average / Good / Excellent is an example of which data type?',
        [{ id: 'a', text: 'Continuous quantitative' }, { id: 'b', text: 'Nominal categorical' }, { id: 'c', text: 'Ordinal categorical' }, { id: 'd', text: 'Discrete quantitative' }],
        'c', 'Ordinal data has categories with a meaningful order (Poor < Average < Good < Excellent) but the gaps between categories are not necessarily equal.', 6),
      q('Which of the following is the correct order of the data analytics lifecycle?',
        [{ id: 'a', text: 'Collect → Define → Clean → Visualise → Analyse → Communicate' }, { id: 'b', text: 'Define → Collect → Clean → Explore → Analyse → Visualise → Communicate' }, { id: 'c', text: 'Analyse → Collect → Clean → Define → Visualise → Communicate' }, { id: 'd', text: 'Visualise → Define → Collect → Explore → Clean → Communicate' }],
        'b', 'The standard lifecycle starts by defining the business question, then collecting data, cleaning it, exploring it (EDA), performing analysis, visualising results, and finally communicating findings.', 7),
      q('Which tool is specifically designed for interactive data exploration and is widely used by data scientists and analysts?',
        [{ id: 'a', text: 'Microsoft Word' }, { id: 'b', text: 'Adobe Photoshop' }, { id: 'c', text: 'Jupyter Notebook' }, { id: 'd', text: 'Visual Studio Code' }],
        'c', 'Jupyter Notebook allows you to mix executable code, visualisations, and markdown text in a single interactive document — ideal for data exploration and sharing analysis.', 8),
      q('A health insurance company uses historical patient data to predict which customers will file large claims next year. This is best described as:',
        [{ id: 'a', text: 'Descriptive analytics' }, { id: 'b', text: 'Diagnostic analytics' }, { id: 'c', text: 'Predictive analytics' }, { id: 'd', text: 'Prescriptive analytics' }],
        'c', 'Using historical data to forecast future outcomes (large claims) is predictive analytics — a forward-looking discipline that blends statistics and machine learning.', 9),
      q('Which of the following represents SEMI-STRUCTURED data?',
        [{ id: 'a', text: 'A relational database table' }, { id: 'b', text: 'A JSON API response' }, { id: 'c', text: 'A video file' }, { id: 'd', text: 'A handwritten note' }],
        'b', 'JSON has some structure (key-value pairs, nesting) but is not strictly tabular like a relational database — making it semi-structured.', 10),
      q('Which two tools are considered most in-demand for data analytics roles worldwide?',
        [{ id: 'a', text: 'Excel and PowerPoint' }, { id: 'b', text: 'Tableau and R' }, { id: 'c', text: 'Python and SQL' }, { id: 'd', text: 'Java and MongoDB' }],
        'c', 'Python (for data manipulation, analysis, and visualisation) and SQL (for querying databases) consistently appear in the top two required skills across data analytics job postings globally.', 11),
      q('A city\'s traffic department analyses three years of accident records to determine which intersections are most dangerous. What phase of the analytics lifecycle does this primarily represent?',
        [{ id: 'a', text: 'Define' }, { id: 'b', text: 'Collect' }, { id: 'c', text: 'Explore / Analyse' }, { id: 'd', text: 'Communicate' }],
        'c', 'Examining historical records to find patterns (dangerous intersections) is the Explore/Analyse phase — applying statistical and analytical techniques to historical data.', 12),
      q('What distinguishes "height" (1.734 m) as a data type?',
        [{ id: 'a', text: 'Discrete quantitative — only whole numbers' }, { id: 'b', text: 'Nominal categorical — no meaningful order' }, { id: 'c', text: 'Continuous quantitative — can take any value in a range' }, { id: 'd', text: 'Ordinal categorical — ranked categories' }],
        'c', 'Height is continuous because it can take any value within a range (1.0 m, 1.73 m, 1.734 m, etc.) and is measured on an infinite scale.', 13),
      q('Which of the following best describes the role of a Data Analyst?',
        [{ id: 'a', text: 'Builds and trains deep learning neural networks' }, { id: 'b', text: 'Designs user interface layouts for web apps' }, { id: 'c', text: 'Examines data to find patterns and communicates insights to decision-makers' }, { id: 'd', text: 'Manages cloud server infrastructure' }],
        'c', 'A Data Analyst collects, cleans, explores, and analyses data to extract insights, then communicates those findings — often through dashboards and reports — to support business decisions.', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 1 — PANDAS & NUMPY FOUNDATIONS
  // ══════════════════════════════════════════════
  {
    slug:        'da1-pandas-numpy-foundations',
    title:       'Python for Data Analytics — Pandas & NumPy',
    description: 'Master NumPy arrays and Pandas DataFrames: loading data, exploring datasets, slicing with loc/iloc, and understanding dtypes.',
    orderIndex:  1,
    xpReward:    75,
    difficulty:  'BEGINNER',
    language:    'python',
    codeExample: `import pandas as pd
import numpy as np

# ── 1. NumPy array basics ───────────────────────────────────────────
scores = np.array([78, 92, 65, 88, 71, 95, 83])
print("Scores       :", scores)
print("Mean         :", np.mean(scores).round(2))
print("Std deviation:", np.std(scores).round(2))
print("Max / Min    :", scores.max(), "/", scores.min())

# Vectorised operations — no loops needed
bonus = scores * 1.10           # Give everyone 10% bonus
passed = scores[scores >= 75]   # Filter passing scores
print("Passing scores:", passed)

# ── 2. Create a Pandas DataFrame from a dict ────────────────────────
data = {
    "name"    : ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "dept"    : ["Sales", "IT", "Sales", "HR", "IT"],
    "salary"  : [72000, 95000, 68000, 61000, 102000],
    "years"   : [4, 7, 2, 5, 9],
}
df = pd.DataFrame(data)
print("\\n── DataFrame ──────────────────────────────")
print(df)

# ── 3. Exploration ──────────────────────────────────────────────────
print("\\nShape       :", df.shape)          # (rows, cols)
print("Dtypes:\\n",    df.dtypes)
print("\\nDescribe:\\n", df.describe())

# ── 4. Selecting data ───────────────────────────────────────────────
print("\\nIT staff only:\\n", df[df["dept"] == "IT"])
print("\\nTop earner    :", df.loc[df["salary"].idxmax(), "name"])

# ── 5. Adding a computed column ─────────────────────────────────────
df["salary_per_year"] = (df["salary"] / df["years"]).round(0)
print("\\nWith salary-per-year-of-experience:\\n", df)`,
    content: `# Chapter 1 — Python for Data Analytics: Pandas & NumPy

## 🎯 What You'll Learn
NumPy arrays and their vectorised operations; Pandas Series and DataFrames; how to load real data files; exploring datasets with \`shape\`, \`info\`, \`describe\`; selecting data with \`loc\` / \`iloc\`; and creating computed columns.

---

## 1. Why NumPy?

NumPy (Numerical Python) is the bedrock of the entire Python data science stack. Pandas, Scikit-learn, TensorFlow, and PyTorch all rely on it under the hood.

**Key advantage: vectorised operations** — instead of looping over values in Python (slow), NumPy operates on entire arrays at C-speed (fast).

\`\`\`python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6]])   # 2D array

# Properties
print(arr.shape)      # (5,)
print(matrix.shape)   # (2, 3) — 2 rows, 3 cols
print(arr.dtype)      # int64

# Maths — all element-wise, no loops
print(arr * 2)        # [2 4 6 8 10]
print(arr ** 2)       # [1 4 9 16 25]
print(np.sqrt(arr))   # [1.0 1.41 1.73 2.0 2.23]
\`\`\`

### Key NumPy Functions

| Function | Purpose |
|----------|---------|
| \`np.zeros(shape)\` | Array of zeros |
| \`np.ones(shape)\` | Array of ones |
| \`np.arange(start, stop, step)\` | Like Python range() |
| \`np.linspace(start, stop, n)\` | n evenly-spaced values |
| \`np.random.rand(n)\` | n random floats [0, 1) |
| \`np.mean / std / sum / min / max\` | Statistical aggregations |

---

## 2. Pandas — The Analytical Workhorse

Pandas gives you two core data structures:

- **Series** — a 1-D labelled array (like a single column)
- **DataFrame** — a 2-D table of rows × columns (like a spreadsheet)

\`\`\`python
import pandas as pd

# Series
revenue = pd.Series([1200, 1850, 980, 2100], index=["Q1","Q2","Q3","Q4"])
print(revenue["Q3"])       # 980
print(revenue.mean())      # 1532.5

# DataFrame from a dictionary
employees = pd.DataFrame({
    "name"  : ["Alice", "Bob", "Charlie"],
    "salary": [75000, 92000, 68000],
    "dept"  : ["Sales", "IT", "HR"],
})
print(employees)
\`\`\`

---

## 3. Loading Real Data

In practice you'll almost never type data by hand — you'll load files:

\`\`\`python
# CSV (most common)
df = pd.read_csv("sales_data.csv")

# Excel
df = pd.read_excel("report.xlsx", sheet_name="Summary")

# JSON
df = pd.read_json("api_response.json")

# SQL database
import sqlite3
conn = sqlite3.connect("company.db")
df = pd.read_sql("SELECT * FROM orders WHERE year = 2024", conn)
\`\`\`

Key options for \`read_csv\`:
- \`sep=";"\` — specify a different delimiter
- \`header=None\` — no header row
- \`names=["col1","col2"]\` — provide column names
- \`parse_dates=["date_col"]\` — parse dates automatically
- \`nrows=1000\` — load only first 1000 rows

---

## 4. Exploring a Dataset

Before any analysis, always run these five commands:

\`\`\`python
df = pd.read_csv("titanic.csv")

df.shape        # (891, 12)  — 891 rows, 12 columns
df.head(5)      # First 5 rows
df.tail(5)      # Last 5 rows
df.info()       # Column names, dtypes, non-null counts
df.describe()   # Stats for numerical columns
\`\`\`

\`\`\`
df.info() output:
RangeIndex: 891 entries, 0 to 890
Data columns (total 12 columns):
 #   Column    Non-Null Count  Dtype
---  ------    --------------  -----
 0   Survived  891 non-null    int64
 1   Pclass    891 non-null    int64
 2   Name      891 non-null    object
 3   Age       714 non-null    float64  ← 177 missing!
\`\`\`

Checking nulls explicitly:
\`\`\`python
df.isnull().sum()        # Count nulls per column
df.isnull().sum() / len(df) * 100  # As percentage
\`\`\`

---

## 5. Selecting Data: loc vs iloc

This is one of the most important fundamentals to nail:

| Selector | Index type | Example |
|----------|-----------|---------|
| \`df["col"]\` | Column name | \`df["salary"]\` |
| \`df[["c1","c2"]]\` | Multiple columns | \`df[["name","salary"]]\` |
| \`df.loc[row, col]\` | **Label-based** | \`df.loc[0, "name"]\` |
| \`df.iloc[row, col]\` | **Integer-position** | \`df.iloc[0, 1]\` |

\`\`\`python
# Select a column (returns Series)
salaries = df["salary"]

# Select multiple columns (returns DataFrame)
subset = df[["name", "dept", "salary"]]

# loc — label-based (inclusive of both ends)
df.loc[0:4, "name":"salary"]    # Rows 0-4, cols name to salary

# iloc — position-based (exclusive end, like Python slicing)
df.iloc[0:5, 0:3]               # First 5 rows, first 3 columns

# Boolean filtering
high_earners = df[df["salary"] > 90000]
it_staff     = df[df["dept"] == "IT"]
senior_it    = df[(df["dept"] == "IT") & (df["years"] > 5)]
\`\`\`

---

## 6. Creating and Modifying Columns

\`\`\`python
# Add a new column
df["bonus"]       = df["salary"] * 0.10
df["annual_cost"] = df["salary"] + df["bonus"]

# Modify an existing column
df["salary"] = df["salary"].round(-3)  # Round to nearest 1000

# Apply a function to a column
df["name_upper"] = df["name"].apply(str.upper)
df["grade"] = df["score"].apply(lambda s: "Pass" if s >= 60 else "Fail")

# Rename columns
df.rename(columns={"salary": "annual_salary"}, inplace=True)

# Drop a column
df.drop(columns=["bonus"], inplace=True)
\`\`\`

---

## 7. Sorting and Aggregating

\`\`\`python
# Sort by single column
df.sort_values("salary", ascending=False)

# Sort by multiple columns
df.sort_values(["dept", "salary"], ascending=[True, False])

# Group by and aggregate
dept_summary = df.groupby("dept").agg(
    avg_salary=("salary", "mean"),
    headcount=("name", "count"),
    max_salary=("salary", "max"),
).round(0)
print(dept_summary)
\`\`\`

> 🏆 \`groupby().agg()\` is one of the most powerful Pandas tools — it mirrors SQL's \`GROUP BY\` and is used in virtually every real analytics task.`,
    questions: [
      q('What is the primary advantage of NumPy over standard Python lists for numerical computation?',
        [{ id: 'a', text: 'NumPy lists can store strings better' }, { id: 'b', text: 'NumPy operations are vectorised and run at C speed — no Python loops needed' }, { id: 'c', text: 'NumPy automatically creates visualisations' }, { id: 'd', text: 'NumPy can connect to SQL databases' }],
        'b', 'NumPy\'s vectorised operations apply mathematical operations to entire arrays at once using optimised C code — far faster than element-by-element Python loops.', 0),
      q('What does df.shape return?',
        [{ id: 'a', text: 'The number of columns only' }, { id: 'b', text: 'A list of column names' }, { id: 'c', text: 'A tuple of (number_of_rows, number_of_columns)' }, { id: 'd', text: 'The data types of each column' }],
        'c', 'df.shape returns a tuple like (891, 12) — the first number is rows, the second is columns. It\'s the first thing to check when loading a new dataset.', 1),
      q('Which Pandas method gives column names, data types, and non-null counts all at once?',
        [{ id: 'a', text: 'df.describe()' }, { id: 'b', text: 'df.head()' }, { id: 'c', text: 'df.info()' }, { id: 'd', text: 'df.dtypes' }],
        'c', 'df.info() is the single most informative first command — it shows column names, dtypes, non-null counts, and memory usage simultaneously.', 2),
      q('What is the difference between df.loc[] and df.iloc[]?',
        [{ id: 'a', text: 'loc selects columns; iloc selects rows' }, { id: 'b', text: 'loc uses label-based indexing; iloc uses integer-position indexing' }, { id: 'c', text: 'loc is for Series; iloc is for DataFrames' }, { id: 'd', text: 'There is no difference — they are interchangeable' }],
        'b', 'df.loc[] uses row/column labels (names) — df.loc[0:4, "name":"salary"]. df.iloc[] uses integer positions (zero-based) — df.iloc[0:5, 0:3].', 3),
      q('What does pd.read_csv("data.csv") do?',
        [{ id: 'a', text: 'Writes a DataFrame to a CSV file' }, { id: 'b', text: 'Reads a CSV file and returns it as a Pandas DataFrame' }, { id: 'c', text: 'Reads a CSV and returns a NumPy array' }, { id: 'd', text: 'Opens the CSV file in Excel' }],
        'b', 'pd.read_csv() reads a comma-separated values file from disk and returns it as a Pandas DataFrame — the most common data loading operation in Python analytics.', 4),
      q('You have a DataFrame df with columns ["name","dept","salary","years"]. How do you select only the "name" and "salary" columns?',
        [{ id: 'a', text: 'df["name", "salary"]' }, { id: 'b', text: 'df.select(["name","salary"])' }, { id: 'c', text: 'df[["name","salary"]]' }, { id: 'd', text: 'df.loc["name","salary"]' }],
        'c', 'To select multiple columns from a DataFrame, pass a list of column names inside double brackets: df[["name","salary"]]. Single brackets return a Series; double brackets return a DataFrame.', 5),
      q('Which command would filter rows where salary is greater than 80000?',
        [{ id: 'a', text: 'df.filter(salary > 80000)' }, { id: 'b', text: 'df[df["salary"] > 80000]' }, { id: 'c', text: 'df.where("salary", ">", 80000)' }, { id: 'd', text: 'df.loc[salary > 80000]' }],
        'b', 'Boolean indexing is the standard Pandas pattern: create a boolean mask (df["salary"] > 80000) and pass it into df[] to filter matching rows.', 6),
      q('What does np.arange(0, 10, 2) produce?',
        [{ id: 'a', text: '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]' }, { id: 'b', text: '[0, 2, 4, 6, 8]' }, { id: 'c', text: '[2, 4, 6, 8, 10]' }, { id: 'd', text: '[0, 10, 2]' }],
        'b', 'np.arange(start, stop, step) generates values from start (inclusive) to stop (exclusive) in steps of 2: [0, 2, 4, 6, 8].', 7),
      q('Which Pandas method provides statistics (mean, std, min, max, quartiles) for all numerical columns?',
        [{ id: 'a', text: 'df.stats()' }, { id: 'b', text: 'df.info()' }, { id: 'c', text: 'df.summary()' }, { id: 'd', text: 'df.describe()' }],
        'd', 'df.describe() computes count, mean, std, min, 25%, 50%, 75%, and max for every numerical column — a quick statistical snapshot of your dataset.', 8),
      q('What is a Pandas Series?',
        [{ id: 'a', text: 'A 2-D table of rows and columns' }, { id: 'b', text: 'A 1-D labelled array — like a single column' }, { id: 'c', text: 'A Python list with extra features' }, { id: 'd', text: 'A type of NumPy 2D matrix' }],
        'b', 'A Pandas Series is a one-dimensional labelled data structure — essentially a single column with an index. Multiple Series combined form a DataFrame.', 9),
      q('How do you count the number of missing values in each column of a DataFrame df?',
        [{ id: 'a', text: 'df.missing()' }, { id: 'b', text: 'df.count_nulls()' }, { id: 'c', text: 'df.isnull().sum()' }, { id: 'd', text: 'df.nan.count()' }],
        'c', 'df.isnull() returns a boolean DataFrame (True where value is NaN); .sum() counts the Trues per column — giving null counts for each column.', 10),
      q('You want to add a column "bonus" equal to 10% of "salary". What\'s the correct code?',
        [{ id: 'a', text: 'df.add_column("bonus", df["salary"] / 10)' }, { id: 'b', text: 'df["bonus"] = df["salary"] * 0.10' }, { id: 'c', text: 'df.bonus = 0.10' }, { id: 'd', text: 'df.apply("bonus", lambda x: x * 0.10)' }],
        'b', 'Simply assigning to df["bonus"] creates or overwrites that column. The right-hand side can be a scalar, array, or vectorised expression like df["salary"] * 0.10.', 11),
      q('Which groupby aggregation gives the average salary per department?',
        [{ id: 'a', text: 'df.avg("salary").by("dept")' }, { id: 'b', text: 'df.groupby("dept")["salary"].mean()' }, { id: 'c', text: 'df.group("dept").mean("salary")' }, { id: 'd', text: 'df.aggregate("dept", "salary")' }],
        'b', 'df.groupby("dept")["salary"].mean() groups rows by department, selects the salary column, and computes the mean for each group.', 12),
      q('What does df.sort_values("salary", ascending=False) do?',
        [{ id: 'a', text: 'Sorts the DataFrame alphabetically by employee name' }, { id: 'b', text: 'Sorts the DataFrame by salary from highest to lowest' }, { id: 'c', text: 'Removes duplicate salary values' }, { id: 'd', text: 'Filters employees with negative salaries' }],
        'b', 'sort_values() sorts the DataFrame by the specified column. ascending=False means descending order — highest salary first.', 13),
      q('What does df.iloc[0:5, 0:3] select?',
        [{ id: 'a', text: 'Rows with index 0-5 and columns named 0-3' }, { id: 'b', text: 'First 5 rows (positions 0-4) and first 3 columns (positions 0-2)' }, { id: 'c', text: 'All rows and columns 0 to 3' }, { id: 'd', text: 'Rows 0 to 5 (inclusive) and columns 0 to 3 (inclusive)' }],
        'b', 'iloc uses integer positions with Python-style slicing (end is exclusive): 0:5 gives positions 0,1,2,3,4 (5 rows); 0:3 gives positions 0,1,2 (3 columns).', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 2 — DATA CLEANING & PREPROCESSING
  // ══════════════════════════════════════════════
  {
    slug:        'da2-data-cleaning-preprocessing',
    title:       'Data Cleaning & Preprocessing',
    description: 'Handle missing values, remove duplicates, fix data types, detect and treat outliers, and normalise data — the most critical real-world analytics skill.',
    orderIndex:  2,
    xpReward:    100,
    difficulty:  'INTERMEDIATE',
    language:    'python',
    codeExample: `import pandas as pd
import numpy as np

# Build a messy dataset
data = {
    "Name"  : ["Alice", "Bob", "Bob", "Charlie", None, "Eve"],
    "Age"   : [29, 34, 34, None, 41, 300],      # 300 is an outlier
    "Salary": ["72000", "95000", "95000", "68000", "61000", "102000"],
    "City"  : ["  new york ", "london", "london", "Paris ", "tokyo", "PARIS"],
}
df = pd.DataFrame(data)
print("=== Raw Data ===\\n", df)

# ── Step 1: Fix column names ──────────────────────────────────────
df.columns = df.columns.str.lower().str.strip()
print("\\nCleaned columns:", df.columns.tolist())

# ── Step 2: Fix data types ────────────────────────────────────────
df["salary"] = pd.to_numeric(df["salary"])
print("Salary dtype:", df["salary"].dtype)

# ── Step 3: Clean string columns ─────────────────────────────────
df["city"] = df["city"].str.strip().str.title()
df["name"] = df["name"].str.strip()
print("\\nCleaned cities:", df["city"].tolist())

# ── Step 4: Remove duplicates ─────────────────────────────────────
df.drop_duplicates(inplace=True)
print(f"After dedup: {len(df)} rows")

# ── Step 5: Handle missing values ────────────────────────────────
df["name"].fillna("Unknown", inplace=True)       # Fill with constant
df["age"].fillna(df["age"].median(), inplace=True) # Fill with median

# ── Step 6: Handle outlier (Age=300 is impossible) ───────────────
Q1, Q3  = df["age"].quantile(0.25), df["age"].quantile(0.75)
IQR     = Q3 - Q1
lower   = Q1 - 1.5 * IQR
upper   = Q3 + 1.5 * IQR
df["age"] = df["age"].clip(lower, upper)  # Cap at bounds
print("\\n=== Clean Data ===\\n", df)`,
    content: `# Chapter 2 — Data Cleaning & Preprocessing

## 🎯 What You'll Learn
Why data cleaning is the most important — and most time-consuming — analytical skill; how to handle missing values (drop, fill, interpolate); remove duplicates; convert data types; clean text; detect and treat outliers using IQR; and normalise / standardise numerical features.

---

## 1. Why Data Cleaning Matters

> "Garbage in, garbage out." — Every analytics practitioner, ever.

Real-world data is **always** messy. Common problems include:
- **Missing values** — a sensor dropped out, a user left a form blank
- **Duplicates** — a record was inserted twice
- **Wrong types** — salary stored as text ("72,000") instead of a number
- **Inconsistent formatting** — "new york", "New York", " New York " are treated as 3 different cities
- **Outliers** — Age = 300, Salary = -50000
- **Mislabelled categories** — "Male", "male", "M", "MALE" all mean the same thing

A model or analysis built on dirty data will produce confident, wrong answers — which can be worse than no analysis at all.

---

## 2. Handling Missing Values

### Detecting Missing Data
\`\`\`python
df.isnull().sum()              # Count per column
df.isnull().mean() * 100       # Percentage missing

# Visualise missing pattern (requires missingno library)
import missingno as msno
msno.matrix(df)
\`\`\`

### Strategy 1 — Drop
\`\`\`python
df.dropna()                    # Drop rows with ANY null
df.dropna(subset=["salary"])   # Drop only where salary is null
df.dropna(thresh=5)            # Keep rows with at least 5 non-null values
\`\`\`
> ⚠️ Only drop when the missing values are few (< 5%) and randomly distributed. Dropping too many rows introduces bias.

### Strategy 2 — Fill (Imputation)
\`\`\`python
df["age"].fillna(df["age"].mean())      # Mean imputation
df["age"].fillna(df["age"].median())    # Median (better for skewed data)
df["age"].fillna(df["age"].mode()[0])   # Mode (for categorical)
df["city"].fillna("Unknown")            # Constant fill

# Forward fill — use the previous row's value (useful for time series)
df["price"].fillna(method="ffill")

# Backward fill
df["price"].fillna(method="bfill")
\`\`\`

### When to Use Mean vs Median

| Situation | Best Strategy |
|-----------|--------------|
| Roughly symmetric distribution | Mean |
| Skewed distribution or outliers present | **Median** |
| Categorical column | Mode |
| Time-series / ordered data | Forward/Backward fill |

---

## 3. Removing Duplicates

\`\`\`python
# Check for duplicates
df.duplicated().sum()                      # Total duplicate rows
df.duplicated(subset=["name","email"])     # Duplicates on specific columns

# Remove duplicates (keeps first occurrence by default)
df.drop_duplicates(inplace=True)
df.drop_duplicates(subset=["email"], keep="last")  # Keep the newer record
\`\`\`

---

## 4. Fixing Data Types

\`\`\`python
df.dtypes           # Check current types

# Convert to numeric (errors="coerce" turns non-numeric into NaN)
df["salary"] = pd.to_numeric(df["salary"], errors="coerce")

# Convert to datetime
df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d")
df["year"] = df["date"].dt.year       # Extract year
df["month"] = df["date"].dt.month     # Extract month

# Convert to category (saves memory for low-cardinality columns)
df["gender"] = df["gender"].astype("category")

# Convert object to string
df["name"] = df["name"].astype(str)
\`\`\`

---

## 5. Cleaning String / Text Columns

Inconsistencies in text columns silently break groupby operations:

\`\`\`python
col = df["city"]

col.str.strip()                        # Remove leading/trailing whitespace
col.str.lower()                        # Lowercase everything
col.str.upper()                        # Uppercase everything
col.str.title()                        # Title Case
col.str.replace(",", "", regex=False)  # Remove commas from numbers
col.str.replace(r"\\s+", " ", regex=True) # Collapse multiple spaces

# Standardise a messy gender column
gender_map = {"male":"M", "Male":"M", "MALE":"M",
              "female":"F", "Female":"F", "FEMALE":"F"}
df["gender"] = df["gender"].map(gender_map)
\`\`\`

---

## 6. Outlier Detection and Treatment

Outliers can distort means, correlations, and model predictions.

### The IQR Method (Interquartile Range)

\`\`\`python
Q1  = df["salary"].quantile(0.25)   # 25th percentile
Q3  = df["salary"].quantile(0.75)   # 75th percentile
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

# Detect outliers
outliers = df[(df["salary"] < lower_bound) | (df["salary"] > upper_bound)]
print(f"{len(outliers)} outliers found")

# Treatment options:
# 1. Remove them
df = df[(df["salary"] >= lower_bound) & (df["salary"] <= upper_bound)]

# 2. Cap them (Winsorisation)
df["salary"] = df["salary"].clip(lower_bound, upper_bound)

# 3. Replace with median
median_salary = df["salary"].median()
df.loc[df["salary"] > upper_bound, "salary"] = median_salary
\`\`\`

### The Z-Score Method

\`\`\`python
from scipy import stats
z_scores = np.abs(stats.zscore(df["salary"]))
df = df[z_scores < 3]   # Keep rows within 3 standard deviations
\`\`\`

> 📐 **Rule of thumb:** IQR method works better for skewed distributions. Z-score works better for normally distributed data.

---

## 7. Feature Scaling (Normalisation & Standardisation)

Many algorithms are sensitive to the scale of features. A salary of 100,000 and an age of 30 will cause the algorithm to weight salary far more heavily unless scaled.

### Min-Max Normalisation (scales to [0, 1])
\`\`\`python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
df[["salary","age"]] = scaler.fit_transform(df[["salary","age"]])
# Now salary: 0.0 – 1.0; age: 0.0 – 1.0
\`\`\`

### Standardisation (Z-score scaling: mean=0, std=1)
\`\`\`python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
df[["salary","age"]] = scaler.fit_transform(df[["salary","age"]])
# Now: mean ≈ 0, std ≈ 1
\`\`\`

| Technique | Formula | Best Use |
|-----------|---------|---------|
| Min-Max | (x − min) / (max − min) | When range matters; no outliers |
| Standardisation | (x − μ) / σ | General purpose; handles outliers better |

---

## 8. The Full Cleaning Checklist

\`\`\`
✅ Inspect shape, dtypes, and head/tail
✅ Count and visualise missing values
✅ Decide: drop / fill / flag missing data
✅ Remove exact duplicates
✅ Fix data types (numeric, datetime, category)
✅ Standardise categorical text (case, spacing, abbreviations)
✅ Detect and treat outliers
✅ Scale numerical features if needed
✅ Document every decision you make
\`\`\``,
    questions: [
      q('When should you prefer median imputation over mean imputation for missing values?',
        [{ id: 'a', text: 'When the column has a symmetric, bell-shaped distribution' }, { id: 'b', text: 'When the distribution is skewed or contains outliers' }, { id: 'c', text: 'When the column is categorical' }, { id: 'd', text: 'When there are fewer than 10 rows' }],
        'b', 'The median is robust to outliers and skewness — it represents the middle value regardless of extreme observations. Use mean only when data is roughly symmetric.', 0),
      q('What does df.dropna(subset=["salary"]) do?',
        [{ id: 'a', text: 'Drops the "salary" column from the DataFrame' }, { id: 'b', text: 'Fills null values in "salary" with zero' }, { id: 'c', text: 'Removes rows where the "salary" column is null' }, { id: 'd', text: 'Removes all columns except "salary"' }],
        'c', 'dropna(subset=["salary"]) only removes rows where "salary" specifically is missing — other nulls in different columns are preserved.', 1),
      q('What is the IQR (Interquartile Range)?',
        [{ id: 'a', text: 'The range between the minimum and maximum values' }, { id: 'b', text: 'The difference between the 75th and 25th percentiles (Q3 − Q1)' }, { id: 'c', text: 'The standard deviation of the data' }, { id: 'd', text: 'The average of the top 25% of values' }],
        'b', 'IQR = Q3 − Q1. It captures the middle 50% of the data. Points beyond Q1 − 1.5×IQR or Q3 + 1.5×IQR are flagged as potential outliers.', 2),
      q('Which Pandas method removes exact duplicate rows?',
        [{ id: 'a', text: 'df.remove_duplicates()' }, { id: 'b', text: 'df.unique()' }, { id: 'c', text: 'df.drop_duplicates()' }, { id: 'd', text: 'df.deduplicate()' }],
        'c', 'df.drop_duplicates() removes rows where all column values are identical (or a specified subset). inplace=True modifies the original DataFrame.', 3),
      q('What does pd.to_numeric(df["salary"], errors="coerce") do to non-numeric values like "N/A"?',
        [{ id: 'a', text: 'Raises an error and stops execution' }, { id: 'b', text: 'Converts them to 0' }, { id: 'c', text: 'Converts them to NaN (missing)' }, { id: 'd', text: 'Drops the rows with non-numeric values' }],
        'c', 'errors="coerce" silently converts any value that cannot be parsed as a number into NaN — making it safe to run on messy salary columns with text like "N/A" or "$72,000".', 4),
      q('What is "Winsorisation" in the context of outlier treatment?',
        [{ id: 'a', text: 'Removing all rows with outliers' }, { id: 'b', text: 'Replacing outliers with the column mean' }, { id: 'c', text: 'Capping extreme values at a defined boundary (e.g., IQR bounds)' }, { id: 'd', text: 'Applying a log transformation to the column' }],
        'c', 'Winsorisation (or clipping) caps values at defined bounds — e.g., any salary above Q3+1.5×IQR becomes equal to that bound. The row is kept but the extreme value is replaced.', 5),
      q('A column "city" contains "paris", "Paris", " Paris ", and "PARIS". What single Pandas operation would standardise all to "Paris"?',
        [{ id: 'a', text: 'df["city"].str.upper()' }, { id: 'b', text: 'df["city"].str.strip().str.title()' }, { id: 'c', text: 'df["city"].str.lower()' }, { id: 'd', text: 'df["city"].replace("paris", "Paris")' }],
        'b', 'str.strip() removes leading/trailing whitespace; str.title() capitalises the first letter of each word and lowercases the rest — together they standardise all variants to "Paris".', 6),
      q('Min-Max normalisation scales values to which range?',
        [{ id: 'a', text: 'Mean = 0, Std = 1' }, { id: 'b', text: '−1 to +1' }, { id: 'c', text: '0 to 1' }, { id: 'd', text: '0 to 100' }],
        'c', 'Min-Max normalisation applies the formula (x − min) / (max − min), which always produces values in the range [0, 1].', 7),
      q('Standardisation (Z-score scaling) transforms data so that:',
        [{ id: 'a', text: 'All values are between 0 and 1' }, { id: 'b', text: 'The distribution has mean ≈ 0 and standard deviation ≈ 1' }, { id: 'c', text: 'All outliers are removed' }, { id: 'd', text: 'The data becomes normally distributed' }],
        'b', 'Standardisation applies (x − μ) / σ, centering the distribution at 0 and scaling it to unit variance. Note: it does NOT force normality — the shape of the distribution is preserved.', 8),
      q('What does df["date"].dt.year extract?',
        [{ id: 'a', text: 'The datetime object from the date column' }, { id: 'b', text: 'The year portion of each date value as an integer' }, { id: 'c', text: 'The number of days since 1900' }, { id: 'd', text: 'A formatted string like "Year: 2024"' }],
        'b', 'After converting a column to datetime with pd.to_datetime(), the .dt accessor exposes date components: .dt.year, .dt.month, .dt.day, .dt.hour, etc.', 9),
      q('Which method is better for detecting outliers when data is skewed?',
        [{ id: 'a', text: 'Z-score method' }, { id: 'b', text: 'IQR method' }, { id: 'c', text: 'Standard deviation method' }, { id: 'd', text: 'Min-Max method' }],
        'b', 'The IQR method relies on quartiles (medians), which are robust to skew and extremes. Z-score relies on mean and standard deviation, which are pulled by outliers — making it less reliable for skewed data.', 10),
      q('When converting a column to "category" dtype in Pandas, what is the primary benefit?',
        [{ id: 'a', text: 'Enables arithmetic operations on text' }, { id: 'b', text: 'Reduces memory usage for low-cardinality (few unique values) columns' }, { id: 'c', text: 'Automatically removes null values' }, { id: 'd', text: 'Makes groupby operations impossible' }],
        'b', 'The "category" dtype stores each unique category once and uses integer codes internally — dramatically reducing memory for columns with few unique values (e.g., "Male"/"Female", country names).', 11),
      q('In a dataset of 50,000 rows, 3% of the "email" column is missing (1,500 rows). What is the most appropriate strategy?',
        [{ id: 'a', text: 'Drop the entire "email" column' }, { id: 'b', text: 'Fill with a constant like "unknown@example.com"' }, { id: 'c', text: 'Drop those 1,500 rows since 3% is a small proportion' }, { id: 'd', text: 'Fill with the most common email domain' }],
        'c', 'When missing values are few (typically < 5%) and appear randomly, dropping those rows is safe — you retain 97% of data with minimal bias. Filling email with a fake address would introduce noise.', 12),
      q('Which of the following Pandas operations performs forward fill on a time series?',
        [{ id: 'a', text: 'df["price"].fillna(method="ffill")' }, { id: 'b', text: 'df["price"].fillna(method="forward")' }, { id: 'c', text: 'df["price"].fill_forward()' }, { id: 'd', text: 'df["price"].interpolate(method="forward")' }],
        'a', 'fillna(method="ffill") propagates the last valid observation forward — ideal for time series where a missing reading should inherit the previous known value.', 13),
      q('After cleaning, which of the following is an important professional practice?',
        [{ id: 'a', text: 'Delete the original raw data to save disk space' }, { id: 'b', text: 'Document every cleaning decision — what was changed, why, and how' }, { id: 'c', text: 'Never share the cleaned dataset with stakeholders' }, { id: 'd', text: 'Run the model immediately without further exploration' }],
        'b', 'Documenting every cleaning decision creates an audit trail. Stakeholders and future analysts need to understand what transformations were applied — undocumented cleaning steps are a major source of analytical errors.', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 3 — EDA & VISUALISATION
  // ══════════════════════════════════════════════
  {
    slug:        'da3-eda-visualisation',
    title:       'Exploratory Data Analysis & Visualisation',
    description: 'Master EDA with Matplotlib and Seaborn — distributions, boxplots, correlation heatmaps, pairplots, and group-by insights. Turn data into compelling visual stories.',
    orderIndex:  3,
    xpReward:    100,
    difficulty:  'INTERMEDIATE',
    language:    'python',
    codeExample: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# ── Synthetic sales dataset ──────────────────────────────────────
np.random.seed(42)
n = 200
df = pd.DataFrame({
    "region"   : np.random.choice(["North","South","East","West"], n),
    "category" : np.random.choice(["Electronics","Clothing","Food"], n),
    "revenue"  : np.random.lognormal(mean=8, sigma=0.8, size=n).round(2),
    "units"    : np.random.randint(1, 100, n),
    "discount" : np.random.uniform(0, 0.3, n).round(2),
})

print("=== Dataset Overview ===")
print(df.describe().round(2))

# ── 1. Distribution of revenue ────────────────────────────────────
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.hist(df["revenue"], bins=30, color="#0ea5e9", edgecolor="white", alpha=0.85)
plt.title("Revenue Distribution")
plt.xlabel("Revenue ($)")
plt.ylabel("Frequency")

plt.subplot(1, 2, 2)
plt.boxplot(df["revenue"], vert=True, patch_artist=True,
            boxprops=dict(facecolor="#0ea5e9", alpha=0.6))
plt.title("Revenue Boxplot")
plt.ylabel("Revenue ($)")

plt.tight_layout()
plt.savefig("revenue_dist.png", dpi=120)
print("Saved: revenue_dist.png")

# ── 2. Revenue by region (grouped bar) ───────────────────────────
region_stats = df.groupby("region")["revenue"].agg(["mean","median"]).round(2)
print("\\nRevenue by Region:\\n", region_stats)

# ── 3. Correlation ────────────────────────────────────────────────
corr = df[["revenue","units","discount"]].corr().round(2)
print("\\nCorrelation Matrix:\\n", corr)`,
    content: `# Chapter 3 — Exploratory Data Analysis & Visualisation

## 🎯 What You'll Learn
The EDA mindset and process; univariate analysis (histograms, boxplots, bar charts); bivariate analysis (scatter plots, correlation); Matplotlib fundamentals; Seaborn's high-level API; building correlation heatmaps; pairplots; and group-by aggregation with visualisation.

---

## 1. What is EDA?

**Exploratory Data Analysis (EDA)** is the critical process of performing initial investigations on a dataset to:
- Discover patterns
- Spot anomalies
- Test hypotheses
- Check assumptions
- Get a feel for the data before modelling

EDA was formalised by statistician **John Tukey** in 1977. His core philosophy: *"Let the data speak."*

The EDA process:
1. Understand the dataset (shape, types, missings)
2. **Univariate analysis** — one variable at a time
3. **Bivariate analysis** — two variables together
4. **Multivariate analysis** — multiple variables
5. Summarise findings and form hypotheses

---

## 2. Matplotlib — The Foundation

Matplotlib is Python's core plotting library. All other libraries (Seaborn, Pandas plotting) build on top of it.

\`\`\`python
import matplotlib.pyplot as plt

# Basic line chart
x = [1, 2, 3, 4, 5]
y = [10, 24, 18, 35, 29]

plt.figure(figsize=(8, 4))          # Width, height in inches
plt.plot(x, y, color="steelblue", linewidth=2, marker="o", label="Sales")
plt.title("Monthly Sales", fontsize=14, fontweight="bold")
plt.xlabel("Month")
plt.ylabel("Revenue ($K)")
plt.legend()
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig("sales.png", dpi=150)   # Save to file
plt.show()
\`\`\`

### Figure and Axes (the right mental model)
\`\`\`python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # 1 row, 2 columns

axes[0].hist(df["age"], bins=20, color="skyblue")
axes[0].set_title("Age Distribution")

axes[1].boxplot(df["salary"])
axes[1].set_title("Salary Boxplot")

plt.tight_layout()
plt.show()
\`\`\`

---

## 3. Univariate Analysis

Analyse one variable at a time. Goal: understand its distribution.

### Numerical Variables

**Histogram** — shows frequency distribution
\`\`\`python
plt.hist(df["salary"], bins=25, color="#6366f1", edgecolor="white", alpha=0.8)
plt.xlabel("Salary ($)")
plt.ylabel("Count")
plt.title("Salary Distribution")
\`\`\`

**Boxplot** — shows median, IQR, and outliers
\`\`\`python
import seaborn as sns
sns.boxplot(y=df["salary"], color="lightblue")
\`\`\`

Reading a boxplot:
- The box = IQR (Q1 to Q3)
- The line inside = Median
- Whiskers = 1.5 × IQR beyond Q1 and Q3
- Points beyond whiskers = Outliers

### Categorical Variables

**Bar chart** — count of each category
\`\`\`python
df["dept"].value_counts().plot(kind="bar", color="steelblue", edgecolor="white")
plt.title("Employees by Department")
plt.xticks(rotation=45)
\`\`\`

**Pie chart** — proportion (use sparingly — hard to compare)
\`\`\`python
df["region"].value_counts().plot(kind="pie", autopct="%1.1f%%")
\`\`\`

---

## 4. Bivariate Analysis

Analyse the relationship between two variables.

### Two Numerical Variables

**Scatter plot** — looks for correlation
\`\`\`python
plt.scatter(df["years_exp"], df["salary"], alpha=0.6, color="coral")
plt.xlabel("Years of Experience")
plt.ylabel("Salary ($)")
plt.title("Experience vs Salary")
\`\`\`

**Correlation coefficient (r)**:
- r = +1 → perfect positive correlation
- r = 0  → no correlation
- r = −1 → perfect negative correlation

\`\`\`python
r = df["years_exp"].corr(df["salary"])
print(f"Correlation: {r:.3f}")
\`\`\`

### One Numerical + One Categorical

**Box plots by group**
\`\`\`python
sns.boxplot(x="dept", y="salary", data=df, palette="Set2")
plt.title("Salary Distribution by Department")
\`\`\`

**Bar chart with error bars**
\`\`\`python
sns.barplot(x="dept", y="salary", data=df, ci=95, palette="viridis")
\`\`\`

---

## 5. Seaborn — Statistical Visualisation Made Easy

Seaborn wraps Matplotlib with a cleaner API and beautiful defaults:

\`\`\`python
import seaborn as sns
sns.set_theme(style="whitegrid", palette="muted")  # Global style
\`\`\`

### Correlation Heatmap
\`\`\`python
corr_matrix = df[["salary","age","years_exp","bonus"]].corr()

plt.figure(figsize=(7, 5))
sns.heatmap(
    corr_matrix,
    annot=True,      # Show values in cells
    fmt=".2f",       # 2 decimal places
    cmap="coolwarm", # Colour scheme
    vmin=-1, vmax=1, # Fix colour scale
    square=True,
)
plt.title("Correlation Heatmap")
\`\`\`

### Pairplot (multivariate at a glance)
\`\`\`python
sns.pairplot(df[["salary","age","years_exp"]], diag_kind="hist", corner=True)
\`\`\`

### Violin Plot (richer than boxplot)
\`\`\`python
sns.violinplot(x="dept", y="salary", data=df, palette="Set1", inner="quartile")
\`\`\`

### KDE (Kernel Density Estimate) — smooth histogram
\`\`\`python
sns.kdeplot(df["salary"], fill=True, color="steelblue", alpha=0.6)
\`\`\`

---

## 6. Group-By Analysis and Visual Insights

\`\`\`python
# Revenue per region and category
pivot = df.pivot_table(
    values="revenue",
    index="region",
    columns="category",
    aggfunc="mean",
).round(0)

# Heatmap of the pivot table
sns.heatmap(pivot, annot=True, fmt=".0f", cmap="YlOrRd")
plt.title("Average Revenue by Region and Category")
\`\`\`

### Which chart for which question?

| Question | Best Chart |
|----------|-----------|
| How is X distributed? | Histogram, KDE, Boxplot |
| How do categories compare? | Bar chart, Grouped bar |
| What's the relationship between X and Y? | Scatter plot |
| How do many variables correlate? | Heatmap, Pairplot |
| How does X change over time? | Line chart |
| What share does each category have? | Pie / Donut (< 6 categories) |
| How does distribution vary by group? | Box / Violin plot |

---

## 7. The EDA Report Mindset

A good EDA is not just charts — it's a **story**:

1. **Dataset overview** — shape, types, missing values
2. **Univariate summaries** — distribution of each key variable
3. **Anomalies found** — outliers, data quality issues
4. **Relationships discovered** — correlations, group differences
5. **Hypotheses formed** — "IT department earns 40% more than HR — why?"
6. **Next steps** — what analysis or modelling to do next

> 🎨 **Design principle:** Every chart should have a clear title, labelled axes, and a conclusion the reader can understand in 10 seconds.`,
    questions: [
      q('What is the primary purpose of Exploratory Data Analysis (EDA)?',
        [{ id: 'a', text: 'To train machine learning models directly on raw data' }, { id: 'b', text: 'To understand patterns, anomalies, and distributions before formal analysis or modelling' }, { id: 'c', text: 'To clean and preprocess data only' }, { id: 'd', text: 'To create production dashboards for stakeholders' }],
        'b', 'EDA is an investigative process — you explore the data to understand its structure, distributions, relationships, and quality before applying formal statistical or ML techniques.', 0),
      q('What does a boxplot\'s "whisker" represent?',
        [{ id: 'a', text: 'The mean of the data' }, { id: 'b', text: 'The minimum and maximum values' }, { id: 'c', text: '1.5 × IQR beyond Q1 and Q3' }, { id: 'd', text: 'The 10th and 90th percentiles' }],
        'c', 'Boxplot whiskers extend to Q1 − 1.5×IQR (lower) and Q3 + 1.5×IQR (upper). Values beyond the whiskers are plotted as individual points and considered potential outliers.', 1),
      q('A correlation coefficient of −0.87 between two variables means:',
        [{ id: 'a', text: 'A strong positive relationship — as X increases, Y increases' }, { id: 'b', text: 'No relationship between the variables' }, { id: 'c', text: 'A strong negative relationship — as X increases, Y decreases' }, { id: 'd', text: 'A weak negative relationship' }],
        'c', 'Correlation ranges from −1 to +1. −0.87 is close to −1, indicating a strong negative linear relationship — the two variables move in opposite directions together.', 2),
      q('Which Seaborn chart is best for visualising how salary distributions differ across multiple departments simultaneously?',
        [{ id: 'a', text: 'sns.scatterplot()' }, { id: 'b', text: 'sns.kdeplot()' }, { id: 'c', text: 'sns.boxplot(x="dept", y="salary")' }, { id: 'd', text: 'sns.heatmap()' }],
        'c', 'sns.boxplot() with a categorical x-axis creates side-by-side boxplots — perfect for comparing the distribution (median, spread, outliers) of a numerical variable across groups.', 3),
      q('What does sns.heatmap(df.corr(), annot=True) display?',
        [{ id: 'a', text: 'A map of geographic data' }, { id: 'b', text: 'A colour-coded matrix showing correlation values between all numerical columns' }, { id: 'c', text: 'Individual scatter plots for each column pair' }, { id: 'd', text: 'Missing value positions in the DataFrame' }],
        'b', 'df.corr() computes the pairwise correlation matrix; sns.heatmap() renders it as a colour-coded grid; annot=True overlays the numeric correlation values in each cell.', 4),
      q('Which matplotlib command saves a chart to a PNG file?',
        [{ id: 'a', text: 'plt.export("chart.png")' }, { id: 'b', text: 'plt.save("chart.png")' }, { id: 'c', text: 'plt.savefig("chart.png")' }, { id: 'd', text: 'plt.write("chart.png")' }],
        'c', 'plt.savefig("filename.png") saves the current figure to disk. Add dpi=150 or dpi=300 for higher resolution output.', 5),
      q('What chart type is most appropriate for showing how revenue changes across 12 months?',
        [{ id: 'a', text: 'Pie chart' }, { id: 'b', text: 'Scatter plot' }, { id: 'c', text: 'Line chart' }, { id: 'd', text: 'Histogram' }],
        'c', 'Line charts are designed for continuous data over time — they make trends, seasonality, and turning points immediately visible.', 6),
      q('What does sns.pairplot() show?',
        [{ id: 'a', text: 'A correlation heatmap only' }, { id: 'b', text: 'A grid of scatter plots for every column pair, with histograms on the diagonal' }, { id: 'c', text: 'A single scatter plot for two selected variables' }, { id: 'd', text: 'Bar charts for each categorical column' }],
        'b', 'pairplot() creates an n×n grid of charts — scatter plots for every pair of numerical variables, and distribution plots (hist or KDE) on the diagonal. Excellent for a quick multivariate overview.', 7),
      q('In matplotlib, what does figsize=(10, 5) specify?',
        [{ id: 'a', text: 'The resolution in DPI' }, { id: 'b', text: 'The width and height of the figure in inches' }, { id: 'c', text: 'The number of subplots (10 rows, 5 columns)' }, { id: 'd', text: 'The font size for the chart title' }],
        'b', 'figsize=(width, height) specifies the figure dimensions in inches. A larger figure means more screen/print space for labels and details.', 8),
      q('What is a KDE (Kernel Density Estimate) plot?',
        [{ id: 'a', text: 'A bar chart that counts occurrences in bins' }, { id: 'b', text: 'A smoothed continuous probability density curve estimated from the data' }, { id: 'c', text: 'A scatter plot with a fitted regression line' }, { id: 'd', text: 'A network graph of variable relationships' }],
        'b', 'A KDE plot estimates the probability density function of the data using a smoothing kernel — showing the shape of the distribution without arbitrary bin choices.', 9),
      q('You want to see how average salary varies by both department AND gender simultaneously. The best chart approach is:',
        [{ id: 'a', text: 'A simple bar chart of departments' }, { id: 'b', text: 'A histogram with 20 bins' }, { id: 'c', text: 'A grouped or stacked bar chart with department on x-axis and hue=gender' }, { id: 'd', text: 'A pie chart for each gender separately' }],
        'c', 'A grouped bar chart with hue="gender" shows salary bars for each gender side by side within each department — directly comparing two dimensions simultaneously.', 10),
      q('What does plt.subplot(1, 2, 1) mean in matplotlib?',
        [{ id: 'a', text: 'Create a figure with 1 row, 2 columns, and activate the 1st subplot' }, { id: 'b', text: 'Create a figure with 2 rows, 1 column, and activate subplot 1' }, { id: 'c', text: 'Set the figure size to (1, 2) inches with 1 plot' }, { id: 'd', text: 'Create a 1×2 scatter plot matrix' }],
        'a', 'plt.subplot(rows, cols, index) — so (1, 2, 1) creates a 1-row, 2-column layout and activates the first subplot. The next call plt.subplot(1, 2, 2) would activate the second.', 11),
      q('Which of the following is an example of bivariate analysis?',
        [{ id: 'a', text: 'Plotting a histogram of salary values' }, { id: 'b', text: 'Computing the mean of the age column' }, { id: 'c', text: 'Plotting a scatter plot of experience vs salary' }, { id: 'd', text: 'Counting null values in each column' }],
        'c', 'Bivariate analysis examines the relationship between exactly two variables. A scatter plot of experience vs salary shows how one variable relates to the other.', 12),
      q('The EDA mindset is best described as:',
        [{ id: 'a', text: 'Immediately applying the most complex model available' }, { id: 'b', text: 'Running a fixed set of standard charts for every dataset' }, { id: 'c', text: 'Letting the data speak — asking questions, forming hypotheses, and following the evidence' }, { id: 'd', text: 'Cleaning data without visualising it' }],
        'c', 'EDA is an iterative, questioning process — you form a hypothesis from a chart, test it with another chart or calculation, refine your understanding, and repeat.', 13),
      q('What is a pivot table in the context of Pandas analytics?',
        [{ id: 'a', text: 'A method to sort DataFrame rows alphabetically' }, { id: 'b', text: 'A 2-D summary table that aggregates values by row and column categories' }, { id: 'c', text: 'A tool to reshape wide data to long format' }, { id: 'd', text: 'A function to remove null values' }],
        'b', 'pd.pivot_table() creates a 2-D summary (like a cross-tab) — you specify a value column, an index (rows), and columns, then choose an aggregation function (mean, sum, count). Perfect for comparing revenue across region × product category.', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 4 — SQL FOR DATA ANALYTICS
  // ══════════════════════════════════════════════
  {
    slug:        'da4-sql-for-analytics',
    title:       'SQL for Data Analytics',
    description: 'Master SQL from SELECT basics to GROUP BY, JOINs, CTEs, and powerful window functions — the universal language of data retrieval and transformation.',
    orderIndex:  4,
    xpReward:    125,
    difficulty:  'INTERMEDIATE',
    language:    'python',
    codeExample: `import sqlite3
import pandas as pd

# ── Create an in-memory database and seed it ───────────────────────
conn = sqlite3.connect(":memory:")
cur  = conn.cursor()

cur.executescript("""
CREATE TABLE employees (
    id INT PRIMARY KEY, name TEXT, dept TEXT, salary INT, hire_year INT
);
CREATE TABLE departments (
    dept TEXT PRIMARY KEY, budget INT, manager TEXT
);
INSERT INTO employees VALUES
  (1,'Alice','Sales',72000,2019),(2,'Bob','IT',95000,2017),
  (3,'Charlie','Sales',68000,2021),(4,'Diana','HR',61000,2020),
  (5,'Eve','IT',102000,2016),(6,'Frank','HR',58000,2022),
  (7,'Grace','IT',88000,2018),(8,'Hank','Sales',75000,2019);
INSERT INTO departments VALUES
  ('Sales',500000,'Alice'),('IT',800000,'Bob'),('HR',300000,'Diana');
""")
conn.commit()

# ── 1. Basic SELECT with WHERE and ORDER ──────────────────────────
q1 = pd.read_sql("""
    SELECT name, dept, salary
    FROM   employees
    WHERE  salary > 70000
    ORDER  BY salary DESC
""", conn)
print("=== High Earners ===\\n", q1.to_string(index=False))

# ── 2. GROUP BY aggregation ───────────────────────────────────────
q2 = pd.read_sql("""
    SELECT dept,
           COUNT(*)            AS headcount,
           ROUND(AVG(salary))  AS avg_salary,
           MAX(salary)         AS top_salary
    FROM   employees
    GROUP  BY dept
    HAVING AVG(salary) > 65000
    ORDER  BY avg_salary DESC
""", conn)
print("\\n=== Dept Summary (avg > 65k) ===\\n", q2.to_string(index=False))

# ── 3. JOIN employees ↔ departments ──────────────────────────────
q3 = pd.read_sql("""
    SELECT e.name, e.salary, d.budget,
           ROUND(CAST(e.salary AS FLOAT) / d.budget * 100, 2) AS salary_pct_budget
    FROM   employees e
    JOIN   departments d ON e.dept = d.dept
    ORDER  BY salary_pct_budget DESC
    LIMIT  4
""", conn)
print("\\n=== Salary as % of Dept Budget ===\\n", q3.to_string(index=False))

# ── 4. Window function: rank within department ─────────────────────
q4 = pd.read_sql("""
    SELECT name, dept, salary,
           RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rank_in_dept
    FROM   employees
""", conn)
print("\\n=== Salary Rank by Dept ===\\n", q4.to_string(index=False))
conn.close()`,
    content: `# Chapter 4 — SQL for Data Analytics

## 🎯 What You'll Learn
Why SQL is indispensable for analytics; writing SELECT queries with WHERE, ORDER BY, and LIMIT; aggregate functions and GROUP BY with HAVING; all four JOIN types; subqueries and Common Table Expressions (CTEs); and powerful window functions (ROW_NUMBER, RANK, LAG, LEAD).

---

## 1. Why SQL for Analytics?

**SQL (Structured Query Language)** is the universal language for retrieving and transforming data stored in relational databases. It's been around since the 1970s and is still the #1 required skill in data analytics job postings.

> 📊 A data analyst who knows Python but not SQL is like a chef who can cook but not read a recipe — they'll get by, but they'll miss 60% of the work.

Every major data platform understands SQL:
- **PostgreSQL, MySQL, SQLite** — open-source relational DBs
- **Google BigQuery, Snowflake, Redshift** — cloud data warehouses
- **Microsoft SQL Server** — enterprise standard
- **DuckDB** — fast local analytics (query CSVs directly with SQL)

---

## 2. The Basic SELECT Query

\`\`\`sql
SELECT column1, column2, ...
FROM   table_name
WHERE  condition
ORDER  BY column1 DESC
LIMIT  10;
\`\`\`

Real examples:
\`\`\`sql
-- Select all columns
SELECT * FROM orders;

-- Select specific columns
SELECT customer_name, total_amount, order_date
FROM   orders;

-- Filter with WHERE
SELECT *
FROM   orders
WHERE  total_amount > 500
  AND  status = 'completed';

-- Multiple conditions
WHERE  (country = 'USA' OR country = 'Canada')
  AND  total_amount BETWEEN 100 AND 1000;

-- Pattern matching
WHERE  email LIKE '%@gmail.com';

-- NULL handling
WHERE  phone_number IS NOT NULL;
\`\`\`

### Useful Operators

| Operator | Example |
|----------|---------|
| = | WHERE dept = 'IT' |
| >, <, >=, <= | WHERE salary >= 80000 |
| BETWEEN | WHERE age BETWEEN 25 AND 40 |
| IN | WHERE country IN ('USA','UK','CA') |
| LIKE | WHERE name LIKE 'A%' (starts with A) |
| IS NULL / IS NOT NULL | WHERE phone IS NULL |
| NOT | WHERE status NOT IN ('cancelled') |

---

## 3. Aggregate Functions and GROUP BY

Aggregates summarise groups of rows into single values:

\`\`\`sql
SELECT
    dept,
    COUNT(*)             AS employee_count,
    SUM(salary)          AS total_payroll,
    AVG(salary)          AS avg_salary,
    MAX(salary)          AS highest_salary,
    MIN(salary)          AS lowest_salary,
    ROUND(AVG(salary), 0) AS avg_salary_rounded
FROM  employees
GROUP BY dept
ORDER BY avg_salary DESC;
\`\`\`

### HAVING — Filter After Grouping

\`\`\`sql
-- WHERE filters rows BEFORE grouping
-- HAVING filters groups AFTER aggregation

SELECT   dept, AVG(salary) AS avg_sal
FROM     employees
WHERE    hire_year >= 2018          -- Only recent hires
GROUP BY dept
HAVING   AVG(salary) > 70000       -- Only depts above $70k avg
ORDER BY avg_sal DESC;
\`\`\`

> 🔑 **Key rule**: Use WHERE to filter rows; use HAVING to filter groups.

---

## 4. JOINs — Combining Tables

JOINs link tables on a shared key (like a foreign key relationship).

\`\`\`sql
-- employees (id, name, dept_id, salary)
-- departments (id, dept_name, budget, manager)
\`\`\`

### INNER JOIN — Only matching rows
\`\`\`sql
SELECT e.name, e.salary, d.dept_name, d.budget
FROM   employees e
INNER  JOIN departments d ON e.dept_id = d.id;
-- Only employees who have a matching department
\`\`\`

### LEFT JOIN — All left rows + matching right
\`\`\`sql
SELECT e.name, d.dept_name
FROM   employees e
LEFT   JOIN departments d ON e.dept_id = d.id;
-- ALL employees returned; dept_name = NULL if no department match
\`\`\`

### RIGHT JOIN — All right rows + matching left
\`\`\`sql
SELECT e.name, d.dept_name
FROM   employees e
RIGHT  JOIN departments d ON e.dept_id = d.id;
-- ALL departments returned; employee columns NULL if no employees
\`\`\`

### FULL OUTER JOIN — All rows from both
\`\`\`sql
SELECT e.name, d.dept_name
FROM   employees e
FULL   OUTER JOIN departments d ON e.dept_id = d.id;
-- Every row from both tables; NULLs where no match
\`\`\`

**Practical tip:** In analytics, INNER JOIN and LEFT JOIN cover 95% of use cases.

---

## 5. Subqueries

A subquery is a query nested inside another query:

\`\`\`sql
-- Find employees who earn more than the company average
SELECT name, salary
FROM   employees
WHERE  salary > (
    SELECT AVG(salary) FROM employees
);

-- Find the department with the highest average salary
SELECT dept
FROM   employees
GROUP  BY dept
ORDER  BY AVG(salary) DESC
LIMIT  1;

-- Subquery in FROM (derived table)
SELECT dept, avg_sal
FROM  (
    SELECT dept, AVG(salary) AS avg_sal
    FROM   employees
    GROUP  BY dept
) AS dept_averages
WHERE avg_sal > 75000;
\`\`\`

---

## 6. Common Table Expressions (CTEs)

CTEs make complex queries readable by naming intermediate results:

\`\`\`sql
WITH dept_stats AS (
    SELECT
        dept,
        AVG(salary)  AS avg_sal,
        COUNT(*)     AS headcount
    FROM  employees
    GROUP BY dept
),
high_value_depts AS (
    SELECT dept
    FROM   dept_stats
    WHERE  avg_sal > 75000
)
SELECT e.name, e.salary, e.dept
FROM   employees e
JOIN   high_value_depts h ON e.dept = h.dept
ORDER  BY e.salary DESC;
\`\`\`

> 💡 **CTE vs Subquery**: CTEs are named, reusable, and easier to read. They run top-to-bottom like a recipe. Prefer CTEs for complex multi-step analytics.

---

## 7. Window Functions — Advanced Analytics

Window functions perform calculations across a set of rows **without collapsing them** (unlike GROUP BY). They are the hallmark of advanced SQL analytics.

\`\`\`sql
SELECT
    name,
    dept,
    salary,
    -- Rank within each department by salary (highest = rank 1)
    RANK()       OVER (PARTITION BY dept ORDER BY salary DESC) AS dept_rank,
    -- Running total of salaries across entire company
    SUM(salary)  OVER (ORDER BY hire_date)                    AS running_total,
    -- Previous row's salary (for month-over-month comparison)
    LAG(salary)  OVER (ORDER BY hire_date)                    AS prev_salary,
    -- Next row's salary
    LEAD(salary) OVER (ORDER BY hire_date)                    AS next_salary,
    -- Each employee's salary vs their department average
    salary - AVG(salary) OVER (PARTITION BY dept)             AS vs_dept_avg
FROM employees;
\`\`\`

### Key Window Functions

| Function | Purpose |
|----------|---------|
| ROW_NUMBER() | Unique sequential number (no ties) |
| RANK() | Rank with gaps for ties (1, 2, 2, 4) |
| DENSE_RANK() | Rank without gaps (1, 2, 2, 3) |
| SUM() / AVG() OVER(...) | Running or partitioned aggregation |
| LAG(col, n) | Value from n rows behind (default 1) |
| LEAD(col, n) | Value from n rows ahead |
| NTILE(n) | Divide rows into n equal buckets |

### Real Example: Month-over-Month Revenue Change
\`\`\`sql
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(revenue)                    AS total_revenue
    FROM orders
    GROUP BY 1
)
SELECT
    month,
    total_revenue,
    LAG(total_revenue) OVER (ORDER BY month)   AS prev_month_revenue,
    ROUND(
        (total_revenue - LAG(total_revenue) OVER (ORDER BY month))
        / LAG(total_revenue) OVER (ORDER BY month) * 100, 1
    ) AS mom_pct_change
FROM monthly
ORDER BY month;
\`\`\`

---

## 8. SQL Best Practices for Analytics

\`\`\`sql
-- ✅ Always alias your aggregations
SELECT dept, COUNT(*) AS employee_count  -- NOT just COUNT(*)

-- ✅ Use CTEs for readability
WITH base AS (SELECT ...), enriched AS (SELECT ... FROM base) SELECT * FROM enriched;

-- ✅ Always include ORDER BY for deterministic results
ORDER BY created_at DESC

-- ✅ Use LIMIT when exploring large tables
SELECT * FROM orders LIMIT 100;

-- ✅ Filter early (WHERE reduces rows before GROUP BY)
WHERE status = 'active' AND created_at >= '2024-01-01'
\`\`\``,
    questions: [
      q('What is the primary purpose of the WHERE clause in SQL?',
        [{ id: 'a', text: 'To group rows into categories' }, { id: 'b', text: 'To filter rows BEFORE any grouping or aggregation' }, { id: 'c', text: 'To sort the result set' }, { id: 'd', text: 'To filter groups AFTER aggregation' }],
        'b', 'WHERE filters individual rows before GROUP BY and aggregation. It\'s applied early in query execution to reduce the working dataset.', 0),
      q('What does the HAVING clause do, and when must you use it instead of WHERE?',
        [{ id: 'a', text: 'HAVING filters rows before grouping; use it instead of WHERE for better performance' }, { id: 'b', text: 'HAVING filters aggregated results AFTER GROUP BY; required when filtering on aggregate functions like AVG(salary) > 70000' }, { id: 'c', text: 'HAVING and WHERE are interchangeable — use either' }, { id: 'd', text: 'HAVING sorts results in descending order' }],
        'b', 'WHERE cannot reference aggregate functions (SUM, AVG, COUNT). HAVING is designed for filtering after aggregation — e.g., HAVING COUNT(*) > 5 or HAVING AVG(salary) > 70000.', 1),
      q('What does an INNER JOIN return?',
        [{ id: 'a', text: 'All rows from both tables, with NULLs where there is no match' }, { id: 'b', text: 'All rows from the left table, with NULLs for unmatched right rows' }, { id: 'c', text: 'Only rows where the join condition is met in BOTH tables' }, { id: 'd', text: 'All rows from the right table, with NULLs for unmatched left rows' }],
        'c', 'INNER JOIN is the most restrictive join — it returns only rows where the join condition (ON clause) is satisfied in both tables. Unmatched rows from either table are excluded.', 2),
      q('You want to find all customers who have NOT placed any orders. Which JOIN is most appropriate?',
        [{ id: 'a', text: 'INNER JOIN' }, { id: 'b', text: 'LEFT JOIN with WHERE orders.id IS NULL' }, { id: 'c', text: 'RIGHT JOIN' }, { id: 'd', text: 'FULL OUTER JOIN' }],
        'b', 'LEFT JOIN returns all customers; WHERE orders.id IS NULL filters to only those with no matching order — a classic "anti-join" pattern for finding unmatched records.', 3),
      q('What is a CTE (Common Table Expression)?',
        [{ id: 'a', text: 'A type of index used to speed up queries' }, { id: 'b', text: 'A temporary, named result set defined with the WITH keyword, referenced in the main query' }, { id: 'c', text: 'A stored procedure that runs on a schedule' }, { id: 'd', text: 'A way to create permanent views in the database' }],
        'b', 'CTEs use WITH cte_name AS (SELECT ...) to define a named intermediate result. They make complex multi-step queries readable and maintainable — similar to creating a temporary variable.', 4),
      q('What does SELECT COUNT(*) FROM employees WHERE dept = "IT" return?',
        [{ id: 'a', text: 'The sum of all salaries in the IT department' }, { id: 'b', text: 'The number of rows in the employees table for the IT department' }, { id: 'c', text: 'A list of all IT employees\' names' }, { id: 'd', text: 'The average salary in IT' }],
        'b', 'COUNT(*) counts the number of rows matching the WHERE condition — in this case, the total number of employees in the IT department.', 5),
      q('Which SQL window function gives each row a unique sequential number (1, 2, 3...) with no gaps or ties?',
        [{ id: 'a', text: 'RANK()' }, { id: 'b', text: 'DENSE_RANK()' }, { id: 'c', text: 'ROW_NUMBER()' }, { id: 'd', text: 'NTILE()' }],
        'c', 'ROW_NUMBER() assigns unique consecutive integers starting from 1 — even if two rows have identical values, they get different row numbers. RANK() and DENSE_RANK() handle ties differently.', 6),
      q('What does RANK() OVER (PARTITION BY dept ORDER BY salary DESC) do?',
        [{ id: 'a', text: 'Returns the overall company-wide salary rank' }, { id: 'b', text: 'Computes the average salary per department' }, { id: 'c', text: 'Assigns a salary rank within each department independently' }, { id: 'd', text: 'Removes duplicate salary values within each department' }],
        'c', 'PARTITION BY dept restarts the ranking for each department; ORDER BY salary DESC ranks from highest to lowest. The result is each employee\'s salary rank compared only to their own department colleagues.', 7),
      q('What does the LAG() window function do?',
        [{ id: 'a', text: 'Returns the next row\'s value in the ordered result' }, { id: 'b', text: 'Returns the value from a preceding row in the ordered window' }, { id: 'c', text: 'Computes a running total' }, { id: 'd', text: 'Divides rows into equal-sized buckets' }],
        'b', 'LAG(col, n) returns the value from n rows behind the current row in the window\'s ORDER BY sequence. It\'s essential for period-over-period comparisons (e.g., previous month\'s revenue).', 8),
      q('In SQL, which aggregate function would you use to find the total revenue per product category?',
        [{ id: 'a', text: 'COUNT(revenue)' }, { id: 'b', text: 'AVG(revenue)' }, { id: 'c', text: 'SUM(revenue)' }, { id: 'd', text: 'MAX(revenue)' }],
        'c', 'SUM(revenue) totals all revenue values within each group. Combined with GROUP BY category, it gives the total revenue per product category.', 9),
      q('What makes window functions fundamentally different from GROUP BY aggregations?',
        [{ id: 'a', text: 'Window functions only work on dates; GROUP BY works on any column' }, { id: 'b', text: 'Window functions are slower and should be avoided' }, { id: 'c', text: 'Window functions compute aggregations without collapsing rows — every original row is preserved in the output' }, { id: 'd', text: 'Window functions require a WHERE clause to work' }],
        'c', 'GROUP BY collapses multiple rows into one summary row per group. Window functions compute across rows but keep all rows intact — you get both the original values AND the window computation on every row.', 10),
      q('Which SQL keyword is used to find customers whose email ends in "@gmail.com"?',
        [{ id: 'a', text: 'WHERE email = "@gmail.com"' }, { id: 'b', text: 'WHERE email CONTAINS "@gmail.com"' }, { id: 'c', text: 'WHERE email LIKE "%@gmail.com"' }, { id: 'd', text: 'WHERE email IN ("@gmail.com")' }],
        'c', 'LIKE with the % wildcard matches any sequence of characters. %@gmail.com matches any string that ends with "@gmail.com".', 11),
      q('What does SELECT * FROM orders LIMIT 100 do?',
        [{ id: 'a', text: 'Returns only 100 distinct values from the orders table' }, { id: 'b', text: 'Returns the first 100 rows from the orders table' }, { id: 'c', text: 'Counts the number of orders up to 100' }, { id: 'd', text: 'Deletes rows beyond 100' }],
        'b', 'LIMIT n restricts the result set to the first n rows. It\'s essential when exploring large tables to avoid retrieving millions of rows accidentally.', 12),
      q('You have tables: orders (order_id, customer_id, amount) and customers (customer_id, name, country). How do you get each customer\'s name alongside their order total?',
        [{ id: 'a', text: 'SELECT name, SUM(amount) FROM orders, customers' }, { id: 'b', text: 'SELECT c.name, SUM(o.amount) FROM orders o JOIN customers c ON o.customer_id = c.customer_id GROUP BY c.name' }, { id: 'c', text: 'SELECT name, amount FROM customers WHERE order_id > 0' }, { id: 'd', text: 'SELECT name, SUM(amount) FROM customers GROUP BY order_id' }],
        'b', 'You need a JOIN (on customer_id) to combine the two tables, then GROUP BY c.name with SUM(o.amount) to aggregate each customer\'s orders into a total.', 13),
      q('What is the key advantage of using CTEs over nested subqueries?',
        [{ id: 'a', text: 'CTEs run faster than subqueries in all databases' }, { id: 'b', text: 'CTEs can only be used with window functions' }, { id: 'c', text: 'CTEs improve readability by giving names to intermediate result sets, making complex queries easier to understand and maintain' }, { id: 'd', text: 'CTEs eliminate the need for JOIN operations' }],
        'c', 'CTEs don\'t always perform faster, but they dramatically improve code readability. Breaking a complex query into named steps (like functions in a program) makes it easier to debug, review, and extend.', 14),
    ],
  },

] as const;

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Creating Data Analytics course (Module 2)...\n');

  // 1. Upsert the course
  let course = await prisma.course.findUnique({ where: { slug: COURSE.slug } });

  if (course) {
    console.log(`⚠️  Course "${COURSE.slug}" already exists — clearing existing chapters for a clean re-seed.`);
    await prisma.chapter.deleteMany({ where: { courseId: course.id } });
  } else {
    course = await prisma.course.create({ data: COURSE });
    console.log(`✅ Created course: ${course.title} (id: ${course.id})`);
  }

  console.log(`📚 Seeding ${CHAPTERS.length} chapters...\n`);

  for (const ch of CHAPTERS) {
    const { questions, ...chapterData } = ch as any;

    const chapter = await prisma.chapter.create({
      data: { ...chapterData, courseId: course.id },
    });

    await prisma.quiz.create({
      data: {
        chapterId:   chapter.id,
        title:       `${chapterData.title} — Quiz`,
        description: `Test your understanding of ${chapterData.title}`,
        timeLimit:   1800,   // 30 minutes
        passingScore: 70,
        xpReward:    Math.round(chapterData.xpReward * 1.5),
        questions:   { create: questions },
      },
    });

    console.log(`  ✅ [${chapterData.orderIndex}] ${chapterData.title}  (${questions.length} Qs, ${chapterData.xpReward} XP)`);
  }

  console.log(`\n🎉 Done! Data Analytics module now has ${CHAPTERS.length} chapters ready to explore.`);
  console.log('   Chapters cover: Introduction → Pandas/NumPy → Data Cleaning → EDA/Viz → SQL');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
