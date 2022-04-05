import React from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { numberColour, titleColor } from './color';
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

  const renderCol = (
    label: string, 
    value: string, 
    unit: string, 
    customColStyle:Array<Object>=[], 
    customScoreValueStyle: Array<Object>=[],
    customScoreUnitStyle: Array<Object>=[]
    ) => {
    return (
      <View style={[styles.scoreCol, ...customColStyle]}>
        <Text style={styles.scoreLabel}>{label}</Text>
        <Text style={[styles.scoreValue, ...customScoreValueStyle]}>{value}</Text>
        <Text style={[styles.scoreUnit, ...customScoreUnitStyle]}>{unit}</Text>
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
          [styles.scoreProblemsCol]
        )}
        {renderCol(
          'Time',
          formattedHighScore.totalTime.value,
          formattedHighScore.totalTime.unit,
          [styles.scoreTimeCol]
        )}
        {renderCol(
          'Speed',
          formattedHighScore.speed.value,
          formattedHighScore.speed.unit,
          [styles.scoreSpeedCol],
          [styles.scoreSpeedValue],
          [styles.scoreSpeedValue]
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
    margin:5,
    // flexGrow:1,
    // width: 105,

  },
  currentScore: {
    flexDirection: 'column',
    // alignItems:'center',
    // borderWidth: 1.5,
    borderColor: numberColour,
    width: "100%",
    // margin: 5,
  },
  scoreTitle: {
    color: numberColour,
    fontSize: 20,
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    // borderStyle:'dashed',
    // borderBottomWidth: 1.5,
    borderColor: numberColour,
    padding: 5
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
  scoreSpeedCol: {
    width: 120
  },
  scoreTimeCol: {
    width: 80
  },
  scoreProblemsCol: {
    width: 80
  },
  scoreSpeedValue: {
    color: "#BB86FC",
    fontWeight:'500'
  },
});
export default Score;
