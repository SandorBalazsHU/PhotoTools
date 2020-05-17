class AppData {
    constructor(){
        this.time = "";
        this.position = "";
        this.currentWeather = "";
        this.widgets = ["time", "coordinate", "city", "current-weather"];
    }
    setTime(time){
        this.time = time;
    }
    getPosition(){
        return this.coordinates;
    }
    setPosition(position) {
        this.position = position;
    }
    setCurrentWeather(currentWeather){
        this.currentWeather = currentWeather;
    }
  }