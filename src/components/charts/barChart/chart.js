import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "../../../hooks/useResizeObserver";

const Chart = ({ dataset }) => {
   const wrapperRef = useRef();
   const svgRef = useRef();
   const dimensions = useResizeObserver(wrapperRef);

   useEffect(() => {
      if (!dimensions) return;
      const margin = {
         top: 50,
         bottom: 30,
         left: 30,
         right: 30
      };
      const svg = d3
         .select(svgRef.current)
         .attr("width", dimensions.width)
         .attr("height", dimensions.height);

      // ---------------------- scale
      const scale = {
         x: d3
            .scaleBand()
            .domain(dataset.map(d => d.dimensions[0].value))
            .range([margin.left, dimensions.width - margin.right])
            .paddingInner(0.1),

         y: d3
            .scaleLinear()
            .domain(d3.extent(dataset.map(d => d.measures[0].value)))
            .range([dimensions.height - margin.bottom, margin.top])
            .nice()
      };
      // ----------------------- axis
      const axis = {
         x: g =>
            g
               .attr(
                  "transform",
                  `translate(0, ${dimensions.height - margin.bottom})`
               )
               .call(d3.axisBottom(scale.x)),
         y: g =>
            g
               .attr("transform", `translate(${margin.left}, 0)`)
               .call(d3.axisLeft(scale.y))
      };

      // --------------------- calling axis

      svg.select(".x-axis").call(axis.x);

      svg.select(".x-axis")
         .select("path")
         .remove();
      svg.selectAll(".tick")
         .select("line")
         .remove();

      // -------------------- draw chart

      const keys = ["Total Claim Cost", "Total Annual Premium"];
      const XGroup = d3
         .scaleBand()
         .domain(keys)
         .range([0, scale.x.bandwidth()])
         .padding(0.05);

      // color palette = one color per subgroup
      var color = d3
         .scaleOrdinal()
         .domain(keys)
         .range(["#e41a1c", "#377eb8", "#4daf4a"]);

      // draw chart

      svg.selectAll(".group-barchart")
         .data(dataset)
         .join("g")
         .attr("class", "group-barchart")
         .attr(
            "transform",
            d => `translate(${scale.x(d.dimensions[0].value)}, 0)`
         )
         .selectAll(".subgroup-rect")
         .data(d => d.measures.map(d => ({ key: d.label, value: d.value })))
         .join("rect")
         .attr("class", "subgroup-rect")
         .attr("x", d => XGroup(d.key))
         .attr("width", XGroup.bandwidth())
         .attr("y", d => scale.y(d.value))
         .attr(
            "height",
            d => dimensions.height - margin.bottom - scale.y(d.value)
         )
         .attr("fill", d => color(d.key));

      // -------------------------------------- experiemnt
   }, [dataset, dimensions]);

   return (
      <div ref={wrapperRef} style={{ height: "100%" }}>
         <svg ref={svgRef}>
            <g className="x-axis" />
            <g className="y-axis" />
         </svg>
      </div>
   );
};

export default Chart;
