class ProjectPageTemplate extends HTMLElement {
    constructor() {
        super();
        this.classList.add("tabcontent")
        // const title = this.getAttribute("title")
        const location = this.getAttribute("location")
        
        
        this.getContents(location)
    }


    async getContents(location) {
        const data = await BL.getProject(location)
        const titleId = "title" + this.id
        const desId = "description" + this.id
        const saveBtnId = "saveBtn" + this.id
        const cancelBtnId = "cancelBtn" + this.id
        const editBtnId = "editBtn" + this.id

        this.innerHTML = ''

        this.innerHTML = '<div class="bg"><div class="loader"></div></div>'
        setTimeout(()=>{
            this.querySelector(".bg").remove()
        }, 500)
        const contentDiv = document.createElement('div')
        contentDiv.classList.add('content-div')
        this.insertAdjacentElement('beforeend', contentDiv)


        const htmldata = parseEditorBlocks(data.description)
        var projectPageContent = document.createElement('div')
        projectPageContent.classList.add('project-page-content')
        projectPageContent.innerHTML =
            `<div>${htmldata}</div>
        <div class="btn edit-description-btn" id="${editBtnId}"><i class="material-icons md-18">edit</i> Edit</div>`

        contentDiv.insertAdjacentElement('beforeend', projectPageContent)

        var pageEditContent = document.createElement('div')
        pageEditContent.classList.add('page-edit-content')
        pageEditContent.innerHTML =
            `   
            <h6>Project Name *</h6>
            <div class="field"><input type="text" id="${titleId}" value="${data.title}" required></div>
            <h6>Project Description *</h6>
            <div class="desc-editor">
                <div id="${desId}"></div>
            </div>
            <div class="save-cancel">
                <button class="btn btn-tertiary save-btn" id="${cancelBtnId}">Cancel</button>
                <button class="btn btn-primary save-btn" id="${saveBtnId}">Save</button>
            </div>
        `
        pageEditContent.style.display = "none"
        contentDiv.insertAdjacentElement('beforeend', pageEditContent)

        var cbs = document.querySelectorAll(".code-block")
        cbs.forEach((l) => {
            hljs.highlightBlock(l);
        })
        var editDecBtn = document.getElementById(editBtnId)
        let desEditor = null
        editDecBtn.addEventListener('click', (e) => {
            desEditor = setUpEditorWithBlock(desId, data.description)
            projectPageContent.style.display = "none";
            pageEditContent.style.display = "block";
            window.scrollTo(0, 0)
        })

        document.getElementById(cancelBtnId).addEventListener('click', (e) => {
            desEditor.destroy()
            desEditor = null
            projectPageContent.style.display = "block";
            pageEditContent.style.display = "none";
            window.scrollTo(0, 0)
        })
        document.getElementById(saveBtnId).addEventListener('click', async () => {

            desEditor.save().then((outputData) => {
                var newTitle = document.getElementById(titleId)
                BL.updateProject(
                    location, newTitle.value, JSON.stringify(outputData, null, 2)
                )
                this.getContents(location)
                desEditor.destroy()
                desEditor = null
            }).catch((error) => {
                console.log('Saving failed: ', error)
            });
        })
        var Tree = document.createElement('tree-view')
        Tree.id = "project-tree" + this.id
        Tree.setAttribute("location", location)
        Tree.setAttribute("name", data.title)
        contentDiv.insertAdjacentElement('beforeend', Tree)

        function removeEditor(e){
            if (e.target != this) return
            if (desEditor != null ) {
                desEditor.destroy();
                console.log('removed editor');
            }
            document.querySelectorAll(".ct").forEach(l=>l.remove())
            this.removeEventListener("DOMNodeRemoved", removeEditor)
        }

        this.addEventListener('DOMNodeRemoved', removeEditor)
    }
}

window.customElements.define('project-page', ProjectPageTemplate);