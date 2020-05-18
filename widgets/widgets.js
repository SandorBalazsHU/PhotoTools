/**
 * AX400
 * Widget manager modul and widget page.
 */

/**
 * The page asyncron runable function.
 */
export async function load() {
    /*
     * Find the widgets container DIV.
     */
    var widgetsContainer = document.querySelector("#widgets");
    /*
     * The list of the available widgets.
     */
    const availableWidgets = ["time", "moon"];
    /*
     * The loaded widget objects.
     */
    var widgets = []

    /*
     * Load the widgets HTML and JS objcts SYNCRON.
     */
    for (var widgetName of availableWidgets) {
        try {
            const response = await fetch(`widgets/${widgetName}.html`);
            const html = await response.text();
            widgetsContainer.innerHTML += html;
        } catch (error) {
            console.error(`ERROR ${widgetName} HTML LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    }
    for (var widgetName of availableWidgets) {
        try {
            const newWidget = new (await import(`../widgets/${widgetName}.js`)).Widget;
            newWidget.load();
            widgets.push(newWidget);
        } catch (error) {
            console.error(`ERROR ${widgetName} JS LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    }

    /*
     * The empty position
     */
    var position = new Error("NO POSITION DATA");

    /*
     *  Load the positions SYNCRON.
     */
    if(debug) console.log("getPosition");
    try {
        position = await GPS.getPosition(GPS.GPSoptions);
        if(debug) console.log(position);
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

    /*
     * Load the city, the weather and the forecast ASYNCRON way.
     */
    loadCity(position, widgets);
    loadWeather(position, widgets);
    loadForecast(position, widgets);
}

/**
 * Get the settlement datas from coordinats ASYNCRON way (dont block, the running).
 * And call the widgets reciver methods.
 * @param {The current GPS position} position 
 * @param {List of the loaded widget objects} widgets 
 */
async function loadCity(position, widgets) {
    if(debug) console.log("loadCity");
    var city = new Error("NO CITY DATA");
    if(!(position instanceof Error)) {
        try {
            city = await GPS.getLocation(position);
            if(debug) console.log(city);
        } catch (error) {
            city = error;
            console.error(`CITY LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    } else {
        console.error(position);
    }
    for (var widget of widgets) {
        if(widget.subscriptions.includes("city")) {
            widget.city(city);
        }
    }
}

/**
 * Get the current weather datas from coordinats ASYNCRON way (dont block, the running).
 * And call the widgets reciver methods.
 * @param {The current GPS position} position 
 * @param {List of the loaded widget objects} widgets 
 */
async function loadWeather(position, widgets) {
    if(debug) console.log("loadWeather");
    var weather = new Error("NO WEATHER DATA");
    if(!(position instanceof Error)) {
        try {
            weather = await Weather.getLocalWeather(position);
            if(debug) console.log(weather);
        } catch (error) {
            weather = error;
            console.error(`WEATHER LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    } else {
        console.error(position);
    }
    for (var widget of widgets) {
        if(widget.subscriptions.includes("weather")) {
            widget.weather(weather);
        }
    }
}

/**
 * Get the weather forecast datas from coordinats ASYNCRON way (dont block, the running).
 * And call the widgets reciver methods.
 * @param {The current GPS position} position 
 * @param {List of the loaded widget objects} widgets 
 */
async function loadForecast(position, widgets) {
    if(debug) console.log("loadForecast");
    var forecast = new Error("NO FORECAST DATA");
    if(!(position instanceof Error)) {
        try {
            forecast = await Weather.getWeatherForecast(position);
            if(debug) console.log(forecast);
        } catch (error) {
            forecast = error;
            console.error(`WEATHER LOAD ERROR [${error.code}]: ${error.message}`);
            console.error(error);
        }
    } else {
        console.error(position);
    }
    for (var widget of widgets) {
        if(widget.subscriptions.includes("forecast")) {
            widget.forecast(forecast);
        }
    }
}