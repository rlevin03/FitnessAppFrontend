import { Appbar } from "react-native-paper";
import { COLORS, FONTSIZES } from "./Constants";
import { StyleSheet } from "react-native";

const Header = ({ navigation, title }) => {
  return (
    <Appbar.Header style={styles.header} mode="center-aligned">
      <Appbar.BackAction size={30} onPress={() => navigation.goBack()} />
      <Appbar.Content
        color={COLORS.white}
        titleStyle={{ // TODO: move to stylesheet
          fontWeight: "bold",
          fontSize: FONTSIZES.large,
          marginLeft: -5,
        }}
        title={title}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
  },
});

export default Header;
