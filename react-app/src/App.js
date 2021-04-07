import { Button, Card, Divider, Typography } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import QrReader from "react-qr-reader";
import { useStopwatch } from "react-timer-hook";
import "./App.css";
// const { ipcRenderer } = window.require("electron");

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  const [message, setMessage] = useState("");
  const [attendeInfo, setAttentdeInfo] = useState({});
  useEffect(() => {
    window.api.receive("fromMain", setMessage);
    window.api.receive("fromMain_AttendeeInfo", setAttentdeInfo);
  }, []);
  return (
    // <ThemeProvider theme={theme}>

    // </ThemeProvider>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {message ? (
          <Typography>{message}</Typography>
        ) : (
          <ShowAttendeeInfo attendeInfo={attendeInfo} />
        )}
        <Button style={{ margin: 16 }}>Admit</Button>
      </div>
      <Divider
        style={{ margin: 16, height: "90vh" }}
        light={true}
        orientation="vertical"
      ></Divider>

      <RegisterAttendance title={"Easter Vigil"} />
    </div>
  );
}

const ShowAttendeeInfo = ({ attendeInfo }) => {
  return attendeInfo ? (
    <>
      {Object.keys(attendeInfo).map((key) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: 150 }}>
            <Typography>{key}</Typography>
          </div>
          <div style={{ width: 200 }}>
            <Typography>{attendeInfo[key]}</Typography>
          </div>
        </div>
      ))}
    </>
  ) : null;
};
const RegisterAttendance = ({ title }) => {
  const [state, setState] = useState({
    result: "No result",
  });

  const { seconds, minutes, hours, reset } = useStopwatch({
    autoStart: true,
  });

  const handleScan = (data) => {
    if (data) {
      setState({
        result: data,
      });
      window.api.send("toMain", data);
      reset();
    }
  };
  const handleError = (err) => {
    console.error(err.message);
  };
  console.log(title);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          height: "400",
          width: "400",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography>{title}</Typography>
        <Card style={{ margin: 8, background: "teal" }}>
          <QrReader delay={300} onError={handleError} onScan={handleScan} />
        </Card>
        <Card>
          <Typography style={{ textAlign: "center", width: 400 }}>
            {state.result} Scanned at : <span>{hours}</span>:
            <span>{minutes}</span>:<span>{seconds} </span>
            secs
          </Typography>
        </Card>
      </div>
    </div>
  );
};

export default App;
