import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import * as fonts from './fonts';

export const light = {
  palette: {
      type: 'light',
      primary: {
        main: '#FEF9C7',
      },
      secondary: {
        main: '#FCE181',
      },
      contrastPrimary: {
        main: '#9FEDD7'
      },
      contrastSecondary: {
        main: '#026670'
      },
      tertiary: {
        light: '#687A8F',
        main: '#9FEDD7',
        dark: '#e76f51',
        contrastText: '#fff'
      },
      background: {
        default: '#fff',
        light: '#faf7e3',
        dark: '#687A8F'
      },
      text: {
        primary: '#264653',
        secondary: '#2a9d8f'
      }
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto'
      ].join(',')
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': Object.values(fonts)
        }
      }
    }
}

export const dark = {
    palette: {
      type: 'dark',
      primary: {
        light: '#EEEEEE',
        main: '#444444',
        dark: '#222222',
      },
      secondary: {
        light: '#ff4081',
        main: '#f50057',
        dark: '#c51162',
        contrastText: '#fff'
      },
      error: {
        light: '#e57373',
        main: '#f44336',
        dark: '#d32f2f',
        contrastText: '#fff'
      },
      text: {
        primary: 'rgba(255, 255, 255, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.87)'
      }
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto'
      ].join(',')
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': Object.values(fonts)
        }
      }
    }
  };
//visit here to see what to override 
//https://material-ui.com/customization/default-theme/
export const theme = responsiveFontSizes(createMuiTheme(light));
