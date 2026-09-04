window.initAiderLogLanguageLab = function initAiderLogLanguageLab(root, labShell) {
const japaneseScenarios = [
  {
    id: "cafe",
    icon: "珈",
    tab: "카페",
    place: "카페 · 기본 회화",
    title: "카페에서 주문하기",
    description: "메뉴를 고르고 원하는 음료를 정중하게 주문해요.",
    followTurns: [
      { suggestions: ["Mサイズでお願いします。", "小さいサイズでお願いします。"], reply: "かしこまりました。お会計は五百円です。", replyKo: "알겠습니다. 계산은 500엔입니다." },
      { suggestions: ["カードでお願いします。", "現金でお願いします。"], reply: "ありがとうございます。少々お待ちください。", replyKo: "감사합니다. 잠시만 기다려 주세요." }
    ],
    days: [
      { id: "cafe-1", title: "메뉴와 기본 주문", focus: "원하는 음료와 수량 말하기", word: "一つ", reading: "ひとつ", meaning: "하나 · 한 개", options: ["하나 · 한 개", "두 잔", "추천", "포장"], phrase: "コーヒーを一つお願いします。", translation: "커피 한 잔 부탁드립니다.", tokens: ["コーヒー", "を", "一つ", "お願いします"], pool: ["一つ", "コーヒー", "お願いします", "を"], opening: "いらっしゃいませ。ご注文はお決まりですか？", openingKo: "어서 오세요. 주문은 정하셨나요?", reply: "はい、コーヒーですね。サイズはいかがしますか？", replyKo: "네, 커피군요. 사이즈는 어떻게 하시겠어요?" },
      { id: "cafe-2", title: "온도와 사이즈", focus: "따뜻하게·차갑게, 크기 고르기", word: "温かい", reading: "あたたかい", meaning: "따뜻하다", options: ["따뜻하다", "차갑다", "달다", "크다"], phrase: "温かいコーヒーをお願いします。", translation: "따뜻한 커피 부탁드립니다.", tokens: ["温かい", "コーヒー", "を", "お願いします"], pool: ["を", "お願いします", "温かい", "コーヒー"], opening: "ホットとアイス、どちらになさいますか？", openingKo: "따뜻한 것과 아이스 중 어느 것으로 하시겠어요?", reply: "ホットですね。サイズはいかがしますか？", replyKo: "따뜻한 것이군요. 사이즈는 어떻게 하시겠어요?" },
      { id: "cafe-3", title: "추천과 결제", focus: "추천 메뉴를 묻고 결제하기", word: "おすすめ", reading: "おすすめ", meaning: "추천 · 추천 메뉴", options: ["추천 · 추천 메뉴", "영수증", "현금", "메뉴판"], phrase: "おすすめは何ですか？", translation: "추천 메뉴는 무엇인가요?", tokens: ["おすすめ", "は", "何", "ですか"], pool: ["何", "おすすめ", "ですか", "は"], opening: "今日は何になさいますか？", openingKo: "오늘은 무엇으로 하시겠어요?", reply: "抹茶ラテが人気です。いかがですか？", replyKo: "말차 라테가 인기예요. 어떠세요?" }
    ]
  },
  {
    id: "station",
    icon: "駅",
    tab: "교통",
    place: "역 · 이동 회화",
    title: "길과 교통 묻기",
    description: "목적지, 승강장, 환승 방법을 차례대로 물어봐요.",
    followTurns: [
      { suggestions: ["何番ホームですか？", "どこから乗りますか？"], reply: "二番ホームから乗ってください。", replyKo: "2번 승강장에서 타세요." },
      { suggestions: ["ありがとうございます。", "よく分かりました。"], reply: "どういたしまして。お気をつけて。", replyKo: "천만에요. 조심히 가세요." }
    ],
    days: [
      { id: "station-1", title: "목적지 말하기", focus: "가고 싶은 역과 장소 말하기", word: "駅", reading: "えき", meaning: "역", options: ["역", "정류장", "공항", "출구"], phrase: "渋谷駅まで行きたいです。", translation: "시부야역까지 가고 싶어요.", tokens: ["渋谷駅", "まで", "行きたい", "です"], pool: ["行きたい", "渋谷駅", "です", "まで"], opening: "こんにちは。どちらまで行かれますか？", openingKo: "안녕하세요. 어디까지 가시나요?", reply: "渋谷駅ですね。山手線に乗ってください。", replyKo: "시부야역이군요. 야마노테선을 타세요." },
      { id: "station-2", title: "승강장 찾기", focus: "몇 번 승강장인지 묻기", word: "何番", reading: "なんばん", meaning: "몇 번", options: ["몇 번", "몇 시", "몇 명", "어느 쪽"], phrase: "何番ホームですか？", translation: "몇 번 승강장인가요?", tokens: ["何番", "ホーム", "ですか"], pool: ["ですか", "何番", "ホーム"], opening: "新宿駅へは中央線が便利です。", openingKo: "신주쿠역에는 주오선이 편리합니다.", reply: "三番ホームです。あちらですよ。", replyKo: "3번 승강장입니다. 저쪽이에요." },
      { id: "station-3", title: "환승 확인하기", focus: "환승 여부와 소요 시간 묻기", word: "乗り換え", reading: "のりかえ", meaning: "환승", options: ["환승", "왕복", "급행", "출발"], phrase: "乗り換えは必要ですか？", translation: "환승이 필요한가요?", tokens: ["乗り換え", "は", "必要", "ですか"], pool: ["必要", "ですか", "乗り換え", "は"], opening: "東京駅まで行きますか？", openingKo: "도쿄역까지 가시나요?", reply: "いいえ、乗り換えは必要ありません。", replyKo: "아니요, 환승은 필요하지 않습니다." }
    ]
  },
  {
    id: "intro",
    icon: "会",
    tab: "모임",
    place: "모임 · 네트워킹 회화",
    title: "새로운 모임에서 대화하기",
    description: "이름, 하는 일, 관심사를 자연스럽게 이어서 말해요.",
    followTurns: [
      { suggestions: ["韓国から来ました。", "ソウルに住んでいます。"], reply: "そうですか。日本は初めてですか？", replyKo: "그렇군요. 일본은 처음인가요?" },
      { suggestions: ["はい、初めてです。", "いいえ、二回目です。"], reply: "これからよろしくお願いします。", replyKo: "앞으로 잘 부탁드려요." }
    ],
    days: [
      { id: "intro-1", title: "이름과 인사", focus: "정중하게 이름 소개하기", word: "申します", reading: "もうします", meaning: "~라고 합니다", options: ["~라고 합니다", "~를 봅니다", "~에 갑니다", "~가 좋습니다"], phrase: "ミンと申します。", translation: "민이라고 합니다.", tokens: ["ミン", "と", "申します"], pool: ["申します", "ミン", "と"], opening: "はじめまして。お名前は何ですか？", openingKo: "처음 뵙겠습니다. 성함이 어떻게 되세요?", reply: "ミンさんですね。よろしくお願いします。", replyKo: "민 님이군요. 잘 부탁드립니다." },
      { id: "intro-2", title: "출신과 거주지", focus: "어디에서 왔는지 말하기", word: "来ました", reading: "きました", meaning: "왔습니다", options: ["왔습니다", "갔습니다", "살고 있습니다", "태어났습니다"], phrase: "韓国から来ました。", translation: "한국에서 왔습니다.", tokens: ["韓国", "から", "来ました"], pool: ["来ました", "から", "韓国"], opening: "どちらから来ましたか？", openingKo: "어디에서 오셨어요?", reply: "韓国ですか。私も行ってみたいです。", replyKo: "한국이군요. 저도 가 보고 싶어요." },
      { id: "intro-3", title: "취미 이야기", focus: "좋아하는 활동 말하기", word: "趣味", reading: "しゅみ", meaning: "취미", options: ["취미", "특기", "직업", "여행"], phrase: "映画を見ることが好きです。", translation: "영화 보는 것을 좋아해요.", tokens: ["映画", "を", "見ること", "が", "好きです"], pool: ["好きです", "映画", "が", "見ること", "を"], opening: "趣味は何ですか？", openingKo: "취미가 무엇인가요?", reply: "映画ですか。私も映画が好きです。", replyKo: "영화군요. 저도 영화를 좋아해요." }
    ]
  },
  {
    id: "shopping",
    icon: "働",
    tab: "직장",
    place: "오피스 · 업무 회화",
    title: "직장에서 일정 조율하기",
    description: "자료 확인, 미팅 일정, 마감일을 정중하게 확인해요.",
    followTurns: [
      { suggestions: ["午後はいかがですか？", "来週でも大丈夫です。"], reply: "では、火曜日の午後にしましょう。", replyKo: "그럼 화요일 오후로 하죠." },
      { suggestions: ["分かりました。", "ありがとうございます。"], reply: "よろしくお願いします。", replyKo: "잘 부탁드립니다." }
    ],
    days: [
      { id: "shopping-1", title: "자료 확인 요청", focus: "동료에게 자료를 정중히 부탁하기", word: "確認", reading: "かくにん", meaning: "확인", options: ["확인", "공유", "수정", "제출"], phrase: "この資料を確認していただけますか？", translation: "이 자료를 확인해 주실 수 있나요?", tokens: ["この資料", "を", "確認して", "いただけますか"], pool: ["確認して", "この資料", "いただけますか", "を"], opening: "何かお手伝いしましょうか？", openingKo: "무엇을 도와드릴까요?", reply: "はい、今日中に確認します。", replyKo: "네, 오늘 중으로 확인하겠습니다." },
      { id: "shopping-2", title: "미팅 일정 조율", focus: "가능한 시간 제안하기", word: "都合", reading: "つごう", meaning: "일정 · 형편", options: ["일정 · 형편", "회의실", "자료", "휴가"], phrase: "来週の火曜日はいかがですか？", translation: "다음 주 화요일은 어떠세요?", tokens: ["来週", "の", "火曜日", "は", "いかがですか"], pool: ["火曜日", "いかがですか", "来週", "は", "の"], opening: "次のミーティングはいつにしますか？", openingKo: "다음 미팅은 언제로 할까요?", reply: "火曜日なら午後が空いています。", replyKo: "화요일이라면 오후가 비어 있습니다." },
      { id: "shopping-3", title: "마감일 확인", focus: "업무 기한을 정확히 묻기", word: "締め切り", reading: "しめきり", meaning: "마감 · 기한", options: ["마감 · 기한", "회의", "담당자", "결과"], phrase: "締め切りはいつですか？", translation: "마감일은 언제인가요?", tokens: ["締め切り", "は", "いつ", "ですか"], pool: ["いつ", "締め切り", "ですか", "は"], opening: "このプロジェクトについて質問はありますか？", openingKo: "이 프로젝트에 대해 질문이 있나요?", reply: "来週の金曜日までです。", replyKo: "다음 주 금요일까지입니다." }
    ]
  }
];

const englishScenarios = [
  {
    id: "en-cafe", icon: "C", tab: "카페", place: "카페 · 주문 회화", title: "취향대로 음료 주문하기", description: "메뉴, 옵션, 포장 여부를 자연스럽게 요청해요.",
    followTurns: [
      { suggestions: ["A medium, please.", "A small, please."], reply: "Great. Would you like anything else?", replyKo: "좋습니다. 더 필요한 것은 있으신가요?" },
      { suggestions: ["That's all, thank you.", "Could I also get a cookie?"], reply: "Sure. You can pay at the counter.", replyKo: "네. 카운터에서 결제하시면 됩니다." }
    ],
    days: [
      { id: "en-cafe-1", title: "포장 주문", focus: "원하는 음료와 포장 여부 말하기", word: "to go", reading: "투 고", meaning: "포장해서", options: ["포장해서", "매장에서", "얼음 없이", "추가로"], phrase: "Could I get an iced Americano to go?", translation: "아이스 아메리카노 한 잔 포장해 주시겠어요?", tokens: ["Could I get", "an iced Americano", "to go"], pool: ["to go", "Could I get", "an iced Americano"], opening: "Hi! What can I get for you?", openingKo: "안녕하세요! 무엇을 드릴까요?", reply: "Sure. What size would you like?", replyKo: "네. 어떤 사이즈로 드릴까요?" },
      { id: "en-cafe-2", title: "우유 옵션 변경", focus: "취향에 맞게 재료 바꾸기", word: "oat milk", reading: "오트 밀크", meaning: "귀리 우유", options: ["귀리 우유", "저지방 우유", "생크림", "시럽"], phrase: "Could I have it with oat milk?", translation: "귀리 우유로 바꿔 주시겠어요?", tokens: ["Could I have it", "with oat milk"], pool: ["with oat milk", "Could I have it"], opening: "Would you like regular milk?", openingKo: "일반 우유로 드릴까요?", reply: "Of course. Oat milk is an extra dollar.", replyKo: "물론이죠. 귀리 우유는 1달러가 추가됩니다." },
      { id: "en-cafe-3", title: "메뉴 추천", focus: "인기 메뉴를 묻고 선택하기", word: "recommend", reading: "레커멘드", meaning: "추천하다", options: ["추천하다", "주문하다", "결제하다", "기다리다"], phrase: "What do you recommend?", translation: "무엇을 추천하시나요?", tokens: ["What", "do you recommend"], pool: ["do you recommend", "What"], opening: "Are you ready to order?", openingKo: "주문하시겠어요?", reply: "Our cold brew is very popular.", replyKo: "저희 콜드브루가 아주 인기 있어요." }
    ]
  },
  {
    id: "en-travel", icon: "T", tab: "여행", place: "공항·역 · 이동 회화", title: "낯선 도시에서 이동하기", description: "승강장, 환승, 체크인 정보를 정확히 확인해요.",
    followTurns: [
      { suggestions: ["How long does it take?", "Is it within walking distance?"], reply: "It takes about twenty minutes.", replyKo: "약 20분 걸립니다." },
      { suggestions: ["Thank you for your help.", "Got it, thanks."], reply: "You're welcome. Have a safe trip!", replyKo: "천만에요. 안전한 여행 되세요!" }
    ],
    days: [
      { id: "en-travel-1", title: "승강장 찾기", focus: "출발 위치 정확히 묻기", word: "platform", reading: "플랫폼", meaning: "승강장", options: ["승강장", "출구", "환승", "매표소"], phrase: "Which platform does the train leave from?", translation: "기차는 어느 승강장에서 출발하나요?", tokens: ["Which platform", "does the train", "leave from"], pool: ["leave from", "Which platform", "does the train"], opening: "Hello. Where are you headed?", openingKo: "안녕하세요. 어디로 가시나요?", reply: "It leaves from platform six.", replyKo: "6번 승강장에서 출발합니다." },
      { id: "en-travel-2", title: "환승 확인", focus: "갈아타야 하는지 확인하기", word: "transfer", reading: "트랜스퍼", meaning: "환승하다", options: ["환승하다", "출발하다", "도착하다", "예약하다"], phrase: "Do I need to transfer?", translation: "환승해야 하나요?", tokens: ["Do I need", "to transfer"], pool: ["to transfer", "Do I need"], opening: "Are you going downtown?", openingKo: "도심으로 가시나요?", reply: "No, this train goes there directly.", replyKo: "아니요, 이 열차가 바로 갑니다." },
      { id: "en-travel-3", title: "호텔 체크인", focus: "예약자 이름으로 체크인하기", word: "check in", reading: "체크 인", meaning: "체크인하다", options: ["체크인하다", "예약을 취소하다", "짐을 맡기다", "방을 바꾸다"], phrase: "I'd like to check in, please.", translation: "체크인하고 싶습니다.", tokens: ["I'd like", "to check in", "please"], pool: ["please", "I'd like", "to check in"], opening: "Welcome. How can I help you?", openingKo: "어서 오세요. 무엇을 도와드릴까요?", reply: "May I have the name on the reservation?", replyKo: "예약자 성함을 알려주시겠어요?" }
    ]
  },
  {
    id: "en-work", icon: "W", tab: "직장", place: "오피스 · 업무 회화", title: "업무를 명확하게 조율하기", description: "마감, 미팅, 피드백을 부담 없이 요청해요.",
    followTurns: [
      { suggestions: ["The afternoon works for me.", "Could we do it tomorrow?"], reply: "Let's put it on the calendar.", replyKo: "일정에 등록해 둘게요." },
      { suggestions: ["Sounds good.", "I'll send an invite."], reply: "Perfect. Talk to you then.", replyKo: "좋아요. 그때 이야기해요." }
    ],
    days: [
      { id: "en-work-1", title: "마감일 확인", focus: "프로젝트 기한 묻기", word: "deadline", reading: "데드라인", meaning: "마감일", options: ["마감일", "담당자", "회의록", "예산"], phrase: "When is the deadline for this project?", translation: "이 프로젝트의 마감일은 언제인가요?", tokens: ["When is", "the deadline", "for this project"], pool: ["for this project", "When is", "the deadline"], opening: "Do you have any questions about the project?", openingKo: "프로젝트에 관해 질문이 있나요?", reply: "The deadline is next Friday.", replyKo: "마감일은 다음 주 금요일입니다." },
      { id: "en-work-2", title: "짧은 미팅 제안", focus: "상대의 가능한 시간 확인하기", word: "available", reading: "어베일러블", meaning: "시간이 되는", options: ["시간이 되는", "완료된", "긴급한", "유연한"], phrase: "Are you available for a quick meeting?", translation: "잠깐 미팅 가능하세요?", tokens: ["Are you available", "for a quick meeting"], pool: ["for a quick meeting", "Are you available"], opening: "What would you like to discuss?", openingKo: "무엇을 논의하고 싶으신가요?", reply: "Yes, I have time after lunch.", replyKo: "네, 점심 이후에 시간이 있어요." },
      { id: "en-work-3", title: "피드백 요청", focus: "결과물에 대한 의견 부탁하기", word: "feedback", reading: "피드백", meaning: "의견 · 피드백", options: ["의견 · 피드백", "승인", "성과", "회의"], phrase: "Could you give me some feedback on this?", translation: "이것에 대해 피드백을 주실 수 있나요?", tokens: ["Could you give me", "some feedback", "on this"], pool: ["on this", "some feedback", "Could you give me"], opening: "Is the draft ready to review?", openingKo: "초안 검토가 가능한가요?", reply: "Sure. I'll take a look this afternoon.", replyKo: "물론이죠. 오늘 오후에 살펴볼게요." }
    ]
  },
  {
    id: "en-social", icon: "S", tab: "모임", place: "모임 · 스몰토크", title: "처음 만난 사람과 대화하기", description: "소개, 일, 주말 계획으로 자연스럽게 대화를 이어가요.",
    followTurns: [
      { suggestions: ["I live in Seoul.", "I'm here for work."], reply: "Nice. How do you like the city?", replyKo: "좋네요. 이 도시는 어떠세요?" },
      { suggestions: ["I really like it.", "I'm still exploring."], reply: "We should grab coffee sometime.", replyKo: "언제 커피 한잔해요." }
    ],
    days: [
      { id: "en-social-1", title: "첫인사와 소개", focus: "편안하게 이름 소개하기", word: "nice to meet you", reading: "나이스 투 미트 유", meaning: "만나서 반가워요", options: ["만나서 반가워요", "오랜만이에요", "다음에 봐요", "잘 지냈어요?"], phrase: "Nice to meet you. I'm Min.", translation: "만나서 반가워요. 저는 민이에요.", tokens: ["Nice to meet you", "I'm Min"], pool: ["I'm Min", "Nice to meet you"], opening: "Hi, I don't think we've met before.", openingKo: "안녕하세요, 우리 처음 만나는 것 같네요.", reply: "Nice to meet you, Min. I'm Alex.", replyKo: "반가워요, 민. 저는 알렉스예요." },
      { id: "en-social-2", title: "하는 일 묻기", focus: "직업과 업무 이야기 시작하기", word: "for work", reading: "포 워크", meaning: "직업으로 · 일로", options: ["직업으로 · 일로", "퇴근 후에", "출장 중에", "주말마다"], phrase: "What do you do for work?", translation: "어떤 일을 하세요?", tokens: ["What do you do", "for work"], pool: ["for work", "What do you do"], opening: "So, what brings you here?", openingKo: "그런데 여기는 무슨 일로 오셨어요?", reply: "I work in product design.", replyKo: "저는 제품 디자인 일을 해요." },
      { id: "en-social-3", title: "주말 약속 제안", focus: "부담 없이 다음 만남 제안하기", word: "grab coffee", reading: "그랩 커피", meaning: "커피 한잔하다", options: ["커피 한잔하다", "식사를 주문하다", "잠깐 쉬다", "사진을 찍다"], phrase: "Would you like to grab coffee this weekend?", translation: "이번 주말에 커피 한잔할래요?", tokens: ["Would you like", "to grab coffee", "this weekend"], pool: ["this weekend", "Would you like", "to grab coffee"], opening: "Do you have any plans this weekend?", openingKo: "이번 주말에 계획이 있으세요?", reply: "That sounds great. Saturday works for me.", replyKo: "좋아요. 저는 토요일이 괜찮아요." }
    ]
  }
];

const chineseScenarios = [
  {
    id: "zh-cafe", icon: "茶", tab: "카페", place: "카페 · 주문 회화", title: "카페에서 원하는 메뉴 주문하기", description: "수량, 당도, 추천 메뉴를 간단하고 정확하게 말해요.",
    followTurns: [
      { suggestions: ["中杯，谢谢。", "小杯就可以。"], reply: "好的。还需要别的吗？", replyKo: "네. 더 필요한 것은 있으신가요?" },
      { suggestions: ["不用了，谢谢。", "再要一个面包。"], reply: "好的，请到前台付款。", replyKo: "네. 카운터에서 결제해 주세요." }
    ],
    days: [
      { id: "zh-cafe-1", title: "음료 한 잔 주문", focus: "메뉴와 수량 말하기", word: "一杯", reading: "yì bēi", meaning: "한 잔", options: ["한 잔", "한 병", "한 접시", "한 개"], phrase: "我要一杯冰美式。", translation: "아이스 아메리카노 한 잔 주세요.", tokens: ["我", "要", "一杯", "冰美式"], pool: ["冰美式", "一杯", "我", "要"], opening: "您好，请问要喝什么？", openingKo: "안녕하세요, 무엇을 드시겠어요?", reply: "好的，请问要多大杯？", replyKo: "네, 어떤 사이즈로 드릴까요?" },
      { id: "zh-cafe-2", title: "당도 조절", focus: "원하는 단맛 정도 요청하기", word: "少糖", reading: "shǎo táng", meaning: "설탕 적게", options: ["설탕 적게", "얼음 적게", "아주 달게", "뜨겁게"], phrase: "少糖，谢谢。", translation: "설탕은 적게 해 주세요. 감사합니다.", tokens: ["少糖", "谢谢"], pool: ["谢谢", "少糖"], opening: "甜度要正常吗？", openingKo: "당도는 보통으로 할까요?", reply: "好的，给您少糖。", replyKo: "네, 설탕은 적게 해 드릴게요." },
      { id: "zh-cafe-3", title: "추천 메뉴 묻기", focus: "인기 있는 메뉴 질문하기", word: "推荐", reading: "tuījiàn", meaning: "추천하다", options: ["추천하다", "주문하다", "결제하다", "포장하다"], phrase: "你推荐什么？", translation: "무엇을 추천하시나요?", tokens: ["你", "推荐", "什么"], pool: ["什么", "你", "推荐"], opening: "您想好要点什么了吗？", openingKo: "무엇을 주문할지 정하셨나요?", reply: "我们的拿铁很受欢迎。", replyKo: "저희 라테가 아주 인기 있어요." }
    ]
  },
  {
    id: "zh-travel", icon: "行", tab: "여행", place: "도시 · 이동 회화", title: "교통과 이동 정보 확인하기", description: "지하철 위치, 환승, 공항 소요 시간을 물어봐요.",
    followTurns: [
      { suggestions: ["要走多长时间？", "可以坐地铁吗？"], reply: "大概需要二十分钟。", replyKo: "약 20분 정도 걸립니다." },
      { suggestions: ["谢谢你的帮助。", "好的，我知道了。"], reply: "不客气，祝您一路顺风！", replyKo: "천만에요. 좋은 여행 되세요!" }
    ],
    days: [
      { id: "zh-travel-1", title: "지하철역 찾기", focus: "가까운 역의 방향 묻기", word: "地铁站", reading: "dìtiězhàn", meaning: "지하철역", options: ["지하철역", "버스 정류장", "공항", "택시 승강장"], phrase: "地铁站怎么走？", translation: "지하철역은 어떻게 가나요?", tokens: ["地铁站", "怎么走"], pool: ["怎么走", "地铁站"], opening: "您好，需要帮忙吗？", openingKo: "안녕하세요, 도움이 필요하신가요?", reply: "一直走，然后右转。", replyKo: "쭉 가서 오른쪽으로 도세요." },
      { id: "zh-travel-2", title: "환승 확인", focus: "갈아타야 하는지 묻기", word: "换乘", reading: "huànchéng", meaning: "환승하다", options: ["환승하다", "도착하다", "출발하다", "예약하다"], phrase: "我需要换乘吗？", translation: "저는 환승해야 하나요?", tokens: ["我", "需要", "换乘", "吗"], pool: ["换乘", "我", "吗", "需要"], opening: "您要去市中心吗？", openingKo: "도심으로 가시나요?", reply: "不用，这条线可以直达。", replyKo: "아니요, 이 노선으로 바로 갈 수 있어요." },
      { id: "zh-travel-3", title: "공항 소요 시간", focus: "이동에 걸리는 시간 확인하기", word: "机场", reading: "jīchǎng", meaning: "공항", options: ["공항", "기차역", "호텔", "터미널"], phrase: "去机场要多长时间？", translation: "공항까지 얼마나 걸리나요?", tokens: ["去机场", "要", "多长时间"], pool: ["多长时间", "去机场", "要"], opening: "您想去哪里？", openingKo: "어디로 가고 싶으신가요?", reply: "坐出租车大概四十分钟。", replyKo: "택시로 약 40분 걸립니다." }
    ]
  },
  {
    id: "zh-work", icon: "工", tab: "직장", place: "오피스 · 업무 회화", title: "업무 일정과 의견 조율하기", description: "마감일, 미팅 시간, 피드백을 정중하게 확인해요.",
    followTurns: [
      { suggestions: ["下午可以。", "明天可以吗？"], reply: "那我们下午三点开会吧。", replyKo: "그럼 오후 3시에 회의하죠." },
      { suggestions: ["好的。", "我会发邀请。"], reply: "没问题，到时候见。", replyKo: "좋습니다. 그때 뵙겠습니다." }
    ],
    days: [
      { id: "zh-work-1", title: "마감일 확인", focus: "프로젝트 기한 질문하기", word: "截止日期", reading: "jiézhǐ rìqī", meaning: "마감일", options: ["마감일", "담당자", "예산", "회의실"], phrase: "这个项目的截止日期是什么时候？", translation: "이 프로젝트의 마감일은 언제인가요?", tokens: ["这个项目的", "截止日期", "是什么时候"], pool: ["是什么时候", "这个项目的", "截止日期"], opening: "关于这个项目，你有问题吗？", openingKo: "이 프로젝트에 관해 질문이 있나요?", reply: "下周五之前完成。", replyKo: "다음 주 금요일 전까지 완료하면 됩니다." },
      { id: "zh-work-2", title: "미팅 시간 제안", focus: "상대의 가능한 시간 확인하기", word: "开会", reading: "kāihuì", meaning: "회의하다", options: ["회의하다", "퇴근하다", "보고하다", "출장 가다"], phrase: "你下午有时间开会吗？", translation: "오후에 회의할 시간 있으세요?", tokens: ["你下午", "有时间", "开会吗"], pool: ["开会吗", "你下午", "有时间"], opening: "我们什么时候讨论这个方案？", openingKo: "이 안건은 언제 논의할까요?", reply: "我下午三点以后有时间。", replyKo: "오후 3시 이후에 시간이 있어요." },
      { id: "zh-work-3", title: "의견 요청", focus: "결과물에 대한 피드백 부탁하기", word: "意见", reading: "yìjiàn", meaning: "의견", options: ["의견", "결과", "승인", "일정"], phrase: "可以给我一些意见吗？", translation: "제게 의견을 좀 주실 수 있나요?", tokens: ["可以", "给我", "一些意见", "吗"], pool: ["一些意见", "吗", "可以", "给我"], opening: "这个版本已经完成了吗？", openingKo: "이 버전은 완성됐나요?", reply: "可以，我下午看一下。", replyKo: "네, 오후에 살펴볼게요." }
    ]
  },
  {
    id: "zh-social", icon: "友", tab: "모임", place: "모임 · 스몰토크", title: "새로운 사람과 자연스럽게 대화하기", description: "첫인사, 직업, 주말 약속으로 대화를 이어가요.",
    followTurns: [
      { suggestions: ["我住在首尔。", "我是来出差的。"], reply: "原来如此。你觉得这里怎么样？", replyKo: "그렇군요. 이곳은 어떠세요?" },
      { suggestions: ["我很喜欢这里。", "我还在慢慢了解。"], reply: "有机会我们一起喝咖啡吧。", replyKo: "기회가 되면 같이 커피 마셔요." }
    ],
    days: [
      { id: "zh-social-1", title: "첫인사와 소개", focus: "이름을 말하고 반갑게 인사하기", word: "认识", reading: "rènshi", meaning: "알다 · 만나다", options: ["알다 · 만나다", "소개하다", "기억하다", "연락하다"], phrase: "很高兴认识你。", translation: "만나서 반가워요.", tokens: ["很高兴", "认识你"], pool: ["认识你", "很高兴"], opening: "你好，我们是第一次见吧？", openingKo: "안녕하세요, 우리 처음 만나는 거죠?", reply: "你好，很高兴认识你。", replyKo: "안녕하세요, 만나서 반가워요." },
      { id: "zh-social-2", title: "하는 일 묻기", focus: "직업과 업무에 관해 질문하기", word: "工作", reading: "gōngzuò", meaning: "일 · 직업", options: ["일 · 직업", "취미", "전공", "약속"], phrase: "你做什么工作？", translation: "어떤 일을 하세요?", tokens: ["你", "做什么", "工作"], pool: ["工作", "你", "做什么"], opening: "你为什么来这里？", openingKo: "무슨 일로 이곳에 오셨어요?", reply: "我做产品设计。", replyKo: "저는 제품 디자인 일을 해요." },
      { id: "zh-social-3", title: "주말 약속 제안", focus: "편하게 다음 만남 제안하기", word: "周末", reading: "zhōumò", meaning: "주말", options: ["주말", "평일", "저녁", "휴가"], phrase: "周末一起喝咖啡吗？", translation: "주말에 같이 커피 마실래요?", tokens: ["周末", "一起", "喝咖啡", "吗"], pool: ["喝咖啡", "周末", "吗", "一起"], opening: "你周末有什么安排？", openingKo: "주말에 무슨 계획이 있으세요?", reply: "好啊，星期六怎么样？", replyKo: "좋아요, 토요일은 어떠세요?" }
    ]
  }
];

const languageMeta = {
  ja: { label: "일본어", speech: "ja-JP", htmlLang: "ja", retry: "もう一度お願いします。", input: "일본어" },
  en: { label: "영어", speech: "en-US", htmlLang: "en", retry: "Could you say that again?", input: "영어" },
  zh: { label: "중국어", speech: "zh-CN", htmlLang: "zh-CN", retry: "请再说一遍。", input: "중국어" }
};

const levelProfiles = {
  ja: [
    { name: "입문", standard: "Pre-N5", course: "1 · 입문", goal: "문자와 생존 표현", bands: ["1A", "1B"], choiceCount: 2, showReading: true, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 55, speechRate: .7 },
    { name: "기초", standard: "N5–N4", course: "2 · 기초", goal: "짧은 일상 문답", bands: ["2A", "2B"], choiceCount: 4, showReading: true, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 65, speechRate: .78 },
    { name: "독립", standard: "N3", course: "3 · 독립", goal: "경험과 이유 설명", bands: ["3A", "3B"], choiceCount: 4, showReading: false, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 75, speechRate: .86 },
    { name: "고급", standard: "N2–N1", course: "4 · 고급", goal: "관계·격식·뉘앙스 조절", bands: ["4A", "4B"], choiceCount: 4, showReading: false, showTranslation: false, showDialogueKo: false, suggestionCount: 2, passScore: 85, speechRate: .94 },
    { name: "숙련", standard: "N1+", course: "5 · 숙련", goal: "태도·관용·전문 소통", bands: ["5A", "5B"], choiceCount: 4, showReading: false, showTranslation: false, showDialogueKo: false, suggestionCount: 1, passScore: 92, speechRate: 1 }
  ],
  en: [
    { name: "입문", standard: "Pre-A1", course: "1 · 입문", goal: "단어와 생존 표현", bands: ["1A", "1B"], choiceCount: 2, showReading: true, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 55, speechRate: .72 },
    { name: "기초", standard: "A1–A2", course: "2 · 기초", goal: "짧은 일상 문답", bands: ["2A", "2B"], choiceCount: 4, showReading: true, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 65, speechRate: .8 },
    { name: "독립", standard: "B1–B2", course: "3 · 독립", goal: "경험·이유·상황 설명", bands: ["3A", "3B"], choiceCount: 4, showReading: false, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 75, speechRate: .88 },
    { name: "고급", standard: "C1", course: "4 · 고급", goal: "격식·설득·뉘앙스 조절", bands: ["4A", "4B"], choiceCount: 4, showReading: false, showTranslation: false, showDialogueKo: false, suggestionCount: 2, passScore: 85, speechRate: .96 },
    { name: "숙련", standard: "C2+", course: "5 · 숙련", goal: "암시·유머·전문 소통", bands: ["5A", "5B"], choiceCount: 4, showReading: false, showTranslation: false, showDialogueKo: false, suggestionCount: 1, passScore: 92, speechRate: 1 }
  ],
  zh: [
    { name: "입문", standard: "Pre-HSK 1", course: "1 · 입문", goal: "병음·성조와 생존 표현", bands: ["1A", "1B"], choiceCount: 2, showReading: true, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 55, speechRate: .7 },
    { name: "기초", standard: "HSK 1–3", course: "2 · 기초", goal: "짧은 일상 문답", bands: ["2A", "2B"], choiceCount: 4, showReading: true, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 65, speechRate: .78 },
    { name: "독립", standard: "HSK 4", course: "3 · 독립", goal: "경험·이유·상황 설명", bands: ["3A", "3B"], choiceCount: 4, showReading: false, showTranslation: true, showDialogueKo: true, suggestionCount: 3, passScore: 75, speechRate: .86 },
    { name: "고급", standard: "HSK 5–6", course: "4 · 고급", goal: "격식·토론·뉘앙스 조절", bands: ["4A", "4B"], choiceCount: 4, showReading: false, showTranslation: false, showDialogueKo: false, suggestionCount: 2, passScore: 85, speechRate: .94 },
    { name: "숙련", standard: "HSK 6+", course: "5 · 숙련", goal: "성어·암시·전문 소통", bands: ["5A", "5B"], choiceCount: 4, showReading: false, showTranslation: false, showDialogueKo: false, suggestionCount: 1, passScore: 92, speechRate: 1 }
  ]
};

const phrase = (text, translation, tokens) => ({ phrase: text, translation, tokens, pool: [...tokens.slice(1), tokens[0]] });

const starterPhraseSets = {
  en: [
    phrase("One iced Americano to go, please.", "아이스 아메리카노 한 잔 포장해 주세요.", ["One iced Americano", "to go", "please"]),
    phrase("Oat milk, please.", "귀리 우유로 부탁해요.", ["Oat milk", "please"]),
    phrase("What's popular?", "무엇이 인기 있나요?", ["What's", "popular"]),
    phrase("Which platform?", "어느 승강장인가요?", ["Which", "platform"]),
    phrase("Do I change trains?", "기차를 갈아타나요?", ["Do I", "change trains"]),
    phrase("I have a reservation.", "예약했습니다.", ["I have", "a reservation"]),
    phrase("When is it due?", "언제까지인가요?", ["When is", "it due"]),
    phrase("Can we meet this afternoon?", "오늘 오후에 만날 수 있을까요?", ["Can we meet", "this afternoon"]),
    phrase("Please check this.", "이것을 확인해 주세요.", ["Please", "check this"]),
    phrase("Hi, I'm Min.", "안녕하세요, 저는 민이에요.", ["Hi", "I'm Min"]),
    phrase("What do you do?", "무슨 일을 하세요?", ["What", "do you do"]),
    phrase("Coffee this weekend?", "이번 주말에 커피 어때요?", ["Coffee", "this weekend"])
  ],
  ja: [
    phrase("アイスコーヒーを一つ、持ち帰りでお願いします。", "아이스커피 하나 포장해 주세요.", ["アイスコーヒーを一つ", "持ち帰りで", "お願いします"]),
    phrase("オーツミルクでお願いします。", "귀리 우유로 부탁해요.", ["オーツミルクで", "お願いします"]),
    phrase("人気のメニューは何ですか。", "인기 메뉴는 무엇인가요?", ["人気のメニューは", "何ですか"]),
    phrase("急行は何番線ですか。", "급행은 몇 번 승강장인가요?", ["急行は", "何番線ですか"]),
    phrase("乗り換えますか。", "환승하나요?", ["乗り換え", "ますか"]),
    phrase("ミンで予約しました。", "민으로 예약했습니다.", ["ミンで", "予約しました"]),
    phrase("いつまでですか。", "언제까지인가요?", ["いつまで", "ですか"]),
    phrase("今日の午後、会えますか。", "오늘 오후에 만날 수 있나요?", ["今日の午後", "会えますか"]),
    phrase("これを見てください。", "이것을 봐 주세요.", ["これを", "見てください"]),
    phrase("はじめまして。ミンです。", "처음 뵙겠습니다. 민입니다.", ["はじめまして", "ミンです"]),
    phrase("お仕事は何ですか。", "무슨 일을 하세요?", ["お仕事は", "何ですか"]),
    phrase("週末、コーヒーを飲みませんか。", "주말에 커피 마실래요?", ["週末", "コーヒーを", "飲みませんか"])
  ],
  zh: [
    phrase("我要一杯冰美式，带走。", "아이스 아메리카노 한 잔 포장해 주세요.", ["我要", "一杯冰美式", "带走"]),
    phrase("请换成燕麦奶。", "귀리 우유로 바꿔 주세요.", ["请换成", "燕麦奶"]),
    phrase("什么最受欢迎？", "무엇이 가장 인기 있나요?", ["什么", "最受欢迎"]),
    phrase("快车在哪个站台？", "급행은 어느 승강장인가요?", ["快车", "在哪个站台"]),
    phrase("我要换车吗？", "저는 갈아타야 하나요?", ["我要", "换车吗"]),
    phrase("我叫金敏，订了房。", "저는 김민이고 방을 예약했습니다.", ["我叫金敏", "订了房"]),
    phrase("什么时候要交？", "언제 제출해야 하나요?", ["什么时候", "要交"]),
    phrase("下午可以开会吗？", "오후에 회의할 수 있나요?", ["下午", "可以开会吗"]),
    phrase("请看一下这个。", "이것을 한번 봐 주세요.", ["请看一下", "这个"]),
    phrase("你好，我叫敏。", "안녕하세요, 저는 민이에요.", ["你好", "我叫敏"]),
    phrase("你做什么工作？", "무슨 일을 하세요?", ["你", "做什么工作"]),
    phrase("周末一起喝咖啡吗？", "주말에 같이 커피 마실래요?", ["周末", "一起喝咖啡吗"])
  ]
};

const elementaryPhraseSets = {
  en: [
    phrase("Could I get an iced Americano to go?", "아이스 아메리카노를 포장해 주시겠어요?", ["Could I get", "an iced Americano", "to go"]),
    phrase("Could I have oat milk instead?", "대신 귀리 우유로 받을 수 있을까요?", ["Could I have", "oat milk", "instead"]),
    phrase("What would you recommend?", "무엇을 추천하시나요?", ["What would", "you recommend"]),
    phrase("Which platform is the airport train on?", "공항 열차는 어느 승강장인가요?", ["Which platform", "is the airport train", "on"]),
    phrase("Do I need to change trains?", "기차를 갈아타야 하나요?", ["Do I need", "to change", "trains"]),
    phrase("I have a reservation under Min Kim.", "김민 이름으로 예약했습니다.", ["I have", "a reservation", "under Min Kim"]),
    phrase("When is this due?", "이것은 언제까지인가요?", ["When is", "this", "due"]),
    phrase("Are you free this afternoon?", "오늘 오후에 시간이 있나요?", ["Are you free", "this afternoon"]),
    phrase("Could you look at this for me?", "이것을 한번 봐주시겠어요?", ["Could you look", "at this", "for me"]),
    phrase("Hi, I'm Min. I'm new here.", "안녕하세요, 저는 민이에요. 여기는 처음이에요.", ["Hi I'm Min", "I'm new", "here"]),
    phrase("What kind of work do you do?", "어떤 일을 하세요?", ["What kind of work", "do you do"]),
    phrase("Would you like to get coffee this weekend?", "이번 주말에 커피 마실래요?", ["Would you like", "to get coffee", "this weekend"])
  ],
  ja: [
    phrase("アイスアメリカーノを持ち帰りでお願いします。", "아이스 아메리카노를 포장해 주세요.", ["アイスアメリカーノを", "持ち帰りで", "お願いします"]),
    phrase("オーツミルクに変えられますか。", "귀리 우유로 바꿀 수 있나요?", ["オーツミルクに", "変えられますか"]),
    phrase("おすすめは何ですか。", "추천 메뉴는 무엇인가요?", ["おすすめは", "何ですか"]),
    phrase("空港行きは何番ホームですか。", "공항행은 몇 번 승강장인가요?", ["空港行きは", "何番ホーム", "ですか"]),
    phrase("乗り換えは必要ですか。", "환승이 필요한가요?", ["乗り換えは", "必要ですか"]),
    phrase("キム・ミンの名前で予約しています。", "김민 이름으로 예약했습니다.", ["キム・ミンの名前で", "予約しています"]),
    phrase("締め切りはいつですか。", "마감은 언제인가요?", ["締め切りは", "いつですか"]),
    phrase("今日の午後は空いていますか。", "오늘 오후는 시간이 있나요?", ["今日の午後は", "空いていますか"]),
    phrase("これを見てもらえますか。", "이것을 봐주실 수 있나요?", ["これを", "見てもらえますか"]),
    phrase("はじめまして、ミンです。ここは初めてです。", "처음 뵙겠습니다, 민입니다. 여기는 처음입니다.", ["はじめましてミンです", "ここは", "初めてです"]),
    phrase("どんなお仕事をしていますか。", "어떤 일을 하시나요?", ["どんなお仕事を", "していますか"]),
    phrase("今週末、コーヒーを飲みませんか。", "이번 주말에 커피 마시지 않을래요?", ["今週末", "コーヒーを", "飲みませんか"])
  ],
  zh: [
    phrase("我要一杯冰美式，麻烦打包。", "아이스 아메리카노 한 잔 포장해 주세요.", ["我要一杯冰美式", "麻烦", "打包"]),
    phrase("可以换成燕麦奶吗？", "귀리 우유로 바꿀 수 있나요?", ["可以换成", "燕麦奶吗"]),
    phrase("你推荐什么？", "무엇을 추천하시나요?", ["你", "推荐什么"]),
    phrase("去机场的车在几号站台？", "공항행 열차는 몇 번 승강장인가요?", ["去机场的车", "在几号", "站台"]),
    phrase("我需要换乘吗？", "환승해야 하나요?", ["我需要", "换乘吗"]),
    phrase("我用金敏的名字订了房。", "김민 이름으로 방을 예약했습니다.", ["我用金敏的名字", "订了房"]),
    phrase("这个什么时候要交？", "이것은 언제 제출해야 하나요?", ["这个", "什么时候", "要交"]),
    phrase("你今天下午有空吗？", "오늘 오후에 시간이 있나요?", ["你今天下午", "有空吗"]),
    phrase("可以帮我看一下这个吗？", "이것을 한번 봐주실 수 있나요?", ["可以帮我", "看一下", "这个吗"]),
    phrase("你好，我叫敏。我刚来这里。", "안녕하세요, 저는 민이에요. 여기 막 왔어요.", ["你好我叫敏", "我刚来", "这里"]),
    phrase("你做什么工作？", "무슨 일을 하세요?", ["你", "做什么工作"]),
    phrase("这个周末一起喝咖啡吗？", "이번 주말에 같이 커피 마실래요?", ["这个周末", "一起", "喝咖啡吗"])
  ]
};

const intermediatePhraseSets = {
  en: [
    phrase("Could I get a medium iced Americano to go?", "중간 사이즈 아이스 아메리카노를 포장해 주시겠어요?", ["Could I get", "a medium iced Americano", "to go"]),
    phrase("Could I switch to oat milk? I'm lactose intolerant.", "귀리 우유로 바꿀 수 있을까요? 유당불내증이 있어요.", ["Could I switch", "to oat milk", "I'm lactose intolerant"]),
    phrase("What would you recommend if I want something light?", "가벼운 음료를 원한다면 무엇을 추천하시나요?", ["What would you recommend", "if I want", "something light"]),
    phrase("Which platform should I use for the airport train?", "공항 열차는 어느 승강장에서 타야 하나요?", ["Which platform", "should I use", "for the airport train"]),
    phrase("Do I need to transfer if I'm going downtown?", "도심으로 가려면 환승해야 하나요?", ["Do I need to transfer", "if I'm going", "downtown"]),
    phrase("I have a two-night reservation under Min Kim.", "김민 이름으로 2박 예약했습니다.", ["I have", "a two-night reservation", "under Min Kim"]),
    phrase("When is this due? I need to plan the review schedule.", "이 일은 언제까지인가요? 검토 일정을 계획해야 합니다.", ["When is this due", "I need to plan", "the review schedule"]),
    phrase("Could we meet this afternoon? I can work around your schedule.", "오늘 오후에 만날 수 있을까요? 일정에 맞추겠습니다.", ["Could we meet this afternoon", "I can work around", "your schedule"]),
    phrase("Could you check this before tomorrow's presentation?", "내일 발표 전에 이것을 확인해 주시겠어요?", ["Could you check this", "before tomorrow's", "presentation"]),
    phrase("Hi, I'm Min. It's my first time at this event.", "안녕하세요, 저는 민이에요. 이 행사는 처음입니다.", ["Hi I'm Min", "It's my first time", "at this event"]),
    phrase("What do you do, and how did you get into that field?", "무슨 일을 하시고 어떻게 그 분야에 들어가셨나요?", ["What do you do", "and how did you get", "into that field"]),
    phrase("Would you like to grab coffee? I'm free Saturday afternoon.", "커피 한잔하실래요? 저는 토요일 오후에 시간이 됩니다.", ["Would you like", "to grab coffee", "I'm free Saturday afternoon"])
  ],
  ja: [
    phrase("アイスアメリカーノをMサイズで、持ち帰りにできますか。", "아이스 아메리카노를 중간 사이즈로 포장할 수 있나요?", ["アイスアメリカーノをMサイズで", "持ち帰りに", "できますか"]),
    phrase("オーツミルクに変えられますか。乳製品が苦手なんです。", "귀리 우유로 바꿀 수 있나요? 유제품을 잘 못 먹어요.", ["オーツミルクに変えられますか", "乳製品が", "苦手なんです"]),
    phrase("軽めのものが飲みたいんですが、何がおすすめですか。", "가벼운 것을 마시고 싶은데 무엇을 추천하시나요?", ["軽めのものが飲みたいんですが", "何が", "おすすめですか"]),
    phrase("空港行きの電車は何番ホームから乗れますか。", "공항행 열차는 몇 번 승강장에서 탈 수 있나요?", ["空港行きの電車は", "何番ホームから", "乗れますか"]),
    phrase("市内へ行く場合、乗り換えは必要ですか。", "시내로 갈 경우 환승이 필요한가요?", ["市内へ行く場合", "乗り換えは", "必要ですか"]),
    phrase("キム・ミンの名前で二泊予約しています。", "김민 이름으로 2박 예약했습니다.", ["キム・ミンの名前で", "二泊", "予約しています"]),
    phrase("締め切りはいつですか。確認の日程を決めたいです。", "마감은 언제인가요? 검토 일정을 정하고 싶습니다.", ["締め切りはいつですか", "確認の日程を", "決めたいです"]),
    phrase("今日の午後はいかがですか。そちらの予定に合わせます。", "오늘 오후는 어떠세요? 그쪽 일정에 맞추겠습니다.", ["今日の午後はいかがですか", "そちらの予定に", "合わせます"]),
    phrase("明日の発表の前に、これを確認してもらえますか。", "내일 발표 전에 이것을 확인해 주실 수 있나요?", ["明日の発表の前に", "これを", "確認してもらえますか"]),
    phrase("はじめまして、ミンです。このイベントは初めてです。", "처음 뵙겠습니다, 민입니다. 이 행사는 처음입니다.", ["はじめましてミンです", "このイベントは", "初めてです"]),
    phrase("どんなお仕事をしていますか。なぜその分野を選びましたか。", "어떤 일을 하시나요? 왜 그 분야를 선택하셨나요?", ["どんなお仕事をしていますか", "なぜその分野を", "選びましたか"]),
    phrase("コーヒーを飲みに行きませんか。土曜の午後なら空いています。", "커피 마시러 갈래요? 토요일 오후라면 시간이 됩니다.", ["コーヒーを飲みに行きませんか", "土曜の午後なら", "空いています"])
  ],
  zh: [
    phrase("我要一杯中杯冰美式，麻烦帮我打包。", "중간 사이즈 아이스 아메리카노 한 잔 포장해 주세요.", ["我要一杯中杯冰美式", "麻烦帮我", "打包"]),
    phrase("可以换成燕麦奶吗？我不太能喝牛奶。", "귀리 우유로 바꿀 수 있나요? 저는 우유를 잘 못 마셔요.", ["可以换成燕麦奶吗", "我不太能", "喝牛奶"]),
    phrase("我想喝清淡一点的，你推荐什么？", "조금 가벼운 것을 마시고 싶은데 무엇을 추천하시나요?", ["我想喝清淡一点的", "你", "推荐什么"]),
    phrase("去机场的火车应该在哪个站台坐？", "공항행 열차는 어느 승강장에서 타야 하나요?", ["去机场的火车", "应该在", "哪个站台坐"]),
    phrase("如果去市中心，我需要换乘吗？", "도심으로 간다면 환승해야 하나요?", ["如果去市中心", "我需要", "换乘吗"]),
    phrase("我用金敏的名字订了两晚。", "김민 이름으로 2박 예약했습니다.", ["我用金敏的名字", "订了", "两晚"]),
    phrase("这个什么时候要交？我需要安排审核时间。", "이것은 언제 제출해야 하나요? 검토 시간을 정해야 합니다.", ["这个什么时候要交", "我需要安排", "审核时间"]),
    phrase("我们下午可以开会吗？我可以配合你的时间。", "오후에 회의할 수 있을까요? 당신 시간에 맞출 수 있어요.", ["我们下午可以开会吗", "我可以配合", "你的时间"]),
    phrase("可以在明天的演示之前帮我看一下吗？", "내일 발표 전에 한번 봐 주실 수 있나요?", ["可以在明天的演示之前", "帮我", "看一下吗"]),
    phrase("你好，我叫敏。这是我第一次参加这个活动。", "안녕하세요, 저는 민이에요. 이 행사에는 처음 참석합니다.", ["你好我叫敏", "这是我第一次", "参加这个活动"]),
    phrase("你做什么工作？你为什么选择这个行业？", "무슨 일을 하세요? 왜 이 업계를 선택하셨나요?", ["你做什么工作", "你为什么选择", "这个行业"]),
    phrase("一起喝咖啡怎么样？我星期六下午有空。", "같이 커피 마시는 건 어때요? 저는 토요일 오후에 시간이 있어요.", ["一起喝咖啡怎么样", "我星期六下午", "有空"])
  ]
};

const advancedPhraseSets = {
  en: [
    phrase("Could I get an iced Americano to go with half the usual syrup?", "아이스 아메리카노를 시럽은 절반만 넣어 포장해 주시겠어요?", ["Could I get", "an iced Americano to go", "with half the usual syrup"]),
    phrase("Would it be possible to substitute oat milk?", "귀리 우유로 변경할 수 있을까요?", ["Would it be possible", "to substitute", "oat milk"]),
    phrase("Could you recommend something that isn't too sweet?", "너무 달지 않은 메뉴를 추천해 주시겠어요?", ["Could you recommend", "something", "that isn't too sweet"]),
    phrase("Could you tell me which platform the express train leaves from?", "급행열차가 어느 승강장에서 출발하는지 알려주시겠어요?", ["Could you tell me", "which platform", "the express train leaves from"]),
    phrase("Would transferring at Central be faster?", "센트럴에서 환승하는 편이 더 빠를까요?", ["Would transferring", "at Central", "be faster"]),
    phrase("I have a reservation under Min Kim. Is early check-in available?", "김민 이름으로 예약했습니다. 조기 체크인이 가능한가요?", ["I have a reservation", "under Min Kim", "Is early check-in available"]),
    phrase("Could you confirm whether Friday is the final deadline?", "금요일이 최종 마감인지 확인해 주시겠어요?", ["Could you confirm", "whether Friday is", "the final deadline"]),
    phrase("Would you have fifteen minutes for a brief catch-up this afternoon?", "오늘 오후에 15분 정도 짧게 이야기할 시간이 있으실까요?", ["Would you have fifteen minutes", "for a brief catch-up", "this afternoon"]),
    phrase("I'd value your feedback on how we could strengthen this draft.", "이 초안을 어떻게 보완하면 좋을지 의견을 듣고 싶습니다.", ["I'd value your feedback", "on how we could strengthen", "this draft"]),
    phrase("I don't believe we've been introduced. I'm Min.", "아직 정식으로 인사하지 못한 것 같네요. 저는 민입니다.", ["I don't believe", "we've been introduced", "I'm Min"]),
    phrase("What field do you work in?", "어떤 분야에서 일하세요?", ["What field", "do you work in"]),
    phrase("Would you be interested in getting coffee this weekend?", "이번 주말에 커피 한잔하실래요?", ["Would you be interested", "in getting coffee", "this weekend"])
  ],
  ja: [
    phrase("テイクアウトで、シロップは半分にしていただけますか。", "포장으로, 시럽은 절반만 넣어 주실 수 있나요?", ["テイクアウトで", "シロップは半分に", "していただけますか"]),
    phrase("牛乳をオーツミルクに変更していただけますか。", "우유를 귀리 우유로 변경해 주실 수 있나요?", ["牛乳を", "オーツミルクに", "変更していただけますか"]),
    phrase("甘すぎないもので、おすすめはありますか。", "너무 달지 않은 것으로 추천이 있나요?", ["甘すぎないもので", "おすすめは", "ありますか"]),
    phrase("急行が何番線から出るか教えていただけますか。", "급행이 몇 번 승강장에서 출발하는지 알려주실 수 있나요?", ["急行が", "何番線から出るか", "教えていただけますか"]),
    phrase("中央駅で乗り換えたほうが早いですか。", "중앙역에서 환승하는 편이 더 빠른가요?", ["中央駅で", "乗り換えたほうが", "早いですか"]),
    phrase("キム・ミンの名前で予約しています。早めのチェックインは可能ですか。", "김민 이름으로 예약했습니다. 조기 체크인이 가능한가요?", ["キム・ミンの名前で", "予約しています", "早めのチェックインは可能ですか"]),
    phrase("最終の締め切りが金曜日か確認していただけますか。", "최종 마감이 금요일인지 확인해 주실 수 있나요?", ["最終の締め切りが", "金曜日か", "確認していただけますか"]),
    phrase("今日の午後、十五分ほどお時間をいただけますか。", "오늘 오후에 15분 정도 시간 괜찮으실까요?", ["今日の午後", "十五分ほど", "お時間をいただけますか"]),
    phrase("この案を改善するためのご意見をいただけると助かります。", "이 안을 개선하기 위한 의견을 주시면 감사하겠습니다.", ["この案を改善するための", "ご意見を", "いただけると助かります"]),
    phrase("まだきちんとご挨拶していませんでしたね。ミンです。", "아직 제대로 인사하지 못했네요. 민입니다.", ["まだきちんと", "ご挨拶していませんでしたね", "ミンです"]),
    phrase("差し支えなければ、どんなお仕事をされていますか。", "괜찮으시다면 어떤 일을 하고 계신가요?", ["差し支えなければ", "どんなお仕事を", "されていますか"]),
    phrase("ご都合がよければ、週末にコーヒーでもいかがですか。", "괜찮으시다면 주말에 커피라도 어떠세요?", ["ご都合がよければ", "週末にコーヒーでも", "いかがですか"])
  ],
  zh: [
    phrase("麻烦帮我做成外带的，糖浆放一半就好。", "포장으로 해 주시고 시럽은 절반만 넣어 주세요.", ["麻烦帮我", "做成外带的", "糖浆放一半就好"]),
    phrase("请问可以把牛奶换成燕麦奶吗？", "우유를 귀리 우유로 바꿀 수 있을까요?", ["请问可以", "把牛奶换成", "燕麦奶吗"]),
    phrase("可以推荐一款不太甜的饮料吗？", "너무 달지 않은 음료를 추천해 주시겠어요?", ["可以推荐", "一款不太甜的", "饮料吗"]),
    phrase("请问快车从哪个站台出发？", "급행열차는 어느 승강장에서 출발하나요?", ["请问快车", "从哪个站台", "出发"]),
    phrase("在中心站换乘会不会更快？", "중앙역에서 환승하면 더 빠를까요?", ["在中心站", "换乘", "会不会更快"]),
    phrase("我用金敏的名字订了房，请问可以提前入住吗？", "김민 이름으로 예약했습니다. 조기 체크인이 가능한가요?", ["我用金敏的名字", "订了房", "请问可以提前入住吗"]),
    phrase("可以确认一下最终截止日期是不是星期五吗？", "최종 마감일이 금요일인지 확인해 주실 수 있나요?", ["可以确认一下", "最终截止日期", "是不是星期五吗"]),
    phrase("今天下午可以抽十五分钟简单聊一下吗？", "오늘 오후에 15분 정도 잠깐 이야기할 수 있을까요?", ["今天下午", "可以抽十五分钟", "简单聊一下吗"]),
    phrase("我想听听你对如何改进这版方案的意见。", "이 안을 어떻게 개선할지 의견을 듣고 싶습니다.", ["我想听听", "你对如何改进这版方案的", "意见"]),
    phrase("我们好像还没正式认识，我叫敏。", "우리 아직 정식으로 인사하지 않은 것 같네요. 저는 민이에요.", ["我们好像", "还没正式认识", "我叫敏"]),
    phrase("如果方便的话，你是做哪个领域的？", "괜찮다면 어떤 분야에서 일하세요?", ["如果方便的话", "你是做", "哪个领域的"]),
    phrase("你这个周末有兴趣一起喝杯咖啡吗？", "이번 주말에 함께 커피 한잔하실래요?", ["你这个周末", "有兴趣", "一起喝杯咖啡吗"])
  ]
};

const nativePhraseSets = {
  en: [
    phrase("Could I grab a flat white to go, and go easy on the syrup?", "플랫화이트를 포장해 주시고 시럽은 조금만 넣어 주실래요?", ["Could I grab", "a flat white to go", "and go easy on the syrup"]),
    phrase("Mind swapping the dairy for oat milk?", "우유를 귀리 우유로 바꿔 주실래요?", ["Mind swapping", "the dairy", "for oat milk"]),
    phrase("What's your go-to if I want something not too sweet?", "너무 달지 않은 걸 원한다면 보통 무엇을 추천하세요?", ["What's your go-to", "if I want something", "not too sweet"]),
    phrase("Do you happen to know which platform the express pulls into?", "급행이 어느 승강장으로 들어오는지 혹시 아시나요?", ["Do you happen to know", "which platform", "the express pulls into"]),
    phrase("Am I better off transferring at Central or staying on this line?", "센트럴에서 환승하는 게 나을까요, 이 노선을 계속 타는 게 나을까요?", ["Am I better off", "transferring at Central", "or staying on this line"]),
    phrase("I have a booking under Min Kim—would it be possible to check in a little early?", "김민 이름으로 예약했는데 조금 일찍 체크인할 수 있을까요?", ["I have a booking under Min Kim", "would it be possible", "to check in a little early"]),
    phrase("Just so we're aligned, are we still aiming for close of business Friday?", "서로 확인차 묻는데, 금요일 업무 종료까지가 목표인 게 맞죠?", ["Just so we're aligned", "are we still aiming for", "close of business Friday"]),
    phrase("Could we carve out fifteen minutes this afternoon to sync?", "오늘 오후에 15분 정도 시간을 내서 진행 상황을 맞춰볼까요?", ["Could we carve out", "fifteen minutes this afternoon", "to sync"]),
    phrase("I'd appreciate your candid take on where this draft falls short.", "이 초안이 부족한 부분에 대한 솔직한 의견을 듣고 싶습니다.", ["I'd appreciate", "your candid take", "on where this draft falls short"]),
    phrase("I don't think we've crossed paths—I'm Min, by the way.", "우리 아직 마주친 적 없는 것 같네요. 참, 저는 민이에요.", ["I don't think", "we've crossed paths", "I'm Min by the way"]),
    phrase("What line of work are you in, if you don't mind me asking?", "괜찮다면 어떤 업계에서 일하시는지 여쭤봐도 될까요?", ["What line of work", "are you in", "if you don't mind me asking"]),
    phrase("If you're free, fancy grabbing coffee sometime this weekend?", "시간 괜찮으면 이번 주말쯤 커피 한잔할래요?", ["If you're free", "fancy grabbing coffee", "sometime this weekend"])
  ],
  ja: [
    phrase("テイクアウトで、シロップは気持ち控えめにしてもらえますか。", "포장으로, 시럽은 조금 적게 해 주실래요?", ["テイクアウトで", "シロップは気持ち控えめに", "してもらえますか"]),
    phrase("ミルクをオーツに替えてもらうことってできますか。", "우유를 귀리 우유로 바꿔 주실 수 있나요?", ["ミルクをオーツに", "替えてもらうことって", "できますか"]),
    phrase("甘さ控えめで、間違いないやつってありますか。", "덜 달면서 실패 없는 메뉴가 있을까요?", ["甘さ控えめで", "間違いないやつって", "ありますか"]),
    phrase("急行って何番線に入りますか。", "급행은 몇 번 승강장으로 들어오나요?", ["急行って", "何番線に", "入りますか"]),
    phrase("このまま行くのと中央で乗り換えるの、どっちが早いですか。", "그대로 가는 것과 중앙역에서 환승하는 것 중 어느 쪽이 빠른가요?", ["このまま行くのと", "中央で乗り換えるの", "どっちが早いですか"]),
    phrase("キム・ミンで予約しているんですが、少し早めに入れたりしますか。", "김민으로 예약했는데 조금 일찍 들어갈 수 있을까요?", ["キム・ミンで", "予約しているんですが", "少し早めに入れたりしますか"]),
    phrase("念のためですが、金曜の終業時までという認識で合っていますか。", "확인차 묻는데 금요일 업무 종료까지라는 이해가 맞나요?", ["念のためですが", "金曜の終業時までという認識で", "合っていますか"]),
    phrase("今日の午後、十五分だけすり合わせの時間をもらえますか。", "오늘 오후 15분만 진행 상황을 맞출 시간을 주실 수 있나요?", ["今日の午後", "十五分だけ", "すり合わせの時間をもらえますか"]),
    phrase("この案の詰めが甘いところを、率直に教えてもらえると助かります。", "이 안에서 검토가 부족한 부분을 솔직히 알려주시면 도움이 되겠습니다.", ["この案の詰めが甘いところを", "率直に", "教えてもらえると助かります"]),
    phrase("そういえば、まだちゃんと名乗ってませんでしたね。ミンです。", "그러고 보니 아직 제대로 이름을 말하지 않았네요. 민이에요.", ["そういえば", "まだちゃんと名乗ってませんでしたね", "ミンです"]),
    phrase("差し支えなければ、普段はどんなお仕事をされているんですか。", "괜찮다면 평소 어떤 일을 하고 계신가요?", ["差し支えなければ", "普段はどんなお仕事を", "されているんですか"]),
    phrase("もしタイミングが合えば、週末にでもお茶しませんか。", "시간이 맞으면 주말에 차라도 한잔할래요?", ["もしタイミングが合えば", "週末にでも", "お茶しませんか"])
  ],
  zh: [
    phrase("麻烦做成外带，糖浆意思一下就行。", "포장으로 해 주시고 시럽은 맛만 날 정도로 조금만 넣어 주세요.", ["麻烦做成外带", "糖浆", "意思一下就行"]),
    phrase("能把普通牛奶换成燕麦奶吗？", "일반 우유를 귀리 우유로 바꿀 수 있을까요?", ["能把普通牛奶", "换成", "燕麦奶吗"]),
    phrase("想喝点不太甜的，你们家哪款最稳？", "덜 단 걸 마시고 싶은데 여기서는 어떤 메뉴가 가장 무난한가요?", ["想喝点不太甜的", "你们家", "哪款最稳"]),
    phrase("请问快车停靠哪个站台？", "급행은 어느 승강장에 정차하나요?", ["请问快车", "停靠", "哪个站台"]),
    phrase("我是在市中心换乘更快，还是坐这趟车直达更省事？", "도심에서 환승하는 게 빠를까요, 이 열차로 바로 가는 게 편할까요?", ["我是在市中心换乘更快", "还是坐这趟车直达", "更省事"]),
    phrase("我用金敏的名字订了房，能不能稍微提前一点入住？", "김민 이름으로 예약했는데 조금 일찍 체크인할 수 있을까요?", ["我用金敏的名字订了房", "能不能", "稍微提前一点入住"]),
    phrase("我确认一下，我们还是计划周五下班前交付，对吧？", "확인차 묻는데 여전히 금요일 퇴근 전 납품 예정인 거죠?", ["我确认一下", "我们还是计划", "周五下班前交付对吧"]),
    phrase("今天下午能不能抽十五分钟快速对一下进度？", "오늘 오후 15분 정도 시간을 내서 빠르게 진행 상황을 맞춰볼 수 있을까요?", ["今天下午能不能", "抽十五分钟", "快速对一下进度"]),
    phrase("我想听听你的真实看法，这版方案还有哪些地方没做到位？", "솔직한 의견을 듣고 싶어요. 이번 안에서 아직 부족한 부분이 어디인가요?", ["我想听听你的真实看法", "这版方案", "还有哪些地方没做到位"]),
    phrase("说起来我们还没正式认识，我叫敏。", "그러고 보니 우리 아직 정식으로 인사하지 않았네요. 저는 민이에요.", ["说起来", "我们还没正式认识", "我叫敏"]),
    phrase("如果方便问的话，你是做哪一行的？", "괜찮다면 어떤 업계에서 일하는지 여쭤봐도 될까요?", ["如果方便问的话", "你是做", "哪一行的"]),
    phrase("这个周末你有空的话，要不要一起喝杯咖啡？", "이번 주말에 시간 있으면 같이 커피 한잔할래요?", ["这个周末你有空的话", "要不要", "一起喝杯咖啡"])
  ]
};

const curriculumBlueprint = [
  { id: "daily", icon: "日", title: "일상", topics: [
    { title: "인사와 관계 시작", mode: "social", situations: ["처음 만나 인사하기", "이름과 출신 소개하기", "직업이나 전공 소개하기", "상대방에 대해 질문하기", "공통 관심사 찾기", "취미 이야기하기", "서로의 이름 다시 확인하기", "연락처나 SNS 교환하기", "다음에 다시 만나자고 말하기", "자연스럽게 대화 마무리하기"] },
    { title: "일상생활과 스몰토크", mode: "social", situations: ["오늘 하루 어땠는지 묻기", "날씨 이야기하기", "주말에 무엇을 했는지 이야기하기", "오늘 계획 이야기하기", "최근 본 영화나 드라마 이야기하기", "음악이나 취미 이야기하기", "음식 취향 이야기하기", "최근 있었던 재미있는 일 이야기하기", "피곤함이나 컨디션 이야기하기", "대화를 자연스럽게 이어가기"] },
    { title: "식당과 외식", mode: "service", situations: ["식당에 자리 있는지 묻기", "예약 확인하기", "메뉴판 요청하기", "메뉴 추천받기", "음식 재료나 맛 질문하기", "음식과 음료 주문하기", "알레르기나 못 먹는 음식 설명하기", "추가 주문이나 요청하기", "음식에 문제가 있다고 알리기", "계산하고 결제하기"] },
    { title: "쇼핑과 구매", mode: "service", situations: ["원하는 상품 위치 묻기", "상품 가격 확인하기", "다른 색상 요청하기", "다른 사이즈 요청하기", "제품을 착용하거나 사용해보기", "두 제품 비교하기", "할인 여부 묻기", "결제 방법 묻기", "교환 요청하기", "환불 요청하기"] },
    { title: "유용한 표현", mode: "social", useful: true, situations: ["일상적인 맞장구 표현", "놀라움과 감탄 표현", "가볍게 농담하기", "농담을 알아듣고 반응하기", "자주 쓰는 일상 숙어", "친한 사이에서 쓰는 슬랭", "SNS와 메신저 유행어", "어색함을 풀어주는 표현", "말끝을 자연스럽게 흐리는 표현", "격식체와 친근한 말투 구분하기"] },
    { title: "단어 학습", mode: "social", vocabulary: true, situations: ["인사 핵심 어휘", "소개 핵심 어휘", "스몰토크 어휘", "취미와 관심사 어휘", "음식 취향 어휘", "식당 주문 어휘", "쇼핑 어휘", "감정과 컨디션 어휘", "관계 표현 어휘", "일상 종합 어휘"] }
  ]},
  { id: "travel", icon: "旅", title: "여행", topics: [
    { title: "교통과 이동", mode: "service", situations: ["버스 노선 확인하기", "지하철 노선 확인하기", "교통카드나 승차권 구매하기", "목적지까지 가는 방법 묻기", "환승 방법 묻기", "어느 정류장에서 내려야 하는지 묻기", "택시를 잡고 목적지 말하기", "기사에게 특정 장소에 세워달라고 하기", "예상 이동 시간 묻기", "교통 문제로 다른 방법 찾기"] },
    { title: "길 찾기와 위치 설명", mode: "service", situations: ["특정 장소가 어디인지 묻기", "가장 가까운 역 찾기", "화장실 위치 묻기", "지도에서 현재 위치 확인하기", "길 안내 이해하기", "오른쪽·왼쪽·직진 등의 방향 이해하기", "건물이나 랜드마크를 기준으로 위치 찾기", "상대방에게 자신의 위치 설명하기", "만날 장소 설명하기", "길을 잘못 왔을 때 다시 물어보기"] },
    { title: "공항과 출입국", mode: "service", situations: ["항공편 체크인하기", "여권과 예약 정보 제시하기", "좌석 선택하거나 변경하기", "수하물 부치기", "수하물 무게 초과 문제 해결하기", "보안검색 과정에서 질문에 답하기", "탑승구 위치 묻기", "비행기 지연이나 취소 문의하기", "입국심사 질문에 답하기", "수하물이 나오지 않을 때 신고하기"] },
    { title: "숙박", mode: "service", situations: ["호텔 예약 확인하기", "체크인하기", "객실 위치와 시설 안내받기", "와이파이 정보 묻기", "수건이나 생활용품 추가 요청하기", "객실 청소 요청하기", "객실에 문제가 있다고 알리기", "객실 변경 요청하기", "주변 시설이나 관광지 추천받기", "체크아웃하고 요금 확인하기"] },
    { title: "유용한 표현", mode: "service", useful: true, situations: ["현지식 인사와 호칭", "여행 중 자주 듣는 축약어", "길 안내에 쓰는 관용 표현", "식당에서 쓰는 현지식 메뉴 표현", "여행 중 가볍게 농담하기", "예상 밖 상황에 감탄하기", "가격과 비용을 완곡하게 묻기", "관광지에서 쓰는 유행 표현", "친근하게 감사하고 작별하기", "격식과 캐주얼 여행 말투 구분하기"] },
    { title: "단어 학습", mode: "service", vocabulary: true, situations: ["교통 어휘", "길 찾기 어휘", "공항 어휘", "출입국 어휘", "숙박 어휘", "예약 어휘", "관광 어휘", "현지 서비스 어휘", "여행 문제 대응 어휘", "여행 종합 어휘"] }
  ]},
  { id: "social", icon: "社", title: "사회생활", topics: [
    { title: "약속과 사교 활동", mode: "social", situations: ["같이 식사하자고 제안하기", "커피를 마시자고 제안하기", "상대방 일정 묻기", "만날 날짜 정하기", "만날 시간 정하기", "만날 장소 정하기", "초대에 응하거나 거절하기", "약속 시간을 변경하기", "늦는다고 알리기", "약속을 취소하거나 다시 잡기"] },
    { title: "관광과 문화생활", mode: "service", situations: ["관광 안내소에서 정보 얻기", "관광지 운영시간 묻기", "입장권 구매하기", "할인 티켓 문의하기", "투어 예약하기", "박물관이나 전시 관람하기", "공연이나 영화 티켓 구매하기", "사진을 찍어달라고 부탁하기", "현지인에게 추천 장소 묻기", "관광지에 대해 간단한 감상 이야기하기"] },
    { title: "주거와 생활 관리", mode: "service", situations: ["집이나 방 구하기", "집 내부 시설에 대해 질문하기", "월세와 보증금 확인하기", "계약 조건 질문하기", "집주인에게 시설 고장 알리기", "수도·전기·가스 문제 문의하기", "택배나 우편물 받기", "이웃에게 인사하기", "소음 문제 이야기하기", "이사 관련 사항 조율하기"] },
    { title: "공공기관과 생활 서비스", mode: "service", situations: ["은행에서 계좌 만들기", "ATM이나 카드 문제 문의하기", "우체국에서 우편 보내기", "택배 보내기", "휴대전화나 인터넷 가입하기", "관공서에서 필요한 서류 묻기", "신청서 작성 방법 묻기", "신분증이나 증명서 발급 문의하기", "번호표를 받고 순서 기다리기", "처리 결과나 완료 시점 확인하기"] },
    { title: "유용한 표현", mode: "social", useful: true, situations: ["자연스럽게 맞장구치고 공감하기", "분위기를 살리는 농담", "친한 사이에서 쓰는 숙어", "모임과 파티에서 쓰는 슬랭", "SNS와 메신저 유행어", "부담 없이 자연스럽게 칭찬하기", "칭찬에 겸손하게 반응하기", "은근하게 관심 표현하기", "어색한 상황을 자연스럽게 넘기기", "관계에 맞는 말투 선택하기"] },
    { title: "단어 학습", mode: "social", vocabulary: true, situations: ["약속 어휘", "사교 활동 어휘", "문화생활 어휘", "주거 어휘", "생활 관리 어휘", "은행 어휘", "공공기관 어휘", "생활 서비스 어휘", "관계와 예절 어휘", "사회생활 종합 어휘"] }
  ]},
  { id: "work", icon: "働", title: "학교·직장", topics: [
    { title: "학교와 수업", mode: "professional", situations: ["새로운 반에서 자기소개하기", "수업 내용을 질문하기", "모르는 부분 다시 설명해달라고 하기", "과제 내용 확인하기", "과제 제출 기한 묻기", "시험 일정과 범위 묻기", "친구에게 필기 내용 묻기", "조별 활동 역할 정하기", "수업 발표하기", "선생님과 학업 상담하기"] },
    { title: "직장과 업무", mode: "professional", situations: ["새로운 직장에서 자기소개하기", "오늘 해야 할 업무 확인하기", "동료에게 업무 도움 요청하기", "업무를 요청하거나 전달하기", "업무 진행 상황 보고하기", "마감 일정 확인하기", "업무 우선순위 조율하기", "문제가 생겼다고 보고하기", "업무 인수인계하기", "퇴근 전 해야 할 일 확인하기"] },
    { title: "회의와 의견 교환", mode: "professional", situations: ["회의 시작 전 가벼운 대화하기", "자신의 의견 제시하기", "상대방 의견에 동의하기", "정중하게 반대 의견 말하기", "이유나 근거 설명하기", "이해하지 못한 부분 질문하기", "상대방에게 추가 설명 요청하기", "새로운 아이디어 제안하기", "역할과 다음 행동 정하기", "회의 내용을 정리하고 마무리하기"] },
    { title: "전화와 비대면 소통", mode: "professional", situations: ["전화를 걸고 자신을 소개하기", "담당자를 바꿔달라고 요청하기", "전화 목적 설명하기", "상대방 말을 잘 못 들었다고 말하기", "다시 말해달라고 요청하기", "이름이나 정보를 철자로 확인하기", "메시지 남기기", "전화로 예약하거나 일정 잡기", "화상회의에서 대화하기", "통화를 마무리하기"] },
    { title: "유용한 표현", mode: "professional", useful: true, situations: ["회의에서 자주 쓰는 관용 표현", "업무 진행 상황을 나타내는 약어", "일정과 마감 관련 슬랭", "아이디어를 자연스럽게 칭찬하기", "완곡하게 반대 의견 말하기", "직장에서 가볍게 농담하기", "업무 메신저 축약 표현", "발표를 잇는 연결 표현", "피드백을 부드럽게 전달하기", "사내 격식체와 캐주얼 말투 구분하기"] },
    { title: "단어 학습", mode: "professional", vocabulary: true, situations: ["수업 어휘", "과제와 시험 어휘", "업무 지시 어휘", "일정과 마감 어휘", "회의 어휘", "의견 교환 어휘", "전화 업무 어휘", "비대면 소통 어휘", "보고와 인수인계 어휘", "학교·직장 종합 어휘"] }
  ]},
  { id: "solve", icon: "解", title: "문제해결", topics: [
    { title: "의료와 건강 서비스", mode: "service", situations: ["병원 예약하기", "접수처에서 방문 목적 말하기", "어디가 아픈지 설명하기", "증상이 언제 시작됐는지 말하기", "통증 정도 설명하기", "의사의 질문에 답하기", "검사 과정에 대해 질문하기", "처방 내용 확인하기", "약국에서 약 받기", "약 복용 방법과 주의사항 묻기"] },
    { title: "구매·서비스 문제 해결", mode: "resolution", situations: ["주문한 상품과 다른 상품을 받은 경우", "음식 주문이 잘못 나온 경우", "결제 금액이 잘못된 경우", "상품이 파손된 경우", "배송이 도착하지 않은 경우", "예약 정보가 잘못된 경우", "서비스가 제공되지 않은 경우", "문제 상황을 직원에게 설명하기", "해결책이나 보상 요청하기", "문제가 해결됐는지 최종 확인하기"] },
    { title: "분실·사고·긴급 상황", mode: "resolution", situations: ["휴대전화를 잃어버렸다고 말하기", "지갑이나 여권 분실 신고하기", "분실물 센터에 문의하기", "경찰에게 도움 요청하기", "도난 상황 설명하기", "교통사고 상황 설명하기", "응급 상황에서 도움 요청하기", "구급차나 경찰을 불러달라고 하기", "자신의 현재 위치 설명하기", "가족이나 지인에게 긴급 상황 알리기"] },
    { title: "감정과 갈등 해결", mode: "resolution", situations: ["감사 표현하기", "실수에 대해 사과하기", "상대방의 사과 받아들이기", "부탁을 정중하게 거절하기", "불편한 점 이야기하기", "기분이 상했다고 설명하기", "상대방의 입장 확인하기", "오해를 설명하고 풀기", "의견 차이를 조율하기", "관계를 좋게 마무리하기"] },
    { title: "유용한 표현", mode: "resolution", useful: true, situations: ["난처함을 완곡하게 표현하기", "침착하게 도움 요청하기", "불만을 부드럽게 전달하기", "단호하지만 무례하지 않게 말하기", "오해를 바로잡는 관용 표현", "긴장을 풀어주는 가벼운 농담", "긴급 상황에서 쓰는 축약 표현", "서비스 현장의 관용 표현", "갈등 뒤 분위기를 회복하는 표현", "상황에 맞게 사과와 감사 표현하기"] },
    { title: "단어 학습", mode: "resolution", vocabulary: true, situations: ["의료 어휘", "증상과 통증 어휘", "약과 처방 어휘", "구매 문제 어휘", "서비스 문제 어휘", "분실과 도난 어휘", "사고와 긴급 상황 어휘", "감정 표현 어휘", "갈등 조율 어휘", "문제해결 종합 어휘"] }
  ]},
  { id: "business", icon: "B", title: "비즈니스", topics: [
    { title: "발표와 프레젠테이션", mode: "business", businessKey: "presentation", situations: ["발표 목적과 순서 소개하기", "핵심 메시지 제시하기", "데이터와 그래프 설명하기", "전환 표현으로 내용 연결하기", "사례와 근거 제시하기", "강조할 포인트 알리기", "청중의 이해 확인하기", "질문에 답변하기", "한계와 다음 과제 설명하기", "발표 요약하고 마무리하기"] },
    { title: "학회와 네트워킹", mode: "business", businessKey: "conference", situations: ["학회 등록과 일정 확인하기", "연구 주제 소개하기", "포스터 세션에서 설명하기", "연구 방법 질문하기", "결과에 대해 토론하기", "연사에게 질문하기", "다른 연구자에게 협업 제안하기", "명함과 연락처 교환하기", "후속 미팅 제안하기", "네트워킹 대화 마무리하기"] },
    { title: "해외 업체와 협업", mode: "business", businessKey: "partner", situations: ["회사와 담당 업무 소개하기", "협업 목표 확인하기", "요구사항 구체화하기", "일정과 마일스톤 합의하기", "역할과 책임 정하기", "진행 상황 공유하기", "기술적 문제 설명하기", "변경 사항 조율하기", "후속 조치와 담당자 정하기", "회의 내용을 확인하고 마무리하기"] },
    { title: "협상과 계약", mode: "business", businessKey: "negotiation", situations: ["제안 조건 설명하기", "가격과 예산 협상하기", "납기와 일정 협상하기", "계약 범위 확인하기", "수정 조건 제안하기", "상대 조건에 질문하기", "정중하게 양보 요청하기", "위험과 책임 범위 논의하기", "잠정 합의 확인하기", "최종 조건과 다음 단계 확정하기"] },
    { title: "유용한 표현", mode: "business", businessUseful: true, situations: ["발표를 여는 공식 표현", "핵심을 강조하는 표현", "슬라이드를 전환하는 표현", "질문을 받는 표현", "학회에서 쓰는 연구 관용어", "네트워킹용 스몰토크", "협업 진행 상황 약어", "협상에서 쓰는 완곡 표현", "전문적인 반대와 보완 표현", "공식 대화를 마무리하는 표현"] },
    { title: "단어 학습", mode: "business", vocabulary: true, situations: ["발표 핵심 어휘", "데이터 설명 어휘", "학회와 연구 어휘", "네트워킹 어휘", "해외 협업 어휘", "프로젝트 관리 어휘", "협상 어휘", "계약 어휘", "위험과 일정 어휘", "비즈니스 종합 어휘"] }
  ]}
];

let curriculum = [];
let scenarios = [];

const intentTranslations = {
  en: [
    ["Nice to meet you.", "I'm Min, and I'm from Korea.", "I work in design.", "What brings you here?", "It looks like we have a lot in common.", "What do you like to do in your free time?", "Sorry, could you remind me of your name?", "Would you like to exchange Instagram accounts?", "We should meet again sometime.", "It was great talking with you."],
    ["How was your day?", "The weather is lovely today.", "What did you do over the weekend?", "What are you up to today?", "Have you watched anything good lately?", "What kind of music are you into?", "What kind of food do you like?", "Something funny happened to me recently.", "I'm a little tired today.", "Really? Tell me more."],
    ["Do you have a table for two?", "I have a reservation under Min Kim.", "Could we see the menu, please?", "What do you recommend?", "Is this dish spicy?", "I'll have this and a sparkling water.", "I'm allergic to peanuts.", "Could we get another plate?", "Excuse me, this isn't what I ordered.", "Could we have the check, please?"],
    ["Where can I find this item?", "How much is this?", "Do you have this in another color?", "Do you have a larger size?", "Can I try this on?", "What's the difference between these two?", "Is this on sale?", "Can I pay by card?", "I'd like to exchange this.", "I'd like to return this for a refund."],
    ["Does this bus go downtown?", "Which subway line should I take?", "I'd like to buy a transit card.", "How can I get to the museum?", "Where should I transfer?", "Which stop should I get off at?", "Please take me to this address.", "Could you drop me off in front of the station?", "How long will it take?", "The line is closed. Is there another way?"],
    ["Where is the city hall?", "Where is the nearest station?", "Where is the restroom?", "Are we here on the map?", "Could you show me the way?", "Do I turn left or go straight?", "Is it near the tall glass building?", "I'm standing by the main entrance.", "Let's meet in front of the museum.", "I think I went the wrong way. Could you help me again?"],
    ["I'd like to check in for my flight.", "Here's my passport and booking confirmation.", "Could I change to an aisle seat?", "I'd like to check this bag.", "My bag is overweight. What can I do?", "I'm only carrying a laptop and a phone.", "Where is gate twenty-four?", "Has my flight been delayed or canceled?", "I'm here for tourism and will stay for five days.", "My suitcase didn't arrive."],
    ["I have a reservation under Min Kim.", "I'd like to check in, please.", "Where is my room, and when is breakfast?", "What's the Wi-Fi password?", "Could I have two more towels?", "Could you clean the room this afternoon?", "The air conditioner isn't working.", "Could I move to another room?", "Could you recommend somewhere nearby?", "I'd like to check out. Could I review the charges?"],
    ["Would you like to have dinner together?", "Do you want to grab coffee?", "When are you free?", "Does Saturday work for you?", "How about six o'clock?", "Let's meet at the station entrance.", "Thanks for inviting me, but I can't make it.", "Could we move our meeting to seven?", "I'm running about ten minutes late.", "I need to cancel. Can we reschedule?"],
    ["What should I see while I'm here?", "What time does the museum close?", "I'd like two admission tickets.", "Do you offer a student discount?", "I'd like to book the afternoon tour.", "Where does the exhibition start?", "Two tickets for tonight's show, please.", "Could you take a photo of us?", "Where do locals like to go?", "The view was more impressive than I expected."],
    ["I'm looking for a room to rent.", "Does the apartment have a washing machine?", "How much are the rent and deposit?", "What is included in the lease?", "The heater in my apartment is broken.", "There's a problem with the water supply.", "I'm here to pick up a package.", "Hi, I just moved in next door.", "The noise at night has been difficult.", "What date would work for moving in?"],
    ["I'd like to open a bank account.", "My card isn't working at the ATM.", "I'd like to send this by mail.", "I'd like to ship this package.", "I'd like to sign up for mobile service.", "Which documents do I need?", "How should I fill out this form?", "How can I apply for an ID card?", "Should I take a number and wait?", "When will the application be processed?"],
    ["Hi, I'm Min. I just joined this class.", "Could I ask a question about today's lesson?", "Could you explain that part again?", "What exactly do we need to do for the assignment?", "When is the assignment due?", "When is the exam, and what does it cover?", "Could I see your notes from class?", "Which part should each of us handle?", "Today I'd like to present our main idea.", "Could we talk about my academic progress?"],
    ["Hello, I'm Min, the new product designer.", "What should I work on today?", "Could you help me with this task?", "Could you send me the updated file?", "I've finished the first draft and am reviewing it now.", "When is the deadline?", "Which task should I prioritize?", "We've run into a problem with the schedule.", "Let me walk you through the current status.", "Is there anything else I should finish before I leave?"],
    ["How has your week been so far?", "I think we should focus on the user experience.", "I agree with that point.", "I see it differently, if I may.", "The main reason is the cost and timeline.", "Could you clarify what you mean by that?", "Could you give us a little more detail?", "What if we tested a smaller version first?", "Who will own each action item?", "To summarize, we'll send the draft by Friday."],
    ["Hello, this is Min Kim from study with me.", "Could you put me through to Alex?", "I'm calling about tomorrow's meeting.", "Sorry, I didn't catch that.", "Could you say that again, please?", "Could you spell your name for me?", "Could I leave a message?", "I'd like to make an appointment for Tuesday.", "Can everyone hear and see me?", "Thank you for your time. Goodbye."],
    ["I'd like to make a doctor's appointment.", "I'm here because I have a fever.", "My throat hurts.", "The symptoms started three days ago.", "The pain is about a seven out of ten.", "No, I don't have any known allergies.", "What will this test involve?", "How often should I take this medicine?", "I'm here to pick up my prescription.", "Should I take this before or after meals?"],
    ["I received a different item from what I ordered.", "This isn't the dish I ordered.", "I think I was charged the wrong amount.", "The item arrived damaged.", "My delivery still hasn't arrived.", "The reservation details are incorrect.", "The service I paid for wasn't provided.", "Let me explain exactly what happened.", "Could you offer a replacement or refund?", "Could you confirm that the issue has been resolved?"],
    ["I've lost my phone.", "I'd like to report a lost wallet and passport.", "Has anyone turned this in?", "Officer, I need help.", "Someone stole my bag on the train.", "I was involved in a traffic accident.", "Please help—this is an emergency.", "Please call an ambulance and the police.", "I'm near the north entrance of the station.", "I need to tell my family what's happened."],
    ["Thank you. I really appreciate it.", "I'm sorry. That was my mistake.", "It's okay. Thank you for apologizing.", "I'm sorry, but I can't do that.", "There's something that's been making me uncomfortable.", "I felt hurt by what happened.", "Could you tell me how you see the situation?", "I think there has been a misunderstanding.", "Could we find a compromise that works for both of us?", "I'm glad we talked this through."]
  ],
  ja: [
    ["はじめまして。", "ミンです。韓国から来ました。", "デザインの仕事をしています。", "今日はどうしてこちらへ？", "共通点が多そうですね。", "休みの日は何をしていますか。", "すみません、もう一度お名前を伺ってもいいですか。", "SNSを交換しませんか。", "また今度会いましょう。", "お話しできてよかったです。"],
    ["今日はどんな一日でしたか。", "今日はいい天気ですね。", "週末は何をしましたか。", "今日は何をする予定ですか。", "最近、何か面白い映画を見ましたか。", "どんな音楽が好きですか。", "どんな食べ物が好きですか。", "最近、面白いことがあったんです。", "今日は少し疲れています。", "そうなんですか。もっと聞かせてください。"],
    ["二人ですが、席はありますか。", "キム・ミンの名前で予約しています。", "メニューを見せていただけますか。", "おすすめは何ですか。", "この料理は辛いですか。", "これと炭酸水をお願いします。", "ピーナッツアレルギーがあります。", "お皿をもう一枚いただけますか。", "すみません、注文した料理と違います。", "お会計をお願いします。"],
    ["この商品はどこにありますか。", "これはいくらですか。", "別の色はありますか。", "もう少し大きいサイズはありますか。", "試着してもいいですか。", "この二つは何が違いますか。", "これは割引になりますか。", "カードで払えますか。", "これを交換したいです。", "返品して返金していただきたいです。"],
    ["このバスは市内へ行きますか。", "どの地下鉄に乗ればいいですか。", "交通カードを買いたいです。", "博物館へはどう行けばいいですか。", "どこで乗り換えればいいですか。", "どの停留所で降りればいいですか。", "この住所までお願いします。", "駅の前で止めてください。", "どのくらいかかりますか。", "路線が止まっています。別の行き方はありますか。"],
    ["市役所はどこですか。", "一番近い駅はどこですか。", "トイレはどこですか。", "地図では今ここですか。", "道を教えていただけますか。", "左に曲がりますか、それともまっすぐですか。", "高いガラスの建物の近くですか。", "正面入口のそばにいます。", "博物館の前で会いましょう。", "道を間違えたようです。もう一度教えてください。"],
    ["この便のチェックインをお願いします。", "パスポートと予約確認書です。", "通路側の席に変更できますか。", "この荷物を預けたいです。", "荷物が重量オーバーです。どうすればいいですか。", "ノートパソコンと携帯電話だけです。", "二十四番ゲートはどこですか。", "この便は遅延ですか、欠航ですか。", "観光で五日間滞在します。", "スーツケースが出てきません。"],
    ["キム・ミンの名前で予約しています。", "チェックインをお願いします。", "部屋はどこですか。朝食は何時ですか。", "Wi-Fiのパスワードは何ですか。", "タオルを二枚追加でお願いします。", "今日の午後、部屋を掃除していただけますか。", "エアコンが動きません。", "別の部屋に変えていただけますか。", "近くのおすすめを教えてください。", "チェックアウトをお願いします。料金を確認できますか。"],
    ["一緒に食事に行きませんか。", "コーヒーを飲みに行きませんか。", "いつ空いていますか。", "土曜日はいかがですか。", "六時はどうですか。", "駅の入口で会いましょう。", "誘ってくれてありがとう。でも行けません。", "待ち合わせを七時に変えられますか。", "十分ほど遅れます。", "キャンセルしないといけません。別の日にできますか。"],
    ["ここでどこを見たらいいですか。", "博物館は何時に閉まりますか。", "入場券を二枚お願いします。", "学生割引はありますか。", "午後のツアーを予約したいです。", "展示はどこから始まりますか。", "今夜の公演を二枚お願いします。", "写真を撮っていただけますか。", "地元の人はどこへ行きますか。", "景色は思ったより印象的でした。"],
    ["借りられる部屋を探しています。", "洗濯機はありますか。", "家賃と敷金はいくらですか。", "契約には何が含まれていますか。", "部屋の暖房が壊れています。", "水道に問題があります。", "荷物を受け取りに来ました。", "こんにちは、隣に引っ越してきました。", "夜の騒音で困っています。", "入居日はいつがいいですか。"],
    ["銀行口座を作りたいです。", "ATMでカードが使えません。", "これを郵送したいです。", "この荷物を送りたいです。", "携帯電話を契約したいです。", "どの書類が必要ですか。", "この申請書はどう書けばいいですか。", "身分証明書はどう申請しますか。", "番号札を取って待てばいいですか。", "手続きはいつ終わりますか。"],
    ["はじめまして。今日からこのクラスに入りました。ミンです。", "今日の授業について質問してもいいですか。", "その部分をもう一度説明してください。", "課題では具体的に何をすればいいですか。", "課題の締め切りはいつですか。", "試験はいつで、範囲はどこですか。", "授業のノートを見せてもらえますか。", "それぞれどの役割を担当しますか。", "今日は私たちの主な案を発表します。", "学習の進み具合について相談できますか。"],
    ["はじめまして。新しく入ったプロダクトデザイナーのミンです。", "今日やるべき仕事は何ですか。", "この仕事を手伝ってもらえますか。", "更新したファイルを送っていただけますか。", "最初の案が終わり、今確認しています。", "締め切りはいつですか。", "どの仕事を優先すべきですか。", "スケジュールに問題が起きました。", "現在の状況を引き継ぎます。", "退勤前に他に終わらせることはありますか。"],
    ["今週はいかがでしたか。", "ユーザー体験に集中すべきだと思います。", "その意見に賛成です。", "恐れ入りますが、私は少し違う考えです。", "主な理由は費用と日程です。", "その意味をもう少し詳しく教えてください。", "もう少し詳しく説明していただけますか。", "まず小さい規模で試してはどうでしょうか。", "それぞれの担当と次の行動を決めましょう。", "まとめると、金曜日までに案を送ります。"],
    ["お電話ありがとうございます。study with meのキム・ミンです。", "アレックスさんに代わっていただけますか。", "明日の会議についてお電話しました。", "すみません、よく聞こえませんでした。", "もう一度言っていただけますか。", "お名前のつづりを教えていただけますか。", "伝言をお願いできますか。", "火曜日に予約を取りたいです。", "皆さん、音声と画面は見えますか。", "お時間ありがとうございました。失礼します。"],
    ["診察の予約を取りたいです。", "熱があるので来ました。", "喉が痛いです。", "症状は三日前からです。", "痛みは十段階で七くらいです。", "いいえ、分かっているアレルギーはありません。", "この検査では何をしますか。", "この薬は一日に何回飲みますか。", "処方薬を受け取りに来ました。", "食前と食後のどちらに飲みますか。"],
    ["注文と違う商品が届きました。", "注文した料理と違います。", "請求金額が間違っていると思います。", "商品が壊れて届きました。", "まだ配送が届いていません。", "予約情報が間違っています。", "料金を払ったサービスが提供されませんでした。", "何が起きたか説明します。", "交換か返金をお願いできますか。", "問題が解決したか確認していただけますか。"],
    ["携帯電話をなくしました。", "財布とパスポートの紛失届を出したいです。", "これが届いていませんか。", "警察の方、助けてください。", "電車でかばんを盗まれました。", "交通事故に遭いました。", "助けてください。緊急です。", "救急車と警察を呼んでください。", "駅の北口付近にいます。", "家族に緊急事態を知らせたいです。"],
    ["ありがとうございます。本当に助かりました。", "すみません、私のミスでした。", "大丈夫です。謝ってくれてありがとうございます。", "申し訳ありませんが、それはできません。", "少し不快に感じていることがあります。", "そのことで傷つきました。", "あなたの立場を教えてもらえますか。", "誤解があったと思います。", "お互いに納得できる方法を探しませんか。", "話し合えてよかったです。"]
  ],
  zh: [
    ["很高兴认识你。", "我叫敏，来自韩国。", "我是做设计工作的。", "你今天为什么来这里？", "我们好像有很多共同点。", "你平时有什么爱好？", "不好意思，可以再告诉我一次你的名字吗？", "我们可以交换一下社交账号吗？", "我们下次再见吧。", "很高兴和你聊天。"],
    ["你今天过得怎么样？", "今天天气真不错。", "你周末做了什么？", "你今天有什么计划？", "你最近看了什么好看的电影吗？", "你喜欢什么音乐？", "你喜欢吃什么？", "我最近遇到了一件有意思的事。", "我今天有点累。", "真的吗？再多说一点吧。"],
    ["请问有两个人的座位吗？", "我用金敏的名字订了位。", "可以给我们看看菜单吗？", "你推荐什么？", "这道菜辣吗？", "我要这个，再来一瓶气泡水。", "我对花生过敏。", "可以再给我们一个盘子吗？", "不好意思，这不是我点的菜。", "麻烦结账。"],
    ["这个商品在哪里？", "这个多少钱？", "有别的颜色吗？", "有大一点的尺码吗？", "我可以试穿吗？", "这两个有什么区别？", "这个打折吗？", "可以刷卡吗？", "我想换这个商品。", "我想退货退款。"],
    ["这辆公交车去市中心吗？", "我应该坐哪条地铁线？", "我想买一张交通卡。", "去博物馆怎么走？", "我应该在哪里换乘？", "我应该在哪一站下车？", "请送我到这个地址。", "请在车站前面停车。", "大概要多长时间？", "这条线路停运了，还有别的走法吗？"],
    ["市政府在哪里？", "最近的地铁站在哪里？", "洗手间在哪里？", "我们现在在地图上的这里吗？", "可以告诉我怎么走吗？", "我是左转还是直走？", "是在那座高的玻璃楼附近吗？", "我在正门旁边。", "我们在博物馆前面见吧。", "我好像走错了，可以再告诉我一次吗？"],
    ["我想办理这个航班的登机手续。", "这是我的护照和预订确认单。", "可以换成靠过道的座位吗？", "我想托运这个行李。", "我的行李超重了，怎么办？", "我只带了电脑和手机。", "二十四号登机口在哪里？", "我的航班延误了还是取消了？", "我是来旅游的，会待五天。", "我的行李箱没有出来。"],
    ["我用金敏的名字订了房。", "我想办理入住。", "我的房间在哪里？早餐是几点？", "无线网密码是什么？", "可以再给我两条毛巾吗？", "今天下午可以打扫房间吗？", "空调坏了。", "可以给我换一个房间吗？", "可以推荐一下附近的地方吗？", "我想退房，可以确认一下费用吗？"],
    ["一起吃饭怎么样？", "一起喝咖啡怎么样？", "你什么时候有空？", "星期六可以吗？", "六点怎么样？", "我们在车站入口见吧。", "谢谢你的邀请，但是我去不了。", "我们可以把时间改到七点吗？", "我大概会迟到十分钟。", "我需要取消，我们可以改时间吗？"],
    ["我在这里应该去看什么？", "博物馆几点关门？", "我要两张门票。", "有学生折扣吗？", "我想预订下午的旅行团。", "展览从哪里开始？", "我要两张今晚演出的票。", "可以帮我们拍张照片吗？", "当地人喜欢去哪里？", "这里的风景比我想象的更震撼。"],
    ["我在找可以租的房间。", "房子里有洗衣机吗？", "房租和押金是多少？", "合同里包括什么？", "我房间的暖气坏了。", "供水有问题。", "我是来取快递的。", "你好，我刚搬到隔壁。", "晚上的噪音让我很困扰。", "哪一天搬进去比较合适？"],
    ["我想开一个银行账户。", "我的卡在ATM上不能用。", "我想把这个寄出去。", "我想寄这个包裹。", "我想办理手机服务。", "我需要哪些文件？", "这张申请表怎么填？", "怎么办理身份证件？", "我要先取号再等吗？", "这个手续什么时候能办完？"],
    ["大家好，我叫敏，刚加入这个班。", "我可以问一个关于今天课程的问题吗？", "可以再解释一下那部分吗？", "这个作业具体要做什么？", "作业什么时候交？", "考试是什么时候，范围是什么？", "我可以看看你的课堂笔记吗？", "我们每个人负责哪一部分？", "今天我想介绍一下我们的主要想法。", "可以谈谈我的学习进度吗？"],
    ["大家好，我叫敏，是新来的产品设计师。", "我今天应该做什么工作？", "你可以帮我完成这个任务吗？", "可以把更新后的文件发给我吗？", "我已经完成初稿，现在正在检查。", "截止日期是什么时候？", "我应该优先做哪个任务？", "进度安排出现了问题。", "我来说明一下目前的情况。", "下班前还有什么需要完成的吗？"],
    ["你这周过得怎么样？", "我觉得我们应该专注于用户体验。", "我同意这个观点。", "如果可以的话，我有不同的看法。", "主要原因是成本和时间。", "可以说明一下你的意思吗？", "可以再详细解释一下吗？", "我们先测试一个小版本怎么样？", "我们来确定负责人和下一步行动吧。", "总结一下，我们会在星期五之前发出初稿。"],
    ["你好，我是study with me的金敏。", "可以帮我转接亚历克斯吗？", "我打电话是想谈明天的会议。", "不好意思，我没听清。", "可以再说一遍吗？", "可以拼一下你的名字吗？", "我可以留言吗？", "我想预约星期二的时间。", "大家能听到我、看到我吗？", "谢谢你的时间，再见。"],
    ["我想预约看医生。", "我发烧了，所以来这里。", "我的喉咙疼。", "症状是三天前开始的。", "疼痛大概是十分之七。", "没有，我没有已知的过敏。", "这个检查要做什么？", "这个药一天吃几次？", "我是来取处方药的。", "这个药饭前吃还是饭后吃？"],
    ["我收到的商品和订的不一样。", "这不是我点的菜。", "我觉得收费金额不对。", "商品送到时已经坏了。", "我的快递还没到。", "预订信息不对。", "我付费的服务没有提供。", "我来说明一下发生了什么。", "可以给我换货或退款吗？", "可以确认问题已经解决了吗？"],
    ["我的手机丢了。", "我想报失钱包和护照。", "有人把这个交过来吗？", "警察同志，请帮帮我。", "有人在地铁上偷了我的包。", "我遇到了交通事故。", "请帮忙，这是紧急情况。", "请叫救护车和警察。", "我在车站北门附近。", "我需要告诉家人发生了什么。"],
    ["谢谢你，真的帮了我很多。", "对不起，这是我的错。", "没关系，谢谢你道歉。", "不好意思，我不能那样做。", "有件事让我觉得不太舒服。", "这件事让我很受伤。", "可以告诉我你是怎么看的吗？", "我觉得这里有一些误会。", "我们可以找一个双方都能接受的办法吗？", "很高兴我们把话说开了。"]
  ]
};

const usefulTranslations = {
  en: [
    ["Exactly—I'm with you.", "No way! That's amazing.", "Well, at least it makes a good story.", "Good one—you almost had me.", "I'll play it by ear.", "That's totally my vibe.", "That post is living rent-free in my head.", "Anyway, shall we start over?", "It's kind of hard to explain, you know?", "I'd say 'Would you mind?' formally and 'Mind if I...?' casually."],
    ["Hey there! How's it going?", "The train's running late—ETA means expected arrival time.", "It's just around the corner.", "What's the local name for this dish?", "I came for the views and stayed for the snacks.", "Well, that was not on my itinerary!", "Is that the best price you can do?", "This place is an absolute hidden gem.", "Thanks a ton—take care!", "Use 'Could you help me?' politely and 'Any chance you can help?' casually."],
    ["I know exactly what you mean.", "I'm not late—I'm just fashionably delayed.", "We're on the same wavelength.", "This party is really buzzing.", "Send me the tea in the group chat.", "That color really suits you.", "Thanks—that's really kind of you to say.", "I'd be up for hanging out again.", "Well, that was a little awkward—moving on!", "I'd say 'It was lovely meeting you' formally and 'Great meeting you' casually."],
    ["Let's get the ball rolling.", "The project is WIP—work in progress.", "We're in crunch mode before the deadline.", "That's a strong idea—we should build on it.", "I see where you're coming from, but I have one concern.", "Looks like my calendar has declared war on me.", "FYI, I'll send the EOD update in the group chat.", "With that in mind, let's move on to the next point.", "This is a solid start; the structure could be a little clearer.", "Use 'Could you please review this?' formally and 'Can you take a quick look?' casually."],
    ["I'm in a bit of a difficult spot.", "Could you give me a hand here?", "I'm afraid this hasn't met my expectations.", "I understand, but I need this addressed today.", "I think we may have got our wires crossed.", "Well, this is one way to make the day memorable.", "I need help ASAP.", "Let's see what we can do to make this right.", "I'm glad we cleared the air.", "I'm sorry for the trouble, and I appreciate your help."]
  ],
  ja: [
    ["まさにそうですね。私も同感です。", "えっ、本当ですか。すごいですね。", "まあ、いい話のネタにはなりましたね。", "うまいですね。危うく信じるところでした。", "その場の流れで決めます。", "それ、すごく自分好みです。", "あの投稿、ずっと頭から離れません。", "それはさておき、仕切り直しましょうか。", "何というか、うまく説明しにくいんですよね。", "丁寧なら『よろしいですか』、親しい相手なら『いい？』と言えます。"],
    ["どうも、調子はどうですか。", "電車が遅れています。『遅延』は予定より遅いという意味です。", "すぐそこの角を曲がったところです。", "この料理は現地では何と呼びますか。", "景色を見に来たのに、食べ物のほうに夢中です。", "これは予定になかった展開ですね。", "もう少し安くなりませんか。", "ここはまさに穴場ですね。", "本当に助かりました。お気をつけて。", "丁寧なら『手伝っていただけますか』、気軽なら『ちょっと手伝ってくれる？』です。"],
    ["言いたいこと、よく分かります。", "遅刻じゃなくて、ちょっとおしゃれに遅れただけです。", "私たち、考えていることが同じですね。", "このパーティー、かなり盛り上がっていますね。", "その話、あとでグループチャットで詳しく教えて。", "その色、とても似合っています。", "ありがとう。そう言ってもらえてうれしいです。", "また一緒に出かけたいです。", "ちょっと気まずかったですね。次の話に行きましょう。", "丁寧なら『お会いできて光栄です』、気軽なら『会えてよかった』です。"],
    ["まずは動き出しましょう。", "この案件はWIP、つまり作業中です。", "締め切り前で追い込みモードです。", "いいアイデアですね。さらに広げてみましょう。", "おっしゃることは分かりますが、一点気になるところがあります。", "今日は予定表に振り回されています。", "参考までに、終業時までに進捗をチャットで共有します。", "それを踏まえて、次の項目に移りましょう。", "良いスタートです。構成をもう少し明確にするとよさそうです。", "丁寧なら『ご確認いただけますか』、気軽なら『ちょっと見てもらえる？』です。"],
    ["少し困った状況になっています。", "ここを手伝っていただけますか。", "残念ながら、期待していた内容とは違います。", "事情は分かりますが、今日中の対応が必要です。", "どうやら話がすれ違っていたようです。", "まあ、忘れられない一日にはなりましたね。", "至急、助けが必要です。", "きちんと解決できる方法を考えましょう。", "誤解が解けてよかったです。", "ご迷惑をおかけしてすみません。対応ありがとうございます。"]
  ],
  zh: [
    ["对，我也这么觉得。", "不会吧！太厉害了。", "好吧，至少以后可以当个笑话讲。", "说得真像，我差点就信了。", "到时候看情况再说吧。", "这完全是我的风格。", "那条帖子一直在我脑子里循环。", "不管怎样，我们重新开始吧。", "怎么说呢，这件事不太好解释。", "正式一点可以说‘您介意吗’，熟悉的人可以说‘可以吗’。"],
    ["嗨，最近怎么样？", "火车晚点了，ETA就是预计到达时间。", "就在前面的拐角处。", "这道菜当地人叫什么？", "本来是来看风景的，结果被美食留住了。", "这可不在我的旅行计划里！", "这个价格还能再优惠一点吗？", "这里真是个隐藏宝藏。", "太感谢了，保重！", "礼貌一点说‘可以帮我吗’，随意一点说‘能搭把手吗’。"],
    ["我完全明白你的意思。", "我不是迟到，只是很有风格地晚到了。", "我们真是想到一块儿去了。", "这个聚会气氛真热闹。", "回头在群里跟我说说这个瓜。", "这个颜色真的很适合你。", "谢谢，你这么说我很开心。", "下次我也想再一起出去玩。", "刚才有点尴尬，我们换个话题吧。", "正式一点说‘很荣幸认识您’，随意一点说‘认识你很开心’。"],
    ["我们先把事情启动起来吧。", "这个项目还是WIP，也就是进行中。", "截止日期前我们进入冲刺模式了。", "这个想法很好，我们可以继续展开。", "我理解你的观点，不过我有一个顾虑。", "今天我的日程表好像在和我作对。", "供参考，我会在下班前把进度发到群里。", "基于这一点，我们进入下一个议题。", "这是个不错的开始，结构可以再清楚一点。", "正式一点说‘请您审核’，随意一点说‘能帮我看一眼吗’。"],
    ["我现在有点为难。", "这里可以帮我一下吗？", "恐怕这没有达到我的预期。", "我理解，不过这件事今天必须处理。", "我想我们之前可能沟通错了。", "好吧，至少今天会让人印象深刻。", "我急需帮助。", "我们看看怎么把这件事妥善解决。", "很高兴我们把误会说开了。", "给您添麻烦了，也谢谢您的帮助。"]
  ]
};

const levelExtensions = {
  en: {
    social: ["", "How about you?", "I'd like to hear a little more about that.", "I'd be interested to hear your perspective as well.", "I'd be curious to hear how you see it—there may be more nuance to it."],
    service: ["", "Could you help me with that?", "Could you also explain what my options are?", "I'd appreciate it if you could walk me through the available options.", "Just so we're clear, could we go over the options and agree on the most practical next step?"],
    professional: ["", "Can we check the details?", "Could we also confirm the next step?", "I'd like to clarify the reasoning and agree on the next action.", "To make sure we're aligned, could we review the context, priorities, and ownership before proceeding?"],
    resolution: ["", "Can we talk about it?", "Could we find a way to resolve this?", "I'd appreciate a clear explanation and a practical solution.", "Let's make sure we understand what happened and agree on a fair way forward."]
  },
  ja: {
    social: ["", "あなたはどうですか。", "もう少し詳しく聞かせてください。", "あなたの考えもぜひ聞いてみたいです。", "もう少し背景も含めて、率直な考えを聞かせてもらえますか。"],
    service: ["", "手伝っていただけますか。", "どんな選択肢があるかも教えてください。", "利用できる選択肢を詳しく説明していただけると助かります。", "認識を合わせるために、選択肢を確認して一番現実的な方法を決められますか。"],
    professional: ["", "詳細を確認できますか。", "次の対応も確認できますか。", "理由を整理して、次の行動まで決めたいです。", "認識を合わせるために、背景・優先順位・担当を確認してから進めませんか。"],
    resolution: ["", "少し話し合えますか。", "解決できる方法を一緒に探せますか。", "状況を明確に説明して、現実的な解決策を提案していただけると助かります。", "何が起きたかを整理して、お互いに納得できる解決方法を決めましょう。"]
  },
  zh: {
    social: ["", "你呢？", "我想再多听一点。", "我也很想听听你的看法。", "我很想知道你是怎么看的，这里面可能还有更多值得聊的地方。"],
    service: ["", "可以帮我处理一下吗？", "也可以告诉我有哪些选择吗？", "如果可以详细说明一下现有的选择，我会很感谢。", "为了确认清楚，我们可以一起看看有哪些选择，再决定最合适的办法吗？"],
    professional: ["", "我们可以确认一下细节吗？", "也可以确认一下下一步吗？", "我想把原因说清楚，并确定下一步行动。", "为了保持一致，我们可以先确认背景、优先级和负责人，再继续推进吗？"],
    resolution: ["", "我们可以谈一下吗？", "我们可以一起找个解决办法吗？", "希望你能清楚说明情况，并提供一个可行的解决方案。", "我们先弄清楚发生了什么，再一起确定一个公平的解决办法吧。"]
  }
};

const levelExtensionsKo = {
  social: ["", "상대에게도 짧게 질문하기", "관심을 보이며 구체적인 이야기를 요청하기", "상대의 관점까지 정중하게 질문하기", "배경과 뉘앙스를 짚으며 자연스럽게 대화를 확장하기"],
  service: ["", "도움을 간단히 요청하기", "가능한 선택지를 추가로 질문하기", "선택지를 자세히 설명해 달라고 정중하게 요청하기", "조건을 확인하고 가장 현실적인 해결 방법까지 협의하기"],
  professional: ["", "세부 내용을 확인하기", "다음 행동까지 확인하기", "이유를 설명하고 다음 행동을 합의하기", "배경·우선순위·담당을 정리해 공통된 이해를 만들기"],
  resolution: ["", "대화를 요청하기", "함께 해결 방법을 찾자고 제안하기", "명확한 설명과 현실적인 해결책을 정중하게 요청하기", "원인을 정리하고 공정한 해결 방법까지 협의하기"]
};

const dayStageLabels = ["핵심 표현", "조건 추가", "질문 확장", "변형 대응", "종합 회화"];
const dayStageExtensionsKo = {
  social: ["", "개인적인 배경을 한 가지 덧붙이기", "상대의 생각을 묻는 질문까지 이어가기", "상황에 따라 다른 반응도 설명하기", "대화를 자연스럽게 정리하고 다음 흐름으로 연결하기"],
  service: ["", "원하는 조건과 시간을 구체적으로 덧붙이기", "세부 정보와 가능한 선택지를 추가로 질문하기", "원하는 방법이 어려울 때 대안을 요청하기", "최종 조건을 다시 확인하고 감사 인사로 마무리하기"],
  professional: ["", "업무 배경과 목적을 간단히 덧붙이기", "상대의 의견과 다음 단계를 질문하기", "우선순위가 달라질 때의 대안을 제안하기", "담당·일정·다음 행동을 확인하며 마무리하기"],
  resolution: ["", "문제가 생긴 배경과 영향을 구체적으로 설명하기", "가능한 해결 방법을 직접 질문하기", "첫 해결책이 어려울 때 다른 대안을 요청하기", "문제 해결 여부를 확인하고 관계를 부드럽게 마무리하기"]
};

const dayStageExtensions = {
  en: {
    social: ["", "Let me add a little context about myself.", "What do you think about it?", "I might react differently depending on the situation.", "Anyway, it was great talking with you—let's continue this another time."],
    service: ["", "If possible, I'd like to add one specific condition.", "Could you also explain the details and available options?", "If that isn't possible, what alternative would you recommend?", "Let me confirm the final arrangement. Thank you for your help."],
    professional: ["", "Let me briefly explain the background and purpose.", "What do you think, and what should our next step be?", "If the priorities change, we could take a different approach.", "Let's confirm the owner, timeline, and next action before we finish."],
    resolution: ["", "Let me explain what led to the problem and how it affected me.", "What options do we have to resolve this?", "If the first solution isn't available, could we try another approach?", "Could you confirm that the issue is resolved? Thank you for working through it with me."]
  },
  ja: {
    social: ["", "私のことを少し補足しますね。", "あなたはどう思いますか。", "状況によっては違う反応をするかもしれません。", "いろいろ話せてよかったです。また今度続きを話しましょう。"],
    service: ["", "できれば、希望する条件を一つ追加したいです。", "詳しい内容と利用できる選択肢も教えていただけますか。", "それが難しい場合、別の方法を提案していただけますか。", "最後に内容を確認します。対応していただきありがとうございます。"],
    professional: ["", "背景と目的を簡単に説明します。", "どう思いますか。次は何をすべきでしょうか。", "優先順位が変わる場合は、別の進め方も考えられます。", "最後に担当・日程・次の行動を確認しましょう。"],
    resolution: ["", "問題が起きた背景と影響を詳しく説明します。", "解決するために、どんな選択肢がありますか。", "最初の方法が難しければ、別の対応をお願いできますか。", "問題が解決したか確認していただけますか。対応ありがとうございました。"]
  },
  zh: {
    social: ["", "我再补充一点自己的情况。", "你对这件事怎么看？", "根据不同的情况，我可能会有不同的反应。", "很高兴和你聊这些，我们下次再继续吧。"],
    service: ["", "如果可以，我想再加一个具体条件。", "也可以说明一下细节和现有的选择吗？", "如果这样不行，你可以推荐其他办法吗？", "我再确认一下最后的安排，谢谢你的帮助。"],
    professional: ["", "我先简单说明一下背景和目的。", "你怎么看？我们的下一步应该是什么？", "如果优先级发生变化，我们也可以换一种做法。", "结束前我们确认一下负责人、时间和下一步行动。"],
    resolution: ["", "我来具体说明问题发生的背景和造成的影响。", "我们有哪些办法可以解决这个问题？", "如果第一个办法不行，可以尝试其他方案吗？", "可以确认问题已经解决了吗？谢谢你和我一起处理。"]
  }
};

const dayStageMeaningsKo = {
  social: [
    "",
    "제 이야기를 조금 더 덧붙일게요.",
    "이것에 대해 어떻게 생각하세요?",
    "상황에 따라 다르게 반응할 수도 있어요.",
    "이야기 나눠 즐거웠어요. 다음에 이어서 이야기해요."
  ],
  service: [
    "",
    "가능하다면 원하는 조건을 하나 더 말씀드릴게요.",
    "세부 내용과 가능한 선택지도 설명해 주시겠어요?",
    "그 방법이 어렵다면 어떤 대안을 추천하시나요?",
    "최종 내용을 확인할게요. 도와주셔서 감사합니다."
  ],
  professional: [
    "",
    "배경과 목적을 간단히 설명드릴게요.",
    "어떻게 생각하시며, 다음 단계는 무엇이 좋을까요?",
    "우선순위가 바뀌면 다른 방법으로 진행할 수 있어요.",
    "마치기 전에 담당자·일정·다음 행동을 확인하죠."
  ],
  resolution: [
    "",
    "문제가 생긴 배경과 영향을 설명드릴게요.",
    "이 문제를 해결할 수 있는 방법에는 무엇이 있나요?",
    "첫 번째 방법이 어렵다면 다른 대안을 시도할 수 있을까요?",
    "문제가 해결됐는지 확인해 주세요. 함께 처리해 주셔서 감사합니다."
  ]
};

const pronunciationCoaches = {
  en: [
    "문장 전체를 한 단어씩 읽지 말고, 핵심 내용어에만 힘을 주세요.",
    "조동사와 전치사는 짧게, 명사와 동사는 또렷하게 연결하세요.",
    "의미 덩어리마다 짧게 끊고 질문의 끝 억양을 의도적으로 조절하세요.",
    "강세 사이의 약한 음절을 줄여 원어민의 리듬과 연결 발음을 만드세요.",
    "강세·축약·억양을 사용해 태도와 뉘앙스까지 전달하세요."
  ],
  ja: [
    "글자 수가 아니라 모라 박자에 맞춰 일정하게 읽으세요.",
    "장음·촉음·ん을 한 박자로 구분하고 문장 끝을 또렷하게 마무리하세요.",
    "조사에는 힘을 덜고 핵심 명사와 동사의 높낮이를 자연스럽게 연결하세요.",
    "의미 덩어리의 피치 변화를 살리되 한국어식 강세를 넣지 마세요.",
    "속도보다 피치 악센트와 완곡한 끝맺음이 만드는 인상을 우선하세요."
  ],
  zh: [
    "각 음절의 성조를 먼저 분리해 확인한 뒤 한 문장으로 연결하세요.",
    "3성이 이어질 때의 변화를 의식하고 문장 끝 의문 억양을 과하게 올리지 마세요.",
    "성조는 유지하면서 기능어는 가볍게, 핵심 정보는 또렷하게 말하세요.",
    "긴 문장은 의미 덩어리로 나누되 덩어리 안의 성조 윤곽을 유지하세요.",
    "성조·속도·문장 억양을 함께 조절해 확신과 정중함의 정도를 표현하세요."
  ]
};

const registerCoaches = {
  social: "상대와의 거리감을 먼저 판단하고, 답한 뒤 같은 주제의 질문을 돌려주세요.",
  service: "요청 → 조건 → 확인 → 감사 순서를 지키면 짧아도 정중하고 명확합니다.",
  professional: "배경 → 핵심 의견 → 근거 → 다음 행동 순서로 말하면 업무 대화가 선명해집니다.",
  resolution: "사실과 영향을 먼저 설명하고, 비난 대신 원하는 해결 방법을 구체적으로 말하세요."
};

function buildStageTarget(base, language, mode, stageIndex) {
  const extension = dayStageExtensions[language][mode][stageIndex] || "";
  const extensionMeaning = dayStageMeaningsKo[mode][stageIndex] || "";
  return {
    text: extension ? `${base} ${extension}` : base,
    extension,
    extensionMeaning
  };
}

function buildDayCoach(language, mode, situation, profile, levelIndex, stageIndex, point) {
  const mission = dayStageExtensionsKo[mode][stageIndex] || "핵심 표현을 정확한 장면에서 사용하기";
  const languageMistakes = {
    en: "한국어 어순대로 단어를 옮기지 말고, 주어와 동사를 먼저 세운 뒤 조건을 붙이세요.",
    ja: "한국어식 강세와 어순을 그대로 넣지 말고 조사와 です·ます 끝맺음을 함께 확인하세요.",
    zh: "한국어 어순으로 재배열하지 말고 시간·장소·동작의 위치와 성조를 함께 기억하세요."
  };
  return {
    canDo: `${situation}에서 ${mission}`,
    scene: `실제 ${situation} 상황에서 ${point.focus} 표현으로 대화를 시작합니다.`,
    stage: `${dayStageLabels[stageIndex]} · ${profile.name}`,
    register: registerCoaches[mode],
    commonMistake: languageMistakes[language],
    pronunciation: pronunciationCoaches[language][levelIndex],
    transfer: `${situation}의 사람·시간·조건 중 하나를 바꾸어 내 문장으로 다시 말해보세요.`,
    rubric: ["의미 정확도", stageIndex < 2 ? "핵심 표현" : "조건·질문 확장", mode === "resolution" ? "대안 제시" : "대화 연결"]
  };
}

const dialogueModes = {
  en: {
    social: { opening: "Hi! It's good to see you. What would you like to talk about?", openingKo: "안녕하세요! 반가워요. 어떤 이야기를 나눠볼까요?", reply: "That sounds interesting. Tell me a little more.", replyKo: "흥미롭네요. 조금 더 이야기해 주세요." },
    service: { opening: "Hello. How can I help you today?", openingKo: "안녕하세요. 무엇을 도와드릴까요?", reply: "I understand. Let me check what we can do.", replyKo: "알겠습니다. 가능한 방법을 확인해 볼게요." },
    professional: { opening: "Hi. What would you like to discuss?", openingKo: "안녕하세요. 무엇을 논의할까요?", reply: "Thanks for explaining. Let's confirm the next step.", replyKo: "설명해 주셔서 감사합니다. 다음 단계를 확인하죠." },
    resolution: { opening: "Hello. Please tell me what happened.", openingKo: "안녕하세요. 무슨 일이 있었는지 말씀해 주세요.", reply: "I understand the situation. Let's work on a solution.", replyKo: "상황을 이해했습니다. 해결 방법을 찾아보죠." }
  },
  ja: {
    social: { opening: "こんにちは。今日はどんなお話をしましょうか。", openingKo: "안녕하세요. 오늘은 어떤 이야기를 나눌까요?", reply: "面白いですね。もう少し聞かせてください。", replyKo: "흥미롭네요. 조금 더 들려주세요." },
    service: { opening: "いらっしゃいませ。今日はどうされましたか。", openingKo: "어서 오세요. 오늘은 무엇을 도와드릴까요?", reply: "分かりました。できることを確認します。", replyKo: "알겠습니다. 가능한 방법을 확인하겠습니다." },
    professional: { opening: "こんにちは。今日は何について相談しますか。", openingKo: "안녕하세요. 오늘은 무엇을 상의할까요?", reply: "説明ありがとうございます。次の対応を確認しましょう。", replyKo: "설명 감사합니다. 다음 조치를 확인하죠." },
    resolution: { opening: "こんにちは。何があったか教えてください。", openingKo: "안녕하세요. 무슨 일이 있었는지 알려주세요.", reply: "状況は分かりました。一緒に解決方法を考えましょう。", replyKo: "상황을 이해했습니다. 함께 해결 방법을 찾아보죠." }
  },
  zh: {
    social: { opening: "你好！今天想聊些什么？", openingKo: "안녕하세요! 오늘은 어떤 이야기를 나눌까요?", reply: "听起来很有意思，再多说一点吧。", replyKo: "흥미롭네요. 조금 더 이야기해 주세요." },
    service: { opening: "您好，今天需要什么帮助？", openingKo: "안녕하세요. 오늘은 무엇을 도와드릴까요?", reply: "我明白了，我来看看可以怎么处理。", replyKo: "알겠습니다. 어떻게 처리할 수 있을지 확인해 볼게요." },
    professional: { opening: "你好，今天想讨论什么？", openingKo: "안녕하세요. 오늘은 무엇을 논의할까요?", reply: "谢谢你的说明，我们来确认下一步。", replyKo: "설명해 주셔서 감사합니다. 다음 단계를 확인하죠." },
    resolution: { opening: "您好，请告诉我发生了什么。", openingKo: "안녕하세요. 무슨 일이 있었는지 말씀해 주세요.", reply: "我了解情况了，我们一起想办法解决。", replyKo: "상황을 이해했습니다. 함께 해결 방법을 찾아보죠." }
  }
};

const businessIntentTranslations = {
  en: {
    presentation: ["Good morning. Today I'll walk you through our proposal.", "The key takeaway is that our plan can reduce delays.", "This chart shows a twenty percent increase in adoption.", "Now, let's move on to the implementation plan.", "For example, our pilot team shortened the review cycle.", "I'd like to highlight three points.", "Does that make sense so far?", "That's a great question. Let me clarify the assumption.", "One limitation is the sample size, and our next step is a larger test.", "To sum up, the proposal is practical and scalable. Thank you."],
    conference: ["Where can I pick up my conference badge?", "My research focuses on human decision-making.", "This poster summarizes our method and main findings.", "How did you control for selection bias?", "Your results suggest a strong association, right?", "Could you elaborate on the second experiment?", "Our work overlaps. Would you be open to collaborating?", "May I have your card or email address?", "Could we schedule a follow-up call next week?", "It was great speaking with you. I'll send the paper."],
    partner: ["I'm responsible for product strategy on our side.", "Let's confirm what success looks like for both teams.", "Could you clarify the required specifications?", "Can we agree on milestones for each phase?", "Who will own each deliverable?", "We're on track, but one dependency may cause a delay.", "We've identified an issue with the integration.", "Could we adjust the scope without moving the deadline?", "Let's assign an owner and due date to each action item.", "I'll send a summary of the decisions and next steps."],
    negotiation: ["Let me walk you through the terms of our proposal.", "Is there room to adjust the unit price?", "Could we discuss a more realistic delivery schedule?", "I'd like to confirm what is included in the contract scope.", "We could accept that if the support period is extended.", "Could you explain the reason for that condition?", "Would you be able to meet us halfway on the minimum order?", "How should we allocate the operational risk?", "It sounds like we have a tentative agreement on the main points.", "Let's confirm the final terms and the signing timeline."]
  },
  ja: {
    presentation: ["本日は、私たちの提案についてご説明します。", "最も重要なポイントは、この計画で遅延を減らせることです。", "このグラフは導入率が二十パーセント上がったことを示しています。", "それでは、実施計画に移ります。", "例えば、試験チームでは確認期間を短縮できました。", "ここで三つの点を強調したいと思います。", "ここまでの内容で分かりにくい点はありますか。", "ご質問ありがとうございます。前提条件を補足します。", "課題はサンプル数で、次はより大規模な検証を行います。", "まとめると、この提案は実行可能で拡張性があります。ありがとうございました。"],
    conference: ["学会の参加証はどこで受け取れますか。", "私の研究は人の意思決定をテーマにしています。", "このポスターでは研究方法と主な結果をまとめています。", "選択バイアスはどのように統制しましたか。", "この結果は強い関連を示しているという理解で合っていますか。", "二つ目の実験について詳しく説明していただけますか。", "研究分野が近いので、共同研究を検討しませんか。", "名刺かメールアドレスをいただけますか。", "来週、フォローアップの打ち合わせをしませんか。", "お話しできてよかったです。後ほど論文をお送りします。"],
    partner: ["こちらでは製品戦略を担当しています。", "両社にとっての成功条件を確認しましょう。", "必要な仕様を具体的に教えていただけますか。", "各段階のマイルストーンを合意できますか。", "各成果物の担当を決めましょう。", "順調ですが、一つの依存関係で遅れる可能性があります。", "連携部分で技術的な問題が見つかりました。", "期限を変えずに範囲を調整できますか。", "各アクションに担当者と期限を設定しましょう。", "決定事項と次の行動をまとめてお送りします。"],
    negotiation: ["まず、提案条件をご説明します。", "単価を調整できる余地はありますか。", "より現実的な納期について相談できますか。", "契約範囲に含まれる内容を確認したいです。", "サポート期間を延長できれば、その条件を受け入れられます。", "その条件の理由を説明していただけますか。", "最低発注量について歩み寄っていただけますか。", "運用上のリスクをどのように分担しますか。", "主要な条件については暫定合意できたと思います。", "最終条件と署名までの日程を確認しましょう。"]
  },
  zh: {
    presentation: ["大家好，今天我来介绍我们的方案。", "最关键的一点是，这个计划可以减少延误。", "这张图显示采用率提高了百分之二十。", "接下来，我们来看实施计划。", "例如，试点团队缩短了审核周期。", "我想重点强调三个方面。", "到这里大家都听明白了吗？", "这个问题很好，我来说明一下前提。", "目前的局限是样本量，下一步会进行更大规模的测试。", "总的来说，这个方案可行而且容易扩展。谢谢大家。"],
    conference: ["请问在哪里领取会议证件？", "我的研究主要关注人的决策行为。", "这张海报总结了研究方法和主要发现。", "你们是怎么控制选择偏差的？", "这些结果说明二者有很强的相关性，对吗？", "可以再详细介绍一下第二个实验吗？", "我们的研究方向很接近，有兴趣合作吗？", "可以给我一张名片或者邮箱吗？", "我们下周可以安排一次后续会议吗？", "很高兴和你交流，我之后把论文发给你。"],
    partner: ["我负责我们这边的产品战略。", "我们先确认一下双方对成功的定义。", "可以具体说明一下所需的规格吗？", "我们可以确定每个阶段的里程碑吗？", "每项交付物由谁负责？", "目前进度正常，不过有一项依赖可能造成延误。", "我们发现了一个系统集成问题。", "可以在不推迟截止日期的情况下调整范围吗？", "我们给每项行动确定负责人和截止日期吧。", "我会把决定和下一步行动整理后发给大家。"],
    negotiation: ["我先介绍一下我们的提案条件。", "单价还有调整的空间吗？", "我们可以讨论一个更现实的交付时间吗？", "我想确认合同范围里包含哪些内容。", "如果延长支持期，我们可以接受这个条件。", "可以解释一下提出这个条件的原因吗？", "最低订购量方面，双方可以各让一步吗？", "运营风险应该怎么分担？", "听起来主要条件已经初步达成一致。", "我们确认一下最终条件和签约时间吧。"]
  }
};

const businessUsefulTranslations = {
  en: ["Let me begin with a brief overview.", "The point I'd like to emphasize is this.", "With that in mind, let's move to the next slide.", "I'm happy to take questions.", "Our findings are consistent with prior research.", "What brought you to this conference?", "For your information, the project is still a work in progress.", "Would you be open to revisiting that condition?", "I see your point; however, there is one concern.", "Thank you for your time. I'll follow up in writing."],
  ja: ["まず概要からご説明します。", "ここで強調したい点はこちらです。", "それを踏まえて、次のスライドに移ります。", "ご質問をお受けします。", "今回の結果は先行研究と一致しています。", "今回の学会にはどのような目的で参加されましたか。", "参考までに、このプロジェクトはまだ進行中です。", "その条件について再検討していただけますか。", "おっしゃる点は理解できますが、一つ懸念があります。", "お時間をいただきありがとうございました。書面で改めてご連絡します。"],
  zh: ["我先简单介绍一下整体情况。", "这里我想强调的重点是这一点。", "基于这一点，我们来看下一页。", "下面欢迎大家提问。", "我们的发现和以往研究一致。", "你这次为什么来参加这个会议？", "供参考，这个项目还在进行中。", "可以重新考虑一下这个条件吗？", "我理解你的观点，不过我有一个顾虑。", "感谢你的时间，我会再发一份书面总结。"]
};

const sentenceDecoys = {
  en: ["not yet", "didn't", "because of", "wouldn't", "at all", "unless", "used to", "by mistake", "instead", "without"],
  ja: ["まだしていません", "ではなく", "にもかかわらず", "しないで", "だけでした", "のはずが", "つもりはなく", "間違って", "代わりに", "とは限りません"],
  zh: ["还没有", "并不是", "因为", "不会", "完全不", "除非", "以前常常", "不小心", "反而", "没有"]
};

const dialogueFlows = {
  en: {
    social: { opening: "Let's practice today's social situation. How would you start?", openingKo: "오늘의 사교 상황을 연습해 볼게요. 어떻게 대화를 시작할까요?", replies: [["Nice start. What detail would you add next?", "좋은 시작이에요. 다음에는 어떤 내용을 덧붙일까요?"], ["That keeps the conversation going. How would you respond to a follow-up?", "대화가 자연스럽게 이어지네요. 추가 질문에는 어떻게 답할까요?"], ["That sounded natural. Let's close the conversation politely.", "자연스러웠어요. 이제 정중하게 대화를 마무리해 볼게요."]] },
    service: { opening: "Hello. Tell me what you need in this situation.", openingKo: "안녕하세요. 이 상황에서 필요한 것을 말씀해 주세요.", replies: [["I understand. Could you give me one more detail?", "알겠습니다. 세부 사항을 한 가지 더 알려주시겠어요?"], ["Thanks. Here is one option—how would you confirm it?", "감사합니다. 가능한 방법이 하나 있어요. 어떻게 확인하시겠어요?"], ["Everything is confirmed. Thank you for checking the details.", "모든 내용을 확인했습니다. 세부 사항을 확인해 주셔서 감사합니다."]] },
    professional: { opening: "Let's work through today's task. How would you explain the situation?", openingKo: "오늘의 업무·학습 상황을 연습해 볼게요. 상황을 어떻게 설명할까요?", replies: [["That's clear. Which detail should we confirm first?", "명확하네요. 어떤 세부 사항을 먼저 확인할까요?"], ["Good point. What next step would you suggest?", "좋은 지적이에요. 어떤 다음 단계를 제안하시겠어요?"], ["That works. Let's confirm the owner and timing.", "좋습니다. 담당자와 일정을 확인하죠."]] },
    resolution: { opening: "Please explain what happened and what outcome you need.", openingKo: "무슨 일이 있었고 어떤 해결이 필요한지 설명해 주세요.", replies: [["I understand the issue. What happened immediately before that?", "문제를 이해했습니다. 직전에는 어떤 일이 있었나요?"], ["Thanks for clarifying. Which solution would be acceptable?", "설명 감사합니다. 어떤 해결 방법이라면 괜찮을까요?"], ["We've agreed on a solution. I'll confirm the final result.", "해결 방법에 합의했습니다. 최종 결과를 확인할게요."]] },
    business: { opening: "Let's begin the business scenario. State your objective clearly.", openingKo: "비즈니스 상황을 시작합니다. 목표를 명확하게 말해 보세요.", replies: [["Thank you. What evidence or condition supports that point?", "감사합니다. 그 의견을 뒷받침하는 근거나 조건은 무엇인가요?"], ["That is useful. How would you propose the next action?", "유용한 설명입니다. 다음 행동은 어떻게 제안하시겠어요?"], ["We're aligned. Let's document the decision, owner, and deadline.", "의견이 정리됐습니다. 결정·담당자·기한을 문서로 남기죠."]] }
  },
  ja: {
    social: { opening: "今日の交流場面を練習しましょう。どのように話し始めますか。", openingKo: "오늘의 사교 상황을 연습해 볼게요. 어떻게 대화를 시작할까요?", replies: [["いい始め方ですね。次にどんな情報を加えますか。", "좋은 시작이에요. 다음에는 어떤 정보를 덧붙일까요?"], ["会話が自然につながっています。次の質問にはどう答えますか。", "대화가 자연스럽게 이어지고 있어요. 다음 질문에는 어떻게 답할까요?"], ["自然でした。最後に丁寧に会話を終えましょう。", "자연스러웠어요. 마지막으로 정중하게 대화를 마무리해 볼게요."]] },
    service: { opening: "こんにちは。この場面で必要なことを伝えてください。", openingKo: "안녕하세요. 이 상황에서 필요한 것을 말씀해 주세요.", replies: [["分かりました。もう一つ詳しく教えていただけますか。", "알겠습니다. 세부 사항을 하나 더 알려주시겠어요?"], ["ありがとうございます。一つ方法があります。どのように確認しますか。", "감사합니다. 가능한 방법이 하나 있어요. 어떻게 확인하시겠어요?"], ["内容を確認できました。詳しく伝えていただきありがとうございます。", "내용을 확인했습니다. 자세히 말씀해 주셔서 감사합니다."]] },
    professional: { opening: "今日の課題を練習しましょう。状況をどのように説明しますか。", openingKo: "오늘의 업무·학습 상황을 연습해 볼게요. 상황을 어떻게 설명할까요?", replies: [["よく分かりました。まず何を確認しますか。", "잘 이해했습니다. 무엇을 먼저 확인할까요?"], ["いい視点です。次の行動をどう提案しますか。", "좋은 관점이에요. 다음 행동을 어떻게 제안할까요?"], ["では、担当者と日程を確認しましょう。", "그럼 담당자와 일정을 확인하죠."]] },
    resolution: { opening: "何が起きて、どんな対応が必要か説明してください。", openingKo: "무슨 일이 있었고 어떤 대응이 필요한지 설명해 주세요.", replies: [["状況は分かりました。その直前には何がありましたか。", "상황을 이해했습니다. 직전에는 어떤 일이 있었나요?"], ["説明ありがとうございます。どの解決方法なら受け入れられますか。", "설명 감사합니다. 어떤 해결 방법이라면 괜찮을까요?"], ["解決方法を確認できました。最後の結果も確認します。", "해결 방법을 확인했습니다. 최종 결과도 확인할게요."]] },
    business: { opening: "ビジネス場面を始めます。目的を明確に伝えてください。", openingKo: "비즈니스 상황을 시작합니다. 목표를 명확하게 말해 보세요.", replies: [["ありがとうございます。その点を支える根拠や条件は何ですか。", "감사합니다. 그 의견을 뒷받침하는 근거나 조건은 무엇인가요?"], ["参考になります。次の行動をどのように提案しますか。", "도움이 되네요. 다음 행동을 어떻게 제안하시겠어요?"], ["認識が合いました。決定・担当・期限を文書に残しましょう。", "의견이 정리됐습니다. 결정·담당·기한을 문서로 남기죠."]] }
  },
  zh: {
    social: { opening: "我们来练习今天的社交场景。你会怎么开口？", openingKo: "오늘의 사교 상황을 연습해 볼게요. 어떻게 대화를 시작할까요?", replies: [["开场很自然。接下来你想补充什么？", "시작이 자연스러워요. 다음에는 어떤 내용을 덧붙일까요?"], ["对话衔接得很好。面对追问你会怎么回答？", "대화가 잘 이어져요. 추가 질문에는 어떻게 답할까요?"], ["说得很自然。最后礼貌地结束对话吧。", "자연스러웠어요. 마지막으로 정중하게 대화를 마무리해 볼게요."]] },
    service: { opening: "您好，请说明你在这个场景中需要什么。", openingKo: "안녕하세요. 이 상황에서 필요한 것을 말씀해 주세요.", replies: [["我明白了，可以再补充一个细节吗？", "알겠습니다. 세부 사항을 하나 더 알려주시겠어요?"], ["谢谢。有一个可行的办法，你会怎么确认？", "감사합니다. 가능한 방법이 하나 있어요. 어떻게 확인하시겠어요?"], ["内容已经确认，谢谢你说明得这么清楚。", "내용을 확인했습니다. 자세히 설명해 주셔서 감사합니다."]] },
    professional: { opening: "我们来练习今天的工作或学习任务。你会怎么说明情况？", openingKo: "오늘의 업무·학습 상황을 연습해 볼게요. 상황을 어떻게 설명할까요?", replies: [["说得很清楚。我们先确认哪个细节？", "명확해요. 어떤 세부 사항을 먼저 확인할까요?"], ["这个观点很好。你建议下一步怎么做？", "좋은 관점이에요. 다음 단계는 어떻게 제안할까요?"], ["可以。我们确认一下负责人和时间。", "좋습니다. 담당자와 일정을 확인하죠."]] },
    resolution: { opening: "请说明发生了什么，以及你希望怎么解决。", openingKo: "무슨 일이 있었고 어떤 해결을 원하는지 설명해 주세요.", replies: [["我了解问题了。在这之前发生了什么？", "문제를 이해했습니다. 직전에는 어떤 일이 있었나요?"], ["谢谢说明。哪种解决办法你可以接受？", "설명 감사합니다. 어떤 해결 방법이라면 괜찮을까요?"], ["解决方案已经确定，我再确认最终结果。", "해결 방법을 정했습니다. 최종 결과를 확인할게요."]] },
    business: { opening: "我们开始商务场景。请先明确说明你的目标。", openingKo: "비즈니스 상황을 시작합니다. 목표를 명확하게 말해 보세요.", replies: [["谢谢。有什么证据或条件支持这一点？", "감사합니다. 그 의견을 뒷받침하는 근거나 조건은 무엇인가요?"], ["这个信息很有用。你建议下一步怎么做？", "유용한 정보예요. 다음 행동은 어떻게 제안하시겠어요?"], ["双方已经达成一致。我们记录决定、负责人和截止日期吧。", "의견이 정리됐습니다. 결정·담당자·기한을 기록하죠."]] }
  }
};

const adaptiveDialogueFlows = {
  en: {
    social: { opening: "Hi! What would you like to talk about today?", openingKo: "안녕하세요! 오늘은 어떤 이야기를 나누고 싶나요?", replies: [["That sounds interesting. Could you tell me a little more?", "흥미롭네요. 조금 더 이야기해 주시겠어요?"], ["I see. How do you feel about that?", "그렇군요. 그것에 대해 어떻게 느끼나요?"], ["Thanks for sharing. It was nice talking with you.", "이야기해 줘서 고마워요. 대화해서 즐거웠어요."]] },
    service: { opening: "Hello. How can I help you today?", openingKo: "안녕하세요. 무엇을 도와드릴까요?", replies: [["Certainly. Could you give me one more detail so I can help?", "물론이죠. 도와드릴 수 있도록 세부 사항을 하나 더 알려주시겠어요?"], ["Thank you. Here is an option we can offer. Would that work for you?", "감사합니다. 가능한 방법이 하나 있습니다. 괜찮으실까요?"], ["Great. Everything is arranged. Is there anything else you need?", "좋습니다. 모두 처리됐습니다. 더 필요한 것이 있나요?"]] },
    professional: { opening: "Sure. What would you like to discuss first?", openingKo: "좋아요. 무엇부터 이야기하고 싶나요?", replies: [["Of course. Which part would you like to focus on?", "물론이죠. 어느 부분을 중점적으로 보고 싶나요?"], ["Thanks, that's clear. What would be the most useful next step?", "감사합니다. 명확하네요. 가장 유용한 다음 단계는 무엇일까요?"], ["That sounds good. Let's confirm what you'll do next.", "좋습니다. 다음에 할 일을 확인해 보죠."]] },
    resolution: { opening: "I'm sorry you're dealing with that. Could you tell me what happened?", openingKo: "그런 일을 겪으셨다니 유감입니다. 무슨 일이 있었는지 말씀해 주시겠어요?", replies: [["I understand the problem. What outcome would work best for you?", "문제를 이해했습니다. 어떤 결과가 가장 적절할까요?"], ["That seems reasonable. Let me explain what we can do.", "합리적인 요청입니다. 가능한 조치를 설명드릴게요."], ["We've agreed on a solution. I'll confirm the final details now.", "해결 방법에 합의했습니다. 이제 최종 내용을 확인하겠습니다."]] },
    business: { opening: "Thanks for meeting with us. What would you like to cover first?", openingKo: "미팅에 참석해 주셔서 감사합니다. 무엇부터 논의할까요?", replies: [["Understood. What evidence or condition supports that point?", "알겠습니다. 그 의견을 뒷받침하는 근거나 조건은 무엇인가요?"], ["That helps. What action would you recommend next?", "도움이 되네요. 다음으로 어떤 행동을 제안하시겠어요?"], ["We're aligned. Let's confirm the decision, owner, and deadline.", "의견이 정리됐습니다. 결정 사항과 담당자, 기한을 확인하죠."]] }
  },
  ja: {
    social: { opening: "こんにちは。今日はどんな話をしましょうか。", openingKo: "안녕하세요. 오늘은 어떤 이야기를 나눌까요?", replies: [["そうなんですね。もう少し詳しく教えてください。", "그렇군요. 조금 더 자세히 이야기해 주세요."], ["なるほど。それについてどう感じましたか。", "그렇군요. 그것에 대해 어떻게 느꼈나요?"], ["話してくれてありがとうございます。お話しできてよかったです。", "이야기해 줘서 고마워요. 대화해서 즐거웠어요."]] },
    service: { opening: "いらっしゃいませ。今日はどのようなご用件ですか。", openingKo: "어서 오세요. 오늘은 무엇을 도와드릴까요?", replies: [["承知しました。確認のため、もう少し詳しく教えていただけますか。", "알겠습니다. 확인을 위해 조금 더 자세히 말씀해 주시겠어요?"], ["ありがとうございます。こちらの方法はいかがでしょうか。", "감사합니다. 이 방법은 어떠신가요?"], ["では、その内容で手配します。ほかに必要なことはありますか。", "그럼 그 내용으로 처리하겠습니다. 더 필요한 것이 있나요?"]] },
    professional: { opening: "はい、今日は何について確認しましょうか。", openingKo: "네, 오늘은 무엇을 확인할까요?", replies: [["分かりました。まず、どの点を詳しく見ましょうか。", "알겠습니다. 먼저 어느 부분을 자세히 볼까요?"], ["よく分かりました。次に何をするのがよいでしょうか。", "잘 알겠습니다. 다음에는 무엇을 하면 좋을까요?"], ["いいですね。では、次の行動を確認しましょう。", "좋습니다. 그럼 다음 행동을 확인하죠."]] },
    resolution: { opening: "ご不便をおかけして申し訳ありません。何があったか教えてください。", openingKo: "불편을 드려 죄송합니다. 무슨 일이 있었는지 말씀해 주세요.", replies: [["状況は分かりました。どのような解決をご希望ですか。", "상황을 이해했습니다. 어떤 해결을 원하시나요?"], ["承知しました。こちらでできる対応をご説明します。", "알겠습니다. 저희가 할 수 있는 조치를 설명드리겠습니다."], ["対応方法が決まりました。最後に内容を確認します。", "대응 방법이 정해졌습니다. 마지막으로 내용을 확인하겠습니다."]] },
    business: { opening: "本日はありがとうございます。まず何から確認しましょうか。", openingKo: "오늘 참석해 주셔서 감사합니다. 먼저 무엇부터 확인할까요?", replies: [["承知しました。その点を支える根拠や条件は何ですか。", "알겠습니다. 그 점을 뒷받침하는 근거나 조건은 무엇인가요?"], ["参考になります。次の行動をどう提案しますか。", "도움이 됩니다. 다음 행동은 어떻게 제안하시겠어요?"], ["認識が合いました。決定・担当・期限を確認しましょう。", "의견이 정리됐습니다. 결정·담당자·기한을 확인하죠."]] }
  },
  zh: {
    social: { opening: "你好！今天想聊点什么？", openingKo: "안녕하세요! 오늘은 어떤 이야기를 나누고 싶나요?", replies: [["听起来很有意思，可以再多说一点吗？", "흥미롭네요. 조금 더 이야기해 주시겠어요?"], ["原来如此。你对此有什么感受？", "그렇군요. 그것에 대해 어떻게 느끼나요?"], ["谢谢你和我分享，和你聊天很开心。", "이야기해 줘서 고마워요. 대화해서 즐거웠어요."]] },
    service: { opening: "您好，今天需要什么帮助？", openingKo: "안녕하세요. 오늘은 무엇을 도와드릴까요?", replies: [["好的。为了帮你处理，可以再说一个细节吗？", "알겠습니다. 처리를 위해 세부 사항을 하나 더 알려주시겠어요?"], ["谢谢。我们可以提供这个方案，你觉得可以吗？", "감사합니다. 이 방법을 제공할 수 있는데 괜찮으신가요?"], ["好的，已经安排好了。还需要别的帮助吗？", "좋습니다. 모두 처리됐습니다. 더 필요한 도움이 있나요?"]] },
    professional: { opening: "好的，我们先讨论什么？", openingKo: "좋습니다. 무엇부터 이야기할까요?", replies: [["明白了。你想先重点确认哪一部分？", "알겠습니다. 어느 부분을 먼저 중점적으로 확인하고 싶나요?"], ["说得很清楚。下一步怎么做最合适？", "명확하네요. 다음 단계는 어떻게 하는 것이 가장 좋을까요?"], ["很好。我们确认一下接下来要做的事。", "좋습니다. 다음에 할 일을 확인해 보죠."]] },
    resolution: { opening: "很抱歉给你带来不便。可以说一下发生了什么吗？", openingKo: "불편을 드려 죄송합니다. 무슨 일이 있었는지 말씀해 주시겠어요?", replies: [["我了解问题了。你希望怎么解决？", "문제를 이해했습니다. 어떻게 해결되기를 원하시나요?"], ["这个要求很合理。我来说明我们可以怎么处理。", "합리적인 요청입니다. 가능한 조치를 설명드릴게요."], ["解决办法已经确定，我再确认一下最后的细节。", "해결 방법이 정해졌습니다. 최종 내용을 다시 확인하겠습니다."]] },
    business: { opening: "感谢参加会议。我们先讨论哪一项？", openingKo: "회의에 참석해 주셔서 감사합니다. 무엇부터 논의할까요?", replies: [["明白。有什么证据或条件支持这一点？", "알겠습니다. 그 의견을 뒷받침하는 근거나 조건은 무엇인가요?"], ["这个信息很有帮助。下一步你建议怎么做？", "도움이 되는 정보입니다. 다음으로 무엇을 제안하시겠어요?"], ["双方意见一致了。我们确认决定、负责人和截止日期吧。", "의견이 정리됐습니다. 결정·담당자·기한을 확인하죠."]] }
  }
};

function targetTokens(text, language) {
  const locale = languageMeta[language].speech;
  let units;
  try {
    units = [...new Intl.Segmenter(locale, { granularity: "word" }).segment(text)].map((item) => item.segment).filter((item) => item.trim());
  } catch {
    units = language === "en" ? text.split(/\s+/) : [...text];
  }
  if (units.length <= 3) return units;
  const size = Math.ceil(units.length / 3);
  return [units.slice(0, size), units.slice(size, size * 2), units.slice(size * 2)].filter((part) => part.length).map((part) => part.join(language === "en" ? " " : ""));
}

function seededShuffle(items, seed) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.abs((seed * 9301 + index * 49297) % (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

const sentenceMeaningOverrides = {
  en: {
    "Hi, I'm Min. I just joined this class.": "안녕하세요, 저는 민이에요. 이 수업에 막 들어왔어요.",
    "Could I ask a question about today's lesson?": "오늘 수업에 대해 질문 하나 해도 될까요?",
    "Could you explain that part again?": "그 부분을 다시 설명해 주실 수 있나요?",
    "What exactly do we need to do for the assignment?": "과제를 위해 정확히 무엇을 해야 하나요?",
    "When is the assignment due?": "과제 제출 기한은 언제인가요?",
    "When is the exam, and what does it cover?": "시험은 언제이고, 시험 범위는 어디까지인가요?",
    "Could I see your notes from class?": "수업 필기를 봐도 될까요?",
    "Which part should each of us handle?": "각자 어느 부분을 맡으면 좋을까요?",
    "Today I'd like to present our main idea.": "오늘은 저희의 핵심 아이디어를 발표하겠습니다.",
    "Could we talk about my academic progress?": "제 학업 진도에 관해 이야기할 수 있을까요?"
  }
};

const sentenceLearningOverrides = {
  en: {
    "Could I ask a question about today's lesson?": {
      focus: "Could I ask ~?",
      meaning: "상대의 허락을 구하며 질문을 꺼내는 정중한 표현",
      alternative: "Can I ask ~?",
      grammar: "Could I ask ~?에서 could는 과거가 아니라 요청의 어조를 부드럽게 만드는 조동사입니다. about은 질문의 주제를 연결합니다.",
      wrongMeaning: "과거에 질문할 수 있었다",
      politeness: 68,
      alternatives: [
        { form: "Could I ask ~?", note: "정중하고 부드러움" },
        { form: "Can I ask ~?", note: "자연스럽고 조금 더 편한 느낌" },
        { form: "I have a question about ~.", note: "직접적이지만 무례하지 않음" },
        { form: "May I ask ~?", note: "더 격식 있는 느낌" }
      ],
      options: [
        { text: "‘Could I ask ~?’는 상대의 허락을 구하며 질문을 꺼내는 정중한 표현이다.", correct: true },
        { text: "‘about today's lesson’에서 about은 질문의 주제가 오늘 수업임을 나타낸다.", correct: true },
        { text: "이 문장의 could는 과거에 질문할 능력이 있었다는 뜻만 나타낸다.", correct: false },
        { text: "‘today's lesson’은 어제 끝난 수업을 뜻한다.", correct: false },
        { text: "‘ask a question’은 질문에 대답한다는 뜻이다.", correct: false }
      ]
    },
    "Hi, I'm Min. I just joined this class.": {
      focus: "just joined",
      meaning: "방금 또는 최근에 합류했다",
      alternative: "recently joined",
      grammar: "just는 과거동사 joined 앞에서 ‘방금·최근’이라는 시간 뉘앙스를 더합니다. join은 목적어를 바로 취하므로 joined this class처럼 전치사 없이 씁니다.",
      wrongMeaning: "오래전에 수업을 그만두었다",
      politeness: 42,
      alternatives: [
        { form: "I just joined this class.", note: "막 합류했다는 점을 강조" },
        { form: "I recently joined this class.", note: "최근에 합류했다는 중립적인 표현" },
        { form: "I'm new to this class.", note: "이 수업이 처음이라는 자연스러운 표현" },
        { form: "This is my first class here.", note: "첫 수업이라는 사실을 직접 설명" }
      ],
      options: [
        { text: "‘just joined’는 이 수업에 방금 또는 최근에 합류했다는 뜻이다.", correct: true },
        { text: "join은 여기서 타동사이므로 ‘joined this class’처럼 전치사 없이 쓸 수 있다.", correct: true },
        { text: "이 문장의 just는 ‘오직 이 수업만’이라는 뜻이다.", correct: false },
        { text: "joined는 앞으로 수업에 들어갈 예정이라는 미래 표현이다.", correct: false },
        { text: "‘I'm Min’은 상대방의 이름을 묻는 의문문이다.", correct: false }
      ]
    }
  }
};

function situationToSentenceMeaning(situation) {
  const clean = String(situation || "").replace(/[.。！？?!]+$/g, "").trim();
  return `이 문장은 ‘${clean}’라는 의도를 전달합니다.`;
}

function deriveLearningPoint(base, language, situation, mode, seed) {
  const override = sentenceLearningOverrides[language]?.[base];
  if (override) return { ...override, sentenceMeaning: sentenceMeaningOverrides[language]?.[base] || situationToSentenceMeaning(situation) };

  const chunks = targetTokens(base, language);
  const focus = chunks[0] || base;
  const detailFocus = chunks[1] || chunks[0] || base;
  const basePoliteness = { social: 42, service: 66, professional: 72, resolution: 68, business: 80 }[mode];
  const sentenceMeaning = sentenceMeaningOverrides[language]?.[base] || situationToSentenceMeaning(situation);
  const expansions = {
    en: {
      social: ["How about you?", "That sounds interesting.", "Tell me more about that."],
      service: ["Could you help me with that?", "What options are available?", "Could you confirm the details?"],
      professional: ["Could we confirm the details?", "What should our next step be?", "Let's make sure we're aligned."],
      resolution: ["Could we work out a solution?", "What options do we have?", "Could you confirm when this will be resolved?"],
      business: ["Could we align on the next step?", "What evidence supports that?", "Let's confirm the owner and deadline."]
    },
    ja: {
      social: ["あなたはどうですか。", "それは面白いですね。", "もう少し聞かせてください。"],
      service: ["対応していただけますか。", "どんな選択肢がありますか。", "内容を確認していただけますか。"],
      professional: ["詳細を確認できますか。", "次はどう進めますか。", "認識を合わせましょう。"],
      resolution: ["解決方法を相談できますか。", "どんな対応が可能ですか。", "いつ解決できるか確認していただけますか。"],
      business: ["次の対応を確認できますか。", "その根拠を教えていただけますか。", "担当と期限を確認しましょう。"]
    },
    zh: {
      social: ["你呢？", "听起来很有意思。", "可以再多说一点吗？"],
      service: ["可以帮我处理吗？", "有哪些选择？", "可以确认一下细节吗？"],
      professional: ["我们可以确认一下细节吗？", "下一步怎么做？", "我们统一一下理解。"],
      resolution: ["我们可以商量解决办法吗？", "有哪些处理办法？", "可以确认什么时候能解决吗？"],
      business: ["我们可以确认下一步吗？", "有什么证据支持这一点？", "我们确认一下负责人和截止日期吧。"]
    }
  }[language][mode];

  let grammar;
  let meaning = `‘${situation}’ 상황에서 핵심 의도를 전달한다`;
  let politeness = basePoliteness;
  let trueFact;
  let falseFacts;

  if (language === "en") {
    if (/^Could\s+(I|you|we)\s+/i.test(base)) {
      grammar = "요청·허락의 Could는 과거를 말하는 표현이 아니라 말투를 한층 부드럽게 만듭니다. Could + 주어 뒤에는 동사원형이 옵니다.";
      meaning = "상대에게 정중하게 허락을 구하거나 행동을 요청한다";
      politeness = Math.max(politeness, 70);
      trueFact = "Could + 주어 + 동사원형 어순으로 정중한 요청이나 허락을 나타낸다.";
      falseFacts = ["이 문장의 Could는 과거의 능력만 나타낸다.", "Could 뒤의 본동사는 반드시 과거형으로 써야 한다."];
    } else if (/^Can\s+(I|you|we)\s+/i.test(base)) {
      grammar = "Can + 주어 + 동사원형은 일상적인 허락·가능 여부·요청을 나타냅니다. could보다 조금 더 직접적이고 편한 느낌입니다.";
      meaning = "일상적인 말투로 허락이나 가능 여부를 확인한다";
      trueFact = "Can + 주어 + 동사원형 어순을 사용한다.";
      falseFacts = ["이 문장의 Can은 이미 끝난 과거 행동을 나타낸다.", "Can 뒤에는 반드시 to부정사가 온다."];
    } else if (/^I(?:'d| would) like to\s+/i.test(base)) {
      grammar = "I'd like to + 동사원형은 want보다 부드럽게 자신의 희망이나 의사를 밝히는 회화 표현입니다.";
      meaning = "자신이 원하는 행동을 공손하게 밝힌다";
      politeness = Math.max(politeness, 64);
      trueFact = "I'd like to 뒤에는 동사원형이 온다.";
      falseFacts = ["I'd like to는 상대의 제안을 거절하는 표현이다.", "I'd like to 뒤에는 반드시 과거형 동사가 온다."];
    } else if (/^(What|Where|When|Which|How|Why)\b/i.test(base)) {
      const questionWord = base.match(/^(What|Where|When|Which|How|Why)\b/i)?.[0];
      grammar = `${questionWord}로 시작하는 의문문입니다. 묻고 싶은 정보의 종류를 먼저 제시한 뒤 조동사·be동사와 주어를 배치합니다.`;
      trueFact = `문장 첫머리의 ${questionWord}가 답으로 필요한 정보의 종류를 정한다.`;
      falseFacts = [`${questionWord}는 질문과 관계없는 감탄사이다.`, "질문에서도 단어의 어순을 자유롭게 바꿀 수 있다."];
    } else {
      grammar = `영어는 의미 덩어리의 순서가 문장의 역할을 결정합니다. ‘${focus}’ 다음에 ‘${detailFocus}’가 이어지는 실제 어순을 통째로 익혀야 합니다.`;
      trueFact = `‘${focus}’와 ‘${detailFocus}’는 문장에 실제로 쓰인 순서대로 익혀야 한다.`;
      falseFacts = ["영어 문장은 단어 순서를 바꾸어도 의미와 자연스러움이 항상 같다.", `‘${focus}’는 이 문장에 등장하지 않는다.`];
    }
  } else if (language === "ja") {
    if (/いただけますか|もらえますか|くださいませんか/.test(base)) {
      grammar = "〜ていただけますか/〜てもらえますか는 상대에게 행동을 정중하게 부탁하는 구조입니다. 요청할 동사의 て형까지 한 덩어리로 익힙니다.";
      meaning = "상대에게 행동을 정중하게 부탁한다";
      politeness = Math.max(politeness, 78);
      trueFact = "동사의 て형과 요청 표현을 함께 사용해 부탁을 부드럽게 만든다.";
      falseFacts = ["이 어미는 이미 끝난 과거 사실만 보고한다.", "요청 표현 앞의 동사는 항상 사전형으로만 써야 한다."];
    } else if (/[でし]ますか[。？]?$|ですか[。？]?$/.test(base)) {
      grammar = "문장 끝의 〜ますか/〜ですか가 정중한 질문임을 표시합니다. 일본어에서는 질문의 핵심이 문장 끝에 나타나는 경우가 많습니다.";
      trueFact = "문장 끝의 か가 이 문장을 질문으로 만든다.";
      falseFacts = ["문장 끝의 か는 과거 시제를 나타낸다.", "です/ます를 쓰면 항상 친한 친구에게만 맞는 반말이 된다."];
      politeness = Math.max(politeness, 66);
    } else if (/お願いします/.test(base)) {
      grammar = "〜をお願いします는 원하는 대상이나 서비스를 정중하고 간결하게 요청하는 표현입니다.";
      trueFact = "お願いします는 주문·서비스 요청에서 공손한 부탁을 만든다.";
      falseFacts = ["お願いします는 상대의 부탁을 거절하는 표현이다.", "を는 문장 끝에서 질문을 만드는 조사이다."];
      politeness = Math.max(politeness, 70);
    } else {
      grammar = `일본어는 조사와 문장 끝 표현이 단어의 역할과 말투를 정합니다. ‘${focus}’와 ‘${detailFocus}’를 조사·어미까지 함께 익혀야 합니다.`;
      trueFact = `‘${focus}’와 ‘${detailFocus}’는 조사와 어미를 포함한 실제 순서로 익혀야 한다.`;
      falseFacts = ["일본어에서는 조사를 바꾸어도 단어의 역할이 항상 같다.", `‘${focus}’는 이 문장에 등장하지 않는다.`];
    }
  } else {
    if (/可以|能不能|能[^，。！？?]*吗/.test(base)) {
      grammar = "可以/能(不能) + 동작 + 吗는 허락이나 가능 여부를 묻는 대표적인 구조입니다. 吗는 문장 전체를 예/아니요 질문으로 만듭니다.";
      meaning = "허락이나 가능 여부를 확인한다";
      trueFact = "可以/能과 吗를 사용해 가능 여부나 허락을 묻는다.";
      falseFacts = ["吗는 완료된 과거 행동을 표시한다.", "可以 뒤에는 행동을 나타내는 동사를 쓸 수 없다."];
      politeness = Math.max(politeness, 62);
    } else if (/请/.test(base)) {
      grammar = "请 + 동작은 상대에게 행동을 요청할 때 쓰는 기본적인 정중 표현입니다. 구체적인 요청 내용을 请 뒤에 둡니다.";
      meaning = "상대에게 행동을 정중하게 요청한다";
      trueFact = "请 뒤에 원하는 행동을 두어 정중한 요청을 만든다.";
      falseFacts = ["请는 상대의 요청을 거절하는 표현이다.", "请는 문장 속 행동과 관계없는 과거 표지이다."];
      politeness = Math.max(politeness, 70);
    } else if (/还是/.test(base)) {
      grammar = "A 还是 B는 두 가지 선택지를 제시해 어느 쪽인지 묻는 구조입니다. 실제 회화에서는 선택지를 같은 문장 안에 나란히 둡니다.";
      trueFact = "还是가 두 선택지를 연결해 어느 쪽인지 묻는다.";
      falseFacts = ["还是는 두 선택을 모두 반드시 해야 한다는 뜻이다.", "还是는 완료된 행동을 나타내는 시제 표지이다."];
    } else if (/吗[？。]?$/.test(base)) {
      grammar = "평서문의 기본 어순을 유지하고 끝에 吗를 붙이면 예/아니요로 답하는 질문이 됩니다.";
      trueFact = "문장 끝의 吗가 예/아니요 질문을 만든다.";
      falseFacts = ["吗는 부정문에서만 사용할 수 있다.", "吗를 붙이면 반드시 과거 시제가 된다."];
    } else {
      grammar = `중국어는 어순이 문장 성분의 관계를 보여 줍니다. ‘${focus}’와 ‘${detailFocus}’를 실제 순서와 성조로 함께 익혀야 합니다.`;
      trueFact = `‘${focus}’와 ‘${detailFocus}’는 문장에 나온 순서를 유지해 익혀야 한다.`;
      falseFacts = ["중국어는 단어 순서를 바꾸어도 의미가 항상 같다.", `‘${focus}’는 이 문장에 등장하지 않는다.`];
    }
  }

  const rawOptions = [
    { text: `‘${focus}’는 ‘${situation}’ 의도를 시작하거나 핵심 내용을 이루는 실제 표현이다.`, correct: true },
    { text: trueFact, correct: true },
    { text: falseFacts[0], correct: false },
    { text: falseFacts[1], correct: false },
    { text: `이 문장은 ‘${situation}’과 관계없는 뜻만 전달한다.`, correct: false }
  ];
  return {
    focus,
    detailFocus,
    meaning,
    alternative: expansions[0],
    grammar,
    wrongMeaning: falseFacts[0],
    sentenceMeaning,
    politeness,
    options: rawOptions,
    alternatives: [
      { form: base, note: "오늘 문장의 완성형" },
      { form: expansions[0], note: "같은 장면에서 바로 이어 쓰는 표현" },
      { form: expansions[1], note: "세부 정보나 선택지를 확인하는 표현" },
      { form: expansions[2], note: "대화를 다음 단계로 연결하는 표현" }
    ]
  };
}

function buildQuiz(point, situation, target, expansion, seed) {
  const rawOptions = point.options || [
    { text: `‘${point.focus}’는 ${point.meaning}.`, correct: true },
    { text: `‘${point.detailFocus}’는 문장에서 대상·조건·상황을 구체화하는 의미 덩어리다.`, correct: true },
    { text: `‘${point.focus}’는 ‘${point.wrongMeaning}’라는 뜻이다.`, correct: false },
    { text: `‘${point.detailFocus}’를 빼거나 다른 위치로 옮겨도 문장의 의미는 전혀 달라지지 않는다.`, correct: false },
    { text: "이 문장은 기본 어순과 관계없이 단어를 자유롭게 배열해도 자연스럽다.", correct: false }
  ];
  const options = seededShuffle(rawOptions, seed);
  return {
    options,
    prompt: point.quizPrompt || "표현이 실제로 쓰이는 장면을 하나 고르세요.",
    explanation: point.grammar,
    sentenceMeaning: point.sentenceMeaning,
    politeness: point.politeness,
    alternatives: point.alternatives,
    correctIndices: options.map((option, index) => option.correct ? index : -1).filter((index) => index >= 0),
    sentence: target
  };
}

const conversationFormulaOverrides = {
  en: {
    "Nice to meet you.": {
      formulas: [
        "Nice to meet you. / Nice to meet you, too.",
        "It's + great / lovely + to meet you.",
        "Nice to meet you + 이름·소개 한마디",
        "I don't think we've met. I'm + 이름.",
        "It was great meeting you. (헤어질 때)"
      ],
      examples: [
        [{ sentence: "Nice to meet you.", highlight: "Nice to meet you" }, { sentence: "Nice to meet you, too.", highlight: "too" }, { sentence: "Hi, I'm Min. Nice to meet you.", highlight: "I'm Min" }],
        [{ sentence: "It's great to meet you.", highlight: "great" }, { sentence: "Lovely to meet you.", highlight: "Lovely" }, { sentence: "Nice to meet you. I'm Min.", highlight: "I'm Min" }],
        [{ sentence: "Nice to meet you. I'm Min, and I work in design.", highlight: "I work in design" }, { sentence: "It's great to meet you. What brings you here?", highlight: "What brings you here" }, { sentence: "Nice to meet you, too. How do you know Alex?", highlight: "How do you know Alex" }],
        [{ sentence: "I don't think we've met. I'm Min.", highlight: "I don't think we've met" }, { sentence: "I believe this is our first time meeting in person.", highlight: "first time meeting in person" }, { sentence: "We've emailed before, but it's nice to finally meet you.", highlight: "finally meet you" }],
        [{ sentence: "It was great meeting you.", highlight: "meeting" }, { sentence: "It was lovely talking with you.", highlight: "talking with you" }, { sentence: "Great to finally put a face to the name.", highlight: "put a face to the name" }]
      ],
      nativeVariants: [
        "It's great to meet you.",
        "Nice to finally meet you in person.",
        "It was great meeting you."
      ],
      chunks: [
        { text: "Nice to meet you", note: "처음 인사할 때 쓰는 기본 표현. 이미 아는 사람에게는 Good to see you가 자연스럽습니다." },
        { text: "I don't think we've met", note: "처음 보는 사람에게 부담 없이 말을 걸 때 자주 쓰는 도입" },
        { text: "It was great meeting you", note: "대화를 마치고 헤어질 때 쓰는 표현" }
      ]
    },
    "Could I ask a question about today's lesson?": {
      formulas: [
        "Could I ask a question about + 주제?",
        "Could I ask a question about + 명사 주제?",
        "Could I ask a question about + 구체적인 주제·상황?",
        "Could I ask a question about + 명사절·복합 주제?",
        "Could I ask you a quick question about + 복합 주제?"
      ],
      examples: [
        [
          { sentence: "Could I ask a question about the homework?", highlight: "the homework" },
          { sentence: "Could I ask a question about the schedule?", highlight: "the schedule" },
          { sentence: "Could I ask a question about your presentation?", highlight: "your presentation" }
        ],
        [
          { sentence: "Could I ask a question about the assignment?", highlight: "the assignment" },
          { sentence: "Could I ask a question about the exam?", highlight: "the exam" },
          { sentence: "Could I ask a question about our group project?", highlight: "our group project" }
        ],
        [
          { sentence: "Could I ask a question about the feedback you gave me?", highlight: "the feedback you gave me" },
          { sentence: "Could I ask a question about next week's deadline?", highlight: "next week's deadline" },
          { sentence: "Could I ask a question about how the grade is calculated?", highlight: "how the grade is calculated" }
        ],
        [
          { sentence: "Could I ask a question about why this approach was chosen?", highlight: "why this approach was chosen" },
          { sentence: "Could I ask a question about whether the data is reliable?", highlight: "whether the data is reliable" },
          { sentence: "Could I ask a question about what the results imply?", highlight: "what the results imply" }
        ],
        [
          { sentence: "Could I ask you a quick question about the trade-offs involved?", highlight: "the trade-offs involved" },
          { sentence: "Could I ask you a quick question about how this holds up in practice?", highlight: "how this holds up in practice" },
          { sentence: "Could I ask you a quick question about a potential edge case?", highlight: "a potential edge case" }
        ]
      ],
      nativeVariants: [
        "Could I ask you a quick question?",
        "I have a quick question about today's lesson.",
        "Can I ask you something about today's lesson?"
      ],
      chunks: [
        { text: "quick question", note: "짧게 물을 내용이 있다는 뜻으로 매우 자주 쓰는 덩어리" },
        { text: "ask you something", note: "ask a question보다 편하고 자연스러운 회화형" },
        { text: "about today's lesson", note: "about 뒤에 질문의 주제를 붙이는 구조" }
      ]
    }
  }
};

function buildVerifiedConversationFormula(base, language, situation, mode, levelIndex) {
  const override = conversationFormulaOverrides[language]?.[base];
  const levelTips = [
    "핵심 어순을 그대로 유지하며 한 자리만 바꿔 말합니다.",
    "대상·시간·장소를 바꾸되 문장 뼈대는 유지합니다.",
    "조건이나 이유를 한 덩어리씩 덧붙여 확장합니다.",
    "완곡한 태도와 명사절을 사용해 의미를 정교하게 조절합니다.",
    "원어민이 자주 쓰는 청크와 자연스러운 생략까지 함께 익힙니다."
  ];
  if (override) {
    return {
      formula: override.formulas[levelIndex],
      examples: override.examples[levelIndex],
      nativeVariants: override.nativeVariants,
      chunks: override.chunks,
      levelTip: levelTips[levelIndex]
    };
  }

  let profile;
  if (language === "en") {
    if (/^Could I\s+/i.test(base)) profile = {
      formula: "Could I + 동사원형 + 요청 내용?",
      examples: [base, "Could I check one detail?", "Could I ask about the schedule?"],
      variants: ["Can I check one detail?", "Would it be okay if I asked one question?", "I was wondering if I could check something."],
      chunk: "Could I"
    };
    else if (/^Could you\s+/i.test(base)) profile = {
      formula: "Could you + 동사원형 + 요청 내용?",
      examples: [base, "Could you explain that again?", "Could you confirm the deadline?"],
      variants: ["Can you help me with this?", "Would you mind checking this?", "Is there any chance you could take a look?"],
      chunk: "Could you"
    };
    else if (/^Can I\s+/i.test(base)) profile = {
      formula: "Can I + 동사원형 + 요청 내용?",
      examples: [base, "Can I see the menu?", "Can I change the time?"],
      variants: ["Could I see the menu?", "Is it okay if I change the time?", "Would it be possible to change the time?"],
      chunk: "Can I"
    };
    else if (/^Can you\s+/i.test(base)) profile = {
      formula: "Can you + 동사원형 + 요청 내용?",
      examples: [base, "Can you check the reservation?", "Can you send me the file?"],
      variants: ["Could you check that for me?", "Would you mind sending it over?", "Could you help me with this?"],
      chunk: "Can you"
    };
    else if (/^I(?:'d| would) like to\s+/i.test(base)) profile = {
      formula: "I'd like to + 동사원형 + 원하는 행동",
      examples: [base, "I'd like to change my reservation.", "I'd like to confirm the next step."],
      variants: ["I was hoping to change my reservation.", "Could I change my reservation?", "I'd like some help with my reservation."],
      chunk: "I'd like to"
    };
    else if (/^Would you\s+/i.test(base)) profile = {
      formula: "Would you + 동사원형 + 요청 내용?",
      examples: [base, "Would you check this for me?", "Would you explain the difference?"],
      variants: ["Could you check this for me?", "Would you mind checking this?", "I'd appreciate it if you could check this."],
      chunk: "Would you"
    };
    else if (/^Let's\s+/i.test(base)) profile = {
      formula: "Let's + 동사원형 + 함께 할 행동",
      examples: [base, "Let's review the details.", "Let's confirm the next step."],
      variants: ["Why don't we review the details?", "How about reviewing the details?", "We should probably confirm the next step."],
      chunk: "Let's"
    };
    else if (/^(What|Where|When|Which|How|Why)\b/i.test(base)) {
      const wh = base.match(/^(What|Where|When|Which|How|Why)\b/i)?.[0];
      const examples = {
        What: ["What do we need to prepare?", "What would you recommend?"],
        Where: ["Where should we meet?", "Where can I find the station?"],
        When: ["When does the meeting start?", "When should I submit it?"],
        Which: ["Which option would you recommend?", "Which part should we review first?"],
        How: ["How should we proceed?", "How long will it take?"],
        Why: ["Why did the schedule change?", "Why would that option work better?"]
      }[wh];
      profile = {
        formula: `${wh} + 조동사·be동사 + 주어 + 나머지?`,
        examples: [base, ...examples],
        variants: ["Could you tell me more about that?", "I'd like to understand one detail.", "Can you walk me through it?"],
        chunk: wh
      };
    } else profile = {
      formula: "오늘 문장 뼈대 + 같은 의미의 말투 조절",
      examples: [base, `To be clear, ${base.charAt(0).toLowerCase()}${base.slice(1)}`, `What I mean is this: ${base.charAt(0).toLowerCase()}${base.slice(1)}`],
      variants: [base, `Actually, ${base.charAt(0).toLowerCase()}${base.slice(1)}`, `To put it simply, ${base.charAt(0).toLowerCase()}${base.slice(1)}`],
      chunk: targetTokens(base, language)[0] || base
    };
  } else if (language === "ja") {
    if (/いただけますか|もらえますか|くださいませんか/.test(base)) profile = {
      formula: "동사 て형 + いただけますか／もらえますか",
      examples: [base, "もう一度説明していただけますか。", "日程を確認してもらえますか。"],
      variants: ["もう一度説明してもらえますか。", "もう一度お願いできますか。", "恐れ入りますが、もう一度ご説明いただけますか。"],
      chunk: base.match(/[^、。！？?]*(いただけますか|もらえますか|くださいませんか)/)?.[0] || "〜ていただけますか"
    };
    else if (/お願いします/.test(base)) profile = {
      formula: "원하는 대상 + を + お願いします",
      examples: [base, "メニューをお願いします。", "領収書をお願いします。"],
      variants: ["メニューをいただけますか。", "メニューを見せてもらえますか。", "すみません、メニューをお願いします。"],
      chunk: "お願いします"
    };
    else if (/たいです/.test(base)) profile = {
      formula: "동사 어간 + たいです",
      examples: [base, "予約を変更したいです。", "詳細を確認したいです。"],
      variants: ["予約の変更をお願いします。", "予約を変更できますか。", "予約を変更したいのですが。"],
      chunk: "〜たいです"
    };
    else if (/か[。？]?$/.test(base)) profile = {
      formula: "질문 내용 + ですか／ますか",
      examples: [base, "何時に始まりますか。", "どの方法がおすすめですか。"],
      variants: ["教えていただけますか。", "念のため確認してもいいですか。", "ちなみに、これはどうですか。"],
      chunk: base.match(/[^、。！？?]+か[。？]?$/)?.[0] || "〜ですか"
    };
    else profile = {
      formula: "오늘 문장 뼈대 + 같은 의미의 말투 조절",
      examples: [base, `実は、${base}`, `つまり、${base}`],
      variants: [base, `少し補足すると、${base}`, `念のためお伝えすると、${base}`],
      chunk: targetTokens(base, language)[0] || base
    };
  } else {
    if (/可以|能不能|能[^，。！？?]*吗/.test(base)) profile = {
      formula: "可以／能 + 동작·요청 + 吗？",
      examples: [base, "可以确认一下时间吗？", "能再说一遍吗？"],
      variants: ["方便确认一下时间吗？", "能不能再确认一下？", "麻烦帮我确认一下时间。"],
      chunk: base.includes("可以") ? "可以……吗" : "能……吗"
    };
    else if (/请/.test(base)) profile = {
      formula: "请 + 동작·요청 내용",
      examples: [base, "请再说一遍。", "请确认一下预约信息。"],
      variants: ["麻烦再说一遍。", "可以再说一遍吗？", "方便的话，请再说明一下。"],
      chunk: "请 + 동작"
    };
    else if (/想/.test(base)) profile = {
      formula: "주어 + 想 + 동작·대상",
      examples: [base, "我想改一下预约。", "我想确认一下细节。"],
      variants: ["我想要改一下预约。", "可以帮我改一下预约吗？", "我打算先确认一下细节。"],
      chunk: "想 + 동작"
    };
    else if (/还是/.test(base)) profile = {
      formula: "A + 还是 + B？",
      examples: [base, "我们今天见还是明天见？", "坐地铁还是打车更方便？"],
      variants: ["你觉得哪个更合适？", "两个方案里你更推荐哪个？", "要不我们比较一下这两个方案？"],
      chunk: "A 还是 B"
    };
    else if (/吗[？。]?$/.test(base)) profile = {
      formula: "평서문 어순 + 吗？",
      examples: [base, "今天方便吗？", "这个价格包括服务费吗？"],
      variants: ["今天方便不方便？", "我确认一下，今天方便，对吗？", "请问今天方便吗？"],
      chunk: "……吗"
    };
    else profile = {
      formula: "오늘 문장 뼈대 + 같은 의미의 말투 조절",
      examples: [base, `其实，${base}`, `我的意思是，${base}`],
      variants: [base, `我再补充一点：${base}`, `简单来说，${base}`],
      chunk: targetTokens(base, language)[0] || base
    };
  }

  const actualChunks = targetTokens(base, language);
  const chunkItems = [
    { text: profile.chunk, note: "오늘 공식의 중심이 되는 회화 덩어리" },
    { text: actualChunks[1] || actualChunks[0] || base, note: "오늘 문장에서 대상·조건을 담는 실제 덩어리" }
  ].filter((item, index, all) => item.text && all.findIndex((candidate) => candidate.text === item.text) === index);
  return {
    formula: `${profile.formula}${["", " + 구체적인 대상", " + 조건·이유", " + 완곡한 태도", " + 원어민식 청크"][levelIndex]}`,
    examples: profile.examples.map((sentence) => ({ sentence, highlight: sentence === base ? (actualChunks[1] || "") : "" })),
    nativeVariants: profile.variants,
    chunks: chunkItems,
    levelTip: levelTips[levelIndex]
  };
}

function buildConversationFormula(base, language, situation, mode, levelIndex) {
  return buildVerifiedConversationFormula(base, language, situation, mode, levelIndex);
  /* 이전의 범용 예시 생성기는 참고용으로 남기되 실행하지 않습니다. */
  const override = conversationFormulaOverrides[language]?.[base];
  const levelTips = [
    "핵심 슬롯 하나를 바꾸며 짧은 문장을 반복합니다.",
    "대상·시간·장소를 바꾸어 같은 공식을 확장합니다.",
    "구체적인 상황과 이유를 넣어 문장을 연결합니다.",
    "명사절과 완곡한 표현으로 뉘앙스를 조절합니다.",
    "원어민식 청크와 생략을 활용해 자연스러운 리듬을 만듭니다."
  ];
  if (override) {
    return {
      formula: override.formulas[levelIndex],
      examples: override.examples[levelIndex],
      nativeVariants: override.nativeVariants,
      chunks: override.chunks,
      levelTip: levelTips[levelIndex]
    };
  }

  const modeExamples = {
    en: {
      social: ["How about you?", "What do you do for work?", "Would you like to join us?"],
      service: ["Could I see the menu?", "Could you check the reservation?", "Is there another option?"],
      professional: ["Could we confirm the deadline?", "Could you share the file?", "Let's review the next step."],
      resolution: ["Could we sort this out?", "Could you check the charge?", "What can we do about it?"],
      business: ["Could we review the proposal?", "Can we confirm the timeline?", "Let's align on the next step."]
    },
    ja: {
      social: ["あなたはどうですか。", "週末は何をしますか。", "今度一緒に行きませんか。"],
      service: ["メニューを見せていただけますか。", "予約を確認していただけますか。", "別の方法はありますか。"],
      professional: ["締め切りを確認できますか。", "資料を共有していただけますか。", "次の対応を確認しましょう。"],
      resolution: ["一緒に解決方法を考えられますか。", "金額を確認していただけますか。", "ほかにどんな方法がありますか。"],
      business: ["提案を確認できますか。", "日程を合意できますか。", "次の行動を整理しましょう。"]
    },
    zh: {
      social: ["你呢？", "你周末做什么？", "下次一起去吗？"],
      service: ["可以给我看一下菜单吗？", "可以确认一下预约吗？", "还有别的办法吗？"],
      professional: ["我们可以确认截止日期吗？", "可以把文件发给我吗？", "我们确认一下下一步吧。"],
      resolution: ["我们可以一起解决吗？", "可以确认一下金额吗？", "还有什么解决办法？"],
      business: ["我们可以审核一下方案吗？", "可以确认时间表吗？", "我们确定一下下一步吧。"]
    }
  }[language][mode];

  let formula;
  if (language === "en") {
    if (/^Could I /i.test(base)) formula = "Could I + 동사원형 + 요청 내용?";
    else if (/^Could you /i.test(base)) formula = "Could you + 동사원형 + 요청 내용?";
    else if (/^I'd like to /i.test(base)) formula = "I'd like to + 동사원형 + 원하는 행동";
    else if (/^(What|Where|When|Which|How|Why) /i.test(base)) formula = "의문사 + 조동사/be동사 + 주어 + 나머지?";
    else if (/^(Do|Does|Can|Is|Are) /i.test(base)) formula = "조동사/be동사 + 주어 + 핵심 내용?";
    else if (/^Let's /i.test(base)) formula = "Let's + 동사원형 + 함께 할 행동";
    else formula = "핵심 표현 + 대상·시간·조건";
  } else if (language === "ja") {
    if (/いただけますか|もらえますか/.test(base)) formula = "요청 내용 + ていただけますか/てもらえますか";
    else if (/お願いします/.test(base)) formula = "원하는 대상 + を + お願いします";
    else if (/たいです/.test(base)) formula = "주어 + 대상·장소 + 동사たいです";
    else if (/か[。？]?$/.test(base)) formula = "질문 내용 + ですか/ますか";
    else formula = "상황·대상 + 조사 + 핵심 서술";
  } else {
    if (/可以|能不能|能.*吗/.test(base)) formula = "可以/能 + 동작·요청 + 吗？";
    else if (/请/.test(base)) formula = "请 + 동작·요청 내용";
    else if (/想/.test(base)) formula = "주어 + 想 + 동작·대상";
    else if (/吗[？。]?$/.test(base)) formula = "주어 + 동사·상태 + 吗？";
    else formula = "주어 + 시간·대상 + 동사·상태";
  }
  const formulaExtensions = ["", " + 대상·시간 바꾸기", " + 조건·이유 덧붙이기", " + 명사절·완곡한 태도", " + 원어민식 청크·생략"];
  formula += formulaExtensions[levelIndex];

  const nativeByMode = {
    en: {
      social: ["How about you?", "Sounds good.", "I'm up for that."],
      service: ["Could I get ...?", "Is there any chance ...?", "Can you help me out with ...?"],
      professional: ["Can we quickly go over ...?", "Let's sync on ...", "Just to confirm, ..."],
      resolution: ["Could we sort this out?", "Here's what happened.", "What can we do about it?"],
      business: ["Let's align on ...", "Could we revisit ...?", "Just to make sure we're on the same page, ..."]
    },
    ja: {
      social: ["そうなんですね。", "ちなみに、どうですか。", "いいですね。"],
      service: ["〜をお願いできますか。", "〜ってできますか。", "ほかにありますか。"],
      professional: ["念のため確認ですが、〜", "一度すり合わせましょう。", "次はどうしますか。"],
      resolution: ["何とかできますか。", "状況を説明しますね。", "別の方法はありますか。"],
      business: ["認識を合わせましょう。", "条件を見直せますか。", "次の対応を確認しましょう。"]
    },
    zh: {
      social: ["是吗？", "对了，你呢？", "听起来不错。"],
      service: ["可以帮我……吗？", "能不能……？", "还有别的吗？"],
      professional: ["我确认一下，……", "我们快速对一下。", "下一步怎么做？"],
      resolution: ["这件事能处理吗？", "情况是这样的。", "还有别的办法吗？"],
      business: ["我们统一一下理解。", "可以重新谈这个条件吗？", "我们确认一下下一步。"]
    }
  }[language][mode];
  const chunkByMode = {
    en: { social: "How about you?", service: "Could I get ...?", professional: "Just to confirm", resolution: "sort this out", business: "align on" },
    ja: { social: "ちなみに", service: "お願いできますか", professional: "念のため確認", resolution: "何とかできますか", business: "認識を合わせる" },
    zh: { social: "对了", service: "可以帮我……吗", professional: "我确认一下", resolution: "处理一下", business: "统一一下理解" }
  }[language][mode];
  return {
    formula,
    examples: modeExamples.map((sentence) => ({ sentence, highlight: "" })),
    nativeVariants: nativeByMode,
    chunks: [
      { text: chunkByMode, note: "해당 상황에서 원어민이 자주 묶어서 쓰는 표현" },
      { text: targetTokens(base, language)[0] || base, note: "오늘 문장의 핵심 시작 청크" }
    ],
    levelTip: levelTips[levelIndex]
  };
}

function buildVerifiedPronunciationFlow(base, language, mode, levelIndex) {
  if (language === "en" && base === "Could I ask a question about today's lesson?") {
    const levelFlows = [
      [
        { label: "이해하지 못한 부분 말하기", text: "I didn't quite understand the part about the assignment.", note: "과제에 관한 부분을 잘 이해하지 못했어요." },
        { label: "다시 설명 요청하기", text: "Could you explain the assignment again?", note: "과제를 다시 설명해 주실 수 있나요?" },
        { label: "의미 확인하기", text: "What did you mean by the final section?", note: "마지막 부분은 무슨 뜻이었나요?" }
      ],
      [
        { label: "놓친 부분 말하기", text: "I didn't quite catch the part about the grading criteria.", note: "평가 기준에 관한 부분을 정확히 듣지 못했어요." },
        { label: "한 번 더 요청하기", text: "Could you go over the requirements one more time?", note: "요구 사항을 한 번 더 설명해 주실 수 있나요?" },
        { label: "이해 확인하기", text: "So, does that mean we submit it on Friday?", note: "그러면 금요일에 제출한다는 뜻인가요?" }
      ],
      [
        { label: "이해 정도 밝히기", text: "I'm not sure I followed the point about the final assignment.", note: "최종 과제에 관한 요점을 제대로 이해했는지 모르겠어요." },
        { label: "과정 설명 요청하기", text: "Could you walk me through the requirements again?", note: "요구 사항을 처음부터 다시 설명해 주실 수 있나요?" },
        { label: "연결 관계 묻기", text: "How does the assignment relate to today's topic?", note: "과제는 오늘의 주제와 어떻게 연결되나요?" }
      ],
      [
        { label: "정확한 의미 확인하기", text: "Could you clarify what you meant by the assessment criteria?", note: "평가 기준이라는 말의 의미를 명확히 해주시겠어요?" },
        { label: "상세 설명 요청하기", text: "Would you mind elaborating on the second requirement?", note: "두 번째 요구 사항을 좀 더 상세히 설명해 주시겠어요?" },
        { label: "해석 검증하기", text: "Am I right in understanding that examples are required?", note: "예시가 필수라고 이해한 것이 맞나요?" }
      ],
      [
        { label: "뉘앙스 확인하기", text: "Just so I'm following, are you suggesting that we compare two approaches?", note: "제가 제대로 이해했다면 두 접근법을 비교하라는 말씀이신가요?" },
        { label: "차이 풀어 묻기", text: "Could you unpack the distinction between analysis and evaluation?", note: "분석과 평가의 차이를 자세히 풀어주시겠어요?" },
        { label: "적용 범위 확장하기", text: "How would that apply to our group project?", note: "그 내용이 조별 과제에는 어떻게 적용될까요?" }
      ]
    ];
    return { turns: levelFlows[levelIndex] };
  }

  const normalizedMode = mode === "business" ? "professional" : mode;
  const defaults = {
    en: {
      social: ["Let me add one detail.", "How about you?", "It was great talking with you."],
      service: ["The main detail is that I need it today.", "What options are available?", "Could you confirm the final arrangement?"],
      professional: ["Let me clarify the main point.", "What should our next step be?", "Let's confirm the owner and deadline."],
      resolution: ["Let me explain how this affected me.", "What options do we have?", "Could you confirm when this will be resolved?"],
      business: ["Let me support that point with one example.", "What would you suggest as the next action?", "Let's confirm the decision, owner, and deadline."]
    },
    ja: {
      social: ["もう一つだけ補足します。", "あなたはどうですか。", "お話しできてよかったです。"],
      service: ["今日中に必要だという点が大切です。", "どんな選択肢がありますか。", "最後の内容を確認していただけますか。"],
      professional: ["要点を一つ補足します。", "次はどう進めますか。", "担当と期限を確認しましょう。"],
      resolution: ["この問題で予定に影響が出ています。", "どんな対応が可能ですか。", "いつ解決できるか確認していただけますか。"],
      business: ["その点を具体例で補足します。", "次の行動をどう提案しますか。", "決定・担当・期限を確認しましょう。"]
    },
    zh: {
      social: ["我再补充一个细节。", "你呢？", "很高兴和你聊天。"],
      service: ["最重要的是我今天就需要。", "有哪些选择？", "可以确认一下最后的安排吗？"],
      professional: ["我再说明一个重点。", "下一步怎么做？", "我们确认一下负责人和截止日期吧。"],
      resolution: ["这个问题已经影响了我的安排。", "有哪些处理办法？", "可以确认什么时候能解决吗？"],
      business: ["我用一个例子来支持这个观点。", "你建议下一步怎么做？", "我们确认一下决定、负责人和截止日期吧。"]
    }
  }[language][mode];
  const closers = {
    en: ["Could you say that again?", "Just to confirm, is that right?", "Could you clarify how that works here?", "Would it be fair to say that this is our final decision?", "Let me make sure I've grasped the nuance correctly."],
    ja: ["もう一度お願いします。", "念のため、これで合っていますか。", "ここではどのように使うのか教えていただけますか。", "これが最終決定という理解でよろしいでしょうか。", "ニュアンスまで含めて、私の理解が正しいか確認させてください。"],
    zh: ["请再说一遍。", "我确认一下，这样理解对吗？", "可以具体说明一下这里怎么用吗？", "也就是说，这是最后的决定，对吗？", "我确认一下，我对其中的细微差别理解得对不对。"]
  }[language];
  const levelLine = levelExtensions[language][normalizedMode][levelIndex] || defaults[0];
  const stageLine = dayStageExtensions[language][normalizedMode][Math.max(1, levelIndex)] || defaults[1];
  const candidates = [levelLine, stageLine, levelIndex === 0 ? defaults[2] : closers[levelIndex]];
  const unique = candidates.filter((text, index, all) => text && all.indexOf(text) === index);
  while (unique.length < 3) unique.push(defaults[unique.length]);
  return {
    turns: unique.slice(0, 3).map((text, index) => ({
      label: ["상황을 한 단계 확장하기", "상대의 반응을 받아 이어가기", "확인하거나 자연스럽게 마무리하기"][index],
      text,
      note: ["오늘 문장 뒤에 배경·조건을 덧붙입니다.", "세부 정보나 상대의 생각을 확인합니다.", "이해·다음 행동을 확인하며 흐름을 닫습니다."][index]
    }))
  };
}

function buildPronunciationFlow(base, target, language, mode, translationRow, situations, baseIndex, levelIndex) {
  return buildVerifiedPronunciationFlow(base, language, mode, levelIndex);
  /* 이전의 인접 Day 연결 방식은 서로 다른 상황을 섞을 수 있어 실행하지 않습니다. */
  if (language === "en" && base === "Could I ask a question about today's lesson?") {
    const levelFlows = [
      [
        { label: "이해하지 못한 부분 말하기", text: "I didn't quite understand the part about ~.", note: "~ 부분을 잘 이해하지 못했어요." },
        { label: "다시 설명 요청하기", text: "Could you explain ~ again?", note: "~을 다시 설명해 주실 수 있나요?" },
        { label: "의미 확인하기", text: "What did you mean by ~?", note: "~은 무슨 뜻이었나요?" }
      ],
      [
        { label: "놓친 부분 말하기", text: "I didn't quite catch the part about ~.", note: "~에 관한 부분을 정확히 듣지 못했어요." },
        { label: "한 번 더 요청하기", text: "Could you go over ~ one more time?", note: "~을 한 번 더 설명해 주실 수 있나요?" },
        { label: "이해 확인하기", text: "So, does that mean ~?", note: "그러면 ~이라는 뜻인가요?" }
      ],
      [
        { label: "이해 정도 밝히기", text: "I'm not sure I followed the point about ~.", note: "~에 관한 요점을 제대로 이해했는지 모르겠어요." },
        { label: "과정 설명 요청하기", text: "Could you walk me through ~ again?", note: "~을 처음부터 다시 설명해 주실 수 있나요?" },
        { label: "연결 관계 묻기", text: "How does ~ relate to today's topic?", note: "~은 오늘의 주제와 어떻게 연결되나요?" }
      ],
      [
        { label: "정확한 의미 확인하기", text: "Could you clarify what you meant by ~?", note: "~으로 말씀하신 의미를 명확히 해주시겠어요?" },
        { label: "상세 설명 요청하기", text: "Would you mind elaborating on ~?", note: "~을 좀 더 상세히 설명해 주시겠어요?" },
        { label: "해석 검증하기", text: "Am I right in understanding that ~?", note: "제가 ~이라고 이해한 것이 맞나요?" }
      ],
      [
        { label: "뉘앙스 확인하기", text: "Just so I'm following, are you suggesting that ~?", note: "제가 제대로 이해했는지 확인하면, ~이라는 말씀이신가요?" },
        { label: "차이 풀어 묻기", text: "Could you unpack the distinction between ~ and ~?", note: "~와 ~의 차이를 자세히 풀어주시겠어요?" },
        { label: "적용 범위 확장하기", text: "How would that apply if ~?", note: "만약 ~라면 그것이 어떻게 적용될까요?" }
      ]
    ];
    return { turns: levelFlows[levelIndex] };
  }

  const nextItems = [];
  for (let offset = 1; offset < translationRow.length && nextItems.length < 2; offset += 1) {
    const index = (baseIndex + offset) % translationRow.length;
    const text = translationRow[index];
    if (text !== base && text !== target && !nextItems.some((item) => item.text === text)) {
      nextItems.push({
        label: nextItems.length ? "대화 한 단계 더 이어가기" : "바로 다음 말 이어가기",
        text,
        note: `${situations[index]}에 자연스럽게 이어 쓰는 표현`
      });
    }
  }

  const levelConfirmers = {
    en: ["Could you say that again?", "Just to confirm, is that right?", "Could you clarify how that works here?", "Would it be fair to say that ~?", "Let me make sure I've grasped the nuance: ~."],
    ja: ["もう一度お願いします。", "念のため、これで合っていますか。", "ここではどのように使うのか、詳しく教えていただけますか。", "つまり、〜という理解でよろしいでしょうか。", "ニュアンスまで含めると、〜ということですね。"],
    zh: ["请再说一遍。", "我确认一下，这样理解对吗？", "可以具体说明一下这里怎么用吗？", "也就是说，可以理解为……，对吗？", "我确认一下其中的细微差别：……。"]
  };
  const confirmerNotes = [
    "짧게 다시 말해 달라고 요청합니다.",
    "들은 내용을 한 번 더 확인합니다.",
    "표현이 실제 상황에서 작동하는 방식을 묻습니다.",
    "자신의 해석을 정중하게 검증합니다.",
    "미묘한 의미 차이까지 원어민답게 확인합니다."
  ];
  nextItems.push({
    label: "이해 확인하며 마무리하기",
    text: levelConfirmers[language][levelIndex],
    note: confirmerNotes[levelIndex]
  });
  return { turns: nextItems.slice(0, 3) };
}

function linkedDialogueFallbacks(language, target) {
  const sentence = String(target || "").trim();
  if (!sentence) return [];
  const lower = sentence.charAt(0).toLowerCase() + sentence.slice(1);
  const stem = sentence.replace(/[。！？!?]+$/u, "");
  if (language === "en") return [
    sentence,
    `${/[?]$/.test(sentence) ? "Let me ask it this way: " : "To be clear, "}${lower}`,
    `${sentence} ${/[?]$/.test(sentence) ? "I'd appreciate your answer." : "That's what I mean."}`
  ];
  if (language === "ja") return [sentence, `実は、${sentence}`, `${stem}ということです。`];
  return [sentence, `其实，${sentence}`, `我的意思是，${sentence}`];
}

function createDialogueSuggestionPicker(language, target = "") {
  const fallbacks = {
    en: ["Could you tell me a little more?", "Let me make sure I understand.", "What would you recommend?", "That sounds good to me.", "Could we confirm the details?", "Thank you for explaining."],
    ja: ["もう少し詳しく教えていただけますか。", "念のため確認させてください。", "どの方法がおすすめですか。", "その方法でお願いします。", "内容を確認してもよろしいですか。", "説明していただきありがとうございます。"],
    zh: ["可以再详细说一下吗？", "我确认一下我的理解。", "你建议怎么做？", "这个办法可以。", "我们可以确认一下细节吗？", "谢谢你的说明。"]
  }[language];
  const used = new Set();
  return (candidates) => {
    const result = [];
    for (const candidate of [...candidates, ...linkedDialogueFallbacks(language, target), ...fallbacks]) {
      const text = String(candidate || "").trim();
      const key = normalizeSpeech(text);
      if (!text || !key || used.has(key)) continue;
      used.add(key);
      result.push(text);
      if (result.length === 3) break;
    }
    return result;
  };
}

function buildGuidedDialogue(language, mode, target, situation, levelIndex, stageIndex) {
  const firstMeeting = {
    en: {
      matches: () => normalizeSpeech(target) === normalizeSpeech("Nice to meet you.") || /처음 만나/.test(situation),
      role: "처음 만난 현지인",
      goal: "첫인사 뒤 이름·참석 이유·하는 일을 묻고 자연스럽게 마무리하기",
      opening: "Hi, I'm Alex. I don't think we've met before.",
      openingKo: "안녕하세요, 저는 Alex예요. 우리 처음 만나는 것 같네요.",
      turns: [
        { intent: "이름을 밝히며 첫인사하기", suggestions: ["Hi, I'm Min. Nice to meet you.", "Nice to meet you, too. I'm Min.", "I don't think we have. I'm Min—nice to meet you."], reply: "Nice to meet you too, Min. What brings you here?", replyKo: "저도 반가워요, 민. 여기는 무슨 일로 오셨어요?" },
        { intent: "참석 이유를 말하고 되묻기", suggestions: ["I'm here for the workshop. How about you?", "A friend invited me. What brings you here?", "I just joined the program, so I'm meeting everyone."], reply: "I'm here for the workshop too. What kind of work do you do?", replyKo: "저도 워크숍 때문에 왔어요. 어떤 일을 하세요?" },
        { intent: "하는 일을 말하며 대화 마무리하기", suggestions: ["I work in design. What about you?", "I'm a graduate student in psychology. How about you?", "I work in product design. It was great meeting you."], reply: "I work in research. It was great meeting you too.", replyKo: "저는 연구 일을 해요. 저도 만나서 반가웠어요." }
      ]
    },
    ja: {
      matches: () => normalizeSpeech(target) === normalizeSpeech("はじめまして。") || /처음 만나/.test(situation),
      role: "처음 만난 일본인",
      goal: "첫인사 뒤 이름·참석 이유·하는 일을 자연스럽게 주고받기",
      opening: "こんにちは。私はあきです。お会いするのは初めてですよね。",
      openingKo: "안녕하세요. 저는 아키예요. 우리 처음 만나는 거죠?",
      turns: [
        { intent: "이름을 밝히며 첫인사하기", suggestions: ["はじめまして。ミンです。", "はじめまして。ミンと申します。", "そうですね。ミンです。よろしくお願いします。"], reply: "はじめまして、ミンさん。今日はどうしてこちらへ？", replyKo: "반가워요, 민 씨. 오늘은 어떻게 오셨어요?" },
        { intent: "참석 이유를 말하고 되묻기", suggestions: ["ワークショップに参加しに来ました。あきさんは？", "友人に誘われて来ました。", "このプログラムに入ったばかりなんです。"], reply: "私もワークショップです。お仕事は何をされていますか。", replyKo: "저도 워크숍 때문에 왔어요. 무슨 일을 하세요?" },
        { intent: "하는 일을 말하며 마무리하기", suggestions: ["デザインの仕事をしています。", "心理学を専攻している大学院生です。", "プロダクトデザインの仕事をしています。お会いできてよかったです。"], reply: "私は研究の仕事をしています。お会いできてよかったです。", replyKo: "저는 연구 일을 해요. 만나서 반가웠어요." }
      ]
    },
    zh: {
      matches: () => normalizeSpeech(target) === normalizeSpeech("很高兴认识你。") || /처음 만나/.test(situation),
      role: "처음 만난 중국인",
      goal: "첫인사 뒤 이름·참석 이유·하는 일을 자연스럽게 주고받기",
      opening: "你好，我叫李明。我们以前没见过吧？",
      openingKo: "안녕하세요, 저는 리밍이에요. 우리 전에 만난 적 없죠?",
      turns: [
        { intent: "이름을 밝히며 첫인사하기", suggestions: ["你好，我叫敏。很高兴认识你。", "很高兴认识你，我叫敏。", "应该没有。我叫敏，请多关照。"], reply: "我也很高兴认识你。你今天为什么来这儿？", replyKo: "저도 만나서 반가워요. 오늘은 왜 여기 오셨어요?" },
        { intent: "참석 이유를 말하고 되묻기", suggestions: ["我是来参加工作坊的。你呢？", "朋友邀请我来的。你为什么来这儿？", "我刚加入这个项目，想认识一下大家。"], reply: "我也是来参加工作坊的。你做什么工作？", replyKo: "저도 워크숍 때문에 왔어요. 무슨 일을 하세요?" },
        { intent: "하는 일을 말하며 마무리하기", suggestions: ["我是做设计的。你呢？", "我是心理学研究生。", "我做产品设计。很高兴认识你。"], reply: "我是做研究的。认识你很高兴。", replyKo: "저는 연구 일을 해요. 만나서 반가웠어요." }
      ]
    }
  }[language];
  if (mode === "social" && firstMeeting?.matches()) return firstMeeting;
  const scripts = {
    en: {
      social: {
        role: "현지인 대화 상대", opening: "Hi! It's good to see you. What's on your mind today?", openingKo: "안녕하세요! 반가워요. 오늘은 어떤 이야기를 나누고 싶나요?",
        startAlt: "I'd like to tell you a little about it.", reply1: "I see. What happened next, or how did you feel about it?", reply1Ko: "그렇군요. 그다음에는 무슨 일이 있었거나 어떤 기분이 들었나요?",
        details: ["The part I remember most is how everyone reacted.", "It happened recently, so I'm still thinking about it."], reply2: "Thanks for sharing that. Would you like to ask me something or make a plan?", reply2Ko: "이야기해 줘서 고마워요. 저에게 질문하거나 다음 계획을 정해볼까요?",
        actions: ["How about you?", "Would you like to continue this conversation over coffee?"], final: "Sounds good. It was nice talking with you.", finalKo: "좋아요. 대화해서 즐거웠어요."
      },
      service: {
        role: "서비스 담당 직원", opening: "Hello. How can I help you today?", openingKo: "안녕하세요. 오늘은 무엇을 도와드릴까요?",
        startAlt: "I'd like some help with this, please.", reply1: "Of course. What detail or condition should I know first?", reply1Ko: "물론입니다. 먼저 알아야 할 세부 조건이 있나요?",
        details: ["The main detail is that I need it today.", "If possible, I'd prefer the simplest available option."], reply2: "Thank you. I can work with that. What would you like me to confirm before we proceed?", reply2Ko: "감사합니다. 그 조건으로 도와드릴 수 있어요. 진행 전에 무엇을 확인해 드릴까요?",
        actions: ["Could you confirm the final price and timing?", "If that isn't possible, what would you recommend?"], final: "Certainly. I've confirmed the arrangement and the next step.", finalKo: "알겠습니다. 최종 조건과 다음 단계를 확인했습니다."
      },
      professional: {
        role: "학교·직장 동료", opening: "All right. Which point should we discuss first?", openingKo: "좋습니다. 어느 부분부터 논의할까요?",
        startAlt: "I'd like to clarify one point before we continue.", reply1: "Understood. Which detail or priority matters most here?", reply1Ko: "알겠습니다. 여기서 가장 중요한 세부 사항이나 우선순위는 무엇인가요?",
        details: ["The main priority is to keep the schedule on track.", "We also need a clear decision before the next meeting."], reply2: "That's clear. What should we decide or assign next?", reply2Ko: "명확하네요. 다음으로 무엇을 결정하거나 담당자를 정할까요?",
        actions: ["Let's confirm the owner and deadline.", "Could you summarize the next step?"], final: "Agreed. We have a clear next step, owner, and deadline.", finalKo: "좋습니다. 다음 단계와 담당자, 기한이 명확해졌습니다."
      },
      resolution: {
        role: "문제 해결 담당자", opening: "I'm sorry there's a problem. Could you tell me what happened?", openingKo: "문제가 생겨 죄송합니다. 무슨 일이 있었는지 말씀해 주시겠어요?",
        startAlt: "I'd like to explain what happened and find a solution.", reply1: "I understand. How has this affected you, and what outcome would help?", reply1Ko: "이해했습니다. 어떤 영향이 있었고 어떤 해결을 원하시나요?",
        details: ["The problem has affected my plans today.", "I have the receipt and the confirmation number with me."], reply2: "Thank you. What solution would you like me to check first?", reply2Ko: "감사합니다. 어떤 해결 방법부터 확인해 드릴까요?",
        actions: ["Could you tell me what options are available?", "Could you confirm when this will be resolved?"], final: "That request is clear. I'll confirm the solution and timing now.", finalKo: "요청이 명확합니다. 지금 해결 방법과 시점을 확인하겠습니다."
      },
      business: {
        role: "해외 업무 파트너", opening: "Thanks for joining. Which point should we focus on first?", openingKo: "참석해 주셔서 감사합니다. 어느 부분부터 집중할까요?",
        startAlt: "I'd like to confirm the main point before we decide.", reply1: "I understand your point. What evidence, condition, or risk should we consider?", reply1Ko: "의견을 이해했습니다. 어떤 근거·조건·위험을 고려해야 하나요?",
        details: ["The data supports the proposal, but the timeline is still a risk.", "Our priority is to protect quality without delaying the launch."], reply2: "That's useful. What action do you recommend, and who should own it?", reply2Ko: "도움이 됩니다. 어떤 행동을 제안하며 누가 담당하면 좋을까요?",
        actions: ["Let's confirm the decision, owner, and deadline.", "I'll send a summary of the agreed next steps."], final: "Agreed. The decision, owner, and deadline are now clear.", finalKo: "좋습니다. 결정 사항과 담당자, 기한이 명확해졌습니다."
      }
    },
    ja: {
      social: {
        role: "현지인 대화 상대", opening: "こんにちは。今日はどんな話をしたいですか。", openingKo: "안녕하세요. 오늘은 어떤 이야기를 하고 싶나요?",
        startAlt: "そのことについて少し話したいです。", reply1: "そうなんですね。その後どうなりましたか。どんな気持ちでしたか。", reply1Ko: "그렇군요. 그 뒤에는 어떻게 되었고 어떤 기분이었나요?",
        details: ["一番印象に残っているのは、みんなの反応です。", "最近のことなので、まだよく覚えています。"], reply2: "話してくれてありがとうございます。何か聞きたいことや、次の予定はありますか。", reply2Ko: "이야기해 줘서 고마워요. 묻고 싶은 것이나 다음 계획이 있나요?",
        actions: ["あなたはどうですか。", "今度、コーヒーを飲みながら続きを話しませんか。"], final: "いいですね。お話しできてよかったです。", finalKo: "좋네요. 이야기해서 즐거웠어요."
      },
      service: {
        role: "서비스 담당 직원", opening: "いらっしゃいませ。今日はどうされましたか。", openingKo: "어서 오세요. 오늘은 무엇을 도와드릴까요?",
        startAlt: "こちらについて相談したいです。", reply1: "承知しました。最初に確認すべき条件や詳細はありますか。", reply1Ko: "알겠습니다. 먼저 확인해야 할 조건이나 세부 사항이 있나요?",
        details: ["大事なのは、今日中に必要だという点です。", "できれば、一番簡単な方法を希望します。"], reply2: "ありがとうございます。その条件で確認します。最後に何を確認しましょうか。", reply2Ko: "감사합니다. 그 조건으로 확인하겠습니다. 마지막으로 무엇을 확인할까요?",
        actions: ["最終的な金額と時間を確認していただけますか。", "それが難しい場合、どの方法がおすすめですか。"], final: "承知しました。内容と次の対応を確認しました。", finalKo: "알겠습니다. 내용과 다음 조치를 확인했습니다."
      },
      professional: {
        role: "학교·직장 동료", opening: "では、どの点から相談しましょうか。", openingKo: "그럼 어느 부분부터 상의할까요?",
        startAlt: "進める前に、一点確認したいです。", reply1: "分かりました。ここで一番重要な詳細や優先事項は何ですか。", reply1Ko: "알겠습니다. 여기서 가장 중요한 세부 사항이나 우선순위는 무엇인가요?",
        details: ["最優先は、予定どおりに進めることです。", "次の会議までに明確な決定が必要です。"], reply2: "よく分かりました。次に何を決めて、誰が担当しますか。", reply2Ko: "잘 알겠습니다. 다음으로 무엇을 결정하고 누가 담당할까요?",
        actions: ["担当者と期限を確認しましょう。", "次の対応をまとめていただけますか。"], final: "合意できました。次の対応・担当・期限が明確です。", finalKo: "합의했습니다. 다음 조치와 담당자, 기한이 명확합니다."
      },
      resolution: {
        role: "문제 해결 담당자", opening: "ご不便をおかけして申し訳ありません。何があったか教えてください。", openingKo: "불편을 드려 죄송합니다. 무슨 일이 있었는지 말씀해 주세요.",
        startAlt: "状況を説明して、解決方法を相談したいです。", reply1: "状況は分かりました。どんな影響があり、どのような解決をご希望ですか。", reply1Ko: "상황을 이해했습니다. 어떤 영향이 있었고 어떤 해결을 원하시나요?",
        details: ["この問題で今日の予定に影響が出ています。", "領収書と確認番号を持っています。"], reply2: "ありがとうございます。まずどの対応を確認しましょうか。", reply2Ko: "감사합니다. 먼저 어떤 조치를 확인할까요?",
        actions: ["どんな対応が可能か教えていただけますか。", "いつ解決できるか確認していただけますか。"], final: "ご希望は明確です。解決方法と時期を確認します。", finalKo: "요청이 명확합니다. 해결 방법과 시점을 확인하겠습니다."
      },
      business: {
        role: "해외 업무 파트너", opening: "本日はありがとうございます。まずどの点を確認しましょうか。", openingKo: "오늘 참석해 주셔서 감사합니다. 먼저 어느 부분을 확인할까요?",
        startAlt: "決定する前に、要点を確認したいです。", reply1: "ご意見は分かりました。どんな根拠・条件・リスクを考えるべきですか。", reply1Ko: "의견을 이해했습니다. 어떤 근거·조건·위험을 고려해야 하나요?",
        details: ["データは提案を支持していますが、日程にはまだリスクがあります。", "品質を守りながら、開始を遅らせないことが優先です。"], reply2: "参考になります。次の行動と担当者をどう提案しますか。", reply2Ko: "도움이 됩니다. 다음 행동과 담당자를 어떻게 제안하시겠어요?",
        actions: ["決定・担当者・期限を確認しましょう。", "合意した次の対応をまとめて送ります。"], final: "合意できました。決定・担当・期限が明確です。", finalKo: "합의했습니다. 결정 사항과 담당자, 기한이 명확합니다."
      }
    },
    zh: {
      social: {
        role: "현지인 대화 상대", opening: "你好！今天想聊点什么？", openingKo: "안녕하세요! 오늘은 어떤 이야기를 나누고 싶나요?",
        startAlt: "我想和你聊聊这件事。", reply1: "原来如此。后来发生了什么？你当时是什么感觉？", reply1Ko: "그렇군요. 그 뒤에는 무슨 일이 있었고 당시 어떤 기분이었나요?",
        details: ["我印象最深的是大家的反应。", "这是最近发生的，所以我还记得很清楚。"], reply2: "谢谢你和我分享。你想问我什么，还是想约下次见面？", reply2Ko: "이야기해 줘서 고마워요. 저에게 묻거나 다음 만남을 정해볼까요?",
        actions: ["你呢？", "下次我们边喝咖啡边继续聊吧。"], final: "好啊，和你聊天很开心。", finalKo: "좋아요. 대화해서 즐거웠어요."
      },
      service: {
        role: "서비스 담당 직원", opening: "您好，今天需要什么帮助？", openingKo: "안녕하세요. 오늘은 무엇을 도와드릴까요?",
        startAlt: "我想请你帮我处理一下。", reply1: "好的。最需要先确认的条件或细节是什么？", reply1Ko: "알겠습니다. 먼저 확인해야 할 조건이나 세부 사항은 무엇인가요?",
        details: ["最重要的是我今天就需要。", "如果可以，我想选择最简单的办法。"], reply2: "谢谢，我会按这个条件处理。最后还要确认什么？", reply2Ko: "감사합니다. 이 조건으로 처리하겠습니다. 마지막으로 무엇을 확인할까요?",
        actions: ["可以确认一下最后的价格和时间吗？", "如果这个办法不行，你推荐哪一种？"], final: "好的，安排和下一步都确认好了。", finalKo: "알겠습니다. 조건과 다음 단계를 모두 확인했습니다."
      },
      professional: {
        role: "학교·직장 동료", opening: "好的，我们先讨论哪一点？", openingKo: "좋습니다. 어느 부분부터 논의할까요?",
        startAlt: "继续之前，我想先确认一点。", reply1: "明白。这里最重要的细节或优先事项是什么？", reply1Ko: "알겠습니다. 여기서 가장 중요한 세부 사항이나 우선순위는 무엇인가요?",
        details: ["最重要的是按计划推进。", "我们需要在下次会议前做出明确决定。"], reply2: "很清楚。下一步要决定什么，由谁负责？", reply2Ko: "명확합니다. 다음으로 무엇을 결정하고 누가 담당할까요?",
        actions: ["我们确认一下负责人和截止日期吧。", "可以总结一下下一步吗？"], final: "好，我们已经确认了下一步、负责人和截止日期。", finalKo: "좋습니다. 다음 단계와 담당자, 기한을 확인했습니다."
      },
      resolution: {
        role: "문제 해결 담당자", opening: "很抱歉给你带来不便。可以说一下发生了什么吗？", openingKo: "불편을 드려 죄송합니다. 무슨 일이 있었는지 말씀해 주시겠어요?",
        startAlt: "我想说明一下情况，再商量解决办法。", reply1: "我了解了。这对你有什么影响？你希望怎么解决？", reply1Ko: "이해했습니다. 어떤 영향이 있었고 어떻게 해결되기를 원하시나요?",
        details: ["这个问题已经影响了我今天的安排。", "我带了收据和确认号码。"], reply2: "谢谢。你希望我先确认哪一种解决办法？", reply2Ko: "감사합니다. 어떤 해결 방법부터 확인해 드릴까요?",
        actions: ["可以告诉我有哪些处理办法吗？", "可以确认什么时候能解决吗？"], final: "你的要求很清楚，我现在确认解决办法和时间。", finalKo: "요청이 명확합니다. 지금 해결 방법과 시점을 확인하겠습니다."
      },
      business: {
        role: "해외 업무 파트너", opening: "感谢参加会议。我们先讨论哪一点？", openingKo: "회의에 참석해 주셔서 감사합니다. 먼저 어느 부분을 논의할까요?",
        startAlt: "做决定之前，我想先确认重点。", reply1: "我明白你的观点。我们需要考虑哪些证据、条件或风险？", reply1Ko: "의견을 이해했습니다. 어떤 근거·조건·위험을 고려해야 하나요?",
        details: ["数据支持这个方案，不过时间表仍然有风险。", "我们的重点是保证质量，同时不推迟上线。"], reply2: "这个信息很有帮助。你建议下一步做什么，由谁负责？", reply2Ko: "도움이 됩니다. 다음으로 무엇을 하고 누가 담당하면 좋을까요?",
        actions: ["我们确认一下决定、负责人和截止日期吧。", "我会把商定的下一步整理后发给大家。"], final: "好，决定、负责人和截止日期都明确了。", finalKo: "좋습니다. 결정 사항과 담당자, 기한이 모두 명확해졌습니다."
      }
    }
  };
  const script = scripts[language][mode];
  const pickSuggestions = createDialogueSuggestionPicker(language, target);
  const normalizedMode = mode === "business" ? "professional" : mode;
  const stageLine = dayStageExtensions[language][normalizedMode][stageIndex];
  const levelLine = levelExtensions[language][normalizedMode][levelIndex];
  return {
    role: script.role,
    goal: `${situation} 상황에서 핵심 표현, 세부 설명, 다음 행동을 한 흐름으로 연습하기`,
    opening: script.opening,
    openingKo: script.openingKo,
    turns: [
      { intent: "상황에 맞는 핵심 표현으로 시작하기", suggestions: pickSuggestions([target, script.startAlt]), reply: script.reply1, replyKo: script.reply1Ko },
      { intent: "배경·조건·영향을 한 가지 구체화하기", suggestions: pickSuggestions([levelLine, stageLine, ...script.details]), reply: script.reply2, replyKo: script.reply2Ko },
      { intent: "질문·해결책·다음 행동을 확인하며 마무리하기", suggestions: pickSuggestions(script.actions), reply: script.final, replyKo: script.finalKo }
    ]
  };
}

function makeDialogueTurns(language, mode, base, target, translationRow, baseIndex, point, pronunciationFlow, conversationFormula, situation, levelIndex, stageIndex = 0) {
  return buildGuidedDialogue(language, mode, target, situation, levelIndex, stageIndex);
  /* 이전의 인접 Day 조합 대화는 서로 다른 상황을 섞을 수 있어 실행하지 않습니다. */
  const pickSuggestions = createDialogueSuggestionPicker(language);
  if (language === "en" && base === "Could I ask a question about today's lesson?") {
    const levelSuggestions = [
      [
        [target, "I have a question about today's lesson."],
        ["I didn't quite understand the part about the assignment.", "Could you explain the assignment instructions again?"],
        ["What exactly do we need to include in the report?", "When is the assignment due?"]
      ],
      [
        [target, "Could I ask about the homework for today's lesson?"],
        ["I didn't quite catch the part about the grading criteria.", "Could you go over the project requirements one more time?"],
        ["Should we work alone or in groups?", "When do we need to submit it?"]
      ],
      [
        [target, "I'd like to clarify one point from today's lesson."],
        ["I'm not sure I followed the explanation of the final assignment.", "Could you walk me through the requirements again?"],
        ["How detailed does the report need to be?", "Does the presentation count toward our grade?"]
      ],
      [
        [target, "Could I clarify something regarding today's discussion?"],
        ["Could you elaborate on how the framework applies to our assignment?", "I'm not entirely clear on the distinction you made earlier."],
        ["Am I right in understanding that we need to justify our methodology?", "Would you mind clarifying the assessment criteria?"]
      ],
      [
        [target, "I'd like to probe one implication of today's argument."],
        ["Could you unpack the distinction between the theoretical and practical claims?", "Just so I'm following, are you suggesting the framework has broader applicability?"],
        ["How would that interpretation hold under a different set of assumptions?", "Would it be fair to say the evidence remains inconclusive?"]
      ]
    ][levelIndex];
    return {
      role: "수업 담당 선생님",
      goal: "질문을 꺼내고, 이해하지 못한 부분과 과제 조건까지 확인하기",
      opening: "Before we finish, do you have any questions about today's lesson?",
      openingKo: "마치기 전에, 오늘 수업에 관해 질문이 있나요?",
      turns: [
        { intent: "정중하게 질문 시작하기", suggestions: pickSuggestions(levelSuggestions[0]), reply: "Of course. Which part of today's lesson was unclear?", replyKo: "물론이죠. 오늘 수업의 어느 부분이 명확하지 않았나요?" },
        { intent: "이해하지 못한 부분 구체화하기", suggestions: pickSuggestions(levelSuggestions[1]), reply: "Sure. The assignment is a short report based on one topic from class. What would you like to confirm?", replyKo: "네. 과제는 수업에서 다룬 주제 하나를 바탕으로 짧은 보고서를 쓰는 것입니다. 무엇을 확인하고 싶나요?" },
        { intent: "과제 조건을 확인하고 마무리하기", suggestions: pickSuggestions(levelSuggestions[2]), reply: "Choose one topic, support your main point with two examples, and submit it by Friday. Let me know if you need anything else.", replyKo: "주제 하나를 고르고 핵심 주장에 예시 두 개를 덧붙여 금요일까지 제출하세요. 더 궁금한 점이 있으면 알려주세요." }
      ]
    };
  }
  if (language === "en" && /I just joined this class/i.test(base)) {
    return {
      role: "같은 수업을 듣는 동급생",
      goal: "첫인사를 건네고 전공과 수업 경험까지 자연스럽게 묻기",
      opening: "Hi, welcome to the class. Are you new here?",
      openingKo: "안녕하세요, 반가워요. 이 수업은 처음인가요?",
      turns: [
        { intent: "이름을 밝히고 새로 왔다고 말하기", suggestions: pickSuggestions([target, "Hi, I'm Min. I'm new to this class."]), reply: "Nice to meet you, Min. What are you studying?", replyKo: "반가워요, 민. 무엇을 공부하고 있나요?" },
        { intent: "전공이나 관심 분야 말하기", suggestions: pickSuggestions(["I'm studying design.", "I'm majoring in psychology."]), reply: "That sounds interesting. Is this your first class in the program?", replyKo: "흥미롭네요. 이 과정의 첫 수업인가요?" },
        { intent: "수업 경험을 답하고 대화 이어가기", suggestions: pickSuggestions(["Yes, it is. I'm still finding my way around.", "No, I took one class last term."]), reply: "Great. If you need the notes, feel free to ask.", replyKo: "좋아요. 필기가 필요하면 편하게 물어보세요." }
      ]
    };
  }
  const flow = adaptiveDialogueFlows[language][mode];
  const next = translationRow[(baseIndex + 1) % translationRow.length];
  const later = translationRow[(baseIndex + 2) % translationRow.length];
  const followUps = pronunciationFlow?.turns?.map((turn) => turn.text) || [];
  const roleLabels = { social: "현지인 대화 상대", service: "서비스 담당 직원", professional: "학교·직장 동료", resolution: "문제 해결 담당자", business: "해외 업무 파트너" };
  return {
    role: roleLabels[mode],
    goal: `${situation} 상황에서 핵심 표현으로 시작해 세부 사항과 다음 행동까지 이어가기`,
    opening: flow.opening,
    openingKo: flow.openingKo,
    turns: [
      { intent: "오늘의 핵심 표현으로 대화 시작하기", suggestions: pickSuggestions([target, base, point.alternative, followUps[0]]), reply: flow.replies[0][0], replyKo: flow.replies[0][1] },
      { intent: "상황에 필요한 세부 사항 덧붙이기", suggestions: pickSuggestions([followUps[0], next, followUps[1], conversationFormula?.nativeVariants?.[0]]), reply: flow.replies[1][0], replyKo: flow.replies[1][1] },
      { intent: "해결책이나 다음 행동 확인하기", suggestions: pickSuggestions([followUps[1], later, followUps[2], languageMeta[language].retry]), reply: flow.replies[2][0], replyKo: flow.replies[2][1] }
    ]
  };
}

function stableDayId(language, category, categoryIndex, topic, topicIndex, dayIndex, levelIndex) {
  if (category.id === "business") return `${language}-business-${topicIndex + 1}-${dayIndex + 1}-level-${levelIndex + 1}`;
  if (topic.vocabulary) return `${language}-${category.id}-vocabulary-${dayIndex + 1}-level-${levelIndex + 1}`;
  const legacyTopicIndex = categoryIndex * 5 + topicIndex;
  return `${language}-${category.id}-${legacyTopicIndex + 1}-${dayIndex + 1}-level-${levelIndex + 1}`;
}

function buildLegacyCurriculum(language, levelIndex) {
  const profile = levelProfiles[language][levelIndex];
  let standardTopicOffset = 0;
  return curriculumBlueprint.map((category, categoryIndex) => {
    const builtTopics = [];
    category.topics.filter((topic) => !topic.vocabulary).forEach((topic, topicIndex) => {
      const translationRow = topic.businessKey
        ? businessIntentTranslations[language][topic.businessKey]
        : topic.businessUseful
          ? businessUsefulTranslations[language]
          : topic.useful
            ? usefulTranslations[language][categoryIndex]
            : intentTranslations[language][standardTopicOffset++];
      const extensionMode = topic.mode === "business" ? "professional" : topic.mode;
      const days = Array.from({ length: 50 }, (_, dayIndex) => {
        const baseIndex = dayIndex % 10;
        const stageIndex = Math.floor(dayIndex / 10);
        const situation = topic.situations[baseIndex];
        const base = translationRow[baseIndex];
        const stageTarget = buildStageTarget(base, language, extensionMode, stageIndex);
        const target = stageTarget.text;
        const tokens = targetTokens(target, language);
        const decoyCount = Math.max(0, tokens.length - 2);
        const decoys = sentenceDecoys[language].filter((item) => !target.includes(item)).slice((dayIndex + levelIndex) % 5, (dayIndex + levelIndex) % 5 + decoyCount);
        while (decoys.length < decoyCount) decoys.push(sentenceDecoys[language][(dayIndex + decoys.length) % sentenceDecoys[language].length]);
        const pool = seededShuffle([...tokens, ...decoys], dayIndex + levelIndex * 53 + topicIndex * 11);
        const point = deriveLearningPoint(base, language, situation, topic.mode, dayIndex + levelIndex);
        const expansion = translationRow[(baseIndex + 1) % 10];
        const quiz = buildQuiz(point, situation, base, expansion, dayIndex + levelIndex * 17 + topicIndex);
        const conversationFormula = buildConversationFormula(base, language, situation, topic.mode, levelIndex);
        const pronunciationFlow = buildPronunciationFlow(base, target, language, topic.mode, translationRow, topic.situations, baseIndex, levelIndex);
        const dialogue = makeDialogueTurns(language, topic.mode, base, target, translationRow, baseIndex, point, pronunciationFlow, conversationFormula, situation, levelIndex, stageIndex);
        const coach = buildDayCoach(language, extensionMode, situation, profile, levelIndex, stageIndex, point);
        return {
          id: stableDayId(language, category, categoryIndex, topic, topicIndex, dayIndex, levelIndex),
          mode: topic.mode,
          title: situation,
          focus: coach.canDo,
          stageIndex,
          stageLabel: dayStageLabels[stageIndex],
          coach,
          word: point.focus,
          reading: levelIndex < 2 ? `${profile.goal} · 듣고 따라 하기` : `${profile.goal} · 문맥으로 이해하기`,
          meaning: point.meaning,
          studySentence: base,
          sentenceMeaning: point.sentenceMeaning,
          phrase: target,
          translation: [point.sentenceMeaning, stageTarget.extensionMeaning].filter(Boolean).join(" "),
          tokens,
          decoys,
          pool,
          quiz,
          conversationFormula,
          pronunciationFlow,
          sentenceExplanation: `${languageMeta[language].label}의 기본 어순을 유지하면서 ‘${point.focus}’를 의미 덩어리로 배치합니다. ${stageTarget.extension ? `이후 ${dayStageLabels[stageIndex]} 문장을 이어 실제 대화 길이로 확장합니다.` : "먼저 핵심 문장을 정확하게 자동화합니다."}`,
          expansionPhrase: expansion,
          opening: dialogue.opening,
          openingKo: dialogue.openingKo,
          dialogueRole: dialogue.role,
          dialogueGoal: dialogue.goal,
          dialogueTurns: dialogue.turns
        };
      });
      builtTopics.push({
        id: `${category.id}-${topicIndex + 1}`,
        icon: String(topicIndex + 1),
        tab: topic.title,
        place: `${category.title} · ${topic.title}`,
        title: topic.title,
        description: `${profile.name} · ${profile.goal} · 50 Days`,
        days
      });
    });

    const vocabularyTopic = category.topics.find((topic) => topic.vocabulary);
    if (vocabularyTopic) {
      const sourceDays = builtTopics.flatMap((topic) => topic.days);
      const vocabularyPool = sourceDays.flatMap((day) => {
        const studyTokens = targetTokens(day.studySentence, language);
        const chunks = [...studyTokens.slice(0, 3), day.studySentence];
        while (chunks.length < 4) chunks.push(`${studyTokens[0]} ${studyTokens.at(-1)}`);
        return chunks.slice(0, 4).map((term, index) => ({
          term,
          meaning: index === chunks.length - 1 ? day.sentenceMeaning : `${day.title}에서 쓰는 핵심 어휘·청크`,
          example: day.studySentence,
          exampleKo: day.sentenceMeaning,
          reading: day.reading,
          mode: day.mode,
          situation: day.title
        }));
      });
      const topicIndex = category.topics.indexOf(vocabularyTopic);
      const days = Array.from({ length: 50 }, (_, dayIndex) => {
        const stageIndex = Math.floor(dayIndex / 10);
        const vocabulary = Array.from({ length: 20 }, (_, index) => vocabularyPool[(dayIndex * 20 + index) % vocabularyPool.length]);
        const lead = vocabulary[0];
        const tokens = targetTokens(lead.example, language);
        const decoyCount = Math.max(0, tokens.length - 2);
        const decoys = sentenceDecoys[language].slice(dayIndex % 5, dayIndex % 5 + decoyCount);
        const point = deriveLearningPoint(lead.example, language, lead.situation, lead.mode, dayIndex + 401);
        const quiz = buildQuiz(point, vocabularyTopic.situations[dayIndex % 10], lead.example, vocabulary[1].example, dayIndex + 401);
        const conversationFormula = buildConversationFormula(lead.example, language, lead.situation, lead.mode, levelIndex);
        const pronunciationFlow = buildVerifiedPronunciationFlow(lead.example, language, lead.mode, levelIndex);
        const sourceDialogue = buildGuidedDialogue(language, lead.mode, lead.example, lead.situation, levelIndex, stageIndex);
        const coachMode = lead.mode === "business" ? "professional" : lead.mode;
        const coach = buildDayCoach(language, coachMode, lead.situation, profile, levelIndex, stageIndex, point);
        coach.canDo = `${vocabularyTopic.situations[dayIndex % 10]}에서 핵심 단어·콜로케이션 20개를 문장으로 사용하기`;
        coach.transfer = `20개 표현 중 세 개를 골라 ${lead.situation} 상황의 짧은 대화를 만들어보세요.`;
        return {
          id: stableDayId(language, category, categoryIndex, vocabularyTopic, topicIndex, dayIndex, levelIndex),
          mode: lead.mode,
          title: `${vocabularyTopic.situations[dayIndex % 10]} · 20개`,
          focus: coach.canDo,
          stageIndex,
          stageLabel: dayStageLabels[stageIndex],
          coach,
          word: lead.term,
          reading: lead.reading,
          meaning: lead.meaning,
          studySentence: lead.example,
          sentenceMeaning: lead.exampleKo,
          phrase: lead.example,
          translation: lead.exampleKo,
          tokens,
          decoys,
          pool: seededShuffle([...tokens, ...decoys], dayIndex + 701),
          quiz,
          vocabulary,
          sentenceExplanation: `20개 어휘 중 ‘${lead.term}’가 포함된 예문을 자연스러운 어순으로 재구성합니다.`,
          expansionPhrase: vocabulary[1].example,
          opening: sourceDialogue.opening,
          openingKo: sourceDialogue.openingKo,
          dialogueRole: sourceDialogue.dialogueRole,
          dialogueGoal: sourceDialogue.dialogueGoal,
          dialogueTurns: sourceDialogue.turns,
          conversationFormula,
          pronunciationFlow
        };
      });
      builtTopics.push({ id: `${category.id}-${topicIndex + 1}`, icon: String(topicIndex + 1), tab: vocabularyTopic.title, place: `${category.title} · ${vocabularyTopic.title}`, title: vocabularyTopic.title, description: `${profile.name} · Day당 20개 · 50 Days`, days });
    }
    return { ...category, topics: builtTopics };
  });
}

const authoredLesson = (text, translation, tokens, label, reading = "", romanization = "") => ({ phrase: text, translation, tokens, pool: [...tokens.slice(1), tokens[0]], label, reading, romanization });

const curatedFirstMeetingUnits = {
  en: [
    {
      title: "첫 인사와 이름 말하기",
      canDo: "처음 만난 사람에게 인사하고 이름·출신을 말한 뒤 짧게 되물을 수 있다.",
      lessons: [
        authoredLesson("Hi, I'm Min.", "안녕하세요, 저는 민이에요.", ["Hi", "I'm Min"], "이름 말하기"),
        authoredLesson("Nice to meet you.", "만나서 반가워요.", ["Nice to", "meet you"], "첫인사 주고받기"),
        authoredLesson("Where are you from?", "어디에서 오셨어요?", ["Where are", "you from"], "출신 묻기"),
        authoredLesson("I'm from Korea.", "저는 한국에서 왔어요.", ["I'm from", "Korea"], "출신 답하기"),
        authoredLesson("What do you do?", "무슨 일을 하세요?", ["What do", "you do"], "하는 일 묻기"),
        authoredLesson("Hi, I'm Min. Nice to meet you. I'm from Korea. How about you?", "안녕하세요, 저는 민이에요. 만나서 반가워요. 저는 한국에서 왔어요. 당신은요?", ["Hi I'm Min", "Nice to meet you", "I'm from Korea", "How about you"], "4턴 첫 만남 미션")
      ]
    },
    {
      title: "일상적인 자기소개",
      canDo: "새로운 모임에서 이름·현재 상황·하는 일을 1~2문장으로 말하고 상대에게 질문할 수 있다.",
      lessons: [
        authoredLesson("Hi, I'm Min. I'm new here.", "안녕하세요, 저는 민이에요. 여기는 처음이에요.", ["Hi I'm Min", "I'm new", "here"], "새로 왔다고 말하기"),
        authoredLesson("Nice to meet you. What brings you here?", "만나서 반가워요. 여기에는 무슨 일로 오셨어요?", ["Nice to meet you", "What brings you", "here"], "참석 이유 묻기"),
        authoredLesson("I'm studying psychology.", "저는 심리학을 공부하고 있어요.", ["I'm studying", "psychology"], "전공 말하기"),
        authoredLesson("I started last month.", "저는 지난달에 시작했어요.", ["I started", "last month"], "시작 시점 말하기"),
        authoredLesson("How about you?", "당신은요?", ["How about", "you"], "상대에게 되묻기"),
        authoredLesson("Hi, I'm Min. I'm new here. What brings you here?", "안녕하세요, 저는 민이에요. 여기는 처음이에요. 여기에는 무슨 일로 오셨어요?", ["Hi I'm Min", "I'm new here", "What brings you here"], "자기소개 대화 미션")
      ]
    },
    {
      title: "행사에서 관계 시작하기",
      canDo: "행사에서 자신의 배경과 참석 목적을 3~5문장으로 설명하고 공통 관심사를 찾을 수 있다.",
      lessons: [
        authoredLesson("Hi, I'm Min. It's my first time at this event.", "안녕하세요, 저는 민이에요. 이 행사에는 처음 왔어요.", ["Hi I'm Min", "It's my first time", "at this event"], "행사에서 첫인사하기"),
        authoredLesson("What brought you here today?", "오늘은 어떤 계기로 오셨어요?", ["What brought you", "here today"], "참석 계기 묻기"),
        authoredLesson("I'm here to learn more about cognitive science.", "인지과학을 더 알아보려고 왔어요.", ["I'm here to", "learn more about", "cognitive science"], "참석 목적 설명하기"),
        authoredLesson("I've been working on a study about decision-making.", "저는 의사결정에 관한 연구를 진행하고 있어요.", ["I've been working on", "a study about", "decision-making"], "최근 활동 설명하기"),
        authoredLesson("That sounds interesting. How did you get into it?", "흥미롭네요. 어떻게 그 일을 시작하게 됐어요?", ["That sounds interesting", "How did you", "get into it"], "관심을 보이며 이어 묻기"),
        authoredLesson("It's my first time here, so I'm hoping to meet people in the same field.", "처음 참석해서 같은 분야의 사람들을 만나고 싶어요.", ["It's my first time here", "so I'm hoping to", "meet people in the same field"], "배경과 목적 연결 미션")
      ]
    },
    {
      title: "격식 있는 첫 대화",
      canDo: "상대와의 거리와 격식을 판단해 자신의 연구를 소개하고 정중한 후속 질문을 할 수 있다.",
      lessons: [
        authoredLesson("I don't think we've met. I'm Min.", "아직 인사를 나누지 못한 것 같네요. 저는 민입니다.", ["I don't think", "we've met", "I'm Min"], "부담 없이 말 걸기"),
        authoredLesson("I've heard a lot about your work.", "선생님의 연구에 관해 많이 들었습니다.", ["I've heard a lot", "about your work"], "상대의 연구 언급하기"),
        authoredLesson("I'm currently looking into how people make decisions.", "저는 현재 사람들이 의사결정을 내리는 방식을 연구하고 있습니다.", ["I'm currently looking into", "how people", "make decisions"], "연구 주제 설명하기"),
        authoredLesson("What drew you to this field?", "어떤 계기로 이 분야를 선택하셨나요?", ["What drew you", "to this field"], "전문적인 관심 질문하기"),
        authoredLesson("It was great finally meeting you in person.", "직접 만나 뵙게 되어 반가웠습니다.", ["It was great", "finally meeting you", "in person"], "격식 있게 마무리하기"),
        authoredLesson("I don't think we've met. I'm Min, and I'm currently researching decision-making.", "아직 인사를 못 나눈 것 같네요. 저는 민이고 현재 의사결정을 연구하고 있습니다.", ["I don't think we've met", "I'm Min", "I'm currently researching decision-making"], "격식 있는 소개 미션")
      ]
    },
    {
      title: "전문적인 첫 대화 주도",
      canDo: "전문 맥락과 상대의 배경을 고려해 함축적이고 자연스럽게 대화를 열고 다음 교류를 제안할 수 있다.",
      lessons: [
        authoredLesson("Great to finally put a face to the name.", "드디어 직접 뵙게 되어 반갑습니다.", ["Great to finally", "put a face", "to the name"], "관용적인 첫인사"),
        authoredLesson("I've been following your work on human decision-making.", "인간 의사결정에 관한 선생님의 연구를 계속 관심 있게 보고 있었습니다.", ["I've been following", "your work on", "human decision-making"], "상대의 전문성 연결하기"),
        authoredLesson("My current research sits at the intersection of psychology and AI.", "제 연구는 심리학과 AI가 만나는 지점에 있습니다.", ["My current research", "sits at the intersection of", "psychology and AI"], "연구 정체성 압축하기"),
        authoredLesson("I'd be curious to hear your take on our approach.", "저희 접근법에 대한 견해를 듣고 싶습니다.", ["I'd be curious to hear", "your take on", "our approach"], "견해를 정중히 요청하기"),
        authoredLesson("Perhaps we could continue this conversation after the session.", "괜찮으시다면 세션 뒤에 이 대화를 이어가면 좋겠습니다.", ["Perhaps we could", "continue this conversation", "after the session"], "다음 교류 제안하기"),
        authoredLesson("Great to finally meet you. Our work overlaps, so I'd value your take on our approach.", "드디어 만나 뵙게 되어 반갑습니다. 연구가 맞닿아 있어 저희 접근법에 대한 견해를 듣고 싶습니다.", ["Great to finally meet you", "Our work overlaps", "I'd value your take on our approach"], "전문 네트워킹 미션")
      ]
    }
  ],
  ja: [
    {
      title: "첫 인사와 자기소개",
      canDo: "히라가나와 로마자를 보며 첫인사·이름·출신을 짧게 말할 수 있다.",
      lessons: [
        authoredLesson("こんにちは。", "안녕하세요.", ["こんにちは"], "기본 인사", "こんにちは", "konnichiwa"),
        authoredLesson("はじめまして。", "처음 뵙겠습니다.", ["はじめまして"], "첫 만남 인사", "はじめまして", "hajimemashite"),
        authoredLesson("わたしは ミンです。", "저는 민입니다.", ["わたしは", "ミンです"], "이름 말하기", "わたしは ミンです", "watashi wa Min desu"),
        authoredLesson("かんこくから きました。", "한국에서 왔습니다.", ["かんこくから", "きました"], "출신 말하기", "かんこくから きました", "Kankoku kara kimashita"),
        authoredLesson("よろしく おねがいします。", "잘 부탁드립니다.", ["よろしく", "おねがいします"], "인사 마무리", "よろしく おねがいします", "yoroshiku onegai shimasu"),
        authoredLesson("こんにちは。はじめまして。わたしは ミンです。かんこくから きました。よろしく おねがいします。", "안녕하세요. 처음 뵙겠습니다. 저는 민이고 한국에서 왔습니다. 잘 부탁드립니다.", ["こんにちは", "はじめまして", "わたしは ミンです", "かんこくから きました", "よろしく おねがいします"], "자기소개 종합 미션", "こんにちは。はじめまして。わたしは ミンです。かんこくから きました。よろしく おねがいします", "konnichiwa / hajimemashite / watashi wa Min desu / Kankoku kara kimashita / yoroshiku onegai shimasu")
      ]
    },
    {
      title: "정중한 일상 자기소개",
      canDo: "정중체로 이름·소속·전공을 말하고 상대의 출신과 경험을 질문할 수 있다.",
      lessons: [
        authoredLesson("はじめまして。ミンといいます。", "처음 뵙겠습니다. 민이라고 합니다.", ["はじめまして", "ミンといいます"], "이름 정중히 말하기", "はじめまして。ミンと いいます", "hajimemashite / Min to iimasu"),
        authoredLesson("先月からこの学校で勉強しています。", "지난달부터 이 학교에서 공부하고 있습니다.", ["先月から", "この学校で", "勉強しています"], "현재 상황 말하기", "せんげつから このがっこうで べんきょうしています", "sengetsu kara / kono gakkō de / benkyō shiteimasu"),
        authoredLesson("心理学を専攻しています。", "심리학을 전공하고 있습니다.", ["心理学を", "専攻しています"], "전공 말하기", "しんりがくを せんこうしています", "shinrigaku o / senkō shiteimasu"),
        authoredLesson("ご出身はどちらですか。", "출신은 어디신가요?", ["ご出身は", "どちらですか"], "출신 묻기", "ごしゅっしんは どちらですか", "goshusshin wa / dochira desu ka"),
        authoredLesson("日本にはいつ来ましたか。", "일본에는 언제 오셨어요?", ["日本には", "いつ", "来ましたか"], "경험 시점 묻기", "にほんには いつ きましたか", "Nihon ni wa / itsu / kimashita ka"),
        authoredLesson("はじめまして。ミンといいます。心理学を専攻しています。ご出身はどちらですか。", "처음 뵙겠습니다. 민이라고 합니다. 심리학을 전공하고 있습니다. 출신은 어디신가요?", ["はじめまして", "ミンといいます", "心理学を専攻しています", "ご出身はどちらですか"], "정중한 소개 미션", "はじめまして。ミンと いいます。しんりがくを せんこうしています。ごしゅっしんは どちらですか", "hajimemashite / Min to iimasu / shinrigaku o senkō shiteimasu / goshusshin wa dochira desu ka")
      ]
    },
    {
      title: "연구회에서 관계 시작",
      canDo: "참석 계기와 연구 관심사를 자연스럽게 설명하고 상대의 배경을 물을 수 있다.",
      lessons: [
        authoredLesson("初めまして。今回の研究会には初めて参加します。", "처음 뵙겠습니다. 이번 연구회에는 처음 참가합니다.", ["初めまして", "今回の研究会には", "初めて参加します"], "연구회에서 첫인사"),
        authoredLesson("認知心理学を研究しています。", "인지심리학을 연구하고 있습니다.", ["認知心理学を", "研究しています"], "연구 분야 말하기"),
        authoredLesson("こちらにはどのようなきっかけで来られたんですか。", "여기에는 어떤 계기로 오셨어요?", ["こちらには", "どのようなきっかけで", "来られたんですか"], "참석 계기 묻기"),
        authoredLesson("最近は意思決定について調べています。", "최근에는 의사결정에 관해 조사하고 있습니다.", ["最近は", "意思決定について", "調べています"], "최근 관심사 설명"),
        authoredLesson("それは興味深いですね。もう少し詳しく聞いてもいいですか。", "흥미롭네요. 조금 더 자세히 여쭤봐도 될까요?", ["それは興味深いですね", "もう少し詳しく", "聞いてもいいですか"], "관심을 보이며 이어 묻기"),
        authoredLesson("初参加なので、同じ分野の方とお話しできればと思っています。", "첫 참가라 같은 분야의 분들과 이야기할 수 있으면 좋겠습니다.", ["初参加なので", "同じ分野の方と", "お話しできればと思っています"], "배경과 목적 연결 미션")
      ]
    },
    {
      title: "관계에 맞춘 격식 있는 소개",
      canDo: "상대와의 거리감을 판단해 겸양 표현으로 자신을 소개하고 정중한 질문을 할 수 있다.",
      lessons: [
        authoredLesson("まだご挨拶していませんでしたね。ミンと申します。", "아직 인사를 못 드렸네요. 민이라고 합니다.", ["まだご挨拶していませんでしたね", "ミンと申します"], "겸양 표현으로 소개"),
        authoredLesson("先生の研究について以前から伺っていました。", "선생님의 연구에 대해 이전부터 들어 알고 있었습니다.", ["先生の研究について", "以前から", "伺っていました"], "상대의 연구 언급"),
        authoredLesson("現在は意思決定の過程を研究しております。", "현재는 의사결정 과정을 연구하고 있습니다.", ["現在は", "意思決定の過程を", "研究しております"], "연구를 격식 있게 설명"),
        authoredLesson("このテーマに関心を持たれたきっかけは何でしょうか。", "이 주제에 관심을 갖게 된 계기는 무엇인가요?", ["このテーマに", "関心を持たれたきっかけは", "何でしょうか"], "계기를 정중히 묻기"),
        authoredLesson("直接お目にかかれて光栄です。", "직접 뵙게 되어 영광입니다.", ["直接", "お目にかかれて", "光栄です"], "격식 있게 마무리"),
        authoredLesson("ミンと申します。現在は意思決定の過程を研究しております。", "민이라고 합니다. 현재 의사결정 과정을 연구하고 있습니다.", ["ミンと申します", "現在は", "意思決定の過程を研究しております"], "격식 있는 소개 미션")
      ]
    },
    {
      title: "전문적인 첫 대화 주도",
      canDo: "전문적 배경과 거리감을 섬세하게 조절하며 연구 접점을 만들고 다음 교류를 제안할 수 있다.",
      lessons: [
        authoredLesson("お名前は以前から存じ上げておりました。", "성함은 이전부터 알고 있었습니다.", ["お名前は", "以前から", "存じ上げておりました"], "고급 겸양 인사"),
        authoredLesson("先生の研究はかねてより拝見しております。", "선생님의 연구는 전부터 계속 보아 왔습니다.", ["先生の研究は", "かねてより", "拝見しております"], "전문적 관심 밝히기"),
        authoredLesson("私の研究は心理学とAIの接点に位置しています。", "제 연구는 심리학과 AI의 접점에 있습니다.", ["私の研究は", "心理学とAIの接点に", "位置しています"], "연구 정체성 압축"),
        authoredLesson("差し支えなければ、先生のご見解を伺えれば幸いです。", "괜찮으시다면 선생님의 견해를 들을 수 있으면 좋겠습니다.", ["差し支えなければ", "先生のご見解を", "伺えれば幸いです"], "견해를 완곡하게 요청"),
        authoredLesson("後ほど改めてお話を伺う機会をいただけますか。", "나중에 다시 이야기를 들을 기회를 주실 수 있을까요?", ["後ほど改めて", "お話を伺う機会を", "いただけますか"], "다음 교류 제안"),
        authoredLesson("先生の研究を拝見しております。私の研究とも接点があり、ご見解を伺えれば幸いです。", "선생님의 연구를 보고 있습니다. 제 연구와도 접점이 있어 견해를 들을 수 있으면 좋겠습니다.", ["先生の研究を拝見しております", "私の研究とも接点があり", "ご見解を伺えれば幸いです"], "전문 네트워킹 미션")
      ]
    }
  ],
  zh: [
    {
      title: "성조로 시작하는 첫 만남",
      canDo: "병음과 성조를 보며 인사·이름·출신을 말하고 상대에게 되물을 수 있다.",
      lessons: [
        authoredLesson("你好。", "안녕하세요.", ["你好"], "인사와 3성 연결", "你(3) 好(3)", "Nǐ hǎo"),
        authoredLesson("我叫敏。", "저는 민이라고 해요.", ["我叫", "敏"], "이름 말하기", "我(3) 叫(4) 敏(3)", "Wǒ jiào Mǐn"),
        authoredLesson("我是韩国人。", "저는 한국인이에요.", ["我是", "韩国人"], "출신 말하기", "我(3) 是(4) 韩(2)国(2)人(2)", "Wǒ shì Hánguórén"),
        authoredLesson("很高兴认识你。", "만나서 반가워요.", ["很高兴", "认识你"], "의미 덩어리 연결", "很(3)高(1)兴(4) / 认(4)识(shi·경성)你(3)", "Hěn gāoxìng / rènshi nǐ"),
        authoredLesson("你呢？", "당신은요?", ["你", "呢"], "상대에게 되묻기", "你(3) 呢(경성)", "Nǐ ne"),
        authoredLesson("你好，我叫敏。我是韩国人。很高兴认识你。你呢？", "안녕하세요, 저는 민이에요. 저는 한국인입니다. 만나서 반가워요. 당신은요?", ["你好", "我叫敏", "我是韩国人", "很高兴认识你", "你呢"], "첫 만남 종합 미션", "你(3)好(3) / 我(3)叫(4)敏(3) / 我(3)是(4)韩(2)国(2)人(2) / 很(3)高(1)兴(4)认(4)识你(3) / 你(3)呢", "Nǐ hǎo / Wǒ jiào Mǐn / Wǒ shì Hánguórén / Hěn gāoxìng rènshi nǐ / Nǐ ne")
      ]
    },
    {
      title: "일상적인 자기소개",
      canDo: "기본 어순과 성조를 유지하며 이름·전공·시점을 말하고 상대의 출신을 물을 수 있다.",
      lessons: [
        authoredLesson("你好，我叫敏，刚来这里。", "안녕하세요, 저는 민이고 여기 막 왔어요.", ["你好我叫敏", "刚来这里"], "새로 왔다고 말하기", "你(3)好(3)，我(3)叫(4)敏(3)，刚(1)来(2)这(4)里(3)", "Nǐ hǎo / wǒ jiào Mǐn / gāng lái zhèlǐ"),
        authoredLesson("我学心理学。", "저는 심리학을 공부해요.", ["我学", "心理学"], "전공 말하기", "我(3)学(2) 心(1)理(3)学(2)", "Wǒ xué xīnlǐxué"),
        authoredLesson("我上个月开始上课。", "저는 지난달에 수업을 시작했어요.", ["我上个月", "开始上课"], "시점 말하기", "我(3)上(4)个(ge)月(4) 开(1)始(3)上(4)课(4)", "Wǒ shàng ge yuè / kāishǐ shàngkè"),
        authoredLesson("你是哪里人？", "어디 사람이에요?", ["你是", "哪里人"], "출신 묻기", "你(3)是(4) 哪(3)里(3)人(2)", "Nǐ shì nǎlǐ rén"),
        authoredLesson("你呢？", "당신은요?", ["你", "呢"], "상대에게 되묻기", "你(3) 呢(경성)", "Nǐ ne"),
        authoredLesson("你好，我叫敏。我学心理学。你是哪里人？", "안녕하세요, 저는 민이에요. 심리학을 공부해요. 어디 사람이에요?", ["你好我叫敏", "我学心理学", "你是哪里人"], "자기소개 대화 미션", "你(3)好(3)，我(3)叫(4)敏(3) / 我(3)学(2)心(1)理(3)学(2) / 你(3)是(4)哪(3)里(3)人(2)", "Nǐ hǎo, wǒ jiào Mǐn / Wǒ xué xīnlǐxué / Nǐ shì nǎlǐ rén")
      ]
    },
    {
      title: "행사에서 관계 시작하기",
      canDo: "행사에서 배경·목적·최근 관심사를 설명하고 자연스러운 후속 질문을 할 수 있다.",
      lessons: [
        authoredLesson("你好，我叫敏，第一次参加这个活动。", "안녕하세요, 저는 민이고 이 행사에는 처음 참가해요.", ["你好我叫敏", "第一次参加", "这个活动"], "행사에서 첫인사"),
        authoredLesson("你今天为什么来这儿？", "오늘은 왜 여기에 오셨어요?", ["你今天", "为什么", "来这儿"], "참석 이유 묻기"),
        authoredLesson("我来这里是想了解认知科学。", "인지과학을 알아보려고 여기에 왔어요.", ["我来这里", "是想了解", "认知科学"], "참석 목적 설명"),
        authoredLesson("我最近在研究人的决策。", "저는 최근 사람의 의사결정을 연구하고 있어요.", ["我最近", "在研究", "人的决策"], "최근 관심사 설명"),
        authoredLesson("听起来很有意思。你怎么开始做这个研究的？", "흥미롭네요. 어떻게 이 연구를 시작했어요?", ["听起来很有意思", "你怎么开始", "做这个研究的"], "관심을 보이며 이어 묻기"),
        authoredLesson("这是我第一次来，所以想认识一些同领域的人。", "처음 와서 같은 분야의 사람들을 만나고 싶어요.", ["这是我第一次来", "所以想认识", "一些同领域的人"], "배경과 목적 연결 미션")
      ]
    },
    {
      title: "격식 있는 전문 소개",
      canDo: "상대와의 관계에 맞게 전문 배경을 소개하고 정중하게 연구 계기와 견해를 물을 수 있다.",
      lessons: [
        authoredLesson("我们好像还没正式认识，我叫敏。", "아직 정식으로 인사하지 못한 것 같네요. 저는 민입니다.", ["我们好像", "还没正式认识", "我叫敏"], "부드럽게 대화 시작"),
        authoredLesson("我之前看过您关于决策的研究。", "전에 선생님의 의사결정 연구를 본 적이 있습니다.", ["我之前看过", "您关于决策的", "研究"], "상대의 연구 언급"),
        authoredLesson("我目前关注人在不确定情况下的选择。", "저는 현재 불확실한 상황에서 사람의 선택을 연구합니다.", ["我目前关注", "人在不确定情况下的", "选择"], "연구 주제 설명"),
        authoredLesson("是什么契机让您进入这个领域的？", "어떤 계기로 이 분야에 들어오셨나요?", ["是什么契机", "让您进入", "这个领域的"], "계기를 정중히 질문"),
        authoredLesson("今天能当面认识您，我很荣幸。", "오늘 직접 만나 뵙게 되어 영광입니다.", ["今天能当面认识您", "我很荣幸"], "격식 있게 마무리"),
        authoredLesson("我叫敏，目前研究人在不确定情况下的选择。", "저는 민이고 현재 불확실한 상황에서 사람의 선택을 연구합니다.", ["我叫敏", "目前研究", "人在不确定情况下的选择"], "격식 있는 소개 미션")
      ]
    },
    {
      title: "전문적인 첫 대화 주도",
      canDo: "전문 맥락에서 함축적인 인사와 연구 접점을 만들고 상대의 견해 및 다음 교류를 제안할 수 있다.",
      lessons: [
        authoredLesson("久仰，今天终于见到您了。", "말씀 많이 들었습니다. 오늘 드디어 뵙네요.", ["久仰", "今天终于", "见到您了"], "관용적인 전문 인사"),
        authoredLesson("我一直在关注您关于人类决策的研究。", "인간 의사결정에 관한 선생님의 연구를 계속 관심 있게 보고 있었습니다.", ["我一直在关注", "您关于人类决策的", "研究"], "전문적 관심 연결"),
        authoredLesson("我的研究主要在心理学和人工智能的交叉领域。", "제 연구는 주로 심리학과 인공지능의 교차 분야에 있습니다.", ["我的研究主要在", "心理学和人工智能的", "交叉领域"], "연구 정체성 압축"),
        authoredLesson("我很想听听您对我们这个方法的看法。", "저희 방법에 대한 선생님의 견해를 듣고 싶습니다.", ["我很想听听", "您对我们这个方法的", "看法"], "견해 요청"),
        authoredLesson("如果您方便，我们会后可以继续聊。", "괜찮으시다면 회의 뒤에 계속 이야기할 수 있습니다.", ["如果您方便", "我们会后", "可以继续聊"], "다음 교류 제안"),
        authoredLesson("久仰。我们的研究方向有交集，我很想听听您的看法。", "말씀 많이 들었습니다. 연구 방향에 접점이 있어 선생님의 견해를 듣고 싶습니다.", ["久仰", "我们的研究方向有交集", "我很想听听您的看法"], "전문 네트워킹 미션")
      ]
    }
  ]
};

const coursePhraseSets = [starterPhraseSets, elementaryPhraseSets, intermediatePhraseSets, advancedPhraseSets, nativePhraseSets];
const CORE_UNIT_COUNT = 8;
const LESSONS_PER_UNIT = 10;
const CORE_LESSON_COUNT = CORE_UNIT_COUNT * LESSONS_PER_UNIT;
const DAY_PAGE_SIZE = LESSONS_PER_UNIT;
const weeklySessionLabels = [
  "핵심 표현과 장면",
  "상대의 질문과 응답",
  "문장 패턴 변형",
  "듣기와 발음",
  "상황 확장",
  "빠른 의미 회상",
  "상대 역할 바꾸기",
  "격식·관계 전환",
  "실전 대화 리허설",
  "UNIT 종합 미션"
];
const weeklySessionHelps = [
  "핵심 표현을 실제 장면·의도·뜻과 정확히 연결합니다.",
  "상대의 말에 가장 자연스럽게 이어지는 응답을 고릅니다.",
  "같은 기능을 유지하며 대상·시간·격식을 바꿉니다.",
  "글자를 가리고 소리·리듬·성조로 문장을 회상합니다.",
  "같은 장면에서 질문·반응·다음 행동을 한 단계 확장합니다.",
  "앞에서 배운 표현을 뜻만 보고 짧은 간격으로 다시 떠올립니다.",
  "화자와 청자의 역할을 바꾸어 질문과 응답을 모두 연습합니다.",
  "상대와 관계에 맞게 친근함·정중함·전문성을 조절합니다.",
  "도움말을 줄이고 여러 표현을 연결해 실제 속도로 주고받습니다.",
  "UNIT의 표현을 연결해 실제 대화를 끝까지 완성합니다."
];

const courseAnchorMeta = [
  { title: "카페에서 주문하기", scene: "음료를 고르고 포장 여부 말하기", mode: "service", icon: "☕" },
  { title: "원하는 조건 바꾸기", scene: "재료나 옵션을 다른 것으로 요청하기", mode: "service", icon: "↻" },
  { title: "추천과 취향 말하기", scene: "추천을 받고 원하는 맛을 설명하기", mode: "service", icon: "✦" },
  { title: "교통편 확인하기", scene: "목적지로 가는 승강장 확인하기", mode: "service", icon: "▣" },
  { title: "환승 방법 묻기", scene: "환승 필요 여부와 이동 순서 확인하기", mode: "service", icon: "⇄" },
  { title: "예약 확인하기", scene: "이름과 예약 조건을 제시하기", mode: "service", icon: "⌂" },
  { title: "마감과 일정 확인", scene: "마감 시점과 제출 방법 확인하기", mode: "professional", icon: "◷" },
  { title: "미팅 조율하기", scene: "가능한 시간과 대안을 조율하기", mode: "professional", icon: "▦" },
  { title: "피드백 요청하기", scene: "구체적인 의견과 수정 방향 요청하기", mode: "professional", icon: "✎" },
  { title: "첫 만남과 자기소개", scene: "처음 만난 사람에게 이름·배경을 말하고 관계를 시작하기", mode: "social", icon: "◎" },
  { title: "직업과 관심사 묻기", scene: "상대의 일과 관심 분야 질문하기", mode: "social", icon: "◇" },
  { title: "다음 약속 제안하기", scene: "부담 없이 만남을 제안하고 시간 정하기", mode: "social", icon: "＋" }
];

const courseOrderByLevel = [
  [9, 0, 3, 5, 10, 11, 6, 8],
  [9, 0, 3, 5, 6, 7, 10, 11],
  [9, 10, 0, 3, 5, 6, 7, 8],
  [9, 8, 7, 6, 10, 0, 5, 11],
  [9, 8, 6, 7, 10, 5, 11, 2]
];

const coreInteractionNetworks = {
  en: {
    responses: [
      "Certainly. What size would you like?", "Of course. Oat milk is available.", "If you like something light, try this one.", "It's on platform four.",
      "Yes. Change at Central Station.", "I found it. May I see your ID?", "It's due by Friday afternoon.", "Yes, I have time after three.",
      "Sure. Which part would you like feedback on?", "Nice to meet you, Min. I'm Alex.", "I work in product research.", "I'd love to. Saturday works for me."
    ],
    followUps: [
      "Could I also get a bottle of water?", "Is there an extra charge for that?", "I'd prefer something that isn't too sweet.", "What time does the next train leave?",
      "How many stops is it from there?", "Is early check-in available?", "Who should I send the final file to?", "I can work around your schedule.",
      "Which part should I revise first?", "What brings you here today?", "How did you get into that field?", "What time and place work for you?"
    ]
  },
  ja: {
    responses: [
      "かしこまりました。サイズはいかがなさいますか。", "はい、オーツミルクに変更できます。", "軽めでしたら、こちらがおすすめです。", "四番ホームです。",
      "はい、中央駅で乗り換えてください。", "ご予約を確認しました。身分証をお願いします。", "金曜日の午後までです。", "はい、三時以降なら空いています。",
      "もちろんです。どの部分について意見が必要ですか。", "はじめまして、ミンさん。アレックスです。", "商品リサーチの仕事をしています。", "ぜひ。土曜日なら大丈夫です。"
    ],
    followUps: [
      "お水も一つお願いします。", "追加料金はかかりますか。", "甘すぎないものがいいです。", "次の電車は何時に出ますか。",
      "そこから何駅ですか。", "早めのチェックインはできますか。", "最終版は誰に送ればいいですか。", "そちらの予定に合わせます。",
      "どの部分から直したほうがいいですか。", "今日はどうしてこちらに来たんですか。", "どうしてその分野を選んだんですか。", "何時にどこで会いましょうか。"
    ]
  },
  zh: {
    responses: [
      "好的。您要什么杯型？", "可以，我们有燕麦奶。", "如果想喝清淡一点的，我推荐这个。", "在四号站台。",
      "需要，请在中央站换乘。", "查到了，请出示一下证件。", "星期五下午之前要交。", "可以，我三点以后有空。",
      "当然可以。你想听哪一部分的意见？", "很高兴认识你，敏。我叫Alex。", "我做产品研究。", "好啊，星期六我有空。"
    ],
    followUps: [
      "还可以给我一瓶水吗？", "这个需要另外收费吗？", "我想要不太甜的。", "下一班车几点开？",
      "从那里还要坐几站？", "可以提前入住吗？", "最终文件应该发给谁？", "我可以配合你的时间。",
      "我应该先修改哪一部分？", "你今天为什么来这里？", "你为什么进入这个行业？", "几点在哪里见比较方便？"
    ]
  }
};

const coreInteractionNetworkKo = {
  responses: [
    "물론입니다. 어떤 크기로 드릴까요?", "네, 귀리 우유로 변경할 수 있습니다.", "가벼운 맛을 원하시면 이것을 추천해요.", "4번 승강장에 있습니다.",
    "네, 중앙역에서 갈아타세요.", "예약을 확인했습니다. 신분증을 보여주시겠어요?", "금요일 오후까지 제출하면 됩니다.", "네, 3시 이후에는 시간이 있어요.",
    "물론이죠. 어느 부분에 대한 의견이 필요한가요?", "만나서 반가워요, 민 씨. 저는 알렉스예요.", "저는 제품 리서치 일을 해요.", "좋아요. 토요일은 괜찮아요."
  ],
  followUps: [
    "물 한 병도 함께 받을 수 있을까요?", "추가 비용이 있나요?", "너무 달지 않은 것으로 원해요.", "다음 열차는 몇 시에 출발하나요?",
    "거기서 몇 정거장 더 가야 하나요?", "조기 체크인이 가능한가요?", "최종 파일은 누구에게 보내야 하나요?", "상대 일정에 맞출 수 있어요.",
    "어느 부분부터 먼저 고치면 좋을까요?", "오늘은 어떤 일로 오셨어요?", "어떻게 그 분야를 시작하게 되었어요?", "몇 시에 어디에서 만나는 것이 편한가요?"
  ]
};

const functionalSupportLines = {
  en: {
    social: authoredLesson("Could you say that again?", "다시 말씀해 주시겠어요?", ["Could you", "say that again"], "대화 복구"),
    service: authoredLesson("Could you confirm the details?", "세부 내용을 확인해 주시겠어요?", ["Could you confirm", "the details"], "조건 확인"),
    professional: authoredLesson("Just to confirm, what's the next step?", "확인차 여쭤보는데 다음 단계는 무엇인가요?", ["Just to confirm", "what's the next step"], "다음 행동 확인")
  },
  ja: {
    social: authoredLesson("もう一度お願いできますか。", "한 번 더 말씀해 주시겠어요?", ["もう一度", "お願いできますか"], "대화 복구"),
    service: authoredLesson("内容を確認していただけますか。", "내용을 확인해 주시겠어요?", ["内容を", "確認していただけますか"], "조건 확인"),
    professional: authoredLesson("念のため、次の対応を確認させてください。", "확인차 다음 조치를 확인하겠습니다.", ["念のため", "次の対応を", "確認させてください"], "다음 행동 확인")
  },
  zh: {
    social: authoredLesson("可以再说一遍吗？", "한 번 더 말씀해 주실 수 있나요?", ["可以", "再说一遍吗"], "대화 복구"),
    service: authoredLesson("可以确认一下细节吗？", "세부 내용을 확인할 수 있을까요?", ["可以确认一下", "细节吗"], "조건 확인"),
    professional: authoredLesson("我确认一下，下一步怎么做？", "확인하겠습니다. 다음 단계는 어떻게 하나요?", ["我确认一下", "下一步", "怎么做"], "다음 행동 확인")
  }
};

const beginnerScriptGuides = {
  ja: [
    ["アイスコーヒーをひとつ、もちかえりでおねがいします。", "aisu kōhī o hitotsu / mochikaeri de / onegai shimasu"],
    ["オーツミルクでおねがいします。", "ōtsu miruku de / onegai shimasu"],
    ["にんきのメニューはなんですか。", "ninki no menyū wa / nan desu ka"],
    ["きゅうこうはなんばんせんですか。", "kyūkō wa / nan-bansen desu ka"],
    ["のりかえますか。", "norikaemasu ka"],
    ["ミンでよやくしました。", "Min de / yoyaku shimashita"],
    ["いつまでですか。", "itsu made desu ka"],
    ["きょうのごご、あえますか。", "kyō no gogo / aemasu ka"],
    ["これをみてください。", "kore o / mite kudasai"],
    ["はじめまして。ミンです。", "hajimemashite / Min desu"],
    ["おしごとはなんですか。", "oshigoto wa / nan desu ka"],
    ["しゅうまつ、コーヒーをのみませんか。", "shūmatsu / kōhī o / nomimasen ka"]
  ],
  zh: [
    ["我要一杯冰美式，带走。", "Wǒ yào yì bēi bīng Měishì / dài zǒu."],
    ["请换成燕麦奶。", "Qǐng huàn chéng / yànmài nǎi."],
    ["什么最受欢迎？", "Shénme / zuì shòu huānyíng?"],
    ["快车在哪个站台？", "Kuàichē / zài nǎge zhàntái?"],
    ["我要换车吗？", "Wǒ yào / huànchē ma?"],
    ["我叫金敏，订了房。", "Wǒ jiào Jīn Mǐn / dìng le fáng."],
    ["什么时候要交？", "Shénme shíhou / yào jiāo?"],
    ["下午可以开会吗？", "Xiàwǔ / kěyǐ kāihuì ma?"],
    ["请看一下这个。", "Qǐng kàn yíxià / zhège."],
    ["你好，我叫敏。", "Nǐ hǎo / wǒ jiào Mǐn."],
    ["你做什么工作？", "Nǐ zuò / shénme gōngzuò?"],
    ["周末一起喝咖啡吗？", "Zhōumò / yìqǐ hē kāfēi ma?"]
  ]
};

const elementaryScriptGuides = {
  ja: [
    ["アイスアメリカーノを・もちかえりで・おねがいします。", "aisu amerikāno o / mochikaeri de / onegai shimasu"],
    ["オーツミルクに・かえられますか。", "ōtsu miruku ni / kaeraremasu ka"],
    ["おすすめは・なんですか。", "osusume wa / nan desu ka"],
    ["くうこうゆきは・なんばんホームですか。", "kūkō-yuki wa / nanban hōmu desu ka"],
    ["のりかえは・ひつようですか。", "norikae wa / hitsuyō desu ka"],
    ["キム・ミンのなまえで・よやくしています。", "Kimu Min no namae de / yoyaku shiteimasu"],
    ["しめきりは・いつですか。", "shimekiri wa / itsu desu ka"],
    ["きょうのごごは・あいていますか。", "kyō no gogo wa / aiteimasu ka"],
    ["これを・みてもらえますか。", "kore o / mite moraemasu ka"],
    ["はじめまして、ミンです。ここは・はじめてです。", "hajimemashite, Min desu / koko wa hajimete desu"],
    ["どんなおしごとを・していますか。", "donna oshigoto o / shiteimasu ka"],
    ["こんしゅうまつ・コーヒーを・のみませんか。", "konshūmatsu / kōhī o / nomimasen ka"]
  ],
  zh: [
    ["我要一杯冰美式，麻烦打包。", "Wǒ yào yì bēi bīng Měishì / máfan dǎbāo."],
    ["可以换成燕麦奶吗？", "Kěyǐ huàn chéng / yànmài nǎi ma?"],
    ["你推荐什么？", "Nǐ tuījiàn / shénme?"],
    ["去机场的车在几号站台？", "Qù jīchǎng de chē / zài jǐ hào zhàntái?"],
    ["我需要换乘吗？", "Wǒ xūyào / huànchéng ma?"],
    ["我用金敏的名字订了房。", "Wǒ yòng Jīn Mǐn de míngzi / dìng le fáng."],
    ["这个什么时候要交？", "Zhège / shénme shíhou yào jiāo?"],
    ["你今天下午有空吗？", "Nǐ jīntiān xiàwǔ / yǒu kòng ma?"],
    ["可以帮我看一下这个吗？", "Kěyǐ bāng wǒ / kàn yíxià zhège ma?"],
    ["你好，我叫敏。我刚来这里。", "Nǐ hǎo, wǒ jiào Mǐn / Wǒ gāng lái zhèlǐ."],
    ["你做什么工作？", "Nǐ zuò / shénme gōngzuò?"],
    ["这个周末一起喝咖啡吗？", "Zhège zhōumò / yìqǐ hē kāfēi ma?"]
  ]
};

function courseScriptGuide(language, levelIndex, anchorIndex, source) {
  if (source.reading || source.romanization) {
    return {
      label: language === "ja" ? "문자·로마자" : language === "zh" ? "한자·성조·병음" : "리듬 단위",
      reading: source.reading || source.tokens.join(" / "),
      romanization: source.romanization || "의미 덩어리마다 한 번씩 강세를 두고 연결해 읽으세요."
    };
  }
  if (language === "en") return { label: "리듬 단위", reading: source.tokens.join(" / "), romanization: "덩어리마다 한 번씩 강세를 두고 연결해 읽으세요." };
  if (levelIndex < 2 && source.phrase === coursePhraseSets[levelIndex][language][anchorIndex]?.phrase) {
    const guide = (levelIndex === 0 ? beginnerScriptGuides : elementaryScriptGuides)[language]?.[anchorIndex];
    if (guide) return { label: language === "ja" ? "히라가나·로마자" : "병음·성조", reading: guide[0], romanization: guide[1] };
  }
  return { label: language === "ja" ? "문자·의미 덩어리" : "한자·의미 덩어리", reading: source.phrase, romanization: language === "ja" ? "발음 버튼으로 소리를 먼저 듣고 조사와 어미까지 한 덩어리로 따라 하세요." : "발음 버튼으로 소리를 먼저 듣고 각 덩어리의 성조를 유지하며 따라 하세요." };
}

function combineUnitLessons(items, label) {
  const lessons = items.filter(Boolean);
  const phrases = lessons.map((item) => item.phrase).filter(Boolean);
  const translations = lessons.map((item) => item.translation).filter(Boolean);
  const tokens = lessons.flatMap((item) => item.tokens || targetTokens(item.phrase || "", "en")).filter(Boolean).slice(0, 7);
  const readings = lessons.map((item) => item.reading).filter(Boolean);
  const romanizations = lessons.map((item) => item.romanization).filter(Boolean);
  return authoredLesson(
    phrases.join(" "),
    translations.join(" "),
    tokens,
    label,
    readings.join(" / "),
    romanizations.join(" / ")
  );
}

function expandedFirstMeetingLessons(language, levelIndex) {
  const original = curatedFirstMeetingUnits[language][levelIndex].lessons;
  const [scene, response, pattern, sound, expansion, mission] = original;
  const registerLevel = levelIndex < curatedFirstMeetingUnits[language].length - 1 ? levelIndex + 1 : levelIndex - 1;
  const registerSource = curatedFirstMeetingUnits[language][registerLevel].lessons[0];
  return [
    scene,
    response,
    pattern,
    sound,
    expansion,
    combineUnitLessons([scene, response], "빠른 의미 회상"),
    combineUnitLessons([response, pattern], "상대 역할 바꾸기"),
    { ...registerSource, label: "격식·관계 전환" },
    combineUnitLessons([scene, response, expansion], "실전 대화 리허설"),
    { ...mission, label: "UNIT 종합 미션" }
  ];
}

function unitLessonSources(language, levelIndex, anchorIndex) {
  if (anchorIndex === 9) return expandedFirstMeetingLessons(language, levelIndex);
  const profileSource = coursePhraseSets[levelIndex][language][anchorIndex];
  const network = coreInteractionNetworks[language];
  const variantLevel = levelIndex === coursePhraseSets.length - 1 ? levelIndex - 1 : levelIndex + 1;
  const variant = coursePhraseSets[variantLevel][language][anchorIndex];
  const registerLevel = levelIndex < coursePhraseSets.length - 1 ? levelIndex + 1 : levelIndex - 1;
  const registerVariant = coursePhraseSets[registerLevel][language][anchorIndex];
  const normalizedMode = ["social", "service", "professional"].includes(courseAnchorMeta[anchorIndex].mode) ? courseAnchorMeta[anchorIndex].mode : "professional";
  const response = authoredLesson(network.responses[anchorIndex], coreInteractionNetworkKo.responses[anchorIndex], targetTokens(network.responses[anchorIndex], language), "상대의 자연스러운 응답");
  const followUp = authoredLesson(network.followUps[anchorIndex], coreInteractionNetworkKo.followUps[anchorIndex], targetTokens(network.followUps[anchorIndex], language), "다음 질문·행동");
  const support = functionalSupportLines[language][normalizedMode];
  const missionText = `${profileSource.phrase} ${followUp.phrase}`.trim();
  return [
    { ...profileSource, label: "핵심 표현과 장면" },
    response,
    { ...variant, label: variantLevel > levelIndex ? "같은 기능의 높은 단계 변형" : "같은 기능의 간결한 변형" },
    { ...profileSource, label: "듣고 다시 말하기" },
    followUp,
    combineUnitLessons([profileSource, response], "빠른 의미 회상"),
    combineUnitLessons([response, followUp], "상대 역할 바꾸기"),
    { ...registerVariant, label: "격식·관계 전환" },
    combineUnitLessons([profileSource, response, support], "실전 대화 리허설"),
    authoredLesson(missionText, `${profileSource.translation} ${followUp.translation}`, [...profileSource.tokens, ...followUp.tokens].slice(0, 5), "UNIT 종합 미션")
  ];
}

function unitExpressionLinks(language, levelIndex, anchorIndex, source, unitSources, lessonIndex) {
  const network = coreInteractionNetworks[language];
  const sameLessonVariants = anchorIndex === 9
    ? curatedFirstMeetingUnits[language].map((unit, index) => expandedFirstMeetingLessons(language, index)[lessonIndex]?.phrase).filter(Boolean)
    : coursePhraseSets.map((set) => set[language][anchorIndex]?.phrase).filter(Boolean);
  const distinctVariant = sameLessonVariants.find((text) => text !== source.phrase) || source.phrase;
  const alternateLevel = levelIndex < 3 ? levelIndex + 2 : levelIndex - 2;
  const registerVariant = anchorIndex === 9
    ? expandedFirstMeetingLessons(language, alternateLevel)[Math.min(lessonIndex, LESSONS_PER_UNIT - 1)].phrase
    : coursePhraseSets[alternateLevel][language][anchorIndex].phrase;
  const normalizedMode = ["social", "service", "professional"].includes(courseAnchorMeta[anchorIndex].mode) ? courseAnchorMeta[anchorIndex].mode : "professional";
  const candidates = [
    { form: distinctVariant, note: "같은 기능 · 같은 의도를 다른 수준의 말투로 표현" },
    { form: network.responses[anchorIndex], note: "자연스러운 응답 · 상대가 바로 이어서 할 수 있는 말" },
    { form: registerVariant, note: "격식 차이 · 관계와 난이도에 따라 달라지는 표현" },
    { form: unitSources[(lessonIndex + 1) % unitSources.length].phrase, note: "상황 확장 · 같은 장면에 조건이나 질문을 더하는 말" },
    { form: functionalSupportLines[language][normalizedMode].phrase, note: "대화 유지·복구 · 못 들었거나 다음 행동을 확인할 때 쓰는 말" }
  ];
  const fallbackPool = [
    ...sameLessonVariants,
    ...unitSources.map((item) => item.phrase),
    network.responses[anchorIndex],
    network.followUps[anchorIndex],
    ...Object.values(functionalSupportLines[language]).map((item) => item.phrase)
  ].filter(Boolean);
  const used = new Set([source.phrase]);
  return candidates.map((item) => {
    const form = item.form && !used.has(item.form) ? item.form : fallbackPool.find((candidate) => !used.has(candidate));
    used.add(form);
    return { ...item, form };
  });
}

function buildFunctionalPoint(language, levelIndex, anchorIndex, source, unitSources, lessonIndex) {
  const anchor = courseAnchorMeta[anchorIndex];
  const sceneChoices = [
    "카페에서 음료를 주문할 때",
    "카페에서 재료나 옵션 변경을 요청할 때",
    "메뉴를 추천받을 때",
    "이동 중 목적지로 가는 승강장을 확인할 때",
    "환승 방법을 물을 때",
    "호텔이나 식당에서 예약자 이름과 조건을 확인할 때",
    "제출 마감일을 물을 때",
    "학교나 직장에서 약속 시간을 제안할 때",
    "업무 자료의 확인과 피드백을 요청할 때",
    "처음 만난 사람과 인사하고 자기소개할 때",
    "직업과 관심사를 물을 때",
    "다음 만남을 제안할 때"
  ];
  const otherScenes = [1, 3, 5, 7, 10, 11].filter((index) => index !== anchorIndex).slice(0, 3);
  const rolePrompts = [
    "이 표현의 뜻과 실제 사용 장면으로 가장 알맞은 것은 무엇인가요?",
    "상대의 앞말을 받은 이 표현의 역할로 가장 알맞은 것은 무엇인가요?",
    "원래 의도를 유지하면서 달라진 점을 가장 정확히 설명한 것은 무엇인가요?",
    "소리를 들을 때 반드시 구별해야 할 핵심 정보는 무엇인가요?",
    "이 표현이 같은 장면의 대화를 어떻게 확장하는지 고르세요.",
    "뜻만 보고 앞에서 배운 표현을 다시 떠올릴 때 확인할 핵심은 무엇인가요?",
    "화자와 청자의 역할을 바꾼 이 표현의 기능으로 가장 알맞은 것은 무엇인가요?",
    "이 표현이 관계와 격식에 맞게 달라진 점을 고르세요.",
    "실전 대화 리허설에서 이 표현 묶음이 하는 역할을 고르세요.",
    "UNIT 종합 대화에서 이 표현이 맡는 역할을 고르세요."
  ];
  const correctRoles = [
    `${sceneChoices[anchorIndex]} ‘${source.translation}’라는 뜻을 전하는 핵심 표현이다.`,
    `상대의 말을 받아 ${anchor.title} 장면의 대화를 자연스럽게 이어간다.`,
    `핵심 기능을 유지하면서 대상·조건·격식 중 하나를 바꾼 표현이다.`,
    `‘${source.translation}’라는 의미를 이루는 소리 덩어리와 어순이다.`,
    `${anchor.title} 장면에 필요한 질문이나 다음 행동을 덧붙인다.`,
    `${anchor.title}에서 이미 익힌 뜻과 표현을 짧은 간격으로 다시 연결한다.`,
    `질문하는 사람과 답하는 사람의 역할을 바꾸어 같은 장면을 이어간다.`,
    `같은 의사소통 목적을 유지하며 상대와 관계에 맞는 말투로 조절한다.`,
    `${anchor.title}에서 여러 표현을 실제 순서와 속도로 연결해 주고받는다.`,
    `${anchor.title} 장면에서 배운 표현을 연결해 대화를 완성한다.`
  ];
  const distractorRoles = otherScenes.map((index) => `${sceneChoices[index]} 필요한 말이다.`);
  const politeness = { social: 48, service: 68, professional: 78, resolution: 74, business: 84 }[anchor.mode] || 60;
  return {
    focus: source.tokens[0] || source.phrase,
    detailFocus: source.tokens[1] || source.tokens[0] || source.phrase,
    meaning: source.translation,
    alternative: unitSources[Math.min(lessonIndex + 1, unitSources.length - 1)].phrase,
    grammar: `‘${source.phrase}’는 ${anchor.title} 장면에서 ‘${source.translation}’라는 의사소통 목적을 수행합니다. 단어별 직역보다 장면·상대·말의 기능을 함께 기억하세요.`,
    sentenceMeaning: `‘${source.translation}’라는 뜻입니다. ${sceneChoices[anchorIndex]} 사용합니다.`,
    politeness,
    quizPrompt: rolePrompts[lessonIndex],
    options: [
      { text: correctRoles[lessonIndex], correct: true },
      ...distractorRoles.map((text) => ({ text, correct: false }))
    ],
    alternatives: unitExpressionLinks(language, levelIndex, anchorIndex, source, unitSources, lessonIndex)
  };
}

function buildFunctionalFormula(language, levelIndex, anchorIndex, source, lessonIndex) {
  const profile = levelProfiles[language][levelIndex];
  const variants = anchorIndex === 9
    ? curatedFirstMeetingUnits[language].map((unit, index) => expandedFirstMeetingLessons(language, index)[lessonIndex]?.phrase).filter(Boolean)
    : coursePhraseSets.map((set) => set[language][anchorIndex]?.phrase).filter(Boolean);
  const uniqueVariants = variants.filter((text, index, all) => text && all.indexOf(text) === index);
  while (uniqueVariants.length < 3) uniqueVariants.push(source.phrase);
  return {
    formula: source.tokens.join(" + "),
    examples: uniqueVariants.slice(0, 3).map((sentence) => ({ sentence, highlight: "" })),
    nativeVariants: uniqueVariants.filter((sentence) => sentence !== source.phrase).slice(0, 3),
    chunks: source.tokens.slice(0, 3).map((text, index) => ({ text, note: index === 0 ? "의도를 시작하는 핵심 덩어리" : "대상·조건·관계를 구체화하는 덩어리" })),
    levelTip: `${profile.name} 단계에서는 ${source.label || "오늘의 기능"}을 장면과 상대의 반응까지 연결해 익힙니다.`
  };
}

function buildUnitPronunciationFlow(unitSources, lessonIndex) {
  return {
    turns: [1, 2, 3].map((offset, index) => {
      const item = unitSources[(lessonIndex + offset) % unitSources.length];
      return { label: ["상대의 말에 응답하기", "같은 기능을 바꾸어 말하기", "다음 질문으로 이어가기"][index], text: item.phrase, note: item.translation };
    })
  };
}

function lessonCanDo(anchor, source, lessonIndex) {
  return [
    `${anchor.title} 장면에서 ‘${source.translation}’라는 뜻의 핵심 표현을 고를 수 있다.`,
    `${anchor.title} 장면에서 상대의 말에 알맞은 응답을 선택하고 이어 말할 수 있다.`,
    `${anchor.title}의 핵심 기능을 유지하면서 대상·시간·격식을 바꿔 말할 수 있다.`,
    `문자를 가리고 ‘${source.translation}’라는 의미를 소리·리듬·성조로 회상할 수 있다.`,
    `${anchor.title} 장면에 질문·조건·다음 행동을 한 가지 덧붙일 수 있다.`,
    `${anchor.title}에서 앞서 배운 뜻을 보고 알맞은 표현을 빠르게 회상할 수 있다.`,
    `${anchor.title}에서 질문과 응답의 역할을 바꾸어 양쪽 표현을 모두 말할 수 있다.`,
    `${anchor.title}에서 상대와 관계에 따라 친근함·정중함·전문성을 조절할 수 있다.`,
    `${anchor.title}의 여러 표현을 도움말 없이 실제 순서로 연결할 수 있다.`,
    `${anchor.title}에서 배운 표현을 연결해 실제 대화를 끝까지 완성할 수 있다.`
  ][lessonIndex];
}

function makeCourseDay(language, levelIndex, anchorIndex, unitIndex, lessonIndex, idPrefix = "core", optional = false) {
  const profile = levelProfiles[language][levelIndex];
  const unitSources = unitLessonSources(language, levelIndex, anchorIndex);
  const source = unitSources[lessonIndex];
  const anchor = courseAnchorMeta[anchorIndex];
  const stageIndex = Math.min(4, lessonIndex);
  const internalBand = profile.bands[unitIndex < CORE_UNIT_COUNT / 2 ? 0 : 1];
  const target = source.phrase;
  const tokens = source.tokens?.length ? source.tokens : targetTokens(target, language);
  const decoyCount = Math.max(0, tokens.length - 2);
  const decoys = sentenceDecoys[language].filter((item) => !target.includes(item)).slice((unitIndex + lessonIndex + levelIndex) % 5, (unitIndex + lessonIndex + levelIndex) % 5 + decoyCount);
  const point = buildFunctionalPoint(language, levelIndex, anchorIndex, source, unitSources, lessonIndex);
  const quiz = buildQuiz(point, anchor.scene, source.phrase, point.alternative, unitIndex * 97 + lessonIndex * 13 + levelIndex);
  const conversationFormula = buildFunctionalFormula(language, levelIndex, anchorIndex, source, lessonIndex);
  const pronunciationFlow = buildUnitPronunciationFlow(unitSources, lessonIndex);
  const dialogue = makeDialogueTurns(language, anchor.mode, source.phrase, target, unitSources.map((item) => item.phrase), lessonIndex, point, pronunciationFlow, conversationFormula, anchor.scene, levelIndex, stageIndex);
  const coach = buildDayCoach(language, anchor.mode, anchor.scene, profile, levelIndex, stageIndex, point);
  coach.stage = `${internalBand} · UNIT ${String(unitIndex + 1).padStart(2, "0")} · LESSON ${lessonIndex + 1}`;
  coach.canDo = lessonCanDo(anchor, source, lessonIndex);
  coach.scene = `${anchor.scene}. 오늘은 ‘${source.translation}’라는 의도를 연습합니다.`;
  coach.transfer = `${anchor.title}의 사람·시간·조건 중 하나만 바꾸어 같은 기능으로 다시 말해보세요.`;
  return {
    id: `${language}-${idPrefix}-level-${levelIndex + 1}-unit-${unitIndex + 1}-lesson-${lessonIndex + 1}`,
    mode: anchor.mode,
    title: source.label || weeklySessionLabels[lessonIndex],
    focus: weeklySessionHelps[lessonIndex],
    weekIndex: unitIndex,
    weekLabel: `UNIT ${String(unitIndex + 1).padStart(2, "0")} · ${anchor.title}`,
    sessionLabel: weeklySessionLabels[lessonIndex],
    internalBand,
    optional,
    stageIndex,
    stageLabel: weeklySessionLabels[lessonIndex],
    coach,
    word: point.focus,
    reading: `${profile.goal} · ${internalBand}`,
    scriptGuide: courseScriptGuide(language, levelIndex, anchorIndex, source),
    meaning: point.meaning,
    studySentence: source.phrase,
    sentenceMeaning: source.translation,
    phrase: target,
    translation: source.translation,
    tokens,
    decoys,
    pool: seededShuffle([...tokens, ...decoys], unitIndex * 701 + lessonIndex * 31 + levelIndex),
    quiz,
    conversationFormula,
    pronunciationFlow,
    sentenceExplanation: `${internalBand}에서는 ‘${point.focus}’를 실제 장면·응답·소리와 함께 회상합니다. ${weeklySessionHelps[lessonIndex]}`,
    expansionPhrase: point.alternative,
    opening: dialogue.opening,
    openingKo: dialogue.openingKo,
    dialogueRole: dialogue.role,
    dialogueGoal: dialogue.goal,
    dialogueTurns: dialogue.turns
  };
}

function buildCurriculum(language, levelIndex) {
  const v2Course = window.AiderLogLanguageV2?.getCourse?.(language, levelIndex);
  if (v2Course?.units?.length) return buildV2Curriculum(v2Course);
  const profile = levelProfiles[language][levelIndex];
  const order = courseOrderByLevel[levelIndex].slice(0, CORE_UNIT_COUNT);
  const coreTopics = order.map((anchorIndex, unitIndex) => {
    const anchor = courseAnchorMeta[anchorIndex];
    const authoredUnit = anchorIndex === 9 ? curatedFirstMeetingUnits[language][levelIndex] : null;
    return {
      id: `core-unit-${unitIndex + 1}`,
      icon: anchor.icon,
      unitNumber: unitIndex + 1,
      tab: authoredUnit?.title || anchor.title,
      place: `기본 과정 · UNIT ${unitIndex + 1}`,
      title: authoredUnit?.title || anchor.title,
      description: authoredUnit?.canDo || `${profile.name} · ${anchor.scene}`,
      core: true,
      unit: true,
      days: Array.from({ length: LESSONS_PER_UNIT }, (_, lessonIndex) => makeCourseDay(language, levelIndex, anchorIndex, unitIndex, lessonIndex, `core-unit-${unitIndex + 1}`))
    };
  });
  const labTopics = order.map((anchorIndex, unitIndex) => {
    const anchor = courseAnchorMeta[anchorIndex];
    return {
      id: `lab-${anchorIndex + 1}`,
      icon: anchor.icon,
      unitNumber: unitIndex + 1,
      tab: anchor.title,
      place: `실전 연습 · ${anchor.title}`,
      title: `${anchor.title} 집중 연습`,
      description: `${profile.name} · 같은 장면에서 응답·변형·듣기·확장 반복`,
      optional: true,
      unit: true,
      days: Array.from({ length: LESSONS_PER_UNIT }, (_, lessonIndex) => makeCourseDay(language, levelIndex, anchorIndex, unitIndex, lessonIndex, `lab-${anchorIndex + 1}`, true))
    };
  });
  const reviewTopics = coreTopics.map((unit, unitIndex) => ({
    id: `review-unit-${unitIndex + 1}`,
    icon: "R",
    unitNumber: unitIndex + 1,
    tab: `${String(unitIndex + 1).padStart(2, "0")} · ${unit.tab}`,
    place: "확장 학습 · UNIT CHECK",
    title: `${unit.title} 확장`,
    description: "배운 표현을 듣기·발음·변형·실전 대화로 넓혀 다시 사용",
    optional: true,
    unit: true,
    days: unit.days.map((day, lessonIndex) => ({ ...day, id: `${day.id}-review`, optional: true, title: `${day.title} 복습`, focus: `${weeklySessionLabels[lessonIndex]}에서 어려웠던 기능을 다시 확인합니다.` }))
  }));
  return [
    {
      id: "core",
      icon: "기본",
      title: "기본",
      description: "순서대로 익히는 8개 UNIT · 80개 핵심 수업",
      topics: coreTopics
    },
    { id: "labs", icon: "실전", title: "실전", description: "필요한 장면을 선택해 집중 연습", topics: labTopics },
    {
      id: "review",
      icon: "확장", title: "확장", description: "배운 표현을 더 긴 대화와 새로운 맥락으로 확장",
      topics: reviewTopics
    }
  ];
}

function buildV2Curriculum(course) {
  const language = course.language;
  const levelIndex = validV2Level(course.uiLevelIndex);
  const profile = levelProfiles[language]?.[levelIndex] || levelProfiles.en[0];
  const topics = course.units.slice(0, CORE_UNIT_COUNT).map((unit, unitIndex) => ({
    id: unit.id || `v2-${language}-${levelIndex}-unit-${unitIndex + 1}`,
    icon: String(unitIndex + 1).padStart(2, "0"),
    unitNumber: unitIndex + 1,
    tab: unit.title || `UNIT ${unitIndex + 1}`,
    place: `기본 과정 · UNIT ${String(unitIndex + 1).padStart(2, "0")}`,
    title: unit.title || `UNIT ${unitIndex + 1}`,
    description: unit.description || unit.canDo || `${course.levelLabel || profile.name} · 10 Lesson`,
    core: true,
    unit: true,
    days: (unit.lessons || []).slice(0, LESSONS_PER_UNIT).map((lesson, lessonIndex) => v2LessonToDay(lesson, unit, unitIndex, lessonIndex, profile))
  }));
  return [{ id:"core", icon:"기본", title:"기본", description:"순서대로 익히는 8개 UNIT · 80개 핵심 수업", topics }];
}

function validV2Level(value) {
  const level = Number(value);
  return Number.isInteger(level) && level >= 0 && level < 5 ? level : 0;
}

function v2LessonToDay(lesson, unit, unitIndex, lessonIndex, profile) {
  const target = lesson.target || {};
  const explanation = lesson.explanation || {};
  const task = lesson.task || {};
  const dialogue = lesson.dialogue || {};
  const options = Array.isArray(task.options) ? task.options : [];
  const correctIndices = options.map((option, index) => option?.correct ? index : -1).filter(index => index >= 0);
  const tokens = Array.isArray(task.tokens) && task.tokens.length ? task.tokens : Array.isArray(target.chunks) && target.chunks.length ? target.chunks : String(target.text || "").split(/\s+/).filter(Boolean);
  const decoys = Array.isArray(task.decoys) ? task.decoys : [];
  const details = [
    explanation.exactMeaning,
    explanation.usageAndNuance,
    explanation.contrastWithLowerLevel,
    explanation.commonPitfall,
    explanation.evidenceStatus
  ].filter(Boolean);
  const variants = [...new Set([target.text, ...(dialogue.turns || []).flatMap(turn => turn.suggestions || [])].filter(Boolean))].slice(0, 4);
  return {
    id: lesson.id || `v2-${unit.id}-${lessonIndex + 1}`,
    mode: task.type || "conversation",
    title: lesson.title || `Lesson ${lessonIndex + 1}`,
    focus: lesson.canDo || lesson.sessionPurpose || "실제 장면에서 목표 표현을 사용합니다.",
    weekIndex: unitIndex,
    weekLabel: `UNIT ${String(unitIndex + 1).padStart(2, "0")} · ${unit.title || ""}`,
    sessionLabel: lesson.sessionLabel || `Lesson ${lessonIndex + 1}`,
    internalBand: lesson.levelLabel || profile.name,
    optional: false,
    stageIndex: lessonIndex,
    stageLabel: lesson.sessionLabel || `Lesson ${lessonIndex + 1}`,
    coach: {
      canDo: lesson.canDo || "목표 표현을 장면에 맞게 사용합니다.",
      scene: lesson.scene || "실제 대화 장면",
      stage: `${lesson.levelLabel || profile.name} · UNIT ${String(unitIndex + 1).padStart(2, "0")} · LESSON ${lessonIndex + 1}`,
      register: explanation.usageAndNuance || "장면과 상대에 맞는 어조를 확인합니다.",
      commonMistake: explanation.commonPitfall || "의미와 쓰임을 확인한 뒤 응답하세요.",
      transfer: explanation.contrastWithLowerLevel || "같은 기능을 다른 장면에도 적용해보세요.",
      pronunciation: target.reading || "기기 음성을 듣고 문장 전체를 따라 말해보세요.",
      rubric: [lesson.canDo || "과제의 실제 기능을 수행했는지 확인합니다."]
    },
    word: (target.chunks || [target.text]).filter(Boolean)[0] || target.text || "",
    reading: target.reading || "",
    scriptGuide: target.reading ? { label:"읽기", reading:target.text || "", romanization:target.reading } : null,
    meaning: target.korean || "",
    studySentence: target.text || "",
    sentenceMeaning: target.korean || "",
    phrase: target.text || "",
    translation: target.korean || "",
    tokens,
    decoys,
    pool: [...tokens, ...decoys],
    quiz: {
      prompt: task.prompt || "가장 알맞은 답을 고르세요.",
      options: options.map(option => ({ text:option.text || "", rationale:option.rationale || "" })),
      correctIndices: correctIndices.length ? correctIndices : [Number(task.correctIndex) || 0],
      sentenceMeaning: target.korean || "",
      explanation: [task.answerExplanation, ...options.map((option, index) => `${index + 1}. ${option.rationale || "확인 필요"}`)].filter(Boolean).join(" "),
      politeness: 50,
      alternatives: variants.map(form => ({ form, note:"같은 장면에서 사용할 수 있는 표현" }))
    },
    conversationFormula: {
      formula: Array.isArray(target.chunks) && target.chunks.length ? target.chunks.join(" + ") : target.text || "",
      levelTip: explanation.contrastWithLowerLevel || explanation.usageAndNuance || "장면과 상대에 맞게 표현을 조절해보세요.",
      examples: variants.map(sentence => ({ sentence, highlight:"" })),
      nativeVariants: variants,
      chunks: (target.chunks || []).map(text => ({ text, note:"의미 덩어리" }))
    },
    pronunciationFlow: { turns:(dialogue.turns || []).map((turn, index) => ({
      label: turn.intent || `대화 ${index + 1}`,
      text: (turn.suggestions || [target.text])[0] || target.text || "",
      note: turn.replyKo || turn.reply || "장면에 맞게 이어 말해보세요."
    })) },
    sentenceExplanation: details.join(" ") || task.answerExplanation || "",
    expansionPhrase: variants[1] || target.text || "",
    opening: dialogue.opening || "",
    openingKo: dialogue.openingKo || "",
    dialogueRole: dialogue.role || "장면 속 대화 상대",
    dialogueGoal: dialogue.goal || lesson.canDo || "",
    dialogueTurns: dialogue.turns || [],
    reviewCards: Array.isArray(lesson.review) ? lesson.review : [],
    quality: lesson.quality || {}
  };
}

const STORAGE_KEY = "aiderlog-language-course-v114";

const $ = (selector, parent = root) => parent.querySelector(selector);
const $$ = (selector, parent = root) => [...parent.querySelectorAll(selector)];

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

const saved = loadSaved();
const savedLevels = saved.levelByLanguage && typeof saved.levelByLanguage === "object" ? saved.levelByLanguage : {};
const validLevel = (value) => Number.isInteger(value) && value >= 0 && value < 5 ? value : 0;
const state = {
  language: ["ja", "en", "zh"].includes(saved.language) ? saved.language : "ja",
  levelByLanguage: {
    ja: validLevel(savedLevels.ja),
    en: validLevel(savedLevels.en),
    zh: validLevel(savedLevels.zh)
  },
  categoryIndex: Number.isInteger(saved.categoryIndex) && saved.categoryIndex >= 0 && saved.categoryIndex < 3 ? saved.categoryIndex : 0,
  scenarioIndex: Number.isInteger(saved.scenarioIndex) ? saved.scenarioIndex : 0,
  dayPage: Number.isInteger(saved.dayPage) && saved.dayPage >= 0 ? saved.dayPage : 0,
  progress: saved.progress || {},
  activeDay: null,
  activeScenario: null,
  taskIndex: 0,
  selectedChoices: [],
  answerChecked: false,
  answerCorrect: false,
  builtTokens: [],
  pronunciationScore: null,
  pronunciationResult: null,
  pronunciationAudioUrl: null,
  pronunciationAudioType: "",
  pronunciationRecording: false,
  dialogueTurn: 0,
  dialogueMessages: [],
  dialogueDone: false,
  dialoguePending: false,
  dialogueRequestId: 0,
  reviewMode: false,
  quickReview: false,
  wordFilter: "전체",
  returnScroll: 0
};
curriculum = buildCurriculum(state.language, state.levelByLanguage[state.language]);
state.categoryIndex = Math.min(state.categoryIndex, Math.max(0, curriculum.length - 1));
scenarios = curriculum[state.categoryIndex].topics;

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    language: state.language,
    levelByLanguage: state.levelByLanguage,
    categoryIndex: state.categoryIndex,
    scenarioIndex: state.scenarioIndex,
    dayPage: state.dayPage,
    progress: state.progress,
    updatedAt: Date.now()
  }));
  root.host?.dispatchEvent(new CustomEvent("language-lab-progress", {
    bubbles:true,
    composed:true,
    detail:{
      language:state.language,
      uiLevelIndex:state.levelByLanguage[state.language],
      progress:state.progress,
      levelByLanguage:state.levelByLanguage,
      updatedAt:Date.now()
    }
  }));
}

function lessonProgressKey(day = state.activeDay, scenario = state.activeScenario) {
  const userId = String(root.host?.dataset?.userId || "local");
  return `languageProgress:${userId}:${state.language}:${state.levelByLanguage[state.language]}:${scenario?.id || "unit"}:${day?.id || "lesson"}`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function allDays() {
  return curriculum.flatMap((category) => category.topics.flatMap((scenario) => scenario.days.map((day) => ({ scenario, day }))));
}

function coreDays() {
  const topics = curriculum.find((category) => category.id === "core")?.topics || [];
  return topics.flatMap((scenario) => scenario.days || []);
}

function coreCompletedEntries() {
  const topics = curriculum.find((category) => category.id === "core")?.topics || [];
  return topics.flatMap((scenario) => scenario.days
    .filter((day) => state.progress[day.id]?.completedAt)
    .map((day) => ({ scenario, day, ...state.progress[day.id] })));
}

function completedEntries() {
  return allDays()
    .filter(({ day }) => state.progress[day.id]?.completedAt)
    .map(({ scenario, day }) => ({ scenario, day, ...state.progress[day.id] }))
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

const REVIEW_INTERVALS = [
  { minutes: 20, label: "20분" },
  { days: 1, label: "1일" },
  { days: 3, label: "3일" },
  { days: 7, label: "7일" },
  { days: 14, label: "14일" },
  { days: 30, label: "30일" }
];

function addReviewInterval(timestamp, interval) {
  const date = new Date(timestamp);
  if (interval.minutes) date.setMinutes(date.getMinutes() + interval.minutes);
  if (interval.days) date.setDate(date.getDate() + interval.days);
  return date.toISOString();
}

function reviewDueAt(entry) {
  return new Date(entry.nextReviewAt || entry.completedAt);
}

function reviewQueue() {
  const now = Date.now();
  return completedEntries()
    .filter((entry) => reviewDueAt(entry).getTime() <= now)
    .sort((a, b) => reviewDueAt(a) - reviewDueAt(b));
}

function upcomingReview() {
  const now = Date.now();
  return completedEntries()
    .filter((entry) => reviewDueAt(entry).getTime() > now)
    .sort((a, b) => reviewDueAt(a) - reviewDueAt(b))[0] || null;
}

function formatReviewDate(timestamp) {
  if (!timestamp) return "학습 기록에서 확인";
  const target = new Date(timestamp);
  const delta = target.getTime() - Date.now();
  if (delta > -60000 && delta < 86400000) return `오늘 ${new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(target)}`;
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(target);
}

function isUnlocked(scenario, index) {
  return scenario.optional || scenario.days[index]?.optional || index === 0 || Boolean(state.progress[scenario.days[index - 1].id]?.completedAt);
}

function renderPage() {
  syncLanguageUI();
  renderCourse();
  renderWordbook();
  renderRecords();
}

function openRecordsModal() {
  const modal = $("#records-modal");
  const activeElement = root.activeElement;
  openRecordsModal.returnFocus = activeElement?.closest?.("#lesson-view") ? $("#records-button") : activeElement;
  renderRecords();
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  labShell.classList.add("records-open");
  requestAnimationFrame(() => $("#records-close").focus());
}

function closeRecordsModal() {
  const modal = $("#records-modal");
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  labShell.classList.remove("records-open");
  openRecordsModal.returnFocus?.focus?.();
}

function syncLanguageUI() {
  const profiles = levelProfiles[state.language];
  const levelIndex = state.levelByLanguage[state.language];
  $("#language-select").value = state.language;
  $("#level-select").innerHTML = profiles.map((item, index) => `<option value="${index}">${escapeHtml(item.course)} · ${escapeHtml(item.standard)}</option>`).join("");
  $("#level-select").value = String(levelIndex);
  const profile = profiles[levelIndex];
  const levelGuide = $("#level-guide");
  if (levelGuide) levelGuide.textContent = `${profile.goal} · 도움말 ${profile.showTranslation ? "표시" : "최소화"} · 역할극 선택지 ${profile.suggestionCount}개`;
  $("#completed-days").nextElementSibling.textContent = `/ ${coreDays().length} Lesson`;
}

function closeLesson() {
  const returnToRecords = state.reviewMode;
  stopPronunciationCapture(true);
  clearPronunciationAudio();
  labShell.classList.remove("lesson-active");
  $("#lesson-view").setAttribute("aria-hidden", "true");
  state.activeDay = null;
  state.activeScenario = null;
  state.dialoguePending = false;
  state.dialogueRequestId += 1;
  state.reviewMode = false;
  state.quickReview = false;
  renderPage();
  if (returnToRecords) requestAnimationFrame(openRecordsModal);
  else requestAnimationFrame(() => $("#main-page").scrollTo({ top: state.returnScroll, behavior: "auto" }));
}

function renderCourse() {
  const category = curriculum[state.categoryIndex] || curriculum[0];
  state.categoryIndex = curriculum.indexOf(category);
  scenarios = category.topics;
  const scenario = scenarios[state.scenarioIndex] || scenarios[0];
  state.scenarioIndex = scenarios.indexOf(scenario);
  $("#category-tabs").innerHTML = curriculum.map((item, index) => `<button class="category-tab ${index === state.categoryIndex ? "active" : ""}" data-category="${index}" aria-pressed="${index === state.categoryIndex}" type="button">
    <span>${escapeHtml(item.icon)}</span><span><b>${escapeHtml(item.title)}</b></span>
  </button>`).join("");
  $("#scenario-tabs").innerHTML = scenarios.map((item, index) => {
    const done = item.days.filter((day) => state.progress[day.id]?.completedAt).length;
    const progress = item.days.length ? Math.round(done / item.days.length * 100) : 0;
    const title = String(item.tab || item.title || "").replace(/^\s*\d+\s*[·.:-]\s*/, "");
    return `<button class="scenario-tab ${index === state.scenarioIndex ? "active" : ""}" style="--unit-progress:${progress}%" data-scenario="${index}" aria-label="${escapeHtml(title)} · ${progress}% 완료" aria-pressed="${index === state.scenarioIndex}" type="button">
      <span class="unit-code">${item.unit ? `U${item.unitNumber || index + 1}` : escapeHtml(item.icon)}</span><span class="tab-copy"><b>${escapeHtml(title)}</b></span>
    </button>`;
  }).join("");

  const complete = scenario.days.filter((day) => state.progress[day.id]?.completedAt).length;
  const totalPages = Math.max(1, Math.ceil(scenario.days.length / DAY_PAGE_SIZE));
  state.dayPage = Math.max(0, Math.min(totalPages - 1, state.dayPage));
  const pageStart = state.dayPage * DAY_PAGE_SIZE;
  const pageEnd = Math.min(scenario.days.length, pageStart + DAY_PAGE_SIZE);
  $("#scenario-number").textContent = String(state.scenarioIndex + 1).padStart(2, "0");
  $("#scenario-place").textContent = scenario.place || category.title;
  $("#scenario-title").textContent = scenario.title;
  const scenarioDescription = $("#scenario-description");
  if (scenarioDescription) scenarioDescription.textContent = scenario.description || "";
  $("#scenario-progress-label").textContent = `${complete} / ${scenario.days.length} Lesson`;
  $("#scenario-progress").style.width = `${(complete / scenario.days.length) * 100}%`;
  const pageLead = scenario.days[pageStart];
  $("#day-list-subtitle").textContent = `${pageLead?.weekLabel || scenario.tab} · Lesson ${pageStart + 1}–${pageEnd}`;
  $("#day-page-controls").innerHTML = totalPages === 1 ? "" : Array.from({ length: totalPages }, (_, index) => {
    const start = index * DAY_PAGE_SIZE + 1;
    const end = Math.min(scenario.days.length, start + DAY_PAGE_SIZE - 1);
    const week = scenario.days[index * DAY_PAGE_SIZE]?.weekLabel || `${start}–${end}`;
    const label = `${week} · Lesson ${start}–${end}`;
    return `<button class="day-page-button ${index === state.dayPage ? "active" : ""}" data-day-page="${index}" type="button" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}" aria-pressed="${index === state.dayPage}">${start}–${end}</button>`;
  }).join("");

  $("#day-list").innerHTML = scenario.days.slice(pageStart, pageEnd).map((day, pageIndex) => {
    const index = pageStart + pageIndex;
    const record = state.progress[day.id];
    const unlocked = isUnlocked(scenario, index);
    const status = record?.completedAt ? "반복" : unlocked ? "시작" : "잠김";
    const buttonClass = record?.completedAt ? "done" : unlocked && index === complete ? "current" : "";
    return `<li class="day-row">
      <span class="day-index"><b>Lesson ${index + 1}</b><button class="day-action ${buttonClass}" data-day="${index}" type="button" ${unlocked ? "" : "disabled"}>${status}</button></span>
      <div class="day-info"><b>${escapeHtml(day.title)}</b><p>${escapeHtml(day.focus)}</p></div>
    </li>`;
  }).join("");
  renderGlobalStats();
}

function localDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function progressLanguage(dayId, record) {
  if (languageMeta[record?.language]) return record.language;
  const prefix = String(dayId || "").split("-")[0];
  return languageMeta[prefix] ? prefix : "ja";
}

function renderRecentStudy() {
  const target = $("#recent-study-days");
  if (!target) return;
  const activity = new Map();
  Object.entries(state.progress || {}).forEach(([dayId, record]) => {
    if (!record?.completedAt) return;
    const language = progressLanguage(dayId, record);
    [record.completedAt, record.lastReviewedAt, ...(record.reviewHistory || [])].filter(Boolean).forEach((timestamp) => {
      const key = localDateKey(timestamp);
      if (!key) return;
      if (!activity.has(key)) activity.set(key, new Set());
      activity.get(key).add(language);
    });
  });
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - index));
    return date;
  });
  target.innerHTML = days.map((date) => {
    const key = localDateKey(date);
    const languages = [...(activity.get(key) || [])];
    const labels = languages.map((language) => `<span>${escapeHtml(languageMeta[language]?.label || language)}</span>`).join("");
    const isToday = key === localDateKey(today);
    return `<article class="recent-study-day ${languages.length ? "active" : ""} ${isToday ? "today" : ""}" title="${date.toLocaleDateString("ko-KR")}${languages.length ? ` · ${languages.map((language) => languageMeta[language]?.label || language).join(", ")}` : " · 학습 없음"}">
      <time datetime="${key}"><b>${date.getMonth() + 1}.${date.getDate()}</b><small>${["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}</small></time>
      <div>${labels || "<i>—</i>"}</div>
    </article>`;
  }).join("");
}

function renderGlobalStats() {
  const complete = completedEntries();
  $("#streak-count").textContent = String(calculateStreak(complete));
  const queueCount = Math.min(5, reviewQueue().length);
  $("#review-badge").textContent = String(queueCount);
  $("#review-badge").hidden = queueCount === 0;
  renderRecentStudy();
}

function calculateStreak(entries) {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.flatMap((entry) => [entry.completedAt, ...(entry.reviewHistory || [])]).map((date) => new Date(date).toISOString().slice(0, 10)))].sort().reverse();
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  const latest = new Date(`${dates[0]}T00:00:00Z`);
  const gap = Math.round((cursor - latest) / 86400000);
  if (gap > 1) return 0;
  let streak = 0;
  let expected = new Date(latest);
  for (const date of dates) {
    if (date === expected.toISOString().slice(0, 10)) {
      streak += 1;
      expected.setUTCDate(expected.getUTCDate() - 1);
    }
  }
  return streak;
}

function openLesson(scenario, day, dayIndex, reviewMode = false, quickReview = false) {
  stopPronunciationCapture(true);
  clearPronunciationAudio();
  state.reviewMode = reviewMode;
  state.quickReview = reviewMode && quickReview;
  state.activeScenario = scenario;
  state.activeDay = day;
  state.returnScroll = $("#main-page").scrollTop;
  state.taskIndex = state.quickReview ? 1 : 0;
  state.selectedChoices = [];
  state.answerChecked = false;
  state.answerCorrect = false;
  state.builtTokens = [];
  state.pronunciationScore = null;
  state.pronunciationResult = null;
  state.pronunciationRecording = false;
  state.dialogueTurn = 0;
  state.dialogueMessages = [{ role: "ai", ja: day.opening, ko: day.openingKo }];
  state.dialogueDone = false;
  state.dialoguePending = false;
  state.dialogueRequestId += 1;
  const profile = levelProfiles[state.language][state.levelByLanguage[state.language]];
  $("#lesson-path").textContent = reviewMode
    ? `${state.quickReview ? "2분 빠른 회상" : "간격 복습"} › ${scenario.tab} › Lesson ${dayIndex + 1}`
    : `${profile.name} ${day.internalBand || ""} · ${profile.standard} › ${scenario.tab} › Lesson ${dayIndex + 1}`;
  $("#lesson-title").textContent = day.title;
  $("#lesson-view").setAttribute("aria-hidden", "false");
  labShell.classList.add("lesson-active");
  renderTask();
  $(".lesson-stage").scrollTop = 0;
}

function startLesson(dayIndex) {
  const scenario = scenarios[state.scenarioIndex];
  const day = scenario.days[dayIndex];
  if (!day || !isUnlocked(scenario, dayIndex)) return;
  openLesson(scenario, day, dayIndex, Boolean(state.progress[day.id]?.completedAt));
}

function startReview() {
  const entry = reviewQueue()[0];
  if (!entry) return;
  const dayIndex = entry.scenario.days.findIndex((day) => day.id === entry.day.id);
  closeRecordsModal();
  openLesson(entry.scenario, entry.day, dayIndex, true, (entry.reviewCount || 0) === 0);
}

function resetTaskState() {
  state.selectedChoices = [];
  state.answerChecked = false;
  state.answerCorrect = false;
  state.builtTokens = [];
}

function taskHeader(label, title, help) {
  return `<span class="task-tag">${label}</span><h2 class="task-title">${title}</h2>${help ? `<p class="task-help">${help}</p>` : ""}`;
}

function renderLessonBrief(day) {
  const coach = day.coach;
  if (!coach) return "";
  return `<section class="lesson-coach-card" aria-label="오늘의 학습 설계">
    <header><span>CAN-DO</span><b>${escapeHtml(coach.canDo)}</b><em>${escapeHtml(coach.stage)}</em></header>
    <div><article><small>실제 장면</small><p>${escapeHtml(coach.scene)}</p></article><article><small>말투 전략</small><p>${escapeHtml(coach.register)}</p></article></div>
  </section>`;
}

function renderScriptGuide(day, profile, meta) {
  if (!profile.showReading || !day.scriptGuide) return "";
  return `<section class="script-guide-card" aria-label="문자와 발음 읽기 도움">
    <header><span>${escapeHtml(day.scriptGuide.label)}</span><b>${escapeHtml(day.internalBand || profile.name)}</b></header>
    <p lang="${meta.htmlLang}">${escapeHtml(day.scriptGuide.reading)}</p>
    <small>${escapeHtml(day.scriptGuide.romanization)}</small>
  </section>`;
}

function pronunciationButtons(text, language) {
  const variants = {
    en: [
      { label: "미국식", locale: "en-US" },
      { label: "영국식", locale: "en-GB" },
      { label: "호주식", locale: "en-AU" }
    ],
    ja: [{ label: "일본 표준어", locale: "ja-JP" }],
    zh: [
      { label: "중국식", locale: "zh-CN" },
      { label: "대만식", locale: "zh-TW" }
    ]
  }[language];
  return `<div class="accent-audio-group" aria-label="발음 종류 선택">${variants.map((variant) => `<button data-speak="${escapeHtml(text)}" data-speak-locale="${variant.locale}" type="button" aria-label="${variant.label} 발음 듣기"><span aria-hidden="true">▶</span>${variant.label}</button>`).join("")}</div>`;
}

function renderFormulaExample(example, htmlLang) {
  const sentence = String(example.sentence);
  const highlight = String(example.highlight || "");
  const index = highlight ? sentence.indexOf(highlight) : -1;
  if (index < 0) return `<span lang="${htmlLang}">${escapeHtml(sentence)}</span>`;
  return `<span lang="${htmlLang}">${escapeHtml(sentence.slice(0, index))}<b>${escapeHtml(highlight)}</b>${escapeHtml(sentence.slice(index + highlight.length))}</span>`;
}

function renderTask() {
  const day = state.activeDay;
  if (!day) return;
  const meta = languageMeta[state.language];
  const profile = levelProfiles[state.language][state.levelByLanguage[state.language]];
  const body = $("#lesson-body");
  const action = $("#lesson-action");
  const pass = $("#lesson-pass");
  const prev = $("#lesson-prev");
  const quickStep = state.quickReview ? Math.max(0, [1, 2].indexOf(state.taskIndex)) : state.taskIndex;
  const taskTotal = state.quickReview ? 2 : 4;
  $("#lesson-count").textContent = state.taskIndex < 4 ? `${quickStep + 1} / ${taskTotal}` : "완료";
  $("#lesson-progress").style.width = `${Math.min(100, ((quickStep + 1) / taskTotal) * 100)}%`;
  prev.hidden = false;
  pass.hidden = false;
  action.disabled = false;

  if (state.taskIndex === 0) {
    const quiz = day.quiz;
    const feedback = state.answerChecked
      ? `<div class="feedback-box step-one-feedback ${state.answerCorrect ? "" : "wrong"}">
          <span class="answer-mark ${state.answerCorrect ? "correct" : "wrong"}" aria-label="${state.answerCorrect ? "정답" : "오답"}">${state.answerCorrect ? "O" : "X"}</span>
          <section class="meaning-explanation"><small>문장 뜻과 쓰임</small><strong>${escapeHtml(quiz.sentenceMeaning)}</strong><p>${escapeHtml(quiz.explanation)}</p></section>
          <section class="politeness-section"><small>공손함의 정도</small><div class="politeness-labels"><span>지인 ◀</span><span>▶ 타인</span></div><div class="politeness-track" style="--politeness:${quiz.politeness}%"><i></i></div></section>
          <section class="expression-expansion"><small>표현 연결망 · 같은 의도 안에서만 연결</small><ul>${quiz.alternatives.map((item) => `<li><b lang="${meta.htmlLang}">${escapeHtml(item.form)}</b><span>→ ${escapeHtml(item.note)}</span></li>`).join("")}</ul></section>
        </div>`
      : "";
    const vocabulary = day.vocabulary ? `<details class="vocabulary-pack"><summary>오늘의 단어·콜로케이션 20개 보기 <b>20</b></summary><div>${day.vocabulary.map((item, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><p><strong lang="${meta.htmlLang}">${escapeHtml(item.term)}</strong><small>${escapeHtml(item.meaning)}</small></p><button data-speak="${escapeHtml(item.term)}" type="button" aria-label="${escapeHtml(item.term)} 발음 듣기">▶</button></article>`).join("")}</div></details>` : "";
    const choices = state.answerChecked ? "" : `<div class="choice-grid multi-choice">${quiz.options.map((option, index) => {
        const selected = state.selectedChoices.includes(index);
        return `<button class="choice-button ${selected ? "selected" : ""}" data-choice="${index}" type="button"><span class="choice-check">${selected ? "✓" : ""}</span>${escapeHtml(option.text)}</button>`;
      }).join("")}</div>`;
    body.innerHTML = `${taskHeader("STEP 1 · 소리·문자·의미", "장면과 말의 기능을 먼저 구별하세요", "억지 문법 정오 문제가 아니라 실제 상황에서 이 표현이 어떤 역할을 하는지 확인합니다.")}
      ${renderLessonBrief(day)}${vocabulary}<div class="question-panel"><div class="sentence-with-audio"><p class="japanese-question" lang="${meta.htmlLang}">${escapeHtml(day.studySentence || day.phrase)}</p>${pronunciationButtons(day.studySentence || day.phrase, state.language)}</div>${renderScriptGuide(day, profile, meta)}</div>
      <p class="quiz-prompt">${escapeHtml(quiz.prompt)}</p>
      ${choices}${feedback}`;
    action.textContent = state.answerChecked ? (state.answerCorrect ? "다음" : "다시 선택") : "정답 확인";
    action.disabled = state.selectedChoices.length === 0;
  } else if (state.taskIndex === 1) {
    const answer = state.builtTokens.map((index) => day.pool[index]).join("|");
    const correct = day.tokens.join("|");
    const formula = day.conversationFormula;
    const feedback = state.answerChecked
      ? `<div class="feedback-box step-two-feedback ${answer === correct ? "" : "wrong"}">
          <span class="answer-mark ${answer === correct ? "correct" : "wrong"}" aria-label="${answer === correct ? "정답" : "오답"}">${answer === correct ? "O" : "X"}</span>
          <section class="conversation-formula"><small>오늘 문장과 직접 연결된 패턴 · ${escapeHtml(day.internalBand || profile.name)}</small><strong lang="${meta.htmlLang}">${escapeHtml(formula.formula)}</strong><p>${escapeHtml(formula.levelTip)}</p><ul>${formula.examples.map((example) => `<li>${renderFormulaExample(example, meta.htmlLang)}</li>`).join("")}</ul></section>
          <section class="native-variations"><small>배운 문장의 실제 회화 변형</small><div>${formula.nativeVariants.map((sentence) => `<blockquote lang="${meta.htmlLang}">${escapeHtml(sentence)}</blockquote>`).join("")}</div></section>
          <section class="conversation-chunks"><small>자주 쓰는 CHUNK</small><div>${formula.chunks.map((chunk) => `<article><b lang="${meta.htmlLang}">${escapeHtml(chunk.text)}</b><span>${escapeHtml(chunk.note)}</span></article>`).join("")}</div></section>
          <section class="coach-note-grid"><article><small>자주 하는 실수</small><p>${escapeHtml(day.coach.commonMistake)}</p></article><article><small>전이 과제</small><p>${escapeHtml(day.coach.transfer)}</p></article></section>
        </div>`
      : "";
    const tokenPool = state.answerChecked ? "" : `<div class="token-pool">${day.pool.map((token, index) => `<button class="token-button" data-token="${index}" type="button" ${state.builtTokens.includes(index) || state.builtTokens.length >= day.tokens.length ? "disabled" : ""} lang="${meta.htmlLang}">${escapeHtml(token)}</button>`).join("")}</div>`;
    body.innerHTML = `${taskHeader("STEP 2 · 회상과 응답 패턴", "보지 않고 의미 덩어리를 다시 조립하세요", "같은 의도를 유지하면서 조건을 바꾸고 상대 응답에 이어 말합니다.")}
      <div class="sentence-board">${state.builtTokens.map((index, position) => `<button class="token-button" data-built="${position}" type="button" lang="${meta.htmlLang}">${escapeHtml(day.pool[index])}</button>`).join("")}</div>
      ${tokenPool}${feedback}`;
    state.answerCorrect = state.answerChecked && answer === correct;
    action.textContent = state.answerChecked ? (state.answerCorrect ? "다음" : "다시 배열") : "정답 확인";
    action.disabled = state.builtTokens.length !== day.tokens.length;
  } else if (state.taskIndex === 2) {
    const flow = day.pronunciationFlow?.turns || [];
    const ownAudio = state.pronunciationAudioUrl ? `<div class="own-pronunciation"><small>내 발음 녹음</small><audio controls preload="metadata" src="${escapeHtml(state.pronunciationAudioUrl)}">내 발음 재생을 지원하지 않는 브라우저입니다.</audio></div>` : "";
    const result = state.pronunciationResult ? `<div class="pronunciation-result">
      <div class="pronunciation-result-summary"><span class="score-badge"><b>${state.pronunciationResult.score ?? "—"}</b><small>${state.pronunciationResult.score === null ? "지원 안 됨" : "점"}</small></span>
      <div><small>인식된 문장</small><p lang="${meta.htmlLang}">${escapeHtml(state.pronunciationResult.text)}</p><b>${escapeHtml(state.pronunciationResult.message)}</b><div class="pronunciation-result-actions">${state.pronunciationResult.retryable ? '<button class="retry-recognition" data-retry-recognition type="button">다시 시도</button>' : ""}</div></div></div>
      ${ownAudio}
      <section class="pronunciation-flow"><div class="pronunciation-flow-heading"><div><small>다음에 이어 말하기</small><strong>한 문장이 아닌 대화 흐름으로 익혀보세요</strong></div><span>${escapeHtml(profile.name)} · 3문장</span></div>
      <ol><li class="current"><span>START</span><div><b lang="${meta.htmlLang}">${escapeHtml(day.phrase)}</b><small>오늘 연습한 문장</small></div><button data-speak="${escapeHtml(day.phrase)}" data-speak-rate="${profile.speechRate}" type="button" aria-label="오늘 문장 듣기">▶</button></li>${flow.map((turn, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><div><small>${escapeHtml(turn.label)}</small><b lang="${meta.htmlLang}">${escapeHtml(turn.text)}</b><em>${escapeHtml(turn.note)}</em></div><button data-speak="${escapeHtml(turn.text)}" data-speak-rate="${profile.speechRate}" type="button" aria-label="${escapeHtml(turn.label)} 듣기">▶</button></li>`).join("")}</ol></section>
    </div>` : "";
    body.innerHTML = `${taskHeader("STEP 3 · 듣기·회상·말하기", "기기 음성을 듣고 힌트 없이 다시 말해보세요", `마이크를 누른 뒤 ${meta.label}로 말하면 기기의 문장 인식 일치도를 확인할 수 있어요.`)}
      <div class="sound-coach"><span>발음 코치</span><p>${escapeHtml(day.coach.pronunciation)}</p></div>
      <div class="pronunciation-card"><span class="reading">오늘의 문장 · 목표 ${profile.passScore}점</span><strong class="target-sentence" lang="${meta.htmlLang}">${day.phrase}</strong><span class="translation ${profile.showTranslation || state.pronunciationResult ? "" : "translation-hidden"}">${profile.showTranslation || state.pronunciationResult ? escapeHtml(day.translation) : "번역 없이 의미와 뉘앙스를 파악해 보세요."}</span>
      <div class="listen-speed-row"><button data-speak="${escapeHtml(day.phrase)}" data-speak-rate="0.62" type="button">느리게 듣기</button><button class="listen-large" data-speak="${escapeHtml(day.phrase)}" data-speak-rate="${profile.speechRate}" type="button">▶ 기기 ${meta.label} 음성</button><button data-speak="${escapeHtml(day.phrase)}" data-speak-rate="1.05" type="button">빠르게 듣기</button></div>
      <button class="record-control ${state.pronunciationRecording ? "listening" : ""}" id="record-control" type="button" aria-label="${state.pronunciationRecording ? "발음 녹음 종료" : "발음 녹음 시작"}">${state.pronunciationRecording ? "■" : "●"}</button><p class="record-caption">${state.pronunciationRecording ? "녹음 중이에요 · 마이크를 다시 누르면 종료됩니다" : "마이크를 눌러 발음을 녹음하고 확인하세요"}</p>${result}</div>`;
    action.textContent = state.pronunciationRecording ? "녹음 중" : "다음";
    action.disabled = state.pronunciationRecording;
  } else if (state.taskIndex === 3) {
    renderRoleplay();
    action.textContent = state.dialogueDone ? (state.reviewMode ? "복습 완료" : "Lesson 완료") : "대화를 마쳐주세요";
    action.disabled = !state.dialogueDone;
  } else {
    const completeLabel = state.quickReview ? "QUICK RECALL COMPLETE" : state.reviewMode ? "REVIEW COMPLETE" : "LESSON COMPLETE";
    const completeTitle = state.quickReview ? "2분 회상을 마쳤어요" : state.reviewMode ? "복습을 마쳤어요" : "오늘 학습을 마쳤어요";
    const completeMessage = state.quickReview ? "핵심 문장을 다시 만들고 소리 내어 회상한 기록을 저장했습니다." : state.reviewMode ? "복습 횟수와 문장 인식 일치도를 학습 기록에 저장했습니다." : "배운 표현과 학습 기록을 저장했습니다.";
    const record = state.progress[day.id] || {};
    const savedMessage = `다음 간격 복습은 ${formatReviewDate(record.nextReviewAt)}에 준비됩니다.`;
    body.innerHTML = `${taskHeader(completeLabel, completeTitle, completeMessage)}
      <div class="lesson-complete"><span class="complete-mark">✓</span><h2>${state.quickReview ? "빠른 회상 완료!" : state.reviewMode ? "복습 완료!" : "Lesson 완료!"}</h2><p>${escapeHtml(day.title)} · ${state.quickReview ? "약 2분 회상" : "약 10분 학습"}</p>
      <div class="complete-summary"><div><small>학습 단계</small><b>${state.quickReview ? "2 / 2" : "4 / 4"}</b></div><div><small>문장 인식 일치도</small><b>${state.pronunciationScore ?? "—"}%</b></div><div><small>기억 단계</small><b>${escapeHtml(record.mastery || "형성 중")}</b></div></div>
      <div class="mastery-checklist">${day.coach.rubric.map((item) => `<span>✓ ${escapeHtml(item)}</span>`).join("")}</div>
      <div class="saved-note">${savedMessage}</div>
      ${state.reviewMode ? "" : '<button class="immediate-review-button" data-immediate-review type="button">지금 2분 회상하기</button>'}</div>`;
    $("#lesson-count").textContent = "완료";
    $("#lesson-progress").style.width = "100%";
    prev.hidden = true;
    pass.hidden = true;
    action.textContent = state.reviewMode ? "학습 기록으로" : "Lesson 목록으로";
    action.disabled = false;
  }
}

function getDialogueTurns() {
  return state.activeDay?.dialogueTurns || [];
}

function renderRoleplay() {
  const body = $("#lesson-body");
  const meta = languageMeta[state.language];
  const profile = levelProfiles[state.language][state.levelByLanguage[state.language]];
  const turns = getDialogueTurns();
  const current = turns[Math.min(state.dialogueTurn, turns.length - 1)];
  const usedReplies = new Set(state.dialogueMessages.filter((message) => message.role === "user").map((message) => normalizeSpeech(message.ja)));
  const visibleSuggestions = state.dialoguePending ? [] : current.suggestions.filter((suggestion, index, all) => {
    const normalized = normalizeSpeech(suggestion);
    return normalized && !usedReplies.has(normalized) && all.findIndex((item) => normalizeSpeech(item) === normalized) === index;
  }).slice(0, profile.suggestionCount);
  body.innerHTML = `${taskHeader("STEP 4 · 실전 시나리오", "도움말을 줄여가며 대화를 완성하세요", "세 번의 턴에서 핵심 표현, 세부 조건, 다음 행동을 모두 사용합니다.")}
    <div class="roleplay-shell">
      <div class="roleplay-scene"><div><b>${escapeHtml(state.activeScenario.title)}</b><small>AI 역할 · ${escapeHtml(state.activeDay.dialogueRole || "대화 상대")}</small><em>${escapeHtml(state.activeDay.dialogueGoal || state.activeScenario.place)}</em></div><span class="ai-label">AI ROLEPLAY · ${Math.min(state.dialogueTurn + 1, turns.length)} / ${turns.length}</span></div>
      <div class="roleplay-rubric" aria-label="오늘의 성공 기준">${state.activeDay.coach.rubric.map((item) => `<span>✓ ${escapeHtml(item)}</span>`).join("")}</div>
      <div class="chat-messages" id="chat-messages">${state.dialogueMessages.map((message) => `<div class="chat-message ${message.role}"><div class="chat-message-row"><span class="bubble" lang="${meta.htmlLang}">${escapeHtml(message.ja)}</span><button class="chat-audio" data-speak="${escapeHtml(message.ja)}" type="button" aria-label="${message.role === "ai" ? "AI 문장" : "내 문장"} 발음 듣기">▶</button></div>${profile.showDialogueKo && message.ko ? `<small>${escapeHtml(message.ko)}</small>` : ""}</div>`).join("")}</div>
      ${state.dialogueDone ? '<div class="roleplay-complete">대화를 끝까지 마쳤습니다. 아래 ‘Lesson 완료’를 눌러 기록하세요.</div>' : `<div class="roleplay-turn-guide"><small>이번 턴 목표</small><b>${escapeHtml(current.intent)}</b></div>${state.dialoguePending ? '<div class="roleplay-thinking"><i></i> 대화 상대가 답변하고 있어요</div>' : visibleSuggestions.length ? `<div class="roleplay-suggestions">${visibleSuggestions.map((suggestion) => `<div class="roleplay-suggestion"><button class="suggestion-reply" data-reply="${escapeHtml(suggestion)}" type="button" lang="${meta.htmlLang}">${escapeHtml(suggestion)}</button><button class="suggestion-audio" data-speak="${escapeHtml(suggestion)}" type="button" aria-label="추천 답변 발음 듣기">▶</button></div>`).join("")}</div>` : '<div class="roleplay-challenge">이번 턴 목표에 맞춰 직접 문장을 만들어보세요.</div>'}
      <form class="chat-form" id="chat-form"><input id="chat-input" aria-label="${meta.label} 답변" autocomplete="off" placeholder="${meta.label}로 답해보세요" ${state.dialoguePending ? "disabled" : ""} /><button type="submit" ${state.dialoguePending ? "disabled" : ""}>${state.dialoguePending ? "응답 중" : "보내기"}</button></form>`}
    </div>`;
  requestAnimationFrame(() => {
    const messages = $("#chat-messages");
    if (messages) messages.scrollTop = messages.scrollHeight;
  });
}

function handleLessonAction() {
  if (state.taskIndex === 0) {
    if (state.answerChecked) {
      if (state.answerCorrect) advanceTask();
      else {
        state.selectedChoices = [];
        state.answerChecked = false;
        renderTask();
      }
      return;
    }
    const correct = state.activeDay.quiz.correctIndices;
    const selected = [...state.selectedChoices].sort((a, b) => a - b);
    state.answerCorrect = selected.length === correct.length && selected.every((value, index) => value === correct[index]);
    state.answerChecked = true;
    renderTask();
    return;
  }
  if (state.taskIndex === 1) {
    if (state.answerChecked) {
      if (state.answerCorrect) advanceTask();
      else {
        state.builtTokens = [];
        state.answerChecked = false;
        renderTask();
      }
      return;
    }
    state.answerChecked = true;
    renderTask();
    return;
  }
  if (state.taskIndex === 2) {
    if (state.quickReview) {
      completeLesson();
      return;
    }
    advanceTask();
    return;
  }
  if (state.taskIndex === 3 && state.dialogueDone) {
    completeLesson();
    return;
  }
  if (state.taskIndex === 4) closeLesson();
}

function advanceTask() {
  if (state.quickReview && state.taskIndex === 1) {
    state.taskIndex = 2;
    resetTaskState();
    renderTask();
    return;
  }
  if (state.taskIndex < 3) {
    state.taskIndex += 1;
    resetTaskState();
    renderTask();
  }
}

function goPreviousTask() {
  if (state.quickReview && state.taskIndex === 1) {
    closeLesson();
    return;
  }
  if (state.quickReview && state.taskIndex === 2) {
    state.taskIndex = 1;
    resetTaskState();
    renderTask();
    return;
  }
  if (state.taskIndex === 0) {
    closeLesson();
    return;
  }
  if (state.taskIndex === 3) {
    state.dialoguePending = false;
    state.dialogueRequestId += 1;
  }
  state.taskIndex -= 1;
  resetTaskState();
  renderTask();
}

function skipTask() {
  if (state.quickReview && state.taskIndex === 2) {
    completeLesson();
    return;
  }
  if (state.taskIndex < 3) {
    advanceTask();
  } else if (state.taskIndex === 3) {
    state.dialoguePending = false;
    state.dialogueRequestId += 1;
    state.dialogueDone = true;
    renderTask();
  }
  showToast("이 단계는 건너뛰었어요.");
}

function completeLesson() {
  const existing = state.progress[state.activeDay.id];
  const now = new Date().toISOString();
  const isReview = state.reviewMode || Boolean(existing?.completedAt);
  const nextReviewCount = isReview ? (existing?.reviewCount || 0) + 1 : (existing?.reviewCount || 0);
  const intervalIndex = Math.min(nextReviewCount, REVIEW_INTERVALS.length - 1);
  const passScore = levelProfiles[state.language][state.levelByLanguage[state.language]].passScore;
  const score = Number.isFinite(state.pronunciationScore) ? state.pronunciationScore : (existing?.pronunciationScore ?? null);
  const mastery = nextReviewCount >= 3 ? "장기 기억" : Number.isFinite(score) && score >= passScore ? "안정" : "형성 중";
  state.progress[state.activeDay.id] = {
    ...existing,
    language: state.language,
    completedAt: existing?.completedAt || now,
    pronunciationScore: score,
    attempts: (existing?.attempts || 0) + 1,
    mastery,
    nextReviewAt: addReviewInterval(now, REVIEW_INTERVALS[intervalIndex]),
    reviewCards: state.activeDay.reviewCards || existing?.reviewCards || [],
    nativeSpeakerReviewed: state.activeDay.quality?.nativeSpeakerReviewed === true,
    ...(isReview ? {
      lastReviewedAt: now,
      reviewCount: nextReviewCount,
      reviewHistory: [...(existing?.reviewHistory || []), now].slice(-50)
    } : {})
  };
  localStorage.setItem(lessonProgressKey(), JSON.stringify(state.progress[state.activeDay.id]));
  persist();
  state.taskIndex = 4;
  renderTask();
  renderGlobalStats();
  renderWordbook();
  renderRecords();
  root.host.dispatchEvent(new CustomEvent("language-lab-complete", {
    bubbles: true,
    composed: true,
    detail: {
      language: languageMeta[state.language].label,
      title: state.activeDay.title,
      dayId: state.activeDay.id,
      score: state.pronunciationScore,
      completedAt: now
    }
  }));
  showToast(state.reviewMode ? "복습 기록을 저장했습니다." : "Lesson을 완료했습니다.");
}

function submitRoleplay(value) {
  const text = value.trim();
  if (!text || state.dialogueDone || state.dialoguePending) return;
  const turns = getDialogueTurns();
  const currentIndex = state.dialogueTurn;
  const turn = turns[currentIndex];
  const normalized = normalizeSpeech(text);
  const previousUser = [...state.dialogueMessages].reverse().find((message) => message.role === "user");
  const recovery = {
    en: {
      duplicate: ["Try a different answer so we can keep the conversation moving.", "대화를 이어갈 수 있도록 다른 답변을 사용해 보세요."],
      short: ["Could you answer in a full sentence? You can use the turn goal as a guide.", "이번 턴 목표를 참고해 완전한 문장으로 답해 보세요."]
    },
    ja: {
      duplicate: ["会話を続けるために、別の答えを使ってみてください。", "대화를 이어갈 수 있도록 다른 답변을 사용해 보세요."],
      short: ["今回の目標を参考に、文で答えてみてください。", "이번 턴 목표를 참고해 문장으로 답해 보세요."]
    },
    zh: {
      duplicate: ["为了继续对话，请换一种说法。", "대화를 이어갈 수 있도록 다른 답변을 사용해 보세요."],
      short: ["请参考本轮目标，用完整的句子回答。", "이번 턴 목표를 참고해 완전한 문장으로 답해 보세요."]
    }
  }[state.language];
  const isDuplicate = previousUser && normalizeSpeech(previousUser.ja) === normalized;
  const isTooShort = state.language === "en" ? text.split(/\s+/).filter(Boolean).length < 2 : normalized.length < 3;
  if (isDuplicate || isTooShort) {
    const message = isDuplicate ? recovery.duplicate : recovery.short;
    state.dialogueMessages.push({ role: "ai", ja: message[0], ko: message[1] });
    renderRoleplay();
    return;
  }
  state.dialogueMessages.push({ role: "user", ja: text, ko: "" });
  state.dialoguePending = true;
  const requestId = ++state.dialogueRequestId;
  renderRoleplay();
  setTimeout(() => {
    if (!state.activeDay || state.taskIndex !== 3 || state.dialogueTurn !== currentIndex || state.dialogueRequestId !== requestId) return;
    state.dialogueMessages.push({ role: "ai", ja: turn.reply, ko: turn.replyKo });
    state.dialoguePending = false;
    if (currentIndex >= turns.length - 1) state.dialogueDone = true;
    else state.dialogueTurn = currentIndex + 1;
    renderTask();
  }, 420);
}

function speak(text, rateOverride, localeOverride) {
  if (!("speechSynthesis" in window)) {
    showToast("이 브라우저에서는 음성 재생을 지원하지 않아요.");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const requestedLocale = localeOverride || languageMeta[state.language].speech;
  utterance.lang = requestedLocale;
  const voices = speechSynthesis.getVoices();
  const exactVoice = voices.find((voice) => voice.lang.toLowerCase() === requestedLocale.toLowerCase());
  const regionalVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(requestedLocale.toLowerCase().split("-")[0]));
  const accentHints = {
    "en-US": /united states|american|us english/i,
    "en-GB": /united kingdom|british|uk english/i,
    "en-AU": /australia|australian/i
  };
  const namedAccentVoice = accentHints[requestedLocale] ? voices.find((voice) => accentHints[requestedLocale].test(voice.name)) : null;
  const selectedVoice = exactVoice || namedAccentVoice || (localeOverride ? null : regionalVoice);
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = Number.isFinite(rateOverride) ? rateOverride : levelProfiles[state.language][state.levelByLanguage[state.language]].speechRate;
  speechSynthesis.speak(utterance);
}

let activePronunciationSession = null;

function clearPronunciationAudio() {
  if (state.pronunciationAudioUrl) URL.revokeObjectURL(state.pronunciationAudioUrl);
  state.pronunciationAudioUrl = null;
  state.pronunciationAudioType = "";
}

function completePronunciationCapture(session) {
  if (session.completed) return;
  session.completed = true;
  clearTimeout(session.timeout);
  session.stream?.getTracks().forEach((track) => track.stop());
  if (activePronunciationSession === session) activePronunciationSession = null;
  state.pronunciationRecording = false;
  if (!session.discard && session.chunks.length) {
    clearPronunciationAudio();
    const blob = new Blob(session.chunks, { type: session.recorder?.mimeType || "audio/webm" });
    state.pronunciationAudioUrl = URL.createObjectURL(blob);
    state.pronunciationAudioType = blob.type;
  }
  if (!session.discard && !state.pronunciationResult) {
    state.pronunciationResult = {
      score: null,
      text: "녹음을 완료했어요.",
      message: session.recognitionSupported ? "인식 결과가 없어요. 내 발음을 듣고 다시 시도해 보세요." : "이 브라우저에서는 점수를 낼 수 없지만 내 발음을 다시 들을 수 있어요.",
      retryable: true
    };
  }
  if (!session.discard && state.activeDay && state.taskIndex === 2) renderTask();
}

function finishPronunciationCapture(session) {
  if (!session || session.finishing) return;
  session.finishing = true;
  clearTimeout(session.timeout);
  if (session.recorder && session.recorder.state !== "inactive") {
    try {
      session.recorder.stop();
      return;
    } catch {}
  }
  completePronunciationCapture(session);
}

function stopPronunciationCapture(discard = false) {
  const session = activePronunciationSession;
  if (!session) return;
  session.discard = session.discard || discard;
  if (discard) {
    try { session.recognition?.abort(); } catch {}
    session.recognitionEnded = true;
    finishPronunciationCapture(session);
    return;
  }
  if (session.recognition && !session.recognitionEnded && !session.stopRequested) {
    session.stopRequested = true;
    clearTimeout(session.timeout);
    try {
      session.recognition.stop();
      session.timeout = setTimeout(() => finishPronunciationCapture(session), 800);
      return;
    } catch {}
  }
  finishPronunciationCapture(session);
}

function normalizeSpeech(text) {
  return text.replace(/[\s。、！？?!.,]/g, "").replace(/[一１]/g, "一").toLowerCase();
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);
  for (let column = 0; column <= a.length; column += 1) matrix[0][column] = column;
  for (let row = 1; row <= b.length; row += 1) {
    for (let column = 1; column <= a.length; column += 1) {
      matrix[row][column] = b[row - 1] === a[column - 1]
        ? matrix[row - 1][column - 1]
        : Math.min(matrix[row - 1][column - 1], matrix[row][column - 1], matrix[row - 1][column]) + 1;
    }
  }
  return matrix[b.length][a.length];
}

function pronunciationScore(target, recognized) {
  const a = normalizeSpeech(target);
  const b = normalizeSpeech(recognized);
  if (!a || !b) return 0;
  return Math.max(0, Math.round((1 - levenshtein(a, b) / Math.max(a.length, b.length)) * 100));
}

async function startRecognition() {
  if (activePronunciationSession) {
    stopPronunciationCapture(false);
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
    state.pronunciationResult = { score: null, text: "녹음 기능을 사용할 수 없는 브라우저입니다.", message: "마이크 녹음과 재생을 지원하는 최신 브라우저에서 다시 시도해 주세요.", retryable: false };
    renderTask();
    return;
  }
  clearPronunciationAudio();
  state.pronunciationResult = null;
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    state.pronunciationResult = { score: null, text: "마이크를 사용할 수 없어요.", message: "브라우저의 마이크 권한을 허용한 뒤 다시 시도해 주세요.", retryable: true };
    renderTask();
    return;
  }
  if (!state.activeDay || state.taskIndex !== 2) {
    stream.getTracks().forEach((track) => track.stop());
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recorder;
  try {
    recorder = new MediaRecorder(stream);
  } catch {
    stream.getTracks().forEach((track) => track.stop());
    state.pronunciationResult = { score: null, text: "녹음을 시작하지 못했어요.", message: "이 브라우저의 오디오 녹음 형식을 지원하지 않아요.", retryable: false };
    renderTask();
    return;
  }
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  const session = {
    stream,
    recorder,
    recognition,
    recognitionSupported: Boolean(recognition),
    recognitionEnded: false,
    stopRequested: false,
    chunks: [],
    finishing: false,
    completed: false,
    discard: false,
    timeout: null
  };
  activePronunciationSession = session;
  recorder.ondataavailable = (event) => {
    if (event.data?.size) session.chunks.push(event.data);
  };
  recorder.onstop = () => completePronunciationCapture(session);
  recorder.onerror = () => finishPronunciationCapture(session);
  recorder.start();
  state.pronunciationRecording = true;
  renderTask();

  if (!recognition) {
    session.timeout = setTimeout(() => finishPronunciationCapture(session), 12000);
    showToast("녹음 중이에요. 마이크를 다시 누르면 끝나요.");
    return;
  }
  recognition.lang = languageMeta[state.language].speech;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const score = pronunciationScore(state.activeDay.phrase, transcript);
    state.pronunciationScore = score;
    state.pronunciationResult = {
      score,
      text: transcript,
      message: score >= levelProfiles[state.language][state.levelByLanguage[state.language]].passScore ? "현재 단계의 발음 목표를 달성했어요." : score >= 65 ? "좋아요. 강세와 문장 리듬을 한 번 더 들어보세요." : "천천히 끊어서 다시 말해보세요.",
      retryable: score < levelProfiles[state.language][state.levelByLanguage[state.language]].passScore
    };
  };
  recognition.onerror = () => {
    state.pronunciationResult = { score: null, text: "음성을 인식하지 못했어요.", message: "마이크 권한과 주변 소음을 확인한 뒤 다시 시도하세요.", retryable: true };
  };
  recognition.onend = () => {
    session.recognitionEnded = true;
    finishPronunciationCapture(session);
  };
  try {
    recognition.start();
    session.timeout = setTimeout(() => stopPronunciationCapture(false), 15000);
  } catch {
    state.pronunciationResult = { score: null, text: "음성 인식을 시작하지 못했어요.", message: "내 발음 녹음은 저장됩니다. 마이크를 다시 눌러 녹음을 끝내 주세요.", retryable: true };
    session.timeout = setTimeout(() => finishPronunciationCapture(session), 12000);
  }
}

function wordItems() {
  return completedEntries().flatMap(({ scenario, day, completedAt }) => {
    if (day.vocabulary) {
      return [
        ...day.vocabulary.map((item) => ({ type: "단어", text: item.term, ko: item.meaning, context: `${scenario.tab} · ${day.title}`, completedAt })),
        { type: "문장", text: day.phrase, ko: day.translation, context: `${scenario.tab} · ${day.title}`, completedAt }
      ];
    }
    return [
      { type: "단어", text: day.word, ko: day.meaning, context: `${scenario.tab} · ${day.title}`, completedAt },
      { type: "문장", text: day.phrase, ko: day.translation, context: `${scenario.tab} · ${day.title}`, completedAt }
    ];
  });
}

function renderWordbook() {
  const items = wordItems().filter((item) => state.wordFilter === "전체" || item.type === state.wordFilter);
  const visibleItems = items.slice(0, 6);
  const meta = languageMeta[state.language];
  $("#word-count").textContent = String(wordItems().length);
  $$(".filter-button").forEach((button) => button.classList.toggle("active", button.textContent === state.wordFilter));
  $("#word-list").innerHTML = items.length ? visibleItems.map((item) => `<article class="word-row">
    <span class="word-kind">${item.type}<br><small>${escapeHtml(item.context)}</small></span>
    <div class="word-copy"><strong lang="${meta.htmlLang}">${escapeHtml(item.text)}</strong><span>${escapeHtml(item.ko)}</span></div>
    <button class="listen-button" data-speak="${escapeHtml(item.text)}" type="button">▶ 발음 듣기</button>
  </article>`).join("") + (items.length > visibleItems.length ? `<div class="more-line">최근 표현 6개 표시 · 그 외 ${items.length - visibleItems.length}개 저장됨</div>` : "") : `<div class="empty-state"><b>아직 저장된 표현이 없어요</b><button data-scroll="course-section" type="button">첫 Lesson 시작하기</button></div>`;
}

function renderRecords() {
  const entries = completedEntries();
  const completedCore = coreCompletedEntries();
  const scores = entries.map((entry) => entry.pronunciationScore).filter((score) => Number.isFinite(score));
  const reviewTotal = entries.reduce((sum, entry) => sum + (entry.reviewCount || 0), 0);
  const queue = reviewQueue().slice(0, 5);
  const upcoming = upcomingReview();
  $("#completed-days").textContent = String(completedCore.length);
  $("#total-minutes").textContent = String((entries.length + reviewTotal) * 10);
  $("#review-count").textContent = String(reviewTotal);
  $("#average-score").textContent = scores.length ? String(Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)) : "—";
  $("#review-queue-count").textContent = String(queue.length);
  $("#review-start-button").disabled = queue.length === 0;
  $("#review-preview").textContent = queue.length
    ? `${queue[0].scenario.tab} · ${queue[0].day.title} — ${queue[0].day.phrase}`
    : upcoming
      ? `${formatReviewDate(upcoming.nextReviewAt)} 복습 예정 · ${upcoming.scenario.tab} · ${upcoming.day.title}`
      : "첫 Lesson을 완료하면 20분·1·3·7·14·30일 간격 복습이 시작됩니다.";

  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + mondayOffset);
  const weekCounts = Array(7).fill(0);
  entries.flatMap((entry) => [entry.completedAt, ...(entry.reviewHistory || [])]).forEach((activityAt) => {
    const activity = new Date(activityAt);
    const index = Math.floor((activity - monday) / 86400000);
    if (index >= 0 && index < 7) weekCounts[index] += 1;
  });
  const learnedDays = weekCounts.filter(Boolean).length;
  $("#week-record-label").textContent = `${learnedDays}일 학습`;
  $("#week-bars").innerHTML = ["월", "화", "수", "목", "금", "토", "일"].map((label, index) => `<span class="week-bar ${weekCounts[index] ? "active" : ""}"><i style="height:${Math.min(64, Math.max(3, weekCounts[index] * 18))}px"></i><small>${label}</small></span>`).join("");
  const recentEntries = entries.slice(0, 3);
  $("#history-list").innerHTML = entries.length ? recentEntries.map((entry) => `<div class="history-item"><div><b>${escapeHtml(entry.day.title)}</b><small>${escapeHtml(entry.scenario.tab)} · ${new Date(entry.completedAt).toLocaleDateString("ko-KR")}${entry.reviewCount ? ` · 복습 ${entry.reviewCount}회` : ""} · 다음 ${formatReviewDate(entry.nextReviewAt)}</small></div><span>발음 ${Number.isFinite(entry.pronunciationScore) ? `${entry.pronunciationScore}점` : "미측정"}<small>${escapeHtml(entry.mastery || "형성 중")}</small></span><span>10분</span></div>`).join("") + (entries.length > recentEntries.length ? `<div class="more-line">그 외 ${entries.length - recentEntries.length}개 완료 기록</div>` : "") : '<div class="history-empty">완료한 Lesson이 아직 없습니다.</div>';
}

root.addEventListener("click", (event) => {
  if (event.target.closest("[data-immediate-review]")) {
    const scenario = state.activeScenario;
    const day = state.activeDay;
    const dayIndex = scenario?.days.findIndex((item) => item.id === day?.id) ?? -1;
    if (scenario && day && dayIndex >= 0) openLesson(scenario, day, dayIndex, true, true);
    return;
  }
  const scrollButton = event.target.closest("[data-scroll]");
  if (scrollButton) {
    root.getElementById(scrollButton.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    state.categoryIndex = Number(categoryButton.dataset.category);
    state.scenarioIndex = 0;
    state.dayPage = 0;
    scenarios = curriculum[state.categoryIndex].topics;
    persist();
    renderCourse();
    return;
  }
  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) {
    state.scenarioIndex = Number(scenarioButton.dataset.scenario);
    state.dayPage = 0;
    persist();
    renderCourse();
    return;
  }
  const dayPageButton = event.target.closest("[data-day-page]");
  if (dayPageButton) {
    state.dayPage = Number(dayPageButton.dataset.dayPage);
    persist();
    renderCourse();
    return;
  }
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    startLesson(Number(dayButton.dataset.day));
    return;
  }
  const choice = event.target.closest("[data-choice]");
  if (choice && !state.answerChecked) {
    const index = Number(choice.dataset.choice);
    state.selectedChoices = state.selectedChoices.includes(index)
      ? state.selectedChoices.filter((value) => value !== index)
      : [...state.selectedChoices, index];
    renderTask();
    return;
  }
  const token = event.target.closest("[data-token]");
  if (token && !state.answerChecked) {
    state.builtTokens.push(Number(token.dataset.token));
    renderTask();
    return;
  }
  const built = event.target.closest("[data-built]");
  if (built && !state.answerChecked) {
    state.builtTokens.splice(Number(built.dataset.built), 1);
    renderTask();
    return;
  }
  const reply = event.target.closest("[data-reply]");
  if (reply) {
    submitRoleplay(reply.dataset.reply);
    return;
  }
  const listen = event.target.closest("[data-speak]");
  if (listen) {
    const rate = listen.dataset.speakRate ? Number(listen.dataset.speakRate) : undefined;
    speak(listen.dataset.speak, rate, listen.dataset.speakLocale);
    return;
  }
  if (event.target.closest("[data-retry-recognition]")) {
    stopPronunciationCapture(true);
    clearPronunciationAudio();
    state.pronunciationResult = null;
    renderTask();
    startRecognition();
    return;
  }
  if (event.target.closest("#record-control")) startRecognition();
});

root.addEventListener("submit", (event) => {
  if (event.target.id !== "chat-form") return;
  event.preventDefault();
  submitRoleplay($("#chat-input")?.value || "");
});

$("#lesson-action").addEventListener("click", handleLessonAction);
$("#lesson-prev").addEventListener("click", goPreviousTask);
$("#lesson-pass").addEventListener("click", skipTask);
$("#lesson-close").addEventListener("click", closeLesson);
$("#records-button").addEventListener("click", openRecordsModal);
$("#records-close").addEventListener("click", closeRecordsModal);
$("#review-start-button").addEventListener("click", startReview);
$("#records-modal").addEventListener("click", (event) => {
  if (event.target.id === "records-modal") closeRecordsModal();
});
root.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#records-modal").hidden) closeRecordsModal();
});
$("#language-select").addEventListener("change", async (event) => {
  state.language = event.target.value;
  await window.AiderLogLanguageV2?.loadCourse?.(state.language, state.levelByLanguage[state.language]);
  curriculum = buildCurriculum(state.language, state.levelByLanguage[state.language]);
  state.categoryIndex = 0;
  scenarios = curriculum[0].topics;
  state.scenarioIndex = 0;
  state.dayPage = 0;
  state.wordFilter = "전체";
  persist();
  renderPage();
  showToast(`${languageMeta[state.language].label} 코스로 바꿨어요.`);
});
$("#level-select").addEventListener("change", async (event) => {
  const nextLevel = validLevel(Number(event.target.value));
  state.levelByLanguage[state.language] = nextLevel;
  await window.AiderLogLanguageV2?.loadCourse?.(state.language, nextLevel);
  curriculum = buildCurriculum(state.language, nextLevel);
  state.categoryIndex = 0;
  scenarios = curriculum[0].topics;
  state.scenarioIndex = 0;
  state.dayPage = 0;
  state.wordFilter = "전체";
  persist();
  renderPage();
  showToast(`${levelProfiles[state.language][nextLevel].name} 단계로 바꿨어요.`);
});
$$('.filter-button').forEach((button) => button.addEventListener("click", () => {
  state.wordFilter = button.textContent;
  renderWordbook();
}));

$("#reset-button").addEventListener("click", () => {
  const currentOnly = window.confirm(`${languageMeta[state.language].label} · ${levelProfiles[state.language][state.levelByLanguage[state.language]].name} 과정의 진도만 초기화할까요?\n\n취소를 누르면 전체 초기화 여부를 다시 확인합니다.`);
  if (!currentOnly && !window.confirm("모든 언어와 난이도의 학습 진도, 문장 인식 일치도, 복습 기록을 초기화할까요?")) return;
  const activeIds = new Set(coreDays().map(day => day.id));
  if (currentOnly) Object.keys(state.progress).forEach(id => { if (activeIds.has(id)) delete state.progress[id]; });
  else state.progress = {};
  Object.keys(localStorage).filter(key => key.startsWith("languageProgress:")).forEach(key => {
    if (!currentOnly || key.includes(`:${state.language}:${state.levelByLanguage[state.language]}:`)) localStorage.removeItem(key);
  });
  persist();
  state.categoryIndex = 0;
  state.scenarioIndex = 0;
  state.dayPage = 0;
  state.wordFilter = "전체";
  renderPage();
  showToast(currentOnly ? "현재 과정의 학습 기록을 초기화했습니다." : "전체 학습 기록을 초기화했습니다.");
});

renderPage();
};
