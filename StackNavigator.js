import HomeScreen from "./screens/HomeScreen";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./screens/ProfileScreen";
import ReservationScreen from "./screens/ReservationScreen";
import AccountScreen from "./screens/AccountScreen";
import SettingsScreen from "./screens/SettingsScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { UserProvider } from "./UserContext";

const StackNavigator = () => {
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
};

export default StackNavigator;

const styles = StyleSheet.create({});
