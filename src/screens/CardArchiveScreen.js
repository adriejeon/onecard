import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import {
  getArchiveList,
  deleteCardResult,
  formatDate,
  truncateQuestion,
} from "../utils/cardArchiveUtils";
import i18n from "../utils/i18n";

const CardArchiveScreen = ({ navigation }) => {
  const [archiveList, setArchiveList] = useState([]);

  useEffect(() => {
    loadArchiveList();
  }, []);

  // 화면에 포커스될 때마다 리스트 새로고침
  useFocusEffect(
    React.useCallback(() => {
      loadArchiveList();
    }, [])
  );

  const loadArchiveList = async () => {
    const list = await getArchiveList();
    setArchiveList(list);
  };

  const handleCardPress = (archiveItem) => {
    if (archiveItem.cardType === "daily") {
      navigation.navigate("DailyResult", { cardData: archiveItem });
    } else if (archiveItem.cardType === "yesno") {
      navigation.navigate("Result", {
        question: archiveItem.question,
        result: archiveItem.result,
        cardType: "yesno",
        fromArchive: true,
        archiveId: archiveItem.id,
      });
    }
  };

  const handleDeleteCard = async (archiveItem) => {
    Alert.alert("카드 삭제", "이 카드 결과를 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const success = await deleteCardResult(archiveItem.id);
          if (success) {
            loadArchiveList(); // 목록 새로고침
          } else {
            Alert.alert("삭제 실패", "카드 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getCardTitle = (archiveItem) => {
    if (archiveItem.cardType === "daily") {
      return formatDate(archiveItem.timestamp);
    } else if (archiveItem.cardType === "yesno") {
      return truncateQuestion(archiveItem.question);
    }
    return "알 수 없는 카드";
  };

  const getCardSubtitle = (archiveItem) => {
    if (archiveItem.cardType === "daily") {
      return "데일리 카드";
    } else if (archiveItem.cardType === "yesno") {
      return "Yes or No 카드";
    }
    return "";
  };

  return (
    <ImageBackground
      source={require("../../assets/subBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* 상단 헤더 */}
      <View style={commonStyles.header}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
            style={commonStyles.backIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

        <Text style={commonStyles.headerTitle}>{i18n.t("more.archive")}</Text>

        <View style={commonStyles.infoButton} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {archiveList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>보관된 카드 결과가 없습니다.</Text>
            <Text style={styles.emptySubtext}>
              카드 결과 페이지에서 "보관하기" 버튼을 눌러{"\n"}
              결과를 보관함에 저장할 수 있습니다.
            </Text>
          </View>
        ) : (
          <View style={styles.archiveList}>
            {archiveList.map((archiveItem, index) => (
              <TouchableOpacity
                key={archiveItem.id}
                style={styles.archiveItem}
                onPress={() => handleCardPress(archiveItem)}
                activeOpacity={0.8}
              >
                <View style={styles.archiveItemContent}>
                  <View style={styles.archiveItemText}>
                    <Text style={styles.archiveItemTitle}>
                      {getCardTitle(archiveItem)}
                    </Text>
                    <Text style={styles.archiveItemSubtitle}>
                      {getCardSubtitle(archiveItem)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCard(archiveItem)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require("../../assets/back-icon.png")}
                      style={styles.deleteIcon}
                      contentFit="contain"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  archiveList: {
    gap: 12,
  },
  archiveItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  archiveItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  archiveItemText: {
    flex: 1,
  },
  archiveItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  archiveItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    transform: [{ rotate: "180deg" }],
    opacity: 0.6,
  },
});

export default CardArchiveScreen;
