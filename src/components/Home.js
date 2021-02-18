const homeTemplate = document.createElement('template');
homeTemplate.innerHTML =
`
<link rel="stylesheet" href="../css/styles.css">
<link href="../css/all.css" rel="stylesheet">
<div class="header">
    <h4>Hi John,</h4>
    <h3>Welcome back👋</h3>
</div>
<div class="home-contents">
    <br>    
    <button class="btn btn-primary" id="newProjectBtn"> New Project</button>
    <br>
    <div class="card">
        <div class="card-header">Projects</div>
        <div class="card-body">
            <div class="projects-container">
            </div>
        </div>
    </div>
</div>`

class Home extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(homeTemplate.content.cloneNode(true));
    }
    connectedCallback() {
        const newProjBtn = this.shadowRoot.querySelector("#newProjectBtn");
        const projectsContainer = this.shadowRoot.querySelector(".projects-container");
        newProjBtn.addEventListener('click' ,(event)=> {
            BL.newProjectWindow()
        })
        document.addEventListener('db-changed', (event)=>{
            BL.addProjects();
        })
        BL.addProjects();
    }
}

window.customElements.define('home-content', Home);