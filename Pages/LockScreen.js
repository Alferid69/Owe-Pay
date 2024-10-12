import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { lockScreenStyles } from "../Styles/lockScreenStyles";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";

const LockScreen = ({ onUnlock }) => {
  const [inputPin, setInputPin] = useState("");
  const [error, setError] = useState("");
  const [correctPin, setCorrectPin] = useState("");
  const { t } = useTranslation("global"); // Initialize translation

  useEffect(() => {
    async function fetchPin() {
      const storedPin = await SecureStore.getItemAsync("userPin");
      setCorrectPin(storedPin);
    }
    fetchPin();

    // Cleanup the stored PIN
    return () => {
      setCorrectPin("");
    };
  }, []);

  useEffect(() => {
    // Prompt biometric authentication when modal is shown
    handleBiometricAuth();
  }, []);

  const handleUnlock = async () => {
    try {
      if (inputPin === correctPin) {
        onUnlock();
      } else {
        setError(t("incorrect_pin_message"));
      }
    } catch (error) {
      Alert.alert(t("generic_error_message"));
      console.error(error.message);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: t("authenticate_prompt"),
        });

        if (result.success) {
          onUnlock(); // Unlock the app if biometric authentication succeeds
        } else {
          setError(t("biometric_auth_failed"));
        }
      } else {
        Alert.alert(t("biometrics_not_available"), t("use_pin_instead"));
      }
    } catch (error) {
      Alert.alert(t("generic_error_message"));
      console.error(error.message);
    }
  };

  return (
    <View style={lockScreenStyles.container}>
      <Text style={lockScreenStyles.title}>{t("enter_pin_title")}</Text>
      <View style={lockScreenStyles.pinInputContainer}>
        <TextInput
          style={lockScreenStyles.pinInput}
          value={inputPin}
          onChangeText={setInputPin}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          placeholder={t("pin_input_placeholder")}
        />
      </View>
      {error ? (
        <Text style={lockScreenStyles.errorMessage}>{error}</Text>
      ) : null}
      <View style={lockScreenStyles.unlockMethods}>
        <TouchableOpacity
          style={lockScreenStyles.button}
          onPress={handleUnlock}
        >
          <Text style={lockScreenStyles.buttonText}>
            {t("unlock_button_text")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[lockScreenStyles.button, lockScreenStyles.biometricButton]}
          onPress={handleBiometricAuth}
        >
          <FontAwesomeIcon icon={faFingerprint} size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LockScreen;
