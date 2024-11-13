import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {
  Button,
  Modal,
  PaperProvider,
  Portal,
  RadioButton,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {
  CAMPUSES,
  COLORS,
  DIMENSIONS,
  FONTSIZES,
  VALIDEMAILS,
} from '../components/Constants';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import logo from '../../assets/Northeastern_Universitylogo_square.webp';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [campus, setCampus] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  const toggleModal = () => setVisible(!visible);
  const handleSetCampus = () => {
    setCampus(selectedCampus);
    toggleModal();
  };

  const handleRegister = async () => {
    let emailEnd = email.split('@')[1];
    if (!email || !password || !password2 || !name || !campus) {
      setError('Please fill out all fields, including campus selection');
      return;
    }
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    if (!VALIDEMAILS.includes(emailEnd)) {
      setError('Please use your school email');
      return;
    }
    try {
      await axios.post('/auth/register', {
        name,
        email,
        password,
        campus,
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Verification', params: { recipientEmail: email } }],
        })
      );
    } catch (error) {
      console.error(error);
      setError('Account creation failed');
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      >
        <Image style={styles.image} source={logo} />
        <TextInput
          mode="outlined"
          label="Valid Email"
          textColor="white"
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
          activeOutlineColor="white"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          mode="outlined"
          label="Password"
          textColor="white"
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
          autoCapitalize="none"
          secureTextEntry
          activeOutlineColor="white"
          style={styles.input}
          value={password2}
          onChangeText={setPassword2}
        />

        <TouchableRipple
          style={[styles.input, { marginTop: 10 }]}
          onPress={toggleModal}
        >
          <Text style={styles.campusText}>
            {campus ? `Campus: ${campus}` : 'Select Campus'}
          </Text>
        </TouchableRipple>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={toggleModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Select your campus:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setSelectedCampus(newValue)}
              value={selectedCampus}
            >
              {CAMPUSES.map((campusItem) => (
                <RadioButton.Item
                  mode="android"
                  color={COLORS.black}
                  label={campusItem}
                  value={campusItem}
                  key={campusItem}
                />
              ))}
            </RadioButton.Group>
            <Button
              mode="contained"
              onPress={handleSetCampus}
              style={styles.modalButton}
            >
              Confirm
            </Button>
            <Button
              onPress={toggleModal}
              style={[styles.modalButton, { backgroundColor: 'transparent' }]}
              textColor={COLORS.primary}
            >
              Cancel
            </Button>
          </Modal>
        </Portal>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableRipple style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableRipple>

        <TouchableRipple
          style={styles.navButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.navButtonText}>Have an account?</Text>
        </TouchableRipple>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 20,
  },
  image: {
    width: '75%',
    height: '30%',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    marginBottom: 5,
    borderRadius: DIMENSIONS.cornerCurve,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    height: 55,
    justifyContent: 'center',
  },
  campusText: {
    color: COLORS.white,
    fontSize: FONTSIZES.medium,
    paddingLeft: 15,
  },
  registerButton: {
    width: '80%',
    backgroundColor: COLORS.maroon,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  registerButtonText: {
    fontWeight: 'bold',
    fontSize: FONTSIZES.large,
    color: COLORS.white,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  navButton: {
    width: '50%',
    backgroundColor: COLORS.primary,
    padding: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  navButtonText: {
    color: COLORS.white,
    fontSize: FONTSIZES.small,
    fontWeight: '400',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: FONTSIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.cornerCurve,
    width: '100%',
    marginTop: 20,
  },
});

export default RegisterScreen;
