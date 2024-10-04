import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DebtRegistration from "./DebtRegistration";
import DebtDetails from "./DebtDetails";
import EditDebt from "./EditDebt";
import { StyleSheet, View } from "react-native";
import Footer from "./Footer";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="DebtRegistration" screenOptions={{}}>
          <Stack.Screen
            name="DebtRegistration"
            component={DebtRegistration}
            options={{
              title: "እዳ መመዝገቢያ",
              headerShown: false,
              headerTitleStyle: {
                fontSize: 24, // Set your desired font size
                fontWeight: "bold", // Set font weight
                color: "#333", // Change text color
                textAlign: "center", // Center the title
              },
              headerStyle: {
                backgroundColor: "#f8f9fa", // Set background color of header
              },
            }}
          />
          <Stack.Screen name="DebtDetails" component={DebtDetails} />
          <Stack.Screen name="EditDebt" component={EditDebt} />
          {/* <Stack.Screen name="PayDebt" component={PayDebt} /> */}
        </Stack.Navigator>
        <Footer />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 45,
  },
});

export default App;
