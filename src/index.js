/*const { app, BrowserWindow, shell } = require('electron')
const { spawn } = require("child_process")
const path = require("path")
require("ansicolor").nice*/

import fs from "fs";
import { app, BrowserWindow, shell } from 'electron';
import { spawn } from "child_process";
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
    /*server.stdout.on("data", (data) => {
        data = data.toString().split("\n")
        let navigated = false;

        for(let dataLine of data){
            dataLine = dataLine.trim()
            if(dataLine.length == 0) continue;

            if (dataLine.startsWith("navigate|")) {
                if(navigated) continue;

                let url = dataLine.split("|")[1]
    
                shell.openExternal(url);
                navigated = true;
            } else {
                console.log(`INFO: `.blue + dataLine.trim())
            }
        }
    })*/

    const createWindow = () => {
        const win = new BrowserWindow({
            title: "Youtube-View-Bot",
            autoHideMenuBar: true,
            //icon: path.join(__dirname, "/main/static/favicon.ico"),
            webPreferences: {
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
            }
        })

        win.webContents.on('will-navigate', function (e, url) {
            if (url.includes("patreon") || url.includes("github") || url.includes("paypal") || url.includes("bloxxy.net") || url.includes("iproyal.com") || url.includes("discord.")) {
                e.preventDefault();
                shell.openExternal(url);
            }
        });

        win.maximize();
        win.loadURL(`http://localhost:${settings.server_port}`).then(() => {
            win.reload()
        })
    }

    app.on('window-all-closed', async () => {
        process.exit(0);
    })

    app.whenReady().then(() => {
        createWindow()
    })
})

process.stdin.on("data", (data) => {
    data = data.toString()

    //console.log(data.toString())
})