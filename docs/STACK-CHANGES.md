# 기술 스택 변경점

2024년 1월 시점의 스택과 재구축 후 스택의 차이를 항목별로 정리합니다.
**적용됨**은 이미 반영된 것, **예정**은 해당 Phase에서 반영될 것입니다.

- 기준 시점: 2024-01-29 (마지막 커밋) → 2026-08-11 (재구축 시작)
- 실행 계획: [MIGRATION.md](./MIGRATION.md) / 판단 근거: [ADR](./adr/)

---

## 1. 런타임 · 프레임워크

| 항목 | 이전 | 이후 | 변경 성격 | 상태 |
|---|---|---|---|---|
| react-native | 0.73.1 | 0.86.2 | 마이너 13개 · **0.76에서 New Architecture 기본 전환** | 예정 (P1) |
| react | 18.2.0 | 19.2.8 | 메이저 1개 | 예정 (P1) |
| 프로젝트 기반 | `@react-native-community/cli` (bare) | **Expo SDK 57 + CNG** | 기반 교체 | 예정 (P1) |
| 네이티브 폴더 | `ios/`, `android/` 커밋 | 커밋하지 않음 (config plugin으로 선언) | 관리 방식 전환 | 예정 (P1) |
| 개발 실행 | Metro + 직접 빌드 | `expo-dev-client` 개발 빌드 | — | 예정 (P1) |

> **왜 bare가 아니라 Expo인가** — 과거 Expo의 네이티브 제약은 실재했으나 EAS Build + Config Plugins 이후 해소되었고, 현재 RN 공식 문서가 Expo를 권장 시작 경로로 명시합니다. 지도 도메인에 필요한 모듈이 1st-party로 존재합니다 (`expo-maps` 57.0.1). → [ADR-0002](./adr/0002-expo-over-bare-rn.md)

## 2. 스타일링 — 3중 구조 → 단일화

이전에는 스타일링 시스템이 **3개 공존**했습니다. 이것이 가장 큰 구조적 문제였습니다.

| 항목 | 이전 | 이후 | 변경 성격 | 상태 |
|---|---|---|---|---|
| UI 컴포넌트 | `native-base` 3.4.28 | **제거** | **유지보수 중단** 라이브러리 | 예정 (P3) |
| CSS-in-JS | `styled-components` 6.1.8 | **제거** | 런타임 오버헤드 회피 | 예정 (P3) |
| 스타일 엔진 | — | **`nativewind` 4.2.6** | 신규 · 단일 표준 | 예정 (P3) |
| 색상 토큰 | `src/styles/theme.ts` (10개) | `tailwind.config.js` 로 이전 | **이전** (semantic 네이밍 유지) | 예정 (P3) |
| 반응형 치수 | `react-native-responsive-dimensions` 3.1.1 (360×800 비례 스케일) | **제거 · 체계 재설계** | ⚠️ **1:1 이전 불가** | 예정 (P3) |

> ⚠️ **비례 스케일링은 대체가 아니라 손실입니다.** 기존 `width()`/`height()`/`fontSize()`는 화면 비율 기반이고, Tailwind는 고정 스케일 + 브레이크포인트 모델이라 개념이 다릅니다. 색상만 옮기고 치수 체계는 새로 설계합니다. → [ADR-0003](./adr/0003-nativewind-over-native-base.md)

**`gluestack-ui`를 쓰지 않는 이유**: `native-base`의 공식 후속이라 이전이 가장 쉽지만, 이전할 화면 코드가 예제 3개뿐이라 그 장점이 성립하지 않고 컴포넌트를 직접 설계하는 편이 낫다고 판단했습니다.

## 3. 내비게이션

| 항목 | 이전 | 이후 | 변경 성격 | 상태 |
|---|---|---|---|---|
| 라우터 | `@react-navigation/*` 6.x (수동 구성) | **`expo-router` 57.0.12** (파일 기반) | 방식 전환 | 예정 (P4) |
| 화면 구조 | 홈 / 커뮤니티 / 마이페이지 (native-base 예제) | 지도 도메인 기준 재설계 | 전면 교체 | 예정 (P4) |
| 딥링크 | 없음 | 스킴 설정 (위치 공유용) | 신규 | 예정 (P4) |

> 기존 `App.tsx`에는 `Tab.Navigator` 안에 `Stack.Screen`을 넣고 렌더 함수 안에서 `createNativeStackNavigator()`를 호출하는 구조적 오류가 있었습니다. expo-router 전환 시 해소됩니다.

## 4. 지도 · 위치 (신규 — 이전 스택에 없던 영역)

| 항목 | 이후 | 상태 |
|---|---|---|
| 지도 | `expo-maps` 57.0.1 **또는** `react-native-maps` 1.29.0 | **미정 — 측정 후 확정** |
| 위치 | `expo-location` 57.0.9 | 예정 (P5) |
| 백그라운드 추적 | `expo-task-manager` 57.0.9 | 예정 (P5) |
| 클러스터링 | `supercluster` 9.0.0 (JS) vs 네이티브 위임 | **미정 — 측정 후 확정** |

