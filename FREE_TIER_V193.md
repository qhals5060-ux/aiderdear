# AiderLog v193 사용량 점검

2026-09-27 관리 화면을 읽어서 확인했습니다. 사용자 데이터 삭제, 요금제 변경, 결제 등록은 하지 않았습니다.

| 서비스 | 확인한 사용량 | 기간 / 무료 한도 |
| --- | --- | --- |
| Vercel Fast Data Transfer | 6.07 GB | 최근 30일 / 100 GB |
| Vercel Fast Origin Transfer | 30.47 MB | 최근 30일 / 10 GB |
| Vercel Edge Requests | 약 51,000회 | 최근 30일 / 1,000,000회 |
| Vercel Function Invocations | 약 9,200회 | 최근 30일 / 1,000,000회 |
| Firebase | Spark · 무료 | 유료 Blaze 전환 없음 |
| Firestore 읽기 | 약 1,000회 · 2.1% | 사용량 개요의 일일 집계 / 50,000회 |
| Firestore 쓰기 | 87회 · 0.4% | 사용량 개요의 일일 집계 / 20,000회 |
| GitHub 저장소 | API size 533,805 KiB · 약 521 MiB | 변경 전 GitHub 표시값; 릴리스 첨부 크기와 별개 |

Firestore의 별도 지난 24시간 차트에는 읽기 801회, 쓰기 72회, 삭제 23회가 표시됐습니다. 일일 할당량 개요와 집계 구간이 다릅니다. 삭제 수치는 기존 서비스 활동이며 이번 작업에서 사용자 기록을 삭제한 수치가 아닙니다. 정확한 현재 Firestore 저장 바이트는 해당 관리 화면에서 확인되지 않았습니다.

## v193에 적용한 절감

| 항목 | v192 | v193 |
| --- | ---: | ---: |
| APK 설치 파일 | 48,201,535 B | 3,375,110 B · 93.0% 감소 |
| PC 사이트 ZIP | 1,379,413 B | 776,660 B · 43.7% 감소 |
| 앱 내 웹 파일 합계 | 52,538,478 B | 4,361,746 B · 91.7% 감소 |
| 사이트 사전 캐시 항목 | 174개 | 62개 |
| 사이트 사전 캐시 대상의 비압축 합계 | 6,734,380 B | 2,845,586 B · 57.7% 감소 |

사전 캐시 합계는 브라우저의 실제 전송량이 아니라 대상 파일 크기의 합입니다. 기존 목록은 같은 파일의 버전 쿼리별 중복 항목을 포함했습니다. 앱의 원래 휠바 행성 이미지는 유지했습니다.

- SCHEDULE, ROUTINE, EVENT, PAPER와 스케쥴 안의 금융·워크플로우만 노출합니다.
- 종료한 기능의 JS/CSS/미디어와 서비스워커 사전 캐시를 축소합니다.
- 종료한 메일 목록 및 사진의 실시간 리스너와 직원용 신원 조회를 시작하지 않습니다.
- 종료한 Estate, Consult, Bio, YouTube 서버 API는 Firebase 초기화·인증 조회 없이 410으로 응답합니다.
- 금융·워크플로우 등 개인 기록을 저장할 때 바뀐 필드만 전송하고, 바뀌지 않은 기록은 다시 쓰지 않습니다. 종료한 Consult 기록은 원본 그대로 보존합니다.
- 기존 Firebase 요청 중복 방지, 구독 재사용, 할당량 초과 시 30분 재시도 간격을 유지합니다.
- APK와 ZIP은 GitHub Releases로 배포하고 Git 및 Vercel 배포 파일에 넣지 않습니다. 기존 Git 이력은 강제 재작성하지 않습니다.
- 새로운 유료 서비스나 예약 작업을 추가하지 않습니다.

무료 범위 내 운영을 돕는 변경이며, 향후 사용자 수·첨부 크기·동기화 빈도가 늘어도 무료를 무조건 보장한다는 의미는 아닙니다. Spark/Hobby 한도를 넘으면 기능이 일시 제한될 수 있습니다.

공식 기준: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Firestore 무료 할당량](https://firebase.google.com/docs/firestore/pricing), [GitHub 대용량 파일과 Releases](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).
