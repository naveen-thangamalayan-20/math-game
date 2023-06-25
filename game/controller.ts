import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import {useDispatch, useSelector} from 'react-redux';
import { getFailureSound, getWinningSound } from '../home/sound';
import {RootState} from '../store';
import { Nullable } from '../utils/types';
import { useGetAllReduxStates } from './all-states';
import useStopWatch from './main-play-area/stop-watch/stop-watch';
import { getOperationValuesAndResult, OperationCell, Operator } from './problem-generator';
import {
  GameOverReason,
  GamePageActions,
  INITIAL_TOTAL_ROUND_DURATION,
  HighScore,
  DifficultyLevel
} from './redux';
import { InterstitialAd, TestIds, useInterstitialAd } from 'react-native-google-mobile-ads';


export type GameProps = {
  navigation: any;
}



export const getDifficultyLevel = (problemsSolved: number, totalTime: number) => {
    const weightedAverage =(problemsSolved * 0.6) + (totalTime * 0.4)
    console.log("WeightedAverage", weightedAverage, problemsSolved,totalTime)
    if(weightedAverage > 10 && weightedAverage <= 14) {
      return DifficultyLevel.BEGINNER;
    } else if (weightedAverage > 15 && weightedAverage <= 29 ) {
      return DifficultyLevel.HARD;
    } else if (weightedAverage > 30 ) {
      return DifficultyLevel.EXPERT;
    } else {
      return DifficultyLevel.NOVICE;
    }
}


