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
};

type Props = {
  destinationNumber: number;
  operatorCells: OperationCell[];
};

export default function Game( {navigation} : {navigation: any}) {
  const controller = useGameController();

  return (
    <View style={styles.mainContainer}>
      <RestartModal navigation={navigation} onRestartGame={controller.onRestartGame}/>
      <MainPlayArea
        answerToBeFound={controller.result}
        operatorCells={controller.operatorCell}
        roundId={controller.roundId}
        onTimeOver={controller.onTimeOver}
        validateResult={controller.validateResult}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
