import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import useMainPlayAreaController, {MainPlayAreaProps} from './controller';
import Timer from './timer/timer';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome5';
import FoundationIcon from 'react-native-vector-icons/dist/Foundation';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import IconButton from '../../components/icon-button';
import {
  answerCellBGColour,
  answerColour,
  backGroundColour,
  inactiveColor,
  numberColour,
  scoreColor,
} from '../../components/color';
import {getFormattedSpeed, SPEED_UNIT} from '../../utils/formatter';
import BackButton from '../../components/back-button';
import {Operators} from '../problem-generator';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

export type CoOrdinates = {
  x: number;
  y: number;
};

export type Cell = {
  position: CoOrdinates;
};

// const backButtonIcon = (
//   <Icon name="arrow-back-circle-outline" size={38} color={numberColour} />
// );

const renderMultiplicationIcon = (idx: number) => (
  <EntypoIcon
    accessibilityLabel={`option-${idx}`}
    name="cross"
    size={28}
    color={numberColour}
  />
);

const renderSubtractionIcon = (idx: number) => (
  <FoundationIcon
    accessibilityLabel={`option-${idx}`}
    name="minus"
    size={20}
    color={numberColour}
  />
);

const renderAdditionIcon = (idx: number) => (
  <FontAwesomeIcon
    accessibilityLabel={`option-${idx}`}
    name="plus"
    size={20}
    color={numberColour}
  />
);

export default function MainPlayArea(props: MainPlayAreaProps) {
  const rowCount = 2;
  const columnCount = 2;
  const patternMargin = 2;
  const errorColor = '#D93609';
  // const activeColor = '#5FA8FC';
  const cellSelectedColor = '#212121';
  const cellSelectedBorderColor = '#fafafa';
  const cellBGColor = '#c2d047ff';
  const selectedCellBGColor = '#91d04b';
  const controller = useMainPlayAreaController(props);

  const renderOperatorCell = (idx: number) => {
    const operator = controller.getOperator(idx);
    if (operator === Operators.MULTIPLICATION) {
      return renderMultiplicationIcon(idx);
    } else if (operator === Operators.SUBTRACTION) {
      return renderSubtractionIcon(idx);
    } else {
      return renderAdditionIcon(idx);
    }
  };

  function renderCell(idx: number) {
    if (controller.isOperatorCell(idx)) {
      return renderOperatorCell(idx);
    } else {
      return (
        <Text style={styles.number} accessibilityLabel={`option-${idx}`}>
          {controller.getOperatorCellLabel(idx)}
        </Text>
      );
    }
  }
  function renderCells() {
    return (
      <Animated.View
        style={controller.cvc}
        onLayout={controller.onPatternLayout}>
        {Array(rowCount * columnCount)
          .fill(0)
          .map((_, idx) => {
            const patternColor = useDerivedValue(() => {
              if (
                controller.selectedIndexes.value.findIndex(v => v === idx) < 0
              ) {
                return {bgColor: cellBGColor, borderColor: cellBGColor};
              } else {
                return {
                  bgColor: selectedCellBGColor,
                  borderColor: selectedCellBGColor,
                };
              }
            });
            const outer = useAnimatedStyle(() => {
              return {
                width: 2 * controller.R.value,
                height: 2 * controller.R.value,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: patternColor.value.borderColor,
                backgroundColor: patternColor.value.bgColor,
                borderRadius: 10,
                borderWidth: 1,
                margin: patternMargin,
                color: '#2c3a1b',
                // textDecorationColor:"#fffff",
              };
            });
            return (
              <Animated.View key={idx} style={outer}>
                {renderCell(idx)}
              </Animated.View>
            );
          })}
      </Animated.View>
    );
  }

  useEffect(() => {
    console.log('Mounted MainPlayArea');
  }, []);

  const speed = getFormattedSpeed(controller.currentScore.speed);
  return (
    <View style={styles.mainContainer}>
      <Timer onTimeOut={controller.onTimeOver} key={controller.roundId} />
      <View style={styles.header}>
        {/* <IconButton
          onPress={controller.onTouchBackButton}
          icon={backButtonIcon}
          style={styles.backButton}
        /> */}
        <BackButton onTouchBackButton={controller.onTouchBackButton} />
        <View style={styles.highScoreContainer}>
          <View style={styles.highScore}>
            <Text style={styles.highScoreTitle}>Solved</Text>
            <Text style={styles.problemSolved}>
              {controller.currentScore.problemsSolved}
            </Text>
          </View>
          {/* <View style={styles.highScore}>
            <Text style={styles.problemSolved}>{speed.value}</Text>
            <Text style={styles.highScoreTitle}>{speed.unit}</Text>
          </View> */}
        </View>
      </View>
      <View style={styles.playContainer}>
        <Animated.View style={[styles.answerCell, controller.animatedStyles]}>
          <Text style={styles.answer} accessibilityLabel="answer-cell">
            {controller.answerToBeFound}
          </Text>
        </Animated.View>
        <PanGestureHandler onGestureEvent={controller.panHandler}>
          <Animated.View
            style={[styles.cellsContainer, controller.animatedStyles]}
            onLayout={controller.onContainerLayout}>
            <TapGestureHandler onGestureEvent={controller.panHandler}>
              {renderCells()}
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </View>
      <BannerAd
        unitId={'ca-app-pub-3940256099942544/6300978111'}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 48,
  },
  highScore: {
    // flex: 1,
    // alignItems: 'center',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  highScoreContainer: {
    // flex: 1,
    flexDirection: 'row',
  },
  highScoreTitle: {
    fontSize: 24,
    color: scoreColor,
    // textAlign: 'left',
  },
  problemSolved: {
    fontSize: 32,
    // textAlign: 'center',
    color: scoreColor,
  },
  backButton: {
    width: 50,
    left: 10,
    height: 50,
    top: 10,
    flex: 1,
  },
  playContainer: {
    flex: 3,
    elevate: 2,
  },
  mainContainer: {
    flex: 1,
    elevate: 2,
    backgroundColor: backGroundColour,
  },
  cellsContainer: {
    flex: 1,
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginTop: 40,
  },
  number: {
    fontSize: 32,
    alignItems: 'center',
    color: numberColour,
  },
  answer: {
    fontSize: 36,
    alignItems: 'center',
    color: answerColour,
  },

  timer: {
    borderWidth: 2,
    width: 80,
    height: 80,
    top: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: inactiveColor,
  },
  answerCell: {
    borderWidth: 2,
    width: 100,
    height: 100,
    //top: 150,
    borderRadius: 10,
    color: answerColour,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: answerCellBGColour,
    backgroundColor: answerCellBGColour,
  },
});
