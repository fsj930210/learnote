import { protocol, net } from 'electron';
// import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';


//为自定义的app协议提供特权
const schemeConfig = {
  standard: true,
  supportFetchAPI: true,
  bypassCSP: true,
  corsEnabled: true,
  stream: true
};
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: schemeConfig
}]);

export class CustomScheme {
  // 根据文件扩展名获取mime-type
  private static getMimeType(extension: string) {
    let mimeType = '';
    if (extension === '.js') {
      mimeType = 'text/javascript';
    } else if (extension === '.html') {
      mimeType = 'text/html';
    } else if (extension === '.css') {
      mimeType = 'text/css';
    } else if (extension === '.svg') {
      mimeType = 'image/svg+xml';
    } else if (extension === '.json') {
      mimeType = 'application/json';
    }
    return mimeType;
  }
  // 注册自定义app协议
  static registerScheme() {
    // protocol.registerStreamProtocol('app', (request, callback) => {
    //   let pathname = new URL(request.url).pathname;
    //   let extension = path.extname(pathname).toLowerCase();
    //   if (extension == '') {
    //     pathname = 'index.html';
    //     extension = '.html';
    //   }
    //   let tarFile = path.join(__dirname, pathname);
    //   callback({
    //     statusCode: 200,
    //     headers: { 'content-type': this.getMimeType(extension) },
    //     data: fs.createReadStream(tarFile),
    //   });
    // })
    protocol.handle('app', (req) => {
      let { pathname } = new URL(req.url);
      let extension = path.extname(pathname).toLowerCase();
      if (extension == '') {
        pathname = 'index.html';
        extension = '.html';
      }
      const tarFile = path.join(__dirname, pathname);
      return net.fetch(pathToFileURL(tarFile).toString(), {
        headers: { 'content-type': this.getMimeType(extension) }
      })
    })
  }
}


