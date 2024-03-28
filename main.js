// main.js

const { app, BrowserWindow, shell,ipcMain,  net } = require('electron');
const path = require("path")
const fs = require('fs');
 function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
   // fullscreen:true,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration
      preload: path.join(__dirname,"preload.js")
    }
  });

  // Load your HTML file
  mainWindow.loadFile('index.html');

  // Open DevTools
  //mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null)
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



ipcMain.on('open-fileold', (event, {url,filePath}) => {

  shell.openPath(url+"/uploads/presentation/"+filePath);

  console.log(url+"/uploads/presentation/"+filePath)
});


ipcMain.on('open-file', (event, {url,filePath}) => {
  // Download the file
  const downloadPath = path.join(app.getPath('downloads'), filePath); // Change the file name as needed
  const file = fs.createWriteStream(downloadPath);
  const request = net.request(url+"/uploads/presentation/"+filePath);
  request.on('response', (response) => {
      response.pipe(file);
      file.on('finish', () => {
          file.close();
          // Open the downloaded file
          shell.openPath(downloadPath).then(()=>{
            event.reply("file-opened","download andd open success ok")
          });
      });
  });
  request.end();
});