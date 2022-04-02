import { useSelector } from 'react-redux';
import {RootState} from '../store';
export type HighScoreProps = {
    navigation: any;
}

const useHighScoreController = (props: HighScoreProps) => {
  const highScorePEV = useSelector(
    (state: RootState) => state.gamePage.highScorePEV,
  );

  return {
    highScore: highScorePEV.value,
    onTouchBackButton: () => {
        props.navigation.navigate("Home")
    }
  };
};


export default useHighScoreController;
