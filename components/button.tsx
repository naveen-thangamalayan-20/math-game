import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {backGroundColour, numberColour} from './color';

const Button = ({
  onPress,
  label,
  style,
  textStyle,
}: {
  onPress: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <Text style={[styles.label, textStyle]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    // borderColor: numberColour,
    borderWidth: 1,
    // backgroundColor: backGroundColour,
    width: "40%",
    padding:16,
    marginTop: 16,
    borderColor: '#483A58',
    backgroundColor: '#483A58',
    color: '#322F20'
  },
  label: {
    fontSize: 22,
    // color: numberColour,
    textAlign:"center",
    color: '#EDFFEC',
  }
});
export default Button;
