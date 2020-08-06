import React from "react";
import styled from "styled-components";

const TableData = ({ dataset }) => {
   const dims = dataset[0].dimensions.map(d => d.label);
   const meas = dataset[0].measures.map(d => d.label);
   const head = dims.concat(meas);

   return (
      <Div>
         <Table>
            <Thead>
               <tr>
                  {head.map(title => (
                     <th> {title}</th>
                  ))}
               </tr>
            </Thead>
            <Tbody>
               {dataset.map(data => (
                  <tr>
                     {data.dimensions.map(d => (
                        <th> {d.value}</th>
                     ))}
                     {data.measures.map(d => (
                        <th> {!isNaN(d.value) ? d.value.toFixed(2) : "-"}</th>
                     ))}
                  </tr>
               ))}
            </Tbody>
         </Table>
      </Div>
   );
};

export default TableData;

const Div = styled.div`
   height: 100%;
   overflow-y: scroll;
   box-sizing: border-box;
`;
const Table = styled.table`
   width: 100%;
   font-size: 2vmin;
   border: 1px solid black;
`;

const Thead = styled.thead`
   background-color: #4281a4;
   border: 1px solid black;

   th {
      border: 1px solid black;
   }
`;

const Tbody = styled.tbody`
   th {
      font-weight: normal;
      border: 1px solid black;
   }
`;
