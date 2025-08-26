import { configureStore } from "@reduxjs/toolkit";
import userInfo from "../redux/user";

export const store = configureStore({
  reducer: {
    userInfo,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
