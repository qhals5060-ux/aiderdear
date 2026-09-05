# AiderLog Android v153 · Site v121 + Work

## v153 fresh-install startup recovery and 5 mm frame

- Removes the unnecessary native widget refresh from the Activity startup path so a fresh install can open without initializing widget code before the WebView.
- Applies an explicit 5 mm (31.5 dp) content frame at both the top and bottom of the Android screen.
- Prevents the `#home` URL target from scrolling the app header above the top frame during first launch.
- Keeps the site download filenames versioned so a first-time visitor receives the current APK instead of a cached older file.

Android APK SHA-256: `D79681D1F41433ECEE7791648654BCE4CB67FAFFB4166CCD1EBF7CE638E85FBA`

---

## v152 emotion, Event and post-install widget settings

- Reframes the emotion recorder as a bounded mobile sheet and turns the long context/activity/action lists into collapsible multi-select controls.
- Removes the footer background behind Cancel/Save, restores the compact planetary system-theme selector, and refines the insight postcard/envelope.
- Repairs the mobile Event layout so Record, Archive and Travel use the full available width instead of collapsing into a narrow column.
- Adds every widget immediately with its default cosmic design; tapping the installed widget opens theme, opacity, font and content settings.

Android APK SHA-256: `0DE718A8AAB51F40F8333A69C02AEAE58F951117C33F2D05AE7F47C17E1F4419`

## v151 Android native-touch wheel and live cosmic widgets

- Keeps the idle planet artwork in its original lower-right peek position while enlarging the transparent core target and the complete open fan hit area.
- Uses native Android TouchEvent handling for tap-to-home, hold-open, drag selection and direct destination taps on Samsung WebView; mouse and pen remain separate fallbacks.
- Registers 15 installable widgets: five Schedule, Bullet Journal, two Routine, Language streak, Meal photos, and five Workout variants.
- Each installed widget can reopen `꾸미기` to change its theme, opacity (20% steps), font size (five steps), and applicable content.
- Unfolded Galaxy Fold displays app text about 6% larger while Flip and cover displays retain the compact scale.

## v149 foldable app, widgets and Language Lab v2

- Android navigation uses one wheel controller: a short tap returns Home and a long press opens the fixed `My · Language · Personal · Routine · Event` destinations.
- The splash shows one real progress indicator and then a five-page tutorial built from the actual app screens.
- The five exposed Android widgets are schedule-only and support light/dark appearance, system-theme colors, opacity in 20% steps, and five font sizes.
- Calendar spacing, current-date ring, schedule form, Routine, Daylog, Private Universe and account/settings density were refined for Galaxy Flip/Fold 3–8.
- Language Lab uses the validated split v2 bundle: 3 languages, 5 levels per language, 8 units and 80 lessons per course. Only the selected course is parsed and cached.
- Language progress is keyed by user/language/level/unit/lesson, preserves legacy progress and syncs between the website and Android app for the same account.
- The profile App page downloads the current v153 site archive and signed Android APK.

Android APK SHA-256: `53CF581A3EF3F73E98CAB8F91D67F4FD143FD0991E80EEE4A5FBAB9AAA808ED6`

---

# AiderLog Android v147 · Site v121 + Work

## v147 Task · Work · Study Card separation

- Android My에서 `Task`는 대학원 컨설팅 전용, `Work`는 국가과제·바이오 연구·행정·직원 업무를 다루는 대표 운영 전용으로 완전히 분리했습니다.
- 앱 전용 `Study Card`에 48주 · 192모듈 · 576개념 · 1,728복습카드를 연결하고, 학습·복습·진도와 1/7/21/60일 복습 큐를 로컬에 저장합니다.
- `Study Card`는 `aidway55@gmail.com`을 제외한 앱 사용자에게 보이며 웹사이트에는 추가하지 않았습니다.
- 웹사이트의 기존 데스크톱 UI를 유지하면서 `Paper · Task · Work`는 `qhals5060@gmail.com`, `aidway55@gmail.com`에게만 표시하고 각 계정 데이터를 분리했습니다.
- 캘린더 날짜·공휴일을 한 줄에 맞추고, 닫힌 행성 휠은 어두운 블러로 절제했으며, 앱 최상단에 약 0.5mm 안전 여백을 추가했습니다.

Android APK SHA-256: `FBE38CF337F5F1B796F76446952117523FBACE5A2EE270949D15DECF824F531C`

---

# AiderLog Android v146 · Site v121 + Work

## v146 scope correction

- 웹사이트는 기존 데스크톱 AiderLog v121 디자인으로 복구하고, 기존 `TASK` 바로 뒤에 대표용 `WORK` 탭만 추가했습니다.
- 앱 전용 Paper · Brain · Speech · My 화면은 웹사이트의 기존 페이지를 대체하지 않습니다.
- 웹사이트 개인 페이지의 `프로필 · 캘린더 · 앱` 중 앱 화면에 PC 사이트 ZIP과 Android APK 다운로드 버튼을 복원했습니다.
- Android 앱의 행성 휠은 짧게 누르면 Home으로 이동하고, 길게 누른 채 끌면 `My · Language · Personal · Routine · Event`를 선택합니다.
- 실행에 사용되지 않는 이전 APK, 중복 운동 애니메이션, 미리보기 산출물을 제거했습니다.

Android APK SHA-256: `AFE4DB4B57F585171D808EE136F757E744614C8F266D113D8970BBE92579A266`

---

# AiderLog Android v144 · Site v121

## Android v144 bright galaxy & tactile mail

- 밝은 배경에서도 원래 은하 이미지를 유지하고 테마 색조만 밝게 조정
- 사진 기반의 실제 종이 질감을 사용한 짧은 엽서와 봉투, 엽서 중앙선 제거
- 행성 휠의 짧게 눌러 홈 이동 및 길게 눌러 확대·메뉴 열기 복원
- 선택 날짜의 네온 원형 띠 축소 및 대한민국 공휴일 기본 표시
- APK와 사이트 소스 ZIP은 배포 사이트가 아니라 Codex 결과물로 제공

Android APK SHA-256: `1EBB20A1539DC4955B998EF3040C69E0FB5BEC125240B54E324C854A9DC82B30`

---

## Site v121

## v121 routine · language · travel · client · paper refinement

- ALL ROUTINES의 8개 요약 상자를 제거하고 개별 성취 통계, 꾸준한 루틴, 회복이 필요한 루틴 분석을 추가했습니다.
- LANGUAGE LAB 선택창을 짧게 정리하고 학습 완료를 커플 또는 친구에게 보낼 수 있도록 했습니다.
- Travel을 WANT · PLAN · 최신순 · + 기록 순서로 정돈하고 계획을 예약·장소·일정·준비가 있는 한 장의 PLAN으로 표현합니다.
- 고객 추가 폼의 03·04 배치와 저장 버튼 아래 여백을 줄였습니다.
- Paper 상단 프로젝트 바와 Research OS 표식을 제거하고 검색·논문 가져오기를 왼쪽에 배치했으며 전체 글자 크기를 줄였습니다.

`const CACHE='aiderlog-v121-routine-language-travel-paper';`

## v120 PAPER · Evidence-first Research OS

- 기존 AiderLog 상단 탭과 메인 프레임은 유지하고 PAPER 내부만 Research Hub · Library · Evidence · Synthesis · Study Workspace · Brain Atlas 구조로 전면 개편했습니다.
- 논문별 정독 화면에서 연구 질문, 표본 흐름, 측정·피처, 분석 파이프라인, 핵심/비유의 결과, 표·그림 지도, 재현성, 연구 아이디어를 한 흐름으로 확인합니다.
- 원문 사실과 AI 해석을 분리하고, 6개 타당도 평가축·주장별 지지/제한 근거·편향 점검·연구 사용 결정을 근거 위치와 함께 표시합니다.
- GPT Pro용 `AIDERLOG_PAPER_V3` 프롬프트와 붙여넣기 검사를 제공하며, 깊이·인용·위치·평가 근거를 통과한 결과만 Library와 Evidence에 저장합니다.
- 상세 V3 분석은 논문별 Firestore 문서로 분리해 공동 PAPER/TASK 문서가 과도하게 커지지 않도록 했습니다.
- 2D Brain Atlas는 정중 시상면, 4개 확대판, 방향축, 선택 영역의 미니 위치 지도와 연구 연결을 제공합니다.
- 기존 PAPER 논문·Insight는 변환 없이 불러오며, 새 화면의 정보가 없는 항목은 원문 검토가 필요한 부분을 명시합니다.

`const CACHE='aiderlog-v120-paper-research-os';`

---

# AiderLog v117

## v117 Calendar · Routine · Language · Task fixes

- 캘린더의 생리·본인/커플 감정을 날짜 오른쪽 아래 아이콘으로 표시하고, 3건 이상 일정은 날짜 셀 툴팁으로 전체 확인
- 일정 소유자를 본인 붉은 계열·커플 푸른 계열로 구분하고 월간 목록의 이름 제거
- 루틴 도넛과 8개 분석 카드를 축소하고 문구를 정리
- 어학 레슨의 필 태그 제거, 시작 버튼 축소, COURSE SELECT와 MY WORDS 높이 재배분
- 포모도로 FOCUS를 토마토 아이콘으로 변경
- 고객 입력을 한 화면용 밀도와 필수/선택 안내로 재배치하고 다중전공·복수전공·부전공 저장 지원
- 사용자 관리에서 Firebase Authentication 가입 이메일만 조회

## v116 Readable Type · Interior Reflow

- 메인 프레임과 11px 최소 글자 크기를 그대로 유지하고, SCHEDULE·ROUTINE·EVENT·PERSONAL·TASK의 내부 카드·행·팝업을 내용에 맞게 늘어나도록 재배치했습니다.
- 접힌 페이지와 숨긴 미디어가 프레임 밖에 표시되던 문제를 막고, 긴 영역은 각 탭 내부에서 스크롤되도록 보정했습니다.
- 로그인 전 계정 팝업의 불필요한 빈 공간과 반복 안내 문구를 없앴습니다.
- PAPER 탭의 CSS, 배열과 글자 크기는 변경하지 않았습니다.

`const CACHE='aiderlog-v116-readable-reflow';`

---

# AiderLog v114

## v114 Language Lab · Communicative Course Rebuild

