/**
 * dataAnalyticsNoobBlock2.ts
 * Noob Level — Block 2 (Chapters 5–8)
 *
 * Covers:
 *   Ch 5 — SQL Filtering: AND/OR, IN, BETWEEN, LIKE
 *   Ch 6 — SQL Aggregation: COUNT, SUM, AVG, GROUP BY, HAVING
 *   Ch 7 — Python Fundamentals for Data Analysts
 *   Ch 8 — Pandas for Beginners
 *
 * Run:  cd backend && npm run seed:da-noob-b2
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

const CHAPTERS = [

  // ══════════════════════════════════════════════
  // CHAPTER 5 — SQL FILTERING: AND, OR, IN, BETWEEN, LIKE
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-5-sql-filtering',
    title:       'SQL Filtering — AND, OR, IN, BETWEEN & LIKE',
    description: 'Write precise WHERE clauses using multiple conditions with AND/OR, match lists with IN, filter ranges with BETWEEN, and search text patterns with LIKE.',
    orderIndex:  5,
    xpReward:    80,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    codeExample: `import sqlite3, pandas as pd

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE products (
    id       INTEGER PRIMARY KEY,
    name     TEXT, category TEXT,
    price    REAL,  rating   REAL,
    in_stock INTEGER, launch_year INTEGER
);
INSERT INTO products VALUES
(1,'Laptop Pro',   'Electronics', 999.99, 4.5, 1, 2022),
(2,'Wireless Mouse','Electronics', 29.99, 4.2, 1, 2021),
(3,'Python Book',  'Books',        49.99, 4.8, 1, 2023),
(4,'Yoga Mat',     'Sports',       24.99, 4.0, 0, 2022),
(5,'Headphones',   'Electronics', 149.99, 4.6, 1, 2021),
(6,'Data Science Book','Books',    59.99, 4.7, 1, 2023),
(7,'Running Shoes','Sports',       89.99, 4.3, 1, 2022),
(8,'Tablet',       'Electronics', 449.99, 4.1, 0, 2023),
(9,'Notebook',     'Stationery',   5.99, 3.8, 1, 2021),
(10,'Smartwatch',  'Electronics', 299.99, 4.4, 1, 2022);
""")
conn.commit()

# AND — multiple conditions ALL true
r1 = pd.read_sql("""
    SELECT name, price, rating FROM products
    WHERE  category = 'Electronics' AND price < 200 AND in_stock = 1
""", conn)
print("=== Electronics under \$200 in stock ==="); print(r1.to_string(index=False))

# IN — match one of several values
r2 = pd.read_sql("""
    SELECT name, category FROM products
    WHERE  category IN ('Electronics', 'Books')
    ORDER  BY category, name
""", conn)
print("\\n=== Electronics or Books ==="); print(r2.to_string(index=False))

# BETWEEN — inclusive range
r3 = pd.read_sql("""
    SELECT name, price FROM products
    WHERE  price BETWEEN 25 AND 150
    ORDER  BY price
""", conn)
print("\\n=== Price between \$25 and \$150 ==="); print(r3.to_string(index=False))

# LIKE — pattern matching
r4 = pd.read_sql("""
    SELECT name FROM products
    WHERE  name LIKE '%Book%'
""", conn)
print("\\n=== Products with 'Book' in name ==="); print(r4.to_string(index=False))

conn.close()`,
    content: `# Chapter 5 — SQL Filtering: AND, OR, IN, BETWEEN & LIKE

## 🎯 What You'll Learn
Build powerful, precise WHERE clauses using multiple conditions with AND and OR; match against a list of values with IN; filter numeric and date ranges with BETWEEN; and search for text patterns with LIKE and wildcard characters.

---

## 1. Combining Conditions: AND & OR

Real queries almost always filter on multiple conditions at once.

### AND — All Conditions Must Be True

\`\`\`sql
SELECT name, price, rating
FROM   products
WHERE  category = 'Electronics'
  AND  price < 200
  AND  in_stock = 1;
\`\`\`

Only rows where ALL three conditions are true are returned.

\`\`\`
Think of AND like a security checkpoint:
Gate 1: Must be Electronics ✓
Gate 2: Must cost less than $200 ✓
Gate 3: Must be in stock ✓
Only if ALL gates pass → row is included
\`\`\`

### OR — At Least One Condition Must Be True

\`\`\`sql
SELECT name, category, price
FROM   products
WHERE  category = 'Sports'
   OR  category = 'Books';
\`\`\`

Any row where EITHER condition is true is returned.

\`\`\`
Think of OR like a VIP list:
"Is it Sports? → include it"
"Is it Books? → include it"
Belongs to neither? → exclude
\`\`\`

### Mixing AND with OR — Use Parentheses!

\`\`\`sql
-- Without parentheses — ambiguous, often wrong:
WHERE category = 'Electronics' OR category = 'Books' AND price < 50

-- With parentheses — clear and correct:
WHERE (category = 'Electronics' OR category = 'Books') AND price < 50
\`\`\`

> ⚠️ **AND has higher precedence than OR** (like × before + in maths). Always use parentheses when mixing AND and OR to make your intent explicit.

**Rule of thumb:** "And before Or — use brackets to be sure."

---

## 2. NOT — Invert a Condition

\`\`\`sql
-- Exclude a specific category
SELECT * FROM products WHERE NOT category = 'Electronics';
-- Same as:
SELECT * FROM products WHERE category != 'Electronics';

-- Exclude multiple categories
SELECT * FROM products
WHERE  NOT (category = 'Electronics' OR category = 'Sports');
\`\`\`

---

## 3. IN — Match Against a List

Instead of chaining many OR conditions, use IN for cleaner code.

### Without IN (verbose):
\`\`\`sql
SELECT * FROM products
WHERE  category = 'Electronics'
   OR  category = 'Books'
   OR  category = 'Sports';
\`\`\`

### With IN (clean):
\`\`\`sql
SELECT * FROM products
WHERE  category IN ('Electronics', 'Books', 'Sports');
\`\`\`

Both queries return the same result. IN is preferred for readability.

### NOT IN — Exclude a List
\`\`\`sql
SELECT * FROM products
WHERE  category NOT IN ('Stationery', 'Sports');
\`\`\`

> ⚠️ **NULL trap with NOT IN:** If the list contains even one NULL value, NOT IN returns no rows (unexpected). Always ensure your IN list has no NULLs.

---

## 4. BETWEEN — Inclusive Range Filtering

BETWEEN is shorthand for >= AND <=. Both endpoints are **included**.

### Numeric ranges:
\`\`\`sql
-- Products priced between $25 and $150 (inclusive)
SELECT name, price
FROM   products
WHERE  price BETWEEN 25 AND 150;

-- Equivalent to:
WHERE  price >= 25 AND price <= 150
\`\`\`

### Date ranges:
\`\`\`sql
-- Orders placed in Q1 2024
SELECT order_id, amount, order_date
FROM   orders
WHERE  order_date BETWEEN '2024-01-01' AND '2024-03-31';
\`\`\`

### NOT BETWEEN:
\`\`\`sql
-- Products NOT in the mid-price range (exclude $50–$200)
SELECT name, price
FROM   products
WHERE  price NOT BETWEEN 50 AND 200;
\`\`\`

---

## 5. LIKE — Text Pattern Matching

LIKE searches for a pattern in text columns using wildcard characters.

### Wildcard Characters

| Wildcard | Meaning | Example |
|----------|---------|---------|
| \`%\` | Zero or more characters | \`LIKE '%book%'\` matches "Python Book", "Book Club", "Notebook" |
| \`_\` | Exactly one character | \`LIKE 'Bo_'\` matches "Bob", "Box", "Boy" |

### LIKE Examples

\`\`\`sql
-- Starts with "Python"
WHERE name LIKE 'Python%'
-- Matches: "Python Book", "Python Guide", "Python 3.12"

-- Ends with "Book"
WHERE name LIKE '%Book'
-- Matches: "Python Book", "Data Science Book"

-- Contains "Book" anywhere
WHERE name LIKE '%Book%'
-- Matches: "Python Book", "Notebook", "Data Science Book"

-- Exactly 3 characters
WHERE code LIKE '___'
-- Matches: "SKU", "A12", "ZZZ"

-- Email ending with @gmail.com
WHERE email LIKE '%@gmail.com'

-- Names starting with 'A'
WHERE name LIKE 'A%'
\`\`\`

### NOT LIKE
\`\`\`sql
-- Products that do NOT contain "Pro" in the name
SELECT name FROM products
WHERE  name NOT LIKE '%Pro%';
\`\`\`

> 💡 **Case sensitivity:** LIKE is case-insensitive in SQLite and MySQL but case-sensitive in PostgreSQL. Use ILIKE in PostgreSQL for case-insensitive matching.

---

## 6. Combining All Operators — Real-World Examples

\`\`\`sql
-- Scenario 1: Find affordable, highly-rated electronics in stock
SELECT name, price, rating
FROM   products
WHERE  category = 'Electronics'
  AND  price BETWEEN 20 AND 300
  AND  rating >= 4.3
  AND  in_stock = 1
ORDER  BY rating DESC;

-- Scenario 2: Find books or sports equipment launched recently
SELECT name, category, launch_year
FROM   products
WHERE  category IN ('Books', 'Sports')
  AND  launch_year >= 2022;

-- Scenario 3: Find products with "Pro" or "Smart" in the name
SELECT name, price
FROM   products
WHERE  name LIKE '%Pro%'
   OR  name LIKE '%Smart%';

-- Scenario 4: Mid-range products that are NOT electronics
SELECT name, category, price
FROM   products
WHERE  price BETWEEN 30 AND 200
  AND  category NOT IN ('Electronics')
ORDER  BY price;
\`\`\`

---

## 7. WHERE Clause Quick Reference

\`\`\`sql
-- Comparison operators
WHERE salary > 80000           -- greater than
WHERE salary >= 80000          -- greater than or equal
WHERE salary < 50000           -- less than
WHERE salary = 72000           -- exact match
WHERE salary != 72000          -- not equal (also: <>)

-- Logic operators
WHERE dept = 'IT' AND salary > 80000       -- both true
WHERE dept = 'IT' OR dept = 'Sales'        -- either true
WHERE NOT dept = 'HR'                       -- not HR

-- List and range
WHERE dept IN ('IT', 'Sales', 'Finance')   -- in list
WHERE salary BETWEEN 60000 AND 100000      -- inclusive range

-- NULL checks
WHERE phone IS NULL                         -- missing value
WHERE phone IS NOT NULL                     -- has a value

-- Pattern matching
WHERE name LIKE 'Al%'                       -- starts with Al
WHERE email LIKE '%@company.com'            -- ends with domain
WHERE code LIKE 'SK_-%'                     -- complex pattern
\`\`\``,
    questions: [
      q('What does the AND operator require in a WHERE clause?',
        [{ id: 'a', text: 'At least one of the conditions must be true' }, { id: 'b', text: 'None of the conditions must be true' }, { id: 'c', text: 'All conditions must be true for a row to be included' }, { id: 'd', text: 'Exactly one condition must be true' }],
        'c', 'AND is a strict operator — every connected condition must evaluate to TRUE for the row to pass the filter. If even one condition is false, the row is excluded. Think of it as all checkpoints in a series.', 0),
      q('Which query correctly finds products in either the "Books" or "Sports" category using the most concise syntax?',
        [{ id: 'a', text: 'WHERE category = "Books" AND category = "Sports"' }, { id: 'b', text: 'WHERE category IN ("Books", "Sports")' }, { id: 'c', text: 'WHERE category BETWEEN "Books" AND "Sports"' }, { id: 'd', text: 'WHERE category LIKE "Books" OR "Sports"' }],
        'b', 'IN is the concise way to check if a value matches any item in a list. WHERE category = "Books" AND category = "Sports" would return nothing (a row cannot be both simultaneously). BETWEEN works on ranges, not categorical lists.', 1),
      q('What does WHERE price BETWEEN 50 AND 200 return?',
        [{ id: 'a', text: 'Rows where price is strictly between 50 and 200 (50 and 200 excluded)' }, { id: 'b', text: 'Rows where price is 50 or 200 only' }, { id: 'c', text: 'Rows where price is >= 50 AND <= 200 (both endpoints included)' }, { id: 'd', text: 'Rows where price is < 50 OR > 200' }],
        'c', 'BETWEEN in SQL is always inclusive of both endpoints. BETWEEN 50 AND 200 is exactly equivalent to >= 50 AND <= 200. A price of exactly 50 or exactly 200 would both be included in the results.', 2),
      q('Which LIKE pattern matches email addresses ending in "@gmail.com"?',
        [{ id: 'a', text: 'LIKE "@gmail.com"' }, { id: 'b', text: 'LIKE "_@gmail.com"' }, { id: 'c', text: 'LIKE "%@gmail.com"' }, { id: 'd', text: 'LIKE "@gmail.com%"' }],
        'c', '% matches zero or more characters. LIKE "%@gmail.com" matches any string that ends with "@gmail.com" — the % at the start matches everything before the @ sign. LIKE "@gmail.com%" would match strings that START with @gmail.com, which is wrong.', 3),
      q('What is the danger of using NOT IN when the list might contain NULL values?',
        [{ id: 'a', text: 'NOT IN converts NULLs to zero, giving wrong counts' }, { id: 'b', text: 'NOT IN with a NULL in the list returns no rows — a silent, unexpected result' }, { id: 'c', text: 'NOT IN cannot be used with text values, only numbers' }, { id: 'd', text: 'There is no special issue — NULL is treated like any other value' }],
        'b', 'In SQL, any comparison with NULL yields UNKNOWN (not TRUE or FALSE). When the NOT IN list contains a NULL, every row comparison evaluates to UNKNOWN, which filters out ALL rows. Always ensure your IN/NOT IN list contains no NULLs.', 4),
      q('Why should you use parentheses when mixing AND with OR?',
        [{ id: 'a', text: 'Parentheses are required for syntax — SQL rejects queries without them' }, { id: 'b', text: 'AND has higher precedence than OR, so without parentheses the logic may not match your intent' }, { id: 'c', text: 'Parentheses make AND conditions work like OR conditions' }, { id: 'd', text: 'Parentheses are only needed when using LIKE or BETWEEN' }],
        'b', 'AND is evaluated before OR (like multiplication before addition in maths). WHERE a=1 OR b=2 AND c=3 is read as WHERE a=1 OR (b=2 AND c=3) — not as (a=1 OR b=2) AND c=3. Parentheses make your intent explicit and prevent logic bugs.', 5),
      q('Which wildcard character in LIKE matches exactly ONE character?',
        [{ id: 'a', text: '% (percent sign)' }, { id: 'b', text: '* (asterisk)' }, { id: 'c', text: '_ (underscore)' }, { id: 'd', text: '? (question mark)' }],
        'c', 'The underscore (_) matches exactly one character in a LIKE pattern. % matches zero or more characters. So LIKE "B_b" matches "Bob", "Bab", "Bcb" but not "Bb" (too short) or "Baab" (too long).', 6),
      q('SELECT * FROM orders WHERE amount NOT BETWEEN 100 AND 500 — what is returned?',
        [{ id: 'a', text: 'Orders with amount between 100 and 500' }, { id: 'b', text: 'Orders with amount exactly 100 or exactly 500' }, { id: 'c', text: 'Orders with amount < 100 OR amount > 500' }, { id: 'd', text: 'Orders with amount < 100 AND amount > 500 (impossible — returns nothing)' }],
        'c', 'NOT BETWEEN excludes the range. It is equivalent to amount < 100 OR amount > 500. The OR is correct because a value cannot simultaneously be less than 100 AND greater than 500 — the two conditions are on either side of the excluded range.', 7),
      q('Which query finds all products whose name contains the word "Pro" anywhere in it?',
        [{ id: 'a', text: 'WHERE name = "Pro"' }, { id: 'b', text: 'WHERE name LIKE "Pro"' }, { id: 'c', text: 'WHERE name LIKE "%Pro%"' }, { id: 'd', text: 'WHERE name IN ("%Pro%")' }],
        'c', 'LIKE "%Pro%" places % on both sides — this matches any string that has "Pro" anywhere: at the start, middle, or end. LIKE "Pro" (no wildcards) matches only the exact string "Pro". IN does not interpret LIKE wildcards.', 8),
      q('How would you find employees in IT OR Sales with salary above 70,000?',
        [{ id: 'a', text: 'WHERE dept IN ("IT","Sales") AND salary > 70000' }, { id: 'b', text: 'WHERE dept = "IT" OR dept = "Sales" AND salary > 70000' }, { id: 'c', text: 'WHERE dept IN ("IT","Sales") OR salary > 70000' }, { id: 'd', text: 'WHERE salary > 70000 AND dept = "IT" OR "Sales"' }],
        'a', 'Using IN for the department list and AND for the salary condition is the cleanest approach. Option B is ambiguous (AND has higher precedence — it would be read as IT OR (Sales AND salary>70k)). Always use IN when checking multiple values for the same column.', 9),
      q('What does WHERE launch_year BETWEEN 2020 AND 2023 return?',
        [{ id: 'a', text: 'Only years 2021 and 2022 (exclusive of endpoints)' }, { id: 'b', text: 'Years 2020, 2021, 2022, and 2023 (all four years inclusive)' }, { id: 'c', text: 'Years before 2020 and after 2023' }, { id: 'd', text: 'Only 2020 and 2023 (the endpoints only)' }],
        'b', 'BETWEEN includes both endpoints. BETWEEN 2020 AND 2023 returns rows where launch_year is 2020, 2021, 2022, or 2023 — all four values. This is equivalent to launch_year >= 2020 AND launch_year <= 2023.', 10),
      q('In PostgreSQL (unlike SQLite), what is the case-sensitive alternative to LIKE for case-insensitive pattern matching?',
        [{ id: 'a', text: 'LIKECASE' }, { id: 'b', text: 'SIMILAR TO' }, { id: 'c', text: 'ILIKE' }, { id: 'd', text: 'MATCH' }],
        'c', 'ILIKE is a PostgreSQL extension that works exactly like LIKE but case-insensitively. WHERE name ILIKE "%python%" matches "Python", "PYTHON", "python" and any mix. SQLite and MySQL are case-insensitive for LIKE by default.', 11),
      q('What does NOT LIKE do?',
        [{ id: 'a', text: 'Inverts the LIKE pattern — returns rows that do NOT match the pattern' }, { id: 'b', text: 'Performs an exact match instead of a pattern match' }, { id: 'c', text: 'NOT LIKE is not valid SQL syntax' }, { id: 'd', text: 'Matches only NULL values in the column' }],
        'a', 'NOT LIKE is the negation of LIKE — it returns rows where the column does NOT match the pattern. WHERE name NOT LIKE "%Pro%" returns all products that do not have "Pro" anywhere in their name.', 12),
      q('You want customers from cities: "Mumbai", "Delhi", or "Bangalore". Which WHERE clause is most efficient?',
        [{ id: 'a', text: 'WHERE city = "Mumbai" OR city = "Delhi" OR city = "Bangalore"' }, { id: 'b', text: 'WHERE city IN ("Mumbai", "Delhi", "Bangalore")' }, { id: 'c', text: 'WHERE city BETWEEN "Mumbai" AND "Bangalore"' }, { id: 'd', text: 'Both A and B are identical in efficiency — choose either' }],
        'b', 'Both A and B return the same result, but IN is cleaner and more readable. For three values the performance difference is negligible, but with 10+ values IN becomes significantly more readable and maintainable than a chain of OR conditions.', 13),
      q('SELECT name FROM employees WHERE name LIKE "A_i_e" — how many characters must the name have?',
        [{ id: 'a', text: '3 characters' }, { id: 'b', text: '4 characters' }, { id: 'c', text: '5 characters' }, { id: 'd', text: 'Any number — % matches any length' }],
        'c', 'LIKE "A_i_e" has 5 character positions: A (literal), _ (1 char), i (literal), _ (1 char), e (literal) = exactly 5 characters total. The _ wildcard matches exactly ONE character — not zero, not two. "Alice" would match; "Allie" would match; "Alie" (4 chars) would not.', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 6 — SQL AGGREGATION: GROUP BY & HAVING
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-6-sql-aggregation',
    title:       'SQL Aggregation — GROUP BY, HAVING & Aggregate Functions',
    description: 'Use COUNT, SUM, AVG, MAX, MIN to summarise data; group rows with GROUP BY; and filter groups with HAVING — the core of all SQL analytics.',
    orderIndex:  6,
    xpReward:    85,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    codeExample: `import sqlite3, pandas as pd

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE orders (
    id         INTEGER PRIMARY KEY,
    customer   TEXT,
    region     TEXT,
    product    TEXT,
    category   TEXT,
    amount     REAL,
    quantity   INTEGER,
    order_date TEXT
);
INSERT INTO orders VALUES
(1,'Alice','North','Laptop','Electronics',999,1,'2024-01-05'),
(2,'Bob','South','T-Shirt','Clothing',29,3,'2024-01-07'),
(3,'Alice','North','Mouse','Electronics',29,2,'2024-01-10'),
(4,'Charlie','East','Novel','Books',15,1,'2024-01-12'),
(5,'Bob','South','Headphones','Electronics',149,1,'2024-01-15'),
(6,'Diana','North','Python Book','Books',50,2,'2024-01-18'),
(7,'Charlie','East','Laptop','Electronics',999,1,'2024-01-20'),
(8,'Eve','West','Yoga Mat','Sports',25,1,'2024-01-22'),
(9,'Alice','North','Headphones','Electronics',149,1,'2024-01-25'),
(10,'Bob','South','T-Shirt','Clothing',29,5,'2024-01-28');
""")
conn.commit()

# ── 1. Basic aggregate functions ─────────────────────────────────────
basics = pd.read_sql("""
    SELECT COUNT(*)          AS total_orders,
           SUM(amount)       AS total_revenue,
           ROUND(AVG(amount),2) AS avg_order_value,
           MAX(amount)       AS largest_order,
           MIN(amount)       AS smallest_order
    FROM   orders
""", conn)
print("=== Overall Stats ===")
print(basics.to_string(index=False))

# ── 2. GROUP BY — revenue per region ────────────────────────────────
by_region = pd.read_sql("""
    SELECT region,
           COUNT(*)            AS order_count,
           SUM(amount)         AS total_revenue,
           ROUND(AVG(amount),2) AS avg_order
    FROM   orders
    GROUP  BY region
    ORDER  BY total_revenue DESC
""", conn)
print("\\n=== Revenue by Region ===")
print(by_region.to_string(index=False))

# ── 3. HAVING — only regions with 3+ orders ──────────────────────────
top_regions = pd.read_sql("""
    SELECT region, COUNT(*) AS order_count, SUM(amount) AS revenue
    FROM   orders
    GROUP  BY region
    HAVING COUNT(*) >= 3
    ORDER  BY revenue DESC
""", conn)
print("\\n=== Regions with 3+ orders ===")
print(top_regions.to_string(index=False))

conn.close()`,
    content: `# Chapter 6 — SQL Aggregation: GROUP BY, HAVING & Aggregate Functions

## 🎯 What You'll Learn
The five core aggregate functions (COUNT, SUM, AVG, MAX, MIN); how GROUP BY groups rows into summary buckets; why HAVING is needed for filtering groups; and the critical difference between WHERE (filters rows) and HAVING (filters groups).

---

## 1. What is Aggregation?

**Aggregation** means combining many rows into a single summary value.

Without aggregation:
\`\`\`
id | customer | amount
1  | Alice    | 999
2  | Bob      | 29
3  | Alice    | 29
...
\`\`\`

With aggregation (SUM):
\`\`\`
Total revenue: 1,453
\`\`\`

Aggregation answers questions like:
- How much did we sell in total? → SUM
- How many orders did we receive? → COUNT
- What is the average order value? → AVG
- Who placed the largest order? → MAX

---

## 2. The Five Aggregate Functions

### COUNT — How Many?

\`\`\`sql
SELECT COUNT(*)         FROM orders;   -- counts ALL rows (including NULLs)
SELECT COUNT(phone)     FROM customers;-- counts non-NULL phone values only
SELECT COUNT(DISTINCT category) FROM products; -- counts unique categories
\`\`\`

| Function | Counts |
|----------|--------|
| COUNT(*) | All rows |
| COUNT(col) | Non-NULL values in column |
| COUNT(DISTINCT col) | Unique non-NULL values |

---

### SUM — Add Them Up

\`\`\`sql
SELECT SUM(amount)   AS total_revenue   FROM orders;
SELECT SUM(quantity) AS units_sold      FROM orders;
\`\`\`

> ⚠️ SUM of a column with NULLs: NULLs are ignored (treated as 0 for the purpose of summing).

---

### AVG — Find the Mean

\`\`\`sql
SELECT AVG(amount)          AS avg_order_value  FROM orders;
SELECT ROUND(AVG(amount), 2) AS avg_rounded      FROM orders;
\`\`\`

> ⚠️ AVG ignores NULLs — it divides the sum by the count of non-NULL values.

---

### MAX and MIN — Extremes

\`\`\`sql
SELECT MAX(amount)    AS largest_order  FROM orders;
SELECT MIN(amount)    AS smallest_order FROM orders;
SELECT MAX(order_date)AS most_recent    FROM orders;  -- works on dates too!
SELECT MIN(order_date)AS earliest       FROM orders;
\`\`\`

---

### Combining All Five in One Query

\`\`\`sql
SELECT
    COUNT(*)             AS total_orders,
    SUM(amount)          AS total_revenue,
    ROUND(AVG(amount),2) AS avg_order_value,
    MAX(amount)          AS largest_order,
    MIN(amount)          AS smallest_order
FROM orders;
\`\`\`

Result:
\`\`\`
total_orders | total_revenue | avg_order_value | largest_order | smallest_order
-------------|---------------|-----------------|---------------|---------------
10           | 2473          | 247.30          | 999           | 15
\`\`\`

---

## 3. GROUP BY — Aggregate by Category

GROUP BY splits rows into groups, then applies the aggregate function to each group separately.

### Without GROUP BY — One global answer:
\`\`\`sql
SELECT SUM(amount) FROM orders;
-- Returns: 2473 (total across ALL orders)
\`\`\`

### With GROUP BY — One answer per group:
\`\`\`sql
SELECT region, SUM(amount) AS revenue
FROM   orders
GROUP  BY region;
\`\`\`

Result:
\`\`\`
region | revenue
-------|--------
North  | 1226
South  | 236
East   | 1014
West   | 25
\`\`\`

### The GROUP BY Rule

> 🔑 **Critical rule:** Every column in SELECT must either be:
> 1. Inside an aggregate function (SUM, COUNT, etc.), OR
> 2. Listed in the GROUP BY clause

\`\`\`sql
-- ✅ CORRECT
SELECT region, category, SUM(amount)
FROM   orders
GROUP  BY region, category;

-- ❌ WRONG — customer is in SELECT but not in GROUP BY and not aggregated
SELECT region, customer, SUM(amount)
FROM   orders
GROUP  BY region;
\`\`\`

---

## 4. Ordering Aggregated Results

Always combine GROUP BY with ORDER BY for readable results:

\`\`\`sql
SELECT category,
       COUNT(*)            AS order_count,
       SUM(amount)         AS total_revenue,
       ROUND(AVG(amount),2) AS avg_per_order
FROM   orders
GROUP  BY category
ORDER  BY total_revenue DESC;
\`\`\`

Result (sorted by revenue):
\`\`\`
category    | order_count | total_revenue | avg_per_order
------------|-------------|---------------|---------------
Electronics | 6           | 2334          | 389.00
Books       | 2           | 65            | 32.50
Clothing    | 2           | 58            | 29.00
Sports      | 1           | 25            | 25.00
\`\`\`

---

## 5. HAVING — Filter Groups After Aggregation

HAVING is like WHERE, but it filters **groups** (the result of GROUP BY) rather than individual rows.

### The Key Difference

\`\`\`
WHERE  → filters ROWS before grouping  (works on raw column values)
HAVING → filters GROUPS after grouping (works on aggregate results)
\`\`\`

### You CANNOT use WHERE with aggregate functions:
\`\`\`sql
-- ❌ WRONG — cannot use SUM() in WHERE clause
SELECT region, SUM(amount)
FROM   orders
WHERE  SUM(amount) > 500
GROUP  BY region;

-- ✅ CORRECT — use HAVING for aggregate conditions
SELECT region, SUM(amount) AS revenue
FROM   orders
GROUP  BY region
HAVING SUM(amount) > 500;
\`\`\`

### HAVING Examples

\`\`\`sql
-- Regions with more than 2 orders
SELECT region, COUNT(*) AS order_count
FROM   orders
GROUP  BY region
HAVING COUNT(*) > 2;

-- Categories with average order value above $100
SELECT category, ROUND(AVG(amount),2) AS avg_order
FROM   orders
GROUP  BY category
HAVING AVG(amount) > 100;

-- Customers who spent more than $200 total
SELECT customer, SUM(amount) AS total_spent
FROM   orders
GROUP  BY customer
HAVING SUM(amount) > 200
ORDER  BY total_spent DESC;
\`\`\`

---

## 6. WHERE and HAVING Together

You can use BOTH in the same query:

\`\`\`sql
-- Among Electronics orders only,
-- show categories where total revenue exceeds $500
SELECT category, SUM(amount) AS revenue
FROM   orders
WHERE  category = 'Electronics'     -- filter rows FIRST
GROUP  BY category
HAVING SUM(amount) > 500            -- then filter groups
ORDER  BY revenue DESC;
\`\`\`

**Execution order:**
1. FROM orders
2. WHERE category = 'Electronics' (filters rows — only Electronics rows remain)
3. GROUP BY category (groups the filtered rows)
4. HAVING SUM(amount) > 500 (filters groups)
5. SELECT (builds output)
6. ORDER BY (sorts output)

---

## 7. Full Query Reference

\`\`\`sql
SELECT   region,
         COUNT(*)            AS orders,
         SUM(amount)         AS revenue,
         ROUND(AVG(amount),2) AS avg_order,
         MAX(amount)         AS largest,
         MIN(amount)         AS smallest
FROM     orders
WHERE    order_date >= '2024-01-01'   -- filter rows first
GROUP    BY region                     -- group filtered rows
HAVING   COUNT(*) >= 2                 -- filter groups
ORDER    BY revenue DESC               -- sort final output
LIMIT    5;                            -- top 5 only
\`\`\``,
    questions: [
      q('What is the difference between COUNT(*) and COUNT(column_name)?',
        [{ id: 'a', text: 'They are identical — both count all rows' }, { id: 'b', text: 'COUNT(*) counts all rows including NULLs; COUNT(column) counts only non-NULL values in that column' }, { id: 'c', text: 'COUNT(*) is faster; COUNT(column) is more accurate' }, { id: 'd', text: 'COUNT(column) counts all rows; COUNT(*) skips NULL rows' }],
        'b', 'COUNT(*) counts every row regardless of NULL values. COUNT(column_name) counts only the rows where that specific column is not NULL. Use COUNT(*) for total rows, COUNT(col) when you need to count how many rows have a value in that column.', 0),
      q('What does GROUP BY do in a SQL query?',
        [{ id: 'a', text: 'Sorts the results alphabetically' }, { id: 'b', text: 'Filters rows before aggregation' }, { id: 'c', text: 'Divides rows into groups so aggregate functions compute separately for each group' }, { id: 'd', text: 'Joins two tables on a matching column' }],
        'c', 'GROUP BY creates buckets of rows that share the same value(s) in the specified column(s). Aggregate functions (SUM, COUNT, AVG) then operate on each bucket independently — giving one result per group rather than one global result.', 1),
      q('Which clause filters GROUPS after a GROUP BY — not individual rows?',
        [{ id: 'a', text: 'WHERE' }, { id: 'b', text: 'ORDER BY' }, { id: 'c', text: 'HAVING' }, { id: 'd', text: 'LIMIT' }],
        'c', 'HAVING filters the aggregated groups after GROUP BY has been applied. WHERE filters individual rows before grouping. You must use HAVING when your filter condition involves aggregate functions like SUM(), COUNT(), AVG().', 2),
      q('This query is WRONG — why? SELECT dept, customer, SUM(salary) FROM employees GROUP BY dept',
        [{ id: 'a', text: 'SUM cannot be used with GROUP BY' }, { id: 'b', text: '"customer" is in SELECT but not in GROUP BY and not inside an aggregate function' }, { id: 'c', text: 'GROUP BY requires ORDER BY' }, { id: 'd', text: 'SUM(salary) should be AVG(salary)' }],
        'b', 'The GROUP BY rule: every column in SELECT must either be in GROUP BY or wrapped in an aggregate function. "customer" is neither — so the database does not know which customer value to show for each department group (there are multiple customers per dept).', 3),
      q('SELECT category, AVG(price) FROM products GROUP BY category HAVING AVG(price) > 100 — what does HAVING do here?',
        [{ id: 'a', text: 'Filters products where price > 100 before grouping' }, { id: 'b', text: 'Filters the resulting groups to show only categories whose average price exceeds 100' }, { id: 'c', text: 'Sorts categories by average price descending' }, { id: 'd', text: 'HAVING is a syntax error here — WHERE should be used' }],
        'b', 'HAVING AVG(price) > 100 runs after GROUP BY has calculated the average price per category. It filters out categories whose average price is 100 or below — keeping only high-average-price categories in the output. WHERE cannot reference AVG().', 4),
      q('What does ROUND(AVG(amount), 2) do?',
        [{ id: 'a', text: 'Rounds the amount column to 2 significant figures before averaging' }, { id: 'b', text: 'Calculates the average of the amount column, then rounds the result to 2 decimal places' }, { id: 'c', text: 'Returns the second largest average' }, { id: 'd', text: 'ROUND cannot be applied to aggregate functions' }],
        'b', 'Functions nest from inside out: first AVG(amount) calculates the mean, then ROUND(..., 2) rounds that result to 2 decimal places. This is standard practice to avoid displaying values like 247.333333...', 5),
      q('A query has WHERE order_date >= "2024-01-01" AND GROUP BY region AND HAVING COUNT(*) > 5. In what order do these execute?',
        [{ id: 'a', text: 'GROUP BY → WHERE → HAVING' }, { id: 'b', text: 'WHERE → HAVING → GROUP BY' }, { id: 'c', text: 'HAVING → GROUP BY → WHERE' }, { id: 'd', text: 'WHERE → GROUP BY → HAVING' }],
        'd', 'SQL execution order: WHERE filters rows from the raw table first, then GROUP BY groups the remaining rows, then HAVING filters the groups. This is why WHERE runs on column values and HAVING runs on aggregate results.', 6),
      q('How do you count the number of DISTINCT (unique) product categories in a table?',
        [{ id: 'a', text: 'COUNT(category)' }, { id: 'b', text: 'COUNT(UNIQUE category)' }, { id: 'c', text: 'COUNT(DISTINCT category)' }, { id: 'd', text: 'DISTINCT COUNT(category)' }],
        'c', 'COUNT(DISTINCT column) counts unique non-NULL values. If "category" has values [Electronics, Books, Electronics, Sports, Books], COUNT(category) = 5 but COUNT(DISTINCT category) = 3 (three unique categories).', 7),
      q('SELECT customer, SUM(amount) FROM orders GROUP BY customer ORDER BY SUM(amount) DESC LIMIT 3 — what does this return?',
        [{ id: 'a', text: 'The 3 smallest customer orders' }, { id: 'b', text: 'The top 3 customers by total amount spent, with their totals' }, { id: 'c', text: 'The 3 most recent orders' }, { id: 'd', text: 'Customer names sorted alphabetically, limited to 3' }],
        'b', 'This query sums each customer\'s total spending (GROUP BY customer + SUM(amount)), sorts from highest to lowest (ORDER BY SUM(amount) DESC), and returns only the top 3 (LIMIT 3) — classic "top N customers by spend" analysis.', 8),
      q('What does MAX(order_date) return when applied to a date column?',
        [{ id: 'a', text: 'The maximum (latest/most recent) date in the column' }, { id: 'b', text: 'The date with the maximum number of orders' }, { id: 'c', text: 'MAX cannot be used on date columns — only numbers' }, { id: 'd', text: 'The date furthest in the future (not yet reached)' }],
        'a', 'MAX() on a date column returns the most recent (latest) date — dates are compared chronologically. MIN(order_date) returns the earliest date. This is useful for finding "when was the last order placed?" or "when did this customer first sign up?"', 9),
      q('Why does this query fail? SELECT dept, COUNT(*) FROM employees WHERE COUNT(*) > 5 GROUP BY dept',
        [{ id: 'a', text: 'COUNT(*) cannot be used in a query with GROUP BY' }, { id: 'b', text: 'WHERE cannot use aggregate functions — COUNT(*) > 5 must be in HAVING instead' }, { id: 'c', text: 'The GROUP BY clause must come before WHERE' }, { id: 'd', text: 'COUNT(*) requires an alias when used in WHERE' }],
        'b', 'WHERE is evaluated before GROUP BY — at that point, no groups exist yet, so no aggregates have been computed. You cannot use aggregate functions in WHERE. Move the condition to HAVING COUNT(*) > 5, which runs after grouping.', 10),
      q('SELECT region, SUM(amount) FROM orders GROUP BY region HAVING SUM(amount) > 1000 ORDER BY SUM(amount) DESC — what regions appear?',
        [{ id: 'a', text: 'All regions, sorted by total amount' }, { id: 'b', text: 'Only regions with total sales exceeding $1,000, sorted highest first' }, { id: 'c', text: 'Regions with less than $1,000 in sales' }, { id: 'd', text: 'The single region with exactly $1,000 in sales' }],
        'b', 'HAVING SUM(amount) > 1000 filters groups to only those where the summed amount exceeds 1000. ORDER BY SUM(amount) DESC then sorts the remaining groups from highest to lowest revenue.', 11),
      q('In GROUP BY, can you group by multiple columns at once?',
        [{ id: 'a', text: 'No — GROUP BY only accepts one column' }, { id: 'b', text: 'Yes — GROUP BY region, category creates one group per unique combination of region and category' }, { id: 'c', text: 'Yes — but only if the columns are from different tables' }, { id: 'd', text: 'Yes — but you must use ORDER BY with the same columns' }],
        'b', 'GROUP BY accepts multiple columns separated by commas. GROUP BY region, category creates a separate group for each unique (region, category) pair — e.g., (North, Electronics), (North, Books), (South, Electronics), etc.', 12),
      q('What is the result of AVG(salary) if a column has values [80000, NULL, 60000, NULL, 70000]?',
        [{ id: 'a', text: '42000 — NULLs are treated as 0, so average is (80k+0+60k+0+70k)/5' }, { id: 'b', text: '70000 — average of the 3 non-NULL values (80k+60k+70k)/3' }, { id: 'c', text: 'NULL — if any value is NULL, the result is NULL' }, { id: 'd', text: 'Error — AVG cannot handle NULL values' }],
        'b', 'AVG() ignores NULL values. It sums only non-NULL values (80000+60000+70000 = 210000) and divides by the count of non-NULL values (3): 210000/3 = 70000. NULLs are excluded from both the sum and the count.', 13),
      q('Which aggregate function would you use to find the most expensive product in each category?',
        [{ id: 'a', text: 'SUM(price)' }, { id: 'b', text: 'COUNT(price)' }, { id: 'c', text: 'AVG(price)' }, { id: 'd', text: 'MAX(price)' }],
        'd', 'MAX(price) returns the highest price value in each group. Combined with GROUP BY category, it gives the most expensive product price per category. To also get the product name, you would need a subquery or window function (covered in later chapters).', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 7 — PYTHON FUNDAMENTALS FOR ANALYSTS
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-7-python-fundamentals',
    title:       'Python Fundamentals for Data Analysts',
    description: 'Master the Python building blocks every analyst needs: variables, data types, lists, dictionaries, loops, and functions — with a data-analytics focus throughout.',
    orderIndex:  7,
    xpReward:    80,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    codeExample: `# ── Python fundamentals — data analyst edition ──────────────────────

# 1. Variables & data types
name       = "Alice"          # str
age        = 29               # int
salary     = 72000.50         # float
is_active  = True             # bool
phone      = None             # NoneType (like NULL in SQL)

print(f"Name: {name}, Age: {age}, Salary: \${salary:,.2f}")

# 2. Lists — ordered, mutable sequences
sales = [15000, 22000, 18000, 9500, 30000, 25000]
print(f"\\nSales data : {sales}")
print(f"Total      : \${sum(sales):,}")
print(f"Average    : \${sum(sales)/len(sales):,.0f}")
print(f"Best month : \${max(sales):,}")
print(f"Worst month: \${min(sales):,}")

# Slicing — first 3 and last 2
print(f"First half : {sales[:3]}")
print(f"Last 2     : {sales[-2:]}")

# 3. Dictionaries — key-value pairs (like a database row)
employee = {
    "name"      : "Alice",
    "department": "Sales",
    "salary"    : 72000,
    "skills"    : ["Excel", "SQL", "Python"],
}
print(f"\\nEmployee   : {employee['name']}")
print(f"Department : {employee['department']}")
print(f"Skills     : {', '.join(employee['skills'])}")

# 4. List of dicts — tabular data without Pandas
employees = [
    {"name": "Alice",   "dept": "Sales", "salary": 72000},
    {"name": "Bob",     "dept": "IT",    "salary": 95000},
    {"name": "Charlie", "dept": "Sales", "salary": 68000},
]
print("\\n=== Salary report ===")
for emp in employees:
    label = "Senior" if emp["salary"] >= 80000 else "Standard"
    print(f"  {emp['name']:<10} \${emp['salary']:,}  ({label})")

# 5. Functions
def summary_stats(numbers):
    return {
        "count":   len(numbers),
        "total":   sum(numbers),
        "average": round(sum(numbers) / len(numbers), 2),
        "max":     max(numbers),
        "min":     min(numbers),
    }

stats = summary_stats(sales)
print("\\n=== Stats ===")
for k, v in stats.items():
    print(f"  {k:<10}: {v}")`,
    content: `# Chapter 7 — Python Fundamentals for Data Analysts

## 🎯 What You'll Learn
Python variables and data types; how lists and dictionaries map directly to the data structures you already know; loops for processing rows; functions for reusable analysis logic; and how pure Python (no libraries yet) can already handle small datasets.

---

## 1. Why Python for Data Analytics?

Python is the #1 programming language for data analytics and data science. Reasons:
- **Free and open-source** — no licence fees
- **Massive ecosystem** — Pandas, NumPy, Matplotlib, Scikit-learn, all free
- **Readable syntax** — closest to English of any programming language
- **Universal** — works on Windows, Mac, Linux
- **Industry standard** — required in 80%+ of analytics job postings

### Python vs SQL vs Excel

| Task | Best Tool |
|------|-----------|
| Query a database | SQL |
| Interactive report building | Excel |
| Complex data manipulation | Python (Pandas) |
| Machine learning | Python |
| Automation and scripting | Python |
| Quick ad-hoc analysis | SQL or Excel |

> 💡 **They complement each other.** Most analysts use all three — SQL to get the data, Python to transform and analyse it, and Excel/Power BI to present it.

---

## 2. Variables — Storing Values

A **variable** is a named container that holds a value.

\`\`\`python
name     = "Alice"       # Store the text "Alice" in a variable called name
age      = 29            # Store the number 29
salary   = 72000.50      # Decimal number
is_vip   = True          # Boolean (True or False)
phone    = None          # None = no value (like NULL in SQL)
\`\`\`

**Rules for variable names:**
- Start with a letter or underscore (not a number)
- Can contain letters, numbers, underscores
- Case-sensitive: \`salary\` ≠ \`Salary\`
- Use snake_case: \`total_revenue\`, \`customer_name\`

### Printing Variables

\`\`\`python
print(name)              # Alice
print(age)               # 29
print(f"Hello, {name}!") # Hello, Alice!  ← f-string (formatted string)
print(f"Salary: \${salary:,.2f}")  # Salary: $72,000.50
\`\`\`

---

## 3. Data Types

Python automatically detects the type of each variable.

| Type | Example | SQL Equivalent |
|------|---------|----------------|
| \`str\` (string) | \`"Alice"\` | VARCHAR / TEXT |
| \`int\` (integer) | \`29\` | INTEGER |
| \`float\` | \`9.99\` | DECIMAL / FLOAT |
| \`bool\` | \`True\`, \`False\` | BOOLEAN |
| \`None\` | \`None\` | NULL |

\`\`\`python
type("Alice")   # <class 'str'>
type(29)        # <class 'int'>
type(9.99)      # <class 'float'>
type(True)      # <class 'bool'>
type(None)      # <class 'NoneType'>
\`\`\`

### Type Conversion

\`\`\`python
# String to number
"72000"   → int("72000")   = 72000
"9.99"    → float("9.99")  = 9.99

# Number to string
72000     → str(72000)     = "72000"

# Practical example — cleaning imported data
raw_salary = "72,000"         # Came in as text from CSV
clean = int(raw_salary.replace(",", ""))  # = 72000
\`\`\`

---

## 4. Lists — Ordered Data Collections

A **list** is Python's equivalent of a column of values. Ordered, changeable, allows duplicates.

\`\`\`python
sales    = [15000, 22000, 18000, 9500, 30000]
cities   = ["Mumbai", "Delhi", "Bangalore"]
mixed    = [1, "Alice", True, None]  # Can mix types (but avoid in analytics)
\`\`\`

### Accessing List Items

\`\`\`python
sales = [15000, 22000, 18000, 9500, 30000]
#          0      1      2      3      4    ← index positions

sales[0]    # 15000  (first item)
sales[-1]   # 30000  (last item)
sales[1:3]  # [22000, 18000]  (slice: index 1 to 2, end exclusive)
sales[:3]   # [15000, 22000, 18000]  (first 3)
sales[-2:]  # [9500, 30000]   (last 2)
\`\`\`

### Key List Operations

\`\`\`python
len(sales)     # 5     ← how many items
sum(sales)     # 94500 ← total
max(sales)     # 30000 ← largest
min(sales)     # 9500  ← smallest
sorted(sales)  # [9500, 15000, 18000, 22000, 30000]  ← sorted copy

# Add / remove
sales.append(27000)    # Add to end
sales.remove(9500)     # Remove first occurrence of value
\`\`\`

### List Comprehension — Analyst's Superpower

\`\`\`python
# Filter items — like SQL WHERE
high_months = [s for s in sales if s > 20000]
# [22000, 30000]

# Transform — like SQL computed column
with_tax = [s * 1.18 for s in sales]
# [17700, 25960, 21240, 11210, 35400]

# Both — like SQL WHERE + computed column
filtered_taxed = [round(s * 1.18) for s in sales if s > 15000]
\`\`\`

---

## 5. Dictionaries — Row-Like Data

A **dictionary** stores key-value pairs — like a single database row.

\`\`\`python
employee = {
    "name"      : "Alice",
    "department": "Sales",
    "salary"    : 72000,
    "active"    : True,
}

# Access by key
employee["name"]        # "Alice"
employee["salary"]      # 72000
employee.get("phone", "N/A")  # "N/A" — safe access with default

# Add / update
employee["city"]    = "Mumbai"     # Add new key
employee["salary"]  = 75000        # Update existing key

# Check if key exists
"name" in employee     # True
"age" in employee      # False
\`\`\`

### List of Dictionaries — Tabular Data

This is how Python represents a dataset without Pandas:

\`\`\`python
employees = [
    {"name": "Alice",   "dept": "Sales", "salary": 72000},
    {"name": "Bob",     "dept": "IT",    "salary": 95000},
    {"name": "Charlie", "dept": "Sales", "salary": 68000},
    {"name": "Diana",   "dept": "HR",    "salary": 61000},
]

# Filter — like SQL WHERE dept = 'Sales'
sales_team = [e for e in employees if e["dept"] == "Sales"]

# Sum — like SQL SUM(salary)
total_payroll = sum(e["salary"] for e in employees)

# Sort — like SQL ORDER BY salary DESC
sorted_by_salary = sorted(employees, key=lambda e: e["salary"], reverse=True)
\`\`\`

---

## 6. Loops — Processing Rows

\`\`\`python
# for loop — iterate over each item
for emp in employees:
    print(f"{emp['name']}: \${emp['salary']:,}")

# Loop with index
for i, emp in enumerate(employees):
    print(f"Row {i+1}: {emp['name']}")

# Loop over a range of numbers
for month in range(1, 13):  # 1 to 12
    print(f"Month {month}")
\`\`\`

### Conditional logic inside loops

\`\`\`python
for emp in employees:
    if emp["salary"] >= 90000:
        tier = "Senior"
    elif emp["salary"] >= 70000:
        tier = "Mid"
    else:
        tier = "Junior"
    print(f"{emp['name']}: {tier}")
\`\`\`

---

## 7. Functions — Reusable Analysis

\`\`\`python
# Define a function
def calculate_stats(numbers):
    n = len(numbers)
    if n == 0:
        return None
    return {
        "count":   n,
        "total":   sum(numbers),
        "average": round(sum(numbers) / n, 2),
        "max":     max(numbers),
        "min":     min(numbers),
    }

# Call it
sales   = [15000, 22000, 18000, 9500, 30000]
profits = [3000, 8000, 5000, -500, 12000]

print(calculate_stats(sales))
print(calculate_stats(profits))
\`\`\`

**Why functions matter for analysis:**
- Write logic once, use it on multiple datasets
- Easier to test and debug
- Make long scripts readable

> 🏁 **Python fundamentals checkpoint:** You now understand enough Python to process rows of data without any library. Chapter 8 introduces Pandas — and everything you just learned maps directly to it.`,
    questions: [
      q('What is the correct way to create a variable named "total_sales" storing the value 150000?',
        [{ id: 'a', text: 'variable total_sales = 150000' }, { id: 'b', text: 'total_sales = 150000' }, { id: 'c', text: 'int total_sales = 150000' }, { id: 'd', text: 'let total_sales = 150000' }],
        'b', 'Python uses simple assignment with = to create variables. No type declaration keyword is needed (unlike Java\'s int or JavaScript\'s let). Python automatically detects the type from the assigned value.', 0),
      q('What Python data type represents True/False values?',
        [{ id: 'a', text: 'str' }, { id: 'b', text: 'int' }, { id: 'c', text: 'bool' }, { id: 'd', text: 'none' }],
        'c', 'bool (boolean) stores True or False. Note the capital T and F — Python is case-sensitive. True and False are keywords; true and false would cause a NameError. bool is the Python equivalent of a Boolean column in SQL.', 1),
      q('Given sales = [15000, 22000, 18000, 9500], what does sales[-1] return?',
        [{ id: 'a', text: '15000 (first item)' }, { id: 'b', text: '18000 (third item)' }, { id: 'c', text: '9500 (last item)' }, { id: 'd', text: 'An error — negative indices are invalid' }],
        'c', 'Negative indexing in Python counts from the end. sales[-1] is the last element (9500), sales[-2] is 18000, etc. This is a Python feature — no equivalent exists in most other languages.', 2),
      q('What does len(my_list) return?',
        [{ id: 'a', text: 'The sum of all values in the list' }, { id: 'b', text: 'The largest value in the list' }, { id: 'c', text: 'The number of items in the list' }, { id: 'd', text: 'The last item in the list' }],
        'c', 'len() returns the number of items (length) in a list, string, dictionary, or other sequence. len([10, 20, 30]) = 3. In analytics this is equivalent to COUNT(*) — telling you how many rows/items you have.', 3),
      q('What is a Python dictionary?',
        [{ id: 'a', text: 'An ordered sequence of values, like a column of data' }, { id: 'b', text: 'A collection of key-value pairs — like a single database row' }, { id: 'c', text: 'A function that looks up values (like VLOOKUP)' }, { id: 'd', text: 'A Python module for data analysis' }],
        'b', 'A dictionary stores key-value pairs: {"name": "Alice", "salary": 72000}. Each key is unique and maps to a value. It directly represents a single database row where keys are column names and values are cell values.', 4),
      q('What does this list comprehension return? [x * 2 for x in [1, 2, 3, 4, 5] if x > 2]',
        [{ id: 'a', text: '[2, 4, 6, 8, 10]' }, { id: 'b', text: '[6, 8, 10]' }, { id: 'c', text: '[3, 4, 5]' }, { id: 'd', text: '[1, 2, 3, 4, 5]' }],
        'b', 'The list comprehension first filters with "if x > 2" (keeping 3, 4, 5), then applies "x * 2" to each remaining value: 3×2=6, 4×2=8, 5×2=10. Result: [6, 8, 10].', 5),
      q('What is None in Python?',
        [{ id: 'a', text: 'The integer value 0' }, { id: 'b', text: 'An empty string ""' }, { id: 'c', text: 'The absence of a value — equivalent to NULL in SQL' }, { id: 'd', text: 'The boolean value False' }],
        'c', 'None represents the intentional absence of a value — it is Python\'s equivalent of SQL\'s NULL. None, 0, "", and False are all different things in Python. None is used when a variable has "no value" rather than zero or empty string.', 6),
      q('Given employees = [{"name":"Alice","salary":72000}, {"name":"Bob","salary":95000}], how do you get Alice\'s salary?',
        [{ id: 'a', text: 'employees["salary"][0]' }, { id: 'b', text: 'employees[0]["salary"]' }, { id: 'c', text: 'employees.get("Alice").salary' }, { id: 'd', text: 'employees[0].salary' }],
        'b', 'employees is a list, so employees[0] gets the first dictionary {"name":"Alice","salary":72000}. Then ["salary"] accesses the "salary" key of that dictionary. The pattern [row_index]["column_key"] mirrors how you read a table cell.', 7),
      q('What is the output of sorted([30, 10, 20, 5])?',
        [{ id: 'a', text: '[30, 10, 20, 5] — sorted() does not modify the list' }, { id: 'b', text: '[5, 10, 20, 30] — returns a new sorted list in ascending order' }, { id: 'c', text: '[30, 20, 10, 5] — sorted() sorts descending by default' }, { id: 'd', text: '[5, 10, 20, 30] — modifies the original list in place' }],
        'b', 'sorted() returns a NEW list sorted in ascending order (smallest to largest). It does NOT modify the original list. To sort descending: sorted(list, reverse=True). To sort in-place (modifying the original): list.sort().', 8),
      q('What does the enumerate() function add when used in a for loop?',
        [{ id: 'a', text: 'It reverses the iteration order' }, { id: 'b', text: 'It provides both the index and value in each iteration' }, { id: 'c', text: 'It makes the loop run faster' }, { id: 'd', text: 'It sorts the list before iterating' }],
        'b', 'enumerate(list) yields (index, value) pairs: for i, item in enumerate(["a","b","c"]): gives i=0,item="a" then i=1,item="b" etc. Use it when you need both the position and the value — like showing "Row 1:", "Row 2:", etc.', 9),
      q('Which of the following correctly defines a Python function that takes two numbers and returns their sum?',
        [{ id: 'a', text: 'function add(a, b): return a + b' }, { id: 'b', text: 'def add(a, b): return a + b' }, { id: 'c', text: 'def add(a, b) { return a + b; }' }, { id: 'd', text: 'func add(a, b) => a + b' }],
        'b', 'Python functions use the def keyword, followed by the function name, parameters in parentheses, a colon, and indented body. No braces, no semicolons — indentation defines the function body. This is Python\'s signature syntax.', 10),
      q('What does sales[1:4] return if sales = [10, 20, 30, 40, 50]?',
        [{ id: 'a', text: '[10, 20, 30] (indices 0 to 2)' }, { id: 'b', text: '[20, 30, 40] (indices 1 to 3, end exclusive)' }, { id: 'c', text: '[20, 30, 40, 50] (index 1 to end)' }, { id: 'd', text: '[10, 20, 30, 40] (indices 0 to 3)' }],
        'b', 'Python slicing [start:end] includes start but excludes end. sales[1:4] includes indices 1, 2, 3 — values 20, 30, 40. Index 4 (value 50) is excluded. Remember: end index is always exclusive in Python slices.', 11),
      q('What naming convention is recommended for Python variables?',
        [{ id: 'a', text: 'camelCase: totalRevenue' }, { id: 'b', text: 'PascalCase: TotalRevenue' }, { id: 'c', text: 'snake_case: total_revenue' }, { id: 'd', text: 'SCREAMING_SNAKE: TOTAL_REVENUE' }],
        'c', 'Python convention (PEP 8 style guide) recommends snake_case for variable and function names: total_revenue, customer_name, is_active. camelCase is used in JavaScript; PascalCase is for Python class names; SCREAMING_SNAKE is for constants.', 12),
      q('Given d = {"a": 1, "b": 2}, what does d.get("c", 0) return?',
        [{ id: 'a', text: 'An error — key "c" does not exist' }, { id: 'b', text: 'None' }, { id: 'c', text: '0 (the default value provided)' }, { id: 'd', text: '"c"' }],
        'c', '.get(key, default) safely retrieves a value. If the key exists, it returns its value. If not, it returns the default (0 in this case) instead of raising a KeyError. Always prefer .get() over d["c"] when the key might be missing.', 13),
      q('What does range(1, 6) produce in a for loop?',
        [{ id: 'a', text: 'Numbers 1, 2, 3, 4, 5, 6' }, { id: 'b', text: 'Numbers 1, 2, 3, 4, 5 (6 is excluded)' }, { id: 'c', text: 'Numbers 0, 1, 2, 3, 4, 5' }, { id: 'd', text: 'A list [1, 2, 3, 4, 5, 6]' }],
        'b', 'range(start, stop) generates integers from start (inclusive) to stop (exclusive). range(1, 6) gives 1, 2, 3, 4, 5. The stop value (6) is always excluded — consistent with Python\'s slicing convention.', 14),
    ],
  },

  // ══════════════════════════════════════════════
  // CHAPTER 8 — PANDAS FOR BEGINNERS
  // ══════════════════════════════════════════════
  {
    slug:        'da-noob-8-pandas-beginners',
    title:       'Pandas for Beginners — Your First DataFrame',
    description: 'Load your first dataset with Pandas, explore it with head/info/describe, filter rows, select columns, sort data, and create computed columns — no prior Pandas experience needed.',
    orderIndex:  8,
    xpReward:    90,
    difficulty:  'BEGINNER',
    tier:        'NOOB',
    language:    'python',
    codeExample: `import pandas as pd

# ── Step 1: Create a DataFrame (like a spreadsheet in Python) ────────
data = {
    "name"    : ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "dept"    : ["Sales","IT","Sales","HR","IT","HR"],
    "city"    : ["Mumbai","Delhi","Mumbai","Bangalore","Delhi","Chennai"],
    "salary"  : [72000,95000,68000,61000,102000,58000],
    "years"   : [4, 7, 2, 5, 9, 3],
    "score"   : [88, 92, 75, 81, 95, 70],
}
df = pd.DataFrame(data)

# ── Step 2: Explore ─────────────────────────────────────────────────
print("Shape:", df.shape)           # (rows, cols)
print(df.head(3))                   # First 3 rows
print("\\nColumn types:")
print(df.dtypes)
print("\\nSummary stats:")
print(df.describe().round(1))

# ── Step 3: Select columns ──────────────────────────────────────────
names_salaries = df[["name", "salary"]]    # Two columns → DataFrame
print("\\nNames & salaries:\\n", names_salaries)

# ── Step 4: Filter rows (Boolean indexing) ──────────────────────────
it_staff      = df[df["dept"] == "IT"]
high_earners  = df[df["salary"] >= 90000]
mumbai_sales  = df[(df["city"] == "Mumbai") & (df["dept"] == "Sales")]

print("\\nIT Staff:\\n",      it_staff[["name","salary"]].to_string(index=False))
print("\\nHigh earners:\\n",  high_earners[["name","salary"]].to_string(index=False))

# ── Step 5: Sort ────────────────────────────────────────────────────
by_salary = df.sort_values("salary", ascending=False)
print("\\nTop earner:", by_salary.iloc[0]["name"],
      "at \$", by_salary.iloc[0]["salary"])

# ── Step 6: Computed column ─────────────────────────────────────────
df["salary_per_year"] = (df["salary"] / df["years"]).round(0).astype(int)
df["grade"]           = df["score"].apply(lambda s: "A" if s>=90 else "B" if s>=75 else "C")

print("\\nWith computed columns:")
print(df[["name","salary","years","salary_per_year","score","grade"]].to_string(index=False))`,
    content: `# Chapter 8 — Pandas for Beginners: Your First DataFrame

## 🎯 What You'll Learn
What a Pandas DataFrame is and how it relates to everything you have already learned; how to create and load DataFrames; explore with head/info/describe; select columns and filter rows; sort data; create computed columns; and save results back to a file.

---

## 1. What is Pandas?

**Pandas** is a Python library that gives you a supercharged spreadsheet inside Python. It is named after "Panel Data" — a type of structured dataset in economics.

\`\`\`python
import pandas as pd   # convention: always import as pd
\`\`\`

Pandas gives you two core data structures:
- **Series** — a single column of data (1-D)
- **DataFrame** — a full table of rows and columns (2-D)

### Why Pandas Instead of Regular Python?

| Task | Pure Python | Pandas |
|------|-------------|--------|
| Load a CSV file | 15 lines of code | 1 line |
| Filter rows by value | Loop + if statement | 1 line |
| Group by and sum | 10+ lines | 1 line |
| Sort a dataset | sorted() + lambda | 1 line |
| Statistics | Manual formulas | df.describe() |

---

## 2. Creating Your First DataFrame

### From a Dictionary

\`\`\`python
import pandas as pd

data = {
    "name"  : ["Alice", "Bob", "Charlie", "Diana"],
    "dept"  : ["Sales", "IT", "Sales", "HR"],
    "salary": [72000, 95000, 68000, 61000],
    "score" : [88, 92, 75, 81],
}

df = pd.DataFrame(data)
print(df)
\`\`\`

Output:
\`\`\`
      name   dept  salary  score
0    Alice  Sales   72000     88
1      Bob     IT   95000     92
2  Charlie  Sales   68000     75
3    Diana     HR   61000     81
\`\`\`

The number on the left (0, 1, 2, 3) is the **index** — Pandas adds it automatically.

### From a CSV File (Most Common in Practice)

\`\`\`python
df = pd.read_csv("sales_data.csv")                    # local file
df = pd.read_csv("https://example.com/data.csv")      # URL
df = pd.read_excel("report.xlsx", sheet_name="Data")  # Excel file
\`\`\`

---

## 3. Exploring Your DataFrame — The First Commands

Every time you load a new dataset, run these in order:

\`\`\`python
df.shape          # (rows, columns) — e.g., (1000, 12)
df.head(5)        # First 5 rows (default is 5)
df.tail(5)        # Last 5 rows
df.info()         # Column names, types, non-null counts, memory
df.describe()     # Stats for numeric columns (count, mean, std, min, max, quartiles)
df.columns        # List of column names
df.dtypes         # Data type of each column
\`\`\`

### Reading df.describe() Output

\`\`\`python
df["salary"].describe()

count     4.000000   ← how many non-null values
mean  74000.000000   ← average salary
std   14337.166941   ← standard deviation (spread)
min   61000.000000   ← minimum salary
25%   66250.000000   ← 25th percentile (Q1)
50%   70000.000000   ← median (Q2)
75%   78000.000000   ← 75th percentile (Q3)
max   95000.000000   ← maximum salary
\`\`\`

---

## 4. Selecting Data

### Selecting a Column (returns a Series)

\`\`\`python
df["salary"]          # Returns: 0    72000
                      #          1    95000
                      #          Name: salary, dtype: int64
\`\`\`

### Selecting Multiple Columns (returns a DataFrame)

\`\`\`python
df[["name", "salary"]]        # Pass a list of column names
df[["name", "dept", "score"]] # Three columns
\`\`\`

Note the double brackets \`[[ ]]\` — the outer \`[ ]\` is the indexer, the inner \`[ ]\` is a Python list.

---

## 5. Filtering Rows — Boolean Indexing

This is Pandas' most important skill. The logic:
1. Create a True/False (boolean) mask: \`df["salary"] > 80000\`
2. Pass the mask into df\[ \] to keep only True rows

\`\`\`python
# Single condition
it_staff = df[df["dept"] == "IT"]           # Rows where dept is IT
high_pay  = df[df["salary"] > 80000]        # Rows where salary > 80000

# Multiple conditions — use & (and), | (or), ~ (not)
# ⚠️ Must wrap each condition in parentheses!
it_high = df[(df["dept"] == "IT") & (df["salary"] > 80000)]
it_or_hr = df[(df["dept"] == "IT") | (df["dept"] == "HR")]
not_sales = df[~(df["dept"] == "Sales")]     # ~ means NOT
\`\`\`

### .isin() — like SQL IN

\`\`\`python
# Instead of: df[(df["dept"]=="IT") | (df["dept"]=="HR")]
df[df["dept"].isin(["IT", "HR"])]
\`\`\`

---

## 6. Sorting

\`\`\`python
# Sort by one column
df.sort_values("salary")                          # ascending (default)
df.sort_values("salary", ascending=False)          # descending

# Sort by multiple columns
df.sort_values(["dept", "salary"], ascending=[True, False])
# Dept A-Z, then salary highest first within each dept
\`\`\`

---

## 7. Creating Computed Columns

\`\`\`python
# Add a new column with a formula (like Excel "=")
df["annual_bonus"]    = df["salary"] * 0.10
df["monthly_salary"]  = (df["salary"] / 12).round(2)
df["experience_band"] = df["years"].apply(
    lambda y: "Senior" if y >= 7 else "Mid" if y >= 4 else "Junior"
)

# String operations
df["name_upper"]     = df["name"].str.upper()
df["dept_city"]      = df["dept"] + " - " + df["city"]
\`\`\`

The \`.apply()\` method applies a function to every row — perfect for conditional logic.

---

## 8. Quick Aggregations

\`\`\`python
df["salary"].sum()              # Total payroll
df["salary"].mean()             # Average salary
df["salary"].median()           # Median salary
df["salary"].max()              # Highest salary
df["salary"].min()              # Lowest salary
df["dept"].value_counts()       # Count per department
df["dept"].nunique()            # Number of unique departments
\`\`\`

### Group By — Aggregate per Category

\`\`\`python
# Average salary per department
df.groupby("dept")["salary"].mean()

# Multiple stats per department
df.groupby("dept").agg(
    headcount=("name", "count"),
    avg_salary=("salary", "mean"),
    max_salary=("salary", "max"),
).round(0)
\`\`\`

---

## 9. Saving Your Work

\`\`\`python
# Save DataFrame to CSV
df.to_csv("cleaned_employees.csv", index=False)   # index=False omits the row numbers

# Save to Excel
df.to_excel("report.xlsx", sheet_name="Employees", index=False)
\`\`\`

---

## 10. The Pandas Workflow for Beginners

\`\`\`
1. Load data:      df = pd.read_csv("file.csv")
2. Explore:        df.shape, df.head(), df.info(), df.describe()
3. Clean:          handle nulls, fix types (covered in the PRO tier)
4. Select/filter:  df[["col1","col2"]], df[df["col"] > value]
5. Sort:           df.sort_values("col", ascending=False)
6. Aggregate:      df.groupby("col")["value"].sum()
7. Add columns:    df["new"] = df["existing"] * factor
8. Save:           df.to_csv("output.csv", index=False)
\`\`\`

> 🎯 **After this chapter:** You can load any CSV, explore it, filter it, sort it, compute new columns, and export results — all the core daily tasks of a data analyst. You are now a beginner Pandas user!`,
    questions: [
      q('What does import pandas as pd mean?',
        [{ id: 'a', text: 'Install the pandas library from the internet' }, { id: 'b', text: 'Import the pandas library and give it the alias "pd" for shorter syntax' }, { id: 'c', text: 'Create a new module called pandas inside your project' }, { id: 'd', text: 'pd is short for "pandas data" — a special data type' }],
        'b', 'import pandas as pd loads the Pandas library and assigns it the alias "pd". This means instead of writing pandas.DataFrame(...) or pandas.read_csv(...), you write pd.DataFrame(...) and pd.read_csv(...). The "as pd" convention is universal in the Python analytics community.', 0),
      q('What does df.shape return?',
        [{ id: 'a', text: 'A list of column names' }, { id: 'b', text: 'The data types of each column' }, { id: 'c', text: 'A tuple (number_of_rows, number_of_columns)' }, { id: 'd', text: 'The memory size of the DataFrame' }],
        'c', 'df.shape returns a tuple like (891, 12) — 891 rows and 12 columns. It is the very first thing to check when loading a dataset to understand its size. The first value is always rows; the second is always columns.', 1),
      q('What is the difference between df["salary"] and df[["salary"]]?',
        [{ id: 'a', text: 'They are identical — both return the same result' }, { id: 'b', text: 'df["salary"] returns a Series (single column); df[["salary"]] returns a DataFrame (table with one column)' }, { id: 'c', text: 'df[["salary"]] raises an error — double brackets are not valid' }, { id: 'd', text: 'df["salary"] returns a copy; df[["salary"]] returns a reference' }],
        'b', 'Single brackets return a Pandas Series (1-D array). Double brackets pass a list and return a DataFrame (2-D table). This matters because many Pandas operations behave differently on Series vs DataFrames. Use [["col"]] when you need to keep the result as a table.', 2),
      q('How do you filter rows where salary is greater than 80,000 in Pandas?',
        [{ id: 'a', text: 'df.filter(salary > 80000)' }, { id: 'b', text: 'df.where("salary", ">", 80000)' }, { id: 'c', text: 'df[df["salary"] > 80000]' }, { id: 'd', text: 'df.select(salary=">80000")' }],
        'c', 'Boolean indexing: df["salary"] > 80000 creates a True/False mask; passing it to df[] keeps only True rows. This is the standard Pandas filtering pattern and mirrors the SQL WHERE clause.', 3),
      q('What does df.describe() show?',
        [{ id: 'a', text: 'A description of each column\'s purpose' }, { id: 'b', text: 'Statistical summary (count, mean, std, min, quartiles, max) for all numeric columns' }, { id: 'c', text: 'The first 5 rows of the DataFrame' }, { id: 'd', text: 'The data types of each column' }],
        'b', 'df.describe() computes descriptive statistics for numeric columns: count (non-null values), mean, standard deviation, min, 25th percentile, 50th percentile (median), 75th percentile, and max. Use it immediately after loading data to spot anomalies.', 4),
      q('How do you select employees who are in IT AND have a salary above 90,000?',
        [{ id: 'a', text: 'df[df["dept"] == "IT" and df["salary"] > 90000]' }, { id: 'b', text: 'df[df["dept"] == "IT" & df["salary"] > 90000]' }, { id: 'c', text: 'df[(df["dept"] == "IT") & (df["salary"] > 90000)]' }, { id: 'd', text: 'df.filter(dept="IT", salary=">90000")' }],
        'c', 'Multiple conditions in Pandas use & (AND), | (OR), and ~ (NOT). Each condition must be wrapped in parentheses due to Python\'s operator precedence. Do NOT use Python\'s "and" keyword — use & instead.', 5),
      q('What does df.sort_values("salary", ascending=False) do?',
        [{ id: 'a', text: 'Sorts alphabetically by the salary column name' }, { id: 'b', text: 'Returns a new DataFrame sorted by salary from highest to lowest' }, { id: 'c', text: 'Sorts the salary column in ascending order' }, { id: 'd', text: 'Modifies df in place — the original DataFrame is changed' }],
        'b', 'sort_values() returns a new sorted DataFrame — it does NOT modify the original unless you add inplace=True. ascending=False means descending order (highest first). This mirrors SQL\'s ORDER BY salary DESC.', 6),
      q('What does df["salary"].mean() return?',
        [{ id: 'a', text: 'The most common salary value (mode)' }, { id: 'b', text: 'The middle salary value (median)' }, { id: 'c', text: 'The arithmetic average of all salary values' }, { id: 'd', text: 'The total sum of all salaries' }],
        'c', '.mean() computes the arithmetic mean (sum / count) of the column. It is equivalent to the Excel =AVERAGE() function and SQL\'s AVG(salary). For the median use .median(), for the mode use .mode(), for total use .sum().', 7),
      q('What does df.info() show that df.describe() does NOT?',
        [{ id: 'a', text: 'Standard deviation and quartiles' }, { id: 'b', text: 'Non-null count, data type per column, and memory usage' }, { id: 'c', text: 'The first 5 rows of data' }, { id: 'd', text: 'The correlation between columns' }],
        'b', 'df.info() shows column names, non-null counts (important for spotting missing data), data types (int64, object, float64), and memory usage. df.describe() shows numerical statistics. Use both — they are complementary.', 8),
      q('How do you add a new column "annual_bonus" equal to 10% of salary?',
        [{ id: 'a', text: 'df.add_column("annual_bonus", df["salary"] / 10)' }, { id: 'b', text: 'df["annual_bonus"] = df["salary"] * 0.10' }, { id: 'c', text: 'df.apply("annual_bonus", df["salary"] * 0.10)' }, { id: 'd', text: 'df.column("annual_bonus") = salary * 0.10' }],
        'b', 'Assigning to df["new_column_name"] creates or overwrites that column. The right side can be a scalar, a Series, or a vectorised expression like df["salary"] * 0.10. This is equivalent to adding a formula column in Excel.', 9),
      q('What does df["dept"].value_counts() return?',
        [{ id: 'a', text: 'The list of unique department names' }, { id: 'b', text: 'The number of unique departments' }, { id: 'c', text: 'A count of rows for each unique department value, sorted by frequency' }, { id: 'd', text: 'The percentage of each department' }],
        'c', 'value_counts() counts how many times each unique value appears in the column, sorted from most frequent to least. It is equivalent to SQL\'s SELECT dept, COUNT(*) FROM employees GROUP BY dept ORDER BY COUNT(*) DESC.', 10),
      q('What does df.to_csv("output.csv", index=False) do?',
        [{ id: 'a', text: 'Reads a CSV and stores it in df' }, { id: 'b', text: 'Saves the DataFrame to a CSV file, without writing the Pandas row index numbers' }, { id: 'c', text: 'Exports only the index column to a CSV' }, { id: 'd', text: 'Deletes the index column from df permanently' }],
        'b', 'df.to_csv() saves the DataFrame to a file. index=False prevents Pandas from writing the row number (0, 1, 2...) as an extra column in the CSV — you almost always want index=False for clean output files.', 11),
      q('What is the Pandas equivalent of SQL\'s SELECT dept, COUNT(*) FROM employees GROUP BY dept?',
        [{ id: 'a', text: 'df["dept"].count()' }, { id: 'b', text: 'df.groupby("dept")["dept"].count()' }, { id: 'c', text: 'df.groupby("dept").size()' }, { id: 'd', text: 'df.count().groupby("dept")' }],
        'c', 'df.groupby("dept").size() counts rows per group — equivalent to COUNT(*) in SQL. Alternatively, df.groupby("dept")["any_col"].count() works for non-null count. .size() counts ALL rows; .count() counts non-null values.', 12),
      q('How do you use .isin() to filter employees in IT or HR departments?',
        [{ id: 'a', text: 'df[df["dept"].isin["IT", "HR"]]' }, { id: 'b', text: 'df[df["dept"].isin(["IT", "HR"])]' }, { id: 'c', text: 'df.isin(dept=["IT", "HR"])' }, { id: 'd', text: 'df[df["dept"] == ["IT", "HR"]]' }],
        'b', '.isin() accepts a list and returns True for rows where the column value is in that list. The syntax is series.isin([list_of_values]). It is the Pandas equivalent of SQL\'s WHERE dept IN ("IT", "HR").', 13),
      q('What does df.head(10) return?',
        [{ id: 'a', text: 'The 10 rows with the highest values' }, { id: 'b', text: 'The first 10 rows of the DataFrame' }, { id: 'c', text: 'A summary of the top 10 columns' }, { id: 'd', text: 'The DataFrame sorted in ascending order, top 10' }],
        'b', 'df.head(n) returns the first n rows of the DataFrame. Default is 5 if no argument is provided. It is the quickest way to preview your data after loading — equivalent to SELECT * FROM table LIMIT 10 in SQL.', 14),
    ],
  },
];

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Data Analytics — Noob Level Block 2\n');

  const course = await prisma.course.findUnique({ where: { slug: COURSE_SLUG } });
  if (!course) { console.error('❌ Course not found!'); process.exit(1); }

  console.log(`📚 Seeding ${CHAPTERS.length} chapters...\n`);

  for (const ch of CHAPTERS) {
    const { questions, ...chapterData } = ch as any;

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

    console.log(`  ✅ [${chapterData.orderIndex}] ${chapterData.title}  (${questions.length} Qs · ${chapterData.xpReward} XP)`);
  }

  console.log('\n🎉 Block 2 complete! Noob Level chapters 5-8 seeded.');
  console.log('   Next: run seed:da-noob-b3 for Statistics, Visualization, Matplotlib & Projects');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
