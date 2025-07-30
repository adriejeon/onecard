import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredLanguage,
  setLanguage as setLanguageUtil,
  initializeLanguage,
} from "../utils/i18n";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("ko");

  useEffect(() => {
    // 앱 시작 시 언어 초기화 및 저장된 언어 로드
    initializeAppLanguage();

    // 전역 언어 변경 콜백 설정
    global.languageChangeCallback = (language) => {
      setCurrentLanguage(language);
    };

    // 컴포넌트 언마운트 시 콜백 제거
    return () => {
      global.languageChangeCallback = null;
    };
  }, []);

  const initializeAppLanguage = async () => {
    try {
      // 언어 초기화 실행
      await initializeLanguage();

      // 저장된 언어 설정 확인
      const storedLanguage = await getStoredLanguage();
      if (storedLanguage) {
        setCurrentLanguage(storedLanguage);
      }
    } catch (error) {
      console.error("언어 초기화 실패:", error);
    }
  };

  const changeLanguage = async (language) => {
    await setLanguageUtil(language);
    setCurrentLanguage(language);
  };

  const value = {
    currentLanguage,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
