/**
 * aiFoundationsNoobBlock10.ts — NOOB Block 10 (Ch 46–50): NOOB Capstone Projects
 * Run: cd backend && npm run seed:af-noob-b10
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function q(text:string,options:{id:string;text:string}[],correctAnswer:string,explanation:string,orderIndex:number){return{text,options:JSON.stringify(options),correctAnswer,explanation,orderIndex};}
const COURSE_SLUG='foundations';

const CHAPTERS=[
  {slug:'af-noob-46-iris-capstone',title:'Capstone: Iris Flower Classifier',description:'End-to-end multiclass classification project — EDA, preprocessing, comparing 5 classifiers, evaluation, and interpreting results.',orderIndex:46,xpReward:100,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 46 — Capstone: Iris Flower Classifier

## Project Brief

Build a complete multiclass classifier for the famous Iris dataset — 150 samples, 4 features, 3 species.

## Project Steps

1. **Load & Explore** — understand data shape, distributions, correlations
2. **Visualise** — pairplots, class separation
3. **Preprocess** — scale features, stratified split
4. **Train & Compare** — at least 5 algorithms
5. **Evaluate** — accuracy, classification report, confusion matrix
6. **Interpret** — which features matter most?

## Key Concepts Practiced

- EDA with Pandas and statistics
- Stratified train/test split
- StandardScaler fit on train only
- Cross-validation comparison
- Feature importance from tree models
- Classification report interpretation

## Learning Outcomes

After this project you can:
- Run a complete end-to-end ML classification pipeline
- Select the best model with cross-validation
- Explain your results with metrics and visualisations
- Communicate findings clearly`,
  codeExample:`import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

# === 1. Load & Explore ===
iris = load_iris()
X, y = iris.data, iris.target
feature_names = iris.feature_names
class_names   = iris.target_names

print("=== IRIS CAPSTONE PROJECT ===")
print(f"\n1. DATA OVERVIEW")
print(f"   Shape     : {X.shape}")
print(f"   Features  : {feature_names}")
print(f"   Classes   : {class_names}")
print(f"   Class dist: {np.bincount(y)}")

print("\n2. FEATURE STATISTICS")
for i, feat in enumerate(feature_names):
    print(f"   {feat:30s}: μ={X[:,i].mean():.2f}  σ={X[:,i].std():.2f}  "
          f"[{X[:,i].min():.1f}, {X[:,i].max():.1f}]")

# === 2. Preprocess ===
print("\n3. PREPROCESSING")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)
print(f"   Train: {X_train_s.shape}  Test: {X_test_s.shape}")

# === 3. Train & Compare ===
print("\n4. MODEL COMPARISON (5-fold CV on training set)")
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
    'Decision Tree':        DecisionTreeClassifier(max_depth=4, random_state=42),
    'Random Forest':        RandomForestClassifier(n_estimators=100, random_state=42),
    'kNN (k=5)':            KNeighborsClassifier(n_neighbors=5),
    'Naive Bayes':          GaussianNB(),
}

results = {}
print(f"{'Model':20} | {'CV Mean':>8} | {'CV Std':>7} | {'Test Acc':>9}")
print("-"*55)
for name, model in models.items():
    cv = cross_val_score(model, X_train_s, y_train, cv=5, scoring='accuracy')
    model.fit(X_train_s, y_train)
    test_acc = model.score(X_test_s, y_test)
    results[name] = test_acc
    print(f"{name:20} | {cv.mean():8.4f} | {cv.std():7.4f} | {test_acc:9.4f}")

# === 4. Best Model Evaluation ===
best_name = max(results, key=results.get)
best_model = models[best_name]
print(f"\n5. BEST MODEL: {best_name}")
y_pred = best_model.predict(X_test_s)

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=class_names))

print("Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
for i, row in enumerate(cm):
    print(f"  {class_names[i]:12}: {row}")

# === 5. Feature Importance ===
print("\n6. FEATURE IMPORTANCE (Random Forest)")
rf = models['Random Forest']
for feat, imp in sorted(zip(feature_names, rf.feature_importances_),
                         key=lambda x: -x[1]):
    bar = '█' * int(imp * 30)
    print(f"  {feat:30s}: {imp:.4f} {bar}")`,
  questions:[
    q('Which sklearn function preserves class proportions in train/test split?',[{id:'a',text:'train_test_split with shuffle=True'},{id:'b',text:'train_test_split with stratify=y'},{id:'c',text:'KFold with n_splits=5'},{id:'d',text:'cross_val_score'}],'b','stratify=y ensures the class distribution is maintained in both train and test sets.',0),
    q('In the Iris classification task, the number of classes is:',[{id:'a',text:'2'},{id:'b',text:'4'},{id:'c',text:'3'},{id:'d',text:'150'}],'c','Iris has 3 classes: setosa, versicolor, virginica — a classic multiclass problem.',1),
    q('Why fit StandardScaler on training data only?',[{id:'a',text:'It is faster'},{id:'b',text:'To prevent test set statistics from leaking into the training pipeline'},{id:'c',text:'The scaler cannot handle test data'},{id:'d',text:'Test data is already normalised'}],'b','Fitting on all data leaks test statistics — must fit_transform on train, transform on test.',2),
    q('Cross-validation is used in model comparison to:',[{id:'a',text:'Reduce the number of models to compare'},{id:'b',text:'Get a more reliable performance estimate that is less dependent on a single split'},{id:'c',text:'Train the final model'},{id:'d',text:'Tune the test set'}],'b','CV provides a stable estimate by averaging over K different train/validation splits.',3),
    q('Feature importance from Random Forest tells you:',[{id:'a',text:'Which features are correlated'},{id:'b',text:'Which features contributed most to reducing impurity across all trees'},{id:'c',text:'Which features to add'},{id:'d',text:'Which samples are outliers'}],'b','RF feature importance = total Gini reduction attributed to each feature across all tree splits.',4),
    q('The classification report shows precision, recall, and F1-score:',[{id:'a',text:'Only for the positive class'},{id:'b',text:'Per class and as macro/weighted averages'},{id:'c',text:'Only as a single overall score'},{id:'d',text:'For regression tasks'}],'b','classification_report() shows per-class and aggregate metrics for all classes.',5),
    q('If Logistic Regression achieves 97% CV accuracy on Iris, you should:',[{id:'a',text:'Immediately use it in production'},{id:'b',text:'Still evaluate on the held-out test set as the final unbiased estimate'},{id:'c',text:'Run more cross-validation rounds'},{id:'d',text:'Switch to a more complex model'}],'b','CV accuracy estimates generalisation but the test set gives the official final score.',6),
    q('A confusion matrix cell where actual=setosa but predicted=versicolor represents:',[{id:'a',text:'True positive'},{id:'b',text:'A false positive for versicolor / false negative for setosa'},{id:'c',text:'True negative'},{id:'d',text:'Perfect classification'}],'b','Off-diagonal confusion matrix entries represent misclassifications between classes.',7),
    q('Which Iris feature is most discriminative according to Random Forest?',[{id:'a',text:'sepal length'},{id:'b',text:'sepal width'},{id:'c',text:'petal length or petal width (both are typically top features)'},{id:'d',text:'All features are equal'}],'c','Petal features separate Iris species better than sepal features — setosa has very small petals.',8),
    q('What does macro-average F1-score in a classification report mean?',[{id:'a',text:'F1 weighted by class frequency'},{id:'b',text:'Unweighted average of per-class F1 scores'},{id:'c',text:'F1 for the majority class only'},{id:'d',text:'The same as accuracy'}],'b','Macro F1 = mean(F1 per class) — treats all classes equally regardless of support.',9),
  ]},

  {slug:'af-noob-47-house-prices',title:'Capstone: House Price Prediction',description:'End-to-end regression project — feature engineering, handling missing values, comparing regressors, and evaluating with RMSE and R².',orderIndex:47,xpReward:100,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 47 — Capstone: House Price Prediction

## Project Brief

Predict house prices using the California Housing dataset. Apply the full regression pipeline.

## Project Steps

1. **Load & EDA** — understand features, target distribution, correlations
2. **Feature Engineering** — log-transform skewed target, interaction features
3. **Preprocess** — scale, handle skew
4. **Train** — Linear, Ridge, Lasso, Decision Tree, Random Forest
5. **Evaluate** — RMSE, MAE, R² on test set
6. **Analyse residuals** — check model assumptions

## Key Concepts Practiced

- Log-transforming skewed continuous targets
- Correlation analysis for feature selection
- Comparing regression algorithms
- Residual diagnostic plots
- Interpreting R² and RMSE together

## Domain Insights

House price drivers:
- Median income (strongest predictor)
- Location (latitude, longitude)
- House age
- Population density`,
  codeExample:`import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

# === 1. Load Data ===
print("=== HOUSE PRICE PREDICTION CAPSTONE ===")
housing = fetch_california_housing()
X, y = housing.data, housing.target  # target in $100k
feature_names = housing.feature_names

print(f"\n1. DATA OVERVIEW")
print(f"   Shape: {X.shape}  Target range: [{y.min():.2f}, {y.max():.2f}] ($100k)")

print("\n2. FEATURE STATS & CORRELATIONS WITH TARGET")
correlations = np.array([np.corrcoef(X[:,i], y)[0,1] for i in range(X.shape[1])])
for feat, corr, mean_v in zip(feature_names, correlations, X.mean(axis=0)):
    print(f"   {feat:12s}: corr={corr:6.3f}  mean={mean_v:.3f}")

# === 2. Preprocess ===
print("\n3. PREPROCESSING")
# Log-transform target (prices are right-skewed)
y_log = np.log1p(y)
print(f"   Original y: skew≈{((y - y.mean())**3).mean() / y.std()**3:.2f}")
print(f"   Log y:      skew≈{((y_log - y_log.mean())**3).mean() / y_log.std()**3:.2f}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y_log, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# === 3. Model Comparison ===
print("\n4. MODEL COMPARISON (RMSE on log-target)")
models = {
    'Linear Regression': LinearRegression(),
    'Ridge (α=1)':       Ridge(alpha=1.0),
    'Lasso (α=0.01)':    Lasso(alpha=0.01),
    'Decision Tree':     DecisionTreeRegressor(max_depth=8, random_state=42),
    'Random Forest':     RandomForestRegressor(n_estimators=50, random_state=42),
}
print(f"{'Model':20} | {'Train RMSE':>11} | {'Test RMSE':>10} | {'Test R²':>8}")
print("-"*58)
for name, model in models.items():
    model.fit(X_train_s, y_train)
    tr_pred = model.predict(X_train_s)
    te_pred = model.predict(X_test_s)
    tr_rmse = np.sqrt(mean_squared_error(y_train, tr_pred))
    te_rmse = np.sqrt(mean_squared_error(y_test,  te_pred))
    te_r2   = r2_score(y_test, te_pred)
    print(f"{name:20} | {tr_rmse:11.4f} | {te_rmse:10.4f} | {te_r2:8.4f}")

# === 4. Best model residuals ===
print("\n5. RESIDUAL ANALYSIS (Random Forest)")
rf = models['Random Forest']
residuals = y_test - rf.predict(X_test_s)
print(f"   Mean residual: {residuals.mean():.4f}  (should be ≈ 0)")
print(f"   Std residual:  {residuals.std():.4f}")
print(f"   Residuals within 1 std: {np.mean(np.abs(residuals) < residuals.std())*100:.1f}%")

print("\n6. FEATURE IMPORTANCES (Random Forest)")
for feat, imp in sorted(zip(feature_names, rf.feature_importances_), key=lambda x: -x[1]):
    print(f"   {feat:12s}: {imp:.4f} {'█'*int(imp*30)}")`,
  questions:[
    q('Why log-transform a right-skewed target variable?',[{id:'a',text:'To normalise features'},{id:'b',text:'To compress extreme values and make the distribution more symmetric — improving regression performance'},{id:'c',text:'Because linear regression requires log inputs'},{id:'d',text:'To handle missing values'}],'b','Log-transform reduces skewness, making residuals more normally distributed — improving OLS assumptions.',0),
    q('Which feature is typically most correlated with California house prices?',[{id:'a',text:'Housing median age'},{id:'b',text:'Average rooms per household'},{id:'c',text:'Median income'},{id:'d',text:'Population'}],'c','MedInc (median income) has the highest positive correlation with house prices in California Housing.',1),
    q('RMSE is preferred over MSE for interpretation because:',[{id:'a',text:'RMSE is always smaller'},{id:'b',text:'RMSE is in the same units as the target — easier to communicate'},{id:'c',text:'RMSE penalises outliers less'},{id:'d',text:'RMSE requires no square root'}],'b','RMSE = √MSE restores the unit (e.g., $100k) — RMSE=0.3 means ≈$30k average error.',2),
    q('In the residual analysis, mean residual ≈ 0 indicates:',[{id:'a',text:'The model is overfit'},{id:'b',text:'The model\'s predictions are unbiased on average'},{id:'c',text:'RMSE is also zero'},{id:'d',text:'All residuals are zero'}],'b','Zero mean residual means no systematic over- or under-prediction.',3),
    q('Decision Tree with max_depth=None on a large dataset will:',[{id:'a',text:'Give the best test RMSE'},{id:'b',text:'Have very low train RMSE but higher test RMSE (overfitting)'},{id:'c',text:'Underfit the data'},{id:'d',text:'Give the same result as Linear Regression'}],'b','Unlimited depth → tree memorises training data → low train error, poor generalisation.',4),
    q('Random Forest outperforms a single Decision Tree because:',[{id:'a',text:'It uses gradient descent'},{id:'b',text:'It averages many diverse trees, reducing variance without increasing bias much'},{id:'c',text:'It uses deeper trees'},{id:'d',text:'It applies L2 regularisation'}],'b','Random Forest = bagging + random feature subsets → diverse, low-variance ensemble.',5),
    q('Pearson correlation ≈ -0.1 between a feature and target means:',[{id:'a',text:'Strong negative relationship'},{id:'b',text:'Very weak negative linear relationship'},{id:'c',text:'No relationship at all'},{id:'d',text:'A perfect negative relationship'}],'b','Correlation of -0.1 indicates a very weak negative linear association — near zero.',6),
    q('After log-transforming the target, the model\'s RMSE is in:',[{id:'a',text:'Original price units'},{id:'b',text:'Log-transformed units — must exponentiate predictions for original scale'},{id:'c',text:'Percentage units'},{id:'d',text:'Standardised units'}],'b','When training on log(y), predictions are in log space — use exp(prediction) to get original scale.',7),
    q('Which metric would you report to a non-technical stakeholder?',[{id:'a',text:'Log RMSE'},{id:'b',text:'R²'},{id:'c',text:'RMSE in original price units ($)'},{id:'d',text:'Gini impurity'}],'c','RMSE in dollars (e.g., "average error of $25,000") is interpretable to non-technical audiences.',8),
    q('Feature importance showing latitude/longitude high suggests:',[{id:'a',text:'The model is overfitting'},{id:'b',text:'Location is a key driver of house prices'},{id:'c',text:'These features should be removed'},{id:'d',text:'The model is underfitting'}],'b','High importance for spatial features reflects the well-known geographic influence on real estate prices.',9),
  ]},

  {slug:'af-noob-48-spam-detection',title:'Capstone: Spam Detection with NLP Basics',description:'Text classification pipeline — bag of words, TF-IDF, Naive Bayes and Logistic Regression — building a production-ready spam filter.',orderIndex:48,xpReward:100,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 48 — Capstone: Spam Detection with NLP Basics

## Project Brief

Build a spam classifier using text data. Learn text preprocessing and feature extraction.

## Text-to-Features Pipeline

\`\`\`
Raw Text
  → Lowercase + punctuation removal
  → Tokenisation (split into words)
  → Stop word removal (a, the, is...)
  → Stemming/Lemmatisation
  → Feature extraction: Bag of Words or TF-IDF
  → ML Classifier (Naive Bayes, Logistic Regression)
\`\`\`

## Bag of Words (BoW)

Build vocabulary of all words. Each document = vector of word counts.

## TF-IDF (Term Frequency - Inverse Document Frequency)

$$\\text{TF-IDF}(t,d) = \\text{TF}(t,d) \\cdot \\log\\frac{N}{df(t)}$$

Downweights common words, upweights rare but informative words.

## Evaluation for Spam

Key metrics:
- **Precision** — how often spam predictions are correct (false alarm rate)
- **Recall** — what fraction of spam is caught
- **F1** — balance

Prefer high recall for spam (don't miss spam) with acceptable precision.`,
  codeExample:`import numpy as np
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB, ComplementNB
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings('ignore')

# === Simulate spam dataset ===
print("=== SPAM DETECTION CAPSTONE ===")

spam_msgs = [
    "FREE iPhone! Click now to claim your prize WINNER",
    "URGENT: Your account needs verification CLICK HERE",
    "Make $5000 per day from home! Limited offer",
    "Congratulations! You won a FREE vacation package",
    "Buy cheap medications no prescription needed",
    "Get rich quick guaranteed investment 1000%",
    "WIN a luxury car! Reply with your details",
    "FREE gift card! You have been selected WINNER",
    "Earn money fast working from home no experience",
    "Special offer discount 90% off today only click",
    "FINAL NOTICE: Your account suspended click verify",
    "Casino jackpot winner claim prize million dollars",
]
ham_msgs = [
    "Can we reschedule tomorrow's team meeting?",
    "Please review the attached quarterly report",
    "The project deadline has been moved to Friday",
    "Thanks for sending the documents, I'll review them",
    "Are you free for a call this afternoon?",
    "Please find the updated budget forecast attached",
    "The client presentation is ready for your review",
    "I'll be in the office from 9am, see you then",
    "Could you send me the latest project status?",
    "Meeting notes from yesterday are in the shared folder",
    "Happy to help with the analysis, just let me know",
    "The engineering team has fixed the deployment issue",
]

texts  = spam_msgs + ham_msgs
labels = [1]*len(spam_msgs) + [0]*len(ham_msgs)
labels = np.array(labels)

X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.25, random_state=42, stratify=labels)

print(f"\n1. DATASET: {len(texts)} messages ({sum(labels)} spam, {len(labels)-sum(labels)} ham)")

# === Pipelines ===
print("\n2. MODEL COMPARISON")
pipelines = {
    'BoW + Naive Bayes':   Pipeline([('vec', CountVectorizer()), ('clf', MultinomialNB())]),
    'TF-IDF + Naive Bayes':Pipeline([('vec', TfidfVectorizer()), ('clf', MultinomialNB())]),
    'TF-IDF + LogReg':     Pipeline([('vec', TfidfVectorizer()), ('clf', LogisticRegression(max_iter=500))]),
    'TF-IDF + CompNB':     Pipeline([('vec', TfidfVectorizer()), ('clf', ComplementNB())]),
}

for name, pipe in pipelines.items():
    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)
    from sklearn.metrics import f1_score, precision_score, recall_score
    print(f"\n{name}:")
    print(f"  Precision={precision_score(y_test,preds):.3f}  Recall={recall_score(y_test,preds):.3f}  F1={f1_score(y_test,preds):.3f}")

# === Best model: TF-IDF + LogReg ===
print("\n3. DETAILED EVALUATION (TF-IDF + LogReg)")
best = pipelines['TF-IDF + LogReg']
preds = best.predict(X_test)
print(classification_report(y_test, preds, target_names=['Ham','Spam']))

# === New message prediction ===
print("4. CLASSIFY NEW MESSAGES")
new_msgs = [
    "FREE money click here win prize NOW",
    "Let's sync up on the product roadmap next week",
    "Your invoice for the subscription is attached",
    "WINNER WINNER claim your FREE iPhone today",
]
for msg in new_msgs:
    pred = best.predict([msg])[0]
    prob = best.predict_proba([msg])[0]
    print(f"  {'SPAM' if pred else 'HAM ':4s} (p={prob[1]:.3f}) | {msg[:55]}")`,
  questions:[
    q('TF-IDF downweights words that are:',[{id:'a',text:'Rare in the corpus'},{id:'b',text:'Common across many documents — uninformative for distinguishing documents'},{id:'c',text:'Short in length'},{id:'d',text:'In the training set only'}],'b','IDF = log(N/df) — words appearing in many documents get low IDF, reducing their TF-IDF score.',0),
    q('CountVectorizer produces:',[{id:'a',text:'TF-IDF weights'},{id:'b',text:'Word embedding vectors'},{id:'c',text:'A sparse matrix of word counts (Bag of Words)'},{id:'d',text:'Character n-grams'}],'c','CountVectorizer creates a vocabulary and represents each document as a vector of word frequencies.',1),
    q('sklearn Pipeline is used to:',[{id:'a',text:'Speed up training'},{id:'b',text:'Chain preprocessing and model steps — ensuring they are applied consistently'},{id:'c',text:'Stack multiple datasets'},{id:'d',text:'Perform cross-validation automatically'}],'b','Pipeline chains fit_transform/transform operations — prevents leakage and simplifies cross-validation.',2),
    q('For spam detection, which is more costly — a false positive or false negative?',[{id:'a',text:'They are equally costly'},{id:'b',text:'False positive (ham marked as spam) — user loses legitimate email'},{id:'c',text:'False negative (spam in inbox) — depends on context'},{id:'d',text:'Both are equally acceptable'}],'b','FP (spam) = legitimate email sent to spam — annoying. FN (ham) = spam in inbox — also bad. Balance depends on policy.',3),
    q('Complement Naive Bayes (ComplementNB) is designed for:',[{id:'a',text:'Continuous features'},{id:'b',text:'Imbalanced text classification'},{id:'c',text:'Regression tasks'},{id:'d',text:'Image data'}],'b','ComplementNB models the complement of each class — better than MultinomialNB for imbalanced text.',4),
    q('Stop words in NLP are:',[{id:'a',text:'Words that stop the tokeniser'},{id:'b',text:'Very common words (the, a, is) that carry little semantic value'},{id:'c',text:'Words that cause errors'},{id:'d',text:'Out-of-vocabulary words'}],'b','Stop words are filtered out to reduce noise and vocabulary size — they rarely help classification.',5),
    q('TF (Term Frequency) for a word in a document is:',[{id:'a',text:'Number of documents containing the word'},{id:'b',text:'Count of the word in the document (possibly normalised)'},{id:'c',text:'Log of the word frequency across corpus'},{id:'d',text:'Inverse of the document frequency'}],'b','TF = count(word in doc) / total words in doc (or just raw count) — how often a term appears.',6),
    q('The vocabulary size in CountVectorizer is:',[{id:'a',text:'Always 1000'},{id:'b',text:'The number of unique words across all training documents'},{id:'c',text:'The number of training documents'},{id:'d',text:'Fixed by the user'}],'b','Vocabulary = all unique tokens in training corpus. Large corpora → large (sparse) feature matrices.',7),
    q('Why use cross-validation for text classifiers on small datasets?',[{id:'a',text:'Text models cannot use holdout'},{id:'b',text:'To get a reliable accuracy estimate despite small sample size'},{id:'c',text:'Cross-validation is required by sklearn pipelines'},{id:'d',text:'To increase the vocabulary'}],'b','Small datasets have high evaluation variance — CV provides a more reliable performance estimate.',8),
    q('predict_proba() in a text classifier returns:',[{id:'a',text:'Class labels'},{id:'b',text:'Probability of each class — useful for adjusting the decision threshold'},{id:'c',text:'TF-IDF weights'},{id:'d',text:'Word importances'}],'b','predict_proba() gives class probabilities — adjust threshold to trade precision/recall.',9),
  ]},

  {slug:'af-noob-49-customer-segmentation',title:'Capstone: Customer Segmentation',description:'Unsupervised learning project — K-Means clustering, the elbow method, cluster profiling, and actionable business insights.',orderIndex:49,xpReward:100,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 49 — Capstone: Customer Segmentation

## Project Brief

Segment customers into meaningful groups using K-Means clustering — without any labels. This is a classic unsupervised learning business problem.

## Business Value

- **Targeted marketing** — different offers per segment
- **Product development** — features for each group
- **Customer lifetime value** — predict churn risk

## Project Steps

1. Generate/load customer data (RFM or demographic)
2. Preprocess — scale features
3. Choose K — elbow method (inertia), silhouette score
4. Fit K-Means and assign labels
5. Profile clusters — mean feature values per cluster
6. Name and interpret clusters

## RFM Analysis

| Feature | Meaning |
|---------|---------|
| Recency | Days since last purchase |
| Frequency | Number of purchases |
| Monetary | Total spend |

## Cluster Quality Metrics

- **Inertia** — within-cluster sum of squares (lower = tighter clusters)
- **Silhouette score** — how similar a point is to its cluster vs nearest neighbour (–1 to 1, higher is better)`,
  codeExample:`import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
print("=== CUSTOMER SEGMENTATION CAPSTONE ===")

# === 1. Generate synthetic customer data (RFM) ===
n_customers = 300

# 4 natural customer groups
segments = [
    {'n':80, 'r_mean':5,   'r_std':3,  'f_mean':15, 'f_std':5,  'm_mean':2000, 'm_std':500},  # Champions
    {'n':80, 'r_mean':30,  'r_std':10, 'f_mean':8,  'f_std':3,  'm_mean':800,  'm_std':200},   # Loyal
    {'n':70, 'r_mean':80,  'r_std':20, 'f_mean':2,  'f_std':1,  'm_mean':200,  'm_std':100},   # At-risk
    {'n':70, 'r_mean':150, 'r_std':30, 'f_mean':1,  'f_std':0.5,'m_mean':50,   'm_std':30},    # Churned
]

all_data = []
for seg in segments:
    r = np.abs(np.random.normal(seg['r_mean'], seg['r_std'], seg['n']))
    f = np.abs(np.random.normal(seg['f_mean'], seg['f_std'], seg['n']))
    m = np.abs(np.random.normal(seg['m_mean'], seg['m_std'], seg['n']))
    all_data.append(np.column_stack([r, f, m]))

X_raw = np.vstack(all_data)
feature_names = ['Recency', 'Frequency', 'Monetary']

print(f"\n1. DATA: {X_raw.shape[0]} customers, {X_raw.shape[1]} RFM features")
for i, feat in enumerate(feature_names):
    print(f"   {feat:12s}: μ={X_raw[:,i].mean():.1f}  σ={X_raw[:,i].std():.1f}")

# === 2. Preprocess ===
scaler = StandardScaler()
X = scaler.fit_transform(X_raw)

# === 3. Elbow Method ===
print("\n2. ELBOW METHOD (find optimal K)")
inertias, sil_scores = [], []
K_range = range(2, 9)
for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)
    sil_scores.append(silhouette_score(X, km.labels_))
    print(f"   K={k}: inertia={km.inertia_:.1f}  silhouette={sil_scores[-1]:.4f}")

best_k = K_range[np.argmax(sil_scores)]
print(f"\n   → Optimal K = {best_k} (highest silhouette)")

# === 4. Final Clustering ===
print(f"\n3. CLUSTER PROFILES (K={best_k})")
km_final = KMeans(n_clusters=best_k, random_state=42, n_init=10)
labels = km_final.fit_predict(X)

# Un-scale centroids for interpretability
centroids_orig = scaler.inverse_transform(km_final.cluster_centers_)
segment_names = ['Champions', 'Loyal', 'At-Risk', 'Churned']

print(f"{'Cluster':>8} | {'Size':>5} | {'Recency':>8} | {'Frequency':>10} | {'Monetary':>10} | Label")
print("-"*70)
for c in range(best_k):
    size = np.sum(labels == c)
    r, f, m = centroids_orig[c]
    # Name based on RFM values
    if r < 20 and f > 10: name = 'Champions'
    elif r < 50 and f > 5: name = 'Loyal'
    elif f < 3 and m < 300: name = 'Churned'
    else: name = 'At-Risk'
    print(f"{c:8d} | {size:5d} | {r:8.1f} | {f:10.1f} | {m:10.1f} | {name}")`,
  questions:[
    q('K-Means requires you to specify:',[{id:'a',text:'The cluster labels in advance'},{id:'b',text:'The number of clusters K before fitting'},{id:'c',text:'The features to cluster on (selected automatically)'},{id:'d',text:'Labelled training data'}],'b','K-Means needs K specified upfront — the elbow method or silhouette score helps choose it.',0),
    q('The elbow method plots:',[{id:'a',text:'Silhouette score vs K'},{id:'b',text:'Within-cluster inertia vs K — the "elbow" indicates optimal K'},{id:'c',text:'Accuracy vs K'},{id:'d',text:'Number of outliers vs K'}],'b','Inertia drops sharply then levels off — the elbow point balances compression and cluster quality.',1),
    q('The silhouette score ranges from -1 to 1, where 1 means:',[{id:'a',text:'Only one cluster was found'},{id:'b',text:'The sample is perfectly matched to its cluster and far from others'},{id:'c',text:'All clusters are equal size'},{id:'d',text:'K=1'}],'b','Silhouette=1 → dense, well-separated clusters. 0 → on boundary. -1 → wrong cluster.',2),
    q('Why scale features before K-Means?',[{id:'a',text:'K-Means requires integer inputs'},{id:'b',text:'K-Means uses Euclidean distance — high-scale features dominate otherwise'},{id:'c',text:'To reduce the number of clusters'},{id:'d',text:'To remove outliers'}],'b','Without scaling, monetary values ($2000) would dominate frequency (15) and recency (5).',3),
    q('RFM stands for:',[{id:'a',text:'Rate, Frequency, Multiplier'},{id:'b',text:'Recency, Frequency, Monetary — a classic customer analytics framework'},{id:'c',text:'Random, Fixed, Marginal'},{id:'d',text:'Regression, Features, Model'}],'b','RFM is widely used in marketing to characterise customer purchasing behaviour.',4),
    q('K-Means inertia measures:',[{id:'a',text:'Distance between cluster centroids'},{id:'b',text:'Within-cluster sum of squared distances to centroids'},{id:'c',text:'Silhouette score'},{id:'d',text:'Number of outliers'}],'b','Inertia = Σ Σ ‖xᵢ - μₖ‖² for each point xᵢ in cluster k — lower = tighter clusters.',5),
    q('A "Champions" customer segment typically has:',[{id:'a',text:'High recency, low frequency, low monetary'},{id:'b',text:'Low recency (recent), high frequency, high monetary — the best customers'},{id:'c',text:'High recency (not recent), low frequency'},{id:'d',text:'All metrics equal to average'}],'b','Champions bought recently, buy often, and spend the most — top customer tier.',6),
    q('K-Means centroid represents:',[{id:'a',text:'The sample closest to the cluster centre'},{id:'b',text:'The mean of all samples in the cluster in feature space'},{id:'c',text:'The median of the cluster'},{id:'d',text:'The largest sample in the cluster'}],'b','Centroid = mean position of all points assigned to that cluster.',7),
    q('PCA is useful in segmentation because:',[{id:'a',text:'It improves K-Means accuracy'},{id:'b',text:'It reduces dimensions for 2D/3D visualisation of clusters'},{id:'c',text:'It selects the optimal K'},{id:'d',text:'It removes outliers'}],'b','PCA to 2D enables visualising cluster separation — important for communicating results.',8),
    q('Business action after segmentation might be:',[{id:'a',text:'Deleting outlier customers'},{id:'b',text:'Sending targeted retention campaigns to "At-Risk" segment'},{id:'c',text:'Changing the ML model'},{id:'d',text:'Adding more features'}],'b','Segmentation drives action — e.g., win-back offers for churned, loyalty rewards for champions.',9),
  ]},

  {slug:'af-noob-50-portfolio',title:'Capstone: Building Your AI Portfolio & Next Steps',description:'Putting it all together — portfolio projects, sharing work on GitHub, and the learning roadmap from NOOB to AMATEUR tier.',orderIndex:50,xpReward:150,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 50 — Capstone: Building Your AI Portfolio & Next Steps

## You've Completed the NOOB Tier! 🎉

You've learned:

| Block | Topics |
|-------|--------|
| 1–2 | Python fundamentals + NumPy |
| 3–4 | Pandas + Linear Algebra |
| 5–6 | Calculus, Optimisation, Statistics |
| 7 | What is ML, types, pipeline |
| 8 | Linear Reg, Logistic, kNN, DT, NB |
| 9 | Evaluation, Bias-Variance, Regularisation |
| 10 | 4 Capstone Projects |

## Building Your Portfolio

### What to Build

1. **Iris / Titanic** — classic clean datasets, show EDA + model comparison
2. **House price regression** — feature engineering, multiple regressors
3. **Text classifier** — NLP basics, Pipeline, TF-IDF
4. **Customer segmentation** — unsupervised, business storytelling
5. **Original project** — something you care about!

### GitHub Best Practices

\`\`\`
project/
├── README.md          ← Explain the problem and your approach
├── notebooks/         ← Jupyter notebooks with visualisations
├── src/               ← Reusable Python modules
├── data/              ← Data (or link to source)
└── requirements.txt   ← Reproducible environment
\`\`\`

## The AMATEUR Roadmap

Next tier covers:
- Ensemble methods (Random Forest, XGBoost, LightGBM)
- SVMs and advanced hyperparameter tuning
- K-Means, DBSCAN, PCA, t-SNE in depth
- Feature engineering mastery
- Introduction to neural networks (Keras)
- CNNs for images, RNNs for sequences`,
  codeExample:`import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import warnings
warnings.filterwarnings('ignore')

print("=== NOOB TIER CAPSTONE: CANCER DIAGNOSIS CLASSIFIER ===")
print("Integrating everything from NOOB Tier 1-9\n")

# === 1. Load ===
data = load_breast_cancer()
X, y = data.data, data.target
print(f"Dataset: {X.shape[0]} samples, {X.shape[1]} features")
print(f"Classes: {data.target_names}  Distribution: {np.bincount(y)}")

# === 2. Split ===
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

# === 3. Build Pipelines ===
pipe_lr = Pipeline([('sc', StandardScaler()), ('lr', LogisticRegression(max_iter=1000))])
pipe_rf = Pipeline([('sc', StandardScaler()), ('rf', RandomForestClassifier(random_state=42))])

# === 4. Cross-validate ===
print("\n=== Cross-Validation Comparison ===")
for name, pipe in [('Logistic Regression', pipe_lr), ('Random Forest', pipe_rf)]:
    cv_scores = cross_val_score(pipe, X_train, y_train, cv=10, scoring='f1')
    print(f"  {name:20s}: F1 = {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# === 5. Hyperparameter Tuning (GridSearchCV) ===
print("\n=== Hyperparameter Tuning (Random Forest) ===")
param_grid = {
    'rf__n_estimators': [50, 100],
    'rf__max_depth': [None, 5, 10],
    'rf__min_samples_leaf': [1, 2],
}
gs = GridSearchCV(pipe_rf, param_grid, cv=5, scoring='f1', n_jobs=-1)
gs.fit(X_train, y_train)
print(f"  Best params: {gs.best_params_}")
print(f"  Best CV F1:  {gs.best_score_:.4f}")

# === 6. Final evaluation ===
best_model = gs.best_estimator_
y_pred = best_model.predict(X_test)
print("\n=== Final Test Set Evaluation ===")
print(classification_report(y_test, y_pred, target_names=data.target_names))

# === 7. Summary of skills learned ===
print("=== NOOB TIER SKILLS CHECKLIST ===")
skills = [
    "✅ Python: variables, functions, OOP, NumPy, Pandas",
    "✅ Maths: vectors, matrices, derivatives, gradient descent",
    "✅ Statistics: distributions, hypothesis testing, Bayesian",
    "✅ ML Concepts: bias-variance, regularisation, cross-validation",
    "✅ Supervised: Linear Reg, Logistic Reg, kNN, Decision Tree, NB",
    "✅ Unsupervised: K-Means clustering, PCA basics",
    "✅ NLP Basics: BoW, TF-IDF, text classification pipeline",
    "✅ Projects: Iris, House Prices, Spam, Segmentation",
    "✅ sklearn: Pipeline, GridSearchCV, cross_val_score",
    "🎯 NEXT: AMATEUR tier — Ensembles, Deep Learning, NLP!",
]
for skill in skills:
    print(f"  {skill}")`,
  questions:[
    q('What is the primary purpose of building a portfolio?',[{id:'a',text:'To store all your code'},{id:'b',text:'To demonstrate practical skills to employers/collaborators with real project examples'},{id:'c',text:'To learn new algorithms'},{id:'d',text:'To share datasets'}],'b','A portfolio shows employers what you can do — projects with clear problem statements and results.',0),
    q('GridSearchCV exhaustively searches:',[{id:'a',text:'The optimal dataset'},{id:'b',text:'All combinations of specified hyperparameter values via cross-validation'},{id:'c',text:'The best features to use'},{id:'d',text:'The best train/test split'}],'b','GridSearchCV tries all parameter combinations and selects the one with best CV score.',1),
    q('A requirements.txt file in a project is used to:',[{id:'a',text:'List the project goals'},{id:'b',text:'Specify exact package versions — ensuring reproducibility'},{id:'c',text:'Document the data'},{id:'d',text:'Define the model architecture'}],'b','requirements.txt enables others to recreate your exact environment with pip install -r requirements.txt.',2),
    q('sklearn Pipeline prevents data leakage in cross-validation because:',[{id:'a',text:'It uses less memory'},{id:'b',text:'Preprocessing steps (e.g., scaler) are fit on each train fold separately — not on validation'},{id:'c',text:'It automatically tunes hyperparameters'},{id:'d',text:'It shuffles data before splitting'}],'b','Pipeline ensures each CV fold\'s preprocessing is fit only on that fold\'s training data.',3),
    q('What defines the AMATEUR tier compared to NOOB?',[{id:'a',text:'Using Python instead of R'},{id:'b',text:'Learning ensemble methods, SVMs, deep learning, advanced unsupervised learning, and MLOps basics'},{id:'c',text:'Only doing regression tasks'},{id:'d',text:'Using more data'}],'b','AMATEUR tier covers classical ML mastery, intro to deep learning, and production-focused skills.',4),
    q('When presenting an ML project, you should include:',[{id:'a',text:'Only the final model code'},{id:'b',text:'Problem statement, EDA insights, model choices/rationale, evaluation metrics, and conclusions'},{id:'c',text:'Just the accuracy number'},{id:'d',text:'All intermediate failed experiments'}],'b','A good ML presentation shows the full story: problem → data → approach → results → insights.',5),
    q('Stratified train/test split is especially important for:',[{id:'a',text:'Large datasets'},{id:'b',text:'Imbalanced classification where random splits might not preserve class ratios'},{id:'c',text:'Regression problems'},{id:'d',text:'Unsupervised learning'}],'b','Stratification ensures both train and test have the same class proportions as the full dataset.',6),
    q('Which Titanic feature would be most useful for survival prediction?',[{id:'a',text:'Passenger ID'},{id:'b',text:'Ticket number'},{id:'c',text:'Sex and Passenger class (Pclass)'},{id:'d',text:'Name'}],'c','Sex (women/children first) and Pclass (1st class → higher survival) are the top Titanic predictors.',7),
    q('A README.md in a GitHub ML project should contain:',[{id:'a',text:'All the training data'},{id:'b',text:'Problem description, approach, results, and instructions to reproduce'},{id:'c',text:'Only installation instructions'},{id:'d',text:'The model weights'}],'b','README is the first thing visitors see — explain the problem, your solution, and how to run it.',8),
    q('Completing the NOOB tier means you can:',[{id:'a',text:'Build production-grade deep learning systems'},{id:'b',text:'Implement and evaluate classical ML models end-to-end using Python and sklearn'},{id:'c',text:'Train large language models'},{id:'d',text:'Design neural architectures from scratch'}],'b','NOOB tier gives you the foundation: Python, math, classical ML, and evaluation — ready for AMATEUR!',9),
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
