import { Grid, Paper, SwipeableDrawer, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import {
  AppContext,
  popperData,
  setAttentdeeInfo,
  setAttentdees,
  setEvents,
  setFooterInfo,
  setRegistrationInfo,
} from "./AppContext";
import { ConfirmData } from "./components/ConfirmData";
import { RecordAttendance } from "./components/RecordAttendance";
import { ScanAttendance } from "./components/ScanAttendance";

export const useStyles = makeStyles((theme) => ({
  headerAndFooter: {
    textAlign: "center",
  },
  panels: {
    textAlign: "center",
    height: "90vh",
  },
}));

export const MainApp = () => {
  const classes = useStyles();
  const { context, dispatch } = React.useContext(AppContext);

  const { footerInfo } = context;

  const [toggleDrawer, setToggleDrawer] = useState(false);

  const _ref = useRef();

  useEffect(() => {
    window.api.receive("fromMain_FooterInfo", (footerInfo1) =>
      setFooterInfo(dispatch, footerInfo1)
    );
  }, []);

  useEffect(() => {
    window.api.receive("fromMain_Events", (data) => {
      setEvents(dispatch, data);
      setToggleDrawer(true);
    });
  }, []);

  useEffect(() => {
    window.api.receive("fromMain_Attendees", (data) => {
      setAttentdees(dispatch, data);
      setToggleDrawer(true);
    });
  }, []);

  useEffect(() => {
    window.api.receive("fromMain_RegistrationInfo", (data) => {
      setRegistrationInfo(dispatch, data);
      setToggleDrawer(true);
    });
  }, []);

  useEffect(() =>
    window.api.receive("fromMain_AttendeeInfo", (attendeeInfo1) =>
      setAttentdeeInfo(dispatch, attendeeInfo1)
    )
  );

  return (
    <Paper ref={_ref} style={{ height: "100vh", width: "100%" }}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} className={classes.headerAndFooter}>
          <Typography>{"smcboston.org"}</Typography>
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
      <SwipeableDrawer
        style={{ height: "90vh", width: "90vw" }}
        anchor="top"
        open={!!popperData(context).data && toggleDrawer}
        onClose={() => setToggleDrawer(false)}
        onOpen={() => setToggleDrawer(true)}
      >
        <ConfirmData />
      </SwipeableDrawer>
    </Paper>
  );
};
