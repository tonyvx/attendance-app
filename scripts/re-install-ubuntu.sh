sudo dpkg --configure -a
npm run react; npm run make; sleep 100
sudo apt-get remove attendance-manager
sudo apt-get install ./out/make/deb/x64/attendance-manager_0.1.0_amd64.deb
