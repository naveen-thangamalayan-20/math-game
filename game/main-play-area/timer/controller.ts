import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useElapsedTime} from 'use-elapsed-time';
import {RootState} from '../../../store';
import {GamePageActions, INITIAL_TOTAL_ROUND_DURATION} from '../../redux';

export type TimerProps = {
  // duration: number;
  onTimeOut: () => void;
};

const useTimerController = (props: TimerProps) => {
  const dispatch = useDispatch();
  const totalGameRemainingTime = useSelector(
    (state: RootState) => state.gamePage.totalGameRemainingTime,
  );
  const currentRoundRemainingTime = useSelector(
    (state: RootState) => state.gamePage.currentRoundRemainingTime,
  );
  const startTimer = useSelector(
    (state: RootState) => state.gamePage.startTimer,
  );
  useEffect(() => {
    console.log('Mounted Timer');
  }, []);
  useElapsedTime({
    isPlaying: startTimer,
    duration: totalGameRemainingTime,
    updateInterval: 0.1,
    // duration: 4,
    onUpdate: elapsedTime => {
        console.log(elapsedTime)
      dispatch(
        // GamePageActions.updateCurrentRoundRemainingTime(
        //   currentRoundRemainingTime - 1,
        // ),
        GamePageActions.updateCurrentRoundRemainingTime(
            elapsedTime,
          ),
      );
    },
    onComplete: elapsedTime => props.onTimeOut(),
  });

  const getElapsedTimeInPercentage = () => {
      return 1 - (currentRoundRemainingTime/INITIAL_TOTAL_ROUND_DURATION);
  }

  return {
    time: currentRoundRemainingTime,
    getElapsedTimeInPercentage,
  };
};

export default useTimerController;
