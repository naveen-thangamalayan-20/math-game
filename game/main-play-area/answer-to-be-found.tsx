import * as React from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import * as Progress from 'react-native-progress';
import Animated from 'react-native-reanimated';

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
type Props = {
  answerToBeFound:number
};

export default function AnswerToBeFound(props: Props) {


  return (
    <CountdownCircleTimer
    isPlaying
    duration={10}
    colors={[
      ['#004777', 0.4],
      ['#F7B801', 0.4],
      ['#A30000', 0.2],
    ]}
  >
    {({ remainingTime }) => (
      <Animated.Text style={{ color: "#F98F40" }}>
        {props.answerToBeFound}
      </Animated.Text>
    )}
  </CountdownCircleTimer>
  );
}