- 학습 체계를 **CORE PATH / SITUATION LAB / REVIEW PATH**로 분리하고, 각 난이도를 8개 UNIT × 6개 Lesson으로 다시 구성했습니다.
- 영어·일본어·중국어의 입문·기초·독립·고급·숙련 과정이 서로 다른 문장, 격식, 읽기 도움, 말하기 목표를 사용합니다.
- 첫 만남 UNIT 15개(3개 언어 × 5개 난이도)는 자동 문장 조합이 아닌 언어·수준별 검수 콘텐츠로 교체했습니다.
- CAN-DO와 STEP 1 선택지는 장면·의도·자연스러운 응답을 평가하며, 문장에 없는 단어 찾기 같은 억지 오답을 제거했습니다.
- 표현 연결망을 같은 기능·자연스러운 응답·격식 차이·상황 확장·대화 유지의 다섯 범주로 고정했습니다.
- COURSE SELECT에서 학습 경로, 8개 UNIT, 완료 수와 진행 상태를 한눈에 선택하며 데스크톱·모바일 겹침을 정리했습니다.

`const CACHE='aiderlog-v114-language-course-rebuild';`

---

# AiderLog v113

## v113 Language Lab · 84-day Core Path · Spaced Recall

- 영어·일본어·중국어 코스를 **5개 표시 난이도와 10개 내부 단계(1A–5B)**로 재설계했습니다. 난이도마다 첫 주제, 문장 길이, 격식, 발화 과제가 실제로 달라집니다.
- 각 난이도는 12주·84일 코어 패스로 구성되며, 매주 처음 만나기 → 응답 연결 → 조건 바꾸기 → 듣기 전환 → 혼합 회상 → 실전 역할극 → 주간 체크 순서로 진행합니다.
- 코어 패스 외에 주제별 **상황 랩**과 12주 **체크포인트**를 제공합니다. 선택 연습은 순서와 관계없이 열 수 있습니다.
- 입문 일본어에는 히라가나·로마자, 입문 중국어에는 병음·성조, 영어에는 리듬 덩어리를 표시합니다.
- 기존의 일반적인 ‘표현 확장’을 핵심 표현·난이도 변형·상대의 자연스러운 응답·같은 장면의 다음 말로 구성된 표현 연결망으로 교체했습니다.
- 학습 직후 `지금 2분 회상하기`를 제공하고 20분·1·3·7·14·30일 간격 복습을 자동 예약합니다. 완료한 Day는 언제든 `반복`으로 다시 열 수 있습니다.

`const CACHE='aiderlog-v113-language-core-spaced-recall';`

---

# AiderLog v112

## v112 Admin · Birthdays · Research Landscape

- `qhals5060@gmail.com`으로 로그인한 경우에만 **AiderLog 계정 → 사용자 관리**가 표시됩니다. 서버 API가 Firebase ID 토큰의 이메일·이메일 인증·토큰 폐기 여부를 다시 검사한 뒤 로그인 계정의 안전한 프로필·가입·최근 로그인 정보만 반환합니다.
- 프로필에 성별과 함께 생년월일, 양력·음력, 윤달을 저장합니다. 연결된 커플·친구의 생일은 AiderLog 캘린더에만 표시되며 Google Calendar에는 전송되지 않습니다.
- PAPER 전체 타이포그래피와 카드 밀도를 정리하고 Library 다중 선택 삭제, 대상군·주제·방법 필터 기반 Research Landscape, 연구 공백 기반 Idea Opportunity Map을 추가했습니다.
- Design Studio의 저장 설계마다 Library 유사 논문을 바탕으로 문헌 근거·대상 재현성·측정 가능성·분석 구체성·윤리·운영을 점검하고 실행 순서도와 알고리즘을 표시합니다.
- GPT 붙여넣기 형식을 `NEURO_RESEARCH_WORKFLOW_V2`로 확장해 대상군 표준화, 주제, 설계군, 모달리티, 과제·측정, 예측변수·결과변수, 분석·검증, 자원·윤리·재현성, 연구 공백을 구조화합니다.
- PAPER 왼쪽에 **My Lab**을 추가해 성균관대학교 Computational Brain Science and AI Laboratory의 공식 연구 방향과 대표 논문을 연구 워크스페이스 안에서 확인할 수 있습니다.

`const CACHE='aiderlog-v112-admin-birthdays-research-landscape';`

---

# AiderLog v111

## v111 Selective sharing · Evidence Insights · Design Studio

- Google·Notion 등 외부에서 가져온 읽기 전용 일정도 일정 편집창에서 커플 공유를 켤 수 있습니다. 공유본은 상대 AiderLog에만 나타나며 어느 Google 캘린더에도 추가되지 않습니다.
- PAPER Insights에 근거 품질 점수, 검토 우선순위, 논문 장별 커버리지, 단일 출처 주장 및 상충 근거 진단을 추가했습니다.
- Language Lab의 `학습 초기화`와 `상대에게 보내기`를 최근 2주 기록 제목 오른쪽에 복원했습니다.
- 앨범 폴더 편집창에서 공유할 연결 친구를 직접 선택하고, 사람별 읽기 전용 앨범 공유 상태를 유지합니다.
- PAPER에 초보 연구자를 위한 Design Studio와 연구 질문→가설→측정→분석→검증→윤리 흐름을 추가했습니다. 뇌 노화·인지 기능·인지예비능·정신질환의 실제 PubMed 논문 5편과 완성된 종단 MRI 설계 예시를 제공합니다.

`const CACHE='aiderlog-v111-sharing-insights-design-studio';`

---

# AiderLog v110

## v110 Language · Album · Research Ideas · Modal Scroll

- Language Lab에 사라졌던 언어·난이도 선택을 복원하고, 다른 탭과 같은 가로선·타이틀 헤더로 정리했습니다.
- 앨범 폴더 편집 버튼을 실제 앨범 폼에 연결하고, 편집 중에는 `수정하기`와 `삭제하기`를 제공합니다. 친구 공유는 로컬 화면에 즉시 반영한 뒤 저장과 공유 동기화를 병렬 처리합니다.
- PAPER에 Research Ideas 메뉴를 추가했습니다. 논문의 제한점, 상충 근거, 뇌 영역·회로, 모달리티, 연구 노트의 공백에서 아이디어 트리거를 만들고 가설·변수·설계·반증 기준·근거 연결을 저장합니다.
- 지원 가능 대학원 분석 팝업을 Task 프레임 밖의 독립 레이어로 옮겨 메인 스크롤과 팝업 스크롤이 겹치지 않게 했습니다.

`const CACHE='aiderlog-v110-workspace-usability-repair';`

---

# AiderLog v109

## v109 Neuroscience evidence workspace

- PAPER의 GPT 가져오기를 `AIDERLOG_PAPER_V1` JSON 기반으로 바꾸고, 연구 질문과 핵심 주장을 반영한 GPT Pro용 분석 프롬프트를 화면에서 바로 복사할 수 있게 했습니다.
- 붙여넣은 결과는 저장 전에 JSON 형식, 논문 제목, Insight 수, 원문 인용 누락, 페이지·표·그림 위치 누락을 검사하고 미리보기로 보여줍니다. 기존 대괄호 텍스트 형식도 경고와 함께 계속 가져올 수 있습니다.
- Insight에 원문 인용, 인쇄/PDF 페이지, 절·표·그림·부록, AI/사용자 출처, 검토 상태, 지지·반대·혼합, 논문 활용 장, 추출 신뢰도, 근거 수준, 연구 관련성, 반대 근거와 검토 이력을 분리했습니다.
- Evidence 메뉴에 검토 대기열, 출처 누락, 인용 준비 상태, 주장별 지지·반대 Matrix와 현재 연구 모달리티·뇌 영역·임상 범위 지도를 추가했습니다.
- 논문별로 뇌 영역·네트워크, 인지 기능, 질환·임상 특성, 종·표본, 모달리티, 과제, 연구 설계, 획득·전처리, 좌표공간·분석, 통계·효과크기·다중비교, 데이터·코드 공개 여부를 저장하고 비교합니다.
- 기존 PAPER 논문과 Insight는 새 필드가 비어 있는 상태로 안전하게 유지되며, 기존 캘린더와 다른 탭의 기능은 변경하지 않았습니다.

`const CACHE='aiderlog-v109-neuroscience-evidence-workspace';`

---

# AiderLog v108

## v108 v100 Calendar connection recovery

- 캘린더 연결 버튼을 v100에서 정상 동작했던 Firebase 브라우저 권한 방식으로 복원했습니다. 서버 OAuth 콜백과 배포된 API 버전이 맞지 않아도 로그인한 화면에서 바로 권한을 받고 캘린더 목록을 선택할 수 있습니다.
- Google 로그인 팝업의 추가 매개변수를 v100과 동일하게 단순화하고, 브라우저 권한 성공·실패 단계를 토큰 없이 콘솔에 기록합니다.
- 이전 버전에서 가져온 Google 일정이 남아 있으면 로컬 연결 표시가 사라졌더라도 브라우저 연결 상태를 복구합니다.
- 연결 해제 시 브라우저 상태와 남아 있는 서버 연결을 함께 정리해 다음 연결이 오래된 상태에 막히지 않게 했습니다.

`const CACHE='aiderlog-v108-calendar-browser-connection-recovery';`

---

# AiderLog v107

## v107 Calendar recovery · readable analytics · clipping fixes

- Google OAuth 콜백 뒤 서버 상태를 다시 확인하고, 상태 저장이 복구되지 않으면 브라우저 Calendar 권한 연결로 자동 전환합니다. 서버 로그에는 토큰을 제외한 연결 단계·캘린더 수·일정 수 진단 정보가 남습니다.
- 루틴 전체 통계를 도넛 달성률, 최근 7일 증감, 실천 일관성, 꾸준한 루틴, 주요 강도와 MINI·MORE·MAX 분포로 확장했습니다.
- 사이트 내부 어학 레슨의 높이를 부모 프레임 기준으로 계산해 하단 `정답 확인` 버튼이 항상 보이게 했습니다.
- 뇌 모델을 안전 영역 안에 맞추고 DETAILED ATLAS INDEX와 연구 카드가 세로 스크롤 안에서 전부 표시되게 했습니다.
- 지원 가능 대학원 분석의 개요·요약 높이를 정상 흐름으로 고정해 카드와 문구가 겹치지 않게 했습니다.

