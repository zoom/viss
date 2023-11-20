import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ThemeProvider, createTheme } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { NotificationProvider } from '../notification/context';

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
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
        inputProps: {
          style: {
            fontSize: 14
          }
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    },
    MuiTooltip: {
      defaultProps: {
        placement: 'top'
      }
    },
    MuiTableRow: {
      defaultProps: {
        style: {
          height: '50px'
        }
      }
    },
    MuiTableCell: {
      defaultProps: {
        style: {
          padding: '6px 16px'
        }
      }
    },
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
    },
    MuiToggleButton: {
      defaultProps: {
        size: 'small'
      }
    }
  }
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={ themeOptions }>
      <Head>
        <title>Zoom - VISS Configurator</title>
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <NotificationProvider>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default CustomApp;
