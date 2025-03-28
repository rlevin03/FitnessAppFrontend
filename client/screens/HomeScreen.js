import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ImageSlider } from 'react-native-image-slider-banner';
import {
  Appbar,
  Modal,
  PaperProvider,
  TouchableRipple,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  COLORS,
  DIMENSIONS,
  FONTSIZES,
  isTablet,
} from '../components/Constants';
import ClassSummary from '../components/ClassSummary';
import { UserContext } from '../../UserContext';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment-timezone';
import logo from '../../assets/Northeastern_Universitylogo_square.webp';
import picture1 from '../../assets/marino1.jpg';
import picture2 from '../../assets/marino2.jpg';
import picture3 from '../../assets/marino3.jpg';
import picture4 from '../../assets/marino4.jpg';
import leftScroller from '../../assets/left-chevron.png';
import rightScroller from '../../assets/chevron-right.png';
import { InstructorsContext } from '../../InstructorsContext';
import ReactNativeCalendarStrip from 'react-native-calendar-strip';

const imageSliderData = [
  { img: picture1 },
  { img: picture2 },
  { img: picture3 },
  { img: picture4 },
];

const Header = memo(() => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const campusTitle = 'Set your campus'; //user.location ? `${user.location}` : 

  return (
    <Appbar.Header style={styles.header} mode="center-aligned">
      <Appbar.Action
        icon={() => <Image style={styles.logo} source={logo} />}
        size={isTablet ? 50 : 45}
      />
      <Appbar.Content titleStyle={styles.appbarTitle} title={campusTitle} />
      <Appbar.Action
        icon="account-circle-outline"
        onPress={() => navigation.navigate('Profile')}
        color={COLORS.black}
        size={isTablet ? 50 : 45}
      />
    </Appbar.Header>
  );
});

