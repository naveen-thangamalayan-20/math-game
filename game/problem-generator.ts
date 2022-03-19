import {generateRandomNumber, shuffle} from '../utils/iif';


export type OperationCell =
| {
    type: CellType.NUMBER;
    value: number;
  }
| {
    type: CellType.OPERATOR;
    value: Operator;
  };
  
export enum CellType {
  NUMBER,
  OPERATOR,
}

type SupportedOperation = 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION';

export type Operator = {
  label: string;
  operate: (value1: number, value2: number) => number;
};
const difficultyLevel = 1;

type IOperation = {
  [key in SupportedOperation]: Operator;
};

export const operations: IOperation = {
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

export const getOperationValuesAndResult = () => {
  // const operatorCell: OperationCell[] = [];
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
    ] as OperationCell[],
  };
};
