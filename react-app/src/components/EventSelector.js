import { FormControl, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { AppContext, setSelectedEvent } from "../AppContext";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 400,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export const EventSelector = () => {
  const classes = useStyles();
  const { context, dispatch } = React.useContext(AppContext);

  const { events, selectedEvent } = context;

  const handleChange = (event) => {
    const name = event.target.name;
    setSelectedEvent(dispatch, {
      ...selectedEvent,
      [name]: event.target.value,
    });
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="event-native-simple">Event</InputLabel>
      <Select
        native
        value={selectedEvent.eventId || ""}
        onChange={handleChange}
        inputProps={{
          name: "eventId",
          id: "event-native-simple",
        }}
      >
        <option aria-label="None" value="" />
        {events.map((e) => (
          <option key={e.id || ""} value={e.id || ""}>
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
