const treeView = document.createElement('template');
treeView.innerHTML =
`
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div class="tree">
        <ul class="TreeView">
            <h4 id="title"></h4>
            <li>
                <span class="caret" id="parentItemTitle"></span>
                <ul class="nested" id="parentItem"></ul>
            </li>
        </ul>
    </div>
`

class TreeView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(treeView.content.cloneNode(true));
    }

    updateTree() {
        var toggler = this.shadowRoot.querySelectorAll(".caret");
        var i;

        for (i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function () {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
            toggler[i].click()
        }
    }

    connectedCallback() {
        var title = this.getAttribute("title")
        var location = this.getAttribute('location')

        const titleElement = this.shadowRoot.getElementById("parentItemTitle")
        titleElement.innerHTML = `<i class="fas fa-folder"></i>${title}`
        BL.loadDirTree([location, this.id])
        this.addEventListener('update-tree',(e)=>{
            this.updateTree()
        })
    }
}

window.customElements.define('tree-view', TreeView);