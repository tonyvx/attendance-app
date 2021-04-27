import { SwipeableDrawer } from "@material-ui/core";
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
import { Scanner } from "./components/Scanner";
import { VisitorDetailsDialog } from "./components/VisitorDetailsDialog";
import { VisitorParishionerDialog } from "./components/VisitorParishionerDialog";

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

export const MainApp = () => {
  const { context, dispatch } = React.useContext(AppContext);

  const [visitorDetails, setVisitorDetails] = useState(false);
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
    <>
      <Scanner ref={_ref} />
      <SwipeableDrawer
        style={{ height: "90vh", width: "90vw" }}
        anchor="top"
        open={!!popperData(context).data && toggleDrawer}
        onClose={() => setToggleDrawer(false)}
        onOpen={() => setToggleDrawer(true)}
      >
        <ConfirmData />
      </SwipeableDrawer>
      <VisitorParishionerDialog setVisitorDetails={setVisitorDetails} />
      {visitorDetails && (
        <VisitorDetailsDialog
          setVisitorDetails={setVisitorDetails}
          visitorDetails={visitorDetails}
        />
      )}
    </>
  );
};
