import {useState} from 'react';
import {LayoutChangeEvent} from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { GamePageActions } from '../redux';
import {Cell, CoOrdinates} from './index';

// export enum Operation {
//   ADDITION = '+',
//   SUBTRACTION = '-',
//   MULTIPLIACTION = '*',
//   DIVISION = '/',
// }

type SupportedOperation = 'ADDITION' | 'SUBTRACTION';
// | "MULTIPLICATION"
// | "DIVISION"
type IOperation = {
  [key in SupportedOperation]: {
    label: string;
    operate: (value1: number, value2: number) => number;
  };
};

const operations: IOperation = {
  ADDITION: {
    label: '+',
    operate: (value1: number, value2: number) => value1 + value2,
  },
  SUBTRACTION: {
    label: '-',
    operate: (value1: number, value2: number) => value1 - value2,
  },
  // MULTIPLICATION: {
  //   label: "*",
  //   operate: (value1: number, value2: number) => value1 * value2
  // },
  // DIVISION: {
  //   label: "/",
  //   operate: (value1: number, value2: number) => value1 / value2
  // }
};

export type OperationCell = {
  operator: {
    label: string;
    operate: (value1: number, value2: number) => number;
  };
  number: number;
};

const totalCellsCount = 4;
const difficultyLevel = 1;
const generateRandomNumber = (upperLimit: number, startValue: number = 0) =>
  Math.floor(Math.random() * upperLimit + startValue);
const shuffle = (array: number[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = generateRandomNumber(currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

// const getOperationValuesAndResult = () => {
//   const operatorCell: OperationCell[] = []
//   const operationKeys = Object.keys(operations);
//   const totalOperationsCount = operationKeys.length;
//   for(let idx=0;idx < totalCellsCount; idx++) {
//     console.log("TotalOperationCount",totalOperationsCount);
//     const operationIdx = generateRandomNumber(totalOperationsCount)
//     operatorCell.push({
//       operator: operations[operationKeys[operationIdx] as SupportedOperation],
//       // number: Math.floor((Math.random() * (difficultyLevel * 10)) + 1)
//       number: generateRandomNumber((difficultyLevel * 10), 1)
//     })
//   }

//   const totalNumberOfChoosenOperation = generateRandomNumber(totalCellsCount, 2);
//   const operationCellOrder = shuffle([...Array(totalCellsCount).keys()]).slice(0, totalNumberOfChoosenOperation)
//   console.log("--operationCellOrder", operationCellOrder.map((order)=> `${operatorCell[order].operator.label}${operatorCell[order].number}`))
//   console.log("--operatorCell", operatorCell.map((cell)=> `${cell.operator.label}${cell.number}`))
//   return {
//     result:operationCellOrder.reduce((total, orderIdx) => operatorCell[orderIdx].operator.operate(total, operatorCell[orderIdx].number), 0),
//     operatorCell
//   }
// }

export type MainPlayAreaProps = {
  answerToBeFound: number;
  operatorCells: OperationCell[];
  onAnswerFound: () => void;
  onAnswerNotFound: () => void;
};

const useMainPlayAreaController = (props: MainPlayAreaProps) => {
  console.log('Init useMainPlayAreaController Controller');
  // const [operatorAndResultState, setOperatorAndResultState] = useState(getOperationValuesAndResult());
  // const {result, operatorCell}= operatorAndResultState;
  const endPoint = useSharedValue(null as CoOrdinates | null);
  const canTouch = useSharedValue(true);
  const patternPoints = useSharedValue([] as Cell[]);
  const selectedIndexes = useSharedValue([] as number[]);
  const containerLayout = useSharedValue({width: 0, height: 0, min: 0});
  const rowCount = 2;
  const columnCount = 2;
  const patternMargin = 2;
  const [timerKeyId , setTimerKeyId] = useState(0);
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
    selectedIndexes.value.forEach(index => {
      const {operator, number} = props.operatorCells[index];
      total = operator.operate(total, number);
    });
    if (total === props.answerToBeFound) {
      setTimerKeyId((timerKeyId) => timerKeyId + 1)
      props.onAnswerFound();
      // setOperatorAndResultState(getOperationValuesAndResult())
      console.log('Answer found');
    } else {
      props.onAnswerNotFound();
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
      // operation: operatorCell[idx],
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
    timerKeyId
  };
};

export default useMainPlayAreaController;
