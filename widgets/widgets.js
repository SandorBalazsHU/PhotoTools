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
        } catch (error) {
            //TODO
            console.log(`ERROR(${error.code}): ${error.message}`);
            console.log(error);
        }
    }

    var GPSstatus = "OK";
    const position = "";

    try {
        position = await GPS.getPosition(GPS.GPSoptions)
        for (const widget of widgets) {
            if(widget.subscriptions.includes("position")) {
                widget.position(position, GPSstatus);
            }
        }
    } catch (error) {
        GPSstatus = `ERROR(${error.code}): ${error.message}`;
    }

    const city = "";
    if(GPSstatus == "OK") {
        try {
            city = await GPS.getLocation(position)
        } catch (error) {
            status = `ERROR(${err.code}): ${err.message}`;
        }
    }
    for (const widget of widgets) {
        if(widget.subscriptions.includes("city")) {
            widget.position(city, status);
        }
    }
    
    const weather = "";
    if(status == "OK") {
        try {
            const weather = await Weather.getLocalWeather(position)
        } catch (error) {
            status = `ERROR(${err.code}): ${err.message}`;
        }
    }
    for (const widget of widgets) {
        if(widget.subscriptions.includes("weather")) {
            widget.position(weather, status);
        }
    }
}