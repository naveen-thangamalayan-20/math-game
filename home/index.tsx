import { NavigationAction, NavigationProp } from "@react-navigation/native";
import React from "react";
import { Pressable, Text, View } from "react-native";

const Home = ({navigation} : {navigation: any}) => {
  return (
      <View>
           <Pressable
            //   style={[styles.button, styles.buttonClose]}
              onPress={() => navigation.navigate('Game')}
            >
              <Text >Start</Text>
            </Pressable>

            
      </View>
  )
}

export default Home;