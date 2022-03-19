import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import {useDispatch} from 'react-redux';

const useStopWatch = () => {
  // const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const increment = useRef(0);
  const timer = useRef(0);

  const start = () => {
    setIsActive(true);
    setIsPaused(true);
    increment.current = setInterval(() => {
      // setTimer(timer => timer + 1);
      timer.current = timer.current + 1;
    }, 1000) as unknown as number;
  };

  const pause = () => {
    clearInterval(increment.current);
    setIsPaused(false);
  };

  const resume = () => {
    setIsPaused(true);
    increment.current = setInterval(() => {
      // setTimer(timer => timer + 1);
      timer.current = timer.current + 1;
    }, 1000) as unknown as number;
  };

  const reset = () => {
    clearInterval(increment.current);
    setIsActive(false);
    setIsPaused(false);
    // setTimer(0);
    timer.current = 0;
  };

  const restart = () => {
    reset();
    start();
  };

  // const formatTime = () => {
  //   const getSeconds = `0${timer % 60}`.slice(-2);
  //   const minutes = Math.floor(timer / 60);
  //   const getMinutes = `0${minutes % 60}`.slice(-2);
  //   const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

  //   return `${getHours} : ${getMinutes} : ${getSeconds}`;
  // };

  return {
    start,
    pause,
    reset,
    resume,
    timer,
  };
};
export default useStopWatch;
