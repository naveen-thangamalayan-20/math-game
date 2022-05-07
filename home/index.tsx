import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Button from '../components/button';
import {backGroundColour, numberColour, titleColor} from '../components/color';
import IconButton from '../components/icon-button';
import Score from '../components/score';
import useHomeController, {HomeProps} from './controller';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome5';


const Home = (props: HomeProps) => {
  const controller = useHomeController(props);
  const renderSoundOnIcon = () => (
    <FontAwesomeIcon
      accessibilityLabel={'sound'}
      name="volume-up"
      size={20}
      color={numberColour}
    />
  );
  const renderSoundOffIcon = () => (
    <FontAwesomeIcon
      accessibilityLabel={'sound'}
      name="volume-off"
      size={20}
      color={numberColour}
    />
  );
  return (
    <View style={styles.mainContainer}>
     
      <Text style={styles.title}>Math Speed Run</Text>
      {/* <IconButton
          onPress={controller.onToundSoundButton}
          icon={
            controller.isSoundOn ? renderSoundOnIcon() : renderSoundOffIcon()
          }
          style={styles.soundButton}
        /> */}
      <View style={styles.buttonGroup}>
        <Button onPress={() => controller.onTouchGameButton()} label={'PLAY'} />
        <Button
          onPress={() => controller.onTouchHighScoreButton()}
          label={'HIGH SCORE'}
        />
        <Button
          onPress={() => controller.onToundSoundButton()}
          label={controller.getSoundButtonLabel()}
        />
         <Button
          onPress={() => controller.onTouchQuitButton()}
          label={'QUIT'}
        />
       
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: backGroundColour,
  },
  title: {
    fontSize: 48,
    color: titleColor,
    marginTop: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    justifyContent: 'center',
    // alignContent:"center",
    alignItems: 'center',
    // top: 100,
    flex: 1,
  },
  soundButton: {
    // color: numberColour,
    borderRadius: 2,
    borderColor: numberColour,
    borderWidth: 1,
    backgroundColor: backGroundColour,
    width:"14%",
    // width: "40%",
    padding:16,
    marginTop: 16
  },
});
