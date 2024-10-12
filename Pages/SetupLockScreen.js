import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { setupLockStyles } from "../Styles/setupLockStyles";
import * as SecureStore from "expo-secure-store";

const SetupLockScreen = ({ onSetPin }) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleSetPin = async () => {
    if (pin === confirmPin) {
      await SecureStore.setItemAsync("userPin", pin);
      onSetPin(pin);
    } else {
      alert("PINs do not match");
    }
  };

  return (
    <View style={setupLockStyles.container}>
      <Text style={setupLockStyles.title}>Set Your PIN</Text>
      <View style={setupLockStyles.inputContainer}>
        <TextInput
          style={setupLockStyles.pinInput}
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={4}
          placeholder="pin"
          secureTextEntry
        />
      </View>
      <View style={setupLockStyles.inputContainer}>
        <TextInput
          style={setupLockStyles.pinInput}
          value={confirmPin}
          onChangeText={setConfirmPin}
          keyboardType="numeric"
          maxLength={4}
          placeholder="confirm pin"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={setupLockStyles.button} onPress={handleSetPin}>
        <Text style={setupLockStyles.buttonText}>Set PIN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetupLockScreen;
