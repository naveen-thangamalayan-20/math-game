import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type GamePageState = {
  showRestartModal: boolean;
  currentGameRemainingTime: number;
  totalGameRemainingTime: number;
  isRoundAnswered: boolean;
};

const initialState: GamePageState = {
  showRestartModal: false,
  currentGameRemainingTime: 0,
  totalGameRemainingTime: 4,
  isRoundAnswered: false,
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

  updateCurrentGameRemainigTime: (remainingTime: number) =>
    updateGamePageState({currentGameRemainingTime: remainingTime}),

  updateTotalGameRemainingTime: (totalRemainingTime: number) =>
    updateGamePageState({totalGameRemainingTime: totalRemainingTime}),
  
  updateIsRoundAnswered: (isRoundAnswered: boolean) =>
    updateGamePageState({isRoundAnswered}),
};
