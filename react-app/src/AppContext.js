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
  popper: {
    events: false,
    attendees: false,
    registration: false,
  },
  newRegPopper: true,
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
    case "NEW_REG_POPPER":
      return {
        ...context,
        newRegPopper: action.newRegPopper,
      };

    case "POPPER":
      return {
        ...context,
        popper: {
          events: false,
          attendees: false,
          registration: false,
          ...action.update,
        },
      };
    case "RESET_SCAN":
      return {
        ...context,
        scanData: "No result",
      };
    case "VIEW":
      return {
        ...context,
        view: action.view,
      };

    default:
      return context;
  }
};
export const setView = (dispatch, view) => {
  dispatch({ type: "VIEW", view });
  if (!view) {
    setNewRegPopper(dispatch, true);
  }
};
export const setNewRegPopper = (dispatch, newRegPopper) => {
  dispatch({ type: "NEW_REG_POPPER", newRegPopper });
};

export const setFooterInfo = (dispatch, footerInfo) => {
  dispatch({ type: "FOOTER_INFO", footerInfo });
};

export const setEvents = (dispatch, data) => {
  dispatch({ type: "EVENTS", data });
  setPopper(dispatch, { events: true });
};

export const setSelectedEvent = (dispatch, selectedEvent) => {
  dispatch({ type: "SELECTED_EVENT", selectedEvent });
};

export const setAttentdees = (dispatch, data) => {
  dispatch({ type: "ATTENDEES", data });
  setPopper(dispatch, { attendees: true });
};

export const updateAttentdees = (data) => {
  window.api.send("toMain_NewAttendee", data);
};

export const setAttentdeeInfo = (dispatch, attendeeInfo) => {
  dispatch({ type: "ATTENDEE", attendeeInfo });
  updateAttentdees(attendeeInfo);
};
export const setRegistrationInfo = (dispatch, registrationInfo) => {
  dispatch({ type: "REGISTRATION_INFO", registrationInfo });
  setPopper(dispatch, { registrationInfo: true });
};

export const setCount = (dispatch, count) => {
  dispatch({ type: "COUNT", count });
};

export const setPopper = (dispatch, update) => {
  dispatch({ type: "POPPER", update });
};

export const popperData = (context) => {
  const { popper, attendees, events, registrationInfo } = context;
  return {
    data:
      (popper.attendees && attendees) ||
      (popper.events && events) ||
      (popper.registrationInfo && registrationInfo),
    title:
      (popper.attendees && "Parishioners") ||
      (popper.events && "Masses") ||
      (popper.registrationInfo && "Registration Info"),
    showUploadButton: popper.attendees || popper.events,
  };
};

export const validVisitorDetails = (form) => {
  let valid = !!form.name && !!form.adult && !!form.email && !!form.phone;
  if (valid) {
    var emailPattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var phoneRegEx = new RegExp(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    );
    return (
      emailPattern.test(form.email) &&
      phoneRegEx.test(form.phone) &&
      form.phone.match(/\d/g).length === 10
    );
  } else {
    return valid;
  }
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
  setNewRegPopper(dispatch, true);
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
