import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper — produces the four labelled option strings
function opts(a: string, b: string, c: string, d: string): string {
  return JSON.stringify([`A) ${a}`, `B) ${b}`, `C) ${c}`, `D) ${d}`]);
}

// ─── Chapter definitions ───────────────────────────────────────────────────────
const CHAPTERS = [

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 11 — Advanced Pandas: Data Reshaping
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-11-pandas-reshaping',
    title:      'Advanced Pandas: Data Reshaping',
    description:'Master pivot_table, melt, stack/unstack, crosstab, and wide_to_long — the art of transforming messy, wide, or multi-level data into analysis-ready tidy form.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 111,
    xpReward:   120,
    language:   'python',
    content: `# Advanced Pandas: Data Reshaping

## What You'll Learn
Raw data almost never arrives in the shape your analysis needs. Sales data comes wide (one column per month), survey data arrives in long format, and CRM exports mix hierarchical and flat structures. This chapter gives you the complete toolkit to reshape any dataset into the "tidy" form that powers reliable analysis.

---

## 1. Tidy Data — The Guiding Principle

A tidy dataset has:
- **One observation per row**
- **One variable per column**
- **One type of observational unit per table**

Reshaping is the process of moving between different representations of the same data.

---

## 2. pivot_table — Summarise in Two Dimensions

\`pivot_table\` is the spreadsheet PivotTable equivalent — it aggregates values across two categorical axes.

\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv('sales.csv')
# Columns: region, product, month, revenue, units

# Basic pivot: average revenue by region & product
pivot = df.pivot_table(
    values='revenue',
    index='region',        # rows
    columns='product',     # columns
    aggfunc='mean',        # default is mean
    fill_value=0           # replace NaN with 0
)

# Multiple aggregations at once
multi = df.pivot_table(
    values=['revenue', 'units'],
    index='region',
    columns='product',
    aggfunc={'revenue': 'sum', 'units': 'mean'}
)
print(multi)
\`\`\`

**Pro tip:** Add \`margins=True\` to get row and column totals automatically.

\`\`\`python
with_totals = df.pivot_table(
    values='revenue', index='region', columns='product',
    aggfunc='sum', fill_value=0, margins=True, margins_name='TOTAL'
)
\`\`\`

---

## 3. melt — Wide to Long (Unpivot)

\`melt\` is the inverse of pivot: it converts multiple value columns into a single \`variable\` + \`value\` pair. This is the most common reshaping operation when working with time-series wide data.

\`\`\`python
# Wide format: each month is a separate column
wide = pd.DataFrame({
    'product': ['Widget', 'Gadget', 'Doohickey'],
    'Jan':     [120, 340, 89],
    'Feb':     [145, 312, 102],
    'Mar':     [167, 398, 78],
})

# Melt to long format
long = wide.melt(
    id_vars=['product'],         # columns to keep as-is
    value_vars=['Jan','Feb','Mar'],  # columns to unpivot
    var_name='month',            # name for the new variable column
    value_name='sales'           # name for the new value column
)
print(long)
#   product month  sales
# 0  Widget   Jan    120
# 1  Gadget   Jan    340
# ...
\`\`\`

---

## 4. stack / unstack — Rotating MultiIndex

\`stack\` pivots the innermost column level into the index; \`unstack\` does the reverse.

\`\`\`python
# Suppose multi has MultiIndex columns: (metric, product)
# Stack the product level into the row index
stacked = multi.stack(level='product')

# Unstack brings the innermost index level back to columns
unstacked = stacked.unstack(level='product')

# Rename axis for clarity
unstacked.columns.name = None
\`\`\`

**When to use:** Use \`stack/unstack\` when working with Pandas MultiIndex DataFrames (e.g., after a groupby with multiple aggregations or a pivot_table with multiple value columns).

---

## 5. crosstab — Frequency Tables

\`crosstab\` computes a frequency matrix between two categorical Series — great for survey analysis or segmentation.

\`\`\`python
# How many customers of each tier bought each product?
ct = pd.crosstab(
    index=df['tier'],
    columns=df['product'],
    values=df['revenue'],
    aggfunc='sum',
    normalize='index',   # row percentages
    margins=True
)
ct = ct.round(3) * 100   # as percentages
print(ct)
\`\`\`

**normalize options:**
- \`'index'\` → each row sums to 1 (row percentages)
- \`'columns'\` → each column sums to 1
- \`'all'\` → entire table sums to 1

---

## 6. pd.wide_to_long — Pattern-Based Unpivot

\`wide_to_long\` handles the common pattern where column names encode both a variable name and a time period (e.g., \`sales_Q1\`, \`sales_Q2\`, \`units_Q1\`, \`units_Q2\`).

\`\`\`python
wide2 = pd.DataFrame({
    'id':        [1, 2, 3],
    'sales_Q1':  [100, 200, 150],
    'sales_Q2':  [110, 220, 160],
    'units_Q1':  [10, 20, 15],
    'units_Q2':  [11, 22, 16],
})

long2 = pd.wide_to_long(
    wide2,
    stubnames=['sales', 'units'],   # prefixes before the separator
    i='id',                          # identifier column
    j='quarter',                     # name of the new suffix column
    sep='_',                         # separator between stub and suffix
    suffix=r'\\w+'                    # regex for suffix values
)
print(long2.reset_index())
\`\`\`

---

## 7. A Complete Reshape Workflow

Real-world scenario: a spreadsheet export has monthly revenue for each product in wide format. You need a tidy long DataFrame for a time-series analysis.

\`\`\`python
import pandas as pd

raw = pd.read_excel('product_revenue.xlsx')

# Step 1: Melt months into rows
long = raw.melt(
    id_vars=['product', 'category', 'region'],
    var_name='month',
    value_name='revenue'
)

# Step 2: Parse dates
long['date'] = pd.to_datetime(long['month'], format='%b %Y')
long = long.drop(columns='month').sort_values(['product','date'])

# Step 3: Add derived columns
long['revenue_mom'] = long.groupby('product')['revenue'].pct_change() * 100

# Step 4: Pivot summary for report
summary = long.pivot_table(
    values='revenue',
    index='category',
    columns=long['date'].dt.quarter.map({1:'Q1',2:'Q2',3:'Q3',4:'Q4'}),
    aggfunc='sum',
    fill_value=0
)
print(summary)
\`\`\`

---

## Key Takeaways

- **pivot_table** → aggregate wide summaries from flat data (like a spreadsheet PivotTable)
- **melt** → wide-to-long (multiple time/attribute columns → single variable+value pair)
- **stack/unstack** → rotate MultiIndex levels between rows and columns
- **crosstab** → frequency/contingency tables between two categoricals
- **wide_to_long** → pattern-based unpivot when column names encode variable+period
`,
    codeExample: `import pandas as pd

# ── Real workflow: reshape quarterly sales data ──────────────────────────
df = pd.DataFrame({
    'product':    ['Widget', 'Gadget', 'Doohickey'],
    'category':   ['HW', 'HW', 'SW'],
    'sales_Q1':   [12000, 34000, 8900],
    'sales_Q2':   [14500, 31200, 10200],
    'sales_Q3':   [16700, 39800, 7800],
    'sales_Q4':   [22100, 45300, 11400],
    'units_Q1':   [120,   340,   89],
    'units_Q2':   [145,   312,   102],
    'units_Q3':   [167,   398,   78],
    'units_Q4':   [221,   453,   114],
})

# 1. Wide to long via wide_to_long
long = pd.wide_to_long(
    df, stubnames=['sales','units'], i=['product','category'],
    j='quarter', sep='_', suffix=r'\\w+'
).reset_index()

# 2. Total revenue per category per quarter
pivot = long.pivot_table(
    values='sales', index='category',
    columns='quarter', aggfunc='sum', margins=True
)

# 3. Share of each product within category
ct = pd.crosstab(long['quarter'], long['product'],
                 values=long['sales'], aggfunc='sum',
                 normalize='index').round(3)

print("Quarterly Revenue by Category:")
print(pivot, "\\n")
print("Product Share per Quarter:")
print(ct)`,
    quiz: {
      title: 'Advanced Pandas: Data Reshaping — Quiz',
      questions: [
        {
          text: 'You have a DataFrame with columns: customer_id, Jan_spend, Feb_spend, Mar_spend. Which function is the best choice to reshape it into tidy long format?',
          options: opts(
            'pivot_table',
            'melt',
            'crosstab',
            'unstack'
          ),
          correctAnswer: 'b',
          explanation: 'melt() converts multiple value columns (Jan_spend, Feb_spend, Mar_spend) into a single variable/value pair — this is the canonical wide-to-long operation.',
          orderIndex: 1,
        },
        {
          text: 'What does pivot_table(values="revenue", index="region", columns="product", aggfunc="sum") produce?',
          options: opts(
            'A long DataFrame with one row per region-product combination',
            'A 2-D summary table with regions as rows, products as columns, and summed revenue as values',
            'A sorted list of revenue totals per region',
            'A MultiIndex DataFrame grouped by region and product'
          ),
          correctAnswer: 'b',
          explanation: 'pivot_table produces a two-dimensional cross-tabulation where the index becomes rows, columns become column headers, and the aggfunc is applied to values at each intersection.',
          orderIndex: 2,
        },
        {
          text: 'What is the purpose of fill_value=0 in pivot_table()?',
          options: opts(
            'It replaces missing index values with zeros',
            'It replaces NaN cells (no data for that row/column combination) with 0',
            'It sets the minimum value in the table to 0',
            'It forces all aggregated values to start from 0'
          ),
          correctAnswer: 'b',
          explanation: 'When a pivot cell has no matching rows, Pandas produces NaN. fill_value=0 replaces those NaN cells with 0, preventing downstream arithmetic failures.',
          orderIndex: 3,
        },
        {
          text: 'Which parameter in pd.crosstab() gives you row percentages (each row sums to 1.0)?',
          options: opts(
            'margins=True',
            'normalize="index"',
            'normalize="columns"',
            'aggfunc="pct"'
          ),
          correctAnswer: 'b',
          explanation: 'normalize="index" divides each cell by its row total, producing row-wise percentages. normalize="columns" does the same by column total.',
          orderIndex: 4,
        },
        {
          text: 'After df.pivot_table(...) you get a DataFrame with MultiIndex columns (metric, product). You want to rotate the product level into the row index. Which method do you use?',
          options: opts(
            'melt()',
            'reset_index()',
            'stack()',
            'transpose()'
          ),
          correctAnswer: 'c',
          explanation: 'stack() pivots the innermost column level into the innermost row index level. unstack() is the reverse. Together they let you rotate MultiIndex structure between axes.',
          orderIndex: 5,
        },
        {
          text: 'pd.wide_to_long(df, stubnames=["sales","units"], i="id", j="quarter", sep="_") expects column names in what format?',
          options: opts(
            'sales, units, quarter_1, quarter_2',
            'sales_Q1, units_Q1, sales_Q2, units_Q2',
            'Q1_sales, Q2_sales, Q1_units, Q2_units',
            'sales-Q1, units-Q1, sales-Q2, units-Q2'
          ),
          correctAnswer: 'b',
          explanation: 'wide_to_long expects column names as stubname + sep + suffix — e.g., "sales_Q1", "units_Q1". The stubname comes first, then the separator, then the suffix which becomes the j column.',
          orderIndex: 6,
        },
        {
          text: 'What is "tidy data"?',
          options: opts(
            'Data sorted alphabetically with no duplicates',
            'A format where each row is one observation, each column is one variable, and each table covers one observational unit',
            'A compressed binary format for large DataFrames',
            'Data that has been normalised to 3NF in a relational database'
          ),
          correctAnswer: 'b',
          explanation: 'Tidy data (Hadley Wickham, 2014) is the standard form for analysis: one row = one observation, one column = one variable. Most Pandas/Seaborn/sklearn functions expect tidy input.',
          orderIndex: 7,
        },
        {
          text: 'What does df.melt(id_vars=["product"], var_name="month", value_name="sales") produce?',
          options: opts(
            'A pivot table grouped by product and month',
            'A long DataFrame where every non-id column becomes a row with its column name in "month" and its value in "sales"',
            'A DataFrame sorted by sales within each month',
            'A crosstab of product vs month'
          ),
          correctAnswer: 'b',
          explanation: 'melt unpivots all columns not in id_vars. Each value column becomes a separate row. var_name names the new column that holds the original column name; value_name holds the value.',
          orderIndex: 8,
        },
        {
          text: 'You call df.pivot_table(margins=True). What does the extra row and column added contain?',
          options: opts(
            'Standard deviations of each row and column',
            'Grand total (or aggfunc applied across all values) for each row and column, plus the overall total',
            'Count of non-null values per row and column',
            'Percentage share of each cell in the overall total'
          ),
          correctAnswer: 'b',
          explanation: 'margins=True appends a totals row and column showing the aggfunc applied across all entries — by default labelled "All". Rename with margins_name="TOTAL".',
          orderIndex: 9,
        },
        {
          text: 'Why is wide format difficult for time-series analysis in Pandas?',
          options: opts(
            'Pandas cannot read wide-format CSV files',
            'Each time period is a separate column, making it impossible to apply resample(), rolling(), and pct_change() across time in a vectorised way',
            'Wide format always contains NaN values that break calculations',
            'Wide format uses more memory than long format'
          ),
          correctAnswer: 'b',
          explanation: 'Pandas time-series methods (resample, rolling, shift, pct_change) operate along a DatetimeIndex row axis. Wide format encodes time in columns, making these operations impossible without first melting to long format.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 12 — Data Visualization Mastery
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-12-data-visualization-mastery',
    title:      'Data Visualization Mastery',
    description:'Go beyond default charts — master Matplotlib figure anatomy, Seaborn statistical plots, multi-panel layouts, annotation, colour theory, and the chart-selection framework used by data teams at top firms.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 112,
    xpReward:   120,
    language:   'python',
    content: `# Data Visualization Mastery

## What You'll Learn
Charts are the analyst's primary communication tool. Bad charts mislead, good charts convince. This chapter takes you deep into Matplotlib's figure anatomy and Seaborn's statistical chart library — covering layout, colour, annotation, and the decision framework for choosing the right chart every time.

---

## 1. Matplotlib Figure Anatomy

Every Matplotlib chart is built from nested objects:

\`\`\`
Figure  →  one or more Axes  →  Artists (lines, patches, text, collections)
\`\`\`

\`\`\`python
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np

fig, ax = plt.subplots(figsize=(10, 5))   # Figure + one Axes

x = np.linspace(0, 4 * np.pi, 300)
ax.plot(x, np.sin(x), color='#2196F3', linewidth=2, label='sin(x)')
ax.plot(x, np.cos(x), color='#FF5722', linewidth=2, linestyle='--', label='cos(x)')

# Title & labels with font control
ax.set_title('Trigonometric Functions', fontsize=16, fontweight='bold', pad=14)
ax.set_xlabel('x (radians)', fontsize=12)
ax.set_ylabel('Amplitude', fontsize=12)

# Grid & spines
ax.grid(True, linestyle=':', alpha=0.5)
ax.spines[['top','right']].set_visible(False)   # minimal style

# Legend & tick formatting
ax.legend(fontsize=11, framealpha=0.3)
ax.xaxis.set_major_formatter(mticker.MultipleLocator(np.pi))

plt.tight_layout()
plt.savefig('trig.png', dpi=150)
plt.show()
\`\`\`

**Key objects:**
| Object | Access | Controls |
|---|---|---|
| Figure | \`fig\` | size, DPI, background |
| Axes | \`ax\` | plot area, ticks, labels |
| Spine | \`ax.spines['left']\` | border lines |
| Legend | \`ax.legend()\` | key mapping |
| Tick | \`ax.xaxis\` | formatter, locator |

---

## 2. Multi-Panel Layouts

\`\`\`python
# 2×2 grid with shared x-axis
fig, axes = plt.subplots(2, 2, figsize=(12, 8), sharex=False)
axes = axes.flatten()   # 1-D array for easy iteration

titles = ['Revenue', 'Users', 'Conversion Rate', 'Avg Order Value']
data   = [np.random.randn(100).cumsum() for _ in range(4)]
colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0']

for i, (ax, title, d, c) in enumerate(zip(axes, titles, data, colors)):
    ax.plot(d, color=c, linewidth=1.5)
    ax.fill_between(range(len(d)), d, alpha=0.15, color=c)
    ax.set_title(title, fontweight='bold')
    ax.spines[['top','right']].set_visible(False)
    ax.grid(True, linestyle=':', alpha=0.4)

fig.suptitle('KPI Dashboard', fontsize=18, fontweight='bold', y=1.01)
plt.tight_layout()
plt.show()
\`\`\`

For complex layouts use \`gridspec\`:
\`\`\`python
import matplotlib.gridspec as gridspec

fig = plt.figure(figsize=(14, 8))
gs  = gridspec.GridSpec(2, 3, figure=fig, hspace=0.4, wspace=0.3)

ax_main  = fig.add_subplot(gs[0, :2])   # top-left spanning 2 columns
ax_side  = fig.add_subplot(gs[0, 2])    # top-right 1 column
ax_bot1  = fig.add_subplot(gs[1, 0])
ax_bot2  = fig.add_subplot(gs[1, 1])
ax_bot3  = fig.add_subplot(gs[1, 2])
\`\`\`

---

## 3. Seaborn Statistical Charts

Seaborn wraps Matplotlib with opinionated statistical plot types.

### Distribution Plots
\`\`\`python
import seaborn as sns
import pandas as pd

sns.set_theme(style='whitegrid', palette='muted', font_scale=1.1)
df = sns.load_dataset('tips')

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Histogram + KDE
sns.histplot(df['total_bill'], kde=True, bins=25, ax=axes[0], color='steelblue')
axes[0].set_title('Distribution of Total Bill')

# Boxplot grouped by category
sns.boxplot(x='day', y='total_bill', hue='sex', data=df, ax=axes[1])
axes[1].set_title('Bill by Day & Sex')

# Violin plot — shows full distribution shape
sns.violinplot(x='day', y='total_bill', data=df, ax=axes[2], inner='quartile')
axes[2].set_title('Bill Distribution Shape')

plt.tight_layout()
\`\`\`

### Heatmaps — Correlation Matrices
\`\`\`python
corr = df[['total_bill','tip','size']].corr()

fig, ax = plt.subplots(figsize=(6, 5))
sns.heatmap(
    corr,
    annot=True,           # show numbers in cells
    fmt='.2f',
    cmap='RdYlGn',        # diverging: red=negative, green=positive
    center=0,
    vmin=-1, vmax=1,
    square=True,
    linewidths=0.5,
    ax=ax
)
ax.set_title('Pearson Correlation Matrix', fontsize=14, pad=12)
plt.tight_layout()
\`\`\`

### Pair Plots — Multi-Variable Exploration
\`\`\`python
iris = sns.load_dataset('iris')
g = sns.pairplot(
    iris,
    hue='species',            # colour by category
    diag_kind='kde',          # diagonal: KDE instead of histogram
    plot_kws={'alpha': 0.6},
    corner=True               # show only lower triangle
)
g.fig.suptitle('Iris Pairplot', y=1.02)
\`\`\`

### FacetGrid — Small Multiples
\`\`\`python
g = sns.FacetGrid(df, col='day', row='sex', height=3, aspect=1.2)
g.map_dataframe(sns.scatterplot, x='total_bill', y='tip', alpha=0.6)
g.add_legend()
g.set_axis_labels('Total Bill ($)', 'Tip ($)')
g.set_titles(col_template='{col_name}', row_template='{row_name}')
\`\`\`

---

## 4. Annotations & Callouts

Annotations turn a static chart into a story.

\`\`\`python
fig, ax = plt.subplots(figsize=(10, 5))
monthly_revenue = [1200, 1350, 1280, 1600, 1900, 2100, 1850, 2400, 2300, 2700, 2500, 3100]
months = list(range(1, 13))

ax.plot(months, monthly_revenue, marker='o', color='#2196F3', linewidth=2)
ax.fill_between(months, monthly_revenue, alpha=0.08, color='#2196F3')

# Highlight a specific point
peak_idx = monthly_revenue.index(max(monthly_revenue))
ax.annotate(
    f'Peak: \${max(monthly_revenue):,}',
    xy=(months[peak_idx], max(monthly_revenue)),
    xytext=(months[peak_idx] - 2, max(monthly_revenue) - 300),
    arrowprops=dict(arrowstyle='->', color='black', lw=1.5),
    fontsize=11, color='#D32F2F', fontweight='bold'
)

# Reference line
ax.axhline(y=2000, color='gray', linestyle='--', linewidth=1, label='Target $2,000')
ax.legend()
ax.set_title('Monthly Revenue with Target Line', fontsize=14, fontweight='bold')
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
\`\`\`

---

## 5. Chart Selection Framework

| Question | Recommended Chart |
|---|---|
| Distribution of one variable | Histogram, KDE, Box plot |
| Compare distributions across groups | Violin, Box, Strip/Swarm |
| Relationship between two continuous vars | Scatter, Hex bin |
| Trend over time (one series) | Line with fill |
| Trend over time (multiple series) | Multi-line, Area stacked |
| Part-to-whole (≤ 5 parts) | Stacked bar, Waffle |
| Ranking | Horizontal bar (sorted descending) |
| Correlation matrix | Heatmap |
| Multi-variable exploration | Pair plot, Parallel coordinates |
| Geographic distribution | Choropleth, Bubble map |

**Anti-patterns to avoid:**
- 3-D pie charts — perspective distorts angles
- Dual y-axis — implies causation from correlation
- Truncated y-axis — makes small differences look large
- Rainbow colour maps — not perceptually uniform; use viridis/cividis instead
- Too many categories in one pie — use bar chart instead

---

## 6. Colour Best Practices

\`\`\`python
# Sequential (low → high): quantitative ordered data
cmap_seq = plt.cm.get_cmap('Blues')

# Diverging (negative → 0 → positive): correlation, change
cmap_div = plt.cm.get_cmap('RdBu')

# Qualitative (categorical): no implied order
palette_qual = sns.color_palette('Set2', n_colors=6)

# Colourblind-safe sequential palette
palette_cb = sns.color_palette('colorblind')
\`\`\`

**Rule:** Never use colour as the only encoding — also use shape, line style, or annotation for accessibility.

---

## Key Takeaways

- Every Matplotlib chart is a **Figure → Axes → Artists** hierarchy; understanding it unlocks full customisation.
- **Remove top/right spines**, add subtle grids, and use **tight_layout()** for publication-quality defaults.
- Match **chart type to question**: distribution → histogram/violin; trend → line; correlation → scatter/heatmap; ranking → sorted bar.
- Use **annotations** to guide the reader's eye to the insight — don't make them find it themselves.
- Choose **perceptually uniform colour maps** (viridis, RdBu, Set2) and design for colourblind accessibility.
`,
    codeExample: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style='whitegrid', palette='muted', font_scale=1.05)
rng = np.random.default_rng(42)

months = pd.date_range('2024-01', periods=12, freq='ME')
df = pd.DataFrame({
    'month':      months,
    'revenue':    rng.normal(50000, 8000, 12).clip(30000),
    'users':      rng.normal(12000, 1500, 12).clip(8000).astype(int),
    'conversion': rng.uniform(0.03, 0.08, 12),
    'region':     rng.choice(['North','South','East','West'], 12),
})

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 1. Revenue trend with annotation
ax = axes[0]
ax.plot(df['month'], df['revenue'], marker='o', color='#2196F3', lw=2)
ax.fill_between(df['month'], df['revenue'], alpha=0.1, color='#2196F3')
peak = df.loc[df['revenue'].idxmax()]
ax.annotate(
    f"Peak\\n\${peak['revenue']:,.0f}",
    xy=(peak['month'], peak['revenue']),
    xytext=(df['month'].iloc[3], peak['revenue'] * 1.05),
    arrowprops=dict(arrowstyle='->', lw=1.5),
    fontsize=9, color='#D32F2F'
)
ax.set_title('Monthly Revenue', fontweight='bold')
ax.spines[['top','right']].set_visible(False)

# 2. Conversion rate boxplot by region
sns.boxplot(x='region', y='conversion', data=df, ax=axes[1], palette='Set2')
axes[1].set_title('Conversion by Region', fontweight='bold')
axes[1].set_ylabel('Conversion Rate')

# 3. Correlation heatmap
corr = df[['revenue','users','conversion']].corr()
sns.heatmap(corr, annot=True, fmt='.2f', cmap='RdYlGn',
            center=0, square=True, ax=axes[2], linewidths=0.5)
axes[2].set_title('Correlation Matrix', fontweight='bold')

fig.suptitle('Analytics Dashboard', fontsize=15, fontweight='bold')
plt.tight_layout()
plt.show()`,
    quiz: {
      title: 'Data Visualization Mastery — Quiz',
      questions: [
        {
          text: 'In Matplotlib, what is the correct hierarchy of objects?',
          options: opts(
            'Axes → Figure → Artist',
            'Figure → Axes → Artists (lines, patches, text)',
            'Canvas → Plot → Axes → Figure',
            'Figure → Canvas → Artists → Axes'
          ),
          correctAnswer: 'b',
          explanation: 'A Figure is the top-level container. It holds one or more Axes (the actual plot areas). Each Axes contains Artists: lines, patches, text, collections, etc.',
          orderIndex: 1,
        },
        {
          text: 'Which Seaborn plot type shows the full probability distribution shape (including density) grouped by a categorical variable?',
          options: opts(
            'boxplot',
            'barplot',
            'violinplot',
            'stripplot'
          ),
          correctAnswer: 'c',
          explanation: 'violinplot shows a KDE (kernel density estimate) mirrored on both sides, revealing the full distribution shape including multimodality — something a boxplot cannot show.',
          orderIndex: 2,
        },
        {
          text: 'Which colour map should you use when visualising a correlation matrix (values range from -1 to +1)?',
          options: opts(
            'viridis — it shows all values clearly',
            'A diverging map like RdBu or RdYlGn centred at 0',
            'A sequential map like Blues starting from white',
            'A rainbow map to maximise visual distinction'
          ),
          correctAnswer: 'b',
          explanation: 'Correlation matrices have a meaningful centre (0 = no correlation). Diverging maps highlight both positive (one end) and negative (other end) correlations, with a neutral midpoint.',
          orderIndex: 3,
        },
        {
          text: 'What does ax.spines[["top","right"]].set_visible(False) achieve?',
          options: opts(
            'Hides the x and y axis labels',
            'Removes the top and right border lines of the plot area for a cleaner minimal look',
            'Disables gridlines on the top and right sides',
            'Removes tick marks from the top and right axes'
          ),
          correctAnswer: 'b',
          explanation: 'Spines are the four border lines around a plot area. Removing the top and right spines (while keeping bottom and left) is a common minimal style that reduces visual clutter.',
          orderIndex: 4,
        },
        {
          text: 'You want to compare the revenue distribution across 6 countries. Which chart is the WORST choice?',
          options: opts(
            'Grouped box plots',
            'Violin plots',
            'A pie chart with 6 slices',
            'A sorted horizontal bar chart showing median values'
          ),
          correctAnswer: 'c',
          explanation: 'Pie charts become illegible with more than 4-5 slices and cannot show distribution shape — only proportions of a total. For distribution comparison across multiple groups, boxplot or violinplot is far superior.',
          orderIndex: 5,
        },
        {
          text: 'What is the purpose of sns.FacetGrid?',
          options: opts(
            'It creates a heatmap grid from a correlation matrix',
            'It produces a grid of small multiples — the same chart type repeated for each level of a categorical variable',
            'It generates a pair plot of all numeric columns',
            'It draws a faceted area chart for time series'
          ),
          correctAnswer: 'b',
          explanation: 'FacetGrid creates "small multiples" — identical chart structures repeated across rows and/or columns of a categorical variable. It reveals how patterns differ across segments without overplotting.',
          orderIndex: 6,
        },
        {
          text: 'Which is the correct way to add an arrow annotation pointing to a data point in Matplotlib?',
          options: opts(
            'ax.text(x, y, "label", arrow=True)',
            'ax.annotate("label", xy=(x_point, y_point), xytext=(x_label, y_label), arrowprops=dict(arrowstyle="->"))',
            'ax.arrow(x, y, dx, dy, label="text")',
            'plt.annotation(xy=(x, y), text="label")'
          ),
          correctAnswer: 'b',
          explanation: 'ax.annotate() places text at xytext and draws an arrow to xy (the data point). arrowprops controls the arrow style. This is the standard way to call out specific data points.',
          orderIndex: 7,
        },
        {
          text: 'Why should you avoid dual y-axis (secondary axis) charts?',
          options: opts(
            'Matplotlib does not support dual y-axes',
            'They imply a causal or scalar relationship between two unrelated series when none may exist, and the apparent correlation depends entirely on arbitrary axis scaling',
            'They use twice as much memory as single-axis charts',
            'Seaborn automatically removes secondary axes'
          ),
          correctAnswer: 'b',
          explanation: 'The visual overlap of two series on dual axes implies correlation or causation that may not exist. The apparent relationship changes completely when you rescale either axis — making these charts highly misleading.',
          orderIndex: 8,
        },
        {
          text: 'What does sns.pairplot(df, hue="species", diag_kind="kde") display on the diagonal cells?',
          options: opts(
            'A scatter plot of each variable against itself',
            'A kernel density estimate (KDE) distribution for each variable, coloured by species',
            'A correlation coefficient for each variable pair',
            'A histogram with no colour grouping on the diagonal'
          ),
          correctAnswer: 'b',
          explanation: 'diag_kind="kde" replaces the diagonal histogram with a KDE curve. With hue="species", each species gets its own KDE curve on the diagonal, coloured by group.',
          orderIndex: 9,
        },
        {
          text: 'For a chart showing 12 months of revenue with a target line, which two elements are MOST important for storytelling?',
          options: opts(
            'A 3-D effect and a gradient background',
            'An annotation marking the peak value and a reference line showing the target',
            'A rainbow colour scheme and a secondary y-axis',
            'Log scale on y-axis and a pie chart inset'
          ),
          correctAnswer: 'b',
          explanation: 'Annotations direct the reader to the key insight (the peak). Reference lines provide context (was it above target?). Together they convert a raw trend line into a narrative. 3-D effects and rainbow colours add noise, not meaning.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 13 — Advanced Statistical Testing
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-13-advanced-statistical-testing',
    title:      'Advanced Statistical Testing',
    description:'Master ANOVA (one-way & two-way), Mann-Whitney U, Kruskal-Wallis, chi-square independence, Pearson vs Spearman correlation, and multiple testing corrections — the statistical toolkit for real product analysis.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 113,
    xpReward:   125,
    language:   'python',
    content: `# Advanced Statistical Testing

## What You'll Learn
A/B testing covers two-group comparisons. Real analytics requires comparing multiple groups, testing associations between categorical variables, handling non-normal distributions, and correcting for multiple comparisons. This chapter gives you the statistical toolkit that goes into Google's and Microsoft's analytics playbooks.

---

## 1. When to Use Which Test

| Scenario | Parametric test | Non-parametric alternative |
|---|---|---|
| 2 independent groups, continuous | Welch's t-test | Mann-Whitney U |
| 3+ independent groups, continuous | One-way ANOVA | Kruskal-Wallis |
| 2 factors × groups, continuous | Two-way ANOVA | Aligned Ranks |
| 2 categorical variables | — | Chi-square / Fisher's exact |
| Correlation: two continuous | Pearson r | Spearman ρ |
| Repeated measures | Paired t-test | Wilcoxon signed-rank |

**Parametric vs non-parametric:**
- Parametric tests assume normally distributed data (or large enough n via CLT)
- Non-parametric tests make no distributional assumption — safer for small samples, ordinal data, or heavy tails

---

## 2. One-Way ANOVA — 3+ Independent Groups

ANOVA tests whether **any** group mean differs from the others. It partitions total variance into *between-group* and *within-group* components.

H₀: μ₁ = μ₂ = μ₃ (all group means are equal)
H₁: At least one group mean differs

\`\`\`python
from scipy import stats
import pandas as pd
import numpy as np

rng = np.random.default_rng(42)

# Revenue per customer across 3 marketing channels
df = pd.DataFrame({
    'revenue': np.concatenate([
        rng.normal(120, 30, 80),   # email
        rng.normal(135, 35, 80),   # paid search
        rng.normal(118, 28, 80),   # social
    ]),
    'channel': ['email']*80 + ['paid_search']*80 + ['social']*80
})

groups = [g['revenue'].values for _, g in df.groupby('channel')]
f_stat, p_val = stats.f_oneway(*groups)

print(f"F = {f_stat:.3f}, p = {p_val:.4f}")
if p_val < 0.05:
    print("Significant: at least one channel mean differs")
\`\`\`

### Post-hoc Testing — Tukey HSD

ANOVA only tells you *something* differs, not *which* pair. Tukey's HSD tests all pairwise combinations while controlling the family-wise error rate.

\`\`\`python
from statsmodels.stats.multicomp import pairwise_tukeyhsd

result = pairwise_tukeyhsd(
    endog=df['revenue'],
    groups=df['channel'],
    alpha=0.05
)
print(result.summary())
# Shows meandiff, p-adj, lower CI, upper CI, reject H₀ for each pair
\`\`\`

---

## 3. Kruskal-Wallis — Non-Parametric 3+ Groups

Use when data is ordinal or distribution is clearly non-normal (e.g., heavy tail, bounded rating scale).

\`\`\`python
# NPS scores (0-10) across 3 product tiers
basic   = rng.integers(5, 9, 60)
pro     = rng.integers(6, 10, 60)
enterprise = rng.integers(7, 10, 60)

h_stat, p_kw = stats.kruskal(basic, pro, enterprise)
print(f"H = {h_stat:.3f}, p = {p_kw:.4f}")
\`\`\`

Post-hoc for Kruskal-Wallis — Dunn's test:
\`\`\`python
import scikit_posthocs as sp   # pip install scikit-posthocs

scores  = np.concatenate([basic, pro, enterprise])
groups2 = ['basic']*60 + ['pro']*60 + ['enterprise']*60
posthoc = sp.posthoc_dunn(pd.DataFrame({'score': scores, 'tier': groups2}),
                           val_col='score', group_col='tier', p_adjust='bonferroni')
print(posthoc)
\`\`\`

---

## 4. Two-Way ANOVA — Two Factors Simultaneously

Two-way ANOVA tests main effects of two factors **and their interaction**.

\`\`\`python
import statsmodels.api as sm
from statsmodels.formula.api import ols

# Does revenue depend on channel, device type, or their interaction?
model = ols('revenue ~ C(channel) * C(device)', data=df).fit()
anova_table = sm.stats.anova_lm(model, typ=2)
print(anova_table)
# Rows: channel, device, channel:device (interaction), Residual
# Check F and PR(>F) for each
\`\`\`

**Interaction effect:** If \`channel:device\` is significant, the effect of channel differs by device — you can't interpret main effects in isolation.

---

## 5. Chi-Square Test of Independence

Tests whether two categorical variables are related.

H₀: The two variables are independent (no association)
H₁: There is an association between the variables

\`\`\`python
# Is purchase behaviour independent of age group?
contingency = pd.crosstab(df['age_group'], df['purchased'])

chi2, p_chi, dof, expected = stats.chi2_contingency(contingency)
print(f"chi2 = {chi2:.3f}, dof = {dof}, p = {p_chi:.4f}")

# Effect size: Cramér's V
n = contingency.values.sum()
cramers_v = np.sqrt(chi2 / (n * (min(contingency.shape) - 1)))
print(f"Cramér's V = {cramers_v:.3f}")   # 0=no association, 1=perfect
\`\`\`

**When to use Fisher's Exact test instead:** When any expected cell count < 5, chi-square approximation breaks down. Fisher's exact test is exact regardless of sample size.

\`\`\`python
# 2×2 table only
odds_ratio, p_fisher = stats.fisher_exact(contingency)
\`\`\`

---

## 6. Pearson vs Spearman Correlation

\`\`\`python
# Pearson: linear relationship between two continuous normally distributed variables
r_pearson, p_pearson = stats.pearsonr(df['price'], df['sales'])

# Spearman: monotonic relationship — ranks only, no normality assumption
r_spearman, p_spearman = stats.spearmanr(df['price'], df['sales'])

print(f"Pearson  r={r_pearson:.3f} (p={p_pearson:.4f})")
print(f"Spearman ρ={r_spearman:.3f} (p={p_spearman:.4f})")
\`\`\`

**Decision rule:**
- Use Pearson when both variables are roughly normal and relationship appears linear
- Use Spearman when data has outliers, is ordinal, or relationship is monotonic but non-linear

---

## 7. Multiple Testing Corrections

Running 20 simultaneous tests at α=0.05 → expect 1 false positive by chance. You must correct for this.

\`\`\`python
from statsmodels.stats.multitest import multipletests

# p-values from 10 simultaneous feature → conversion tests
raw_pvals = [0.04, 0.23, 0.001, 0.08, 0.03, 0.41, 0.009, 0.15, 0.02, 0.07]

# Bonferroni: multiply each p by n_tests (most conservative)
reject_bf, pvals_bf, _, _ = multipletests(raw_pvals, alpha=0.05, method='bonferroni')

# Benjamini-Hochberg (FDR): controls false discovery rate — less conservative
reject_bh, pvals_bh, _, _ = multipletests(raw_pvals, alpha=0.05, method='fdr_bh')

for i, (raw, bf, bh) in enumerate(zip(raw_pvals, reject_bf, reject_bh)):
    print(f"Test {i+1:2d}: raw p={raw:.3f}  Bonferroni={'✓' if bf else '✗'}  BH={'✓' if bh else '✗'}")
\`\`\`

**When to use which correction:**
- **Bonferroni**: when a single false positive is catastrophic (medical, legal)
- **BH (FDR)**: standard for data analytics / multiple A/B variants — balances false positives and false negatives

---

## 8. Checking Assumptions Before Testing

\`\`\`python
# 1. Normality — Shapiro-Wilk (n < 2000) or K-S test
stat, p_norm = stats.shapiro(df['revenue'][:200])
print(f"Shapiro-Wilk p = {p_norm:.4f}")   # p > 0.05 → cannot reject normality

# 2. Equal variances (homoscedasticity) — Levene's test
lev_stat, p_lev = stats.levene(*groups)
print(f"Levene p = {p_lev:.4f}")   # p > 0.05 → variances approximately equal

# 3. If normality fails → use non-parametric equivalent
# 4. If variances unequal → use Welch's (already robust) or non-parametric
\`\`\`

---

## Key Takeaways

- **One-way ANOVA** tests 3+ group means simultaneously; always follow with **Tukey HSD** post-hoc to identify which pairs differ.
- **Kruskal-Wallis** is the safe non-parametric alternative for ordinal or non-normal data.
- **Chi-square** tests association between two categoricals; report **Cramér's V** as an effect size.
- **Pearson vs Spearman**: default Spearman when in doubt — it's robust to outliers and non-linearity.
- **Always correct for multiple tests** — use Bonferroni for strict control, Benjamini-Hochberg for large-scale exploratory testing.
`,
    codeExample: `from scipy import stats
import pandas as pd
import numpy as np
from statsmodels.stats.multicomp import pairwise_tukeyhsd
from statsmodels.stats.multitest import multipletests

rng = np.random.default_rng(0)

# ── Scenario: compare conversion across 4 marketing channels ──────────
# 1. Simulate data
channels = {
    'Email':       rng.normal(0.065, 0.015, 120),
    'Paid Search': rng.normal(0.082, 0.020, 120),
    'Social':      rng.normal(0.061, 0.018, 120),
    'Referral':    rng.normal(0.091, 0.022, 120),
}
df = pd.concat(
    [pd.DataFrame({'conversion': v, 'channel': k}) for k, v in channels.items()]
)

# 2. One-way ANOVA
f, p = stats.f_oneway(*channels.values())
print(f"ANOVA  F={f:.3f}  p={p:.4f}  {'SIGNIFICANT' if p < 0.05 else 'ns'}")

# 3. Post-hoc Tukey HSD
tukey = pairwise_tukeyhsd(df['conversion'], df['channel'], alpha=0.05)
print(tukey.summary())

# 4. Chi-square: did channel affect whether user subscribed?
df['subscribed'] = (df['conversion'] > df['conversion'].median()).astype(int)
ct = pd.crosstab(df['channel'], df['subscribed'])
chi2, p_chi, dof, _ = stats.chi2_contingency(ct)
n  = ct.values.sum()
cramers_v = (chi2 / (n * (min(ct.shape) - 1))) ** 0.5
print(f"Chi-square chi2={chi2:.3f} p={p_chi:.4f} Cramér V={cramers_v:.3f}")`,
    quiz: {
      title: 'Advanced Statistical Testing — Quiz',
      questions: [
        {
          text: 'You are comparing average order value across 5 customer segments. Which test is the correct starting point?',
          options: opts(
            'Five separate t-tests comparing each pair',
            'One-way ANOVA to test whether any segment mean differs',
            'Chi-square test of independence',
            'Pearson correlation between segment ID and order value'
          ),
          correctAnswer: 'b',
          explanation: 'One-way ANOVA tests whether at least one group mean differs across 3+ groups. Running multiple t-tests inflates Type I error — you need ANOVA followed by post-hoc testing.',
          orderIndex: 1,
        },
        {
          text: 'ANOVA returns p = 0.01, confirming at least one group differs. What must you do next?',
          options: opts(
            'The test is complete — report which group has the highest mean as the winner',
            'Run a post-hoc test (e.g., Tukey HSD) to identify which specific pairs of groups differ',
            'Increase sample size until p < 0.001 for certainty',
            'Re-run with a chi-square test to confirm the result'
          ),
          correctAnswer: 'b',
          explanation: 'ANOVA only tells you "something differs." Tukey HSD (or Dunn for Kruskal-Wallis) runs all pairwise comparisons while controlling the family-wise error rate, identifying exactly which pairs differ.',
          orderIndex: 2,
        },
        {
          text: 'When should you prefer Kruskal-Wallis over one-way ANOVA?',
          options: opts(
            'When you have more than 3 groups to compare',
            'When the data is ordinal, non-normal, or you have small samples with heavy-tailed distributions',
            'When you want to test for interaction effects between two factors',
            'When the p-value from ANOVA is borderline (0.04–0.06)'
          ),
          correctAnswer: 'b',
          explanation: 'ANOVA assumes normally distributed residuals and homogeneous variance. Kruskal-Wallis is rank-based and makes no distributional assumption — ideal for ordinal data, NPS scores, or clearly skewed metrics.',
          orderIndex: 3,
        },
        {
          text: 'What does a significant interaction term (channel:device) in two-way ANOVA mean?',
          options: opts(
            'Both channel and device have a significant main effect',
            'The effect of one factor depends on the level of the other — you cannot interpret main effects in isolation',
            'The model has too many variables and is over-fitted',
            'Channel and device are correlated with each other'
          ),
          correctAnswer: 'b',
          explanation: 'An interaction means the impact of channel on revenue differs by device (or vice versa). You must examine cell means (channel × device combinations) rather than marginal means.',
          orderIndex: 4,
        },
        {
          text: 'You run a chi-square test on a 2×2 contingency table where two cells have expected counts of 3. What should you do instead?',
          options: opts(
            'Continue — chi-square works for any sample size',
            'Use Fisher\'s exact test, which is valid for small expected cell counts',
            'Use a t-test on the cell proportions',
            'Increase alpha to 0.10 to compensate for the small sample'
          ),
          correctAnswer: 'b',
          explanation: 'Chi-square relies on a large-sample approximation. When any expected cell count < 5, the approximation is unreliable. Fisher\'s exact test computes the exact probability and is the correct alternative.',
          orderIndex: 5,
        },
        {
          text: 'What does Cramér\'s V = 0.05 indicate after a chi-square test?',
          options: opts(
            'The test is statistically significant at α = 0.05',
            'There is a very weak association between the two categorical variables (near 0 = no association, 1 = perfect)',
            'Five percent of the variance is explained by the association',
            'The chi-square statistic equals 0.05'
          ),
          correctAnswer: 'b',
          explanation: 'Cramér\'s V is an effect size for chi-square on a 0–1 scale. Rules of thumb: V < 0.1 is negligible, 0.1–0.3 small, 0.3–0.5 moderate, > 0.5 strong. A statistically significant result with V = 0.05 may have no practical importance.',
          orderIndex: 6,
        },
        {
          text: 'When should you prefer Spearman correlation over Pearson?',
          options: opts(
            'When both variables are normally distributed and the relationship is linear',
            'When the data has outliers, is ordinal, or the relationship is monotonic but non-linear',
            'When you want a p-value for the correlation',
            'Spearman is always preferable and Pearson should never be used'
          ),
          correctAnswer: 'b',
          explanation: 'Pearson measures linear correlation and is sensitive to outliers. Spearman is rank-based — it is robust to outliers and captures any monotonic relationship (one increases as the other increases/decreases), not just linear ones.',
          orderIndex: 7,
        },
        {
          text: 'You run 50 simultaneous A/B test variants at α = 0.05. How many false positives do you expect by chance alone?',
          options: opts(
            '0 — α = 0.05 guarantees at most a 5% error rate',
            '2.5 false positives on average (0.05 × 50)',
            '50 — every test will be a false positive',
            '1 — only the first false positive matters'
          ),
          correctAnswer: 'b',
          explanation: 'Each test has a 5% chance of a false positive under H₀. With 50 independent tests, the expected number of false positives = 0.05 × 50 = 2.5. This is why multiple testing correction is essential.',
          orderIndex: 8,
        },
        {
          text: 'What is the difference between Bonferroni and Benjamini-Hochberg corrections?',
          options: opts(
            'Bonferroni adjusts p-values by dividing by n; BH controls the false discovery rate — less conservative and more powerful for large-scale testing',
            'Bonferroni is used for parametric tests; BH for non-parametric',
            'Bonferroni controls Type II error; BH controls Type I error',
            'They are identical — just different names for the same method'
          ),
          correctAnswer: 'a',
          explanation: 'Bonferroni multiplies each p-value by the number of tests (controls family-wise error rate — very conservative). BH controls the False Discovery Rate (expected proportion of false positives among rejected tests) — more powerful for exploratory analytics.',
          orderIndex: 9,
        },
        {
          text: 'What does the Shapiro-Wilk test check, and when is it most useful?',
          options: opts(
            'It tests equal variance between groups — used before ANOVA',
            'It tests whether a sample comes from a normally distributed population — most reliable for n < 2000',
            'It tests for outliers using the interquartile range',
            'It tests the independence of two categorical variables'
          ),
          correctAnswer: 'b',
          explanation: 'Shapiro-Wilk tests H₀: the data are normally distributed. p < 0.05 rejects normality, suggesting you should use a non-parametric test. It is the most powerful normality test for small to medium samples (n < 2000).',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 14 — Working with REST APIs & Web Data
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-14-rest-apis-web-data',
    title:      'Working with REST APIs & Web Data',
    description:'Fetch, authenticate, paginate, and clean data from REST APIs using Python\'s requests library — covering JSON parsing, query parameters, rate limiting, error handling, and real-world patterns used in analytics pipelines.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 114,
    xpReward:   115,
    language:   'python',
    content: `# Working with REST APIs & Web Data

## What You'll Learn
Most production data doesn't live in CSV files — it lives behind APIs: weather services, financial data providers, internal microservices, Google Analytics, Salesforce. This chapter teaches you to reliably fetch, authenticate, paginate, and transform API data into analysis-ready DataFrames.

---

## 1. HTTP & REST Fundamentals

A REST API is a server that responds to HTTP requests. The four methods you'll use:

| Method | Purpose | Example |
|---|---|---|
| GET | Retrieve data | Fetch all users |
| POST | Create a resource | Submit a form |
| PUT/PATCH | Update a resource | Update a user profile |
| DELETE | Remove a resource | Delete a record |

Response codes:
- \`200 OK\` — success
- \`201 Created\` — resource created
- \`400 Bad Request\` — your request is malformed
- \`401 Unauthorized\` — missing/invalid credentials
- \`403 Forbidden\` — valid credentials but no permission
- \`404 Not Found\` — resource doesn't exist
- \`429 Too Many Requests\` — you're being rate-limited
- \`500 Internal Server Error\` — server-side failure

---

## 2. The requests Library

\`\`\`python
import requests

# Basic GET request
response = requests.get('https://api.example.com/data')

# Always check the status code
response.raise_for_status()  # raises HTTPError for 4xx/5xx

# Parse JSON response
data = response.json()
print(type(data))  # usually dict or list
\`\`\`

### Query Parameters

\`\`\`python
# Pass as a dictionary — requests URL-encodes them automatically
params = {
    'start_date': '2024-01-01',
    'end_date':   '2024-03-31',
    'region':     'EMEA',
    'limit':      100,
}
response = requests.get('https://api.example.com/sales', params=params)
print(response.url)
# https://api.example.com/sales?start_date=2024-01-01&end_date=2024-03-31&...
\`\`\`

---

## 3. Authentication Patterns

### API Key (header)
\`\`\`python
import os
API_KEY = os.environ['MY_API_KEY']   # never hardcode secrets!

headers = {'Authorization': f'Bearer {API_KEY}'}
response = requests.get('https://api.example.com/data', headers=headers)
\`\`\`

### API Key (query parameter)
\`\`\`python
response = requests.get(
    'https://api.example.com/data',
    params={'api_key': API_KEY, 'symbol': 'AAPL'}
)
\`\`\`

### HTTP Basic Auth
\`\`\`python
response = requests.get(
    'https://api.example.com/data',
    auth=(os.environ['USERNAME'], os.environ['PASSWORD'])
)
\`\`\`

### OAuth 2.0 Token (most modern APIs)
\`\`\`python
# Step 1: get access token
token_response = requests.post(
    'https://auth.example.com/oauth/token',
    data={
        'grant_type':    'client_credentials',
        'client_id':     os.environ['CLIENT_ID'],
        'client_secret': os.environ['CLIENT_SECRET'],
    }
)
token = token_response.json()['access_token']

# Step 2: use token in requests
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('https://api.example.com/data', headers=headers)
\`\`\`

---

## 4. Pagination

APIs rarely return all records in one request. Common patterns:

### Offset/Limit Pagination
\`\`\`python
import pandas as pd

def fetch_all_offset(base_url: str, headers: dict, page_size: int = 100) -> list:
    records = []
    offset = 0
    while True:
        resp = requests.get(
            base_url,
            headers=headers,
            params={'limit': page_size, 'offset': offset}
        )
        resp.raise_for_status()
        batch = resp.json().get('data', [])
        if not batch:
            break
        records.extend(batch)
        offset += page_size
        if len(batch) < page_size:    # last page
            break
    return records

all_records = fetch_all_offset('https://api.example.com/orders', headers)
df = pd.DataFrame(all_records)
\`\`\`

### Cursor / Next-Page Token Pagination
\`\`\`python
def fetch_all_cursor(base_url: str, headers: dict) -> list:
    records = []
    params  = {'limit': 200}
    while True:
        resp = requests.get(base_url, headers=headers, params=params)
        resp.raise_for_status()
        body   = resp.json()
        records.extend(body['items'])
        cursor = body.get('next_cursor')     # None on last page
        if not cursor:
            break
        params['cursor'] = cursor
    return records
\`\`\`

---

## 5. Rate Limiting & Retries

\`\`\`python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def build_resilient_session(
    retries: int = 3,
    backoff_factor: float = 1.0,
    retry_on: tuple = (429, 500, 502, 503, 504)
) -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=retries,
        backoff_factor=backoff_factor,   # waits 1s, 2s, 4s between retries
        status_forcelist=retry_on,
        allowed_methods=['GET', 'POST'],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('https://', adapter)
    session.mount('http://', adapter)
    return session

session = build_resilient_session()

# Polite rate limiting: sleep between requests
def get_with_rate_limit(url: str, delay: float = 0.5, **kwargs):
    response = session.get(url, **kwargs)
    response.raise_for_status()
    time.sleep(delay)   # be a good citizen
    return response
\`\`\`

---

## 6. Parsing Nested JSON into a DataFrame

\`\`\`python
import json
import pandas as pd

# Typical API response with nested structure
sample_response = {
    "meta": {"total": 2, "page": 1},
    "orders": [
        {"id": 1, "customer": {"name": "Alice", "tier": "Gold"},
         "items": [{"sku": "A1", "qty": 2, "price": 29.99}],
         "total": 59.98, "date": "2024-03-15"},
        {"id": 2, "customer": {"name": "Bob", "tier": "Silver"},
         "items": [{"sku": "B2", "qty": 1, "price": 49.99}],
         "total": 49.99, "date": "2024-03-16"},
    ]
}

# Flatten nested customer dict
df = pd.json_normalize(
    sample_response['orders'],
    meta=['id', 'total', 'date'],
    record_path='items',             # expand the items list
    record_prefix='item_',
    meta_prefix='order_',
    errors='ignore'
)
df['order_date'] = pd.to_datetime(df['order_date'])
print(df.columns.tolist())
# ['item_sku', 'item_qty', 'item_price', 'order_id', 'order_total', 'order_date', ...]
\`\`\`

---

## 7. Error Handling Best Practices

\`\`\`python
from requests.exceptions import HTTPError, ConnectionError, Timeout

def safe_fetch(url: str, **kwargs) -> dict | None:
    try:
        resp = session.get(url, timeout=10, **kwargs)
        resp.raise_for_status()
        return resp.json()
    except HTTPError as e:
        print(f"HTTP {e.response.status_code} for {url}: {e}")
        return None
    except ConnectionError:
        print(f"Network unreachable: {url}")
        return None
    except Timeout:
        print(f"Request timed out: {url}")
        return None
    except json.JSONDecodeError:
        print(f"Response is not valid JSON: {url}")
        return None
\`\`\`

---

## 8. Real-World Pattern: Daily API Ingest Pipeline

\`\`\`python
import pandas as pd
import requests, os, time, json
from datetime import date, timedelta

BASE_URL = 'https://api.analytics.example.com/v2'
HEADERS  = {'Authorization': f'Bearer {os.environ["API_TOKEN"]}'}
OUTPUT   = 'data/daily_events.parquet'

def ingest_day(target_date: date) -> pd.DataFrame:
    records = []
    cursor  = None
    while True:
        params = {'date': str(target_date), 'limit': 500}
        if cursor:
            params['cursor'] = cursor
        resp = requests.get(f'{BASE_URL}/events', headers=HEADERS, params=params, timeout=15)
        resp.raise_for_status()
        body = resp.json()
        records.extend(body['events'])
        cursor = body.get('next_cursor')
        if not cursor:
            break
        time.sleep(0.3)
    return pd.DataFrame(records)

# Ingest last 7 days
frames = []
for i in range(7):
    d = date.today() - timedelta(days=i+1)
    print(f"Ingesting {d}…")
    frames.append(ingest_day(d))

df_all = pd.concat(frames, ignore_index=True)
df_all['event_ts'] = pd.to_datetime(df_all['event_ts'])
df_all.to_parquet(OUTPUT, index=False)
print(f"Saved {len(df_all):,} rows to {OUTPUT}")
\`\`\`

---

## Key Takeaways

- **Never hardcode secrets** — use environment variables or a secrets manager.
- **Always call \`raise_for_status()\`** immediately after \`.get()\` — don't silently swallow HTTP errors.
- **Paginate completely** — most APIs cap results at 100-500 per page; missing pages = missing data.
- **Use \`Retry\` with exponential backoff** — transient failures are normal; resilient code handles them automatically.
- **\`pd.json_normalize()\`** is the cleanest way to flatten nested JSON into a tabular DataFrame.
- **Output to Parquet**, not CSV — faster reads, column-level compression, dtype preservation.
`,
    codeExample: `import requests, os, time, json
import pandas as pd
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ── Resilient session ────────────────────────────────────────────────────
def build_session(retries=3, backoff=1.0):
    s = requests.Session()
    r = Retry(total=retries, backoff_factor=backoff,
              status_forcelist=[429, 500, 503])
    s.mount('https://', HTTPAdapter(max_retries=r))
    return s

session = build_session()
HEADERS = {'Authorization': f'Bearer {os.environ.get("API_KEY","demo")}'}

# ── Cursor-paginated fetch ───────────────────────────────────────────────
def fetch_all(url: str, params: dict | None = None) -> list:
    records, params = [], params or {}
    while True:
        resp = session.get(url, headers=HEADERS, params=params, timeout=10)
        resp.raise_for_status()
        body = resp.json()
        records.extend(body.get('items', body if isinstance(body, list) else []))
        cursor = body.get('next_cursor') if isinstance(body, dict) else None
        if not cursor:
            break
        params = {**params, 'cursor': cursor}
        time.sleep(0.25)
    return records

# ── Flatten nested JSON response ────────────────────────────────────────
sample = [
    {'id': 1, 'user': {'id': 'u1', 'country': 'US'}, 'event': 'purchase', 'value': 49.99},
    {'id': 2, 'user': {'id': 'u2', 'country': 'GB'}, 'event': 'signup',   'value': 0.0},
]
df = pd.json_normalize(sample, sep='_')
print(df)
#    id user_id user_country     event  value
# 0   1      u1           US  purchase  49.99
# 1   2      u2           GB    signup   0.00`,
    quiz: {
      title: 'Working with REST APIs & Web Data — Quiz',
      questions: [
        {
          text: 'Why should you use os.environ["API_KEY"] instead of writing the API key directly in your Python script?',
          options: opts(
            'Environment variables are faster to read than string literals',
            'Hardcoded secrets get committed to version control and become a security vulnerability — environment variables keep secrets out of code',
            'The requests library only reads API keys from environment variables',
            'Environment variables automatically rotate API keys for security'
          ),
          correctAnswer: 'b',
          explanation: 'Hardcoded secrets in source code get committed to git repositories and can be exposed publicly. Environment variables, secrets managers (AWS Secrets Manager, Vault), or .env files (git-ignored) are the safe alternatives.',
          orderIndex: 1,
        },
        {
          text: 'What does response.raise_for_status() do?',
          options: opts(
            'It raises a Python exception if the response JSON is malformed',
            'It raises an HTTPError exception if the status code indicates a client (4xx) or server (5xx) error',
            'It retries the request automatically on failure',
            'It raises a warning if the response is larger than 1 MB'
          ),
          correctAnswer: 'b',
          explanation: 'raise_for_status() checks the HTTP status code and raises requests.exceptions.HTTPError for 4xx and 5xx responses. Without it, you might silently process an error response as if it were data.',
          orderIndex: 2,
        },
        {
          text: 'An API returns a "next_cursor" field in each response. What does this indicate?',
          options: opts(
            'The request was processed asynchronously and the cursor points to a job ID',
            'The API uses cursor-based pagination — you must pass the cursor value in the next request to retrieve the following page',
            'The API is rate-limiting you and will resume after the cursor expires',
            'The cursor is a timestamp of the last record returned'
          ),
          correctAnswer: 'b',
          explanation: 'Cursor-based pagination returns an opaque token (the cursor) pointing to the next page. You include it in your next request via a query parameter like ?cursor=..., continuing until next_cursor is null/absent.',
          orderIndex: 3,
        },
        {
          text: 'HTTP status code 429 means:',
          options: opts(
            'The resource was not found at the given URL',
            'You are sending requests too frequently — the server is rate-limiting you',
            'Your request is malformed or missing required parameters',
            'The server encountered an internal error'
          ),
          correctAnswer: 'b',
          explanation: '429 Too Many Requests indicates you have exceeded the API\'s rate limit. The correct response is to implement exponential backoff (wait, then retry with increasing delays) or reduce your request frequency.',
          orderIndex: 4,
        },
        {
          text: 'What is the purpose of backoff_factor in requests.adapters.Retry?',
          options: opts(
            'It sets the maximum number of retry attempts',
            'It controls the exponentially growing wait time between retries — e.g., factor=1 means waits of 1s, 2s, 4s',
            'It sets the timeout for each individual request',
            'It controls how many concurrent connections are allowed'
          ),
          correctAnswer: 'b',
          explanation: 'With backoff_factor=1.0, the waits between retries are {1, 2, 4, 8, ...} seconds. Exponential backoff prevents thundering-herd problems when a server is recovering from overload.',
          orderIndex: 5,
        },
        {
          text: 'You receive a deeply nested JSON like {"orders": [{"customer": {"name": "Alice"}, "items": [...]}]}. Which Pandas function flattens this most elegantly?',
          options: opts(
            'pd.DataFrame(data)',
            'pd.json_normalize(data, record_path="items", meta=[...])',
            'pd.read_json(json.dumps(data))',
            'df.explode("orders")'
          ),
          correctAnswer: 'b',
          explanation: 'pd.json_normalize() traverses nested dicts (sep="_" joins key paths) and can expand list fields via record_path while keeping parent fields via meta. It handles most real-world API response shapes.',
          orderIndex: 6,
        },
        {
          text: 'Why should you output API ingestion results to Parquet rather than CSV?',
          options: opts(
            'Parquet is a text format that is easier to read than CSV',
            'Parquet is a columnar binary format that preserves dtypes (datetime, category, int), compresses much smaller, and reads faster — especially for large datasets',
            'CSV files cannot store more than 1 million rows',
            'Parquet is required by most cloud data warehouses'
          ),
          correctAnswer: 'b',
          explanation: 'Parquet preserves dtypes (no parsing on read), achieves 5-10x compression vs CSV, and reads 3-10x faster due to columnar storage and predicate pushdown. It is the standard format for analytics pipelines.',
          orderIndex: 7,
        },
        {
          text: 'What is the difference between API key authentication and OAuth 2.0 client credentials?',
          options: opts(
            'API keys are more secure than OAuth tokens',
            'API keys are static tokens sent in headers/params; OAuth 2.0 issues short-lived access tokens from an auth server — more secure since tokens expire and can be scoped',
            'OAuth 2.0 only works for browser-based applications',
            'API keys require a username and password while OAuth does not'
          ),
          correctAnswer: 'b',
          explanation: 'API keys are static and must be rotated manually when compromised. OAuth 2.0 access tokens expire (typically 1 hour), are scoped to specific permissions, and can be revoked — making them significantly more secure for production systems.',
          orderIndex: 8,
        },
        {
          text: 'What does passing params={"limit": 100, "offset": 200} in requests.get() do?',
          options: opts(
            'It sends those values in the HTTP request body as JSON',
            'It appends ?limit=100&offset=200 to the URL as query string parameters',
            'It sets headers Limit: 100 and Offset: 200',
            'It configures a 100-item limit on the response and a 200ms timeout'
          ),
          correctAnswer: 'b',
          explanation: 'The params dict is URL-encoded and appended as a query string. This is the standard way to pass filter, pagination, and configuration parameters to a REST GET endpoint.',
          orderIndex: 9,
        },
        {
          text: 'Your pagination loop collects 500 records but the API says "total": 1500. What is the most likely bug?',
          options: opts(
            'The API is returning duplicates that need to be dropped',
            'The loop is breaking too early — either the "no more pages" condition is wrong, or the cursor/offset is not being updated correctly',
            'The API is applying a server-side filter you did not request',
            'pd.DataFrame() truncates lists to 500 rows by default'
          ),
          correctAnswer: 'b',
          explanation: 'The most common pagination bug is an incorrect stop condition or failure to update the cursor/offset between requests. Print the cursor/offset at each iteration and verify you are advancing through pages correctly.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 15 — Git & Version Control for Data Analysts
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-15-git-version-control',
    title:      'Git & Version Control for Data Analysts',
    description:'Master Git branching, pull requests, .gitignore for data projects, notebook diffing, commit hygiene, and the collaborative analytics workflow used in engineering-grade data teams at Google, Microsoft, and Meta.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 115,
    xpReward:   110,
    language:   'python',
    content: `# Git & Version Control for Data Analysts

## What You'll Learn
At top firms, analysts work in teams where every change is tracked, reviewed, and reversible. Git is not optional — it is the collaboration infrastructure. This chapter teaches the Git workflow that makes your analytics code reviewable, reproducible, and resilient to mistakes.

---

## 1. Why Analysts Need Git

- **Reproducibility**: anyone can checkout the exact state of the code that produced a report
- **Collaboration**: multiple analysts work on the same codebase without overwriting each other
- **History**: every change is logged — you can answer "who changed this and why?"
- **Rollback**: break something? Revert in seconds
- **Review**: pull requests gate changes through a review process — critical for regulatory compliance

---

## 2. The Core Mental Model

Git tracks a **directed acyclic graph of snapshots** (commits). Each commit is a full snapshot of every tracked file, linked to its parent commit.

\`\`\`
main:  A ── B ── C ── D
                 \\
feature:          E ── F
\`\`\`

- **Working tree**: the files on your disk
- **Index (staging area)**: files you've \`git add\`-ed — the next commit's content
- **HEAD**: the commit you are currently on (tip of the active branch)

---

## 3. Essential Commands

\`\`\`bash
# ── Daily workflow ──────────────────────────────────────────────────
git status                          # what has changed?
git diff                            # unstaged changes
git diff --staged                   # staged changes (what will be committed)

git add analysis/revenue_model.py   # stage a specific file
git add -p                          # interactively stage hunks (not whole files)
git commit -m "feat: add MoM growth calculation to revenue model"

# ── Branch management ───────────────────────────────────────────────
git checkout -b feature/cohort-analysis   # create + switch to new branch
git branch                                # list branches
git checkout main                         # switch back to main
git merge feature/cohort-analysis         # merge when done
git branch -d feature/cohort-analysis     # delete merged branch

# ── Remote operations ───────────────────────────────────────────────
git pull --rebase origin main       # sync with remote (rebase keeps history linear)
git push origin feature/cohort-analysis   # push your branch

# ── Undoing changes ─────────────────────────────────────────────────
git restore filename.py             # discard unstaged changes (irreversible!)
git restore --staged filename.py    # unstage a file (keeps disk changes)
git revert HEAD                     # create a new commit that undoes the last commit (safe!)
git stash                           # temporarily shelve uncommitted changes
git stash pop                       # restore stashed changes
\`\`\`

---

## 4. Commit Message Conventions

Good commits are small and describe *why*, not what. Use **Conventional Commits**:

\`\`\`
<type>(<scope>): <short summary>

feat(revenue): add MoM % growth to monthly summary
fix(etl): handle null values in customer_id column
docs(readme): update data dictionary with new schema
refactor(pipeline): extract date parsing into helper function
test(cohort): add edge case for single-day cohorts
chore(deps): upgrade pandas from 1.5 to 2.0
\`\`\`

**Rules:**
- Limit subject line to 72 characters
- Use imperative mood: "add" not "added", "fix" not "fixing"
- If needed, add a blank line then a body explaining the "why"
- Reference a ticket: \`fix(etl): handle null customer_id (closes #142)\`

---

## 5. .gitignore for Data Projects

\`\`\`gitignore
# ── Data files (too large for git; use DVC or S3) ──────────────────
data/raw/
data/processed/
*.csv
*.parquet
*.xlsx
*.db
*.sqlite

# ── Secrets & credentials ──────────────────────────────────────────
.env
*.pem
secrets.json
credentials.yaml

# ── Python ─────────────────────────────────────────────────────────
__pycache__/
*.pyc
*.egg-info/
.venv/
venv/

# ── Jupyter ─────────────────────────────────────────────────────────
.ipynb_checkpoints/
# Track .ipynb files but strip outputs before committing (see below)

# ── OS & Editor ─────────────────────────────────────────────────────
.DS_Store
Thumbs.db
.vscode/
*.swp

# ── Reports & generated artefacts ──────────────────────────────────
reports/
*.html
*.pdf
\`\`\`

**Data in git is an anti-pattern** — CSV files grow over time, clutter the history, and expose sensitive data. Store data in S3/GCS/Azure Blob or use DVC (Data Version Control) to track large files.

---

## 6. Notebook Version Control

Jupyter notebooks store outputs (images, DataFrames) as JSON in the .ipynb file, causing massive diffs. Two strategies:

### Strategy A: Strip outputs before committing
\`\`\`bash
# Install nbstripout
pip install nbstripout

# Configure as a git filter (one-time per repo)
nbstripout --install

# Now every git commit automatically strips outputs
# Teammates see clean diffs of just the code cells
\`\`\`

### Strategy B: Convert to .py before committing
\`\`\`bash
jupyter nbconvert --to script analysis.ipynb
git add analysis.py   # commit the script, not the notebook
\`\`\`

### Viewing notebook diffs
\`\`\`bash
# Install nbdiff (part of nbformat)
pip install nbdime
nbdime config-git --enable   # integrates with git diff and git log
git diff HEAD~1 analysis.ipynb   # readable cell-by-cell diff
\`\`\`

---

## 7. The Pull Request Workflow

The PR workflow prevents untested code from reaching production:

\`\`\`
1. git checkout -b feature/rfm-segmentation
2. [work, commit frequently with meaningful messages]
3. git push origin feature/rfm-segmentation
4. Open a Pull Request on GitHub/GitLab:
   - Title: "feat(customers): add RFM segmentation with 5-tier scoring"
   - Description: what changed, why, how to test
   - Link to relevant Jira/Linear ticket
5. Request review from a peer
6. Address review comments → push new commits to the same branch
7. Reviewer approves → merge (preferably squash-merge for a clean history)
8. Delete the branch
\`\`\`

---

## 8. Resolving Merge Conflicts

Conflicts happen when two branches change the same line. Git marks them:

\`\`\`python
<<<<<<< HEAD
revenue_threshold = 1000   # your change
=======
revenue_threshold = 1500   # teammate's change
>>>>>>> feature/revenue-update
\`\`\`

Resolution steps:
1. Open the file in your editor
2. Delete the conflict markers (\`<<<\`, \`===\`, \`>>>\`) and choose the correct content
3. \`git add the_file.py\`
4. \`git commit\` (Git pre-fills the merge commit message)

---

## 9. Useful Aliases & Shortcuts

\`\`\`bash
# Add to ~/.gitconfig
[alias]
    st    = status
    lg    = log --oneline --graph --all --decorate
    undo  = restore --staged
    alias = config --get-regexp alias
    recent = for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(committerdate:relative)'
\`\`\`

---

## 10. Git for Reproducible Analysis

\`\`\`python
# In your analysis scripts — record the commit hash used to produce results
import subprocess
import pandas as pd

def get_git_commit() -> str:
    try:
        return subprocess.check_output(
            ['git', 'rev-parse', '--short', 'HEAD'],
            stderr=subprocess.DEVNULL
        ).decode().strip()
    except Exception:
        return 'unknown'

commit = get_git_commit()
results = run_analysis()
results['git_commit'] = commit   # embed in output for traceability
results.to_parquet(f'output/results_{commit}.parquet')
print(f"Results saved (git commit: {commit})")
\`\`\`

---

## Key Takeaways

- **Branch for every feature** — \`main\` is always deployable; all work happens on feature branches.
- **Commit early, commit often** — small commits are easier to review, revert, and understand.
- **Write meaningful commit messages** — future-you (and your teammates) will thank you.
- **Never commit secrets or large data files** — use environment variables and .gitignore.
- **Strip notebook outputs** with \`nbstripout\` before committing — clean diffs are reviewable diffs.
- **Use pull requests** — code review is how analytics teams maintain quality and share knowledge.
`,
    codeExample: `# ── Git workflow for a data analytics project ───────────────────────
# This script demonstrates how to embed reproducibility metadata
# and automate pre-commit checks.

import subprocess
import os
import pandas as pd
from datetime import datetime

def get_git_info() -> dict:
    """Capture the current git state for reproducibility."""
    def run(cmd):
        try:
            return subprocess.check_output(
                cmd.split(), stderr=subprocess.DEVNULL
            ).decode().strip()
        except Exception:
            return 'unknown'

    return {
        'commit_hash':   run('git rev-parse HEAD'),
        'commit_short':  run('git rev-parse --short HEAD'),
        'branch':        run('git rev-parse --abbrev-ref HEAD'),
        'commit_date':   run('git log -1 --format=%ci'),
        'has_changes':   run('git status --porcelain') != '',
    }

def save_with_metadata(df: pd.DataFrame, path: str) -> None:
    """Save a DataFrame with embedded git + run metadata."""
    git = get_git_info()
    meta = {
        'git_commit':   git['commit_short'],
        'git_branch':   git['branch'],
        'run_timestamp': datetime.utcnow().isoformat(),
        'rows':          len(df),
        'dirty_working_tree': git['has_changes'],
    }
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_parquet(path, index=False)
    import json
    with open(path.replace('.parquet', '_meta.json'), 'w') as f:
        json.dump(meta, f, indent=2)
    print(f"Saved {len(df):,} rows → {path}")
    print(f"Git commit: {git['commit_short']} ({git['branch']})")
    if git['has_changes']:
        print("  ⚠ Warning: working tree has uncommitted changes")

# Usage
df = pd.DataFrame({'x': range(10), 'y': range(10, 20)})
save_with_metadata(df, 'output/analysis_results.parquet')`,
    quiz: {
      title: 'Git & Version Control for Data Analysts — Quiz',
      questions: [
        {
          text: 'What is the correct order of operations when committing a change to a specific file?',
          options: opts(
            'git commit → git add → git push',
            'git add <file> → git commit -m "message" → git push',
            'git diff → git push → git commit',
            'git status → git push → git add'
          ),
          correctAnswer: 'b',
          explanation: 'git add stages the file (moves changes to the index), git commit records the snapshot, and git push uploads commits to the remote. The order matters — you cannot commit unstaged changes.',
          orderIndex: 1,
        },
        {
          text: 'What does git stash do?',
          options: opts(
            'Permanently deletes uncommitted changes',
            'Temporarily shelves uncommitted working-tree changes so you can switch branches with a clean state, then restores them later with git stash pop',
            'Commits changes without a message for later',
            'Moves uncommitted changes to a new branch'
          ),
          correctAnswer: 'b',
          explanation: 'git stash saves dirty working-tree changes to a stack and restores a clean state. git stash pop re-applies the most recent stash. Useful when you need to urgently switch branches without committing incomplete work.',
          orderIndex: 2,
        },
        {
          text: 'Why is committing large CSV or Parquet data files to git an anti-pattern?',
          options: opts(
            'Git cannot open binary files like Parquet',
            'Data files balloon the repository size, slow down cloning, clutter history, and can expose sensitive data — use S3/GCS or DVC instead',
            'CSV files corrupt the git index',
            'GitHub has a strict 100-row limit on committed CSV files'
          ),
          correctAnswer: 'b',
          explanation: 'Git stores every version of every file forever. Large data files multiply the repo size quickly, make cloning slow, and sensitive data cannot be expunged without rewriting history. Store data in object storage and reference it.',
          orderIndex: 3,
        },
        {
          text: 'What is the purpose of nbstripout in a data science workflow?',
          options: opts(
            'It converts Jupyter notebooks to Python scripts automatically',
            'It removes cell outputs (plots, DataFrames, printed values) from notebooks before committing, producing readable code-only diffs',
            'It validates that notebook cells run without errors before allowing a commit',
            'It compresses notebooks to reduce their file size'
          ),
          correctAnswer: 'b',
          explanation: 'Notebook outputs (images, long DataFrames) are stored as base64 JSON inside .ipynb, creating unreadable multi-kilobyte diffs. nbstripout acts as a git filter that strips outputs before staging, giving reviewers clean code diffs.',
          orderIndex: 4,
        },
        {
          text: 'Using Conventional Commits, which message correctly represents fixing a null-handling bug in the ETL pipeline?',
          options: opts(
            'fixed null bug in ETL',
            'fix(etl): handle null customer_id values in order ingestion',
            'BUG: null customer_id was breaking the ETL',
            'update etl.py to fix null values'
          ),
          correctAnswer: 'b',
          explanation: 'Conventional Commits format: <type>(<scope>): <summary>. Type "fix" indicates a bug fix, scope "etl" scopes it to the ETL component, and the summary is imperative, specific, and under 72 characters.',
          orderIndex: 5,
        },
        {
          text: 'What does git revert HEAD do, and why is it preferred over git reset --hard HEAD~1?',
          options: opts(
            'revert is faster; reset is more accurate',
            'revert creates a new commit that undoes the last commit, preserving the full history — reset destructively removes the commit from history, which breaks shared branches',
            'They are equivalent — both remove the last commit',
            'revert works only on remote branches; reset works only locally'
          ),
          correctAnswer: 'b',
          explanation: 'git revert is safe for shared branches because it adds a new "undo" commit without modifying history. git reset --hard rewrites history, which forces your teammates to rebase — dangerous on shared branches.',
          orderIndex: 6,
        },
        {
          text: 'At what stage of the pull request workflow does code review happen?',
          options: opts(
            'Before you push your branch to the remote',
            'After you push your feature branch and open a PR — teammates review the diff and leave comments before the branch is merged',
            'After merging, to document what was changed',
            'During git commit, using pre-commit hooks'
          ),
          correctAnswer: 'b',
          explanation: 'The PR is opened after pushing the feature branch. Reviewers inspect the diff, leave comments, and approve or request changes. Only after approval is the branch merged to main. This gates all changes through human review.',
          orderIndex: 7,
        },
        {
          text: 'You see this in a file: <<<<<<< HEAD / code_A / ======= / code_B / >>>>>>> feature/branch. What does this indicate?',
          options: opts(
            'The file has two versions saved for comparison',
            'A merge conflict — HEAD has code_A and the feature branch has code_B on the same lines; you must manually resolve which to keep',
            'The file is encrypted with two layers of protection',
            'The file has syntax errors on those lines'
          ),
          correctAnswer: 'b',
          explanation: 'Git conflict markers show the two competing versions. Everything between <<<<<<< HEAD and ======= is the current branch\'s version; below ======= to >>>>>>> is the incoming branch. You must edit the file, remove all markers, and keep the correct content.',
          orderIndex: 8,
        },
        {
          text: 'What does git pull --rebase origin main do, compared to plain git pull?',
          options: opts(
            'It downloads changes but does not apply them until you manually merge',
            'It fetches new commits from origin/main and replays your local commits on top, producing a linear history instead of a merge commit',
            'It rebases the remote branch onto your local branch',
            'It downloads and immediately pushes your local commits'
          ),
          correctAnswer: 'b',
          explanation: 'Plain git pull performs a merge, creating a merge commit that can clutter history. --rebase replays your commits on top of the updated main, producing a clean linear history — preferred in most analytics team workflows.',
          orderIndex: 9,
        },
        {
          text: 'Why is embedding the git commit hash in your analysis output files a best practice?',
          options: opts(
            'It encrypts the output files with the commit hash as a key',
            'It allows you to exactly reproduce the results later by checking out that specific commit — critical for audits, debugging, and regulatory compliance',
            'GitHub automatically validates output files using the embedded hash',
            'It reduces the file size by replacing code with a shorter hash reference'
          ),
          correctAnswer: 'b',
          explanation: 'A commit hash uniquely identifies the exact code state at run time. Embedding it in output files means you can always trace a result back to the code that produced it — essential for reproducibility, debugging discrepancies, and compliance audits.',
          orderIndex: 10,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 3 (Chapters 11–15)…');

  // Resolve the Data Analytics course
  const course = await prisma.course.findFirst({
    where: { slug: 'data-analytics' },
    select: { id: true },
  });
  if (!course) throw new Error('Course "data-analytics" not found — run base seed first.');

  for (const ch of CHAPTERS) {
    const existing = await prisma.chapter.findFirst({
      where: { courseId: course.id, slug: ch.slug },
      select: { id: true },
    });

    if (existing) {
      console.log(`  ⏭   Skipping "${ch.title}" (already exists)`);
      continue;
    }

    console.log(`  ✍   Creating "${ch.title}" (orderIndex ${ch.orderIndex})…`);

    const chapter = await prisma.chapter.create({
      data: {
        courseId:    course.id,
        slug:        ch.slug,
        title:       ch.title,
        description: ch.description,
        difficulty:  ch.difficulty,
        tier:        ch.tier,
        orderIndex:  ch.orderIndex,
        xpReward:    ch.xpReward,
        language:    ch.language,
        content:     ch.content,
        codeExample: ch.codeExample,
        isPublished: true,
      },
    });

    const quiz = await prisma.quiz.create({
      data: {
        chapterId:    chapter.id,
        title:        ch.quiz.title,
        description:  `Test your understanding of ${ch.title}`,
        timeLimit:    600,
        passingScore: 70,
        xpReward:     Math.round(ch.xpReward * 0.5),
      },
    });

    for (const q of ch.quiz.questions) {
      await prisma.question.create({
        data: {
          quizId:        quiz.id,
          text:          q.text,
          options:       q.options,
          correctAnswer: q.correctAnswer,
          explanation:   q.explanation,
          orderIndex:    q.orderIndex,
        },
      });
    }

    console.log(`     ✅  Created with ${ch.quiz.questions.length} quiz questions`);
  }

  console.log('\n🎉  AMATEUR Block 3 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
