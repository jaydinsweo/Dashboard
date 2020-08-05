const PreIncomeClaimCosts = {
   qInfo: {
      qType: "stackbarchart"
   },
   qHyperCubeDef: {
      qDimensions: [
         {
            qDef: {
               qFieldDefs: ["Customer Name"]
            }
         },
         {
            qDef: {
               qFieldDefs: ["Vehicle Rating Group"]
            }
         }
      ],
      qMeasures: [
         {
            qDef: {
               qDef: "Count([Policy Id])",
               qLabel: "Count of Policies"
            }
         },
         {
            qDef: {
               qDef: "Sum([Total Claim Cost])/Sum([Annual Premium])",
               qLabel: "Loss Ratio"
            }
         },
         {
            qDef: {
               qDef: "Avg([Annual Premium])",
               qLabel: "Average Annual Premium"
            }
         },
         {
            qDef: {
               qDef: "Avg([Total Claim Cost])",
               qLabel: "Average Claim Costs"
            }
         },
         {
            qDef: {
               qDef: "Max([Total Claim Cost])",
               qLabel: "Largest Claim"
            }
         },
         {
            qDef: {
               qDef: "Min([Total Claim Cost])",
               qLabel: "Smallest Claim"
            }
         }
      ],
      qAlwaysFullyExpanded: true,
      qInitialDataFetch: [
         {
            qTop: 0,
            qLeft: 0,
            qWidth: 8,
            qHeight: 100
         }
      ]
   }
};

export default PreIncomeClaimCosts;
