const LearnTemplate = document.createElement('template');
LearnTemplate.innerHTML = `
Learn
`

class Learn extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(LearnTemplate.content.cloneNode(true));
    }
    connectedCallback() {
    }
}

window.customElements.define('learn-content', Learn);