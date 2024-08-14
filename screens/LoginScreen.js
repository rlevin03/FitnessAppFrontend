import axios from "axios";
import { Image, LogBox, StyleSheet, View } from "react-native";
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
  LogBox.ignoreLogs(["Failed to fetch user profile"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    setError(null);
    try {
      const { data } = await axios.post("/auth/login", {
        email,
        password,
      });
      setUser(data);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } catch (error) {
      setError("Login failed. Please check your email and password.");
    }
  };

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
          <Text
            style={{
              fontWeight: "bold",
              fontSize: FONTSIZES.large,
              color: COLORS.white,
            }}
          >
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
  },
});

export default LoginScreen;