const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const useGameController = (props: GameProps) => {
  const { isLoaded: isAdsLoaded, isClosed: isAdsClosed, load: loadAd, show: showAd } = useInterstitialAd(TestIds.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
  });
  useEffect(() => {
    loadAd();
  }, [loadAd]);
  useEffect(() => {
    if (isAdsClosed) {
      dispatch(GamePageActions.updateStartTimer(true));
      setroundId(roundId => roundId + 1);
      stopWatch.start();
      loadAd();
      // Action after the ad is closed
      // navigation.navigate('NextScreen');
      console.log("Closed")
    }
  }, [isAdsClosed]);
  
  console.debug("useGameController called")
  const allStates = useGetAllReduxStates()
  const currentScore = allStates.currentScore;
  const highScorePEV = allStates.highScorePEV;
  const resourcePE = allStates.resourcePE;
  const gameOverReason = allStates.gameOverReason;;
  const difficultyLevel = allStates.difficultyLevel;
  const isSoundOn = allStates.isSoundOn;
  const [operatorAndResultState, setOperatorAndResultState] = useState(getOperationValuesAndResult(DifficultyLevel.EXPERT));
  const stopWatch = useStopWatch();
  const dispatch = useDispatch();
  const [roundId, setroundId] = useState(0);
  let winningSound: Nullable<Sound> =  null;
  let failingSound: Nullable<Sound> =  null;

  getWinningSound().then((sound) => {
    winningSound = sound as Sound;
  })
  getFailureSound().then((sound) => {
    failingSound = sound as Sound;
  })

  const playWinningSound = () => {
    if(isSoundOn) {
      winningSound?.play();
    }
  }

  const playFailureSound = () => {
    if(isSoundOn) {
      failingSound?.play();
    }
  }
 

   console.log("###CAlls")
  useEffect(() => {
    console.debug("useEffect called")
    dispatch(GamePageActions.fetchHighScore());
    setroundId(roundId => roundId + 1);
    dispatch(GamePageActions.updateStartTimer(true));
    stopWatch.start();
    setOperatorAndResultState(getOperationValuesAndResult(difficultyLevel))
  }, []);

  const {result, operatorCell} = operatorAndResultState;
  const getCurrentScore = () => {
    return currentScore;
  };

  const shouldRenderContent = () => {
      return !highScorePEV.progress || !resourcePE.progress;
  }

  const shouldRenderProgress = () => {
    return !!highScorePEV.progress || !!resourcePE.progress;
  }

  const onGameOver = (gameOverReason: GameOverReason) => {
    // const currentScore = getCurrentScore();
    playFailureSound()
    dispatch(GamePageActions.updateGameOverReason(gameOverReason));
    dispatch(GamePageActions.setShowRestartModal(true));
    dispatch(GamePageActions.updateStartTimer(false));
    dispatch(GamePageActions.updateTotalTime(stopWatch.timer.current));
    // setroundId(roundId => roundId + 1);
    stopWatch.reset();
    console.log('CurrentScore', currentScore, highScorePEV);
    // dispatch(GamePageActions.updateCurrentScore(currentScore));
    // if (highScorePEV.value.speed < currentScore.speed) {
    //   dispatch(GamePageActions.storeHighScore(currentScore));
    // }
    // TODO Add unit test for the code
    if(highScorePEV.value.problemsSolved < currentScore.problemsSolved) {
      console.log('Higscore ProblemSolved', highScorePEV);
      dispatch(GamePageActions.storeHighScore(currentScore));
    } else if (highScorePEV.value.problemsSolved === currentScore.problemsSolved) {
      console.log('Higscore ProblemSolved Samw', highScorePEV);
      if (highScorePEV.value.speed < currentScore.speed) {
        dispatch(GamePageActions.storeHighScore(currentScore));
      }
    }
  };

  // useEffect(() => {
  //   setOperatorAndResultState(getOperationValuesAndResult(difficultyLevel));
  // }, [difficultyLevel])

  const onAnswerFound = () => {
    const newProblemsSolved =  currentScore.problemsSolved + 1;
    const currentSpeed = newProblemsSolved / stopWatch.timer.current;
    console.log("@@CurrentSpeed", currentSpeed)
    playWinningSound()
    setOperatorAndResultState(getOperationValuesAndResult(difficultyLevel))
    dispatch(GamePageActions.updateDifficultLevel(getDifficultyLevel(newProblemsSolved, stopWatch.timer.current)));
    const getRoundTime = (difficultyLevel: DifficultyLevel) => {
      return INITIAL_TOTAL_ROUND_DURATION * (1 - (difficultyLevel * 0.05))
    }
    dispatch(
      GamePageActions.updateGameTime(
        getRoundTime(difficultyLevel),
        getRoundTime(difficultyLevel)
        // INITIAL_TOTAL_ROUND_DURATION,
        // INITIAL_TOTAL_ROUND_DURATION,
      ),
    );
    dispatch(GamePageActions.updateCurrentScore({
      speed: currentSpeed,
      problemsSolved: newProblemsSolved,
      totalTime: stopWatch.timer.current,
    }));
    setroundId(roundId => roundId + 1);
  };

  const onAnswerNotFound = () => {
    onGameOver(GameOverReason.WRONG_ANSWER);
  };

  const validateResult = (total: number) => {
    console.log("###GAmeOverREason", gameOverReason)
    console.log("######VAlidatationResult",total, result, gameOverReason)
    if(gameOverReason === GameOverReason.NONE) {
      console.log("#####Inside")
      if (total === result) {
        onAnswerFound();
      } else {
        onAnswerNotFound();
      }
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
    dispatch(GamePageActions.updateCurrentScore({
      speed: 0,
      problemsSolved: 0,
      totalTime: 0,
    }));
    setOperatorAndResultState(getOperationValuesAndResult(DifficultyLevel.NOVICE));
    dispatch(GamePageActions.updateGameOverReason(GameOverReason.NONE));
    dispatch(GamePageActions.setShowRestartModal(false));
    if(isAdsLoaded) {
      showAd();
    }
    // dispatch(GamePageActions.updateStartTimer(true));
    // setroundId(roundId => roundId + 1);
    // stopWatch.start();
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
    onQuitGame,
    shouldRenderContent,
    shouldRenderProgress
  };
};

export default useGameController;


