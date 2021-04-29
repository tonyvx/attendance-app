import { SwipeableDrawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  AppContext,
  popperData,
  setAttentdeeInfo,
  setAttentdees,
  setEvents,
  setFooterInfo,
  setRegistrationInfo,
} from "./AppContext";

const ConfirmData = React.lazy(() =>
  import("./components/ConfirmData").then((module) => ({
    default: module.ConfirmData,
  }))
);

const Scanner = React.lazy(() =>
  import("./components/Scanner").then((module) => ({
    default: module.Scanner,
  }))
);

const VisitorDetailsDialog = React.lazy(() =>
  import("./components/VisitorDetailsDialog").then((module) => ({
    default: module.VisitorDetailsDialog,
  }))
);

const VisitorParishionerDialog = React.lazy(() =>
  import("./components/VisitorParishionerDialog").then((module) => ({
    default: module.VisitorParishionerDialog,
  }))
);

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
    <Suspense fallback={<div>Loading...</div>}>
      {<Scanner />}
      <SwipeableDrawer
        style={{ height: "90vh", width: "90vw" }}
        anchor="top"
        open={!!popperData(context).data && toggleDrawer}
        onClose={() => setToggleDrawer(false)}
        onOpen={() => setToggleDrawer(true)}
      >
        <ConfirmData />
      </SwipeableDrawer>
      {<VisitorParishionerDialog setVisitorDetails={setVisitorDetails} />}
      {visitorDetails && (
        <VisitorDetailsDialog
          setVisitorDetails={setVisitorDetails}
          visitorDetails={visitorDetails}
        />
      )}
    </Suspense>
  );
};
