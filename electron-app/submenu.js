const { app, dialog } = require("electron");
const fs = require("fs");
const csv = require("csv-parser");
const { Notification } = require("electron");

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

        mainWindow1.webContents.send(
          "fromMain",
          app.getPath("home") + "/.attendance-app/" + fileName
        );
      } catch (e) {
        console.log("Failed to save the file !", e.message);
        mainWindow1.webContents.send(
          "fromMain",
          app.getPath("home") + "/.attendance-app/" + fileName
        );
      }
    });
}

const sendMessage = (mainWindow, message) => {
  if (mainWindow) {
    mainWindow.webContents.send("my-ipc-channel", {
      message,
    });
  }
};

function findAttendee(data1, notifyAttendee) {
  const rows = [];
  fs.createReadStream(app.getPath("home") + "/.attendance-app/attendees.csv")
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      notifyAttendee(
        rows.find((row) =>
          row["First_Name"].toUpperCase().includes(data1.toUpperCase())
        )
      );
    });
}

module.exports = { submenu, findAttendee };
