import { useContext, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { PaperProvider, TextInput, TouchableRipple } from "react-native-paper";
import {
  COLORS,
  DIMENSIONS,
  FONTSIZES,
  VALIDEMAILS,
} from "../components/Constants";
import { UserContext } from "../UserContext";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);

  async function handleRegister(ev) {
    ev.preventDefault();
    let emailEnd = email.split("@")[1];
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    if (!VALIDEMAILS.includes(emailEnd)) {
      setError("Invalid email");
      return;
    }
    try {
      await axios.post("http://10.0.2.2:4000/register", {
        firstName,
        email,
        password,
      });
      navigation.navigate("Login");
      alert("Account created successfully");
    } catch (error) {
      setError("Account creation failed");
    }
  }
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../assets/Northeastern_Universitylogo_square.webp")}
        />
        <TextInput
          mode="outlined"
          label="Valid Email"
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          mode="outlined"
          label="First Name"
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          mode="outlined"
          label="Password"
          textColor="white"
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
          secureTextEntry
          activeOutlineColor="white"
          style={styles.input}
          value={password2}
          onChangeText={setPassword2}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableRipple style={styles.registerButton} onPress={handleRegister}>
          <Text style={{ fontWeight: "bold", fontSize: FONTSIZES.large, color: COLORS.white  }}>
            Create Account
          </Text>
        </TouchableRipple>
        <Text style={styles.noAccountText}>
          Already have an account? Click
          <TouchableRipple onPress={() => navigation.navigate("Login")}>
            <Text
              style={[
                styles.noAccountText,
                { color: COLORS.primary, marginBottom: -6 },
              ]}
            >
              {" "}
              here
            </Text>
          </TouchableRipple>
        </Text>
      </View>
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
});

export default RegisterScreen;
