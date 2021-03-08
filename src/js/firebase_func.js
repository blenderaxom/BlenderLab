let db;
let storage;
var userData = {};
let userGlobal = ObservableSlim.create(userData, true, function (changes) { });

let unListenProfileData = () => { };
const config = async () => {
    var e = await BL.getFirebaseConfigs()
    firebase.initializeApp(e);
    db = firebase.firestore();
    storage = firebase.storage();
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
            var photoURL = "https://raw.githubusercontent.com/bordoloicorp/blenderDownloads/main/default-user-icon-4.png"
            user.updateProfile({
                displayName: username,
                photoURL: photoURL
            }).then(function () {
                return resolve(user)
            }).catch(function (error) {
                return reject(error)
            });
            db.collection("users").doc(user.uid).set({
                displayName: username,
                email: email,
                photoURL: photoURL,
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
    
    const profilePage = document.createElement('profile-page')
    profilePage.setAttribute('uid', user.uid)
    addTab(user.displayName,profilePage)
}

const uploadFileToStorage = (folder,file,filename)=> new Promise((resolve,reject)=>{
    var storageRef = storage.ref()
    var uploadTask = storageRef.child(`${folder}/${filename}`).put(file);
    console.log(file);
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            return reject(error)
        },
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                return resolve(downloadURL)
            });
        }
    );
})


const uploadImageFromFile = (file) => new Promise(async(resolve,reject)=>{
    var id = await BL.getUniqueId()
    uploadFileToStorage('raw-images',file, `${id}.png`)
    .then(link=>{return resolve(link)})
    .catch(err=>{return reject(err)})
})

const uploadImageFromUrl = (url) => new Promise(async (resolve,reject)=>{
    var id = await BL.getUniqueId()
    let response = await fetch(url);
    let data = await response.blob();
    let file = new File([data], `${id}.png`);

    uploadFileToStorage('raw-images',file, `${id}.png`)
    .then(link=>{return resolve(link)})
    .catch(err=>{return reject(err)})
})

