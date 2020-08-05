import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useGetModelLayout from "./hooks/useGetModelLayout";
import useGetSessionObject from "./hooks/useGetSessionObject";
import extractData from "./helper/extractData";
import LineChart from "./components/charts/lineChart";
import PieChart from "./components/charts/pieChart";
import BarChart from "./components/charts/barChart";
import TableData from "./components/charts/tableData";
import PreIncomeClaimCosts from "./components/charts/tableData/def";

const App = () => {
   const [lineDataset, setLineDataset] = useState();
   const line = useGetModelLayout("144f304f-ffad-4f73-9ae1-0019d925c347");
   const [pieDataset, setPieDataset] = useState();
   const pie = useGetModelLayout("JLTp");
   const [barDataset, setBarDataset] = useState();
   const bar = useGetModelLayout("TXDzs");
   const [tableDataset, setTableDataset] = useState();
   const table = useGetSessionObject(PreIncomeClaimCosts);

   useEffect(() => {
      line &&
         (async () => {
            const { layout } = await line;
            //dimensions: tp age, tp gender
            //measures: count of claims
            const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
            const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
            const data = await extractData(
               qMatrix,
               qDimensionInfo,
               qMeasureInfo
            );
            setLineDataset(data);
         })();
   }, [line]);

   useEffect(() => {
      bar &&
         (async () => {
            const { layout } = await bar;
            //dimensions: car types
            //measures: total claims, total premium
            const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
            const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
            const data = await extractData(
               qMatrix,
               qDimensionInfo,
               qMeasureInfo
            );
            setBarDataset(data);
         })();
   }, [bar]);

   useEffect(() => {
      pie &&
         (async () => {
            const { layout } = await pie;
            //dimensions: tp age, tp gender
            //measures: count of claims
            const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
            const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
            const data = await extractData(
               qMatrix,
               qDimensionInfo,
               qMeasureInfo
            );
            setPieDataset(data);
         })();
   }, [pie]);

   useEffect(() => {
      table &&
         (async () => {
            const { layout } = await table;
            const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
            const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
            const data = await extractData(
               qMatrix,
               qDimensionInfo,
               qMeasureInfo
            );
            setTableDataset(data);
         })();
   }, [table]);
   return (
      <Layout>
         <Chart className="line">
            {lineDataset && <LineChart dataset={lineDataset} />}
         </Chart>
         <Chart className="pie">
            {pieDataset && <PieChart dataset={pieDataset} />}
         </Chart>
         <Chart className="bar">
            {barDataset && <BarChart dataset={barDataset} />}
         </Chart>
         <Chart className="table">
            {tableDataset && <TableData dataset={tableDataset} />}
         </Chart>
      </Layout>
   );
};

export default App;

// width, height, margin -
// the position of the layout div in the page
// rest - dealing with its child div

const Layout = styled.div`
   width: 50vw;
   height: 100vh;
   margin: 0 auto;
   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   align-items: center;
   .line {
      flex: 1;
   }
   .pie {
      flex: 0;
      border-radius: 50%;
   }
   .bar {
      flex-basis: 100%;
   }
   .table {
      flex-basis: 100%;
      min-width: 75vw;
      border-radius: 0;
   }
`;

const Chart = styled.div`
   margin: 1rem;
   height: 270px;
   min-width: 270px;
   border-radius: 0.5rem;
   background: #e0e5ec;
   border: 1px solid rgba(255, 255, 255, 0.1);
   box-shadow: 10px 10px 15px #a3b1c6, -10px -10px 15px #fff;
`;
