import React, {useState} from 'react';
import {LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import useGameController, {Operation, OperationCell} from './controller';

export type CoOrdinates = {
  x: number;
  y: number;
};

export type Cell = {
  position: CoOrdinates;
  operation: OperationCell;
};
const inactiveColor = '#8E91A8';

type Props = {
  destinationNumber: number
}

export default function Game() {
  const [isError, setIsError] = useState(false);
  const rowCount = 2;
  const columnCount = 2;
  const patternMargin = 2;
  const errorColor = '#D93609';
  const activeColor = '#5FA8FC';
  // const containerLayout = useSharedValue({width: 0, height: 0, min: 0});

  // const endPoint = useSharedValue(null as CoOrdinates | null);
  // const canTouch = useSharedValue(true);
  // const containerLayout = useSharedValue({width: 0, height: 0, min: 0});
  // const selectedIndexes = useSharedValue([] as number[]);
  // const patternPoints = useSharedValue([] as Cell[]);
  const controller = useGameController();
  function renderCell() {
    return (
      <Animated.View style={controller.cvc} onLayout={controller.onPatternLayout}>
        {Array(rowCount * columnCount)
          .fill(0)
          .map((_, idx) => {
            const patternColor = useDerivedValue(() => {
              if (controller.selectedIndexes.value.findIndex(v => v === idx) < 0) {
                return inactiveColor;
              } else if (isError) {
                return errorColor;
              } else {
                return activeColor;
              }
            });
            console.log("R Value", controller.R.value)
            const outer = useAnimatedStyle(() => {
              return {
                borderWidth: 2,
                width: 2 * controller.R.value,
                height: 2 * controller.R.value,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: patternColor.value,
                // borderRadius: 2 * R.value,
                margin: patternMargin,
              };
            });
            const inner = useAnimatedStyle(() => {
              return {
                width: controller.R.value * 0.8,
                height: controller.R.value * 0.8,
                // height: 100,
                // borderRadius: R.value * 0.8,
                // backgroundColor: patternColor.value,
              };
            });
            return (
              <Animated.View key={idx} style={outer}>
                {/* <Animated.View style={inner}> */}
                  <Text
                    style={
                      styles.number
                    }>{`${controller.operations[idx].operation}${controller.operations[idx].number}`}</Text>
                {/* </Animated.View> */}
              </Animated.View>
            );
          })}
      </Animated.View>
    );
  }

  // const cvc = useAnimatedStyle(() => ({
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   marginBottom: `${
  //     Math.max(
  //       0,
  //       containerLayout.value.height / containerLayout.value.width - 1.25,
  //     ) * 50
  //   }%`,
  //   width: containerLayout.value.min,
  //   height: containerLayout.value.min,
  // }));
  // const R = useDerivedValue(
  //   () => (containerLayout.value.min / rowCount - patternMargin * 2) / 2,
  // );

  // const onPatternLayout = (event: LayoutChangeEvent) => {
  //   const layout = event.nativeEvent.layout;
  //   console.log('Pattern layout', layout);
  //   const points = [];
  //   for (let i = 0; i < rowCount; i++) {
  //     for (let j = 0; j < columnCount; j++) {
  //       points.push({
  //         x: layout.x + (layout.width / columnCount) * (j + 0.5),
  //         y: layout.y + (layout.height / rowCount) * (i + 0.5),
  //       });
  //     }
  //   }
  //   patternPoints.value = points.map((p, idx) => ({
  //     position: {x: p.x, y: p.y},
  //     operation: controller.operations[idx],
  //   }));
  // };

  // const onContainerLayout = (event: LayoutChangeEvent) => {
  //   const {width, height} = event.nativeEvent.layout;
  //   console.log('Container Layout', width, height);
  //   containerLayout.value = {
  //     width,
  //     height,
  //     min: Math.min(width, height),
  //   };
  // };
  

  // const panHandler = useAnimatedGestureHandler<
  //   PanGestureHandlerGestureEvent | TapGestureHandlerGestureEvent
  // >({
  //   onStart: evt => {
  //     if (
  //       canTouch.value &&
  //       patternPoints.value &&
  //       selectedIndexes.value.length === 0
  //     ) {
  //       const selected: number[] = [];
  //       patternPoints.value.every((p, idx) => {
  //         if (
  //           (p.position.x - evt.x) * (p.position.x - evt.x) +
  //             (p.position.y - evt.y) * (p.position.y - evt.y) <
  //           R.value * R.value
  //         ) {
  //           selected.push(idx);
  //           return false;
  //         }
  //         return true;
  //       });
  //       selectedIndexes.value = selected;
  //     }
  //   },
  //   onActive: evt => {
  //     if (
  //       canTouch.value &&
  //       patternPoints.value &&
  //       selectedIndexes.value.length > 0
  //     ) {
  //       patternPoints.value.every((p, idx) => {
  //         if (
  //           (p.position.x - evt.x) * (p.position.x - evt.x) +
  //             (p.position.y - evt.y) * (p.position.y - evt.y) <
  //           R.value * R.value
  //         ) {
  //           if (selectedIndexes.value.indexOf(idx) < 0) {
  //             selectedIndexes.value = [...selectedIndexes.value, idx];
  //           }
  //           return false;
  //         }
  //         return true;
  //       });
  //       endPoint.value = {x: evt.x, y: evt.y};
  //     }
  //   },
  //   onEnd: evt => {
  //     if (!canTouch.value) return;
  //     endPoint.value = null;
  //     if (selectedIndexes.value.length > 0) {
  //       console.log(selectedIndexes);
  //       // checkResult(;
  //       runOnJS(checkResult)();
  //     }
  //   },
  // });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.answerCell}>
        <Text style={styles.number}>{controller.result}</Text>
      </View>
      <PanGestureHandler onGestureEvent={controller.panHandler}>
        <Animated.View style={styles.container} onLayout={controller.onContainerLayout}>
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
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    top: 180,
    width: 200,
    height: 200,
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'green',
    alignSelf: 'center',
  },
  number: {
    fontSize: 28,
    alignItems: 'center',
  },
  answerCell: {
    borderWidth: 2,
    width: 100,
    height: 100,
    top: 150,
    alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: inactiveColor,
  },
});
