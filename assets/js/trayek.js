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
// get id button add
const btnAdd = document.getElementById("btnAdd");

// add event click to button add
btnAdd.addEventListener("click", () => {
    // get value form selected dropdown
    const valueTrayek = getIdInputSelectedTrayek.options[getIdInputSelectedTrayek.selectedIndex].value;

    // call function write data database trayek
    addDataTrayek(valueTrayek, getIdInputFares.value, getIdInputNgetem.value, getIdInputRoute.value, getIdInputLatitude.value, getIdInputLongitude.value, getIdInputDescription.value);
})

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
            <td class="text-center col-1">${trayek.val().descriptionTransport}</td>
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