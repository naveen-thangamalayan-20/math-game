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


export type GameProps = {
  navigation: any;
}
const useGameController = (props: GameProps) => {
  const [operatorAndResultState, setOperatorAndResultState] = useState(
    getOperationValuesAndResult(),
  );
  const stopWatch = useStopWatch();
  const dispatch = useDispatch();
  const [roundId, setroundId] = useState(0);
  const currentRoundRemainingTime = useSelector(
    (state: RootState) => state.gamePage.currentRoundRemainingTime,
  );
  // const problemSolved = useSelector((state: RootState) => state.gamePage.problemsSolved);
  const currentScore = useSelector((state: RootState) => state.gamePage.currentScore);
  const highScorePEV = useSelector(
    (state: RootState) => state.gamePage.highScorePEV,
  );
  const {result, operatorCell} = operatorAndResultState;

  useEffect(() => {
    dispatch(GamePageActions.fetchHighScore());
    setroundId(roundId => roundId + 1);
    dispatch(GamePageActions.updateStartTimer(true));
    stopWatch.start();
  }, []);

  const getCurrentScore = () => {
    return currentScore;
  };

  const onGameOver = (gameOverReason: GameOverReason) => {
    // const currentScore = getCurrentScore();
    dispatch(GamePageActions.updateGameOverReason(gameOverReason));
    dispatch(GamePageActions.setShowRestartModal(true));
    dispatch(GamePageActions.updateStartTimer(false));
    dispatch(GamePageActions.updateTotalTime(stopWatch.timer.current));
    // setroundId(roundId => roundId + 1);
    stopWatch.reset();
    console.log('CurrentScore', currentScore);
    // dispatch(GamePageActions.updateCurrentScore(currentScore));
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
    const currentSpeed = currentScore.problemsSolved / stopWatch.timer.current;
    dispatch(GamePageActions.updateCurrentScore({
      speed: currentSpeed,
      problemsSolved: currentScore.problemsSolved + 1,
      totalTime: stopWatch.timer.current,
    }));
    setroundId(roundId => roundId + 1);
  };

  const onAnswerNotFound = () => {
    onGameOver(GameOverReason.WRONG_ANSWER);
  };

  const validateResult = (total: number) => {
    console.log("######VAlidatationResult",total, result)
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
    // dispatch(GamePageActions.updateProblemsSolved(0));
    dispatch(GamePageActions.updateCurrentScore({
      speed: 0,
      problemsSolved: 0,
      totalTime: 0,
    }));
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
    // dispatch(GamePageActions.updateProblemsSolved(0));
    stopWatch.reset()
    props.navigation.goBack();
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
    onQuitGame
  };
};

export default useGameController;
