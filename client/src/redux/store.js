import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist/es";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import { listingsApi } from "./api/apiSlice";

const rootReducer = combineReducers({
  user: userReducer,
  [listingsApi.reducerPath]: listingsApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(listingsApi.middleware),
});

export const persistor = persistStore(store);
