const profilePage = document.createElement('template');
profilePage.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <div id="page-container">
        <div class="bg"><div class="loader"></div></div>
        <div class="content">
            <div id="profile-header">
            <div class="left-container">
                <div class="pic-container large">
                    <img src="#" alt="Avatar" class="avatar large profilepic">
                    <i id="defAvatar" class="material-icons md-24">account_circle</i>
                </div>
            </div>
            <section class="right-container">
                <div class="right-top">
                    <h2 id="username"></h2>
                    <div id="edit-profile-btn" class="btn-outline">
                        Edit Profile
                    </div>
                    <custom-popup n="border" id="profileMoreBtn"></custom-popup>
                </div>
                <ul class="right-middle">
                    <li class="middle-item">
                        <span class="cont">
                            <span class="counter" id="projectsCount">10</span> projects
                        </span>
                    </li>
                    <li class="middle-item">
                        <span class="cont follow">
                            <span class="counter" id="followersCount">200</span> followers
                        </span>
                    </li>
                    <li class="middle-item">
                        <span class="cont follow">
                            <span class="counter" id="followingsCount">315</span> following
                        </span>
                    </li>
                </ul>
                <div class="right-bottom">
                    <h1 id="full-name">Biman Bordoloi</h1>
                    <span id="bio">Live your dream and be mentored by artists from Blizzard, Disney, Ubisoft, Pixar, EA, DreamWorks, ILM, CDProjekt and more. </span>
                    <div class="link"><i class="material-icons md-24">link</i>
                    <a href="https://www.youtube.com/c/mebman" target="_blank" id="user-link"> www.youtube.com/c/mebman</a></div>
                </div>
            </section>
        </div>

        </div>
        <div class="editProfilePopup">
            <div class="pop-up-card">
                <div class="pop-up-header">
                    <div>
                        <button id="closePopUpBtn" class="btn btn-icon"><i class="material-icons md-24">close</i></button>
                        <h1>Edit profile</h1>
                    </div>
                    <button id="saveEditBtn" class="btn btn-primary">Save</button>
                </div>
                <div class="pop-up-body">
                    <div class="profileEditContainer">
                        <div class="pic-container medium">
                            <img id="editProfilePic" src="#" alt="Avatar" class="avatar medium profilepic">
                            <div class="changeDPContainer">
                                <button class="btn btn-icon btn-icon-secondary">
                                    <i class="material-icons md-24">add_a_photo</i>
                                </button>
                            </div>
                        </div>
                        <custom-input id="editName" mode="single" type="text" name="Name" maxlength="50"></custom-input>
                        <custom-input id="editBio" mode="multiline" type="text" name="Bio" maxlength="160"></custom-input>
                        <custom-input id="editUrl" mode="single" type="url" name="Website" maxlength="100"></custom-input>
                    </div>
                </div>
            </div>
        </div>
    </div>
`

class ProfilePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(profilePage.content.cloneNode(true));
        this.shadowRoot.querySelector('.editProfilePopup').style.display = 'none'
    }

    connectedCallback() {
        setTimeout(() => {
            render()
        }, 200)
        const render = () => {
            this.shadowRoot.querySelector('.bg').style.display = 'none'
            const username = this.shadowRoot.getElementById('username')
            const fullName = this.shadowRoot.getElementById('full-name')
            const link = this.shadowRoot.getElementById('user-link')
            const bio = this.shadowRoot.getElementById('bio')
            const avatarContainers = this.shadowRoot.querySelectorAll('.profilepic')
            const defaultAvatar = this.shadowRoot.getElementById('defAvatar')
            const uid = this.getAttribute('uid')
            const popUpEditProfile = this.shadowRoot.querySelector('.editProfilePopup')
            const editProfileBtn = this.shadowRoot.getElementById('edit-profile-btn')
            const closePopUpBtn = this.shadowRoot.getElementById('closePopUpBtn')

            const editName = this.shadowRoot.getElementById('editName')
            .shadowRoot.querySelector('input')
            const editBio = this.shadowRoot.getElementById('editBio')
            .shadowRoot.querySelector('textarea')
            const editUrl = this.shadowRoot.getElementById('editUrl')
            .shadowRoot.querySelector('input')
            const editProfilePic = this.shadowRoot.getElementById('editProfilePic')
            const saveEditBtn = this.shadowRoot.getElementById('saveEditBtn')

            const menu = this.shadowRoot.querySelector('custom-popup')
                .querySelector('.dropdown-content')
            

            getUserData(uid)
                .then(data => {
                    username.innerText = data.displayName
                    fullName.innerText = data.name
                    bio.innerText = data.bio
                    
                    editName.value = data.name
                    editBio.value = data.bio
                    editUrl.value = data.url

                    if (data.url != '') {
                        link.href = data.url
                        link.innerText = data.url
                        this.shadowRoot.querySelector('.link')
                        .querySelector('i').style.display = 'block'
                    } else {
                        link.style.display = 'none'
                        this.shadowRoot.querySelector('.link')
                        .querySelector('i').style.display = 'none'
                    }
                    if (data.photoURL != null) {
                        defaultAvatar.style.display = 'none'
                        avatarContainers.forEach(l => {
                            l.src = data.photoURL
                            l.style.display = 'block'
                        })

                    } else {
                        defaultAvatar.style.display = 'block'
                        avatarContainers.forEach(l => {
                            l.style.display = 'none'
                        })
                    }
                })
                .catch(err => console.log(err))

            editProfileBtn.addEventListener('click', e => {
                popUpEditProfile.style.display = "block"
            })
            closePopUpBtn.addEventListener('click', e => {
                popUpEditProfile.style.display = "none"
            })

            saveEditBtn.addEventListener('click',e=>{
                console.log(editName.value);
                updateUserProfileData(
                    editProfilePic.src, editName.value, editBio.value, editUrl.value
                ).then(()=>{
                    closeCurrentTab().then(()=>{
                        openProfilePage()
                    })
                })
                .catch(err=>console.log(err))
            })

            makeCustomMenuItem(menu, "login", "Log out", () => {
                signOut().then(()=>{
                    toastr.success('Sign out successful!')
                    closeCurrentTab()
                })
            })
            makeCustomMenuItem(menu, "admin_panel_settings", "Account settings", () => { })
            makeCustomMenuItem(menu, "settings", "Settings", () => { })
        }


    }
}

window.customElements.define('profile-page', ProfilePage);
