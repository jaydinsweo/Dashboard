import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "../../../hooks/useResizeObserver";
import styled from "styled-components";
import extractData from "../../../helper/extractData";

const Chart = ({ dataset, app: { model } }) => {
   const [data, setData] = useState(dataset);
   const wrapperRef = useRef();
   const svgRef = useRef();
   const dimensions = useResizeObserver(wrapperRef);

   // trigger when there is a data selected
   // the model will trigger the async function when it changed
   useEffect(() => {
      model.on("changed", async () => {
         const layout = await model.getLayout();
         const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
         const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
         const data = await extractData(qMatrix, qDimensionInfo, qMeasureInfo);
         setData(data);
      });
   }, [model]);

   // trigger after initial render
   useEffect(() => {
      if (!dimensions) return;
      const margin = {
         top: 40,
         bottom: 50,
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
            .domain(data.map(d => d.dimensions[0].value))
            .range([margin.left, dimensions.width - margin.right])
            .paddingInner(0.1),

         y: d3
            .scaleLinear()
            .domain(d3.extent(data.map(d => d.measures[0].value)))
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

      const colors = ["#4281A4", "#48A9A6", "#DB5461", "#E9D985", "#C0DF85"];

      // color palette = one color per subgroup
      var color = d3
         .scaleOrdinal()
         .domain(keys)
         .range(colors);

      // draw chart

      svg.selectAll(".group-barchart")
         .data(data)
         .join("g")
         .attr("class", d => `group-barchart ${d.dimensions[0].value}`)
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

      // -------------------------------------- event listeners
      const onClick = d => {};
      const onMouseOver = d => {};
      svg.selectAll(".group-barchart")
         .on("click", onClick)
         .on("mouseover", onMouseOver);

      // -------------------------------------- label

      const gLegend = d3
         .select(wrapperRef.current)
         .select(".bar-legend")
         .selectAll(".legend")
         .data(data[0].measures)
         .join("g")
         .attr("class", "legend");

      gLegend.text(d => d.label);
      gLegend
         .append("div")
         .attr("class", "circle")
         .attr("style", (_, i) => `background-color: ${colors[i]};`);
   }, [data, dimensions]);

   return (
      <Div ref={wrapperRef}>
         <svg ref={svgRef}>
            <g className="x-axis" />
         </svg>
         <Legends className="bar-legend" />
      </Div>
   );
};

export default Chart;

const Div = styled.div`
   height: 100%;
   display: flex;
   flex-direction: column;
`;

const Legends = styled.div`
   display: flex;
   justify-content: space-evenly;
   height: 2rem;

   .legend {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      font-size: 0.75rem;

      .circle {
         width: 1rem;
         height: 1rem;
         margin: 0 0.5rem;
         border-radius: 50%;
         box-shadow: 4px 4px 5px #a3b1c6, -4px -4px 5px #fff;
      }
   }
`;
