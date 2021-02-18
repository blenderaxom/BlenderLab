const { v4: uuidv4 } = require("uuid");
const timeago = require("timeago.js/dist/timeago.min.js");
const fs = require('fs');
const path = require('path');


// Create a database
function createDatabase() {
    let db;
    let dbReq = indexedDB.open('BLDatabase', 1);
    dbReq.onupgradeneeded = function (event) {
        // Set the db variable to our database so we can use it!  
        db = event.target.result;
        let projects = db.createObjectStore('projects', { autoIncrement: false });
    }
    dbReq.onsuccess = function (event) {
        db = event.target.result;
    }
    dbReq.onerror = function (event) {
        alert('error opening database ' + event.target.errorCode);
    }
}


function _readandwrite(p, proj) {
    fs.readFile(p, 'utf8', function (err, data) {
        let projectData = JSON.parse(data)
        projectData.projects.unshift(proj)
        fs.writeFile(p, JSON.stringify(projectData), (err, da) => {
            console.log("successfully written to db")

        })
    })

}

function addProjectToDatabase(args) {
    const loc = args[0];
    const id = args[1];
    const userDataPath = args[2]
    const dbPath = path.join(userDataPath, "db.blenderlab")
    let project = {
        location: loc,
        id: id,
        created: new Date()
    };
    if (fs.existsSync(dbPath)) {
        _readandwrite(dbPath, project)
    }
    else {
        fs.writeFile(dbPath, '{"projects": []}', function (err, data) {
            _readandwrite(dbPath, project)
        })

    }
}

function getProjectList(p) {
    const dbpath = path.join(p, 'db.blenderlab')
    if (fs.existsSync(dbpath)) {
        fs.readFile(dbpath, 'utf8', function (err, data) {
            let container = document.querySelector(".project-list")
            container.innerHTML = ""
            var prjData = JSON.parse(data)
            // var list = prjData.projects.sortBy(function(o){return new Date(o.created)})
            var list = prjData.projects
            // list.reverse()
            for (index = 0; index < list.length; index++) {
                var element = list[index]
                var p = element.location+"/project.blenderlab"
                if (fs.existsSync(p)){
                    const data = fs.readFileSync(p, {encoding:'utf8', flag:'r'});
                    
                    var project = JSON.parse(data)
                    const el = document.createElement('project-card');

                    container.insertAdjacentHTML("beforebegin",
                        `<p-c name="${project.project_name}" 
                        location="${element.location}" 
                        time="${timeago.format(project.project_created)}">
                        </p-c>`)
                }
            }

        })
    }
}


/* Arranges an array in descending order 

example: var list = array.sortBy(function(o){return new Date(o.created)})

Above example will sort the array in descending order of their created time.

*/

(function () {
    if (typeof Object.defineProperty === 'function') {
        try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e) { }
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
        for (var i = this.length; i;) {
            var o = this[--i];
            this[i] = [].concat(f.call(o, o, i), o);
        }
        this.sort(function (a, b) {
            for (var i = 0, len = a.length; i < len; ++i) {
                if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        });
        for (var i = this.length; i;) {
            this[--i] = this[i][this[i].length - 1];
        }
        return this;
    }
})();

/* ------------------------------------------------------------- */

async function getId() {
    return uuidv4()
}

module.exports = {
    createDatabase,
    addProjectToDatabase,
    getProjectList,
    getId
}


