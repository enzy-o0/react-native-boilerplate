module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        // 'babel-plugin-styled-components',
        // '@babel/plugin-transform-modules-commonjs',
        [
            'babel-plugin-root-import',
            {
                rootPathPrefix: '~',
                rootPathSuffix: 'src',
            },
        ],
    ],
};
