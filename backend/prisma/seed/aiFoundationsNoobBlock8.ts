/**
 * aiFoundationsNoobBlock8.ts — NOOB Block 8 (Ch 36–40): First ML Models
 * Run: cd backend && npm run seed:af-noob-b8
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function q(text:string,options:{id:string;text:string}[],correctAnswer:string,explanation:string,orderIndex:number){return{text,options:JSON.stringify(options),correctAnswer,explanation,orderIndex};}
const COURSE_SLUG='foundations';

const CHAPTERS=[
  {slug:'af-noob-36-linear-regression',title:'Linear Regression',description:'The simplest ML model — fitting a line to data using ordinary least squares, gradient descent, assumptions, and extensions.',orderIndex:36,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 36 — Linear Regression

## The Model

$$\\hat{y} = w_1 x_1 + w_2 x_2 + ... + w_n x_n + b = \\mathbf{w}^T \\mathbf{x} + b$$

**Hypothesis:** the target y is a linear function of input features.

## Loss Function: Mean Squared Error

$$L = \\frac{1}{n} \\sum_{i=1}^n (\\hat{y}_i - y_i)^2$$

## Closed-Form Solution (Normal Equation)

$$\\mathbf{w} = (X^T X)^{-1} X^T \\mathbf{y}$$

Fast for small datasets; gradient descent preferred for large n.

## Assumptions (LINE)

- **L**inearity — y is linear in X
- **I**ndependence — observations are independent
- **N**ormality — residuals are normally distributed
- **E**qual variance (homoscedasticity) — residual variance is constant

## Evaluation Metrics

| Metric | Formula | Meaning |
|--------|---------|---------|
| MAE | mean(|ŷ-y|) | Average absolute error |
| MSE | mean((ŷ-y)²) | Penalises large errors more |
| RMSE | √MSE | Same units as y |
| R² | 1 - SS_res/SS_tot | Proportion of variance explained |`,
  codeExample:`import numpy as np
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import PolynomialFeatures

np.random.seed(42)

# === Generate data: y = 3x + 2 + noise ===
X_raw = np.random.uniform(0, 10, 100)
y = 3 * X_raw + 2 + np.random.randn(100) * 3
X = X_raw.reshape(-1, 1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# === 1. Simple Linear Regression ===
lr = LinearRegression()
lr.fit(X_train, y_train)
y_pred = lr.predict(X_test)

mse  = mean_squared_error(y_test, y_pred)
r2   = r2_score(y_test, y_pred)
rmse = np.sqrt(mse)

print("=== Linear Regression ===")
print(f"Learned: ŷ = {lr.coef_[0]:.3f}·x + {lr.intercept_:.3f}  (true: 3x + 2)")
print(f"MSE  = {mse:.4f}")
print(f"RMSE = {rmse:.4f}")
print(f"R²   = {r2:.4f}")

# === 2. Normal Equation (from scratch) ===
X_b = np.c_[np.ones(len(X_train)), X_train]  # add bias column
theta = np.linalg.pinv(X_b.T @ X_b) @ X_b.T @ y_train
print(f"\nNormal Equation: bias={theta[0]:.3f}, slope={theta[1]:.3f}")

# === 3. Polynomial Regression ===
print("\n=== Polynomial Regression (degree 2) ===")
poly = PolynomialFeatures(degree=2, include_bias=False)
X_train_p = poly.fit_transform(X_train)
X_test_p  = poly.transform(X_test)
lr_poly = LinearRegression()
lr_poly.fit(X_train_p, y_train)
r2_poly = r2_score(y_test, lr_poly.predict(X_test_p))
print(f"R² (polynomial degree 2): {r2_poly:.4f}")

# === 4. Ridge and Lasso ===
print("\n=== Regularisation ===")
for name, model in [('Ridge (L2)', Ridge(alpha=1.0)), ('Lasso (L1)', Lasso(alpha=0.1))]:
    model.fit(X_train, y_train)
    r2_reg = r2_score(y_test, model.predict(X_test))
    print(f"{name}: R²={r2_reg:.4f}, coef={model.coef_[0]:.3f}")`,
  questions:[
    q('Linear regression assumes the relationship between X and y is:',[{id:'a',text:'Exponential'},{id:'b',text:'Linear — y is a weighted sum of features plus a bias'},{id:'c',text:'Quadratic'},{id:'d',text:'Arbitrary'}],'b','Linear regression fits ŷ = w·x + b — a straight line (or hyperplane) through the data.',0),
    q('The loss function for linear regression is:',[{id:'a',text:'Cross-entropy'},{id:'b',text:'Mean Absolute Error'},{id:'c',text:'Mean Squared Error (MSE)'},{id:'d',text:'Hinge loss'}],'c','Linear regression minimises MSE = mean((ŷ-y)²), which is convex and has a closed-form solution.',1),
    q('R² = 1 means:',[{id:'a',text:'The model is overfitting'},{id:'b',text:'The model explains 100% of the variance in y — perfect fit'},{id:'c',text:'MSE is 1'},{id:'d',text:'The model performs at random'}],'b','R²=1 → perfect fit; R²=0 → predicts only the mean; R²<0 → worse than mean.',2),
    q('The Normal Equation solves for weights:',[{id:'a',text:'Iteratively using gradient descent'},{id:'b',text:'In closed form: w = (XᵀX)⁻¹Xᵀy'},{id:'c',text:'Using cross-validation'},{id:'d',text:'By numerical differentiation'}],'b','The Normal Equation gives the exact OLS solution analytically — no iteration needed.',3),
    q('Ridge regression adds:',[{id:'a',text:'L1 penalty (sum of |wᵢ|)'},{id:'b',text:'L2 penalty (sum of wᵢ²) — shrinks weights toward zero'},{id:'c',text:'Dropout'},{id:'d',text:'An extra hidden layer'}],'b','Ridge = OLS + α·Σwᵢ² — L2 regularisation prevents large weights.',4),
    q('Lasso regression is useful for:',[{id:'a',text:'Preventing all overfitting'},{id:'b',text:'Feature selection — L1 penalty drives some weights exactly to zero'},{id:'c',text:'Handling class imbalance'},{id:'d',text:'Non-linear relationships'}],'b','Lasso\'s L1 penalty produces sparse solutions — automatically selects important features.',5),
    q('Homoscedasticity means:',[{id:'a',text:'Features are correlated'},{id:'b',text:'Residuals have constant variance across all predicted values'},{id:'c',text:'The model is linear'},{id:'d',text:'Residuals are normally distributed'}],'b','Homoscedasticity is a key OLS assumption — heteroscedastic residuals make standard errors unreliable.',6),
    q('RMSE differs from MSE because:',[{id:'a',text:'RMSE ignores outliers'},{id:'b',text:'RMSE is in the same units as the target variable — easier to interpret'},{id:'c',text:'RMSE is always smaller'},{id:'d',text:'RMSE uses absolute differences'}],'b','RMSE = √MSE, bringing the error metric back to the scale of y.',7),
    q('Polynomial regression vs linear regression:',[{id:'a',text:'They are identical'},{id:'b',text:'Polynomial adds polynomial features (x², x³) — still a linear model in the extended feature space'},{id:'c',text:'Polynomial requires neural networks'},{id:'d',text:'Polynomial cannot overfit'}],'b','Polynomial regression is linear in the polynomial features — sklearn\'s LinearRegression works on poly features.',8),
    q('When would you prefer gradient descent over the Normal Equation?',[{id:'a',text:'When n (samples) is small'},{id:'b',text:'When there are few features'},{id:'c',text:'When n or features are very large — Normal Equation is O(n³) in features'},{id:'d',text:'Always'}],'c','The Normal Equation involves matrix inversion O(p³) — infeasible for millions of features. GD scales better.',9),
  ]},

  {slug:'af-noob-37-logistic-regression',title:'Logistic Regression',description:'Classification with the sigmoid function — decision boundaries, cross-entropy loss, and binary/multi-class classification.',orderIndex:37,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 37 — Logistic Regression

## Why Not Linear Regression for Classification?

Linear regression can predict values outside [0,1] and doesn't naturally model probabilities.

## The Sigmoid Function

$$\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad z = \\mathbf{w}^T \\mathbf{x} + b$$

Output = probability of class 1: P(y=1|x).

## Decision Boundary

$$\\hat{y} = \\begin{cases} 1 & \\text{if } \\sigma(z) \\geq 0.5 \\\\ 0 & \\text{otherwise} \\end{cases}$$

σ(z) ≥ 0.5 ↔ z ≥ 0 ↔ w·x + b ≥ 0.

## Loss Function: Binary Cross-Entropy

$$L = -\\frac{1}{n} \\sum [y_i \\log(\\hat{p}_i) + (1-y_i)\\log(1-\\hat{p}_i)]$$

Penalises confident wrong predictions heavily.

## Multi-Class Extension

- **One-vs-Rest (OvR)** — binary classifier per class
- **Softmax (multinomial)** — directly outputs K probabilities

## Regularisation

Like linear regression: L1 (C small) for sparsity, L2 for weight shrinkage.
In sklearn: C = 1/λ (larger C = less regularisation).`,
  codeExample:`import numpy as np
from sklearn.datasets import make_classification, load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (accuracy_score, classification_report,
                              confusion_matrix, roc_auc_score)
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

# === Binary Classification ===
print("=== Binary Logistic Regression ===")
X, y = make_classification(n_samples=500, n_features=2, n_informative=2,
                            n_redundant=0, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

lr = LogisticRegression(C=1.0, max_iter=1000)
lr.fit(X_train_s, y_train)

y_pred  = lr.predict(X_test_s)
y_proba = lr.predict_proba(X_test_s)[:,1]

print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"AUC-ROC:   {roc_auc_score(y_test, y_proba):.4f}")
print(f"Coefficients: {lr.coef_[0].round(3)}")
print(f"Intercept:    {lr.intercept_[0]:.3f}")

print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(f"  TN={cm[0,0]}  FP={cm[0,1]}")
print(f"  FN={cm[1,0]}  TP={cm[1,1]}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# === Multi-class (Iris) ===
print("=== Multi-class Logistic Regression (Iris) ===")
iris = load_iris()
Xm, ym = iris.data, iris.target
Xm_tr, Xm_te, ym_tr, ym_te = train_test_split(Xm, ym, test_size=0.2, random_state=42)
sm = StandardScaler()
lr_multi = LogisticRegression(multi_class='multinomial', max_iter=1000)
lr_multi.fit(sm.fit_transform(Xm_tr), ym_tr)
print(f"Multi-class accuracy: {lr_multi.score(sm.transform(Xm_te), ym_te):.4f}")
print(f"Probabilities (first test sample): {lr_multi.predict_proba(sm.transform(Xm_te[:1])).round(3)}")`,
  questions:[
    q('The sigmoid function outputs:',[{id:'a',text:'Values from -∞ to +∞'},{id:'b',text:'Values between 0 and 1 — interpreted as probabilities'},{id:'c',text:'Binary 0 or 1 directly'},{id:'d',text:'Values between -1 and 1'}],'b','σ(z) = 1/(1+e⁻ᶻ) maps any real number to (0,1) — ideal for probability output.',0),
    q('The default decision threshold in logistic regression is:',[{id:'a',text:'0.0'},{id:'b',text:'0.5 — predict class 1 if P(y=1|x) ≥ 0.5'},{id:'c',text:'1.0'},{id:'d',text:'Depends on the data'}],'b','At σ(z)=0.5, z=0, giving the linear decision boundary w·x+b=0.',1),
    q('Binary cross-entropy loss heavily penalises:',[{id:'a',text:'Small errors'},{id:'b',text:'Uncertain predictions'},{id:'c',text:'Confident wrong predictions (predicting 0.99 for the wrong class)'},{id:'d',text:'All predictions equally'}],'c','-log(0.01) ≈ 4.6 for a wrong confident prediction — cross-entropy punishes confident errors harshly.',2),
    q('In sklearn\'s LogisticRegression, C is:',[{id:'a',text:'The number of classes'},{id:'b',text:'The inverse of regularisation strength — larger C = less regularisation'},{id:'c',text:'The learning rate'},{id:'d',text:'The decision threshold'}],'b','C = 1/λ — small C → strong regularisation, large C → weak regularisation.',3),
    q('What does predict_proba() return?',[{id:'a',text:'Class labels only'},{id:'b',text:'Probability of each class for each sample'},{id:'c',text:'Model coefficients'},{id:'d',text:'Confusion matrix'}],'b','predict_proba() returns a (n_samples, n_classes) array of class probabilities.',4),
    q('One-vs-Rest (OvR) multi-class strategy:',[{id:'a',text:'Trains one model for all classes simultaneously'},{id:'b',text:'Trains K binary classifiers, each distinguishing one class from all others'},{id:'c',text:'Uses softmax directly'},{id:'d',text:'Only works for K=2'}],'b','OvR trains K binary classifiers — final prediction = class with highest probability.',5),
    q('The AUC-ROC score measures:',[{id:'a',text:'Accuracy on the test set'},{id:'b',text:'Model\'s ability to rank positive examples above negative ones across all thresholds'},{id:'c',text:'Precision only'},{id:'d',text:'Recall only'}],'b','AUC-ROC = area under the ROC curve — 1.0 is perfect, 0.5 is random.',6),
    q('Logistic regression finds a:',[{id:'a',text:'Non-linear decision boundary'},{id:'b',text:'Linear decision boundary in feature space'},{id:'c',text:'Cluster centroid'},{id:'d',text:'Tree of decisions'}],'b','Logistic regression\'s boundary is w·x+b=0 — a hyperplane (line in 2D) in the original feature space.',7),
    q('Which loss function is used to train logistic regression?',[{id:'a',text:'MSE'},{id:'b',text:'Hinge loss'},{id:'c',text:'Binary cross-entropy (log loss)'},{id:'d',text:'Huber loss'}],'c','Logistic regression minimises binary cross-entropy: L = -Σ[y·log(p) + (1-y)·log(1-p)].',8),
    q('For an imbalanced dataset (95% class 0, 5% class 1), a better metric than accuracy is:',[{id:'a',text:'RMSE'},{id:'b',text:'R²'},{id:'c',text:'F1-score or AUC-ROC'},{id:'d',text:'Mean absolute error'}],'c','For imbalanced classes, F1 (harmonic mean of precision/recall) and AUC-ROC are more informative than accuracy.',9),
  ]},

  {slug:'af-noob-38-knn',title:'k-Nearest Neighbors (kNN)',description:'The lazy learner — how kNN makes predictions using distance metrics, choosing k, and the curse of dimensionality.',orderIndex:38,xpReward:65,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 38 — k-Nearest Neighbors (kNN)

## Core Idea

kNN makes predictions by finding the K closest training examples to a new point and taking a **majority vote** (classification) or **average** (regression).

No training step — all computation at prediction time ("lazy learner").

## Algorithm

1. For a new point x, compute distance to ALL training points
2. Find the K nearest neighbours
3. Classify: majority vote; Regress: mean of K values

## Distance Metrics

| Metric | Formula | Use case |
|--------|---------|---------|
| Euclidean | √Σ(xᵢ-yᵢ)² | Continuous features |
| Manhattan | Σ|xᵢ-yᵢ| | Robust to outliers |
| Minkowski | (Σ|xᵢ-yᵢ|ᵖ)^(1/p) | Generalisation |
| Cosine | 1 - (x·y)/(‖x‖‖y‖) | Text/embeddings |

## Choosing K

- **Small K** (K=1) — complex boundary, overfitting
- **Large K** — smooth boundary, underfitting
- Use cross-validation to select optimal K

## Curse of Dimensionality

In high dimensions, all points become equidistant — kNN degrades. Feature selection / PCA before kNN is recommended.

## When to Use kNN

✅ Small datasets, few features, non-linear boundaries
❌ Large datasets (slow prediction), high dimensions`,
  codeExample:`import numpy as np
from sklearn.datasets import make_classification, load_iris
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

np.random.seed(42)

# === kNN Classification ===
print("=== kNN Classification ===")
X, y = make_classification(n_samples=300, n_features=2, n_informative=2,
                            n_redundant=0, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
scaler = StandardScaler()
X_tr_s = scaler.fit_transform(X_train)
X_te_s = scaler.transform(X_test)

print(f"{'K':>4} | {'Train Acc':>10} | {'Test Acc':>10} | {'CV Mean':>10}")
print("-" * 45)
for k in [1, 3, 5, 10, 20, 50]:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_tr_s, y_train)
    tr_acc = knn.score(X_tr_s, y_train)
    te_acc = knn.score(X_te_s, y_test)
    cv_scores = cross_val_score(KNeighborsClassifier(n_neighbors=k),
                                X_tr_s, y_train, cv=5)
    print(f"{k:4d} | {tr_acc:10.4f} | {te_acc:10.4f} | {cv_scores.mean():10.4f}")

# === Manual kNN from scratch ===
print("\n=== Manual kNN (K=3) for one test point ===")
test_point = np.array([[0.5, -0.2]])
test_scaled = scaler.transform(test_point)

# Euclidean distances to all training points
dists = np.sqrt(np.sum((X_tr_s - test_scaled)**2, axis=1))
nearest_idx = np.argsort(dists)[:3]
print(f"3 nearest distances: {dists[nearest_idx].round(4)}")
print(f"Their labels: {y_train[nearest_idx]}")
print(f"Prediction: {np.bincount(y_train[nearest_idx]).argmax()}")

# === kNN Regression ===
print("\n=== kNN Regression ===")
X_reg = np.sort(np.random.uniform(0, 10, 100)).reshape(-1,1)
y_reg = np.sin(X_reg.ravel()) + np.random.randn(100)*0.2
knn_r = KNeighborsRegressor(n_neighbors=5)
knn_r.fit(X_reg[:80], y_reg[:80])
preds = knn_r.predict(X_reg[80:])
mse = np.mean((preds - y_reg[80:])**2)
print(f"kNN Regressor MSE (k=5): {mse:.4f}")`,
  questions:[
    q('kNN is called a "lazy learner" because:',[{id:'a',text:'It trains very slowly'},{id:'b',text:'It does no explicit training — stores all data and computes at prediction time'},{id:'c',text:'It uses a simple model'},{id:'d',text:'It requires less data'}],'b','kNN defers all computation to prediction time — no model is built during "training".',0),
    q('For kNN classification with K=3, the prediction is:',[{id:'a',text:'The average of 3 neighbour labels'},{id:'b',text:'The majority class among the 3 nearest neighbours'},{id:'c',text:'The label of the single closest neighbour'},{id:'d',text:'A probability score'}],'b','kNN classification uses majority vote among K neighbours.',1),
    q('What happens with K=1 in kNN?',[{id:'a',text:'Underfitting — too smooth'},{id:'b',text:'Overfitting — model exactly memorises training data'},{id:'c',text:'Optimal performance'},{id:'d',text:'No predictions made'}],'b','K=1 creates a complex, jagged boundary that perfectly classifies training data but generalises poorly.',2),
    q('The curse of dimensionality means:',[{id:'a',text:'kNN is slow to train'},{id:'b',text:'In high dimensions, points become equidistant — distance metrics lose meaning'},{id:'c',text:'kNN requires more memory'},{id:'d',text:'kNN cannot do regression'}],'b','In high dimensions, all pairwise distances converge — nearest neighbours are not truly "near".',3),
    q('Why must features be scaled before using kNN?',[{id:'a',text:'kNN requires binary features'},{id:'b',text:'kNN uses distance — large-scale features dominate and distort neighbour selection'},{id:'c',text:'kNN only works with normal distributions'},{id:'d',text:'Scaling reduces computation time'}],'b','Without scaling, features with large values (e.g., salary in thousands) dominate Euclidean distance.',4),
    q('Manhattan distance is:',[{id:'a',text:'√Σ(xᵢ-yᵢ)²'},{id:'b',text:'Σ|xᵢ-yᵢ|'},{id:'c',text:'max|xᵢ-yᵢ|'},{id:'d',text:'(Σ|xᵢ-yᵢ|ᵖ)^(1/p)'}],'b','Manhattan (L1) distance = sum of absolute differences — more robust to outliers than Euclidean.',5),
    q('Cosine distance is preferred for:',[{id:'a',text:'Image pixel comparison'},{id:'b',text:'Time series data'},{id:'c',text:'Text and embedding vectors — measures angle not magnitude'},{id:'d',text:'Tabular numeric data'}],'c','Cosine similarity measures directional similarity — useful when magnitude (document length) is irrelevant.',6),
    q('How do you choose optimal K?',[{id:'a',text:'Always use K=1'},{id:'b',text:'Always use K=n'},{id:'c',text:'Use cross-validation to compare test error for different K values'},{id:'d',text:'Set K = number of classes'}],'c','Cross-validation finds K that minimises validation error — balancing bias and variance.',7),
    q('kNN regression predicts:',[{id:'a',text:'The mode of K neighbour labels'},{id:'b',text:'The mean of the K nearest neighbours\' target values'},{id:'c',text:'A polynomial fit to K points'},{id:'d',text:'Always the same value'}],'b','kNN regression averages (or weights) the target values of the K nearest training points.',8),
    q('Which scenario is LEAST suitable for kNN?',[{id:'a',text:'Small dataset with 4 informative features'},{id:'b',text:'Image dataset with 100000 high-dimensional samples'},{id:'c',text:'Medical data with continuous features'},{id:'d',text:'Non-linear classification problem'}],'b','kNN scales O(n) per prediction — with 100k high-dimensional samples, it\'s prohibitively slow.',9),
  ]},

  {slug:'af-noob-39-decision-trees',title:'Decision Trees',description:'Splitting data with information gain and Gini impurity — growing, pruning, and interpreting decision trees for classification and regression.',orderIndex:39,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 39 — Decision Trees

## How Decision Trees Work

Decision trees recursively split the feature space using **if-then-else rules**:

\`\`\`
Is petal_length < 2.45?
├── Yes → Setosa (leaf)
└── No → Is petal_width < 1.75?
    ├── Yes → Versicolor (leaf)
    └── No → Virginica (leaf)
\`\`\`

## Splitting Criteria

### Gini Impurity (default in sklearn)
$$G = 1 - \\sum_{k=1}^K p_k^2$$

Ranges from 0 (pure) to 0.5 (50-50 binary).

### Entropy / Information Gain
$$H = -\\sum_{k=1}^K p_k \\log_2 p_k$$

At each split, choose the feature+threshold that maximises information gain.

## Stopping Criteria / Pruning

| Hyperparameter | Effect |
|---------------|--------|
| max_depth | Prevents deep (overfit) trees |
| min_samples_split | Min samples to split a node |
| min_samples_leaf | Min samples in a leaf |
| max_features | Random subset of features per split |

## Pros & Cons

✅ Interpretable, no scaling needed, handles mixed types
❌ Overfits easily, unstable (sensitive to data changes), biased toward features with more values`,
  codeExample:`import numpy as np
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score

iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                      random_state=42, stratify=y)

# === Effect of max_depth ===
print("=== Decision Tree: max_depth comparison ===")
print(f"{'Depth':>6} | {'Train Acc':>10} | {'Test Acc':>10} | {'CV Mean':>10}")
print("-"*48)
for depth in [1, 2, 3, 4, 5, None]:
    dt = DecisionTreeClassifier(max_depth=depth, random_state=42)
    dt.fit(X_train, y_train)
    tr = dt.score(X_train, y_train)
    te = dt.score(X_test, y_test)
    cv = cross_val_score(DecisionTreeClassifier(max_depth=depth, random_state=42),
                         X_train, y_train, cv=5).mean()
    d_label = str(depth) if depth else 'None'
    print(f"{d_label:>6} | {tr:10.4f} | {te:10.4f} | {cv:10.4f}")

# === Best tree (depth 3) ===
print("\n=== Decision Tree Rules (depth=3) ===")
dt3 = DecisionTreeClassifier(max_depth=3, random_state=42)
dt3.fit(X_train, y_train)
tree_rules = export_text(dt3, feature_names=list(iris.feature_names))
print(tree_rules)

# === Feature importances ===
print("=== Feature Importances ===")
for feat, imp in sorted(zip(iris.feature_names, dt3.feature_importances_),
                         key=lambda x: -x[1]):
    bar = '█' * int(imp * 40)
    print(f"  {feat:25s}: {imp:.4f} {bar}")

# === Gini impurity demo ===
print("\n=== Gini Impurity ===")
for p in [0.0, 0.1, 0.3, 0.5, 1.0]:
    gini = 1 - (p**2 + (1-p)**2)
    print(f"  p={p:.1f}: Gini={gini:.4f}")`,
  questions:[
    q('At each node, a decision tree selects:',[{id:'a',text:'A random feature and threshold'},{id:'b',text:'The feature and threshold that maximise information gain (or minimise Gini impurity)'},{id:'c',text:'The feature with highest variance'},{id:'d',text:'The feature with most missing values'}],'b','Trees greedily pick the best split to create the purest child nodes.',0),
    q('Gini impurity of a pure node (all one class) is:',[{id:'a',text:'1.0'},{id:'b',text:'0.5'},{id:'c',text:'0.0'},{id:'d',text:'-1.0'}],'c','Gini=1-Σpₖ²; if all samples are one class, p=1 → Gini=1-1=0 (pure).',1),
    q('Increasing max_depth of a decision tree tends to:',[{id:'a',text:'Reduce overfitting'},{id:'b',text:'Increase bias'},{id:'c',text:'Increase variance and risk of overfitting'},{id:'d',text:'Reduce training accuracy'}],'c','Deeper trees split into finer partitions — eventually memorising training data.',2),
    q('Decision trees require feature scaling:',[{id:'a',text:'Always'},{id:'b',text:'For regression only'},{id:'c',text:'Never — splits are based on thresholds, not distances'},{id:'d',text:'When using Gini impurity'}],'c','Tree splits use comparisons (x < threshold) — scale-invariant, no normalisation needed.',3),
    q('Information gain is:',[{id:'a',text:'Gini impurity of the root'},{id:'b',text:'Entropy reduction after a split: IG = H(parent) - weighted_H(children)'},{id:'c',text:'Accuracy improvement after splitting'},{id:'d',text:'The feature correlation'}],'b','Information gain = how much entropy (uncertainty) is reduced by the split.',4),
    q('A decision tree with max_depth=None and large dataset will likely:',[{id:'a',text:'Underfit'},{id:'b',text:'Have 100% train accuracy but poor test accuracy (overfit)'},{id:'c',text:'Be interpretable'},{id:'d',text:'Ignore all features'}],'b','Unlimited depth → tree memorises every training point — classic decision tree overfitting.',5),
    q('Feature importance in a decision tree is based on:',[{id:'a',text:'The feature\'s correlation with the target'},{id:'b',text:'The total Gini impurity decrease attributable to each feature across all splits'},{id:'c',text:'The number of times a feature is used'},{id:'d',text:'The feature\'s variance'}],'b','Feature importance = total weighted impurity reduction from all splits using that feature.',6),
    q('export_text() in sklearn is used to:',[{id:'a',text:'Export the model to TensorFlow'},{id:'b',text:'Print a text representation of the decision tree rules'},{id:'c',text:'Export feature importances'},{id:'d',text:'Save the model to disk'}],'b','export_text() renders the tree as a readable if-then-else rule set.',7),
    q('Which hyperparameter sets a minimum number of samples in each leaf node?',[{id:'a',text:'max_depth'},{id:'b',text:'max_features'},{id:'c',text:'min_samples_leaf'},{id:'d',text:'min_impurity_decrease'}],'c','min_samples_leaf prevents the tree from creating tiny, overfit leaf nodes.',8),
    q('Why are decision trees "unstable"?',[{id:'a',text:'They use random number generation'},{id:'b',text:'Small changes in training data can produce very different trees'},{id:'c',text:'They require more hyperparameters'},{id:'d',text:'They cannot handle missing values'}],'b','High variance: a different random train subset leads to a very different tree — Random Forest fixes this.',9),
  ]},

  {slug:'af-noob-40-naive-bayes',title:'Naive Bayes Classifier',description:'Fast probabilistic classification using Bayes\' theorem with the conditional independence assumption — text classification, spam detection, and Gaussian NB.',orderIndex:40,xpReward:65,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 40 — Naive Bayes Classifier

## The Model

Naive Bayes applies Bayes' theorem with the **conditional independence** assumption:

$$P(y|x_1,...,x_n) \\propto P(y) \\cdot \\prod_{i=1}^n P(x_i|y)$$

"Naive" = features are independent given the class (rarely true, yet works well).

## Types of Naive Bayes

| Variant | Feature type | Use case |
|---------|-------------|---------|
| Gaussian NB | Continuous | General tabular |
| Multinomial NB | Word counts | Text classification |
| Bernoulli NB | Binary | Document presence/absence |
| Complement NB | Word counts | Imbalanced text |

## Gaussian Naive Bayes

Assumes each feature follows a Normal distribution per class:

$$P(x_i|y) = \\frac{1}{\\sqrt{2\\pi\\sigma_y^2}} e^{-\\frac{(x_i - \\mu_y)^2}{2\\sigma_y^2}}$$

## Laplace Smoothing

Prevents P(word|class)=0 for unseen words:

$$P(x_i|y) = \\frac{count(x_i, y) + \\alpha}{count(y) + \\alpha \\cdot |V|}$$

## Strengths & Weaknesses

✅ Very fast (O(n·features)), works with tiny datasets, good for text
❌ Independence assumption often violated, probability estimates poorly calibrated`,
  codeExample:`import numpy as np
from sklearn.datasets import load_iris, fetch_20newsgroups
from sklearn.naive_bayes import GaussianNB, MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import MinMaxScaler

np.random.seed(42)

# === 1. Gaussian Naive Bayes (Iris) ===
print("=== Gaussian Naive Bayes (Iris) ===")
iris = load_iris()
X, y = iris.data, iris.target
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

gnb = GaussianNB()
gnb.fit(X_tr, y_tr)
print(f"Test accuracy: {gnb.score(X_te, y_te):.4f}")
print(f"Class priors: {gnb.class_prior_.round(3)}")
print(f"Feature means per class:\n{gnb.theta_.round(2)}")
cv = cross_val_score(GaussianNB(), X, y, cv=10)
print(f"10-fold CV: {cv.mean():.4f} ± {cv.std():.4f}")

# === 2. Manual Naive Bayes prediction ===
print("\n=== Manual GNB prediction (first test sample) ===")
x_new = X_te[0]
print(f"Input: {x_new}")
log_posteriors = []
for c in range(3):
    log_prior = np.log(gnb.class_prior_[c])
    log_likelihood = np.sum(
        -0.5 * np.log(2*np.pi*gnb.var_[c]) -
        0.5 * ((x_new - gnb.theta_[c])**2) / gnb.var_[c]
    )
    log_posteriors.append(log_prior + log_likelihood)

pred_class = np.argmax(log_posteriors)
print(f"Log posteriors: {[f'{p:.2f}' for p in log_posteriors]}")
print(f"Predicted: {iris.target_names[pred_class]}  (true: {iris.target_names[y_te[0]]})")

# === 3. Multinomial NB for text ===
print("\n=== Multinomial NB (Text Classification) ===")
texts = [
    "buy cheap drugs now", "free money win prize", "click here free offer",
    "meeting tomorrow at 3pm", "project deadline next week", "quarterly review report",
    "great deal discount sale", "report attached for review"
]
labels = [1, 1, 1, 0, 0, 0, 1, 0]  # 1=spam, 0=ham

vec = CountVectorizer()
X_text = vec.fit_transform(texts)
mnb = MultinomialNB(alpha=1.0)  # Laplace smoothing
mnb.fit(X_text, labels)

test_texts = ["free prize money", "project update tomorrow"]
X_test_text = vec.transform(test_texts)
preds = mnb.predict(X_test_text)
probas = mnb.predict_proba(X_test_text)
for txt, pred, proba in zip(test_texts, preds, probas):
    print(f"  '{txt}' → {'SPAM' if pred else 'HAM'} (p_spam={proba[1]:.3f})")`,
  questions:[
    q('The "naive" in Naive Bayes refers to:',[{id:'a',text:'The model being simple to implement'},{id:'b',text:'The assumption that features are conditionally independent given the class'},{id:'c',text:'The model having no parameters'},{id:'d',text:'Using an uninformative prior'}],'b','Naive Bayes assumes P(x₁,...,xₙ|y) = ΠP(xᵢ|y) — features are independent within each class.',0),
    q('Gaussian Naive Bayes assumes each feature, per class, follows:',[{id:'a',text:'A uniform distribution'},{id:'b',text:'A Poisson distribution'},{id:'c',text:'A Normal (Gaussian) distribution'},{id:'d',text:'A Bernoulli distribution'}],'c','GNB models P(xᵢ|y) as N(μ_{iy}, σ²_{iy}) — estimates mean and variance per feature per class.',1),
    q('Multinomial Naive Bayes is most commonly used for:',[{id:'a',text:'Image classification'},{id:'b',text:'Time series forecasting'},{id:'c',text:'Text classification using word count features'},{id:'d',text:'Regression'}],'c','MultinomialNB works with discrete count features — natural for bag-of-words text representation.',2),
    q('Laplace smoothing (add-α) prevents:',[{id:'a',text:'Overfitting'},{id:'b',text:'Zero probability for unseen words — which would zero out the entire product'},{id:'c',text:'High variance'},{id:'d',text:'Large feature counts'}],'b','Without smoothing, one unseen word makes the entire likelihood P(x|class)=0 — Laplace adds α to all counts.',3),
    q('Naive Bayes is fast because:',[{id:'a',text:'It uses gradient descent with few iterations'},{id:'b',text:'Training only requires computing per-class statistics (means, variances, frequencies)'},{id:'c',text:'It uses decision trees internally'},{id:'d',text:'It ignores most features'}],'b','NB training = counting statistics — O(n·d), extremely fast even on large datasets.',4),
    q('P(y|x) ∝ P(y) · ΠP(xᵢ|y). The ∝ symbol means:',[{id:'a',text:'Equal to'},{id:'b',text:'Proportional to — ignoring the normalising constant P(x)'},{id:'c',text:'Greater than'},{id:'d',text:'The log of'}],'b','We drop P(x) (same for all classes) and compare unnormalised posteriors for classification.',5),
    q('When does Naive Bayes often perform well despite violated independence?',[{id:'a',text:'Never — violation always hurts'},{id:'b',text:'In text classification — even with word correlations, NB predictions are often good'},{id:'c',text:'Only with continuous features'},{id:'d',text:'Only with 2 classes'}],'b','NB\'s probability estimates may be poor (overconfident) but classification decisions are often correct.',6),
    q('Class prior P(y) in Naive Bayes is:',[{id:'a',text:'Always uniform (1/K)'},{id:'b',text:'The fraction of training samples belonging to each class'},{id:'c',text:'A fixed hyperparameter'},{id:'d',text:'Computed from test data'}],'b','P(y=k) = (number of samples with class k) / (total samples) — estimated from training data.',7),
    q('Bernoulli Naive Bayes differs from Multinomial NB in that it:',[{id:'a',text:'Uses continuous features'},{id:'b',text:'Models feature presence/absence (binary) rather than counts'},{id:'c',text:'Requires more data'},{id:'d',text:'Uses Gaussian likelihood'}],'b','BernoulliNB considers whether a word appears at all (0/1), while MultinomialNB uses word counts.',8),
    q('Why is Naive Bayes good for spam filtering?',[{id:'a',text:'It requires deep learning'},{id:'b',text:'Fast training on email text, handles many features, works with few examples'},{id:'c',text:'It needs no training data'},{id:'d',text:'It always achieves 99% accuracy'}],'b','NB is fast, interpretable, handles high-dimensional text, and trains well with small labelled datasets.',9),
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
