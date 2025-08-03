import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
  Share,
} from "react-native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import i18n from "../utils/i18n";
import { useLanguage } from "../contexts/LanguageContext";

const { width } = Dimensions.get("window");

const BackupRestoreScreen = ({ navigation }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const menuItems = [
    {
      id: "backup",
      title: i18n.t("backupRestore.backupData"),
      onPress: handleBackup,
    },
    {
      id: "restore",
      title: i18n.t("backupRestore.restoreData"),
      onPress: handleRestore,
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  async function handleBackup() {
    if (isBackingUp) return;

    setIsBackingUp(true);

    try {
      // 모든 AsyncStorage 데이터 가져오기
      const keys = await AsyncStorage.getAllKeys();

      // 앱 관련 키만 필터링 (시스템 키 제외)
      const appKeys = keys.filter(
        (key) =>
          key.startsWith("diary_") ||
          key.startsWith("dailyCard_") ||
          key.startsWith("cardArchive_")
      );

      const data = await AsyncStorage.multiGet(appKeys);

      // 백업 데이터 구성
      const backupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        data: Object.fromEntries(data),
      };

      const backupJson = JSON.stringify(backupData, null, 2);
      const today = new Date();
      // 한국 시간 기준으로 날짜 문자열 생성
      const koreanTime = new Date(today.getTime() + 9 * 60 * 60 * 1000); // UTC+9
      const year = koreanTime.getFullYear();
      const month = String(koreanTime.getMonth() + 1).padStart(2, "0");
      const day = String(koreanTime.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      const fileName = `tarot_diary_backup_${dateString}.json`;

      // 모든 플랫폼에서 파일로 저장
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, backupJson);

      if (Platform.OS === "ios") {
        // iOS에서는 파일을 Share API로 공유
        await Share.share({
          url: fileUri,
          title: fileName,
        });
      } else {
        // Android에서는 성공 메시지만 표시
        Alert.alert(
          i18n.t("backupRestore.backupSuccess"),
          i18n.t("backupRestore.backupSuccessMessage"),
          [{ text: i18n.t("common.ok") }]
        );
      }
    } catch (error) {
      Alert.alert(
        i18n.t("backupRestore.backupError"),
        i18n.t("backupRestore.backupErrorMessage"),
        [{ text: i18n.t("common.ok") }]
      );
    } finally {
      setIsBackingUp(false);
    }
  }

  async function handleRestore() {
    if (isRestoring) return;

    Alert.alert(
      i18n.t("backupRestore.restoreWarning"),
      i18n.t("backupRestore.restoreWarningMessage"),
      [
        { text: i18n.t("common.cancel"), style: "cancel" },
        {
          text: i18n.t("common.ok"),
          onPress: async () => {
            setIsRestoring(true);

            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true,
              });

              if (result.canceled) {
                return;
              }

              const fileContent = await FileSystem.readAsStringAsync(
                result.assets[0].uri
              );
              const backupData = JSON.parse(fileContent);

              // 데이터 유효성 검사
              if (!backupData.data || typeof backupData.data !== "object") {
                throw new Error("Invalid backup file format");
              }

              // 기존 앱 데이터 모두 삭제
              const currentKeys = await AsyncStorage.getAllKeys();
              const appKeysToRemove = currentKeys.filter(
                (key) =>
                  key.startsWith("diary_") ||
                  key.startsWith("dailyCard_") ||
                  key.startsWith("cardArchive_")
              );
              await AsyncStorage.multiRemove(appKeysToRemove);

              // 새 데이터 복원
              const entries = Object.entries(backupData.data);
              await AsyncStorage.multiSet(entries);

              Alert.alert(
                i18n.t("backupRestore.restoreSuccess"),
                i18n.t("backupRestore.restoreSuccessMessage"),
                [
                  {
                    text: i18n.t("common.ok"),
                    onPress: () => {
                      // 네비게이션 스택을 초기화하고 홈 화면으로 이동
                      navigation.reset({
                        index: 0,
                        routes: [
                          { name: "Home", params: { refreshData: true } },
                        ],
                      });
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert(
                i18n.t("backupRestore.restoreError"),
                i18n.t("backupRestore.restoreErrorMessage"),
                [{ text: i18n.t("common.ok") }]
              );
            } finally {
              setIsRestoring(false);
            }
          },
        },
      ]
    );
  }

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
          {i18n.t("backupRestore.title")}
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
            disabled={isBackingUp || isRestoring}
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

      {/* 정보 텍스트 */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{i18n.t("backupRestore.infoText")}</Text>
      </View>
    </View>
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
  menuText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    transform: [{ rotate: "180deg" }],
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default BackupRestoreScreen;
