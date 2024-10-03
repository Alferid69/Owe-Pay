import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

import { useState } from "react";
import { Alert, Button, Text, TextInput, View, StyleSheet } from "react-native";

const EditDebt = ({ route, navigation }) => {
  const { debt, name } = route.params;

  // Validate that debt exists
  if (!debt) {
    Alert.alert("Error", "Debt information is missing.");
    navigation.goBack(); // Navigate back if debt info is missing
    return null; // Prevent rendering further
  }

  const [amount, setAmount] = useState(debt.amount?.toString() || ""); // Fallback to empty string
  const [reason, setReason] = useState(debt.reason || ""); // Fallback to empty string

  const handleSave = async () => {
    try {
      const storedDebtors = await AsyncStorage.getItem("debtors");
      const debtors = storedDebtors ? JSON.parse(storedDebtors) : {};

      // Check if debtor exists and update the specific debt entry
      if (debtors[name]) {
        const debtIndex = debtors[name].debts.findIndex(
          (d) => d.date === debt.date // Match by date or any unique property
        );
        if (debtIndex !== -1) {
          // Update the debt entry
          debtors[name].debts[debtIndex] = {
            ...debtors[name].debts[debtIndex],
            amount: parseFloat(amount),
            reason: reason,
          };
          await AsyncStorage.setItem("debtors", JSON.stringify(debtors));
          Alert.alert("Success", "Debt entry updated successfully.");

          // Pass the updated debt back to the previous screen
          navigation.navigate("DebtDetails", {
            name,
            debts: debtors[name].debts, // Updated debts list
          });
        } else {
          Alert.alert("Error", "Debt entry not found.");
        }
      } else {
        Alert.alert("Error", "Debtor not found.");
      }
    } catch (error) {
      console.log("Error updating debt:", error);
      Alert.alert("Error", "Failed to update debt. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edit Debt Entry</Text>
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Reason"
        value={reason}
        onChangeText={setReason}
        style={styles.input}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});

export default EditDebt;
