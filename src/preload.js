const { contextBridge, ipcRenderer } = require('electron');
const { getProjectList, getId } = require('./js/db');
const { getProjectDetails, writeProjectData, dirWalk } = require('./js/helpers')

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
    createProject: (args) => {
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
    },
    updateProject: (location, title, description) => {
        writeProjectData([location, title, description])
    },
    loadDirTree: (args) => {
        var element = document.getElementById(args[1])
        var parent = element.shadowRoot.getElementById("parentItem")
        dirWalk(args[0], parent, function (err, results) {
            if (err) throw err;
            
            const event = new Event('update-tree');
            element.dispatchEvent(event);
        })
    }
});