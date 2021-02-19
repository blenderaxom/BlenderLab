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
        var parent = document.getElementById(args[1])
        dirWalk(args[0], parent, function (err, results) {
            if (err) throw err;
            
            var toggler = document.getElementsByClassName("caret");
            var i;

            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function () {
                    this.parentElement.querySelector(".nested").classList.toggle("active");
                    this.classList.toggle("caret-down");
                });
                toggler[0].click()
            }
        })
    }
});