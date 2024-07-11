import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: 'Home Page',
    headerRight: () => (
      <Button
        onPress={() => alert('Profile button pressed')}
        title="Profile"
        color="#000"
      />
    ),
    headerLeft: () => (
      <Image
        source={require('../assets/Northeastern_Universitylogo_square.webp')}
        style={{ width: 30, height: 30, marginLeft: 10 }}
        />
    ),
  };
};

export default HomeScreen;