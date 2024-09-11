import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";

import { UserProvider } from "./UserContext";
import LoginScreen from "./client/screens/LoginScreen";
import ForgotPasswordScreen from "./client/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./client/screens/ResetPasswordScreen";
import RegisterScreen from "./client/screens/RegisterScreen";
import VerificationScreen from "./client/screens/VerificationScreen";
import EmailChangeScreen from "./client/screens/EmailChangeScreen";
import HomeScreen from "./client/screens/HomeScreen";
import ProfileScreen from "./client/screens/ProfileScreen";
import AccountScreen from "./client/screens/AccountScreen";
import PasswordChangeScreen from "./client/screens/PasswordChangeScreen";
import ReservationScreen from "./client/screens/ReservationScreen";
import ClassDescriptionScreen from "./client/screens/ClassDescriptionScreen";
import SettingsScreen from "./client/screens/SettingsScreen";
import FeedbackScreen from "./client/screens/FeedbackScreen";
import ClassesScreen from "./client/screens/instructorScreens/ClassesScreen";
import AttendanceScreen from "./client/screens/instructorScreens/AttendanceScreen";

axios.defaults.baseURL = "http://10.110.205.49:4000";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Forgot Password"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reset Password"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Verification"
              component={VerificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Email Change"
              component={EmailChangeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Change Password"
              component={PasswordChangeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reservations"
              component={ReservationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Class Description"
              component={ClassDescriptionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Classes"
              component={ClassesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Attendance"
              component={AttendanceScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Feedback"
              component={FeedbackScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </>
  );
}
