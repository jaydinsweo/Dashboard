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

```bash
├─
├─
├─
├─
|
└─
```

#### Remove Unwanted Files

Delete unnecessary files in `/src` folder

-  App.css
-  App.test.js
-  logo.svg
-  serviceWorker.js
-  setupTest.js

In our `index.css`, removes everything and replace with this [tailwind base.css](https://unpkg.com/tailwindcss@1.5.2/dist/base.css).
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

Since our requirement is only 4 charts, it pretty easy just to use `flexbox` to divided our layout.

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
