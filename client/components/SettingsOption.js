import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, DIMENSIONS, FONTSIZES } from './Constants';

const SettingsOption = ({ title, onPress, roundedBottom, roundedTop }) => {
  return (
    <View>
      <View style={styles.divider} />
      <TouchableRipple
        onPress={onPress}
        style={[
          styles.container,
          roundedBottom && styles.roundedBottomWrapper,
          roundedTop && styles.roundedTopWrapper,
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.text}>{title}</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={COLORS.white}
          />
        </View>
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  roundedBottomWrapper: {
    borderBottomLeftRadius: DIMENSIONS.cornerCurve,
    borderBottomRightRadius: DIMENSIONS.cornerCurve,
    overflow: 'hidden',
  },
  roundedTopWrapper: {
    borderTopLeftRadius: DIMENSIONS.cornerCurve,
    borderTopRightRadius: DIMENSIONS.cornerCurve,
    overflow: 'hidden',
  },
  container: {
    width: DIMENSIONS.componentWidth,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 15,
  },
  text: {
    fontSize: FONTSIZES.large,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  divider: {
    width: DIMENSIONS.componentWidth,
    height: 3,
    backgroundColor: COLORS.black,
    alignSelf: 'center',
  },
});

export default SettingsOption;
