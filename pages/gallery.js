let photos = document.getElementById('photos');
const fullScreen = document.getElementById('fullScreen');
const infoBtn = document.getElementById('infoBtn');
const backBtn = document.getElementById('backBtn');
const deleteBtn = document.getElementById('deleteBtn');
var fileNames;

export async function load() {

    getAllKeys(() => {

        photos = document.getElementById('photos');
        let canvases = photos.querySelectorAll(":scope > canvas");

        if(canvases.length==0){
                
            var canvasText = "";
            for(let i=0; i<fileNames.length; i++){
                canvasText += "<canvas id='" + fileNames[i] + "'></canvas>";
            }
            photos.innerHTML = canvasText;
            
            canvases = photos.querySelectorAll(":scope > canvas");
            let canvasAmount = 1;
            let canvasSize = 0;
            if(window.innerWidth > 900){
                canvasAmount = Math.floor(window.innerWidth / (230));
            } else if(window.innerHeight < 900 && window.innerWidth >510){
                canvasAmount = Math.floor(window.innerWidth / (150));
            } else {
                canvasAmount = 2;
            }
            canvasSize = (window.innerWidth-30) / canvasAmount

            canvases.forEach((canvas) => {
                canvas.width = canvasSize;
                canvas.height = canvasSize;
                canvas.addEventListener('click', showPhoto)
            });
            
            for(let i=0; i<fileNames.length; i++){
                loadImg(fileNames[i]);
            }
        }

    });

    deleteBtn.addEventListener("click", function() {
        document.getElementById("deleteModal").style.display = "block";
    });


    /*const closeBtns = document.getElementsByClassName("close");
    console.log(closeBtns);
    closeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const name = this.id.replace("close", "").toLowerCase();
            console.log("it worked");
            document.getElementById("delete"+name).style.display = "none";
        });
    });*/

    document.getElementById("closeDelete").addEventListener("click", function(){
        document.getElementById("deleteModal").style.display = "none";
    });

    document.getElementById("cancelbtn").addEventListener("click", function(){
        document.getElementById("deleteModal").style.display = "none";
    });

    document.getElementById("closeInfo").addEventListener("click", function(){
        document.getElementById("infoModal").style.display = "none";
    });

    document.getElementById("deletebtn").addEventListener("click", function(){
        const src = fullScreen.getAttribute("data-src");
        console.log(src);

        deleteIndexedDb(src);

        let canvases = photos.querySelectorAll(":scope > canvas");
        canvases.forEach((canvas) => {
            if(canvas.id == src){
                canvas.remove();
            }
        });
        canvases = photos.querySelectorAll(":scope > canvas");
        document.getElementById("deleteModal").style.display = "none";

        infoBtn.style.display = "none";
        backBtn.style.display = "none";
        backBtn.style.display = "none";
        fullScreen.style.display = "none";
        canvases = photos.querySelectorAll(":scope > canvas");
        canvases.forEach((canvas) => {
          canvas.style.display = 'inline-block';
        });
    });


    infoBtn.addEventListener("click", function() {
        const infoModal = document.getElementById("infoModal");
        infoModal.style.display = "block";
        const fileName = fullScreen.getAttribute("data-src");
        findIndexedDB (fileName, (info) => {
            const infoBody = document.getElementById("infoBody");
            infoBody.innerHTML = "<p>Fájl név:   " +info.fileName+ "</p>" + 
            "<h3>Latitude:   </h3><p>" +info.latitude+ "</p>" + 
            "<h3>Longitude:   </h3><p>" +info.longitude+ "</p>" + 
            "<h3>Dátum:   </h3><p>" +info.date+ "</p>" + 
            "<h3>Megjegyzés:   </h3><p>" +info.comment+ "</p>";
          }
        );
    });


    backBtn.addEventListener("click", function() {
        infoBtn.style.display = "none";
        backBtn.style.display = "none";
        backBtn.style.display = "none";
        fullScreen.style.display = "none";
        const canvases = photos.querySelectorAll(":scope > canvas");
        canvases.forEach((canvas) => {
          canvas.style.display = 'inline-block';
        });
    });
}



function loadImg(fileName){
    findIndexedDB (fileName, (data) => {
        var img = new Image();
        img.src = data.file;
        img.onload = function(i){
            const canvas = document.getElementById(data.fileName);
            
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