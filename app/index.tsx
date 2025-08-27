import AddButton from "@/components/AddButton";
import DeleteButton from "@/components/DeleteButton";
import SaveButton from "@/components/SaveButton";
import { sendFileToSupabase } from "@/composeable/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const STORAGE_NAME = "galeria";

  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [fileSize, setFileSize] = useState<Number>(0);
  const [base64, setBase64] = useState<string>('');
  const [listaFotos, setListaFotos] = useState<Array<string>>([]);
  const [numColumns, setNumColumns] = useState<number>(2);

  const storeImage = async (path: string, name: string, contentType: string, base64: string, fileSize: Number) => {
    try {
      await sendFileToSupabase({
        file: base64,
        path: path,
        name: name,
        contentType: contentType,
        fileSize: fileSize
      })
    } catch (error) {
      console.error("❌ Erro ao salvar");
    }
  };

  const getImage = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_NAME);
      if (value !== null) {
        setListaFotos(JSON.parse(value));
      }
    } catch (error) {
      console.error("❌ Erro ao carregar");
    }
  };

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
      console.error("❌ Erro ao apagar");
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  const addFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFileSize(result.assets[0].fileSize);
      setBase64(result.assets[0]?.base64 ?? null)
    }
  };

  const convertBytesToHuman = (size: Number | undefined) => {
    if (size == undefined) {
      return "";
    }

    const kb = Number(size) / 1024;
    const mb = kb / 1024;

    if (mb > 1) {
      return `${mb.toFixed(2)} Mb`;
    }

    return `${kb.toFixed(2)} Kb`;
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.card}>
      <Image source={{ uri: item }} style={styles.image} />
      <DeleteButton onPress={() => removeImage(index)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galeria</Text>

      <AddButton onPress={addFoto} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      {image && <Text style={styles.fileSize}>{convertBytesToHuman(fileSize)}</Text>}
      {image && <SaveButton onPress={() => storeImage(image, base64)} />}

      {listaFotos.length > 0 && (
        <>
          <Text style={styles.subtitle}>🖼️ Fotos Salvas</Text>

          {/* Picker para mudar a quantidade de colunas */}
          <View style={styles.pickerBox}>
            <Text style={styles.pickerLabel}>Layout:</Text>
            <Picker
              selectedValue={numColumns}
              style={styles.picker}
              onValueChange={(val) => setNumColumns(val)}
            >
              <Picker.Item label="1 x 1" value={1} />
              <Picker.Item label="2 x 2" value={2} />
            </Picker>
          </View>

          <FlatList
            data={listaFotos}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            numColumns={numColumns}
            key={numColumns}
            contentContainerStyle={styles.grid}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563eb",
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 12,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "Poppins_600SemiBold",
  },
  pickerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pickerLabel: {
    color: "#374151",
    fontSize: 16,
    marginRight: 10,
    fontFamily: "Poppins_500Medium",
  },
  picker: {
    flex: 1,
    color: "#111827",
  },
  grid: {
    gap: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  preview: {
    width: 260,
    height: 260,
    borderRadius: 18,
    marginVertical: 20,
    alignSelf: "center",
    backgroundColor: "#f3f4f6",
  },
  fileSize: {
    color: "#6b7280",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
});