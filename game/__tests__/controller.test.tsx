import useGameController from '../controller';
import * as redux from 'react-redux';
import * as React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Pressable, Text, TouchableHighlight} from 'react-native';
import {iif} from '../../utils/iif';
import {GameOverReason} from '../redux';

const mockStopWatchStart = jest.fn();
const mockStopWatchPause = jest.fn();
const mockStopWatchResume = jest.fn();
const mockStopWatchReset = jest.fn();
const gametotalTime = 10;
jest.mock('../main-play-area/stop-watch/stop-watch', () => ({
  ...jest.requireActual('../main-play-area/stop-watch/stop-watch'),
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    start: mockStopWatchStart,
    pause: mockStopWatchPause,
    resume: mockStopWatchResume,
    reset: mockStopWatchReset,
    timer: {
      current: gametotalTime,
    },
  })),
}));

describe('Game controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const SetupDummyComponent = () => {
    const controller = useGameController();
    return (
      <>
        <Pressable data-testid="restart-btn" onPress={controller.onRestartGame}>
          <Text>Restart</Text>
        </Pressable>
        <Pressable
          data-testid="back-btn"
          onPress={controller.onTouchBackButton}>
          <Text>Back</Text>
        </Pressable>
        <Pressable data-testid="resume-btn" onPress={controller.onResumeGame}>
          <Text>Resume</Text>
        </Pressable>
        <Pressable onPress={controller.onTimeOver}>
          <Text>RoundTimeOut</Text>
        </Pressable>
      </>
    );
  };

  it('should reset score and restart total time and current round time on game restart', () => {
    const mockDispatch = jest.fn();
    const mockedUseDispatch = jest
      .spyOn(redux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    const mockedUseSelector = jest
      .spyOn(redux, 'useSelector')
      .mockReturnValue([0, jest.fn()]);

    const {getByText} = render(<SetupDummyComponent />);
    fireEvent.press(getByText('Restart'));

    expect(mockedUseDispatch).toBeCalledTimes(3);
    iif(function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        payload: {currentRoundRemainingTime: 3, totalGameRemainingTime: 3},
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(4, {
        payload: {startTimer: true},
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(5, {
        payload: {problemsSolved: 0},
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(6, {
        payload: {showRestartModal: false},
        type: 'gamePage/updateGamePageState',
      });
    });
    expect(mockDispatch).toBeCalledTimes(6);
    iif(function assertStopWatchIsReseted() {
      expect(mockStopWatchStart).toBeCalledTimes(2);
    });
  });

  it('should pause the current round time and total time and modal should be shown when back button is pressed', () => {
    const mockDispatch = jest.fn();
    const mockedUseDispatch = jest
      .spyOn(redux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    const mockedUseSelector = jest
      .spyOn(redux, 'useSelector')
      .mockReturnValue([0, jest.fn()]);

    const {getByText} = render(<SetupDummyComponent />);
    fireEvent.press(getByText('Back'));

    expect(mockedUseDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledTimes(5);
    iif(
      function assertGameOverReasonIsUpdatedAndCurrentTimePausedAndModalIsShow() {
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          payload: {gameOverReason: 'Paused'},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(4, {
          payload: {showRestartModal: true},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(5, {
          payload: {startTimer: false},
          type: 'gamePage/updateGamePageState',
        });
      },
    );
    iif(function assertStopWatchIsPaused() {
      expect(mockStopWatchPause).toBeCalledTimes(1);
    });
  });

  it('should resume the current round time and total time and modal should be hidden when resume button is pressed', () => {
    const mockDispatch = jest.fn();
    const mockedUseDispatch = jest
      .spyOn(redux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    const mockedUseSelector = jest
      .spyOn(redux, 'useSelector')
      .mockReturnValue([0, jest.fn()]);

    const {getByText} = render(<SetupDummyComponent />);
    fireEvent.press(getByText('Resume'));

    expect(mockedUseDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledTimes(5);
    iif(
      function assertGameOverReasonIsUpdatedAndCurrentTimePausedAndModalIsShow() {
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          payload: {gameOverReason: GameOverReason.NONE},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(4, {
          payload: {showRestartModal: false},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(5, {
          payload: {startTimer: true},
          type: 'gamePage/updateGamePageState',
        });
      },
    );
    iif(function assertStopWatchIsResumed() {
      expect(mockStopWatchResume).toBeCalledTimes(1);
    });
  });

  describe("GameOver On TimeUp", () => {
    it('should reset score and restart total time and current round time and restart modal should be shown and update current score and not high score', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const problemsSolved = 2;
      const currentRoundTime = 4;
      const highScore = {
        problemsSolved: 10,
        speed: 1,
        totalTime: 10,
      };
      const mockedUseSelector = jest
        .spyOn(redux, 'useSelector')
        .mockReturnValue({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(currentRoundTime)
        .mockReturnValueOnce(problemsSolved)
        .mockReturnValueOnce({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(currentRoundTime)
        .mockReturnValueOnce(problemsSolved)
        .mockReturnValueOnce({progress: null, error: null, value: highScore});
  
      const {getByText} = render(<SetupDummyComponent />);
      fireEvent.press(getByText('RoundTimeOut'));
  
      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          payload: {gameOverReason: GameOverReason.TIME_UP},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(4, {
          payload: {showRestartModal: true},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(5, {
          payload: {startTimer: false},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(6, {
          payload: {totalTime: gametotalTime},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(7, {
          payload: {
            currentScore: {
              problemsSolved,
              speed: problemsSolved / gametotalTime,
              totalTime: gametotalTime,
            },
          },
          type: 'gamePage/updateGamePageState',
        });
      });
      iif(function assertHighScoreIsUpdated() {
        expect(mockDispatch).toBeCalledTimes(7);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });
  
    it('should reset score and restart total time and current round time and restart modal should be shown and update high score if current score is highScore', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const problemsSolved = 10;
      const currentRoundTime = 4;
      const highScore = {
        problemsSolved: 10,
        speed: 0.1,
        totalTime: 100,
      };
      // const mockedHighScoreStore = jest.fn();
      // HighScoreStore.store = mockedHighScoreStore;
      const mockedUseSelector = jest
        .spyOn(redux, 'useSelector')
        .mockReturnValue({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(currentRoundTime)
        .mockReturnValueOnce(problemsSolved)
        .mockReturnValueOnce({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(currentRoundTime)
        .mockReturnValueOnce(problemsSolved)
        .mockReturnValueOnce({progress: null, error: null, value: highScore});
  
      const {getByText} = render(<SetupDummyComponent />);
      fireEvent.press(getByText('RoundTimeOut'));
  
      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          payload: {gameOverReason: GameOverReason.TIME_UP},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(4, {
          payload: {showRestartModal: true},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(5, {
          payload: {startTimer: false},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(6, {
          payload: {totalTime: gametotalTime},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(7, {
          payload: {
            currentScore: {
              problemsSolved,
              speed: problemsSolved / gametotalTime,
              totalTime: gametotalTime,
            },
          },
          type: 'gamePage/updateGamePageState',
        });
      });
      iif(function assertHighScoreIsUpdated() {
        expect(mockDispatch).toBeCalledTimes(8);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });
  });

  describe("GameOver On WrongAnswer", () => {
    const SetupDummyComponentWithResult = (props:{ answer: number} ) => {
      const controller = useGameController();
      return (
        <>
          <Pressable data-testid="restart-btn" onPress={() => controller.validateResult(props.answer)}>
            <Text>ValidateResult</Text>
          </Pressable>
          <Text
            data-testid="result"
            onPress={controller.onTouchBackButton}>
            <Text>{controller.result}</Text>
          </Text>
        </>
      );
    };
    it('should reset score and restart total time and current round time and restart modal should be shown and update current score and not high score', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const problemsSolved = 2;
      const currentRoundTime = 4;
      const highScore = {
        problemsSolved: 10,
        speed: 1,
        totalTime: 10,
      };
      const wrongAnswer = Number.MAX_SAFE_INTEGER;
      const mockedUseSelector = jest
        .spyOn(redux, 'useSelector')
        .mockReturnValue({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(currentRoundTime)
        .mockReturnValueOnce(problemsSolved)
        .mockReturnValueOnce({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(currentRoundTime)
        .mockReturnValueOnce(problemsSolved)
        .mockReturnValueOnce({progress: null, error: null, value: highScore});
  
      const {getByText} = render(<SetupDummyComponentWithResult answer={wrongAnswer} />);
      fireEvent.press(getByText('ValidateResult'));
  
      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          payload: {gameOverReason: GameOverReason.WRONG_ANSWER},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(4, {
          payload: {showRestartModal: true},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(5, {
          payload: {startTimer: false},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(6, {
          payload: {totalTime: gametotalTime},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(7, {
          payload: {
            currentScore: {
              problemsSolved,
              speed: problemsSolved / gametotalTime,
              totalTime: gametotalTime,
            },
          },
          type: 'gamePage/updateGamePageState',
        });
      });
      iif(function assertHighScoreIsNotUpdated() {
        expect(mockDispatch).toBeCalledTimes(7);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });
  
    it('should reset score and restart total time and current round time and restart modal should be shown and update high score if current score is highScore', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const problemsSolved = 10;
      const currentRoundTime = 4;
      const highScore = {
        problemsSolved: 10,
        speed: 0.1,
        totalTime: 100,
      };
      const wrongAnswer = Number.MAX_SAFE_INTEGER;
      const mockedUseSelector = jest
        .spyOn(redux, 'useSelector')
        .mockReturnValue({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(currentRoundTime)
        .mockReturnValueOnce(problemsSolved)
        .mockReturnValueOnce({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(currentRoundTime)
        .mockReturnValueOnce(problemsSolved)
        .mockReturnValueOnce({progress: null, error: null, value: highScore});
  
      const {getByText} = render(<SetupDummyComponentWithResult answer={wrongAnswer}/>);
      fireEvent.press(getByText('ValidateResult'));
  
      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          payload: {gameOverReason: GameOverReason.WRONG_ANSWER},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(4, {
          payload: {showRestartModal: true},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(5, {
          payload: {startTimer: false},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(6, {
          payload: {totalTime: gametotalTime},
          type: 'gamePage/updateGamePageState',
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(7, {
          payload: {
            currentScore: {
              problemsSolved,
              speed: problemsSolved / gametotalTime,
              totalTime: gametotalTime,
            },
          },
          type: 'gamePage/updateGamePageState',
        });
      });
      iif(function assertHighScoreIsUpdated() {
        expect(mockDispatch).toBeCalledTimes(8);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });
  });
});
