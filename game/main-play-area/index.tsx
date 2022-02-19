import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import useMainPlayAreaController, {MainPlayAreaProps} from './controller';
import Timer from './timer/timer';

export type CoOrdinates = {
  x: number;
  y: number;
};

export type Cell = {
  position: CoOrdinates;
};
const inactiveColor = '#e6e6e6';

type Props = {
  destinationNumber: number;
};

export default function MainPlayArea(props: MainPlayAreaProps) {
  const [isError, setIsError] = useState(false);
  const rowCount = 2;
  const columnCount = 2;
  const patternMargin = 2;
  const errorColor = '#D93609';
  // const activeColor = '#5FA8FC';
  const activeColor = '#CCCCCC';
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
                width: 2 * controller.R.value,
                height: 2 * controller.R.value,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: patternColor.value,
                backgroundColor: patternColor.value,
                borderRadius: 10,
                margin: patternMargin,
                color:"#ffffff",
                // textDecorationColor:"#fffff",
              };
            });
            return (
              <Animated.View key={idx} style={outer}>
                <Text style={styles.number} accessibilityLabel={`option-${idx}`}>
                  {controller.getOperatorCellLabel(idx)}
                </Text>
              </Animated.View>
            );
          })}
      </Animated.View>
    );
  }

  useEffect(() => {
  console.log("Mounted MainPlayArea")
  }, [])

  return (
    <View style={styles.mainContainer}>
      <Timer onTimeOut={controller.onTimeUp} key={controller.roundId}/>
      <Animated.View style={[styles.answerCell, controller.animatedStyles]}>
        <Text style={styles.number} accessibilityLabel="answer-cell">{controller.answerToBeFound}</Text>
      </Animated.View>
      <PanGestureHandler onGestureEvent={controller.panHandler}>
        <Animated.View
          style={[styles.container, controller.animatedStyles]}
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
    backgroundColor:"#1a1a1a"
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
    color:"#000000",
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
    borderRadius: 10,
    color:"#fffff",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: inactiveColor,
    backgroundColor: inactiveColor,
  },
});
