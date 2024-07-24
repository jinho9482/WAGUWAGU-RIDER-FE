import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default SpeechBubble = (props) => {
  return (
    <View
      style={[
        styles.container,
        // { width: props.width },
        { width: props.width },
        { height: props.height },
        { backgroundColor: props.backgroundColor },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: props.textColor },
          //   { backgroundColor: props.backgroundColor },
        ]}
      >
        {props.content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1, 
    borderColor: '#dcdcdc', 
    // padding: 25,
    // height: 80,
    // width: 30,
    color: "#94D35C",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 17,
  },
});
