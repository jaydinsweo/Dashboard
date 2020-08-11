import React, { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import useResizeObserver from "../../../hooks/useResizeObserver";
import styled from "styled-components";
import extractData from "../../../helper/extractData";

const Chart = ({ dataset, app: { model } }) => {
   const [data, setData] = useState(dataset);
   const svgRef = useRef();
   const wrapperRef = useRef();
   const dimensions = useResizeObserver(wrapperRef);

   useEffect(() => {
      model.on("changed", async () => {
         const layout = await model.getLayout();
         const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
         const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
         const data = await extractData(qMatrix, qDimensionInfo, qMeasureInfo);
         setData(data);
      });
   }, [model]);

   const HandleClick = useCallback(
      async d => {
         console.log(d);
         await model.selectHyperCubeValues(
            "/qHyperCubeDef",
            0,
            [d.dimensions[0].qElemNumber], //pass an array to get data points
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

      // separate data into gender
      const maleTP = data.filter(
         d => d.dimensions[1].value === "M" && d.dimensions[0].value <= 100
      );
      const femaleTP = data.filter(
         d => d.dimensions[1].value === "F" && d.dimensions[0].value <= 100
      );
      const allTP = maleTP.concat(femaleTP);
      //margin

      const margin = {
         top: 10,
         bottom: 70,
         left: 30,
         right: 20
      };

      // set the initial svg element
      const svg = d3
         .select(svgRef.current)
         .attr("width", dimensions.width)
         .attr("height", dimensions.height);

      // ---------------------- scale
      const scale = {
         x: d3
            .scaleLinear()
            .domain(d3.extent(allTP.map(d => d.dimensions[0].value)))
            .range([margin.left, dimensions.width - margin.right]),

         y: d3
            .scaleLinear()
            .domain(d3.extent(allTP.map(d => d.measures[0].value)))
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

      // ------ draw axis on the svg ---------
      svg.select(".x-axis").call(axis.x);
      svg.select(".y-axis").call(axis.y);

      // remove all axes path and tick line
      svg.select(".x-axis")
         .select("path")
         .remove();
      svg.select(".y-axis")
         .select("path")
         .remove();
      svg.selectAll(".tick")
         .select("line")
         .remove();

      // text label for x axis

      svg.selectAll(".text-label")
         .data(["Age"])
         .join("text")
         .attr("class", "text-label")
         .attr(
            "transform",
            `translate(${dimensions.width / 2}, ${dimensions.height -
               margin.bottom +
               25})`
         )
         .style("text-anchor", "middle")
         .style("font-size", "0.6rem")
         .text(d => d);

      // add grid line in y axis
      const yGrid = () => d3.axisLeft(scale.y).ticks(9);
      svg.append("g")
         .attr("class", "grid")
         .attr("transform", `translate(${margin.left}, 0)`)
         .style("stroke-dasharray", "3,3")
         .style("opacity", 0.2)
         .call(
            yGrid()
               .tickSize(-dimensions.width + margin.left + margin.right)
               .tickFormat("")
         )
         .select("path")
         .remove();

      svg.selectAll("text").attr("opacity", 0.7);

      const colors = ["#4281A4", "#48A9A6", "#DB5461", "#E9D985", "#C0DF85"];
      // chart lines
      const line = d3
         .line()
         .x(d => scale.x(d.dimensions[0].value))
         .y(d => scale.y(d.measures[0].value))
         .defined(d => d !== null)
         .curve(d3.curveBasis);

      svg.selectAll(".female-line")
         .data([femaleTP])
         .join("path")
         .attr("class", "female-line")
         .attr("d", line)
         .attr("stroke", colors[0])
         .attr("fill", "none")
         .attr("stroke-width", 2)
         .attr("opacity", 0.8);

      svg.selectAll(".male-line")
         .data([maleTP])
         .join("path")
         .attr("class", "male-line")
         .attr("d", line)
         .attr("stroke", colors[2])
         .attr("fill", "none")
         .attr("stroke-width", 2)
         .attr("opacity", 0.8);

      var areaFunction = d3
         .area()
         .curve(d3.curveBasis)
         .x(d => scale.x(d.dimensions[0].value))
         .y0(dimensions.height - margin.bottom)
         .y1(d => scale.y(d.measures[0].value));

      var areaGradient = svg
         .append("defs")
         .append("linearGradient")
         .attr("id", "areaGradient")
         .attr("x1", "0%")
         .attr("y1", "0%")
         .attr("x2", "0%")
         .attr("y2", "100%");

      areaGradient
         .append("stop")
         .attr("offset", "50%")
         .attr("stop-color", colors[1])
         .attr("stop-opacity", 0.4);
      areaGradient
         .append("stop")
         .attr("offset", "80%")
         .attr("stop-color", "white")
         .attr("stop-opacity", 0);

      svg.selectAll(".female-area")
         .data([femaleTP])
         .join("path")
         .attr("class", "female-area")
         .attr("d", areaFunction)
         .attr("fill", "url(#areaGradient)");

      svg.selectAll(".male-area")
         .data([maleTP])
         .join("path")
         .attr("class", "male-area")
         .attr("d", areaFunction)
         .attr("fill", "url(#areaGradient)");
   }, [data, dimensions]);

   // handling the dropdown box for the opacity of the line charts
   const handleClick = value => {
      switch (value) {
         case "female":
            d3.select(".male-line").attr("opacity", 0.1);
            d3.select(".female-line").attr("opacity", 1);
            d3.select(".female-area").attr("opacity", 1);
            d3.select(".male-area").attr("opacity", 0);
            break;
         case "male":
            d3.select(".female-line").attr("opacity", 0.1);
            d3.select(".male-line").attr("opacity", 1);
            d3.select(".female-area").attr("opacity", 0);
            d3.select(".male-area").attr("opacity", 1);
            break;
         default:
            d3.select(".female-line").attr("opacity", 1);
            d3.select(".male-line").attr("opacity", 1);
            d3.select(".female-area").attr("opacity", 0.5);
            d3.select(".male-area").attr("opacity", 0.5);
            break;
      }
   };

   return (
      <div ref={wrapperRef} style={{ height: "100%" }}>
         <Header>
            <Button onClick={() => handleClick("all")}>All</Button>
            <Button onClick={() => handleClick("male")}>Male</Button>
            <Button onClick={() => handleClick("female")}>Female</Button>
         </Header>
         <svg ref={svgRef}>
            <g className="x-axis" />
            <g className="y-axis" />
         </svg>
      </div>
   );
};

export default Chart;

const Header = styled.div`
   display: flex;
   justify-content: end;
   margin: 0.5rem 0.5rem 0 0.25rem;
   p {
      font-size: 2vmin;
      opacity: 0.8;
   }
`;

const Button = styled.button`
   padding: 0 0.5rem;
   margin: 0.2rem 0.5rem 0;
   box-shadow: -4px -4px 6px #fff, 4px 4px 6px #babecc;
   color: #61677c;
   transition: all 0.2s ease-in-out;
   cursor: pointer;
   border-radius: 4px;
   &:hover {
      box-shadow: -2px -2px 6px #fff, 2px 2px 6px #babecc;
   }
   &:active {
      box-shadow: inset 1px 1px 3px #babecc, inset -1px -1px 3px #fff;
   }
`;
