export class Widget {
    constructor(){
        this.timeContainer = document.querySelector("#time");
        this.subscriptions = [];
    }
    load() {
        const time = Time.getTime();
        const datetime = "<p>" + date.getFullYear() + "."
        + (date.getMonth()+1)  + "." 
        + date.getDate() + ".   "
        + date.getHours() + ":"
        + date.getMinutes() + ":"
        + date.getSeconds() + " "
        + Time.getTimeZomeString();
        timeContainer.innerHTML += datetime;
    }
}