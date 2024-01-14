import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { TextInput } from '.';

import { ITextInputProps } from './types';

export default {
    component: TextInput,
    title: 'atoms/TextInput',
} as Meta;

const TemplateDefault = (args: ITextInputProps) => <TextInput {...args} />;

const Template = (args: ITextInputProps) => (
    <TextInput {...args}>
        <TextInput.TextInputIcon></TextInput.TextInputIcon>
    </TextInput>
);

export const Default: StoryFn = TemplateDefault.bind({});
Default.args = {
    nativeProps: {
        maxLength: 10,
        keyboardType: 'number-pad',
        onChangeText: action('onChangeText'),
    },
};

Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLElement = canvas.getByRole('input');

    await userEvent.type(input, '1231231223');

    //TODO value 타입잡기
    await expect(input.value).toBe('1231231223');
    await expect(input.value.length).toBe(10);
};

export const WithIcon: StoryFn = Template.bind({});
WithIcon.args = {
    nativeProps: {
        maxLength: 10,
        keyboardType: 'number-pad',
        onChangeText: action('onChangeText'),
    },
};

export const TextArea: StoryFn = TemplateDefault.bind({});
TextArea.args = {
    customProps: {
        isTextarea: true,
    },
    nativeProps: {
        onChangeText: action('onChangeText'),
        placeholder: '내용을 입력해주세요',
    },
};
