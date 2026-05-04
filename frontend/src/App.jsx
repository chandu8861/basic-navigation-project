import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search } from 'lucide-react';
import './App.css';

// We will create these components in the next steps
import MapView from './components/MapView';
import GraphView from './components/GraphView';
import Dashboard from './components/Dashboard';

function App() {
  const [mapData, setMapData] = useState({ nodes: [], links: [] });
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [travelMode, setTravelMode] = useState('car');
  const [activeAlgorithm, setActiveAlgorithm] = useState(null);

  // Fetch the 150 landmarks on load
  useEffect(() => {
    axios.get('http://localhost:8000/map-data')
      .then(res => setMapData(res.data))
      .catch(err => console.error("Backend not running?", err));
  }, []);

  const handleRunAgent = async (algo) => {
    if (!startNode || !endNode) return alert("Please select both points!");

    setLoading(true);
    setActiveAlgorithm(algo);
    try {
      const response = await axios.get(`http://localhost:8000/find-path?start=${startNode}&end=${endNode}&mode=${travelMode}`);
      const data = response.data;
      
      const noAStar = !data.algorithms.a_star.path || data.algorithms.a_star.path.length === 0;
      const noGreedy = !data.algorithms.greedy.path || data.algorithms.greedy.path.length === 0;
      
      if (noAStar || noGreedy) {
        alert("Path does not exist between these locations!");
      }
      
      setResults(data);
    } catch (err) {
      console.error("Error finding path", err);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* 1/3 Sidebar Panel */}
      <aside className="sidebar">
        <h2 className="glow-text-cyan">Bangalore Pathfinder</h2>

        <div className="control-group">
          <label className="section-label">STARTING POINT</label>
          <div className="styled-select-wrapper">
            <MapPin size={18} color="#94a3b8" />
            <select value={startNode} onChange={(e) => setStartNode(e.target.value)} className="custom-select">
              <option value="">Select Location...</option>
              {mapData.nodes.map(node => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="control-group">
          <label className="section-label">DESTINATION</label>
          <div className="styled-select-wrapper">
            <Search size={18} color="#94a3b8" />
            <select value={endNode} onChange={(e) => setEndNode(e.target.value)} className="custom-select">
              <option value="">Select Location...</option>
              {mapData.nodes.map(node => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* NEW: Travel Mode Toggle from image_9a2c1b.png */}
        <div className="travel-mode-section">
          <label className="section-label">TRAVEL MODE</label>
          <div className="mode-toggle">
            <button className={`mode-btn ${travelMode === 'car' ? 'active' : ''}`} onClick={() => setTravelMode('car')}>🚗 Car</button>
            <button className={`mode-btn ${travelMode === 'walk' ? 'active' : ''}`} onClick={() => setTravelMode('walk')}>👣 Walk</button>
          </div>
        </div>

        {/* NEW: Specific Agent Buttons */}
        <div className="agent-controls">
          <button className="run-btn a-star" onClick={() => handleRunAgent('a_star')}>
            ▶ Run A* Agent
          </button>
          <button className="run-btn greedy" onClick={() => handleRunAgent('greedy')}>
            ▶ Run Greedy Agent
          </button>
          <button className="run-btn compare" onClick={() => handleRunAgent('compare')}>
            🔄 Compare Both
          </button>
        </div>

        {results && <Dashboard results={results} activeAlgorithm={activeAlgorithm} travelMode={travelMode} />}
      </aside>

      {/* 2/3 Visualization Panel */}
      <main className="main-view">
        <div className="map-container">
          <MapView mapData={mapData} results={results} activeAlgorithm={activeAlgorithm} />
        </div>
        <div className="graph-container">
          <GraphView mapData={mapData} results={results} activeAlgorithm={activeAlgorithm} startNode={startNode} endNode={endNode} />
        </div>
      </main>
    </div>
  );
}

export default App;