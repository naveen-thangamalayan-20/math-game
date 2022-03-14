import {NavigationProp, NavigationState} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {GamePageActions} from '../redux';
import {useRestartModalController} from './controller';

export type RestartModelProps = {
  navigation: any;
  onRestartGame: () => void;
  onResumeGame: () => void;
};
const RestartModal = (props: RestartModelProps) => {
  const controller = useRestartModalController(props);
  const dispatch = useDispatch();

  const renderResumeButton = () => {
    return (
      controller.shouldRenderResumeButton() && (
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={controller.onResumeGame}>
          <Text style={styles.textStyle}>Resume</Text>
        </Pressable>
      )
    );
  };

  const renderButtons = () => {
    return (
      <>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={controller.onQuitGame}>
          <Text style={styles.textStyle}>Quit</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={controller.onRestartGame}>
          <Text style={styles.textStyle}>Restart</Text>
        </Pressable>
        {renderResumeButton()}
      </>
    );
  };

  const renderScore = () => {
    if (controller.shouldRenderScores()) {
      return (
        <>
          <View style={styles.score}>
            <View style={styles.scoreHeader}>
              <Text></Text>
              <Text>Problems solved</Text>
              <Text>Time</Text>
              <Text>Speed</Text>
            </View>
            <View style={styles.scoreData}>
              <Text>Current Score</Text>
              <Text>{controller.problemSolved}</Text>
              <Text>{controller.getFormattedTime()}</Text>
              <Text>{controller.getSpeed()}</Text>
            </View>
            <View style={styles.scoreData}>
              <Text>High Score</Text>
              <Text>123</Text>
              <Text>1.25mins</Text>
              <Text>1.6 answers/sec</Text>
            </View>
          </View>
        </>
      );
    }
  };

  return (
    // <View style={styles.centeredView}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={controller.showRestartModal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        // setModalVisible(!modalVisible);
        dispatch(GamePageActions.setShowRestartModal(false));
      }}>
      <View style={styles.centeredView} accessibilityLabel="restart-modal">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{controller.gameOverReason}</Text>
          {renderScore()}
          {renderButtons()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  score: {
    fontSize: '15',
    flex: 1,
    flexDirection: 'row',
  },
  scoreHeader: {
    fontSize: '16',
    flex: 1,
  },
  scoreData: {
    fontSize: '16',
    flex: 1,
    flexDirection: 'column',
  },
});

export default RestartModal;
