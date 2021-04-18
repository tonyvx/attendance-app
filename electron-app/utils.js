const { app, dialog, Notification } = require("electron");
const fs = require("fs");
const csv = require("csv-parser");
const camelcase = require("camelcase");
const { compareAsc, format } = require("date-fns");

const path = require("path");

function submenu(mainWindow) {
  return [
    {
      label: "View Registered Parishioners",
      async click() {
        readAndPublishCSV("attendees", mainWindow, "fromMain_Attendees");
      },
    },

    {
      label: "View Events",
      async click() {
        readAndPublishCSV("events", mainWindow, "fromMain_Events");
      },
    },
    {
      label: "View Registration",
      async click() {
        mainWindow &&
          mainWindow.webContents.send(
            "fromMain_RegistrationInfo",
            await getRegistrationInfo()
          );
      },
    },
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
      title: "Updating" + fileName,
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
          app.getPath("home") + "/.attendance-app/" + fileName + ".csv",
          data,
          type === "csv" ? "utf-8" : "binary"
        );

        sendMessage(fileName + " updated.");

        readAndPublishCSV(
          fileName,
          mainWindow1,
          fileName === "events"
            ? "fromMain_Events"
            : fileName === "attendees"
            ? "fromMain_Attendees"
            : "Something went wrong"
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

async function readAndPublishCSV(fileName, window, channel) {
  console.log("readAndPublishCSV");

  const rows = await readCSV(
    app.getPath("home") + "/.attendance-app/" + fileName + ".csv"
  );

  console.log("readAndPublishCSV : CSV file successfully processed");

  window &&
    window.webContents.send(
      channel,
      rows.map((row, index) => {
        return !row.id ? { ...row, id: index } : row;
      })
    );
}

async function getRegistrationInfo() {
  console.log("getRegistrationInfo");
  const registrationsPromise = readCSV(
    app.getPath("home") + "/.attendance-app/registration.csv"
  );
  const attendeesPromise = readCSV(
    app.getPath("home") + "/.attendance-app/attendees.csv"
  );
  const eventsPromise = readCSV(
    app.getPath("home") + "/.attendance-app/events.csv"
  );

  const data = await Promise.all([
    registrationsPromise,
    attendeesPromise,
    eventsPromise,
  ]);

  const registrations = data[0];
  const attendees = data[1];
  const events = data[2];

  const getAttendee = (id) => attendees.find((a) => a.familyId === id);
  const getEvent = (id) =>
    events
      .filter((e) => e.id === id)
      .map((e) => e.date + " " + e.event + " ( " + e.startTime + " ) ")
      .find((e) => !!e);

  return registrations.map((registration, index) => {
    return {
      id: index,
      attendee: getAttendee(registration.attendeeId).firstName,
      event: getEvent(registration.eventId),
      ...registration,
    };
  });
}

function readCSV(file) {
  const rows = [];
  var fd = fs.createReadStream(file).pipe(
    csv({
      mapHeaders: ({ header, index }) => camelcase(header),
    })
  );
  return new Promise(function (resolve, reject) {
    fd.on("data", (row) => {
      rows.push(row);
    });
    fd.on("error", reject);
    fd.on("end", () => resolve(rows));
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
  readAndPublishCSV,
  sendMessage,
  updateRegistrations,
  openCSVFile,
};
function getCurrTimestamp() {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss");
}
