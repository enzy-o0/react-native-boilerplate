// docs/CONVENTIONS.md 의 커밋 규칙을 훅으로 강제합니다.
// 규칙을 문서로만 두면 지켜지지 않기 때문입니다.
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 제목에 한국어와 고유명사(RN, ESLint, Expo)가 섞이므로 대소문자 규칙을 끕니다.
    // 이 규칙을 켜두면 "build!: RN 0.73 ..." 같은 정상 커밋이 거부됩니다.
    'subject-case': [0],

    // 본문에 표·버전 범위(^20.19.4 || ^22.13.0 ...)·명령어를 인용하므로
    // 줄 길이 제한을 두지 않습니다.
    'body-max-line-length': [0],

    // 제목은 50자 이내를 권장하되(docs/CONVENTIONS.md), 강제는 100자에서 합니다.
    'header-max-length': [2, 'always', 100],
  },
};
