/**
 * AMATEUR Level — Block 2 (Chapters 7–11, orderIndex 106–110)
 * Data Analytics course
 *
 *  106 — Inferential Statistics & A/B Testing
 *  107 — Time Series Analysis with Pandas
 *  108 — Python Performance & Production-Grade Code
 *  109 — Regular Expressions & Text Data Extraction
 *  110 — Database Design & Analytics Data Modeling
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function opts(a: string, b: string, c: string, d: string) {
  return JSON.stringify([
    { id: 'a', text: a },
    { id: 'b', text: b },
    { id: 'c', text: c },
    { id: 'd', text: d },
  ]);
}

const CHAPTERS = [

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 7 — Inferential Statistics & A/B Testing
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-7-inferential-stats-ab-testing',
    title:      'Inferential Statistics & A/B Testing',
    description:'Master hypothesis testing, p-values, t-tests, chi-square, statistical power, sample size calculation, and the complete A/B testing workflow used at Google, Meta, and Microsoft.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 106,
    xpReward:   125,
    language:   'python',
    content: `# Inferential Statistics & A/B Testing

## What You'll Learn
This chapter covers the statistical reasoning that sits behind every product decision at top tech companies. You'll learn hypothesis testing end-to-end — from forming hypotheses and choosing the right test, to interpreting p-values, controlling for errors, and designing statistically sound A/B experiments.

---

## 1. Population vs Sample — The Core Problem

We rarely have access to data about an entire population. Instead we draw a **sample** and use it to make **inferences** about the population. The Central Limit Theorem (CLT) makes this possible:

> **CLT:** Regardless of the population's distribution, the distribution of **sample means** approaches a normal distribution as sample size grows (n ≥ 30 is a common rule of thumb).

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Simulate CLT with a skewed population (exponential distribution)
population = np.random.exponential(scale=5, size=100_000)

sample_means = [np.mean(np.random.choice(population, 50)) for _ in range(5000)]

plt.hist(sample_means, bins=50, edgecolor='k')
plt.title('Distribution of Sample Means (n=50) — CLT in action')
plt.xlabel('Sample Mean')
plt.show()
# Even though the population is skewed, the sample means form a bell curve
\`\`\`

---

## 2. Hypothesis Testing Framework

Every test follows the same five-step structure:

**Step 1 — State the hypotheses**
- **H₀ (Null Hypothesis):** No effect / no difference. The default assumption.
- **H₁ (Alternative Hypothesis):** The effect you're trying to detect.

**Step 2 — Choose significance level (α)**
Typically α = 0.05. This is the probability of rejecting H₀ when it is actually true (Type I error rate).

**Step 3 — Select the appropriate test**

**Step 4 — Calculate the test statistic and p-value**

**Step 5 — Decide: reject or fail to reject H₀**
- p < α → Reject H₀ → "Statistically significant"
- p ≥ α → Fail to reject H₀ → "Not significant"

---

## 3. The t-Test Family

### One-Sample t-Test — Is the mean different from a known value?

\`\`\`python
from scipy import stats
import numpy as np

# Business question: Is our average delivery time different from our SLA of 3.0 days?
delivery_times = [3.2, 2.8, 3.5, 2.9, 3.1, 4.0, 2.7, 3.3, 3.8, 2.6]

t_stat, p_value = stats.ttest_1samp(delivery_times, popmean=3.0)

print(f"t-statistic: {t_stat:.4f}")
print(f"p-value:     {p_value:.4f}")
print(f"Conclusion:  {'Reject H0 — SLA breached' if p_value < 0.05 else 'Fail to reject H0 — within SLA'}")
\`\`\`

### Two-Sample (Independent) t-Test — A/B Test on a continuous metric

\`\`\`python
# A/B test: does the new checkout flow increase revenue per session?
np.random.seed(42)
control   = np.random.normal(loc=45.00, scale=12, size=500)   # Group A: old flow
treatment = np.random.normal(loc=47.50, scale=12, size=500)   # Group B: new flow

t_stat, p_value = stats.ttest_ind(control, treatment, equal_var=False)  # Welch's t-test

effect_size = (treatment.mean() - control.mean()) / np.sqrt(
    (control.std()**2 + treatment.std()**2) / 2
)  # Cohen's d

print(f"Control mean:   \${control.mean():.2f}")
print(f"Treatment mean: \${treatment.mean():.2f}")
print(f"Lift:           \${treatment.mean() - control.mean():.2f} ({(treatment.mean()/control.mean()-1)*100:.1f}%)")
print(f"p-value:        {p_value:.4f}")
print(f"Cohen's d:      {effect_size:.3f}")
print(f"Result:         {'Statistically significant — ship it!' if p_value < 0.05 else 'Not significant — do not ship'}")
\`\`\`

**Use Welch's t-test** (\`equal_var=False\`) by default — it doesn't assume equal variances between groups and is more robust.

### Paired t-Test — Before vs After (same subjects)

\`\`\`python
# Did a training program improve employee productivity scores?
before = [72, 68, 75, 80, 65, 71, 77, 69]
after  = [78, 74, 79, 85, 70, 75, 81, 73]

t_stat, p_value = stats.ttest_rel(before, after)
print(f"p-value: {p_value:.4f} — {'Significant improvement' if p_value < 0.05 else 'No significant improvement'}")
\`\`\`

---

## 4. Chi-Square Test — Categorical vs Categorical

When your metric is a **rate** (click rate, conversion rate, churn rate), use the chi-square test:

\`\`\`python
from scipy.stats import chi2_contingency

# A/B test on button colour: does it affect click-through rate?
# Observed counts: [clicked, did_not_click]
control   = [240, 760]   # 24% CTR
treatment = [310, 690]   # 31% CTR

contingency_table = [control, treatment]
chi2, p_value, dof, expected = chi2_contingency(contingency_table)

print(f"Chi-square: {chi2:.4f}")
print(f"p-value:    {p_value:.4f}")
print(f"Result:     {'Significant — colour matters' if p_value < 0.05 else 'Not significant'}")

# Expected counts verify minimum sample size assumption (all cells ≥ 5)
print(f"Expected:   {expected}")
\`\`\`

---

## 5. Type I & Type II Errors — The Trade-off

| | H₀ True (no effect) | H₀ False (effect exists) |
|---|---|---|
| **Reject H₀** | ❌ Type I Error (False Positive) — α | ✅ Correct (Power) — 1−β |
| **Fail to Reject H₀** | ✅ Correct — 1−α | ❌ Type II Error (False Negative) — β |

- **Type I Error (α):** Shipping a change that actually has no effect. Wasted engineering effort.
- **Type II Error (β):** Failing to detect a real improvement. Missed opportunity.
- **Power (1−β):** Probability of correctly detecting a real effect. Target ≥ 0.80.

---

## 6. Sample Size Calculation — Plan Before You Run

**Never run an experiment without pre-calculating the required sample size.** Running until you see p < 0.05 inflates Type I error massively (p-hacking).

\`\`\`python
import statsmodels.stats.power as smp

# How many users per group do we need to detect a 5% lift in revenue?
# Assumptions: baseline mean=45, expected lift=2.25 (5%), std=12, α=0.05, power=0.80

baseline_mean = 45.0
expected_lift = 2.25          # absolute lift we want to detect
std           = 12.0
alpha         = 0.05
power         = 0.80

# Effect size (Cohen's d)
effect_size = expected_lift / std

analysis = smp.TTestIndPower()
n_per_group = analysis.solve_power(
    effect_size=effect_size,
    alpha=alpha,
    power=power,
    alternative='two-sided'
)

print(f"Effect size (Cohen's d): {effect_size:.3f}")
print(f"Required n per group:    {int(np.ceil(n_per_group)):,}")
print(f"Total users needed:      {int(np.ceil(n_per_group)) * 2:,}")

# For conversion rates (proportions)
from statsmodels.stats.proportion import proportion_effectsize, zt_ind_solve_power

p1 = 0.10   # baseline conversion rate
p2 = 0.12   # target conversion rate (20% relative lift)
es = proportion_effectsize(p1, p2)
n_conv = zt_ind_solve_power(effect_size=es, alpha=alpha, power=power)
print(f"\\nConversion rate test — n per group: {int(np.ceil(n_conv)):,}")
\`\`\`

---

## 7. The Complete A/B Testing Workflow

\`\`\`python
import pandas as pd
from scipy import stats
import numpy as np

def run_ab_test(df: pd.DataFrame, group_col: str, metric_col: str,
                control_label='control', treatment_label='treatment',
                alpha: float = 0.05) -> dict:
    """
    Runs a two-sample t-test for continuous metrics.
    Returns a structured result dict.
    """
    ctrl = df[df[group_col] == control_label][metric_col].dropna()
    trt  = df[df[group_col] == treatment_label][metric_col].dropna()

    t_stat, p_value = stats.ttest_ind(ctrl, trt, equal_var=False)

    lift_abs = trt.mean() - ctrl.mean()
    lift_pct = (lift_abs / ctrl.mean()) * 100

    # Cohen's d
    pooled_std  = np.sqrt((ctrl.std()**2 + trt.std()**2) / 2)
    effect_size = lift_abs / pooled_std

    # 95% confidence interval on the lift
    se   = np.sqrt(ctrl.var()/len(ctrl) + trt.var()/len(trt))
    ci_lo = lift_abs - 1.96 * se
    ci_hi = lift_abs + 1.96 * se

    return {
        'n_control':    len(ctrl),
        'n_treatment':  len(trt),
        'control_mean': round(ctrl.mean(), 4),
        'treatment_mean': round(trt.mean(), 4),
        'lift_abs':     round(lift_abs, 4),
        'lift_pct':     round(lift_pct, 2),
        'ci_95':        (round(ci_lo, 4), round(ci_hi, 4)),
        'p_value':      round(p_value, 4),
        'significant':  p_value < alpha,
        'effect_size_d': round(effect_size, 3),
        'recommendation': 'SHIP' if (p_value < alpha and lift_abs > 0) else 'DO NOT SHIP',
    }

# Usage
results = run_ab_test(experiment_df, 'variant', 'revenue_per_session')
for k, v in results.items():
    print(f"{k:20s}: {v}")
\`\`\`

---

## 8. Common A/B Testing Pitfalls

| Pitfall | Effect | Fix |
|---------|--------|-----|
| **Peeking** (checking before runtime ends) | Inflates false positive rate | Pre-commit to sample size and runtime |
| **Multiple comparisons** | 20 tests at α=0.05 → 1 false positive expected | Bonferroni correction: α/n_tests |
| **Novelty effect** | Users interact differently with new UI just because it's new | Run test long enough (≥ 2 weeks) |
| **Simpson's Paradox** | Aggregate results differ from segment results | Segment by device, cohort, geography |
| **Underpowered test** | Real effect missed (Type II error) | Calculate sample size BEFORE running |

\`\`\`python
# Bonferroni correction for multiple tests
alpha      = 0.05
n_tests    = 5
alpha_corrected = alpha / n_tests   # 0.01 — more conservative threshold
\`\`\`

---

## 9. Practical vs Statistical Significance

A result can be **statistically significant but practically meaningless**.

\`\`\`python
# With 1 million users per group, even a 0.01% lift is "significant"
# Always report effect size alongside p-value

# Cohen's d interpretation:
# d < 0.2  — negligible
# 0.2–0.5  — small
# 0.5–0.8  — medium
# > 0.8    — large

# Business threshold: only ship if lift_pct > 2% AND p < 0.05
decision = 'SHIP' if (results['significant'] and results['lift_pct'] > 2.0) else 'NO'
\`\`\`

---

## Summary

1. Hypothesis testing follows: H₀ / H₁ → choose test → calculate p-value → decide.
2. **t-test** for continuous metrics; **chi-square** for rates and proportions.
3. **p-value < α** means the result is unlikely under H₀ — not that the effect is large.
4. **Always calculate sample size before running** — peeking destroys your α.
5. **Report effect size (Cohen's d)** alongside p-value — practical significance matters.
6. Apply Bonferroni correction when running multiple simultaneous tests.
`,
    codeExample: `from scipy import stats
import statsmodels.stats.power as smp
import numpy as np

# --- Sample size first ---
effect_size = 2.5 / 12          # expected lift / std dev (Cohen's d)
n = smp.TTestIndPower().solve_power(effect_size=effect_size, alpha=0.05, power=0.80)
print(f"Need {int(np.ceil(n)):,} users per group")

# --- Run experiment ---
control   = np.random.normal(45, 12, int(np.ceil(n)))
treatment = np.random.normal(47.5, 12, int(np.ceil(n)))

t, p = stats.ttest_ind(control, treatment, equal_var=False)
lift = treatment.mean() - control.mean()

print(f"Lift: \${lift:.2f} | p={p:.4f} | {'SHIP' if p < 0.05 and lift > 0 else 'HOLD'}")`,

    quiz: {
      title: 'Inferential Statistics & A/B Testing — Quiz',
      questions: [
        {
          text: 'The null hypothesis (H₀) in an A/B test states:',
          options: opts(
            'The treatment group will definitely outperform control',
            'There is no difference between control and treatment',
            'The p-value will be less than 0.05',
            'The sample is large enough to detect an effect'
          ),
          correctAnswer: 'b',
          explanation: 'H₀ is always the "no effect" default. We collect evidence to determine whether data gives us enough reason to reject it.',
          orderIndex: 1,
        },
        {
          text: 'A p-value of 0.03 means:',
          options: opts(
            'There is a 3% chance the treatment is effective',
            'If H₀ were true, there is a 3% chance of observing a result this extreme or more extreme',
            'The effect size is 3%',
            'You need 3% more data to confirm the result'
          ),
          correctAnswer: 'b',
          explanation: 'The p-value is the probability of obtaining the observed (or more extreme) data assuming H₀ is true. It says nothing about the probability that H₀ is true.',
          orderIndex: 2,
        },
        {
          text: 'Your A/B test shows a 0.5% uplift in conversion with p = 0.001 (n = 2,000,000 per group). What is the best conclusion?',
          options: opts(
            'Strong evidence to ship — p < 0.05',
            'Statistically significant but likely not practically meaningful — evaluate business value of 0.5% lift',
            'The test is invalid because n is too large',
            'The result proves the treatment causes the lift'
          ),
          correctAnswer: 'b',
          explanation: 'With millions of users even tiny differences become significant. Always pair statistical significance with practical/business significance — a 0.5% lift may not justify shipping.',
          orderIndex: 3,
        },
        {
          text: 'When should you use a chi-square test instead of a t-test in an A/B experiment?',
          options: opts(
            'When the sample size is small',
            'When the metric is a rate or proportion (e.g., conversion rate, click-through rate)',
            'When running the experiment for more than 2 weeks',
            'When control and treatment groups are the same size'
          ),
          correctAnswer: 'b',
          explanation: 'The t-test is for continuous metrics (revenue, time on page). Chi-square tests independence in contingency tables — perfect for binary outcomes like click/no-click.',
          orderIndex: 4,
        },
        {
          text: 'What is a Type II error?',
          options: opts(
            'Rejecting H₀ when it is actually true (false positive)',
            'Failing to reject H₀ when it is actually false (false negative)',
            'Running the test with an incorrect significance level',
            'Using the wrong test statistic'
          ),
          correctAnswer: 'b',
          explanation: 'Type II error (β) occurs when a real effect exists but the test fails to detect it. Increasing sample size and effect size reduces β and increases statistical power (1−β).',
          orderIndex: 5,
        },
        {
          text: 'You run 20 simultaneous A/B tests each at α = 0.05. How many false positives do you expect even if all null hypotheses are true?',
          options: opts('0', '1', '5', '20'),
          correctAnswer: 'b',
          explanation: '20 tests × 0.05 false-positive rate = 1 expected false positive. This is why multiple-comparison correction (e.g., Bonferroni: α/n_tests) is essential.',
          orderIndex: 6,
        },
        {
          text: 'Why must you calculate the required sample size BEFORE running an A/B test?',
          options: opts(
            'To ensure both groups get exactly 50% of traffic',
            'Stopping early when p < 0.05 appears (peeking) dramatically inflates the true Type I error rate',
            'Because sample size determines the significance level',
            'Regulators require it for compliance'
          ),
          correctAnswer: 'b',
          explanation: 'Peeking and stopping early when significant results appear is a form of optional stopping — it inflates the actual false-positive rate far above α. Pre-committing to runtime fixes this.',
          orderIndex: 7,
        },
        {
          text: 'Cohen\'s d = 0.15 in your experiment. How should you interpret this?',
          options: opts(
            'Large effect — definitely ship',
            'Medium effect — borderline decision',
            'Negligible / small effect — even if statistically significant, the practical impact is tiny',
            'The test was underpowered'
          ),
          correctAnswer: 'c',
          explanation: 'Cohen\'s d < 0.2 is considered a negligible effect. Statistical significance with a tiny effect size means the change has almost no real-world impact.',
          orderIndex: 8,
        },
        {
          text: 'What is the purpose of using Welch\'s t-test (equal_var=False) instead of Student\'s t-test?',
          options: opts(
            'It is faster to compute',
            'It does not require the two groups to have equal variance — more robust in practice',
            'It works for more than two groups',
            'It produces a smaller p-value'
          ),
          correctAnswer: 'b',
          explanation: 'Real A/B test groups rarely have identical variances. Welch\'s t-test adjusts the degrees of freedom to handle unequal variances — it is strictly safer and should be the default.',
          orderIndex: 9,
        },
        {
          text: 'What is the "novelty effect" in A/B testing?',
          options: opts(
            'Users who discover the experiment and share it',
            'Users behaving differently simply because the experience is new, not because it is better',
            'A statistical artifact caused by unequal group sizes',
            'The boost in metrics during product launch week'
          ),
          correctAnswer: 'b',
          explanation: 'The novelty effect causes short-term inflated engagement with anything new. Running tests for at least 2 full business cycles helps the effect dissipate and reveals true long-term impact.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 8 — Time Series Analysis with Pandas
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-8-time-series-pandas',
    title:      'Time Series Analysis with Pandas',
    description:'Master DatetimeIndex, resampling, rolling and expanding windows, lag features, percentage change, and seasonal decomposition — the complete toolkit for business trend analysis.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 107,
    xpReward:   120,
    language:   'python',
    content: `# Time Series Analysis with Pandas

## What You'll Learn
Almost every business metric is time-stamped: revenue by day, users by week, inventory by hour. This chapter builds the complete Pandas time series toolkit — from parsing and indexing dates correctly, through resampling and rolling calculations, to decomposing trend and seasonality and engineering date-based features for machine learning.

---

## 1. DatetimeIndex — The Foundation

Everything in Pandas time series starts with a proper \`DatetimeIndex\`.

\`\`\`python
import pandas as pd
import numpy as np

# Parse dates on load — always specify format for speed and correctness
df = pd.read_csv(
    'sales.csv',
    parse_dates=['date'],
    index_col='date',
    dayfirst=False,          # US format MM/DD/YYYY
)

# Or convert after loading
df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d', errors='coerce')
df = df.set_index('date').sort_index()   # sort is critical for time series ops

print(df.index.dtype)     # datetime64[ns]
print(df.index.min(), df.index.max())
print(df.index.freq)      # None if irregular; set with df.asfreq('D')
\`\`\`

### Timezone handling

\`\`\`python
# Localise and convert timezones
df.index = df.index.tz_localize('UTC').tz_convert('US/Eastern')

# Remove timezone info when saving
df.index = df.index.tz_localize(None)
\`\`\`

---

## 2. Slicing by Date

\`\`\`python
# Partial string indexing — Pandas parses it automatically
df['2023']                          # entire year
df['2023-Q4']                       # Q4 2023
df['2023-11':'2023-12']             # Nov–Dec 2023
df['2023-11-01':'2023-11-30']       # exact date range

# Programmatic slicing
df.loc['2023-01-01':'2023-06-30']

# Last N days
df.last('30D')
df.first('7D')
\`\`\`

---

## 3. Resampling — Changing Time Granularity

\`\`\`python
# Downsample: daily → monthly (aggregating)
monthly_revenue = df['revenue'].resample('ME').sum()       # month-end
monthly_avg     = df['revenue'].resample('ME').mean()
quarterly       = df['revenue'].resample('QE').sum()       # quarter-end
weekly          = df['revenue'].resample('W-MON').sum()    # week ending Monday

# Multiple aggregations at once
monthly_stats = df['revenue'].resample('ME').agg({
    'revenue': ['sum', 'mean', 'max', 'count']
})

# Upsample: monthly → daily (filling gaps)
daily_from_monthly = monthly_revenue.resample('D').interpolate('linear')
ffill_daily        = monthly_revenue.resample('D').ffill()   # forward fill

# Common resample offset aliases:
# 'D' = calendar day  'B' = business day  'W' = week
# 'ME' = month end    'MS' = month start  'QE' = quarter end
# 'YE' = year end     'h' = hour          'T'/'min' = minute
\`\`\`

---

## 4. Rolling Windows — Moving Averages and Statistics

\`\`\`python
# Simple moving averages (SMA)
df['sma_7']  = df['revenue'].rolling(window=7).mean()
df['sma_30'] = df['revenue'].rolling(window=30).mean()

# Minimum periods — compute even if window is not full yet
df['sma_7_minp'] = df['revenue'].rolling(window=7, min_periods=1).mean()

# Rolling std dev (volatility)
df['volatility_30d'] = df['revenue'].rolling(30).std()

# Rolling min/max (price channels)
df['rolling_max_30'] = df['revenue'].rolling(30).max()
df['rolling_min_30'] = df['revenue'].rolling(30).min()

# Multiple rolling aggregations
df[['sma_7','sma_30','vol_30']] = df['revenue'].rolling(30).agg(
    sma_7=lambda x: x.iloc[-min(7,len(x)):].mean(),
    sma_30='mean',
    vol_30='std'
)
\`\`\`

### Exponentially Weighted Moving Average (EWMA)

EWMA gives more weight to recent observations — better for financial and fast-changing metrics:

\`\`\`python
# Span=7 ≈ 7-period SMA but weighted toward recent values
df['ewma_7']  = df['revenue'].ewm(span=7,  adjust=False).mean()
df['ewma_30'] = df['revenue'].ewm(span=30, adjust=False).mean()
\`\`\`

---

## 5. Expanding Windows — Cumulative Statistics

\`\`\`python
# Running (cumulative) total
df['cumulative_revenue']  = df['revenue'].expanding().sum()

# Running average — useful for tracking a KPI over all time
df['running_avg']         = df['revenue'].expanding().mean()

# Year-to-date (YTD)
df['ytd_revenue'] = df.groupby(df.index.year)['revenue'].expanding().sum().droplevel(0)
\`\`\`

---

## 6. Shift and diff — Lag Features and Period-over-Period Changes

\`\`\`python
# Lag features (shift forward in time)
df['lag_1d']  = df['revenue'].shift(1)    # yesterday's revenue
df['lag_7d']  = df['revenue'].shift(7)    # same day last week
df['lag_28d'] = df['revenue'].shift(28)   # four weeks ago

# Period-over-period changes
df['dod_change'] = df['revenue'].diff(1)                            # day-over-day absolute change
df['wow_change'] = df['revenue'].diff(7)                            # week-over-week absolute change
df['dod_pct']    = df['revenue'].pct_change(periods=1) * 100        # day-over-day %
df['wow_pct']    = df['revenue'].pct_change(periods=7) * 100        # week-over-week %
df['yoy_pct']    = df['revenue'].pct_change(periods=365) * 100      # year-over-year %

# Month-over-month % change using resampled data
monthly   = df['revenue'].resample('ME').sum()
mom_pct   = monthly.pct_change() * 100
\`\`\`

---

## 7. Date-Based Feature Engineering for Machine Learning

Date features dramatically improve ML models on business data:

\`\`\`python
def add_date_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add time-based features from a DatetimeIndex."""
    df = df.copy()
    idx = df.index

    df['day_of_week']    = idx.dayofweek          # 0=Monday … 6=Sunday
    df['day_of_month']   = idx.day
    df['day_of_year']    = idx.dayofyear
    df['week_of_year']   = idx.isocalendar().week.astype(int)
    df['month']          = idx.month
    df['quarter']        = idx.quarter
    df['year']           = idx.year
    df['is_weekend']     = (idx.dayofweek >= 5).astype(int)
    df['is_month_start'] = idx.is_month_start.astype(int)
    df['is_month_end']   = idx.is_month_end.astype(int)
    df['is_quarter_end'] = idx.is_quarter_end.astype(int)

    # Cyclical encoding (avoids December=12 being "far" from January=1)
    df['month_sin'] = np.sin(2 * np.pi * idx.month / 12)
    df['month_cos'] = np.cos(2 * np.pi * idx.month / 12)
    df['dow_sin']   = np.sin(2 * np.pi * idx.dayofweek / 7)
    df['dow_cos']   = np.cos(2 * np.pi * idx.dayofweek / 7)

    return df

df = add_date_features(df)
\`\`\`

---

## 8. Seasonal Decomposition

Decompose a time series into **Trend + Seasonality + Residual**:

\`\`\`python
from statsmodels.tsa.seasonal import seasonal_decompose
import matplotlib.pyplot as plt

# Additive model: Y = Trend + Seasonality + Residual
# Use additive when seasonal variation is roughly constant in magnitude
result = seasonal_decompose(df['revenue'], model='additive', period=7)   # weekly seasonality

# Multiplicative model: Y = Trend × Seasonality × Residual
# Use multiplicative when seasonal swings grow with the trend
result_mult = seasonal_decompose(df['revenue'], model='multiplicative', period=7)

# Inspect components
trend     = result.trend.dropna()
seasonal  = result.seasonal
residual  = result.resid.dropna()

# The residual should look like white noise (no pattern)
# If residual has a pattern, the model is missing something

fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)
df['revenue'].plot(ax=axes[0], title='Original')
trend.plot(ax=axes[1], title='Trend')
seasonal.plot(ax=axes[2], title='Seasonal')
residual.plot(ax=axes[3], title='Residual')
plt.tight_layout()
\`\`\`

---

## 9. Stationarity — Why It Matters

Many time series models require **stationarity** (constant mean and variance over time):

\`\`\`python
from statsmodels.tsa.stattools import adfuller

def check_stationarity(series: pd.Series) -> dict:
    """Augmented Dickey-Fuller test."""
    result = adfuller(series.dropna(), autolag='AIC')
    return {
        'adf_statistic': result[0],
        'p_value':       result[1],
        'is_stationary': result[1] < 0.05,   # p < 0.05 → stationary
        'critical_values': result[4],
    }

print(check_stationarity(df['revenue']))

# Make stationary by differencing
df['revenue_diff'] = df['revenue'].diff(1)
print(check_stationarity(df['revenue_diff']))
\`\`\`

---

## 10. Missing Dates and Gaps

\`\`\`python
# Find gaps in daily data
full_range = pd.date_range(start=df.index.min(), end=df.index.max(), freq='D')
missing_dates = full_range.difference(df.index)
print(f"Missing dates: {len(missing_dates)}")
print(missing_dates)

# Reindex to fill gaps (introduces NaN for missing days)
df = df.reindex(full_range)

# Fill strategies for missing time series data
df['revenue'] = df['revenue'].ffill()                        # carry forward
df['revenue'] = df['revenue'].interpolate('linear')          # linear interpolation
df['revenue'] = df['revenue'].interpolate('time')            # time-aware interpolation
\`\`\`

---

## Summary

| Concept | Pandas tool |
|---------|-------------|
| Parse dates | \`pd.to_datetime()\`, \`parse_dates\` in \`read_csv\` |
| Set time index | \`df.set_index('date')\` |
| Resample | \`df.resample('ME').sum()\` |
| Rolling window | \`df.rolling(7).mean()\` |
| EWMA | \`df.ewm(span=7).mean()\` |
| Lag / shift | \`df.shift(7)\` |
| % change | \`df.pct_change(7)\` |
| Cumulative | \`df.expanding().sum()\` |
| Decomposition | \`seasonal_decompose()\` |
| Stationarity | \`adfuller()\` |
`,
    codeExample: `import pandas as pd

df = pd.read_csv('daily_revenue.csv', parse_dates=['date'], index_col='date').sort_index()

# Rolling KPIs
df['sma_7']      = df['revenue'].rolling(7).mean()
df['sma_30']     = df['revenue'].rolling(30).mean()
df['wow_pct']    = df['revenue'].pct_change(7) * 100
df['yoy_pct']    = df['revenue'].pct_change(365) * 100
df['cumulative'] = df['revenue'].expanding().sum()

# Monthly summary
monthly = df['revenue'].resample('ME').agg(['sum','mean','max'])

# Date features for ML
df['is_weekend']  = (df.index.dayofweek >= 5).astype(int)
df['month']       = df.index.month
df['quarter']     = df.index.quarter

print(monthly.tail(6))`,

    quiz: {
      title: 'Time Series Analysis with Pandas — Quiz',
      questions: [
        {
          text: 'Why should you call sort_index() after setting a DatetimeIndex?',
          options: opts(
            'It converts the index to string for display',
            'Time series operations (rolling, resample, slicing) assume chronological order — unsorted data produces incorrect results',
            'It removes duplicate dates automatically',
            'sort_index() is required to enable the resample() method'
          ),
          correctAnswer: 'b',
          explanation: 'Rolling windows, resampling, and slicing by date all require the index to be sorted chronologically. Unsorted data silently produces wrong rolling and cumulative calculations.',
          orderIndex: 1,
        },
        {
          text: 'What does df["revenue"].resample("ME").sum() do?',
          options: opts(
            'Computes a 30-day rolling sum',
            'Groups daily revenue by month-end and sums each month\'s total',
            'Resamples to millisecond frequency and fills with NaN',
            'Returns the revenue on the last day of each month'
          ),
          correctAnswer: 'b',
          explanation: '"ME" means month-end frequency. resample("ME").sum() aggregates all daily values within each calendar month into a single monthly sum.',
          orderIndex: 2,
        },
        {
          text: 'df["revenue"].rolling(7).mean() returns NaN for the first 6 rows. Why?',
          options: opts(
            'Pandas has a bug with small windows',
            'By default, a window requires at least `window` observations — the first 6 rows do not have 7 predecessors',
            'The first 6 rows have NaN revenue values',
            'rolling() skips weekends automatically'
          ),
          correctAnswer: 'b',
          explanation: 'The default min_periods = window size. Setting min_periods=1 computes the average of however many values are available, filling from the first row.',
          orderIndex: 3,
        },
        {
          text: 'What is the difference between df.shift(7) and df.diff(7)?',
          options: opts(
            'shift returns values from 7 rows ago; diff returns the difference between the current row and 7 rows ago',
            'shift computes pct change; diff computes absolute change',
            'They are identical — both shift data by 7 periods',
            'diff shifts forward; shift shifts backward'
          ),
          correctAnswer: 'a',
          explanation: 'shift(7) displaces the column 7 periods into the future (lag feature). diff(7) = current_value − value_7_periods_ago. diff(n) is equivalent to series - series.shift(n).',
          orderIndex: 4,
        },
        {
          text: 'When should you use a multiplicative decomposition model vs additive?',
          options: opts(
            'Additive when the dataset has more than 1,000 rows',
            'Multiplicative when seasonal swings grow proportionally with the trend level; additive when they stay constant',
            'Multiplicative for weekly data; additive for monthly',
            'They are interchangeable — the choice does not affect results'
          ),
          correctAnswer: 'b',
          explanation: 'If revenue is $1M and seasonal dips are $100k, but later revenue is $10M and seasonal dips are $1M (same 10%), use multiplicative. If the dip stays $100k regardless of trend level, use additive.',
          orderIndex: 5,
        },
        {
          text: 'Why do you encode month as sin/cos (cyclical encoding) rather than using the raw integer (1–12)?',
          options: opts(
            'sin/cos values are faster to compute',
            'Raw integers imply December (12) is far from January (1), but cyclically they are adjacent',
            'ML models cannot process integers larger than 12',
            'Cyclical encoding reduces the number of features'
          ),
          correctAnswer: 'b',
          explanation: 'A raw month integer gives December=12 and January=1 a distance of 11 — yet they are only one month apart. Encoding as sin/cos wraps the circle so adjacency is preserved.',
          orderIndex: 6,
        },
        {
          text: 'What does df["revenue"].pct_change(periods=7) compute?',
          options: opts(
            '7-day rolling average',
            'Week-over-week percentage change for each day',
            'Percentage of total revenue in 7 days',
            'The 7th percentile of revenue'
          ),
          correctAnswer: 'b',
          explanation: 'pct_change(7) computes (current − 7 periods ago) / 7 periods ago — the week-over-week growth rate for daily data.',
          orderIndex: 7,
        },
        {
          text: 'What does the Augmented Dickey-Fuller (ADF) test check?',
          options: opts(
            'Whether the time series has seasonality',
            'Whether the time series is stationary (constant mean and variance)',
            'Whether the rolling window is large enough',
            'Whether there are missing dates in the index'
          ),
          correctAnswer: 'b',
          explanation: 'ADF tests the null hypothesis that the series has a unit root (non-stationary). p < 0.05 → reject → series is stationary. Many forecasting models require stationarity.',
          orderIndex: 8,
        },
        {
          text: 'df["revenue"].expanding().sum() computes:',
          options: opts(
            'The sum of the last n rows based on a growing window',
            'The cumulative running total from the start of the series to each row',
            'The same as rolling().sum() with window=len(df)',
            'The sum excluding the current row'
          ),
          correctAnswer: 'b',
          explanation: 'expanding() uses a window that starts at the beginning and grows by one row at each step — producing the running cumulative total (or mean, max, etc.).',
          orderIndex: 9,
        },
        {
          text: 'You resample daily data to monthly and then want daily again with gaps filled. Which method preserves the shape of the original data best?',
          options: opts(
            'ffill() — forward fill',
            'bfill() — backward fill',
            'interpolate("time") — linear interpolation respecting time gaps',
            'fillna(0)'
          ),
          correctAnswer: 'c',
          explanation: 'interpolate("time") computes values proportional to the time distance between known points — far more accurate than flat forward/backward fill for smooth business metrics.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 9 — Python Performance & Production-Grade Code
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-9-python-performance',
    title:      'Python Performance & Production-Grade Code',
    description:'Write analytics code that scales to millions of rows — master vectorisation over loops, generators, Pandas anti-patterns, memory optimisation, profiling, and writing clean testable pipelines.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 108,
    xpReward:   110,
    language:   'python',
    content: `# Python Performance & Production-Grade Code

## What You'll Learn
Scripts that run fine on 10,000 rows break on 10 million. This chapter teaches you to write analytics code that is fast, memory-efficient, and maintainable — the difference between a junior and a senior analyst's code.

---

## 1. Profiling First — Measure Before You Optimise

Never guess at bottlenecks. Measure first.

\`\`\`python
import cProfile
import pstats
import time

# --- cProfile ---
pr = cProfile.Profile()
pr.enable()

# Your slow code here
result = slow_function(df)

pr.disable()
stats = pstats.Stats(pr).sort_stats('cumulative')
stats.print_stats(10)   # Top 10 slowest functions

# --- %timeit in Jupyter ---
%timeit df['col'].apply(lambda x: x * 2)   # Slow
%timeit df['col'] * 2                        # Fast

# --- line_profiler (pip install line_profiler) ---
# @profile decorator — run with: kernprof -l -v script.py

# --- memory_profiler (pip install memory_profiler) ---
# @memory_profiler.profile decorator
\`\`\`

---

## 2. The Golden Rule — Vectorise, Don't Loop

Python loops over DataFrame rows are 100–1000× slower than vectorised NumPy/Pandas operations.

\`\`\`python
import pandas as pd
import numpy as np

n = 1_000_000
df = pd.DataFrame({'price': np.random.uniform(10, 500, n),
                   'qty':   np.random.randint(1, 50, n),
                   'disc':  np.random.uniform(0, 0.3, n)})

# ❌ NEVER DO THIS — iterrows is the slowest possible approach
for idx, row in df.iterrows():
    df.loc[idx, 'total'] = row['price'] * row['qty'] * (1 - row['disc'])
# On 1M rows this takes ~5 minutes

# ❌ Still bad — apply is just a dressed-up Python loop
df['total'] = df.apply(lambda r: r['price'] * r['qty'] * (1 - r['disc']), axis=1)
# ~30 seconds on 1M rows

# ✅ VECTORISED — operates at C speed
df['total'] = df['price'] * df['qty'] * (1 - df['disc'])
# < 0.1 seconds on 1M rows

# ✅ NumPy where — conditional logic without apply
df['category'] = np.where(df['total'] > 500, 'Large', 'Small')

# ✅ np.select — multiple conditions
conditions = [df['total'] > 1000, df['total'] > 500, df['total'] > 100]
choices    = ['XL', 'Large', 'Medium']
df['size'] = np.select(conditions, choices, default='Small')
\`\`\`

---

## 3. When apply() Is Acceptable

\`\`\`python
# apply() is acceptable ONLY when there is no vectorised alternative:

# 1. Complex custom logic that can't be expressed with operators
df['parsed'] = df['raw_text'].apply(parse_complex_address)

# 2. Operations on strings that need Python logic
df['initials'] = df['full_name'].apply(lambda n: '.'.join(p[0] for p in n.split()))

# Speed up apply() with swifter (parallelises automatically)
# pip install swifter
import swifter
df['result'] = df['col'].swifter.apply(expensive_function)
\`\`\`

---

## 4. Generators — Lazy, Memory-Efficient Iteration

A **generator** produces values one at a time instead of building the whole list in memory:

\`\`\`python
# ❌ List comprehension — builds entire list in RAM
squares_list = [x**2 for x in range(10_000_000)]   # ~400 MB

# ✅ Generator — one value at a time, negligible RAM
squares_gen  = (x**2 for x in range(10_000_000))

# Generators for processing large files
def parse_log_lines(filepath: str):
    """Yield one parsed record per log line — never loads the whole file."""
    with open(filepath) as f:
        for line in f:
            parts = line.strip().split('|')
            if len(parts) == 4:
                yield {
                    'timestamp': parts[0],
                    'level':     parts[1],
                    'user_id':   parts[2],
                    'event':     parts[3],
                }

# Process without loading everything
error_count = sum(1 for rec in parse_log_lines('app.log') if rec['level'] == 'ERROR')

# Chunked CSV reading — essential for files larger than RAM
def read_large_csv(path: str, chunk_size: int = 50_000):
    for chunk in pd.read_csv(path, chunksize=chunk_size):
        yield chunk

totals = pd.concat(
    chunk.groupby('category')['amount'].sum()
    for chunk in read_large_csv('100gb_file.csv')
).groupby(level=0).sum()
\`\`\`

---

## 5. Memory Optimisation — dtype Downcasting

\`\`\`python
def optimise_dtypes(df: pd.DataFrame) -> pd.DataFrame:
    """Reduce DataFrame memory usage by downcasting numeric types."""
    df = df.copy()

    for col in df.select_dtypes(include='int').columns:
        df[col] = pd.to_numeric(df[col], downcast='integer')

    for col in df.select_dtypes(include='float').columns:
        df[col] = pd.to_numeric(df[col], downcast='float')

    # Low-cardinality string columns → category (huge savings)
    for col in df.select_dtypes(include='object').columns:
        if df[col].nunique() / len(df) < 0.05:   # less than 5% unique values
            df[col] = df[col].astype('category')

    return df

before = df.memory_usage(deep=True).sum() / 1024**2
df_opt = optimise_dtypes(df)
after  = df_opt.memory_usage(deep=True).sum() / 1024**2
print(f"Memory: {before:.1f} MB → {after:.1f} MB ({(1-after/before)*100:.0f}% reduction)")
\`\`\`

**Real savings:**
| dtype | Bytes | Typical downcast |
|-------|-------|-----------------|
| int64 | 8 | int8 (−128..127) or int16 or int32 |
| float64 | 8 | float32 (4 bytes, ~7 significant digits) |
| object (string) | 50+ avg | category (4 bytes per value) |

---

## 6. Pandas Anti-Patterns and Fixes

\`\`\`python
# ❌ Chained assignment (unpredictable, raises SettingWithCopyWarning)
df[df['country'] == 'US']['revenue'] = df['revenue'] * 1.1   # may not work!

# ✅ Use .loc for in-place modification
df.loc[df['country'] == 'US', 'revenue'] = df.loc[df['country'] == 'US', 'revenue'] * 1.1
# or even better:
mask = df['country'] == 'US'
df.loc[mask, 'revenue'] *= 1.1

# ❌ Repeated concatenation in a loop (O(n²) copies)
result = pd.DataFrame()
for file in files:
    result = pd.concat([result, pd.read_csv(file)])   # slow!

# ✅ Collect then concat once
result = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)

# ❌ Boolean indexing creating copies inside loops
for col in cols:
    subset = df[df['flag'] == True]   # creates a copy each iteration
    process(subset[col])

# ✅ Filter once, use repeatedly
subset = df[df['flag']].copy()
for col in cols:
    process(subset[col])
\`\`\`

---

## 7. Python Built-ins That Replace Custom Loops

\`\`\`python
# any() / all() — short-circuit evaluation
has_nulls = any(df[col].isna().any() for col in df.columns)
all_positive = all((df[col] > 0).all() for col in numeric_cols)

# zip() — iterate two lists in parallel without index
for col, alias in zip(df.columns, column_aliases):
    df = df.rename(columns={col: alias})

# enumerate() — index + value without range(len())
for i, col in enumerate(df.columns):
    print(f"Column {i}: {col}")

# map() — apply a function lazily
cleaned = list(map(str.strip, raw_strings))

# dict comprehension — build lookup tables
col_types = {col: df[col].dtype for col in df.columns}
median_by_group = {g: grp['value'].median() for g, grp in df.groupby('category')}
\`\`\`

---

## 8. Writing Testable Analytics Code

\`\`\`python
# ❌ Untestable script — global state, no functions
df = pd.read_csv('data.csv')
df['revenue'] = df['price'] * df['quantity']
df = df[df['revenue'] > 0]
df.to_csv('output.csv')

# ✅ Testable functions with clear input/output contracts
def calculate_revenue(df: pd.DataFrame,
                      price_col: str = 'price',
                      qty_col: str = 'quantity') -> pd.DataFrame:
    """Add a 'revenue' column = price × quantity."""
    required = {price_col, qty_col}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    df = df.copy()
    df['revenue'] = df[price_col] * df[qty_col]
    return df

def filter_positive_revenue(df: pd.DataFrame) -> pd.DataFrame:
    """Remove rows with non-positive revenue."""
    return df[df['revenue'] > 0].reset_index(drop=True)

# --- Unit tests (pytest) ---
import pytest

def test_calculate_revenue():
    data = pd.DataFrame({'price': [10, 20], 'quantity': [3, 5]})
    result = calculate_revenue(data)
    assert 'revenue' in result.columns
    assert list(result['revenue']) == [30, 100]

def test_calculate_revenue_missing_col():
    data = pd.DataFrame({'price': [10]})
    with pytest.raises(ValueError):
        calculate_revenue(data)
\`\`\`

---

## 9. Performance Hierarchy (fastest → slowest)

| Approach | Relative speed | Use when |
|----------|---------------|----------|
| NumPy vectorised ops | 1× (baseline) | Pure numeric operations |
| Pandas vectorised ops | ~2× slower | Mixed dtype DataFrame ops |
| Pandas \`str\` accessor | ~10× slower | String operations |
| \`df.apply(axis=1)\` | ~100× slower | No vectorised alternative |
| \`df.itertuples()\` | ~200× slower | Rare: must iterate rows |
| \`df.iterrows()\` | ~1000× slower | Never for performance-sensitive code |

---

## Summary
- **Profile before optimising** — cProfile and %timeit tell you where the time actually goes.
- **Vectorise everything** — replace loops with Pandas/NumPy column operations.
- **Use generators** for large file processing — never load what you don't need into RAM.
- **Downcast dtypes** — a single optimise_dtypes() call can halve your memory footprint.
- **Collect then concat** — never concatenate inside a loop.
- **Write functions** — testable, single-responsibility functions are the foundation of reliable analytics code.
`,
    codeExample: `import pandas as pd
import numpy as np

df = pd.read_csv('transactions.csv')

# 1. Vectorised calculations — never use iterrows
df['total']    = df['price'] * df['qty'] * (1 - df['discount'])
df['tier']     = np.select(
    [df['total'] > 1000, df['total'] > 200],
    ['Premium', 'Standard'], default='Basic'
)

# 2. Memory optimisation
for col in df.select_dtypes('int'):
    df[col] = pd.to_numeric(df[col], downcast='integer')
for col in df.select_dtypes('object'):
    if df[col].nunique() / len(df) < 0.05:
        df[col] = df[col].astype('category')

# 3. Generator for large file
def monthly_totals(path):
    for chunk in pd.read_csv(path, chunksize=50_000, parse_dates=['date']):
        yield chunk.resample('ME', on='date')['amount'].sum()

result = pd.concat(monthly_totals('big.csv')).groupby(level=0).sum()`,

    quiz: {
      title: 'Python Performance & Production-Grade Code — Quiz',
      questions: [
        {
          text: 'Why is df.iterrows() considered the worst way to process DataFrame rows?',
          options: opts(
            'iterrows() cannot handle NaN values',
            'It converts each row to a Python object and loops in pure Python — 100–1000× slower than vectorised operations',
            'iterrows() only works on DataFrames with fewer than 10,000 rows',
            'It modifies the original DataFrame in place'
          ),
          correctAnswer: 'b',
          explanation: 'iterrows() abandons NumPy\'s C-speed array operations and falls back to pure Python iteration. Vectorised operations stay in C — the difference compounds rapidly on large datasets.',
          orderIndex: 1,
        },
        {
          text: 'What is the key memory advantage of a generator over a list comprehension?',
          options: opts(
            'Generators store results in a faster memory region',
            'Generators produce values one at a time on demand — they never hold the entire sequence in RAM simultaneously',
            'Generators are automatically parallelised across CPU cores',
            'Generators are faster to write'
          ),
          correctAnswer: 'b',
          explanation: 'A list comprehension builds the complete list in RAM before you use any value. A generator uses O(1) memory because it yields one item, then discards it before computing the next.',
          orderIndex: 2,
        },
        {
          text: 'np.where(df["revenue"] > 500, "Large", "Small") is preferred over apply() because:',
          options: opts(
            'np.where returns a Pandas Series; apply() returns a list',
            'np.where operates on the entire array in C — vectorised; apply() loops in Python',
            'apply() does not support string return values',
            'np.where is shorter to type'
          ),
          correctAnswer: 'b',
          explanation: 'np.where evaluates the condition and selects values across the entire NumPy array at C speed. apply(axis=1) calls your Python function once per row — orders of magnitude slower.',
          orderIndex: 3,
        },
        {
          text: 'Converting a low-cardinality string column (e.g., "country" with 50 unique values) to category dtype saves memory because:',
          options: opts(
            'Categories are stored as integers (codes) internally rather than repeating the full string for each row',
            'Pandas compresses the column using gzip',
            'category columns are stored on disk, not in RAM',
            'category skips null values in calculations'
          ),
          correctAnswer: 'a',
          explanation: 'Pandas stores category columns as an integer code array (4 bytes/row) + a small lookup dictionary. An object column stores the full Python string object per row — often 50+ bytes each.',
          orderIndex: 4,
        },
        {
          text: 'Why is concatenating DataFrames inside a loop (result = pd.concat([result, chunk])) slow?',
          options: opts(
            'pd.concat cannot handle more than 100 calls',
            'Each concat creates a new DataFrame by copying all previous data — total copies are O(n²)',
            'The loop prevents garbage collection of old DataFrames',
            'pd.concat inside a loop loses the index'
          ),
          correctAnswer: 'b',
          explanation: 'With each iteration, all previous rows are copied again. After k iterations you\'ve done k×(k+1)/2 row copies. Collecting all chunks in a list then calling pd.concat once copies each row exactly once.',
          orderIndex: 5,
        },
        {
          text: 'What does pd.to_numeric(df["qty"], downcast="integer") do?',
          options: opts(
            'Converts the column to float64',
            'Casts the column to the smallest integer type that can hold all values without overflow',
            'Removes non-integer values from the column',
            'Converts the column to a Python int list'
          ),
          correctAnswer: 'b',
          explanation: 'downcast="integer" finds the smallest integer dtype (int8, int16, int32, int64) that fits the actual values — reducing memory from 8 bytes/value (int64) to as little as 1 byte (int8).',
          orderIndex: 6,
        },
        {
          text: 'Which of the following is a "chained assignment" anti-pattern in Pandas?',
          options: opts(
            'df.loc[mask, "col"] = value',
            'df["col"] = df["col"] * 2',
            'df[df["country"] == "US"]["revenue"] = 0',
            'df = df.copy()'
          ),
          correctAnswer: 'c',
          explanation: 'df[condition]["col"] = value chains two __getitem__ calls. The first creates a copy, and setting on a copy doesn\'t modify the original. Use df.loc[condition, "col"] = value instead.',
          orderIndex: 7,
        },
        {
          text: 'What is the primary purpose of writing analytics code as functions rather than top-level scripts?',
          options: opts(
            'Functions run faster than top-level code',
            'Functions make code testable, reusable, and composable — you can write unit tests and call the same logic from multiple places',
            'Python interprets functions before the rest of the file',
            'Functions automatically prevent runtime errors'
          ),
          correctAnswer: 'b',
          explanation: 'Functions encapsulate logic with clear inputs and outputs, making it possible to write automated tests, import and reuse code across notebooks, and debug in isolation.',
          orderIndex: 8,
        },
        {
          text: 'pd.read_csv("file.csv", chunksize=50000) is used because:',
          options: opts(
            'It reads exactly 50,000 files at once',
            'It processes the CSV in 50,000-row batches, so only one chunk is in memory at a time — enabling files larger than RAM',
            'chunksize limits the number of columns loaded',
            'It automatically parallelises across 50,000 CPU threads'
          ),
          correctAnswer: 'b',
          explanation: 'chunksize makes read_csv return an iterator. Each iteration loads one chunk, processes it, then discards it — making it possible to process arbitrarily large files with constant memory usage.',
          orderIndex: 9,
        },
        {
          text: 'The "collect then concat" pattern replaces concatenation inside a loop. What is it?',
          options: opts(
            'Sorting all DataFrames before concatenating',
            'Building a Python list of DataFrames during a loop, then calling pd.concat(list) once at the end',
            'Writing each chunk to disk, then loading all at once',
            'Using multiprocessing to concat in parallel'
          ),
          correctAnswer: 'b',
          explanation: 'Collecting DataFrames in a list (O(n) total memory writes) then calling pd.concat([...]) once (O(n) one final time) is dramatically faster than concatenating at each loop step (O(n²) total writes).',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 10 — Regular Expressions & Text Data Extraction
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-10-regex-text-data',
    title:      'Regular Expressions & Text Data Extraction',
    description:'Parse logs, extract structured fields from messy strings, validate data, and process text at scale — mastering Python\'s re module and Pandas str accessor for real-world analytics tasks.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 109,
    xpReward:   110,
    language:   'python',
    content: `# Regular Expressions & Text Data Extraction

## What You'll Learn
Analysts constantly receive data in messy, semi-structured text — server logs, customer feedback exports, scraped web data, CRM notes. Regular expressions (regex) let you extract, validate, and transform text data with surgical precision. You'll learn the full pattern syntax, Python's re module, Pandas string operations, and applied log-parsing workflows.

---

## 1. What Is a Regular Expression?

A **regular expression** is a pattern that describes a set of strings. The regex engine checks whether a string matches the pattern, and where.

\`\`\`python
import re

text = "Order #10432 placed on 2024-03-15 — total: $245.99"

# Does it contain a date?
match = re.search(r'\\d{4}-\\d{2}-\\d{2}', text)
if match:
    print(f"Found date: {match.group()}")   # 2024-03-15
\`\`\`

---

## 2. Pattern Building Blocks

| Pattern | Meaning | Example match |
|---------|---------|---------------|
| \`\\d\` | Digit [0-9] | \`\\d{3}\` → "123" |
| \`\\w\` | Word char [a-zA-Z0-9_] | \`\\w+\` → "hello_world" |
| \`\\s\` | Whitespace | \`\\s+\` → "   " |
| \`.\` | Any char except newline | \`a.b\` → "axb" |
| \`^\` | Start of string | \`^Error\` |
| \`$\` | End of string | \`\\.csv$\` |
| \`*\` | 0 or more | \`a*\` → "", "a", "aaa" |
| \`+\` | 1 or more | \`\\d+\` → "1", "123" |
| \`?\` | 0 or 1 (optional) | \`colou?r\` → "color" or "colour" |
| \`{n,m}\` | Between n and m | \`\\d{2,4}\` → "12", "1234" |
| \`[abc]\` | Character class | \`[aeiou]\` → vowels |
| \`[^abc]\` | Negated class | \`[^\\d]\` → non-digits |
| \`(a|b)\` | Alternation | \`cat|dog\` |
| \`(?:...)\` | Non-capturing group | Groups without capturing |
| \`(?P<name>...)\` | Named group | Named capture |

**Always use raw strings** \`r"pattern"\` — avoids Python escape conflicts with \`\\\`.

---

## 3. The re Module — Core Functions

\`\`\`python
import re

text = "Contact: alice@company.com or bob.smith@example.org"

# re.search — find first match anywhere in string
m = re.search(r'[\\w.+-]+@[\\w-]+\\.[\\w.]+', text)
print(m.group() if m else None)   # alice@company.com

# re.findall — return all matches as a list
emails = re.findall(r'[\\w.+-]+@[\\w-]+\\.[\\w.]+', text)
print(emails)   # ['alice@company.com', 'bob.smith@example.org']

# re.match — only matches at the START of the string
m = re.match(r'Contact', text)   # Works
m = re.match(r'alice', text)     # None — 'alice' is not at start

# re.fullmatch — entire string must match
re.fullmatch(r'\\d{4}-\\d{2}-\\d{2}', '2024-03-15')  # Match
re.fullmatch(r'\\d{4}-\\d{2}-\\d{2}', '2024-03-15 extra')  # None

# re.sub — find and replace
cleaned = re.sub(r'\\s+', ' ', "too   many    spaces")   # "too many spaces"
masked  = re.sub(r'\\d{4}(\\d{4})', r'****\\1', '4111111111111234')  # mask card

# re.split — split on a pattern
parts = re.split(r'[;,|\\t]+', 'a,b;c|d\\te')   # ['a','b','c','d','e']

# re.compile — pre-compile for repeated use (big speed gain in loops)
date_re = re.compile(r'(\\d{4})-(\\d{2})-(\\d{2})')
for line in lines:
    m = date_re.search(line)   # uses compiled pattern — much faster
\`\`\`

---

## 4. Groups — Extracting Sub-Parts

\`\`\`python
text = "2024-03-15"

# Positional groups
m = re.search(r'(\\d{4})-(\\d{2})-(\\d{2})', text)
year, month, day = m.group(1), m.group(2), m.group(3)

# Named groups — self-documenting and robust to order changes
m = re.search(r'(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})', text)
d = m.groupdict()   # {'year': '2024', 'month': '03', 'day': '15'}

# Non-capturing group — for structure, not capture
re.search(r'(?:https?://)([\\w./-]+)', 'Visit https://example.com/path')
# group(1) → 'example.com/path' (only the host/path, not the scheme)
\`\`\`

---

## 5. Real-World Use Case — Parsing Server Logs

\`\`\`python
import re
import pandas as pd

# Apache Combined Log Format:
# 192.168.1.1 - - [15/Mar/2024:08:23:11 +0000] "GET /api/users HTTP/1.1" 200 1234
LOG_PATTERN = re.compile(
    r'(?P<ip>\\d+\\.\\d+\\.\\d+\\.\\d+)'
    r'.+?'
    r'\\[(?P<timestamp>[^\\]]+)\\]'
    r' "(?P<method>\\w+) (?P<path>\\S+) HTTP/[\\d.]+"'
    r' (?P<status>\\d{3})'
    r' (?P<bytes>\\d+|-)'
)

def parse_log_file(filepath: str) -> pd.DataFrame:
    records = []
    with open(filepath) as f:
        for line in f:
            m = LOG_PATTERN.search(line)
            if m:
                rec = m.groupdict()
                rec['bytes'] = int(rec['bytes']) if rec['bytes'] != '-' else 0
                records.append(rec)
    df = pd.DataFrame(records)
    df['timestamp'] = pd.to_datetime(df['timestamp'], format='%d/%b/%Y:%H:%M:%S %z')
    df['status']    = df['status'].astype(int)
    return df

logs = parse_log_file('access.log')
print(logs.groupby('status').size())          # error rate by status code
print(logs.groupby('path')['bytes'].sum())    # bandwidth by endpoint
\`\`\`

---

## 6. Pandas str Accessor — Regex at DataFrame Scale

\`\`\`python
df = pd.DataFrame({
    'phone': ['+1 (555) 123-4567', '555.987.6543', '(800) 234 5678', 'invalid'],
    'email': ['alice@corp.com', 'BOB@EXAMPLE.COM', 'invalid-email', 'carol@co.uk'],
    'amount': ['$1,234.56', '$99.00', '$10,000', 'N/A'],
    'log': ['ERROR 2024-03-15: disk full', 'INFO 2024-03-16: OK', 'WARN: low memory'],
})

# Validate emails
df['email_valid'] = df['email'].str.match(r'^[\\w.+-]+@[\\w-]+\\.[\\w.]+$')

# Normalise email to lowercase
df['email_clean'] = df['email'].str.lower()

# Extract phone digits only
df['phone_digits'] = df['phone'].str.replace(r'[^\\d]', '', regex=True)

# Parse dollar amounts → float
df['amount_float'] = (df['amount']
    .str.replace(r'[\\$,]', '', regex=True)
    .pipe(pd.to_numeric, errors='coerce'))

# Extract named groups from log column
extracted = df['log'].str.extract(
    r'(?P<level>ERROR|INFO|WARN)\\s+(?P<date>\\d{4}-\\d{2}-\\d{2})?:?\\s*(?P<message>.*)'
)
df = pd.concat([df, extracted], axis=1)

# str.contains for filtering
errors = df[df['log'].str.contains(r'^ERROR', regex=True, na=False)]

# str.split — expand into multiple columns
df[['first', 'last']] = df['name'].str.split(' ', n=1, expand=True)
\`\`\`

---

## 7. Common Regex Patterns for Data Analytics

\`\`\`python
PATTERNS = {
    'email':      r'[\\w.+-]+@[\\w-]+\\.[\\w.]+',
    'url':        r'https?://[\\w/:%#\\$&?()~.=+\\-]+',
    'ip_address': r'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    'date_iso':   r'\\d{4}-\\d{2}-\\d{2}',
    'date_us':    r'\\b(0?[1-9]|1[0-2])/(0?[1-9]|[12]\\d|3[01])/(\\d{4})\\b',
    'phone_us':   r'\\b(?:\\+1[\\s.-]?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}\\b',
    'currency':   r'\\$?\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?',
    'zip_code':   r'\\b\\d{5}(?:-\\d{4})?\\b',
    'hashtag':    r'#[\\w]+',
    'mention':    r'@[\\w]+',
    'number':     r'-?\\d+(?:\\.\\d+)?',
}

# Apply any pattern to extract from a Series
def extract_first(series: pd.Series, pattern: str) -> pd.Series:
    return series.str.extract(f'({pattern})')[0]

df['date_found'] = extract_first(df['notes'], PATTERNS['date_iso'])
\`\`\`

---

## 8. Lookaheads and Lookbehinds

\`\`\`python
# Positive lookahead (?=...) — match X only if followed by Y
re.findall(r'\\d+(?= dollars)', "I have 500 dollars and 300 euros")
# ['500'] — only the number before " dollars"

# Negative lookahead (?!...)
re.findall(r'\\d+(?! dollars)', "500 dollars 300 euros")
# ['300'] — numbers NOT followed by " dollars"

# Positive lookbehind (?<=...) — match X only if preceded by Y
re.findall(r'(?<=\\$)\\d+\\.?\\d*', "Price: $49.99 and $100")
# ['49.99', '100']

# Negative lookbehind (?<!...)
re.findall(r'(?<!\\$)\\b\\d+\\.\\d+\\b', "Rate: $3.50, pH: 7.4")
# ['7.4'] — floats not preceded by $
\`\`\`

---

## Summary

- **re.search / findall / sub / split / compile** — the five functions you'll use 90% of the time.
- **Named groups** (\`(?P<name>...)\`) make extraction self-documenting and robust.
- **Pandas str accessor** — \`.str.extract()\`, \`.str.replace()\`, \`.str.contains()\`, \`.str.match()\` apply regex across entire columns.
- **re.compile** pre-compiles patterns — always use it when applying a pattern inside a loop.
- **Lookaheads/lookbehinds** let you match context without consuming it.
`,
    codeExample: `import re
import pandas as pd

LOG_RE = re.compile(
    r'(?P<ip>\\d+\\.\\d+\\.\\d+\\.\\d+).+?"(?P<method>\\w+) (?P<path>\\S+).+" '
    r'(?P<status>\\d{3}) (?P<bytes>\\d+|-)'
)

rows = []
with open('access.log') as f:
    for line in f:
        m = LOG_RE.search(line)
        if m:
            rows.append(m.groupdict())

df = pd.DataFrame(rows)
df['status'] = df['status'].astype(int)
df['bytes']  = pd.to_numeric(df['bytes'], errors='coerce').fillna(0).astype(int)

# Error rate
print(df['status'].value_counts(normalize=True).mul(100).round(1))

# Top endpoints by traffic
print(df.groupby('path')['bytes'].sum().sort_values(ascending=False).head(10))`,

    quiz: {
      title: 'Regular Expressions & Text Data Extraction — Quiz',
      questions: [
        {
          text: 'What does the regex pattern \\d{2,4} match?',
          options: opts(
            'Exactly 2 digits followed by exactly 4 digits',
            'Between 2 and 4 consecutive digits',
            'Any 2 or 4 digit number',
            'Digits separated by commas'
          ),
          correctAnswer: 'b',
          explanation: '{n,m} is a quantifier meaning "between n and m occurrences". \\d{2,4} matches 2, 3, or 4 consecutive digit characters.',
          orderIndex: 1,
        },
        {
          text: 'Why should you always use raw strings (r"...") for regex patterns in Python?',
          options: opts(
            'Raw strings execute faster',
            'Backslashes in normal strings are Python escape sequences; raw strings pass them literally to the regex engine',
            'The re module only accepts raw strings',
            'Raw strings are case-insensitive by default'
          ),
          correctAnswer: 'b',
          explanation: 'In a normal string "\\n" is a newline. In a raw string r"\\n" is backslash + n — what regex needs. Without raw strings, regex patterns with \\d, \\w, \\s etc. require double-escaping (\\\\d).',
          orderIndex: 2,
        },
        {
          text: 'What is the difference between re.match() and re.search()?',
          options: opts(
            'match() returns all occurrences; search() returns only the first',
            'match() only looks at the start of the string; search() scans the entire string',
            'match() is case-sensitive; search() is not',
            'They are identical — both scan the full string'
          ),
          correctAnswer: 'b',
          explanation: 're.match() only succeeds if the pattern matches at position 0. re.search() scans the entire string and returns the first match wherever it occurs.',
          orderIndex: 3,
        },
        {
          text: 'What does (?P<year>\\d{4}) do in a regex pattern?',
          options: opts(
            'Matches a 4-digit year and discards it (non-capturing)',
            'Creates a named capturing group called "year" that matches 4 digits',
            'Matches the literal text "year" followed by 4 digits',
            'Creates an optional group that may match 4 digits'
          ),
          correctAnswer: 'b',
          explanation: '(?P<name>...) creates a named capturing group. After matching, m.group("year") or m.groupdict()["year"] returns the matched value — more readable than positional indexing.',
          orderIndex: 4,
        },
        {
          text: 'In Pandas, df["col"].str.extract(r"(\\d+)") returns:',
          options: opts(
            'A boolean Series indicating which rows contain digits',
            'A DataFrame with one column containing the first captured group match per row',
            'A list of all digit sequences in the column',
            'The original Series with digits replaced'
          ),
          correctAnswer: 'b',
          explanation: 'str.extract() returns a DataFrame with one column per capturing group. Rows with no match get NaN. Use str.extractall() to get all matches per row.',
          orderIndex: 5,
        },
        {
          text: 'What does re.compile() do, and why is it useful?',
          options: opts(
            'Converts a regex pattern to a Python function',
            'Pre-compiles the pattern into a reusable object — avoiding repeated compilation overhead when applied in a loop',
            'Validates that the regex syntax is correct before running',
            'Compiles the regex to machine code for maximum speed'
          ),
          correctAnswer: 'b',
          explanation: 'Every re.search(pattern, ...) call compiles the pattern string internally. re.compile(pattern) does this once upfront — significant speedup when the same pattern is used thousands of times.',
          orderIndex: 6,
        },
        {
          text: 'Which regex matches the word "colour" OR "color"?',
          options: opts(
            'r"colo[ur]+"',
            'r"colou?r"',
            'r"colo(u|r)r"',
            'r"colo.*r"'
          ),
          correctAnswer: 'b',
          explanation: 'The ? quantifier means "zero or one" of the preceding element. colou?r matches "color" (no u) or "colour" (one u). colo[ur]+ would match "colorr" or "colouu" which is wrong.',
          orderIndex: 7,
        },
        {
          text: 'What does a positive lookahead (?=...) do?',
          options: opts(
            'Matches the content inside the lookahead and includes it in the result',
            'Asserts that what follows the current position matches the pattern, without consuming those characters',
            'Requires the matched text to be preceded by the lookahead pattern',
            'Makes the preceding group optional'
          ),
          correctAnswer: 'b',
          explanation: 'Lookaheads are zero-width assertions — they check what\'s ahead but don\'t move the match position or include the lookahead text in the match result. r"\\d+(?= dollars)" matches the number only.',
          orderIndex: 8,
        },
        {
          text: 'df["notes"].str.contains(r"^ERROR", regex=True, na=False) — what does na=False do?',
          options: opts(
            'Converts all NaN values to False instead of propagating NaN in the boolean result',
            'Skips rows with NaN values entirely',
            'Replaces NaN in the notes column with the string "False"',
            'Disables null-safety checks for performance'
          ),
          correctAnswer: 'a',
          explanation: 'By default str.contains() returns NaN where the input is NaN. na=False makes those rows evaluate to False — keeping them out of filtered results cleanly without needing a separate dropna().',
          orderIndex: 9,
        },
        {
          text: 'To extract all email addresses from a string, which re function should you use?',
          options: opts(
            're.match() — matches from the start',
            're.search() — finds the first match',
            're.findall() — returns all non-overlapping matches as a list',
            're.fullmatch() — matches the whole string'
          ),
          correctAnswer: 'c',
          explanation: 're.findall() scans the entire string and returns all non-overlapping matches as a list — exactly right for extracting all occurrences of a pattern (emails, phone numbers, dates) from a text.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 11 — Database Design & Analytics Data Modeling
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-11-database-design',
    title:      'Database Design & Analytics Data Modeling',
    description:'Understand the schemas behind the data you query every day — normalization, ER modeling, OLTP vs OLAP, star and snowflake schemas, slowly changing dimensions, and how data warehouses like BigQuery and Snowflake are structured.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 110,
    xpReward:   115,
    language:   'sql',
    content: `# Database Design & Analytics Data Modeling

## What You'll Learn
Great analysts understand the architecture of the data they query. This chapter covers relational database design from first principles — normalization, ER diagrams, OLTP vs OLAP tradeoffs — then dives into dimensional modeling: the star schema, snowflake schema, and slowly changing dimensions (SCDs) that underpin every professional data warehouse.

---

## 1. Why Schema Knowledge Matters

When you understand why tables are structured the way they are, you:
- Write more efficient queries (join the right tables)
- Spot data quality issues faster (duplicate keys, orphan records)
- Communicate credibly with data engineers
- Design your own analytical datasets
- Ace data analyst interviews (schema design is a common topic)

---

## 2. Entities, Attributes, and Relationships

Database design starts with an **Entity-Relationship (ER) model**:

- **Entity:** A real-world thing to track (Customer, Order, Product)
- **Attribute:** A property of an entity (customer.email, order.amount)
- **Relationship:** How entities connect (a Customer *places* many Orders)

**Cardinality:**
- **One-to-many (1:N):** One customer has many orders (most common)
- **Many-to-many (M:N):** Orders contain many products; products appear in many orders
- **One-to-one (1:1):** Each user has one profile

M:N relationships are resolved with a **junction table**:

\`\`\`sql
-- Junction table: order_items resolves the M:N between orders and products
CREATE TABLE order_items (
    order_id    INT REFERENCES orders(id),
    product_id  INT REFERENCES products(id),
    quantity    INT         NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);
\`\`\`

---

## 3. Normalisation — Eliminating Redundancy

Normalisation organises data to reduce duplication and update anomalies.

### First Normal Form (1NF)
- Every column holds **atomic** (indivisible) values
- No repeating groups

\`\`\`sql
-- ❌ Violates 1NF — tags column holds multiple values
CREATE TABLE articles (
    id    INT,
    title VARCHAR(200),
    tags  VARCHAR(500)   -- "python, pandas, data"  ← not atomic
);

-- ✅ 1NF — extract to a separate table
CREATE TABLE articles (id INT, title VARCHAR(200));
CREATE TABLE article_tags (article_id INT, tag VARCHAR(50));
\`\`\`

### Second Normal Form (2NF)
- Meets 1NF
- Every non-key attribute depends on the **entire** primary key (no partial dependencies)

\`\`\`sql
-- ❌ Violates 2NF — product_name depends only on product_id, not the full PK
CREATE TABLE order_items (
    order_id     INT,
    product_id   INT,
    product_name VARCHAR(100),   -- depends only on product_id ← partial dependency
    quantity     INT,
    PRIMARY KEY (order_id, product_id)
);

-- ✅ 2NF — product_name moves to the products table
CREATE TABLE order_items (
    order_id   INT,
    product_id INT,
    quantity   INT,
    PRIMARY KEY (order_id, product_id)
);
CREATE TABLE products (
    id   INT PRIMARY KEY,
    name VARCHAR(100)
);
\`\`\`

### Third Normal Form (3NF)
- Meets 2NF
- No **transitive dependencies** (non-key column depending on another non-key column)

\`\`\`sql
-- ❌ Violates 3NF — zip_code determines city, city is not the key
CREATE TABLE customers (
    id       INT PRIMARY KEY,
    name     VARCHAR(100),
    zip_code VARCHAR(10),
    city     VARCHAR(100)   -- depends on zip_code, not on id ← transitive
);

-- ✅ 3NF — extract zip → city mapping
CREATE TABLE customers (
    id       INT PRIMARY KEY,
    name     VARCHAR(100),
    zip_code VARCHAR(10) REFERENCES zip_codes(zip)
);
CREATE TABLE zip_codes (
    zip  VARCHAR(10) PRIMARY KEY,
    city VARCHAR(100)
);
\`\`\`

---

## 4. Denormalisation — When to Break the Rules

**Normalised schemas are great for writes. Analytical queries often need denormalised data.**

\`\`\`sql
-- A fully normalised query requires 5 joins:
SELECT c.name, p.name, cat.name, r.name, SUM(oi.quantity * oi.unit_price)
FROM   order_items oi
JOIN   orders   o   ON oi.order_id   = o.id
JOIN   customers c  ON o.customer_id = c.id
JOIN   products  p  ON oi.product_id = p.id
JOIN   categories cat ON p.category_id = cat.id
JOIN   regions   r  ON c.region_id   = r.id
GROUP BY c.name, p.name, cat.name, r.name;

-- In an analytics warehouse, you'd pre-join this into a wide table:
-- (called a "wide flat table" or "one big table")
\`\`\`

---

## 5. OLTP vs OLAP — The Fundamental Split

| | OLTP (Transactional) | OLAP (Analytical) |
|-|---------------------|-------------------|
| **Purpose** | Record business events | Answer business questions |
| **Query type** | INSERT / UPDATE / DELETE + simple SELECT | Complex SELECT with aggregations |
| **Schema** | Highly normalised (3NF) | Denormalised (star/snowflake) |
| **Data volume** | Thousands of rows/sec writes | Billions of rows reads |
| **Users** | Applications, microservices | Analysts, BI tools |
| **Examples** | PostgreSQL, MySQL | BigQuery, Snowflake, Redshift |
| **Latency** | Milliseconds (row lookups) | Seconds to minutes (full scans) |

Data flows from OLTP → ETL pipeline → OLAP warehouse → BI tools → dashboards.

---

## 6. Dimensional Modeling — The Star Schema

The **star schema** is the standard analytical data model, developed by Ralph Kimball.

\`\`\`
              dim_date          dim_customer
              ─────────         ────────────
              date_key          customer_key
              date              customer_name
              day_of_week  ◄──► region
              month             segment
              quarter           join_date
              year              ▲
                                │
dim_product ──────────── fact_orders ──────── dim_store
────────────              ────────────        ─────────
product_key ◄────────── product_key          store_key
product_name            customer_key ────► customer
category                date_key     ────► dim_date
brand                   store_key    ────► dim_store
                        quantity
                        unit_price
                        discount
                        net_revenue
\`\`\`

\`\`\`sql
-- Fact table — the measurements (numeric, additive)
CREATE TABLE fact_orders (
    order_id      BIGINT PRIMARY KEY,
    date_key      INT REFERENCES dim_date(date_key),
    customer_key  INT REFERENCES dim_customer(customer_key),
    product_key   INT REFERENCES dim_product(product_key),
    store_key     INT REFERENCES dim_store(store_key),
    quantity      INT,
    unit_price    DECIMAL(10,2),
    discount_pct  DECIMAL(5,4),
    net_revenue   DECIMAL(12,2)
);

-- Dimension table — the context (descriptive attributes)
CREATE TABLE dim_date (
    date_key     INT PRIMARY KEY,    -- surrogate key e.g. 20240315
    date         DATE,
    day_of_week  VARCHAR(10),
    is_weekend   BOOLEAN,
    month        INT,
    quarter      INT,
    year         INT,
    fiscal_year  INT
);
\`\`\`

**Why surrogate keys?** \`date_key = 20240315\` (integer) joins 10× faster than \`date = '2024-03-15'\` (string comparison) and decouples the warehouse from source system key changes.

---

## 7. Snowflake Schema

In a **snowflake schema**, dimension tables are further normalised:

\`\`\`sql
-- Star schema: dim_product has category_name directly
-- Snowflake schema: category lives in its own table

CREATE TABLE dim_product (
    product_key  INT PRIMARY KEY,
    product_name VARCHAR(200),
    category_key INT REFERENCES dim_category(category_key),   -- normalised
    brand_key    INT REFERENCES dim_brand(brand_key)
);

CREATE TABLE dim_category (
    category_key  INT PRIMARY KEY,
    category_name VARCHAR(100),
    department    VARCHAR(100)
);
\`\`\`

**Star vs Snowflake:**
- Star: fewer joins, faster queries, simpler BI tool setup. Preferred for most warehouses.
- Snowflake: saves storage, easier dimension updates. Choose when dimensions are very large or frequently updated.

---

## 8. Slowly Changing Dimensions (SCDs)

What happens when a customer moves cities, or a product changes its price category?

### SCD Type 1 — Overwrite (no history)
\`\`\`sql
UPDATE dim_customer SET city = 'Seattle' WHERE customer_key = 1001;
-- Old value lost. Use when history does not matter.
\`\`\`

### SCD Type 2 — Add a new row (full history)
\`\`\`sql
-- Expire the old row
UPDATE dim_customer
SET    is_current = FALSE, valid_to = CURRENT_DATE
WHERE  customer_key = 1001 AND is_current = TRUE;

-- Insert the new version
INSERT INTO dim_customer
    (customer_id, name, city, valid_from, valid_to, is_current)
VALUES
    (1001, 'Alice', 'Seattle', CURRENT_DATE, '9999-12-31', TRUE);
\`\`\`

SCD Type 2 is the industry standard when you need to track what attributes looked like at transaction time (e.g., "what tier was this customer when they placed this order?").

---

## 9. Data Warehouse Query Patterns

\`\`\`sql
-- Revenue by quarter and product category (star schema query)
SELECT
    d.year,
    d.quarter,
    p.category,
    SUM(f.net_revenue) AS total_revenue,
    COUNT(DISTINCT f.customer_key) AS unique_customers
FROM       fact_orders     f
JOIN       dim_date        d  ON f.date_key     = d.date_key
JOIN       dim_product     p  ON f.product_key  = p.product_key
WHERE      d.year = 2023
GROUP BY   d.year, d.quarter, p.category
ORDER BY   d.quarter, total_revenue DESC;
\`\`\`

---

## 10. Data Vault — Brief Mention

For very large, rapidly changing systems, **Data Vault 2.0** offers a third modeling approach:

| Component | Purpose |
|-----------|---------|
| **Hub** | Business keys (customer ID, order number) |
| **Link** | Relationships between hubs |
| **Satellite** | Descriptive attributes with full history |

Data Vault is excellent for auditability and incremental loading but is more complex to query — typically used in large enterprise warehouses where raw data ingestion speed matters most.

---

## Summary

| Concept | Key idea |
|---------|----------|
| 1NF | Atomic values, no repeating groups |
| 2NF | No partial dependencies on composite key |
| 3NF | No transitive dependencies |
| OLTP | Normalised, fast writes, operational systems |
| OLAP | Denormalised, fast reads, analytical systems |
| Star schema | Fact table + dimension tables — the warehouse standard |
| Snowflake | Normalised dimensions — fewer duplicates, more joins |
| SCD Type 1 | Overwrite — no history |
| SCD Type 2 | New row per change — full history |
| Surrogate key | Integer key for join performance and source decoupling |
`,
    codeExample: `-- Star schema query: monthly revenue by region and category
SELECT
    d.year,
    d.month,
    c.region,
    p.category,
    SUM(f.net_revenue)              AS revenue,
    COUNT(DISTINCT f.customer_key)  AS customers,
    SUM(f.quantity)                 AS units_sold,
    ROUND(AVG(f.unit_price), 2)     AS avg_price
FROM       fact_orders   f
JOIN       dim_date      d  ON f.date_key    = d.date_key
JOIN       dim_customer  c  ON f.customer_key = c.customer_key
JOIN       dim_product   p  ON f.product_key  = p.product_key
WHERE      d.year = 2023
  AND      c.is_current = TRUE        -- SCD Type 2: use current snapshot
GROUP BY   d.year, d.month, c.region, p.category
ORDER BY   d.month, revenue DESC;`,

    quiz: {
      title: 'Database Design & Analytics Data Modeling — Quiz',
      questions: [
        {
          text: 'A table has a composite primary key (order_id, product_id). Column product_name depends only on product_id, not on the full key. Which normal form is violated?',
          options: opts('1NF', '2NF', '3NF', 'BCNF'),
          correctAnswer: 'b',
          explanation: '2NF requires that every non-key column depends on the ENTIRE primary key. product_name depending only on product_id (a partial key) is a partial dependency — a 2NF violation.',
          orderIndex: 1,
        },
        {
          text: 'In a customers table, city depends on zip_code (not on customer_id). Which normal form is violated?',
          options: opts('1NF', '2NF', '3NF', 'No violation'),
          correctAnswer: 'c',
          explanation: '3NF prohibits transitive dependencies: non-key column A → non-key column B. Here zip_code determines city — city transitively depends on customer_id via zip_code. Move zip→city to a separate table.',
          orderIndex: 2,
        },
        {
          text: 'What is the fundamental difference between OLTP and OLAP systems?',
          options: opts(
            'OLTP uses SQL; OLAP uses NoSQL',
            'OLTP is optimised for fast transactional reads/writes (INSERT/UPDATE); OLAP is optimised for complex analytical queries over large volumes',
            'OLTP stores historical data; OLAP stores current data',
            'They are identical — OLAP is just a marketing term for OLTP'
          ),
          correctAnswer: 'b',
          explanation: 'OLTP systems (PostgreSQL, MySQL) serve applications with high-frequency small operations. OLAP systems (BigQuery, Snowflake) serve analysts with low-frequency, complex aggregations across billions of rows.',
          orderIndex: 3,
        },
        {
          text: 'In a star schema, what is stored in a FACT table vs a DIMENSION table?',
          options: opts(
            'Facts store descriptive text; dimensions store numbers',
            'Facts store measurable events (revenue, quantity, clicks) with foreign keys; dimensions store descriptive context (customer name, product category, date attributes)',
            'Facts are normalised; dimensions are denormalised',
            'Facts contain one row per customer; dimensions contain one row per transaction'
          ),
          correctAnswer: 'b',
          explanation: 'Fact tables are long and narrow — many rows, numeric measures, and foreign keys. Dimension tables are wide — fewer rows, many descriptive attributes that give context to the measures.',
          orderIndex: 4,
        },
        {
          text: 'Why are integer surrogate keys (e.g., date_key = 20240315) preferred over natural keys (date = "2024-03-15") in data warehouses?',
          options: opts(
            'Integers are easier to read for analysts',
            'Integer joins are faster and the warehouse is decoupled from source system key changes',
            'Natural keys cause 2NF violations',
            'Dates cannot be used as primary keys in SQL'
          ),
          correctAnswer: 'b',
          explanation: 'Integer comparisons are faster than string comparisons at scale. Surrogate keys also insulate the warehouse when source systems change their business keys — no cascade updates needed.',
          orderIndex: 5,
        },
        {
          text: 'What is the difference between a star schema and a snowflake schema?',
          options: opts(
            'Star schemas support more fact tables than snowflake',
            'In a snowflake schema, dimension tables are further normalised into multiple related tables; in a star schema they are flat',
            'Snowflake schemas have no fact table',
            'Star schemas are used in OLTP; snowflake schemas in OLAP'
          ),
          correctAnswer: 'b',
          explanation: 'A star schema keeps all dimension attributes in one flat table (fewer joins, faster queries). A snowflake normalises dimensions into sub-tables (less storage, more joins). Star is the most common in practice.',
          orderIndex: 6,
        },
        {
          text: 'SCD Type 2 handles a customer moving from New York to London by:',
          options: opts(
            'Updating the city column from "New York" to "London" in place',
            'Deleting the old row and inserting a new row with "London"',
            'Expiring the old row and inserting a new row — preserving both city values with validity dates',
            'Adding a "London" column alongside the "New York" column'
          ),
          correctAnswer: 'c',
          explanation: 'SCD Type 2 adds a new row for each change with valid_from/valid_to dates and an is_current flag. Historical transactions still point to the "New York" row — full history is preserved.',
          orderIndex: 7,
        },
        {
          text: 'A M:N relationship (e.g., Orders ↔ Products) is resolved in SQL using:',
          options: opts(
            'A foreign key on the Orders table pointing to Products',
            'A junction (bridge) table with foreign keys to both Orders and Products',
            'An array column in the Orders table storing product IDs',
            'Two foreign key columns added directly to the Products table'
          ),
          correctAnswer: 'b',
          explanation: 'SQL cannot represent M:N directly. A junction table (e.g., order_items) has its own primary key and foreign keys to both entities — one row per pairing, with additional attributes like quantity.',
          orderIndex: 8,
        },
        {
          text: 'Why do analytical queries on normalised (OLTP) schemas tend to be slow?',
          options: opts(
            'OLTP databases use a different SQL dialect',
            'Normalisation requires many JOINs to reassemble data — expensive on billions of rows; OLAP schemas pre-join data into fewer, wider tables',
            'Normalised schemas use text files instead of binary storage',
            'OLTP systems limit the number of concurrent analytical queries'
          ),
          correctAnswer: 'b',
          explanation: 'A fully normalised schema requires 5–10 JOINs for typical analytics queries. At scale, each JOIN is expensive. Dimensional modeling (star schema) reduces this to 2–3 JOINs on pre-aggregated, columnar-stored data.',
          orderIndex: 9,
        },
        {
          text: 'In a data warehouse, where does data come from before it lands in fact and dimension tables?',
          options: opts(
            'Directly from BI tools (Power BI, Tableau)',
            'From OLTP production systems via an ETL/ELT pipeline that extracts, transforms, and loads the data',
            'Analysts manually enter data into fact tables',
            'From the internet via web scraping'
          ),
          correctAnswer: 'b',
          explanation: 'The data pipeline is OLTP systems → ETL/ELT (Apache Airflow, dbt, Fivetran) → data warehouse (Snowflake, BigQuery, Redshift) → BI tools. Analysts query the warehouse, never the production OLTP system.',
          orderIndex: 10,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 2 (Chapters 7–11)…');

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

  console.log('\n🎉  AMATEUR Block 2 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
