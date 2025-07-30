import AsyncStorage from "@react-native-async-storage/async-storage";

// 투두리스트 데이터 구조
export const createTodoData = (date, cardData) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  return {
    date: dateString,
    cardId: cardData?.id || null,
    cardScore: cardData?.score || 0,
    todos: [],
    intention: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// 투두리스트 저장
export const saveTodoData = async (todoData) => {
  try {
    const key = `todo_${todoData.date}`;
    await AsyncStorage.setItem(key, JSON.stringify(todoData));
    return true;
  } catch (error) {
    console.error("투두리스트 저장 실패:", error);
    return false;
  }
};

// 투두리스트 불러오기
export const loadTodoData = async (date) => {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const key = `todo_${dateString}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("투두리스트 불러오기 실패:", error);
    return null;
  }
};

// 투두리스트 삭제
export const deleteTodoData = async (date) => {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const key = `todo_${dateString}`;
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("투두리스트 삭제 실패:", error);
    return false;
  }
};

// 완료율 계산
export const calculateCompletionRate = (todos) => {
  if (!todos || todos.length === 0) return 0;
  const completed = todos.filter((todo) => todo.completed).length;
  return {
    completed,
    total: todos.length,
    percentage: Math.round((completed / todos.length) * 100),
  };
};

// 카드 점수에 따른 투두 난이도 추천
export const getDifficultySuggestion = (cardScore, cardId) => {
  if (cardScore >= 8) {
    return {
      difficulty: "hard",
      suggestion: "highScore",
    };
  } else if (cardScore >= 5) {
    return {
      difficulty: "medium",
      suggestion: "positiveCard",
    };
  } else {
    return {
      difficulty: "easy",
      suggestion: "lowScore",
    };
  }
};

// 카드 기반 투두 추천
export const getSuggestedTodos = (cardData) => {
  const suggestions = {
    // 긍정적인 카드들
    major_0: [
      "새로운 시작을 위한 계획 세우기",
      "낯선 곳 탐험하기",
      "창의적인 활동하기",
    ],
    major_1: [
      "새로운 기술 배우기",
      "도전적인 프로젝트 시작하기",
      "자신감 있게 표현하기",
    ],
    major_6: ["사랑하는 사람과 시간 보내기", "관계 개선하기", "감사 표현하기"],
    major_10: [
      "운명을 믿고 흘러가기",
      "기회를 놓치지 않기",
      "긍정적인 마음가짐 유지하기",
    ],

    // 도전적인 카드들
    major_7: [
      "인내심을 가지고 기다리기",
      "차근차근 진행하기",
      "목표 재정립하기",
    ],
    major_8: ["용기 내어 변화하기", "두려움 극복하기", "새로운 도전하기"],
    major_16: ["오래된 습관 버리기", "새로운 관점으로 보기", "변화 수용하기"],

    // 안정적인 카드들
    major_4: [
      "현재 상황에 만족하기",
      "안정감 유지하기",
      "감사한 마음 표현하기",
    ],
    major_9: ["혼자만의 시간 가지기", "내면의 목소리 듣기", "평온함 찾기"],
    major_21: ["목표 달성하기", "성공을 축하하기", "다음 단계 계획하기"],
  };

  return (
    suggestions[cardData?.id] || [
      "오늘의 목표 세우기",
      "중요한 일 하나 완료하기",
      "새로운 시도하기",
    ]
  );
};
