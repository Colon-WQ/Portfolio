import { createMuiTheme } from '@material-ui/core/styles';

//visit here to see what to override 
//https://material-ui.com/customization/default-theme/
export const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        light: '#FF0000',
        main: '#88FF00',
        dark: '#330088'
      },
      secondary: {
        light: '#00FF00',
        main: '#0088FF',
        dark: '#553300'
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
