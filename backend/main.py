import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from algorithms import a_star_search, greedy_search

app = FastAPI()

# Allow the React frontend to communicate with the Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Bangalore Map Data once when the server starts
with open("bangalore_map.json", "r") as f:
    MAP_DATA = json.load(f)

@app.get("/map-data")
def get_map():
    """Returns the full list of 150+ nodes and links for visualization."""
    return MAP_DATA

@app.get("/find-path")
def find_path(start: str, end: str, mode: str = "car"):
    """Runs both algorithms and returns a comparison report."""
    
    # Run A* Logic
    a_star_path, a_star_dist, a_star_nodes = a_star_search(MAP_DATA, start, end)
    
    # Run Greedy Logic
    greedy_path, greedy_dist, greedy_nodes = greedy_search(MAP_DATA, start, end)
    
    # Calculate Time (Mins) based on speed: Car = 40km/h, Walk = 5km/h
    speed = 40 if mode == "car" else 5
    
    def calc_time(dist):
        return round((dist / speed) * 60) if dist else 0

    return {
        "algorithms": {
            "a_star": {
                "path": a_star_path,
                "distance": round(a_star_dist, 2),
                "time_mins": calc_time(a_star_dist),
                "nodes_explored": a_star_nodes
            },
            "greedy": {
                "path": greedy_path,
                "distance": round(greedy_dist, 2),
                "time_mins": calc_time(greedy_dist),
                "nodes_explored": greedy_nodes
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)