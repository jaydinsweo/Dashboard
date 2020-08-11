const extractData = async (qMatrix, qDimensionInfo, qMeasureInfo) =>
   await qMatrix.map(x => ({
      qElemNumber: x[0].qElemNumber,
      dimensions: x.slice(0, qDimensionInfo.length).map((d, i) => ({
         label: qDimensionInfo[i].qFallbackTitle,
         value: d.qText,
         qElemNumber: d.qElemNumber
      })),
      measures: x.slice(qDimensionInfo.length).map((d, i) => ({
         label: qMeasureInfo[i].qFallbackTitle,
         value: d.qNum,
         qElemNumber: d.qElemNumber
      }))
   }));

export default extractData;
