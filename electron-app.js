const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const contextMenu = require("electron-context-menu");
const { submenu } = require("./electron-app/submenu");

contextMenu({});

function createWindow() {
  let mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    width: 800,
    height: 600,
    backgroundColor: "#312450",
    webPreferences: {
      preload: path.join(__dirname, "electron-app/preload.js"),
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
