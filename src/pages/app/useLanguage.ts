import { useState, useEffect } from "react";
import i18n from "../../i18n";

export const useLanguage = () => {
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return {
    language,
    handleLanguageChange,
  };
};