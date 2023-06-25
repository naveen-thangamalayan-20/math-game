import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {numberColour, scoreColor} from './color';
import IconButton from './icon-button';

type BackButtonProps = {
  onTouchBackButton: () => void;
};

const BackButton = (props: BackButtonProps) => {
  return (
    <IconButton
      onPress={props.onTouchBackButton}
      icon={
        <Icon name="arrow-back-circle-outline" size={38} color={scoreColor} />
      }
      style={styles.backButton}
    />
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 50,
    left: 10,
    height: 50,
    top: 10,
    // flex: 1,
  },
});

export default BackButton;
