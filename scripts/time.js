class AppData {
    constructor() {
        this.time = new Date();
        this.timeZone = this.time.getTimezoneOffset()*-1 / 60;
    }
    getTime() {
        this.time = new Date();
    }
    getTimeZome() {
        this.timeZone = this.time.getTimezoneOffset()*-1 / 60;
    }
    getTimeZomeString() {
        var timezoneDirection = date.getTimezoneOffset() < 0 ? "+" : "";
        return "UTC${timezoneDirection}${this.getTimeZome()}"
    }
  }