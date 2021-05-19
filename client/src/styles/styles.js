import { createMuiTheme } from '@material-ui/core/styles';

//visit here to see what to override 
//https://material-ui.com/customization/default-theme/
export const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        light: '#98F9FF',
        main: '#98E0FF',
        dark: '#0012C4'
      },
      secondary: {
        light: '#E0B0FE',
        main: '#B033FF',
        dark: '#4E0080'
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
