import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706',
  '#dc2626', '#0891b2', '#65a30d', '#9333ea', '#ea580c'
];

export default function WordCloud({ words }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const width = 700;
    const height = 500;

    const fontScale = d3.scaleLinear()
      .domain([
        Math.min(...words.map(w => w.value)),
        Math.max(...words.map(w => w.value))
      ])
      .range([16, 72]);

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    cloud()
      .size([width, height])
      .words(words.map(w => ({ text: w.text, size: fontScale(w.value) })))
      .padding(4)
      .rotate(0)
      .fontSize(d => d.size)
      .spiral('archimedean')
      .on('end', (computed) => {
        svg.selectAll('text')
          .data(computed)
          .enter()
          .append('text')
          .style('font-size', d => `${d.size}px`)
          .style('font-family', 'Inter, sans-serif')
          .style('font-weight', d => d.size > 28 ? '700' : '400')
          .style('fill', (_, i) => COLORS[i % COLORS.length])
          .style('fill-opacity', 0.85)
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${d.x}, ${d.y})`)
          .text(d => d.text);
      })
      .start();
  }, [words]);

  return <svg ref={svgRef} style={{ overflow: 'visible' }} />;
}