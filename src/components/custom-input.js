const customInput = document.createElement('template');
customInput.innerHTML =
`
    <link rel="stylesheet" href="../css/styles.css">
    <div class="field">
        <div class="input-header">
            <h1 id="name"></h1>
            <span id="maxlengthCounter"></span>
        </div>
        <input id="singleLine" type="text" maxlength="50"></input>
        <textarea id="multiLine" type="text" maxlength="50"></textarea>
    </div>
`

class CustomInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(customInput.content.cloneNode(true));
        const mode = this.getAttribute('mode')
        if (mode=="single") {
            this.shadowRoot.getElementById('singleLine').style.display = "block"
            this.shadowRoot.getElementById('multiLine').style.display = "none"
            this.shadowRoot.querySelector('.field').style.height = ''
            
        } else {
            if (this.getAttribute('type')=="date")
                this.shadowRoot.querySelector('span').style.display="none"
            this.shadowRoot.getElementById('singleLine').style.display = "none"
            this.shadowRoot.getElementById('multiLine').style.display = "block" 
            this.shadowRoot.querySelector('.field').style.height = '120px'
        }
    }

    connectedCallback() {
        const name = this.getAttribute('name')
        const type = this.getAttribute('type')
        
        const maxlength = this.getAttribute('maxlength')
        const nameElement = this.shadowRoot.getElementById('name')
        const maxlengthCounter = this.shadowRoot.getElementById('maxlengthCounter')
        const input = this.shadowRoot.querySelector('input')
        const textarea = this.shadowRoot.querySelector('textarea')

        input.maxLength = maxlength
        textarea.maxLength = maxlength
        input.type = type
        nameElement.innerText = name

        maxlengthCounter.innerText = `${input.value.length}/${input.maxLength}`

        input.addEventListener('focusin',(e)=>{
            this.shadowRoot.querySelector('.field').classList.add('f-active')
            if (type!="date")
                this.shadowRoot.querySelector('span').style.display="block"
            
        })
        input.addEventListener('focusout', e=>{
            this.shadowRoot.querySelector('.field').classList.remove('f-active')
            this.shadowRoot.querySelector('span').style.display="none"
        })
        textarea.addEventListener('focusin',(e)=>{
            this.shadowRoot.querySelector('.field').classList.add('f-active')
            if (type!="date")
                this.shadowRoot.querySelector('span').style.display="block"
        })
        textarea.addEventListener('focusout', e=>{
            this.shadowRoot.querySelector('.field').classList.remove('f-active')
            this.shadowRoot.querySelector('span').style.display="none"
        })
    }
}

window.customElements.define('custom-input', CustomInput);