`const CACHE='aiderlog-v107-calendar-ui-layout-recovery';`

---

# AiderLog v106

## v106 Calendar recovery · archive/album polish · BIG GOALS routine workspace

- 만료되거나 해제된 Google Calendar 권한을 정리한 뒤 다시 동의받으며, 서버 OAuth를 사용할 수 없을 때는 캘린더 선택이 가능한 브라우저 갱신 방식으로 전환합니다.
- ARCHIVE와 Travel의 기준선을 맞추고 WISH LIST를 ARCHIVE 오른쪽 하단에 고정했습니다.
- 앨범 폴더를 누르면 해당 폴더의 사진·동영상만 표시하며 폴더 이름과 색상을 편집할 수 있습니다.
- 고객 추가 폼을 좌우 독립 열로 재배치하고 Overview의 지출 완료 확인을 체크리스트로 제공합니다.
- 3개의 BIG GOALS가 각각 독립 만다라트를 가지며, BIG GOALS와 루틴 카드의 높이를 맞췄습니다.
- 루틴은 한 카드 안에서 아이콘으로 전환하고, 색상과 기호가 함께 있는 스탬프 및 오른쪽 전체 인라인 펼침 화면을 제공합니다.

서버 캘린더 쓰기와 자동 동기화에는 `firestore.rules` 배포 및 Google Calendar OAuth 환경변수가 필요합니다.

`const CACHE='aiderlog-v106-calendar-archive-album-goals-routines';`

---

# AiderLog v104

## v104 Calendar write-back · shared archives/albums · advisor matching · routine redesign

- 선택한 Google 캘린더만 자동 동기화하고, 사이트에서 만든 일정을 쓰기 가능한 선택 캘린더로 바로 추가할 수 있습니다.
- 불러온 Google 일정은 읽기 전용으로 유지하면서 일정별로 커플에게 공유하거나 해제할 수 있습니다.
- EVENT 아카이브에 다녀온 장소와 `보고 싶은 것` 상태를 추가하고, 위시리스트를 한 팝업에서 모아봅니다.
- 친구와 공유할 앨범을 지정할 수 있고 즐겨찾기 기록은 자동으로 `즐겨찾기` 앨범에 모입니다.
- 대학원 상담의 내부 고객 폼과 외부 작성 링크에 여러 지도교수를 입력하며, 동일 지도교수 사례를 분석 가중치와 근거 카드에 반영합니다.
- ROUTINE은 좌우 1:1 구조로 바꾸고 BIG GOALS 아래에 만다라트를, 오른쪽에는 루틴 요약 카드와 최근 30일 전체 통계를 배치했습니다. 펼치기에서 전체 스탬프를 기록합니다.

서버 캘린더 쓰기와 자동 동기화에는 `firestore.rules` 배포 및 Google Calendar OAuth 환경변수가 필요합니다.

`const CACHE='aiderlog-v104-calendar-events-albums-advisors-routine';`

---

# AiderLog v103

## v103 Language practice · systematic workflow · Daily Brief

- 어학 레슨 내부 스크롤이 바깥 페이지 전환에 가로막히지 않도록 휠·터치 이벤트와 레슨 레이아웃을 분리했습니다.
- 첫 만남 회화는 실제 대화 순서에 맞게 이름 소개, 참석 이유, 하는 일, 마무리까지 이어지고 매 턴 2~3개의 자연스러운 선택지를 제공합니다.
- `Nice to meet you`, `Good to see you`, `It was great meeting you`의 사용 시점을 구분해 학습 내용과 실전 대화를 일치시켰습니다.
- 버피 설명을 짧게 정리하고 움직이는 스텝 백 버피와 푸시업 버피를 추가했습니다.
- 워크플로우에 우선순위, 업무 유형, 예상 시간, 완료 기준, 리스크, 태그, 단계 체크, 오늘의 집중 순서와 WIP 표시를 추가했습니다.
- 불렛저널을 기록 개수·활성 영역·할 일 진행·다음 일정을 먼저 보여주는 현대적인 Daily Brief로 재설계했습니다.

`const CACHE='aiderlog-v103-language-workflow-daily-brief';`

---

# AiderLog v102

## v102 Automatic calendar sync · TASK analysis clarity

- Google Calendar 연결을 브라우저 임시 토큰이 아닌 서버 refresh token 방식으로 전환해, 선택한 캘린더만 자동 동기화합니다.
- Google 변경 알림(webhook), 앱 실행·복귀·온라인 복구 시 갱신, 매일 구독 갱신 cron을 함께 사용합니다.
- 기존 임시 연결 사용자는 배포 후 개인 설정 → 캘린더의 `자동 동기화 켜기`를 한 번 눌러 전환합니다.
- TASK 상담 캘린더의 오늘 칸을 전용 `is-today` 스타일로 분리해 전역 `today` 스타일 충돌을 제거했습니다.
- 대학원 분석은 학업·연구·어학·전공 적합·활동·지원 설계의 6개 축, 증빙 8개 항목, 유사 사례, 결과 표본과 신뢰도를 함께 반영합니다.
- 학위 과정·학점·학점 만점·논문/학회/발표/포트폴리오 입력을 내부 고객 폼과 외부 접수 폼에 추가했습니다.

서버 자동 동기화에는 `.env.example`의 Firebase 서비스 계정, Google Calendar OAuth, `CALENDAR_STATE_SECRET`, `CRON_SECRET`, `PUBLIC_APP_URL` 설정이 필요합니다.

`const CACHE='aiderlog-v102-calendar-auto-sync-task-analysis';`

---

# AiderLog v95

## v95 Real trainer motion · repeatable DAY sessions

- 런지·스쿼트·플랭크의 세부 동작 9종을 실사 트레이너 애니메이션으로 교체했습니다.
- 세부 동작을 바꾸면 사진 시퀀스와 정렬·호흡·지지점 설명이 함께 바뀝니다.
- `30 DAY · 성별 기준` 문구를 없애고 운동 이름 옆에서 동작을 바로 선택합니다.
- 30개 DAY 버튼이 카드 내부에서 잘리지 않도록 높이와 스크롤 여유를 보강했습니다.
- 같은 DAY를 하루에 여러 번 추가할 수 있으며, 누적 회차 배지와 회차별 수정·삭제를 지원합니다.
- 기존 챌린지 기록은 1회차로 보존되고 이후 기록부터 2회차 이상으로 누적됩니다.

`const CACHE='aiderlog-v95-real-trainer-multi-session';`

---

# AiderLog v94

## v94 Login separation · full couple EVENT workspace

- AiderLog 계정 로그인과 Google Calendar 읽기 권한을 별도 상태로 표시합니다. 캘린더 OAuth 설정 오류가 로그인 실패처럼 보이지 않습니다.
- 팝업 차단·웹 저장소 제한 환경에서는 Firebase 리디렉션 로그인으로 복구합니다.
- 커플 연결 시 두 사용자의 기존 `Record · Album · Archive · Travel · Bucket` 자료를 커플 EVENT 공간에 한 번씩 병합합니다.
- 커플 연결 이후 EVENT의 새 기록과 첨부 미디어는 커플 공간에 저장되어 양쪽에서 실시간으로 확인합니다.
- 혼자 사용하던 시기의 EVENT 첨부 미디어도 커플 공간으로 이관할 수 있도록 개인 미디어 Firestore 규칙을 추가했습니다.

배포 시 `firestore.rules`를 반드시 함께 게시하세요. Google Calendar 단방향 실시간 연동은 아래 OAuth 설정도 필요합니다.

- OAuth 동의 화면이 테스트 상태라면 `qhals5060@gmail.com`, `aidway55@gmail.com`을 테스트 사용자로 등록
- 승인된 JavaScript 원본: `https://aiderdear1.vercel.app`
- 승인된 리디렉션 URI: `https://aiderdear1.vercel.app/api/calendar-sync?action=callback`
- Vercel 환경변수: `PUBLIC_APP_URL`, `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `CALENDAR_STATE_SECRET`

`const CACHE='aiderlog-v94-auth-event-couple-share';`

---

# AiderLog v93

## v93 Movement challenge · InBody trend

- 운동 기록 카드에 `EDIT` 동작을 추가해 일반 운동 기록을 다시 열어 수정할 수 있습니다.
- 30일 챌린지는 날짜 칸을 직접 선택해 완료 여부를 확인하고, 이미 저장한 날짜의 기록·동작·날짜를 수정할 수 있습니다.
- 스트레칭 챌린지를 제거하고 런지·스쿼트·플랭크마다 세 가지 세부 동작을 선택할 수 있게 했습니다.
- 정지 이미지 대신 선택한 동작을 반복 시연하는 움직임 가이드와 저장 직후 파란 완료 애니메이션을 표시합니다.
- DayLog의 `+ 운동`과 `30일 챌린지` 사이에 `InBody` 기록을 추가했습니다.
- InBody는 체중, 골격근량, 체지방량·체지방률, BMI, 내장지방 레벨을 저장·수정·삭제할 수 있습니다.
- Overview의 `InBody` 보기에서 최신 변화량, 최근 12회 추이 그래프와 측정 내역을 확인할 수 있습니다.

`const CACHE='aiderlog-v93-movement-inbody';`

---

# AiderLog v92

## v92 Routine recovery · 24-hour shared media · calendar fallback

- 캘린더·미디어 연동이 실패해도 개인 기록 로드가 중단되지 않도록 루틴 데이터를 가장 먼저 불러옵니다.
- PAPER·TASK 공유 작업공간 오류도 루틴 열람과 생성·저장을 막지 않습니다.
- SCHEDULE 사진/동영상은 연결된 커플·친구 중 선택한 사람에게만 공유되고, 24시간 뒤 화면에서 사라집니다.
- 여러 사람이 올린 미디어는 이전/다음으로 넘겨 보며, 다운로드와 내 화면에서 닫기, 작성자의 전체 삭제를 지원합니다.
- Vercel OAuth 환경변수가 아직 없는 경우에도 Google Calendar는 브라우저 연결로 전환되어 앱 실행 중 2분마다 단방향 갱신됩니다.

Firestore 배포 시 `firestore.rules`의 `ephemeralMedia` 규칙도 함께 반영해야 합니다.

`const CACHE='aiderlog-v92-routine-ephemeral-calendar-recovery';`

---

## v91 Private schedules · one-way live calendar sync

- 상단에는 로그인 닉네임만 표시하고, 이름을 누르면 짧은 탭형 개인 설정이 열립니다.
- 개인 설정의 `캘린더`에서 Google Calendar와 Notion 데이터베이스를 연결·해제·새로고침할 수 있습니다.
- Google Calendar는 push webhook, Notion은 integration webhook을 받아 외부 일정을 Firestore의 내 일정에 읽기 전용으로 반영합니다.
- Samsung Calendar는 공개 웹 API 제약 때문에 Google 계정에 저장된 삼성 일정이 Google 연결을 통해 함께 들어옵니다.
- 사이트에서 만든 일정은 항상 작성자 개인 공간에 저장되고, `커플과 공유`를 선택한 일정만 상대의 공유 피드에 복제됩니다.
- SCHEDULE의 보민·Aidway·공유 필터를 제거하고, 상대가 공유한 일정은 상대 고유 색상을 유지합니다.

배포 전에 Vercel 환경 변수와 외부 OAuth 설정을 완료하세요. 자세한 값은 `.env.example`을 참고합니다.

Google Cloud OAuth 리디렉션 URI:

`https://YOUR_DOMAIN/api/calendar-sync?action=callback`

