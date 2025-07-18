import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Share,
  ImageBackground,
  Image,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const { width, height } = Dimensions.get("window");

const DailyResultScreen = ({ navigation, route }) => {
  const { result, cardType } = route.params;

  // 애니메이션 값들
  const resultScale = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;

  // 카드 결과에 따라 배경 결정
  const getBackgroundImage = () => {
    const cardResult = getCardResult(result.id);
    return cardResult.isPositive
      ? require("../../assets/resultBg-posi.png")
      : require("../../assets/resultBg-nage.png");
  };

  // 카드별 결과 정보
  const getCardResult = (cardId) => {
    const cardResults = {
      // Major Arcana
      major_0: {
        isPositive: true,
        score: "50",
        title: "The Fool",
        description:
          "준비되지 않은 상태에서 무모하게 시작하거나, 긍정적인 결과가 보이지 않음에도 일단 진행해야 하는 상황이 생길 수 있습니다. 길과 흉의 가능성은 정확히 50:50입니다. 좋지도 나쁘지도 않은, 무난하고 큰 임팩트 없이 흘러갈 수 있습니다.",
        keywords:
          "시작, 출발, 무모함, 즉흥적인, 기분대로, 마음가는 대로, 미성숙, 무지, 미숙, 초보, 초심자, 낙천적인, 세상물정 모르는",
      },
      major_1: {
        isPositive: true,
        score: "96",
        title: "The Magician",
        description:
          "운의 흐름이 좋은 편입니다. 외부 상황이나 요인이 나에게 긍정적으로 작용하기보다는, 나 자신의 능력과 임기응변이 좋아져서 일이 잘 풀리는 것입니다. 실력이나 노력과 무관한 행운을 기대하기보다는, 자신의 실력을 외부에 가시적으로 보여줄 수 있고 그로 인해 성과를 얻을 수 있습니다. 창의력을 요하는 일을 하는 분들은 아이디어가 샘솟는 시간이니, 가만히 있지 말고 사람들을 만나고 일하며 생각하고 어필하는 등 외부 활동에 적극 참여하세요.",
        keywords:
          "일 잘하는, 유능한, 말 잘하는, 임기응변에 능한, 매력적인, 인기 있는, 주변에 많은 사람이 꼬이는, 가능성, 만능 엔터테이너, 예술가, 과학자",
      },
      major_2: {
        isPositive: true,
        score: "62",
        title: "The High Priestess",
        description:
          "조용하고 고요하게 흘러가는 시간일 수 있습니다. 사람을 많이 만나기보다는 혼자 일이나 공부에 집중하게 될 수 있습니다. 스스로 말을 아끼게 되어 비밀이 생기거나 비밀을 지켜야 하는 상황에 놓일 수 있습니다. 연애적으로는 여성과 관련한 문제가 발생할 수 있습니다.",
        keywords: "대립, 조화, 이중적인, 여성적인, 비밀, 종교, 양자택일",
      },
      major_3: {
        isPositive: true,
        score: "78",
        title: "The Empress",
        description:
          "평화롭고 온화한 시간이 될 수 있습니다. 식사 약속이 있다면, 여황제가 풍요의 상징이기 때문에 음식을 많이 먹거나 주류나 음료를 많이 마시는 시간이 될 수 있습니다. 금전적으로도 부족함이 없어서, 소비할 일이 생긴다면 큰 금액을 지출하거나 돈이 들어올 일이 있다면 안정적으로 금전이 들어올 수 있습니다. 여황제는 임신과 출산과도 관련이 있어서, 임신과 관련된 이벤트를 겪을 확률이 높습니다. 여성이라면 이성으로부터 주목을 받고 인기가 많아질 수 있습니다.",
        keywords:
          "풍요, 너그러움, 평화, 안정, 안전, 즐거움, 과식, 폭식, 폭음, 과소비, 지출, 출산, 임신, 편안함",
      },
      major_4: {
        isPositive: true,
        score: "67",
        title: "The Emperor",
        description:
          "고집이 강해지고 내 뜻대로 완고하게 행동할 가능성이 높습니다. 과거 황제들처럼, 스스로 생각하고 원하는 대로 조직을 움직이려는 마음이 들 수 있습니다. 황제는 조직의 우두머리로, 말 한 마디로 모든 것을 움직이고 바꿀 수 있는 전지전능한 권력을 가진 인물입니다. 나 또한 그런 마인드를 가지게 될 수 있습니다. 하지만 현실의 나는 실제 황제가 아니기 때문에, 내 생각대로 세상이 돌아가지 않을 확률이 높고, 그로 인해 고집을 부리는 사람으로 보일 수 있습니다. 내 뜻대로 되지 않을까봐 불안해지기 쉽습니다. 학업이나 일에 대해서는 기대 이상의 결과를 줄 수 있는 카드이기도 합니다.",
        keywords:
          "고집, 곤조, 움직이지 않는, 엉덩이가 무거운, 불안, 분노, 내 뜻대로 하고 싶은, 내 뜻대로 되는, 연상의 남성",
      },
      major_5: {
        isPositive: true,
        score: "50",
        title: "The Hierophant",
        description:
          "사회적인 교류와 소통이 활발해질 수 있습니다. 일, 금전, 연애와 관련해서 상대방으로부터 연락을 받을 확률이 높아집니다. 교황 카드는 유기적으로 타인과 얽히고 엮이는 의미를 가지므로, 사람들과 사회적으로 엮이고 소통할 일이 생길 가능성이 큽니다. 그러나, 상황이 좋지 않게 흘러간다면 타인의 잔소리를 묵묵히 참고 들어야 하는 경우도 생길 수 있습니다.",
        keywords:
          "전파, 전달, 대화, 소통, 도덕적인, 선량한, 점잖은, 명분, 합리화, 자기 방어",
      },
      major_6: {
        isPositive: true,
        score: "100",
        title: "The Lovers",
        description:
          "무엇을 해도 중간 이상은 갑니다. 연인 카드는 사랑에 빠진 연인을 보여주며, 뒤에는 축복하는 천사가 있습니다. 이처럼 사랑에 빠진 상태는 매우 행복하고 온전하며 평안한 시간을 의미합니다. 음식을 먹는다면 무척 맛있는 음식을 즐길 수 있고, 연인과의 데이트는 오랫동안 기억에 남을 달콤한 시간이 될 것입니다.",
        keywords:
          "사랑, 애정, 호감, 달콤한, 귀여운 연인, 잘 맞는 연인, 즐거운 추억, 행복한 감정",
      },
      major_7: {
        isPositive: true,
        score: "48",
        title: "The Chariot",
        description:
          "전차를 타고 이동하는 카드의 주인공처럼 실제로 이동할 일이 생길 수 있습니다. 물리적으로 이동하거나, 심리적으로 생각했던 것을 견고히 밀고 나가야 하는 의미일 수 있습니다. 주요 테마는 '방향성'입니다. 내가 가고자 하는 방향, 마음먹은 방향으로 전차를 타고 밀고 나가는 모습을 의미합니다.",
        keywords: "방향성, 견고함, 무대뽀, 돌진, 전진, 이동, 장거리, 탈 것",
      },
      major_8: {
        isPositive: true,
        score: "24",
        title: "Strength",
        description:
          "참고 인내해야 할 수 있습니다. 이는 곧 상황이나 환경이 내 뜻대로 흘러가지 않음을 의미합니다. 생각처럼 되지 않는 현실에 순응하고, 더 큰 성취를 위해 잠시 물러서는 마음으로 때를 기다려야 할 수 있습니다. 이 시기의 인내는 후일을 위한 준비일 수 있습니다. 나 자신이 카드 속에서 사자를 길들이는 여성일지, 길들여지는 사자일지는 시간이 지나면 드러날 것입니다.",
        keywords: "인내, 명상, 기다림, 통제력, 가스라이팅",
      },
      major_9: {
        isPositive: false,
        score: "13",
        title: "The Hermit",
        description:
          "세상에 혼자 남겨진 듯한 시간이 될 수 있습니다. 스스로 동굴로 들어간 상황일 수도 있고, 타의에 의해 남겨지는 상황일 수도 있습니다. 어떤 상황이든 긍정적으로 해석하기는 어렵습니다. 카드 속 남자가 호롱불에 의지해 어둠을 헤쳐나가듯, 혼자 재정비하고 다시 빛 속으로 나올 준비를 해야 합니다. 기다리는 연락은 받지 못할 가능성이 높습니다. 피로와 피곤이 크게 쌓일 수 있으며, 휴식이 필요할 수 있습니다.",
        keywords:
          "잠적, 잠수, 동굴, 은둔, 혼자 있는 것, 마음을 다스리는 것, 연락 불통, 갑작스러운 약속 취소, 묵묵부답",
      },
      major_10: {
        isPositive: true,
        score: "44",
        title: "Wheel of Fortune",
        description:
          "벌어질 일은 반드시 벌어집니다. 이 카드는 운명을 의미합니다. 개인의 노력이나 능력을 벗어난 신의 영역이기에, 피할 수 없는 일이 일어날 수 있습니다. 길든 흉이든 이를 감내해야 할 신의 뜻으로 받아들여야 합니다. 이때는 많은 것들이 '자연스러운 수순대로 흘러가는' 식이 될 수 있으며, 잠시 엇나갔던 것들이 제자리를 찾게 될 것입니다.",
        keywords:
          "운명, 수순 대로 흘러가는 것, 응당 그렇게 돌아가야 하는 것, 제자리로 돌아감, 필시 발생되었어야 하는 것",
      },
      major_11: {
        isPositive: true,
        score: "37",
        title: "Justice",
        description:
          "정의 카드는 현실적이고 세속적이며 이성적인 카드입니다. 스스로 무척 이성적인 상태가 될 수 있습니다. 시험 같은 평가를 받게 된다면 '내가 한 만큼 평가받는' 식이 될 것입니다. 이 카드는 엄격할 만큼 공정하므로, 불로소득이나 노력 이상의 결과를 기대하면 실망할 수 있습니다.",
        keywords:
          "공정, 절제, 이성적인, 세속적인, 현실적인, 법과 관련된, 소송, 법정",
      },
      major_12: {
        isPositive: false,
        score: "12",
        title: "The hanged man",
        description:
          "운의 흐름이 좋지 않습니다. 호시탐탐 먹이를 노리는 사람, 특히 남성이 주변에 있을 수 있으며 주의 깊게 나를 지켜보는 사람이 목적을 가지고 있을 수 있습니다. 여성이라면 나쁜 의도로 접근하는 이성이 있을 수 있으니 연애 관계에 주의하는 것이 좋습니다. 남녀 모두 사기의 위험이 있으니 투자나 돈 거래에는 신중을 기해야 합니다.",
        keywords: "움직임이 없는, 사기수가 있는, 꿍꿍이가 있는, 짝사랑",
      },
      major_13: {
        isPositive: false,
        score: "68",
        title: "Death",
        description:
          "죽음 카드는 이름 그대로 '죽고 새롭게 시작하는' 변화를 의미합니다. 반복해오던 일이나 유지되던 상황이 새로운 국면을 맞이할 수 있습니다. 또한, '예정에 없던 약속이 갑자기 생기거나' 혹은 '취소'될 수 있습니다. ",
        keywords:
          "끝, 취소, 죽음, 단절, 시작, 아침, 저녁, 마지막 날, 마지막 시간, 마지막 만남, 새출발",
      },
      major_14: {
        isPositive: true,
        score: "74",
        title: "Temperance",
        description:
          "절제 카드는 감정을 적절하게 조절하는 모습을 보여줍니다. 열정적인 감정과는 반대되는 느낌으로, 감정을 아예 사용하지 않는 것이 아니라 적당히 사용하는 것입니다. 업무를 할 때는 적당히 임하는 식으로 나타날 수 있으며, 연애 상대를 만난다면 현재 연애에 임하는 내 마음의 온도가 적당히 따뜻하고 관계가 안정적이라는 반증일 수 있습니다. 전반적으로 마음 상태가 매우 안정적일 수 있습니다.",
        keywords:
          "절제, 타협, 안정적인, 평안한, 가족 같은, 술, 음료, 커피, 물, 수영장, 바다, 강",
      },
      major_15: {
        isPositive: false,
        score: "73",
        title: "The Devil",
        description:
          "악마 카드는 인간 본연의 본능과 쾌락을 보여줍니다. '본능에 의해 행동하게 되는' 시간이 될 수 있습니다. 음식을 먹을 때는 달고 짜고 매운 강렬한 맛의 음식을 과식하게 되거나, 연인과의 데이트에서는 감정적 교류보다 육체적 교류가 우선될 수 있습니다. 이 카드가 긍정적으로 작용할 때는 한 과목에 집중하여 공부할 때입니다. 여러 과목을 두루 하기보다는 한 과목에 집착해 매달릴 때 좋은 결과를 얻을 수 있습니다.",
        keywords: "집착, 집요, 쾌락, 본능, 성욕, 식욕, 수면욕, 스토킹",
      },
      major_16: {
        isPositive: false,
        score: "4",
        title: "The Tower",
        description:
          "타워 카드는 위에서 아래로 떨어지는 사람들의 절규를 담고 있습니다. 운의 흐름이 좋지 않으니 주의가 필요합니다. 신체적으로 다치거나 정신적인 스트레스가 크게 높아지는 일이 발생할 수 있습니다. 이슈는 '갑자기, 준비 없이' 터지는 성격을 가지고 있으며, '내가 한 실수로 인해' 발생할 수 있습니다. 문제의 근원은 '나 자신'일 수 있어 정신적인 타격이 클 수 있습니다. 또한, 타워 카드는 '상황이 갑자기 반전되는' 이슈를 보여줍니다. 예상치 못하게 해오던 일의 방향이 바뀔 수 있습니다.",
        keywords:
          "반전, 사고, 우울증, 조울증, 정신적 문제, 화재, 오만함, 실수, 과오, 자업자득, 충격적인, 급성 질병, 이별",
      },
      major_17: {
        isPositive: true,
        score: "79",
        title: "The Star",
        description:
          "창의력이 높아지고 의욕이 많아집니다. 타로에서 물은 생각과 마음을 상징하며, 물가에 홀로 있는 사람이 물을 뜨고 있으니 현실적인 부분보다는 '내 감정과 마음이 닿는 곳'이 두드러질 수 있습니다. 업무라면 '아직 실현되지 않았지만 아이디어 차원에서 훌륭한' 생각일 수 있고, 연애라면 '실제 연인은 아니지만 홀로 계속 생각하게 되는 애틋한 외사랑'일 것입니다.",
        keywords:
          "상상, 생각, 발상, 창의력, 독창적인, 좋은 아이디어, 짝사랑, 그리움, 아직 끝나지 않은 마음, 추억",
      },
      major_18: {
        isPositive: false,
        score: "13",
        title: "The Moon",
        description:
          "심란하고 고뇌하는 시간이 될 수 있습니다. 생각과 고민이 많아지며, 우울감이나 조울감을 느낄 수 있습니다. 또한, 가까운 사람에게 말하지 못하고 숨겨야 하는 비밀이 생길 수 있습니다. 떳떳하게 밝히지 못할 일은 벌이지 마세요. ",
        keywords:
          "우울, 조울, 비밀, 숨기는게 있는, 떳떳하지 못한, 고뇌, 걱정, 번뇌, 상심, 바람, 이중인격, 외도",
      },
      major_19: {
        isPositive: true,
        score: "82",
        title: "The Sun",
        description:
          "외부 환경이나 요인이 어떻든 나 스스로 즐거울 수 있습니다. 아이들처럼 특별한 이유나 조건 없이 작은 일로도 즐겁고 재미를 느낄 수 있습니다. 연인과 데이트를 한다면 풋풋한 감정이 가득할 수 있고, 회사에서는 일이 생겨도 낙천적으로 받아들이고 즐겁게 임할 수 있습니다.",
        keywords: "낙천적인, 즐거운, 행복한, 놀이, 긍정적인, 조증",
      },
      major_20: {
        isPositive: true,
        score: "82",
        title: "The Judgement",
        description:
          "심판 카드는 '과거의 내가 한 일에 대해 다시 마주할 기회'를 의미합니다. 좋든 싫든 과거의 행동에 대해 '심판'을 받게 될 수 있습니다. 시험을 본다면 '딱 내가 공부한 만큼' 결과를 받아볼 것이며, 이별한 과거 연인과 마주할 가능성도 높습니다.",
        keywords:
          "재회, 과거의 내 행적, 내 행동에 대한 심판, 과거의 행동에 대한 결과, 전연인, 다시 마음이 생기는, 다시 시작하는, 끝난 줄 알았지만 다시 지속되는",
      },
      major_21: {
        isPositive: true,
        score: "92",
        title: "The World",
        description:
          "마음이 편안하고 괜스레 일이 잘 풀리는 것처럼 느껴질 수 있습니다. 세계 카드의 이름처럼 실제로 해외 여행을 떠나거나 해외와 관련하여 좋은 일이 생길 수 있습니다. 메이저 카드의 마지막 카드인 만큼, '그동안 골머리를 앓고 좀처럼 끝나지 않던 일'이 해결되고 '종결'될 수 있습니다. 숙원하던 일이 손쉽게 해결되며, 걱정과 근심이 조금 덜어질 수 있습니다.",
        keywords: "해외, 여행, 행복, 사랑, 임신, 시작",
      },
      // Cups (컵)
      ace_cups: {
        isPositive: true,
        score: "68",
        title: "Ace of Cups",
        description:
          "감정이 매우 풍부해질 수 있습니다. 감정의 변화가 크고, 주변 환경의 영향도 크게 받을 수 있습니다. 새로운 일이 시작되거나 상황이 발생할 수 있으며, 술을 마신다면 과음할 가능성도 있으니 주의가 필요합니다.",
        keywords: "설레임, 시작, 감정의 고조, 술, 커피, 물, 바다, 호수, 눈물",
      },
      cups_2: {
        isPositive: true,
        score: "74",
        title: "2 of Cups",
        description:
          "대화가 잘 통하는 상대와 함께할 가능성이 높습니다. 타인과 의사 소통, 감정 교류가 원활하며 내 생각이나 뜻을 말을 통해 전달하기에도 수월합니다.",
        keywords: "대화, 의사 소통, 즐거움, 원활한 감정 교류",
      },
      cups_3: {
        isPositive: true,
        score: "92",
        title: "3 of Cups",
        description:
          "분위기는 즐거움 그 자체입니다. 동료, 지인, 친구, 가족과 함께 맛있는걸 먹고 마시며 수다 떨고 추억을 쌓을 수 있습니다. 애정하는 사람들과 즐겁게 보내는 편안한 시간으로, 근심 걱정도 잠시 내려놓을 수 있을 것입니다.",
        keywords: "맛있는 음식, 술, 커피, 디저트, 수다, 추억, 스트레스 해소",
      },
      cups_4: {
        isPositive: false,
        score: "36",
        title: "4 of Cups",
        description:
          "마음이 지루하고 권태로울 수 있습니다. 새로운 일이나 상황을 받아들일 준비가 되지 않았고, 과거에 얽매여 아무것도 하고 싶지 않은 상태일 수 있습니다.",
        keywords:
          "지루함, 권태로움, 지겨움, 과거, 요지부동, 귀찮음, 하기 싫은 마음, 정체기, 태만한, 권태기",
      },
      cups_5: {
        isPositive: false,
        score: "42",
        title: "5 of Cups",
        description:
          "이미 내 손을 떠난 과거에 더욱 연연하게 됩니다. 사람이든 물건이든 '감정을 쏟고 애지중지 했던' 과거 시점이 그리워지고 생각날 수 있습니다. 과거의 좋았던 기억만 떠오르니 이별이 후회스럽고 마음 쓰릴 수 있습니다.",
        keywords:
          "후회, 생각, 미련, 그리움, 자책, 과거의 인연, 보고 싶은 마음, 이별",
      },
      cups_6: {
        isPositive: true,
        score: "89",
        title: "6 of Cups",
        description:
          "과거의 인연이나 감정이 다시금 살아나는 시간입니다. 과거 인연의 소식을 듣게 되거나 풋풋한 마음의 설레임이 찾아올 수 있습니다. 대체로는 과거의 좋았던 기억, 좋아한 사람, 호감 등 긍정의 감정이 되살아나는 식입니다. 합격에도 긍정적인 카드입니다. 연애에도 몽글몽글한 감정이 큰 풋풋한 첫사랑을 보여줍니다.",
        keywords:
          "첫사랑, 풋풋한 사랑, 설레임, 애지중지, 귀하게 여기는 마음, 챙겨주는 마음, 과거 인연의 소식, 사랑했던 사람, 호감이 있던 사람",
      },
      cups_7: {
        isPositive: false,
        score: "25",
        title: "7 of Cups",
        description:
          "선택할 수 있는 옵션이 많아질 수 있습니다. 그러나 우유부단해질 가능성도 커지고, 여러 옵션 중에서 아무것도 선택하지 못하고 고민만 하게 될 수 있습니다. 귀가 얇아지고 우유부단해지기 때문에 가시적인 성과를 내기보다는 생각만 많아질 수 있습니다. 이 시기에는 정신적으로도 불안정해질 수 있으며, 불안증이나 정신 건강 문제가 있는 분들은 증세가 나타날 수 있으니 주의가 필요합니다.",
        keywords:
          "우유부단, 불안증, 선택 장애, 많은 옵션, 결정 장애, 신경정신증, 어장관리, 양다리, 외도",
      },
      cups_8: {
        isPositive: false,
        score: "23",
        title: "8 of Cups",
        description:
          "그동안 신경 쓰고 마음을 쏟았던 것을 떠나야 할 일이 생길 수 있습니다. 이별수가 있을 수 있어, 일적으로는 내가 신경 써온 성과를 빼앗기는 일이 발생할 수 있습니다. 이별은 내가 원해서 떠나는 것이 아니라 상황이 여의치 않아 어쩔 수 없이 떠나야 하는 경우일 수 있으며, 그로 인해 슬프고 애석한 마음이 들 수 있습니다.",
        keywords:
          "떠나야만 하는, 포기, 다 버리는, 겸손, 이별, 마음이 있지만 헤어져야 하는, 그동안 쌓아온 공을 포기하는",
      },
      cups_9: {
        isPositive: true,
        score: "84",
        title: "9 of Cups",
        description:
          "이 시간에는 감정적으로 매우 만족하고 의기양양할 수 있습니다. 자신감이 높아지고 콧대가 높아질 수 있는 때입니다. 실제로 내가 잘나서 그런 마음이 들 수 있지만, 근거 없는 자신감일 수도 있고 오만으로 보일 수 있습니다. 이럴 때일수록 스스로를 객관적이고 냉정하게 판단하려고 노력해야 합니다.",
        keywords:
          "자신만만한, 의기양양한, 만족감, 높은 자신감, 높은 자존감, 성공하는, 즐거운, 준비된",
      },
      cups_10: {
        isPositive: true,
        score: "97",
        title: "10 of Cups",
        description:
          "안정적이고 평온한 시간입니다. 가족 구성원과의 관계가 원활하며, 부부나 연인 사이가 더욱 돈독해질 수 있습니다. 외부에서 쌓인 피로는 가정의 행복을 통해 치유될 것이며, 가족이 채워주는 에너지로 다시 치열한 외부 활동을 수행할 힘이 생깁니다.",
        keywords: "가족, 연인, 행복, 즐거움, 안정감, 편안함, 만사형통",
      },
      // Pentacles (펜타클)
      ace_pentacles: {
        isPositive: true,
        score: "76",
        title: "Ace of Pentacles",
        description:
          "금전적인 일이 중요한 테마로 떠오를 수 있습니다. 예상치 못한 돈이 들어오거나 금전적으로 유리한 기회가 생길 수 있습니다. 그러나 갑작스럽게 무언가에 끌려 충동적으로 지출할 가능성도 있습니다. 이런 지출은 단순히 한 번으로 끝나는 것이 아니라, 예를 들어 운동을 결제해서 정기적으로 운동을 시작하는 것처럼 '새로운 시작을 위한 투자'가 될 수 있습니다.",
        keywords:
          "금전, 돈, 일, 일을 통해 돈이 들어오는, 돈을 통해 생활이 변화하는, 시작되는, 출발선",
      },
      pentacle_2: {
        isPositive: true,
        score: "67",
        title: "2 of Pentacles",
        description:
          "두 가지 일이나 관계를 동시에 관리해야 하는 상황이 있을 수 있습니다. 또는 두 가지 사이에서 균형을 맞춰야 하는 문제가 있을 수 있습니다. 양쪽에 똑같은 열정과 시간, 애정을 쏟아야 하며 어느 한쪽으로 치우치지 않도록 신경을 많이 쓰게 됩니다.",
        keywords:
          "밸런스, 이중 생활, 두 가지 일, 두 개의 관계, 워라밸, 균형을 맞춰야 하는, 수익과 지출",
      },
      pentacle_3: {
        isPositive: true,
        score: "72",
        title: "3 of Pentacles",
        description:
          "성실하게 일을 하거나 학교 수업을 듣게 될 수 있습니다. 이때는 혼자 하는 일이나 수업이 아니라, 친구나 동료와 함께 소통하며 진행하는 경우가 많을 것입니다. 여러 사람이 서로의 의견을 나누고 들으며 커뮤니케이션하게 될 수 있습니다.",
        keywords: "협업, 코워커, 동업, 팀 과제, 팀플, 팀 프로젝트, 그룹 스터디",
      },
      pentacle_4: {
        isPositive: true,
        score: "44",
        title: "4 of Pentacles",
        description:
          "자기 고집과 곤조가 강해집니다. 타인에게 나의 것을 나눠주기 싫은 마음이 커지고, 그로 인해 욕심이 강해질 수 있습니다.",
        keywords:
          "고집, 이기주의, 나만 생각하는 태도, 손해 보지 않으려는 태도, 인색한, 구두쇠, 욕심",
      },
      pentacle_5: {
        isPositive: false,
        score: "4",
        title: "5 of Pentacles",
        description:
          "금전적으로 좋지 않은 이슈가 발생할 수 있습니다. 돈 문제가 수면 위로 떠오르며, 결핍, 부족함, 궁핍, 고난, 시련 등의 '어쩔 방도가 없으니 일단은 참고 견뎌야 하는' 일련의 사건이 생길 수 있습니다. 이때는 노력을 해도 어쩔 수 없는 문제이므로 시간이 해결해주길 바라며 기다리는 수밖에 없습니다.",
        keywords:
          "가난, 포기, 건강 악화, 몸이 아픈, 몸살 감기, 입원, 참고 견뎌야 하는, 부도, 실패, 악화, 손실",
      },
      pentacle_6: {
        isPositive: true,
        score: "11",
        title: "6 of Pentacles",
        description:
          "타인에게 도움을 주거나 받을 수 있습니다. 균형이 중요하며, 도움을 받더라도 큰 도움 보다는 문제를 해결할 수 있는 조언을 얻는 정도일 수 있습니다. 도움을 주는 경우에도 상황을 완전히 반전시키기보다는 당장의 위기를 모면할 정도의 도움을 주게 됩니다.",
        keywords:
          "균형, 도움을 주는, 금전적 도움, 도움을 받는, 위기 모면, 금전 문제, 돈과 관련한 문제, 베푸는, 봉사, 선물",
      },
      pentacle_7: {
        isPositive: true,
        score: "68",
        title: "7 of Pentacles",
        description:
          "쉼이 필요한 시간입니다. 그동안 앞만 보며 열심히 달려왔을 수 있습니다. 목표가 누군가의 마음이든, 업무 성과든, 시험 성적이든 잠시 내려두고 쉬어가세요. 더 집중하기 위해 에너지를 비축하는 시간입니다.",
        keywords: "휴식, 잠시 정지, 구상하는, 고민하는, 개선해야하는",
      },
      pentacle_8: {
        isPositive: true,
        score: "82",
        title: "8 of Pentacles",
        description:
          "집중력이 높아집니다. 그동안 진행해온 일과 관련해 가시적인 성과가 나타나며 목표에 가까워질 수 있습니다. 금전운 또한 높아지고 있습니다.",
        keywords: "성실한, 집중, 열중, 열심히 일하는, 업무적 성과, 성적 향상",
      },
      pentacle_9: {
        isPositive: true,
        score: "94",
        title: "9 of Pentacles",
        description:
          "평온하고 풍요로운 시간이 될 것입니다. 누군가와 함께하기보다는 그동안 고생한 나를 위한 보상의 시간입니다. 내가 좋아하는 음식과 음료를 즐기고, 취미를 즐기거나 홀로 편히 쉬는 시간이 될 수 있습니다.",
        keywords: "풍요로운, 취미 생활, 과식, 휴식, 금전적 여유, 쇼핑",
      },
      pentacle_10: {
        isPositive: true,
        score: "98",
        title: "10 of Pentacles",
        description:
          "가족과 함께 여유롭고 평화로운 시간을 보낼 수 있습니다. 금전운이 좋아지는데, 이는 개인적인 일보다는 가족과 관련된 일로 인해 더 좋아집니다. 가족이나 가족처럼 가까운 친구, 지인, 연인과 함께 자축하며 좋은 음식을 먹고 휴식을 취할 수 있습니다.",
        keywords:
          "가족, 편안한 시간, 보호 받는 시간, 반려동물과 함께 하는 시간, 풍요로운, 풍족한",
      },
      // Swords (소드)
      ace_swords: {
        isPositive: true,
        score: "54",
        title: "Ace of Swords",
        description:
          "스스로 결정을 내려야 할 수 있습니다. 이때 내리는 결정은 온전히 자신의 결단력을 필요로 할 것입니다. 이 결단과 추진력을 통해 새로운 일이 시작될 가능성이 큽니다.",
        keywords: "결단력, 추진력, 실행력, 마음 먹음, 확신, 사고력, 관찰력",
      },
      // Wands (완드)
      ace_wands: {
        isPositive: true,
        score: "73",
        title: "Ace of Wands",
        description:
          "새로운 일이 시작될 수 있습니다. 누군가에 의해 끌려가기보다는, 스스로 하고 싶은 일을 추진력 있게 이끌어나갈 기회가 주어질 것입니다. 연인과 함께 한다면, 기존 관계에 새로운 국면을 맞이하는 중요한 이벤트가 발생할 수 있습니다.",
        keywords: "새로운 시작, 창의력, 영감, 열정, 에너지, 성장, 발전, 도전",
      },
      // Court Cards (궁정 카드)
      king_cups: {
        isPositive: true,
        score: "50",
        title: "King of Cups",
        description:
          "크게 별다른 일 없이 무난할 수 있는 시간입니다. 다만, 고집과 아집이 강해질 수 있습니다. 자신의 생각이나 고집이 지나치게 강해져서 타인에게 어려움을 줄 수 있으니, 이 점에 대해서는 주의가 필요합니다.",
        keywords: "고집, 아집, 완고함, 타인과의 갈등, 자신의 생각 고수",
      },
      king_pentacles: {
        isPositive: true,
        score: "82",
        title: "King of Pentacles",
        description:
          "금전 흐름이 안정적입니다. 정서적으로도 안정감을 느끼며 크게 감정의 동요가 없습니다. 대내외적으로도 대체로 안정적이고 편안해집니다.",
        keywords: "안정감, 금전적 안정, 정서적 안정, 편안함, 평온함",
      },
      king_swords: {
        isPositive: false,
        score: "44",
        title: "King of Swords",
        description:
          "이성적으로 행동하게 됩니다. 이성적이고 냉철하게 판단하여 관계나 일을 맺고 끊게 될 수 있습니다. 카드처럼 '칼자루를 쥐고 있는 쪽은 나'일 수 있으며, 내 판단에 따라 선택하고 결정하게 될 것입니다.",
        keywords: "이성적 판단, 냉철함, 결정, 선택, 관계 정리, 일 정리",
      },
      king_wands: {
        isPositive: true,
        score: "86",
        title: "King of Wands",
        description:
          "열정이 솟아납니다. 그 열정은 일에 대한 것일 가능성이 높으나 관계에 대한 열정일 수도 있습니다. 일을 하신다면 일에 대해 맡은 바 책임과 사명감이 강해질 수 있으며 데이트를 하게 된다면 상대에 대해 마음이 열렬히 타오를 수 있습니다. 일이든 관계든 그 대상에 대해 열정이 생기며 내가 쏟은 열정만큼 애정이 생기게 됩니다.",
        keywords: "열정, 책임감, 사명감, 애정, 타오르는 마음, 강한 의지",
      },
      knight_cups: {
        isPositive: true,
        score: "100",
        title: "Knight of Cups",
        description:
          "운이 매우 좋습니다. 기다리던 소식이 있다면 긍정적인 연락을 받을 수 있습니다. 특히 여성분이라면 연인에게 고백이나 프로포즈를 받거나 기분 좋은 선물을 받을 수 있습니다.",
        keywords: "좋은 운, 긍정적인 소식, 고백, 프로포즈, 선물, 행운",
      },
      knight_pentacles: {
        isPositive: true,
        score: "92",
        title: "Knight of Pentacles",
        description:
          "잊고 있던 사람이나 기관으로부터 연락이 올 수 있고, 예상치 못한 손님이 찾아올 수 있습니다. 안정적이며 금전운도 좋습니다. 직업이나 프로젝트와 관련된 일이 발생한다면 안정적인 수입을 창출할 수 있으며, 프로포즈나 고백을 받는다면 오랫동안 지속될 안정적인 관계가 될 것입니다.",
        keywords: "예상치 못한 연락, 손님, 안정적 수입, 안정적 관계, 금전운",
      },
      knight_swords: {
        isPositive: false,
        score: "31",
        title: "Knight of Swords",
        description:
          "상황이나 관계가 빠르게 새로운 국면을 맞이할 수 있습니다. 갑작스러운 변화가 일어날 수 있으며, 그 과정이 격렬할 수 있습니다. 냉철하고 이성적인 태도를 유지하다가도 때로는 공격적인 태도로 변할 수도 있습니다.",
        keywords: "갑작스러운 변화, 격렬한 과정, 공격적 태도, 새로운 국면",
      },
      knight_wands: {
        isPositive: true,
        score: "87",
        title: "Knight of Wands",
        description:
          "일적으로 이동할 일이 생길 수 있으며, 새로운 일이나 프로젝트에 참여할 기회가 찾아올 수 있습니다.",
        keywords: "일적 이동, 새로운 프로젝트, 새로운 기회, 변화",
      },
    };

    return (
      cardResults[cardId] || {
        isPositive: true,
        title: "알 수 없는 카드",
        description: "카드 결과를 확인할 수 없습니다.",
      }
    );
  };

  useEffect(() => {
    // 결과 애니메이션
    Animated.sequence([
      Animated.timing(resultScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(resultOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = async () => {
    try {
      const cardResult = getCardResult(result.id);
      const shareMessage = `오늘의 데일리 카드: ${cardResult.title}\n\n${cardResult.description}\n\n원카드 앱으로 오늘의 운세를 확인해보세요! (https://apps.apple.com/app/onecard)`;

      // 먼저 카카오톡이 설치되어 있는지 확인
      const canOpenKakao = await Linking.canOpenURL("kakaotalk://");

      if (canOpenKakao) {
        // 카카오톡으로 직접 공유
        const kakaoUrl = `kakaotalk://send?text=${encodeURIComponent(
          shareMessage
        )}`;
        await Linking.openURL(kakaoUrl);
      } else {
        // 카카오톡이 없으면 기본 공유 시트 사용
        await Share.share({
          message: shareMessage,
          title: "원카드 데일리 결과",
        });
      }
    } catch (error) {
      console.log("공유 실패:", error);

      // 모든 방법이 실패한 경우 기본 공유 시트로 폴백
      try {
        const cardResult = getCardResult(result.id);
        const shareMessage = `오늘의 데일리 카드: ${cardResult.title}\n\n${cardResult.description}\n\n원카드 앱으로 오늘의 운세를 확인해보세요! (https://apps.apple.com/app/onecard)`;

        await Share.share({
          message: shareMessage,
          title: "원카드 데일리 결과",
        });
      } catch (fallbackError) {
        console.log("기본 공유도 실패:", fallbackError);
        Alert.alert("공유 실패", "공유 기능을 사용할 수 없습니다.");
      }
    }
  };

  const handleRetry = () => {
    navigation.navigate("Home");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate("Home");
  };

  const cardResult = getCardResult(result.id);

  return (
    <ImageBackground
      source={getBackgroundImage()}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>데일리 카드</Text>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate("PrivacyPolicy")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/info-icon-dark.png")}
            style={styles.infoIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <View style={styles.gradientContainer}>
            <MaskedView
              style={{ width: "100%" }}
              maskElement={
                <Text style={styles.gradientTitle}>오늘의 운세</Text>
              }
            >
              <LinearGradient
                colors={["#612CC9", "#C53D93"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
              >
                <Text style={[styles.gradientTitle, { opacity: 0 }]}>
                  오늘의 운세
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </View>

        {/* 결과 카드 */}
        <View style={styles.resultContainer}>
          <Animated.View
            style={[
              styles.resultCard,
              {
                transform: [{ scale: cardScale }],
                opacity: resultOpacity,
              },
            ]}
          >
            <Image
              source={result.frontImage}
              style={styles.resultCardImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* 카드 제목 */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: cardResult.isPositive ? colors.primary : "#E91B64" },
            ]}
          >
            {cardResult.score}점 {cardResult.title}
          </Text>
        </Animated.View>

        {/* 결과 설명 */}
        <Animated.View
          style={[
            styles.explanationContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <Text style={styles.explanationText}>{cardResult.description}</Text>
          {cardResult.keywords && (
            <Text
              style={{
                fontSize: 13,
                color: "#888",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {cardResult.keywords}
            </Text>
          )}
        </Animated.View>

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          <View style={styles.topButtonRow}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>처음으로</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Text style={styles.shareButtonText}>공유하기</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>홈으로</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
  },
  gradientContainer: {
    alignItems: "center",
    width: "100%",
  },
  gradientTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 34,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  resultCard: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resultCardImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  explanationContainer: {
    marginBottom: 60,
    paddingHorizontal: 24,
  },
  explanationText: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 28,
  },
  buttonContainer: {
    gap: 15,
  },
  topButtonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  shareButton: {
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    width: "48%",
    borderColor: colors.primary,
    borderWidth: 1,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  retryButton: {
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    width: "48%",
    borderColor: colors.textPrimary,
    borderWidth: 1,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  homeButton: {
    alignItems: "center",
    paddingVertical: 15,
  },
  homeButtonText: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.8,
  },
});

export default DailyResultScreen;
