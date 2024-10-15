import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Blip } from '../types';

interface RadarChartProps {
  blips: Blip[];
  onBlipClick: (blip: Blip) => void;
}

const RadarChart: React.FC<RadarChartProps> = ({ blips, onBlipClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    if (!blips || blips.length === 0) {
      setError("No blips available to display.");
      return;
    }

    try {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const width = 800;
      const height = 800;
      const margin = 50;
      const radius = Math.min(width, height) / 2 - margin;

      const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const quadrants = ['Techniques', 'Tools', 'Platforms', 'Languages & Frameworks'];
      const rings = ['Adopt', 'Trial', 'Assess', 'Hold'];

      // Color scale for quadrants
      const colorScale = d3.scaleOrdinal<string>()
        .domain(quadrants)
        .range(d3.schemeCategory10);

      // Draw quadrants
      const quadrantScale = d3.scaleOrdinal<string>()
        .domain(quadrants)
        .range([0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]);

      g.selectAll(".quadrant")
        .data(quadrants)
        .enter().append("path")
        .attr("class", "quadrant")
        .attr("d", (d, i) => {
          const startAngle = quadrantScale(d);
          const endAngle = startAngle + Math.PI / 2;
          return d3.arc()({
            innerRadius: 0,
            outerRadius: radius,
            startAngle,
            endAngle
          });
        })
        .attr("fill", d => colorScale(d))
        .attr("opacity", 0.3);

      // Draw rings
      const ringScale = d3.scaleLinear()
        .domain([0, rings.length])
        .range([0, radius]);

      rings.forEach((ring, i) => {
        g.append("circle")
          .attr("r", ringScale(i + 1))
          .attr("fill", "none")
          .attr("stroke", "#333")
          .attr("stroke-dasharray", "5,5");
      });

      // Prepare blip data with initial positions
      const blipData = blips.map(blip => {
        const angle = quadrantScale(blip.quadrant) + Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        const r = ringScale(rings.indexOf(blip.ring) + 0.5) + (Math.random() - 0.5) * 20;
        return {
          ...blip,
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
        };
      });

      // Create force simulation
      const simulation = d3.forceSimulation(blipData)
        .force("x", d3.forceX((d: any) => d.x).strength(0.1))
        .force("y", d3.forceY((d: any) => d.y).strength(0.1))
        .force("collide", d3.forceCollide().radius(15))
        .stop();

      // Run the simulation
      for (let i = 0; i < 300; ++i) simulation.tick();

      // Add blips
      const blipRadius = 8;
      const blipGroups = g.selectAll(".blip-group")
        .data(blipData)
        .enter().append("g")
        .attr("class", "blip-group")
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

      blipGroups.append("circle")
        .attr("class", "blip")
        .attr("r", blipRadius)
        .attr("fill", (d: Blip) => colorScale(d.quadrant));

      blipGroups.append("text")
        .attr("class", "blip-label")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text((d: Blip) => d.name);

      // Add labels
      g.selectAll(".quadrant-label")
        .data(quadrants)
        .enter().append("text")
        .attr("class", "quadrant-label")
        .attr("x", (d, i) => Math.cos(quadrantScale(d) + Math.PI / 4) * (radius + 20))
        .attr("y", (d, i) => Math.sin(quadrantScale(d) + Math.PI / 4) * (radius + 20))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(d => d)
        .attr("font-weight", "bold");

      g.selectAll(".ring-label")
        .data(rings)
        .enter().append("text")
        .attr("class", "ring-label")
        .attr("x", 5)
        .attr("y", (d, i) => -ringScale(i + 0.5))
        .text(d => d)
        .attr("font-size", "smaller")
        .attr("alignment-baseline", "middle");

      // Add legend
      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 120}, 20)`);

      const legendItems = legend.selectAll(".legend-item")
        .data(quadrants)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => colorScale(d));

      legendItems.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(d => d)
        .attr("font-size", "12px");

      // Add tooltips
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("pointer-events", "none");

      blipGroups.on("mouseover", (event, d: Blip) => {
        tooltip.style("visibility", "visible")
          .html(`<strong>${d.name}</strong><br>Owner: ${d.owner}<br>${d.quadrant} - ${d.ring}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .on("click", (event, d: Blip) => onBlipClick(d));

      // Zoom and pan functionality
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 5])
        .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
          g.attr("transform", event.transform.toString());
        });

      svg.call(zoom);

      // Reset zoom button
      svg.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", 80)
        .attr("height", 30)
        .attr("fill", "#f0f0f0")
        .attr("rx", 5)
        .attr("ry", 5);

      svg.append("text")
        .attr("x", 50)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .text("Reset Zoom")
        .style("cursor", "pointer")
        .on("click", () => {
          svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
        });

      setError(null);
    } catch (err) {
      console.error("Error in RadarChart:", err);
      setError("An error occurred while rendering the chart.");
    }
  }, [blips, onBlipClick]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[800px] bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 font-bold">{error}</p>
          <p className="mt-2">Please try again or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <svg ref={svgRef} width="800" height="800"></svg>
  );
};

export default RadarChart;