import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialSearchFilterState: IDataSearchFilter = {
  type: "",
  vid: "",
  activity: "",
  category: null,
  price: null,
  countryCompanyId: null,
};

export const searchFilter = createSlice({
  name: "searchFilter",
  initialState: initialSearchFilterState,
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
    setActivity: (state, action: PayloadAction<"barter" | "collaboration" | "">) => {
      state.activity = action.payload;
    },
    setCountryCompanyId: (state, action: PayloadAction<number | null>) => {
      state.countryCompanyId = action.payload;
    },
    resetSearchFilter: (state) => {
      state.type = "";
      state.vid = "";
      state.category = null;
      state.price = null;
      state.countryCompanyId = null;
    },
  },
});

// Export actions and reducer
export const {
  setType,
  setVid,
  setActivity,
  setCategoryStore,
  setPrice,
  setCountryCompanyId,
  resetSearchFilter,
} = searchFilter.actions;
export default searchFilter.reducer;
