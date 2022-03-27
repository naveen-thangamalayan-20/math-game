import {NavigationProp, NavigationState} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/button';
import { backGroundColour, numberColour } from '../../components/color';
import {RootState} from '../../store';
import {GamePageActions, HighScore} from '../redux';
import {useRestartModalController} from './controller';

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
        <Button onPress={controller.onResumeGame} label={"Resume"} style={styles.button} textStyle={styles.buttonText}/>
        // <Pressable
        //   style={[styles.button, styles.buttonClose]}
        //   onPress={controller.onResumeGame}>
        //   <Text style={styles.textStyle}>Resume</Text>
        // </Pressable>
      )
    );
  };

  const renderButtons = () => {
    return (
      <View style={styles.buttonGroup}>
        {/* <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={controller.onQuitGame}>
          <Text style={styles.textStyle}>Quit</Text>
        </Pressable> */}
        {renderResumeButton()}
        <Button onPress={controller.onRestartGame} label={"Restart"} style={styles.button} textStyle={styles.buttonText}/>
        <Button onPress={controller.onQuitGame} label={"Quit"} style={styles.button} textStyle={styles.buttonText}/>
        {/* <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={controller.onRestartGame}>
          <Text style={styles.textStyle}>Restart</Text>
        </Pressable> */}
      </View>
    );
  };

  const WhiteText = ({data}:{data: string}) => <Text style={styles.textStyle}>{data}</Text>
  const renderScore = () => {
    if (controller.shouldRenderScores()) {
      const formattedCurrentScore = controller.getFormattedCurrentScore();
      const formattedHighScore = controller.getFormattedHighScore();
      return (
        <>
          <View style={styles.score}>
            <View style={styles.scoreHeader}>
              <Text />
              <WhiteText data={"Problems solved"}/>
              <WhiteText data={"Time"}/>
              <WhiteText data={"Speed"} />
            </View>
            <View style={styles.scoreData}>
              <WhiteText data={"Current Score"}/>
              <WhiteText data={formattedCurrentScore.problemsSolved.toString()}/>
              <WhiteText data={formattedCurrentScore.totalTime}/>
              <WhiteText data={formattedCurrentScore.speed}/>
            </View>
            <View style={styles.scoreData}>
              <WhiteText data={"High Score"}/>
              <WhiteText data={formattedHighScore.problemsSolved.toString()}/>
              <WhiteText data={formattedHighScore.totalTime}/>
              <WhiteText data={formattedHighScore.speed}/>
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
      style={styles.modal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        // setModalVisible(!modalVisible);
        dispatch(GamePageActions.setShowRestartModal(false));
      }}>
      <View style={styles.centeredView} accessibilityLabel="restart-modal">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{controller.gameOverReason}</Text>
          {renderScore()}
          {renderButtons()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal:{
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "#212121",
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
  buttonGroup:{
    // flex:1,
    flexDirection:"row"
  },
  modalTitle:{
    fontWeight:"bold",
    fontSize: 20,
    color: numberColour,
    marginBottom:15,
  },
  button: {
    width:86,
    height: 50,
    fontSize:14,
    margin:3,
  },
  buttonText: {
    fontSize:14,
  },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  // buttonClose: {
  //   backgroundColor: '#2196F3',
  // },
  textStyle: {
    color: numberColour,
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
