import axios from "axios";
import { StyleSheet, View } from "react-native";
import {
  PaperProvider,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import {
  COLORS,
  DIMENSIONS,
  FONTSIZES,
  VALIDEMAILS,
} from "../components/Constants";
import { useState } from "react";

const EmailChangeScreen = ({ navigation, route }) => {
  const { oldEmail } = route.params;
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");

  const handleEmailChange = async () => {
    let emailEnd = email2.split("@")[1];

    if (email !== email2) {
      alert("Emails do not match");
      return;
    }
    if (!VALIDEMAILS.includes(emailEnd)) {
      alert("Please use your school email");
      return;
    }
    try {
      await axios.patch("/auth/email-change", {
        email: oldEmail,
        newEmail: email,
      });
      navigation.navigate("Verification", { recipientEmail: email });
    } catch (error) {
      console.error(error);
      alert("Failed to change email");
    }
  };
  return (
    <PaperProvider>
      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Email"
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          mode="outlined"
          label="Confirm Email"
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={email2}
          onChangeText={setEmail2}
        />
        <TouchableRipple
          style={styles.emailChangeButton}
          onPress={handleEmailChange}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: FONTSIZES.large,
              color: COLORS.white,
            }}
          >
            Receive Email
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

export default EmailChangeScreen;
