const tempInput = document.createElement('template');
tempInput.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <div id="bg"></div>
    <div id="container">
        <i class="material-icons md-18" id="folderIcon">folder</i>
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
        var input = this.shadowRoot.getElementById('name')
        this.style.display = 'none'
        setTimeout(()=>{this.style.display = 'block';input.focus()}, 50)
        
        
        const shad = this;
        var type = this.getAttribute('type');
        var location = this.getAttribute('location')
        var treeId = this.getAttribute('treeId')
        var parentId = this.getAttribute('parentId')
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
        // When the user clicks anywhere outside of the modal, close it
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                if (input.value.trim() == "") {
                    done = true;
                    this.remove()
                } else {
                    if (type == "blend"){
                        done = true;
                        var selector = document.createElement('temp-blend-selector')
                        selector.setAttribute('name', input.value)
                        selector.setAttribute('location', location)
                        selector.setAttribute('treeId', treeId)
                        selector.setAttribute('treeItemId', parentId)
                        selector.id = treeId+'selector'
                        document.body.appendChild(selector)
                        shad.remove()
                    } else {
                        done = true;
                        BL.createNewItem(type, location, input.value, treeId, parentId)
                        this.remove()
                    }
                    
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