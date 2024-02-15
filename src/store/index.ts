import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducers";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./epic/rootEpic";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "reduxjs-toolkit-persist/lib/storage/session";
import thunk from "redux-thunk";


const persistConfig = {
    key: "root",
    storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const epicMiddleware = createEpicMiddleware();



const AppReduxStore = configureStore({
    reducer: persistedReducer,
    middleware: [epicMiddleware, thunk,],
});

epicMiddleware.run(rootEpic);

const persistor = persistStore(AppReduxStore);
export { AppReduxStore, persistor };
