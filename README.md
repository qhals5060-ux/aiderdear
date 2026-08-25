# AiderDear v42

Google 계정으로 로그인하고, 상대에게 커플 요청을 보내 수락된 두 사람만 일정·감정·기록·앨범·이벤트를 공유하는 설치형 웹앱(PWA)입니다. PRIVATE 메모·체크리스트·루틴은 커플 연결 여부와 관계없이 본인만 볼 수 있습니다.

## 적용된 방식

- 로그인: Firebase Authentication의 Google 제공업체
- 데이터: Cloud Firestore
- 커플 연결: 이메일 초대 → 상대 계정에서 명시적 수락
- 권한: 커플 문서에 기록된 두 UID만 공유 공간 접근
- 중복 방지: 한 Google 계정은 동시에 한 커플에만 연결
- 미디어: 유료 Storage 없이 Firestore 조각 문서 사용
- 요금제: Firebase Spark 무료 요금제로 실행 가능

사진은 업로드 전에 자동 압축됩니다. 모든 미디어는 파일당 25MB로 제한됩니다. Firestore 무료 할당량을 넘으면 사용량 제한이 생길 수 있으므로 긴 동영상 보관 용도로는 적합하지 않습니다.

## Firebase 설정

1. Firebase Authentication에서 Google 로그인 제공업체를 활성화합니다.
2. Authentication → 설정 → 승인된 도메인에 `aiderdear1.vercel.app`을 추가합니다.
3. Firestore `(default)` 데이터베이스를 생성합니다.
4. `firestore.rules` 전체 내용을 Firestore → 규칙에 붙여넣고 게시합니다.

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

## 커플 연결 확인

1. A 계정으로 로그인합니다.
2. 로그인 창에서 B의 정확한 Google 이메일로 `커플 요청 보내기`를 누릅니다.
3. 시크릿 창이나 다른 기기에서 B 계정으로 같은 사이트에 로그인합니다.
4. B의 `받은 요청`에서 `수락`을 누릅니다.
5. 두 계정 모두 상대 이름이 `연결됨`으로 표시되는지 확인합니다.
6. 한쪽에서 일정을 저장해 다른 쪽에 바로 나타나는지 확인합니다.

## 데이터 범위

- 커플 수락 전: 각자의 개인 공간
- 커플 수락 후: 일정, 기록, 감정 공유 사본, 이벤트, 앨범, D-day, 편지 등은 커플 공간
- 항상 개인: PRIVATE 메모, 체크리스트, 루틴
- 연결 해제 후: 두 계정 모두 개인 공간으로 복귀하며 해제된 커플 공간에는 다시 접근할 수 없음

v40까지 사용한 Google Drive·Calendar 데이터는 원래 Google 계정에 그대로 남아 있지만 v41로 자동 이전되지는 않습니다.

## v42 루틴 화면 변경

- `ROUTINES`와 `+ CREATE`를 Routine 제목 오른쪽, 구분선 위로 이동
- BIG GOALS 입력을 루틴당 최대 3개로 제한
- 하단 진행표를 BIG GOALS가 아닌 최근 10일의 루틴별 수행 현황으로 변경
- 데스크톱 루틴 대시보드를 프레임 높이에 맞춰 내부 세로 스크롤 제거

## 포함 파일

- `index.html` — 화면과 앱 기능
- `firebase-app.js` — Firebase 로그인, 초대, 공유 저장
- `firestore.rules` — 사용자·커플 데이터 접근 규칙
- `manifest.webmanifest`, `sw.js` — PWA 설치와 캐시
- `aiderdear-icon.*`, `aiderdear-sky.jpg` — 앱 이미지
- `업데이트_내용.txt` — 버전 변경 내역