Google Calendar webhook URL:

`https://YOUR_DOMAIN/api/calendar-sync?action=google-webhook`

Notion OAuth 리디렉션 URI 및 webhook URL:

`https://YOUR_DOMAIN/api/calendar-sync?action=callback`

`https://YOUR_DOMAIN/api/calendar-sync?action=notion-webhook`

`const CACHE='aiderlog-v91-private-live-calendar-sync';`

---

## v90 Gender profile · shared PAPER/TASK workspace

- 로그인 프로필에 여성/남성 선택을 추가하고 운동 챌린지의 목표량·동작 설명을 선택한 기준에 맞춥니다.
- 여성 프로필에서만 감정 기록에 생리일 항목이 나타납니다.
- D-DAY 아래 `This Month` 일정은 한 줄 말줄임으로 정리되어 노트 라인을 침범하지 않습니다.
- `PAPER`와 `TASK`는 `qhals5060@gmail.com`, `aidway55@gmail.com`에만 노출되며 두 계정이 동일한 Firestore 작업공간과 TASK 파일을 실시간으로 공유합니다.

- 커플 일정은 저장 당시 `mine` 값이 아니라 작성자 계정으로 다시 판별해 상대 고유 색상으로 표시합니다.
- SCHEDULE에서 Google Calendar를 읽기 전용으로 연결하고 선택한 캘린더의 일정과 색상을 가져올 수 있습니다.
- Notion에서 내보낸 CSV 또는 ICS 일정 파일을 SCHEDULE로 가져올 수 있습니다.
- LANGUAGE LAB 최근 달력 왼쪽 위에 `최근 2주 기록` 제목을 추가했습니다.
- PERSONAL 건강의 `+ 운동` 옆에 런지·스쿼트·플랭크·스트레칭 30일 챌린지를 추가했습니다.
- 챌린지에는 동작 이미지, 매일 목표, 30일 진행률이 표시되며 완료 기록은 최근 운동과 삭제 흐름에 함께 반영됩니다.

`const CACHE='aiderlog-v90-gender-shared-paper-task';`

## v88 Mail retention · protected Paper/Task backup

- Graduate Admissions의 빈 상담 안내 문구를 제거했습니다.
- 상담 캘린더와 대학원 리스트를 1:1 비율로 재배치했습니다.
- 우편은 생성 후 7일까지만 노출되며, 만료된 직접 우편과 기존 우편을 자동 정리합니다.
- PAPER·TASK 데이터는 6개월 정리 대상에서 제외된 상태를 명시적으로 유지합니다.
- PAPER·TASK 기록과 TASK 고객 파일을 90일마다 동의 후 Google Drive에 백업합니다.

`const CACHE='aiderlog-v88-mail-retention-workspace-backup';`

## v87 Shared nickname · Graduate Admissions calendar

- 닉네임 변경 시 내 화면뿐 아니라 활성 커플·친구 관계의 프로필 이름도 함께 갱신됩니다.
- 우편함은 저장 당시 이름 대신 현재 연결 프로필의 닉네임을 우선 표시합니다.
- Graduate Admissions를 좌측 고객 상담 일정 캘린더와 우측 대학원 목록으로 분할했습니다.
- 대학원 상자는 5열의 낮고 간결한 형태로 정리하고 외부 링크 화살표를 제거했습니다.
- 지원 가능 대학원 분석창의 안내 문구를 제거하고 내부 스크롤을 보강했습니다.

`const CACHE='aiderlog-v87-shared-nickname-consulting-calendar';`

## v86 Event color records · friends · photo mail · DayLog

- Event의 Record 작성 창에서 `#43240F`, `#F8F6DF`, `#E1AD01`, `#B83700`, `#3D4C1C` 색상을 선택할 수 있습니다.
- Record는 한 페이지에 6개씩 표시되며 최근순·오래된순·색상별 정렬과 `< 1 >` 페이지 이동을 지원합니다.
- 커플 연결과 별개의 수락형 친구 요청을 추가했습니다. 친구에게는 어떤 탭도 공유되지 않고 우편만 주고받습니다.
- 커플 또는 친구에게 보내는 편지에 압축 사진 한 장을 첨부할 수 있으며 편지지 우측 하단에 표시됩니다.
- PERSONAL 첫 화면 타이틀을 `DayLog`, 전환 화면을 `Overview`로 정리하고 두 화면의 글자를 키웠습니다.
- Firestore에 `friendInvites`, `friendships`, `directLetters` 규칙이 추가되었습니다. 배포 시 `firestore.rules`도 함께 반영해야 합니다.

서비스워커 확인:

`const CACHE='aiderlog-v86-record-friends-photo-mail';`

## v85 Taller frames · admissions comparison

- 상단 탭을 AiderLog 타이틀 가까이 올리고 확보된 높이를 각 탭의 메인 프레임에 돌려주었습니다.
- 모든 메인 프레임에 현재 탭 색상과 같은 4px 외곽선을 적용했습니다.
- Graduate Admissions 공식 대학원·입학 안내를 24곳 추가해 총 80곳으로 확장하고 가나다순으로 자동 정렬합니다.
- 대학 검색 오른쪽에 `지원 가능 대학원 분석`을 추가했습니다. 고객별 지원 증빙 완성도, 전공·연구주제 유사도, 실제 합격·불합격 사례를 분리해 비교합니다.
- 비교 사례가 적으면 결과 신호 비중을 낮추며, 표시 지수는 합격 확률이 아닌 내부 상담 우선순위 지표임을 명확히 표시합니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v85-frame-admissions-fit';`인지 확인하세요.

---

## 이전 버전 기록

### AiderLog v84

## v84 AidWay client intake

- 외부 고객 입력 링크를 `client-intake.html` 전용 진입 주소로 분리했습니다.
- 카카오톡 링크 미리보기에는 `AidWay 상담 접수` 제목과 주소만 표시되도록 전용 Open Graph 메타데이터를 적용했습니다.
- 고객 입력 화면을 에이더웨이 참고 화면의 딥 네이비, 블루·퍼플 그라데이션, 오렌지 포인트를 반영한 폼 중심 디자인으로 재구성했습니다.
- 데스크톱 2열 섹션과 모바일 1열 입력 구조, 큰 터치 입력창과 명확한 포커스 표시를 적용했습니다.
- 고객 작성 토큰, 제출 항목, TASK 자동 반영 방식은 그대로 유지합니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v84-aidway-intake-preview';`인지 확인하세요.

## v83 Language calendar · bullet journal · admissions

- Language Lab의 최근 2주 달력 셀을 다시 키우고, `학습 초기화`와 `학습 완료 보내기`를 박스 없는 밑줄 동작으로 바꿨습니다.
- 오늘 불렛저널에서 Archive/Travel, Language Lab, Pomodoro를 제거하고 일정·감정·루틴·건강·독서·워크플로우·금융·Record·메모/할 일 9개 범주만 표시합니다.
- 불렛저널을 점선 종이, 좌측 제본선, 번호·색상 표시가 있는 3×3 기록 카드 디자인으로 재구성했습니다.
- Graduate Admissions의 대학 카드 폭을 줄이고 8개 대학원 공식 입학 안내를 더해 총 56개로 확장했습니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v83-calendar-journal-admissions';`인지 확인하세요.

## v82 Language Lab · external intake

- 최근 2주 달력을 첫 번째 줄 전체에 배치하고, `학습 초기화`와 `상대에게 완료 기록 보내기`를 그 아래 한 줄에 나란히 배치했습니다.
- 직접 고객 추가와 외부 고객 작성 양식의 성별 선택을 여성·남성 두 항목으로 제한했습니다.
- 외부 링크 진입 시 보이던 링크 확인 대기 문구를 제거하고, 유효한 링크에서는 작성 폼을 바로 표시합니다.
- 링크 공유 설명 메타데이터를 제거해 복사된 주소 외의 소개 문구가 함께 전달되지 않도록 정리했습니다.
- 외부 고객 폼을 AIDWAY의 대학원 진학 컨설팅 맥락과 연결되는 블랙·아이보리·골드 디자인으로 바꾸고 모바일 입력 크기를 확대했습니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v82-language-intake-aidway';`인지 확인하세요.

## v81 Language Lab · compact client intake

- Language Lab의 연속 일수·학습 기록을 언어·난이도 선택 바로 옆에 하나의 제어 묶음으로 배치했습니다.
- 최근 2주 달력 오른쪽 아래에 `학습 초기화`와 `상대에게 완료 기록 보내기`를 위아래 2줄로 배치했습니다.
- 고객 직접 추가 팝업의 네 섹션을 데스크톱 2×2 구조로 압축하고 짧은 응답창의 높이를 줄여 스크롤을 최소화했습니다.
- 외부 고객 작성 링크에서는 AiderLog 본문과 배경을 완전히 숨기고 작성 폼만 표시합니다.
- 외부 폼에서 담당자 이름, 전달 대상, TASK 자동 반영 등의 안내 문구를 삭제했습니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v81-language-intake-only';`인지 확인하세요.

## v80 메인 프레임 상단 도구 · 전체 불렛저널

