import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import * as Progress from 'react-native-progress';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {GamePageActions} from '../../redux';
import useAnswerToBeFoundController from './controller';

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
type AnswerToBeFoundProps = {
  answerToBeFound: number;
  onTimeUp: () => void;
  keyId: number;
};

export default function AnswerToBeFound(props: AnswerToBeFoundProps) {
  const dispatch = useDispatch()
  const totalGameDuration = 10;
  const controller = useAnswerToBeFoundController();
  const [time, setTime] = React.useState(20);
  React.useEffect(() => {
    setInterval(() => {
      // count.value = count.value - 1;
      setTime((time) => time-1)
      console.log("Timer called")
      // dispatch(GamePageActions.updateTotalGameRemainingTime(totalGameRemainingTime-1))
      // console.log("totalGameRemainingTime", totalGameRemainingTime-1)
    }, 1000);
  }, [])
  // const totalGameDuration = useSelector((state:RootState) =>state.gamePage.totalGameRemainingTime);
  return (
    <View style={styles.answerCell}>
      <Text>{time}</Text>
      {/* <CountdownCircleTimer
        isPlaying
        duration={totalGameDuration}
        colors={[
          ['#004777', 0.4],
          ['#F7B801', 0.4],
          ['#A30000', 0.2],
        ]}
        onComplete={props.onTimeUp}
        key={totalGameDuration}>
        {({remainingTime}) => {
          // controller.updateRemainingTime(remainingTime)
          dispatch(GamePageActions.updateCurrentGameRemainigTime(remainingTime));
          return (
            <Animated.Text style={styles.number}>
              {props.answerToBeFound}
            </Animated.Text>
          );
        }}
      </CountdownCircleTimer> */}
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
