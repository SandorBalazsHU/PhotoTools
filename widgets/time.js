export class Widget {
    constructor(){
        this.subscriptions = ["position"];
    }
    load() {
        var digitalClock = new DigitalClock();
        digitalClock.start();
        var analogClock = new AnalogClock();
        analogClock.start();
    }
    position(position, GPSstatus) {
        console.log("getTimes");
        console.log(SunCalc.getTimes(new Date(), position.coords.latitude, position.coords.longitude));
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
        this.radius = this.radius * 0.90
    }

    start() {
        var _this = this;
        setInterval(function(){_this.drawClock();}, 1000);
    }

    drawClock() {
        this.drawFace(this.ctx, this.radius);
        this.drawNumbers(this.ctx, this.radius);
        this.drawTime(this.ctx, this.radius);
    }

    drawFace(ctx, radius) {
        var grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        grad = this.ctx.createRadialGradient(0,0,this.radius*0.95, 0,0,this.radius*1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = this.radius*0.1;
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius*0.1, 0, 2*Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
    }

    drawNumbers(ctx, radius) {
        var ang;
        var num;
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
        this.drawHand(this.ctx, hour, this.radius*0.5, this.radius*0.07);
        //minute
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        this.drawHand(this.ctx, minute, this.radius*0.8, this.radius*0.07);
        // second
        second=(second*Math.PI/30);
        this.drawHand(this.ctx, second, this.radius*0.9, this.radius*0.02);
    }

    drawHand(ctx, pos, length, width) {
        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.lineCap = "round";
        this.ctx.moveTo(0,0);
        this.ctx.rotate(pos);
        this.ctx.lineTo(0, -length);
        this.ctx.stroke();
        this.ctx.rotate(-pos);
    }
}