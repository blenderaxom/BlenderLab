const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
var mtd = require('zeltice-mt-downloader')
const extract = require('extract-zip')

async function getProjectDetails(p) {
    var finalPath = path.join(p, "project.blenderlab")
    const data = fs.readFileSync(finalPath, { encoding: 'utf8', flag: 'r' });
    const project = JSON.parse(data)
    const title = project.project_name
    const description = JSON.parse(project.project_description)
    return { title: title, description: description }
}

function writeProjectData(args) {
    var finalPath = path.join(args[0], "project.blenderlab")
    const data = fs.readFileSync(finalPath, { encoding: 'utf8', flag: 'r' });
    const project = JSON.parse(data)
    project.project_name = args[1]
    project.project_description = args[2]
    fs.writeFileSync(finalPath, JSON.stringify(project))
}

async function createParent(n, file, location) {
    var newParent = document.createElement('li')
    newParent.innerHTML =
        `
        <span class="caret" location="${location}"><i class="fas fa-folder"></i>${file}</span>
    `
    var p = document.createElement('ul')
    p.id = uuidv4()
    p.classList.add('nested')
    newParent.insertAdjacentElement('beforeend', p)
    n.insertAdjacentElement('beforeend', newParent)
    newParent.getElementsByClassName('caret')[0].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
        // var active = newParent.getRootNode().querySelector('.active-item')
        // active.classList.remove('active-item')
        // this.classList.add('active-item')
    });
    return p
}

function createChild(element, file, location) {
    var newChild = document.createElement('li')
    newChild.setAttribute('location', location)
    newChild.id = uuidv4()
    if (file.endsWith(".blend")) {
        newChild.innerHTML =
            `<img src="../images/svg/blenderlogo.svg" class="svg-btn-icon"> ${file}`
    }
    else { newChild.innerHTML = `<i class="fas fa-file"></i> ${file}` }
    element.insertAdjacentElement('beforeend', newChild)
}

