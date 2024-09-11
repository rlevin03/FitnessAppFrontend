import React, { useEffect, useState, useContext } from "react";
import {
  ActivityIndicator,
  PaperProvider,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { SectionList, StyleSheet, View } from "react-native";
import {
  adjustDateToLocal,
  COLORS,
  DIMENSIONS,
  FONTSIZES,
} from "../components/Constants";
import { createTimeRange } from "../components/Constants";
import Header from "../components/Header";
import axios from "axios";
import { UserContext } from "../../UserContext";
import { useFocusEffect } from "@react-navigation/native";

const ReservationScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [waitLists, setWaitLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/classes/reservations", {
        params: { userId: user._id },
      });

      setReservations(
        (response.data.reservations || []).map((item) => ({
          ...item,
          listType: "reservation",
        }))
      );

      setWaitLists(
        (response.data.waitLists || []).map((item) => ({
          ...item,
          listType: "waitlist",
        }))
      );
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to load reservations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchClasses();
    }, [])
  );

  const sections = [
    ...(reservations.length > 0
      ? [{ title: "-----Reservations-----", data: reservations }]
      : []),
    ...(waitLists.length > 0
      ? [{ title: "-----Waitlists-----", data: waitLists }]
      : []),
  ];

  if (loading) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Header navigation={navigation} title="Reservations" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </View>
      </PaperProvider>
    );
  }

  if (error) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Header navigation={navigation} title="Reservations" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Upcoming Reservations" />
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={({ item: classData }) => {
            if (!classData || !classData.date || !classData.name) {
              console.error("Invalid class data:", classData);
              return null;
            }

            const isWaitList = classData.listType === "waitlist";
            const containerStyle = isWaitList
              ? [styles.date, { backgroundColor: COLORS.primary }]
              : styles.date;

            return (
              <TouchableRipple
                key={classData._id}
                onPress={() =>
                  navigation.navigate("Class Description", { classData })
                }
              >
                <View style={styles.reservation}>
                  <View style={containerStyle}>
                    <Text style={styles.textMedium}>
                      {adjustDateToLocal(classData.date)
                        .toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                        .toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.textBig,
                        { color: COLORS.white, fontWeight: "bold" },
                      ]}
                    >
                      {adjustDateToLocal(classData.date).getDate()}
                    </Text>
                    <Text style={styles.textMedium}>
                      {adjustDateToLocal(classData.date)
                        .toLocaleDateString("en-US", {
                          month: "short",
                        })
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 12,
                      padding: 10,
                      justifyContent: "center",
                      backgroundColor: isWaitList
                        ? COLORS.black
                        : COLORS.primary,
                      marginVertical: 10,
                      marginRight: 10,
                      marginLeft: -10,
                      borderTopRightRadius: DIMENSIONS.cornerCurve,
                      borderBottomRightRadius: DIMENSIONS.cornerCurve,
                    }}
                  >
                    <Text
                      style={[
                        styles.textBig,
                        {
                          textAlign: "left",
                          fontWeight: "bold",
                          color: isWaitList ? COLORS.primary : COLORS.black,
                        },
                      ]}
                    >
                      {classData.name || "Unknown Class"}
                    </Text>
                    <Text
                      style={[
                        styles.textMedium,
                        {
                          fontWeight: "bold",
                          textAlign: "left",
                          color: COLORS.white,
                        },
                      ]}
                    >
                      {createTimeRange(classData.date, classData.duration) ||
                        ""}
                    </Text>
                    <View style={styles.placeAndAttendees}>
                      <Text
                        style={[
                          styles.textSmall,
                          {
                            color: isWaitList
                              ? COLORS.tertiary
                              : COLORS.secondary,
                          },
                        ]}
                      >
                        {classData.location || "Unknown Location"}
                      </Text>
                      <Text
                        style={[
                          styles.textSmall,
                          {
                            textAlign: "right",
                            color: isWaitList
                              ? COLORS.tertiary
                              : COLORS.secondary,
                          },
                        ]}
                      >
                        {isWaitList
                          ? `Waitlist: ${
                              classData.usersOnWaitList.indexOf(user._id) + 1 ||
                              0
                            }`
                          : `Attendees: ${
                              classData.usersSignedUp.length || 0
                            }/${classData.maxCapacity || "N/A"}`}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableRipple>
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderSectionFooter={({ section }) => {
            if (section.title === "-----Reservations-----") {
              return <View style={{ height: 50 }} />;
            }
            return null;
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No reservations found</Text>
          }
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  textBig: {
    fontSize: FONTSIZES.large,
    textAlign: "center",
  },
  textMedium: {
    fontSize: FONTSIZES.medium,
    color: COLORS.white,
    textAlign: "center",
  },
  textSmall: {
    fontSize: FONTSIZES.small,
    color: COLORS.secondary,
    textAlign: "left",
    fontWeight: "bold",
  },
  date: {
    flex: 3,
    padding: 10,
    margin: 10,
    backgroundColor: COLORS.black,
    borderTopLeftRadius: DIMENSIONS.cornerCurve,
    borderBottomLeftRadius: DIMENSIONS.cornerCurve,
  },
  reservation: {
    backgroundColor: COLORS.tertiary,
    width: "100%",
    flexDirection: "row",
  },
  placeAndAttendees: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.red,
    textAlign: "center",
    marginTop: 20,
    fontSize: FONTSIZES.medium,
  },
  emptyText: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: 20,
    fontSize: FONTSIZES.medium,
  },
  sectionHeader: {
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default ReservationScreen;
