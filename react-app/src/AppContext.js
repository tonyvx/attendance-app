import React from "react";

export const AppContext = React.createContext();

export const initialState = {
  attendees: [],
  events: [],
  attendeeInfo: {},
  view: null,
  footerInfo: null,
  selectedEvent: {},
  count: { adultCount: 0, childrenCount: 0 },
  scanData: "No result",
  registrationInfo: {},
};

export const reducer = (context, action) => {
  switch (action.type) {
    case "FOOTER_INFO":
      return {
        ...context,
        footerInfo: action.footerInfo,
      };
    case "ATTENDEES":
      return {
        ...context,
        attendees: action.data,
        view: "attendees",
      };
    case "EVENTS":
      return {
        ...context,
        events: action.data,
        view: "events",
      };

    case "SELECTED_EVENT":
      return {
        ...context,
        selectedEvent: action.selectedEvent,
      };

    case "ATTENDEE":
      return {
        ...context,
        attendeeInfo: action.attendeeInfo,
      };

    case "REGISTRATION_INFO":
      return {
        ...context,
        registrationInfo: action.registrationInfo,
      };

    case "COUNT":
      return {
        ...context,
        count: action.count,
      };

    case "SCAN":
      return {
        ...context,
        scanData: action.scanData,
      };

    case "RESET_SCAN":
      return {
        ...context,
        scanData: "No result",
      };

    default:
      return context;
  }
};

export const setFooterInfo = (dispatch, footerInfo) => {
  dispatch({ type: "FOOTER_INFO", footerInfo });
};

export const setEvents = (dispatch, data) => {
  dispatch({ type: "EVENTS", data });
};

export const setSelectedEvent = (dispatch, selectedEvent) => {
  dispatch({ type: "SELECTED_EVENT", selectedEvent });
};

export const setAttentdees = (dispatch, data) => {
  dispatch({ type: "ATTENDEES", data });
};

export const setAttentdeeInfo = (dispatch, attendeeInfo) => {
  dispatch({ type: "ATTENDEE", attendeeInfo });
};
export const setRegistrationInfo = (dispatch, registrationInfo) => {
  dispatch({ type: "REGISTRATION_INFO", registrationInfo });
};

export const setCount = (dispatch, count) => {
  dispatch({ type: "COUNT", count });
};

export const registrationInfoComplete = (
  attendeeInfo,
  selectedEvent,
  count
) => {
  return (
    attendeeInfo &&
    attendeeInfo.id &&
    selectedEvent &&
    selectedEvent.eventId &&
    count &&
    count.adultCount > 0
  );
};

export const register = (dispatch, attendeInfo, selectedEvent, count) => {
  window.api.send("toMain_ConfirmAttendance", {
    attendeeId: attendeInfo.id,
    eventId: selectedEvent.eventId,
    ...count,
  });
  setAttentdeeInfo(dispatch, {});
  setSelectedEvent(dispatch, {});
  setCount(dispatch, { adultCount: 0, childrenCount: 0 });
  resetScan(dispatch);
};

export const sendMessage = (message) => {
  window.api.send("toMain", message);
};

export const resetScan = (dispatch) => {
  dispatch({ type: "RESET_SCAN" });
};

export const uploadFile = (fileName) => {
  window.api.send("toMain_Upload", fileName);
};

export const setScanData = (dispatch, scanData) => {
  dispatch({ type: "SCAN", scanData });
  try {
    window.api.send("toMain_Attendee", scanData);
  } catch (e) {
    console.log("error while scanning", e.message);
  }
};
