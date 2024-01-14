import {
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

const basicDimensions = {
    width: 360,
    height: 800,
};

const width = (basicwidth: number): number => {
    const percentage = (basicwidth / basicDimensions.width) * 100;

    return responsiveScreenWidth(percentage);
};

const height = (basicheight: number): number => {
    const percentage = (basicheight / basicDimensions.height) * 100;

    return responsiveScreenHeight(percentage);
};

const fontSize = (basicsize: number): number => {
    const percentage = basicsize * 0.135;

    return responsiveScreenFontSize(percentage);
};

const colors = {
    white: '#fff',
    black: '#1e2022',
    disable: '#d6d6d6',
    error: '#b50000',
    line: '#e0e0e0',
    main: '#005500',
    point: '#d43900',
    subText: '#6e6f70',
    bg: '#fafafa',
    blue: '#1F3A93',
};

const Theme = {
    fontSize,
    colors,
    height,
    width,
};

export default Theme;
