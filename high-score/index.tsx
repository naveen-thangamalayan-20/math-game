import React from 'react';
import useHighScoreController, { HighScoreProps } from './controller';
import Score from '../components/score';
import { StyleSheet, View } from 'react-native';
import BackButton from '../components/back-button';
import { backGroundColour } from '../components/color';


const HighScore = (props : HighScoreProps) => {
  const controller = useHighScoreController(props);
  return (
    <View style={styles.mainContainer}>
      <BackButton onTouchBackButton={controller.onTouchBackButton}/>
      <View style={styles.highScore}>
      <Score title={'Best'} score={controller.highScore} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: backGroundColour,
    },
    highScore: {
      margin: 40,
    }
});

export default HighScore;
