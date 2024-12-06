import React from 'react';
import {
  PaperProvider,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import {
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from '../components/Header';
import {
  COLORS,
  DIMENSIONS,
  FONTSIZES,
  isTablet,
} from '../components/Constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const FeedbackScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      >
        <Header navigation={navigation} title="Feedback" />
        <Text style={styles.textBigWhite}>Leave Feedback Below</Text>
        <Text style={styles.textSmallRed}>
          Positive feedback is greatly appreciated but criticism helps the most
        </Text>
        <Formik
          initialValues={{ feedback: '' }}
          validationSchema={Yup.object({
            feedback: Yup.string()
              .min(10, 'Feedback must be at least 10 characters')
              .required('Feedback is required'),
          })}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              await axios.post('/email/feedback', {
                feedback: values.feedback,
              });
              Alert.alert('Success', 'Feedback sent successfully');
              resetForm();
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to send feedback. Please try again later.'
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View style={styles.formWrapper}>
              <TextInput
                mode="outlined"
                label="Enter your feedback"
                multiline
                height={isTablet? 500 : 290}
                activeOutlineColor={COLORS.white}
                onChangeText={handleChange('feedback')}
                onBlur={handleBlur('feedback')}
                value={values.feedback}
                style={styles.textInput}
                theme={{ colors: { text: COLORS.black } }}
                contentStyle={{ fontSize: FONTSIZES.small }}
                accessibilityLabel="Feedback input"
              />
              {touched.feedback && errors.feedback && (
                <Text style={styles.errorText}>{errors.feedback}</Text>
              )}
              {isSubmitting ? (
                <ActivityIndicator
                  style={{ marginTop: 20 }}
                  size="large"
                  color={COLORS.maroon}
                />
              ) : (
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  contentStyle={styles.buttonContent} // Ensures consistent height and padding
                  labelStyle={styles.buttonText} // Ensures consistent text styling
                  accessibilityLabel="Submit feedback button"
                >
                  Submit now
                </Button>
              )}
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
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
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    paddingTop: 20,
  },
  textSmallRed: {
    color: COLORS.secondary,
    fontSize: FONTSIZES.small,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
  },
  errorText: {
    color: COLORS.black,
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.maroon,
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: DIMENSIONS.cornerCurve,
    marginTop: 20,
  },
  buttonContent: {
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: FONTSIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    padding: 10,
    marginBottom: 5,
  },
  formWrapper: {
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: DIMENSIONS.cornerCurve,
    marginTop: 20,
  },
});

export default FeedbackScreen;
