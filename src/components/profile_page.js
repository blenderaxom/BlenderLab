const profilePage = document.createElement('template');
profilePage.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div id="page-container">
        <div id="profile-header">
            <div class="left-container">
                <div class="pic-container large">
                    <img src="#" alt="Avatar" class="avatar large profilepic">
                    <i id="defAvatar" class="avatar large fas fa-user"></i>
                </div>
            </div>
            <section class="right-container">
                <div class="right-top">
                    <h2 id="username"></h2>
                    <div id="edit-profile-btn" class="edit-button">
                        Edit Profile
                    </div>
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
                    <a href="#" id="user-link">www.youtube.com/c/mebman</a>
                </div>
            </section>
        </div>
        <div class="editProfilePopup">
            <div class="pop-up-card">
                <div class="pop-up-header">
                    <div>
                        <button id="closePopUpBtn" class="btn btn-icon"><i class="fas fa-times"></i></button>
                        <h1>Edit profile</h1>
                    </div>
                    <button class="btn btn-primary">Save</button>
                </div>
                <div class="pop-up-body">
                    <div class="profileEditContainer">
                        <div class="pic-container medium">
                            <img src="#" alt="Avatar" class="avatar medium profilepic">
                            <div class="changeDPContainer">
                                <button class="btn btn-icon btn-icon-secondary"><i class="far fa-image"></i></button>
                            </div>
                        </div>
                        <input title="Name" type="text" maxlength="50" placeholder="Name" required> 
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
        const username = this.shadowRoot.getElementById('username')
        const avatarContainers = this.shadowRoot.querySelectorAll('.profilepic')
        const defaultAvatar = this.shadowRoot.getElementById('defAvatar')
        const uid = this.getAttribute('uid')
        const popUpEditProfile = this.shadowRoot.querySelector('.editProfilePopup')
        const editProfileBtn = this.shadowRoot.getElementById('edit-profile-btn')
        const closePopUpBtn = this.shadowRoot.getElementById('closePopUpBtn')

        getUserData(uid)
            .then(data => {
                username.innerText = data.displayName
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
    }
}

window.customElements.define('profile-page', ProfilePage);