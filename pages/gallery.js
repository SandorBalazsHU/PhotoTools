const photos = document.getElementById('photos');
const fullScreen = document.getElementById('fullScreen');
const infoBtn = document.getElementById('infoBtn');
const backBtn = document.getElementById('backBtn');
const deleteBtn = document.getElementById('deleteBtn');
let database = JSON.parse(localStorage.getItem('database.json'));

export async function load() {
    var canvasText = "";
    for(let i=0; i<database.length; i++){
        canvasText += "<canvas id='" + database[i].fileName + "'></canvas>";
    }
    photos.innerHTML = canvasText;
    console.log(photos.innerHTML);
    
    let canvases = photos.querySelectorAll(":scope > canvas");
    canvases.forEach((canvas) => {
        canvas.width = 180;
        canvas.height = 180;
        canvas.addEventListener('click', showPhoto)
    });
    
    for(let i=0; i<database.length; i++){
        loadImg(i);
    }

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
        localStorage.removeItem(src);

        let i = 0;
        while(i<database.length && database[i].fileName != src){
            i++;
        }

        database.splice(i, 1);
        localStorage.removeItem('database.json');
        localStorage.setItem('database.json', JSON.stringify(database));

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
        const info = searchForData(fullScreen.getAttribute("data-src"));

        if(info){
            const infoBody = document.getElementById("infoBody");
            infoBody.innerHTML = "<p>Fájl név:   " +info.fileName+ "</p>" + 
            "<p>Latitude:   " +info.latitude+ "</p>" + 
            "<p>Longitude:   " +info.longitude+ "</p>" + 
            "<p>Dátum:   " +info.date+ "</p>" + 
            "<p>Megjegyzés:   " +info.comment+ "</p>";
        }
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



function loadImg(i){
    var img = new Image();
    img.src = window.localStorage.getItem(database[i].fileName);
    img.onload = function(){
        const canvas = document.getElementById(database[i].fileName);
        const x = this.width/2 - canvas.width/2;
        const y = this.height/2 - canvas.height/2;
        canvas.getContext('2d').drawImage(img,-x,-y);
    };
}

function showPhoto(e){
    const canvases = photos.querySelectorAll(":scope > canvas");
    canvases.forEach((canvas) => {
      canvas.style.display = 'none';
    });

    const fileName = e.target.id;
    var img = new Image();
    img.src = window.localStorage.getItem(fileName);
    img.onload = function(){
        fullScreen.width = this.width;
        fullScreen.height = this.height;
        fullScreen.getContext('2d').drawImage(img,0,0);
        fullScreen.setAttribute("data-src", fileName);
    };

    fullScreen.style.display = 'block';
    infoBtn.style.display = 'block';
    backBtn.style.display = 'block';
    deleteBtn.style.display = 'block';
}

function searchForData(id){
    let i = 0;
    while(i<database.length && database[i].fileName != id){
        i++;
    }
    if(database[i].fileName == id){
        return database[i];
    } else {
        return null;
    }
}