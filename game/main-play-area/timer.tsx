import React from "react"
import { StyleSheet, Text, View } from "react-native"

type TimerProps = {
    currentTime: number;
}
const Timer = ({currentTime}: TimerProps) => {
    return (
      <View style={styles.timer}>
        <Text style={styles.number}>{currentTime}</Text>
      </View>
    )
}

export default Timer;

const styles = StyleSheet.create({
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
      borderColor: "#8E91A8",
    },
 
  });