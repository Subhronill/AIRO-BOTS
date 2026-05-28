/**
 * dataAnalyticsNoobBlock4.ts
 * Noob Level — Block 4 (Chapters 13–16)  ← FINAL NOOB BLOCK
 *
 * Covers:
 *   Ch 13 — Your First End-to-End Data Project
 *   Ch 14 — Building Your Data Analyst Portfolio
 *   Ch 15 — Business Thinking for Data Analysts
 *   Ch 16 — Interview Prep — Cracking the Noob Barrier
 *
 * Run:  cd backend && npm run seed:da-noob-b4
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const IDX_TO_ID = ['a', 'b', 'c', 'd'];

const CHAPTERS = [

  // ══════════════════════════════════════════════
  // CHAPTER 13 — YOUR FIRST END-TO-END DATA PROJECT
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-13-first-project',
    title:       'Your First End-to-End Data Project',
    description: 'Put everything together: load real data, clean it, explore it, visualise it, and present a clear business insight — exactly what employers want to see.',
    orderIndex:  13,
    xpReward:    100,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    content: `# Your First End-to-End Data Project

> **"The best way to learn data analysis is to do data analysis."** — A project is worth more than 100 tutorials. This is where everything you've learned becomes real.

---

## What Makes a Good First Project?

A strong first project:
1. Uses **real or realistic data** (not toy arrays)
2. Has a **business question** to answer (not just "clean the data")
3. Goes through the **full workflow**: load → clean → explore → visualise → conclude
4. Can be **explained to a non-technical person** in 2 minutes
5. Is **published somewhere** others can see it (GitHub, Kaggle, Tableau Public)

---

## The Project: E-Commerce Sales Analysis

**Business Question:** *"Which product categories are driving revenue, and which months show seasonal patterns we should act on?"*

**Dataset:** Simulated e-commerce orders with 1,000 transactions
**Tools:** Python, Pandas, Matplotlib, Seaborn

---

## Phase 1 — Define the Question

Before writing a single line of code, answer:

- **Who will use this analysis?** → Head of Sales
- **What decision will it inform?** → Q1 marketing budget allocation
- **What does success look like?** → 2-3 clear recommendations backed by data
- **What data do I need?** → Orders with date, product category, revenue, region

This discipline — starting with the question — is what separates analysts from people who just "run code."

---

## Phase 2 — Load and Inspect

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style='whitegrid', palette='muted')

# Load the data
df = pd.read_csv('ecommerce_orders.csv')

# Always start here
print(df.shape)           # How big is it?
print(df.dtypes)          # What types?
print(df.isnull().sum())  # Any missing values?
print(df.describe())      # Any surprising stats?
print(df.head(10))        # What does it look like?
\`\`\`

**Checklist after loading:**
- [ ] How many rows and columns?
- [ ] Are date columns parsed as dates?
- [ ] Are revenue/quantity columns numeric?
- [ ] What % of values are missing?
- [ ] Do max/min values make sense?

---

## Phase 3 — Clean the Data

\`\`\`python
# Fix types
df['order_date'] = pd.to_datetime(df['order_date'])
df['revenue']    = pd.to_numeric(df['revenue'], errors='coerce')
df['quantity']   = pd.to_numeric(df['quantity'], errors='coerce').astype('Int64')

# Remove duplicates
df.drop_duplicates(subset=['order_id'], inplace=True)

# Handle missing values
df['revenue'].fillna(df['revenue'].median(), inplace=True)
df['category'].fillna('Other', inplace=True)

# Fix string inconsistencies
df['category'] = df['category'].str.strip().str.title()
df['region']   = df['region'].str.strip().str.title()

# Extract time features
df['month']    = df['order_date'].dt.month
df['month_name'] = df['order_date'].dt.strftime('%b')
df['quarter']  = df['order_date'].dt.quarter
df['year']     = df['order_date'].dt.year

print(f"Clean dataset: {df.shape[0]} rows × {df.shape[1]} columns")
\`\`\`

---

## Phase 4 — Explore the Data (EDA)

EDA is about asking questions with data. Ask 5-10 questions and let the answers guide you.

\`\`\`python
# Q1: What are the total revenues by category?
cat_revenue = df.groupby('category')['revenue'].sum().sort_values(ascending=False)
print("Revenue by Category:")
print(cat_revenue)

# Q2: Which month has highest revenue?
monthly = df.groupby('month')['revenue'].sum()
print(f"Best month: {monthly.idxmax()} — \${monthly.max():,.0f}")

# Q3: What is the average order value by region?
print(df.groupby('region')['revenue'].mean().round(2))

# Q4: Are there seasonal patterns?
df['quarter_label'] = 'Q' + df['quarter'].astype(str)
quarterly = df.groupby('quarter_label')['revenue'].sum()
print("Quarterly revenue:")
print(quarterly)

# Q5: What is the return rate per category?
if 'is_return' in df.columns:
    return_rate = df.groupby('category')['is_return'].mean().round(3)
    print("Return rate by category:", return_rate)
\`\`\`

---

## Phase 5 — Visualise the Findings

Make charts that answer your business questions, not just "cool" charts.

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('E-Commerce Sales Analysis — FY 2024', fontsize=16, fontweight='bold')

# 1. Revenue by Category (bar)
cat_revenue.plot(kind='bar', ax=axes[0, 0], color='steelblue')
axes[0, 0].set_title('Total Revenue by Category')
axes[0, 0].set_ylabel('Revenue (USD)')
axes[0, 0].tick_params(axis='x', rotation=30)

# 2. Monthly trend (line)
monthly_plot = df.groupby('month')['revenue'].sum()
axes[0, 1].plot(monthly_plot.index, monthly_plot.values, marker='o', color='tomato', linewidth=2)
axes[0, 1].set_title('Monthly Revenue Trend')
axes[0, 1].set_xlabel('Month')
axes[0, 1].set_ylabel('Revenue (USD)')
axes[0, 1].set_xticks(range(1, 13))

# 3. Revenue by region (horizontal bar)
region_revenue = df.groupby('region')['revenue'].sum().sort_values()
region_revenue.plot(kind='barh', ax=axes[1, 0], color='mediumseagreen')
axes[1, 0].set_title('Revenue by Region')
axes[1, 0].set_xlabel('Revenue (USD)')

# 4. Category × Quarter heatmap
pivot = df.pivot_table(values='revenue', index='category',
                       columns='quarter_label', aggfunc='sum')
sns.heatmap(pivot, annot=True, fmt='.0f', cmap='YlOrRd', ax=axes[1, 1])
axes[1, 1].set_title('Revenue by Category × Quarter')

plt.tight_layout()
plt.savefig('ecommerce_analysis.png', dpi=150, bbox_inches='tight')
plt.show()
\`\`\`

---

## Phase 6 — Draw Conclusions

The final (and most important) step. Turn numbers into words.

**Template for each insight:**
> *"[What I found] because [why it matters], therefore [recommended action]."*

**Example conclusions:**
1. "Electronics accounts for 41% of total revenue and is the #1 category. Marketing should protect this segment with loyalty campaigns."
2. "Revenue spikes in November-December (holiday season). Inventory and logistics should be scaled up by October."
3. "The West region underperforms by 23% vs the East. A regional pricing review is recommended for Q1."

---

## Phase 7 — Present It

A project nobody sees is worthless. Present your work:

| Format | Audience | Tool |
|--------|----------|------|
| Jupyter Notebook | Technical peers | nbconvert / GitHub |
| One-page summary | Manager | Word / Google Docs |
| Dashboard | Stakeholders | Power BI / Tableau |
| Blog post | Public portfolio | Medium / LinkedIn |

**Structure for a 5-minute presentation:**
1. The business question (30 sec)
2. The data and cleaning steps (1 min)
3. Top 3 findings — with charts (2 min)
4. Recommendations (1 min)
5. Next steps / limitations (30 sec)

---

## Common Mistakes in First Projects

❌ **Starting with code, not a question** → Always define the question first
❌ **Cleaning without purpose** → Only clean what your analysis needs
❌ **Too many charts** → Pick the 3-4 that answer the question best
❌ **No conclusion** → Every chart needs a "so what?"
❌ **Not publishing** → Push it to GitHub or Kaggle now

---

## Project Checklist

- [ ] Business question clearly stated
- [ ] Data loaded and inspected
- [ ] Missing values and duplicates handled
- [ ] At least 5 EDA questions answered
- [ ] At least 3 charts with clear titles and labels
- [ ] 2-3 written conclusions with recommendations
- [ ] Code pushed to GitHub
- [ ] README.md with project description
`,
    codeExample: `import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style='whitegrid', palette='muted')
np.random.seed(42)

# ── Generate realistic e-commerce dataset ────────────────────────────────────
n = 1000
categories = ['Electronics', 'Clothing', 'Books', 'Food', 'Sports']
regions    = ['North', 'South', 'East', 'West']

df = pd.DataFrame({
    'order_id':    range(1001, 1001 + n),
    'order_date':  pd.date_range('2024-01-01', periods=n, freq='8h'),
    'category':    np.random.choice(categories, n, p=[0.35, 0.25, 0.15, 0.15, 0.10]),
    'region':      np.random.choice(regions, n),
    'revenue':     np.random.exponential(scale=180, size=n).round(2),
    'quantity':    np.random.randint(1, 8, n),
})

# ── PHASE 2: Inspect ──────────────────────────────────────────────────────────
print("=== PHASE 2: DATA INSPECTION ===")
print(f"Shape: {df.shape}")
print(f"Missing values: {df.isnull().sum().sum()}")
print(f"Revenue range: \${df['revenue'].min():.2f} — \${df['revenue'].max():.2f}")

# ── PHASE 3: Clean ────────────────────────────────────────────────────────────
df['month']   = df['order_date'].dt.month
df['quarter'] = 'Q' + df['order_date'].dt.quarter.astype(str)
df['month_name'] = df['order_date'].dt.strftime('%b')

# ── PHASE 4: EDA ─────────────────────────────────────────────────────────────
print("\\n=== PHASE 4: EXPLORATORY ANALYSIS ===")

# Q1: Revenue by category
cat_rev = df.groupby('category')['revenue'].agg(['sum','mean','count']).round(2)
cat_rev['share_%'] = (cat_rev['sum'] / cat_rev['sum'].sum() * 100).round(1)
cat_rev = cat_rev.sort_values('sum', ascending=False)
print("\\nRevenue by Category:")
print(cat_rev)

# Q2: Monthly trend
monthly = df.groupby('month')['revenue'].sum()
best_month  = monthly.idxmax()
worst_month = monthly.idxmin()
print(f"\\nBest month:  Month {best_month}  —  \${monthly[best_month]:,.0f}")
print(f"Worst month: Month {worst_month}  —  \${monthly[worst_month]:,.0f}")

# Q3: Quarterly breakdown
quarterly = df.groupby('quarter')['revenue'].sum().round(0)
print("\\nQuarterly Revenue:")
print(quarterly)

# Q4: Regional performance
region_rev = df.groupby('region')['revenue'].mean().round(2).sort_values(ascending=False)
print("\\nAvg Order Value by Region:")
print(region_rev)

# ── PHASE 6: Conclusions ──────────────────────────────────────────────────────
print("\\n=== PHASE 6: KEY FINDINGS ===")
top_cat   = cat_rev.index[0]
top_share = cat_rev.loc[top_cat, 'share_%']
print(f"1. {top_cat} drives {top_share}% of revenue — protect with loyalty campaigns.")
seasonal_range = monthly.max() / monthly.min()
print(f"2. Revenue varies {seasonal_range:.1f}x across months — seasonal inventory planning needed.")
best_region  = region_rev.index[0]
worst_region = region_rev.index[-1]
gap_pct = (1 - region_rev.iloc[-1] / region_rev.iloc[0]) * 100
print(f"3. {best_region} outperforms {worst_region} by {gap_pct:.0f}% — review regional strategy.")

print("\\n✅ Project complete! Ready to publish to GitHub / Kaggle.")
`,
    quizzes: [
      {
        question: 'What should you define BEFORE writing any code in a data project?',
        options: [
          'The business question the analysis will answer',
          'The chart types you plan to use',
          'The machine learning model to apply',
          'The database connection string',
        ],
        correctAnswer: 0,
        explanation: 'Starting with a clear business question ensures every step (cleaning, analysis, charts) serves a purpose and produces actionable insights.',
      },
      {
        question: 'Which step comes immediately AFTER loading the data?',
        options: [
          'Inspection — checking shape, dtypes, missing values, and basic statistics',
          'Building visualisations',
          'Running machine learning models',
          'Writing conclusions',
        ],
        correctAnswer: 0,
        explanation: 'Inspection lets you understand what you have before touching it. Cleaning without inspection risks fixing the wrong things.',
      },
      {
        question: 'The business question "Which categories drive revenue?" is better than "Analyse the data" because:',
        options: [
          'It defines a measurable outcome and guides which analyses to run',
          'It is shorter and easier to type',
          'It avoids the need for data cleaning',
          'It requires less data',
        ],
        correctAnswer: 0,
        explanation: 'A specific question focuses the analysis. "Analyse the data" leads to random charts; a question leads to evidence-backed recommendations.',
      },
      {
        question: 'In Phase 4 (EDA), what is the main purpose of groupby + agg?',
        options: [
          'To summarise data by a categorical dimension (e.g., revenue per category)',
          'To remove duplicate rows',
          'To create new columns',
          'To plot charts directly',
        ],
        correctAnswer: 0,
        explanation: '`groupby().agg()` splits data by a category and computes aggregate statistics — the core pattern for comparative analysis.',
      },
      {
        question: 'How many charts should a first data project typically include?',
        options: [
          '3-5 targeted charts that each answer a specific question',
          'As many as possible — more charts = more thorough',
          'Exactly 1 — keep it simple',
          '20+ to show all data angles',
        ],
        correctAnswer: 0,
        explanation: 'Quality beats quantity. Each chart should answer a question. Excess charts dilute the message and overwhelm the audience.',
      },
      {
        question: 'You find that revenue is 30% higher in Q4. What is the correct analytical conclusion format?',
        options: [
          '"Revenue spikes in Q4 due to holidays, so inventory should be scaled up by September"',
          '"Revenue is 30% higher in Q4"',
          '"The data shows Q4 performance"',
          '"There are seasonal patterns in the data"',
        ],
        correctAnswer: 0,
        explanation: 'A conclusion has three parts: what you found, why it matters, and the recommended action. Just stating the number is not a conclusion.',
      },
      {
        question: 'Which Python library is used to save a chart as a PNG file?',
        options: [
          '`plt.savefig("file.png")`',
          '`df.to_png("file.png")`',
          '`sns.export("file.png")`',
          '`chart.save("file.png")`',
        ],
        correctAnswer: 0,
        explanation: '`plt.savefig()` saves the current Matplotlib figure. Use `bbox_inches="tight"` to prevent label clipping.',
      },
      {
        question: 'Why should you always use `df.describe()` after loading data?',
        options: [
          'It gives count, mean, std, min, quartiles, max — revealing outliers and wrong types instantly',
          'It cleans the data automatically',
          'It creates charts for every column',
          'It removes missing values',
        ],
        correctAnswer: 0,
        explanation: '`describe()` is the fastest data health check. A maximum of 9,999,999 for age or a mean of 0 for revenue immediately flags problems.',
      },
      {
        question: 'A pivot table `df.pivot_table(values="revenue", index="category", columns="quarter", aggfunc="sum")` produces:',
        options: [
          'A matrix showing total revenue for each category-quarter combination',
          'A bar chart',
          'A filtered DataFrame',
          'The correlation between category and quarter',
        ],
        correctAnswer: 0,
        explanation: '`pivot_table` reshapes the data into a 2D summary table — perfect for heatmaps showing two dimensions simultaneously.',
      },
      {
        question: 'What is the recommended tool for publishing a data project publicly for free?',
        options: [
          'GitHub (with Jupyter notebooks) or Kaggle',
          'A private server',
          'Email attachment',
          'USB drive',
        ],
        correctAnswer: 0,
        explanation: 'GitHub hosts notebooks (.ipynb) and code publicly. Kaggle hosts notebooks with datasets. Both are free and viewed by recruiters.',
      },
      {
        question: 'The "so what?" test means:',
        options: [
          'Every chart and finding must answer "so what does this mean for the business?"',
          'You should question whether data analysis is necessary',
          'Only include surprising findings',
          'Remove any chart the audience might already know',
        ],
        correctAnswer: 0,
        explanation: 'If you can\'t explain why a chart matters to the business decision, it doesn\'t belong in the presentation.',
      },
      {
        question: 'Which of these is a valid EDA question for a sales dataset?',
        options: [
          '"What is the average order value by region, and which region underperforms?"',
          '"What is the variance of the primary key?"',
          '"How many bytes does the file occupy?"',
          '"What is the correlation of the index with itself?"',
        ],
        correctAnswer: 0,
        explanation: 'EDA questions should link data patterns to business context. Comparing regions by order value is actionable; file size is not.',
      },
      {
        question: 'When presenting to a non-technical manager, which format is MOST appropriate?',
        options: [
          'A one-page summary with 2-3 charts and bullet-point recommendations',
          'A 200-line Jupyter notebook with raw code',
          'A terminal output of print statements',
          'A full academic paper with statistical p-values',
        ],
        correctAnswer: 0,
        explanation: 'Non-technical stakeholders need conclusions, not methods. One page with visuals and action points communicates faster than notebooks.',
      },
      {
        question: 'You forgot to add axis labels to all your charts. Why does this matter?',
        options: [
          'Without labels, the audience cannot tell what the numbers represent',
          'Matplotlib will throw an error',
          'Charts without labels run slower',
          'It only matters for academic papers',
        ],
        correctAnswer: 0,
        explanation: 'A chart without axis labels forces the reader to guess. Labels and titles are not optional — they\'re part of communicating clearly.',
      },
      {
        question: 'A README.md file in a GitHub project should contain:',
        options: [
          'Project description, business question, tools used, and how to run the analysis',
          'Only the Python code',
          'Raw CSV data',
          'Your personal contact information only',
        ],
        correctAnswer: 0,
        explanation: 'A good README tells a visitor what the project is about, what question it answers, and how to reproduce the analysis. It\'s the project\'s front page.',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 14 — BUILDING YOUR DATA ANALYST PORTFOLIO
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-14-portfolio-building',
    title:       'Building Your Data Analyst Portfolio',
    description: 'A strong portfolio is your ticket to your first data job. Learn what to include, how to present projects professionally, and how to get your work in front of employers.',
    orderIndex:  14,
    xpReward:    80,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    content: `# Building Your Data Analyst Portfolio

> **"Your portfolio is your resume, your interview, and your proof — all in one."** — Employers hire people who have done the work, not people who say they can do it.

---

## Why a Portfolio Matters More Than a Degree

- Most entry-level data analyst roles receive 200+ applications
- A portfolio with 3 good projects immediately separates you from candidates who only have coursework
- Projects prove you can apply skills, not just describe them

**The goal:** when a recruiter googles your name, they find real data work.

---

## What Goes in a Portfolio?

You need **3-5 projects** covering different skills and domains.

### Project Variety Matrix

| Project | Skills | Domain | Tool |
|---------|--------|--------|------|
| Sales Analysis | EDA, groupby, charts | Business | Python + Matplotlib |
| SQL Query Showcase | Joins, aggregations, CTEs | Database | SQL + PostgreSQL |
| Dashboard | KPIs, filters, drill-down | Business Intelligence | Power BI / Tableau |
| Cleaned Dataset | Data cleaning pipeline | Data Quality | Python + Pandas |
| Predictive Analysis | Correlation, trend, forecast | Analytics | Python + Seaborn |

---

## Where to Host Your Portfolio

### 1. GitHub
The industry standard. Every data analyst should have a GitHub profile.

Structure for each project:
\`\`\`
my-sales-analysis/
├── README.md          ← Project description, findings, next steps
├── data/
│   ├── raw/           ← Original data (if small enough)
│   └── clean/         ← Processed data
├── notebooks/
│   └── analysis.ipynb ← Jupyter notebook with all analysis
├── charts/
│   └── *.png          ← Exported visualisations
└── requirements.txt   ← Python package dependencies
\`\`\`

### 2. Kaggle
- Host datasets and notebooks
- Fork and improve public datasets
- Earn medals and a public profile score
- Free GPU for ML notebooks

### 3. Tableau Public
- Publish interactive dashboards for free
- Visible to the entire Tableau community
- Link from LinkedIn and GitHub

### 4. Personal Website (Optional)
- GitHub Pages (free) or Notion portfolio
- Embed Tableau dashboards, link to GitHub notebooks
- Show you can communicate, not just code

---

## Writing a Great README

A README is the first thing recruiters read. Make it count.

\`\`\`markdown
# 🛒 E-Commerce Sales Analysis — FY 2024

## Business Question
Which product categories drive the most revenue, and are there seasonal
patterns we should act on?

## Key Findings
1. **Electronics** accounts for 41% of revenue — the #1 priority for protection.
2. Revenue is **2.3× higher** in November-December vs January-February.
3. The **West region** underperforms by 23% — needs regional investigation.

## Tools Used
- Python · Pandas · Matplotlib · Seaborn
- Data: 1,000 e-commerce orders (simulated)

## How to Run
\\\`\\\`\\\`bash
pip install -r requirements.txt
jupyter notebook notebooks/analysis.ipynb
\\\`\\\`\\\`

## Dashboard Preview
![Sales Dashboard](charts/dashboard.png)
\`\`\`

---

## Choosing Good Dataset Sources

| Source | Type | Quality | Free? |
|--------|------|---------|-------|
| Kaggle Datasets | CSV, databases | ⭐⭐⭐⭐ | ✅ |
| UCI ML Repository | CSV | ⭐⭐⭐ | ✅ |
| Google Dataset Search | Various | ⭐⭐⭐ | ✅ |
| data.world | CSV, SQL | ⭐⭐⭐⭐ | ✅ |
| Government portals | CSV, JSON | ⭐⭐⭐⭐ | ✅ |
| The Movies Dataset (Kaggle) | CSV | ⭐⭐⭐⭐⭐ | ✅ |
| Superstore Sales (Kaggle) | CSV | ⭐⭐⭐⭐⭐ | ✅ |
| Airbnb Listings (Inside Airbnb) | CSV | ⭐⭐⭐⭐⭐ | ✅ |

**Rule:** pick datasets related to industries you want to work in.

---

## Making Projects Stand Out

### Tell a Story
Bad: "I analysed the sales data and found some trends."
Good: "I discovered that 12% of customers generate 68% of revenue — a clear Pareto effect that marketing can use to prioritise loyalty programmes."

### Show Your Process
Include comments in your notebook explaining *why* you did each step, not just *what* you did.

### Include a "Limitations & Next Steps" Section
This shows maturity. Acknowledge what the data can't tell you and what additional analysis would improve the conclusions.

### Clean, Consistent Code
\`\`\`python
# ✅ Good — clear variable names, comments, logical flow
monthly_revenue = df.groupby('month')['revenue'].sum()
peak_month      = monthly_revenue.idxmax()
print(f"Peak month: {peak_month} with \${monthly_revenue[peak_month]:,.0f}")

# ❌ Bad — cryptic, no comments
x = df.groupby('a')['b'].sum()
print(x.idxmax(), x.max())
\`\`\`

---

## LinkedIn Profile for Data Analysts

Your LinkedIn is your online resume + portfolio link.

**Must-haves:**
- Professional headline: "Aspiring Data Analyst | Python · SQL · Power BI"
- About section: 2-3 sentences on what you offer
- Featured section: link to GitHub / Kaggle / Tableau Public
- Skills: Python, SQL, Pandas, Power BI, Tableau, Excel, Data Visualisation
- Projects section: list each portfolio project with a brief description

---

## Portfolio Building Timeline

| Week | Task |
|------|------|
| 1 | Set up GitHub, create profile README |
| 2-3 | Project 1 — Sales / EDA analysis (Python) |
| 4-5 | Project 2 — SQL showcase (5-10 complex queries) |
| 6-7 | Project 3 — Power BI or Tableau dashboard |
| 8 | Polish README files, update LinkedIn |
| 9+ | Project 4 — domain you want to work in |

---

## The 80/20 Rule of Portfolios

80% of your portfolio value comes from:
1. Having **real projects** (not just certificates)
2. A **clear README** that explains the business context
3. **Clean, commented code** that shows you can collaborate
4. **Published work** that recruiters can actually see

The other 20% (perfect colour schemes, fancy animations) are nice-to-have.
`,
    codeExample: `import os

# ─────────────────────────────────────────────────────────────────────────────
# Portfolio project structure generator
# Run this to scaffold a new data analysis project
# ─────────────────────────────────────────────────────────────────────────────

def create_project_structure(project_name: str, description: str) -> None:
    """Create a professional data analysis project scaffold."""

    dirs = [
        f"{project_name}/data/raw",
        f"{project_name}/data/clean",
        f"{project_name}/notebooks",
        f"{project_name}/charts",
        f"{project_name}/scripts",
    ]

    for d in dirs:
        os.makedirs(d, exist_ok=True)

    # requirements.txt
    requirements = """pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn>=0.12.0
jupyter>=1.0.0
openpyxl>=3.1.0
"""
    with open(f"{project_name}/requirements.txt", 'w') as f:
        f.write(requirements)

    # README.md template
    readme = f"""# {project_name.replace('-', ' ').title()}

## Business Question
{description}

## Key Findings
1. Finding 1 — [add after analysis]
2. Finding 2 — [add after analysis]
3. Finding 3 — [add after analysis]

## Tools Used
- Python · Pandas · Matplotlib · Seaborn

## Data
- Source: [Kaggle / data.gov / UCI]
- Size: [rows × columns]
- Time period: [date range]

## How to Run
\`\`\`bash
pip install -r requirements.txt
jupyter notebook notebooks/analysis.ipynb
\`\`\`

## Limitations & Next Steps
- Limitation: [e.g., dataset is from 2023 — results may not reflect current trends]
- Next step: [e.g., add ML forecasting for Q4 projections]
"""
    with open(f"{project_name}/README.md", 'w') as f:
        f.write(readme)

    # Notebook template
    notebook_template = """{
 "cells": [
  {"cell_type": "markdown", "source": ["# Analysis Notebook\\n", "## 1. Load & Inspect"]},
  {"cell_type": "code", "source": ["import pandas as pd\\nimport numpy as np\\nimport matplotlib.pyplot as plt\\nimport seaborn as sns\\n\\nsns.set_theme(style='whitegrid')\\n\\n# Load data\\ndf = pd.read_csv('../data/raw/dataset.csv')\\nprint(df.shape)\\nprint(df.dtypes)\\nprint(df.isnull().sum())\\ndf.head()"], "outputs": [], "execution_count": null}
 ],
 "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}},
 "nbformat": 4,
 "nbformat_minor": 5
}"""
    with open(f"{project_name}/notebooks/analysis.ipynb", 'w') as f:
        f.write(notebook_template)

    print(f"✅ Project scaffold created: {project_name}/")
    print(f"   Files created:")
    for d in dirs:
        print(f"   📁 {d}/")
    print(f"   📄 {project_name}/README.md")
    print(f"   📄 {project_name}/requirements.txt")
    print(f"   📓 {project_name}/notebooks/analysis.ipynb")
    print()
    print("Next steps:")
    print("  1. Add your dataset to data/raw/")
    print("  2. Open notebooks/analysis.ipynb")
    print("  3. Follow: Load → Inspect → Clean → EDA → Visualise → Conclude")
    print("  4. Push to GitHub when complete")


# Example usage
project = "ecommerce-sales-analysis"
question = "Which product categories drive revenue and are there seasonal patterns?"

create_project_structure(project, question)

# ── Portfolio checklist ───────────────────────────────────────────────────────
print("\\n=== PORTFOLIO CHECKLIST ===")
checklist = [
    ("GitHub profile with bio and photo",        True),
    ("Project 1: EDA with Python",               True),
    ("Project 2: SQL showcase",                  False),
    ("Project 3: Power BI / Tableau dashboard",  False),
    ("LinkedIn updated with portfolio links",     False),
    ("Each project has a clear README",          True),
]
completed = sum(1 for _, done in checklist if done)
print(f"Progress: {completed}/{len(checklist)} items complete\\n")
for item, done in checklist:
    status = "✅" if done else "⬜"
    print(f"  {status} {item}")
`,
    quizzes: [
      {
        question: 'How many projects should a data analyst portfolio ideally contain?',
        options: [
          '3-5 projects covering different skills and domains',
          'Exactly 1 perfect project',
          '10+ projects to show maximum effort',
          'No projects — certificates are enough',
        ],
        correctAnswer: 0,
        explanation: '3-5 diverse projects show breadth and depth. More than 5 can be overwhelming; fewer than 3 doesn\'t demonstrate versatility.',
      },
      {
        question: 'What is the PRIMARY purpose of a README.md file in a GitHub project?',
        options: [
          'To explain the business question, key findings, tools, and how to run the code',
          'To store the raw dataset',
          'To document every line of code',
          'To list all Python libraries installed on your computer',
        ],
        correctAnswer: 0,
        explanation: 'The README is the first thing recruiters read. It should explain what the project does, what was found, and how to reproduce it — in plain English.',
      },
      {
        question: 'Which platform is the industry standard for hosting data analyst portfolio code?',
        options: ['GitHub', 'Instagram', 'Dropbox', 'WhatsApp'],
        correctAnswer: 0,
        explanation: 'GitHub is where the data community lives. Employers expect to see a GitHub profile with real project code.',
      },
      {
        question: 'A "Limitations & Next Steps" section in a project shows:',
        options: [
          'Analytical maturity — you understand what the data can and cannot tell you',
          'That the project is incomplete',
          'Weakness in your analysis',
          'That you ran out of time',
        ],
        correctAnswer: 0,
        explanation: 'Every analysis has limits. Acknowledging them (e.g., "data covers only 2023") shows critical thinking and honesty — qualities employers value.',
      },
      {
        question: 'Which of these is the BEST project description for a portfolio?',
        options: [
          '"Analysed 50K Airbnb listings to identify price drivers and found that location adds 34% more than all amenities combined"',
          '"I cleaned some Airbnb data and made charts"',
          '"Data analysis project using Python"',
          '"Applied various statistical methods to a publicly available dataset"',
        ],
        correctAnswer: 0,
        explanation: 'A good description leads with the outcome (specific finding), not the process. Numbers and context make it compelling.',
      },
      {
        question: 'Kaggle is useful for portfolio building because:',
        options: [
          'It hosts notebooks and datasets publicly, provides free compute, and has a community ranking system',
          'It stores code in private repositories',
          'It only works for machine learning projects',
          'It requires a paid subscription to share work',
        ],
        correctAnswer: 0,
        explanation: 'Kaggle Notebooks are public by default, datasets are free to use, and a Kaggle profile with medals is directly relevant to data roles.',
      },
      {
        question: 'What should the LinkedIn "About" section of an aspiring data analyst say?',
        options: [
          'A 2-3 sentence summary: skills you offer, industries you\'re interested in, and a link to your portfolio',
          'A full life story starting from school',
          'A list of every tool you\'ve ever heard of',
          'Nothing — LinkedIn is not relevant for tech roles',
        ],
        correctAnswer: 0,
        explanation: 'Recruiters spend ~7 seconds on the About section. Lead with value: what you do, what you know, and where to see your work.',
      },
      {
        question: 'Which tells a better story in a portfolio project?',
        options: [
          '"12% of customers generate 68% of revenue — a Pareto effect suggesting a loyalty programme would have outsized ROI"',
          '"I calculated the percentage of revenue from each customer segment"',
          '"I used groupby to group by customer and then summed revenue"',
          '"Results were found using statistical aggregation methods"',
        ],
        correctAnswer: 0,
        explanation: 'Business-oriented conclusions are more impressive than process descriptions. Always connect numbers to decisions.',
      },
      {
        question: 'The best portfolio datasets are:',
        options: [
          'Related to industries you want to work in (e.g., healthcare, fintech, retail)',
          'The largest possible datasets regardless of domain',
          'Only toy datasets from textbooks',
          'Datasets from your current employer',
        ],
        correctAnswer: 0,
        explanation: 'Domain-relevant projects demonstrate that you understand the business context, not just the technical tools.',
      },
      {
        question: 'What does `requirements.txt` in a Python project contain?',
        options: [
          'The list of Python packages and versions needed to run the project',
          'A list of business requirements',
          'The README content',
          'Raw data specifications',
        ],
        correctAnswer: 0,
        explanation: '`requirements.txt` enables others to install the exact same packages with `pip install -r requirements.txt`, making your project reproducible.',
      },
      {
        question: 'Which is an example of a poorly named variable in code?',
        options: [
          '`x` for a column containing customer revenue',
          '`monthly_revenue` for monthly revenue totals',
          '`customer_count` for number of customers',
          '`top_category` for the highest-revenue category',
        ],
        correctAnswer: 0,
        explanation: 'Single-letter variables like `x` are unreadable without context. Portfolio code will be read by others — names should be self-explanatory.',
      },
      {
        question: 'What is the recommended LinkedIn headline for an aspiring data analyst?',
        options: [
          '"Aspiring Data Analyst | Python · SQL · Power BI"',
          '"Student"',
          '"Looking for opportunities"',
          '"Data Science Enthusiast & Machine Learning Expert"',
        ],
        correctAnswer: 0,
        explanation: 'The headline should state your target role and key skills recruiters search for. Vague titles like "Student" don\'t appear in analyst searches.',
      },
      {
        question: 'What are the 80% of portfolio activities that create the most value?',
        options: [
          'Real projects, clear README, commented code, and published work',
          'A perfectly designed personal website with animations',
          'Certificates from every available online course',
          'Academic papers and research publications',
        ],
        correctAnswer: 0,
        explanation: 'Employers hire for skills, not aesthetics. Real projects with clear communication and public visibility beat fancy design every time.',
      },
      {
        question: 'How many complex SQL queries should a "SQL Showcase" portfolio project contain?',
        options: [
          '5-10 queries using joins, aggregations, window functions, and CTEs',
          'Just 1 SELECT query',
          '50+ queries covering every SQL keyword',
          'No queries — use Python instead',
        ],
        correctAnswer: 0,
        explanation: '5-10 varied queries showcasing different SQL concepts (JOINs, GROUP BY, CTEs, window functions) proves SQL competency without being redundant.',
      },
      {
        question: 'The best time to publish a portfolio project to GitHub is:',
        options: [
          'As soon as it\'s presentable — done is better than perfect',
          'Only after it\'s 100% perfect with no errors',
          'After you get a job',
          'Only if you have 5 years of experience',
        ],
        correctAnswer: 0,
        explanation: 'Waiting for perfection means never publishing. A good-enough project that\'s live beats a perfect project that\'s still "in progress" forever.',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 15 — BUSINESS THINKING FOR DATA ANALYSTS
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-15-business-thinking',
    title:       'Business Thinking for Data Analysts',
    description: 'Technical skills get you hired. Business thinking gets you promoted. Learn how to frame analyses as business decisions, communicate with stakeholders, and become indispensable.',
    orderIndex:  15,
    xpReward:    80,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    content: `# Business Thinking for Data Analysts

> **"A data analyst who thinks like a business person is 10× more valuable than one who only thinks like a programmer."**

---

## The Technical-Business Gap

Most analysts can:
- Write SQL queries
- Clean DataFrames
- Build charts

Fewer can:
- Explain what a chart means for the next quarter's strategy
- Prioritise which analysis to do first based on business impact
- Present a finding that leads to a $100,000 decision

That gap is the difference between a junior analyst and a senior one.

---

## 1. Always Ask "So What?"

The "So What?" filter: after every finding, ask what action the business should take.

| Finding | ❌ Weak | ✅ Strong |
|---------|---------|---------|
| Churn rate increased 5% | "Churn went up" | "5% more customers left last month — at $80 avg revenue, that's $160K annualised loss. Immediate retention campaign needed." |
| Electronics is #1 category | "Electronics sells most" | "Electronics is 41% of revenue but only 22% of orders — high-value segment at risk if we cut marketing there." |
| Q4 spike in sales | "Sales are higher in Q4" | "Q4 revenue is 2.3× Q1. Inventory should scale by October to avoid stockouts in peak season." |

---

## 2. Metrics That Matter to Business

Learn these KPIs (Key Performance Indicators) by heart:

### Revenue Metrics
- **MRR** — Monthly Recurring Revenue
- **ARR** — Annual Recurring Revenue
- **ARPU** — Average Revenue Per User
- **AOV** — Average Order Value

### Customer Metrics
- **CAC** — Customer Acquisition Cost
- **LTV** (or CLV) — Customer Lifetime Value
- **Churn Rate** — % customers who stop buying
- **Retention Rate** — % customers who return

### Operational Metrics
- **Conversion Rate** — % visitors who buy
- **NPS** — Net Promoter Score (customer satisfaction)
- **Gross Margin** — revenue minus cost of goods

\`\`\`python
import pandas as pd
import numpy as np

# ── Calculating key business metrics ────────────────────────────────────────
df = pd.DataFrame({
    'customer_id':  range(1, 101),
    'orders_count': np.random.randint(1, 10, 100),
    'total_spent':  np.random.exponential(500, 100).round(2),
    'churned':      np.random.choice([True, False], 100, p=[0.15, 0.85]),
    'months_active':np.random.randint(1, 25, 100),
})

# AOV — Average Order Value
aov = df['total_spent'].sum() / df['orders_count'].sum()
print(f"AOV:            \${aov:.2f}")

# Churn Rate
churn_rate = df['churned'].mean() * 100
print(f"Churn Rate:     {churn_rate:.1f}%")

# Retention Rate
retention_rate = 100 - churn_rate
print(f"Retention Rate: {retention_rate:.1f}%")

# LTV — simple average method
ltv = df['total_spent'].mean()
print(f"Avg LTV:        \${ltv:.2f}")

# Revenue at risk from churned customers
churned_revenue = df[df['churned']]['total_spent'].sum()
print(f"Revenue at risk: \${churned_revenue:,.2f}")
\`\`\`

---

## 3. The MECE Framework (Mutually Exclusive, Collectively Exhaustive)

Used by consultants to structure analysis:
- **Mutually exclusive:** categories don't overlap
- **Collectively exhaustive:** categories cover everything

\`\`\`python
# ❌ Not MECE — overlapping
segments_bad = ['Small orders', 'Large orders', 'High-value customers']
# "High-value customers" overlaps with "Large orders"

# ✅ MECE — clean segments
df['segment'] = pd.cut(df['total_spent'],
    bins=[0, 200, 500, 1000, float('inf')],
    labels=['Bronze (<$200)', 'Silver ($200-500)', 'Gold ($500-1K)', 'Platinum ($1K+)'])

print(df.groupby('segment')['total_spent'].agg(['count', 'sum', 'mean']).round(2))
\`\`\`

---

## 4. Prioritise by Business Impact

Not all analyses are equal. Use a 2×2 impact/effort matrix.

\`\`\`python
analyses = pd.DataFrame({
    'analysis':    ['Churn prediction',
                    'Sales report formatting',
                    'Customer segmentation',
                    'Fix typo in report'],
    'impact':      [9, 2, 8, 1],   # 1-10 scale
    'effort':      [7, 1, 4, 1],   # 1-10 scale
})

# Priority score — high impact, low effort wins
analyses['priority'] = analyses['impact'] / analyses['effort']
analyses = analyses.sort_values('priority', ascending=False)

print("Prioritised Analysis Backlog:")
print(analyses[['analysis', 'impact', 'effort', 'priority']].round(1).to_string(index=False))
\`\`\`

Quadrant guide:
- **High impact, low effort** → Do first (quick wins)
- **High impact, high effort** → Plan carefully
- **Low impact, low effort** → Do if time permits
- **Low impact, high effort** → Don't do

---

## 5. Communicating with Stakeholders

### The Pyramid Principle
Lead with the conclusion, then support it with data.

❌ **Bad structure (bottom-up):**
"We collected data from Q1-Q4. We cleaned it. We ran aggregations. We found that revenue grew. The West region underperformed. Therefore we recommend..."

✅ **Good structure (top-down, Pyramid):**
"**Recommendation: Double Q1 marketing budget in the East region.** [Conclusion first]
Here's why: East is the fastest-growing region (+24% YoY) with the highest AOV ($220 vs $160 avg). Our model shows $1 of ad spend returns $4.20 in East vs $2.10 nationally. [Supporting evidence]"

### Know Your Audience

| Audience | What they want | Format |
|----------|---------------|--------|
| CEO | Bottom line, risk, opportunity | One-slide summary |
| Head of Sales | Performance by region/team | Dashboard |
| Marketing | Campaign effectiveness | Chart + bullet points |
| Engineering | Technical specs | Detailed documentation |
| Finance | Revenue, costs, margins | Numbers + variance |

---

## 6. A/B Testing Basics

An A/B test compares two versions of something (email subject line, web page layout) to see which performs better.

\`\`\`python
import numpy as np

np.random.seed(42)

# Simulate an email campaign A/B test
n = 1000
group_a = np.random.binomial(1, 0.12, n)  # 12% open rate
group_b = np.random.binomial(1, 0.15, n)  # 15% open rate

open_rate_a = group_a.mean() * 100
open_rate_b = group_b.mean() * 100
lift = (open_rate_b - open_rate_a) / open_rate_a * 100

print(f"Group A open rate: {open_rate_a:.1f}%")
print(f"Group B open rate: {open_rate_b:.1f}%")
print(f"Lift:              +{lift:.1f}%")
print(f"B is {'better' if open_rate_b > open_rate_a else 'worse'} than A")

# Business impact: if 50,000 emails are sent weekly
weekly_emails = 50000
extra_opens = int(weekly_emails * (open_rate_b - open_rate_a) / 100)
print(f"\\nUsing B: {extra_opens:,} more opens per week")
\`\`\`

---

## 7. From Data to Decisions — The Loop

\`\`\`
 Question → Data → Analysis → Insight → Decision → Action → Measure → New Question
     ↑_______________________________________________________________|
\`\`\`

Every analysis feeds back into the business. A good analyst doesn't just answer questions — they generate the *next* question.

---

## Business Thinking Habits

1. **Read the business news** — know what your company's competitors are doing
2. **Ask "why" three times** — "Revenue dropped" → why? → "Churn increased" → why? → "Product bug in November" → *now* you have an actionable cause
3. **Quantify everything** — "sales went up" vs "sales grew 23% MoM, adding $45K"
4. **Know your domain** — a healthcare analyst who knows clinical workflows is 10× more effective than one who doesn't
5. **Speak in business terms** — "AOV" not "the average of the revenue column"
`,
    codeExample: `import pandas as pd
import numpy as np

np.random.seed(42)

# ── Simulated customer dataset ────────────────────────────────────────────────
n = 500
df = pd.DataFrame({
    'customer_id':   range(1, n + 1),
    'total_revenue': np.random.exponential(400, n).round(2),
    'orders':        np.random.randint(1, 15, n),
    'months_active': np.random.randint(1, 36, n),
    'churned':       np.random.choice([True, False], n, p=[0.18, 0.82]),
    'region':        np.random.choice(['North','South','East','West'], n),
    'channel':       np.random.choice(['Email','Social','Search','Direct'], n),
})

# ── 1. Core Business KPIs ─────────────────────────────────────────────────────
total_rev     = df['total_revenue'].sum()
aov           = df['total_revenue'].sum() / df['orders'].sum()
churn_rate    = df['churned'].mean() * 100
retention     = 100 - churn_rate
avg_ltv       = df['total_revenue'].mean()
revenue_at_risk = df[df['churned']]['total_revenue'].sum()

print("=== BUSINESS KPIs ===")
print(f"Total Revenue:     \${total_rev:>12,.2f}")
print(f"Avg Order Value:   \${aov:>12,.2f}")
print(f"Churn Rate:        {churn_rate:>11.1f}%")
print(f"Retention Rate:    {retention:>11.1f}%")
print(f"Avg Lifetime Value:\${avg_ltv:>12,.2f}")
print(f"Revenue at Risk:   \${revenue_at_risk:>12,.2f}")

# ── 2. Customer Segmentation (MECE) ───────────────────────────────────────────
df['segment'] = pd.cut(df['total_revenue'],
    bins=[0, 150, 400, 800, float('inf')],
    labels=['Bronze', 'Silver', 'Gold', 'Platinum'])

print("\\n=== CUSTOMER SEGMENTS ===")
seg = df.groupby('segment').agg(
    customers=('customer_id','count'),
    total_rev=('total_revenue','sum'),
    avg_ltv=('total_revenue','mean'),
    churn_pct=('churned', lambda x: x.mean() * 100)
).round(1)
seg['rev_share_%'] = (seg['total_rev'] / seg['total_rev'].sum() * 100).round(1)
print(seg)

# ── 3. Acquisition Channel ROI ────────────────────────────────────────────────
print("\\n=== CHANNEL PERFORMANCE ===")
channel = df.groupby('channel').agg(
    customers=('customer_id','count'),
    avg_ltv=('total_revenue','mean'),
    churn_rate=('churned', lambda x: f"{x.mean()*100:.0f}%")
).round(2).sort_values('avg_ltv', ascending=False)
print(channel)

# ── 4. A/B Test simulation ────────────────────────────────────────────────────
print("\\n=== A/B TEST: EMAIL SUBJECT LINE ===")
group_a = np.random.binomial(1, 0.11, 2000).mean() * 100
group_b = np.random.binomial(1, 0.14, 2000).mean() * 100
lift = (group_b - group_a) / group_a * 100
winner = "B" if group_b > group_a else "A"
weekly_gain = int(50000 * abs(group_b - group_a) / 100)
print(f"  Group A open rate: {group_a:.1f}%")
print(f"  Group B open rate: {group_b:.1f}%")
print(f"  Lift: {lift:+.1f}%  →  Winner: Group {winner}")
print(f"  Business impact: +{weekly_gain:,} extra opens per 50K send")

# ── 5. So-What conclusion generator ──────────────────────────────────────────
print("\\n=== SO-WHAT CONCLUSIONS ===")
top_seg = seg['total_rev'].idxmax()
top_seg_share = seg.loc[top_seg, 'rev_share_%']
print(f"1. {top_seg} customers drive {top_seg_share}% of revenue — prioritise their retention.")
print(f"2. {revenue_at_risk:,.0f} USD in lifetime value is at risk from churned customers.")
top_channel = channel['avg_ltv'].idxmax()
print(f"3. {top_channel} channel has highest LTV — increase budget allocation there.")
`,
    quizzes: [
      {
        question: 'The "So What?" test in data analysis means:',
        options: [
          'Every finding must be tied to a business decision or action',
          'You should question whether analysis was needed at all',
          'Only surprising findings are worth reporting',
          'You should ask management if they like your charts',
        ],
        correctAnswer: 0,
        explanation: 'A finding without a "so what" is just a number. The analyst\'s job is to connect data to decisions: what should the business DO differently?',
      },
      {
        question: 'What does "CLV" (or LTV) stand for?',
        options: [
          'Customer Lifetime Value — the total revenue expected from a customer',
          'Cumulative Log Value',
          'Channel Lead Volume',
          'Cost Loss Variance',
        ],
        correctAnswer: 0,
        explanation: 'CLV/LTV is the total revenue a business expects from a customer over the entire relationship. It determines how much to spend acquiring them (CAC).',
      },
      {
        question: 'The MECE framework requires categories to be:',
        options: [
          'Mutually exclusive (no overlap) and collectively exhaustive (covering everything)',
          'Mapped, Explained, Correlated, and Evaluated',
          'Measured, Extracted, Cleaned, and Exported',
          'Maximum, Equal, Centred, and Expected',
        ],
        correctAnswer: 0,
        explanation: 'MECE ensures your segmentation is clean: each data point falls in exactly one category, and all data points are accounted for.',
      },
      {
        question: 'In the impact/effort prioritisation matrix, what should you do FIRST?',
        options: [
          'High-impact, low-effort analyses (quick wins)',
          'High-impact, high-effort analyses',
          'Low-impact, low-effort analyses',
          'Whatever the CEO asks for regardless of impact',
        ],
        correctAnswer: 0,
        explanation: 'Quick wins (high impact × low effort) deliver maximum value fastest. They also build credibility with stakeholders.',
      },
      {
        question: 'The Pyramid Principle says presentations should:',
        options: [
          'Lead with the conclusion, then support it with evidence',
          'Start with raw data, then build to a conclusion',
          'Always use 3 bullet points per slide',
          'Avoid conclusions and let the audience decide',
        ],
        correctAnswer: 0,
        explanation: 'Busy executives want the bottom line first. Lead with the recommendation, then justify it with supporting analysis. This is the consultant\'s standard.',
      },
      {
        question: 'Churn rate of 15% means:',
        options: [
          '15% of customers stopped purchasing in the measured period',
          'Revenue grew by 15%',
          '15% of orders were returned',
          'Customer satisfaction is 15 out of 100',
        ],
        correctAnswer: 0,
        explanation: 'Churn rate = (customers lost / customers at start of period) × 100. A high churn rate directly erodes MRR and LTV.',
      },
      {
        question: 'In an A/B test, "lift" refers to:',
        options: [
          'The percentage improvement of version B over version A',
          'The number of additional users in the test',
          'The cost of running the experiment',
          'The time taken for the test to complete',
        ],
        correctAnswer: 0,
        explanation: 'Lift = (B_rate - A_rate) / A_rate × 100. It measures how much better (or worse) the new version performs relative to the control.',
      },
      {
        question: 'A CEO wants to understand revenue performance. Which format is MOST appropriate?',
        options: [
          'A one-slide summary with top 3 findings and a recommendation',
          'A 50-page Jupyter notebook with all the code',
          'A terminal output of print statements',
          'A raw CSV file with all transactions',
        ],
        correctAnswer: 0,
        explanation: 'CEOs need the bottom line, quickly. One slide with key metrics and a clear recommendation respects their time and communication style.',
      },
      {
        question: 'What does AOV stand for and why does it matter?',
        options: [
          'Average Order Value — measures revenue per transaction, guides pricing and upsell strategy',
          'Annual Operational Volume — total shipments per year',
          'Automated Order Verification — a fraud detection metric',
          'Average Outbound Volume — email campaign size',
        ],
        correctAnswer: 0,
        explanation: 'AOV = total revenue / number of orders. Increasing AOV by 10% (through upsells or bundles) directly improves revenue without needing more customers.',
      },
      {
        question: 'Asking "why" three times (the 5-Whys technique) helps analysts to:',
        options: [
          'Find the root cause, not just the symptom',
          'Prove that the data is incorrect',
          'Justify using more complex models',
          'Reduce the dataset size',
        ],
        correctAnswer: 0,
        explanation: '"Revenue dropped" → "Churn increased" → "Key product had a bug" → "Testing process failed." Finding root causes enables real fixes, not band-aids.',
      },
      {
        question: '`pd.cut(df["col"], bins=[0, 200, 500, float("inf")], labels=["Bronze","Silver","Gold"])` does what?',
        options: [
          'Segments customers into Bronze, Silver, Gold based on their value in col',
          'Sorts the DataFrame by col',
          'Removes values outside [0, 500]',
          'Counts values in each range',
        ],
        correctAnswer: 0,
        explanation: '`pd.cut()` creates categorical bins from a continuous variable — perfect for MECE customer segmentation.',
      },
      {
        question: 'Why should you "quantify everything" in business communication?',
        options: [
          'Numbers are precise and enable comparisons; vague statements like "sales went up" are unactionable',
          'To impress stakeholders with complex-looking numbers',
          'Because qualitative insights have no value',
          'To make reports longer',
        ],
        correctAnswer: 0,
        explanation: '"Sales grew 23% MoM, adding $45K" is actionable. "Sales went up" is not. Quantification makes findings concrete and decisions measurable.',
      },
      {
        question: 'The data-to-decisions loop is: Question → Data → Analysis → Insight → Decision → Action → Measure → ___',
        options: [
          'New Question — the cycle repeats as actions generate new data',
          'Report — you stop and document findings',
          'Presentation — you present to stakeholders',
          'Archive — you store the data for future use',
        ],
        correctAnswer: 0,
        explanation: 'Every action creates new data that leads to new questions. Good analysts understand they\'re part of a continuous feedback loop, not a one-time deliverable.',
      },
      {
        question: 'A Marketing manager wants to know if an email campaign worked. They need:',
        options: [
          'Open rate, click rate, conversion rate, and revenue attributed to the campaign',
          'The SQL query used to pull the data',
          'A histogram of email send times',
          'The Python code for the analysis',
        ],
        correctAnswer: 0,
        explanation: 'Marketing cares about campaign effectiveness metrics, not technical implementation. Tailor outputs to what the audience can act on.',
      },
      {
        question: 'Revenue at risk from churned customers is best calculated as:',
        options: [
          'Sum of historical revenue from customers who have churned',
          'Number of churned customers × average product price',
          'Churn rate × total revenue',
          'Number of churned customers only',
        ],
        correctAnswer: 0,
        explanation: 'Summing the actual LTV of churned customers gives the most accurate picture of lost value and motivates retention investment.',
      },
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 16 — INTERVIEW PREP
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-16-interview-prep',
    title:       'Interview Prep — Cracking the Noob Barrier',
    description: 'Prepare for your first data analyst interviews: common SQL, Python, and statistics questions, take-home challenge tips, and how to talk about your portfolio projects confidently.',
    orderIndex:  16,
    xpReward:    90,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    content: `# Interview Prep — Cracking the Noob Barrier

> **"The interview is not just a test — it's a conversation. Show how you think, not just what you know."**

---

## What Data Analyst Interviews Look Like

Most entry-level interviews have 3-4 rounds:

| Round | Focus | Duration |
|-------|-------|----------|
| 1. Recruiter screen | Background, motivation, tools | 30 min |
| 2. Technical screen | SQL / Python / stats questions | 60 min |
| 3. Take-home challenge | Mini data project | 2-4 hours |
| 4. Final interview | Present take-home, culture fit | 60-90 min |

---

## Most Commonly Asked SQL Questions

### 1. Find the second highest salary

\`\`\`sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
\`\`\`

### 2. Find customers who placed orders in January AND February

\`\`\`sql
SELECT customer_id
FROM orders
WHERE MONTH(order_date) = 1
INTERSECT
SELECT customer_id
FROM orders
WHERE MONTH(order_date) = 2;
\`\`\`

### 3. Rolling 7-day average (window function)

\`\`\`sql
SELECT
    order_date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7day_avg
FROM daily_sales
ORDER BY order_date;
\`\`\`

### 4. Rank products by revenue within each category

\`\`\`sql
SELECT
    category,
    product_name,
    revenue,
    RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS rank_in_category
FROM products
ORDER BY category, rank_in_category;
\`\`\`

### 5. Find duplicate rows

\`\`\`sql
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
\`\`\`

---

## Most Commonly Asked Python / Pandas Questions

### Q: How do you handle missing values?

\`\`\`python
# Step 1: Quantify
print(df.isnull().sum())
print(df.isnull().mean() * 100)  # % missing

# Step 2: Decide strategy per column
df['numeric_col'].fillna(df['numeric_col'].median(), inplace=True)
df['text_col'].fillna('Unknown', inplace=True)
df.dropna(subset=['critical_col'], inplace=True)
\`\`\`

### Q: How do you detect and remove outliers?

\`\`\`python
Q1 = df['col'].quantile(0.25)
Q3 = df['col'].quantile(0.75)
IQR = Q3 - Q1
df_clean = df[(df['col'] >= Q1 - 1.5*IQR) & (df['col'] <= Q3 + 1.5*IQR)]
\`\`\`

### Q: How do you merge two DataFrames?

\`\`\`python
result = pd.merge(orders, customers,
                  on='customer_id',
                  how='left')   # INNER / LEFT / RIGHT / OUTER
\`\`\`

### Q: Group by multiple columns and aggregate

\`\`\`python
summary = df.groupby(['region', 'category']).agg(
    total_revenue=('revenue', 'sum'),
    order_count=('order_id', 'count'),
    avg_order=('revenue', 'mean'),
).round(2).reset_index()
\`\`\`

---

## Statistics Questions You'll Be Asked

**Q: What's the difference between mean and median?**
→ Mean is the mathematical average (sensitive to outliers). Median is the middle value (outlier-resistant). Use median for skewed data like incomes.

**Q: What is standard deviation?**
→ The average distance of values from the mean. Small std = values cluster closely; large std = values spread widely.

**Q: What is a p-value?**
→ The probability of observing results at least as extreme as yours if the null hypothesis were true. p < 0.05 is the common threshold for "statistically significant."

**Q: What is correlation?**
→ A measure of linear relationship between two variables (−1 to +1). High correlation doesn't prove causation.

**Q: What is the Central Limit Theorem?**
→ As sample size grows, the sampling distribution of the mean approaches normal, regardless of the population's distribution. This justifies using z-tests and t-tests.

---

## Take-Home Challenge Strategy

A take-home gives you 2-4 hours and a dataset. Most candidates fail by:
1. Jumping straight into code without reading the problem
2. Making too many visualisations with no conclusions
3. Ignoring data quality issues
4. Submitting unpolished, unexplained work

**Winning approach:**

| Time | Task |
|------|------|
| 0:00-0:20 | Read the prompt 3×. Define 3 questions to answer. |
| 0:20-0:45 | Load, inspect, clean the data. Document issues found. |
| 0:45-1:45 | EDA — answer your 3 questions with data + charts. |
| 1:45-2:15 | Write 3 clear conclusions with recommendations. |
| 2:15-2:45 | Add comments, polish chart labels, proof-read. |
| 2:45-3:00 | Write a 200-word summary as if emailing a manager. |

---

## Talking About Your Portfolio

The most common interview question: **"Tell me about a project you've done."**

Use the STAR format:
- **S**ituation — what was the context / dataset?
- **T**ask — what was the business question?
- **A**ction — what exactly did you do? (tools, methods)
- **R**esult — what did you find? what decision did it inform?

**Example answer:**
"I analysed 1,000 e-commerce orders from a simulated retailer dataset. The question was: which product categories should marketing focus on for Q1? I cleaned the data using Pandas, identified missing values in the revenue column and imputed with the median, then ran a groupby analysis by category and month. I found that Electronics represented 41% of revenue but had the lowest return rate, making it the most efficient category. I visualised the seasonal trend with Matplotlib — revenue peaked in November-December. My recommendation was to protect the Electronics marketing budget and scale inventory in October. I published the notebook to GitHub."

---

## Behavioural Questions for Data Roles

| Question | What they're testing | Sample answer framework |
|----------|---------------------|------------------------|
| "Tell me about a time you found a surprising insight" | Curiosity, communication | STAR format |
| "How do you handle messy data?" | Process, systematicity | Walk through your cleaning steps |
| "How do you explain technical findings to non-technical people?" | Communication | Describe simplifying a chart for a manager |
| "What would you do if stakeholders disagreed with your analysis?" | Resilience, collaboration | Show data, acknowledge assumptions, seek more context |

---

## Things to Research Before Every Interview

1. **Company's industry** — what KPIs matter (retail vs fintech vs healthcare)?
2. **Their tech stack** — do they use Power BI, Tableau, or Looker? SQL or Python?
3. **Recent news** — any product launches, earnings reports, controversies?
4. **The role** — exactly what data sources and decisions does this analyst support?

---

## Questions to Ask YOUR Interviewer

These signal seriousness and business thinking:
- "What does a typical analysis request look like, and who makes those requests?"
- "What data infrastructure is in place — what tools would I be using day-to-day?"
- "How does the data team's work feed into business decisions?"
- "What would success look like for someone in this role after 90 days?"

---

## Noob Level — Complete! 🎉

You've covered the full Noob Level roadmap:

| Block | Chapters | Topics |
|-------|----------|--------|
| 1 | 1-4 | Data Concepts, Excel, SQL Basics |
| 2 | 5-8 | SQL Filtering/Aggregation, Python, Pandas |
| 3 | 9-12 | Data Cleaning, Statistics, Matplotlib, Power BI |
| 4 | 13-16 | Project, Portfolio, Business Thinking, Interviews |

**Next: Amateur Level** — deeper Python, advanced SQL, statistical testing, real datasets.
`,
    codeExample: `import pandas as pd
import numpy as np

# ─────────────────────────────────────────────────────────────────────────────
# Interview Practice: Live-coded answers to common analyst interview questions
# ─────────────────────────────────────────────────────────────────────────────

np.random.seed(42)

# Dataset
orders = pd.DataFrame({
    'order_id':   range(1001, 1051),
    'customer_id':np.random.randint(1, 21, 50),
    'month':      np.random.randint(1, 13, 50),
    'category':   np.random.choice(['Electronics','Clothing','Books','Food'], 50),
    'revenue':    np.random.exponential(200, 50).round(2),
    'quantity':   np.random.randint(1, 8, 50),
    'region':     np.random.choice(['North','South','East','West'], 50),
})
# Introduce some missing values
orders.loc[3, 'revenue'] = np.nan
orders.loc[7, 'category'] = None
orders.loc[12, 'revenue'] = np.nan

# ── Q1: Handle missing values ─────────────────────────────────────────────────
print("=== Q1: HANDLE MISSING VALUES ===")
print(f"Missing before: {orders.isnull().sum().sum()}")
orders['revenue'].fillna(orders['revenue'].median(), inplace=True)
orders['category'].fillna('Other', inplace=True)
print(f"Missing after:  {orders.isnull().sum().sum()}")

# ── Q2: Find the top-3 categories by revenue ──────────────────────────────────
print("\\n=== Q2: TOP 3 CATEGORIES BY REVENUE ===")
top3 = orders.groupby('category')['revenue'].sum().sort_values(ascending=False).head(3)
print(top3.round(2))

# ── Q3: Calculate revenue by region with % share ──────────────────────────────
print("\\n=== Q3: REVENUE BY REGION WITH SHARE ===")
region_rev = orders.groupby('region')['revenue'].sum()
region_df  = pd.DataFrame({'revenue': region_rev})
region_df['share_%'] = (region_df['revenue'] / region_df['revenue'].sum() * 100).round(1)
print(region_df.sort_values('revenue', ascending=False).round(2))

# ── Q4: Find customers with MULTIPLE orders (like SQL HAVING COUNT > 1) ───────
print("\\n=== Q4: CUSTOMERS WITH MULTIPLE ORDERS ===")
multi_order = orders.groupby('customer_id')['order_id'].count()
multi_order = multi_order[multi_order > 1].sort_values(ascending=False)
print(f"Customers with >1 order: {len(multi_order)}")
print(multi_order.head(5))

# ── Q5: Rolling 3-month average ───────────────────────────────────────────────
print("\\n=== Q5: ROLLING 3-MONTH AVERAGE REVENUE ===")
monthly = orders.groupby('month')['revenue'].sum().reset_index()
monthly = monthly.sort_values('month')
monthly['rolling_3m'] = monthly['revenue'].rolling(3, min_periods=1).mean()
print(monthly.round(2).to_string(index=False))

# ── Q6: IQR outlier detection ─────────────────────────────────────────────────
print("\\n=== Q6: OUTLIER DETECTION ===")
q1 = orders['revenue'].quantile(0.25)
q3 = orders['revenue'].quantile(0.75)
iqr = q3 - q1
lower, upper = q1 - 1.5*iqr, q3 + 1.5*iqr
outliers = orders[(orders['revenue'] < lower) | (orders['revenue'] > upper)]
print(f"IQR: {iqr:.2f} | Bounds: [{lower:.2f}, {upper:.2f}]")
print(f"Outliers found: {len(outliers)}")
if len(outliers):
    print(outliers[['order_id','revenue']].to_string(index=False))

# ── Q7: Correlation ───────────────────────────────────────────────────────────
print("\\n=== Q7: CORRELATION MATRIX ===")
print(orders[['revenue','quantity']].corr().round(3))

print("\\n✅ All interview questions answered correctly!")
print("   Practice these daily until they become second nature.")
`,
    quizzes: [
      {
        question: 'In a data analyst interview, the take-home challenge first step should be:',
        options: [
          'Read the prompt carefully and define 2-3 specific questions to answer before writing code',
          'Immediately start writing Python code',
          'Create as many charts as possible',
          'Write the conclusion section first',
        ],
        correctAnswer: 0,
        explanation: 'Understanding what\'s being asked before coding prevents wasted effort. Defining questions upfront structures the entire analysis.',
      },
      {
        question: 'What SQL clause finds groups with more than one matching row (like duplicate emails)?',
        options: [
          '`GROUP BY email HAVING COUNT(*) > 1`',
          '`WHERE COUNT(*) > 1`',
          '`DISTINCT email WHERE duplicated = TRUE`',
          '`ORDER BY email HAVING duplicates`',
        ],
        correctAnswer: 0,
        explanation: '`HAVING` filters aggregated results (after `GROUP BY`). `WHERE` filters individual rows before aggregation — it cannot use aggregate functions.',
      },
      {
        question: 'The STAR interview format stands for:',
        options: [
          'Situation, Task, Action, Result',
          'Summary, Technical, Analysis, Report',
          'Skills, Tools, Algorithms, Results',
          'Strategy, Testing, Accuracy, Review',
        ],
        correctAnswer: 0,
        explanation: 'STAR structures behavioral answers: what was the context, what were you responsible for, what did you do, and what was the outcome?',
      },
      {
        question: 'A window function with `PARTITION BY category ORDER BY revenue DESC` gives:',
        options: [
          'A ranking or running aggregate that resets for each category',
          'A filter that keeps only top revenue rows per category',
          'A groupby that sums revenue within categories',
          'A join between the category and revenue tables',
        ],
        correctAnswer: 0,
        explanation: '`PARTITION BY` divides the window by category so functions like `RANK()`, `ROW_NUMBER()`, or `SUM()` operate independently within each group.',
      },
      {
        question: 'A p-value of 0.03 in a hypothesis test means:',
        options: [
          'There is a 3% chance of seeing these results if the null hypothesis were true — statistically significant at the 5% level',
          'The effect size is 3%',
          'The model accuracy is 97%',
          'There is a 97% chance the null hypothesis is correct',
        ],
        correctAnswer: 0,
        explanation: 'p-value < 0.05 is the conventional threshold for rejecting the null hypothesis. p = 0.03 means results this extreme would occur only 3% of the time by chance.',
      },
      {
        question: 'Which pandas method merges two DataFrames keeping ALL rows from the left table?',
        options: [
          '`pd.merge(df1, df2, on="id", how="left")`',
          '`pd.merge(df1, df2, on="id", how="inner")`',
          '`pd.merge(df1, df2, on="id", how="right")`',
          '`pd.concat([df1, df2])`',
        ],
        correctAnswer: 0,
        explanation: '`how="left"` keeps all rows from df1 and matches from df2; unmatched rows get NaN for df2 columns. This is equivalent to SQL LEFT JOIN.',
      },
      {
        question: 'The Central Limit Theorem states:',
        options: [
          'As sample size increases, the sampling distribution of the mean approaches a normal distribution regardless of population shape',
          'All real-world data follows a normal distribution',
          'The mean of a dataset is always at its centre',
          'Large datasets are always representative of the population',
        ],
        correctAnswer: 0,
        explanation: 'The CLT is why statistical tests (t-tests, z-tests) work even on non-normal data: with enough samples, sample means ARE normally distributed.',
      },
      {
        question: 'In a recruiter screen, what is the most important thing to communicate?',
        options: [
          'Your motivation, relevant skills, and 1-2 specific projects you\'ve done',
          'Every Python library you\'ve ever installed',
          'Your academic grades',
          'That you are available to start immediately',
        ],
        correctAnswer: 0,
        explanation: 'Recruiters assess fit quickly. Specific projects demonstrate skills more credibly than generic claims. Motivation shows you\'re genuinely interested.',
      },
      {
        question: 'The SQL to find the second-highest salary uses:',
        options: [
          'A subquery: `WHERE salary < (SELECT MAX(salary) FROM table)` then `SELECT MAX(salary)`',
          '`SELECT salary ORDER BY salary DESC LIMIT 2`',
          '`WHERE RANK(salary) = 2`',
          '`HAVING salary = SECOND_MAX(salary)`',
        ],
        correctAnswer: 0,
        explanation: 'The subquery finds the maximum salary, then the outer query finds the max of everything below that — a classic pattern interviewers love.',
      },
      {
        question: 'When an interviewer asks "How do you handle messy data?", the best answer:',
        options: [
          'Walks through a systematic process: inspect → quantify missing → strategy per column type → validate after cleaning',
          'Says "I use pandas.dropna()"',
          'Says "I ask a senior analyst to clean it for me"',
          'Says "I ignore missing values because they are usually small"',
        ],
        correctAnswer: 0,
        explanation: 'Interviewers want to see process, not just a single function call. Walking through a cleaning pipeline shows systematic thinking.',
      },
      {
        question: 'The best question to ask YOUR interviewer at the end is:',
        options: [
          '"What does a typical analysis request look like, and who makes those requests?"',
          '"How much is the salary?"',
          '"Can I work from home every day?"',
          '"Do I need to know machine learning for this role?"',
        ],
        correctAnswer: 0,
        explanation: 'Asking about the team\'s actual workflow shows you\'re thinking about how to contribute, not just about compensation or perks.',
      },
      {
        question: '`df.rolling(3).mean()` computes:',
        options: [
          'The average of each value and the 2 preceding values (3-period moving average)',
          'The mean of the entire DataFrame',
          'A 3% random sample mean',
          'The mean rounded to 3 decimal places',
        ],
        correctAnswer: 0,
        explanation: '`rolling(n)` creates a sliding window of n periods; `.mean()` computes the average in each window. Standard technique for smoothing time series.',
      },
      {
        question: 'A candidate says "I cleaned some data and made charts" vs "I identified 23% missing revenue values, imputed with median, and found that Electronics drives 41% of revenue despite 12% of orders." Which is better?',
        options: [
          'The second — specific numbers and findings demonstrate actual work and analytical depth',
          'The first — shorter answers are always better in interviews',
          'Both are equivalent — the content is the same',
          'The first — humility is valued in interviews',
        ],
        correctAnswer: 0,
        explanation: 'Specificity proves you actually did the work. Vague answers sound like everyone else\'s answers. Numbers and context make you memorable.',
      },
      {
        question: 'Before a data analyst interview, you should research:',
        options: [
          'The company\'s industry, tech stack, recent news, and exactly what the role does',
          'Only the job description',
          'The interviewer\'s personal LinkedIn profile only',
          'How many employees the company has',
        ],
        correctAnswer: 0,
        explanation: 'Domain knowledge and understanding the company\'s business context lets you tailor answers to their specific challenges and tools.',
      },
      {
        question: 'In a take-home challenge, submitting results as "a one-page summary as if emailing a manager" means:',
        options: [
          'Writing 3-5 bullet points with the key findings and recommendations in plain English',
          'Sending your entire Jupyter notebook as the email',
          'Only sending the raw data back with minor edits',
          'Creating an elaborate multi-page PDF report',
        ],
        correctAnswer: 0,
        explanation: 'Take-home challenges often ask you to present to a non-technical stakeholder. Demonstrating that communication skill (not just coding) sets you apart.',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Data Analytics — Noob Level Block 4 (FINAL)\n');

  const course = await prisma.course.findUnique({ where: { slug: 'data-analytics' } });
  if (!course) throw new Error('data-analytics course not found — run dataAnalytics.ts first');

  console.log(`📚 Seeding ${CHAPTERS.length} chapters...\n`);

  for (const ch of CHAPTERS) {
    // Build questions
    const questions = ch.quizzes.map((qz, i) => ({
      text:          qz.question,
      options:       JSON.stringify(
        qz.options.map((opt: string, idx: number) => ({ id: IDX_TO_ID[idx], text: opt }))
      ),
      correctAnswer: IDX_TO_ID[qz.correctAnswer],
      explanation:   qz.explanation,
      orderIndex:    i + 1,
    }));

    // Idempotency — check chapter + quiz
    const existingChapter = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM Chapter WHERE slug = ? LIMIT 1`, ch.slug,
    );

    let chapterId: string;

    if (existingChapter.length) {
      chapterId = existingChapter[0].id;
      const existingQuiz = await prisma.$queryRawUnsafe<{ id: string }[]>(
        `SELECT id FROM Quiz WHERE chapterId = ? LIMIT 1`, chapterId,
      );
      if (existingQuiz.length) {
        console.log(`  ⏭  [${ch.orderIndex}] ${ch.title}  (already exists — skipping)`);
        continue;
      }
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
      console.log(`  ✅ [${ch.orderIndex}] ${ch.title}  (quiz repaired · ${questions.length} Qs)`);
      continue;
    }

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

    console.log(`  ✅ [${ch.orderIndex}] ${ch.title}  (${questions.length} Qs · ${ch.xpReward} XP)`);
  }

  console.log('\n🎉 Block 4 complete! All 16 Noob Level chapters seeded.');
  console.log('   🏆 Noob Level: COMPLETE');
  console.log('   Next: Amateur Level — advanced SQL, statistical testing, real datasets.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
