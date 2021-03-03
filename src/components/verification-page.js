const veriPage = document.createElement('template');
veriPage.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <link href="../css/all.css" rel="stylesheet">
    <div id="verBg">
        <div class="pagebg">
            <h1>Please verify your email</h1>
            <h3>We have sent you a verification email with a link. Please click on that link to verify.</h3>
            <a id="resendBtn" href="#">Resend Verification Email</a>
            <div class="loader"></div>

            <button class="btn btn-tertiary" id="cancelBtn"><i class="fas fa-times"></i> Cancel</button
        </div>
    </div> 
`


class VerificationPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(veriPage.content.cloneNode(true));
    }
    connectedCallback() {
        const shad = this
        const cancelBtn = this.shadowRoot.getElementById('cancelBtn')
        const resendBtn = this.shadowRoot.getElementById('resendBtn')

        var interval;

        interval = setInterval(() => {
            var user = firebase.auth().currentUser;

            user.reload()

            if (user.emailVerified == true) {
                console.log(user.emailVerified);
                clearInterval(interval)
                console.log('email verified');
                shad.remove()
                toastr.success(`Email Verified!`, `Welcome ${user.displayName}!`)
            }
        }, 1000)

        cancelBtn.addEventListener('click', (e) => {
            deleteUser()
                .then(() => {
                    clearInterval(interval)
                    shad.remove();
                    toastr.info('Sign Up Cancelled!')
                })
                .catch(err => {
                    clearInterval(interval)
                    toastr.info('Couldn\'t cancel, Please try again!')
                    console.log(err)
                })
        })
        resendBtn.addEventListener('click', () => {
            const user = firebase.auth().currentUser
            if (user != null) {
                user.sendEmailVerification().then(function () {
                    toastr.info('Verification email sent!')
                }).catch(function (error) {
                    console.log(error);
                    toastr.error("Oops! couldn't send. Please try again!")
                });
            }
        })
    }
}

window.customElements.define('verification-page', VerificationPage);