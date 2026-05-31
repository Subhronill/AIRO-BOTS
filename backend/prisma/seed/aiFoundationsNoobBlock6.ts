/**
 * aiFoundationsNoobBlock6.ts — NOOB Block 6 (Ch 26–30): Statistics & Probability
 * Run: cd backend && npm run seed:af-noob-b6
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function q(text:string,options:{id:string;text:string}[],correctAnswer:string,explanation:string,orderIndex:number){return{text,options:JSON.stringify(options),correctAnswer,explanation,orderIndex};}
const COURSE_SLUG='foundations';

const CHAPTERS=[
  {slug:'af-noob-26-descriptive-stats',title:'Descriptive Statistics',description:'Mean, median, mode, variance, standard deviation, percentiles, and outlier detection — summarising data before modelling.',orderIndex:26,xpReward:65,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 26 — Descriptive Statistics

## Why Statistics in AI?

Before building any model, you must **understand your data**. Descriptive statistics summarise the distribution, central tendency, and spread of features.

## Central Tendency

| Measure | Formula | Robust to outliers? |
|---------|---------|-------------------|
| Mean | Σxᵢ/n | No |
| Median | Middle value | Yes |
| Mode | Most frequent | Yes |

## Spread

| Measure | Meaning |
|---------|---------|
| Variance σ² | Average squared deviation from mean |
| Std dev σ | √variance — same units as data |
| IQR | Q3 - Q1 — middle 50% range |
| Range | max - min |

## Standard Deviation & Normal Distribution

For a normal distribution:
- **68%** of data within 1σ
- **95%** within 2σ
- **99.7%** within 3σ (68-95-99.7 rule)

## Outlier Detection with Z-score

$$z = \\frac{x - \\mu}{\\sigma}$$

|z| > 3 → likely outlier.`,
  codeExample:`import numpy as np

np.random.seed(42)
data = np.array([2,4,4,4,5,5,7,9,12,100])  # last value is outlier

print("=== Descriptive Statistics ===")
print(f"Data   : {data}")
print(f"Mean   : {np.mean(data):.2f}")
print(f"Median : {np.median(data):.2f}")
print(f"Std dev: {np.std(data, ddof=1):.2f}")
print(f"Variance:{np.var(data, ddof=1):.2f}")
print(f"Min    : {data.min()}  Max: {data.max()}")

q1, q3 = np.percentile(data, 25), np.percentile(data, 75)
iqr = q3 - q1
print(f"Q1={q1}  Q3={q3}  IQR={iqr}")

# Z-score outlier detection
mean, std = np.mean(data), np.std(data, ddof=1)
z_scores = (data - mean) / std
print(f"\nZ-scores: {np.round(z_scores, 2)}")
outliers = data[np.abs(z_scores) > 2]
print(f"Outliers (|z|>2): {outliers}")

# IQR-based outlier
lower, upper = q1 - 1.5*iqr, q3 + 1.5*iqr
iqr_outliers = data[(data < lower) | (data > upper)]
print(f"IQR outliers: {iqr_outliers}")

# Simulated normal distribution
normal_data = np.random.normal(50, 10, 10000)
print(f"\n=== Normal Distribution (μ=50, σ=10, n=10000) ===")
for n_sigma in [1, 2, 3]:
    within = np.sum(np.abs(normal_data - 50) < n_sigma*10) / len(normal_data) * 100
    print(f"  Within {n_sigma}σ: {within:.1f}%")`,
  questions:[
    q('Which measure of central tendency is most resistant to outliers?',[{id:'a',text:'Mean'},{id:'b',text:'Mode'},{id:'c',text:'Median'},{id:'d',text:'Variance'}],'c','The median (middle value) is unaffected by extreme outliers — mean is pulled toward them.',0),
    q('Standard deviation is:',[{id:'a',text:'The average value in the dataset'},{id:'b',text:'The square root of variance — measures spread in the same units as the data'},{id:'c',text:'The most frequent value'},{id:'d',text:'The range divided by 2'}],'b','σ = √variance. Unlike variance, it is in the same units as the data.',1),
    q('The 68-95-99.7 rule says that for a normal distribution, ~95% of data falls within:',[{id:'a',text:'1 standard deviation'},{id:'b',text:'2 standard deviations'},{id:'c',text:'3 standard deviations'},{id:'d',text:'The IQR'}],'b','~95% of data falls within μ ± 2σ in a normal distribution.',2),
    q('IQR (Interquartile Range) is:',[{id:'a',text:'Q1 + Q3'},{id:'b',text:'Q3 - Q1 — the range of the middle 50% of data'},{id:'c',text:'The mean minus median'},{id:'d',text:'Max - Min'}],'b','IQR = Q3 - Q1, covering the middle half of the distribution, resistant to outliers.',3),
    q('A Z-score of -2.5 means:',[{id:'a',text:'The value is 2.5 times the mean'},{id:'b',text:'The value is 2.5 standard deviations below the mean'},{id:'c',text:'The value is an outlier by definition'},{id:'d',text:'The value is missing'}],'b','Z-score = (x - μ)/σ — a Z of -2.5 means 2.5σ below the mean.',4),
    q('Variance σ² measures:',[{id:'a',text:'The center of the distribution'},{id:'b',text:'The average squared deviation from the mean'},{id:'c',text:'The skewness of data'},{id:'d',text:'The number of outliers'}],'b','σ² = Σ(xᵢ-μ)²/n — average squared distance from the mean.',5),
    q('When should you use median instead of mean?',[{id:'a',text:'When all values are equal'},{id:'b',text:'When the distribution is skewed or contains outliers'},{id:'c',text:'When data is normally distributed'},{id:'d',text:'When you have categorical data'}],'b','Skewed distributions and outliers distort the mean — median is more representative.',6),
    q('ddof=1 in numpy\'s std() is used for:',[{id:'a',text:'Population standard deviation'},{id:'b',text:'Sample standard deviation (Bessel\'s correction)'},{id:'c',text:'Absolute deviation'},{id:'d',text:'Normalising to unit variance'}],'b','ddof=1 divides by (n-1) instead of n — Bessel\'s correction for unbiased sample std dev.',7),
    q('What does a high standard deviation indicate?',[{id:'a',text:'Data is tightly clustered around the mean'},{id:'b',text:'Data is widely spread'},{id:'c',text:'Data is normally distributed'},{id:'d',text:'Data has no outliers'}],'b','High σ means values vary widely from the mean — low σ means they are clustered.',8),
    q('Which statistic would you use to detect outliers in a skewed distribution?',[{id:'a',text:'Z-score'},{id:'b',text:'Mean'},{id:'c',text:'IQR-based bounds (Q1-1.5·IQR, Q3+1.5·IQR)'},{id:'d',text:'Standard deviation'}],'c','For skewed data, IQR-based outlier detection (Tukey fences) is more robust than Z-score.',9),
  ]},

  {slug:'af-noob-27-probability',title:'Probability Theory Fundamentals',description:'Sample spaces, events, probability rules, conditional probability, independence, and Bayes\' theorem — the language of uncertainty in AI.',orderIndex:27,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 27 — Probability Theory Fundamentals

## Basic Definitions

- **Sample space** Ω — all possible outcomes
- **Event** A — a subset of Ω
- **P(A)** — probability of A, 0 ≤ P(A) ≤ 1

## Probability Rules

| Rule | Formula |
|------|---------|
| Complement | P(Aᶜ) = 1 - P(A) |
| Addition | P(A∪B) = P(A) + P(B) - P(A∩B) |
| Multiplication (indep.) | P(A∩B) = P(A)·P(B) |
| Conditional | P(A|B) = P(A∩B) / P(B) |

## Independence

A and B are independent if P(A∩B) = P(A)·P(B), i.e., knowing B tells you nothing about A.

## Bayes' Theorem

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

In AI: P(class | features) ∝ P(features | class) · P(class)
This is the foundation of **Naive Bayes classifiers**.

## Law of Total Probability

$$P(B) = \\sum_i P(B|A_i) \\cdot P(A_i)$$`,
  codeExample:`import numpy as np
np.random.seed(0)

# === Basic probability simulation ===
n = 100_000

# Coin flip
flips = np.random.choice(['H','T'], n)
p_heads = np.sum(flips=='H') / n
print(f"P(Heads) simulated: {p_heads:.4f}  (expected: 0.5)")

# Die roll
rolls = np.random.randint(1, 7, n)
p_six = np.sum(rolls==6) / n
p_even = np.sum(rolls%2==0) / n
print(f"P(6)    simulated: {p_six:.4f}  (expected: 0.1667)")
print(f"P(even) simulated: {p_even:.4f}  (expected: 0.5)")

# === Conditional probability & Bayes ===
print("\n=== Bayes' Theorem: Medical Test Example ===")
# Disease prevalence (prior)
p_disease = 0.01  # 1% of population has disease
p_no_disease = 1 - p_disease

# Test accuracy
p_pos_given_disease = 0.99   # sensitivity (true positive rate)
p_pos_given_no_disease = 0.05  # false positive rate

# P(positive) — law of total probability
p_positive = (p_pos_given_disease * p_disease +
              p_pos_given_no_disease * p_no_disease)

# Bayes: P(disease | positive test)
p_disease_given_pos = (p_pos_given_disease * p_disease) / p_positive

print(f"Prior P(disease)        = {p_disease:.3f}")
print(f"P(positive | disease)   = {p_pos_given_disease:.3f}")
print(f"P(positive | no disease)= {p_pos_given_no_disease:.3f}")
print(f"P(positive)             = {p_positive:.4f}")
print(f"P(disease | positive)   = {p_disease_given_pos:.4f}")
print(f"→ Even with 99% sensitivity, only {p_disease_given_pos*100:.1f}% chance of disease!")

# === Independence check ===
print("\n=== Independence Check ===")
# Roll two dice — are 'first die is 6' and 'sum is 7' independent?
N = 200_000
d1 = np.random.randint(1,7,N)
d2 = np.random.randint(1,7,N)
p_a = np.mean(d1==6)
p_b = np.mean(d1+d2==7)
p_ab = np.mean((d1==6) & (d1+d2==7))
print(f"P(A)={p_a:.4f}  P(B)={p_b:.4f}  P(A∩B)={p_ab:.4f}  P(A)·P(B)={p_a*p_b:.4f}")
print(f"Independent? {np.isclose(p_ab, p_a*p_b, atol=0.005)}")`,
  questions:[
    q('P(Aᶜ) is:',[{id:'a',text:'1 + P(A)'},{id:'b',text:'P(A) × P(A)'},{id:'c',text:'1 - P(A)'},{id:'d',text:'P(A) / P(B)'}],'c','The complement rule: P(not A) = 1 - P(A).',0),
    q('Bayes\' theorem states P(A|B) = ?',[{id:'a',text:'P(A)·P(B)'},{id:'b',text:'P(B|A)·P(A) / P(B)'},{id:'c',text:'P(A∩B) + P(B)'},{id:'d',text:'P(A) / P(B|A)'}],'b','Bayes: P(A|B) = P(B|A)·P(A) / P(B) — the fundamental formula for updating beliefs with evidence.',1),
    q('Two events A and B are independent if:',[{id:'a',text:'P(A∩B) = 0'},{id:'b',text:'P(A∪B) = 1'},{id:'c',text:'P(A∩B) = P(A)·P(B)'},{id:'d',text:'P(A|B) = P(B)'}],'c','Independence means knowing B gives no information about A: P(A∩B) = P(A)·P(B).',2),
    q('In Naive Bayes classifiers, P(class|features) is proportional to:',[{id:'a',text:'P(features)'},{id:'b',text:'P(features|class)·P(class)'},{id:'c',text:'P(class)/P(features)'},{id:'d',text:'P(class)²'}],'b','Bayes theorem: posterior ∝ likelihood × prior. P(class|x) ∝ P(x|class)·P(class).',3),
    q('P(A|B) is called:',[{id:'a',text:'Joint probability'},{id:'b',text:'Marginal probability'},{id:'c',text:'Conditional probability of A given B'},{id:'d',text:'Complement probability'}],'c','P(A|B) is the conditional probability — probability of A assuming B has occurred.',4),
    q('For the addition rule P(A∪B), if A and B are mutually exclusive:',[{id:'a',text:'P(A∪B) = P(A)·P(B)'},{id:'b',text:'P(A∪B) = P(A) + P(B)'},{id:'c',text:'P(A∪B) = 0'},{id:'d',text:'P(A∪B) = P(A) + P(B) - P(A∩B)'}],'b','Mutually exclusive: P(A∩B)=0 → P(A∪B) = P(A)+P(B).',5),
    q('The "prior" in Bayesian inference is:',[{id:'a',text:'P(B|A)'},{id:'b',text:'P(A) — your belief about A before observing evidence'},{id:'c',text:'The sample space'},{id:'d',text:'P(A|B)'}],'b','The prior P(A) is your initial belief before seeing data. Bayes updates it with evidence to get the posterior.',6),
    q('Why does a highly accurate test still give many false positives for rare diseases?',[{id:'a',text:'The test is poorly designed'},{id:'b',text:'Because the prior probability of disease is very low — base rate effect'},{id:'c',text:'Because the sample size is too small'},{id:'d',text:'Because the test sensitivity is low'}],'b','Base rate neglect: when prevalence is 1%, even a 99% accurate test has most positives being false.',7),
    q('The law of total probability states P(B) = ?',[{id:'a',text:'P(B|A)·P(A)'},{id:'b',text:'ΣP(B|Aᵢ)·P(Aᵢ) over all partitions Aᵢ'},{id:'c',text:'P(A)·P(B)'},{id:'d',text:'P(A|B)'}],'b','Marginalise over all possibilities: P(B) = Σ P(B|Aᵢ)·P(Aᵢ).',8),
    q('A probability value must always be:',[{id:'a',text:'Greater than 1'},{id:'b',text:'Negative for rare events'},{id:'c',text:'Between 0 and 1 inclusive'},{id:'d',text:'An integer'}],'c','P(A) ∈ [0,1] always — 0 means impossible, 1 means certain.',9),
  ]},

  {slug:'af-noob-28-distributions',title:'Probability Distributions',description:'Discrete and continuous distributions — Bernoulli, Binomial, Normal, Poisson, Uniform — and their roles in AI/ML modelling.',orderIndex:28,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 28 — Probability Distributions

## Discrete Distributions

| Distribution | PMF | Use case |
|-------------|-----|---------|
| Bernoulli | P(X=1)=p | Binary outcome (spam/not spam) |
| Binomial | C(n,k)·pᵏ·(1-p)ⁿ⁻ᵏ | k successes in n trials |
| Poisson | λᵏe⁻λ/k! | Event counts in fixed interval |
| Categorical | P(X=k)=pₖ | Multi-class labels |

## Continuous Distributions

| Distribution | PDF | Use case |
|-------------|-----|---------|
| Uniform U(a,b) | 1/(b-a) | Random initialisation |
| Normal N(μ,σ²) | Gaussian bell curve | Features, noise, weight init |
| Exponential | λe⁻λx | Time between events |
| Beta B(α,β) | Prior over probabilities |

## The Normal Distribution (Gaussian)

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$

In AI: weight initialisation, feature normalisation, variational autoencoders.

## Cross-Entropy & KL Divergence

Measuring difference between distributions:

$$\\text{KL}(P||Q) = \\sum_x P(x) \\log \\frac{P(x)}{Q(x)}$$`,
  codeExample:`import numpy as np
from scipy import stats

np.random.seed(42)

print("=== Bernoulli Distribution (p=0.3) ===")
samples = np.random.binomial(1, 0.3, 10000)
print(f"P(X=1) = {np.mean(samples):.4f}  (expected: 0.3)")

print("\n=== Binomial Distribution (n=10, p=0.5) ===")
binom_samples = np.random.binomial(10, 0.5, 10000)
print(f"Mean  = {np.mean(binom_samples):.2f}  (expected: {10*0.5})")
print(f"Std   = {np.std(binom_samples):.2f}   (expected: {(10*0.5*0.5)**0.5:.2f})")

print("\n=== Poisson Distribution (λ=3) ===")
poisson_samples = np.random.poisson(3, 10000)
print(f"Mean  = {np.mean(poisson_samples):.4f}  (expected: 3)")
for k in range(7):
    prob = np.mean(poisson_samples == k)
    exact = stats.poisson.pmf(k, 3)
    print(f"  P(X={k}): simulated={prob:.4f}  exact={exact:.4f}")

print("\n=== Normal Distribution (μ=0, σ=1) ===")
normal = np.random.normal(0, 1, 100000)
print(f"Mean  = {np.mean(normal):.4f}")
print(f"Std   = {np.std(normal):.4f}")

print("\n=== KL Divergence Example ===")
# P = true distribution, Q = model distribution
P = np.array([0.4, 0.3, 0.2, 0.1])
Q = np.array([0.25, 0.25, 0.25, 0.25])  # uniform guess
kl = np.sum(P * np.log(P / Q))
cross_entropy = -np.sum(P * np.log(Q))
entropy_p = -np.sum(P * np.log(P))
print(f"KL(P||Q)     = {kl:.4f}")
print(f"Cross-entropy= {cross_entropy:.4f}")
print(f"Entropy(P)   = {entropy_p:.4f}")
print(f"Note: Cross-entropy = KL + Entropy(P): {kl + entropy_p:.4f}")`,
  questions:[
    q('The Bernoulli distribution models:',[{id:'a',text:'A count of events in a time interval'},{id:'b',text:'A single binary outcome with probability p'},{id:'c',text:'Continuous values between 0 and 1'},{id:'d',text:'k successes in n trials'}],'b','Bernoulli is the simplest distribution — single trial with P(success)=p.',0),
    q('The Binomial distribution counts:',[{id:'a',text:'Continuous outcomes'},{id:'b',text:'Events per unit time'},{id:'c',text:'Number of successes in n independent Bernoulli trials'},{id:'d',text:'The time to first success'}],'c','Binomial(n,p): X = number of successes in n independent trials each with P(success)=p.',1),
    q('What shape does the Normal distribution have?',[{id:'a',text:'Uniform'},{id:'b',text:'Exponential decay'},{id:'c',text:'Symmetric bell curve'},{id:'d',text:'Skewed right'}],'c','The Normal (Gaussian) distribution is a symmetric bell curve characterised by μ and σ.',2),
    q('KL divergence KL(P||Q) measures:',[{id:'a',text:'The standard deviation of P'},{id:'b',text:'How different distribution Q is from the reference P'},{id:'c',text:'The joint probability of P and Q'},{id:'d',text:'The cross-entropy of P'}],'b','KL divergence quantifies information lost when using Q to approximate P.',3),
    q('Cross-entropy loss in classification is based on:',[{id:'a',text:'L2 distance between predictions and labels'},{id:'b',text:'The negative log-likelihood under the predicted distribution'},{id:'c',text:'The variance of predictions'},{id:'d',text:'Euclidean distance'}],'b','Cross-entropy H(P,Q) = -Σ P(x)·log Q(x) measures the cost of using model distribution Q when true is P.',4),
    q('The Poisson distribution is used to model:',[{id:'a',text:'Continuous time durations'},{id:'b',text:'Count of events in a fixed time/space interval'},{id:'c',text:'Binary outcomes'},{id:'d',text:'Feature values in a dataset'}],'b','Poisson models rare event counts (emails per hour, clicks per day) parametrised by rate λ.',5),
    q('For a Normal N(μ,σ²), what percentage of values fall within 2σ of the mean?',[{id:'a',text:'68%'},{id:'b',text:'95%'},{id:'c',text:'99.7%'},{id:'d',text:'50%'}],'b','The 68-95-99.7 rule: ~95% of data lies within μ ± 2σ.',6),
    q('Uniform distribution U(a,b) assigns:',[{id:'a',text:'Higher probability to central values'},{id:'b',text:'Equal probability to all values in [a,b]'},{id:'c',text:'Zero probability outside [a,b] and a spike inside'},{id:'d',text:'Exponentially decreasing probability'}],'b','Uniform distribution = constant PDF = 1/(b-a) over [a,b], zero outside.',7),
    q('The Softmax output of a neural network produces:',[{id:'a',text:'Raw logits'},{id:'b',text:'A valid probability distribution over classes (sums to 1)'},{id:'c',text:'Unnormalised scores'},{id:'d',text:'A binomial distribution'}],'b','Softmax converts logits to probabilities: P(k) = exp(zₖ)/Σexp(zⱼ), summing to 1.',8),
    q('In variational autoencoders (VAEs), the latent space is modelled as:',[{id:'a',text:'A uniform distribution'},{id:'b',text:'A Poisson distribution'},{id:'c',text:'A Gaussian (Normal) distribution'},{id:'d',text:'A Bernoulli distribution'}],'b','VAEs encode inputs as Gaussian parameters (μ,σ) and sample from N(μ,σ²) for the latent space.',9),
  ]},

  {slug:'af-noob-29-hypothesis-testing',title:'Hypothesis Testing & Statistical Significance',description:'Null hypothesis, p-values, t-tests, chi-squared tests, Type I/II errors — validating results in AI experiments.',orderIndex:29,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 29 — Hypothesis Testing & Statistical Significance

## Hypothesis Testing Framework

1. **H₀** (Null hypothesis) — the "nothing interesting" claim
2. **H₁** (Alternative hypothesis) — what you want to prove
3. Choose significance level **α** (usually 0.05)
4. Compute **test statistic** from data
5. Compute **p-value** — probability of seeing this result if H₀ is true
6. If p < α → reject H₀ (result is statistically significant)

## p-value Interpretation

> "The p-value is the probability of observing a result at least as extreme as the data, **assuming H₀ is true**"

- p < 0.05 → reject H₀ (5% significance)
- p < 0.01 → stronger evidence
- p-value is NOT the probability H₀ is true!

## Common Tests

| Test | Use case |
|------|---------|
| t-test (1 sample) | Test if mean equals a value |
| t-test (2 sample) | Compare two group means |
| Chi-squared | Categorical variable association |
| F-test / ANOVA | Compare 3+ group means |

## Type I & Type II Errors

| | H₀ True | H₀ False |
|--|---------|---------|
| Reject H₀ | **Type I (α)** | Correct (power) |
| Fail to reject | Correct | **Type II (β)** |`,
  codeExample:`import numpy as np
from scipy import stats

np.random.seed(42)

# === One-sample t-test ===
print("=== One-Sample t-test ===")
# Claim: model accuracy = 85%. Observed 30 runs.
accuracies = np.random.normal(87.5, 3, 30)
t_stat, p_value = stats.ttest_1samp(accuracies, popmean=85)
print(f"Sample mean: {accuracies.mean():.2f}%")
print(f"t-statistic: {t_stat:.4f}")
print(f"p-value    : {p_value:.4f}")
print(f"Conclusion : {'Reject H₀ — accuracy differs from 85%' if p_value < 0.05 else 'Fail to reject H₀'}")

# === Two-sample t-test ===
print("\n=== Two-Sample t-test (Model A vs B) ===")
model_a = np.random.normal(82, 4, 50)
model_b = np.random.normal(85, 4, 50)
t2, p2 = stats.ttest_ind(model_a, model_b)
print(f"Model A mean: {model_a.mean():.2f}%  Model B mean: {model_b.mean():.2f}%")
print(f"t-statistic: {t2:.4f}  p-value: {p2:.4f}")
print(f"Conclusion: {'Model B is significantly better' if p2 < 0.05 else 'No significant difference'}")

# === Chi-squared test ===
print("\n=== Chi-Squared Test (Model predictions vs actual) ===")
# Observed: how many correct per class
observed = np.array([45, 30, 25])   # predicted counts
expected = np.array([40, 35, 25])   # expected counts
chi2, p_chi = stats.chisquare(observed, f_exp=expected)
print(f"Chi2 statistic: {chi2:.4f}  p-value: {p_chi:.4f}")
print(f"Conclusion: {'Significant deviation' if p_chi < 0.05 else 'No significant deviation'}")

# === Effect size (Cohen's d) ===
print("\n=== Effect Size (Cohen's d) ===")
pooled_std = np.sqrt((model_a.std()**2 + model_b.std()**2) / 2)
cohens_d = (model_b.mean() - model_a.mean()) / pooled_std
print(f"Cohen's d = {cohens_d:.3f}")
magnitude = 'small' if abs(cohens_d) < 0.5 else ('medium' if abs(cohens_d) < 0.8 else 'large')
print(f"Effect size: {magnitude}")`,
  questions:[
    q('A p-value of 0.03 with α=0.05 means:',[{id:'a',text:'There is a 3% chance H₀ is true'},{id:'b',text:'Reject H₀ — the result is statistically significant'},{id:'c',text:'Fail to reject H₀'},{id:'d',text:'The experiment failed'}],'b','p < α (0.03 < 0.05) → reject H₀ at 5% significance level.',0),
    q('A Type I error is:',[{id:'a',text:'Failing to reject a false H₀'},{id:'b',text:'Rejecting a true H₀ (false positive)'},{id:'c',text:'Using the wrong test'},{id:'d',text:'Having too small a sample'}],'b','Type I error = rejecting H₀ when it is actually true. Its probability is α (significance level).',1),
    q('The null hypothesis H₀ usually states:',[{id:'a',text:'The experimental effect is real'},{id:'b',text:'There is no effect / difference (the default, boring claim)'},{id:'c',text:'The model is better than baseline'},{id:'d',text:'The p-value is significant'}],'b','H₀ is the conservative "nothing is happening" hypothesis we try to disprove.',2),
    q('Which test compares the means of exactly two independent groups?',[{id:'a',text:'Chi-squared test'},{id:'b',text:'One-sample t-test'},{id:'c',text:'Two-sample (independent) t-test'},{id:'d',text:'ANOVA'}],'c','The independent (two-sample) t-test compares the means of two groups.',3),
    q('The chi-squared test is used for:',[{id:'a',text:'Comparing two means'},{id:'b',text:'Testing associations between categorical variables'},{id:'c',text:'Checking normality'},{id:'d',text:'Computing effect size'}],'b','Chi-squared tests whether observed categorical frequencies differ from expected.',4),
    q('A Type II error (β) is:',[{id:'a',text:'Rejecting a true H₀'},{id:'b',text:'Failing to reject a false H₀ (missing a real effect)'},{id:'c',text:'Using the wrong significance level'},{id:'d',text:'Calculating the wrong p-value'}],'b','Type II error = failing to detect a real effect. Its probability is β; power = 1-β.',5),
    q('Cohen\'s d measures:',[{id:'a',text:'The p-value'},{id:'b',text:'Effect size — how large the difference is in standard deviation units'},{id:'c',text:'The test statistic'},{id:'d',text:'The sample variance'}],'b','Cohen\'s d = (μ₁-μ₂)/σ_pooled — practical significance, not just statistical significance.',6),
    q('Statistical significance (p < 0.05) guarantees:',[{id:'a',text:'The effect is large and practically important'},{id:'b',text:'The result is due to the true effect and not random chance (at α=5% error rate)'},{id:'c',text:'H₀ is false with certainty'},{id:'d',text:'The result will replicate'}],'b','Statistical significance only means the result is unlikely under H₀ — it says nothing about practical size or replicability.',7),
    q('What does "power" mean in hypothesis testing?',[{id:'a',text:'The test\'s significance level α'},{id:'b',text:'The probability of correctly rejecting a false H₀ (1 - β)'},{id:'c',text:'The effect size'},{id:'d',text:'The sample size'}],'b','Power = 1 - P(Type II error) = probability of detecting a real effect when it exists.',8),
    q('A/B testing in ML uses hypothesis testing to:',[{id:'a',text:'Debug model code'},{id:'b',text:'Decide if model B is significantly better than model A using controlled experiments'},{id:'c',text:'Tune hyperparameters'},{id:'d',text:'Visualise training curves'}],'b','A/B tests compare two variants (models, features, policies) with statistical rigor.',9),
  ]},

  {slug:'af-noob-30-bayesian-thinking',title:'Bayesian Thinking & Inference',description:'Priors, likelihoods, posteriors, conjugate priors, and Bayesian vs frequentist — the probabilistic worldview behind modern AI.',orderIndex:30,xpReward:75,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 30 — Bayesian Thinking & Inference

## The Bayesian Worldview

In Bayesian inference, **probability represents degrees of belief**, which we update as new evidence arrives.

$$\\underbrace{P(\\theta|D)}_{\\text{posterior}} = \\frac{\\underbrace{P(D|\\theta)}_{\\text{likelihood}} \\cdot \\underbrace{P(\\theta)}_{\\text{prior}}}{\\underbrace{P(D)}_{\\text{evidence}}}$$

## Bayesian vs Frequentist

| Aspect | Frequentist | Bayesian |
|--------|------------|---------|
| Probability | Long-run frequency | Degree of belief |
| Parameters | Fixed unknowns | Random variables with distributions |
| Result | p-value, confidence interval | Posterior distribution |
| Prior knowledge | Ignored | Explicitly incorporated |

## Conjugate Priors

Some prior-likelihood pairs yield a posterior in the same family:

| Likelihood | Conjugate Prior | Posterior |
|-----------|----------------|---------|
| Bernoulli | Beta | Beta |
| Multinomial | Dirichlet | Dirichlet |
| Normal (σ known) | Normal | Normal |

## Maximum A Posteriori (MAP)

MAP estimation = finding the mode of the posterior:

$$\\hat{\\theta}_{MAP} = \\arg\\max_\\theta P(\\theta|D) = \\arg\\max_\\theta [\\log P(D|\\theta) + \\log P(\\theta)]$$

The log prior acts as **regularisation** (L2 prior → Ridge regression).`,
  codeExample:`import numpy as np
from scipy import stats

np.random.seed(42)

print("=== Bayesian Coin Flip (Beta-Bernoulli Model) ===")
# We observe coin flips and update belief about P(heads)=θ
# Prior: Beta(α=2, β=2) — slight belief in fairness

alpha_prior, beta_prior = 2, 2
print(f"Prior: Beta({alpha_prior},{beta_prior}) — mean={alpha_prior/(alpha_prior+beta_prior):.2f}")

flips = [1,1,0,1,1,1,0,1,1,1]  # 8 heads, 2 tails
heads = sum(flips)
tails = len(flips) - heads

# Posterior update (conjugate): Beta(α+heads, β+tails)
alpha_post = alpha_prior + heads
beta_post  = beta_prior  + tails
post_mean  = alpha_post / (alpha_post + beta_post)
print(f"\nData: {heads} heads, {tails} tails out of {len(flips)} flips")
print(f"Posterior: Beta({alpha_post},{beta_post}) — mean={post_mean:.3f}")

# Credible interval (Bayesian equivalent of confidence interval)
ci_low, ci_high = stats.beta.ppf([0.025, 0.975], alpha_post, beta_post)
print(f"95% Credible interval: [{ci_low:.3f}, {ci_high:.3f}]")

# Sequential updating
print("\n=== Sequential Bayesian Updates ===")
a, b = 1, 1  # uninformative prior
for i, flip in enumerate(flips):
    a += flip; b += (1-flip)
    if i < 5 or i == 9:
        print(f"  After {i+1} flips: Beta({a},{b}) → P(heads)={a/(a+b):.3f}")

# MAP vs MLE
print("\n=== MLE vs MAP ===")
obs_heads, obs_total = 8, 10
mle = obs_heads / obs_total
print(f"MLE (freq.): θ̂ = {mle:.3f}")

# MAP with Beta(2,2) prior: (α-1+heads)/(α+β-2+n)
map_est = (alpha_prior - 1 + obs_heads) / (alpha_prior + beta_prior - 2 + obs_total)
print(f"MAP (prior Beta(2,2)): θ̂ = {map_est:.3f}")
print(f"→ MAP is regularised toward the prior mean (0.5)")`,
  questions:[
    q('In Bayesian inference, the posterior is:',[{id:'a',text:'P(D|θ)'},{id:'b',text:'P(θ) before seeing data'},{id:'c',text:'P(θ|D) — updated belief about parameters after observing data'},{id:'d',text:'P(D)'}],'c','Posterior P(θ|D) is the updated probability distribution over parameters given the observed data.',0),
    q('The "prior" in Bayesian inference represents:',[{id:'a',text:'The observed data'},{id:'b',text:'Your belief about the parameters BEFORE seeing any data'},{id:'c',text:'The likelihood of the data'},{id:'d',text:'The posterior distribution'}],'b','The prior P(θ) encodes initial beliefs about parameters before data is observed.',1),
    q('A conjugate prior produces:',[{id:'a',text:'A posterior with zero variance'},{id:'b',text:'A posterior in the same distributional family as the prior — enabling closed-form updates'},{id:'c',text:'An improper posterior'},{id:'d',text:'An uninformative prior'}],'b','Conjugate priors make Bayesian updates analytically tractable (e.g., Beta prior + Binomial likelihood → Beta posterior).',2),
    q('The Beta distribution Beta(α,β) is the conjugate prior for:',[{id:'a',text:'The Poisson likelihood'},{id:'b',text:'The Normal likelihood'},{id:'c',text:'The Bernoulli/Binomial likelihood'},{id:'d',text:'The Exponential likelihood'}],'c','Beta-Bernoulli is the canonical conjugate pair for modeling binary outcome probabilities.',3),
    q('MAP estimation maximises:',[{id:'a',text:'The likelihood P(D|θ)'},{id:'b',text:'The posterior P(θ|D) — equivalent to MLE + log prior regularisation'},{id:'c',text:'The prior P(θ)'},{id:'d',text:'The evidence P(D)'}],'b','MAP = argmax P(θ|D) = argmax [log P(D|θ) + log P(θ)] — adds a prior term to MLE.',4),
    q('A Gaussian (Normal) prior on weights in a neural network is equivalent to:',[{id:'a',text:'Dropout regularisation'},{id:'b',text:'L2 (Ridge) regularisation'},{id:'c',text:'L1 (Lasso) regularisation'},{id:'d',text:'Batch normalisation'}],'b','The log of a Gaussian prior is a quadratic term in the weights — equivalent to L2 penalty.',5),
    q('A Bayesian credible interval differs from a frequentist confidence interval because:',[{id:'a',text:'They are identical'},{id:'b',text:'The credible interval directly states P(θ ∈ interval | data) = 95%'},{id:'c',text:'The credible interval is always wider'},{id:'d',text:'The credible interval ignores the prior'}],'b','A 95% Bayesian credible interval means there is a 95% posterior probability the parameter lies within it.',6),
    q('In Naive Bayes classification, "naive" refers to:',[{id:'a',text:'Using a simple model architecture'},{id:'b',text:'The assumption that features are conditionally independent given the class'},{id:'c',text:'Not using any prior'},{id:'d',text:'Ignoring the posterior'}],'b','Naive Bayes assumes P(x₁,...,xₙ|class) = ΠP(xᵢ|class) — features are conditionally independent.',7),
    q('As more data is observed, the Bayesian posterior:',[{id:'a',text:'Remains fixed at the prior'},{id:'b',text:'Converges toward the true parameter value — data overwhelms the prior'},{id:'c',text:'Becomes more uncertain'},{id:'d',text:'Always equals the MLE'}],'b','With infinite data, posterior concentrates around the true θ regardless of the prior (Bernstein-von Mises theorem).',8),
    q('The "evidence" P(D) in Bayes\' theorem:',[{id:'a',text:'Depends on the parameter θ'},{id:'b',text:'Is a normalising constant that ensures the posterior sums to 1'},{id:'c',text:'Is always equal to 1'},{id:'d',text:'Is the prior distribution'}],'b','P(D) = ∫P(D|θ)P(θ)dθ is a normaliser — often intractable, motivating approximate inference.',9),
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
