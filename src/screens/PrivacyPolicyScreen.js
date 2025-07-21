import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import i18n from "../utils/i18n";

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8F3FA"
        translucent
      />
      {/* 상단 헤더 */}
      <View style={[commonStyles.header, { backgroundColor: "#F8F3FA" }]}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={() => navigation.navigate("More")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
            style={commonStyles.backIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

        <Text style={commonStyles.headerTitle}>{i18n.t("privacy.title")}</Text>

        <View style={styles.placeholderButton} />
      </View>

      {/* 내용 */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{i18n.t("privacy.title")}</Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section1")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section1_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section2")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section2_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section3")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section3_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section4")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section4_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section5")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section5_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section6")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section6_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section7")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section7_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section8")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section8_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section9")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section9_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section10")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section10_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section11")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section11_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section12")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section12_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section13")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section13_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section14")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section14_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section15")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section15_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section16")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section16_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section17")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section17_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section18")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section18_content")}
          </Text>
          <Text style={styles.sectionTitle}>{i18n.t("privacy.section19")}</Text>
          <Text style={styles.contentText}>
            {i18n.t("privacy.section19_content")}
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  textContainer: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 30,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 25,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 15,
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    opacity: 0.8,
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
  },
});

export default PrivacyPolicyScreen;
