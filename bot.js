const {BrowserWindow, app, screen, globalShortcut, ipcMain} = require("electron");
const fetch = require("node-fetch");
const path = require("path");

BOT = {
   createWindow: {},
   keys: false,
   window: null
};

BOT.createWindow = function (htmlContent) {
   const primaryDisplay = screen.getPrimaryDisplay();
   const {width, height} = primaryDisplay.workAreaSize;

   this.window = new BrowserWindow({
      width: width,
      height: height,
      transparent: true,
      opacity: 1,
      resizable: false,
      frame: false,
      title: "8 Ball Pool Guide Line",
      icon: path.join(__dirname, "src", "img", "icon.png"),
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false
      }
   });

   if (htmlContent) {
      this.window.loadFile(path.join(__dirname, './src/client.html'));
      this.window.webContents.send('load-client', htmlContent);
   } else {
      this.window.loadFile(path.join(__dirname, './src/index.html'));
   }

   this.window.setAlwaysOnTop(true, "floating", 1);
   this.window.setContentProtection(true)
   this.window.center();
};

function mousePos() {
   BOT.window.webContents.send('mousePos', screen.getCursorScreenPoint());
}

setInterval(() => {
   globalShortcut.register('Shift+X', () => {
      BOT.window.webContents.send('register', BOT.keys);
   });
}, 90);

ipcMain.on("synchronous-message", (event, arg) => {
   if (typeof arg === "object") {
      eval(arg.data);
   }
   event.returnValue = arg;
});

ipcMain.on('launch-client', (event, arg) => {
   fetch('https://idbots.pro/api/v1/client', {
      headers: {
         'Authorization': 'Bearer ' + arg.session
      }
   })
       .then(res => res.text())
       .then(html =>  event.sender.send('client-launched', html));

});

ipcMain.on('quit-window', (event, arg) => {
   console.log('Renderer requested to quit window. Closing now...');
   if (BOT.window) {
      BOT.window.close();
      BOT.createWindow(arg);
   }
});

app.allowRendererProcessReuse = true;

app.on("ready", () => {
   BOT.createWindow();
});

if (app.isReady()) BOT.createWindow();
