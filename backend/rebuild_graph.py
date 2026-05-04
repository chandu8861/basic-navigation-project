import json
import random
import math
import sys

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

file_path = r"c:\Users\chand\OneDrive\Documents\BangalorePathfinder\backend\bangalore_map.json"
with open(file_path, "r") as f:
    data = json.load(f)

nodes = data.get("nodes", [])
links = data.get("links", [])

# Determine bounding box
lats = [n['lat'] for n in nodes]
lngs = [n['lng'] for n in nodes]
min_lat, max_lat = min(lats), max(lats)
min_lng, max_lng = min(lngs), max(lngs)

existing_ids = set(n['id'] for n in nodes)

# Add 39 new locations
new_nodes_count = 100 - len(nodes)
for i in range(new_nodes_count):
    new_id = f"loc_{i+1}"
    new_node = {
        "id": new_id,
        "name": f"Area {i+1} Block",
        "lat": random.uniform(min_lat, max_lat),
        "lng": random.uniform(min_lng, max_lng)
    }
    nodes.append(new_node)
    existing_ids.add(new_id)

print(f"Added nodes. Total nodes now: {len(nodes)}")

# Helper to find components
def get_components(n_list, l_list):
    adj = {n['id']: [] for n in n_list}
    for l in l_list:
        adj[l['source']].append(l['target'])
        adj[l['target']].append(l['source'])
    
    visited = set()
    comps = []
    
    for n in n_list:
        start = n['id']
        if start not in visited:
            comp = set([start])
            queue = [start]
            visited.add(start)
            while queue:
                curr = queue.pop(0)
                for neighbor in adj[curr]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        comp.add(neighbor)
                        queue.append(neighbor)
            comps.append(comp)
    return comps

# Add 3 nearest neighbors for each NEW node to integrate them to nearby local clusters
for i in range(len(nodes) - new_nodes_count, len(nodes)):
    new_node = nodes[i]
    distances = []
    for other in nodes:
        if new_node['id'] == other['id']: continue
        d = haversine(new_node['lat'], new_node['lng'], other['lat'], other['lng'])
        distances.append((d, new_node['id'], other['id']))
    
    # Sort and pick top 3 closest
    distances.sort(key=lambda x: x[0])
    for dist, src, tgt in distances[:3]:
        links.append({"source": src, "target": tgt, "distance": round(dist, 2)})

# Connect components via minimum spanning connecting links (Kruskal-like)
components = get_components(nodes, links)

print(f"Components after local KNN: {len(components)}")

while len(components) > 1:
    compA = components[0]
    best_dist = float('inf')
    best_link = None
    best_comp_idx = -1
    
    # Find shortest bridge from CompA to any other component
    for i in range(1, len(components)):
        compB = components[i]
        for a_id in compA:
            a_node = next(n for n in nodes if n['id'] == a_id)
            for b_id in compB:
                b_node = next(n for n in nodes if n['id'] == b_id)
                d = haversine(a_node['lat'], a_node['lng'], b_node['lat'], b_node['lng'])
                if d < best_dist:
                    best_dist = d
                    best_link = {"source": a_id, "target": b_id, "distance": round(d, 2)}
                    best_comp_idx = i
                    
    # Add link and merge
    links.append(best_link)
    components[0] = components[0].union(components[best_comp_idx])
    components.pop(best_comp_idx)

print(f"Final connections made. Total components: {len(get_components(nodes, links))}")

data['nodes'] = nodes
data['links'] = links

with open(file_path, "w") as f:
    json.dump(data, f, indent=4)

print("Saved cleanly to bangalore_map.json")
