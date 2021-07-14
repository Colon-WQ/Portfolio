import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import * as fonts from './fonts';

export const light = {
  palette: {
      type: 'light',
      primary: {
        main: '#0096c7',
        light: '#00b4d8',
        dark: '#0077b6'
      },
      secondary: {
        main: '#c71f37',
        light: '#da1e37',
        dark: '#85182a'
      },
      contrastPrimary: {
        main: '#9FEDD7'
      },
      contrastSecondary: {
        main: '#026670'
      },
      tertiary: {
        main: '#3e8914',
        light: '#3da35d',
        dark: '#134611'
      },
      background: {
        light: '#ffffff',
        dark: '#eaeaea',
        default: '#f4f4f4',
        paper: '#ffffff',
      },
      text: {
        primary: '#000000',
        secondary: '#073b4c',
        contrast: '#ffffff'
      }
    },
    
    typography: {
      h1: {
        fontSize: '3rem'
      },
      h2: {
        fontSize: '2.5rem'
      },
      h3: {
        fontSize: '2rem'
      },
      h4: {
        fontSize: '1.5rem'
      },
      h5: {
        fontSize: '1.25rem'
      },
      h6: {
        fontSize: '1rem'
      },
      body1: {
        fontSize: '1rem'
      },
      body2: {
        fontSize: '0.875rem'
      },
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
      type: 'light',
      primary: {
        main: '#0096c7',
        light: '#00b4d8',
        dark: '#0077b6'
      },
      secondary: {
        main: '#c71f37',
        light: '#da1e37',
        dark: '#85182a'
      },
      contrastPrimary: {
        main: '#9FEDD7'
      },
      contrastSecondary: {
        main: '#026670'
      },
      tertiary: {
        main: '#3e8914',
        light: '#3da35d',
        dark: '#134611'
      },
      background: {
        light: '#404040',
        dark: '#202020',
        default: '#303030',
        paper: '#404040',
      },
      text: {
        primary: '#ffffff',
        secondary: '#caf0f8',
        contrast: '#000000'
      }
    },
    
    typography: {
      h1: {
        fontSize: '3rem'
      },
      h2: {
        fontSize: '2.5rem'
      },
      h3: {
        fontSize: '2rem'
      },
      h4: {
        fontSize: '1.5rem'
      },
      h5: {
        fontSize: '1.25rem'
      },
      h6: {
        fontSize: '1rem'
      },
      body1: {
        fontSize: '1rem'
      },
      body2: {
        fontSize: '0.875rem'
      },
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

export const lightTheme = responsiveFontSizes(createMuiTheme(light));
export const darkTheme = responsiveFontSizes(createMuiTheme(dark));