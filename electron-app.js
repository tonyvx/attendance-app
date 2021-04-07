const { app, BrowserWindow, Menu, ipcMain, Notification } = require("electron");
const path = require("path");
const contextMenu = require("electron-context-menu");
const { submenu, findAttendee } = require("./electron-app/submenu");

contextMenu({});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    width: 1024,
    height: 600,
    backgroundColor: "#312450",
    webPreferences: {
      preload: path.join(__dirname, "electron-app/preload.js"),
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
    },
    // icon: "/home/avalantra/projects/attendance-app/public/attendance.png",
    // icon: path.join(__dirname, "public/attendance.png"),
  });

  var menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: submenu(mainWindow),
    },
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile("public/index.html");

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
  console.log(args);
  findAttendee(
    args,
    (attendee) =>
      // new Notification({
      //   title: "Notifiation",
      //   body: JSON.stringify(attendee),
      // }).show()
      mainWindow && mainWindow.webContents.send("fromMain_AttendeeInfo", attendee)
  );
});
