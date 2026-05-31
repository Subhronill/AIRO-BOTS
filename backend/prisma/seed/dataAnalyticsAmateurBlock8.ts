import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function opts(a: string, b: string, c: string, d: string): string {
  return JSON.stringify([
    { id: 'a', text: a },
    { id: 'b', text: b },
    { id: 'c', text: c },
    { id: 'd', text: d },
  ]);
}

const CHAPTERS = [

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 36 — Power BI & DAX for Analytics
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-36-power-bi-dax',
    title:      'Power BI & DAX for Analytics',
    description: 'Master Power BI data modeling, DAX measures, and time intelligence — the skills that make you effective in any enterprise analytics environment.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 136,
    xpReward:   120,
    language:   'sql',
    codeExample: `-- DAX: Core patterns every analyst must know

-- 1. Basic measure (always uses SUM/AVERAGE/etc. over the filter context)
Total Revenue = SUM(Sales[Revenue])

-- 2. CALCULATE — changes the filter context (the most important DAX function)
Revenue USA = CALCULATE([Total Revenue], Sales[Country] = "USA")
Revenue YTD = CALCULATE([Total Revenue], DATESYTD('Date'[Date]))

-- 3. Time intelligence
Revenue LY  = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]))
Revenue MoM% = DIVIDE([Total Revenue] - [Revenue LY], [Revenue LY])

-- 4. ALL — removes filters (used for % of total)
Revenue % of Total =
DIVIDE(
    [Total Revenue],
    CALCULATE([Total Revenue], ALL(Sales))
)

-- 5. RANKX — ranking within a filtered context
Product Rank =
RANKX(ALL(Products[ProductName]), [Total Revenue], , DESC, Dense)`,
    content: `# Power BI & DAX for Analytics

Power BI is Microsoft's business intelligence platform used by 97% of Fortune 500 companies. DAX (Data Analysis Expressions) is the formula language powering Power BI, Analysis Services, and Excel Power Pivot. Mastering DAX is one of the highest-ROI skills for a data analyst — it unlocks enterprise-scale self-serve analytics.

## Power BI Architecture

\`\`\`
Data Sources → Power Query (ETL) → Data Model → DAX Measures → Visuals
     SQL           M language      Star Schema    Calculations   Reports/Dashboards
     Excel         Transform/Load  Relationships  KPIs           Mobile Apps
     API
\`\`\`

## The Star Schema in Power BI

Power BI performs best with a **star schema** — fact tables surrounded by dimension tables:

\`\`\`
         DimDate          DimCustomer
            |                  |
            └──── FactSales ───┘
                      |
                 DimProduct
\`\`\`

**Fact table:** Contains numeric measures (Revenue, Quantity, Cost) and foreign keys
**Dimension tables:** Contain descriptive attributes (Date, Customer Name, Product Category)

Rules:
- One-to-many relationships from dimension to fact
- Mark your date table as a Date Table for time intelligence to work
- Avoid many-to-many relationships where possible

## DAX Fundamentals

DAX expressions evaluate within a **filter context** — the current set of active filters from slicers, rows, columns, and other visuals.

### Measures vs Calculated Columns

| | Measure | Calculated Column |
|--|---------|-------------------|
| **When calculated** | At query time | At data refresh |
| **Storage** | Not stored (dynamic) | Stored in model |
| **Context** | Row + filter context | Row context only |
| **Use for** | KPIs, aggregations | Row-level attributes |

\`\`\`
-- Calculated Column (adds to every row in the table)
Profit Margin % = DIVIDE(Sales[Profit], Sales[Revenue])

-- Measure (aggregates dynamically based on filters)
Total Revenue = SUM(Sales[Revenue])
Average Order Value = DIVIDE([Total Revenue], DISTINCTCOUNT(Sales[OrderID]))
\`\`\`

## CALCULATE — The Most Important DAX Function

CALCULATE evaluates an expression in a modified filter context. It is the key to almost every advanced DAX pattern.

\`\`\`
-- Basic CALCULATE: apply a filter
Online Revenue = CALCULATE([Total Revenue], Sales[Channel] = "Online")

-- Remove all filters on a table (for % of total)
Revenue % of Total =
DIVIDE(
    [Total Revenue],
    CALCULATE([Total Revenue], ALL(Sales))
)

-- Remove filters on specific columns only
Revenue % of Category =
DIVIDE(
    [Total Revenue],
    CALCULATE([Total Revenue], ALLEXCEPT(Sales, Sales[Category]))
)

-- Multiple filter conditions
High-Value Online =
CALCULATE(
    [Total Revenue],
    Sales[Channel] = "Online",
    Sales[Revenue] > 1000
)
\`\`\`

## Time Intelligence Functions

Time intelligence requires a proper date dimension table marked as a Date Table.

\`\`\`
-- Year-to-date
Revenue YTD = CALCULATE([Total Revenue], DATESYTD('Date'[Date]))

-- Same period last year
Revenue LY = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]))

-- Month-over-month growth %
Revenue MoM% =
VAR CurrentRevenue = [Total Revenue]
VAR PrevRevenue    = CALCULATE([Total Revenue], DATEADD('Date'[Date], -1, MONTH))
RETURN DIVIDE(CurrentRevenue - PrevRevenue, PrevRevenue)

-- Rolling 3-month average
Revenue 3M Avg =
CALCULATE(
    AVERAGEX(
        VALUES('Date'[Month]),
        [Total Revenue]
    ),
    DATESINPERIOD('Date'[Date], LASTDATE('Date'[Date]), -3, MONTH)
)

-- Quarter-to-date
Revenue QTD = CALCULATE([Total Revenue], DATESQTD('Date'[Date]))
\`\`\`

## RANKX and Ranking Patterns

\`\`\`
-- Rank products by revenue (1 = highest)
Product Revenue Rank =
RANKX(
    ALL(DimProduct[ProductName]),
    [Total Revenue],
    ,
    DESC,
    Dense    -- Dense = no gaps in ranking; Skip = gaps allowed
)

-- Top N filter using RANKX
Top 10 Products Revenue =
CALCULATE(
    [Total Revenue],
    TOPN(10, ALL(DimProduct[ProductName]), [Total Revenue])
)
\`\`\`

## Variables (VAR) — Cleaner, Faster DAX

Variables evaluate once and can be reused — essential for complex measures:

\`\`\`
Customer LTV Score =
VAR AvgOrderValue  = AVERAGE(Sales[Revenue])
VAR PurchaseFreq   = COUNTROWS(Sales) / DISTINCTCOUNT(Sales[CustomerID])
VAR AvgLifeMonths  = 24
VAR LTV            = AvgOrderValue * PurchaseFreq * AvgLifeMonths
VAR BenchmarkLTV   = 500
RETURN
    SWITCH(
        TRUE(),
        LTV > BenchmarkLTV * 2,  "Champions",
        LTV > BenchmarkLTV,      "Loyalists",
        LTV > BenchmarkLTV / 2,  "At Risk",
        "Lost"
    )
\`\`\`

## Cumulative / Running Totals

\`\`\`
Revenue Cumulative =
CALCULATE(
    [Total Revenue],
    FILTER(
        ALL('Date'[Date]),
        'Date'[Date] <= MAX('Date'[Date])
    )
)
\`\`\`

## Power Query (M Language) — ETL in Power BI

\`\`\`
// Typical M transformation pipeline
let
    Source        = Sql.Database("server", "database"),
    RawTable      = Source{[Schema="dbo", Item="Sales"]}[Data],
    FilteredRows  = Table.SelectRows(RawTable, each [Date] >= #date(2023,1,1)),
    AddedRevenue  = Table.AddColumn(FilteredRows, "Revenue",
                        each [Quantity] * [UnitPrice], type number),
    RenamedCols   = Table.RenameColumns(AddedRevenue,
                        {{"CustomerKey","customer_id"},
                         {"ProductKey","product_id"}}),
    ChangedTypes  = Table.TransformColumnTypes(RenamedCols,
                        {{"Revenue", type number}, {"Date", type date}})
in
    ChangedTypes
\`\`\`

## Power BI Performance Best Practices

| Issue | Fix |
|-------|-----|
| Slow visuals | Use measures instead of calculated columns for aggregations |
| Large model | Import only needed columns; use integer keys not string keys |
| Slow relationships | Ensure relationships are integer-to-integer |
| Complex DAX | Use VAR to avoid repeated evaluation |
| DirectQuery lag | Import mode for analytical workloads; DirectQuery for real-time only |
| Too many visuals | Limit to 8-10 visuals per page; use bookmarks for drill-throughs |

## Python Equivalent of Key DAX Patterns

\`\`\`python
import pandas as pd

df = pd.DataFrame({...})  # your sales data

# CALCULATE with filter
online_rev = df[df["channel"] == "Online"]["revenue"].sum()

# ALL() equivalent — ignore groupby, calculate total
total_rev = df["revenue"].sum()
df["rev_pct_of_total"] = df.groupby("product")["revenue"].transform("sum") / total_rev

# SAMEPERIODLASTYEAR equivalent
df["date"] = pd.to_datetime(df["date"])
df_ly = df.copy()
df_ly["date"] = df_ly["date"] + pd.DateOffset(years=1)
df_ly = df_ly.rename(columns={"revenue": "revenue_ly"})
df_merged = df.merge(df_ly[["date","product","revenue_ly"]], on=["date","product"], how="left")

# YTD
df["yoy_growth"] = (df["revenue"] - df["revenue_ly"]) / df["revenue_ly"]
df["ytd_revenue"] = df.sort_values("date").groupby(df["date"].dt.year)["revenue"].cumsum()
\`\`\`

## Why This Matters for the Job

Power BI is installed in most Fortune 500 companies. Being able to build correct DAX measures — especially CALCULATE, time intelligence, and RANKX — is the difference between being the analyst who maintains reports and the analyst who builds the enterprise analytics layer. Knowing the star schema and DAX will also make you a much better SQL analyst, since the mental models transfer directly.`,
    quiz: {
      title: 'Power BI & DAX for Analytics Quiz',
      questions: [
        {
          text: 'What is the key difference between a DAX Measure and a DAX Calculated Column?',
          options: opts(
            'Measures are stored in the model; calculated columns are computed at query time',
            'Measures compute dynamically at query time in filter context; calculated columns are computed at refresh and stored per row',
            'Measures only support SUM and COUNT; calculated columns support all DAX functions',
            'Measures work in DirectQuery mode; calculated columns require Import mode'
          ),
          correctAnswer: 'b',
          explanation: 'Measures evaluate dynamically based on the current filter context — nothing is stored. Calculated columns compute at data refresh and add a new column to the table stored in the model.',
          orderIndex: 0,
        },
        {
          text: 'What does CALCULATE([Total Revenue], ALL(Sales)) do?',
          options: opts(
            'Calculates revenue only for rows where all columns in Sales match',
            'Removes all filters on the Sales table before evaluating Total Revenue — used to compute percentage of grand total',
            'Aggregates revenue across all Sales tables in the model',
            'Calculates revenue for the current row only, ignoring other rows'
          ),
          correctAnswer: 'b',
          explanation: 'ALL() removes all active filters on the specified table or columns. CALCULATE([Total Revenue], ALL(Sales)) gives the grand total regardless of any slicers — the denominator in "% of total" measures.',
          orderIndex: 1,
        },
        {
          text: 'Which DAX function returns the revenue for the same period in the previous year?',
          options: opts(
            'DATEADD(\'Date\'[Date], -1, YEAR)',
            'PARALLELPERIOD(\'Date\'[Date], -1, YEAR)',
            'SAMEPERIODLASTYEAR(\'Date\'[Date])',
            'PREVIOUSYEAR(\'Date\'[Date])'
          ),
          correctAnswer: 'c',
          explanation: 'SAMEPERIODLASTYEAR() returns a table of dates shifted exactly one year back, used inside CALCULATE to get the prior year\'s value for the same calendar period.',
          orderIndex: 2,
        },
        {
          text: 'What is the purpose of using VAR in a DAX measure?',
          options: opts(
            'Variables allow measures to run in parallel across multiple CPU cores',
            'Variables store a value computed once, preventing repeated evaluation and making complex measures cleaner and faster',
            'Variables persist values between report page refreshes',
            'Variables enable conditional logic that is not possible with standard DAX functions'
          ),
          correctAnswer: 'b',
          explanation: 'DAX variables (VAR...RETURN) evaluate an expression once and store the result. Without VAR, the same sub-expression would be re-evaluated every time it appears, both hurting performance and readability.',
          orderIndex: 3,
        },
        {
          text: 'Why is a star schema preferred in Power BI data models?',
          options: opts(
            'Star schemas require fewer tables, reducing memory usage',
            'Power BI cannot handle snowflake schemas',
            'Star schemas minimize relationship complexity, optimize DAX filter propagation, and improve query performance',
            'Star schemas allow more than 10 million rows per table'
          ),
          correctAnswer: 'c',
          explanation: 'Star schemas have simple one-to-many relationships from dimension to fact. This makes DAX filter context propagation predictable, improves VertiPaq compression, and speeds up all calculations.',
          orderIndex: 4,
        },
        {
          text: 'What does RANKX(ALL(DimProduct[ProductName]), [Total Revenue], , DESC, Dense) return?',
          options: opts(
            'The total revenue summed across all products',
            'A ranking of the current product by Total Revenue relative to all products, with 1 being the highest',
            'The product name with the highest revenue',
            'The revenue of the top-ranked product only'
          ),
          correctAnswer: 'b',
          explanation: 'RANKX evaluates [Total Revenue] for each row in ALL(DimProduct[ProductName]) and ranks the current row\'s value. Dense ranking gives 1,2,3,3,4 (no gaps); Skip gives 1,2,3,3,5.',
          orderIndex: 5,
        },
        {
          text: 'Which Power BI language is used for ETL transformations in the Power Query editor?',
          options: opts(
            'DAX (Data Analysis Expressions)',
            'M (Power Query Formula Language)',
            'T-SQL (Transact-SQL)',
            'Python (executed in Power Query)'
          ),
          correctAnswer: 'b',
          explanation: 'Power Query uses the M language (Power Query Formula Language) for ETL — filtering rows, adding columns, renaming, merging tables. DAX is only for measures and calculated columns in the data model.',
          orderIndex: 6,
        },
        {
          text: 'What is the ALLEXCEPT function used for in DAX?',
          options: opts(
            'Removes all filters from the model except the ones in the CALCULATE function',
            'Removes all filters from a table EXCEPT the specified columns — preserving those columns\' filters',
            'Returns all rows from a table except those matching a condition',
            'Calculates a measure for all dates except the current date'
          ),
          correctAnswer: 'b',
          explanation: 'ALLEXCEPT(Table, Col1, Col2) removes all filters on a table BUT keeps the filters on Col1 and Col2. Used in "% of category" measures where you want to keep the category filter but remove the product filter.',
          orderIndex: 7,
        },
        {
          text: 'A Power BI report is slow because of a complex DAX measure that references the same sub-expression three times. What is the best fix?',
          options: opts(
            'Split the measure into three separate simpler measures',
            'Switch from Import mode to DirectQuery mode',
            'Use VAR to compute the sub-expression once and reference the variable three times',
            'Add a calculated column to pre-compute the sub-expression'
          ),
          correctAnswer: 'c',
          explanation: 'VAR evaluates the expression once and stores the result. Referencing a VAR three times is three memory lookups vs three full DAX evaluations — a major performance improvement for complex expressions.',
          orderIndex: 8,
        },
        {
          text: 'Which time intelligence function calculates the year-to-date revenue?',
          options: opts(
            'CALCULATE([Total Revenue], DATESINPERIOD(...))',
            'CALCULATE([Total Revenue], DATESYTD(\'Date\'[Date]))',
            'TOTALYTD([Total Revenue], \'Date\'[Date])',
            'Both B and C are correct'
          ),
          correctAnswer: 'd',
          explanation: 'Both DATESYTD() inside CALCULATE and TOTALYTD() compute year-to-date. TOTALYTD([Measure], DateColumn) is shorthand for CALCULATE([Measure], DATESYTD(DateColumn)). Both are valid.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 37 — Marketing Analytics & Multi-Touch Attribution
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-37-marketing-analytics-attribution',
    title:      'Marketing Analytics & Multi-Touch Attribution',
    description: 'Measure marketing channel effectiveness with attribution models, Marketing Mix Modeling, and incrementality testing — skills that directly drive budget allocation decisions.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 137,
    xpReward:   120,
    language:   'python',
    codeExample: `import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge

# ── Multi-touch attribution models ──
journeys = pd.DataFrame({
    "customer_id": [1,1,1,2,2,3,3,3,3],
    "channel":     ["Organic","Email","Paid","Social","Direct","Organic","Paid","Email","Paid"],
    "position":    [1,2,3,1,2,1,2,3,4],
    "converted":   [1,1,1,1,1,1,1,1,1],
    "revenue":     [120,120,120,80,80,200,200,200,200],
})

def linear_attribution(df):
    """Equal credit to all touchpoints."""
    n_touches = df.groupby("customer_id")["channel"].transform("count")
    df["credit"] = df["revenue"] / n_touches
    return df.groupby("channel")["credit"].sum()

def time_decay_attribution(df, half_life=7):
    """More credit to touchpoints closer to conversion."""
    max_pos = df.groupby("customer_id")["position"].transform("max")
    df["decay"] = 0.5 ** ((max_pos - df["position"]) / half_life)
    df["decay_norm"] = df["decay"] / df.groupby("customer_id")["decay"].transform("sum")
    df["credit"] = df["revenue"] * df["decay_norm"]
    return df.groupby("channel")["credit"].sum()

print("Linear:"); print(linear_attribution(journeys.copy()))
print("Time-decay:"); print(time_decay_attribution(journeys.copy()))

# ── Marketing Mix Modeling (MMM) ──
np.random.seed(42)
n = 52  # weeks
mmm_data = pd.DataFrame({
    "week":    range(n),
    "tv_spend":     np.random.uniform(10,50,n),
    "digital_spend":np.random.uniform(5,30,n),
    "radio_spend":  np.random.uniform(2,10,n),
    "revenue":      None,
})
mmm_data["revenue"] = (
    2.1 * mmm_data["tv_spend"] +
    3.8 * mmm_data["digital_spend"] +
    1.2 * mmm_data["radio_spend"] +
    np.random.normal(0, 20, n) + 200
)

X = mmm_data[["tv_spend","digital_spend","radio_spend"]]
y = mmm_data["revenue"]
model = Ridge(alpha=1.0).fit(X, y)
print("Channel ROI (revenue per $ spend):", dict(zip(X.columns, model.coef_)))`,
    content: `# Marketing Analytics & Multi-Touch Attribution

Marketing analytics answers the most expensive question in business: "Which channels are actually driving revenue, and how should we allocate the budget?" Most companies either over-credit the last click or spread budget based on gut feel. Data-driven attribution changes that.

## Key Marketing Metrics

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| **CAC** | Total Mktg Spend / New Customers | Industry varies (SaaS: < LTV/3) |
| **ROAS** | Revenue / Ad Spend | > 3x typically profitable |
| **CPL** | Spend / Leads | Depends on conversion rate |
| **MQL → SQL rate** | SQLs / MQLs | B2B: 20-50% good |
| **Payback Period** | CAC / Monthly Margin per Customer | SaaS target: < 12 months |

## Attribution Models

Attribution models decide how to give credit for a conversion across multiple touchpoints.

### Single-Touch Models

\`\`\`python
import pandas as pd
import numpy as np

# Sample customer journey data
journeys = pd.DataFrame({
    "customer_id": [1, 1, 1, 2, 2, 3, 3, 3, 3],
    "channel":     ["Organic","Email","Paid", "Social","Direct", "Organic","Paid","Email","Paid"],
    "position":    [1, 2, 3,  1, 2,  1, 2, 3, 4],
    "converted":   [1, 1, 1,  1, 1,  1, 1, 1, 1],
    "revenue":     [120,120,120, 80,80, 200,200,200,200],
})

# First-touch: all credit to the first touchpoint
def first_touch_attribution(df):
    first_touch = df[df["position"] == 1].copy()
    first_touch["credit"] = first_touch["revenue"]
    return first_touch.groupby("channel")["credit"].sum()

# Last-touch: all credit to the last touchpoint
def last_touch_attribution(df):
    last_touch = df.loc[df.groupby("customer_id")["position"].idxmax()].copy()
    last_touch["credit"] = last_touch["revenue"]
    return last_touch.groupby("channel")["credit"].sum()

print("First-touch:"); print(first_touch_attribution(journeys.copy()))
print("Last-touch:");  print(last_touch_attribution(journeys.copy()))
\`\`\`

### Multi-Touch Models

\`\`\`python
# Linear: equal credit to all touchpoints
def linear_attribution(df):
    n_touches = df.groupby("customer_id")["channel"].transform("count")
    df["credit"] = df["revenue"] / n_touches
    return df.groupby("channel")["credit"].sum()

# Time-decay: more credit to touchpoints closer to conversion
def time_decay_attribution(df, half_life=2):
    max_pos = df.groupby("customer_id")["position"].transform("max")
    df["decay"] = 0.5 ** ((max_pos - df["position"]) / half_life)
    df["decay_norm"] = df["decay"] / df.groupby("customer_id")["decay"].transform("sum")
    df["credit"] = df["revenue"] * df["decay_norm"]
    return df.groupby("channel")["credit"].sum()

# Position-based (U-shaped): 40% first, 40% last, 20% shared among middle
def position_based_attribution(df):
    df = df.copy()
    max_pos = df.groupby("customer_id")["position"].transform("max")
    n_touches = df.groupby("customer_id")["position"].transform("count")
    middle_share = 0.20 / (n_touches - 2).clip(lower=1)

    def get_credit(row):
        if n_touches[row.name] == 1:
            return row["revenue"]
        elif row["position"] == 1 or row["position"] == max_pos[row.name]:
            return row["revenue"] * 0.40
        else:
            return row["revenue"] * middle_share[row.name]

    df["credit"] = df.apply(get_credit, axis=1)
    return df.groupby("channel")["credit"].sum()

print("Linear:");         print(linear_attribution(journeys.copy()))
print("Time-decay:");     print(time_decay_attribution(journeys.copy()))
print("Position-based:"); print(position_based_attribution(journeys.copy()))
\`\`\`

### Attribution Model Comparison

| Model | Strengths | Weaknesses | Best for |
|-------|----------|------------|---------|
| First-touch | Simple, shows acquisition | Ignores nurturing | Brand awareness campaigns |
| Last-touch | Simple, shows closers | Over-credits direct/email | Short sales cycles |
| Linear | Fair to all channels | Ignores channel importance | Long complex journeys |
| Time-decay | Rewards closers | Half-life is arbitrary | Short consideration window |
| Position-based | Rewards acquisition + close | Middle ignored | Mixed strategies |
| Data-driven | Statistically optimal | Needs large data volume | Mature analytics teams |

## Marketing Mix Modeling (MMM)

MMM uses regression to decompose sales into contributions from each marketing channel plus baseline + external factors. Unlike attribution, MMM works on aggregate data (weekly/monthly spend vs. sales), not individual user journeys.

\`\`\`python
import numpy as np
from sklearn.linear_model import Ridge
import matplotlib.pyplot as plt

np.random.seed(42)
n = 104  # 2 years weekly data

# Simulate marketing spend and revenue
mmm_data = pd.DataFrame({
    "week":          range(n),
    "tv_spend":      np.random.uniform(10, 50, n),
    "digital_spend": np.random.uniform(5, 30, n),
    "radio_spend":   np.random.uniform(2, 10, n),
    "seasonality":   np.sin(np.arange(n) * 2 * np.pi / 52),  # annual cycle
})

# True data-generating process (unknown in practice)
mmm_data["revenue"] = (
    2.1 * mmm_data["tv_spend"] +
    3.8 * mmm_data["digital_spend"] +
    1.2 * mmm_data["radio_spend"] +
    15  * mmm_data["seasonality"] +
    np.random.normal(0, 20, n) + 200
)

# Adstock transformation (TV effect decays over weeks)
def adstock(spend, decay=0.3):
    adstocked = spend.copy().astype(float)
    for i in range(1, len(spend)):
        adstocked.iloc[i] += decay * adstocked.iloc[i-1]
    return adstocked

mmm_data["tv_adstock"] = adstock(mmm_data["tv_spend"], decay=0.4)

# Fit MMM model
features = ["tv_adstock", "digital_spend", "radio_spend", "seasonality"]
X = mmm_data[features]
y = mmm_data["revenue"]

model = Ridge(alpha=1.0).fit(X, y)
print("Model R2:", model.score(X, y))

# Channel ROI (revenue per dollar of spend)
roi = dict(zip(features, model.coef_))
print("\\nChannel coefficients (ROI per $1 spend):")
for ch, coeff in sorted(roi.items(), key=lambda x: -x[1]):
    print(f"  {ch}: \${coeff:.2f}")

# Revenue decomposition
mmm_data["tv_contribution"]      = model.coef_[0] * mmm_data["tv_adstock"]
mmm_data["digital_contribution"] = model.coef_[1] * mmm_data["digital_spend"]
mmm_data["radio_contribution"]   = model.coef_[2] * mmm_data["radio_spend"]
mmm_data["baseline"]             = model.intercept_ + model.coef_[3] * mmm_data["seasonality"]

# Stacked area chart of contributions
mmm_data.set_index("week")[
    ["baseline","tv_contribution","digital_contribution","radio_contribution"]
].plot(kind="area", stacked=True, figsize=(14, 5), alpha=0.7,
       title="Revenue Decomposition by Channel")
plt.ylabel("Revenue")
plt.tight_layout()
plt.show()
\`\`\`

## Incrementality Testing

Attribution and MMM tell you correlational ROI. Incrementality testing tells you **causal** impact — what would have happened without the marketing investment.

\`\`\`python
from scipy import stats

# Geo holdout test: some cities got TV ads, others didn't
geo_results = pd.DataFrame({
    "market":    ["NYC","LA","Chicago","Houston","Phoenix","Dallas","Miami","Seattle"],
    "treatment": [1,1,1,1,0,0,0,0],  # 1 = saw TV ads
    "pre_revenue":  [450,380,290,210,170,200,260,180],
    "post_revenue": [510,435,320,245,172,198,264,183],
})

geo_results["revenue_lift"] = geo_results["post_revenue"] - geo_results["pre_revenue"]
geo_results["lift_pct"]     = geo_results["revenue_lift"] / geo_results["pre_revenue"]

treatment = geo_results[geo_results["treatment"] == 1]["lift_pct"]
control   = geo_results[geo_results["treatment"] == 0]["lift_pct"]

t_stat, p_val = stats.ttest_ind(treatment, control)
incremental_lift = treatment.mean() - control.mean()

print(f"Incremental revenue lift: {incremental_lift:.1%}")
print(f"p-value: {p_val:.4f}")
print(f"{'SIGNIFICANT — TV drives incremental revenue' if p_val < 0.05 else 'NOT significant'}")
\`\`\`

## Channel Performance Dashboard

\`\`\`python
# Weekly channel performance report
channel_data = pd.DataFrame({
    "channel":    ["Organic", "Paid Search", "Email", "Social", "Direct", "Referral"],
    "sessions":   [12500, 8200, 4300, 6800, 3100, 1900],
    "conversions":[425, 328, 215, 102, 155, 76],
    "revenue":    [52000, 41000, 32000, 9800, 19000, 11200],
    "spend":      [0, 12000, 1500, 5500, 0, 0],
})

channel_data["cvr"]  = channel_data["conversions"] / channel_data["sessions"]
channel_data["aov"]  = channel_data["revenue"] / channel_data["conversions"]
channel_data["roas"] = channel_data.apply(
    lambda r: r["revenue"] / r["spend"] if r["spend"] > 0 else None, axis=1
)
channel_data["cac"]  = channel_data.apply(
    lambda r: r["spend"] / r["conversions"] if r["spend"] > 0 else None, axis=1
)

print(channel_data[["channel","cvr","aov","roas","cac"]].to_string(index=False))
\`\`\`

## Key Takeaways

- **Last-touch over-credits direct and email** — always the largest channels by last-touch, always wrong
- **MMM works on aggregate data** and handles TV/offline; attribution requires individual user data
- **Adstock** captures the delayed and decaying effect of offline media (TV lingers for weeks)
- **Incrementality testing** (geo holdouts) is the gold standard — it's causal, not correlational
- **ROAS > 3x** is typically a profitable threshold; calculate it per channel, not blended
- Data-driven attribution requires 1000+ monthly conversions to be statistically stable`,
    quiz: {
      title: 'Marketing Analytics & Attribution Quiz',
      questions: [
        {
          text: 'What is the main weakness of last-touch attribution?',
          options: opts(
            'It cannot track users across multiple devices',
            'It over-credits the final touchpoint (often direct or email), ignoring channels that built awareness and consideration',
            'It requires individual user tracking data which may violate privacy laws',
            'It assigns negative credit to channels that appeared before the final touchpoint'
          ),
          correctAnswer: 'b',
          explanation: 'Last-touch gives 100% of conversion credit to the last interaction. This systematically over-credits direct traffic and email (which often trigger the final click) while ignoring upper-funnel channels that drove discovery.',
          orderIndex: 0,
        },
        {
          text: 'In time-decay attribution, which touchpoint receives the most credit?',
          options: opts(
            'The first touchpoint (the original discovery channel)',
            'All touchpoints receive equal credit regardless of timing',
            'The touchpoint closest in time to the conversion event',
            'The touchpoint with the highest spend'
          ),
          correctAnswer: 'c',
          explanation: "Time-decay attribution applies an exponential decay function — touchpoints closer to conversion receive more credit. The model assumes the customer's intent grows as they approach the purchase decision.",
          orderIndex: 1,
        },
        {
          text: 'What is Marketing Mix Modeling (MMM) and how does it differ from digital attribution?',
          options: opts(
            'MMM tracks individual users across channels; attribution tracks aggregate spend',
            'MMM uses aggregate spend vs. sales data (works for offline channels too); attribution uses individual user-level journey data',
            'MMM is used only for offline channels; attribution is used only for digital channels',
            'MMM requires A/B testing; attribution works on historical observational data'
          ),
          correctAnswer: 'b',
          explanation: 'MMM uses regression on aggregate weekly/monthly data (spend → sales) and naturally includes TV, radio, and outdoor. Attribution requires individual user tracking data and only works for digital channels with cookies/IDs.',
          orderIndex: 2,
        },
        {
          text: "What is 'adstock' in Marketing Mix Modeling?",
          options: opts(
            'The total historical ad spend stored in a database',
            'A transformation that captures the delayed and decaying carryover effect of advertising (especially TV) on future sales',
            'The stock of advertising creative assets available for a campaign',
            'A metric measuring the accumulated brand awareness from past campaigns'
          ),
          correctAnswer: 'b',
          explanation: 'Adstock (geometric decay transformation) models the fact that TV advertising effects linger for weeks after airing. Each week\'s adstock = current spend + (decay_rate × previous week\'s adstock).',
          orderIndex: 3,
        },
        {
          text: 'What is an incrementality test (geo holdout test) and why is it more reliable than attribution models?',
          options: opts(
            'It tests whether a new marketing channel increments the number of touchpoints in a journey',
            'It is a randomized experiment where some geographies receive marketing and others do not, measuring the causal revenue lift',
            'It measures how marketing spend increments over time compared to a prior period',
            'It is a statistical model that incrementally adds channels to find the best attribution mix'
          ),
          correctAnswer: 'b',
          explanation: 'Geo holdout tests are randomized controlled experiments — treatment geographies get the campaign, control geographies do not. The difference in outcomes is the true causal (incremental) impact, unlike attribution which is observational.',
          orderIndex: 4,
        },
        {
          text: 'A campaign has $15,000 spend and generates $48,000 in revenue. What is the ROAS?',
          options: opts('3.2x', '3.5x', '0.31x', '33,000'),
          correctAnswer: 'a',
          explanation: 'ROAS = Revenue / Ad Spend = $48,000 / $15,000 = 3.2x. A ROAS of 3x+ is typically considered profitable for most e-commerce businesses (covers COGS + overhead with margin remaining).',
          orderIndex: 5,
        },
        {
          text: 'Which attribution model assigns 40% credit to the first touchpoint, 40% to the last, and distributes 20% equally across all middle touchpoints?',
          options: opts('Linear attribution', 'Time-decay attribution', 'Position-based (U-shaped) attribution', 'Data-driven attribution'),
          correctAnswer: 'c',
          explanation: 'Position-based (U-shaped) attribution emphasizes the acquisition touchpoint (first) and the conversion touchpoint (last) equally at 40% each, while all middle touchpoints share the remaining 20%.',
          orderIndex: 6,
        },
        {
          text: 'What does Customer Acquisition Cost (CAC) measure and how is it calculated?',
          options: opts(
            'The average order value of customers acquired through paid channels; CAC = Revenue / Customers',
            'The total marketing and sales spend divided by the number of new customers acquired in the period',
            'The cost per click multiplied by the number of ad impressions',
            'The lifetime revenue of a customer minus their first purchase value'
          ),
          correctAnswer: 'b',
          explanation: 'CAC = Total Marketing & Sales Spend / New Customers Acquired. A healthy business maintains LTV/CAC > 3 and payback period < 12 months. Tracking CAC by channel reveals which acquisition sources are sustainable.',
          orderIndex: 7,
        },
        {
          text: 'Why does data-driven attribution require a minimum of ~1,000 monthly conversions to be reliable?',
          options: opts(
            'The ML algorithms require at least 1,000 training epochs to converge',
            'With fewer conversions, statistical noise dominates and channel coefficients become unstable and unreliable',
            'Privacy regulations require at least 1,000 users before individual data can be used',
            'Google Analytics 4 enforces a 1,000-conversion minimum for attribution reports'
          ),
          correctAnswer: 'b',
          explanation: 'Data-driven attribution fits statistical models to user journey data. With too few conversions, the model overfits to noise — assigning wildly different weights to channels based on a handful of observations. More data = more stable coefficients.',
          orderIndex: 8,
        },
        {
          text: 'In a Marketing Mix Model, what does a channel coefficient of 3.8 mean?',
          options: opts(
            'The channel has a 3.8% share of total conversions',
            'For every $1 increase in spend on this channel, revenue increases by $3.8',
            'The channel requires a $3.8 minimum spend to generate any revenue',
            'The channel drives 3.8x more traffic than the average channel'
          ),
          correctAnswer: 'b',
          explanation: 'In a linear regression MMM where X = spend and Y = revenue, the coefficient represents the marginal revenue per additional $1 of spend — the channel\'s ROI multiplier. A coefficient of 3.8 means $1 → $3.8 incremental revenue.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 38 — Financial Analytics for Data Analysts
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-38-financial-analytics',
    title:      'Financial Analytics for Data Analysts',
    description: 'Build cohort P&L models, calculate unit economics, analyze cash flows, and create financial KPI dashboards — the finance fluency that separates top analysts from average ones.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 138,
    xpReward:   120,
    language:   'python',
    codeExample: `import pandas as pd
import numpy as np

# ── Unit Economics: LTV/CAC Analysis ──
cohorts = pd.DataFrame({
    "cohort":    ["2023-Q1","2023-Q2","2023-Q3","2023-Q4"],
    "customers": [1200, 1450, 1800, 2100],
    "cac":       [85, 92, 78, 95],       # cost per customer acquired
    "arpu_m1":   [42, 45, 40, 48],       # avg revenue per user month 1
    "churn_rate":[0.08, 0.09, 0.07, 0.10], # monthly churn
    "margin":    [0.72, 0.71, 0.73, 0.70], # gross margin %
})

# LTV = ARPU * Gross Margin / Churn Rate (simple perpetuity model)
cohorts["ltv"]    = cohorts["arpu_m1"] * cohorts["margin"] / cohorts["churn_rate"]
cohorts["ltv_cac"]= cohorts["ltv"] / cohorts["cac"]
cohorts["payback_months"] = cohorts["cac"] / (cohorts["arpu_m1"] * cohorts["margin"])

print(cohorts[["cohort","ltv","ltv_cac","payback_months"]].to_string(index=False))
# ── Revenue Waterfall (MoM) ──
revenue_drivers = pd.DataFrame({
    "driver":  ["Prior Month","New Customers","Expansion","Churn","Contraction","Current Month"],
    "amount":  [980_000, 45_000, 28_000, -32_000, -8_000, 1_013_000],
})
cumulative = revenue_drivers["amount"].cumsum()
print(f"Net MRR change: \${cumulative.iloc[-1] - revenue_drivers['amount'].iloc[0]:,.0f}")`,
    content: `# Financial Analytics for Data Analysts

Financial literacy is one of the most underrated skills for data analysts at top firms. Executives at Google and Microsoft don't talk in clicks and sessions — they talk in revenue, margin, payback periods, and cash flow. Fluency in financial analytics lets you speak their language and earn a seat at the table where budgets are decided.

## Core Financial Metrics for Technology Companies

### Revenue Metrics

| Metric | Definition | Formula |
|--------|-----------|---------|
| **MRR** | Monthly Recurring Revenue | Sum of all recurring subscriptions in a month |
| **ARR** | Annual Recurring Revenue | MRR × 12 |
| **ACV** | Annual Contract Value | Total contract value / contract length (years) |
| **Net Revenue Retention** | Expansion minus churn | (MRR_end + Expansion - Churn) / MRR_start |
| **Gross Revenue Retention** | Renewal rate | (MRR_start - Churn) / MRR_start |

### Unit Economics

\`\`\`python
import pandas as pd
import numpy as np

# Unit Economics fundamentals
cohorts = pd.DataFrame({
    "cohort":     ["2023-Q1","2023-Q2","2023-Q3","2023-Q4"],
    "customers":  [1200, 1450, 1800, 2100],
    "cac":        [85, 92, 78, 95],         # $ cost to acquire one customer
    "arpu_m1":    [42, 45, 40, 48],         # avg monthly revenue per user
    "churn_rate": [0.08, 0.09, 0.07, 0.10], # monthly churn rate
    "gross_margin":[0.72, 0.71, 0.73, 0.70], # gross margin %
})

# LTV = ARPU * Gross Margin / Monthly Churn (simple perpetuity formula)
cohorts["ltv"] = cohorts["arpu_m1"] * cohorts["gross_margin"] / cohorts["churn_rate"]

# LTV/CAC ratio — must be > 3 for a sustainable business
cohorts["ltv_cac"] = cohorts["ltv"] / cohorts["cac"]

# Payback period in months — how long to recoup CAC?
cohorts["payback_months"] = cohorts["cac"] / (cohorts["arpu_m1"] * cohorts["gross_margin"])

print(cohorts[["cohort","ltv","ltv_cac","payback_months"]].round(1).to_string(index=False))

# Health benchmarks
print("\\nBenchmarks:")
print(cohorts.assign(
    ltv_cac_healthy = cohorts["ltv_cac"] > 3,
    payback_ok      = cohorts["payback_months"] < 18,
).to_string())
\`\`\`

## Revenue Waterfall & MRR Movement

\`\`\`python
# MRR movement analysis — the standard SaaS financial report
mrr_movement = pd.DataFrame({
    "month":            ["Jan","Feb","Mar","Apr","May","Jun"],
    "new_mrr":          [45000, 52000, 48000, 61000, 58000, 72000],
    "expansion_mrr":    [12000, 15000, 11000, 18000, 14000, 20000],
    "churn_mrr":        [-28000,-31000,-25000,-33000,-29000,-35000],
    "contraction_mrr":  [-5000, -7000, -4000, -6000, -5000, -8000],
    "reactivation_mrr": [3000,  4000,  3500,  5000,  4500,  6000],
})

mrr_movement["net_new_mrr"] = (
    mrr_movement["new_mrr"] +
    mrr_movement["expansion_mrr"] +
    mrr_movement["churn_mrr"] +
    mrr_movement["contraction_mrr"] +
    mrr_movement["reactivation_mrr"]
)

starting_mrr = 850_000
mrr_movement["ending_mrr"] = starting_mrr + mrr_movement["net_new_mrr"].cumsum()

# Net Revenue Retention (NRR) — critical SaaS health metric
# NRR > 100% means existing customers expand faster than they churn
mrr_movement["nrr"] = (
    1 + (mrr_movement["expansion_mrr"] + mrr_movement["churn_mrr"] +
         mrr_movement["contraction_mrr"]) / (starting_mrr)
)

print(mrr_movement[["month","ending_mrr","net_new_mrr","nrr"]].to_string(index=False))
\`\`\`

## Cohort P&L Modeling

\`\`\`python
def build_cohort_pl(cohort_size, cac, arpu, gross_margin, monthly_churn, months=24):
    """Build a full P&L for one acquisition cohort over N months."""
    results = []
    customers = cohort_size

    for m in range(months + 1):
        if m == 0:
            # Month 0: acquisition cost
            revenue = 0
            gross_profit = -cac * cohort_size
        else:
            revenue = customers * arpu
            gross_profit = revenue * gross_margin
            customers = customers * (1 - monthly_churn)

        results.append({
            "month": m,
            "customers": round(customers),
            "revenue": round(revenue, 2),
            "gross_profit": round(gross_profit, 2),
        })

    df = pd.DataFrame(results)
    df["cumulative_gp"] = df["gross_profit"].cumsum()
    df["payback_reached"] = df["cumulative_gp"] >= 0

    payback_month = df[df["payback_reached"]]["month"].min() if df["payback_reached"].any() else "Never"
    total_ltv = df["gross_profit"].sum()

    print(f"Cohort size: {cohort_size} | CAC: \${cac} | LTV (24m): \${total_ltv:,.0f}")
    print(f"LTV/CAC: {total_ltv / (cac * cohort_size):.2f}x | Payback: month {payback_month}")
    return df

pl = build_cohort_pl(cohort_size=1000, cac=85, arpu=45, gross_margin=0.72, monthly_churn=0.08)
print(pl[pl["month"].isin([0,3,6,12,18,24])].to_string(index=False))
\`\`\`

## Revenue Forecasting

\`\`\`python
from sklearn.linear_model import LinearRegression

# Bottom-up forecast: new customers × ARPU + expansion + retention
historical = pd.DataFrame({
    "month_num":    range(1, 25),
    "new_customers":[100,110,105,120,135,142,158,165,170,180,195,210,
                     225,240,230,260,275,290,310,325,340,355,380,400],
    "total_revenue":[180000,198000,210000,228000,252000,270000,290000,
                     312000,330000,355000,380000,410000,440000,470000,
                     460000,505000,530000,560000,595000,630000,660000,
                     695000,740000,785000],
})

# Simple linear trend forecast (replace with SARIMA for seasonal data)
X = historical[["month_num"]]
y = historical["total_revenue"]
model = LinearRegression().fit(X, y)

future_months = pd.DataFrame({"month_num": range(25, 37)})
forecast = model.predict(future_months)

print("12-month forecast:")
for m, rev in zip(future_months["month_num"], forecast):
    print(f"  Month {m}: \${rev:>10,.0f}")

print(f"\\nForecast accuracy on historical data: R2 = {model.score(X, y):.4f}")
\`\`\`

## Cash Flow Analysis

\`\`\`python
# Operating cash flow statement
cash_flow = pd.DataFrame({
    "period": ["Q1 2024","Q2 2024","Q3 2024","Q4 2024"],
    "net_income":        [120000, 145000, 160000, 195000],
    "depreciation":      [15000,  15000,  15000,  15000],
    "change_ar":         [-25000, -30000, -15000, -40000],  # negative = AR increased (cash tied up)
    "change_deferred_rev":[18000,  22000,  20000,  30000],  # positive = received cash upfront
    "capex":             [-50000, -45000, -60000, -55000],
})

cash_flow["operating_cf"] = (
    cash_flow["net_income"] +
    cash_flow["depreciation"] +
    cash_flow["change_ar"] +
    cash_flow["change_deferred_rev"]
)
cash_flow["free_cash_flow"] = cash_flow["operating_cf"] + cash_flow["capex"]
cash_flow["fcf_margin"]     = cash_flow["free_cash_flow"] / (cash_flow["net_income"] * 2)  # approx revenue

print(cash_flow[["period","operating_cf","free_cash_flow","fcf_margin"]].to_string(index=False))

# Rule of 40: Revenue Growth % + FCF Margin % >= 40 for healthy SaaS
growth_rate = 0.35  # 35% YoY revenue growth
fcf_margin  = cash_flow["fcf_margin"].mean()
rule_of_40  = growth_rate * 100 + fcf_margin * 100
print(f"\\nRule of 40 score: {rule_of_40:.1f}% ({'HEALTHY' if rule_of_40 >= 40 else 'NEEDS IMPROVEMENT'})")
\`\`\`

## Financial KPI Dashboard (Python)

\`\`\`python
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

fig = plt.figure(figsize=(16, 10))
gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.4, wspace=0.3)

ax1 = fig.add_subplot(gs[0, :2])  # MRR trend — wide
ax2 = fig.add_subplot(gs[0, 2])   # LTV/CAC gauge
ax3 = fig.add_subplot(gs[1, 0])   # Churn waterfall
ax4 = fig.add_subplot(gs[1, 1])   # Payback cohort
ax5 = fig.add_subplot(gs[1, 2])   # NRR bar

# (Populate each ax with charts using the data from above)
ax1.set_title("Monthly Recurring Revenue", fontweight="bold")
ax2.set_title("LTV / CAC by Cohort", fontweight="bold")
ax3.set_title("MRR Movement", fontweight="bold")

for ax in [ax1, ax2, ax3, ax4, ax5]:
    ax.spines[["top","right"]].set_visible(False)

plt.suptitle("SaaS Financial Health Dashboard", fontsize=16, fontweight="bold")
plt.show()
\`\`\`

## Key Financial Ratios at a Glance

| Ratio | Formula | Healthy Benchmark |
|-------|---------|-----------------|
| LTV/CAC | LTV / CAC | > 3x |
| Payback Period | CAC / (ARPU × Gross Margin) | < 18 months |
| Gross Margin | (Revenue - COGS) / Revenue | SaaS: > 70% |
| Net Revenue Retention | Ending MRR (excl. new) / Starting MRR | > 100% |
| Rule of 40 | Revenue Growth % + FCF Margin % | > 40 |
| Burn Multiple | Net Cash Burned / Net New ARR | < 1x efficient |`,
    quiz: {
      title: 'Financial Analytics for Data Analysts Quiz',
      questions: [
        {
          text: 'What does a Net Revenue Retention (NRR) of 115% indicate?',
          options: opts(
            'The company grew total revenue by 15% from new customers',
            'Existing customers expanded their spend by 15% more than was lost to churn and contraction',
            '15% of customers renewed their contracts',
            'The company retained 115% of its previous year customer count'
          ),
          correctAnswer: 'b',
          explanation: 'NRR > 100% means that expansion revenue (upsells, seat additions) from existing customers exceeds revenue lost to churn and contraction. NRR of 115% means existing cohorts grew 15% on their own — a powerful compounding engine.',
          orderIndex: 0,
        },
        {
          text: 'Using the simple LTV formula, what is the LTV for a customer with $50/month ARPU, 70% gross margin, and 5% monthly churn?',
          options: opts('$350', '$700', '$500', '$1,000'),
          correctAnswer: 'b',
          explanation: 'LTV = ARPU × Gross Margin / Monthly Churn Rate = $50 × 0.70 / 0.05 = $700. This assumes a constant churn rate and no time discount, giving an expected lifetime gross profit.',
          orderIndex: 1,
        },
        {
          text: 'A SaaS company has LTV/CAC of 1.8x. What does this indicate?',
          options: opts(
            'The company is highly efficient — each customer generates 1.8x their acquisition cost',
            'The company is marginally profitable — LTV/CAC of 1.8x is slightly below the 2x threshold',
            'The company is in trouble — spending more to acquire customers than they generate in lifetime value is unsustainable',
            'The company should increase prices to improve the ratio above 2x'
          ),
          correctAnswer: 'c',
          explanation: 'The healthy SaaS benchmark is LTV/CAC > 3x. At 1.8x, the company recovers its CAC but after accounting for operating expenses, S&M overhead, and capital costs, the economics are unsustainable — the business will likely burn cash.',
          orderIndex: 2,
        },
        {
          text: 'What does the "Rule of 40" measure for SaaS companies?',
          options: opts(
            'The maximum acceptable churn rate (must be below 40% annually)',
            'Revenue Growth Rate % + Free Cash Flow Margin % — combined score should be >= 40 for a healthy SaaS business',
            'The ratio of ARR to total funding raised (should be at least 40%)',
            'The minimum gross margin threshold required to achieve profitability'
          ),
          correctAnswer: 'b',
          explanation: 'The Rule of 40 balances growth and profitability. A fast-growing company (60% growth) can afford negative FCF margin (-20%), scoring 40. A slower company (20% growth) needs positive FCF margin (+20%) to score 40.',
          orderIndex: 3,
        },
        {
          text: 'In MRR movement analysis, what does "Expansion MRR" represent?',
          options: opts(
            'Revenue from new customers acquired this month',
            'Revenue recovered from customers who churned and returned',
            'Additional revenue from existing customers upgrading plans, adding seats, or purchasing add-ons',
            'Revenue adjustment from corrected billing errors'
          ),
          correctAnswer: 'c',
          explanation: 'Expansion MRR is revenue growth from the existing customer base — upsells to higher tiers, additional seats/licenses, or cross-sold products. High Expansion MRR is the driver of NRR > 100%.',
          orderIndex: 4,
        },
        {
          text: 'What is the payback period for a customer with CAC = $120, ARPU = $40/month, and 75% gross margin?',
          options: opts('3 months', '4 months', '4.5 months', '6 months'),
          correctAnswer: 'b',
          explanation: 'Payback Period = CAC / (Monthly ARPU × Gross Margin) = $120 / ($40 × 0.75) = $120 / $30 = 4 months. This is the time to recoup the acquisition cost from gross profit generated by the customer.',
          orderIndex: 5,
        },
        {
          text: 'What is Annual Recurring Revenue (ARR)?',
          options: opts(
            'Total revenue generated in the past 12 months including one-time services',
            'The annualized value of all active recurring subscription revenue (MRR × 12)',
            'The total contract value of all signed agreements regardless of subscription length',
            'Revenue from annual payment plan customers only (excluding monthly payers)'
          ),
          correctAnswer: 'b',
          explanation: 'ARR = MRR × 12. It represents the annualized run rate of recurring subscription revenue — the primary valuation metric for SaaS companies. It excludes one-time fees, professional services, and non-recurring revenue.',
          orderIndex: 6,
        },
        {
          text: 'In a cohort P&L model, why does Month 0 typically show a large negative gross profit?',
          options: opts(
            'Because revenue recognition standards require deferring Month 0 revenue',
            'Because Month 0 represents the Customer Acquisition Cost (CAC) paid upfront before the customer generates any revenue',
            'Because customers are given a free trial in Month 0 and do not pay',
            'Because onboarding costs are highest in Month 0 and reduce gross profit'
          ),
          correctAnswer: 'b',
          explanation: 'Month 0 is the acquisition investment — you pay CAC × cohort_size before the cohort generates a single dollar of revenue. The cumulative P&L is deeply negative at Month 0 and gradually recovers as monthly gross profit accumulates.',
          orderIndex: 7,
        },
        {
          text: 'Free Cash Flow (FCF) is best described as:',
          options: opts(
            'Net Income + Depreciation',
            'Operating Cash Flow + Capital Expenditures (CapEx)',
            'Operating Cash Flow minus Capital Expenditures — cash available after investing in the business',
            'Total Revenue minus Total Costs including non-cash items'
          ),
          correctAnswer: 'c',
          explanation: 'FCF = Operating Cash Flow - CapEx. It measures the actual cash the business generates after paying for the investments needed to maintain and grow operations — the cash available to repay debt, pay dividends, or fund growth.',
          orderIndex: 8,
        },
        {
          text: 'Why does an increase in accounts receivable (AR) reduce operating cash flow?',
          options: opts(
            'Higher AR means more bad debt expenses that reduce net income',
            'Higher AR means revenue was recognized but cash has not yet been collected — cash is tied up in outstanding invoices',
            'Higher AR indicates slower inventory turns, increasing warehouse costs',
            'Higher AR reduces available working capital for paying suppliers'
          ),
          correctAnswer: 'b',
          explanation: 'When AR increases, you recognized revenue on the income statement but did not receive the cash yet. On the cash flow statement, the AR increase is subtracted from net income to show the actual cash impact — revenue was booked, but cash has not arrived.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 39 — Customer Lifetime Value (CLV) Modeling
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-39-customer-lifetime-value',
    title:      'Customer Lifetime Value (CLV) Modeling',
    description: 'Build predictive CLV models, segment customers by long-term value, and use CLV to drive acquisition budget allocation, retention investment, and product decisions.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 139,
    xpReward:   120,
    language:   'python',
    codeExample: `import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split

# ── Predict 12-month CLV from early signals ──
np.random.seed(42)
n = 5000
customers = pd.DataFrame({
    "customer_id":     range(n),
    "days_since_first":np.random.randint(30, 365, n),
    "orders_l90d":     np.random.randint(0, 15, n),
    "avg_order_value": np.random.exponential(65, n),
    "return_rate":     np.random.uniform(0, 0.4, n),
    "support_tickets": np.random.randint(0, 5, n),
    "email_open_rate": np.random.uniform(0, 1, n),
    "channel":         np.random.choice(["organic","paid","referral"], n),
})
customers["ltv_12m"] = (
    customers["orders_l90d"] * 4 * customers["avg_order_value"] * (1 - customers["return_rate"]) *
    (1 - 0.05 * customers["support_tickets"]) * np.random.uniform(0.8, 1.2, n)
)

X = customers[["orders_l90d","avg_order_value","return_rate","support_tickets","email_open_rate"]]
y = customers["ltv_12m"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = GradientBoostingRegressor(n_estimators=200, max_depth=4, random_state=42)
model.fit(X_train, y_train)
print(f"R2 on test: {model.score(X_test, y_test):.4f}")
customers["predicted_ltv"] = model.predict(X)

# CLV segments
customers["clv_segment"] = pd.qcut(customers["predicted_ltv"],
    q=[0, 0.25, 0.75, 1.0], labels=["Low","Mid","High"])
print(customers.groupby("clv_segment")[["predicted_ltv","orders_l90d"]].mean().round(2))`,
    content: `# Customer Lifetime Value (CLV) Modeling

Customer Lifetime Value is the single most important metric for a customer-centric business. It answers: how much is a customer worth over their entire relationship with us? CLV determines how much you can afford to spend to acquire a customer, which customers to prioritize in retention, and which product features drive the most long-term value.

## CLV Formulas

### Simple Perpetuity CLV (for subscription businesses)

\`\`\`
CLV = ARPU × Gross Margin / Monthly Churn Rate
\`\`\`

### Discounted CLV (accounts for time value of money)

\`\`\`
CLV = Σ (Revenue_t × Margin_t × Retention_t) / (1 + r)^t
      t=0 to T
\`\`\`

Where:
- \`r\` = monthly discount rate (annual discount rate / 12)
- \`Retention_t\` = probability customer is still active at time t
- \`T\` = forecast horizon

### Historical CLV (e-commerce)

\`\`\`python
import pandas as pd
import numpy as np

# Historical CLV from transaction data
transactions = pd.DataFrame({
    "customer_id": np.repeat(range(1, 101), np.random.randint(1, 20, 100)),
    "order_date":  pd.to_datetime(np.random.choice(
        pd.date_range("2022-01-01","2024-12-31"), 1000
    )),
    "revenue":     np.random.exponential(75, 1000),
    "cogs":        np.random.exponential(30, 1000),
})

transactions["gross_profit"] = transactions["revenue"] - transactions["cogs"]

historical_clv = transactions.groupby("customer_id").agg(
    total_revenue    = ("revenue", "sum"),
    total_gp         = ("gross_profit", "sum"),
    order_count      = ("revenue", "count"),
    avg_order_value  = ("revenue", "mean"),
    first_order      = ("order_date", "min"),
    last_order       = ("order_date", "max"),
).reset_index()

historical_clv["customer_age_days"] = (
    pd.Timestamp("2024-12-31") - historical_clv["first_order"]
).dt.days

historical_clv["purchase_frequency"] = (
    historical_clv["order_count"] / (historical_clv["customer_age_days"] / 30)
)

print(historical_clv.describe())
\`\`\`

## Predictive CLV with Machine Learning

Predictive CLV forecasts the next 12 months of customer value using early behavioral signals — crucial for early intervention with at-risk high-value customers.

\`\`\`python
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import matplotlib.pyplot as plt

np.random.seed(42)
n = 10000

customers = pd.DataFrame({
    "customer_id":      range(n),
    "days_since_first": np.random.randint(30, 730, n),
    "orders_l90d":      np.random.randint(0, 15, n),
    "avg_order_value":  np.random.exponential(65, n),
    "return_rate":      np.random.uniform(0, 0.4, n),
    "support_tickets":  np.random.randint(0, 8, n),
    "email_open_rate":  np.random.uniform(0, 1, n),
    "days_since_last":  np.random.randint(0, 180, n),
    "category_count":   np.random.randint(1, 8, n),
})

# Simulate true 12-month LTV (unknown in production)
customers["ltv_12m"] = (
    customers["orders_l90d"] * 4 *
    customers["avg_order_value"] *
    (1 - customers["return_rate"]) *
    np.exp(-0.01 * customers["days_since_last"]) +
    customers["category_count"] * 15 +
    np.random.normal(0, 30, n)
).clip(lower=0)

features = ["orders_l90d","avg_order_value","return_rate","support_tickets",
            "email_open_rate","days_since_last","category_count","days_since_first"]
X = customers[features]
y = customers["ltv_12m"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = GradientBoostingRegressor(n_estimators=300, max_depth=4,
                                   learning_rate=0.05, random_state=42)
model.fit(X_train, y_train)

print(f"Test R2:  {model.score(X_test, y_test):.4f}")
print(f"Test MAE: \${mean_absolute_error(y_test, model.predict(X_test)):.2f}")

# Feature importance
feat_imp = pd.Series(model.feature_importances_, index=features).sort_values(ascending=False)
print("\\nFeature Importance:")
print(feat_imp.to_string())
\`\`\`

## CLV Customer Segmentation

\`\`\`python
customers["predicted_ltv"] = model.predict(X)

# Value-based segmentation: Champions / Growth / At-Risk / Low-Value
customers["clv_segment"] = pd.qcut(
    customers["predicted_ltv"],
    q=[0, 0.25, 0.60, 0.90, 1.0],
    labels=["Low-Value","Growth","Champions","VIP"]
)

segment_summary = customers.groupby("clv_segment").agg(
    count            = ("customer_id","count"),
    avg_predicted_ltv= ("predicted_ltv","mean"),
    avg_order_value  = ("avg_order_value","mean"),
    avg_orders       = ("orders_l90d","mean"),
    avg_return_rate  = ("return_rate","mean"),
).round(2)
print(segment_summary.to_string())

# Revenue concentration (Pareto analysis)
customers_sorted = customers.sort_values("predicted_ltv", ascending=False)
customers_sorted["cumulative_ltv_pct"] = (
    customers_sorted["predicted_ltv"].cumsum() /
    customers_sorted["predicted_ltv"].sum()
)

top_20_pct = customers_sorted.head(int(n * 0.20))
print(f"\\nTop 20% of customers represent "
      f"{top_20_pct['predicted_ltv'].sum() / customers['predicted_ltv'].sum():.0%} of total CLV")
\`\`\`

## CLV-Informed Budget Allocation

\`\`\`python
# How much to spend to acquire customers from each channel
# Rule: Maximum CAC = CLV / LTV-to-CAC target ratio

acquisition_data = pd.DataFrame({
    "channel":      ["Organic","Paid Search","Email","Referral","Social"],
    "avg_clv":      [450, 380, 520, 610, 220],
    "conversion_rate":[0.045, 0.032, 0.065, 0.055, 0.018],
    "current_cac":  [0, 95, 25, 45, 55],
})

ltv_cac_target = 3.0  # we want LTV/CAC >= 3

acquisition_data["max_cac"] = acquisition_data["avg_clv"] / ltv_cac_target
acquisition_data["headroom"] = acquisition_data["max_cac"] - acquisition_data["current_cac"]
acquisition_data["efficiency"] = acquisition_data["avg_clv"] / acquisition_data["current_cac"].replace(0, np.nan)
acquisition_data["recommendation"] = acquisition_data["headroom"].apply(
    lambda h: "SCALE UP" if h > 20 else ("OPTIMIZE" if h > 0 else "CUT")
)

print(acquisition_data[["channel","avg_clv","current_cac","max_cac","headroom","recommendation"]].to_string(index=False))
\`\`\`

## Survival Analysis for Churn Modeling

\`\`\`python
# Kaplan-Meier survival curve (non-parametric retention model)
from lifelines import KaplanMeierFitter

kmf = KaplanMeierFitter()

# Duration = months active; event = 1 if churned, 0 if still active
np.random.seed(42)
duration = np.random.exponential(12, 500).clip(max=24).round()
event    = np.random.binomial(1, 0.7, 500)  # 70% eventually churn

kmf.fit(duration, event_observed=event, label="All Customers")
print(kmf.median_survival_time_)  # median customer lifespan

# By segment
high_value = np.random.choice([True, False], 500, p=[0.3, 0.7])
kmf.fit(duration[high_value], event[high_value], label="High-Value")
kmf.fit(duration[~high_value], event[~high_value], label="Low-Value")
\`\`\`

## CLV Business Applications

| Decision | How CLV informs it |
|---------|-------------------|
| **Acquisition budget** | Max CAC = CLV / LTV-CAC target ratio |
| **Retention investment** | Prioritize intervention on high-CLV at-risk customers |
| **Discount policy** | Offer deeper discounts to high-CLV segments |
| **Product roadmap** | Features that improve high-CLV segment metrics → highest ROI |
| **Customer success** | Assign dedicated CSMs to VIP (high-CLV) accounts |
| **Win-back campaigns** | Target churned customers with predicted CLV > threshold |

## Key Takeaways

- **Historical CLV** is backward-looking; **Predictive CLV** is forward-looking — use both
- **Orders in first 90 days** is usually the strongest predictor of long-term CLV
- **Return rate and support tickets** are early signals of low-value / churned customers
- **Top 20% of customers often drive 60-80% of lifetime revenue** — identify and protect them
- **CLV / CAC ratio drives acquisition budget** — if CLV is $600, max profitable CAC is $200 (at 3x)
- Always **track CLV by acquisition channel** — Referral customers almost always have higher CLV than Paid`,
    quiz: {
      title: 'Customer Lifetime Value (CLV) Modeling Quiz',
      questions: [
        {
          text: 'Using the simple perpetuity formula, what is the CLV for a customer with $60/month ARPU, 75% gross margin, and 6% monthly churn?',
          options: opts('$750', '$900', '$1,200', '$450'),
          correctAnswer: 'a',
          explanation: 'CLV = ARPU × Gross Margin / Monthly Churn = $60 × 0.75 / 0.06 = $45 / 0.06 = $750. This formula assumes constant churn and ARPU and no time discount.',
          orderIndex: 0,
        },
        {
          text: 'What is the maximum profitable CAC if CLV = $750 and the company targets an LTV/CAC ratio of 3x?',
          options: opts('$150', '$225', '$250', '$300'),
          correctAnswer: 'c',
          explanation: 'Max CAC = CLV / LTV-CAC target = $750 / 3 = $250. Any acquisition channel with CAC below $250 is profitable at the 3x ratio target.',
          orderIndex: 1,
        },
        {
          text: 'Which early behavioral signal is typically the strongest predictor of long-term customer CLV?',
          options: opts(
            'Whether the customer used a discount code on their first purchase',
            'Order frequency in the first 90 days after acquisition',
            'Number of customer support tickets in the first month',
            'The acquisition channel (organic vs. paid)'
          ),
          correctAnswer: 'b',
          explanation: 'Order frequency in the first 90 days is empirically one of the strongest predictors of 12-month and lifetime CLV. Early engagement patterns are highly predictive of long-term customer behavior.',
          orderIndex: 2,
        },
        {
          text: 'What does the Pareto principle (80/20 rule) typically reveal in CLV analysis?',
          options: opts(
            '80% of customers have a CLV below the company average',
            'The top 20% of customers by CLV generate approximately 60-80% of total lifetime revenue',
            'Reducing churn by 20% increases CLV by 80%',
            '80% of CLV comes within the first 20% of the customer lifetime'
          ),
          correctAnswer: 'b',
          explanation: 'CLV distributions are highly right-skewed — a small fraction of high-value customers disproportionately drives total revenue. Identifying and retaining these VIP customers is the highest-ROI customer strategy.',
          orderIndex: 3,
        },
        {
          text: 'What is the difference between historical CLV and predictive CLV?',
          options: opts(
            'Historical CLV uses survey data; predictive CLV uses transactional data',
            'Historical CLV measures actual gross profit from past purchases; predictive CLV forecasts future value using ML models trained on early behavioral signals',
            'Historical CLV calculates revenue minus COGS; predictive CLV calculates revenue minus all costs including overhead',
            'Historical CLV is calculated at the segment level; predictive CLV is calculated at the individual level'
          ),
          correctAnswer: 'b',
          explanation: 'Historical CLV looks backward (what did this customer actually spend?). Predictive CLV uses a machine learning model trained on features like purchase frequency, AOV, and recency to forecast what a customer WILL spend in the next N months.',
          orderIndex: 4,
        },
        {
          text: 'In a Gradient Boosting model for CLV prediction, what does feature importance reveal?',
          options: opts(
            'The percentage of customers in each CLV segment',
            'The relative contribution of each input feature to the model\'s predictions — which signals best explain CLV variance',
            'The correlation between each feature and the target CLV variable',
            'The accuracy improvement from adding each feature to the model'
          ),
          correctAnswer: 'b',
          explanation: 'Feature importance in gradient boosting measures how much each feature reduces prediction error across all splits. High importance = the model relies heavily on this feature to predict CLV — these are your key leading indicators of customer value.',
          orderIndex: 5,
        },
        {
          text: 'How should CLV data inform the product roadmap?',
          options: opts(
            'Features with the most votes on the feedback forum should be prioritized regardless of CLV',
            'Features that improve engagement metrics for high-CLV segments should be prioritized as they have the highest revenue ROI',
            'Only features used by VIP (high-CLV) customers should ever be built',
            'CLV data should not influence product decisions — that is the domain of product managers'
          ),
          correctAnswer: 'b',
          explanation: 'Features that improve retention or usage for high-CLV customers have massively disproportionate business impact. If a feature increases usage by high-CLV customers 10%, that may be worth more than a feature that doubles usage by low-CLV customers.',
          orderIndex: 6,
        },
        {
          text: 'What does a high product return rate signal about a customer\'s future CLV?',
          options: opts(
            'High returns indicate high-value customers who buy frequently and are comfortable returning',
            'High return rates signal dissatisfaction, lower repurchase intent, and significantly lower future CLV',
            'Return rate has no correlation with CLV — it depends entirely on the return policy',
            'Returns indicate customers with high average order values who are more selective'
          ),
          correctAnswer: 'b',
          explanation: 'High return rates are a leading indicator of low CLV — they signal poor product-customer fit, higher operational costs, and lower net revenue per order. In ML models, return_rate is typically one of the top negative predictors of CLV.',
          orderIndex: 7,
        },
        {
          text: 'In CLV-informed acquisition budget allocation, what does "headroom" represent?',
          options: opts(
            'The difference between the highest and lowest CLV in the customer base',
            'The maximum additional spend available before hitting the LTV/CAC target — current CAC subtracted from max profitable CAC',
            'The percentage of customers from each channel who remain active after 12 months',
            'The budget reserved for testing new acquisition channels'
          ),
          correctAnswer: 'b',
          explanation: 'Headroom = Max CAC - Current CAC. Positive headroom means there is room to increase spend on this channel while still maintaining the LTV/CAC target. Large positive headroom = "SCALE UP" signal.',
          orderIndex: 8,
        },
        {
          text: 'Why do Referral customers typically have higher CLV than Paid Search customers?',
          options: opts(
            'Referral customers spend more on their first order due to peer pressure',
            'Referral customers were recommended by existing satisfied customers, indicating better product-market fit and self-selection of higher-intent buyers',
            'Paid search customers have higher CAC which reduces their net CLV calculation',
            'Referral programs offer customers incentives that increase their order frequency'
          ),
          correctAnswer: 'b',
          explanation: 'Referral customers were pre-sold by a trusted peer — they arrive with higher intent, better expectations alignment, and stronger affinity. They tend to have higher retention, higher AOV, and often become referrers themselves, creating compounding value.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 40 — Advanced A/B Testing & Causal Inference
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-40-advanced-ab-testing-causal-inference',
    title:      'Advanced A/B Testing & Causal Inference',
    description: 'Go beyond basic A/B tests — learn CUPED variance reduction, Bayesian experimentation, Difference-in-Differences, and causal inference methods used by Google and Meta experimentation teams.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 140,
    xpReward:   125,
    language:   'python',
    codeExample: `import numpy as np
import pandas as pd
from scipy import stats

np.random.seed(42)
n = 5000

# ── CUPED: Variance Reduction with Pre-Experiment Covariate ──
df = pd.DataFrame({
    "user_id":     range(n),
    "treatment":   np.random.binomial(1, 0.5, n),
    "pre_revenue": np.random.exponential(50, n),  # pre-experiment covariate
    "post_revenue": None,
})
# Treatment lifts revenue by ~$5 (true effect)
df["post_revenue"] = (
    df["pre_revenue"] * 0.8 +
    df["treatment"] * 5 +
    np.random.normal(0, 30, n)
)

# Standard t-test
ctrl = df[df.treatment==0]["post_revenue"]
trt  = df[df.treatment==1]["post_revenue"]
t1, p1 = stats.ttest_ind(ctrl, trt)
print(f"Standard t-test p={p1:.4f}, effect={trt.mean()-ctrl.mean():.2f}")

# CUPED: partial out the pre-experiment covariate
theta = np.cov(df["post_revenue"], df["pre_revenue"])[0,1] / np.var(df["pre_revenue"])
df["cuped"] = df["post_revenue"] - theta * (df["pre_revenue"] - df["pre_revenue"].mean())
c2 = df[df.treatment==0]["cuped"]
t2 = df[df.treatment==1]["cuped"]
t_stat2, p2 = stats.ttest_ind(c2, t2)
var_reduction = 1 - df["cuped"].var() / df["post_revenue"].var()
print(f"CUPED t-test  p={p2:.4f}, effect={t2.mean()-c2.mean():.2f}")
print(f"Variance reduction: {var_reduction:.1%}")`,
    content: `# Advanced A/B Testing & Causal Inference

Basic A/B testing — run an experiment, compute a t-test, check p < 0.05 — is just the starting point. The experimentation teams at Google, Meta, and Airbnb run thousands of experiments per year and have developed sophisticated methods to run tests faster (CUPED), more correctly (sequential testing), and on systems where randomization is impossible (DiD, RDD). This chapter covers those methods.

## Recap: What Makes a Good Experiment?

A valid causal experiment requires:
1. **Randomization** — units randomly assigned to treatment/control
2. **Sufficient power** — enough sample to detect the smallest meaningful effect
3. **SUTVA** — Stable Unit Treatment Value Assumption — treatment of one unit doesn't affect others
4. **Pre-registration** — hypothesis stated before data collection

## Sample Size & Statistical Power

\`\`\`python
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

def required_sample_size(baseline, mde, alpha=0.05, power=0.80, two_sided=True):
    """
    Calculate minimum sample size per group.
    baseline: baseline conversion rate (proportion)
    mde: minimum detectable effect (absolute change in proportion)
    """
    z_alpha = stats.norm.ppf(1 - alpha / (2 if two_sided else 1))
    z_beta  = stats.norm.ppf(power)

    p1 = baseline
    p2 = baseline + mde
    pooled = (p1 + p2) / 2

    n = ((z_alpha + z_beta) ** 2 * 2 * pooled * (1 - pooled)) / (mde ** 2)
    return int(np.ceil(n))

# Example: conversion rate 5%, want to detect +0.5pp lift, 80% power
n = required_sample_size(baseline=0.05, mde=0.005)
print(f"Required sample per group: {n:,}")  # ~30,000 per group

# Power curve: sensitivity to effect size
mdes = np.linspace(0.001, 0.02, 50)
sizes = [required_sample_size(0.05, m) for m in mdes]
plt.plot([m * 100 for m in mdes], sizes)
plt.xlabel("MDE (percentage points)")
plt.ylabel("Sample size per group")
plt.title("Sample Size vs Minimum Detectable Effect")
plt.axhline(10000, color="red", linestyle="--", label="Our weekly traffic")
plt.legend()
plt.tight_layout()
plt.show()
\`\`\`

## CUPED — Variance Reduction

CUPED (Controlled-experiment Using Pre-Experiment Data) is the most impactful experiment engineering technique. It reduces the variance of the outcome metric using a pre-experiment covariate, effectively giving you a much smaller required sample size for the same power.

\`\`\`python
import pandas as pd
from scipy import stats

np.random.seed(42)
n = 5000

df = pd.DataFrame({
    "user_id":     range(n),
    "treatment":   np.random.binomial(1, 0.5, n),
    "pre_revenue": np.random.exponential(50, n),
})

# Simulate post-experiment revenue (true lift = $5)
df["post_revenue"] = (
    df["pre_revenue"] * 0.8 +
    df["treatment"] * 5 +
    np.random.normal(0, 30, n)
)

# ── Standard t-test ──
ctrl_post = df[df["treatment"] == 0]["post_revenue"]
trt_post  = df[df["treatment"] == 1]["post_revenue"]
t1, p1 = stats.ttest_ind(ctrl_post, trt_post)
print(f"Standard: p={p1:.4f}  effect=\${trt_post.mean()-ctrl_post.mean():.2f}")

# ── CUPED: remove variance explained by pre-experiment covariate ──
# theta = Cov(Y_post, X_pre) / Var(X_pre)
theta = np.cov(df["post_revenue"], df["pre_revenue"])[0, 1] / np.var(df["pre_revenue"])
df["post_cuped"] = df["post_revenue"] - theta * (df["pre_revenue"] - df["pre_revenue"].mean())

ctrl_cuped = df[df["treatment"] == 0]["post_cuped"]
trt_cuped  = df[df["treatment"] == 1]["post_cuped"]
t2, p2 = stats.ttest_ind(ctrl_cuped, trt_cuped)

var_reduction = 1 - df["post_cuped"].var() / df["post_revenue"].var()
power_gain   = 1 / (1 - var_reduction)

print(f"CUPED:    p={p2:.4f}  effect=\${trt_cuped.mean()-ctrl_cuped.mean():.2f}")
print(f"Variance reduced by {var_reduction:.1%} — equivalent to {power_gain:.1f}x more sample")
\`\`\`

## Bayesian A/B Testing

Frequentist tests give a p-value (probability of data given null hypothesis). Bayesian tests give a posterior probability (probability the treatment is better). Bayesian results are easier to interpret and naturally handle early stopping.

\`\`\`python
# Bayesian A/B test for conversion rates (Beta-Binomial model)
from scipy.stats import beta

# Observed data
ctrl_visitors   = 8420; ctrl_conversions   = 420  # 4.99% CVR
trt_visitors    = 8380; trt_conversions    = 465  # 5.55% CVR

# Beta posterior: Beta(alpha=1 + conversions, beta=1 + (visitors - conversions))
ctrl_posterior = beta(1 + ctrl_conversions, 1 + ctrl_visitors - ctrl_conversions)
trt_posterior  = beta(1 + trt_conversions,  1 + trt_visitors  - trt_conversions)

# Monte Carlo simulation: sample from both posteriors
N_SAMPLES = 100_000
ctrl_samples = ctrl_posterior.rvs(N_SAMPLES)
trt_samples  = trt_posterior.rvs(N_SAMPLES)

prob_trt_better = np.mean(trt_samples > ctrl_samples)
expected_lift   = np.mean(trt_samples - ctrl_samples)
ci_95           = np.percentile(trt_samples - ctrl_samples, [2.5, 97.5])

print(f"P(treatment better): {prob_trt_better:.1%}")
print(f"Expected lift: {expected_lift:.4f} ({expected_lift/ctrl_posterior.mean():.1%} relative)")
print(f"95% Credible Interval: [{ci_95[0]:.4f}, {ci_95[1]:.4f}]")
\`\`\`

## Sequential Testing — Safe Early Stopping

Standard A/B tests are designed to be evaluated once at a fixed sample size. Peeking early and stopping when you see p < 0.05 inflates the false positive rate to ~30%. Sequential testing allows valid early stopping.

\`\`\`python
# Group Sequential Testing — pre-specified interim analyses
# Simple approximation: Pocock spending function

def pocock_alpha(n_interim, overall_alpha=0.05):
    """Adjusted alpha for each interim look under Pocock spending."""
    return overall_alpha / n_interim * 2.17  # Pocock constant

n_interim = 3  # 3 planned interim analyses
alpha_per_look = pocock_alpha(n_interim)

print(f"With {n_interim} interim analyses:")
print(f"Stop at p < {alpha_per_look:.4f} at each look (not 0.05)")
print(f"Final look p < {alpha_per_look:.4f}")
print("This maintains overall family-wise alpha = 0.05")
\`\`\`

## Difference-in-Differences (DiD)

DiD estimates the causal effect when randomization is impossible — comparing the change in treatment group over time vs. the change in control group over time.

\`\`\`python
# DiD: App feature released in some cities, not others
did_data = pd.DataFrame({
    "city":   ["NYC","NYC","LA","LA","Chicago","Chicago","Houston","Houston"],
    "period": ["pre","post","pre","post","pre","post","pre","post"],
    "treated":[1,1,1,1,0,0,0,0],  # NYC+LA got the feature
    "revenue":[1000,1120,850,960,920,940,780,795],
})

# DiD estimator = (Treatment Post - Treatment Pre) - (Control Post - Control Pre)
treatment_pre  = did_data[(did_data["treated"]==1) & (did_data["period"]=="pre")]["revenue"].mean()
treatment_post = did_data[(did_data["treated"]==1) & (did_data["period"]=="post")]["revenue"].mean()
control_pre    = did_data[(did_data["treated"]==0) & (did_data["period"]=="pre")]["revenue"].mean()
control_post   = did_data[(did_data["treated"]==0) & (did_data["period"]=="post")]["revenue"].mean()

did_estimate = (treatment_post - treatment_pre) - (control_post - control_pre)
counterfactual = treatment_pre + (control_post - control_pre)

print(f"Treatment change: {treatment_post - treatment_pre:.1f}")
print(f"Control change:   {control_post - control_pre:.1f}")
print(f"DiD estimate:     {did_estimate:.1f}  (causal effect)")
print(f"Counterfactual:   {counterfactual:.1f}  (what treatment would have been without intervention)")
\`\`\`

## Common Pitfalls in A/B Testing

| Pitfall | Problem | Fix |
|---------|---------|-----|
| **Peeking** | Checking p-value before sample size reached | Pre-specify sample size; use sequential testing |
| **Multiple comparisons** | Testing 10 metrics → expect 0.5 false positives at 5% alpha | Bonferroni correction or FDR (BH) adjustment |
| **Novelty effect** | Users engage more simply because something is new | Run for 2+ weeks; check if effect persists |
| **Network effects** | Treatment affects control group (social products) | Cluster randomization by user group |
| **Simpson's paradox** | Aggregate shows win but subgroups show loss | Always stratify by key segments |
| **Survivor bias** | Measuring only users who survived to the end | Intend-to-treat analysis |

## Regression Discontinuity Design (RDD)

RDD exploits a threshold (cutoff rule) as a natural experiment — e.g., users above a credit score threshold get a feature, those below don't.

\`\`\`python
# RDD: effect of discount on customers right at loyalty tier threshold
np.random.seed(42)
n = 2000
score = np.random.uniform(0, 100, n)
threshold = 60  # loyalty tier threshold

# Assignment: users with score >= 60 get the discount
treated = (score >= threshold).astype(int)

# True effect: discount increases revenue by $25
revenue = (
    50 + 1.5 * score +     # baseline trend with score
    25 * treated +          # causal treatment effect
    np.random.normal(0, 20, n)
)

df_rdd = pd.DataFrame({"score": score, "treated": treated, "revenue": revenue})

# Local linear regression on each side of the cutoff
bandwidth = 10  # only use observations within 10 points of cutoff
local = df_rdd[np.abs(df_rdd["score"] - threshold) <= bandwidth]

left  = local[local["treated"] == 0]
right = local[local["treated"] == 1]

# Estimate discontinuity
from sklearn.linear_model import LinearRegression
model_l = LinearRegression().fit(left[["score"]], left["revenue"])
model_r = LinearRegression().fit(right[["score"]], right["revenue"])

jump_at_cutoff = (
    model_r.predict([[threshold]])[0] -
    model_l.predict([[threshold]])[0]
)
print(f"RDD estimate of treatment effect: \${jump_at_cutoff:.2f} (true: $25)")
\`\`\`

## Key Takeaways

- **CUPED** can reduce variance by 30-70%, equivalent to running a much larger experiment
- **Bayesian A/B tests** give probability statements (easier for stakeholders) and handle early stopping naturally
- **Sequential testing** (group sequential or mSPRT) is required for valid early stopping — peeking invalidates results
- **DiD** is the go-to causal method when randomization is impossible — e.g., feature rollouts, policy changes
- **RDD** exploits threshold rules (credit scores, eligibility cutoffs) as natural experiments
- **Always pre-specify** your hypothesis, metric, sample size, and stopping rules before running`,
    quiz: {
      title: 'Advanced A/B Testing & Causal Inference Quiz',
      questions: [
        {
          text: 'What does CUPED (Controlled-experiment Using Pre-Experiment Data) accomplish?',
          options: opts(
            'Controls for confounding variables by randomizing the experiment design',
            'Reduces the variance of the outcome metric by partialling out a pre-experiment covariate, effectively requiring fewer users for the same statistical power',
            'Controls the experiment duration using pre-specified stopping criteria',
            'Uses pre-experiment data to set the baseline conversion rate for power calculations'
          ),
          correctAnswer: 'b',
          explanation: 'CUPED removes variance in the post-experiment metric that is explained by a pre-experiment covariate (e.g., pre-experiment revenue). Less variance → the same sample detects smaller effects → faster, cheaper experiments.',
          orderIndex: 0,
        },
        {
          text: 'What is the key advantage of Bayesian A/B testing over frequentist (p-value) testing?',
          options: opts(
            'Bayesian tests are always faster because they require less data',
            'Bayesian tests produce a probability that the treatment is better, which is directly interpretable and naturally supports early stopping',
            'Bayesian tests do not require a control group',
            'Bayesian tests eliminate the need for random assignment'
          ),
          correctAnswer: 'b',
          explanation: 'Frequentist p-values are "probability of data given null" — counterintuitive. Bayesian posterior gives "probability treatment beats control" — directly what decision-makers want. Bayesian tests also handle early stopping without inflating false positive rates.',
          orderIndex: 1,
        },
        {
          text: 'Why does "peeking" at A/B test results and stopping when p < 0.05 inflate the false positive rate?',
          options: opts(
            'Because early data has higher variance than later data',
            'Because the p-value threshold changes over time as more data arrives',
            'Because with repeated looks at accumulating data, the probability of seeing p < 0.05 by chance rises well above 5% — you are running multiple implicit tests',
            'Because early stopping removes outliers that would otherwise balance the groups'
          ),
          correctAnswer: 'c',
          explanation: 'Each peek at the data is an implicit hypothesis test. With 5 looks, the cumulative false positive rate can reach ~23% even though each individual test uses alpha=0.05. Sequential testing methods (Pocock, O\'Brien-Fleming) adjust the alpha threshold for each look.',
          orderIndex: 2,
        },
        {
          text: 'What is the Difference-in-Differences (DiD) method used for?',
          options: opts(
            'Comparing two different A/B test variants against a single control group',
            'Estimating the causal effect of a treatment when randomization is impossible, by comparing the change in a treatment group over time against the change in a comparable control group',
            'Calculating the difference in conversion rates between two A/B test groups at two different time points',
            'Adjusting for differences in baseline characteristics between treatment and control groups'
          ),
          correctAnswer: 'b',
          explanation: 'DiD computes: (Treatment_post - Treatment_pre) - (Control_post - Control_pre). The control group\'s change over time represents what WOULD have happened to the treatment group without the intervention — the counterfactual.',
          orderIndex: 3,
        },
        {
          text: 'What is the "parallel trends assumption" required for Difference-in-Differences to produce valid causal estimates?',
          options: opts(
            'Both treatment and control groups must have the same baseline metric values before the intervention',
            'Both groups must have the same number of observations in the pre and post periods',
            'In the absence of the treatment, the treatment and control groups would have followed the same trend over time',
            'The treatment must be applied in parallel to both groups simultaneously'
          ),
          correctAnswer: 'c',
          explanation: 'Parallel trends means: without the intervention, treatment and control would have changed by the same amount. This is untestable for the post period but is supported by showing similar pre-trends. It is the key identifying assumption of DiD.',
          orderIndex: 4,
        },
        {
          text: 'In a Bayesian A/B test with Beta-Binomial model, how is the posterior distribution for conversion rate formed?',
          options: opts(
            'Beta(conversions, visitors - conversions)',
            'Beta(1 + conversions, 1 + visitors - conversions)',
            'Normal(conversion_rate, standard_error)',
            'Binomial(n=visitors, p=conversion_rate)'
          ),
          correctAnswer: 'b',
          explanation: 'Using a uniform Beta(1,1) prior and Binomial likelihood, the posterior is Beta(1 + conversions, 1 + visitors - conversions). The +1 represents the prior belief of 1 success and 1 failure before seeing any data.',
          orderIndex: 5,
        },
        {
          text: 'What is Regression Discontinuity Design (RDD) and when is it appropriate?',
          options: opts(
            'A regression method that adjusts for discontinuous jumps in time-series data due to events',
            'A quasi-experimental design that estimates causal effects by exploiting a threshold rule — units just above and below a cutoff are treated as comparable',
            'A design that forces a regression model to have a discontinuous (piecewise) functional form',
            'A sampling method that creates discontinuous groups by randomly removing observations near a threshold'
          ),
          correctAnswer: 'b',
          explanation: 'RDD exploits a sharp threshold (credit score cutoff, age threshold, score boundary) where units just above and just below the cutoff are almost identical but receive different treatments — creating a local natural experiment near the boundary.',
          orderIndex: 6,
        },
        {
          text: 'Testing 10 different metrics simultaneously in an A/B test without correction inflates the false positive rate to approximately what level (at alpha=0.05)?',
          options: opts('5%', '10%', '40%', '50%'),
          correctAnswer: 'c',
          explanation: 'With 10 independent tests at alpha=0.05, the family-wise false positive rate is 1 - (0.95)^10 ≈ 40%. This is the multiple comparisons problem. Fix with Bonferroni correction (alpha/n) or Benjamini-Hochberg FDR control.',
          orderIndex: 7,
        },
        {
          text: 'What is the "novelty effect" in A/B testing and how is it mitigated?',
          options: opts(
            'Users who are new to the product behave differently from veterans — mitigated by filtering out new users',
            'A new feature generates inflated engagement simply because users are curious about the change, not because it is genuinely better — mitigated by running the experiment for 2+ full weeks',
            'Users in the novelty-seeking personality segment respond more to new features — mitigated by segmenting by user type',
            'Novel statistical methods produce different results from standard t-tests — mitigated by using multiple methods'
          ),
          correctAnswer: 'b',
          explanation: 'Novelty effect is when users click/engage with something just because it is new and unfamiliar — not because it is actually better. Running for 2+ weeks (or longer for low-frequency behaviors) allows the novelty to wear off and reveals the true long-term effect.',
          orderIndex: 8,
        },
        {
          text: 'What is CUPED\'s theta (θ) parameter and how is it calculated?',
          options: opts(
            'The target p-value threshold — calculated as alpha / number of interim analyses',
            'The regression coefficient that defines how much variance to remove — calculated as Cov(Y_post, X_pre) / Var(X_pre)',
            'The power threshold — calculated as 1 - beta where beta is the false negative rate',
            'The discount rate for future experiment observations — calculated as 1 / (1 + r)'
          ),
          correctAnswer: 'b',
          explanation: 'CUPED applies: Y_adjusted = Y_post - θ × (X_pre - mean(X_pre)). Theta is estimated as Cov(Y_post, X_pre) / Var(X_pre) — the OLS coefficient from regressing post on pre. This removes the variance in Y_post that is linearly explained by the pre-experiment covariate.',
          orderIndex: 9,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 8 (Chapters 136–140 — Advanced Business Analytics)…');

  const course = await prisma.course.findUnique({ where: { slug: 'data-analytics' } });
  if (!course) {
    console.error('❌  Course "data-analytics" not found. Run the main seed first.');
    process.exit(1);
  }

  for (const ch of CHAPTERS) {
    const existing = await prisma.chapter.findFirst({
      where: { courseId: course.id, slug: ch.slug },
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
        content:     ch.content,
        codeExample: ch.codeExample,
        language:    ch.language,
        orderIndex:  ch.orderIndex,
        xpReward:    ch.xpReward,
        difficulty:  ch.difficulty,
        tier:        ch.tier,
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

  console.log('\n🎉  AMATEUR Block 8 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
