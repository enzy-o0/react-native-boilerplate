# Trace — 경로 기록 앱 (재구축 진행 중)

걸은 경로를 지도에 기록하고 돌아보는 앱입니다.

> **현재 상태:** 2024년 1월에 만들다 중단한 RN 0.73 보일러플레이트를,
> 2026년 8월부터 Expo SDK 57 기반의 **완성된 앱**으로 재구축하고 있습니다.
> Phase 0~2 완료 — Android 에뮬레이터에서 빌드·실행을 확인했습니다. 다음은 Phase 3(NativeWind).
>
> iOS는 이 머신의 Xcode 15.1이 Expo 57의 요구(26.4+)에 못 미쳐 로컬 빌드가 불가능합니다.
> 자세한 내용은 [MIGRATION.md의 빌드 환경 제약](./docs/MIGRATION.md#️-빌드-환경-제약-이-머신-기준).

## 이 프로젝트가 목표하는 것

RN 프로젝트를 "설정"하는 것이 아니라 **끝까지 만들어 배포하는 것**이 목표입니다.

경로 기록을 고른 이유는 프론트엔드 난이도가 UI 구성이 아니라 **측정과 판단**에 있기 때문입니다.

- 1시간 기록 = GPS 좌표 수천 개. 폴리라인을 그대로 그릴지 데시메이션할지 — **실기기 프레임 측정으로 결정**
- 백그라운드 추적 간격과 배터리 소모의 트레이드오프 — **시간당 소모량 측정으로 결정**
- 권한 거부 이후의 복구 경로 — iOS는 두 번째 요청이 불가능하므로 설계가 필요

서버 없이 완성 가능해 중단 위험이 낮고, 백그라운드 위치 추적이 **선택 기능이 아니라 제품의 필수 요건**이라 위 측정이 자연스럽게 강제됩니다.

코드 생성이 저렴해진 환경에서 변별점은 "무엇을 만들었나"보다 **"왜 그렇게 했는지 설명할 수 있나"**에 있다고 보고, 판단이 갈린 지점은 전부 [ADR](./docs/adr/)로 남깁니다.

## 왜 업그레이드가 아니라 재구축인가

`react-native` 0.73.1 → 0.86.2는 마이너 13개 차이이고, 그 사이 **0.76에서 New Architecture가 기본값**이 되는 단절이 있습니다. 반면 이 레포에 그 비용을 감당할 만한 코드가 없습니다 — `src/` 전체 16파일, 실제 컴포넌트 1개.

**새로 만들고 자산만 포팅합니다.** 단, git 히스토리는 유지합니다. → [ADR-0001](./docs/adr/0001-rebuild-over-incremental-upgrade.md)

## 스택

| 영역            | 이전 (2024)                                  | 목표 (2026)                              | 상태 | 근거                                                       |
| --------------- | -------------------------------------------- | ---------------------------------------- | ---- | ---------------------------------------------------------- |
| 기반            | RN CLI 0.73.1                                | **Expo SDK 57 + CNG** / RN 0.86.2        | ✅   | [ADR-0002](./docs/adr/0002-expo-over-bare-rn.md)           |
| 라우팅          | react-navigation 6 (수동 구성)               | **expo-router 57**                       | ✅   |                                                            |
| 스타일          | native-base + styled-components + 자체 theme | **NativeWind 4**                         | ⬜   | [ADR-0003](./docs/adr/0003-nativewind-over-native-base.md) |
| 지도            | —                                            | `expo-maps` / `react-native-maps` (미정) | ⬜   | [ADR-0004](./docs/adr/0004-map-and-location-stack.md)      |
| 위치            | —                                            | `expo-location` + `expo-task-manager`    | ⬜   |                                                            |
| 서버 상태       | —                                            | TanStack Query 5                         | ⬜   |                                                            |
| 클라이언트 상태 | —                                            | Zustand 5                                | ⬜   |                                                            |
| 영속화          | —                                            | MMKV 4 / expo-sqlite                     | ⬜   |                                                            |
| 테스트          | jest 스모크 1개                              | RNTL 14 + Maestro E2E                    | ⬜   |                                                            |
| 문서화          | Storybook 7.6 + Chromatic                    | **Storybook 10** + Chromatic             | ⬜   |                                                            |
| 배포            | Dockerfile APK                               | **EAS Build / Update**                   | ⬜   |                                                            |
| Node            | 18                                           | **22** (`.nvmrc`)                        | ✅   |                                                            |

> `native-base`는 제작사가 유지보수를 중단해 업그레이드 대상이 아니라 **교체 대상**입니다.

## 로드맵

세부 체크리스트는 [docs/MIGRATION.md](./docs/MIGRATION.md)에 있습니다.

2024년 스택과의 항목별 차이는 [docs/STACK-CHANGES.md](./docs/STACK-CHANGES.md), 브랜치·커밋 규칙은 [docs/CONVENTIONS.md](./docs/CONVENTIONS.md)에 있습니다.

| Phase | 내용                                                                                         | 상태         |
| ----- | -------------------------------------------------------------------------------------------- | ------------ |
| 0     | 레포 위생 정리 (`.env` 언트래킹, 빌드 산출물 제거, Actions 버전 갱신, lint-staged glob 수정) | ✅           |
| 1     | Expo SDK 57 프로젝트 생성 + 히스토리 유지 병합 → **빌드·실행 확인**                          | ✅ (Android) |
| 2     | 툴체인 (ESLint flat config, Prettier 3, husky 9, commitlint)                                 | ✅           |
| 3     | NativeWind 4 전환, 색상 토큰 이전, `TextInput` 재작성                                        | ⬜           |
| 4     | expo-router 전환, 지도 도메인에 맞는 화면 구조 재설계                                        | ⬜           |
| **5** | **지도 코어 — 클러스터링 성능 측정, 배터리 측정, 권한 UX**                                   | ⬜           |
| 6     | 데이터 레이어 (Query / Zustand / MMKV), 오프라인·에러 처리                                   | ⬜           |
| 7     | 테스트 (RNTL, Maestro E2E), CI에 lint·typecheck·test 추가                                    | ⬜           |
| 8     | Storybook 10 + Chromatic 재구축, 스토리 5개 이상                                             | ⬜           |
| 9     | EAS Build/Update, **설치 가능한 빌드 링크 게시**                                             | ⬜           |
| 10    | README 재작성 (스크린샷, 측정 결과, 아키텍처)                                                | ⬜           |

**Phase 5가 본체입니다.** 나머지는 거기 도달하기 위한 기반 공사입니다.

### 진행 원칙

1. Phase 1(실기기 빌드 성공) 전에는 기능 코드를 쓰지 않습니다.
2. 각 Phase는 동작하는 상태로 커밋합니다 — 중간에 멈추더라도 그 시점까지가 완성품으로 보이도록.
3. 판단이 갈린 지점은 ADR로 남깁니다.
4. Phase 5의 성능·배터리 수치는 **실기기에서 측정**합니다. 추정치를 적으면 감점입니다.

## 실행 방법

Node 22가 필요합니다 (`.nvmrc` 참조). metro가 Node 23.x를 거부하므로 버전 매니저 사용을 권합니다.

```bash
fnm use          # 또는 nvm use — .nvmrc의 22를 적용
yarn install

yarn start       # Expo 개발 서버
yarn ios         # iOS 개발 빌드로 실행
yarn android     # Android 개발 빌드로 실행

yarn typecheck   # tsc --noEmit
yarn doctor      # expo-doctor
```

네이티브 폴더는 커밋하지 않습니다(CNG). 필요하면 `npx expo prebuild`로 생성합니다.

## 2024년 작업 기록

재구축 전 버전에서 다뤘던 내용입니다.

- [React Native Web으로 브라우저에 Storybook 띄우기](https://brash-bonsai-3a3.notion.site/React-Native-Web-b5db761a4cf643cfb41f2d4c1406b914) — `@storybook/addon-react-native-web` 호환성 이슈로 Storybook 7.6 → 7.5 다운그레이드
- Chromatic + GitHub Actions로 Storybook 배포 ([공식 문서](https://storybook.js.org/tutorials/intro-to-storybook/react/ko/deploy/) 참고)
- Dockerfile 기반 APK 빌드 자동화

> 이 중 Storybook/Chromatic 파이프라인은 개념을 유지한 채 Storybook 10 + `@storybook/react-native-web-vite`로 재구축합니다. Dockerfile APK 빌드는 EAS Build로 대체됩니다.
