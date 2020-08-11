import React from "react";
import styled from "styled-components";
import useGetModelLayout from "./hooks/useGetModelLayout";
import useGetSessionObject from "./hooks/useGetSessionObject";
import useGetDataFromLayout from "./hooks/useGetDataFromLayout";
import LineChart from "./components/charts/lineChart";
import PieChart from "./components/charts/pieChart";
import BarChart from "./components/charts/barChart";
import TableData from "./components/charts/tableData";
import PreIncomeClaimCosts from "./components/charts/tableData/def";

const App = () => {
   // get model and layout from the objectId
   const line = useGetModelLayout("144f304f-ffad-4f73-9ae1-0019d925c347");
   const pie = useGetModelLayout("EvVKv");
   const bar = useGetModelLayout("TXDzs");
   // table is different - need to create an object base on a definition object
   const table = useGetSessionObject(PreIncomeClaimCosts);

   // extract data from the layout/model
   const tableDataset = useGetDataFromLayout(table);

   return (
      <Layout>
         <Chart className="line">{line && <LineChart app={line} />}</Chart>
         <Chart className="pie">{pie && <PieChart app={pie} />}</Chart>
         <Chart className="bar">{bar && <BarChart app={bar} />}</Chart>
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
