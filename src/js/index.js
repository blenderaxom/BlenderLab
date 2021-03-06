const nav = document.querySelector(".navbar")
const sidebarProfileBtn = document.getElementById('sidebarProfileBtn')
const mainTab = document.getElementById("default-tab")
let tabs = []

// Hide Tabbar when scrolling down
var prevScrollpos = window.pageYOffset;

window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.querySelector(".tabbar").style.top = "1.7rem";
    } else {
        document.querySelector(".tabbar").style.top = "-50px";
    }
    prevScrollpos = currentScrollPos;
}

// Open page when we click on sidebar items
function openPage(evt, pageName) {
    saveScrollPos()
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("nav-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(pageName).style.display = "block";
    evt.currentTarget.className += " active";
    mainTab.classList.replace(mainTab.classList[0], pageName)
    mainTab.innerText = pageName
    mainTab.click()
}

// Add new tab
async function addNewTab(name) {
    var tabbar = document.querySelector(".tabbar-contents");
    var tabitem = document.createElement("tab-item")
    var id = await BL.getUniqueId()
    tabitem.setAttribute("name", name)
    tabitem.setAttribute("childId", id)
    tabitem.setActive()
    tabbar.appendChild(tabitem)
    return id
}

// Hide all elements and show the current tab content in index page
function setTabContent(id) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(id).style.display = "block";
}

// Open home by default on startup
document.getElementById("defaultOpen").click();

// Set the main tab active when we click on it
mainTab.addEventListener('click', (e) => {
    saveScrollPos()
    mainTab.classList.add("tab-active")
    setTabContent(mainTab.classList[0])
    scrollToPos(parseFloat(mainTab.getAttribute("scrollPos")))
    // showSidebar()
})

// Make the main tab active on startup
mainTab.click()

// Move contents when expanding sidebar
nav.addEventListener('mouseenter', () => {
    sidebarProfileBtn.shadowRoot.getElementById('actionContainer').style.opacity = '100%'
    document.querySelector("body").style.margin = "4rem 0 0 13.2rem";
})
nav.addEventListener('mouseleave', () => {
    // showSidebar()
    sidebarProfileBtn.shadowRoot.getElementById('actionContainer').style.opacity = '0'
    document.querySelector("body").style.margin = "4rem 0 0 6rem";
})

// Open new project window when new project button is clicked
const newProjBtn = document.querySelector("#new-project-button");
newProjBtn.addEventListener('click', (event) => {
    BL.newProjectWindow()
})

// Add the project list container on startup
BL.addProjects()

function saveScrollPos() {
    if (mainTab.classList.contains("tab-active")) {
        mainTab.setAttribute("scrollPos", $(window).scrollTop().toString())
    }
    const tabs = document.querySelectorAll("tab-item")
    tabs.forEach((l) => {
        var el = l.shadowRoot.querySelector(".tab-active")

        if (el != null) {
            l.setAttribute("scrollPos", $(window).scrollTop().toString())
            el.classList.remove("tab-active")

        }
    })


}

// Scrolls the window to old position
function scrollToPos(pos) {
    setTimeout(function () {
        window.scrollTo(0, pos);
    }, 1);
    // window.scrollTo(0, 145)
}

const getCurrentTab = () => new Promise((r,re)=>{
    const tabbarItem = document.querySelectorAll("tab-item")
    tabbarItem.forEach(l=>{
        if (l.shadowRoot.querySelector('.tabbar-item').classList.contains("tab-active")) {
            return r(l)
        }
    })
    return r(mainTab)
    
})

async function closeCurrentTab(){
    var activeTab = await getCurrentTab()
    if (activeTab!=mainTab)activeTab.closeTab();
}