import { createSlice, configureStore } from '@reduxjs/toolkit'
import { gamePageReducer } from './game/redux'


export const store = configureStore({
  reducer: {
      gamePage:gamePageReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;


