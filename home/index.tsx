import {NavigationAction, NavigationProp} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Button from '../components/button';
import {backGroundColour, titleColor} from '../components/color';

const Home = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Math Speed Run</Text>
      <View style={styles.buttonGroup}>
        <Button onPress={() => navigation.navigate('Game')} label={'PLAY'} />
        <Button onPress={() => navigation.navigate('HighScore')} label={'HIGH SCORE'} />
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
