import { Button, PaperProvider, Text } from "react-native-paper";
import { Linking, StyleSheet, View } from "react-native";
import Header from "../components/Header";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import SettingsOption from "../components/SettingsOption";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const SettingsScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const handleLogout = async () => {
    try {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
      await axios.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Settings" />
        <View style={styles.optionsContainer}>
          <SettingsOption
            title="Privacy Policy"
            roundedTop
            onPress={() =>
              Linking.openURL(
                "https://www.northeastern.edu/privacy-information/"
              ).catch((err) => console.error("Couldn't load page", err))
            }
          />
          <SettingsOption
            title="Emergency Information"
            onPress={() =>
              Linking.openURL(
                "https://www.northeastern.edu/emergency-information/"
              ).catch((err) => console.error("Couldn't load page", err))
            }
          />
          <SettingsOption
            title="Accessibility Policy"
            roundedBottom
            onPress={() =>
              Linking.openURL(
                "https://digital-accessibility.northeastern.edu/"
              ).catch((err) => console.error("Couldn't load page", err))
            }
          />
        </View>
        <View style={styles.spacer} />
        <Button
          mode="contained"
          style={[styles.settingsButton, { marginBottom: 30 }]}
          onPress={handleLogout}
        >
          <Text style={[styles.textLargeBold, { color: COLORS.black }]}>
            Log Out
          </Text>
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  optionsContainer: {
    marginTop: 20,
  },
  textLargeBold: {
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
    color: COLORS.white,
    padding: 15,
    marginBottom: 5,
  },
  settingsButton: {
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: DIMENSIONS.cornerCurve,
    marginTop: 20,
  },
  spacer: {
    flex: 1,
  },
});

export default SettingsScreen;
