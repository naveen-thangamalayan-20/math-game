import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import {GamePageActions, INITIAL_TOTAL_ROUND_DURATION} from './redux';

type SupportedOperation = 'ADDITION' | 'SUBTRACTION';
// | "MULTIPLICATION"
// | "DIVISION"
export type Operator = {
  label: string;
  operate: (value1: number, value2: number) => number;
};

type IOperation = {
  [key in SupportedOperation]: Operator;
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
  operator: Operator;
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

const getOperationValuesAndResult = () => {
  const operatorCell: OperationCell[] = [];
  const operationKeys = Object.keys(operations);
  const totalOperationsCount = operationKeys.length;
  for (let idx = 0; idx < totalCellsCount; idx++) {
    const operationIdx = generateRandomNumber(totalOperationsCount);
    operatorCell.push({
      operator: operations[operationKeys[operationIdx] as SupportedOperation],
      number: generateRandomNumber(difficultyLevel * 10, 1),
    });
  }

  const totalNumberOfChoosenOperation = generateRandomNumber(
    totalCellsCount,
    2,
  );
  const operationCellOrder = shuffle([...Array(totalCellsCount).keys()]).slice(
    0,
    totalNumberOfChoosenOperation,
  );
  // console.log(
  //   '--operationCellOrder',
  //   operationCellOrder.map(
  //     order =>
  //       `${operatorCell[order].operator.label}${operatorCell[order].number}`,
  //   ),
  // );
  // console.log(
  //   '--operatorCell',
  //   operatorCell.map(cell => `${cell.operator.label}${cell.number}`),
  // );
  return {
    result: operationCellOrder.reduce(
      (total, orderIdx) =>
        operatorCell[orderIdx].operator.operate(
          total,
          operatorCell[orderIdx].number,
        ),
      0,
    ),
    operatorCell,
  };
};


const useGameController = () => {
  const [operatorAndResultState, setOperatorAndResultState] = useState(
    getOperationValuesAndResult(),
  );
  const dispatch = useDispatch();
  const [roundId, setroundId] = useState(0);
  const currentRoundRemainingTime = useSelector(
    (state: RootState) => state.gamePage.currentRoundRemainingTime,
  );
  const {result, operatorCell} = operatorAndResultState;

  console.log("Main,currentRoundRemainingTime", currentRoundRemainingTime)

  useEffect(() => {
    dispatch(GamePageActions.updateStartTimer(true));
    console.log("Mounted MainGame")
    }, []
  )

  const onAnswerFound = () => {
    const newTotalTime = currentRoundRemainingTime + 10;
    setOperatorAndResultState(getOperationValuesAndResult());
    dispatch(GamePageActions.updateGameTime(newTotalTime, newTotalTime));
    setroundId(roundId => roundId + 1);
  };

  const onAnswerNotFound = () => {
    console.log('currentRoundRemainingTime=AnswerNotFound', currentRoundRemainingTime);
    const newTotalTime = currentRoundRemainingTime - 2;
    console.log('NewCurrentRoundRemainingTime=AnswerNotFound', newTotalTime);
    if(newTotalTime > 0) {
      dispatch(GamePageActions.updateGameTime(newTotalTime, newTotalTime));    
    } else {
      dispatch(GamePageActions.setShowRestartModal(true));
      dispatch(GamePageActions.updateStartTimer(false));
    }
    setroundId(roundId => roundId + 1);
    console.log('Answer Not found');
  };

  const validateResult = (total: number) => {
    console.log('VAlidateResult--currentRoundRemainingTime=AnswerNotFound', currentRoundRemainingTime, total);
    if (total === result) {
      onAnswerFound();
    } else {
      onAnswerNotFound();
    }
  }

  const onTimeOver = () => console.log('Time Over');

  const onRestartGame = () => {
    dispatch(GamePageActions.updateStartTimer(false));
    // dispatch(GamePageActions.updateGameTime(INITIAL_TOTAL_ROUND_DURATION, INITIAL_TOTAL_ROUND_DURATION));
    dispatch(GamePageActions.updateGameTime(INITIAL_TOTAL_ROUND_DURATION, INITIAL_TOTAL_ROUND_DURATION));
    dispatch(
      GamePageActions.setShowRestartModal(false),
    );
    setOperatorAndResultState(getOperationValuesAndResult());
    setroundId(roundId => roundId + 1);
  }

  return {
    operatorCell,
    result,
    roundDuration: 20,
    roundId,
    onTimeOver,
    onRestartGame,
    validateResult
  };
};

export default useGameController;
