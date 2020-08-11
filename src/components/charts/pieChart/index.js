import React from "react";
import Chart from "./chart";
import useGetDataFromLayout from "../../../hooks/useGetDataFromLayout";

const PieChart = ({ app }) => {
   const pieDataset = useGetDataFromLayout(app);
   return <>{pieDataset && <Chart dataset={pieDataset} app={app} />}</>;
};

export default PieChart;
