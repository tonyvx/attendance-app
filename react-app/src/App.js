import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useEffect, useState } from "react";
import "./App.css";
import { EventSelector } from "./components/EventSelector";
import { RegisterAttendance } from "./components/RegisterAttendance";
import { ShowAttendeeInfo } from "./components/ShowAttendeeInfo";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  leftText: {
    textAlign: "left",
  },
  rightText: {
    textAlign: "right",
  },
  container: {
    height: "100vh",
  },
  attendeeDetails: {
    width: 400,
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
  const [attendeInfo, setAttentdeInfo] = useState({});

  const [selectedEvent, setSelectedEvent] = React.useState({});
  const [count, setCount] = React.useState({});

  const handleChange = (event) => {
    console.log("handleChange : current ", count, " update/add ", {
      [event.target.name]: event.target.value,
    });
    const name = event.target.name;
    setCount({
      ...count,
      [name]: event.target.value,
    });
  };

  useEffect(() => window.api.receive("fromMain_AttendeeInfo", setAttentdeInfo));

  const [footerInfo, setFooterInfo] = useState("");

  useEffect(() => {
    window.api.receive("fromMain_FooterInfo", setFooterInfo);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh", width: "100%" }}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} className={classes.paper}>
            <Typography>{"smcboston.org"}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} className={classes.paper}>
                <ShowAttendeeInfo attendeInfo={attendeInfo} />
              </Grid>
             
              <Grid item xs={12} className={classes.paper}>
                <EventSelector
                  selectedEvent={selectedEvent}
                  setSelectedEvent={setSelectedEvent}
                  width={400}
                />
              </Grid>
              <Grid item xs={6} className={classes.rightText}>
                <TextField
                  id="adultCount"
                  label="Adult Count"
                  defaultValue="0"
                  onChange={handleChange}
                  inputProps={{
                    name: "adultCount",
                    id: "event-native-simple",
                  }}
                  style={{ marginRight: 8, width: 192 }}
                />
              </Grid>
              <Grid item xs={6} className={classes.leftText}>
                <TextField
                  id="childrenCount"
                  label="Children Count"
                  defaultValue="0"
                  onChange={handleChange}
                  inputProps={{
                    name: "childrenCount",
                    id: "event-native-simple",
                  }}
                  style={{ marginLeft: 8, width: 192 }}
                />
              </Grid>
              <Grid item xs={12} className={classes.paper}>
                <Button
                  style={{ margin: 16 }}
                  onClick={() =>
                    window.api.send("toMain_ConfirmAttendance", {
                      attendeeId: attendeInfo.id,
                      eventId: selectedEvent.eventId,
                      ...count,
                    })
                  }
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.paper}>
            <RegisterAttendance />
          </Grid>
          <Grid item xs={12} className={classes.paper}>
            <Typography>{footerInfo}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
