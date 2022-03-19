import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import { generateRandomNumber, shuffle } from '../utils/iif';
import useStopWatch from './main-play-area/stop-watch/stop-watch';
import { getOperationValuesAndResult, Operator } from './problem-generator';
import {
  GameOverReason,
  GamePageActions,
  INITIAL_TOTAL_ROUND_DURATION,
} from './redux';


const useGameController = () => {
  const [operatorAndResultState, setOperatorAndResultState] = useState(
    getOperationValuesAndResult(),
  );
  const stopWatch = useStopWatch();
  const dispatch = useDispatch();
  const [roundId, setroundId] = useState(0);
  const currentRoundRemainingTime = useSelector(
    (state: RootState) => state.gamePage.currentRoundRemainingTime,
  );
  const problemSolved = useSelector((state: RootState) => state.gamePage.problemsSolved);
  const highScorePEV = useSelector(
    (state: RootState) => state.gamePage.highScorePEV,
  );
  const {result, operatorCell} = operatorAndResultState;
  console.log('Main,currentRoundRemainingTime', currentRoundRemainingTime);
  console.log('Main,problemSolved', problemSolved);
  console.log('Main,highScorePEV', highScorePEV);

  useEffect(() => {
    dispatch(GamePageActions.fetchHighScore());
    dispatch(GamePageActions.updateStartTimer(true));
    stopWatch.start();
    setroundId(roundId => roundId + 1);
  }, []);

  const getCurrentScore = () => {
    const currentSpeed = problemSolved / stopWatch.timer.current;
    console.log(
      'StopWatch',
      stopWatch.timer.current,
      problemSolved,
      currentSpeed,
    );
    return {
      speed: currentSpeed,
      problemsSolved: problemSolved,
      totalTime: stopWatch.timer.current,
    };
  };

  const onGameOver = (gameOverReason: GameOverReason) => {
    const currentScore = getCurrentScore();
    dispatch(GamePageActions.updateGameOverReason(gameOverReason));
    dispatch(GamePageActions.setShowRestartModal(true));
    dispatch(GamePageActions.updateStartTimer(false));
    dispatch(GamePageActions.updateTotalTime(stopWatch.timer.current));
    // setroundId(roundId => roundId + 1);
    stopWatch.reset();
    console.log('CurrentScore', currentScore);
    dispatch(GamePageActions.updateCurrentScore(currentScore));
    if (highScorePEV.value.speed < currentScore.speed) {
      dispatch(GamePageActions.storeHighScore(currentScore));
    }
  };

  const onAnswerFound = () => {
    // const newTotalTime = currentRoundRemainingTime + 3;
    setOperatorAndResultState(getOperationValuesAndResult());
    dispatch(
      GamePageActions.updateGameTime(
        INITIAL_TOTAL_ROUND_DURATION,
        INITIAL_TOTAL_ROUND_DURATION,
      ),
    );
    dispatch(GamePageActions.updateProblemsSolved(problemSolved + 1));
    setroundId(roundId => roundId + 1);
  };

  const onAnswerNotFound = () => {
    onGameOver(GameOverReason.WRONG_ANSWER);
  };

  const validateResult = (total: number) => {
    console.log(
      'VAlidateResult--currentRoundRemainingTime=AnswerNotFound',
      currentRoundRemainingTime,
      total,
    );
    if (total === result) {
      onAnswerFound();
    } else {
      onAnswerNotFound();
    }
  };

  const onTimeOver = () => {
    // dispatch(GamePageActions.updateGameOverReason(GameOverReason.TIME_UP));
    onGameOver(GameOverReason.TIME_UP);
  };

  const onTouchBackButton = () => {
    dispatch(GamePageActions.updateGameOverReason(GameOverReason.PAUSED));
    dispatch(GamePageActions.setShowRestartModal(true));
    dispatch(GamePageActions.updateStartTimer(false));
    stopWatch.pause();
  };

  const onRestartGame = () => {
    dispatch(
      GamePageActions.updateGameTime(
        INITIAL_TOTAL_ROUND_DURATION,
        INITIAL_TOTAL_ROUND_DURATION,
      ),
    );
    dispatch(GamePageActions.updateStartTimer(true));
    dispatch(GamePageActions.updateProblemsSolved(0));
    dispatch(GamePageActions.setShowRestartModal(false));
    setOperatorAndResultState(getOperationValuesAndResult());
    setroundId(roundId => roundId + 1);
    stopWatch.start();
  };

  const onResumeGame = () => {
    dispatch(GamePageActions.updateGameOverReason(GameOverReason.NONE));
    dispatch(GamePageActions.setShowRestartModal(false));
    dispatch(GamePageActions.updateStartTimer(true));
    stopWatch.resume();
  };

  const onQuitGame = () => {
    dispatch(GamePageActions.setShowRestartModal(false));
      dispatch(GamePageActions.updateGameOverReason(GameOverReason.NONE));
      props.navigation.navigate('Home');
  }

  return {
    operatorCell,
    result,
    roundDuration: 20,
    roundId,
    onTimeOver,
    onRestartGame,
    validateResult,
    timer: stopWatch.timer,
    onTouchBackButton,
    onResumeGame,
    getCurrentScore,
  };
};

export default useGameController;
