const InstallsTemplate = document.createElement('template');
InstallsTemplate.innerHTML = "Installs page"

class Installs extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(InstallsTemplate.content.cloneNode(true));
    }
    connectedCallback() {
    }
}

window.customElements.define('installs-content', Installs);