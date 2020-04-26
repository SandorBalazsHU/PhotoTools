export async function load() {
    const widgetsContainer = document.querySelector("#widgets");
    const availableWidgets = ["time", "coordinate", "city"];
    var widgets = []

    for (const widgetName of availableWidgets) {
        const response = await fetch(`widgets/${widgetName}.html`);
        if (!response.ok) {
            //TODO
            continue;
        }
        const html = await response.text();
        widgetsContainer.innerHTML += html;
        try {
            const newWidget = new (await import(`../widgets/${widget}.js`)).Widget;
            newWidget.load();
            widgets.push(newWidget);
        } catch (e) {
            //TODO
        }
    }

    const position = null;
    var result = "OK";

    const position = await GPS.getPosition(options)
    .catch(err => {result = `ERROR(${err.code}): ${err.message}`;});
    for (const widget of widgets) {
        if(widget.subscriptions.includes("position")) {
            widget.position(position, result);
        }
    }

    if(result == "OK") {
        const city = await GPS.getLocation(position)
        .catch(err => {result = `ERROR(${err.code}): ${err.message}`;});
    }
    for (const widget of widgets) {
        if(widget.subscriptions.city("city")) {
            widget.position(city, result);
        }
    }
    
    if(result == "OK") {
        const weather = await Weather.getLocalWeather(position)
        .catch(err => {result = `ERROR(${err.code}): ${err.message}`;});
    }
    for (const widget of widgets) {
        if(widget.subscriptions.weather("weather")) {
            widget.position(weather, result);
        }
    }
}