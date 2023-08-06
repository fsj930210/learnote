import {app, BrowserWindow} from 'electron';
import { CustomScheme } from './CustomScheme';
import { CommonWindowEvent } from './CommonWindowEvent';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
app.on('browser-window-created', (_e, win) => {
  CommonWindowEvent.regWinEvent(win);
});

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  const config: Electron.BrowserWindowConstructorOptions = {
    frame: false,
    show: false,
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
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2]);
  } else {
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
  }
  CommonWindowEvent.listen();
})