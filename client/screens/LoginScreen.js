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
import {
  COLORS,
  DIMENSIONS,
  FONTSIZES,
  isTablet,
} from '../components/Constants';
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
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableRipple>

        <TouchableRipple
          style={styles.navButton}
          onPress={() => navigation.navigate('Forgot Password')}
          accessibilityLabel="Forgot Password button"
        >
          <Text style={styles.navButtonText}>Forgot Password</Text>
        </TouchableRipple>

        <TouchableRipple
          style={[styles.navButton, { marginTop: isTablet ? 10 : 5 }]}
          onPress={() => navigation.navigate('Register')}
          accessibilityLabel="Create Account button"
        >
          <Text style={styles.navButtonText}>Create Account</Text>
        </TouchableRipple>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: isTablet ? '35%' : '65%',
    height: isTablet ? '25%' : '30%',
    resizeMode: 'contain',
    marginBottom: isTablet ? 30 : 10,
  },
  input: {
    marginBottom: 5,
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    height: 55,
  },
  loginButton: {
    width: isTablet ? '70%' : '80%',
    backgroundColor: COLORS.maroon,
    padding: 10,
    alignItems: 'center',
    marginTop: isTablet ? 25 : 20,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  loginButtonText: {
    fontWeight: 'bold',
    fontSize: FONTSIZES.large,
    color: COLORS.white,
  },
  navButton: {
    width: isTablet ? '40%' : '50%',
    backgroundColor: COLORS.primary,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isTablet ? 15 : 10,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  navButtonText: {
    color: COLORS.white,
    fontSize: FONTSIZES.small,
  },
  errorText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: isTablet ? 15 : 10,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
