# AiderDear v35

둘만의 일정, 감정 기록, 사진·동영상, 이벤트, 여행, PRIVATE 루틴을 한곳에서 관리하는 정적 웹앱입니다.

## 실행

이 폴더 전체를 정적 웹 호스팅에 올리세요. 로컬 확인은 폴더 안에서 간단한 HTTP 서버를 실행한 뒤 브라우저로 접속하면 됩니다. Google 로그인과 설치형 앱(PWA)은 `file://`로 직접 열 때가 아니라 HTTPS 또는 localhost 환경에서 동작합니다.

## Google 연결

1. Google Cloud Console에서 OAuth 2.0 웹 클라이언트를 만듭니다.
2. 실제 사이트 주소를 승인된 JavaScript 원본에 등록합니다.
3. 앱의 로그인 창에서 클라이언트 ID, 관리자 이메일, 사용할 구성원을 저장합니다.
4. 로그인할 때 Calendar와 Drive 권한을 허용합니다.

사용자 기록은 별도 서버가 아니라 연결한 Google Calendar와 Google Drive에 저장됩니다. 운영 전에는 OAuth 동의 화면과 승인된 도메인 설정을 확인하세요.

## 포함 파일

- `index.html` — 전체 화면과 기능
- `manifest.webmanifest` — 설치형 앱 정보
- `sw.js` — 오프라인 앱 셸 캐시
- `aiderdear-icon.svg`, `aiderdear-icon-*.png` — 앱 아이콘
- `aiderdear-sky.jpg` — 배경 이미지
- `업데이트_내용.txt` — 개선 내역
