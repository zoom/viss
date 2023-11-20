import { ThemeProvider, createTheme } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.app.css';

export const themeOptions = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82ff'
    },
    secondary: deepOrange
  },
  shape: {
    borderRadius: 4
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Inter',
    button: {
      textTransform: 'capitalize'
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiSwitch: {
      defaultProps: {
        color: 'primary'
      }
    },
    MuiPaper: {
      defaultProps: {
        variant: 'outlined'
      }
    },
    MuiChip: {
      defaultProps: {
        sx: {
          fontSize: 11,
          marginLeft: 1, 
          marginBottom: 0.3 
        }
      }
    }
  }
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={ themeOptions }>
      <Head>
        <title>Zoom - VISS Calculator</title>
        <link rel="icon" href="/assets/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="/assets/md-style.css"></link>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}

export default CustomApp;
