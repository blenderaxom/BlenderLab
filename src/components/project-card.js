const templateCard = document.createElement('template');
templateCard.innerHTML = 

`<link rel="stylesheet" href="../css/styles.css">
<div class="pc">
    <div>
        <div class="name-label" id="name"></div>
        <div class="time-label" id="time"></div>
    </div>    
    <custom-popup n="btn-icon-tertiary"></custom-popup>
</div>`

class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(templateCard.content.cloneNode(true));
    }
    
    connectedCallback() {
        const name = this.getAttribute("name")
        const location = this.getAttribute("location")
        const time = this.getAttribute("time")

        const menu = this.shadowRoot.querySelector('custom-popup')
        .querySelector('.dropdown-content')

        const nameElement = this.shadowRoot.getElementById("name")
        const timeElement = this.shadowRoot.getElementById("time")
        nameElement.innerHTML = name
        timeElement.innerHTML = time

        this.addEventListener('click', async function (event){
            var id = await addNewTab(name)
            
            document.getElementById('main-contents').insertAdjacentHTML('afterbegin', `
            <project-page myId="${id}" location="${location}">
            </project-page>`)

            setTabContent(id)
        })

        makeCustomMenuItem(menu,'launch',"Open", ()=>{this.click()})
        makeCustomMenuItem(menu,'folder_open',"Open in file explorer", ()=>{})
        makeCustomMenuItem(menu,'delete',"Delete", ()=>{})
    }
}

window.customElements.define('p-c', ProjectCard);