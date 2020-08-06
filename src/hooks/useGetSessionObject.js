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
