const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  var menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: [
        {
          label: "Open CSV",
          async click() {
            await openCSVFile(win);
          },
        },
        { label: "Verify Attendance" },
        {
          label: "Exit",
          click() {
            app.quit();
          },
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
async function openCSVFile(win) {
  var file = await dialog.showOpenDialog(
    (win,
    {
      title: "select a file",
      properties: ["openFile"],
      filters: [{ name: "csv", extensions: ["csv"] }],
    })
  );
  !file.canceled &&
    Array.isArray(file.filePaths) &&
    file.filePaths.length > 0 &&
    fs.readFile(file.filePaths[0], "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });
}

