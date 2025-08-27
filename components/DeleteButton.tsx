// DeleteButton.tsx
import { Fontisto } from "@react-native-vector-icons/fontisto";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface DeleteType {
  onPress: () => {}
}
const DeleteButton = ({ onPress }: DeleteType) => {
  return (
    <TouchableOpacity style={style.button} onPress={onPress}>
      <Fontisto style={style.text} name="trash" />
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e40fa4ff"
  },
  text: {
    color: "#ffffffff",
    fontSize: 20,
  }
});

export default DeleteButton;