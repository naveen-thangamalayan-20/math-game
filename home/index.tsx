import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Button from '../components/button';
import {backGroundColour, titleColor} from '../components/color';
import Score from '../components/score';
import useHomeController, { HomeProps } from './controller';

const Home = (props: HomeProps) => {
  const controller = useHomeController(props)
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Math Speed Run</Text>
      <View style={styles.buttonGroup}>
        <Button onPress={() => controller.onTouchGameButton()} label={'PLAY'} />
        <Button onPress={() => controller.onTouchHighScoreButton()} label={'HIGH SCORE'} />
        <Button onPress={() => console.log("d")} label={'QUIT'} />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: backGroundColour,
  },
  title: {
    fontSize:48,
    color:titleColor,
    marginTop: 20,
    textAlign: "center"
  },
  buttonGroup: {
    justifyContent:"center",
    // alignContent:"center",
    alignItems:"center",
    // top: 100,
    flex: 1,
  },
});
