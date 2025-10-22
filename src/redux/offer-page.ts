import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

interface IInterface {
  offer: IUserOffer;
}

const initialState: IInterface = {
  offer: {
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

export const userOffer = createSlice({
  name: "offer",
  initialState,
  reducers: {
    setCompanyType: (state, action: PayloadAction<string>) => {
      state.offer.type = action.payload;
    },
    setCompanyVid: (state, action: PayloadAction<string>) => {
      state.offer.vid = action.payload;
    },
    setCompanyName: (state, action: PayloadAction<string>) => {
      state.offer.name = action.payload;
    },
    setCompanyCategory: (state, action: PayloadAction<ICategory[]>) => {
      state.offer.category = action.payload;
    },
    setCompanyPrice: (state, action: PayloadAction<string>) => {
      state.offer.price = action.payload;
    },
    setCompanyCoordinates: (
      state,
      action: PayloadAction<[number, number] | null>,
    ) => {
      state.offer.coordinates = action.payload;
    },
    setCompanyDescription: (state, action: PayloadAction<string>) => {
      state.offer.description = action.payload;
    },
    setCompanyImages: (state, action: PayloadAction<any[]>) => {
      state.offer.images = action.payload;
    },
    setCompanyVideos: (state, action: PayloadAction<string[]>) => {
      state.offer.videos = action.payload;
    },
    initializeOffer: (state, action: PayloadAction<IUserOfferFront>) => {
      const offer = action.payload;
      state.offer = {
        type: offer.type,
        vid: offer.vid,
        name: offer.name,
        category: offer.category,
        price: offer.price,
        coordinates: offer.coordinates,
        description: offer.description,
        images: offer.images.map((img: string) => {
          // Convert string URLs to File objects for editing
          // This is a placeholder - we'll handle this differently in the component
          return img;
        }),
        videos: offer.videos,
      };
    },
    resetOffer: (state) => {
      state.offer = {
        type: "",
        vid: "",
        name: "",
        category: [],
        price: "",
        coordinates: null,
        description: "",
        images: [],
        videos: [],
      };
    },
  },
});

// Export actions and reducer
export const {
  setCompanyType,
  setCompanyVid,
  setCompanyName,
  setCompanyCategory,
  setCompanyPrice,
  setCompanyCoordinates,
  setCompanyDescription,
  setCompanyImages,
  setCompanyVideos,
  initializeOffer,
  resetOffer,
} = userOffer.actions;
// Selectors for better performance
export const selectOffer = (state: IUserOfferStore) => state.userOffer.offer;
export const selectOfferImages = createSelector(
  [selectOffer],
  (offer) => offer.images,
);
export const selectOfferVideos = createSelector(
  [selectOffer],
  (offer) => offer.videos,
);
export const selectOfferCategories = createSelector(
  [selectOffer],
  (offer) => offer.category,
);
export const selectOfferCoordinates = createSelector(
  [selectOffer],
  (offer) => offer.coordinates,
);

export default userOffer.reducer;
