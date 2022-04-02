import React from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { numberColour } from './color';
import {HighScore} from '../game/redux';
import {getFormattedSpeed, getFormattedTime} from '../utils/formatter';
import {iif} from '../utils/iif';

type ScoreProps = {
  score: HighScore;
  title: string;
};

const Score = ({score, title}: ScoreProps) => {
  const formattedHighScore = iif(function getFormattedScore() {
    return {
      speed: getFormattedSpeed(score.speed),
      problemsSolved: {
        value: score.problemsSolved.toString(),
        unit: 'problems',
      },
      totalTime: getFormattedTime(score.totalTime),
    };
  });

  const renderCol = (label: string, value: string, unit: string) => {
    return (
      <View style={styles.scoreCol}>
        <Text style={styles.scoreLabel}>{label}</Text>
        <Text style={styles.scoreValue}>{value}</Text>
        <Text style={styles.scoreUnit}>{unit}</Text>
      </View>
    );
  };

  return (
    <View style={styles.currentScore}>
      <Text style={styles.scoreTitle}>{title}</Text>
      <View style={styles.scoreRow}>
        {renderCol(
          'Solved',
          formattedHighScore.problemsSolved.value,
          formattedHighScore.problemsSolved.unit,
        )}
        {renderCol(
          'Time',
          formattedHighScore.totalTime.value,
          formattedHighScore.totalTime.unit,
        )}
        {renderCol(
          'Speed',
          formattedHighScore.speed.value,
          formattedHighScore.speed.unit,
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  score: {
    fontSize: '15',
    // flex: 1,
    flexDirection: 'row',
    // flexDirection:'column',
  },
  scoreCol: {
    flexDirection: 'column',
    padding: 10,
    alignItems:'center',
    margin:10,
  },
  currentScore: {
    flexDirection: 'column',
    alignItems:'center'
  },
  scoreTitle: {
    color: numberColour,
    fontSize: 20
  },
  scoreRow: {
    flexDirection: 'row',
  },
  scoreLabel: {
    fontWeight: 'bold',
    marginBottom:8,
    color: "#bdbdbd",
  },
  scoreUnit: {
    color:numberColour,
    marginBottom:8,
  },
  scoreValue: {
    color:numberColour,
    fontSize: 18,
  },
});
export default Score;
