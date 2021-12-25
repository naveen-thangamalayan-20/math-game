import {useState} from 'react';
import { LayoutChangeEvent } from 'react-native';
import { PanGestureHandlerGestureEvent, TapGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Cell, CoOrdinates } from './index';

export enum Operation {
  ADDITION = '+',
  SUBTRACTION = '-',
  MULTIPLIACTION = '*',
  DIVISION = '/',
}

export type OperationCell = {
  operation: Operation;
  number: number;
}
const useGameController = () => {
  const result = 9;
  const operations: OperationCell[] = [
    {
      operation: Operation.ADDITION,
      number: 5,
    },
    {
      operation: Operation.ADDITION,
      number: 4,
    },
    {
      operation: Operation.ADDITION,
      number: 10,
    },
    {
      operation: Operation.SUBTRACTION,
      number: 10,
    }
  ];

  const endPoint = useSharedValue(null as CoOrdinates | null);
  const canTouch = useSharedValue(true);
  const patternPoints = useSharedValue([] as Cell[]);
  const selectedIndexes = useSharedValue([] as number[]);
  const containerLayout = useSharedValue({width: 0, height: 0, min: 0});
  const rowCount = 2;
  const columnCount = 2;
  const patternMargin = 2;
  // const checkResult = (selectedIndexes: number[]) => {
  //   let total = 0;
  //   const mapper = {
  //     [Operation.ADDITION]: (value1: number, value2: number) => value1 + value2,
  //     [Operation.SUBTRACTION]: (value1: number, value2: number) => value1 - value2,
  //     [Operation.MULTIPLIACTION]: (value1: number, value2: number) => value1 * value2,
  //     [Operation.DIVISION]: (value1: number, value2: number) => value1 / value2,
  //   }
  //   selectedIndexes.forEach((index) => {
  //     const { operation , number} = operations[index];
  //     total = mapper[operation](total, number);
  //   })
  //   if(total === result) {
  //     console.log("Answer found")
  //   } else {
  //     console.log("Answer not found")
  //   }
  // }
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
  
  const checkResult = () => {
    console.log('CAlling1234');
    let total = 0;
    const mapper = {
      [Operation.ADDITION]: (value1: number, value2: number) => value1 + value2,
      [Operation.SUBTRACTION]: (value1: number, value2: number) =>
        value1 - value2,
      [Operation.MULTIPLIACTION]: (value1: number, value2: number) =>
        value1 * value2,
      [Operation.DIVISION]: (value1: number, value2: number) => value1 / value2,
    };
    selectedIndexes.value.forEach(index => {
      const {operation, number} = operations[index];
      total = mapper[operation](total, number);
    });
    if (total === result) {
      console.log('Answer found');
    } else {
      console.log('Answer not found');
    }
    selectedIndexes.value = [];
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
      console.log(selectedIndexes);
      // checkResult(;
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
    operation: operations[idx],
  }));
};

  return {
    operations,
    result,
    panHandler,
    patternPoints,
    onPatternLayout,
    onContainerLayout,
    cvc,
    selectedIndexes,
    R
    // checkResult
  };
};

export default useGameController;
