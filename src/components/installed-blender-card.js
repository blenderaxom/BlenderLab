const blendinstalledCard = document.createElement('template');
blendinstalledCard.innerHTML = 
`
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div class="card installed-card">
      <div class="header" id="header"></div>
      <button class="btn btn-tertiary" id='defaultBtn'>Set as Default</button>
    </div>
`
class InstalledBlenderCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(blendinstalledCard.content.cloneNode(true));
    }

    connectedCallback() {
        const name = this.getAttribute('name')
        this.shadowRoot.getElementById('header').innerText = name
    }
}

window.customElements.define('installed-blender-card', InstalledBlenderCard);