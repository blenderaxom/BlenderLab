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
        const titleId = "title"+this.id
        const desId =  "description"+this.id 
        const saveBtnId = "saveBtn"+this.id

        const htmldata = parseEditorBlocks(data.description)
        this.innerHTML =
            `
       <br>
       <div>${htmldata}</div>
       
       <div id="content"></div>
       `
        // const desEditor = setUpEditor(desId)
    //     <div class="editor">
    //    <div id="toolbar"></div>
    //    <div class="read" id="${desId}">
    //    </div>
    //    <button class="btn btn-primary" id="${saveBtnId}">Save Data</button>
    //    </div>
        // document.getElementById(saveBtnId).addEventListener('click', async ()=>{
        //     saveAndRender(desEditor,this)
        // })
        var cbs = document.querySelectorAll(".code-block")
        cbs.forEach((l) => {
            hljs.highlightBlock(l);
        })
    }

}

window.customElements.define('project-page', ProjectPageTemplate);