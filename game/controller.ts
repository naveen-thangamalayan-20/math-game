import {useState} from 'react';

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

  return {
    operations,
    result,
    // checkResult
  };
};

export default useGameController;
