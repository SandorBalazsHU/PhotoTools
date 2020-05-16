export async function load(widgetDatas) {
    const indexContent = document.querySelector("#index-content");
    const response = await fetch(`widgets/widgets.html`);
    if (!response.ok) {
      return;
    }
    const html = await response.text();
    main.innerHTML = html;
    (await import(`widgets/widgets.js`)).load();
}