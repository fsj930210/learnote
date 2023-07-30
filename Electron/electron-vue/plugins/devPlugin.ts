import { AddressInfo } from "net";
import { ViteDevServer } from 'vite';

export const devPlugin = () => {
  return {
    name: 'dev-plugin',
    configureServer(server: ViteDevServer) {
      require('esbuild').buildSync({
        entryPoints: ['./src/main/mainEntry.ts'],
        bundle: true,
        platform: 'node',
        outfile: './dist/mainEntry.js',
        external: ['electron']
      });
      server.httpServer?.once('listening', () => {
        const { spawn } = require('child_process');
        const addressInfo = server.httpServer?.address() as AddressInfo;
        const httpAddress = `http://127.0.0.1:${addressInfo.port}`;
        const electronProcess = spawn(
          require('electron').toString(), 
          ['./dist/mainEntry.js', httpAddress, ], 
          {
            // 当前项目根目录
            cwd: process.cwd(),
            // 让 electron 子进程的控制台输出数据同步到主进程的控制台。这样我们在主进程中 console.log 的内容就可以在 VSCode 的控制台上看到了。
            stdio: 'inherit',
          }
        );
        electronProcess.on('close', () => {
          server.close();
          process.exit();
        })
      })
    }
  }
}

export const getReplacer = () => {
  const externalModels = [
    'os',
    'fs',
    'path',
    'events', 
    'child_process',
    'crypto', 
    'http', 
    'buffer', 
    'url', 
    'better-sqlite3', 
    'knex'
  ];
  const result = {};
  for (const item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}`),
      code: `const ${item} = require('${item}');export { ${item} as default }`
    });
  };
  result['electron'] = () => {
    const electronModules = [
      'clipboard', 
      'ipcRenderer', 
      'nativeImage', 
      'shell', 
      'webFrame'
    ].join(',');
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
}