import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  Icon,
  PaperProvider,
  Text,
  TouchableRipple,
  ActivityIndicator,
} from 'react-native-paper';
import { COLORS, DIMENSIONS, FONTSIZES } from '../../components/Constants';
import Header from '../../components/Header';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const AttendanceScreen = ({ navigation, route }) => {
  const { classData } = route.params;
  const [userData, setUserData] = useState([]);
  const [present, setPresent] = useState([]);
  const [absent, setAbsent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedClassData, setUpdatedClassData] = useState(classData);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/users/signees', {
        params: { classId: updatedClassData._id },
      });
      setUserData(response.data);
      setAbsent(response.data.map((user) => user._id)); // Default all users to absent
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [updatedClassData._id]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const handleSubmitAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/classes/attendance', {
        present,
        absent,
        classId: updatedClassData._id,
      });
      // Update class data with the new attendance state
      setUpdatedClassData(response.data.classData);
    } catch (error) {
      console.error('Error submitting attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (userId) => {
    setPresent((prevPresent) => {
      if (prevPresent.includes(userId)) {
        setAbsent((prevAbsent) => [...prevAbsent, userId]);
        return prevPresent.filter((id) => id !== userId);
      } else {
        setAbsent((prevAbsent) => prevAbsent.filter((id) => id !== userId));
        return [...prevPresent, userId];
      }
    });
  };

  const renderSignee = ({ item }) => {
    const isAbsent = absent.includes(item._id);

    return updatedClassData.attendanceTaken ? (
      <View style={styles.checkbox}>
        {item.totalReservations.includes(updatedClassData._id) ? (
          <Icon source="checkbox-marked" color={COLORS.secondary} size={24} />
        ) : (
          <Icon
            source="checkbox-blank-outline"
            color={COLORS.black}
            size={24}
          />
        )}
        <View style={styles.checkboxText}>
          <Text
            style={[styles.text, { flex: 1, flexShrink: 1, marginRight: 10 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text style={styles.text}>{item.email}</Text>
        </View>
      </View>
    ) : (
      <TouchableRipple onPress={() => markAttendance(item._id)}>
        <View style={styles.checkbox}>
          {isAbsent ? (
            <Icon
              source="checkbox-blank-outline"
              color={COLORS.black}
              size={24}
            />
          ) : (
            <Icon source="checkbox-marked" color={COLORS.secondary} size={24} />
          )}
          <View style={styles.checkboxText}>
            <Text
              style={[styles.text, { flex: 1, flexShrink: 1, marginRight: 10 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableRipple>
    );
  };

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
        <Header navigation={navigation} title="Attendance" backButton={true} />
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <FlatList
            data={userData}
            keyExtractor={(item) => item._id}
            renderItem={renderSignee}
          />
        )}
        <View style={{ flex: 1 }} />
        {!updatedClassData.attendanceTaken &&
          updatedClassData.usersSignedUp.length > 0 && (
            <TouchableRipple
              mode="contained"
              onPress={handleSubmitAttendance}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Submit Attendance</Text>
            </TouchableRipple>
          )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  checkboxText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  checkbox: {
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: DIMENSIONS.cornerCurve,
  },
  text: {
    color: COLORS.white,
    fontSize: FONTSIZES.small,
  },
  button: {
    width: DIMENSIONS.componentWidth,
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: DIMENSIONS.cornerCurve,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: FONTSIZES.medium,
    color: COLORS.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AttendanceScreen;
