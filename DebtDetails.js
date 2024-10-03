import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

const DebtDetails = ({ route }) => {
  const { name, debts } = route.params; // Retrieve name and debts from navigation params
  const navigation = useNavigation();

  const handleEdit = (debt) => {
    // Navigate to Edit screen with the selected debt details
    navigation.navigate("EditDebt", {
      debt: { date: debt.date, amount: debt.amount, reason: debt.reason }, // Passing the debt object
      name: name, // Include the debtor's name as well
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{name}'s Debt Details:</Text>
        <FlatList
          data={debts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.debtItem}>
              <View>
                <Text
                  style={item.amount === 0 ? styles.paidText : item.amount > 0 ? styles.amountText : styles.debtText}
                >
                  Amount: {item.amount.toFixed(2)} ETB
                </Text>
                <Text style={styles.reasonText}>Reason: {item.reason}</Text>
                <Text style={styles.dateText}>Date: {item.date}</Text>
              </View>

              {item.amount !== 0 ? (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(item)} // Call handleEdit with the current debt
                  >
                    <FontAwesome name="edit" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => Alert.alert("ይህ እዳ ተከፍሏል።")}
                  >
                    <FontAwesome name="info-circle" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContainer} // Add padding to the list
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa", // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Dark text color
    textAlign: "center",
  },
  debtItem: {
    backgroundColor: "#fff", // White background for debt items
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  dateText: {
    fontSize: 16,
    color: "#555", // Gray for date
  },
  amountText: {
    fontSize: 16,
    color: "#28a745", // Green for amount
    fontWeight: "bold",
  },
  debtText: {
    fontSize: 16,
    color: "red", // Green for amount
    fontWeight: "bold",
  },
  paidText: {
    fontSize: 16,
    color: "#0dcaf0", // Green for amount
    fontWeight: "bold",
  },
  reasonText: {
    fontSize: 16,
    color: "#007bff", // Blue for reason
  },
  listContainer: {
    paddingBottom: 20, // Extra padding at the bottom
  },
  editButton: {
    backgroundColor: "#0d6efd", // Yellow for "Edit"
    borderRadius: 50,
    padding: 10,
    marginLeft: 8, // Space between buttons
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#0dcaf0", // Green for "Detail"
    borderRadius: 5,
    padding: 10,
    marginLeft: 8, // Space between buttons
  },
});

export default DebtDetails;
