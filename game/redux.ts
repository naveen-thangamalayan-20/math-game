import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export const INITIAL_TOTAL_ROUND_DURATION = 5;


type GamePageState = {
  showRestartModal: boolean;
  currentRoundRemainingTime: number;
  totalGameRemainingTime: number;
  startTimer: boolean;
};

const initialState: GamePageState = {
  showRestartModal: false,
  currentRoundRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
  totalGameRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
  startTimer: false,
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

  updateCurrentRoundRemainingTime: (remainingTime: number) =>
    updateGamePageState({currentRoundRemainingTime: remainingTime}),

  updateTotalGameRemainingTime: (totalRemainingTime: number) =>
    updateGamePageState({totalGameRemainingTime: totalRemainingTime}),
  
  // updateIsRoundAnswered: (isRoundAnswered: boolean) =>
  //   updateGamePageState({isRoundAnswered}),

  updateStartTimer: (startTimer: boolean) =>updateGamePageState({startTimer}),

  updateGameTime: (currentRoundRemainingTime: number, totalGameRemainingTime: number) => updateGamePageState({
    totalGameRemainingTime,
    currentRoundRemainingTime
  }),
};