> 이 영역은 문서만 읽고 결정할 수 없어 **실기기 측정 결과로 확정**합니다. 측정 계획과 판단 기준은 [ADR-0004](./adr/0004-map-and-location-stack.md).

## 5. 상태 관리 · 데이터 (신규)

| 항목 | 이전 | 이후 | 상태 |
|---|---|---|---|
| 서버 상태 | **없음** | `@tanstack/react-query` 5.101.4 | 예정 (P6) |
| 클라이언트 상태 | **없음** | `zustand` 5.0.14 | 예정 (P6) |
| 경량 영속화 | `@react-native-async-storage/async-storage` (설치만 됨, 미사용) | `react-native-mmkv` 4.3.2 | 예정 (P6) |
| 오프라인 캐시 | 없음 | `expo-sqlite` 57.0.1 | 예정 (P6) |
| 에러 처리 | **없음** | 에러 바운더리 + 오프라인 UI | 예정 (P6) |

> 이전 스택에는 데이터 레이어가 통째로 없었습니다. 서버 통신이 없었기 때문입니다.

## 6. 툴체인

| 항목 | 이전 | 이후 | 변경 성격 | 상태 |
|---|---|---|---|---|
| eslint | 8.x + `.eslintrc.js` | 10.x + **flat config** (`eslint.config.js`) | 설정 형식 전환 | 예정 (P2) |
| eslint 설정 | `@react-native/eslint-config` 0.73 | `eslint-config-expo` 57.0.1 | 교체 | 예정 (P2) |
| prettier | 2.8.8 | 3.9.6 | 메이저 1개 | 예정 (P2) |
| typescript | 5.0.4 | Expo 템플릿 기준 (**7.x는 보류**) | 신중 적용 | 예정 (P2) |
| husky | 8.0.0 (`husky install`) | 9.1.7 (`husky init`) | API 변경 | 예정 (P2) |
| lint-staged | 15.2.0 | 17.3.0 | — | 예정 (P2) |
| path alias | `babel-plugin-root-import` | `tsconfig` paths (Metro 네이티브 지원) | 플러그인 제거 | 예정 (P2) |
| import 정렬 | `eslint-plugin-simple-import-sort` | **유지** | 살릴 설정 | — |

> ⚠️ **TypeScript 7 보류 이유**: 최신은 7.0.2(Go 기반 네이티브 컴파일러)지만 `typescript-eslint`·에디터 플러그인 호환성 리스크가 있습니다. 마이그레이션 초기에 툴체인이 깨지면 진행 자체가 막히므로, Expo 템플릿 버전으로 시작하고 TS 7은 별도 브랜치에서 검증 후 도입합니다.

## 7. 테스트

| 항목 | 이전 | 이후 | 상태 |
|---|---|---|---|
| 컴포넌트 테스트 | `react-test-renderer` 스모크 1개 (`renderer.create(<App />)`) | `@testing-library/react-native` 14.0.1 | 예정 (P7) |
| E2E | **없음** | Maestro (해피패스 최소 1개) | 예정 (P7) |
| CI 테스트 실행 | **없음** (워크플로에 Chromatic만 존재) | lint + typecheck + test | 예정 (P7) |
| 접근성 | `accessibilityRole="input"` — **RN에 없는 role** | `accessibilityLabel` 기반 정상 구현 | 예정 (P3) |

> `accessibilityRole="input"`은 Storybook의 `getByRole`을 통과시키려고 넣은 해킹이며 실제 접근성 기능이 없습니다. 테스트는 `getByPlaceholderText`/`testID`로 대체합니다.

## 8. Storybook · 배포

| 항목 | 이전 | 이후 | 변경 성격 | 상태 |
|---|---|---|---|---|
| storybook | 7.6 (일부 7.5로 강제 고정) | **10.5.7** | 메이저 3개 | 예정 (P8) |
| RN 웹 프리뷰 | `@storybook/addon-react-native-web` 0.0.22 + webpack5 | **`@storybook/react-native-web-vite` 10.5.7** | **경로 자체가 교체됨** | 예정 (P8) |
| 버전 강제 고정 | `resolutions` 로 addon 2개 고정 | **제거** | 취약 설정 해소 | 예정 (P8) |
| 스토리 수 | 1개 (`TextInput`) | 5개 이상 | — | 예정 (P8) |
| 앱 빌드 | `Dockerfile` + `gradlew assembleRelease` | **EAS Build** | 파이프라인 교체 | 예정 (P9) |
| OTA 업데이트 | 없음 | EAS Update | 신규 | 예정 (P9) |
| 배포 산출물 | 없음 | **설치 가능한 빌드 링크 공개** | 신규 | 예정 (P9) |

