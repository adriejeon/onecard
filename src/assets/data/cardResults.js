const cardResults = {
  // Major Arcana
  major_0: {
    id: "major_0",
    isPositive: true,
    score: "50",
    title: "The Fool",
    description:
      "오늘은 새로운 시작과 무한한 가능성으로 가득 찬 하루입니다. 예상치 못한 제안이나 기회가 찾아올 수 있어요. 때로는 계획 없이 즉흥적으로 내딛는 첫걸음이 더 큰 행운을 가져다줄 수 있습니다. 마음의 소리에 귀 기울여 보세요.",
    keywords: "새로운 시작, 모험, 순수함, 잠재력",
  },
  major_1: {
    id: "major_1",
    isPositive: true,
    score: "85",
    title: "The Magician",
    description:
      "오늘은 당신의 재능과 창의력을 마음껏 발휘할 수 있는 하루입니다. 무엇이든 가능하게 만드는 자신감과 능력이 넘칩니다. 새로운 아이디어를 실행에 옮기거나 목표를 향해 나아가기에 완벽한 날이에요.",
    keywords: "창의력, 재능, 자신감, 실행력",
  },
  major_2: {
    id: "major_2",
    isPositive: true,
    score: "75",
    title: "The High Priestess",
    description:
      "오늘은 논리보다 직감을 믿어야 하는 하루입니다. 서두르기보다 차분히 내면의 목소리에 귀를 기울여보세요. 숨겨져 있던 진실을 발견하거나 중요한 통찰을 얻게 될 수 있습니다.",
    keywords: "직관, 통찰력, 지혜, 비밀",
  },
  major_3: {
    id: "major_3",
    isPositive: true,
    score: "80",
    title: "The Empress",
    description:
      "풍요와 창조의 에너지가 가득한 하루입니다. 진행 중인 일이 결실을 보고, 관계에서는 사랑과 만족을 느낄 수 있습니다. 물질적으로나 감정적으로 모두 풍요로운 날이 될 거예요.",
    keywords: "풍요, 결실, 다산, 안정",
  },
  major_4: {
    id: "major_4",
    isPositive: false,
    score: "30",
    title: "The Emperor",
    description:
      "오늘은 지나치게 권위적이거나 고지식한 태도로 인해 갈등이 생길 수 있는 하루입니다. 자신의 방식만을 고집하기보다 주변 사람들의 의견에 귀를 기울이고 유연한 자세를 보이는 것이 중요합니다. 책임감은 좋지만, 통제가 아닌 조화를 추구하세요.",
    keywords: "권위적인, 통제, 고집, 책임감",
  },
  major_5: {
    id: "major_5",
    isPositive: false,
    score: "25",
    title: "The Hierophant",
    description:
      "오늘은 규칙이나 전통에 얽매여 답답함을 느낄 수 있는 하루입니다. 정해진 틀에서 벗어나기 어려워 새로운 시도를 망설이게 될 수 있어요. 때로는 자신만의 신념을 따르는 용기가 필요합니다.",
    keywords: "전통, 관습, 규칙, 보수적",
  },
  major_6: {
    id: "major_6",
    isPositive: true,
    score: "90",
    title: "The Lovers",
    description:
      "사랑과 관계의 기쁨이 가득한 하루입니다. 중요한 선택의 기로에 놓일 수도 있습니다. 당신의 마음이 이끄는 대로, 가치관에 따라 결정한다면 최고의 결과를 얻을 수 있을 거예요.",
    keywords: "사랑, 관계, 조화, 선택",
  },
  major_7: {
    id: "major_7",
    isPositive: true,
    score: "70",
    title: "The Chariot",
    description:
      "오늘은 목표를 향해 힘차게 돌진해야 하는 하루입니다. 강한 의지와 자신감으로 무장한다면 어떤 어려움도 극복하고 승리를 쟁취할 수 있습니다. 망설이지 말고 앞으로 나아가세요.",
    keywords: "승리, 추진력, 의지, 목표 달성",
  },
  major_8: {
    id: "major_8",
    isPositive: true,
    score: "65",
    title: "Strength",
    description:
      "오늘은 부드러움이 강함을 이기는 내면의 힘을 발휘할 날입니다. 어려운 상황일수록 인내심을 갖고 차분하게 대처하세요. 당신의 용기와 부드러운 카리스마가 모든 것을 해결해 줄 것입니다.",
    keywords: "내면의 힘, 용기, 인내, 부드러운 카리스마",
  },
  major_9: {
    id: "major_9",
    isPositive: false,
    score: "20",
    title: "The Hermit",
    description:
      "오늘은 잠시 세상의 소음에서 벗어나 혼자만의 시간을 가지며 내면을 성찰하기 좋은 하루입니다. 해결되지 않는 문제가 있다면, 외부에서 답을 찾기보다 조용히 자기 자신에게 집중할 때 해답을 얻을 수 있습니다.",
    keywords: "내면 성찰, 지혜 탐구, 재충전, 혼자만의 시간",
  },
  major_10: {
    id: "major_10",
    isPositive: true,
    score: "75",
    title: "Wheel of Fortune",
    description:
      "예상치 못한 행운과 긍정적인 변화가 찾아오는 하루입니다. 운명의 수레바퀴가 당신에게 유리한 방향으로 움직이기 시작했어요. 새로운 기회를 두려워 말고 적극적으로 받아들이세요.",
    keywords: "운명적 전환, 행운, 기회, 변화",
  },
  major_11: {
    id: "major_11",
    isPositive: true,
    score: "80",
    title: "Justice",
    description:
      "공정하고 현명한 판단이 필요한 하루입니다. 중요한 결정을 내려야 한다면, 감정에 치우치지 말고 객관적인 시각을 유지하세요. 당신의 행동에 대한 정당한 결과를 얻게 될 것입니다.",
    keywords: "정의, 균형, 공정함, 책임",
  },
  major_12: {
    id: "major_12",
    isPositive: false,
    score: "15",
    title: "The Hanged Man",
    description:
      "오늘은 상황이 뜻대로 풀리지 않고 정체된 느낌을 받을 수 있습니다. 하지만 이는 더 큰 깨달음을 얻기 위한 인내의 과정입니다. 다른 관점에서 문제를 바라보는 노력이 필요한 하루입니다.",
    keywords: "인내, 희생, 정체, 새로운 관점",
  },
  major_13: {
    id: "major_13",
    isPositive: false,
    score: "10",
    title: "Death",
    description:
      "오늘은 어떤 상황의 끝과 새로운 시작을 동시에 맞이하는 하루입니다. 과거의 것을 과감히 정리해야 더 나은 미래로 나아갈 수 있습니다. 변화는 고통스럽지만, 꼭 필요한 과정임을 기억하세요.",
    keywords: "끝, 변화, 이별, 새로운 시작",
  },
  major_14: {
    id: "major_14",
    isPositive: true,
    score: "70",
    title: "Temperance",
    description:
      "오늘은 조화와 균형을 찾는 것이 중요한 하루입니다. 사람들과의 관계나 일 처리에서 극단에 치우치지 않고 중용의 미덕을 발휘하세요. 인내심을 갖고 상황을 조율한다면 평화를 찾을 수 있습니다.",
    keywords: "조화, 균형, 절제, 인내",
  },
  major_15: {
    id: "major_15",
    isPositive: false,
    score: "5",
    title: "The Devil",
    description:
      "오늘은 물질적 유혹이나 부정적인 관계에 얽매일 수 있는 하루입니다. 벗어나고 싶지만 벗어날 수 없는 중독적인 상황에 빠지지 않도록 주의하세요. 자신의 욕망을 솔직하게 들여다볼 필요가 있습니다.",
    keywords: "유혹, 집착, 중독, 속박",
  },
  major_16: {
    id: "major_16",
    isPositive: false,
    score: "20",
    title: "The Tower",
    description:
      "예상치 못한 충격적인 사건으로 인해 기존의 질서가 무너질 수 있는 하루입니다. 혼란스럽고 힘들겠지만, 이 변화는 당신을 더 단단하게 만들고 새로운 시작을 위한 기반이 될 것입니다.",
    keywords: "급작스러운 변화, 충격, 파괴, 각성",
  },
  major_17: {
    id: "major_17",
    isPositive: true,
    score: "85",
    title: "The Star",
    description:
      "희망과 영감이 샘솟는 긍정적인 하루입니다. 어려운 상황 속에서도 미래에 대한 밝은 비전을 발견하게 될 거예요. 당신의 꿈과 이상을 믿고 나아가세요. 좋은 기운이 함께합니다.",
    keywords: "희망, 영감, 긍정, 치유",
  },
  major_18: {
    id: "major_18",
    isPositive: false,
    score: "30",
    title: "The Moon",
    description:
      "오늘은 불안감과 혼란스러움으로 인해 방향을 잃기 쉬운 하루입니다. 현실과 환상을 구분하기 어려울 수 있으니, 중요한 결정은 피하는 것이 좋습니다. 내면의 두려움을 마주할 용기가 필요합니다.",
    keywords: "불안, 혼란, 환상, 두려움",
  },
  major_19: {
    id: "major_19",
    isPositive: true,
    score: "90",
    title: "The Sun",
    description:
      "성공과 행복의 에너지가 가득한 최고의 하루입니다. 모든 일이 긍정적으로 풀리고, 자신감과 활력이 넘칩니다. 주변 사람들과의 관계도 좋아지니, 이 좋은 기운을 마음껏 즐기세요.",
    keywords: "성공, 행복, 긍정, 활력",
  },
  major_20: {
    id: "major_20",
    isPositive: true,
    score: "80",
    title: "Judgement",
    description:
      "과거의 노력에 대한 보상을 받고 새로운 부름에 응답해야 하는 하루입니다. 중요한 결정을 통해 한 단계 더 성장하게 될 것입니다. 과거를 용서하고 새로운 시작을 받아들이세요.",
    keywords: "부활, 보상, 새로운 소명, 용서",
  },
  major_21: {
    id: "major_21",
    isPositive: true,
    score: "95",
    title: "The World",
    description:
      "오랫동안 노력해온 일이 드디어 완성되고 큰 성취감을 맛보는 하루입니다. 성공적인 마무리와 함께 새로운 세상으로 나아갈 준비가 되었습니다. 만족감과 행복을 만끽하세요.",
    keywords: "완성, 성취, 성공, 새로운 단계",
  },

  // Cups (컵)
  ace_cups: {
    id: "ace_cups",
    isPositive: true,
    score: "85",
    title: "Ace of Cups",
    description:
      "오늘은 새로운 사랑이나 감정이 싹트는 하루입니다. 마음이 열리고, 사람들과 깊은 감정적 교류를 나눌 수 있습니다. 창의적인 영감이 넘치고, 행복한 감정을 만끽하게 될 거예요.",
    keywords: "새로운 감정, 사랑의 시작, 공감, 행복",
  },
  cups_2: {
    id: "cups_2",
    isPositive: true,
    score: "80",
    title: "Two of Cups",
    description:
      "오늘은 사랑하는 사람이나 파트너와 깊은 교감을 나누는 조화로운 하루입니다. 서로의 마음을 확인하고 관계가 한 단계 더 발전할 수 있습니다. 새로운 인연을 만나기에도 좋은 날입니다.",
    keywords: "연합, 파트너십, 사랑, 교감",
  },
  cups_3: {
    id: "cups_3",
    isPositive: true,
    score: "75",
    title: "Three of Cups",
    description:
      "친구들과 함께 기쁨을 나누고 축하할 일이 생기는 즐거운 하루입니다. 사교적인 모임이나 파티에서 즐거운 시간을 보내게 될 수 있습니다. 함께하는 것의 행복을 느껴보세요.",
    keywords: "축하, 우정, 즐거운 모임, 기쁨",
  },
  cups_4: {
    id: "cups_4",
    isPositive: false,
    score: "40",
    title: "Four of Cups",
    description:
      "오늘은 일상에 대한 권태감이나 무기력함을 느낄 수 있는 하루입니다. 주변에서 주어지는 좋은 기회나 제안을 알아차리지 못하고 지나칠 수 있어요. 새로운 관점으로 주변을 둘러보는 노력이 필요합니다.",
    keywords: "권태, 무관심, 불만족, 기회를 놓침",
  },
  cups_5: {
    id: "cups_5",
    isPositive: false,
    score: "25",
    title: "Five of Cups",
    description:
      "과거의 상실감이나 후회에 얽매여 슬픔을 느낄 수 있는 하루입니다. 잃어버린 것에만 집중하기보다, 아직 당신에게 남아있는 소중한 것들을 돌아보세요. 긍정적인 면을 보려는 노력이 필요합니다.",
    keywords: "상실, 후회, 슬픔, 실망",
  },
  cups_6: {
    id: "cups_6",
    isPositive: true,
    score: "70",
    title: "Six of Cups",
    description:
      "과거의 좋은 추억이나 오랜 친구에게서 행복을 느끼는 하루입니다. 순수했던 시절을 떠올리게 하는 일이 생기거나, 반가운 사람에게서 연락이 올 수 있습니다. 따뜻한 감정을 나눠보세요.",
    keywords: "추억, 순수함, 그리움, 옛 친구",
  },
  cups_7: {
    id: "cups_7",
    isPositive: false,
    score: "35",
    title: "Seven of Cups",
    description:
      "오늘은 너무 많은 선택지와 비현실적인 환상 속에서 길을 잃기 쉬운 하루입니다. 허황된 꿈보다는 현실에 집중하고, 정말로 원하는 것이 무엇인지 명확히 해야 할 필요가 있습니다.",
    keywords: "환상, 비현실적 기대, 선택의 어려움, 혼란",
  },
  cups_8: {
    id: "cups_8",
    isPositive: false,
    score: "30",
    title: "Eight of Cups",
    description:
      "오늘은 더 이상 만족을 주지 못하는 상황이나 관계를 뒤로하고 떠나야 할 수 있는 하루입니다. 새로운 시작을 위해 현재의 안정을 포기하는 용기가 필요합니다. 더 나은 것을 찾아 떠나세요.",
    keywords: "떠남, 전환, 새로운 길 모색, 미련 버리기",
  },
  cups_9: {
    id: "cups_9",
    isPositive: true,
    score: "85",
    title: "Nine of Cups",
    description:
      "바라던 소원이 이루어지는 만족스러운 하루입니다. 물질적으로나 감정적으로 큰 만족감과 행복을 느끼게 될 것입니다. 당신의 성과를 마음껏 즐기고 스스로를 칭찬해주세요.",
    keywords: "소원 성취, 만족, 행복, 풍요",
  },
  cups_10: {
    id: "cups_10",
    isPositive: true,
    score: "90",
    title: "Ten of Cups",
    description:
      "가족이나 사랑하는 사람들과 함께 완벽한 행복과 조화를 누리는 하루입니다. 감정적인 충만함과 안정감을 느끼며, 모든 관계에서 사랑과 기쁨이 넘쳐날 것입니다.",
    keywords: "가정의 행복, 완전한 사랑, 조화, 정서적 만족",
  },

  // Pentacles (펜타클)
  ace_pentacles: {
    id: "ace_pentacles",
    isPositive: true,
    score: "80",
    title: "Ace of Pentacles",
    description:
      "오늘은 새로운 사업 기회나 금전적 행운의 씨앗이 심어지는 하루입니다. 현실적인 계획을 세우고 실행에 옮기기 좋은 날입니다. 당신의 노력이 구체적인 결실로 이어질 것입니다.",
    keywords: "새로운 기회, 번영, 안정, 현실화",
  },
  pentacle_2: {
    id: "pentacle_2",
    isPositive: true,
    score: "65",
    title: "Two of Pentacles",
    description:
      "오늘은 여러 가지 일을 동시에 처리하며 바쁘게 움직이는 하루가 될 수 있습니다. 변화하는 상황에 유연하게 대처하고 균형을 잘 잡는 능력이 중요합니다. 즐거운 마음으로 변화에 적응하세요.",
    keywords: "균형, 유연성, 적응, 변화 관리",
  },
  pentacle_3: {
    id: "pentacle_3",
    isPositive: true,
    score: "70",
    title: "Three of Pentacles",
    description:
      "오늘은 다른 사람들과의 협력을 통해 뛰어난 결과를 만들어내는 하루입니다. 당신의 기술과 재능을 인정받고, 팀워크를 통해 더 크게 성장할 수 있는 기회가 찾아옵니다.",
    keywords: "팀워크, 협력, 기술, 인정",
  },
  pentacle_4: {
    id: "pentacle_4",
    isPositive: true,
    score: "75",
    title: "Four of Pentacles",
    description:
      "물질적인 안정과 성과를 지키려는 마음이 강해지는 하루입니다. 안정감을 느끼는 것은 좋지만, 지나치게 인색하거나 변화를 두려워하는 태도는 경계해야 합니다. 때로는 베푸는 것이 더 큰 이득을 가져옵니다.",
    keywords: "소유, 안정, 보수적, 절약",
  },
  pentacle_5: {
    id: "pentacle_5",
    isPositive: false,
    score: "30",
    title: "Five of Pentacles",
    description:
      "금전적인 어려움이나 소외감으로 인해 힘든 하루가 될 수 있습니다. 혼자 모든 것을 짊어지려 하지 말고, 주변에 도움을 요청하는 용기를 내세요. 가까운 곳에 당신을 도울 사람이 있습니다.",
    keywords: "재정적 어려움, 고립, 상실감, 역경",
  },
  pentacle_6: {
    id: "pentacle_6",
    isPositive: true,
    score: "80",
    title: "Six of Pentacles",
    description:
      "오늘은 도움을 주거나 받으며 나눔의 기쁨을 느끼는 하루입니다. 금전적인 흐름이 원활해지고, 관대함을 베풀수록 더 큰 보상이 따릅니다. 공정하고 균형 잡힌 관계를 유지하세요.",
    keywords: "나눔, 관대함, 도움, 보상",
  },
  pentacle_7: {
    id: "pentacle_7",
    isPositive: true,
    score: "70",
    title: "Seven of Pentacles",
    description:
      "그동안의 노력을 되돌아보며 수확을 기다리는 하루입니다. 아직 결과가 보이지 않더라도 실망하지 마세요. 인내심을 갖고 꾸준히 나아간다면 머지않아 풍성한 결실을 맺게 될 것입니다.",
    keywords: "인내, 평가, 기다림, 투자",
  },
  pentacle_8: {
    id: "pentacle_8",
    isPositive: true,
    score: "75",
    title: "Eight of Pentacles",
    description:
      "자신의 일에 몰두하여 기술을 연마하고 전문성을 키우기 좋은 하루입니다. 꾸준하고 성실한 노력이 당신을 전문가의 반열에 올려놓을 것입니다. 배움과 성장에 집중하세요.",
    keywords: "숙련, 장인정신, 노력, 집중",
  },
  pentacle_9: {
    id: "pentacle_9",
    isPositive: true,
    score: "85",
    title: "Nine of Pentacles",
    description:
      "스스로의 노력으로 이룬 풍요와 성공을 만끽하는 하루입니다. 경제적, 정신적으로 독립하여 여유를 즐길 수 있습니다. 자신감과 만족감이 넘치는 하루를 보내세요.",
    keywords: "독립, 풍요, 자수성가, 여유",
  },
  pentacle_10: {
    id: "pentacle_10",
    isPositive: true,
    score: "90",
    title: "Ten of Pentacles",
    description:
      "물질적 풍요와 가족의 안정이 함께하는 풍요로운 하루입니다. 그동안 쌓아온 부와 명성을 가족, 공동체와 함께 나누며 큰 행복을 느끼게 될 것입니다. 안정된 기반 위에서 미래를 계획하세요.",
    keywords: "부, 유산, 가족의 번영, 안정",
  },

  // Swords (소드)
  ace_swords: {
    id: "ace_swords",
    isPositive: true,
    score: "75",
    title: "Ace of Swords",
    description:
      "오늘은 명쾌한 아이디어가 떠오르고 진실을 꿰뚫어 보는 하루입니다. 복잡했던 문제가 명확해지고, 이성적인 판단으로 올바른 결정을 내릴 수 있습니다. 새로운 도전을 시작하기에 좋은 날입니다.",
    keywords: "명확함, 진실, 돌파구, 이성적 판단",
  },
  swords_2: {
    id: "swords_2",
    isPositive: false,
    score: "45",
    title: "Two of Swords",
    description:
      "이러지도 저러지도 못하는 진퇴양난의 상황에서 결정을 내리기 어려운 하루입니다. 일부러 진실을 외면하고 있을 수도 있습니다. 마음의 눈을 뜨고 상황을 직시해야 할 필요가 있습니다.",
    keywords: "결정 장애, 교착 상태, 갈등, 외면",
  },
  swords_3: {
    id: "swords_3",
    isPositive: false,
    score: "20",
    title: "Three of Swords",
    description:
      "가슴 아픈 진실을 마주하거나 상처받는 말을 듣게 될 수 있는 하루입니다. 슬프고 고통스럽겠지만, 이 아픔을 있는 그대로 받아들이는 것이 치유의 첫걸음입니다.",
    keywords: "상심, 슬픔, 고통스러운 진실, 이별",
  },
  swords_4: {
    id: "swords_4",
    isPositive: false,
    score: "35",
    title: "Four of Swords",
    description:
      "오늘은 모든 것을 잠시 멈추고 휴식을 취해야 하는 하루입니다. 스트레스와 갈등에서 벗어나 재충전의 시간을 가지세요. 이 휴식은 다음 단계를 위한 중요한 준비 과정입니다.",
    keywords: "휴식, 재충전, 회복, 평화",
  },
  swords_5: {
    id: "swords_5",
    isPositive: false,
    score: "25",
    title: "Five of Swords",
    description:
      "이기더라도 상처만 남는 불필요한 갈등이나 경쟁에 휘말릴 수 있는 하루입니다. 자존심을 내세우기보다 한발 물러서는 것이 현명합니다. 승리보다 중요한 것이 무엇인지 생각해보세요.",
    keywords: "갈등, 패배, 불명예, 이기적인 승리",
  },
  swords_6: {
    id: "swords_6",
    isPositive: true,
    score: "70",
    title: "Six of Swords",
    description:
      "어려운 상황에서 벗어나 더 나은 곳으로 나아가는 전환의 하루입니다. 힘든 시기가 끝나고 평온한 미래가 기다리고 있습니다. 논리적인 조언자의 도움을 받을 수도 있습니다.",
    keywords: "전환, 이동, 회복, 새로운 시작",
  },
  swords_7: {
    id: "swords_7",
    isPositive: false,
    score: "40",
    title: "Seven of Swords",
    description:
      "기만적인 행동이나 배신에 주의해야 하는 하루입니다. 정직하지 못한 방법으로 무언가를 얻으려 하거나, 반대로 누군가에게 속을 수 있습니다. 정면으로 문제를 마주하는 용기가 필요합니다.",
    keywords: "기만, 배신, 속임수, 도피",
  },
  swords_8: {
    id: "swords_8",
    isPositive: false,
    score: "15",
    title: "Eight of Swords",
    description:
      "스스로 만든 생각의 감옥에 갇혀 무력감을 느끼는 하루입니다. 상황이 생각만큼 나쁘지 않을 수 있습니다. 부정적인 생각에서 벗어나면 해결책이 보일 것입니다.",
    keywords: "속박, 제한, 무력감, 자기 억압",
  },
  swords_9: {
    id: "swords_9",
    isPositive: false,
    score: "10",
    title: "Nine of Swords",
    description:
      "지나친 걱정과 불안감으로 잠 못 이루는 힘든 하루가 될 수 있습니다. 최악의 상황을 상상하며 스스로를 괴롭히고 있을 수 있어요. 걱정의 실체를 파악하고 도움을 구하세요.",
    keywords: "불안, 걱정, 악몽, 절망",
  },
  swords_10: {
    id: "swords_10",
    isPositive: false,
    score: "5",
    title: "Ten of Swords",
    description:
      "더 이상 나빠질 수 없는 최악의 상황, 완전한 끝을 마주하는 하루입니다. 하지만 모든 것이 끝난 바로 그 지점에서 새로운 시작이 가능합니다. 바닥을 쳤으니 이제 올라갈 일만 남았습니다.",
    keywords: "실패, 끝, 절망, 새로운 시작의 여명",
  },

  // Wands (완드)
  ace_wands: {
    id: "ace_wands",
    isPositive: true,
    score: "85",
    title: "Ace of Wands",
    description:
      "새로운 열정과 창의적인 에너지가 샘솟는 하루입니다. 새로운 프로젝트를 시작하거나, 당신의 영감을 행동으로 옮기기에 완벽한 날입니다. 망설이지 말고 도전하세요.",
    keywords: "열정, 창의력, 영감, 새로운 시작",
  },
  wands_2: {
    id: "wands_2",
    isPositive: true,
    score: "70",
    title: "Two of Wands",
    description:
      "미래에 대한 계획을 세우고 새로운 가능성을 탐색하는 하루입니다. 현재의 성공에 안주하지 않고 더 큰 세상을 향해 나아갈 준비를 하게 됩니다. 대담한 결정을 내리기에 좋은 날입니다.",
    keywords: "미래 계획, 결정, 용기, 확장",
  },
  wands_3: {
    id: "wands_3",
    isPositive: true,
    score: "75",
    title: "Three of Wands",
    description:
      "당신의 계획이 순조롭게 진행되고, 노력의 첫 결실을 기대하게 되는 하루입니다. 더 넓은 세상으로 확장해 나갈 기회가 보입니다. 긍정적인 전망을 믿고 계속 나아가세요.",
    keywords: "확장, 성장, 리더십, 미래에 대한 기대",
  },
  wands_4: {
    id: "wands_4",
    isPositive: true,
    score: "65",
    title: "Four of Wands",
    description:
      "안정된 기반 위에서 축하할 일이 생기는 평화롭고 즐거운 하루입니다. 가족, 친구들과 함께 성과를 나누고 행복한 시간을 보내세요. 조화와 안정을 만끽할 수 있는 날입니다.",
    keywords: "축하, 안정, 조화, 행복",
  },
  wands_5: {
    id: "wands_5",
    isPositive: false,
    score: "35",
    title: "Five of Wands",
    description:
      "사소한 의견 충돌이나 경쟁으로 인해 시끄러운 하루가 될 수 있습니다. 갈등이 성장을 위한 건전한 자극제가 될 수도 있지만, 불필요한 에너지 소모는 피하는 것이 좋습니다.",
    keywords: "경쟁, 갈등, 의견 충돌, 혼란",
  },
  wands_6: {
    id: "wands_6",
    isPositive: true,
    score: "80",
    title: "Six of Wands",
    description:
      "노력의 대가로 대중의 인정과 성공을 거머쥐는 영광스러운 하루입니다. 당신의 승리를 주변 사람들과 함께 축하하세요. 자신감을 갖고 다음 목표를 향해 나아갈 수 있습니다.",
    keywords: "승리, 성공, 인정, 자신감",
  },
  wands_7: {
    id: "wands_7",
    isPositive: false,
    score: "40",
    title: "Seven of Wands",
    description:
      "자신의 신념이나 입장을 지키기 위해 고군분투해야 하는 하루입니다. 많은 도전과 비판에 직면할 수 있지만, 용기를 갖고 맞서 싸운다면 유리한 고지를 지킬 수 있습니다.",
    keywords: "도전, 방어, 용기, 끈기",
  },
  wands_8: {
    id: "wands_8",
    isPositive: true,
    score: "75",
    title: "Eight of Wands",
    description:
      "상황이 매우 빠르게 진행되고, 기다리던 소식이 도착하는 역동적인 하루입니다. 갑작스러운 여행이나 새로운 기회가 찾아올 수 있습니다. 빠른 변화에 맞춰 신속하게 행동하세요.",
    keywords: "급속한 전개, 소식, 이동, 행동",
  },
  wands_9: {
    id: "wands_9",
    isPositive: false,
    score: "30",
    title: "Nine of Wands",
    description:
      "계속되는 싸움에 지쳐있지만, 마지막까지 경계를 늦출 수 없는 하루입니다. 거의 다 왔으니 포기하지 마세요. 당신의 끈기와 인내력이 결국 승리를 가져다줄 것입니다.",
    keywords: "인내, 방어, 끈기, 경계",
  },
  wands_10: {
    id: "wands_10",
    isPositive: false,
    score: "20",
    title: "Ten of Wands",
    description:
      "너무 많은 책임과 부담감에 짓눌려 힘든 하루입니다. 혼자 모든 짐을 짊어지려 하지 말고, 다른 사람에게 도움을 요청하거나 일부를 내려놓는 용기가 필요합니다.",
    keywords: "과도한 책임, 부담, 압박감, 번아웃",
  },

  // Court Cards (궁정 카드)
  page_cups: {
    id: "page_cups",
    isPositive: true,
    score: "70",
    title: "Page of Cups",
    description:
      "예상치 못한 감정적 메시지나 창의적인 제안을 받게 되는 하루입니다. 당신의 직감을 믿고 마음을 열어두세요. 새로운 관계나 아이디어가 싹틀 수 있습니다.",
    keywords: "창의적 영감, 직관적 메시지, 감수성, 호기심",
  },
  page_pentacles: {
    id: "page_pentacles",
    isPositive: true,
    score: "65",
    title: "Page of Pentacles",
    description:
      "새로운 것을 배우거나 실용적인 기술을 익히기에 좋은 하루입니다. 새로운 사업 기회나 투자 제안이 있을 수 있습니다. 성실한 자세로 임한다면 좋은 결실을 맺을 것입니다.",
    keywords: "새로운 기회, 학습, 성실함, 현실적인 계획",
  },
  page_swords: {
    id: "page_swords",
    isPositive: true,
    score: "60",
    title: "Page of Swords",
    description:
      "새로운 아이디어가 넘치고 지적 호기심이 왕성해지는 하루입니다. 새로운 정보를 탐색하고 진실을 추구하려는 에너지가 강합니다. 성급한 말이나 행동은 주의해야 합니다.",
    keywords: "새로운 아이디어, 호기심, 진실 탐구, 솔직함",
  },
  page_wands: {
    id: "page_wands",
    isPositive: true,
    score: "75",
    title: "Page of Wands",
    description:
      "새로운 모험에 대한 열정이 샘솟고, 탐험하고 싶은 에너지가 가득한 하루입니다. 새로운 가능성을 발견하고 열정적으로 뛰어들 준비가 되었습니다. 자유롭게 자신을 표현하세요.",
    keywords: "새로운 열정, 모험심, 탐험, 긍정적 에너지",
  },

  knight_cups: {
    id: "knight_cups",
    isPositive: true,
    score: "75",
    title: "Knight of Cups",
    description:
      "로맨틱한 제안을 받거나, 마음을 사로잡는 사람을 만날 수 있는 하루입니다. 당신의 감정을 따라 움직이세요. 예술적이고 창의적인 활동에서도 좋은 성과를 기대할 수 있습니다.",
    keywords: "로맨스, 제안, 매력, 감성",
  },
  knight_pentacles: {
    id: "knight_pentacles",
    isPositive: true,
    score: "70",
    title: "Knight of Pentacles",
    description:
      "오늘은 목표를 향해 꾸준하고 성실하게 나아가는 것이 중요한 하루입니다. 빠른 결과보다는 신중하고 책임감 있는 태도가 좋은 결실을 가져다줄 것입니다. 신뢰를 쌓기에 좋은 날입니다.",
    keywords: "성실함, 책임감, 꾸준함, 신뢰",
  },
  knight_swords: {
    id: "knight_swords",
    isPositive: false,
    score: "45",
    title: "Knight of Swords",
    description:
      "목표를 향해 너무 성급하고 저돌적으로 달려나가다 실수를 저지를 수 있는 하루입니다. 야망은 좋지만, 주변 상황을 살피지 않는 충동적인 행동은 갈등을 유발할 수 있으니 주의하세요.",
    keywords: "성급함, 충동적 행동, 논쟁, 저돌적",
  },
  knight_wands: {
    id: "knight_wands",
    isPositive: true,
    score: "80",
    title: "Knight of Wands",
    description:
      "에너지가 넘치고 자신감 있게 행동하는 매력적인 하루입니다. 새로운 모험을 찾아 떠나거나 열정적으로 프로젝트를 추진하게 될 수 있습니다. 당신의 열정이 주변에 긍정적인 영향을 미칩니다.",
    keywords: "열정, 모험, 자신감, 행동력",
  },

  queen_cups: {
    id: "queen_cups",
    isPositive: true,
    score: "85",
    title: "Queen of Cups",
    description:
      "오늘은 당신의 뛰어난 직관과 공감 능력이 빛을 발하는 하루입니다. 주변 사람들의 마음을 따뜻하게 보듬어주고 현명한 조언을 해줄 수 있습니다. 당신의 내면의 목소리를 신뢰하세요.",
    keywords: "공감 능력, 직관, 감성적 지혜, 따뜻함",
  },
  queen_pentacles: {
    id: "queen_pentacles",
    isPositive: true,
    score: "80",
    title: "Queen of Pentacles",
    description:
      "현실적이면서도 따뜻한 마음으로 주변을 돌보는 능력이 발휘되는 하루입니다. 일과 가정 모두를 풍요롭게 만들 수 있습니다. 안정되고 편안한 환경을 만드는 데 집중해보세요.",
    keywords: "풍요, 안정, 실용성, 보살핌",
  },
  queen_swords: {
    id: "queen_swords",
    isPositive: false,
    score: "50",
    title: "Queen of Swords",
    description:
      "오늘은 예리하고 독립적인 판단력이 돋보이지만, 때로는 너무 차갑고 비판적으로 보일 수 있는 하루입니다. 진실을 추구하는 것은 좋지만, 따뜻한 말 한마디를 잊지 마세요.",
    keywords: "독립적, 명확한 판단, 지성, 냉철함",
  },
  queen_wands: {
    id: "queen_wands",
    isPositive: true,
    score: "86",
    title: "Queen of Wands",
    description:
      "자신감 넘치고 열정적인 매력을 마음껏 발산하는 하루입니다. 당신의 활기찬 에너지가 주변 사람들에게 영감을 주고, 모든 일을 주도적으로 이끌어 나갈 수 있습니다. 사교 활동에서 빛을 발합니다.",
    keywords: "자신감, 열정, 매력, 리더십",
  },

  king_cups: {
    id: "king_cups",
    isPositive: true,
    score: "80",
    title: "King of Cups",
    description:
      "감정적으로 성숙하고 균형 잡힌 태도로 모든 상황을 다루는 하루입니다. 감정에 휘둘리지 않으면서도 타인에게 공감하는 능력이 뛰어납니다. 현명한 조언자 역할을 하게 될 수 있습니다.",
    keywords: "감정적 균형, 자비, 성숙함, 지혜",
  },
  king_pentacles: {
    id: "king_pentacles",
    isPositive: true,
    score: "85",
    title: "King of Pentacles",
    description:
      "사업적 수완과 안정적인 리더십으로 풍요와 성공을 이끄는 하루입니다. 당신의 노력이 큰 부와 성취로 돌아옵니다. 믿음직하고 든든한 모습으로 주변의 신뢰를 얻습니다.",
    keywords: "사업적 성공, 풍요, 안정, 리더십",
  },
  king_swords: {
    id: "king_swords",
    isPositive: false,
    score: "55",
    title: "King of Swords",
    description:
      "지적 권위와 명철한 판단력으로 상황을 지배하는 하루입니다. 하지만 지나치게 엄격하고 냉정한 태도는 주변 사람들에게 상처를 줄 수 있습니다. 권위를 내세우기보다 지혜를 나누세요.",
    keywords: "권위, 지적 능력, 엄격함, 진실",
  },
  king_wands: {
    id: "king_wands",
    isPositive: true,
    score: "90",
    title: "King of Wands",
    description:
      "타고난 리더십과 카리스마로 비전을 현실로 만드는 강력한 하루입니다. 당신의 창의적인 아이디어와 열정이 많은 사람들을 이끌고 위대한 성공을 이뤄낼 것입니다. 대담하게 행동하세요.",
    keywords: "리더십, 비전, 카리스마, 열정",
  },
};

export default cardResults;
