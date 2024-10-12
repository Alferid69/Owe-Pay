import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { editPinStyles } from "../Styles/editPinStyles";
import * as SecureStore from "expo-secure-store";
import { useTranslation } from "react-i18next"; // Import useTranslation

const EditPin = ({ navigation }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const { t } = useTranslation('global'); // Initialize translation

  const handleSave = async () => {
    if (currentPin && newPin && confirmPin) {
      if (newPin !== confirmPin) {
        Alert.alert(t('edit_pin_title'), t('pin_mismatch_error'));
        return;
      }

      try {
        const currentStoredPin = await SecureStore.getItemAsync("userPin");
        if (currentPin === currentStoredPin) {
          await SecureStore.setItemAsync("userPin", newPin);
          Alert.alert(t('edit_pin_title'), t('success_message'));
          navigation.navigate("DebtRegistration");
        } else {
          Alert.alert(t('edit_pin_title'), t('current_pin_error'));
        }
      } catch (error) {
        Alert.alert(t('edit_pin_title'), t('generic_error_message'));
      }
    }
  };

  return (
    <View style={editPinStyles.container}>
      <Text style={editPinStyles.title}>{t('edit_pin_title')}</Text>
      <TextInput
        placeholder={t('enter_current_pin')}
        value={currentPin}
        onChangeText={setCurrentPin}
        secureTextEntry
        style={editPinStyles.input}
        keyboardType="numeric"
        maxLength={8}
      />
      <TextInput
        placeholder={t('enter_new_pin')}
        value={newPin}
        onChangeText={setNewPin}
        secureTextEntry
        style={editPinStyles.input}
        keyboardType="numeric"
        maxLength={4}
      />
      <TextInput
        placeholder={t('confirm_new_pin')}
        value={confirmPin}
        onChangeText={setConfirmPin}
        secureTextEntry
        style={editPinStyles.input}
        keyboardType="numeric"
        maxLength={4}
      />
      <TouchableOpacity style={editPinStyles.saveButton} onPress={handleSave}>
        <Text style={editPinStyles.saveButtonText}>{t('save_new_pin')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditPin;
