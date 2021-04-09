import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useEffect, useState } from "react";
import "./App.css";
import { Column, Row } from "./components/DesignComponents";
import { RegisterAttendance } from "./components/RegisterAttendance";
import { ShowAttendeeInfo } from "./components/ShowAttendeeInfo";

// const theme = createMuiTheme({
//   palette: {
//     type: "dark",
//   },
// });

function App() {
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
  const [message, setMessage] = useState("");
  const [attendeInfo, setAttentdeInfo] = useState({});
  const [footerInfo, setFooterInfo] = useState("");
  useEffect(() => {
    window.api.receive("fromMain", setMessage);
    window.api.receive("fromMain_AttendeeInfo", setAttentdeInfo);
    window.api.receive("fromMain_FooterInfo", setFooterInfo);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100%", width: "100%" }}>
        <Row>
          <Column size={"50%"}>
            {message ? (
              <Typography>{message}</Typography>
            ) : (
              <ShowAttendeeInfo attendeInfo={attendeInfo} />
            )}
            <ShowEvent />
            <Button style={{ margin: 16 }}>Admit</Button>
          </Column>
          <Divider
            style={{ margin: 16, height: "90vh" }}
            orientation="vertical"
          ></Divider>
          <RegisterAttendance title={"smcboston.org"} size={"50%"} />
        </Row>
        <div style={{ textAlign: "center" }}>{footerInfo}</div>
      </Paper>
    </ThemeProvider>
  );
}

export default App;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ShowEvent = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [state, setState] = React.useState({
    age: "",
    name: "hai",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  useEffect(() => {
    window.api.receive("fromMain_Events", setEvents);
  }, []);
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="event-native-simple">Event</InputLabel>
      <Select
        native
        value={state.event}
        onChange={handleChange}
        inputProps={{
          name: "event",
          id: "event-native-simple",
        }}
        onClick={() => window.api.send("toMain_Events", "send events")}
      >
        <option aria-label="None" value="" />
        {events.map((e) => (
          <option value={e}>{e}</option>
        ))}
      </Select>
    </FormControl>
  );
};
