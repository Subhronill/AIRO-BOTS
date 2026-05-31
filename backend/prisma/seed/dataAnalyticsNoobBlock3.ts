import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
//  Data Analytics · Noob Level · Block 3  (chapters 9 – 12)
//  9.  Data Cleaning in Python with Pandas
//  10. Basic Statistics for Data Analysts
//  11. Data Visualization with Matplotlib & Seaborn
//  12. Power BI & Tableau — BI Tools Introduction
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTERS = [
  // ── Chapter 9 ──────────────────────────────────────────────────────────────
  {
    slug: 'da-noob-9-data-cleaning-python',
    title: 'Data Cleaning in Python with Pandas',
    description:
      'Real-world data is messy — missing values, duplicates, wrong types and outliers. Learn the complete Pandas toolkit for transforming dirty data into analysis-ready datasets.',
    orderIndex: 9,
    xpReward: 85,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Data Cleaning in Python with Pandas

> **"Garbage in, garbage out."** — 80 % of a data analyst's time is spent cleaning data. Master it and you'll outperform analysts who skip straight to models.

---

## Why Data Cleaning Matters

Before any analysis, data must be:
- **Complete** — no critical missing values
- **Consistent** — same format, same units, same categories
- **Correct** — no impossible values or obvious errors
- **Deduplicated** — no phantom rows inflating counts

Skip cleaning and your bar chart might show "New York", "new york", "NY", and "N.Y." as four separate cities.

---

## 1. Inspecting Your Dataset First

Always start by *understanding* the data before touching it.

\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv('sales_data.csv')

# Shape
print(df.shape)          # (rows, columns)

# Column names and data types
print(df.dtypes)

# First 5 rows
print(df.head())

# Summary statistics for numeric columns
print(df.describe())

# Missing value count per column
print(df.isnull().sum())

# Percentage missing
missing_pct = (df.isnull().sum() / len(df) * 100).round(2)
print(missing_pct[missing_pct > 0])
\`\`\`

---

## 2. Handling Missing Values

### 2a. Drop rows or columns

\`\`\`python
# Drop rows where ANY value is missing
df_clean = df.dropna()

# Drop rows only if ALL values are missing
df_clean = df.dropna(how='all')

# Drop columns with more than 50% missing
threshold = len(df) * 0.5
df_clean = df.dropna(thresh=threshold, axis=1)
\`\`\`

### 2b. Fill with a constant

\`\`\`python
# Fill numeric with 0
df['quantity'] = df['quantity'].fillna(0)

# Fill text with placeholder
df['category'] = df['category'].fillna('Unknown')
\`\`\`

### 2c. Fill with statistical measures

\`\`\`python
# Mean imputation (good for normally distributed data)
df['price'] = df['price'].fillna(df['price'].mean())

# Median imputation (better when outliers present)
df['salary'] = df['salary'].fillna(df['salary'].median())

# Mode imputation for categorical columns
df['region'] = df['region'].fillna(df['region'].mode()[0])
\`\`\`

### 2d. Forward / backward fill (time series)

\`\`\`python
# Forward fill — carry last known value forward
df['temperature'] = df['temperature'].ffill()

# Backward fill
df['temperature'] = df['temperature'].bfill()
\`\`\`

---

## 3. Removing Duplicates

\`\`\`python
# Check how many duplicates exist
print(f"Duplicates: {df.duplicated().sum()}")

# View duplicate rows
print(df[df.duplicated(keep=False)])

# Remove duplicates — keep first occurrence
df = df.drop_duplicates()

# Remove duplicates based on specific columns
df = df.drop_duplicates(subset=['order_id', 'product_id'], keep='first')
\`\`\`

---

## 4. Fixing Data Types

\`\`\`python
# Convert string to number
df['revenue'] = pd.to_numeric(df['revenue'], errors='coerce')
# errors='coerce' turns unconvertible values into NaN instead of crashing

# Convert to integer
df['quantity'] = df['quantity'].astype(int)

# Convert to datetime
df['order_date'] = pd.to_datetime(df['order_date'])
df['order_date'] = pd.to_datetime(df['order_date'], format='%d/%m/%Y')

# Extract date parts
df['year']  = df['order_date'].dt.year
df['month'] = df['order_date'].dt.month
df['day']   = df['order_date'].dt.day_name()

# Convert to category (saves memory, faster groupby)
df['region'] = df['region'].astype('category')
\`\`\`

---

## 5. Cleaning String / Text Data

\`\`\`python
# Strip leading/trailing whitespace
df['city'] = df['city'].str.strip()

# Lowercase everything
df['city'] = df['city'].str.lower()

# Title case
df['name'] = df['name'].str.title()

# Remove unwanted characters
df['phone'] = df['phone'].str.replace(r'[^0-9]', '', regex=True)

# Replace multiple inconsistent values
df['status'] = df['status'].replace({
    'active': 'Active',
    'ACTIVE': 'Active',
    'act':    'Active',
    'inactive': 'Inactive',
    'INACTIVE': 'Inactive',
})

# Check unique values to spot inconsistencies
print(df['status'].value_counts())
\`\`\`

---

## 6. Detecting and Handling Outliers

### 6a. IQR Method (robust, non-parametric)

\`\`\`python
Q1 = df['salary'].quantile(0.25)
Q3 = df['salary'].quantile(0.75)
IQR = Q3 - Q1

lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

outliers = df[(df['salary'] < lower) | (df['salary'] > upper)]
print(f"Outliers found: {len(outliers)}")

# Option 1: Remove outliers
df_no_outliers = df[(df['salary'] >= lower) & (df['salary'] <= upper)]

# Option 2: Cap (winsorize)
df['salary'] = df['salary'].clip(lower=lower, upper=upper)
\`\`\`

### 6b. Z-Score Method (assumes normal distribution)

\`\`\`python
from scipy import stats

z_scores = np.abs(stats.zscore(df['salary']))
df_clean = df[z_scores < 3]   # keep rows within 3 std devs
\`\`\`

---

## 7. Renaming and Restructuring

\`\`\`python
# Rename specific columns
df = df.rename(columns={
    'Cust ID':   'customer_id',
    'Prod Name': 'product_name',
    'Rev ($)':   'revenue_usd',
})

# Make ALL column names snake_case
df.columns = (df.columns
    .str.strip()
    .str.lower()
    .str.replace(' ', '_', regex=False)
    .str.replace(r'[^a-z0-9_]', '', regex=True))

# Reorder columns
cols = ['customer_id', 'order_date', 'product_name', 'quantity', 'revenue_usd']
df = df[cols]
\`\`\`

---

## 8. A Complete Cleaning Pipeline

\`\`\`python
def clean_sales_data(filepath: str) -> pd.DataFrame:
    df = pd.read_csv(filepath)

    # 1. Standardise column names
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')

    # 2. Drop entirely empty rows
    df.dropna(how='all', inplace=True)

    # 3. Remove duplicates
    df.drop_duplicates(subset=['order_id'], inplace=True)

    # 4. Fix types
    df['revenue']    = pd.to_numeric(df['revenue'], errors='coerce')
    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
    df['quantity']   = pd.to_numeric(df['quantity'], errors='coerce').astype('Int64')

    # 5. Handle missing values
    df['revenue'].fillna(df['revenue'].median(), inplace=True)
    df['category'].fillna('Unknown', inplace=True)
    df.dropna(subset=['order_id', 'customer_id'], inplace=True)

    # 6. Clean strings
    df['city']   = df['city'].str.strip().str.title()
    df['status'] = df['status'].str.strip().str.lower().replace({'active': 'Active', 'inactive': 'Inactive'})

    # 7. Cap revenue outliers
    q1, q3 = df['revenue'].quantile([0.25, 0.75])
    iqr     = q3 - q1
    df['revenue'] = df['revenue'].clip(lower=q1 - 1.5*iqr, upper=q3 + 1.5*iqr)

    # 8. Reset index
    df.reset_index(drop=True, inplace=True)

    print(f"Clean dataset: {df.shape[0]} rows × {df.shape[1]} cols")
    return df

df_clean = clean_sales_data('raw_sales.csv')
\`\`\`

---

## 9. Saving Cleaned Data

\`\`\`python
# Save to CSV (no index column)
df_clean.to_csv('sales_clean.csv', index=False)

# Save to Excel
df_clean.to_excel('sales_clean.xlsx', index=False, sheet_name='CleanData')

# Save to Parquet (compressed, fast)
df_clean.to_parquet('sales_clean.parquet', index=False)
\`\`\`

---

## Key Takeaways

| Problem          | Pandas Solution                        |
|------------------|---------------------------------------|
| Missing numbers  | \`fillna(mean/median)\`               |
| Missing text     | \`fillna('Unknown')\`                 |
| Duplicates       | \`drop_duplicates()\`                 |
| Wrong type       | \`pd.to_numeric\` / \`pd.to_datetime\`|
| Messy strings    | \`.str.strip().str.lower()\`          |
| Outliers         | IQR clip or Z-score filter            |
| Bad column names | \`.rename()\` or \`.str.lower()\`     |

Clean data = trustworthy analysis. Build this cleaning pipeline as a habit before every project.
`,
    codeExample: `import pandas as pd
import numpy as np

# ── Simulated dirty dataset ──────────────────────────────────────────────────
data = {
    'order_id':  [101, 102, 102, 103, 104, 105, 106, 107],
    'customer':  ['Alice ', 'bob', 'bob', 'CHARLIE', 'Dave', None, 'Eve', 'frank'],
    'revenue':   ['1200', '850.5', '850.5', 'N/A', '3400', '920', '-50', '15000'],
    'quantity':  [5, 3, 3, None, 8, 2, 1, 4],
    'region':    ['North', 'south', 'south', 'NORTH', 'East', 'East', None, 'West'],
    'date':      ['2024-01-15', '2024-01-16', '2024-01-16', '15/01/2024', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20'],
}
df = pd.DataFrame(data)

print("=== BEFORE CLEANING ===")
print(df)
print("\\nMissing values:", df.isnull().sum().to_dict())

# ── Step 1: Fix data types ────────────────────────────────────────────────────
df['revenue']  = pd.to_numeric(df['revenue'], errors='coerce')  # 'N/A' → NaN
df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce').astype('Int64')

# ── Step 2: Remove duplicates ─────────────────────────────────────────────────
before = len(df)
df.drop_duplicates(subset=['order_id'], inplace=True)
print(f"\\nDropped {before - len(df)} duplicate rows")

# ── Step 3: Handle missing values ─────────────────────────────────────────────
df['revenue'].fillna(df['revenue'].median(), inplace=True)
df['quantity'].fillna(df['quantity'].median(), inplace=True)
df['customer'].fillna('Unknown', inplace=True)
df['region'].fillna(df['region'].mode()[0], inplace=True)

# ── Step 4: Clean strings ─────────────────────────────────────────────────────
df['customer'] = df['customer'].str.strip().str.title()
df['region']   = df['region'].str.strip().str.title()

# ── Step 5: Cap revenue outliers (IQR) ────────────────────────────────────────
q1, q3 = df['revenue'].quantile(0.25), df['revenue'].quantile(0.75)
iqr     = q3 - q1
df['revenue'] = df['revenue'].clip(lower=max(0, q1 - 1.5*iqr), upper=q3 + 1.5*iqr)

# ── Step 6: Reset index ───────────────────────────────────────────────────────
df.reset_index(drop=True, inplace=True)

print("\\n=== AFTER CLEANING ===")
print(df.to_string())
print(f"\\nFinal shape: {df.shape}")
print("Missing values:", df.isnull().sum().sum(), "total")
`,
    quizzes: [
      {
        question: 'What does `df.isnull().sum()` return?',
        options: [
          'The count of missing values per column',
          'The total number of rows',
          'A boolean True/False for each cell',
          'The sum of all numeric values',
        ],
        correctAnswer: 0,
        explanation: '`isnull()` produces a boolean DataFrame; `.sum()` counts True (missing) values per column.',
      },
      {
        question: 'Which `dropna()` parameter removes a column that has MORE THAN 50% missing?',
        options: [
          '`thresh=len(df)*0.5` with `axis=1`',
          '`how="all"` with `axis=0`',
          '`how="any"` with `axis=1`',
          '`subset=["col"]` with `axis=0`',
        ],
        correctAnswer: 0,
        explanation: '`thresh` specifies the minimum number of *non-null* values required to keep the column; setting `axis=1` operates on columns.',
      },
      {
        question: 'Which imputation strategy is BEST when a column has heavy outliers?',
        options: [
          'Median imputation',
          'Mean imputation',
          'Zero imputation',
          'Drop the column',
        ],
        correctAnswer: 0,
        explanation: 'Median is resistant to outliers; the mean gets pulled toward extreme values.',
      },
      {
        question: 'What does `pd.to_numeric(df["col"], errors="coerce")` do with non-numeric strings?',
        options: [
          'Converts them to NaN',
          'Raises a ValueError',
          'Converts them to 0',
          'Drops those rows',
        ],
        correctAnswer: 0,
        explanation: '`errors="coerce"` silently replaces unparseable values with NaN instead of crashing.',
      },
      {
        question: 'You want to remove exact duplicate rows but keep the LAST occurrence. Which call is correct?',
        options: [
          '`df.drop_duplicates(keep="last")`',
          '`df.drop_duplicates(keep=False)`',
          '`df.drop_duplicates(keep="first")`',
          '`df.drop_duplicates()`',
        ],
        correctAnswer: 0,
        explanation: '`keep="last"` retains the final duplicate row; `keep="first"` (default) keeps the first; `keep=False` drops all copies.',
      },
      {
        question: 'Which method standardises ALL column names to lowercase snake_case in one chained call?',
        options: [
          '`df.columns.str.lower().str.strip().str.replace(" ", "_")`',
          '`df.rename(str.lower)`',
          '`df.columns.lower()`',
          '`df.columns = df.columns.snake_case()`',
        ],
        correctAnswer: 0,
        explanation: 'Pandas `.str` accessor methods can be chained on the Index object returned by `df.columns`.',
      },
      {
        question: 'In the IQR method, the lower outlier fence is calculated as:',
        options: [
          'Q1 − 1.5 × IQR',
          'Q3 + 1.5 × IQR',
          'Mean − 2 × Std',
          'Q2 − 1.5 × IQR',
        ],
        correctAnswer: 0,
        explanation: 'Lower fence = Q1 − 1.5 × IQR; upper fence = Q3 + 1.5 × IQR. Values outside these are considered outliers.',
      },
      {
        question: '`df["col"].str.strip()` does what?',
        options: [
          'Removes leading and trailing whitespace',
          'Removes all whitespace everywhere in the string',
          'Converts to lowercase',
          'Splits the string on spaces',
        ],
        correctAnswer: 0,
        explanation: '`.str.strip()` mirrors Python\'s `str.strip()` — only leading and trailing whitespace is removed.',
      },
      {
        question: 'What is the purpose of `df.reset_index(drop=True)` at the end of cleaning?',
        options: [
          'Resets the row numbers to 0, 1, 2… after dropping rows',
          'Deletes the index column permanently',
          'Sorts the DataFrame by the index',
          'Converts the index to a regular column',
        ],
        correctAnswer: 0,
        explanation: 'After `dropna()` or `drop_duplicates()`, row indices have gaps. `reset_index(drop=True)` renumbers them cleanly.',
      },
      {
        question: 'You want to forward-fill missing values in a temperature time series. Which call is correct?',
        options: [
          '`df["temp"].ffill()`',
          '`df["temp"].fillna(0)`',
          '`df["temp"].bfill()`',
          '`df["temp"].interpolate(method="zero")`',
        ],
        correctAnswer: 0,
        explanation: '`ffill()` (forward fill) carries the last known value forward — ideal for time-series gaps.',
      },
      {
        question: 'Which file format is BEST for saving large cleaned DataFrames for later analysis (fast + compressed)?',
        options: [
          'Parquet',
          'CSV',
          'TXT',
          'JSON',
        ],
        correctAnswer: 0,
        explanation: 'Parquet stores data column-oriented with compression; it\'s much faster and smaller than CSV for analytical workloads.',
      },
      {
        question: 'To replace inconsistent category spellings like "active", "ACTIVE", "act" all with "Active", which approach is cleanest?',
        options: [
          '`df["col"].replace({"active": "Active", "ACTIVE": "Active", "act": "Active"})`',
          '`df["col"].str.lower()`',
          '`df["col"].fillna("Active")`',
          '`df["col"].dropna()`',
        ],
        correctAnswer: 0,
        explanation: '`replace()` maps old → new values via a dictionary, cleanly handling multiple variants.',
      },
      {
        question: 'What does `df.drop_duplicates(keep=False)` do?',
        options: [
          'Removes ALL rows that are duplicated (including the original)',
          'Keeps only the first occurrence of each duplicate',
          'Keeps only the last occurrence',
          'Removes rows where any value is null',
        ],
        correctAnswer: 0,
        explanation: '`keep=False` drops every copy of a duplicated row — use it when no version of a duplicate should be kept.',
      },
      {
        question: 'What is the main advantage of `astype("category")` for a text column?',
        options: [
          'Reduced memory usage and faster groupby operations',
          'Enables `.str` accessor methods',
          'Converts strings to integers automatically',
          'Sorts the column alphabetically',
        ],
        correctAnswer: 0,
        explanation: 'Category dtype stores repeated strings as integer codes internally, saving memory and speeding up operations like `groupby`.',
      },
      {
        question: 'The function `df["col"].clip(lower=0, upper=1000)` does what to values outside [0, 1000]?',
        options: [
          'Sets values below 0 to 0 and values above 1000 to 1000 (winsorizes)',
          'Removes rows where the value is outside [0, 1000]',
          'Sets out-of-range values to NaN',
          'Raises an error',
        ],
        correctAnswer: 0,
        explanation: '`clip()` caps extreme values at the boundaries instead of removing rows — useful for outlier treatment without data loss.',
      },
    ],
  },

  // ── Chapter 10 ─────────────────────────────────────────────────────────────
  {
    slug: 'da-noob-10-statistics-basics',
    title: 'Basic Statistics for Data Analysts',
    description:
      'Statistics is the language of data. Learn descriptive statistics, distributions, correlation, and the core concepts that power every dashboard and business report.',
    orderIndex: 10,
    xpReward: 85,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Basic Statistics for Data Analysts

> **"Statistics is the science of learning from data."** — Every bar chart, average, and trend line is statistics. Understand the fundamentals and you'll know *what* numbers mean — not just *what* they are.

---

## 1. Descriptive vs Inferential Statistics

| Type | Question it answers | Example |
|------|---------------------|---------|
| **Descriptive** | What happened in our data? | "Average order value was $127" |
| **Inferential** | What can we conclude about the world? | "We're 95% confident customers prefer version B" |

As a data analyst you'll use **descriptive statistics** daily. Inferential statistics appears in A/B tests and forecasting.

---

## 2. Measures of Central Tendency

These describe the "typical" value.

### Mean (Average)
\`\`\`
Mean = Sum of all values / Number of values
\`\`\`
**Sensitive to outliers.** One billionaire in a room raises the average salary dramatically.

### Median
The **middle value** when sorted. Half the data is above, half below.
- If n is odd: middle value
- If n is even: average of two middle values

**Resistant to outliers.** Use for skewed distributions (salaries, house prices).

### Mode
The most **frequently occurring** value. Useful for categorical data.

\`\`\`python
import pandas as pd
import numpy as np

salaries = pd.Series([45000, 52000, 48000, 55000, 51000, 60000, 200000])

print(f"Mean:   \${salaries.mean():,.0f}")    # \$87,286 — pulled by outlier
print(f"Median: \${salaries.median():,.0f}")  # \$52,000 — much more representative
print(f"Mode:   \${salaries.mode()[0]:,.0f}") # \$45,000

# Rule of thumb:
# Symmetric data  → use mean
# Skewed data     → use median
# Categorical     → use mode
\`\`\`

---

## 3. Measures of Spread

These describe how scattered values are.

### Range
\`\`\`
Range = Max − Min
\`\`\`
Simple but heavily influenced by outliers.

### Variance
Average of squared differences from the mean.
\`\`\`
Variance = Σ(x − mean)² / n
\`\`\`

### Standard Deviation (Std)
Square root of variance — back in the original units.
\`\`\`
Std = √Variance
\`\`\`
**Interpretation:** ~68% of values fall within 1 std of the mean (for normal distributions).

### Interquartile Range (IQR)
\`\`\`
IQR = Q3 − Q1
\`\`\`
Middle 50% of data. Outlier-resistant. Used in box plots and outlier detection.

\`\`\`python
data = pd.Series([10, 12, 11, 13, 14, 11, 15, 100])

print(f"Range:  {data.max() - data.min()}")
print(f"Std:    {data.std():.2f}")
print(f"Var:    {data.var():.2f}")

q1 = data.quantile(0.25)
q3 = data.quantile(0.75)
print(f"IQR:    {q3 - q1:.2f}")

# Or use describe() for a full summary
print(data.describe())
\`\`\`

---

## 4. Percentiles and Quantiles

**Percentile** — What percent of values fall *below* this point?
- 50th percentile = Median
- 25th percentile = Q1 (lower quartile)
- 75th percentile = Q3 (upper quartile)
- 90th percentile — 90% of data is below this value

\`\`\`python
scores = pd.Series([45, 60, 72, 55, 88, 91, 67, 74, 82, 50])

print(scores.quantile(0.25))   # Q1
print(scores.quantile(0.50))   # Median
print(scores.quantile(0.75))   # Q3
print(scores.quantile(0.90))   # 90th percentile

# Multiple at once
print(scores.quantile([0.1, 0.25, 0.5, 0.75, 0.9]))
\`\`\`

---

## 5. Distributions

A **distribution** shows how values are spread across a range.

### Normal Distribution (Bell Curve)
- Symmetric around the mean
- Mean = Median = Mode
- 68-95-99.7 rule: 68% within 1σ, 95% within 2σ, 99.7% within 3σ
- Examples: heights, IQ scores, measurement errors

### Skewed Distributions
- **Right-skewed (positive):** Long tail to the right. Mean > Median. Examples: income, house prices, social media followers.
- **Left-skewed (negative):** Long tail to the left. Mean < Median. Examples: age at retirement, exam scores with easy tests.

### Uniform Distribution
All values equally likely. Example: a fair die roll.

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Simulate a normal distribution
normal_data = np.random.normal(loc=100, scale=15, size=1000)
# loc = mean, scale = std deviation

print(f"Mean:   {normal_data.mean():.1f}")
print(f"Std:    {normal_data.std():.1f}")
print(f"Skew:   {pd.Series(normal_data).skew():.2f}")

# Positive skew = 'right-skewed'
right_skewed = np.random.exponential(scale=50, size=1000)
print(f"Right-skew value: {pd.Series(right_skewed).skew():.2f}")
\`\`\`

---

## 6. Correlation

**Correlation** measures the strength and direction of the linear relationship between two variables.

**Pearson's r** ranges from −1 to +1:

| r value | Interpretation |
|---------|---------------|
| +0.9 to +1.0 | Very strong positive |
| +0.5 to +0.9 | Moderate positive |
| −0.1 to +0.1 | Little/no correlation |
| −0.5 to −0.9 | Moderate negative |
| −0.9 to −1.0 | Very strong negative |

⚠️ **Correlation ≠ Causation.** Ice cream sales correlate with drowning deaths — both are caused by hot weather.

\`\`\`python
df = pd.DataFrame({
    'study_hours':   [1, 2, 3, 4, 5, 6, 7, 8],
    'exam_score':    [45, 55, 60, 70, 72, 80, 85, 92],
    'sleep_hours':   [9, 8, 8, 7, 7, 6, 6, 5],
    'random_number': [3, 17, 2, 44, 11, 38, 5, 29],
})

# Correlation matrix
print(df.corr().round(2))

# Single pair
r = df['study_hours'].corr(df['exam_score'])
print(f"Study hours vs Exam score: r = {r:.2f}")
\`\`\`

---

## 7. Frequency Tables and Cross-Tabulations

\`\`\`python
df = pd.DataFrame({
    'region':  ['North', 'South', 'North', 'East', 'South', 'North', 'East', 'South'],
    'product': ['A', 'B', 'A', 'C', 'A', 'B', 'A', 'C'],
    'revenue': [100, 200, 150, 300, 120, 210, 280, 190],
})

# Frequency table
print(df['region'].value_counts())
print(df['region'].value_counts(normalize=True).round(2))  # proportions

# Cross-tabulation (counts)
print(pd.crosstab(df['region'], df['product']))

# Cross-tabulation with values (mean revenue)
print(pd.crosstab(df['region'], df['product'],
                  values=df['revenue'], aggfunc='mean').round(0))
\`\`\`

---

## 8. Grouped Statistics

\`\`\`python
df = pd.DataFrame({
    'department': ['Sales', 'Sales', 'Eng', 'Eng', 'Marketing', 'Marketing'],
    'salary':     [50000, 55000, 90000, 95000, 60000, 65000],
    'bonus':      [5000, 7000, 10000, 12000, 6000, 8000],
})

# Mean salary per department
print(df.groupby('department')['salary'].mean())

# Multiple statistics at once
print(df.groupby('department')['salary'].agg(['mean', 'median', 'std', 'min', 'max']))

# Multiple columns
print(df.groupby('department').agg({'salary': 'mean', 'bonus': 'sum'}))
\`\`\`

---

## 9. Key Statistical Concepts Summary

| Concept | Formula / Tool | Use when |
|---------|---------------|----------|
| Mean | \`mean()\` | Data is symmetric, no outliers |
| Median | \`median()\` | Skewed data or outliers present |
| Std | \`std()\` | Measuring typical deviation |
| IQR | Q3 − Q1 | Outlier detection |
| Correlation | \`corr()\` | Measuring relationships |
| Percentile | \`quantile(p)\` | Ranking, SLAs, benchmarks |

---

## Quick Reference: \`describe()\`

\`\`\`python
df.describe()
# Returns: count, mean, std, min, 25%, 50%, 75%, max for numeric cols
\`\`\`

This one function is your fastest statistics overview. Use it every time you load a new dataset.
`,
    codeExample: `import pandas as pd
import numpy as np

# ── Sample e-commerce order dataset ─────────────────────────────────────────
np.random.seed(42)
n = 200

df = pd.DataFrame({
    'region':    np.random.choice(['North', 'South', 'East', 'West'], n),
    'category':  np.random.choice(['Electronics', 'Clothing', 'Food', 'Books'], n),
    'revenue':   np.random.exponential(scale=150, size=n).round(2),   # right-skewed
    'items':     np.random.randint(1, 10, n),
    'rating':    np.random.normal(loc=4.0, scale=0.5, size=n).clip(1, 5).round(1),
})

# ── 1. Overview ───────────────────────────────────────────────────────────────
print("=== DATASET OVERVIEW ===")
print(f"Shape: {df.shape}")
print(df.describe().round(2))

# ── 2. Central tendency ───────────────────────────────────────────────────────
print("\\n=== REVENUE STATISTICS ===")
print(f"Mean:   \${df['revenue'].mean():,.2f}  (pulled by big orders)")
print(f"Median: \${df['revenue'].median():,.2f}  (typical order)")
print(f"Std:    \${df['revenue'].std():,.2f}")
print(f"Skew:   {df['revenue'].skew():.2f}  (>0 means right-skewed)")

# ── 3. Percentiles ────────────────────────────────────────────────────────────
print("\\n=== REVENUE PERCENTILES ===")
for p in [25, 50, 75, 90, 95]:
    val = df['revenue'].quantile(p/100)
    print(f"  {p:3d}th percentile: \${val:,.2f}")

# ── 4. Grouped statistics ─────────────────────────────────────────────────────
print("\\n=== REVENUE BY CATEGORY ===")
summary = df.groupby('category')['revenue'].agg(
    count='count',
    mean='mean',
    median='median',
    std='std'
).round(2)
print(summary)

# ── 5. Correlation ────────────────────────────────────────────────────────────
print("\\n=== CORRELATIONS ===")
print(df[['revenue', 'items', 'rating']].corr().round(3))

# ── 6. Frequency distribution ─────────────────────────────────────────────────
print("\\n=== ORDER COUNT BY REGION (%) ===")
print(df['region'].value_counts(normalize=True).mul(100).round(1).astype(str) + '%')
`,
    quizzes: [
      {
        question: 'Which measure of central tendency is MOST resistant to outliers?',
        options: ['Median', 'Mean', 'Range', 'Variance'],
        correctAnswer: 0,
        explanation: 'Median is the middle value; adding extreme values doesn\'t change it. The mean, however, gets pulled toward outliers.',
      },
      {
        question: 'A salary dataset has a few CEO salaries of $5M. Which measure best represents the TYPICAL employee salary?',
        options: ['Median', 'Mean', 'Mode', 'Range'],
        correctAnswer: 0,
        explanation: 'The mean would be inflated by the extreme CEO salaries. Median gives the true middle value regardless of extremes.',
      },
      {
        question: 'IQR stands for:',
        options: [
          'Interquartile Range — the distance between Q1 and Q3',
          'Incremental Quartile Ratio',
          'Inner Quantile Range — median ± std',
          'Index Quantile Residual',
        ],
        correctAnswer: 0,
        explanation: 'IQR = Q3 − Q1. It covers the middle 50% of data and is used in box plots and outlier detection.',
      },
      {
        question: 'A right-skewed distribution has:',
        options: [
          'A long tail to the right and Mean > Median',
          'A long tail to the left and Mean < Median',
          'Mean = Median = Mode',
          'Symmetric spread around the mean',
        ],
        correctAnswer: 0,
        explanation: 'Right-skew (positive skew) pulls the mean to the right via a few large values, making Mean > Median.',
      },
      {
        question: 'In a normal distribution, approximately what % of values fall within 2 standard deviations of the mean?',
        options: ['95%', '68%', '99.7%', '50%'],
        correctAnswer: 0,
        explanation: 'The 68-95-99.7 rule: ±1σ → 68%, ±2σ → 95%, ±3σ → 99.7%.',
      },
      {
        question: 'A Pearson correlation coefficient of −0.85 means:',
        options: [
          'Strong negative linear relationship',
          'Weak positive relationship',
          'No relationship',
          'Strong positive relationship',
        ],
        correctAnswer: 0,
        explanation: 'r near −1 indicates a strong inverse relationship: as one variable increases, the other strongly decreases.',
      },
      {
        question: 'Ice cream sales and drowning rates are highly correlated. This means:',
        options: [
          'A third variable (hot weather) causes both — correlation ≠ causation',
          'Eating ice cream causes drowning',
          'Drowning causes ice cream sales',
          'The correlation is wrong and should be discarded',
        ],
        correctAnswer: 0,
        explanation: 'Both rise in summer due to hot weather. This is a classic example of a confounding variable — correlation does not imply causation.',
      },
      {
        question: 'Which pandas method gives count, mean, std, min, 25%, 50%, 75%, max in one call?',
        options: ['`df.describe()`', '`df.info()`', '`df.summary()`', '`df.stats()`'],
        correctAnswer: 0,
        explanation: '`describe()` computes descriptive statistics for all numeric columns at once — the fastest dataset overview.',
      },
      {
        question: 'The 75th percentile means:',
        options: [
          '75% of values fall below this point',
          'The value is in the top 75%',
          '75% of values fall above this point',
          'The value equals the mean + 0.75 × std',
        ],
        correctAnswer: 0,
        explanation: 'The p-th percentile is the value below which p% of observations fall.',
      },
      {
        question: 'Standard deviation is preferred over variance because:',
        options: [
          'It is in the same units as the original data',
          'It is always smaller than the mean',
          'It ignores outliers',
          'It equals the IQR',
        ],
        correctAnswer: 0,
        explanation: 'Variance is in squared units (e.g., dollars²), which is hard to interpret. Std = √Variance returns to the original units.',
      },
      {
        question: 'To compute the mean revenue grouped by region using pandas:',
        options: [
          '`df.groupby("region")["revenue"].mean()`',
          '`df["region"].mean()`',
          '`df.mean(["region", "revenue"])`',
          '`df.groupby("revenue")["region"].mean()`',
        ],
        correctAnswer: 0,
        explanation: '`groupby()` splits the DataFrame by the grouping column; the aggregation function is then applied to the selected column.',
      },
      {
        question: 'Which mode of the frequency table is correct for ["A","B","A","C","A","B"]?',
        options: ['"A" (appears 3 times)', '"B" (appears 2 times)', '"C" (appears 1 time)', 'No mode — all equal'],
        correctAnswer: 0,
        explanation: '"A" appears most frequently (3 times), so it is the mode.',
      },
      {
        question: '`df["col"].value_counts(normalize=True)` returns:',
        options: [
          'Proportions (0 to 1) of each unique value',
          'Counts of each unique value',
          'Percentage strings like "45%"',
          'Z-scores of frequencies',
        ],
        correctAnswer: 0,
        explanation: '`normalize=True` divides each count by the total, returning proportions. Multiply by 100 for percentages.',
      },
      {
        question: 'A dataset\'s skew value is 0.05. This means:',
        options: [
          'Nearly symmetric — mean ≈ median',
          'Strongly right-skewed',
          'Strongly left-skewed',
          'The data has many outliers',
        ],
        correctAnswer: 0,
        explanation: 'Skew near 0 means the distribution is approximately symmetric. Values > 1 or < −1 indicate significant skew.',
      },
      {
        question: '`pd.crosstab(df["region"], df["product"])` produces:',
        options: [
          'A table counting co-occurrences of region and product combinations',
          'A scatter plot',
          'The correlation between region and product',
          'A pivot table with revenue averages',
        ],
        correctAnswer: 0,
        explanation: '`crosstab` creates a frequency table showing how many times each combination of the two categorical variables appears.',
      },
    ],
  },

  // ── Chapter 11 ─────────────────────────────────────────────────────────────
  {
    slug: 'da-noob-11-matplotlib-seaborn',
    title: 'Data Visualization with Matplotlib & Seaborn',
    description:
      'Turn numbers into insights. Learn to create professional bar charts, line graphs, scatter plots, histograms, and heatmaps using Python\'s most popular visualization libraries.',
    orderIndex: 11,
    xpReward: 90,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Data Visualization with Matplotlib & Seaborn

> **"A picture is worth a thousand numbers."** — The right chart communicates in seconds what a table takes minutes to decode.

---

## Why Visualization Matters

- Humans detect patterns visually far faster than in tables
- Charts reveal outliers, trends, and distributions at a glance
- Stakeholders who don't read spreadsheets will read a chart

---

## The Visualization Stack

| Library | Best for | Style |
|---------|----------|-------|
| **Matplotlib** | Full control, custom layouts | Manual, verbose |
| **Seaborn** | Statistical plots, DataFrames | High-level, beautiful defaults |
| **Pandas .plot()** | Quick exploratory plots | One-liner shortcut |

Seaborn is built on top of Matplotlib — you can mix both.

---

## 1. Setup

\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Seaborn default theme (clean, grid-based)
sns.set_theme(style="whitegrid", palette="muted")

# Figure size for all plots
plt.rcParams['figure.figsize'] = (10, 6)
\`\`\`

---

## 2. Bar Chart — Comparing Categories

**Use when:** comparing a numeric value across different categories.

\`\`\`python
# Matplotlib — manual
categories = ['Electronics', 'Clothing', 'Books', 'Food']
sales      = [42000, 31000, 18000, 27000]

plt.figure(figsize=(8, 5))
bars = plt.bar(categories, sales, color=['#4C72B0', '#DD8452', '#55A868', '#C44E52'])
plt.bar_label(bars, labels=[f'\${v:,.0f}' for v in sales], padding=5, fontsize=10)
plt.title('Sales by Category', fontsize=14, fontweight='bold')
plt.xlabel('Category')
plt.ylabel('Revenue (USD)')
plt.tight_layout()
plt.show()
\`\`\`

\`\`\`python
# Seaborn — one line from a DataFrame
df = pd.DataFrame({'category': categories, 'sales': sales})
sns.barplot(data=df, x='category', y='sales', palette='muted')
plt.title('Sales by Category')
plt.show()
\`\`\`

---

## 3. Line Chart — Trends Over Time

**Use when:** data has a continuous axis (time) and you want to show a trend.

\`\`\`python
months  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
revenue = [15000, 18000, 16500, 22000, 25000, 23000]
returns = [1200,  1400,  1100,  1600,  1900,  1750]

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(months, revenue, marker='o', linewidth=2, label='Revenue', color='steelblue')
ax.plot(months, returns, marker='s', linewidth=2, label='Returns', color='tomato', linestyle='--')

ax.fill_between(months, revenue, alpha=0.1, color='steelblue')
ax.legend(fontsize=11)
ax.set_title('Monthly Revenue vs Returns', fontsize=13, fontweight='bold')
ax.set_ylabel('Amount (USD)')
plt.tight_layout()
plt.show()
\`\`\`

---

## 4. Scatter Plot — Relationships Between Variables

**Use when:** investigating the relationship (correlation) between two numeric variables.

\`\`\`python
np.random.seed(0)
df = pd.DataFrame({
    'study_hours': np.random.uniform(1, 10, 100),
    'exam_score':  np.random.normal(60, 10, 100),
    'grade':       np.random.choice(['A', 'B', 'C'], 100),
})
df['exam_score'] = (df['study_hours'] * 4 + df['exam_score']).clip(0, 100)

# Seaborn scatter with colour by category
sns.scatterplot(data=df, x='study_hours', y='exam_score', hue='grade',
                palette='Set1', s=80, alpha=0.8)
plt.title('Study Hours vs Exam Score')
plt.xlabel('Study Hours Per Day')
plt.ylabel('Exam Score (%)')
plt.show()

# Add regression line
sns.regplot(data=df, x='study_hours', y='exam_score', scatter=False, color='black', line_kws={'linewidth': 1.5})
\`\`\`

---

## 5. Histogram — Distribution of One Variable

**Use when:** understanding how values are spread across a range.

\`\`\`python
# Simulate order values (right-skewed)
order_values = np.random.exponential(scale=150, size=1000)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Histogram
axes[0].hist(order_values, bins=40, color='steelblue', edgecolor='white', alpha=0.8)
axes[0].axvline(np.mean(order_values),   color='red',    linestyle='--', label=f'Mean: \${np.mean(order_values):,.0f}')
axes[0].axvline(np.median(order_values), color='orange', linestyle='--', label=f'Median: \${np.median(order_values):,.0f}')
axes[0].legend()
axes[0].set_title('Order Value Distribution')
axes[0].set_xlabel('Order Value (USD)')

# KDE (smooth version)
sns.kdeplot(order_values, fill=True, color='steelblue', ax=axes[1])
axes[1].set_title('Kernel Density Estimate')
axes[1].set_xlabel('Order Value (USD)')

plt.tight_layout()
plt.show()
\`\`\`

---

## 6. Box Plot — Distribution + Outliers

**Use when:** comparing distributions across groups and spotting outliers.

\`\`\`python
df = pd.DataFrame({
    'department': np.repeat(['Engineering', 'Marketing', 'Sales', 'HR'], 50),
    'salary':     np.concatenate([
        np.random.normal(95000, 12000, 50),
        np.random.normal(65000, 8000, 50),
        np.random.normal(55000, 10000, 50),
        np.random.normal(52000, 7000, 50),
    ])
})

sns.boxplot(data=df, x='department', y='salary', palette='Set2')
plt.title('Salary Distribution by Department')
plt.ylabel('Annual Salary (USD)')
plt.xticks(rotation=15)
plt.tight_layout()
plt.show()

# Box plot reads:
#   - Box:    IQR (Q1 to Q3)
#   - Line:   Median
#   - Dots:   Outliers (beyond 1.5×IQR)
#   - Whiskers: Range within 1.5×IQR
\`\`\`

---

## 7. Heatmap — Correlation Matrix

**Use when:** visualising correlation between many numeric variables at once.

\`\`\`python
df = pd.DataFrame({
    'revenue':     np.random.normal(5000, 1500, 100),
    'ad_spend':    np.random.normal(500, 150, 100),
    'customers':   np.random.randint(10, 200, 100),
    'avg_rating':  np.random.uniform(2.5, 5, 100),
    'return_rate': np.random.uniform(0.02, 0.15, 100),
})
# Make revenue correlated with ad_spend
df['revenue'] = df['ad_spend'] * 8 + np.random.normal(0, 500, 100)

corr_matrix = df.corr().round(2)

plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix,
            annot=True,      # show numbers
            cmap='RdBu_r',   # red=negative, blue=positive
            center=0,
            fmt='.2f',
            linewidths=0.5,
            square=True)
plt.title('Correlation Matrix', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.show()
\`\`\`

---

## 8. Pie Chart (Use Sparingly!)

**Use when:** showing proportions of a whole (max 5 categories).

\`\`\`python
labels  = ['Electronics', 'Clothing', 'Food', 'Other']
sizes   = [38, 28, 22, 12]
explode = (0.05, 0, 0, 0)   # slightly pull out the largest slice

plt.figure(figsize=(7, 7))
plt.pie(sizes, labels=labels, autopct='%1.1f%%', explode=explode,
        colors=sns.color_palette('muted'), startangle=140, shadow=True)
plt.title('Revenue Share by Category')
plt.show()

# ⚠️ Prefer bar charts for accurate comparison!
# Pie charts are hard to read when slices are similar in size.
\`\`\`

---

## 9. Subplots — Multiple Charts in One Figure

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Sales Dashboard', fontsize=16, fontweight='bold')

# Top-left: Bar
cats   = ['A', 'B', 'C', 'D']
values = [23, 17, 35, 29]
axes[0, 0].bar(cats, values, color='steelblue')
axes[0, 0].set_title('Sales by Product')

# Top-right: Line
months = list(range(1, 13))
trend  = [10 + i * 1.5 + np.random.randn() for i in months]
axes[0, 1].plot(months, trend, marker='o', color='tomato')
axes[0, 1].set_title('Monthly Revenue Trend')

# Bottom-left: Histogram
axes[1, 0].hist(np.random.normal(50, 10, 300), bins=30, color='mediumseagreen')
axes[1, 0].set_title('Order Value Distribution')

# Bottom-right: Scatter
x = np.random.uniform(0, 10, 100)
y = 2 * x + np.random.randn(100) * 2
axes[1, 1].scatter(x, y, alpha=0.6, color='orchid')
axes[1, 1].set_title('Ad Spend vs Revenue')

plt.tight_layout()
plt.show()
\`\`\`

---

## Chart Selection Guide

| Situation | Chart Type |
|-----------|-----------|
| Compare categories | Bar chart |
| Show trend over time | Line chart |
| Two numeric variables | Scatter plot |
| Distribution of values | Histogram / KDE |
| Distribution + outliers across groups | Box plot |
| Correlation matrix | Heatmap |
| Parts of a whole | Pie / Stacked bar |
| Data overview / dashboard | Subplots |
`,
    codeExample: `import matplotlib
matplotlib.use('Agg')   # non-interactive backend for script mode

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

sns.set_theme(style="whitegrid", palette="muted")
np.random.seed(42)

# ── Simulated retail dataset ──────────────────────────────────────────────────
n = 300
df = pd.DataFrame({
    'month':      np.tile(['Jan','Feb','Mar','Apr','May','Jun'], n // 6),
    'category':   np.random.choice(['Electronics','Clothing','Books','Food'], n),
    'revenue':    np.random.exponential(150, n).round(2),
    'ad_spend':   np.random.uniform(10, 80, n).round(2),
    'rating':     np.random.normal(4.0, 0.5, n).clip(1, 5).round(1),
})
df['revenue'] = (df['ad_spend'] * 5 + np.random.normal(0, 50, n)).clip(10).round(2)

# ── 1. Bar chart: avg revenue by category ────────────────────────────────────
avg_rev = df.groupby('category')['revenue'].mean().sort_values(ascending=False)
print("Average Revenue by Category:")
print(avg_rev.round(2))

# ── 2. Correlation matrix ─────────────────────────────────────────────────────
corr = df[['revenue', 'ad_spend', 'rating']].corr().round(3)
print("\\nCorrelation Matrix:")
print(corr)

# ── 3. Distribution summary ───────────────────────────────────────────────────
print("\\nRevenue Distribution:")
for p in [25, 50, 75, 90]:
    print(f"  {p}th percentile: \${df['revenue'].quantile(p/100):,.2f}")

# ── 4. Category breakdown ─────────────────────────────────────────────────────
print("\\nRevenue Stats by Category:")
print(df.groupby('category')['revenue'].agg(['mean','median','std']).round(2))

# ── 5. Monthly trend ──────────────────────────────────────────────────────────
monthly = df.groupby('month')['revenue'].sum()
print("\\nMonthly Total Revenue:")
print(monthly.round(0))

print("\\n✅ All chart data computed successfully!")
print("   In a Jupyter notebook, plt.show() would render each chart.")
`,
    quizzes: [
      {
        question: 'Which chart type is BEST for showing how revenue changes across 12 months?',
        options: ['Line chart', 'Pie chart', 'Histogram', 'Box plot'],
        correctAnswer: 0,
        explanation: 'Line charts are designed for continuous/time-based trends — connecting points emphasizes change over time.',
      },
      {
        question: 'Which Seaborn function creates a chart that shows median, IQR, and outliers for multiple groups?',
        options: ['`sns.boxplot()`', '`sns.barplot()`', '`sns.scatterplot()`', '`sns.kdeplot()`'],
        correctAnswer: 0,
        explanation: 'A box plot visualises Q1, Q3 (the box), median (center line), whiskers (1.5×IQR), and outlier dots.',
      },
      {
        question: 'What does `sns.heatmap(corr, annot=True)` display?',
        options: [
          'A colour-coded correlation matrix with numeric values in each cell',
          'A histogram of all variables',
          'A scatter plot matrix',
          'A bar chart of correlations',
        ],
        correctAnswer: 0,
        explanation: '`annot=True` writes the correlation coefficient into each cell of the heatmap for easy reading.',
      },
      {
        question: 'A histogram with `bins=40` means:',
        options: [
          'The data range is divided into 40 equal-width intervals',
          'Only 40 data points are plotted',
          'Each bar represents exactly 40 values',
          'The chart has 40 pixels of width',
        ],
        correctAnswer: 0,
        explanation: '`bins` sets the number of intervals used to group values. More bins = finer resolution; fewer = smoother overview.',
      },
      {
        question: 'When should you prefer a bar chart over a pie chart?',
        options: [
          'Almost always — bar charts are easier to compare accurately',
          'When you have more than 10 categories',
          'When data is time-series',
          'When you need to show outliers',
        ],
        correctAnswer: 0,
        explanation: 'Humans compare lengths much better than angles/areas. Pie charts should only be used for ≤5 segments where one slice is clearly dominant.',
      },
      {
        question: 'What does `plt.subplots(2, 2)` create?',
        options: [
          'A figure with a 2×2 grid of 4 subplots',
          'Two separate figures each with 2 plots',
          'A single plot with 4 data series',
          'Four separate windows',
        ],
        correctAnswer: 0,
        explanation: '`subplots(rows, cols)` returns a figure and an array of Axes objects arranged in the specified grid.',
      },
      {
        question: 'Which Seaborn parameter sets the colour palette for a chart?',
        options: ['`palette`', '`color`', '`hue`', '`cmap`'],
        correctAnswer: 0,
        explanation: '`palette` takes a named Seaborn/Matplotlib palette (e.g., "muted", "Set1", "viridis") and applies it to groups or bars.',
      },
      {
        question: 'In a scatter plot, `alpha=0.5` does what?',
        options: [
          'Makes points 50% transparent, helping visualise overlapping points',
          'Reduces the point size by 50%',
          'Sets x-axis range to 0–0.5',
          'Filters out 50% of data points',
        ],
        correctAnswer: 0,
        explanation: '`alpha` controls opacity (0=invisible, 1=opaque). Transparency helps reveal density when many points overlap.',
      },
      {
        question: '`sns.regplot()` adds what to a scatter plot?',
        options: [
          'A regression (best-fit) line with confidence interval',
          'A histogram overlay',
          'Colour coding by category',
          'Box plot whiskers',
        ],
        correctAnswer: 0,
        explanation: '`regplot` fits and draws a linear regression line plus a shaded confidence interval band.',
      },
      {
        question: 'What does `plt.tight_layout()` do?',
        options: [
          'Automatically adjusts spacing so titles/labels don\'t overlap',
          'Makes the figure border tighter',
          'Compresses the data to fit smaller plots',
          'Saves memory by reducing plot resolution',
        ],
        correctAnswer: 0,
        explanation: '`tight_layout()` adjusts subplot padding so axis labels, titles, and colorbars don\'t clip or overlap each other.',
      },
      {
        question: 'To colour scatter plot points by a categorical column (e.g., region), use:',
        options: [
          '`hue="region"` in `sns.scatterplot()`',
          '`color="region"` in `plt.scatter()`',
          '`palette="region"` in `sns.scatterplot()`',
          '`c="region"` in `sns.scatterplot()`',
        ],
        correctAnswer: 0,
        explanation: 'Seaborn\'s `hue` parameter automatically assigns a unique colour to each category and adds a legend.',
      },
      {
        question: 'A KDE (Kernel Density Estimate) plot is:',
        options: [
          'A smooth continuous estimate of a distribution, like a smoothed histogram',
          'A scatter plot with density markers',
          'A bar chart of z-scores',
          'A heatmap of covariances',
        ],
        correctAnswer: 0,
        explanation: 'KDE smooths the histogram into a continuous curve using a kernel function — great for showing distribution shape without bin-size bias.',
      },
      {
        question: 'Which line adds a vertical dashed line at the mean in a Matplotlib histogram?',
        options: [
          '`plt.axvline(data.mean(), linestyle="--")`',
          '`plt.vline(data.mean(), style="dashed")`',
          '`plt.plot([data.mean()], linestyle="--")`',
          '`sns.meanline(data)`',
        ],
        correctAnswer: 0,
        explanation: '`axvline(x)` draws a full-height vertical line at x. `linestyle="--"` makes it dashed.',
      },
      {
        question: '`cmap="RdBu_r"` in a heatmap means:',
        options: [
          'Red for negative correlations, blue for positive (reversed)',
          'Random colourmap with blue border',
          'Rainbow colour palette',
          'Grayscale gradient',
        ],
        correctAnswer: 0,
        explanation: 'RdBu is Red-Blue diverging colourmap; `_r` reverses it. With `center=0`, negative correlations appear red and positive appear blue.',
      },
      {
        question: 'The `marker="o"` parameter in `plt.plot()` does what?',
        options: [
          'Draws a circle at each data point on the line',
          'Makes the line orange',
          'Sets the origin marker',
          'Changes the line to a dotted style',
        ],
        correctAnswer: 0,
        explanation: '`marker` specifies the symbol drawn at each data point. Options include "o" (circle), "s" (square), "^" (triangle), "D" (diamond).',
      },
    ],
  },

  // ── Chapter 12 ─────────────────────────────────────────────────────────────
  {
    slug: 'da-noob-12-bi-tools-intro',
    title: 'Power BI & Tableau — BI Tools Introduction',
    description:
      'Learn what Business Intelligence tools are, when to use them instead of Python, and how to build your first interactive dashboard in Power BI or Tableau — no code required.',
    orderIndex: 12,
    xpReward: 80,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Power BI & Tableau — BI Tools Introduction

> **"The goal is to turn data into information, and information into insight."** — Carly Fiorina. BI tools make this accessible to everyone — not just programmers.

---

## What Are BI Tools?

**Business Intelligence (BI) tools** let you connect to data sources, build interactive visualisations, and share dashboards — all through a drag-and-drop interface. No code needed.

They sit between raw databases and non-technical stakeholders. While Python/SQL handles data engineering and ML, BI tools handle the **communication layer**.

---

## The Two Giants

### Microsoft Power BI
- **Cost:** Free (Power BI Desktop), paid for cloud sharing
- **Ecosystem:** Deeply integrated with Excel, Azure, SQL Server, Teams, Office 365
- **Audience:** Corporate environments, Microsoft shops
- **Language:** DAX (Data Analysis Expressions) for calculated fields
- **File format:** .pbix

### Tableau
- **Cost:** Paid (Tableau Public — free for public dashboards)
- **Ecosystem:** Connects to almost any data source; industry-standard in analytics roles
- **Audience:** Data analysts, consulting, research organisations
- **Language:** Calculated fields with an Excel-like formula syntax
- **File format:** .twb / .twbx

---

## When to Use BI Tools vs Python

| Situation | Use BI Tool | Use Python |
|-----------|-------------|------------|
| Business dashboard for executives | ✅ | ❌ |
| Monthly KPI report | ✅ | ❌ |
| Deep statistical analysis | ❌ | ✅ |
| Machine learning model | ❌ | ✅ |
| Ad-hoc exploration by a data analyst | Either | Either |
| Automated data pipeline | ❌ | ✅ |
| Interactive self-serve analytics for teams | ✅ | ❌ |

---

## Core Concepts in Power BI

### 1. Data Sources
Power BI can connect to: Excel, CSV, SQL databases, SharePoint, web APIs, Azure, Google Analytics, and 100+ other connectors.

### 2. Power Query (ETL Editor)
The built-in data cleaning and transformation tool. Think of it as Excel's Power Query — you can:
- Remove columns, filter rows
- Change data types
- Merge/append tables
- Create calculated columns

### 3. Data Model (Relationships)
Power BI works with a star schema:
- **Fact tables** — transactional data (sales, orders)
- **Dimension tables** — descriptive data (customers, products, dates)
- Relationships connect fact and dimension tables via shared keys

\`\`\`
Sales Table (fact)
  OrderID | CustomerID | ProductID | Date | Revenue | Quantity

Customer Table (dim)          Product Table (dim)
  CustomerID | Name | Region     ProductID | Name | Category | Price

Date Table (dim)
  Date | Day | Month | Quarter | Year
\`\`\`

### 4. DAX (Data Analysis Expressions)
DAX is Power BI's formula language. It looks like Excel but is column-based.

\`\`\`dax
-- Basic measure: total revenue
Total Revenue = SUM(Sales[Revenue])

-- Revenue last year (time intelligence)
Revenue LY = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(Dates[Date]))

-- Year-over-year growth %
YoY Growth % = DIVIDE([Total Revenue] - [Revenue LY], [Revenue LY], 0)

-- Filtered measure: revenue for Electronics only
Electronics Revenue =
    CALCULATE([Total Revenue], Products[Category] = "Electronics")

-- Running total
Running Total =
    CALCULATE([Total Revenue], FILTER(ALL(Dates), Dates[Date] <= MAX(Dates[Date])))
\`\`\`

### 5. Visuals
Drag fields onto the canvas to create:
- Bar/column charts → compare categories
- Line charts → trends over time
- Donut/pie → proportions
- Cards → single KPI numbers
- Tables/matrices → tabular detail
- Maps → geographic data
- Slicers → interactive filters

---

## Core Concepts in Tableau

### 1. Dimensions vs Measures
- **Dimensions** (blue pills): categorical data — Region, Product, Date
- **Measures** (green pills): numeric data that can be aggregated — Revenue, Quantity, Profit

### 2. Rows and Columns Shelf
Drag dimensions/measures to Rows and Columns to define the chart structure. Tableau automatically picks the best chart type.

### 3. Marks Card
Controls the visual encoding: colour, size, shape, label, tooltip.

### 4. Filters
Drag a dimension to the Filters shelf to limit data shown. Context filters apply first to all other filters.

### 5. Calculated Fields
\`\`\`
// Profit Margin
SUM([Profit]) / SUM([Revenue])

// Year-over-Year Growth
(SUM([Revenue]) - LOOKUP(SUM([Revenue]), -1)) / ABS(LOOKUP(SUM([Revenue]), -1))

// Revenue Category
IF [Revenue] > 10000 THEN "High"
ELSEIF [Revenue] > 5000 THEN "Medium"
ELSE "Low"
END
\`\`\`

### 6. Dashboard
Combine multiple worksheets onto one dashboard canvas. Add filter actions so clicking one chart filters all others.

---

## Building a Simple Power BI Dashboard (Step-by-Step)

1. **Open Power BI Desktop** (free download from Microsoft)
2. **Get Data → Text/CSV** — load a sample sales CSV
3. **Transform Data** → Power Query Editor:
   - Check data types (Date should be Date, Revenue should be Decimal)
   - Remove blank rows
   - Close & Apply
4. **Report view** → drag visuals onto canvas:
   - Add a **Card** visual — drag Revenue into it → shows total
   - Add a **Bar Chart** — axis: Category, values: Revenue
   - Add a **Line Chart** — axis: Month, values: Revenue
   - Add a **Slicer** — field: Region (becomes a filter dropdown)
5. **Format visuals** — set title, change colours, adjust font size
6. **Save as .pbix**

---

## Building a Simple Tableau Dashboard (Step-by-Step)

1. **Open Tableau Public** (free at public.tableau.com)
2. **Connect → Text File** — load CSV
3. **Sheet 1**:
   - Drag "Category" to Columns, "Revenue" to Rows → bar chart
   - Change "Revenue" aggregation to SUM
4. **Sheet 2**:
   - Drag "Order Date" to Columns (right-click → Month), Revenue to Rows → line chart
5. **Dashboard tab**:
   - Drag both sheets onto the canvas
   - Add a Filter action: click a bar → filters the line chart
6. **Publish to Tableau Public** (free hosting)

---

## Key Power BI DAX Patterns

\`\`\`dax
-- Count distinct customers
Unique Customers = DISTINCTCOUNT(Sales[CustomerID])

-- Average order value
Avg Order Value = DIVIDE([Total Revenue], [Order Count])

-- % of total (each category's share)
Revenue % of Total =
    DIVIDE([Total Revenue], CALCULATE([Total Revenue], ALL(Products[Category])))

-- YTD Revenue
Revenue YTD = TOTALYTD([Total Revenue], Dates[Date])
\`\`\`

---

## Common Interview Questions on BI Tools

**Q: What's the difference between a measure and a dimension in Tableau?**
A: Dimensions are categorical fields (Region, Product); measures are numeric aggregations (SUM of Revenue, COUNT of orders).

**Q: What is a star schema and why does Power BI use it?**
A: A central fact table linked to multiple dimension tables. It's optimised for analytical queries — fewer joins, faster aggregation.

**Q: When would you use Power BI over writing a Python script?**
A: For interactive self-serve dashboards shared with non-technical stakeholders who need to filter, drill-down, and explore data without code.

---

## Analyst Toolkit Summary

\`\`\`
DATA ANALYST STACK:
═══════════════════════════════════════════════════
 COLLECT     → SQL, Python (requests, APIs)
 CLEAN       → Python (Pandas), Power Query
 ANALYSE     → Python (Pandas, NumPy, SciPy), SQL
 VISUALISE   → Matplotlib, Seaborn, Power BI, Tableau
 COMMUNICATE → Power BI Dashboards, Tableau Stories
═══════════════════════════════════════════════════
\`\`\`

You now have the full NOOB Level toolkit. The next step is putting it all together in a real end-to-end project.
`,
    codeExample: `import pandas as pd
import numpy as np

# ─────────────────────────────────────────────────────────────────────────────
# Simulating what Power BI / Tableau do under the hood with Python equivalents
# Understanding these patterns helps you learn BI tools faster
# ─────────────────────────────────────────────────────────────────────────────

np.random.seed(42)
n = 500

# ── Fact table (like Sales in Power BI) ──────────────────────────────────────
sales = pd.DataFrame({
    'order_id':    range(1, n + 1),
    'customer_id': np.random.randint(1, 51, n),
    'product_id':  np.random.randint(1, 21, n),
    'date':        pd.date_range('2024-01-01', periods=n, freq='D')[:n],
    'revenue':     np.random.exponential(200, n).round(2),
    'quantity':    np.random.randint(1, 10, n),
})

# ── Dimension tables ──────────────────────────────────────────────────────────
products = pd.DataFrame({
    'product_id': range(1, 21),
    'product_name': [f'Product {chr(65+i)}' for i in range(20)],
    'category': np.random.choice(['Electronics','Clothing','Books','Food'], 20),
})

customers = pd.DataFrame({
    'customer_id': range(1, 51),
    'customer_name': [f'Customer {i}' for i in range(1, 51)],
    'region': np.random.choice(['North','South','East','West'], 50),
})

# ── Star schema join (what Power BI does via relationships) ──────────────────
df = (sales
      .merge(products,  on='product_id',  how='left')
      .merge(customers, on='customer_id', how='left'))

df['month']   = df['date'].dt.to_period('M').astype(str)
df['quarter'] = df['date'].dt.to_period('Q').astype(str)

# ── DAX equivalent: Total Revenue = SUM(Sales[Revenue]) ─────────────────────
total_revenue = df['revenue'].sum()
print(f"Total Revenue:    \${total_revenue:,.2f}")

# ── DAX equivalent: Unique Customers = DISTINCTCOUNT(Sales[CustomerID]) ─────
unique_customers = df['customer_id'].nunique()
print(f"Unique Customers: {unique_customers}")

# ── DAX equivalent: Avg Order Value = DIVIDE([Revenue], [Count]) ────────────
avg_order = df['revenue'].mean()
print(f"Avg Order Value:  \${avg_order:,.2f}")

# ── Revenue by Category (bar chart dimension) ─────────────────────────────────
print("\\n=== Revenue by Category ===")
cat_rev = df.groupby('category')['revenue'].sum().sort_values(ascending=False)
for cat, rev in cat_rev.items():
    pct = rev / total_revenue * 100
    bar = '█' * int(pct / 2)
    print(f"  {cat:<15} {bar:<25} \${rev:>10,.2f}  ({pct:.1f}%)")

# ── Revenue by Region (slicer in Power BI) ────────────────────────────────────
print("\\n=== Revenue by Region ===")
print(df.groupby('region')['revenue'].agg(['sum','mean','count']).round(2))

# ── Monthly trend (line chart) ────────────────────────────────────────────────
print("\\n=== Monthly Revenue Trend ===")
monthly = df.groupby('month')['revenue'].sum().head(6)
for month, rev in monthly.items():
    bar = '▓' * int(rev / 1000)
    print(f"  {month}  {bar}  \${rev:,.0f}")

# ── YTD Revenue (DAX: TOTALYTD equivalent) ───────────────────────────────────
df['year'] = df['date'].dt.year
ytd = df[df['year'] == 2024]['revenue'].sum()
print(f"\\n2024 YTD Revenue: \${ytd:,.2f}")

print("\\n✅ BI patterns demonstrated! In Power BI/Tableau, these become")
print("   drag-and-drop visuals updated live by slicer filters.")
`,
    quizzes: [
      {
        question: 'What is the primary advantage of BI tools like Power BI over Python for business dashboards?',
        options: [
          'Non-technical users can interact with and filter data without writing code',
          'BI tools are faster than Python for machine learning',
          'BI tools can handle larger datasets than Python',
          'BI tools do not require any data source connections',
        ],
        correctAnswer: 0,
        explanation: 'BI tools provide drag-and-drop interactivity, making them ideal for sharing self-serve dashboards with stakeholders who don\'t code.',
      },
      {
        question: 'In Power BI\'s data model, a "fact table" typically contains:',
        options: [
          'Transactional records like orders, sales, or events with numeric measures',
          'Descriptive attributes like customer names and product categories',
          'Dashboard layout settings',
          'DAX formula definitions',
        ],
        correctAnswer: 0,
        explanation: 'Fact tables hold measurable, transactional data (revenue, quantity). Dimension tables hold descriptive attributes (customer name, region).',
      },
      {
        question: 'What does this DAX formula compute? `DIVIDE([Total Revenue], CALCULATE([Total Revenue], ALL(Products[Category])))`',
        options: [
          'Each category\'s percentage share of total revenue',
          'Revenue divided by the number of categories',
          'The difference between category revenue and total',
          'Average revenue across all categories',
        ],
        correctAnswer: 0,
        explanation: '`ALL()` removes filters so `CALCULATE` gets the grand total; `DIVIDE` produces each category\'s share as a ratio.',
      },
      {
        question: 'In Tableau, "dimensions" are:',
        options: [
          'Categorical fields shown as blue pills (e.g., Region, Product)',
          'Numeric fields shown as green pills (e.g., Revenue)',
          'Calculated fields only',
          'Dashboard size settings',
        ],
        correctAnswer: 0,
        explanation: 'Tableau colour-codes field types: blue = dimensions (categorical/qualitative), green = measures (numeric/quantitative).',
      },
      {
        question: 'What is a "star schema" in Power BI?',
        options: [
          'A central fact table connected to multiple dimension tables via keys',
          'A chart with five data series',
          'A rating system for dashboard quality',
          'A type of DAX formula structure',
        ],
        correctAnswer: 0,
        explanation: 'The star schema optimises analytical queries: one fact table in the centre, dimension tables radiating out — like a star shape.',
      },
      {
        question: 'The Power BI DAX formula `TOTALYTD([Total Revenue], Dates[Date])` computes:',
        options: [
          'Cumulative revenue from the start of the year to the current date',
          'Total revenue for the last 12 months',
          'Revenue target for the year',
          'Year-over-year growth',
        ],
        correctAnswer: 0,
        explanation: '`TOTALYTD` is a time intelligence function that accumulates the measure from Jan 1 to the current filter date.',
      },
      {
        question: 'Which task is BETTER suited to Python than Power BI?',
        options: [
          'Training a machine learning model on historical sales data',
          'Creating an interactive monthly KPI dashboard for the sales team',
          'Building a self-serve report for a non-technical manager',
          'Publishing a publicly accessible data story',
        ],
        correctAnswer: 0,
        explanation: 'ML/statistical modelling requires code (scikit-learn, TensorFlow, etc.) — BI tools are for visualisation and reporting, not model training.',
      },
      {
        question: 'In Tableau, dragging "Category" to Columns and "SUM(Revenue)" to Rows creates:',
        options: [
          'A bar chart showing revenue for each category',
          'A scatter plot',
          'A filter slicer',
          'A data table',
        ],
        correctAnswer: 0,
        explanation: 'A discrete dimension on Columns and a continuous measure on Rows is Tableau\'s default bar chart configuration.',
      },
      {
        question: 'Power BI\'s Power Query is used for:',
        options: [
          'Cleaning and transforming data before loading into the model',
          'Writing DAX measures',
          'Creating chart visuals',
          'Publishing dashboards to the web',
        ],
        correctAnswer: 0,
        explanation: 'Power Query is the ETL (Extract, Transform, Load) layer — renaming columns, changing types, merging tables, filtering rows before the data reaches visuals.',
      },
      {
        question: 'What does `DISTINCTCOUNT(Sales[CustomerID])` return in DAX?',
        options: [
          'The number of unique customers who made at least one purchase',
          'The total number of sales transactions',
          'The highest customer ID',
          'The average customer ID value',
        ],
        correctAnswer: 0,
        explanation: '`DISTINCTCOUNT` counts unique non-blank values — equivalent to Python\'s `df["customer_id"].nunique()`.',
      },
      {
        question: 'A Tableau "Dashboard" is:',
        options: [
          'A canvas combining multiple worksheet views with interactive filter actions',
          'A single bar chart',
          'The data source connection panel',
          'A calculated field editor',
        ],
        correctAnswer: 0,
        explanation: 'Dashboards assemble multiple sheets (individual charts) and can link them with filter actions so clicking one visual filters others.',
      },
      {
        question: 'Which Power BI file format stores the report, data model, and data together for sharing?',
        options: ['.pbix', '.pbip', '.xlsx', '.csv'],
        correctAnswer: 0,
        explanation: '.pbix is the Power BI Desktop file — a self-contained package with the report layout, data model, and embedded data.',
      },
      {
        question: 'What is the purpose of a "Slicer" visual in Power BI?',
        options: [
          'An interactive filter that lets users select values to filter all other visuals on the page',
          'A chart that "slices" a pie into segments',
          'A tool for splitting a dataset into training and test sets',
          'A data cleaning function in Power Query',
        ],
        correctAnswer: 0,
        explanation: 'Slicers are visual filters — selecting "North" in a Region slicer instantly filters every other visual on the page to show only North data.',
      },
      {
        question: 'In Tableau\'s Marks card, what does the "Colour" option control?',
        options: [
          'The colour encoding of marks based on a dimension or measure',
          'The background colour of the entire dashboard',
          'The font colour of axis labels',
          'The colour of the chart border',
        ],
        correctAnswer: 0,
        explanation: 'Dragging a field to Color in the Marks card encodes that field through colour — categorical fields get distinct hues, continuous fields get a gradient.',
      },
      {
        question: 'Which scenario is the BEST use case for Tableau Public?',
        options: [
          'Sharing a publicly accessible data visualisation portfolio online for free',
          'Building internal company dashboards with sensitive HR data',
          'Running SQL queries on a private database',
          'Training a predictive model on customer churn',
        ],
        correctAnswer: 0,
        explanation: 'Tableau Public is free but publishes dashboards publicly — ideal for portfolios and open data projects; not for private/confidential data.',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Maps option index 0-3 to letter id 'a'-'d'
const IDX_TO_ID = ['a', 'b', 'c', 'd'];

async function main() {
  console.log('🚀 Data Analytics — Noob Level Block 3\n');

  // Find the Data Analytics course
  const course = await prisma.course.findUnique({ where: { slug: 'data-analytics' } });
  if (!course) throw new Error('data-analytics course not found — run dataAnalytics.ts first');

  console.log(`📚 Seeding ${CHAPTERS.length} chapters...\n`);

  for (const ch of CHAPTERS) {
    // Build questions in the format Question model expects
    const questions = ch.quizzes.map((qz, i) => ({
      text:          qz.question,
      options:       JSON.stringify(
        qz.options.map((opt: string, idx: number) => ({ id: IDX_TO_ID[idx], text: opt }))
      ),
      correctAnswer: IDX_TO_ID[qz.correctAnswer],
      explanation:   qz.explanation,
      orderIndex:    i + 1,
    }));

    // Check if chapter already exists
    const existingChapter = await prisma.chapter.findFirst({
      where: { slug: ch.slug },
      select: { id: true },
    });

    let chapterId: string;

    if (existingChapter) {
      chapterId = existingChapter.id;

      // Check if quiz already exists for this chapter
      const existingQuiz = await prisma.quiz.findFirst({
        where: { chapterId },
        select: { id: true },
      });

      if (existingQuiz) {
        console.log(`  ⏭  [${ch.orderIndex}] ${ch.title}  (already exists — skipping)`);
        continue;
      }

      // Chapter exists but quiz is missing — create quiz only
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
      console.log(`  ✅ [${ch.orderIndex}] ${ch.title}  (quiz repaired · ${questions.length} Qs · ${ch.xpReward} XP)`);
      continue;
    }

    // Create chapter
    const { quizzes: _qs, ...chapterData } = ch;
    const chapter = await prisma.chapter.create({
      data: { ...chapterData, courseId: course.id },
    });
    chapterId = chapter.id;

    // Create quiz with nested questions
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

    console.log(`  ✅ [${ch.orderIndex}] ${ch.title}  (${questions.length} Qs · ${ch.xpReward} XP)`);
  }

  console.log('\n🎉 Block 3 complete! Noob Level chapters 9-12 seeded.');
  console.log('   Next: run seed:da-noob-b4 for Mini Project, Portfolio, Business Thinking & Interview Prep');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