> SB8부터 `addon-react-native-web` + webpack 조합이 `react-native-web-vite` 프레임워크로 대체되었습니다. 2024년에 겪었던 7.6 → 7.5 다운그레이드 문제의 원인도 이 addon이었습니다.

## 9. 제거 대상 파일

| 파일 | 사유 | 상태 |
|---|---|---|
| `build-storybook.log` | 커밋된 빌드 산출물 (31KB) | **적용됨 (P0)** |
| `.env` (트래킹) | 환경 파일은 커밋 대상 아님 → `.env.example`로 대체 | **적용됨 (P0)** |
| `src/navigations/Screen.tsx` | 0바이트 빈 파일 | 예정 (P1) |
| `App.web.tsx`, `index.web.js` | Expo + `react-native-web` 체제에서 불필요 | 예정 (P1) |
| `Dockerfile` | EAS Build로 대체 | 예정 (P1) |
| `Gemfile`, `Gemfile.lock`, `.bundle/` | CocoaPods용 Ruby 의존성, CNG에서 불필요 | 예정 (P1) |
| `babel.config.js` 의 `babel-plugin-root-import` | tsconfig paths로 대체 | 예정 (P2) |

---

## Phase 0 — 이미 적용된 변경 (2026-08-11)

재구축과 독립적인 위생 문제만 먼저 정리했습니다. **의존성은 건드리지 않았습니다.**

| # | 파일 | 이전 | 이후 |
|---|---|---|---|
| 1 | `.env` | git에 **트래킹됨** | 트래킹 해제 (`git rm --cached`), 로컬 파일은 유지 |
| 2 | `.env.example` | 없음 | 신규 추가 (필요 키 목록 문서화) |
| 3 | `.gitignore` | `.env` 항목 없음 | `.env` / `.env.*` 추가 (`!.env.example` 예외) |
| 4 | `.gitignore` | `npm-debug.log`, `yarn-error.log` 개별 지정 | `*.log` 로 통합 |
| 5 | `.gitignore` | Storybook·Expo 항목 없음 | `storybook-static/`, `.expo/`, `dist/` 추가 |
| 6 | `build-storybook.log` | 커밋되어 있음 (31KB) | 삭제 + 트래킹 해제 |
| 7 | `chromatic.yml` | `actions/checkout@v2` | `@v4` |
| 8 | `chromatic.yml` | `actions/setup-node@v2` | `@v4` |
| 9 | `chromatic.yml` | `actions/cache@v2` 로 `~/.npm` 캐싱 | 스텝 제거 → `setup-node`의 `cache: yarn` (**yarn 프로젝트인데 npm 캐시 경로를 캐싱해 무효였음**) |
| 10 | `chromatic.yml` | `chromaui/action@v1` | `@v18` |
| 11 | `chromatic.yml` | `on: push` (**전 브랜치**) | `pull_request` + `push: branches: [master]` |
| 12 | `chromatic.yml` | 없음 | `concurrency` + `cancel-in-progress` (스냅샷 절약) |
| 13 | `chromatic.yml` | 없음 | `permissions` 최소 권한 명시 |
| 14 | `chromatic.yml` | `node-version: 18` | `20` (**Node 18은 EOL**) |
| 15 | `chromatic.yml` | `run: yarn` | `yarn install --frozen-lockfile` (CI 재현성) |
| 16 | `chromatic.yml` | job 이름 `test` | `chromatic` (실제 동작과 일치) |
| 17 | `package.json` | `lint-staged` 글롭 `"src//*.{ts,tsx}"` | `"src/**/*.{ts,tsx}"` (**슬래시 중복으로 매칭 안 됨**) |
| 18 | `package.json` | `"./src/": ["prettier --write ."]` | 통합 — **레포 전체를 포맷하던 문제** 해소 |
| 19 | `package.json` | eslint 명령이 `src/` 하드코딩 | `eslint --fix` (lint-staged가 스테이징된 파일만 전달) |
| 20 | `package.json` | `husky.hooks` 필드 존재 | 제거 (**husky v4 문법 · v8+에서 무시됨**, 실제 동작은 `.husky/pre-commit`) |
| 21 | `src/navigations/bottomTab/commuityStack/` | 오타 | `communityStack/` (import 2곳 함께 수정) |

### 검증 상태

`node_modules`가 설치되어 있지 않아 **lint·test·빌드를 실행해 검증하지는 못했습니다.** 변경은 설정 파일과 디렉토리 리네임에 한정되며, 리네임에 따른 import 참조 2곳(`App.tsx`, `src/navigations/bottomTab/index.tsx`)은 수정 후 잔여 참조가 없음을 확인했습니다.

`chromatic.yml`의 Node 18 → 20 변경은 CI에서 1회 확인이 필요합니다.
