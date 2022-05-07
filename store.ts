import {createSlice, configureStore} from '@reduxjs/toolkit';
import {gamePageReducer} from './game/redux';
import { homePageReducer } from './home/redux';

export const store = configureStore({
  reducer: {
    gamePage: gamePageReducer,
    homePage: homePageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
