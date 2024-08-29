import React, { useContext, useState } from "react";
import {
  PaperProvider,
  Text,
  TouchableRipple,
  Modal,
  Portal,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Ensure you have this import
import Header from "../components/Header";
import { Alert, StyleSheet, View } from "react-native";
import {
  adjustDateToLocal,
  COLORS,
  createTimeRange,
  DIMENSIONS,
  FONTSIZES,
} from "../components/Constants";
import { UserContext } from "../../UserContext";
import axios from "axios";

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
  const { classData } = route.params;
  const { user } = useContext(UserContext);
  const classFull = classData.usersSignedUp.length >= classData.maxCapacity;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedClassData, setUpdatedClassData] = useState(classData);

  const handleJoinClass = async () => {
    if (classData.paymentRequired && !user.paid) {
      Alert.alert(
        "Payment Required",
        "You need to pay the classes fee to register for this class."
      );
      return;
    }
    setLoading(true);

    try {
      const response = await axios.patch("/classes/reserve", {
        classId: updatedClassData._id,
        userId: user._id,
      });

      if (response.status === 200) {
        setUpdatedClassData(response.data.classData);
      }
    } catch (error) {
      console.error("Error joining class:", error);
      Alert.alert("Error", "Could not reserve the spot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClass = async () => {
    setLoading(true);
    try {
      const response = await axios.patch("/classes/cancel", {
        classId: updatedClassData._id,
        userId: user._id,
      });

      if (response.status === 200) {
        setUpdatedClassData(response.data.classData);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error leaving class:", error);
      Alert.alert("Error", "Could not leave the class. Please try again.");
    } finally {
      setLoading(false);
    }
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
            style={styles.modalButton}
          >
            {classFull ? "Leave Waitlist" : "Cancel Reservation"}
          </Button>
        </Modal>
      </Portal>

      {/* Main UI */}
      <View style={styles.container}>
        <Header navigation={navigation} title={updatedClassData.type} />
        <View style={styles.componentContainer}>
          <Text style={styles.titleText}>{updatedClassData.name}</Text>
        </View>
        <View style={[styles.componentContainer, { marginVertical: 3 }]}>
          <Text style={styles.dateText}>
            {adjustDateToLocal(classData.date).toLocaleDateString("en-US", {
              weekday: "long",
            })}
            ,{" "}
            {adjustDateToLocal(classData.date).toLocaleDateString("en-US", {
              month: "long",
            })}{" "}
            {adjustDateToLocal(classData.date).getDate()}
            {getDaySuffix(new Date(updatedClassData.date).getDate())}
          </Text>
          <Text style={styles.dateText}>
            {createTimeRange(
              updatedClassData.date,
              updatedClassData.duration
            )}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Location: </Text>
            <Text style={styles.textMedium}>
              {updatedClassData.location}, {updatedClassData.campus}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Instructor: </Text>
            <Text style={styles.textMedium}>{updatedClassData.instructor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Currently Signed: </Text>
            <Text style={styles.textMedium}>
              {updatedClassData.usersSignedUp.length}/
              {updatedClassData.maxCapacity}
            </Text>
          </View>
          {classFull ? (
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>People on Wait List: </Text>
              <Text style={styles.textMedium}>
                {updatedClassData.usersOnWaitList.length}/
                {updatedClassData.waitListCapacity}
              </Text>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Minimum Attendees: </Text>
              <Text style={styles.textMedium}>
                {updatedClassData.minCapacity}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.componentContainer}>
          {updatedClassData.usersSignedUp.includes(user._id) ||
          updatedClassData.usersOnWaitList.includes(user._id) ? (
            <View style={[styles.buttonInner, styles.button]}>
              <Text style={styles.buttonText}>
                {updatedClassData.usersSignedUp.includes(user._id)
                  ? "You Reserved a Spot"
                  : `You're on the Waitlist at position ${
                      updatedClassData.usersOnWaitList.indexOf(user._id) + 1
                    }`}
              </Text>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={30}
                color={COLORS.white}
                onPress={() => setModalVisible(true)}
              />
            </View>
          ) : (
            <TouchableRipple
              style={styles.button}
              onPress={handleJoinClass}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <View
                  style={[styles.buttonInner, { justifyContent: "center" }]}
                >
                  <Text style={styles.buttonText}>
                    {classFull ? "Join Waitlist" : "Join Class"}
                  </Text>
                </View>
              )}
            </TouchableRipple>
          )}
        </View>

        {/* Other components for class details */}
        <View style={styles.flexGrow} />
        <View style={styles.componentContainer}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          <Text style={styles.textMedium}>{updatedClassData.description}</Text>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Skill Level</Text>
            <Text style={styles.infoContent}>
              {updatedClassData.skillLevel}
            </Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Intensity</Text>
            <Text style={styles.infoContent}>
              {updatedClassData.intensityLevel}
            </Text>
          </View>
        </View>
        <View style={styles.flexGrow} />
        <View style={styles.equipmentContainer}>
          <Text style={styles.infoTitle}>What to Bring</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {updatedClassData.equipmentToBring &&
            updatedClassData.equipmentToBring.length > 0 ? (
              updatedClassData.equipmentToBring.map((equipment, index) => (
                <Text key={index} style={styles.infoContent}>
                  {equipment}
                  {index < updatedClassData.equipmentToBring.length - 1
                    ? ",  "
                    : ""}
                </Text>
              ))
            ) : (
              <Text style={styles.infoContent}>No equipment specified</Text>
            )}
          </View>
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
  titleText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: "bold",
  },
  dateText: {
    color: COLORS.white,
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
  },
  labelText: {
    color: COLORS.white,
    fontSize: FONTSIZES.medium,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.white,
    fontSize: FONTSIZES.medium,
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
  buttonInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 0,
    borderRadius: DIMENSIONS.cornerCurve,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.cornerCurve,
    width: DIMENSIONS.componentWidth,
  },
  flexGrow: {
    flex: 1,
  },
  infoSection: {
    marginTop: 3,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  infoColumn: {
    flex: 1,
    alignItems: "center",
  },
  infoTitle: {
    color: COLORS.secondary,
    marginBottom: 10,
    textAlign: "center",
    fontSize: FONTSIZES.small,
  },
  infoContent: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: FONTSIZES.small,
  },
  equipmentContainer: {
    backgroundColor: COLORS.primary,
    alignSelf: "center",
    width: "100%",
    borderBottomRightRadius: DIMENSIONS.cornerCurve * 3,
    borderBottomLeftRadius: DIMENSIONS.cornerCurve * 3,
    padding: 20,
    marginBottom: 20,
  },
});

export default ClassDescriptionScreen;
