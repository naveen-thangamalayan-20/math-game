import useGameController, {GameProps} from '../controller';
import * as redux from 'react-redux';
import * as React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Pressable, Text, TouchableHighlight} from 'react-native';
import {iif} from '../../utils/iif';
import {
  GameOverReason,
  HighScore,
  INITIAL_TOTAL_ROUND_DURATION,
} from '../redux';
import * as problemGenerator from '../problem-generator';
import {CellType} from '../problem-generator';

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

const createGameProps = (options: {navigation?: any}) => ({
  navigation: options.navigation ?? jest.fn(),
});

describe('Game controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  const mockUseSelector = (currentScore: HighScore, highScore: HighScore, gameOverReason = GameOverReason.NONE) => {
    return (
      jest
        .spyOn(redux, 'useSelector')
        .mockReturnValue({progress: null, error: null, value: highScore})
        // .mockReturnValue(GameOverReason.NONE)
        .mockReturnValueOnce(currentScore)
        .mockReturnValueOnce({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(gameOverReason)
        .mockReturnValueOnce(currentScore)
        .mockReturnValueOnce({progress: null, error: null, value: highScore})
        .mockReturnValueOnce(gameOverReason)
    );
  };

  const SetupDummyComponent = () => {
    const controller = useGameController(createGameProps({}));
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
        payload: {
          currentRoundRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
          totalGameRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
        },
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(4, {
        payload: {
          currentScore: {
            problemsSolved: 0,
            speed: 0,
            totalTime: 0,
          },
        },
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(5, {
        payload: {showRestartModal: false},
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(6, {
        payload: {startTimer: true},
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(7, {
        payload: {gameOverReason: GameOverReason.NONE},
        type: 'gamePage/updateGamePageState',
      });
    });
    expect(mockDispatch).toBeCalledTimes(7);
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

  describe('GameOver On TimeUp', () => {
    it('should reset score and restart total time and current round time and restart modal should be shown and update current score and not high score', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const highScore = {
        problemsSolved: 10,
        speed: 1,
        totalTime: 10,
      };
      const currentScore = {
        problemsSolved: 1,
        speed: 0.6,
        totalTime: 100,
      };
      mockUseSelector(currentScore, highScore);

      const {getByText} = render(<SetupDummyComponent />);
      fireEvent.press(getByText('RoundTimeOut'));

      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(
        function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
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
          //   expect(mockDispatch).toHaveBeenNthCalledWith(7, {
          //     payload: {
          //       currentScore: {
          //         problemsSolved,
          //         speed: problemsSolved / gametotalTime,
          //         totalTime: gametotalTime,
          //       },
          //     },
          //     type: 'gamePage/updateGamePageState',
          //   });
        },
      );
      iif(function assertHighScoreIsNotUpdated() {
        expect(mockDispatch).toBeCalledTimes(6);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });

    it('should reset score and restart total time and current round time and restart modal should be shown and update high score if current problemSolved is higher', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const problemsSolved = 12;
      const currentRoundTime = 4;
      const highScore = {
        problemsSolved: 10,
        speed: 0.1,
        totalTime: 100,
      };
      const currentScore = {
        problemsSolved: 12,
        speed: 0.1,
        totalTime: 100,
      };
      mockUseSelector(currentScore, highScore);

      const {getByText} = render(<SetupDummyComponent />);
      fireEvent.press(getByText('RoundTimeOut'));

      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(
        function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
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
        },
      );
      iif(function assertHighScoreIsUpdated() {
        expect(mockDispatch).toBeCalledTimes(7);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });

    it('should reset score and restart total time and current round time and restart modal should be shown and update high score if current problemSolved === highScoreProbleSolved and speed is high in currentScore', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const highScore = {
        problemsSolved: 10,
        speed: 0.1,
        totalTime: 100,
      };
      const currentScore = {
        problemsSolved: 12,
        speed: 0.6,
        totalTime: 100,
      };
      mockUseSelector(currentScore, highScore);

      const {getByText} = render(<SetupDummyComponent />);
      fireEvent.press(getByText('RoundTimeOut'));

      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(
        function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
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
        },
      );
      iif(function assertHighScoreIsUpdated() {
        expect(mockDispatch).toBeCalledTimes(7);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });

    it('should reset score and restart total time and current round time and restart modal should be shown and not update high score if current problemSolved === highScoreProbleSolved and speed is low in currentScore', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const highScore = {
        problemsSolved: 10,
        speed: 0.7,
        totalTime: 100,
      };
      const currentScore = {
        problemsSolved: 10,
        speed: 0.6,
        totalTime: 100,
      };
      const mockedUseSelector = mockUseSelector(currentScore, highScore);

      const {getByText} = render(<SetupDummyComponent />);
      fireEvent.press(getByText('RoundTimeOut'));

      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(
        function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
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
        },
      );
      iif(function assertHighScoreIsNotUpdated() {
        expect(mockDispatch).toBeCalledTimes(6);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });
  });

  describe('GameOver On WrongAnswer', () => {
    const SetupDummyComponentWithResult = (props: {answer: number}) => {
      const controller = useGameController(createGameProps({}));
      return (
        <>
          <Pressable
            data-testid="restart-btn"
            onPress={() => controller.validateResult(props.answer)}>
            <Text>ValidateResult</Text>
          </Pressable>
          <Text data-testid="result" onPress={controller.onTouchBackButton}>
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
      const currentScore = {
        problemsSolved: 10,
        speed: 0.6,
        totalTime: 100,
      };
      const wrongAnswer = Number.MAX_SAFE_INTEGER;
      mockUseSelector(currentScore, highScore);

      const {getByText} = render(
        <SetupDummyComponentWithResult answer={wrongAnswer} />,
      );
      fireEvent.press(getByText('ValidateResult'));

      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(
        function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
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
        },
      );
      iif(function assertHighScoreIsNotUpdated() {
        expect(mockDispatch).toBeCalledTimes(6);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });

    it('should reset score and restart total time and current round time and restart modal should be shown and update high score if current problemSolve is high', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const highScore = {
        problemsSolved: 10,
        speed: 0.1,
        totalTime: 100,
      };
      const currentScore = {
        problemsSolved: 12,
        speed: 0.1,
        totalTime: 100,
      };
      const wrongAnswer = Number.MAX_SAFE_INTEGER;
      mockUseSelector(currentScore, highScore);

      const {getByText} = render(
        <SetupDummyComponentWithResult answer={wrongAnswer} />,
      );
      fireEvent.press(getByText('ValidateResult'));

      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(
        function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
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
        },
      );
      iif(function assertHighScoreIsUpdated() {
        expect(mockDispatch).toBeCalledTimes(7);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });

    it('should reset score and restart total time and current round time and restart modal should be shown and update high score if current problemSolved === highScore.ProblemSolved but speed is high', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const highScore = {
        problemsSolved: 10,
        speed: 0.1,
        totalTime: 100,
      };
      const currentScore = {
        problemsSolved: 10,
        speed: 0.6,
        totalTime: 100,
      };
      const wrongAnswer = Number.MAX_SAFE_INTEGER;
      mockUseSelector(currentScore, highScore);

      const {getByText} = render(
        <SetupDummyComponentWithResult answer={wrongAnswer} />,
      );
      fireEvent.press(getByText('ValidateResult'));

      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(
        function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
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
        },
      );
      iif(function assertHighScoreIsUpdated() {
        expect(mockDispatch).toBeCalledTimes(7);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });

    it('should reset score and restart total time and current round time and restart modal should be shown and not update high score if current problemSolved === highScore.ProblemSolved but speed is not high', () => {
      const mockDispatch = jest.fn();
      const mockedUseDispatch = jest
        .spyOn(redux, 'useDispatch')
        .mockImplementation(() => mockDispatch);
      const highScore = {
        problemsSolved: 10,
        speed: 0.7,
        totalTime: 100,
      };
      const currentScore = {
        problemsSolved: 10,
        speed: 0.6,
        totalTime: 100,
      };
      const wrongAnswer = Number.MAX_SAFE_INTEGER;
      mockUseSelector(currentScore, highScore);

      const {getByText} = render(
        <SetupDummyComponentWithResult answer={wrongAnswer} />,
      );
      fireEvent.press(getByText('ValidateResult'));

      expect(mockedUseDispatch).toBeCalledTimes(2);
      iif(
        function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
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
        },
      );
      iif(function assertHighScoreIsUpdated() {
        expect(mockDispatch).toBeCalledTimes(6);
      });
      iif(function assertStopWatchIsReseted() {
        expect(mockStopWatchReset).toBeCalledTimes(1);
      });
    });
  });

  it('should restart the current round time, update the problemsSolved when answer is correct', () => {
    const SetupDummyComponentWithResult = (props: {answer: number}) => {
      const controller = useGameController(createGameProps({}));
      return (
        <>
          <Pressable
            data-testid="restart-btn"
            onPress={() => controller.validateResult(props.answer)}>
            <Text>ValidateResult</Text>
          </Pressable>
          <Text data-testid="result" onPress={controller.onTouchBackButton}>
            <Text>{controller.result}</Text>
          </Text>
        </>
      );
    };

    const correctAnswer = 20;
    jest
      .spyOn(problemGenerator, 'getOperationValuesAndResult')
      .mockImplementation(() => ({
        result: correctAnswer,
        operatorCell: [
          {
            type: CellType.NUMBER,
            value: 10,
          },
          {
            type: CellType.OPERATOR,
            value: problemGenerator.operations.ADDITION,
          },
          {
            type: CellType.NUMBER,
            value: 10,
          },
          {
            type: CellType.OPERATOR,
            value: problemGenerator.operations.SUBTRACTION,
          },
        ],
      }));
    const mockDispatch = jest.fn();
    const mockedUseDispatch = jest
      .spyOn(redux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    const problemsSolved = 1;
    const currentRoundTime = 4;
    const highScore = {
      problemsSolved: 10,
      speed: 0.1,
      totalTime: 100,
    };
    const currentScore = {
      problemsSolved: 9,
      speed: 0.1,
      totalTime: 100,
    };
    mockUseSelector(currentScore, highScore);

    const {getByText} = render(
      <SetupDummyComponentWithResult answer={correctAnswer} />,
    );
    fireEvent.press(getByText('ValidateResult'));

    expect(mockedUseDispatch).toBeCalledTimes(3);
    iif(function assertCurrentTimeIsRestedAndProblemSolvedIsUpdated() {
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        payload: {startTimer: true},
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        payload: {
          currentRoundRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
          totalGameRemainingTime: INITIAL_TOTAL_ROUND_DURATION,
        },
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(4, {
        payload: {
          currentScore: {
            problemsSolved: 10,
            speed: 1,
            totalTime: 10,
          },
        },
        type: 'gamePage/updateGamePageState',
      });
      // expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      //   payload: {problemsSolved: 2},
      //   type: 'gamePage/updateGamePageState',
      // });
    });
    expect(mockDispatch).toBeCalledTimes(4);
    iif(function assertStopWatchIsNotReseted() {
      expect(mockStopWatchReset).toBeCalledTimes(0);
    });
  });

  it.each([GameOverReason.PAUSED, GameOverReason.TIME_UP, GameOverReason.WRONG_ANSWER])('should  not restart the current round time and update the problemsSolved when answer is correct and gameOverReason is error, timeUp', (gameOverReason: GameOverReason) => {
    const SetupDummyComponentWithResult = (props: {answer: number}) => {
      const controller = useGameController(createGameProps({}));
      return (
        <>
          <Pressable
            data-testid="restart-btn"
            onPress={() => controller.validateResult(props.answer)}>
            <Text>ValidateResult</Text>
          </Pressable>
          <Text data-testid="result" onPress={controller.onTouchBackButton}>
            <Text>{controller.result}</Text>
          </Text>
        </>
      );
    };

    const correctAnswer = 20;
    jest
      .spyOn(problemGenerator, 'getOperationValuesAndResult')
      .mockImplementation(() => ({
        result: correctAnswer,
        operatorCell: [
          {
            type: CellType.NUMBER,
            value: 10,
          },
          {
            type: CellType.OPERATOR,
            value: problemGenerator.operations.ADDITION,
          },
          {
            type: CellType.NUMBER,
            value: 10,
          },
          {
            type: CellType.OPERATOR,
            value: problemGenerator.operations.SUBTRACTION,
          },
        ],
      }));
    const mockDispatch = jest.fn();
    const mockedUseDispatch = jest
      .spyOn(redux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    const highScore = {
      problemsSolved: 10,
      speed: 0.1,
      totalTime: 100,
    };
    const currentScore = {
      problemsSolved: 9,
      speed: 0.1,
      totalTime: 100,
    };
    mockUseSelector(currentScore, highScore, gameOverReason);

    const {getByText} = render(
      <SetupDummyComponentWithResult answer={correctAnswer} />,
    );
    fireEvent.press(getByText('ValidateResult'));

    expect(mockedUseDispatch).toBeCalledTimes(2);
    iif(function assertNoValidationHappens() {
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        payload: {startTimer: true},
        type: 'gamePage/updateGamePageState',
      });
    });
    expect(mockDispatch).toBeCalledTimes(2);
    iif(function assertStopWatchIsNotReseted() {
      expect(mockStopWatchReset).toBeCalledTimes(0);
    });
  });

  it('should restart timer and problemsSolved and naviage to home screen when game is quit', () => {
    const mockedGoBack = jest.fn();
    const navigation = {
      goBack: mockedGoBack,
     
    };
    const SetupDummyComponentWithQuit = () => {
      const controller = useGameController(createGameProps({navigation}));
      return (
        <>
          <Pressable data-testid="restart-btn" onPress={controller.onQuitGame}>
            <Text>Quit</Text>
          </Pressable>
        </>
      );
    };

    const correctAnswer = 20;
    jest
      .spyOn(problemGenerator, 'getOperationValuesAndResult')
      .mockImplementation(() => ({
        result: correctAnswer,
        operatorCell: [
          {
            type: CellType.NUMBER,
            value: 10,
          },
          {
            type: CellType.OPERATOR,
            value: problemGenerator.operations.ADDITION,
          },
          {
            type: CellType.NUMBER,
            value: 10,
          },
          {
            type: CellType.OPERATOR,
            value: problemGenerator.operations.SUBTRACTION,
          },
        ],
      }));
    const mockDispatch = jest.fn();
    const mockedUseDispatch = jest
      .spyOn(redux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    const problemsSolved = 1;
    const currentRoundTime = 4;
    const highScore = {
      problemsSolved: 10,
      speed: 0.1,
      totalTime: 100,
    };
    const currentScore = highScore;
    mockUseSelector(currentScore, highScore)

    const {getByText} = render(<SetupDummyComponentWithQuit />);
    fireEvent.press(getByText('Quit'));

    expect(mockedUseDispatch).toBeCalledTimes(2);
    iif(function assertCurrentTimeIsRestedAndProblemSolvedIsUpdated() {
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        payload: {showRestartModal: false},
        type: 'gamePage/updateGamePageState',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(4, {
        payload: {gameOverReason: GameOverReason.NONE},
        type: 'gamePage/updateGamePageState',
      });
    });
    expect(mockDispatch).toBeCalledTimes(4);
    iif(function assertStopWatchIsNotReseted() {
      expect(mockStopWatchReset).toBeCalledTimes(1);
    });
    iif(function assertMoveToNavigationScreen() {
      expect(mockedGoBack).toBeCalledTimes(1);
    });
  });

  it('should start current round timer, set fetch highscore and start total time when game screen is loaded', () => {
    const mockDispatch = jest.fn();
    const mockedUseDispatch = jest
      .spyOn(redux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    const mockedUseSelector = jest
      .spyOn(redux, 'useSelector')
      .mockReturnValue([0, jest.fn()]);

    render(<SetupDummyComponent />);

    expect(mockedUseDispatch).toBeCalledTimes(2);
    iif(function assertCurrentTimeAndProblemSolvedIsResetedAndModalIsHidden() {
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        payload: {startTimer: true},
        type: 'gamePage/updateGamePageState',
      });
    });
    expect(mockDispatch).toBeCalledTimes(2);
    iif(function assertStopWatchIsReseted() {
      expect(mockStopWatchStart).toBeCalledTimes(1);
    });
  });
});
