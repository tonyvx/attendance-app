const { app, dialog, Notification } = require("electron");
const fs = require("fs");
const csv = require("csv-parser");
const camelcase = require("camelcase");
const { compareAsc, format } = require("date-fns");

const path = require("path");

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
  console.log("openCSVFile ", fileName);
  var file = await dialog.showOpenDialog(
    (mainWindow1,
    {
      title: "select a file",
      properties: ["openFile"],
      filters: [{ name: type, extensions: [type] }],
    })
  );
  const fileToImport =
    !file.canceled &&
    Array.isArray(file.filePaths) &&
    file.filePaths.length > 0 &&
    file.filePaths[0];
  console.log("openCSVFile : fileToImport : ", fileToImport);
  fileToImport &&
    fs.readFile(fileToImport, "utf8", (err, data) => {
      if (err) {
        console.error("openCSVFile ", err);
        return;
      }
      try {
        console.log("openCSVFile updating to location", app.getPath("home"));

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

        sendMessage(fileName + " updated.");

        if (fileName === "events.csv")
          getEvents(
            (events) =>
              mainWindow1 &&
              mainWindow1.webContents.send("fromMain_Events", events)
          );
      } catch (e) {
        console.log("openCSVFile : Failed to save the file !", e.message);
        sendMessage(
          "Failed to save " + fileName + " (Details - " + e.message + "),"
        );
      }
    });
}

const sendMessage = (message) => {
  console.log("sendMessage", message);
  new Notification({
    title: "Attendance Manager",
    body: message,
  }).show();
};

function findAttendee(data1, notifyAttendee) {
  console.log("findAttendee : ", data1);
  const rows = [];
  fs.createReadStream(app.getPath("home") + "/.attendance-app/attendees.csv")
    .pipe(csv())
    .on("data", (row) => {
      rows.push({
        family: row["First_Name"],
        children: row["Child_Names"],
        id: row["FamilyId"],
        emails: row["Emails"],
      });
    })
    .on("end", () => {
      console.log("findAttendee : CSV file successfully processed");

      notifyAttendee(
        rows.find((row) =>
          row.family.toUpperCase().includes(data1.toUpperCase())
        )
      );
    });
}

function getEvents(publishEvents) {
  console.log("getEvents");
  const rows = [];
  fs.createReadStream(app.getPath("home") + "/.attendance-app/events.csv")
    .pipe(
      csv({
        mapHeaders: ({ header, index }) => camelcase(header),
      })
    )
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", () => {
      console.log("getEvents : CSV file successfully processed");
      publishEvents(rows);
    });
}

function updateRegistrations(registrationInfo) {
  console.log("updateRegistrations", registrationInfo);
  const rows = [];

  fs.createReadStream(app.getPath("home") + "/.attendance-app/registration.csv")
    .pipe(
      csv({
        mapHeaders: ({ header, index }) => camelcase(header),
      })
    )
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", () => {
      console.log("updateRegistrations : CSV file successfully processed");
      const pos = rows.findIndex(
        (row) =>
          row.attendeeId === registrationInfo.attendeeId &&
          row.eventId === registrationInfo.eventId
      );
      if (pos === -1) {
        rows.push({
          ...registrationInfo,
          created: getCurrTimestamp(),
          modified: getCurrTimestamp(),
        });
      } else {
        rows[pos] = {
          ...rows[pos],
          ...registrationInfo,
          modified: getCurrTimestamp(),
        };
      }
      const data = [
        Object.keys(rows[0]).toString(),
        ...rows.map((r) => Object.values(r).toString()),
      ];
      fs.writeFile(
        app.getPath("home") + "/.attendance-app/registration.csv",
        data.join("\n"),
        function (err) {
          if (err) return err;
          console.log("updateRegistrations : Successfully updated file");
        }
      );
    });
}

module.exports = {
  submenu,
  findAttendee,
  getEvents,
  sendMessage,
  updateRegistrations,
};
function getCurrTimestamp() {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss");
}
