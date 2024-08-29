import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import {
  Menu,
  PaperProvider,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import {
  COLORS,
  DIMENSIONS,
  FONTSIZES,
  VALIDEMAILS,
} from "../components/Constants";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleRegister = async () => {
    let emailEnd = email.split("@")[1];
    if (!email || !password || !password2 || !name || !location) {
      setError("Please fill out all fields");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    if (!VALIDEMAILS.includes(emailEnd)) {
      setError("Please use your school email");
      return;
    }
    try {
      await axios.post("/auth/register", {
        name,
        email,
        password,
        location,
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Verification", params: { recipientEmail: email } }],
        })
      );
    } catch (error) {
      console.error(error);
      setError("Account creation failed");
    }
  };
  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      >
        <Image
          style={styles.image}
          source={require("../../assets/Northeastern_Universitylogo_square.webp")}
        />
        <TextInput
          mode="outlined"
          label="Valid Email"
          textColor="white"
          outlineColor="white"
          autoCapitalize="none"
          activeOutlineColor="white"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          mode="outlined"
          label="Name"
          textColor="white"
          outlineColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          mode="outlined"
          label="Password"
          textColor="white"
          outlineColor="white"
          autoCapitalize="none"
          secureTextEntry
          activeOutlineColor="white"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          mode="outlined"
          label="Re-enter Password"
          textColor="white"
          outlineColor="white"
          autoCapitalize="none"
          secureTextEntry
          activeOutlineColor="white"
          style={styles.input}
          value={password2}
          onChangeText={setPassword2}
        />

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          contentStyle={{
            backgroundColor: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
          }}
          style={{
            position: "absolute",
            top: Dimensions.get("window").height - 130,
            left: Dimensions.get("window").width / 2 - 100,
            width: 200,
          }}
          anchor={
            <TouchableRipple
              style={[
                styles.navButton,
                { width: DIMENSIONS.componentWidth, paddingVertical: 10 },
              ]}
              onPress={openMenu}
            >
              <Text
                style={[
                  styles.navButtonText,
                  { color: COLORS.white, fontSize: FONTSIZES.medium },
                ]}
              >
                {location || "Choose Default Campus"}
              </Text>
            </TouchableRipple>
          }
        >
          <Menu.Item onPress={() => setLocation("Boston")} title="Boston" />
          <Menu.Item onPress={() => setLocation("Oakland")} title="Oakland" />
          <Menu.Item onPress={() => setLocation("London")} title="London" />
        </Menu>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableRipple style={styles.registerButton} onPress={handleRegister}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: FONTSIZES.large,
              color: COLORS.white,
            }}
          >
            Create Account
          </Text>
        </TouchableRipple>

        <TouchableRipple
          style={styles.navButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[styles.navButtonText, { color: COLORS.white }]}>
            Have an account?
          </Text>
        </TouchableRipple>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  image: {
    width: "75%",
    height: "40%",
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    marginBottom: 5,
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    height: 55,
  },
  registerButton: {
    width: "80%",
    backgroundColor: COLORS.maroon,
    padding: 10,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  noAccountText: {
    color: COLORS.white,
    alignSelf: "center",
    fontSize: FONTSIZES.medium,
    flexDirection: "row",
    marginTop: 5,
    fontWeight: "400",
  },
  errorText: {
    color: "red",
    alignSelf: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  navButton: {
    width: "50%",
    backgroundColor: COLORS.primary,
    padding: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  navButtonText: {
    color: COLORS.white,
    alignSelf: "center",
    fontSize: FONTSIZES.small,
    flexDirection: "row",
    fontWeight: "400",
  },
});

export default RegisterScreen;
