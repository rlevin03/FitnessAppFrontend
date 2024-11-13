import axios from 'axios';
import {
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  PaperProvider,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import { COLORS, DIMENSIONS, FONTSIZES } from '../components/Constants';
import { useState, useContext } from 'react';
import { CommonActions } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import logo from '../../assets/Northeastern_Universitylogo_square.webp';
import { InstructorsContext } from '../../InstructorsContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const { refreshInstructors } = useContext(InstructorsContext);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { data } = await axios.post('/auth/login', {
        email,
        password,
      });
      if (setUser) setUser(data);
      if (refreshInstructors) refreshInstructors();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (error) {
      setError('Login failed. Please check your email and password.');
    } finally {
      setIsLoading(false);
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
          label="Email"
          textColor="white"
          autoCapitalize="none"
          activeOutlineColor="white"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Email input"
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
          accessibilityLabel="Password input"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableRipple
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
          accessibilityLabel="Login button"
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: FONTSIZES.large,
              color: COLORS.white,
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableRipple>

        <TouchableRipple
          style={styles.navButton}
          onPress={() => navigation.navigate('Forgot Password')}
          accessibilityLabel="Forgot Password button"
        >
          <Text style={[styles.navButtonText, { color: COLORS.white }]}>
            Forgot Password
          </Text>
        </TouchableRipple>

        <TouchableRipple
          style={[styles.navButton, { marginTop: 5 }]}
          onPress={() => navigation.navigate('Register')}
          accessibilityLabel="Create Account button"
        >
          <Text style={[styles.navButtonText, { color: COLORS.white }]}>
            Create Account
          </Text>
        </TouchableRipple>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  image: {
    width: '75%',
    height: '40%',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    marginBottom: 5,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    height: 55,
  },
  loginButton: {
    width: '80%',
    backgroundColor: COLORS.maroon,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: DIMENSIONS.cornerCurve,
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
    alignSelf: 'center',
    fontSize: FONTSIZES.small,
    flexDirection: 'row',
    fontWeight: '400',
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default LoginScreen;
