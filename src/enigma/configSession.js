import enigma from "enigma.js";
import schema from "enigma.js/schemas/12.67.2.json";
import SenseUtilities from "enigma.js/sense-utilities";

// enviroment variables - qlik server
const configs = {
   host: process.env.REACT_APP_QLIK_HOST,
   secure: process.env.REACT_APP_QLIK_SECURE,
   port: process.env.REACT_APP_QLIK_PORT,
   prefix: process.env.REACT_APP_QLIK_PREFIX,
   appId: process.env.REACT_APP_QLIK_APPID
};

// create session
const url = SenseUtilities.buildUrl(configs);
const session = enigma.create({ schema, url });

// open and close methods
const openSession = async () => {
   const qix = await session.open();
   const document = await qix.openDoc(configs.appId);
   return document;
};
const closeSession = async () => await session.close();

export { openSession, closeSession };
