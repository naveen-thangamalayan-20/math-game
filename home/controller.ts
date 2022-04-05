import {useSelector} from 'react-redux';
import {RootState} from '../store';

export type HomeProps = {
  navigation: any;
};

const useHomeController = (props: HomeProps) => {
  const highScorePEV = useSelector(
    (state: RootState) => state.gamePage.highScorePEV,
  );

  return {
    highScore: highScorePEV.value,
    onTouchBackButton: () => {
      props.navigation.navigate('Home');
    },
    onTouchGameButton: () => {
      props.navigation.navigate('Game');
    },
    onTouchHighScoreButton: () => {
      props.navigation.navigate('HighScore');
    },
    // navigation: props.navigation,
  };
};

export default useHomeController;
