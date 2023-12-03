import React from 'react';
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffcc",
    },
    secondary: {
      main: "#99ccff",
    },
  },
  components: {
    MuiCheckbox: {
      defaultProps: {
        color: "secondary",
      },
    },
    MuiRadio: {
      defaultProps: {
        color: "secondary",
      },
    },
    MuiSwitch: {
      defaultProps: {
        color: "secondary",
      },
    },
  },
});

function withRoot(Component) {
  function WithRoot(props) {
    // ThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...props} theme={theme} />
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
