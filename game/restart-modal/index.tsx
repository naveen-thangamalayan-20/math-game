import {NavigationProp, NavigationState} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/button';
import {backGroundColour, numberColour, titleColor} from '../../components/color';
import {RootState} from '../../store';
import {GamePageActions, HighScore} from '../redux';
import {useRestartModalController} from './controller';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';
import Score from '../../components/score';

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

  // const renderScore = () => {
  //   if (controller.shouldRenderScores()) {
  //     const formattedCurrentScore = controller.getFormattedCurrentScore();
  //     const formattedHighScore = controller.getFormattedHighScore();
  //     return (
  //       <>
  //         <View style={styles.score}>
  //           <View style={styles.scoreHeader}>
  //             <WhiteText data=""/>
  //             <WhiteText data={"Solved"}/>
  //             <WhiteText data={"Time"}/>
  //             <WhiteText data={"Speed"} />
  //           </View>
  //           <View style={styles.scoreData}>
  //             <WhiteText data={"Current Score"}/>
  //             <WhiteText data={`${formattedCurrentScore.problemsSolved.toString()} problems`}/>
  //             <WhiteText data={formattedCurrentScore.totalTime}/>
  //             <WhiteText data={formattedCurrentScore.speed}/>
  //           </View>
  //           <View style={styles.scoreData}>
  //             <WhiteText data={"Best"}/>
  //             <WhiteText data={formattedHighScore.problemsSolved.toString()}/>
  //             <WhiteText data={formattedHighScore.totalTime}/>
  //             <WhiteText data={formattedHighScore.speed}/>
  //           </View>
  //         </View>
  //       </>
  //     );
  //   }
  // };
  // const renderCol = (label: string, value: string, unit: string) => {
  //   return (
  //     <View style={styles.scoreCol}>
  //       <Text style={styles.scoreLabel}>{label}</Text>
  //       <Text style={styles.scoreValue}>{value}</Text>
  //       <Text style={styles.scoreUnit}>{unit}</Text>
  //     </View>
  //   );
  // };

  const renderScore = () => {
    if (controller.shouldRenderScores()) {
      // const formattedCurrentScore = controller.getFormattedCurrentScore();
      // const formattedHighScore = controller.getFormattedHighScore();
      return (
        <View style={styles.currentScore}>
          {/* <View style={styles.currentScore}>
            <Text style={styles.scoreTitle}>Score</Text>
            <View style={styles.scoreRow}>
              {renderCol('Solved', formattedCurrentScore.problemsSolved.value, formattedCurrentScore.problemsSolved.unit)}
              {renderCol('Time', formattedCurrentScore.totalTime.value, formattedCurrentScore.totalTime.unit)}
              {renderCol('Speed', formattedCurrentScore.speed.value,  formattedCurrentScore.speed.unit)}
            </View>
          </View> */}
          {/* <View style={styles.currentScore}>
            <Text style={styles.scoreTitle}>Best</Text>
            <View style={styles.scoreRow}>
              {renderCol('Solved', formattedHighScore.problemsSolved.value, formattedHighScore.problemsSolved.unit)}
              {renderCol('Time', formattedHighScore.totalTime.value, formattedHighScore.totalTime.unit)}
              {renderCol('Speed', formattedHighScore.speed.value,  formattedHighScore.speed.unit)}
            </View>
          </View> */}
          <Score title={"Score"} score={controller.currentScore}/>
          <Score title={"Best"} score={controller.highScore}/>
        </View>
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
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  // buttonClose: {
  //   backgroundColor: '#2196F3',
  // },
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

export default RestartModal;
