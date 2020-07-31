Install

```bash
npx create-react-app dashboard // <- project folder name
```

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

Now let's install some dependencies to work with:

```bash
npm install d3 enigma.js styled-components resize-observer-polyfill
```

or

```bash
yarn add d3 enigma.js styled-components resize-observer-polyfill
```

-  `d3` is our main data visualisation tool
-  `enigma.js` is the qlik library for communicate with Qlik Engine
-  `styled-components` css-in-js tool (optional)
-  `resize-obserer-polyfill` make our chart responsive
