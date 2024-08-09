import { PaperProvider, Text, TouchableRipple } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import { createTimeRange } from "../components/Constants";
import Header from "../components/Header";

const date = new Date().toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
const splitDate = new Date().toDateString().split(" ");

const data = {
  type: "Dance",
  name: "Ballet",
  date: new Date().toISOString(),
  time: "11:00 AM",
  duration: 60,
  location: "Studio one",
  instructor: "John Doe",
  maxCapacity: 20,
  currentCapacity: 20,
  minimumAttendees: 5,
  waitListCapacity: 10,
  waitListCurrent: 5,
  description:
    "Dance your heart out with our special celebrity(literally) instructors. They will have you forgetting its finals season. Stressed about your dropping grades? Well stress no further as Jack Black will have you saying hakuna matata.",
  skillLevel: "Intermediate",
  intensity: "Medium",
  equipment: "Hand weights",
};

const ReservationScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Reservations" />

        <ScrollView>
          <TouchableRipple
            onPress={() =>
              navigation.navigate("Class Description", { class: data })
            }
          >
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
                  {data.name}
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
          </TouchableRipple>
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

export default ReservationScreen;
