import AmaticSCNormal from './fonts/AmaticSC-Regular.ttf';
import BangersNormal from './fonts/Bangers-Regular.ttf';
import BebasNeueNormal from './fonts/BebasNeue-Regular.ttf';
import BitterNormal from './fonts/Bitter-VariableFont_wght.ttf';
import BonaNovaNormal from './fonts/BonaNova-Regular.ttf';
import ComfortaaNormal from './fonts/Comfortaa-VariableFont_wght.ttf';
import FestiveNormal from './fonts/Festive-Regular.ttf';
import FredokaOneNormal from './fonts/FredokaOne-Regular.ttf';
import FugglesNormal from './fonts/Fuggles-Regular.ttf';
import LobsterNormal from './fonts/Lobster-Regular.ttf';
import LobsterTwoNormal from './fonts/LobsterTwo-Regular.ttf';
import MontserratNormal from './fonts/Montserrat-Regular.ttf';
import OswaldNormal from './fonts/Oswald-VariableFont_wght.ttf';
import PacificoNormal from './fonts/Pacifico-Regular.ttf';
import PlayfairDisplayNormal from './fonts/PlayfairDisplay-VariableFont_wght.ttf';
import PoiretOneNormal from './fonts/PoiretOne-Regular.ttf';
import PoppinsNormal from './fonts/Poppins-Regular.ttf';
import RalewayNormal from './fonts/Raleway-VariableFont_wght.ttf';
import RobotoNormal from './fonts/Roboto-Regular.ttf';
import ShadowsIntoLightNormal from './fonts/ShadowsIntoLight-Regular.ttf';
import STIXTwoMathNormal from './fonts/STIXTwoMath-Regular.ttf';
import YomogiNormal from './fonts/Yomogi-Regular.ttf';
import ZenLoopNormal from './fonts/ZenLoop-Regular.ttf';
import ZenTokyoZooNormal from './fonts/ZenTokyoZoo-Regular.ttf';

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
  'AmaticSC',
  'Bangers',
  'BebasNeue',
  'Bitter',
  'BonaNova',
  'Comfortaa',
  'Festive',
  'FredokaOne',
  'Fuggles',
  'Lobster',
  'LobsterTwo',
  'Montserrat',
  'Oswald',
  'Pacifico',
  'PlayfairDisplay',
  'PoiretOne',
  'Poppins',
  'Raleway',
  'Roboto',
  'ShadowsIntoLight',
  'STIXTwoMath',
  'Yomogi',
  'ZenLoop',
  'ZenTokyoZoo'
];

export const webSafeFonts = [
  'Arial',
  'Verdana',
  'Helvetica',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT'
]
/*
 * Other formats: 'woff2', 'truetype, 'opentype', 'embedded-opentype', and 'svg'
 * however material UI only supports ttf, woff2
*/
export const AmaticSC = {
  fontFamily: 'AmaticSC',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('AmaticSC'),
  local('AmaticSC-Regular'),
  url(${AmaticSCNormal}) format('truetype')
  `
}


export const Bangers = {
  fontFamily: 'Bangers',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Bangers'),
  local('Bangers-Regular'),
  url(${BangersNormal}) format('truetype')
  `
}


export const BebasNeue = {
  fontFamily: 'BebasNeue',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('BebasNeue'),
  local('BebasNeue-Regular'),
  url(${BebasNeueNormal}) format('truetype')
  `
}


export const Bitter = {
  fontFamily: 'Bitter',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Bitter'),
  local('Bitter-VariableFont_wght'),
  url(${BitterNormal}) format('truetype')
  `
}


export const BonaNova = {
  fontFamily: 'BonaNova',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('BonaNova'),
  local('BonaNova-Regular'),
  url(${BonaNovaNormal}) format('truetype')
  `
}


export const Comfortaa = {
  fontFamily: 'Comfortaa',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Comfortaa'),
  local('Comfortaa-VariableFont_wght'),
  url(${ComfortaaNormal}) format('truetype')
  `
}


export const Festive = {
  fontFamily: 'Festive',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Festive'),
  local('Festive-Regular'),
  url(${FestiveNormal}) format('truetype')
  `
}


export const FredokaOne = {
  fontFamily: 'FredokaOne',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('FredokaOne'),
  local('FredokaOne-Regular'),
  url(${FredokaOneNormal}) format('truetype')
  `
}


export const Fuggles = {
  fontFamily: 'Fuggles',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Fuggles'),
  local('Fuggles-Regular'),
  url(${FugglesNormal}) format('truetype')
  `
}


export const Lobster = {
  fontFamily: 'Lobster',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Lobster'),
  local('Lobster-Regular'),
  url(${LobsterNormal}) format('truetype')
  `
}


export const LobsterTwo = {
  fontFamily: 'LobsterTwo',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('LobsterTwo'),
  local('LobsterTwo-Regular'),
  url(${LobsterTwoNormal}) format('truetype')
  `
}


export const Montserrat = {
  fontFamily: 'Montserrat',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Montserrat'),
  local('Montserrat-Regular'),
  url(${MontserratNormal}) format('truetype')
  `
}


export const Oswald = {
  fontFamily: 'Oswald',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Oswald'),
  local('Oswald-VariableFont_wght'),
  url(${OswaldNormal}) format('truetype')
  `
}


export const Pacifico = {
  fontFamily: 'Pacifico',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Pacifico'),
  local('Pacifico-Regular'),
  url(${PacificoNormal}) format('truetype')
  `
}


export const PlayfairDisplay = {
  fontFamily: 'PlayfairDisplay',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('PlayfairDisplay'),
  local('PlayfairDisplay-VariableFont_wght'),
  url(${PlayfairDisplayNormal}) format('truetype')
  `
}


export const PoiretOne = {
  fontFamily: 'PoiretOne',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('PoiretOne'),
  local('PoiretOne-Regular'),
  url(${PoiretOneNormal}) format('truetype')
  `
}


export const Poppins = {
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Poppins'),
  local('Poppins-Regular'),
  url(${PoppinsNormal}) format('truetype')
  `
}


export const Raleway = {
  fontFamily: 'Raleway',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Raleway'),
  local('Raleway-VariableFont_wght'),
  url(${RalewayNormal}) format('truetype')
  `
}

export const Roboto = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Roboto'),
  local('Roboto-Regular'),
  url(${RobotoNormal}) format('truetype')
  `
}


export const ShadowsIntoLight = {
  fontFamily: 'ShadowsIntoLight',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('ShadowsIntoLight'),
  local('ShadowsIntoLight-Regular'),
  url(${ShadowsIntoLightNormal}) format('truetype')
  `
}


export const STIXTwoMath = {
  fontFamily: 'STIXTwoMath',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('STIXTwoMath'),
  local('STIXTwoMath-Regular'),
  url(${STIXTwoMathNormal}) format('truetype')
  `
}


export const Yomogi = {
  fontFamily: 'Yomogi',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Yomogi'),
  local('Yomogi-Regular'),
  url(${YomogiNormal}) format('truetype')
  `
}


export const ZenLoop = {
  fontFamily: 'ZenLoop',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('ZenLoop'),
  local('ZenLoop-Regular'),
  url(${ZenLoopNormal}) format('truetype')
  `
}


export const ZenTokyoZoo = {
  fontFamily: 'ZenTokyoZoo',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('ZenTokyoZoo'),
  local('ZenTokyoZoo-Regular'),
  url(${ZenTokyoZooNormal}) format('truetype')
  `
}