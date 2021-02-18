const template = document.createElement('template');
template.innerHTML= `
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div class="navbar">
        <nav class="navbar-nav">
            <div>
                <div class="logo">
                    <img src = "../images/Logo.png" alt="BlenderLab" class="logo-svg"/>
                    <span class="brand-name">BlenderLab</span>
                </div>
                <div class="nav-list">
                    <a href="#" class="home nav-link active">
                        <i class="fas fa-home"></i>
                        <span class="link-text">Home</span>
                    </a>
                    <a href="#" class="projects nav-link">
                        <i class="fas fa-folder-open"></i>
                        <span class="link-text">Projects</span>
                    </a>
                    <a href="#" class="learn nav-link">
                        <i class="fas fa-book"></i>
                        <span class="link-text">Learn</span>
                    </a>
                    <a href="#" class="blog nav-link">
                        <i class="fas fa-blog"></i>
                        <span class="link-text">Blog</span>
                    </a>
                    <a href="#" class="installs nav-link">
                        <i class="fas fa-download"></i>
                        <span class="link-text">Installs</span>
                    </a>
                    <a href="#" class="hire nav-link">
                        <i class="fas fa-user-check"></i>
                        <span class="link-text">Hire</span>
                    </a>
                    <a href="#" class="store nav-link">
                        <i class="fas fa-store"></i>
                        <span class="link-text">Store</span>
                    </a>
                </div>
            </div>
        </nav>
    </div>
`

const Pages = {
    //assinging values to constants
    HOME: 'home',
    PROJECTS: 'projects',
    LEARN: 'learn',
    BLOG: 'blog',
    INSTALLS: 'installs',
    HIRE: 'hire',
    STORE: 'store'
};

class SideBar extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        let page=Pages.HOME

        const content = document.querySelector(".content")

        content.innerHTML = "<home-content></home-content>"

        /* ==== LINK ACTIVE ==== */
        const linkColor = this.shadowRoot.querySelectorAll('.nav-link')

        function colorLink() {
            linkColor.forEach(l=> l.classList.remove('active'))
            this.classList.add('active')
            const activeBtn = this.classList[0]
            if (activeBtn === Pages.HOME) {
                content.innerHTML = "<home-content></home-content>"
            } 
            else if (activeBtn === Pages.PROJECTS) {
                content.innerHTML = "<project-content></project-content>"
            }
            else if (activeBtn === Pages.LEARN) {
                content.innerHTML = "<learn-content></learn-content>"
            }
            else if (activeBtn === Pages.BLOG) {
                content.innerHTML = "<blog-content></blog-content>"
            }
            else if (activeBtn === Pages.INSTALLS) {
                content.innerHTML = "<installs-content></installs-content>"
            }
            else if (activeBtn === Pages.HIRE) {
                content.innerHTML = "<hire-content></hire-content>"
            }
            else if (activeBtn === Pages.STORE) {
                content.innerHTML = "<store-content></store-content>"
            }
            
        }
        linkColor.forEach(l=> l.addEventListener('click',colorLink))


        const navi = this.shadowRoot.querySelector(".navbar")

        navi.addEventListener('mouseenter',()=>{
            document.querySelector("body").style.padding="2rem 1rem 0 14rem";
        })
        navi.addEventListener('mouseleave',()=>{
            document.querySelector("body").style.padding="2rem 2rem 0 6.75rem";
        })

    }
}


window.customElements.define('side-bar', SideBar);