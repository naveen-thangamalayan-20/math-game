import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import * as Progress from 'react-native-progress';
import Animated from 'react-native-reanimated';

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
type Props = {
  answerToBeFound:number
  onTimeUp: () => void;
};

export default function AnswerToBeFound(props: Props) {
  return (
    <View style={styles.answerCell}>
    <CountdownCircleTimer
    isPlaying
    duration={10}
    colors={[
      ['#004777', 0.4],
      ['#F7B801', 0.4],
      ['#A30000', 0.2],
    ]}
    onComplete={props.onTimeUp}
  >
    {() => (
      <Animated.Text style={{ color: "#F98F40" }}>
        {props.answerToBeFound}
      </Animated.Text>
    )}
  </CountdownCircleTimer>
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
  number: {
    fontSize: 28,
    alignItems: 'center',
  },
  answerCell: {
    // borderWidth: 2,
    width: 100,
    height: 100,
    top: 150,
    fontSize: 28,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
