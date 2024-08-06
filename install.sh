#!/bin/bash

npm install
# CALL npm run electron-builder install-app-deps
npm install electron --global
npx playwright install-deps firefox
npx playwright install firefox
npm run rebuild-sqlite

cd ./main/
npm run build