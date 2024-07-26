import { PaperProvider, Text } from "react-native-paper";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS, FONTSIZES, DIMENSIONS } from "../components/Constants";
import { Header } from "../components/Header";

const date = new Date().toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
const splitDate = new Date().toDateString().split(" ");

const data = {
  type: "Aerobics",
  time: "6:30 PM",
  duration: 100,
  location: "Marino Center",
  maxCapacity: 20,
  currentCapacity: 15,
};

function createTimeRange(startTime, durationMinutes) {
  // Parse the start time into a Date object
  const [hours, minutes, period] = startTime
    .match(/(\d+):(\d+)\s*(AM|PM)/i)
    .slice(1);
  let startDate = new Date();
  startDate.setHours(
    period.toUpperCase() === "PM" && hours !== "12"
      ? parseInt(hours) + 12
      : parseInt(hours),
    parseInt(minutes)
  );

  // Create a new Date object for the end time by adding the duration
  let endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + durationMinutes);

  // Format the time as "hh:mm AM/PM"
  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`;
  };

  // Return the formatted time range string
  return `${formatTime(startDate)} - ${formatTime(endDate)} ${period}`;
}

export default ReservationScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Reservations" />

        <ScrollView>
          <View style={styles.reservation}>
            <View style={styles.date}>
              <Text style={styles.textMedium}>
                {splitDate[0].toUpperCase()}
              </Text>
              <Text
                style={[
                  styles.textBig,
                  { color: COLORS.white, fontWeight: "bold" },
                ]}
              >
                {splitDate[2]}
              </Text>
              <Text style={styles.textMedium}>
                {splitDate[1].toUpperCase()}
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
                {data.type}
              </Text>
              <Text
                style={[
                  styles.textMedium,
                  { fontWeight: "bold", textAlign: "left" },
                ]}
              >
                {createTimeRange(data.time, data.duration)}
              </Text>
              <View style={styles.placeAndAttendees}>
                <Text style={styles.textSmall}>{data.location}</Text>
                <Text style={[styles.textSmall, { textAlign: "right" }]}>
                  Attendees: {data.currentCapacity}/{data.maxCapacity}
                </Text>
              </View>
            </View>
          </View>
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
    borderRadius: DIMENSIONS.cornerCurve,
    flexDirection: "row",
  },
  placeAndAttendees: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