- 날짜·이름·메모장·우편함·검색을 AiderLog 타이틀 영역에서 분리해 메인 프레임 바로 위 오른쪽에 배치했습니다.
- 상단 날짜 글자를 키우고, 날짜를 누르면 오늘의 기록을 12개 범주로 확인할 수 있습니다.
- 일정·감정·루틴·건강·독서·워크플로우·금융·포모도로·Record·Archive/Travel·어학·메모/할 일을 기록 유무와 관계없이 항상 표시합니다.
- 기록이 없는 범주는 사라지지 않고 `오늘 기록 없음` 상태로 남아 불렛저널의 전체 구성을 한눈에 확인할 수 있습니다.
- v79의 Language Lab, PERSONAL/PAPER 글자 확대, TASK 고객 접수·파일·대학원 검색 기능을 그대로 유지했습니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v80-frame-tools-complete-journal';`인지 확인하세요.

## v79 Today Journal · Language Lab · TASK intake

- 상단 오른쪽을 `오늘 날짜 → 이름·메모장·우편함 → 검색` 3단으로 정리하고, 날짜를 누르면 오늘의 일정·감정·루틴·개인·이벤트·어학 기록을 불렛저널로 표시합니다.
- Language Lab 오른쪽 상단을 연속 일수·학습 기록·언어·난이도 순서로 재배치하고 초기화·완료 전송을 최근 2주 기록 오른쪽 아래로 이동했습니다.
- PERSONAL과 PAPER의 작은 본문·버튼·표·카드 글자를 확대했습니다.
- TASK 외부 링크 버튼을 CLIENT 버튼과 같은 크기의 각진 상자로 맞추고, 고객 파일 추가를 EDIT/DELETE 옆으로 옮겼습니다.
- 직접 고객 추가와 외부 고객 작성에 동일한 4개 섹션 양식을 적용하고 접수 내용을 `[상담접수] 날짜` 형식으로 CLIENT NOTE에 자동 정리합니다.
- Graduate Admissions를 가나다순 대학 검색형 그리드로 바꾸고 공식 입시 안내 링크를 48개 대학으로 확장했습니다.

배포할 때 앱 파일과 함께 `firestore.rules`도 Firebase에 다시 게시해야 새 외부 고객 접수 양식이 동작합니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v79-bullet-journal-intake-admissions';`인지 확인하세요.

## v78 TASK 고객 흐름 · 입시요강 화면

- PAPER와 TASK는 지정된 두 운영 계정에서만 표시
- 고객 직접 작성과 외부 링크 작성에 동일한 필드 적용
- 외부 작성 링크는 열 때마다 새 주소로 발급
- 다음 상담·진행 과업·상담/과업 패널을 눌러 기록 추가
- 고객 합격 상태와 2줄 요약 헤더
- TASK 화면을 넘기면 지역별 대학원 공식 입시요강 링크 표시
- v77의 Windows 위젯 제거·설치형 앱 업데이트·고객 파일 기능을 그대로 유지

## v76 TASK 지원 회차 필터 · 외부 고객 작성 링크

- TASK 왼쪽 목록에서 지원 학년도와 학기를 조합해 해당 지원자만 표시합니다.
- `CLIENTS` 배지는 `선택한 회차의 인원 / 전체 저장 인원`으로 표시합니다.
- 이름, 핸드폰 뒤 4자리, 학교, 기관, 과정, 전공을 하나의 검색창에서 찾습니다.
- `＋ CLIENT LINK`에서 외부 고객 작성 링크를 발급하고 복사할 수 있습니다.
- 고객은 로그인하지 않고 이름·연락처·학교·기관·과정·전공·지원 회차를 직접 제출합니다.
- 제출 자료는 링크 소유자의 TASK에 실시간으로 가져오며 제출 ID로 중복 반영을 막습니다.
- 새 링크를 발급하면 기존 링크는 비활성화됩니다.
- 외부 제출 경로를 고엔트로피 토큰, 필드 길이 검증, 소유자 전용 읽기·처리 규칙으로 보호합니다.

배포할 때 앱 파일과 함께 `firestore.rules`도 Firebase에 다시 게시해야 외부 고객 작성 링크가 동작합니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v78-consulting-workspace';`인지 확인하세요.

## v75 상단 레이아웃 · Brain 네트워크 · Windows 11 앱

- `made by bomin`을 AiderLog 타이틀 바로 아래로 옮기고, 이름·메모장·우편함과 검색을 오른쪽 2줄로 정리했습니다.
- 탭 높이와 상단 여백을 줄여 탭을 타이틀에 가깝게 올리고, 메인 프레임이 사용할 수 있는 높이를 늘렸습니다.
- Brain의 본문·세부 영역·질환·연구 카드 폰트를 확대했습니다.
- Brain 연구 모듈 10개를 관련도 순으로 하단 가로 탐색에 모두 노출합니다.
- 뇌 대영역을 확대하면 도트가 아니라 세부 영역별 색상 표면으로 구분됩니다.
- 질환 팝업의 진단 안내 문구를 삭제하고, 질환과 연관된 여러 뇌 영역을 하나의 네트워크로 표시합니다.
- Windows 앱 설치 설정에서 자동 시작·작업표시줄 고정 요청과 캘린더·Insight·클라이언트 위젯 선택을 저장합니다.
- Windows 11 Widgets Board용 Adaptive Card 3종과 서비스워커 동기화를 추가했습니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v75-windows-widgets-brain-atlas-header';`인지 확인하세요.

## v74 Language Lab · Brain Atlas · TASK 고객 검색

- Language Lab의 최근 14일 기록은 날짜·언어 셀만 남겨 잘림을 줄였습니다.
- Brain Atlas는 전체 뇌를 작게 보여준 뒤 영역 선택 시 확대하고, 색으로 구분된 세부 영역을 선택할 수 있습니다.
- Brain의 연구 모듈은 하단에 다시 배치했으며 `ADAPTIVE CONTROL`을 함께 확인할 수 있습니다.
- TASK 고객 검색과 지원 학년도·학기 기록을 추가했습니다.

- 로그인 후 기록 저장·관리 안내는 계정별 최초 1회만 표시되며, 브라우저를 다시 열거나 재로그인해도 반복되지 않습니다.
- 커플 연결 안내는 계정과 연결 상대 조합별 최초 1회만 표시됩니다.
- Language Lab 헤더에서 `언어 + 선택창 + 난이도 + 선택창`을 한 줄에 배치했습니다.
- 학습 목록 하단에 최근 14일의 날짜와 실제 학습한 언어를 보여주는 타임라인을 추가했습니다.
- 완료 및 복습 기록에 언어 정보를 저장하고 기존 기록도 Day ID를 기준으로 자동 판별합니다.
- TASK 탭의 계정 제한을 임시 해제해 모든 사용자에게 표시합니다. PAPER 탭의 기존 계정 제한은 유지합니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v74-brain-focus-language-task-search';`인지 확인하세요.

## v72 PERSONAL 패턴 대시보드

- 탭 이름을 `SCHEDULE · ROUTINE · EVENT · PERSONAL · PAPER · TASK`로 정리했습니다.
- TASK 탭의 노란 배경이 상단 둥근 모서리 밖으로 번지지 않도록 클리핑을 수정했습니다.
- PERSONAL Overview에서 포모도로 합계 보드를 삭제했습니다.
- 식사는 아침·점심·저녁·간식 비중과 평균 기록 시간, 평점이 높은 음식을 보여줍니다.
- 운동은 자주 한 종목의 비중과 종목별 최대 중량 변화를 보여줍니다.
- 운동 기록에 신체 사진을 첨부하고, 서로 다른 두 날짜의 사진을 나란히 비교할 수 있습니다.
- 독서는 기간 내 저장한 문장을 책 이름·페이지와 함께 나열합니다.
- 적금·예금·고정 지출은 납부 예정일을 날짜별 체크리스트로 보여주며 확인 상태가 개인 데이터에 저장됩니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v72-personal-pattern-dashboard';`인지 확인하세요.

## v71 ROUTINE Language Lab 재배치

- Language Lab의 본문·버튼·선택기·학습 창 글자를 전반적으로 확대했습니다.
- `ROUTINE · PRACTICAL CONVERSATION`과 중앙의 `현재 학습` 문구를 삭제했습니다.
- COURSE SELECT에 있던 언어·난이도 선택기를 헤더 중앙으로 옮겼습니다.
- 파란 과정 요약은 `01 [ 일상 ] 인사와 관계 시작` 한 줄 구조로 압축했습니다.
- 1~4단계 소요 시간 안내와 Day 카드 내부의 반복 단계 안내를 삭제했습니다.
- Day 카드 높이를 줄여 현재 구간의 Day 10개가 데스크톱 프레임에 모두 표시됩니다.
- COURSE SELECT는 카테고리 선택 영역만 남기고 높이를 줄였으며 MY WORDS를 확장했습니다.
- MY WORDS의 반복 제목과 자동 저장 안내를 삭제하고 최근 표현 노출을 2개에서 6개로 늘렸습니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v71-language-lab-density';`인지 확인하세요.

## v70 계정 전용 워크스페이스 · 계층형 3D Brain

- `qhals5060@gmail.com`으로 로그인한 경우에만 PAPER 탭이 표시됩니다.
- `aidway55@gmail.com`으로 로그인한 경우에만 TASK 탭이 표시됩니다.
- 로그아웃 상태와 다른 계정에서는 두 전용 탭을 처음부터 숨기며, 직접 탭 전환을 시도해도 SCHEDULE로 돌아갑니다.
- Brain 피질의 두께·원근·조명을 강화해 평면적인 인상을 줄였습니다.
- 전두엽·두정엽·측두엽·후두엽·소뇌·뇌간·해마·편도체를 선택한 뒤 세부 영역까지 탐색할 수 있습니다.
- 배외측/복외측/안와/복내측 전전두피질, 전대상피질, 브로카 영역, 베르니케 영역 등 기능적으로 중요한 세부 영역을 추가했습니다.
- `RELATED DISORDERS`의 개수 표기를 없애고 질환 선택 시 관련 뇌 영역 시각 자료와 전문 설명을 별도 팝업으로 표시합니다.
- 학습 모듈은 선택한 뇌 영역과 관련된 내용만 한 항목씩 표시해 Brain 화면의 세로 스크롤을 줄였습니다.

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v70-restricted-brain-atlas';`인지 확인하세요.

