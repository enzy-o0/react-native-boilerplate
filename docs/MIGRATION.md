# 마이그레이션 가이드

> 2024년 1월에 멈춘 RN 0.73 보일러플레이트를, 2026년 기준 스택 위의 **완성된 지도 기반 앱**으로 재구축하는 작업 문서입니다.
> 각 단계는 체크박스로 관리하며, 판단이 갈린 지점은 [ADR](./adr/)에 근거를 남깁니다.

## 왜 업그레이드가 아니라 재구축인가

`react-native` 0.73.1 → 0.86.2 는 마이너 13개 차이이며, 그 사이 **0.76에서 New Architecture가 기본값**이 되는 단절이 있습니다. 순차 업그레이드는 각 단계마다 네이티브 빌드를 깨뜨리고, 이 레포에는 그 비용을 정당화할 만한 코드가 없습니다 (`src/` 전체 16파일, 실제 컴포넌트 1개).

**새 Expo 프로젝트를 만들고, 살릴 자산만 포팅합니다.** 근거는 [ADR-0001](./adr/0001-rebuild-over-incremental-upgrade.md).

### 버전 갭

| 패키지           | 현재                    | 목표                               |
| ---------------- | ----------------------- | ---------------------------------- |
| react-native     | 0.73.1                  | 0.86.2                             |
| react            | 18.2.0                  | 19.2.8                             |
| typescript       | 5.0.4                   | Expo 템플릿 기준 (7.x는 아래 주의) |
| storybook        | 7.6                     | 10.5.7                             |
| eslint           | 8                       | 10.x + flat config                 |
| prettier         | 2.8.8                   | 3.9.6                              |
| react-navigation | 6                       | expo-router 57                     |
| native-base      | 3.4 (**유지보수 중단**) | NativeWind 4.2.6                   |

### 포팅할 자산 / 폐기할 것

**살립니다**

- `src/styles/theme.ts` 의 **색상 토큰** → `tailwind.config` 로 이전
- `src/components/atoms/TextInput` → NativeWind로 재작성 (Compound Component 패턴 유지)
- Storybook + Chromatic + GitHub Actions 배포 파이프라인 (개념만; 설정은 전면 재작성)
- 커밋 메시지에 판단 근거를 남기는 습관 → ADR로 승격

**버립니다**

- `native-base` — 제작사가 유지보수 중단, 후속은 gluestack-ui
- `styled-components/native` — NativeWind로 통일 ([ADR-0003](./adr/0003-nativewind-over-native-base.md))
- `react-native-responsive-dimensions` 기반 비례 스케일링 — **1:1 이전 불가**, 아래 3단계 주의사항 참조
- `src/navigations/Screen.tsx` (0바이트 빈 파일)
- `App.web.tsx` / `index.web.js` / `Dockerfile` / `Gemfile` — Expo + EAS 체제에서 불필요
- `build-storybook.log` (커밋된 빌드 산출물)

---

## Phase 0 — 위생 정리 ✅ 완료 (2026-08-11)

재구축과 무관하게 **지금 당장** 해야 하는 것들입니다. 리뷰어가 가장 먼저 보는 감점 요인입니다.

- [x] `.env` 트래킹 해제 — `git rm --cached .env` 후 `.gitignore`에 `.env*` 추가 (`.env.example`만 커밋)
- [x] `build-storybook.log` 삭제 + `.gitignore`에 `*.log` 추가
- [x] `.github/workflows/chromatic.yml` 액션 버전 갱신 — `checkout@v2`/`setup-node@v2`/`cache@v2` 는 전부 deprecated (Node 16 런타임)
- [x] Chromatic 트리거를 `on: push` (전 브랜치) → `on: pull_request` + `push: branches: [master]` 로 축소, 스냅샷 낭비 방지
- [x] `package.json`의 `husky.hooks` 필드 제거 — husky v4 문법이라 v8+에서 무시됨 (`.husky/pre-commit`가 실제 동작 주체)
- [x] `lint-staged` glob 수정 — `"src//*.{ts,tsx}"` 는 슬래시가 중복되어 매칭되지 않고, `"./src/"` 키가 `prettier --write .` 로 **레포 전체**를 포맷함
- [x] 디렉토리 오타 `src/navigations/bottomTab/commuityStack` → `communityStack`

