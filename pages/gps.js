var fileNames;

export function load() {
    let map = L.map("map").setView([47.5, 19], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    var _fileNames = "";
    var mapContainer = document.querySelector("#map");
    mapContainer.onclick = function() {
        for(let i=0; i<_fileNames.length; i++) {
            loadImg(fileNames[i]);
        }
    }

    getAllKeys(() => {
        _fileNames = fileNames;
        for(let i=0; i<fileNames.length; i++) {
            findIndexedDB (fileNames[i], (info) => {
                var msg = "<canvas id=\"map-"+info.fileName+"\" width=\"200\" height=\"200\"></canvas><br>" +
                "Latitude: " +info.latitude+ "<br>" + 
                "Longitude:" +info.longitude+ "<br>" + 
                "Dátum: " +info.date+ "<br>" + 
                "Megjegyzés: " +info.comment;
                placePoint(info.latitude+Math.random(), info.longitude+Math.random(), msg);
                console.log(msg);
            });
            loadImg(fileNames[i]);
        }
    });

    function placePoint(latitude, longitude, msg) {
        map.setView([latitude, longitude]);
        var marker = L.marker([latitude, longitude]).addTo(map);
        var popup = marker.bindPopup(msg);
        popup.openPopup();  
    }
}

















function loadImg(fileName){
    findIndexedDB (fileName, (data) => {
        var img = new Image();
        img.src = data.file;
        img.onload = function(i){
            const canvas = document.getElementById("map-"+data.fileName);
            
            let s;
            if(this.height > this.width){
                s = canvas.width / this.width;
            }else{
                s = canvas.height / this.height;
            }
            console.log(s);

            const x = s*this.width/2 - canvas.width/2;
            const y = s*this.height/2 - canvas.height/2;

            canvas.getContext('2d').scale(s, s);
            canvas.getContext('2d').drawImage(img,-x,-y);
            
        };
    })
}

function showPhoto(e){
    loading();
    const canvases = photos.querySelectorAll(":scope > canvas");
    canvases.forEach((canvas) => {
      canvas.style.display = 'none';
    });

    const fileName = e.target.id;

    findIndexedDB (fileName, (data) => {
        var img = new Image();
        img.src = data.file;
        img.onload = function(){
            fullScreen.width = this.width;
            fullScreen.height = this.height;
            fullScreen.getContext('2d').drawImage(img,0,0);
            fullScreen.setAttribute("data-src", data.fileName);
            loadedPhoto();
        };
    })
}


function loading(){
    document.getElementById('loader').style.display="block";
}

function loadedPhoto(){
    document.getElementById('loader').style.display="none";
    fullScreen.style.display = 'block';
    infoBtn.style.display = 'block';
    backBtn.style.display = 'block';
    deleteBtn.style.display = 'block';
}


function openIndexedDB () {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var openDB = indexedDB.open("PhotoTourStore", 1);
  
    openDB.onupgradeneeded = function() {
      var db = {}
      db.result = openDB.result;
      db.store = db.result.createObjectStore("PhotoTourStore", {keyPath: "fileName"});
    };
  
    return openDB;
}
  
function getStoreIndexedDB (openDB) {
    var db = {};
    db.result = openDB.result;
    db.tx = db.result.transaction("PhotoTourStore", "readwrite");
    db.store = db.tx.objectStore("PhotoTourStore");
    //request.onsuccess = function(event) {
        return db;
    //}
}

function findIndexedDB (fileName, callback) {
    var openDB = openIndexedDB();

    openDB.onsuccess = function() {
        var db = getStoreIndexedDB(openDB);
        var request = db.store.get(fileName);

        request.onsuccess = function() {
            callback(request.result);
        };
        db.tx.oncomplete = function() {
            db.result.close();
        };
    }

    return true;
}

function getAllKeys(callback){
    var openDB = openIndexedDB();

    openDB.onsuccess = function() {
        var db = getStoreIndexedDB (openDB);
        var request = db.store.getAllKeys();
        request.onsuccess = function(event) {
            fileNames = request.result;
            callback();
        };
        db.tx.oncomplete = function() {
            db.result.close();
        };
    }

    return true;
}

function deleteIndexedDb(fileName){
    var openDB = openIndexedDB();

    openDB.onsuccess = function() {
        var db = getStoreIndexedDB (openDB);
        var request = db.store.delete(fileName);
        db.tx.oncomplete = function() {
            db.result.close();
        };
    }
    
    return true;
}