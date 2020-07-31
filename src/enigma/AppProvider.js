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
            <AppContext.Provider value={app}>{children} </AppContext.Provider>
         )}
      </>
   );
};
export default AppProvider;
