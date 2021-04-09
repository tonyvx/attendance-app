const { ipcRenderer, contextBridge } = require("electron");

// window.addEventListener("DOMContentLoaded", () => {
//   // const replaceText = (selector, text) => {
//   //   const element = document.getElementById(selector);
//   //   if (element) element.innerText = text;
//   // };

//   let footerText = "";
//   for (const type of ["chrome", "node", "electron"]) {
//     // replaceText(`${type}-version`, process.versions[type]);
//     footerText += " " + type + "-version " + process.versions[type];
//   }
// });

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["toMain", "toMain_Events"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
      new Notification("Attendance Manager (" + channel + ") " +data,).show();
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      "fromMain",
      "fromMain_AttendeeInfo",
      "fromMain_FooterInfo",
      "fromMain_Events",
    ];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
      console.log("receive", channel);
    }
  },
});
