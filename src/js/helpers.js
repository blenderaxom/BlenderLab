const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require("uuid");

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
    });
    newParent.addEventListener('click', (e)=>{
        var active = newParent.getRootNode().querySelector('.active-item')
        active.classList.remove('active-item')
        e.target.classList.add('active-item')
    })
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
    newChild.addEventListener("click", function (e) {
        // console.log(element.getRootNode());
        var active = element.getRootNode().querySelector('.active-item')
        active.classList.remove('active-item')
        e.target.classList.add('active-item')
    });
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

var createNewFile = function (type, location, name,parent, done) {
    fs.lstat(location, (err, stats) => {
        if (err)
            return done(err); //Handle error
        if (type == "folder") {
            if (stats.isFile()) {
                var dir = path.dirname(location);
                fs.mkdir(path.join(dir, name), (err) => {
                    if (err)
                        return done(err)

                    createParent(parent,name,path.join(dir, name))
                    return done(null, path.join(dir, name))
                })
            }
            else {
                fs.mkdir(path.join(location, name), (err) => {
                    if (err)
                        return done(err)
                    createParent(parent,name,path.join(location, name))
                    return done(null, path.join(location, name))
                })
            }
        } else if (type=="blend") {
            if (stats.isFile()) {
                var dir = path.dirname(location);
            }
        }
    });
}

module.exports = {
    getProjectDetails,
    writeProjectData,
    dirWalk,
    createNewFile
}

