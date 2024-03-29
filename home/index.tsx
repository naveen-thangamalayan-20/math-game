import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Button from '../components/button';
import {backGroundColour, numberColour, titleColor} from '../components/color';
import IconButton from '../components/icon-button';
import Score from '../components/score';
import useHomeController, {HomeProps} from './controller';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome5';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

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
      <Text style={styles.title}>Math Dash</Text>
      {/* <IconButton
          onPress={controller.onToundSoundButton}
          icon={
            controller.isSoundOn ? renderSoundOnIcon() : renderSoundOffIcon()
          }
          style={styles.soundButton}
        /> */}
      <View style={styles.buttonGroup}>
        <Button style={styles.button} onPress={() => controller.onTouchGameButton()} label={'PLAY'} />
        <Button
          onPress={() => controller.onTouchHighScoreButton()}
          style={styles.button}
          label={'HIGH SCORE'}
        />
        <Button
          onPress={() => controller.onToundSoundButton()}
          style={styles.button}
          label={controller.getSoundButtonLabel()}
        />
        <Button style={styles.button} onPress={() => controller.onTouchQuitButton()} label={'QUIT'} />
      </View>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
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
  button: {
    // borderRadius: 8,
    // backgroundColor: '#6A5837',
    // color: '#322F20'
  },
  soundButton: {
    // color: numberColour,
    borderRadius: 2,
    borderColor: numberColour,
    borderWidth: 1,
    backgroundColor: backGroundColour,
    width: '14%',
    // width: "40%",
    padding: 16,
    marginTop: 16,
  },
});
