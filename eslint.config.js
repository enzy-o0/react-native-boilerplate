// https://docs.expo.dev/guides/using-eslint/
// ESLint 9부터 flat config가 기본이며, 구 .eslintrc.js는 Phase 1에서 제거했습니다.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      // 2024년 스택에서 유지한 유일한 lint 설정입니다.
      // import 순서를 사람이 판단하지 않게 만듭니다.
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'expo-env.d.ts', 'scripts/reset-project.js'],
  },
]);