## v69 계정 · 어학 학습 · Daily Log · TASK

- 계정 팝업에서 닉네임을 저장하고, 받은 요청과 보낸 요청을 한 카드에서 확인합니다.
- 메모장과 우편함 아이콘의 크기와 시각 무게를 통일했습니다.
- ROUTINE 두 번째 프레임에 v18 어학 학습 엔진을 Shadow DOM 컴포넌트로 직접 통합했습니다. 별도 사이트나 iframe으로 이동하지 않습니다.
- Daily Log 포모도로는 1~180분 사용자 설정과 작업명을 지원하며, 완료 기록이 7일·30일 Overview에 표시됩니다.
- PAPER 뒤에 대학원 컨설팅 고객, 상담 일지, 마감 과업을 개인 저장소에서 관리하는 TASK 탭을 추가했습니다.

## v18 어학 학습 통합 방식

- 별도의 어학 사이트와 `iframe` 실행을 완전히 제거
- 사이트 첫 화면은 항상 AiderLog의 SCHEDULE로 시작
- 어학 학습은 `ROUTINE` 탭을 연 뒤 화면을 넘겼을 때만 표시
- AiderLog의 크림색 메인 프레임 안에 TODAY·COURSE·WORDBOOK·RECORDS를 직접 구성
- 영어·일본어·중국어, 언어별 5개 레벨과 6개 대분류·36개 상황 코스를 제공
- 상황별 50일 과정과 하루 4단계(단어 선택·문장 완성·발음 연습·실전 회화), 스마트 복습·단어장·학습 이력 지원
- 오늘 학습을 완료한 뒤에만 커플 상대에게 완료 기록 전송 가능
- 과거 `/language-study` 주소는 AiderLog 루트로 자동 복귀

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v69-language-lab-task-desk';`인지 확인하세요.

## v67 첫 화면 강제 복구

- 사이트 첫 실행 문서는 항상 루트 `index.html`의 AiderLog로 고정
- 어학 학습은 ROUTINE 탭의 두 번째 화면에서만 실행
- 과거 캐시가 어학 문서를 루트에서 열어도 AiderLog로 자동 복귀
- v64에서 남은 어학 전용 서비스워커와 캐시를 자동 정리
- 루트 서비스워커를 `aiderlog-v67-main-recovery`로 갱신하고 즉시 업데이트 확인
- Vercel Preview 주소를 구버전 Production 주소로 강제 이동시키던 스크립트 삭제
- `sw.js`, `index.html`, 어학 자산을 재검증하도록 Vercel 캐시 헤더 추가

배포 후 `https://aiderdear1.vercel.app/sw.js`의 첫 줄이
`const CACHE='aiderlog-v67-main-recovery';`인지 확인하세요. v64가 보이면 새 배포를 Production으로 승격하지 않은 상태입니다.

## v66 메인 복구·공유 안내·Brain·모바일 수정

- 루트 서비스워커가 다국어 학습 화면을 메인 `index.html` 캐시에 덮어쓰던 문제 수정
- 사이트 기본 진입은 항상 AiderLog, 다국어 학습은 ROUTINE 두 번째 화면에서만 표시
- 로그인 뒤 개인/커플 기록의 저장·공유 범위를 짧은 안내 창으로 표시
- 커플 연결 완료 시 SCHEDULE·EVENT만 공유되고 나머지 탭은 개인용임을 별도 안내
- 오늘의 루틴 수행과 어학 공부 완료 소식을 커플 상대에게 한 번 보낼 수 있는 버튼 추가
- PAPER Brain 3D 렌더러가 메인 상태를 전달받지 못해 빈 화면이 되던 문제 수정
- 8개 뇌 영역마다 대표 질환 10개, 한글·영문명, 클릭형 전문 설명 추가
- Brain 학습 주제를 네트워크 역학, 신경조절, 신경진동, 강화학습, 수면 공고화, BOLD, 발달 가소성까지 확장
- 모바일 강제 다크모드에서도 밝은 콘텐츠와 입력창 대비를 유지
- 가로 움직임·버튼 조작을 세로 페이지 전환으로 오인하지 않도록 터치 판정 개선

배포 시 Vercel의 Root Directory는 비워 두고 이 폴더 전체를 배포하세요.

## v65 보존 정책·백업·어학 학습·PERSONAL 가독성

- PERSONAL의 건강·독서·워크플로우·금융·포모도로 및 입력 창 글자를 확대하고 크기 체계를 통일
- EVENT의 Archive·Travel 헤더 구분선을 Record·Album과 같은 한 줄 구성으로 정리
- 커플 공유 범위를 SCHEDULE(일정·감정)과 EVENT(Record·Album·Archive·Travel)로 한정
- 로그인 후 6개월이 지난 정리 대상 기록이 있으면 안내하고 동의한 경우에만 삭제
- EVENT의 Record·Travel, PERSONAL의 Workflow·Finance, PAPER는 6개월 정리 대상에서 영구 제외
- 영상 업로드를 최대 5분·120MB로 확장하고 큰 영상의 무료 저장공간 영향을 로그인 창에 표시
- 30일마다 EVENT Record·Travel의 JSON과 원본 미디어를 Google Drive에 백업할지 확인
- 첨부된 `study with me v18`의 영어·일본어·중국어 학습 앱을 ROUTINE 두 번째 페이지에 통합

## v64 기록 삭제·PAPER 3D Brain 수정

- 일정·감정·사진·앨범·루틴·PERSONAL·PAPER 등 사용자가 추가한 기록에 삭제 기능 제공
- 앨범 폴더 삭제 시 내부 미디어 기록을 기본 앨범으로 안전하게 이동
- 논문 삭제 시 연결된 Insight·Comparison·Research Note·Connection 참조 정리
- PAPER Brain을 회전·영역 선택이 가능한 실시간 3D 모델로 교체
- 뇌 영역별 회로, 계산 기능, 연결망, 임상적 해석을 뇌과학·인지신경과학 수준으로 확장
- `RELATED PAPERS`를 영역별 `RELATED DISORDERS`로 교체

## v63 브랜드·PAPER Brain 수정

- 화면·설치 정보의 브랜드를 AiderLog로 변경하고 `DEAR US, ALWAYS` 문구 제거
- `MADE BY BOMIN`을 메인 프레임 바로 아래 바깥쪽에 작은 서명으로 배치
- PAPER 좌측 탐색 영역의 폭을 축소
- PAPER에 회전 가능한 입체형 Brain 학습 화면 추가
- 전두엽·두정엽·측두엽·후두엽·소뇌·뇌간·해마·편도체의 기능, 임상 단서, 연구 키워드 제공
- 뇌 영역 키워드와 PAPER Library 논문을 자동 연결

## v62 EVENT·PERSONAL·PAPER 수정

- Album의 폴더 카드는 원래 둥근 디자인으로 복원하고 Album 페이지 프레임만 각진 형태로 변경
- Travel 폴더 오른쪽 위에 삭제 버튼을 추가하고 폴더 삭제 시 여행 기록은 다른 폴더로 안전하게 이동
- 금융에 수익 유형을 추가하고 적금·예금·유동 지출·수익·고정 지출별 전용 입력 필드 제공
- PERSONAL 두 화면의 전환을 ROUTINE과 동일한 세로 페이지 넘김 효과로 통일
- PAPER의 탐색, 표, 카드, Insight, Compare, Notes, Connections 전반의 글자 크기 확대

## v61 화면 밀도·PERSONAL 대시보드 개선

- ROUTINE의 MINI·MORE·MAX 글자를 키우고 설명 영역을 줄여 스탬프 보드를 확장
- EVENT 전체 프레임을 `#FAFAF8`로 통일하고 Album 카드를 각진 사각형으로 변경
- PERSONAL 식사·운동 입력을 각각 전용 팝업으로 고정
- 금융을 적금·예금, 유동 지출·입금 예정, 고정 지출로 재구성
- PERSONAL 두 번째 화면에 건강·독서·워크플로우·금융 통합 대시보드 추가
- PAPER 검색과 논문 추가를 좌측 탐색 영역으로 이동하고 반복 타이틀·안내 문구 삭제
- PAPER의 Dashboard, Library, Insight, Compare, Notes, Connections를 밀도 높게 재배치해 스크롤 축소

## v60 PAPER 연구 워크스페이스

- PAPER를 개인 대학원생용 연구 워크스페이스로 전면 개편
- Dashboard, Library, Insights, Compare, Research Notes, Connections, Tags, Settings 제공
- ChatGPT 논문 분석 결과를 `[heading]` 기준으로 파싱하고 수정 가능한 Preview 후 저장
- 논문 상세에서 Overview, Insights, Source Notes, Connections를 하나의 흐름으로 연결
- 논문별 AI Candidate Insight를 검토해 정식 My Insight로 전환
- 여러 논문의 연구 질문·이론·대상·방법·결과·한계를 가로 비교하고 Comparison 저장
- Notion형 Research Note 편집기와 연결 Papers·Insights 우측 패널 제공
- Paper, Author, Concept, Theory, Method, Insight, Research Note 지식 그래프 제공
- 제목·저자·연도·방법·상태·중요도·태그 필터와 전체 통합 검색 지원
- Generative AI·Higher Education·Self-Regulated Learning 중심의 가상 샘플 6편 제공
- 외부 AI API를 호출하지 않으며 PAPER 데이터는 로그인한 본인의 개인 Firebase 공간에 저장

## v59 PERSONAL·PAPER 변경

- SCHEDULE·ROUTINE·EVENT·PERSONAL·PAPER의 메인 콘텐츠 프레임을 완전한 사각형으로 통일
- PERSONAL 상단에 건강·독서·워크플로우·금융 전환 버튼과 작은 포모도로를 한 줄로 배치
- 건강 화면을 오늘의 식사 2칸·최근 운동 3칸 비율로 구성하고 입력을 팝업으로 분리
- 아침·점심·저녁·간식별 사진, 평점, 장소 기록과 평점별 식사 모아보기 지원
- 같은 운동 종목의 최근 중량 또는 횟수 추이를 미니 그래프로 표시
- 독서를 읽은 책·읽고 싶은 책 표지 책장과 책 이름·페이지가 붙은 문장 목록으로 분리
- 워크플로우를 예정·진행 중·완료 보드로 확장하고 프로젝트, 진행률, 마감일, 다음 행동 저장
- 금융을 적금·예금과 고정 지출로 2분할하고 카드·계좌, 주기, 목표 금액, 만기일을 한눈에 표시
- Midnight Blue `#00264B` PAPER 탭을 추가해 논문 서지·상태·링크·키워드·요약·메모 정리 지원

