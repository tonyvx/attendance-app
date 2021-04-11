import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from "@material-ui/core/styles";
import { RegisterAttendance } from "./components/ScanAttendance";
import { RecordAttendance } from "./components/RecordAttendance";

export const useStyles = makeStyles((theme) => ({
  headerAndFooter: {
    textAlign: "center",
  },
  panels: {
    textAlign: "center",
    height: "90vh",
  },
}));

function App() {
  const classes = useStyles();
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

  const [footerInfo, setFooterInfo] = useState("");

  useEffect(() => {
    window.api.receive("fromMain_FooterInfo", setFooterInfo);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh", width: "100%" }}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} className={classes.headerAndFooter}>
            <Typography>{"smcboston.org"}</Typography>
          </Grid>
          <Grid item xs={6} className={classes.panels}>
            <RecordAttendance />
          </Grid>
          <Grid item xs={6} className={classes.panels}>
            <RegisterAttendance />
          </Grid>
          <Grid item xs={12} className={classes.headerAndFooter}>
            <Typography>{footerInfo}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
