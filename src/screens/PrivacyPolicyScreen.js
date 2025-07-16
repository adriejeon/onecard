import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { colors } from "../styles/colors";

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../assets/homeBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>개인정보 처리방침</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 내용 */}
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>원카드 개인정보 처리방침</Text>

            <Text style={styles.sectionTitle}>1. 개인정보의 처리 목적</Text>
            <Text style={styles.contentText}>
              원카드는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의
              목적 이외의 용도로는 이용하지 않습니다.
            </Text>
            <Text style={styles.contentText}>
              • 서비스 제공 및 운영{"\n"}• 사용자 문의 및 응대{"\n"}• 서비스
              개선 및 신규 서비스 개발
            </Text>

            <Text style={styles.sectionTitle}>
              2. 개인정보의 처리 및 보유기간
            </Text>
            <Text style={styles.contentText}>
              원카드는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </Text>

            <Text style={styles.sectionTitle}>3. 개인정보의 제3자 제공</Text>
            <Text style={styles.contentText}>
              원카드는 정보주체의 별도 동의, 법률의 특별한 규정 등
              개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게
              제공합니다.
            </Text>

            <Text style={styles.sectionTitle}>
              4. 정보주체의 권리·의무 및 행사방법
            </Text>
            <Text style={styles.contentText}>
              정보주체는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
            </Text>
            <Text style={styles.contentText}>
              • 개인정보 열람요구{"\n"}• 오류 등이 있을 경우 정정 요구{"\n"}•
              삭제요구{"\n"}• 처리정지 요구
            </Text>

            <Text style={styles.sectionTitle}>
              5. 개인정보의 안전성 확보 조치
            </Text>
            <Text style={styles.contentText}>
              원카드는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보
              조치를 취하고 있습니다.
            </Text>
            <Text style={styles.contentText}>
              • 개인정보의 암호화{"\n"}• 해킹 등에 대비한 기술적 대책{"\n"}•
              개인정보에 대한 접근 제한
            </Text>

            <Text style={styles.sectionTitle}>6. 개인정보 보호책임자</Text>
            <Text style={styles.contentText}>
              원카드는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </Text>
            <Text style={styles.contentText}>
              ▶ 개인정보 보호책임자{"\n"}
              성명: 원카드팀{"\n"}
              연락처: privacy@onecard.com
            </Text>

            <Text style={styles.sectionTitle}>7. 개인정보 처리방침 변경</Text>
            <Text style={styles.contentText}>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
              전부터 공지사항을 통하여 고지할 것입니다.
            </Text>

            <Text style={styles.footerText}>
              본 방침은 2024년 1월 1일부터 적용됩니다.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textLight,
  },
  placeholder: {
    width: 60,
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
    color: colors.textLight,
    marginBottom: 30,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textLight,
    marginTop: 25,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: colors.textLight,
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
