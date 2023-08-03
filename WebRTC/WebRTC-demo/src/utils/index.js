const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
const host = window.location.host
const server = protocol + host
console.log('current server ', server)

const isDev = import.meta.env.DEV

export const serverSocketUrl = isDev ? 'ws://127.0.0.1:3000' : server
