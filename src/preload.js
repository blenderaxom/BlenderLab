const { app, contextBridge, ipcRenderer } = require('electron');
const {createDatabase,addProjectToDatabase,getProjectList,getId} = require('./js/db');
const {getProjectDetails} = require('./js/helpers')

// MAIN API TO INTERACT WITH DIFFERENT WINDOWS
contextBridge.exposeInMainWorld('BL', {
    openFolder: async () => {
        const result = await ipcRenderer.invoke("open-folder");
        return result;
    },
    newProjectWindow: () => {
        ipcRenderer.invoke("open-new-project-window");
    },
    getCurrentWindow: () => {
        ipcRenderer.invoke("get-current-window");
    },
    minimizeWindow: () => {
        ipcRenderer.invoke("minimize-window");
    },
    toogleMaxWindow: () => {
        ipcRenderer.invoke("toggle-max-window");
    },
    closeWindow: () => {
        ipcRenderer.invoke("close-window");
    },
    createProject:(args) => {
        ipcRenderer.invoke("create-project", args);
    },
    addProjects: async () => {
        const udpath = await ipcRenderer.invoke("get-user-data-path");
        getProjectList(udpath)
    },
    getProject: async (p) => {
        const data = await getProjectDetails(p)
        return data
    },
    getUniqueId: async () => {
        const id = await getId()
        return id
    }
});