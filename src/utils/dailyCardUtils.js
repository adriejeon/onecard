import AsyncStorage from "@react-native-async-storage/async-storage";

// 한국 시간 기준으로 오늘 날짜 문자열 반환
const getKoreanDate = () => {
  const now = new Date();
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  return koreanTime.toDateString();
};

// 다음 날 00:00까지 남은 시간 계산 (밀리초)
export const getTimeUntilNextDay = () => {
  const now = new Date();

  // 한국 시간으로 현재 시간 계산
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // 오늘 자정 (한국 시간) - UTC로 변환
  const todayMidnightUTC = new Date(now);
  todayMidnightUTC.setUTCHours(15, 0, 0, 0); // UTC 15:00 = 한국 00:00

  // 시간 차이 계산
  const timeDiff = todayMidnightUTC.getTime() - now.getTime();

  return timeDiff;
};

// 데일리 카드 뽑기 가능 여부 확인
export const checkDailyCardAvailability = async () => {
  try {
    const today = getKoreanDate();
    const lastDrawDate = await AsyncStorage.getItem("lastDailyCardDate");

    return lastDrawDate !== today;
  } catch (error) {
    return true; // 에러 시 뽑기 허용
  }
};

// 데일리 카드 뽑기 완료 시 저장
export const saveDailyCardDraw = async (cardData) => {
  try {
    const today = getKoreanDate();
    await AsyncStorage.setItem("lastDailyCardDate", today);

    // 오늘 뽑은 카드 정보도 저장
    if (cardData) {
      await AsyncStorage.setItem("todayDailyCard", JSON.stringify(cardData));
    }
  } catch (error) {}
};

// 오늘 뽑은 데일리 카드 정보 불러오기
export const getTodayDailyCard = async () => {
  try {
    const today = getKoreanDate();
    const lastDrawDate = await AsyncStorage.getItem("lastDailyCardDate");

    // 오늘 뽑은 카드인지 확인
    if (lastDrawDate === today) {
      const cardData = await AsyncStorage.getItem("todayDailyCard");
      return cardData ? JSON.parse(cardData) : null;
    }

    return null;
  } catch (error) {
    return null;
  }
};

// 다음 뽑기 가능 시간 포맷팅
export const formatNextDrawTime = () => {
  const timeUntilNext = getTimeUntilNextDay();

  if (timeUntilNext <= 0) {
    return "지금 뽑을 수 있습니다";
  }

  const hours = Math.floor(timeUntilNext / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 후`;
  } else {
    return `${minutes}분 후`;
  }
};

// 데일리 카드 데이터 초기화
export const resetDailyCardData = async () => {
  try {
    await AsyncStorage.removeItem("lastDailyCardDate");
    await AsyncStorage.removeItem("todayDailyCard");
  } catch (error) {}
};

// 일일 카드 뽑기 횟수 가져오기
export const getDailyCardCount = async () => {
  try {
    const today = new Date().toDateString();
    const count = await AsyncStorage.getItem(`oracleCardCount_${today}`);
    return parseInt(count) || 0;
  } catch (error) {
    console.log("Error getting daily card count:", error);
    return 0;
  }
};

// 일일 카드 뽑기 횟수 증가
export const incrementDailyCardCount = async () => {
  try {
    const today = new Date().toDateString();
    const currentCount = await getDailyCardCount();
    const newCount = currentCount + 1;
    await AsyncStorage.setItem(`oracleCardCount_${today}`, String(newCount));
    console.log(`Daily card count incremented to: ${newCount}`);
    return newCount;
  } catch (error) {
    console.log("Error incrementing daily card count:", error);
    return 1;
  }
};

// 일일 카드 뽑기 횟수 리셋 (테스트용)
export const resetDailyCardCount = async () => {
  try {
    const today = new Date().toDateString();
    await AsyncStorage.removeItem(`oracleCardCount_${today}`);
    console.log("Daily card count reset");
  } catch (error) {
    console.log("Error resetting daily card count:", error);
  }
};
