import LiquidCrystalNormal from './fonts/LiquidCrystal-Normal.woff2';
import LiquidCrystalBold from './fonts/LiquidCrystal-Bold.woff2';
import LiquidCrystalLight from './fonts/LiquidCrystal-Light.woff2';
import LiquidCrystalBoldItalic from './fonts/LiquidCrystal-BoldItalic.woff2';
import LiquidCrystalExBold from './fonts/LiquidCrystal-ExBold.woff2';
import LiquidCrystalExBoldItalic from './fonts/LiquidCrystal-ExBoldItalic.woff2';
import LiquidCrystalLightItalic from './fonts/LiquidCrystal-LightItalic.woff2';
import LiquidCrystalNormalItalic from './fonts/LiquidCrystal-NormalItalic.woff2';

// styles.js currently imports everything, including the font name array. Might have unintended side effects
export const fonts = [
  'Arial',
  'Verdana',
  'Helvetica',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT',
  'LiquidCrystal'
];
/*
 * Other formats: 'woff2', 'truetype, 'opentype', 'embedded-opentype', and 'svg'
 * however material UI only supports ttf, woff2
*/
export const liquidCrystalNormal = {
  fontFamily: 'LiquidCrystal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('LiquidCrystal'),
  local('LiquidCrystal-Normal'),
  url(${LiquidCrystalNormal}) format('woff2')
  `
}

export const liquidCrystalNormalItalic = {
  fontFamily: 'LiquidCrystal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('LiquidCrystal'),
  local('LiquidCrystal-NormalItalic'),
  url(${LiquidCrystalNormalItalic}) format('woff2')
  `
}

export const liquidCrystalBold = {
  fontFamily: 'LiquidCrystal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 500,
  src: `
  local('LiquidCrystal'),
  local('LiquidCrystal-Bold'),
  url(${LiquidCrystalBold}) format('woff2')
  `
}

export const liquidCrystalLight = {
  fontFamily: 'LiquidCrystal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 300,
  src: `
  local('LiquidCrystal'),
  local('LiquidCrystal-Light'),
  url(${LiquidCrystalLight}) format('woff2')
  `
}

export const liquidCrystalLightItalic = {
  fontFamily: 'LiquidCrystal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 300,
  src: `
  local('LiquidCrystal'),
  local('LiquidCrystal-LightItalic'),
  url(${LiquidCrystalLightItalic}) format('woff2')
  `
}

export const liquidCrystalBoldItalic = {
  fontFamily: 'LiquidCrystal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 500,
  src: `
  local('LiquidCrystal'),
  local('LiquidCrystal-BoldItalic'),
  url(${LiquidCrystalBoldItalic}) format('woff2')
  `
}

export const liquidCrystalExBold = {
  fontFamily: 'LiquidCrystal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 600,
  src: `
  local('LiquidCrystal'),
  local('LiquidCrystal-ExBold'),
  url(${LiquidCrystalExBold}) format('woff2')
  `
}

export const liquidCrystalExBoldItalic = {
  fontFamily: 'LiquidCrystal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 600,
  src: `
  local('LiquidCrystal'),
  local('LiquidCrystal-ExBoldItalic'),
  url(${LiquidCrystalExBoldItalic}) format('woff2')
  `
}




