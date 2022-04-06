import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    update,
    remove,
    child,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";
import {
    getStorage,
    ref as sRef,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-storage.js";
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

// get id tBody
const tBody = document.getElementById("tBody");
// get id selected dropdown
const getIdInputSelectedTrayek = document.getElementById("inputSelectedTrayek");
// get id input tarif
const getIdInputFares = document.getElementById("inputFares");
// get id input ngetem
const getIdInputNgetem = document.getElementById("inputNgetem");
// get id input route
const getIdInputRoute = document.getElementById("inputRoute");
// get id input latitude
const getIdInputLatitude = document.getElementById("inputLatitude");
// get id input longitude
const getIdInputLongitude = document.getElementById("inputLongitude");
// get id input description
const getIdInputDescription = document.getElementById("inputDescription");
// get id admin name
let adminName = document.getElementById("adminName");
// get id button add
const btnAdd = document.getElementById("btnAdd");
// get id button cancel adding
const btnCancelAdd = document.getElementById("btnCancelAdd");
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
let btnUpdateProfile = document.getElementById("btnUpdateProfile");
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
btnUpdateProfile.onclick = uploadProcess;

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

// add event click to button add
btnAdd.addEventListener("click", () => {
    // get value form selected dropdown
    const valueTrayek = getIdInputSelectedTrayek.options[getIdInputSelectedTrayek.selectedIndex].value;

    // call function write data database trayek
    addDataTrayek(valueTrayek, getIdInputFares.value, getIdInputNgetem.value, getIdInputRoute.value, getIdInputLatitude.value, getIdInputLongitude.value, getIdInputDescription.value);
});

// add event click to button cancel add
btnCancelAdd.addEventListener("click", () => {
    getIdInputSelectedTrayek.value = "trayek";
    getIdInputFares.value = "";
    getIdInputNgetem.value = "";
    getIdInputRoute.value = "";
    getIdInputLatitude.value = "";
    getIdInputLongitude.value = "";
    getIdInputDescription.value = "";
});

// Write data to firebase database trayek
function addDataTrayek(trayek, fares, ngetemLocation, routeTransport, ngetemLatitude, ngetemLongitude, descriptionTransport) {
    const db = firebaseDatabase;
    set(ref(db, 'Trayek/' + trayek), {
        fares: fares,
        ngetemLocation: ngetemLocation,
        routeTransport: routeTransport,
        ngetemLatitude: ngetemLatitude,
        ngetemLongitude: ngetemLongitude,
        descriptionTransport: descriptionTransport
    }).then(() => { // add success
        Swal.fire({
            title: "Berhasil",
            text: "Berhasil menambahkan data!",
            icon: "success",
            confirmButtonColor: "#4BB543"
        }).then(function () { // button ok clicked
            // reset input
            getIdInputSelectedTrayek.value = "trayek";
            getIdInputFares.value = "";
            getIdInputNgetem.value = "";
            getIdInputRoute.value = "";
            getIdInputLatitude.value = "";
            getIdInputLongitude.value = "";
            getIdInputDescription.value = "";
        })
    }).catch(() => { // add failed
        Swal.fire({
            title: "Gagal",
            text: "Gagal menambahkan data!",
            icon: "error",
            confirmButtonColor: "#FF3333"
        }).then(function () { // button ok clicked
            // reset input
            getIdInputSelectedTrayek.value = "trayek";
            getIdInputFares.value = "";
            getIdInputNgetem.value = "";
            getIdInputRoute.value = "";
            getIdInputLatitude.value = "";
            getIdInputLongitude.value = "";
            getIdInputDescription.value = "";
        })
    });
}

// Read data from firebase database trayek
const trayekRef = ref(firebaseDatabase, "Trayek");
// get data trayek real-time
onValue(trayekRef, (snapshot) => {
    tBody.innerHTML = "";
    snapshot.forEach((trayek) => {
        let tr = `
        <tr data-id = ${trayek.key}>
            <td class="text-center">${trayek.key}</td>
            <td class="text-center">${trayek.val().fares}</td>
            <td class="text-center">${trayek.val().ngetemLocation}</td>
            <td class="text-center">${trayek.val().routeTransport}</td>
            <td class="text-center">${trayek.val().ngetemLatitude}</td>
            <td class="text-center">${trayek.val().ngetemLongitude}</td>
            <td class="text-center">${trayek.val().descriptionTransport}</td>
            <td class="text-center" data-bs-toggle="modal" data-bs-target="#updateModalTrayek"><i class="edit fas fa-edit bg-primary p-2 text-white rounded data-toggle="tooltip" title="Edit""></i></td>
            <td class="text-center"><i class="delete fas fa-trash-alt bg bg-danger p-2 text-white rounded data-toggle="tooltip" title="Delete""></i></td>
        </tr>
        `
        // add data to tBody
        tBody.innerHTML += tr;
    })

    // get id update trayek
    const getIdUpdateTrayek = document.getElementById("updateTrayek");
    // get id update tarif
    const getIdUpdateFares = document.getElementById("updateFares");
    // get id update ngetem
    const getIdUpdateNgetem = document.getElementById("updateNgetem");
    // get id update route
    const getIdUpdateRoute = document.getElementById("updateRoute");
    // get id update latitude
    const getIdUpdateLatitude = document.getElementById("updateLatitude");
    // get id update longitude
    const getIdUpdateLongitude = document.getElementById("updateLongitude");
    // get id update description
    const getIdUpdateDescription = document.getElementById("updateDescription");
    // get id button update
    const btnUpdate = document.getElementById("btnUpdate");
    // get all id button edit
    const editButtons = document.querySelectorAll(".edit");
    // get all id button delete
    const deleteButtons = document.querySelectorAll(".delete");


    // add event click to all buttons edit by id
    editButtons.forEach((edit) => {
        edit.addEventListener("click", () => {
            let trayekId = edit.parentElement.parentElement.dataset.id;
            getDataTrayek(trayekId);
        })
    })

    function getDataTrayek(trayekId) {
        // get data trayek
        get(child(ref(firebaseDatabase), "Trayek/" + trayekId)).then((snapshot => {
            if (snapshot.exists()) {
                // add value from trayek id
                getIdUpdateTrayek.value = trayekId;
                // add value form fares
                getIdUpdateFares.value = snapshot.val().fares;
                // add value form ngetem location
                getIdUpdateNgetem.value = snapshot.val().ngetemLocation;
                // add value form route transport
                getIdUpdateRoute.value = snapshot.val().routeTransport;
                // add value form ngetem latitude
                getIdUpdateLatitude.value = snapshot.val().ngetemLatitude;
                // add value form ngetem longitude
                getIdUpdateLongitude.value = snapshot.val().ngetemLongitude;
                // add value form description transport
                getIdUpdateDescription.value = snapshot.val().descriptionTransport;
            }
        }))
    }

    // add event click to button update
    btnUpdate.addEventListener("click", () => {
        // update data trayek by id
        update(ref(firebaseDatabase, "Trayek/" + getIdUpdateTrayek.value), {
            fares: getIdUpdateFares.value,
            ngetemLocation: getIdUpdateNgetem.value,
            routeTransport: getIdUpdateRoute.value,
            ngetemLatitude: getIdUpdateLatitude.value,
            ngetemLongitude: getIdUpdateLongitude.value,
            descriptionTransport: getIdUpdateDescription.value
        }).then(() => { // update success
            Swal.fire({
                title: "Berhasil",
                text: "Berhasil mengedit data!",
                icon: "success",
                confirmButtonColor: "#4BB543"
            }).then(function () { // button ok clicked
                // reset input
                getIdUpdateTrayek.value = "";
                getIdUpdateFares.value = "";
                getIdUpdateNgetem.value = "";
                getIdUpdateRoute.value = "";
                getIdUpdateLatitude.value = "";
                getIdUpdateLongitude.value = "";
                getIdUpdateDescription.value = "";
            })
        }).catch(() => { // update failed
            Swal.fire({
                title: "Gagal",
                text: "Gagal mengedit data!",
                icon: "error",
                confirmButtonColor: "#FF3333"
            }).then(function () { // button ok clicked
                // reset input
                getIdUpdateTrayek.value = "";
                getIdUpdateFares.value = "";
                getIdUpdateNgetem.value = "";
                getIdUpdateRoute.value = "";
                getIdUpdateLatitude.value = "";
                getIdUpdateLongitude.value = "";
                getIdUpdateDescription.value = "";
            })
        })
    })

    // add event click to all buttons delete
    deleteButtons.forEach((deleted) => {
        deleted.addEventListener("click", () => {
            const trayekId = deleted.parentElement.parentElement.dataset.id;
            // alert confirm
            Swal.fire({
                title: "Apakah anda yakin?",
                text: "Anda tidak akan dapat mengembalikan ini!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#FF3333",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Hapus",
                cancelButtonText: "Batal"
            }).then((result) => {
                if (result.isConfirmed) {
                    // delete data trayek
                    remove(ref(firebaseDatabase, "Trayek/" + trayekId))
                        .then(() => { // delete success
                            Swal.fire({
                                title: "Berhasil",
                                text: "Berhasil menghapus data!",
                                icon: "success",
                                confirmButtonColor: "#4BB543"
                            })
                        }).catch(() => { // delete failed
                            Swal.fire({
                                title: "Gagal",
                                text: "Gagal menghapus data!",
                                icon: "error",
                                confirmButtonColor: "#FF3333"
                            })
                        })
                }
            })
        })
    })
})

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