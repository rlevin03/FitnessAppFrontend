import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./StackNavigator";
import axios from "axios";

// axios.defaults.baseURL = "http://10.110.208.57";

export default function App() {
  return (
    <>
      <StackNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
