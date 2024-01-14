import {TextInputProps} from 'react-native';
import {ReactNode} from 'react';
export type TTextInputCustomProps = {
  isTextarea?: boolean;
  innerAdornment?: boolean;
};

export interface ITextInputProps {
  nativeProps?: TextInputProps;
  customProps?: TTextInputCustomProps;
  children?: ReactNode;
}
