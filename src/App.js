import React from "react";
import styled from "styled-components";

const App = () => {
   return (
      <Layout>
         <Chart className="line"></Chart>
         <Chart className="pie"></Chart>
         <Chart className="bar"></Chart>
         <Chart className="table"></Chart>
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
   }
   .bar {
      flex-basis: 100%;
   }
   .table {
      flex-basis: 100%;
   }
`;

const Chart = styled.div`
   margin: 0.5rem 1rem;
   height: 270px;
   min-width: 270px;
   border-radius: 0.5rem;
   background: #e0e5ec;
   border: 1px solid rgba(255, 255, 255, 0.1);
   box-shadow: 10px 10px 15px #a3b1c6, -10px -10px 15px #fff;
`;
