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
  // CHAPTER 21 — BI Dashboard Design & Best Practices
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-21-bi-dashboard-design',
    title:      'BI Dashboard Design & Best Practices',
    description:'Design executive and operational dashboards that drive decisions — covering information hierarchy, chart selection, KPI frameworks, interactivity design, and the dashboard review process used at Google and Microsoft.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 121,
    xpReward:   115,
    language:   'sql',
    content: `# BI Dashboard Design & Best Practices

## What You'll Learn
A dashboard is a communication product. Beautiful charts that obscure the insight are failures; ugly charts that answer the question instantly are successes. This chapter teaches the design principles, KPI frameworks, and SQL patterns that separate junior analysts from senior ones at top firms.

---

## 1. The Dashboard Design Hierarchy

Great dashboards follow an information hierarchy that mirrors how executives consume data:

\`\`\`
Level 1 — Summary KPIs (can I see this in 3 seconds?)
Level 2 — Trend context (is this week better or worse than last?)
Level 3 — Breakdowns (which segment is driving the change?)
Level 4 — Detail drill-through (let me investigate the anomaly)
\`\`\`

**One dashboard, one question.** If your dashboard tries to answer 12 questions, it answers none of them clearly.

---

## 2. KPI Framework — OKR / North Star

Every company structures metrics in a hierarchy:

\`\`\`
North Star Metric
├── Revenue
│   ├── New MRR
│   ├── Expansion MRR
│   └── Churned MRR
├── Growth
│   ├── New Users
│   ├── Activation Rate
│   └── Retention Rate
└── Efficiency
    ├── CAC (Customer Acquisition Cost)
    ├── LTV (Lifetime Value)
    └── LTV:CAC Ratio
\`\`\`

**Designing around the North Star:**
- Every chart on the dashboard should connect to the North Star metric
- Secondary metrics provide context or explain the North Star
- Guard metrics show what you are NOT sacrificing (e.g., don't grow revenue by reducing quality)

---

## 3. SQL Patterns for Dashboard KPIs

### Week-over-Week and Month-over-Month

\`\`\`sql
WITH weekly AS (
    SELECT
        DATE_TRUNC('week', created_at)              AS week_start,
        COUNT(*)                                     AS new_users,
        SUM(revenue)                                 AS revenue,
        COUNT(*) FILTER (WHERE status = 'churned')   AS churns
    FROM events
    WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY 1
),
with_lag AS (
    SELECT
        week_start,
        new_users,
        revenue,
        churns,
        LAG(new_users, 1) OVER (ORDER BY week_start) AS prev_week_users,
        LAG(revenue,   1) OVER (ORDER BY week_start) AS prev_week_revenue
    FROM weekly
)
SELECT
    week_start,
    new_users,
    revenue,
    ROUND(
        100.0 * (new_users - prev_week_users) / NULLIF(prev_week_users, 0),
        1
    )                                                AS users_wow_pct,
    ROUND(
        100.0 * (revenue - prev_week_revenue) / NULLIF(prev_week_revenue, 0),
        1
    )                                                AS revenue_wow_pct
FROM with_lag
ORDER BY week_start;
\`\`\`

### Rolling 7-Day and 28-Day Averages

\`\`\`sql
SELECT
    event_date,
    daily_revenue,
    AVG(daily_revenue) OVER (
        ORDER BY event_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )                                   AS revenue_7d_avg,
    AVG(daily_revenue) OVER (
        ORDER BY event_date
        ROWS BETWEEN 27 PRECEDING AND CURRENT ROW
    )                                   AS revenue_28d_avg
FROM daily_revenue_summary
ORDER BY event_date;
\`\`\`

### Running Total and Cumulative Share

\`\`\`sql
SELECT
    category,
    total_revenue,
    SUM(total_revenue) OVER (ORDER BY total_revenue DESC)   AS running_total,
    ROUND(
        100.0 * SUM(total_revenue) OVER (ORDER BY total_revenue DESC)
        / SUM(total_revenue) OVER (),
        1
    )                                                       AS cumulative_pct
FROM category_revenue
ORDER BY total_revenue DESC;
-- Classic Pareto: top 20% of categories → 80% of revenue
\`\`\`

---

## 4. Dashboard Layout Principles

**The F-pattern reading order**: people read dashboards top-to-bottom, left-to-right. Put the most important KPI at top-left.

\`\`\`
┌─────────────────────────────────────────────┐
│  [KPI 1 — Most Important]  [KPI 2]  [KPI 3] │  ← Row 1: Summary KPIs
├─────────────────────────┬───────────────────┤
│  Main Trend Chart       │  Breakdown Chart  │  ← Row 2: Trends & context
│  (2/3 width)            │  (1/3 width)      │
├────────────┬────────────┴───────────────────┤
│  Segment A │  Segment B  │  Segment C       │  ← Row 3: Drill-down
└────────────┴─────────────┴──────────────────┘
\`\`\`

**Design rules:**
- **Consistent colour palette**: use one colour per metric, one accent colour for alerts
- **Minimise ink**: remove gridlines, legends, and decorations that do not add information
- **Align numbers right**: always right-align numeric columns in tables
- **One font, two sizes**: one size for labels, one for KPI numbers
- **Alert thresholds**: colour KPIs red/yellow/green based on target proximity

---

## 5. Interactivity Design

Filters and parameters should be **additive** (each filter narrows the scope) and **independent** (each filter works regardless of others):

\`\`\`
Date range picker → affects all charts
Region dropdown   → affects all charts
Product selector  → affects revenue & engagement charts only
\`\`\`

**Anti-patterns:**
- Filters that only apply to some charts (confuses users)
- Too many filter options (users won't use them)
- No default state (blank dashboards at load)
- Auto-refresh without a visible indicator (users don't know data is stale)

---

## 6. KPI Card Design

A good KPI card answers three questions in 3 seconds:
1. **What is the current value?** (large, bold number)
2. **Is it trending up or down?** (% change with arrow, colour)
3. **Is it good or bad?** (vs target, vs last period)

\`\`\`sql
-- SQL to power a KPI card: current vs prior period
SELECT
    SUM(CASE WHEN order_date >= CURRENT_DATE - 7 THEN revenue END)  AS current_7d,
    SUM(CASE WHEN order_date BETWEEN CURRENT_DATE - 14
                              AND CURRENT_DATE - 8 THEN revenue END) AS prior_7d,
    ROUND(
        100.0 * (
            SUM(CASE WHEN order_date >= CURRENT_DATE - 7 THEN revenue END) -
            SUM(CASE WHEN order_date BETWEEN CURRENT_DATE - 14
                                      AND CURRENT_DATE - 8 THEN revenue END)
        ) / NULLIF(
            SUM(CASE WHEN order_date BETWEEN CURRENT_DATE - 14
                                      AND CURRENT_DATE - 8 THEN revenue END), 0
        ),
        1
    )                                                                AS wow_pct_change
FROM orders;
\`\`\`

---

## 7. The Dashboard Review Process

Before shipping a dashboard, walk through this checklist:

\`\`\`
☐ Every chart has a title that states the insight, not just the metric
  BAD:  "Revenue"
  GOOD: "Revenue is up 12% WoW, driven by EMEA expansion"

☐ Every number has a unit (£, %, k users)
☐ Date ranges are clearly labelled on every chart
☐ Null / no-data states are handled gracefully (not blank charts)
☐ Tested with extreme values: what does it look like with 0 data? 10M rows?
☐ Load time < 5 seconds (otherwise users stop refreshing)
☐ Reviewed by at least one non-analyst (can they understand it without explanation?)
☐ Drill-through paths are documented
☐ Refresh schedule is displayed (e.g., "Updated daily at 07:00 UTC")
\`\`\`

---

## 8. Common Dashboard Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|---|---|---|
| 20 KPIs on one screen | No clear priority — everything looks equally important | Choose 3-5 hero KPIs |
| Pie chart with 8 slices | Angles are impossible to compare | Use sorted horizontal bar |
| Y-axis not starting at zero | Makes small changes look dramatic | Start at zero or clearly label truncation |
| 3-D bar charts | Perspective distortion makes values unreadable | Use flat 2-D bars |
| Charts without data labels or context | "Is 47,000 good?" — nobody knows | Add target line + prior-period comparison |
| Auto-updating without change indicators | Users miss important changes | Highlight deltas with colour arrows |

---

## Key Takeaways

- **One dashboard, one question** — decide the question before opening any BI tool.
- Structure around a **KPI hierarchy**: North Star → secondary metrics → guard metrics.
- Use **WoW/MoM/YoY SQL patterns** with LAG() — the most common BI calculation.
- Follow the **F-pattern layout**: most important at top-left, drill-down at bottom.
- A great KPI card answers: current value, trend direction, vs target — in three seconds.
- Review your dashboard with a non-analyst before shipping — if they can't read it unaided, redesign.
`,
    codeExample: `-- ── Executive Revenue Dashboard — core SQL patterns ────────────────────

-- 1. Hero KPI cards: current period vs prior period
SELECT
    period,
    revenue,
    prev_revenue,
    ROUND(100.0 * (revenue - prev_revenue) / NULLIF(prev_revenue, 0), 1) AS wow_pct
FROM (
    SELECT
        'This Week'                                                 AS period,
        SUM(CASE WHEN order_date >= CURRENT_DATE - 7
                 THEN revenue END)                                  AS revenue,
        SUM(CASE WHEN order_date BETWEEN CURRENT_DATE - 14
                               AND CURRENT_DATE - 8
                 THEN revenue END)                                  AS prev_revenue
    FROM orders
) t;

-- 2. Rolling 7-day trend (for line chart)
SELECT
    order_date,
    SUM(revenue)                                    AS daily_revenue,
    AVG(SUM(revenue)) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )                                               AS revenue_7d_avg
FROM orders
WHERE order_date >= CURRENT_DATE - 60
GROUP BY order_date
ORDER BY order_date;

-- 3. Revenue breakdown by region (for bar chart + cumulative Pareto)
SELECT
    region,
    SUM(revenue)                                            AS revenue,
    ROUND(100.0 * SUM(revenue) / SUM(SUM(revenue)) OVER(), 1) AS pct_of_total,
    SUM(SUM(revenue)) OVER (ORDER BY SUM(revenue) DESC)    AS running_total
FROM orders
WHERE order_date >= CURRENT_DATE - 30
GROUP BY region
ORDER BY revenue DESC;`,
    quiz: {
      title: 'BI Dashboard Design & Best Practices — Quiz',
      questions: [
        {
          text: 'A stakeholder complains that your dashboard answers too many questions at once. What is the primary design principle you have violated?',
          options: opts(
            'You should have used more colourful charts',
            '"One dashboard, one question" — a dashboard focused on one decision or metric hierarchy is far more usable than a general-purpose information dump',
            'You should have added more KPI cards',
            'The dashboard needs more filter options'
          ),
          correctAnswer: 'b',
          explanation: 'When a dashboard tries to answer 12 questions, it answers none clearly. Stakeholders cannot prioritise what matters. Effective dashboards are designed around a single decision context with a clear KPI hierarchy.',
          orderIndex: 1,
        },
        {
          text: 'In SQL, what does LAG(revenue, 1) OVER (ORDER BY week_start) return?',
          options: opts(
            'The revenue for the next week (lead value)',
            'The revenue from the immediately preceding week — used for period-over-period comparisons',
            'The cumulative sum of revenue up to the current week',
            'The average revenue across all weeks'
          ),
          correctAnswer: 'b',
          explanation: 'LAG(column, n) returns the value of the column n rows before the current row in the window order. LAG(revenue, 1) gives last week\'s revenue, enabling WoW calculations like (current - prior) / prior.',
          orderIndex: 2,
        },
        {
          text: 'Why should you use NULLIF(denominator, 0) in percentage change calculations?',
          options: opts(
            'It rounds the result to zero when the denominator is zero',
            'Division by zero raises a database error; NULLIF(x, 0) replaces x with NULL when x=0, causing the division to return NULL instead of an error',
            'NULLIF converts zero to one before division to produce a meaningful result',
            'It filters out rows where the denominator is zero'
          ),
          correctAnswer: 'b',
          explanation: 'NULLIF(expr, value) returns NULL if expr = value, otherwise returns expr. NULLIF(denominator, 0) means: if denominator is 0, make it NULL so the division returns NULL (not an error), which BI tools display as N/A.',
          orderIndex: 3,
        },
        {
          text: 'According to the F-pattern reading order, where should the most critical KPI be placed on a dashboard?',
          options: opts(
            'Bottom-right corner — readers finish there',
            'Top-left corner — viewers scan dashboards top-to-bottom, left-to-right',
            'Centre of the page for maximum visual emphasis',
            'Bottom-left corner — it mirrors physical document reading'
          ),
          correctAnswer: 'b',
          explanation: 'Eye-tracking research confirms users scan web-based content in an F-pattern: horizontal scan across the top, then a second horizontal scan, then vertical down the left side. Top-left gets the most attention.',
          orderIndex: 4,
        },
        {
          text: 'A good KPI card must answer which three questions in under 3 seconds?',
          options: opts(
            'Who owns the metric, when was it last updated, and which team is responsible',
            'Current value, trend direction (vs prior period), and whether it is good or bad (vs target)',
            'This year\'s total, last year\'s total, and the five-year forecast',
            'Data source, refresh schedule, and underlying SQL query'
          ),
          correctAnswer: 'b',
          explanation: 'Current value (large bold number), trend direction (% change + arrow + colour), and performance vs target (green/yellow/red) — these three elements let an executive assess a KPI at a glance without needing explanation.',
          orderIndex: 5,
        },
        {
          text: 'What is a "guard metric" in a KPI hierarchy?',
          options: opts(
            'A metric used to filter out invalid data before calculating KPIs',
            'A secondary metric that ensures you are not sacrificing one dimension while optimising another — e.g., tracking customer satisfaction while growing revenue',
            'A metric that guards access to the dashboard via row-level security',
            'A threshold that triggers an alert when a KPI falls below a set level'
          ),
          correctAnswer: 'b',
          explanation: 'Guard metrics prevent Goodhart\'s Law ("when a measure becomes a target, it ceases to be a good measure"). If you optimise revenue alone, you might raise prices and tank satisfaction. Guard metrics keep you honest.',
          orderIndex: 6,
        },
        {
          text: 'What is wrong with a chart whose y-axis starts at 50,000 instead of 0 when showing monthly revenue between 51,000 and 53,000?',
          options: opts(
            'Nothing — zooming in makes the trend easier to see',
            'The truncated axis makes a 4% increase look like a 100% increase, visually misleading viewers into overestimating the magnitude of change',
            'BI tools automatically start axes at zero and cannot be changed',
            'The chart cannot be saved to PDF if the axis does not start at zero'
          ),
          correctAnswer: 'b',
          explanation: 'Truncated y-axes are a classic data visualisation deception — whether intentional or not. A 4% WoW gain looks explosive when the bars span 97% of the chart height. Always start at zero or explicitly label the axis as truncated with a break symbol.',
          orderIndex: 7,
        },
        {
          text: 'The Pareto principle applied to a revenue breakdown means:',
          options: opts(
            'The top 100% of categories generate 100% of revenue',
            'Approximately 20% of categories (products, regions, customers) account for ~80% of total revenue — shown via a cumulative percentage column',
            'Revenue should be split evenly between 20 product categories',
            'Only 20 data points should be shown on any chart'
          ),
          correctAnswer: 'b',
          explanation: 'The 80/20 Pareto rule frequently holds in business: a small number of products, customers, or regions drive the majority of revenue. A cumulative percentage column (running_total / grand_total) in SQL reveals this instantly.',
          orderIndex: 8,
        },
        {
          text: 'A colleague\'s dashboard always shows blank charts when first opened (before filters are selected). What design rule does this violate?',
          options: opts(
            'Dashboards must load in under 1 second',
            'Dashboards should have a sensible default state — all charts should show meaningful data on load without requiring filter interaction',
            'Filters should be hidden by default and revealed on hover',
            'Each chart must have a mandatory data source label'
          ),
          correctAnswer: 'b',
          explanation: 'A blank-on-load dashboard loses users in the first 5 seconds. Always set a default date range (last 30 days), default segment (all), and default metrics so the dashboard is immediately useful without any user action.',
          orderIndex: 9,
        },
        {
          text: 'What does "Updated daily at 07:00 UTC" on a dashboard footer provide?',
          options: opts(
            'It tells users to check back at 7am if they want live data',
            'Data freshness transparency — users know whether they are looking at yesterday\'s data or real-time, which is critical for operational decisions',
            'A legal disclaimer that the data may be inaccurate',
            'Compliance with GDPR data retention policies'
          ),
          correctAnswer: 'b',
          explanation: 'Data freshness is critical for trust. A sales manager making a same-day decision needs to know: is this data from this morning or last week? Always display the refresh schedule and last-updated timestamp prominently.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 22 — Cohort Analysis
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-22-cohort-analysis',
    title:      'Cohort Analysis',
    description:'Master cohort retention analysis from scratch — build acquisition cohorts, calculate day-N and week-N retention, identify product-market fit signals, and create the retention heatmaps used at top product companies.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 122,
    xpReward:   125,
    language:   'sql',
    content: `# Cohort Analysis

## What You'll Learn
Cohort analysis is the lens through which every product-led company at scale (Spotify, Airbnb, Meta) understands retention and growth. It groups users by when they joined and tracks their behaviour over time — revealing whether your product is actually improving or just masking churn with new user growth.

---

## 1. What Is a Cohort?

A **cohort** is a group of users who share a common start event in a defined time period.

- **Acquisition cohort**: users who signed up in the same week/month
- **Behaviour cohort**: users who completed a specific action (e.g., first purchase, activated feature)
- **Revenue cohort**: customers who first paid in the same period

**Why cohorts matter**: Aggregate metrics hide the truth. If 1,000 users join per month but 900 churn each month, you look flat. Cohorts show you that the product is broken even as total users appear stable.

---

## 2. Building an Acquisition Cohort Table in SQL

\`\`\`sql
-- Step 1: Assign each user to their signup cohort (month-level)
WITH user_cohorts AS (
    SELECT
        user_id,
        DATE_TRUNC('month', created_at)::DATE       AS cohort_month
    FROM users
),

-- Step 2: Get all activity events per user
user_activities AS (
    SELECT
        user_id,
        DATE_TRUNC('month', event_date)::DATE        AS activity_month
    FROM events
    WHERE event_type = 'session'
    GROUP BY 1, 2    -- one row per user per active month
),

-- Step 3: Join and calculate months since cohort
cohort_data AS (
    SELECT
        c.cohort_month,
        a.activity_month,
        EXTRACT(MONTH FROM AGE(a.activity_month, c.cohort_month))::INT
                                                    AS months_since_signup,
        COUNT(DISTINCT c.user_id)                   AS active_users
    FROM user_cohorts c
    JOIN user_activities a USING (user_id)
    GROUP BY 1, 2, 3
),

-- Step 4: Get cohort sizes (Month 0 = size of each cohort)
cohort_sizes AS (
    SELECT cohort_month, active_users AS cohort_size
    FROM cohort_data
    WHERE months_since_signup = 0
)

-- Step 5: Calculate retention rate per cohort per month
SELECT
    cd.cohort_month,
    cd.months_since_signup,
    cd.active_users,
    cs.cohort_size,
    ROUND(
        100.0 * cd.active_users / NULLIF(cs.cohort_size, 0),
        1
    )                                               AS retention_rate_pct
FROM cohort_data cd
JOIN cohort_sizes cs USING (cohort_month)
ORDER BY cd.cohort_month, cd.months_since_signup;
\`\`\`

---

## 3. Pivoting to a Cohort Heatmap

The retention matrix pivots months as columns:

| Cohort | M0 | M1 | M2 | M3 | M6 | M12 |
|---|---|---|---|---|---|---|
| Jan 2024 | 100% | 42% | 31% | 26% | 18% | 12% |
| Feb 2024 | 100% | 45% | 34% | 28% | — | — |
| Mar 2024 | 100% | 48% | 37% | — | — | — |

**Reading the table:**
- **M0** is always 100% (by definition — the user signed up in this period)
- **Diagonal** (bottom-right) fills in as time passes
- **Column-wise comparison**: is M1 retention improving across newer cohorts?
- **Row-wise**: how quickly does a given cohort decay?

---

## 4. Pivoting in SQL (PostgreSQL crosstab)

\`\`\`sql
-- Using conditional aggregation (works on any database)
SELECT
    cohort_month,
    ROUND(MAX(CASE WHEN months_since_signup = 0 THEN retention_rate_pct END), 1) AS "M0",
    ROUND(MAX(CASE WHEN months_since_signup = 1 THEN retention_rate_pct END), 1) AS "M1",
    ROUND(MAX(CASE WHEN months_since_signup = 2 THEN retention_rate_pct END), 1) AS "M2",
    ROUND(MAX(CASE WHEN months_since_signup = 3 THEN retention_rate_pct END), 1) AS "M3",
    ROUND(MAX(CASE WHEN months_since_signup = 6 THEN retention_rate_pct END), 1) AS "M6",
    ROUND(MAX(CASE WHEN months_since_signup = 12 THEN retention_rate_pct END), 1) AS "M12"
FROM retention_rates   -- from previous CTE query
GROUP BY cohort_month
ORDER BY cohort_month;
\`\`\`

---

## 5. Cohort Analysis in Python (Pandas)

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load events
events = pd.read_csv('user_events.csv', parse_dates=['event_date'])

# Signup date per user
signup = (
    events.query("event_type == 'signup'")
    .groupby('user_id')['event_date']
    .min()
    .rename('cohort_date')
    .dt.to_period('M')    # month-level cohort
)

# Activity by user by month
events['activity_month'] = events['event_date'].dt.to_period('M')
events = events.merge(signup, on='user_id')

# Months since signup
events['months_since_signup'] = (
    events['activity_month'] - events['cohort_date']
).apply(lambda x: x.n)

# Cohort table
cohort_table = (
    events.groupby(['cohort_date', 'months_since_signup'])['user_id']
    .nunique()
    .unstack()
    .fillna(0)
)

# Retention rates
cohort_sizes = cohort_table[0]   # month 0 = cohort size
retention = cohort_table.divide(cohort_sizes, axis=0) * 100

# Heatmap
fig, ax = plt.subplots(figsize=(14, 8))
sns.heatmap(
    retention,
    annot=True, fmt='.0f', cmap='YlOrRd_r',
    vmin=0, vmax=100,
    linewidths=0.5, linecolor='white',
    cbar_kws={'label': 'Retention %'},
    ax=ax
)
ax.set_title('Monthly Cohort Retention Heatmap', fontsize=16, fontweight='bold')
ax.set_xlabel('Months Since Signup')
ax.set_ylabel('Cohort Month')
plt.tight_layout()
plt.show()
\`\`\`

---

## 6. Interpreting Cohort Signals

### Product-Market Fit Signal

A product with PMF shows a **flattening retention curve** — retention stabilises at some level rather than approaching zero. This means a core group of users keep coming back.

\`\`\`
PMF found:     100% → 42% → 31% → 28% → 27% → 27%  ← FLAT after M2
No PMF:        100% → 35% → 20% → 12% →  7% →  3%  ← continuously declining
\`\`\`

### Improving Product Signal

Column-wise improvement: if M1 retention is 40% for Jan cohort, 45% for Feb, 50% for Mar — your product changes are working.

### Seasonality vs True Improvement

Compare cohorts from the same month across different years to isolate seasonality from true retention improvement.

---

## 7. Revenue Cohort Analysis (LTV)

\`\`\`sql
-- Cumulative revenue per cohort over time
WITH cohort_revenue AS (
    SELECT
        DATE_TRUNC('month', u.created_at)::DATE     AS cohort_month,
        EXTRACT(MONTH FROM AGE(
            DATE_TRUNC('month', p.payment_date),
            DATE_TRUNC('month', u.created_at)
        ))::INT                                      AS months_since_signup,
        SUM(p.amount)                               AS monthly_revenue
    FROM users u
    JOIN payments p USING (user_id)
    GROUP BY 1, 2
)
SELECT
    cohort_month,
    months_since_signup,
    monthly_revenue,
    SUM(monthly_revenue) OVER (
        PARTITION BY cohort_month
        ORDER BY months_since_signup
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    )                                               AS cumulative_ltv
FROM cohort_revenue
ORDER BY cohort_month, months_since_signup;
\`\`\`

---

## Key Takeaways

- Cohorts group users by **start event + time period** and track their behaviour over subsequent periods.
- The retention heatmap makes both **row decay** (how fast one cohort churns) and **column improvement** (is your product getting better?) visible at once.
- **Product-Market Fit = flattening retention curve** — a horizontal asymptote above zero.
- Use SQL **LAG and conditional aggregation** to pivot cohort data; use **Pandas unstack + seaborn heatmap** for rapid prototyping.
- Always compare cohorts from the **same calendar month across different years** to control for seasonality.
`,
    codeExample: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

rng = np.random.default_rng(42)

# ── Simulate user signup + activity events ───────────────────────────────
n_users = 2000
user_ids = range(1, n_users + 1)
signup_dates = pd.to_datetime('2023-01-01') + pd.to_timedelta(
    rng.integers(0, 365, n_users), unit='D'
)
users = pd.DataFrame({'user_id': user_ids, 'signup_date': signup_dates})

# Each user is active some months after signup (random retention decay)
records = []
for _, row in users.iterrows():
    cohort = row['signup_date'].to_period('M')
    for m in range(13):
        # Simulate retention probability decaying over time
        p_active = 0.80 ** (m + 1) + 0.15   # floor at ~15%
        if rng.random() < p_active:
            records.append({'user_id': row['user_id'],
                            'cohort_month': cohort,
                            'months_since_signup': m})

df = pd.DataFrame(records)

# ── Build cohort retention table ─────────────────────────────────────────
cohort_table = (
    df.groupby(['cohort_month','months_since_signup'])['user_id']
    .nunique()
    .unstack(fill_value=0)
)
cohort_sizes = cohort_table[0]
retention = (cohort_table.div(cohort_sizes, axis=0) * 100).round(1)

# ── Plot heatmap ──────────────────────────────────────────────────────────
plt.figure(figsize=(14, 7))
sns.heatmap(
    retention.iloc[:12, :10],   # first 12 cohorts, months 0-9
    annot=True, fmt='.0f',
    cmap='YlOrRd_r', vmin=0, vmax=100,
    linewidths=0.4, linecolor='white',
    cbar_kws={'label': 'Retention %'}
)
plt.title('Monthly Cohort Retention Heatmap', fontsize=14, fontweight='bold')
plt.xlabel('Months Since Signup')
plt.ylabel('Cohort Month')
plt.tight_layout()
plt.show()

# ── Identify PMF signal ───────────────────────────────────────────────────
avg_by_month = retention.mean().round(1)
print("\\nAverage Retention by Month:")
print(avg_by_month.to_string())
plateau = avg_by_month.diff().abs().iloc[3:].mean()
print(f"\\nAvg. monthly retention drop (M3+): {plateau:.1f}%")
print("PMF signal: STRONG" if plateau < 2 else "PMF signal: WEAK")`,
    quiz: {
      title: 'Cohort Analysis — Quiz',
      questions: [
        {
          text: 'What is an acquisition cohort?',
          options: opts(
            'All users who have ever used the product',
            'A group of users who signed up or made their first purchase within the same defined time period (e.g., same month)',
            'Users who were acquired through paid advertising campaigns',
            'The top 20% of users by lifetime value'
          ),
          correctAnswer: 'b',
          explanation: 'An acquisition cohort groups users by their start event — typically signup date — within a specific time window (week, month). All users in the Jan 2024 cohort signed up in January 2024, allowing you to track how that group behaves over time.',
          orderIndex: 1,
        },
        {
          text: 'In a cohort retention table, Month 0 is always 100%. Why?',
          options: opts(
            'Month 0 data is excluded from the analysis',
            'Month 0 is the signup month — every user is counted as active by definition. It is the baseline cohort size from which all subsequent retention percentages are calculated.',
            'The database fills Month 0 with 100% automatically as a default',
            'Month 0 represents 100% of the total user base'
          ),
          correctAnswer: 'b',
          explanation: 'Retention is calculated as active_users_month_N / cohort_size (= active_users_month_0). Since Month 0 is the cohort size itself, retention_month_0 = cohort_size / cohort_size = 100%. It normalises all later periods.',
          orderIndex: 2,
        },
        {
          text: 'Comparing column M1 across cohort rows (e.g., M1 retention = 35%, 40%, 45% across three consecutive monthly cohorts) tells you:',
          options: opts(
            'Each cohort is getting smaller over time',
            'Month-1 retention is improving across newer cohorts — product or onboarding changes are making users more likely to return after the first month',
            'The oldest cohort has the highest lifetime value',
            'Churn is accelerating'
          ),
          correctAnswer: 'b',
          explanation: 'Column-wise comparison across cohort rows reveals whether product improvements are having a positive effect. Rising M1 retention across successive cohorts is one of the clearest signals that your onboarding or core product is improving.',
          orderIndex: 3,
        },
        {
          text: 'What does a "flattening" retention curve signal?',
          options: opts(
            'The product has a declining user base',
            'Product-Market Fit — a core group of users continues to return regularly, and the retention rate stabilises above zero instead of declining to zero',
            'The cohort is too old and data quality degrades',
            'The analysis window is too short to measure true retention'
          ),
          correctAnswer: 'b',
          explanation: 'A flattening curve (e.g., 100% → 40% → 28% → 25% → 25% → 25%) means some users have formed a lasting habit with the product. Continuously declining curves approaching zero indicate no sticky core users — a PMF warning sign.',
          orderIndex: 4,
        },
        {
          text: 'In the SQL cohort query, what does EXTRACT(MONTH FROM AGE(activity_month, cohort_month)) calculate?',
          options: opts(
            'The absolute calendar month number of the activity',
            'The number of months elapsed between the user\'s cohort month and the month they were active — the x-axis of the retention grid',
            'The age of the user in months at the time of the activity',
            'The number of months remaining until the user\'s subscription renews'
          ),
          correctAnswer: 'b',
          explanation: 'AGE() computes the interval between two dates. EXTRACT(MONTH FROM ...) gets the month component. For a user who signed up in January and was active in April, this returns 3 — they are in the M3 column of the retention table.',
          orderIndex: 5,
        },
        {
          text: 'Why should you compare cohorts from the same calendar month across different years to isolate product improvement?',
          options: opts(
            'Database queries run faster when dates are aligned',
            'User behaviour has seasonal patterns — comparing a January cohort to a July cohort confounds seasonality with product changes. Same-month year-over-year isolates the product effect.',
            'Privacy regulations require annual comparison windows',
            'Annual cohorts always have larger sample sizes'
          ),
          correctAnswer: 'b',
          explanation: 'January users behave differently from July users due to seasonality (New Year resolutions, summer behaviour). Comparing Jan 2023 to Jan 2024 controls for this seasonality, letting you attribute the difference to product changes.',
          orderIndex: 6,
        },
        {
          text: 'In Python, what does cohort_table.divide(cohort_sizes, axis=0) * 100 compute?',
          options: opts(
            'The total revenue per cohort divided by 100',
            'Retention rates: each cell (active users in month N) is divided by the corresponding cohort size (month-0 users), then multiplied by 100 to give a percentage',
            'The average number of actions per user per cohort',
            'It normalises the cohort table so all rows sum to 100'
          ),
          correctAnswer: 'b',
          explanation: 'cohort_table contains raw user counts. Dividing each row by its cohort size (axis=0 divides row-wise) normalises to fractions. Multiplying by 100 converts to percentage retention rates — the standard format for heatmaps.',
          orderIndex: 7,
        },
        {
          text: 'What does a revenue cohort analysis with cumulative_ltv show?',
          options: opts(
            'The total revenue from all users ever',
            'How much revenue a cohort generates cumulatively per user over time — used to estimate Lifetime Value (LTV) and when the cohort\'s revenue exceeds its acquisition cost (payback period)',
            'The revenue per individual user rather than per cohort',
            'The month in which revenue peaks for each cohort'
          ),
          correctAnswer: 'b',
          explanation: 'Cumulative LTV by cohort shows the running total revenue per cohort user over months 0, 1, 2, ... n. When cumulative LTV crosses the CAC (Customer Acquisition Cost), the cohort has "paid back" its acquisition spend — a critical metric for growth teams.',
          orderIndex: 8,
        },
        {
          text: 'Why is cohort analysis superior to tracking simple total active users over time?',
          options: opts(
            'Cohort analysis requires less data and is faster to compute',
            'Total active users mix together users from different cohorts — masking retention problems. Cohorts reveal whether newer users are retained better or worse than older ones, and whether the product is improving.',
            'Total active users cannot be segmented by region',
            'Cohort analysis is required by GDPR for reporting'
          ),
          correctAnswer: 'b',
          explanation: 'If you acquire 1,000 users/month but lose 900, total users appears stable. Cohort analysis exposes the 90% churn that aggregate metrics hide. It also reveals if retention is improving or worsening across successive cohorts.',
          orderIndex: 9,
        },
        {
          text: 'In a seaborn heatmap of retention data, what does cmap="YlOrRd_r" with vmin=0, vmax=100 achieve?',
          options: opts(
            'It applies a rainbow colour map with values scaled to 0-100',
            'It uses a reversed yellow-orange-red palette where high retention (100%) appears light/yellow and low retention approaches red-brown — making decay immediately visible',
            'It converts all values to a 0-1 scale before plotting',
            'It highlights outliers in orange and normal values in yellow'
          ),
          correctAnswer: 'b',
          explanation: 'YlOrRd_r is the reversed Yellow-Orange-Red palette. With the reversal, high values (100%) are light yellow and low values (0%) are dark red. For retention heatmaps, this means dark red = churn (bad) and light = retention (good), which is the most intuitive colour mapping.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 23 — Funnel Analysis
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-23-funnel-analysis',
    title:      'Funnel Analysis',
    description:'Measure conversion through multi-step product funnels — signup, activation, first purchase, and upsell — using SQL window functions, time-to-convert analysis, and drop-off attribution to identify and fix the highest-impact friction points.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 123,
    xpReward:   120,
    language:   'sql',
    content: `# Funnel Analysis

## What You'll Learn
Every product has a critical path users must follow to deliver value. Funnel analysis quantifies exactly where users drop off — and how much revenue that drop-off costs. This chapter teaches the SQL and Python techniques used by growth analysts at every major product company.

---

## 1. What Is a Funnel?

A funnel tracks users through a **sequential series of steps** toward a conversion goal:

\`\`\`
Visited Landing Page
        ↓  (68% continue)
Started Signup
        ↓  (54% continue)
Verified Email
        ↓  (71% continue)
Completed Profile
        ↓  (62% continue)
Made First Purchase  ← Conversion Goal
\`\`\`

**Key questions:**
- What is the conversion rate at each step?
- Where is the biggest drop-off?
- How long do users take to move between steps?
- Are certain segments (device, region, plan) converting better?

---

## 2. Building a Funnel in SQL

\`\`\`sql
-- Step 1: Identify users who completed each step
WITH step_1 AS (
    SELECT DISTINCT user_id, MIN(event_time)   AS step_1_time
    FROM events WHERE event_type = 'page_view' AND page = 'landing'
    GROUP BY user_id
),
step_2 AS (
    SELECT DISTINCT user_id, MIN(event_time)   AS step_2_time
    FROM events WHERE event_type = 'signup_start'
    GROUP BY user_id
),
step_3 AS (
    SELECT DISTINCT user_id, MIN(event_time)   AS step_3_time
    FROM events WHERE event_type = 'email_verified'
    GROUP BY user_id
),
step_4 AS (
    SELECT DISTINCT user_id, MIN(event_time)   AS step_4_time
    FROM events WHERE event_type = 'purchase'
    GROUP BY user_id
),

-- Step 2: Join sequentially — only count users who completed prior steps
funnel AS (
    SELECT
        s1.user_id,
        s1.step_1_time,
        s2.step_2_time,
        s3.step_3_time,
        s4.step_4_time
    FROM step_1 s1
    LEFT JOIN step_2 s2 ON s1.user_id = s2.user_id AND s2.step_2_time > s1.step_1_time
    LEFT JOIN step_3 s3 ON s1.user_id = s3.user_id AND s3.step_3_time > s2.step_2_time
    LEFT JOIN step_4 s4 ON s1.user_id = s4.user_id AND s4.step_4_time > s3.step_3_time
)

-- Step 3: Calculate funnel metrics
SELECT
    COUNT(*)                                    AS step_1_users,
    COUNT(step_2_time)                          AS step_2_users,
    COUNT(step_3_time)                          AS step_3_users,
    COUNT(step_4_time)                          AS step_4_users,

    -- Step-to-step conversion rates
    ROUND(100.0 * COUNT(step_2_time) / NULLIF(COUNT(*), 0), 1)           AS s1_s2_pct,
    ROUND(100.0 * COUNT(step_3_time) / NULLIF(COUNT(step_2_time), 0), 1) AS s2_s3_pct,
    ROUND(100.0 * COUNT(step_4_time) / NULLIF(COUNT(step_3_time), 0), 1) AS s3_s4_pct,

    -- Overall conversion
    ROUND(100.0 * COUNT(step_4_time) / NULLIF(COUNT(*), 0), 1)           AS overall_pct
FROM funnel;
\`\`\`

---

## 3. Time-to-Convert Analysis

Time between steps reveals friction:

\`\`\`sql
SELECT
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY
        EXTRACT(EPOCH FROM (step_2_time - step_1_time)) / 60
    )                                           AS median_mins_s1_s2,
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY
        EXTRACT(EPOCH FROM (step_3_time - step_2_time)) / 3600
    )                                           AS p90_hours_s2_s3,
    AVG(
        EXTRACT(EPOCH FROM (step_4_time - step_1_time)) / 86400
    )                                           AS avg_days_to_purchase
FROM funnel
WHERE step_4_time IS NOT NULL;   -- only converted users
\`\`\`

If 90% of converts happen within 24 hours but the median is 4 hours, a 24-hour email nudge might recover the long tail.

---

## 4. Funnel Segmentation

The most valuable insight is comparing funnel conversion by segment:

\`\`\`sql
SELECT
    u.device_type,
    COUNT(DISTINCT s1.user_id)                  AS visitors,
    COUNT(DISTINCT s4.user_id)                  AS purchasers,
    ROUND(
        100.0 * COUNT(DISTINCT s4.user_id) / NULLIF(COUNT(DISTINCT s1.user_id), 0),
        1
    )                                           AS conversion_rate
FROM step_1 s1
JOIN users u USING (user_id)
LEFT JOIN step_4 s4 ON s1.user_id = s4.user_id AND s4.step_4_time > s1.step_1_time
GROUP BY u.device_type
ORDER BY conversion_rate DESC;
\`\`\`

---

## 5. Funnel Analysis in Python

\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

steps = ['Visited', 'Signup Start', 'Email Verified', 'Profile Done', 'Purchased']
users = [10000, 6800, 3672, 2607, 1617]

fig, ax = plt.subplots(figsize=(10, 6))

colours = ['#1976D2', '#388E3C', '#F57C00', '#7B1FA2', '#D32F2F']
bar_width = 0.6

for i, (step, count, colour) in enumerate(zip(steps, users, colours)):
    bar = ax.barh(i, count, height=bar_width, color=colour, alpha=0.85)
    # Conversion rate label
    rate = count / users[0] * 100
    step_rate = count / users[i-1] * 100 if i > 0 else 100
    ax.text(count + 100, i, f'{count:,}  ({rate:.0f}% of total | {step_rate:.0f}% of prev)',
            va='center', fontsize=9)

ax.set_yticks(range(len(steps)))
ax.set_yticklabels(steps, fontsize=11)
ax.set_xlabel('Users', fontsize=11)
ax.set_title('Signup-to-Purchase Funnel', fontsize=14, fontweight='bold')
ax.invert_yaxis()
ax.set_xlim(0, users[0] * 1.45)
ax.spines[['top','right','bottom']].set_visible(False)
ax.xaxis.set_visible(False)
plt.tight_layout()
plt.show()

# Drop-off analysis
for i in range(1, len(steps)):
    dropped = users[i-1] - users[i]
    rate = dropped / users[0] * 100
    print(f"Drop at {steps[i]}: {dropped:,} users ({rate:.1f}% of total)")
\`\`\`

---

## 6. Revenue Impact of Drop-offs

Quantify each drop-off in revenue terms to prioritise fixes:

\`\`\`sql
-- Average revenue per converted user
WITH avg_rev AS (
    SELECT AVG(total_revenue) AS avg_rev_per_converter FROM user_ltv
),
funnel_counts AS (
    SELECT
        COUNT(*)             AS step_1_users,
        COUNT(step_2_time)   AS step_2_users,
        COUNT(step_3_time)   AS step_3_users,
        COUNT(step_4_time)   AS step_4_users
    FROM funnel
)
SELECT
    (step_1_users - step_2_users) * avg_rev AS revenue_lost_at_step_2,
    (step_2_users - step_3_users) * avg_rev AS revenue_lost_at_step_3,
    (step_3_users - step_4_users) * avg_rev AS revenue_lost_at_step_4
FROM funnel_counts
CROSS JOIN avg_rev;
\`\`\`

---

## 7. Common Funnel Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Not enforcing step order | Users counted in step 3 even if they skipped step 2 | Use JOIN with timestamp ordering |
| Including all historical events | Old drop-offs inflate the denominator | Filter to a specific date cohort |
| Ignoring time windows | A user who converts 90 days later skews analysis | Cap the conversion window (e.g., 30 days) |
| Not segmenting | Mobile vs desktop may have opposite conversion stories | Always segment by device, region, plan |
| Treating repeats as new entries | Users who re-enter distort the funnel | Use MIN(event_time) to capture first occurrence |

---

## Key Takeaways

- A funnel tracks users through a **sequential event path** — each step must come after the previous.
- Use **LEFT JOINs with timestamp ordering** in SQL to correctly enforce sequential steps.
- **Step-to-step conversion** reveals where friction is worst; **overall conversion** reveals total opportunity cost.
- Always **segment** your funnel — mobile vs desktop, new vs returning, by plan tier.
- **Revenue impact = users dropped × avg revenue per converter** — this prioritises which drop-offs to fix first.
- Cap the **conversion window** (e.g., 30 days) to avoid counting long-delayed conversions that distort the funnel shape.
`,
    codeExample: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)
n = 10000

# ── Simulate funnel event data ───────────────────────────────────────────
df = pd.DataFrame({
    'user_id': range(n),
    'device':  rng.choice(['mobile','desktop','tablet'], n, p=[0.55, 0.38, 0.07]),
})
# Assign drop-off: mobile converts worse
drop_probs = {'mobile': [0.60, 0.65, 0.72, 0.65],
              'desktop':[0.75, 0.80, 0.82, 0.78],
              'tablet': [0.65, 0.70, 0.75, 0.70]}

steps = ['Visited', 'Signup Start', 'Email Verified', 'Purchased']
for i, step in enumerate(steps[1:], 0):
    df[step] = df.apply(
        lambda r: 1 if i == 0 or (r[steps[i]] if steps[i] in df else 1)
        else 0, axis=1)

# Simpler direct simulation
df['step1'] = 1
df['step2'] = (rng.random(n) < df['device'].map({'mobile':0.60,'desktop':0.75,'tablet':0.65})).astype(int)
df['step3'] = df['step2'] * (rng.random(n) < df['device'].map({'mobile':0.65,'desktop':0.80,'tablet':0.70})).astype(int)
df['step4'] = df['step3'] * (rng.random(n) < df['device'].map({'mobile':0.62,'desktop':0.77,'tablet':0.68})).astype(int)

# ── Overall funnel ───────────────────────────────────────────────────────
totals = df[['step1','step2','step3','step4']].sum()
rates  = (totals / totals['step1'] * 100).round(1)
print("Overall Funnel:")
for s, t, r in zip(steps, totals, rates):
    print(f"  {s:20s}: {t:6,}  ({r:.1f}%)")

# ── Segmented by device ──────────────────────────────────────────────────
print("\\nConversion by Device:")
seg = df.groupby('device')[['step1','step4']].sum()
seg['cvr'] = (seg['step4'] / seg['step1'] * 100).round(1)
print(seg.sort_values('cvr', ascending=False).to_string())

# ── Revenue impact of mobile drop-off ────────────────────────────────────
avg_rev = 85.0
desktop_cvr = df[df.device=='desktop']['step4'].mean()
mobile_cvr  = df[df.device=='mobile']['step4'].mean()
mobile_users= (df.device == 'mobile').sum()
gap = (desktop_cvr - mobile_cvr) * mobile_users * avg_rev
print(f"\\nEstimated revenue gap if mobile matched desktop: \${gap:,.0f}")`,
    quiz: {
      title: 'Funnel Analysis — Quiz',
      questions: [
        {
          text: 'In a funnel SQL query, why do you use LEFT JOIN step_2 ON step_2.event_time > step_1.event_time?',
          options: opts(
            'LEFT JOIN ensures step 2 users are counted even if they did not complete step 1',
            'The timestamp condition enforces sequential ordering — a user is only counted in step 2 if their step-2 event happened after their step-1 event, preventing out-of-order counting',
            'It speeds up the query by limiting the join to a time range',
            'It avoids duplicate rows when users complete the same step twice'
          ),
          correctAnswer: 'b',
          explanation: 'A funnel requires sequential completion. Without timestamp ordering, a user could be counted in step 3 even if they somehow completed events out of order (e.g., due to data issues). The time condition enforces the true sequential path.',
          orderIndex: 1,
        },
        {
          text: 'Step 1 has 10,000 users, Step 2 has 6,800. What is the step-1-to-step-2 conversion rate and drop-off count?',
          options: opts(
            'Conversion: 32%, Drop-off: 3,200 users',
            'Conversion: 68%, Drop-off: 3,200 users',
            'Conversion: 68%, Drop-off: 6,800 users',
            'Conversion: 32%, Drop-off: 6,800 users'
          ),
          correctAnswer: 'b',
          explanation: 'Step conversion = 6,800/10,000 = 68%. Drop-off = 10,000 - 6,800 = 3,200 users who did not proceed. The drop-off percentage = 32% of step-1 users.',
          orderIndex: 2,
        },
        {
          text: 'What does PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY hours_to_convert) return?',
          options: opts(
            'The average hours to convert',
            'The value below which 90% of conversions occurred — the 90th percentile conversion time',
            'The top 90% of users sorted by conversion time',
            'The conversion rate for users who took more than 90 hours'
          ),
          correctAnswer: 'b',
          explanation: 'PERCENTILE_CONT(0.90) is the 90th percentile — 90% of users converted within this many hours. It is more informative than average because it shows the long tail of slow converters without being skewed by extreme outliers.',
          orderIndex: 3,
        },
        {
          text: 'Why should you use MIN(event_time) per user per step instead of all event occurrences?',
          options: opts(
            'MIN is faster to compute than individual event lookups',
            'A user who re-visits a step multiple times should only be counted once — the first occurrence. Including all visits inflates counts and distorts conversion rates.',
            'Some BI tools cannot handle multiple timestamps per user',
            'Only the most recent event is relevant for funnel analysis'
          ),
          correctAnswer: 'b',
          explanation: 'Funnel analysis counts users, not events. A user who visits the landing page 5 times is still one user at step 1. Using MIN(event_time) captures first occurrence per step, ensuring each user is counted once per step.',
          orderIndex: 4,
        },
        {
          text: 'Mobile conversion = 38%, Desktop conversion = 62%, Mobile users = 5,500, Avg revenue per converter = $90. What is the revenue gap if mobile matched desktop?',
          options: opts(
            '$118,800',
            '$118,800 — (0.62 - 0.38) × 5,500 × $90 = 0.24 × 5,500 × $90 = $118,800',
            '$198,000',
            '$342,000'
          ),
          correctAnswer: 'b',
          explanation: '(Desktop CVR - Mobile CVR) × Mobile users × Avg revenue = (0.62 - 0.38) × 5,500 × $90 = 0.24 × 5,500 × $90 = $118,800. This quantifies the revenue opportunity from closing the mobile conversion gap.',
          orderIndex: 5,
        },
        {
          text: 'What is the purpose of capping the conversion window in funnel analysis (e.g., 30 days)?',
          options: opts(
            'The database cannot store events older than 30 days',
            'Including conversions that happen 6 months later distorts the funnel shape and makes optimisation harder — a 30-day cap focuses on the typical conversion path and avoids counting stragglers who would have converted anyway',
            'GDPR requires conversion data to be deleted after 30 days',
            'A 30-day cap improves query performance by reducing the join size'
          ),
          correctAnswer: 'b',
          explanation: 'Without a time cap, a user who signed up in January and purchased in August is counted as a successful conversion. Including such long-tail conversions masks the true friction at each step. A cap (30 or 90 days) focuses on the conversion path your optimisation efforts can influence.',
          orderIndex: 6,
        },
        {
          text: 'In a horizontal bar chart of funnel steps, why should you NOT normalise all bars to 100% width?',
          options: opts(
            'Percentage-width bars are harder to read than absolute-count bars',
            'Normalising to 100% loses the visual representation of absolute drop-off magnitude — a chart where each step looks the same width hides the devastating loss of 6,200 users at step 2',
            'BI tools cannot render normalised funnel charts',
            'Normalisation is only valid when sample sizes are equal'
          ),
          correctAnswer: 'b',
          explanation: 'Absolute-width bars make the physical drop-off visible — a bar shrinking from 10,000 to 3,800 is visually alarming. 100%-normalised charts make every step appear equally important and hide how severe the losses are in absolute terms.',
          orderIndex: 7,
        },
        {
          text: 'You notice that email-verification step has a 35% drop-off for mobile users but only 8% for desktop. What is the most likely explanation?',
          options: opts(
            'Mobile users are less valuable customers',
            'The email verification UI or copy is poorly optimised for mobile — the input field, email link, or flow may not work well on small screens or mobile email clients',
            'Desktop users receive promotional discounts that mobile users do not',
            'Mobile users have worse internet connectivity'
          ),
          correctAnswer: 'b',
          explanation: 'Large segment-specific drop-offs almost always indicate a UX or technical friction specific to that segment. 35% mobile drop-off at email verification suggests the email flow is broken or difficult on mobile — a fixable product bug, not a user quality issue.',
          orderIndex: 8,
        },
        {
          text: 'What does the "revenue lost at step 3" calculation in the SQL query measure?',
          options: opts(
            'The total revenue that step-3 users generated',
            'The potential revenue that would have been earned if users who dropped off at step 3 had converted — (users at step 2 - users at step 3) × avg revenue per converter',
            'The revenue refunded by users who churned at step 3',
            'The cost of serving the users who dropped off at step 3'
          ),
          correctAnswer: 'b',
          explanation: 'Revenue lost at step N = (step_N-1_users - step_N_users) × avg_revenue. This translates drop-off counts into business impact, making it easy to prioritise which funnel step is most valuable to fix.',
          orderIndex: 9,
        },
        {
          text: 'Funnel analysis shows that 45% of users who started signup never completed it. What analysis would best reveal WHY?',
          options: opts(
            'A cohort retention heatmap of the failing users',
            'Time-to-complete analysis (P50 / P90 completion time), segmentation by device/browser/region, and session recordings of drop-off sessions to identify the exact friction point',
            'A chi-square test between signup completion and user age',
            'A linear regression of signup rate against marketing spend'
          ),
          correctAnswer: 'b',
          explanation: 'Funnel shows what (45% drop-off) but not why. Time analysis reveals if users stall at a slow step. Segmentation reveals if a specific device or browser is broken. Session recordings show the exact moment users give up — the complete investigative toolkit.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 24 — RFM Segmentation & Customer Analytics
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-24-rfm-customer-analytics',
    title:      'RFM Segmentation & Customer Analytics',
    description:'Segment customers by Recency, Frequency, and Monetary value using SQL and Python — build actionable RFM scores, identify Champions, Hibernating, and At-Risk customers, and power targeted retention campaigns.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 124,
    xpReward:   120,
    language:   'sql',
    content: `# RFM Segmentation & Customer Analytics

## What You'll Learn
RFM (Recency, Frequency, Monetary) segmentation is the most widely used customer analytics framework in e-commerce and SaaS. It groups customers by behavioural signals to identify who needs retention campaigns, who to upsell, and who to reactivate — directly tied to revenue impact.

---

## 1. The RFM Framework

| Dimension | Definition | Business signal |
|---|---|---|
| **Recency (R)** | Days since last purchase | Low R = recent = still engaged |
| **Frequency (F)** | Number of purchases in period | High F = loyal, habitual buyer |
| **Monetary (M)** | Total revenue from customer | High M = high-value |

The insight: **a customer who purchased yesterday, has bought 10 times, and has spent $5,000 is very different from one who last bought 6 months ago, bought once, and spent $20.**

---

## 2. Computing RFM in SQL

\`\`\`sql
WITH rfm_raw AS (
    SELECT
        customer_id,
        -- Recency: days since last order (lower is better)
        CURRENT_DATE - MAX(order_date)::DATE        AS recency_days,
        -- Frequency: number of orders
        COUNT(DISTINCT order_id)                    AS frequency,
        -- Monetary: total spend
        SUM(order_total)                            AS monetary
    FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL '1 year'
      AND status = 'completed'
    GROUP BY customer_id
),

rfm_scores AS (
    SELECT
        customer_id,
        recency_days,
        frequency,
        monetary,
        -- Score 1-5: NTILE(5) creates quintiles
        -- For recency: LOWER days = HIGHER score (most recent = 5)
        6 - NTILE(5) OVER (ORDER BY recency_days)  AS r_score,
        NTILE(5) OVER (ORDER BY frequency)          AS f_score,
        NTILE(5) OVER (ORDER BY monetary)           AS m_score
    FROM rfm_raw
)

SELECT
    customer_id,
    recency_days,
    frequency,
    ROUND(monetary, 2)                             AS monetary,
    r_score, f_score, m_score,
    r_score + f_score + m_score                    AS rfm_total,
    -- Composite score string for segmentation
    CONCAT(r_score, f_score, m_score)::TEXT        AS rfm_code
FROM rfm_scores
ORDER BY rfm_total DESC;
\`\`\`

---

## 3. RFM Segment Labels

Map RFM codes to meaningful business segments:

\`\`\`sql
SELECT
    customer_id, r_score, f_score, m_score, rfm_total,
    CASE
        WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4
            THEN 'Champions'
        WHEN r_score >= 3 AND f_score >= 3
            THEN 'Loyal Customers'
        WHEN r_score >= 4 AND f_score <= 2
            THEN 'New Customers'
        WHEN r_score >= 3 AND f_score >= 2 AND m_score >= 3
            THEN 'Potential Loyalists'
        WHEN r_score >= 4 AND f_score >= 2 AND m_score <= 2
            THEN 'Promising'
        WHEN r_score = 3 AND f_score <= 2
            THEN 'Need Attention'
        WHEN r_score <= 2 AND f_score >= 3 AND m_score >= 3
            THEN 'At Risk'
        WHEN r_score <= 2 AND f_score >= 4 AND m_score >= 4
            THEN 'Cannot Lose Them'
        WHEN r_score = 2 AND f_score <= 2
            THEN 'Hibernating'
        WHEN r_score = 1
            THEN 'Lost'
        ELSE 'Other'
    END                                            AS segment
FROM rfm_scores;
\`\`\`

---

## 4. RFM Segmentation in Python

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load orders
orders = pd.read_csv('orders.csv', parse_dates=['order_date'])
snapshot_date = orders['order_date'].max() + pd.Timedelta(days=1)

# Compute RFM
rfm = orders.groupby('customer_id').agg(
    recency=('order_date',  lambda x: (snapshot_date - x.max()).days),
    frequency=('order_id',  'nunique'),
    monetary=('order_total', 'sum')
).reset_index()

# Score into quintiles (1-5)
rfm['r_score'] = pd.qcut(rfm['recency'],  q=5, labels=[5,4,3,2,1]).astype(int)
rfm['f_score'] = pd.qcut(rfm['frequency'].rank(method='first'), q=5,
                          labels=[1,2,3,4,5]).astype(int)
rfm['m_score'] = pd.qcut(rfm['monetary'].rank(method='first'), q=5,
                          labels=[1,2,3,4,5]).astype(int)

rfm['rfm_total'] = rfm['r_score'] + rfm['f_score'] + rfm['m_score']
rfm['rfm_code']  = rfm['r_score'].astype(str) + rfm['f_score'].astype(str) + rfm['m_score'].astype(str)

# Segment mapping
def assign_segment(row):
    r, f, m = row.r_score, row.f_score, row.m_score
    if r >= 4 and f >= 4 and m >= 4: return 'Champions'
    if r >= 3 and f >= 3:            return 'Loyal'
    if r >= 4 and f <= 2:            return 'New Customers'
    if r <= 2 and f >= 3 and m >= 3: return 'At Risk'
    if r <= 2 and f >= 4 and m >= 4: return 'Cannot Lose Them'
    if r = 2 and f <= 2:            return 'Hibernating'
    if r == 1:                       return 'Lost'
    return 'Other'

rfm['segment'] = rfm.apply(assign_segment, axis=1)
\`\`\`

---

## 5. RFM Visualisation

### Scatter Plot (R vs F coloured by M)
\`\`\`python
fig, ax = plt.subplots(figsize=(10, 7))
scatter = ax.scatter(
    rfm['recency'], rfm['frequency'],
    c=rfm['monetary'], cmap='YlOrRd',
    alpha=0.6, s=30, edgecolors='none'
)
plt.colorbar(scatter, ax=ax, label='Monetary ($)')
ax.set_xlabel('Recency (days since last purchase)')
ax.set_ylabel('Frequency (# orders)')
ax.set_title('RFM Customer Distribution', fontsize=14, fontweight='bold')
ax.invert_xaxis()   # Left = most recent (best)
plt.tight_layout()
plt.show()
\`\`\`

### Segment Size & Revenue Bar Chart
\`\`\`python
summary = rfm.groupby('segment').agg(
    customers=('customer_id', 'count'),
    total_revenue=('monetary', 'sum'),
    avg_revenue=('monetary', 'mean')
).sort_values('total_revenue', ascending=False)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
summary['customers'].plot(kind='barh', ax=axes[0], color='#2196F3')
axes[0].set_title('Customers per Segment')
summary['total_revenue'].plot(kind='barh', ax=axes[1], color='#4CAF50')
axes[1].set_title('Revenue per Segment ($)')
plt.tight_layout()
plt.show()
\`\`\`

---

## 6. Actionable Segment Playbook

| Segment | Size | Revenue Share | Action |
|---|---|---|---|
| Champions | ~5% | ~30% | VIP programme, exclusive early access, referral programme |
| Loyal | ~15% | ~35% | Loyalty points, upsell to premium plan |
| At Risk | ~10% | ~15% | Win-back email campaign, personal outreach |
| Cannot Lose Them | ~3% | ~10% | Immediate personal sales call, special offer |
| Hibernating | ~15% | ~4% | Reactivation discount, remind of value |
| Lost | ~20% | ~1% | Low-cost reactivation or write off |
| New Customers | ~12% | ~3% | Onboarding nurture sequence, guide to first value moment |

---

## 7. Tracking Segment Migration

\`\`\`sql
-- Compare RFM segments month-over-month
SELECT
    current.segment    AS current_segment,
    prior.segment      AS prior_segment,
    COUNT(*)           AS customers
FROM rfm_segments_current current
JOIN rfm_segments_prior   prior USING (customer_id)
GROUP BY 1, 2
ORDER BY customers DESC;
-- Shows: how many customers moved from "Loyal" → "At Risk" this month?
\`\`\`

**Sankey diagram** visualisation of migration is powerful for stakeholder presentations — shows flows between segments.

---

## Key Takeaways

- **RFM = Recency, Frequency, Monetary** — the three most predictive dimensions of future customer value.
- Use **NTILE(5)** in SQL for equal-sized quintile scoring; use **pd.qcut** in Python.
- Invert recency scoring: **lower days = more recent = higher score** (use 6-NTILE trick).
- Segment labels convert numeric scores to **actionable business personas** — Champions, At Risk, Hibernating, etc.
- Track **segment migration** month-over-month: customers moving from Loyal to At Risk is an early warning signal.
- Always report both **customer count and revenue share** per segment — they are often opposite (Lost = largest count, smallest revenue).
`,
    codeExample: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

rng = np.random.default_rng(42)
n_customers = 2000
n_orders = 8000
snapshot = pd.Timestamp('2024-06-01')

orders = pd.DataFrame({
    'customer_id': rng.integers(1, n_customers + 1, n_orders),
    'order_date':  pd.to_datetime('2023-06-01') + pd.to_timedelta(
                       rng.integers(0, 365, n_orders), unit='D'),
    'order_total': np.abs(rng.normal(120, 80, n_orders)).clip(5),
    'order_id':    range(n_orders),
})

# ── Compute RFM ────────────────────────────────────────────────────────
rfm = orders.groupby('customer_id').agg(
    recency=('order_date',   lambda x: (snapshot - x.max()).days),
    frequency=('order_id',   'nunique'),
    monetary=('order_total', 'sum')
).reset_index()

rfm['r_score'] = pd.qcut(rfm['recency'],
                           q=5, labels=[5,4,3,2,1]).astype(int)
rfm['f_score'] = pd.qcut(rfm['frequency'].rank(method='first'),
                           q=5, labels=[1,2,3,4,5]).astype(int)
rfm['m_score'] = pd.qcut(rfm['monetary'].rank(method='first'),
                           q=5, labels=[1,2,3,4,5]).astype(int)
rfm['rfm_total'] = rfm[['r_score','f_score','m_score']].sum(axis=1)

def segment(r):
    R, F, M = r.r_score, r.f_score, r.m_score
    if R >= 4 and F >= 4 and M >= 4: return 'Champions'
    if R >= 3 and F >= 3:             return 'Loyal'
    if R >= 4 and F <= 2:             return 'New Customers'
    if R <= 2 and F >= 3 and M >= 3:  return 'At Risk'
    if R <= 2 and F >= 4 and M >= 4:  return 'Cannot Lose Them'
    if R == 2 and F <= 2:             return 'Hibernating'
    if R == 1:                        return 'Lost'
    return 'Other'

rfm['segment'] = rfm.apply(segment, axis=1)

# ── Summary ────────────────────────────────────────────────────────────
summary = rfm.groupby('segment').agg(
    customers=('customer_id','count'),
    revenue=('monetary','sum')
).assign(revenue_share=lambda d: (d.revenue/d.revenue.sum()*100).round(1))
print(summary.sort_values('revenue', ascending=False).to_string())

# ── RFM heatmap: avg monetary by R×F score ─────────────────────────────
heat = rfm.pivot_table(values='monetary', index='r_score',
                        columns='f_score', aggfunc='mean')
sns.heatmap(heat, annot=True, fmt='.0f', cmap='YlOrRd',
            cbar_kws={'label':'Avg Spend ($)'})
plt.title('Average Spend by R×F Score'); plt.show()`,
    quiz: {
      title: 'RFM Segmentation & Customer Analytics — Quiz',
      questions: [
        {
          text: 'In RFM scoring, why does recency scoring use 6 - NTILE(5) instead of plain NTILE(5)?',
          options: opts(
            'Subtracting from 6 converts the score to a percentage',
            'Lower recency days = more recent customer = should receive a higher score. NTILE(5) assigns 1 to the smallest values (most recent); 6-NTILE reverses this so recently active customers get score 5.',
            'NTILE(5) cannot handle date values, so the subtraction normalises them',
            'The subtraction ensures all three RFM scores are on the same scale'
          ),
          correctAnswer: 'b',
          explanation: 'NTILE(5) ordered by recency_days gives 1 to the smallest (most recent) and 5 to the largest (least recent). Since more recent is better, we reverse: 6-NTILE gives 5 to the most recent and 1 to the least recent.',
          orderIndex: 1,
        },
        {
          text: 'A customer has R=5, F=5, M=5. What segment do they belong to, and what action should you take?',
          options: opts(
            'Lost — reactivate with a discount',
            'Champions — your most valuable customers. Reward with VIP treatment, early access, referral programme. Do not discount — they are already your most loyal.',
            'New Customers — send onboarding sequence',
            'Hibernating — win-back campaign'
          ),
          correctAnswer: 'b',
          explanation: 'R=5, F=5, M=5 means recently active, most frequent buyer, highest spender — a Champion. The correct action is reward and retention, not discounting (which trains them to wait for deals) or re-engagement (they are already engaged).',
          orderIndex: 2,
        },
        {
          text: 'A customer has R=1, F=5, M=5. Which segment and action apply?',
          options: opts(
            'Champions — they spend the most',
            '"Cannot Lose Them" — they used to be top customers but have not returned recently. Requires immediate personal outreach or a compelling win-back offer.',
            'Lost — write them off',
            'Loyal — send a loyalty reward'
          ),
          correctAnswer: 'b',
          explanation: '"Cannot Lose Them" has high historical value (F=5, M=5) but has gone cold (R=1). These customers are worth immediate high-touch personal outreach — their LTV justifies significant win-back investment. Once lost, their high spending likely moves to a competitor.',
          orderIndex: 3,
        },
        {
          text: 'Why do you use pd.qcut(..., q=5) instead of pd.cut() for RFM scoring?',
          options: opts(
            'pd.qcut is faster than pd.cut',
            'pd.qcut creates equal-frequency bins (each quintile has ~20% of customers) while pd.cut creates equal-width intervals. Equal-frequency ensures each score has a similar number of customers for fair comparison.',
            'pd.cut cannot handle monetary values',
            'pd.qcut automatically assigns segment labels'
          ),
          correctAnswer: 'b',
          explanation: 'pd.cut divides the value range into equal intervals — problematic when data is skewed (e.g., 90% of monetary values below $200 but a few above $50,000). pd.qcut creates equal-count bins, ensuring each score (1-5) has roughly the same number of customers.',
          orderIndex: 4,
        },
        {
          text: 'What does rfm.groupby("segment").agg(customers=..., revenue=...) tell you that NTILE scores alone cannot?',
          options: opts(
            'It tells you the recency score of each segment',
            'It reveals both the size and revenue contribution of each segment — which may be very different. The Lost segment may be largest by count but smallest by revenue share.',
            'It produces the individual customer-level RFM scores',
            'It normalises revenue figures to account for currency differences'
          ),
          correctAnswer: 'b',
          explanation: 'Segment size and revenue share are often inversely distributed. Champions = tiny count, massive revenue. Lost = huge count, trivial revenue. Understanding both shapes resource allocation — you invest heavily in Champions even though they are few.',
          orderIndex: 5,
        },
        {
          text: 'What does "segment migration" tracking (comparing current vs prior month segments) reveal?',
          options: opts(
            'How customers moved between price tiers',
            'Which customers moved between RFM segments — e.g., Loyal → At Risk signals recent disengagement and triggers proactive retention before they become Lost',
            'How the RFM scoring algorithm changed between months',
            'The revenue impact of seasonality on each segment'
          ),
          correctAnswer: 'b',
          explanation: 'Segment migration shows directional drift. A significant flow from "Loyal" to "At Risk" between months is an early warning signal that warrants investigation: did a product change, price increase, or competitor launch cause disengagement?',
          orderIndex: 6,
        },
        {
          text: 'In the RFM scatter plot, why should you invert the x-axis (ax.invert_xaxis())?',
          options: opts(
            'It matches the direction of the y-axis (frequency) for visual symmetry',
            'Recency is measured in "days since last purchase" — lower is better. Inverting the axis puts the best customers (low recency days = recently active) on the left, which is the natural "good" position in most charts.',
            'Matplotlib requires axis inversion for scatter plots with colour encoding',
            'It prevents outlier customers from dominating the chart bounds'
          ),
          correctAnswer: 'b',
          explanation: 'With uninverted x-axis, "recently active" customers (small recency_days) cluster on the left side — counterintuitive. Inverting makes "most recent = leftmost," so Champions (recent, frequent, high value) appear at top-left, the naturally prominent position.',
          orderIndex: 7,
        },
        {
          text: 'Why must you use rank(method="first") before pd.qcut for frequency scoring?',
          options: opts(
            'rank() converts integers to floats which pd.qcut requires',
            'Many customers may have the same frequency (e.g., 1 order). Tied values create bins with unequal counts. ranking with method="first" breaks ties, enabling pd.qcut to create true equal-frequency bins.',
            'pd.qcut cannot process integer columns directly',
            'method="first" assigns higher scores to customers with earlier signup dates'
          ),
          correctAnswer: 'b',
          explanation: 'When many customers have the same frequency value (e.g., hundreds with exactly 1 order), pd.qcut cannot split them into different bins. rank(method="first") assigns unique ranks to tied values, solving the "non-unique bin edges" error.',
          orderIndex: 8,
        },
        {
          text: 'An e-commerce business has 50,000 customers. Champions = 800 customers, 28% of revenue. Lost = 12,000 customers, 1% of revenue. Where should retention budget be allocated?',
          options: opts(
            'Lost customers — they are the largest segment and represent untapped potential',
            'Champions primarily, then At Risk and Cannot Lose Them — these small segments generate massive revenue. Protecting a Champion who spends $5,000/year is far more valuable than trying to reactivate a Lost customer who spent $20.',
            'Evenly across all segments — fair resource distribution',
            'New Customers — acquiring replacements for lost ones'
          ),
          correctAnswer: 'b',
          explanation: 'RFM drives ROI-based budget allocation. A Champions customer spending $5,000/year costs almost nothing to retain (a VIP email, early access). Reactivating a Lost customer with $20 LTV costs more than they are worth. Protect the high-value segments first.',
          orderIndex: 9,
        },
        {
          text: 'What is the "snapshot date" in RFM analysis, and why does it matter?',
          options: opts(
            'The date the RFM analysis was published to the stakeholder',
            'The reference date used to calculate recency (days since last purchase = snapshot_date - max(order_date)). It must be consistent across all customers — typically the last date of the analysis period.',
            'The date the customer database was last refreshed',
            'The date the first customer signed up in the dataset'
          ),
          correctAnswer: 'b',
          explanation: 'Recency is relative — "5 days since last purchase" means different things depending on the reference date. If you use CURRENT_DATE, running the analysis on different days produces different recency values for the same customer. A fixed snapshot date ensures reproducibility.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 25 — Product Analytics & Growth Metrics
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-25-product-analytics-growth',
    title:      'Product Analytics & Growth Metrics',
    description:'Master the product analytics framework used at top tech firms — DAU/MAU, WAU stickiness, D1/D7/D30 retention, North Star metrics, feature adoption measurement, and the HEART / GSM frameworks for structuring product analysis.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 125,
    xpReward:   120,
    language:   'sql',
    content: `# Product Analytics & Growth Metrics

## What You'll Learn
Product analytics is the science of understanding how users interact with a product and using that data to drive decisions. This chapter covers the exact metric frameworks and SQL patterns used by product analysts at Google, Meta, Spotify, and Airbnb.

---

## 1. The Core Product Metrics

### Daily, Weekly, Monthly Active Users

\`\`\`sql
-- Daily Active Users (DAU): users with at least one session per day
SELECT
    DATE(event_time)        AS event_date,
    COUNT(DISTINCT user_id) AS DAU
FROM events
WHERE event_type = 'session'
GROUP BY 1
ORDER BY 1;

-- Monthly Active Users (MAU): unique users in rolling 28-day window
SELECT
    event_date,
    COUNT(DISTINCT user_id) OVER (
        ORDER BY event_date
        RANGE BETWEEN INTERVAL '27 days' PRECEDING AND CURRENT ROW
    )                       AS MAU_28d
FROM (
    SELECT DISTINCT DATE(event_time) AS event_date, user_id
    FROM events WHERE event_type = 'session'
) daily_users;
\`\`\`

### DAU/MAU Stickiness Ratio

\`\`\`sql
WITH daily AS (
    SELECT event_date, COUNT(DISTINCT user_id) AS DAU
    FROM daily_sessions GROUP BY 1
),
monthly AS (
    SELECT
        event_date,
        COUNT(DISTINCT user_id) OVER (
            ORDER BY event_date
            RANGE BETWEEN INTERVAL '27 days' PRECEDING AND CURRENT ROW
        ) AS MAU
    FROM daily_sessions
)
SELECT
    d.event_date,
    d.DAU,
    m.MAU,
    ROUND(100.0 * d.DAU / NULLIF(m.MAU, 0), 1) AS stickiness_pct
FROM daily d JOIN monthly m USING (event_date)
ORDER BY d.event_date;
-- Facebook-class stickiness: >60%. Healthy: >25%. Warning: <10%
\`\`\`

---

## 2. Day-N Retention

Day-N retention measures what fraction of users who joined on day 0 returned on day N.

\`\`\`sql
WITH new_users AS (
    SELECT user_id, MIN(DATE(event_time)) AS cohort_day
    FROM events WHERE event_type = 'signup'
    GROUP BY user_id
),
user_activity AS (
    SELECT DISTINCT user_id, DATE(event_time) AS active_day
    FROM events WHERE event_type = 'session'
)
SELECT
    n.cohort_day,
    COUNT(DISTINCT n.user_id)                                      AS d0_users,
    COUNT(DISTINCT CASE WHEN a.active_day = n.cohort_day + 1
                        THEN n.user_id END)                        AS d1_retained,
    COUNT(DISTINCT CASE WHEN a.active_day = n.cohort_day + 7
                        THEN n.user_id END)                        AS d7_retained,
    COUNT(DISTINCT CASE WHEN a.active_day = n.cohort_day + 30
                        THEN n.user_id END)                        AS d30_retained,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.active_day = n.cohort_day + 1
                        THEN n.user_id END) / COUNT(DISTINCT n.user_id), 1)  AS d1_pct,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.active_day = n.cohort_day + 7
                        THEN n.user_id END) / COUNT(DISTINCT n.user_id), 1)  AS d7_pct,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.active_day = n.cohort_day + 30
                        THEN n.user_id END) / COUNT(DISTINCT n.user_id), 1)  AS d30_pct
FROM new_users n
LEFT JOIN user_activity a USING (user_id)
GROUP BY n.cohort_day
ORDER BY n.cohort_day;
\`\`\`

**Benchmark retention rates (mobile app):**
- D1: 25–40% | D7: 10–20% | D30: 5–10%
- Above benchmark = strong product; below = onboarding/value delivery problem

---

## 3. Feature Adoption Measurement

\`\`\`sql
-- What % of DAU used Feature X this week?
WITH weekly_dau AS (
    SELECT
        DATE_TRUNC('week', event_date)     AS week_start,
        COUNT(DISTINCT user_id)            AS dau
    FROM daily_sessions
    GROUP BY 1
),
feature_users AS (
    SELECT
        DATE_TRUNC('week', event_time)     AS week_start,
        COUNT(DISTINCT user_id)            AS feature_users
    FROM events
    WHERE event_type = 'feature_x_used'
    GROUP BY 1
)
SELECT
    w.week_start,
    w.dau,
    f.feature_users,
    ROUND(100.0 * f.feature_users / NULLIF(w.dau, 0), 1) AS adoption_pct
FROM weekly_dau w
LEFT JOIN feature_users f USING (week_start)
ORDER BY w.week_start;
\`\`\`

---

## 4. The HEART Framework (Google)

HEART structures product metrics around five dimensions:

| Dimension | Metric examples |
|---|---|
| **H**appiness | NPS, CSAT, star ratings |
| **E**ngagement | Sessions per user, actions per session, DAU/MAU |
| **A**doption | New feature users / total users, activation rate |
| **R**etention | D1/D7/D30, monthly cohort retention |
| **T**ask Success | Completion rate, error rate, time-on-task |

**Usage:** for each new feature or experiment, define one metric per HEART dimension, agree on which matters most for success, and monitor all five.

---

## 5. GSM: Goals-Signals-Metrics

The Google Signals framework maps business goals to measurable metrics:

\`\`\`
Goal: Users quickly find the content they want
  Signal: Users do not have to search multiple times
    Metric: % of searches followed by another search within 30s (reformulation rate)

Goal: Users trust the product
  Signal: Users do not leave immediately after arrival
    Metric: Bounce rate < 40%
    Metric: Average session duration > 3 minutes
\`\`\`

---

## 6. North Star Metric & Growth Accounting

Every successful product company has one North Star metric that best captures delivered value.

| Company | North Star Metric |
|---|---|
| Airbnb | Nights booked |
| Spotify | Time spent listening |
| Facebook | Daily Active Users |
| Slack | Messages sent |
| Duolingo | Daily active learners |

### Growth Accounting Formula

\`\`\`
MAU change = New users + Resurrected users - Churned users
\`\`\`

\`\`\`sql
WITH user_monthly_activity AS (
    SELECT user_id, DATE_TRUNC('month', event_date)::DATE AS activity_month
    FROM daily_sessions
    GROUP BY 1, 2
),
user_status AS (
    SELECT
        curr.user_id,
        curr.activity_month AS this_month,
        CASE
            WHEN prev.user_id IS NULL AND first_month.user_id IS NOT NULL
                THEN 'New'
            WHEN prev.user_id IS NULL AND first_month.user_id IS NULL
                THEN 'Resurrected'
            WHEN prev.user_id IS NOT NULL
                THEN 'Retained'
        END AS status_this_month
    FROM user_monthly_activity curr
    LEFT JOIN user_monthly_activity prev
           ON curr.user_id = prev.user_id
          AND prev.activity_month = curr.activity_month - INTERVAL '1 month'
    -- New = first ever month
    LEFT JOIN (SELECT user_id, MIN(activity_month) AS first_month
               FROM user_monthly_activity GROUP BY 1) first_month
           ON curr.user_id = first_month.user_id
          AND curr.activity_month = first_month.first_month
)
SELECT
    this_month,
    SUM(CASE WHEN status_this_month = 'New'        THEN 1 ELSE 0 END) AS new_users,
    SUM(CASE WHEN status_this_month = 'Retained'   THEN 1 ELSE 0 END) AS retained_users,
    SUM(CASE WHEN status_this_month = 'Resurrected'THEN 1 ELSE 0 END) AS resurrected_users
FROM user_status
GROUP BY 1
ORDER BY 1;
\`\`\`

---

## 7. Session & Engagement Depth Metrics

\`\`\`sql
SELECT
    DATE(session_start)                     AS session_date,
    COUNT(DISTINCT session_id)              AS sessions,
    COUNT(DISTINCT user_id)                 AS users,
    -- Average actions per session (engagement depth)
    AVG(actions_in_session)                 AS avg_actions_per_session,
    -- Session length
    AVG(EXTRACT(EPOCH FROM (session_end - session_start)) / 60)
                                            AS avg_session_minutes,
    PERCENTILE_CONT(0.5) WITHIN GROUP (
        ORDER BY EXTRACT(EPOCH FROM (session_end - session_start)) / 60
    )                                       AS median_session_minutes,
    -- Bounce rate: sessions with only 1 action
    ROUND(
        100.0 * SUM(CASE WHEN actions_in_session = 1 THEN 1 ELSE 0 END)
        / COUNT(*), 1
    )                                       AS bounce_rate_pct
FROM sessions
GROUP BY 1
ORDER BY 1;
\`\`\`

---

## 8. Power Users Analysis

\`\`\`sql
-- Segment users by activity frequency: casual, core, power
SELECT
    user_id,
    COUNT(DISTINCT DATE(event_time)) AS active_days_30d,
    CASE
        WHEN COUNT(DISTINCT DATE(event_time)) >= 25 THEN 'Power'
        WHEN COUNT(DISTINCT DATE(event_time)) >= 10 THEN 'Core'
        WHEN COUNT(DISTINCT DATE(event_time)) >= 3  THEN 'Casual'
        ELSE 'At Risk'
    END                              AS user_tier
FROM events
WHERE event_time >= CURRENT_DATE - 30 AND event_type = 'session'
GROUP BY user_id;

-- What % of revenue comes from Power users?
SELECT
    user_tier,
    COUNT(*)        AS users,
    SUM(ltv_30d)    AS revenue,
    ROUND(100.0 * SUM(ltv_30d) / SUM(SUM(ltv_30d)) OVER(), 1) AS revenue_pct
FROM user_tiers
JOIN user_revenue USING (user_id)
GROUP BY user_tier
ORDER BY revenue DESC;
\`\`\`

---

## Key Takeaways

- **DAU/MAU stickiness** is the single most concise measure of product habit formation — target >25%.
- **D1 / D7 / D30 retention** is the product analytics standard for onboarding and long-term value measurement.
- **HEART framework**: one metric per dimension (Happiness, Engagement, Adoption, Retention, Task Success) ensures balanced measurement — no metric is gamed at the expense of another.
- **Growth accounting** (New + Resurrected - Churned) decomposes MAU change into its drivers, revealing whether growth is healthy acquisition or just churn masking.
- **North Star Metric** aligns the entire organisation on one measure of value delivered — pick it carefully because it shapes all downstream decisions.
- **Power users** are your product's evangelists — understand what they do differently and build the product to guide more users toward power-user behaviour.
`,
    codeExample: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)
n_users = 5000
dates = pd.date_range('2024-01-01', '2024-06-30', freq='D')

# ── Simulate daily sessions ───────────────────────────────────────────
records = []
for uid in range(1, n_users + 1):
    signup_day = rng.choice(range(len(dates) // 2))
    for d_idx in range(signup_day, len(dates)):
        # Retention probability decays with days since signup
        days_old = d_idx - signup_day
        p = max(0.05, 0.45 * (0.97 ** days_old))
        if rng.random() < p:
            records.append({'user_id': uid, 'event_date': dates[d_idx]})

sessions = pd.DataFrame(records)

# ── DAU & MAU ────────────────────────────────────────────────────────
dau = sessions.groupby('event_date')['user_id'].nunique().rename('DAU')
mau = (sessions.assign(month=sessions['event_date'].dt.to_period('M'))
       .groupby('month')['user_id'].nunique().rename('MAU'))

# ── DAU/MAU stickiness for each month ────────────────────────────────
monthly_dau = dau.resample('ME').mean().rename('avg_DAU')
monthly_mau = sessions.assign(m=sessions['event_date'].dt.to_period('M')) \
                       .groupby('m')['user_id'].nunique()
monthly_mau.index = monthly_mau.index.to_timestamp(how='end').normalize()
stickiness = (monthly_dau / monthly_mau * 100).round(1)

print("Monthly Stickiness (DAU/MAU %):")
print(stickiness.to_string())

# ── D1 / D7 / D30 retention ──────────────────────────────────────────
signups = sessions.groupby('user_id')['event_date'].min().rename('cohort_day')
activity = sessions.set_index('user_id')['event_date']

def day_n_retention(n):
    retained = 0
    for uid, c_day in signups.items():
        target = c_day + pd.Timedelta(days=n)
        user_days = sessions[sessions.user_id == uid]['event_date'].values
        if target in user_days:
            retained += 1
    return retained / len(signups) * 100

for n in [1, 7, 30]:
    print(f"D{n:2d} retention: {day_n_retention(n):.1f}%")`,
    quiz: {
      title: 'Product Analytics & Growth Metrics — Quiz',
      questions: [
        {
          text: 'What does a DAU/MAU stickiness ratio of 25% mean?',
          options: opts(
            '25% of all-time users are still active',
            'On any given day, 25% of the monthly active users open the app — measuring how habitual (sticky) the product is',
            '25% of daily users are also monthly subscribers',
            'The product retains 25% of users after 30 days'
          ),
          correctAnswer: 'b',
          explanation: 'DAU/MAU = (daily active users) / (monthly active users). A ratio of 0.25 (25%) means that on a typical day, a quarter of monthly users engage. Facebook aims for >60% (daily habit). <10% suggests the product is not part of daily routines.',
          orderIndex: 1,
        },
        {
          text: 'D7 retention = 15% for your mobile app. According to industry benchmarks, how does this compare?',
          options: opts(
            'Well below average — most apps achieve 40% D7',
            'Around industry benchmark for mobile apps (10-20% D7). Above 20% would indicate a strong product; below 10% would signal a serious onboarding or value problem.',
            'Excellent — only top-1% apps achieve this',
            'Below average — standard D7 for mobile apps is 50-60%'
          ),
          correctAnswer: 'b',
          explanation: 'Industry benchmarks for mobile apps: D1 ~25-40%, D7 ~10-20%, D30 ~5-10%. 15% D7 is solid. Context matters — a social app should aim higher (25%+); a niche productivity tool might accept 10%.',
          orderIndex: 2,
        },
        {
          text: 'What does the HEART framework\'s "Adoption" dimension measure?',
          options: opts(
            'User satisfaction scores from surveys',
            'The uptake of new features or the proportion of eligible users who use a specific feature — e.g., feature_users / total_users this week',
            'How quickly new users activate their accounts',
            'Revenue growth from newly acquired customers'
          ),
          correctAnswer: 'b',
          explanation: 'Adoption in HEART measures whether users are discovering and using specific features — new feature users / active users, or activation rate (users who complete the first meaningful action). It differs from Retention, which measures users returning to the overall product.',
          orderIndex: 3,
        },
        {
          text: 'Airbnb\'s North Star Metric is "Nights Booked." Why is this better than "Revenue" as a North Star?',
          options: opts(
            'Nights Booked is easier to calculate than revenue',
            'Nights Booked directly measures value delivered to both hosts and guests — it cannot be inflated by raising prices. Revenue could grow while actual bookings decline (worse for the marketplace), which would go undetected.',
            'Revenue is a lagging indicator that takes months to measure',
            'Regulatory requirements prevent using revenue as a primary metric'
          ),
          correctAnswer: 'b',
          explanation: 'A good North Star captures actual value delivered, not just financial extraction. "Nights Booked" reflects genuine host-guest matches. If Airbnb raised fees, revenue could grow even as usage fell — which would destroy long-term value. The North Star should be immune to such gaming.',
          orderIndex: 4,
        },
        {
          text: 'In the growth accounting formula (MAU change = New + Resurrected - Churned), what does "Resurrected" mean?',
          options: opts(
            'Users who upgraded from free to paid plans',
            'Previously inactive users who returned after being absent for at least one period — they were counted as churned in a prior month but are active again',
            'New users who signed up through a referral programme',
            'Users who deleted their account and re-registered'
          ),
          correctAnswer: 'b',
          explanation: 'Resurrected users were inactive (churned) in a prior period but have returned. Growth accounting separates them from truly new users to distinguish organic re-engagement (resurrected) from first-time acquisition (new). Both positive, but driven by different initiatives.',
          orderIndex: 5,
        },
        {
          text: 'What does a "bounce rate" measure in a product analytics context?',
          options: opts(
            'The rate at which users return after a subscription cancellation',
            'The percentage of sessions where users left after only one action (or immediately), indicating the landing experience or content failed to engage them',
            'How often the app crashes or fails to load',
            'The rate of users who submit negative feedback ratings'
          ),
          correctAnswer: 'b',
          explanation: 'A bounce = a session with minimal or zero engagement (user arrived and immediately left). High bounce rates on a landing page suggest a mismatch between ad promise and page content. In apps, sessions with only 1 action are similarly bounced — the user didn\'t find a reason to continue.',
          orderIndex: 6,
        },
        {
          text: 'The GSM framework maps Goals → Signals → Metrics. For "users trust the platform," what is a Signal?',
          options: opts(
            'Monthly active users increasing',
            'Users do not immediately leave after arriving — they find content relevant enough to stay. This signal is measured by metrics like session duration and bounce rate.',
            'Revenue per user increasing',
            'Customer support ticket volume decreasing'
          ),
          correctAnswer: 'b',
          explanation: 'GSM: Goal = "trust" (abstract). Signal = observable behaviour that indicates trust ("users stay and engage"). Metric = quantification of that signal (session duration > 3 min, bounce rate < 40%). Signals bridge the abstract goal to the concrete measurable.',
          orderIndex: 7,
        },
        {
          text: 'Why is "feature_users / total_DAU" a better adoption metric than raw feature_users count?',
          options: opts(
            'Division is faster to compute than raw counts',
            'Raw feature user counts grow as the product grows — normalising by DAU shows the actual adoption penetration and whether the feature is being discovered by existing users, not just more of them',
            'Total DAU is always a round number, making the ratio easier to report',
            'Feature user counts cannot be compared across products without normalisation'
          ),
          correctAnswer: 'b',
          explanation: 'If the platform grows from 10K to 50K DAU, feature users might grow from 1K to 5K — but adoption rate stays constant at 10%. Raw counts hide whether the feature is penetrating the user base or merely riding overall growth.',
          orderIndex: 8,
        },
        {
          text: 'Power users are defined as active 25+ days in the last 30. Their contribution to revenue is 5% of users, 45% of revenue. What does this tell you?',
          options: opts(
            'Power users are unprofitable — they consume too many resources',
            'Power users massively over-index on revenue relative to their count. Protecting this segment and designing pathways to guide more casual users toward power-user behaviour should be high-priority product investments.',
            'The product is underpriced — average users should pay more',
            'This is an unsustainable revenue distribution that will self-correct'
          ),
          correctAnswer: 'b',
          explanation: '5% of users driving 45% of revenue is classic power-law distribution — common and valuable. The strategic implication: (1) protect these users at all costs, (2) study what makes them power users, (3) design features and onboarding to activate more casual users into the power-user path.',
          orderIndex: 9,
        },
        {
          text: 'You are building a Day-N retention query and join new_users (signup date) to user_activity (active dates). Why must you use LEFT JOIN rather than INNER JOIN?',
          options: opts(
            'LEFT JOIN is required for date-type joins in PostgreSQL',
            'INNER JOIN would exclude users who did not return on day N — inflating the retention rate. LEFT JOIN preserves all users in the denominator, correctly producing a NULL for non-returners which COUNT(DISTINCT CASE WHEN ...) then counts as 0.',
            'LEFT JOIN is faster for large event tables',
            'INNER JOIN cannot handle the date arithmetic required for day-N calculations'
          ),
          correctAnswer: 'b',
          explanation: 'Retention = returners / all_cohort_users. INNER JOIN would silently drop users who didn\'t return, making the denominator smaller and the rate artificially higher. LEFT JOIN keeps all users — those without a day-N activity get NULL, which the CASE WHEN correctly excludes from the numerator count.',
          orderIndex: 10,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 5 (Chapters 21–25 — Business Analytics)…');

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

  console.log('\n🎉  AMATEUR Block 5 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
