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

var div = document.getElementById("content");
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

GPS.getPosition(options)
.then(position => {
    div.innerHTML += "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude + "<br>";
    GPS.getLocation(position).then(city => { div.innerHTML += city.display_name; }).catch(err => {div.innerHTML += `ERROR(${err.code}): ${err.message}`;});
})
.catch(err => {div.innerHTML += `ERROR(${err.code}): ${err.message}`;});

async function asyncTest() {
    const position = await GPS.getPosition(options);
    const city = await GPS.getLocation(position);
    const weather = await Weather.getLocalWeather(position);
    console.log(position);
    console.log(city);
    console.log(weather);
    var test = new (await import("./test.js")).Test;
    test.test("lul");
}

asyncTest();