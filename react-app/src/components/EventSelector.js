import { FormControl, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 400,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export const EventSelector = ({ selectedEvent, setSelectedEvent, events }) => {
  const classes = useStyles();

  const handleChange = (event) => {
    const name = event.target.name;
    setSelectedEvent({
      ...selectedEvent,
      [name]: event.target.value,
    });
  };

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
          <option value={e.id || ""}>
            {e.date +
              " - " +
              e.event +
              " ( " +
              e.startTime +
              " - " +
              e.endTime +
              " ) "}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