## v58 FRAME·ROUTINE·PERSONAL 변경

- SCHEDULE·ROUTINE·EVENT·PERSONAL과 EVENT 전환 이후 화면의 메인 콘텐츠 종이를 `#FAFAF8`로 통일
- 루틴의 최근 시작·완성 회차·총 실천을 루틴 전환 아이콘과 같은 검정 상단 줄로 이동
- 루틴 설명 상자를 위로 올리고 스탬프 보드 높이·행·열을 기간에 맞게 다시 계산
- 20일 루틴은 정확히 20개 스탬프를 10개씩 두 줄로 표시하고 30일은 세 줄, 장기 루틴은 네 줄 가로 이동으로 표시
- PERSONAL의 `DAILY SYSTEM` 문구를 제거하고 날짜 옆에 작은 포모도로 타이머 배치
- PERSONAL을 페이지 스크롤 없이 한 프레임에 보이는 대시보드·입력·최근 기록 구조로 재배치
- 식사와 운동을 `건강`으로 합치고 영양 성분 입력·계산 제거
- 고정 지출을 `금융`으로 확장해 카드·계좌, 주기, 결제일, 적금·예금, 목표 금액과 만기일 기록 지원

## v57 SCHEDULE·LANGUAGE 변경

- 메인 콘텐츠 프레임만 Cream Ivory `#FFF8E7`로 통일하고 사이트 바깥 Eggplant 배경은 유지
- 감정 기록의 상황 질문을 `무슨 일이 있었나요?`로 변경하고 실제 사건 중심 11개 선택지 적용
- 감정 당시 활동을 업무·회의·공부·대화·이동·모임·개인 용무·취미·SNS·기타로 재구성
- 감정 당시 활동을 여러 개 동시에 선택하고 저장할 수 있도록 확장
- 감정 이후 행동 질문과 11개 선택지를 문제 해결·거리 두기·전환·기록·호흡 흐름으로 정리
- ROUTINE을 아래로 넘기면 오늘의 일본어 문장, 음성 듣기, 말하기 미션, 단어, 개인 노트가 이어지는 학습 페이지 제공
- 학습 완료일·연속 학습·단어 암기·말하기 자신감·개인 노트를 본인 전용 데이터로 저장

## v56 ROUTINE 카드 변경

- 루틴 전환 아이콘을 카드 중앙에서 `EDIT` 바로 왼쪽으로 이동
- `· THIS ROUND` 문구 삭제
- 최근 시작·완성 회차·총 실천을 루틴 설명 영역 상단으로 이동
- 하단 통계 줄을 없애 확보한 높이를 스탬프 영역에 배분
- 7·14·20·21·30·66·100일 설정에 맞춰 스탬프 수를 정확히 생성
- 20일 루틴의 마지막 5개가 세로로 잘리던 레이아웃 오류 수정
- 루틴 길이에 따라 스탬프 행·열과 최소 높이를 자동 계산

## v55 EVENT·TRAVEL 변경

- 사이트 바깥 배경은 Eggplant `#46444D`, 실제 콘텐츠 프레임은 Cosmic Latte `#FFF8E7`로 분리
- EVENT의 Record/Album 및 Archive/Travel 화면을 다른 탭과 같은 둥근 메인 프레임으로 통일
- Travel의 `여행 계획·장소·음식·놀거리` 버튼을 상단 툴바로 이동하고 일반 `여행 기록` 버튼 제거
- `TRIP FOLDERS` 영역의 배경과 테두리를 없애고 여행지 카드를 폴더 형태로 변경
- 새 여행지 폴더에 색상, 출발일, 도착일을 지정하고 기록과 함께 저장
- 기존 여행지 폴더와 연결된 여행 기록은 그대로 유지

Google 계정으로 로그인하고, 상대에게 커플 요청을 보내 수락된 두 사람만 SCHEDULE과 EVENT를 공유하는 설치형 웹앱(PWA)입니다. 루틴·PERSONAL·PAPER와 개인 메모·체크리스트는 커플 연결 여부와 관계없이 본인만 볼 수 있습니다.

## 적용된 방식

- 로그인: Firebase Authentication의 Google 제공업체
- 데이터: Cloud Firestore
- 커플 연결: 이메일 초대 → 상대 계정에서 명시적 수락
- 권한: 커플 문서에 기록된 두 UID만 공유 공간 접근
- 중복 방지: 한 Google 계정은 동시에 한 커플에만 연결
- 미디어: 유료 Storage 없이 Firestore 조각 문서 사용
- 요금제: Firebase Spark 무료 요금제로 실행 가능

사진은 업로드 전에 자동 압축됩니다. 사진은 25MB 이하, 영상은 최대 5분이면서 120MB 이하까지 저장할 수 있습니다. Firestore Spark의 1GiB 무료 저장 한도는 그대로이므로 큰 영상을 여러 개 저장하면 한도가 빠르게 소진될 수 있습니다.

6개월이 지난 일정·감정·Archive·건강·독서·루틴 수행 기록은 로그인 시 정리 안내가 뜨며, 사용자가 동의한 경우에만 삭제됩니다. Record·Travel·Workflow·Finance·PAPER는 정리 대상에서 제외됩니다. 30일마다 Record와 Travel은 Google Drive 백업 동의를 다시 확인합니다.

## Firebase 설정

1. Firebase Authentication에서 Google 로그인 제공업체를 활성화합니다.
2. Authentication → 설정 → 승인된 도메인에 `aiderdear1.vercel.app`을 추가합니다.
3. Firestore `(default)` 데이터베이스를 생성합니다.
4. `firestore.rules` 전체 내용을 Firestore → 규칙에 붙여넣고 게시합니다.
5. 30일 EVENT 백업을 사용하려면 같은 Google Cloud 프로젝트에서 `Google Drive API`를 사용 설정합니다. 백업 시에만 `drive.file` 권한을 별도로 요청합니다.

이미 위 항목을 완료했다면 다시 만들 필요는 없습니다. 이 폴더의 `firebase-app.js`에는 `aiderdear-1bbca` 프로젝트 공개 웹 설정이 들어 있습니다. Firebase 웹 API 키는 브라우저 앱에 포함되는 공개 식별자이며, 실제 데이터 보호는 `firestore.rules`가 담당합니다.

## Vercel 배포

이 폴더 안의 파일을 현재 Vercel 프로젝트 루트에 그대로 배포합니다. 특히 다음 파일명이 유지되어야 합니다.

- `index.html`
- `firebase-app.js`
- `firestore.rules`
- `manifest.webmanifest`
- `sw.js`
- 이미지와 아이콘 파일

배포 후 `https://aiderdear1.vercel.app/`을 강력 새로고침하세요. 설치형 앱을 이미 추가했다면 앱을 완전히 종료한 뒤 다시 열어 새 서비스 워커를 적용합니다.

`aiderdear1-git-main-...vercel.app` 같은 Vercel 미리보기 주소는 브라우저 로그인 저장공간이 정식 주소와 다릅니다. v46은 미리보기 주소를 정식 주소로 자동 이동해 로그인과 커플 상태가 한 곳에서 유지되도록 합니다.

## 커플 연결 확인

1. A 계정으로 로그인합니다.
2. 로그인 창에서 B의 정확한 Google 이메일로 `커플 요청 보내기`를 누릅니다.
3. 시크릿 창이나 다른 기기에서 B 계정으로 같은 사이트에 로그인합니다.
4. B의 `받은 요청`에서 `수락`을 누릅니다.
5. 두 계정 모두 상대 이름이 `연결됨`으로 표시되는지 확인합니다.
6. 한쪽에서 일정을 저장해 다른 쪽에 바로 나타나는지 확인합니다.

## 데이터 범위

- 커플 수락 전: 각자의 개인 공간
- 커플 수락 후 공유: SCHEDULE의 일정·감정·D-day·월간 미디어, EVENT의 Record·Album·Archive·Travel
- 항상 개인: 메모장, 체크리스트, 루틴·어학 학습, 건강·독서·워크플로우·금융·포모도로, PAPER 연구 기록
- 연결 해제 후: 두 계정 모두 개인 공간으로 복귀하며 해제된 커플 공간에는 다시 접근할 수 없음

v40까지 사용한 Google Drive·Calendar 데이터는 원래 Google 계정에 그대로 남아 있지만 v41로 자동 이전되지는 않습니다.

## v54 SCHEDULE·ROUTINE 변경

- SCHEDULE의 사진 빈 공간에는 `사진/동영상 추가` 문구만 표시
- 루틴 통계와 BIG GOALS를 팔레트 적용 이전의 흰색 카드로 복원
- 루틴 생성·수정 화면에서 오렌지·블루·바이올렛·그린·핑크·피치·블랙 색상 선택 복원
- 루틴 카드를 검정 헤더, 선택 색상의 정보 카드·스탬프 보드·하단 통계 구조로 재정리
- 루틴 이름은 작게, MINI·MORE·MAX 단계명과 설명은 더 크게 표시
- 7일은 1줄, 14일은 2줄, 20~30일은 최대 4줄로 스탬프 보드를 고르게 사용
- 66일·100일은 4줄 순서를 유지하며 가로 스크롤로 확인

## v53 색상·메모장 변경

- 인사이트의 10개 감정을 참고 팔레트 안에서 서로 구분되는 전용 색으로 재배정
- 달력 감정 칩, 도넛 그래프, 인사이트 비율, 감정별 분석 카드에 동일한 색상 체계 적용
- 상단 메모장에서 할 일을 만들 때 마감일을 함께 설정
- 저장된 메모의 마감일을 목록에서 바로 변경하거나 삭제
- 완료되지 않은 지난 마감일은 붉은 계열로 강조
- 전체 바깥 프레임과 모바일 상·하단 영역을 Cosmic Latte `#FFF8E7`로 변경
- 기존 개인 메모와 감정 기록은 그대로 유지

## v52 SCHEDULE 감정 기록 변경

