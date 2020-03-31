class AppDatas {
  constructor(){
      this.time = "";
      this.coordinates = "";
      this.currentWeather = "";
      this.widgets = ["time", "coordinate", "city", "current-weather"];
  }
  setTime(time){
      this.time = time;
  }
  setCoordinates(coordinates){
      this.coordinates = coordinates;
  }
  setCurrentWeather(currentWeather){
      this.currentWeather = currentWeather;
  }
}

var appDatas = new AppDatas();

const main = document.querySelector("main");

async function loadPage(page) {
  const response = await fetch(`pages/${page}.html`);
  if (!response.ok) {
    return;
  }
  const html = await response.text();
  main.innerHTML = html;
  (await import(`../pages/${page}.js`)).load(appDatas);
}

function handleHashChange() {
  const page = location.href.split("#!/")[1] || "index";
  loadPage(page);
}

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);