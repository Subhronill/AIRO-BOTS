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
  // CHAPTER 46 — End-to-End Analytics Case Study
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-46-end-to-end-case-study',
    title:      'End-to-End Analytics Case Study: Revenue Decline Investigation',
    description: 'Walk through a complete real-world analytics investigation — from business question to root cause to recommendation — using every skill from the amateur curriculum.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 146,
    xpReward:   130,
    language:   'python',
    codeExample: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Step 1: Frame the question
# "Revenue is down 18% MoM. Why?"

# Step 2: Decompose the metric
# Revenue = Sessions × CVR × AOV

# Step 3: Diagnose each driver
metrics = pd.DataFrame({
    "period":   ["Last Month","This Month","Change"],
    "sessions": [250000, 238000, -4.8],
    "cvr_pct":  [3.2, 2.6, -18.8],     # <- The primary driver!
    "aov":      [68.5, 71.2, +3.9],
    "revenue":  [547200, 440890, -19.4],
})
print(metrics.to_string(index=False))

# Step 4: Segment the CVR drop
segment_analysis = pd.DataFrame({
    "segment":     ["Mobile", "Desktop", "Tablet"],
    "sessions_lm": [140000, 95000, 15000],
    "sessions_tm": [148000, 76000, 14000],
    "cvr_lm":      [2.8, 4.1, 3.0],
    "cvr_tm":      [2.7, 2.2, 2.9],    # Desktop CVR collapsed!
})
segment_analysis["cvr_delta"] = segment_analysis["cvr_tm"] - segment_analysis["cvr_lm"]
print(segment_analysis[["segment","cvr_lm","cvr_tm","cvr_delta"]])

