import React from "react";
import Chart from "./chart";
import useGetDataFromLayout from "../../../hooks/useGetDataFromLayout";

const LineChart = ({ app }) => {
   const lineDataset = useGetDataFromLayout(app);
   return <>{lineDataset && <Chart dataset={lineDataset} app={app} />}</>;
};

export default LineChart;
