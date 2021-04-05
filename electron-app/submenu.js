const { app, dialog } = require("electron");
const fs = require("fs");

function submenu(mainWindow) {
  return [
    {
      label: "Import Attendees as CSV",
      async click() {
        await openCSVFile(mainWindow, "attendees.csv");
      },
    },
    {
      label: "Import Events",
      async click() {
        await openCSVFile(mainWindow, "events.csv");
      },
    },
    {
      label: "Upload Icon",
      async click() {
        await openCSVFile(mainWindow, "icon.jpeg", "jpeg");
      },
    },

    { label: "Verify Attendance" },
    {
      label: "Exit",
      click() {
        app.quit();
      },
    },
  ];
}
exports.submenu = submenu;

async function openCSVFile(mainWindow1, fileName, type = "csv") {
  var file = await dialog.showOpenDialog(
    (mainWindow1,
    {
      title: "select a file",
      properties: ["openFile"],
      filters: [{ name: type, extensions: [type] }],
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
      try {
        console.log(app.getPath("home"));
        fs.mkdir(
          app.getPath("home") + "/.attendance-app/",
          { recursive: true },
          (dirErr) => {
            if (dirErr) throw dirErr;
          }
        );
        fs.writeFileSync(
          app.getPath("home") + "/.attendance-app/" + fileName,
          data,
          type === "csv" ? "utf-8" : "binary"
        );
      } catch (e) {
        console.log("Failed to save the file !");
      }
    });
}
