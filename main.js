const { app, BrowserWindow, globalShortcut, screen } = require('electron')
const config = require('./config')

let win;
let maxWidth = 0;
let maxHeight = 0;
let posicaoApp = 0;
let objPosicao = [];

function createWindow () {
  win = new BrowserWindow({
    width: config.startWidth,
    height: config.startHeight,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    },
    x: 0,
    y: 0,
    resizable: false
  })

  win.loadURL(config.url)  
}

function toggleDevTools() {
    win.webContents.toggleDevTools()
}

function criarAtalhos() {
    globalShortcut.register('CmdOrCtrl+j', toggleDevTools)
    globalShortcut.register('CmdOrCtrl+m', mudarDePagina)
    globalShortcut.register('CmdOrCtrl+n', mudarPosicao)
}

function mudarDePagina() {
   win.loadURL(config.url2)
}

function mudarPosicao() {
  if (posicaoApp >= 3) {
    posicaoApp = 0;
  } else {
    posicaoApp = posicaoApp + 1;
  }
  win.setPosition(objPosicao[posicaoApp].x, objPosicao[posicaoApp].y);
}

function definePosicoes() {
  objPosicao.push({'x': 0, 'y': 0}); //posicao inicial
  objPosicao.push({'x': (maxWidth - config.startWidth), 'y': 0});   //posicao 1
  objPosicao.push({'x': (maxWidth - config.startWidth), 'y': (maxHeight - config.startHeight)}); //posicao2
  objPosicao.push({'x': 0, 'y': (maxHeight - config.startHeight)}); // posicao 3
}

app.whenReady()
.then(createWindow)
.then(criarAtalhos)
.then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  maxWidth = width;
  maxHeight = height;
  definePosicoes();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
