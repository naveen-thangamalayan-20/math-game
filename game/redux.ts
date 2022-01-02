import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type GamePageState = {
  showRestartModal: boolean;
};

const initialState: GamePageState = {
  showRestartModal: false,
};

const gamePageSlice = createSlice({
  name: 'gamePage',
  initialState,
  reducers: {
    updateGamePageState: (
      state: GamePageState,
      action: PayloadAction<Partial<GamePageState>>,
    ) => ({
      ...state,
      ...action.payload,
    }),
  },
});

const {updateGamePageState} = gamePageSlice.actions;

export const gamePageReducer = gamePageSlice.reducer;

export const GamePageActions = {
  setShowRestartModal: (showModal: boolean) =>
    updateGamePageState({showRestartModal: showModal}),
};
