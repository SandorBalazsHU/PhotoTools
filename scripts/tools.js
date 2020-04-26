class Time {
    static getTime() {
        return new Date();
    }
    static getTimeZome(date) {
        return date.time.getTimezoneOffset()*-1 / 60;
    }
    getTimeZomeString(date) {
        var timezoneDirection = date.getTimezoneOffset() < 0 ? "+" : "";
        return "UTC${timezoneDirection}${this.getTimeZome()}";
    }
}

class GPS {
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
    static getLocalWeather(position) {
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=22a4b426901996099500de4125c3b1da`).then(data => data.json());
    }
}