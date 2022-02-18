// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue,
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

// get id admin name
let adminName = document.getElementById("adminName");
// get id button sign out
let btnSignOut = document.getElementById("signOut");

var currentUser = null;

// function to get username
function getUsername() {
    let keepLoggedIn = localStorage.getItem("keepLoggedIn");

    if (keepLoggedIn == "yes") {
        currentUser = JSON.parse(localStorage.getItem("admin"));
    } else {
        currentUser = JSON.parse(sessionStorage.getItem("admin"));
    }
}

// funtion for logout
function signOutAdmin() {
    sessionStorage.removeItem("admin");
    localStorage.removeItem("admin");
    localStorage.removeItem("keepLoggedIn");
    window.location = "../index.html";
}

// adding event click for button sign out
btnSignOut.addEventListener("click", () => {
    Swal.fire({
        title: "Keluar?",
        text: "Apakah kamu yakin ingin keluar dari akun ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF3333",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Keluar",
        cancelButtonText: "Batal"
    }).then((result) => { // button keluar clicked
        if (result.isConfirmed) {
            signOutAdmin();
        }
    })
})

// read data firebase database history angkutan A
const historyRefA = ref(firebaseDatabase, "History/A");
const totalUsersA = [];
onValue(historyRefA, (snapshot) => {
    snapshot.forEach((e) => {
        totalUsersA.push(e.val());
    })

    const cardA = document.getElementById("angkutanA");
    if (totalUsersA.length == 0) {
        cardA.innerHTML = "0 Orang";
    } else {
        cardA.innerHTML = `${totalUsersA.length} Orang`;
    }
})

// read data firebase database history angkutan B
const historyRefB = ref(firebaseDatabase, "History/B");
const totalUsersB = [];
onValue(historyRefB, (snapshot) => {
    snapshot.forEach((e) => {
        totalUsersB.push(e.val());
    })

    const cardB = document.getElementById("angkutanB");
    if (totalUsersB.length == 0) {
        cardB.innerHTML = "0 Orang";
    } else {
        cardB.innerHTML = `${totalUsersB.length} Orang`;
    }
})

// read data firebase database history angkutan C
const historyRefC = ref(firebaseDatabase, "History/C");
const totalUsersC = [];
onValue(historyRefC, (snapshot) => {
    snapshot.forEach((e) => {
        totalUsersC.push(e.val());
    })

    const cardC = document.getElementById("angkutanC");
    if (totalUsersC.length == 0) {
        cardC.innerHTML = "0 Orang";
    } else {
        cardC.innerHTML = `${totalUsersC.length} Orang`;
    }
})

// read data firebase database history angkutan D
const historyRefD = ref(firebaseDatabase, "History/D");
const totalUsersD = [];
onValue(historyRefD, (snapshot) => {
    snapshot.forEach((e) => {
        totalUsersD.push(e.val());
    })

    const cardD = document.getElementById("angkutanD");
    if (totalUsersD == 0) {
        cardD.innerHTML = "0 Orang";
    } else {
        cardD.innerHTML = `${totalUsersD.length} Orang`;
    }
})

// read data firebase database history all angkutan
const historyRef = ref(firebaseDatabase, "History");
const cardTotalUsers = document.getElementById("angkutan");
onValue(historyRef, (snapshot) => {
    const totalUsers = []
    snapshot.forEach((e) => {
        e.forEach((total) => {
            totalUsers.push(total.val())
        })
    })

    if (totalUsers == 0) {
        cardTotalUsers.innerHTML = "0 Orang";
    } else {
        cardTotalUsers.innerHTML = `${totalUsers.length} Orang`;
    }
})

// load data
window.onload = function () {
    getUsername();
    if (currentUser == null) {
        window.location.href = "../index.html";
    } else {
        adminName.innerHTML = currentUser.name;
    }
}