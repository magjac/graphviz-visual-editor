import React from 'react';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material';
import { CssBaseline } from '@mui/material';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createTheme({
  palette: {
    primary: {
      main: "#4ed1f8", // Blueish
    },
    secondary: {
      main: "#19ccaa", // Greenish
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
          <Component {...props} />
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
