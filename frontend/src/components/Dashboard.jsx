import React from 'react';
import { Activity, MapPin, Zap } from 'lucide-react';

const Dashboard = ({ results, activeAlgorithm, travelMode }) => {
    const { a_star, greedy } = results.algorithms;

    // Fallback if backend hasn't been reloaded by user
    const speed = travelMode === 'walk' ? 5 : 40;
    const aStarTime = a_star.time_mins !== undefined ? a_star.time_mins : Math.round((a_star.distance / speed) * 60);
    const greedyTime = greedy.time_mins !== undefined ? greedy.time_mins : Math.round((greedy.distance / speed) * 60);

    return (
        <div className="dashboard-results" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* A* Results Card */}
            {(activeAlgorithm === 'a_star' || activeAlgorithm === 'compare') && (
                <div className="stat-card" style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid var(--accent-cyan)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Zap size={16} color="#22d3ee" />
                        <strong style={{ color: '#22d3ee' }}>A* Search (Optimal)</strong>
                    </div>
                    {a_star.distance > 0 ? (
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                            <p>Distance: <b>{a_star.distance} km</b></p>
                            <p>Est. Time: <b>{aStarTime} mins</b></p>
                            <p>Nodes Explored: <b>{a_star.nodes_explored}</b></p>
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85rem', color: '#ef4444' }}><b>Path Not Found</b></div>
                    )}
                </div>
            )}

            {/* Greedy Results Card */}
            {(activeAlgorithm === 'greedy' || activeAlgorithm === 'compare') && (
                <div className="stat-card" style={{ background: 'rgba(244, 114, 182, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid var(--accent-magenta)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Activity size={16} color="#f472b6" />
                        <strong style={{ color: '#f472b6' }}>Greedy BFS (Fast)</strong>
                    </div>
                    {greedy.distance > 0 ? (
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                            <p>Distance: <b>{greedy.distance} km</b></p>
                            <p>Est. Time: <b>{greedyTime} mins</b></p>
                            <p>Nodes Explored: <b>{greedy.nodes_explored}</b></p>
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85rem', color: '#ef4444' }}><b>Path Not Found</b></div>
                    )}
                </div>
            )}

            <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#94a3b8' }}>
                * A* ensures the shortest path, while Greedy looks for the immediate direction.
            </div>
        </div>
    );
};

export default Dashboard;