import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import i18n from "../utils/i18n";
import { useLanguage } from "../contexts/LanguageContext";

const { width } = Dimensions.get("window");

const LanguageSelectionScreen = ({ navigation, route }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  const handleLanguageSelect = async (language) => {
    await changeLanguage(language);
    setIsVisible(false);

    // 언어 변경 후 이전 화면으로 돌아가되, 강제 리렌더링을 위해 약간의 지연 후 이동
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  const languageOptions = [
    {
      id: "ko",
      title: "한국어",
      subtitle: "Korean",
    },
    {
      id: "en",
      title: "English",
      subtitle: "영어",
    },
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8F3FA"
          translucent
        />

        {/* 상단 헤더 */}
        <View style={[commonStyles.header, { position: "relative" }]}>
          <TouchableOpacity
            style={[commonStyles.backButton, { zIndex: 2 }]}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/close-icon.png")}
              style={commonStyles.backIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
          <Text
            style={[
              commonStyles.headerTitle,
              { position: "absolute", left: 0, right: 0, top: 60, zIndex: 1 },
            ]}
          >
            {i18n.t("more.language")}
          </Text>
          <View style={[commonStyles.infoButton, { zIndex: 2 }]} />
        </View>

        {/* 언어 선택 리스트 */}
        <View style={styles.menuContainer}>
          {languageOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.menuItem}
              onPress={() => handleLanguageSelect(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>{option.title}</Text>
                <Text style={styles.menuSubtitle}>{option.subtitle}</Text>
              </View>
              {currentLanguage === option.id && (
                <Image
                  source={require("../../assets/check-icon.png")}
                  style={styles.checkIcon}
                  contentFit="contain"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F3FA",
  },
  menuContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.6,
    marginTop: 2,
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
});

export default LanguageSelectionScreen;
