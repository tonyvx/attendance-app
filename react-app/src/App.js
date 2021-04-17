import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import { AppContext, initialState, reducer } from "./AppContext";
import "./index.css";
import { MainApp } from "./MainApp";

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const [context, dispatch] = React.useReducer(reducer, initialState);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          context,
          dispatch,
        }}
      >
        <MainApp />
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default App;
