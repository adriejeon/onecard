import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import i18n from "../utils/i18n";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation, route }) => {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [diaryData, setDiaryData] = useState({}); // 일기 데이터 저장

  // 애니메이션 관련 상태
  const translateY = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  // 감정 이모지 매핑 - 메모이제이션
  const emotionIcons = useMemo(
    () => ({
      great: require("../../assets/great.png"),
      good: require("../../assets/good.png"),
      okay: require("../../assets/okay.png"),
      "not-great": require("../../assets/not-great.png"),
      bad: require("../../assets/bad.png"),
      angry: require("../../assets/angry.png"),
    }),
    []
  );

  useEffect(() => {
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // 1분마다 업데이트
    loadDiaryData(); // 일기 데이터 로드
    return () => clearInterval(interval);
  }, []);

  // 화면이 포커스될 때마다 일기 데이터 다시 로드
  useFocusEffect(
    useCallback(() => {
      loadDiaryData();
    }, [])
  );

  // 복원 후 데이터 새로고침 처리
  useEffect(() => {
    if (route.params?.refreshData) {
      loadDiaryData();
      // 파라미터 제거
      navigation.setParams({ refreshData: undefined });
    }
  }, [route.params?.refreshData]);

  const loadDiaryData = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const diaryKeys = keys.filter((key) => key.startsWith("diary_"));
      const diaryDataArray = await AsyncStorage.multiGet(diaryKeys);

      const diaryDataMap = {};
      diaryDataArray.forEach(([key, value]) => {
        if (value) {
          try {
            const diary = JSON.parse(value);
            diaryDataMap[diary.date] = diary;
          } catch (parseError) {
            console.error("일기 데이터 파싱 실패:", parseError);
          }
        }
      });

      setDiaryData(diaryDataMap);
    } catch (error) {
      console.error("일기 데이터 로드 실패:", error);
    }
  }, []);

  const updateGreeting = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();

    let greetingText = "";
    if (hour >= 5 && hour < 12) {
      greetingText = i18n.t("home.greetingMorning");
    } else if (hour >= 12 && hour < 18) {
      greetingText = i18n.t("home.greetingAfternoon");
    } else if (hour >= 18 && hour < 22) {
      greetingText = i18n.t("home.greetingEvening");
    } else {
      greetingText = i18n.t("home.greetingNight");
    }

    setGreeting(greetingText);
    setCurrentDate(now);
  }, []);

  const handleWorryButton = () => {
    navigation.navigate("QuestionInput");
  };

  const handleHomePress = () => {
    // 이미 홈 화면이므로 아무것도 하지 않음
  };

  const handleInfoPress = () => {
    navigation.navigate("More");
  };

  const handleDatePress = () => {
    setShowDateModal(true);
  };

  const handleYearChange = (direction) => {
    setSelectedYear((prev) => prev + direction);
  };

  const handleMonthChange = (direction) => {
    if (isAnimating) return; // 애니메이션 중에는 중복 실행 방지

    setIsAnimating(true);

    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    // 애니메이션 방향에 따라 translateY 설정 (더 작은 값으로 조정)
    const animationDirection = direction > 0 ? 1 : -1;

    // 스와이프 애니메이션
    Animated.sequence([
      // 현재 달력을 밀어내는 애니메이션 (더 작은 거리)
      Animated.timing(translateY, {
        toValue: animationDirection * 60, // 100에서 60으로 줄임
        duration: 150, // 200에서 150으로 줄임
        useNativeDriver: true,
      }),
      // 새로운 달력으로 즉시 전환
      Animated.timing(translateY, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 상태 업데이트
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
      setIsAnimating(false);
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDateModal(false);
    // 일기 입력 페이지로 이동
    navigation.navigate("DiaryInput", {
      selectedDate: date.toISOString().split("T")[0],
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY: gestureTranslationY } = event.nativeEvent;
      const threshold = 30; // 스와이프 감지 임계값을 50에서 30으로 줄임

      if (gestureTranslationY > threshold) {
        // 아래로 스와이프 - 이전 달
        handleMonthChange(-1);
      } else if (gestureTranslationY < -threshold) {
        // 위로 스와이프 - 다음 달
        handleMonthChange(1);
      } else {
        // 임계값에 도달하지 못한 경우 원래 위치로 복귀
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100, // 스프링 강도 조정
          friction: 8, // 마찰력 조정
        }).start();
      }
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  };

  const getDiaryForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return diaryData[dateString];
  };

  const renderCalendarDays = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendarDays = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const diary = getDiaryForDate(date);
      const hasDiary = diary && (diary.content || diary.emotion);
      const hasEmotion =
        hasDiary && diary.emotion && emotionIcons[diary.emotion];

      calendarDays.push(
        <TouchableOpacity
          key={i}
          style={[styles.calendarDay, !isCurrentMonth && styles.otherMonthDay]}
          onPress={() => handleDateSelect(date)}
          disabled={!isCurrentMonth}
        >
          {hasEmotion ? (
            <Image
              source={emotionIcons[diary.emotion]}
              style={styles.emotionIcon}
              contentFit="contain"
            />
          ) : (
            <Text
              style={[
                styles.calendarDayText,
                !isCurrentMonth && styles.otherMonthText,
                isToday && styles.todayText,
              ]}
            >
              {date.getDate()}
            </Text>
          )}
          {isToday && <View style={styles.todayIndicator} />}
        </TouchableOpacity>
      );
    }

    return calendarDays;
  };

  const renderDateModal = () => {
    const years = [];
    for (let i = 2020; i <= 2030; i++) {
      years.push(i);
    }

    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }

    return (
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>날짜 선택</Text>

            {/* 연도 선택 */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>연도</Text>
              <View style={styles.modalSelector}>
                <TouchableOpacity
                  style={styles.modalArrow}
                  onPress={() => handleYearChange(-1)}
                >
                  <Text style={styles.modalArrowText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.modalValue}>{selectedYear}</Text>
                <TouchableOpacity
                  style={styles.modalArrow}
                  onPress={() => handleYearChange(1)}
                >
                  <Text style={styles.modalArrowText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 월 선택 */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>월</Text>
              <View style={styles.modalSelector}>
                <TouchableOpacity
                  style={styles.modalArrow}
                  onPress={() => handleMonthChange(-1)}
                >
                  <Text style={styles.modalArrowText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.modalValue}>{selectedMonth + 1}</Text>
                <TouchableOpacity
                  style={styles.modalArrow}
                  onPress={() => handleMonthChange(1)}
                >
                  <Text style={styles.modalArrowText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 버튼들 */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setShowDateModal(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextPrimary,
                  ]}
                >
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
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
          onPress={handleHomePress}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/home-symbol.png")}
            style={styles.symbolImage}
            contentFit="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={commonStyles.infoButton}
          onPress={handleInfoPress}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/info-icon-dark.png")}
            style={commonStyles.infoIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        {/* 상단 인사 */}
        <View style={styles.greetingContainer}>
          <View style={styles.gradientContainer}>
            <MaskedView
              style={{ width: "100%" }}
              maskElement={<Text style={styles.greetingText}>{greeting}</Text>}
            >
              <LinearGradient
                colors={["#612CC9", "#C53D93"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
              >
                <Text style={[styles.greetingText, { opacity: 0 }]}>
                  {greeting}
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </View>

        {/* 달력 - 스와이프 영역으로 제한 */}
        <View style={styles.calendarWrapper}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.calendarContainer,
                {
                  transform: [{ translateY: translateY }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.calendarHeader}
                onPress={handleDatePress}
              >
                <Text style={styles.calendarTitle}>
                  {selectedYear}년 {selectedMonth + 1}월
                </Text>
              </TouchableOpacity>
              <View style={styles.calendarWeekHeader}>
                {["일", "월", "화", "수", "목", "금", "토"].map(
                  (day, index) => (
                    <View key={index} style={styles.calendarWeekHeaderDay}>
                      <Text style={styles.calendarWeekHeaderText}>{day}</Text>
                    </View>
                  )
                )}
              </View>
              <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
            </Animated.View>
          </PanGestureHandler>
        </View>

        {/* 고민 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.worryButton}
            onPress={handleWorryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.worryButtonText}>
              {i18n.t("home.worryButton")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 날짜 선택 모달 */}
      {renderDateModal()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20, // 헤더 아래 여백
    paddingHorizontal: 20,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 20,
  },
  symbolImage: {
    width: 30,
    height: 30,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  gradientContainer: {
    width: "100%",
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
  },
  dateText: {
    fontSize: 16,
    color: "#474747",
    textAlign: "left",
    opacity: 0.9,
  },
  calendarWrapper: {
    flex: 1,
    marginBottom: 20,
    overflow: "hidden", // 스와이프가 다른 영역에 영향을 주지 않도록 제한
    backgroundColor: "rgba(255, 255, 255, 0.05)", // 달력 영역을 시각적으로 구분 (선택사항)
    borderRadius: 15, // 달력 영역을 둥글게
    minHeight: 340, // 최소 높이 설정
  },
  calendarContainer: {
    flex: 1,
    overflow: "hidden", // 달력 컨테이너 내부로 애니메이션 제한
    paddingHorizontal: 16,
  },
  calendarHeader: {
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#474747",
    textAlign: "left",
  },
  calendarWeekHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  calendarWeekHeaderDay: {
    width: (width - 32) / 7,
    alignItems: "center",
    paddingVertical: 8,
  },
  calendarWeekHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#474747",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: (width - 32) / 7,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22.5,
    position: "relative",
  },
  calendarDayText: {
    fontSize: 16,
    color: "#474747",
    fontWeight: "bold",
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: "#cccccc",
  },
  todayDay: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  todayText: {
    color: "#474747",
    fontWeight: "bold",
  },
  todayIndicator: {
    position: "absolute",
    top: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  emotionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.textLight,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  worryButton: {
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    width: "100%",
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  worryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 30,
    width: width * 0.8,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 30,
  },
  modalSection: {
    marginBottom: 25,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  modalSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
  },
  modalArrow: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalArrowText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  modalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    minWidth: 60,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#f5f5f5",
  },
  modalButtonPrimary: {
    backgroundColor: "#3100BB",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666666",
    textAlign: "center",
  },
  modalButtonTextPrimary: {
    color: "#ffffff",
  },
});

export default HomeScreen;
