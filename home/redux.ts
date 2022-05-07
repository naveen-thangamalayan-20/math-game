import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Sound from "react-native-sound";
import { Nullable } from "../utils/types";
import { getFailureSound, getWinningSound } from "./sound";



type HomePageState = {
    isSoundOn: boolean;
    resourcePE: {progress: null | string; error: null | string }

};
  
const initialState: HomePageState = {
    isSoundOn: true,
    resourcePE: {progress: null ,error: null},
};


const loadAllSounds = createAsyncThunk(
  'loadAllSounds',
  async () => {
    await getWinningSound();
    await getFailureSound();
   return {
    
   } 
  },
);

const homePageSlice = createSlice({
    name: 'homePage',
    initialState,
    reducers: {
      updateHomePageState: (
        state: HomePageState,
        action: PayloadAction<Partial<HomePageState>>,
      ) => ({
        ...state,
        ...action.payload,
      }),
    },
    extraReducers: builder => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder.addCase(loadAllSounds.fulfilled, (state, action) => {
        state.resourcePE = {
          progress: null,
          error: null,
        };
        // state.winningSound = action.payload.winningSound as Sound;
        // state.failingSound = action.payload.failingSound as Sound;
      });
      builder.addCase(loadAllSounds.pending, (state, action) => {
        state.resourcePE = {
          progress: "loading all sounds",
          error: null,
        }
      });
      builder.addCase(loadAllSounds.rejected, (state, action) => {
        state.resourcePE = {
          progress: null,
          error: "failed to all sounds",
        }
      });
    }
});

const {updateHomePageState} = homePageSlice.actions;

export const homePageReducer = homePageSlice.reducer;

export const HomePageActions = {
  updateIsSoundOn: (isSoundOn: boolean) => updateHomePageState({isSoundOn}),
  loadAllSounds,
}