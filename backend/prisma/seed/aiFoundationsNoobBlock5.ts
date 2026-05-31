/**
 * aiFoundationsNoobBlock5.ts — NOOB Block 5 (Ch 21–25): Calculus & Optimization
 * Run: cd backend && npm run seed:af-noob-b5
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function q(text:string,options:{id:string;text:string}[],correctAnswer:string,explanation:string,orderIndex:number){return{text,options:JSON.stringify(options),correctAnswer,explanation,orderIndex};}
const COURSE_SLUG='foundations';

const CHAPTERS=[
  {slug:'af-noob-21-derivatives',title:'Derivatives & Differentiation Rules',description:'Limits, derivatives, and the differentiation rules that power gradient-based learning — power rule, product rule, chain rule basics.',orderIndex:21,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 21 — Derivatives & Differentiation Rules

## What is a Derivative?

A derivative measures the **instantaneous rate of change** of a function at a point. It answers: *"How much does the output change if I slightly nudge the input?"*

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

In AI, the derivative of the **loss function** with respect to **model weights** tells us which direction to move the weights to reduce loss.

## Differentiation Rules

| Rule | Formula | Example |
|------|---------|---------|
| Power | d/dx[xⁿ] = nxⁿ⁻¹ | d/dx[x³] = 3x² |
| Constant | d/dx[c] = 0 | d/dx[5] = 0 |
| Sum | d/dx[f+g] = f'+g' | d/dx[x²+x] = 2x+1 |
| Product | d/dx[fg] = f'g+fg' | d/dx[x·sin(x)] |
| Chain | d/dx[f(g(x))] = f'(g(x))·g'(x) | d/dx[sin(x²)] = cos(x²)·2x |

## Common AI Activation Derivatives

\`\`\`python
# ReLU: f(x) = max(0, x) → f'(x) = 1 if x>0, else 0
# Sigmoid: f(x) = 1/(1+e^-x) → f'(x) = f(x)·(1-f(x))
# tanh: f'(x) = 1 - tanh²(x)
\`\`\`

## Numerical Differentiation

When analytical derivatives are hard, we approximate:

$$f'(x) \\approx \\frac{f(x+h) - f(x-h)}{2h}$$

This is used to **check gradients** during neural network debugging (gradient checking).`,
  codeExample:`import numpy as np
import matplotlib
matplotlib.use('Agg')

# === Analytical derivative ===
# f(x) = x^3 - 3x^2 + 2  →  f'(x) = 3x^2 - 6x
def f(x):    return x**3 - 3*x**2 + 2
def f_prime(x): return 3*x**2 - 6*x

x_vals = np.linspace(-1, 4, 7)
print("=== Derivatives of f(x) = x³ - 3x² + 2 ===")
for x in x_vals:
    print(f"  f'({x:.1f}) = {f_prime(x):.3f}")

# === Numerical derivative check ===
def numerical_diff(func, x, h=1e-5):
    return (func(x+h) - func(x-h)) / (2*h)

print("\n=== Numerical vs Analytical ===")
for x in [0.0, 1.0, 2.0, 3.0]:
    analytical = f_prime(x)
    numerical  = numerical_diff(f, x)
    print(f"  x={x}: analytical={analytical:.5f}  numerical={numerical:.5f}")

# === Activation function derivatives ===
def sigmoid(x):      return 1 / (1 + np.exp(-x))
def sigmoid_prime(x): return sigmoid(x) * (1 - sigmoid(x))
def relu_prime(x):   return np.where(x > 0, 1.0, 0.0)

print("\n=== Activation Derivatives ===")
for x in [-2, -1, 0, 1, 2]:
    print(f"  x={x:2d} | sigmoid'={sigmoid_prime(x):.4f} | ReLU'={relu_prime(x):.1f}")`,
  questions:[
    q('What does a derivative f\'(x) represent?',[{id:'a',text:'The area under the curve'},{id:'b',text:'The instantaneous rate of change at x'},{id:'c',text:'The global minimum of f'},{id:'d',text:'The cumulative sum of f'}],'b','The derivative measures how much f(x) changes per unit change in x at a specific point.',0),
    q('What is d/dx[x⁴]?',[{id:'a',text:'4x³'},{id:'b',text:'x³'},{id:'c',text:'4x⁵'},{id:'d',text:'4'}],'a','Power rule: d/dx[xⁿ] = nxⁿ⁻¹ → d/dx[x⁴] = 4x³.',1),
    q('What is the derivative of a constant c?',[{id:'a',text:'c'},{id:'b',text:'1'},{id:'c',text:'0'},{id:'d',text:'∞'}],'c','Constants do not change — their derivative is 0.',2),
    q('The sigmoid derivative σ\'(x) equals:',[{id:'a',text:'σ(x)'},{id:'b',text:'1 - σ(x)'},{id:'c',text:'σ(x)·(1 - σ(x))'},{id:'d',text:'σ(x)²'}],'c','σ\'(x) = σ(x)·(1-σ(x)) — a convenient form that reuses the forward-pass value.',3),
    q('What is the ReLU derivative for x > 0?',[{id:'a',text:'0'},{id:'b',text:'1'},{id:'c',text:'x'},{id:'d',text:'e^x'}],'b','ReLU = max(0,x) → derivative is 1 for x>0, 0 for x<0 (undefined exactly at 0).',4),
    q('Why do we compute derivatives of the loss in neural networks?',[{id:'a',text:'To measure accuracy'},{id:'b',text:'To know which direction to adjust weights to reduce loss'},{id:'c',text:'To initialise weights'},{id:'d',text:'To normalise inputs'}],'b','The gradient of the loss w.r.t. weights tells us which direction increases loss — we go opposite to decrease it.',5),
    q('The chain rule d/dx[f(g(x))] = ?',[{id:'a',text:'f\'(x)·g\'(x)'},{id:'b',text:'f\'(g(x))·g\'(x)'},{id:'c',text:'f(g\'(x))'},{id:'d',text:'f\'(g(x)) + g\'(x)'}],'b','Chain rule: differentiate the outer function evaluated at the inner, times the derivative of the inner.',6),
    q('Numerical gradient checking uses:',[{id:'a',text:'Automatic differentiation'},{id:'b',text:'The finite difference approximation [f(x+h)-f(x-h)]/(2h)'},{id:'c',text:'Symbolic algebra'},{id:'d',text:'Monte Carlo sampling'}],'b','Finite differences numerically approximate the gradient — used to verify analytical/automatic gradients.',7),
    q('Which of these is a use of derivatives in AI?',[{id:'a',text:'Encoding text as tokens'},{id:'b',text:'Backpropagation — computing gradients layer by layer'},{id:'c',text:'Loading dataset batches'},{id:'d',text:'Evaluating model accuracy'}],'b','Backpropagation applies the chain rule repeatedly to compute gradients for all network parameters.',8),
    q('d/dx[sin(x²)] equals:',[{id:'a',text:'cos(x²)'},{id:'b',text:'2x·cos(x)'},{id:'c',text:'2x·cos(x²)'},{id:'d',text:'sin(2x)'}],'c','Chain rule: outer = sin → cos(x²), inner = x² → 2x. Result: 2x·cos(x²).',9),
  ]},

  {slug:'af-noob-22-partial-derivatives',title:'Partial Derivatives & Gradients',description:'Extending derivatives to multi-variable functions — gradient vectors, directional derivatives, and how they guide weight updates in neural networks.',orderIndex:22,xpReward:70,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 22 — Partial Derivatives & Gradients

## Multi-Variable Functions

Most AI loss functions depend on **thousands of parameters**. Partial derivatives generalise differentiation to functions of many variables.

$$\\frac{\\partial f}{\\partial x} = \\text{"how does f change when only x changes, holding others fixed?"}$$

## Gradient Vector

The **gradient** ∇f is a vector of all partial derivatives:

$$\\nabla f(x_1, x_2, ..., x_n) = \\left[\\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, ..., \\frac{\\partial f}{\\partial x_n}\\right]$$

### Properties
- Points in the direction of **steepest increase**
- Moving **opposite** the gradient decreases f (gradient descent!)
- Gradient = 0 at local minima, maxima, and saddle points

## Example: MSE Loss

For MSE loss L = (ŷ - y)²:

$$\\frac{\\partial L}{\\partial w} = 2(\\hat{y} - y) \\cdot x$$

This gradient tells us how to update weight w to reduce the loss.

## Jacobian & Hessian

| Matrix | What it is | Shape |
|--------|-----------|-------|
| Jacobian J | All partial derivatives of a vector function | (m×n) |
| Hessian H | Second-order partials (curvature) | (n×n) |`,
  codeExample:`import numpy as np

# === Partial derivatives example ===
# f(x,y) = x^2 + 3*x*y + y^2
# ∂f/∂x = 2x + 3y
# ∂f/∂y = 3x + 2y

def f(x, y):    return x**2 + 3*x*y + y**2
def df_dx(x,y): return 2*x + 3*y
def df_dy(x,y): return 3*x + 2*y

print("=== Partial Derivatives of f(x,y) = x²+3xy+y² ===")
for (x,y) in [(1,2),(3,-1),(0,5)]:
    grad = np.array([df_dx(x,y), df_dy(x,y)])
    print(f"  (x,y)=({x},{y}) | ∂f/∂x={grad[0]} | ∂f/∂y={grad[1]} | ∇f={grad}")

# === Numerical gradient ===
def numerical_gradient(func, params, h=1e-5):
    grad = np.zeros_like(params, dtype=float)
    for i in range(len(params)):
        p_plus  = params.copy(); p_plus[i]  += h
        p_minus = params.copy(); p_minus[i] -= h
        grad[i] = (func(*p_plus) - func(*p_minus)) / (2*h)
    return grad

point = np.array([1.0, 2.0])
num_grad = numerical_gradient(f, point)
print(f"\nNumerical gradient at (1,2): {num_grad}")
print(f"Analytical gradient at (1,2): {[df_dx(1,2), df_dy(1,2)]}")

# === MSE gradient for linear regression ===
print("\n=== MSE Gradient for Linear Regression ===")
np.random.seed(42)
X = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y_true = 2.0 * X + 1.0
w, b = 0.5, 0.0  # initial weights

for step in range(5):
    y_pred = w * X + b
    loss = np.mean((y_pred - y_true)**2)
    dw = 2 * np.mean((y_pred - y_true) * X)
    db = 2 * np.mean(y_pred - y_true)
    print(f"  step {step}: loss={loss:.4f} | ∂L/∂w={dw:.3f} | ∂L/∂b={db:.3f}")
    w -= 0.05 * dw
    b -= 0.05 * db`,
  questions:[
    q('What does ∂f/∂x mean?',[{id:'a',text:'The total derivative of f'},{id:'b',text:'The partial derivative — rate of change of f with respect to x, holding others fixed'},{id:'c',text:'The integral of f'},{id:'d',text:'The second derivative of f'}],'b','Partial derivative ∂f/∂x treats all variables except x as constants.',0),
    q('The gradient vector ∇f points toward:',[{id:'a',text:'The global minimum'},{id:'b',text:'The direction of steepest decrease'},{id:'c',text:'The direction of steepest increase'},{id:'d',text:'A saddle point'}],'c','The gradient always points in the direction of steepest ascent of the function.',1),
    q('For gradient descent we move:',[{id:'a',text:'In the direction of ∇f'},{id:'b',text:'Opposite to ∇f'},{id:'c',text:'Perpendicular to ∇f'},{id:'d',text:'Randomly'}],'b','Gradient descent subtracts the gradient: w ← w - α·∇f, moving toward lower loss.',2),
    q('For f(x,y) = x² + y², what is ∂f/∂y?',[{id:'a',text:'2x'},{id:'b',text:'2y'},{id:'c',text:'2x + 2y'},{id:'d',text:'x² + 2y'}],'b','Hold x constant → ∂(x²+y²)/∂y = 2y.',3),
    q('At a local minimum, the gradient is:',[{id:'a',text:'Maximum'},{id:'b',text:'Equal to the learning rate'},{id:'c',text:'Zero'},{id:'d',text:'Undefined'}],'c','At any local minimum (or maximum or saddle point), ∇f = 0.',4),
    q('The Jacobian matrix contains:',[{id:'a',text:'Second-order partial derivatives'},{id:'b',text:'All first-order partial derivatives of a vector-valued function'},{id:'c',text:'The inverse Hessian'},{id:'d',text:'Activation function values'}],'b','The Jacobian generalises the gradient to vector-valued functions (m outputs, n inputs → m×n matrix).',5),
    q('Why do neural networks need gradients w.r.t. every weight?',[{id:'a',text:'To count parameters'},{id:'b',text:'To update each weight independently in the direction that reduces loss'},{id:'c',text:'To initialise the network'},{id:'d',text:'To normalise outputs'}],'b','Each weight has its own gradient telling how much and which direction it should change.',6),
    q('Numerical gradient approximation requires:',[{id:'a',text:'Symbolic math'},{id:'b',text:'One forward pass'},{id:'c',text:'Two forward passes per parameter (f(x+h) and f(x-h))'},{id:'d',text:'No computation'}],'c','The finite difference formula [f(x+h)-f(x-h)]/(2h) needs two evaluations per parameter.',7),
    q('What is the Hessian matrix?',[{id:'a',text:'First-order partial derivatives'},{id:'b',text:'Matrix of second-order partial derivatives — encodes curvature'},{id:'c',text:'The transpose of the Jacobian'},{id:'d',text:'The loss function value'}],'b','The Hessian Hᵢⱼ = ∂²f/∂xᵢ∂xⱼ captures the curvature of the loss landscape.',8),
    q('For MSE loss L=(ŷ-y)², the gradient ∂L/∂w where ŷ=wx is:',[{id:'a',text:'2(ŷ-y)'},{id:'b',text:'2(ŷ-y)·x'},{id:'c',text:'(ŷ-y)·x'},{id:'d',text:'2x'}],'b','Chain rule: ∂L/∂w = ∂L/∂ŷ · ∂ŷ/∂w = 2(ŷ-y)·x.',9),
  ]},

  {slug:'af-noob-23-gradient-descent',title:'Gradient Descent Theory',description:'The core optimisation algorithm of deep learning — vanilla GD, stochastic GD, mini-batch GD, learning rate intuition, and convergence.',orderIndex:23,xpReward:75,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 23 — Gradient Descent Theory

## The Core Idea

Gradient descent iteratively moves parameters toward lower loss:

$$\\theta \\leftarrow \\theta - \\alpha \\nabla_\\theta L(\\theta)$$

- **θ** = parameters (weights)
- **α** = learning rate (step size)
- **∇L** = gradient of loss w.r.t. parameters

## Variants

| Variant | Data per step | Speed | Noise |
|---------|-------------|-------|-------|
| Batch GD | Full dataset | Slow | Low |
| Stochastic GD (SGD) | 1 sample | Fast | High |
| Mini-batch GD | 32–256 samples | Balanced | Medium |

Mini-batch GD is the standard in deep learning.

## Learning Rate Effects

| α too small | α too large |
|------------|------------|
| Slow convergence | Oscillates / diverges |
| Accurate direction | May overshoot minimum |

Typical starting values: 0.001–0.01.

## Loss Landscape Challenges

- **Local minima** — gradient = 0 but not global min
- **Saddle points** — gradient = 0, not a minimum
- **Plateaus** — near-zero gradient, slow progress
- **Ravines** — steep in one direction, flat in another

Modern optimisers (Adam, RMSProp) mitigate these.`,
  codeExample:`import numpy as np

np.random.seed(42)
# True relationship: y = 3x + 2
X = np.random.randn(100)
y = 3*X + 2 + 0.5*np.random.randn(100)

# === Batch Gradient Descent ===
def batch_gd(X, y, lr=0.01, epochs=50):
    w, b = 0.0, 0.0
    history = []
    for epoch in range(epochs):
        y_pred = w*X + b
        loss = np.mean((y_pred - y)**2)
        dw = 2*np.mean((y_pred - y)*X)
        db = 2*np.mean(y_pred - y)
        w -= lr*dw
        b -= lr*db
        if epoch % 10 == 0:
            history.append((epoch, loss, w, b))
    return w, b, history

# === Mini-batch GD ===
def minibatch_gd(X, y, lr=0.01, epochs=50, batch_size=16):
    w, b = 0.0, 0.0
    n = len(X)
    for epoch in range(epochs):
        idx = np.random.permutation(n)
        X_s, y_s = X[idx], y[idx]
        for start in range(0, n, batch_size):
            Xb = X_s[start:start+batch_size]
            yb = y_s[start:start+batch_size]
            y_pred = w*Xb + b
            dw = 2*np.mean((y_pred - yb)*Xb)
            db = 2*np.mean(y_pred - yb)
            w -= lr*dw; b -= lr*db
    return w, b

print("=== Batch Gradient Descent ===")
w_b, b_b, hist = batch_gd(X, y)
for ep, loss, w, b_val in hist:
    print(f"  epoch {ep:2d}: loss={loss:.4f}  w={w:.3f}  b={b_val:.3f}")

print(f"\nFinal (Batch GD):    w={w_b:.4f}, b={b_b:.4f}  (true: w=3, b=2)")

w_m, b_m = minibatch_gd(X, y)
print(f"Final (Mini-batch):  w={w_m:.4f}, b={b_m:.4f}")

# === Learning rate comparison ===
print("\n=== Learning Rate Effect (50 epochs) ===")
for lr in [0.001, 0.01, 0.1, 0.5]:
    w_t, b_t, _ = batch_gd(X, y, lr=lr, epochs=50)
    final_loss = np.mean((w_t*X + b_t - y)**2)
    print(f"  lr={lr:.3f}: final_loss={final_loss:.4f}  w={w_t:.3f}")`,
  questions:[
    q('The gradient descent update rule is:',[{id:'a',text:'θ ← θ + α·∇L'},{id:'b',text:'θ ← θ - α·∇L'},{id:'c',text:'θ ← θ / α·∇L'},{id:'d',text:'θ ← α·∇L'}],'b','We subtract the gradient (scaled by α) to move toward lower loss.',0),
    q('What does the learning rate α control?',[{id:'a',text:'The number of training epochs'},{id:'b',text:'The batch size'},{id:'c',text:'The step size in the direction of the negative gradient'},{id:'d',text:'The model architecture'}],'c','Learning rate scales the gradient step — too large diverges, too small is slow.',1),
    q('Mini-batch gradient descent uses:',[{id:'a',text:'The full dataset per step'},{id:'b',text:'One sample per step'},{id:'c',text:'A small random subset (e.g., 32–256 samples) per step'},{id:'d',text:'Random weights'}],'c','Mini-batch GD balances the accuracy of batch GD and speed of SGD.',2),
    q('What is a saddle point?',[{id:'a',text:'A point where the gradient is maximum'},{id:'b',text:'A point where gradient=0 but it is neither a minimum nor maximum'},{id:'c',text:'The global minimum'},{id:'d',text:'A point on a plateau'}],'b','Saddle points have zero gradient but are only local min in some directions and max in others.',3),
    q('If the learning rate is too large:',[{id:'a',text:'The model trains too slowly'},{id:'b',text:'The model converges to a better minimum'},{id:'c',text:'The loss may oscillate or diverge'},{id:'d',text:'Gradients become zero'}],'c','Large learning rate causes overshooting — the optimizer jumps past the minimum repeatedly.',4),
    q('Stochastic gradient descent (SGD) uses:',[{id:'a',text:'The full dataset'},{id:'b',text:'One randomly chosen sample per update'},{id:'c',text:'16–256 samples'},{id:'d',text:'Validation data'}],'b','SGD updates weights after every single example — noisy but fast per step.',5),
    q('Which GD variant is most commonly used in deep learning?',[{id:'a',text:'Batch GD'},{id:'b',text:'Stochastic GD'},{id:'c',text:'Mini-batch GD'},{id:'d',text:'Coordinate descent'}],'c','Mini-batch GD (often called just SGD in frameworks) is the standard — balances speed and stability.',6),
    q('At a local minimum:',[{id:'a',text:'Loss is globally lowest'},{id:'b',text:'Gradient is zero'},{id:'c',text:'Learning rate must increase'},{id:'d',text:'Weights are reset'}],'b','At any critical point (local min, max, saddle), ∇L = 0, so gradient descent stops.',7),
    q('What is one epoch in training?',[{id:'a',text:'One weight update'},{id:'b',text:'One pass through the entire training dataset'},{id:'c',text:'One batch'},{id:'d',text:'One forward pass'}],'b','An epoch = one complete pass through all training data (many mini-batch steps).',8),
    q('Why does mini-batch GD often escape local minima better than batch GD?',[{id:'a',text:'It uses more data'},{id:'b',text:'The noise from random batches can kick the optimizer out of shallow local minima'},{id:'c',text:'It has a higher learning rate'},{id:'d',text:'It uses second-order information'}],'b','The stochastic noise in mini-batch updates acts as implicit regularization and helps escape local minima.',9),
  ]},

  {slug:'af-noob-24-chain-rule',title:'Chain Rule & Backpropagation Intuition',description:'How the chain rule chains gradients through computation graphs — the mathematical foundation of backpropagation in neural networks.',orderIndex:24,xpReward:75,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 24 — Chain Rule & Backpropagation Intuition

## The Chain Rule (Refresher)

For composed functions f(g(x)):

$$\\frac{df}{dx} = \\frac{df}{dg} \\cdot \\frac{dg}{dx}$$

For a chain of functions: a → b → c → L:

$$\\frac{dL}{da} = \\frac{dL}{dc} \\cdot \\frac{dc}{db} \\cdot \\frac{db}{da}$$

## Computation Graphs

Neural networks are **computation graphs** — DAGs where each node is an operation. Backprop traverses this graph in reverse to compute all gradients.

\`\`\`
Forward:  x → [Linear: z=wx+b] → [ReLU: a=max(0,z)] → [Loss: L=(a-y)²]
Backward: dL/dw ← dL/da · da/dz · dz/dw
\`\`\`

## Manual Backprop Example

For a single neuron: z = w·x + b, a = ReLU(z), L = (a - y)²:

| Quantity | Formula |
|---------|---------|
| dL/da | 2(a - y) |
| da/dz | 1 if z>0 else 0 |
| dz/dw | x |
| **dL/dw** | **2(a-y) · [z>0] · x** |

## Why It Matters

Backprop makes training neural networks with millions of parameters **computationally feasible**. Without it, we'd need expensive numerical differentiation (2 forward passes per parameter).`,
  codeExample:`import numpy as np

# === Manual backprop for 2-layer network ===
np.random.seed(0)

# Tiny dataset
X = np.array([[0.5, 1.2], [1.0, -0.5], [-0.3, 0.8]])
y = np.array([[1.0], [0.0], [1.0]])

# Layer sizes
n_in, n_hid, n_out = 2, 3, 1

# Weights
W1 = np.random.randn(n_in, n_hid) * 0.1
b1 = np.zeros((1, n_hid))
W2 = np.random.randn(n_hid, n_out) * 0.1
b2 = np.zeros((1, n_out))

def relu(z):        return np.maximum(0, z)
def relu_prime(z):  return (z > 0).astype(float)
def sigmoid(z):     return 1 / (1 + np.exp(-z))

print("=== Manual Backpropagation ===")
lr = 0.1

for step in range(6):
    # --- Forward pass ---
    Z1 = X @ W1 + b1          # (3,3)
    A1 = relu(Z1)              # (3,3)
    Z2 = A1 @ W2 + b2          # (3,1)
    A2 = sigmoid(Z2)           # (3,1) — output

    loss = np.mean((A2 - y)**2)

    # --- Backward pass (chain rule) ---
    dL_dA2 = 2 * (A2 - y) / len(y)                    # ∂L/∂A2
    dL_dZ2 = dL_dA2 * A2 * (1 - A2)                   # ∂L/∂Z2 (sigmoid')
    dL_dW2 = A1.T @ dL_dZ2                             # ∂L/∂W2
    dL_db2 = dL_dZ2.sum(axis=0, keepdims=True)

    dL_dA1 = dL_dZ2 @ W2.T                             # ∂L/∂A1
    dL_dZ1 = dL_dA1 * relu_prime(Z1)                  # ∂L/∂Z1 (ReLU')
    dL_dW1 = X.T @ dL_dZ1                              # ∂L/∂W1
    dL_db1 = dL_dZ1.sum(axis=0, keepdims=True)

    # --- Update ---
    W1 -= lr * dL_dW1
    b1 -= lr * dL_db1
    W2 -= lr * dL_dW2
    b2 -= lr * dL_db2

    print(f"  step {step}: loss={loss:.6f}")`,
  questions:[
    q('The chain rule for f(g(x)) gives df/dx as:',[{id:'a',text:'df/dg + dg/dx'},{id:'b',text:'df/dg · dg/dx'},{id:'c',text:'df/dx / dg/dx'},{id:'d',text:'f\'(x)·g\'(x)'}],'b','Chain rule multiplies the outer and inner derivatives: df/dx = (df/dg)·(dg/dx).',0),
    q('What is a computation graph?',[{id:'a',text:'A bar chart of model accuracy'},{id:'b',text:'A DAG representing all mathematical operations in a model\'s forward pass'},{id:'c',text:'A database of training samples'},{id:'d',text:'A type of neural architecture'}],'b','Computation graphs represent the chain of operations — backprop traverses them in reverse.',1),
    q('In backpropagation, gradients flow:',[{id:'a',text:'Forward from input to output'},{id:'b',text:'From output (loss) backward to input weights'},{id:'c',text:'Randomly through the network'},{id:'d',text:'Only through convolutional layers'}],'b','Backprop reverses the forward pass, propagating loss gradients backward through each layer.',2),
    q('For z=wx+b, the gradient dz/dw equals:',[{id:'a',text:'b'},{id:'b',text:'1'},{id:'c',text:'x'},{id:'d',text:'w'}],'c','z=wx+b → dz/dw = x (x is the coefficient of w).',3),
    q('Why does the ReLU derivative appear in backprop?',[{id:'a',text:'To normalise the weights'},{id:'b',text:'Because gradients pass through activations — ReLU\'s gate (0 or 1) controls gradient flow'},{id:'c',text:'To compute the loss'},{id:'d',text:'To initialise neurons'}],'b','ReLU derivative = 1 if z>0, 0 otherwise — blocks gradients for dead neurons (z≤0).',4),
    q('The "vanishing gradient" problem occurs when:',[{id:'a',text:'Learning rate is too large'},{id:'b',text:'Gradients become near-zero as they backpropagate through many layers'},{id:'c',text:'The dataset is too small'},{id:'d',text:'Batch size is too large'}],'b','Deep networks multiply many small gradients together — they shrink exponentially (vanish), stopping early-layer learning.',5),
    q('Automatic differentiation (autograd) in frameworks like PyTorch:',[{id:'a',text:'Approximates gradients numerically'},{id:'b',text:'Builds computation graphs and applies chain rule automatically'},{id:'c',text:'Uses symbolic algebra'},{id:'d',text:'Avoids computing gradients'}],'b','Autograd tracks operations in a computation graph and applies the chain rule exactly and efficiently.',6),
    q('For L=(a-y)², what is dL/da?',[{id:'a',text:'a-y'},{id:'b',text:'2(a-y)'},{id:'c',text:'(a-y)²'},{id:'d',text:'2y'}],'b','Power rule + chain rule: dL/da = 2(a-y).',7),
    q('Backpropagation is computationally efficient because:',[{id:'a',text:'It only updates the last layer'},{id:'b',text:'It reuses intermediate values from the forward pass, computing all gradients in one backward sweep'},{id:'c',text:'It requires no matrix operations'},{id:'d',text:'It skips unchanged weights'}],'b','Backprop is O(n) in the number of operations — much better than numerical differentiation which is O(n²).',8),
    q('In a 3-layer network, dL/dW1 requires:',[{id:'a',text:'Only the output gradient'},{id:'b',text:'Gradients chained through layers 3, 2, and 1'},{id:'c',text:'Only the forward pass values'},{id:'d',text:'The Hessian matrix'}],'b','dL/dW1 = dL/dA3 · dA3/dZ3 · dZ3/dA2 · dA2/dZ2 · dZ2/dA1 · dA1/dZ1 · dZ1/dW1 — full chain.',9),
  ]},

  {slug:'af-noob-25-optimizers',title:'Optimisation Algorithms Overview',description:'From plain SGD to Adam — momentum, RMSProp, Adam, and learning rate schedules that make modern deep learning work.',orderIndex:25,xpReward:75,difficulty:'BEGINNER',tier:'NOOB',language:'python',
  content:`# Chapter 25 — Optimisation Algorithms Overview

## Why Not Plain Gradient Descent?

Vanilla GD struggles with:
- **Ravines** — slow zigzag in steep dimensions
- **Saddle points** — gets stuck (gradient≈0)
- **Different scales** — features with different magnitudes need different step sizes

## Momentum

Accumulates velocity in consistent gradient directions:

$$v \\leftarrow \\beta v + (1-\\beta)\\nabla L$$
$$\\theta \\leftarrow \\theta - \\alpha v$$

β = 0.9 is typical. Speeds up in consistent directions, dampens oscillations.

## RMSProp

Adapts learning rate per parameter using a running average of squared gradients:

$$s \\leftarrow \\beta s + (1-\\beta)(\\nabla L)^2$$
$$\\theta \\leftarrow \\theta - \\frac{\\alpha}{\\sqrt{s + \\epsilon}} \\nabla L$$

## Adam (Adaptive Moment Estimation)

Combines **Momentum** (1st moment) + **RMSProp** (2nd moment) with bias correction:

$$\\theta \\leftarrow \\theta - \\frac{\\alpha \\hat{m}}{\\sqrt{\\hat{v}} + \\epsilon}$$

**Adam is the default choice** for most deep learning tasks.

## Learning Rate Schedules

| Schedule | Description |
|---------|-------------|
| Step decay | Reduce LR by factor every N epochs |
| Cosine annealing | LR follows cosine curve |
| Warmup + decay | Start low, peak, then decay |
| ReduceLROnPlateau | Reduce when val_loss stops improving |`,
  codeExample:`import numpy as np

np.random.seed(42)
# Minimise f(w) = w^2 (minimum at w=0)
def grad_f(w): return 2*w

def run_optimizer(name, w0=5.0, lr=0.1, steps=20, **kwargs):
    w = w0
    # SGD
    if name == 'sgd':
        for i in range(steps):
            w -= lr * grad_f(w)

    # Momentum
    elif name == 'momentum':
        v, beta = 0.0, kwargs.get('beta', 0.9)
        for i in range(steps):
            g = grad_f(w)
            v = beta*v + (1-beta)*g
            w -= lr*v

    # RMSProp
    elif name == 'rmsprop':
        s, beta, eps = 0.0, kwargs.get('beta', 0.9), 1e-8
        for i in range(steps):
            g = grad_f(w)
            s = beta*s + (1-beta)*g**2
            w -= (lr / (np.sqrt(s) + eps)) * g

    # Adam
    elif name == 'adam':
        m, v = 0.0, 0.0
        b1, b2, eps = 0.9, 0.999, 1e-8
        for t in range(1, steps+1):
            g = grad_f(w)
            m = b1*m + (1-b1)*g
            v = b2*v + (1-b2)*g**2
            m_hat = m / (1 - b1**t)
            v_hat = v / (1 - b2**t)
            w -= lr * m_hat / (np.sqrt(v_hat) + eps)

    return w

print("=== Optimizer Comparison (f(w)=w², target w=0) ===")
for opt in ['sgd','momentum','rmsprop','adam']:
    final_w = run_optimizer(opt)
    print(f"  {opt:10s}: final w = {final_w:.6f}  (loss = {final_w**2:.8f})")

# Learning rate schedule
print("\n=== Step Decay Schedule ===")
lr0, decay_factor, decay_every = 0.1, 0.5, 5
for epoch in range(20):
    lr = lr0 * (decay_factor ** (epoch // decay_every))
    if epoch % 5 == 0:
        print(f"  epoch {epoch:2d}: lr = {lr:.4f}")`,
  questions:[
    q('What problem does momentum solve in gradient descent?',[{id:'a',text:'Overfitting'},{id:'b',text:'Slow oscillation in ravines — it accelerates in consistent gradient directions'},{id:'c',text:'Vanishing gradients'},{id:'d',text:'Data imbalance'}],'b','Momentum accumulates velocity, speeding up in consistent directions and reducing oscillation.',0),
    q('Adam combines:',[{id:'a',text:'SGD and batch normalisation'},{id:'b',text:'Momentum (1st moment) and RMSProp (2nd moment) with bias correction'},{id:'c',text:'L1 and L2 regularisation'},{id:'d',text:'Forward and backward passes'}],'b','Adam = momentum + RMSProp + bias correction for the first few steps.',1),
    q('RMSProp adapts the learning rate by:',[{id:'a',text:'Using a constant LR for all parameters'},{id:'b',text:'Dividing by a running average of squared gradients — larger gradients → smaller effective LR'},{id:'c',text:'Adding momentum'},{id:'d',text:'Multiplying by the Hessian'}],'b','RMSProp normalises gradients by their recent magnitude, giving each parameter its own effective learning rate.',2),
    q('Which optimizer is the recommended default for most deep learning?',[{id:'a',text:'Vanilla SGD'},{id:'b',text:'RMSProp'},{id:'c',text:'Adam'},{id:'d',text:'Coordinate descent'}],'c','Adam is the default choice — adaptive, fast, and works well across tasks without much tuning.',3),
    q('What does ReduceLROnPlateau do?',[{id:'a',text:'Increases LR every epoch'},{id:'b',text:'Resets weights when loss spikes'},{id:'c',text:'Reduces LR when validation loss stops improving'},{id:'d',text:'Converts SGD to Adam'}],'c','ReduceLROnPlateau monitors a metric and reduces LR by a factor when no improvement is detected.',4),
    q('Bias correction in Adam is needed because:',[{id:'a',text:'Gradients are negative'},{id:'b',text:'The exponential moving averages are biased toward zero in early steps'},{id:'c',text:'The learning rate is too large'},{id:'d',text:'Weights are initialised at zero'}],'b','Early EMA values are biased toward zero (initialised at 0). Dividing by (1-βᵗ) corrects this.',5),
    q('What does the β₁ hyperparameter in Adam control?',[{id:'a',text:'Second moment decay (variance)'},{id:'b',text:'First moment decay (momentum term)'},{id:'c',text:'Learning rate'},{id:'d',text:'Batch size'}],'b','β₁ controls the exponential decay of the first moment (gradient mean) — typically 0.9.',6),
    q('Cosine annealing LR schedule:',[{id:'a',text:'Increases LR linearly'},{id:'b',text:'Keeps LR constant'},{id:'c',text:'Decreases LR following a cosine curve, potentially with warm restarts'},{id:'d',text:'Uses a random LR each step'}],'c','Cosine annealing gradually lowers LR following a cosine curve — smooth and often outperforms step decay.',7),
    q('What is ε (epsilon) in Adam for?',[{id:'a',text:'The learning rate'},{id:'b',text:'To prevent division by zero when the second moment is near zero'},{id:'c',text:'The momentum coefficient'},{id:'d',text:'Gradient clipping threshold'}],'b','ε ≈ 1e-8 is added to the denominator √v̂ + ε to avoid numerical instability.',8),
    q('Learning rate warmup:',[{id:'a',text:'Starts with a large LR then immediately reduces'},{id:'b',text:'Starts with a small LR, increases to target, then decays'},{id:'c',text:'Uses a fixed LR throughout'},{id:'d',text:'Disables momentum in early epochs'}],'b','Warmup slowly ramps up the LR at the start of training to stabilise early weight updates.',9),
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
