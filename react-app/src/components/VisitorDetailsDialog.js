import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  AppContext,
  setAttentdeeInfo,
  validVisitorDetails,
} from "../AppContext";
import { useStyles } from "../MainApp";

export const VisitorDetailsDialog = ({ visitorDetails, setVisitorDetails }) => {
  const classes = useStyles();
  const [form, setForm] = useState({});
  const { dispatch } = React.useContext(AppContext);

  const handleChange = (event) => {
    const name = event.target.name;
    setForm({
      ...form,
      [name]: !!event.target.value ? event.target.value : event.target.checked,
    });
  };

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  return (
    <Dialog
      open={visitorDetails}
      onClose={() => setVisitorDetails(false)}
      aria-labelledby="form-dialog-title"
      style={{ height: "80vh", width: "80vw" }}
    >
      <DialogContent>
        <DialogTitle className={classes.dialog}>Visitor Details</DialogTitle>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6} className={classes.dialog}>
            <TextField
              id="email"
              label="Primary Email"
              onChange={handleChange}
              inputProps={{
                name: "email",
                id: "event-native-simple",
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.dialog}>
            <TextField
              id="phone"
              label="Primary Phone"
              onChange={handleChange}
              inputProps={{
                name: "phone",
                id: "event-native-simple",
              }}
            ></TextField>
          </Grid>
          <Grid item xs={6} className={classes.dialog}>
            <TextField
              id="name"
              label="Name"
              onChange={handleChange}
              inputProps={{
                name: "name",
                id: "event-native-simple",
              }}
            ></TextField>
          </Grid>
          <Grid item xs={6} className={classes.dialog}>
            <InputLabel>
              Adult
              <Checkbox
                id="adult"
                label="Adult"
                checked={form.adult}
                onChange={handleChange}
                inputProps={{
                  name: "adult",
                  id: "event-native-simple",
                }}
              ></Checkbox>
            </InputLabel>
          </Grid>
          <Grid item xs={12} className={classes.dialog}>
            <Button
              style={{ margin: 16 }}
              disabled={!validVisitorDetails(form)}
              variant="outlined"
              onClick={() => {
                setVisitorDetails(false);
                setAttentdeeInfo(dispatch, {
                  family: form.name,
                  children: "",
                  phone: form.phone,
                  emails: form.email,
                  id: uuidv4(),
                });

                console.log(form);
              }}
            >
              confirm
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
