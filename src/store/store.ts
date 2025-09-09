import { configureStore } from "@reduxjs/toolkit";
import userInfo from "../redux/user";
import userOffer from "../redux/offer-page";

export const store = configureStore({
  reducer: {
    userInfo,
    userOffer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
