import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInterface {
  company: {
    type: string;
    vid: string;
    name: string;
    category: [];
    price: string;
    coordinates: [number, number] | null;
    description: string;
    images: any[];
    videos: string[];
  };
}

const initialState: IInterface = {
  company: {
    type: "",
    vid: "",
    name: "",
    category: [],
    price: "",
    coordinates: null,
    description: "",
    images: [],
    videos: [],
  },
};

// Ստեղծել slice
export const userInfo = createSlice({
  name: "filter-params",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<any>) => {
      state.company = action.payload;
    },
  },
});

// Export actions and reducer
export const { setCompany } = userInfo.actions;
export default userInfo.reducer;
