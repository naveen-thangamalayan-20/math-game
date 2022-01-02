import React from 'react';
import {StyleSheet, View} from 'react-native';
import useGameController, {OperationCell} from './controller';
import MainPlayArea from './main-play-area';
import RestartModal from './restart-modal';

export type CoOrdinates = {
  x: number;
  y: number;
};

export type Cell = {
  position: CoOrdinates;
  // operation: OperationCell;
};
const inactiveColor = '#8E91A8';

type Props = {
  destinationNumber: number;
  operatorCells: OperationCell[];
};

export default function Game() {
  const controller = useGameController();

  return (
    <View style={styles.mainContainer}>
      <RestartModal />
      <MainPlayArea
        answerToBeFound={controller.result}
        operatorCells={controller.operatorCell}
        onAnswerFound={controller.onAnswerFound}
        onAnswerNotFound={controller.onAnswerNotFound}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
