import React, { useEffect, useState, useContext } from "react";
import {
  ActivityIndicator,
  PaperProvider,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import { createTimeRange } from "../components/Constants";
import Header from "../components/Header";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useFocusEffect } from "@react-navigation/native";

const adjustDateToLocal = (isoDateString) => {
  const date = new Date(isoDateString);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate;
};

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
      setReservations(response.data.reservations || []);
      setWaitLists(response.data.waitLists || []);
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
        <Header navigation={navigation} title="Reservations" />
        <FlatList
          data={reservations}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={({ item: classData }) => {
            if (!classData || !classData.date || !classData.name) {
              console.error("Invalid class data:", classData);
              return null;
            }

            return (
              <TouchableRipple
                key={classData._id}
                onPress={() =>
                  navigation.navigate("Class Description", { classData })
                }
              >
                <View style={styles.reservation}>
                  <View style={styles.date}>
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
                      backgroundColor: COLORS.primary,
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
                        { textAlign: "left", fontWeight: "bold" },
                      ]}
                    >
                      {classData.name || "Unknown Class"}
                    </Text>
                    <Text
                      style={[
                        styles.textMedium,
                        { fontWeight: "bold", textAlign: "left" },
                      ]}
                    >
                      {createTimeRange(
                        classData.startTime,
                        classData.duration
                      ) || ""}
                    </Text>
                    <View style={styles.placeAndAttendees}>
                      <Text style={styles.textSmall}>
                        {classData.location || "Unknown Location"}
                      </Text>
                      <Text style={[styles.textSmall, { textAlign: "right" }]}>
                        Attendees: {classData.signeesAmount || 0}/
                        {classData.maxCapacity || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableRipple>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No reservations found.</Text>
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
});

export default ReservationScreen;
