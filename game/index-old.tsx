import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  SharedValue,
  AnimatedStyleProp,
} from 'react-native-reanimated';

function Ball() {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      isPressed.value = true;
    })
    .onUpdate((e) => {
      console.log(e);
      'worklet';
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      'worklet';
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      'worklet';
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.ball, animatedStyles]} >
        <Text>SomeText</Text>
        </Animated.View>
    </GestureDetector>
  );
}

// type Props =  {
//   animatedStyles: AnimatedStyleProp<unknown>;
// }
// const Tile = (props: Props) => {
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     ball: {
//       width: 100,
//       height: 100,
//       borderRadius: 100,
//       backgroundColor: 'blue',
//       alignSelf: 'center',
//     },
//   });
//   return <Animated.View style={[styles.ball, props.animatedStyles]} />
// }

export default function Game() {
  return (
    <View style={styles.container}>
      <Ball />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'green',
    alignSelf: 'center',
  },
});
