import {useDispatch, useSelector} from 'react-redux';
import {RestartModelProps} from '.';
import {RootState} from '../../store';
import {GameOverReason, GamePageActions, HighScore} from '../redux';

export const useRestartModalController = (props: RestartModelProps) => {
  const dispatch = useDispatch();
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

  const getFormattedTime = (totalTime: number) => {
    if (totalTime < 60) {
      return `${totalTime} secs`;
    } else {
      return `${(totalTime / 60).toFixed(1)} minutes`;
    }
  };

  const getSpeed = (
    problemsSolved: HighScore['problemsSolved'],
    totalTime: HighScore['totalTime'],
  ) => {
    return `${(problemsSolved / totalTime).toFixed(1)} answers/secs`;
  };

  const shouldRenderScores = () => {
    return gameOverReason !== GameOverReason.PAUSED;
  };

  const shouldRenderResumeButton = () => {
    return gameOverReason === GameOverReason.PAUSED;
  };

  const getFormattedCurrentScore = () => {
    return {
      speed: currentScore.speed,
      problemsSolved: currentScore.problemsSolved,
      totalTime: getFormattedTime(currentScore.totalTime),
    };
  };

  const getFormattedHighScore = () => {
    return {
      speed: highScorePEV.value.speed,
      problemsSolved: highScorePEV.value.problemsSolved,
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
    // getSpeed,
    getFormattedHighScore,
    getFormattedCurrentScore,
    shouldRenderScores,
    shouldRenderResumeButton,
    onResumeGame: props.onResumeGame,
  };
};
