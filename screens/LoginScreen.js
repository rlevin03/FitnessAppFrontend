import axios from "axios";
import { Image, StyleSheet, View } from "react-native";
import {
  PaperProvider,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import { useState, useContext } from "react";
import { CommonActions } from "@react-navigation/native";
import { UserContext } from "../UserContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);

  async function handleLogin(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("http://10.110.208.57:4000/login", {
        email,
        password,
      });
      setUser(data);
      alert("Login successful");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } catch (error) {
      setError("Login failed");
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
          label="Email"
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
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
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableRipple style={styles.loginButton} onPress={handleLogin}>
          <Text style={{ fontWeight: "bold", fontSize: FONTSIZES.large }}>
            Login
          </Text>
        </TouchableRipple>
        <Text style={styles.noAccountText}>
          No account? Click
          <TouchableRipple onPress={() => navigation.navigate("Register")}>
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
  loginButton: {
    width: "80%",
    backgroundColor: COLORS.primary,
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
  },
});

export default LoginScreen;
