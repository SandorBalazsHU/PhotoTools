export async function load(widgetDatas) {
    const widgetsContainer = document.querySelector("#widgets");

    for (const widget of widgetDatas.widgets) {
        const response = await fetch(`widgets/${widget}.html`);
        if (!response.ok) return;
        const html = await response.text();
        widgetsContainer.innerHTML += html;

        (await import(`../widgets/${widget}.js`)).load(widgetDatas);
    }
}