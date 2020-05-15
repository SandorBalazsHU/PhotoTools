export class Widget {
    constructor(){
        this.subscriptions = ["position"];
        this.digitalClock = new DigitalClock();
        this.analogSunClock = new AnalogSunClock();
        this.digitalSunClock = new DigitalSunClock();
    }
    load() {
        this.digitalClock.start();
        this.analogSunClock.start();
        this.digitalSunClock.print();
    }
    async position(position) {
        if(!(position instanceof Error)) {
            const time = Time.getTime();
            const sunTimes = SunCalc.getTimes(time, position.coords.latitude, position.coords.longitude);
            this.analogSunClock.setSunTimes(sunTimes);
            this.digitalSunClock.setSunTimes(sunTimes);

            console.log("getTimes");
            console.log(sunTimes);
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
        this.timeContainer = document.querySelector("#digital-clock");
    }

    start() {
        var _this = this;
        setInterval(function(){_this.print();}, 1000);
    }

    print() {
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

class AnalogSunClock {
    constructor() {
        this.timeCanvas = document.querySelector("#analog-sun-clock-canvas");
        this.ctx = this.timeCanvas.getContext("2d");
        this.radius = this.timeCanvas.height / 2;
        this.ctx.translate(this.radius, this.radius);
        this.radius = this.radius * 0.90;
        this.sunTimesAviable = false;
        this.sunTimes = "";
    }

    setSunTimes(times) {
        this.sunTimes = times;
        this.sunTimesAviable = true;
    }

    start() {
        var _this = this;
        setInterval(function(){_this.drawClock();}, 1000);
    }

    drawClock() {
        this.drawFace(this.ctx, this.radius);
        this.drawSunClock();
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
        this.drawHand(this.ctx, hour, this.radius*0.5, this.radius*0.07, '#333');
        //minute
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        this.drawHand(this.ctx, minute, this.radius*0.8, this.radius*0.07, '#333');
        // second
        second=(second*Math.PI/30);
        this.drawHand(this.ctx, second, this.radius*0.9, this.radius*0.02, '#333');
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

    drawMarker(ctx, from, to, color) {
        var fromPosition = this.getPositionOnClock(from);
        var toPosition = this.getPositionOnClock(to);
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.radius/2;
        this.ctx.lineCap = "butt";
        this.ctx.arc(0, 0, this.radius/2, fromPosition-(Math.PI/2), toPosition-(Math.PI/2));
        this.ctx.stroke();
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

    /*
        sunrise         sunrise (top edge of the sun appears on the horizon)
        sunriseEnd      sunrise ends (bottom edge of the sun touches the horizon)
        goldenHourEnd   morning golden hour (soft light, best time for photography) ends
        solarNoon	    solar noon (sun is in the highest position)
        goldenHour	    evening golden hour starts
        sunsetStart	    sunset starts (bottom edge of the sun touches the horizon)
        sunset	        sunset (sun disappears below the horizon, evening civil twilight starts)
        dusk	        dusk (evening nautical twilight starts)
        nauticalDusk	nautical dusk (evening astronomical twilight starts)
        night	        night starts (dark enough for astronomical observations)
        nadir	        nadir (darkest moment of the night, sun is in the lowest position)
        nightEnd	    night ends (morning astronomical twilight starts)
        nauticalDawn	nautical dawn (morning nautical twilight starts)
        dawn	        dawn (morning nautical twilight ends, morning civil twilight starts)
     */
    drawSunClock() {
        if(this.sunTimesAviable) {
            var midnight = Time.getTime();
            midnight.setHours(0);
            midnight.setMinutes(0);
            midnight.setSeconds(0);
            //Golden hour evening.
            this.drawMarker(this.ctx, this.sunTimes.goldenHour, this.sunTimes.sunset, "Gold");
            //Sunset.
            this.drawMarker(this.ctx, this.sunTimes.sunsetStart, this.sunTimes.sunset, "OrangeRed");
            //Twilight evening.
            this.drawMarker(this.ctx, this.sunTimes.sunset, this.sunTimes.dusk, "SkyBlue");
            //Nautical twilight evening.
            this.drawMarker(this.ctx, this.sunTimes.dusk, this.sunTimes.nauticalDusk, "DodgerBlue");
            //Astronomical twilight evening.
            this.drawMarker(this.ctx, this.sunTimes.nauticalDusk, this.sunTimes.night, "RoyalBlue");
            //Night
            this.drawMarker(this.ctx, this.sunTimes.night, this.sunTimes.nightEnd, "MidnightBlue");
            //Astronomical twilight morning.
            this.drawMarker(this.ctx, this.sunTimes.nightEnd, this.sunTimes.nauticalDawn, "RoyalBlue");
            //Nautical twilight morning.
            this.drawMarker(this.ctx, this.sunTimes.nauticalDawn, this.sunTimes.dawn, "DodgerBlue");
            //Twilight morning.
            this.drawMarker(this.ctx, this.sunTimes.dawn, this.sunTimes.sunrise, "SkyBlue");
            //Sunrise
            this.drawMarker(this.ctx, this.sunTimes.sunrise, this.sunTimes.sunriseEnd, "OrangeRed");
            //Golden hour morning.
            this.drawMarker(this.ctx, this.sunTimes.sunriseEnd, this.sunTimes.goldenHourEnd, "Gold");
            //Astronomical noon.
            var solarNoonPosition = this.getPositionOnClock(this.sunTimes.solarNoon);
            this.drawHand(this.ctx, solarNoonPosition, this.radius*0.75, this.radius*0.02, "Gold");
        }
    }
}

class DigitalSunClock {
    constructor() {
        this.eveningGoldenHourStart             = document.querySelector("#digital-sun-clock-eveningGoldenHourStart");
        this.eveningGoldenHourEnd               = document.querySelector("#digital-sun-clock-eveningGoldenHourEnd");
        this.sunsetStart                        = document.querySelector("#digital-sun-clock-sunsetStart");
        this.sunsetEnd                          = document.querySelector("#digital-sun-clock-sunsetEnd");
        this.eveningTwilightStart               = document.querySelector("#digital-sun-clock-eveningTwilightStart");
        this.eveningTwilightEnd                 = document.querySelector("#digital-sun-clock-eveningTwilightEnd");
        this.eveningNauticalTwilightStart       = document.querySelector("#digital-sun-clock-eveningNauticalTwilightStart");
        this.eveningNauticalTwilightEnd         = document.querySelector("#digital-sun-clock-eveningNauticalTwilightEnd");
        this.eveningAstronomicalTwilightStart   = document.querySelector("#digital-sun-clock-eveningAstronomicalTwilightStart");
        this.eveningNightStart                  = document.querySelector("#digital-sun-clock-eveningNightStart");
        this.eveningNightEnd                    = document.querySelector("#digital-sun-clock-eveningNightEnd");
        this.eveningAstronomicalTwilightEnd     = document.querySelector("#digital-sun-clock-eveningAstronomicalTwilightEnd");
        this.morningAstronomicalTwilightStart   = document.querySelector("#digital-sun-clock-morningAstronomicalTwilightStart");
        this.morningAstronomicalTwilightEnd     = document.querySelector("#digital-sun-clock-morningAstronomicalTwilightEnd");
        this.morningNauticalTwilightStart       = document.querySelector("#digital-sun-clock-morningNauticalTwilightStart");
        this.morningNauticalTwilightEnd         = document.querySelector("#digital-sun-clock-morningNauticalTwilightEnd");
        this.morningTwilightStart               = document.querySelector("#digital-sun-clock-morningTwilightStart");
        this.morningTwilightEnd                 = document.querySelector("#digital-sun-clock-morningTwilightEnd");
        this.sunriseStart                       = document.querySelector("#digital-sun-clock-sunriseStart");
        this.sunriseEnd                         = document.querySelector("#digital-sun-clock-sunriseEnd");
        this.morningGoldenHourStart             = document.querySelector("#digital-sun-clock-morningGoldenHourStart");
        this.morningGoldenHourEnd               = document.querySelector("#digital-sun-clock-morningGoldenHourEnd");
        this.sunTimesAviable = false;
        this.sunTimes = "";
    }

    setSunTimes(times) {
        this.sunTimes = times;
        this.sunTimesAviable = true;
        this.print();
    }

    print() {
        if(this.sunTimesAviable) {
            this.eveningGoldenHourStart.innerHTML           = this.sunTimes.goldenHour.toLocaleTimeString();
            this.eveningGoldenHourEnd.innerHTML             = this.sunTimes.sunset.toLocaleTimeString();
            this.sunsetStart.innerHTML                      = this.sunTimes.sunsetStart.toLocaleTimeString();
            this.sunsetEnd.innerHTML                        = this.sunTimes.sunset.toLocaleTimeString();
            this.eveningTwilightStart.innerHTML             = this.sunTimes.sunset.toLocaleTimeString();
            this.eveningTwilightEnd.innerHTML               = this.sunTimes.dusk.toLocaleTimeString();
            this.eveningNauticalTwilightStart.innerHTML     = this.sunTimes.dusk.toLocaleTimeString();
            this.eveningNauticalTwilightEnd.innerHTML       = this.sunTimes.nauticalDusk.toLocaleTimeString();
            this.eveningAstronomicalTwilightStart.innerHTML = this.sunTimes.nauticalDusk.toLocaleTimeString();
            this.eveningNightStart.innerHTML                = this.sunTimes.night.toLocaleTimeString();
            this.eveningNightEnd.innerHTML                  = this.sunTimes.night.toLocaleTimeString();
            this.eveningAstronomicalTwilightEnd.innerHTML   = this.sunTimes.nightEnd.toLocaleTimeString();
            this.morningAstronomicalTwilightStart.innerHTML = this.sunTimes.nightEnd.toLocaleTimeString();
            this.morningAstronomicalTwilightEnd.innerHTML   = this.sunTimes.nauticalDawn.toLocaleTimeString();
            this.morningNauticalTwilightStart.innerHTML     = this.sunTimes.nauticalDawn.toLocaleTimeString();
            this.morningNauticalTwilightEnd.innerHTML       = this.sunTimes.dawn.toLocaleTimeString();
            this.morningTwilightStart.innerHTML             = this.sunTimes.dawn.toLocaleTimeString();
            this.morningTwilightEnd.innerHTML               = this.sunTimes.sunrise.toLocaleTimeString();
            this.sunriseStart.innerHTML                     = this.sunTimes.sunrise.toLocaleTimeString();
            this.sunriseEnd.innerHTML                       = this.sunTimes.sunriseEnd.toLocaleTimeString();
            this.morningGoldenHourStart.innerHTML           = this.sunTimes.sunriseEnd.toLocaleTimeString();
            this.morningGoldenHourEnd.innerHTML             = this.sunTimes.goldenHourEnd.toLocaleTimeString();
        }
    }
}