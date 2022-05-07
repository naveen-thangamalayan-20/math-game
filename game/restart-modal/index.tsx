import {NavigationProp, NavigationState} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/button';
import {
  backGroundColour,
  numberColour,
  purpleColor,
  titleColor,
} from '../../components/color';
import {RootState} from '../../store';
import {GameOverReason, GamePageActions, HighScore} from '../redux';
import {useRestartModalController} from './controller';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';
import Score from '../../components/score';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome5';

export type RestartModelProps = {
  onRestartGame: () => void;
  onResumeGame: () => void;
  onQuitGame: () => void;
};

const RestartModal = (props: RestartModelProps) => {
  const controller = useRestartModalController(props);
  const dispatch = useDispatch();

  const renderResumeButton = () => {
    return (
      controller.shouldRenderResumeButton() && (
        <Button
          onPress={controller.onResumeGame}
          label={'Resume'}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      )
    );
  };

  const renderButtons = () => {
    return (
      <View style={styles.buttonGroup}>
        {renderResumeButton()}
        <Button
          onPress={controller.onRestartGame}
          label={'Restart'}
          style={styles.button}
          textStyle={styles.buttonText}
        />
        <Button
          onPress={controller.onQuitGame}
          label={'Quit'}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    );
  };

  const WhiteText = ({data}: {data: string}) => (
    <View style={styles.cell}>
      <Text style={styles.textStyle}>{data}</Text>
    </View>
  );


  const renderCurrentScore = () => (
    <View style={styles.currentScore}>
      <Text style={styles.scoreTitle}>{'Score'}</Text>
      <Score score={controller.currentScore} />
    </View>
  );

  const renderHighScore = () => (
    <View style={styles.currentScore}>
      {console.log(controller.isNewHighScore())}
      {!controller.isNewHighScore() ? (
        <Text style={[styles.highScoreTitle, styles.scoreTitle]}>{'Best'}</Text>
      ) : (
        <Text style={[styles.scoreTitle, styles.newHighScore]}>
          {'New Best'}
        </Text>
      )}
      <Score score={controller.highScore} />
    </View>
  );

  const renderScore = () => {
    if (controller.shouldRenderScores()) {
      return (
        <View style={styles.scoreContainer}>
          {renderCurrentScore()}
          {renderHighScore()}
        </View>
      );
    }
  };

  const renderCurrentAnsweredProblem = () => {
    if (controller.gameOverReason === GameOverReason.WRONG_ANSWER) {
      return (
        <View style={styles.answeredProblemContainer}>
          <Text style={styles.answeredProblem}>{controller.answeredProblem.problem} </Text>
          <FontAwesomeIcon name="not-equal"  style={styles.answeredProblemOperator} />
          <Text  style={styles.answeredProblem}>{controller.answeredProblem.answer}</Text>
        </View>
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={controller.showRestartModal}
      style={styles.modal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        // setModalVisible(!modalVisible);
        dispatch(GamePageActions.setShowRestartModal(false));
      }}>
      <View style={styles.centeredView} accessibilityLabel="restart-modal">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{controller.gameOverReason}</Text>
          {renderCurrentAnsweredProblem()}
          {renderScore()}
          {renderButtons()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#212121',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#616161',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 15,
  },
  buttonGroup: {
    // flex:1,
    flexDirection: 'row',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: numberColour,
    marginBottom: 15,
  },
  button: {
    width: 86,
    height: 50,
    fontSize: 14,
    margin: 3,
  },
  buttonText: {
    fontSize: 14,
  },
  wrapper: {flexDirection: 'row'},
  answeredProblemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  answeredProblem: {
    fontSize: 20,
    color:purpleColor,
  },
  answeredProblemOperator: {
    fontSize: 14,
    color:purpleColor,
    paddingTop: 6,
    paddingLeft:6,
    paddingRight: 6,
  },
  textStyle: {
    color: numberColour,
    // height:40,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: numberColour,
  },
  score: {
    fontSize: '15',
    // flex: 1,
    flexDirection: 'row',
    // flexDirection:'column',
  },
  scoreHeader: {
    fontSize: '16',
    flex: 1,
  },
  scoreData: {
    fontSize: '16',
    flex: 1,
    flexDirection: 'column',
    // flexDirection:'row',
  },
  cell: {
    // width:a30,
    height: 32,
    // padding: 5,
  },
  scoreCol: {
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center',
    margin: 10,
  },
  scoreContainer: {
    flexDirection: 'column',
    // width:320
    // alignItems:'center'
  },
  currentScore: {
    flexDirection: 'column',
    // alignItems:'center',
    // borderWidth: 1.5,
    borderColor: numberColour,
    width: '100%',
    // margin: 5,
  },
  highScoreTitleContainer: {
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: numberColour,
    padding: 5,
    flexDirection: 'row',
  },
  newHighScore: {
    fontSize: 20,
    color: titleColor,
    marginLeft: 5,
  },
  highScoreTitle: {
    color: numberColour,
    fontSize: 20,
  },
  scoreTitle: {
    color: numberColour,
    fontSize: 20,
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: numberColour,
    padding: 5,
  },
  scoreRow: {
    flexDirection: 'row',
  },
  scoreLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#bdbdbd',
  },
  scoreUnit: {
    color: numberColour,
    marginBottom: 8,
  },
  scoreValue: {
    color: numberColour,
    fontSize: 18,
  },
});

export default RestartModal;
