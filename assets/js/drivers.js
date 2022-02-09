// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import {
    getDatabase,
    ref,
    update,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
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

// Read data from firebase database drivers
const driversRef = ref(firebaseDatabase, "Users/Drivers/");
const tBody = document.getElementById("tBody");
onValue(driversRef, (snapshot) => {
    tBody.innerHTML = "";
    var verification = [];
    snapshot.forEach((drivers) => {
        verification.push(drivers.val().verification);
        // insert to table
        let tr = `
        <tr data-id = ${drivers.key}>
            <td id="number" class="text-center"></td>
            <td class="text-center"> ${drivers.val().name} </td>
            <td class="text-center"> ${drivers.val().email} </td>
            <td class="text-center"><p id="verificationAccount"> ${verification} </p></td>
            <td class="text-center"><i class="unverified fas fa-user-times text-white bg-danger rounded p-2" data-toggle="tooltip" title="Unverified"></i></td>
            <td class="text-center"><i class="verified fas fa-user-check text-white bg-success rounded p-2" data-toggle="tooltip" title="Verified"></i></td>
        </tr>
        `
        tBody.innerHTML += tr;
    })

    const verif = document.querySelectorAll("#verificationAccount");
    const number = document.querySelectorAll("#number");
    verification.forEach((e, i) => {
        // set number list
        number[i].innerHTML = i + 1;
        // check whether the driver account has been verified or not
        if (e) {
            verif[i].innerHTML = "Sudah terverifikasi";
            verif[i].setAttribute("class", "bg-gradient-success text-white text-center p-1 rounded-3 font-weight-bold");
        } else {
            verif[i].innerHTML = "Belum terverifikasi";
            verif[i].setAttribute("class", "bg-gradient-danger text-white text-center p-1 rounded-3 font-weight-bold");
        }
    })

    // add event click for icon button unverified
    const unverified = document.querySelectorAll(".unverified");
    unverified.forEach((unverified) => {
        unverified.addEventListener("click", () => {
            const driverId = unverified.parentElement.parentElement.dataset.id;
            update(ref(firebaseDatabase, "Users/Drivers/" + driverId), {
                verification: false
            })
        })
    })

    // add event click for icon button verified
    const verified = document.querySelectorAll(".verified");
    verified.forEach((verified) => {
        verified.addEventListener("click", () => {
            const driverId = verified.parentElement.parentElement.dataset.id;
            update(ref(firebaseDatabase, "Users/Drivers/" + driverId), {
                verification: true
            })
        })
    })
})