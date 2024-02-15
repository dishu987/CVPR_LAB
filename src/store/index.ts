import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducers";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "reduxjs-toolkit-persist/lib/storage/session";
import thunk from "redux-thunk";


const persistConfig = {
    key: "root",
    storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const AppReduxStore = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
});


const persistor = persistStore(AppReduxStore);
export { AppReduxStore, persistor };
