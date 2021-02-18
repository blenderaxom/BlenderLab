const StoreTemplate = document.createElement('template');
StoreTemplate.innerHTML = "Store Page"

class Store extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(StoreTemplate.content.cloneNode(true));
    }
    connectedCallback() {
    }
}

window.customElements.define('store-content', Store);