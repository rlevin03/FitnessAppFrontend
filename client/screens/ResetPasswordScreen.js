import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import axios from "axios";
import { PaperProvider, TextInput, TouchableRipple } from "react-native-paper";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import { CommonActions } from "@react-navigation/native";

const ResetPasswordScreen = ({ navigation, route }) => {
  const { recipientEmail } = route.params;
  const [userCode, setUserCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleResetPassword = async () => {
    if (userCode !== verificationCode) {
      setError("Invalid verification code");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axios.patch("/auth/reset-password", {
        email: recipientEmail,
        newPassword,
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      >
        <TextInput
          mode="outlined"
          label="Email Verification Code"
          autoCapitalize="none"
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={userCode}
          onChangeText={setUserCode}
        />
        <TextInput
          mode="outlined"
          label="New Password"
          secureTextEntry
          autoCapitalize="none"
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          mode="outlined"
          label="Confirm New Password"
          secureTextEntry
          autoCapitalize="none"
          textColor="white"
          outlineColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.white} />
        ) : (
          <TouchableRipple
            style={styles.passwordChangeButton}
            onPress={handleResetPassword}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: FONTSIZES.large,
                color: COLORS.white,
              }}
            >
              Set Password
            </Text>
          </TouchableRipple>
        )}
      </KeyboardAvoidingView>
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
  passwordChangeButton: {
    width: "80%",
    backgroundColor: COLORS.maroon,
    padding: 10,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  errorText: {
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 5,
  },
});

export default ResetPasswordScreen;
