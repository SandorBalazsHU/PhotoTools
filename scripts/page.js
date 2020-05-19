const backdrop = document.querySelector("#backdrop");
const trigger = document.querySelector("#menu-toggle");
const menu = document.querySelector("#menu");
const main = document.querySelector("main");

trigger.addEventListener("pointerdown", function() {
  menu.classList.toggle("open");
  backdrop.classList.toggle("visible", menu.classList.contains("open"));
});

menu.addEventListener("pointerdown", function () {
  menu.classList.remove("open");
  backdrop.classList.remove("visible");
});

//const pages = ["index", "camera", "gps", "map", "galery"];
async function loadPage(page) {
  const response = await fetch(`pages/${page}.html`);
  if (!response.ok) {
    return;
  }
  const html = await response.text();
  main.innerHTML = html;
  (await import(`../pages/${page}.js`)).load();
}

function handleHashChange() {
  const page = location.href.split("#!/")[1] || "index";
  loadPage(page);
}

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);