import React, { useState } from "react";
import {
  PaperProvider,
  Text,
  TouchableRipple,
  Modal,
  Portal,
  Button,
  IconButton,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Ensure you have this import
import Header from "../components/Header";
import { StyleSheet, View } from "react-native";
import {
  COLORS,
  createTimeRange,
  DIMENSIONS,
  FONTSIZES,
} from "../components/Constants";

// Function to get the suffix for the day of the month (st, nd, rd, th)
const getDaySuffix = (day) => {
  if (day > 3 && day < 21) return "th"; // 'th' suffix for 4-20
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const ClassDescriptionScreen = ({ navigation, route }) => {
  const { class: classData } = route.params;
  const classFull = classData.currentCapacity >= classData.maxCapacity;

  const [modalVisible, setModalVisible] = useState(false);

  const handleJoinClass = () => {
    // Implement the functionality to join the class here
    console.log("Join class button pressed");
    // Optionally, set state to reflect the user has joined the class
  };

  const handleLeaveClass = () => {
    // Implement the functionality to leave the class or waitlist here
    console.log("Leave class button pressed");
    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Button
            mode="contained"
            onPress={handleLeaveClass}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: DIMENSIONS.cornerCurve,
              width: DIMENSIONS.componentWidth,
            }}
          >
            {classFull ? "Leave Waitlist" : "Cancel Reservation"}
          </Button>
        </Modal>
      </Portal>
      <View style={styles.container}>
        <Header navigation={navigation} title={classData.type} />
        <View style={styles.componentContainer}>
          <Text
            style={[styles.textLarge, { fontSize: 36, fontWeight: "bold" }]}
          >
            {classData.name}
          </Text>
        </View>
        <View style={[styles.componentContainer, { marginVertical: 3 }]}>
          <Text style={[styles.textLarge, { fontWeight: "bold" }]}>
            {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
              new Date(classData.date)
            )}
            ,{" "}
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
            }).format(new Date(classData.date))}
            {getDaySuffix(new Date(classData.date).getDate())}
          </Text>
          <Text style={[styles.textLarge, { fontWeight: "bold" }]}>
            {createTimeRange(classData.time, classData.duration)}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textMedium, { fontWeight: "bold" }]}>
              Location:{" "}
            </Text>
            <Text style={styles.textMedium}>{classData.location}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textMedium, { fontWeight: "bold" }]}>
              Instructor:{" "}
            </Text>
            <Text style={styles.textMedium}>{classData.instructor}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textMedium, { fontWeight: "bold" }]}>
              Currently Signed:{" "}
            </Text>
            <Text style={styles.textMedium}>
              {classData.currentCapacity}/{classData.maxCapacity}
            </Text>
          </View>
          {classFull ? (
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textMedium, { fontWeight: "bold" }]}>
                People on Wait List:{" "}
              </Text>
              <Text style={styles.textMedium}>
                {classData.waitListCurrent}/{classData.waitListCapacity}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textMedium, { fontWeight: "bold" }]}>
                Minimum Attendees:{" "}
              </Text>
              <Text style={styles.textMedium}>
                {classData.minimumAttendees}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.componentContainer}>
          <TouchableRipple onPress={handleJoinClass} style={styles.button}>
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>
                {classFull ? "Join Waitlist" : "Join Class"}
              </Text>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={30}
                color={COLORS.white}
                onPress={() => setModalVisible(true)}
              />
            </View>
          </TouchableRipple>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={[styles.componentContainer]}>
          <Text
            style={[
              styles.textMedium,
              { fontWeight: "bold", marginBottom: 10 },
            ]}
          >
            What to Expect
          </Text>
          <Text style={styles.textMedium}>{classData.description}</Text>
        </View>
        <View
          style={[
            styles.componentContainer,
            {
              marginTop: 3,
              flexDirection: "row",
              backgroundColor: COLORS.primary,
            },
          ]}
        >
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text
              style={[
                styles.textMedium,
                {
                  marginBottom: 10,
                  textAlign: "center",
                  color: COLORS.secondary,
                },
              ]}
            >
              Skill Level
            </Text>
            <Text
              style={[
                styles.textMedium,
                {
                  textAlign: "center",
                  fontWeight: "bold",
                },
              ]}
            >
              {classData.skillLevel}
            </Text>
          </View>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text
              style={[
                styles.textMedium,
                {
                  marginBottom: 10,
                  textAlign: "center",
                  color: COLORS.secondary,
                },
              ]}
            >
              Intensity
            </Text>
            <Text
              style={[
                styles.textMedium,
                {
                  textAlign: "center",
                  fontWeight: "bold",
                },
              ]}
            >
              {classData.intensity}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
        <View
          style={[
            styles.componentContainer,
            {
              backgroundColor: COLORS.primary,
              alignSelf: "baseline",
              borderBottomRightRadius: DIMENSIONS.cornerCurve * 3,
              borderBottomLeftRadius: DIMENSIONS.cornerCurve * 3,
            },
          ]}
        >
          <Text
            style={[
              styles.textMedium,
              {
                marginBottom: 10,
                textAlign: "center",
                color: COLORS.secondary,
              },
            ]}
          >
            Equipment Used
          </Text>
          <Text
            style={[
              styles.textMedium,
              {
                textAlign: "center",
                fontWeight: "bold",
              },
            ]}
          >
            {classData.equipment}
          </Text>
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
  componentContainer: {
    backgroundColor: COLORS.tertiary,
    padding: 10,
    width: "100%",
  },
  textMedium: {
    color: COLORS.white,
    fontSize: FONTSIZES.medium,
    marginVertical: 1,
  },
  textLarge: {
    color: COLORS.white,
    fontSize: FONTSIZES.large,
    marginVertical: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    width: DIMENSIONS.componentWidth,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTSIZES.medium,
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 10,
    margin: 20,
    borderRadius: DIMENSIONS.cornerCurve,
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
});

export default ClassDescriptionScreen;
