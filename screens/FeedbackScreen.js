import { PaperProvider } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Header } from "../components/Header";
import { COLORS } from "../components/Constants";

const FeedbackScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header navigation={navigation} title="Feedback" />
      </View>
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});

export default FeedbackScreen;
