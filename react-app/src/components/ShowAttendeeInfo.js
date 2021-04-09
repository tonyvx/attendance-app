import { Typography } from "@material-ui/core";
import React, { useEffect , useState} from "react";

export const ShowAttendeeInfo = ({attendeInfo}) => {
  return attendeInfo ? (
    <>
      {Object.keys(attendeInfo).map((key) => (
        <div style={{ display: "flex", flexDirection: "row", margin:16 }}>
          <div style={{ width: 150 }}>
            <Typography>{key.replace("_"," ")}</Typography>
          </div>
          <div>
            <Typography>{attendeInfo[key]}</Typography>
          </div>
        </div>
      ))}
    </>
  ) : null;
};
