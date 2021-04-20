import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import {
  AppContext,
  register,
  registrationInfoComplete,
  sendMessage,
  setCount,
  setView,
} from "../AppContext";
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
  const { context, dispatch } = React.useContext(AppContext);

  const { count, attendeeInfo, selectedEvent } = context;

  const handleChange = (event) => {
    const name = event.target.name;
    setCount(dispatch, {
      ...count,
      [name]: event.target.value,
    });
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={12} className={classes.paper}>
        <ShowAttendeeInfo />
      </Grid>

      <Grid item xs={12} className={classes.paper}>
        <EventSelector />
      </Grid>
      <Grid item xs={6} className={classes.rightText}>
        <TextField
          id="adultCount"
          label="Adult Count"
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
          variant="outlined"
          disabled={
            !registrationInfoComplete(attendeeInfo, selectedEvent, count)
          }
          className={classes.button}
          onClick={() => {
            if (registrationInfoComplete(attendeeInfo, selectedEvent, count)) {
              register(dispatch, attendeeInfo, selectedEvent, count);
            } else {
              sendMessage("Please select both attendee and event to confirm");
            }
          }}
        >
          Confirm
        </Button>
        <Button variant="outlined" onClick={() => setView(dispatch)}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};
