const main = document.querySelector("main");

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);

async function loadPage(pageName) {
    const response = await fetch(`pages/${pageName}.html`);
    if (!response.ok) {
        return;
    }

    const html = await response.text();
    main.innerHTML = html;

    await import(`../pages/${pageName}.js`).load();
}

function handleHashChange() {
    const page = location.href.split("#!/")[1] || "index";
    loadPage(page);
}