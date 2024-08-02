import React, { useState, useRef } from "react";
import { Image, StyleSheet, View, TextInput } from "react-native";
import { PaperProvider, Text, TouchableRipple } from "react-native-paper";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";

const VerificationScreen = ({ navigation }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
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
            A verification email has been sent to your email address.
            Please enter the given code below.
          </Text>

          <Text style={styles.wrongEmailText}>
            <TouchableRipple
              onPress={() => navigation.navigate("Email Change")}
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
              />
            ))}
          </View>
          
        </View>
        <TouchableRipple style={styles.verifyButton}>
          <Text style={{ fontWeight: "bold", fontSize: FONTSIZES.large, color: COLORS.white }}>
            Verify
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
    flexDirection: "row",
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
});

export default VerificationScreen;
