import { Grid, Paper, Popper, Typography } from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useEffect, useRef, useState } from "react";
import { ConfirmEvents } from "./components/ConfirmEvents";
import { RecordAttendance } from "./components/RecordAttendance";
import { ScanAttendance } from "./components/ScanAttendance";

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

  const [popper, setPopper] = useState({ events: false, attendees: false });
  const [anchorEl, setAnchorEl] = useState(null);

  const [events, setEvents] = useState([]);
  const [attendees, setAttentdees] = useState([]);

  const _ref = useRef();

  useEffect(() => {
    window.api.receive("fromMain_FooterInfo", setFooterInfo);
  }, []);

  useEffect(() => {
    window.api.receive("fromMain_Events", (data) => {
      setEvents(data);
      setPopper({ events: true, attendees: false });
      setAnchorEl(_ref.current || null);
      id = "simple-popover";
    });
  }, []);

  useEffect(() => {
    window.api.receive("fromMain_Attendees", (data) => {
      setAttentdees(data);
      setPopper({ events: false, attendees: true });
      setAnchorEl(_ref.current || null);
      id = "simple-popover";
    });
  }, []);

  let id;

  return (
    <ThemeProvider theme={theme}>
      <Paper ref={_ref} style={{ height: "100vh", width: "100%" }}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} className={classes.headerAndFooter}>
            <Typography>{"smcboston.org"}</Typography>
          </Grid>
          <Grid item xs={6} className={classes.panels}>
            <RecordAttendance events={events} />
          </Grid>
          <Grid item xs={6} className={classes.panels}>
            <ScanAttendance />
          </Grid>
          <Grid item xs={12} className={classes.headerAndFooter}>
            <Typography>{footerInfo}</Typography>
          </Grid>
        </Grid>
        <Popper
          id={id}
          open={popper.attendees || popper.events}
          anchorEl={anchorEl}
          placement={"bottom"}
          style={{ zIndex: 2 }}
        >
          <ConfirmEvents
            {...{
              data:
                (popper.attendees && attendees) || (popper.events && events),
              setPopper,
            }}
          />
        </Popper>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
