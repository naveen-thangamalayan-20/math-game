import { getOperationValuesAndResult } from "../problem-generator";

describe('Game controller', () => {
    it("if difficult level is 2 first operand should be greater than 100 and second operand be less than 100", () => {
      const cells = getOperationValuesAndResult(1).operatorCell.filter((cell) => cell.type === 0).map((cell) => cell.value);
      expect(cells.every((cell) => cell < 100)).toBeTruthy()
    });

    it("if difficult level is 2 first operand should be greater than 100 and second operand be less than 10", () => {
        const cells = getOperationValuesAndResult(2).operatorCell.filter((cell) => cell.type === 0).map((cell) => cell.value);
        expect(cells.some((cell) => cell < 100)).toBeTruthy()
    });

    it("if difficult level is 3 first operand should be greater than 100 and second operand be greater than 100", () => {
        const cells = getOperationValuesAndResult(3).operatorCell.filter((cell) => cell.type === 0).map((cell) => cell.value);
        console.log(cells)
        expect(cells.every((cell) => cell < 1000 && cell > 100)).toBeTruthy()
    });

    it("if difficult level is 4 first operand should be greater than 1000 and second operand be less than 1000", () => {
        const cells = getOperationValuesAndResult(4).operatorCell.filter((cell) => cell.type === 0).map((cell) => cell.value);
        console.log(cells)
        expect(cells.some((cell) => cell > 1000)).toBeTruthy()
    });

});