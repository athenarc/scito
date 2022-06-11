import Gradient from "javascript-color-gradient";


const dominantColors = [
    '#1f471f',
    '#5eba5e',
    '#b8e0b8'
];

const paletteRange = 130;

export const palette = new Gradient().setColorGradient(...dominantColors).setMidpoint(paletteRange);

export const TOOLTIP_PADDING_Y = 5;
export const TOOLTIP_PADDING_X = 5;
export const TOOLTIP_CONTENT_SCROLLBAR_GUTTER = 7;
export const TOOLTIP_WIDTH = 400;
export const TOOLTIP_HEIGHT = 400;
export const TOOLTIP_ARROW = 10;
export const TOOLTIP_BORDER_RADIUS = 4;