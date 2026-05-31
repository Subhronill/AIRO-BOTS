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
  // CHAPTER 41 — PCA & Dimensionality Reduction
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-41-pca-dimensionality-reduction',
    title:      'PCA & Dimensionality Reduction',
    description: 'Compress high-dimensional data, remove noise, and create features that make ML models faster and more accurate — using PCA, t-SNE, and UMAP.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 141,
    xpReward:   120,
    language:   'python',
    codeExample: `import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Always scale before PCA
X = pd.read_csv("customer_features.csv")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# PCA: keep components explaining 95% of variance
pca = PCA(n_components=0.95, random_state=42)
X_pca = pca.fit_transform(X_scaled)

print(f"Original: {X_scaled.shape[1]} features")
print(f"Reduced:  {X_pca.shape[1]} components")
print(f"Variance explained: {pca.explained_variance_ratio_.cumsum()[-1]:.1%}")

# Scree plot
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].bar(range(1, len(pca.explained_variance_ratio_)+1),
            pca.explained_variance_ratio_, color="steelblue")
axes[0].set_xlabel("Principal Component")
axes[0].set_ylabel("Explained Variance Ratio")
axes[0].set_title("Scree Plot")

axes[1].plot(np.cumsum(pca.explained_variance_ratio_), marker='o')
axes[1].axhline(0.95, color='red', linestyle='--', label='95% threshold')
axes[1].set_xlabel("Number of Components")
axes[1].set_ylabel("Cumulative Explained Variance")
axes[1].legend()
axes[1].set_title("Cumulative Variance")
plt.tight_layout()
plt.show()`,
    content: `# PCA & Dimensionality Reduction

Real-world datasets often have dozens or hundreds of features. Many are correlated (redundant), many are noise. Dimensionality reduction techniques compress information into fewer, more meaningful features — improving visualization, reducing ML training time, and removing noise that degrades model performance.

## Why Dimensionality Reduction?

| Problem | Dimensionality Reduction Helps |
|---------|-------------------------------|
| Too many correlated features | Remove redundancy |
| Slow ML training | Fewer features = faster computation |
| Cannot visualize > 3D data | Compress to 2D/3D for plotting |
| Noisy features hurting accuracy | PCA filters out low-variance noise |
| Curse of dimensionality | Distance metrics break down in high dimensions |

## Principal Component Analysis (PCA)

PCA finds the directions of maximum variance in the data (principal components) and projects data onto those directions. PC1 captures the most variance, PC2 the next most, etc., and all PCs are orthogonal (uncorrelated).

### Step-by-Step PCA

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer

# Load dataset
data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

print(f"Original shape: {X.shape}")  # 569 samples, 30 features

# ── Step 1: ALWAYS scale before PCA ──
# PCA is sensitive to scale — unscaled features with large ranges dominate
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Step 2: Fit PCA ──
pca_full = PCA(random_state=42)
pca_full.fit(X_scaled)

# ── Step 3: Scree plot — choose number of components ──
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].bar(range(1, 31), pca_full.explained_variance_ratio_, color="steelblue")
axes[0].set_xlabel("Principal Component")
axes[0].set_ylabel("Variance Explained")
axes[0].set_title("Scree Plot — Individual Variance")

cumulative = np.cumsum(pca_full.explained_variance_ratio_)
axes[1].plot(cumulative, marker="o", color="steelblue")
axes[1].axhline(0.95, color="red", linestyle="--", label="95% threshold")
axes[1].axhline(0.90, color="orange", linestyle="--", label="90% threshold")
axes[1].set_xlabel("Number of Components")
axes[1].set_ylabel("Cumulative Variance Explained")
axes[1].legend()
axes[1].set_title("Cumulative Variance Explained")
plt.tight_layout()
plt.show()

# Find components needed for 95% variance
n_components_95 = np.argmax(cumulative >= 0.95) + 1
print(f"Components for 95% variance: {n_components_95} (out of 30)")

# ── Step 4: Apply PCA with chosen n_components ──
pca = PCA(n_components=n_components_95, random_state=42)
X_pca = pca.fit_transform(X_scaled)
print(f"Reduced shape: {X_pca.shape}")
\`\`\`

### PCA Visualization

\`\`\`python
# 2D visualization of first two PCs
pca_2d = PCA(n_components=2, random_state=42)
X_2d = pca_2d.fit_transform(X_scaled)

fig, ax = plt.subplots(figsize=(9, 6))
colors = ["#003087", "#FF6B35"]
labels = data.target_names

for i, (label, color) in enumerate(zip(labels, colors)):
    mask = y == i
    ax.scatter(X_2d[mask, 0], X_2d[mask, 1],
               c=color, label=label, alpha=0.6, s=40)

ax.set_xlabel(f"PC1 ({pca_2d.explained_variance_ratio_[0]:.1%} variance)")
ax.set_ylabel(f"PC2 ({pca_2d.explained_variance_ratio_[1]:.1%} variance)")
ax.set_title("Breast Cancer Dataset — PCA 2D Projection")
ax.legend()
ax.spines[["top","right"]].set_visible(False)
plt.tight_layout()
plt.show()
\`\`\`

### Feature Loadings (Biplot)

\`\`\`python
# Which original features contribute most to each PC?
loadings = pd.DataFrame(
    pca_2d.components_.T,
    columns=["PC1","PC2"],
    index=data.feature_names,
)
print("Top features for PC1:")
print(loadings["PC1"].abs().sort_values(ascending=False).head(5))
print("\\nTop features for PC2:")
print(loadings["PC2"].abs().sort_values(ascending=False).head(5))

# Biplot: features as arrows, samples as points
fig, ax = plt.subplots(figsize=(11, 8))
ax.scatter(X_2d[:, 0], X_2d[:, 1], c=y, cmap="coolwarm", alpha=0.4, s=25)

scale = 5
for i, feature in enumerate(data.feature_names[:10]):  # top 10 for clarity
    ax.arrow(0, 0, loadings.iloc[i, 0] * scale, loadings.iloc[i, 1] * scale,
             head_width=0.1, head_length=0.1, fc="navy", ec="navy")
    ax.text(loadings.iloc[i, 0] * scale * 1.1, loadings.iloc[i, 1] * scale * 1.1,
            feature[:12], fontsize=7, color="navy")

ax.set_title("PCA Biplot — Features and Samples")
ax.set_xlabel("PC1"); ax.set_ylabel("PC2")
plt.tight_layout()
plt.show()
\`\`\`

## PCA in an ML Pipeline

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# Without PCA
rf = RandomForestClassifier(n_estimators=100, random_state=42)
score_raw = cross_val_score(rf, X_scaled, y, cv=5, scoring="roc_auc").mean()

# With PCA (10 components — retains ~90% variance)
pipeline = Pipeline([
    ("pca", PCA(n_components=10, random_state=42)),
    ("rf",  RandomForestClassifier(n_estimators=100, random_state=42)),
])
score_pca = cross_val_score(pipeline, X_scaled, y, cv=5, scoring="roc_auc").mean()

print(f"AUC without PCA: {score_raw:.4f}")
print(f"AUC with PCA:    {score_pca:.4f}")
\`\`\`

## t-SNE — Visualization of High-Dimensional Data

t-SNE (t-distributed Stochastic Neighbor Embedding) is designed for 2D/3D visualization of high-dimensional data. It preserves local structure — similar points stay close. Do not use t-SNE features in ML models; it is visualization only.

\`\`\`python
from sklearn.manifold import TSNE

# Recommend running PCA first to ~50 components, then t-SNE
pca_50 = PCA(n_components=min(50, X_scaled.shape[1]), random_state=42)
X_pca50 = pca_50.fit_transform(X_scaled)

tsne = TSNE(n_components=2, perplexity=30, learning_rate=200,
            n_iter=1000, random_state=42)
X_tsne = tsne.fit_transform(X_pca50)

fig, ax = plt.subplots(figsize=(9, 6))
for i, (label, color) in enumerate(zip(data.target_names, ["#003087","#FF6B35"])):
    mask = y == i
    ax.scatter(X_tsne[mask, 0], X_tsne[mask, 1],
               c=color, label=label, alpha=0.7, s=30)
ax.set_title("t-SNE Visualization of Breast Cancer Dataset")
ax.legend()
ax.axis("off")
plt.tight_layout()
plt.show()
\`\`\`

## PCA vs t-SNE vs UMAP

| Method | Preserves | Speed | Use case |
|--------|----------|-------|---------|
| **PCA** | Global linear structure, variance | Very fast | Feature compression, noise removal, ML pipeline |
| **t-SNE** | Local cluster structure | Slow (O(n²)) | 2D/3D visualization of clusters |
| **UMAP** | Both local and global structure | Fast | Best visualization for large datasets |

## Key Rules

1. **Always StandardScale** before PCA — variance is scale-sensitive
2. **Choose components** using the elbow on the cumulative variance plot (typically 90-95%)
3. **Inspect loadings** to understand what each PC represents in business terms
4. **t-SNE is visualization only** — never feed t-SNE coordinates into an ML model
5. **PCA components have no direct interpretation** — they are linear combinations of original features`,
    quiz: {
      title: 'PCA & Dimensionality Reduction Quiz',
      questions: [
        {
          text: 'Why must you StandardScale features before applying PCA?',
          options: opts(
            'StandardScaler is required by the PCA API in scikit-learn',
            'PCA maximizes variance, so features with larger scales will dominate the components regardless of their actual importance',
            'Scaling prevents numerical overflow in the eigenvalue decomposition',
            'PCA requires all features to have values between 0 and 1'
          ),
          correctAnswer: 'b',
          explanation: 'PCA finds directions of maximum variance. A feature with values in thousands will dominate over a feature in single digits purely due to scale, not actual information content. StandardScaler puts all features on equal footing.',
          orderIndex: 0,
        },
        {
          text: 'What does the "explained variance ratio" of a principal component tell you?',
          options: opts(
            'The percentage of features from the original dataset that the component captures',
            'The proportion of total variance in the dataset captured by that principal component',
            'The correlation between the component and the target variable',
            'The percentage of samples that are best explained by that component'
          ),
          correctAnswer: 'b',
          explanation: 'Each PC\'s explained variance ratio shows what fraction of the total data variance it captures. PC1 has the highest ratio (most informative direction), PC2 the next, etc. Cumulative ratios tell you how many PCs you need.',
          orderIndex: 1,
        },
        {
          text: 'What is a scree plot used for in PCA?',
          options: opts(
            'Visualizing the 2D projection of high-dimensional data',
            'Plotting feature loadings to understand which original features contribute to each PC',
            'Showing explained variance per component to identify the elbow point for choosing the number of components',
            'Displaying the eigenvalues of the correlation matrix as a heatmap'
          ),
          correctAnswer: 'c',
          explanation: 'The scree plot shows explained variance per component, helping identify the "elbow" — the point of diminishing returns where adding more components captures little additional variance. This guides the choice of n_components.',
          orderIndex: 2,
        },
        {
          text: 'What do PCA component "loadings" represent?',
          options: opts(
            'The predicted values of each sample in the principal component space',
            'The proportion of variance explained by each original feature',
            'The weights (coefficients) of each original feature in the linear combination that defines each principal component',
            'The correlation between principal components and the target variable'
          ),
          correctAnswer: 'c',
          explanation: 'PCA loadings are the eigenvectors of the covariance matrix. A high loading (positive or negative) for a feature on a PC means that feature strongly contributes to that component — useful for interpreting what a PC means in business terms.',
          orderIndex: 3,
        },
        {
          text: 'What is the key difference between t-SNE and PCA in terms of use case?',
          options: opts(
            't-SNE preserves global variance; PCA preserves local cluster structure',
            'PCA is for feature compression and ML pipelines; t-SNE is for 2D/3D visualization only — t-SNE coordinates should never be used as ML features',
            't-SNE is deterministic and reproducible; PCA is stochastic',
            'PCA works only on numerical data; t-SNE handles both numerical and categorical features'
          ),
          correctAnswer: 'b',
          explanation: 't-SNE is a non-linear, non-deterministic embedding designed purely for visualization. Its coordinates are meaningless beyond visual cluster separation. PCA produces interpretable linear projections suitable for feature engineering and ML pipelines.',
          orderIndex: 4,
        },
        {
          text: 'If `PCA(n_components=0.95)` reduces 50 features to 12 components, what does this mean?',
          options: opts(
            'The 12 components each explain exactly 0.95% of the variance',
            'The 12 components together explain 95% of the total variance in the original 50-feature dataset',
            '95% of the 50 original features have been discarded, keeping 12 representative features',
            '12 components were found to be statistically significant at the 0.95 confidence level'
          ),
          correctAnswer: 'b',
          explanation: "Passing a float (0 < n_components < 1) to sklearn's PCA tells it to keep enough components to explain that fraction of the total variance. 12 components that together explain 95% means significant compression with minimal information loss.",
          orderIndex: 5,
        },
        {
          text: 'When should you NOT use PCA as a preprocessing step?',
          options: opts(
            'When your dataset has more than 100 features',
            'When you need to interpret which original features drive predictions — PCA components are not directly interpretable',
            'When training neural networks — PCA is incompatible with deep learning frameworks',
            'When your features are already standardized to mean 0 and standard deviation 1'
          ),
          correctAnswer: 'b',
          explanation: 'PCA components are linear combinations of all original features, making model interpretation impossible. For regulatory compliance, feature importance reporting, or business stakeholder explainability, use feature selection (Lasso, RFE) instead of PCA.',
          orderIndex: 6,
        },
        {
          text: 'Which recommendation improves t-SNE quality for large datasets (10,000+ samples)?',
          options: opts(
            'Increase perplexity to 500 or more to capture more global structure',
            'Run PCA first to reduce to ~50 dimensions, then apply t-SNE for faster and more stable results',
            'Normalize features to [0,1] range before t-SNE instead of StandardScaler',
            'Use n_iter=100 to prevent overfitting of the t-SNE embedding'
          ),
          correctAnswer: 'b',
          explanation: 't-SNE has O(n²) complexity and becomes unstable with many features. The standard practice is to first run PCA to ~50 components (fast, preserves linear structure), then apply t-SNE to the 50-dimensional representation for the final 2D visualization.',
          orderIndex: 7,
        },
        {
          text: 'What is the "curse of dimensionality" and how does PCA help?',
          options: opts(
            'High-dimensional data takes too long to load — PCA speeds up file I/O',
            'In high dimensions, all points become equidistant, making distance-based algorithms (KNN, K-Means, SVM) unreliable — PCA removes redundant dimensions, restoring meaningful distances',
            'Gradient descent converges more slowly in high dimensions — PCA solves vanishing gradients',
            'High-dimensional visualizations cannot be rendered on 2D screens — PCA enables 2D plotting'
          ),
          correctAnswer: 'b',
          explanation: 'In high dimensions, the ratio of max to min distances between points approaches 1 — everything looks equally similar. This cripples KNN, K-Means, and other distance-based algorithms. PCA removes redundant/noisy dimensions, preserving meaningful structure.',
          orderIndex: 8,
        },
        {
          text: 'What is UMAP\'s main advantage over t-SNE for large-scale data visualization?',
          options: opts(
            'UMAP is fully deterministic and always produces identical results',
            'UMAP preserves both local cluster structure and global topology, and runs much faster than t-SNE',
            'UMAP components can be used directly as features in ML models',
            'UMAP requires no hyperparameter tuning while t-SNE requires careful perplexity selection'
          ),
          correctAnswer: 'b',
          explanation: 'UMAP (Uniform Manifold Approximation and Projection) is O(n log n) vs t-SNE\'s O(n²), making it much faster for large datasets. It also better preserves global structure (how clusters relate to each other), not just local neighborhoods.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 42 — Clustering & Unsupervised Learning
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-42-clustering-unsupervised-learning',
    title:      'Clustering & Unsupervised Learning',
    description: 'Discover hidden patterns in unlabeled data with K-Means, DBSCAN, and hierarchical clustering — and transform clusters into actionable business segments.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 142,
    xpReward:   120,
    language:   'python',
    codeExample: `import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt

np.random.seed(42)
# Customer feature matrix
X = pd.DataFrame({
    "recency_days":      np.random.exponential(30, 1000),
    "frequency_orders":  np.random.randint(1, 50, 1000),
    "monetary_total":    np.random.exponential(300, 1000),
    "avg_order_value":   np.random.exponential(65, 1000),
})
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── K-Means: Elbow Method + Silhouette ──
inertias, sil_scores = [], []
K_range = range(2, 11)
for k in K_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    km.fit(X_scaled)
    inertias.append(km.inertia_)
    sil_scores.append(silhouette_score(X_scaled, km.labels_))

best_k = K_range[sil_scores.index(max(sil_scores))]
print(f"Best K by silhouette: {best_k}")

# Fit final model
km_final = KMeans(n_clusters=best_k, n_init=10, random_state=42)
X["cluster"] = km_final.fit_predict(X_scaled)

# Cluster profiles
profile = X.groupby("cluster").mean().round(1)
print(profile)`,
    content: `# Clustering & Unsupervised Learning

Clustering finds groups (clusters) of similar data points without any predefined labels. It is the primary tool for customer segmentation, anomaly detection, document grouping, and exploratory data analysis where no ground truth exists.

## When to Use Clustering

| Use case | Example |
|----------|---------|
| Customer segmentation | Group customers by behavior for targeted campaigns |
| Document organization | Group news articles by topic |
| Anomaly detection | Points in sparse clusters may be anomalies |
| Image compression | Quantize colors into K representative colors |
| Gene expression analysis | Group genes with similar expression patterns |
| Market basket grouping | Group products frequently bought together |

## K-Means Clustering

K-Means partitions n observations into K clusters, minimizing within-cluster sum of squares (inertia).

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt

np.random.seed(42)

# Customer behavioral features
customers = pd.DataFrame({
    "customer_id":      range(1000),
    "recency_days":     np.random.exponential(30, 1000),
    "frequency_orders": np.random.randint(1, 50, 1000),
    "monetary_total":   np.random.exponential(300, 1000),
    "avg_order_value":  np.random.exponential(65, 1000),
    "return_rate":      np.random.uniform(0, 0.4, 1000),
    "days_since_signup":np.random.randint(30, 1000, 1000),
})

features = ["recency_days","frequency_orders","monetary_total","avg_order_value","return_rate"]
X = customers[features]

# ALWAYS scale before clustering
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Choosing K: Elbow + Silhouette ──
inertias, sil_scores = [], []
K_range = range(2, 11)

for k in K_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels = km.fit_predict(X_scaled)
    inertias.append(km.inertia_)
    sil_scores.append(silhouette_score(X_scaled, labels))

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(K_range, inertias, marker="o", color="steelblue")
axes[0].set_xlabel("K"); axes[0].set_ylabel("Inertia")
axes[0].set_title("Elbow Method")

axes[1].plot(K_range, sil_scores, marker="o", color="coral")
axes[1].set_xlabel("K"); axes[1].set_ylabel("Silhouette Score")
axes[1].set_title("Silhouette Score (higher = better)")
plt.tight_layout()
plt.show()

best_k = K_range.start + sil_scores.index(max(sil_scores))
print(f"Best K by silhouette: {best_k}")

# Fit final model
km = KMeans(n_clusters=best_k, n_init=10, random_state=42)
customers["cluster"] = km.fit_predict(X_scaled)
\`\`\`

### Interpreting & Naming Clusters

\`\`\`python
# Cluster profiles — the key to business value
cluster_profiles = customers.groupby("cluster")[features].mean().round(2)
cluster_profiles["count"] = customers.groupby("cluster").size()
cluster_profiles["pct"]   = (cluster_profiles["count"] / len(customers) * 100).round(1)

print(cluster_profiles.sort_values("monetary_total", ascending=False))

# Assign business names based on profiles
segment_names = {
    0: "Champions",       # High frequency, high monetary, low recency
    1: "At-Risk",         # Once-loyal customers, now inactive
    2: "New Customers",   # Low recency, low frequency
    3: "Promising",       # Mid-range, growing frequency
}
customers["segment"] = customers["cluster"].map(segment_names)
\`\`\`

## DBSCAN — Density-Based Clustering

DBSCAN (Density-Based Spatial Clustering of Applications with Noise) finds clusters of arbitrary shapes and labels outliers as noise — no need to specify K.

\`\`\`python
from sklearn.cluster import DBSCAN

# Key parameters:
# eps: neighborhood radius — points within eps of each other are neighbors
# min_samples: minimum core point neighbors to form a cluster
dbscan = DBSCAN(eps=0.5, min_samples=10)
customers["dbscan_cluster"] = dbscan.fit_predict(X_scaled)

n_clusters = len(set(customers["dbscan_cluster"])) - (1 if -1 in customers["dbscan_cluster"].values else 0)
n_noise    = (customers["dbscan_cluster"] == -1).sum()

print(f"DBSCAN found {n_clusters} clusters")
print(f"Noise points (potential anomalies): {n_noise} ({n_noise/len(customers):.1%})")

# Noise points are anomalies
anomalies = customers[customers["dbscan_cluster"] == -1]
print("\\nAnomaly profile:")
print(anomalies[features].describe().loc[["mean","max"]])
\`\`\`

### Tuning DBSCAN Parameters

\`\`\`python
from sklearn.neighbors import NearestNeighbors

# Estimate eps: plot k-nearest neighbor distances (sorted)
# The elbow in this plot suggests a good eps value
nn = NearestNeighbors(n_neighbors=10)
nn.fit(X_scaled)
distances, _ = nn.kneighbors(X_scaled)
distances = np.sort(distances[:, -1])  # distance to 10th nearest neighbor

plt.plot(distances)
plt.axhline(0.5, color="red", linestyle="--", label="eps candidate = 0.5")
plt.xlabel("Points sorted by distance")
plt.ylabel("Distance to 10th nearest neighbor")
plt.title("Elbow Plot for DBSCAN eps Selection")
plt.legend()
plt.show()
\`\`\`

## Hierarchical Clustering

Agglomerative hierarchical clustering builds a tree of clusters (dendrogram). Unlike K-Means, you can cut the tree at any level to get any number of clusters.

\`\`\`python
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import pdist

# Dendrogram (use a sample for visualization)
sample = X_scaled[:100]
linked = linkage(sample, method="ward")

plt.figure(figsize=(14, 5))
dendrogram(linked, truncate_mode="lastp", p=20, leaf_rotation=90, leaf_font_size=10)
plt.axhline(y=10, color="red", linestyle="--", label="Cut here for K=4")
plt.title("Hierarchical Clustering Dendrogram")
plt.xlabel("Sample index (or cluster size)")
plt.ylabel("Distance (Ward linkage)")
plt.legend()
plt.tight_layout()
plt.show()

# Agglomerative clustering
agg = AgglomerativeClustering(n_clusters=4, linkage="ward")
customers["agg_cluster"] = agg.fit_predict(X_scaled)
\`\`\`

## Comparing Clustering Algorithms

| Algorithm | Shape | Scalability | Parameters | Strengths |
|-----------|-------|-------------|------------|-----------|
| **K-Means** | Spherical | Large (100K+) | K | Fast, simple, scales well |
| **DBSCAN** | Arbitrary | Medium (10K) | eps, min_samples | Detects outliers, no K needed |
| **Agglomerative** | Any | Small-Medium | K, linkage | Produces dendrogram, flexible |
| **Gaussian Mixture** | Elliptical | Medium | K | Soft assignments, probabilistic |

## Cluster Evaluation Metrics

\`\`\`python
from sklearn.metrics import (silhouette_score, calinski_harabasz_score,
                              davies_bouldin_score)

labels = customers["cluster"]

# Silhouette: [-1, 1], higher is better (0.5+ is good)
sil = silhouette_score(X_scaled, labels)

# Calinski-Harabasz: higher is better (dense, well-separated clusters)
ch = calinski_harabasz_score(X_scaled, labels)

# Davies-Bouldin: lower is better (0 = perfect)
db = davies_bouldin_score(X_scaled, labels)

print(f"Silhouette Score:          {sil:.4f}")
print(f"Calinski-Harabasz Score:   {ch:.2f}")
print(f"Davies-Bouldin Score:      {db:.4f}")
\`\`\`

## Translating Clusters into Business Actions

\`\`\`python
# Action mapping based on cluster characteristics
actions = {
    "Champions":    "Loyalty program + upsell premium tier",
    "At-Risk":      "Win-back campaign: 20% discount + personal email",
    "New Customers":"Onboarding sequence + first-purchase incentive",
    "Promising":    "Nurture with product education + cross-sell",
}

summary = customers.groupby("segment").agg(
    count        = ("customer_id","count"),
    avg_ltv      = ("monetary_total","mean"),
    avg_frequency= ("frequency_orders","mean"),
).round(2)
summary["action"] = summary.index.map(actions)
print(summary.to_string())
\`\`\`

## Key Takeaways

- **Always scale features** before clustering — K-Means is distance-based and scale-sensitive
- **Use both elbow and silhouette** to choose K — they sometimes disagree; silhouette is more principled
- **DBSCAN labels noise as -1** — these points are often the most interesting (anomalies, high-value outliers)
- **Interpret clusters by their business meaning**, not just their stats — names like "Champions" and "At-Risk" drive action
- **Validate clusters** with held-out business metrics (e.g., do "Champions" have the highest CLV?)`,
    quiz: {
      title: 'Clustering & Unsupervised Learning Quiz',
      questions: [
        {
          text: 'What does K-Means minimize to form clusters?',
          options: opts(
            'The maximum distance between any two points in the same cluster',
            'The sum of squared distances from each point to its assigned cluster centroid (inertia)',
            'The number of clusters needed to classify all points uniquely',
            'The variance of cluster sizes across all K clusters'
          ),
          correctAnswer: 'b',
          explanation: 'K-Means minimizes the within-cluster sum of squares (WCSS / inertia) — the sum of squared Euclidean distances from each point to its nearest centroid. This makes clusters compact and close to their center.',
          orderIndex: 0,
        },
        {
          text: 'What does a high Silhouette Score (close to +1) indicate?',
          options: opts(
            'The clustering algorithm converged quickly with few iterations',
            'Points are well inside their own cluster and far from neighboring clusters — good separation and cohesion',
            'The number of clusters K is larger than the optimal value',
            'There are very few outlier points in the dataset'
          ),
          correctAnswer: 'b',
          explanation: 'Silhouette score = (b - a) / max(a, b) where a = average intra-cluster distance, b = average nearest-cluster distance. Score near +1 means each point is much closer to its own cluster than to others — clear, well-separated clusters.',
          orderIndex: 1,
        },
        {
          text: 'What does DBSCAN label as cluster -1?',
          options: opts(
            'The first and largest cluster (0-indexed)',
            'Points that are too far from any dense region — noise points / outliers',
            'Centroids that failed to converge',
            'Clusters with fewer than min_samples points'
          ),
          correctAnswer: 'b',
          explanation: 'DBSCAN assigns -1 to noise points — observations that are not within eps distance of at least min_samples other points. These noise points often represent anomalies or rare events worth investigating.',
          orderIndex: 2,
        },
        {
          text: 'What is the key advantage of DBSCAN over K-Means?',
          options: opts(
            'DBSCAN always produces better clusters than K-Means',
            'DBSCAN does not require specifying K, can find arbitrarily shaped clusters, and automatically identifies outliers',
            'DBSCAN is faster than K-Means for large datasets',
            'DBSCAN produces soft (probabilistic) cluster assignments'
          ),
          correctAnswer: 'b',
          explanation: 'K-Means requires K upfront, finds only convex (spherical) clusters, and treats all points as cluster members. DBSCAN requires only eps and min_samples, finds arbitrary shapes (crescents, rings), and labels outliers as noise.',
          orderIndex: 3,
        },
        {
          text: 'What does a dendrogram in hierarchical clustering show?',
          options: opts(
            'The explained variance at each step of the clustering process',
            'The silhouette score for each number of clusters from 1 to N',
            'A tree diagram showing the sequence and distance at which clusters were merged — the height of a merge indicates how different the merged clusters are',
            'The scatter plot of the first two principal components colored by cluster'
          ),
          correctAnswer: 'c',
          explanation: 'A dendrogram is a tree where each leaf is a data point, and branches represent cluster merges. The height of each merge shows the dissimilarity (distance) at which two clusters joined. A horizontal cut gives a flat clustering with a specific K.',
          orderIndex: 4,
        },
        {
          text: 'Why must features be scaled before K-Means clustering?',
          options: opts(
            'K-Means requires features to be normally distributed',
            'K-Means uses Euclidean distance, so features with larger scales dominate the distance calculation regardless of importance',
            'Scikit-learn\'s KMeans API requires scaled input as a technical constraint',
            'Scaling speeds up the K-Means convergence by reducing the number of iterations'
          ),
          correctAnswer: 'b',
          explanation: 'Euclidean distance is the core of K-Means. A feature with values in thousands will overwhelm a feature with values in single digits in the distance calculation. StandardScaler normalizes all features to equal footing.',
          orderIndex: 5,
        },
        {
          text: 'What is the "elbow method" for choosing K in K-Means?',
          options: opts(
            'Testing K values from 1 to 20 and choosing the K with the highest silhouette score',
            'Plotting inertia (within-cluster sum of squares) vs K and finding the point where adding more clusters yields diminishing inertia reduction',
            'Choosing the K that maximizes the ratio of between-cluster variance to within-cluster variance',
            'Fitting K-Means with K = square root of N samples'
          ),
          correctAnswer: 'b',
          explanation: 'The elbow plot shows inertia decreasing as K increases. The "elbow" is where inertia stops dropping steeply — adding clusters beyond this point produces little improvement. It is best used alongside the silhouette score for confirmation.',
          orderIndex: 6,
        },
        {
          text: 'What does the `eps` parameter in DBSCAN control?',
          options: opts(
            'The maximum number of clusters DBSCAN is allowed to form',
            'The neighborhood radius — two points are neighbors if their distance is at most eps',
            'The minimum number of clusters required for the algorithm to converge',
            'The epsilon (tolerance) for numerical convergence of the centroid positions'
          ),
          correctAnswer: 'b',
          explanation: 'eps defines the radius of the neighborhood around each point. A point is a "core point" if it has at least min_samples neighbors within eps distance. The k-NN distance plot (elbow at the kth distance) is the standard way to estimate a good eps value.',
          orderIndex: 7,
        },
        {
          text: 'After clustering customers into segments, what is the most important next step?',
          options: opts(
            'Tuning hyperparameters to reduce the silhouette score variance',
            'Interpreting each cluster\'s profile and mapping it to actionable business strategies (e.g., win-back campaign for At-Risk segment)',
            'Publishing the cluster assignments to the data warehouse without further analysis',
            'Validating clusters using a held-out test set of labeled customers'
          ),
          correctAnswer: 'b',
          explanation: 'Clusters have no business value until interpreted. Profile each cluster (mean recency, frequency, monetary, return rate), give them business names, and design differentiated actions — that is when clustering generates ROI.',
          orderIndex: 8,
        },
        {
          text: 'Which clustering metric penalizes clusters that are too close to each other (low separation), and should be minimized?',
          options: opts(
            'Silhouette Score',
            'Calinski-Harabasz Score',
            'Davies-Bouldin Score',
            'Inertia (WCSS)'
          ),
          correctAnswer: 'c',
          explanation: 'Davies-Bouldin Score measures the average similarity between each cluster and its most similar cluster (considering both scatter and separation). Lower = better. A score of 0 would mean perfectly separated, non-overlapping clusters.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 43 — NLP Fundamentals for Data Analysts
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-43-nlp-fundamentals-analysts',
    title:      'NLP Fundamentals for Data Analysts',
    description: 'Extract insights from text data — customer reviews, support tickets, surveys — using TF-IDF, sentiment analysis, topic modeling, and pre-trained language models.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 143,
    xpReward:   120,
    language:   'python',
    codeExample: `import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

reviews = [
    "Absolutely love this product! Fast shipping and great quality.",
    "Terrible experience. Product broke after 2 days. Never buying again.",
    "Good value for the price. Average quality but does the job.",
    "Outstanding customer service! Fixed my issue within an hour.",
    "Disappointed with the packaging. Product itself is okay.",
]

# ── TF-IDF ──
tfidf = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=100)
X_tfidf = tfidf.fit_transform(reviews)
feature_names = tfidf.get_feature_names_out()
tfidf_df = pd.DataFrame(X_tfidf.toarray(), columns=feature_names)
print("Top TF-IDF terms per review:")
for i, row in tfidf_df.iterrows():
    top = row.nlargest(3).index.tolist()
    print(f"  Review {i+1}: {top}")

# ── Sentiment Analysis (VADER) ──
sia = SentimentIntensityAnalyzer()
for i, review in enumerate(reviews):
    scores = sia.polarity_scores(review)
    label = "POSITIVE" if scores["compound"] > 0.05 else ("NEGATIVE" if scores["compound"] < -0.05 else "NEUTRAL")
    print(f"Review {i+1}: {label} (compound={scores['compound']:.3f})")`,
    content: `# NLP Fundamentals for Data Analysts

Text data is everywhere in analytics — customer reviews, support tickets, survey responses, social media comments, product feedback. NLP (Natural Language Processing) lets you extract structured insights from this unstructured goldmine.

## Text Preprocessing Pipeline

\`\`\`python
import pandas as pd
import numpy as np
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

nltk.download("punkt", quiet=True)
nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)

sample_text = "The product was AMAZING!!! Shipping took 3-5 days. 10/10 would buy again 😊"

def preprocess_text(text):
    # 1. Lowercase
    text = text.lower()
    # 2. Remove URLs, emails, special characters
    text = re.sub(r"http\\S+|www\\S+|@\\S+", "", text)
    text = re.sub(r"[^a-z0-9\\s]", " ", text)
    # 3. Tokenize
    tokens = word_tokenize(text)
    # 4. Remove stopwords
    stop_words = set(stopwords.words("english"))
    tokens = [t for t in tokens if t not in stop_words and len(t) > 2]
    # 5. Lemmatize (go → go, running → run, better → good)
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    return " ".join(tokens)

cleaned = preprocess_text(sample_text)
print(f"Original: {sample_text}")
print(f"Cleaned:  {cleaned}")
\`\`\`

## Bag of Words vs TF-IDF

\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

reviews = [
    "Absolutely love this product! Fast shipping and great quality.",
    "Terrible experience. Product broke after 2 days. Never buying again.",
    "Good value for the price. Average quality but does the job.",
    "Outstanding customer service! Fixed my issue within an hour.",
    "Disappointed with the packaging. Product itself is okay.",
    "Best purchase I have made this year. Highly recommend to everyone.",
]

# ── Bag of Words (simple word counts) ──
bow = CountVectorizer(stop_words="english")
X_bow = bow.fit_transform(reviews)
print(f"BoW matrix: {X_bow.shape}")  # (6 reviews, vocab_size)

# ── TF-IDF (weights by uniqueness across documents) ──
# TF = term frequency in document
# IDF = log(N_docs / docs_containing_term) — rare words get higher weight
tfidf = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 2),   # include bigrams like "great quality"
    max_features=200,
    min_df=1,             # minimum document frequency
)
X_tfidf = tfidf.fit_transform(reviews)

# Most important terms per review
feature_names = tfidf.get_feature_names_out()
tfidf_df = pd.DataFrame(X_tfidf.toarray(), columns=feature_names)

print("\\nTop 3 TF-IDF terms per review:")
for i in range(len(reviews)):
    top3 = tfidf_df.iloc[i].nlargest(3).index.tolist()
    print(f"  Review {i+1}: {top3}")
\`\`\`

## Sentiment Analysis

### VADER (Rule-Based, Fast)

\`\`\`python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
# pip install vaderSentiment

sia = SentimentIntensityAnalyzer()

for i, review in enumerate(reviews):
    scores = sia.polarity_scores(review)
    compound = scores["compound"]
    if compound > 0.05:
        label = "POSITIVE"
    elif compound < -0.05:
        label = "NEGATIVE"
    else:
        label = "NEUTRAL"
    print(f"Review {i+1}: {label:8s} | compound={compound:+.3f} | pos={scores['pos']:.2f} neg={scores['neg']:.2f}")
\`\`\`

### Transformers (Pre-Trained BERT — Better Accuracy)

\`\`\`python
# pip install transformers torch
from transformers import pipeline

sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
)

results = sentiment_pipeline(reviews)
for review, result in zip(reviews, results):
    print(f"  [{result['label']:8s} {result['score']:.2%}] {review[:60]}...")
\`\`\`

## Topic Modeling with LDA

\`\`\`python
from sklearn.decomposition import LatentDirichletAllocation

# Larger corpus for meaningful topics
corpus = [
    "shipping fast delivery package arrived quickly",
    "quality excellent product durable great material",
    "customer service support helpful resolved issue",
    "price value affordable worth money budget",
    "return refund exchange process easy smooth",
    "product broke damaged poor quality disappointed",
    "packaging well wrapped protected bubble wrap",
    "size fit description accurate measurements correct",
] * 10  # repeat to simulate larger corpus

bow_lda = CountVectorizer(stop_words="english", min_df=1)
X_lda = bow_lda.fit_transform(corpus)

lda = LatentDirichletAllocation(n_components=4, random_state=42, max_iter=20)
lda.fit(X_lda)

feature_names_lda = bow_lda.get_feature_names_out()
n_top_words = 6

print("\\nLDA Topics:")
for topic_idx, topic in enumerate(lda.components_):
    top_words = [feature_names_lda[i] for i in topic.argsort()[:-n_top_words - 1:-1]]
    print(f"  Topic {topic_idx + 1}: {', '.join(top_words)}")
\`\`\`

## Text Classification Pipeline

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

# Classify support tickets by category
tickets = [
    "My order has not arrived yet, where is it?",
    "The product stopped working after one week",
    "I was charged twice for the same item",
    "I need to change my delivery address",
    "The screen cracked, can I get a replacement?",
    "My payment failed but money was deducted",
] * 30

labels = [0, 1, 2, 0, 1, 2] * 30  # 0=shipping, 1=product, 2=billing

text_clf = Pipeline([
    ("tfidf", TfidfVectorizer(stop_words="english", ngram_range=(1, 2))),
    ("clf",   LogisticRegression(max_iter=1000, random_state=42)),
])

scores = cross_val_score(text_clf, tickets, labels, cv=5, scoring="accuracy")
print(f"Ticket classification accuracy: {scores.mean():.2%} ± {scores.std():.2%}")
\`\`\`

## Word Frequency & N-gram Analysis

\`\`\`python
from collections import Counter

def get_top_ngrams(texts, n=1, top_k=10):
    vectorizer = CountVectorizer(ngram_range=(n, n), stop_words="english")
    X = vectorizer.fit_transform(texts)
    counts = X.sum(axis=0).A1
    vocab = vectorizer.get_feature_names_out()
    return sorted(zip(vocab, counts), key=lambda x: -x[1])[:top_k]

print("Top unigrams:")
for term, count in get_top_ngrams(reviews, n=1):
    print(f"  {term}: {count}")

print("\\nTop bigrams:")
for term, count in get_top_ngrams(reviews, n=2):
    print(f"  {term}: {count}")
\`\`\`

## Business Applications of NLP

| Use Case | Technique | Insight |
|----------|-----------|---------|
| Review monitoring | VADER/BERT sentiment | Track NPS equivalent from reviews |
| Support ticket routing | TF-IDF + classifier | Auto-route to correct team |
| Survey analysis | LDA topic modeling | Identify top themes without reading all responses |
| Competitor analysis | TF-IDF on competitor reviews | What are customers saying about competitors? |
| Voice of Customer | Named entity + sentiment | Extract product/feature mentions + sentiment |
| Churn signals | Sentiment in support tickets | Negative sentiment predicts churn |

## Key Takeaways

- **Always preprocess text** — lowercase, remove punctuation, strip stopwords, lemmatize
- **TF-IDF beats Bag of Words** — rare distinctive words get more weight than common filler
- **VADER is fast and good** for social media / review language; BERT is more accurate but slower
- **LDA is the standard topic model** — start with K=5-10 topics, read the top words per topic to interpret
- **Text + tabular features** combined in one model is powerful — sentiment score as a feature in a churn model`,
    quiz: {
      title: 'NLP Fundamentals for Data Analysts Quiz',
      questions: [
        {
          text: 'What does TF-IDF stand for and what does it measure?',
          options: opts(
            'Text Frequency-Inverse Document Frequency — measures how often a word appears in the entire corpus',
            'Term Frequency-Inverse Document Frequency — measures how important a word is in a specific document relative to how common it is across all documents',
            'Token Frequency-Indexed Document Format — a standardized text encoding for machine learning',
            'Term Feature-Inverse Dimensionality Factor — the PCA equivalent for text data'
          ),
          correctAnswer: 'b',
          explanation: 'TF-IDF = TF × IDF. TF = frequency of term in document (high = important to this doc). IDF = log(N_docs / docs_containing_term) — words rare across documents get high IDF weight. Common words like "the" have near-zero IDF.',
          orderIndex: 0,
        },
        {
          text: 'What is lemmatization and how does it differ from stemming?',
          options: opts(
            'Lemmatization removes suffixes blindly (running→runn); stemming uses a dictionary to return the base dictionary form (running→run)',
            'Lemmatization uses linguistic knowledge to return the base dictionary form (running→run, better→good); stemming removes suffixes blindly and may produce non-words',
            'Lemmatization converts words to lowercase; stemming removes punctuation',
            'Lemmatization and stemming are identical operations with different performance characteristics'
          ),
          correctAnswer: 'b',
          explanation: 'Lemmatization uses a lexical database (WordNet) to return the actual base form (lemma): "better" → "good", "running" → "run". Stemming blindly chops suffixes: "running" → "runn", "better" → "better". Lemmatization is more accurate for analytics.',
          orderIndex: 1,
        },
        {
          text: 'What does a VADER compound score of +0.85 indicate?',
          options: opts(
            'The text contains 85% positive words by count',
            'The text has a strong positive sentiment overall',
            'The text has 85% accuracy as classified by VADER',
            'The text scores in the 85th percentile of all analyzed texts'
          ),
          correctAnswer: 'b',
          explanation: 'VADER compound score ranges from -1 (extremely negative) to +1 (extremely positive). Scores > +0.05 are positive, < -0.05 are negative. A score of +0.85 indicates strongly positive sentiment — the text likely contains multiple positive descriptors.',
          orderIndex: 2,
        },
        {
          text: 'What does Latent Dirichlet Allocation (LDA) produce as output?',
          options: opts(
            'A single label for each document from a predefined set of categories',
            'A numerical vector representing each word in a high-dimensional space',
            'K topics, each represented as a probability distribution over vocabulary words, plus topic mixtures for each document',
            'A ranked list of the most important documents for each query term'
          ),
          correctAnswer: 'c',
          explanation: 'LDA is a generative probabilistic model. It produces K topics (each a distribution over words — top words define the topic theme) and for each document, a mixture of topics (e.g., "60% shipping, 30% quality, 10% pricing").',
          orderIndex: 3,
        },
        {
          text: 'Why do TF-IDF representations typically outperform simple Bag-of-Words for document classification?',
          options: opts(
            'TF-IDF matrices are always smaller and thus faster to process',
            'TF-IDF down-weights common words that appear in all documents (low discriminating power) and up-weights rare words that distinguish specific documents',
            'TF-IDF preserves word order while Bag-of-Words does not',
            'TF-IDF includes word embeddings while Bag-of-Words uses only word counts'
          ),
          correctAnswer: 'b',
          explanation: 'Words like "the", "is", "and" appear in all documents and carry no discriminating information — but have high count in BoW. TF-IDF multiplies term frequency by the inverse document frequency, automatically down-weighting ubiquitous words and up-weighting distinctive ones.',
          orderIndex: 4,
        },
        {
          text: 'When would you prefer BERT-based sentiment analysis over VADER?',
          options: opts(
            'When text data is purely social media slang and emojis, where VADER fails',
            'When you need high accuracy on complex, domain-specific, or nuanced text where context matters (sarcasm, negation, compound sentences)',
            'When you have a very large corpus and need faster processing than VADER provides',
            'When the text data is in languages other than English, where VADER is not supported'
          ),
          correctAnswer: 'b',
          explanation: 'VADER is rule-based and fast — great for social media. BERT-based models understand context: "not bad" is positive, "the service was deceptively smooth right up until it failed" is negative. BERT handles negation, sarcasm, and domain nuance that VADER misses.',
          orderIndex: 5,
        },
        {
          text: 'In the preprocessing step, what is the purpose of removing stopwords?',
          options: opts(
            'Stopwords contain profanity that violates content policies',
            'Stopwords (the, is, and, a) appear in almost all documents, carry no discriminating information, and add noise to the feature space',
            'Stopwords cause tokenization errors in NLTK',
            'Removing stopwords reduces dimensionality, which is only useful for memory-constrained systems'
          ),
          correctAnswer: 'b',
          explanation: 'Stopwords are extremely common function words with near-zero IDF — they contribute nothing to document classification or topic modeling. Removing them reduces noise and dimensionality, improving both speed and model accuracy.',
          orderIndex: 6,
        },
        {
          text: 'What is the `ngram_range=(1, 2)` parameter in TfidfVectorizer?',
          options: opts(
            'It limits the vocabulary to words with 1-2 characters',
            'It includes both unigrams (single words) and bigrams (two consecutive words) as features',
            'It requires each word to appear at least 1 time and at most 2 times',
            'It applies 1st-order and 2nd-order TF-IDF weighting simultaneously'
          ),
          correctAnswer: 'b',
          explanation: '`ngram_range=(1, 2)` creates features for both single words ("fast", "shipping") and consecutive word pairs ("fast shipping", "great quality"). Bigrams capture context that unigrams miss — "not great" is different from "not" and "great" separately.',
          orderIndex: 7,
        },
        {
          text: 'How can NLP-derived sentiment scores be integrated into a churn prediction model?',
          options: opts(
            'They cannot be integrated — NLP features and tabular features require separate models',
            'By computing sentiment scores from support tickets, reviews, or surveys and adding them as numerical features alongside behavioral and transactional features in the churn model',
            'By training the churn model only on text data and discarding all behavioral features',
            'By mapping sentiment labels (positive/negative) to replacement values for missing transactional data'
          ),
          correctAnswer: 'b',
          explanation: 'Sentiment scores are numbers (e.g., VADER compound in [-1, 1]) and can be appended as features in any tabular ML model. "Customer submitted 3 support tickets with average sentiment -0.7" is a powerful early churn signal alongside recency/frequency/monetary features.',
          orderIndex: 8,
        },
        {
          text: 'Which step in text preprocessing converts "running", "runs", and "ran" to the same base form?',
          options: opts(
            'Tokenization',
            'Stopword removal',
            'Lemmatization',
            'TF-IDF weighting'
          ),
          correctAnswer: 'c',
          explanation: 'Lemmatization maps all inflections of a word to its base form (lemma): "running" → "run", "runs" → "run", "ran" → "run". This reduces vocabulary size and ensures these three words are treated as the same feature in the model.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 44 — Bayesian Statistics for Data Analysts
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-44-bayesian-statistics',
    title:      'Bayesian Statistics for Data Analysts',
    description: 'Think probabilistically — update beliefs with evidence, calculate credible intervals, and make better decisions under uncertainty using Bayesian methods.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 144,
    xpReward:   115,
    language:   'python',
    codeExample: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import beta, binom

# ── Bayesian Beta-Binomial: Click-Through Rate Estimation ──
np.random.seed(42)

# Prior belief: CTR is probably between 2-8% (Beta(2, 48) centres on 4%)
prior_alpha, prior_beta = 2, 48

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

for ax_idx, (clicks, impressions, label) in enumerate([
    (0,    0,   "Prior only"),
    (12,   200, "After week 1 (200 impressions)"),
    (58,  1000, "After month 1 (1000 impressions)"),
]):
    # Bayesian update: posterior = Beta(alpha + clicks, beta + non-clicks)
    post_a = prior_alpha + clicks
    post_b = prior_beta  + (impressions - clicks)
    posterior = beta(post_a, post_b)

    x = np.linspace(0, 0.20, 300)
    axes[ax_idx].plot(x, posterior.pdf(x), color="steelblue", lw=2)
    axes[ax_idx].fill_between(x, posterior.pdf(x), alpha=0.3, color="steelblue")

    ci = posterior.ppf([0.025, 0.975])
    axes[ax_idx].axvline(posterior.mean(), color="navy", linestyle="--", label=f"Mean={posterior.mean():.3f}")
    axes[ax_idx].set_title(label, fontsize=10)
    axes[ax_idx].legend(fontsize=8)
    axes[ax_idx].set_xlabel("CTR")
    print(f"{label}: Mean={posterior.mean():.3f}, 95% CI=[{ci[0]:.3f}, {ci[1]:.3f}]")

plt.tight_layout()
plt.show()`,
    content: `# Bayesian Statistics for Data Analysts

Frequentist statistics asks: "Given the null hypothesis is true, how likely is this data?" Bayesian statistics asks: "Given this data, what do I believe about the parameter?" Bayesian methods are increasingly favored in industry because they naturally express uncertainty, incorporate prior knowledge, and produce directly interpretable results.

## The Bayesian Framework

\`\`\`
Prior Belief + Evidence (Data) → Updated Belief (Posterior)

        P(θ|Data) ∝ P(Data|θ) × P(θ)
        Posterior ∝ Likelihood × Prior
\`\`\`

- **Prior P(θ):** Your belief about the parameter before seeing data
- **Likelihood P(Data|θ):** How likely is the data if the parameter is θ?
- **Posterior P(θ|Data):** Your updated belief after seeing data

## Conjugate Priors — Closed-Form Bayesian Updating

For certain prior-likelihood pairs, the posterior has the same form as the prior — no MCMC needed.

### Beta-Binomial: Proportions (CTR, Conversion Rate)

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import beta

np.random.seed(42)

# Prior: CTR is probably between 2-8%, center at 4%
# Beta(alpha=2, beta=48) → mean = alpha/(alpha+beta) = 2/50 = 4%
prior_alpha, prior_beta = 2, 48

def bayesian_update(prior_a, prior_b, successes, total):
    """
    Beta-Binomial conjugate update.
    Posterior: Beta(alpha + successes, beta + (total - successes))
    """
    post_a = prior_a + successes
    post_b = prior_b + (total - successes)
    posterior = beta(post_a, post_b)
    ci = posterior.ppf([0.025, 0.975])
    return posterior, ci

scenarios = [
    (0, 0,     "Prior (no data)"),
    (12, 200,  "After 200 impressions"),
    (58, 1000, "After 1000 impressions"),
    (290, 5000,"After 5000 impressions"),
]

fig, axes = plt.subplots(1, 4, figsize=(18, 4))
x = np.linspace(0, 0.20, 400)

for ax, (clicks, impr, label) in zip(axes, scenarios):
    posterior, ci = bayesian_update(prior_alpha, prior_beta, clicks, impr)
    ax.plot(x, posterior.pdf(x), color="steelblue", lw=2)
    ax.fill_between(x, posterior.pdf(x), alpha=0.3, color="steelblue")
    ax.axvline(posterior.mean(), color="navy", linestyle="--",
               label=f"Mean={posterior.mean():.3f}")
    ax.axvspan(ci[0], ci[1], alpha=0.15, color="orange", label=f"95% CI")
    ax.set_title(label, fontsize=10)
    ax.set_xlabel("CTR")
    ax.legend(fontsize=7)
    print(f"{label}:")
    print(f"  Mean={posterior.mean():.4f} | 95% CI=[{ci[0]:.4f}, {ci[1]:.4f}] | Width={ci[1]-ci[0]:.4f}")

plt.tight_layout()
plt.show()
\`\`\`

### Normal-Normal: Continuous Metrics (Revenue, Duration)

\`\`\`python
from scipy.stats import norm

# Prior: average session duration is 3 minutes with uncertainty
prior_mean = 180   # seconds
prior_std  = 30    # uncertainty about the mean

# Observe n=100 sessions with sample mean=195s, known std=40s
n       = 100
obs_mean = 195
likelihood_std = 40  # known population std (or use sample std for large n)

# Bayesian update for Normal likelihood, Normal prior
prior_precision      = 1 / prior_std**2
likelihood_precision = n / likelihood_std**2

posterior_precision = prior_precision + likelihood_precision
posterior_std  = np.sqrt(1 / posterior_precision)
posterior_mean = (prior_mean * prior_precision + obs_mean * likelihood_precision) / posterior_precision

print(f"Prior:      mean={prior_mean:.1f}s, std={prior_std:.1f}s")
print(f"Observed:   mean={obs_mean:.1f}s, n={n}")
print(f"Posterior:  mean={posterior_mean:.1f}s, std={posterior_std:.2f}s")
print(f"95% Credible Interval: [{posterior_mean - 1.96*posterior_std:.1f}, {posterior_mean + 1.96*posterior_std:.1f}]")
\`\`\`

## Bayesian A/B Testing (Full Example)

\`\`\`python
# Compare two variants' conversion rates
# Variant A: 420 conversions from 8,420 visitors
# Variant B: 465 conversions from 8,380 visitors

va_conv, va_total = 420, 8420
vb_conv, vb_total = 465, 8380

# Uninformative prior: Beta(1, 1) = Uniform[0,1]
post_a = beta(1 + va_conv, 1 + va_total - va_conv)
post_b = beta(1 + vb_conv, 1 + vb_total - vb_conv)

# Monte Carlo: sample from posteriors 100,000 times
N = 100_000
samples_a = post_a.rvs(N, random_state=42)
samples_b = post_b.rvs(N, random_state=42)

prob_b_better     = np.mean(samples_b > samples_a)
expected_lift     = np.mean(samples_b - samples_a)
lift_ci           = np.percentile(samples_b - samples_a, [2.5, 97.5])
prob_practical    = np.mean(samples_b - samples_a > 0.005)  # > 0.5pp lift

print(f"CVR A: {va_conv/va_total:.3%} | CVR B: {vb_conv/vb_total:.3%}")
print(f"P(B > A):                   {prob_b_better:.1%}")
print(f"Expected lift:              {expected_lift:.4f} ({expected_lift/post_a.mean():.1%} relative)")
print(f"95% Credible Interval:      [{lift_ci[0]:.4f}, {lift_ci[1]:.4f}]")
print(f"P(lift > 0.5pp practical):  {prob_practical:.1%}")

# Bayesian factor analysis: visualize posterior overlap
x = np.linspace(0.03, 0.08, 500)
plt.figure(figsize=(10, 5))
plt.plot(x, post_a.pdf(x), color="#003087", lw=2, label=f"Variant A (CVR={va_conv/va_total:.3%})")
plt.plot(x, post_b.pdf(x), color="#FF6B35", lw=2, label=f"Variant B (CVR={vb_conv/vb_total:.3%})")
plt.fill_between(x, post_a.pdf(x), alpha=0.2, color="#003087")
plt.fill_between(x, post_b.pdf(x), alpha=0.2, color="#FF6B35")
plt.axvline(va_conv/va_total, color="#003087", linestyle="--", alpha=0.5)
plt.axvline(vb_conv/vb_total, color="#FF6B35", linestyle="--", alpha=0.5)
plt.title(f"Bayesian A/B Test — P(B > A) = {prob_b_better:.1%}", fontsize=13)
plt.xlabel("Conversion Rate")
plt.legend()
plt.tight_layout()
plt.show()
\`\`\`

## Frequentist vs Bayesian: Side-by-Side

\`\`\`python
from scipy import stats

# Same data — two interpretations
n_a, x_a = 8420, 420
n_b, x_b = 8380, 465
p_a = x_a / n_a
p_b = x_b / n_b

# ── Frequentist ──
z_stat, p_value = stats.proportions_ztest([x_a, x_b], [n_a, n_b])
print(f"Frequentist:")
print(f"  p-value: {p_value:.4f}")
print(f"  Reject H0 (p<0.05): {p_value < 0.05}")
print(f"  Interpretation: If H0 (no difference) is true, probability of seeing this data or more extreme is {p_value:.4f}")

# ── Bayesian ──
print(f"\\nBayesian:")
print(f"  P(B > A): {prob_b_better:.1%}")
print(f"  Interpretation: There is a {prob_b_better:.1%} probability that B has a higher true CVR than A")
\`\`\`

## Priors in Practice

| Prior type | Formula | Use when |
|------------|---------|---------|
| **Uninformative / flat** | Beta(1, 1) = Uniform | No prior knowledge; let data speak |
| **Weakly informative** | Beta(2, 20) | Know rough order of magnitude |
| **Informative** | Beta(50, 950) | Historical data is strong and reliable |
| **Expert-calibrated** | From domain knowledge | Regulatory/scientific settings |

## Key Takeaways

- **Prior + Likelihood → Posterior** — Bayesian inference is just probability arithmetic
- **Beta-Binomial** is the go-to model for proportions (CTR, conversion rate, defect rate)
- **Credible intervals are directly interpretable**: "95% probability the true rate is in [a, b]" — unlike frequentist CIs
- **P(B > A) is directly what executives want** — not "probability of rejecting the null"
- **More data = narrower posterior = less uncertainty** — the Bayesian framework shows learning in real-time
- Always ask: "What was my prior belief and is the data strong enough to shift it?"`,
    quiz: {
      title: 'Bayesian Statistics for Data Analysts Quiz',
      questions: [
        {
          text: 'In Bayesian inference, what is the "posterior" distribution?',
          options: opts(
            'The probability of the data before any observations are collected',
            'Your updated belief about a parameter after combining prior knowledge with observed data',
            'The probability distribution of future observations given the fitted model',
            'The null hypothesis distribution used in frequentist hypothesis testing'
          ),
          correctAnswer: 'b',
          explanation: 'The posterior P(θ|Data) combines prior belief P(θ) with the likelihood P(Data|θ) via Bayes\' theorem: P(θ|Data) ∝ P(Data|θ) × P(θ). It represents everything we know about the parameter after seeing the data.',
          orderIndex: 0,
        },
        {
          text: 'For click-through rate estimation, which prior-likelihood conjugate pair produces a Beta posterior?',
          options: opts(
            'Normal prior + Normal likelihood',
            'Gamma prior + Poisson likelihood',
            'Beta prior + Binomial likelihood',
            'Dirichlet prior + Multinomial likelihood'
          ),
          correctAnswer: 'c',
          explanation: 'Beta-Binomial is the conjugate pair for proportions. With Beta(α, β) prior and Binomial(n, p) likelihood, the posterior is Beta(α + successes, β + failures) — a clean closed-form update requiring no numerical integration.',
          orderIndex: 1,
        },
        {
          text: 'What does a 95% Bayesian Credible Interval mean?',
          options: opts(
            'If we repeated the experiment 100 times, 95 of the resulting intervals would contain the true parameter',
            'There is a 95% probability that the true parameter lies within this interval, given the prior and observed data',
            'The interval captures 95% of the observed data points',
            '95% of bootstrapped samples produced an estimate within this range'
          ),
          correctAnswer: 'b',
          explanation: 'Credible intervals have the intuitive interpretation most people wrongly assign to frequentist CIs. They directly state the probability that the true parameter is in the interval — making them far easier to communicate to stakeholders.',
          orderIndex: 2,
        },
        {
          text: 'In a Bayesian Beta-Binomial model, if the prior is Beta(1, 1) (uniform) and you observe 50 successes in 200 trials, what is the posterior?',
          options: opts(
            'Beta(50, 150)',
            'Beta(51, 151)',
            'Beta(50, 200)',
            'Beta(1 + 0.25, 1 + 0.75)'
          ),
          correctAnswer: 'b',
          explanation: 'Posterior = Beta(α + successes, β + failures) = Beta(1 + 50, 1 + 150) = Beta(51, 151). Mean of Beta(51, 151) = 51/202 = 25.2% — close to the observed 25% with slight shrinkage toward the uniform prior.',
          orderIndex: 3,
        },
        {
          text: 'How does Bayesian updating differ from fitting a model and then replacing it with new data?',
          options: opts(
            'Bayesian updating is identical to retraining — both discard prior information',
            'Bayesian updating incorporates previous observations through the prior, so new data refines rather than replaces beliefs — older data is not discarded',
            'Bayesian updating requires MCMC while model retraining uses maximum likelihood',
            'Bayesian updating only works for conjugate models; non-conjugate models must be retrained'
          ),
          correctAnswer: 'b',
          explanation: 'Each Bayesian update uses the current posterior as the prior for the next update. Yesterday\'s posterior + today\'s data = updated posterior. This is mathematically equivalent to fitting on all data at once — history is never discarded, it is encoded in the prior.',
          orderIndex: 3,
        },
        {
          text: 'What is a "weakly informative prior" and when should you use one?',
          options: opts(
            'A prior that assigns equal probability to all parameter values — used when there is truly no domain knowledge',
            'A prior that constrains the parameter to a plausible range based on domain knowledge, without being too specific — prevents physically impossible values while letting data dominate',
            'A prior derived from a small pilot dataset before the main experiment',
            'A prior that assigns 95% probability mass to the null hypothesis value'
          ),
          correctAnswer: 'b',
          explanation: 'Weakly informative priors (e.g., Beta(2,20) for a CTR you believe is around 10%) prevent the model from proposing absurd values (200% CTR) while still being flexible enough for the data to overwhelm the prior with sufficient observations.',
          orderIndex: 5,
        },
        {
          text: 'What does P(B > A) = 94% mean in a Bayesian A/B test?',
          options: opts(
            'Variant B has a 94% higher conversion rate than A',
            'The p-value is 0.06 — the null hypothesis is rejected at the 6% significance level',
            'There is a 94% probability that Variant B\'s true conversion rate exceeds Variant A\'s, given the observed data',
            'In 94% of bootstrap samples, Variant B outperformed Variant A'
          ),
          correctAnswer: 'c',
          explanation: 'P(B > A) is the posterior probability of the hypothesis that B\'s true rate exceeds A\'s. It is computed via Monte Carlo: sample from both posteriors N times, count what fraction of samples have B > A. This is directly interpretable and directly answers the decision question.',
          orderIndex: 6,
        },
        {
          text: 'What is the key advantage of Bayesian A/B testing over frequentist testing for product teams?',
          options: opts(
            'Bayesian tests always require smaller sample sizes',
            'Bayesian tests produce probability statements (P(B > A) = 92%) that are directly actionable, and support valid early stopping without inflating false positive rates',
            'Bayesian tests eliminate the need to pre-specify hypotheses before the experiment',
            'Bayesian tests automatically account for Simpson\'s paradox and segmentation effects'
          ),
          correctAnswer: 'b',
          explanation: 'Frequentist tests require fixed sample sizes and single-look analysis. Bayesian tests produce continuously updated posterior probabilities, support early stopping (when P(B>A) > 0.95), and give executives the direct answer: "How confident are we that B is better?"',
          orderIndex: 7,
        },
        {
          text: 'In the Normal-Normal conjugate model, what happens to the posterior standard deviation as sample size increases?',
          options: opts(
            'It increases because more data introduces more variability',
            'It remains constant regardless of sample size',
            'It decreases, reflecting reduced uncertainty about the true parameter value as more evidence accumulates',
            'It converges to the prior standard deviation after sufficiently many observations'
          ),
          correctAnswer: 'c',
          explanation: 'Posterior precision = prior precision + n × (1/likelihood_variance). As n increases, posterior precision grows → posterior std shrinks → the credible interval narrows. More data = less uncertainty. This is the Bayesian expression of the law of large numbers.',
          orderIndex: 8,
        },
        {
          text: 'Which interpretation is correct for a frequentist 95% confidence interval?',
          options: opts(
            'There is a 95% probability the true parameter lies within this specific interval',
            'If we repeated the study many times with the same procedure, 95% of the resulting intervals would contain the true parameter',
            'We are 95% confident that the null hypothesis is false',
            '95% of the observed data falls within this range'
          ),
          correctAnswer: 'b',
          explanation: 'A frequentist CI is a statement about the procedure, not about this specific interval. Once calculated, the true parameter either is or is not in this interval — probability is 0 or 1. Only Bayesian credible intervals can say "95% probability the parameter is in [a, b]."',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 45 — Anomaly Detection Methods
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-45-anomaly-detection',
    title:      'Anomaly Detection Methods',
    description: 'Identify fraud, system failures, and data quality issues automatically using statistical, ML-based, and time-series anomaly detection techniques.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 145,
    xpReward:   120,
    language:   'python',
    codeExample: `import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
n = 1000

# Simulate transaction data with injected fraud
transactions = pd.DataFrame({
    "amount":      np.concatenate([np.random.exponential(50, n), np.random.uniform(500, 5000, 20)]),
    "hour_of_day": np.concatenate([np.random.randint(8, 22, n), np.random.randint(2, 5, 20)]),
    "merchant_age":np.concatenate([np.random.randint(30, 3650, n), np.random.randint(1, 10, 20)]),
    "is_fraud":    np.concatenate([np.zeros(n), np.ones(20)]),
})

X = transactions[["amount","hour_of_day","merchant_age"]]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Isolation Forest ──
iso = IsolationForest(contamination=0.02, random_state=42)
transactions["iso_score"] = -iso.fit_predict(X_scaled)  # 1 = anomaly

# ── Local Outlier Factor ──
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.02)
transactions["lof_flag"] = (lof.fit_predict(X_scaled) == -1).astype(int)

# ── Evaluation ──
from sklearn.metrics import precision_score, recall_score
print("Isolation Forest:")
print(f"  Precision: {precision_score(transactions.is_fraud, transactions.iso_score):.3f}")
print(f"  Recall:    {recall_score(transactions.is_fraud, transactions.iso_score):.3f}")`,
    content: `# Anomaly Detection Methods

Anomaly detection identifies rare, unexpected observations that deviate significantly from normal patterns. Applications span fraud detection, system health monitoring, data quality checks, manufacturing defects, and network security. At Google, anomaly detection runs on billions of data points per day — catching ad fraud, system failures, and data pipeline errors automatically.

## Types of Anomalies

| Type | Description | Example |
|------|-------------|---------|
| **Point anomaly** | Single observation far from the norm | A $50,000 transaction when avg is $80 |
| **Contextual anomaly** | Normal in context, abnormal in sub-context | 30°C temperature normal in August, anomalous in January |
| **Collective anomaly** | Sequence of points that together are anomalous | 1,000 transactions from one account in 5 minutes |

## Statistical Methods

### Z-Score

\`\`\`python
import numpy as np
import pandas as pd
from scipy import stats

np.random.seed(42)

# Simulate daily revenue with anomalies
daily_revenue = pd.DataFrame({
    "date":    pd.date_range("2024-01-01", periods=180),
    "revenue": np.concatenate([
        np.random.normal(50000, 5000, 170),
        np.random.choice([8000, 95000, 2000, 120000], 10),  # anomalies
    ]),
})

daily_revenue["z_score"] = stats.zscore(daily_revenue["revenue"])
daily_revenue["is_anomaly_z"] = daily_revenue["z_score"].abs() > 3

print(f"Z-score anomalies detected: {daily_revenue['is_anomaly_z'].sum()}")
print(daily_revenue[daily_revenue["is_anomaly_z"]][["date","revenue","z_score"]])
\`\`\`

### IQR (Interquartile Range)

\`\`\`python
Q1 = daily_revenue["revenue"].quantile(0.25)
Q3 = daily_revenue["revenue"].quantile(0.75)
IQR = Q3 - Q1

lower_fence = Q1 - 1.5 * IQR
upper_fence = Q3 + 1.5 * IQR

daily_revenue["is_anomaly_iqr"] = (
    (daily_revenue["revenue"] < lower_fence) |
    (daily_revenue["revenue"] > upper_fence)
)

print(f"IQR method lower fence: {lower_fence:,.0f}")
print(f"IQR method upper fence: {upper_fence:,.0f}")
print(f"IQR anomalies detected: {daily_revenue['is_anomaly_iqr'].sum()}")
\`\`\`

## Machine Learning Methods

### Isolation Forest

Isolation Forest isolates anomalies by randomly partitioning the feature space. Anomalies are isolated with fewer splits (shorter path length = more anomalous).

\`\`\`python
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Multi-feature transaction anomaly detection
np.random.seed(42)
n = 2000

# Normal transactions
normal = pd.DataFrame({
    "amount":       np.random.exponential(50, n),
    "hour_of_day":  np.random.randint(8, 22, n),
    "merchant_age": np.random.randint(30, 3650, n),
    "tx_per_hour":  np.random.randint(1, 10, n),
})

# Fraudulent transactions (20 injected)
fraud = pd.DataFrame({
    "amount":       np.random.uniform(800, 5000, 20),
    "hour_of_day":  np.random.randint(1, 4, 20),
    "merchant_age": np.random.randint(1, 7, 20),
    "tx_per_hour":  np.random.randint(20, 50, 20),
})

df = pd.concat([normal.assign(is_fraud=0), fraud.assign(is_fraud=1)], ignore_index=True)

features = ["amount","hour_of_day","merchant_age","tx_per_hour"]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[features])

# Fit Isolation Forest
iso = IsolationForest(
    n_estimators=200,
    contamination=0.01,   # expected fraction of anomalies
    random_state=42,
)
df["iso_pred"] = iso.fit_predict(X_scaled)
df["anomaly"]  = (df["iso_pred"] == -1).astype(int)
df["iso_score"] = iso.decision_function(X_scaled)  # more negative = more anomalous

from sklearn.metrics import classification_report
print("Isolation Forest Performance:")
print(classification_report(df["is_fraud"], df["anomaly"], target_names=["Normal","Fraud"]))
\`\`\`

### Local Outlier Factor (LOF)

LOF compares each point's density to its neighbors'. Points in low-density regions surrounded by high-density neighbors are anomalies.

\`\`\`python
from sklearn.neighbors import LocalOutlierFactor

lof = LocalOutlierFactor(n_neighbors=20, contamination=0.01)
df["lof_pred"]  = lof.fit_predict(X_scaled)
df["lof_anomaly"] = (df["lof_pred"] == -1).astype(int)

print("LOF Performance:")
print(classification_report(df["is_fraud"], df["lof_anomaly"], target_names=["Normal","Fraud"]))
\`\`\`

## Time-Series Anomaly Detection

\`\`\`python
# Rolling statistics: flag points > N standard deviations from rolling mean
def rolling_zscore_anomaly(series, window=7, threshold=3.0):
    rolling_mean = series.rolling(window=window, center=True).mean()
    rolling_std  = series.rolling(window=window, center=True).std()
    z_scores     = (series - rolling_mean) / rolling_std
    return z_scores.abs() > threshold, z_scores

daily_revenue["rolling_anomaly"], daily_revenue["rolling_z"] = rolling_zscore_anomaly(
    daily_revenue["revenue"], window=14, threshold=2.5
)

# Visualize
fig, ax = plt.subplots(figsize=(14, 5))
ax.plot(daily_revenue["date"], daily_revenue["revenue"], color="steelblue", linewidth=1.5, label="Revenue")
anomalies = daily_revenue[daily_revenue["rolling_anomaly"]]
ax.scatter(anomalies["date"], anomalies["revenue"], color="red", s=80, zorder=5, label="Anomaly")
ax.set_title("Daily Revenue — Rolling Z-Score Anomaly Detection")
ax.set_xlabel("Date")
ax.set_ylabel("Revenue")
ax.legend()
ax.spines[["top","right"]].set_visible(False)
plt.tight_layout()
plt.show()
\`\`\`

## Practical Anomaly Detection Pipeline

\`\`\`python
# Production anomaly scoring: combine multiple detectors for robustness
def combined_anomaly_score(X_scaled, contamination=0.02):
    """Ensemble anomaly score: average of normalized scores from multiple detectors."""

    # Isolation Forest score (lower = more anomalous)
    iso = IsolationForest(contamination=contamination, random_state=42, n_estimators=200)
    iso_scores = iso.fit_predict(X_scaled)
    iso_flag = (iso_scores == -1).astype(float)

    # LOF (lower predict = anomaly)
    lof = LocalOutlierFactor(contamination=contamination)
    lof_flag = (lof.fit_predict(X_scaled) == -1).astype(float)

    # Z-score (per feature, take max across features)
    z_scores = np.abs(stats.zscore(X_scaled, axis=0))
    z_flag = (z_scores.max(axis=1) > 3).astype(float)

    # Ensemble: vote from 3 detectors
    ensemble_score = (iso_flag + lof_flag + z_flag) / 3
    return ensemble_score

df["ensemble_score"] = combined_anomaly_score(X_scaled)
df["high_risk"] = df["ensemble_score"] >= 0.67  # at least 2/3 detectors flag it

print(f"High-risk (2+ detectors agree): {df['high_risk'].sum()} transactions")
print(f"Precision on fraud: {(df[df.high_risk]['is_fraud'].sum() / df['high_risk'].sum()):.2f}")
\`\`\`

## Choosing the Right Method

| Method | Data type | Scale | Strengths |
|--------|----------|-------|-----------|
| **Z-score** | Univariate, normal | Any | Simple, fast, interpretable |
| **IQR** | Univariate, any distribution | Any | Robust to non-normal data |
| **Isolation Forest** | Multivariate | Large | Fast, effective for high-dimensional data |
| **LOF** | Multivariate | Medium | Detects local anomalies in dense regions |
| **Rolling Z-score** | Time series | Any | Detects temporal anomalies |
| **DBSCAN noise** | Multivariate | Medium | No contamination parameter needed |

## Key Takeaways

- **Z-score > 3 or IQR fences** are the fastest first checks — always start here
- **Isolation Forest** is the production workhorse for high-dimensional fraud detection
- **LOF** excels when anomalies are contextual — points that are locally unusual
- **Rolling z-score** is the standard for time-series monitoring (pipeline failures, KPI drops)
- **Ensemble multiple detectors** — requiring 2/3 agreement dramatically reduces false positives
- **Set contamination** based on your actual expected anomaly rate, not the default
- **High false positive rates kill adoption** — tune threshold for your team's capacity to investigate`,
    quiz: {
      title: 'Anomaly Detection Methods Quiz',
      questions: [
        {
          text: 'What does a Z-score of -4.2 indicate about a data point?',
          options: opts(
            'The data point is 4.2 times larger than the mean',
            'The data point is 4.2 standard deviations below the mean — a statistically extreme low outlier',
            'The data point falls in the bottom 4.2% of all values',
            'The data point is missing 4.2% of expected features'
          ),
          correctAnswer: 'b',
          explanation: 'Z-score = (x - mean) / std. A Z-score of -4.2 means the point is 4.2 standard deviations below the mean. In a normal distribution, only ~0.001% of data falls beyond |z|=4.2 — extremely unusual and worth investigating.',
          orderIndex: 0,
        },
        {
          text: 'What is the Isolation Forest\'s core intuition for detecting anomalies?',
          options: opts(
            'Anomalies have lower density than normal points in their local neighborhood',
            'Anomalies are isolated by fewer random recursive partitions (shorter average path length) because they are rare and occupy sparse regions',
            'Anomalies are identified by comparing each point\'s distance to K nearest neighbors',
            'Anomalies are isolated using a boundary learned from labeled fraud examples'
          ),
          correctAnswer: 'b',
          explanation: 'Isolation Forest builds random decision trees that recursively partition the feature space. Anomalies, being rare and in sparse regions, require fewer splits to isolate. Average path length across all trees is the anomaly score — shorter paths = more anomalous.',
          orderIndex: 1,
        },
        {
          text: 'What does the `contamination` parameter in Isolation Forest control?',
          options: opts(
            'The maximum number of random trees to build in the forest',
            'The fraction of observations expected to be anomalies — sets the threshold for anomaly labeling',
            'The minimum number of samples required to split a node in each tree',
            'The amount of random noise added to features before training'
          ),
          correctAnswer: 'b',
          explanation: '`contamination` tells Isolation Forest what fraction of the data you expect to be anomalous. It is used to set the decision threshold on the anomaly score. If you expect 2% fraud, set contamination=0.02.',
          orderIndex: 2,
        },
        {
          text: 'What is a "contextual anomaly" and give an example?',
          options: opts(
            'An anomaly detected only by ML context-aware models, not by statistical methods',
            'A data point that is normal in the overall distribution but anomalous given its specific context (time, location, category)',
            'An anomaly caused by incorrect data entry in a specific application context',
            'A sequence of normal-looking transactions that collectively form an anomalous pattern'
          ),
          correctAnswer: 'b',
          explanation: 'A contextual anomaly is normal globally but abnormal in context. Example: a $100 transaction is normal overall, but a $100 transaction at 3 AM from a new merchant with a brand-new card is anomalous in context. Z-score misses this; LOF and density methods can detect it.',
          orderIndex: 3,
        },
        {
          text: 'How does Local Outlier Factor (LOF) differ from Isolation Forest?',
          options: opts(
            'LOF uses supervised learning while Isolation Forest is unsupervised',
            'LOF measures each point\'s density relative to its neighbors — points in low-density neighborhoods surrounded by high-density regions are anomalous',
            'LOF is faster and scales better to millions of data points',
            'LOF uses distance to cluster centroids while Isolation Forest uses path length in decision trees'
          ),
          correctAnswer: 'b',
          explanation: 'LOF computes a local density for each point based on its k-nearest neighbors, then compares it to neighbors\' densities. A point much less dense than its neighbors gets a high LOF score (anomaly). This detects local anomalies in datasets with varying density regions.',
          orderIndex: 4,
        },
        {
          text: 'What is the IQR upper fence formula for detecting outliers?',
          options: opts(
            'Q3 + 1.5 × IQR',
            'Q3 + 3.0 × std',
            'Q3 + 2.0 × IQR',
            'mean + 1.5 × Q3'
          ),
          correctAnswer: 'a',
          explanation: 'IQR = Q3 - Q1. Upper fence = Q3 + 1.5 × IQR. Lower fence = Q1 - 1.5 × IQR. Tukey\'s "inner fence" at 1.5×IQR is standard; the "outer fence" at 3×IQR catches extreme outliers. IQR is robust to outliers themselves, unlike std-based methods.',
          orderIndex: 5,
        },
        {
          text: 'Why is ensemble anomaly detection (requiring 2+ detectors to agree) preferred in production?',
          options: opts(
            'Ensemble methods are always faster than individual detectors',
            'No single detector is perfect — each has different false positive patterns. Requiring agreement dramatically reduces false positives at a small cost to recall',
            'Ensemble methods produce anomaly scores between 0 and 1 while individual detectors produce binary labels',
            'Regulatory compliance requires multiple independent detection methods for financial fraud systems'
          ),
          correctAnswer: 'b',
          explanation: 'Each detector has different failure modes. Isolation Forest may flag dense-region outliers LOF catches; Z-score may miss multivariate anomalies both ML methods catch. Requiring 2/3 agreement means only points that multiple independent methods agree are anomalous get flagged — far fewer false positives.',
          orderIndex: 6,
        },
        {
          text: 'What is rolling Z-score anomaly detection particularly useful for?',
          options: opts(
            'Detecting anomalies in categorical variables like country or product category',
            'Detecting temporal anomalies in time-series data by comparing each point to the recent local distribution rather than the global distribution',
            'Detecting anomalies in high-dimensional feature spaces with 50+ features',
            'Detecting anomalies caused by data entry errors in database systems'
          ),
          correctAnswer: 'b',
          explanation: 'Rolling Z-score computes mean and std over a sliding window. This adapts to trends and seasonality — a revenue dip anomalous vs. last month\'s local norm, not vs. all-time average. Critical for monitoring KPIs that have natural trends and seasonal patterns.',
          orderIndex: 7,
        },
        {
          text: 'A company monitors 1000 daily metrics. Using Z-score with threshold |z| > 3, how many false positives would you expect each day purely by chance?',
          options: opts('0', '1', '2-3', '10+'),
          correctAnswer: 'c',
          explanation: 'Under a normal distribution, ~0.27% of values exceed |z|=3 by chance. With 1000 metrics, you expect 1000 × 0.0027 ≈ 2-3 false positive alerts per day even with no true anomalies. This is the multiple comparisons problem for monitoring — use higher thresholds or FDR correction.',
          orderIndex: 8,
        },
        {
          text: 'Which anomaly type does DBSCAN\'s "noise" label (-1) best identify?',
          options: opts(
            'Time-series anomalies in sequential data',
            'Contextual anomalies that are normal globally but anomalous in their local context',
            'Points that are not within eps distance of any dense cluster core — isolated low-density outliers',
            'Collective anomalies where a sequence of individually normal points form an anomalous pattern'
          ),
          correctAnswer: 'c',
          explanation: 'DBSCAN\'s -1 labels points that are not reachable from any core point (a point with min_samples neighbors within eps). These are isolated points in sparse regions — classic point anomalies. DBSCAN naturally produces anomaly detection as a byproduct of clustering.',
          orderIndex: 9,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 9 (Chapters 141–145 — Advanced ML & Statistics)…');

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

  console.log('\n🎉  AMATEUR Block 9 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
