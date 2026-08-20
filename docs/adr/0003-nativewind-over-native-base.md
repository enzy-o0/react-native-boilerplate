# ADR-0003. 스타일 레이어를 NativeWind 4로 통일

- 상태: 채택
- 일자: 2026-08-11

## 맥락

기존 프로젝트에는 스타일링 시스템이 **3개 공존**했습니다.

1. `native-base` 3.4 — 화면 컴포넌트에서 사용 (`<Card>`, `<Button>`)
2. `styled-components/native` 6.1 — `TextInput` 컴포넌트에서 사용
3. 자체 `src/styles/theme.ts` — `react-native-responsive-dimensions` 기반 비례 스케일링 + 색상 토큰

보일러플레이트의 존재 이유는 "표준을 정해주는 것"인데, 정작 표준이 정해지지 않은 상태였습니다.

추가로 `native-base`는 **제작사(GeekyAnts)가 유지보수를 중단**했고 후속으로 gluestack-ui를 안내하고 있습니다. 그대로 두면 그 자체로 감점 요인입니다.

## 결정

**NativeWind 4.2.6 하나로 통일**합니다. `native-base`와 `styled-components/native`를 모두 제거하고, `theme.ts`의 **색상 토큰만** `tailwind.config.js`로 이전합니다.

**비례 스케일링(`width()`/`height()`/`fontSize()`)은 이전하지 않고 치수 체계를 재설계합니다.**

## 근거

1. **`native-base`는 선택지가 아닙니다.** 유지보수가 중단된 라이브러리를 2026년 신규 프로젝트에 넣을 근거가 없습니다.

2. **`styled-components/native`는 RN에서 런타임 오버헤드가 있습니다.** 지도 앱은 팬/줌 중 리렌더 비용이 직접 프레임에 반영되는 도메인이라, 스타일 계산을 런타임에서 줄이는 편이 유리합니다.

3. **Storybook 웹 프리뷰와의 정합성.** 이 프로젝트는 `react-native-web`으로 Storybook을 브라우저에 띄우는 파이프라인을 이미 갖고 있습니다. Tailwind 기반이면 웹 프리뷰와 네이티브 사이의 스타일 표현이 어긋날 여지가 적습니다.

4. **채택률과 전이 가능한 지식.** NativeWind는 현재 RN 스타일링에서 가장 채택률이 높고, 웹 Tailwind 경험이 그대로 이어집니다.

### gluestack-ui v2를 선택하지 않은 이유

`native-base`의 공식 후속이고 NativeWind와도 결합되므로 기존 화면 코드 이전은 가장 자연스러웠습니다. 다만 이 프로젝트에서는 **컴포넌트를 직접 설계·구현하는 역량**을 보여주는 편이 낫고, 이전할 화면 코드가 예제 수준 3개뿐이라 "이전이 쉽다"는 장점이 성립하지 않았습니다.

## 감수하는 것

- **기존 `TextInput` 코드를 거의 전부 재작성합니다.** Compound Component 패턴(`TextInput.TextInputIcon`)이라는 설계 의도는 유지하되 구현은 새로 씁니다.
- **`theme.ts`의 반응형 스케일링을 잃습니다.** 360×800 기준 화면 비율 스케일링은 Tailwind의 고정 스케일 + 브레이크포인트 모델과 개념이 달라 1:1 대응이 불가능합니다. 억지로 재현하면 NativeWind의 이점(정적 스타일 추출)이 사라지므로, 스케일링 요구가 다시 필요해지면 별도 ADR로 다룹니다.
- **접근성 컴포넌트를 직접 만들어야 합니다.** gluestack-ui가 제공했을 접근성 처리를 직접 구현해야 하며, 특히 기존의 잘못된 `accessibilityRole="input"`(RN에 존재하지 않는 role, Storybook `getByRole` 통과용 해킹)을 올바른 `accessibilityLabel` 기반으로 교체합니다.
- **Storybook 웹 프리뷰에서의 Tailwind 연동**이 막힐 수 있습니다. 발생 시 해결 과정을 기록합니다.

## 되돌리는 비용

**중간.** 컴포넌트 수가 적은 초기에 뒤집으면 저렴하지만, 디자인 시스템이 커진 뒤에는 비쌉니다. **Phase 3에서 확정하고 이후 재검토하지 않습니다.**
