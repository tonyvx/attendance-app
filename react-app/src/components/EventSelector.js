import { FormControl, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 400,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export const EventSelector = ({ selectedEvent, setSelectedEvent, width }) => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);

  const handleChange = (event) => {
    console.log(events);
    const name = event.target.name;
    setSelectedEvent({
      ...selectedEvent,
      [name]: event.target.value,
    });
    console.log(selectedEvent);
  };
  useEffect(() => {
    window.api.receive("fromMain_Events", setEvents);
  }, []);
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="event-native-simple">Event</InputLabel>
      <Select
        native
        value={selectedEvent.eventId}
        onChange={handleChange}
        inputProps={{
          name: "eventId",
          id: "event-native-simple",
        }}
      >
        <option aria-label="None" value="" />
        {events.map((e) => (
          <option value={e["eventId"]}>
            {e["Date"] +
              " - " +
              e["Event"] +
              " ( " +
              e["Start Time"] +
              " - " +
              e["End Time"] +
              " ) "}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
