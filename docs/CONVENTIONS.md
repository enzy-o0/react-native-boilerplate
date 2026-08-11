# 개발 컨벤션

브랜치·커밋·PR 규칙입니다. 새로 만든 규칙이 아니라 **가장 널리 쓰이는 표준**을 따릅니다.

- 브랜치: `<type>/<summary>` — GitHub Flow 계열
- 커밋: [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 1.0.0
- 버전: [Semantic Versioning](https://semver.org/lang/ko/) 2.0.0

> 이 레포는 이미 커밋에 `chore:` / `build:` / `docs:` 프리픽스를 쓰고 있었습니다. 그 방향을 Conventional Commits 표준에 맞춰 명문화한 것입니다.

---

## 브랜치

### 기본 흐름

`master` 하나를 기준 브랜치로 두고, **짧게 살다 사라지는 브랜치**를 따서 PR로 병합합니다 (GitHub Flow). 개인 프로젝트 규모에 `develop`/`release` 브랜치를 두는 git-flow는 과합니다.

```
master ──●────●────●────●──▶
           ╲  ╱      ╲  ╱
            ●●        ●●
      feat/map-clustering  chore/eslint-flat-config
```

- `master`는 **항상 빌드 가능한 상태**를 유지합니다
- 작업 브랜치는 병합 후 삭제합니다
- 브랜치 수명은 짧게 — 길어지면 충돌 비용이 커집니다

### 네이밍 규칙

```
<type>/<summary>
```

- `<type>`은 아래 커밋 타입과 **동일한 어휘**를 씁니다
- `<summary>`는 **kebab-case 영문 소문자**, 2~4단어 권장
- 이슈 번호를 붙일 경우: `<type>/<issue-number>-<summary>`

**좋은 예**

```
feat/map-clustering
feat/42-background-location
fix/ios-permission-retry
chore/eslint-flat-config
docs/adr-map-stack
refactor/textinput-nativewind
```

**피할 것**

```
enzy-won/walrus          # 의미 없는 이름 — 무슨 작업인지 알 수 없음
feature/새로운기능        # 한글·비표준 타입
fix-bug                  # 슬래시 없음, 대상이 불명확
my-branch                # 타입 없음
```

> 브랜치 이름은 **PR 목록에서 한 줄로 읽히는 요약**입니다. 나중에 히스토리를 훑을 때 이름만 보고 무슨 작업이었는지 알 수 있어야 합니다.

### 이 프로젝트의 마이그레이션 브랜치

재구축 Phase는 Phase 번호를 요약에 넣어 순서를 드러냅니다.

```
chore/phase-0-repo-hygiene
chore/phase-1-expo-migration
refactor/phase-3-nativewind
feat/phase-5-map-core
```

---

## 커밋

### 형식

```
<type>(<scope>): <제목>

<본문 — 왜 이렇게 했는지>

<꼬리말 — BREAKING CHANGE, 이슈 참조>
```

- **제목은 50자 이내**, 마침표 없이
- **본문은 한국어로 작성해도 됩니다.** 중요한 건 언어가 아니라 *왜*가 남는 것입니다
- 제목에는 **무엇을**, 본문에는 **왜**를 씁니다. 어떻게는 코드가 말합니다
- `<scope>`는 선택 — 영향 범위가 분명할 때만 (`map`, `auth`, `storybook`)

### 타입

| 타입 | 용도 | SemVer |
|---|---|---|
| `feat` | 사용자에게 보이는 **기능 추가** | MINOR |
| `fix` | **버그 수정** | PATCH |
| `refactor` | 동작 변화 없는 코드 구조 개선 | — |
| `perf` | 성능 개선 | PATCH |
| `docs` | 문서만 변경 | — |
| `test` | 테스트 추가·수정 | — |
| `build` | **빌드 시스템·의존성** 변경 (Gradle, Metro, babel, package.json) | — |
| `ci` | **CI 설정** 변경 (GitHub Actions, EAS 워크플로) | — |
| `chore` | 그 외 잡무 (설정 파일 정리, `.gitignore` 등) | — |
| `style` | 포맷팅만 (세미콜론, 공백) — 로직 변화 없음 | — |

### 헷갈리기 쉬운 구분

기존 히스토리에서 `build:`가 넓게 쓰였습니다. 앞으로는 이렇게 나눕니다.

| 상황 | ❌ 이전 | ✅ 앞으로 |
|---|---|---|
| GitHub Actions 워크플로 수정 | `build:` | **`ci:`** |
| 라이브러리 설치·제거 | `chore:` | **`build:`** (의존성은 빌드 시스템) |
| 컴포넌트 코드 수정으로 테스트 통과 | `build:` | **`fix:`** 또는 `test:` |
| Node 버전 상향 | `build:` | **`build:`** (맞음) |
| `.gitignore` 정리 | — | **`chore:`** |

> 실제 예: `build: react native getByRole 인식을 위한 accessibilityRole 명시` 는 컴포넌트 코드 변경이므로 `fix:`가 맞았습니다.

### 예시

```
feat(map): 뷰포트 기반 마커 클러스터링 추가

마커 2,000개에서 팬/줌 시 평균 32fps로 떨어지는 문제.
supercluster로 JS 클러스터링을 적용해 58fps까지 회복했습니다.
네이티브 위임까지는 필요 없다고 판단한 근거는 ADR-0004 참조.

Refs: #42
```

```
ci: chromatic 워크플로 액션 버전 갱신 및 트리거 축소

checkout/setup-node/cache가 v2(Node 16 런타임)로 deprecated 상태였습니다.
또 on: push가 전 브랜치에서 실행되어 Chromatic 스냅샷을 낭비하고 있어
PR과 master 푸시로만 좁혔습니다.
```

```
build!: native-base 제거 및 NativeWind 4 도입

native-base는 제작사가 유지보수를 중단했습니다.
styled-components까지 함께 걷어내 스타일 레이어를 하나로 통일합니다.

BREAKING CHANGE: 기존 theme.ts의 비례 스케일링 API가 제거되었습니다.
색상 토큰은 tailwind.config.js로 이전했습니다. 자세한 내용은 ADR-0003.
```

### 파괴적 변경

타입 뒤에 `!`를 붙이고 꼬리말에 `BREAKING CHANGE:`를 명시합니다.

```
refactor(styles)!: theme.ts 비례 스케일링 제거
```

---

## PR

### 제목

커밋과 동일한 Conventional Commits 형식을 씁니다. **Squash merge 시 이 제목이 커밋 메시지가 되기 때문**입니다.

```
feat(map): 백그라운드 위치 추적 구현
```

### 본문에 담을 것

- **왜** 이 변경이 필요한가
- **무엇을** 바꿨는가 (요약)
- **어떻게 확인했는가** — 실기기 테스트 여부, 측정값, 스크린샷/GIF
- 관련 ADR·이슈 링크

### 병합 방식

**Squash merge**를 기본으로 합니다. 작업 중 커밋(`wip`, `오타 수정`)이 `master` 히스토리를 어지럽히지 않습니다.

단, **Phase 단위 마이그레이션처럼 중간 커밋 자체가 기록으로 의미 있는 경우**는 merge commit을 씁니다.

### 병합 전 체크

- [ ] CI 통과 (lint / typecheck / test)
- [ ] 판단이 갈린 지점이 있었다면 ADR 작성 또는 갱신
- [ ] 스택이 바뀌었다면 [STACK-CHANGES.md](./STACK-CHANGES.md) 갱신
- [ ] Phase가 끝났다면 [MIGRATION.md](./MIGRATION.md) 체크박스 갱신

---

## React Native / Expo 특유의 사정

브랜치 네이밍과 커밋 형식은 웹 프로젝트와 다르지 않습니다. **다른 건 릴리스 전략입니다.** 이유는 두 가지입니다.

1. **배포가 즉시 되지 않습니다.** 스토어 심사에 수 시간~수일이 걸립니다.
2. **롤백이 비대칭입니다.** JS 변경은 OTA로 즉시 되돌릴 수 있지만, **네이티브 변경은 스토어 재심사 없이는 되돌릴 수 없습니다.**

### 네이티브 변경 여부를 표시합니다

이 비대칭 때문에 RN 레포는 **"이 PR이 네이티브를 건드리는가"**를 명시하는 관행이 있습니다. 웹에는 없는 개념입니다.

| 변경 범위 | 배포 경로 | 롤백 |
|---|---|---|
| JS/TS만 | **EAS Update (OTA)** — 즉시 | 즉시 가능 |
| 네이티브 (config plugin, 새 네이티브 모듈, 권한, SDK 버전) | **스토어 빌드** — 심사 필요 | 재심사 필요 |

네이티브가 바뀌는 PR은 제목이나 라벨에 표시합니다.

```
build(native): expo-task-manager 추가 — 백그라운드 위치 권한 포함

⚠️ 네이티브 변경 포함. OTA 배포 불가, 스토어 빌드 필요.
```

### EAS Update 채널 ↔ 브랜치 매핑

Expo에서는 **브랜치 이름이 곧 배포 대상**이 됩니다. 브랜치 전략이 단순 협업 규칙을 넘어 배포 구조와 직결되는 지점입니다.

| git 브랜치 | EAS 채널 | 용도 |
|---|---|---|
| `master` | `production` | 스토어 배포본 |
| `staging` | `preview` | 내부 테스트 빌드 |
| 작업 브랜치 | `development` | 개발 빌드 |

> 웹이라면 브랜치를 아무렇게나 지어도 배포에 영향이 없지만, 여기서는 채널 매핑이 깨집니다.

### 릴리스 브랜치는 필요할 때만

스토어 심사 중에도 `master`는 계속 나아갑니다. 그래서 심사에 올린 시점을 고정하려고 `release/1.2.0` 브랜치를 따는 팀이 있습니다.

**이 프로젝트에서는 쓰지 않습니다.** 혼자 개발하고 릴리스 빈도가 낮아, 심사 중 `master`가 앞서 나가는 상황 자체가 잘 생기지 않습니다. 필요해지면 그때 도입합니다.

### 버전 관리

RN에는 **두 종류의 버전**이 있습니다. 웹에는 없는 구분입니다.

| 항목 | 성격 | 규칙 |
|---|---|---|
| `version` (예: `1.2.0`) | 사용자에게 보이는 버전 | SemVer |
| `buildNumber` (iOS) / `versionCode` (Android) | 스토어 내부 식별자 | **제출마다 반드시 증가**, 되돌릴 수 없음 |

EAS의 `autoIncrement` 설정으로 자동화합니다. 수동 관리하면 언젠가 반드시 충돌합니다.

## 이 프로젝트의 추가 원칙

1. **각 Phase는 동작하는 상태로 커밋합니다.** 중간에 멈추더라도 그 시점까지가 완성품으로 보이도록.
2. **판단이 갈린 지점은 커밋 본문이 아니라 [ADR](./adr/)에 남깁니다.** 커밋 본문에는 ADR 번호를 참조합니다.
3. **측정 결과는 커밋 본문에 숫자로 적습니다.** "성능 개선"이 아니라 "32fps → 58fps".

## 자동화 (예정 — Phase 2)

`husky`가 이미 설치되어 있으므로 `commitlint`를 붙여 커밋 메시지 형식을 강제합니다.

```bash
yarn add -D @commitlint/cli @commitlint/config-conventional
```

규칙을 문서로만 두면 지켜지지 않습니다. 훅으로 강제하는 편이 낫습니다.
