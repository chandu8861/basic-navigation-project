📍 Bangalore Pathfinder: AI Search Comparison
A high-performance web application that visualizes pathfinding algorithms within the urban geography of Bengaluru. This tool compares Informed (A)* vs. Uninformed (Greedy Best-First) search strategies, simulating an AI agent navigating through over 150 landmarks.

🚀 Key Features
Real-World Simulation: Navigate through 150+ Bengaluru landmarks, from Majestic to Whitefield ITPL.

Dual-Algorithm Visualization:

A* Search (Optimal): Uses the Haversine Heuristic to guarantee the shortest path.

Greedy BFS (Fast): Prioritizes immediate distance to the goal, demonstrating potential sub-optimal routing.

Interactive Analytics Dashboard: Real-time metrics comparing total distance (km) and "nodes explored" to show algorithm efficiency.

Dual-View Display:

Geographic Map: Built with Leaflet.js for real-world orientation.

Mathematical Graph: A D3.js force-directed simulation showing the "state-space" web of the city.

Color-Coded Path Logic:

🔵 Blue: A* Optimal Path.

🟢 Green: Greedy Path.

⚪ White: Consensus (when both algorithms choose the same optimal route).

🛠️ Tech Stack
Backend (The Brain)
FastAPI: High-performance Python framework for algorithm execution.

Algorithms: Custom implementation of A* and Greedy Search using priority queues.

Data Structures: Graph represented via JSON adjacency lists.

Frontend (The Visuals)
React.js: Component-based architecture for the dashboard UI.

D3.js: Physics-based node simulation with animated dashed links and floating labels.

Leaflet.js: Interactive geographical mapping and polyline path rendering.

CSS3: Cyber-tech dark theme with glassmorphism and neon glowing effects.

🏗️ Project Structure
Plaintext
Bangalore-Pathfinder/
├── backend/
│   ├── main.py            # FastAPI Server & API Routes
│   ├── algorithms.py      # Search Logic (A* & Greedy)
│   └── bangalore_map.json # 150+ Nodes (Lat/Lng) & Connections
├── frontend/
│   ├── src/
│   │   ├── components/    
│   │   │   ├── MapView.jsx     # Geographical Leaflet Map
│   │   │   ├── GraphView.jsx   # D3.js Simulation
│   │   │   └── Dashboard.jsx   # Performance Analytics
│   │   ├── App.jsx        # Application Controller & State
│   │   └── App.css        # Neon Styling & Layout
│   └── index.css          # Global Reset & Body Styles
🚦 Getting Started
1. Prerequisites
Python 3.10+

Node.js & npm

2. Setup Backend
Bash
cd backend
pip install fastapi uvicorn
python main.py
3. Setup Frontend
Bash
cd frontend
npm install
npm run dev
Open http://localhost:5173 in your browser.

🧠 AI Concepts Implemented
This project serves as a practical demonstration of core Artificial Intelligence principles:

Heuristic Functions: Utilizing the Haversine formula to calculate the "as-the-crow-flies" distance.

Optimal vs. Complete Search: Proving that A* is both optimal and complete, whereas Greedy BFS can be trapped in sub-optimal loops.

Efficiency Analysis: Visualizing the "Open Set" and "Explored Set" through the nodes explored metric.

👨‍💻 Author
Chandu S

Affiliated with Bangalore Institute of Technology.
