"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function CustomSankey() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  // Define Nodes in 3 Columns
  const leftNodes = [
    { id: 'm1', name: 'Oil and Gas', y: 10, color: 'var(--accent)' },
    { id: 'm2', name: 'Energy', y: 30, color: 'var(--accent)' },
    { id: 'm3', name: 'Nuclear', y: 50, color: 'var(--accent)' },
    { id: 'm4', name: 'Water', y: 70, color: 'var(--accent)' },
    { id: 'm5', name: 'Chemicals', y: 90, color: 'var(--accent)' }
  ];

  const middleNodes = [
    { id: 'c1', name: 'DNV', y: 8, color: '#7C3AED' },
    { id: 'c2', name: 'Sphera', y: 24, color: '#7C3AED' },
    { id: 'c3', name: 'Intelex', y: 40, color: '#7C3AED' },
    { id: 'c4', name: 'Lloyds Register', y: 56, color: '#7C3AED' },
    { id: 'c5', name: 'Ideagen', y: 72, color: '#7C3AED' },
    { id: 'c6', name: 'Empirisys', y: 88, isEmpirisys: true, color: 'var(--accent)' }
  ];

  const rightNodes = [
    { id: 'cap1', name: 'AI Analytics', y: 20, isEmpirisys: true, color: 'var(--accent)' },
    { id: 'cap2', name: 'Process Safety Expertise', y: 34, isEmpirisys: true, color: 'var(--accent)' },
    { id: 'cap3', name: 'Cultural Diagnostics', y: 48, isEmpirisys: true, color: 'var(--accent)' },
    { id: 'cap4', name: 'Consultancy', y: 62, color: '#7C3AED' },
    { id: 'cap5', name: 'Compliance', y: 76, color: '#7C3AED' },
    { id: 'cap6', name: 'Leadership Development', y: 90, color: '#7C3AED' }
  ];

  // Define Links flowing from left to middle, and middle to right
  const links = [
    // Markets to Competitors (Left to Middle)
    { id: 1, source: 'm1', target: 'c1', value: 8, color: 'purple' },
    { id: 2, source: 'm1', target: 'c4', value: 6, color: 'purple' },
    { id: 3, source: 'm1', target: 'c6', value: 10, color: 'teal' }, // Empirisys flow
    
    { id: 4, source: 'm2', target: 'c1', value: 6, color: 'purple' },
    { id: 5, source: 'm2', target: 'c2', value: 7, color: 'purple' },
    { id: 6, source: 'm2', target: 'c6', value: 9, color: 'teal' },
    
    { id: 7, source: 'm3', target: 'c1', value: 5, color: 'purple' },
    { id: 8, source: 'm3', target: 'c4', value: 8, color: 'purple' },
    { id: 9, source: 'm3', target: 'c6', value: 8, color: 'teal' },
    
    { id: 10, source: 'm4', target: 'c2', value: 8, color: 'purple' },
    { id: 11, source: 'm4', target: 'c3', value: 9, color: 'purple' },
    { id: 12, source: 'm4', target: 'c6', value: 10, color: 'teal' },
    
    { id: 13, source: 'm5', target: 'c2', value: 6, color: 'purple' },
    { id: 14, source: 'm5', target: 'c5', value: 7, color: 'purple' },
    { id: 15, source: 'm5', target: 'c6', value: 7, color: 'teal' },

    // Competitors to Capabilities (Middle to Right)
    { id: 16, source: 'c1', target: 'cap2', value: 9, color: 'purple' },
    { id: 17, source: 'c1', target: 'cap5', value: 10, color: 'purple' },
    
    { id: 18, source: 'c2', target: 'cap1', value: 8, color: 'purple' },
    { id: 19, source: 'c2', target: 'cap5', value: 11, color: 'purple' },
    
    { id: 20, source: 'c3', target: 'cap5', value: 9, color: 'purple' },
    
    { id: 21, source: 'c4', target: 'cap2', value: 7, color: 'purple' },
    { id: 22, source: 'c4', target: 'cap4', value: 7, color: 'purple' },
    
    { id: 23, source: 'c5', target: 'cap5', value: 7, color: 'purple' },
    
    // Empirisys Capabilities flows (Teal)
    { id: 24, source: 'c6', target: 'cap1', value: 11, color: 'teal' },
    { id: 25, source: 'c6', target: 'cap2', value: 10, color: 'teal' },
    { id: 26, source: 'c6', target: 'cap3', value: 9, color: 'teal' },
    { id: 27, source: 'c6', target: 'cap4', value: 7, color: 'teal' },
    { id: 28, source: 'c6', target: 'cap6', value: 7, color: 'teal' }
  ];

  // Render SVG Path using Bezier curve
  const drawLink = (x1: number, y1: number, x2: number, y2: number) => {
    const controlX = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div className="w-full h-[450px] relative glass-card p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Market and Capability Flow
          </h3>
          <p className="text-xs text-text-secondary">
            Flow dynamics from Target Sectors to Competitors and Strategic Core Capabilities
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-micro font-bold uppercase tracking-wider text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-accent rounded-full" />
            <span className="text-text-primary">Empirisys Flows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-[#7C3AED] rounded-full" />
            <span className="text-text-primary">Competitor Flows</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[350px]">
        <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
          {/* Paths/Links */}
          {links.map((link) => {
            const isLeftToMiddle = link.source.startsWith('m');
            let sourceNode, targetNode;
            
            if (isLeftToMiddle) {
              sourceNode = leftNodes.find(n => n.id === link.source);
              targetNode = middleNodes.find(n => n.id === link.target);
            } else {
              sourceNode = middleNodes.find(n => n.id === link.source);
              targetNode = rightNodes.find(n => n.id === link.target);
            }

            if (!sourceNode || !targetNode) return null;

            // X coordinates for 3 columns (Left: 100, Middle: 500, Right: 900)
            const x1 = isLeftToMiddle ? 150 : 500;
            const x2 = isLeftToMiddle ? 500 : 850;
            
            // Map percentage Y coordinates to SVG space (300px height, margins top/bottom 30px)
            const y1 = 30 + (sourceNode.y / 100) * 240;
            const y2 = 30 + (targetNode.y / 100) * 240;

            const isHovered = hoveredLink === link.id || 
                              (hoveredNode === link.source) || 
                              (hoveredNode === link.target);
            
            const strokeColor = link.color === 'teal' ? 'var(--accent)' : '#7C3AED';

            return (
              <path
                key={link.id}
                d={drawLink(x1, y1, x2, y2)}
                fill="none"
                stroke={strokeColor}
                strokeWidth={link.value * (isHovered ? 1.5 : 1)}
                strokeOpacity={isHovered ? 0.75 : 0.2}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
              />
            );
          })}

          {/* Left Column Nodes (Target Markets) */}
          {leftNodes.map((node) => {
            const y = 30 + (node.y / 100) * 240;
            const isHovered = hoveredNode === node.id;
            return (
              <g 
                key={node.id} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect
                  x="142"
                  y={y - 15}
                  width="8"
                  height="30"
                  fill={node.color}
                  rx="2"
                  className="transition-all duration-200"
                  style={{ transformOrigin: `146px ${y}px`, transform: isHovered ? 'scale(1.2)' : 'none' }}
                />
                <text
                  x="126"
                  y={y + 4}
                  textAnchor="end"
                  className="text-caption font-sans font-bold tracking-wide fill-current text-text-primary"
                >
                  {node.name}
                </text>
              </g>
            );
          })}

          {/* Middle Column Nodes (Competitors) */}
          {middleNodes.map((node) => {
            const y = 30 + (node.y / 100) * 240;
            const isHovered = hoveredNode === node.id;
            return (
              <g 
                key={node.id} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect
                  x="496"
                  y={y - 18}
                  width="8"
                  height="36"
                  fill={node.color}
                  rx="2"
                  className="transition-all duration-200"
                  style={{ transformOrigin: `500px ${y}px`, transform: isHovered ? 'scale(1.2)' : 'none' }}
                />
                <text
                  x="512"
                  y={y + 4}
                  textAnchor="start"
                  className={cn(
                    "text-caption font-sans font-bold tracking-wide fill-current",
                    node.isEmpirisys ? "text-accent" : "text-text-primary"
                  )}
                >
                  {node.name}
                </text>
              </g>
            );
          })}

          {/* Right Column Nodes (Core Capabilities) */}
          {rightNodes.map((node) => {
            const y = 30 + (node.y / 100) * 240;
            const isHovered = hoveredNode === node.id;
            return (
              <g 
                key={node.id} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect
                  x="850"
                  y={y - 15}
                  width="8"
                  height="30"
                  fill={node.color}
                  rx="2"
                  className="transition-all duration-200"
                  style={{ transformOrigin: `854px ${y}px`, transform: isHovered ? 'scale(1.2)' : 'none' }}
                />
                <text
                  x="866"
                  y={y + 4}
                  textAnchor="start"
                  className="text-caption font-sans font-bold tracking-wide fill-current text-text-primary"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
