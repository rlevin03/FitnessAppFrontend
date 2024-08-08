import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AccountScreen from "./screens/AccountScreen";
import ReservationScreen from "./screens/ReservationScreen";
import SettingsScreen from "./screens/SettingsScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import VerificationScreen from "./screens/VerificationScreen";
import EmailChangeScreen from "./screens/EmailChangeScreen";
import ClassDescriptionScreen from "./screens/ClassDescriptionScreen";

import { UserProvider } from "./UserContext";

axios.defaults.baseURL = "http://10.110.169.4:4000";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
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
            name="Feedback"
            component={FeedbackScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
