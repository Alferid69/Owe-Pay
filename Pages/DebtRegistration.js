import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as SecureStore from "expo-secure-store";
import * as Sharing from "expo-sharing";
import { useTranslation } from "react-i18next";
import { styles } from "../Styles/styles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import PinConfirmation from "../Components/PinConfirmation";
import LockScreen from "./LockScreen";
import SetupLockScreen from "./SetupLockScreen";

const DebtRegistration = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [debtors, setDebtors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [isPinSet, setIsPinSet] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();
  const { t } = useTranslation("global");

  useEffect(() => {
    const checkPin = async () => {
      const storedPin = await SecureStore.getItemAsync("userPin");
      setIsPinSet(!!storedPin);
    };

    checkPin();
  }, []);

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
    const unsubscribe = navigation.addListener("focus", () => {
      loadDebtors();
    });

    loadDebtors(); // Fetch debts when the component mounts for the first time

    return unsubscribe;
  }, [navigation]);

  if (!isPinSet) {
    return <SetupLockScreen onSetPin={() => setIsPinSet(true)} />;
  }

  if (!isUnlocked) {
    return <LockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

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


  const confirmReset = async () => {
    await AsyncStorage.removeItem("debtors");
    setDebtors([]); // Assuming you have a setDebtors function to clear state
    Alert.alert("Success", t('resetSuccessMessage'));
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
            <h1>${t("pdfTitle")}</h1>
            <table>
              <tr>
                <th>${t("nameColumn")}</th>
                <th>${t("amountColumn")}</th>
                <th>${t("reasonColumn")}</th>
                <th>${t("dateColumn")}</th>
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

      const { uri } = await Print.printToFileAsync({ html });
      const fileUri = `${
        FileSystem.documentDirectory
      }debts_report_${new Date().toISOString()}.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(t("noSharing"));
      }
    } catch (error) {
      console.error(t("error_exporting_pdf"), error);
    }
  };

  const handleExportClick = () => {
    const allDebts = Object.keys(debtors).map((name) => ({
      name,
      debts: debtors[name].debts,
    }));
    exportDataToPdf(allDebts);
  };

  // const resetDept = () => {
  //   Alert.prompt(
  //     t("enterPin"), // Title of the prompt
  //     t("confirmReset"), // Message to show in the prompt
  //     [
  //       {
  //         text: t("cancelReset"),
  //         style: "cancel",
  //       },
  //       {
  //         text: t("confirmResetYes"),
  //         onPress: async (enteredPin) => {
  //           try {
  //             const storedPin = await SecureStore.getItemAsync("userPin");

  //             if (enteredPin === storedPin) {
  //               // If PIN matches, reset debts
  //               await AsyncStorage.removeItem("debtors");
  //               setDebtors([]);
  //               Alert.alert(t("success"), t("resetSuccessMessage"));
  //             } else {
  //               // If PIN does not match, show error
  //               Alert.alert(t("error"), t("incorrectPinMessage"));
  //             }
  //           } catch (error) {
  //             Alert.alert(t("error"), t("somethingWentWrong"));
  //           }
  //         },
  //       },
  //     ],
  //     "secure-text" // Input type for the prompt
  //   );
  // };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
  };

  const filteredDebtors = Object.keys(debtors).filter((debtorName) =>
    debtorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {!isModalVisible && (
        <ScrollView>
          <View style={styles.containerBase}>
            <View style={styles.header}>
              <Text style={styles.title}>{t("title")}</Text>
              <View style={styles.setting}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                >
                  <FontAwesome name="gear" size={35} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.registerContainer}>
              <TextInput
                placeholder={t("placeholderName")}
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder={t("placeholderAmount")}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder={t("placeholderReason")}
                value={reason}
                onChangeText={setReason}
                style={styles.input}
              />
              <TouchableOpacity
                style={[styles.buttonBase, styles.registerButton]}
                onPress={registerDebt}
              >
                <Text style={styles.buttonText}>{t("registerButton")}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.soldItemsContainer}>
              <Text style={styles.label}>{t("debtorsLabel")}</Text>
              <View style={styles2.searchContainer}>
                <TextInput
                  placeholder={t("searchPlaceholder")}
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
                          {totalDebt > 0
                            ? t("individualLabelPositive")
                            : t("individualLabelNegative")}
                          : {totalDebt}
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
                ? t("totalLabelPositive")
                : t("totalLabelNegative")}
              : {getTotalOwedByAll()} ETB
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.buttonBase, styles.pdfButton]}
              onPress={handleExportClick}
            >
              <Text style={styles.exportButtonText}>{t("exportToPdf")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonBase, styles.resetButton]}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.exportButtonText}>{t("resetDebts")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      {isModalVisible && (
        <PinConfirmation
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onConfirm={confirmReset}
        />
      )}
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
