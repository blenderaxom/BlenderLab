const blendinstalledCard = document.createElement('template');
blendinstalledCard.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <div class="card installed-card">
      <div class="header" id="header"></div>
      <button class="btn btn-tertiary" id='defaultBtn'>Set as Default</button>
      <button class="btn btn-primary" id='selectedBtn'>Selected</button>
    </div>
`
class InstalledBlenderCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(blendinstalledCard.content.cloneNode(true));
    }

    connectedCallback() {
        const name = this.getAttribute('name')
        const selected = this.getAttribute('selected')
        const location = this.getAttribute('location')
        const card = this.shadowRoot.querySelector('.installed-card')
        const selectedBtn = this.shadowRoot.getElementById('selectedBtn')
        const defaultBtn = this.shadowRoot.getElementById('defaultBtn')

        function setSelected() {
            var cards = document.querySelectorAll("installed-blender-card")
            cards.forEach(l => {
                const selected = l.shadowRoot.querySelector(".default")
                if (selected != null) {
                    selected.classList.remove('default')
                    l.shadowRoot.getElementById('selectedBtn').style.display = 'none'
                    l.shadowRoot.getElementById('defaultBtn').style.display = 'block'
                }
                
            })
            card.classList.add('default');
            selectedBtn.style.display = "block"
            defaultBtn.style.display = "none"
        }
        if (selected=='true') setSelected()
        else {
            selectedBtn.style.display = "none"
            defaultBtn.style.display = "block"
        }

        this.shadowRoot.getElementById('header').innerText = name

        defaultBtn.addEventListener('click', (e) => {
            setSelected()
            BL.selectDefaultBlender(location)
        })

    }
}

window.customElements.define('installed-blender-card', InstalledBlenderCard);