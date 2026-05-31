/**
 * Seed: NOOB Level Test for Data Analytics course
 * 30 MCQs covering the entire NOOB tier syllabus
 * Scoring: +3 correct, -1 wrong → passing = 60 / 90
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const QUESTIONS: Array<{
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  orderIndex: number;
}> = [
  // ── Data Concepts ────────────────────────────────────────────────────────
  {
    orderIndex: 1,
    topic: 'Data Concepts',
    text: 'Which of the following best describes structured data?',
    options: [
      'Data stored in rows and columns with a defined schema',
      'Images and audio files stored in binary format',
      'Social media posts without any organisation',
      'Random sensor readings with no labels',
    ],
    correctAnswer: 'Data stored in rows and columns with a defined schema',
    explanation:
      'Structured data is organised into a fixed format — typically rows and columns — such as a relational database table or a CSV file.',
  },
  {
    orderIndex: 2,
    topic: 'Data Concepts',
    text: 'What is the difference between qualitative and quantitative data?',
    options: [
      'Qualitative data describes categories or qualities; quantitative data is numerical',
      'Qualitative data is always collected by surveys; quantitative data comes from sensors',
      'Qualitative data has more rows; quantitative data has more columns',
      'There is no difference — the terms are interchangeable',
    ],
    correctAnswer:
      'Qualitative data describes categories or qualities; quantitative data is numerical',
    explanation:
      'Qualitative (categorical) data represents labels or groups (e.g., colours, gender). Quantitative data represents measurable numeric values (e.g., height, salary).',
  },
  {
    orderIndex: 3,
    topic: 'Data Concepts',
    text: 'A dataset has a column "Customer_ID" with values 1001, 1002, 1003. This is an example of:',
    options: ['Nominal data', 'Ordinal data', 'Ratio data', 'Interval data'],
    correctAnswer: 'Nominal data',
    explanation:
      'Although stored as numbers, Customer_IDs are labels with no meaningful order or arithmetic — they are nominal categorical data.',
  },

  // ── Excel / Spreadsheets ─────────────────────────────────────────────────
  {
    orderIndex: 4,
    topic: 'Excel',
    text: 'Which Excel function returns the number of cells in a range that meet a condition?',
    options: ['SUMIF', 'COUNTIF', 'AVERAGEIF', 'VLOOKUP'],
    correctAnswer: 'COUNTIF',
    explanation:
      'COUNTIF counts all cells in a range that satisfy a given criterion, e.g. =COUNTIF(A1:A10, ">100").',
  },
  {
    orderIndex: 5,
    topic: 'Excel',
    text: 'In Excel, what does a PivotTable primarily help you do?',
    options: [
      'Summarise and cross-tabulate large datasets interactively',
      'Create animated charts',
      'Connect to live databases in real time',
      'Write VBA macros automatically',
    ],
    correctAnswer: 'Summarise and cross-tabulate large datasets interactively',
    explanation:
      'PivotTables let you drag fields to rows, columns, and values areas to instantly aggregate and explore data without formulas.',
  },

  // ── SQL ──────────────────────────────────────────────────────────────────
  {
    orderIndex: 6,
    topic: 'SQL',
    text: 'Which SQL clause is used to filter rows AFTER aggregation?',
    options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
    correctAnswer: 'HAVING',
    explanation:
      'WHERE filters rows before aggregation; HAVING filters the aggregated groups, e.g. HAVING COUNT(*) > 5.',
  },
  {
    orderIndex: 7,
    topic: 'SQL',
    text: 'What does a LEFT JOIN return?',
    options: [
      'All rows from the left table and matching rows from the right; NULLs where no match',
      'Only rows that exist in both tables',
      'All rows from the right table and matching rows from the left',
      'A Cartesian product of both tables',
    ],
    correctAnswer:
      'All rows from the left table and matching rows from the right; NULLs where no match',
    explanation:
      'LEFT JOIN preserves every row from the left table. If no match exists in the right table, NULL values fill the right-side columns.',
  },
  {
    orderIndex: 8,
    topic: 'SQL',
    text: 'Which aggregate function computes the arithmetic average of a column?',
    options: ['SUM()', 'COUNT()', 'AVG()', 'MAX()'],
    correctAnswer: 'AVG()',
    explanation: 'AVG() returns the arithmetic mean of non-NULL values in the specified column.',
  },

  // ── Python Basics ────────────────────────────────────────────────────────
  {
    orderIndex: 9,
    topic: 'Python',
    text: 'What is the output of: `type([1, 2, 3])`?',
    options: ["<class 'list'>", "<class 'tuple'>", "<class 'array'>", "<class 'dict'>"],
    correctAnswer: "<class 'list'>",
    explanation:
      'Square brackets create a Python list. type() returns the class of the object — <class \'list\'>.',
  },
  {
    orderIndex: 10,
    topic: 'Python',
    text: 'Which built-in Python function returns the number of elements in a list?',
    options: ['count()', 'size()', 'len()', 'length()'],
    correctAnswer: 'len()',
    explanation:
      'len() returns the number of items in any sequence or collection — lists, tuples, strings, dicts, etc.',
  },
  {
    orderIndex: 11,
    topic: 'Python',
    text: 'What does the following code print?\n```\nx = [1, 2, 3, 4, 5]\nprint(x[1:3])\n```',
    options: ['[2, 3]', '[1, 2, 3]', '[2, 3, 4]', '[1, 2]'],
    correctAnswer: '[2, 3]',
    explanation:
      'Python slicing x[1:3] returns elements at index 1 and 2 (3 is exclusive), giving [2, 3].',
  },

  // ── Pandas ───────────────────────────────────────────────────────────────
  {
    orderIndex: 12,
    topic: 'Pandas',
    text: 'How do you read a CSV file into a Pandas DataFrame?',
    options: [
      'pd.read_csv("file.csv")',
      'pd.open("file.csv")',
      'pd.load_csv("file.csv")',
      'DataFrame.read("file.csv")',
    ],
    correctAnswer: 'pd.read_csv("file.csv")',
    explanation:
      'pd.read_csv() is the standard Pandas function for loading comma-separated files into a DataFrame.',
  },
  {
    orderIndex: 13,
    topic: 'Pandas',
    text: 'What does `df.groupby("Category")["Sales"].sum()` return?',
    options: [
      'Total Sales summed per unique Category value',
      'A list of all Sales values',
      'The average Sales for each category',
      'The number of rows in each category',
    ],
    correctAnswer: 'Total Sales summed per unique Category value',
    explanation:
      'groupby splits the DataFrame by Category, then .sum() aggregates the Sales column within each group.',
  },
  {
    orderIndex: 14,
    topic: 'Pandas',
    text: 'Which method gives a quick statistical summary (count, mean, std, min, max) of numeric columns?',
    options: ['df.info()', 'df.head()', 'df.describe()', 'df.shape'],
    correctAnswer: 'df.describe()',
    explanation:
      'df.describe() outputs descriptive statistics for all numeric columns, including count, mean, std, min, quartiles, and max.',
  },
  {
    orderIndex: 15,
    topic: 'Pandas',
    text: 'How do you drop rows where any column has a missing value in a Pandas DataFrame?',
    options: [
      'df.dropna()',
      'df.remove_nulls()',
      'df.fillna(0)',
      'df.drop_missing()',
    ],
    correctAnswer: 'df.dropna()',
    explanation:
      'df.dropna() removes all rows that contain at least one NaN. df.fillna(0) replaces missing values with 0 instead of removing rows.',
  },

  // ── NumPy ────────────────────────────────────────────────────────────────
  {
    orderIndex: 16,
    topic: 'NumPy',
    text: 'What is the key advantage of a NumPy array over a Python list for numeric computations?',
    options: [
      'NumPy arrays use vectorised C-level operations, making them much faster',
      'NumPy arrays can hold elements of mixed types',
      'NumPy arrays support string slicing natively',
      'NumPy arrays are identical to Python lists in performance',
    ],
    correctAnswer: 'NumPy arrays use vectorised C-level operations, making them much faster',
    explanation:
      'NumPy operates on entire arrays at once using compiled C code, avoiding Python\'s slow per-element loops.',
  },
  {
    orderIndex: 17,
    topic: 'NumPy',
    text: 'What does `np.zeros((3, 4))` create?',
    options: [
      'A 3×4 array filled with 0.0',
      'A 1D array with 3 zeros followed by 4 zeros',
      'A 4×3 array filled with ones',
      'An empty array with 3 rows and 4 columns',
    ],
    correctAnswer: 'A 3×4 array filled with 0.0',
    explanation:
      'np.zeros(shape) creates an array of the given shape initialised to floating-point zero.',
  },

  // ── EDA ──────────────────────────────────────────────────────────────────
  {
    orderIndex: 18,
    topic: 'EDA',
    text: 'Which plot is best suited for understanding the distribution of a single continuous variable?',
    options: ['Scatter plot', 'Bar chart', 'Histogram', 'Pie chart'],
    correctAnswer: 'Histogram',
    explanation:
      'A histogram divides the value range into bins and shows how many observations fall in each bin, revealing the shape of the distribution.',
  },
  {
    orderIndex: 19,
    topic: 'EDA',
    text: 'In exploratory data analysis, what does a correlation matrix reveal?',
    options: [
      'Pairwise linear relationships between numeric variables',
      'The causal direction between two variables',
      'The number of outliers in each column',
      'The most frequent category in each column',
    ],
    correctAnswer: 'Pairwise linear relationships between numeric variables',
    explanation:
      'A correlation matrix shows the Pearson (or other) correlation coefficients between every pair of numeric columns, ranging from -1 (perfect negative) to +1 (perfect positive).',
  },

  // ── Statistics ───────────────────────────────────────────────────────────
  {
    orderIndex: 20,
    topic: 'Statistics',
    text: 'If a dataset has values [2, 2, 3, 7, 10], what is the median?',
    options: ['2', '3', '4.8', '7'],
    correctAnswer: '3',
    explanation:
      'Sorting: [2, 2, 3, 7, 10]. With 5 values, the median is the 3rd value = 3.',
  },
  {
    orderIndex: 21,
    topic: 'Statistics',
    text: 'Standard deviation measures:',
    options: [
      'The average distance of data points from the mean',
      'The difference between the maximum and minimum values',
      'The middle value of the dataset',
      'The most frequently occurring value',
    ],
    correctAnswer: 'The average distance of data points from the mean',
    explanation:
      'Standard deviation (σ) is the square root of variance — it quantifies how spread out values are around the mean.',
  },

  // ── Data Visualisation ───────────────────────────────────────────────────
  {
    orderIndex: 22,
    topic: 'Visualisation',
    text: 'Which chart type is most appropriate for showing a trend over time?',
    options: ['Pie chart', 'Line chart', 'Box plot', 'Heatmap'],
    correctAnswer: 'Line chart',
    explanation:
      'Line charts connect data points in chronological order, making trends, seasonality, and patterns over time immediately visible.',
  },
  {
    orderIndex: 23,
    topic: 'Visualisation',
    text: 'Which Matplotlib function adds a label to the x-axis?',
    options: ['plt.title()', 'plt.xlabel()', 'plt.legend()', 'plt.ylabel()'],
    correctAnswer: 'plt.xlabel()',
    explanation:
      'plt.xlabel("label") sets the label for the horizontal (x) axis. plt.ylabel() sets the vertical axis label.',
  },

  // ── BI Tools ─────────────────────────────────────────────────────────────
  {
    orderIndex: 24,
    topic: 'BI Tools',
    text: 'In Power BI or Tableau, what is a "measure"?',
    options: [
      'A calculated aggregation (e.g., SUM, AVG) applied to a field',
      'A static dimension column from the source table',
      'A visual filter applied to a chart',
      'A type of chart such as a bar or line chart',
    ],
    correctAnswer: 'A calculated aggregation (e.g., SUM, AVG) applied to a field',
    explanation:
      'Measures are dynamic calculations that aggregate data (sum, average, count, etc.) and change based on filters and slicers.',
  },

  // ── APIs & Data Collection ────────────────────────────────────────────────
  {
    orderIndex: 25,
    topic: 'APIs',
    text: 'What does a 404 HTTP status code mean when calling an API?',
    options: [
      'The requested resource was not found',
      'The server encountered an internal error',
      'The request was successful',
      'The user is not authorised',
    ],
    correctAnswer: 'The requested resource was not found',
    explanation:
      '404 Not Found means the server cannot find the requested endpoint or resource. 200 = success; 401/403 = auth issues; 500 = server error.',
  },
  {
    orderIndex: 26,
    topic: 'APIs',
    text: 'Which Python library is commonly used to make HTTP requests to web APIs?',
    options: ['requests', 'flask', 'django', 'socket'],
    correctAnswer: 'requests',
    explanation:
      'The `requests` library provides a simple, human-friendly interface for making HTTP GET, POST, and other requests to REST APIs.',
  },

  // ── Git ───────────────────────────────────────────────────────────────────
  {
    orderIndex: 27,
    topic: 'Git',
    text: 'What does `git commit -m "message"` do?',
    options: [
      'Saves a snapshot of staged changes to the local repository history',
      'Uploads all local changes to GitHub',
      'Creates a new branch named "message"',
      'Reverts the last commit',
    ],
    correctAnswer: 'Saves a snapshot of staged changes to the local repository history',
    explanation:
      'git commit records staged changes as a new commit in the local history. git push sends commits to a remote repository.',
  },

  // ── Ethics & Privacy ─────────────────────────────────────────────────────
  {
    orderIndex: 28,
    topic: 'Ethics',
    text: 'What is "data anonymisation"?',
    options: [
      'Removing or transforming personally identifiable information so individuals cannot be identified',
      'Encrypting data with a private key',
      'Deleting all rows with missing values',
      'Compressing data to reduce file size',
    ],
    correctAnswer:
      'Removing or transforming personally identifiable information so individuals cannot be identified',
    explanation:
      'Anonymisation techniques (e.g., masking, generalisation, k-anonymity) strip or obscure PII so the dataset cannot be linked back to a specific person.',
  },

  // ── Regression / ML Intro ────────────────────────────────────────────────
  {
    orderIndex: 29,
    topic: 'Regression',
    text: 'In linear regression, what does the R² (coefficient of determination) value represent?',
    options: [
      'The proportion of variance in the dependent variable explained by the model',
      'The slope of the regression line',
      'The number of features used in the model',
      'The mean squared error of predictions',
    ],
    correctAnswer:
      'The proportion of variance in the dependent variable explained by the model',
    explanation:
      'R² ranges from 0 to 1. An R² of 0.85 means the model explains 85% of the variability in the target variable.',
  },

  // ── Storytelling with Data ────────────────────────────────────────────────
  {
    orderIndex: 30,
    topic: 'Storytelling',
    text: 'Which of the following is the MOST important principle when presenting data insights to a non-technical audience?',
    options: [
      'Lead with the key finding and support it with simple, clear visuals',
      'Show as many charts as possible to demonstrate thoroughness',
      'Include all statistical tests and p-values for credibility',
      'Use the most complex chart type to look professional',
    ],
    correctAnswer: 'Lead with the key finding and support it with simple, clear visuals',
    explanation:
      'Non-technical audiences need clarity over completeness. Start with the headline insight, then provide only the supporting evidence that aids understanding.',
  },
];

async function main() {
  console.log('🌱 Seeding NOOB Level Test for Data Analytics…');

  // Find the Data Analytics course
  const course = await prisma.course.findUnique({ where: { slug: 'data-analytics' } });
  if (!course) {
    console.error('❌ Course "data-analytics" not found. Run the main seed first.');
    process.exit(1);
  }

  // Upsert the level test
  const existing = await prisma.levelTest.findUnique({
    where: { courseId_tier: { courseId: course.id, tier: 'NOOB' } },
  });

  if (existing) {
    console.log('ℹ️  NOOB Level Test already exists — skipping.');
    await prisma.$disconnect();
    return;
  }

  const levelTest = await prisma.levelTest.create({
    data: {
      courseId: course.id,
      tier: 'NOOB',
      title: 'NOOB Level Test — Data Analytics',
      description:
        'The final gate to leave the NOOB tier. 30 questions covering Data Concepts, Excel, SQL, Python, Pandas, NumPy, EDA, Statistics, Visualisation, BI Tools, APIs, Git, Ethics, Regression, and Storytelling. Score 60+ out of 90 to advance.',
      timeLimit: 3600,
      passingScore: 60,
      xpReward: 500,
    },
  });

  // Seed questions
  for (const q of QUESTIONS) {
    await prisma.levelTestQuestion.create({
      data: {
        levelTestId: levelTest.id,
        text: q.text,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        topic: q.topic,
        orderIndex: q.orderIndex,
      },
    });
  }

  console.log(`✅ Created NOOB Level Test with ${QUESTIONS.length} questions.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
