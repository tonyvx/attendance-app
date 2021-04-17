import { Card, Container, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import QrReader from "react-qr-reader";
import { useStopwatch } from "react-timer-hook";
import { AppContext, setScanData } from "../AppContext";

export const ScanAttendance = ({ size }) => {
  const { context, dispatch } = useContext(AppContext);

  const { scanData } = context;

  const { seconds, minutes, hours, reset } = useStopwatch({
    autoStart: true,
  });

  const handleScan = (data) => {
    if (data) {
      setScanData(dispatch, data);
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
          {scanData} Scanned at : <span>{hours}</span>:<span>{minutes}</span>:
          <span>{seconds} </span>
          secs
        </Typography>
      </Card>
    </Container>
  );
};
