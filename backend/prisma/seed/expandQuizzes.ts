/**
 * expandQuizzes.ts
 * Expands every chapter quiz to 15 MCQs and sets passingScore = 67 (≥10/15).
 * Run once after expandFoundations.ts:
 *   npm run expand:quizzes
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Opt = { id: string; text: string };
function q(text: string, options: Opt[], correct: string, explanation: string, order: number) {
  return { text, options: JSON.stringify(options), correctAnswer: correct, explanation, orderIndex: order };
}
const o = (id: string, text: string): Opt => ({ id, text });

/* ═══════════════════════════════════════════════════════════════════════════
   15 questions per chapter slug
═══════════════════════════════════════════════════════════════════════════ */
const QUIZZES: Record<string, ReturnType<typeof q>[]> = {

/* ── Ch 0.0: What is AI ─────────────────────────────────────────────────── */
'ch0-0-what-is-ai': [
  q('What is the primary goal of Artificial Intelligence?', [o('a','Replace all human workers'),o('b','Enable machines to perform tasks requiring human intelligence'),o('c','Build faster processors'),o('d','Store large amounts of data')], 'b', 'AI aims to simulate human intelligence in machines.', 0),
  q('Who coined the term "Artificial Intelligence" in 1956?', [o('a','Alan Turing'),o('b','Marvin Minsky'),o('c','John McCarthy'),o('d','Claude Shannon')], 'c', 'John McCarthy coined "Artificial Intelligence" at the Dartmouth Conference.', 1),
  q('What does the Turing Test evaluate?', [o('a','Computer processing speed'),o('b','Whether machine behavior is indistinguishable from a human'),o('c','ML model accuracy'),o('d','Memory capacity')], 'b', 'The Turing Test checks if a machine can exhibit human-like intelligence.', 2),
  q('Which best describes Narrow AI (Weak AI)?', [o('a','AI that does any human task'),o('b','AI limited to specific tasks and domains'),o('c','AI with human emotions'),o('d','AI needing no data')], 'b', 'Narrow AI excels at specific tasks but cannot generalize.', 3),
  q('What caused the first AI winter?', [o('a','Rapid computing growth'),o('b','Neural network breakthroughs'),o('c','Reduced funding due to unmet expectations'),o('d','Discovery of backpropagation')], 'c', 'Overpromising and underdelivering led to loss of funding.', 4),
  q('Which is NOT a typical Narrow AI application?', [o('a','Facial recognition'),o('b','Chess programs'),o('c','A system that instantly learns any human skill'),o('d','Virtual assistants')], 'c', 'Instantly learning any human skill describes AGI, not Narrow AI.', 5),
  q('In which decade was "Artificial Intelligence" first coined?', [o('a','1940s'),o('b','1950s'),o('c','1960s'),o('d','1970s')], 'b', '1956 — Dartmouth Summer Research Project on Artificial Intelligence.', 6),
  q('What is Artificial General Intelligence (AGI)?', [o('a','AI trained on general datasets'),o('b','AI that performs any intellectual task a human can'),o('c','Average performance of multiple AIs'),o('d','AI for scientific research only')], 'b', 'AGI matches or exceeds human-level reasoning across all tasks.', 7),
  q('Which is an example of AI in everyday life?', [o('a','A calculator doing arithmetic'),o('b','Alphabetically sorting a spreadsheet'),o('c','A music service recommending songs from listening history'),o('d','A spellchecker using fixed rules')], 'c', 'Recommendation systems learn from user behaviour — that is AI.', 8),
  q('What distinguishes Machine Learning from traditional programming?', [o('a','ML uses faster processors'),o('b','ML programs learn from data rather than following explicit rules'),o('c','ML always requires internet'),o('d','ML predates traditional programming')], 'b', 'ML systems improve through exposure to data, not hard-coded logic.', 9),
  q('What famous test did Alan Turing propose in his 1950 paper?', [o('a','IQ Test'),o('b','Binary Classification Test'),o('c','The Imitation Game (Turing Test)'),o('d','Neural Verification Test')], 'c', '"Computing Machinery and Intelligence" introduced the Imitation Game.', 10),
  q('Which AI approach uses explicit rule-based systems (GOFAI)?', [o('a','Deep Learning'),o('b','Symbolic AI'),o('c','Reinforcement Learning'),o('d','Neural Networks')], 'b', 'Good Old-Fashioned AI relies on hand-crafted rules and logic.', 11),
  q('What does "training" an ML model mean?', [o('a','Exercising hardware'),o('b','Writing manual rules'),o('c','Exposing the model to data so it learns patterns'),o('d','Testing on new data')], 'c', 'Training updates model weights by minimising loss on labelled data.', 12),
  q('Deep Learning is a subset of which field?', [o('a','Robotics'),o('b','General Computer Science'),o('c','Machine Learning'),o('d','NLP specifically')], 'c', 'Deep Learning uses deep neural networks — a technique within ML.', 13),
  q('Which industry has NOT been significantly impacted by AI?', [o('a','Healthcare'),o('b','Finance'),o('c','Transportation'),o('d','All listed industries have been impacted')], 'd', 'AI has transformed healthcare, finance, and transportation alike.', 14),
],

/* ── Ch 0.1: Computer Fundamentals ─────────────────────────────────────── */
'ch0-1-computer-fundamentals': [
  q('What does CPU stand for?', [o('a','Central Programming Unit'),o('b','Central Processing Unit'),o('c','Computer Protocol Unit'),o('d','Core Processing Utility')], 'b', 'The CPU is the brain of the computer executing instructions.', 0),
  q('Which storage type loses data when power is off?', [o('a','HDD'),o('b','SSD'),o('c','RAM'),o('d','Flash drive')], 'c', 'RAM is volatile — it requires power to retain data.', 1),
  q('How many bits are in one byte?', [o('a','4'),o('b','8'),o('c','16'),o('d','32')], 'b', 'One byte = 8 bits; the fundamental unit of digital information.', 2),
  q('What is the base of the binary number system?', [o('a','2'),o('b','8'),o('c','10'),o('d','16')], 'a', 'Binary uses only 0 and 1 — base 2.', 3),
  q('What does an operating system primarily do?', [o('a','Browse the internet'),o('b','Manage hardware and software resources'),o('c','Store files permanently'),o('d','Run only antivirus programs')], 'b', 'The OS is the bridge between hardware and applications.', 4),
  q('Which measures CPU performance?', [o('a','Gigabytes (GB)'),o('b','Gigahertz (GHz)'),o('c','Gigapixels (GP)'),o('d','Gigawatts (GW)')], 'b', 'GHz measures clock speed — instructions per second.', 5),
  q('Why is a GPU advantaged for AI over a CPU?', [o('a','Stores training data'),o('b','Parallel computation for matrix operations'),o('c','Network communication'),o('d','Power management')], 'b', 'GPUs have thousands of cores ideal for the matrix math in neural networks.', 6),
  q('What is the decimal value of binary 1010?', [o('a','8'),o('b','10'),o('c','12'),o('d','14')], 'b', '1×8 + 0×4 + 1×2 + 0×1 = 10.', 7),
  q('What does "64-bit OS" refer to?', [o('a','Can process 64 files at once'),o('b','Runs at 64 GHz'),o('c','CPU processes 64 bits of data at a time'),o('d','Supports only 64 GB storage')], 'c', '64-bit CPUs can address far more memory and process larger data chunks.', 8),
  q('Which memory type is fastest?', [o('a','HDD'),o('b','RAM'),o('c','USB Flash'),o('d','CD-ROM')], 'b', 'RAM is orders of magnitude faster than any disk-based storage.', 9),
  q('What does the motherboard do?', [o('a','Stores OS files'),o('b','Main circuit board connecting all computer components'),o('c','Displays graphics'),o('d','Manages internet')], 'b', 'The motherboard is the central hub interconnecting CPU, RAM, storage, etc.', 10),
  q('What does "clock speed" measure?', [o('a','Programs running simultaneously'),o('b','Time to boot the OS'),o('c','Instructions executed per second'),o('d','Physical processor size')], 'c', 'Higher clock speed = more instructions per second.', 11),
  q('Which unit correctly describes internet speed?', [o('a','GHz'),o('b','GB'),o('c','Mbps'),o('d','MHz')], 'c', 'Network speed is measured in bits per second (Mbps, Gbps).', 12),
  q('What is virtual memory?', [o('a','Memory that does not physically exist'),o('b','A hard-drive section used as extra RAM when RAM is full'),o('c','Cloud-based memory'),o('d','Encrypted RAM')], 'b', 'Virtual memory extends RAM by using disk space — but much slower.', 13),
  q('Why is GPU preferred for training neural networks?', [o('a','GPUs are cheaper'),o('b','Thousands of smaller cores optimised for parallel matrix math'),o('c','More storage'),o('d','Higher clock speed')], 'b', 'Neural networks are dominated by matrix operations that GPUs parallelise perfectly.', 14),
],

/* ── Ch 0.2: Linux Fundamentals ─────────────────────────────────────────── */
'ch0-2-linux-fundamentals': [
  q('Which command lists files in the current directory?', [o('a','dir'),o('b','list'),o('c','ls'),o('d','show')], 'c', '`ls` is the standard UNIX/Linux command for listing directory contents.', 0),
  q('What does `cd ..` do?', [o('a','Creates a directory'),o('b','Deletes the current directory'),o('c','Moves to the parent directory'),o('d','Renames the directory')], 'c', '`..` refers to the parent of the current directory.', 1),
  q('Which command prints the current working directory?', [o('a','cwd'),o('b','pwd'),o('c','dir'),o('d','loc')], 'b', '`pwd` = Print Working Directory.', 2),
  q('What permissions does `chmod 755` grant?', [o('a','Owner: read; Others: rwx'),o('b','Owner: rwx; Group & Others: r-x'),o('c','Everyone: full permissions'),o('d','Owner: full; Group: write only')], 'b', '7=rwx, 5=r-x — common for executables and directories.', 3),
  q('What does `sudo` mean in Linux?', [o('a','Switch user and do'),o('b','Superuser do — execute with admin privileges'),o('c','System update do'),o('d','Safe user do')], 'b', '`sudo` elevates a single command to root privileges.', 4),
  q('Which command creates a new empty file?', [o('a','new filename'),o('b','create filename'),o('c','touch filename'),o('d','make filename')], 'c', '`touch` creates a file or updates its timestamp.', 5),
  q('What does `grep "pattern" file.txt` do?', [o('a','Replaces "pattern"'),o('b','Deletes matching lines'),o('c','Searches for lines containing "pattern"'),o('d','Counts occurrences only')], 'c', '`grep` filters lines matching a pattern — essential for log analysis.', 6),
  q('Which command removes a directory and all its contents?', [o('a','del -r'),o('b','rm -rf dirname'),o('c','rmdir dirname'),o('d','remove dirname')], 'b', '`rm -rf` forcefully removes recursively — use with care.', 7),
  q('What does a dot `.` at the start of a filename mean in Linux?', [o('a','Executable file'),o('b','System file'),o('c','Hidden file'),o('d','Read-only file')], 'c', 'Dotfiles are hidden by default from `ls` without `-a` flag.', 8),
  q('What does the pipe operator `|` do?', [o('a','Runs two commands simultaneously'),o('b','Sends output of one command as input to another'),o('c','Compares two files'),o('d','Saves output to a file')], 'b', 'Piping chains commands: `ls | grep ".py"` filters only .py files.', 9),
  q('Which command shows running processes?', [o('a','jobs'),o('b','tasks'),o('c','ps or top'),o('d','show-process')], 'c', '`ps` gives a snapshot; `top` gives a live view of processes.', 10),
  q('What represents the root directory in Linux?', [o('a','root/'),o('b','/root'),o('c','/'),o('d','~/')], 'c', '`/` is the top of the filesystem hierarchy.', 11),
  q('What does `man ls` do?', [o('a','Opens the manual page for ls'),o('b','Makes all files visible'),o('c','Manages list settings'),o('d','Opens a file manager')], 'a', '`man` opens the manual page for any command.', 12),
  q('Which file is commonly used to set environment variables in bash?', [o('a','/etc/hosts'),o('b','~/.bashrc or ~/.bash_profile'),o('c','/proc/environ'),o('d','/sys/variables')], 'b', 'Shell startup files like `.bashrc` are sourced on every terminal open.', 13),
  q('What does `echo $HOME` print?', [o('a','The word HOME'),o('b','The current username'),o('c','The user\'s home directory path'),o('d','The system hostname')], 'c', '$HOME is an environment variable pointing to /home/username.', 14),
],

/* ── Ch 0.3: Git & GitHub ────────────────────────────────────────────────── */
'ch0-3-git-github': [
  q('What is Git primarily used for?', [o('a','Hosting websites'),o('b','Version control — tracking changes in code'),o('c','Writing documentation'),o('d','Compiling programs')], 'b', 'Git tracks every change, enabling collaboration and rollback.', 0),
  q('What does `git init` do?', [o('a','Installs Git'),o('b','Downloads a repository'),o('c','Initialises a new Git repo in the current directory'),o('d','Connects to a remote server')], 'c', '`git init` creates a hidden `.git` folder that tracks history.', 1),
  q('What is the purpose of `git add .`?', [o('a','Creates a new branch'),o('b','Stages all changed files for the next commit'),o('c','Pushes to GitHub'),o('d','Merges branches')], 'b', 'Staging prepares changes to be included in the next commit.', 2),
  q('What does `git commit -m "message"` do?', [o('a','Pushes to the remote'),o('b','Creates a branch named message'),o('c','Records staged changes with a descriptive message'),o('d','Sends a message to collaborators')], 'c', 'A commit is a permanent snapshot in the project history.', 3),
  q('What is a "branch" in Git?', [o('a','A fork of the entire repo'),o('b','An independent line of development'),o('c','A backup of main'),o('d','A way to delete files safely')], 'b', 'Branches let you develop features without affecting the main codebase.', 4),
  q('Which command shows the working-directory status?', [o('a','git info'),o('b','git log'),o('c','git status'),o('d','git show')], 'c', '`git status` shows staged, unstaged, and untracked files.', 5),
  q('What does `git clone <url>` do?', [o('a','Copies a remote repo to your local machine'),o('b','Uploads your repo to GitHub'),o('c','Creates an empty Git repo'),o('d','Clones environment variables')], 'a', 'Cloning downloads the full history and sets up the remote tracking.', 6),
  q('What is a Pull Request (PR) on GitHub?', [o('a','Requesting someone pull from your computer'),o('b','Downloading new commits'),o('c','A proposal to merge changes from one branch to another for review'),o('d','A way to clone a repo')], 'c', 'PRs enable code review before merging into the main branch.', 7),
  q('What does `git merge feature-branch` do?', [o('a','Deletes feature-branch'),o('b','Creates feature-branch'),o('c','Integrates feature-branch changes into the current branch'),o('d','Reverts all changes in feature-branch')], 'c', 'Merging brings diverged branches back together.', 8),
  q('What is a merge conflict?', [o('a','Two devs committing simultaneously'),o('b','Two branches changed the same part of a file differently'),o('c','GitHub being offline'),o('d','Your branch being behind the remote')], 'b', 'Git cannot auto-resolve conflicting edits to the same lines.', 9),
  q('Which command shows commit history?', [o('a','git history'),o('b','git log'),o('c','git commits'),o('d','git trace')], 'b', '`git log` lists commits with hash, author, date, and message.', 10),
  q('What does `git push origin main` do?', [o('a','Downloads changes from main'),o('b','Creates a branch called main'),o('c','Uploads local commits to the remote main branch'),o('d','Switches to main')], 'c', 'Pushing shares your local commits with the remote repository.', 11),
  q('What is `.gitignore` used for?', [o('a','Listing collaborators to ignore'),o('b','Specifying files Git should not track'),o('c','Storing git configuration'),o('d','Listing commits to ignore during merge')], 'b', 'Common entries: node_modules/, .env, __pycache__, *.log.', 12),
  q('What does `git pull` do?', [o('a','Downloads and integrates remote changes'),o('b','Uploads local changes'),o('c','Creates a pull request'),o('d','Pulls a file from history')], 'a', '`git pull` = `git fetch` + `git merge` in one step.', 13),
  q('Which creates and switches to a new branch?', [o('a','git branch new && git checkout new'),o('b','git checkout -b new'),o('c','git switch -c new'),o('d','Both b and c are correct')], 'd', 'Both `checkout -b` and `switch -c` are valid shortcuts.', 14),
],

/* ── Ch 0.4: Python Programming Fundamentals ─────────────────────────────── */
'ch0-4-python-fundamentals': [
  q('Which correctly declares a variable in Python?', [o('a','var x = 5'),o('b','int x = 5'),o('c','x = 5'),o('d','declare x as 5')], 'c', 'Python uses dynamic typing — just assign directly.', 0),
  q('What does `len()` return?', [o('a','The last element'),o('b','The number of items in the object'),o('c','Memory size'),o('d','The type')], 'b', '`len([1,2,3])` returns 3.', 1),
  q('Which Python type is immutable?', [o('a','List'),o('b','Dictionary'),o('c','Set'),o('d','Tuple')], 'd', 'Tuples cannot be modified after creation.', 2),
  q('What does `print(type(3.14))` output?', [o('a','int'),o('b','float'),o('c',"<class 'float'>"),o('d','double')], 'c', 'Python\'s type() returns the class object representation.', 3),
  q('Which keyword defines a function in Python?', [o('a','function'),o('b','define'),o('c','def'),o('d','func')], 'c', '`def my_func():` is the Python function definition syntax.', 4),
  q('What does `range(5)` generate?', [o('a','1 through 5'),o('b','0 through 4'),o('c','5 random numbers'),o('d','1 through 4')], 'b', '`range(n)` starts at 0 and stops before n.', 5),
  q('What is a Python list comprehension?', [o('a','Comments added to a list'),o('b','Compact syntax for creating lists from existing sequences'),o('c','A method for sorting'),o('d','A way to combine two lists')], 'b', '`[x**2 for x in range(5)]` creates [0,1,4,9,16].', 6),
  q('What does `import numpy as np` do?', [o('a','Creates a numpy module'),o('b','Imports numpy with alias "np"'),o('c','Installs numpy'),o('d','Removes numpy from memory after use')], 'b', 'The `as` keyword assigns an alias for convenience.', 7),
  q('Difference between list `[]` and tuple `()`?', [o('a','Lists can have multiple types; tuples cannot'),o('b','Lists are mutable; tuples are immutable'),o('c','Tuples can be indexed; lists cannot'),o('d','No difference')], 'b', 'Immutability makes tuples hashable and slightly faster.', 8),
  q('What does `*args` allow in a function definition?', [o('a','Only keyword arguments'),o('b','A variable number of positional arguments'),o('c','Arguments with defaults'),o('d','Only one argument')], 'b', '`def f(*args)` accepts any number of positional arguments.', 9),
  q('Which method appends to a Python list?', [o('a','list.add()'),o('b','list.insert()'),o('c','list.append()'),o('d','list.push()')], 'c', '`append()` adds an element to the end of the list.', 10),
  q('What is a Python dictionary?', [o('a','Alphabetically sorted list'),o('b','Collection of key-value pairs'),o('c','Set of unique integers'),o('d','Ordered character sequence')], 'b', 'Dicts provide O(1) key-based lookup.', 11),
  q('What does the `with` statement primarily handle?', [o('a','Exception handling'),o('b','Context management — like auto-closing files'),o('c','Defining classes'),o('d','Loop iteration')], 'b', '`with open("f") as f:` auto-closes the file on exit.', 12),
  q('Output of `print(10 // 3)`?', [o('a','3.33'),o('b','3'),o('c','4'),o('d','0.33')], 'b', '`//` is floor division — drops the decimal.', 13),
  q('What is a Python decorator?', [o('a','A way to format print output'),o('b','A function that modifies the behaviour of another function'),o('c','A class attribute'),o('d','A type annotation')], 'b', '`@my_decorator` wraps the function, adding behaviour without changing its code.', 14),
],

/* ── Ch 0.5: Mathematics for AI ─────────────────────────────────────────── */
'ch0-5-math-for-ai': [
  q('What is a scalar in mathematics?', [o('a','Magnitude and direction'),o('b','Only magnitude — a single number'),o('c','A 1D array'),o('d','A square matrix')], 'b', 'Scalars are zero-dimensional: temperature, mass, etc.', 0),
  q('In ML, what is a vector?', [o('a','A 2D array'),o('b','A directed line segment'),o('c','A 1D array representing features or weights'),o('d','Scalars without order')], 'c', 'Feature vectors are the fundamental input to most ML models.', 1),
  q('Dot product of [1,2] and [3,4]?', [o('a','[3,8]'),o('b','11'),o('c','10'),o('d','7')], 'b', '1×3 + 2×4 = 3 + 8 = 11.', 2),
  q('What does the derivative of a function represent?', [o('a','Area under the curve'),o('b','Instantaneous rate of change'),o('c','Maximum value'),o('d','Integral of the function')], 'b', 'The derivative measures how fast a function changes at a point.', 3),
  q('What is gradient descent?', [o('a','Increasing model complexity'),o('b','Optimisation algorithm minimising loss by moving along the negative gradient'),o('c','Data normalisation'),o('d','Evaluating performance')], 'b', 'Gradient descent iteratively updates weights to reduce loss.', 4),
  q('What is a matrix?', [o('a','A 1D array'),o('b','A scalar in disguise'),o('c','A 2D grid of numbers with rows and columns'),o('d','A mathematical function')], 'c', 'Matrices are central to neural network weight storage and operations.', 5),
  q('Mean of [2,4,6,8,10]?', [o('a','5'),o('b','6'),o('c','7'),o('d','4')], 'b', '(2+4+6+8+10)/5 = 30/5 = 6.', 6),
  q('What does standard deviation measure?', [o('a','Average value'),o('b','Spread/variability around the mean'),o('c','Max minus min'),o('d','Middle value in sorted data')], 'b', 'Small std dev = data clustered near mean; large = widely spread.', 7),
  q('Probability of rolling a 6 on a fair die?', [o('a','1/3'),o('b','1/2'),o('c','1/6'),o('d','6')], 'c', 'Six equally likely outcomes; P(6) = 1/6 ≈ 16.7%.', 8),
  q('What is overfitting mathematically?', [o('a','Too few parameters'),o('b','Model memorises training noise, failing to generalise'),o('c','Loss function not differentiable'),o('d','Gradient too small')], 'b', 'An overfit model has low training error but high test error.', 9),
  q('What is a normal (Gaussian) distribution?', [o('a','All values equally likely'),o('b','Bell-shaped, symmetric around the mean'),o('c','Only two possible outcomes'),o('d','Completely random')], 'b', 'Many natural phenomena follow a normal distribution.', 10),
  q('Multiplying (2×3) by (3×4) gives what size matrix?', [o('a','2×4'),o('b','3×3'),o('c','6×4'),o('d','2×3')], 'a', 'Inner dimensions must match; result is outer dimensions: 2×4.', 11),
  q('The chain rule in calculus is used in deep learning for?', [o('a','Linking database tables'),o('b','Computing derivatives of composite functions — backpropagation'),o('c','Chaining datasets'),o('d','Ordering network operations')], 'b', 'Backpropagation applies the chain rule layer by layer.', 12),
  q('What is Bayes\' Theorem used for?', [o('a','Computing matrix inverses'),o('b','Updating probability of a hypothesis given new evidence'),o('c','Finding function minima'),o('d','Normalising features')], 'b', 'Bayes is fundamental to probabilistic ML classifiers.', 13),
  q('Why normalise/scale features before training?', [o('a','To make features integers'),o('b','To reduce feature count'),o('c','To bring features to a similar scale — preventing domination'),o('d','To increase accuracy arbitrarily')], 'c', 'Unscaled features cause distance-based and gradient algorithms to behave poorly.', 14),
],

/* ── Ch 1.0: Introduction to Artificial Intelligence ───────────────────── */
'ch1-0-intro-to-ai': [
  q('Which is NOT a main ML type?', [o('a','Supervised'),o('b','Unsupervised'),o('c','Reinforcement'),o('d','Prescriptive')], 'd', 'The three main types are Supervised, Unsupervised, and Reinforcement Learning.', 0),
  q('What does supervised training data contain?', [o('a','Only inputs'),o('b','Input features paired with correct output labels'),o('c','Random exploration data'),o('d','Only desired outputs')], 'b', 'Labels guide the model toward correct predictions.', 1),
  q('What is unsupervised learning?', [o('a','Learning without a human teacher present'),o('b','Finding hidden patterns in unlabelled data'),o('c','Training on unstructured images'),o('d','Reinforcement learning with delayed rewards')], 'b', 'Clustering and dimensionality reduction are classic unsupervised tasks.', 2),
  q('In reinforcement learning, what is the "agent"?', [o('a','The environment'),o('b','The reward signal'),o('c','The entity taking actions to maximise cumulative reward'),o('d','The dataset')], 'c', 'The agent observes state, acts, receives reward, and learns.', 3),
  q('What is the Dartmouth Conference famous for?', [o('a','First chess computer'),o('b','Founding event where "Artificial Intelligence" was coined in 1956'),o('c','First neural network demo'),o('d','First commercial AI product')], 'b', 'McCarthy, Minsky, Shannon and others launched the AI field there.', 4),
  q('Which is a typical supervised learning task?', [o('a','Customer segmentation'),o('b','Anomaly detection without labels'),o('c','Predicting house prices from features'),o('d','Topic modelling from text')], 'c', 'Regression on labelled data = supervised learning.', 5),
  q('What is feature engineering?', [o('a','Designing network architecture'),o('b','Using domain knowledge to extract and transform meaningful inputs'),o('c','Selecting the ML algorithm'),o('d','Evaluating metrics')], 'b', 'Good features can transform a mediocre model into an excellent one.', 6),
  q('What is a "label" in supervised ML?', [o('a','A categorical feature'),o('b','The dataset name'),o('c','The correct output/target value for a given input'),o('d','A type of network layer')], 'c', 'Labels are what the model learns to predict.', 7),
  q('Which is an example of unsupervised learning?', [o('a','Spam classification'),o('b','Image recognition'),o('c','Customer segmentation via clustering'),o('d','Stock price prediction')], 'c', 'K-Means clustering groups customers without labelled examples.', 8),
  q('What does "generalisation" mean in ML?', [o('a','One model for many tasks'),o('b','Performing well on new unseen data'),o('c','Increasing model complexity'),o('d','Training on bigger datasets')], 'b', 'A generalised model learns true patterns, not just training noise.', 9),
  q('What is the bias-variance tradeoff?', [o('a','Accuracy vs speed'),o('b','Too simple (high bias) vs too complex (high variance)'),o('c','Training time vs model size'),o('d','Labelled vs unlabelled data')], 'b', 'The sweet spot minimises both bias and variance simultaneously.', 10),
  q('Which AI technique simulates evolution?', [o('a','Deep Learning'),o('b','Genetic Algorithms'),o('c','Bayesian Networks'),o('d','SVMs')], 'b', 'Genetic algorithms use selection, crossover, and mutation.', 11),
  q('What is transfer learning?', [o('a','Moving a model between computers'),o('b','Transferring data between datasets'),o('c','Using a pre-trained model as starting point for a new task'),o('d','Converting between frameworks')], 'c', 'Transfer learning dramatically reduces training time and data requirements.', 12),
  q('What is the "black box" problem in AI?', [o('a','AI that only works with dark data'),o('b','Difficulty explaining how complex AI models make decisions'),o('c','AI not trainable on new data'),o('d','AI requiring black server rooms')], 'b', 'Explainability/Interpretability is a key AI research area.', 13),
  q('What is federated learning?', [o('a','Government-regulated AI'),o('b','Training across decentralised devices without sharing raw data'),o('c','Combining multiple algorithms into one'),o('d','Training on federal datasets')], 'b', 'Privacy-preserving — only model updates are shared, not raw data.', 14),
],

/* ── Ch 1.1: AI Development Environment ─────────────────────────────────── */
'ch1-1-ai-dev-environment': [
  q('What is a Python virtual environment?', [o('a','Cloud-based IDE'),o('b','Isolated Python install with its own packages'),o('c','A VM running Python'),o('d','A debugging tool')], 'b', 'Virtual environments prevent dependency conflicts between projects.', 0),
  q('What does `pip install numpy` do?', [o('a','Updates pip'),o('b','Installs numpy from PyPI'),o('c','Creates a numpy project'),o('d','Tests if numpy is installed')], 'b', 'pip is the standard Python package installer.', 1),
  q('What is Anaconda/Conda primarily used for?', [o('a','A web framework'),o('b','Data science package and environment management'),o('c','A Python debugger'),o('d','Version control')], 'b', 'Conda manages environments and packages across multiple languages.', 2),
  q('What is a Jupyter Notebook?', [o('a','A text editor for scripts'),o('b','An interactive environment mixing code, text, visualisations, and output'),o('c','A version control interface'),o('d','A package manager')], 'b', 'Notebooks are essential for EDA, experimentation, and teaching.', 3),
  q('Which command creates a conda environment named "ai-env"?', [o('a','conda make ai-env'),o('b','conda create -n ai-env python=3.10'),o('c','conda new ai-env'),o('d','conda init ai-env')], 'b', 'The `-n` flag names the environment; `python=` pins the version.', 4),
  q('What is `requirements.txt` used for?', [o('a','Project README'),o('b','Listing Python dependencies for reproducibility'),o('c','Tracking git commits'),o('d','Configuring the IDE')], 'b', '`pip freeze > requirements.txt` captures the current environment.', 5),
  q('What does CUDA enable?', [o('a','Code debugging on CPUs'),o('b','GPU acceleration for deep learning on NVIDIA hardware'),o('c','Cloud deployment'),o('d','Data preprocessing in parallel')], 'b', 'CUDA exposes GPU cores to deep learning frameworks like PyTorch.', 6),
  q('What is VS Code used for in AI development?', [o('a','Training neural networks'),o('b','A code editor and IDE with AI development extensions'),o('c','Visualising datasets'),o('d','Managing databases')], 'b', 'VS Code + Python/Jupyter extensions is a popular AI development setup.', 7),
  q('Which command lists installed packages?', [o('a','pip show all'),o('b','pip list'),o('c','pip packages'),o('d','conda show')], 'b', '`pip list` shows all packages in the active environment.', 8),
  q('What is the purpose of a `.env` file?', [o('a','Storing API keys and environment variables securely'),o('b','Defining Python version'),o('c','Listing dependencies'),o('d','Configuring the VM')], 'a', 'Never commit `.env` to git — use `.gitignore` to exclude it.', 9),
  q('What does `nvidia-smi` show?', [o('a','NVIDIA software status'),o('b','GPU status, temperature, and memory usage'),o('c','CUDA compilation errors'),o('d','Python GPU package versions')], 'b', 'Essential for verifying GPU availability and monitoring during training.', 10),
  q('Which library is essential for scientific computing in Python?', [o('a','Django'),o('b','Flask'),o('c','NumPy'),o('d','Requests')], 'c', 'NumPy provides arrays, broadcasting, and linear algebra operations.', 11),
  q('Difference between pip and conda?', [o('a','pip faster; conda slower'),o('b','pip manages Python packages only; conda manages packages + environments for multiple languages'),o('c','conda is Windows-only'),o('d','pip installs from GitHub; conda from PyPI')], 'b', 'Conda can handle non-Python dependencies like CUDA libraries.', 12),
  q('What is a Jupyter "Markdown" cell used for?', [o('a','Running Python code'),o('b','Writing formatted text and documentation alongside code'),o('c','Importing libraries'),o('d','Running terminal commands')], 'b', 'Markdown cells make notebooks readable and presentable.', 13),
  q('What does `torch.cuda.is_available()` check?', [o('a','If PyTorch is installed'),o('b','If a CUDA-capable GPU is available for training'),o('c','If CUDA drivers need updating'),o('d','Current model architecture')], 'b', 'Always check GPU availability before moving tensors to CUDA.', 14),
],

/* ── Ch 1.2: Data Fundamentals ───────────────────────────────────────────── */
'ch1-2-data-fundamentals': [
  q('What is Exploratory Data Analysis (EDA)?', [o('a','Writing deployment code'),o('b','Analysing datasets to discover patterns before modelling'),o('c','Exploring different algorithms'),o('d','A web exploration tool')], 'b', 'EDA is the essential first step in any ML project.', 0),
  q('Which pandas function reads a CSV?', [o('a','pd.open_csv()'),o('b','pd.read_csv()'),o('c','pd.load_csv()'),o('d','pd.import_csv()')], 'b', '`pd.read_csv("file.csv")` is the standard approach.', 1),
  q('What does `df.isnull().sum()` tell you?', [o('a','Sum of all numeric values'),o('b','Number of missing values per column'),o('c','Total row count'),o('d','Number of unique values')], 'b', 'Essential first step in identifying data quality issues.', 2),
  q('Why is feature scaling important?', [o('a','Makes features integers'),o('b','Normalises values so no feature dominates training'),o('c','Scales dataset size'),o('d','Increases float precision')], 'b', 'KNN, SVMs, and gradient descent all benefit from scaled features.', 3),
  q('Difference between structured and unstructured data?', [o('a','Structured is digital; unstructured is paper'),o('b','Structured = rows/columns (tables); unstructured = text, images, audio'),o('c','Structured is larger'),o('d','Structured requires more cleaning')], 'b', '~80% of real-world data is unstructured.', 4),
  q('What does `df.describe()` provide?', [o('a','Column data types'),o('b','Statistical summary: count, mean, std, min, max, percentiles'),o('c','First 5 rows'),o('d','Column names and counts')], 'b', 'Quickly reveals scale, distribution, and potential outliers.', 5),
  q('Which strategy replaces missing values with the column mean?', [o('a','Deletion'),o('b','Forward filling'),o('c','Mean imputation'),o('d','One-hot encoding')], 'c', 'Mean imputation preserves the row while filling the gap.', 6),
  q('What is one-hot encoding used for?', [o('a','Encrypting data'),o('b','Converting categorical variables into binary 0/1 columns'),o('c','Normalising numerical features'),o('d','Reducing dataset size')], 'b', 'Prevents models from treating category integers as ordinal.', 7),
  q('What is the train-test split for?', [o('a','Splitting across computers'),o('b','Dividing data into training and evaluation portions'),o('c','Separating features from labels'),o('d','Splitting by category')], 'b', 'Test data must remain unseen until final evaluation.', 8),
  q('Correlation coefficient near +1 means?', [o('a','Features are independent'),o('b','One decreases as the other increases'),o('c','Strong positive linear relationship'),o('d','No relationship')], 'c', 'r=+1 is perfect positive linear correlation.', 9),
  q('What is data leakage?', [o('a','Accidental deletion'),o('b','Test set information influencing model training'),o('c','Sensitive data exposure'),o('d','Missing values in training')], 'b', 'Leakage produces over-optimistic metrics that collapse in production.', 10),
  q('What does pandas `groupby()` do?', [o('a','Sorts alphabetically'),o('b','Groups rows by column values for aggregate operations'),o('c','Joins two DataFrames'),o('d','Filters rows')], 'b', '`df.groupby("city")["sales"].sum()` sums sales per city.', 11),
  q('What is IQR commonly used for?', [o('a','Calculating average'),o('b','Detecting outliers'),o('c','Measuring correlation'),o('d','Normalising data')], 'b', 'Outliers often defined as Q1 - 1.5×IQR or Q3 + 1.5×IQR.', 12),
  q('What does label encoding do?', [o('a','Assigns binary vectors to categories'),o('b','Assigns a unique integer to each category'),o('c','Removes categorical columns'),o('d','Converts to float')], 'b', 'Ordinal categories like Small/Medium/Large suit label encoding.', 13),
  q('Why scale features before KNN?', [o('a','KNN requires integers'),o('b','KNN uses distances — larger-scale features would dominate'),o('c','KNN doesn\'t support floats'),o('d','Scaling is equally required for all algorithms')], 'b', 'Euclidean distance is sensitive to feature magnitude.', 14),
],

/* ── Ch 1.3: Introduction to Machine Learning ───────────────────────────── */
'ch1-3-intro-to-ml': [
  q('What is linear regression used for?', [o('a','Classifying data'),o('b','Predicting a continuous numeric output'),o('c','Clustering data'),o('d','Finding anomalies')], 'b', 'Linear regression models the relationship between continuous variables.', 0),
  q('What is logistic regression despite its name?', [o('a','Regression for continuous outputs'),o('b','A classification algorithm predicting probabilities'),o('c','A linear model for time series'),o('d','A clustering algorithm')], 'b', 'The "logistic" refers to the sigmoid function that squashes output to [0,1].', 1),
  q('What is the purpose of a loss function?', [o('a','Measure distance between data points'),o('b','Quantify how wrong model predictions are'),o('c','Prevent overfitting'),o('d','Select best features')], 'b', 'Minimising the loss function is the goal of training.', 2),
  q('What does accuracy measure?', [o('a','Prediction speed'),o('b','Fraction of all predictions that were correct'),o('c','Memory usage'),o('d','Handling imbalanced classes')], 'b', 'Accuracy = correct predictions / total predictions.', 3),
  q('What is KNN based on?', [o('a','Learning a mathematical decision boundary'),o('b','Classifying by majority class of k closest training points'),o('c','Building a decision tree'),o('d','Gradient-based optimisation')], 'b', 'KNN is a non-parametric, instance-based learner.', 4),
  q('What is cross-validation used for?', [o('a','Validating data types'),o('b','Evaluating model performance across multiple data splits'),o('c','Checking missing values'),o('d','Comparing two datasets')], 'b', 'k-Fold CV gives a more reliable performance estimate than a single split.', 5),
  q('What is precision in classification?', [o('a','Of all actual positives, how many identified?'),o('b','Of all predicted positives, how many are actually positive?'),o('c','Overall accuracy'),o('d','False positive rate')], 'b', 'Precision matters when false positives are costly (e.g., spam filters).', 6),
  q('What is recall in classification?', [o('a','Of predicted positives, how many correct?'),o('b','Of all actual positives, how many did the model find?'),o('c','Percentage of correct predictions'),o('d','Model ability to memorise training data')], 'b', 'Recall matters when false negatives are costly (e.g., cancer detection).', 7),
  q('What is a Decision Tree?', [o('a','A flowchart model that splits on feature conditions'),o('b','A neural network weight visualisation'),o('c','A way to organise datasets'),o('d','A gradient descent visualisation')], 'a', 'Decision trees split data recursively to maximise information gain.', 8),
  q('What is a Random Forest?', [o('a','A single very deep decision tree'),o('b','An ensemble of decision trees trained on random data subsets'),o('c','A neural network with random initialisation'),o('d','A clustering method')], 'b', 'Averaging many trees reduces variance and prevents overfitting.', 9),
  q('What is ROC-AUC used for?', [o('a','Measuring regression error'),o('b','Evaluating classifiers by area under the ROC curve'),o('c','Comparing two regressions'),o('d','Measuring training speed')], 'b', 'AUC=1 is perfect; AUC=0.5 is random guessing.', 10),
  q('What is regularisation?', [o('a','Converting categorical data to numbers'),o('b','Adding a loss penalty to discourage large weights and prevent overfitting'),o('c','Normalising feature values'),o('d','Splitting data')], 'b', 'L1 and L2 are the two most common regularisation techniques.', 11),
  q('Difference between L1 and L2 regularisation?', [o('a','L1 drives some weights to 0 (sparsity); L2 shrinks all weights'),o('b','L1 prevents underfitting; L2 prevents overfitting'),o('c','L1 for classification; L2 for regression'),o('d','L1 faster; L2 more accurate')], 'a', 'L1 (Lasso) can completely zero out irrelevant features.', 12),
  q('In a confusion matrix, what is a "false positive"?', [o('a','Predicted negative, actually negative'),o('b','Predicted positive, actually negative'),o('c','Predicted negative, actually positive'),o('d','Predicted positive correctly')], 'b', 'False positives are Type I errors.', 13),
  q('What is hyperparameter tuning?', [o('a','Adjusting model weights during training'),o('b','Selecting best algorithm configuration values not learned from data'),o('c','Tuning the training dataset'),o('d','Optimising hardware')], 'b', 'Grid search and random search are common tuning strategies.', 14),
],

/* ── Ch 1.4: AI Visualisation & Analytics ───────────────────────────────── */
'ch1-4-ai-visualization': [
  q('Most common Python library for basic data visualisation?', [o('a','NumPy'),o('b','Pandas'),o('c','Matplotlib'),o('d','Scikit-learn')], 'c', 'Matplotlib is the foundation; Seaborn and Plotly build on it.', 0),
  q('Best chart for continuous variable distribution?', [o('a','Bar chart'),o('b','Pie chart'),o('c','Histogram'),o('d','Scatter plot')], 'c', 'Histograms show the frequency distribution of a single variable.', 1),
  q('Seaborn is built on top of?', [o('a','NumPy'),o('b','Matplotlib'),o('c','Pandas'),o('d','Plotly')], 'b', 'Seaborn wraps Matplotlib with prettier defaults and statistical plots.', 2),
  q('What does a scatter plot show?', [o('a','Distribution of one variable'),o('b','Relationship between two continuous variables'),o('c','Proportions of categories'),o('d','Changes over time')], 'b', 'Scatter plots reveal correlations, clusters, and outliers.', 3),
  q('What is a heatmap useful for?', [o('a','Temperature data only'),o('b','Correlation matrices and 2D datasets'),o('c','Time series data'),o('d','Category distributions')], 'b', '`sns.heatmap(df.corr())` is a staple of EDA.', 4),
  q('What does `plt.show()` do?', [o('a','Saves the figure'),o('b','Displays the current figure'),o('c','Clears the figure'),o('d','Applies a theme')], 'b', 'In scripts you must call `plt.show()` to render the plot.', 5),
  q('Best chart type for comparing category proportions?', [o('a','Histogram'),o('b','Line chart'),o('c','Pie chart or bar chart'),o('d','Scatter plot')], 'c', 'Bar charts are often preferred over pie charts for accuracy.', 6),
  q('What is a box plot used for?', [o('a','Relationship between two variables'),o('b','Distribution, median, quartiles, and outliers'),o('c','Comparing proportions'),o('d','Frequency of values')], 'b', 'Box plots provide a 5-number summary at a glance.', 7),
  q('What is "overplotting" in visualisation?', [o('a','Too many labels'),o('b','Data points overlapping, making the chart hard to read'),o('c','Too many colours'),o('d','Charts too large')], 'b', 'Solutions: transparency (alpha), jitter, or hexbin plots.', 8),
  q('What does `sns.pairplot(df)` generate?', [o('a','A single scatter plot'),o('b','A grid of scatter plots for all pairs of numeric features'),o('c','A correlation matrix as numbers'),o('d','A feature importance heatmap')], 'b', 'Pairplots efficiently explore all pairwise relationships.', 9),
  q('Why is data visualisation important in ML?', [o('a','Makes code faster'),o('b','Helps understand data distributions, relationships, and anomalies before modelling'),o('c','Required by all ML libraries'),o('d','Automatically cleans data')], 'b', 'A picture reveals what statistics alone can miss.', 10),
  q('What is a violin plot?', [o('a','A violin-shaped chart'),o('b','A combination of box plot and kernel density estimation'),o('c','A chart for music data'),o('d','A 3D scatter plot')], 'b', 'Violin plots show the full distribution shape, not just quartiles.', 11),
  q('What does the correlation matrix diagonal always contain?', [o('a','Mean of each variable'),o('b','Zeros'),o('c','Ones — perfect self-correlation'),o('d','Variance of each variable')], 'c', 'Every variable is perfectly correlated with itself.', 12),
  q('Which library creates interactive web-based visualisations?', [o('a','Matplotlib'),o('b','Seaborn'),o('c','Plotly'),o('d','NumPy')], 'c', 'Plotly/Dash enables interactive dashboards in Python.', 13),
  q('What is a line chart best used for?', [o('a','Showing data distribution'),o('b','Visualising trends and changes over time or sequential data'),o('c','Comparing categories'),o('d','Showing feature correlation')], 'b', 'Line charts connect data points, emphasising continuity over time.', 14),
],

/* ── Ch 1.5: AI Mini Project Series ─────────────────────────────────────── */
'ch1-5-ai-mini-projects': [
  q('Email feature representation in spam classification?', [o('a','Email hash'),o('b','Bag-of-Words or TF-IDF'),o('c','Binary encoding'),o('d','N-gram sentence embedding')], 'b', 'TF-IDF captures word importance across emails.', 0),
  q('What is the Iris dataset used for?', [o('a','Image classification benchmarking'),o('b','Classic classification: 3 flower species, 4 features'),o('c','Time series forecasting'),o('d','NLP tasks')], 'b', 'Iris is the "Hello World" of supervised classification.', 1),
  q('What is TF-IDF?', [o('a','Total Frequency - Inverse Document Frequency'),o('b','Term Frequency - Inverse Document Frequency (word importance metric)'),o('c','Text Format - Indexed Document File'),o('d','Text Feature - Integration Detection')], 'b', 'TF-IDF downweights very common words like "the".', 2),
  q('In an ML project workflow, what comes FIRST?', [o('a','Model training'),o('b','Hyperparameter tuning'),o('c','Problem definition and data collection'),o('d','Deployment')], 'c', 'Without a clear problem and good data, everything else fails.', 3),
  q('What is a validation set used for?', [o('a','Final model evaluation'),o('b','Tuning hyperparameters without touching the test set'),o('c','Training'),o('d','Collecting more data')], 'b', 'The test set must only be used once — at the very end.', 4),
  q('What is `train_test_split` in scikit-learn for?', [o('a','Splitting features from labels'),o('b','Randomly dividing data into training and testing portions'),o('c','Cross-validating'),o('d','Creating stratified samples')], 'b', 'Typical split: 80% train, 20% test.', 5),
  q('What label convention for spam emails?', [o('a','-1'),o('b','0'),o('c','1'),o('d','Either 0 or 1 depending on convention')], 'd', 'Positive class is typically 1 (spam), but the convention can vary.', 6),
  q('What is a confusion matrix used for?', [o('a','Confusing the model'),o('b','Visualising which predictions were correct and the error types'),o('c','Measuring training speed'),o('d','Plotting decision boundary')], 'b', 'TP, FP, FN, TN in one table tells the full story.', 7),
  q('What does a high F1 score indicate?', [o('a','Model is overfitting'),o('b','Low precision, high recall'),o('c','Good balance of precision and recall'),o('d','Needs more training data')], 'c', 'F1 = harmonic mean of precision and recall.', 8),
  q('Common baseline algorithm for the Iris dataset?', [o('a','Deep neural network'),o('b','KNN or Logistic Regression'),o('c','CNN'),o('d','LSTM')], 'b', 'Always start simple — a strong baseline reveals how much value complex models add.', 9),
  q('What does `model.fit(X_train, y_train)` do?', [o('a','Evaluates on training data'),o('b','Trains the model by learning from features and labels'),o('c','Predicts training labels'),o('d','Saves the model')], 'b', 'fit() updates model parameters to minimise loss.', 10),
  q('What does `model.predict(X_test)` return?', [o('a','Model accuracy'),o('b','Predicted labels or values for test data'),o('c','Only probability scores'),o('d','Training loss history')], 'b', 'predict() runs the forward pass for new samples.', 11),
  q('Best metric for severely imbalanced classes?', [o('a','Accuracy'),o('b','F1 Score or AUC-ROC'),o('c','Mean Squared Error'),o('d','R-squared')], 'b', 'Accuracy is misleading when 99% of data is one class.', 12),
  q('What is feature importance in a Random Forest?', [o('a','Times a feature appears'),o('b','How much each feature contributes to predictions'),o('c','Correlation with target'),o('d','Normalised feature value')], 'b', 'Guides feature selection and provides model interpretability.', 13),
  q('Correct ML project pipeline order?', [o('a','Train→Collect→Evaluate→Deploy'),o('b','Collect→EDA→Preprocess→Train→Evaluate→Deploy'),o('c','Preprocess→Collect→Train→EDA'),o('d','Deploy→Train→Evaluate→Collect')], 'b', 'This sequential workflow is the industry standard.', 14),
],

/* ── Ch 2: ML Core Overview ──────────────────────────────────────────────── */
'ch2-ml-core-overview': [
  q('What is an ensemble method?', [o('a','Training one powerful model'),o('b','Combining multiple models to improve performance'),o('c','Using multiple datasets for one model'),o('d','Combining data from multiple sources')], 'b', 'Ensemble methods reduce variance and/or bias.', 0),
  q('What is bagging (Bootstrap Aggregating)?', [o('a','Training models sequentially correcting errors'),o('b','Training models on random data subsets and averaging predictions'),o('c','Selecting the best single model'),o('d','Reducing dataset by random sampling')], 'b', 'Random Forests are the most famous bagging algorithm.', 1),
  q('Key idea behind boosting (XGBoost)?', [o('a','All models trained simultaneously'),o('b','Sequential training — each model focuses on previous errors'),o('c','Averaging randomly initialised models'),o('d','Feature bagging to reduce variance')], 'b', 'Boosting reduces bias by learning from mistakes iteratively.', 2),
  q('What is a Support Vector Machine (SVM)?', [o('a','A neural network with support layers'),o('b','Algorithm finding the hyperplane maximising the margin between classes'),o('c','A clustering algorithm'),o('d','A dimensionality reduction technique')], 'b', 'SVMs are powerful for small, high-dimensional datasets.', 3),
  q('What is the "kernel trick" in SVMs?', [o('a','Speeds up training'),o('b','Implicitly maps data to higher dimensions where it becomes linearly separable'),o('c','A method to select support vectors'),o('d','A regularisation technique')], 'b', 'RBF kernel is the most popular — maps to infinite dimensions.', 4),
  q('What is Grid Search used for?', [o('a','Searching training data'),o('b','Exhaustive search over a hyperparameter grid for the best combination'),o('c','Finding patterns in image grids'),o('d','Selecting the best feature set')], 'b', 'Grid Search tests every combination — can be slow on large grids.', 5),
  q('What is a scikit-learn Pipeline for?', [o('a','Deploying models'),o('b','Chaining preprocessing + model into one workflow to prevent leakage'),o('c','Creating neural networks'),o('d','Loading data')], 'b', 'Pipelines ensure preprocessing is consistently applied to train and test data.', 6),
  q('What is dimensionality reduction?', [o('a','Reducing dataset size'),o('b','Reducing feature count while preserving important information'),o('c','Simplifying model architecture'),o('d','Reducing training epochs')], 'b', 'Reduces noise, training time, and helps with visualisation.', 7),
  q('What is PCA used for?', [o('a','Classifying high-dimensional data'),o('b','Reducing dimensionality by finding components that maximise variance'),o('c','Predicting continuous values'),o('d','Clustering data')], 'b', 'PCA transforms features into uncorrelated principal components.', 8),
  q('What does "feature selection" mean?', [o('a','Creating new features'),o('b','Choosing the most relevant subset of features'),o('c','Scaling features'),o('d','Encoding features')], 'b', 'Fewer, better features often outperform many weak ones.', 9),
  q('Difference between Grid Search and Random Search?', [o('a','Grid is faster'),o('b','Grid tests all combinations; Random samples randomly (often more efficient)'),o('c','They are identical'),o('d','Random needs GPU; Grid doesn\'t')], 'b', 'Random Search often finds good hyperparameters faster in high-dimensional spaces.', 10),
  q('What is SMOTE used for?', [o('a','Smoothing predictions'),o('b','Oversampling minority classes by generating synthetic samples'),o('c','Selecting features'),o('d','Reducing model complexity')], 'b', 'SMOTE addresses class imbalance by creating new minority-class examples.', 11),
  q('Main advantage of Gradient Boosting over Random Forests?', [o('a','Always faster to train'),o('b','Sequential error correction often achieves better accuracy'),o('c','Requires less data'),o('d','Handles missing values automatically')], 'b', 'GBMs often win ML competitions but require careful tuning.', 12),
  q('What is early stopping in boosting?', [o('a','Stopping after the first iteration'),o('b','Stopping when validation performance stops improving to prevent overfitting'),o('c','Reducing learning rate to zero'),o('d','Stopping when all data is processed')], 'b', 'Early stopping is a simple and effective regularisation strategy.', 13),
  q('What does SHAP provide in classification?', [o('a','Faster training'),o('b','Explanations of individual predictions by assigning feature contribution values'),o('c','Model regularisation'),o('d','Data preprocessing instructions')], 'b', 'SHAP values give both local and global model explanations.', 14),
],

/* ── Ch 3: Deep Learning Overview ───────────────────────────────────────── */
'ch3-deep-learning-overview': [
  q('What is a neural network composed of?', [o('a','Connected decision trees'),o('b','Layers of interconnected nodes with learnable weights'),o('c','Database query graphs'),o('d','Collections of support vectors')], 'b', 'Each neuron computes a weighted sum + activation function.', 0),
  q('What is backpropagation?', [o('a','Training data flowing backward'),o('b','Algorithm computing gradients of the loss with respect to weights via chain rule'),o('c','Reversing predictions'),o('d','Undoing the forward pass')], 'b', 'Backprop enables efficient gradient computation in deep networks.', 1),
  q('What is an activation function?', [o('a','Activates the training process'),o('b','Applied to neuron output to introduce non-linearity'),o('c','Initialises weights'),o('d','Selects which neurons to train')], 'b', 'Without activation functions, deep networks collapse to linear models.', 2),
  q('What is the ReLU activation function?', [o('a','Returns -1 or +1'),o('b','max(0, x) — returns input if positive, 0 otherwise'),o('c','Returns values between 0 and 1'),o('d','Returns the square of input')], 'b', 'ReLU is the most widely used activation — simple and effective.', 3),
  q('What is a CNN designed for?', [o('a','Sequential text data'),o('b','Spatial data like images using convolution to detect features'),o('c','Time series forecasting'),o('d','Tabular classification')], 'b', 'Convolutional layers slide filters to detect local patterns.', 4),
  q('Purpose of pooling layers in CNNs?', [o('a','Add more parameters'),o('b','Reduce spatial dimensions and computational load while retaining key features'),o('c','Apply activation functions'),o('d','Normalise input')], 'b', 'Max pooling keeps the most salient feature in each region.', 5),
  q('What is an RNN designed for?', [o('a','Image data with 2D structure'),o('b','Sequential data where order matters — text, time series'),o('c','Tabular data'),o('d','Static data without temporal dependencies')], 'b', 'RNNs maintain hidden state across the sequence.', 6),
  q('What problem do LSTMs solve?', [o('a','Slow training'),o('b','Vanishing gradient — enabling long-range dependency learning'),o('c','Overfitting on small data'),o('d','Poor image performance')], 'b', 'LSTM gates control what to remember, forget, and output.', 7),
  q('Transformer architecture\'s key innovation?', [o('a','Convolutional filters for sequences'),o('b','Self-attention allowing parallel processing of all positions at once'),o('c','Recurrent processing with gated memory'),o('d','Skip connections between all layers')], 'b', 'Self-attention ended the bottleneck of sequential RNN processing.', 8),
  q('What is a neural network hyperparameter?', [o('a','Network weights'),o('b','Bias values in each layer'),o('c','Learning rate, batch size, number of epochs'),o('d','Output of the activation function')], 'c', 'Hyperparameters are set before training; weights are learned during.', 9),
  q('What does softmax do in the output layer?', [o('a','Converts to binary 0/1'),o('b','Converts raw scores to probabilities summing to 1'),o('c','Applies linear transformation'),o('d','Normalises input')], 'b', 'Softmax is standard for multi-class classification output.', 10),
  q('What is dropout in neural networks?', [o('a','Removing the network and retraining'),o('b','Randomly deactivating neurons during training to prevent overfitting'),o('c','Reducing the learning rate'),o('d','Dropping misclassified examples')], 'b', 'Dropout forces the network to learn redundant representations.', 11),
  q('What does batch normalisation do?', [o('a','Divides data into batches'),o('b','Normalises layer inputs to zero mean/unit variance, stabilising training'),o('c','Normalises final predictions'),o('d','Selects optimal batch size')], 'b', 'Batch norm allows much higher learning rates and reduces sensitivity to initialisation.', 12),
  q('PyTorch is primarily used for?', [o('a','Web development'),o('b','Building and training deep learning models with dynamic computation graphs'),o('c','Database management'),o('d','Data visualisation')], 'b', 'PyTorch\'s eager mode makes debugging much easier than static graphs.', 13),
  q('What is the vanishing gradient problem?', [o('a','Gradients too large — unstable training'),o('b','Gradients become extremely small — early layers can\'t learn'),o('c','Model weights vanishing after training'),o('d','Loss function not converging')], 'b', 'ReLU, LSTMs, and residual connections help mitigate this.', 14),
],

/* ── Ch 4: Generative AI & LLMs Overview ────────────────────────────────── */
'ch4-generative-ai-overview': [
  q('What does LLM stand for?', [o('a','Linear Learning Machine'),o('b','Large Language Model'),o('c','Long Loop Method'),o('d','Layered Learning Module')], 'b', 'LLMs are trained on massive text corpora to understand and generate language.', 0),
  q('Primary training objective of GPT-style models?', [o('a','Image classification'),o('b','Next token prediction'),o('c','Sentiment analysis'),o('d','Named entity recognition')], 'b', 'Predicting the next word across billions of examples creates general language understanding.', 1),
  q('What is prompt engineering?', [o('a','Engineering hardware for LLMs'),o('b','Crafting effective input instructions to guide LLM outputs'),o('c','Fine-tuning model parameters'),o('d','Designing training datasets')], 'b', 'Better prompts dramatically improve LLM output quality without any training.', 2),
  q('What is Retrieval-Augmented Generation (RAG)?', [o('a','Generating data to augment training'),o('b','Combining retrieval with a generative model to ground responses in documents'),o('c','Image augmentation for training'),o('d','Regularisation for LLMs')], 'b', 'RAG reduces hallucinations by grounding the LLM in retrieved facts.', 3),
  q('What is a vector database used for?', [o('a','Traditional relational data'),o('b','Storing and searching high-dimensional vector embeddings — semantic search'),o('c','Training deep learning models'),o('d','Managing GPU memory')], 'b', 'Pinecone, Weaviate, Chroma are popular vector databases.', 4),
  q('What is fine-tuning an LLM?', [o('a','Adjusting the prompt'),o('b','Continuing training on a specific dataset to adapt to a domain'),o('c','Removing unnecessary layers'),o('d','Compressing for deployment')], 'b', 'Fine-tuning customises a foundation model for a specific use case.', 5),
  q('What is tokenisation in LLMs?', [o('a','Encrypted tokens for security'),o('b','Breaking text into subword units the model processes'),o('c','Generating unique user IDs'),o('d','Splitting into paragraphs')], 'b', 'Most LLMs use Byte-Pair Encoding (BPE) for subword tokenisation.', 6),
  q('What is the "context window" of an LLM?', [o('a','The physical monitor'),o('b','Maximum number of tokens the model can process at once'),o('c','The training data window'),o('d','The user interface')], 'b', 'Larger context windows let the model "remember" more of the conversation.', 7),
  q('What is "hallucination" in LLMs?', [o('a','LLMs generating images'),o('b','LLMs confidently generating factually incorrect or made-up information'),o('c','Running at high temperature'),o('d','A training technique for creativity')], 'b', 'Hallucinations are a major challenge for deploying LLMs in high-stakes domains.', 8),
  q('What does "temperature" control in LLM generation?', [o('a','Hardware temperature'),o('b','Randomness/creativity — higher = more random outputs'),o('c','Maximum output length'),o('d','Response speed')], 'b', 'Low temperature (~0.2) gives deterministic answers; high (~1.0) is creative.', 9),
  q('What are embeddings in NLP?', [o('a','Compressed text files'),o('b','Dense vectors capturing semantic meaning of words/sentences'),o('c','Encrypted text'),o('d','A type of attention mechanism')], 'b', 'Semantically similar words have similar embeddings (close in vector space).', 10),
  q('What is RLHF?', [o('a','Robotics training'),o('b','Training LLMs using human preference ratings to align with human values'),o('c','Data collection method'),o('d','Regularisation for LLMs')], 'b', 'RLHF is used to make models like ChatGPT helpful and harmless.', 11),
  q('What differentiates GPT-4 from GPT-3?', [o('a','GPT-4 only works in Python'),o('b','GPT-4 is multimodal (can process images) and generally more capable'),o('c','GPT-3 is better at coding'),o('d','GPT-4 needs less compute')], 'b', 'GPT-4 introduced vision capabilities alongside improved reasoning.', 12),
  q('What is an AI agent in the context of LLMs?', [o('a','A human monitoring the LLM'),o('b','An LLM with tools and memory that autonomously completes multi-step tasks'),o('c','A simplified LLM'),o('d','An AI for agent detection')], 'b', 'Agents can browse the web, write code, and call external APIs.', 13),
  q('What is quantisation in LLM deployment?', [o('a','Measuring tokens generated'),o('b','Reducing model precision (e.g., 16-bit to 4-bit) to cut memory and speed up inference'),o('c','Limited-data training'),o('d','Breaking model across servers')], 'b', '4-bit quantisation can run 70B parameter models on consumer GPUs.', 14),
],

/* ── Ch 5: Robotics Foundations Overview ─────────────────────────────────── */
'ch5-robotics-foundations-overview': [
  q('What is a sensor in a robotics system?', [o('a','A component that moves the robot'),o('b','A device that detects and measures physical properties of the environment'),o('c','The robot\'s CPU'),o('d','The power supply')], 'b', 'Sensors give robots awareness of their environment.', 0),
  q('What is an actuator in robotics?', [o('a','A temperature-detecting sensor'),o('b','A component converting energy into physical motion (motors, servos)'),o('c','A processing chip'),o('d','A wireless module')], 'b', 'Actuators are how robots interact with and affect the physical world.', 1),
  q('What does LiDAR measure?', [o('a','Magnetic field'),o('b','Distance to objects using laser pulses'),o('c','Temperature and humidity'),o('d','Sound waves')], 'b', 'LiDAR creates 3D point clouds for mapping and obstacle detection.', 2),
  q('What does an IMU measure?', [o('a','Internet connectivity'),o('b','Acceleration, orientation, and angular velocity'),o('c','Camera images'),o('d','Distance to obstacles')], 'b', 'IMUs are essential for drones and mobile robots to maintain orientation.', 3),
  q('What does ROS stand for?', [o('a','Robotic Operating System'),o('b','Robot Operating System'),o('c','Robotic Output Service'),o('d','Remote Operation Software')], 'b', 'ROS provides middleware, tools, and libraries for robot development.', 4),
  q('What is forward kinematics?', [o('a','Moving robot forward at maximum speed'),o('b','Computing end-effector position from joint angles'),o('c','Computing joint angles from desired position'),o('d','Controlling forward motion')], 'b', 'FK transforms joint space to Cartesian space.', 5),
  q('What is inverse kinematics?', [o('a','Moving backward through the chain'),o('b','Computing joint angles needed to achieve a desired end-effector position'),o('c','Computing position from joint angles'),o('d','Reversing robot motions')], 'b', 'IK is what robots use to reach a target point in space.', 6),
  q('What is Arduino used for in robotics?', [o('a','High-performance AI compute'),o('b','A microcontroller platform for reading sensors and controlling actuators'),o('c','A cloud platform'),o('d','A mechanical design tool')], 'b', 'Arduino\'s ease of use makes it ideal for robotics prototyping.', 7),
  q('What is a servo motor?', [o('a','A one-direction motor'),o('b','A motor with position feedback for precise angular control'),o('c','A continuously spinning motor'),o('d','An air-powered motor')], 'b', 'Servos are common in robot arms for precise joint control.', 8),
  q('What is odometry in robotics?', [o('a','Study of robot smell'),o('b','Estimating position and orientation using wheel encoder data'),o('c','Optical speed measurement'),o('d','A robot measurement database')], 'b', 'Odometry accumulates position error over time — often combined with other sensors.', 9),
  q('What does DOF (Degrees of Freedom) mean for a robotic arm?', [o('a','Number of sensors'),o('b','Number of independent motions the arm can make'),o('c','Maximum weight it can lift'),o('d','Maximum reach')], 'b', 'A 6-DOF arm can reach any position and orientation in 3D space.', 10),
  q('What does PWM control in robotics?', [o('a','Network packet width'),o('b','Speed and position of motors by varying the duty cycle of a digital signal'),o('c','Power supply frequency'),o('d','Wireless bandwidth')], 'b', 'PWM is how microcontrollers "dim" outputs to control motors and LEDs.', 11),
  q('What is PID control used for?', [o('a','Protecting devices from current spikes'),o('b','A feedback control algorithm (Proportional-Integral-Derivative) to minimise error'),o('c','Inter-device communication protocol'),o('d','Path planning')], 'b', 'PID is the workhorse of industrial and robotics control systems.', 12),
  q('What is SLAM in robotics?', [o('a','Simultaneous Localization And Mapping — building a map while tracking position'),o('b','Sequential Learning And Maneuvering'),o('c','Smart Localization And Mobility'),o('d','Sensor-Less Autonomous Motion')], 'a', 'SLAM is fundamental for autonomous navigation in unknown environments.', 13),
  q('Difference between stepper and DC motor?', [o('a','Steppers are faster'),o('b','Steppers move in precise discrete steps; DC motors spin continuously'),o('c','DC motors use less current'),o('d','Steppers only used in printers')], 'b', 'Stepper motors don\'t need encoders for position control.', 14),
],

/* ── Ch 6: Advanced Robotics + AI Overview ───────────────────────────────── */
'ch6-advanced-robotics-overview': [
  q('What is ROS2 improved over ROS1 for?', [o('a','Better graphics'),o('b','Real-time performance, DDS communication, and multi-robot support'),o('c','Easier Python syntax'),o('d','Lower hardware requirements')], 'b', 'ROS2 uses DDS for reliable, real-time pub-sub communication.', 0),
  q('What is path planning in autonomous robotics?', [o('a','Planning robot manufacturing'),o('b','Finding a collision-free trajectory from start to goal'),o('c','Drawing the robot layout'),o('d','Planning software architecture')], 'b', 'Path planning bridges perception and motion execution.', 1),
  q('What is A* commonly used for?', [o('a','Matrix multiplication'),o('b','Heuristic-based shortest path finding in a graph'),o('c','SLAM'),o('d','Object detection')], 'b', 'A* uses a heuristic to guide search and guarantees the shortest path.', 2),
  q('In ROS, what is a "topic"?', [o('a','Subject of the robot\'s task'),o('b','Named channel for asynchronous message passing between nodes'),o('c','Set of robot parameters'),o('d','Database entry for robot state')], 'b', 'Publishers send to topics; subscribers receive from them.', 3),
  q('Difference between a ROS node and a ROS topic?', [o('a','Nodes are topics with subscriptions'),o('b','Nodes are executable processes; topics are communication channels between them'),o('c','They are the same'),o('d','Topics are nodes that publish')], 'b', 'A camera node publishes images to a /camera/image topic.', 4),
  q('What is an occupancy grid?', [o('a','Grid pattern in robot manufacturing'),o('b','2D map where each cell represents free, occupied, or unknown space'),o('c','Sensor grid on the robot body'),o('d','Task scheduling grid')], 'b', 'Occupancy grids are the standard representation for 2D robot navigation maps.', 5),
  q('What is computer vision used for in robotics?', [o('a','Displaying camera feed'),o('b','Enabling robots to perceive and interpret visual information for navigation and manipulation'),o('c','Storing video'),o('d','Remote operation via video')], 'b', 'Vision-based grasping and navigation are key advanced robotics challenges.', 6),
  q('What is OpenCV primarily used for?', [o('a','Web framework for robotics'),o('b','Real-time computer vision and image processing library'),o('c','Robot simulation'),o('d','Motion planning library')], 'b', 'OpenCV provides thousands of optimised CV algorithms.', 7),
  q('What does `roslaunch` do?', [o('a','Launches ROS to PyPI'),o('b','Starts multiple ROS nodes from a launch file simultaneously'),o('c','Launches a virtual robot'),o('d','Updates ROS packages')], 'b', 'Launch files coordinate complex multi-node system startups.', 8),
  q('What is Gazebo used for?', [o('a','Physical robot controller'),o('b','3D robot simulation environment'),o('c','ROS package manager'),o('d','Computer vision library')], 'b', 'Gazebo simulates physics, sensors, and robot dynamics without real hardware.', 9),
  q('What is AMCL used for?', [o('a','Monte Carlo AI training simulation'),o('b','Probabilistic robot localisation using particle filters'),o('c','Obstacle detection'),o('d','Map building without sensors')], 'b', 'AMCL localises a robot in a known map using laser scan data.', 10),
  q('What is a costmap in navigation?', [o('a','Cost of building the robot'),o('b','Layered map representing traversal costs for path planning'),o('c','Visualisation of sensor costs'),o('d','Budget tracking tool')], 'b', 'Global and local costmaps guide safe path planning and obstacle avoidance.', 11),
  q('What is visual odometry?', [o('a','Measuring visual field of view'),o('b','Estimating robot motion from camera image sequences by tracking features'),o('c','Monitoring camera health'),o('d','Visual debugging in ROS')], 'b', 'VO is used when wheel encoders are unreliable (slippery surfaces, legged robots).', 12),
  q('What is the Nav2 stack in ROS2?', [o('a','2-robot navigation framework'),o('b','Complete autonomous navigation framework for mobile robots'),o('c','Second navigation algorithm version'),o('d','Hardware abstraction layer')], 'b', 'Nav2 handles localisation, mapping, path planning, and obstacle avoidance.', 13),
  q('What is the TF library in ROS used for?', [o('a','TensorFlow integration in ROS'),o('b','Tracking coordinate frame transformations between robot components over time'),o('c','File transfer utility'),o('d','Traffic monitoring for topics')], 'b', 'TF keeps track of all coordinate frames (base_link, map, camera, etc.).', 14),
],

/* ── Ch 7: Production AI Systems Overview ─────────────────────────────────── */
'ch7-production-ai-overview': [
  q('What is MLOps?', [o('a','ML Operators — humans running ML'),o('b','Practices combining ML development and operations to deploy and maintain models reliably'),o('c','A new ML algorithm'),o('d','A Python package')], 'b', 'MLOps applies DevOps principles to the full ML lifecycle.', 0),
  q('What is Docker used for in ML deployment?', [o('a','Training deep learning models'),o('b','Containerising applications with all dependencies for consistent deployment'),o('c','Model performance monitoring'),o('d','Model versioning')], 'b', 'Docker containers run identically on any machine — "works on my machine" eliminated.', 1),
  q('What is a Docker image?', [o('a','A screenshot of Docker'),o('b','A read-only template with application, dependencies, and configuration'),o('c','A running app instance'),o('d','A Docker config file')], 'b', 'Images are built from Dockerfiles and run as containers.', 2),
  q('What is FastAPI used for in ML?', [o('a','Faster ML training'),o('b','Creating high-performance REST APIs for serving ML model predictions'),o('c','Fast data preprocessing'),o('d','GPU acceleration API')], 'b', 'FastAPI auto-generates OpenAPI docs and is async-native.', 3),
  q('What is Kubernetes used for?', [o('a','Training neural networks'),o('b','Orchestrating and scaling containerised applications across clusters'),o('c','Model drift monitoring'),o('d','Model version control')], 'b', 'K8s manages deployment, scaling, and self-healing of containerised services.', 4),
  q('What is model drift?', [o('a','Model moving to different hardware'),o('b','Degradation of model performance as real-world data distribution changes over time'),o('c','Training for too many epochs'),o('d','Random prediction variation')], 'b', 'Models must be retrained periodically to maintain production performance.', 5),
  q('What is a model registry?', [o('a','Government AI database'),o('b','Centralised repository for storing, versioning, and managing trained ML models'),o('c','Python dict of hyperparameters'),o('d','List of available algorithms')], 'b', 'MLflow, Weights & Biases, and SageMaker provide model registries.', 6),
  q('What is A/B testing in model deployment?', [o('a','Testing architectures A and B during training'),o('b','Serving two model versions to different user segments to compare performance'),o('c','Testing on datasets A and B'),o('d','Alphabetical evaluation')], 'b', 'A/B testing validates that a new model version is better before full rollout.', 7),
  q('What does REST API stand for?', [o('a','Reliable Efficient State Transfer'),o('b','Representational State Transfer API'),o('c','Remote Execution State Transfer'),o('d','Real-time Engine State Transfer')], 'b', 'REST APIs use HTTP methods (GET, POST, PUT, DELETE) for resource operations.', 8),
  q('What is the purpose of model monitoring in production?', [o('a','Watching model train in real time'),o('b','Continuously tracking performance, data quality, and detecting drift'),o('c','Monitoring GPU temperatures'),o('d','Reviewing model code for bugs')], 'b', 'Production without monitoring is flying blind.', 9),
  q('What is CI/CD in MLOps?', [o('a','Cloud Infrastructure/Cloud Deployment'),o('b','Continuous Integration/Continuous Deployment — automating testing and deployment pipelines'),o('c','Code Inspection/Documentation'),o('d','Containerised Infrastructure/Container Deployment')], 'b', 'CI/CD ensures code changes are automatically tested and deployed safely.', 10),
  q('What is the purpose of feature stores?', [o('a','A physical shop selling ML features'),o('b','Centralised repository for storing and serving engineered features consistently across training and serving'),o('c','Version control for model code'),o('d','Database of hyperparameters')], 'b', 'Feature stores eliminate training-serving skew — a major production issue.', 11),
  q('What is shadow deployment (shadow mode)?', [o('a','Training in the background'),o('b','Running a new model alongside production without serving its results to users'),o('c','Deploying with reduced functionality'),o('d','NLP deployment technique')], 'b', 'Shadow mode lets you test a new model on real traffic safely.', 12),
  q('What does "model serialisation" mean?', [o('a','Running inference sequentially'),o('b','Saving a trained model\'s parameters and structure to a file'),o('c','Converting to a rule set'),o('d','Queuing training jobs')], 'b', 'Common formats: pickle, ONNX, SavedModel, TorchScript.', 13),
  q('Difference between online and batch inference?', [o('a','Online uses internet; batch is offline'),o('b','Online predicts in real-time per request; batch processes large datasets at once'),o('c','Online more accurate; batch faster'),o('d','They are the same')], 'b', 'Choose based on latency requirements and throughput needs.', 14),
],

/* ── Ch Final: AIRO Master Path ──────────────────────────────────────────── */
'ch-final-airo-master-path': [
  q('Correct AIRO learning progression?', [o('a','Deep Learning→Python→AI→Robotics'),o('b','Computer Fundamentals→Python→AI→ML→Deep Learning→Robotics→Production'),o('c','Robotics→ML→Python→AI'),o('d','Production→Robotics→AI→Python')], 'b', 'The curriculum builds foundational knowledge systematically toward mastery.', 0),
  q('What connects AI decision-making to physical action in a robot?', [o('a','A database'),o('b','Actuators controlled by AI-processed sensor data'),o('c','A neural network directly moving motors'),o('d','A cloud server')], 'b', 'Perception (sensors) → Cognition (AI) → Action (actuators) is the robotics loop.', 1),
  q('Purpose of the AIRO Master Path?', [o('a','Earning government certification'),o('b','Integrating AI, ML, Deep Learning, and Robotics into complete real-world systems'),o('c','Specialising in only one area'),o('d','The fastest AI introduction')], 'b', 'The master path is about systems thinking, not just individual skills.', 2),
  q('Which combination is correct for autonomous robot navigation?', [o('a','LiDAR+GPS+A*+ROS+deep learning perception'),o('b','Only GPS'),o('c','Pure deep learning, no sensors'),o('d','Traditional programming, no AI')], 'a', 'Robust autonomous systems fuse multiple technologies.', 3),
  q('Role of computer vision in an end-to-end robotics system?', [o('a','Storing visual data only'),o('b','Processing camera data for object detection, navigation, and human-robot interaction'),o('c','Decorating the robot\'s appearance'),o('d','Replacing all other sensors')], 'b', 'Vision is often the richest sensor — central to intelligent robotics.', 4),
  q('Complete ML pipeline for production?', [o('a','Just train and save'),o('b','Collect→Preprocess→Train→Evaluate→Package→Deploy→Monitor'),o('c','Train→Deploy (two steps)'),o('d','Download pretrained and use directly')], 'b', 'Skipping any step leads to unreliable production systems.', 5),
  q('Skill set required for AIRO Master level?', [o('a','Python only'),o('b','Python+ML+Deep Learning+ROS+MLOps+system integration'),o('c','Hardware engineering only'),o('d','Cloud computing only')], 'b', 'Multidisciplinary expertise defines the AIRO Master.', 6),
  q('What does "end-to-end AI system" mean?', [o('a','A system that stops after training'),o('b','Complete system from raw data to deployed predictions in production'),o('c','A system with a beginning and end in the codebase'),o('d','A neural network with end-to-end connections')], 'b', 'End-to-end systems cover the full lifecycle, not just the model.', 7),
  q('What is a digital twin in AI robotics?', [o('a','Two identical robots'),o('b','Virtual simulation of a physical robot/system for testing before real deployment'),o('c','A backup AI model'),o('d','Twin processor for redundancy')], 'b', 'Digital twins save time and cost by validating before physical deployment.', 8),
  q('Significance of edge AI in the AIRO context?', [o('a','AI only at dataset edges'),o('b','Running AI inference on robotic hardware for low-latency, offline operation'),o('c','AI processing edge cases'),o('d','A graph neural network technique')], 'b', 'Edge AI is essential for real-time robotics where cloud latency is unacceptable.', 9),
  q('Difference between research prototype and production AI system?', [o('a','Prototypes are more accurate'),o('b','Production requires reliability, scalability, monitoring, and maintenance that prototypes don\'t'),o('c','Production uses simpler algorithms'),o('d','No meaningful difference')], 'b', 'Engineering a prototype vs a production system are fundamentally different challenges.', 10),
  q('Complete modern AI robotics technology stack?', [o('a','Python+PyTorch+ROS2+Docker+Kubernetes+monitoring tools'),o('b','Only Arduino and sensors'),o('c','Just GPT-4 API calls'),o('d','Excel for data management')], 'a', 'This stack covers data, AI, robotics middleware, and deployment.', 11),
  q('Highest priority skill for an AIRO graduate?', [o('a','Memorising ML algorithms'),o('b','Building complete systems — integrating data, models, hardware, and deployment'),o('c','Theoretical maths only'),o('d','Knowing the most languages')], 'b', 'Systems builders create real value; algorithm memorisers do not.', 12),
  q('What is responsible AI development?', [o('a','Bug-free AI code'),o('b','Building AI systems that are fair, transparent, safe, and aligned with human values'),o('c','Using AI only for profit'),o('d','Developing AI faster than competitors')], 'b', 'Responsible AI is not optional — it is a professional and ethical obligation.', 13),
  q('What marks completion of the AIRO Master Path?', [o('a','Passing a written exam'),o('b','Successfully designing, building, and deploying a complete AI+Robotics system'),o('c','Reading all course material'),o('d','Earning the highest XP score')], 'b', 'Hands-on systems mastery — not memorisation — defines the AIRO graduate.', 14),
],

}; // end QUIZZES

/* ═══════════════════════════════════════════════════════════════════════════
   Main seed logic
═══════════════════════════════════════════════════════════════════════════ */
async function main() {
  console.log('\n📝 Expanding quizzes to 15 questions each (passing score: 10/15 = 67%)...\n');

  for (const [slug, questions] of Object.entries(QUIZZES)) {
    const chapter = await prisma.chapter.findFirst({
      where: { slug },
      include: { quizzes: true },
    });

    if (!chapter || !chapter.quizzes[0]) {
      console.log(`⚠  Skipping ${slug} — chapter or quiz not found`);
      continue;
    }

    const quizId = chapter.quizzes[0].id;

    // Replace existing questions
    await prisma.question.deleteMany({ where: { quizId } });
    await prisma.question.createMany({
      data: questions.map(q => ({ ...q, quizId })),
    });

    // Update quiz config: 67% passing score, 30-minute time limit (1800 s)
    await prisma.quiz.update({
      where: { id: quizId },
      data: { passingScore: 67, timeLimit: 1800 },
    });

    console.log(`✅  ${slug} → 15 questions, passingScore=67, timeLimit=30min`);
  }

  console.log('\n🎉 All quizzes expanded to 15 questions!\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());
