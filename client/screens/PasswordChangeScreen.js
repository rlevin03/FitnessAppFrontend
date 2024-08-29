import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  PaperProvider,
  TextInput,
  TouchableRipple,
  Text,
} from "react-native-paper";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import { UserContext } from "../../UserContext";
import Header from "../components/Header";

const PasswordChangeScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user, setUser } = useContext(UserContext);

  const handlePasswordChange = async () => {
    if (oldPassword === "" || newPassword === "") {
      Alert.alert("Error", "Please enter both old and new passwords");
      return;
    }
    if (oldPassword === newPassword) {
      Alert.alert("Error", "Old and new passwords cannot be the same");
      return;
    }
    try {
      const response = await axios.patch("/auth/password-change", {
        email: user.email,
        oldPassword,
        newPassword,
      });
      if (response.status === 200) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
        await axios.post("/auth/logout");
        setUser(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert("Error", "Incorrect old password");
        return;
      }
      console.error(error);
      Alert.alert("Error", "Failed to change password");
    }
  };

  return (
    <PaperProvider>
      <Header navigation={navigation} title="Password Form" />
      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Old Password"
          secureTextEntry
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          mode="outlined"
          label="New Password"
          secureTextEntry
          textColor="white"
          activeOutlineColor="white"
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableRipple
          style={styles.passwordChangeButton}
          onPress={handlePasswordChange}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: FONTSIZES.large,
              color: COLORS.white,
            }}
          >
            Change Password
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
  passwordChangeButton: {
    width: "80%",
    backgroundColor: COLORS.maroon,
    padding: 10,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: DIMENSIONS.cornerCurve,
  },
});

export default PasswordChangeScreen;
