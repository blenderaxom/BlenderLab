const userProfileBtn = document.createElement('template');
userProfileBtn.innerHTML =
`
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div id="photoContainer">
        <i class="fas fa-user"></i>
        <div id="actionContainer">
            <span id="LoginSignupBtn" class="btn btn-tertiary">Login/Signup</span>
        </div>
    </div>
`

class UserProfileButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(userProfileBtn.content.cloneNode(true));
    }

    connectedCallback() {
        this.addEventListener('click', (e)=>{
            const loginPage = document.createElement('auth-page')
            document.getElementById('main-contents').appendChild(loginPage)
        })
    }
}

window.customElements.define('user-profile-btn', UserProfileButton);