import { Typography } from "@material-ui/core";
import React, { useEffect , useState} from "react";

export const ShowAttendeeInfo = () => {
  const [attendeInfo, setAttentdeInfo] = useState({});

  useEffect(() => window.api.receive("fromMain_AttendeeInfo", setAttentdeInfo));

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