# Step 5: Find when it started
# Step 6: Correlate with deployment timeline
# Step 7: Validate hypothesis with A/B test data
# Step 8: Quantify impact and make recommendation`,
    content: `# End-to-End Analytics Case Study: Revenue Decline Investigation

This chapter walks through a complete analytics investigation the way it would happen at a top-tier technology company. You will use SQL, Python, statistical testing, segmentation, funnel analysis, and executive communication — the full toolbox.

## The Problem

**Situation:** The Head of Revenue sends a Slack message at 8:45 AM:
> "Revenue is down 18% month-over-month. Dashboard attached. I need answers in my 2 PM with the CEO. What happened?"

**Your job:** Diagnose the root cause, quantify the impact, and prepare a recommendation with a fix timeline.

## Step 1 — Frame the Question with a Metric Tree

Before touching data, decompose the metric:

\`\`\`
Revenue = Sessions × Conversion Rate (CVR) × Average Order Value (AOV)

Revenue drop → Which component(s) drove it?
├── Sessions drop?     (traffic problem — marketing, SEO)
├── CVR drop?          (product problem — checkout, UX, pricing)
└── AOV drop?          (pricing problem — discounts, product mix)
\`\`\`

## Step 2 — Pull the Top-Level Numbers

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Month-over-month comparison
top_level = pd.DataFrame({
    "metric":   ["Sessions","CVR %","AOV","Revenue"],
    "last_mth": [250_000, 3.2, 68.5, 547_200],
    "this_mth": [238_000, 2.6, 71.2, 440_890],
})
top_level["change_pct"] = ((top_level["this_mth"] - top_level["last_mth"]) / top_level["last_mth"] * 100).round(2)

print(top_level.to_string(index=False))

# Contribution analysis: how much did each factor contribute to revenue drop?
base_rev = 250_000 * 0.032 * 68.5
session_impact = (238_000 - 250_000) * 0.032 * 68.5
cvr_impact     = 238_000 * (0.026 - 0.032) * 68.5
aov_impact     = 238_000 * 0.026 * (71.2 - 68.5)

print(f"\\nRevenue decomposition:")
print(f"  Session decline contribution:   {session_impact:>+,.0f}")
print(f"  CVR decline contribution:       {cvr_impact:>+,.0f}")
print(f"  AOV improvement contribution:   {aov_impact:>+,.0f}")
print(f"  Total change:                   {session_impact+cvr_impact+aov_impact:>+,.0f}")
print(f"  Actual change:                  {440_890-547_200:>+,.0f}")
\`\`\`

**Finding:** CVR is the primary driver (dropped from 3.2% to 2.6%, -18.8%). Sessions dropped slightly (-4.8%), AOV actually improved (+3.9%). The problem is the funnel, not traffic.

## Step 3 — Segment the CVR Drop

\`\`\`python
# Segment by device type
device_analysis = pd.DataFrame({
    "device":     ["Mobile", "Desktop", "Tablet"],
    "sessions_lm":[140_000, 95_000, 15_000],
    "sessions_tm":[148_000, 76_000, 14_000],
    "cvr_lm":     [2.8, 4.1, 3.0],
    "cvr_tm":     [2.7, 2.2, 2.9],
})

device_analysis["session_delta"] = device_analysis["sessions_tm"] - device_analysis["sessions_lm"]
device_analysis["cvr_delta"]     = device_analysis["cvr_tm"] - device_analysis["cvr_lm"]

# Impact: how much revenue did each segment's CVR change cost?
device_analysis["revenue_impact"] = (
    device_analysis["sessions_tm"] *
    (device_analysis["cvr_tm"] - device_analysis["cvr_lm"]) / 100 *
    71.2
)

print(device_analysis[["device","sessions_lm","sessions_tm","cvr_lm","cvr_tm","cvr_delta","revenue_impact"]].to_string(index=False))
\`\`\`

**Finding:** Desktop CVR collapsed from 4.1% to 2.2% (-1.9pp), contributing -$128K. Mobile CVR barely changed. Desktop sessions also dropped by 20K. **The problem is desktop-specific.**

## Step 4 — Funnel Analysis

\`\`\`python
# Funnel comparison: last month vs this month, desktop only
funnel = pd.DataFrame({
    "step":    ["Landing Page", "Product Page", "Add to Cart", "Checkout", "Purchase"],
    "users_lm":[95_000, 68_000, 32_000, 18_000, 3_895],
    "users_tm":[76_000, 54_000, 25_000, 8_400, 1_672],
})

funnel["step_rate_lm"] = funnel["users_lm"] / funnel["users_lm"].shift(1).fillna(funnel["users_lm"].iloc[0])
funnel["step_rate_tm"] = funnel["users_tm"] / funnel["users_tm"].shift(1).fillna(funnel["users_tm"].iloc[0])
funnel["rate_delta"]   = (funnel["step_rate_tm"] - funnel["step_rate_lm"]) * 100

print("Desktop Funnel (Drop Rates):")
print(funnel[["step","step_rate_lm","step_rate_tm","rate_delta"]].to_string(index=False))
\`\`\`

**Finding:** The biggest drop is at **Checkout → Purchase** (step rate dropped from 21.7% to 19.9%) and **Product Page → Add to Cart**. But the most dramatic absolute drop is **Add to Cart → Checkout** (56.3% → 33.6%). Something broke in the checkout flow on desktop.

## Step 5 — When Did It Start?

\`\`\`python
# Daily CVR by device — when did the desktop CVR diverge?
np.random.seed(42)
days = pd.date_range("2024-10-01", "2024-10-31")

daily = pd.DataFrame({
    "date":       days,
    "desktop_cvr":np.concatenate([
        np.random.normal(4.1, 0.15, 14),   # Oct 1-14: normal
        np.random.normal(2.3, 0.20, 17),   # Oct 15-31: broken
    ]),
    "mobile_cvr": np.random.normal(2.8, 0.12, 31),  # unchanged
})

fig, ax = plt.subplots(figsize=(13, 5))
ax.plot(daily["date"], daily["desktop_cvr"], color="#003087", label="Desktop CVR", linewidth=2)
ax.plot(daily["date"], daily["mobile_cvr"],  color="#FF6B35", label="Mobile CVR",  linewidth=2, alpha=0.7)
ax.axvline(pd.Timestamp("2024-10-15"), color="red", linestyle="--", label="Oct 15 — Deploy v2.4.1")
ax.annotate("CVR drops here", xy=(pd.Timestamp("2024-10-15"), 3.7),
            xytext=(pd.Timestamp("2024-10-10"), 3.2),
            arrowprops=dict(arrowstyle="->", color="red"), color="red", fontsize=10)
ax.set_title("Daily Conversion Rate by Device — October 2024")
ax.set_ylabel("CVR (%)")
ax.legend()
ax.spines[["top","right"]].set_visible(False)
plt.tight_layout()
plt.show()
\`\`\`

**Finding:** Desktop CVR dropped sharply on **October 15** — the same day as the v2.4.1 deployment. Check the changelog.

## Step 6 — Statistical Validation

\`\`\`python
# Validate: is the CVR difference statistically significant?
from scipy.stats import chi2_contingency

# Contingency table: converted vs. not converted
contingency = np.array([
    [3_895,  95_000 - 3_895],   # last month: converted, not converted
    [1_672,  76_000 - 1_672],   # this month
])

chi2, p_value, dof, expected = chi2_contingency(contingency)
print(f"Chi-squared: {chi2:.2f}")
print(f"p-value:     {p_value:.2e}")
print(f"Statistically significant: {p_value < 0.05}")

# Relative risk
rr = (1_672/76_000) / (3_895/95_000)
print(f"Relative risk: {rr:.3f} (desktop CVR is {(1-rr)*100:.1f}% lower this month)")
\`\`\`

## Step 7 — The Root Cause

**Hypothesis (confirmed):** The v2.4.1 release on October 15 introduced a JavaScript error on the desktop checkout page that prevented the "Confirm Order" button from firing correctly on Chrome 118+. Safari and Firefox were unaffected, which is why mobile (mostly Safari) was barely impacted.

**Evidence chain:**
1. Revenue dropped 18% MoM → mostly CVR drop
2. CVR drop is entirely desktop (-1.9pp)
3. Drop started Oct 15 = v2.4.1 deploy date
4. Funnel shows Add-to-Cart → Checkout step collapsed on desktop
5. Error log shows 400+ JS errors per hour on \`/checkout\` starting Oct 15

## Step 8 — Quantify Impact & Recommend

\`\`\`python
# Impact calculation
normal_desktop_cvr = 4.1 / 100
broken_desktop_cvr = 2.2 / 100
daily_desktop_sessions = 76_000 / 31  # avg per day

revenue_lost_per_day = (normal_desktop_cvr - broken_desktop_cvr) * daily_desktop_sessions * 71.2
days_broken = 17
total_impact = revenue_lost_per_day * days_broken

print(f"Revenue lost per day:   {revenue_lost_per_day:>10,.0f}")
print(f"Days broken (17):       {days_broken:>10d}")
print(f"Total revenue impact:   {total_impact:>10,.0f}")
print(f"Projected monthly loss: {revenue_lost_per_day * 30:>10,.0f}")
\`\`\`

## The 2 PM Executive Summary (SCQA Format)

**Situation:** Revenue is down 18% MoM ($547K → $441K), a $106K shortfall.

**Complication:** A JavaScript error introduced in the v2.4.1 deployment on Oct 15 broke the desktop checkout flow on Chrome 118+. Desktop CVR dropped from 4.1% to 2.2%, accounting for 83% of the revenue decline.

**Action taken:** Engineering has identified the bug (the new payment widget conflicts with Chrome 118's Content Security Policy). Hotfix v2.4.2 is in QA and will be deployed tonight.

**Recommendation:**
1. **Immediate (tonight):** Deploy v2.4.2 hotfix — estimated 90% CVR recovery within 24 hours
2. **This week:** Add automated checkout smoke tests for major browsers to the CI pipeline
3. **This month:** Implement real-time CVR alerting — this should have been caught within 2 hours, not 17 days

**Financial impact of fix:** Restoring CVR to 4.1% on current traffic would add approximately $5,300/day in incremental revenue.

## The Analyst's Diagnostic Checklist

When asked "why did metric X change?", always follow:
1. **Decompose** the metric (A × B × C) — isolate which factor changed
2. **Segment** by device, geography, traffic source, user type, product category
3. **When** did it start? Correlate with releases, campaigns, external events
4. **Funnel drill-down** — which step changed most?
5. **Statistical test** — is it significant or noise?
6. **Root cause hypothesis** — what process/change explains the pattern?
7. **Quantify impact** — in dollars, not percentages
8. **Recommend** a fix with timeline and success metric`,
    quiz: {
      title: 'End-to-End Analytics Case Study Quiz',
      questions: [
        {
          text: 'What is a "metric tree" decomposition and why is it the first step in any investigation?',
          options: opts(
            'A hierarchical database schema for storing KPIs and their sub-metrics',
            'Breaking a top-level metric into its multiplicative or additive components to identify which driver changed — e.g., Revenue = Sessions × CVR × AOV',
            'A decision tree model trained to predict which metric will change next',
            'A visual hierarchy of all metrics from strategic to operational level'
          ),
          correctAnswer: 'b',
          explanation: 'Metric tree decomposition prevents wasted investigation time. If Revenue = Sessions × CVR × AOV, and you prove CVR is the only changed component, you can immediately narrow from "revenue investigation" to "funnel investigation" — saving hours of analysis.',
          orderIndex: 0,
        },
        {
          text: 'In the case study, the contribution analysis showed CVR caused most of the revenue drop. What did this enable?',
          options: opts(
            'It allowed the analyst to close the investigation without further analysis',
            'It provided the p-value needed to declare statistical significance',
            'It immediately focused the investigation on the funnel rather than traffic or pricing — eliminating two entire investigation branches',
            'It determined that the problem was caused by a marketing campaign change'
          ),
          correctAnswer: 'c',
          explanation: 'Contribution analysis quantifies how much each factor (sessions, CVR, AOV) contributed to the total change. When CVR accounts for 85%+ of the drop, you stop investigating sessions and pricing — this focus is what makes investigations fast.',
          orderIndex: 1,
        },
        {
          text: 'The funnel analysis showed the biggest drop at "Add to Cart → Checkout". What should the analyst do next?',
          options: opts(
            'Immediately escalate to engineering without further analysis',
            'Run a chi-squared test comparing all funnel steps to determine which is statistically significant',
            'Correlate the timing of that step drop with product releases, A/B tests, or infrastructure changes to identify the cause',
            'Increase the conversion rate target to account for the seasonal drop'
          ),
          correctAnswer: 'c',
          explanation: 'Knowing WHERE in the funnel the drop occurred is half the answer. The other half is WHEN — correlating with deployment timelines, A/B test start dates, and external events (Google algorithm updates, competitor changes) identifies the root cause.',
          orderIndex: 2,
        },
        {
          text: 'Why is a chi-squared test used to validate the CVR difference rather than a t-test?',
          options: opts(
            'Chi-squared is faster and requires less computation than a t-test',
            'The t-test cannot handle data where the sample size exceeds 10,000',
            'CVR is a proportion (converted vs not converted), requiring a categorical test. Chi-squared or z-test for proportions is appropriate; t-test is for continuous data',
            'Chi-squared is the only test compatible with time-series data from web analytics'
          ),
          correctAnswer: 'c',
          explanation: 'Conversion is a binary outcome (converted: yes/no). The correct statistical tests are chi-squared contingency test or z-test for proportions. The t-test is for comparing means of continuous measurements — using it for conversion rates is technically incorrect.',
          orderIndex: 3,
        },
        {
          text: 'The case study recommends adding "automated checkout smoke tests for major browsers to the CI pipeline." What type of problem does this prevent?',
          options: opts(
            'Prevents revenue forecasting errors by validating input data quality',
            'Prevents the same class of browser-specific JavaScript bugs from reaching production undetected by automatically running end-to-end checkout tests on Chrome, Safari, and Firefox before each deploy',
            'Prevents data engineers from pushing malformed event data to the analytics warehouse',
            'Prevents dashboard staleness by automatically refreshing KPI calculations on each deployment'
          ),
          correctAnswer: 'b',
          explanation: 'The root cause was a Chrome-specific JS bug that slipped through testing. Browser smoke tests in CI would have caught "checkout button does not work on Chrome 118" before deployment, preventing 17 days of revenue loss. Root cause analysis should always produce process improvements.',
          orderIndex: 4,
        },
        {
          text: 'What is the SCQA framework and how was it applied in the executive summary?',
          options: opts(
            'Statistical Confidence Quality Assurance — a data validation framework for reports',
            'Situation, Complication, Question, Answer — a narrative structure where you start with agreed facts, introduce the problem, then deliver the answer',
            'Segmentation, Causality, Quantification, Action — the four steps of every analytics investigation',
            'Strategic, Customer, Quality, Agility — a balanced scorecard framework for executive reporting'
          ),
          correctAnswer: 'b',
          explanation: 'SCQA: Situation (agreed context), Complication (the disrupting problem), Question (what naturally arises), Answer (recommendation). It creates a compelling narrative that leads executives from shared understanding to clear action.',
          orderIndex: 5,
        },
        {
          text: 'Why is it more effective to present the impact as "$5,300/day in additional revenue from fixing the bug" rather than "CVR will recover from 2.2% to 4.1%"?',
          options: opts(
            'Dollar amounts are more precise than percentage changes',
            'Revenue impact is in units executives care about and can directly compare to engineering effort — making the business case for the fix self-evident',
            'CVR percentages require explanation of what CVR means while revenue needs no explanation',
            'Dollar amounts convey the magnitude regardless of company size or scale'
          ),
          correctAnswer: 'b',
          explanation: '"Fix this bug → earn $5,300/day" makes a direct ROI case: a 2-engineer fix for 1 day costs roughly $2,000 in salary → payback in <12 hours. Presenting CVR percentages alone leaves the business case implicit and requires executives to do math you should have done for them.',
          orderIndex: 6,
        },
        {
          text: 'In the diagnostic checklist, why should you "segment by device, geography, traffic source" before looking at root cause?',
          options: opts(
            'Segmentation is required by data privacy regulations before individual-level analysis',
            'Segmentation isolates which sub-populations drove the change — a problem affecting only one segment points directly to a component, policy, or system specific to that segment',
            'Segment-level analysis is always more statistically powerful than aggregate analysis',
            'Segmentation is required to match the granularity of source data in the data warehouse'
          ),
          correctAnswer: 'b',
          explanation: 'If desktop CVR dropped 46% but mobile CVR held flat, the problem is desktop-specific (UI, browser, payment widget) — not a general checkout issue. Segmentation narrows the hypothesis space dramatically, preventing days of wasted broad investigation.',
          orderIndex: 7,
        },
        {
          text: 'The recommendation includes "implement real-time CVR alerting." What key improvement does this represent?',
          options: opts(
            'It replaces the need for manual dashboard review entirely',
            'It shifts anomaly detection from reactive (discovered 17 days later by revenue miss) to proactive (alert within 2 hours of anomaly), dramatically reducing the blast radius of future incidents',
            'It allows the data team to automatically revert deployments when CVR drops',
            'It provides a leading indicator of CVR changes before they impact revenue'
          ),
          correctAnswer: 'b',
          explanation: 'The bug was live for 17 days before being caught — causing $106K in losses. Real-time monitoring with automated alerting (rolling z-score anomaly on checkout CVR) would have flagged the problem within 2 hours of the deploy, reducing the revenue impact to a few thousand dollars.',
          orderIndex: 8,
        },
        {
          text: 'What is the analyst\'s role after identifying the root cause in a revenue investigation?',
          options: opts(
            'Provide the raw data to engineering and let them determine the business impact',
            'Quantify the impact in business terms, recommend a specific fix with a timeline, define a success metric, and ensure the post-mortem produces process improvements',
            'Archive the investigation findings in a Confluence page for future reference',
            'Present all possible hypotheses without recommending a specific path to avoid being wrong'
          ),
          correctAnswer: 'b',
          explanation: "A senior analyst doesn't just diagnose — they prescribe. Quantify the impact (not just percentages), recommend the specific fix (not vague 'investigate further'), define the success metric ('CVR back to 4.1% within 24 hours of deploy'), and drive process improvement to prevent recurrence.",
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 47 — Building Your Data Analytics Portfolio
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-47-analytics-portfolio',
    title:      'Building Your Data Analytics Portfolio',
    description: 'Create a portfolio that gets you hired — project selection, GitHub structure, storytelling in notebooks, and how top-firm recruiters evaluate analytics candidates.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 147,
    xpReward:   115,
    language:   'python',
    codeExample: `# Portfolio project structure template (README.md skeleton)

"""
PROJECT: Customer Churn Prediction — TechCorp SaaS

BUSINESS QUESTION
─────────────────
Which customers are most likely to churn in the next 30 days,
and what interventions have the highest expected ROI?

DATASET
───────
- 50,000 customers, 18 months of subscription data
- Source: Synthetic data based on real SaaS patterns
- Features: usage logs, support tickets, billing events, NPS scores

METHODOLOGY
───────────
1. EDA → identify top churn predictors
2. Feature engineering → recency, frequency, support sentiment
3. Model: XGBoost with SHAP explanations (ROC-AUC = 0.89)
4. Business translation → segment by churn risk × LTV
5. ROI model → prioritize top 500 accounts for CSM outreach

KEY FINDING
───────────
Customers who reduced product usage by >30% in any 14-day
window are 4.2x more likely to churn. Early intervention
at that trigger is projected to prevent $180K ARR in churn.

SKILLS DEMONSTRATED
───────────────────
Pandas · Scikit-learn · SHAP · Plotly · SQL · Statistical Testing
"""

# Project README badge block
badges = [
    "![Python](https://img.shields.io/badge/Python-3.10-blue)",
    "![scikit-learn](https://img.shields.io/badge/sklearn-1.3-orange)",
    "![License](https://img.shields.io/badge/License-MIT-green)",
]
print("\\n".join(badges))`,
    content: `# Building Your Data Analytics Portfolio

Your GitHub profile is your working résumé. For data analytics roles at Google, Amazon, and Microsoft, recruiters specifically request GitHub links. A strong portfolio can get you interviews that your degree and years of experience alone would not. A weak portfolio (or none) filters you out before the phone screen.

## What Recruiters Actually Look For

**At top firms, recruiters and hiring managers look for:**

1. **Can you turn a vague business question into an analysis?** — not just "clean data and make charts"
2. **Do you write clean, readable code?** — commented, structured, reproducible
3. **Can you communicate findings to a non-technical audience?** — notebooks with narrative
4. **Do you know what tools to use and when?** — SQL, Python, visualization, statistics
5. **Are your projects real and interesting?** — not just Titanic/Iris tutorial reproductions

## Portfolio Structure

\`\`\`
github.com/yourname/
├── README.md              ← Professional intro + project index
├── data-analytics-portfolio/
│   ├── 01_revenue_investigation/
│   │   ├── README.md      ← Business context, findings, skills
│   │   ├── analysis.ipynb ← Main notebook
│   │   ├── data/          ← Sample data (never real PII)
│   │   └── figures/       ← Exported charts
│   ├── 02_customer_churn_prediction/
│   ├── 03_marketing_mix_model/
│   ├── 04_ab_testing_framework/
│   └── 05_geospatial_analysis/
└── sql-practice/
    ├── window_functions.sql
    ├── advanced_aggregations.sql
    └── data_quality_checks.sql
\`\`\`

## The 5 Portfolio Projects That Get Interviews

### Project 1: End-to-End Diagnostic Analysis
\`\`\`
Scenario:  "Revenue declined 18% MoM. Investigate and recommend."
Skills shown: Metric tree, segmentation, funnel analysis, root cause, impact quantification
Output: Executive-style Jupyter notebook + 5-slide summary
\`\`\`

### Project 2: Predictive ML with Business Impact
\`\`\`
Scenario:  "Build a churn prediction model and recommend interventions."
Skills shown: Feature engineering, model selection, SHAP, A/B test design for validation
Output: Documented notebook with ROI calculation
\`\`\`

### Project 3: SQL Analytics Showcase
\`\`\`
Scenario:  Public dataset (NYC taxi, Airbnb, etc.) — full analysis in SQL only
Skills shown: Window functions, CTEs, cohort analysis, funnel queries
Output: GitHub repo with well-commented SQL + result screenshots
\`\`\`

### Project 4: Dashboard / Interactive Visualization
\`\`\`
Scenario:  Live Plotly Dash app or Tableau Public dashboard
Skills shown: Data modeling, Plotly, Dash callbacks, self-serve design
Output: Live URL in portfolio
\`\`\`

### Project 5: Domain-Specific Analysis
\`\`\`
Scenario:  Something from your target industry (fintech, e-commerce, health, SaaS)
Skills shown: Domain knowledge + data skills = differentiation
Output: Blog post + GitHub repo
\`\`\`

## Writing a Great Project README

\`\`\`markdown
# Customer Churn Prediction — SaaS Company

## Business Question
Which customers are most likely to churn in the next 30 days,
and what interventions have the highest ROI?

## Dataset
- 50,000 SaaS customers, 18 months of events
- Features: usage logs, support tickets, NPS, billing events
- Source: Synthetic data modeled on real SaaS patterns

## Approach
1. EDA → identify churn signals in usage patterns
2. Feature engineering → recency/frequency/support metrics
3. XGBoost model (ROC-AUC = 0.89, PR-AUC = 0.76)
4. SHAP interpretation → top 5 feature drivers
5. Business segmentation → churn risk × LTV quadrant
6. ROI model → intervention prioritization

## Key Finding
Customers who reduce usage by >30% in any 14-day window
are 4.2× more likely to churn. Early CSM outreach at this
trigger is projected to prevent $180K ARR annually.

## Skills Demonstrated
Pandas · XGBoost · SHAP · Plotly · SQL · Statistical Testing

## Results
| Metric | Value |
|--------|-------|
| ROC-AUC | 0.89 |
| Precision at top-500 | 74% |
| Projected ARR saved | $180K |
\`\`\`

## Jupyter Notebook Best Practices

\`\`\`python
# ── Professional notebook structure ──

# Cell 1: Business context (Markdown)
# "This analysis investigates..."

# Cell 2: Executive summary (Markdown) — write LAST, put FIRST
# "Key finding: ..."

# Cell 3: Setup — all imports at the top
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import GradientBoostingClassifier

# Configure consistent style
plt.rcParams["figure.dpi"] = 120
sns.set_theme(style="whitegrid", palette="deep")
pd.set_option("display.max_columns", 50)
pd.set_option("display.float_format", "{:.3f}".format)

# Cell 4: Data loading with comments
df = pd.read_csv("data/customer_data.csv", parse_dates=["signup_date","last_active"])
print(f"Loaded {len(df):,} rows, {df.shape[1]} columns")
print(f"Date range: {df.signup_date.min().date()} to {df.signup_date.max().date()}")

# Always document your data
print("\\nColumn descriptions:")
schema = {
    "customer_id":    "Unique customer identifier",
    "monthly_spend":  "Average monthly recurring revenue (USD)",
    "support_tickets":"Support tickets submitted in last 90 days",
    "churned":        "Target: 1 if churned within 30 days, 0 otherwise",
}
for col, desc in schema.items():
    print(f"  {col}: {desc}")
\`\`\`

## Publishing & Visibility

\`\`\`python
# ── Actions that maximize portfolio visibility ──

portfolio_actions = {
    "GitHub profile": [
        "Pin your 6 best projects",
        "Write a professional bio with focus area",
        "Add contact info and LinkedIn",
        "Contribute to open-source projects in your domain",
    ],
    "Kaggle": [
        "Participate in competitions — even top 30% shows effort",
        "Write public notebooks for competitions",
        "Comment on high-voted notebooks to build network",
    ],
    "Technical writing": [
        "Medium / Towards Data Science articles",
        "Link articles from GitHub project READMEs",
        "Turn each portfolio project into a 600-word post",
    ],
    "LinkedIn": [
        "Post a 5-sentence summary of each project with a chart",
        "Tag skills: Python, SQL, Machine Learning, Data Visualization",
        "Connect with recruiters at target companies",
    ],
}

for platform, actions in portfolio_actions.items():
    print(f"\\n{platform}:")
    for action in actions:
        print(f"  - {action}")
\`\`\`

## Portfolio Checklist Before Applying

- [ ] At least 3-5 completed, polished projects with READMEs
- [ ] At least one project with a live demo (Dash app, Tableau Public, Streamlit)
- [ ] At least one SQL-heavy project
- [ ] At least one ML project with business impact quantification
- [ ] All notebooks run cleanly top-to-bottom with fresh kernel
- [ ] No PII or company-confidential data in any repository
- [ ] GitHub pinned repos show your best work, not all work
- [ ] LinkedIn profile links to GitHub and mentions top projects

## What NOT to Put in Your Portfolio

- Homework assignments or tutorial notebooks with no original analysis
- Projects where you are "still working on it" — only finished projects
- Raw data dumps without interpretation
- Code that only works on your machine (missing requirements.txt)
- The Titanic survival prediction if that is your only ML project`,
    quiz: {
      title: 'Building Your Analytics Portfolio Quiz',
      questions: [
        {
          text: 'According to top-firm recruiting practices, what do hiring managers primarily look for in an analytics portfolio?',
          options: opts(
            'The number of projects and lines of code committed to GitHub',
            'Proficiency in all major tools (Tableau, Power BI, Python, R, SQL) demonstrated simultaneously',
            'Evidence of turning vague business questions into insights, clean readable code, and communication of findings to non-technical audiences',
            'Academic credentials and competition rankings on Kaggle'
          ),
          correctAnswer: 'c',
          explanation: 'Top firms care about business impact and communication, not tool count. They want to see you took a messy, ambiguous business problem, structured it, analyzed it, and communicated findings clearly — that is the job description.',
          orderIndex: 0,
        },
        {
          text: 'What is the most important element of a project README that most junior analysts omit?',
          options: opts(
            'The list of all Python libraries used with exact version numbers',
            'The business question and key finding expressed in business terms with quantified impact',
            'The data source URL and download instructions',
            'The author contact information and license type'
          ),
          correctAnswer: 'b',
          explanation: 'Most portfolios document methodology but skip the business context and impact. "Found that reducing usage >30% in 14 days → 4.2× churn risk, intervention prevents $180K ARR" is what recruiters remember. It shows you understand business, not just code.',
          orderIndex: 1,
        },
        {
          text: 'Why should a live demo (Dash app, Tableau Public dashboard) be included in at least one portfolio project?',
          options: opts(
            'Live demos prove the project is not plagiarized',
            'Interactive demos are the only way to demonstrate visualization skills',
            'A live URL lets recruiters instantly interact with your work without setting up Python — dramatically increasing the chance they engage with your project',
            'Live demos are required by top firms as part of the application process'
          ),
          correctAnswer: 'c',
          explanation: 'Recruiters have 30 seconds per portfolio. A live URL that opens immediately to an interactive dashboard > a notebook they have to clone, install dependencies for, and run. Lower friction = higher engagement = more likely they spend time understanding your work.',
          orderIndex: 2,
        },
        {
          text: 'What is the recommended professional notebook structure for portfolio projects?',
          options: opts(
            'Code first, then charts, then interpretation at the end',
            'Executive summary written first (shown at top), then setup, data description, analysis with narrative markdown cells throughout, and key findings highlighted',
            'Full methodological appendix first, then main analysis, then executive summary',
            'Raw exploratory analysis exactly as you worked through it, showing all dead ends'
          ),
          correctAnswer: 'b',
          explanation: 'Lead with the conclusion (executive summary) even in a notebook. Then walk through the analysis with narrative markdown explaining what and why at each step. Busy readers can stop after the executive summary; detailed readers can follow the full analysis.',
          orderIndex: 3,
        },
        {
          text: 'Which type of project MOST differentiates a candidate at top technology companies?',
          options: opts(
            'Titanic survival prediction with 95% accuracy using ensemble methods',
            'Complete reproduction of a published research paper\'s statistical analysis',
            'Domain-specific project combining industry knowledge with data skills, showing business impact quantification',
            'A project demonstrating proficiency in the most popular tools (TensorFlow, Spark, Kubernetes)'
          ),
          correctAnswer: 'c',
          explanation: "Titanic and Iris are seen by every recruiter — they demonstrate tutorials were completed, not problem-solving ability. A domain-specific project (e-commerce funnel, fintech fraud, healthcare utilization) combined with business impact ($X revenue, Y% improvement) is genuinely rare and memorable.",
          orderIndex: 4,
        },
        {
          text: 'What is the primary risk of putting unfinished or "work in progress" projects in your portfolio?',
          options: opts(
            'It violates GitHub terms of service to publish incomplete code',
            'Recruiters may form a negative impression of your ability to deliver completed work, and unfinished projects with no README or results signal lack of follow-through',
            'Unfinished notebooks cannot be run, making them invisible to recruiters',
            'In-progress projects cannot demonstrate statistical skills since results are not yet known'
          ),
          correctAnswer: 'b',
          explanation: 'Portfolios should only contain finished, polished work. An incomplete project with no README or partial analysis signals "I started but did not finish" — the opposite of the reliable, delivery-focused analyst top firms hire. Quality over quantity always.',
          orderIndex: 5,
        },
        {
          text: 'What should you configure at the top of a professional Jupyter notebook?',
          options: opts(
            'Only the pip install commands for all dependencies',
            'All imports, display settings (dpi, float format, max_columns), random seeds, and a brief docstring explaining the notebook\'s purpose',
            'Only the markdown executive summary cell so readers see results first',
            'The git commit hash to ensure reproducibility'
          ),
          correctAnswer: 'b',
          explanation: 'Professional setup cells: all imports at the top, consistent matplotlib/seaborn style, pandas display options, and a fixed random seed for reproducibility. This shows professional habits. A docstring explaining the notebook\'s purpose helps readers immediately.',
          orderIndex: 6,
        },
        {
          text: 'When writing a technical blog post about a portfolio project, what is the optimal length and structure?',
          options: opts(
            'Long-form deep-dive (3,000+ words) covering every methodological detail',
            '600-1,000 words focused on the business question, key finding, one key chart, and the methodology summary — linking to the full GitHub notebook for technical depth',
            'Tweet-length (280 characters) with a chart attached',
            'Exactly the same content as the GitHub README with no modifications'
          ),
          correctAnswer: 'b',
          explanation: '600-1,000 words hits the sweet spot: long enough to explain the insight and approach, short enough that busy data professionals read it fully. The chart is the most shareable element. The GitHub link sends technical readers to the full analysis.',
          orderIndex: 7,
        },
        {
          text: 'What common mistake do junior analysts make in SQL portfolio projects?',
          options: opts(
            'Using window functions, which are considered too advanced for portfolio work',
            'Choosing datasets that are too small for meaningful SQL optimization',
            'Writing queries that produce correct output but lack comments, meaningful aliases, and structured formatting — showing SQL knowledge but not professional quality',
            'Uploading SQL files directly instead of wrapping them in a Python notebook'
          ),
          correctAnswer: 'c',
          explanation: 'Junior SQL portfolios often show "it works" but not "it is readable and maintainable." Professional SQL uses clear aliases (t.customer_id not t.cid), column comments explaining derived logic, consistent formatting, and a README explaining what business question each query answers.',
          orderIndex: 8,
        },
        {
          text: 'What is the most actionable step to take immediately after completing a portfolio project?',
          options: opts(
            'Submit it to Kaggle as a public dataset for others to analyze',
            'Apply for jobs that specifically list the tools used in the project',
            'Post a 5-sentence LinkedIn summary of the project with one key chart, linking to the GitHub repo',
            'Archive it in a private repository until the full portfolio is complete'
          ),
          correctAnswer: 'c',
          explanation: 'LinkedIn posts about completed projects build your professional brand, attract recruiters, and often lead to direct messages from hiring managers. Even a 5-sentence post with one compelling chart can generate significant visibility. Do not wait for a "full" portfolio — publish each project as it is completed.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 48 — Data Analytics Interview Preparation
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-48-interview-preparation',
    title:      'Data Analytics Interview Preparation',
    description: 'Ace SQL rounds, case studies, take-home assignments, and behavioral interviews at top firms — with the frameworks, practice questions, and insider strategies that work.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 148,
    xpReward:   125,
    language:   'sql',
    codeExample: `-- ── Interview-style SQL questions with answers ──

-- Q1: "Find the top 3 products by revenue in each category this quarter"
WITH ranked AS (
    SELECT
        category,
        product_name,
        SUM(revenue) AS total_revenue,
        RANK() OVER (PARTITION BY category ORDER BY SUM(revenue) DESC) AS rnk
    FROM orders
    WHERE order_date >= DATE_TRUNC('quarter', CURRENT_DATE)
    GROUP BY category, product_name
)
SELECT category, product_name, total_revenue
FROM ranked WHERE rnk <= 3;

-- Q2: "Calculate 7-day rolling average revenue per user"
SELECT
    user_id,
    event_date,
    revenue,
    AVG(revenue) OVER (
        PARTITION BY user_id
        ORDER BY event_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS revenue_7d_avg
FROM user_revenue;

-- Q3: "What is the month-over-month revenue growth rate?"
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(revenue) AS revenue
    FROM orders GROUP BY 1
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    ROUND((revenue - LAG(revenue) OVER (ORDER BY month)) /
          LAG(revenue) OVER (ORDER BY month) * 100, 2) AS mom_growth_pct
FROM monthly;`,
    content: `# Data Analytics Interview Preparation

The analytics interview at Google, Microsoft, Amazon, Meta, and similar firms has a predictable structure. Preparing specifically for each stage dramatically improves your success rate.

## Interview Stages at Top Firms

\`\`\`
1. Recruiter Screen (30 min)
   → Resume fit, salary, timeline

2. Technical Phone Screen (45-60 min)
   → SQL query writing (live coding)
   → Stats/probability question
   → One business case question

3. Take-Home Assignment (3-7 days)
   → Real dataset, open-ended business question
   → Evaluated on: approach, code quality, insights, communication

4. Onsite / Virtual Onsite (4-5 hours)
   → 1-2 SQL rounds
   → 1 case study / analytical thinking round
   → 1 stats/ML round
   → 1-2 behavioral rounds

5. Hiring Committee Review
   → Written evaluations + leveling decision
\`\`\`

## SQL Interview Questions

These are the most commonly tested patterns:

### Window Functions (asked in ~80% of SQL rounds)

\`\`\`sql
-- "Find users who made purchases on 3 or more consecutive days"
WITH daily_purchases AS (
    SELECT user_id, DATE(created_at) AS purchase_date
    FROM orders
    GROUP BY 1, 2
),
with_row_num AS (
    SELECT
        user_id,
        purchase_date,
        purchase_date - INTERVAL '1 day' * ROW_NUMBER()
            OVER (PARTITION BY user_id ORDER BY purchase_date) AS grp
    FROM daily_purchases
)
SELECT user_id, COUNT(*) AS consecutive_days
FROM with_row_num
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;

-- "Calculate the percentage of total revenue each product contributes"
SELECT
    product_name,
    SUM(revenue) AS product_revenue,
    ROUND(SUM(revenue) / SUM(SUM(revenue)) OVER () * 100, 2) AS pct_of_total
FROM orders
GROUP BY product_name
ORDER BY product_revenue DESC;

-- "Find users who churned (no purchase in last 30 days but purchased before)"
SELECT DISTINCT user_id
FROM orders
WHERE user_id NOT IN (
    SELECT DISTINCT user_id
    FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
)
AND order_date < CURRENT_DATE - INTERVAL '30 days';
\`\`\`

### Self-Joins and Retention

\`\`\`sql
-- "Calculate 7-day retention rate"
WITH first_session AS (
    SELECT user_id, MIN(DATE(session_date)) AS first_day
    FROM sessions
    GROUP BY user_id
),
d7_active AS (
    SELECT DISTINCT s.user_id
    FROM sessions s
    JOIN first_session f USING (user_id)
    WHERE DATE(s.session_date) BETWEEN f.first_day + 6 AND f.first_day + 8
)
SELECT
    f.first_day AS cohort_date,
    COUNT(DISTINCT f.user_id) AS new_users,
    COUNT(DISTINCT d7.user_id) AS retained_d7,
    ROUND(COUNT(DISTINCT d7.user_id) * 100.0 /
          COUNT(DISTINCT f.user_id), 1) AS d7_retention_pct
FROM first_session f
LEFT JOIN d7_active d7 USING (user_id)
GROUP BY f.first_day
ORDER BY f.first_day;
\`\`\`

### A/B Test Results Query

\`\`\`sql
-- "Analyze an A/B test: which variant had higher purchase rate?"
SELECT
    variant,
    COUNT(DISTINCT user_id)                          AS users,
    COUNT(DISTINCT CASE WHEN purchased THEN user_id END) AS purchasers,
    ROUND(COUNT(DISTINCT CASE WHEN purchased THEN user_id END) * 100.0
          / COUNT(DISTINCT user_id), 2)              AS purchase_rate_pct,
    SUM(revenue)                                     AS total_revenue,
    ROUND(SUM(revenue) / COUNT(DISTINCT user_id), 2) AS revenue_per_user
FROM ab_experiment
GROUP BY variant;
\`\`\`

## The Analytics Case Study Framework

For case study questions ("Product X is seeing a 20% drop in DAU — how would you investigate?"), use:

\`\`\`
Framework: DREAM
  D — Define the metric clearly (what exactly is DAU measuring?)
  R — Reason about causes (brainstorm externally and internally)
  E — Examine the data (what would you pull? what segments?)
  A — Analyze root cause (funnel, cohort, device, geography)
  M — Make a recommendation (specific, with success metric)
\`\`\`

**Example answer structure:**

> "First I want to clarify — is this a drop in new users, existing users returning, or both? I'd decompose DAU into new + returning + resurrected users.
>
> For the data examination, I'd pull: daily active users segmented by (1) platform (iOS/Android/Web), (2) user cohort vintage, (3) geography, (4) entry point. I'd correlate the timing with recent releases, marketing changes, and competitive events.
>
> My hypothesis tree would be: external factor (Google algorithm change, competitor release) vs. internal factor (regression in a recent deploy). If the drop started on a specific date that matches a release — that's my first hypothesis.
>
> I'd conclude with a specific next step: A/B test reverting the suspect feature for 10% of users while we diagnose."

## Statistics Questions

Common topics:

\`\`\`python
from scipy import stats
import numpy as np

# "Explain p-value in plain English"
# Answer: "The probability of observing a result as extreme as yours IF
#          the null hypothesis were true. Low p-value = data is unusual
#          under the null — not proof the alternative is true."

# "What sample size do you need to detect a 1pp lift in a 5% CVR?"
from scipy.stats import norm

def sample_size(baseline, mde, alpha=0.05, power=0.80):
    z_a = norm.ppf(1 - alpha/2)
    z_b = norm.ppf(power)
    p   = baseline
    q   = p + mde
    mu  = (p + q) / 2
    n = ((z_a + z_b)**2 * 2 * mu * (1-mu)) / mde**2
    return int(np.ceil(n))

n = sample_size(0.05, 0.01)
print(f"Required n per group: {n:,}")  # ~7,325

# "What is selection bias?"
# Answer: "When the sample is not representative of the population you
#          want to generalize to. Example: surveying churned customers
#          about why they churned misses customers who almost churned
#          but didn't — so you optimize for the wrong segment."

# "Explain the central limit theorem practically"
# Answer: "Sample means follow a normal distribution for large n,
#          regardless of the population distribution. This is why
#          t-tests work even on non-normal metrics like revenue —
#          as long as n is large enough (typically 30+)."
\`\`\`

## Take-Home Assignment Tips

\`\`\`python
# Structure every take-home as:

take_home_structure = {
    "1. Executive Summary": "2-3 sentences: what you found and what to do",
    "2. Problem Framing":   "Restate the business question in your own words",
    "3. Data Overview":     "Shape, missing values, date range, key statistics",
    "4. Exploratory Analysis": "3-5 key charts with narrative",
    "5. Modeling / Analysis":  "Approach, results, validation",
    "6. Insights":             "Business-English findings, each quantified",
    "7. Recommendations":      "Specific, actionable, with success metrics",
    "8. Limitations":          "What you could not do with this data/time",
}

# Quality checklist
checklist = [
    "Notebook runs top-to-bottom with fresh kernel",
    "All charts have titles, labeled axes, and a headline insight",
    "Numbers have units and context (not just '3.2%', but '3.2% CVR vs 4.1% benchmark')",
    "Recommendations are specific and include an owner/timeline",
    "You answered the question asked, not a more interesting question",
    "requirements.txt or notebook environment is documented",
]
\`\`\`

## Behavioral Questions (STAR Format)

\`\`\`
Situation  → Context and setting
Task       → What you were responsible for
Action     → What YOU specifically did
Result     → Quantified outcome

Common questions:
- "Tell me about a time you influenced a decision with data."
- "Describe a time your analysis was wrong. What happened?"
- "How did you handle a stakeholder who disagreed with your findings?"
- "Tell me about the most complex analysis you have done."
- "How do you prioritize competing analysis requests?"
\`\`\`

## Salary Negotiation

\`\`\`python
negotiation_tips = [
    "ALWAYS wait for them to give a number first",
    "Research levels: L3/L4/L5 at Google, IC4/IC5 at Meta — know the band",
    "Counter with specific data: 'Based on Levels.fyi and my current offer, I was expecting X'",
    "Total comp = base + bonus + equity (RSU/ESOP) — negotiate equity, not just base",
    "Get all offers in writing before negotiating with any one company",
    "A 10% counter-offer is almost always accepted — leave money on the table never",
]
\`\`\`

## Interview Prep Timeline

| Week | Focus |
|------|-------|
| Week 1-2 | SQL practice (LeetCode hard, Mode Analytics, StrataScratch) |
| Week 3 | Stats review (p-values, CLT, regression, A/B testing) |
| Week 4 | Product case study practice (3-4 full mock answers out loud) |
| Week 5 | Take-home assignment practice (complete one 48-hour project) |
| Week 6 | Behavioral stories (write STAR answers for 8 key questions) |
| Week 7+ | Mock interviews (peer interviews, Pramp, Interviewing.io) |`,
    quiz: {
      title: 'Data Analytics Interview Preparation Quiz',
      questions: [
        {
          text: 'In a SQL interview, which pattern is most commonly tested at FAANG-level companies?',
          options: opts(
            'Simple GROUP BY with HAVING clause',
            'Window functions (RANK, LAG/LEAD, SUM OVER, ROW_NUMBER) applied to business problems',
            'Basic SELECT with WHERE and ORDER BY clauses',
            'Database normalization and schema design questions'
          ),
          correctAnswer: 'b',
          explanation: 'Window functions appear in ~80% of advanced SQL rounds because they test nuanced SQL knowledge beyond basic aggregations. Key patterns: running totals, period-over-period comparisons with LAG, ranking within groups with RANK/DENSE_RANK, rolling averages with ROWS BETWEEN.',
          orderIndex: 0,
        },
        {
          text: 'Using the DREAM framework for a case study, what does the "D" step accomplish?',
          options: opts(
            'It documents all assumptions made during the analysis',
            'It clarifies exactly what the metric measures — preventing you from solving the wrong problem or making incorrect decompositions',
            'It designs the statistical test needed to validate the hypothesis',
            'It determines which datasets are available for the analysis'
          ),
          correctAnswer: 'b',
          explanation: '"Define the metric" prevents a common interview mistake: assuming you know what DAU, revenue, or engagement means without clarifying. Interviewers often intentionally leave metrics ambiguous to test whether you ask clarifying questions — a key senior analyst skill.',
          orderIndex: 1,
        },
        {
          text: 'What is the ideal structure for answering "Product X is seeing a 20% drop in DAU. How would you investigate?"',
          options: opts(
            'Immediately name 3-5 possible root causes and pick the most likely one',
            'Decompose the metric, segment it by dimensions (platform/cohort/geography), correlate the timing with changes, form a testable hypothesis, and recommend a specific next action',
            'Ask for a SQL dump of all user events and state you will investigate offline',
            'Reference a similar case from a previous job and describe how you solved it'
          ),
          correctAnswer: 'b',
          explanation: 'The best answers show a structured diagnostic process: decompose → segment → correlate timing → hypothesize → validate. Interviewers are evaluating whether you have a repeatable analytical framework, not whether you know the specific answer.',
          orderIndex: 2,
        },
        {
          text: 'How should you structure a take-home assignment to maximize your evaluation score?',
          options: opts(
            'Focus entirely on model accuracy — higher metrics always impress more than business context',
            'Start with Executive Summary (answer first), then methodology, charts with narrative, quantified insights, specific recommendations, and document limitations',
            'Show all exploratory paths including dead ends to demonstrate thoroughness',
            'Use as many different tools as possible (R, Python, SQL, Tableau) to demonstrate breadth'
          ),
          correctAnswer: 'b',
          explanation: 'Evaluators often start with the executive summary and stop if it is weak. Answer first (Pyramid Principle), then justify with methodology. Quantified insights and specific recommendations are the differentiators — not model complexity or visualization count.',
          orderIndex: 3,
        },
        {
          text: 'What SQL query pattern identifies users who were active before but have not been active in the last 30 days (churned users)?',
          options: opts(
            'SELECT user_id FROM users WHERE last_active < CURRENT_DATE - 30',
            'Users in the historical active table who do NOT appear in the recent 30-day active table (NOT IN / LEFT JOIN WHERE NULL pattern)',
            'SELECT user_id FROM users GROUP BY user_id HAVING MAX(session_date) < CURRENT_DATE - 30',
            'Both B and C are correct approaches'
          ),
          correctAnswer: 'd',
          explanation: 'Both approaches work: (B) NOT IN subquery or LEFT JOIN...WHERE NULL checks absence from recent activity. (C) GROUP BY user_id HAVING MAX(session_date) < 30 days ago also finds users whose last activity was over 30 days ago. Both are valid interview answers.',
          orderIndex: 4,
        },
        {
          text: 'What is the correct plain-English explanation of a p-value of 0.03?',
          options: opts(
            'There is a 97% probability that the alternative hypothesis is true',
            'If the null hypothesis were true, the probability of observing data as extreme as this (or more extreme) by chance alone is 3%',
            'The observed effect is 3% larger than what would be expected under the null hypothesis',
            'There is a 3% probability that the null hypothesis is correct'
          ),
          correctAnswer: 'b',
          explanation: 'A p-value is P(data | H0) — the probability of the data given the null is true, not the probability the null is true. "Given nothing is going on, seeing this result by chance has only a 3% probability" — that is the correct interpretation.',
          orderIndex: 5,
        },
        {
          text: 'When answering a behavioral question, which format is recommended?',
          options: opts(
            'PREP: Point, Reason, Example, Point',
            'STAR: Situation, Task, Action, Result — with quantified Result',
            'SOAR: Situation, Obstacle, Action, Result',
            'FAB: Feature, Advantage, Benefit'
          ),
          correctAnswer: 'b',
          explanation: 'STAR is the universal standard for behavioral interviews. Critically: the Result must be quantified when possible ("reduced analysis time by 40%", "drove $200K incremental revenue"). Vague results like "the team was happy" are weak answers.',
          orderIndex: 6,
        },
        {
          text: 'What is the recommended approach for salary negotiation at a top technology firm?',
          options: opts(
            'Accept the first offer to show enthusiasm and avoid appearing greedy',
            'Ask for exactly 10% more than the current base salary',
            'Wait for them to give a number first, research comp bands (Levels.fyi), negotiate total comp including equity, and always get offers in writing before countering',
            'Only negotiate salary, never equity, since RSU vesting is too complex to compare'
          ),
          correctAnswer: 'c',
          explanation: 'At tech firms, total comp = base + bonus + equity. Equity often represents 30-60% of compensation. Research the exact level (L4 vs L5 at Google) on Levels.fyi for market data. Counter-offers of 10-15% above the initial offer are almost always expected and accepted.',
          orderIndex: 7,
        },
        {
          text: 'In the retention analysis SQL query, why is a LEFT JOIN used rather than an INNER JOIN when checking for Day-7 retention?',
          options: opts(
            'LEFT JOIN is faster than INNER JOIN for large datasets',
            'LEFT JOIN preserves all users in the cohort — including those who did NOT return on Day 7. INNER JOIN would only show retained users and make the denominator wrong',
            'INNER JOIN does not support date range conditions in the ON clause',
            'LEFT JOIN allows NULL values in the join column, which represents users with no session data'
          ),
          correctAnswer: 'b',
          explanation: 'Retention = retained / total. You need all cohort members in the denominator. LEFT JOIN from first_session to d7_active preserves users who did not return (they get NULL from the right side). INNER JOIN would only return retained users, making retention appear 100%.',
          orderIndex: 8,
        },
        {
          text: 'What is the most common mistake analysts make on take-home assignments that costs them the offer?',
          options: opts(
            'Using Python instead of R, which is preferred by most analytics teams',
            'Spending too much time on model accuracy and not enough on business framing, insight communication, and actionable recommendations',
            'Including too many visualizations when a text summary would be more concise',
            'Not using the most advanced statistical methods available'
          ),
          correctAnswer: 'b',
          explanation: 'Evaluators commonly report: "Great analysis, but no clear business recommendation" or "Impressive model, but I still do not know what they think we should do." The take-home is a communication exercise as much as a technical one — always end with specific, actionable recommendations.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 49 — Analytics Leadership & Stakeholder Management
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-49-analytics-leadership',
    title:      'Analytics Leadership & Stakeholder Management',
    description: 'Lead analytics projects, manage stakeholder expectations, prioritize competing requests, build data culture, and grow from analyst to analytics lead.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 149,
    xpReward:   115,
    language:   'python',
    codeExample: `# Analytics team prioritization framework

import pandas as pd

# The RICE scoring model for analytics requests
requests = pd.DataFrame({
    "request": [
        "Churn prediction model for CSM team",
        "Revenue dashboard refresh",
        "Ad-hoc query: marketing want list",
        "A/B test analysis: checkout redesign",
        "Data quality audit of user table",
    ],
    "reach":   [5000, 200, 10, 8000, 100000],  # users/week impacted
    "impact":  [3, 2, 1, 3, 2],   # 1=low 2=med 3=high per user
    "confidence": [0.8, 0.9, 0.6, 1.0, 0.7],  # 0-1
    "effort":  [8, 2, 0.5, 1, 4],  # person-weeks
})

requests["rice_score"] = (
    requests["reach"] * requests["impact"] * requests["confidence"]
) / requests["effort"]

priority = requests.sort_values("rice_score", ascending=False)
print(priority[["request","rice_score"]].to_string(index=False))

# Stakeholder communication matrix
stakeholders = {
    "C-Suite":        {"cadence": "Monthly",   "format": "1-page memo + 5-slide deck"},
    "Product Managers":{"cadence": "Weekly",   "format": "Slack update + dashboard link"},
    "Engineering":    {"cadence": "As-needed", "format": "Jira ticket + data spec doc"},
    "Marketing":      {"cadence": "Bi-weekly", "format": "Campaign performance email"},
    "Finance":        {"cadence": "Monthly",   "format": "Excel model + commentary"},
}
for stakeholder, details in stakeholders.items():
    print(f"{stakeholder}: {details['cadence']} | {details['format']}")`,
    content: `# Analytics Leadership & Stakeholder Management

The transition from analyst to analytics lead is not primarily a technical upgrade — it is a communication and influence upgrade. The most impactful senior analysts at Google, Meta, and Amazon are not necessarily the best statisticians; they are the ones who most effectively translate data into organizational action.

## The Analyst → Lead Progression

| Level | Primary output | Primary skill |
|-------|---------------|---------------|
| Junior Analyst | Correct analysis | Technical execution |
| Senior Analyst | Insights + recommendations | Business translation |
| Analytics Lead | Strategic decisions + team capability | Influence + multiplying |
| Head of Analytics | Data culture + org strategy | Vision + leadership |

## Stakeholder Management

### The Stakeholder Communication Matrix

\`\`\`python
import pandas as pd

stakeholder_map = pd.DataFrame({
    "stakeholder": ["C-Suite/Board","Product Managers","Engineering","Marketing","Finance","Sales"],
    "primary_care": [
        "Strategy, ROI, risk, competitive position",
        "User behavior, feature impact, retention",
        "Data contracts, pipelines, schema changes",
        "Campaign ROAS, attribution, audience insights",
        "Revenue forecast, unit economics, cost analysis",
        "Lead quality, pipeline, conversion",
    ],
    "cadence": ["Monthly","Weekly","As-needed","Bi-weekly","Monthly","Weekly"],
    "format":  [
        "1-page memo + 5-slide deck",
        "Slack update + dashboard",
        "Data spec + Jira ticket",
        "Campaign summary email",
        "Excel model + commentary",
        "CRM dashboard",
    ],
    "what_to_include": [
        "Dollar impact, risk exposure, one clear recommendation",
        "A/B test results, funnel changes, user segment insights",
        "Schema requirements, SLA expectations, data contracts",
        "By-channel performance, YoY comparison, optimization recs",
        "Revenue actuals vs. forecast, variance explanation",
        "Lead source quality score, conversion benchmarks",
    ],
})

print(stakeholder_map[["stakeholder","cadence","format"]].to_string(index=False))
\`\`\`

### Handling Disagreement

When a stakeholder pushes back on your findings:

\`\`\`python
disagreement_playbook = {
    "situation": "Stakeholder says 'The data is wrong — this can't be right'",
    "wrong_response": "Defending your analysis emotionally or dismissing their concern",
    "right_response": [
        "1. Acknowledge: 'That's a fair concern — let me walk through the methodology'",
        "2. Show your work: reveal data sources, filters, and logic step by step",
        "3. Invite their data: 'What data are you seeing that leads you to a different conclusion?'",
        "4. Find the real disagreement: is it the data, the methodology, or the interpretation?",
        "5. If they are right: own the error immediately, fix it, and improve the process",
        "6. If you are right: offer to investigate their alternative hypothesis with them",
    ],
}

for i, step in enumerate(disagreement_playbook["right_response"]):
    print(step)
\`\`\`

## Prioritizing Analytics Requests

Every analytics team receives more requests than they can fulfill. Without a framework, the loudest stakeholder wins — not the highest-impact work.

### RICE Scoring Framework

\`\`\`python
# RICE = (Reach × Impact × Confidence) / Effort

requests = pd.DataFrame({
    "request": [
        "Churn prediction model for CSM team",
        "Monthly revenue dashboard",
        "Ad-hoc segment list for marketing email",
        "A/B test analysis: checkout redesign",
        "Data quality audit of user events table",
        "Customer LTV model",
        "Real-time anomaly detection pipeline",
    ],
    "reach":      [5000, 200, 50, 8000, 100000, 3000, 50000],
    "impact":     [3, 2, 1, 3, 2, 3, 2],       # 1=low 2=med 3=high
    "confidence": [0.80, 0.90, 0.60, 1.0, 0.70, 0.85, 0.60],
    "effort":     [8, 2, 0.5, 1, 4, 10, 12],    # person-weeks
})

requests["rice_score"] = (
    requests["reach"] * requests["impact"] * requests["confidence"]
) / requests["effort"]

priority = requests.sort_values("rice_score", ascending=False)
print("Priority queue:")
print(priority[["request","rice_score"]].round(0).to_string(index=False))
\`\`\`

## Building a Data-Driven Culture

\`\`\`python
data_culture_pillars = {
    "1. Democratize access": [
        "Self-serve dashboards so teams do not need analyst tickets for basic questions",
        "SQL training for product managers — reduce dependency on analyst team for simple queries",
        "Well-documented data dictionary so anyone can find and trust the data",
    ],
    "2. Standardize metrics": [
        "Single source of truth for key metrics (DAU, Revenue, CVR) — no more 'which number is right?'",
        "Metrics catalog with definitions, owners, and SLA",
        "Automated data quality tests that fail visibly before metrics reach dashboards",
    ],
    "3. Make data the default": [
        "All product specs require a measurement plan: what will you track, what does success look like?",
        "All major decisions require at least one data point or hypothesis",
        "Post-mortem every significant product change with data, not just intuition",
    ],
    "4. Celebrate data wins": [
        "Share examples where data changed a decision that improved outcomes",
        "Attribute product wins to the experiment/analysis that enabled them",
        "Reward teams that run more experiments, not just teams that ship more features",
    ],
}

for pillar, actions in data_culture_pillars.items():
    print(f"\\n{pillar}:")
    for action in actions:
        print(f"  • {action}")
\`\`\`

## Managing Up: Communicating with Leadership

\`\`\`python
managing_up_principles = [
    # 1. Proactive beats reactive
    "Tell your manager about risks and blockers before they become problems — do not wait to be asked",

    # 2. Answer then explain
    "Lead with the answer: 'Campaign ROI is 2.1x — below target. Here is why and what I recommend.'",

    # 3. Know their priorities
    "Understand what your manager is being measured on. Align your work to their OKRs",

    # 4. Quantify your impact
    "Weekly/monthly: track analysis that led to decisions and the decision outcomes",

    # 5. Surface trade-offs, not just problems
    "Never bring a problem without 2-3 options and a recommended path",

    # 6. Manage expectations explicitly
    "State your estimated completion date upfront and update it 48 hours before if it changes",
]

for principle in managing_up_principles:
    print(f"• {principle}")
\`\`\`

## Running an Analytics Project

\`\`\`python
# Analytics project lifecycle

project_lifecycle = {
    "1. Kickoff": {
        "duration": "1-2 days",
        "output": "Problem statement, hypothesis, success metric, timeline",
        "risk": "Scope creep — define 'done' upfront",
    },
    "2. Data Discovery": {
        "duration": "2-5 days",
        "output": "Data availability assessment, quality issues identified",
        "risk": "Discovering mid-project that key data does not exist",
    },
    "3. Exploratory Analysis": {
        "duration": "3-7 days",
        "output": "Key findings, refined hypothesis",
        "risk": "Rabbit-holing — time-box exploration",
    },
    "4. Modeling/Analysis": {
        "duration": "3-10 days",
        "output": "Validated model or analysis with confidence bounds",
        "risk": "Over-engineering — build for the business question, not awards",
    },
    "5. Communication": {
        "duration": "1-3 days",
        "output": "Executive summary + detailed findings + recommendations",
        "risk": "Stakeholder not available — pre-book readout meeting during kickoff",
    },
    "6. Action & Follow-up": {
        "duration": "Ongoing",
        "output": "Decision made, implemented, measured",
        "risk": "Analysis sits in a drawer — explicitly assign ownership of next steps",
    },
}

for stage, details in project_lifecycle.items():
    print(f"\\n{stage} ({details['duration']})")
    print(f"  Output: {details['output']}")
    print(f"  Risk:   {details['risk']}")
\`\`\`

## The Analytics Leadership Mindset

The shift from doing analysis to leading analytics is fundamentally about **leverage**. Instead of asking "what analysis should I do?" ask:

1. **What is the highest-value question** this organization could answer right now?
2. **Who else could answer this** if I build the right tools and empower them?
3. **What decision will this analysis unlock**, and who needs to make it?
4. **How do I make this insight last** beyond this quarter's report?

The goal is not to be the smartest analyst in the room — it is to make the entire organization make smarter decisions with data.`,
    quiz: {
      title: 'Analytics Leadership & Stakeholder Management Quiz',
      questions: [
        {
          text: 'What is the RICE scoring framework used for in analytics teams?',
          options: opts(
            'Evaluating the accuracy of machine learning models (Recall, Iteration, Complexity, Error)',
            'Prioritizing analytics requests by computing (Reach × Impact × Confidence) / Effort to objectively compare the expected value of different projects',
            'A code review framework for data engineering (Readability, Isolation, Correctness, Efficiency)',
            'Assessing dashboard quality across four dimensions'
          ),
          correctAnswer: 'b',
          explanation: 'RICE = (Reach × Impact × Confidence) / Effort. It converts subjective prioritization debates into an objective comparison. A high-reach, high-impact project that requires little effort scores far above a low-reach vanity request — preventing the loudest stakeholder from always winning.',
          orderIndex: 0,
        },
        {
          text: 'What is the most effective first response when a senior stakeholder says "This data is wrong — our numbers show something different"?',
          options: opts(
            'Immediately concede and offer to redo the analysis using their data',
            'Stand firm on your analysis and explain why the stakeholder is incorrect',
            'Acknowledge the concern, walk through your methodology transparently, and invite them to share their data to find the true source of discrepancy',
            'Escalate to your manager to arbitrate the disagreement'
          ),
          correctAnswer: 'c',
          explanation: 'Neither capitulating nor defending emotionally builds trust. Walking through methodology openly (showing data sources, filters, logic) lets the stakeholder audit your work. Inviting their data transforms a confrontation into a collaborative investigation — often discovering a legitimate data issue or definitional difference.',
          orderIndex: 1,
        },
        {
          text: 'What is a "single source of truth" for metrics and why is it important?',
          options: opts(
            'A regulatory requirement for financial data where each metric must have one approved definition',
            'A standardized, centrally maintained definition of key metrics that all teams use consistently — eliminating the "whose number is right?" debate that destroys executive trust in data',
            'A database design pattern where each fact is stored in exactly one table',
            'A documentation standard requiring all metrics to be defined in a single spreadsheet'
          ),
          correctAnswer: 'b',
          explanation: '"DAU" means different things to marketing (any visit), product (completed an action), finance (paid users) if not standardized. Conflicting numbers in the same exec meeting destroy data credibility. A metrics catalog with agreed definitions, owners, and approved calculation logic prevents this.',
          orderIndex: 2,
        },
        {
          text: 'What does "managing up" mean for a data analyst?',
          options: opts(
            'Using more advanced statistical methods to impress senior colleagues',
            'Proactively communicating status, risks, and recommendations to leadership — aligned with their priorities, leading with answers, and surfacing trade-offs rather than waiting to be asked',
            'Escalating all data quality issues directly to senior leadership for resolution',
            'Ensuring all analysis is reviewed and approved by a senior analyst before distribution'
          ),
          correctAnswer: 'b',
          explanation: "Managing up means making your manager's job easier: proactively sharing risks before they become problems, leading with answers (not lengthy preambles), and bringing options with a recommendation rather than just problems. It builds trust and accelerates career advancement.",
          orderIndex: 3,
        },
        {
          text: 'What is the biggest risk during the "Kickoff" phase of an analytics project?',
          options: opts(
            'Choosing the wrong statistical methodology before seeing the data',
            'Scope creep — failing to define what "done" looks like leads to endlessly expanding requirements and missed deadlines',
            'Stakeholder unavailability during the readout meeting',
            'Underestimating the data engineering complexity of the pipeline'
          ),
          correctAnswer: 'b',
          explanation: 'Scope creep is the #1 project killer. If "done" is not defined at kickoff (specific deliverable, hypothesis, metric), stakeholders continuously add questions and requests. Defining the scope explicitly — including what is OUT of scope — protects both timeline and quality.',
          orderIndex: 4,
        },
        {
          text: 'What characterizes a "data-driven culture" beyond just having dashboards and reports?',
          options: opts(
            'All employees have access to raw SQL and can query production databases directly',
            'An environment where decisions are expected to be grounded in data, metrics are standardized, experiments are the default way to validate hypotheses, and data wins are celebrated and attributed',
            'An analytics team larger than the engineering team in headcount',
            'A commitment to investing at least 20% of engineering resources in data infrastructure'
          ),
          correctAnswer: 'b',
          explanation: 'Data-driven culture is behavioral, not technological. It is present when: product specs require measurement plans, all major decisions cite supporting data, post-mortems use metrics not intuition, and the organization rewards teams that run experiments — not just teams that ship features.',
          orderIndex: 5,
        },
        {
          text: 'What is the analytics leadership mindset shift from individual analyst to analytics lead?',
          options: opts(
            'Focusing on more sophisticated analysis that junior analysts cannot replicate',
            'Shifting from "what analysis should I do?" to "how do I multiply the analytical capability of the entire organization?"',
            'Transitioning from Python and SQL to more scalable tools like Spark and distributed systems',
            'Moving from project-level work to managing a team of analysts and data engineers'
          ),
          correctAnswer: 'b',
          explanation: 'The leverage shift: an individual analyst answers one question at a time. An analytics lead builds self-serve tools, empowers PMs to answer their own basic questions, creates metrics standards, and focuses their own analytical work on the highest-value questions — multiplying impact 10x.',
          orderIndex: 6,
        },
        {
          text: 'What should always be included when bringing a problem to your manager or stakeholder?',
          options: opts(
            'The complete data lineage from source to conclusion so they can verify independently',
            '2-3 possible options with a recommended path and trade-offs — never just a problem',
            'The raw data so they can form their own interpretation without analyst bias',
            'A confidence interval around the finding to quantify uncertainty'
          ),
          correctAnswer: 'b',
          explanation: '"I have a problem" forces your manager to do your thinking. "I have a problem, here are 3 options, I recommend option B because..." respects their time, demonstrates judgment, and accelerates decisions. Analysts who bring options get promoted; analysts who bring problems get help.',
          orderIndex: 7,
        },
        {
          text: 'What is the purpose of a "metrics catalog" in an analytics organization?',
          options: opts(
            'A catalog of all data visualization templates approved for use in reports',
            'A central documentation repository with standardized definitions, owners, calculation logic, and SLAs for all key business metrics',
            'A performance benchmarking database comparing metric values across industry peers',
            'A machine learning feature store for reusable engineered features'
          ),
          correctAnswer: 'b',
          explanation: 'A metrics catalog prevents the "which number is right?" problem. It documents: metric name, business definition, SQL calculation, data owner, update frequency, known quirks, and approved usage. New analysts can trust and use metrics correctly without tribal knowledge.',
          orderIndex: 8,
        },
        {
          text: 'Why is the "Action & Follow-up" phase often the most important but most neglected step in analytics projects?',
          options: opts(
            'It requires the most technical skill to implement tracking for recommendation outcomes',
            'Analysis that does not result in a decision or action has zero business impact — the only thing that matters is whether the insight changed behavior',
            'It requires coordination with engineering and product teams that data teams have no authority over',
            'Following up creates political risk if the recommendation turns out to be wrong'
          ),
          correctAnswer: 'b',
          explanation: 'An analysis that generates a slide deck that sits unread is a waste of everyone\'s time. The only measure of an analysis\'s value is: "Did a decision change because of this?" Explicitly assigning action owners, timelines, and success metrics during the readout — not hoping someone acts later — is what separates impactful analytics from analytics theater.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 50 — Emerging Technologies: AI Tools for Modern Analysts
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-50-emerging-technologies-ai',
    title:      'Emerging Technologies: AI Tools for Modern Analysts',
    description: 'Leverage large language models, AI-assisted coding, AutoML, and the next wave of analytics tools — and understand how the analyst role is evolving with AI.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 150,
    xpReward:   125,
    language:   'python',
    codeExample: `# AI-augmented analytics workflow examples

# 1. Using LLM API for automated insight generation
import anthropic
import pandas as pd
import json

client = anthropic.Anthropic()

def analyze_kpi_summary(kpi_data: dict) -> str:
    """Use Claude to generate an executive insight from KPI data."""
    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=300,
        messages=[{
            "role": "user",
            "content": f"""Analyze these KPIs and write a 3-sentence executive summary
            with one key insight and one recommendation:
            {json.dumps(kpi_data, indent=2)}"""
        }]
    )
    return message.content[0].text

kpis = {
    "revenue_mom_change": -0.18,
    "cvr_desktop_mom": -0.46,
    "sessions_mom": -0.048,
    "aov_mom": +0.039,
    "deploy_date_overlap": "Oct 15 v2.4.1",
}

insight = analyze_kpi_summary(kpis)
print(insight)

# 2. AI-assisted SQL generation
def generate_sql(natural_language: str, schema: str) -> str:
    """Convert natural language to SQL using LLM."""
    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"Schema: {schema}\\n\\nWrite SQL for: {natural_language}"
        }]
    )
    return message.content[0].text`,
    content: `# Emerging Technologies: AI Tools for Modern Analysts

The analytics landscape is changing faster than at any previous point. Large Language Models (LLMs) are not replacing data analysts — they are making skilled analysts dramatically more productive. Understanding how to leverage AI tools is now as important as knowing SQL and Python.

## The AI-Augmented Analyst

The analyst's job is evolving from:
- **Before AI:** Spend 60% of time writing boilerplate code, formatting reports, creating slide summaries
- **After AI:** Spend 60% of time on interpretation, strategy, stakeholder communication, and novel analysis

The analysts who will be displaced are those who only did the boilerplate. The analysts who will thrive are those who add irreplaceable human judgment: business context, stakeholder trust, and strategic framing.

## LLMs for Analytics Work

### AI-Assisted Code Generation

\`\`\`python
# Example: GitHub Copilot / Claude completing your analytical code

# You type the comment, AI writes the code:
# "Calculate 30-day rolling retention for each acquisition cohort"
import pandas as pd

def calculate_cohort_retention(df, days=30):
    """
    AI-generated from natural language description.
    Validates: always review AI-generated code for correctness.
    """
    df["signup_date"] = pd.to_datetime(df["signup_date"])
    df["activity_date"] = pd.to_datetime(df["activity_date"])
    df["days_since_signup"] = (df["activity_date"] - df["signup_date"]).dt.days

    cohort_size = df.groupby("signup_date")["user_id"].nunique()
    cohort_active = df[df["days_since_signup"].between(days-1, days+1)].groupby("signup_date")["user_id"].nunique()

    retention = (cohort_active / cohort_size).rename(f"d{days}_retention")
    return pd.concat([cohort_size.rename("cohort_size"), retention], axis=1)
\`\`\`

### LLM-Powered Insight Generation

\`\`\`python
# Using the Anthropic API to automate insight narratives
import anthropic
import pandas as pd
import json

client = anthropic.Anthropic()

def generate_kpi_narrative(kpi_dict: dict, audience: str = "executive") -> str:
    """
    Generate a narrative summary of KPI movements using Claude.
    """
    prompt = f"""You are a senior data analyst. Analyze these weekly KPI changes
and write a {audience}-level summary in exactly 3 sentences:
1. The key finding
2. The root cause or most likely explanation
3. The recommended action

KPI data:
{json.dumps(kpi_dict, indent=2)}

Respond in plain business English, no jargon."""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text

# Example usage
weekly_kpis = {
    "revenue_wow_change_pct": -12.3,
    "new_signups_wow_change_pct": +8.5,
    "checkout_cvr_wow_change_pct": -24.1,
    "cart_abandonment_rate": 0.68,
    "recent_deployment": "payment_widget_v3 (2 days ago)",
}

narrative = generate_kpi_narrative(weekly_kpis)
print(narrative)
\`\`\`

### Natural Language to SQL

\`\`\`python
def nl_to_sql(question: str, schema_description: str) -> str:
    """Convert a business question to SQL using Claude."""
    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=500,
        system="You are an expert SQL analyst. Write clean, commented SQL.",
        messages=[{
            "role": "user",
            "content": f"""Database schema:
{schema_description}

Write SQL to answer: {question}

Include comments explaining the logic."""
        }],
    )
    return message.content[0].text

schema = """
orders(order_id, user_id, order_date, revenue, channel, device_type)
users(user_id, signup_date, country, plan_type)
"""

question = "What is the 30-day rolling average revenue per user by channel for the last 6 months?"
sql = nl_to_sql(question, schema)
print(sql)
\`\`\`

## AutoML — Automated Machine Learning

AutoML handles feature selection, model selection, and hyperparameter tuning automatically — useful for rapid prototyping.

\`\`\`python
# pip install pycaret
from pycaret.regression import setup, compare_models, pull, finalize_model, predict_model

import pandas as pd
import numpy as np

np.random.seed(42)
n = 5000
data = pd.DataFrame({
    "sessions":    np.random.randint(1, 100, n),
    "avg_session_duration": np.random.exponential(180, n),
    "feature_usage_score":  np.random.uniform(0, 1, n),
    "support_tickets":      np.random.randint(0, 10, n),
    "days_since_login":     np.random.exponential(7, n),
    "plan_value":           np.random.choice([29, 99, 299], n),
    "monthly_revenue":      None,  # target
})
data["monthly_revenue"] = (
    data["sessions"] * 0.5 +
    data["feature_usage_score"] * 200 +
    data["plan_value"] * 0.8 +
    np.random.normal(0, 30, n)
).clip(lower=0)

# AutoML: compare 15+ regression models in one call
exp = setup(data, target="monthly_revenue", session_id=42, verbose=False)
best_models = compare_models(n_select=3)
results = pull()
print(results[["Model","R2","MAE","RMSE"]].head(5))
\`\`\`

## Vector Databases & Semantic Search

\`\`\`python
# pip install chromadb sentence-transformers
import chromadb
from sentence_transformers import SentenceTransformer

# Use embeddings to find semantically similar support tickets
model = SentenceTransformer("all-MiniLM-L6-v2")

tickets = [
    "My payment failed but I was still charged",
    "I cannot access my account after password reset",
    "The dashboard is not loading correctly on Chrome",
    "I need to upgrade my subscription plan",
    "Product feature is not working as expected",
    "I want to cancel my subscription and get a refund",
]

# Create embeddings
embeddings = model.encode(tickets)

# Store in vector database
client_vdb = chromadb.Client()
collection = client_vdb.create_collection("support_tickets")
collection.add(
    documents=tickets,
    embeddings=embeddings.tolist(),
    ids=[f"ticket_{i}" for i in range(len(tickets))],
)

# Semantic search: find tickets similar to a new query
query = "billing issue double charge"
query_embedding = model.encode([query])
results = collection.query(query_embeddings=query_embedding.tolist(), n_results=3)

print("Most similar tickets:")
for doc, dist in zip(results["documents"][0], results["distances"][0]):
    print(f"  [{dist:.3f}] {doc}")
\`\`\`

## AI Tools Landscape for Analysts

| Tool | Use Case | Analyst Application |
|------|----------|-------------------|
| **GitHub Copilot** | Code completion | Write 30% faster, avoid boilerplate |
| **Claude / ChatGPT** | Analysis narrative, SQL generation | Draft insights, translate to English |
| **AutoML (PyCaret, H2O)** | Rapid model comparison | Baseline models in hours not weeks |
| **Tableau Ask Data** | NL query on dashboards | Non-technical stakeholders self-serve |
| **Google Looker** | Semantic layer | Consistent metrics across all tools |
| **dbt + LLM** | Auto-documentation | Generate column descriptions from data patterns |
| **Vector DBs** | Semantic search | Customer feedback categorization at scale |
| **Evidently AI** | Model monitoring | Automated drift detection in production |

## The Future Analyst Role

\`\`\`python
future_analyst_skills = {
    "Evergreen (will not be automated)": [
        "Business context and domain expertise",
        "Stakeholder trust and communication",
        "Framing the right question to ask",
        "Ethical judgment about data use",
        "Cross-functional strategic thinking",
    ],
    "Amplified by AI": [
        "Code writing (AI copilot)",
        "Insight narration (LLM summarization)",
        "SQL generation (natural language to SQL)",
        "Report generation (LLM + template)",
        "Anomaly detection (ML at scale)",
    ],
    "Declining in value": [
        "Manual data cleaning and formatting",
        "Copy-paste report generation",
        "Basic summary statistics",
        "Routine dashboard maintenance",
        "Simple rule-based categorization",
    ],
}

print("The analyst role in an AI-augmented world:")
for category, skills in future_analyst_skills.items():
    print(f"\\n{category}:")
    for s in skills:
        print(f"  • {s}")
\`\`\`

## Responsible AI Use in Analytics

\`\`\`python
responsible_ai_checklist = [
    "Never send real PII or confidential business data to public LLM APIs",
    "Always verify AI-generated SQL runs correctly and returns expected results",
    "Treat AI-generated insights as first drafts — validate the numbers yourself",
    "Disclose when analysis was AI-assisted in reports where methodology matters",
    "Test AI-generated models for bias across protected demographic groups",
    "Monitor ML models in production for drift — accuracy degrades over time",
    "Keep humans in the loop for consequential decisions (hiring, credit, pricing)",
]

for item in responsible_ai_checklist:
    print(f"  [ ] {item}")
\`\`\`

## Key Takeaways

- **AI amplifies skilled analysts** — the 10x analyst with AI tools is now 100x
- **LLMs excel at** code generation, report drafting, SQL translation, and insight narration
- **AutoML** accelerates prototyping — get a baseline model in hours, not days
- **Vector databases** enable semantic search — find what customers mean, not just what they typed
- **Never send PII to public APIs** — use enterprise versions or local models
- **The evergreen skills** — business judgment, stakeholder trust, question framing — are what AI cannot replace
- **The analysts who will thrive** are those who use AI to do 5x more analysis, not those who wait to see if AI makes their job irrelevant`,
    quiz: {
      title: 'Emerging Technologies: AI Tools for Modern Analysts Quiz',
      questions: [
        {
          text: 'How does AI augmentation most beneficially change the analyst\'s work allocation?',
          options: opts(
            'It eliminates the need for SQL and Python skills since AI can write all the code',
            'It automates the boilerplate and routine tasks, freeing analysts to spend more time on interpretation, strategy, stakeholder communication, and novel analysis',
            'It primarily helps junior analysts catch up to senior analyst skill levels',
            'It replaces the need for domain expertise since AI can learn any domain from documents'
          ),
          correctAnswer: 'b',
          explanation: 'AI tools (Copilot, LLMs, AutoML) automate the repetitive portion of analytical work — boilerplate code, report formatting, SQL generation. This shifts the analyst\'s time budget from mechanical execution to the irreplaceable human skills: business judgment, stakeholder influence, and strategic framing.',
          orderIndex: 0,
        },
        {
          text: 'What is the most important rule when using public LLM APIs (ChatGPT, Claude) for analytical work?',
          options: opts(
            'Always use GPT-4 or better models — smaller models produce unreliable analysis',
            'Never send real PII, customer data, or confidential business information to public APIs — use enterprise versions or on-premise models for sensitive data',
            'Limit API usage to avoid costs — only use AI for analysis that takes more than 2 hours manually',
            'Always disclose AI usage in every report regardless of how it was used'
          ),
          correctAnswer: 'b',
          explanation: 'Public LLM APIs (OpenAI, Anthropic public API) process data on external servers. Sending customer PII, financial data, or trade secrets violates data privacy regulations (GDPR, CCPA) and company policies. Enterprise versions (Azure OpenAI, Anthropic Enterprise) provide data privacy guarantees.',
          orderIndex: 1,
        },
        {
          text: 'What does AutoML (e.g., PyCaret, H2O) automate in the ML workflow?',
          options: opts(
            'The entire model deployment and serving infrastructure',
            'Feature selection, trying many model types and hyperparameter configurations, and comparing performance — generating a strong baseline in hours instead of weeks',
            'Data collection and labeling from multiple sources',
            'Writing the business report that accompanies the model results'
          ),
          correctAnswer: 'b',
          explanation: 'AutoML handles the tedious parts of ML prototyping: trying 10-15 model types (linear, tree-based, neural), tuning hyperparameters, cross-validating, and comparing metrics. This dramatically speeds up the "which model to use?" question, freeing analysts for feature engineering and business translation.',
          orderIndex: 2,
        },
        {
          text: 'What is a vector database used for in analytics applications?',
          options: opts(
            'Storing numerical data in a columnar format optimized for analytical queries',
            'Storing high-dimensional embeddings and enabling semantic similarity search — finding documents by meaning rather than exact keyword match',
            'A database type optimized for storing time-series data like metrics and events',
            'A distributed database for storing ML model weights and checkpoints'
          ),
          correctAnswer: 'b',
          explanation: 'Vector databases store embedding vectors (numerical representations of meaning) and support approximate nearest-neighbor search. "Find support tickets similar to this new ticket" uses semantic similarity, not keywords — enabling categories like "billing issue" to match "I was charged twice" without any keyword overlap.',
          orderIndex: 3,
        },
        {
          text: 'Which analyst skills are described as "evergreen" and unlikely to be automated by AI?',
          options: opts(
            'SQL query writing, Python scripting, and dashboard building',
            'Business context and domain expertise, stakeholder trust, framing the right question, ethical judgment, and cross-functional strategic thinking',
            'Machine learning model selection and hyperparameter tuning',
            'Report generation, data cleaning, and summary statistics'
          ),
          correctAnswer: 'b',
          explanation: 'AI can generate SQL, write code, produce charts, and summarize data. It cannot replace: the business context developed over years in an industry, the stakeholder relationships that make people act on data, or the judgment of which question is worth asking and which finding matters.',
          orderIndex: 4,
        },
        {
          text: 'What is the correct way to use AI-generated SQL in production analytics?',
          options: opts(
            'Deploy it immediately since LLMs are reliable enough for production SQL',
            'Use it as a starting template, then validate it against known correct results, review the logic for edge cases, and test on a sample before using in production reporting',
            'Only use AI-generated SQL for exploration, never for reporting',
            'Have a senior engineer review every AI-generated SQL query before any analyst uses it'
          ),
          correctAnswer: 'b',
          explanation: 'LLMs produce plausible-looking SQL that can have subtle bugs (wrong join type, off-by-one date ranges, incorrect NULL handling). Always validate: run on a sample and check against known values, trace the logic step by step, and test edge cases like NULL, duplicate keys, and boundary dates.',
          orderIndex: 5,
        },
        {
          text: 'What does "model drift" refer to in production ML systems and why does it matter?',
          options: opts(
            'When a model\'s predictions gradually shift toward the center (mean) as more data is added',
            'When the statistical relationship between features and the target changes over time, causing model accuracy to degrade without any code changes',
            'When different versions of the same model produce different predictions on the same data',
            'When a model becomes too complex and starts overfitting to the training data'
          ),
          correctAnswer: 'b',
          explanation: 'Data drift: input feature distributions change (e.g., user behavior shifts post-COVID). Concept drift: the relationship between features and target changes (e.g., what predicts churn shifts as the product evolves). Both cause model performance to degrade invisibly unless monitored. Tools like Evidently AI detect drift automatically.',
          orderIndex: 6,
        },
        {
          text: 'What is the "Tableau Ask Data" / "Looker Natural Language" capability and what does it enable for organizations?',
          options: opts(
            'It allows analysts to write complex SQL using natural language which Tableau then optimizes',
            'It enables non-technical stakeholders to query dashboards and data using natural language questions, reducing analyst dependency for basic data lookups',
            'It automatically generates data quality alerts using natural language descriptions of expected data patterns',
            'It translates dashboard insights into different languages for international stakeholders'
          ),
          correctAnswer: 'b',
          explanation: 'Natural language interfaces to BI tools democratize data access. A product manager can type "Show me DAU by country last month" instead of submitting an analyst ticket. This frees analysts from basic data retrieval requests and empowers stakeholders to be self-sufficient for routine questions.',
          orderIndex: 7,
        },
        {
          text: 'When an LLM generates an insight narrative from KPI data, what is the analyst\'s critical responsibility?',
          options: opts(
            'Accepting the narrative as-is since LLMs have access to more context than human analysts',
            'Verifying the numbers are correct, checking that the interpretation is contextually accurate for the business, and adding the judgment and stakeholder-specific context that the LLM lacks',
            'Rewriting the narrative entirely since LLM-generated content cannot be used in professional reports',
            'Submitting the narrative to a second LLM for fact-checking before using it'
          ),
          correctAnswer: 'b',
          explanation: 'LLMs produce fluent, confident-sounding text that can be subtly wrong. The analyst\'s role is: verify the numbers, validate the interpretation against their business knowledge, add context the LLM cannot have (recent strategic decisions, stakeholder sensitivities), and ensure the recommendation is actually actionable.',
          orderIndex: 8,
        },
        {
          text: 'What is the most accurate characterization of how AI will affect the data analyst profession over the next 5 years?',
          options: opts(
            'AI will replace most data analyst positions as LLMs can perform all analytical tasks',
            'AI will have minimal impact since data analysis requires human creativity that AI cannot replicate',
            'Skilled analysts who leverage AI tools will dramatically increase their output and impact, while analysts who only perform routine tasks will face significant pressure on their roles',
            'AI will primarily help data engineers, not analysts, since engineering tasks are more automatable'
          ),
          correctAnswer: 'c',
          explanation: 'The empirical pattern in every prior technology wave: tools do not eliminate roles, they raise the productivity floor and shift what skilled practitioners do. Analysts who use AI to do 5x more work will be more valuable than ever. Those doing only routine tasks that AI can fully automate are at risk — the solution is to develop the higher-order skills AI cannot replicate.',
          orderIndex: 9,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 10 (Chapters 146–150 — Capstone & Career)…');

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

  console.log('\n🎉  AMATEUR Block 10 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
