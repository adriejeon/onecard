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
  Platform,
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
import { useLanguage } from "../contexts/LanguageContext";
import {
  loadTodoData,
  calculateCompletionRate,
  saveTodoData,
} from "../utils/todoUtils";

const { width, height } = Dimensions.get("window");

// 반응형 달력 크기 계산 함수 추가
const getCalendarCellSize = () => {
  const screenWidth = width;
  const padding = 32; // 좌우 패딩 (16 * 2)
  const availableWidth = screenWidth - padding;
  const cellWidth = availableWidth / 7;

  // iPad 등 넓은 화면에서도 적절한 크기 유지
  const maxCellWidth = 80;
  const minCellWidth = 35;

  return Math.min(Math.max(cellWidth, minCellWidth), maxCellWidth);
};

const HomeScreen = ({ navigation, route }) => {
  const { currentLanguage } = useLanguage();
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [diaryData, setDiaryData] = useState({}); // 일기 데이터 저장
  const [todoData, setTodoData] = useState(null); // 투두리스트 데이터

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
    loadTodayTodoData(); // 오늘의 투두리스트 로드
    return () => clearInterval(interval);
  }, [currentLanguage]); // 언어 변경 시에도 업데이트

  // 화면이 포커스될 때마다 일기 데이터와 투두리스트 다시 로드
  useFocusEffect(
    useCallback(() => {
      loadDiaryData();
      loadTodayTodoData();
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

  const loadTodayTodoData = useCallback(async () => {
    try {
      const today = new Date();
      const todoData = await loadTodoData(today);
      setTodoData(todoData);
    } catch (error) {
      console.error("투두리스트 로드 실패:", error);
    }
  }, []);

  const updateGreeting = useCallback(() => {
    try {
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
    } catch (error) {
      setGreeting("안녕하세요!");
    }
  }, []);

  const handleWorryButton = () => {
    navigation.navigate("QuestionInput");
  };

  // 테스트용 임시 투두리스트 생성 함수
  const createTestTodoData = async () => {
    try {
      const today = new Date();
      // 한국 시간 기준으로 날짜 문자열 생성
      const koreanTime = new Date(today.getTime() + 9 * 60 * 60 * 1000); // UTC+9
      const testTodoData = {
        date: `${koreanTime.getFullYear()}-${String(
          koreanTime.getMonth() + 1
        ).padStart(2, "0")}-${String(koreanTime.getDate()).padStart(2, "0")}`,
        cardId: "test_card",
        cardScore: 7,
        todos: [
          { id: 1, text: "새로운 기술 배우기", completed: false },
          { id: 2, text: "운동하기", completed: true },
          { id: 3, text: "책 읽기", completed: false },
        ],
        intention: "긍정적인 마음가짐으로",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const success = await saveTodoData(testTodoData);
      if (success) {
        setTodoData(testTodoData);
      }
    } catch (error) {
      console.error("테스트 투두리스트 생성 실패:", error);
    }
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
    // 일기 입력 페이지로 이동 - 한국 시간 기준 사용
    const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, "0");
    const day = String(koreanTime.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    navigation.navigate("DiaryInput", {
      selectedDate: dateString,
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
    const dayOfWeekKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayOfWeek = i18n.t(`home.dayOfWeek.${dayOfWeekKeys[date.getDay()]}`);

    return i18n.t("home.dateFormat", {
      year: year,
      month: month,
      day: day,
      dayOfWeek: dayOfWeek,
    });
  };

  const getDiaryForDate = (date) => {
    // 한국 시간 기준으로 날짜 문자열 생성
    const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, "0");
    const day = String(koreanTime.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    return diaryData[dateString];
  };

  const renderCalendarDays = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendarWeeks = [];
    const today = new Date();

    // 6주 (42일)를 7일씩 나누어서 렌더링
    for (let week = 0; week < 6; week++) {
      const weekDays = [];

      for (let day = 0; day < 7; day++) {
        const dayIndex = week * 7 + day;
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + dayIndex);

        const isCurrentMonth = date.getMonth() === month;
        const isToday = date.toDateString() === today.toDateString();
        const diary = getDiaryForDate(date);
        const hasDiary = diary && (diary.content || diary.emotion);
        const hasEmotion =
          hasDiary && diary.emotion && emotionIcons[diary.emotion];

        weekDays.push(
          <TouchableOpacity
            key={dayIndex}
            style={[
              styles.calendarDay,
              !isCurrentMonth && styles.otherMonthDay,
            ]}
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

      calendarWeeks.push(
        <View key={week} style={styles.calendarWeek}>
          {weekDays}
        </View>
      );
    }

    return calendarWeeks;
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  style={styles.calendarTitleContainer}
                  onPress={handleDatePress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.calendarTitle}>
                    {i18n.t("home.calendarHeader", {
                      year: selectedYear,
                      month: i18n.t(`home.monthNames.${selectedMonth + 1}`),
                    })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.calendarArrowButton}
                  onPress={handleDatePress}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require("../../assets/arrowDownIcon.png")}
                    style={styles.calendarArrowIcon}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.calendarWeekHeader}>
                {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map(
                  (dayKey, index) => (
                    <View key={index} style={styles.calendarWeekHeaderDay}>
                      <Text style={styles.calendarWeekHeaderText}>
                        {i18n.t(`home.dayOfWeek.${dayKey}`)}
                      </Text>
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
      </ScrollView>

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
    paddingBottom: 20, // 하단 여백 줄임
  },
  symbolImage: {
    width: 30,
    height: 30,
  },
  greetingContainer: {
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  gradientContainer: {
    width: "100%",
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "normal",
    textAlign: "left",
  },
  dateText: {
    fontSize: 16,
    color: "#474747",
    textAlign: "left",
    opacity: 0.9,
  },
  calendarWrapper: {
    marginBottom: 20,
    overflow: "hidden", // 스와이프가 다른 영역에 영향을 주지 않도록 제한
    backgroundColor: "rgba(255, 255, 255, 0.05)", // 달력 영역을 시각적으로 구분 (선택사항)
    borderRadius: 15, // 달력 영역을 둥글게
    minHeight: 340, // 최소 높이 설정
  },
  todoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  todoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  todoCompletionRate: {
    fontSize: 14,
    color: "#ccc",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  todoCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  todoCheckboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  todoCheckmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  todoText: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    color: "#ccc",
  },
  todoMoreText: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
    marginTop: 8,
  },
  todoEmptyText: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginTop: 8,
  },
  todoEmptySubText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
  },
  testButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "center",
  },
  testButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  calendarContainer: {
    overflow: "hidden", // 달력 컨테이너 내부로 애니메이션 제한
    paddingHorizontal: 16, // 패딩 줄여서 더 많은 공간 활용
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarTitleContainer: {
    marginRight: 4,
  },
  calendarArrowButton: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarArrowIcon: {
    width: 16,
    height: 16,
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
    justifyContent: "space-between", // 균등 분배
    width: "100%",
  },
  calendarWeekHeaderDay: {
    width: getCalendarCellSize(),
    alignItems: "center",
    paddingVertical: 8,
    flex: 1, // 균등 분배를 위한 flex
  },
  calendarWeekHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#474747",
  },
  calendarGrid: {
    flexDirection: "column", // 세로 방향으로 주 변경
    width: "100%", // 전체 너비 사용
  },
  calendarWeek: {
    flexDirection: "row", // 가로 방향으로 일 배치
    justifyContent: "space-between", // 균등 분배
    width: "100%",
    marginBottom: 4, // 주 간격
  },
  calendarDay: {
    width: getCalendarCellSize(),
    height: getCalendarCellSize() + 8, // 셀 크기에 비례한 높이
    alignItems: "center",
    justifyContent: "center",
    borderRadius: getCalendarCellSize() / 2, // 원형 모양 유지
    position: "relative",
    flex: 1, // 균등 분배를 위한 flex
  },
  calendarDayText: {
    fontSize: Math.max(14, getCalendarCellSize() * 0.25), // 셀 크기에 비례한 폰트 크기
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
    width: 36,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.textLight,
  },
  buttonContainer: {
    justifyContent: "center",
    paddingTop: 10,
    paddingHorizontal: 16,
    marginTop: 10,
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
    minHeight: Platform.OS === "android" ? 56 : undefined,
    justifyContent: "center",
  },
  worryButtonText: {
    fontSize: 16,
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
