import {useEffect, useState} from 'react';
import {LayoutChangeEvent} from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { useElapsedTime } from 'use-elapsed-time';
import { RootState } from '../../store';
import { GamePageActions } from '../redux';
import {Cell, CoOrdinates} from './index';

export type OperationCell = {
  operator: {
    label: string;
    operate: (value1: number, value2: number) => number;
  };
  number: number;
};

export type MainPlayAreaProps = {
  answerToBeFound: number;
  operatorCells: OperationCell[];
  onAnswerFound: (remaniningDuration: number) => void;
  onAnswerNotFound: (remaniningDuration: number) => void;
  onTimeOver: () => void;
  duration: number;
  roundId: number;
};

const useMainPlayAreaController = (props: MainPlayAreaProps) => {
  const endPoint = useSharedValue(null as CoOrdinates | null);
  const canTouch = useSharedValue(true);
  const patternPoints = useSharedValue([] as Cell[]);
  const selectedIndexes = useSharedValue([] as number[]);
  const containerLayout = useSharedValue({width: 0, height: 0, min: 0});
  const rowCount = 2;
  const columnCount = 2;
  const patternMargin = 2;
  const [timerKeyId , setTimerKeyId] = useState(0);
  let count = useSharedValue(10);
  // const [time, setTime] = useState(props.duration);
  console.log("Controller", props.duration);
 
  // let {
  //   elapsedTime,
  //   reset
  // } = useElapsedTime({
  //   isPlaying: true,
  //   duration: props.duration,
  //   updateInterval: 1,
  //   onUpdate: (elapsedTime) => setTime((time) => time - 1),
  //   // onComplete: (elapsedTime) => props.onTimeOver()
  // })
  
 
  const cvc = useAnimatedStyle(() => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: `${
      Math.max(
        0,
        containerLayout.value.height / containerLayout.value.width - 1.25,
      ) * 50
    }%`,
    width: containerLayout.value.min,
    height: containerLayout.value.min,
  }));

  const R = useDerivedValue(
    () => (containerLayout.value.min / rowCount - patternMargin * 2) / 2,
  );

  
  const totalGameRemainingTime = useSelector((state:RootState) =>state.gamePage.totalGameRemainingTime);
  const currentGameRemainingTime = useSelector((state:RootState) =>state.gamePage.currentGameRemainingTime);
  const checkResult = () => {
    let total = 0;
    selectedIndexes.value.forEach(index => {
      const {operator, number} = props.operatorCells[index];
      total = operator.operate(total, number);
    });
  
    console.log("inside totalGameRemainingTime", count.value)
    if (total === props.answerToBeFound) {
      props.onAnswerFound(totalGameRemainingTime);
      dispatch(GamePageActions.updateIsRoundAnswered(true));
      console.log('Answer found');
    } else {
      // props.onAnswerNotFound(time);
      console.log('Answer not found');
    }
    selectedIndexes.value = [];
    console.log('REsilt Checking Done');
  };

  const panHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent | TapGestureHandlerGestureEvent
  >({
    onStart: evt => {
      if (
        canTouch.value &&
        patternPoints.value &&
        selectedIndexes.value.length === 0
      ) {
        const selected: number[] = [];
        patternPoints.value.every((p, idx) => {
          if (
            (p.position.x - evt.x) * (p.position.x - evt.x) +
              (p.position.y - evt.y) * (p.position.y - evt.y) <
            R.value * R.value
          ) {
            selected.push(idx);
            return false;
          }
          return true;
        });
        selectedIndexes.value = selected;
      }
    },
    onActive: evt => {
      if (
        canTouch.value &&
        patternPoints.value &&
        selectedIndexes.value.length > 0
      ) {
        patternPoints.value.every((p, idx) => {
          if (
            (p.position.x - evt.x) * (p.position.x - evt.x) +
              (p.position.y - evt.y) * (p.position.y - evt.y) <
            R.value * R.value
          ) {
            if (selectedIndexes.value.indexOf(idx) < 0) {
              selectedIndexes.value = [...selectedIndexes.value, idx];
            }
            return false;
          }
          return true;
        });
        endPoint.value = {x: evt.x, y: evt.y};
      }
    },
    onEnd: evt => {
      if (!canTouch.value) return;
      endPoint.value = null;
      if (selectedIndexes.value.length > 0) {
        console.log('SElectectedIndex', selectedIndexes);
        runOnJS(checkResult)();
      }
    },
  });

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    console.log('Container Layout', width, height);
    containerLayout.value = {
      width,
      height,
      min: Math.min(width, height),
    };
  };

  const onPatternLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    console.log('Pattern layout', layout);
    const points = [];
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        points.push({
          x: layout.x + (layout.width / columnCount) * (j + 0.5),
          y: layout.y + (layout.height / rowCount) * (i + 0.5),
        });
      }
    }
    patternPoints.value = points.map((p, idx) => ({
      position: {x: p.x, y: p.y},
    }));
  };

  const getOperatorCellLabel = (idx: number) =>
    `${props.operatorCells[idx].operator.label}${props.operatorCells[idx].number}`;

    const dispatch = useDispatch();
  const onTimeUp = () => {
    dispatch(GamePageActions.setShowRestartModal(true));
  }

  return {
    answerToBeFound: props.answerToBeFound,
    operatorCells: props.operatorCells,
    panHandler,
    patternPoints,
    onPatternLayout,
    onContainerLayout,
    cvc,
    selectedIndexes,
    R,
    getOperatorCellLabel,
    onTimeUp,
    counter: count.value,
    totalGameRemainingTime,
    // time,
    onClick: () => {
      console.log("Clicked")
      count.value = Math.random();
      console.log(count.value)
    },
    roundId: props.roundId,
    // key: props.key
  };
};

export default useMainPlayAreaController;
