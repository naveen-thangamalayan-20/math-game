import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HomePageState = {
    isSoundOn: boolean;
};
  
const initialState: HomePageState = {
    isSoundOn: true,
};

const homePageSlice = createSlice({
    name: 'homePage',
    initialState,
    reducers: {
      updateGamePageState: (
        state: HomePageState,
        action: PayloadAction<Partial<HomePageState>>,
      ) => ({
        ...state,
        ...action.payload,
      }),
    },
});