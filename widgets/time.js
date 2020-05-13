export class Widget {
    constructor(){
        this.subscriptions = ["position"];
        this.digitalClock = new DigitalClock();
        this.analogClock = new AnalogClock();
    }
    load() {
        this.digitalClock.start();
        this.analogClock.start();
    }
    async position(position) {
        if(!(position instanceof Error)) {
            console.log("getTimes");
            console.log(SunCalc.getTimes(new Date(), position.coords.latitude, position.coords.longitude));
            this.analogClock.setSunDatas(SunCalc.getTimes(new Date(), position.coords.latitude, position.coords.longitude));
            console.log("getPosition");
            console.log(SunCalc.getPosition(new Date(), position.coords.latitude, position.coords.longitude));
            console.log("getMoonPosition");
            console.log(SunCalc.getMoonPosition(new Date(), position.coords.latitude, position.coords.longitude));
            console.log("getMoonIllumination");
            console.log(SunCalc.getMoonIllumination(new Date()));
            console.log("getMoonTimes");
            console.log(SunCalc.getMoonTimes(new Date(), position.coords.latitude, position.coords.longitude));
        }
    }
}

class DigitalClock {
    constructor() {
        this.timeContainer = document.querySelector("#time-digital-clock");
    }

    start() {
        var _this = this;
        setInterval(function(){_this.printClock();}, 1000);
    }

    printClock() {
        const time = Time.getTime();
        const datetime = "<p>"
        + time.getFullYear() + "."
        + (time.getMonth()+1)  + "." 
        + time.getDate() + ".   "
        + time.getHours() + ":"
        + time.getMinutes() + ":"
        + time.getSeconds() + " ("
        + Time.getTimeZoneString(time) + ")</p>";
        this.timeContainer.innerHTML = datetime;
    }
}

class AnalogClock {
    constructor() {
        this.timeCanvas = document.querySelector("#time-analog-clock-canvas");
        this.ctx = this.timeCanvas.getContext("2d");
        this.radius = this.timeCanvas.height / 2;
        this.ctx.translate(this.radius, this.radius);
        this.radius = this.radius * 0.90;
        this.sunDatasAviable = false;
        this.sundatas = "";
    }

    setSunDatas(datas) {
        this.sundatas = datas;
        this.sunDatasAviable = true;
    }

    start() {
        var _this = this;
        setInterval(function(){_this.drawClock();}, 1000);
    }

    drawClock() {
        this.drawFace(this.ctx, this.radius);
        if(this.sunDatasAviable){
            this.drawMarker(this.ctx, this.sundatas.goldenHour, this.sundatas.sunset, "Gold", "Goldenrod");
            this.drawMarker(this.ctx, this.sundatas.sunsetStart, this.sundatas.sunset, "Orange", "DarkOrange");
            this.drawMarker(this.ctx, this.sundatas.sunset, this.sundatas.dusk, "RoyalBlue", "Blue");
            this.drawMarker(this.ctx, this.sundatas.dusk, this.sundatas.nauticalDusk, "MidnightBlue", "Navy");
            this.drawMarker(this.ctx, this.sundatas.night, this.sundatas.nightEnd, "MidnightBlue", "Navy");
            this.drawMarker(this.ctx, this.sundatas.nauticalDawn, this.sundatas.dawn, "RoyalBlue", "Blue");
            /*this.drawMarker(this.ctx, this.sundatas.sunrise, this.sundatas.sunriseEnd, "Orange", "DarkOrange");
            this.drawMarker(this.ctx, this.sundatas.sunriseEnd, this.sundatas.goldenHour, "Gold", "Goldenrod");*/
            /*var fromPosition = this.getPositionOnClock(from);
            this.drawHand(this.ctx, fromPosition, this.radius*0.75, this.radius*0.02, "Yellow");*/
        }
        this.drawNumbers(this.ctx, this.radius);
        this.drawTime(this.ctx, this.radius);
        this.drawCenter(this.ctx, this.radius);
    }

    drawFace(ctx, radius) {
        var grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        this.ctx.fillStyle = 'Gainsboro';
        this.ctx.fill();
        grad = this.ctx.createRadialGradient(0,0,this.radius*0.95, 0,0,this.radius*1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = this.radius*0.1;
        this.ctx.stroke();
    }

    drawCenter(ctx, radius) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius*0.1, 0, 2*Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
    }

    drawNumbers(ctx, radius) {
        var ang;
        var num;
        this.ctx.fillStyle = '#333';
        this.ctx.font = this.radius*0.15 + "px arial";
        this.ctx.textBaseline="middle";
        this.ctx.textAlign="center";
        for(num = 1; num < 13; num++) {
            ang = num * Math.PI / 6;
            this.ctx.rotate(ang);
            this.ctx.translate(0, -this.radius*0.85);
            this.ctx.rotate(-ang);
            this.ctx.fillText(num.toString(), 0, 0);
            this.ctx.rotate(ang);
            this.ctx.translate(0, this.radius*0.85);
            this.ctx.rotate(-ang);
        }
    }

    drawTime(ctx, radius){
        var now = Time.getTime();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        //hour
        hour=hour%12;
        hour=(hour*Math.PI/6)+
        (minute*Math.PI/(6*60))+
        (second*Math.PI/(360*60));
        this.drawHand(this.ctx, hour, this.radius*0.5, this.radius*0.07, 'black');
        //minute
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        this.drawHand(this.ctx, minute, this.radius*0.8, this.radius*0.07, 'black');
        // second
        second=(second*Math.PI/30);
        this.drawHand(this.ctx, second, this.radius*0.9, this.radius*0.02, 'black');
    }

    drawHand(ctx, pos, length, width, color) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = "round";
        this.ctx.moveTo(0,0);
        this.ctx.rotate(pos);
        this.ctx.lineTo(0, -length);
        this.ctx.stroke();
        this.ctx.rotate(-pos);
    }

    drawMarker(ctx, from, to, color, borderColor) {
        this.ctx.globalAlpha = 0.2;
        var fromPosition = this.getPositionOnClock(from);
        this.drawHand(this.ctx, fromPosition, this.radius*0.75, this.radius*0.02, borderColor);
        var toPosition = this.getPositionOnClock(to);
        this.drawHand(this.ctx, toPosition, this.radius*0.75, this.radius*0.02, borderColor);
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.radius/2;
        this.ctx.lineCap = "butt";
        this.ctx.arc(0, 0, this.radius/2, fromPosition-(Math.PI/2), toPosition-(Math.PI/2));
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
    }

    getPositionOnClock(time) {
        var hour = time.getHours();
        var minute = time.getMinutes();
        var second = time.getSeconds();
        hour=hour%12;
        hour=(hour*Math.PI/6)+
        (minute*Math.PI/(6*60))+
        (second*Math.PI/(360*60));
        return hour;
    }
}