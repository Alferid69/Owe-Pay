import React, { useState, useEffect } from 'react';
import { Button, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../Styles/styles';

const LanguageChanger = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language); // Initialize with the current language

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng); // Update the state with the new language
  };

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng); // Sync the state when the language changes
    };

    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup listener on component unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <View style={styles.lang}>
      {currentLanguage === 'en' ? (
        <Button title="🇪🇹" onPress={() => changeLanguage('am')} />
      ) : (
        <Button title="🇬🇧" onPress={() => changeLanguage('en')} />
      )}
    </View>
  );
};

export default LanguageChanger;
