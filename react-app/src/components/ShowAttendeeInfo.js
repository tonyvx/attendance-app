import { Typography } from "@material-ui/core";
import React from "react";

export const ShowAttendeeInfo = ({ attendeInfo }) => {
  return attendeInfo ? (
    <>
      {Object.keys(attendeInfo).map((key) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: 150 }}>
            <Typography>{key}</Typography>
          </div>
          <div>
            <Typography>{attendeInfo[key]}</Typography>
          </div>
        </div>
      ))}
    </>
  ) : null;
};
