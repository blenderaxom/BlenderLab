const blendDownCard = document.createElement('template');
blendDownCard.innerHTML = 
`
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div class="card download-card">
      <div class="header" id="header"></div>
      <br>
      <div id="myProgress">
        <div id="myBar" data-done="70"></div>
      </div>
      <br>
      <button class="btn btn-primary" id='downloadBtn'>Download</button>
      <button class="btn btn-tertiary" id='cancelBtn'>Cancel</button>
    </div>
`
class BlenderDownloadCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(blendDownCard.content.cloneNode(true));
    }

    connectedCallback() {
        const cancelBtn = this.shadowRoot.getElementById('cancelBtn')
        const downloadBtn = this.shadowRoot.getElementById('downloadBtn')
        const downloadLink = this.getAttribute('download-link')
        const type = this.getAttribute('type')
        const name = this.getAttribute('name')

        this.shadowRoot.getElementById('header').innerText = name

        cancelBtn.style.display="none";
        
        downloadBtn.addEventListener('click', () => {
            BL.downloadfile(downloadLink, this.id, type)
        })
    }
}

window.customElements.define('blender-download-card', BlenderDownloadCard);