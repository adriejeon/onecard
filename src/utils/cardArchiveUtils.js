import AsyncStorage from "@react-native-async-storage/async-storage";

// 카드 결과 보관하기
export const saveCardResult = async (cardData) => {
  try {
    const timestamp = new Date().toISOString();
    const archiveKey = `card_archive_${timestamp}`;

    const archiveData = {
      id: archiveKey,
      timestamp: timestamp,
      ...cardData,
    };

    await AsyncStorage.setItem(archiveKey, JSON.stringify(archiveData));

    // 보관된 카드 목록에 추가
    const archiveList = await getArchiveList();
    archiveList.unshift(archiveData); // 최신 항목을 맨 앞에 추가
    await AsyncStorage.setItem(
      "card_archive_list",
      JSON.stringify(archiveList)
    );

    return true;
  } catch (error) {
    return false;
  }
};

// 보관된 카드 목록 가져오기
export const getArchiveList = async () => {
  try {
    const archiveList = await AsyncStorage.getItem("card_archive_list");
    return archiveList ? JSON.parse(archiveList) : [];
  } catch (error) {
    return [];
  }
};

// 특정 카드 결과 가져오기
export const getCardResult = async (archiveId) => {
  try {
    const cardData = await AsyncStorage.getItem(archiveId);
    return cardData ? JSON.parse(cardData) : null;
  } catch (error) {
    return null;
  }
};

// 카드 결과 삭제
export const deleteCardResult = async (archiveId) => {
  try {
    await AsyncStorage.removeItem(archiveId);

    // 보관 목록에서도 제거
    const archiveList = await getArchiveList();
    const updatedList = archiveList.filter((item) => item.id !== archiveId);
    await AsyncStorage.setItem(
      "card_archive_list",
      JSON.stringify(updatedList)
    );

    return true;
  } catch (error) {
    return false;
  }
};

// 날짜 포맷팅 (YYYY.MM.DD)
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// 질문 텍스트 자르기 (최대 30자)
export const truncateQuestion = (question, maxLength = 30) => {
  if (question.length <= maxLength) {
    return question;
  }
  return question.substring(0, maxLength) + "...";
};
