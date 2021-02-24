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

var createNewFile = function (type, location, name, parent, done) {
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

const getExecutables = (folderpath) => new Promise((resolve, reject) => {
    let blenderFolders = []
    fs.readdir(folderpath, (err, files) => {
        
        if (err) return reject(err);
        files.forEach(file => {
            var folder =  path.join(folderpath, file);
            if(fs.existsSync(path.join(folder,'blender.exe')))
                blenderFolders.push([files, folder]);
        })

        return resolve(blenderFolders)
    })
})

function createInstalledCardAndAppend(parent,name) {
    const card = document.createElement('installed-blender-card');
    card.setAttribute('name', name);
    parent.appendChild(card);
}

function getBlenderExecutables(userDataPath) {
    const BlenderDownloads = path.join(userDataPath, 'BlenderDownloads');
    const stablePath = path.join(BlenderDownloads, 'STABLE')
    const ltsPath = path.join(BlenderDownloads, 'LTS')
    const experimentalPath = path.join(BlenderDownloads, 'EXPERIMENTAL')

    const stableContainer = document.getElementById('stable-container')
    const ltsContainer = document.getElementById('lts-container')
    const expContainer = document.getElementById('experimental-container')

    getExecutables(stablePath)
        .then(res => {
            console.log(`Stable Blender paths: ${res}`)
            res.forEach(file => {
                createInstalledCardAndAppend(stableContainer,file[0])
            })
        })
        .catch(err => console.log(err));

    getExecutables(ltsPath)
        .then(res => {
            console.log(`LTS Blender paths: ${res}`);
            res.forEach(file => {
                createInstalledCardAndAppend(ltsContainer,file[0])
            })
        })
        .catch(err => console.log(err));

    getExecutables(experimentalPath)
        .then(res => {
            console.log(`Experimental Blender paths: ${res}`);
            res.forEach(file => {
                createInstalledCardAndAppend(expContainer,file[0])
            })
        })
        .catch(err => console.log(err));
}

module.exports = {
    getProjectDetails,
    writeProjectData,
    dirWalk,
    createNewFile,
    download,
    getBlenderExecutables
}

