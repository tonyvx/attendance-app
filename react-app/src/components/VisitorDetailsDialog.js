import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import {
  AppContext,
  setAttentdeeInfo,
  validVisitorDetails,
} from "../AppContext";
import { useStyles } from "../MainApp";
import "./keyboard.css";

export const VisitorDetailsDialog = ({ visitorDetails, setVisitorDetails }) => {
  const classes = useStyles();
  const [form, setForm] = useState({ email: "", phone: "", name: "" });
  const [field, setField] = useState("");
  const [layoutName, setLayoutName] = useState("default");
  const [keyboard, setKeyboard] = useState(null);
  const { dispatch } = React.useContext(AppContext);

  const layouts = {
    default: [
      "1 2 3 4 5 6 7 8 9 0 - {bksp}",
      "Q W E R T Y U I O P",
      "A S D F G H J K L {enter}",
      "Z X C V B N M ( ) _ .",
      "{space}",
      "blank",
    ],
    email: [
      "1 2 3 4 5 6 7 8 9 0 - {bksp}",
      "Q W E R T Y U I O P",
      "A S D F G H J K L {enter}",
      "Z X C V B N M ( ) _ .",
      "@ {space} .com",
      "@GMAIL.COM @YAHOO.COM @HOTMAIL.COM",
    ],
    phone: ["1 2 3", "4 5 6", "7 8 9", "{space} 0 {bksp}", "blank", "blank"],
  };

  const setInput = (name, value) =>
    !!name && handleChange({ target: { name, value } });

  const onKeyPress = (button) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{enter}");
  };

  const handleChange = (event) => {
    const name = event.target.name;
    setForm({
      ...form,
      [name]: event.target.value || event.target.checked || "",
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
      style={{ height: 630, width: "80vw" }}
    >
      <DialogContent>
        <DialogTitle className={classes.dialog}>Visitor Details</DialogTitle>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6} className={classes.dialog}>
            <TextField
              id="email"
              helperText="Primary Email"
              value={form.email}
              onChange={(e) => e.preventDefault()}
              onFocus={(e) => focus(e)}
              onClick={(e) => {
                setField("email");
                setLayoutName("email");
              }}
              inputProps={{
                name: "email",
                id: "event-native-simple",
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.dialog}>
            <TextField
              id="phone"
              value={form.phone}
              helperText="Primary Phone"
              onChange={(e) => e.preventDefault()}
              onFocus={(e) => focus(e)}
              onClick={(e) => {
                setField("phone");
                setLayoutName("phone");
              }}
              inputProps={{
                name: "phone",
                id: "event-native-simple",
              }}
            ></TextField>
          </Grid>
          <Grid item xs={6} className={classes.dialog}>
            <TextField
              id="name"
              helperText="Name"
              value={form.name}
              inputProps={{
                name: "name",
                id: "event-native-simple",
              }}
              onChange={(e) => e.preventDefault()}
              onFocus={(e) => focus(e)}
              onClick={(e) => {
                setField("name");

                setLayoutName("default");
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
              }}
            >
              confirm
            </Button>
          </Grid>
          <Grid item xs={12} className={classes.dialog}>
            <Container
              id="keyboard"
              style={{
                color: "grey",
                width: "100%",
              }}
            >
              <Keyboard
                inputName={field}
                keyboardRef={(r) => {
                  setKeyboard(r);
                }}
                layoutName={"default"}
                onChange={(e) => {
                  setInput(field, e || "");
                }}
                layout={{ default: layouts[layoutName] }}
                buttonTheme={[
                  {
                    class: "button-disabled",
                    buttons: "blank",
                  },
                ]}
              />
            </Container>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
const focus = (e) =>
  e.currentTarget.setSelectionRange(
    e.currentTarget.value.length || 0,
    e.currentTarget.value.length || 0
  );
