import {useEffect} from 'react';
import {LayoutChangeEvent} from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import { CellType, OperationCell, Operator } from '../problem-generator';
// import {CellType, OperationCell, Operator} from '../controller';
import {GamePageActions} from '../redux';
import {Cell, CoOrdinates} from './index';
import useStopWatch from './stop-watch/stop-watch';

// export type OperationCell = {
//   operator: {
//     label: string;
//     operate: (value1: number, value2: number) => number;
//   };
//   number: number;
// };

export type MainPlayAreaProps = {
  answerToBeFound: number;
  operatorCells: OperationCell[];
  onTimeOver: () => void;
  validateResult: (total: number) => void;
  roundId: number;
  onTouchBackButton: () => void;
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
  // const problemsSolved = useSelector((state: RootState) => state.gamePage.problemsSolved);
  const currentScore = useSelector((state: RootState) => state.gamePage.currentScore);
  const stopWatch = useStopWatch();

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
    // let total = 0;
    if (selectedIndexes.value.length == 3) {
      const selectedCells = selectedIndexes.value.map(
        index => props.operatorCells[index],
      );
      const operandsInSelectedCells = selectedCells.filter(
        cell => cell.type === CellType.NUMBER,
      );
      const operatorsInSelectedCells = selectedCells.filter(
        cell => cell.type === CellType.OPERATOR,
      );
      if (
        selectedCells[0].type === CellType.NUMBER &&
        selectedCells[1].type === CellType.OPERATOR &&
        selectedCells[2].type === CellType.NUMBER
      ) {
        const operatorValue = operatorsInSelectedCells[0].value as Operator;
        const total = operatorValue.operate(
          operandsInSelectedCells[0].value as number,
          operandsInSelectedCells[1].value as number,
        );
        props.validateResult(total);
      }
      // selectedIndexes.value.forEach(index => {
      //   const {value, type} = props.operatorCells[index];
      //   total = operator.operate(total, number);
      // });
      console.log('selectedIndex,', selectedIndexes.value);
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
          console.log('EventX', evt.x, p.position.x);
          console.log('EventY', evt.y, p.position.y);
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
          console.log('EventActiveX', evt.x, p.position.x);
          console.log('EventActiveY', evt.y, p.position.y);
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
      if (!canTouch.value) {
        return;
      }
      endPoint.value = null;
      if (selectedIndexes.value.length > 0) {
        runOnJS(checkResult)();
      }
    },
  });

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    console.log('ContainerX', event.nativeEvent.layout.x);
    console.log('ContainerY', event.nativeEvent.layout.y);
    containerLayout.value = {
      width,
      height,
      min: Math.min(width, height),
    };
  };

  const onPatternLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
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

    console.log('X', event.nativeEvent.layout.x);
    console.log('Y', event.nativeEvent.layout.y);
    console.log('Points', points);
  };

  const getOperatorCellLabel = (idx: number) => {
    if (props.operatorCells[idx].type === CellType.OPERATOR) {
      const value = props.operatorCells[idx].value as Operator;
      return value.label;
    } else {
      return props.operatorCells[idx].value;
    }
  };

  const onTimeUp = () => {
    console.log('###########');
    console.log('Time Up');
    console.log('###########');
    // dispatch(GamePageActions.setShowRestartModal(true));
  };

  const offset = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scaleX: offset.value}, {scaleY: offset.value}],
    };
  });

  const playAnimation = () => {
    offset.value = 0;
    offset.value = withTiming(1, {
      duration: 150,
      // easing: Easing.out(Easing.exp),
    });
  };

  // useEffect(() => {
  //   playAnimation();
  // }, [props.operatorCells]);

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
    roundId: props.roundId,
    animatedStyles,
    // score: problemsSolved,
    currentScore,
    onTimeOver: props.onTimeOver,
    onTouchBackButton: props.onTouchBackButton,
  };
};

export default useMainPlayAreaController;
