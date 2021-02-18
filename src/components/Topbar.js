const TopbarTemplate = document.createElement('template');
TopbarTemplate.innerHTML = 
`
<link rel="stylesheet" href="../css/styles.css">
<link href="../css/all.css" rel="stylesheet">
<div class="topbar-container">
    <div id="menu-bar">
        <div class="left" role="menu">
            <h5 class="titlebar-name"></h5>
        </div>
        <div class="right">
            <button class="menubar-btn mini" id="minimize-btn"><i class="fas fa-minus"></i></button>
            <button class="menubar-btn maxi" id="max-unmax-btn"><i class="far fa-square"></i></button>
            <button class="menubar-btn close" id="close-btn"><i class="close-icon fas fa-times"></i></button>
        </div>
    </div>
</div>
`

class Topbar extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(TopbarTemplate.content.cloneNode(true));

        this.shadowRoot.querySelector(".titlebar-name").innerText = this.getAttribute('title-name');
    }
    connectedCallback() {
        const mini = this.shadowRoot.querySelector(".mini")
        const maxi = this.shadowRoot.querySelector(".maxi")
        const close = this.shadowRoot.querySelector(".close")

        mini.addEventListener('click', ()=> BL.minimizeWindow())
        maxi.addEventListener('click', ()=> BL.toogleMaxWindow())
        close.addEventListener('click', ()=> BL.closeWindow())
    }
}

window.customElements.define('topbar-topbar', Topbar);