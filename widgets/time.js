export function load(widgetDatas) {
    const date = new Date();
    widgetDatas.setTime(date);

    const timeContainer = document.querySelector("#time");
    var timezoneDirection = ""
    if(date.getTimezoneOffset() < 0) timezoneDirection = "+";

    const datetime = "<p>" + date.getFullYear() + "."
    + (date.getMonth()+1)  + "." 
    + date.getDate() + ".   "
    + date.getHours() + ":"
    + date.getMinutes() + ":"
    + date.getSeconds() + ` (UTC${timezoneDirection}`
    + (date.getTimezoneOffset()*-1 / 60) + ")</p>";
    
    timeContainer.innerHTML += datetime;
}