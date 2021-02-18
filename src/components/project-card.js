const templateCard = document.createElement('template');
templateCard.innerHTML = 

`<link rel="stylesheet" href="../css/styles.css">
<link href="../css/all.css" rel="stylesheet">
<div class="pc">
    <div class="name-label" id="name"></div>
    <div class="time-label" id="time"></div>
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

        const nameElement = this.shadowRoot.getElementById("name")
        const timeElement = this.shadowRoot.getElementById("time")

        nameElement.innerHTML = name
        timeElement.innerHTML = time

        this.addEventListener('click', async function (event){
            
            var id = await addNewTab(name)
            
            document.body.insertAdjacentHTML('afterbegin', `
            <project-page myId="${id}" title="${name}" location="${location}">
            </project-page>`)

            setTabContent(id)
        })
    }
}

window.customElements.define('p-c', ProjectCard);