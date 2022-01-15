import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import RestartModal from '../restart-modal';
import AnswerToBeFound from './answer-to-be-found/answer-to-be-found';
import useMainPlayAreaController, {MainPlayAreaProps} from './controller';
import Timer from './timer/timer';

export type CoOrdinates = {
  x: number;
  y: number;
};

export type Cell = {
  position: CoOrdinates;
};
const inactiveColor = '#8E91A8';

type Props = {
  destinationNumber: number;
};

export default function MainPlayArea(props: MainPlayAreaProps) {
  const [isError, setIsError] = useState(false);
  const rowCount = 2;
  const columnCount = 2;
  const patternMargin = 2;
  const errorColor = '#D93609';
  const activeColor = '#5FA8FC';
  const controller = useMainPlayAreaController(props);
  function renderCell() {
    return (
      <Animated.View
        style={controller.cvc}
        onLayout={controller.onPatternLayout}>
        {Array(rowCount * columnCount)
          .fill(0)
          .map((_, idx) => {
            const patternColor = useDerivedValue(() => {
              if (
                controller.selectedIndexes.value.findIndex(v => v === idx) < 0
              ) {
                return inactiveColor;
              } else if (isError) {
                return errorColor;
              } else {
                return activeColor;
              }
            });
            const outer = useAnimatedStyle(() => {
              return {
                borderWidth: 2,
                width: 2 * controller.R.value,
                height: 2 * controller.R.value,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: patternColor.value,
                borderRadius: 2 * controller.R.value,
                margin: patternMargin,
              };
            });
            return (
              <Animated.View key={idx} style={outer}>
                <Text style={styles.number}>
                  {controller.getOperatorCellLabel(idx)}
                </Text>
              </Animated.View>
            );
          })}
      </Animated.View>
    );
  }


  return (
    <View style={styles.mainContainer}>
      <Timer duration={props.duration} onTimeOut={controller.onTimeUp} key={controller.roundId}/>
      <View style={styles.answerCell}>
        <Text style={styles.number}>{controller.answerToBeFound}</Text>
      </View>
      <PanGestureHandler onGestureEvent={controller.panHandler}>
        <Animated.View
          style={styles.container}
          onLayout={controller.onContainerLayout}>
          <TapGestureHandler onGestureEvent={controller.panHandler}>
            {renderCell()}
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    elevate: 2,
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    top: 180,
    width: 200,
    height: 200,
  },
  number: {
    fontSize: 28,
    alignItems: 'center',
  },
  timer: {
    borderWidth: 2,
    width: 80,
    height: 80,
    top: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: inactiveColor,
  },
  answerCell: {
    borderWidth: 2,
    width: 100,
    height: 100,
    top: 150,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: inactiveColor,
  },
});
