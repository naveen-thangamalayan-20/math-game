import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export const INITIAL_TOTAL_ROUND_DURATION = 3;

export enum GameOverReason {
  TIME_UP="Time up",
  PAUSED="Paused",
  WRONG_ANSWER="Wrong answer",
  NONE="",
}

type GamePageState = {
  showRestartModal: boolean;
  currentRoundRemainingTime: number;
  totalGameRemainingTime: number;
  startTimer: boolean;
  score: number;
  gameOverReason: GameOverReason;
  totalTime: number;
};

const initialState: GamePageState = {
  showRestartModal: false,
  currentRoundRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
  totalGameRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
  startTimer: false,
  score: 0,
  gameOverReason: GameOverReason.NONE,
  totalTime: 0,
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

  updateScore: (score: number) =>updateGamePageState({score}),

  updateGameOverReason: (reason: GameOverReason) =>updateGamePageState({gameOverReason: reason}),

  updateTotalTime: (totalTime: number) =>updateGamePageState({totalTime}),

  updateGameTime: (currentRoundRemainingTime: number, totalGameRemainingTime: number) => updateGamePageState({
    totalGameRemainingTime,
    currentRoundRemainingTime
  }),
};