const HomeScreen = () => {
  const {
    instructors,
    ready: instructorsReady,
    error,
  } = useContext(InstructorsContext);
  const { user, ready: userReady } = useContext(UserContext);
  const navigation = useNavigation();
  const [classes, setClasses] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    types: [],
    instructors: [],
  });
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(true);
  const [modalFilters, setModalFilters] = useState({ ...selectedFilters });

  const showModal = useCallback(() => setVisible(true), []);
  const hideModal = useCallback(() => setVisible(false), []);

  const fetchClasses = useCallback(async () => {
    if (!user || !user.location) return;
    setLoading(true);
    try {
      const response = await axios.get('/classes/filtered', {
        params: {
          date: selectedDate ? moment(selectedDate) : moment(),
          types: selectedFilters.types.join(','),
          campuses: user.location,
          instructors: selectedFilters.instructors.join(','),
        },
      });
      setClasses(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedFilters, user]);

  useFocusEffect(
    useCallback(() => {
      if (userReady && instructorsReady) {
        fetchClasses();
      }
    }, [fetchClasses, userReady, instructorsReady])
  );

  const removeFilter = useCallback((filterType, filterValue) => {
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
  }, []);

  const toggleModalFilter = useCallback((filterType, filterValue) => {
    setModalFilters((prevModalFilters) => {
      const isSelected = prevModalFilters[filterType].includes(filterValue);
      const updatedFilters = isSelected
        ? prevModalFilters[filterType].filter((item) => item !== filterValue)
        : [...prevModalFilters[filterType], filterValue];
      return { ...prevModalFilters, [filterType]: updatedFilters };
    });
  }, []);

  const applyFilters = useCallback(() => {
    setSelectedFilters(modalFilters);
    hideModal();
  }, [modalFilters, hideModal]);

  useEffect(() => {
    if (user && user.verified === false) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Verification', params: { recipientEmail: user.email } },
          ],
        })
      );
    }
  }, [user, navigation]);

  const customDatesStyles = [
    {
      date: moment(),
      dateNumberStyle: { color: COLORS.primary },
    },
  ];

  const renderClassItem = useCallback(
    ({ item }) => {
      const isPast = moment(item.date).isBefore(moment(), 'day');
      const instructor = instructors.find(
        (inst) => inst._id === item.instructor
      );
      const instructorName = instructor
        ? instructor.name
        : 'Unknown Instructor';

      return (
        <TouchableRipple
          onPress={() =>
            navigation.navigate('Class Description', { classData: item })
          }
          style={isPast ? styles.disabledClass : null}
          disabled={isPast}
        >
          <ClassSummary classData={{ ...item, instructorName }} />
        </TouchableRipple>
      );
    },
    [instructors, navigation]
  );

  const filterOptions = {
    types: ['Yoga', 'Pilates', 'Cardio', 'Strength', 'Dance'],
    instructors,
  };

  if (error) {
    return (
      <PaperProvider>
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>
            Failed to load instructors. Please try again later.
          </Text>
        </View>
      </PaperProvider>
    );
  }

  if (!userReady || !instructorsReady) {
    console.log('Loading...');
    return (
      <PaperProvider>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header />
        <Text style={styles.titleText}>Northeastern Recreation</Text>
        <View
          style={[styles.buttonContainer, { marginBottom: isTablet ? 15 : 10 }]}
        >
          <TouchableRipple
            onPress={() => navigation.navigate('Reservations')}
            rippleColor={COLORS.primary}
            style={styles.button}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>View My Reservations</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={isTablet ? 35 : 30}
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
        <ReactNativeCalendarStrip
          startingDate={selectedDate}
          selectedDate={selectedDate}
          minDate={moment().startOf('week')}
          maxDate={moment().add(1, 'month')}
          daySelectionAnimation={{
            type: 'background',
            duration: 50,
            highlightColor: COLORS.primary,
            borderRadius: 10,
          }}
          style={{ height: isTablet ? 110 : 90 }}
          calendarHeaderStyle={{ color: COLORS.white, fontSize: 20 }}
          dateNumberStyle={{ color: COLORS.white, fontSize: 20 }}
          dateNameStyle={{ color: COLORS.secondary, fontSize: 14 }}
          highlightDateNumberStyle={{ color: COLORS.white, fontSize: 20 }}
          highlightDateNameStyle={{ color: COLORS.secondary, fontSize: 14 }}
          onDateSelected={(date) => setSelectedDate(date)}
          customDatesStyles={customDatesStyles}
          iconLeft={leftScroller}
          iconRight={rightScroller}
          iconLeftStyle={{ paddingRight: isTablet ? 70 : 30 }}
          iconRightStyle={{ paddingLeft: isTablet ? 70 : 30 }}
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
                selectedFilters[filterType].map((filterValue) => {
                  let displayValue = filterValue;

                  if (filterType === 'instructors') {
                    const instructor = instructors.find(
                      (inst) => inst._id === filterValue
                    );
                    displayValue = instructor ? instructor.name : filterValue;
                  }

                  return (
                    <TouchableOpacity
                      key={filterValue}
                      style={styles.filterButton}
                      onPress={() => removeFilter(filterType, filterValue)}
                    >
                      <Text style={styles.textMedium}>{displayValue}</Text>
                    </TouchableOpacity>
                  );
                })
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
                { color: COLORS.white, textAlign: 'center' },
              ]}
            >
              {loading ? 'Loading classes...' : 'No classes available'}
            </Text>
          }
          contentContainerStyle={styles.classesContainer}
          refreshing={loading}
          onRefresh={fetchClasses}
        />
        <Modal
          visible={visible}
          onDismiss={applyFilters}
          contentContainerStyle={styles.modalContainer}
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
                    { backgroundColor: COLORS.black, width: '100%' },
                  ]}
                >
                  {filterOptions[filterType].map((filterValue) => {
                    if (filterType === 'instructors') {
                      // filterValue is an instructor object { _id, name }
                      return (
                        <TouchableOpacity
                          key={filterValue._id}
                          style={[
                            styles.filterButton,
                            { marginBottom: 5, backgroundColor: COLORS.white },
                            modalFilters.instructors.includes(
                              filterValue._id
                            ) && styles.selectedFilterButton,
                          ]}
                          onPress={() =>
                            toggleModalFilter('instructors', filterValue._id)
                          }
                        >
                          <Text style={styles.textMedium}>
                            {filterValue.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    } else {
                      // filterValue is a string (e.g., "Yoga", "Pilates")
                      return (
                        <TouchableOpacity
                          key={filterValue}
                          style={[
                            styles.filterButton,
                            { marginBottom: 5, backgroundColor: COLORS.white },
                            modalFilters[filterType].includes(filterValue) &&
                              styles.selectedFilterButton,
                          ]}
                          onPress={() =>
                            toggleModalFilter(filterType, filterValue)
                          }
                        >
                          <Text style={styles.textMedium}>{filterValue}</Text>
                        </TouchableOpacity>
                      );
                    }
                  })}
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
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: isTablet ? 20 : 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.black,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  logo: {
    width: isTablet ? 50 : 45,
    height: isTablet ? 50 : 45,
    marginLeft: -10,
  },
  appbarTitle: {
    fontWeight: 'bold',
    fontSize: FONTSIZES.large,
    color: COLORS.white,
    marginLeft: isTablet ? 25 : 20,
  },
  titleText: {
    fontSize: FONTSIZES.large,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.white,
    paddingVertical: isTablet ? 15 : 10,
  },
  textBig: {
    fontSize: FONTSIZES.medium,
    fontWeight: 'bold',
  },
  textMedium: {
    fontSize: FONTSIZES.small,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: DIMENSIONS.componentWidth,
    backgroundColor: COLORS.primary,
    paddingVertical: isTablet ? 15 : 10,
    alignSelf: 'center',
    borderRadius: DIMENSIONS.cornerCurve,
  },
  buttonInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 25 : 20,
  },
  buttonText: {
    fontSize: FONTSIZES.medium,
    color: COLORS.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sliderContainer: {
    height: isTablet ? 300 : 200,
    width: '100%',
    marginBottom: isTablet ? 20 : 10,
  },
  carouselImage: {
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    marginBottom: isTablet ? 15 : 10,
  },
  filtersWrapper: {
    backgroundColor: COLORS.tertiary,
    borderRadius: DIMENSIONS.cornerCurve,
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 15 : 10,
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    marginTop: isTablet ? 10 : 5,
    flexWrap: 'wrap',
  },
  filtersContainer: {
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.cornerCurve,
    paddingHorizontal: isTablet ? 15 : 10,
    marginRight: 5,
    paddingVertical: isTablet ? 8 : 5,
    marginBottom: 5,
  },
  selectedFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterDivider: {
    width: 3,
    borderRadius: 20,
    backgroundColor: COLORS.black,
    marginLeft: 7,
    height: '100%',
  },
  modalTitle: {
    fontSize: FONTSIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: isTablet ? 30 : 20,
  },
  modalContainer: {
    backgroundColor: COLORS.tertiary,
    padding: 20,
    height: '80%',
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    borderRadius: DIMENSIONS.cornerCurve,
  },
  filterSection: {
    marginBottom: isTablet ? 25 : 20,
  },
  disabledClass: {
    opacity: 0.5,
  },
  classesContainer: {
    paddingTop: isTablet ? 20 : 15,
    paddingHorizontal: isTablet ? 20 : 15,
    paddingBottom: isTablet ? 25 : 20,
  },
  errorText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: FONTSIZES.medium,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
