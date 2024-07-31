import { Image, StyleSheet, View } from "react-native";
import { PaperProvider, Text } from "react-native-paper";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";

const VerificationScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Image
            style={styles.logo}
            source={require("../assets/latin_logo.png")}
          />
          <Text
            style={[
              styles.text,
              { fontSize: FONTSIZES.medium, fontWeight: "bold" },
            ]}
          >
            Verify your school email
          </Text>
          <Text
            style={[
              styles.text,
              { fontSize: FONTSIZES.small, marginVertical: 20 },
            ]}
          >
            A verification email has been sent to your school email address.
            Please enter the given code below.
          </Text>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: "center",
  },
  wrapper: {
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    borderRadius: DIMENSIONS.cornerCurve,
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 150,
  },
  text: {
    textAlign: "center",
    color: COLORS.black,
  },
});

export default VerificationScreen;
