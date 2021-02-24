const tabItem = document.createElement('template');
tabItem.innerHTML =
`<link rel="stylesheet" href="../css/styles.css">
<link href="../css/all.css" rel="stylesheet">
<div class="tabbar-item">
    <a href="#" class="name"></a>
    <i class="close-btn fas fa-times"></i>
</div>
`

class TabItem extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tabItem.content.cloneNode(true));
    }
    setActive() {
        saveScrollPos()
        document.querySelector(".tabbar-main").classList.remove("tab-active")
        this.shadowRoot.querySelector(".tabbar-item").classList.add("tab-active")
        scrollToPos(parseFloat(this.getAttribute("scrollPos")))
    }

    connectedCallback() {
        const shadow = this
        var name = this.getAttribute("name")
        var id = this.getAttribute("childId")
        if (name.length > 15) {
            name = name.substring(0, 15) + "..."
        }
        const nameElement = this.shadowRoot.querySelector(".name")
        const closeBtn = this.shadowRoot.querySelector(".close-btn")
        nameElement.innerHTML = name

        nameElement.addEventListener('click', (e)=>{
            shadow.setActive()
            setTabContent(id)
        })

        /* Do something when we click on close icon */
        closeBtn.addEventListener('click', (e) => {
            // Get the clicked tabbar item
            const tabbarItem = this.shadowRoot.querySelector(".tabbar-item")
            if (tabbarItem.classList.contains("tab-active")) { // if tabbar item is active
                var prevItem = this.previousElementSibling // Get the previous element
                if (prevItem.tagName === this.tagName) { // if previous element is of same type
                    prevItem.setActive() // Call the set Active method
                    document.getElementById(prevItem.getAttribute("childId")).style.display = "block"
                }
                else { // else it is the main tab
                    prevItem.classList.add("tab-active")
                    document.getElementById(prevItem.classList[0]).style.display = "block"
                }
            }

            this.remove() // delete the clicked tab
            document.getElementById(id).remove() // delete the tab contents
        })


        var tabbar = document.querySelector(".tabbar-contents");
        
        // tabbar.scrollTo(10000,0)
        this.scrollIntoView(true, { behavior: "smooth", block: "end", inline: "end" });
    }
}

window.customElements.define('tab-item', TabItem);