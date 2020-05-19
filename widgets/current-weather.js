export class Widget {
    constructor(){
        this.subscriptions = ["weather"];
        this.time = Time.getTime();
        this.currentWeatherClouds           = document.querySelector("#current-weather-clouds");
        this.currentWeatherTemp             = document.querySelector("#current-weather-temp");
        this.currentWeatherFeels_like       = document.querySelector("#current-weather-feels_like");
        this.currentWeatherPressure         = document.querySelector("#current-weather-pressure");
        this.currentWeatherHumidity         = document.querySelector("#current-weather-humidity");
        this.currentWeather = new Error("NO WEATHER DATA");
    }

    load() {
    }

    async weather(weather) {
        if(!(weather instanceof Error)) {
            this.currentWeather = weather;

            var currentWeatherIcon = document.querySelector("#current-weather-icon");
            var iconcode = this.currentWeather.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
            currentWeatherIcon.src = iconurl;

            this.currentWeatherClouds.innerHTML     = this.currentWeather.clouds.all + " %";
            this.currentWeatherTemp.innerHTML       = this.currentWeather.main.temp + " &#8451;";
            this.currentWeatherFeels_like.innerHTML = this.currentWeather.main.feels_like + " &#8451;";
            this.currentWeatherPressure.innerHTML   = this.currentWeather.main.pressure + " hPa";
            this.currentWeatherHumidity.innerHTML   = this.currentWeather.main.humidity + " %";
        }
    }
}