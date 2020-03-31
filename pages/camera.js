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
        console.log(
          "camera he: " + document.querySelector("video").clientHeight + "\n" +
          "camera wi " + camera.width + "\n" +
          "main wi " + document.querySelector("#cameraPage").clientWidth + "\n" +
          "div " + document.querySelector("#cameraPage").clientWidth / camera.height
        );

        image.height = cameraRatio*camera.width;
        image.width = camera.width;

        image.style.display = "block";
        camera.style.display = "none";

        const context = image.getContext("2d");
        console.log(document.querySelector("#cameraPage").clientHeight);
        context.drawImage(camera, 0, 0, image.width, image.height);

        //context.font = "20px Consolas";
        //context.fillStyle = "white";
        //context.fillText("#mobilweb #elteik", 30, 30);


        captureBtn.style.display = "none";
        saveBtn.style.display = "block";
        backBtn.style.display = "block";

        getLocation();
        getTime();

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
      //saves img

      captureBtn.style.display = "block";
      image.style.display = "none";
      camera.style.display = "block";

      document.querySelector("#backdrop").style.display = "none";

      comment.value = "";
      comment.style.display = "none";
      saveBtn2.style.display = "none";

      //document.querySelector("#savedText").classList.toggle("fadeOut");
      //document.querySelector("#savedText").classList.toggle("fadeOut");
      //document.querySelector("#savedText").classList.add("fadeOut").show('slow');;
      //console.log(document.querySelector("#savedText").classList);


    });

}


function getTime(){
  const time = new Date();
  console.log(time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes());
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  console.log("Latitude: " + position.coords.latitude +
  " Longitude: " + position.coords.longitude);
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