import React, { useContext } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Button, PaperProvider, Text } from "react-native-paper";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import SettingsOption from "../components/SettingsOption";
import Header from "../components/Header";
import { UserContext } from "../UserContext";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Profile" />
        <View style={[styles.classesAttendedContainer, styles.buttonContainer]}>
          <View style={styles.classesAttendedTextContainer}>
            <Text style={styles.classesAttendedText}>Classes Attended</Text>
            <Text
              style={styles.dateText}
            >{`${currentMonth} ${currentYear}`}</Text>
          </View>
          <View style={styles.classesAttendedNumberContainer}>
            <Text style={styles.classesAttendedNumber}>
              {user.classesAttended}
            </Text>
          </View>
        </View>
        <Button
          mode="contained"
          style={[styles.paymentButton, styles.buttonContainer]}
          onPress={() =>
            Linking.openURL(
              "https://commerce.cashnet.com/MARINOCENTER?itemcode=SFMC-AERO"
            ).catch((err) => console.error("Couldn't load page", err))
          }
        >
          <Text style={styles.paymentText}>Pay for Recreation Classes</Text>
        </Button>

        <View style={styles.settingsContainer}>
          <Text style={styles.userText}>User</Text>
          <SettingsOption
            title="Account"
            onPress={() => navigation.navigate("Account")}
          />
          <SettingsOption
            title="Reservations"
            onPress={() => navigation.navigate("Reservations")}
          />
          <SettingsOption
            title="Settings"
            onPress={() => navigation.navigate("Settings")}
          />
          <SettingsOption
            title="Leave Feedback"
            onPress={() => navigation.navigate("Feedback")}
            roundedBottom={true}
          />
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    borderRadius: DIMENSIONS.cornerCurve,
  },
  classesAttendedContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classesAttendedTextContainer: {
    flexDirection: "column",
  },
  classesAttendedText: {
    color: COLORS.black,
    fontWeight: "bold",
    fontSize: FONTSIZES.medium,
    marginBottom: 10,
  },
  dateText: {
    color: COLORS.black,
    fontSize: FONTSIZES.small,
    fontWeight: "bold",
  },
  classesAttendedNumberContainer: {
    borderColor: COLORS.black,
    borderWidth: 6,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
  },
  classesAttendedNumber: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: FONTSIZES.large,
  },
  paymentButton: {
    padding: 3,
    backgroundColor: COLORS.tertiary,
  },
  paymentText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: FONTSIZES.medium,
    paddingTop: 2,
  },
  settingsContainer: {
    marginTop: 20,
  },
  userText: {
    color: COLORS.black,
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
    paddingVertical: 15,
    paddingLeft: 10,
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    borderTopLeftRadius: DIMENSIONS.cornerCurve,
    borderTopRightRadius: DIMENSIONS.cornerCurve,
  },
});

export default ProfileScreen;
