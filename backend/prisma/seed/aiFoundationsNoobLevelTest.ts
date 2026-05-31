/**
 * aiFoundationsNoobLevelTest.ts — NOOB Level Test (30 questions, all 10 blocks)
 * Creates a special capstone chapter with a 30-question level test quiz.
 * Run: cd backend && npm run seed:af-noob-level-test
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function q(text:string,options:{id:string;text:string}[],correctAnswer:string,explanation:string,orderIndex:number){return{text,options:JSON.stringify(options),correctAnswer,explanation,orderIndex};}
const COURSE_SLUG='foundations';

const LEVEL_TEST_CHAPTER = {
  slug: 'af-noob-level-test',
  title: 'NOOB Level Test',
  description: 'The comprehensive NOOB tier assessment — 30 questions covering all 10 blocks (Python, NumPy, Pandas, Linear Algebra, Calculus, Statistics, Intro ML, First Models, Evaluation, and Capstone concepts). Pass with 70% to unlock AMATEUR tier.',
  orderIndex: 51,
  xpReward: 500,
  difficulty: 'BEGINNER',
  tier: 'NOOB',
  language: 'python',
  content: `# NOOB Level Test

## Test Overview

This is your **NOOB Tier Level Test** — a 30-question comprehensive assessment covering all concepts from Chapters 1–50.

## Coverage

| Block | Chapters | Topics |
|-------|---------|--------|
| Block 1 | Ch 1–5 | Python Basics: Variables, Operators, Functions, Data Structures, File I/O |
| Block 2 | Ch 6–10 | OOP, Standard Library, NumPy Arrays, Operations, Linear Algebra |
| Block 3 | Ch 11–15 | Pandas DataFrames, Cleaning, GroupBy, Matplotlib, Seaborn |
| Block 4 | Ch 16–20 | Vectors, Matrices, Linear Equations, Eigenvalues, LA in ML |
| Block 5 | Ch 21–25 | Derivatives, Partial Derivatives, Gradient Descent, Chain Rule, Optimisers |
| Block 6 | Ch 26–30 | Descriptive Stats, Probability, Distributions, Hypothesis Testing, Bayesian |
| Block 7 | Ch 31–35 | What is ML, Types of ML, ML Pipeline, Preprocessing, Feature Engineering |
| Block 8 | Ch 36–40 | Linear Regression, Logistic Regression, kNN, Decision Trees, Naive Bayes |
| Block 9 | Ch 41–45 | CV Strategies, Classification Metrics, Regression Metrics, Bias-Variance, Regularisation |
| Block 10 | Ch 46–50 | Iris, House Prices, Spam, Segmentation, Portfolio |

## Rules

- 30 questions, 60 minutes
- Passing score: **70%** (21/30 correct)
- One attempt counts — take it when ready!
- Review the blocks where you scored lowest after completion

## What Happens Next?

Pass → **Unlock AMATEUR Tier** — Ensembles, SVMs, Unsupervised Learning, and Deep Learning await!`,
  codeExample: `# NOOB Level Test — Practice Code Review

import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from scipy import stats

print("=== NOOB LEVEL TEST — CONCEPT REVIEW ===")

# Block 1-2: Python + NumPy
arr = np.array([[1,2,3],[4,5,6],[7,8,9]])
print(f"\\nBlock 1-2: Array shape={arr.shape}, trace={np.trace(arr)}, det={np.linalg.det(arr):.1f}")

# Block 3: Pandas
df = pd.DataFrame({'A': [1,2,3,4,5], 'B': ['x','y','x','y','x'], 'C': [10,20,30,40,50]})
print(f"Block 3: GroupBy mean\\n{df.groupby('B')['C'].mean()}")

# Block 4-5: LA + Calculus
v = np.array([3.0, 4.0])
print(f"Block 4-5: |v|={np.linalg.norm(v)}, d/dx[x^3] at x=2 = {3*2**2}")

# Block 6: Statistics
data = np.random.normal(0, 1, 1000)
t_stat, p_val = stats.ttest_1samp(data, 0)
print(f"Block 6: 1-sample t-test p={p_val:.4f} ({'fail to reject H0' if p_val > 0.05 else 'reject H0'})")

# Block 7-8: ML Pipeline
iris = load_iris()
X_tr, X_te, y_tr, y_te = train_test_split(iris.data, iris.target, test_size=0.2, stratify=iris.target, random_state=42)
sc = StandardScaler()
lr = LogisticRegression(max_iter=1000)
lr.fit(sc.fit_transform(X_tr), y_tr)
print(f"Block 7-8: Logistic Regression test acc = {lr.score(sc.transform(X_te), y_te):.4f}")

# Block 9: Evaluation
cv = cross_val_score(LogisticRegression(max_iter=1000), sc.fit_transform(iris.data), iris.target, cv=10)
print(f"Block 9:  10-fold CV = {cv.mean():.4f} +/- {cv.std():.4f}")

print(f"\\nBlock 10: You built Iris, House Prices, Spam, and Segmentation projects!")
print(f"          NOOB tier complete — ready for AMATEUR! 🚀")`,
};

const QUESTIONS = [
  // Block 1: Python Basics
  q('What is the output of: list(range(2, 10, 3))?',[{id:'a',text:'[2, 5, 8]'},{id:'b',text:'[2, 4, 6, 8]'},{id:'c',text:'[3, 6, 9]'},{id:'d',text:'[2, 3, 4, 5, 6, 7, 8, 9]'}],'a','range(start, stop, step): 2, 2+3=5, 5+3=8, 8+3=11>10 stop. Result: [2, 5, 8].',0),
  q('What does the .get() method of a Python dict do?',[{id:'a',text:'Raises KeyError if key absent'},{id:'b',text:'Returns the value for a key, or a default if key is absent'},{id:'c',text:'Deletes a key'},{id:'d',text:'Returns all keys'}],'b','dict.get(key, default) safely retrieves values — no KeyError if key is missing.',1),

  // Block 2: NumPy + OOP
  q('What does np.dot(A, B) compute when A is (3,4) and B is (4,2)?',[{id:'a',text:'Element-wise product, shape (3,4)'},{id:'b',text:'Matrix product, shape (3,2)'},{id:'c',text:'Outer product, shape (3,4,4,2)'},{id:'d',text:'Error — shapes incompatible'}],'b','Matrix multiply: (3,4)·(4,2) = (3,2). Inner dimensions (4) must match.',2),
  q('In Python OOP, what does super().__init__() do in a subclass?',[{id:'a',text:'Creates a new class'},{id:'b',text:'Calls the parent class\'s __init__ method'},{id:'c',text:'Deletes inherited attributes'},{id:'d',text:'Makes a copy of the parent class'}],'b','super().__init__() invokes the parent\'s constructor, initialising inherited attributes.',3),

  // Block 3: Pandas
  q('Which Pandas method groups rows and computes aggregations?',[{id:'a',text:'merge()'},{id:'b',text:'pivot()'},{id:'c',text:'groupby()'},{id:'d',text:'join()'}],'c','groupby() splits data into groups and applies aggregation functions (sum, mean, count, etc.).',4),
  q('df.fillna(df.mean()) fills missing values with:',[{id:'a',text:'Zero'},{id:'b',text:'The column median'},{id:'c',text:'The column mean'},{id:'d',text:'The column mode'}],'c','fillna(df.mean()) replaces NaN with the mean of each numeric column.',5),

  // Block 4: Linear Algebra
  q('The dot product of [1,2,3] and [4,5,6] is:',[{id:'a',text:'32'},{id:'b',text:'15'},{id:'c',text:'6'},{id:'d',text:'[4,10,18]'}],'a','1·4 + 2·5 + 3·6 = 4 + 10 + 18 = 32.',6),
  q('A matrix A is invertible (non-singular) if and only if:',[{id:'a',text:'All eigenvalues are positive'},{id:'b',text:'det(A) ≠ 0'},{id:'c',text:'A is square'},{id:'d',text:'A is symmetric'}],'b','det(A) ≠ 0 ↔ A is invertible. det=0 means A is singular (rows are linearly dependent).',7),

  // Block 5: Calculus & Optimisation
  q('What does the gradient ∇f point toward?',[{id:'a',text:'The global minimum'},{id:'b',text:'The direction of steepest increase of f'},{id:'c',text:'The origin'},{id:'d',text:'The nearest local minimum'}],'b','The gradient points in the direction of steepest ascent — we go opposite for gradient descent.',8),
  q('Which optimiser combines momentum and adaptive learning rates?',[{id:'a',text:'SGD'},{id:'b',text:'RMSProp'},{id:'c',text:'Adam'},{id:'d',text:'Adagrad'}],'c','Adam = momentum (1st moment) + RMSProp (2nd moment) + bias correction — the default optimiser.',9),

  // Block 6: Statistics & Probability
  q('A p-value of 0.02 with significance level α=0.05 means:',[{id:'a',text:'Fail to reject H₀'},{id:'b',text:'Reject H₀ — statistically significant result'},{id:'c',text:'H₀ is 2% likely to be true'},{id:'d',text:'The test has 2% power'}],'b','p < α → reject H₀. p=0.02 < α=0.05 → statistically significant.',10),
  q('Which distribution is most commonly used for continuous features in Naive Bayes?',[{id:'a',text:'Binomial'},{id:'b',text:'Poisson'},{id:'c',text:'Gaussian (Normal)'},{id:'d',text:'Uniform'}],'c','GaussianNB assumes each feature follows N(μ_class, σ²_class) per class.',11),
  q('Bayes\' theorem updates our belief about θ using:',[{id:'a',text:'Only the prior'},{id:'b',text:'Prior × Likelihood ÷ Evidence'},{id:'c',text:'Only the likelihood'},{id:'d',text:'The posterior only'}],'b','P(θ|D) = P(D|θ)·P(θ) / P(D) — likelihood × prior normalised by evidence.',12),

  // Block 7: Intro ML
  q('Which of these is a supervised learning task?',[{id:'a',text:'K-Means clustering'},{id:'b',text:'PCA dimensionality reduction'},{id:'c',text:'Logistic regression classification'},{id:'d',text:'DBSCAN anomaly detection'}],'c','Supervised learning uses labelled (X,y) pairs. Logistic regression predicts class labels.',13),
  q('In the sklearn API, which method learns from data?',[{id:'a',text:'predict()'},{id:'b',text:'transform()'},{id:'c',text:'score()'},{id:'d',text:'fit()'}],'d','fit() trains the model on data — learning parameters from X (and y for supervised models).',14),
  q('Data leakage in ML occurs when:',[{id:'a',text:'The model has too many parameters'},{id:'b',text:'Test or future information contaminate the training process'},{id:'c',text:'Features are correlated'},{id:'d',text:'The learning rate is too high'}],'b','Leakage gives overly optimistic performance — e.g., fitting a scaler on train+test combined.',15),

  // Block 8: First Models
  q('Logistic regression uses which activation function to output probabilities?',[{id:'a',text:'ReLU'},{id:'b',text:'Tanh'},{id:'c',text:'Sigmoid'},{id:'d',text:'Softplus'}],'c','σ(z) = 1/(1+e⁻ᶻ) maps any real number to (0,1) — natural for binary probability output.',16),
  q('Decision trees select the best split by:',[{id:'a',text:'Random feature selection'},{id:'b',text:'Maximising information gain or minimising Gini impurity'},{id:'c',text:'Minimising the number of nodes'},{id:'d',text:'Gradient descent on the split threshold'}],'b','Trees greedily choose the split that creates the purest child nodes.',17),
  q('kNN requires feature scaling because:',[{id:'a',text:'kNN uses matrix multiplication'},{id:'b',text:'kNN uses Euclidean distance — large-scale features otherwise dominate neighbour selection'},{id:'c',text:'kNN is a parametric model'},{id:'d',text:'kNN cannot handle categorical data'}],'b','Without scaling, features with large values dominate distance calculations in kNN.',18),
  q('L2 regularisation (Ridge) adds to the loss function:',[{id:'a',text:'λ·Σ|wᵢ|'},{id:'b',text:'λ·Σwᵢ²'},{id:'c',text:'λ·max|wᵢ|'},{id:'d',text:'λ·rank(W)'}],'b','Ridge adds L2 penalty λΣwᵢ² — shrinks all weights toward zero, none exactly zero.',19),

  // Block 9: Evaluation
  q('Recall (sensitivity) = TP / ?',[{id:'a',text:'TP + FP'},{id:'b',text:'TP + FN'},{id:'c',text:'TN + FP'},{id:'d',text:'TP + TN + FP + FN'}],'b','Recall = TP/(TP+FN) — "of all actual positives, how many did we find?"',20),
  q('For cancer screening, you should optimise:',[{id:'a',text:'Precision — avoid bothering healthy patients'},{id:'b',text:'Accuracy — overall correctness'},{id:'c',text:'Recall — catch as many cancers as possible (minimise missed cases)'},{id:'d',text:'Specificity — identify healthy patients'}],'c','Missing a cancer (FN) is life-threatening — high recall is critical even at cost of false alarms.',21),
  q('What does R² = 0.85 mean for a regression model?',[{id:'a',text:'85% prediction accuracy'},{id:'b',text:'The model explains 85% of the variance in the target variable'},{id:'c',text:'RMSE = 0.85'},{id:'d',text:'85% of predictions are correct'}],'b','R² = 1 - SS_res/SS_tot. 0.85 means 85% of target variance is explained by the model.',22),
  q('A model with low training error and high test error has:',[{id:'a',text:'High bias'},{id:'b',text:'High variance (overfitting)'},{id:'c',text:'Low variance'},{id:'d',text:'Both low bias and variance'}],'b','Low train, high test = large generalisation gap = high variance = overfitting.',23),
  q('K-Fold cross-validation with K=10 and n=1000 samples trains each fold on:',[{id:'a',text:'100 samples'},{id:'b',text:'900 samples'},{id:'c',text:'1000 samples'},{id:'d',text:'500 samples'}],'b','10-fold: 1/10 = 100 samples validation, 9/10 = 900 samples training per fold.',24),

  // Block 10: Capstone & Pipeline
  q('In a complete ML pipeline, StandardScaler should be:',[{id:'a',text:'Fit on test data and applied to training'},{id:'b',text:'Fit on all data before splitting'},{id:'c',text:'Fit on training data only, then applied to test'},{id:'d',text:'Not used in pipelines'}],'c','Fit scaler on train only to prevent leaking test statistics into preprocessing.',25),
  q('The elbow method in K-Means determines:',[{id:'a',text:'The cluster centroids'},{id:'b',text:'Optimal K by finding where inertia decrease plateaus'},{id:'c',text:'The silhouette score'},{id:'d',text:'Feature importances'}],'b','Inertia drops steeply then flattens — the elbow = good balance between K and cluster quality.',26),
  q('TF-IDF downweights words that appear:',[{id:'a',text:'Rarely in the corpus'},{id:'b',text:'Only in spam emails'},{id:'c',text:'In many documents — common words carry less discriminative power'},{id:'d',text:'In long documents'}],'c','IDF = log(N/df) — high document frequency → low IDF → lower TF-IDF weight.',27),
  q('sklearn Pipeline with preprocessing + model ensures:',[{id:'a',text:'Faster training'},{id:'b',text:'Preprocessing is re-fit on each training fold during cross-validation — preventing leakage'},{id:'c',text:'Automatic hyperparameter tuning'},{id:'d',text:'Feature selection'}],'b','Pipeline applies fit_transform to train and transform to val in each CV fold — clean evaluation.',28),
  q('Which NOOB tier project involved unsupervised learning?',[{id:'a',text:'Iris Flower Classifier'},{id:'b',text:'House Price Prediction'},{id:'c',text:'Customer Segmentation with K-Means'},{id:'d',text:'Spam Detection'}],'c','Customer Segmentation uses K-Means — an unsupervised clustering algorithm with no labels.',29),
];

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: COURSE_SLUG } });
  if (!course) throw new Error(`Course "${COURSE_SLUG}" not found`);

  const existing = await prisma.chapter.findFirst({
    where: { courseId: course.id, slug: LEVEL_TEST_CHAPTER.slug },
  });
  if (existing) {
    console.log(`⏭  Skip  ${LEVEL_TEST_CHAPTER.slug}`);
    return;
  }

  const chapter = await prisma.chapter.create({
    data: { ...LEVEL_TEST_CHAPTER, courseId: course.id },
  });

  await prisma.quiz.create({
    data: {
      chapterId: chapter.id,
      title: 'NOOB Tier Level Test',
      description: 'Comprehensive 30-question assessment covering all NOOB tier concepts (Blocks 1–10). Pass with 70% to unlock the AMATEUR tier.',
      timeLimit: 3600,    // 60 minutes
      passingScore: 70,
      xpReward: 400,
      questions: { create: QUESTIONS },
    },
  });

  console.log(`✅ Created NOOB Level Test with 30 questions`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
