import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { settingsStyles } from "../Styles/settingsStyles";
import LanguageChanger from "../Components/LanguageChanger";
import { useTranslation } from "react-i18next"; // Import useTranslation

const SettingsPage = ({ navigation }) => {
  const { t } = useTranslation("global"); // Initialize translation

  return (
    <View style={settingsStyles.container}>
      <Text style={settingsStyles.title}>{t("settings_title")}</Text>

      <LanguageChanger />

      <TouchableOpacity
        style={settingsStyles.button}
        onPress={() => navigation.navigate("EditPin")}
      >
        <Text style={settingsStyles.buttonText}>{t("change_pin")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsPage;
