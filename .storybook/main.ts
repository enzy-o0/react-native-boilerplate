import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@storybook/addon-interactions',
        '@storybook/addon-react-native-web',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {
            builder: {
                useSWC: true,
            },
        },
    },
    webpackFinal: async (config: any) => {
        // ...

        // Remove export-order-loader since it doesn't work properly for CommonJS code
        // It currently appends ES code to CommonJS code resulting in a "exports is not defined" error
        // See https://github.com/storybookjs/storybook/issues/25383
        // This might result in the order of stories not corresponding to the order of exports,
        // although from my testing it doesn't seem to be the case and works fine without it
        // TODO: remove this fix once it is fixed in the library
        config.module.rules = config.module.rules.filter(
            (rule) => !rule?.use?.some?.((u) => String(u?.loader)?.includes?.('export-order-loader')),
        );

        return config;
    },
    docs: {
        autodocs: 'tag',
    },
};
export default config;
