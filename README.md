# 🗺️ Bangalore Pathfinder: AI Search Comparison

> **Visualizing intelligent navigation through the urban fabric of Bengaluru — comparing optimal vs. greedy pathfinding across 150+ real-world landmarks.**

---

## 📌 Overview

**Bangalore Pathfinder** is a full-stack AI visualization tool that simulates an intelligent agent navigating Bengaluru's city graph. It provides a side-by-side comparison of two core AI search strategies — **A\* (Informed Search)** and **Greedy Best-First Search (Uninformed)** — demonstrating key differences in optimality, efficiency, and exploration behavior.

Built as a practical demonstration of foundational AI concepts from *Russell & Norvig's Artificial Intelligence: A Modern Approach*, this project bridges academic theory and real-world geography.

---

## ✨ Features

### 🧠 Dual-Algorithm Engine
| Feature | A\* Search | Greedy BFS |
|---|---|---|
| **Strategy** | Informed (f = g + h) | Uninformed (f = h only) |
| **Heuristic** | Haversine distance to goal | Haversine distance to goal |
| **Optimality** | ✅ Guaranteed shortest path | ❌ May produce sub-optimal routes |
| **Completeness** | ✅ Always finds a path if one exists | ⚠️ Can get trapped in local optima |
| **Use Case** | Accuracy-first navigation | Speed-first exploration |

### 🗺️ Dual-View Display
- **Geographic Map** — Built with [Leaflet.js](https://leafletjs.com/), rendering real Bengaluru coordinates with polyline paths overlaid on interactive tile maps.
- **Mathematical Graph** — A [D3.js](https://d3js.org/) force-directed simulation exposing the city's state-space web: nodes, edges, and algorithm-explored frontiers, animated in real time.

### 📊 Interactive Analytics Dashboard
Live performance metrics update with every search run:
- **Total Distance (km)** — Path length for each algorithm
- **Nodes Explored** — A proxy for computational cost
- **Path Length (hops)** — Number of intermediate landmarks traversed

### 🎨 Color-Coded Path Rendering
| Color | Meaning |
|---|---|
| 🔵 Blue | A\* Optimal Path |
| 🟢 Green | Greedy BFS Path |
| ⚪ White | Consensus Path (both algorithms agree) |

### 🏙️ 150+ Bengaluru Landmarks
From **Kempegowda Bus Station (Majestic)** to **Whitefield ITPL**, the graph covers major localities, tech corridors, transit hubs, and cultural nodes across the city.

---

## 🛠️ Tech Stack

### Backend
| Tool | Role |
|---|---|
| **FastAPI** | High-performance REST API server |
| **Python 3.10+** | Algorithm logic and data processing |
| **Priority Queue (heapq)** | Efficient open-set management for A\* and Greedy |
| **Haversine Formula** | Geographic heuristic computation |

### Frontend
| Tool | Role |
|---|---|
| **React.js** | Component-based UI architecture |
| **D3.js** | Physics-based force simulation & graph rendering |
| **Leaflet.js** | Interactive geographic map with tile layers |
| **CSS3** | Cyber-tech dark theme with glassmorphism & neon glow effects |

---

## 🏗️ Project Structure

```
Bangalore-Pathfinder/
│
├── backend/
│   ├── main.py               # FastAPI server & API route definitions
│   ├── algorithms.py         # A* and Greedy BFS implementations
│   └── bangalore_map.json    # 150+ nodes (lat/lng) & adjacency list
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── MapView.jsx       # Leaflet geographic map component
    │   │   ├── GraphView.jsx     # D3.js force-directed graph component
    │   │   └── Dashboard.jsx     # Real-time performance analytics panel
    │   ├── App.jsx               # Application state controller & router
    │   └── App.css               # Neon styling, glassmorphism, animations
    └── index.css                 # Global CSS reset & body configuration
```

---

## 🚦 Getting Started

### Prerequisites
- Python **3.10+**
- Node.js **18+** & npm

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bangalore-pathfinder.git
cd bangalore-pathfinder
```

### 2. Set Up the Backend
```bash
cd backend
pip install fastapi uvicorn
python main.py
```
The API server starts at `http://localhost:8000`.

> **Tip:** Visit `http://localhost:8000/docs` for the auto-generated Swagger UI to explore API endpoints interactively.

### 3. Set Up the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧠 AI Concepts Demonstrated

This project is a working implementation of concepts from classical AI search theory:

### Heuristic Functions
The **Haversine formula** computes great-circle distance between two geographic coordinates, serving as an **admissible and consistent heuristic** — it never overestimates the true cost, satisfying A\*'s optimality condition.

### Informed vs. Uninformed Search
- **A\*** evaluates nodes by `f(n) = g(n) + h(n)` — balancing the cost-so-far with the estimated cost-to-goal. This guarantees the optimal path.
- **Greedy BFS** evaluates nodes by `f(n) = h(n)` alone — making locally optimal choices that may lead to globally sub-optimal routes.

### Frontier & Explored Set Visualization
The **nodes explored** metric exposes the size of the explored set at termination, providing an intuitive window into each algorithm's search efficiency.

### Optimality vs. Completeness Trade-off
By running both algorithms on identical source-destination pairs, users can directly observe cases where Greedy BFS reaches the goal faster but via a longer route — a textbook illustration of the **optimality-efficiency trade-off** in AI search.

---
## 👨‍💻 Author

**Chandu S**  
B.E. Artificial Intelligence & Machine Learning  
Bangalore Institute of Technology (BIT), Bengaluru

---

<div align="center">
  <sub>Built with ❤️ as a demonstration of AI search algorithms on real-world Bengaluru geography.</sub>
</div>
