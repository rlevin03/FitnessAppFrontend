const ReservationScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <Appbar.Header style={styles.header} mode="small">
        <Appbar.Action
          icon={() => (
            <Image
              source={require("C:/Users/blevi/OneDrive/Documents/Desktop/Co-op/RecreationApp/assets/Northeastern_Universitylogo_square.webp")}
              style={{ width: 45, height: 45, marginLeft: -10, marginTop: -10 }}
            />
          )}
          onPress={() => {}}
        />
        <Appbar.Action
          icon="account-circle-outline"
          onPress={() => navigation.openDrawer()}
        />
      </Appbar.Header>
    </PaperProvider>
  );
};

export default ReservationScreen;