import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Helper to auto-center the map when a path is found
function RecenterMap({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords && coords.length > 0) {
            map.setView(coords[0], 13, { animate: true });
        }
    }, [coords, map]);
    return null;
}

const MapView = ({ mapData, results, activeAlgorithm }) => {
    
    const aStarPath = results?.algorithms?.a_star?.path || [];
    const greedyPath = results?.algorithms?.greedy?.path || [];

    const getCoords = (pathArr) => pathArr.map(id => {
        const node = mapData.nodes.find(n => n.id === id);
        return [node.lat, node.lng];
    });

    const aStarCoords = getCoords(aStarPath);
    const greedyCoords = getCoords(greedyPath);

    // Logic: As requested, if compare, map only shows A* path (blue).
    // If greedy, it shows Green. If A*, it shows Blue.
    const showBlue = activeAlgorithm === 'a_star' || activeAlgorithm === 'compare';
    const showGreen = activeAlgorithm === 'greedy';

    return (
        <MapContainer
            center={[12.9716, 77.5946]}
            zoom={12}
            style={{ height: '100%', width: '100%', background: '#0f172a' }}
        >
            {/* Standard OSM Tiles (Colored) instead of CartoDB Dark (B&W) */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Render all 150+ Landmark Nodes as small dots */}
            {mapData.nodes.map(node => (
                <CircleMarker
                    key={node.id}
                    center={[node.lat, node.lng]}
                    radius={3}
                    pathOptions={{ color: '#1e293b', fillColor: '#1e293b', fillOpacity: 0.8 }}
                />
            ))}

            {/* Draw the Greedy Path in Green */}
            {showGreen && greedyCoords.length > 0 && (
                <>
                    <Polyline
                        positions={greedyCoords}
                        pathOptions={{ color: '#10b981', weight: 5, opacity: 0.8 }}
                    />
                    <RecenterMap coords={greedyCoords} />
                </>
            )}

            {/* Draw the A* Path in Blue */}
            {showBlue && aStarCoords.length > 0 && (
                <>
                    <Polyline
                        positions={aStarCoords}
                        pathOptions={{ color: '#22d3ee', weight: 5, opacity: 0.8 }}
                    />
                    <RecenterMap coords={aStarCoords} />
                </>
            )}
        </MapContainer>
    );
};

export default MapView;