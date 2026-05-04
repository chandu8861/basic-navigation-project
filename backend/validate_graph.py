import json
import sys
import os
from collections import defaultdict

sys.path.append(r"c:\Users\chand\OneDrive\Documents\BangalorePathfinder\backend")
from algorithms import a_star_search, greedy_search

with open(r"c:\Users\chand\OneDrive\Documents\BangalorePathfinder\backend\bangalore_map.json", "r") as f:
    data = json.load(f)

nodes = data.get("nodes", [])
links = data.get("links", [])

print(f"Total Nodes: {len(nodes)}")
print(f"Total Links: {len(links)}")

# Unconnected network check (BFS)
adj = defaultdict(list)
for l in links:
    adj[l['source']].append(l['target'])
    adj[l['target']].append(l['source'])

visited = set()
components = 0
for n in nodes:
    start = n['id']
    if start not in visited:
        components += 1
        queue = [start]
        visited.add(start)
        while queue:
            curr = queue.pop(0)
            for neighbor in adj[curr]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

print(f"Total disconnected components: {components}")

# Generate diff text file
diff_count = 0
with open("path_differences.txt", "w") as out:
    out.write("Pairs where A* vs Greedy Paths differ:\n\n")
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            n1 = nodes[i]['id']
            n2 = nodes[j]['id']
            
            a_path, a_dist, _ = a_star_search(data, n1, n2)
            g_path, g_dist, _ = greedy_search(data, n1, n2)
            
            # None path handling
            if a_path != g_path:
                diff_count += 1
                out.write(f"Start: {n1} | End: {n2}\n")
                out.write(f"A* Path ({a_dist}km): {a_path}\n")
                out.write(f"G  Path ({g_dist}km): {g_path}\n")
                out.write("-" * 50 + "\n")

print(f"Total differing paths: {diff_count}")
print("Wrote differences to path_differences.txt")
