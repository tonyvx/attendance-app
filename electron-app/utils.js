const { app, dialog, Notification } = require("electron");
const fs = require("fs");
const csv = require("csv-parser");

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

        sendMessage(
          app.getPath("home") + "/.attendance-app/" + fileName + " updated."
        );
      } catch (e) {
        console.log("Failed to save the file !", e.message);
        sendMessage("Failed to save the file ! (Details - " + e.message + "),");
      }
    });
}

const sendMessage = (message) => {
  console.log("sendMessage");
  new Notification({
    title: "Attendance Manager",
    body: message,
    icon: path.join(__dirname, "public/mail-142.png"),
  }).show();
};

function findAttendee(data1, notifyAttendee) {
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
      console.log("CSV file successfully processed");

      notifyAttendee(
        rows.find((row) =>
          row.family.toUpperCase().includes(data1.toUpperCase())
        )
      );
    });
}

function getEvents(publishEvents) {
  const rows = [];
  console.log("getEvents");
  fs.createReadStream(app.getPath("home") + "/.attendance-app/events.csv")
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      publishEvents(rows);
    });
}

function updateRegistrations(registrationInfo) {
  const rows = [];
  console.log("updateRegistrations", registrationInfo);

  fs.createReadStream(app.getPath("home") + "/.attendance-app/registration.csv")
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      const pos = rows.findIndex(
        (row) =>
          row.attendeeId === registrationInfo.attendeeId &&
          row.eventId === registrationInfo.eventId
      );
      if (pos === -1) {
        rows.push(registrationInfo);
      } else {
        rows[pos] = registrationInfo;
      }
      const data = [
        Object.keys(rows[0]).toString(),
        ...rows.map((r) => Object.values(r).toString()),
      ];
      fs.writeFile(
        app.getPath("home") + "/.attendance-app/registration.csv",
        data.join("\n"),
        function (err) {
          if (err) return console.log(err);
          console.log("Hello World > helloworld.txt");
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
