const tempInput = document.createElement('template');
tempInput.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div id="bg"></div>
    <div id="container">
        <i class="fas fa-folder" id="folderIcon"></i>
        <img src="../images/svg/blenderlogo.svg" class="svg-btn-icon" id="blendIcon">
        <div class="field-value"><input type="text" onfocus="this.select()" id="name"></div>
    </div>
    
`

class TempInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tempInput.content.cloneNode(true));
    }

    connectedCallback() {
        var type = this.getAttribute('type');
        var location = this.getAttribute('location')
        var treeId = this.getAttribute('treeId')
        var parentId = this.getAttribute('parentId')
        var input = this.shadowRoot.getElementById('name')
        var folderIcon = this.shadowRoot.getElementById('folderIcon')
        var blendIcon = this.shadowRoot.getElementById('blendIcon')
        var bg = this.shadowRoot.getElementById('bg')
        var done = false;

        if (type == 'blend') {
            blendIcon.style.display = "block";
            folderIcon.style.display = "none";
        } else {
            blendIcon.style.display = "none";
            folderIcon.style.display = "block";
        }
        input.focus();
        // When the user clicks anywhere outside of the modal, close it
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                if (input.value.trim() == "") {
                    done = true;
                    this.remove()
                } else {
                    done = true;
                    BL.createNewItem(type, location, input.value, treeId, parentId)
                    this.remove()
                }
            }
            else if (e.key === 'Escape') {
                done = true;
                this.remove()
            };
        });
        input.addEventListener('focusout', (e) => {
            if (done!=true)
                this.remove()
        });
    }
}

window.customElements.define('temp-input', TempInput);