import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../Styles/styles";

const LanguageChanger = () => {
  const { i18n, t } = useTranslation('global'); 
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language); // Initialize with the current language

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng); // Update the state with the new language
  };

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng); // Sync the state when the language changes
    };

    i18n.on("languageChanged", handleLanguageChange);

    // Cleanup listener on component unmount
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  return (
    <View style={styles.lang}>
      <Text style={styles.buttonText}>{t("languageChanger.title")}</Text>

      <Picker
        selectedValue={currentLanguage}
        onValueChange={(value) => changeLanguage(value)}
        style={styles.picker}
      >
        <Picker.Item label={t("languageChanger.english")} value="en" />
        <Picker.Item label={t("languageChanger.amharic")} value="am" />
      </Picker>
    </View>
  );
};

export default LanguageChanger;
