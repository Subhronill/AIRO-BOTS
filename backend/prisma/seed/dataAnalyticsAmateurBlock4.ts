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
  // CHAPTER 16 — Feature Engineering for Machine Learning
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-16-feature-engineering',
    title:      'Feature Engineering for Machine Learning',
    description:'Transform raw data into predictive signals — encoding categoricals, scaling numerics, engineering date/text/interaction features, and handling imbalanced targets. The skill that separates good models from great ones.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 116,
    xpReward:   125,
    language:   'python',
    content: `# Feature Engineering for Machine Learning

## What You'll Learn
Models are only as good as the features you feed them. Feature engineering — transforming raw data into meaningful numeric signals — contributes more to model performance than hyperparameter tuning. This chapter gives you a systematic toolkit for turning messy real-world data into model-ready features.

---

## 1. The Feature Engineering Pipeline

\`\`\`
Raw Data → (1) Handle Missing Values → (2) Encode Categoricals →
           (3) Scale Numerics → (4) Engineer New Features →
           (5) Select Features → Model
\`\`\`

All transformations learned from the **training set only** — never fit on the full dataset or test set (data leakage).

---

## 2. Encoding Categorical Variables

### Label Encoding — Only for Ordinal Categories
\`\`\`python
from sklearn.preprocessing import LabelEncoder, OrdinalEncoder
import pandas as pd

df = pd.DataFrame({'tier': ['Bronze','Silver','Gold','Platinum','Bronze']})

# Ordinal: explicit order matters
enc = OrdinalEncoder(categories=[['Bronze','Silver','Gold','Platinum']])
df['tier_enc'] = enc.fit_transform(df[['tier']])
# Bronze=0, Silver=1, Gold=2, Platinum=3
\`\`\`

### One-Hot Encoding — For Nominal Categories
\`\`\`python
df = pd.DataFrame({'country': ['US','GB','DE','US','FR']})

# Pandas get_dummies — drop_first avoids multicollinearity
ohe = pd.get_dummies(df['country'], prefix='country', drop_first=True)

# Sklearn — handles unseen categories at inference time
from sklearn.preprocessing import OneHotEncoder
enc_ohe = OneHotEncoder(sparse_output=False, handle_unknown='ignore', drop='first')
ohe_arr = enc_ohe.fit_transform(df[['country']])
\`\`\`

### Target Encoding — High-Cardinality Categoricals
\`\`\`python
# Replace category with mean of the target — use cross-validation to avoid leakage
import numpy as np
from sklearn.model_selection import KFold

def target_encode_cv(df: pd.DataFrame, col: str, target: str, n_folds: int = 5) -> pd.Series:
    encoded = pd.Series(index=df.index, dtype=float)
    global_mean = df[target].mean()
    kf = KFold(n_splits=n_folds, shuffle=True, random_state=42)
    for train_idx, val_idx in kf.split(df):
        means = df.iloc[train_idx].groupby(col)[target].mean()
        encoded.iloc[val_idx] = df.iloc[val_idx][col].map(means).fillna(global_mean)
    return encoded
\`\`\`

---

## 3. Scaling Numeric Features

Distance-based models (KNN, SVM, neural nets, logistic regression) are sensitive to scale. Tree-based models (Random Forest, XGBoost) are not.

\`\`\`python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

# StandardScaler: z-score — mean=0, std=1 (assumes roughly normal)
scaler_std = StandardScaler()
X_std = scaler_std.fit_transform(X_train)

# MinMaxScaler: [0, 1] range — good for neural nets, bounded data
scaler_mm = MinMaxScaler()
X_mm = scaler_mm.fit_transform(X_train)

# RobustScaler: uses median + IQR — best when outliers are present
scaler_rob = RobustScaler()
X_rob = scaler_rob.fit_transform(X_train)
\`\`\`

---

## 4. Engineering Date & Time Features

\`\`\`python
import pandas as pd

df['date'] = pd.to_datetime(df['date'])

# Temporal components
df['year']        = df['date'].dt.year
df['month']       = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek      # 0=Monday
df['quarter']     = df['date'].dt.quarter
df['is_weekend']  = (df['date'].dt.dayofweek >= 5).astype(int)
df['is_month_end']= df['date'].dt.is_month_end.astype(int)

# Time-since features (numeric, no cyclic discontinuity)
reference = pd.Timestamp('2020-01-01')
df['days_since_ref'] = (df['date'] - reference).dt.days

# Cyclic encoding — avoids jump between Dec (12) and Jan (1)
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
df['dow_sin']   = np.sin(2 * np.pi * df['day_of_week'] / 7)
df['dow_cos']   = np.cos(2 * np.pi * df['day_of_week'] / 7)
\`\`\`

---

## 5. Interaction & Polynomial Features

\`\`\`python
from sklearn.preprocessing import PolynomialFeatures

# Manually create meaningful interactions
df['price_x_qty']       = df['price'] * df['quantity']
df['discount_rate']     = df['discount'] / df['price'].clip(lower=0.01)
df['revenue_per_user']  = df['revenue'] / df['active_users'].clip(lower=1)

# Automated polynomial features (use cautiously — can explode dimensionality)
poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
X_poly = poly.fit_transform(X_train[['price', 'qty', 'days_active']])
feature_names = poly.get_feature_names_out(['price', 'qty', 'days_active'])
\`\`\`

---

## 6. Handling High-Cardinality Text Features

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer

# TF-IDF: term frequency-inverse document frequency
tfidf = TfidfVectorizer(
    max_features=500,       # top 500 terms only
    ngram_range=(1, 2),     # unigrams + bigrams
    stop_words='english',
    min_df=5,               # ignore terms in < 5 documents
    sublinear_tf=True       # log(1+tf) instead of raw tf
)
X_text = tfidf.fit_transform(df['description'])
\`\`\`

---

## 7. Handling Imbalanced Targets

\`\`\`python
from sklearn.utils import resample
from imblearn.over_sampling import SMOTE

# Check imbalance
print(df['churn'].value_counts(normalize=True))
# 0    0.92
# 1    0.08   ← heavily imbalanced

# Option 1: Class weights (simplest — built into most sklearn models)
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(class_weight='balanced')

# Option 2: Oversample minority class with SMOTE (synthetic examples)
sm = SMOTE(random_state=42)
X_res, y_res = sm.fit_resample(X_train, y_train)

# Option 3: Undersample majority class
majority = df[df.churn == 0]
minority = df[df.churn == 1]
majority_down = resample(majority, n_samples=len(minority), random_state=42)
balanced = pd.concat([majority_down, minority])
\`\`\`

---

## 8. Avoiding Data Leakage

Leakage = using information from the future or from the test set during training. It produces unrealistically high validation scores that collapse on real data.

**Common leakage sources:**
1. Scaling with the full dataset before train/test split
2. Target encoding without cross-validation
3. Including post-event features (e.g., "did they return?" as a feature for predicting churn)
4. Aggregating stats that include the test period

**Safe pattern:**
\`\`\`python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# WRONG: scaler.fit_transform(X)      ← uses test data statistics
# RIGHT: fit on train, transform both
scaler.fit(X_train)
X_train_sc = scaler.transform(X_train)
X_test_sc  = scaler.transform(X_test)
\`\`\`

---

## 9. Feature Selection

\`\`\`python
from sklearn.feature_selection import SelectKBest, f_classif, RFE
from sklearn.ensemble import RandomForestClassifier

# Filter method: statistical test between feature and target
selector = SelectKBest(score_func=f_classif, k=20)
X_selected = selector.fit_transform(X_train, y_train)
selected_features = [f for f, s in zip(feature_names, selector.get_support()) if s]

# Wrapper method: recursive feature elimination
rfe = RFE(estimator=RandomForestClassifier(n_estimators=50, random_state=42), n_features_to_select=15)
X_rfe = rfe.fit_transform(X_train, y_train)

# Embedded method: feature importances from tree models
rf = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_train, y_train)
importances = pd.Series(rf.feature_importances_, index=feature_names).sort_values(ascending=False)
print(importances.head(10))
\`\`\`

---

## Key Takeaways

- **Encode ordinal → OrdinalEncoder**, nominal → **OneHotEncoder** (drop first), high-cardinality → **target encode with CV**.
- **Scale for distance-based models** (logistic regression, SVM, KNN) — not needed for tree models.
- **Cyclic encode** month and day-of-week using sin/cos to avoid discontinuities.
- **Interaction features** (price × qty, revenue per user) often have more signal than automated polynomial expansion.
- **Data leakage is silent death** — always fit transformers on training data only.
- **SMOTE** synthesises new minority samples; **class_weight='balanced'** adjusts the loss — prefer the latter for a first attempt.
`,
    codeExample: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OrdinalEncoder, OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# ── Realistic dataset ─────────────────────────────────────────────────
rng = np.random.default_rng(42)
n = 1000
df = pd.DataFrame({
    'signup_date': pd.date_range('2023-01-01', periods=n, freq='6h'),
    'plan':        rng.choice(['Free','Basic','Pro','Enterprise'], n),
    'region':      rng.choice(['NA','EU','APAC'], n),
    'logins_30d':  rng.integers(0, 200, n),
    'support_text':rng.choice(['great product','bug in export','love the dashboard','slow api'], n),
    'churn':       rng.integers(0, 2, n),
})

# ── Feature engineering ───────────────────────────────────────────────
df['days_since_signup'] = (pd.Timestamp('2024-01-01') - df['signup_date']).dt.days
df['month_sin'] = np.sin(2 * np.pi * df['signup_date'].dt.month / 12)
df['month_cos'] = np.cos(2 * np.pi * df['signup_date'].dt.month / 12)

X = df.drop(columns=['churn', 'signup_date'])
y = df['churn']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ── ColumnTransformer pipeline ────────────────────────────────────────
pre = ColumnTransformer([
    ('ord',  OrdinalEncoder(categories=[['Free','Basic','Pro','Enterprise']]), ['plan']),
    ('ohe',  OneHotEncoder(sparse_output=False, handle_unknown='ignore', drop='first'), ['region']),
    ('scl',  StandardScaler(), ['logins_30d','days_since_signup','month_sin','month_cos']),
    ('tfidf',TfidfVectorizer(max_features=20), 'support_text'),
], remainder='drop')

