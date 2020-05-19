/**
 * Global constant for the DEBUG mode.
 */
const debug = false;

class Time {
    static getTime() {
        return new Date();
    }
    static getTimeZome(time) {
        return time.getTimezoneOffset()*-1 / 60;
    }
    static getTimeZoneString(time) {
        var timezoneDirection = time.getTimezoneOffset() < 0 ? "+" : "";
        var timeZone = time.getTimezoneOffset()*-1 / 60;
        return `UTC${timezoneDirection}${timeZone}`;
    }
}

class GPS {
    static GPSoptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    static getPosition(options) {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }
    static getLocation(position) {
        return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`).then(data => data.json())
    }
}

class Weather {
    static APIKEY = "22a4b426901996099500de4125c3b1da";
    static UNIT = "metric";
    static getLocalWeather(position) {
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${Weather.UNITS}&APPID=${Weather.APIKEY}`).then(data => data.json());
    }
    static getWeatherForecast(position) {
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${Weather.UNITS}&APPID=${Weather.APIKEY}`).then(data => data.json());
    }
}

function isExist(x) {
    return (x != null) && (x != undefinied) && (x != NaN);
}