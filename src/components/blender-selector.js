const blendSelector = document.createElement('template');
blendSelector.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <div class="custom-select">
        <select>
        </select>
        <span class="custom-arrow"></span>
    </div>
`
class BlenderSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(blendSelector.content.cloneNode(true));
    }

    connectedCallback() {
        BL.setUpBlenderSelector(this.id)
    }
}

window.customElements.define('blender-selector', BlenderSelector);