X_train_fe = pre.fit_transform(X_train)
X_test_fe  = pre.transform(X_test)
print(f"Train shape: {X_train_fe.shape} | Test shape: {X_test_fe.shape}")`,
    quiz: {
      title: 'Feature Engineering for Machine Learning — Quiz',
      questions: [
        {
          text: 'You have a column "customer_tier" with values Free < Basic < Pro < Enterprise. Which encoder should you use?',
          options: opts(
            'OneHotEncoder — always use OHE for categorical variables',
            'OrdinalEncoder with explicit category order — the natural ordering carries meaningful information',
            'LabelEncoder — it automatically assigns numeric values',
            'TfidfVectorizer — tier labels are text'
          ),
          correctAnswer: 'b',
          explanation: 'OrdinalEncoder lets you specify the exact order (Free=0, Basic=1, Pro=2, Enterprise=3). Arbitrary LabelEncoder order would create false metric relationships. OneHotEncoder would lose the ordinal information.',
          orderIndex: 1,
        },
        {
          text: 'Why should you use drop_first=True or drop="first" when one-hot encoding?',
          options: opts(
            'It speeds up training by reducing one feature',
            'It prevents multicollinearity — the dropped category is fully represented by the other binary columns being all zeros',
            'It prevents the encoder from creating sparse matrices',
            'It ensures categorical variables are centred at zero'
          ),
          correctAnswer: 'b',
          explanation: 'With k categories, k binary columns are perfectly collinear — knowing the first k-1 tells you the last. Dropping one column removes this redundancy, which can cause numerical instability in linear models.',
          orderIndex: 2,
        },
        {
          text: 'What is data leakage in a machine learning pipeline?',
          options: opts(
            'When the model memorises the training data (overfitting)',
            'When information from the future, from the target, or from the test set inadvertently influences training — producing optimistically biased validation scores that fail in production',
            'When the same feature appears in both training and test sets',
            'When a model trains on too many features relative to samples'
          ),
          correctAnswer: 'b',
          explanation: 'Leakage creates models that appear to perform well in evaluation but fail in production. Classic examples: scaling on the full dataset before splitting, including post-event features, or target-encoding without cross-validation.',
          orderIndex: 3,
        },
        {
          text: 'Why do you encode month (1-12) using sin/cos instead of using the raw integer?',
          options: opts(
            'Sin/cos values are faster to compute than integers',
            'The raw integer creates a false discontinuity — month 12 and month 1 (adjacent) look far apart numerically. Cyclic encoding makes their values close on both dimensions.',
            'Most ML models cannot process integers above 12',
            'Sin/cos encoding reduces the month feature to a single column'
          ),
          correctAnswer: 'b',
          explanation: 'With raw integers, distance(1, 12) = 11 — but January and December are actually adjacent months. Cyclic encoding with sin/cos projects the values onto a circle, so month 12 and month 1 are geometrically close.',
          orderIndex: 4,
        },
        {
          text: 'You have a "city" column with 2,000 unique values. Which encoding approach is most appropriate?',
          options: opts(
            'OneHotEncoder — always use OHE for nominal categories',
            'Target encoding with cross-validation — replaces each city with the mean target value estimated from training folds, avoiding leakage and handling cardinality',
            'LabelEncoder — assigns a number 0-1999 to each city',
            'Drop the column — high-cardinality categoricals cannot be encoded'
          ),
          correctAnswer: 'b',
          explanation: 'OHE on 2,000 cities creates 2,000 sparse binary columns — mostly useless. Target encoding collapses each city to one number (average target) while cross-validation prevents leakage from seeing the target during encoding.',
          orderIndex: 5,
        },
        {
          text: 'Which scaler is most appropriate when your numeric features have heavy outliers?',
          options: opts(
            'StandardScaler — it always produces the best results',
            'RobustScaler — uses median and IQR instead of mean and std, making it insensitive to outliers',
            'MinMaxScaler — the [0, 1] range avoids outlier effects',
            'No scaling is needed when outliers are present'
          ),
          correctAnswer: 'b',
          explanation: 'RobustScaler subtracts the median and divides by the IQR. Outliers distort the mean and std used by StandardScaler, pulling the scaled values for normal points toward zero. MinMaxScaler is even more sensitive to outliers since it uses the min and max.',
          orderIndex: 6,
        },
        {
          text: 'What does class_weight="balanced" do in sklearn classifiers?',
          options: opts(
            'It randomly duplicates minority class samples until classes are equal size',
            'It adjusts the loss function to penalise misclassifying the minority class more heavily — proportional to class frequency imbalance',
            'It applies SMOTE to the training data automatically',
            'It forces the model to predict equal numbers of each class'
          ),
          correctAnswer: 'b',
          explanation: 'class_weight="balanced" computes weights n_samples / (n_classes × count_per_class) and applies them to each sample\'s contribution to the loss. Minority class errors are penalised more heavily without modifying the data.',
          orderIndex: 7,
        },
        {
          text: 'Which feature selection method is an "embedded" method?',
          options: opts(
            'SelectKBest with f_classif — filters features by statistical test',
            'Recursive Feature Elimination (RFE) — recursively removes features',
            'Feature importances from a Random Forest — learned during model training as part of the algorithm',
            'Pearson correlation threshold — removes correlated features'
          ),
          correctAnswer: 'c',
          explanation: 'Embedded methods perform feature selection as part of the model fitting process. Tree-based feature importances and L1 (Lasso) regularisation are the canonical embedded methods. Filter methods use statistics; wrapper methods (like RFE) train models iteratively.',
          orderIndex: 8,
        },
        {
          text: 'You fit a StandardScaler on X_train and then call transform() on X_test. Why not fit_transform() on X_test?',
          options: opts(
            'fit_transform is slower and should only be used during training',
            'Fitting on X_test would compute test-set statistics (mean, std) and use them to scale — leaking test distribution information into the process',
            'StandardScaler cannot be fit on test data due to a sklearn restriction',
            'transform() on test data normalises to the range [0, 1] automatically'
          ),
          correctAnswer: 'b',
          explanation: 'The scaler must use training statistics to transform test data. If you fit on test, the scaler uses test mean/std — contaminating the evaluation. Always: fit on train, transform both train and test.',
          orderIndex: 9,
        },
        {
          text: 'What does TfidfVectorizer with max_features=500 produce?',
          options: opts(
            'A 500-row matrix of the top 500 documents by TF-IDF score',
            'A sparse matrix where each column represents one of the 500 highest TF-IDF-scored terms across the corpus, and each row is a document vector',
            'A 500-character summary of each document',
            'A dense matrix of 500 sentiment scores per document'
          ),
          correctAnswer: 'b',
          explanation: 'TfidfVectorizer converts text to a numeric matrix where each column is a vocabulary term and each cell is the TF-IDF score. max_features=500 keeps only the 500 most important terms, controlling dimensionality.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 17 — Linear & Multiple Regression in Depth
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-17-multiple-regression',
    title:      'Linear & Multiple Regression in Depth',
    description:'Go beyond simple trend lines — build, diagnose, and interpret multiple regression models with regularisation (Ridge, Lasso, ElasticNet), residual analysis, multicollinearity detection, and business metric forecasting.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 117,
    xpReward:   125,
    language:   'python',
    content: `# Linear & Multiple Regression in Depth

## What You'll Learn
Regression is the backbone of business analytics — forecasting revenue, estimating marketing lift, predicting churn risk, pricing products. This chapter covers the mathematics, diagnostics, and regularisation that make regression models accurate and trustworthy in production.

---

## 1. The Multiple Regression Model

