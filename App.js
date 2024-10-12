import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { I18nextProvider } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";

import Footer from "./Components/Footer";
import i18n from "./i18n";
import DebtDetails from "./Pages/DebtDetails";
import DebtRegistration from "./Pages/DebtRegistration";
import EditDebt from "./Pages/EditDebt";
import EditPin from "./Pages/EditPin";
import LockScreen from "./Pages/LockScreen";
import SettingsPage from "./Pages/SettingsPage";
import SetupLockScreen from "./Pages/SetupLockScreen";

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <View style={styles.container}>
            <Stack.Navigator initialRouteName="DebtRegistration">
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
              <Stack.Screen name="Settings" component={SettingsPage} />
              <Stack.Screen name="EditDebt" component={EditDebt} />
              <Stack.Screen name="SetUpAppLock" component={SetupLockScreen} />
              <Stack.Screen name="UnlockApp" component={LockScreen} />
              <Stack.Screen name="EditPin" component={EditPin} />
            </Stack.Navigator>
            <Footer />
          </View>
        </NavigationContainer>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 45,
  },
});

export default App;
