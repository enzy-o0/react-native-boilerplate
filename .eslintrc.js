module.exports = {
    root: true,
    extends: [
        '@react-native',
        'plugin:prettier/recommended',
        'plugin:storybook/recommended',
        'simple-import-sort',
        'import',
    ],
    rules: {
        'prettier/prettier': 'error',
        'import/no-duplicates': ['error', { considerQueryString: true }],
        'simple-import-sort/imports': [
            'warn',
            {
                groups: [
                    // Packages `react` related packages come first.
                    ['^react', '^@react?\\w'],
                    // Internal packages.
                    ['^@?\\w', '^(@|components)(/.*|$)'],
                    // Side effect imports.
                    ['^\\u0000'],
                    // Parent imports. Put `..` last.
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\.(?!/?$)', '^\\./?$'],
                    // Other relative imports. Put same-folder imports and `.` last.
                    ['^~?\\/features', '^~?\\/components', '^~?\\/navigations'],
                    ['^~?\\/api', '^~?\\/reducers'],
                    ['^~?\\/common'],
                    ['^~?\\/styles', '^~?\\/assets'],
                ],
            },
        ],
    },
};
