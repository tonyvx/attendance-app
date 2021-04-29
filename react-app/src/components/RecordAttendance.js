import {
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
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
      <Grid item xs={12} className={classes.paper}>
        <Container style={{ width: 350 }}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={6} className={classes.paper}>
              <InputLabel shrink htmlFor="adultCount">
                Adult Count
              </InputLabel>
              <Select
                labelId="adultCount"
                id="adultCount"
                label="Adult Count"
                value={count.adultCount || 1}
                onChange={handleChange}
                inputProps={{
                  name: "adultCount",
                  id: "adultCount",
                }}
              >
                {Array(9)
                  .fill(0)
                  .map((f, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid item xs={6} className={classes.paper}>
              <InputLabel shrink htmlFor="childrenCount">
                Children Count
              </InputLabel>
              <Select
                labelId="childrenCount"
                id="childrenCount"
                label="Children Count"
                value={count.childrenCount || 0}
                onChange={handleChange}
                inputProps={{
                  name: "childrenCount",
                  id: "childrenCount",
                }}
              >
                {Array(9)
                  .fill(0)
                  .map((f, i) => (
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
        </Container>
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
