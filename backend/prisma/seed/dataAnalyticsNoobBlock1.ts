/**
 * dataAnalyticsNoobBlock1.ts
 * Noob Level — Block 1 (Chapters 1–4)
 *
 * Covers:
 *   Ch 1 — Data Concepts Fundamentals
 *   Ch 2 — Excel & Google Sheets Basics
 *   Ch 3 — Excel Pivot Tables & Charts
 *   Ch 4 — SQL Basics: SELECT, WHERE, ORDER BY, LIMIT
 *
 * Also re-indexes existing chapters so NOOB stays 0-99,
 * AMATEUR 100-199, PRO 200-299, MASTER 300-399, GOD 400-499.
 *
 * Run:  cd backend && npm run seed:da-noob-b1
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function q(
  text: string,
  options: { id: string; text: string }[],
  correctAnswer: string,
  explanation: string,
  orderIndex: number,
) {
  return { text, options: JSON.stringify(options), correctAnswer, explanation, orderIndex };
}

const COURSE_SLUG = 'data-analytics';

// ─── New Noob chapters ────────────────────────────────────────────────────────
const CHAPTERS = [

  // ══════════════════════════════════════════════
  // CHAPTER 1 — DATA CONCEPTS FUNDAMENTALS
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-1-data-concepts',
    title:       'Data Concepts Fundamentals',
    description: 'Rows, columns, tables, structured vs unstructured data, databases, CSV files, and the five essential data types every analyst must know cold.',
    orderIndex:  1,
    xpReward:    60,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    codeExample: `# ── Exploring a CSV file with Python ───────────────────────────────
# Even before learning Pandas properly, you can see data concepts
# in action with just the built-in csv module.

import csv

# Imagine this is our sales.csv file:
# name,     category,  price, quantity, in_stock
# Laptop,   Electronics, 999,  15,      True
# T-Shirt,  Clothing,    29,    200,    True
# Headphones, Electronics, 149, 50,    False

rows = [
    {"name": "Laptop",     "category": "Electronics", "price": 999,  "quantity": 15,  "in_stock": True},
    {"name": "T-Shirt",    "category": "Clothing",    "price": 29,   "quantity": 200, "in_stock": True},
    {"name": "Headphones", "category": "Electronics", "price": 149,  "quantity": 50,  "in_stock": False},
    {"name": "Notebook",   "category": "Stationery",  "price": 5,    "quantity": 500, "in_stock": True},
]

# Each dict = one ROW.  Keys = COLUMN names.
print(f"Total rows    : {len(rows)}")
print(f"Column names  : {list(rows[0].keys())}")
print()

# Data types in action
for row in rows:
    name     = row["name"]          # TEXT  (str)
    price    = row["price"]         # NUMBER (int / float)
    in_stock = row["in_stock"]      # BOOLEAN
    print(f"  {name:<15} price=\${price:<6}  in_stock={in_stock}")

# Structured data: every row has the SAME columns — easy to query!
electronics = [r for r in rows if r["category"] == "Electronics"]
print(f"\\nElectronics products: {len(electronics)}")`,
    content: `# Chapter 1 — Data Concepts Fundamentals

## 🎯 What You'll Learn
By the end of this chapter you will understand what rows, columns, and tables are; the difference between structured, semi-structured, and unstructured data; what a database is and why it matters; how CSV and Excel files work; and the five core data types you will encounter every day as a data analyst.

---

## 1. The Building Blocks: Rows, Columns & Tables

Everything in data analytics starts with a **table** — the most fundamental way to organise data.

### Anatomy of a Table

\`\`\`
┌──────────────┬─────────────┬───────┬──────────┐
│ name         │ category    │ price │ quantity │   ← HEADER ROW (column names)
├──────────────┼─────────────┼───────┼──────────┤
│ Laptop       │ Electronics │  999  │    15    │   ← ROW 1
│ T-Shirt      │ Clothing    │   29  │   200    │   ← ROW 2
│ Headphones   │ Electronics │  149  │    50    │   ← ROW 3
└──────────────┴─────────────┴───────┴──────────┘
       ↑               ↑        ↑        ↑
     COLUMN          COLUMN   COLUMN   COLUMN
\`\`\`

| Term | Also called | Meaning |
|------|------------|---------|
| **Row** | Record, Observation, Entry | One complete item of data |
| **Column** | Field, Variable, Attribute | One property of every item |
| **Table** | Dataset, Spreadsheet, Relation | The full collection |
| **Cell** | — | The intersection of one row and one column |

> 💡 **Real-world translation:** In a customer database, each **row** is one customer; each **column** is a property of that customer (name, email, country, signup date).

### Why This Matters
Every tool you'll use — Excel, SQL, Pandas, Power BI — works with rows and columns. If you understand this model, you understand 60% of data analytics.

---

## 2. Structured vs Unstructured vs Semi-Structured Data

Data does not always come in neat tables. Knowing the type determines how you work with it.

### Structured Data
Organised into rows and columns with a fixed schema. Easy to query with SQL or load into Pandas.

**Examples:**
- SQL database tables (customers, orders, products)
- CSV files (comma-separated values)
- Excel spreadsheets
- Google Sheets

\`\`\`
id, name,    email,              country
1,  Alice,   alice@example.com,  India
2,  Bob,     bob@example.com,    USA
\`\`\`

### Semi-Structured Data
Has some organisation (like tags or key-value pairs) but is not in strict rows and columns.

**Examples:**
- JSON (from APIs)
- XML files
- Log files

\`\`\`json
{
  "order_id": 1042,
  "customer": { "name": "Alice", "country": "India" },
  "items": [
    { "product": "Laptop", "qty": 1, "price": 999 }
  ]
}
\`\`\`

### Unstructured Data
No predefined format. Requires special techniques (NLP, computer vision) to analyse.

**Examples:**
- Text documents, emails, PDFs
- Images and videos
- Audio recordings
- Social media posts

> 📊 **Industry fact:** Around 80% of all data created globally is unstructured. Structured data (what beginners work with) is the well-organised 20% — but it drives most business decisions.

### Quick Comparison

| Feature | Structured | Semi-Structured | Unstructured |
|---------|-----------|----------------|-------------|
| Format | Rows & columns | Key-value, nested | Free-form |
| Tool | SQL, Excel, Pandas | JSON parsers, Python | NLP, CV models |
| Difficulty | ⭐ Beginner | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced |
| Example | CSV file | API JSON response | Customer email |

---

## 3. What is a Database?

A **database** is an organised system for storing, managing, and retrieving data efficiently.

Think of it like a digital filing cabinet with superpowers:
- Can store millions of rows instantly
- Can search and filter in milliseconds
- Can handle many users accessing it simultaneously
- Prevents data loss with backups and transactions

### Types of Databases

**Relational Databases (most common):**
Store data in related tables, queried with SQL.
- MySQL
- PostgreSQL
- SQLite (lightweight, great for learning)
- Microsoft SQL Server

**Non-Relational (NoSQL):**
Store data in documents, graphs, or key-value pairs.
- MongoDB (documents — like JSON)
- Redis (key-value — for caching)

> 🎯 **For beginners:** Focus on relational databases and SQL. That is what 90% of analyst job postings require.

---

## 4. CSV and Excel Files — Your First Data Formats

### CSV (Comma-Separated Values)

A plain text file where:
- Each line is one row
- Values are separated by commas
- The first line is usually the header

\`\`\`csv
name,age,city,salary
Alice,29,Mumbai,72000
Bob,34,Delhi,95000
Charlie,27,Bangalore,68000
\`\`\`

**Why analysts love CSV:**
- Opens in any tool (Excel, Python, SQL, R, Google Sheets)
- Lightweight — a 1 million row CSV is just a few hundred MB
- Universal — every database can export to CSV

**Limitations:**
- No formulas (unlike Excel)
- No multiple sheets
- Large files can be slow to open manually

### Excel Files (.xlsx)

Excel is a spreadsheet application (Microsoft). Unlike CSV:
- Multiple sheets in one file
- Can store formulas (=SUM, =VLOOKUP)
- Supports charts, pivot tables, formatting
- File size is larger

> 🔑 **Rule of thumb:** CSV for data storage and transfer; Excel for interactive analysis and reports.

---

## 5. The Five Core Data Types

Every column in a dataset has a data type. Understanding types is essential because the wrong type causes silent errors (e.g., summing a column of text gives "0", not an error).

### Type 1: Numbers (Numeric)

Used for anything you might do maths on.

| Subtype | Description | Example |
|---------|-------------|---------|
| **Integer** | Whole numbers only | age = 29, quantity = 150 |
| **Float / Decimal** | Numbers with decimal places | price = 9.99, score = 7.5 |

\`\`\`python
age      = 29        # int — can count, sum, average
price    = 9.99      # float — can do money calculations
quantity = 500       # int — can aggregate
\`\`\`

### Type 2: Text (String)

Used for names, descriptions, categories — anything you read, not calculate.

\`\`\`python
customer_name = "Alice Johnson"
city          = "Mumbai"
product_code  = "SKU-1042"   # Looks like a number but it's a label — TEXT
\`\`\`

> ⚠️ **Common mistake:** Phone numbers and ZIP codes look like numbers but should be stored as text. You never add two phone numbers together!

### Type 3: Dates & Timestamps

Used for time-based analysis — trends, seasonality, time-to-event.

\`\`\`python
signup_date = "2024-03-15"          # DATE  (year-month-day)
order_time  = "2024-03-15 14:32:00" # DATETIME
\`\`\`

With dates you can:
- Calculate how many days between two dates
- Extract the year, month, weekday
- Group sales by month to find trends
- Calculate customer lifetime (signup to today)

### Type 4: Boolean (True / False)

Used for binary states — yes/no, on/off, active/inactive.

\`\`\`python
is_active        = True
has_paid         = False
email_verified   = True
in_stock         = False
\`\`\`

Boolean columns are perfect for filtering:
- "Show only active customers" → \`WHERE is_active = TRUE\`
- "Show items in stock" → \`WHERE in_stock = TRUE\`

### Type 5: Categorical (Limited Set of Labels)

A special text type where the possible values are limited and known.

\`\`\`python
gender      = "Female"          # Male / Female / Other
order_status = "Shipped"        # Pending / Processing / Shipped / Delivered / Cancelled
rating      = "Excellent"       # Poor / Average / Good / Excellent
\`\`\`

Categorical columns are great for:
- Grouping (sales by region)
- Filtering (orders by status)
- Counting (how many per category)

---

## 6. Putting It All Together — Reading a Real Dataset

Here is a sample dataset. Practice identifying each concept:

| order_id | customer | product | category | price | qty | order_date | paid |
|----------|----------|---------|----------|-------|-----|------------|------|
| 1001 | Alice | Laptop | Electronics | 999.00 | 1 | 2024-01-15 | True |
| 1002 | Bob | T-Shirt | Clothing | 29.99 | 3 | 2024-01-16 | True |
| 1003 | Charlie | Headphones | Electronics | 149.00 | 2 | 2024-01-16 | False |

**Answers:**
- Rows: 3 (one per order)
- Columns: 8
- Numeric columns: price, qty
- Text columns: customer, product, category
- Date column: order_date
- Boolean column: paid
- Categorical column: category (limited to Electronics / Clothing / etc.)

> 🏁 **You're ready for Chapter 2.** Understanding data structure is the invisible foundation that makes everything else click.`,
    questions: [
      q('In a data table, what does a single ROW represent?',
        [{ id: 'a', text: 'A property shared by all items (e.g., "price")' }, { id: 'b', text: 'One complete record or observation (e.g., one customer)' }, { id: 'c', text: 'The header line at the top of the table' }, { id: 'd', text: 'A calculated summary value' }],
        'b', 'A row (also called a record or observation) represents one complete entity — one customer, one order, one product. Each column describes a different property of that entity.', 0),
      q('Which of the following is an example of STRUCTURED data?',
        [{ id: 'a', text: 'A folder of customer support emails' }, { id: 'b', text: 'A video recording of a sales presentation' }, { id: 'c', text: 'A CSV file with columns: customer_id, name, email, country' }, { id: 'd', text: 'A JSON API response with nested arrays' }],
        'c', 'Structured data has a fixed schema — every row has the same columns with predictable types. A CSV file with consistent columns is the classic example of structured data.', 1),
      q('What type of data is a JSON API response with nested fields?',
        [{ id: 'a', text: 'Structured' }, { id: 'b', text: 'Semi-structured' }, { id: 'c', text: 'Unstructured' }, { id: 'd', text: 'Boolean' }],
        'b', 'JSON has some organisation (key-value pairs, nested objects, arrays) but is not in strict rows-and-columns format. It falls in the semi-structured category.', 2),
      q('A column named "phone_number" contains values like "9876543210". What data type should this be?',
        [{ id: 'a', text: 'Integer — it contains only digits' }, { id: 'b', text: 'Float — phone numbers can have decimal points' }, { id: 'c', text: 'Text/String — phone numbers are identifiers, not quantities to calculate' }, { id: 'd', text: 'Boolean — either a phone exists or it does not' }],
        'c', 'Phone numbers should be stored as Text even though they contain digits. You never add two phone numbers or calculate the average — they are labels. Storing as integer would also lose leading zeros (e.g., 0800...).', 3),
      q('What is the main advantage of a relational database over a simple CSV file?',
        [{ id: 'a', text: 'CSV files cannot store text — only numbers' }, { id: 'b', text: 'Databases can handle millions of rows, support multiple users simultaneously, and enforce data integrity' }, { id: 'c', text: 'Databases can only be accessed with Python, not SQL' }, { id: 'd', text: 'CSV files cannot be opened in Excel' }],
        'b', 'Databases offer scalability, concurrent access, transactions, and integrity constraints that flat files like CSV cannot provide. That is why companies store their core data in databases, not CSV files.', 4),
      q('What does CSV stand for?',
        [{ id: 'a', text: 'Calculated Standard Values' }, { id: 'b', text: 'Comma-Separated Values' }, { id: 'c', text: 'Column-Structured Variables' }, { id: 'd', text: 'Computer Stored Variables' }],
        'b', 'CSV = Comma-Separated Values. It is a plain text format where values in each row are separated by commas. It is the most universal data exchange format — readable by every data tool.', 5),
      q('A column "order_status" contains values: Pending, Processing, Shipped, Delivered, Cancelled. What data type is this?',
        [{ id: 'a', text: 'Numeric' }, { id: 'b', text: 'Boolean' }, { id: 'c', text: 'Datetime' }, { id: 'd', text: 'Categorical' }],
        'd', 'Categorical data has a limited, known set of possible values (categories). Order status has exactly 5 possible values — making it categorical. It is stored as text but treated as a category for grouping and filtering.', 6),
      q('Which data type would you use to store a product\'s price like 49.99?',
        [{ id: 'a', text: 'Integer' }, { id: 'b', text: 'Float / Decimal' }, { id: 'c', text: 'Boolean' }, { id: 'd', text: 'Categorical' }],
        'b', 'Prices have decimal places (49.99, 9.50) — they cannot be stored as integers (whole numbers only). Float / Decimal is the correct type for monetary values and any measurement with decimal precision.', 7),
      q('What percentage of globally created data is estimated to be unstructured?',
        [{ id: 'a', text: 'About 20%' }, { id: 'b', text: 'About 40%' }, { id: 'c', text: 'About 60%' }, { id: 'd', text: 'About 80%' }],
        'd', 'An estimated 80% of all data is unstructured — emails, documents, images, audio, video. Structured data (the analyst\'s domain for beginners) is the organised 20% that drives most formal business reporting.', 8),
      q('What is the CELL in a data table?',
        [{ id: 'a', text: 'The entire first row (header)' }, { id: 'b', text: 'The intersection of one specific row and one specific column' }, { id: 'c', text: 'A summary row at the bottom' }, { id: 'd', text: 'A table that links two datasets' }],
        'b', 'A cell is the single value at the intersection of one row and one column. For example, row 3, column "price" gives the cell value 149 — the price of the Headphones.', 9),
      q('What advantage does an Excel file (.xlsx) have over a CSV file that makes it useful for interactive analysis?',
        [{ id: 'a', text: 'Excel files load faster because they are smaller' }, { id: 'b', text: 'Excel supports formulas, multiple sheets, charts, pivot tables, and formatting' }, { id: 'c', text: 'CSV cannot store text — only numbers' }, { id: 'd', text: 'Excel is the only format readable by Python' }],
        'b', 'Excel adds a layer of functionality on top of raw data: formulas (=SUM, =VLOOKUP), multiple named sheets, visual charts, pivot tables, and cell formatting. CSV is raw data only — no computation or styling.', 10),
      q('A "signup_date" column contains values like "2024-03-15". What data type is this?',
        [{ id: 'a', text: 'Text/String — it contains dashes' }, { id: 'b', text: 'Integer — it is made of digits' }, { id: 'c', text: 'Date/Datetime — used for time-based analysis' }, { id: 'd', text: 'Boolean — either signed up or not' }],
        'c', 'Date columns store points in time. They look like text but are treated specially — you can subtract two dates to get a duration, extract the month for grouping, or sort chronologically.', 11),
      q('Which database system is recommended as the best starting point for beginners learning SQL?',
        [{ id: 'a', text: 'MongoDB' }, { id: 'b', text: 'Redis' }, { id: 'c', text: 'SQLite' }, { id: 'd', text: 'Cassandra' }],
        'c', 'SQLite is a lightweight, file-based relational database — no server setup required. You can query it directly from Python and it is perfect for learning SQL without infrastructure complexity.', 12),
      q('In a customer table with 10,000 rows and 8 columns, how many individual data points (cells) exist?',
        [{ id: 'a', text: '10,000' }, { id: 'b', text: '8' }, { id: 'c', text: '80,000' }, { id: 'd', text: '10,008' }],
        'c', 'Cells = rows × columns = 10,000 × 8 = 80,000. Every row has a value for every column (even if that value is null/empty), so total cells is rows multiplied by columns.', 13),
      q('A dataset column "is_premium_member" contains only True or False values. What data type is this?',
        [{ id: 'a', text: 'Categorical — two categories exist' }, { id: 'b', text: 'Integer — True=1, False=0' }, { id: 'c', text: 'Boolean — binary yes/no state' }, { id: 'd', text: 'Text — the words True and False are strings' }],
        'c', 'Boolean is specifically the True/False data type. It represents binary states: yes/no, on/off, active/inactive. While it can be encoded as 1/0 integers, the semantic meaning and best practice is to treat it as Boolean.', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 2 — EXCEL & GOOGLE SHEETS BASICS
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-2-excel-basics',
    title:       'Excel & Google Sheets — Core Skills',
    description: 'Master the spreadsheet fundamentals every analyst needs: sorting, filtering, and the six most important formulas — SUM, AVERAGE, COUNT, IF, VLOOKUP, and INDEX+MATCH.',
    orderIndex:  2,
    xpReward:    65,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    codeExample: `# ── Python mirrors of key Excel formulas ────────────────────────────
# Learning both side-by-side cements the logic.
# In Excel you write =FORMULA(); in Python you write a function call.

data = [
    {"name": "Alice",   "dept": "Sales",  "salary": 72000, "score": 88},
    {"name": "Bob",     "dept": "IT",     "salary": 95000, "score": 92},
    {"name": "Charlie", "dept": "Sales",  "salary": 68000, "score": 75},
    {"name": "Diana",   "dept": "HR",     "salary": 61000, "score": 81},
    {"name": "Eve",     "dept": "IT",     "salary": 102000,"score": 95},
]

salaries = [r["salary"] for r in data]
scores   = [r["score"]  for r in data]

# =SUM(range)
total_payroll = sum(salaries)
print(f"SUM of salaries : \${total_payroll:,}")

# =AVERAGE(range)
avg_salary = sum(salaries) / len(salaries)
print(f"AVERAGE salary  : \${avg_salary:,.0f}")

# =COUNT(range)
headcount = len(salaries)
print(f"COUNT (headcount): {headcount}")

# =MAX / =MIN
print(f"MAX salary      : \${max(salaries):,}")
print(f"MIN salary      : \${min(salaries):,}")

# =IF(condition, value_if_true, value_if_false)
print("\\nPerformance labels (=IF equivalent):")
for r in data:
    label = "High Performer" if r["score"] >= 90 else "On Track"
    print(f"  {r['name']:<10} score={r['score']}  → {label}")

# =VLOOKUP equivalent — look up Bob's salary
lookup_name = "Bob"
result = next((r["salary"] for r in data if r["name"] == lookup_name), "Not found")
print(f"\\nVLOOKUP '{lookup_name}' salary: \${result:,}")`,
    content: `# Chapter 2 — Excel & Google Sheets: Core Skills

## 🎯 What You'll Learn
How to navigate a spreadsheet confidently; sort and filter data; use the six most critical formulas (SUM, AVERAGE, COUNT, IF, VLOOKUP, INDEX+MATCH); understand absolute vs relative cell references; and apply basic formatting for readable reports.

---

## 1. Why Start with Excel?

Excel is the world's most widely used data analysis tool. Before writing a single line of Python or SQL:

- It gives you instant visual feedback
- Zero setup — just open and start
- The logic of formulas directly translates to Python and SQL later
- Every data analyst job expects at least basic Excel/Sheets proficiency

> 📊 **Industry fact:** A LinkedIn survey found Excel is mentioned in more data analyst job postings than any other single tool — including Python.

---

## 2. The Spreadsheet Interface

### Key Components

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Formula Bar:  =SUM(B2:B10)                         │
├───────┬────────┬────────────┬──────────┬────────────┤
│       │   A    │     B      │    C     │     D      │  ← Column headers
├───────┼────────┼────────────┼──────────┼────────────┤
│  1    │  Name  │  Salary    │  Dept    │  Score     │  ← Row 1 (header row)
│  2    │  Alice │  72000     │  Sales   │  88        │  ← Row 2
│  3    │  Bob   │  95000     │  IT      │  92        │  ← Row 3
└───────┴────────┴────────────┴──────────┴────────────┘
    ↑                ↑
  Row numbers    Columns (A, B, C...)
\`\`\`

| Term | Meaning |
|------|---------|
| **Cell reference** | Column + Row, e.g., B2 = "72000" |
| **Range** | A group of cells, e.g., B2:B10 |
| **Sheet** | One tab in the workbook |
| **Workbook** | The entire Excel file (.xlsx) |

### Absolute vs Relative References

This is one of the most important Excel concepts:

| Reference | Example | Behaviour when copied |
|-----------|---------|----------------------|
| **Relative** | \`=B2*1.1\` | Adjusts row/column automatically |
| **Absolute** | \`=B2*\$C\$1\` | \$C\$1 never changes |
| **Mixed** | \`=B2*\$C1\` | Column C fixed, row adjusts |

Use \`\$\` to "lock" a reference. Example: if your tax rate is in cell F1 and you want to multiply every salary by it, use \`=B2*\$F\$1\` so the F1 reference doesn't shift when you copy the formula down.

---

## 3. Sorting and Filtering

### Sorting

**How to sort in Excel:**
1. Click any cell in the column you want to sort by
2. Go to Data → Sort A-Z (ascending) or Sort Z-A (descending)
3. For multi-level sort: Data → Sort → Add Level

**Example:** Sort employees by salary from highest to lowest.

| Before sort | After sort (salary DESC) |
|-------------|--------------------------|
| Alice — 72,000 | Eve — 102,000 |
| Bob — 95,000 | Bob — 95,000 |
| Charlie — 68,000 | Alice — 72,000 |
| Diana — 61,000 | Charlie — 68,000 |
| Eve — 102,000 | Diana — 61,000 |

### Filtering

**How to add filters:**
1. Select your header row
2. Data → Filter (or Ctrl+Shift+L)
3. Click the dropdown arrow on any column header
4. Choose your filter conditions

**Filter types:**
- **Value filter:** Show only IT department employees
- **Number filter:** Show salaries > 70,000
- **Text filter:** Names that contain "Ali"
- **Date filter:** Orders placed in January 2024

> 🔑 **Filters are non-destructive** — they hide rows temporarily without deleting them. Toggle off the filter to see all rows again.

---

## 4. The Six Essential Formulas

### Formula 1: =SUM()

Adds up a range of numbers.

\`\`\`
=SUM(B2:B100)          → Total of all salaries in B2 through B100
=SUM(B2, B5, B9)       → Sum of specific cells
=SUM(B2:B100)/B101     → Sum then divide (combined formula)
\`\`\`

**Use cases:** Total sales, total payroll, total units sold.

---

### Formula 2: =AVERAGE()

Calculates the arithmetic mean.

\`\`\`
=AVERAGE(D2:D100)      → Average score
=AVERAGE(B2:B10)       → Average salary
\`\`\`

> ⚠️ AVERAGE ignores empty cells but counts zeros. If 0 means "no data", replace zeros with blanks first.

---

### Formula 3: =COUNT() and =COUNTA()

\`\`\`
=COUNT(B2:B100)        → Count of NUMERIC cells (ignores blanks & text)
=COUNTA(A2:A100)       → Count of NON-EMPTY cells (any type)
=COUNTIF(C2:C100,"IT") → Count rows where dept = "IT"
=COUNTIFS(C2:C100,"IT", D2:D100,">90")  → Count IT employees with score > 90
\`\`\`

**Use cases:** Number of orders, how many customers in each country, count products in stock.

---

### Formula 4: =IF()

Makes decisions. Returns one value if a condition is true, another if false.

\`\`\`
=IF(D2>=90, "High Performer", "On Track")
     ↑               ↑               ↑
  condition    value if TRUE    value if FALSE

=IF(B2>80000, "Senior", IF(B2>60000, "Mid", "Junior"))
↑ Nested IF for 3 categories
\`\`\`

**Use cases:** Flag high-value orders, classify customers, mark pass/fail.

---

### Formula 5: =VLOOKUP()

Looks up a value in the first column of a range and returns a corresponding value from another column.

\`\`\`
=VLOOKUP(lookup_value, table_range, column_index, [exact_match])

Example:
=VLOOKUP("Bob", A2:D100, 2, FALSE)
  → Find "Bob" in column A, return the value from column 2 (B = Salary)
  → Returns: 95000
\`\`\`

\`\`\`
Arguments explained:
  "Bob"     → What to look for
  A2:D100   → Where to look (lookup column must be FIRST)
  2         → Return value from the 2nd column of the range
  FALSE     → Exact match (always use FALSE for data lookups)
\`\`\`

**Limitations of VLOOKUP:**
- Can only look left-to-right
- Slow on large datasets
- Breaks when you insert columns

---

### Formula 6: =INDEX() + =MATCH()

A more powerful, flexible alternative to VLOOKUP. Can look in any direction.

\`\`\`
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))

Example:
=INDEX(B2:B100, MATCH("Bob", A2:A100, 0))
  → MATCH finds what ROW "Bob" is on
  → INDEX returns the value from that row in column B
  → Returns: 95000
\`\`\`

| Feature | VLOOKUP | INDEX+MATCH |
|---------|---------|------------|
| Direction | Left to right only | Any direction |
| Speed on large data | Slower | Faster |
| Column insert safe | ❌ Breaks | ✅ Safe |
| Complexity | Easier | Slightly harder |

> 💡 **Modern Excel (2019+):** Use **=XLOOKUP()** instead — it replaces both VLOOKUP and INDEX+MATCH with a cleaner syntax.

---

## 5. Quick Reference: Formula Cheat Sheet

\`\`\`
Statistical:
  =SUM(range)                    Total
  =AVERAGE(range)                Mean
  =MEDIAN(range)                 Middle value
  =MAX(range)                    Largest value
  =MIN(range)                    Smallest value
  =STDEV(range)                  Standard deviation

Counting:
  =COUNT(range)                  Count numbers
  =COUNTA(range)                 Count non-empty cells
  =COUNTIF(range, criteria)      Count matching cells
  =COUNTIFS(r1, c1, r2, c2)      Count multi-condition

Conditional:
  =SUMIF(range, criteria, sum_range)   Sum where condition met
  =AVERAGEIF(range, criteria, avg_r)   Average where condition met
  =IF(condition, true_val, false_val)  Decision formula

Lookup:
  =VLOOKUP(val, table, col, FALSE)     Lookup (right only)
  =INDEX(ret_range, MATCH(val, look_range, 0))  Flexible lookup
  =XLOOKUP(val, look_range, ret_range) Modern lookup (Excel 365)

Text:
  =LEFT(text, n)                 First n characters
  =RIGHT(text, n)                Last n characters
  =LEN(text)                     Count characters
  =TRIM(text)                    Remove extra spaces
  =UPPER/LOWER/PROPER(text)      Change case
  =CONCATENATE(a, b) or =a&b    Join text
\`\`\`

---

## 6. Keyboard Shortcuts — Work 3× Faster

| Shortcut | Action |
|----------|--------|
| Ctrl + T | Format selection as Table (enables auto-filter) |
| Ctrl + Shift + L | Toggle filters |
| Ctrl + D | Fill formula down |
| Ctrl + R | Fill formula right |
| F4 | Toggle absolute/relative reference (\$) |
| Alt + = | Auto-sum selected range |
| Ctrl + Home | Go to cell A1 |
| Ctrl + End | Go to last cell with data |
| Ctrl + Arrow | Jump to last cell in direction |

> 🎯 **Practice goal:** Open a sample CSV in Excel, apply filters to find top 10 salaries, use COUNTIF to count by department, and use IF to label high earners. This single exercise builds muscle memory for 80% of daily Excel work.`,
    questions: [
      q('What does the formula =SUM(B2:B10) calculate?',
        [{ id: 'a', text: 'The average of cells B2 through B10' }, { id: 'b', text: 'The total of all numeric values in cells B2 through B10' }, { id: 'c', text: 'The count of non-empty cells from B2 to B10' }, { id: 'd', text: 'The maximum value between B2 and B10' }],
        'b', '=SUM(range) adds together all numeric values in the specified range. B2:B10 means cells B2, B3, B4, B5, B6, B7, B8, B9, and B10 — nine cells total.', 0),
      q('What is the difference between =COUNT() and =COUNTA()?',
        [{ id: 'a', text: 'COUNT counts all cells; COUNTA counts only numbers' }, { id: 'b', text: 'COUNT counts only numeric cells; COUNTA counts all non-empty cells (any type)' }, { id: 'c', text: 'They are identical — different names for the same formula' }, { id: 'd', text: 'COUNT counts rows; COUNTA counts columns' }],
        'b', 'COUNT only counts cells containing numbers (ignores text and blanks). COUNTA (A = All) counts every non-empty cell regardless of data type — use it to count names, IDs, or any text column.', 1),
      q('What does the $ symbol do in a cell reference like $C$1?',
        [{ id: 'a', text: 'It converts the value to currency format' }, { id: 'b', text: 'It locks the reference so it does not shift when the formula is copied' }, { id: 'c', text: 'It multiplies the cell value by $1' }, { id: 'd', text: 'It references the cell on a different sheet' }],
        'b', 'The $ sign makes a reference "absolute" — it locks that row and/or column so the reference stays fixed when you copy the formula to other cells. Without $, Excel adjusts the reference relatively.', 2),
      q('=IF(D2>=90, "Star", "Good") — what does this formula return when D2 = 85?',
        [{ id: 'a', text: 'Star' }, { id: 'b', text: 'Good' }, { id: 'c', text: 'TRUE' }, { id: 'd', text: '0' }],
        'b', 'D2=85 does NOT meet the condition D2>=90, so the formula returns the "value if FALSE" — "Good". The formula only returns "Star" when D2 is 90 or higher.', 3),
      q('In =VLOOKUP("Alice", A2:D100, 3, FALSE), what does the "3" mean?',
        [{ id: 'a', text: 'Look in the 3rd row of the table' }, { id: 'b', text: 'Return the value from the 3rd column of the specified range' }, { id: 'c', text: 'Find an approximate match with tolerance of 3' }, { id: 'd', text: 'Stop searching after 3 results' }],
        'b', 'The third argument of VLOOKUP is the column index — it tells Excel which column to return. "3" means: once "Alice" is found in column A (column 1 of the range A2:D100), return the value from column C (column 3 of the range).', 3),
      q('What is the key limitation of VLOOKUP that INDEX+MATCH solves?',
        [{ id: 'a', text: 'VLOOKUP can only handle text; INDEX+MATCH handles numbers' }, { id: 'b', text: 'VLOOKUP can only look from left to right; INDEX+MATCH can look in any direction' }, { id: 'c', text: 'VLOOKUP requires sorted data; INDEX+MATCH does not' }, { id: 'd', text: 'VLOOKUP only works in Excel; INDEX+MATCH works in Google Sheets too' }],
        'b', 'VLOOKUP requires the lookup column to be the FIRST column in the range, so it can only return values to the right. INDEX+MATCH has no such restriction — the lookup column and return column can be anywhere.', 4),
      q('How do you apply auto-filters to a spreadsheet so users can filter by column?',
        [{ id: 'a', text: 'Right-click a cell → Format Cells → Filter' }, { id: 'b', text: 'Select header row → Data → Filter (or Ctrl+Shift+L)' }, { id: 'c', text: 'Insert → Filter → Apply to All Columns' }, { id: 'd', text: 'Filters can only be added with the =FILTER() formula' }],
        'b', 'Select your header row, then go to Data → Filter (shortcut: Ctrl+Shift+L). This adds dropdown arrows to each column header, allowing you to filter rows by any combination of values.', 5),
      q('=COUNTIF(C2:C100, "Sales") — what does this count?',
        [{ id: 'a', text: 'The sum of all values in column C that equal "Sales"' }, { id: 'b', text: 'The number of cells in C2:C100 that contain the text "Sales"' }, { id: 'c', text: 'The average of the Sales column' }, { id: 'd', text: 'The position (row number) where "Sales" first appears' }],
        'b', 'COUNTIF counts how many cells in the range match the criteria. =COUNTIF(C2:C100, "Sales") counts all cells in column C that contain exactly "Sales" — effectively counting the number of employees in the Sales department.', 6),
      q('What keyboard shortcut quickly sums a selected range in Excel?',
        [{ id: 'a', text: 'Ctrl + S' }, { id: 'b', text: 'Ctrl + A' }, { id: 'c', text: 'Alt + =' }, { id: 'd', text: 'Ctrl + Shift + S' }],
        'c', 'Alt + = (Alt plus the equals sign) is the "AutoSum" shortcut. It automatically inserts a =SUM() formula for the range directly above (or to the left of) the selected cell.', 7),
      q('When filtering data in Excel, what happens to the rows that do not match the filter?',
        [{ id: 'a', text: 'They are permanently deleted from the spreadsheet' }, { id: 'b', text: 'They are moved to a separate sheet' }, { id: 'c', text: 'They are hidden temporarily — removing the filter shows them again' }, { id: 'd', text: 'They are highlighted in red' }],
        'c', 'Excel filters are non-destructive. Non-matching rows are hidden, not deleted. When you clear or remove the filter, all rows reappear. This is safe for exploration — you cannot accidentally lose data by filtering.', 8),
      q('What does =AVERAGE(B2:B10) return if B6 is empty?',
        [{ id: 'a', text: 'An error — AVERAGE cannot handle empty cells' }, { id: 'b', text: 'The average of the 9 cells treating B6 as zero' }, { id: 'c', text: 'The average of the 8 non-empty cells, ignoring the blank' }, { id: 'd', text: 'Zero' }],
        'c', 'AVERAGE ignores empty cells — it divides the sum by the count of cells with values. So if B6 is empty, it averages 8 values, not 9. Note: it does NOT ignore cells containing 0.', 9),
      q('Which modern Excel function replaces both VLOOKUP and INDEX+MATCH with simpler syntax?',
        [{ id: 'a', text: '=SEARCH()' }, { id: 'b', text: '=FIND()' }, { id: 'c', text: '=LOOKUP()' }, { id: 'd', text: '=XLOOKUP()' }],
        'd', 'XLOOKUP (available in Excel 2019+ and Microsoft 365) is the modern replacement. It can look in any direction, does not need the lookup column to be first, and has cleaner syntax than both VLOOKUP and INDEX+MATCH.', 10),
      q('You have a formula =B2*C2 in cell D2. You copy it down to D3. What does D3 contain?',
        [{ id: 'a', text: '=B2*C2 — the formula stays exactly the same' }, { id: 'b', text: '=B3*C3 — relative references adjust down by one row' }, { id: 'c', text: '=B2*C3 — only the second reference adjusts' }, { id: 'd', text: 'An error — formulas cannot be copied' }],
        'b', 'Relative references automatically adjust when copied. Moving the formula one row down shifts both references from row 2 to row 3: =B2*C2 becomes =B3*C3. This is the intended behaviour for most formula applications.', 11),
      q('=SUMIF(C2:C100, "IT", B2:B100) — what does this calculate?',
        [{ id: 'a', text: 'The count of IT employees' }, { id: 'b', text: 'The average salary of IT employees' }, { id: 'c', text: 'The total salary of all employees in the IT department' }, { id: 'd', text: 'The maximum IT salary' }],
        'c', 'SUMIF sums values in one range (B2:B100 = salaries) where a corresponding range (C2:C100 = department) matches the criteria ("IT"). It is a conditional sum — total salary for IT employees only.', 12),
      q('What does pressing F4 do when editing a cell reference in a formula?',
        [{ id: 'a', text: 'Deletes the formula' }, { id: 'b', text: 'Cycles through absolute/mixed/relative reference modes ($C$1 → C$1 → $C1 → C1)' }, { id: 'c', text: 'Opens the formula help wizard' }, { id: 'd', text: 'Applies the formula to the entire column' }],
        'b', 'F4 toggles the $ symbols in a cell reference, cycling through: fully absolute ($C$1), row-only absolute (C$1), column-only absolute ($C1), and fully relative (C1). This is faster than typing $ signs manually.', 13),
      q('A company stores its tax rate (0.18) in cell F1 and wants to calculate tax for each product price in column B. Which formula in C2 is correct?',
        [{ id: 'a', text: '=B2*F1' }, { id: 'b', text: '=B2*$F$1' }, { id: 'c', text: '=$B2*F1' }, { id: 'd', text: '=B$2*$F1' }],
        'b', 'The tax rate in F1 should be locked with $F$1 (absolute reference) so it does not shift when the formula is copied down. B2 should remain relative so it adjusts to B3, B4, etc. for each product row.', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 3 — EXCEL PIVOT TABLES & CHARTS
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-3-excel-pivot-charts',
    title:       'Excel Pivot Tables, Charts & Data Cleaning',
    description: 'The three power skills of Excel analytics: clean messy data, visualise with bar/line/pie charts, and summarise thousands of rows instantly with Pivot Tables.',
    orderIndex:  3,
    xpReward:    70,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    codeExample: `import pandas as pd

# ── Python equivalents of Excel Pivot Tables & Charts ───────────────
# Understanding the LOGIC in Python makes Excel pivot tables click.

data = {
    "region":   ["North","South","North","East","South","North","East","West"],
    "category": ["Electronics","Clothing","Electronics","Food","Electronics","Clothing","Electronics","Food"],
    "sales":    [15000, 8000, 22000, 3500, 18000, 9500, 12000, 4200],
    "units":    [15, 80, 22, 350, 18, 95, 12, 420],
}
df = pd.DataFrame(data)

# ── Excel "Remove Duplicates" equivalent ─────────────────────────────
print("Unique regions :", df["region"].unique().tolist())
print("Unique categories:", df["category"].unique().tolist())

# ── Pivot Table: total sales by region ──────────────────────────────
# Excel: Insert → PivotTable → Rows=region, Values=SUM(sales)
pivot1 = df.groupby("region")["sales"].sum().sort_values(ascending=False)
print("\\n=== Total Sales by Region (Excel PivotTable) ===")
print(pivot1.to_string())

# ── Pivot Table: sales by region AND category ───────────────────────
# Excel: Rows=region, Columns=category, Values=SUM(sales)
pivot2 = df.pivot_table(
    values="sales", index="region", columns="category", aggfunc="sum", fill_value=0
)
print("\\n=== Sales by Region x Category ===")
print(pivot2.to_string())

# ── Data Cleaning: remove duplicates ────────────────────────────────
df_clean = df.drop_duplicates()
print(f"\\nRows before: {len(df)}  After dedup: {len(df_clean)}")`,
    content: `# Chapter 3 — Excel Pivot Tables, Charts & Data Cleaning

## 🎯 What You'll Learn
How to clean common data quality problems in Excel; create bar, line, and pie charts that tell a story; and build Pivot Tables that summarise thousands of rows in seconds — the single most powerful Excel skill for analysts.

---

## 1. Data Cleaning in Excel

Real-world data is always messy. Before any analysis, you need to clean it. Excel has built-in tools for the most common issues.

### Problem 1: Duplicate Rows

**How to find and remove duplicates:**
1. Select your data range (or click any cell in your table)
2. Data → Remove Duplicates
3. Choose which columns to check (usually "all columns")
4. Click OK — Excel reports how many duplicates were removed

> ⚠️ **Always work on a copy.** Remove Duplicates is permanent. Ctrl+Z to undo if needed.

---

### Problem 2: Extra Whitespace in Text

Spaces before or after text cause filtering and lookups to fail silently.

\`\`\`
"  Alice " ≠ "Alice"   — VLOOKUP won't find it!
"Sales "  ≠ "Sales"    — COUNTIF won't count it!
\`\`\`

**Fix with TRIM:**
\`\`\`
=TRIM(A2)    → Removes leading/trailing spaces and collapses internal multiple spaces
\`\`\`

After adding the TRIM formula in a helper column, copy → Paste Special → Values Only to replace the original column.

---

### Problem 3: Inconsistent Text Case

\`\`\`
"SALES" vs "Sales" vs "sales" — Excel treats these as different values
\`\`\`

**Fix:**
\`\`\`
=UPPER(A2)    → ALL CAPS
=LOWER(A2)    → all lowercase
=PROPER(A2)   → First Letter Capitalised
\`\`\`

---

### Problem 4: Numbers Stored as Text

A common import problem. The column looks numeric but Excel left-aligns the values (numbers right-align by default). SUM returns 0.

**Fix:**
1. Select the column
2. Data → Text to Columns → Finish (fastest method)
3. Or: multiply by 1 in a helper column: \`=A2*1\`

---

### Problem 5: Split Text into Columns

A "Full Name" column ("Alice Johnson") needs to be split into First Name and Last Name.

**Flash Fill (Excel 2013+):**
1. In B2, type "Alice" (the first name from A2)
2. Press Ctrl+E — Excel recognises the pattern and fills the rest

**Text to Columns:**
1. Select the column
2. Data → Text to Columns
3. Choose Delimited → Space (or comma, etc.)
4. Finish — Excel splits into multiple columns

---

### Data Cleaning Checklist

\`\`\`
✅ Remove duplicate rows
✅ Trim extra spaces with =TRIM()
✅ Standardise text case
✅ Fix numbers stored as text
✅ Handle blank/empty cells (use =IF(A2="","Unknown",A2))
✅ Standardise date formats
✅ Validate data ranges (no age = 300, no negative prices)
\`\`\`

---

## 2. Charts — Visualising Data

Charts turn numbers into visual stories. The hardest part is choosing the right chart type.

### The Right Chart for the Right Question

| Question | Best Chart | Example |
|----------|-----------|---------|
| How do categories compare? | **Bar / Column chart** | Sales by region |
| How does X change over time? | **Line chart** | Monthly revenue trend |
| What share does each part have? | **Pie / Donut chart** | Market share % |
| How is a variable distributed? | **Histogram** | Age distribution of customers |
| What is the relationship between X and Y? | **Scatter plot** | Experience vs Salary |

---

### Creating a Bar Chart (Step by Step)

1. Select your data (including headers)
2. Insert → Charts → Column Chart (vertical bars) or Bar Chart (horizontal)
3. Excel creates a draft — now format it:
   - Chart Title: double-click to edit → "Sales by Region Q1 2024"
   - Axis Labels: make sure both axes are labelled
   - Data Labels: Chart Design → Add Chart Element → Data Labels
4. Move and resize by dragging

**Good bar chart principles:**
- Start the Y-axis at 0 (never truncate the axis to exaggerate differences)
- Keep colours consistent — same colour for same category
- Sort bars from largest to smallest for easy reading

---

### Creating a Line Chart

Best for time-series data (months, quarters, years).

1. Your data should have dates in one column, values in another
2. Insert → Charts → Line Chart
3. Right-click the date axis → Format Axis to set the date range

**Good line chart principles:**
- Use one line per category (not more than 5 lines — gets unreadable)
- Add data markers for small datasets
- Annotate key events (product launch, campaign start)

---

### Pie Chart — Use Sparingly

\`\`\`
✅ Good for: showing proportions when there are < 6 categories
❌ Bad for:  comparing values (bar charts do this better)
❌ Bad for:  more than 6 slices (unreadable)
❌ Bad for:  showing change over time
\`\`\`

**Make it readable:**
- Add percentage labels to each slice
- Use a legend or data labels — not both
- Consider a Donut chart (hole in centre) for a cleaner look

---

## 3. Pivot Tables — Excel's Most Powerful Feature

A Pivot Table lets you summarise, group, and analyse thousands of rows of data in seconds — with no formulas.

### What a Pivot Table Does

Raw data:
\`\`\`
Region  | Category    | Sales
North   | Electronics | 15,000
South   | Clothing    | 8,000
North   | Electronics | 22,000
East    | Food        | 3,500
South   | Electronics | 18,000
\`\`\`

After Pivot Table (SUM of Sales by Region):
\`\`\`
Region  | Total Sales
North   | 37,000
South   | 26,000
East    | 3,500
\`\`\`

### Creating a Pivot Table (Step by Step)

1. Click any cell inside your data table
2. Insert → PivotTable → New Worksheet → OK
3. The PivotTable Field List appears on the right:
   - **Rows area:** Drag fields here to define grouping (e.g., Region)
   - **Columns area:** Secondary grouping (e.g., Category)
   - **Values area:** What to summarise (e.g., SUM of Sales)
   - **Filters area:** Apply a filter to the entire pivot

### The Four Pivot Table Zones

\`\`\`
┌─────────────────────────────────────────┐
│  FILTERS:  Year = 2024                  │
│─────────────────────────────────────────│
│  ROWS        │ COLUMNS: Category        │
│  Region      │ Electronics│Clothing│Food│
│─────────────────────────────────────────│
│  East        │  12,000   │  —     │3,500│
│  North       │  37,000   │  9,500 │  — │
│  South       │  18,000   │  8,000 │  — │
│  West        │   —       │  —     │4,200│
│─────────────────────────────────────────│
│  VALUES: SUM of Sales                   │
└─────────────────────────────────────────┘
\`\`\`

### Aggregation Options in the Values Area

Right-click any value cell → Value Field Settings:
- **SUM** — total (most common for revenue, units)
- **COUNT** — how many rows (good for transactions, customers)
- **AVERAGE** — mean value
- **MAX / MIN** — highest / lowest
- **% of Grand Total** — show proportions

### Grouping Dates in Pivot Tables

If your data has a date column, drag it to Rows. Excel will offer to group by:
- Years → Quarters → Months → Days

This is incredibly powerful for trend analysis: one click to go from daily transactions to monthly summaries.

---

## 4. Pivot Charts

A Pivot Chart is a chart connected to a Pivot Table — it updates automatically when you change the pivot.

**Create:** With a pivot table selected → PivotTable Analyze → PivotChart

Use Pivot Charts when:
- You need a chart that changes when you filter the pivot
- You want the analysis and the visual in sync

---

## 5. Practical Exercise

Try this with any sales dataset:

\`\`\`
Step 1: Import data into Excel
Step 2: Clean it
  - Remove duplicates
  - Trim spaces in text columns
  - Ensure numeric columns are numbers

Step 3: Create a Pivot Table
  - Rows: Category
  - Values: SUM of Sales, COUNT of Orders

Step 4: Sort the pivot by Total Sales (largest first)

Step 5: Create a Bar Chart from the pivot
  - Title: "Sales by Product Category"
  - Data labels showing the exact values

Step 6: Add a second Pivot Table
  - Rows: Month (grouped from order_date)
  - Values: SUM of Sales

Step 7: Create a Line Chart from the monthly pivot
  - Shows the revenue trend over time
\`\`\`

> 🏆 **After this exercise:** You can handle most entry-level analyst reporting tasks with just Excel. Pivot Tables + Charts are the backbone of 80% of business reporting worldwide.`,
    questions: [
      q('Which Excel feature instantly summarises thousands of rows into grouped totals without writing any formulas?',
        [{ id: 'a', text: 'VLOOKUP' }, { id: 'b', text: 'Conditional Formatting' }, { id: 'c', text: 'Pivot Table' }, { id: 'd', text: 'Data Validation' }],
        'c', 'Pivot Tables allow you to drag-and-drop fields to group, aggregate, and summarise large datasets instantly — no formulas required. They are considered Excel\'s most powerful analytical feature.', 0),
      q('What does the Excel =TRIM() function do?',
        [{ id: 'a', text: 'Rounds a number to a specified decimal place' }, { id: 'b', text: 'Removes leading, trailing, and extra internal spaces from text' }, { id: 'c', text: 'Cuts the first N characters from a string' }, { id: 'd', text: 'Converts text to uppercase' }],
        'b', 'TRIM() removes all leading and trailing whitespace and collapses multiple spaces between words to a single space. It is essential for cleaning text columns where data was entered inconsistently.', 1),
      q('Which chart type is BEST for showing how monthly revenue changed over 12 months?',
        [{ id: 'a', text: 'Pie chart' }, { id: 'b', text: 'Bar chart' }, { id: 'c', text: 'Line chart' }, { id: 'd', text: 'Histogram' }],
        'c', 'Line charts are designed for continuous data over time. They make trends, seasonality, and turning points immediately visible. A bar chart could work for discrete months, but a line chart better conveys the continuous flow of time.', 2),
      q('In a Pivot Table, the "Values" area is used for:',
        [{ id: 'a', text: 'Defining the row groupings (e.g., Region, Department)' }, { id: 'b', text: 'Applying a filter to the entire pivot' }, { id: 'c', text: 'The column that is aggregated (e.g., SUM of Sales, COUNT of Orders)' }, { id: 'd', text: 'Defining the column headers (e.g., Category, Month)' }],
        'c', 'The Values area defines WHAT is being measured and HOW (SUM, COUNT, AVERAGE, etc.). It is the number that appears in each cell of the pivot — e.g., total sales or count of orders for each group.', 3),
      q('What is the fastest way to fix "numbers stored as text" in Excel?',
        [{ id: 'a', text: 'Delete the column and retype all values' }, { id: 'b', text: 'Data → Text to Columns → Finish (converts text to proper numbers)' }, { id: 'c', text: 'Format Cells → Number (does not actually convert stored text)' }, { id: 'd', text: 'Insert → Convert → Number Format' }],
        'b', 'Text to Columns with a single Finish click is the quickest conversion. Alternatively, multiply by 1 in a helper column (=A2*1). Simply changing the format (Format Cells) does not convert the underlying stored value.', 4),
      q('When should you AVOID using a pie chart?',
        [{ id: 'a', text: 'When you have exactly 3 categories' }, { id: 'b', text: 'When showing the percentage share of each region' }, { id: 'c', text: 'When you have more than 6 categories or need to compare values precisely' }, { id: 'd', text: 'When the total adds up to 100%' }],
        'c', 'Pie charts become unreadable with more than 5-6 slices and make precise comparisons difficult (human eyes struggle to compare angles). Use bar charts instead when you need easy comparison or have many categories.', 5),
      q('A Pivot Table has "Region" in Rows, "Category" in Columns, and "SUM of Revenue" in Values. What does each CELL in the table show?',
        [{ id: 'a', text: 'The total revenue for the entire dataset' }, { id: 'b', text: 'The total revenue for a specific Region-Category combination' }, { id: 'c', text: 'The number of rows for that region' }, { id: 'd', text: 'The average revenue per transaction' }],
        'b', 'Each cell at the intersection of a Region row and Category column shows the SUM of Revenue for that specific combination — e.g., the cell at North/Electronics shows the total electronics revenue from the North region.', 6),
      q('Which Excel feature automatically recognises a text pattern and fills a column based on your first example?',
        [{ id: 'a', text: 'AutoFill (dragging the corner)' }, { id: 'b', text: 'Flash Fill (Ctrl+E)' }, { id: 'c', text: 'Text to Columns' }, { id: 'd', text: 'Conditional Formatting' }],
        'b', 'Flash Fill (Ctrl+E) is an AI-powered feature that recognises the pattern in your first entry and automatically fills the rest. Perfect for extracting first names, reformatting dates, or combining columns.', 7),
      q('In Data → Remove Duplicates, what happens to the data after duplicates are removed?',
        [{ id: 'a', text: 'Duplicates are moved to a separate sheet for review' }, { id: 'b', text: 'Duplicates are highlighted in red but kept in the sheet' }, { id: 'c', text: 'Duplicate rows are permanently deleted from the sheet (the first occurrence is kept)' }, { id: 'd', text: 'The entire column is sorted before removal' }],
        'c', 'Remove Duplicates permanently deletes duplicate rows, keeping the first occurrence by default. Always work on a copy of your data before using this feature — Ctrl+Z works immediately after, but not after closing the file.', 8),
      q('What aggregation option would you use in a Pivot Table to find how many orders came from each region?',
        [{ id: 'a', text: 'SUM' }, { id: 'b', text: 'AVERAGE' }, { id: 'c', text: 'COUNT' }, { id: 'd', text: 'MAX' }],
        'c', 'COUNT counts the number of rows in each group — perfect for counting orders, transactions, or customers per region. SUM would add the values together (useful for revenue, not counts).', 9),
      q('What is a Pivot Chart, and what advantage does it have over a regular chart?',
        [{ id: 'a', text: 'A chart that uses pivot formulas (=PIVOT()) instead of regular data' }, { id: 'b', text: 'A chart connected to a Pivot Table that automatically updates when the pivot is filtered or modified' }, { id: 'c', text: 'A 3D chart type available only in Excel 365' }, { id: 'd', text: 'A chart that rotates 360 degrees for presentation' }],
        'b', 'A Pivot Chart is directly linked to a Pivot Table. When you change the pivot (add a filter, change grouping, update data), the chart updates automatically. This dynamic connection makes reporting much faster.', 10),
      q('You have a "Full Name" column with "Alice Johnson" and you want just the first name. Which approach works?',
        [{ id: 'a', text: '=LEFT(A2, 5) — works for 5-letter names only' }, { id: 'b', text: 'Flash Fill: type "Alice" in B2, then press Ctrl+E' }, { id: 'c', text: '=FIRST(A2) — Excel has a built-in FIRST function' }, { id: 'd', text: 'Data → Split → First Word' }],
        'b', 'Flash Fill (Ctrl+E) recognises the pattern from your first manually typed example and extracts the first name for all rows. Alternatively, =LEFT(A2, FIND(" ",A2)-1) extracts text before the first space, but Flash Fill is faster.', 11),
      q('Which principle of good chart design is MOST important to avoid misleading your audience?',
        [{ id: 'a', text: 'Always use 3D chart styles for visual impact' }, { id: 'b', text: 'Start the Y-axis at 0 so differences are not visually exaggerated' }, { id: 'c', text: 'Use as many colours as possible to make the chart attractive' }, { id: 'd', text: 'Remove all gridlines for a cleaner look' }],
        'b', 'Truncating the Y-axis (starting at a non-zero value) visually exaggerates small differences. A change from 98 to 100 looks dramatic on a chart starting at 95 but insignificant on one starting at 0. Always start at 0 unless there is a strong reason not to.', 12),
      q('In a Pivot Table, how do you group a date column by Month?',
        [{ id: 'a', text: 'You must create a Month column manually before making the pivot' }, { id: 'b', text: 'Right-click any date in the Rows area → Group → Select "Months"' }, { id: 'c', text: 'It is not possible — dates cannot be grouped in Pivot Tables' }, { id: 'd', text: 'Use the =MONTH() formula in the Values area' }],
        'b', 'Excel Pivot Tables can automatically group dates. Right-click any date value in the pivot → Group → choose Months, Quarters, Years, or any combination. This eliminates the need to pre-create date-part columns.', 13),
      q('A co-worker sends you a dataset where the "City" column contains "mumbai", "Mumbai", "MUMBAI". How do you standardise it in Excel?',
        [{ id: 'a', text: 'Use Find & Replace to change each variant manually' }, { id: 'b', text: 'Use =PROPER(A2) in a helper column to convert to Title Case, then paste as values' }, { id: 'c', text: 'Delete all rows with incorrect case and retype' }, { id: 'd', text: 'Use =TRIM(A2) to fix the case issue' }],
        'b', '=PROPER() converts text to Title Case (first letter of each word capitalised): "mumbai" → "Mumbai", "MUMBAI" → "Mumbai". After applying the formula, copy the helper column → Paste Special → Values → replace the original column.', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 4 — SQL BASICS: SELECT, WHERE, ORDER BY
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-4-sql-select-basics',
    title:       'SQL Basics — SELECT, WHERE & ORDER BY',
    description: 'Learn to talk to databases: write your first SQL queries using SELECT, filter rows with WHERE, sort results with ORDER BY, and limit output with LIMIT.',
    orderIndex:  4,
    xpReward:    75,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    codeExample: `import sqlite3
import pandas as pd

# ── Create a sample database in memory ──────────────────────────────
conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE employees (
    id         INTEGER PRIMARY KEY,
    name       TEXT,
    department TEXT,
    salary     INTEGER,
    city       TEXT,
    hire_year  INTEGER
);
INSERT INTO employees VALUES
(1, 'Alice',   'Sales', 72000, 'Mumbai',    2020),
(2, 'Bob',     'IT',    95000, 'Delhi',     2018),
(3, 'Charlie', 'Sales', 68000, 'Mumbai',    2022),
(4, 'Diana',   'HR',    61000, 'Bangalore', 2021),
(5, 'Eve',     'IT',   102000, 'Delhi',     2017),
(6, 'Frank',   'HR',    58000, 'Chennai',   2023),
(7, 'Grace',   'IT',    88000, 'Delhi',     2019),
(8, 'Hank',    'Sales', 75000, 'Mumbai',    2020);
""")
conn.commit()

# ── Query 1: SELECT all columns ─────────────────────────────────────
print("=== All Employees ===")
df = pd.read_sql("SELECT * FROM employees", conn)
print(df.to_string(index=False))

# ── Query 2: SELECT specific columns ────────────────────────────────
print("\\n=== Names and Departments ===")
df2 = pd.read_sql("SELECT name, department, salary FROM employees", conn)
print(df2.to_string(index=False))

# ── Query 3: WHERE — filter rows ────────────────────────────────────
print("\\n=== IT Department only ===")
df3 = pd.read_sql("""
    SELECT name, salary
    FROM   employees
    WHERE  department = 'IT'
""", conn)
print(df3.to_string(index=False))

# ── Query 4: WHERE + ORDER BY + LIMIT ───────────────────────────────
print("\\n=== Top 3 earners (salary DESC) ===")
df4 = pd.read_sql("""
    SELECT name, department, salary
    FROM   employees
    ORDER  BY salary DESC
    LIMIT  3
""", conn)
print(df4.to_string(index=False))

conn.close()`,
    content: `# Chapter 4 — SQL Basics: SELECT, WHERE & ORDER BY

## 🎯 What You'll Learn
What SQL is and why it is the most critical analyst skill; how to write your first SELECT query; retrieve specific columns; filter rows using WHERE; sort results with ORDER BY; and limit output with LIMIT.

---

## 1. What is SQL and Why Does It Matter?

**SQL (Structured Query Language)** is the standard language for communicating with relational databases. Every time you want to:
- Retrieve data from a database
- Filter rows matching certain conditions
- Sort results
- Count, sum, or average values

…you write a SQL query.

### Why SQL is #1 for Analysts

> 📊 SQL is listed in more data analyst job postings worldwide than Python, Excel, and Tableau **combined**.

Reasons:
- All company data lives in databases (not CSV files)
- SQL runs in every database system (MySQL, PostgreSQL, SQLite, BigQuery, Snowflake)
- One SQL query can process millions of rows in seconds
- It is the universal language that bridges analysts, engineers, and business teams

### How SQL Fits Into the Stack

\`\`\`
Business Question → SQL Query → Database → Results → Analysis
"Which product     SELECT ...   MySQL      Table     Chart /
 sells the most?"  FROM ...     BigQuery   of rows   Report
\`\`\`

---

## 2. The Anatomy of a Database

Before writing queries, understand what you are querying.

### Tables

A database contains one or more **tables** — like spreadsheets.

\`\`\`
employees table:
┌────┬─────────┬────────────┬────────┬──────────────┐
│ id │  name   │ department │ salary │  hire_year   │
├────┼─────────┼────────────┼────────┼──────────────┤
│  1 │ Alice   │ Sales      │  72000 │    2020      │
│  2 │ Bob     │ IT         │  95000 │    2018      │
│  3 │ Charlie │ Sales      │  68000 │    2022      │
│  4 │ Diana   │ HR         │  61000 │    2021      │
└────┴─────────┴────────────┴────────┴──────────────┘
\`\`\`

### Primary Key

Every table has a **primary key** — a column (or set of columns) that uniquely identifies each row. In the employees table, \`id\` is the primary key. No two rows can have the same id.

---

## 3. Your First Query: SELECT

The SELECT statement retrieves data from a table.

### Basic Syntax

\`\`\`sql
SELECT column1, column2, ...
FROM   table_name;
\`\`\`

### SELECT All Columns

\`\`\`sql
SELECT *
FROM   employees;
\`\`\`

The \`*\` (star/asterisk) means "all columns". Use this for quick exploration.

> ⚠️ In production, avoid SELECT * — always list the specific columns you need. It is faster and clearer.

### SELECT Specific Columns

\`\`\`sql
SELECT name, department, salary
FROM   employees;
\`\`\`

Result:
\`\`\`
name     | department | salary
---------|------------|--------
Alice    | Sales      | 72000
Bob      | IT         | 95000
Charlie  | Sales      | 68000
Diana    | HR         | 61000
\`\`\`

### Column Aliases with AS

Rename columns in the output:

\`\`\`sql
SELECT name          AS employee_name,
       salary        AS annual_salary,
       department    AS dept
FROM   employees;
\`\`\`

Aliases are only for display — they do not change the actual column names in the table.

---

## 4. Filtering with WHERE

WHERE filters rows based on a condition. Only rows where the condition is TRUE are returned.

### Basic Comparison Operators

\`\`\`sql
-- Equals
SELECT * FROM employees WHERE department = 'IT';

-- Not equals
SELECT * FROM employees WHERE department != 'HR';
SELECT * FROM employees WHERE department <> 'HR';   -- same thing

-- Greater than / less than
SELECT * FROM employees WHERE salary > 80000;
SELECT * FROM employees WHERE salary >= 80000;
SELECT * FROM employees WHERE salary < 70000;
SELECT * FROM employees WHERE salary <= 70000;
\`\`\`

### Text Matching — Case Sensitivity

\`\`\`sql
-- In most databases, string comparisons are case-sensitive
WHERE department = 'it'      -- ❌ won't match 'IT'
WHERE department = 'IT'      -- ✅ correct

-- SQLite is case-insensitive for ASCII by default
-- PostgreSQL and MySQL are case-sensitive
\`\`\`

### Filtering by Numbers

\`\`\`sql
-- Find employees hired in 2020
SELECT name, hire_year
FROM   employees
WHERE  hire_year = 2020;

-- Find recent hires (after 2021)
SELECT name, hire_year
FROM   employees
WHERE  hire_year > 2021;
\`\`\`

### NULL Values — A Special Case

NULL means "no value" or "unknown". You cannot use = to check for NULL.

\`\`\`sql
-- WRONG:
WHERE phone_number = NULL     -- never returns anything!

-- CORRECT:
WHERE phone_number IS NULL    -- finds rows where phone is missing
WHERE phone_number IS NOT NULL -- finds rows where phone exists
\`\`\`

---

## 5. Sorting with ORDER BY

ORDER BY sorts the result set by one or more columns.

\`\`\`sql
-- Ascending (A-Z, smallest to largest) — DEFAULT
SELECT name, salary
FROM   employees
ORDER  BY salary;

-- Descending (Z-A, largest to smallest)
SELECT name, salary
FROM   employees
ORDER  BY salary DESC;
\`\`\`

### Sort by Multiple Columns

\`\`\`sql
-- Sort by department A-Z, then by salary highest to lowest within each dept
SELECT name, department, salary
FROM   employees
ORDER  BY department ASC, salary DESC;
\`\`\`

Result:
\`\`\`
name    | department | salary
--------|------------|--------
Diana   | HR         | 61000
Frank   | HR         | 58000
Eve     | IT         | 102000
Bob     | IT         | 95000
Grace   | IT         | 88000
Hank    | Sales      | 75000
Alice   | Sales      | 72000
Charlie | Sales      | 68000
\`\`\`

---

## 6. Limiting Results with LIMIT

LIMIT restricts how many rows are returned. Essential for large tables.

\`\`\`sql
-- Top 5 highest-paid employees
SELECT name, salary
FROM   employees
ORDER  BY salary DESC
LIMIT  5;

-- Quick preview of a large table (always do this first!)
SELECT *
FROM   orders
LIMIT  10;
\`\`\`

> 💡 **Best practice:** Always add LIMIT when exploring an unfamiliar table. You do not want to accidentally return 10 million rows.

### OFFSET — Skip Rows

\`\`\`sql
-- Get rows 11 to 20 (skip first 10, then take 10)
SELECT name, salary
FROM   employees
ORDER  BY salary DESC
LIMIT  10 OFFSET 10;
\`\`\`

Used for pagination (page 1, page 2, etc.).

---

## 7. The Full Standard Query Order

SQL has a strict clause ORDER. You must write them in this sequence:

\`\`\`sql
SELECT  column1, column2         -- 1. Which columns?
FROM    table_name               -- 2. Which table?
WHERE   condition                -- 3. Which rows? (optional)
ORDER   BY column ASC/DESC       -- 4. In what order? (optional)
LIMIT   n;                       -- 5. How many rows? (optional)
\`\`\`

### Complete Example

\`\`\`sql
-- Find the top 3 highest-paid IT employees hired after 2018
SELECT   name,
         salary,
         hire_year
FROM     employees
WHERE    department = 'IT'
  AND    hire_year  > 2018
ORDER    BY salary DESC
LIMIT    3;
\`\`\`

Step-by-step:
1. **FROM** employees — start with the full table (8 rows)
2. **WHERE** department = 'IT' AND hire_year > 2018 — filter to IT staff hired after 2018
3. **SELECT** name, salary, hire_year — keep only these columns
4. **ORDER BY** salary DESC — highest salary first
5. **LIMIT** 3 — return only the top 3

---

## 8. Practice with Real Scenarios

\`\`\`sql
-- 1. Show all employees from Mumbai
SELECT name, department, salary
FROM   employees
WHERE  city = 'Mumbai';

-- 2. Who earns more than the national average (say 75,000)?
SELECT name, salary
FROM   employees
WHERE  salary > 75000
ORDER  BY salary DESC;

-- 3. Which employees were hired in the last 3 years?
SELECT name, hire_year
FROM   employees
WHERE  hire_year >= 2022;

-- 4. Show the 5 most recently hired employees
SELECT name, hire_year
FROM   employees
ORDER  BY hire_year DESC
LIMIT  5;

-- 5. Show employees NOT in Sales or HR
SELECT name, department
FROM   employees
WHERE  department != 'Sales'
  AND  department != 'HR';
\`\`\`

> 🎯 **Learning tip:** Run every query above. Change the values. What happens if you change > to >=? What if you remove LIMIT? Experimenting is the fastest way to learn SQL.`,
    questions: [
      q('What does SELECT * FROM employees; do?',
        [{ id: 'a', text: 'Selects only the first column of the employees table' }, { id: 'b', text: 'Returns every row and every column from the employees table' }, { id: 'c', text: 'Counts the number of rows in the employees table' }, { id: 'd', text: 'Deletes all rows from the employees table' }],
        'b', 'SELECT * means "select all columns." Combined with FROM employees, it returns every row and every column from the table — the simplest possible query, useful for a quick preview of a table.', 0),
      q('Which SQL clause filters rows based on a condition?',
        [{ id: 'a', text: 'ORDER BY' }, { id: 'b', text: 'LIMIT' }, { id: 'c', text: 'SELECT' }, { id: 'd', text: 'WHERE' }],
        'd', 'WHERE filters rows before they are returned. Only rows where the condition evaluates to TRUE are included in the result set. ORDER BY sorts, LIMIT restricts count, SELECT chooses columns.', 1),
      q('What does ORDER BY salary DESC do?',
        [{ id: 'a', text: 'Filters employees with salary above a threshold' }, { id: 'b', text: 'Sorts results from highest salary to lowest salary' }, { id: 'c', text: 'Sorts results from lowest salary to highest salary' }, { id: 'd', text: 'Removes duplicate salary values' }],
        'b', 'DESC = Descending order = highest to lowest. ORDER BY salary DESC puts the highest salary first, which is how you find top earners. ASC (ascending, the default) goes lowest to highest.', 2),
      q('How do you correctly check for NULL (missing) values in a SQL WHERE clause?',
        [{ id: 'a', text: 'WHERE phone = NULL' }, { id: 'b', text: 'WHERE phone == NULL' }, { id: 'c', text: 'WHERE phone IS NULL' }, { id: 'd', text: 'WHERE phone = "NULL"' }],
        'c', 'NULL is not a value — it is the absence of a value. You cannot use = to compare with NULL (it always returns false). The correct syntax is IS NULL (or IS NOT NULL), which is a special SQL operator designed for this purpose.', 3),
      q('What does LIMIT 10 do in a SQL query?',
        [{ id: 'a', text: 'Filters rows where a column value is less than 10' }, { id: 'b', text: 'Restricts the result to at most 10 rows' }, { id: 'c', text: 'Skips the first 10 rows' }, { id: 'd', text: 'Returns every 10th row from the table' }],
        'b', 'LIMIT n restricts output to the first n rows of the result set (after ORDER BY if present). It is essential when exploring large tables — without LIMIT on a million-row table, you could wait minutes for the full result.', 4),
      q('In SQL, what is a PRIMARY KEY?',
        [{ id: 'a', text: 'The most important column for analytics (usually salary or revenue)' }, { id: 'b', text: 'A column that must always be filled in (NOT NULL)' }, { id: 'c', text: 'A column (or set of columns) that uniquely identifies each row — no duplicates allowed' }, { id: 'd', text: 'The first column listed in a SELECT statement' }],
        'c', 'A primary key uniquely identifies each row in a table. No two rows can have the same primary key value, and it cannot be NULL. Typical examples: employee_id, order_id, customer_id — auto-generated unique numbers.', 5),
      q('What is the correct order of clauses in a SQL query?',
        [{ id: 'a', text: 'WHERE → FROM → SELECT → ORDER BY → LIMIT' }, { id: 'b', text: 'FROM → WHERE → SELECT → LIMIT → ORDER BY' }, { id: 'c', text: 'SELECT → FROM → WHERE → ORDER BY → LIMIT' }, { id: 'd', text: 'SELECT → WHERE → FROM → ORDER BY → LIMIT' }],
        'c', 'SQL clauses must appear in this exact order: SELECT (which columns), FROM (which table), WHERE (filter rows), ORDER BY (sort), LIMIT (max rows). Writing them out of order causes a syntax error.', 6),
      q('SELECT name AS employee_name FROM employees — what does the AS keyword do?',
        [{ id: 'a', text: 'Creates a new column called "employee_name" in the database permanently' }, { id: 'b', text: 'Renames the "name" column to "employee_name" in the query output only' }, { id: 'c', text: 'Joins two tables named "name" and "employee_name"' }, { id: 'd', text: 'Filters rows where name equals employee_name' }],
        'b', 'AS creates an alias — a temporary name for the column in the query results only. The actual column in the database remains called "name". Aliases improve readability in output and are required when using expressions like SUM(salary) AS total_salary.', 7),
      q('Which query correctly finds all employees with salary greater than or equal to 80,000?',
        [{ id: 'a', text: 'SELECT * FROM employees WHERE salary > 80000 OR salary = 80000' }, { id: 'b', text: 'SELECT * FROM employees WHERE salary >= 80000' }, { id: 'c', text: 'SELECT * FROM employees HAVING salary >= 80000' }, { id: 'd', text: 'SELECT * FROM employees WHERE salary => 80000' }],
        'b', 'The >= operator means "greater than or equal to." It is the correct operator for ≥ in SQL. Option A also works logically but is unnecessarily verbose. HAVING is used after GROUP BY, not for row filtering. => is not valid SQL.', 8),
      q('Why is it a best practice to list specific columns instead of SELECT * in production queries?',
        [{ id: 'a', text: 'SELECT * is not valid SQL — it causes errors' }, { id: 'b', text: 'Listing specific columns is faster (less data transferred) and makes the code self-documenting' }, { id: 'c', text: 'SELECT * cannot be used with a WHERE clause' }, { id: 'd', text: 'Specific columns improve security by hiding passwords from other tables' }],
        'b', 'Explicitly listing columns is a best practice because: (1) less data is transferred from DB to application, (2) the query communicates intent clearly, (3) it breaks helpfully if the schema changes — rather than silently returning unexpected columns.', 9),
      q('How do you sort results by department alphabetically (A-Z) and then by salary from highest to lowest within each department?',
        [{ id: 'a', text: 'ORDER BY department, salary' }, { id: 'b', text: 'ORDER BY department ASC, salary DESC' }, { id: 'c', text: 'ORDER BY department DESC, salary ASC' }, { id: 'd', text: 'SORT BY department, salary DESC' }],
        'b', 'Multi-column ORDER BY: department ASC (A-Z alphabetically, ASC is the default), then salary DESC (highest first within each department). Each column gets its own ASC/DESC specification.', 10),
      q('SELECT * FROM orders LIMIT 100 OFFSET 200 — what rows does this return?',
        [{ id: 'a', text: 'The first 100 rows of the orders table' }, { id: 'b', text: 'Rows 201 to 300 (skip 200, then take 100)' }, { id: 'c', text: 'The last 100 rows of the orders table' }, { id: 'd', text: 'Rows 100 to 200' }],
        'b', 'OFFSET 200 skips the first 200 rows; LIMIT 100 then returns the next 100. So you get rows 201 through 300. This is the SQL pagination pattern — used to fetch "page 3" of a result set where each page shows 100 rows.', 11),
      q('Which SQL query would find all employees NOT in the IT department?',
        [{ id: 'a', text: 'SELECT * FROM employees WHERE department = NOT "IT"' }, { id: 'b', text: 'SELECT * FROM employees REMOVE department = "IT"' }, { id: 'c', text: 'SELECT * FROM employees WHERE department != "IT"' }, { id: 'd', text: 'SELECT * FROM employees WITHOUT department = "IT"' }],
        'c', '!= means "not equal to" in SQL (the alternative <> also works). So WHERE department != "IT" filters out IT rows and returns all other departments. NOT, REMOVE, WITHOUT are not valid SQL operators for this use.', 12),
      q('Which statement about SQL is TRUE?',
        [{ id: 'a', text: 'SQL only works with MySQL — other databases use different languages' }, { id: 'b', text: 'SQL is the standard language for relational databases and works across MySQL, PostgreSQL, SQLite, BigQuery, Snowflake, and more' }, { id: 'c', text: 'SQL can only retrieve data — it cannot filter or sort' }, { id: 'd', text: 'SQL is being replaced by Python and will be obsolete by 2030' }],
        'b', 'SQL is a standard (with minor dialect differences between databases). The same core SELECT/FROM/WHERE/GROUP BY syntax works on MySQL, PostgreSQL, SQLite, Google BigQuery, Snowflake, Redshift, and more. It is not going away — it has been growing in adoption for 50 years.', 13),
      q('What is the purpose of a SQL alias (AS)?',
        [{ id: 'a', text: 'To permanently rename a column or table in the database' }, { id: 'b', text: 'To give a column or table a temporary, readable name in the query output' }, { id: 'c', text: 'To create a copy of a table with a new name' }, { id: 'd', text: 'To reference a different schema or database' }],
        'b', 'Aliases are temporary — they exist only for the duration of the query. They are useful for: making column names readable (SUM(salary) AS total_salary), shortening table names in JOINs (employees AS e), and naming calculated expressions.', 14),
    ],
  },
];

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Data Analytics — Noob Level Block 1\n');

  // 1. Find the course
  const course = await prisma.course.findUnique({ where: { slug: COURSE_SLUG } });
  if (!course) { console.error('❌ Course not found! Run the main seed first.'); process.exit(1); }

  // 2. Re-index existing chapters to make room for NOOB chapters (0-99)
  console.log('📐 Re-indexing existing chapters...');
  await prisma.$executeRawUnsafe(`UPDATE Chapter SET orderIndex = 100 WHERE slug = 'da1-pandas-numpy-foundations'`);
  await prisma.$executeRawUnsafe(`UPDATE Chapter SET orderIndex = 200 WHERE slug = 'da2-data-cleaning-preprocessing'`);
  await prisma.$executeRawUnsafe(`UPDATE Chapter SET orderIndex = 300 WHERE slug = 'da3-eda-visualisation'`);
  await prisma.$executeRawUnsafe(`UPDATE Chapter SET orderIndex = 400 WHERE slug = 'da4-sql-for-analytics'`);
  console.log('  ✅ AMATEUR → 100, PRO → 200, MASTER → 300, GOD → 400\n');

  // 3. Seed new NOOB chapters
  console.log(`📚 Seeding ${CHAPTERS.length} Noob Level chapters...\n`);

  for (const ch of CHAPTERS) {
    const { questions, ...chapterData } = ch as any;

    // Skip if already seeded
    const existing = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM Chapter WHERE courseId = ? AND slug = ?`,
      course.id, chapterData.slug,
    );
    if (existing.length > 0) {
      console.log(`  ⏭️  [${chapterData.orderIndex}] ${chapterData.title} — already exists, skipping`);
      continue;
    }

    const chapter = await prisma.chapter.create({
      data: { ...chapterData, courseId: course.id },
    });

    await prisma.quiz.create({
      data: {
        chapterId:    chapter.id,
        title:        `${chapterData.title} — Quiz`,
        description:  `Test your understanding of ${chapterData.title}`,
        timeLimit:    1800,
        passingScore: 70,
        xpReward:     Math.round(chapterData.xpReward * 1.5),
        questions:    { create: questions },
      },
    });

    console.log(`  ✅ [${chapterData.orderIndex}] ${chapterData.title}  (${questions.length} Qs · ${chapterData.xpReward} XP · ${chapterData.tier})`);
  }

  console.log('\n🎉 Block 1 complete! Noob Level now has chapters 0-4.');
  console.log('   Next: run seed:da-noob-b2 for SQL Filtering, Aggregation & Joins');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
