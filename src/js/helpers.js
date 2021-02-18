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

module.exports = {
    getProjectDetails,
}

