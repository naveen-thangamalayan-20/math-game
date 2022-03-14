import {useDispatch, useSelector} from 'react-redux';
import {RestartModelProps} from '.';
import {RootState} from '../../store';
import {GameOverReason, GamePageActions} from '../redux';

export const useRestartModalController = (props: RestartModelProps) => {
  const dispatch = useDispatch();
  const gameOverReason = useSelector(
    (root: RootState) => root.gamePage.gameOverReason,
  );
  const showRestartModal = useSelector(
    (state: RootState) => state.gamePage.showRestartModal,
  );
  const totalTime = useSelector((state: RootState) => state.gamePage.totalTime);
  const problemSolved = useSelector((state: RootState) => state.gamePage.score);

  const getFormattedTime = () => {
    if (totalTime < 60) {
      return `${totalTime} secs`;
    } else {
      return `${(totalTime / 60).toFixed(1)} minutes`;
    }
  };

  const getSpeed = () => {
    return `${(problemSolved/totalTime).toFixed(1)} answers/secs`
  };

  const shouldRenderScores = () => {
      return gameOverReason !== GameOverReason.PAUSED;
  }

  const shouldRenderResumeButton = () => {
    return gameOverReason === GameOverReason.PAUSED;
  }

  return {
    gameOverReason,
    showRestartModal,
    onRestartGame: props.onRestartGame,
    onQuitGame: () => {
      dispatch(GamePageActions.setShowRestartModal(false));
      dispatch(GamePageActions.updateGameOverReason(GameOverReason.NONE));
      props.navigation.navigate('Home');
    },
    getFormattedTime,
    problemSolved,
    getSpeed,
    shouldRenderScores,
    shouldRenderResumeButton,
    onResumeGame: props.onResumeGame,
  };
};
