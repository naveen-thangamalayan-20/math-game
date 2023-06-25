import {generateRandomNumber, iif, shuffle} from '../utils/iif';
import { DifficultyLevel } from './redux';

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

export enum Operators {
  ADDITION = '+',
  SUBTRACTION = '-',
  MULTIPLICATION = '*',
}

export const operations: IOperation = {
  ADDITION: {
    label: Operators.ADDITION,
    operate: (value1: number, value2: number) => value1 + value2,
  },
  SUBTRACTION: {
    label: Operators.SUBTRACTION,
    operate: (value1: number, value2: number) => value1 - value2,
  },
  MULTIPLICATION: {
    label: Operators.MULTIPLICATION,
    operate: (value1: number, value2: number) => value1 * value2,
  },
  // DIVISION: {
  //   label: "/",
  //   operate: (value1: number, value2: number) => value1 / value2
  // }
};

export const getOperationValuesAndResult = (difficultyLevel: number) => {
  // const difficultyLevel: number = 1
  const {operand1StartingNumber, operand2StartingNumber, operand1EndingNumber, operand2EndingNumber} = iif(
    function getOperandStartingNumber() {
     if (difficultyLevel === DifficultyLevel.BEGINNER) {
        return {
          operand1StartingNumber: 50,
          operand1EndingNumber: 100,
          operand2StartingNumber: 2,
          operand2EndingNumber: 10,
        };
      } else if (difficultyLevel === DifficultyLevel.HARD) {
        return {
          operand1StartingNumber: 50,
          operand1EndingNumber: 100,
          operand2StartingNumber: 50,
          operand2EndingNumber: 100,
        };
      }
      else if (difficultyLevel === DifficultyLevel.EXPERT) {
        return {
          operand1StartingNumber: 100,
          operand1EndingNumber: 1000,
          operand2StartingNumber: 50,
          operand2EndingNumber: 100,
        };
      } else {
        return {
          operand1StartingNumber: 2,
          operand1EndingNumber: 10,
          operand2StartingNumber: 2,
          operand2EndingNumber: 10,
        }
      }
    },
  );
  // const operatorCell: OperationCell[] = [];
  const operand1 = generateRandomNumber(
    operand1EndingNumber,
    operand1StartingNumber,
  );
  const operand2 = generateRandomNumber(
    operand2EndingNumber,
    operand2StartingNumber,
  );
  console.log("##DifficultyLevel:"+difficultyLevel+":"+operand1+":"+operand2)
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
