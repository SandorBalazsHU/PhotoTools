export async function load() {
    const widgetsContainer = document.querySelector("#widgets");
    const availableWidgets = ["time"];
    var widgets = []

    for (var widgetName of availableWidgets) {
        try {
            const response = await fetch(`widgets/${widgetName}.html`);
            const html = await response.text();
            widgetsContainer.innerHTML += html;
        } catch (error) {
            console.error(`ERROR ${widgetName} HTML LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
        try {
            const newWidget = new (await import(`../widgets/${widgetName}.js`)).Widget;
            newWidget.load();
            widgets.push(newWidget);
        } catch (error) {
            console.error(`ERROR ${widgetName} JS LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    }

    var position = new Error("NO DATA");
    try {
        position = await GPS.getPosition(GPS.GPSoptions);
        console.log(position);
    } catch (error) {
        position = error;
        console.error(`GPS ERROR [${error.code}]: ${error.message}`);
        console.error(error);
    }
    for (var widget of widgets) {
        if(widget.subscriptions.includes("position")) {
            widget.position(position);
        }
    }

    var city = new Error("NO DATA");
    if(!(position instanceof Error)) {
        try {
            city = await GPS.getLocation(position);
            console.log(city);
        } catch (error) {
            city = error;
            console.error(`CITY LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    }
    for (var widget of widgets) {
        if(widget.subscriptions.includes("city")) {
            widget.position(city);
        }
    }

    var weather = new Error("NO DATA");
    if(!(position instanceof Error)) {
        try {
            weather = await Weather.getLocalWeather(position);
            console.log(weather);
        } catch (error) {
            weather = error;
            console.error(`WEATHER LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    }
    for (var widget of widgets) {
        if(widget.subscriptions.includes("weather")) {
            widget.position(weather);
        }
    }

    var forecast = new Error("NO DATA");
    if(!(position instanceof Error)) {
        try {
            forecast = await Weather.getWeatherForecast(position);
            console.log(forecast);
        } catch (error) {
            forecast = error;
            console.error(`WEATHER LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    }
    for (var widget of widgets) {
        if(widget.subscriptions.includes("forecast")) {
            widget.position(forecast);
        }
    }
}