import { createMuiTheme } from '@material-ui/core/styles';

//visit here to see what to override 
//https://material-ui.com/customization/default-theme/
export const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        light: '#EEEEEE',
        main: '#444444',
        dark: '#444444',
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
    }
  })
