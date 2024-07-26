import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import { ImageSlider } from "react-native-image-slider-banner";
import {
  Appbar,
  Modal,
  PaperProvider,
  TouchableRipple,
  Button,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, DIMENSIONS, FONTSIZES } from "../components/Constants";
import ClassSummary from "../components/ClassSummary";
import axios from "axios";

const imageSliderData = [
  { img: require("../assets/marino1.jpg") },
  { img: require("../assets/marino2.jpg") },
  { img: require("../assets/marino3.jpg") },
  { img: require("../assets/marino4.jpg") },
];

const filterOptions = {
  types: ["Yoga", "Pilates", "Cardio", "Strength"],
  campuses: ["Main Campus", "Marino Center", "Satellite Campus"],
  instructors: ["John Doe", "Jane Doe", "Alice Smith", "Bob Johnson"],
};

function getFirstDayOfWeek(date) {
  const dayOfWeek = date.getDay();
  const firstDayOfWeek = new Date(date);
  const diff = dayOfWeek === 0 ? -6 : 0 - dayOfWeek;
  firstDayOfWeek.setDate(date.getDate() + diff);
  return firstDayOfWeek;
}

function getNumberOfDaysInAdvance(date, days) {
  const endDate = new Date(date);
  endDate.setDate(date.getDate() + days);
  return endDate;
}

const HomeScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    types: [],
    campuses: [],
    instructors: [],
  });
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalFilters, setModalFilters] = useState({ ...selectedFilters });

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/classes", {
        params: {
          date: selectedDate,
          types: selectedFilters.types.join(","),
          campuses: selectedFilters.campuses.join(","),
          instructors: selectedFilters.instructors.join(","),
        },
      });
      setClasses(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedFilters]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const removeFilter = (filterType, filterValue) => {
    setSelectedFilters((prevSelectedFilters) => ({
      ...prevSelectedFilters,
      [filterType]: prevSelectedFilters[filterType].filter(
        (item) => item !== filterValue
      ),
    }));
    setModalFilters((prevModalFilters) => ({
      ...prevModalFilters,
      [filterType]: prevModalFilters[filterType].filter(
        (item) => item !== filterValue
      ),
    }));
  };

  const toggleModalFilter = (filterType, filterValue) => {
    setModalFilters((prevModalFilters) => {
      const isSelected = prevModalFilters[filterType].includes(filterValue);
      const updatedFilters = isSelected
        ? prevModalFilters[filterType].filter((item) => item !== filterValue)
        : [...prevModalFilters[filterType], filterValue];
      return { ...prevModalFilters, [filterType]: updatedFilters };
    });
  };

  const applyFilters = () => {
    setSelectedFilters(modalFilters);
    hideModal();
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Action
            icon={() => (
              <Image
                style={styles.logo}
                source={require("../assets/Northeastern_Universitylogo_square.webp")}
              />
            )}
            onPress={() => {}}
          />
          <Appbar.Content title="" />
          <Appbar.Action
            icon="account-circle-outline"
            onPress={() => navigation.navigate("Profile")}
            color={COLORS.black}
            size={45}
          />
        </Appbar.Header>
        <Text
          style={[
            styles.textBig,
            { textAlign: "center", color: COLORS.white, paddingVertical: 10 },
          ]}
        >
          Northeastern Recreation
        </Text>
        <View style={[styles.buttonContainer, { marginBottom: 10 }]}>
          <TouchableRipple
            onPress={() => navigation.navigate("Reservations")}
            rippleColor={COLORS.primary}
            style={styles.button}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>View My Reservations</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color={COLORS.black}
              />
            </View>
          </TouchableRipple>
        </View>
        <View style={styles.sliderContainer}>
          <ImageSlider
            data={imageSliderData}
            autoPlay={true}
            timer={5000}
            localImg={true}
            preview={true}
            showIndicator={false}
            caroselImageStyle={styles.carouselImage}
          />
        </View>
        <View style={styles.headerContainer}>
          <Text style={[styles.textBig, { color: COLORS.white }]}>Classes</Text>
          <TouchableRipple onPress={showModal}>
            <Text style={[styles.textBig, { color: COLORS.primary }]}>
              Filters
            </Text>
          </TouchableRipple>
        </View>
        <ReactNativeCalendarStrip
          startingDate={selectedDate}
          selectedDate={selectedDate}
          minDate={getFirstDayOfWeek(new Date())}
          maxDate={getNumberOfDaysInAdvance(new Date(), 30)}
          daySelectionAnimation={{
            type: "background",
            duration: 50,
            highlightColor: COLORS.primary,
          }}
          style={{ height: 90, marginTop: -15 }}
          calendarHeaderStyle={{ color: COLORS.white }}
          dateNumberStyle={{ color: COLORS.white }}
          dateNameStyle={{ color: COLORS.secondary }}
          highlightDateNumberStyle={{ color: COLORS.white }}
          highlightDateNameStyle={{ color: COLORS.secondary }}
          onDateSelected={(date) => setSelectedDate(date)}
          scrollToOnSetSelectedDate={false}
        />
        <ScrollView style={styles.container}>
          {Object.values(selectedFilters).flat().length > 0 && (
            <View style={styles.filtersWrapper}>
              <Text style={[styles.textMedium, { color: COLORS.white }]}>
                Filters ({Object.values(selectedFilters).flat().length})
              </Text>
              <View style={styles.filterDivider} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
              >
                {Object.keys(selectedFilters).map((filterType) =>
                  selectedFilters[filterType].map((filterValue) => (
                    <TouchableOpacity
                      key={filterValue}
                      style={styles.filterButton}
                      onPress={() => removeFilter(filterType, filterValue)}
                    >
                      <Text style={styles.textMedium}>{filterValue}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          )}
          <View style={styles.classesContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : error ? (
              <Text
                style={[
                  styles.textBig,
                  { color: COLORS.white, textAlign: "center" },
                ]}
              >
                Error loading classes
              </Text>
            ) : classes.length > 0 ? (
              classes.map((classItem) => (
                <ClassSummary
                  key={classItem._id}
                  title={classItem.name}
                  type={classItem.type}
                  instructor={classItem.instructor}
                  startTime={new Date(classItem.date).toLocaleTimeString()}
                  duration={`${classItem.duration} min`}
                />
              ))
            ) : (
              <Text
                style={[
                  styles.textBig,
                  { color: COLORS.white, textAlign: "center" },
                ]}
              >
                No classes available
              </Text>
            )}
          </View>
        </ScrollView>
        <Modal
          visible={visible}
          contentContainerStyle={{
            backgroundColor: COLORS.primary,
            padding: 20,
            height: "70%",
            width: DIMENSIONS.componentWidth,
            alignSelf: "center",
            borderRadius: DIMENSIONS.cornerCurve,
          }}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Filter Classes</Text>
            {Object.keys(filterOptions).map((filterType) => (
              <View key={filterType} style={styles.filterSection}>
                <Text style={styles.textBig}>
                  {filterType.toLocaleUpperCase()}
                </Text>
                <View style={styles.filtersWrapper}>
                  {filterOptions[filterType].map((filterValue) => (
                    <TouchableOpacity
                      key={filterValue}
                      style={[
                        styles.filterButton,
                        modalFilters[filterType].includes(filterValue) &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => toggleModalFilter(filterType, filterValue)}
                    >
                      <Text style={styles.textMedium}>{filterValue}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            <Button
              mode="contained"
              onPress={applyFilters}
              style={[
                styles.button,
                { backgroundColor: COLORS.black, marginTop: 20 },
              ]}
            >
              Apply Filters
            </Button>
          </ScrollView>
        </Modal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  buttonContainer: {
    alignItems: "center",
    fontWeight: "bold",
  },
  textBig: {
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
  },
  textMedium: {
    fontSize: FONTSIZES.medium,
    fontWeight: "bold",
  },
  button: {
    width: DIMENSIONS.componentWidth,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    alignSelf: "center",
    borderRadius: DIMENSIONS.cornerCurve,
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: FONTSIZES.medium,
    color: COLORS.black,
    fontWeight: "bold",
  },
  logo: {
    width: 45,
    height: 45,
    marginLeft: -10,
    marginTop: -10,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  sliderContainer: {
    height: 200,
    width: "100%",
    marginBottom: 10,
  },
  carouselImage: {
    resizeMode: "cover",
  },
  filtersWrapper: {
    backgroundColor: COLORS.tertiary,
    borderRadius: DIMENSIONS.cornerCurve,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    marginTop: 5,
    flexWrap: "wrap",
  },
  filtersContainer: {
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.cornerCurve,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
    paddingVertical: 5,
  },
  selectedFilterButton: {
    backgroundColor: COLORS.secondary,
  },
  filterDivider: {
    width: 3,
    borderRadius: 20,
    backgroundColor: COLORS.black,
    marginLeft: 7,
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: DIMENSIONS.componentWidth,
    alignSelf: "center",
    marginBottom: 10,
  },
  classesContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default HomeScreen;
