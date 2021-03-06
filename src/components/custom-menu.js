const customPopup = document.createElement('template');
customPopup.innerHTML =
    `
    <div id="bgCont"><div id="bg" class="transparent"></div></div>
    <div class="dropdown">
        <button id="moreBtn" class="btn btn-icon"><span class="material-icons md-24">more_horiz</span></button>
        <div class="dropdown-content"></div>
    </div>
`
class CustomPopup extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
        this.appendChild(customPopup.content.cloneNode(true));
        const b = this.getAttribute('n')
        this.querySelector('button').classList.add(b)
        
        this.querySelector('#bgCont').style.display = 'none'
    }

    connectedCallback() {
        const moreBtn = this.querySelector('#moreBtn')
        const dropDownContent = this.querySelector('.dropdown-content')
        const bgCont = this.querySelector('#bgCont')

        moreBtn.addEventListener('click', e => {
            e.stopPropagation()
            setTimeout(() => {
                dropDownContent.scrollIntoView();
            }, 50)
            bgCont.style.display = 'block'
            dropDownContent.style.display = 'block'
        })

        bgCont.onclick = e => {
            e.stopPropagation()
            bgCont.style.display = 'none'
            dropDownContent.style.display = 'none'
        }
        this.addEventListener('keyup', e => {
            if (e.key == "Escape") {
                bgCont.click()
            }
        })
        dropDownContent.onclick=(e)=>{e.stopPropagation();bgCont.click()}
        
    }
}

window.customElements.define('custom-popup', CustomPopup);