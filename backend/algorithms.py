import math
from heapq import heappush, heappop

def haversine(lat1, lon1, lat2, lon2):
    """Calculates the straight-line distance in km between two points."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_path(came_from, current):
    """Reconstructs the path from start to goal."""
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return path[::-1]

def a_star_search(graph, start_id, goal_id):
    nodes = {node['id']: node for node in graph['nodes']}
    adj = {node['id']: [] for node in graph['nodes']}
    for link in graph['links']:
        adj[link['source']].append((link['target'], link['distance']))
        adj[link['target']].append((link['source'], link['distance']))

    frontier = []
    heappush(frontier, (0, start_id))
    came_from = {}
    g_score = {node_id: float('inf') for node_id in nodes}
    g_score[start_id] = 0
    
    nodes_explored = 0

    while frontier:
        current_f, current = heappop(frontier)
        nodes_explored += 1

        if current == goal_id:
            return get_path(came_from, current), g_score[goal_id], nodes_explored

        for neighbor, weight in adj[current]:
            tentative_g = g_score[current] + weight
            if tentative_g < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                h = haversine(nodes[neighbor]['lat'], nodes[neighbor]['lng'], 
                              nodes[goal_id]['lat'], nodes[goal_id]['lng'])
                heappush(frontier, (tentative_g + h, neighbor))
    return None, 0, nodes_explored

def greedy_search(graph, start_id, goal_id):
    nodes = {node['id']: node for node in graph['nodes']}
    adj = {node['id']: [] for node in graph['nodes']}
    for link in graph['links']:
        adj[link['source']].append((link['target'], link['distance']))
        adj[link['target']].append((link['source'], link['distance']))

    frontier = []
    start_h = haversine(nodes[start_id]['lat'], nodes[start_id]['lng'], 
                        nodes[goal_id]['lat'], nodes[goal_id]['lng'])
    heappush(frontier, (start_h, start_id))
    
    came_from = {}
    visited = {start_id}
    nodes_explored = 0
    total_dist = 0

    while frontier:
        current_h, current = heappop(frontier)
        nodes_explored += 1

        if current == goal_id:
            # Calculate final distance
            path = get_path(came_from, current)
            for i in range(len(path)-1):
                for link in graph['links']:
                    if (link['source'] == path[i] and link['target'] == path[i+1]) or \
                       (link['target'] == path[i] and link['source'] == path[i+1]):
                        total_dist += link['distance']
                        break
            return path, total_dist, nodes_explored

        for neighbor, weight in adj[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                came_from[neighbor] = current
                h = haversine(nodes[neighbor]['lat'], nodes[neighbor]['lng'], 
                              nodes[goal_id]['lat'], nodes[goal_id]['lng'])
                heappush(frontier, (h, neighbor))
    return None, 0, nodes_explored