import React from 'react';
import useHighScoreController, { HighScoreProps } from './controller';
import Score from '../components/score';
import { StyleSheet, Text, View } from 'react-native';
import BackButton from '../components/back-button';
import { backGroundColour, numberColour } from '../components/color';


const HighScore = (props : HighScoreProps) => {
  const controller = useHighScoreController(props);
  return (
    <View style={styles.mainContainer}>
      <BackButton onTouchBackButton={controller.onTouchBackButton} />
      <View style={styles.highScore}>
        <Text style={styles.highScoreTitle}>Best</Text>
        <Score score={controller.highScore} />
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
      flexDirection:"column",
      margin: 40,
      alignItems:"center"
    },
    highScoreTitle: {
      color: numberColour,
      fontSize: 20,
      borderBottomWidth: 1.5,
      borderTopWidth: 1.5,
      borderColor: numberColour,
      padding: 5,
      marginBottom: 24,
    }
});

export default HighScore;
