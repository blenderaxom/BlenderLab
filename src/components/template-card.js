const templateCard = document.createElement('template');
templateCard.innerHTML = 

`<link rel="stylesheet" href="../css/styles.css">
<link href="../css/all.css" rel="stylesheet">
<div class="template-card-item">
    <div class="card-header name"></div>
    <div class="card-body"></div>
</div>`

class TemplateCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(templateCard.content.cloneNode(true));
    }
    
    connectedCallback() {
        const cardi = this.shadowRoot.querySelector('.template-card-item')
        const name = this.getAttribute("name")
        const cardMode = this.getAttribute("mode")
        const cardType = this.getAttribute("type")
        if (cardMode==="GENERAL") {
            cardi.classList.add('card-active')
        }
        if (name==undefined || name==""){
            this.shadowRoot.querySelector(".name").innerHTML = "Not Defined";
        } else {
            this.shadowRoot.querySelector(".name").innerHTML = name;
        }
        
        
        function setActive(e) {
            mode = cardMode;
            type = cardType;
            console.log(type, mode);
            templatecards.forEach(l=> {
                const item = l.shadowRoot.querySelector(".template-card-item")
                item.classList.remove("card-active")
            })
            cardi.classList.add('card-active')
        }
        cardi.addEventListener('click',(e)=>setActive(e));
    }
}

window.customElements.define('template-card', TemplateCard);