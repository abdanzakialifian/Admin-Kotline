import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import {
    getDatabase,
    ref,
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

const username = document.getElementById("inputUsername");
const password = document.getElementById("inputPassword");
const keepLoggedIn = document.getElementById("keepLoggedIn");
const btnSignIn = document.getElementById("btnSignIn");

function authenticateAdmin() {
    const dbRef = ref(firebaseDatabase);

    // get data firebase admin
    get(child(dbRef, "Users/Admin/" + username.value)).then((snapshot) => {
        if (snapshot.exists()) {
            let dbPass = decrypPassword(snapshot.val().password);
            if (dbPass == password.value) {
                login(snapshot.val());
            }

        } else {
            Swal.fire({
                title: "Gagal",
                text: "Akun belum terdaftar! Silahkan registrasi terlebih dahulu agar dapat masuk ke halaman utama.",
                icon: "error",
                confirmButtonColor: "#FF3333"
            }).then(() => {
                username.value = "";
                password.value = "";
                keepLoggedIn.checked = false;
            })
        }
    });
}

function decrypPassword(dbPass) {
    var pass = CryptoJS.AES.decrypt(dbPass, password.value);
    return pass.toString(CryptoJS.enc.Utf8);
}

function login(admin) {
    if (keepLoggedIn.checked) {
        localStorage.setItem("keepLoggedIn", "yes");
        localStorage.setItem("admin", JSON.stringify(admin));
        window.location = "pages/dashboard.html"
    } else {
        sessionStorage.setItem("admin", JSON.stringify(admin));
        window.location = "pages/dashboard.html"
    }
}

btnSignIn.addEventListener("click", authenticateAdmin);