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
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

type CoOrdinates = {
  x: number;
  y: number;
};

export default function Game() {
  const [isError, setIsError] = useState(false);
  const rowCount = 2;
  const columnCount = 2;
  const inactiveColor = '#8E91A8';
  const activeColor = '#5FA8FC';
  const errorColor = '#D93609';
  const patternMargin = 2;
  const endPoint = useSharedValue(null as CoOrdinates | null);
  const canTouch = useSharedValue(true);
  const containerLayout = useSharedValue({width: 0, height: 0, min: 0});
  const selectedIndexes = useSharedValue([] as number[]);
  const patternPoints = useSharedValue([] as CoOrdinates[]);
  function renderCell() {
    return (
      <Animated.View style={cvc} onLayout={onPatternLayout}>
        {Array(rowCount * columnCount)
          .fill(0)
          .map((_, idx) => {
            const patternColor = useDerivedValue(() => {
              if (selectedIndexes.value.findIndex(v => v === idx) < 0) {
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
                width: 2 * R.value,
                height: 2 * R.value,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: patternColor.value,
                // borderRadius: 2 * R.value,
                margin: patternMargin,
              };
            });
            const inner = useAnimatedStyle(() => {
              return {
                // width: R.value * 0.8,
                height: R.value * 0.8,
                // borderRadius: R.value * 0.8,
                // backgroundColor: patternColor.value,
              };
            });
            return (
              <Animated.View key={idx} style={outer}>
                <Animated.View style={inner}>
                  <Text style={styles.number}>1</Text>
                </Animated.View>
              </Animated.View>
            );
          })}
      </Animated.View>
    );
  }

  const cvc = useAnimatedStyle(() => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: `${
      Math.max(
        0,
        containerLayout.value.height / containerLayout.value.width - 1.25,
      ) * 50
    }%`,
    width: containerLayout.value.min,
    height: containerLayout.value.min,
  }));
  const R = useDerivedValue(
    () => (containerLayout.value.min / rowCount - patternMargin * 2) / 2,
  );

  //   const onPatternLayout = ({ nativeEvent: { layout } }) => {
  const onPatternLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    console.log('Pattern layout', layout);
    const points = [];
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        points.push({
          x: layout.x + (layout.width / columnCount) * (j + 0.5),
          y: layout.y + (layout.height / rowCount) * (i + 0.5),
        });
      }
    }
    patternPoints.value = points;
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    console.log('Container Layout', width, height);
    containerLayout.value = {
      width,
      height,
      min: Math.min(width, height),
    };
  };

  const panHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent | TapGestureHandlerGestureEvent
  >({
    onStart: evt => {
      if (
        canTouch.value &&
        patternPoints.value &&
        selectedIndexes.value.length === 0
      ) {
        const selected: number[] = [];
        patternPoints.value.every((p, idx) => {
          if (
            (p.x - evt.x) * (p.x - evt.x) + (p.y - evt.y) * (p.y - evt.y) <
            R.value * R.value
          ) {
            selected.push(idx);
            return false;
          }
          return true;
        });
        selectedIndexes.value = selected;
      }
    },
    onActive: evt => {
      if (
        canTouch.value &&
        patternPoints.value &&
        selectedIndexes.value.length > 0
      ) {
        patternPoints.value.every((p, idx) => {
          if (
            (p.x - evt.x) * (p.x - evt.x) + (p.y - evt.y) * (p.y - evt.y) <
            R.value * R.value
          ) {
            if (selectedIndexes.value.indexOf(idx) < 0) {
              selectedIndexes.value = [...selectedIndexes.value, idx];
            }
            return false;
          }
          return true;
        });
        endPoint.value = {x: evt.x, y: evt.y};
      }
    },
    onEnd: evt => {
      if (!canTouch.value) return;
      endPoint.value = null;
      if (selectedIndexes.value.length > 0)
        console.log('Selected Index greater that zero');
      // runOnJS(onEndJS)(selectedIndexes.value.join(""));
    },
  });

  return (
    // <View style={styles.container}>
    //   {console.log('logged')}
    <PanGestureHandler onGestureEvent={panHandler}>
      <Animated.View style={styles.container} onLayout={onContainerLayout}>
        <TapGestureHandler onGestureEvent={panHandler}>
          {renderCell()}
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    top: 280,
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
    fontSize: 40,
    alignItems: 'center',
  },
});
