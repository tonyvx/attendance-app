import {
  Button,
  Divider,
  Paper,
  Typography,
  TextField,
} from "@material-ui/core";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useEffect, useState } from "react";
import "./App.css";
import { Column, Row } from "./components/DesignComponents";
import { RegisterAttendance } from "./components/RegisterAttendance";
import { ShowAttendeeInfo } from "./components/ShowAttendeeInfo";
import { EventSelector } from "./components/EventSelector";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
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
        <Typography align={"center"}>{"smcboston.org"}</Typography>
        <div style={{ height: "90vh" }}>
          <Row>
            <Column size={"50%"}>
              <ShowAttendeeInfo attendeInfo={attendeInfo} />
              <EventSelector
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
              />
              <div className={classes.root}>
                <TextField
                  id="adultCount"
                  label="Adult Count"
                  defaultValue="0"
                  onChange={handleChange}
                  inputProps={{
                    name: "adultCount",
                    id: "event-native-simple",
                  }}
                />
                <TextField
                  id="childrenCount"
                  label="Children Count"
                  defaultValue="0"
                  onChange={handleChange}
                  inputProps={{
                    name: "childrenCount",
                    id: "event-native-simple",
                  }}
                />
              </div>
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
            </Column>
            <Divider
              orientation="vertical"
              flexItem
              style={{ height: "90vh" }}
            ></Divider>
            <RegisterAttendance size={"50%"} />
          </Row>
        </div>
        <div style={{ textAlign: "center" }}>{footerInfo}</div>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
