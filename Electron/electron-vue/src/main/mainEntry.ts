import {app, BrowserWindow} from 'electron';

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  const config: Electron.BrowserWindowConstructorOptions = {
    webPreferences: {
      // 将nodejs集成到渲染进程
      nodeIntegration: true,
      // 同源策略
      webSecurity: false,
      // 允许一个 https 页面运行来自http url的JavaScript, CSS 或 plugins
      allowRunningInsecureContent: true,
      contextIsolation: false,
      // 是否启用 <webview> tag标签.
      webviewTag: true,
      // 是否启用内置拼写检查器
      spellcheck: false,
      //  是否阻止窗口在进入 HTML 全屏时调整大小
      disableHtmlFullscreenWindowResize: true
    }
  };
  mainWindow = new BrowserWindow(config);
  mainWindow.webContents.openDevTools({mode: 'undocked'});
  mainWindow.loadURL(process.argv[2]);
})