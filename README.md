<p align="center">
Dashboard with Qlik Engine
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

-  [About the Project](#about-the-project)
   -  [Built With](#built-with)
-  [Getting Started](#getting-started)
   -  [Prerequisites](#prerequisites)
-  [Guide](#Guide)
   -  [Initialise Project](#initialise-project)
      -  [Installation](#installation)
      -  [Remove Unwanted Files](#remove-unwanted-files)

## About the Project

This project details everything you need to know to create a mashup with Qlik.

### Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

-  [ReactJs]
-  [Qlik Engine]
-  [Styled Components]

## Getting Started

To run in local, following these steps.

### Prerequisites

-  Qlik Server running on desktop or on server.
-  Npm or yarn

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

#### Remove Unwanted Files

Delete unnecessary files in `/src` folder

-  App.css
-  App.test.js
-  logo.svg
-  serviceWorker.js
-  setupTest.js

In our `index.css`, removes everything and replace with this [tailwind base.css](https://unpkg.com/tailwindcss@1.5.2/dist/base.css). It will make the style of our app consistent across different browser, you can have a read [here](https://tailwindcss.com/docs/preflight/#app).

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

```avascript
import React from "react";

const App = () => {
   return <>Hello World</>;
};

export default App;
```

That is it!.
