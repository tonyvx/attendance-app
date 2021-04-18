import {
  Drawer,
  Grid,
  Paper,
  SwipeableDrawer,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import {
  AppContext,
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

  const { footerInfo, events, attendees, registrationInfo } = context;

  const [popper, setPopper] = useState({
    events: false,
    attendees: false,
    registration: true,
  });
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
      setPopper({ events: true, attendees: false, registrationInfo: false });
      toggleDrawer && setTimeout(setToggleDrawer(false), 50);
      setToggleDrawer(true);
      id = "simple-popover";
    });
  }, []);

  useEffect(() => {
    window.api.receive("fromMain_Attendees", (data) => {
      setAttentdees(dispatch, data);
      setPopper({ events: false, attendees: true, registrationInfo: false });
      toggleDrawer && setTimeout(setToggleDrawer(false), 50);
      setToggleDrawer(true);
      id = "simple-popover";
    });
  }, []);

  useEffect(() => {
    window.api.receive("fromMain_RegistrationInfo", (data) => {
      setRegistrationInfo(dispatch, data);
      setPopper({ events: false, attendees: false, registrationInfo: true });
      toggleDrawer && setTimeout(setToggleDrawer(false), 50);
      setToggleDrawer(true);
      id = "simple-popover";
    });
  }, []);

  useEffect(() =>
    window.api.receive("fromMain_AttendeeInfo", (attendeeInfo1) =>
      setAttentdeeInfo(dispatch, attendeeInfo1)
    )
  );

  let id;

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
        id={id}
        anchor="top"
        open={
          (!!popper.attendees ||
            !!popper.events ||
            !!popper.registrationInfo) &&
          toggleDrawer
        }
        onClose={() => setToggleDrawer(false)}
        onOpen={() => setToggleDrawer(true)}
        placement={"bottom"}
        style={{ zIndex: 2 }}
      >
        <ConfirmData
          {...{
            data:
              (popper.attendees && attendees) ||
              (popper.events && events) ||
              (popper.registrationInfo && registrationInfo),
            fileName:
              (popper.attendees && "Parishioners") ||
              (popper.events && "Masses") ||
              (popper.registrationInfo && "Registration Info"),
            setPopper,
            upload: popper.attendees || popper.events,
          }}
        />
      </SwipeableDrawer>
    </Paper>
  );
};
