import React from "react";
import Chart from "./chart";
import useGetDataFromLayout from "../../../hooks/useGetDataFromLayout";

const BarChart = ({ app }) => {
   const barDataset = useGetDataFromLayout(app);
   return <>{barDataset && <Chart dataset={barDataset} app={app} />}</>;
};

export default BarChart;
