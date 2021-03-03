const userProfileBtn = document.createElement('template');
userProfileBtn.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div id="photoContainer">
        <img src="#" alt="Avatar" class="avatar mini" id="profilepic">
        <i class="avatar mini fas fa-user"></i>
        <div id="actionContainer">
            <span id="LoginSignupBtn">Login/Signup</span>
        </div>
    </div>
`

class UserProfileButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(userProfileBtn.content.cloneNode(true));
        this.shadowRoot.getElementById('profilepic').style.display = "none";
    }

    connectedCallback() {
        let loggedIn = null
        const textContainer = this.shadowRoot.getElementById('LoginSignupBtn')
        const avatar = this.shadowRoot.getElementById('profilepic')
        const defaultAvatar = this.shadowRoot.querySelector('i')
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                loggedIn = true;
                console.log('logged in...   ', user.displayName);
            } else {
                loggedIn = false;
                textContainer.innerText = 'Login/Signup';
                console.log('not logged in');
                defaultAvatar.style.display = "block"
                avatar.style.display = 'none'
            }
        });
        ObservableSlim.observe(userGlobal, function (changes) {
            textContainer.innerText = userGlobal.displayName
            if(userGlobal.photoURL!=undefined){
                avatar.src = userGlobal.photoURL
                avatar.style.display = 'block'
                defaultAvatar.style.display = "none"
            } else {
                defaultAvatar.style.display = "block"
                avatar.style.display = 'none'
            }
        });

        this.addEventListener('click', async (e) => {
            if (loggedIn == true) {
                var user = firebase.auth().currentUser
                var id = await addNewTab(user.displayName)

                const profilePage = document.createElement('profile-page')
                profilePage.setAttribute('uid',user.uid)
                profilePage.setAttribute('myId', id)
                profilePage.id = id
                profilePage.classList.add('tabcontent')
                document.getElementById('main-contents').appendChild(profilePage)
                setTabContent(id)
            } else {
                const loginPage = document.createElement('auth-page')
                document.getElementById('main-contents').appendChild(loginPage)
            }
        })
    }
}

window.customElements.define('user-profile-btn', UserProfileButton);