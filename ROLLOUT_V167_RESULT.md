# v167 개인용 무료 운영 전환 결과

## 적용 완료 — 2026-09-07

- 기존 Vercel Hobby / Firebase Spark 유지. 결제 계정 연결, 요금제 변경, 유료 기능 활성화 없음.
- 운영 주소: https://aiderdear1.vercel.app
- 앱/API 배포 커밋: `4dc8d36c13e14c422b8ac43cfe6bc089a94e6717`.
- 해당 배포: `dpl_78NQbBQS76J868Faw28SJSkmQ9Qw`, READY, Node 24, Git main 자동 배포.
- 임시 호환 규칙 게시 후 웹/API·APK/PC 다운로드를 갱신하고, 실제 인증 조회를 확인한 뒤 최종 `firestore.rules`를 게시했습니다. Firebase 콘솔 게시 표시는 `오늘 • 2:09 오전`이었습니다.
- 실제 로그인 복원, 기존 일정 조회, Consult 고객 조회·새로고침, Work 인증·DB 연결 확인. Work의 초기 공간 생성은 본인 확인 단계로 남겼습니다.
- 운영 핵심 자산 13개 HTTP 200 및 배포 Git 원본 일치. Work/Consult API는 GET 405, 미인증 POST 401, 허용되지 않은 origin POST 403, private/no-store 확인.
- APK와 모던·에디토리얼 ZIP 다운로드 200, 파일 크기·MIME·첨부파일명 확인. 해시는 `release-v167.json`에 기록했습니다.

## 무료 사용과 백업

유료 업그레이드 안내는 **Firebase 관리형 전체 내보내기/백업** 때문이었으며, 이 개인 사이트의 기본 로그인·Firestore 저장을 위해 Blaze로 변경한 것이 아닙니다.

관리형 전체 데이터 백업은 실행하지 않았습니다. 기존 규칙 원본, Git 복구본과 이전 설치 파일은 별도로 보관했습니다. 소스/규칙 복구본은 사용자 데이터 전체 백업을 대신하지 않습니다. 이번 전환에서는 실사용 데이터 이전·삭제와 기존 실험노트 링크 폐기를 하지 않았습니다.

무료 한도 내에서 운영합니다. 사진·동영상과 기록이 늘어나면 Firestore 저장 공간 및 읽기·쓰기 한도를 소모하며, 한도 초과 시 기능이 일시 제한될 수 있습니다. 무제한 무료 서비스를 보장하지 않습니다. Firebase Storage/Cloud Functions/관리형 백업 같은 결제 요구 기능을 새로 사용하지 않았습니다.

- 공식 안내: https://firebase.google.com/docs/firestore/manage-data/export-import
- 무료 한도: https://firebase.google.com/docs/firestore/quotas
- 개인용 호스팅: https://vercel.com/docs/plans/hobby

## 보존과 복구

- 이전 앱/사이트 배포 커밋: `f3d9cba22dd0b2cd83e3827b447fd1e8e356c536`.
- 이전 배포: `dpl_386F9ESyz93TovRQg1ic2w5BrV2r`.
- 규칙 백업: 로컬 outputs의 `firestore-v165-live-backup-20260907.rules`.
- 임시 호환 규칙: 로컬 outputs의 `firestore-v167-transition-20260907.rules`.
- 최종 규칙: 저장소 `firestore.rules`, 로컬 outputs의 `firestore-v167.rules`.
- 교체된 다운로드 3개는 해시 검증 후 로컬 `outputs/rollback-v165-downloads-20260907-021056/`에 보관했습니다. 배포 폴더에서 67,067,759바이트를 덜어냈으며 Git 이력은 변경하지 않았습니다.
- 서버/웹/APK/규칙은 함께 고려하여 복구해야 합니다. 구형 APK만 되돌리면 최종 규칙 아래에서 Consult 저장은 차단됩니다. 기존 레코드를 잘라내거나 보호 규칙을 공개 허용으로 바꾸지 마세요.

## 검증 범위와 미완료 범위

- 격리 실제 API/Rules 114개, Consult 앱·사이트 동기화 24개, 위젯 동시 저장 16개, 다운로드 화면 27개 검사 통과. 임시 규칙도 별도 실제 에뮬레이터로 검증했습니다.
- 실제 운영 계정으로 읽기만 확인했습니다. 가짜 고객/직원/초대/업무/첨부를 만들지 않았습니다. 실사용 쓰기, 다른 친구 계정, 초대 수락과 Samsung 실물 기기는 미검증입니다.
- APK는 이전 배포와 같은 서명으로 생성했습니다. Consult 수정에는 v167 설치가 필요합니다. 데이터 보존을 위해 기존 앱을 삭제하지 않고 업데이트할 수 있습니다.
- **별도 요청한 v13 위젯 및 1×1 새 고객 링크 위젯, 앱 Consult/Work 상세 리디자인은 이번 v167 운영 전환 완료에 포함되지 않습니다.** 기존 동기화 호환 어댑터와 구분해야 합니다.
