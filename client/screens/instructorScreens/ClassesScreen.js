import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import {
  ActivityIndicator,
  Provider as PaperProvider,
  TouchableRipple,
} from "react-native-paper";
import moment from "moment";
import { COLORS, DIMENSIONS, FONTSIZES } from "../../components/Constants";
import Header from "../../components/Header";
import ClassSummary from "../../components/ClassSummary";

const ClassesScreen = ({ navigation }) => {
  const [ongoingClasses, setOngoingClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/classes/byDate");
      const upcoming = response.data.filter((c) =>
        moment(c.date).isAfter(moment())
      );
      const ongoing = response.data.filter(
        (c) =>
          moment(c.date).isBefore(moment()) &&
          moment(moment()).isBefore(moment(c.date).add(c.duration, "minutes"))
      );
      setUpcomingClasses(upcoming);
      setOngoingClasses(ongoing);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to load classes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchClasses();
    }, [fetchClasses])
  );

  const renderClassItem = ({ item }) => (
    <TouchableRipple
      onPress={() => navigation.navigate("Attendance", { classData: item })}
      borderless={true}
    >
      <ClassSummary navigation={navigation} classData={item} />
    </TouchableRipple>
  );

  if (loading) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Header
            navigation={navigation}
            title="Upcoming Classes"
            backButton={false}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header
          navigation={navigation}
          title="Upcoming Classes"
          backButton={false}
        />
        <SectionList
          sections={[
            ...(ongoingClasses.length > 0
              ? [{ title: "-----Ongoing Classes-----", data: ongoingClasses }]
              : []),
            ...(upcomingClasses.length > 0
              ? [{ title: "-----Upcoming Classes-----", data: upcomingClasses }]
              : []),
          ]}
          keyExtractor={(item) => item._id}
          renderItem={renderClassItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderSectionFooter={({ section }) => {
            if (section.title === "-----Upcoming Classes-----") {
              return <View style={{ height: 50 }} />;
            }
            return null;
          }}
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
  classesContainer: {
    paddingTop: 15,
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    paddingBottom: 20,
  },
  textBig: {
    fontSize: FONTSIZES.large,
    paddingVertical: 20,
  },
  sectionHeader: {
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ClassesScreen;
