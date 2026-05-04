import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphView = ({ mapData, results, activeAlgorithm, startNode, endNode }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!mapData || !mapData.nodes.length) return;

        const width = svgRef.current.parentElement.clientWidth;
        const height = svgRef.current.parentElement.clientHeight;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // 1. Setup Zooming
        const mainGroup = svg.append("g");
        svg.call(d3.zoom().on("zoom", (event) => {
            mainGroup.attr("transform", event.transform);
        }));

        const simulation = d3.forceSimulation(mapData.nodes)
            .force("link", d3.forceLink(mapData.links).id(d => d.id).distance(60)) // Increased distance for labels
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // 2. Draw Dashed Links
        const link = mainGroup.append("g")
            .selectAll("line")
            .data(mapData.links)
            .enter().append("line")
            .attr("stroke", "#334155")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5,5");

        // 3. Draw Node Groups (Circle + Text)
        const nodeGroup = mainGroup.append("g")
            .selectAll("g")
            .data(mapData.nodes)
            .enter().append("g")
            .call(d3.drag() // Added drag support for better UX
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        nodeGroup.append("circle")
            .attr("r", d => (d.id === startNode || d.id === endNode) ? 8 : 4)
            .attr("fill", d => {
                if (d.id === startNode) return "#3b82f6"; 
                if (d.id === endNode) return "#ef4444";   
                return "#1e293b";
            })
            .attr("stroke", "#475569")
            .attr("stroke-width", 2);

        nodeGroup.append("text")
            .text(d => d.name)
            .attr("dy", -12)
            .attr("text-anchor", "middle")
            .attr("fill", "#94a3b8")
            .style("font-size", "10px")
            .style("pointer-events", "none"); // Prevents text from blocking drag

        // 4. Results Highlighting
        if (results && activeAlgorithm) {
            let aStarSet = new Set(results.algorithms?.a_star?.path || []);
            let greedySet = new Set(results.algorithms?.greedy?.path || []);

            const inAStar = id => aStarSet.has(id);
            const inGreedy = id => greedySet.has(id);

            const getIndex = id => {
                if (activeAlgorithm === 'a_star' || activeAlgorithm === 'compare') return results.algorithms?.a_star?.path?.indexOf(id) ?? -1;
                if (activeAlgorithm === 'greedy') return results.algorithms?.greedy?.path?.indexOf(id) ?? -1;
                return -1;
            };

            const getLinkIndex = (sid, tid) => {
                let path = [];
                if (activeAlgorithm === 'a_star' || activeAlgorithm === 'compare') path = results.algorithms?.a_star?.path || [];
                else path = results.algorithms?.greedy?.path || [];
                
                let idx1 = path.indexOf(sid);
                let idx2 = path.indexOf(tid);
                if (idx1 >= 0 && idx2 >= 0 && Math.abs(idx1 - idx2) === 1) {
                    return Math.max(idx1, idx2);
                }
                return -1;
            };

            nodeGroup.select("circle").transition().duration(400)
                .delay(d => {
                    const idx = getIndex(d.id);
                    return idx >= 0 ? idx * 100 : 0; // 100ms per step
                })
                .attr("fill", d => {
                    if (d.id === startNode) return "#3b82f6";
                    if (d.id === endNode) return "#ef4444";
                    
                    if (activeAlgorithm === 'compare') {
                        if (inAStar(d.id) && inGreedy(d.id)) return "#ffffff"; // overlap is white
                        if (inAStar(d.id)) return "#22d3ee"; // a_star blue
                        if (inGreedy(d.id)) return "#10b981"; // greedy green
                    } else if (activeAlgorithm === 'a_star' && inAStar(d.id)) {
                        return "#22d3ee";
                    } else if (activeAlgorithm === 'greedy' && inGreedy(d.id)) {
                        return "#10b981";
                    }
                    return "#1e293b";
                })
                .attr("r", d => {
                    if (d.id === startNode || d.id === endNode) return 8;
                    if (activeAlgorithm === 'compare') return (inAStar(d.id) || inGreedy(d.id)) ? 8 : 4;
                    if (activeAlgorithm === 'a_star') return inAStar(d.id) ? 8 : 4;
                    if (activeAlgorithm === 'greedy') return inGreedy(d.id) ? 8 : 4;
                    return 4;
                });

            link.transition().duration(400)
                .delay(d => {
                    const idx = getLinkIndex(d.source.id, d.target.id);
                    return idx >= 0 ? idx * 100 : 0; // 100ms per step
                })
                .attr("stroke", d => {
                    const linkAStar = inAStar(d.source.id) && inAStar(d.target.id);
                    const linkGreedy = inGreedy(d.source.id) && inGreedy(d.target.id);

                    if (activeAlgorithm === 'compare') {
                        if (linkAStar && linkGreedy) return "#ffffff";
                        if (linkAStar) return "#22d3ee";
                        if (linkGreedy) return "#10b981";
                    } else if (activeAlgorithm === 'a_star' && linkAStar) {
                        return "#22d3ee";
                    } else if (activeAlgorithm === 'greedy' && linkGreedy) {
                        return "#10b981";
                    }
                    return "#334155";
                })
                .attr("stroke-width", d => {
                    const linkAStar = inAStar(d.source.id) && inAStar(d.target.id);
                    const linkGreedy = inGreedy(d.source.id) && inGreedy(d.target.id);
                    
                    if (activeAlgorithm === 'compare' && (linkAStar || linkGreedy)) return 3;
                    if (activeAlgorithm === 'a_star' && linkAStar) return 3;
                    if (activeAlgorithm === 'greedy' && linkGreedy) return 3;
                    return 1;
                })
                .attr("stroke-dasharray", d => {
                    const linkAStar = inAStar(d.source.id) && inAStar(d.target.id);
                    const linkGreedy = inGreedy(d.source.id) && inGreedy(d.target.id);
                    
                    if (activeAlgorithm === 'compare' && (linkAStar || linkGreedy)) return "0";
                    if (activeAlgorithm === 'a_star' && linkAStar) return "0";
                    if (activeAlgorithm === 'greedy' && linkGreedy) return "0";
                    return "5,5";
                });
        }

        // 5. Update Simulation Positions
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
        });

        return () => simulation.stop();
    }, [mapData, results, activeAlgorithm, startNode, endNode]);

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#0f172a', position: 'relative' }}>
            
            {/* Simulation Standby Text */}
            <div style={{
                position: 'absolute', top: 15, left: 15, zIndex: 10,
                background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155',
                padding: '8px 16px', borderRadius: '16px',
                color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#64748b'}}></div>
                SIMULATION STANDBY
            </div>

            {/* Legend */}
            <div style={{
                position: 'absolute', bottom: 20, right: 20, zIndex: 10,
                background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155',
                padding: '15px', borderRadius: '12px',
                color: '#cbd5e1', fontSize: '0.8rem',
                display: 'flex', flexDirection: 'column', gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#3b82f6'}}></div> START NODE
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#ef4444'}}></div> TARGET NODE
                </div>
                
                {activeAlgorithm === 'a_star' || activeAlgorithm === 'compare' ? (
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#22d3ee'}}></div> A* PATH
                    </div>
                ) : null}
                
                {activeAlgorithm === 'greedy' || activeAlgorithm === 'compare' ? (
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#10b981'}}></div> GREEDY PATH
                    </div>
                ) : null}
                
                {activeAlgorithm === 'compare' && (
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#ffffff'}}></div> OVERLAP
                    </div>
                )}
                
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#1e293b', border:'1px solid #475569'}}></div> EXPLORED
                </div>
            </div>

            <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default GraphView;