import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import highScore from './highscore';

export const INITIAL_TOTAL_ROUND_DURATION = 4;

export enum GameOverReason {
  TIME_UP = 'Time up',
  PAUSED = 'Paused',
  WRONG_ANSWER = 'Wrong answer',
  NONE = '',
}
export type HighScore = {
  speed: number;
  problemsSolved: number;
  totalTime: number;
};

export type PEV<T> = {
  progress: string | null;
  error: string | null;
  value: T;
};

export type PE = {
  progress: string | null;
  error: string | null;
};

type GamePageState = {
  showRestartModal: boolean;
  currentRoundRemainingTime: number;
  totalGameRemainingTime: number;
  startTimer: boolean;
  // problemsSolved: number;
  gameOverReason: GameOverReason;
  totalTime: number;
  currentScore: HighScore;
  highScorePEV: PEV<HighScore>;
  storeHighScore: PE;
};

const initialState: GamePageState = {
  showRestartModal: false,
  currentRoundRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
  totalGameRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
  startTimer: false,
  // problemsSolved: 0,
  gameOverReason: GameOverReason.NONE,
  totalTime: 0,
  currentScore: {
    speed: 0,
    problemsSolved: 0,
    totalTime: 0,
  },
  highScorePEV: {
    progress: null,
    error: null,
    value: {
      speed: 0,
      problemsSolved: 0,
      totalTime: 0,
    },
  },
  storeHighScore: {
    progress: null,
    error: null,
  },
};

const fetchHighScore = createAsyncThunk('fetchHighScore', async () => {
  return highScore.get();
});

const storeHighScore = createAsyncThunk(
  'storeHighScore',
  async (score: HighScore) => {
    return highScore.store(score);
  },
);

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
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchHighScore.fulfilled, (state, action) => {
      state.highScorePEV.value = {
        ...state.highScorePEV.value,
        ...action.payload,
      };
      state.highScorePEV.progress = null;
      state.highScorePEV.error = null;
    });
    builder.addCase(fetchHighScore.pending, (state, action) => {
      state.highScorePEV.progress = 'fetching highscore';
      state.highScorePEV.error = null;
    });
    builder.addCase(storeHighScore.fulfilled, (state, action) => {
      state.highScorePEV.value = {
        ...state.highScorePEV.value,
        ...action.payload,
      };
      state.storeHighScore.progress = null;
      state.storeHighScore.error = null;
    });
    builder.addCase(storeHighScore.pending, (state, action) => {
      state.storeHighScore.progress = 'storing highscore';
      state.storeHighScore.error = null;
    });
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

  updateStartTimer: (startTimer: boolean) => updateGamePageState({startTimer}),

  // updateProblemsSolved: (score: number) => updateGamePageState({problemsSolved: score}),

  updateGameOverReason: (reason: GameOverReason) =>
    updateGamePageState({gameOverReason: reason}),

  updateTotalTime: (totalTime: number) => updateGamePageState({totalTime}),
  fetchHighScore,
  storeHighScore,

  updateGameTime: (
    currentRoundRemainingTime: number,
    totalGameRemainingTime: number,
  ) =>
    updateGamePageState({
      totalGameRemainingTime,
      currentRoundRemainingTime,
    }),

  updateCurrentScore: (currentScore: HighScore) =>
    updateGamePageState({currentScore}),
};
