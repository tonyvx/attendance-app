const { ipcRenderer, contextBridge } = require("electron");
const { sendMessage } = require("./utils");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels 
    let validChannels = ["toMain", "toMain_Events", "toMain_Attendee", "toMain_ConfirmAttendance"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      "fromMain",
      "fromMain_AttendeeInfo",
      "fromMain_FooterInfo",
      "fromMain_Events",
      "fromMain_Attendees"
    ];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
      console.log("receive", channel);
    }
  },
});
