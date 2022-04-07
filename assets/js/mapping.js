import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    child,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";
import {
    getStorage,
    ref as sRef,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-storage.js";

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

var map = L.map('map').setView([-7.447390, 109.553857], 12);

// get id admin name
let adminName = document.getElementById("adminName");
// get id button sign out
let btnSignOut = document.getElementById("signOut");
// get id edit profile
let editProfile = document.getElementById("editProfile");
// get id edit image
let editImage = document.getElementById("editImage");
// get id image profile
var imageProfile = document.getElementById("imageProfile");
// get id edit name
let editName = document.getElementById("editName");
// get id progress
let progressText = document.getElementById("progress");
// get id update
let btnUpdate = document.getElementById("btnUpdate");
// get id modal update
let imageProfiles = document.getElementById("imageProfiles");
// create element
var input = document.createElement("input");

var currentUser = null;
var extName = "";
var fileName = "";
var files = [];
var reader = new FileReader();

input.type = "file";
input.onchange = e => {
    files = e.target.files;

    extName = GetFileExt(files[0]);
    fileName = GetFileName(files[0]);

    reader.readAsDataURL(files[0]);
}

reader.onload = function () {
    imageProfile.src = reader.result;
}

editImage.addEventListener("click", () => {
    input.click();
})

function GetFileExt(file) {
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length - 1), (temp.length));
    return '.' + ext[0];
}

function GetFileName(file) {
    var temp = file.name.split('.');
    var fName = temp.slice(0, -1).join('.');
    return fName;
}

async function uploadProcess() {
    var imgUpload = files[0];

    var imageName = fileName + extName;

    const metaData = {
        contentType: imgUpload.type
    }

    const storage = getStorage();
    const storageRef = sRef(storage, "Images/" + imageName);

    const uploadTask = uploadBytesResumable(storageRef, imgUpload, metaData);

    uploadTask.on('state-changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressText.innerHTML = "Upload " + parseInt(progress) + "%";
        if (parseInt(progress) == 100) {
            progressText.innerHTML = "";
        }
    }, () => {}, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateDataUser(downloadURL);
        });
    });
}

// function to update data user
function updateDataUser(url) {
    update(ref(firebaseDatabase, "Users/Admin/" + currentUser.username), {
        name: editName.value,
        imageProfile: url
    }).then(() => {
        Swal.fire({
            title: "Berhasil",
            text: "Berhasil mengupdate data!",
            icon: "success",
            confirmButtonColor: "#4BB543"
        })
    }).catch(() => {
        Swal.fire({
            title: "Gagal",
            text: "Gagal mengupdate data!",
            icon: "error",
            confirmButtonColor: "#FF3333"
        })
    })

    getDataUser();
}

// add event to button update
btnUpdate.onclick = uploadProcess;

// get data user 
function getDataUser() {
    var userRef = ref(firebaseDatabase, "Users/Admin/" + currentUser.username);
    onValue(userRef, (snapshot) => {
        editName.value = snapshot.val().name;
        adminName.innerHTML = snapshot.val().name;
        if (snapshot.val().imageProfile == null) {
            imageProfile.src = "../assets/img/default-profile.jpg"
            imageProfiles.src = "../assets/img/default-profile.jpg"
        } else {
            imageProfiles.src = snapshot.val().imageProfile;
            imageProfile.src = snapshot.val().imageProfile;
        }
    })
}

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

L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 20,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);


if (!navigator.geolocation) {
    console.log("Your browser doesn't support geolocation feature!");
} else {
    setInterval(() => {
        map.eachLayer((layer) => {
            if (layer['_latlng'] != undefined) {
                layer.remove()
            }
        })
        getPositonCustomers()
        getPositionDrivers()
    }, 5000)
}

function getPositonCustomers() {
    get(child(ref(firebaseDatabase), "CustomersPosition")).then((snapshot => {
        if (snapshot.exists()) {

            let customerIcon = L.icon({
                iconUrl: '../assets/img/icon-person.png',
                iconSize: [35, 35]
            })

            snapshot.forEach((e) => {

                let lat = e.val().l[0];
                let long = e.val().l[1];

                get(child(ref(firebaseDatabase), "Users/Customers/" + e.key)).then((snapshot) => {
                    if (snapshot.exists()) {

                        let name = snapshot.val().name

                        L.marker([lat, long], {
                            icon: customerIcon
                        }).addTo(map).bindPopup(name).openPopup();
                    }
                })
            })
        }
    }))
}

function getPositionDrivers() {
    get(child(ref(firebaseDatabase), "DriversAvailable")).then((snapshot => {
        if (snapshot.exists()) {

            let driverIcon = L.icon({
                iconUrl: '../assets/img/icon-car.png',
                iconSize: [35, 35]
            })

            snapshot.forEach((e) => {

                let lat = e.val().l[0];
                let long = e.val().l[1];

                get(child(ref(firebaseDatabase), "Users/Drivers/" + e.key)).then((snapshot) => {
                    if (snapshot.exists()) {

                        let numberTransportation = snapshot.val().numberTransportation

                        L.marker([lat, long], {
                            icon: driverIcon
                        }).addTo(map).bindPopup(numberTransportation).openPopup();
                    }
                })
            })
        }
    }))
}

// load data
window.onload = function () {
    getUsername();
    if (currentUser == null) {
        window.location.href = "../index.html";
    } else {
        getDataUser();
    }
}

editProfile.addEventListener("click", () => {
    if (currentUser == null) {
        window.location.href = "../index.html";
    } else {
        getDataUser();
    }
})