const treeView = document.createElement('template');
const s =
    `
<link rel="stylesheet" href="../css/styles.css">
<link href="../css/all.css" rel="stylesheet">
<div class="tree">
    <div id="tree-tools-container">
        <button id="new-blend-file"><i class="fas fa-file-medical"></i></button>
        <button id="new-folder"><i class="fas fa-folder-plus"></i></button>
        <button id="refresh-dir"><i class="fas fa-sync-alt"></i></button>
    </div>
    <ul class="TreeView">
        <h4 id="title"></h4>
        <li id="parent">
            <span class="caret" id="parentItemTitle"></span>
            <ul class="nested" id="parentItem"></ul>
        </li>
    </ul>
</div>
`
treeView.innerHTML = s
class TreeView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(treeView.content.cloneNode(true));
    }

    connectedCallback() {
        const shad = this;
        var title = this.getAttribute("name")
        var location = this.getAttribute('location')
        let newItem = document.createElement('temp-input');

        function createInputOption(active){
            newItem.setAttribute("location", active.getAttribute('location'));
            newItem.setAttribute("treeId", shad.id);
        }

        const titleElement = this.shadowRoot.getElementById("parentItemTitle")
        titleElement.classList.add('active-item')
        titleElement.setAttribute('location', location)
        titleElement.innerHTML = `<i class="fas fa-folder"></i>${title}`

        titleElement.addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
        this.shadowRoot.getElementById("parent").addEventListener('click', (e) => {
            if (e.target.tagName != 'UL' && e.target.tagName != 'TEMP-INPUT') {
                var active = this.shadowRoot.querySelector('.active-item')
                active.classList.remove('active-item')
                if (e.target.tagName != "I" && e.target.tagName != "IMG"){
                    e.target.classList.add('active-item')
                }
                else{e.target.parentElement.classList.add('active-item')}
            }
        })
        titleElement.click()

        BL.loadDirTree([location, this.id])

        const toolsettings = this.shadowRoot.getElementById("tree-tools-container")
        const tree = this.shadowRoot.querySelector('.tree')
        tree.addEventListener('mouseenter', (e) => {
            toolsettings.style.display = "block"
        })
        tree.addEventListener('mouseleave', (e) => {
            toolsettings.style.display = "none"
        })

        var newBlendFileBtn = this.shadowRoot.getElementById("new-blend-file")
        var newFolderBtn = this.shadowRoot.getElementById("new-folder")
        var refreshDirBtn = this.shadowRoot.getElementById("refresh-dir")

        function showInputOption(type){
            var getActive = shad.shadowRoot.querySelector('.active-item');
            if (getActive.tagName == "SPAN" || getActive.tagName == "LI") {
                createInputOption(getActive)
                newItem.setAttribute("type", type);
                
                if (getActive.classList.contains('caret')) {
                    if (getActive.classList.contains('caret-down') == false) {
                        getActive.classList.toggle("caret-down");
                        getActive.parentElement.querySelector(".nested").classList.toggle("active");
                    }
                    newItem.setAttribute('parentId', getActive.nextElementSibling.id)
                    getActive.nextElementSibling.appendChild(newItem)
                    newItem = document.createElement('temp-input'); 
                } else {
                    newItem.setAttribute('parentId', getActive.id)
                    getActive.insertAdjacentElement('afterend', newItem)
                    newItem = document.createElement('temp-input');
                };
            }
        }

        newBlendFileBtn.addEventListener('click', (e) => {
            showInputOption('blend')
        })
        newFolderBtn.addEventListener('click', (e) => {
            showInputOption('folder')

        })
        refreshDirBtn.addEventListener('click', (e) => {
            var getActive = this.shadowRoot.querySelector('.active-item')
            console.log(getActive.getAttribute('location'))
        })
    }
}

window.customElements.define('tree-view', TreeView);