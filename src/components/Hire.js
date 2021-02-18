const HireTemplate = document.createElement('template');
HireTemplate.innerHTML = "Hire Page"

class Hire extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(HireTemplate.content.cloneNode(true));
    }
    connectedCallback() {
    }
}

window.customElements.define('hire-content', Hire);