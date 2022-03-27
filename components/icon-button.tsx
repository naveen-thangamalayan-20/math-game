import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

const IconButton = ({ onPress, icon, style }:{ onPress:()=> void, icon: JSX.Element, style: StyleProp<ViewStyle>}) => (
    <TouchableOpacity style={style} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );

  export default IconButton