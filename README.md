# 원카드 앱 (OneCard App)

## 제품 요구 사항 문서 (PRD)

### 1. 개요

'원카드' 컨셉의 앱으로, 사용자가 단 한 장의 카드를 통해 즉각적으로 예/아니오 답변 또는 오늘 하루의 운세를 얻을 수 있는 모바일 애플리케이션이다. 간단한 UI와 직관적 상호작용으로 결정을 빠르게 내리고자 하는 10~20대에게 명확한 재미·만족감을 제공한다.

### 2. 문제 정의

- 10~20대는 일상에서 사소한 선택(오늘 고백할까? 숙제를 할까?)에 고민이 많음.
- 기존 점술·룰렛·코인토스 앱은 복잡하거나 광고가 많아 사용 흐름이 끊김.
- 사용자는 심플하고 즉시 결과를 보여주는 경험을 원하지만 시장에는 유사 서비스가 부재함.

### 3. 목표 및 목적

- 1차 목표: 카드 한 장 뽑기만으로 예/아니오 결과를 제공
- 2차 목표: 접근성 높은 디자인·플로우로 반복 사용 유도
- 성공 지표
  - D7 유지율 ≥ 25%
  - 평균 세션 길이 ≤ 30초
  - 앱스토어 평점 ≥ 4.5
  - 바이럴 공유 비율(공유 버튼 클릭/세션) ≥ 15%

### 4. 타깃 사용자

#### 주요 사용자

- 연령: 10~20대, 스마트폰 사용에 능숙
- 성향: 호기심 많고 즉흥적, SNS 공유 빈번
- 니즈: 빠른 의사결정, 재미 요소, 간편한 인터랙션

#### 2차 이해관계자

- 인플루언서 및 커뮤니티 운영자: 콘텐츠 소재로 활용
- 광고주: Z세대 대상 브랜딩 기회

### 5. 사용자 스토리

- "10대 학생으로서, 숙제를 할지 말지 즉시 결정하고 싶어 카드 한 장으로 결과를 받고 싶다."
- "대학 신입생으로서, 즉흥 여행 결정을 카드로 재미있게 정하고 친구에게 결과를 공유하고 싶다."
- "컨텐츠 크리에이터로서, 라이브 방송에서 예/아니오를 빠르게 정해 시청자와 소통하고 싶다."

### 6. 기능 요구사항

#### 핵심 기능

1. **카드 뽑기 화면**

   - 두 가지 카드 뽑기 옵션 제공: 예/아니오 카드 뽑기, 오늘의 운세 카드 뽑기
   - 예/아니오 카드: 원카드 덱(자체 제작) 사용
   - 오늘의 운세 카드: 유니버셜 덱(메이저, 마이너 아르카나) 사용
   - 각 모드별로 단일 카드 덱 UI, 터치 혹은 스와이프로 카드 선택
   - 애니메이션 후 결과 화면으로 전환
   - 수락 기준: 1초 이내 애니메이션 완료, 예/아니오 확률 50:50, 운세는 카드 해석 텍스트 제공

2. **결과 화면**
   - 예/아니오 모드: 'YES' 또는 'NO' 텍스트와 컬러(파랑/빨강)로 명확 표시
   - 오늘의 운세 모드: 뽑은 카드 이미지, 카드 명칭, 짧은 운세 해석 텍스트 표시
   - 재시도 버튼, 공유 버튼 제공
   - 수락 기준: 100% 가독성, 공유 버튼 클릭 시 OS 기본 공유 시트 호출

#### 보조 기능

- 인트로 로고 스플래시(3초 이하)
- 결과 히스토리(최근 20회, 각 모드별 구분)
- 데일리 리워드(연속 사용 카운트)
- 설정: 사운드 on/off, 테마 변경(다크·라이트)

### 7. 비기능 요구사항

- 성능: 앱 부팅 ≤ 2초(Cold Start), 모든 화면 전환 ≤ 500ms
- 보안: 개인정보 미수집, 광고 ID만 익명 수집
- 사용성: 3탭 이내 주요 기능 접근, 손가락 1개 조작 최적화
- 확장성: 신규 카드 테마 추가 시 코드 수정 없이 JSON 추가
- 호환성: iOS 13+, Android 8.0+, 태블릿 레이아웃 대응

### 8. 성공 지표

