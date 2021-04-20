import { Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { AppContext } from "../AppContext";
import { RecordAttendance } from "./RecordAttendance";
import { ScanAttendance } from "./ScanAttendance";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  headerAndFooter: {
    textAlign: "center",
  },
  panels: {
    textAlign: "center",
    height: "90vh",
  },
  dialog: {
    textAlign: "center",
  },
}));

export const Scanner = () => {
  const classes = useStyles();
  const { context } = React.useContext(AppContext);

  const { footerInfo } = context;
  return (
    <Paper style={{ height: "100vh", width: "100%" }}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} className={classes.headerAndFooter}>
          <Typography>St Thomas Syro-Malabar Church, Boston</Typography>
        </Grid>
        <Grid item xs={6} className={classes.panels}>
          <RecordAttendance />
        </Grid>
        <Grid item xs={6} className={classes.panels}>
          <ScanAttendance />
        </Grid>
        <Grid item xs={12} className={classes.headerAndFooter}>
          <Typography>{footerInfo}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
