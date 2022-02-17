import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    child,
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBZRi24fGE6-MEBRGEIkO17-Za6CziKA_Q",
    authDomain: "kotline-app.firebaseapp.com",
    databaseURL: "https://kotline-app-default-rtdb.firebaseio.com",
    projectId: "kotline-app",
    storageBucket: "kotline-app.appspot.com",
    messagingSenderId: "909422598945",
    appId: "1:909422598945:web:9cddc8b8023792b2173c60",
    measurementId: "G-PJMG5SYW9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseDatabase = getDatabase(app);

// get id input name
const name = document.getElementById("inputName");
// get id input username
const username = document.getElementById("inputUsername");
// get id input email
const email = document.getElementById("inputEmail");
// get id input password
const password = document.getElementById("inputPassword");
// get id input check
const checkTerms = document.getElementById("flexCheckDefault");
// get id button sign up
const btnSignUp = document.getElementById("signUp");

// function to validate name, username, and email
function validation() {
    let nameRegex = /^[a-zA-Z\s]+$/;
    let usernameRegex = /^[a-zA-Z0-9]{5,}$/;
    let emailRegex = /^[a-zA-Z0-9]+@(gmail|yahoo|outlook)\.com$/;

    // message if name not valid
    if (!nameRegex.test(name.value)) {
        Swal.fire({
            icon: "error",
            title: "Nama tidak valid!",
            showConfirmButton: false,
            timer: 1500
        })
        return false;
    }

    // message if username not valid
    if (!usernameRegex.test(username.value)) {
        Swal.fire({
            icon: "error",
            title: "Username tidak valid!",
            showConfirmButton: false,
            timer: 1500
        })
        return false;
    }

    // message if email not valid
    if (!emailRegex.test(email.value)) {
        Swal.fire({
            icon: "error",
            title: "Email tidak valid!",
            showConfirmButton: false,
            timer: 1500
        })
        return false;
    }

    return true;
}

function registerUser() {
    if (!validation()) {
        return;
    }

    const dbRef = ref(firebaseDatabase);

    // get data firebase admin
    get(child(dbRef, "Users/Admin/" + username.value)).then((snapshot) => {
        if (snapshot.exists()) {
            Swal.fire({
                title: "Coba Lagi",
                text: "Username sudah ada!",
                icon: "warning",
                confirmButtonColor: "#F76E11"
            })
        } else {
            // add to firebase database admin
            set(ref(firebaseDatabase, "Users/Admin/" + username.value), {
                name: name.value,
                username: username.value,
                email: email.value,
                password: encrypPassword()
            }).then(() => { // adding success
                Swal.fire({
                    title: "Berhasil",
                    text: "Berhasil mendaftar! Silahkan login untuk masuk ke halaman utama.",
                    icon: "success",
                    confirmButtonColor: "#4BB543"
                }).then(function () { // button ok in modal clicked
                    window.location.href = "http://127.0.0.1:5500/index.html";
                    name.value = "";
                    username.value = "";
                    email.value = "";
                    password.value = "";
                    checkTerms.checked = false;
                });
            }).catch(() => { // adding failed
                Swal.fire({
                    title: "Gagal",
                    text: "Gagal mendaftarkan akun!",
                    icon: "error",
                    confirmButtonColor: "#FF3333"
                })
            })
        }
    });
}

// function to encryption password
function encrypPassword() {
    var pass = CryptoJS.AES.encrypt(password.value, password.value);
    return pass.toString();
}

// add event click for button sign up
btnSignUp.addEventListener("click", registerUser);