import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { modalStyles } from "../Styles/modalStyles"; // Add your styles here

const PinConfirmation = ({ visible, onClose, onConfirm }) => {
  const { t } = useTranslation('global');
  const [enteredPin, setEnteredPin] = useState("");

  useEffect(() => {
    if (visible) {
      // Prompt biometric authentication when modal is shown
      authenticateWithBiometrics();
    }
  }, [visible]);

  const authenticateWithBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate",
        });

        if (result.success) {
          Alert.alert("Success", "Authenticated with biometrics");
          onConfirm(); // Call the onConfirm function if biometric authentication is successful
          onClose(); // Close the modal
        }
      } else {
        Alert.alert("Biometrics not available", "Please use PIN instead.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong with biometric authentication.");
    }
  };

  const handleConfirm = async () => {
    try {
      const storedPin = await SecureStore.getItemAsync("userPin");

      if (enteredPin === storedPin) {
        onConfirm(); // Reset debts
        onClose(); // Close the modal
      } else {
        Alert.alert(t("error"), t("incorrectPinMessage"));
      }
    } catch (error) {
      Alert.alert(t("error"), t("somethingWentWrong"));
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.title}>{t("enterPin")}</Text>
          <TextInput
            placeholder={t("pin_input_placeholder")}
            secureTextEntry
            keyboardType="numeric"
            style={modalStyles.input}
            value={enteredPin}
            onChangeText={setEnteredPin}
          />
          <View style={modalStyles.buttonsContainer}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
              <Text style={modalStyles.cancelButtonText}>{t("cancelReset")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.confirmButton} onPress={handleConfirm}>
              <Text style={modalStyles.confirmButtonText}>{t("confirmResetYes")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PinConfirmation;
