import {useDispatch, useSelector} from 'react-redux';
import {RestartModelProps} from '.';
import {RootState} from '../../store';
import { getFormattedSpeed, getFormattedTime, SPEED_UNIT } from '../../utils/formatter';
import {GameOverReason, GamePageActions, HighScore} from '../redux';

export const useRestartModalController = (props: RestartModelProps) => {
  const dispatch = useDispatch();
  const answeredProblem =useSelector(
    (root: RootState) => root.gamePage.answeredProblem,
  );
  const gameOverReason = useSelector(
    (root: RootState) => root.gamePage.gameOverReason,
  );

  const showRestartModal = useSelector(
    (state: RootState) => state.gamePage.showRestartModal,
  );

  const highScorePEV = useSelector(
    (state: RootState) => state.gamePage.highScorePEV,
  );
  const currentScore = useSelector(
    (state: RootState) => state.gamePage.currentScore,
  );
  // const totalTime = useSelector((state: RootState) => state.gamePage.totalTime);
  // const problemSolved = useSelector((state: RootState) => state.gamePage.score);


  const getSpeed = (
    problemsSolved: HighScore['problemsSolved'],
    totalTime: HighScore['totalTime'],
  ) => {
    return `${(problemsSolved / totalTime).toFixed(1)} answers/secs`;
  };

  // const getFormattedSpeed = (speed:number) => {
  //   return `${speed.toFixed(1)} answers/secs`
  // }

  const shouldRenderScores = () => {
    return gameOverReason !== GameOverReason.PAUSED;
  };

  const shouldRenderResumeButton = () => {
    return gameOverReason === GameOverReason.PAUSED;
  };

  const getFormattedCurrentScore = () => {
    return {
      speed: getFormattedSpeed(currentScore.speed),
      problemsSolved: {value:currentScore.problemsSolved.toString(), unit:"problems"},
      totalTime: getFormattedTime(currentScore.totalTime),
    };
  };

  const getFormattedHighScore = () => {
    return {
      speed: getFormattedSpeed(highScorePEV.value.speed),
      problemsSolved: {value:highScorePEV.value.problemsSolved.toString(), unit:"problems"},
      totalTime: getFormattedTime(highScorePEV.value.totalTime),
    };
  };

  return {
    gameOverReason,
    showRestartModal,
    onRestartGame: props.onRestartGame,
    // onQuitGame: () => {
    //   dispatch(GamePageActions.setShowRestartModal(false));
    //   dispatch(GamePageActions.updateGameOverReason(GameOverReason.NONE));
    //   props.navigation.navigate('Home');
    // },
    onQuitGame: props.onQuitGame,
    getFormattedTime,
    problemSolved: currentScore.problemsSolved,
    getFormattedHighScore,
    getFormattedCurrentScore,
    shouldRenderScores,
    shouldRenderResumeButton,
    onResumeGame: props.onResumeGame,
    highScore: highScorePEV.value,
    currentScore,
    isNewHighScore: () => {
      console.log("#######", currentScore)
      console.log("#######", highScorePEV.value)
      return currentScore.problemsSolved === highScorePEV.value.problemsSolved || currentScore.speed === highScorePEV.value.speed
    },
    answeredProblem,
  };
};
