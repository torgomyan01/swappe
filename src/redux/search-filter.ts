import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IDataSearchFilter = {
  type: "product",
  vid: "offline",
  category: null,
  price: null,
  countryCompanyId: null,
};

export const searchFilter = createSlice({
  name: "searchFilter",
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<OfferType>) => {
      state.type = action.payload;
    },
    setVid: (state, action: PayloadAction<OfferVid>) => {
      state.vid = action.payload;
    },
    setCategoryStore: (state, action: PayloadAction<ICategory[] | null>) => {
      state.category = action.payload;
    },
    setPrice: (state, action: PayloadAction<[number, number] | null>) => {
      state.price = action.payload;
    },
    setCountryCompanyId: (state, action: PayloadAction<number | null>) => {
      state.countryCompanyId = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setType,
  setVid,
  setCategoryStore,
  setPrice,
  setCountryCompanyId,
} = searchFilter.actions;
export default searchFilter.reducer;
