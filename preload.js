console.log("here preload main")

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('apiopenpptx', {
    send: (channel, data) => {
        // Whitelist channels
        let validChannels = ['open-file'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, listener) => {
        // Whitelist channels
        let validChannels = ['file-opened'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => listener(...args));
        }
    }
});
