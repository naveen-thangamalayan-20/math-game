import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import useTimerController, {TimerProps} from './controller';
import * as Progress from 'react-native-progress';

const Timer = (props: TimerProps) => {
  const controller = useTimerController(props);
  return (
    <Progress.Bar
      progress={controller.getElapsedTimeInPercentage()}
      width={null}
    />
    // <View style={styles.timer}>
    //   {/* <Text style={styles.number}>{controller.time} sec</Text> */}
    // </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  number: {
    fontSize: 28,
    alignItems: 'center',
    color: '#f9f9f9',
  },
  timer: {
    height: 80,
    // top: 50,
    width: 400,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
