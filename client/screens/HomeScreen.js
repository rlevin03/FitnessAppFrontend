import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  memo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import { ImageSlider } from "react-native-image-slider-banner";
import {
  Appbar,
  Modal,
  PaperProvider,
  TouchableRipple,
  Button,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  adjustDateToLocal,
  COLORS,
  DIMENSIONS,
  FONTSIZES,
} from "../components/Constants";
import ClassSummary from "../components/ClassSummary";
import { UserContext } from "../../UserContext";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import moment from "moment-timezone";
import logo from "../../assets/Northeastern_Universitylogo_square.webp";
import picture1 from "../../assets/marino1.jpg";
import picture2 from "../../assets/marino2.jpg";
import picture3 from "../../assets/marino3.jpg";
import picture4 from "../../assets/marino4.jpg";
import leftScroller from "../../assets/left-chevron.png";
import rightScroller from "../../assets/chevron-right.png";

const imageSliderData = [
  { img: picture1 },
  { img: picture2 },
  { img: picture3 },
  { img: picture4 },
];

const filterOptions = {
  types: ["Yoga", "Pilates", "Cardio", "Strength", "Dance"],
  instructors: [
    "John Doe",
    "Joe Shmo",
    "Jane Doe",
    "Alice Smith",
    "Bob Johnson",
  ],
};

const Header = memo(({ navigation }) => {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action
        icon={() => <Image style={styles.logo} source={logo} />}
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
  );
});

const HomeScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    types: [],
    instructors: [],
  });
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(true);
  const [modalFilters, setModalFilters] = useState({ ...selectedFilters });
  const { user, ready } = useContext(UserContext);
  // TODO: i wouldn't bother with this - you'll want to get the current one, not the one when the class is
  // this is also a very simple function call, so there's no time-saving by putting this here.
  const currentDate = moment(); 

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/classes/filtered", {
        params: {
          date: selectedDate ? moment(selectedDate) : moment(new Date()),
          types: selectedFilters.types.join(","),
          campuses: user.location,
          instructors: selectedFilters.instructors.join(","),
        },
      });
      setClasses(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedFilters]);

  useFocusEffect(
    useCallback(() => {
      fetchClasses();
    }, [fetchClasses])
  );

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

  if (!ready) {
    return (
      <PaperProvider>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </PaperProvider>
    );
  }

  useEffect(() => {
    if (user && user.verified === false) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: "Verification", params: { recipientEmail: user.email } },
          ],
        })
      );
    }
  }, [user, navigation]);

  const renderClassItem = ({ item }) => {
    // TODO: prettier settings - you can enforce that these variables are either used or deleted
    // by configuring prettier and eslint with your project
    const classDate = adjustDateToLocal(item.date);
    const now = currentDate;

    const isPast = moment(item.date).isBefore(moment(), "day");

    return (
      <TouchableRipple
        onPress={() =>
          navigation.navigate("Class Description", { classData: item })
        }
        style={isPast ? styles.disabledClass : {}}
        disabled={isPast}
      >
        <ClassSummary navigation={navigation} classData={item} />
      </TouchableRipple>
    );
  };

  const customDatesStyles = [
    {
      date: moment(),
      dateNumberStyle: { color: COLORS.primary },
    },
  ];

  // TODO: break into smaller components, make folder for home screen and all sub-components (that are not shared among other screens)
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} />
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
          <Text
            style={[styles.textBig, { color: COLORS.secondary }]}
            onPress={showModal}
          >
            Filters
          </Text>
        </View>
        <CalendarStrip
          startingDate={selectedDate}
          selectedDate={selectedDate}
          minDate={moment().startOf("week")}
          maxDate={moment().add(1, "month")}
          daySelectionAnimation={{
            type: "background",
            duration: 50,
            highlightColor: COLORS.primary,
          }}
          style={{ height: 90 }}
          calendarHeaderStyle={{ color: COLORS.white }}
          dateNumberStyle={{ color: COLORS.white }}
          dateNameStyle={{ color: COLORS.secondary }}
          highlightDateNumberStyle={{ color: COLORS.white }}
          highlightDateNameStyle={{ color: COLORS.secondary }}
          onDateSelected={(date) => setSelectedDate(date)}
          customDatesStyles={customDatesStyles}
          iconLeft={leftScroller}
          iconRight={rightScroller}
          iconLeftStyle={{ paddingRight: 30 }}
          iconRightStyle={{ paddingLeft: 30 }}
        />
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
        <FlatList
          data={classes}
          keyExtractor={(item) => item._id}
          renderItem={renderClassItem}
          ListEmptyComponent={
            <Text
              style={[
                styles.textBig,
                { color: COLORS.white, textAlign: "center" },
              ]}
            >
              {loading ? "Loading classes..." : "No classes available"}
            </Text>
          }
          contentContainerStyle={styles.classesContainer}
          refreshing={loading}
          onRefresh={fetchClasses}
        />
        {/* TODO: component */}
        <Modal
          visible={visible}
          onDismiss={applyFilters}
          contentContainerStyle={{
            backgroundColor: COLORS.tertiary,
            padding: 20,
            height: "80%",
            width: DIMENSIONS.componentWidth,
            alignSelf: "center",
            borderRadius: DIMENSIONS.cornerCurve,
          }}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Filter Classes</Text>
            {Object.keys(filterOptions).map((filterType) => (
              <View key={filterType} style={[styles.filterSection]}>
                <Text style={[styles.textBig, { color: COLORS.white }]}>
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Text>
                <View
                  style={[
                    styles.filtersWrapper,
                    { backgroundColor: COLORS.black, width: "100%" },
                  ]}
                >
                  {filterOptions[filterType].map((filterValue) => (
                    <TouchableOpacity
                      key={filterValue}
                      style={[
                        styles.filterButton,
                        { marginBottom: 5, backgroundColor: COLORS.white },
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
            <TouchableRipple
              mode="contained"
              onPress={applyFilters}
              style={[styles.button, { backgroundColor: COLORS.secondary }]}
            >
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableRipple>
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
    textAlign: "center",
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
    paddingVertical: 5,
  },
  selectedFilterButton: {
    backgroundColor: COLORS.primary,
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
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: FONTSIZES.large,
    fontWeight: "bold",
    color: COLORS.white,
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
  disabledClass: {
    opacity: 0.5,
  },
});

export default HomeScreen;
