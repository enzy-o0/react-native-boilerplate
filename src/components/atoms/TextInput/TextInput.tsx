import React from 'react';
import styled from 'styled-components/native';
import Theme from '../../../styles/theme';
import type { TTextInputCustomProps, ITextInputProps } from './types';

// Compound Component Pattern 사용
const TextInput = ({ children, customProps, nativeProps, ...props }: ITextInputProps) => {
    return (
        <Container {...props}>
            <InputField
                accessibilityRole="input"
                selectionColor="#000000"
                placeholderTextColor="#d6d6d6"
                autoCapitalize="none"
                autoCorrect={false}
                allowFontScaling={false}
                innerAdornment={children !== undefined}
                {...customProps}
                {...nativeProps}
            />
            {children}
        </Container>
    );
};

const TextInputIcon = ({ children }: ITextInputProps) => {
    return <TextInputAdornmentContent>{children}</TextInputAdornmentContent>;
};

export default TextInput;

TextInput.TextInputIcon = TextInputIcon;

type TextInputProp = {
    innerAdornment?: boolean;
    isTextArea?: boolean;
};

const Container = styled.View`
    position: relative;
    margin-bottom: ${Theme.height(14)}px;
`;

const InputField = styled.TextInput<TTextInputCustomProps>`
    padding: ${({ innerAdornment, isTextArea }: TextInputProp) =>
        innerAdornment
            ? `${Theme.height(12)}px ${Theme.width(40)}px ${Theme.height(12)}px ${Theme.width(16)}px`
            : isTextArea
            ? `${Theme.height(16)}px ${Theme.width(16)}px`
            : `${Theme.height(12)}px ${Theme.width(16)}px`};
    height: ${({ isTextArea }: TextInputProp) => (isTextArea ? `${Theme.height(300)}px` : `${Theme.height(60)}px`)};
    border-radius: ${Theme.fontSize(4)}px;
    color: ${Theme.colors.black};
    border: solid 1px ${Theme.colors.line};
    font-size: ${Theme.fontSize(16)}px;
    background-color: ${Theme.colors.white};
`;

const TextInputAdornmentContent = styled.View`
    position: absolute;
    top: 0;
    bottom: 0;
    right: ${Theme.width(16)}px;
    justify-content: center;
    align-items: center;
`;
