const tempInputBlendSelector = document.createElement('template');
tempInputBlendSelector.innerHTML =
`
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div id="bg"></div>
    <div id="blender-selector">
        <h3>Select Blender Version</h3>
    </div>
`

class TempBlendSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tempInputBlendSelector.content.cloneNode(true));
    }

    connectedCallback() {
        this.style.display = 'none'
        setTimeout(()=>{this.style.display = 'block'}, 50)

        const container = this.shadowRoot.getElementById('blender-selector')
        const bg = this.shadowRoot.getElementById('bg')
        const location = this.getAttribute('location')
        const name = this.getAttribute('name')
        const treeId = this.getAttribute('treeId')
        const treeItemId = this.getAttribute('treeItemId')

        BL.createBlendVerSelector(treeId, treeItemId, this.id, location,name)
        bg.onclick = (e)=>{
            this.remove()
        }
    }
}

window.customElements.define('temp-blend-selector', TempBlendSelector);