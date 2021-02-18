const BlogTemplate = document.createElement('template');
BlogTemplate.innerHTML = "Blog Page"

class Blog extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(BlogTemplate.content.cloneNode(true));
    }
    connectedCallback() {
    }
}

window.customElements.define('blog-content', Blog);