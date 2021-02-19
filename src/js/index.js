/* ADD SIDEBAR */
// document.write(`<side-bar class="sidebar"></side-bar>`)
const nav = document.querySelector(".navbar")
const mainTab = document.getElementById("default-tab")
let tabs = []

// Hide Tabbar when scrolling down
var prevScrollpos = window.pageYOffset;

window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.querySelector(".tabbar").style.top = "2.3rem";
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
    showSidebar()
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
    document.querySelector(".tabbar-main").classList.remove("tab-active")
    mainTab.classList.add("tab-active")
    setTabContent(mainTab.classList[0])
    scrollToPos(parseFloat(mainTab.getAttribute("scrollPos")))
    showSidebar()
})

// Make the main tab active on startup
mainTab.click()

// Shows the sidebar
function showSidebar() {
    if (mainTab.classList.contains("tab-active")) {
        nav.style.backgroundColor = "transparent"
        nav.style.boxShadow = "5px 5px 10px #101010, -5px -5px 10px #3F3F3F "
    } else {
        nav.style.backgroundColor = "rgba(255, 255, 255, 0.027)"
        nav.style.boxShadow = "none"
    }
}
// Move contents when expanding sidebar
nav.addEventListener('mouseenter', () => {
    nav.style.backgroundColor = "transparent"
    nav.style.boxShadow = "5px 5px 10px #101010, -5px -5px 10px #3F3F3F "
    document.querySelector("body").style.padding = "5rem 1rem 0 15.4rem";
})
nav.addEventListener('mouseleave', () => {
    showSidebar()
    document.querySelector("body").style.padding = "5rem 2rem 0 8rem";
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

