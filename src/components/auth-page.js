const authPage = document.createElement('template');
authPage.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <div id="authPagebg">
        <div class="loader"></div>
    
        <div class="formbg">
            <div id="form-selector">
                <button class="btn active-btn" id="loginFormSelBtn">Login</button>
                <button class="btn" id="signupFormSelBtn">SignUp</button>
            </div>
            <div id="formHolder">
                <form id="loginForm">
                    <input id="loginEmail" placeholder="email" type="email" required>
                    <input id="loginPassword" placeholder="password" type="password" required>
                    
                    <button type="submit" class="btn btn-primary btn-large block-tab" id="loginBtn">
                        <div id="login-loader" class="loader mini"></div>
                    </button>
                </form>
                <form id="signupForm">
                    <input id="signupUsername" placeholder="username" type="text" required>
                    <input id="signupEmail" placeholder="email" type="email" required>
                    <input id="signupPassword" placeholder="password" type="password" required>
                    <button type="submit" class="btn btn-primary btn-large block-tab" id="signUpBtn">
                        <div id="signup-loader" class="loader mini"></div>
                    </button>
                </form>
            </div>
            
            <button class="btn btn-outline" id="backBtn"><i class="material-icons md-18">arrow_back_ios</i> Back</button
        </div>
    </div> 
`


class AuthPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(authPage.content.cloneNode(true));
        this.shadowRoot.querySelector('.formbg').style.opacity = '0';
    }
    connectedCallback() {
        const shad = this
        const formBg = this.shadowRoot.querySelector('.formbg')
        const loader = this.shadowRoot.querySelector('.loader')
        setTimeout(()=>{
            formBg.style.opacity = '100%';
            loader.remove()
        },200)

        var loginFormSelector = this.shadowRoot.getElementById('loginFormSelBtn')
        var signUpFormSelector = this.shadowRoot.getElementById('signupFormSelBtn')
        var backBtn = this.shadowRoot.getElementById('backBtn')
        var loginBtn = this.shadowRoot.getElementById('loginBtn')
        var loginloader = this.shadowRoot.getElementById('login-loader')
        var signupBtn = this.shadowRoot.getElementById('signUpBtn')
        var signuploader = this.shadowRoot.getElementById('signup-loader')
        var loginForm = this.shadowRoot.getElementById('loginForm')
        var signupForm = this.shadowRoot.getElementById('signupForm')

        const formController = this.shadowRoot.getElementById("formHolder")
        const loginEmailInput = this.shadowRoot.getElementById('loginEmail')
        const loginPasswordInput = this.shadowRoot.getElementById('loginPassword')
        const signupPasswordInput = this.shadowRoot.getElementById('signupPassword')
        const signupEmailInput = this.shadowRoot.getElementById('signupEmail')
        const signupUsernameInput = this.shadowRoot.getElementById('signupUsername')
        
        loginBtn.innerText = 'Login'
        signupBtn.innerText = 'Sign Up'

        signUpFormSelector.onclick = e => {
            formController.style.transform = "translate(-180px,0)"
            loginFormSelector.classList.remove('active-btn')
            signUpFormSelector.classList.add('active-btn')
        }
        loginFormSelector.onclick = e => {
            formController.style.transform = "translate(180px,0)"
            loginFormSelector.classList.add('active-btn')
            signUpFormSelector.classList.remove('active-btn')
        }

        backBtn.onclick = () => this.remove()

        loginForm.addEventListener('submit', (e)=>{
            e.preventDefault()
            loginBtn.disabled = true
            loginBtn.innerText = ''
            showLoader(loginBtn, 'login-loader')
            loginWithEmailPassword(loginEmailInput.value, loginPasswordInput.value)
            .then(res=>{
                loginBtn.disabled = false
                console.log('logged successfully');
                console.log(res);
                loginBtn.innerText = 'Login'
                removeLoader(this.shadowRoot,'login-loader')
                this.remove()
                toastr.success(`Hi ${res.displayName}, Welcome back!`,'Login Successful')
            }).catch(err=>{
                loginBtn.disabled = false
                toastr.error(`Ooh, ${err.code}`)
                console.log(err);
                loginBtn.innerText = 'Login'
                removeLoader(this.shadowRoot,'login-loader')
            })
        })
        
        signupForm.addEventListener('submit', e => {
            e.preventDefault()
            signupBtn.innerText = ''
            signupBtn.disabled= true;
            showLoader(signupBtn, 'signin-loader')
            signUpWithEmailPassword(
                signupEmailInput.value,
                signupPasswordInput.value,
                signupUsernameInput.value
            ).then(res=>{
                console.log('signed up successfully');
                console.log(res);
                res.sendEmailVerification()
                .then(function() {
                    toastr.info(`Verification email sent!`)
                    console.log('verification email sent');
                    var verifPage = document.createElement('verification-page')
                    document.body.append(verifPage)
                    signupBtn.innerText = 'Sign Up'
                    signupBtn.disabled= false;
                    removeLoader('signin-loader')
                    shad.remove()
                })
                .catch(function(error) {
                    console.log(error);
                });
                
            }).catch(err=>{
                console.log(err);
                signupBtn.innerText = 'Sign Up'
                signupBtn.disabled= false;
                removeLoader('signin-loader')
            })
        })

        this.shadowRoot.querySelectorAll(".block-tab").forEach(l=>{
            l.addEventListener('keydown',(e)=>{
                if (e.key == "Tab") e.preventDefault();
            })
        })
    }
}

window.customElements.define('auth-page', AuthPage);