import axios from "axios";
import { StyleSheet, View } from "react-native";
import {
  PaperProvider,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import { useState } from "react";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      await axios.post("/auth/forgot-password", {
        email,
      });
      navigation.navigate("Reset Password", { recipientEmail: email });
    } catch (error) {
      console.error(error);
      alert("Failed to send reset email");
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: FONTSIZES.small,
            marginVertical: 10,
            textAlign: "center",
          }}
        >
          Enter your email below to reset your password
        </Text>
        <TextInput
          mode="outlined"
          label="Email"
          textColor="white"
          autoCapitalize="none"
          outlineColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TouchableRipple onPress={handleForgotPassword} style={styles.emailChangeButton}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: FONTSIZES.large,
              color: COLORS.white,
            }}
          >
            Begin Reset
          </Text>
        </TouchableRipple>
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
  input: {
    marginBottom: 5,
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    height: 55,
  },
  emailChangeButton: {
    width: "80%",
    backgroundColor: COLORS.maroon,
    padding: 10,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: DIMENSIONS.cornerCurve,
  },
});

export default ForgotPasswordScreen;
