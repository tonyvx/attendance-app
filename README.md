[![Known Vulnerabilities](https://snyk.io/test/github/tonyvx/attendance-app/badge.svg)](https://snyk.io/test/github/tonyvx/attendance-app)

# Create Electron starter app

## Folder structure

    attendance-app/
    ├── package.json
    ├── electron-app.js
    ├── electron-app
    └── ├── preload.js
        └── submenu.js
    ├── public
    └── ├── index.html
        └── react.js

## Install electron

```sh
mkdir attendance-app && cd attendance-app
npm init -y
npm i --save-dev electron
```

## Modifying menu

```js
const { Menu } = require("electron");

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
```

## Open File Dialog

```js
const { dialog } = require("electron");

var file = await dialog.showOpenDialog(
  (browserWindow,
  {
    title: "select a file",
    properties: ["openFile"],
    filters: [{ name: "csv", extensions: ["csv"] }],
  })
);
```

## Saving to home folder OS specific

[app.getPath(name)](https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname)

# Package and distribute the application

## Import Electron Forge to your app folder:

```sh
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

## Create a distributable:

```sh
# out/make/deb/x64/attendance-app_0.1.0_amd64.deb
npm run make
```

## Code splitting

[code-splitting](https://reactjs.org/docs/code-splitting.html)
[cost-of-modules](https://github.com/siddharthkp/cost-of-modules)
[react-lazy-without-default-export](https://dev.to/iamandrewluca/react-lazy-without-default-export-4b65)
[how-to-make-your-electron-app-faster-4ifb](https://dev.to/xxczaki/how-to-make-your-electron-app-faster-4ifb)
[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

## References

[www.electronjs.org/quick-start](https://www.electronjs.org/docs/tutorial/quick-start)
[package-and-distribute-the-application](https://www.electronjs.org/docs/tutorial/quick-start#package-and-distribute-the-application)
[electron-installer-debian#installation](https://github.com/electron-userland/electron-installer-debian#installation)

npx electron-packager . app --platform linux --arch x64 --out dist
npx electron-installer-debian --src dist/app-linux-x64/ --dest dist/installers/ --arch amd64

[electron-installer-debian-package](https://www.christianengvall.se/electron-installer-debian-package/)
[open dialog](https://www.electronjs.org/docs/api/dialog)
