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
  'Amatic SC',
  'Bangers',
  'Bebas Neue',
  'Bitter',
  'Bona Nova',
  'Comfortaa',
  'Festive',
  'Fredoka One',
  'Fuggles',
  'Lobster',
  'Lobster Two',
  'Montserrat',
  'Oswald',
  'Pacifico',
  'Playfair Display',
  'Poiret One',
  'Poppins',
  'Raleway',
  'Roboto',
  'Shadows Into Light',
  'STIX Two Math',
  'Yomogi',
  'Zen Loop',
  'Zen Tokyo Zoo'
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
  fontFamily: 'Amatic SC',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Amatic SC'),
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
  fontFamily:  ,
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local( ),
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
  fontFamily: 'Bona Nova',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Bona Nova'),
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
  fontFamily: 'Fredoka One',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Fredoka One'),
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
  fontFamily: 'Lobster Two',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Lobster Two'),
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
  fontFamily: 'Playfair Display',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Playfair Display'),
  local('PlayfairDisplay-VariableFont_wght'),
  url(${PlayfairDisplayNormal}) format('truetype')
  `
}


export const PoiretOne = {
  fontFamily: 'Poiret One',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Poiret One'),
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
  fontFamily: 'Shadows Into Light',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Shadows Into Light'),
  local('ShadowsIntoLight-Regular'),
  url(${ShadowsIntoLightNormal}) format('truetype')
  `
}


export const STIXTwoMath = {
  fontFamily: 'STIX Two Math',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('STIX Two Math'),
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
  fontFamily: 'Zen Loop',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Zen Loop'),
  local('ZenLoop-Regular'),
  url(${ZenLoopNormal}) format('truetype')
  `
}


export const ZenTokyoZoo = {
  fontFamily: 'Zen Tokyo Zoo',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
  local('Zen Tokyo Zoo'),
  local('ZenTokyoZoo-Regular'),
  url(${ZenTokyoZooNormal}) format('truetype')
  `
}