import {useState} from 'react';


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
      // number: Math.floor((Math.random() * (difficultyLevel * 10)) + 1)
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

const useGameController = () => {
  console.log('Init GAme Controller');
  const [operatorAndResultState, setOperatorAndResultState] = useState(
    getOperationValuesAndResult(),
  );

  const {result, operatorCell} = operatorAndResultState;
 
  const onAnswerFound = () => setOperatorAndResultState(getOperationValuesAndResult())

  const onAnswerNotFound = () => console.log("Answer Not found")
  return {
    operatorCell,
    result,
    onAnswerNotFound,
    onAnswerFound
  };
};

export default useGameController;
