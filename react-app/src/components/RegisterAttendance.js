import { Card, Typography } from "@material-ui/core";
import React, { useState } from "react";
import QrReader from "react-qr-reader";
import { useStopwatch } from "react-timer-hook";
import { CentreAlign } from "./DesignComponents";

export const RegisterAttendance = ({ title, size }) => {
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
    <div style={{ width: size || "100%" }}>
      <CentreAlign
        {...{
          height: 400,
          width: 400,
        }}
      >
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
      </CentreAlign>
    </div>
  );
};
