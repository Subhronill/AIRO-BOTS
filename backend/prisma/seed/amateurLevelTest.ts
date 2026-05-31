/**
 * Seed: AMATEUR Level Test for Data Analytics course
 * 30 MCQs covering the entire AMATEUR tier syllabus (Chapters 101–150)
 * Scoring: +3 correct, -1 wrong → passing = 60 / 90
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const QUESTIONS: Array<{
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  orderIndex: number;
}> = [

  // ── Block 1: Advanced SQL & Data Preparation (Chapters 101–105) ──────────

  {
    orderIndex: 1,
    topic: 'Advanced SQL',
    text: 'Which SQL window function is used to calculate the DIFFERENCE between a row and the previous row in a time-ordered series (e.g., month-over-month revenue change)?',
    options: [
      'LAG() to retrieve the previous row value, then subtract from current',
      'RANK() OVER (ORDER BY revenue DESC)',
      'ROW_NUMBER() OVER (PARTITION BY month)',
      'NTILE(12) OVER (ORDER BY date)',
    ],
    correctAnswer: 'LAG() to retrieve the previous row value, then subtract from current',
    explanation:
      'LAG(revenue) OVER (ORDER BY month) returns the prior row\'s revenue in the same result set. Subtracting it from the current revenue gives the period-over-period delta — a fundamental window function pattern for time-series comparisons in SQL.',
  },
  {
    orderIndex: 2,
    topic: 'Advanced SQL',
    text: 'What is the key difference between RANK() and DENSE_RANK() when there are ties?',
    options: [
      'RANK() skips ranks after a tie (1,1,3) whereas DENSE_RANK() does not skip (1,1,2)',
      'DENSE_RANK() skips ranks after a tie while RANK() does not',
      'Both produce identical output — they differ only in performance',
      'RANK() restarts numbering within each PARTITION while DENSE_RANK() is global',
    ],
    correctAnswer: 'RANK() skips ranks after a tie (1,1,3) whereas DENSE_RANK() does not skip (1,1,2)',
    explanation:
      'With two rows tied at rank 1, RANK() outputs 1,1,3 (skipping 2) while DENSE_RANK() outputs 1,1,2 (no gap). Use DENSE_RANK() when you need "top N distinct ranks" and ties should not consume extra positions.',
  },
  {
    orderIndex: 3,
    topic: 'Data Cleaning',
    text: 'When should you use MEAN imputation versus MEDIAN imputation for filling missing numeric values?',
    options: [
      'Mean imputation is appropriate for symmetric, roughly normal distributions; median imputation is preferred for skewed distributions or when outliers are present',
      'Mean imputation is always preferred because it preserves the mathematical average',
      'Median imputation is always preferred because it is more resistant to all types of data',
      'The choice between mean and median does not matter — they produce identical results',
    ],
    correctAnswer: 'Mean imputation is appropriate for symmetric, roughly normal distributions; median imputation is preferred for skewed distributions or when outliers are present',
    explanation:
      'The mean is pulled by outliers — for a salary column with a few billionaires, mean imputation would over-inflate filled values. Median is the 50th percentile and is robust to skew. For symmetric data (like heights) the mean is fine and preserves the expected value.',
  },

  // ── Block 2: Inferential Stats, A/B Testing, Time Series (Chapters 106–110) ──

  {
    orderIndex: 4,
    topic: 'A/B Testing',
    text: 'In a two-sample A/B test, what is "statistical power" (1 - β)?',
    options: [
      'The probability of correctly detecting a true effect (rejecting H0 when H0 is false)',
      'The probability of incorrectly rejecting the null hypothesis when it is true (Type I error)',
      'The percentage of the user base included in the experiment',
      'The ratio of the test group size to the control group size',
    ],
    correctAnswer: 'The probability of correctly detecting a true effect (rejecting H0 when H0 is false)',
    explanation:
      'Power = 1 - β, where β is the Type II error rate (false negative). A power of 0.80 means there is an 80% chance the test will detect a true minimum detectable effect. Insufficient power causes false negatives — you miss real improvements.',
  },
  {
    orderIndex: 5,
    topic: 'Time Series',
    text: 'What does an Augmented Dickey-Fuller (ADF) test check for, and why does it matter for time-series models like ARIMA?',
    options: [
      'It tests whether a time series is stationary (no unit root); ARIMA requires stationarity for valid parameter estimation',
      'It tests whether two time series are cointegrated and move together in the long run',
      'It determines the optimal number of autoregressive lags for a time series model',
      'It checks whether a time series has a seasonal component that requires decomposition',
    ],
    correctAnswer: 'It tests whether a time series is stationary (no unit root); ARIMA requires stationarity for valid parameter estimation',
    explanation:
      'A stationary series has constant mean and variance over time. If ADF p-value > 0.05, the series has a unit root (non-stationary). You then apply differencing (the "I" in ARIMA) until stationarity is achieved before fitting the model.',
  },
  {
    orderIndex: 6,
    topic: 'Data Cleaning',
    text: 'Which regex pattern correctly extracts a 4-digit year from strings like "Report Q1-2024.pdf" or "Annual-2023-Review"?',
    options: [
      '\\b(19|20)\\d{2}\\b — anchored to word boundaries, matching 19xx or 20xx century years only',
      '\\d{4} — any 4-digit sequence without anchoring or range restriction',
      '[0-9]+ — all numeric sequences of any length',
      '20\\d\\d — only 21st century years beginning with 20',
    ],
    correctAnswer: '\\b(19|20)\\d{2}\\b — anchored to word boundaries, matching 19xx or 20xx century years only',
    explanation:
      'The \\b word boundary prevents matching substrings like "20241" as a year. The (19|20) prefix restricts to realistic year ranges. A bare \\d{4} would also match phone number segments like the "1234" in "555-1234-99", producing false positives.',
  },

  // ── Block 3: Pandas, Visualization, Statistical Testing (Chapters 111–115) ──

  {
    orderIndex: 7,
    topic: 'Pandas',
    text: 'What is the difference between pandas pivot_table() and groupby().agg() for summarizing data?',
    options: [
      'pivot_table() directly produces a 2D cross-tabulation matrix with rows and columns; groupby().agg() produces a flat indexed result that requires reshaping for cross-tab format',
      'groupby().agg() is always faster than pivot_table() for datasets over 1 million rows',
      'pivot_table() can only aggregate one column at a time; groupby().agg() handles multiple columns',
      'They produce identical output — the choice is purely stylistic preference',
    ],
    correctAnswer: 'pivot_table() directly produces a 2D cross-tabulation matrix with rows and columns; groupby().agg() produces a flat indexed result that requires reshaping for cross-tab format',
    explanation:
      'pivot_table(values="revenue", index="region", columns="product") immediately gives a spreadsheet-style cross-tab. groupby(["region","product"])["revenue"].sum() gives a MultiIndex Series that you would then .unstack() to get the same shape. pivot_table is syntactic sugar for a common reshaping pattern.',
  },
  {
    orderIndex: 8,
    topic: 'Visualization',
    text: 'You have a dataset with 1 million records and want to show the DISTRIBUTION of a continuous variable (e.g., session duration). Which chart is most appropriate?',
    options: [
      'A histogram or KDE (kernel density estimate) plot — designed specifically for showing the distribution shape of continuous data',
      'A scatter plot with session duration on both axes',
      'A pie chart with each unique value as a slice',
      'A bar chart with one bar per unique session duration value',
    ],
    correctAnswer: 'A histogram or KDE (kernel density estimate) plot — designed specifically for showing the distribution shape of continuous data',
    explanation:
      'Histograms bin continuous data into intervals to reveal shape (normal, skewed, bimodal). KDE overlays a smooth density estimate. For 1M rows a bar chart with one bar per value would be meaningless. Pie charts are for categorical part-of-whole comparisons, not continuous distributions.',
  },
  {
    orderIndex: 9,
    topic: 'Statistical Testing',
    text: 'A chi-squared test of independence is used to test whether two categorical variables are associated. What are the two core assumptions?',
    options: [
      'Each cell in the contingency table has an expected frequency >= 5, and observations are independent',
      'The data must be normally distributed and have equal variance across categories',
      'The sample size must be exactly equal in each group and the variables must be ordinal',
      'The variables must each have exactly two categories (binary) and n > 30',
    ],
    correctAnswer: 'Each cell in the contingency table has an expected frequency >= 5, and observations are independent',
    explanation:
      'Chi-squared requires (1) expected counts >= 5 in each cell — otherwise use Fisher\'s exact test — and (2) independent observations (no repeated measures). It does not require normality, making it suitable for categorical data like device type vs. purchase status.',
  },

  // ── Block 4: Machine Learning Fundamentals (Chapters 116–120) ───────────

  {
    orderIndex: 10,
    topic: 'Feature Engineering',
    text: 'When encoding a high-cardinality categorical variable (e.g., US zip codes, 40,000 unique values) for a regression model, which technique is most appropriate?',
    options: [
      'Target encoding — replace each category with the mean of the target variable for that category, with regularisation to prevent overfitting on rare categories',
      'One-hot encoding — create a binary column for each of the 40,000 unique zip codes',
      'Label encoding — assign each zip code an integer from 0 to 39,999',
      'Drop the variable — high-cardinality categoricals always add noise and should be excluded',
    ],
    correctAnswer: 'Target encoding — replace each category with the mean of the target variable for that category, with regularisation to prevent overfitting on rare categories',
    explanation:
      'One-hot encoding for 40K categories creates 40K columns — computationally infeasible and causes extreme sparsity. Label encoding implies a false ordinal relationship. Target encoding replaces each zip code with its mean target value (e.g., mean revenue per zip code) and is compact (one column) while capturing predictive signal.',
  },
  {
    orderIndex: 11,
    topic: 'Regression',
    text: 'In multiple regression, what does a high Variance Inflation Factor (VIF > 10) indicate, and what should you do about it?',
    options: [
      'It indicates multicollinearity — the feature is highly correlated with other features, inflating coefficient standard errors and making them unreliable. Solutions: drop one correlated feature, use PCA, or apply Ridge regression',
      'It indicates the feature has high predictive power and should be weighted more heavily in the model',
      'It indicates the feature\'s variance is greater than the other features, requiring standardisation',
      'It indicates overfitting — the model has too many parameters relative to the training data size',
    ],
    correctAnswer: 'It indicates multicollinearity — the feature is highly correlated with other features, inflating coefficient standard errors and making them unreliable. Solutions: drop one correlated feature, use PCA, or apply Ridge regression',
    explanation:
      'VIF = 1/(1-R²_j) where R²_j is how well feature j is predicted by all other features. VIF > 10 means other features explain >90% of its variance. This makes individual coefficients unstable (large standard errors) though overall model predictions may still be good. Ridge regression penalises coefficients and handles multicollinearity better than OLS.',
  },
  {
    orderIndex: 12,
    topic: 'Model Evaluation',
    text: 'When should you prefer Precision-Recall AUC over ROC-AUC as your primary model evaluation metric?',
    options: [
      'When the dataset is highly imbalanced (e.g., fraud detection: 0.1% positive class), because ROC-AUC can be misleadingly high when the model correctly classifies most negatives trivially',
      'When the dataset is perfectly balanced with equal positives and negatives',
      'When the model is a regression model, not a classification model',
      'When you have more than two classes (multiclass) and need a single scalar metric',
    ],
    correctAnswer: 'When the dataset is highly imbalanced (e.g., fraud detection: 0.1% positive class), because ROC-AUC can be misleadingly high when the model correctly classifies most negatives trivially',
    explanation:
      'With 99.9% negatives, a model predicting "not fraud" for everything gets ~1.0 ROC-AUC because the True Positive Rate vs False Positive Rate curve looks great with huge denominator negatives. PR-AUC focuses on precision and recall for the positive class — exposing a useless model that catches zero actual fraud.',
  },

  // ── Block 5: Business Analytics — BI, Cohort, Funnel, RFM (Chapters 121–125) ──

  {
    orderIndex: 13,
    topic: 'Cohort Analysis',
    text: 'In a retention cohort analysis, a Day-7 retention rate of 22% means:',
    options: [
      '22% of users who first engaged on a given day were still active exactly 7 days later',
      '22% of all users in the database used the product at least 7 times',
      'The product retained 22% of its total user base over a 7-day period',
      '22% of users churned within 7 days of their first session',
    ],
    correctAnswer: '22% of users who first engaged on a given day were still active exactly 7 days later',
    explanation:
      'D7 retention = (users from cohort active on day 7) / (total users in cohort). It tracks the SAME cohort (users who first appeared on day 0) to their day 7 activity — not all users currently active. This distinguishes cohort analysis from aggregate active user metrics.',
  },
  {
    orderIndex: 14,
    topic: 'Funnel Analysis',
    text: 'A checkout funnel shows: Visit=10,000, Add to Cart=3,200, Checkout=900, Purchase=540. Which step has the WORST conversion rate and what is it?',
    options: [
      'Add to Cart to Checkout: 900/3200 = 28.1% — the lowest step-wise conversion rate in this funnel',
      'Visit to Add to Cart: 3200/10000 = 32.0%',
      'Checkout to Purchase: 540/900 = 60.0%',
      'Visit to Purchase (overall): 540/10000 = 5.4%',
    ],
    correctAnswer: 'Add to Cart to Checkout: 900/3200 = 28.1% — the lowest step-wise conversion rate in this funnel',
    explanation:
      'Step rates: Visit→Cart = 32.0%, Cart→Checkout = 28.1%, Checkout→Purchase = 60.0%. The Cart-to-Checkout step has the lowest rate at 28.1%, suggesting friction in the checkout initiation flow — perhaps too many form fields, guest checkout not offered, or shipping cost sticker shock.',
  },
  {
    orderIndex: 15,
    topic: 'RFM Segmentation',
    text: 'In RFM analysis, a customer with Recency=1, Frequency=5, Monetary=5 (on a 1-5 scale where 5 is best) should be classified as:',
    options: [
      'At-risk high-value customer — recently inactive but historically a top buyer; prioritize win-back campaign',
      'Champion — recently active, frequent, and high spending; prioritize loyalty rewards',
      'New customer — recently acquired with little purchase history',
      'Lost customer — no recent activity and low historical value; deprioritize',
    ],
    correctAnswer: 'At-risk high-value customer — recently inactive but historically a top buyer; prioritize win-back campaign',
    explanation:
      'Recency=1 means this customer has not purchased recently (longest since last purchase). But Frequency=5 and Monetary=5 show they were previously a top buyer. This profile ("Champions who have gone quiet") indicates churn risk — they represent significant potential value if re-engaged with targeted win-back outreach.',
  },

  // ── Block 6: Data Engineering — BigQuery, dbt, Airflow, Spark (Chapters 126–130) ──

  {
    orderIndex: 16,
    topic: 'dbt',
    text: 'In dbt, what is the purpose of the ref() macro (e.g., FROM {{ ref("stg_orders") }})?',
    options: [
      'It creates a dependency link between models so dbt builds them in the correct order, and resolves to the actual database table name regardless of environment',
      'It imports an external Python function for use inside a SQL transformation',
      'It references a raw source table from the data warehouse without tracking lineage',
      'It creates a test assertion that validates the model output meets a data quality threshold',
    ],
    correctAnswer: 'It creates a dependency link between models so dbt builds them in the correct order, and resolves to the actual database table name regardless of environment',
    explanation:
      'ref() is dbt\'s dependency graph mechanism. It replaces the model name with the actual qualified table name for the current target (dev vs. prod schemas) and tells dbt\'s DAG that this model depends on "stg_orders". Without ref(), models would have hard-coded table names and no lineage tracking.',
  },
  {
    orderIndex: 17,
    topic: 'Airflow',
    text: 'What does it mean for an Airflow task to be "idempotent," and why is this critical for data pipelines?',
    options: [
      'Running the same task multiple times with the same inputs produces the same result without side effects — critical because pipelines are retried on failure and backfills re-run historical dates',
      'The task runs independently without depending on any upstream task in the DAG',
      'The task always completes within the SLA window regardless of data volume',
      'The task uses immutable data sources and never modifies the source tables',
    ],
    correctAnswer: 'Running the same task multiple times with the same inputs produces the same result without side effects — critical because pipelines are retried on failure and backfills re-run historical dates',
    explanation:
      'If a task fails halfway through and Airflow retries it, a non-idempotent task might duplicate rows or apply partial updates. An idempotent task uses patterns like INSERT OVERWRITE or MERGE (upsert) so re-running produces the same final state — essential for reliable backfills and failure recovery.',
  },
  {
    orderIndex: 18,
    topic: 'Apache Spark',
    text: 'What is "lazy evaluation" in Apache Spark, and what is its primary performance benefit?',
    options: [
      'Transformations are not executed immediately — Spark builds a logical plan and only executes when an action (collect, write, count) is called, allowing the optimizer to combine and prune operations for efficiency',
      'Spark delays loading data from disk until the last possible moment to reduce memory usage',
      'Lazy evaluation means Spark only processes the first N rows of each partition until the full dataset is needed',
      'Spark caches all intermediate DataFrames automatically to avoid recomputation on repeated queries',
    ],
    correctAnswer: 'Transformations are not executed immediately — Spark builds a logical plan and only executes when an action (collect, write, count) is called, allowing the optimizer to combine and prune operations for efficiency',
    explanation:
      'When you chain .filter().select().join() in Spark, nothing runs. Spark records the logical plan. When you call .count() or .write(), Catalyst optimizer analyzes the full plan — pushing down predicates, eliminating unneeded columns, choosing join strategies — then generates an optimized physical execution plan. This optimization would be impossible if each step executed immediately.',
  },

  // ── Block 7: Advanced Visualization & Data Storytelling (Chapters 131–135) ──

  {
    orderIndex: 19,
    topic: 'Plotly Dash',
    text: 'In a Plotly Dash application, what is the role of the @app.callback decorator?',
    options: [
      'It defines reactive connections between Input components (e.g., dropdown) and Output components (e.g., chart), automatically re-running the function when input values change',
      'It caches the function result so the chart is not recomputed on every user interaction',
      'It registers a Python function as an API endpoint that the frontend calls directly',
      'It defines the layout structure and positioning of components in the dashboard',
    ],
    correctAnswer: 'It defines reactive connections between Input components (e.g., dropdown) and Output components (e.g., chart), automatically re-running the function when input values change',
    explanation:
      '@app.callback(Output("chart","figure"), Input("dropdown","value")) tells Dash: whenever the dropdown value changes, run this function and update the chart figure. This is the core reactivity model — similar to a spreadsheet cell formula that automatically recalculates when its referenced cells change.',
  },
  {
    orderIndex: 20,
    topic: 'Geospatial Analytics',
    text: 'What is the key difference between a choropleth map and a scatter geo (bubble) map, and when should each be used?',
    options: [
      'Choropleth fills geographic regions with color proportional to a metric (e.g., revenue by state); scatter geo places markers at specific coordinates sized by a metric. Use choropleth for regional aggregates, scatter geo for point-level data like store locations',
      'Choropleth is used for global data while scatter geo is for local or city-level data',
      'They display the same information — the choice is purely aesthetic preference',
      'Choropleth requires census data while scatter geo requires GPS coordinates',
    ],
    correctAnswer: 'Choropleth fills geographic regions with color proportional to a metric (e.g., revenue by state); scatter geo places markers at specific coordinates sized by a metric. Use choropleth for regional aggregates, scatter geo for point-level data like store locations',
    explanation:
      'A choropleth showing "revenue by US state" colors each state — good for regional comparisons. A scatter geo showing "top 1,000 stores by sales" plots bubbles at each store\'s lat/lon — good when precise location matters. Choropleth requires a shape file or region identifier (state/country code); scatter geo requires lat/lon coordinates.',
  },
  {
    orderIndex: 21,
    topic: 'Data Storytelling',
    text: 'What is the Minto Pyramid Principle and how should it change how you structure analytical presentations?',
    options: [
      'Lead with the key recommendation/conclusion, then provide supporting arguments, then detail the evidence — the opposite of academic writing which builds to the conclusion',
      'Use three hierarchical levels: executive summary (top), detailed analysis (middle), raw data appendix (bottom)',
      'Start with the most visually compelling chart and work backwards to explain the methodology',
      'A pyramid chart type in Tableau showing hierarchical breakdowns of metrics',
    ],
    correctAnswer: 'Lead with the key recommendation/conclusion, then provide supporting arguments, then detail the evidence — the opposite of academic writing which builds to the conclusion',
    explanation:
      'Business audiences are busy — they need the answer first, then justification. Minto Pyramid: "Revenue declined 18% because checkout CVR collapsed on desktop after Oct 15 deploy — fix it tonight" (answer first), then the supporting evidence pyramid. Academic papers bury the conclusion; business memos lead with it.',
  },

  // ── Block 8: Marketing Analytics, Financial, CLV, Advanced A/B Testing (Chapters 136–140) ──

  {
    orderIndex: 22,
    topic: 'Marketing Attribution',
    text: 'A customer journey is: Google Ads → Email → Instagram → Purchase. Under a "position-based" (U-shaped) attribution model, how is credit distributed?',
    options: [
      '40% to first touch (Google Ads), 40% to last touch (Instagram), 20% split equally among middle touchpoints (Email)',
      '100% credit to Instagram (last touch before purchase)',
      'Equal 33.3% credit to each of the three touchpoints',
      'Credit distributed proportionally to the time spent on each channel before purchase',
    ],
    correctAnswer: '40% to first touch (Google Ads), 40% to last touch (Instagram), 20% split equally among middle touchpoints (Email)',
    explanation:
      'Position-based (U-shaped) gives 40% to the first touchpoint (acquisition) and 40% to the last (conversion), with 20% split among the middle steps. It recognizes both the awareness-generating first touch and the conversion-driving last touch as the most valuable interactions in the customer journey.',
  },
  {
    orderIndex: 23,
    topic: 'Financial Analytics',
    text: 'What is Monthly Recurring Revenue (MRR) movement analysis and what are its four components?',
    options: [
      'New MRR (new customers), Expansion MRR (upsells), Contraction MRR (downgrades), Churned MRR (cancellations) — together they explain the delta between last month\'s and this month\'s MRR',
      'Gross MRR, Net MRR, Adjusted MRR, and Recognized MRR — four GAAP accounting categories for subscription revenue',
      'Monthly, Quarterly, Annual, and Lifetime MRR aggregations for different reporting periods',
      'Revenue from new products, existing products, partnership deals, and one-time transactions',
    ],
    correctAnswer: 'New MRR (new customers), Expansion MRR (upsells), Contraction MRR (downgrades), Churned MRR (cancellations) — together they explain the delta between last month\'s and this month\'s MRR',
    explanation:
      'MRR movement: Current MRR = Prior MRR + New + Expansion - Contraction - Churned. This waterfall decomposition tells you WHERE revenue change is coming from. If MRR is flat but New MRR is high, it means Churned MRR is equally high — hiding a serious retention problem behind apparent growth.',
  },
  {
    orderIndex: 24,
    topic: 'Advanced A/B Testing',
    text: 'What is CUPED (Controlled-experiment Using Pre-Experiment Data) and what problem does it solve in A/B testing?',
    options: [
      'CUPED reduces variance in the outcome metric by using pre-experiment covariate data, making it easier to detect smaller effects with the same sample size',
      'CUPED is a method for running concurrent A/B tests without interaction effects between experiments',
      'CUPED corrects for p-value inflation when running hundreds of A/B tests simultaneously (multiple comparisons)',
      'CUPED is a sequential testing approach that allows stopping the test early when significance is reached',
    ],
    correctAnswer: 'CUPED reduces variance in the outcome metric by using pre-experiment covariate data, making it easier to detect smaller effects with the same sample size',
    explanation:
      'CUPED computes: adjusted_metric = metric - theta * pre_metric, where theta = Cov(metric, pre_metric) / Var(pre_metric). If pre-experiment behavior (e.g., last week\'s revenue) correlates with this week\'s metric, subtracting the correlated portion removes "noise" from user baseline differences — reducing variance and increasing statistical power without needing more users.',
  },

  // ── Block 9: PCA, Clustering, NLP, Bayesian, Anomaly Detection (Chapters 141–145) ──

  {
    orderIndex: 25,
    topic: 'PCA',
    text: 'After running PCA on a dataset, how do you determine the number of principal components to retain?',
    options: [
      'Using a scree plot and cumulative explained variance — typically retain components that explain 80-90% of total variance, or look for the "elbow" where additional components add diminishing variance',
      'Always retain exactly the square root of the original number of features',
      'Use cross-validation — the number of components that minimizes test set RMSE',
      'Retain all components with eigenvalues greater than the mean eigenvalue (Kaiser criterion)',
    ],
    correctAnswer: 'Using a scree plot and cumulative explained variance — typically retain components that explain 80-90% of total variance, or look for the "elbow" where additional components add diminishing variance',
    explanation:
      'The scree plot shows explained variance vs. component number. The "elbow" is where the curve flattens — additional components add little variance. The cumulative variance rule (retain until 80-90% is explained) is the most common practical approach. Kaiser criterion (eigenvalue > 1) is another option for standardized data.',
  },
  {
    orderIndex: 26,
    topic: 'Clustering',
    text: 'A silhouette score of +0.8 for a K-Means clustering solution indicates:',
    options: [
      'Tight, well-separated clusters — points are much closer to their own cluster center than to the nearest other cluster',
      'Overlapping clusters where points are equally close to their own and neighboring clusters',
      'The model is overfitting — too many clusters relative to the data density',
      'An invalid clustering solution — silhouette scores near 1 indicate only one cluster was found',
    ],
    correctAnswer: 'Tight, well-separated clusters — points are much closer to their own cluster center than to the nearest other cluster',
    explanation:
      'Silhouette score = (b - a) / max(a, b), where a = mean intra-cluster distance and b = mean distance to nearest other cluster. Score near +1 means tight, well-separated clusters. Score near 0 means clusters overlap. Score near -1 means points may be mis-clustered. Scores above 0.5 are generally considered good.',
  },
  {
    orderIndex: 27,
    topic: 'NLP',
    text: 'What is the key advantage of TF-IDF over simple word frequency (Count Vectorizer) for text classification?',
    options: [
      'TF-IDF down-weights words that appear in many documents (high IDF is low) so common words like "the" and "and" do not dominate, while up-weighting words that are distinctive to specific documents',
      'TF-IDF handles multi-language text automatically while Count Vectorizer requires separate tokenization per language',
      'TF-IDF is computationally faster than Count Vectorizer for large corpora',
      'TF-IDF captures word order and context while Count Vectorizer treats text as a bag of words',
    ],
    correctAnswer: 'TF-IDF down-weights words that appear in many documents (high IDF is low) so common words like "the" and "and" do not dominate, while up-weighting words that are distinctive to specific documents',
    explanation:
      'TF (term frequency) × IDF (inverse document frequency). IDF = log(N / df_t) where N is total documents and df_t is documents containing the term. Words appearing in every document (like "the") get IDF ≈ 0, so they contribute almost nothing. Rare, distinctive words (like "anaphylaxis" in medical texts) get high IDF, making them powerful discriminators.',
  },
  {
    orderIndex: 28,
    topic: 'Bayesian Statistics',
    text: 'In a Bayesian A/B test with Beta-Binomial conjugate model, what is the "posterior distribution" and what can you compute from it?',
    options: [
      'The probability distribution over the conversion rate parameter AFTER updating the prior with observed data — from it you compute P(variant B > variant A), credible intervals, and expected lift',
      'The distribution of test statistics under the null hypothesis used to compute p-values',
      'The sampling distribution of the test statistic across repeated experiments',
      'The distribution of raw conversion events (0/1) from the experiment',
    ],
    correctAnswer: 'The probability distribution over the conversion rate parameter AFTER updating the prior with observed data — from it you compute P(variant B > variant A), credible intervals, and expected lift',
    explanation:
      'Prior (Beta(alpha, beta)) + Data (successes, failures) = Posterior (Beta(alpha + successes, beta + failures)). The posterior is your updated belief about the true conversion rate. P(B > A) is computed by sampling from both posteriors and checking how often B\'s sample exceeds A\'s — this is the direct probability of B being better, which frequentist p-values cannot provide.',
  },

  // ── Block 10: Capstone, Career, AI Tools (Chapters 146–150) ─────────────

  {
    orderIndex: 29,
    topic: 'Analytics Leadership',
    text: 'The RICE scoring framework prioritizes analytics projects by computing (Reach × Impact × Confidence) / Effort. A project scores 2,400 and another scores 800. What does this mean for prioritization?',
    options: [
      'The project with score 2,400 should be prioritized first — it delivers 3× more expected value per unit of effort, making it a stronger allocation of the analytics team\'s time',
      'Both projects should be started simultaneously since both scores are above the minimum threshold of 500',
      'The project with score 800 should be prioritized first since lower scores indicate simpler, faster-to-complete work',
      'RICE scores cannot be compared directly — they are only useful for ranking projects within the same stakeholder domain',
    ],
    correctAnswer: 'The project with score 2,400 should be prioritized first — it delivers 3× more expected value per unit of effort, making it a stronger allocation of the analytics team\'s time',
    explanation:
      'RICE is an expected-value-per-effort metric. A score of 2,400 vs 800 means the first project delivers 3× the expected value for the same effort. This prevents the loudest stakeholder from winning — instead, the highest business-impact work wins. Projects should be stack-ranked by RICE score.',
  },
  {
    orderIndex: 30,
    topic: 'AI for Analytics',
    text: 'When using a public Large Language Model API (like Claude or GPT-4) to analyze business data, what is the most critical constraint an analyst must follow?',
    options: [
      'Never send real customer PII, financial records, or trade secrets to public APIs — use enterprise/private deployments for sensitive data, and always validate AI-generated code and insights before using them in production',
      'Always use the largest available model for maximum accuracy, regardless of cost',
      'Only use AI APIs for code generation, never for generating written insights or narrative',
      'Obtain explicit approval from the CTO before using any AI tool for business analysis',
    ],
    correctAnswer: 'Never send real customer PII, financial records, or trade secrets to public APIs — use enterprise/private deployments for sensitive data, and always validate AI-generated code and insights before using them in production',
    explanation:
      'Public API calls are processed on external servers. Sending customer email addresses, financial figures, or proprietary business data to public LLM APIs can violate GDPR, CCPA, SOC 2 controls, and company policy. Enterprise plans (Azure OpenAI, Anthropic Enterprise) offer data privacy guarantees. Additionally, LLMs produce confidently wrong SQL and code — always validate on known test cases before production use.',
  },
];

// ─── Main seeder ──────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Seeding AMATEUR Level Test for Data Analytics…');

  const course = await prisma.course.findUnique({ where: { slug: 'data-analytics' } });
  if (!course) {
    console.error('❌  Course "data-analytics" not found. Run the main seed first.');
    process.exit(1);
  }

  const existing = await prisma.levelTest.findUnique({
    where: { courseId_tier: { courseId: course.id, tier: 'AMATEUR' } },
  });

  if (existing) {
    console.log('ℹ️   AMATEUR Level Test already exists — skipping.');
    await prisma.$disconnect();
    return;
  }

  const levelTest = await prisma.levelTest.create({
    data: {
      courseId:     course.id,
      tier:         'AMATEUR',
      title:        'AMATEUR Level Test — Data Analytics',
      description:
        'The final gate to leave the AMATEUR tier. 30 questions spanning Advanced SQL, A/B Testing, Time Series, Machine Learning, Business Analytics (Cohort, Funnel, RFM), Data Engineering (dbt, Airflow, Spark), Advanced Visualization, Marketing & Financial Analytics, Unsupervised ML, NLP, Bayesian Statistics, and Career Readiness. Score 60+ out of 90 to advance to the PRO tier.',
      timeLimit:    3600,
      passingScore: 60,
      xpReward:     750,
    },
  });

  for (const q of QUESTIONS) {
    await prisma.levelTestQuestion.create({
      data: {
        levelTestId:   levelTest.id,
        text:          q.text,
        options:       JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation:   q.explanation,
        topic:         q.topic,
        orderIndex:    q.orderIndex,
      },
    });
  }

  console.log(`✅  Created AMATEUR Level Test with ${QUESTIONS.length} questions.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
