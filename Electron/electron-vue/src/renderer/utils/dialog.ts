// 创建窗口
export const createDialog = (url: string, config: any): Promise<Window> => {
  return new Promise((resolve) => {
    const windowProxy = window.open(url, '_blank', JSON.stringify(config)) as Window;
    const readyHandler = (e: MessageEvent) => {
      const msg = e.data;
      console.log(msg, 'nsg')
      if (msg['msgName'] === `__dialogReady`) {
        window.removeEventListener('message', readyHandler);
        resolve(windowProxy);
      }
    };
    window.addEventListener('message', readyHandler);
  });
};
// 通知父窗口自己已经加载成功
export const dialogReady = () => {
  const msg = { msgName: `__dialogReady` };
  window.opener.postMessage(msg);
};