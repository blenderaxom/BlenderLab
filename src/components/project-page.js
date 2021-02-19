class ProjectPageTemplate extends HTMLElement {
    constructor() {
        super();
        this.classList.add("tabcontent")
        this.id = this.getAttribute("myId")
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

        const contentDiv = document.createElement('div')
        contentDiv.classList.add('content-div')
        this.insertAdjacentElement('beforeend',contentDiv)

        
        const htmldata = parseEditorBlocks(data.description)
        var projectPageContent = document.createElement('div')
        projectPageContent.classList.add('project-page-content')
        projectPageContent.innerHTML =
            `<div>${htmldata}</div>
        <div class="btn edit-description-btn" id="${editBtnId}"><i class="fas fa-marker"></i> Edit</div>`

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
            if (desEditor==null){
                desEditor = setUpEditorWithBlock(desId, data.description)
            }
            projectPageContent.style.display = "none";
            pageEditContent.style.display = "block";
            window.scrollTo(0, 0)
        })

        document.getElementById(cancelBtnId).addEventListener('click', (e) => {
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

            }).catch((error) => {
                console.log('Saving failed: ', error)
            });
        })
        var Tree = document.createElement('tree-view')
        Tree.id = "project-tree"+this.id
        Tree.setAttribute("location", location)
        Tree.setAttribute("title", data.title)
        contentDiv.insertAdjacentElement('beforeend', Tree)
    }
}

window.customElements.define('project-page', ProjectPageTemplate);