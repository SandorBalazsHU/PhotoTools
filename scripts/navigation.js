const backdrop = document.querySelector("#backdrop");
const trigger = document.querySelector("#menu-toggle");
const menu = document.querySelector("#menu");

trigger.addEventListener("pointerdown", function() {
  menu.classList.toggle("open");
  backdrop.classList.toggle("visible", menu.classList.contains("open"));
});

menu.addEventListener("pointerdown", function () {
  menu.classList.remove("open");
  backdrop.classList.remove("visible");
});

var appData = new AppData();

const main = document.querySelector("main");

async function loadPage(page) {
  const response = await fetch(`pages/${page}.html`);
  if (!response.ok) {
    return;
  }
  const html = await response.text();
  main.innerHTML = html;
  (await import(`../pages/${page}.js`)).load(appData);
}

function handleHashChange() {
  const page = location.href.split("#!/")[1] || "index";
  loadPage(page);
}

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);