- `+ 일정 등록`과 `+ 감정 기록`을 동일한 연한 사각형 버튼으로 통일
- 이번 달 사진·동영상 빈 공간의 색상 배경 제거
- 감정 기록 창의 질문·입력·선택 버튼 글자 크기를 한 체계로 통일
- 상황·그때 한 활동·그 후 한 행동을 각각 기타 포함 11개 선택지로 확장
- 지금 하고 싶은 것에 `기타` 선택 추가
- 날짜·시간·장소·함께 있는 사람을 한 줄에서 기록하도록 재배치
- 장소와 동행인 데이터를 최근 30일 인사이트의 반복 맥락·감정 패턴 분석에 연결
- 기존 감정 기록은 장소와 동행인이 비어 있는 상태로 그대로 유지

## v51 PERSONAL 생활 기록 변경

- 식사를 아침·점심·저녁·간식으로 나누고 칼로리, 탄수화물, 단백질, 지방, 하루 목표를 기록
- 오늘의 총 섭취량과 목표 달성 링, 영양소 막대, 끼니별 현황을 한 화면에 표시
- 음식 사진을 촬영하거나 선택해 식사 기록에 함께 보관
- 한 운동 기록 안에 여러 운동 종목을 만들고, 종목마다 세트·중량·횟수를 반복 입력
- 최근 운동 횟수, 기록 세트, 총 볼륨과 세트별 내용을 운동 보드에 표시
- 책 표지, 저자, 현재·전체 페이지, 읽은 시간, 기억할 문장을 독서 기록에 저장
- 기록한 책을 책장 형태로 정리하고 수집한 문장을 별도 카드로 표시
- 워크플로우는 단계별 진행 흐름, 고정지출은 결제 주기와 결제일 중심으로 유지
- 기존 PERSONAL 기록을 삭제하지 않고 새 상세 구조로 안전하게 불러오기
- 휴대폰에서는 대시보드·입력 폼·기록 카드가 한 열로 이어지도록 반응형 재구성

## v50 팔레트·아카이브·트레블·PERSONAL 변경

- 전체 배경을 Eggplant `#46444D`로 변경
- SCHEDULE은 Violet `#B1A6D0`, ROUTINE은 Lavender `#D2D2E0`, EVENT는 Sprout `#738E84`, PERSONAL은 Pink `#E5B6B8`로 통일
- 각 탭의 생성 버튼과 생성된 카드도 해당 탭 색상으로 연결
- Archive의 공통 문구를 제거하고 영화·공연·책·음악별 입력 항목과 안내 문구를 분리
- Travel에서 여행 계획·장소·음식·놀거리를 구분해 기록하고, 여행지 폴더를 만들어 저장 단계에서 자동 분류
- PERSONAL을 횟수 집계가 아닌 사진·내용·업무 흐름 중심의 개인 기록장으로 변경
- PERSONAL 사진은 커플 공유 공간이 아닌 본인 전용 Firestore 경로에 저장

## v49 루틴·앨범·PERSONAL 변경

- 이번 회차 습관 통계의 내부 간격과 요약 카드 높이를 조정해 하단 공백 축소
- 루틴 카드 상단의 `MINI·MORE·MAX` 문구 제거
- 최대 100일 스탬프를 왼쪽에서 오른쪽 순서로 4줄 배치하고 가로 스크롤로 확인
- EVENT의 Record·Album·Archive·Travel을 같은 프레임, 제목선, 내부 여백으로 통일
- 앨범 수가 1~4개면 2×2, 5~9개면 3×3, 10~20개면 5×4의 동일 크기 칸으로 자동 전환
- 마지막 탭을 `PERSONAL`로 변경하고 식사·운동·독서·워크플로우·고정지출 기록 추가
- 25분 집중, 5분 휴식, 15분 긴 휴식 포모도로와 일일 완료 세션 기록 추가

## v48 루틴 카드·EVENT 통합 변경

- Routine 제목 아래 구분선과 카드 사이에 여백을 추가하고, 카드 하단도 전체 프레임 안에 머물도록 높이 조정
- 참고 이미지처럼 검정 상단, 선명한 컬러 정보 카드, 별도 원형 기록판, 하단 통계로 루틴 카드 재디자인
- 7~100일 원형 기록을 4줄로 배치하고 기간이 길면 가로로 이동해 확인
- 기존 `RECORD` 탭의 이름을 `EVENT`로 변경하고 별도 EVENT 탭 제거
- EVENT 첫 화면을 `Record + Album` 좌우 2분할로 구성
- 화면을 넘기면 `Archive + Travel` 좌우 2분할이 나타나도록 통합
- 모바일에서는 각 2분할 화면을 세로로 이어서 확인한 뒤 다음 화면으로 전환

## v47 일정·인사이트·루틴 변경

- `This Month`는 색 배경과 옆선을 제거하고 가로 줄만 남긴 일정 노트로 정리
- 이번 달 사진 영역의 외곽선과 장식 테두리를 제거
- 인사이트의 세 카드 높이를 줄이고 위로 올려 바깥 프레임과 겹치지 않게 조정
- 감정 도넛과 비율 목록에 기록 가능한 10개 감정을 모두 표시
- 안내용 설명 문구를 제거하고 빈 상태는 간단한 표시만 유지
- `PRIVATE` 탭을 `ROUTINE`으로 변경
- 루틴 첫 화면을 왼쪽 2 : 오른쪽 3 비율로 나누어 왼쪽에 이번 회차 습관 통계와 BIG GOALS, 오른쪽에 루틴 카드를 배치
- 7~100일 기록 원형은 루틴 카드 안에서 가로로 이동하며 확인
- 루틴 두 번째 화면은 이후 언어 학습 기능을 위한 빈 화면으로 유지
- 루틴 안쪽의 중복 가로선을 제거해 다른 탭과 같은 단일 프레임으로 통일

## v46 로그인·스케줄·인사이트 변경

- 모든 Vercel 미리보기 주소를 정식 `aiderdear1.vercel.app`으로 자동 이동해 로그인 상태 통일
- 수락된 초대의 커플 문서·멤버십이 일부 누락된 경우 로그인 직후 자동 복구
- 혼자 사용할 때 `This Month`에 내 일정만 표시하고, 커플 연결 시 `COUPLE SCHEDULE` 버튼 제공
- 상단 설치 상자를 삭제하고 개인용 체크리스트 메모장 추가
- 커플 연결 전에는 우편함을 숨기고 연결된 두 사람만 편지 기능 사용
- 대한민국 법정공휴일과 대체·임시공휴일을 월간 달력에 표시
- 월간 일정 목록을 줄노트 형태로, 사진 영역을 단정한 카드 형태로 변경
- 인사이트를 프레임 안의 3열 구조로 재배치하고 감정 비율을 도넛 아래에 표시
- CARE와 인사이트의 중복 `오늘 감정 기록` 상자 제거
- Galaxy Flip과 일반 휴대폰에서는 인사이트 카드를 한 열로 쌓아 세로 확인

## v42 루틴 화면 변경

- `ROUTINES`와 `+ CREATE`를 Routine 제목 오른쪽, 구분선 위로 이동
- BIG GOALS 입력을 루틴당 최대 3개로 제한
- 하단 진행표를 BIG GOALS가 아닌 최근 10일의 루틴별 수행 현황으로 변경
- 데스크톱 루틴 대시보드를 프레임 높이에 맞춰 내부 세로 스크롤 제거

## v43 반응형 루틴 화면 변경

- 루틴에 설정한 7·14·20·21·30·66·100일을 통계, DAY 진행률, 기록 칸 수에 그대로 반영
- 루틴 기록 칸을 낮은 한 줄형 가로 스크롤로 변경하고 오늘 날짜가 자동으로 보이도록 이동
- 루틴별 진행 현황에 등록한 모든 루틴을 표시하고, 여러 루틴은 영역 안에서 세로로 확인
- SCHEDULE·EMOTION·RECORD·EVENT·PRIVATE의 작은 한글과 주요 조작 버튼 크기 확대
- 휴대폰에서 카드가 한 열로 쌓이고, 달력·루틴 기록표·진행표가 필요한 방향으로만 스크롤되도록 보강

## v45 일정·감정 통합 변경

- 스케줄 상단의 `+ 일정 등록` 옆에 `+ 감정 기록` 버튼 추가
- 월간 일정 캘린더 안에 본인·상대의 감정 표정과 사용자 색상 점을 함께 표시
- 감정 표정을 누르면 해당 날짜의 두 사람 기록을 바로 확인·수정
- 스케줄 두 번째 화면을 최근 30일 감정 인사이트로 교체
- 기존 EMOTION 탭 자리에 PRIVATE 메모·체크리스트·루틴을 이동
- 기존 마지막 PRIVATE 탭은 `＋`로 표시되는 빈 기능 공간으로 유지
- 휴대폰 하단 메뉴와 세로 스크롤형 인사이트 화면을 새 구조에 맞게 최적화

## v44 스케줄·모바일 앱 변경

- `Together This Month`에 개인·상대·공유 일정을 모두 표시하고 사용자 색상으로 구분
- 월간 목록 상단 3개 일정은 전체 너비, 이후 일정은 사진 옆 좁은 영역에서 최대 두 줄로 표시
- 화면 전환 뒤에 있던 커플 사진·동영상을 `Together This Month` 오른쪽 하단으로 이동
- PRIVATE의 개인 메모 2개를 스케줄 두 번째 화면의 이전 사진 영역으로 이동
- PRIVATE 첫 화면은 체크리스트 전용으로 확장
- Galaxy Fold 펼친 화면은 데스크톱형 두 칸 구성을 유지
- Galaxy Flip과 일반 휴대폰은 세로 달력, 큰 터치 버튼, 하단 앱 메뉴로 재구성
- Android Chrome에서 `APP 설치` 버튼으로 홈 화면에 설치 가능한 PWA 제공

## 포함 파일

- `index.html` — 화면과 앱 기능
- `firebase-app.js` — Firebase 로그인, 초대, 공유 저장
- `firestore.rules` — 사용자·커플 데이터 접근 규칙
- `manifest.webmanifest`, `sw.js` — PWA 설치와 캐시
- `aiderdear-icon.*`, `aiderdear-sky.jpg` — 앱 이미지
- `업데이트_내용.txt` — 버전 변경 내역
