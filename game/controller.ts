import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import {GameOverReason, GamePageActions, INITIAL_TOTAL_ROUND_DURATION} from './redux';

type SupportedOperation = 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION';
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
  MULTIPLICATION: {
    label: '*',
    operate: (value1: number, value2: number) => value1 * value2,
  },
  // DIVISION: {
  //   label: "/",
  //   operate: (value1: number, value2: number) => value1 / value2
  // }
};

export type OperationCell =
  | {
      type: CellType.NUMBER;
      value: number;
    }
  | {
      type: CellType.OPERATOR;
      value: Operator;
    };

const totalCellsCount = 4;
const difficultyLevel = 1;

const generateRandomNumber = (
  upperLimit: number,
  startValue: number = 0,
  allowDecimals = false,
) =>
  allowDecimals
    ? Math.round((Math.random() * upperLimit + startValue) * 10) / 10
    : Math.floor(Math.random() * upperLimit + startValue);

const shuffle = (array: OperationCell[]) => {
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

export enum CellType {
  NUMBER,
  OPERATOR,
}

const getOperationValuesAndResult = () => {
  const operatorCell: OperationCell[] = [];
  const operand1 = generateRandomNumber(
    difficultyLevel * 10,
    difficultyLevel + 2,
  );
  const operand2 = generateRandomNumber(
    difficultyLevel * 10,
    difficultyLevel + 2,
  );
  const operationKeys = Object.keys(operations);
  let totalOperationsCount = operationKeys.length;
  const firstOperatorIndex = generateRandomNumber(totalOperationsCount);
  const answerOperator =
    operations[operationKeys[firstOperatorIndex] as SupportedOperation];
  [operationKeys[totalOperationsCount - 1], operationKeys[firstOperatorIndex]] =
    [
      operationKeys[firstOperatorIndex],
      operationKeys[totalOperationsCount - 1],
    ];
  const newTotalOperationCountAfterSwappingChooseOperator =
    --totalOperationsCount;
  const otherOperator =
    operations[
      operationKeys[
        generateRandomNumber(newTotalOperationCountAfterSwappingChooseOperator)
      ] as SupportedOperation
    ];
  const choosenOperatorCells = shuffle([
    {
      type: CellType.OPERATOR,
      value: answerOperator,
    },
    {
      type: CellType.OPERATOR,
      value: otherOperator,
    },
  ]);
  const operandCells = shuffle([
    {
      type: CellType.NUMBER,
      value: operand1,
    },
    {
      type: CellType.NUMBER,
      value: operand2,
    },
  ]);
  return {
    result: answerOperator.operate(operand1, operand2),
    operatorCell: [
      operandCells[0],
      choosenOperatorCells[0],
      choosenOperatorCells[1],
      operandCells[1],
    ],
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
  const score = useSelector((state: RootState) => state.gamePage.score);
  const {result, operatorCell} = operatorAndResultState;

  console.log('Main,currentRoundRemainingTime', currentRoundRemainingTime);

  useEffect(() => {
    dispatch(GamePageActions.updateStartTimer(true));
    console.log('Mounted MainGame');
  }, []);

  const onAnswerFound = () => {
    // const newTotalTime = currentRoundRemainingTime + 3;
    setOperatorAndResultState(getOperationValuesAndResult());
    dispatch(
      GamePageActions.updateGameTime(
        INITIAL_TOTAL_ROUND_DURATION,
        INITIAL_TOTAL_ROUND_DURATION,
      ),
    );
    dispatch(GamePageActions.updateScore(score + 1))
    setroundId(roundId => roundId + 1);
  };

  const onAnswerNotFound = () => {
    // const newTotalTime = currentRoundRemainingTime - 2;
    // console.log('NewCurrentRoundRemainingTime=AnswerNotFound', newTotalTime);
    dispatch(GamePageActions.updateGameOverReason(GameOverReason.WRONG_ANSWER));
    dispatch(GamePageActions.setShowRestartModal(true));
    dispatch(GamePageActions.updateStartTimer(false));
    setroundId(roundId => roundId + 1);
    console.log('Answer Not found');
  };

  const validateResult = (total: number) => {
    console.log(
      'VAlidateResult--currentRoundRemainingTime=AnswerNotFound',
      currentRoundRemainingTime,
      total,
    );
    if (total === result) {
      onAnswerFound();
    } else {
      onAnswerNotFound();
    }
  };

  const onTimeOver = () => {
    dispatch(GamePageActions.updateGameOverReason(GameOverReason.TIME_UP));
    dispatch(GamePageActions.setShowRestartModal(true));
    dispatch(GamePageActions.updateStartTimer(false));
  }

  const onRestartGame = () => {
    dispatch(GamePageActions.updateStartTimer(false));
    dispatch(
      GamePageActions.updateGameTime(
        INITIAL_TOTAL_ROUND_DURATION,
        INITIAL_TOTAL_ROUND_DURATION,
      ),
    );
    dispatch(GamePageActions.setShowRestartModal(false));
    setOperatorAndResultState(getOperationValuesAndResult());
    setroundId(roundId => roundId + 1);
  };

  return {
    operatorCell,
    result,
    roundDuration: 20,
    roundId,
    onTimeOver,
    onRestartGame,
    validateResult,
  };
};

export default useGameController;
