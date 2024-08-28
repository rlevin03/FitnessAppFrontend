import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { COLORS, DIMENSIONS, FONTSIZES } from "./Constants";

const ClassSummary = ({ classData }) => {
  const date = new Date(classData.date); // Ensure date is a Date object

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text
          style={[styles.textBig, { color: COLORS.black }]}
          accessible={true}
          accessibilityLabel={`Class time ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`}
        >
          {date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.textMedium}>{classData.duration}</Text>
          <Text style={[styles.textMedium, { marginLeft: 3 }]}>min</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.detailsContainer}>
        <Text style={[styles.textBig, { color: COLORS.black }]}>
          {classData.type}
        </Text>
        <Text style={[styles.textBig, { color: COLORS.white }]}>
          {classData.name}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.textMedium}>{classData.instructor}</Text>
          <Text style={[styles.textMedium, { marginRight: 10 }]}>
            {classData.campus}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    marginBottom: 10,
    borderRadius: DIMENSIONS.cornerCurve,
    padding: 10,
  },
  timeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    width: 4,
    borderRadius: 20,
    backgroundColor: COLORS.black,
    marginHorizontal: 5,
  },
  detailsContainer: {
    flex: 2,
    justifyContent: "center",
    marginLeft: 20,
  },
  textBig: {
    fontSize: FONTSIZES.medium,
    fontWeight: "bold",
  },
  textMedium: {
    fontSize: FONTSIZES.small,
    color: COLORS.secondary,
    fontWeight: "bold",
  },
});

export default ClassSummary;
