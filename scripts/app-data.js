export class AppData {
    constructor(){
        this.widgets = ["time", "coordinate", "city", "current-weather"];
        getPosition()
    }
    getCurrentTime(time){
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