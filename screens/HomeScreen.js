import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Appbar, Button, PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const HomeScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Action
            icon={() => (
              <Image
                style={styles.logo}
                source={require("../assets/Northeastern_Universitylogo_square.webp")}
              />
            )}
            onPress={() => {}}
          />
          <Appbar.Content title="" />
          <Appbar.Action
            icon="account-circle-outline"
            onPress={() => navigation.navigate("Profile")}
            color="black"
            size={45}
          />
        </Appbar.Header>
        <Text style={styles.textWhiteBig}>Northeastern Recreation</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate("Reservations")}
            contentStyle={styles.buttonContent}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>View My Reservations</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color="black"
              />
            </View>
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  textWhiteBig: {
    fontSize: 24,
    textAlign: "center",
    color: "#fff",
    padding: 10,
  },
  button: {
    backgroundColor: "#B80D0D",
    borderRadius: 5,
    width: "95%",
    marginVertical: 10,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
  },
  logo: {
    width: 45,
    height: 45,
    marginLeft: -10,
    marginTop: -10,
  },
  header: {
    backgroundColor: "#B80D0D",
  },
});

export default HomeScreen;
