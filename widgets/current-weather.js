export function load(widgetDatas) {

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    function success(pos) {
        const crd = pos.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&APPID=22a4b426901996099500de4125c3b1da`)
        .then(data => data.json())
        .then(data => printCurrentWeather(data))
        .catch(e => console.log("ERROR"))
        function printCurrentWeather(data) {
            const currentWeatherIcon = document.querySelector("#wicon");
            var iconcode = data.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            currentWeatherIcon.src = iconurl;
    
            const currentWeatherContainer = document.querySelector("#current-weather");
            const output = "<b>Hőmérséklet: </b>" + data.main.temp + " &#8451;<br>" +
            "<b>Hőérzet: </b>" + data.main.feels_like + " &#8451;<br>" +
            "<b>Légnyomás: </b>" + data.main.pressure + " &#8451;<br>";
            currentWeatherContainer.innerHTML += output;
            console.log(data);
        }
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}