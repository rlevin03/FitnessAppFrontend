import React from "react";
import { PaperProvider, Text, Button, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Header } from "../components/Header";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const FeedbackScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Feedback" />
        <Text style={styles.textBigWhite}>Leave Feedback Below</Text>
        <Text style={styles.textSmallRed}>
          Positive feedback is greatly appreciated but criticism helps the most
        </Text>
        <Formik
          initialValues={{ feedback: "" }}
          validationSchema={Yup.object({
            feedback: Yup.string()
              .min(10, "Feedback must be at least 10 characters")
              .required("Feedback is required"),
          })}
          onSubmit={(values, { resetForm }) => {
            console.log(values);
            resetForm();
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formWrapper}>
              <TextInput
                mode="outlined"
                label="Enter your feedback"
                multiline
                numberOfLines={15}
                activeOutlineColor={COLORS.white}
                onChangeText={handleChange("feedback")}
                onBlur={handleBlur("feedback")}
                value={values.feedback}
                style={styles.textInput}
                theme={{ colors: { text: COLORS.black } }}
                contentStyle={{ fontSize: FONTSIZES.medium }}
              />
              {touched.feedback && errors.feedback && (
                <Text style={styles.errorText}>{errors.feedback}</Text>
              )}
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                <Text style={[styles.buttonText]}>Submit now</Text>
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  textBigWhite: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    paddingTop: 20,
  },
  textSmallRed: {
    color: COLORS.secondary,
    fontSize: FONTSIZES.small,
    textAlign: "center",
    marginHorizontal: 20,
  },
  textInput: {
    textAlignVertical: "top",
    backgroundColor: COLORS.primary,
  },
  errorText: {
    color: COLORS.black,
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#630B0B",
    borderRadius: DIMENSIONS.cornerCurve,
    alignItems: "center",
    paddingVertical: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTSIZES.medium,
    fontWeight: "bold",
  },
  formWrapper: {
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: DIMENSIONS.cornerCurve,
    marginTop: 20,
  },
});

export default FeedbackScreen;
