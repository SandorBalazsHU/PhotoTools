var pos;
var name;

export async function load() {

    preventScrolling()

    const camera = document.querySelector("#camera"); //video
    const image = document.querySelector("#imageCanvas"); //canvas
    const captureBtn = document.querySelector("#capture");
    const saveBtn = document.querySelector("#save");
    const backBtn = document.querySelector("#back");
    const saveBtn2 = document.querySelector("#save2");
    const comment = document.querySelector("#comment");

    let cameraRatio = 0;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        torch: true,
        frameRate: 60
      }
    });

    camera.srcObject = stream;
    camera.play();


    camera.addEventListener('loadeddata', function() {
      const w = camera.videoWidth;
      const h = camera.videoHeight;
      if (w && h) {
        camera.style.width = w;
        camera.style.height = h;
        cameraRatio = h/w;
      }
    });


    /*console.log(
      "camera he: " + document.querySelector("video").clientHeight + "\n" +
      "camera wi " + document.querySelector("video").clientWidth + "\n" +
      "main wi " + document.querySelector("#cameraPage").clientWidth + "\n" +
      "div " + document.querySelector("#cameraPage").clientWidth / camera.height
    );*/

    camera.width = window.innerWidth;
  
    captureBtn.addEventListener("click", function() {

        image.height = cameraRatio*camera.width;
        image.width = camera.width;

        image.style.display = "block";
        camera.style.display = "none";

        const context = image.getContext("2d"); 
        context.drawImage(camera, 0, 0, image.width, image.height);

        captureBtn.style.display = "none";
        saveBtn.style.display = "block";
        backBtn.style.display = "block";

    });



    saveBtn.addEventListener("click", function() {
      saveBtn.style.display = "none";
      backBtn.style.display = "none";

      document.querySelector("#backdrop").style.display = "block";

      comment.style.display = "block";
      saveBtn2.style.display = "block";

    });




    backBtn.addEventListener("click", function() {
      captureBtn.style.display = "block";
      saveBtn.style.display = "none";
      backBtn.style.display = "none";
      image.style.display = "none";
      camera.style.display = "block";
    });

  

    saveBtn2.addEventListener("click", function() {
      saveImage();

      captureBtn.style.display = "block";
      image.style.display = "none";
      camera.style.display = "block";

      document.querySelector("#backdrop").style.display = "none";

      comment.style.display = "none";
      saveBtn2.style.display = "none";

      document.getElementById('savedText').style.display = 'block';
      setTimeout(function(){ document.getElementById('savedText').style.display = 'none';; }, 1950);

    });

}

function saveImage() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(saveImage2);
  }
}


var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var dataURL = reader.result;
    var output = document.getElementById('output');
    output.src = dataURL;
  };
  reader.readAsDataURL(input.files[0]);
};


function getDateString(){
  const time = new Date();
  return (time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes());
}

function saveImage2(position) {
  var reader = new FileReader();
  name = (Date.now() + '.png');
  reader.addEventListener("load", function () {
      if (this.result && localStorage) {
          saveImgData(this.result, position);
      } else {
          alert();
      }
  });

  document.querySelector("#imageCanvas").toBlob(function(blob) {
    reader.readAsDataURL(blob);
  }, 'image/wbmp');
}


function saveImgData(imgBlob, position){
  var newData = { 
    'longitude': position.coords.longitude, 
    'latitude': position.coords.latitude, 
    'date': getDateString(),
    'fileName': name,
    'comment': document.querySelector("#comment").value,
    'file': imgBlob
  };
  document.querySelector("#comment").value = "";

  saveIndexedDB (newData);
}



function preventScrolling(){
  //$("body").css("overflow", "hidden");

  var supportsPassive = false;
  try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true; } 
    }));
  } catch(e) {}

  const wheelOpt = supportsPassive ? { passive: false } : false;
  const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

  window.addEventListener('DOMMouseScroll', function(e) {e.preventDefault()}, false); // older FF
  window.addEventListener(wheelEvent, function(e) {e.preventDefault()}, wheelOpt); // modern desktop
  window.addEventListener('touchmove', function(e) {e.preventDefault()}, wheelOpt); // mobile
  window.addEventListener('keydown', function(e) {preventDefaultForScrollKeys(e)}, false);

}

function preventDefaultForScrollKeys(e) {
  const keys = {37: 1, 38: 1, 39: 1, 40: 1};
  if (keys[e.keyCode]) {
    e.preventDefault();
    return false;
  }
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

function saveIndexedDB (data) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
      var db = getStoreIndexedDB(openDB);
      db.store.put({
          fileName: data.fileName,
          longitude: data.longitude,
          latitude: data.latitude,
          date: data.date,
          comment: data.comment,
          file: data.file,
      });
  }

  return true;
}