\`\`\`
y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε
\`\`\`

- **β₀** = intercept (value of y when all x = 0)
- **βᵢ** = partial regression coefficient (effect of xᵢ on y, holding all other x constant)
- **ε** = residual error (what the model cannot explain)

OLS (Ordinary Least Squares) finds coefficients that **minimise the sum of squared residuals**.

---

## 2. Building a Model with statsmodels (for Inference)

Use **statsmodels** when you need statistical inference (p-values, confidence intervals, coefficient interpretation).

\`\`\`python
import pandas as pd
import numpy as np
import statsmodels.api as sm

df = pd.read_csv('house_prices.csv')

# Define features and target
X = df[['sqft', 'bedrooms', 'distance_to_centre', 'age_years']]
y = df['price']

# Add constant for intercept
X_sm = sm.add_constant(X)

model = sm.OLS(y, X_sm).fit()
print(model.summary())
\`\`\`

**Reading the summary table:**
- **coef**: the β coefficient — effect of one-unit increase in x on y (all else held constant)
- **P>|t|**: p-value — is this coefficient statistically different from zero?
- **R²**: fraction of variance in y explained by the model
- **Adj. R²**: R² penalised for number of predictors — use this to compare models with different numbers of features

---

## 3. Assumptions & Residual Diagnostics

OLS requires four key assumptions:

\`\`\`python
import matplotlib.pyplot as plt
import scipy.stats as stats

fitted = model.fittedvalues
residuals = model.resid

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 1. Residuals vs Fitted — check linearity & homoscedasticity
axes[0].scatter(fitted, residuals, alpha=0.3)
axes[0].axhline(0, color='red', linestyle='--')
axes[0].set_xlabel('Fitted Values')
axes[0].set_ylabel('Residuals')
axes[0].set_title('Residuals vs Fitted')

# 2. Q-Q plot — check normality of residuals
stats.probplot(residuals, dist='norm', plot=axes[1])
axes[1].set_title('Normal Q-Q Plot')

# 3. Scale-Location — check homoscedasticity
axes[2].scatter(fitted, np.sqrt(np.abs(residuals)), alpha=0.3)
axes[2].set_xlabel('Fitted Values')
axes[2].set_ylabel('√|Standardised Residuals|')
axes[2].set_title('Scale-Location')

plt.tight_layout()
plt.show()
\`\`\`

**What to look for:**
- **Residuals vs Fitted**: points randomly scattered around zero → linearity & homoscedasticity ✓
- **Q-Q plot**: points on the diagonal line → normality of residuals ✓
- **Fan shape in Residuals vs Fitted**: heteroscedasticity → transform y (log) or use WLS

---

## 4. Detecting Multicollinearity — VIF

Multicollinearity (highly correlated predictors) inflates standard errors and makes coefficients unstable.

\`\`\`python
from statsmodels.stats.outliers_influence import variance_inflation_factor

vif_data = pd.DataFrame({
    'feature': X.columns,
    'VIF': [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]
}).sort_values('VIF', ascending=False)

print(vif_data)
# VIF > 10: serious multicollinearity → drop or combine features
# VIF > 5:  moderate concern
# VIF < 5:  acceptable
\`\`\`

---

## 5. Regularisation — Ridge, Lasso, ElasticNet

Regularisation adds a penalty term to the loss function to shrink coefficients, preventing overfitting and handling multicollinearity.

| Method | Penalty | Effect |
|---|---|---|
| Ridge (L2) | β² | Shrinks all coefficients toward zero; keeps all features |
| Lasso (L1) | |β| | Drives some coefficients exactly to zero; performs feature selection |
| ElasticNet | α|β| + (1-α)β² | Combines both; good for high-dimensional data |

\`\`\`python
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.model_selection import cross_val_score, KFold
import numpy as np

kf = KFold(n_splits=5, shuffle=True, random_state=42)

# Ridge
ridge = Ridge(alpha=1.0)
cv_ridge = cross_val_score(ridge, X_train_sc, y_train, cv=kf, scoring='r2')
print(f"Ridge CV R² = {cv_ridge.mean():.3f} ± {cv_ridge.std():.3f}")

# Lasso — also performs feature selection
lasso = Lasso(alpha=0.1, max_iter=10000)
lasso.fit(X_train_sc, y_train)
non_zero = (lasso.coef_ != 0).sum()
print(f"Lasso selected {non_zero} of {X_train_sc.shape[1]} features")

# Tune alpha with cross-validation
from sklearn.linear_model import RidgeCV, LassoCV
ridge_cv = RidgeCV(alphas=[0.001, 0.01, 0.1, 1, 10, 100], cv=5)
ridge_cv.fit(X_train_sc, y_train)
print(f"Best alpha: {ridge_cv.alpha_}")
\`\`\`

---

## 6. Model Evaluation Metrics for Regression

\`\`\`python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

y_pred = lasso.predict(X_test_sc)

mse  = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae  = mean_absolute_error(y_test, y_pred)
r2   = r2_score(y_test, y_pred)
mape = np.mean(np.abs((y_test - y_pred) / y_test.clip(lower=0.01))) * 100

print(f"RMSE: {rmse:,.0f}")
print(f"MAE:  {mae:,.0f}")
print(f"R²:   {r2:.3f}")
print(f"MAPE: {mape:.1f}%")
\`\`\`

| Metric | Meaning | Use when |
|---|---|---|
| RMSE | Square-root of mean squared error; penalises large errors more | Large errors are especially bad |
| MAE | Mean absolute error; robust to outliers | Outliers exist; interpretability matters |
| R² | % variance explained (0-1) | Comparing models on same dataset |
| MAPE | % error relative to actual | Comparing across different scales |

---

## 7. Log Transformation for Skewed Targets

Many business metrics (revenue, page views, prices) are right-skewed. Log-transforming the target often dramatically improves regression performance.

\`\`\`python
# Transform target
y_log = np.log1p(y)   # log(1 + y) handles zeros

model_log = Ridge(alpha=1.0).fit(X_train_sc, np.log1p(y_train))

# Reverse transform predictions
y_pred_log = model_log.predict(X_test_sc)
y_pred_original = np.expm1(y_pred_log)   # exp(x) - 1

rmse_log = np.sqrt(mean_squared_error(y_test, y_pred_original))
print(f"RMSE after log transform: {rmse_log:,.0f}")
\`\`\`

---

## 8. Interpreting Coefficients in Business Terms

\`\`\`python
# After fitting: each coefficient = partial effect, all else held constant
coef_df = pd.DataFrame({
    'feature':     X.columns,
    'coefficient': model.params[1:],   # skip intercept
    'p_value':     model.pvalues[1:],
    'ci_lower':    model.conf_int()[1:][0],
    'ci_upper':    model.conf_int()[1:][1],
}).sort_values('coefficient', ascending=False)

print(coef_df)
# Example interpretation:
# bedrooms coef = 15,000 → each additional bedroom adds £15,000 to price,
# holding sqft, distance, and age constant (p=0.003, 95% CI: £11,000–£19,000)
\`\`\`

---

## Key Takeaways

- Use **statsmodels OLS** for interpretable inference (p-values, confidence intervals); use **sklearn** for prediction and cross-validation.
- Check **VIF > 10** as a signal of dangerous multicollinearity — drop or combine correlated features.
- **Lasso selects features**; **Ridge shrinks them** — ElasticNet combines both. Always tune alpha with cross-validation.
- **Log-transform** right-skewed targets (revenue, counts) before fitting — it often cuts RMSE by 30-50%.
- Report **RMSE + MAE + R²** together — no single metric tells the full story.
- Residual diagnostics (Q-Q, Scale-Location) are mandatory before trusting a regression model.
`,
    codeExample: `import pandas as pd
import numpy as np
import statsmodels.api as sm
from sklearn.linear_model import RidgeCV, LassoCV
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

rng = np.random.default_rng(42)
n = 500
df = pd.DataFrame({
    'sqft':       rng.normal(1200, 400, n).clip(400),
    'bedrooms':   rng.integers(1, 6, n).astype(float),
    'age_years':  rng.normal(20, 15, n).clip(0),
    'distance_km':rng.exponential(5, n),
})
# True relationship + noise
df['price'] = (
    180 * df['sqft'] +
    15000 * df['bedrooms'] -
    1200 * df['age_years'] -
    8000 * df['distance_km'] +
    50000 +
    rng.normal(0, 30000, n)
).clip(0)

X = df.drop(columns='price')
y = df['price']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
Xtr = scaler.fit_transform(X_train)
Xte = scaler.transform(X_test)

# OLS summary (inference)
X_sm = sm.add_constant(X_train)
ols = sm.OLS(y_train, X_sm).fit()
print(ols.summary().tables[1])

# Ridge with auto alpha
ridge = RidgeCV(alphas=np.logspace(-3, 3, 50), cv=5).fit(Xtr, y_train)
y_pred = ridge.predict(Xte)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2   = r2_score(y_test, y_pred)
print(f"\\nRidge (alpha={ridge.alpha_:.4f})  RMSE={rmse:,.0f}  R²={r2:.3f}")`,
    quiz: {
      title: 'Linear & Multiple Regression in Depth — Quiz',
      questions: [
        {
          text: 'In multiple regression output, a coefficient β₁ = 15,000 for "bedrooms" means:',
          options: opts(
            'The property has 15,000 bedrooms on average',
            'Each additional bedroom is associated with a £15,000 higher price, holding all other variables constant',
            'The model predicts 15,000 as the price when bedrooms = 0',
            'The correlation between bedrooms and price is 0.15'
          ),
          correctAnswer: 'b',
          explanation: 'Regression coefficients are partial effects: the expected change in y for a one-unit increase in xᵢ, holding all other predictors constant. This is what makes multiple regression powerful — it isolates each variable\'s effect.',
          orderIndex: 1,
        },
        {
          text: 'What does Adjusted R² penalise that plain R² does not?',
          options: opts(
            'Non-normal residuals',
            'Adding more predictors to the model — it decreases when a predictor does not improve fit beyond what is expected by chance',
            'Large coefficient values',
            'Heteroscedasticity in the residuals'
          ),
          correctAnswer: 'b',
          explanation: 'Plain R² always increases or stays the same when you add features, even if they are noise. Adjusted R² penalises the number of predictors, decreasing when added features don\'t meaningfully improve fit — making it the correct metric for model comparison.',
          orderIndex: 2,
        },
        {
          text: 'A VIF (Variance Inflation Factor) of 25 for a feature indicates:',
          options: opts(
            'The feature has 25 unique values',
            'Serious multicollinearity — that feature is highly correlated with other predictors, inflating its standard error and making its coefficient unreliable',
            'The feature explains 25% of the variance in y',
            'The feature should be scaled by a factor of 25'
          ),
          correctAnswer: 'b',
          explanation: 'VIF = 1 means no multicollinearity. VIF > 10 (rule of thumb) signals serious collinearity — the feature\'s variance is inflated 10x by its correlations with other predictors, making coefficient estimates unstable.',
          orderIndex: 3,
        },
        {
          text: 'Which regularisation method performs automatic feature selection by driving some coefficients exactly to zero?',
          options: opts(
            'Ridge (L2 penalty)',
            'Lasso (L1 penalty)',
            'ElasticNet (L1 + L2)',
            'StandardScaler before OLS'
          ),
          correctAnswer: 'b',
          explanation: 'Lasso\'s L1 penalty (sum of |β|) has corners at zero in its constraint geometry, causing some coefficients to become exactly zero. Ridge\'s L2 penalty (sum of β²) shrinks coefficients toward zero but never exactly reaches it.',
          orderIndex: 4,
        },
        {
          text: 'You plot Residuals vs Fitted and see a fan shape (residuals spread wider for larger fitted values). What does this indicate?',
          options: opts(
            'The model is overfitting',
            'Heteroscedasticity — the variance of errors is not constant across fitted values. Remedy: log-transform y or use Weighted Least Squares',
            'Multicollinearity between predictors',
            'The model has too few observations'
          ),
          correctAnswer: 'b',
          explanation: 'A fan shape (or funnel) in the Residuals vs Fitted plot violates the homoscedasticity assumption. OLS standard errors are incorrect under heteroscedasticity. Log-transforming a right-skewed target (e.g., revenue) often resolves it.',
          orderIndex: 5,
        },
        {
          text: 'Why do you use np.log1p(y) instead of np.log(y) when transforming a target variable?',
          options: opts(
            'log1p is faster to compute than log',
            'log(0) is undefined; log1p(0) = log(1+0) = 0 — handles zero values in the target without producing -inf',
            'log1p produces values in the range [0, 1] which are easier for models to learn',
            'log1p automatically back-transforms predictions to the original scale'
          ),
          correctAnswer: 'b',
          explanation: 'np.log(0) = -inf, which breaks models. np.log1p(x) = log(1+x), so zero values become 0 instead of -inf. The inverse transform is np.expm1() = exp(x) - 1.',
          orderIndex: 6,
        },
        {
          text: 'What is the purpose of sm.add_constant(X) in statsmodels?',
          options: opts(
            'It standardises the features to have zero mean',
            'It adds a column of ones to X, allowing the model to estimate the intercept (β₀) — without it, the regression line is forced through the origin',
            'It adds a regularisation constant to the OLS loss',
            'It converts the DataFrame to a matrix for faster computation'
          ),
          correctAnswer: 'b',
          explanation: 'OLS fits y = Xβ. Without an intercept column, β₀ = 0 — the line must pass through the origin. Adding a column of 1s gives the model a free intercept parameter, almost always the correct choice.',
          orderIndex: 7,
        },
        {
          text: 'MAPE (Mean Absolute Percentage Error) is preferred over RMSE when:',
          options: opts(
            'The dataset is very large (> 1 million rows)',
            'You need to compare forecast accuracy across products or time series with different scales or magnitudes',
            'The residuals follow a normal distribution',
            'The model has more than 20 features'
          ),
          correctAnswer: 'b',
          explanation: 'RMSE is scale-dependent — RMSE of 1000 means nothing without context. MAPE expresses error as a percentage of the actual value, making it scale-independent and comparable across different products or forecast horizons.',
          orderIndex: 8,
        },
        {
          text: 'When comparing two regression models with different numbers of features, which metric gives the fairest comparison?',
          options: opts(
            'R² — the standard measure of fit',
            'Adjusted R² — it penalises adding features that don\'t improve fit',
            'RMSE — scale-independent comparison',
            'The number of statistically significant coefficients'
          ),
          correctAnswer: 'b',
          explanation: 'R² always increases with more features. Adjusted R² decreases when new predictors don\'t add real explanatory power, making it the correct metric for model selection when the number of predictors differs.',
          orderIndex: 9,
        },
        {
          text: 'What does RidgeCV(alphas=[0.001, 0.01, 0.1, 1, 10], cv=5) do?',
          options: opts(
            'Trains five Ridge models with alpha=5 using five features',
            'Evaluates each candidate alpha using 5-fold cross-validation and automatically selects the alpha that minimises validation error',
            'Applies Ridge regularisation with alpha that changes over 5 training epochs',
            'Trains a Ridge model with five different random seeds and averages coefficients'
          ),
          correctAnswer: 'b',
          explanation: 'RidgeCV performs internal cross-validation over the provided alpha grid and selects the best alpha automatically. Access the winner with ridge_cv.alpha_. This avoids the separate GridSearchCV step for Ridge/Lasso.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 18 — Classification & Predictive Modelling
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-18-classification-modelling',
    title:      'Classification & Predictive Modelling',
    description:'Build end-to-end classification models for churn prediction, fraud detection, and customer segmentation — covering Logistic Regression, Decision Trees, Random Forest, and XGBoost with proper evaluation.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 118,
    xpReward:   130,
    language:   'python',
    content: `# Classification & Predictive Modelling

## What You'll Learn
Classification — predicting a category rather than a continuous value — powers churn prediction, fraud detection, propensity scoring, and customer segmentation at every major tech firm. This chapter builds end-to-end classifiers and teaches you to evaluate them correctly (hint: accuracy alone is almost always the wrong metric).

---

## 1. The Classification Problem

Given features X, predict class y ∈ {0, 1} (binary) or {0, 1, 2, ...} (multiclass).

**Common business applications:**
- Will this customer churn in the next 30 days? (binary)
- Is this transaction fraudulent? (binary, imbalanced)
- Which customer segment does this user belong to? (multiclass)
- Will this lead convert? (binary, propensity score)

---

## 2. Logistic Regression — Probabilistic Baseline

Despite its name, logistic regression is a classifier. It outputs a probability between 0 and 1 via the sigmoid function.

\`\`\`python
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score, roc_curve

# Simulate churn dataset
rng = np.random.default_rng(42)
n = 5000
df = pd.DataFrame({
    'logins_30d':      rng.integers(0, 50, n),
    'support_tickets': rng.integers(0, 10, n),
    'days_inactive':   rng.integers(0, 90, n),
    'plan_score':      rng.integers(1, 5, n),
    'churn': (rng.random(n) < 0.15).astype(int)
})

X = df.drop('churn', axis=1).values
y = df['churn'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                     stratify=y, random_state=42)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# Fit with class balancing
lr = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
lr.fit(X_train_s, y_train)

# Probabilities (use for business decisions, not hard labels)
proba = lr.predict_proba(X_test_s)[:, 1]
print(f"ROC AUC: {roc_auc_score(y_test, proba):.3f}")
\`\`\`

---

## 3. Decision Trees

Decision trees split data on feature thresholds that maximise information gain (or Gini impurity reduction).

\`\`\`python
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt

dt = DecisionTreeClassifier(max_depth=4, min_samples_leaf=20, random_state=42)
dt.fit(X_train_s, y_train)

# Visualise (shallow trees only)
fig, ax = plt.subplots(figsize=(14, 5))
plot_tree(dt, feature_names=['logins','tickets','inactive','plan'],
          class_names=['Stay','Churn'], filled=True, rounded=True, ax=ax)
plt.tight_layout()
plt.show()

# Feature importance
importances = pd.Series(dt.feature_importances_,
                        index=['logins','tickets','inactive','plan']).sort_values(ascending=False)
print(importances)
\`\`\`

**Limitations of single trees:** High variance — small data changes produce very different trees. Use ensembles instead.

---

## 4. Random Forest — Ensemble of Trees

Random Forest trains many decision trees on bootstrapped samples and random feature subsets, averaging their predictions. This dramatically reduces variance.

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=200,      # number of trees
    max_depth=8,
    max_features='sqrt',   # random subset of features per split
    min_samples_leaf=10,
    class_weight='balanced',
    n_jobs=-1,             # use all CPU cores
    random_state=42
)
rf.fit(X_train_s, y_train)

proba_rf = rf.predict_proba(X_test_s)[:, 1]
print(f"RF ROC AUC: {roc_auc_score(y_test, proba_rf):.3f}")
\`\`\`

---

## 5. XGBoost — Gradient Boosted Trees

XGBoost builds trees sequentially — each tree corrects the errors of the previous. Industry standard for tabular classification.

\`\`\`python
from xgboost import XGBClassifier

xgb = XGBClassifier(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=(y_train == 0).sum() / (y_train == 1).sum(),  # handles imbalance
    eval_metric='auc',
    random_state=42,
    n_jobs=-1
)
xgb.fit(
    X_train_s, y_train,
    eval_set=[(X_test_s, y_test)],
    verbose=50
)
proba_xgb = xgb.predict_proba(X_test_s)[:, 1]
print(f"XGB ROC AUC: {roc_auc_score(y_test, proba_xgb):.3f}")
\`\`\`

---

## 6. The Right Evaluation Metrics

**Never use accuracy alone on imbalanced data.** A model that always predicts "no churn" gets 92% accuracy if 8% churn — and is completely useless.

\`\`\`python
from sklearn.metrics import (
    classification_report, confusion_matrix, ConfusionMatrixDisplay,
    precision_recall_curve, average_precision_score
)

# Choose threshold for your use case
threshold = 0.3   # lower → catch more churners (higher recall, lower precision)
y_pred = (proba_rf >= threshold).astype(int)

print(classification_report(y_test, y_pred, target_names=['Stay','Churn']))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
ConfusionMatrixDisplay(cm, display_labels=['Stay','Churn']).plot()
\`\`\`

| Metric | Formula | Use when |
|---|---|---|
| Precision | TP / (TP+FP) | False positives are costly (e.g., spam filter) |
| Recall | TP / (TP+FN) | False negatives are costly (e.g., fraud, churn) |
| F1 | 2×P×R / (P+R) | Need balance between precision and recall |
| ROC AUC | Area under ROC curve | Compare models regardless of threshold |
| PR AUC | Area under P-R curve | Imbalanced datasets — more informative than ROC |

\`\`\`python
# PR curve
precision, recall, thresholds = precision_recall_curve(y_test, proba_rf)
ap = average_precision_score(y_test, proba_rf)
print(f"Average Precision (PR AUC): {ap:.3f}")
\`\`\`

---

## 7. Choosing the Threshold

\`\`\`python
# Find threshold that maximises F1
f1_scores = []
for t in thresholds:
    pred = (proba_rf >= t).astype(int)
    tp = ((pred == 1) & (y_test == 1)).sum()
    fp = ((pred == 1) & (y_test == 0)).sum()
    fn = ((pred == 0) & (y_test == 1)).sum()
    if tp + fp == 0 or tp + fn == 0:
        f1_scores.append(0)
        continue
    p = tp / (tp + fp)
    r = tp / (tp + fn)
    f1_scores.append(2 * p * r / (p + r) if p + r > 0 else 0)

best_t = thresholds[np.argmax(f1_scores)]
print(f"Optimal threshold for F1: {best_t:.2f}")
\`\`\`

---

## 8. Cross-Validation

\`\`\`python
# Stratified K-Fold preserves class balance across folds
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_auc = cross_val_score(rf, X_train_s, y_train,
                          cv=skf, scoring='roc_auc', n_jobs=-1)
print(f"CV ROC AUC: {cv_auc.mean():.3f} ± {cv_auc.std():.3f}")
\`\`\`

Always use **StratifiedKFold** for classification to ensure each fold has the same class distribution.

---

## Key Takeaways

- **Logistic Regression** is your interpretable baseline — always start here before complex models.
- **Random Forest** reduces variance through bagging; **XGBoost** reduces bias through boosting — both beat single trees.
- **Stratify** your train/test split and cross-validation folds when classes are imbalanced.
- **Never report only accuracy** — use Precision, Recall, F1, and ROC AUC together.
- **Tune the probability threshold** to match business cost — a churn model needs high recall; a spam filter needs high precision.
- **PR AUC** is more informative than ROC AUC when the positive class is rare.
`,
    codeExample: `import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score, classification_report, average_precision_score

rng = np.random.default_rng(0)
n = 3000
df = pd.DataFrame({
    'logins_7d':       rng.integers(0, 30, n),
    'days_since_last': rng.exponential(14, n).clip(0, 120),
    'plan_level':      rng.integers(1, 5, n).astype(float),
    'tickets_open':    rng.integers(0, 8, n),
    'spend_30d':       np.abs(rng.normal(200, 150, n)),
})
# Simulate target: high days_since_last + low logins → likely churn
logit = (-0.05*df['logins_7d'] + 0.02*df['days_since_last']
         - 0.3*df['plan_level'] + 0.1*df['tickets_open'] - 0.001*df['spend_30d'])
df['churn'] = (1 / (1 + np.exp(-logit)) > 0.5).astype(int)

X = df.drop('churn', axis=1)
y = df['churn']
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

sc = StandardScaler()
Xtr_s = sc.fit_transform(X_tr)
Xte_s = sc.transform(X_te)

# Baseline: Logistic Regression
lr = LogisticRegression(class_weight='balanced', random_state=42)
lr.fit(Xtr_s, y_tr)
print(f"LR   AUC = {roc_auc_score(y_te, lr.predict_proba(Xte_s)[:,1]):.3f}")

# Ensemble: Random Forest
rf = RandomForestClassifier(n_estimators=150, class_weight='balanced',
                             max_depth=6, n_jobs=-1, random_state=42)
rf.fit(Xtr_s, y_tr)
proba = rf.predict_proba(Xte_s)[:,1]
print(f"RF   AUC = {roc_auc_score(y_te, proba):.3f}")
print(f"RF PR-AUC = {average_precision_score(y_te, proba):.3f}")

# CV
skf = StratifiedKFold(5, shuffle=True, random_state=42)
cv  = cross_val_score(rf, Xtr_s, y_tr, cv=skf, scoring='roc_auc', n_jobs=-1)
print(f"CV AUC = {cv.mean():.3f} ± {cv.std():.3f}")
print(classification_report(y_te, (proba >= 0.35).astype(int)))`,
    quiz: {
      title: 'Classification & Predictive Modelling — Quiz',
      questions: [
        {
          text: 'Your churn model has 94% accuracy, but the churn rate in the dataset is only 6%. What is the most likely problem?',
          options: opts(
            'The model is overfitting to the training data',
            'The model may be predicting "no churn" for every sample — a dummy classifier would also get 94% accuracy on a 6% positive-rate dataset',
            'The model has too many features',
            '94% accuracy is excellent — there is no problem'
          ),
          correctAnswer: 'b',
          explanation: 'On a 6% positive rate, always predicting the majority class (0) achieves 94% accuracy. Accuracy is meaningless on imbalanced datasets. Always report Recall, Precision, F1, and ROC AUC.',
          orderIndex: 1,
        },
        {
          text: 'Why must you use stratify=y in train_test_split for a classification problem with 8% positives?',
          options: opts(
            'It ensures both splits have the same number of rows',
            'It ensures each split preserves the 8% positive rate — without it, randomness could give you 2% positives in training and 14% in test, invalidating your evaluation',
            'It prevents data leakage between train and test sets',
            'It is required for XGBoost but not for other classifiers'
          ),
          correctAnswer: 'b',
          explanation: 'Stratified splitting preserves the class distribution in each split. For rare classes, a non-stratified random split could accidentally give very different positive rates in train vs test, making evaluation unreliable.',
          orderIndex: 2,
        },
        {
          text: 'What does ROC AUC = 0.5 mean?',
          options: opts(
            'The model classifies 50% of samples correctly',
            'The model performs no better than random guessing — it cannot distinguish positives from negatives',
            'The model has 50% precision and 50% recall',
            'The model achieves 50% accuracy on the test set'
          ),
          correctAnswer: 'b',
          explanation: 'ROC AUC measures the probability that a random positive is ranked above a random negative by the model. AUC = 0.5 means random ranking (no discriminative power). AUC = 1.0 is perfect. AUC < 0.5 means the model is inverted — swap predictions.',
          orderIndex: 3,
        },
        {
          text: 'In a fraud detection model, which metric is most critical to maximise?',
          options: opts(
            'Precision — ensuring all flagged transactions are truly fraudulent',
            'Recall — ensuring almost no fraudulent transactions are missed, even at the cost of some false positives',
            'Accuracy — correctly classifying the most transactions overall',
            'Specificity — correctly identifying non-fraud transactions'
          ),
          correctAnswer: 'b',
          explanation: 'In fraud detection, a missed fraud (false negative) is far more costly than flagging a legitimate transaction for review (false positive). Maximising Recall minimises false negatives. Then precision is tuned at the threshold level.',
          orderIndex: 4,
        },
        {
          text: 'What is the key difference between bagging (Random Forest) and boosting (XGBoost)?',
          options: opts(
            'Bagging uses decision trees; boosting uses linear models',
            'Bagging trains trees in parallel on bootstrapped samples to reduce variance; boosting trains trees sequentially where each tree corrects the errors of the previous to reduce bias',
            'Bagging is for classification only; boosting is for regression only',
            'Bagging always outperforms boosting on tabular data'
          ),
          correctAnswer: 'b',
          explanation: 'Random Forest (bagging) averages many independent trees to reduce variance. XGBoost (gradient boosting) builds trees sequentially, each one targeting the residual errors of the ensemble so far — reducing bias. Both improve on single trees.',
          orderIndex: 5,
        },
        {
          text: 'What does scale_pos_weight in XGBClassifier control?',
          options: opts(
            'The learning rate applied to positive-class samples',
            'The weight assigned to positive-class samples in the loss — set to (negative samples) / (positive samples) to handle class imbalance',
            'The maximum weight of the positive class leaf nodes',
            'The number of positive samples included in each tree'
          ),
          correctAnswer: 'b',
          explanation: 'scale_pos_weight makes XGBoost penalise misclassifying positive-class samples more heavily. Set to n_negatives/n_positives (e.g., 9.0 for 10% positive rate). Equivalent to class_weight="balanced" in sklearn.',
          orderIndex: 6,
        },
        {
          text: 'You lower the classification threshold from 0.5 to 0.3. What happens to precision and recall?',
          options: opts(
            'Both precision and recall increase',
            'Recall increases (more positives are caught) and precision typically decreases (more false positives are included)',
            'Precision increases and recall decreases',
            'Both precision and recall decrease'
          ),
          correctAnswer: 'b',
          explanation: 'A lower threshold classifies more samples as positive — catching more true positives (recall up) but also flagging more false positives (precision down). This trade-off is visualised in the Precision-Recall curve.',
          orderIndex: 7,
        },
        {
          text: 'Why is PR AUC (area under the Precision-Recall curve) preferred over ROC AUC for highly imbalanced datasets?',
          options: opts(
            'PR AUC is always larger and therefore more optimistic',
            'ROC AUC can be misleadingly high when negatives vastly outnumber positives — PR AUC focuses only on positive-class performance and better reflects how well the model identifies rare events',
            'PR AUC is faster to compute than ROC AUC',
            'PR AUC works for multiclass; ROC AUC works only for binary'
          ),
          correctAnswer: 'b',
          explanation: 'The ROC curve\'s True Positive Rate vs False Positive Rate is dominated by the large negative class. A high ROC AUC can hide poor precision on the minority class. PR AUC focuses entirely on positive-class retrieval, revealing true minority-class performance.',
          orderIndex: 8,
        },
        {
          text: 'What does max_features="sqrt" do in RandomForestClassifier?',
          options: opts(
            'It limits the maximum depth of each tree to the square root of n_samples',
            'At each split, it randomly selects sqrt(n_features) candidate features — forcing trees to be diverse and uncorrelated, which is key to the ensemble\'s variance reduction',
            'It scales features by their square root before splitting',
            'It restricts the forest to sqrt(n_estimators) trees'
          ),
          correctAnswer: 'b',
          explanation: 'Random Forest introduces randomness by considering only a random subset of features at each split. max_features="sqrt" is the standard for classification (log2 for some use cases). This decorrelates the trees — identical trees would not reduce variance when averaged.',
          orderIndex: 9,
        },
        {
          text: 'Your logistic regression model outputs a probability of 0.73 for a customer. How should this be interpreted?',
          options: opts(
            'The customer will churn in exactly 73 days',
            'The model estimates a 73% probability that this customer belongs to the positive class (e.g., will churn) given their feature values',
            'The model is 73% confident that its prediction is correct',
            '73% of the customer\'s features indicate churn'
          ),
          correctAnswer: 'b',
          explanation: 'Logistic regression outputs a calibrated probability via the sigmoid function. 0.73 means the model estimates a 73% probability of the positive class. Whether to classify as positive depends on the threshold, which you choose based on business cost considerations.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 19 — Model Evaluation & Validation Best Practices
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-19-model-evaluation',
    title:      'Model Evaluation & Validation Best Practices',
    description:'Go beyond train/test split — master k-fold CV, nested CV, time-series CV, bias-variance trade-off, learning curves, hyperparameter tuning, and the reproducibility practices used at production ML teams.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 119,
    xpReward:   120,
    language:   'python',
    content: `# Model Evaluation & Validation Best Practices

## What You'll Learn
A model that looks great in development can fail spectacularly in production. This chapter is about knowing *why* a model works and *when* it will fail — covering the full evaluation toolkit used at engineering-grade ML teams.

---

## 1. The Bias-Variance Trade-off

Every prediction error has two components:

\`\`\`
Total Error = Bias² + Variance + Irreducible Noise
\`\`\`

- **High Bias (underfitting)**: model is too simple — high error on both train and test
- **High Variance (overfitting)**: model is too complex — low train error, high test error
- **Sweet spot**: enough complexity to capture real patterns without learning noise

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import learning_curve, cross_val_score

# Diagnose with learning curves
def plot_learning_curve(estimator, X, y, title='Learning Curve'):
    train_sizes, train_scores, val_scores = learning_curve(
        estimator, X, y,
        train_sizes=np.linspace(0.1, 1.0, 10),
        cv=5, scoring='neg_mean_squared_error', n_jobs=-1
    )
    train_rmse = np.sqrt(-train_scores.mean(axis=1))
    val_rmse   = np.sqrt(-val_scores.mean(axis=1))

    plt.figure(figsize=(8, 5))
    plt.plot(train_sizes, train_rmse, 'o-', label='Train RMSE')
    plt.plot(train_sizes, val_rmse,   's-', label='Validation RMSE')
    plt.xlabel('Training Set Size')
    plt.ylabel('RMSE')
    plt.title(title)
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()

    # Diagnose
    gap = val_rmse[-1] - train_rmse[-1]
    if gap > val_rmse[-1] * 0.3:
        print("⚠ High variance (overfitting) — try regularisation or more data")
    elif train_rmse[-1] > val_rmse.min() * 1.5:
        print("⚠ High bias (underfitting) — try a more complex model or more features")
    else:
        print("✓ Bias-variance balance looks reasonable")
\`\`\`

---

## 2. K-Fold Cross-Validation

\`\`\`python
from sklearn.model_selection import KFold, StratifiedKFold, cross_validate
from sklearn.ensemble import GradientBoostingClassifier

kf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# cross_validate returns train/test scores + fit times
cv_results = cross_validate(
    GradientBoostingClassifier(random_state=42),
    X, y,
    cv=kf,
    scoring=['roc_auc', 'average_precision', 'f1'],
    return_train_score=True,
    n_jobs=-1
)

for metric in ['roc_auc', 'average_precision', 'f1']:
    test_sc  = cv_results[f'test_{metric}']
    train_sc = cv_results[f'train_{metric}']
    print(f"{metric:25s}: val={test_sc.mean():.3f}±{test_sc.std():.3f}  "
          f"train={train_sc.mean():.3f}  gap={train_sc.mean()-test_sc.mean():.3f}")
\`\`\`

**Overfitting signal:** large train-val gap (gap > 0.05 on AUC is worth investigating).

---

## 3. Hyperparameter Tuning

### Grid Search (exhaustive)
\`\`\`python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth':    [3, 5, 7],
    'learning_rate':[0.01, 0.05, 0.1],
    'subsample':    [0.7, 0.9],
}
# 3×3×3×2 = 54 combinations × 5 folds = 270 fits — can be slow!

gs = GridSearchCV(
    GradientBoostingClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,
    verbose=1,
    refit=True     # re-trains on full train set with best params
)
gs.fit(X_train, y_train)
print(f"Best params: {gs.best_params_}")
print(f"Best CV AUC: {gs.best_score_:.3f}")
\`\`\`

### Randomised Search (efficient)
\`\`\`python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform

param_dist = {
    'n_estimators': randint(50, 500),
    'max_depth':    randint(2, 10),
    'learning_rate':uniform(0.005, 0.2),
    'subsample':    uniform(0.6, 0.4),
    'min_samples_leaf': randint(1, 30),
}

rs = RandomizedSearchCV(
    GradientBoostingClassifier(random_state=42),
    param_dist,
    n_iter=50,       # sample 50 random combinations (vs 270 for grid)
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,
    random_state=42,
    refit=True
)
rs.fit(X_train, y_train)
print(f"Best params: {rs.best_params_}")
\`\`\`

---

## 4. Nested Cross-Validation

When you tune hyperparameters and evaluate on the same data, you get an optimistically biased estimate. Nested CV gives an unbiased estimate of the tuned model's performance.

\`\`\`python
from sklearn.model_selection import cross_val_score

# Inner loop: hyperparameter search
inner_cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
# Outer loop: performance estimation
outer_cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

rs_nested = RandomizedSearchCV(
    GradientBoostingClassifier(random_state=42),
    param_dist, n_iter=20, cv=inner_cv, scoring='roc_auc', n_jobs=-1, random_state=42
)
nested_scores = cross_val_score(rs_nested, X, y, cv=outer_cv, scoring='roc_auc', n_jobs=-1)
print(f"Nested CV AUC: {nested_scores.mean():.3f} ± {nested_scores.std():.3f}")
\`\`\`

---

## 5. Time-Series Cross-Validation

Standard K-Fold shuffles data randomly — invalid for time series because it lets the model see the future during training. Use **TimeSeriesSplit**.

\`\`\`python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5, gap=7)  # gap=7 days between train/test (avoids leakage)

for fold, (train_idx, val_idx) in enumerate(tscv.split(X)):
    X_tr, X_va = X[train_idx], X[val_idx]
    y_tr, y_va = y[train_idx], y[val_idx]
    # train_idx is always before val_idx — no future data leakage
    print(f"Fold {fold+1}: train {train_idx[0]}–{train_idx[-1]}, val {val_idx[0]}–{val_idx[-1]}")
\`\`\`

---

## 6. Reproducibility

\`\`\`python
import random, os
import numpy as np

def set_all_seeds(seed: int = 42) -> None:
    """Ensure reproducible results across runs."""
    random.seed(seed)
    np.random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    # For TensorFlow/PyTorch: tf.random.set_seed(seed) / torch.manual_seed(seed)

set_all_seeds(42)
\`\`\`

**Reproducibility checklist:**
- Set all random seeds
- Log model version, library versions, and data hash
- Store the exact hyperparameters used
- Save the trained model artefact (joblib/pickle)
- Record training data date range
- Version-control your code with git (embed commit hash in outputs)

---

## 7. Model Persistence

\`\`\`python
import joblib
from datetime import datetime

# Save the full pipeline (scaler + model together)
pipeline_path = f'models/churn_model_{datetime.today().strftime("%Y%m%d")}.joblib'
joblib.dump({'model': gs.best_estimator_, 'scaler': scaler}, pipeline_path)
print(f"Model saved: {pipeline_path}")

# Load and use
artefact = joblib.load(pipeline_path)
loaded_model  = artefact['model']
loaded_scaler = artefact['scaler']

X_new_scaled = loaded_scaler.transform(X_new)
predictions  = loaded_model.predict_proba(X_new_scaled)[:, 1]
\`\`\`

---

## 8. Model Comparison Framework

\`\`\`python
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

models = {
    'Logistic Regression': LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42),
    'Random Forest':        RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42, n_jobs=-1),
    'Gradient Boosting':    GradientBoostingClassifier(n_estimators=100, random_state=42),
}

results = []
for name, model in models.items():
    cv_res = cross_validate(model, X_train_s, y_train,
                            cv=StratifiedKFold(5, shuffle=True, random_state=42),
                            scoring=['roc_auc','average_precision','f1'],
                            n_jobs=-1)
    results.append({
        'Model':  name,
        'AUC':    f"{cv_res['test_roc_auc'].mean():.3f} ± {cv_res['test_roc_auc'].std():.3f}",
        'PR-AUC': f"{cv_res['test_average_precision'].mean():.3f}",
        'F1':     f"{cv_res['test_f1'].mean():.3f}",
    })

print(pd.DataFrame(results).to_string(index=False))
\`\`\`

---

## Key Takeaways

- **Learning curves** diagnose bias vs variance — the most actionable diagnostic tool.
- **Nested CV** gives an honest estimate of tuned model performance; plain CV after tuning is optimistic.
- **TimeSeriesSplit** is mandatory for time-ordered data — never use random K-Fold on time series.
- **RandomizedSearchCV** explores large hyperparameter spaces efficiently — use it over GridSearch when space > 100 combinations.
- **Save scaler + model together** in a single artefact — never apply a different scaler at inference time.
- **Set all random seeds** and log library versions for reproducibility.
`,
    codeExample: `import pandas as pd
import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import (StratifiedKFold, cross_validate,
                                     RandomizedSearchCV, learning_curve)
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
from scipy.stats import randint, uniform

X, y = make_classification(n_samples=3000, n_features=15,
                            n_informative=8, weights=[0.88, 0.12],
                            random_state=42)

sc = StandardScaler()
X_s = sc.fit_transform(X)
skf = StratifiedKFold(5, shuffle=True, random_state=42)

# ── Model comparison ─────────────────────────────────────────────────────
models = {
    'Logistic Reg': LogisticRegression(class_weight='balanced', max_iter=500),
    'Random Forest': RandomForestClassifier(100, class_weight='balanced', n_jobs=-1),
    'Grad. Boosting': GradientBoostingClassifier(100, random_state=42),
}
rows = []
for name, m in models.items():
    res = cross_validate(m, X_s, y, cv=skf,
                         scoring=['roc_auc','average_precision'], n_jobs=-1)
    rows.append({'Model': name,
                 'AUC':    f"{res['test_roc_auc'].mean():.3f}",
                 'PR-AUC': f"{res['test_average_precision'].mean():.3f}"})
print(pd.DataFrame(rows).to_string(index=False))

# ── Learning curve for Random Forest ─────────────────────────────────────
sizes, tr, va = learning_curve(RandomForestClassifier(100, n_jobs=-1),
                                X_s, y, train_sizes=np.linspace(.1,1,8),
                                cv=skf, scoring='roc_auc', n_jobs=-1)
plt.plot(sizes, tr.mean(1), label='Train')
plt.plot(sizes, va.mean(1), label='CV')
plt.xlabel('Train size'); plt.ylabel('ROC AUC')
plt.title('Learning Curve — Random Forest'); plt.legend(); plt.show()`,
    quiz: {
      title: 'Model Evaluation & Validation Best Practices — Quiz',
      questions: [
        {
          text: 'Your model has 99% training accuracy and 72% test accuracy. What does this indicate?',
          options: opts(
            'The model is underfitting — it needs more features',
            'The model is overfitting (high variance) — it memorised training noise and does not generalise',
            'The test set is too small and results are unreliable',
            'The model needs to be retrained with more epochs'
          ),
          correctAnswer: 'b',
          explanation: 'A large train-test accuracy gap (99% vs 72%) is the classic overfitting signature — high variance. The model memorised training patterns that don\'t generalise. Remedies: regularisation, more data, simpler model, or dropout.',
          orderIndex: 1,
        },
        {
          text: 'What is the key difference between K-Fold CV and Nested CV?',
          options: opts(
            'K-Fold uses more folds than nested CV',
            'Nested CV uses an inner loop for hyperparameter tuning and an outer loop for performance estimation, giving an unbiased score. Plain K-Fold after tuning on the same data is optimistic.',
            'Nested CV is only valid for regression; K-Fold is for classification',
            'K-Fold CV is faster than nested CV but less accurate'
          ),
          correctAnswer: 'b',
          explanation: 'When you tune hyperparameters using K-Fold and evaluate on the same data, the estimate is biased because hyper-selection already "saw" the data. Nested CV\'s outer loop is invisible to the tuning process, giving a true out-of-sample estimate.',
          orderIndex: 2,
        },
        {
          text: 'Why must you use TimeSeriesSplit instead of standard K-Fold for time-series data?',
          options: opts(
            'TimeSeriesSplit is faster for large datasets',
            'Standard K-Fold shuffles data randomly, allowing the model to train on future data and test on past data — creating severe leakage. TimeSeriesSplit always trains on past and tests on future.',
            'Time series models cannot be evaluated with cross-validation at all',
            'K-Fold produces more folds and overfits time series models'
          ),
          correctAnswer: 'b',
          explanation: 'In time series, row order encodes causal direction — the past causes the future. K-Fold\'s random shuffling breaks this, letting models train on features from after the test period (leakage). TimeSeriesSplit strictly maintains temporal order.',
          orderIndex: 3,
        },
        {
          text: 'What does a learning curve where both train and validation RMSE are high (but close together) indicate?',
          options: opts(
            'The model is overfitting — add regularisation',
            'The model is underfitting (high bias) — it is too simple to capture the underlying patterns. Try a more complex model or adding features.',
            'The validation set is too small',
            'The learning rate is too high'
          ),
          correctAnswer: 'b',
          explanation: 'When both train and val errors are high but close, it\'s classic underfitting. The model has high bias — it\'s systematically wrong. The small train-val gap means it\'s not memorising training data; it just can\'t fit it at all.',
          orderIndex: 4,
        },
        {
          text: 'Why is RandomizedSearchCV preferred over GridSearchCV for large hyperparameter spaces?',
          options: opts(
            'RandomizedSearchCV always finds better hyperparameters',
            'GridSearchCV evaluates every combination — O(n_params^k) fits. RandomizedSearchCV samples n_iter combinations, exploring a much larger space with the same compute budget.',
            'GridSearchCV cannot handle continuous distributions',
            'RandomizedSearchCV requires fewer cross-validation folds'
          ),
          correctAnswer: 'b',
          explanation: 'If you have 5 hyperparameters each with 5 values, GridSearch = 5^5 = 3125 fits. RandomizedSearch with n_iter=50 evaluates 50 combinations — only 1.6% of the space — but research shows it finds near-optimal solutions efficiently because most hyperparameters have a "good region."',
          orderIndex: 5,
        },
        {
          text: 'What is the purpose of return_train_score=True in cross_validate()?',
          options: opts(
            'It returns the training data alongside the scores',
            'It computes and returns scores on the training folds as well, allowing you to measure the train-validation gap and diagnose overfitting',
            'It forces the model to be retrained after cross-validation',
            'It returns the score for every individual training sample'
          ),
          correctAnswer: 'b',
          explanation: 'By default cross_validate only returns validation scores. With return_train_score=True, you get both. A large train-val gap (e.g., train AUC 0.98 vs val AUC 0.74) immediately signals overfitting.',
          orderIndex: 6,
        },
        {
          text: 'Why should you save the scaler and model in the same joblib artefact rather than separately?',
          options: opts(
            'joblib can only save one object per file',
            'It guarantees the same scaler (fitted on training data) is always applied before inference — preventing the common bug of applying a different or unfitted scaler to new data',
            'Saving together reduces file size by 50%',
            'scikit-learn requires the scaler and model to be saved together'
          ),
          correctAnswer: 'b',
          explanation: 'A scaler fitted on different data (or not fitted at all) produces different transformations at inference time, silently corrupting predictions. Bundling scaler + model ensures the exact training-time transformation is reproduced at serving time.',
          orderIndex: 7,
        },
        {
          text: 'What does the gap parameter in TimeSeriesSplit(n_splits=5, gap=7) do?',
          options: opts(
            'It skips every 7th data point to reduce training time',
            'It excludes 7 samples between the end of the training fold and the start of the validation fold, preventing target leakage from nearby time points',
            'It pads each training fold with 7 additional days of data',
            'It sets the minimum training fold size to 7 samples'
          ),
          correctAnswer: 'b',
          explanation: 'In time series, features for time T might incorporate information from T+1 to T+7 (e.g., rolling windows computed at serving time). The gap creates a safety buffer between train and validation to prevent this leakage.',
          orderIndex: 8,
        },
        {
          text: 'After calling RandomizedSearchCV.fit(), how do you get predictions on new data?',
          options: opts(
            'Call rs.best_estimator_.predict(X_new) — or just rs.predict(X_new) since refit=True automatically makes the search object act as the best model',
            'Call rs.predict_all(X_new) to get predictions from all candidates',
            'Re-train the model manually with rs.best_params_',
            'Call rs.score(X_new, y_new) and convert the score to predictions'
          ),
          correctAnswer: 'a',
          explanation: 'With refit=True (the default), RandomizedSearchCV automatically re-trains the best model on the full training set and exposes predict/predict_proba directly. rs.best_estimator_ gives you the model object itself.',
          orderIndex: 9,
        },
        {
          text: 'What is "irreducible noise" in the bias-variance decomposition?',
          options: opts(
            'Noise introduced by poor feature engineering',
            'The inherent randomness in the data generating process that no model, no matter how complex, can eliminate — it is the lower bound on prediction error',
            'The noise from using too few training samples',
            'Numerical precision errors introduced by floating-point arithmetic'
          ),
          correctAnswer: 'b',
          explanation: 'Even a perfect model that knows the true data-generating process cannot eliminate irreducible noise — it is random variation in y not explained by x. Total error = Bias² + Variance + σ² (irreducible noise). The goal is to minimise Bias² + Variance while accepting σ².',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 20 — Sklearn Pipelines & Production ML Workflows
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-20-sklearn-pipelines',
    title:      'Sklearn Pipelines & Production ML Workflows',
    description:'Build end-to-end ML pipelines with sklearn Pipeline and ColumnTransformer, eliminate data leakage by design, integrate with cross-validation and GridSearch, and structure production-grade analytics code.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 120,
    xpReward:   120,
    language:   'python',
    content: `# Sklearn Pipelines & Production ML Workflows

## What You'll Learn
Notebooks are for exploration; pipelines are for production. A Pipeline chains all preprocessing and modelling steps into a single object that can be cross-validated, grid-searched, serialised, and deployed without manual step-tracking or leakage bugs. This is the difference between a data science prototype and production ML code.

---

## 1. The Problem Pipelines Solve

Without a Pipeline, you must manually apply each step in the right order — and re-apply them identically at inference time. Mistakes cause silent bugs:

\`\`\`python
# ❌ Manual approach — fragile, leakage-prone
scaler.fit(X_train)   # must remember this was fit on train only
X_train_s = scaler.transform(X_train)
X_test_s  = scaler.transform(X_test)   # easy to forget and fit on test by mistake
model.fit(X_train_s, y_train)
pred = model.predict(X_test_s)   # must remember the scaler step

# ✅ Pipeline approach — safe by design
from sklearn.pipeline import Pipeline
pipe = Pipeline([('scaler', StandardScaler()), ('model', LogisticRegression())])
pipe.fit(X_train, y_train)   # scaler is fit on X_train automatically
pred = pipe.predict(X_test)  # scaler is applied to X_test automatically
\`\`\`

The Pipeline **always fits transformers on training data and applies them to test data** — leakage is architecturally impossible.

---

## 2. Building a Simple Pipeline

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.impute import SimpleImputer

pipe = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),     # step 1: fill missing values
    ('scaler',  StandardScaler()),                     # step 2: standardise features
    ('classifier', LogisticRegression(max_iter=1000)), # step 3: classify
])

# Access individual steps
pipe['imputer']    # by name
pipe.steps[0][1]   # by index

# Fit and predict just like any model
pipe.fit(X_train, y_train)
proba = pipe.predict_proba(X_test)[:, 1]
\`\`\`

---

## 3. ColumnTransformer — Different Transforms per Column Type

Real data has mixed types: numerical features need scaling, categorical features need encoding, text needs TF-IDF. ColumnTransformer applies different transformations to different column subsets simultaneously.

\`\`\`python
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer, make_column_selector
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.ensemble import RandomForestClassifier

# Define column groups
num_cols  = ['age', 'tenure_days', 'spend_30d', 'logins_7d']
ord_cols  = ['plan']           # Free < Basic < Pro < Enterprise
nom_cols  = ['region', 'device']

# Sub-pipelines for each column type
num_pipe = make_pipeline(
    SimpleImputer(strategy='median'),
    StandardScaler()
)

ord_pipe = make_pipeline(
    SimpleImputer(strategy='most_frequent'),
    OrdinalEncoder(categories=[['Free','Basic','Pro','Enterprise']],
                   handle_unknown='use_encoded_value', unknown_value=-1)
)

nom_pipe = make_pipeline(
    SimpleImputer(strategy='most_frequent'),
    OneHotEncoder(sparse_output=False, handle_unknown='ignore', drop='first')
)

# Assemble ColumnTransformer
preprocessor = ColumnTransformer(transformers=[
    ('num', num_pipe, num_cols),
    ('ord', ord_pipe, ord_cols),
    ('nom', nom_pipe, nom_cols),
], remainder='drop')  # drop any column not listed above

# Full pipeline
full_pipe = Pipeline([
    ('pre',   preprocessor),
    ('model', RandomForestClassifier(n_estimators=200, class_weight='balanced',
                                      n_jobs=-1, random_state=42))
])

full_pipe.fit(X_train, y_train)
\`\`\`

---

## 4. Pipeline + CrossValidation + GridSearch

Because Pipeline wraps all steps, cross-validation applies the entire chain correctly on each fold — no leakage.

\`\`\`python
from sklearn.model_selection import GridSearchCV, StratifiedKFold

# Access model hyperparameters through the pipeline using double underscore
param_grid = {
    'pre__num__simpleimputer__strategy': ['mean', 'median'],
    'model__n_estimators':               [100, 200],
    'model__max_depth':                  [5, 8, None],
    'model__min_samples_leaf':           [5, 20],
}

gs = GridSearchCV(
    full_pipe,
    param_grid,
    cv=StratifiedKFold(5, shuffle=True, random_state=42),
    scoring='roc_auc',
    n_jobs=-1,
    refit=True,
    verbose=1
)
gs.fit(X_train, y_train)
print(f"Best params: {gs.best_params_}")
print(f"Best CV AUC: {gs.best_score_:.3f}")

# The best pipeline predicts directly on raw (un-preprocessed) data
raw_proba = gs.predict_proba(X_test_raw)[:, 1]
\`\`\`

**Naming convention:** step names in the parameter grid are joined with double underscores (\`__\`). E.g., \`model__n_estimators\` means \`step_name__param_name\`.

---

## 5. Custom Transformers

You can write your own sklearn-compatible transformer by subclassing \`BaseEstimator\` and \`TransformerMixin\`.

\`\`\`python
from sklearn.base import BaseEstimator, TransformerMixin

class DateFeatureExtractor(BaseEstimator, TransformerMixin):
    """Extracts year, month, dayofweek, is_weekend from a date column."""
    def __init__(self, date_col: str = 'date'):
        self.date_col = date_col

    def fit(self, X, y=None):
        return self   # stateless — nothing to learn

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X = X.copy()
        dt = pd.to_datetime(X[self.date_col])
        X['year']       = dt.dt.year
        X['month']      = dt.dt.month
        X['dayofweek']  = dt.dt.dayofweek
        X['is_weekend'] = (dt.dt.dayofweek >= 5).astype(int)
        X['month_sin']  = np.sin(2 * np.pi * dt.dt.month / 12)
        X['month_cos']  = np.cos(2 * np.pi * dt.dt.month / 12)
        return X.drop(columns=self.date_col)

# Drop into any pipeline
date_pipe = Pipeline([
    ('date_features', DateFeatureExtractor(date_col='signup_date')),
    ('num_pipe',      num_pipe),
    ('model',         RandomForestClassifier()),
])
\`\`\`

---

## 6. Saving and Loading a Pipeline

\`\`\`python
import joblib
from datetime import date

model_path = f'models/churn_pipeline_{date.today():%Y%m%d}.joblib'
joblib.dump(gs.best_estimator_, model_path)
print(f"Saved: {model_path}")

# At inference time — raw DataFrame, no manual preprocessing
loaded_pipe = joblib.load(model_path)
new_data = pd.read_csv('new_customers.csv')
probas    = loaded_pipe.predict_proba(new_data)[:, 1]
\`\`\`

---

## 7. Feature Importance from a Pipeline

\`\`\`python
import pandas as pd

# After fitting, get feature names from ColumnTransformer
feature_names = (
    num_cols +
    ord_cols +
    full_pipe.named_steps['pre']
        .named_transformers_['nom']
        .named_steps['onehotencoder']
        .get_feature_names_out(nom_cols).tolist()
)

importances = pd.Series(
    full_pipe.named_steps['model'].feature_importances_,
    index=feature_names
).sort_values(ascending=False)

print(importances.head(10))
\`\`\`

---

## 8. Production Pipeline Checklist

\`\`\`
✅ All preprocessing inside the Pipeline — no manual steps outside
✅ Fit only on training data (CV handles this automatically)
✅ handle_unknown='ignore' in OneHotEncoder (unseen categories at inference)
✅ handle_unknown='use_encoded_value' in OrdinalEncoder
✅ Stratified CV (StratifiedKFold) for classification
✅ TimeSeriesSplit for time-ordered data
✅ Saved pipeline artefact includes all preprocessing + model
✅ Input validation: check expected column names and types at inference
✅ Logging: record prediction timestamp, model version, input hash
✅ Monitoring: track prediction distributions for model drift
\`\`\`

---

## Key Takeaways

- **Pipeline = scaler + model as one object** — data leakage becomes architecturally impossible.
- **ColumnTransformer** applies different transforms to different column groups in one step — the correct way to handle mixed-type data.
- **Double underscore (\`__\`) notation** lets you tune hyperparameters of any pipeline step through GridSearchCV.
- **Custom transformers** (BaseEstimator + TransformerMixin) drop into any Pipeline and participate in cross-validation correctly.
- **Serialise the entire pipeline** with joblib — inference requires no manual preprocessing.
- A Pipeline combined with GridSearchCV and StratifiedKFold is the gold standard workflow for production ML.
`,
    codeExample: `import pandas as pd
import numpy as np
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import (StratifiedKFold, GridSearchCV,
                                     cross_val_score)
from sklearn.metrics import roc_auc_score

rng = np.random.default_rng(42)
n = 2000
df = pd.DataFrame({
    'tenure_days': rng.exponential(200, n).clip(1, 1000),
    'logins_7d':   rng.integers(0, 50, n).astype(float),
    'plan':        rng.choice(['Free','Basic','Pro','Enterprise'], n),
    'region':      rng.choice(['NA','EU','APAC'], n),
    'spend_30d':   np.abs(rng.normal(100, 80, n)),
    'churn':       rng.integers(0, 2, n),
})
# Sprinkle in some missing values (realistic)
for col in ['logins_7d','spend_30d']:
    df.loc[rng.choice(n, 50, replace=False), col] = np.nan

X = df.drop('churn', axis=1)
y = df['churn']
X_tr, X_te = X.iloc[:1600], X.iloc[1600:]
y_tr, y_te = y.iloc[:1600], y.iloc[1600:]

# ── Build pipeline ────────────────────────────────────────────────────
num_pipe = make_pipeline(SimpleImputer(strategy='median'), StandardScaler())
ord_pipe = make_pipeline(
    SimpleImputer(strategy='most_frequent'),
    OrdinalEncoder(categories=[['Free','Basic','Pro','Enterprise']],
                   handle_unknown='use_encoded_value', unknown_value=-1)
)
nom_pipe = make_pipeline(
    SimpleImputer(strategy='most_frequent'),
    OneHotEncoder(sparse_output=False, handle_unknown='ignore', drop='first')
)
pre = ColumnTransformer([
    ('num', num_pipe, ['tenure_days','logins_7d','spend_30d']),
    ('ord', ord_pipe, ['plan']),
    ('nom', nom_pipe, ['region']),
])
pipe = Pipeline([('pre', pre), ('clf', RandomForestClassifier(
    n_estimators=100, class_weight='balanced', random_state=42, n_jobs=-1
))])

# ── GridSearch through pipeline ───────────────────────────────────────
gs = GridSearchCV(pipe,
    {'clf__n_estimators': [100, 200], 'clf__max_depth': [5, 8]},
    cv=StratifiedKFold(4, shuffle=True, random_state=42),
    scoring='roc_auc', n_jobs=-1, refit=True)
gs.fit(X_tr, y_tr)

auc = roc_auc_score(y_te, gs.predict_proba(X_te)[:,1])
print(f"Best params: {gs.best_params_}")
print(f"Test AUC: {auc:.3f}")

# ── Save the entire pipeline ─────────────────────────────────────────
joblib.dump(gs.best_estimator_, 'churn_pipeline.joblib')
loaded = joblib.load('churn_pipeline.joblib')
print(f"Loaded pipeline AUC: {roc_auc_score(y_te, loaded.predict_proba(X_te)[:,1]):.3f}")`,
    quiz: {
      title: 'Sklearn Pipelines & Production ML Workflows — Quiz',
      questions: [
        {
          text: 'What is the primary benefit of wrapping preprocessing and a model in an sklearn Pipeline?',
          options: opts(
            'It makes the model train faster by parallelising steps',
            'Transformers are automatically fit on training data only and applied to test data — making data leakage architecturally impossible',
            'It enables the model to handle raw text and images natively',
            'It automatically tunes hyperparameters during fit()'
          ),
          correctAnswer: 'b',
          explanation: 'A Pipeline\'s fit() calls fit_transform() on each transformer using training data, then passes the result to the next step. At predict() time, it calls transform() only — never fit() again. Leakage is impossible by design.',
          orderIndex: 1,
        },
        {
          text: 'In a Pipeline with steps [("scaler", StandardScaler()), ("clf", RandomForestClassifier())], how do you set clf\'s n_estimators in GridSearchCV?',
          options: opts(
            'param_grid={"n_estimators": [100, 200]}',
            'param_grid={"clf__n_estimators": [100, 200]} using double underscore notation',
            'param_grid={"RandomForestClassifier__n_estimators": [100, 200]}',
            'param_grid={"clf.n_estimators": [100, 200]}'
          ),
          correctAnswer: 'b',
          explanation: 'GridSearchCV accesses Pipeline step hyperparameters using step_name__param_name with double underscore. This applies to any depth: pre__num__simpleimputer__strategy accesses the imputer inside a nested pipeline.',
          orderIndex: 2,
        },
        {
          text: 'What does ColumnTransformer(remainder="drop") do to columns not listed in any transformer?',
          options: opts(
            'It applies StandardScaler to all unlisted columns',
            'It silently drops all columns not explicitly listed in a transformer — useful to exclude ID columns or columns not needed by the model',
            'It raises an error if any column is unlisted',
            'It passes unlisted columns through to the model unchanged'
          ),
          correctAnswer: 'b',
          explanation: 'remainder="drop" (default) drops unlisted columns. remainder="passthrough" passes them through unchanged. Always explicitly set this to avoid accidentally including ID or datetime columns in the model input.',
          orderIndex: 3,
        },
        {
          text: 'Why is handle_unknown="ignore" important in OneHotEncoder when deployed to production?',
          options: opts(
            'It speeds up encoding by ignoring rare categories',
            'New data may contain categories not seen during training. "ignore" produces an all-zero row for unknown categories instead of raising an error — keeping the pipeline alive in production.',
            'It prevents one-hot encoding from creating sparse matrices',
            'It drops the first category automatically to avoid multicollinearity'
          ),
          correctAnswer: 'b',
          explanation: 'Production data often has new categories (a new region, a new product type) that didn\'t exist in training. Without handle_unknown="ignore", the encoder raises a ValueError and your pipeline crashes. "ignore" gracefully encodes unknowns as all zeros.',
          orderIndex: 4,
        },
        {
          text: 'What must a custom sklearn-compatible transformer\'s fit() method always return?',
          options: opts(
            'The transformed data X',
            'self — enabling method chaining (e.g., fit(X).transform(X))',
            'A fitted sklearn pipeline',
            'The learned parameters as a dictionary'
          ),
          correctAnswer: 'b',
          explanation: 'fit() must return self for sklearn compatibility and method chaining (transformer.fit(X_train).transform(X_test)). If you have nothing to learn, just return self immediately. transform() returns the transformed X.',
          orderIndex: 5,
        },
        {
          text: 'You serialise a full Pipeline with joblib.dump(). What does the saved file contain?',
          options: opts(
            'Only the model weights — preprocessing must be re-applied manually at inference',
            'The entire pipeline including fitted transformers (with their learned statistics) and the trained model — enough to run inference on raw data with no additional setup',
            'The Python source code of each pipeline step',
            'The training data used to fit the pipeline'
          ),
          correctAnswer: 'b',
          explanation: 'joblib serialises the entire Python object graph — including the fitted scaler\'s mean/std, encoder\'s category lists, and model weights. Loading gives you a complete, ready-to-use pipeline that preprocesses and predicts without any manual steps.',
          orderIndex: 6,
        },
        {
          text: 'In ColumnTransformer, what does make_pipeline(SimpleImputer(), StandardScaler()) define?',
          options: opts(
            'A standalone model that imputes and scales the entire DataFrame',
            'A sequential sub-pipeline: first impute missing values, then scale the imputed values — to be applied to a specific column subset',
            'A parallel transformer that applies both operations simultaneously',
            'A pipeline that returns summary statistics instead of transformed data'
          ),
          correctAnswer: 'b',
          explanation: 'make_pipeline() is a shorthand for Pipeline([("step1", transformer1), ("step2", transformer2), ...]). When used inside ColumnTransformer, it defines a sequential chain applied only to the specified columns.',
          orderIndex: 7,
        },
        {
          text: 'After fitting gs = GridSearchCV(pipe, ..., refit=True), how do you get predictions on new raw data?',
          options: opts(
            'Manually apply the scaler and encoder to new data, then call gs.best_estimator_.predict()',
            'Simply call gs.predict(new_raw_data) — refit=True makes the GridSearch object act as the best fitted pipeline',
            'Call gs.predict_all(new_raw_data) to aggregate predictions across all candidates',
            'Re-fit the pipeline with gs.best_params_ first, then predict'
          ),
          correctAnswer: 'b',
          explanation: 'With refit=True, GridSearchCV re-trains the best parameter combination on the full training set and exposes predict/predict_proba directly. You can call gs.predict(raw_df) — it will preprocess and predict in one call.',
          orderIndex: 8,
        },
        {
          text: 'What is model drift, and why is monitoring it important in production?',
          options: opts(
            'Drift is when the model file becomes corrupted over time',
            'Drift is when the statistical relationship between features and the target changes in production — the model\'s performance degrades without retraining because the real world has changed',
            'Drift is when training takes longer due to increasing data size',
            'Drift is a memory leak in the serving infrastructure'
          ),
          correctAnswer: 'b',
          explanation: 'Real-world data distributions change — customer behaviour shifts, products change, economic conditions evolve. A model trained six months ago may degrade silently. Monitoring prediction distribution, feature distributions, and business outcomes triggers retraining.',
          orderIndex: 9,
        },
        {
          text: 'Which combination represents the gold standard production ML workflow?',
          options: opts(
            'Manual scaling → train → predict → save model weights only',
            'ColumnTransformer + Pipeline + StratifiedKFold CV + GridSearchCV + joblib save of full pipeline',
            'Manual preprocessing in a for loop → train → pickle the model',
            'fit_transform on full dataset → train → train/test split for evaluation'
          ),
          correctAnswer: 'b',
          explanation: 'The gold standard: ColumnTransformer handles mixed types safely, Pipeline prevents leakage, StratifiedKFold preserves class balance in CV, GridSearchCV tunes within the pipeline, and joblib saves the complete artefact for leakage-free inference.',
          orderIndex: 10,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 4 (Chapters 16–20 — ML for Analysts)…');

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

  console.log('\n🎉  AMATEUR Block 4 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
