import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PayDebt = ({ route, navigation }) => {
  const { debt, name } = route.params; // Get the debt and debtor's name from navigation params
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePayDebt = async () => {
    const amountToPay = parseFloat(paymentAmount);
    if (isNaN(amountToPay) || amountToPay <= 0) {
      Alert.alert("Invalid Payment", "Please enter a valid payment amount.");
      return;
    }

    try {
      const storedDebtors = await AsyncStorage.getItem("debtors");
      const debtors = storedDebtors ? JSON.parse(storedDebtors) : {};

      if (debtors[name]) {
        const debtIndex = debtors[name].debts.findIndex(
          (d) => d.date === debt.date
        );

        if (debtIndex !== -1) {
          const remainingDebt = debt.amount - amountToPay;
          debtors[name].debts[debtIndex] = {
            ...debtors[name].debts[debtIndex],
            amount: remainingDebt > 0 ? remainingDebt : 0, // Update debt amount
          };

          await AsyncStorage.setItem("debtors", JSON.stringify(debtors));

          Alert.alert(
            "Payment Successful",
            `You have paid ${amountToPay.toFixed(2)} ETB.`
          );

          navigation.goBack(); // Go back to the debt details screen
        }
      }
    } catch (error) {
      console.log("Error updating debt:", error);
      Alert.alert("Error", "Failed to process payment. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay Debt for {name}</Text>
      <Text style={styles.debtInfo}>
        Current Debt: {debt.amount.toFixed(2)} ETB
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter payment amount"
        value={paymentAmount}
        onChangeText={setPaymentAmount}
        keyboardType="numeric"
      />
      <Button title="Pay Debt" onPress={handlePayDebt} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  debtInfo: {
    fontSize: 18,
    marginBottom: 20,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default PayDebt;
