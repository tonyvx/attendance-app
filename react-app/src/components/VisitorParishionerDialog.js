import { Button, Dialog, DialogContent, Grid } from "@material-ui/core";
import React from "react";
import { AppContext, setNewRegPopper, setView } from "../AppContext";

export const VisitorParishionerDialog = ({ setVisitorDetails }) => {
  const { context, dispatch } = React.useContext(AppContext);

  const { newRegPopper } = context;
  return (
    <Dialog
      open={newRegPopper}
      onClose={() => setNewRegPopper(dispatch, false)}
      aria-labelledby="form-dialog-title"
      style={{ height: "80vh", width: "80vw" }}
    >
      <DialogContent>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              onClick={() => {
                setView(dispatch, "VISITOR");
                setNewRegPopper(dispatch, false);
                setVisitorDetails(true);
              }}
            >
              VISITOR
            </Button>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              onClick={() => {
                setView(dispatch, "PARISHIONER");
                setNewRegPopper(dispatch, false);
              }}
            >
              PARISHIONER
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
