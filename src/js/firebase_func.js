const config = async () => {
    var e = await BL.getFirebaseConfigs()
    firebase.initializeApp(e);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user);
        } else {
            // No user is signed in.
        }
    });
}

config()

const loginWithEmailPassword = (email, password) => new Promise((resolve,reject)=>{
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            return resolve(user)
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            return reject(error)
        });
}) 

const signUpWithEmailPassword = (email, password, username) => new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            user.updateProfile({
                displayName: username,
            }).then(function () {
                return resolve(user)
            }).catch(function (error) {
                return reject(error)
            });
            // ...
        })
        .catch((error) => {
            return reject(error)
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });

}) 