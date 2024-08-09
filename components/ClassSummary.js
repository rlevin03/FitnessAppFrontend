import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { COLORS, DIMENSIONS, FONTSIZES } from "./Constants";

const ClassSummary = ({ title, type, instructor, startTime, duration }) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={[styles.textBig, { color: COLORS.black }]}>
          {startTime}
        </Text>
        <Text style={styles.textMedium}>{duration}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.detailsContainer}>
        <Text style={[styles.textBig, { color: COLORS.black }]}>{type}</Text>
        <Text style={[styles.textBig, { color: COLORS.white }]}>{title}</Text>
        <Text style={styles.textMedium}>{instructor}</Text>
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
