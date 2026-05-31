/**
 * aiFoundationsNoobBlock3.ts
 * AI Foundations — NOOB Tier — Block 3 (Chapters 11–15)
 *
 * Ch 11 — Pandas — DataFrames & Series
 * Ch 12 — Pandas — Data Cleaning
 * Ch 13 — Pandas — GroupBy & Aggregation
 * Ch 14 — Matplotlib — Basic Visualization
 * Ch 15 — Seaborn & Statistical Charts
 *
 * Run: cd backend && npm run seed:af-noob-b3
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function q(text: string, options: {id:string;text:string}[], correctAnswer: string, explanation: string, orderIndex: number) {
  return { text, options: JSON.stringify(options), correctAnswer, explanation, orderIndex };
}

const COURSE_SLUG = 'foundations';

const CHAPTERS = [
  {
    slug: 'af-noob-11-pandas-basics',
    title: 'Pandas — DataFrames & Series',
    description: 'Creating and inspecting DataFrames, Series operations, reading CSVs, and navigating data with loc/iloc — the #1 skill for every data scientist.',
    orderIndex: 11,
    xpReward: 70,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 11 — Pandas — DataFrames & Series

## 🎯 Learning Goals
Load, inspect, and navigate tabular data using Pandas — the tool you'll use for every real-world AI dataset.

---

## 1. Creating a DataFrame

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "name":  ["Alice", "Bob", "Carol"],
    "score": [92, 85, 78],
    "grade": ["A", "B", "C"],
})
\`\`\`

---

## 2. Inspecting Data

\`\`\`python
df.head(3)        # first 3 rows
df.tail(2)        # last 2 rows
df.shape          # (rows, cols)
df.dtypes         # column types
df.describe()     # statistics
df.info()         # non-null counts
\`\`\`

---

## 3. Selecting Data

\`\`\`python
df["score"]                  # one column → Series
df[["name","score"]]         # two columns → DataFrame
df.loc[0]                    # row by label
df.iloc[0:2, 1:3]            # row/col by integer position
df[df["score"] > 80]         # filter rows
\`\`\`

---

## 4. Reading & Writing Files

\`\`\`python
df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx")
df.to_csv("output.csv", index=False)
\`\`\`

---

## 5. Series Operations

\`\`\`python
s = df["score"]
s.mean(), s.std(), s.max()
s.value_counts()
s.apply(lambda x: "pass" if x >= 70 else "fail")
\`\`\``,
    codeExample: `import pandas as pd, numpy as np

np.random.seed(42)
N = 20
df = pd.DataFrame({
    "student_id": range(1, N+1),
    "math":       np.random.randint(50, 100, N),
    "science":    np.random.randint(50, 100, N),
    "english":    np.random.randint(50, 100, N),
    "grade":      np.random.choice(["A","B","C","D"], N),
})

print("=== DataFrame Info ===")
print(f"Shape: {df.shape}")
print(df.head())

print("\\n=== Statistics ===")
print(df[["math","science","english"]].describe().round(2))

print("\\n=== Filtering: math > 80 ===")
high = df[df["math"] > 80][["student_id","math","grade"]]
print(high)

print("\\n=== Grade Counts ===")
print(df["grade"].value_counts())

df["avg"] = df[["math","science","english"]].mean(axis=1).round(1)
df["result"] = df["avg"].apply(lambda x: "pass" if x >= 60 else "fail")
print("\\n=== With Avg & Result ===")
print(df[["student_id","avg","result"]].head(8))`,
    questions: [
      q('What does df.shape return?', [{id:'a',text:'Number of columns'},{id:'b',text:'A tuple (rows, columns)'},{id:'c',text:'List of column names'},{id:'d',text:'Data types'}], 'b', 'df.shape returns a tuple (num_rows, num_cols).', 0),
      q('How do you select rows where the "score" column is above 80?', [{id:'a',text:'df.score > 80'},{id:'b',text:'df[df["score"] > 80]'},{id:'c',text:'df.filter("score > 80")'},{id:'d',text:'df.loc["score"] > 80'}], 'b', 'Boolean indexing: df[condition] returns only rows where condition is True.', 1),
      q('What is the difference between loc and iloc?', [{id:'a',text:'No difference'},{id:'b',text:'loc uses label-based indexing; iloc uses integer position'},{id:'c',text:'loc is faster'},{id:'d',text:'iloc works on columns; loc on rows'}], 'b', 'loc uses row labels; iloc uses 0-based integer positions.', 2),
      q('What does df.describe() return?', [{id:'a',text:'Column names only'},{id:'b',text:'Count, mean, std, min, quartiles, max for numeric columns'},{id:'c',text:'Data types'},{id:'d',text:'Missing value counts'}], 'b', 'describe() produces summary statistics for all numeric columns.', 3),
      q('How do you read a CSV file into a DataFrame?', [{id:'a',text:'pd.open_csv("file.csv")'},{id:'b',text:'pd.read_csv("file.csv")'},{id:'c',text:'pd.DataFrame("file.csv")'},{id:'d',text:'pd.load("file.csv")'}], 'b', 'pd.read_csv is the standard function for loading CSV files.', 4),
      q('What does Series.value_counts() return?', [{id:'a',text:'Unique values in sorted order'},{id:'b',text:'Count of each unique value in descending order'},{id:'c',text:'Sum of all values'},{id:'d',text:'Missing value positions'}], 'b', 'value_counts() returns a Series with each unique value and its frequency.', 5),
      q('Which method applies a function to every element of a Series?', [{id:'a',text:'.map()'},{id:'b',text:'.apply()'},{id:'c',text:'Both .map() and .apply() work element-wise on Series'},{id:'d',text:'.transform()'}], 'c', 'Both .map() and .apply() apply a function element-wise to a Series.', 6),
      q('What does pd.read_csv(..., index_col=0) do?', [{id:'a',text:'Ignores the first column'},{id:'b',text:'Uses the first column as the row index'},{id:'c',text:'Reads only the first column'},{id:'d',text:'Skips the header row'}], 'b', 'index_col=0 sets the first column as the DataFrame\'s index instead of a data column.', 7),
      q('How do you save a DataFrame to CSV without the index column?', [{id:'a',text:'df.save("f.csv")'},{id:'b',text:'df.to_csv("f.csv", index=False)'},{id:'c',text:'df.write("f.csv")'},{id:'d',text:'df.export("f.csv", no_index=True)'}], 'b', 'to_csv with index=False prevents writing the integer row index as a column.', 8),
      q('Why is Pandas critical for AI/ML projects?', [{id:'a',text:'It trains neural networks'},{id:'b',text:'It handles loading, cleaning, filtering, and transforming tabular datasets before feeding them to models'},{id:'c',text:'It replaces NumPy'},{id:'d',text:'It visualises data'}], 'b', 'Pandas is the standard for dataset preparation — the first step in every ML pipeline.', 9),
    ],
  },

  {
    slug: 'af-noob-12-pandas-cleaning',
    title: 'Pandas — Data Cleaning',
    description: 'Handling missing values, duplicates, outliers, type conversion, string operations, and merging datasets — because real data is always messy.',
    orderIndex: 12,
    xpReward: 70,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 12 — Pandas Data Cleaning

## 🎯 Learning Goals
Clean messy real-world datasets so they are ready for machine learning.

---

## 1. Missing Values

\`\`\`python
df.isnull().sum()          # count NaN per column
df.dropna()                # drop rows with any NaN
df.fillna(0)               # fill NaN with 0
df["col"].fillna(df["col"].mean())  # fill with mean
df.interpolate()           # interpolate time series
\`\`\`

---

## 2. Duplicates

\`\`\`python
df.duplicated().sum()      # count duplicate rows
df.drop_duplicates()       # remove duplicates
df.drop_duplicates(subset=["email"])
\`\`\`

---

## 3. Type Conversion

\`\`\`python
df["age"] = df["age"].astype(int)
df["date"] = pd.to_datetime(df["date"])
df["cat"]  = df["cat"].astype("category")
\`\`\`

---

## 4. String Operations

\`\`\`python
df["name"].str.lower()
df["name"].str.strip()
df["name"].str.contains("Dr")
df["name"].str.replace("-", "_")
\`\`\`

---

## 5. Merging & Joining

\`\`\`python
pd.merge(df1, df2, on="id", how="left")
pd.concat([df1, df2], axis=0)  # stack rows
\`\`\``,
    codeExample: `import pandas as pd, numpy as np

np.random.seed(7)
raw = pd.DataFrame({
    "id":      [1,2,3,4,4,5,6],
    "name":    ["Alice","bob","Carol",None,"Dave ","Eve","Frank"],
    "age":     [25, np.nan, 30, 22, 22, None, 28],
    "salary":  [50000, 60000, None, 45000, 45000, 55000, 70000],
    "dept":    ["eng","MKT","eng","hr","hr","MKT","eng"],
})

print("=== Raw Data ===")
print(raw)
print(f"\\nMissing values:\\n{raw.isnull().sum()}")
print(f"Duplicates: {raw.duplicated().sum()}")

# Fix duplicates
df = raw.drop_duplicates(subset=["id"])

# Fix missing values
df["age"]    = df["age"].fillna(df["age"].median())
df["salary"] = df["salary"].fillna(df["salary"].mean())
df["name"]   = df["name"].fillna("Unknown")

# Fix strings
df["name"] = df["name"].str.strip().str.title()
df["dept"] = df["dept"].str.upper()

print("\\n=== Cleaned Data ===")
print(df)
print(f"Remaining NaN: {df.isnull().sum().sum()}")`,
    questions: [
      q('What does df.isnull().sum() return?', [{id:'a',text:'Total missing values'},{id:'b',text:'Count of missing values per column'},{id:'c',text:'Boolean DataFrame'},{id:'d',text:'Rows with missing values'}], 'b', 'isnull() creates a boolean mask; .sum() counts True values per column.', 0),
      q('Which method removes rows where any value is NaN?', [{id:'a',text:'df.fillna()'},{id:'b',text:'df.remove_nan()'},{id:'c',text:'df.dropna()'},{id:'d',text:'df.clean()'}], 'c', 'dropna() drops rows (or cols) that contain any NaN value.', 1),
      q('How do you fill missing numeric values with the column mean?', [{id:'a',text:'df.fillna("mean")'},{id:'b',text:'df["col"].fillna(df["col"].mean())'},{id:'c',text:'df.replace(NaN, mean)'},{id:'d',text:'df.impute(strategy="mean")'}], 'b', 'Calling .fillna() with the column\'s mean fills NaN with that value.', 2),
      q('What does df.drop_duplicates(subset=["email"]) do?', [{id:'a',text:'Removes all duplicate columns'},{id:'b',text:'Removes rows where the email column is duplicated'},{id:'c',text:'Keeps only the email column'},{id:'d',text:'Drops the email column'}], 'b', 'subset restricts duplicate detection to only the specified columns.', 3),
      q('What does df["name"].str.strip() do?', [{id:'a',text:'Removes all spaces'},{id:'b',text:'Removes leading and trailing whitespace'},{id:'c',text:'Converts to lowercase'},{id:'d',text:'Counts characters'}], 'b', '.str.strip() removes leading and trailing whitespace from string entries.', 4),
      q('How do you convert an object column to datetime?', [{id:'a',text:'df["d"].astype(datetime)'},{id:'b',text:'pd.to_datetime(df["d"])'},{id:'c',text:'df["d"].str.to_date()'},{id:'d',text:'df["d"].convert("date")'}], 'b', 'pd.to_datetime() parses string columns into datetime64 dtype.', 5),
      q('What does pd.merge(df1, df2, on="id", how="left") do?', [{id:'a',text:'Returns only rows in both DataFrames'},{id:'b',text:'Returns all rows from df1, matching rows from df2 where id matches'},{id:'c',text:'Returns all rows from df2 only'},{id:'d',text:'Appends df2 below df1'}], 'b', 'Left join keeps all rows from the left DataFrame and matches from the right.', 6),
      q('Why should you convert string columns with categories to "category" dtype?', [{id:'a',text:'Categories are immutable'},{id:'b',text:'It reduces memory and speeds up groupby/sorting'},{id:'c',text:'It allows mathematical operations'},{id:'d',text:'Required for CSV saving'}], 'b', 'Category dtype stores codes internally instead of repeated strings — lower memory, faster ops.', 7),
      q('What is the difference between pd.concat and pd.merge?', [{id:'a',text:'No difference'},{id:'b',text:'concat stacks DataFrames along an axis; merge joins on key columns like SQL JOIN'},{id:'c',text:'concat is faster for large datasets'},{id:'d',text:'merge only works for SQL data'}], 'b', 'concat stacks (row/column); merge/join aligns on shared keys.', 8),
      q('In an ML pipeline, why is data cleaning done BEFORE modelling?', [{id:'a',text:'Models run faster on clean data'},{id:'b',text:'Missing values and inconsistent types cause errors or distorted patterns in models'},{id:'c',text:'Clean data uses less disk space'},{id:'d',text:'ML frameworks only accept clean data'}], 'b', 'Garbage in, garbage out — dirty data leads to biased, inaccurate models.', 9),
    ],
  },

  {
    slug: 'af-noob-13-pandas-groupby',
    title: 'Pandas — GroupBy & Aggregation',
    description: 'Grouping data, computing aggregates, pivot tables, and applying custom functions — the analytical core of Exploratory Data Analysis.',
    orderIndex: 13,
    xpReward: 70,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 13 — Pandas GroupBy & Aggregation

## 🎯 Learning Goals
Compute group-level statistics and build pivot tables — the backbone of EDA in every AI project.

---

## 1. groupby Basics

\`\`\`python
df.groupby("category")["sales"].sum()
df.groupby("category")["sales"].mean()
df.groupby("dept")["salary"].agg(["mean","std","count"])
\`\`\`

groupby splits → applies → combines results.

---

## 2. Multiple Aggregations

\`\`\`python
df.groupby("dept").agg(
    avg_salary=("salary", "mean"),
    headcount=("name", "count"),
    max_age=("age", "max"),
)
\`\`\`

---

## 3. Pivot Tables

\`\`\`python
pd.pivot_table(df, values="sales",
               index="region",
               columns="product",
               aggfunc="sum",
               fill_value=0)
\`\`\`

---

## 4. apply with Custom Functions

\`\`\`python
def z_score(x):
    return (x - x.mean()) / x.std()

df.groupby("dept")["salary"].transform(z_score)
\`\`\`

transform returns a Series aligned with the original DataFrame.

---

## 5. Sorting & Ranking

\`\`\`python
df.sort_values("sales", ascending=False)
df["rank"] = df["sales"].rank(ascending=False)
\`\`\``,
    codeExample: `import pandas as pd, numpy as np

np.random.seed(1)
df = pd.DataFrame({
    "dept":   np.random.choice(["Engineering","Marketing","HR"], 30),
    "level":  np.random.choice(["Junior","Senior","Lead"], 30),
    "salary": np.random.randint(40000, 120000, 30),
    "perf":   np.round(np.random.uniform(2.5, 5.0, 30), 1),
})

# 1. Simple groupby
print("=== Avg Salary by Dept ===")
print(df.groupby("dept")["salary"].mean().round(0))

# 2. Multi-aggregation
print("\\n=== Dept Stats ===")
stats = df.groupby("dept").agg(
    avg_salary=("salary","mean"),
    headcount=("salary","count"),
    avg_perf=("perf","mean"),
).round(1)
print(stats)

# 3. Pivot table — salary heatmap
print("\\n=== Salary Pivot (Dept × Level) ===")
pivot = pd.pivot_table(df, values="salary",
                       index="dept", columns="level",
                       aggfunc="mean", fill_value=0).round(0)
print(pivot)

# 4. transform — z-score within dept
df["salary_z"] = df.groupby("dept")["salary"].transform(
    lambda x: (x - x.mean()) / x.std()
).round(3)

print("\\n=== Top 5 by Salary ===")
print(df.sort_values("salary", ascending=False)
        [["dept","level","salary","salary_z"]].head(5))`,
    questions: [
      q('What does df.groupby("dept")["salary"].mean() compute?', [{id:'a',text:'The mean salary across all departments'},{id:'b',text:'The mean salary separately for each unique department value'},{id:'c',text:'A grouped DataFrame'},{id:'d',text:'The count per department'}], 'b', 'groupby splits the data by department, then mean() is applied to each group.', 0),
      q('What does the .agg() method accept?', [{id:'a',text:'Only a single function name as a string'},{id:'b',text:'A list or dict of aggregation functions to apply'},{id:'c',text:'Only NumPy functions'},{id:'d',text:'Boolean conditions'}], 'b', '.agg() accepts lists, dicts, or named aggregations for flexible multi-function summaries.', 1),
      q('What is the difference between .agg() and .transform()?', [{id:'a',text:'No difference'},{id:'b',text:'agg reduces groups to scalars; transform returns a result with the same index as the original'},{id:'c',text:'transform is faster'},{id:'d',text:'agg only works with built-in functions'}], 'b', 'agg gives one row per group; transform broadcasts the result back to every original row.', 2),
      q('What does pd.pivot_table fill_value=0 do?', [{id:'a',text:'Fills all zeros with NaN'},{id:'b',text:'Replaces NaN in the pivot result with 0'},{id:'c',text:'Sets the default value for all cells'},{id:'d',text:'Rounds values to 0 decimal places'}], 'b', 'fill_value replaces NaN produced by missing group combinations in the pivot.', 3),
      q('What does df.sort_values("score", ascending=False) do?', [{id:'a',text:'Sorts in ascending order'},{id:'b',text:'Sorts rows from highest to lowest score'},{id:'c',text:'Returns only the max score row'},{id:'d',text:'Resets the index'}], 'b', 'ascending=False gives descending order — highest values first.', 4),
      q('What is a z-score standardisation?', [{id:'a',text:'Scales values to [0,1]'},{id:'b',text:'(value - mean) / std — how many standard deviations from the mean'},{id:'c',text:'Removes outliers'},{id:'d',text:'Converts to percentile rank'}], 'b', 'Z-score measures deviation from the group mean in units of standard deviation.', 5),
      q('Why is GroupBy used in EDA?', [{id:'a',text:'To train ML models per group'},{id:'b',text:'To understand patterns within subgroups of data (e.g., behaviour per category)'},{id:'c',text:'To filter out rows'},{id:'d',text:'To sort data'}], 'b', 'GroupBy reveals group-level trends that are hidden in dataset-wide averages.', 6),
      q('What does df["rank"] = df["salary"].rank() compute?', [{id:'a',text:'The index of each salary'},{id:'b',text:'The relative rank of each salary from smallest to largest'},{id:'c',text:'Percentile'},{id:'d',text:'Z-score'}], 'b', '.rank() assigns a rank (1 = smallest by default) to each element.', 7),
      q('How do you compute the count of employees per department using groupby?', [{id:'a',text:'df.groupby("dept").len()'},{id:'b',text:'df.groupby("dept")["name"].count()'},{id:'c',text:'df.count("dept")'},{id:'d',text:'len(df.groupby("dept"))'}], 'b', '.count() on a column after groupby gives non-null count per group.', 8),
      q('In ML feature engineering, why is group-level statistics useful?', [{id:'a',text:'It replaces the model'},{id:'b',text:'Computing group means/stds creates powerful features (e.g., avg salary of dept) that capture context'},{id:'c',text:'It cleans missing values'},{id:'d',text:'It visualises data'}], 'b', 'Group aggregations encode contextual information — a key technique in Kaggle-winning feature engineering.', 9),
    ],
  },

  {
    slug: 'af-noob-14-matplotlib',
    title: 'Matplotlib — Basic Visualization',
    description: 'Line plots, bar charts, scatter plots, histograms, and subplots — visualisation is how you understand data and debug your models.',
    orderIndex: 14,
    xpReward: 65,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 14 — Matplotlib Basic Visualization

## 🎯 Learning Goals
Create publication-quality plots to understand data distributions, training curves, and model performance.

---

## 1. Basic Plot Structure

\`\`\`python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(x, y, label="Loss", color="blue")
ax.set_xlabel("Epoch")
ax.set_ylabel("Loss")
ax.set_title("Training Curve")
ax.legend()
plt.tight_layout()
plt.savefig("plot.png", dpi=150)
plt.show()
\`\`\`

---

## 2. Chart Types

\`\`\`python
ax.plot(x, y)              # line — training curves
ax.bar(categories, values) # bar — category comparison
ax.scatter(x, y, c=labels) # scatter — feature relationships
ax.hist(data, bins=30)     # histogram — distributions
ax.boxplot(data)           # box — outlier detection
\`\`\`

---

## 3. Subplots

\`\`\`python
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(train_loss)
axes[1].plot(val_loss)
\`\`\`

---

## 4. Styling

\`\`\`python
plt.style.use("seaborn-v0_8")
ax.set_xlim(0, 100)
ax.axhline(0.01, ls="--", color="red", label="Threshold")
\`\`\``,
    codeExample: `import matplotlib
matplotlib.use('Agg')   # non-interactive backend for scripts
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(0)
epochs = range(1, 51)
train_loss = [2.0 * np.exp(-0.1 * e) + np.random.normal(0,0.05) for e in epochs]
val_loss   = [2.2 * np.exp(-0.09 * e) + np.random.normal(0,0.08) for e in epochs]
train_acc  = [1 - l/2.2 for l in train_loss]
val_acc    = [1 - l/2.5 for l in val_loss]

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Plot 1 — Loss curves
axes[0].plot(epochs, train_loss, label="Train Loss", color="steelblue")
axes[0].plot(epochs, val_loss,   label="Val Loss",   color="coral", ls="--")
axes[0].set_title("Training & Validation Loss")
axes[0].set_xlabel("Epoch"); axes[0].set_ylabel("Loss")
axes[0].legend(); axes[0].grid(alpha=0.3)

# Plot 2 — Accuracy curves
axes[1].plot(epochs, train_acc, label="Train Acc", color="green")
axes[1].plot(epochs, val_acc,   label="Val Acc",   color="orange", ls="--")
axes[1].set_title("Training & Validation Accuracy")
axes[1].set_xlabel("Epoch"); axes[1].set_ylabel("Accuracy")
axes[1].set_ylim(0, 1); axes[1].legend(); axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.savefig("training_curves.png", dpi=120, bbox_inches="tight")
print("Plot saved to training_curves.png")
print(f"Final train loss: {train_loss[-1]:.4f}")
print(f"Final val   acc : {val_acc[-1]:.4f}")`,
    questions: [
      q('What does fig, ax = plt.subplots() create?', [{id:'a',text:'Two separate plots'},{id:'b',text:'A Figure object and an Axes object for a single plot'},{id:'c',text:'A grid of plots'},{id:'d',text:'A canvas only'}], 'b', 'subplots() returns the figure (canvas) and axes (individual plot) objects.', 0),
      q('Which chart type is best for visualising a neural network training curve?', [{id:'a',text:'Bar chart'},{id:'b',text:'Pie chart'},{id:'c',text:'Line plot'},{id:'d',text:'Histogram'}], 'c', 'Training and validation loss/accuracy over epochs are continuous sequences — line plots show trends clearly.', 1),
      q('What does ax.scatter(x, y, c=labels) do?', [{id:'a',text:'Creates a line plot coloured by labels'},{id:'b',text:'Creates a scatter plot with each point coloured according to its label'},{id:'c',text:'Creates a bar chart'},{id:'d',text:'Creates a histogram of labels'}], 'b', 'c parameter colours each dot — great for visualising class separation in feature space.', 2),
      q('What is a histogram used for?', [{id:'a',text:'Comparing categories'},{id:'b',text:'Showing the distribution/frequency of a continuous variable'},{id:'c',text:'Plotting correlations'},{id:'d',text:'Tracking values over time'}], 'b', 'Histograms bin continuous values and show how data is distributed — essential for EDA.', 3),
      q('What does plt.tight_layout() do?', [{id:'a',text:'Saves the figure'},{id:'b',text:'Adjusts subplot spacing to prevent labels from overlapping'},{id:'c',text:'Sets the figure size'},{id:'d',text:'Displays the figure'}], 'b', 'tight_layout automatically adjusts spacing so titles, labels, and subplots do not overlap.', 4),
      q('How do you save a matplotlib figure to a file?', [{id:'a',text:'plt.export("file.png")'},{id:'b',text:'plt.savefig("file.png")'},{id:'c',text:'fig.write("file.png")'},{id:'d',text:'ax.save("file.png")'}], 'b', 'plt.savefig() writes the current figure to disk in the specified format.', 5),
      q('What does the "ls" or "linestyle" parameter control?', [{id:'a',text:'Line colour'},{id:'b',text:'Line width'},{id:'c',text:'Line style (solid, dashed, dotted)'},{id:'d',text:'Marker type'}], 'c', 'ls="--" gives a dashed line, ls=":" dotted — useful for distinguishing train vs validation.', 6),
      q('How do you create a 1×2 grid of subplots?', [{id:'a',text:'plt.subplots(2)'},{id:'b',text:'plt.subplots(1, 2)'},{id:'c',text:'plt.grid(1, 2)'},{id:'d',text:'plt.axes(1, 2)'}], 'b', 'subplots(rows, cols) creates a grid — (1,2) gives two side-by-side axes.', 7),
      q('What does ax.axhline(y=0.5) draw?', [{id:'a',text:'A vertical line at x=0.5'},{id:'b',text:'A horizontal line at y=0.5'},{id:'c',text:'A diagonal line'},{id:'d',text:'A point at (0, 0.5)'}], 'b', 'axhline draws a horizontal line across the full axes at the specified y value.', 8),
      q('In ML, why is visualising training curves important?', [{id:'a',text:'It trains the model faster'},{id:'b',text:'It reveals overfitting, underfitting, and convergence — guiding hyperparameter tuning'},{id:'c',text:'It replaces the confusion matrix'},{id:'d',text:'It is required by most ML frameworks'}], 'b', 'Training curves show when to stop early, adjust learning rate, or add regularisation.', 9),
    ],
  },

  {
    slug: 'af-noob-15-seaborn',
    title: 'Seaborn & Statistical Charts',
    description: 'Heatmaps, pairplots, violin plots, and distribution charts with Seaborn — the high-level visualisation library built for data science workflows.',
    orderIndex: 15,
    xpReward: 65,
    difficulty: 'BEGINNER',
    tier: 'NOOB',
    language: 'python',
    content: `# Chapter 15 — Seaborn & Statistical Charts

## 🎯 Learning Goals
Use Seaborn to create statistical visualisations that reveal patterns, correlations, and distributions in your datasets.

---

## 1. Seaborn vs Matplotlib

Seaborn is built on top of Matplotlib but provides:
- Higher-level API — fewer lines of code
- Beautiful defaults
- Direct DataFrame integration
- Statistical plots out-of-the-box

---

## 2. Distribution Plots

\`\`\`python
import seaborn as sns

sns.histplot(df["score"], kde=True)     # histogram + KDE
sns.boxplot(x="dept", y="salary", data=df)   # box-and-whisker
sns.violinplot(x="class", y="value", data=df) # violin
\`\`\`

---

## 3. Relationship Plots

\`\`\`python
sns.scatterplot(x="feature1", y="feature2", hue="label", data=df)
sns.lineplot(x="epoch", y="loss", hue="split", data=df)
sns.regplot(x="x", y="y", data=df)   # scatter + regression line
\`\`\`

---

## 4. Correlation Heatmap

\`\`\`python
corr = df.corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
\`\`\`

The correlation heatmap is one of the first things to create in every EDA.

---

## 5. Pairplot

\`\`\`python
sns.pairplot(df, hue="target")
\`\`\`

Shows all pairwise scatter plots and distributions — instant overview of a dataset.`,
    codeExample: `import matplotlib
matplotlib.use('Agg')
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd, numpy as np

np.random.seed(0)
N = 150
df = pd.DataFrame({
    "feature1": np.random.randn(N),
    "feature2": np.random.randn(N) * 0.5 + 1,
    "feature3": np.random.randn(N) * 2,
    "target":   np.random.choice(["class_A","class_B","class_C"], N),
})
# add correlation
df["feature2"] += 0.6 * df["feature1"]

# 1. Correlation heatmap
numeric = df[["feature1","feature2","feature3"]]
corr = numeric.corr()
print("=== Correlation Matrix ===")
print(corr.round(3))

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f",
            vmin=-1, vmax=1, ax=axes[0])
axes[0].set_title("Feature Correlation Heatmap")

# 2. Scatter by class
sns.scatterplot(x="feature1", y="feature2",
                hue="target", data=df, alpha=0.7, ax=axes[1])
axes[1].set_title("Feature1 vs Feature2 (by class)")

plt.tight_layout()
plt.savefig("seaborn_eda.png", dpi=120)
print("\\nSaved seaborn_eda.png")

# 3. Distribution summary
print("\\n=== Distribution Summary ===")
for col in ["feature1","feature2","feature3"]:
    s = df[col]
    print(f"{col}: mean={s.mean():.2f} std={s.std():.2f} "
          f"skew={s.skew():.2f}")`,
    questions: [
      q('What is the main advantage of Seaborn over raw Matplotlib?', [{id:'a',text:'It is faster'},{id:'b',text:'It provides a high-level interface with beautiful statistical plot defaults'},{id:'c',text:'It supports 3D plotting'},{id:'d',text:'It replaces Pandas'}], 'b', 'Seaborn produces statistical charts with far less code and polished aesthetics by default.', 0),
      q('What does sns.heatmap(df.corr()) visualise?', [{id:'a',text:'Distribution of each column'},{id:'b',text:'Pairwise correlation coefficients between all numeric columns'},{id:'c',text:'Missing values'},{id:'d',text:'Outliers'}], 'b', 'df.corr() computes the correlation matrix; heatmap encodes it with colour.', 1),
      q('What does the "hue" parameter do in sns.scatterplot?', [{id:'a',text:'Sets the point size'},{id:'b',text:'Colours points by a categorical column — showing class separation'},{id:'c',text:'Sets transparency'},{id:'d',text:'Draws a regression line'}], 'b', 'hue maps a column to colour, visually separating groups in the scatter plot.', 2),
      q('When would you use a violin plot over a box plot?', [{id:'a',text:'When you have only a few data points'},{id:'b',text:'When you want to see the full distribution shape, not just quartiles'},{id:'c',text:'When data is perfectly normal'},{id:'d',text:'Violin plots are always better'}], 'b', 'Violin plots show the kernel density estimate — revealing multi-modal distributions hidden in box plots.', 3),
      q('What does sns.histplot(data, kde=True) add to the histogram?', [{id:'a',text:'A bar chart overlay'},{id:'b',text:'A smoothed kernel density estimate curve'},{id:'c',text:'A regression line'},{id:'d',text:'A cumulative distribution'}], 'b', 'KDE=True adds a smoothed density curve over the histogram bars.', 4),
      q('What does sns.pairplot(df, hue="target") produce?', [{id:'a',text:'A single scatter plot'},{id:'b',text:'A grid of scatter plots for every feature pair, coloured by target class'},{id:'c',text:'A correlation heatmap'},{id:'d',text:'Histograms only'}], 'b', 'pairplot creates an n×n grid — diagonals show distributions, off-diagonals show scatter plots.', 5),
      q('What correlation value indicates a strong positive linear relationship?', [{id:'a',text:'0.0'},{id:'b',text:'-1.0'},{id:'c',text:'Close to 1.0'},{id:'d',text:'Close to 0.5'}], 'c', 'Pearson correlation ranges [-1, 1]. Values close to 1 indicate strong positive correlation.', 6),
      q('Why is the correlation heatmap one of the first EDA steps?', [{id:'a',text:'It trains a model'},{id:'b',text:'It reveals which features are related to the target and to each other, guiding feature selection'},{id:'c',text:'It cleans missing values'},{id:'d',text:'It sets plot styles'}], 'b', 'High correlation with target identifies useful features; high inter-feature correlation flags multicollinearity.', 7),
      q('What does sns.regplot add to a scatter plot?', [{id:'a',text:'A histogram'},{id:'b',text:'A linear regression line with confidence interval'},{id:'c',text:'A correlation coefficient'},{id:'d',text:'Outlier markers'}], 'b', 'regplot overlays a regression line and confidence band — shows the linear trend.', 8),
      q('In the context of ML feature engineering, what does discovering high feature correlation mean?', [{id:'a',text:'Both features should always be used'},{id:'b',text:'One feature may be redundant — dimensionality can be reduced'},{id:'c',text:'The model will overfit'},{id:'d',text:'Data is clean'}], 'b', 'Highly correlated features add redundant information — removing one can reduce noise without losing information.', 9),
    ],
  },
];

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: COURSE_SLUG } });
  if (!course) throw new Error(`Course "${COURSE_SLUG}" not found`);

  for (const ch of CHAPTERS) {
    const existing = await prisma.chapter.findFirst({ where: { courseId: course.id, slug: ch.slug } });
    if (existing) { console.log(`⏭  Skip  ${ch.slug}`); continue; }

    const { questions, ...chapterData } = ch;
    const chapter = await prisma.chapter.create({ data: { ...chapterData, courseId: course.id } });
    await prisma.quiz.create({
      data: {
        chapterId: chapter.id, title: `${ch.title} Quiz`,
        description: `Test your knowledge of ${ch.title}`,
        timeLimit: 600, passingScore: 70, xpReward: Math.round(ch.xpReward * 0.8),
        questions: { create: questions },
      },
    });
    console.log(`✅ Created ch ${ch.orderIndex}: ${ch.title}`);
  }
  console.log('\n🎉 AI Foundations NOOB Block 3 seeded!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
