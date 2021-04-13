import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { EventSelector } from "./EventSelector";
import { ShowAttendeeInfo } from "./ShowAttendeeInfo";

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
  rightAlignTextField: {
    marginRight: theme.spacing(1),
    width: 192,
  },
  leftAlignTextField: {
    marginLeft: theme.spacing(1),
    width: 192,
  },
  attendeeDetails: {
    width: 400,
  },
  button: {
    margin: theme.spacing(2),
  },
}));

export const RecordAttendance = () => {
  const classes = useStyles();

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
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={12} className={classes.paper}>
        <ShowAttendeeInfo attendeInfo={attendeInfo} />
      </Grid>

      <Grid item xs={12} className={classes.paper}>
        <EventSelector
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      </Grid>
      <Grid item xs={6} className={classes.rightText}>
        <TextField
          id="adultCount"
          label="Adult Count"
          defaultValue={0}
          value={count.adultCount}
          onChange={handleChange}
          inputProps={{
            name: "adultCount",
            id: "event-native-simple",
          }}
          className={classes.rightAlignTextField}
        />
      </Grid>
      <Grid item xs={6} className={classes.leftText}>
        <TextField
          id="childrenCount"
          label="Children Count"
          defaultValue={0}
          value={count.childrenCount}
          onChange={handleChange}
          inputProps={{
            name: "childrenCount",
            id: "event-native-simple",
          }}
          className={classes.leftAlignTextField}
        />
      </Grid>
      <Grid item xs={12} className={classes.paper}>
        <Button
          disabled={!(attendeInfo.id && selectedEvent.eventId)}
          className={classes.button}
          onClick={() => {
            if (attendeInfo.id && selectedEvent.eventId) {
              window.api.send("toMain_ConfirmAttendance", {
                attendeeId: attendeInfo.id,
                eventId: selectedEvent.eventId,
                ...count,
              });
              setAttentdeInfo({});
              setSelectedEvent({ eventId: "" });
              setCount({ adultCount: 0, childrenCount: 0 });
            } else {
              window.api.send(
                "toMain",
                "Please select both attendee and event to confirm"
              );
            }
          }}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  );
};