var dirWalk = function (dir, parent, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            const name = file
            file = path.resolve(dir, file);
            fs.stat(file, async function (err, stat) {
                if (stat && stat.isDirectory()) {
                    var newP = await createParent(parent, name, file)
                    dirWalk(file, newP, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    createChild(parent, name, file)
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

var createNewFile = function (type, location, name, parent, done, execPath = undefined,pythonFile=undefined) {
    fs.lstat(location, (err, stats) => {
        if (err)
            return done(err); //Handle error
        if (type == "folder") {
            if (stats.isFile()) {
                var dir = path.dirname(location);
                fs.mkdir(path.join(dir, name), (err) => {
                    if (err)
                        return done(err)

                    createParent(parent, name, path.join(dir, name))
                    return done(null, path.join(dir, name))
                })
            }
            else {
                fs.mkdir(path.join(location, name), (err) => {
                    if (err)
                        return done(err)
                    createParent(parent, name, path.join(location, name))
                    return done(null, path.join(location, name))
                })
            }
        } else if (type == "blend") {
            if (stats.isFile()) {
                var dir = path.dirname(location);
                var child = require('child_process').execFile;
                var parameters = ["-b", '-P', pythonFile, "--", dir, name, "GENERAL", "DEFAULT", ""];
                child(execPath, parameters, function (err, data) {
                    if (err) return done(err)
                    return done(null, data)
                })
            } else {
                var child = require('child_process').execFile;
                var parameters = ["-b", '-P', pythonFile, "--", location, name, "GENERAL", "DEFAULT", ""];
                child(execPath, parameters, function (err, data) {
                    if (err) return done(err)
                    return done(null, data)
                })
            }
        }
    });
}

async function extractFile(sourcePath, extractPath) {
    try {
        console.log(`Extracting ${sourcePath} to ${extractPath}`)
        await extract(sourcePath, { dir: extractPath })
        console.log('Extraction complete')
    } catch (err) {
        console.log(err)
    }
}

async function download(link, shadow, finalPath, userDataPath, type) {
    const bar = shadow.getElementById("myBar")
    const progressBar = shadow.getElementById("myProgress")
    const cancelBtn = shadow.getElementById("cancelBtn")
    const downloadBtn = shadow.getElementById("downloadBtn")

    const filename = `blender${uuidv4()}.zip`
    console.log(finalPath);
    progressBar.style.display = "block"
    var interval = null;
    cancelBtn.style.display = 'block'
    downloadBtn.style.display = 'none'

    var options = {
        onStart: function (meta) {
            console.log('Download started', meta)
            cancelBtn.addEventListener('click', (e) => {
                console.log('destroy');
                meta.threads.forEach(l => {
                    l.destroy()
                })
            })
            var total = meta.size
            function logme() {
                var percentage = meta.threads[0].position * 200 / total
                console.log(percentage)
                bar.style.width = percentage + "%"
            }
            interval = setInterval(logme, 1000)

        },
        onEnd: function (err, result) {
            cancelBtn.style.display = 'none';
            downloadBtn.style.display = 'block';
            clearInterval(interval);
            bar.style.display = "none";
            if (err) {
                console.error(err);
                bar.style.width = "0" + "%";
            }
            else {
                bar.style.width = "100" + "%";
                console.log(result);
                const blendDirPath = path.join(userDataPath, 'BlenderDownloads')
                const extractPath = path.join(blendDirPath, type);
                var timers;
                timers = setTimeout(
                    () => { extractFile(result["file-name"].originalFile, extractPath) }, 2000);
            }
        }
    }

    var downloader = new mtd(path.join(finalPath, filename), link, options)
    downloader.start()
}

const getExecutablesFolder = (folderpath) => new Promise((resolve, reject) => {
    let blenderFolders = []
    fs.readdir(folderpath, (err, files) => {

        if (err) return reject(err);
        files.forEach(file => {
            var folder = path.join(folderpath, file);
            if (fs.existsSync(path.join(folder, 'blender.exe')))
                blenderFolders.push([files, folder]);
        })

        return resolve(blenderFolders)
    })
})

function createInstalledCardAndAppend(parent, name, location, selected) {
    const card = document.createElement('installed-blender-card');
    card.setAttribute('name', name);
    card.setAttribute('location', location);
    if (selected) card.setAttribute('selected', true);
    else card.setAttribute('selected', false);
    parent.appendChild(card);
}

function getBlenderExecutables(userDataPath, defaultBlender) {
    const BlenderDownloads = path.join(userDataPath, 'BlenderDownloads');
    const stablePath = path.join(BlenderDownloads, 'STABLE')
    const ltsPath = path.join(BlenderDownloads, 'LTS')
    const experimentalPath = path.join(BlenderDownloads, 'EXPERIMENTAL')

    const stableContainer = document.getElementById('stable-container')
    const ltsContainer = document.getElementById('lts-container')
    const expContainer = document.getElementById('experimental-container')

    getExecutablesFolder(stablePath)
        .then(res => {
            res.forEach(file => {
                if (defaultBlender == file[1] && defaultBlender != undefined)
                    createInstalledCardAndAppend(stableContainer, file[0], file[1], true)
                else createInstalledCardAndAppend(stableContainer, file[0], file[1], false)
            })
        })
        .catch(err => console.log(err));

    getExecutablesFolder(ltsPath)
        .then(res => {
            res.forEach(file => {
                if (defaultBlender == file[1] && defaultBlender != undefined)
                    createInstalledCardAndAppend(ltsContainer, file[0], file[1], true)
                else createInstalledCardAndAppend(ltsContainer, file[0], file[1], false)
            })
        })
        .catch(err => console.log(err));

    getExecutablesFolder(experimentalPath)
        .then(res => {
            res.forEach(file => {
                if (defaultBlender == file[1] && defaultBlender != undefined)
                    createInstalledCardAndAppend(expContainer, file[0], file[1], true)
                else createInstalledCardAndAppend(expContainer, file[0], file[1], false)
            })
        })
        .catch(err => console.log(err));
}

function selectBlender(udPath, location) {
    var data = {
        empty: false,
        location: location
    }

    fs.writeFile(path.join(udPath, 'defaultBlender.json'), JSON.stringify(data), (err) => {
        if (err) console.log(err)
    })

}

function setUpSelector(udpath, defaultBlender, id) {
    const BlenderDownloads = path.join(udpath, 'BlenderDownloads');
    const stablePath = path.join(BlenderDownloads, 'STABLE')
    const ltsPath = path.join(BlenderDownloads, 'LTS')
    const experimentalPath = path.join(BlenderDownloads, 'EXPERIMENTAL')

    const optionContainer = document.getElementById(id).shadowRoot.querySelector('select')
    function createOption(file) {
        var newOption = document.createElement('option')
        newOption.value = file[1]
        newOption.innerText = file[0]
        optionContainer.appendChild(newOption)
    }
    Promise.all(
        [
            getExecutablesFolder(stablePath)
                .then(res => {
                    res.forEach(file => {
                        createOption(file)
                    })
                })
                .catch(err => console.log(err)),
            getExecutablesFolder(ltsPath)
                .then(res => {
                    res.forEach(file => {
                        createOption(file)
                    })
                })
                .catch(err => console.log(err)),
            getExecutablesFolder(experimentalPath)
                .then(res => {
                    res.forEach(file => {
                        createOption(file)
                    })
                })
                .catch(err => console.log(err))
        ]).then(() => {
            if (defaultBlender != undefined) {
                if (fs.existsSync(defaultBlender) && fs.existsSync(path.join(defaultBlender, 'blender.exe')))
                    optionContainer.value = defaultBlender
            }
        })
}

function addBlenderVersionsIntempSelector(udPath, parent, location, name, treeItem) {
    const BlenderDownloads = path.join(udPath, 'BlenderDownloads');
    const stablePath = path.join(BlenderDownloads, 'STABLE')
    const ltsPath = path.join(BlenderDownloads, 'LTS')
    const experimentalPath = path.join(BlenderDownloads, 'EXPERIMENTAL')
    function createOption(file) {
        var newOption = document.createElement('div')
        newOption.classList.add('option')
        newOption.innerText = file[0]
        parent.appendChild(newOption)
        newOption.onclick = (e) => {
            parent.innerHTML = `<h3>Creating ${name}.blend</h3>`
            createNewFile('blend', location, name, parent, (err, res) => {
                if (err) console.log(err);
                else {
                    createChild(treeItem, `${name}.blend`, path.join(location, `${name}.blend`))
                }
                if (parent.getRootNode().host != null)
                    parent.getRootNode().host.remove()
            }, path.join(file[1],'blender.exe'),path.join(udPath,'createBlenderFile.py'))
        }
    }
    getExecutablesFolder(stablePath)
        .then(res => {
            res.forEach(file => {
                createOption(file)
            })
        })
        .catch(err => console.log(err))
    getExecutablesFolder(ltsPath)
        .then(res => {
            res.forEach(file => {
                createOption(file)
            })
        })
        .catch(err => console.log(err))
    getExecutablesFolder(experimentalPath)
        .then(res => {
            res.forEach(file => {
                createOption(file)
            })
        })
        .catch(err => console.log(err))
}

module.exports = {
    getProjectDetails,
    writeProjectData,
    dirWalk,
    createNewFile,
    download,
    getBlenderExecutables,
    selectBlender,
    setUpSelector,
    addBlenderVersionsIntempSelector
}

