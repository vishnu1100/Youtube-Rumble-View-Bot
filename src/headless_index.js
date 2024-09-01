/*const { app, BrowserWindow, shell } = require('electron')
const { spawn } = require("child_process")
const path = require("path")
require("ansicolor").nice*/

import fs from "fs";
import * as path from "path";
import * as ansicolor from "ansicolor";
ansicolor.nice

import { fileURLToPath } from 'url';
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

if (!fs.existsSync(path.join(__dirname, "../main/cache/raw_guests"))){
    fs.mkdirSync(path.join(__dirname, "../main/cache/raw_guests"), { recursive: true });
}

import "../main/server.js";

startFullServer().then(() => {
    console.log(ansicolor.green("Headless server started successfully"))
})