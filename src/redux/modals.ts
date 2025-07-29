import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInterface {
  modalSelectedHouse: IHouse | null;
  objectInfo: IObjectData[] | null;
}

// Սկզբնական state
const initialState: IInterface = {
  modalSelectedHouse: null,
  objectInfo: null,
};

// Ստեղծել slice
export const modalsSite = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setHouse: (state, action: PayloadAction<IHouse | null>) => {
      state.modalSelectedHouse = action.payload;
    },
    setObjectInfo: (state, action: PayloadAction<IObjectData[] | null>) => {
      state.objectInfo = action.payload;
    },
  },
});

// Export actions and reducer
export const { setHouse, setObjectInfo } = modalsSite.actions;
export default modalsSite.reducer;
