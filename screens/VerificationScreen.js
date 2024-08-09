import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PaperProvider, Text, TouchableRipple } from "react-native-paper";
import axios from "axios";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import { CommonActions } from "@react-navigation/native";

const VerificationScreen = ({ navigation, route }) => {
  const { recipientEmail } = route.params;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = generateVerificationCode();
    setVerificationCode(code);
    sendVerificationCodeToEmail(recipientEmail, code);
  }, [recipientEmail]);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationCodeToEmail = async (email, code) => {
    try {
      await axios.post("/email/send-verification-code", {
        email,
        code,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to send verification code");
      console.error(error);
    }
  };

  const handleVerification = async () => {
    setLoading(true);
    const enteredCode = code.join("");
    if (enteredCode === verificationCode) {
      try {
        const response = await axios.patch("/auth/verify", null, {
          params: { email: recipientEmail },
        });
        if (response.status === 200) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }],
            })
          );
        } else {
          Alert.alert("Error", "Verification failed. Please try again.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "An error occurred during verification.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert("Error", "Invalid verification code");
    }
  };

  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Image
            style={styles.logo}
            source={require("../assets/latin_logo.png")}
          />
          <Text style={[styles.text, styles.boldText]}>
            Verify your school email
          </Text>
          <Text style={[styles.text, styles.infoText]}>
            A verification email has been sent to your email address. Please
            enter the given code below.
          </Text>

          <Text style={styles.wrongEmailText}>
            <TouchableRipple
              onPress={() =>
                navigation.navigate("Email Change", {
                  oldEmail: recipientEmail,
                })
              }
              accessible={true}
              accessibilityLabel="Change Email"
            >
              <Text
                style={[
                  styles.wrongEmailText,
                  { color: COLORS.white, marginBottom: -4 },
                ]}
              >
                Click here{" "}
              </Text>
            </TouchableRipple>
            if you would like to change the email address you signed up with.
          </Text>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                ref={(ref) => (inputs.current[index] = ref)}
                accessible={true}
                accessibilityLabel={`Verification code digit ${index + 1}`}
              />
            ))}
          </View>
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.white}
            accessible={true}
            accessibilityLabel="Loading"
          />
        ) : (
          <TouchableRipple
            style={styles.verifyButton}
            onPress={handleVerification}
            accessible={true}
            accessibilityLabel="Verify"
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableRipple>
        )}
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
    padding: 20,
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
  boldText: {
    fontSize: FONTSIZES.medium,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: FONTSIZES.small,
    marginVertical: 20,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderColor: COLORS.black,
    textAlign: "center",
    fontSize: FONTSIZES.medium,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
  },
  wrongEmailText: {
    textAlign: "center",
    fontSize: FONTSIZES.small,
    marginTop: -5,
    fontWeight: "400",
  },
  verifyButton: {
    width: "80%",
    backgroundColor: COLORS.maroon,
    padding: 10,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  verifyButtonText: {
    fontWeight: "bold",
    fontSize: FONTSIZES.large,
    color: COLORS.white,
  },
});

export default VerificationScreen;
