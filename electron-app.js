const { app, BrowserWindow, Menu, ipcMain, Notification } = require("electron");
const path = require("path");
const contextMenu = require("electron-context-menu");
const {
  submenu,
  findAttendee,
  readAndPublishCSV,
  sendMessage,
  updateRegistrations,
} = require("./electron-app/utils");

contextMenu({});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    // titleBarStyle: "hidden",
    width: 1024,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "electron-app/preload.js"),
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
    },
    icon: path.join(__dirname, "public/attendance.png"),
  });

  var menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: submenu(mainWindow),
    },
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile("public/index.html");

  mainWindow.webContents.on("did-finish-load", () => {
    let footerText = " ";
    for (const type of ["chrome", "node", "electron"]) {
      process.versions[type] &&
        (footerText += type + " : " + process.versions[type] + " ");
    }
    mainWindow.webContents.send("fromMain_FooterInfo", footerText);
    //On App load
    readAndPublishCSV("events.csv", mainWindow, "fromMain_Events");
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("toMain", (event, args) => {
  console.log("channel: toMain (sendMessage) :", args);
  sendMessage(args);
});

ipcMain.on("toMain_Attendee", (event, args) => {
  console.log("channel: toMain_Attendee (findAttendee) :", args);
  findAttendee(args, (attendee) => {
    mainWindow &&
      mainWindow.webContents.send("fromMain_AttendeeInfo", attendee);
    sendMessage(args);
  });
});


ipcMain.on("toMain_ConfirmAttendance", (event, args) => {
  console.log(
    "channel: toMain_ConfirmAttendance (updateRegistrations) :",
    args
  );
  updateRegistrations(args);
  sendMessage("Thanks for confirming your attendance");
});
