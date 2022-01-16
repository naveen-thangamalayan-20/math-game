import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import {GamePageActions} from './redux';

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
    console.log('TotalOperationCount', totalOperationsCount);
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
  console.log(
    '--operationCellOrder',
    operationCellOrder.map(
      order =>
        `${operatorCell[order].operator.label}${operatorCell[order].number}`,
    ),
  );
  console.log(
    '--operatorCell',
    operatorCell.map(cell => `${cell.operator.label}${cell.number}`),
  );
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

const INITIAL_TOTAL_ROUND_DURATION = 10;

const useGameController = () => {
  const [operatorAndResultState, setOperatorAndResultState] = useState(
    getOperationValuesAndResult(),
  );
  // const [roundDuration , setRoundDuration ]= useState(40)
  const dispatch = useDispatch();
  const [roundId, setroundId] = useState(0);
  useEffect(() => {
    dispatch(GamePageActions.updateTotalGameRemainingTime(INITIAL_TOTAL_ROUND_DURATION));
  }, []);
  const totalGameRemainingTime = useSelector(
    (state: RootState) => state.gamePage.totalGameRemainingTime,
  );
  const {result, operatorCell} = operatorAndResultState;

  const onAnswerFound = (remainingDuration: number) => {
    // setRoundDuration(remainingDuration + 5)
    dispatch(
      GamePageActions.updateTotalGameRemainingTime(totalGameRemainingTime + 10),
    );
    setOperatorAndResultState(getOperationValuesAndResult());
    setroundId(roundId => roundId + 1);
  };

  const onAnswerNotFound = (remainingDuration: number) => {
    console.log('remainingDuration', remainingDuration);
    // setRoundDuration(remainingDuration - 2)
    dispatch(
      GamePageActions.updateTotalGameRemainingTime(totalGameRemainingTime - 2),
    );
    setroundId(roundId => roundId + 1);
    console.log('Answer Not found');
  };

  const onTimeOver = () => console.log('Time Over');

  const onRestartGame = () => {
    dispatch(
      GamePageActions.updateTotalGameRemainingTime(INITIAL_TOTAL_ROUND_DURATION),
    );
    setOperatorAndResultState(getOperationValuesAndResult());
    setroundId(roundId => roundId + 1);
  }

  return {
    operatorCell,
    result,
    onAnswerNotFound,
    onAnswerFound,
    roundDuration: 20,
    roundId,
    onTimeOver,
    onRestartGame
  };
};

export default useGameController;
