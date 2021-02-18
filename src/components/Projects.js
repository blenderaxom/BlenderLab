const projectTemplate = document.createElement('template');
projectTemplate.innerHTML = "Projects"

class Project extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(projectTemplate.content.cloneNode(true));
    }
    connectedCallback() {
    }
}

window.customElements.define('project-content', Project);