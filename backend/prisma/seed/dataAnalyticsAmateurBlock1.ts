/**
 * AMATEUR Level — Block 1 (Chapters 2–6, orderIndex 101–105)
 * Data Analytics course
 *
 * Chapters:
 *  101 — SQL Joins Deep Dive
 *  102 — SQL Subqueries & CTEs
 *  103 — SQL Window Functions
 *  104 — Advanced Data Cleaning & Outlier Detection
 *  105 — Python OOP for Data Analysts
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─── helpers ─────────────────────────────────────────────────────────────────
function opts(a: string, b: string, c: string, d: string) {
  return JSON.stringify([
    { id: 'a', text: a },
    { id: 'b', text: b },
    { id: 'c', text: c },
    { id: 'd', text: d },
  ]);
}

// ─── Chapter data ─────────────────────────────────────────────────────────────
const CHAPTERS = [
  // ══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — SQL Joins Deep Dive
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug:        'da-am-2-sql-joins',
    title:       'SQL Joins Deep Dive',
    description: 'Master every join type — INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF — with real-world multi-table query patterns and performance intuition.',
    difficulty:  'INTERMEDIATE',
    tier:        'AMATEUR',
    orderIndex:  101,
    xpReward:    110,
    language:    'sql',
    content: `# SQL Joins Deep Dive

## What You'll Learn
By the end of this chapter you will understand every SQL join type, know exactly when to use each one, write confident three-table queries, avoid the classic duplicates trap, and think about join performance.

---

## 1. Why Joins Exist

Relational databases store data in **normalised** separate tables to eliminate redundancy. A \`customers\` table holds customer details; an \`orders\` table holds order records, with only a \`customer_id\` foreign key linking them. Joins are the SQL mechanism that **reassembles** related rows from different tables at query time.

Think of joins like a zipper — they stitch two (or more) tables together along a matching key column.

---

## 2. The Sample Schema

Throughout this chapter we use three tables:

\`\`\`sql
-- customers: 5 rows
id | name        | city
---|-------------|----------
 1 | Alice       | New York
 2 | Bob         | London
 3 | Carol       | Paris
 4 | Dave        | Sydney
 5 | Eve         | Tokyo

-- orders: 6 rows
order_id | customer_id | product   | amount
---------|-------------|-----------|-------
  101    |      1      | Laptop    |  1200
  102    |      1      | Mouse     |    25
  103    |      2      | Keyboard  |    75
  104    |      3      | Monitor   |   400
  105    |      3      | Webcam    |    60
  106    |      7      | Headset   |    90   ← orphan (no customer!)

-- products: 4 rows
id | name      | category    | stock
---|-----------|-------------|------
 1 | Laptop    | Electronics |   14
 2 | Mouse     | Electronics |  230
 3 | Keyboard  | Peripherals |   88
 4 | Monitor   | Electronics |   45
\`\`\`

---

## 3. INNER JOIN — Only Matching Rows

An **INNER JOIN** returns rows where the join condition is TRUE in **both** tables. Rows with no match on either side are silently discarded.

\`\`\`sql
SELECT
    c.name        AS customer,
    o.order_id,
    o.product,
    o.amount
FROM   orders   o
INNER JOIN customers c ON o.customer_id = c.id
ORDER BY o.order_id;
\`\`\`

**Result:** 5 rows — order 106 (customer_id = 7) is dropped because no customer with id=7 exists. Dave and Eve also disappear because they have no orders.

**Use INNER JOIN when:** You only want records that have complete data on both sides.

---

## 4. LEFT JOIN — Keep All Rows from the Left Table

A **LEFT JOIN** returns **every** row from the left table, plus matched columns from the right. Where no match exists, right-side columns are \`NULL\`.

\`\`\`sql
-- Show ALL customers, even those with no orders
SELECT
    c.name                        AS customer,
    COUNT(o.order_id)             AS order_count,
    COALESCE(SUM(o.amount), 0)   AS total_spent
FROM       customers c
LEFT JOIN  orders    o  ON c.id = o.customer_id
GROUP BY   c.name
ORDER BY   total_spent DESC;
\`\`\`

**Result (6 rows):**
| customer | order_count | total_spent |
|----------|-------------|-------------|
| Alice    | 2           | 1225        |
| Carol    | 2           | 460         |
| Bob      | 1           | 75          |
| Dave     | 0           | 0           |
| Eve      | 0           | 0           |

**Key insight:** \`COUNT(o.order_id)\` — not \`COUNT(*)\` — counts only non-NULL order IDs, correctly returning 0 for customers with no orders.

**Use LEFT JOIN when:** You need all records from one table regardless of whether a relationship exists.

---

## 5. RIGHT JOIN — Keep All Rows from the Right Table

A **RIGHT JOIN** is the mirror of LEFT JOIN. It keeps every row in the right table. In practice, most developers convert right joins into left joins by swapping table order — it's easier to read.

\`\`\`sql
-- Equivalent queries:
SELECT * FROM a RIGHT JOIN b ON a.id = b.a_id;
-- is the same as:
SELECT * FROM b LEFT JOIN  a ON a.id = b.a_id;
\`\`\`

---

## 6. FULL OUTER JOIN — Every Row from Both Tables

A **FULL OUTER JOIN** returns every row from both tables, with \`NULL\` wherever no match exists on either side. Not all databases support it (MySQL < 8.0 doesn't — use \`UNION\` of LEFT and RIGHT JOIN instead).

\`\`\`sql
-- Find all customers without orders AND all orphan orders
SELECT
    c.name       AS customer,
    o.order_id   AS order_id
FROM      customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id
WHERE c.id IS NULL OR o.customer_id IS NULL;
\`\`\`

**Result:** Dave, Eve (customers with no orders) + order 106 (orphan order).

---

## 7. SELF JOIN — A Table Joining Itself

A **SELF JOIN** treats one table as if it were two, using aliases. The classic use case is hierarchical data (employees & managers, category trees).

\`\`\`sql
-- employees table: id | name | manager_id
SELECT
    e.name  AS employee,
    m.name  AS manager
FROM   employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY m.name NULLS LAST;
\`\`\`

Another common use: finding pairs of rows with the same attribute.

\`\`\`sql
-- Find customers in the same city
SELECT
    a.name AS customer_a,
    b.name AS customer_b,
    a.city
FROM   customers a
JOIN   customers b ON a.city = b.city AND a.id < b.id;
\`\`\`

The \`a.id < b.id\` condition prevents returning both (Alice, Bob) and (Bob, Alice).

---

## 8. CROSS JOIN — The Cartesian Product

A **CROSS JOIN** returns every combination of rows — M × N rows total. It has no ON condition.

\`\`\`sql
-- Generate all size-colour combinations for a product catalogue
SELECT s.label AS size, c.hex AS colour
FROM sizes s
CROSS JOIN colours c;
\`\`\`

Use with caution: 1,000 × 1,000 tables = 1,000,000 rows. Never accidentally CROSS JOIN large tables.

---

## 9. Three-Table Joins

Chain multiple JOIN clauses — each adds another table to the result set.

\`\`\`sql
SELECT
    c.name          AS customer,
    p.name          AS product,
    p.category,
    o.amount,
    o.order_id
FROM      orders   o
JOIN      customers c ON o.customer_id = c.id
JOIN      products  p ON o.product     = p.name
ORDER BY  o.order_id;
\`\`\`

**Rule of thumb:** Mentally read the query as "start with orders, attach the matching customer, then attach the matching product."

---

## 10. The Duplicates Trap

If the join key is **not unique** in one table, you get row multiplication:

\`\`\`sql
-- Suppose a customer appears twice in a CRM import
-- customers has two rows with id = 1
SELECT o.order_id, c.name
FROM orders o JOIN customers c ON o.customer_id = c.id;
-- Every order for customer 1 now appears TWICE
\`\`\`

**Fix:** Deduplicate before joining, or use \`DISTINCT\`, or fix upstream data quality.

---

## 11. JOIN Performance Intuition

| Technique | Why it matters |
|-----------|----------------|
| Index the join key | Database uses an index seek instead of a full table scan |
| Filter early (WHERE before JOIN) | Reduces rows that need to be matched |
| Smaller table on the right | Many optimisers build a hash of the right table |
| EXPLAIN / EXPLAIN ANALYZE | Shows the query execution plan so you can spot sequential scans |

\`\`\`sql
EXPLAIN ANALYZE
SELECT c.name, o.amount
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.amount > 100;
\`\`\`

---

## 12. Pro Tips & Gotchas

- **Always alias your tables** — \`FROM orders o\` instead of \`FROM orders\`. Long names hurt readability in multi-join queries.
- **NULL in join keys** — \`NULL = NULL\` is FALSE in SQL. Rows with NULL foreign keys are never matched in INNER or standard LEFT/RIGHT JOINs.
- **ON vs WHERE for LEFT JOIN** — \`WHERE right.col IS NOT NULL\` turns a LEFT JOIN into an INNER JOIN! Filter on right-side columns using the ON clause instead if you want to keep all left rows.
- **USING clause** — When column names match: \`JOIN orders USING (customer_id)\` is shorthand for \`ON orders.customer_id = customers.customer_id\`.

---

## Summary

| Join Type     | Returns                                              |
|---------------|------------------------------------------------------|
| INNER JOIN    | Rows with a match in BOTH tables                     |
| LEFT JOIN     | All left rows + matched right rows (NULLs if no match) |
| RIGHT JOIN    | All right rows + matched left rows (NULLs if no match) |
| FULL OUTER    | All rows from both, NULLs where no match             |
| CROSS JOIN    | Every combination (M × N rows)                       |
| SELF JOIN     | A table joined to itself using aliases               |
`,
    codeExample: `-- Real-world sales analysis: all customers + their spend
SELECT
    c.name                         AS customer,
    c.city,
    COUNT(o.order_id)              AS orders,
    COALESCE(SUM(o.amount), 0)    AS total_spent,
    COALESCE(MAX(o.amount), 0)    AS largest_order
FROM       customers  c
LEFT JOIN  orders     o  ON c.id = o.customer_id
GROUP BY   c.name, c.city
ORDER BY   total_spent DESC;

-- Self-join: find customers in the same city
SELECT a.name AS customer_a, b.name AS customer_b, a.city
FROM   customers a
JOIN   customers b ON a.city = b.city AND a.id < b.id;`,

    quiz: {
      title: 'SQL Joins Deep Dive — Quiz',
      questions: [
        {
          text: 'An INNER JOIN between tables A (100 rows) and B (200 rows) returns 80 rows. What does this tell you?',
          options: opts(
            '80 rows in A have a matching row in B',
            'All 100 rows in A matched all 200 rows in B',
            'B has 80 rows more than A',
            '80 rows exist only in A'
          ),
          correctAnswer: 'a',
          explanation: 'INNER JOIN returns only rows with a match in BOTH tables. 80 rows in A had at least one matching row in B.',
          orderIndex: 1,
        },
        {
          text: 'You want to list ALL customers, including those who have never placed an order. Which join should you use?',
          options: opts(
            'INNER JOIN orders ON customer_id',
            'LEFT JOIN orders ON customer_id (customers on the left)',
            'RIGHT JOIN orders ON customer_id (customers on the left)',
            'CROSS JOIN orders'
          ),
          correctAnswer: 'b',
          explanation: 'LEFT JOIN keeps every row from the left table (customers) and fills NULLs for missing order data.',
          orderIndex: 2,
        },
        {
          text: 'What does a CROSS JOIN return?',
          options: opts(
            'Only rows that match on a key column',
            'Every possible combination of rows from both tables',
            'All rows from the left table only',
            'Rows where the join condition is NULL'
          ),
          correctAnswer: 'b',
          explanation: 'A CROSS JOIN (Cartesian product) produces M × N rows — every row from table A paired with every row from table B.',
          orderIndex: 3,
        },
        {
          text: 'In a LEFT JOIN, when no matching row exists in the right table, what appears in the right-side columns?',
          options: opts('0', 'An empty string', 'NULL', 'The value is omitted entirely'),
          correctAnswer: 'c',
          explanation: 'SQL fills non-matched right-side columns with NULL in a LEFT JOIN.',
          orderIndex: 4,
        },
        {
          text: 'What is a SELF JOIN?',
          options: opts(
            'A join between two different databases',
            'A table joined to itself using two different aliases',
            'A join that always returns duplicate rows',
            'A join with no ON condition'
          ),
          correctAnswer: 'b',
          explanation: 'A SELF JOIN uses the same table twice with different aliases — commonly used for hierarchical data like employee-manager relationships.',
          orderIndex: 5,
        },
        {
          text: 'Adding a WHERE clause like `WHERE b.id IS NOT NULL` after a LEFT JOIN effectively converts it to which join type?',
          options: opts('RIGHT JOIN', 'FULL OUTER JOIN', 'INNER JOIN', 'CROSS JOIN'),
          correctAnswer: 'c',
          explanation: 'Filtering out NULL right-side values removes unmatched left rows, making the LEFT JOIN behave like an INNER JOIN.',
          orderIndex: 6,
        },
        {
          text: 'You join orders (10 k rows) to customers (500 rows). The customer_id column in orders has no index. What is the likely performance issue?',
          options: opts(
            'The query will error because index is missing',
            'The database will perform a full table scan on customers for each order row',
            'The result set will have duplicates',
            'The query will return no rows'
          ),
          correctAnswer: 'b',
          explanation: 'Without an index on the join key, the DB must scan the entire right table for each row in the left table (nested loop scan), causing O(M×N) reads.',
          orderIndex: 7,
        },
        {
          text: 'Tables X (3 rows) and Y (4 rows) are CROSS JOINed. How many rows does the result have?',
          options: opts('7', '12', '4', '1'),
          correctAnswer: 'b',
          explanation: 'CROSS JOIN produces M × N = 3 × 4 = 12 rows — every row in X paired with every row in Y.',
          orderIndex: 8,
        },
        {
          text: 'Which SQL clause is shorthand when both tables share the same column name for the join key?',
          options: opts('ON', 'USING', 'WHERE', 'MATCH'),
          correctAnswer: 'b',
          explanation: '`JOIN table2 USING (col_name)` is equivalent to `JOIN table2 ON t1.col_name = t2.col_name` when column names match.',
          orderIndex: 9,
        },
        {
          text: 'What is the correct way to count orders per customer, returning 0 for customers with no orders?',
          options: opts(
            'COUNT(*) with INNER JOIN',
            'COUNT(o.order_id) with LEFT JOIN, GROUP BY customer',
            'COUNT(*) with LEFT JOIN, GROUP BY customer',
            'SUM(o.order_id) with LEFT JOIN'
          ),
          correctAnswer: 'b',
          explanation: 'COUNT(o.order_id) ignores NULLs — so customers with no orders get 0. COUNT(*) would return 1 for unmatched customers because it counts the NULL row itself.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — SQL Subqueries & CTEs
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug:        'da-am-3-sql-subqueries-ctes',
    title:       'SQL Subqueries & Common Table Expressions',
    description: 'Unlock the full power of SQL with scalar subqueries, correlated subqueries, IN / EXISTS patterns, and CTEs — including recursive CTEs for hierarchical data.',
    difficulty:  'INTERMEDIATE',
    tier:        'AMATEUR',
    orderIndex:  102,
    xpReward:    115,
    language:    'sql',
    content: `# SQL Subqueries & Common Table Expressions

## What You'll Learn
Subqueries and CTEs let you break complex problems into readable, testable steps. You'll learn scalar subqueries, correlated subqueries, the IN vs EXISTS debate, non-correlated vs correlated patterns, WITH clauses (CTEs), and recursive CTEs for tree data.

---

## 1. What Is a Subquery?

A **subquery** (also called an inner query or nested query) is a SELECT statement embedded inside another SQL statement. It runs first; its result is used by the outer query.

\`\`\`sql
-- Scalar subquery in WHERE: find orders above the average amount
SELECT order_id, product, amount
FROM   orders
WHERE  amount > (SELECT AVG(amount) FROM orders);
\`\`\`

The inner \`(SELECT AVG(amount) FROM orders)\` executes once, returns a single number, and that number is substituted into the WHERE clause.

---

## 2. Subquery Positions

| Position | Returns | Example |
|----------|---------|---------|
| WHERE clause | Scalar or list | \`WHERE id = (SELECT ...)\` |
| FROM clause (derived table) | A virtual table | \`FROM (SELECT ...) AS sub\` |
| SELECT clause | Scalar | \`SELECT name, (SELECT COUNT(*) ...) AS cnt\` |
| HAVING clause | Scalar | \`HAVING SUM(x) > (SELECT AVG(x) ...)\` |

---

## 3. Scalar Subqueries

A **scalar subquery** returns exactly one row and one column — a single value. If it returns more than one row, SQL throws an error.

\`\`\`sql
-- Show each order with the company-wide average for comparison
SELECT
    order_id,
    amount,
    (SELECT AVG(amount) FROM orders) AS avg_order,
    amount - (SELECT AVG(amount) FROM orders) AS diff_from_avg
FROM orders;
\`\`\`

\`\`\`sql
-- Find the most expensive product category
SELECT category
FROM   products
WHERE  avg_price = (
    SELECT MAX(avg_price)
    FROM (
        SELECT category, AVG(price) AS avg_price
        FROM products
        GROUP BY category
    ) AS category_stats
);
\`\`\`

---

## 4. Subqueries with IN — List Membership

\`IN (subquery)\` checks whether a value appears in a returned list.

\`\`\`sql
-- Customers who have placed at least one order over $500
SELECT name
FROM   customers
WHERE  id IN (
    SELECT DISTINCT customer_id
    FROM   orders
    WHERE  amount > 500
);
\`\`\`

**Performance note:** For large datasets, IN with a subquery can be slower than a JOIN or EXISTS — the database may build a temporary list each time.

---

## 5. Correlated Subqueries — Row-by-Row Logic

A **correlated subquery** references columns from the outer query. It re-executes for each row the outer query processes — powerful but potentially slow.

\`\`\`sql
-- For each order, check if it is the largest order that customer has placed
SELECT
    o.order_id,
    o.customer_id,
    o.amount,
    CASE
        WHEN o.amount = (
            SELECT MAX(o2.amount)
            FROM   orders o2
            WHERE  o2.customer_id = o.customer_id   -- references outer row
        ) THEN 'Largest order'
        ELSE 'Not largest'
    END AS status
FROM orders o;
\`\`\`

\`\`\`sql
-- Customers whose total spend is above the average customer spend
SELECT name
FROM   customers c
WHERE (
    SELECT SUM(amount)
    FROM   orders o
    WHERE  o.customer_id = c.id
) > (
    SELECT AVG(total)
    FROM (
        SELECT customer_id, SUM(amount) AS total
        FROM   orders
        GROUP BY customer_id
    ) t
);
\`\`\`

---

## 6. EXISTS vs IN — The Critical Difference

**EXISTS** checks for row existence — it short-circuits as soon as it finds the first match, making it efficient for large subquery results.

\`\`\`sql
-- Customers who have placed at least one order (EXISTS version)
SELECT name
FROM   customers c
WHERE  EXISTS (
    SELECT 1
    FROM   orders o
    WHERE  o.customer_id = c.id
);

-- Customers with NO orders (NOT EXISTS)
SELECT name
FROM   customers c
WHERE  NOT EXISTS (
    SELECT 1
    FROM   orders o
    WHERE  o.customer_id = c.id
);
\`\`\`

**Rule:** Prefer EXISTS over IN when the subquery result set is large, or when you only need to test existence (not retrieve the values).

---

## 7. Derived Tables — Subqueries in FROM

A **derived table** is a subquery in the FROM clause. It acts like a temporary named table.

\`\`\`sql
-- Rank customers by spend, then filter to top 3
SELECT customer_name, total_spent, rank
FROM (
    SELECT
        c.name                  AS customer_name,
        SUM(o.amount)          AS total_spent,
        RANK() OVER (ORDER BY SUM(o.amount) DESC) AS rank
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    GROUP BY c.name
) AS ranked_customers
WHERE rank <= 3;
\`\`\`

Derived tables must always have an alias. They cannot be referenced multiple times in the query without repeating them — this is where CTEs shine.

---

## 8. Common Table Expressions (CTEs) — WITH Clause

A **CTE** (Common Table Expression) names a subquery so you can reference it by name — like giving a derived table a name that persists for the query.

\`\`\`sql
WITH customer_totals AS (
    SELECT
        c.id,
        c.name,
        SUM(o.amount)  AS total_spent
    FROM       customers c
    LEFT JOIN  orders    o  ON c.id = o.customer_id
    GROUP BY   c.id, c.name
),
avg_spend AS (
    SELECT AVG(total_spent) AS avg_val
    FROM   customer_totals
    WHERE  total_spent IS NOT NULL
)
SELECT
    ct.name,
    ct.total_spent,
    ats.avg_val  AS company_average,
    ct.total_spent - ats.avg_val AS diff
FROM   customer_totals ct
CROSS JOIN avg_spend ats
ORDER BY diff DESC;
\`\`\`

**CTEs vs Derived Tables:**
- CTEs can be referenced **multiple times** in the same query
- CTEs make complex queries **readable** — each CTE is a named step
- Modern databases materialise or inline CTEs depending on the query plan

---

## 9. Multiple CTEs — Chaining Steps

\`\`\`sql
WITH
-- Step 1: daily revenue
daily AS (
    SELECT
        DATE(created_at)  AS day,
        SUM(amount)       AS revenue
    FROM  orders
    GROUP BY DATE(created_at)
),
-- Step 2: 7-day rolling average
rolling AS (
    SELECT
        day,
        revenue,
        AVG(revenue) OVER (
            ORDER BY day
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS rolling_7d_avg
    FROM daily
),
-- Step 3: flag days above average
flagged AS (
    SELECT *,
        CASE WHEN revenue > rolling_7d_avg THEN 'Above avg' ELSE 'Below avg' END AS status
    FROM rolling
)
SELECT * FROM flagged ORDER BY day;
\`\`\`

Each CTE builds on the previous one — this is the SQL equivalent of a step-by-step data pipeline.

---

## 10. Recursive CTEs — Traversing Hierarchies

A **recursive CTE** references itself, enabling traversal of hierarchical structures like org charts, category trees, or bill-of-materials.

\`\`\`sql
-- employees: id | name | manager_id
WITH RECURSIVE org_chart AS (
    -- Anchor: start with the CEO (no manager)
    SELECT id, name, manager_id, 0 AS depth, name AS path
    FROM   employees
    WHERE  manager_id IS NULL

    UNION ALL

    -- Recursive: join employees to their manager row
    SELECT e.id, e.name, e.manager_id, oc.depth + 1,
           oc.path || ' > ' || e.name
    FROM   employees   e
    JOIN   org_chart   oc ON e.manager_id = oc.id
)
SELECT depth, name, path
FROM   org_chart
ORDER BY path;
\`\`\`

**Parts of a recursive CTE:**
1. **Anchor member** — the base case (runs once)
2. **UNION ALL** — separates anchor from recursive
3. **Recursive member** — references the CTE itself, runs until no new rows are produced

---

## 11. Performance Considerations

| Pattern | When to use | Watch out |
|---------|-------------|-----------|
| Scalar subquery in SELECT | When you need a single aggregate per outer row | Executes once per outer row — can be slow on large tables |
| IN (list) | Small, static list | Avoid for large dynamic subquery results |
| EXISTS | Test for row existence | Excellent choice for large tables — short-circuits |
| CTE | Complex, multi-step logic | Materialisation overhead in some databases (check EXPLAIN) |
| Derived table | One-off inline result | Cannot be reused; use CTE if needed multiple times |

---

## Summary

- **Subqueries** embed a query inside another query — in WHERE, FROM, SELECT, or HAVING.
- **Correlated subqueries** reference outer query columns and run once per outer row.
- **EXISTS** is more efficient than IN when checking membership in large sets.
- **CTEs (WITH)** name subqueries, improve readability, and allow reuse in the same query.
- **Recursive CTEs** traverse hierarchical data using anchor + recursive member + UNION ALL.
`,
    codeExample: `-- Multi-step CTE: top 3 customers by spend vs company average
WITH totals AS (
    SELECT c.id, c.name,
           COALESCE(SUM(o.amount), 0) AS total_spent
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    GROUP BY c.id, c.name
),
stats AS (
    SELECT AVG(total_spent) AS avg_spend FROM totals
)
SELECT
    t.name,
    t.total_spent,
    s.avg_spend,
    ROUND(t.total_spent - s.avg_spend, 2) AS vs_average
FROM totals t, stats s
ORDER BY t.total_spent DESC
LIMIT 3;`,

    quiz: {
      title: 'SQL Subqueries & CTEs — Quiz',
      questions: [
        {
          text: 'A scalar subquery in a WHERE clause returns 3 rows instead of 1. What happens?',
          options: opts(
            'SQL uses the first row automatically',
            'SQL throws a "subquery returns more than 1 row" error',
            'SQL uses the average of the 3 values',
            'SQL ignores the extra rows'
          ),
          correctAnswer: 'b',
          explanation: 'A scalar subquery must return exactly one row and one column. Returning multiple rows causes a runtime error.',
          orderIndex: 1,
        },
        {
          text: 'What distinguishes a correlated subquery from a non-correlated one?',
          options: opts(
            'It runs only once before the outer query',
            'It references a column from the outer query and re-executes per outer row',
            'It can only be used with EXISTS',
            'It always returns a single value'
          ),
          correctAnswer: 'b',
          explanation: 'A correlated subquery references one or more columns from the outer query — so the database re-runs it for each row of the outer query.',
          orderIndex: 2,
        },
        {
          text: 'When is EXISTS generally preferred over IN?',
          options: opts(
            'When the subquery returns a small, fixed list',
            'When you only need to check whether at least one matching row exists in a large table',
            'When you need the actual values returned by the subquery',
            'EXISTS and IN always have identical performance'
          ),
          correctAnswer: 'b',
          explanation: 'EXISTS short-circuits — it stops scanning as soon as it finds the first match. IN must build the full result set first, which is expensive for large tables.',
          orderIndex: 3,
        },
        {
          text: 'Which keyword introduces a Common Table Expression (CTE)?',
          options: opts('DEFINE', 'WITH', 'TEMP', 'AS'),
          correctAnswer: 'b',
          explanation: 'CTEs begin with the WITH keyword: `WITH cte_name AS (SELECT ...)` followed by the main query.',
          orderIndex: 4,
        },
        {
          text: 'What is the main advantage of a CTE over a derived table (subquery in FROM)?',
          options: opts(
            'CTEs execute faster than derived tables in all databases',
            'A CTE can be referenced multiple times in the same query; a derived table cannot',
            'Derived tables support recursive logic; CTEs do not',
            'CTEs are automatically indexed'
          ),
          correctAnswer: 'b',
          explanation: 'You can reference a CTE by name multiple times in the query. A derived table must be repeated in full each time — CTEs avoid this duplication.',
          orderIndex: 5,
        },
        {
          text: 'In a recursive CTE, what separates the anchor member from the recursive member?',
          options: opts('JOIN', 'UNION ALL', 'INTERSECT', 'EXCEPT'),
          correctAnswer: 'b',
          explanation: 'Recursive CTEs use UNION ALL to combine the anchor (base case) with the recursive member (self-reference). The recursion terminates when the recursive member returns no rows.',
          orderIndex: 6,
        },
        {
          text: 'Which subquery location acts as a "virtual table" that can be filtered in the outer query?',
          options: opts(
            'Subquery in WHERE (scalar)',
            'Subquery in FROM (derived table)',
            'Subquery in HAVING',
            'Subquery in SELECT'
          ),
          correctAnswer: 'b',
          explanation: 'A subquery in the FROM clause creates a derived table — a named virtual result set that the outer query can SELECT from and apply further filtering.',
          orderIndex: 7,
        },
        {
          text: 'You write: `SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE amount > 1000)`. What does this return?',
          options: opts(
            'All customers and their orders over $1,000',
            'Names of customers who have placed at least one order over $1,000',
            'Only the first matching customer',
            'An error because IN cannot accept subqueries'
          ),
          correctAnswer: 'b',
          explanation: 'IN (subquery) tests whether the outer value exists in the subquery result set — this returns the names of any customers who have any order > $1,000.',
          orderIndex: 8,
        },
        {
          text: 'What does NOT EXISTS do?',
          options: opts(
            'Returns rows where the subquery returns at least one row',
            'Returns rows where the subquery returns zero rows',
            'Inverts the column values in the result',
            'Checks for NULL values in the outer query'
          ),
          correctAnswer: 'b',
          explanation: 'NOT EXISTS is TRUE when the correlated subquery returns no rows — making it perfect for finding records with no related records (e.g., customers with no orders).',
          orderIndex: 9,
        },
        {
          text: 'Can you define two CTEs in a single WITH clause?',
          options: opts(
            'No — each CTE needs its own WITH keyword',
            'Yes — separate them with commas: WITH cte1 AS (...), cte2 AS (...)',
            'Yes — but only in PostgreSQL, not standard SQL',
            'No — you must use nested subqueries instead'
          ),
          correctAnswer: 'b',
          explanation: 'Multiple CTEs in one WITH clause are separated by commas. Later CTEs can reference earlier ones, enabling clean multi-step data transformations.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4 — SQL Window Functions
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug:        'da-am-4-sql-window-functions',
    title:       'SQL Window Functions',
    description: 'Master analytical SQL: OVER(), PARTITION BY, ORDER BY inside windows, ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD, and running totals.',
    difficulty:  'INTERMEDIATE',
    tier:        'AMATEUR',
    orderIndex:  103,
    xpReward:    120,
    language:    'sql',
    content: `# SQL Window Functions

## What You'll Learn
Window functions are the most powerful SQL feature most analysts underuse. You'll learn how OVER() works, how to partition and order within a window, ranking functions, value functions (LAG/LEAD), aggregate windows, running totals, and the ROWS/RANGE frame.

---

## 1. What Makes Window Functions Special?

Regular aggregate functions (\`SUM\`, \`AVG\`, \`COUNT\`) collapse multiple rows into one. Window functions **compute a value for each row while still retaining the full row**.

\`\`\`sql
-- Regular aggregate: loses individual rows
SELECT region, SUM(sales) FROM orders GROUP BY region;

-- Window function: keeps every row, adds aggregate as a new column
SELECT
    order_id,
    region,
    sales,
    SUM(sales) OVER (PARTITION BY region) AS region_total
FROM orders;
\`\`\`

The result still has one row per order — but each row knows its region's total.

---

## 2. The OVER() Clause Anatomy

\`\`\`sql
function_name() OVER (
    [PARTITION BY column(s)]
    [ORDER BY column(s) [ASC|DESC]]
    [ROWS|RANGE BETWEEN ... AND ...]
)
\`\`\`

| Component | Purpose |
|-----------|---------|
| \`PARTITION BY\` | Splits the result set into independent windows (like GROUP BY, but without collapsing rows) |
| \`ORDER BY\` | Determines the order within each window (required for ranking and running calculations) |
| Frame clause | Defines which rows within the window to include in the calculation |

---

## 3. Ranking Functions

### ROW_NUMBER — Unique sequential number
\`\`\`sql
SELECT
    name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
FROM employees;
\`\`\`
Each department gets its own numbering starting at 1. No ties — every row gets a unique number.

### RANK — Gaps after ties
\`\`\`sql
SELECT
    name,
    score,
    RANK() OVER (ORDER BY score DESC) AS rank
FROM students;
-- Two students with score 95: both get rank 1. Next student gets rank 3 (gap).
\`\`\`

### DENSE_RANK — No gaps after ties
\`\`\`sql
SELECT
    name,
    score,
    DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank
FROM students;
-- Two students with 95: both get rank 1. Next student gets rank 2 (no gap).
\`\`\`

### NTILE — Divide into N equal buckets
\`\`\`sql
-- Split customers into 4 quartiles by total spend
SELECT
    customer_id,
    total_spend,
    NTILE(4) OVER (ORDER BY total_spend DESC) AS quartile
FROM customer_stats;
-- Quartile 1 = top 25%, quartile 4 = bottom 25%
\`\`\`

---

## 4. Practical: Top-N Per Group

The classic "find the top 3 products per category" problem is solved elegantly with ROW_NUMBER:

\`\`\`sql
WITH ranked AS (
    SELECT
        product_name,
        category,
        revenue,
        ROW_NUMBER() OVER (
            PARTITION BY category
            ORDER BY revenue DESC
        ) AS rn
    FROM product_sales
)
SELECT product_name, category, revenue
FROM   ranked
WHERE  rn <= 3;
\`\`\`

This is the canonical solution. You cannot use ROW_NUMBER directly in WHERE — it must be in a CTE or derived table first.

---

## 5. Value Functions — LAG and LEAD

**LAG** looks back N rows; **LEAD** looks forward N rows.

\`\`\`sql
-- Month-over-month revenue comparison
SELECT
    month,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY month)             AS prev_month_revenue,
    revenue - LAG(revenue, 1) OVER (ORDER BY month)   AS mom_change,
    ROUND(
        100.0 * (revenue - LAG(revenue, 1) OVER (ORDER BY month))
        / NULLIF(LAG(revenue, 1) OVER (ORDER BY month), 0),
        2
    )                                                  AS pct_change
FROM monthly_revenue;
\`\`\`

\`\`\`sql
-- Days until next order per customer
SELECT
    customer_id,
    order_date,
    LEAD(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS next_order_date,
    LEAD(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) - order_date AS days_to_next_order
FROM orders;
\`\`\`

**Signature:** \`LAG(column, offset, default)\` — default is returned when there is no previous row.

---

## 6. FIRST_VALUE and LAST_VALUE

\`\`\`sql
-- For each order, show the first and most recent order date for that customer
SELECT
    customer_id,
    order_date,
    amount,
    FIRST_VALUE(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS first_order_date,
    LAST_VALUE(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS latest_order_date
FROM orders;
\`\`\`

⚠️ **LAST_VALUE gotcha:** Without \`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\`, the default frame ends at the current row — LAST_VALUE returns the current row's value, not the true last row. Always specify the frame for LAST_VALUE.

---

## 7. Aggregate Window Functions — Running Totals & Moving Averages

When you add OVER() to an aggregate, it becomes a window aggregate:

\`\`\`sql
-- Cumulative (running) revenue total
SELECT
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date)  AS running_total
FROM orders;
\`\`\`

\`\`\`sql
-- 7-day rolling average revenue
SELECT
    sale_date,
    daily_revenue,
    AVG(daily_revenue) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7d_avg
FROM daily_sales;
\`\`\`

\`\`\`sql
-- Cumulative % of total
SELECT
    product,
    revenue,
    SUM(revenue) OVER ()                            AS grand_total,
    ROUND(
        100.0 * SUM(revenue) OVER (ORDER BY revenue DESC)
        / SUM(revenue) OVER (),
        2
    )                                                AS running_pct
FROM product_revenue
ORDER BY revenue DESC;
\`\`\`

---

## 8. The Frame Clause — ROWS vs RANGE

The frame defines which rows contribute to each calculation:

\`\`\`sql
-- ROWS: physical rows
ROWS BETWEEN 2 PRECEDING AND CURRENT ROW     -- 3-row window
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW  -- cumulative

-- RANGE: value-based (ties share the same window boundary)
RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW
\`\`\`

**ROWS vs RANGE:** Use ROWS for precise row-count windows (rolling averages). Use RANGE for date-range windows.

---

## 9. PERCENT_RANK and CUME_DIST

\`\`\`sql
SELECT
    name,
    score,
    ROUND(PERCENT_RANK() OVER (ORDER BY score) * 100, 1)   AS percentile,
    ROUND(CUME_DIST()    OVER (ORDER BY score) * 100, 1)   AS cumulative_pct
FROM students;
\`\`\`

- **PERCENT_RANK:** (rank - 1) / (total rows - 1). Ranges 0–1.
- **CUME_DIST:** Fraction of rows with value ≤ current row. Always > 0.

---

## 10. Window Function vs GROUP BY — Know the Difference

| | GROUP BY | Window Function |
|-|----------|-----------------|
| Number of output rows | One per group | Same as input |
| Individual row values | Not accessible | Fully accessible |
| Can combine in same query | No window in GROUP BY | Yes — use CTE |

\`\`\`sql
-- You CANNOT mix window functions and GROUP BY in the same SELECT level
-- Use a CTE to combine them:
WITH agg AS (
    SELECT department, AVG(salary) AS dept_avg
    FROM employees
    GROUP BY department
)
SELECT
    e.name,
    e.salary,
    a.dept_avg,
    e.salary - a.dept_avg AS diff_from_dept_avg,
    ROW_NUMBER() OVER (PARTITION BY e.department ORDER BY e.salary DESC) AS rank_in_dept
FROM employees e
JOIN agg a ON e.department = a.department;
\`\`\`

---

## Summary

| Function | Description |
|----------|-------------|
| \`ROW_NUMBER()\` | Unique sequential number — no ties |
| \`RANK()\` | Ranking with gaps after ties |
| \`DENSE_RANK()\` | Ranking without gaps |
| \`NTILE(n)\` | Divide rows into n buckets |
| \`LAG(col, n)\` | Value from n rows before current |
| \`LEAD(col, n)\` | Value from n rows after current |
| \`FIRST_VALUE()\` | First value in the window |
| \`LAST_VALUE()\` | Last value in the window (specify full frame!) |
| \`SUM/AVG OVER()\` | Running total or moving average |
| \`PERCENT_RANK()\` | Row's relative rank as 0–1 fraction |
`,
    codeExample: `-- Sales leaderboard: rank reps per region, show MoM change, flag top 25%
WITH monthly AS (
    SELECT
        rep_name,
        region,
        DATE_TRUNC('month', sale_date) AS month,
        SUM(amount)                    AS monthly_revenue
    FROM sales
    GROUP BY rep_name, region, DATE_TRUNC('month', sale_date)
)
SELECT
    rep_name,
    region,
    month,
    monthly_revenue,
    RANK()    OVER (PARTITION BY region, month ORDER BY monthly_revenue DESC)   AS rank_in_region,
    NTILE(4)  OVER (PARTITION BY month        ORDER BY monthly_revenue DESC)    AS quartile,
    LAG(monthly_revenue) OVER (PARTITION BY rep_name ORDER BY month)           AS prev_month,
    ROUND(
        100.0 * (monthly_revenue - LAG(monthly_revenue) OVER (PARTITION BY rep_name ORDER BY month))
        / NULLIF(LAG(monthly_revenue) OVER (PARTITION BY rep_name ORDER BY month), 0),
        1
    ) AS mom_pct_change
FROM monthly
ORDER BY month, region, rank_in_region;`,

    quiz: {
      title: 'SQL Window Functions — Quiz',
      questions: [
        {
          text: 'What does PARTITION BY do in a window function?',
          options: opts(
            'Collapses rows into groups like GROUP BY',
            'Splits the result set into independent windows without collapsing rows',
            'Sorts the rows within the result set',
            'Limits the number of rows returned'
          ),
          correctAnswer: 'b',
          explanation: 'PARTITION BY divides the rows into groups (windows) for the function to operate on — but unlike GROUP BY, all original rows are preserved in the output.',
          orderIndex: 1,
        },
        {
          text: 'Two students both score 90 points. Using RANK(), what ranks do they receive, and what is the next student\'s rank?',
          options: opts(
            'Both get rank 1; next student gets rank 2',
            'Both get rank 1; next student gets rank 3',
            'One gets rank 1, other gets rank 2; next gets rank 3',
            'Both get rank 2; first student gets rank 1'
          ),
          correctAnswer: 'b',
          explanation: 'RANK() assigns equal rank to ties and then skips ranks to compensate — two students at rank 1 means the next rank is 3 (not 2).',
          orderIndex: 2,
        },
        {
          text: 'What is the key difference between RANK() and DENSE_RANK()?',
          options: opts(
            'DENSE_RANK never produces ties; RANK does',
            'RANK skips ranks after ties; DENSE_RANK does not skip',
            'DENSE_RANK is only available in PostgreSQL',
            'RANK uses PARTITION BY; DENSE_RANK uses ORDER BY'
          ),
          correctAnswer: 'b',
          explanation: 'Both handle ties the same way (equal score = equal rank), but RANK leaves gaps (1, 1, 3) while DENSE_RANK does not (1, 1, 2).',
          orderIndex: 3,
        },
        {
          text: 'Which window function would you use to calculate a 7-day rolling average?',
          options: opts(
            'NTILE(7)',
            'LAG(revenue, 7)',
            'AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)',
            'FIRST_VALUE(revenue) OVER (ORDER BY date)'
          ),
          correctAnswer: 'c',
          explanation: 'AVG with a ROWS BETWEEN 6 PRECEDING AND CURRENT ROW frame includes the current row plus the 6 previous rows — a 7-row rolling window.',
          orderIndex: 4,
        },
        {
          text: 'What does LAG(salary, 1, 0) return when there is no previous row?',
          options: opts('NULL', '0', '1', 'An error'),
          correctAnswer: 'b',
          explanation: 'The third argument to LAG/LEAD is a default value returned when there is no row at the specified offset. Here, 0 is returned instead of NULL.',
          orderIndex: 5,
        },
        {
          text: 'Why must window functions typically be wrapped in a CTE or derived table before filtering with WHERE?',
          options: opts(
            'Because window functions are computed before GROUP BY but after WHERE',
            'Because window functions are computed after WHERE, so you cannot filter on their results in the same SELECT',
            'Because window functions only work inside CTEs',
            'Because WHERE does not support OVER() syntax'
          ),
          correctAnswer: 'b',
          explanation: 'SQL evaluates WHERE before the SELECT list (where window functions live). To filter on a window function result, wrap the query in a CTE or subquery and filter in the outer query.',
          orderIndex: 6,
        },
        {
          text: 'NTILE(4) divides rows into how many buckets?',
          options: opts('2', '4', '10', 'It depends on the number of rows'),
          correctAnswer: 'b',
          explanation: 'NTILE(n) divides the ordered result set into n equal buckets (as equal as possible). NTILE(4) creates quartiles.',
          orderIndex: 7,
        },
        {
          text: 'What is the default frame when you use ORDER BY in an aggregate window function without an explicit frame clause?',
          options: opts(
            'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING (all rows)',
            'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW (cumulative)',
            'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING',
            'There is no default — you must always specify a frame'
          ),
          correctAnswer: 'b',
          explanation: 'When ORDER BY is present without a frame, the default is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — meaning a running/cumulative calculation up to the current row.',
          orderIndex: 8,
        },
        {
          text: 'You run: SUM(revenue) OVER () — with no PARTITION BY or ORDER BY. What does this return for each row?',
          options: opts(
            'NULL for each row',
            'The revenue of the current row only',
            'The grand total of all revenue — same value for every row',
            'An error because OVER() cannot be empty'
          ),
          correctAnswer: 'c',
          explanation: 'An empty OVER() treats the entire result set as one window. SUM(revenue) OVER () returns the total sum for every row — useful for computing percentage of total.',
          orderIndex: 9,
        },
        {
          text: 'Which statement is TRUE about LAST_VALUE()?',
          options: opts(
            'It always returns the last row of the entire table',
            'It requires an explicit ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING frame to return the true last row in the partition',
            'It is equivalent to MAX()',
            'It cannot be used with PARTITION BY'
          ),
          correctAnswer: 'b',
          explanation: 'The default frame for LAST_VALUE ends at the current row (RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), so without specifying the full frame, LAST_VALUE returns the current row\'s own value.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5 — Advanced Data Cleaning & Outlier Detection
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug:        'da-am-5-advanced-data-cleaning',
    title:       'Advanced Data Cleaning & Outlier Detection',
    description: 'Go beyond dropna() — master outlier detection (IQR, Z-score, Isolation Forest), advanced imputation strategies, data quality auditing, and building reusable cleaning pipelines.',
    difficulty:  'INTERMEDIATE',
    tier:        'AMATEUR',
    orderIndex:  104,
    xpReward:    115,
    language:    'python',
    content: `# Advanced Data Cleaning & Outlier Detection

## What You'll Learn
Real-world data is never clean. This chapter covers systematic data quality auditing, multiple outlier detection methods, advanced imputation beyond simple fill, and how to build reusable, testable cleaning pipelines.

---

## 1. The Data Quality Audit — First, Understand Your Data

Before cleaning anything, audit the data. Build a quality report:

\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv('sales_data.csv')

def quality_audit(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a per-column data quality report."""
    report = pd.DataFrame({
        'dtype':          df.dtypes,
        'missing_count':  df.isna().sum(),
        'missing_pct':    (df.isna().mean() * 100).round(2),
        'unique_count':   df.nunique(),
        'duplicate_rows': [df.duplicated().sum()] * len(df.columns),
    })

    # Numeric stats
    numeric_cols = df.select_dtypes(include='number').columns
    report.loc[numeric_cols, 'min']    = df[numeric_cols].min()
    report.loc[numeric_cols, 'max']    = df[numeric_cols].max()
    report.loc[numeric_cols, 'mean']   = df[numeric_cols].mean().round(2)
    report.loc[numeric_cols, 'std']    = df[numeric_cols].std().round(2)
    report.loc[numeric_cols, 'zeros']  = (df[numeric_cols] == 0).sum()

    return report.sort_values('missing_pct', ascending=False)

print(quality_audit(df).to_string())
\`\`\`

Columns with >40% missing may need to be dropped entirely. Columns with <5% missing can be imputed. Understanding this upfront prevents wasted effort.

---

## 2. Dealing With Duplicates

\`\`\`python
# Detect duplicates
print(f"Duplicate rows: {df.duplicated().sum()}")
print(f"Duplicate order IDs: {df.duplicated(subset=['order_id']).sum()}")

# Inspect them
df[df.duplicated(subset=['order_id'], keep=False)].sort_values('order_id')

# Drop — keep first occurrence
df_clean = df.drop_duplicates(subset=['order_id'], keep='first').reset_index(drop=True)

# Fuzzy duplicates (same customer, different email casing)
df['email_clean'] = df['email'].str.strip().str.lower()
df_deduped = df.drop_duplicates(subset=['email_clean'])
\`\`\`

---

## 3. Outlier Detection — Three Methods

### Method 1: IQR (Interquartile Range) — Robust to non-normal distributions

\`\`\`python
def detect_outliers_iqr(series: pd.Series, k: float = 1.5) -> pd.Series:
    """Return boolean mask: True = outlier."""
    Q1  = series.quantile(0.25)
    Q3  = series.quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - k * IQR
    upper = Q3 + k * IQR
    return (series < lower) | (series > upper)

# Apply to all numeric columns
numeric_cols = df.select_dtypes(include='number').columns
for col in numeric_cols:
    mask = detect_outliers_iqr(df[col])
    n = mask.sum()
    if n > 0:
        print(f"{col}: {n} outliers ({n/len(df)*100:.1f}%)")
\`\`\`

**k=1.5** is the standard fence. **k=3.0** gives extreme outliers only. The IQR method works on any distribution — it does not assume normality.

### Method 2: Z-Score — For normally distributed data

\`\`\`python
from scipy import stats

def detect_outliers_zscore(series: pd.Series, threshold: float = 3.0) -> pd.Series:
    """|z-score| > threshold → outlier."""
    z = np.abs(stats.zscore(series.dropna()))
    return pd.Series(z > threshold, index=series.dropna().index).reindex(series.index, fill_value=False)

# Modified Z-score (more robust than standard Z)
def modified_zscore(series: pd.Series, threshold: float = 3.5) -> pd.Series:
    median    = series.median()
    mad       = (series - median).abs().median()   # Median Absolute Deviation
    m_zscore  = 0.6745 * (series - median) / (mad + 1e-9)
    return m_zscore.abs() > threshold
\`\`\`

Use **Modified Z-score** (MAD-based) when your data has extreme outliers that inflate the standard deviation — it's resistant to the outliers themselves.

### Method 3: Isolation Forest — Machine Learning Approach

\`\`\`python
from sklearn.ensemble import IsolationForest

def detect_outliers_isolation_forest(
    df: pd.DataFrame,
    columns: list,
    contamination: float = 0.05
) -> pd.Series:
    """
    contamination: expected fraction of outliers (0.05 = 5%).
    Returns boolean Series: True = outlier.
    """
    X = df[columns].dropna()
    clf = IsolationForest(
        contamination=contamination,
        random_state=42,
        n_estimators=100
    )
    preds = clf.fit_predict(X)   # -1 = outlier, 1 = normal
    result = pd.Series(preds == -1, index=X.index)
    return result.reindex(df.index, fill_value=False)

# Example: detect multivariate outliers in sales data
outlier_mask = detect_outliers_isolation_forest(
    df,
    columns=['price', 'quantity', 'discount'],
    contamination=0.03
)
print(f"Multivariate outliers: {outlier_mask.sum()}")
df_without_outliers = df[~outlier_mask]
\`\`\`

**When to use Isolation Forest:** When outliers occur in combinations of columns (e.g., normal price but impossible quantity/discount combination). It detects multivariate anomalies that univariate methods miss.

---

## 4. Outlier Treatment — Don't Always Delete!

| Strategy | When to use |
|----------|------------|
| Remove | Genuine data entry errors with high confidence |
| Cap / Winsorise | Outliers are real but should be bounded (e.g., price caps) |
| Transform | Log-transform to compress the scale |
| Separate model | If outliers form a meaningful sub-population |

\`\`\`python
# Winsorisation — cap values at percentile boundaries
def winsorise(series: pd.Series, lower_pct: float = 0.01, upper_pct: float = 0.99) -> pd.Series:
    lo = series.quantile(lower_pct)
    hi = series.quantile(upper_pct)
    return series.clip(lo, hi)

df['revenue_winsorised'] = winsorise(df['revenue'])

# Log transform (for right-skewed positive data)
df['log_revenue'] = np.log1p(df['revenue'])   # log1p handles zeros: log(1+x)
\`\`\`

---

## 5. Advanced Imputation

### Strategy 1: Group-Based Imputation

\`\`\`python
# Fill missing price using the median price for that product category
df['price'] = df.groupby('category')['price'].transform(
    lambda x: x.fillna(x.median())
)
\`\`\`

### Strategy 2: Forward Fill & Backward Fill (Time Series)

\`\`\`python
df = df.sort_values('date')
# Forward fill: use last known value
df['temperature'] = df['temperature'].ffill()
# Then backfill any remaining NaNs at the start
df['temperature'] = df['temperature'].bfill()
\`\`\`

### Strategy 3: KNN Imputation

\`\`\`python
from sklearn.impute import KNNImputer

imputer = KNNImputer(n_neighbors=5, weights='distance')
numeric_cols = df.select_dtypes(include='number').columns.tolist()

df_imputed = df.copy()
df_imputed[numeric_cols] = imputer.fit_transform(df[numeric_cols])
\`\`\`

KNN imputation fills missing values using the average of the K nearest neighbours — far more accurate than mean/median imputation when features are correlated.

### Strategy 4: Iterative Imputer (MICE)

\`\`\`python
from sklearn.experimental import enable_iterative_imputer   # noqa
from sklearn.impute        import IterativeImputer

# MICE: Multiple Imputation by Chained Equations
mice = IterativeImputer(max_iter=10, random_state=42)
df_imputed[numeric_cols] = mice.fit_transform(df[numeric_cols])
\`\`\`

MICE iteratively models each feature with missing values as a function of all other features — the most statistically robust approach.

---

## 6. Type Casting & Consistency Checks

\`\`\`python
# Convert messy strings to numbers
df['revenue'] = pd.to_numeric(df['revenue'].str.replace(',', '').str.strip(), errors='coerce')

# Parse dates robustly
df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d', errors='coerce')

# Standardise categorical values
df['status'] = df['status'].str.strip().str.upper()
df['status'] = df['status'].replace({
    'COMPLET': 'COMPLETED',
    'PENDING ': 'PENDING',
    'CANCLED': 'CANCELLED',
})

# Validate ranges
invalid_prices = df[df['price'] < 0]
print(f"Negative prices: {len(invalid_prices)}")
df.loc[df['price'] < 0, 'price'] = np.nan   # treat as missing
\`\`\`

---

## 7. Building a Reusable Cleaning Pipeline

\`\`\`python
class DataCleaner:
    """Reusable, testable data cleaning pipeline."""

    def __init__(self, outlier_method: str = 'iqr', impute_strategy: str = 'median'):
        self.outlier_method   = outlier_method
        self.impute_strategy  = impute_strategy
        self._stats: dict     = {}

    def fit(self, df: pd.DataFrame) -> 'DataCleaner':
        """Learn cleaning parameters from training data."""
        numeric = df.select_dtypes(include='number')
        self._stats['medians']  = numeric.median()
        self._stats['q1']       = numeric.quantile(0.25)
        self._stats['q3']       = numeric.quantile(0.75)
        self._stats['iqr']      = self._stats['q3'] - self._stats['q1']
        self._stats['lower']    = self._stats['q1'] - 1.5 * self._stats['iqr']
        self._stats['upper']    = self._stats['q3'] + 1.5 * self._stats['iqr']
        return self

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply learned cleaning parameters."""
        df = df.copy()
        df = df.drop_duplicates()

        numeric_cols = df.select_dtypes(include='number').columns
        for col in numeric_cols:
            if col in self._stats['lower'].index:
                # Cap outliers using training-set bounds
                df[col] = df[col].clip(
                    self._stats['lower'][col],
                    self._stats['upper'][col]
                )
            # Impute with training-set median
            df[col] = df[col].fillna(self._stats['medians'].get(col, 0))

        return df

    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        return self.fit(df).transform(df)


# Usage
cleaner = DataCleaner()
df_train_clean = cleaner.fit_transform(df_train)
df_test_clean  = cleaner.transform(df_test)   # use training stats!
\`\`\`

**Critical rule:** Fit the cleaner on training data only. Apply training-set statistics to the test set — this prevents data leakage.

---

## Summary

1. **Audit first** — understand missingness, distribution, and uniqueness before touching anything.
2. **Outlier detection** — IQR for any distribution, Z-score for normal data, Isolation Forest for multivariate anomalies.
3. **Don't just delete outliers** — cap, transform, or flag them based on business context.
4. **Advanced imputation** — group-based fills, KNN, and MICE are far better than mean/median for complex datasets.
5. **Build a pipeline** — \`fit\` on train, \`transform\` on test. Never leak test statistics into training.
`,
    codeExample: `import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.impute import KNNImputer

df = pd.read_csv('transactions.csv')

# 1. Quality audit
print(df.isna().sum())
print(df.duplicated().sum(), 'duplicates')

# 2. Remove duplicates
df = df.drop_duplicates(subset=['transaction_id'])

# 3. Outlier detection (IQR)
Q1, Q3 = df['amount'].quantile(0.25), df['amount'].quantile(0.75)
IQR = Q3 - Q1
df['is_outlier'] = (df['amount'] < Q1 - 1.5*IQR) | (df['amount'] > Q3 + 1.5*IQR)

# 4. Winsorise rather than delete
df['amount'] = df['amount'].clip(Q1 - 1.5*IQR, Q3 + 1.5*IQR)

# 5. KNN imputation for remaining NaNs
cols = ['amount', 'quantity', 'discount']
df[cols] = KNNImputer(n_neighbors=5).fit_transform(df[cols])

print(df.isna().sum())  # Should be 0`,

    quiz: {
      title: 'Advanced Data Cleaning & Outlier Detection — Quiz',
      questions: [
        {
          text: 'What does the IQR (Interquartile Range) equal?',
          options: opts(
            'Mean minus standard deviation',
            'Q3 minus Q1 (75th percentile minus 25th percentile)',
            'The range from min to max',
            'Q2 minus Q1 (median minus lower quartile)'
          ),
          correctAnswer: 'b',
          explanation: 'IQR = Q3 − Q1. It measures the spread of the middle 50% of data and is used to define outlier fences: Q1 − 1.5×IQR (lower) and Q3 + 1.5×IQR (upper).',
          orderIndex: 1,
        },
        {
          text: 'Why is Modified Z-score (MAD-based) preferred over standard Z-score for outlier detection?',
          options: opts(
            'It runs faster on large datasets',
            'The standard deviation used in Z-score is itself inflated by outliers; MAD is resistant to them',
            'Modified Z-score does not require any parameters',
            'Standard Z-score does not work with numeric data'
          ),
          correctAnswer: 'b',
          explanation: 'Extreme outliers inflate the standard deviation, making Z-scores underestimate how extreme the outliers really are. The Median Absolute Deviation (MAD) is robust because the median is unaffected by extremes.',
          orderIndex: 2,
        },
        {
          text: 'When should you use Isolation Forest for outlier detection instead of IQR?',
          options: opts(
            'When the dataset has fewer than 100 rows',
            'When outliers only appear in one column at a time',
            'When outliers occur in combinations of multiple features (multivariate anomalies)',
            'When you need a deterministic result with no randomness'
          ),
          correctAnswer: 'c',
          explanation: 'Isolation Forest detects multivariate anomalies — rows that are unusual across several features simultaneously. IQR and Z-score operate on one column at a time and miss these complex patterns.',
          orderIndex: 3,
        },
        {
          text: 'What is winsorisation?',
          options: opts(
            'Removing all rows with outlier values',
            'Replacing outlier values with NULL',
            'Capping outlier values at a specified percentile boundary',
            'Converting outlier values to their log-transformed equivalents'
          ),
          correctAnswer: 'c',
          explanation: 'Winsorisation clamps extreme values to a percentile threshold (e.g., 1st and 99th). The outlier stays in the dataset but is limited to the boundary value.',
          orderIndex: 4,
        },
        {
          text: 'Why must you fit() a data cleaner on training data ONLY, and not on the test set?',
          options: opts(
            'The test set is too large to fit on',
            'Fitting on test data causes data leakage — your model learns test-set statistics it would not have in production',
            'Pandas fit() method only works on training DataFrames',
            'Test data should always be cleaned separately with different parameters'
          ),
          correctAnswer: 'b',
          explanation: 'Data leakage occurs when information from the test/validation set influences preprocessing. Using test statistics to impute or cap values gives an unrealistically optimistic model evaluation.',
          orderIndex: 5,
        },
        {
          text: 'Which imputation strategy is best when missing salary data correlates with department?',
          options: opts(
            'Mean imputation across the entire dataset',
            'Group-based median imputation: fill with the median salary per department',
            'Drop all rows with missing salary',
            'Fill with 0'
          ),
          correctAnswer: 'b',
          explanation: 'Group-based imputation exploits within-group relationships. A senior engineer\'s missing salary should be filled with the engineering median, not the company-wide median.',
          orderIndex: 6,
        },
        {
          text: 'What does KNN imputation do?',
          options: opts(
            'Fills missing values with the column mean',
            'Fills missing values using the average of the K nearest neighbours in feature space',
            'Removes all rows with any missing value',
            'Fills missing values using a linear regression model'
          ),
          correctAnswer: 'b',
          explanation: 'KNN imputation finds the K rows most similar to the row with missing data (by distance in feature space) and fills the missing value with the average of those neighbours\' values.',
          orderIndex: 7,
        },
        {
          text: 'What does np.log1p(x) compute, and why is it preferred over np.log(x) for data transformation?',
          options: opts(
            'log(x−1) — handles negative values',
            'log(1+x) — safely handles zero values without producing −infinity',
            'log(x) rounded to 1 decimal place',
            'The natural logarithm scaled to percentage'
          ),
          correctAnswer: 'b',
          explanation: 'np.log(0) = −∞ (undefined). np.log1p(x) = log(1+x), so log1p(0) = 0 — allowing zero-value data to be log-transformed without errors.',
          orderIndex: 8,
        },
        {
          text: 'What is the "contamination" parameter in Isolation Forest?',
          options: opts(
            'The maximum depth of the isolation trees',
            'The expected proportion of outliers in the dataset',
            'The fraction of features used for each split',
            'The minimum number of samples to classify as an outlier'
          ),
          correctAnswer: 'b',
          explanation: 'contamination tells Isolation Forest what fraction of the dataset to treat as outliers (e.g., 0.05 = 5%). It sets the decision threshold for the anomaly score.',
          orderIndex: 9,
        },
        {
          text: 'When checking for duplicates in a transactions table, why might you use `df.duplicated(subset=[\'order_id\'])` instead of `df.duplicated()`?',
          options: opts(
            'subset is required — duplicated() cannot run without it',
            'To detect rows where the order_id is duplicated, even if other columns differ (e.g., different timestamps from retries)',
            'To speed up the computation by skipping non-numeric columns',
            'The default duplicated() only checks the first column'
          ),
          correctAnswer: 'b',
          explanation: 'Specifying a subset checks for duplicates on specific columns. Two rows might have the same order_id but slightly different timestamps or amounts — indicating a duplicate transaction that df.duplicated() alone might miss.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Python OOP for Data Analysts
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug:        'da-am-6-python-oop',
    title:       'Python OOP for Data Analysts',
    description: 'Move beyond scripts — build reusable, maintainable data tools with Python classes, encapsulation, inheritance, dataclasses, and the analytics patterns that use them.',
    difficulty:  'INTERMEDIATE',
    tier:        'AMATEUR',
    orderIndex:  105,
    xpReward:    110,
    language:    'python',
    content: `# Python OOP for Data Analysts

## What You'll Learn
Most analytics code starts as a script, then grows into an unmaintainable mess. Object-Oriented Programming (OOP) gives you tools to organise code into reusable units. You'll learn classes, instance vs class attributes, methods, properties, inheritance, dunder methods, and \`@dataclass\` — then apply them to real analytics patterns.

---

## 1. Why OOP in Data Analytics?

As your projects grow, you notice:
- The same data cleaning logic is copied across 5 notebooks
- Config values are hardcoded everywhere
- A pipeline needs to be tested on training data, then applied to production data

OOP solves this with **classes** — reusable blueprints for objects that bundle data (attributes) and behaviour (methods) together.

---

## 2. Classes, Instances, and \`__init__\`

\`\`\`python
class DataLoader:
    """Loads and validates a CSV dataset."""

    # Class attribute: shared by ALL instances
    supported_formats = ['csv', 'tsv', 'txt']

    def __init__(self, filepath: str, delimiter: str = ','):
        # Instance attributes: unique to EACH instance
        self.filepath  = filepath
        self.delimiter = delimiter
        self._df       = None          # private by convention (leading underscore)

    def load(self) -> 'DataLoader':
        """Load the file into a DataFrame. Returns self for chaining."""
        import pandas as pd
        self._df = pd.read_csv(self.filepath, sep=self.delimiter)
        print(f"Loaded {len(self._df):,} rows from {self.filepath}")
        return self   # enables method chaining: loader.load().validate()

    def validate(self) -> 'DataLoader':
        if self._df is None:
            raise RuntimeError("Call load() before validate()")
        assert len(self._df) > 0, "Dataset is empty"
        return self

    @property
    def shape(self):
        """Property: accessed like an attribute, not a method call."""
        return self._df.shape if self._df is not None else None

    @property
    def df(self):
        """Read-only public access to the private DataFrame."""
        return self._df


# Usage
loader = DataLoader('sales.csv')
loader.load().validate()
print(loader.shape)      # (5000, 12)
print(loader.df.head())
\`\`\`

---

## 3. Instance vs Class vs Static Methods

\`\`\`python
class MetricsCalculator:

    # Regular method — has access to self (instance)
    def calculate_growth(self, current: float, previous: float) -> float:
        if previous == 0:
            return float('inf')
        return (current - previous) / previous * 100

    # Class method — receives the class (cls), not the instance
    @classmethod
    def from_dataframe(cls, df, value_col: str, period_col: str):
        """Alternative constructor: build from a DataFrame."""
        instance = cls()
        instance._df = df
        instance._value_col  = value_col
        instance._period_col = period_col
        return instance

    # Static method — no access to self or cls; just a utility function
    @staticmethod
    def format_pct(value: float, decimals: int = 2) -> str:
        return f"{value:+.{decimals}f}%"


calc = MetricsCalculator()
growth = calc.calculate_growth(120, 100)
print(MetricsCalculator.format_pct(growth))   # "+20.00%"
\`\`\`

---

## 4. Properties — Controlled Attribute Access

Properties let you expose computed values as attributes and add validation on setting:

\`\`\`python
class SalesReport:

    def __init__(self, data: list):
        self._data       = data
        self._threshold  = 1000.0   # backing attribute

    @property
    def threshold(self) -> float:
        return self._threshold

    @threshold.setter
    def threshold(self, value: float):
        if value < 0:
            raise ValueError(f"Threshold must be non-negative, got {value}")
        self._threshold = float(value)

    @property
    def above_threshold(self) -> list:
        return [x for x in self._data if x > self._threshold]

    @property
    def total_above(self) -> float:
        return sum(self.above_threshold)


report = SalesReport([500, 1200, 800, 2500, 300])
report.threshold = 1000
print(report.above_threshold)   # [1200, 2500]
print(report.total_above)       # 3700
\`\`\`

---

## 5. Inheritance — Building on Existing Classes

\`\`\`python
class BaseAnalyser:
    """Common interface for all analysers."""

    def __init__(self, name: str):
        self.name = name

    def fit(self, df):
        raise NotImplementedError("Subclasses must implement fit()")

    def summarise(self) -> dict:
        raise NotImplementedError("Subclasses must implement summarise()")

    def __repr__(self):
        return f"{self.__class__.__name__}(name='{self.name}')"


class RevenueAnalyser(BaseAnalyser):

    def __init__(self, name: str, currency: str = 'USD'):
        super().__init__(name)           # call parent __init__
        self.currency = currency
        self._stats: dict = {}

    def fit(self, df):
        self._stats = {
            'total':  df['revenue'].sum(),
            'mean':   df['revenue'].mean(),
            'median': df['revenue'].median(),
            'top_10': df.nlargest(10, 'revenue')[['product', 'revenue']],
        }
        return self

    def summarise(self) -> dict:
        if not self._stats:
            raise RuntimeError("Call fit() first")
        return {k: v for k, v in self._stats.items() if k != 'top_10'}


class ChurnAnalyser(BaseAnalyser):

    def fit(self, df):
        churned = df[df['status'] == 'churned']
        self._churn_rate = len(churned) / len(df)
        return self

    def summarise(self) -> dict:
        return {'churn_rate': self._churn_rate}


# Polymorphism: same interface, different behaviour
analysers = [
    RevenueAnalyser('Q4 Revenue'),
    ChurnAnalyser('Churn Q4'),
]
for analyser in analysers:
    analyser.fit(df)
    print(analyser, '→', analyser.summarise())
\`\`\`

---

## 6. Dunder Methods — Making Classes Pythonic

\`\`\`python
class Dataset:
    """A dataset with Pythonic behaviour."""

    def __init__(self, data: list[dict]):
        self._rows = data

    def __len__(self):
        return len(self._rows)                # len(dataset)

    def __getitem__(self, idx):
        return self._rows[idx]                # dataset[0], dataset[1:5]

    def __iter__(self):
        return iter(self._rows)               # for row in dataset

    def __contains__(self, item):
        return item in self._rows             # row in dataset

    def __repr__(self):
        return f"Dataset({len(self)} rows)"   # repr(dataset)

    def __add__(self, other: 'Dataset') -> 'Dataset':
        return Dataset(self._rows + other._rows)  # ds1 + ds2


ds = Dataset([{'id': 1, 'value': 100}, {'id': 2, 'value': 200}])
print(len(ds))            # 2
print(ds[0])              # {'id': 1, 'value': 100}
for row in ds: print(row)
\`\`\`

---

## 7. Dataclasses — Clean Data Containers

Python \`@dataclass\` auto-generates \`__init__\`, \`__repr__\`, and \`__eq__\` from field declarations:

\`\`\`python
from dataclasses import dataclass, field
from datetime import date

@dataclass
class Transaction:
    transaction_id: str
    amount: float
    date: date
    category: str
    tags: list[str] = field(default_factory=list)   # mutable default

    @property
    def is_large(self) -> bool:
        return self.amount > 10_000

    def __post_init__(self):
        """Validation after __init__."""
        if self.amount < 0:
            raise ValueError(f"Amount cannot be negative: {self.amount}")
        self.category = self.category.upper()


t = Transaction('TXN-001', 15000.0, date.today(), 'electronics')
print(t)           # Transaction(transaction_id='TXN-001', ...)
print(t.is_large)  # True
\`\`\`

---

## 8. Real Analytics Pattern — A Configurable Report Builder

\`\`\`python
from dataclasses import dataclass
import pandas as pd

@dataclass
class ReportConfig:
    title: str
    group_by: str
    value_col: str
    top_n: int = 10
    sort_ascending: bool = False

class ReportBuilder:

    def __init__(self, df: pd.DataFrame, config: ReportConfig):
        self._df     = df
        self._config = config
        self._result = None

    def build(self) -> 'ReportBuilder':
        cfg = self._config
        self._result = (
            self._df
            .groupby(cfg.group_by)[cfg.value_col]
            .agg(['sum', 'mean', 'count'])
            .rename(columns={'sum': 'total', 'mean': 'avg', 'count': 'n'})
            .sort_values('total', ascending=cfg.sort_ascending)
            .head(cfg.top_n)
            .reset_index()
        )
        return self

    def display(self) -> 'ReportBuilder':
        print(f"\\n{'='*50}")
        print(f" {self._config.title}")
        print(f"{'='*50}")
        print(self._result.to_string(index=False))
        return self

    def to_csv(self, path: str) -> None:
        self._result.to_csv(path, index=False)
        print(f"Saved to {path}")


config = ReportConfig(
    title='Top 10 Categories by Revenue',
    group_by='category',
    value_col='revenue',
    top_n=10
)
ReportBuilder(df, config).build().display().to_csv('report.csv')
\`\`\`

---

## 9. When to Use OOP vs Functions

| Use OOP when | Use functions when |
|---|---|
| You need state that persists across multiple method calls | The logic is stateless (input → output) |
| Multiple related methods share the same data | One-off transformation |
| You want fit/transform pattern (like sklearn) | Simple utility (format a number, parse a date) |
| You'll have multiple variants (inheritance) | No variants needed |

---

## Summary

- **Classes** bundle data (attributes) and behaviour (methods) into reusable units.
- **Properties** control access and add computed attributes without breaking the interface.
- **Inheritance** lets subclasses extend or override parent behaviour — enabling polymorphism.
- **Dunder methods** make your classes feel native to Python (len, iter, +, repr).
- **@dataclass** eliminates boilerplate for data containers.
- The **fit/transform** pattern from sklearn is pure OOP — understanding it helps you extend it.
`,
    codeExample: `from dataclasses import dataclass
import pandas as pd

@dataclass
class PipelineConfig:
    value_col: str
    group_col: str
    outlier_k: float = 1.5

class AnalyticsPipeline:
    def __init__(self, config: PipelineConfig):
        self.config = config
        self._bounds: dict = {}

    def fit(self, df: pd.DataFrame) -> 'AnalyticsPipeline':
        col = self.config.value_col
        q1, q3 = df[col].quantile(0.25), df[col].quantile(0.75)
        iqr = q3 - q1
        self._bounds = {
            'lower': q1 - self.config.outlier_k * iqr,
            'upper': q3 + self.config.outlier_k * iqr,
            'median': df[col].median(),
        }
        return self

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        col = self.config.value_col
        df[col] = df[col].clip(self._bounds['lower'], self._bounds['upper'])
        df[col] = df[col].fillna(self._bounds['median'])
        return df

    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        return self.fit(df).transform(df)

pipeline = AnalyticsPipeline(PipelineConfig('revenue', 'region'))
df_clean = pipeline.fit_transform(df_train)
df_test_clean = pipeline.transform(df_test)`,

    quiz: {
      title: 'Python OOP for Data Analysts — Quiz',
      questions: [
        {
          text: 'What is the purpose of the `__init__` method in a Python class?',
          options: opts(
            'It is called when the class is imported',
            'It initialises a new instance\'s attributes when the object is created',
            'It defines class-level attributes shared by all instances',
            'It is called automatically when the object is deleted'
          ),
          correctAnswer: 'b',
          explanation: '__init__ is the constructor — it runs automatically when you call ClassName(...) and sets up the initial state of the new object.',
          orderIndex: 1,
        },
        {
          text: 'What is the difference between a class attribute and an instance attribute?',
          options: opts(
            'Class attributes are defined inside __init__; instance attributes are outside',
            'Class attributes are shared by all instances; instance attributes are unique to each instance',
            'Instance attributes cannot be changed; class attributes can',
            'There is no difference — both refer to the same memory'
          ),
          correctAnswer: 'b',
          explanation: 'Class attributes (defined at class level, outside __init__) are shared. Instance attributes (defined with self.x = ... inside __init__) are unique to each object.',
          orderIndex: 2,
        },
        {
          text: 'What does a @property decorator do?',
          options: opts(
            'Converts a method into a class-level attribute',
            'Allows a method to be accessed like an attribute, computing its value on each access',
            'Caches the return value so the method only runs once',
            'Makes the attribute read-write protected from subclasses'
          ),
          correctAnswer: 'b',
          explanation: '@property lets you define a method that is called when you access obj.attribute_name (without parentheses), enabling computed attributes and validation via setters.',
          orderIndex: 3,
        },
        {
          text: 'What does `super().__init__()` do in a subclass?',
          options: opts(
            'Deletes the parent class and replaces it with the subclass',
            'Calls the parent class\'s __init__ method to initialise inherited attributes',
            'Creates a copy of the parent instance',
            'It is optional — Python handles parent initialisation automatically'
          ),
          correctAnswer: 'b',
          explanation: 'super() returns a proxy of the parent class. super().__init__() explicitly calls the parent\'s constructor, ensuring inherited attributes are properly set up.',
          orderIndex: 4,
        },
        {
          text: 'What is a @classmethod, and how does it differ from a regular method?',
          options: opts(
            'It receives the instance (self) like a regular method but also the class',
            'It receives the class (cls) instead of the instance (self) — used for alternative constructors',
            'It can only be called on instances, not on the class itself',
            'It is a private method only accessible within the class'
          ),
          correctAnswer: 'b',
          explanation: '@classmethod receives cls (the class itself) as the first argument instead of self. It is commonly used for alternative constructors like from_dataframe() or from_config().',
          orderIndex: 5,
        },
        {
          text: 'Which dunder method allows `len(my_object)` to work on a custom class?',
          options: opts('__size__', '__length__', '__len__', '__count__'),
          correctAnswer: 'c',
          explanation: 'Python calls __len__(self) when you use len() on an object. Define it to return an integer representing the object\'s "size".',
          orderIndex: 6,
        },
        {
          text: 'What is the main benefit of @dataclass over a regular class for data containers?',
          options: opts(
            'Dataclasses are faster at runtime',
            'Dataclasses auto-generate __init__, __repr__, and __eq__ from type-annotated field declarations',
            'Dataclasses support inheritance but regular classes do not',
            'Dataclasses automatically validate all attribute types'
          ),
          correctAnswer: 'b',
          explanation: '@dataclass eliminates boilerplate by generating __init__, __repr__, and __eq__ automatically based on the class-level field annotations — no manual writing needed.',
          orderIndex: 7,
        },
        {
          text: 'In the fit/transform pattern (used by sklearn), why must transform() use statistics computed during fit()?',
          options: opts(
            'Because transform() cannot access the original data',
            'To prevent data leakage — test data must be transformed using training-set statistics, not its own',
            'Because fit() deletes the original data to save memory',
            'Transform() is faster when it reuses precomputed values'
          ),
          correctAnswer: 'b',
          explanation: 'Fitting on test data leaks information — your model would "know" test-set statistics during evaluation. The fit/transform separation ensures only training statistics are used.',
          orderIndex: 8,
        },
        {
          text: 'What does `return self` at the end of a method enable?',
          options: opts(
            'Nothing special — it is redundant',
            'Method chaining: you can write obj.method1().method2().method3()',
            'The method becomes a property automatically',
            'It signals that the method modifies the object in place'
          ),
          correctAnswer: 'b',
          explanation: 'Returning self from a method allows chaining multiple calls in one expression: pipeline.load().clean().validate(). This is the "fluent interface" pattern.',
          orderIndex: 9,
        },
        {
          text: 'What is the convention for marking an attribute as "private" in Python?',
          options: opts(
            'Declaring it with the private keyword',
            'Prefixing with a single underscore (e.g., self._data)',
            'Prefixing with PRIVATE_ in capital letters',
            'Declaring it outside __init__'
          ),
          correctAnswer: 'b',
          explanation: 'Python has no true private access modifier. A leading underscore (self._x) is a naming convention signalling "internal use — do not access directly from outside the class." Double underscore (self.__x) enables name mangling.',
          orderIndex: 10,
        },
      ],
    },
  },
];

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 1 (Chapters 2-6)…');

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

    // Create quiz + questions
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

  console.log('\n🎉  AMATEUR Block 1 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
