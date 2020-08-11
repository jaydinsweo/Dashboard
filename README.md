<p align="center">
Dashboard with Qlik Engine
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

-  [Getting Started](#getting-started)
   -  [Prerequisites](#prerequisites)
   -  [Built With](#built-with)
-  [Guide](#Guide)
   -  [1. Initialise Project](#initialise-project)
      -  [Installation](#installation)
      -  [Remove Unwanted Files](#remove-unwanted-files)
   -  [2. Qlik Connection](#qlik-connection)
   -  [3. Dashboard Layout](#dashboard-layout)
   -  [4. Qlik Object](#qlik-object)
      -  [Single Dimension and Single Measure](#single)
      -  [Multi Dimensions and Sigle Measure](#multi-dims)
      -  [Single Dimensions and Multi Measures](#multi-meas)
      -  [Data](#data)
   -  [5. Charts](#chart)
   -  [6. Make Selection](#make-selection)

## Getting Started

To run in local, following these steps.

### Prerequisites

-  Qlik Server running on desktop or on server.
-  Npm or yarn

### Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

-  [ReactJs](https://github.com/facebook/react)
-  [Enigma.js](https://github.com/qlik-oss/enigma.js)
-  [Styled Components](https://github.com/styled-components/styled-components)
-  [Resize Observer Polyfill](https://github.com/que-etc/resize-observer-polyfill)

## Guide

This section will details on how to set up our mashup.

### Initialise Project

#### Installation

```yarn
npx create-react-app dashboard
cd dashboard
yarn add d3 enigma.js styled-components resize-observer-polyfill
```

-  `d3` is our main data visualisation tool
-  `enigma.js` is the qlik library for communicate with Qlik Engine
-  `styled-components` css-in-js tool (optional)
-  `resize-obserer-polyfill` make our chart responsive

#### Project Layout

```
. src/
├─ components
   ├─ barChart/
   ├─ lineChart/
   ├─ pieChart/
   └─ tableData/
├─ enigma
   ├─ AppProvider.js
   └─ configSession.js
├─ helper
   └─ extractData.js
├─ hooks
   ├─ useGetDataFromLayout.js
   ├─ useGetModelLayout.js
   ├─ useGetSessionObject.js
   └─ useResizeObserer.js
├─ App.js
├─ index.js
└─ index.css
```

#### Remove Unwanted Files

Delete unnecessary files in `/src` folder

-  App.css
-  App.test.js
-  logo.svg
-  serviceWorker.js
-  setupTest.js

In our `index.css`, removes everything and replace with this [tailwind base css](https://unpkg.com/tailwindcss@1.5.2/dist/base.css).
It will make the style of our app consistent across different browser, you can have a read [here](https://tailwindcss.com/docs/preflight/#app).

In our `index.js`

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>,
   document.getElementById("root")
);
```

and in our `App.js`

```javascript
import React from "react";

const App = () => {
   return <>Hello World</>;
};

export default App;
```

That is it!.

### Qlik Connection

1. Create a folder `enigma` inside `/src`.

2. create a `configSession.js` file in the newly created folder

What is the config do? The configSession is to

The `configSession.js` allows us to open and close sessions of our project.

```javascript
import enigma from "enigma.js";
import schema from "enigma.js/schemas/12.67.2.json";
```

first we need to create a session. A session is ...
To create a session we needs two things: a schema and a url to the qlik server.
[READ THE DOC](https://github.com/qlik-oss/enigma.js/blob/master/docs/api.md#enigmacreateconfig)

```javascript
const session = enigma.create({
   schema,
   url
});
```

Qlik has multiple schemas available on their [Github repo](https://github.com/qlik-oss/enigma.js/tree/master/schemas). Best bet is to pick the most recent schema available, [schema 16.67.2.json](https://github.com/qlik-oss/enigma.js/blob/master/schemas/12.67.2.json).

The second thing is the url to the Qlik server instance.

We should not store any information about our Qlik server on our code. Which is why, following best practice, we must store any sensitive information on dotenv file. Read more [here](https://medium.com/@maxbeatty/environment-variables-in-node-js-28e951631801)
In our main folder, create a file `.env`

```bash
vim .env
```

For CRA, we define our enviroment variables starting with `REACT_APP_` - read more [here](https://create-react-app.dev/docs/adding-custom-environment-variables/).

The url needs to have a `host`, `port`, `secure` and `prefix` enviroment variables.

```dotenv
REACT_APP_QLIK_HOST=localhost
REACT_APP_QLIK_PORT=4848
REACT_APP_QLIK_PREFIX=
REACT_APP_QLIK_SECURE=true
REACT_APP_QLIK_APPID=Insurance Claims 2020.qvf
```

Remember that our ReactJs talks to our Qlik Engine through WebSocket.
Which is why the url must contain a proper websocket URL to QIX Engine.

To make use of our enviroment variables, we create an object in the `configSession.js` to hold all the required variables to make an WebSocket url.

```javascript
const config = {
   host: process.env.REACT_APP_QLIK_HOST,
   port: process.env.REACT_APP_QLIK_PORT,
   secure: process.env.REACT_APP_QLIK_SECURE,
   prefix: process.env.REACT_APP_QLIK_PREFIX,
   appId: process.env.REACT_APP_QLIK_APPID
};
```

We can do create our own url:

```javascript
const url = (host, port) => {
   const portUrl = id => (id ? `:${id}` : ``);
   return `ws://${host}${portUrl(port)}/app`;
};
```

Alternative, we can use a library from `enigma.js` to generate QIX WebSocket URLs using the our config object.
Read the [SenseUtilities API](https://github.com/qlik-oss/enigma.js/blob/master/docs/api.md#sense-utilities-api)

```javascript
const SenseUtilities = require("enigma.js/sense-utilities");
const url = SenseUtilities.buildUrl(config);
```

We create two functions to work with our session. Read the [Session API](https://github.com/qlik-oss/enigma.js/blob/master/docs/api.md#session-api).

```javascript
const openSession = async () => {
   const qix = await session.open();
   const document = await qix.openDoc(config.appId);
   return document;
};

const closeSession = async () => await session.close();

export { openSession, closeSession };
```

So far, our `configSession.js` look like this:

```javascript
import enigma from "enigma.js";
import schema from "enigma.js/schemas/12.67.2.json";
import SenseUtilities from "enigma.js/sense-utilities";

const configs = {
   host: process.env.REACT_APP_QLIK_HOST,
   secure: process.env.REACT_APP_QLIK_SECURE,
   port: process.env.REACT_APP_QLIK_PORT,
   prefix: process.env.REACT_APP_QLIK_PREFIX,
   appId: process.env.REACT_APP_QLIK_APPID
};

const url = SenseUtilities.buildUrl(configs);

const session = enigma.create({ schema, url });

const openSession = async () => {
   const qix = await session.open();
   const document = await qix.openDoc("Insurance Claims 2020.qvf");
   return document;
};

const closeSession = async () => await session.close();

export { openSession, closeSession };
```

Now we have a way of connecting to the QIX Engine and closing it. So how do we apply this to our app?

To use our openSession and closeSession, we created a context API to provides our mashup an overlay of staying open wen using the app.

Document about Context API - [reactjs.org](https://reactjs.org/docs/context.html),

Create a `AppProvider.js` in `enigma` folder

```javascript
import React, { useState, useEffect, createContext } from "react";
import { openSession, closeSession } from "./configSession";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
   const [app, setApp] = useState();

   useEffect(() => {
      (async () => setApp(await openSession()))();
      return closeSession;
   }, []);

   return (
      <>
         {app && (
            <AppContext.Provider value={app}> {children}</AppContext.Provider>
         )}
      </>
   );
};

export default AppProvider;
```

Now that we have a way to connect to qlik and interact with the Qlik Engine. Before we are going to do anything else - we need to import our `AppProvider` function in `index.js` and wrap it around the `App.js` function.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppProvider from "./enigma/appProvider";
import App from "./App";

ReactDOM.render(
   <React.StrictMode>
      <AppProvider>
         <App />
      </AppProvider>
   </React.StrictMode>,
   document.getElementById("root")
);
```

### Dashboard Layout

Before we going to qlik and d3, we need to do a quick session of our dashboard layout because it is important that we know what we need to do with our chart.

Recommended: [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)and [css grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout).

With these two tools, we can do pretty much everything from a simple centered columns to customise newspaper section, that fit in every screen size.

Since our dashboard has 4 charts, it pretty easy just to use `flexbox` to divided our layout.

```chart
 [  ] [  ]       [ line ][pie]
 [  ] [  ]  =>   [    bar    ]
 [  ] [  ]       [   table   ]
```

```javascript
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
`;
```

![Layout with Flexbox](https://github.com/jaynguyens/Dashboard/blob/master/.github/images/flex-layout.png)

Now we can do a bit more styling to our layout.
I'm using a new UI/UX trend - neomorphism. The color scheme is from [uxplanet.org](https://uxplanet.org/neumorphism-in-user-interface-tutorial-c353698ac5c0)

```javascript
const Chart = styled.div`
   //...
   border-radius: 0.5rem;
   background: #e0e5ec;
   border: 1px solid rgba(255, 255, 255, 0.1);
   box-shadow: 10px 10px 15px #a3b1c6, -10px -10px 15px #fff;
`;
```

### Qlik Object

Let's create a folder called `hooks` inside of `src` folder to contains our custom hooks.

In order to extract the data from qlik, we need to get the `objectId` of the chart that we need to extract from. On qlik server (localhost:4848), on the chart of the app that we specified in our `.env` file - you can right click on the chart and select `Embed Chart`.

![Get ObjectId From Qlik](https://github.com/jaynguyens/Dashboard/blob/master/.github/images/2020-08-07%2009.07.39.gif)

Let's create a file called `useGetModelLayout.js` in `src/hooks/` folder, this is our hooks to get the `model` and `layout` from qlik object.

```javascript
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../enigma/AppProvider";

const useGetModelLayout = objectId => {
   const [data, setData] = useState();
   const app = useContext(AppContext);

   useEffect(() => {
      (async function() {
         const model = await app.getObject(objectId);
         const layout = await model.getLayout();
         setData({ model, layout });
      })();
   }, [app, objectId]);
   return data;
};

export default useGetModelLayout;
```

We import the `AppContext` which contains all the information about our Qlik App. When we call `app.getObject(objectId)` it returns an object data.

![Model](https://github.com/jaynguyens/Dashboard/blob/master/.github/images/ObjectData.png)

Without going in-depth or a specific case, `model` doesn't provides much useful information. However, `model` does provides us with a list of methods that we can call and extract data from the it - the full lists of methods are available under the `<prototype>` key.

![List Of Model's Methods](https://github.com/jaynguyens/Dashboard/blob/master/.github/images/ListOfModelMethods.gif)

`model.getLayout()` will return the layout that includes useful information about our chart, particularly in the `qHyperCube` key.

![Layout](https://github.com/jaynguyens/Dashboard/blob/master/.github/images/Layout.png)

#### Extract Data - Dimensions and Measures

Now that we have `layout` of an chart. We are going to make use of 3 pieces of information from `layout.qHyperCube`: `qDimensionInfo`, `qMeasureInfo`,and `qDataPages[0].qMatrix`. Create another hooks called `useGetDataFromLayout.js`.

```javascript
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
```

With `qMtrix`, `qDimensionInfo`, and `qMeasureInfo` we can extract into a more readable form. The `extractData` function returns an array with `dimensions` and `measures` contains the title and value.

```javascript
const extractData = async (qMatrix, qDimensionInfo, qMeasureInfo) => {
   return await qMatrix.map(x => ({
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
};

export default extractData;
```

![Dataset](https://github.com/jaynguyens/Dashboard/blob/master/.github/images/Dataset.png)

#### Data

However for table, we can't use `useGetModelLayout` function because:

-  qMatrix is empty
-  app.GetObject

We need to use a different `app` method. The one I'm going to use is `app.createSessionObject(definition)` where we pass a definition object instead of an object id. The definition object consists of:

-  `qInfo` - description of the chart
-  `qHyperCubeDef` - contains `qDef` for dimensions and measures
-  `qInitialDataFetch` - the shape of our data

```javascript
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
```

As you can see, there are two ways to for define `qDef`:

-  `qFieldDefs`
-  `qDef`

`qFieldDefs` is predefined `fields` - we can check it on our Qlik server.
`qDef` is where we include the calculation of the field.

Again, we want to use the same format as our previous hooks `useGetModelLayout` so we going to return the `{model, layout}`. The `layout` here is exactly the same as the `useGetModelLayout`.

```javascript
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../enigma/AppProvider";

const useGetSessionObject = definition => {
   const [data, setData] = useState();
   const app = useContext(AppContext);

   useEffect(() => {
      (async () => {
         const model = await app.createSessionObject(definition);
         const layout = await model.getLayout();
         setData({ model, layout });
      })();
   }, [app, definition]);
   return data;
};

export default useGetSessionObject;
```

Here we can use our previous created function `useGetDataFromLayout` to extract the data for table.

```javascript
const table = useGetSessionObject(PreIncomeClaimCosts);
const dataset = useGetDataFromLayout(table);
```

### Chart

Now we have the data in a form that we could work with. For plotting the chart, be sure you understand ![the margin convention](https://observablehq.com/@d3/margin-convention).

The reason why we have a `<div ref={wrapperRef}>...</div>` around our `svg` is that the `useResizeObserver` only work for the `div` element.

In _almost_ every charts we need to have `scale` and `axis` because d3 need to know how many pixel it need to allocates to the each data points given the dimensions of the `svg` element and the `[min,max]` of the data points.

Our chart would be incomplete without interactivity. D3 selection has a good reference on ![handling events](https://github.com/d3/d3-selection#handling-events) and also checkout ![Chapter 4 of D3 for Impatient by Philipp K. Janert](https://www.oreilly.com/library/view/d3-for-the/9781492046783/ch04.html). You can also checkout the MDN web docs on [event refernce](https://developer.mozilla.org/en-US/docs/Web/Events) for the full list of DOM Events.

```javascript
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "../../../hooks/useResizeObserver";

const Chart = ({ dataset }) => {
   const wrapperRef = useRef();
   const svgRef = useRef();
   const dimensions = useResizeObserver(wrapperRef);

   useEffect(() => {
      if (!dimensions) return;
      const margin = {
         top: 40,
         bottom: 50,
         left: 30,
         right: 30
      };
      const svg = d3
         .select(svgRef.current)
         .attr("width", dimensions.width)
         .attr("height", dimensions.height);

      // ---------------------- scale
      const scale = {};
      // ----------------------- axis
      const axis = {};

      // --------------------- calling axis
      // Plot the axes on the chart

      svg.select(".x-axis").call(axis.x);
      svg.select(".y-axis").call(axis.y);

      // --------------------- generates svg shapes to visualise the data

      const dataPoints = svg
         .selectAll(".data-points")
         .data(dataset)
         .join("g")
         .attr("class", "data-points");

      // --------------------- events
      const onClick = d => {};
      const onMouseOver = d => {};
      const onMouseLeave = d => {};

      dataPoints
         .on("click", onClick)
         .on("mouseover", onMouseOver)
         .on("mouseleave", onMouseLeave);
   }, [dataset, dimensions]);

   return (
      <div ref={wrapperRef}>
         <svg ref={svgRef}>
            <g className="x-axis" />
            <g className="y-axis" />
         </svg>
      </div>
   );
};

export default Chart;
```

### Make Selection

1. Decided what on the chart do you know to select
2. Add event listener to that class
3. Use `model.selectHyperCubeValues` to query the data
4. `model.getLayout()` to get the new layout
5. Extract data from layout and use it to update the chart

Our initial code would look like this

```javascript
const onClick = async d => HandleClick(d);
svg.select(".piechart").on("click", onClick);
```

We add an event listener `click` on each pieces of our pie chart. When a user clicks on a pie it will trigger `HandleClick` function.

```javascript
const HandleClick = useCallback(
   async d => {
      await model.selectHyperCubeValues(
         "/qHyperCubeDef",
         0,
         [d.dimensions[0].qElemNumber], //pass an array to get data points
         false
      );
      const layout = await model.getLayout();
      const { qDimensionInfo, qMeasureInfo } = await layout.qHyperCube;
      const qMatrix = await layout.qHyperCube.qDataPages[0].qMatrix;
      const data = await extractData(qMatrix, qDimensionInfo, qMeasureInfo);
      setData(data);
   },
   [model]
);
```
