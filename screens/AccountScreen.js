import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, PaperProvider, Text } from "react-native-paper";
import { Header } from "../components/Header";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";

const AccountScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Account" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.accountInfo}>
            <Text style={[styles.textMediumBold, { paddingBottom: 30 }]}>
              Manage Account Settings
            </Text>
            <Text style={styles.textMediumBold}>Name: John Doe</Text>
            <Text style={styles.textMediumBold}>
              Email: levin.rob@northeastern.edu
            </Text>
          </View>
          <Button mode="contained" style={styles.settingsButton}>
            <Text style={styles.textLargeBold}>Change Password</Text>
          </Button>
          <Button mode="contained" style={styles.settingsButton}>
            <Text style={styles.textLargeBold}>Change Name</Text>
          </Button>
          <View style={styles.spacer} />
          <Button
            mode="contained"
            style={[styles.settingsButton, { marginBottom: 30 }]}
          >
            <Text style={[styles.textLargeBold, { color: COLORS.black }]}>
              Delete Account
            </Text>
          </Button>
        </ScrollView>
      </View>
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
    justifyContent: "space-between",
  },
  accountInfo: {
    backgroundColor: COLORS.tertiary,
    padding: 20,
    borderRadius: DIMENSIONS.cornerCurve,
    marginVertical: 20,
    marginBottom: 30,
    alignContent: "center",
    justifyContent: "center",
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
  },
  textMediumBold: {
    fontSize: FONTSIZES.medium,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 10,
    textAlign: "center",
  },
  textLargeBold: {
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
    color: COLORS.white,
    padding: 15,
    marginBottom: 5,
  },
  settingsButton: {
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: DIMENSIONS.cornerCurve,
    marginTop: 20,
  },
  spacer: {
    flex: 1,
  },
});

export default AccountScreen;
