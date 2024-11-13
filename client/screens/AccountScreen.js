import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Button,
  PaperProvider,
  Text,
  Modal,
  Portal,
  RadioButton,
} from 'react-native-paper';
import Header from '../components/Header';
import {
  CAMPUSES,
  COLORS,
  DIMENSIONS,
  FONTSIZES,
} from '../components/Constants';
import { UserContext } from '../../UserContext';
import axios from 'axios';

const AccountScreen = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(user.location || '');

  const toggleModal = () => setVisible(!visible);

  const handleChangeCampus = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/users/update-campus', {
        email: user.email,
        location: selectedCampus,
      });
      setUser({ ...user, location: selectedCampus });
      setVisible(false);
    } catch (error) {
      console.error(error);
      alert('Failed to update campus');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete('/auth/delete-account', {
                data: { email: user.email },
              });
              navigation.navigate('Login');
            } catch (error) {
              console.error(error);
              alert('Failed to delete account');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Account" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.accountInfo}>
            <Text style={[styles.textMediumBold, { paddingBottom: 30 }]}>
              Manage Account Settings
            </Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Text style={[styles.textMediumBold, { fontWeight: '100' }]}>
                Name:{' '}
              </Text>
              <Text style={styles.textMediumBold}>{user.name || ''} </Text>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Text style={[styles.textMediumBold, { fontWeight: '100' }]}>
                Email:{' '}
              </Text>
              <Text style={styles.textMediumBold}>{user.email || ''} </Text>
            </View>
          </View>
          <Button
            mode="contained"
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Change Password')}
          >
            <Text style={styles.textLargeBold}>Change Password</Text>
          </Button>

          <View style={styles.spacer} />

          <Button
            mode="contained"
            style={[styles.settingsButton, { marginBottom: 30 }]}
            onPress={handleAccountDelete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={[styles.textLargeBold, { color: COLORS.black }]}>
                Delete Account
              </Text>
            )}
          </Button>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  accountInfo: {
    backgroundColor: COLORS.tertiary,
    padding: 20,
    borderRadius: DIMENSIONS.cornerCurve,
    marginVertical: 20,
    marginBottom: 30,
    alignContent: 'center',
    justifyContent: 'center',
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
  },
  textMediumBold: {
    fontSize: FONTSIZES.medium,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  textLargeBold: {
    fontSize: FONTSIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    padding: 15,
    marginBottom: 5,
  },
  settingsButton: {
    backgroundColor: COLORS.primary,
    width: DIMENSIONS.componentWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: DIMENSIONS.cornerCurve,
    marginTop: 20,
  },
  spacer: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: FONTSIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AccountScreen;
