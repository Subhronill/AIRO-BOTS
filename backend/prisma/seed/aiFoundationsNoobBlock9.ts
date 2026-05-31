/**
 * aiFoundationsNoobBlock9.ts — NOOB Block 9 (Ch 41–45): Model Evaluation
 * Run: cd backend && npm run seed:af-noob-b9
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function q(text:string,options:{id:string;text:string}[],correctAnswer:string,explanation:string,orderIndex:number){return{text,options:JSON.stringify(options),correctAnswer,explanation,orderIndex};}
const COURSE_SLUG='foundations';

const CHAPTERS=[
  {slug:'af-noob-41-train-test-split',title:'Train / Validation / Test Split Strategies',description:'Proper data splitting — holdout, k-fold cross-validation, stratification, time series splits, and avoiding data leakage.',orderIndex:41,xpReward:65,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 41 — Train / Validation / Test Split Strategies

## The Fundamental Problem

We want to estimate how a model will perform on **new, unseen data**. If we evaluate on training data, we get optimistic (misleading) results.

## Holdout Split

Simple 80/20 or 70/15/15 split. Fast but depends on random state.

\`\`\`
All data → [Train 70%] [Validation 15%] [Test 15%]
\`\`\`

## K-Fold Cross-Validation

Split data into K folds. Train on K-1 folds, validate on 1. Repeat K times.

**Result:** K validation scores → more reliable estimate, uses all data.

## Stratified K-Fold

Preserves class proportions in each fold — crucial for **imbalanced datasets**.

## Time Series Split

For temporal data, always keep chronological order:
- Train on past, validate on future
- **Never** shuffle time series data!

## Leave-One-Out (LOO)

K = n — each sample is test set once. Expensive but nearly unbiased.

## Nested Cross-Validation

For hyperparameter tuning + fair evaluation:
\`\`\`
Outer loop: estimate generalisation error
Inner loop: select hyperparameters
\`\`\``,
  codeExample:`import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import (
    train_test_split, KFold, StratifiedKFold,
    TimeSeriesSplit, cross_val_score, LeaveOneOut
)
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
X, y = make_classification(n_samples=300, n_features=10,
                            weights=[0.7, 0.3], random_state=42)

# === 1. Holdout ===
print("=== Holdout Split ===")
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2,
                                           stratify=y, random_state=42)
print(f"Train: {X_tr.shape[0]}  Test: {X_te.shape[0]}")
print(f"Class dist (train): {np.bincount(y_tr)/len(y_tr).round(3)}")

# === 2. K-Fold ===
print("\n=== 5-Fold Cross-Validation ===")
model = LogisticRegression(max_iter=500)
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scaler = StandardScaler()
scores = []
for fold, (tr_idx, val_idx) in enumerate(kf.split(X)):
    X_tr_f = scaler.fit_transform(X[tr_idx])
    X_val_f = scaler.transform(X[val_idx])
    model.fit(X_tr_f, y[tr_idx])
    acc = model.score(X_val_f, y[val_idx])
    scores.append(acc)
    print(f"  Fold {fold+1}: {acc:.4f}")
print(f"Mean: {np.mean(scores):.4f} ± {np.std(scores):.4f}")

# === 3. Stratified K-Fold ===
print("\n=== Stratified 5-Fold (class proportions preserved) ===")
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
s_scores = []
for tr_idx, val_idx in skf.split(X, y):
    X_tr_f = scaler.fit_transform(X[tr_idx])
    X_val_f = scaler.transform(X[val_idx])
    model.fit(X_tr_f, y[tr_idx])
    s_scores.append(model.score(X_val_f, y[val_idx]))
    # Check stratification
print(f"Mean: {np.mean(s_scores):.4f} ± {np.std(s_scores):.4f}")

# === 4. Time Series Split ===
print("\n=== Time Series Cross-Validation ===")
X_ts = np.random.randn(100, 5)
y_ts = np.random.randint(0, 2, 100)
tss = TimeSeriesSplit(n_splits=5)
for fold, (tr_idx, val_idx) in enumerate(tss.split(X_ts)):
    print(f"  Fold {fold+1}: train=[{tr_idx[0]}-{tr_idx[-1]}] val=[{val_idx[0]}-{val_idx[-1]}]")`,
  questions:[
    q('Why is it wrong to evaluate a model on its training data?',[{id:'a',text:'It takes too long'},{id:'b',text:'The model has memorised training data — evaluation would be optimistically biased'},{id:'c',text:'Training data is always noisy'},{id:'d',text:'The model changes during evaluation'}],'b','Evaluating on train data measures memorisation, not generalisation — always use held-out data.',0),
    q('K-Fold cross-validation with K=5 trains:',[{id:'a',text:'One model on all data'},{id:'b',text:'5 models, each on 80% of the data, validated on the remaining 20%'},{id:'c',text:'5 models, each on different hyperparameters'},{id:'d',text:'One model per class'}],'b','5-fold: data is split into 5 parts; each is used as validation once while 4 others train the model.',1),
    q('Stratified K-Fold is important when:',[{id:'a',text:'Features have different scales'},{id:'b',text:'The dataset is imbalanced — ensures each fold has the same class proportions'},{id:'c',text:'The dataset is very large'},{id:'d',text:'Using regression'}],'b','Stratification preserves the target class distribution in every fold — crucial for imbalanced classes.',2),
    q('For time series data, the correct splitting approach is:',[{id:'a',text:'Random shuffle and split'},{id:'b',text:'K-Fold with shuffling'},{id:'c',text:'Chronological split — always train on past, validate on future'},{id:'d',text:'Leave-one-out'}],'c','Time series cannot be shuffled — using future data to train and past to test would be data leakage.',3),
    q('Data leakage occurs when:',[{id:'a',text:'You use too many features'},{id:'b',text:'Information from the test/future period contaminates the training process'},{id:'c',text:'You train for too many epochs'},{id:'d',text:'The model is too complex'}],'b','Leakage (e.g., fitting a scaler on test data) makes training performance falsely optimistic.',4),
    q('Leave-One-Out Cross-Validation (LOO):',[{id:'a',text:'Uses one sample for training and the rest for testing'},{id:'b',text:'Uses one sample as the test set and trains on the rest — repeated n times'},{id:'c',text:'Leaves out one feature at a time'},{id:'d',text:'Runs K=2 cross-validation'}],'b','LOO = KFold with K=n — computationally expensive but nearly unbiased estimate.',5),
    q('The test set in a 70/15/15 split should be:',[{id:'a',text:'Used multiple times to compare models'},{id:'b',text:'Used once at the very end for final model evaluation'},{id:'c',text:'Part of the validation set'},{id:'d',text:'The largest split'}],'b','The test set is the sacred final judge — touching it multiple times inflates reported performance.',6),
    q('Cross-validation gives a more reliable estimate than single holdout because:',[{id:'a',text:'It uses more data for testing'},{id:'b',text:'It averages over K different train/val splits — reducing dependency on a single random split'},{id:'c',text:'It is faster'},{id:'d',text:'It prevents overfitting'}],'b','K-fold estimates performance across K splits — much less variance than a single lucky or unlucky split.',7),
    q('Nested cross-validation is used for:',[{id:'a',text:'Feature scaling'},{id:'b',text:'Hyperparameter tuning + unbiased generalisation error estimation simultaneously'},{id:'c',text:'Data augmentation'},{id:'d',text:'Ensemble methods'}],'b','Nested CV: outer loop estimates generalisation, inner loop tunes hyperparameters — avoids optimistic bias.',8),
    q('Why should you shuffle data before K-fold?',[{id:'a',text:'To increase training speed'},{id:'b',text:'To remove class ordering bias — data may be sorted by class in its original form'},{id:'c',text:'To increase the number of folds'},{id:'d',text:'Shuffling is never recommended'}],'b','Without shuffling, folds may contain only one class if data is class-sorted — stratify and/or shuffle.',9),
  ]},

  {slug:'af-noob-42-classification-metrics',title:'Classification Metrics',description:'Accuracy, precision, recall, F1-score, ROC-AUC, confusion matrix — choosing the right metric for your problem.',orderIndex:42,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 42 — Classification Metrics

## Confusion Matrix

$$\\begin{bmatrix} TN & FP \\\\ FN & TP \\end{bmatrix}$$

- **TP** True Positive — correctly predicted positive
- **TN** True Negative — correctly predicted negative
- **FP** False Positive (Type I) — predicted positive, actually negative
- **FN** False Negative (Type II) — predicted negative, actually positive

## Core Metrics

| Metric | Formula | High means |
|--------|---------|-----------|
| Accuracy | (TP+TN)/(TP+TN+FP+FN) | Overall correctness |
| Precision | TP/(TP+FP) | Few false alarms |
| Recall | TP/(TP+FN) | Few missed positives |
| F1-score | 2·P·R/(P+R) | Balance of P and R |
| Specificity | TN/(TN+FP) | Few false alarms on negatives |

## When to Use Which Metric

| Scenario | Preferred Metric |
|---------|-----------------|
| Spam detection | Precision (FP=annoying) |
| Cancer screening | Recall (FN=dangerous) |
| Balanced classes | Accuracy |
| Imbalanced classes | F1, AUC-ROC, PR-AUC |

## ROC Curve & AUC

ROC plots TPR vs FPR at all decision thresholds.
AUC = area under ROC = probability model ranks positive above negative.

## PR Curve

Precision vs Recall — better for **highly imbalanced** datasets where negatives dominate.`,
  codeExample:`import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    confusion_matrix, accuracy_score, precision_score,
    recall_score, f1_score, roc_auc_score,
    classification_report, average_precision_score
)
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
X, y = make_classification(n_samples=1000, n_features=10,
                            weights=[0.85, 0.15], random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
sc = StandardScaler()
X_tr_s = sc.fit_transform(X_tr)
X_te_s = sc.transform(X_te)

model = LogisticRegression(max_iter=1000)
model.fit(X_tr_s, y_tr)
y_pred  = model.predict(X_te_s)
y_proba = model.predict_proba(X_te_s)[:,1]

print("=== Confusion Matrix ===")
cm = confusion_matrix(y_te, y_pred)
tn, fp, fn, tp = cm.ravel()
print(f"  TN={tn:3d}  FP={fp:3d}")
print(f"  FN={fn:3d}  TP={tp:3d}")

print("\n=== Classification Metrics ===")
metrics = {
    'Accuracy' :  accuracy_score(y_te, y_pred),
    'Precision':  precision_score(y_te, y_pred),
    'Recall'   :  recall_score(y_te, y_pred),
    'F1-Score' :  f1_score(y_te, y_pred),
    'AUC-ROC'  :  roc_auc_score(y_te, y_proba),
    'PR-AUC'   :  average_precision_score(y_te, y_proba),
}
for name, val in metrics.items():
    print(f"  {name:12s}: {val:.4f}")

print("\n=== Classification Report ===")
print(classification_report(y_te, y_pred, target_names=['Negative','Positive']))

# === Effect of threshold ===
print("\n=== Threshold Effect (precision-recall trade-off) ===")
print(f"{'Threshold':>10} | {'Precision':>10} | {'Recall':>8} | {'F1':>6}")
for thresh in [0.2, 0.3, 0.5, 0.7, 0.8]:
    y_pred_t = (y_proba >= thresh).astype(int)
    p = precision_score(y_te, y_pred_t, zero_division=0)
    r = recall_score(y_te, y_pred_t, zero_division=0)
    f = f1_score(y_te, y_pred_t, zero_division=0)
    print(f"{thresh:10.1f} | {p:10.4f} | {r:8.4f} | {f:6.4f}")`,
  questions:[
    q('Which cells form a confusion matrix?',[{id:'a',text:'Mean, median, mode, std'},{id:'b',text:'TP, FP, FN, TN'},{id:'c',text:'Precision, Recall, F1, Accuracy'},{id:'d',text:'Train error, test error, bias, variance'}],'b','Confusion matrix: 2×2 table of TP, TN, FP, FN for binary classification.',0),
    q('Recall (sensitivity) is:',[{id:'a',text:'TP/(TP+FP)'},{id:'b',text:'TP/(TP+FN) — fraction of actual positives correctly identified'},{id:'c',text:'(TP+TN)/total'},{id:'d',text:'TN/(TN+FP)'}],'b','Recall = TP/(TP+FN) — "of all actual positives, how many did we catch?"',1),
    q('Precision is:',[{id:'a',text:'TP/(TP+FN)'},{id:'b',text:'TP/(TP+FP) — fraction of predicted positives that are actually positive'},{id:'c',text:'(TP+TN)/total'},{id:'d',text:'2·TP/(2·TP+FP+FN)'}],'b','Precision = TP/(TP+FP) — "of all predictions of positive, how many were correct?"',2),
    q('For cancer screening, which metric should be prioritised?',[{id:'a',text:'Precision — avoid false alarms'},{id:'b',text:'Accuracy — overall correctness'},{id:'c',text:'Recall — minimise missed cancers (false negatives)'},{id:'d',text:'Specificity — correctly identify healthy patients'}],'c','Missed cancers (FN) are life-threatening — high recall is critical even at the cost of more false alarms.',3),
    q('F1-score is:',[{id:'a',text:'Arithmetic mean of precision and recall'},{id:'b',text:'Harmonic mean of precision and recall: 2·P·R/(P+R)'},{id:'c',text:'Geometric mean of precision and recall'},{id:'d',text:'Max of precision and recall'}],'b','F1 = harmonic mean — weighted toward the lower value, balancing P and R.',4),
    q('AUC-ROC = 0.5 means:',[{id:'a',text:'Perfect classifier'},{id:'b',text:'Random classifier — no discriminative ability'},{id:'c',text:'All predictions are positive'},{id:'d',text:'50% accuracy'}],'b','AUC=0.5 → the model is no better than random guessing. AUC=1.0 is perfect.',5),
    q('Increasing the classification threshold (e.g., from 0.5 to 0.8) will:',[{id:'a',text:'Increase recall and decrease precision'},{id:'b',text:'Increase precision and decrease recall'},{id:'c',text:'Increase both precision and recall'},{id:'d',text:'Have no effect on predictions'}],'b','Higher threshold → fewer positive predictions → fewer FP (↑precision) but more FN (↓recall).',6),
    q('For highly imbalanced data (99% negative), accuracy of 99% indicates:',[{id:'a',text:'Excellent model performance'},{id:'b',text:'The model likely predicts all negatives — accuracy is misleading'},{id:'c',text:'Perfect recall'},{id:'d',text:'High F1-score'}],'b','A model that predicts "negative" always gets 99% accuracy but finds zero positives — useless.',7),
    q('PR-AUC (Precision-Recall AUC) is preferred over ROC-AUC when:',[{id:'a',text:'Classes are balanced'},{id:'b',text:'The dataset is highly imbalanced and positives are rare'},{id:'c',text:'The dataset is very large'},{id:'d',text:'You are doing regression'}],'b','ROC-AUC can be misleadingly high with imbalanced data — PR curve focuses only on the positive class.',8),
    q('The ROC curve plots:',[{id:'a',text:'Precision vs Recall'},{id:'b',text:'True Positive Rate (Recall) vs False Positive Rate at various thresholds'},{id:'c',text:'Loss vs epochs'},{id:'d',text:'Accuracy vs threshold'}],'b','ROC: TPR = TP/(TP+FN) on Y-axis, FPR = FP/(FP+TN) on X-axis, at all decision thresholds.',9),
  ]},

  {slug:'af-noob-43-regression-metrics',title:'Regression Metrics & Model Evaluation',description:'MAE, MSE, RMSE, R², MAPE — measuring regression model quality and diagnosing errors with residual analysis.',orderIndex:43,xpReward:65,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 43 — Regression Metrics & Model Evaluation

## Core Regression Metrics

| Metric | Formula | Notes |
|--------|---------|-------|
| MAE | mean(|ŷ-y|) | Same units as y, robust |
| MSE | mean((ŷ-y)²) | Penalises large errors |
| RMSE | √MSE | Same units as y |
| R² | 1 - SS_res/SS_tot | 0–1, higher is better |
| Adjusted R² | R² penalised for # features | For multiple features |
| MAPE | mean(|ŷ-y|/y)×100 | % error, scale-free |

## R² Interpretation

- R² = 1 → perfect predictions
- R² = 0 → model = constant mean
- R² < 0 → model is worse than mean (bad)

## Residual Analysis

Residuals = actual - predicted. A good model has:
- **Zero mean** residuals
- **No pattern** (random scatter)
- **Normal distribution**
- **Constant variance** (homoscedasticity)

## Adjusted R²

Penalises for adding useless features:

$$\\bar{R}^2 = 1 - (1-R^2)\\frac{n-1}{n-p-1}$$

where p = number of predictors.`,
  codeExample:`import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

np.random.seed(42)

# True relationship: y = 2x₁ - x₂ + 5 + noise
n = 200
X = np.random.randn(n, 3)
y = 2*X[:,0] - X[:,1] + 5 + np.random.randn(n)*2

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_tr, y_tr)
y_pred = model.predict(X_te)
residuals = y_te - y_pred

print("=== Regression Metrics ===")
mae  = mean_absolute_error(y_te, y_pred)
mse  = mean_squared_error(y_te, y_pred)
rmse = np.sqrt(mse)
r2   = r2_score(y_te, y_pred)

# Adjusted R²
n_test, p = len(y_te), X_te.shape[1]
r2_adj = 1 - (1 - r2) * (n_test - 1) / (n_test - p - 1)

# MAPE (avoid div by zero)
mask = y_te != 0
mape = np.mean(np.abs((y_te[mask] - y_pred[mask]) / y_te[mask])) * 100

print(f"  MAE         : {mae:.4f}")
print(f"  MSE         : {mse:.4f}")
print(f"  RMSE        : {rmse:.4f}")
print(f"  R²          : {r2:.4f}")
print(f"  Adjusted R² : {r2_adj:.4f}")
print(f"  MAPE        : {mape:.2f}%")

print("\n=== Residual Analysis ===")
print(f"  Mean residual  : {residuals.mean():.4f}  (should be ≈ 0)")
print(f"  Std residual   : {residuals.std():.4f}")
print(f"  Min/Max residual: {residuals.min():.3f} / {residuals.max():.3f}")

# Histogram of residuals
bins = np.linspace(residuals.min(), residuals.max(), 10)
hist, edges = np.histogram(residuals, bins=bins)
print("\n  Residual distribution:")
for count, left in zip(hist, edges[:-1]):
    print(f"    [{left:6.2f}]: {'#'*count}")

# === Comparing models ===
print("\n=== Model Comparison ===")
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

models = {
    'Linear Regression': LinearRegression(),
    'Decision Tree':     DecisionTreeRegressor(max_depth=5, random_state=42),
    'Random Forest':     RandomForestRegressor(n_estimators=50, random_state=42),
}
for name, m in models.items():
    m.fit(X_tr, y_tr)
    yp = m.predict(X_te)
    print(f"  {name:20s}: RMSE={np.sqrt(mean_squared_error(y_te,yp)):.4f}  R²={r2_score(y_te,yp):.4f}")`,
  questions:[
    q('Which metric has the same units as the target variable?',[{id:'a',text:'MSE'},{id:'b',text:'R²'},{id:'c',text:'RMSE'},{id:'d',text:'R² and RMSE'}],'c','RMSE = √MSE — by taking the square root, we restore the original units of y.',0),
    q('R² = 0 means:',[{id:'a',text:'The model makes no errors'},{id:'b',text:'The model predicts the mean of y for all inputs — no better than a baseline'},{id:'c',text:'The model is overfitting'},{id:'d',text:'RMSE = 0'}],'b','R²=0: SS_res = SS_tot → model only explains as much as the mean. Negative R² is even worse.',1),
    q('MAE is preferred over MSE when:',[{id:'a',text:'You want to penalise large errors more heavily'},{id:'b',text:'Outliers are common and you want robustness'},{id:'c',text:'Your data is normally distributed'},{id:'d',text:'You are doing classification'}],'b','MAE is the average absolute error — not squared, so outliers don\'t disproportionately inflate it.',2),
    q('MAPE (Mean Absolute Percentage Error) is:',[{id:'a',text:'Mean of squared errors in percentage'},{id:'b',text:'Scale-free metric — percentage error relative to actual values'},{id:'c',text:'Mean absolute error divided by n'},{id:'d',text:'The same as RMSE'}],'b','MAPE = mean(|ŷ-y|/|y|)×100 — gives error as a percentage, comparable across different scales.',3),
    q('Residuals should have what property for a well-fitted model?',[{id:'a',text:'Increasing with predicted values'},{id:'b',text:'Random scatter with zero mean and constant variance'},{id:'c',text:'Perfectly normal distribution'},{id:'d',text:'All positive values'}],'b','Random, zero-mean residuals indicate all systematic patterns were captured by the model.',4),
    q('Adjusted R² is better than R² when:',[{id:'a',text:'The dataset is small'},{id:'b',text:'Comparing models with different numbers of features — penalises adding useless predictors'},{id:'c',text:'The model is non-linear'},{id:'d',text:'R² is negative'}],'b','R² always increases when features are added. Adjusted R² penalises for extra useless features.',5),
    q('MSE penalises large errors more than MAE because:',[{id:'a',text:'MSE uses absolute values'},{id:'b',text:'Squaring amplifies large deviations — a 10x error gives 100x MSE penalty vs 10x MAE penalty'},{id:'c',text:'MSE sums all errors'},{id:'d',text:'MSE ignores small errors'}],'b','Squaring makes MSE sensitive to outliers — (10)²=100 vs |10|=10.',6),
    q('Heteroscedastic residuals indicate:',[{id:'a',text:'The model has a perfect fit'},{id:'b',text:'The variance of errors changes with the predicted value — a model assumption violation'},{id:'c',text:'The model needs more features'},{id:'d',text:'The data has no outliers'}],'b','Heteroscedasticity means residual spread is non-constant — OLS assumptions are violated.',7),
    q('For predicting house prices (in millions), RMSE=0.05 means:',[{id:'a',text:'The model is 5% accurate'},{id:'b',text:'Average prediction error is $50,000 (0.05 million)'},{id:'c',text:'R²=0.95'},{id:'d',text:'5 predictions are wrong'}],'b','RMSE is in the same units as the target — 0.05 million = $50,000 average error.',8),
    q('Which diagnostic plot checks for non-linearity in regression?',[{id:'a',text:'Confusion matrix'},{id:'b',text:'Residuals vs Fitted values — patterns indicate unexplained structure'},{id:'c',text:'ROC curve'},{id:'d',text:'Feature importance bar chart'}],'b','A curved pattern in residuals vs fitted values indicates the linear model is missing non-linear structure.',9),
  ]},

  {slug:'af-noob-44-bias-variance',title:'Bias-Variance Tradeoff',description:'Decomposing model error into bias and variance — understanding underfitting, overfitting, and how regularisation and model complexity help.',orderIndex:44,xpReward:75,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 44 — Bias-Variance Tradeoff

## The Decomposition

For any model, the expected error on unseen data is:

$$\\text{Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Noise}$$

| Term | Meaning | Cause |
|------|---------|-------|
| Bias² | Systematic error — model too simple | Underfitting |
| Variance | Sensitivity to training data fluctuations | Overfitting |
| Noise | Inherent randomness in data | Irreducible |

## Underfitting (High Bias)

- Model is too simple to capture true patterns
- High train error AND high test error
- Fix: more complex model, more features

## Overfitting (High Variance)

- Model memorises training data including noise
- Low train error, HIGH test error
- Fix: more data, regularisation, simpler model, dropout

## The Sweet Spot

Model complexity ↑ → Bias ↓, Variance ↑

**Bias-Variance sweet spot = optimal complexity that minimises total error**

## Learning Curves

Plot train/validation error vs training set size:
- Large gap between curves → overfitting (high variance)
- Both curves high → underfitting (high bias)
- Curves converge low → good fit`,
  codeExample:`import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.model_selection import learning_curve
from sklearn.tree import DecisionTreeRegressor

np.random.seed(42)

# True function: y = sin(x) + noise
X = np.sort(np.random.uniform(0, 2*np.pi, 100)).reshape(-1, 1)
y = np.sin(X.ravel()) + np.random.randn(100) * 0.3

X_train, y_train = X[:70], y[:70]
X_test,  y_test  = X[70:], y[70:]

print("=== Bias-Variance via Polynomial Degree ===")
print(f"{'Degree':>6} | {'Train MSE':>10} | {'Test MSE':>10} | {'Diagnosis':>15}")
print("-"*50)
for deg in [1, 2, 3, 5, 10, 20]:
    pipe = Pipeline([('poly', PolynomialFeatures(deg)), ('lr', LinearRegression())])
    pipe.fit(X_train, y_train)
    tr_mse = np.mean((pipe.predict(X_train) - y_train)**2)
    te_mse = np.mean((pipe.predict(X_test)  - y_test)**2)
    if tr_mse > 0.15:
        diag = 'Underfitting'
    elif te_mse > tr_mse * 2:
        diag = 'Overfitting'
    else:
        diag = 'Good fit'
    print(f"{deg:6d} | {tr_mse:10.4f} | {te_mse:10.4f} | {diag:>15}")

# === Learning curves ===
print("\n=== Learning Curves (Decision Tree depth=1 vs depth=10) ===")
for depth, label in [(1,'Underfit (depth=1)'), (10,'Overfit (depth=10)')]:
    model = DecisionTreeRegressor(max_depth=depth, random_state=42)
    sizes, tr_scores, val_scores = learning_curve(
        model, X, y, train_sizes=np.linspace(0.1,1.0,5),
        cv=5, scoring='neg_mean_squared_error', random_state=42)
    tr_mse  = -tr_scores.mean(axis=1)
    val_mse = -val_scores.mean(axis=1)
    print(f"\n{label}:")
    for sz, tr, val in zip(sizes, tr_mse, val_mse):
        print(f"  n={sz:3d}: train_MSE={tr:.4f}  val_MSE={val:.4f}")`,
  questions:[
    q('High bias in a model indicates:',[{id:'a',text:'Overfitting'},{id:'b',text:'The model is too simple — underfitting, systematic errors on training data'},{id:'c',text:'Too many features'},{id:'d',text:'Small training set'}],'b','High bias = underfitting — the model misses systematic patterns in the data.',0),
    q('High variance in a model indicates:',[{id:'a',text:'Underfitting'},{id:'b',text:'The model is too sensitive to training data — overfitting, poor generalisation'},{id:'c',text:'Too few features'},{id:'d',text:'Large irreducible noise'}],'b','High variance = overfitting — model memorises training noise and fails on new data.',1),
    q('A model with low train error but high test error has:',[{id:'a',text:'High bias'},{id:'b',text:'Low variance'},{id:'c',text:'High variance (overfitting)'},{id:'d',text:'Balanced bias-variance'}],'c','Low train, high test error = large train-test gap = overfitting = high variance.',2),
    q('Which fixes overfitting?',[{id:'a',text:'More complex model'},{id:'b',text:'Fewer training samples'},{id:'c',text:'Regularisation, dropout, early stopping, or more training data'},{id:'d',text:'Higher learning rate'}],'c','Overfitting (high variance) is reduced by regularisation, more data, simpler model, or dropout.',3),
    q('Which fixes underfitting?',[{id:'a',text:'More regularisation'},{id:'b',text:'More complex model, more features, less regularisation'},{id:'c',text:'Smaller training set'},{id:'d',text:'Lower learning rate'}],'b','Underfitting (high bias) = model too simple → increase complexity, add features.',4),
    q('Irreducible noise in the bias-variance decomposition is:',[{id:'a',text:'Caused by the model architecture'},{id:'b',text:'Inherent data randomness that no model can eliminate'},{id:'c',text:'Eliminated by regularisation'},{id:'d',text:'The same as bias'}],'b','Noise in the data-generating process is irreducible — even a perfect model would have this error.',5),
    q('As polynomial degree increases (in polynomial regression):',[{id:'a',text:'Bias increases, variance decreases'},{id:'b',text:'Bias decreases, variance increases'},{id:'c',text:'Both decrease'},{id:'d',text:'Neither changes'}],'b','Higher complexity → lower bias (fits data better) but higher variance (sensitive to training noise).',6),
    q('In a learning curve, if train and val errors are both high:',[{id:'a',text:'Overfitting'},{id:'b',text:'Underfitting — model lacks capacity'},{id:'c',text:'Good fit'},{id:'d',text:'Data leakage'}],'b','Both curves high and converged = high bias = underfitting. More data won\'t help — increase model complexity.',7),
    q('Regularisation (L1/L2) reduces variance by:',[{id:'a',text:'Adding more features'},{id:'b',text:'Constraining weight magnitudes — preventing over-reliance on any single feature'},{id:'c',text:'Increasing learning rate'},{id:'d',text:'Adding more training data'}],'b','Regularisation penalises large weights — limits model complexity and reduces overfitting.',8),
    q('The sweet spot in the bias-variance tradeoff is:',[{id:'a',text:'Minimum training error regardless of test error'},{id:'b',text:'Optimal complexity that minimises total generalisation error (bias² + variance)'},{id:'c',text:'Maximum model complexity'},{id:'d',text:'Zero regularisation'}],'b','The optimal model has balanced complexity — minimising the sum of squared bias and variance.',9),
  ]},

  {slug:'af-noob-45-regularisation',title:'Regularisation Techniques',description:'L1 (Lasso), L2 (Ridge), Elastic Net, dropout, early stopping, and data augmentation — preventing overfitting in ML and deep learning.',orderIndex:45,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 45 — Regularisation Techniques

## What is Regularisation?

Adding a penalty to the loss function to discourage model complexity:

$$L_{\\text{reg}} = L_{\\text{data}} + \\lambda \\cdot \\Omega(\\theta)$$

## L2 Regularisation (Ridge)

$$\\Omega = \\|\\mathbf{w}\\|_2^2 = \\sum w_i^2$$

Shrinks all weights toward zero, none exactly zero. Good for **multicollinearity**.

## L1 Regularisation (Lasso)

$$\\Omega = \\|\\mathbf{w}\\|_1 = \\sum |w_i|$$

Drives some weights to **exactly zero** → automatic feature selection.

## Elastic Net

Combination: α·L1 + (1-α)·L2.

## Dropout (Deep Learning)

Randomly sets neuron activations to zero during training (p=0.2–0.5).
Forces redundant representations — reduces co-adaptation.

## Early Stopping

Monitor validation loss; stop training when it starts increasing.
Implicitly regularises by limiting weight update steps.

## Data Augmentation

Create new training examples by transforming existing ones (flips, rotations, crops for images; paraphrasing for text).`,
  codeExample:`import numpy as np
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.datasets import make_regression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score

np.random.seed(42)

# Generate data with many features, some irrelevant
X, y, true_coef = make_regression(n_samples=200, n_features=20,
                                   n_informative=5, noise=10,
                                   coef=True, random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
sc = StandardScaler()
X_tr_s = sc.fit_transform(X_tr)
X_te_s  = sc.transform(X_te)

print("=== Regularisation Comparison (20 features, 5 informative) ===")
print(f"{'Model':15} | {'α':>5} | {'Test R²':>8} | {'NonZero Coef':>12}")
print("-"*48)

models = [
    ('OLS',        LinearRegression(),        None),
    ('Ridge α=0.1',Ridge(alpha=0.1),          0.1),
    ('Ridge α=10', Ridge(alpha=10),           10),
    ('Ridge α=100',Ridge(alpha=100),          100),
    ('Lasso α=0.1',Lasso(alpha=0.1),          0.1),
    ('Lasso α=1',  Lasso(alpha=1.0),          1.0),
    ('ElasticNet', ElasticNet(alpha=0.1, l1_ratio=0.5), 0.1),
]

for name, model, alpha in models:
    model.fit(X_tr_s, y_tr)
    r2 = r2_score(y_te, model.predict(X_te_s))
    nonzero = np.sum(np.abs(model.coef_) > 0.01)
    print(f"{name:15} | {str(alpha):>5} | {r2:8.4f} | {nonzero:12d}")

# === Early Stopping Simulation ===
print("\n=== Early Stopping Simulation ===")
np.random.seed(0)
train_losses = []
val_losses   = []
best_val_loss = np.inf
patience, wait = 5, 0

# Simulate training curve
for epoch in range(50):
    # Typical overfit: train goes down, val goes down then up
    tr_loss  = 1.0 * np.exp(-0.08*epoch) + 0.05*np.random.rand()
    val_loss = 0.9 * np.exp(-0.08*epoch) + 0.3*(1 - np.exp(-0.02*(epoch-20)**2 * (epoch>20))) + 0.05*np.random.rand()
    train_losses.append(tr_loss)
    val_losses.append(val_loss)

    if val_loss < best_val_loss - 0.001:
        best_val_loss = val_loss
        best_epoch = epoch
        wait = 0
    else:
        wait += 1
    if wait >= patience:
        print(f"  Early stop at epoch {epoch+1}! Best val_loss={best_val_loss:.4f} at epoch {best_epoch+1}")
        break`,
  questions:[
    q('L2 regularisation adds which penalty to the loss?',[{id:'a',text:'Sum of |wᵢ|'},{id:'b',text:'Sum of wᵢ²'},{id:'c',text:'Max weight value'},{id:'d',text:'Number of features'}],'b','L2 (Ridge) penalty = λ·Σwᵢ² — penalises large weights by their square.',0),
    q('L1 regularisation (Lasso) is unique because:',[{id:'a',text:'It uses squared weights'},{id:'b',text:'It can drive weights exactly to zero — performing automatic feature selection'},{id:'c',text:'It requires normalised features'},{id:'d',text:'It only works for deep learning'}],'b','The L1 penalty\'s geometry (diamond shape) creates sparse solutions with exact zeros.',1),
    q('When λ (regularisation strength) increases:',[{id:'a',text:'Bias decreases, variance increases'},{id:'b',text:'Bias increases, variance decreases'},{id:'c',text:'Both increase'},{id:'d',text:'Neither changes'}],'b','Stronger regularisation → more constrained model → higher bias but lower variance.',2),
    q('Dropout works by:',[{id:'a',text:'Removing features from the dataset'},{id:'b',text:'Randomly zeroing neuron outputs during training — forces robust feature learning'},{id:'c',text:'Reducing the learning rate'},{id:'d',text:'Removing entire layers'}],'b','Dropout prevents co-adaptation — neurons can\'t rely on specific others, forcing redundancy.',3),
    q('Early stopping prevents overfitting by:',[{id:'a',text:'Using L2 penalty on weights'},{id:'b',text:'Stopping training when validation loss stops improving'},{id:'c',text:'Reducing model complexity'},{id:'d',text:'Augmenting the training data'}],'b','Early stopping halts training before weights grow too large — implicitly limits model complexity.',4),
    q('Elastic Net combines:',[{id:'a',text:'Decision trees and neural networks'},{id:'b',text:'L1 and L2 penalties — gets feature selection from L1 and grouping from L2'},{id:'c',text:'Dropout and batch normalisation'},{id:'d',text:'Multiple datasets'}],'b','Elastic Net = α·L1 + (1-α)·L2 — useful when features are correlated.',5),
    q('In sklearn\'s Ridge, a larger alpha value means:',[{id:'a',text:'Less regularisation'},{id:'b',text:'More regularisation — weights are shrunk more strongly'},{id:'c',text:'Faster training'},{id:'d',text:'Feature selection'}],'b','Ridge alpha = λ regularisation strength — larger α → stronger shrinkage toward zero.',6),
    q('Data augmentation is most common for:',[{id:'a',text:'Tabular regression'},{id:'b',text:'Image and text tasks — creating new training examples by transforming existing ones'},{id:'c',text:'Time series forecasting'},{id:'d',text:'Clustering'}],'b','Augmentation (flips, crops, rotations for images; paraphrasing for text) increases effective dataset size.',7),
    q('In sklearn, Lasso with alpha=0 is equivalent to:',[{id:'a',text:'Ridge regression'},{id:'b',text:'Ordinary least squares (OLS)'},{id:'c',text:'Elastic Net'},{id:'d',text:'An empty model'}],'b','alpha=0 → no regularisation = OLS. alpha→∞ → all weights zero.',8),
    q('Batch Normalisation (used in deep learning) acts as a regulariser by:',[{id:'a',text:'Dropping neurons randomly'},{id:'b',text:'Normalising activations per mini-batch — reduces internal covariate shift and smooths gradients'},{id:'c',text:'Penalising large weights'},{id:'d',text:'Stopping training early'}],'b','BatchNorm normalises layer inputs, stabilising training and providing mild regularisation.',9),
  ]},
];

async function main(){
  const course=await prisma.course.findUnique({where:{slug:COURSE_SLUG}});
  if(!course) throw new Error(`Course "${COURSE_SLUG}" not found`);
  for(const ch of CHAPTERS){
    const existing=await prisma.chapter.findFirst({where:{courseId:course.id,slug:ch.slug}});
    if(existing){console.log(`⏭  Skip  ${ch.slug}`);continue;}
    const {questions,...chapterData}=ch;
    const chapter=await prisma.chapter.create({data:{...chapterData,courseId:course.id}});
    await prisma.quiz.create({data:{chapterId:chapter.id,title:`${ch.title} Quiz`,description:`Test your knowledge of ${ch.title}`,timeLimit:600,passingScore:70,xpReward:Math.round(ch.xpReward*0.8),questions:{create:questions}}});
    console.log(`✅ Created ch ${ch.orderIndex}: ${ch.title}`);
  }
}
main().catch(console.error).finally(()=>prisma.$disconnect());
