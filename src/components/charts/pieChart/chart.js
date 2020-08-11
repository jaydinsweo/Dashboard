import React, { useState, useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";
import useResizeObserver from "../../../hooks/useResizeObserver";
import styled from "styled-components";
import extractData from "../../../helper/extractData";

const Chart = ({ dataset, app: { model } }) => {
   const [data, setData] = useState(dataset);
   const wrapperRef = useRef();
   const svgRef = useRef();
   const dimensions = useResizeObserver(wrapperRef);

   const HandleClick = useCallback(
      async d => {
         await model.selectHyperCubeValues(
            "/qHyperCubeDef",
            0,
            [d.data.dimensions[0].qElemNumber], //pass an array to get data points
            false
         );
         const layout = await model.getLayout();
         const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
         const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
         const data = await extractData(qMatrix, qDimensionInfo, qMeasureInfo);
         setData(data);
      },
      [model]
   );
   useEffect(() => {
      if (!dimensions) return;
      const svg = d3
         .select(svgRef.current)
         .attr("width", dimensions.width)
         .attr("height", dimensions.height);

      const colors = ["#4281A4", "#48A9A6", "#DB5461", "#E9D985", "#C0DF85"];
      const radius = Math.min(dimensions.width, dimensions.height) / 2;

      const pie = d3.pie().value(d => d.measures[0].value);
      const arc = d3
         .arc()
         .innerRadius(70)
         .outerRadius(radius);

      // ----------------------- draw chart
      svg.selectAll(".piechart")
         .data(pie(data))
         .join("path")
         .attr("class", "piechart")
         .attr(
            "transform",
            `translate(${dimensions.width / 2}, ${dimensions.height / 2})`
         )
         .attr("d", arc)
         .attr("fill", (_, i) => colors[i])
         .attr("stroke", "#e6e9ef")
         .style("stroke-width", 1.2);

      // ---------------------- labels

      svg.selectAll(".piechart")
         .on("mouseover", d => {
            svg.select(".labels")
               .attr(
                  "transform",
                  `translate(${dimensions.width / 2}, ${dimensions.height / 2})`
               )
               .attr("opacity", 1)
               .selectAll("text")
               .data(pie(d))
               .join("text")
               .attr("text-anchor", "middle")
               .text(d.data.dimensions[0].value)
               .append("tspan")
               .attr("dy", 15)
               .attr("x", 0)
               .text(d.data.measures[0].value.toFixed(0));
         })
         .on("mouseleave", () => {
            svg.select(".labels").attr("opacity", 0);
         })
         .on("click", async d => {
            HandleClick(d);
         });
   }, [data, dimensions, HandleClick]);

   useEffect(() => {
      model.on("changed", async () => {
         const layout = await model.getLayout();
         const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
         const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
         const data = await extractData(qMatrix, qDimensionInfo, qMeasureInfo);
         setData(data);
      });
   }, [model]);

   return (
      <Div ref={wrapperRef} style={{ height: "100%" }}>
         <InnerCircle className="innerCircle" />
         <svg ref={svgRef}>
            <g className="labels" />
         </svg>
      </Div>
   );
};

export default Chart;

const Div = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 0.25rem;
`;

const InnerCircle = styled.div`
   position: absolute;
   width: 120px;
   height: 120px;
   border-radius: 50%;
   box-shadow: 10px 5px 10px #a3b1c6, -10px -5px 10px #fff;
`;
