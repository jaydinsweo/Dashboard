import { useState, useEffect, useContext } from "react";
import { AppContext } from "../enigma/AppProvider";

// Hooks with objectId argument
// returns model and layout of that object

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