- 제품 지표: MAU 5만, 세션당 1.8 카드 뽑기
- 비즈니스 지표: 광고 클릭률 3%, IAP 전환율 1%
- 기술 지표: Crash Free Rate ≥ 99.5%, TTI ≤ 1.5초

### 9. 일정 및 마일스톤

- Phase 1 (M+1): MVP – 카드 뽑기·결과·인트로, 기초 트래킹
- Phase 2 (M+2): 히스토리·공유·다크모드, 마켓 출시
- Phase 3 (M+3): 리워드·테마 스토어·AB테스트, 광고·IAP 통합

### 10. 리스크 및 대응

- 기술: Flutter 빌드 사이즈 증가 → 코드 스플리팅, 리소스 최적화
- 비즈니스: 단순 기능로 인한 이탈 → 리워드·테마로 반복 사용 유도
- 사용자: 결과 불신 → 난수 알고리즘·시드 설명 팝업

### 11. 향후 계획

- 카드 문구 다국어 지원, 음성 출력
- 친구 초대·멀티플레이 예측(동시 카드 뽑기)
- 브랜드 협업 테마 카드, 스폰서십 광고
- 웹 위젯 및 스마트워치 확장

---

## 개발 가이드

### 필요한 패키지들

#### 기본 패키지들

```bash
# 네비게이션
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# 애니메이션
npm install react-native-reanimated react-native-gesture-handler

# 로컬 저장소
npm install @react-native-async-storage/async-storage

# 아이콘 및 벡터 이미지
npm install react-native-vector-icons react-native-svg

# 공유 기능
npm install react-native-share

# 햅틱 피드백
npm install react-native-haptic-feedback

# 상태관리 (선택사항)
npm install zustand

# 카드 애니메이션용
npm install react-native-animatable
```

#### iOS 전용 추가 설정

```bash
# iOS 의존성 재설치
cd ios && pod install && cd ..
```

### 프로젝트 구조 (권장)

```
OneCardApp/
├── src/
│   ├── components/
│   │   ├── Card/
│   │   ├── Button/
│   │   └── common/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── CardDrawScreen.js
│   │   ├── ResultScreen.js
│   │   └── HistoryScreen.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── utils/
│   │   ├── cardLogic.js
│   │   └── storage.js
│   ├── assets/
│   │   ├── images/
│   │   └── data/
│   └── styles/
│       └── colors.js
├── App.js
└── package.json
```

### 개발 순서

#### Phase 1: 기본 구조 설정

1. 네비게이션 설정 (HomeScreen, CardDrawScreen, ResultScreen)
2. 기본 컴포넌트 생성 (Card, Button, Layout)
3. 색상/테마 시스템 구축

#### Phase 2: 핵심 기능 구현

1. 카드 데이터 구조 설계 (예/아니오 카드, 타로 카드)
2. 카드 뽑기 로직 구현
3. 카드 뽑기 애니메이션 구현
4. 결과 화면 구현

#### Phase 3: 부가 기능

1. 로컬 저장소 연동 (히스토리)
2. 공유 기능 구현
3. 사운드 효과 및 햅틱 피드백
4. 다크모드 지원

#### Phase 4: 최적화 및 배포 준비

1. 성능 최적화
2. 아이콘 및 스플래시 스크린
3. App Store 배포 준비

### 실행 명령어

#### 시뮬레이터 실행 방법

```bash
# iOS 시뮬레이터 실행
npx react-native run-ios

# 특정 디바이스 지정 (선택사항)
npx react-native run-ios --simulator="iPhone 14"
```

#### 개발 서버 실행

```bash
# 개발 서버 실행
npx react-native start

# 캐시 클리어 (문제 발생 시)
npx react-native start --reset-cache
```

### 트러블슈팅 팁

#### 자주 발생하는 문제들

- Metro bundler 에러: `npx react-native start --reset-cache`
- iOS 빌드 실패: `cd ios && pod install && cd ..`
- 시뮬레이터 연결 안됨: Xcode에서 시뮬레이터 수동 실행 후 재시도
- 패키지 설치 후 에러: iOS는 항상 `pod install` 필요

#### 성능 최적화 체크리스트

- 이미지 최적화 (WebP 형식 사용)
- 불필요한 리렌더링 방지 (useMemo, useCallback)
- 애니메이션 네이티브 드라이버 사용
- 번들 크기 모니터링

### 커서 확장 프로그램 추천

- ES7+ React/Redux/React-Native snippets
- React Native Tools
- Prettier - Code formatter
- Auto Rename Tag