> 변경 21건의 상세 내역은 [STACK-CHANGES.md의 Phase 0 섹션](./STACK-CHANGES.md#phase-0--이미-적용된-변경-2026-08-11)에 있습니다.
> 의존성은 건드리지 않았고, `node_modules` 미설치 상태라 lint·test 실행 검증은 하지 못했습니다.

## Phase 1 — Expo 프로젝트 생성 및 히스토리 병합 🔶 진행 중

Expo를 선택한 근거는 [ADR-0002](./adr/0002-expo-over-bare-rn.md). 상세 변경 내역은 [STACK-CHANGES.md](./STACK-CHANGES.md#phase-1--이미-적용된-변경-2026-08-12).

- [x] 별도 위치에 `npx create-expo-app@latest` 로 SDK 57 프로젝트 생성 (TypeScript 템플릿)
- [x] **기존 레포 히스토리를 유지한 채** 새 프로젝트 파일을 덮어씀 — 레포를 새로 파지 말 것. 2024년 커밋부터 이어지는 히스토리 자체가 "중단했다가 다시 잡고 완주했다"는 서사가 됩니다
- [x] 네이티브 폴더(`ios/`, `android/`)는 **커밋하지 않음** — CNG(Continuous Native Generation) 유지, `.gitignore`에 추가
- [x] `app.json` 로 앱 식별자 선언 — `Trace` / `trace` / `com.enzy.trace`
- [x] `expo-dev-client` 설치 — 네이티브 모듈이 들어가므로 Expo Go로는 실행 불가, 개발 빌드가 필요합니다
- [x] 폐기 대상 파일 일괄 삭제 (위 "버립니다" 목록)
- [x] Node 버전 고정 — `.nvmrc`에 `22` (metro가 23.x를 거부)
- [x] `expo-doctor` 20/20 통과, `tsc --noEmit` 통과
- [ ] **실기기에서 개발 빌드 1회 성공 확인 → 여기까지가 Phase 1 완료 기준**
  - `npx expo run:ios` 또는 `npx expo run:android` (CNG가 네이티브 폴더를 생성합니다)
  - Xcode / Android Studio 설정이 필요하며, 이 단계는 사람이 직접 확인해야 합니다

> 권한 문구(`NSLocationWhenInUseUsageDescription` 등)와 위치 관련 config plugin 선언은 실제로 `expo-location`을 도입하는 **Phase 5**에서 추가합니다. 지금 미리 넣으면 쓰지도 않는 권한을 요구하게 됩니다.

## Phase 2 — 툴체인 ✅ 완료 (2026-08-14)

[Expo 공식 ESLint 가이드](https://docs.expo.dev/guides/using-eslint/)의 구성을 따랐습니다. 상세 내역은 [STACK-CHANGES.md](./STACK-CHANGES.md#phase-2--이미-적용된-변경-2026-08-14).

- [x] `eslint-config-expo` (57.0.1) 기반 **flat config** (`eslint.config.js`)로 전환 — ESLint 9부터 flat config가 기본, `.eslintrc.js`는 폐기
- [x] **ESLint 버전 결정 — 9.39.5로 고정.** 최신은 10.8.1이지만 `eslint-plugin-react`가 아직 10을 지원하지 않아 룰 로딩이 실패합니다
- [x] `prettier` 3.9.6 + `eslint-plugin-prettier` 5.5.6 + `eslint-config-prettier` 10.1.8
- [x] Prettier 설정을 Expo 코드베이스에 맞춰 2-space로 조정 (`tabWidth` 4 → 2, `printWidth` 120 → 100)
- [x] 기존 `eslint-plugin-simple-import-sort` 규칙 유지 (import 정렬은 살릴 만한 설정입니다)
- [x] `husky` 9.1.7 + `lint-staged` 17.3.0 재설치 — v9는 `husky install`이 아니라 `husky init` 사용
- [x] `commitlint` + `@commitlint/config-conventional` 도입 — [CONVENTIONS.md](./CONVENTIONS.md)의 커밋 규칙을 훅으로 강제
- [x] TypeScript 버전 결정 — Expo 템플릿 기준 **6.0.3** 사용. TS 7(Go 기반 네이티브 컴파일러)은 `typescript-eslint`·에디터 플러그인 호환성 확인 후 별도 브랜치에서 도입
- [x] `tsconfig.json` path alias (`@/*`) — `babel-plugin-root-import` 폐기, Expo/Metro가 `tsconfig` paths를 직접 지원
- [x] `engines.node`를 `>=22.13`으로 수정 — **Expo SDK 57의 최소 Node는 22.13.x**

> **CI에 lint·typecheck를 붙이는 작업은 Phase 7**에 있습니다. 지금은 로컬 훅만 동작합니다.

## Phase 3 — 스타일 레이어: NativeWind 4

근거는 [ADR-0003](./adr/0003-nativewind-over-native-base.md).

- [ ] `nativewind` 4.2.6 + `tailwindcss` 설치, `metro.config.js`·`babel.config.js` 연동
- [ ] 아래 **색상 토큰 10개**를 `tailwind.config.js`의 `theme.extend.colors`로 이전 (semantic 네이밍 유지)

  ```js
  // 구 src/styles/theme.ts 에서 보존 (Phase 1에서 파일 삭제됨, 값은 여기 유지)
  colors: {
    white:   '#fff',     black: '#1e2022',  disable: '#d6d6d6',
    error:   '#b50000',  line:  '#e0e0e0',  main:    '#005500',
    point:   '#d43900',  subText: '#6e6f70', bg:     '#fafafa',
    blue:    '#1F3A93',
  }
  ```

  > 경로 기록 앱 기준으로 재검토가 필요합니다. `main`(#005500, 진녹색)은 지도 위 경로 폴리라인 색으로 쓰기엔 지형색과 충돌할 수 있습니다.

- [ ] `TextInput` 컴포넌트 재작성 — Compound Component 패턴(`TextInput.TextInputIcon`)은 유지, `styled-components` 제거
- [ ] **`accessibilityRole="input"` 제거** — RN에 존재하지 않는 role이며, Storybook의 `getByRole`을 통과시키려고 넣은 해킹입니다. 테스트는 `getByPlaceholderText` 또는 `testID`로 대체하고, 접근성은 `accessibilityLabel`로 제대로 부여
- [ ] 다크모드 토큰 정의 (`dark:` variant) — 지도 앱은 야간 사용 비중이 높아 실사용 근거가 있습니다

> **주의: 반응형 스케일링은 1:1 이전이 불가능합니다.**
> 기존 `theme.ts`의 `width()`/`height()`/`fontSize()`는 360×800 기준 화면 비율 스케일링입니다. Tailwind는 고정 스케일 + 브레이크포인트 모델이라 개념이 다릅니다.
> 색상만 옮기고 **치수 체계는 재설계**하세요. 무리하게 비례 스케일을 재현하면 NativeWind의 장점이 전부 사라집니다. 이 결정도 ADR로 남길 가치가 있습니다.

## Phase 4 — 내비게이션

- [ ] `expo-router` 57.0.12 (파일 기반 라우팅)로 전환 — 기존 `@react-navigation` 6 수동 구성 폐기
- [ ] 기존 3탭 구조(홈/커뮤니티/마이페이지) → **지도 앱 도메인에 맞게 재설계** (예: 지도 / 저장됨 / 설정). 남은 native-base 예제 화면은 전부 삭제
- [ ] `App.tsx`의 구조적 오류 수정 — 현재 `Tab.Navigator` 안에 `Stack.Screen`을 넣고, 렌더 함수 안에서 `createNativeStackNavigator()`를 호출하고 있습니다. expo-router 전환 시 자연히 해소됩니다
- [ ] 딥링크 스킴 설정 — 지도 앱은 "이 위치 공유하기"가 핵심 기능이라 필수입니다

## Phase 5 — 지도 앱 코어 ★ 여기가 본체

근거와 트레이드오프는 [ADR-0004](./adr/0004-map-and-location-stack.md).

- [ ] **지도 라이브러리 결정** — `expo-maps` 57.0.1 (1st-party, SDK와 함께 버전 이동) vs `react-native-maps` 1.29.0 (생태계 성숙, 클러스터링 래퍼 존재). 이 선택이 아래 클러스터링 방식을 결정합니다
- [ ] `expo-location` 57.0.9 — 포그라운드 위치, 권한 요청 플로우
- [ ] **권한 거부 UX 설계** — iOS는 두 번째 권한 요청이 불가능합니다. 거부 시 설정 앱으로 유도하는 경로를 반드시 만드세요. 여기를 제대로 처리한 앱이 드물어서 차별 지점이 됩니다
- [ ] `expo-task-manager` 57.0.9 — 백그라운드 위치 추적
- [ ] **배터리 트레이드오프 측정** — 추적 간격/정확도(`Accuracy`) 조합별 소모량을 실기기에서 재고 결과를 기록. 측정값이 있는 포트폴리오는 거의 없습니다
- [ ] **마커 클러스터링 + 성능 측정** — 마커 1,000~2,000개 기준 프레임 측정. JS 클러스터링(`supercluster` 9.0.0)으로 충분한지, 네이티브로 넘겨야 하는지를 **숫자로 판단**하고 기록
- [ ] 지도 인터랙션 최적화 — 뷰포트 기반 마커 로딩, 팬/줌 중 리렌더 억제

## Phase 6 — 데이터 레이어

- [ ] `@tanstack/react-query` 5.101.4 — 서버 상태 (장소 검색, 상세 조회)
- [ ] `zustand` 5.0.14 — 클라이언트 상태 (지도 뷰포트, 필터, 선택된 마커)
- [ ] `react-native-mmkv` 4.3.2 — 최근 검색어·설정 등 경량 영속화
- [ ] `expo-sqlite` 57.0.1 — 오프라인 캐시가 필요한 경우 (저장한 장소, 방문 기록)
- [ ] 에러 바운더리 + 오프라인 상태 UI — 지도 앱은 네트워크 불안정 상황이 일상이라 **실사용 근거가 있는 구현**입니다

## Phase 7 — 테스트

- [ ] `@testing-library/react-native` 14.0.1 로 컴포넌트 테스트 — 현재 있는 `renderer.create(<App />)` 스모크 테스트는 삭제
- [ ] 권한 상태별 분기 테스트 (허용 / 거부 / 부분 허용)
- [ ] Maestro로 E2E 1개 이상 — "앱 실행 → 권한 허용 → 현재 위치로 이동 → 마커 선택" 해피패스
- [ ] CI에서 lint + typecheck + test 실행 (현재 워크플로에는 Chromatic만 있고 **테스트가 없습니다**)

## Phase 8 — Storybook + Chromatic 재구축

- [ ] **`.github/workflows/chromatic.yml` 자동 트리거 복구** — Phase 1에서 Storybook 제거로 동작 불가가 되어 `workflow_dispatch`(수동)로만 남겨둔 상태입니다. 파일 안에 되돌릴 설정이 주석으로 있습니다
- [ ] Storybook 10.5.7 + **`@storybook/react-native-web-vite`** (10.5.7) — 기존 `@storybook/addon-react-native-web`(0.0.29) + webpack5 조합은 폐기. 이게 SB8+에서의 공식 RN-web 경로이며, 버전 강제 고정(`resolutions`)도 함께 제거됩니다
- [ ] NativeWind가 Storybook 웹 프리뷰에서 동작하도록 Tailwind 연동 확인 — **여기서 막힐 가능성이 있는 구간입니다.** 막히면 삽질 기록을 그대로 ADR로 남기세요 (2024년에 storybook 7.6→7.5 다운그레이드 이유를 커밋에 남긴 것과 같은 방식)
- [ ] Chromatic 재연결, 워크플로 액션 버전 v4 계열로 갱신
- [ ] 컴포넌트별 스토리 작성 — **최소 5개 이상**. 현재는 1개뿐이고, 이게 "디자인 시스템"이라 부를 수 없는 이유입니다

## Phase 9 — 배포

- [ ] EAS Build 설정 (`eas.json`) — development / preview / production 프로파일
- [ ] EAS Update로 OTA 업데이트 파이프라인 구성
- [ ] GitHub Actions에서 EAS Build 트리거
- [ ] **실기기 설치 가능한 빌드 링크를 README에 게시** — 포트폴리오에서 이게 있고 없고의 차이가 가장 큽니다. 스토어 심사까지 가면 더 좋지만, 최소한 preview 빌드 QR은 필수

## Phase 10 — 문서화

- [ ] README 재작성 — 스크린샷/GIF, 아키텍처 설명, 측정 결과, 빌드 링크
- [ ] ADR 최종 정리 — 특히 Phase 5의 **측정 기반 판단**들
- [ ] "이 프로젝트에서 해결한 어려운 문제 3가지" 섹션 — 면접에서 그대로 쓰이는 부분입니다

---

## 진행 원칙

1. **Phase 1 완료(실기기 빌드 성공) 전에는 기능 코드를 쓰지 않습니다.** 기반이 흔들리면 전부 다시 합니다.
2. **각 Phase는 동작하는 상태로 커밋합니다.** 중간에 또 멈추더라도 그 시점까지가 완성품으로 보이도록.
3. **판단이 갈린 지점은 ADR로 남깁니다.** 코드는 에이전트로 빠르게 뽑을 수 있는 시대라, 변별점은 "왜 그렇게 했는가"에 있습니다.
4. **Phase 5의 성능·배터리 항목은 반드시 실기기에서 측정합니다.** 추정치를 적으면 오히려 감점입니다.
