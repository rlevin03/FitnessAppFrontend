import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Modal, PaperProvider, Text } from 'react-native-paper';
import {
  COLORS,
  DIMENSIONS,
  FONTSIZES,
  isTablet,
} from '../components/Constants';
import SettingsOption from '../components/SettingsOption';
import Header from '../components/Header';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [classesAttended, setClassesAttended] = useState(0);
  const currentMonthYear = moment().format('MMMM YYYY');
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const getClassesAttended = useCallback(async () => {
    try {
      response = await axios.get('/users/classesAttended', {
        params: { userId: user._id },
      });
      setClassesAttended(response.data);
    } catch (error) {
      console.error('Error fetching classes attended:', error);
    }
  });

  useFocusEffect(
    useCallback(() => {
      getClassesAttended();
    }, [getClassesAttended])
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Profile" />
        <View style={styles.classesAttendedContainer}>
          <View style={styles.classesAttendedTextContainer}>
            <Text style={styles.classesAttendedText}>Classes Attended</Text>
            <Text
              style={styles.dateText}
            >{`${currentMonthYear}`}</Text>
          </View>
          <View style={styles.classesAttendedNumberContainer}>
            <Text style={styles.classesAttendedNumber}>{classesAttended}</Text>
          </View>
        </View>
        <Button
          mode="contained"
          style={[styles.button, {backgroundColor: COLORS.tertiary}] }
          onPress={showModal}
        >
          <Text style={[styles.paymentText, {padding: 5}]}>Pay for Recreation Classes</Text>
        </Button>

        <View>
          <Text style={styles.userText}>{user.name}</Text>
          <SettingsOption
            title="Account"
            onPress={() => navigation.navigate('Account')}
          />
          <SettingsOption
            title="Reservations"
            onPress={() => navigation.navigate('Reservations')}
          />
          <SettingsOption
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
          {user.isInstructor && (
            <SettingsOption
              title="Instructor Portal"
              onPress={() => navigation.navigate('Classes')}
            />
          )}
          <SettingsOption
            title="Leave Feedback"
            onPress={() => navigation.navigate('Feedback')}
            roundedBottom={true}
          />
        </View>

        <Modal visible={visible} onDismiss={hideModal}>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: DIMENSIONS.cornerCurve,
              margin: 20,
            }}
          >
            <Text style={{ fontSize: FONTSIZES.medium, fontWeight: 'bold' }}>
              Disclaimer: Paying for classes is only required for Northeastern
              Boston campus recreation classes. Other campuses have classes free
              of charge due to smaller programs. Users need to make sure they
              have paid the recreation fee in addition to the classes fee in
              order for the classes fee to take effect. Expect a period of
              around 24 hours between paying for classes and being able to
              register for paid classes.{'\n\n'}
              Payment is by semester and is non-refundable under normal
              circumstances.
            </Text>
            <Button
              style={[styles.button, {marginTop: 20}]}
              onPress={() =>
                Linking.openURL(
                  'https://commerce.cashnet.com/MARINOCENTER?itemcode=SFMC-AERO'
                ).catch((err) => console.error("Couldn't load page", err))
              }
            >
              <Text style={[styles.paymentText, { fontSize: FONTSIZES.small }]}>
                Pay for Classes
              </Text>
            </Button>
          </View>
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
  header: {
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    borderRadius: DIMENSIONS.cornerCurve,
  },
  classesAttendedContainer: {
    marginVertical: isTablet ? 30 : 20,
    padding: isTablet ? 30 : 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    borderRadius: DIMENSIONS.cornerCurve,
  },
  classesAttendedTextContainer: {
    flexDirection: 'column',
  },
  classesAttendedText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: FONTSIZES.medium,
    marginBottom: 10,
  },
  dateText: {
    color: COLORS.black,
    fontSize: FONTSIZES.small,
    fontWeight: 'bold',
  },
  classesAttendedNumberContainer: {
    borderColor: COLORS.black,
    borderWidth: 6,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  classesAttendedNumber: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONTSIZES.large,
  },
  paymentText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONTSIZES.medium,
  },
  userText: {
    color: COLORS.black,
    fontSize: FONTSIZES.large,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingLeft: 10,
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    borderTopLeftRadius: DIMENSIONS.cornerCurve,
    borderTopRightRadius: DIMENSIONS.cornerCurve,
  },
  button: {
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: DIMENSIONS.cornerCurve,
    marginBottom: isTablet ? 30 : 20,
  },
});

export default ProfileScreen;
