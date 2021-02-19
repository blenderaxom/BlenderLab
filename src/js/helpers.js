const fs = require('fs');
const path = require('path');

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

async function createParent(n, file) {
    var newParent = document.createElement('li')
    newParent.innerHTML =
        `
        <span class="caret"><i class="fas fa-folder"></i>${file}</span>
    `
    var p = document.createElement('ul')
    p.classList.add('nested')
    newParent.insertAdjacentElement('beforeend', p)
    n.insertAdjacentElement('beforeend', newParent)
    return p
}
'../images/svg/blenderlogo.svg'
function createChild(element, file) {
    var newChild = document.createElement('li')
    if (file.endsWith(".blend")) {
        newChild.innerHTML = 
        `<img src="../images/svg/blenderlogo.svg" class="svg-btn-icon"></object> ${file}`
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
                    var newP = await createParent(parent, name)
                    dirWalk(file, newP, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    createChild(parent, name)
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

module.exports = {
    getProjectDetails,
    writeProjectData,
    dirWalk,
}

