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
  // CHAPTER 31 — Interactive Visualizations with Plotly & Dash
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-31-plotly-dash',
    title:      'Interactive Visualizations with Plotly & Dash',
    description: 'Build publication-quality interactive charts with Plotly and deploy live analytics dashboards using Dash — the skills that make your insights self-serve.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 131,
    xpReward:   120,
    language:   'python',
    codeExample: `import plotly.express as px
from dash import Dash, dcc, html, Input, Output

# ── Plotly Express: animated scatter ──
df = px.data.gapminder()
fig = px.scatter(
    df, x="gdpPercap", y="lifeExp",
    size="pop", color="continent",
    hover_name="country", log_x=True,
    animation_frame="year", size_max=55,
    range_x=[100, 100_000], range_y=[25, 90],
    title="World Development 1952–2007",
)

# ── Minimal Dash App ──
app = Dash(__name__)
app.layout = html.Div([
    dcc.Slider(id="year", min=1952, max=2007, step=5, value=2007),
    dcc.Graph(id="chart"),
])

@app.callback(Output("chart","figure"), Input("year","value"))
def update(year):
    return px.scatter(df[df.year==year], x="gdpPercap", y="lifeExp",
                      size="pop", color="continent", log_x=True)

app.run(debug=True)`,
    content: `# Interactive Visualizations with Plotly & Dash

Static charts printed in a slide deck are one-way communication. Interactive charts let stakeholders explore data themselves — filtering, zooming, hovering for tooltips — which dramatically increases the chance they act on your work.

## Why Plotly?

Plotly is the industry-standard Python library for interactive charts. It renders in the browser using WebGL or SVG, which means:
- Charts work in Jupyter, VS Code, web apps, and exported HTML files
- No extra installation for viewers (just open the HTML)
- Built-in zoom, pan, lasso select, and hover tooltips

## Plotly Express vs Graph Objects

| API | Use when |
|-----|----------|
| \`plotly.express\` (px) | Quick, high-level, one-liner charts |
| \`plotly.graph_objects\` (go) | Full control, multi-trace, complex layouts |

\`\`\`python
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

df = px.data.gapminder()

# Plotly Express: scatter with color + size + animation
fig = px.scatter(
    df.query("year == 2007"),
    x="gdpPercap", y="lifeExp",
    size="pop", color="continent",
    hover_name="country", log_x=True,
    size_max=60,
    title="GDP vs Life Expectancy (2007)",
)
fig.update_layout(template="plotly_white")
fig.show()
\`\`\`

## Animated Charts

\`\`\`python
fig = px.scatter(
    df, x="gdpPercap", y="lifeExp",
    size="pop", color="continent",
    hover_name="country", log_x=True,
    animation_frame="year",
    animation_group="country",
    range_x=[100, 100_000], range_y=[25, 90],
    title="World Development 1952–2007",
)
fig.show()
\`\`\`

## Graph Objects for Full Control

\`\`\`python
fig = go.Figure()

for continent in df["continent"].unique():
    subset = df[df["continent"] == continent].groupby("year")["lifeExp"].mean().reset_index()
    fig.add_trace(go.Scatter(
        x=subset["year"], y=subset["lifeExp"],
        name=continent, mode="lines+markers",
        line=dict(width=2), marker=dict(size=6),
    ))

fig.update_layout(
    title="Average Life Expectancy by Continent",
    xaxis_title="Year", yaxis_title="Life Expectancy",
    template="plotly_white",
    hovermode="x unified",
)
fig.show()
\`\`\`

## Subplot Layouts

\`\`\`python
from plotly.subplots import make_subplots

fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=["Distribution", "Box Plot", "Trend", "Correlation"],
)

df07 = df[df["year"] == 2007]
fig.add_trace(go.Histogram(x=df07["lifeExp"], nbinsx=30), row=1, col=1)
fig.add_trace(go.Box(y=df07["lifeExp"], x=df07["continent"]), row=1, col=2)

trend = df.groupby("year")["lifeExp"].mean().reset_index()
fig.add_trace(go.Scatter(x=trend["year"], y=trend["lifeExp"], mode="lines+markers"), row=2, col=1)

corr = df07[["lifeExp", "gdpPercap", "pop"]].corr()
fig.add_trace(go.Heatmap(z=corr.values, x=corr.columns, y=corr.index,
                          colorscale="RdBu", zmid=0), row=2, col=2)

fig.update_layout(height=700, showlegend=False)
fig.show()
\`\`\`

## Introduction to Dash

Dash is a Python framework (built on Plotly + React + Flask) for building interactive web dashboards with zero JavaScript.

\`\`\`bash
pip install dash
\`\`\`

### Minimal Dash App

\`\`\`python
from dash import Dash, dcc, html, Input, Output

app = Dash(__name__)
df = px.data.gapminder()

app.layout = html.Div([
    html.H1("Gapminder Explorer", style={"textAlign": "center"}),
    dcc.Slider(
        id="year-slider",
        min=df["year"].min(), max=df["year"].max(),
        step=5, value=2007,
        marks={str(y): str(y) for y in df["year"].unique()},
    ),
    dcc.Graph(id="scatter-chart"),
])

@app.callback(
    Output("scatter-chart", "figure"),
    Input("year-slider", "value"),
)
def update_chart(selected_year):
    filtered = df[df["year"] == selected_year]
    fig = px.scatter(
        filtered, x="gdpPercap", y="lifeExp",
        size="pop", color="continent",
        hover_name="country", log_x=True,
        title=f"GDP vs Life Expectancy — {selected_year}",
    )
    fig.update_layout(template="plotly_white")
    return fig

if __name__ == "__main__":
    app.run(debug=True)
\`\`\`

### Dash Callback Mechanics

**Inputs** trigger the callback when they change.
**Outputs** are the component properties the callback updates.
**State** reads a value without triggering.

\`\`\`python
from dash import State

@app.callback(
    Output("output-div", "children"),
    Input("submit-btn", "n_clicks"),
    State("text-input", "value"),
    prevent_initial_call=True,
)
def on_submit(n_clicks, input_value):
    return f"You submitted: {input_value}"
\`\`\`

### Multi-Output Callbacks

\`\`\`python
@app.callback(
    Output("chart-1", "figure"),
    Output("chart-2", "figure"),
    Output("kpi-text", "children"),
    Input("region-dropdown", "value"),
)
def update_all(region):
    data = df[df["continent"] == region]
    fig1 = px.bar(data, x="country", y="gdpPercap")
    fig2 = px.line(data.groupby("year")["lifeExp"].mean().reset_index(), x="year", y="lifeExp")
    kpi = f"Countries: {data['country'].nunique()}"
    return fig1, fig2, kpi
\`\`\`

## Specialty Chart Types

\`\`\`python
df07 = df[df["year"] == 2007]

# Sunburst — hierarchical drill-down
fig = px.sunburst(df07, path=["continent", "country"], values="pop",
                  color="lifeExp", color_continuous_scale="RdYlGn")

# Treemap — nested rectangles sized by value
fig = px.treemap(df07, path=["continent", "country"], values="gdpPercap")

# Parallel coordinates — multivariate
fig = px.parallel_coordinates(df07, color="lifeExp",
    dimensions=["lifeExp", "gdpPercap", "pop"])

# Funnel chart — conversion stages
fig = px.funnel(x=[10000, 7200, 3400, 1100],
                y=["Aware", "Interested", "Evaluating", "Purchasing"])
\`\`\`

## Exporting Charts

\`\`\`python
# Static image (requires kaleido: pip install kaleido)
fig.write_image("chart.png", width=1200, height=700, scale=2)

# Shareable interactive HTML
fig.write_html("dashboard.html", include_plotlyjs="cdn")
\`\`\`

## Best Practices

1. Default to **Plotly Express** — switch to Graph Objects only for multi-trace fine control
2. Use \`template="plotly_white"\` for clean professional charts
3. Set \`hovermode="x unified"\` on time-series so all traces show on hover
4. Use \`prevent_initial_call=True\` on callbacks that shouldn't run on page load
5. Cache expensive computations with \`dcc.Store\` to keep Dash responsive

## Why This Matters for the Job

At Google and Meta, analysts are expected to build *self-serve* dashboards. Plotly + Dash lets you prototype something Tableau-like in hours using Python you already know. A live Dash app on your portfolio URL is a major interview differentiator.`,
    quiz: {
      title: 'Interactive Visualizations with Plotly & Dash Quiz',
      questions: [
        {
          text: 'What is the key difference between Plotly Express and Plotly Graph Objects?',
          options: opts(
            'Express renders static images; Graph Objects renders interactive charts',
            'Express is a high-level API for quick charts; Graph Objects provides full control for complex layouts',
            'Express works only in Jupyter; Graph Objects works only in web apps',
            'Express supports only scatter plots; Graph Objects supports all chart types'
          ),
          correctAnswer: 'b',
          explanation: 'Plotly Express is a high-level, concise API for quick charts; Plotly Graph Objects gives full programmatic control for multi-trace and complex layouts — both render interactive HTML.',
          orderIndex: 0,
        },
        {
          text: 'In a Dash app, what is the role of State compared to Input in a callback?',
          options: opts(
            'State triggers a callback when changed; Input does not trigger callbacks',
            'State reads a value without triggering the callback; Input triggers the callback when changed',
            'State stores data server-side; Input stores data client-side',
            'State is used for text inputs; Input is used for sliders and dropdowns'
          ),
          correctAnswer: 'b',
          explanation: 'In Dash, Input triggers the callback on change while State allows reading a component value without triggering — useful for submit button patterns.',
          orderIndex: 1,
        },
        {
          text: 'Which Plotly parameter adds a time-based play button to animate a scatter plot through years?',
          options: opts('animation_frame', 'time_axis', 'frame_column', 'temporal_key'),
          correctAnswer: 'a',
          explanation: '`animation_frame` in Plotly Express automatically creates a play/pause button and a slider for the specified time column.',
          orderIndex: 2,
        },
        {
          text: "What does `fig.update_layout(hovermode='x unified')` do on a time-series chart?",
          options: opts(
            "Shows only one trace's tooltip at a time",
            'Disables hover entirely on the x-axis',
            "Shows all traces' values in a single tooltip aligned to the x-axis position",
            'Locks the x-axis zoom to prevent panning'
          ),
          correctAnswer: 'c',
          explanation: "`hovermode='x unified'` creates a single combined tooltip showing all traces' values at the hovered x position — essential for comparing multiple time series.",
          orderIndex: 3,
        },
        {
          text: 'Which Plotly chart type displays hierarchical data as nested rectangles sized by a numeric value?',
          options: opts('px.sunburst', 'px.treemap', 'px.icicle', 'px.parallel_categories'),
          correctAnswer: 'b',
          explanation: '`px.treemap` displays hierarchical data as nested rectangles where area represents a numeric value — ideal for budget breakdowns, sales by region/product, etc.',
          orderIndex: 4,
        },
        {
          text: 'How do you export a Plotly figure as a shareable interactive HTML file?',
          options: opts(
            "fig.save('file.html')",
            "fig.export_html('file.html')",
            "fig.write_html('file.html', include_plotlyjs='cdn')",
            "fig.to_html('file.html')"
          ),
          correctAnswer: 'c',
          explanation: "`fig.write_html()` exports a fully interactive chart as a standalone HTML file. `include_plotlyjs='cdn'` keeps the file small by loading Plotly.js from a CDN.",
          orderIndex: 5,
        },
        {
          text: 'What does `prevent_initial_call=True` on a Dash `@app.callback` do?',
          options: opts(
            'Prevents the callback from ever running more than once',
            'Prevents the callback from executing when the page first loads',
            'Prevents two callbacks from running simultaneously',
            'Prevents the Output component from being updated'
          ),
          correctAnswer: 'b',
          explanation: '`prevent_initial_call=True` stops the callback from firing on initial page load — critical for callbacks triggered by a submit button that should not run before user interaction.',
          orderIndex: 6,
        },
        {
          text: 'Which function creates multi-panel subplot layouts in Plotly?',
          options: opts(
            'go.MultiPlot()',
            'px.subplots()',
            'make_subplots() from plotly.subplots',
            'fig.add_subplot()'
          ),
          correctAnswer: 'c',
          explanation: '`make_subplots()` from `plotly.subplots` creates a figure grid of subplots. Traces are added to specific rows and columns with `row=` and `col=` parameters.',
          orderIndex: 7,
        },
        {
          text: 'What package must be installed for `fig.write_image()` to export PNG files?',
          options: opts('plotly-export', 'kaleido', 'orca', 'pillow'),
          correctAnswer: 'b',
          explanation: '`kaleido` is the recommended static image export engine for Plotly. After `pip install kaleido`, `fig.write_image("chart.png")` works natively.',
          orderIndex: 8,
        },
        {
          text: 'Which chart type in Plotly Express shows hierarchical part-to-whole relationships as concentric rings that drill down on click?',
          options: opts('px.pie', 'px.treemap', 'px.sunburst', 'px.funnel'),
          correctAnswer: 'c',
          explanation: '`px.sunburst` uses concentric rings to show hierarchical part-to-whole relationships — clicking a segment drills down, making it ideal for regional sales or budget breakdowns.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 32 — Geospatial Analytics & Mapping
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-32-geospatial-analytics',
    title:      'Geospatial Analytics & Mapping',
    description: 'Analyze location data, build choropleth maps, and perform spatial joins — skills used by logistics, retail, and ride-sharing companies to make geography-aware decisions.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 132,
    xpReward:   120,
    language:   'python',
    codeExample: `import geopandas as gpd
import pandas as pd
import folium, plotly.express as px
from geopy.distance import geodesic

# Build GeoDataFrame from lat/lon
stores = pd.DataFrame({
    "city": ["New York","Los Angeles","Chicago"],
    "revenue": [4.2, 3.8, 2.9],
    "lat": [40.71, 34.05, 41.88],
    "lon": [-74.01,-118.24,-87.63],
})
gdf = gpd.GeoDataFrame(
    stores, crs="EPSG:4326",
    geometry=gpd.points_from_xy(stores.lon, stores.lat),
)

# 20 km delivery zone buffer (must project to metres first)
gdf_m = gdf.to_crs("EPSG:3857")
gdf_m["zone"] = gdf_m.geometry.buffer(20_000)

# Spatial join: customers within each zone
customers_gdf = gpd.GeoDataFrame(..., crs="EPSG:3857")
matched = gpd.sjoin(customers_gdf,
                    gdf_m.set_geometry("zone")[["city","zone"]],
                    how="inner", predicate="within")

# Choropleth with Plotly
fig = px.choropleth(df07, locations="iso_alpha",
    color="gdpPercap", hover_name="country",
    color_continuous_scale="Viridis",
    title="GDP per Capita by Country (2007)")
fig.update_geos(projection_type="natural earth")
fig.show()`,
    content: `# Geospatial Analytics & Mapping

Every business has a geography dimension — which stores perform best, where customers cluster, which delivery routes are efficient. Companies like Uber, DoorDash, and Walmart have entire teams dedicated to geo analytics.

## Core Concepts

| Term | Meaning |
|------|---------|
| **CRS** | Coordinate Reference System — defines how coordinates map to Earth |
| **EPSG:4326** | WGS84 lat/lon — the GPS standard |
| **EPSG:3857** | Web Mercator — used by Google Maps, OpenStreetMap |
| **Shapefile** | Common geospatial vector file format (.shp) |
| **GeoJSON** | JSON-based geospatial format, web-friendly |
| **Point** | Single coordinate (lat, lon) |
| **Polygon** | Enclosed area (country, zip code boundary) |
| **Spatial join** | Join tables based on spatial relationship |

## GeoPandas — Geospatial DataFrames

\`\`\`bash
pip install geopandas folium plotly geopy
\`\`\`

\`\`\`python
import geopandas as gpd
import pandas as pd
import numpy as np

stores = pd.DataFrame({
    "store_id": [1, 2, 3, 4, 5],
    "city": ["New York","Los Angeles","Chicago","Houston","Phoenix"],
    "revenue": [4.2, 3.8, 2.9, 2.1, 1.7],
    "lat": [40.71, 34.05, 41.88, 29.76, 33.45],
    "lon": [-74.01,-118.24,-87.63,-95.37,-112.07],
})

gdf = gpd.GeoDataFrame(
    stores,
    geometry=gpd.points_from_xy(stores.lon, stores.lat),
    crs="EPSG:4326",
)
print(gdf.geometry.type.value_counts())
\`\`\`

### Loading a Built-in World Map

\`\`\`python
world = gpd.read_file(gpd.datasets.get_path("naturalearth_lowres"))

ax = world.plot(figsize=(15, 8), color="lightblue", edgecolor="white")
gdf.plot(ax=ax, color="red", markersize=gdf["revenue"] * 20, alpha=0.7)
ax.set_title("US Store Locations by Revenue")
ax.axis("off")
\`\`\`

## Spatial Joins

\`\`\`python
# Which country does each store fall in?
joined = gpd.sjoin(gdf, world[["name","continent","geometry"]],
                   how="left", predicate="within")
print(joined[["store_id","city","name","continent"]])

# Count stores per country
stores_per_country = joined.groupby("name").size().reset_index(name="store_count")
world_counts = world.merge(stores_per_country, on="name", how="left")
\`\`\`

## Buffer Analysis — Delivery Zones

\`\`\`python
# Project to metres BEFORE buffering
gdf_proj = gdf.to_crs("EPSG:3857")

# 50 km buffer around each store
gdf_proj["delivery_zone"] = gdf_proj.geometry.buffer(50_000)

delivery_zones = gdf_proj.set_geometry("delivery_zone")
delivery_zones.to_crs("EPSG:4326").plot(alpha=0.3, edgecolor="blue")
\`\`\`

## Folium — Interactive Leaflet Maps

\`\`\`python
import folium

m = folium.Map(location=[39.5, -98.35], zoom_start=4, tiles="CartoDB positron")

for _, row in stores.iterrows():
    folium.CircleMarker(
        location=[row["lat"], row["lon"]],
        radius=row["revenue"] * 5,
        color="steelblue", fill=True, fill_opacity=0.7,
        tooltip=f"{row['city']}: \${row['revenue']}M",
        popup=folium.Popup(f"<b>{row['city']}</b><br>Revenue: \${row['revenue']}M"),
    ).add_to(m)

from folium.plugins import HeatMap
HeatMap([[r.lat, r.lon, r.revenue] for _, r in stores.iterrows()]).add_to(m)
m.save("stores_map.html")
\`\`\`

## Choropleth Maps with Plotly

\`\`\`python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")

# Country-level choropleth
fig = px.choropleth(
    df, locations="iso_alpha", color="gdpPercap",
    hover_name="country", color_continuous_scale="Viridis",
    range_color=[0, 50000],
    title="GDP per Capita by Country (2007)",
)
fig.update_geos(projection_type="natural earth")
fig.show()

# US State-level choropleth
us_data = pd.DataFrame({
    "state": ["CA","TX","NY","FL","IL"],
    "sales": [8.2, 6.1, 5.9, 4.3, 3.1],
})
fig = px.choropleth(
    us_data, locations="state", color="sales",
    locationmode="USA-states", scope="usa",
    color_continuous_scale="Blues",
    title="Sales by US State ($ Billions)",
)
fig.show()
\`\`\`

## Distance Calculations

\`\`\`python
from geopy.distance import geodesic

nyc = (40.71, -74.01)
la  = (34.05, -118.24)
dist_km = geodesic(nyc, la).kilometers
print(f"NYC to LA: {dist_km:.0f} km")

# Vectorised distance from HQ to all stores
hq = (37.77, -122.42)
stores["dist_km"] = stores.apply(
    lambda row: geodesic(hq, (row["lat"], row["lon"])).km, axis=1
)
stores["revenue_per_km"] = stores["revenue"] / stores["dist_km"]
print(stores[["city","dist_km","revenue_per_km"]].sort_values("revenue_per_km", ascending=False))
\`\`\`

## H3 Hexagonal Binning

Uber's H3 library divides the globe into hexagonal cells — ideal for density analysis without rectangular-grid distortion.

\`\`\`python
# pip install h3
import h3

np.random.seed(42)
rides = pd.DataFrame({
    "lat": np.random.normal(40.72, 0.05, 1000),
    "lon": np.random.normal(-73.99, 0.07, 1000),
    "fare": np.random.exponential(15, 1000),
})

# Assign H3 cell at resolution 8 (~0.45 km2 per hex)
rides["h3_cell"] = rides.apply(
    lambda row: h3.latlng_to_cell(row["lat"], row["lon"], 8), axis=1
)

cell_stats = rides.groupby("h3_cell").agg(
    ride_count=("fare","count"),
    avg_fare=("fare","mean"),
).reset_index()
print(cell_stats.sort_values("ride_count", ascending=False).head(10))
\`\`\`

## Key Takeaways

- **Always check your CRS** before doing spatial operations — wrong CRS → meaningless results
- **Project to a metric CRS** (EPSG:3857 or local UTM) before calling \`.buffer()\` in metres
- **Folium** = quick interactive maps; best for notebooks and HTML reports
- **Plotly choropleths** = best for coloring countries/states in a web dashboard
- **H3 hexbins** = Uber's tool for density analysis without rectangular-grid distortion
- **Spatial join** replaces nested geodesic-distance loops with a single vectorised call`,
    quiz: {
      title: 'Geospatial Analytics & Mapping Quiz',
      questions: [
        {
          text: 'What EPSG code represents the WGS84 coordinate system used by GPS (standard lat/lon)?',
          options: opts('EPSG:3857', 'EPSG:4326', 'EPSG:32618', 'EPSG:2263'),
          correctAnswer: 'b',
          explanation: 'EPSG:4326 (WGS84) is the standard lat/lon GPS coordinate system. EPSG:3857 is Web Mercator used by Google Maps — distances in EPSG:3857 are in metres, not degrees.',
          orderIndex: 0,
        },
        {
          text: 'Why must you project a GeoDataFrame to EPSG:3857 before calling `.buffer(50000)`?',
          options: opts(
            'Because GeoPandas only accepts integer coordinates',
            'Because EPSG:4326 uses degrees, so buffer(50000) would create 50000-degree circles',
            'Because EPSG:3857 uses metres, so buffer(50000) correctly creates a 50 km zone',
            'Because Folium only renders EPSG:3857 geometries'
          ),
          correctAnswer: 'c',
          explanation: 'EPSG:3857 uses metres. Calling `buffer(50000)` on a projected GeoDataFrame creates a correct 50 km buffer. In EPSG:4326 (degrees), the number would be meaningless.',
          orderIndex: 1,
        },
        {
          text: 'What is a spatial join (`gpd.sjoin`) used for?',
          options: opts(
            'Joining two DataFrames on matching column values like a SQL JOIN',
            'Combining two GeoDataFrames based on spatial relationships (within, intersects, contains)',
            'Concatenating GeoDataFrames vertically',
            'Merging polygon geometries into a single unified shape'
          ),
          correctAnswer: 'b',
          explanation: '`gpd.sjoin()` joins two GeoDataFrames based on spatial predicates — enabling queries like "which customers fall within each store\'s delivery zone."',
          orderIndex: 2,
        },
        {
          text: 'Which library provides `HeatMap` for visualizing point density on an interactive map?',
          options: opts('GeoPandas', 'Shapely', 'Folium', 'Plotly'),
          correctAnswer: 'c',
          explanation: 'Folium wraps Leaflet.js and includes plugin layers like `HeatMap`, `MarkerCluster`, and `TimestampedGeoJson` for rich interactive maps in the browser.',
          orderIndex: 3,
        },
        {
          text: "What parameter in `px.choropleth()` specifies that locations are US state abbreviations (e.g., 'CA', 'TX')?",
          options: opts("scope='usa'", "locationmode='USA-states'", "geo_column='state'", "region_type='us_state'"),
          correctAnswer: 'b',
          explanation: "`locationmode='USA-states'` tells Plotly to interpret the `locations` column as 2-letter US state abbreviations. You typically also set `scope='usa'` to zoom the map.",
          orderIndex: 4,
        },
        {
          text: "What is Uber's H3 library primarily used for in geospatial analytics?",
          options: opts(
            'Routing and turn-by-turn navigation',
            'Dividing the globe into hierarchical hexagonal cells for density analysis',
            'Converting shapefile coordinates to GeoJSON',
            'Calculating Haversine distances between GPS points'
          ),
          correctAnswer: 'b',
          explanation: 'H3 tessellates the globe into hierarchical hexagonal cells. Hexagons have equal area and equal neighbour distances (unlike rectangles), making them ideal for density maps and surge pricing zones.',
          orderIndex: 5,
        },
        {
          text: 'Which function from `geopy.distance` calculates the great-circle distance between two lat/lon coordinates?',
          options: opts('geopy.distance.haversine()', 'geopy.distance.euclidean()', 'geopy.distance.geodesic()', 'geopy.distance.vincenty()'),
          correctAnswer: 'c',
          explanation: '`geodesic()` from geopy uses the Vincenty formula (ellipsoidal Earth model) to compute the true surface distance between two (lat, lon) tuples — more accurate than haversine.',
          orderIndex: 6,
        },
        {
          text: 'What is the main advantage of using a choropleth map over a bar chart for regional data?',
          options: opts(
            'Choropleths are always more accurate than bar charts',
            'Choropleths show spatial patterns and regional clustering that bar charts cannot reveal',
            'Choropleths automatically adjust for population density',
            'Choropleths support more than 1000 data points without clutter'
          ),
          correctAnswer: 'b',
          explanation: 'Choropleth maps encode data into geography, immediately revealing spatial patterns (e.g., coastal vs. inland performance) that are invisible in a sorted bar chart.',
          orderIndex: 7,
        },
        {
          text: 'What does `gpd.points_from_xy(df.lon, df.lat)` return?',
          options: opts(
            'A list of (lat, lon) tuples',
            'A GeoSeries of Shapely Point geometries',
            'A GeoDataFrame with a geometry column',
            'A NumPy array of coordinate pairs'
          ),
          correctAnswer: 'b',
          explanation: '`gpd.points_from_xy()` converts longitude and latitude columns into a GeoSeries of Shapely Point objects, passed to the `geometry=` parameter when constructing a GeoDataFrame.',
          orderIndex: 8,
        },
        {
          text: 'A retail company wants to identify which stores cover the most customers within a 20 km radius. What is the most efficient approach?',
          options: opts(
            'Calculate geodesic distance from every customer to every store using a nested loop',
            'Use a spatial join with 20 km store buffer polygons to match customers within each catchment',
            'Use a SQL BETWEEN clause on latitude and longitude columns',
            'Cluster customers with K-Means and assign the nearest centroid'
          ),
          correctAnswer: 'b',
          explanation: 'Buffer store points (20 km → polygons), then use `gpd.sjoin()` with `predicate="within"` to match customers to store catchments in one vectorised operation — far faster than a nested geodesic loop.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 33 — Advanced Seaborn & Custom Matplotlib Styling
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-33-advanced-seaborn-matplotlib',
    title:      'Advanced Seaborn & Custom Matplotlib Styling',
    description: 'Master FacetGrid, PairGrid, annotations, custom themes, and publication-ready chart design — the difference between a junior and senior analyst\'s visual output.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 133,
    xpReward:   115,
    language:   'python',
    codeExample: `import seaborn as sns
import matplotlib.pyplot as plt
from scipy import stats
import numpy as np

tips = sns.load_dataset("tips")
penguins = sns.load_dataset("penguins").dropna()

# ── FacetGrid small multiples ──
g = sns.FacetGrid(tips, col="day", row="time", height=3, aspect=1.2, sharey=False)
g.map_dataframe(sns.histplot, x="total_bill", kde=True, bins=15)
g.set_titles(col_template="{col_name}", row_template="{row_name}")

# ── PairGrid with different plots per triangle ──
g2 = sns.PairGrid(penguins, vars=["bill_length_mm","flipper_length_mm","body_mass_g"], hue="species")
g2.map_upper(sns.scatterplot, alpha=0.6)
g2.map_lower(sns.kdeplot, fill=True, alpha=0.3)
g2.map_diag(sns.histplot, kde=True)

# ── Custom annotation ──
fig, ax = plt.subplots(figsize=(10, 6))
revenue = [42,38,51,55,48,62,70,65,58,72,80,95]
ax.plot(range(12), revenue, color="#003087", linewidth=2.5)
ax.annotate("Record: $95K", xy=(11, 95), xytext=(8, 88),
    arrowprops=dict(arrowstyle="->", color="coral"), color="coral", fontweight="bold")
ax.spines[["top","right"]].set_visible(False)
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f"\${x:.0f}K"))`,
    content: `# Advanced Seaborn & Custom Matplotlib Styling

Seaborn and Matplotlib are workhorses of Python data visualization. Most analysts know the basics. Senior analysts know how to build *polished*, *reusable*, and *publication-ready* charts that communicate clearly without explanation.

## Seaborn's Two APIs

| Level | Functions | Returns |
|-------|-----------|---------|
| **Figure-level** | \`sns.relplot\`, \`sns.displot\`, \`sns.catplot\`, \`sns.lmplot\` | \`FacetGrid\` object |
| **Axes-level** | \`sns.scatterplot\`, \`sns.histplot\`, \`sns.boxplot\` | \`Axes\` object |

Figure-level functions manage their own figure and accept \`col=\`, \`row=\`, \`hue=\` for automatic faceting.

## FacetGrid — Small Multiples

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

tips = sns.load_dataset("tips")
penguins = sns.load_dataset("penguins").dropna()

g = sns.FacetGrid(tips, col="day", row="time",
                  margin_titles=True, height=3, aspect=1.2, sharey=False)
g.map_dataframe(sns.histplot, x="total_bill", kde=True, bins=15, color="steelblue")
g.set_axis_labels("Total Bill ($)", "Count")
g.set_titles(col_template="{col_name}", row_template="{row_name}")
g.figure.suptitle("Bill Distribution by Day and Time", y=1.02, fontsize=14, fontweight="bold")
plt.tight_layout()
plt.show()
\`\`\`

## PairGrid — Full Pairwise Exploration

\`\`\`python
g = sns.PairGrid(
    penguins,
    vars=["bill_length_mm","bill_depth_mm","flipper_length_mm","body_mass_g"],
    hue="species", diag_sharey=False
)
g.map_upper(sns.scatterplot, alpha=0.6, s=20)
g.map_lower(sns.kdeplot, fill=True, alpha=0.3)
g.map_diag(sns.histplot, kde=True, alpha=0.6)
g.add_legend(title="Species", bbox_to_anchor=(1.05, 0.5))
g.figure.suptitle("Penguin Measurements — Pairwise Analysis", y=1.01)
plt.show()
\`\`\`

## JointGrid — Bivariate + Marginals

\`\`\`python
g = sns.JointGrid(data=tips, x="total_bill", y="tip", marginal_ticks=True)
g.plot_joint(sns.scatterplot, hue=tips["smoker"], alpha=0.6, s=40,
             palette={"Yes":"coral","No":"steelblue"})
g.plot_marginals(sns.histplot, kde=True)

r = tips["total_bill"].corr(tips["tip"])
g.ax_joint.annotate(f"r = {r:.2f}", xy=(0.05, 0.95), xycoords="axes fraction",
    fontsize=12, ha="left", va="top",
    bbox=dict(boxstyle="round,pad=0.3", facecolor="white", alpha=0.8))
plt.show()
\`\`\`

## Custom Color Palettes

\`\`\`python
# Named palettes
print(sns.color_palette("colorblind"))   # Accessible
print(sns.color_palette("husl", 8))      # Evenly spaced hue
print(sns.color_palette("Blues", 5))     # Sequential
print(sns.color_palette("RdYlGn", 7))   # Diverging

# Corporate palette from hex codes
corporate = sns.color_palette(["#003087","#00A3E0","#FF6B35","#4CAF50","#9C27B0"])
sns.set_palette(corporate)
\`\`\`

## Matplotlib Annotations & Callouts

\`\`\`python
fig, ax = plt.subplots(figsize=(10, 6))

months = pd.date_range("2024-01", periods=12, freq="MS")
revenue = [42, 38, 51, 55, 48, 62, 70, 65, 58, 72, 80, 95]

ax.plot(months, revenue, color="#003087", linewidth=2.5, marker="o", markersize=6)
ax.fill_between(months, revenue, alpha=0.1, color="#003087")

# Annotate peak with arrow
max_idx = revenue.index(max(revenue))
ax.annotate(
    f"Record: \${max(revenue)}K",
    xy=(months[max_idx], max(revenue)),
    xytext=(months[max_idx - 2], max(revenue) + 8),
    fontsize=11, fontweight="bold", color="#FF6B35",
    arrowprops=dict(arrowstyle="->", color="#FF6B35", lw=2),
    bbox=dict(boxstyle="round,pad=0.4", facecolor="white", edgecolor="#FF6B35", alpha=0.9),
)

# Campaign launch marker
ax.axvline(months[5], color="gray", linestyle="--", linewidth=1.5, alpha=0.7)
ax.text(months[5], ax.get_ylim()[0] + 1, "  Campaign\n  Launch",
        fontsize=9, color="gray", va="bottom")

# Shaded Q4 region
ax.axvspan(months[8], months[11], alpha=0.07, color="green")
ax.text(months[9], 90, "Q4 Peak", fontsize=9, color="green", ha="center")

ax.set_title("Monthly Revenue 2024", fontsize=15, fontweight="bold", pad=15)
ax.set_ylabel("Revenue", fontsize=11)
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f"\${x:.0f}K"))
ax.grid(axis="y", alpha=0.3, linestyle="--")
ax.spines[["top","right"]].set_visible(False)
plt.tight_layout()
plt.show()
\`\`\`

## Custom Theme Function

\`\`\`python
def apply_company_style(ax, title="", xlabel="", ylabel=""):
    ax.spines[["top","right"]].set_visible(False)
    ax.spines[["left","bottom"]].set_color("#CCCCCC")
    ax.yaxis.grid(True, linestyle="--", alpha=0.5, color="#DDDDDD")
    ax.set_axisbelow(True)
    ax.set_title(title, fontsize=14, fontweight="bold", color="#1A1A2E", pad=12)
    ax.set_xlabel(xlabel, fontsize=11, color="#555555")
    ax.set_ylabel(ylabel, fontsize=11, color="#555555")
    ax.tick_params(colors="#555555", labelsize=10)
    return ax

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
sns.barplot(data=tips, x="day", y="total_bill", hue="sex", ax=axes[0],
            palette=["#003087","#FF6B35"], errorbar=None)
apply_company_style(axes[0], "Average Bill by Day & Gender", "Day", "Avg Bill ($)")

sns.violinplot(data=tips, x="day", y="tip", hue="smoker", split=True, ax=axes[1])
apply_company_style(axes[1], "Tip Distribution by Day", "Day", "Tip ($)")
plt.tight_layout()
plt.show()
\`\`\`

## Advanced Heatmap with Significance Masking

\`\`\`python
from scipy import stats

def corr_pvalues(df):
    cols = df.columns
    pvals = pd.DataFrame(1.0, index=cols, columns=cols)
    for i in range(len(cols)):
        for j in range(len(cols)):
            if i != j:
                _, p = stats.pearsonr(df.iloc[:, i], df.iloc[:, j])
                pvals.iloc[i, j] = p
    return pvals

numeric = tips[["total_bill","tip","size"]]
corr  = numeric.corr()
pvals = corr_pvalues(numeric)
mask  = (pvals >= 0.05)

fig, ax = plt.subplots(figsize=(7, 6))
sns.heatmap(corr, mask=mask, annot=True, fmt=".2f",
            cmap="RdBu_r", center=0, vmin=-1, vmax=1,
            square=True, linewidths=0.5, ax=ax)
ax.set_title("Correlation Matrix (faded = non-significant, p>=0.05)")
plt.tight_layout()
plt.show()
\`\`\`

## Publication-Ready Rules

| Rule | Why it matters |
|------|---------------|
| Remove top/right spines | Reduces chartjunk |
| Grid on y-axis only, light gray | Guides eye without dominating |
| Bold title, muted axis labels | Visual hierarchy |
| Annotate outliers & events | Context = comprehension |
| Match company color palette | Professional consistency |
| Save at \`dpi=200\` | Crisp on retina displays |`,
    quiz: {
      title: 'Advanced Seaborn & Matplotlib Quiz',
      questions: [
        {
          text: "What is the key difference between Seaborn's figure-level and axes-level functions?",
          options: opts(
            'Figure-level functions are faster; axes-level functions are more accurate',
            'Figure-level functions manage their own figure and support faceting; axes-level functions plot onto an existing Axes',
            'Figure-level functions require Matplotlib; axes-level functions are standalone',
            'Figure-level functions only work with DataFrames; axes-level functions accept arrays'
          ),
          correctAnswer: 'b',
          explanation: 'Figure-level functions like `sns.relplot` create their own Figure and support `col=`, `row=` faceting. Axes-level functions like `sns.scatterplot` plot onto a provided Matplotlib Axes.',
          orderIndex: 0,
        },
        {
          text: 'Which Seaborn object lets you set different plots on the diagonal, upper, and lower triangles of a pairwise grid?',
          options: opts('FacetGrid', 'JointGrid', 'PairGrid', 'GridSpec'),
          correctAnswer: 'c',
          explanation: '`sns.PairGrid` lets you independently control the diagonal (`.map_diag()`), upper (`.map_upper()`), and lower (`.map_lower()`) — useful for combining scatter, KDE, and histogram in one view.',
          orderIndex: 1,
        },
        {
          text: "What does `ax.spines[['top', 'right']].set_visible(False)` accomplish?",
          options: opts(
            'Removes the axes borders on all four sides',
            'Removes the top and right border lines, reducing chartjunk for a cleaner look',
            'Moves the axis ticks to the bottom and left only',
            'Hides the tick labels on the top and right axes'
          ),
          correctAnswer: 'b',
          explanation: 'Removing the top and right spines is a standard data visualization best practice (from Edward Tufte\'s chartjunk principle). It directs the viewer\'s attention to the data rather than the frame.',
          orderIndex: 2,
        },
        {
          text: 'Which Matplotlib function places a text annotation with an arrow pointing to a data point?',
          options: opts('ax.text()', 'ax.annotate()', 'ax.label()', 'ax.callout()'),
          correctAnswer: 'b',
          explanation: '`ax.annotate()` places text at `xytext` with an arrow pointing to `xy` (the data point). The `arrowprops` dict controls arrow style, width, and color.',
          orderIndex: 3,
        },
        {
          text: 'What does `ax.axvspan(start, end, alpha=0.1, color="green")` draw on a chart?',
          options: opts(
            'A vertical dashed line at position start',
            'A vertical dashed line at position end',
            'A shaded rectangular region between start and end across the full y-axis',
            'A horizontal band between start and end across the full x-axis'
          ),
          correctAnswer: 'c',
          explanation: '`axvspan` draws a shaded vertical span (rectangle) between two x-axis values — perfect for highlighting a campaign period, Q4, or any event window on a time-series chart.',
          orderIndex: 4,
        },
        {
          text: "What does `sns.color_palette('colorblind')` specifically optimize for?",
          options: opts(
            'High contrast for printing in black and white',
            'Maximizing the number of distinct colors (up to 20)',
            'A palette distinguishable by people with the most common forms of color blindness',
            'Matching the default Matplotlib color cycle'
          ),
          correctAnswer: 'c',
          explanation: "The 'colorblind' palette uses colors chosen to remain distinguishable for people with deuteranopia (red-green color blindness), which affects ~8% of males. Always use accessible palettes.",
          orderIndex: 5,
        },
        {
          text: 'In `sns.JointGrid`, what is the purpose of the marginal plots (`g.plot_marginals()`)?',
          options: opts(
            'To show the bivariate joint distribution of both variables',
            'To show the univariate distribution of each variable individually on the margins',
            'To add a regression line to the main scatter plot',
            'To display summary statistics above and to the right of the main plot'
          ),
          correctAnswer: 'b',
          explanation: 'Marginal plots show the 1D distribution of each variable independently (on the top and right margins), while the central plot shows the 2D joint relationship — together providing a complete picture.',
          orderIndex: 6,
        },
        {
          text: 'What formatter displays y-axis ticks as "$42K" instead of "42000"?',
          options: opts(
            'plt.FuncFormatter(lambda x, _: f"${x/1000:.0f}K") applied via ax.yaxis.set_major_formatter()',
            'ax.yaxis.format = "${x}K"',
            'ax.set_yticklabels(["$0K","$42K",...])',
            'ax.yaxis.set_scale("currency")'
          ),
          correctAnswer: 'a',
          explanation: '`plt.FuncFormatter` accepts a function `(value, tick_position)` → formatted string. This is the standard way to apply custom number formatting (currency, percentages, abbreviations) to axis ticks.',
          orderIndex: 7,
        },
        {
          text: 'Which Seaborn function creates a figure-level plot automatically faceted using `col=` and `row=` parameters?',
          options: opts(
            'sns.scatterplot with facet=True',
            'sns.relplot or sns.catplot (figure-level functions)',
            'sns.FacetGrid.map_dataframe only',
            'plt.subplots with seaborn themes applied'
          ),
          correctAnswer: 'b',
          explanation: 'Figure-level functions like `sns.relplot`, `sns.catplot`, `sns.displot`, and `sns.lmplot` directly accept `col=` and `row=` and internally use `FacetGrid` to create the multi-panel layout.',
          orderIndex: 8,
        },
        {
          text: 'To save a chart that appears sharp on retina/high-DPI screens, which savefig parameter should you increase?',
          options: opts(
            'fig.savefig("chart.png", quality=100)',
            'fig.savefig("chart.png", dpi=200)',
            'fig.savefig("chart.png", resolution="high")',
            'fig.savefig("chart.png", antialiasing=True)'
          ),
          correctAnswer: 'b',
          explanation: '`dpi` (dots per inch) controls image resolution. The default is 100 dpi; setting `dpi=200` or `dpi=300` produces crisp images on retina screens and in print.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 34 — Network Analysis with NetworkX
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-34-network-analysis-networkx',
    title:      'Network Analysis with NetworkX',
    description: 'Model relationships as graphs, compute centrality and community structure, and apply network analysis to fraud detection, recommendation engines, and supply chain problems.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 134,
    xpReward:   115,
    language:   'python',
    codeExample: `import networkx as nx
import pandas as pd
import matplotlib.pyplot as plt

# Build graph from transaction edge list
tx = pd.DataFrame({
    "sender":   ["A","A","B","C","C","D"],
    "receiver": ["B","C","D","A","E","A"],
    "amount":   [500,200,1500,300,800,250],
})
G = nx.from_pandas_edgelist(tx, "sender", "receiver",
    edge_attr="amount", create_using=nx.DiGraph())

# Centrality measures
G_un = nx.karate_club_graph()
deg_cent = nx.degree_centrality(G_un)
bet_cent = nx.betweenness_centrality(G_un, normalized=True)
pagerank  = nx.pagerank(G_un, alpha=0.85)

centrality_df = pd.DataFrame({
    "degree":      deg_cent,
    "betweenness": bet_cent,
    "pagerank":    pagerank,
}).sort_values("betweenness", ascending=False)

# Community detection
from networkx.algorithms.community import greedy_modularity_communities
communities = list(greedy_modularity_communities(G_un))
print(f"Found {len(communities)} communities")

# Shortest path (Dijkstra)
path = nx.dijkstra_path(G_un, 0, 33)
print(f"Path 0->33: {path}")`,
    content: `# Network Analysis with NetworkX

Networks (graphs) are everywhere in analytics — social connections, transaction flows, supply chains, recommendation engines. Graph analytics reveals patterns that table-based analysis completely misses: who are the most influential connectors? Which nodes are critical bottlenecks? Where are the communities?

## Graph Fundamentals

| Concept | Description |
|---------|-------------|
| **Node (vertex)** | An entity (person, product, transaction) |
| **Edge** | A relationship between two nodes |
| **Directed (DiGraph)** | Edges have direction (A→B ≠ B→A) |
| **Undirected (Graph)** | Edges are symmetric (A—B = B—A) |
| **Weighted graph** | Edges have a numeric weight (strength, distance, cost) |
| **Degree** | Number of edges connected to a node |
| **Path** | Sequence of nodes connected by edges |

## Building Graphs with NetworkX

\`\`\`python
import networkx as nx
import pandas as pd
import numpy as np

G = nx.Graph()
G.add_node("Alice", department="Data Science", seniority="senior")
G.add_node("Bob",   department="Engineering",  seniority="mid")
G.add_node("Carol", department="Data Science", seniority="junior")
G.add_node("Dave",  department="Product",      seniority="senior")

edges = [
    ("Alice", "Bob",   {"weight": 12}),
    ("Alice", "Carol", {"weight": 8}),
    ("Alice", "Dave",  {"weight": 5}),
    ("Bob",   "Carol", {"weight": 3}),
]
G.add_edges_from(edges)

print(f"Nodes: {G.number_of_nodes()}  Edges: {G.number_of_edges()}")
print(f"Density: {nx.density(G):.3f}")
\`\`\`

## Building Graphs from DataFrames

\`\`\`python
transactions = pd.DataFrame({
    "sender":   ["A","A","B","C","C","D","E","E"],
    "receiver": ["B","C","D","A","E","A","B","C"],
    "amount":   [500,200,1500,300,800,250,600,400],
})

DG = nx.from_pandas_edgelist(
    transactions, source="sender", target="receiver",
    edge_attr="amount", create_using=nx.DiGraph(),
)
print(nx.info(DG))
\`\`\`

## Centrality Measures

\`\`\`python
G_full = nx.karate_club_graph()

# Degree centrality — how many direct connections?
deg_cent = nx.degree_centrality(G_full)

# Betweenness centrality — how often on shortest paths between others?
bet_cent = nx.betweenness_centrality(G_full, normalized=True)

# Closeness centrality — how quickly can reach all others?
clo_cent = nx.closeness_centrality(G_full)

# PageRank — connected to other important nodes?
pagerank  = nx.pagerank(G_full, alpha=0.85)

centrality_df = pd.DataFrame({
    "degree":      deg_cent,
    "betweenness": bet_cent,
    "closeness":   clo_cent,
    "pagerank":    pagerank,
}).sort_values("betweenness", ascending=False)
print(centrality_df.head(10))
\`\`\`

| Metric | Best for |
|--------|----------|
| **Degree** | Direct influence (most connections) |
| **Betweenness** | Information brokers, bottlenecks |
| **Closeness** | Fastest information spread |
| **PageRank** | Prestige (Google's original algorithm) |

## Community Detection

\`\`\`python
from networkx.algorithms.community import greedy_modularity_communities

communities = list(greedy_modularity_communities(G_full))
print(f"Found {len(communities)} communities")

community_map = {}
for i, comm in enumerate(communities):
    for node in comm:
        community_map[node] = i
nx.set_node_attributes(G_full, community_map, "community")
\`\`\`

## Graph Visualization

\`\`\`python
import matplotlib.pyplot as plt

def visualize_network(G, title="Network Graph"):
    fig, ax = plt.subplots(figsize=(12, 8))
    pos = nx.spring_layout(G, seed=42, k=2)
    sizes = [G.degree(n) * 200 + 300 for n in G.nodes()]
    communities_attr = nx.get_node_attributes(G, "community")
    colors = [communities_attr.get(n, 0) for n in G.nodes()]
    weights = [G[u][v].get("weight", 1) for u, v in G.edges()]
    max_w = max(weights) if weights else 1
    widths = [w / max_w * 4 for w in weights]
    nx.draw_networkx_nodes(G, pos, node_size=sizes, node_color=colors,
                           cmap=plt.cm.Set1, alpha=0.85, ax=ax)
    nx.draw_networkx_edges(G, pos, width=widths, alpha=0.4, edge_color="gray", ax=ax)
    nx.draw_networkx_labels(G, pos, font_size=9, ax=ax)
    ax.set_title(title, fontsize=14, fontweight="bold")
    ax.axis("off")
    plt.tight_layout()
    plt.show()

visualize_network(G_full, "Karate Club — Communities Detected")
\`\`\`

## Fraud Ring Detection (Real-World Application)

\`\`\`python
from networkx.algorithms import bipartite

account_device = pd.DataFrame({
    "account": ["acc1","acc1","acc2","acc2","acc3","acc4","acc4"],
    "device":  ["dev_A","dev_B","dev_A","dev_C","dev_B","dev_D","dev_B"],
})

FG = nx.from_pandas_edgelist(account_device, "account", "device")

# Devices shared by multiple accounts are suspicious
shared_devices = {
    d: list(FG.neighbors(d))
    for d in account_device["device"].unique()
    if len(list(FG.neighbors(d))) > 1
}
print("Suspicious shared devices:", shared_devices)

# Project to account-account graph
accounts = set(account_device["account"])
G_accs = bipartite.projected_graph(FG, accounts)
for comp in nx.connected_components(G_accs):
    if len(comp) > 1:
        print(f"Fraud ring: {comp}")
\`\`\`

## Shortest Path & Graph Metrics

\`\`\`python
# Unweighted shortest path
path = nx.shortest_path(G_full, source=0, target=33)
print(f"Shortest path 0->33: {path}")

# Dijkstra (weighted)
G_w = nx.Graph()
G_w.add_weighted_edges_from([("A","B",4),("A","C",2),("B","D",5),("C","D",1),("D","E",3)])
best_path = nx.dijkstra_path(G_w, "A", "E", weight="weight")
cost = nx.dijkstra_path_length(G_w, "A", "E", weight="weight")
print(f"Cheapest route: {best_path}  cost={cost}")

# Key graph metrics
print(f"Is connected: {nx.is_connected(G_full)}")
print(f"Diameter:     {nx.diameter(G_full)}")
print(f"Avg cluster:  {nx.average_clustering(G_full):.4f}")
\`\`\`

## When to Use Network Analysis

| Business Problem | Graph Approach |
|-----------------|---------------|
| Fraud ring detection | Shared-device bipartite projection |
| Influencer identification | PageRank / betweenness centrality |
| Recommendation engine | User-item bipartite graph |
| Supply chain risk | Betweenness on supplier network |
| Customer segmentation | Community detection |`,
    quiz: {
      title: 'Network Analysis with NetworkX Quiz',
      questions: [
        {
          text: 'What does betweenness centrality measure for a node in a graph?',
          options: opts(
            'The number of direct connections the node has',
            'How quickly the node can reach all other nodes',
            'The fraction of shortest paths between all node pairs that pass through this node',
            'Whether the node belongs to the largest connected component'
          ),
          correctAnswer: 'c',
          explanation: 'Betweenness centrality counts how often a node appears on the shortest path between every pair of other nodes. High betweenness = an information broker or bottleneck.',
          orderIndex: 0,
        },
        {
          text: 'What does `create_using=nx.DiGraph()` do in `nx.from_pandas_edgelist()`?',
          options: opts(
            'Creates an undirected graph where each row becomes a bidirectional edge',
            'Creates a directed graph where each row becomes a one-way edge from source to target',
            'Creates a bipartite graph separating source and target nodes',
            'Creates a weighted graph where weights come from the third column automatically'
          ),
          correctAnswer: 'b',
          explanation: 'Passing `create_using=nx.DiGraph()` creates a directed graph where edges go one way (source → target). Edge A→B and B→A are distinct in a DiGraph.',
          orderIndex: 1,
        },
        {
          text: 'In fraud detection, why is a bipartite account-device graph useful?',
          options: opts(
            'It shows the total transaction amounts for each account',
            'It reveals accounts sharing devices — a hallmark of coordinated fraud rings',
            'It calculates the shortest transfer path between two accounts',
            'It detects accounts with unusually high betweenness centrality'
          ),
          correctAnswer: 'b',
          explanation: 'In account-device bipartite graphs, a device node connected to multiple account nodes indicates those accounts are operated from the same physical device — a strong fraud ring signal.',
          orderIndex: 2,
        },
        {
          text: 'What layout algorithm does `nx.spring_layout(G, seed=42)` implement?',
          options: opts(
            'Places nodes on a circle at equal intervals',
            'Places nodes in concentric shells based on degree',
            'A force-directed layout that repels all nodes and attracts connected ones until equilibrium',
            'A hierarchical layout based on shortest path from a root node'
          ),
          correctAnswer: 'c',
          explanation: 'Spring layout (Fruchterman-Reingold) is force-directed: nodes repel like charged particles while edges attract connected nodes. `seed` makes it reproducible.',
          orderIndex: 3,
        },
        {
          text: 'What does the modularity score measure for a community partition?',
          options: opts(
            'The average degree of nodes within detected communities',
            'The fraction of edges within communities minus the expected fraction in a random graph with the same degree sequence',
            'The ratio of the largest community to the smallest community',
            'The number of edges that cross community boundaries'
          ),
          correctAnswer: 'b',
          explanation: 'Modularity (Q) compares edge density within communities to what you\'d expect by chance. Q closer to 1 means clear community structure; Q near 0 means no better than random.',
          orderIndex: 4,
        },
        {
          text: 'Which centrality metric was originally used by Google PageRank to rank web pages?',
          options: opts(
            'Degree centrality',
            'Betweenness centrality',
            'Closeness centrality',
            'Eigenvector centrality (PageRank)'
          ),
          correctAnswer: 'd',
          explanation: 'PageRank is a variant of eigenvector centrality — a page is important if many important pages link to it. `nx.pagerank(G, alpha=0.85)` implements it with the standard 0.85 damping factor.',
          orderIndex: 5,
        },
        {
          text: 'What does `nx.diameter(G)` return?',
          options: opts(
            'The number of nodes in the largest connected component',
            'The length of the longest shortest path between any two nodes',
            'The maximum degree of any single node',
            'The total number of edges in the graph'
          ),
          correctAnswer: 'b',
          explanation: 'The diameter is the longest of all shortest paths between any pair of nodes. A small diameter means information spreads quickly (the "small world" property).',
          orderIndex: 6,
        },
        {
          text: 'Which function finds the minimum-cost path between two nodes in a weighted graph?',
          options: opts(
            'nx.shortest_path() with weight parameter',
            'nx.dijkstra_path() with weight parameter',
            'nx.minimum_spanning_tree()',
            'nx.astar_path()'
          ),
          correctAnswer: 'b',
          explanation: '`nx.dijkstra_path(G, source, target, weight="weight")` finds the path minimising the sum of edge weights — standard for routing and supply chain optimisation.',
          orderIndex: 7,
        },
        {
          text: 'What does `nx.average_clustering(G)` measure?',
          options: opts(
            'The average number of edges per node',
            'The average fraction of a node\'s neighbours that are also connected to each other',
            'The average shortest path length between all node pairs',
            'The average edge weight across the graph'
          ),
          correctAnswer: 'b',
          explanation: 'The clustering coefficient of a node is the fraction of its neighbour pairs that are directly connected. The average clustering tells you how "cliquish" the network is overall.',
          orderIndex: 8,
        },
        {
          text: 'In a supply chain network, which node has the highest operational risk if removed?',
          options: opts(
            'The node with highest degree centrality',
            'The node with highest betweenness centrality (the critical bottleneck)',
            'The node with highest closeness centrality',
            'The node with the most inbound edges'
          ),
          correctAnswer: 'b',
          explanation: 'High betweenness means goods/information flow through this node on the most routes. Removing it (supplier failure, port closure) disrupts the most supply chain paths — a single point of failure.',
          orderIndex: 9,
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // CHAPTER 35 — Data Storytelling & Executive Communication
  // ══════════════════════════════════════════════════════════════════════
  {
    slug:       'da-am-35-data-storytelling',
    title:      'Data Storytelling & Executive Communication',
    description: 'Turn analysis into action — learn narrative frameworks, chart selection principles, and executive presentation skills that get your insights implemented.',
    difficulty: 'INTERMEDIATE',
    tier:       'AMATEUR',
    orderIndex: 135,
    xpReward:   125,
    language:   'python',
    codeExample: `import matplotlib.pyplot as plt

# The attention-direction technique:
# Color ONE bar boldly; grey out the rest to direct the viewer's eye

channels   = ["Organic","Paid Search","Email","Social","Direct"]
conversion = [4.8, 3.2, 5.1, 1.8, 4.2]
target     = "Email"  # the insight we want to highlight

colors = ["#003087" if c == target else "#CCCCCC" for c in channels]

fig, ax = plt.subplots(figsize=(9, 5))
bars = ax.barh(channels, conversion, color=colors)

for i, (ch, val) in enumerate(zip(channels, conversion)):
    if ch == target:
        ax.text(val + 0.05, i, f"{val:.1f}%", va="center",
                fontsize=12, fontweight="bold", color="#003087")
        ax.annotate("Best channel — reallocate budget here",
                    xy=(val, i), xytext=(val + 0.5, i - 1.2),
                    arrowprops=dict(arrowstyle="->", color="#003087"),
                    color="#003087", fontsize=10)

ax.set_xlabel("Conversion Rate (%)")
ax.set_title("Email Leads in Conversion — Reallocate Budget",
             fontsize=13, fontweight="bold")
ax.spines[["top","right"]].set_visible(False)
plt.tight_layout()
plt.show()`,
    content: `# Data Storytelling & Executive Communication

Every analyst has experienced this: you spent weeks building a rigorous analysis. The numbers are airtight. Then you present to leadership, they nod politely, and nothing changes. The problem was never the analysis — it was the communication.

**Data storytelling** is the art of translating analysis into a compelling narrative that drives decisions. At Google, Microsoft, and McKinsey, this is considered the highest-leverage skill for an analyst.

## The Minto Pyramid Principle

Barbara Minto's Pyramid Principle (developed at McKinsey) is the foundation of executive communication:

\`\`\`
         ┌─────────────────────┐
         │   GOVERNING THOUGHT │  <- Start here: the recommendation
         │   (Answer first)    │
         └─────────────────────┘
                  |
     ┌────────────┼────────────┐
     |            |            |
  Key Point 1  Key Point 2  Key Point 3   <- 3 supporting arguments
     |            |            |
  Evidence     Evidence     Evidence       <- Data, charts, analysis
\`\`\`

**Rule:** Lead with the answer, then provide evidence.

**Wrong:** "We looked at 6 months of data. Conversion rates were 3.2%. Then we segmented by channel..."

**Right:** "We should invest in desktop UX. Mobile converts at half the rate (2.1% vs 4.8%), representing a $2.4M annual opportunity."

## The SCQA Framework

| Step | Purpose | Example |
|------|---------|---------|
| **S — Situation** | Agreed facts, shared context | "Our app has 2M DAU and growing 8% MoM." |
| **C — Complication** | The problem disrupting the situation | "However, 30-day retention dropped from 42% to 31%." |
| **Q — Question** | The natural question that arises | "Why are we losing users and what should we do?" |
| **A — Answer** | Your recommendation | "Implement onboarding redesign targeting Day 3 drop-off." |

## Preattentive Attributes

The human visual system processes certain attributes in under 250ms — *before* conscious attention:

| Attribute | Use case | Example |
|-----------|----------|---------|
| **Color (hue)** | Highlight one category | All bars gray except target = blue |
| **Color (intensity)** | Magnitude in heatmaps | Light blue to dark blue |
| **Size** | Quantity in bubble charts | Bubble area = revenue |
| **Position** | Magnitude comparisons | Bar length, dot position |
| **Enclosure** | Grouping | Box around related metrics |

**Critical principle:** Use only ONE preattentive attribute per visual encoding.

## The Chart Chooser

| If you want to show... | Use this chart |
|-----------------------|---------------|
| Comparison (few items) | Horizontal bar chart |
| Comparison (over time) | Line chart |
| Composition (% of whole) | Stacked bar (avoid pie > 5 slices) |
| Distribution | Histogram or box plot |
| Relationship (2 variables) | Scatter plot |
| Relationship (3 variables) | Bubble chart |
| Geographic patterns | Choropleth or dot map |
| Ranking | Sorted horizontal bar |
| Correlation matrix | Heatmap |

**What to avoid:** 3D charts, pie charts with more than 5 slices, dual y-axes, rainbow color scales.

## The Attention-Direction Technique

\`\`\`python
import matplotlib.pyplot as plt

channels   = ["Organic","Paid Search","Email","Social","Direct"]
conversion = [4.8, 3.2, 5.1, 1.8, 4.2]
target     = "Email"

colors = ["#003087" if c == target else "#CCCCCC" for c in channels]

fig, ax = plt.subplots(figsize=(9, 5))
bars = ax.barh(channels, conversion, color=colors)

for i, (ch, val) in enumerate(zip(channels, conversion)):
    if ch == target:
        ax.text(val + 0.05, i, f"{val:.1f}%", va="center",
                fontsize=12, fontweight="bold", color="#003087")
        ax.annotate("Best channel — reallocate budget here",
                    xy=(val, i), xytext=(val + 0.5, i - 1.2),
                    arrowprops=dict(arrowstyle="->", color="#003087"),
                    color="#003087", fontsize=10)

ax.set_xlabel("Conversion Rate (%)")
ax.set_title("Email Leads in Conversion — Reallocate Budget",
             fontsize=13, fontweight="bold")
ax.spines[["top","right"]].set_visible(False)
ax.axvline(4.0, color="gray", linestyle="--", alpha=0.5, label="Target (4%)")
ax.legend(fontsize=9)
plt.tight_layout()
plt.show()
\`\`\`

## 5-Slide Executive Structure

| Slide | Content | Minto Layer |
|-------|---------|-------------|
| 1. **Headline** | One-sentence recommendation in the title | Governing thought |
| 2. **Context** | Current state + what changed | Situation + Complication |
| 3. **Diagnosis** | Root cause analysis (the "why") | Key points |
| 4. **Recommendation** | Specific action + projected ROI | Answer |
| 5. **Next Steps** | Owner, timeline, success metric | Evidence |

**Slide titles must be insights, not topics:**

| Weak (topic) | Strong (insight) |
|-------------|-----------------|
| "Conversion Rates" | "Mobile Conversion Is Half Desktop — Fix the UX" |
| "Q3 Revenue Analysis" | "Q3 Revenue Missed 8% Due to EMEA Underperformance" |
| "User Retention" | "Day-3 Drop-Off Is Our Biggest Retention Lever" |

## Executive Communication Rules

**Rule 1: The "So What?" test**
After every sentence, ask "So what?" If you can't answer, cut it.

**Rule 2: One chart, one message**
Every chart needs a bolded headline stating the conclusion, not just the topic.

**Rule 3: Numbers need context**
"Conversion is 3.2%" means nothing alone.
"Conversion is 3.2% — down 0.8pp YoY, costing ~$1.2M annually" tells a story.

**Rule 4: Confidence matters**
State uncertainty explicitly: "We're 90% confident that..." or "This projection assumes flat seasonality."

**Rule 5: Recommend, don't just describe**
"Churn increased 2pp" → "Recommend a win-back campaign targeting 60-day inactive users — projected to recover 800 users at $45 LTV = $36K ARR."

## The Data Narrative Arc

\`\`\`
Hook → Context → Tension → Insight → Recommendation → Call to Action
\`\`\`

- **Hook:** "We're leaving $2.4M on the table every year."
- **Context:** "Our app has strong top-of-funnel — 500K installs this quarter."
- **Tension:** "But 68% of users churn within 7 days, mostly at the signup wall."
- **Insight:** "Users who complete onboarding have 4x higher LTV — but only 32% finish."
- **Recommendation:** "Remove mandatory account creation on Day 1."
- **Call to Action:** "Approve 2-sprint engineering effort. I'll track D7 retention weekly."

## Stakeholder Tailoring

| Audience | What they care about | How to adapt |
|----------|---------------------|--------------|
| **C-Suite / Board** | Strategy, ROI, risk | Lead with $ impact, one-slide summary |
| **Product Manager** | User behavior, feature impact | Funnel data, A/B results, retention curves |
| **Engineering** | Implementation details | Data pipelines, error rates, technical metrics |
| **Marketing** | Campaign performance | CAC, ROAS, channel mix |
| **Finance** | Unit economics | LTV/CAC, cohort P&L, confidence intervals |

## Pre-Presentation Checklist

- [ ] Does the first slide state the recommendation (not just the topic)?
- [ ] Does every chart have a headline that states the insight?
- [ ] Is the key number put in context (vs target, vs prior period)?
- [ ] Have I stated uncertainty honestly?
- [ ] Is there a concrete next step with an owner?
- [ ] Can a busy executive understand the main point in 30 seconds?

## The Career Truth

Technical skills get you hired. Communication skills get you promoted. The analysts who advance fastest are the ones who frame insights in terms of business impact (revenue, cost, risk), build stakeholder trust by being reliable and honest, and make leadership look good by solving the right problems proactively.`,
    quiz: {
      title: 'Data Storytelling & Executive Communication Quiz',
      questions: [
        {
          text: 'According to the Minto Pyramid Principle, how should an executive presentation be structured?',
          options: opts(
            'Start with raw data, build to analysis, then conclude with the recommendation',
            'Start with the recommendation/conclusion, then provide supporting arguments and evidence',
            'Start with methodology, present findings, then ask the audience to interpret',
            'Present three equal alternatives and let executives choose the best one'
          ),
          correctAnswer: 'b',
          explanation: 'The Minto Pyramid Principle says: lead with the answer (governing thought), then support it with key points, then evidence. Executives make decisions — they should not wait until slide 15 for the recommendation.',
          orderIndex: 0,
        },
        {
          text: "In the SCQA framework, what does 'C' (Complication) represent?",
          options: opts(
            'The complex methodology used in the analysis',
            'The confidence interval around the key metric',
            'The problem or change that disrupts the agreed situation and creates urgency to act',
            'The competitor context that benchmarks your performance'
          ),
          correctAnswer: 'c',
          explanation: "Complication is the tension that creates urgency — the 'however' or 'but' that shows why the situation requires action. Without a clear complication, there's no compelling reason for the audience to care.",
          orderIndex: 1,
        },
        {
          text: "What are 'preattentive attributes' in data visualization?",
          options: opts(
            'Chart titles and axis labels that must be read before interpreting data',
            'Visual properties (color, size, position) processed by the visual system in under 250ms without conscious thought',
            'Interactive filters applied before a chart renders',
            'Accessibility features like alt text added before publishing'
          ),
          correctAnswer: 'b',
          explanation: 'Preattentive attributes are processed in parallel by the visual cortex before conscious attention. Using them strategically directs viewer attention to the key insight instantly.',
          orderIndex: 2,
        },
        {
          text: 'Why should you avoid dual y-axes in professional data visualization?',
          options: opts(
            'Dual y-axes are not supported by most charting libraries',
            'They require too much chart space and shrink the data area',
            'They can mislead viewers by making any two trends appear correlated depending on axis scaling',
            'They violate accessibility guidelines for color-blind users'
          ),
          correctAnswer: 'c',
          explanation: 'By independently scaling each y-axis, you can make any two time series appear to move together or apart — the visual correlation is controlled by the axis ranges, not the data. Use two separate charts instead.',
          orderIndex: 3,
        },
        {
          text: "What is the 'So What?' test in data communication?",
          options: opts(
            'A statistical significance test applied before reporting a metric',
            'After each statement, ask whether the audience can derive an actionable insight — if not, cut or reframe it',
            "A user research technique where stakeholders rate chart clarity on a 1-5 scale",
            'A final proofreading check for grammatical errors in slide titles'
          ),
          correctAnswer: 'b',
          explanation: "The 'So What?' test forces you to ensure every statement serves the narrative. If '3.2% conversion rate' cannot answer 'So what?', add context: 'down 0.8pp YoY, costing $1.2M annually'.",
          orderIndex: 4,
        },
        {
          text: 'Which slide title is stronger from an executive communication perspective?',
          options: opts(
            'Q3 Revenue Analysis',
            'Revenue Trends and Channel Performance',
            'Q3 Revenue Missed by 8% — EMEA Requires Immediate Action',
            'Financial Summary for Q3 FY2024'
          ),
          correctAnswer: 'c',
          explanation: "Strong insight titles state the finding and implication, not just the topic. 'Q3 Revenue Missed by 8% — EMEA Requires Immediate Action' tells executives exactly what happened and what to do.",
          orderIndex: 5,
        },
        {
          text: 'When presenting to a C-Suite / Board audience, what should you lead with?',
          options: opts(
            'The data collection methodology and sample sizes',
            'The technical tools and models used in the analysis',
            'The business impact in dollars, risk, or strategic importance',
            'A detailed breakdown of analysis steps in chronological order'
          ),
          correctAnswer: 'c',
          explanation: 'C-Suite audiences care about strategy, ROI, and risk. Lead with the dollar impact or strategic implication — one-slide summary, recommendation first. Methodology goes in the appendix.',
          orderIndex: 6,
        },
        {
          text: "What is wrong with presenting '3.2% conversion rate' without additional context?",
          options: opts(
            'The number needs to be normalized per session before presenting',
            'It is statistically meaningless without a confidence interval',
            'Without a benchmark or trend, the audience cannot judge whether 3.2% is good, bad, or concerning',
            'Conversion rates should be expressed as ratios, not percentages'
          ),
          correctAnswer: 'c',
          explanation: "Numbers without context are noise. '3.2% conversion — down 0.8pp YoY vs 4.0% industry benchmark, costing ~$1.2M annually' gives executives what they need to judge severity and prioritize action.",
          orderIndex: 7,
        },
        {
          text: 'In the attention-direction technique, what is the most effective way to highlight one key bar among many?',
          options: opts(
            'Make the highlighted bar taller by changing the y-axis scale',
            'Color all bars differently using a rainbow palette',
            'Color only the key bar in a bold color while all others are light gray',
            'Add a 3D effect to the highlighted bar'
          ),
          correctAnswer: 'c',
          explanation: 'Coloring one bar while greying out the rest uses the preattentive attribute of color hue to immediately direct the eye to the insight — this is the most powerful single-chart design technique.',
          orderIndex: 8,
        },
        {
          text: "What distinguishes a senior analyst's recommendation from a junior analyst's finding?",
          options: opts(
            'A senior analyst uses more complex statistical models',
            'A senior analyst describes the problem in more technical detail',
            'A senior analyst translates findings into a specific recommended action with projected business impact',
            'A senior analyst includes more charts and data tables in the report'
          ),
          correctAnswer: 'c',
          explanation: "Describing is junior ('churn increased 2pp'). Recommending is senior ('run a win-back campaign targeting 60-day inactive users, projected to recover 800 users at $45 LTV = $36K ARR'). Impact quantification turns analysis into decisions.",
          orderIndex: 9,
        },
      ],
    },
  },

]; // end CHAPTERS

// ─── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding AMATEUR Block 7 (Chapters 131–135 — Advanced Visualization & Storytelling)…');

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

  console.log('\n🎉  AMATEUR Block 7 seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
