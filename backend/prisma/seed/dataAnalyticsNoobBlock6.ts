/**
 * dataAnalyticsNoobBlock6.ts
 *
 * Noob Level — Block 6: Professional Skills & Real-world Tools
 * Chapters 20-25 (orderIndex 20-25).
 *
 * Topics:
 *   20 — SQL Real-world Case Study — E-Commerce Analytics
 *   21 — Excel Advanced Functions — VLOOKUP, INDEX/MATCH & Power Query
 *   22 — Working with APIs & JSON Data in Python
 *   23 — Data Ethics, Privacy & Responsible Analytics
 *   24 — Git & Version Control for Data Analysts
 *   25 — Storytelling with Data — Dashboards, Reports & Presentations
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const IDX_TO_ID = ['a', 'b', 'c', 'd'];

// ---------------------------------------------------------------------------

const CHAPTERS = [

  // ── 1 of 6 ────────────────────────────────────────────────────────────────
  {
    title:       'SQL Real-world Case Study — E-Commerce Analytics',
    slug:        'da-noob-24-sql-case-study',
    description: 'Apply everything you know about SQL to a realistic e-commerce database. Write complex multi-table queries, compute revenue KPIs, segment customers, and build a mini analytical dashboard — all in SQL.',
    tier:        'NOOB' as const,
    orderIndex:  20,
    xpReward:    90,
    content: `# SQL Real-world Case Study — E-Commerce Analytics

## The Database Schema

Imagine you have joined an e-commerce analytics team. The database has four core tables:

\`\`\`sql
customers   (customer_id, name, email, country, signup_date)
products    (product_id, name, category, price, cost)
orders      (order_id, customer_id, order_date, status)
order_items (item_id, order_id, product_id, quantity, unit_price)
\`\`\`

Your goal: answer business questions using SQL.

---

## Section 1 — Revenue & Sales KPIs

### Total Revenue (All Time)

\`\`\`sql
SELECT
  ROUND(SUM(quantity * unit_price), 2) AS total_revenue
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
WHERE o.status = 'completed';
\`\`\`

### Monthly Revenue Trend

\`\`\`sql
SELECT
  STRFTIME('%Y-%m', o.order_date)      AS month,
  COUNT(DISTINCT o.order_id)           AS num_orders,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.status = 'completed'
GROUP BY month
ORDER BY month;
\`\`\`

### Average Order Value (AOV)

\`\`\`sql
SELECT
  ROUND(SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT o.order_id), 2) AS aov
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.status = 'completed';
\`\`\`

---

## Section 2 — Product Performance

### Top 10 Products by Revenue

\`\`\`sql
SELECT
  p.name                             AS product,
  p.category,
  SUM(oi.quantity)                   AS units_sold,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue,
  ROUND(SUM(oi.quantity * (oi.unit_price - p.cost)), 2) AS gross_profit
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o   ON oi.order_id   = o.order_id
WHERE o.status = 'completed'
GROUP BY p.product_id, p.name, p.category
ORDER BY revenue DESC
LIMIT 10;
\`\`\`

### Revenue by Category

\`\`\`sql
SELECT
  p.category,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue,
  ROUND(100.0 * SUM(oi.quantity * oi.unit_price) /
        SUM(SUM(oi.quantity * oi.unit_price)) OVER (), 1) AS pct_of_total
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o   ON oi.order_id   = o.order_id
WHERE o.status = 'completed'
GROUP BY p.category
ORDER BY revenue DESC;
\`\`\`

---

## Section 3 — Customer Analytics

### Customers Who Have Never Ordered

\`\`\`sql
SELECT c.customer_id, c.name, c.email, c.signup_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
\`\`\`

### Customer Lifetime Value (CLV)

\`\`\`sql
SELECT
  c.customer_id,
  c.name,
  COUNT(DISTINCT o.order_id)               AS total_orders,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS lifetime_value,
  MIN(o.order_date)                        AS first_order,
  MAX(o.order_date)                        AS last_order
FROM customers c
JOIN orders o     ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id  = oi.order_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.name
ORDER BY lifetime_value DESC;
\`\`\`

### Customer Segmentation with CASE WHEN

\`\`\`sql
WITH customer_stats AS (
  SELECT
    c.customer_id, c.name,
    COUNT(DISTINCT o.order_id)                AS total_orders,
    ROUND(SUM(oi.quantity * oi.unit_price), 2) AS ltv
  FROM customers c
  JOIN orders o       ON c.customer_id = o.customer_id
  JOIN order_items oi ON o.order_id    = oi.order_id
  WHERE o.status = 'completed'
  GROUP BY c.customer_id, c.name
)
SELECT *,
  CASE
    WHEN ltv > 1000 AND total_orders >= 5 THEN 'VIP'
    WHEN ltv >  500 OR  total_orders >= 3 THEN 'Regular'
    ELSE 'Occasional'
  END AS segment
FROM customer_stats
ORDER BY ltv DESC;
\`\`\`

---

## Section 4 — Time-based Analysis

### Month-over-Month Revenue Growth

\`\`\`sql
WITH monthly AS (
  SELECT
    STRFTIME('%Y-%m', o.order_date) AS month,
    SUM(oi.quantity * oi.unit_price) AS revenue
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  WHERE o.status = 'completed'
  GROUP BY month
)
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
        / LAG(revenue) OVER (ORDER BY month), 1) AS mom_growth_pct
FROM monthly;
\`\`\`

---

## Section 5 — Using Window Functions

### Revenue Rank per Category

\`\`\`sql
SELECT
  p.category,
  p.name,
  SUM(oi.quantity * oi.unit_price) AS revenue,
  RANK() OVER (PARTITION BY p.category
               ORDER BY SUM(oi.quantity * oi.unit_price) DESC) AS rank_in_category
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o   ON oi.order_id   = o.order_id
WHERE o.status = 'completed'
GROUP BY p.category, p.name;
\`\`\`

---

## Summary — SQL Analytics Patterns

| Business Question | SQL Pattern |
|-------------------|------------|
| Total / average KPI | \`SUM()\`, \`AVG()\`, \`COUNT()\` |
| Trend over time | \`GROUP BY STRFTIME('%Y-%m', date)\` |
| Who never did X | \`LEFT JOIN ... WHERE right.id IS NULL\` |
| Rank within group | \`RANK() OVER (PARTITION BY ... ORDER BY ...)\` |
| Period comparison | \`LAG()\` window function |
| Percentage of total | \`SUM(x) / SUM(SUM(x)) OVER ()\` |
| Customer segments | \`CASE WHEN ... THEN ... END\` |
`,
    codeExample: `-- E-Commerce Analytics: Executive KPI Summary
-- Run this against an e-commerce SQLite database

-- ── 1. Overall KPIs ───────────────────────────────────────────────────────
SELECT
  COUNT(DISTINCT o.order_id)                           AS total_orders,
  COUNT(DISTINCT o.customer_id)                        AS unique_customers,
  ROUND(SUM(oi.quantity * oi.unit_price), 2)           AS total_revenue,
  ROUND(AVG(oi.quantity * oi.unit_price), 2)           AS avg_item_value,
  ROUND(SUM(oi.quantity * oi.unit_price)
        / COUNT(DISTINCT o.order_id), 2)               AS avg_order_value
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.status = 'completed';

-- ── 2. Top 5 customers ────────────────────────────────────────────────────
SELECT
  c.name,
  c.country,
  COUNT(DISTINCT o.order_id)                          AS orders,
  ROUND(SUM(oi.quantity * oi.unit_price), 2)          AS lifetime_value
FROM customers c
JOIN orders o       ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id    = oi.order_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.name, c.country
ORDER BY lifetime_value DESC
LIMIT 5;

-- ── 3. Best performing category this quarter ──────────────────────────────
SELECT
  p.category,
  SUM(oi.quantity)                                    AS units_sold,
  ROUND(SUM(oi.quantity * oi.unit_price), 2)          AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o   ON oi.order_id   = o.order_id
WHERE o.status = 'completed'
  AND o.order_date >= DATE('now', '-3 months')
GROUP BY p.category
ORDER BY revenue DESC;`,
    quizzes: [
      {
        question: 'What SQL function calculates the sum of all revenue values?',
        options: ['COUNT(revenue)', 'SUM(revenue)', 'TOTAL(revenue)', 'ADD(revenue)'],
        correctAnswer: 1,
        explanation: 'SUM() is the standard SQL aggregate function for adding up numeric values.',
      },
      {
        question: 'How do you find customers who have never placed an order?',
        options: [
          'INNER JOIN orders WHERE order_id IS NULL',
          'LEFT JOIN orders ON customer_id WHERE order_id IS NULL',
          'NOT EXISTS (SELECT order_id FROM orders)',
          'Both B and C are correct approaches',
        ],
        correctAnswer: 3,
        explanation: 'Both LEFT JOIN + IS NULL and NOT EXISTS correctly find customers with no matching orders.',
      },
      {
        question: 'What is Average Order Value (AOV)?',
        options: [
          'The average number of products per order',
          'Total revenue divided by total number of orders',
          'The median price of all products',
          'Revenue divided by number of customers',
        ],
        correctAnswer: 1,
        explanation: 'AOV = SUM(revenue) / COUNT(DISTINCT order_id) — how much customers spend per order on average.',
      },
      {
        question: 'What does PARTITION BY do in a window function?',
        options: [
          'Splits the database into multiple tables',
          'Groups rows for the window function without collapsing them like GROUP BY',
          'Creates a temporary table for intermediate results',
          'Limits the query to a specific date range',
        ],
        correctAnswer: 1,
        explanation: 'PARTITION BY divides rows into groups for window calculations while keeping individual rows visible.',
      },
      {
        question: 'What does the LAG() window function return?',
        options: [
          'The next row\'s value in the ordered partition',
          'The previous row\'s value in the ordered partition',
          'The first row\'s value in the partition',
          'The running total up to the current row',
        ],
        correctAnswer: 1,
        explanation: 'LAG(col) returns the value of col from the preceding row — ideal for period-over-period comparisons.',
      },
      {
        question: 'What does HAVING differ from WHERE in SQL?',
        options: [
          'HAVING filters before grouping, WHERE filters after grouping',
          'HAVING filters after GROUP BY (on aggregated results); WHERE filters before',
          'They are interchangeable in all contexts',
          'HAVING only works with COUNT(); WHERE works with all functions',
        ],
        correctAnswer: 1,
        explanation: 'WHERE filters rows before aggregation; HAVING filters the grouped results after GROUP BY.',
      },
      {
        question: 'In customer segmentation, what does CASE WHEN ... THEN ... END do?',
        options: [
          'Creates a new table with segmented data',
          'Returns a value based on conditional logic — like an if/else per row',
          'Filters rows that match a condition',
          'Joins two tables based on a condition',
        ],
        correctAnswer: 1,
        explanation: 'CASE WHEN evaluates conditions row by row and returns a value — used to create categorical columns.',
      },
      {
        question: 'What does RANK() OVER (PARTITION BY category ORDER BY revenue DESC) compute?',
        options: [
          'The overall rank of each product across all categories',
          'The rank of each product within its own category by revenue',
          'The percentage share of revenue per category',
          'The running total of revenue sorted by category',
        ],
        correctAnswer: 1,
        explanation: 'PARTITION BY category resets the rank counter for each category, then ORDER BY revenue DESC assigns rank 1 to the highest.',
      },
      {
        question: 'What is a CTE (Common Table Expression)?',
        options: [
          'A permanently stored view in the database',
          'A named temporary result set defined with WITH, used within a query',
          'A type of index that speeds up GROUP BY operations',
          'A stored procedure for repeated SQL logic',
        ],
        correctAnswer: 1,
        explanation: 'A CTE (WITH ... AS (...)) creates a named intermediate result that can be referenced in the main query.',
      },
      {
        question: 'How do you calculate month-over-month revenue growth percentage?',
        options: [
          '(current_month - prev_month) / current_month × 100',
          '(current_month - prev_month) / prev_month × 100',
          'current_month / prev_month',
          'SUM(revenue) OVER (ORDER BY month) / COUNT(month)',
        ],
        correctAnswer: 1,
        explanation: 'Growth % = (current − previous) / previous × 100. Use LAG() to get the previous period\'s value.',
      },
    ],
  },

  // ── 2 of 6 ────────────────────────────────────────────────────────────────
  {
    title:       'Excel Advanced Functions — VLOOKUP, INDEX/MATCH & Power Query',
    slug:        'da-noob-25-excel-advanced',
    description: 'Move beyond basic formulas: master VLOOKUP, INDEX/MATCH, XLOOKUP, conditional aggregation with SUMIF/COUNTIF, array calculations with SUMPRODUCT, and automate data transformation with Power Query.',
    tier:        'NOOB' as const,
    orderIndex:  21,
    xpReward:    80,
    content: `# Excel Advanced Functions — VLOOKUP, INDEX/MATCH & Power Query

## Why These Functions Matter

Basic SUM and AVERAGE cover 20% of real analyst work. The functions in this chapter cover the other 80%: looking up values across sheets, aggregating with conditions, and connecting and transforming external data sources.

---

## 1. VLOOKUP — The Classic Lookup

VLOOKUP searches the **leftmost column** of a range and returns a value from a specified column to the right.

\`\`\`
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
\`\`\`

**Example:** Find the product price for order ID 1042.
\`\`\`
=VLOOKUP(1042, Products!A:D, 3, FALSE)
\`\`\`

Arguments:
- \`1042\` — the value to find
- \`Products!A:D\` — the table to search (ID must be in the **leftmost** column A)
- \`3\` — return value from column 3 (Price)
- \`FALSE\` — exact match (always use FALSE for data lookups)

### Key Limitation
VLOOKUP can only look to the **right**. If the value you want is to the LEFT of the search column, VLOOKUP fails.

---

## 2. INDEX/MATCH — The Powerful Alternative

INDEX/MATCH is two functions combined — it can look in **any direction** and is more robust:

\`\`\`
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
\`\`\`

**How it works:**
- \`MATCH(1042, A:A, 0)\` → finds the **row number** where 1042 appears in column A
- \`INDEX(C:C, row_number)\` → returns the value from column C at that row

**Example:** Same lookup as above, but more flexible:
\`\`\`
=INDEX(Products!C:C, MATCH(1042, Products!A:A, 0))
\`\`\`

**Advantages over VLOOKUP:**
- Can return columns to the left of the lookup column
- Not broken by inserting/deleting columns in the middle
- Works better with large datasets (faster)

---

## 3. XLOOKUP — Modern Excel's Answer

In Excel 365 and Excel 2021+, XLOOKUP replaces both:

\`\`\`
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])
\`\`\`

**Example:**
\`\`\`
=XLOOKUP(1042, Products!A:A, Products!C:C, "Not found")
\`\`\`

XLOOKUP can search left, right, vertically, or horizontally, and has built-in error handling.

---

## 4. Conditional Aggregation — SUMIF, COUNTIF, AVERAGEIF

These aggregate only rows that meet a condition:

\`\`\`
=SUMIF(range, criteria, sum_range)
=COUNTIF(range, criteria)
=AVERAGEIF(range, criteria, average_range)
\`\`\`

**Examples:**
\`\`\`
=SUMIF(C:C, "North", D:D)         -- Sum revenue where region = "North"
=COUNTIF(E:E, ">1000")            -- Count rows where sales > 1000
=AVERAGEIF(B:B, "Completed", D:D) -- Avg revenue for completed orders
\`\`\`

### Multiple Criteria — SUMIFS / COUNTIFS

\`\`\`
=SUMIFS(sum_range, criteria_range1, crit1, criteria_range2, crit2)

=SUMIFS(D:D, C:C, "North", B:B, "2024-01")  -- North revenue in Jan 2024
=COUNTIFS(C:C, "North", E:E, ">500")         -- North orders > $500
\`\`\`

---

## 5. SUMPRODUCT — Array Calculations Without Ctrl+Shift+Enter

SUMPRODUCT multiplies corresponding elements of arrays and sums the results:

\`\`\`
=SUMPRODUCT(array1, array2)
\`\`\`

**Weighted Average:**
\`\`\`
=SUMPRODUCT(B2:B10, C2:C10) / SUM(C2:C10)
  -- Weighted average of scores B by weights C
\`\`\`

**Conditional Count (alternative to COUNTIFS):**
\`\`\`
=SUMPRODUCT((C2:C100="North") * (D2:D100>500))
\`\`\`

---

## 6. IFERROR — Graceful Error Handling

Wrap any formula in IFERROR to show a custom value instead of #N/A or #DIV/0!:

\`\`\`
=IFERROR(VLOOKUP(A2, Products!A:D, 3, FALSE), "Product not found")
=IFERROR(B2/C2, 0)                   -- Prevent division by zero
\`\`\`

---

## 7. Power Query — Automate Data Import & Transformation

Power Query (Data → Get Data) lets you connect to data sources and transform them without formulas:

**Typical workflow:**
1. Data → Get Data → From File → From CSV (or From Excel, From Database…)
2. Use the Query Editor to:
   - Remove columns you don't need
   - Filter rows
   - Change data types
   - Split columns
   - Merge (JOIN) multiple sources
   - Unpivot columns (like \`melt\` in Pandas)
3. Click "Close & Load" — data loads into the worksheet
4. **Refresh** — click "Refresh All" whenever the source file updates

**Key advantage:** The transformation steps are recorded and **replayable** — no more copy-paste-format every morning.

---

## 8. Named Ranges — Make Formulas Readable

Instead of \`=SUMIF(D2:D500, "North", E2:E500)\`, use named ranges:

1. Select D2:D500 → Name Box (top-left) → type \`region\` → Enter
2. Select E2:E500 → name \`revenue\`
3. Formula becomes: \`=SUMIF(region, "North", revenue)\`

Named ranges also update automatically when the data grows (use tables for best results).

---

## Summary

| Function | Purpose |
|----------|---------|
| \`VLOOKUP\` | Look up a value in the leftmost column of a range |
| \`INDEX/MATCH\` | Flexible two-way lookup, more robust than VLOOKUP |
| \`XLOOKUP\` | Modern replacement — any direction, built-in error handling |
| \`SUMIF\` | Conditional SUM |
| \`COUNTIF\` | Conditional COUNT |
| \`SUMIFS\` | Multi-condition SUM |
| \`SUMPRODUCT\` | Array multiplication + sum (weighted averages, complex conditions) |
| \`IFERROR\` | Replace errors with a custom value |
| Power Query | Connect, transform, and refresh external data automatically |
`,
    codeExample: `-- Equivalent SQL for the Excel functions above
-- Useful for understanding what each Excel function is doing conceptually

-- VLOOKUP equivalent: Get product price for order items
SELECT
  oi.order_id,
  oi.product_id,
  p.price                          -- the "looked up" value
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id;

-- SUMIF equivalent: Revenue by region
SELECT
  region,
  SUM(revenue) AS total_revenue
FROM sales
GROUP BY region;

-- COUNTIFS equivalent: Orders from North with revenue > 500
SELECT COUNT(*) AS qualifying_orders
FROM sales
WHERE region = 'North' AND revenue > 500;

-- SUMPRODUCT (weighted average) equivalent
SELECT
  SUM(score * weight) / SUM(weight) AS weighted_avg_score
FROM scores_table;

-- XLOOKUP (with not-found) equivalent
SELECT
  COALESCE(p.price, 0) AS price    -- 0 if product not found
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.product_id;`,
    quizzes: [
      {
        question: 'What is the main limitation of VLOOKUP?',
        options: [
          'It only works on numeric values',
          'It can only return values to the right of the lookup column',
          'It requires sorted data to work correctly',
          'It cannot handle more than 100 rows',
        ],
        correctAnswer: 1,
        explanation: 'VLOOKUP searches the leftmost column and can only return columns to its right — it cannot look left.',
      },
      {
        question: 'In =INDEX(C:C, MATCH(1042, A:A, 0)), what does MATCH return?',
        options: [
          'The value in column C at the matched row',
          'The row number where 1042 appears in column A',
          'TRUE or FALSE depending on whether 1042 was found',
          'The count of rows where A equals 1042',
        ],
        correctAnswer: 1,
        explanation: 'MATCH returns the position (row number) of the lookup value in the search range.',
      },
      {
        question: 'What does =SUMIF(C:C, "North", D:D) compute?',
        options: [
          'The count of rows where column C equals "North"',
          'The sum of column D values where column C equals "North"',
          'The average of column D for all rows',
          'Whether "North" exists anywhere in column C',
        ],
        correctAnswer: 1,
        explanation: 'SUMIF sums values in sum_range (D:D) for rows where the criteria_range (C:C) matches the criteria ("North").',
      },
      {
        question: 'What is XLOOKUP\'s key advantage over VLOOKUP?',
        options: [
          'It runs 10x faster on large datasets',
          'It can search in any direction and includes built-in error handling',
          'It works without needing a lookup value',
          'It is available in all Excel versions including Excel 2007',
        ],
        correctAnswer: 1,
        explanation: 'XLOOKUP can look up and return values in any direction (left, right, up, down) and handles missing values gracefully.',
      },
      {
        question: 'What does =SUMPRODUCT(B2:B10, C2:C10) / SUM(C2:C10) calculate?',
        options: [
          'Simple average of column B',
          'Weighted average of column B using column C as weights',
          'Sum of column B times sum of column C',
          'Count of rows where B and C are both non-zero',
        ],
        correctAnswer: 1,
        explanation: 'SUMPRODUCT multiplies each B by its corresponding C, sums the results, then divides by total weight — a weighted average.',
      },
      {
        question: 'What does =IFERROR(formula, "Not found") do?',
        options: [
          'Validates that the formula result is an error',
          'Returns "Not found" instead of an error if the formula fails',
          'Ignores the formula and always returns "Not found"',
          'Logs formula errors to a separate sheet',
        ],
        correctAnswer: 1,
        explanation: 'IFERROR catches any error from the formula and displays your chosen fallback value instead.',
      },
      {
        question: 'What is the primary purpose of Power Query in Excel?',
        options: [
          'Running Python scripts inside Excel',
          'Connecting to data sources, transforming data, and enabling repeatable refresh',
          'Building pivot charts from existing data',
          'Writing SQL queries against Excel tables',
        ],
        correctAnswer: 1,
        explanation: 'Power Query records transformation steps so you can reload and reshape external data with one click.',
      },
      {
        question: 'What does =COUNTIFS(C:C, "North", D:D, ">500") count?',
        options: [
          'Rows where C is "North" OR D is greater than 500',
          'Rows where C is "North" AND D is greater than 500',
          'The number of cells containing "North" in column C',
          'The total value in column D for the North region',
        ],
        correctAnswer: 1,
        explanation: 'COUNTIFS applies ALL criteria simultaneously with AND logic — both conditions must be true for a row to be counted.',
      },
      {
        question: 'What is a Named Range in Excel?',
        options: [
          'A range that contains column headers',
          'A descriptive label assigned to a cell range, usable in formulas instead of cell references',
          'The name of a worksheet',
          'A range formatted with a specific colour',
        ],
        correctAnswer: 1,
        explanation: 'Named ranges replace cryptic references (D2:D500) with readable names (revenue), making formulas self-documenting.',
      },
      {
        question: 'Why is INDEX/MATCH preferred over VLOOKUP for professional work?',
        options: [
          'INDEX/MATCH is faster to type',
          'INDEX/MATCH works in any direction and is not broken by inserting columns',
          'INDEX/MATCH is built into Power Query',
          'INDEX/MATCH automatically handles duplicate values',
        ],
        correctAnswer: 1,
        explanation: 'VLOOKUP breaks when columns are inserted because it uses a fixed column index number; INDEX/MATCH references columns directly.',
      },
    ],
  },

  // ── 3 of 6 ────────────────────────────────────────────────────────────────
  {
    title:       'Working with APIs & JSON Data in Python',
    slug:        'da-noob-26-apis',
    description: 'Learn how to access real-world data through APIs: make HTTP requests with the requests library, authenticate with API keys, parse nested JSON responses, handle pagination and rate limits, and build a simple data pipeline.',
    tier:        'NOOB' as const,
    orderIndex:  22,
    xpReward:    80,
    content: `# Working with APIs & JSON Data in Python

## What is an API?

An **API (Application Programming Interface)** is a service that lets your code ask for data over the internet. Instead of downloading a CSV manually, your Python script sends an HTTP request and receives data — usually in JSON format — automatically.

Examples of public APIs:
- OpenWeatherMap — current weather and forecasts
- CoinGecko — cryptocurrency prices
- REST Countries — country information
- Alpha Vantage — stock market data
- NASA — astronomy data

---

## 1. HTTP Basics

APIs communicate over HTTP. The most common methods:

| Method | Purpose |
|--------|---------|
| \`GET\` | Retrieve data (most analytics APIs use GET) |
| \`POST\` | Send data to create a resource |
| \`PUT\` | Update an existing resource |
| \`DELETE\` | Remove a resource |

**Status codes** tell you what happened:
- \`200 OK\` — success
- \`201 Created\` — resource created
- \`400 Bad Request\` — your request has errors
- \`401 Unauthorized\` — missing or invalid API key
- \`429 Too Many Requests\` — you hit the rate limit
- \`500 Internal Server Error\` — server-side problem

---

## 2. The requests Library

\`\`\`python
pip install requests
\`\`\`

\`\`\`python
import requests

# Simple GET request
response = requests.get("https://restcountries.com/v3.1/name/france")

print(response.status_code)      # 200
print(response.headers["Content-Type"])

data = response.json()           # parse JSON → Python list/dict
print(type(data))                # <class 'list'>
\`\`\`

---

## 3. Passing Parameters and Headers

\`\`\`python
# Query parameters (appear as ?key=value in URL)
params = {
    "q":    "London",
    "appid": "YOUR_API_KEY",
    "units": "metric",
}

response = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params=params,
)

# Authentication via headers (common pattern)
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Accept":        "application/json",
}

response = requests.get("https://api.example.com/data",
                         headers=headers)
\`\`\`

---

## 4. Parsing JSON Responses

JSON is the standard format for API responses. Python's \`response.json()\` converts it to native Python dicts and lists:

\`\`\`python
import requests

url = "https://restcountries.com/v3.1/region/europe"
data = requests.get(url).json()

# data is a list of country dicts
for country in data[:3]:
    print(country["name"]["common"],
          country.get("population", "N/A"))
\`\`\`

### Nested JSON

\`\`\`python
# API response might be nested
response_data = {
    "status": "success",
    "data": {
        "user": {"id": 42, "name": "Alice"},
        "orders": [
            {"id": 101, "amount": 150.0},
            {"id": 102, "amount": 89.0},
        ]
    }
}

orders = response_data["data"]["orders"]
print(orders[0]["amount"])  # 150.0
\`\`\`

---

## 5. JSON to DataFrame

\`\`\`python
import pandas as pd

# Flat JSON list → DataFrame directly
flat_data = [{"id": 1, "name": "Alice", "score": 85},
             {"id": 2, "name": "Bob",   "score": 92}]

df = pd.DataFrame(flat_data)

# Nested JSON → use json_normalize
from pandas import json_normalize

nested = [
    {"id": 1, "user": {"name": "Alice", "city": "NYC"}, "score": 85},
    {"id": 2, "user": {"name": "Bob",   "city": "LA"},  "score": 92},
]

df = json_normalize(nested, sep="_")
# Columns: id, user_name, user_city, score
\`\`\`

---

## 6. Handling Pagination

Many APIs split large datasets across pages. You request them sequentially:

\`\`\`python
import requests

def fetch_all_pages(base_url, params, page_key="page", max_pages=20):
    """Fetch all pages from a paginated API."""
    all_results = []
    params = params.copy()

    for page in range(1, max_pages + 1):
        params[page_key] = page
        resp = requests.get(base_url, params=params)
        resp.raise_for_status()   # raise exception for 4xx/5xx

        data = resp.json()
        results = data.get("results", [])
        if not results:
            break                 # no more data

        all_results.extend(results)

    return all_results
\`\`\`

---

## 7. Rate Limiting — Being a Good API Citizen

\`\`\`python
import time

def safe_request(url, params=None, delay=1.0):
    """Request with retry on rate limit (429)."""
    for attempt in range(3):
        response = requests.get(url, params=params)
        if response.status_code == 429:
            wait = int(response.headers.get("Retry-After", delay * (attempt + 1)))
            print(f"Rate limited. Waiting {wait}s…")
            time.sleep(wait)
        else:
            response.raise_for_status()
            return response.json()
    raise Exception("Failed after 3 attempts")
\`\`\`

---

## 8. Building a Simple Data Pipeline

\`\`\`python
import requests, pandas as pd

def get_crypto_prices(coins):
    """Fetch current prices for a list of coin IDs from CoinGecko."""
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids":            ",".join(coins),
        "vs_currencies":  "usd",
        "include_24hr_change": "true",
    }
    data = requests.get(url, params=params).json()
    rows = [{"coin": coin, **prices} for coin, prices in data.items()]
    return pd.DataFrame(rows)

coins = ["bitcoin", "ethereum", "solana"]
df = get_crypto_prices(coins)
df.to_csv("crypto_prices.csv", index=False)
print(df)
\`\`\`

---

## Summary

| Task | Code |
|------|------|
| GET request | \`requests.get(url, params={})\` |
| Check status | \`response.status_code\` |
| Parse JSON | \`response.json()\` |
| Auth header | \`headers={"Authorization": "Bearer key"}\` |
| Raise on error | \`response.raise_for_status()\` |
| Flatten nested JSON | \`pd.json_normalize(data, sep="_")\` |
| Handle pagination | Loop until empty page |
| Respect rate limits | \`time.sleep()\` between requests |
`,
    codeExample: `import requests
import pandas as pd
from pandas import json_normalize

BASE_URL = "https://restcountries.com/v3.1"

def get_countries_by_region(region):
    """Fetch all countries in a region from the REST Countries API."""
    resp = requests.get(f"{BASE_URL}/region/{region}")
    resp.raise_for_status()
    return resp.json()

def parse_countries(data):
    """Extract relevant fields from the API response."""
    records = []
    for c in data:
        records.append({
            "name":        c["name"]["common"],
            "capital":     c.get("capital", ["N/A"])[0],
            "population":  c.get("population", 0),
            "area_km2":    c.get("area", 0),
            "languages":   ", ".join(c.get("languages", {}).values()),
            "currencies":  ", ".join(c.get("currencies", {}).keys()),
        })
    return pd.DataFrame(records)

# --- Fetch and analyse European countries ---
raw = get_countries_by_region("europe")
df  = parse_countries(raw)

df["pop_density"] = (df["population"] / df["area_km2"]).round(1)
df_sorted = df.sort_values("population", ascending=False)

print(f"Countries fetched: {len(df)}")
print("\\nTop 10 by population:")
print(df_sorted[["name","population","pop_density"]].head(10).to_string(index=False))

df_sorted.to_csv("europe_countries.csv", index=False)
print("\\nSaved to europe_countries.csv")`,
    quizzes: [
      {
        question: 'What does API stand for?',
        options: [
          'Automated Programming Interface',
          'Application Programming Interface',
          'Advanced Python Integration',
          'Asynchronous Protocol Interchange',
        ],
        correctAnswer: 1,
        explanation: 'API stands for Application Programming Interface — a standardised way for programs to communicate with each other.',
      },
      {
        question: 'Which HTTP method is used to retrieve data from an API?',
        options: ['POST', 'PUT', 'GET', 'FETCH'],
        correctAnswer: 2,
        explanation: 'GET is the standard HTTP method for reading/retrieving data — it does not modify any server-side state.',
      },
      {
        question: 'What does response.status_code == 200 indicate?',
        options: [
          'The request was rejected due to an invalid API key',
          'The request succeeded and data was returned',
          'The server is overloaded',
          'The request is still being processed',
        ],
        correctAnswer: 1,
        explanation: '200 OK is the standard success status code meaning the request was received and processed correctly.',
      },
      {
        question: 'How do you pass query parameters with requests.get()?',
        options: [
          'Append them manually to the URL string',
          'Pass a dict to the params= argument',
          'Use the headers= argument',
          'Call requests.params.update() before get()',
        ],
        correctAnswer: 1,
        explanation: 'params= accepts a dict and automatically URL-encodes it as ?key=value pairs in the request.',
      },
      {
        question: 'What does response.json() return?',
        options: [
          'A raw JSON string',
          'A Python dict or list parsed from the JSON response body',
          'A file object containing JSON',
          'A pandas DataFrame',
        ],
        correctAnswer: 1,
        explanation: 'response.json() deserialises the JSON response body into native Python objects (dict or list).',
      },
      {
        question: 'What HTTP status code indicates you have hit the API\'s rate limit?',
        options: ['400', '401', '404', '429'],
        correctAnswer: 3,
        explanation: '429 Too Many Requests means you have exceeded the API\'s allowed request rate and should back off.',
      },
      {
        question: 'What does pd.json_normalize(data, sep="_") do?',
        options: [
          'Converts a flat DataFrame to nested JSON',
          'Flattens nested JSON objects into a flat DataFrame with underscore-separated column names',
          'Validates JSON structure against a schema',
          'Removes all null values from a JSON list',
        ],
        correctAnswer: 1,
        explanation: 'json_normalize handles nested dicts by creating flattened column names, e.g. user.name becomes user_name.',
      },
      {
        question: 'What is API pagination?',
        options: [
          'Splitting API documentation across multiple web pages',
          'Dividing large result sets into pages that must be requested separately',
          'Caching API responses to reduce server load',
          'Versioning an API with numbered endpoints',
        ],
        correctAnswer: 1,
        explanation: 'Pagination limits responses to N records per page; you loop over pages until you receive an empty response.',
      },
      {
        question: 'How do you authenticate with a Bearer token in requests?',
        options: [
          'params={"token": "YOUR_TOKEN"}',
          'headers={"Authorization": "Bearer YOUR_TOKEN"}',
          'auth=("bearer", "YOUR_TOKEN")',
          'requests.set_token("YOUR_TOKEN")',
        ],
        correctAnswer: 1,
        explanation: 'Bearer tokens are passed in the Authorization header using the "Bearer TOKEN" format.',
      },
      {
        question: 'What does response.raise_for_status() do?',
        options: [
          'Prints the HTTP status code to the terminal',
          'Raises an HTTPError exception if the status code indicates an error (4xx or 5xx)',
          'Retries the request if it failed',
          'Converts the response to a string',
        ],
        correctAnswer: 1,
        explanation: 'raise_for_status() is a convenient way to detect errors — it raises an exception for any non-successful status code.',
      },
    ],
  },

  // ── 4 of 6 ────────────────────────────────────────────────────────────────
  {
    title:       'Data Ethics, Privacy & Responsible Analytics',
    slug:        'da-noob-27-data-ethics',
    description: 'Understand the ethical responsibilities that come with data power: personal data and privacy law, algorithmic bias and its real-world consequences, data anonymisation techniques, and how to build an ethical analytical mindset.',
    tier:        'NOOB' as const,
    orderIndex:  23,
    xpReward:    70,
    content: `# Data Ethics, Privacy & Responsible Analytics

## Why Ethics Belongs in Every Analyst's Toolkit

Data analysts wield significant power. A poorly designed model can deny someone a loan. A biased dataset can perpetuate discrimination at scale. A privacy breach can destroy trust and cause real harm to real people. Understanding ethics is not optional — it is a professional responsibility.

---

## 1. The Data Power Problem

**Data asymmetry:** organisations know far more about individuals than individuals know about organisations. This power imbalance creates responsibilities:

- You have access to sensitive information about people
- Your analysis shapes decisions that affect people's lives
- Errors, biases, or misuse can cause widespread harm

---

## 2. Personal Data and Privacy

**Personal data (PII — Personally Identifiable Information)** is any information that can identify a specific individual:

**Direct PII:**
- Full name, email address, phone number
- National ID / social security number
- Biometric data (fingerprints, face scan)

**Indirect PII (combined, can identify someone):**
- ZIP code + date of birth + gender
- IP address (in many jurisdictions)
- Browser fingerprint

### Sensitive PII (highest protection required)
- Health / medical data
- Financial records
- Race, religion, sexual orientation
- Criminal history

---

## 3. Privacy Regulations — GDPR and CCPA

### GDPR (General Data Protection Regulation — EU, 2018)

Key principles:
- **Lawful basis** — you need a legal reason to process personal data
- **Data minimisation** — collect only what is necessary
- **Purpose limitation** — use data only for the stated purpose
- **Right to erasure ("right to be forgotten")** — users can request deletion
- **Data portability** — users can request their data in a machine-readable format
- **Breach notification** — notify authorities within 72 hours of a breach

Fines: up to €20 million or 4% of global annual turnover.

### CCPA (California Consumer Privacy Act — USA, 2020)

- California residents have the right to know what data is collected
- Right to opt out of data sales
- Right to request deletion

---

## 4. Algorithmic Bias — Real Consequences

**Algorithmic bias** occurs when an AI or data model produces systematically unfair outcomes for certain groups.

**Famous examples:**
- **COMPAS (2016)** — a recidivism prediction tool was found to be biased against Black defendants, falsely flagging them as high-risk at twice the rate
- **Amazon's recruiting tool (2018)** — an ML hiring model trained on historical resumes penalised CVs that contained the word "women's" and downgraded graduates of all-women's colleges
- **Face recognition** — major commercial systems had error rates of <1% for light-skinned males but up to 35% for dark-skinned females

**Root causes of bias:**
- **Historical bias** — training data reflects historical discrimination
- **Sampling bias** — underrepresentation of minority groups
- **Label bias** — biased human judgements used as ground truth
- **Feedback loops** — model predictions influence future training data

---

## 5. Data Anonymisation Techniques

Anonymisation removes or obscures personal identifiers:

| Technique | How It Works |
|-----------|-------------|
| **Pseudonymisation** | Replace names with random IDs (reversible with key) |
| **Generalisation** | Replace exact values with ranges (age 34 → 30-40) |
| **Data masking** | Replace digits/chars with X (card 4111→ XXXX-XXXX-XXXX-1234) |
| **Aggregation** | Report group statistics, never individuals |
| **Differential privacy** | Add statistical noise so individuals cannot be identified |

**Re-identification risk:** Even "anonymised" data can be de-anonymised when combined with other datasets. Netflix "anonymised" movie ratings were re-identified by cross-referencing with public IMDb reviews.

---

## 6. Informed Consent

**Informed consent** means people explicitly agree to data collection with full understanding of:
- What data is collected
- How it will be used
- Who it will be shared with
- How long it will be kept

Pre-ticked checkboxes and buried 50-page terms are not genuine consent.

---

## 7. Building an Ethical Analytics Practice

**Questions to ask before any analysis:**
1. Is there a valid, legal basis for collecting and using this data?
2. Could this analysis harm any group of people?
3. Is the data representative of the population I am drawing conclusions about?
4. Am I reporting results honestly — including uncertainties and limitations?
5. Who has access to this analysis and could they misuse it?

**Checklist for every project:**
- [ ] Remove or pseudonymise PII in analysis datasets
- [ ] Document data sources, transformations, and assumptions
- [ ] Test for disparate impact across demographic groups
- [ ] Seek review when analysing sensitive or vulnerable populations
- [ ] Report limitations clearly alongside findings

---

## 8. Data Ethics in Practice

**Scenario A:** You notice your company's credit-scoring model has an 8% higher denial rate for applicants from a certain postcode (which happens to correlate with race). What do you do?

→ Flag it immediately. This is potential proxy discrimination. Document your finding and escalate to legal/compliance.

**Scenario B:** A manager asks you to analyse individual employee performance at the keystroke level without informing employees.

→ This may violate privacy law and employee trust. Push back and request a privacy impact assessment.

---

## Summary

| Concept | Key Point |
|---------|----------|
| PII | Any data that can identify a person |
| GDPR | EU privacy law — consent, minimisation, right to erasure |
| Algorithmic bias | Systematic unfairness baked into models |
| Anonymisation | Removing identifiers to protect privacy |
| Informed consent | Explicit, informed agreement to data use |
| Ethical mindset | Ask "who could this harm?" before every analysis |
`,
    codeExample: `import pandas as pd
import hashlib
import re

# ── Data anonymisation utilities ───────────────────────────────────────────

def pseudonymise(df, id_col, salt="secret_salt"):
    """Replace an ID column with a one-way hash (pseudonymisation)."""
    df = df.copy()
    df[id_col] = df[id_col].astype(str).apply(
        lambda x: hashlib.sha256((x + salt).encode()).hexdigest()[:12]
    )
    return df

def mask_email(email):
    """Mask email: alice@example.com → a***e@example.com"""
    parts = email.split("@")
    if len(parts) != 2:
        return "***"
    name = parts[0]
    masked = name[0] + "***" + name[-1] if len(name) > 2 else "***"
    return f"{masked}@{parts[1]}"

def generalise_age(age, bucket_size=10):
    """Replace exact age with an age band: 34 → '30-39'"""
    low = (age // bucket_size) * bucket_size
    return f"{low}-{low + bucket_size - 1}"

def mask_card(card_number):
    """Show only last 4 digits of a card number."""
    digits = re.sub(r"\\D", "", str(card_number))
    return "****-****-****-" + digits[-4:]

# ── Example usage ──────────────────────────────────────────────────────────
customers = pd.DataFrame({
    "customer_id": [1001, 1002, 1003],
    "name":        ["Alice Johnson", "Bob Smith", "Carol White"],
    "email":       ["alice@example.com", "bob@test.org", "carol@mail.com"],
    "age":         [34, 27, 51],
    "card":        ["4111111111111234", "5500000000001289", "340000000001234"],
})

anon = (customers
        .pipe(pseudonymise, "customer_id")
        .assign(email   = lambda df: df["email"].apply(mask_email),
                age_band= lambda df: df["age"].apply(generalise_age),
                card    = lambda df: df["card"].apply(mask_card))
        .drop(columns=["name", "age"]))   # drop direct PII

print("Anonymised dataset:")
print(anon.to_string(index=False))`,
    quizzes: [
      {
        question: 'What does PII stand for?',
        options: [
          'Personal Information Index',
          'Personally Identifiable Information',
          'Private Internet Interface',
          'Protected Individual Identity',
        ],
        correctAnswer: 1,
        explanation: 'PII (Personally Identifiable Information) is any data that can identify a specific individual.',
      },
      {
        question: 'What does GDPR stand for?',
        options: [
          'General Data Privacy Rights',
          'General Data Protection Regulation',
          'Government Data Processing Rules',
          'Global Digital Privacy Registry',
        ],
        correctAnswer: 1,
        explanation: 'GDPR is the EU\'s General Data Protection Regulation, in force since 2018, governing how personal data must be handled.',
      },
      {
        question: 'What is data minimisation under GDPR?',
        options: [
          'Compressing data files to save storage',
          'Collecting only the personal data necessary for the stated purpose',
          'Removing all personal data from databases quarterly',
          'Using the smallest possible database server',
        ],
        correctAnswer: 1,
        explanation: 'Data minimisation means you should not collect or store more personal data than strictly needed for your purpose.',
      },
      {
        question: 'What is algorithmic bias?',
        options: [
          'An algorithm that runs slower than expected',
          'Systematic unfairness in model outputs that disadvantages certain groups',
          'Errors caused by incorrect data types in a model',
          'A model that is biased toward accuracy over speed',
        ],
        correctAnswer: 1,
        explanation: 'Algorithmic bias produces systematically unfair outcomes — often because historical discrimination is encoded in training data.',
      },
      {
        question: 'What is pseudonymisation?',
        options: [
          'Permanently deleting all personal data',
          'Replacing identifying information with reversible aliases or hashes',
          'Publishing anonymised data publicly',
          'Encrypting data at rest on disk',
        ],
        correctAnswer: 1,
        explanation: 'Pseudonymisation substitutes direct identifiers with a pseudonym (e.g., a hash) — the mapping can be reversed with a key.',
      },
      {
        question: 'What does the "right to be forgotten" (GDPR) give individuals?',
        options: [
          'The right to see all data an organisation holds about them',
          'The right to have their personal data permanently deleted',
          'The right to correct inaccurate personal data',
          'The right to receive their data in a portable format',
        ],
        correctAnswer: 1,
        explanation: 'The right to erasure (Article 17, GDPR) allows individuals to request that an organisation delete all their personal data.',
      },
      {
        question: 'A model denies loans at higher rates for applicants from a specific postcode that correlates with race. This is an example of…',
        options: [
          'A data entry error',
          'Proxy discrimination / algorithmic bias',
          'Overfitting to the training data',
          'A missing data problem',
        ],
        correctAnswer: 1,
        explanation: 'Using a proxy variable (postcode) that correlates with a protected characteristic (race) is a form of indirect discrimination.',
      },
      {
        question: 'What is re-identification risk in anonymised data?',
        options: [
          'The risk of losing the encryption key for a dataset',
          'The possibility of linking anonymised records back to individuals by combining datasets',
          'The chance of accidentally deleting an anonymised dataset',
          'The risk that two records get merged incorrectly during cleaning',
        ],
        correctAnswer: 1,
        explanation: 'Even anonymised data can be re-identified when combined with other public datasets — a famous example is Netflix rating data.',
      },
      {
        question: 'What is informed consent in data collection?',
        options: [
          'Getting a lawyer to approve the data collection process',
          'Obtaining explicit, knowledgeable agreement from individuals before collecting their data',
          'Informing IT staff about what data will be stored',
          'Filing a consent form with a government data authority',
        ],
        correctAnswer: 1,
        explanation: 'Informed consent means people agree freely, knowing what data is collected, why, and how it will be used.',
      },
      {
        question: 'What is differential privacy?',
        options: [
          'A technique that applies different privacy rules to different departments',
          'Adding carefully calibrated statistical noise to data so individuals cannot be identified',
          'Storing sensitive data in a separate, more secure database',
          'Using different encryption keys for different data categories',
        ],
        correctAnswer: 1,
        explanation: 'Differential privacy adds mathematical noise to query results, giving strong guarantees that no individual\'s data can be inferred.',
      },
    ],
  },

  // ── 5 of 6 ────────────────────────────────────────────────────────────────
  {
    title:       'Git & Version Control for Data Analysts',
    slug:        'da-noob-28-git',
    description: 'Learn Git — the industry-standard version control system — and apply it to data analysis projects. Track changes, collaborate without conflicts, host your portfolio on GitHub, and never lose work again.',
    tier:        'NOOB' as const,
    orderIndex:  24,
    xpReward:    75,
    content: `# Git & Version Control for Data Analysts

## Why Data Analysts Need Git

"Which version of this script produced the report we sent to the client last week?"

Without version control, the answer is a sinking feeling and a folder full of \`analysis_final_FINAL_v3_USE_THIS_ONE.py\` files. Git solves this permanently.

**Benefits for analysts:**
- Full history of every change, who made it, and why
- Fearless experimentation — you can always roll back
- Collaboration without overwriting each other's work
- GitHub as a public portfolio for your projects
- Standard skill expected by every data team

---

## 1. Git vs GitHub

| | Git | GitHub |
|-|-----|--------|
| What is it? | Version control software installed on your machine | A cloud hosting platform for Git repositories |
| Who runs it? | You, locally | GitHub (Microsoft) |
| Works offline? | Yes | No |
| Needed for collaboration? | Git does the tracking | GitHub provides the shared server |

Think of Git as the engine and GitHub as the road.

---

## 2. Core Concepts

| Term | Meaning |
|------|---------|
| **Repository (repo)** | A folder tracked by Git — contains your project + full history |
| **Commit** | A snapshot of all tracked files at a point in time |
| **Branch** | An independent line of development — like a parallel copy |
| **Merge** | Combining changes from one branch into another |
| **Remote** | A copy of the repo hosted elsewhere (e.g., GitHub) |
| **Clone** | Downloading a remote repo to your local machine |
| **Pull** | Fetch + merge latest changes from the remote |
| **Push** | Upload your local commits to the remote |
| **Staging area** | Where you prepare files before committing |

---

## 3. Essential Commands

### Setting Up

\`\`\`bash
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"

git init              # create a new repo in the current folder
git clone <url>       # download an existing repo from GitHub
\`\`\`

### Daily Workflow

\`\`\`bash
git status            # see what has changed
git diff              # see exact changes (unstaged)
git add file.py       # stage a specific file
git add .             # stage ALL changed files
git commit -m "Analyse Q1 sales data by region"  # save snapshot

git log               # full history
git log --oneline     # compact history
\`\`\`

### Working with Remotes

\`\`\`bash
git remote add origin https://github.com/user/repo.git
git push -u origin main    # push and set upstream
git pull origin main       # pull latest changes
\`\`\`

### Branches

\`\`\`bash
git branch                    # list branches
git branch feature/new-model  # create branch
git checkout feature/new-model # switch to it
# (or in modern Git: git switch feature/new-model)

git merge feature/new-model   # merge into current branch
git branch -d feature/new-model  # delete merged branch
\`\`\`

---

## 4. .gitignore — Keep Secrets and Junk Out

Create a \`.gitignore\` file in the repo root to exclude files:

\`\`\`
# Secrets and credentials
.env
secrets.json
credentials.yaml

# Large data files (use DVC or cloud storage instead)
data/raw/*.csv
data/raw/*.parquet
*.db
*.sqlite

# Python artefacts
__pycache__/
*.pyc
.venv/
venv/
*.egg-info/

# Jupyter checkpoints
.ipynb_checkpoints/

# OS files
.DS_Store
Thumbs.db
\`\`\`

**CRITICAL:** Never commit API keys, passwords, or database credentials. If you accidentally commit a secret, it is in the history — rotate the credential immediately.

---

## 5. Committing Jupyter Notebooks

Notebooks contain output cells (images, data) that make diffs noisy and conflict-prone:

\`\`\`bash
# Clear all cell outputs before committing
jupyter nbconvert --ClearOutputPreprocessor.enabled=True \
  --to notebook --inplace analysis.ipynb
\`\`\`

Or use **nbstripout** — a Git hook that strips outputs automatically:
\`\`\`bash
pip install nbstripout
nbstripout --install   # installs a pre-commit hook in current repo
\`\`\`

---

## 6. Git Workflow for Data Projects

\`\`\`
main branch       — stable, production-ready analysis
  ↑ merge
feature branches  — experiments, new analyses, cleaning scripts
\`\`\`

**Suggested commit message format:**
\`\`\`
feat: add quarterly revenue breakdown by product category
fix:  correct date parsing bug in ETL script
data: update raw sales data for Q2 2024
docs: add README with project setup instructions
\`\`\`

---

## 7. GitHub as Your Portfolio

Every public GitHub repository is part of your portfolio. Good project repos include:

- **README.md** — what the project does, how to run it, key findings
- **requirements.txt** or **environment.yml** — dependencies
- **Notebooks** — Jupyter notebooks with clear, narrated analysis
- **Data** — sample or synthetic data (never real PII)
- **Outputs** — charts, reports (if not too large)

---

## Summary

| Action | Command |
|--------|---------|
| Initialise repo | \`git init\` |
| Check status | \`git status\` |
| Stage files | \`git add file.py\` |
| Commit | \`git commit -m "message"\` |
| See history | \`git log --oneline\` |
| Create branch | \`git branch name\` |
| Switch branch | \`git checkout name\` |
| Push to GitHub | \`git push origin main\` |
| Pull from GitHub | \`git pull origin main\` |
| Download repo | \`git clone url\` |
`,
    codeExample: `# Git workflow for a typical data analysis project
# Run these in your terminal (not Python)

# ── Project setup ──────────────────────────────────────────────────────────
# git init sales-analysis
# cd sales-analysis

# Create .gitignore
GITIGNORE_CONTENT = """
.env
secrets.json
data/raw/*.csv
data/raw/*.parquet
*.db
__pycache__/
.venv/
.ipynb_checkpoints/
.DS_Store
"""

with open(".gitignore", "w") as f:
    f.write(GITIGNORE_CONTENT.strip())

# Create a minimal README
README = """# Sales Analysis Q1 2024

## Overview
End-to-end analysis of Q1 sales data by region and product category.

## Key Findings
- North region led with 35% of total revenue
- Electronics category grew 22% vs Q4 2023
- Average order value increased from $142 to $167

## Setup
\`\`\`bash
pip install -r requirements.txt
jupyter notebook notebooks/analysis.ipynb
\`\`\`

## Data Sources
- Internal sales DB export (anonymised sample in data/sample/)
"""

with open("README.md", "w") as f:
    f.write(README)

# Create requirements.txt
REQUIREMENTS = """pandas>=2.0
numpy>=1.24
matplotlib>=3.7
seaborn>=0.12
plotly>=5.14
scikit-learn>=1.3
requests>=2.31
jupyter>=1.0
nbstripout>=0.6
"""

with open("requirements.txt", "w") as f:
    f.write(REQUIREMENTS)

print("Project files created!")
print("Next steps (run in terminal):")
print("  git add .gitignore README.md requirements.txt")
print('  git commit -m "feat: initialise sales analysis project"')
print("  git remote add origin https://github.com/you/sales-analysis.git")
print("  git push -u origin main")`,
    quizzes: [
      {
        question: 'What is version control?',
        options: [
          'Software that tracks the version of Python installed on your machine',
          'A system that records changes to files over time, allowing you to recall specific versions',
          'A tool for managing multiple Python environments',
          'A way to compress project files for sharing',
        ],
        correctAnswer: 1,
        explanation: 'Version control systems like Git track every change to your files, creating a full revisable history.',
      },
      {
        question: 'What is the difference between Git and GitHub?',
        options: [
          'Git is cloud-based; GitHub is installed locally',
          'Git is the version control tool; GitHub is a cloud platform for hosting Git repositories',
          'GitHub is open-source; Git is proprietary',
          'Git stores code; GitHub stores only data files',
        ],
        correctAnswer: 1,
        explanation: 'Git is the local tool that tracks changes; GitHub (owned by Microsoft) is a popular remote hosting service.',
      },
      {
        question: 'What does "git commit -m \'message\'" do?',
        options: [
          'Downloads the latest changes from the remote repository',
          'Saves a snapshot of all staged changes to the local repository history',
          'Uploads changes to GitHub',
          'Creates a new branch',
        ],
        correctAnswer: 1,
        explanation: 'git commit saves a permanent snapshot of all staged files, with a descriptive message for future reference.',
      },
      {
        question: 'What is the staging area in Git?',
        options: [
          'The remote repository on GitHub',
          'A temporary holding area where you prepare changes before committing',
          'The main branch of the repository',
          'A backup copy of the repository on your hard drive',
        ],
        correctAnswer: 1,
        explanation: 'The staging area (index) lets you selectively choose which changes to include in the next commit.',
      },
      {
        question: 'What should you always include in a .gitignore file for data projects?',
        options: [
          'Your Python source files and notebooks',
          'Credentials, API keys, large data files, and OS/editor artefacts',
          'Only the README.md file',
          'Nothing — Git should track everything',
        ],
        correctAnswer: 1,
        explanation: 'The .gitignore prevents sensitive data (secrets), large files, and noise (OS files) from entering version control.',
      },
      {
        question: 'What does "git clone <url>" do?',
        options: [
          'Creates a new empty repository locally',
          'Downloads a complete copy of a remote repository to your machine',
          'Creates a branch called "clone" in the current repo',
          'Duplicates the current repo under a new name',
        ],
        correctAnswer: 1,
        explanation: 'git clone downloads the full repository (all files, branches, and history) from the remote URL.',
      },
      {
        question: 'What does "git pull origin main" do?',
        options: [
          'Uploads your local commits to the remote main branch',
          'Downloads and merges the latest changes from the remote main branch',
          'Creates a new branch called "origin/main"',
          'Removes the remote tracking of the main branch',
        ],
        correctAnswer: 1,
        explanation: 'git pull = git fetch + git merge — it downloads and integrates the latest remote commits into your current branch.',
      },
      {
        question: 'Why is it critical to never commit API keys or passwords?',
        options: [
          'Git cannot store text files larger than 1KB',
          'Once committed, secrets are in the history and visible to anyone with repo access, even after deletion',
          'API keys are automatically invalidated when committed',
          'GitHub enforces a policy that rejects commits containing keys',
        ],
        correctAnswer: 1,
        explanation: 'Secrets in git history persist even after "deleting" them. If exposed, rotate the credential immediately.',
      },
      {
        question: 'What is a Git branch?',
        options: [
          'A backup copy of the entire repository',
          'An independent line of development that diverges from the main codebase',
          'A tag applied to a specific commit',
          'A remote copy of the repository',
        ],
        correctAnswer: 1,
        explanation: 'Branches let you work on features or experiments independently without affecting the stable main branch.',
      },
      {
        question: 'Why should you clear Jupyter notebook outputs before committing?',
        options: [
          'Notebooks with outputs take too long to parse',
          'Outputs cause noisy diffs, merge conflicts, and may accidentally include sensitive data',
          'Git cannot store image files embedded in notebooks',
          'Outputs increase commit size beyond the 100MB GitHub limit',
        ],
        correctAnswer: 1,
        explanation: 'Output cells contain rendered plots, dataframe previews, and potentially PII — clearing them keeps diffs clean.',
      },
    ],
  },

  // ── 6 of 6 ────────────────────────────────────────────────────────────────
  {
    title:       'Storytelling with Data — Dashboards, Reports & Presentations',
    slug:        'da-noob-29-storytelling',
    description: 'Transform numbers into narratives: learn the data storytelling framework, choose the right chart for every message, design clean dashboards, write executive summaries, and present to non-technical audiences with confidence.',
    tier:        'NOOB' as const,
    orderIndex:  25,
    xpReward:    80,
    content: `# Storytelling with Data — Dashboards, Reports & Presentations

## Why Storytelling is the Final Unlock

You can run the most sophisticated analysis in the world — if you cannot communicate it clearly, it has no impact. Decision-makers are not data scientists. They need the insight, not the code. Storytelling is what converts data into decisions.

---

## 1. The Data Storytelling Framework

Every strong data story has three components:

1. **Context** — Who is the audience? What decision do they need to make?
2. **Insight** — What did you find? One clear finding per slide/section.
3. **Action** — What should the audience DO based on this finding?

**Template:**
> "We analysed [X]. We found that [insight]. We recommend [action] because [reasoning]."

---

## 2. Know Your Audience

| Audience | What They Want |
|---------|---------------|
| Executive / CEO | Bottom line, financial impact, single recommendation |
| Product Manager | User behaviour, trends, A/B test results |
| Marketing Team | Campaign performance, ROI, audience segments |
| Data Team | Methodology, model accuracy, caveats |
| Operations | Process bottlenecks, efficiency metrics |

**Rule:** Never show your methodology to an executive. Never hide your methodology from a data peer.

---

## 3. Choosing the Right Chart

The chart type must match the message:

| Message | Best Chart |
|---------|-----------|
| Compare categories | **Bar chart** (horizontal for long labels) |
| Show trend over time | **Line chart** |
| Show proportions of a whole | **Stacked bar** or **Pie** (≤5 segments only) |
| Show distribution | **Histogram** or **Box plot** |
| Show relationship between two variables | **Scatter plot** |
| Show geographic variation | **Choropleth map** |
| Show many KPIs at a glance | **KPI cards / scorecards** |
| Compare parts to whole over time | **Stacked area chart** |

**Anti-patterns:**
- Pie charts with more than 5 slices → use bar chart instead
- 3D charts → always misleading, never use
- Dual-axis charts → confuse more than they clarify (use sparingly)
- Too many colours → maximum 5-6 distinct colours per chart

---

## 4. Colour Theory for Data Visualisation

| Palette Type | When to Use | Example |
|-------------|-------------|---------|
| **Sequential** | One variable, ordered values | Light blue → Dark blue for revenue |
| **Diverging** | Values above/below a midpoint | Red → White → Green for profit/loss |
| **Qualitative** | Unordered categories | Distinct colours per region |

**Core principles:**
- Use colour to encode meaning, not decoration
- Ensure sufficient contrast for accessibility (WCAG 2.1 AA minimum)
- Colourblind-friendly palettes: avoid red/green combinations; use blue/orange

---

## 5. Chart Junk and Data-Ink Ratio

**Edward Tufte's principle:** Maximise the *data-ink ratio* — remove all ink that does not represent data.

**Remove:**
- Gratuitous gridlines (keep faint horizontal ones only if they help reading)
- 3D effects, shadows, gradients on chart bars
- Background images behind charts
- Excessive legend text
- Redundant axis labels

**Keep:**
- Clear, descriptive title that states the finding ("North Revenue Grew 23% in Q1" not "Revenue Chart")
- Axis labels with units
- Source attribution

---

## 6. Dashboard Design Principles

A good dashboard answers specific business questions at a glance:

**Layout hierarchy (Z or F reading pattern):**
1. Top-left: Most important KPI or headline metric
2. Top-right: Secondary context metric
3. Middle: Main chart(s)
4. Bottom: Supplementary breakdowns

**Rules:**
- Maximum 5-7 charts per dashboard page
- Use consistent colour encoding across all charts
- Add a filter/date range selector to make it interactive
- Label what is "good" vs "bad" (arrows, colour coding, targets)
- Mobile-first: ensure legibility on smaller screens

---

## 7. Writing Executive Summaries

Structure:
\`\`\`
1. HEADLINE (one sentence — the single most important finding)
2. KEY METRICS (3-5 numbers in a grid — revenue, growth, churn, etc.)
3. WHAT HAPPENED (2-3 bullet points explaining the main findings)
4. WHY IT HAPPENED (root cause or contributing factors)
5. RECOMMENDATION (specific, actionable next step)
6. APPENDIX (charts and full methodology for those who want depth)
\`\`\`

**Example headline:**
"North region revenue declined 12% in March driven by competitor discounting — recommend a targeted promotional campaign to recover share."

---

## 8. Presenting to Non-technical Stakeholders

**Do:**
- Lead with the answer, not the process
- Use plain language ("customers stopped buying" not "conversion funnel degradation")
- Use one insight per slide
- Anticipate and pre-answer "so what?" for every chart
- Rehearse the story end-to-end before the meeting

**Don't:**
- Show raw data tables to non-analysts
- Use p-values or technical statistics without explanation
- Apologise for data limitations — acknowledge them once, move on
- Read the slides aloud — paraphrase, add context

---

## 9. Tools for Reports and Presentations

| Tool | Best For |
|------|---------|
| **Google Slides / PowerPoint** | Executive presentations |
| **Notion / Confluence** | Internal team data reports |
| **Tableau / Power BI** | Interactive live dashboards |
| **Plotly Dash** | Custom Python dashboard apps |
| **Observable / Jupyter Book** | Reproducible data narratives |
| **Google Looker Studio** | Free, shareable Google Sheets dashboards |

---

## Summary

Great data storytelling = right audience + right chart + right narrative + clear action. Analysis without communication is data science in a vacuum. Communication without analysis is guesswork. Your job is to be the bridge.
`,
    codeExample: `import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

np.random.seed(42)

# ── Build a simple executive dashboard ────────────────────────────────────
months = ["Jan","Feb","Mar","Apr","May","Jun"]
regions = ["North","South","East","West"]

records = []
base = {"North":120,"South":95,"East":140,"West":80}
for i, m in enumerate(months):
    for r in regions:
        records.append({
            "month": m, "region": r,
            "revenue": base[r] * (1 + 0.05*i) + np.random.randint(-5,10),
            "orders":  int(base[r]/10 * (1 + 0.03*i)) + np.random.randint(-2,5),
        })

df = pd.DataFrame(records)
df["aov"] = (df["revenue"] / df["orders"]).round(1)

# ── 1. KPI summary line (executive-level numbers) ─────────────────────────
total_rev = df["revenue"].sum()
total_ord = df["orders"].sum()
avg_aov   = df["aov"].mean()
print(f"Total Revenue: \${total_rev:,.0f}k")
print(f"Total Orders:  {total_ord}")
print(f"Average AOV:   \${avg_aov:.1f}k")

# ── 2. Line chart: monthly revenue trend per region ───────────────────────
fig = px.line(
    df, x="month", y="revenue", color="region",
    markers=True,
    title="Monthly Revenue by Region — H1 2024",
    labels={"revenue": "Revenue ($k)", "month": "Month"},
    template="plotly_white",
)
fig.update_layout(
    legend=dict(orientation="h", yanchor="bottom", y=1.02),
    hovermode="x unified",
)
fig.write_html("dashboard_revenue.html")
print("\\nSaved: dashboard_revenue.html")

# ── 3. Bar chart: total revenue by region (sorted) ───────────────────────
totals = df.groupby("region")["revenue"].sum().reset_index().sort_values("revenue")
fig2 = px.bar(totals, y="region", x="revenue", orientation="h",
              color="region", text_auto=".0f",
              title="Total H1 Revenue by Region",
              template="plotly_white")
fig2.update_layout(showlegend=False)
fig2.write_html("dashboard_totals.html")
print("Saved: dashboard_totals.html")`,
    quizzes: [
      {
        question: 'What is the core goal of data storytelling?',
        options: [
          'Displaying as many metrics as possible on one slide',
          'Communicating insights clearly enough to drive a specific decision or action',
          'Proving that the analyst did a thorough job',
          'Showing the full data pipeline from ingestion to output',
        ],
        correctAnswer: 1,
        explanation: 'Data storytelling converts analysis into decisions. The "action" component is what separates a story from a data dump.',
      },
      {
        question: 'Which chart type is best for showing a trend over time?',
        options: ['Pie chart', 'Scatter plot', 'Line chart', 'Box plot'],
        correctAnswer: 2,
        explanation: 'Line charts encode temporal sequence through a continuous line — the standard choice for time-series data.',
      },
      {
        question: 'What is "chart junk" in data visualisation?',
        options: [
          'Charts that use too many data points',
          'Visual elements (gradients, shadows, decorations) that add no information',
          'Charts saved in the wrong file format',
          'Data that falls outside the expected range',
        ],
        correctAnswer: 1,
        explanation: 'Edward Tufte coined "chart junk" for decorative elements that increase ink without increasing understanding.',
      },
      {
        question: 'What is the data-ink ratio?',
        options: [
          'The ratio of data points to chart size in pixels',
          'The proportion of visual ink used to represent actual data vs decorative elements',
          'The number of colours used divided by data dimensions',
          'The compression ratio of chart image files',
        ],
        correctAnswer: 1,
        explanation: 'Tufte\'s data-ink ratio: maximise it by removing all ink that does not encode real data.',
      },
      {
        question: 'When presenting to an executive, what should you lead with?',
        options: [
          'The data collection methodology and cleaning steps',
          'The answer — your key finding and recommendation',
          'A full walkthrough of all exploratory analysis',
          'Technical caveats and model limitations',
        ],
        correctAnswer: 1,
        explanation: 'Executives need the bottom line first. Lead with the insight and recommendation; put methodology in the appendix.',
      },
      {
        question: 'How many segments should a pie chart have at most?',
        options: ['10 — one per category', '5 — more becomes hard to compare', '3 — always', 'No limit if labelled'],
        correctAnswer: 1,
        explanation: 'Beyond 4-5 segments, pie slices are nearly impossible to compare accurately. Use a bar chart instead.',
      },
      {
        question: 'What is a diverging colour palette used for?',
        options: [
          'Showing ordered values from low to high',
          'Highlighting values above and below a meaningful midpoint (e.g., profit vs loss)',
          'Displaying unrelated categories in different colours',
          'Animating transitions between chart states',
        ],
        correctAnswer: 1,
        explanation: 'Diverging palettes use two contrasting hues (e.g., red and green) to emphasise deviation from a centre value.',
      },
      {
        question: 'What makes a dashboard title effective?',
        options: [
          '"Revenue Chart" — short and generic',
          '"North Region Revenue Grew 23% in Q1" — states the finding',
          '"Dashboard v2.1 — updated March 2024" — includes version info',
          '"Data from Sales DB" — shows the data source',
        ],
        correctAnswer: 1,
        explanation: 'The chart title should state the insight, not describe the chart type. Tell viewers what to conclude.',
      },
      {
        question: 'What is the maximum recommended number of charts on one dashboard page?',
        options: ['2-3', '5-7', '10-15', 'No limit — more data is always better'],
        correctAnswer: 1,
        explanation: '5-7 charts is the cognitive limit before a dashboard becomes overwhelming. Prioritise the most important metrics.',
      },
      {
        question: 'Why should you avoid 3D charts in data presentations?',
        options: [
          'They are not supported in most tools',
          '3D perspective distorts heights and angles, making values misleading',
          'They take too long to render',
          '3D colours are hard to print in black and white',
        ],
        correctAnswer: 1,
        explanation: '3D effects distort visual perception — a bar at the back looks shorter than it is. They add decoration, not information.',
      },
    ],
  },

]; // end CHAPTERS

// ---------------------------------------------------------------------------

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: 'data-analytics' } });
  if (!course) {
    console.error('❌  Course "data-analytics" not found — run the main seed first.');
    process.exit(1);
  }

  console.log(`\n📚  Seeding Block 6 — Professional Skills & Real-world Tools (${CHAPTERS.length} chapters)…\n`);

  for (const ch of CHAPTERS) {
    const questions = ch.quizzes.map((qz, i) => ({
      text:          qz.question,
      options:       JSON.stringify(
        qz.options.map((opt: string, idx: number) => ({ id: IDX_TO_ID[idx], text: opt })),
      ),
      correctAnswer: IDX_TO_ID[qz.correctAnswer],
      explanation:   qz.explanation,
      orderIndex:    i + 1,
    }));

    // ── Idempotency check ──────────────────────────────────────────────────
    const existing = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM Chapter WHERE slug = ? LIMIT 1`,
      ch.slug,
    );

    let chapterId: string;

    if (existing.length) {
      chapterId = existing[0].id;

      const existingQuiz = await prisma.$queryRawUnsafe<{ id: string }[]>(
        `SELECT id FROM Quiz WHERE chapterId = ? LIMIT 1`,
        chapterId,
      );

      if (existingQuiz.length) {
        console.log(`⏭   Skipping  "${ch.title}" — already seeded`);
        continue;
      }

      await prisma.quiz.create({
        data: {
          chapterId,
          title:        `${ch.title} — Quiz`,
          description:  `Test your understanding of ${ch.title}`,
          timeLimit:    1800,
          passingScore: 70,
          xpReward:     Math.round(ch.xpReward * 1.5),
          questions:    { create: questions },
        },
      });
      console.log(`🔧  Repaired quiz for "${ch.title}"`);
      continue;
    }

    // ── Create chapter + quiz ──────────────────────────────────────────────
    const { quizzes: _qs, ...chapterData } = ch;
    const chapter = await prisma.chapter.create({
      data: { ...chapterData, courseId: course.id },
    });
    chapterId = chapter.id;

    await prisma.quiz.create({
      data: {
        chapterId,
        title:        `${ch.title} — Quiz`,
        description:  `Test your understanding of ${ch.title}`,
        timeLimit:    1800,
        passingScore: 70,
        xpReward:     Math.round(ch.xpReward * 1.5),
        questions:    { create: questions },
      },
    });

    console.log(`✅  Seeded   "${ch.title}"  (orderIndex ${ch.orderIndex})`);
  }

  console.log('\n🎉  Block 6 complete!\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
