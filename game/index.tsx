import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import useGameController, {GameProps} from './controller';
import MainPlayArea from './main-play-area';
import RestartModal from './restart-modal';

export type CoOrdinates = {
  x: number;
  y: number;
};

export type Cell = {
  position: CoOrdinates;
};

// type Props = {
//   destinationNumber: number;
//   operatorCells: OperationCell[];
// };

export default function Game(props: GameProps) {
  const controller = useGameController(props);
  const renderProgress = () => {
    if (controller.shouldRenderProgress()) {
      return <Text>Loading....</Text>;
    }
  };

  const renderContent = () => {
    if (controller.shouldRenderContent()) {
      return (
        <>
          <RestartModal
            // navigation={navigation}
            onQuitGame={controller.onQuitGame}
            onRestartGame={controller.onRestartGame}
            onResumeGame={controller.onResumeGame}
          />
          <MainPlayArea
            answerToBeFound={controller.result}
            operatorCells={controller.operatorCell}
            roundId={controller.roundId}
            onTimeOver={controller.onTimeOver}
            onTouchBackButton={controller.onTouchBackButton}
            validateResult={controller.validateResult}
          />
        </>
      );
    }
  };

  return (
    <View
      style={styles.mainContainer}
      accessibilityLabel="testview"
      testID="test-mainView">
      {renderProgress()}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
