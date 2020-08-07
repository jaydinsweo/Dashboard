import { useState, useEffect } from "react";
import extractData from "../helper/extractData";

// the parameter object contains the model and layout of a chart from qlik
// extract the data into a single format for d3 using extractData function

const useGetDataFromLayout = object => {
   const [data, setData] = useState();

   useEffect(() => {
      object &&
         (async () => {
            const { layout } = await object;
            const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
            const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
            const data = await extractData(
               qMatrix,
               qDimensionInfo,
               qMeasureInfo
            );
            setData(data);
         })();
   }, [object]);

   return data;
};
export default useGetDataFromLayout;
