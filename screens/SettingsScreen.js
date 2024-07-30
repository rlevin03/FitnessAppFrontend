import { PaperProvider } from "react-native-paper";
import { Linking, StyleSheet, View } from "react-native";
import { Header } from "../components/Header";
import { COLORS } from "../components/Constants";
import SettingsOption from "../components/SettingsOption";

const SettingsScreen = ({ navigation }) => {
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
});

export default SettingsScreen;
