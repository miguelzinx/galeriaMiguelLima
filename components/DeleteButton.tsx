// DeleteButton.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface DeleteType{
  onPress: () => {}
}
const DeleteButton = ({onPress} : DeleteType) => {
  return (
      <TouchableOpacity style={style.button} onPress={onPress}>
            <Text style={style.text}>Remover</Text>
     </TouchableOpacity>
  );
}

const style = StyleSheet.create({
    button: {
        width: 100,
        height: 50,
        borderRadius:10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#e40fa4ff"
      },
    text:{
        color: "#ffffffff",
        fontSize:20,        
    }
});

export default DeleteButton;