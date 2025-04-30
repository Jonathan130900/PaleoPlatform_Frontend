import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import articoloReducer from "./articoloSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articoli: articoloReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
