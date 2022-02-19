import { NavigationProp, NavigationState } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { GamePageActions } from "../redux";

type RestartModelProps = {
  navigation: any;
  onRestartGame: () => void;
}
const RestartModal = (props : RestartModelProps) => {
  const {navigation, onRestartGame } = props;
  // const showRestartModal =  false; //useSelector((state:RootState) =>state.gamePage.showRestartModal);
  const showRestartModal =  useSelector((state:RootState) =>state.gamePage.showRestartModal);
  const dispatch = useDispatch();
  return (
    // <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRestartModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          // setModalVisible(!modalVisible);
          dispatch(GamePageActions.setShowRestartModal(false));
        }}
      >
        <View style={styles.centeredView } accessibilityLabel="restart-modal">
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Game Over</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => dispatch(GamePageActions.setShowRestartModal(false))}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              // onPress={() => dispatch(GamePageActions.setShowRestartModal(false))}
              // onPress={() => navigation.navigate('Game')}
              onPress={() => onRestartGame()}
            >
              <Text style={styles.textStyle}>Restart</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      /* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => dispatch(GamePageActions.setShowRestartModal(true))}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      // </Pressable> */
    // </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default RestartModal;