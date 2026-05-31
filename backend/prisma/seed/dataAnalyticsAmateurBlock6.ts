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
  // CHAPTER 26 — BigQuery & Cloud SQL for Analytics
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-26-bigquery-cloud-sql',
    title:      'BigQuery & Cloud SQL for Analytics',
    description:'Master Google BigQuery — columnar storage, partitioned and clustered tables, nested/repeated fields, cost control, INFORMATION_SCHEMA, and the performance patterns that let analysts query billions of rows in seconds.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 126,
    xpReward:   125,
    language:   'sql',
    content: `# BigQuery & Cloud SQL for Analytics

## What You'll Learn
BigQuery is the analytics database used by Google internally and by thousands of enterprises. It can scan terabytes of data in seconds using columnar storage and massively parallel execution. This chapter covers the BigQuery-specific SQL extensions, performance optimisation, and cost management used by professional analysts.

---

## 1. BigQuery Architecture

BigQuery is a **serverless, columnar, MPP (Massively Parallel Processing)** database:

- **Columnar storage**: data stored column-by-column — only scanned columns are read (queries that touch 3 of 50 columns read only 6% of the data)
- **Separation of compute and storage**: no servers to manage; compute scales instantly
- **Dremel execution engine**: splits queries into a tree of sub-tasks executed across thousands of workers in parallel
- **Cost model**: billed on **data scanned**, not query time — selecting fewer columns and using partitions dramatically reduces cost

---

## 2. BigQuery-Specific SQL Patterns

### ARRAY and STRUCT (Nested/Repeated Fields)

BigQuery natively stores nested data without normalisation:

\`\`\`sql
-- Querying an ARRAY field
SELECT
    order_id,
    item.sku,
    item.quantity,
    item.price
FROM orders,
UNNEST(items) AS item  -- UNNEST flattens the array into rows
WHERE order_date = '2024-03-15';

-- Aggregating array elements
SELECT
    order_id,
    ARRAY_LENGTH(items)         AS num_items,
    (SELECT SUM(i.price * i.quantity) FROM UNNEST(items) AS i)
                                AS order_total
FROM orders;
\`\`\`

### JSON Extraction

\`\`\`sql
-- Extract from a JSON string column
SELECT
    user_id,
    JSON_VALUE(properties, '$.device_type')     AS device,
    JSON_VALUE(properties, '$.os_version')      AS os,
    CAST(JSON_VALUE(properties, '$.session_duration') AS INT64)
                                                AS session_secs
FROM events
WHERE JSON_VALUE(properties, '$.device_type') = 'mobile';
\`\`\`

### Date and Timestamp Functions

\`\`\`sql
-- BigQuery date functions (slightly different from PostgreSQL)
SELECT
    DATE_TRUNC(event_date, WEEK)                AS week_start,
    DATE_TRUNC(event_date, MONTH)               AS month_start,
    DATE_DIFF(CURRENT_DATE(), event_date, DAY)  AS days_ago,
    FORMAT_DATE('%Y-W%V', event_date)           AS iso_week_label,
    EXTRACT(DAYOFWEEK FROM event_date)          AS day_number  -- 1=Sunday
FROM events;
\`\`\`

---

## 3. Partitioned Tables

Partitioning splits a table into physical segments by a column — BigQuery prunes irrelevant partitions at query time, scanning only the relevant data.

\`\`\`sql
-- Create a partitioned table
CREATE TABLE analytics.events_partitioned
PARTITION BY DATE(event_timestamp)  -- daily partitions
CLUSTER BY user_id, event_type       -- also cluster for further pruning
OPTIONS (
    partition_expiration_days = 365,
    require_partition_filter  = TRUE  -- force analysts to filter by date
)
AS
SELECT * FROM analytics.events_raw;

-- Query that benefits from partition pruning (only 3 days scanned)
SELECT
    DATE(event_timestamp)                AS event_date,
    COUNT(DISTINCT user_id)              AS dau
FROM analytics.events_partitioned
WHERE DATE(event_timestamp) BETWEEN '2024-03-01' AND '2024-03-03'
  AND event_type = 'session'
GROUP BY 1;
-- Cost: scans only 3 partitions × data in those partitions
\`\`\`

**Clustering** further organises rows within a partition by column values — reduces scanned bytes when filtering on clustered columns.

---

## 4. Cost Control Best Practices

\`\`\`sql
-- 1. ALWAYS check estimated bytes before running
-- (Use "dry run" in BigQuery console or API)

-- 2. Use column selection — never SELECT *
-- BAD:  SELECT * FROM events          ← scans all columns
-- GOOD: SELECT user_id, event_type FROM events  ← scans 2/50 columns

-- 3. Filter before joining (use CTEs or subqueries)
WITH recent_events AS (
    SELECT user_id, event_type, event_date
    FROM events
    WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)  -- prune first
)
SELECT u.name, e.event_type
FROM users u
JOIN recent_events e USING (user_id);  -- join the smaller filtered table

-- 4. Use APPROX functions for exploratory analysis
SELECT
    APPROX_COUNT_DISTINCT(user_id)  AS approx_unique_users,  -- 97% accurate, ~0.5% of cost
    COUNT(DISTINCT user_id)         AS exact_unique_users     -- exact but 200× more expensive
FROM events;

-- 5. Materialise frequently queried results as views or tables
CREATE OR REPLACE TABLE analytics.daily_kpis AS
SELECT DATE(event_timestamp) AS event_date, COUNT(DISTINCT user_id) AS DAU
FROM events
WHERE DATE(event_timestamp) >= '2024-01-01'
GROUP BY 1;
\`\`\`

---

## 5. INFORMATION_SCHEMA for Monitoring Usage

\`\`\`sql
-- Who is running expensive queries?
SELECT
    user_email,
    COUNT(*)                                    AS query_count,
    SUM(total_bytes_processed) / POW(1024, 4)   AS total_tb_processed,
    SUM(total_bytes_billed) / POW(1024, 4) * 6  AS estimated_cost_usd
FROM region-us.INFORMATION_SCHEMA.JOBS
WHERE DATE(creation_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
  AND job_type = 'QUERY'
  AND state = 'DONE'
GROUP BY user_email
ORDER BY total_tb_processed DESC
LIMIT 20;

-- Which tables are scanned most?
SELECT
    referenced_table.table_id   AS table_name,
    COUNT(*)                    AS query_count,
    SUM(total_bytes_processed) / POW(1024, 3) AS gb_scanned
FROM region-us.INFORMATION_SCHEMA.JOBS,
UNNEST(referenced_tables) AS referenced_table
WHERE DATE(creation_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
GROUP BY 1
ORDER BY gb_scanned DESC;
\`\`\`

---

## 6. BigQuery ML (BQML)

Run ML models directly in SQL — no Python environment needed:

\`\`\`sql
-- Train a logistic regression model
CREATE OR REPLACE MODEL analytics.churn_model
OPTIONS (
    model_type         = 'logistic_reg',
    input_label_cols   = ['churn'],
    data_split_method  = 'auto_split'
) AS
SELECT
    logins_30d, days_since_last_login, plan_score, tickets_open,
    churn
FROM analytics.customer_features
WHERE snapshot_date = '2024-03-01';

-- Score new customers
SELECT
    customer_id,
    predicted_churn,
    predicted_churn_probs[OFFSET(1)].prob AS churn_probability
FROM ML.PREDICT(
    MODEL analytics.churn_model,
    (SELECT customer_id, logins_30d, days_since_last_login, plan_score, tickets_open
     FROM analytics.customer_features
     WHERE snapshot_date = CURRENT_DATE())
)
ORDER BY churn_probability DESC;
\`\`\`

---

## 7. Python BigQuery Client

\`\`\`python
from google.cloud import bigquery
import pandas as pd

# Authenticate via service account (GOOGLE_APPLICATION_CREDENTIALS env var)
client = bigquery.Client(project='my-analytics-project')

# Run a query and return as DataFrame
query = """
    SELECT
        DATE_TRUNC(event_date, WEEK) AS week,
        COUNT(DISTINCT user_id)      AS wau
    FROM analytics.events
    WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
    GROUP BY 1
    ORDER BY 1
"""
df = client.query(query).to_dataframe()

# Write a DataFrame to BigQuery
df_to_write.to_gbq(
    destination_table='analytics.my_analysis_results',
    project_id='my-analytics-project',
    if_exists='replace',      # or 'append', 'fail'
    progress_bar=False
)

# Cost-aware: dry run before executing
job_config = bigquery.QueryJobConfig(dry_run=True, use_query_cache=False)
dry_run = client.query(query, job_config=job_config)
print(f"Estimated bytes: {dry_run.total_bytes_processed / 1e9:.2f} GB")
\`\`\`

---

## Key Takeaways

- **BigQuery is billed by bytes scanned** — always select specific columns, filter on partitions, and use APPROX functions for exploration.
- **Partitioning by date** eliminates partition scans; **clustering** reduces within-partition scans — both are cost-efficient habits.
- **UNNEST** flattens ARRAY fields; **JSON_VALUE** extracts from JSON strings — both are BigQuery-native operations.
- **INFORMATION_SCHEMA.JOBS** monitors query usage and cost per user — essential for team governance.
- **BigQuery ML** runs ML models in SQL — powerful for quick iteration without leaving the data warehouse.
- Always do a **dry run** before running exploratory queries on multi-TB tables.
`,
    codeExample: `-- ── BigQuery: production analytics query patterns ─────────────────────────

-- 1. Partitioned table query — only 7 days of data scanned
SELECT
    DATE_TRUNC(DATE(event_timestamp), WEEK)         AS week_start,
    event_type,
    COUNT(DISTINCT user_id)                         AS unique_users,
    COUNT(*)                                        AS event_count,
    APPROX_COUNT_DISTINCT(session_id)               AS approx_sessions
FROM \`project.analytics.events\`
WHERE DATE(event_timestamp) BETWEEN
    DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) AND CURRENT_DATE()
GROUP BY 1, 2
ORDER BY week_start, event_count DESC;

-- 2. UNNEST nested ARRAY field
SELECT
    o.order_id,
    o.customer_id,
    item.sku,
    item.quantity * item.unit_price                 AS line_revenue
FROM \`project.analytics.orders\` o,
UNNEST(o.line_items) AS item
WHERE DATE(o.order_timestamp) = CURRENT_DATE() - 1
  AND item.category = 'Electronics';

-- 3. Cost monitoring — top 10 expensive queries this month
SELECT
    user_email,
    SUBSTR(query, 1, 80)                            AS query_preview,
    ROUND(total_bytes_processed / POW(1024,3), 1)   AS gb_scanned,
    ROUND(total_bytes_processed / POW(1024,4) * 6, 2) AS est_cost_usd,
    TIMESTAMP_DIFF(end_time, start_time, SECOND)    AS duration_secs
FROM \`region-us\`.INFORMATION_SCHEMA.JOBS
WHERE DATE(creation_time) >= DATE_TRUNC(CURRENT_DATE(), MONTH)
  AND job_type = 'QUERY' AND state = 'DONE'
  AND total_bytes_processed IS NOT NULL
ORDER BY total_bytes_processed DESC
LIMIT 10;`,
    quiz: {
      title: 'BigQuery & Cloud SQL for Analytics — Quiz',
      questions: [
        {
          text: 'Why does SELECT * in BigQuery cost significantly more than selecting specific columns?',
          options: opts(
            'BigQuery charges per column name read regardless of data volume',
            'BigQuery uses columnar storage and bills by bytes scanned — SELECT * reads all columns even if you only use two, dramatically increasing the cost compared to specifying the columns you need',
            'SELECT * disables partition pruning in BigQuery',
            'BigQuery converts SELECT * to a full table scan on disk'
          ),
          correctAnswer: 'b',
          explanation: 'Columnar storage means each column is stored and scanned independently. SELECT * forces BigQuery to scan every column (e.g., 50 columns), whereas SELECT user_id, event_type reads only 2 columns — 96% cost reduction on a 50-column table.',
          orderIndex: 1,
        },
        {
          text: 'What is PARTITION BY DATE(event_timestamp) in a BigQuery table creation?',
          options: opts(
            'It sorts the table by event_timestamp for faster lookups',
            'It physically divides the table into daily segments — queries filtered by date only scan the relevant day\'s partition, eliminating petabytes of irrelevant data',
            'It creates an index on the event_timestamp column',
            'It partitions the query across multiple worker nodes'
          ),
          correctAnswer: 'b',
          explanation: 'BigQuery partition pruning eliminates entire physical segments from the scan. A query with WHERE DATE(event_timestamp) = \'2024-03-01\' on a daily-partitioned table scans only one day\'s data — not the entire multi-year history.',
          orderIndex: 2,
        },
        {
          text: 'What does UNNEST(items) AS item do in a BigQuery query?',
          options: opts(
            'It removes nested structs from the table permanently',
            'It flattens an ARRAY column (items) into individual rows — each array element becomes a separate row joined to the original row\'s other columns',
            'It converts JSON strings into STRUCT types',
            'It creates a temporary unnested copy of the table'
          ),
          correctAnswer: 'b',
          explanation: 'UNNEST is BigQuery\'s way of joining ARRAY fields. An order with items = [{sku:A, qty:2}, {sku:B, qty:1}] becomes two rows after UNNEST — one per item. This is BigQuery\'s answer to the relational order_line_items table.',
          orderIndex: 3,
        },
        {
          text: 'APPROX_COUNT_DISTINCT(user_id) vs COUNT(DISTINCT user_id) — when should you prefer the approximate version?',
          options: opts(
            'Always — the approximate version is more accurate',
            'For exploratory analysis on large tables where 97-99% accuracy is sufficient and you want to avoid the high cost of exact distinct counting across billions of rows',
            'APPROX_COUNT_DISTINCT is only available in BigQuery ML',
            'When the user_id column is of type STRING rather than INT64'
          ),
          correctAnswer: 'b',
          explanation: 'COUNT(DISTINCT) on billions of rows requires expensive shuffle and deduplication across all workers. APPROX_COUNT_DISTINCT uses HyperLogLog++ (97-99% accurate) at a fraction of the cost. Use exact for final reports; approximate for exploration.',
          orderIndex: 4,
        },
        {
          text: 'What does the dry_run=True flag in the BigQuery Python client do?',
          options: opts(
            'It runs the query on a test dataset instead of production',
            'It estimates the bytes that would be scanned without actually executing the query — letting you check the cost before committing to the scan',
            'It limits the query to return only 1,000 rows',
            'It caches the results for 24 hours to avoid re-running'
          ),
          correctAnswer: 'b',
          explanation: 'A dry run compiles and validates the query, returning estimated bytes scanned (and therefore cost) without executing it. Essential discipline before running exploratory queries on multi-TB tables — prevents accidental expensive scans.',
          orderIndex: 5,
        },
        {
          text: 'What is the purpose of CLUSTER BY user_id, event_type in a BigQuery table?',
          options: opts(
            'It creates a composite primary key on user_id and event_type',
            'It co-locates rows with the same user_id and event_type values within each partition — queries filtering on these columns scan fewer bytes even within a partition',
            'It sorts the entire table by user_id for faster sequential reads',
            'It creates a materialized view indexed by user_id and event_type'
          ),
          correctAnswer: 'b',
          explanation: 'Clustering organises rows within each partition by the clustered columns. A query WHERE event_type = \'purchase\' on an event_type-clustered table skips large blocks of non-purchase rows within each partition, further reducing bytes scanned beyond partition pruning alone.',
          orderIndex: 6,
        },
        {
          text: 'In INFORMATION_SCHEMA.JOBS, what does total_bytes_billed / (1024^4) * $6 calculate?',
          options: opts(
            'The number of gigabytes scanned divided by 6',
            'The estimated cost in USD — BigQuery\'s on-demand pricing is approximately $6 per terabyte processed, so bytes_billed / 1TB_in_bytes × $6 gives the dollar cost',
            'The number of compute slots used by the query',
            'The storage cost for the query results'
          ),
          correctAnswer: 'b',
          explanation: 'BigQuery on-demand pricing = $6/TB (as of writing). 1 TB = 1024^4 bytes. So cost = bytes_billed / (1024^4) * 6. INFORMATION_SCHEMA.JOBS exposes bytes_billed, enabling per-query and per-user cost attribution.',
          orderIndex: 7,
        },
        {
          text: 'What does CREATE OR REPLACE MODEL in BigQuery ML do?',
          options: opts(
            'Creates a new BigQuery table with MODEL as the column type',
            'Trains a machine learning model (logistic regression, random forest, etc.) directly in BigQuery using SQL — no Python environment needed. The model is stored as a BigQuery object.',
            'Creates a templated view that approximates an ML model\'s output',
            'It is equivalent to CREATE TABLE with extra validation'
          ),
          correctAnswer: 'b',
          explanation: 'BQML (BigQuery ML) lets analysts train ML models with SQL. The model is trained on the SELECT result and stored as a BigQuery model object. ML.PREDICT() scores new data against the trained model — all without leaving the SQL environment.',
          orderIndex: 8,
        },
        {
          text: 'Why should you filter data in a CTE or subquery BEFORE joining large tables in BigQuery?',
          options: opts(
            'BigQuery requires filters to be applied in CTEs for partition pruning to work',
            'Joining two large unfiltered tables forces BigQuery to shuffle all rows across workers. Filtering first (e.g., to 30 days of data) dramatically reduces the join size, lowering both cost and execution time.',
            'CTE filters are applied at query compile time, not runtime',
            'BigQuery cannot apply partition filters inside a JOIN clause'
          ),
          correctAnswer: 'b',
          explanation: 'In distributed SQL, pushing filters before joins (predicate pushdown) is critical. If you join two 10TB tables and then filter, you pay for shuffling 100TB of joined data. Filtering to 30-day subsets first reduces the join from TB to GB.',
          orderIndex: 9,
        },
        {
          text: 'require_partition_filter = TRUE in BigQuery table options means:',
          options: opts(
            'Every query must include a WHERE clause, regardless of the column',
            'Queries on this table will fail unless they include a filter on the partition column — preventing accidental full-table scans that process years of data',
            'BigQuery automatically adds a date filter based on the current date',
            'The partition filter is applied at the storage level, not query level'
          ),
          correctAnswer: 'b',
          explanation: 'Without this setting, an analyst could accidentally run SELECT * FROM events (no date filter) and scan years of data at massive cost. require_partition_filter forces every query to include a partition column filter, preventing runaway costs.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 27 — dbt (Data Build Tool) for Analytics Engineers
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-27-dbt-analytics-engineering',
    title:      'dbt for Analytics Engineering',
    description:'Master dbt — the SQL transformation tool used at Airbnb, GitLab, and thousands of data teams. Build modular data models, write tests, generate documentation, and apply software engineering best practices to SQL analytics.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 127,
    xpReward:   125,
    language:   'sql',
    content: `# dbt for Analytics Engineering

## What You'll Learn
dbt (data build tool) is the tool that transformed how data teams work. It brings software engineering practices — version control, modularity, testing, documentation — to SQL transformations. Understanding dbt is a hiring requirement at virtually every modern data team.

---

## 1. What Is dbt?

dbt runs SQL \`SELECT\` statements and materialises their results as tables or views in your data warehouse. It handles:
- **Dependency resolution**: models that reference other models are run in the right order
- **Testing**: built-in data quality tests on every model
- **Documentation**: auto-generates a data catalogue from your SQL and YAML
- **Incremental loads**: only process new/changed data rather than full rebuilds

\`\`\`
Raw Data (S3/GCS) → [EL tool: Fivetran/Airbyte] → Staging tables → [dbt] → Marts → BI Tools
\`\`\`

---

## 2. Project Structure

\`\`\`
my_dbt_project/
├── dbt_project.yml              # project config (name, version, paths)
├── profiles.yml                 # connection credentials (local only, git-ignored)
├── models/
│   ├── staging/                 # 1:1 raw source cleaning
│   │   ├── stg_orders.sql
│   │   ├── stg_customers.sql
│   │   └── _staging_sources.yml # source definitions + tests
│   ├── intermediate/            # business logic joins
│   │   └── int_order_items.sql
│   └── marts/                  # final analytical tables consumed by BI
│       ├── core/
│       │   ├── dim_customers.sql
│       │   └── fct_orders.sql
│       └── marketing/
│           └── fct_campaigns.sql
├── tests/                      # custom SQL tests
│   └── assert_positive_revenue.sql
├── macros/                     # Jinja helper functions
│   └── date_spine.sql
└── snapshots/                  # SCD Type 2 history tracking
    └── orders_snapshot.sql
\`\`\`

---

## 3. Writing dbt Models

### Staging Model (stg_orders.sql)

\`\`\`sql
-- models/staging/stg_orders.sql
-- Staging: rename columns, cast types, basic cleaning only

WITH source AS (
    SELECT * FROM {{ source('raw', 'orders') }}  -- references raw source table
),

renamed AS (
    SELECT
        id                          AS order_id,
        customer_id,
        CAST(created_at AS DATE)    AS order_date,
        UPPER(status)               AS status,
        ROUND(total_amount, 2)      AS order_total_usd,
        discount_code               AS promo_code,
        -- Data cleaning
        NULLIF(discount_code, '')   AS promo_code_clean
    FROM source
    WHERE id IS NOT NULL               -- remove clearly invalid rows
)

SELECT * FROM renamed
\`\`\`

### Fact Model (fct_orders.sql)

\`\`\`sql
-- models/marts/core/fct_orders.sql
-- Fact table: joins staging models, applies business logic

WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}   -- ref() creates a dependency on stg_orders
),

customers AS (
    SELECT * FROM {{ ref('dim_customers') }}
),

order_items AS (
    SELECT * FROM {{ ref('int_order_items') }}
),

final AS (
    SELECT
        o.order_id,
        o.order_date,
        o.status,
        o.order_total_usd,
        c.customer_id,
        c.customer_tier,
        c.acquisition_channel,
        oi.total_items,
        oi.avg_item_price,
        -- Business logic
        CASE WHEN o.order_total_usd > 500 THEN 'High Value'
             WHEN o.order_total_usd > 100 THEN 'Mid Value'
             ELSE 'Low Value' END         AS order_value_tier,
        -- Metadata
        CURRENT_TIMESTAMP()               AS dbt_updated_at
    FROM orders o
    LEFT JOIN customers c USING (customer_id)
    LEFT JOIN order_items oi USING (order_id)
)

SELECT * FROM final
\`\`\`

---

## 4. Model Materialisation

Control how dbt stores model results in the warehouse:

\`\`\`yaml
# dbt_project.yml
models:
  my_project:
    staging:
      +materialized: view        # staging = lightweight views (no storage cost)
    intermediate:
      +materialized: view
    marts:
      +materialized: table       # marts = physical tables (fast BI queries)
      core:
        +materialized: table
\`\`\`

| Materialisation | When to use | Tradeoffs |
|---|---|---|
| \`view\` | Staging, rarely queried | No storage; computed at query time |
| \`table\` | Mart tables, frequently queried | Fast reads; rebuilt on each dbt run |
| \`incremental\` | Large fact tables | Only processes new rows; complex to maintain |
| \`ephemeral\` | CTEs embedded in other models | No object created; used as a CTE |

### Incremental Model

\`\`\`sql
-- models/marts/core/fct_events.sql
{{ config(
    materialized = 'incremental',
    unique_key   = 'event_id',
    on_schema_change = 'sync_all_columns'
) }}

SELECT
    event_id,
    user_id,
    event_type,
    event_timestamp,
    DATE(event_timestamp) AS event_date
FROM {{ ref('stg_events') }}

{% if is_incremental() %}
-- Only process events newer than the latest already in the table
WHERE event_timestamp > (SELECT MAX(event_timestamp) FROM {{ this }})
{% endif %}
\`\`\`

---

## 5. Testing in dbt

dbt has two test types:

### Generic Tests (YAML)

\`\`\`yaml
# models/staging/_staging_sources.yml
version: 2

sources:
  - name: raw
    database: my_project
    schema: raw_data
    tables:
      - name: orders
        columns:
          - name: id
            tests:
              - not_null
              - unique
          - name: status
            tests:
              - not_null
              - accepted_values:
                  values: ['pending', 'shipped', 'delivered', 'cancelled']
          - name: total_amount
            tests:
              - not_null

models:
  - name: stg_orders
    columns:
      - name: order_id
        tests: [not_null, unique]
      - name: order_total_usd
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 100000
\`\`\`

### Custom SQL Tests

\`\`\`sql
-- tests/assert_orders_have_customers.sql
-- This test FAILS if any rows are returned
SELECT
    o.order_id
FROM {{ ref('fct_orders') }} o
LEFT JOIN {{ ref('dim_customers') }} c USING (customer_id)
WHERE c.customer_id IS NULL  -- orphaned orders with no customer
\`\`\`

---

## 6. dbt Snapshots (SCD Type 2)

\`\`\`sql
-- snapshots/customer_snapshot.sql
{% snapshot customer_snapshot %}

{{ config(
    target_schema = 'snapshots',
    unique_key    = 'customer_id',
    strategy      = 'check',
    check_cols    = ['plan', 'email', 'status']  -- track changes to these columns
) }}

SELECT
    customer_id, email, plan, status, updated_at
FROM {{ source('raw', 'customers') }}

{% endsnapshot %}
\`\`\`

Running \`dbt snapshot\` adds dbt_valid_from and dbt_valid_to columns to track every version of each customer record — enabling point-in-time historical queries.

---

## 7. Key dbt CLI Commands

\`\`\`bash
dbt run                          # build all models
dbt run --select staging.*       # build only staging models
dbt run --select +fct_orders     # build fct_orders and all its upstream deps
dbt test                         # run all tests
dbt test --select stg_orders     # test a specific model
dbt build                        # run + test in one command
dbt docs generate                # generate documentation site
dbt docs serve                   # open docs in browser
dbt snapshot                     # run SCD Type 2 snapshots
dbt seed                         # load CSV files from the seeds/ folder
\`\`\`

---

## Key Takeaways

- **dbt runs SQL SELECT statements** and materialises them — it does not replace your warehouse, it layers on top of it.
- **Staging → Intermediate → Marts** is the standard layer architecture: clean in staging, join in intermediate, serve in marts.
- **\`ref()\`** creates model dependencies (dbt builds in the right order); **\`source()\`** references raw tables.
- **Generic tests** (not_null, unique, accepted_values) run from YAML; **custom tests** are SQL queries that fail if they return rows.
- **Incremental models** only process new data — essential for fact tables with billions of rows.
- **Snapshots** implement SCD Type 2 — every historical state of a record is preserved with valid_from/valid_to timestamps.
`,
    codeExample: `-- ── dbt model examples — production data warehouse patterns ──────────────

-- 1. Staging model: stg_orders.sql
-- Raw → clean column names, cast types, filter garbage
WITH source AS (
    SELECT * FROM {{ source('raw', 'shopify_orders') }}
),
cleaned AS (
    SELECT
        id::TEXT                        AS order_id,
        customer_id::TEXT               AS customer_id,
        created_at::TIMESTAMP           AS created_at,
        DATE(created_at)                AS order_date,
        UPPER(financial_status)         AS payment_status,
        COALESCE(total_price, 0)::FLOAT AS order_total_usd,
        NULLIF(discount_codes, '[]')    AS has_discount,
        source_name                     AS acquisition_channel
    FROM source
    WHERE id IS NOT NULL
      AND created_at >= '2022-01-01'   -- exclude junk test records
)
SELECT * FROM cleaned;

-- 2. Fact model: fct_orders.sql
-- marts/core/ — consumed directly by BI tools
WITH orders AS (SELECT * FROM {{ ref('stg_orders') }}),
     customers AS (SELECT * FROM {{ ref('dim_customers') }})

SELECT
    o.order_id,
    o.order_date,
    o.payment_status,
    o.order_total_usd,
    o.has_discount,
    c.customer_id,
    c.country,
    c.customer_tier,
    DATE_DIFF(o.order_date, c.first_order_date, DAY)  AS days_since_first_order,
    CASE WHEN DATE_DIFF(o.order_date, c.first_order_date, DAY) = 0
         THEN TRUE ELSE FALSE END                      AS is_first_order,
    CURRENT_TIMESTAMP()                                AS dbt_updated_at
FROM orders o
LEFT JOIN customers c USING (customer_id);`,
    quiz: {
      title: 'dbt for Analytics Engineering — Quiz',
      questions: [
        {
          text: 'What does {{ ref("stg_orders") }} do in a dbt model?',
          options: opts(
            'It imports the stg_orders.sql file as a Python module',
            'It creates an explicit dependency on the stg_orders model — dbt resolves this reference to the actual table/view name at runtime and ensures stg_orders is built before the current model',
            'It creates a copy of the stg_orders table in a new schema',
            'It runs the stg_orders model inline as a CTE'
          ),
          correctAnswer: 'b',
          explanation: 'ref() is the core of dbt\'s dependency graph. It resolves to the correct schema.table name for the environment (dev/prod) and ensures dbt builds models in the correct topological order. It also enables impact analysis (which models depend on this one?).',
          orderIndex: 1,
        },
        {
          text: 'What is the purpose of the Staging layer in dbt model architecture?',
          options: opts(
            'To run all business logic transformations before loading into the warehouse',
            'To create a 1:1 mapping from raw source tables — renaming columns, casting types, and applying minimal cleaning. No business logic, no joins.',
            'To materialise final tables consumed directly by Tableau or Power BI',
            'To store raw data as-is from the source system'
          ),
          correctAnswer: 'b',
          explanation: 'Staging is the "clean room" — pure renaming, type casting, and basic filtering. No joins, no business logic. This isolation means if the source schema changes, you only update the staging model, not every downstream model that uses those columns.',
          orderIndex: 2,
        },
        {
          text: 'What is the difference between materialized: view and materialized: table in dbt?',
          options: opts(
            'Views are for small tables; tables are for large ones',
            'A view is a stored SQL query — computed on every query, no storage. A table is physically materialised — fast to query but rebuilt on every dbt run.',
            'Tables require incremental mode; views are always full refreshes',
            'Views can only be used in staging; tables only in marts'
          ),
          correctAnswer: 'b',
          explanation: 'Views are essentially saved SELECT statements — zero storage cost but queried fresh each time (can be slow if complex). Tables are precomputed and fast to query. Typical: staging = view (lightweight), marts = table (fast BI queries).',
          orderIndex: 3,
        },
        {
          text: 'In dbt, a generic test of type "unique" on a column means:',
          options: opts(
            'The column values are validated against a unique constraint in the warehouse',
            'dbt runs a test query that fails if any value appears more than once — alerting you to duplicate primary keys which would corrupt downstream analytics',
            'The column must contain unique data types (no mixed types)',
            'The column index is optimised for uniqueness checks'
          ),
          correctAnswer: 'b',
          explanation: 'dbt\'s unique test runs SELECT count(*), count(distinct col) FROM model and fails if they differ. Catching duplicate primary keys early is critical — a fct_orders model with duplicate order_ids will break all downstream revenue metrics.',
          orderIndex: 4,
        },
        {
          text: 'What does {% if is_incremental() %} inside a dbt model do?',
          options: opts(
            'It checks whether the dbt run is currently processing this model',
            'It conditionally adds a WHERE clause that filters to only new/changed records when the model already exists — skipping the full rebuild and processing only the delta',
            'It enables the model to be run incrementally across multiple CPU cores',
            'It automatically detects which columns have changed since the last run'
          ),
          correctAnswer: 'b',
          explanation: 'On the first dbt run, is_incremental() is false — the full SELECT runs. On subsequent runs, it\'s true — the WHERE clause filters to only rows newer than the last processed row. This transforms an O(n) full rebuild into an O(delta) incremental process.',
          orderIndex: 5,
        },
        {
          text: 'What does a custom dbt test SQL file do if it returns rows?',
          options: opts(
            'It returns the rows as the test result for review',
            'The test FAILS — a custom test SQL is written to SELECT violating rows. If any rows are returned, dbt marks the test as failed. An empty result means the assertion holds.',
            'The rows are automatically deleted from the table',
            'The rows are logged and the test passes with a warning'
          ),
          correctAnswer: 'b',
          explanation: 'Custom dbt tests are written as "assertion queries" — SELECT rows that should NOT exist. Zero rows = all assertions hold = test passes. Any rows returned = data quality violation = test fails. Example: SELECT order_id FROM fct_orders WHERE order_total < 0.',
          orderIndex: 6,
        },
        {
          text: 'What does dbt snapshot implement?',
          options: opts(
            'A point-in-time backup of the entire warehouse',
            'SCD Type 2 (Slowly Changing Dimension) — it tracks historical changes by adding dbt_valid_from and dbt_valid_to timestamps to records, enabling you to query what a customer\'s plan was on any past date',
            'A compressed snapshot of the dbt project for version control',
            'An incremental load that snapshots only the daily delta'
          ),
          correctAnswer: 'b',
          explanation: 'dbt snapshot detects changes in specified check_cols. When a customer changes plan from "Basic" to "Pro", it closes the old record (dbt_valid_to = today) and creates a new record (dbt_valid_from = today, dbt_valid_to = null). Historical queries can filter WHERE dbt_valid_to IS NULL for current state.',
          orderIndex: 7,
        },
        {
          text: 'What does dbt build do differently from dbt run?',
          options: opts(
            'dbt build compiles models to check for SQL syntax errors without running them',
            'dbt build runs models AND immediately tests them in dependency order — a model\'s tests must pass before downstream models that depend on it are built',
            'dbt build only rebuilds models whose SQL has changed since the last run',
            'dbt build creates the warehouse schema and tables before running models'
          ),
          correctAnswer: 'b',
          explanation: 'dbt build = dbt run + dbt test in one command, with tests running after each model (not at the end). If stg_orders fails its not_null test, fct_orders (which depends on it) is not built — preventing corrupted data from propagating downstream.',
          orderIndex: 8,
        },
        {
          text: 'In the dbt project structure, what is the purpose of the macros/ folder?',
          options: opts(
            'It stores test SQL files for each model',
            'It contains Jinja macro functions — reusable SQL snippets that can be called from any model, preventing copy-pasting and enabling parameterised SQL across the project',
            'It stores raw CSV seed data for loading into the warehouse',
            'It holds dbt configuration files for each environment'
          ),
          correctAnswer: 'b',
          explanation: 'Macros are Jinja functions that generate SQL. A date_spine macro can generate a sequence of dates for any range; a clean_name macro can standardise string cleaning across 50 models. Macros DRY (Don\'t Repeat Yourself) out your SQL codebase.',
          orderIndex: 9,
        },
        {
          text: 'Why is dbt run --select +fct_orders more useful than dbt run --select fct_orders?',
          options: opts(
            'The + prefix runs the model faster by skipping documentation generation',
            'The + prefix includes all upstream dependencies — if stg_orders or dim_customers changed, the + selector rebuilds them first before rebuilding fct_orders, ensuring consistency',
            'fct_orders without + only runs the first 1,000 rows',
            'The + selector applies all configured tests after the run'
          ),
          correctAnswer: 'b',
          explanation: 'In dbt selector syntax, + before a model name means "include all upstream models." So +fct_orders rebuilds stg_orders, dim_customers, int_order_items, and then fct_orders. Without +, if an upstream model is stale, fct_orders rebuilds with outdated data.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 28 — Apache Airflow & Data Pipeline Orchestration
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-28-airflow-data-pipelines',
    title:      'Apache Airflow & Data Pipeline Orchestration',
    description:'Design and schedule production data pipelines with Apache Airflow — DAGs, operators, sensors, task dependencies, error handling, backfill, and monitoring patterns used at Airbnb, LinkedIn, and every modern data platform.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 128,
    xpReward:   120,
    language:   'python',
    content: `# Apache Airflow & Data Pipeline Orchestration

## What You'll Learn
Airflow is the world's most widely used data pipeline orchestrator. It schedules, monitors, and retries complex workflows that run your daily analytics — ingesting data, transforming it, running models, and refreshing dashboards. This chapter teaches you to design and operate production pipelines.

---

## 1. Core Concepts

- **DAG** (Directed Acyclic Graph): a collection of tasks with dependencies, defining the execution order
- **Operator**: a template for a task (PythonOperator, BashOperator, BigQueryOperator, etc.)
- **Task**: an instance of an operator with a specific configuration
- **Task Instance**: a specific run of a task on a specific logical date
- **Scheduler**: the Airflow component that triggers task instances based on schedule + dependencies
- **Executor**: runs the actual task instances (Local, Celery, Kubernetes)

---

## 2. Your First DAG

\`\`\`python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator

# Default arguments applied to all tasks
default_args = {
    'owner':            'analytics-team',
    'depends_on_past':  False,
    'email_on_failure': True,
    'email_on_retry':   False,
    'retries':          2,
    'retry_delay':      timedelta(minutes=5),
    'execution_timeout':timedelta(hours=1),
}

with DAG(
    dag_id='daily_revenue_pipeline',
    default_args=default_args,
    description='Ingest, transform, and refresh revenue KPIs',
    schedule='0 6 * * *',         # daily at 06:00 UTC (cron syntax)
    start_date=datetime(2024, 1, 1),
    catchup=False,                 # do not backfill historical runs on first deploy
    tags=['finance', 'daily'],
) as dag:

    start = EmptyOperator(task_id='start')

    ingest_orders = PythonOperator(
        task_id='ingest_orders_from_api',
        python_callable=fetch_orders_from_api,
        op_kwargs={'date': '{{ ds }}'}  # Jinja: ds = logical execution date (YYYY-MM-DD)
    )

    run_dbt = BashOperator(
        task_id='run_dbt_models',
        bash_command='cd /opt/dbt && dbt run --select marts.core.+ --target prod'
    )

    test_dbt = BashOperator(
        task_id='test_dbt_models',
        bash_command='cd /opt/dbt && dbt test --select marts.core.+'
    )

    refresh_dashboard = PythonOperator(
        task_id='refresh_looker_dashboard',
        python_callable=trigger_looker_pdt_refresh,
    )

    end = EmptyOperator(task_id='end')

    # Define task dependencies
    start >> ingest_orders >> run_dbt >> test_dbt >> refresh_dashboard >> end
\`\`\`

---

## 3. Operators

### PythonOperator

\`\`\`python
from airflow.operators.python import PythonOperator

def process_daily_data(execution_date, **context):
    """Task function — receives execution_date automatically."""
    print(f"Processing for {execution_date.date()}")
    df = pd.read_parquet(f"s3://bucket/raw/{execution_date.date()}.parquet")
    df_clean = clean_data(df)
    df_clean.to_parquet(f"s3://bucket/processed/{execution_date.date()}.parquet")
    # Return value is stored in XCom (cross-communication) for downstream tasks
    return len(df_clean)

process = PythonOperator(
    task_id='process_daily_data',
    python_callable=process_daily_data,
)
\`\`\`

### BigQueryOperator

\`\`\`python
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator

refresh_kpis = BigQueryInsertJobOperator(
    task_id='refresh_daily_kpis',
    configuration={
        "query": {
            "query": """
                CREATE OR REPLACE TABLE analytics.daily_kpis AS
                SELECT DATE(event_timestamp) AS event_date,
                       COUNT(DISTINCT user_id) AS DAU
                FROM analytics.events
                WHERE DATE(event_timestamp) = '{{ ds }}'
                GROUP BY 1
            """,
            "useLegacySql": False,
        }
    },
    gcp_conn_id='google_cloud_default',
)
\`\`\`

### Sensor — Wait for External Condition

\`\`\`python
from airflow.sensors.s3_key_sensor import S3KeySensor

wait_for_file = S3KeySensor(
    task_id='wait_for_daily_export',
    bucket_name='my-data-bucket',
    bucket_key='exports/orders/{{ ds }}/orders.csv',
    aws_conn_id='aws_default',
    mode='reschedule',          # sleep between polls rather than holding a worker
    poke_interval=300,          # check every 5 minutes
    timeout=60 * 60 * 6,        # fail after 6 hours
)
\`\`\`

---

## 4. XCom — Cross-Task Communication

\`\`\`python
def extract(**context):
    """Push row count to XCom."""
    row_count = run_extraction()
    context['task_instance'].xcom_push(key='row_count', value=row_count)

def load(**context):
    """Pull row count from upstream task."""
    row_count = context['task_instance'].xcom_pull(
        task_ids='extract', key='row_count'
    )
    if row_count == 0:
        raise ValueError("Extract returned 0 rows — aborting load")

extract_task = PythonOperator(task_id='extract', python_callable=extract)
load_task    = PythonOperator(task_id='load',    python_callable=load)

extract_task >> load_task
\`\`\`

---

## 5. Dynamic DAG Generation

\`\`\`python
# Create parallel tasks for each country
COUNTRIES = ['US', 'GB', 'DE', 'FR', 'JP']

with DAG('country_reports', schedule='@daily', start_date=datetime(2024,1,1)) as dag:
    start = EmptyOperator(task_id='start')
    end   = EmptyOperator(task_id='end')

    for country in COUNTRIES:
        task = PythonOperator(
            task_id=f'process_{country.lower()}',
            python_callable=process_country_report,
            op_kwargs={'country': country},
        )
        start >> task >> end
\`\`\`

---

## 6. Error Handling & Alerting

\`\`\`python
def send_slack_alert(context):
    """Called on task failure — sends Slack alert."""
    ti  = context['task_instance']
    msg = (
        f"*Task Failed* :x:\n"
        f"DAG: {ti.dag_id} | Task: {ti.task_id}\n"
        f"Execution date: {ti.execution_date}\n"
        f"Log URL: {ti.log_url}"
    )
    slack_hook.send(text=msg)

default_args = {
    'on_failure_callback': send_slack_alert,
    'retries': 2,
    'retry_delay': timedelta(minutes=10),
    'retry_exponential_backoff': True,  # 10min, 20min, 40min
    'max_retry_delay': timedelta(hours=1),
}
\`\`\`

---

## 7. Backfill

\`\`\`bash
# Run a DAG for a historical date range (useful after bug fixes)
airflow dags backfill daily_revenue_pipeline \\
    --start-date 2024-01-01 \\
    --end-date 2024-01-31 \\
    --reset-dagruns          # clear previous run states before backfilling
\`\`\`

---

## 8. SLA and Monitoring Best Practices

\`\`\`python
with DAG(
    'daily_revenue_pipeline',
    sla_miss_callback=notify_on_sla_miss,   # called if tasks miss their SLA
    dagrun_timeout=timedelta(hours=3),       # entire DAG must finish in 3h
    ...
) as dag:
    critical_transform = BigQueryOperator(
        task_id='transform_revenue',
        sla=timedelta(hours=1),  # this specific task must finish within 1 hour
        ...
    )
\`\`\`

**Pipeline health checklist:**
\`\`\`
✅ All tasks have retries >= 2 with exponential backoff
✅ Sensors use mode='reschedule' (not 'poke' which blocks a worker slot)
✅ Timeouts set on every task (execution_timeout)
✅ SLA set on critical tasks
✅ Slack/PagerDuty alerts on failure
✅ catchup=False unless you explicitly need historical backfill
✅ No global Python state in task functions (tasks must be idempotent)
\`\`\`

---

## Key Takeaways

- **DAG = workflow graph** of tasks with explicit dependencies; Airflow schedules and retries them.
- **Operators** are templates; PythonOperator, BashOperator, BigQueryOperator, and Sensors cover 90% of real use cases.
- **XCom** passes small values between tasks; for large data, pass file paths (S3/GCS URIs), not the data itself.
- **Sensors** wait for external conditions (file arrival, API ready) — always use \`mode='reschedule'\` to avoid blocking worker slots.
- **Backfill** re-processes historical dates after bug fixes — essential for maintaining data quality.
- Every task must be **idempotent**: running it twice must produce the same result as running it once.
`,
    codeExample: `from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.operators.empty import EmptyOperator
import pandas as pd
import logging

logger = logging.getLogger(__name__)

# ── Reusable alert callback ──────────────────────────────────────────────
def on_failure(context):
    ti = context['task_instance']
    logger.error(
        "Task %s in DAG %s failed on %s",
        ti.task_id, ti.dag_id, ti.execution_date.date()
    )
    # In production: send to Slack/PagerDuty via a Hook

# ── Task functions ───────────────────────────────────────────────────────
def extract_orders(ds: str, **ctx) -> int:
    """Fetch orders for execution date ds (YYYY-MM-DD)."""
    logger.info("Extracting orders for %s", ds)
    # Simulate API call
    df = pd.DataFrame({'order_id': range(1, 101), 'date': ds, 'total': 99.9})
    df.to_parquet(f"/tmp/orders_{ds}.parquet", index=False)
    ctx['ti'].xcom_push('row_count', len(df))
    return len(df)

def check_row_count(**ctx):
    row_count = ctx['ti'].xcom_pull(task_ids='extract_orders', key='row_count')
    return 'transform_orders' if row_count > 0 else 'no_data_alert'

def transform_orders(ds: str, **ctx):
    df = pd.read_parquet(f"/tmp/orders_{ds}.parquet")
    df['revenue_band'] = pd.cut(df['total'], bins=[0,50,200,float('inf')],
                                 labels=['low','mid','high'])
    df.to_parquet(f"/tmp/orders_clean_{ds}.parquet", index=False)
    logger.info("Transformed %d rows for %s", len(df), ds)

# ── DAG definition ───────────────────────────────────────────────────────
default_args = {
    'owner': 'analytics',
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'on_failure_callback': on_failure,
    'execution_timeout': timedelta(hours=1),
}

with DAG(
    dag_id='orders_daily_pipeline',
    default_args=default_args,
    schedule='0 7 * * *',
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['orders', 'daily'],
) as dag:

    start   = EmptyOperator(task_id='start')
    extract = PythonOperator(task_id='extract_orders',
                              python_callable=extract_orders)
    branch  = BranchPythonOperator(task_id='check_row_count',
                                    python_callable=check_row_count)
    xform   = PythonOperator(task_id='transform_orders',
                              python_callable=transform_orders)
    alert   = EmptyOperator(task_id='no_data_alert')
    end     = EmptyOperator(task_id='end', trigger_rule='none_failed_min_one_success')

    start >> extract >> branch >> [xform, alert]
    xform >> end
    alert >> end`,
    quiz: {
      title: 'Apache Airflow & Data Pipeline Orchestration — Quiz',
      questions: [
        {
          text: 'What does "Directed Acyclic Graph" (DAG) mean in the context of Airflow?',
          options: opts(
            'A graph where tasks run in circles, with each task triggering the previous',
            'A graph of tasks where edges show dependencies and there are no circular dependencies — ensuring a clear start and end, and a well-defined execution order',
            'A graph where all tasks run simultaneously in parallel',
            'A daily automated graph that visualises your data pipeline'
          ),
          correctAnswer: 'b',
          explanation: 'Directed: edges have direction (A must run before B). Acyclic: no cycles (A cannot depend on B if B depends on A). This guarantees a topological order exists — Airflow can always determine which tasks to run first.',
          orderIndex: 1,
        },
        {
          text: 'What does catchup=False do in a DAG definition?',
          options: opts(
            'It prevents Airflow from retrying failed tasks',
            'It tells Airflow not to automatically schedule and run DAG runs for all historical dates between start_date and now when the DAG is first deployed',
            'It disables the catch-up mechanism for late-arriving data',
            'It prevents the DAG from running more than once per day'
          ),
          correctAnswer: 'b',
          explanation: 'Without catchup=False, if you deploy a DAG with start_date 6 months ago, Airflow will immediately try to run 180 historical DAG runs. This clogs the scheduler and often isn\'t needed. catchup=False means "only run from now forward."',
          orderIndex: 2,
        },
        {
          text: 'What is the difference between a Sensor with mode="poke" vs mode="reschedule"?',
          options: opts(
            'poke checks more frequently; reschedule checks less frequently',
            'poke occupies a worker slot continuously while polling (blocking); reschedule releases the worker between polls, allowing other tasks to use the slot — always prefer reschedule',
            'reschedule is only available for S3 sensors; poke works for all sensors',
            'poke polls indefinitely; reschedule stops after timeout'
          ),
          correctAnswer: 'b',
          explanation: 'With mode=poke, the sensor task holds a worker slot (CPU/memory) for the entire wait duration — potentially hours. With mode=reschedule, the task releases the slot between checks and only re-acquires it to poll. In Celery/K8s executors, poke sensors exhaust worker capacity.',
          orderIndex: 3,
        },
        {
          text: 'What is XCom in Airflow and what is the key limitation?',
          options: opts(
            'XCom is Airflow\'s execution command — it runs Python functions as tasks',
            'XCom (cross-communication) passes small values between tasks via the metadata database. Key limitation: it is not designed for large data — never push DataFrames or large files; push file paths (S3 URIs) instead.',
            'XCom is a cross-cloud communication protocol for multi-region pipelines',
            'XCom logs all task outputs to an external monitoring system'
          ),
          correctAnswer: 'b',
          explanation: 'XCom stores values in Airflow\'s metadata database (usually Postgres). Storing large DataFrames bloats the database and causes memory issues. Best practice: push a file path (s3://bucket/file.parquet) to XCom; downstream tasks read from storage, not XCom.',
          orderIndex: 4,
        },
        {
          text: 'What is task idempotency and why is it critical in Airflow?',
          options: opts(
            'Idempotency means a task runs only once regardless of retries',
            'An idempotent task produces the same result whether run once or multiple times — critical because Airflow retries failed tasks, so a non-idempotent task (e.g., one that appends to a table) would duplicate data on retry',
            'Idempotency prevents two tasks from running simultaneously',
            'An idempotent task can run independently of its dependencies'
          ),
          correctAnswer: 'b',
          explanation: 'Airflow retries tasks on failure. If a task INSERT-appended 1,000 rows before failing, a retry would INSERT them again — creating duplicates. Idempotent tasks use CREATE OR REPLACE, DELETE + INSERT, or MERGE/UPSERT patterns so running twice is safe.',
          orderIndex: 5,
        },
        {
          text: 'What does {{ ds }} in an Airflow Jinja template resolve to?',
          options: opts(
            'The current system datetime in ISO 8601 format',
            'The logical execution date of the DAG run in YYYY-MM-DD format — for a daily DAG scheduled for 2024-03-15, ds = "2024-03-15"',
            'The data source name configured in the connection',
            'The dataset identifier for the BigQuery table'
          ),
          correctAnswer: 'b',
          explanation: 'Airflow provides template variables via Jinja. ds = execution_date formatted as YYYY-MM-DD. This is the "logical date" of the scheduled run, not the actual run time. It allows tasks to process "yesterday\'s data" by filtering WHERE date = \'{{ ds }}\'.',
          orderIndex: 6,
        },
        {
          text: 'What does BranchPythonOperator do in a DAG?',
          options: opts(
            'It runs a Python function in a separate branch of the DAG in parallel',
            'It executes a Python function that returns the task_id(s) of the next task(s) to run — enabling conditional branching based on runtime data (e.g., skip downstream if no data was found)',
            'It branches a Python subprocess for parallel execution',
            'It creates a copy of the Python environment for each downstream task'
          ),
          correctAnswer: 'b',
          explanation: 'BranchPythonOperator calls a function that returns a task_id string (or list). Only the returned task(s) are executed; all other downstream tasks in the branch are skipped. Used for conditional logic: "if row_count > 0: transform, else: alert."',
          orderIndex: 7,
        },
        {
          text: 'What does retry_exponential_backoff=True do in Airflow task default_args?',
          options: opts(
            'It doubles the number of retries on each DAG run failure',
            'Each retry waits exponentially longer than the previous — 5min, 10min, 20min. Prevents hammering a recovering downstream service immediately after failure.',
            'It automatically scales the retry count based on task duration',
            'It backs up task logs before each retry attempt'
          ),
          correctAnswer: 'b',
          explanation: 'Immediate retries can worsen a recovering service (thundering herd). Exponential backoff waits progressively longer: retry 1 = 5min, retry 2 = 10min, retry 3 = 20min. Combined with max_retry_delay, this prevents indefinite waits while being respectful of upstream systems.',
          orderIndex: 8,
        },
        {
          text: 'What is the purpose of dagrun_timeout=timedelta(hours=3) in a DAG?',
          options: opts(
            'It limits each individual task to 3 hours maximum',
            'It sets an overall time budget for the entire DAG run — if the pipeline has not completed within 3 hours, Airflow marks it as failed, preventing stuck pipelines from blocking downstream schedules',
            'It schedules the DAG to run every 3 hours',
            'It sets the SLA for the dashboard refresh that follows the pipeline'
          ),
          correctAnswer: 'b',
          explanation: 'dagrun_timeout is a safety net for the entire pipeline. If a task hangs indefinitely (infinite loop, unresponsive API), the pipeline would block downstream DAGs. dagrun_timeout kills the run after the specified duration, triggering alerts.',
          orderIndex: 9,
        },
        {
          text: 'How do you re-process a daily pipeline for the entire month of March after fixing a bug?',
          options: opts(
            'Manually trigger each day\'s run from the Airflow UI one at a time',
            'Use airflow dags backfill --start-date 2024-03-01 --end-date 2024-03-31 to schedule one DAG run per day in the historical range, processing each day\'s data with the fixed code',
            'Set start_date to 2024-03-01 and deploy the fixed DAG — Airflow will automatically backfill',
            'Edit the database to mark March runs as pending'
          ),
          correctAnswer: 'b',
          explanation: 'The backfill command is Airflow\'s mechanism for reprocessing historical data. It creates one DAGRun per logical date between start-date and end-date. Add --reset-dagruns to clear previous failed/success states before backfilling.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 29 — Data Quality & Governance
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-29-data-quality-governance',
    title:      'Data Quality & Governance',
    description:'Build production-grade data quality frameworks — profiling, anomaly detection, Great Expectations, data contracts, lineage tracking, and the governance practices that make analytics teams trusted at enterprise scale.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 129,
    xpReward:   115,
    language:   'python',
    content: `# Data Quality & Governance

## What You'll Learn
Bad data costs US companies an estimated $3 trillion per year (IBM). Data quality is not an afterthought — it is the foundation of trustworthy analytics. This chapter teaches the frameworks, tools, and cultural practices that make data teams reliable.

---

## 1. The Five Dimensions of Data Quality

| Dimension | Definition | Example violation |
|---|---|---|
| **Completeness** | Are all expected values present? | 30% of user records have NULL email |
| **Accuracy** | Does the data correctly represent reality? | Order date is 2099 (data entry error) |
| **Consistency** | Is the same concept represented the same way across tables? | "US" in one table, "United States" in another |
| **Timeliness** | Is the data available when needed? | Yesterday's pipeline ran 6 hours late |
| **Uniqueness** | Are entities deduplicated? | Same customer appears twice with different IDs |

---

## 2. Data Profiling

\`\`\`python
import pandas as pd
import numpy as np

def profile_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a comprehensive data quality report for a DataFrame."""
    n = len(df)
    profiles = []
    for col in df.columns:
        s = df[col]
        profile = {
            'column':       col,
            'dtype':        str(s.dtype),
            'null_count':   s.isna().sum(),
            'null_pct':     round(s.isna().mean() * 100, 1),
            'unique_count': s.nunique(),
            'unique_pct':   round(s.nunique() / n * 100, 1),
            'duplicate_pct':round((1 - s.nunique() / n) * 100, 1),
        }
        if pd.api.types.is_numeric_dtype(s):
            profile.update({
                'min':    s.min(),
                'max':    s.max(),
                'mean':   round(s.mean(), 2),
                'std':    round(s.std(), 2),
                'p25':    s.quantile(0.25),
                'p75':    s.quantile(0.75),
                'zeros':  (s == 0).sum(),
                'negatives': (s < 0).sum(),
            })
        elif pd.api.types.is_string_dtype(s):
            profile.update({
                'min_len':    s.str.len().min(),
                'max_len':    s.str.len().max(),
                'top_value':  s.mode().iloc[0] if len(s.mode()) else None,
                'empty_strings': (s == '').sum(),
            })
        profiles.append(profile)
    return pd.DataFrame(profiles)

report = profile_dataframe(orders_df)
print(report[['column','null_pct','unique_pct','min','max']].to_string())
\`\`\`

---

## 3. Statistical Anomaly Detection

\`\`\`python
import pandas as pd
import numpy as np
from scipy import stats

def detect_metric_anomalies(
    df: pd.DataFrame,
    metric_col: str,
    date_col: str,
    z_threshold: float = 3.0,
    window: int = 14
) -> pd.DataFrame:
    """
    Flag dates where the metric is more than z_threshold std devs
    from the rolling mean — using a rolling baseline to handle trends.
    """
    df = df.sort_values(date_col).copy()
    rolling_mean = df[metric_col].rolling(window, min_periods=7).mean()
    rolling_std  = df[metric_col].rolling(window, min_periods=7).std()

    df['z_score']  = (df[metric_col] - rolling_mean) / rolling_std.clip(lower=0.001)
    df['is_anomaly'] = df['z_score'].abs() > z_threshold
    df['direction']  = np.where(df['z_score'] > 0, 'SPIKE', 'DROP')

    anomalies = df[df['is_anomaly']].copy()
    return anomalies[[date_col, metric_col, 'z_score', 'direction']]

# Daily revenue anomaly detection
daily_rev = orders.groupby('order_date')['revenue'].sum().reset_index()
anomalies = detect_metric_anomalies(daily_rev, 'revenue', 'order_date', z_threshold=2.5)
print(f"Found {len(anomalies)} anomalous days:")
print(anomalies.to_string())
\`\`\`

---

## 4. SQL-Based Data Quality Checks

\`\`\`sql
-- 1. Completeness check: tables have expected row counts
WITH expected AS (
    SELECT 'orders' AS table_name, 10000 AS expected_min_rows
    UNION ALL
    SELECT 'users', 5000
),
actuals AS (
    SELECT 'orders' AS table_name, COUNT(*) AS actual_rows FROM orders
    UNION ALL
    SELECT 'users', COUNT(*) FROM users
)
SELECT
    e.table_name,
    e.expected_min_rows,
    a.actual_rows,
    CASE WHEN a.actual_rows < e.expected_min_rows THEN 'FAIL' ELSE 'PASS' END AS check_status
FROM expected e JOIN actuals a USING (table_name);

-- 2. Referential integrity: all order customer_ids exist in users
SELECT COUNT(*) AS orphaned_orders
FROM orders o
LEFT JOIN users u USING (customer_id)
WHERE u.customer_id IS NULL;   -- should be 0

-- 3. Business rule: order total = sum of line items
SELECT
    order_id,
    order_total,
    SUM(item_price * quantity) AS calculated_total,
    ABS(order_total - SUM(item_price * quantity)) AS discrepancy
FROM orders
JOIN order_items USING (order_id)
GROUP BY order_id, order_total
HAVING ABS(order_total - SUM(item_price * quantity)) > 0.01;  -- rounding tolerance

-- 4. Freshness check: data updated within expected window
SELECT
    MAX(updated_at)                         AS last_update,
    CURRENT_TIMESTAMP - MAX(updated_at)    AS data_age,
    CASE WHEN CURRENT_TIMESTAMP - MAX(updated_at) > INTERVAL '25 hours'
         THEN 'STALE' ELSE 'FRESH' END      AS freshness_status
FROM orders;
\`\`\`

---

## 5. Great Expectations — Production DQ Framework

Great Expectations is the industry-standard Python library for data quality:

\`\`\`python
import great_expectations as gx

context = gx.get_context()

# Define expectations on a DataFrame
validator = context.sources.pandas_default.read_dataframe(orders_df)

# Completeness
validator.expect_column_values_to_not_be_null('order_id')
validator.expect_column_values_to_not_be_null('customer_id')

# Uniqueness
validator.expect_column_values_to_be_unique('order_id')

# Range validation
validator.expect_column_values_to_be_between('order_total', min_value=0, max_value=100_000)

# Accepted values
validator.expect_column_values_to_be_in_set(
    'status', ['pending', 'shipped', 'delivered', 'cancelled', 'refunded']
)

# Type check
validator.expect_column_values_to_match_strftime_format('order_date', '%Y-%m-%d')

# Row count
validator.expect_table_row_count_to_be_between(min_value=1000, max_value=1_000_000)

# Run all expectations and get a validation result
results = validator.validate()
print(f"Passed: {results['success']}")
print(f"Pass rate: {results['statistics']['successful_expectations'] / results['statistics']['evaluated_expectations']:.0%}")
\`\`\`

---

## 6. Data Contracts

A data contract is a formal agreement between data producers and consumers about what data will look like:

\`\`\`yaml
# data_contract_orders.yaml
name: orders
version: "1.2.0"
owner: checkout-team
consumers: [analytics-team, finance-team, ml-team]
updated: 2024-03-01

schema:
  - field: order_id
    type: STRING
    nullable: false
    unique: true
    description: "Unique order identifier, format ORD-XXXXXXXXXX"

  - field: customer_id
    type: STRING
    nullable: false
    description: "References users.customer_id"

  - field: order_date
    type: DATE
    nullable: false
    description: "Date order was placed (UTC)"

  - field: order_total_usd
    type: FLOAT
    nullable: false
    minimum: 0.0
    maximum: 100000.0

  - field: status
    type: STRING
    nullable: false
    enum: [pending, shipped, delivered, cancelled, refunded]

quality:
  freshness_sla_hours: 24
  row_count_min: 1000
  completeness_threshold: 99.9%  # max 0.1% nulls per required field
\`\`\`

---

## 7. Data Lineage

Data lineage tracks where data came from, what transformed it, and where it went:

\`\`\`
Shopify API → raw.orders (Fivetran) → stg_orders (dbt) → fct_orders (dbt) → Revenue Dashboard (Looker)
\`\`\`

Modern tools that provide lineage:
- **dbt**: automatic lineage graph via \`ref()\` and \`source()\`
- **OpenLineage / Marquez**: open standard for lineage events
- **DataHub / Amundsen**: data catalogue with lineage UI

**Why lineage matters:**
- When a source table schema changes, you can instantly see all downstream tables affected
- When a metric looks wrong, you can trace it back to its source tables and transformations
- Regulatory compliance (GDPR, HIPAA) requires knowing where personal data flows

---

## Key Takeaways

- Data quality has **five dimensions**: completeness, accuracy, consistency, timeliness, uniqueness — monitor all five.
- **Profile every new dataset** before analysis — null rates, value ranges, and cardinality reveal hidden issues.
- **Statistical anomaly detection** with rolling z-scores flags metric spikes/drops without needing pre-set thresholds.
- **Great Expectations** formalises quality checks as code — they run in CI/CD and block bad data from reaching consumers.
- **Data contracts** establish formal producer-consumer agreements about schema, types, and quality SLAs.
- **Data lineage** makes debugging fast and is mandatory for regulatory compliance in enterprise analytics.
`,
    codeExample: `import pandas as pd
import numpy as np
from scipy import stats

rng = np.random.default_rng(42)
n = 365
dates = pd.date_range('2023-01-01', periods=n, freq='D')

# ── Simulate daily revenue with anomalies ────────────────────────────────
base_revenue = 50000 + np.linspace(0, 10000, n)  # slight upward trend
noise = rng.normal(0, 3000, n)
revenue = (base_revenue + noise).clip(0)

# Inject anomalies
revenue[45]  = 3000    # sudden DROP
revenue[120] = 95000   # sudden SPIKE
revenue[200] = 0       # pipeline failure

df = pd.DataFrame({'date': dates, 'revenue': revenue})

# ── Rolling z-score anomaly detection ────────────────────────────────────
WINDOW = 14
df['roll_mean'] = df['revenue'].rolling(WINDOW, min_periods=5).mean()
df['roll_std']  = df['revenue'].rolling(WINDOW, min_periods=5).std()
df['z_score']   = ((df['revenue'] - df['roll_mean'])
                   / df['roll_std'].clip(lower=100))
df['anomaly']   = df['z_score'].abs() > 2.5
df['type']      = np.where(df['z_score'] > 2.5, 'SPIKE',
                  np.where(df['z_score'] < -2.5, 'DROP', 'normal'))

print("Detected anomalies:")
print(df[df['anomaly']][['date','revenue','z_score','type']].to_string(index=False))

# ── Data profiling ────────────────────────────────────────────────────────
orders = pd.DataFrame({
    'order_id':    range(1000),
    'customer_id': rng.integers(1, 500, 1000),
    'total':       np.abs(rng.normal(120, 80, 1000)),
    'status':      rng.choice(['shipped','pending','cancelled',None], 1000,
                               p=[0.6,0.25,0.1,0.05]),
    'order_date':  pd.date_range('2024-01-01', periods=1000, freq='8h'),
})

quality_report = pd.DataFrame([{
    'column':    col,
    'null_pct':  round(orders[col].isna().mean() * 100, 1),
    'unique':    orders[col].nunique(),
} for col in orders.columns])
print("\\nData Quality Report:")
print(quality_report.to_string(index=False))`,
    quiz: {
      title: 'Data Quality & Governance — Quiz',
      questions: [
        {
          text: 'You notice that 15% of rows in a new dataset have NULL in the customer_email column. Which data quality dimension does this violate?',
          options: opts(
            'Accuracy — the email values are wrong',
            'Completeness — expected values are missing. 15% null rate in a required field means 15% of records are incomplete.',
            'Consistency — emails are stored differently across tables',
            'Uniqueness — multiple rows have the same null email'
          ),
          correctAnswer: 'b',
          explanation: 'Completeness measures whether all expected values are present. A 15% NULL rate in customer_email means 15% of records are missing this field — a completeness violation. Accuracy would be wrong (but present) values; consistency would be format differences.',
          orderIndex: 1,
        },
        {
          text: 'In the rolling z-score anomaly detection, why do you use a rolling mean instead of a global mean?',
          options: opts(
            'Rolling calculations are faster for large datasets',
            'A global mean does not account for trend or seasonality. A metric that grows 10% per month will have recent values consistently above the global mean — flagging them as anomalies even when they are healthy. Rolling baseline adapts to trends.',
            'The global mean would require sorting the data first',
            'Rolling means are more statistically accurate than global means'
          ),
          correctAnswer: 'b',
          explanation: 'An upward-trending metric will have recent values far above a global mean calculated over all history — producing false positive anomalies. The rolling window (e.g., last 14 days) creates a local baseline that tracks the trend, flagging only genuine deviations.',
          orderIndex: 2,
        },
        {
          text: 'A SQL referential integrity check returns 500 orphaned orders (orders with no matching customer). What does this indicate?',
          options: opts(
            'The orders table has 500 duplicate rows',
            'These 500 orders have customer_id values that do not exist in the users table — a data integrity failure that breaks any order-to-customer join and invalidates customer-level analytics',
            'The users table is missing 500 customers who should have been loaded',
            'These 500 orders belong to anonymous (guest) customers'
          ),
          correctAnswer: 'b',
          explanation: 'Orphaned orders have customer_ids that reference non-existent users. Any query joining orders to customers will silently drop these 500 rows (with LEFT JOIN) or exclude them (INNER JOIN), causing undercounting in customer analytics. This is a data pipeline bug requiring investigation.',
          orderIndex: 3,
        },
        {
          text: 'What does validator.expect_column_values_to_be_between("order_total", min_value=0) in Great Expectations test?',
          options: opts(
            'It checks that the column average is between 0 and infinity',
            'It tests that every value in order_total is >= 0 — flagging negative order totals which likely represent data errors (reversed signs, refund records mixed in)',
            'It validates the column data type is numeric',
            'It ensures the column is not null and has no zero values'
          ),
          correctAnswer: 'b',
          explanation: 'expect_column_values_to_be_between checks each row value against the bounds. Any order_total < 0 fails the expectation. This catches sign errors (negative prices stored as actual values), which would undercount revenue if included in SUM.',
          orderIndex: 4,
        },
        {
          text: 'What is a Data Contract and why does it matter for analytics teams?',
          options: opts(
            'A legal agreement between the company and its data vendor',
            'A formal specification of what data a producer will provide — schema, types, nullability, accepted values, and freshness SLAs. It prevents consumers from breaking when producers change their data format.',
            'A database constraint that enforces data types at insert time',
            'A privacy agreement that governs how customer data can be used'
          ),
          correctAnswer: 'b',
          explanation: 'Without a data contract, the checkout team can rename a column (order_amount → order_total_usd) and break the analytics team\'s pipeline silently. With a contract, breaking changes require a version bump and consumer notification — applying software API design principles to data.',
          orderIndex: 5,
        },
        {
          text: 'Why is data lineage critical for regulatory compliance (e.g., GDPR right to erasure)?',
          options: opts(
            'Lineage tools automatically delete personal data on request',
            'Lineage tells you every table, view, dashboard, and ML model that contains or derives from a specific customer\'s data — enabling you to find and delete all copies when a user exercises their right to be forgotten',
            'Lineage generates the audit logs required by GDPR Article 30',
            'Lineage prevents personal data from leaving your data warehouse'
          ),
          correctAnswer: 'b',
          explanation: 'GDPR right to erasure requires deleting a person\'s data from all systems. Without lineage, you might delete from the raw table but miss derived tables, ML feature stores, or aggregated reports. Lineage maps the complete data flow from source to every derived artifact.',
          orderIndex: 6,
        },
        {
          text: 'What does the data freshness SQL check (CURRENT_TIMESTAMP - MAX(updated_at) > INTERVAL \'25 hours\') monitor?',
          options: opts(
            'Whether the table was created less than 25 hours ago',
            'Whether the most recent record in the table is more than 25 hours old — flagging stale data when an expected daily pipeline has not run or failed silently',
            'The age of the oldest record in the table',
            'Whether the table schema has changed in the last 25 hours'
          ),
          correctAnswer: 'b',
          explanation: 'A daily pipeline should produce data with MAX(updated_at) from today. If it\'s been 25+ hours since the last update, the pipeline likely failed or didn\'t run. This freshness check catches silent pipeline failures before analysts make decisions on stale data.',
          orderIndex: 7,
        },
        {
          text: 'What does a Great Expectations validation result statistics section tell you?',
          options: opts(
            'How many rows were validated and the processing time',
            'The number of evaluated_expectations, successful_expectations, and success rate — allowing you to see overall data quality as a percentage and identify which expectations failed',
            'The statistical distribution of each validated column',
            'Memory usage and execution time for the validation run'
          ),
          correctAnswer: 'b',
          explanation: 'The statistics section shows: total expectations run, how many passed, and the success rate (passed/total). A 95% success rate might be acceptable for exploration; a 99%+ rate is typically required for production pipelines. Failed expectations are listed with details.',
          orderIndex: 8,
        },
        {
          text: 'The business rule check (order_total vs SUM of line items) returns 200 rows with discrepancy > 0.01. What is the most likely root cause?',
          options: opts(
            'The orders table has 200 duplicate records',
            'A pipeline bug: discounts, taxes, shipping fees, or refunds may be applied at the order level but not reflected in individual line items — or line items are being dropped during transformation',
            'Rounding errors in floating-point arithmetic across all 200 orders',
            'The join condition between orders and order_items is incorrect'
          ),
          correctAnswer: 'b',
          explanation: 'Business rule violations (order_total ≠ SUM of items) typically indicate that some component of the total (shipping, tax, discount, refund) is stored at the order level and not decomposed into line items. This is a data modelling issue requiring investigation of what constitutes "order_total."',
          orderIndex: 9,
        },
        {
          text: 'Which tool automatically generates data lineage in a dbt project without any extra configuration?',
          options: opts(
            'Great Expectations — it tracks column-level lineage',
            'dbt itself — the ref() and source() functions create an explicit dependency graph that dbt visualises in the docs UI as a lineage DAG showing how models depend on each other',
            'Apache Airflow — it tracks which tasks write to which tables',
            'DataHub — it must be separately integrated with dbt'
          ),
          correctAnswer: 'b',
          explanation: 'Every ref() and source() call in dbt is a declared dependency. dbt builds a directed acyclic graph from these declarations, which is visualised in dbt docs (dbt docs generate + dbt docs serve) as interactive lineage — showing all models, their dependencies, and their tests.',
          orderIndex: 10,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 30 — Introduction to Apache Spark for Analysts
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-30-apache-spark-intro',
    title:      'Introduction to Apache Spark for Big Data Analytics',
    description:'Process datasets that don\'t fit in memory using Apache Spark — DataFrames, transformations vs actions, partitioning, the Catalyst optimizer, PySpark SQL, and the patterns that make Spark pipelines fast and production-ready.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 130,
    xpReward:   125,
    language:   'python',
    content: `# Introduction to Apache Spark for Big Data Analytics

## What You'll Learn
When a dataset exceeds your machine's RAM — or when processing takes hours in Pandas — Apache Spark is the answer. Spark distributes computation across a cluster, processing terabytes in minutes. This chapter teaches PySpark fundamentals and the patterns that make Spark pipelines production-ready.

---

## 1. What Is Spark?

Apache Spark is a distributed computing framework:

- **Distributed**: data and computation are split across a cluster of machines
- **In-memory**: data is cached in RAM across the cluster (10-100× faster than Hadoop MapReduce)
- **Lazy evaluation**: transformations build a plan; execution only happens at an action
- **Fault-tolerant**: lost partitions are recomputed automatically from lineage

**Spark components:**
\`\`\`
Driver (your Python script)
    ↓  submits tasks
Cluster Manager (YARN / Kubernetes / Databricks)
    ↓  allocates workers
Executors (Worker JVMs that run tasks)
    Each executor has CPU cores + RAM
\`\`\`

---

## 2. SparkSession — Entry Point

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, IntegerType

spark = SparkSession.builder \\
    .appName('revenue_analysis') \\
    .config('spark.sql.adaptive.enabled', 'true') \\
    .config('spark.sql.shuffle.partitions', '200') \\
    .getOrCreate()

# Read data — Spark is lazy: this creates a plan, not actual data
df = spark.read.parquet('s3://bucket/events/2024/')
print(df.count())   # action: triggers execution
\`\`\`

---

## 3. Transformations vs Actions

This is the most important Spark concept:

| Type | Definition | Examples |
|---|---|---|
| **Transformation** | Creates a new DataFrame plan (lazy) | select, filter, join, groupBy, withColumn |
| **Action** | Triggers execution and returns a result | count, show, collect, write, toPandas |

\`\`\`python
# Transformations — lazy, no computation yet
filtered = df.filter(F.col('event_type') == 'purchase')          # transformation
with_revenue = filtered.withColumn('revenue_usd',
                                    F.col('amount') * F.col('fx_rate'))  # transformation
grouped = with_revenue.groupBy('region').agg(
    F.sum('revenue_usd').alias('total_revenue'),
    F.countDistinct('user_id').alias('buyers')
)                                                                 # transformation

# Action — triggers the entire chain of transformations
grouped.show()                    # executes all 3 transformations + aggregation
grouped.write.parquet('/output/') # writes to storage
\`\`\`

---

## 4. Core DataFrame Operations

\`\`\`python
# Reading multiple formats
df_csv     = spark.read.option('header', True).option('inferSchema', True).csv('data/*.csv')
df_parquet = spark.read.parquet('data/events/')
df_json    = spark.read.json('data/logs/*.json')

# Select and rename
df2 = df.select(
    F.col('user_id'),
    F.col('event_timestamp').alias('ts'),
    F.upper(F.col('status')).alias('status_upper'),
    F.to_date('event_timestamp').alias('event_date'),
)

# Filtering
df3 = df2.filter(
    (F.col('event_date') >= '2024-01-01') &
    (F.col('status_upper').isin('SHIPPED', 'DELIVERED'))
)

# New columns with conditional logic
df4 = df3.withColumn(
    'value_tier',
    F.when(F.col('order_total') > 500, 'High')
     .when(F.col('order_total') > 100, 'Mid')
     .otherwise('Low')
)

# Window functions (same concept as SQL)
from pyspark.sql.window import Window
win = Window.partitionBy('user_id').orderBy('ts')
df5 = df4.withColumn('row_number', F.row_number().over(win)) \\
          .withColumn('prev_order_ts', F.lag('ts', 1).over(win))
\`\`\`

---

## 5. Aggregations and Joins

\`\`\`python
# GroupBy aggregation
agg_df = df.groupBy('region', 'product_category').agg(
    F.sum('revenue').alias('total_revenue'),
    F.avg('revenue').alias('avg_revenue'),
    F.countDistinct('user_id').alias('unique_buyers'),
    F.max('order_date').alias('last_order_date'),
    F.percentile_approx('revenue', 0.5).alias('median_revenue')
)

# Joining DataFrames
orders   = spark.read.parquet('orders/')
customers = spark.read.parquet('customers/')

# Broadcast join: use when one side is small (< 2GB)
joined = orders.join(
    F.broadcast(customers),  # broadcast small table to all executors
    on='customer_id',
    how='left'
)
\`\`\`

---

## 6. Spark SQL

\`\`\`python
# Register DataFrames as temp views
df.createOrReplaceTempView('events')
customers.createOrReplaceTempView('customers')

# Run SQL directly
result = spark.sql("""
    SELECT
        c.region,
        DATE_TRUNC('month', e.event_date)   AS month,
        COUNT(DISTINCT e.user_id)            AS mau,
        SUM(e.revenue)                       AS revenue
    FROM events e
    JOIN customers c USING (user_id)
    WHERE e.event_type = 'purchase'
      AND e.event_date >= '2024-01-01'
    GROUP BY 1, 2
    ORDER BY 2, 4 DESC
""")
result.show(20)
\`\`\`

---

## 7. Partitioning & Performance

\`\`\`python
# Check current partitions
print(f"Number of partitions: {df.rdd.getNumPartitions()}")

# Repartition for even data distribution (expensive — does a shuffle)
df_even = df.repartition(200, 'region')

# Coalesce: reduce partitions WITHOUT shuffle (cheap, output only)
df_small = df.coalesce(8)

# Cache frequently reused DataFrames
df.cache()   # or df.persist(StorageLevel.MEMORY_AND_DISK)
df.count()   # trigger caching
# ... multiple operations on df ...
df.unpersist()  # release memory when done

# Write with partitioning (creates folder structure for partition pruning)
result.write.mode('overwrite') \\
    .partitionBy('region', 'year', 'month') \\
    .parquet('s3://bucket/revenue_by_region/')
\`\`\`

---

## 8. The Catalyst Optimizer

Spark's Catalyst optimizer automatically rewrites your query plan for efficiency:
- **Predicate pushdown**: moves filters as early as possible
- **Column pruning**: reads only needed columns from Parquet
- **Join reordering**: puts the smallest table on the right
- **Broadcast join detection**: automatically broadcasts small tables

View the execution plan:
\`\`\`python
# See the optimised physical plan
df.filter(F.col('status') == 'delivered') \\
  .select('user_id', 'revenue') \\
  .explain(mode='formatted')
\`\`\`

---

## 9. Spark vs Pandas — When to Use Each

| Scenario | Use |
|---|---|
| Data < 1 GB, on one machine | Pandas (simpler, faster startup) |
| Data 1–10 GB, complex aggregations | Pandas + chunking, or Spark |
| Data > 10 GB, joins across multiple large tables | Spark |
| Real-time streaming | Spark Structured Streaming |
| ML on massive datasets | Spark MLlib |
| Quick ad-hoc analysis | BigQuery / DuckDB (SQL, no cluster needed) |

---

## Key Takeaways

- **Transformations are lazy**: they build a plan. **Actions trigger execution** — design your pipeline to minimise the number of actions.
- **Broadcast small tables** in joins — prevents expensive shuffle of the small side across all nodes.
- **Cache DataFrames** that are reused multiple times in the same pipeline — avoids recomputation.
- **Partition your output** by date/region for downstream query efficiency.
- **Spark SQL** lets you use familiar SQL syntax on distributed DataFrames — same mental model as BigQuery.
- The **Catalyst optimizer** improves most plans automatically, but explicit partitioning and broadcast hints give further control.
`,
    codeExample: `from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window
import pandas as pd
import numpy as np

# ── Local Spark session (for learning; use cluster in production) ─────────
spark = SparkSession.builder \\
    .appName('retail_analytics') \\
    .master('local[*]') \\
    .config('spark.sql.adaptive.enabled', 'true') \\
    .getOrCreate()
spark.sparkContext.setLogLevel('ERROR')

# ── Create sample data ───────────────────────────────────────────────────
rng = np.random.default_rng(42)
n = 500_000
pdf = pd.DataFrame({
    'order_id':   range(n),
    'user_id':    rng.integers(1, 10000, n),
    'region':     rng.choice(['NA','EU','APAC','LATAM'], n),
    'product':    rng.choice(['Widget','Gadget','Service'], n),
    'revenue':    np.abs(rng.normal(120, 80, n)),
    'order_date': pd.date_range('2023-01-01', periods=n, freq='6s')
                    .strftime('%Y-%m-%d'),
})

df = spark.createDataFrame(pdf)
df.cache()
print(f"Partitions: {df.rdd.getNumPartitions()} | Rows: {df.count():,}")

# ── Revenue analysis ─────────────────────────────────────────────────────
monthly = df.withColumn('month', F.substring('order_date', 1, 7)) \\
            .groupBy('region', 'month') \\
            .agg(
                F.sum('revenue').alias('total_revenue'),
                F.countDistinct('user_id').alias('buyers'),
                F.count('order_id').alias('orders'),
                F.avg('revenue').alias('avg_order_value')
            ) \\
            .orderBy('month', F.desc('total_revenue'))

monthly.show(12, truncate=False)

# ── Top 10 users by revenue using window function ─────────────────────
win = Window.partitionBy('region').orderBy(F.desc('user_revenue'))
top_users = (df.groupBy('region', 'user_id')
               .agg(F.sum('revenue').alias('user_revenue'))
               .withColumn('rank', F.rank().over(win))
               .filter(F.col('rank') <= 3))
top_users.show(12)

df.unpersist()
spark.stop()`,
    quiz: {
      title: 'Introduction to Apache Spark for Big Data Analytics — Quiz',
      questions: [
        {
          text: 'What is "lazy evaluation" in Apache Spark?',
          options: opts(
            'Spark delays evaluation until the cluster has enough resources',
            'Transformations (filter, select, join) build an execution plan without computing anything. Execution only happens when an action (count, show, write) is called — allowing Spark to optimise the entire plan before running it.',
            'Spark evaluates columns lazily, reading them only when accessed',
            'Worker nodes defer task execution until the driver sends a trigger signal'
          ),
          correctAnswer: 'b',
          explanation: 'Lazy evaluation separates plan construction from execution. When you call df.filter().groupBy().agg(), Spark just records the intent. When you call .show() or .write(), Spark optimises the entire chain (predicate pushdown, column pruning, join reordering) and executes it in one pass.',
          orderIndex: 1,
        },
        {
          text: 'Which of the following is an ACTION in Spark (triggers execution)?',
          options: opts(
            'df.filter(F.col("status") == "shipped")',
            'df.count()',
            'df.withColumn("total", F.col("qty") * F.col("price"))',
            'df.groupBy("region").agg(F.sum("revenue"))'
          ),
          correctAnswer: 'b',
          explanation: 'count() triggers execution across the cluster and returns a Python integer — it\'s an action. filter(), withColumn(), and groupBy().agg() are transformations — they add steps to the plan but produce no result until an action is called.',
          orderIndex: 2,
        },
        {
          text: 'When should you use F.broadcast(small_df) in a Spark join?',
          options: opts(
            'Always — broadcast joins are always faster than shuffle joins',
            'When one DataFrame is small enough to fit in each executor\'s memory (typically < 2 GB) — broadcasting sends the entire small table to every node, eliminating the expensive shuffle of the small side',
            'When both DataFrames are the same size',
            'When joining on string columns rather than integer IDs'
          ),
          correctAnswer: 'b',
          explanation: 'By default, Spark shuffles both tables by join key across the network (expensive for large tables). With broadcast, the small table is sent to every executor once — each executor can then join locally without network communication for the small side.',
          orderIndex: 3,
        },
        {
          text: 'What is the difference between repartition(200) and coalesce(4) in Spark?',
          options: opts(
            'repartition increases partitions; coalesce decreases them — both involve a shuffle',
            'repartition fully shuffles data across the cluster to create N even partitions (expensive). coalesce reduces partitions by combining existing ones WITHOUT a shuffle (cheap, but less even distribution).',
            'repartition is for reading; coalesce is for writing',
            'They are equivalent — coalesce is just a shorthand for repartition'
          ),
          correctAnswer: 'b',
          explanation: 'repartition triggers a full shuffle — every record may move to a different node. coalesce merges adjacent partitions without moving data between nodes — much cheaper but may create uneven partition sizes. Use coalesce for reducing before writing; repartition when you need even distribution for joins.',
          orderIndex: 4,
        },
        {
          text: 'What does df.cache() do and why should you call df.count() immediately after?',
          options: opts(
            'cache() saves the DataFrame to disk; count() loads it back into memory',
            'cache() marks the DataFrame to be stored in memory on the executors. Since Spark is lazy, the cache is not actually populated until an action forces evaluation — calling count() immediately materialises the cache so subsequent operations benefit from it.',
            'cache() creates a checkpoint on HDFS; count() verifies the checkpoint',
            'cache() stores the DataFrame schema; count() is needed to validate row numbers'
          ),
          correctAnswer: 'b',
          explanation: 'df.cache() just marks the intent to cache. The first action that touches the data actually populates the cache. Calling count() right after cache() forces Spark to read and cache the data immediately, so all subsequent operations read from memory — not re-reading from storage.',
          orderIndex: 5,
        },
        {
          text: 'What does .write.partitionBy("region", "year").parquet("s3://bucket/data/") create?',
          options: opts(
            'One Parquet file with region and year as row-level sort keys',
            'A folder hierarchy s3://bucket/data/region=NA/year=2024/part-*.parquet — enabling downstream readers to scan only relevant region/year combinations using partition pruning',
            'A compressed archive of separate Parquet files for each combination',
            'A Parquet file with region and year as the first two columns'
          ),
          correctAnswer: 'b',
          explanation: 'Partition-on-write creates a directory tree matching the partition columns. BigQuery, Spark, Athena, and Hive all support reading these with predicate pushdown — WHERE region=\'NA\' AND year=2024 reads only the relevant folder, skipping all other data.',
          orderIndex: 6,
        },
        {
          text: 'What does spark.sql.adaptive.enabled=true do?',
          options: opts(
            'Enables adaptive retry of failed tasks',
            'Activates Adaptive Query Execution (AQE) — Spark dynamically adjusts the query plan at runtime based on actual data statistics (partition sizes, skew) instead of relying only on estimates at compile time',
            'Enables Spark to adaptively scale the cluster up and down',
            'Automatically tunes spark.sql.shuffle.partitions based on data size'
          ),
          correctAnswer: 'b',
          explanation: 'AQE is one of Spark\'s most impactful performance features. It re-optimises join strategies, automatically coalesces small shuffle partitions, and handles data skew — all based on runtime statistics collected during the first shuffle. Always enable it in production.',
          orderIndex: 7,
        },
        {
          text: 'You have a 500 GB dataset. When should you use DuckDB or BigQuery instead of Spark?',
          options: opts(
            'Never — Spark is always the best choice for any size dataset',
            'DuckDB or BigQuery are better for ad-hoc SQL queries where spinning up a Spark cluster (minutes, cluster cost) would be slower and more expensive than querying directly. Spark shines for complex multi-table ETL at very large scale.',
            'Use BigQuery only when the data is already in GCS',
            'DuckDB handles up to 10 GB; BigQuery up to 1 TB; Spark beyond that'
          ),
          correctAnswer: 'b',
          explanation: 'Spark has significant startup overhead (cluster provisioning, JVM startup) and is most efficient for complex, large-scale ETL. BigQuery and DuckDB are serverless/in-process — instant queries on large data without cluster management. Pick the right tool: BigQuery for cloud SQL at scale, DuckDB for local analytics, Spark for distributed ETL pipelines.',
          orderIndex: 8,
        },
        {
          text: 'In PySpark, F.when(F.col("revenue") > 500, "High").when(F.col("revenue") > 100, "Mid").otherwise("Low") is equivalent to which SQL construct?',
          options: opts(
            'COALESCE(revenue, 500, 100)',
            'CASE WHEN revenue > 500 THEN \'High\' WHEN revenue > 100 THEN \'Mid\' ELSE \'Low\' END',
            'IF(revenue > 500, "High", IF(revenue > 100, "Mid", "Low"))',
            'IIF(revenue, 500, "High", 100, "Mid", "Low")'
          ),
          correctAnswer: 'b',
          explanation: 'F.when() in PySpark maps directly to SQL CASE WHEN. The first matching condition wins (just like SQL). This is vectorised — Spark applies it across the entire column in parallel, not row by row like a Python loop.',
          orderIndex: 9,
        },
        {
          text: 'What makes Apache Spark fault-tolerant?',
          options: opts(
            'Spark continuously backs up all data to HDFS during processing',
            'Spark tracks the lineage of transformations for every partition. If a node fails and a partition is lost, Spark recomputes only that partition from its lineage (input data + transformation steps) rather than restarting the entire job.',
            'Spark replicates all data 3× across the cluster at all times',
            'Spark uses ACID transactions to ensure data integrity on failure'
          ),
          correctAnswer: 'b',
          explanation: 'Spark\'s RDD/DataFrame lineage is the fault tolerance mechanism. Every partition knows its parent partitions and the transformation applied to create it. On node failure, the lost partition is recomputed from the surviving input partitions — no need to restart from scratch.',
          orderIndex: 10,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 6 (Chapters 26–30 — Cloud & Big Data)…');

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

  console.log('\n🎉  AMATEUR Block 6 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
