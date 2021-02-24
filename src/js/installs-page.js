const downloadCardsContainer = document.getElementById("download-cards")

function addDownloadCard(data, type) {
    var downloadCard = document.createElement('blender-download-card')
    downloadCard.setAttribute('name', data.name)
    downloadCard.setAttribute('download-link', data.link)
    downloadCard.setAttribute('type', type)
    downloadCard.id = data.link
    downloadCardsContainer.appendChild(downloadCard)
}

BL.setupDownloadedBlenderCards()

fetch('https://raw.githubusercontent.com/bordoloicorp/blenderDownloads/main/links.json')
    .then(res => res.json())
    .then((out) => {
        console.log(out.WINDOWS);

        addDownloadCard(out.WINDOWS.LTS, 'LTS')
        addDownloadCard(out.WINDOWS.STABLE, 'STABLE')
        // downloadCardsContainer.insertAdjacentElement('afterend',downloadCard)

        console.log(out.WINDOWS.STABLE.name);
        console.log(out.WINDOWS.STABLE.link);

}).catch(err => console.error(err));