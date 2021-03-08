const { app, contextBridge, ipcRenderer } = require('electron');
const { getProjectList, getId } = require('./js/db');
const {
    getProjectDetails,
    writeProjectData,
    dirWalk,
    createNewFile,
    download,
    getBlenderExecutables,
    selectBlender,
    setUpSelector,
    addBlenderVersionsIntempSelector
} = require('./js/helpers');
const { getFirBConfig } = require('./js/firebase-helpers')

// MAIN API TO INTERACT WITH DIFFERENT WINDOWS
contextBridge.exposeInMainWorld('BL', {
    openFolder: async () => {
        const result = await ipcRenderer.invoke("open-folder");
        return result;
    },
    selectImageFile: async () => {
        const path = await ipcRenderer.invoke('select-image')
        return path;
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
        console.log('closing windiws');
        ipcRenderer.invoke("close-window");
    },
    createProject: (args) => {
        ipcRenderer.invoke("create-project", args);
    },
    addProjects: async () => {
        const udpath = await ipcRenderer.invoke("get-user-data-path", ["userData"]);
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
        parent.innerHTML = ''
        dirWalk(args[0], parent, function (err, results) {
            if (err) throw err;
        })
    },
    createNewItem: (type, location, name, treeId, parentId) => {
        var parent = document.getElementById(treeId).shadowRoot.getElementById(parentId)
        createNewFile(type, location, name, parent, function (err, result) {
            if (err) {
                console.log(err)
            }
        })
    },
    downloadfile: (link, shadowId, type) => {
        var shadow = document.getElementById(shadowId).shadowRoot
        ipcRenderer.invoke("get-user-data-path", ["downloads", 'userData']).then((result) => {
            download(link, shadow, result[0], result[1], type)
        });
        
    },
    setupDownloadedBlenderCards: async () => {
        const udpath = await ipcRenderer.invoke("get-user-data-path", ["userData"]);
        const defBlender = await ipcRenderer.invoke("get-default-blender");
        getBlenderExecutables(udpath, defBlender);
    },
    selectDefaultBlender: async (location) => {
        const udpath = await ipcRenderer.invoke("get-user-data-path", ["userData"]);
        selectBlender(udpath, location)
    },
    setUpBlenderSelector: async (id) => {
        const defBlender = await ipcRenderer.invoke("get-default-blender");
        const udpath = await ipcRenderer.invoke("get-user-data-path", ["userData"]);
        setUpSelector(udpath, defBlender, id);
    },
    createBlendVerSelector: async (treeId, treeitemId, selectorId, location, name) => {
        console.log(selectorId);

        const selector = document.getElementById(selectorId)
        const container = selector.shadowRoot.getElementById('blender-selector')

        var treeitem = document.getElementById(treeId).shadowRoot.getElementById(treeitemId)
        const udpath = await ipcRenderer.invoke("get-user-data-path", ["userData"]);
        addBlenderVersionsIntempSelector(udpath, container, location, name, treeitem)
    },
    getFirebaseConfigs: async () => await getFirBConfig()
});