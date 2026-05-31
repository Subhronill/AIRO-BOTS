/**
 * aiFoundationsNoobBlock7.ts — NOOB Block 7 (Ch 31–35): Introduction to AI & Machine Learning
 * Run: cd backend && npm run seed:af-noob-b7
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function q(text:string,options:{id:string;text:string}[],correctAnswer:string,explanation:string,orderIndex:number){return{text,options:JSON.stringify(options),correctAnswer,explanation,orderIndex};}
const COURSE_SLUG='foundations';

const CHAPTERS=[
  {slug:'af-noob-31-what-is-ml',title:'What is Machine Learning?',description:'Defining ML, the distinction from traditional programming, types of learning, and real-world applications shaping the AI era.',orderIndex:31,xpReward:60,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 31 — What is Machine Learning?

## Traditional Programming vs Machine Learning

| Traditional | Machine Learning |
|------------|----------------|
| Programmer writes rules | System learns rules from data |
| Input + Rules → Output | Input + Output → Rules |
| Brittle to new cases | Generalises from examples |
| Fast to deploy (for simple tasks) | Requires data & training |

## Arthur Samuel's Definition (1959)

> "Machine learning is the field of study that gives computers the ability to learn without being explicitly programmed."

## Tom Mitchell's Formal Definition

A computer program **learns** from experience E with respect to task T and performance measure P, if its performance on T improves with E.

## Types of Machine Learning

\`\`\`
Machine Learning
├── Supervised Learning     (labelled data: X → y)
│   ├── Classification      (predict category)
│   └── Regression          (predict number)
├── Unsupervised Learning   (unlabelled data: find structure)
│   ├── Clustering
│   └── Dimensionality Reduction
├── Semi-supervised         (few labels + lots unlabelled)
└── Reinforcement Learning  (agent + reward + environment)
\`\`\`

## AI Hierarchy

AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Large Language Models`,
  codeExample:`# Machine Learning Concept Demonstration
# Comparing rule-based vs ML approach for spam detection

import re

# === Traditional Rule-Based Approach ===
def rule_based_spam(email: str) -> bool:
    """Hard-coded rules — brittle, requires expert knowledge"""
    spam_words = ['FREE', 'WIN', 'CLICK NOW', 'URGENT', '$$$']
    email_upper = email.upper()
    return any(word in email_upper for word in spam_words)

emails = [
    "URGENT! You've WON a FREE iPhone! CLICK NOW!!!",
    "Hey, are you coming to the meeting tomorrow?",
    "Congratulations! FREE gift waiting for you!",
    "The quarterly report is attached for your review.",
    "Make $$$1000 per day working from home!"
]

print("=== Rule-Based Spam Detection ===")
for email in emails:
    is_spam = rule_based_spam(email)
    print(f"  [{'SPAM' if is_spam else 'HAM ':4s}] {email[:50]}...")

# === ML Approach (simplified bag-of-words + naive learning) ===
print("\n=== Simple ML Approach (Learning from Examples) ===")
# Training data: (features, label)
training_data = [
    ({'free':1,'urgent':1,'win':1,'click':1,'meeting':0,'report':0}, 'spam'),
    ({'free':0,'urgent':0,'win':0,'click':0,'meeting':1,'report':0}, 'ham'),
    ({'free':1,'urgent':0,'win':1,'click':0,'meeting':0,'report':0}, 'spam'),
    ({'free':0,'urgent':0,'win':0,'click':0,'meeting':0,'report':1}, 'ham'),
]

# Count word frequencies per class
from collections import defaultdict
counts = {'spam': defaultdict(int), 'ham': defaultdict(int)}
class_counts = {'spam': 0, 'ham': 0}
for features, label in training_data:
    class_counts[label] += 1
    for word, present in features.items():
        counts[label][word] += present

print(f"Learned from {len(training_data)} examples")
print(f"Spam signals (word counts): {dict(counts['spam'])}")
print(f"Ham signals  (word counts): {dict(counts['ham'])}")
print("\nKey insight: ML discovers patterns (spam words) automatically!")

# What ML CAN do
print("\n=== Real-World ML Applications ===")
applications = {
    'Image Recognition': 'CNN classifies 1000 categories',
    'Speech Recognition': 'RNN/Transformer → text from audio',
    'Recommendation': 'Collaborative filtering (Netflix, Spotify)',
    'Fraud Detection': 'Anomaly detection in transactions',
    'Language Models': 'GPT, Claude — text generation',
    'Robotics': 'RL agents learning motor control',
}
for app, description in applications.items():
    print(f"  {app:20s}: {description}")`,
  questions:[
    q('In traditional programming, you provide:',[{id:'a',text:'Data and outputs to get rules'},{id:'b',text:'Rules and inputs to get outputs'},{id:'c',text:'Only data'},{id:'d',text:'Only rules'}],'b','Traditional programming: Input + Rules → Output. You hand-code the logic.',0),
    q('In machine learning, the system learns:',[{id:'a',text:'Rules from (input, output) pairs'},{id:'b',text:'Inputs from rules'},{id:'c',text:'Only from rules'},{id:'d',text:'Only from unlabelled data'}],'a','ML inverts the traditional paradigm: Input + Output (data) → Rules (model).',1),
    q('Supervised learning requires:',[{id:'a',text:'No data'},{id:'b',text:'Unlabelled data only'},{id:'c',text:'Labelled data — input-output pairs'},{id:'d',text:'A reward signal'}],'c','Supervised learning trains on (X, y) pairs — the "supervisor" provides correct labels.',2),
    q('Which is an example of a classification task?',[{id:'a',text:'Predicting house prices'},{id:'b',text:'Detecting spam email (spam vs not spam)'},{id:'c',text:'Forecasting temperature'},{id:'d',text:'Compressing images'}],'b','Classification predicts discrete categories — spam/ham is a binary classification problem.',3),
    q('Reinforcement learning trains an agent to:',[{id:'a',text:'Classify images'},{id:'b',text:'Generate text'},{id:'c',text:'Maximise cumulative reward through interaction with an environment'},{id:'d',text:'Cluster data points'}],'c','RL: agent takes actions, receives rewards, learns policy to maximise long-term return.',4),
    q('Deep Learning is:',[{id:'a',text:'A synonym for AI'},{id:'b',text:'A subset of ML using multi-layer neural networks with learned representations'},{id:'c',text:'A type of database'},{id:'d',text:'Rule-based expert systems'}],'b','Deep learning uses deep neural networks (multiple layers) to learn hierarchical representations from data.',5),
    q('Unsupervised learning works with:',[{id:'a',text:'Labelled input-output pairs'},{id:'b',text:'Reward signals'},{id:'c',text:'Unlabelled data — finding structure without explicit targets'},{id:'d',text:'Simulation environments'}],'c','Unsupervised methods (clustering, PCA) discover patterns in data without labels.',6),
    q('Which of these is NOT a machine learning task?',[{id:'a',text:'Recommending movies based on watch history'},{id:'b',text:'Sorting a list of numbers with a fixed algorithm'},{id:'c',text:'Detecting objects in images'},{id:'d',text:'Predicting whether a patient has cancer'}],'b','Sorting with a fixed algorithm (e.g., quicksort) is traditional programming — no learning from data.',7),
    q('What is the AI hierarchy from broadest to narrowest?',[{id:'a',text:'Deep Learning ⊃ ML ⊃ AI'},{id:'b',text:'AI ⊃ ML ⊃ Deep Learning'},{id:'c',text:'ML ⊃ AI ⊃ Deep Learning'},{id:'d',text:'Deep Learning ⊃ AI ⊃ ML'}],'b','AI is broadest (any intelligence), ML is a subset, Deep Learning is a subset of ML.',8),
    q('Semi-supervised learning is useful when:',[{id:'a',text:'You have no data at all'},{id:'b',text:'You have a small amount of labelled data and a large amount of unlabelled data'},{id:'c',text:'All data is labelled'},{id:'d',text:'You have only a reward function'}],'b','Semi-supervised leverages cheap unlabelled data alongside scarce labelled examples.',9),
  ]},

  {slug:'af-noob-32-types-of-ml',title:'Types of Machine Learning',description:'A deep dive into supervised, unsupervised, semi-supervised, and reinforcement learning — with concrete algorithms and use cases for each.',orderIndex:32,xpReward:65,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 32 — Types of Machine Learning

## Supervised Learning

**Goal:** Learn f: X → y from labelled training pairs (xᵢ, yᵢ).

### Classification Algorithms
- Logistic Regression, Decision Trees, Random Forest
- SVM, k-Nearest Neighbors, Naive Bayes
- Neural Networks, Gradient Boosting (XGBoost)

### Regression Algorithms
- Linear Regression, Ridge/Lasso
- Polynomial Regression, SVR, Neural Networks

## Unsupervised Learning

**Goal:** Find patterns or structure in unlabelled data.

### Clustering
- **K-Means** — partition into K clusters
- **Hierarchical** — tree of nested clusters
- **DBSCAN** — density-based, finds arbitrary shapes

### Dimensionality Reduction
- **PCA** — linear, maximises variance
- **t-SNE / UMAP** — non-linear, preserves local structure

## Reinforcement Learning

**Components:**
- **Agent** — the learner/decision maker
- **Environment** — what the agent interacts with
- **State s** — current situation
- **Action a** — what the agent does
- **Reward r** — feedback signal
- **Policy π** — mapping s → a

Famous RL algorithms: Q-Learning, PPO, A3C, SAC.

## Self-Supervised & Contrastive Learning

Modern pre-training: create labels FROM the data itself.
- GPT: predict next token
- BERT: mask and predict tokens
- SimCLR: pull augmented views of same image together`,
  codeExample:`import numpy as np
from sklearn.datasets import make_blobs, make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

print("=== SUPERVISED: Classification ===")
X_cls, y_cls = make_classification(n_samples=200, n_features=4,
                                    n_informative=3, random_state=42)
split = 160
X_train, X_test = X_cls[:split], X_cls[split:]
y_train, y_test = y_cls[:split], y_cls[split:]

lr_model = LogisticRegression(max_iter=500)
lr_model.fit(X_train, y_train)
acc = lr_model.score(X_test, y_test)
print(f"Logistic Regression accuracy: {acc:.2%}")

print("\n=== UNSUPERVISED: Clustering ===")
X_clust, _ = make_blobs(n_samples=300, centers=4, random_state=42)
km = KMeans(n_clusters=4, random_state=42, n_init=10)
km.fit(X_clust)
print(f"K-Means inertia (4 clusters): {km.inertia_:.1f}")
for k in range(4):
    print(f"  Cluster {k}: {np.sum(km.labels_==k)} points, center={km.cluster_centers_[k].round(2)}")

print("\n=== UNSUPERVISED: Dimensionality Reduction ===")
X_pca = np.random.randn(100, 10)  # 100 samples, 10 features
pca = PCA(n_components=2)
X_reduced = pca.fit_transform(StandardScaler().fit_transform(X_pca))
print(f"Reduced from 10D → 2D")
print(f"Variance explained: {pca.explained_variance_ratio_.sum():.2%}")

print("\n=== REINFORCEMENT LEARNING: Bandit Problem ===")
# Simple 3-armed bandit simulation
true_rewards = [0.3, 0.5, 0.7]  # true win probabilities
n_arms = len(true_rewards)
counts = np.zeros(n_arms)
rewards = np.zeros(n_arms)

for step in range(1000):
    # Epsilon-greedy policy (ε=0.1)
    if np.random.rand() < 0.1:
        arm = np.random.randint(n_arms)  # explore
    else:
        arm = np.argmax(rewards / (counts + 1e-5))  # exploit
    reward = int(np.random.rand() < true_rewards[arm])
    counts[arm] += 1
    rewards[arm] += reward

print("3-Armed Bandit (epsilon-greedy, 1000 steps):")
for i in range(n_arms):
    print(f"  Arm {i}: {counts[i]:.0f} pulls, est_p={rewards[i]/counts[i]:.3f}, true_p={true_rewards[i]}")`,
  questions:[
    q('Which ML type uses labelled input-output pairs?',[{id:'a',text:'Unsupervised'},{id:'b',text:'Reinforcement'},{id:'c',text:'Supervised'},{id:'d',text:'Self-supervised'}],'c','Supervised learning trains on (X, y) pairs with explicit labels provided by a human.',0),
    q('K-Means is an example of:',[{id:'a',text:'Supervised regression'},{id:'b',text:'Unsupervised clustering'},{id:'c',text:'Reinforcement learning'},{id:'d',text:'Semi-supervised learning'}],'b','K-Means groups unlabelled data into K clusters based on feature similarity.',1),
    q('PCA is used for:',[{id:'a',text:'Classification'},{id:'b',text:'Clustering'},{id:'c',text:'Dimensionality reduction via linear projection that maximises variance'},{id:'d',text:'Regression'}],'c','Principal Component Analysis projects data onto fewer dimensions while preserving maximum variance.',2),
    q('In reinforcement learning, the reward signal is:',[{id:'a',text:'Provided by labelled data'},{id:'b',text:'Feedback from the environment after each action'},{id:'c',text:'A fixed hyperparameter'},{id:'d',text:'The gradient of the loss function'}],'b','RL reward is a scalar signal from the environment — the agent maximises cumulative reward.',3),
    q('What does self-supervised learning do?',[{id:'a',text:'Uses hand-labelled data'},{id:'b',text:'Generates labels automatically from the data itself (e.g., predict next word)'},{id:'c',text:'Uses reward signals'},{id:'d',text:'Clusters data without labels'}],'b','Self-supervised learning creates pretext tasks from unlabelled data — no human annotation needed.',4),
    q('XGBoost is a popular algorithm for:',[{id:'a',text:'Image segmentation'},{id:'b',text:'Speech synthesis'},{id:'c',text:'Supervised learning (tabular classification/regression)'},{id:'d',text:'Unsupervised clustering'}],'c','XGBoost (Extreme Gradient Boosting) is a top algorithm for tabular supervised learning tasks.',5),
    q('DBSCAN is a clustering algorithm that:',[{id:'a',text:'Requires specifying K clusters in advance'},{id:'b',text:'Finds clusters of arbitrary shape based on density'},{id:'c',text:'Only works for 2D data'},{id:'d',text:'Requires labelled data'}],'b','DBSCAN finds dense regions and can discover clusters of arbitrary shape while labelling outliers.',6),
    q('t-SNE is mainly used for:',[{id:'a',text:'Training neural networks faster'},{id:'b',text:'Visualising high-dimensional data in 2D or 3D'},{id:'c',text:'Supervised classification'},{id:'d',text:'Feature selection'}],'b','t-SNE is a nonlinear DR technique designed for visualisation — preserves local neighbourhood structure.',7),
    q('In the RL framework, a "policy" is:',[{id:'a',text:'The reward function'},{id:'b',text:'A mapping from states to actions'},{id:'c',text:'The environment model'},{id:'d',text:'The discount factor'}],'b','A policy π(a|s) defines the agent\'s behavior — which action to take in each state.',8),
    q('Which is an example of semi-supervised learning?',[{id:'a',text:'Training ResNet on 1M labelled ImageNet images'},{id:'b',text:'Using 1000 labelled emails + 100000 unlabelled emails to train a spam classifier'},{id:'c',text:'K-Means clustering'},{id:'d',text:'Q-Learning in a game environment'}],'b','Semi-supervised learning uses the small labelled set to guide learning from the much larger unlabelled set.',9),
  ]},

  {slug:'af-noob-33-ml-pipeline',title:'The Machine Learning Pipeline',description:'End-to-end ML workflow: data collection, EDA, preprocessing, model training, evaluation, deployment, and monitoring.',orderIndex:33,xpReward:65,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 33 — The Machine Learning Pipeline

## End-to-End ML Workflow

\`\`\`
1. Problem Definition   → What to predict? Success metric?
2. Data Collection      → Gather labelled examples
3. EDA                  → Understand distributions, correlations
4. Data Preprocessing   → Clean, transform, encode
5. Feature Engineering  → Create informative features
6. Model Selection      → Choose algorithm(s)
7. Training             → Fit model on training data
8. Evaluation           → Measure on held-out test set
9. Hyperparameter Tuning→ Optimise model configuration
10. Deployment          → Serve predictions in production
11. Monitoring          → Track drift, retrain as needed
\`\`\`

## Train / Validation / Test Split

| Split | Purpose | Typical Size |
|-------|---------|-------------|
| Train | Learn from | 70–80% |
| Validation | Tune hyperparameters | 10–15% |
| Test | Final unbiased evaluation | 10–15% |

**Never look at test data during development!**

## Scikit-learn API Pattern

\`\`\`python
model = SomeAlgorithm(hyperparameter=value)
model.fit(X_train, y_train)        # Learn
y_pred = model.predict(X_test)     # Apply
score = model.score(X_test, y_test)# Evaluate
\`\`\`

## Common Pitfalls

- **Data leakage** — test info bleeding into training
- **Overfitting** — perfect on train, poor on test
- **Class imbalance** — ignoring minority class
- **Wrong metric** — optimising accuracy on imbalanced data`,
  codeExample:`import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# === Full ML Pipeline Demo ===
print("=== Step 1: Load Data ===")
data = load_breast_cancer()
X, y = data.data, data.target
print(f"Features: {data.feature_names[:5]}...")
print(f"Classes: {data.target_names}")
print(f"Shape: X={X.shape}, y={y.shape}")
print(f"Class dist: {np.bincount(y)} (benign={y.sum()}, malignant={len(y)-y.sum()})")

print("\n=== Step 2: EDA (quick stats) ===")
print(f"Feature means (first 3): {X.mean(axis=0)[:3].round(2)}")
print(f"Feature stds  (first 3): {X.std(axis=0)[:3].round(2)}")

print("\n=== Step 3: Preprocessing ===")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)  # fit on train ONLY
X_test_s  = scaler.transform(X_test)       # transform test with train stats

print(f"Train: {X_train_s.shape}, Test: {X_test_s.shape}")

print("\n=== Step 4-7: Train & Evaluate Multiple Models ===")
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Decision Tree':        DecisionTreeClassifier(max_depth=5, random_state=42),
    'Random Forest':        RandomForestClassifier(n_estimators=100, random_state=42),
}

for name, model in models.items():
    model.fit(X_train_s, y_train)
    train_acc = model.score(X_train_s, y_train)
    test_acc  = model.score(X_test_s,  y_test)
    cv_scores = cross_val_score(model, X_train_s, y_train, cv=5)
    print(f"\n{name}:")
    print(f"  Train acc: {train_acc:.4f}  Test acc: {test_acc:.4f}")
    print(f"  5-fold CV: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")`,
  questions:[
    q('What is the correct order in an ML pipeline?',[{id:'a',text:'Deploy → Collect → Train → Evaluate'},{id:'b',text:'Train → Collect → EDA → Deploy'},{id:'c',text:'Collect → Preprocess → Train → Evaluate → Deploy'},{id:'d',text:'EDA → Train → Collect → Deploy'}],'c','The standard ML pipeline: collect data → explore → preprocess → train → evaluate → deploy.',0),
    q('The test set should be:',[{id:'a',text:'Used during hyperparameter tuning'},{id:'b',text:'Used only once at the very end for final unbiased evaluation'},{id:'c',text:'Split from training before every experiment'},{id:'d',text:'The largest portion of the dataset'}],'b','The test set is the final judge — looking at it during development causes data leakage.',1),
    q('Data leakage occurs when:',[{id:'a',text:'You have too much data'},{id:'b',text:'Information from the test/future leaks into training — giving overly optimistic results'},{id:'c',text:'The model underfits'},{id:'d',text:'You use cross-validation'}],'b','Data leakage (e.g., fitting scaler on all data, including test) produces falsely high reported performance.',2),
    q('In sklearn, fit() is called on:',[{id:'a',text:'Test data'},{id:'b',text:'All available data'},{id:'c',text:'Training data only'},{id:'d',text:'Validation data'}],'c','Always fit/train on training data only — test data must remain unseen until final evaluation.',3),
    q('What is cross-validation used for?',[{id:'a',text:'Generating more training data'},{id:'b',text:'Getting a more reliable estimate of model performance using multiple train/val splits'},{id:'c',text:'Deploying models'},{id:'d',text:'Reducing overfitting in the final model'}],'b','K-fold CV rotates the validation set, giving a stable performance estimate without wasting data.',4),
    q('Overfitting means the model:',[{id:'a',text:'Performs poorly on both train and test'},{id:'b',text:'Performs well on train but poorly on unseen test data'},{id:'c',text:'Is too simple'},{id:'d',text:'Has too few parameters'}],'b','Overfitting: model memorises training data but fails to generalise — high train acc, low test acc.',5),
    q('Why use StandardScaler with sklearn?',[{id:'a',text:'To speed up model training'},{id:'b',text:'To normalise features to zero mean and unit variance — required by distance-based and gradient-based models'},{id:'c',text:'To encode categorical variables'},{id:'d',text:'To fill missing values'}],'b','StandardScaler prevents large-magnitude features from dominating distance/gradient calculations.',6),
    q('Which metric is misleading for imbalanced datasets?',[{id:'a',text:'F1-score'},{id:'b',text:'AUC-ROC'},{id:'c',text:'Accuracy'},{id:'d',text:'Precision-Recall'}],'c','Accuracy is misleading for imbalanced data — 95% accuracy with 95% majority class is useless.',7),
    q('The validation set is used for:',[{id:'a',text:'Final model evaluation'},{id:'b',text:'Hyperparameter tuning during development'},{id:'c',text:'Training the model'},{id:'d',text:'Data collection'}],'b','Validation set guides hyperparameter selection — but must not influence the final test evaluation.',8),
    q('What does model.predict() return?',[{id:'a',text:'Training accuracy'},{id:'b',text:'Model parameters'},{id:'c',text:'Predicted labels/values for new inputs'},{id:'d',text:'Probability scores only'}],'c','predict() applies the learned model to new data and returns class labels or numeric predictions.',9),
  ]},

  {slug:'af-noob-34-data-preprocessing',title:'Data Preprocessing',description:'Handling missing values, encoding categoricals, scaling, outlier treatment, and train/test split strategies that make or break ML models.',orderIndex:34,xpReward:65,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 34 — Data Preprocessing

## Why Preprocessing?

Raw data is messy. ML models expect:
- No missing values
- Numeric inputs
- Features on comparable scales
- No extreme outliers

## Handling Missing Values

| Strategy | When to use |
|---------|------------|
| Drop rows | Few missing, random |
| Mean/median impute | Numeric, MAR |
| Mode impute | Categorical |
| Forward fill | Time series |
| Model-based impute | MCAR/MNAR, complex |

## Encoding Categorical Variables

| Method | When |
|--------|------|
| Label encoding | Ordinal categories (S < M < L) |
| One-hot encoding | Nominal categories (no order) |
| Ordinal encoding | Ordered categories |
| Target encoding | High-cardinality categoricals |

## Feature Scaling

| Method | Formula | Use case |
|--------|---------|---------|
| StandardScaler | (x-μ)/σ | Gaussian-like, SVM, LR |
| MinMaxScaler | (x-min)/(max-min) | Neural networks |
| RobustScaler | (x-Q2)/(Q3-Q1) | Outliers present |

**Important:** Fit scalers on TRAIN set only, then transform both train and test.`,
  codeExample:`import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split

np.random.seed(42)

# === Create messy dataset ===
df = pd.DataFrame({
    'age':    [25, np.nan, 35, 45, 28, np.nan, 52, 33],
    'salary': [50000, 60000, np.nan, 80000, 55000, 62000, np.nan, 71000],
    'dept':   ['Eng', 'HR', 'Eng', 'HR', 'Fin', 'Eng', 'Fin', 'HR'],
    'level':  ['Junior', 'Senior', 'Mid', 'Senior', 'Junior', 'Mid', 'Senior', 'Mid'],
    'promoted': [0, 1, 0, 1, 0, 1, 1, 0]
})

print("=== Raw Data ===")
print(df.to_string())
print(f"\nMissing values:\n{df.isnull().sum()}")

# === 1. Handle Missing Values ===
print("\n=== After Imputation ===")
num_imputer = SimpleImputer(strategy='median')
df[['age','salary']] = num_imputer.fit_transform(df[['age','salary']])
print(f"age median fill:    {df['age'].values}")
print(f"salary median fill: {df['salary'].values}")

# === 2. Encode Categoricals ===
print("\n=== Encoding ===")
# One-hot for nominal (dept)
ohe = OneHotEncoder(sparse_output=False, drop='first')
dept_encoded = ohe.fit_transform(df[['dept']])
print(f"One-hot dept (drop first): categories={ohe.categories_}")
print(dept_encoded)

# Label encode for ordinal (level)
le = LabelEncoder()
df['level_enc'] = le.fit_transform(df['level'])
print(f"\nLabel encoded level: {dict(zip(le.classes_, le.transform(le.classes_)))}")

# === 3. Feature Scaling ===
X_num = df[['age','salary']].values
print("\n=== Feature Scaling ===")
ss = StandardScaler()
X_std = ss.fit_transform(X_num)
print(f"StandardScaler: mean={X_std.mean(axis=0).round(4)}, std={X_std.std(axis=0).round(4)}")

mm = MinMaxScaler()
X_mm = mm.fit_transform(X_num)
print(f"MinMaxScaler:   min={X_mm.min(axis=0).round(4)}, max={X_mm.max(axis=0).round(4)}")`,
  questions:[
    q('Why should you fit the scaler on training data only?',[{id:'a',text:'To save computation time'},{id:'b',text:'To avoid data leakage — test statistics must not influence training preprocessing'},{id:'c',text:'Because test data is smaller'},{id:'d',text:'Scalers cannot be applied to test data'}],'b','Fitting on all data leaks test statistics (mean, std) into preprocessing — inflating performance estimates.',0),
    q('One-hot encoding is best for:',[{id:'a',text:'Ordinal categories (Small, Medium, Large)'},{id:'b',text:'Nominal categories with no inherent order (color, department)'},{id:'c',text:'Numeric features'},{id:'d',text:'Binary features'}],'b','One-hot creates binary columns per category — no false ordinal relationship is imposed.',1),
    q('RobustScaler uses:',[{id:'a',text:'Mean and standard deviation'},{id:'b',text:'Min and max values'},{id:'c',text:'Median and IQR — resistant to outliers'},{id:'d',text:'Log transformation'}],'c','RobustScaler = (x - median) / IQR — unaffected by extreme outlier values.',2),
    q('For a feature with heavy outliers, the best imputation strategy for missing values is:',[{id:'a',text:'Mean imputation'},{id:'b',text:'Zero imputation'},{id:'c',text:'Median imputation'},{id:'d',text:'Drop all rows with missing values'}],'c','Median is resistant to outliers — mean gets pulled toward extreme values.',3),
    q('Label encoding should only be used for:',[{id:'a',text:'All categorical features'},{id:'b',text:'Ordinal categories where the order is meaningful'},{id:'c',text:'Nominal features with many categories'},{id:'d',text:'Continuous features'}],'b','Label encoding (1,2,3) implies ordinal relationship — only use when that order is real.',4),
    q('What does StandardScaler produce?',[{id:'a',text:'Values between 0 and 1'},{id:'b',text:'Zero mean and unit variance'},{id:'c',text:'Log-transformed values'},{id:'d',text:'Ranks of values'}],'b','StandardScaler: z = (x-μ)/σ → mean=0, std=1 across each feature.',5),
    q('Forward fill is most appropriate for:',[{id:'a',text:'Cross-sectional survey data'},{id:'b',text:'Time series data where the previous value carries forward'},{id:'c',text:'Image datasets'},{id:'d',text:'Text classification'}],'b','In time series, forward fill replaces missing values with the last observed value — natural for temporal data.',6),
    q('Target encoding encodes a categorical feature as:',[{id:'a',text:'A binary column'},{id:'b',text:'The mean of the target variable for each category'},{id:'c',text:'A random integer'},{id:'d',text:'An ordinal rank'}],'b','Target encoding replaces each category with the mean target — useful for high-cardinality features.',7),
    q('MinMaxScaler maps features to:',[{id:'a',text:'Standard normal distribution'},{id:'b',text:'Values between 0 and 1'},{id:'c',text:'Log scale'},{id:'d',text:'Rank-order values'}],'b','MinMaxScaler: x_scaled = (x - x_min)/(x_max - x_min), mapping to [0,1] (or custom range).',8),
    q('What is the danger of dropping rows with missing values?',[{id:'a',text:'It makes the scaler fail'},{id:'b',text:'It can introduce bias if data is not missing at random (MNAR)'},{id:'c',text:'It increases the dataset size'},{id:'d',text:'It causes overfitting'}],'b','If data is missing because of the value itself (e.g., high earners skip salary), dropping creates biased samples.',9),
  ]},

  {slug:'af-noob-35-feature-engineering',title:'Feature Engineering Basics',description:'Creating informative features — polynomial features, interaction terms, binning, log transforms, and domain-specific features that boost model performance.',orderIndex:35,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 35 — Feature Engineering Basics

## What is Feature Engineering?

> "Applied machine learning is basically feature engineering." — Andrew Ng

Feature engineering transforms raw data into **informative representations** that help models learn better patterns.

## Types of Feature Transformations

### Numeric Transformations
- **Log transform** — compresses right-skewed distributions
- **Square root** — similar, less aggressive
- **Polynomial** — adds x², x³, x·y terms
- **Binning** — convert continuous to discrete buckets

### Interaction Features
Multiply or combine two features to capture joint effects:
\`\`\`python
df['age_salary_ratio'] = df['age'] / df['salary']
df['bmi'] = df['weight_kg'] / df['height_m']**2
\`\`\`

### Date/Time Features
\`\`\`python
df['hour']    = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['is_weekend']  = df['day_of_week'] >= 5
\`\`\`

## Feature Selection

Too many features → overfitting + slow training.

| Method | How |
|--------|-----|
| Correlation filter | Remove highly correlated features |
| SelectKBest | Statistical test (chi2, F-stat) |
| Recursive Feature Elimination | Train, remove weakest |
| Feature importances | Tree model's built-in scores |`,
  codeExample:`import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.datasets import load_iris

np.random.seed(42)

# === 1. Log transform for skewed feature ===
print("=== Log Transform ===")
incomes = np.array([30000, 35000, 40000, 200000, 500000, 1000000])
print(f"Raw incomes:           {incomes}")
print(f"Log-transformed:       {np.log1p(incomes).round(2)}")
print(f"Raw std/mean ratio:    {incomes.std()/incomes.mean():.2f}")
print(f"Log std/mean ratio:    {np.log1p(incomes).std()/np.log1p(incomes).mean():.2f}")

# === 2. Polynomial features ===
print("\n=== Polynomial Features ===")
X_1d = np.linspace(0, 10, 40).reshape(-1, 1)
y_true = 2*X_1d.ravel()**2 - 3*X_1d.ravel() + 5 + np.random.randn(40)*10

Xtr, Xte, ytr, yte = train_test_split(X_1d, y_true, test_size=0.25, random_state=42)

for degree in [1, 2, 3]:
    poly = PolynomialFeatures(degree=degree, include_bias=False)
    Xtr_p = poly.fit_transform(Xtr)
    Xte_p = poly.transform(Xte)
    r2 = r2_score(yte, LinearRegression().fit(Xtr_p, ytr).predict(Xte_p))
    print(f"  Degree {degree}: {Xtr_p.shape[1]} features, R²={r2:.4f}")

# === 3. Interaction features ===
print("\n=== Interaction Features ===")
df = pd.DataFrame({
    'height_cm': [170, 180, 165, 175, 160],
    'weight_kg': [70, 90, 60, 80, 55],
    'age': [25, 30, 22, 35, 28]
})
df['bmi'] = df['weight_kg'] / (df['height_cm']/100)**2
df['age_bmi'] = df['age'] * df['bmi']  # interaction
print(df[['height_cm','weight_kg','bmi','age','age_bmi']].round(2))

# === 4. Feature selection ===
print("\n=== Feature Selection (SelectKBest) ===")
iris = load_iris()
X_i, y_i = iris.data, iris.target
selector = SelectKBest(f_classif, k=2)
X_selected = selector.fit_transform(X_i, y_i)
selected_features = np.array(iris.feature_names)[selector.get_support()]
print(f"All features: {iris.feature_names}")
print(f"Best 2 features: {selected_features}")
print(f"F-scores: {selector.scores_.round(2)}")`,
  questions:[
    q('What is feature engineering?',[{id:'a',text:'Building the neural network architecture'},{id:'b',text:'Transforming raw data into informative representations that help models learn better'},{id:'c',text:'Selecting the learning rate'},{id:'d',text:'Choosing the train/test split'}],'b','Feature engineering creates new or transformed features that make patterns more accessible to ML models.',0),
    q('Log transformation is applied to:',[{id:'a',text:'Normally distributed features'},{id:'b',text:'Right-skewed features (e.g., income) to compress extreme values'},{id:'c',text:'Binary features'},{id:'d',text:'All features automatically'}],'b','Log(x) compresses large values — useful for heavily skewed data like salaries or house prices.',1),
    q('Polynomial features of degree 2 for feature x include:',[{id:'a',text:'x only'},{id:'b',text:'x and x²'},{id:'c',text:'x, x², x³'},{id:'d',text:'Only x²'}],'b','PolynomialFeatures(degree=2) generates x and x² (plus interactions if multiple features).',2),
    q('An interaction feature captures:',[{id:'a',text:'The mean of two features'},{id:'b',text:'The combined effect of two features that linear models cannot detect alone'},{id:'c',text:'The difference between two features'},{id:'d',text:'The rank order of features'}],'b','Interaction terms (e.g., age × BMI) let linear models capture non-additive joint effects.',3),
    q('BMI = weight/height² is an example of:',[{id:'a',text:'One-hot encoding'},{id:'b',text:'Domain-specific feature engineering — combining raw measurements into a meaningful composite'},{id:'c',text:'Feature selection'},{id:'d',text:'Dimensionality reduction'}],'b','Domain knowledge creates powerful composite features — BMI encodes the relationship between weight and height.',4),
    q('Binning converts:',[{id:'a',text:'Categories to numbers'},{id:'b',text:'Continuous values to discrete categories (e.g., age → young/mid/senior)'},{id:'c',text:'Missing values to mean'},{id:'d',text:'Labels to probabilities'}],'b','Binning discretises continuous features — useful when the relationship with target is step-wise.',5),
    q('Feature selection reduces:',[{id:'a',text:'The training data size'},{id:'b',text:'The number of features to reduce overfitting, training time, and improve interpretability'},{id:'c',text:'The number of training samples'},{id:'d',text:'The learning rate'}],'b','Feature selection removes irrelevant/redundant features — key for regularisation and efficiency.',6),
    q('Which method uses the target variable to score features?',[{id:'a',text:'Variance threshold'},{id:'b',text:'Correlation with other features'},{id:'c',text:'SelectKBest with F-statistic or mutual information'},{id:'d',text:'PCA'}],'c','SelectKBest ranks features by their statistical association with the target (F-test for regression, chi2 for classification).',7),
    q('Hour-of-day extracted from a timestamp is:',[{id:'a',text:'A continuous feature that needs scaling'},{id:'b',text:'A cyclical feature — may benefit from sin/cos encoding'},{id:'c',text:'An interaction feature'},{id:'d',text:'A log-transformed feature'}],'b','Hour is cyclical (23 and 0 are close) — sin/cos encoding captures this: sin(2π·h/24), cos(2π·h/24).',8),
    q('High correlation between two features indicates:',[{id:'a',text:'They are both important'},{id:'b',text:'One may be redundant — multicollinearity can hurt linear models'},{id:'c',text:'They should be multiplied together'},{id:'d',text:'Log transformation is needed'}],'b','Highly correlated features provide redundant information and inflate variance in linear models (multicollinearity).',9),
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
