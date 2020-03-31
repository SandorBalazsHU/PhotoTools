export function load(widgetDatas) {
    const crd = widgetDatas.coordinates;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&APPID=22a4b426901996099500de4125c3b1da`)
    .then(data => data.json())
    .then(data => printCurrentWeather(data))
    .catch(e => console.log("ERROR"))
    function printCurrentWeather(data) {
        //const currentWeatherContainer = document.querySelector("#current-weather");
        //currentWeatherContainer.innerHTML += data.display_name;
        widgetDatas.setCurrentWeather(data);
        console.log(data);
    }
}