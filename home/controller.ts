import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import { HomePageActions } from './redux';
import { useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';


export type HomeProps = {
  navigation: any;
};


// export const FailureSound = new Sound('wrong_answer.mp3', Sound.MAIN_BUNDLE, (error) => {
//     if (error) {
//       console.log('failed to load the wrong_answer sound', error);
//       return;
//     }
//   });



const useHomeController = (props: HomeProps) => {
  const highScorePEV = useSelector(
    (state: RootState) => state.gamePage.highScorePEV,
  );
  const dispatch = useDispatch()

  useEffect( () => {
   dispatch(HomePageActions.loadAllSounds())
  },[])

  const isSoundOn = useSelector((state: RootState) => state.homePage.isSoundOn);
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
    onToundSoundButton: () =>{
    console.log("isSoundOn",isSoundOn)

      dispatch(HomePageActions.updateIsSoundOn(!isSoundOn));
    },
    isSoundOn,
    getSoundButtonLabel: () => isSoundOn? "SOUND: ON" : "SOUND: OFF",
    onTouchQuitButton: () => console.log("Quit")
  };
};

export default useHomeController;
