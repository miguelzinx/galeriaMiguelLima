import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const STORAGE_NAME = 'galeria';
  const STORAGE_AVATAR = 'avatar';
  const [image, setImage] = useState<string | null>(null);
  const [listaFotos, setListaFotos] = useState<Array<string>>([]);
  const [avatar, setAvatar] = useState<string | null>(null);

  // salvar imagem
  const storeImage = async (value: string) => {
    try {
      const fotos = [...listaFotos, value];
      setListaFotos(fotos);
      await AsyncStorage.setItem(STORAGE_NAME, JSON.stringify(fotos));
      setImage(null);
      Alert.alert("Imagem salva!");
    } catch (error) {
      console.error("Erro ao salvar");
    }
  };

  // buscar imagens
  const getImage = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_NAME);
      if (value !== null) {
        setListaFotos(JSON.parse(value));
      }

      const avatarValue = await AsyncStorage.getItem(STORAGE_AVATAR);
      if (avatarValue !== null) {
        setAvatar(avatarValue);
      }
    } catch (error) {
      console.error("Erro ao buscar");
    }
  };

  // remover imagem
  const removeImage = async (indice: number) => {
    try {
      const lista = [...listaFotos];
      lista.splice(indice, 1);
      if (lista.length > 0) {
        await AsyncStorage.setItem(STORAGE_NAME, JSON.stringify(lista));
        setListaFotos(lista);
      } else {
        await AsyncStorage.removeItem(STORAGE_NAME);
        setListaFotos([]);
      }
    } catch (error) {
      console.error("Erro ao apagar");
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  // adicionar foto da galeria
  const addFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // escolher foto de perfil
  const escolherAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      await AsyncStorage.setItem(STORAGE_AVATAR, uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- Cabeçalho com avatar --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={escolherAvatar}>
          <Image
            source={{ uri: avatar || "https://i.pravatar.cc/150?img=12" }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <Text style={styles.username}>Miguel Lima</Text>
      </View>

      {/* --- Botões de ação --- */}
      <View style={styles.buttonsRow}>
        {/* Botão de adicionar */}
        <TouchableOpacity style={styles.addBtn} onPress={addFoto}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>

        {/* Botão de salvar */}
        {image && (
          <TouchableOpacity style={styles.saveBtn} onPress={() => storeImage(image)}>
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* --- Galeria estilo grid --- */}
      <FlatList
        data={listaFotos}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({ item, index }) => (
          <View style={styles.gridItem}>
            <Image source={{ uri: item }} style={styles.imageGrid} />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeImage(index)}
            >
              <Text style={{ color: "white", fontSize: 12 }}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // estilo dark do Instagram
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#1E90FF",
    marginBottom: 8,
  },
  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    gap: 10,
  },
  addBtn: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#1E90FF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    color: "#1E90FF",
    fontSize: 28,
    fontWeight: "bold",
  },
  saveBtn: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  gridItem: {
    flex: 1,
    margin: 1,
    position: "relative",
  },
  imageGrid: {
    width: "100%",
    aspectRatio: 1,
  },
  deleteBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 4,
    borderRadius: 12,
  },
});