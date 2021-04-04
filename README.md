# Create Electron starter app

[www.electronjs.org/quick-start](https://www.electronjs.org/docs/tutorial/quick-start)

[package-and-distribute-the-application](https://www.electronjs.org/docs/tutorial/quick-start#package-and-distribute-the-application)

[electron-installer-debian#installation](https://github.com/electron-userland/electron-installer-debian#installation)

npx electron-packager . app --platform linux --arch x64 --out dist
npx electron-installer-debian --src dist/app-linux-x64/ --dest dist/installers/ --arch amd64