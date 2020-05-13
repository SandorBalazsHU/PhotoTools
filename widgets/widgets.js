/**
 * Widget manager modul and widget page.
 */


/**
 * Global constant for the DEBUG mode.
 */
const debug = true;

/**
 * The page asyncron runable function.
 */
export async function load() {
    /**
     * Find the widgets container DIV.
     */
    const widgetsContainer = document.querySelector("#widgets");
    /**
     * The list of the available widgets.
     */
    const availableWidgets = ["time"];
    /**
     * The loaded widget objects.
     */
    var widgets = []
    /**
     * Load the widgets and the positions SYNCRON
     * and load the city, the weather and the forecast ASYNCRON way.
     */
    getWidgets(availableWidgets, widgets);
    getPosition(widgets);
    loadCity(position, widgets);
    loadWeather(position, widgets);
    loadForecast(position, widgets);
}

/**
 * Load the widgets HTML objects and the Windget JS objects SYNCRON way (block, the running).
 * @param {List of the awailable widget objects} availableWidgets 
 * @param {List of the loadable widget objects} widgets 
 */
function getWidgets(availableWidgets, widgets) {
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
}

/**
 * Get the GPS coordinats SYNCRON way (block, the running).
 * And call the widgets reciver methods.
 * @param {List of the loaded widget objects} widgets 
 */
function getPosition(widgets) {
    var position = new Error("NO DATA");
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
}

/**
 * Get the settlement datas from coordinats ASYNCRON way (dont block, the running).
 * And call the widgets reciver methods.
 * @param {The current GPS position} position 
 * @param {List of the loaded widget objects} widgets 
 */
async function loadCity(position, widgets) {
    var city = new Error("NO DATA");
    if(!(position instanceof Error)) {
        try {
            city = await GPS.getLocation(position);
            if(debug) console.log(city);
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
}

/**
 * Get the current weather datas from coordinats ASYNCRON way (dont block, the running).
 * And call the widgets reciver methods.
 * @param {The current GPS position} position 
 * @param {List of the loaded widget objects} widgets 
 */
async function loadWeather(position, widgets) {
    var weather = new Error("NO DATA");
    if(!(position instanceof Error)) {
        try {
            weather = await Weather.getLocalWeather(position);
            if(debug) console.log(weather);
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
}

/**
 * Get the weather forecast datas from coordinats ASYNCRON way (dont block, the running).
 * And call the widgets reciver methods.
 * @param {The current GPS position} position 
 * @param {List of the loaded widget objects} widgets 
 */
async function loadForecast(position, widgets) {
    var forecast = new Error("NO DATA");
    if(!(position instanceof Error)) {
        try {
            forecast = await Weather.getWeatherForecast(position);
            if(debug) console.log(forecast);
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