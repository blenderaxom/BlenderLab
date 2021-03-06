let db;
var userData = {};
let userGlobal = ObservableSlim.create(userData, true, function (changes) { });

let unListenProfileData = () => { };
const config = async () => {
    var e = await BL.getFirebaseConfigs()
    firebase.initializeApp(e);
    db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
        unListenProfileData()
        if (user) {
            unListenProfileData = db.collection("users").doc(user.uid)
                .onSnapshot((doc) => {
                    console.log("Current data: ", doc.data());
                    if (doc.data() != undefined) {
                        userGlobal.displayName = doc.data().displayName
                        userGlobal.email = doc.data().email
                        userGlobal.photoURL = doc.data().photoURL
                    }

                });
        } else {
        }
    });
}

config()

const loginWithEmailPassword = (email, password) => new Promise((resolve, reject) => {
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
                photoURL: "https://raw.githubusercontent.com/bordoloicorp/blenderDownloads/main/default-user-icon-4.png"
            }).then(function () {
                return resolve(user)
            }).catch(function (error) {
                return reject(error)
            });
            db.collection("users").doc(user.uid).set({
                displayName: username,
                email: email,
                photoURL: "https://raw.githubusercontent.com/bordoloicorp/blenderDownloads/main/default-user-icon-4.png",
                name: '',
                bio: '',
                url: ''
            })
            // ...
        })
        .catch((error) => {
            return reject(error)
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });

})

const deleteUser = () => new Promise((resolve, reject) => {
    var user = firebase.auth().currentUser
    unListenProfileData()
    db.collection("users").doc(user.uid).delete().then(() => {
        console.log("User doc successfully deleted!");
        user.delete().then(function () {
            console.log('User deleted');
            return resolve(true)
        }).catch(function (error) {
            return reject(error)
        });
    }).catch((error) => {
        return reject(error)
    });
})

const getUserData = (uid) => new Promise((resolve, reject) => {
    var docRef = db.collection("users").doc(uid);

    docRef.get().then((doc) => {
        if (doc.exists) {
            return resolve(doc.data())
        } else {

            return reject('No user found')
        }
    }).catch((error) => {
        return reject(error)
    });
})

const updateUserProfileData = (photoUrl, name, bio, url) => new Promise((resolve, reject) => {
    var user = firebase.auth().currentUser
    user.updateProfile({
        photoURL: photoUrl
    })
    db.collection("users").doc(user.uid).set({
        photoURL: photoUrl,
        name: name,
        bio: bio,
        url: url
    }, { merge: true }).then(() => { return resolve() })
        .catch(err => { return reject(err) })
})

const signOut = () => new Promise((resolve, reject) => {
    firebase.auth().signOut().then(() => {
        return resolve()
    }).catch((error) => {
        return reject(error)
    });
})

async function openProfilePage() {
    var user = firebase.auth().currentUser
    var id = await addNewTab(user.displayName)

    const profilePage = document.createElement('profile-page')
    profilePage.setAttribute('uid', user.uid)
    profilePage.setAttribute('myId', id)
    profilePage.id = id
    profilePage.classList.add('tabcontent')
    document.getElementById('main-contents').appendChild(profilePage)
    setTabContent(id)
}


