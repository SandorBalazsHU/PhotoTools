export async function load() {
    const widgetsContainer = document.querySelector("#widgets");
    const availableWidgets = ["time"];
    var widgets = []

    for (const widgetName of availableWidgets) {
        const response = await fetch(`widgets/${widgetName}.html`);
        if (!response.ok) {
            //TODO
            console.log(`ERROR(${err.code}): ${err.message}`);
            continue;
        }
        const html = await response.text();
        widgetsContainer.innerHTML += html;
        try {
            const newWidget = new (await import(`../widgets/${widgetName}.js`)).Widget;
            newWidget.load();
            widgets.push(newWidget);
        } catch (err) {
            //TODO
            console.log(`ERROR(${err.code}): ${err.message}`);
            console.log(err);
        }
    }

    var GPSstatus = "OK";

    const position = await GPS.getPosition(GPS.GPSoptions)
    .catch(error => {GPSstatus = `ERROR(${error.code}): ${error.message}`;});
    for (const widget of widgets) {
        if(widget.subscriptions.includes("position")) {
            widget.position(position, GPSstatus);
        }
    }

    if(GPSstatus == "OK") {
        const city = await GPS.getLocation(position)
        .catch(err => {status = `ERROR(${err.code}): ${err.message}`;});
    }
    for (const widget of widgets) {
        if(widget.subscriptions.includes("city")) {
            widget.position(city, status);
        }
    }
    
    if(status == "OK") {
        const weather = await Weather.getLocalWeather(position)
        .catch(err => {status = `ERROR(${err.code}): ${err.message}`;});
    }
    for (const widget of widgets) {
        if(widget.subscriptions.includes("weather")) {
            widget.position(weather, status);
        }
    }
}