import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import i18n from "../utils/i18n";

const { width } = Dimensions.get("window");

const MoreScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: "archive",
      title: i18n.t("more.archive"),
      onPress: () =>
        navigation.reset({ index: 0, routes: [{ name: "CardArchive" }] }),
    },
    {
      id: "privacy",
      title: i18n.t("more.privacy"),
      onPress: () =>
        navigation.reset({ index: 0, routes: [{ name: "PrivacyPolicy" }] }),
    },
    {
      id: "contact",
      title: i18n.t("more.contact"),
      onPress: () =>
        navigation.reset({ index: 0, routes: [{ name: "ContactDeveloper" }] }),
    },
  ];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Home");
    }
  };

  return (
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
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
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
          {i18n.t("more.title")}
        </Text>
        <View style={[commonStyles.infoButton, { zIndex: 2 }]} />
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.menuText}>{item.title}</Text>
            <Image
              source={require("../../assets/back-icon.png")}
              style={styles.arrowIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 앱 버전 정보 */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{i18n.t("more.version")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F3FA",
  },
  placeholderButton: {
    width: 36, // info 버튼과 동일한 크기 (20px 아이콘 + 8px 패딩 * 2)
    height: 36,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  arrowIcon: {
    width: 16,
    height: 16,
    transform: [{ rotate: "180deg" }],
  },
  versionContainer: {
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 20,
  },
  versionText: {
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.7,
  },
});

export default MoreScreen;
