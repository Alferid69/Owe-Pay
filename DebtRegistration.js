import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DebtRegistration = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [debtors, setDebtors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  const navigation = useNavigation();

  const loadDebtors = async () => {
    try {
      const storedDebtors = await AsyncStorage.getItem("debtors");
      if (storedDebtors) {
        setDebtors(JSON.parse(storedDebtors));
      }
    } catch (error) {
      console.log("Error loading debtors", error);
    }
  };

  useEffect(() => {
    // Call loadDebtors when the screen is focused
    const unsubscribe = navigation.addListener("focus", () => {
      loadDebtors(); // Fetch debts whenever the screen is focused
    });

    loadDebtors(); // Fetch debts when the component mounts for the first time

    return unsubscribe; // Clean up the listener on unmount
  }, [navigation]);

  const registerDebt = async () => {
    if (name && amount && reason) {
      const date = new Date().toString();
      const newDebt = { date, amount: parseFloat(amount), reason };
      const updatedDebtors = { ...debtors };

      // Check if debtor already exists
      if (updatedDebtors[name]) {
        updatedDebtors[name].debts.push(newDebt);
      } else {
        updatedDebtors[name] = { debts: [newDebt] };
      }

      // Save updated data in AsyncStorage
      await AsyncStorage.setItem("debtors", JSON.stringify(updatedDebtors));
      setDebtors(updatedDebtors);
      setName("");
      setAmount("");
      setReason("");
    }
  };

  const handleDetails = (name) => {
    const debtorDebts = debtors[name].debts;
    navigation.navigate("DebtDetails", { name, debts: debtorDebts });
  };

  const getTotalOwedByAll = () => {
    return Object.keys(debtors).reduce((total, debtorName) => {
      const totalDebt = debtors[debtorName].debts.reduce(
        (sum, debt) => sum + debt.amount,
        0
      );
      return total + totalDebt;
    }, 0);
  };

  // Function to export data to PDF
  const exportDataToPdf = async (data) => {
    try {
      const html = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                padding: 10px;
                text-align: left;
                border: 1px solid black;
              }
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              body {
                padding: 20px;
              }
              h1 {
                font-family: Arial, sans-serif;
                text-align: center;
                color: #333;
              }
            </style>
          </head>
          <body>
            <h1>የእዳይ ዝርዝር</h1>
            <table>
              <tr>
                <th>ስም</th>
                <th>ብዛት</th>
                <th>ምክንያት</th>
                <th>ቀን</th>
              </tr>
              ${data
                .map(({ name, debts }) =>
                  debts
                    .map(
                      ({ date, amount, reason }) => `
                  <tr>
                    <td>${name}</td>
                    <td>${amount}</td>
                    <td>${reason}</td>
                    <td>${date}</td>
                  </tr>
                  `
                    )
                    .join("")
                )
                .join("")}
            </table>
          </body>
        </html>
      `;

      // Generate the PDF from HTML
      const { uri } = await Print.printToFileAsync({ html });

      // Move the file to the documents directory for sharing
      const fileUri = `${
        FileSystem.documentDirectory
      }debts_report_${new Date().toISOString()}.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  // Function to handle exporting all debts
  const handleExportClick = () => {
    const allDebts = Object.keys(debtors).map((name) => ({
      name,
      debts: debtors[name].debts,
    }));
    exportDataToPdf(allDebts);
  };

  const resetDept = () => {
    Alert.alert(
      "Confirm",
      "ከማጥፋቶ በፊት ወደ PDF መቀየር አይርሱ። ሙሉ መረጃ የሚጠፋ ይሆናል። እርግጠኛ ኖት? !",
      [
        { text: "ይቅር አይጥፋ።", style: "cancel" },
        {
          text: "አዎ ይጥፋ!",
          onPress: async () => {
            await AsyncStorage.removeItem("debtors");
            // await AsyncStorage.clear();
            setDebtors([]);
          },
        },
      ]
    );
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
  };

  const filteredDebtors = Object.keys(debtors).filter((debtorName) =>
    debtorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ScrollView>
        <View style={styles.containerBase}>
          <View style={styles.header}>
            <Text style={styles.title}>እዳ መመዝገቢያ</Text>
          </View>
          <View style={styles.registerContainer}>
            <TextInput
              placeholder="ባለ እዳ ስም"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="የገንዘብ መጠን"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="የብድር ምክንያት"
              value={reason}
              onChangeText={setReason}
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.buttonBase, styles.registerButton]}
              onPress={registerDebt}
            >
              <Text style={styles.buttonText}>እዳ መዝግብ</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.soldItemsContainer}>
            {/* Search Section */}
            <Text style={styles.label}>የተመዘገቡ ባለ እዳዎች</Text>
            <View style={styles2.searchContainer}>
              <TextInput
                placeholder="ባለ እዳ ስም ፈልግ"
                value={searchTerm}
                onChangeText={handleSearchChange}
                style={styles.input}
              />
            </View>

            <FlatList
              data={filteredDebtors}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const totalDebt = debtors[item].debts.reduce(
                  (sum, debt) => sum + debt.amount,
                  0
                );
                return (
                  <View style={styles2.container}>
                    <View>
                      <Text style={styles2.debtorText}>{item}</Text>
                      <Text
                        style={
                          totalDebt > 0
                            ? styles2.totalDebtText
                            : styles2.debtText
                        }
                      >
                        {totalDebt > 0 ? "ያለበት/ባት ብር" : "ያለብህ/ብሽ ብር"}:{" "}
                        {totalDebt}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={styles2.button}
                        onPress={() => handleDetails(item)}
                      >
                        <FontAwesome
                          name="info-circle"
                          size={20}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <View style={styles.summary}>
          <Text
            style={
              getTotalOwedByAll() >= 0
                ? styles.summaryText
                : styles2.summaryDebtText
            }
          >
            {getTotalOwedByAll() >= 0
              ? "ሰው ጋር ያለህ/ሽ አጠቃላይ ብር"
              : "ሰው ላይ ያለብህ/ሽ አጠቃላይ ብር"}
            : {getTotalOwedByAll()} ETB
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.buttonBase, styles.pdfButton]}
            onPress={handleExportClick}
          >
            <Text style={styles.exportButtonText}>ወደ PDF ቀይር</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonBase, styles.resetButton]}
            onPress={resetDept}
          >
            <Text style={styles.resetButtonText}>ሙሉ እዳ አጥፋ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles2 = {
  container: {
    backgroundColor: "#f8f9fa", // Light background
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    flexDirection: "row", // Align children horizontally
    justifyContent: "space-between", // Space between items
    alignItems: "center", // Center align items vertically
  },
  debtorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Dark text color
  },
  searchContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  totalDebtText: {
    fontSize: 16,
    color: "#007bff", // Blue for total debt
    marginRight: 16, // Space between debt amount and icons
  },
  debtText: {
    fontSize: 16,
    color: "red", // Blue for total debt
    marginRight: 16, // Space between debt amount and icons
  },
  button: {
    backgroundColor: "#0dcaf0", // Green for "Detail"
    borderRadius: 5,
    padding: 10,
    marginLeft: 8, // Space between buttons
  },
  summaryDebtText: {
    fontSize: 16,
    fontWeight: "600",
    color: "red",
    marginBottom: 8,
  },
};

export default DebtRegistration;
