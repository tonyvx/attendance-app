import { Card, Container, Typography } from "@material-ui/core";
import React, { useState } from "react";
import QrReader from "react-qr-reader";
import { useStopwatch } from "react-timer-hook";

export const ScanAttendance = ({ title, size }) => {
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
      try {
        window.api.send("toMain_Attendee", data);
      } catch (e) {
        console.log("error while scanning",e.message);
      }
      reset();
    }
  };
  const handleError = (err) => {
    console.error(err.message);
  };
  return (
    <Container style={{ width: size || "100%" }}>
      <Card style={{ margin: 8 }}>
        <QrReader delay={300} onError={handleError} onScan={handleScan} />
      </Card>
      <Card>
        <Typography style={{ textAlign: "center", width: 400 }}>
          {state.result} Scanned at : <span>{hours}</span>:
          <span>{minutes}</span>:<span>{seconds} </span>
          secs
        </Typography>
      </Card>
    </Container>
  );
};
