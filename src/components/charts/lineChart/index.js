import React from "react";
import Chart from "./chart";

const LineChart = ({ dataset }) => {
   // eslint-disable-next-line
   const data = dataset.filter(d => d.dimensions[0].value <= 100);

   return <>{data && <Chart dataset={data} />}</>;
};

export default LineChart;
