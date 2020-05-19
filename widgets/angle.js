export class Widget {
    constructor(){
        this.subscriptions = ["position"];
        this.time = Time.getTime();
        this.angleTimes = "";
        this.angleIllumination = "";
        this.sunAngleDrawer = new angleDrawer("#sun-angle-canvas");
        this.moonAngleDrawer = new angleDrawer("#moon-angle-canvas");
        this.angleDate = document.querySelector("#angle-date");
        this.currentPosition = new Error("NO POSITION DATA");
        this.setDatePicker();
    }

    load() {

    }

    async position(position) {
        if(!(position instanceof Error)) {
            this.currentPosition = position;

            this.angleDate.innerHTML = "<b>" + this.time.toLocaleDateString() + "</b>";

            this.sunPosition = SunCalc.getPosition(this.time, position.coords.latitude, position.coords.longitude);
            this.moonPosition = SunCalc.getMoonPosition(this.time, position.coords.latitude, position.coords.longitude);
            this.sunAngleDrawer.draw(this.sunPosition.azimuth);
            this.moonAngleDrawer.draw(this.moonPosition.azimuth);

            if(debug) {
                console.log("getPosition");
                console.log(this.sunPosition);
                console.log("getMoonPosition");
                console.log(this.moonPosition);
            }

            /*const angleRise = this.angleTimes.rise;
            this.angleAlvaysDawn.innerHTML =        (typeof angleRise !== 'undefined') ? "" : "A hold nem kel fel.";
            this.angleRiseContainer.innerHTML = (typeof angleRise !== 'undefined') ? angleRise.toLocaleTimeString() : "--:--:--";

            const angleSet = this.angleTimes.set;
            this.angleAlvaysUp.innerHTML =       (typeof angleSet !== 'undefined') ? "" : "A hold nem nyugszik le.";
            this.angleSetContainer.innerHTML = (typeof angleSet !== 'undefined') ? angleSet.toLocaleTimeString() : "--:--:--";*/
        }
    }

    setDatePicker() {
        this.datapicker = document.querySelector("#angle-datepicker");
        this.datapicker.defaultValue = this.time.toISOString().slice(0, 10);
        var _this = this;
        this.datapicker.onchange = function() {
            var now = new Date(_this.datapicker.value);
            _this.time.setFullYear(now.getFullYear());
            _this.time.setMonth(now.getMonth());
            _this.time.setDate(now.getDate());
            if(!(_this.position instanceof Error)) {
                _this.position(_this.currentPosition);
                _this.load();
            }
        };

        this.datapickerForwardButton = document.querySelector("#angle-datepicker-ForwardButton");
        this.datapickerForwardButton.onclick = function() {
            _this.time.setDate(_this.time.getDate()+1);
            _this.datapicker.value = _this.time.toISOString().slice(0, 10);
            if(!(_this.position instanceof Error)) {
                _this.position(_this.currentPosition);
                _this.load();
            }
        };

        this.datapickerBackwardButton = document.querySelector("#angle-datepicker-BackwardButton");
        this.datapickerBackwardButton.onclick = function() {
            _this.time.setDate(_this.time.getDate()-1);
            _this.datapicker.value = _this.time.toISOString().slice(0, 10);
            if(!(_this.position instanceof Error)) {
                _this.position(_this.currentPosition);
                _this.load();
            }
        };

        this.datapickerBackwardButton = document.querySelector("#angle-datepicker-ResetButton");
        this.datapickerBackwardButton.onclick = function() {
            _this.time.setTime(Time.getTime().getTime());
            _this.datapicker.value = _this.time.toISOString().slice(0, 10);
            if(!(_this.position instanceof Error)) {
                _this.position(_this.currentPosition);
                _this.load();
            }
        };
    }
}

class angleDrawer {
    constructor(containerID) {
        this.timeCanvas = document.querySelector(containerID);
        this.ctx = this.timeCanvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = true;
        this.radius = this.timeCanvas.height / 2;
        this.ctx.translate(this.radius, this.radius);
        this.radius = this.radius * 0.90;
        this.angle = "";
    }

    draw(angle) {
        this.drawFace(this.ctx, this.radius);
        this.drawNumbers(this.ctx, this.radius);
        this.drawMarks(this.ctx, this.radius);
        this.drawAngle(angle);
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
        for(num = 0; num < 12; num++) {
            ang = num * Math.PI / 6;
            this.ctx.rotate(ang);
            this.ctx.translate(0, -this.radius*0.8);
            this.ctx.rotate(-ang);
            this.ctx.fillText((num*30).toString(), 0, 0);
            this.ctx.rotate(ang);
            this.ctx.translate(0, this.radius*0.8);
            this.ctx.rotate(-ang);
        }
    }

    drawMarks(ctx, radius) {
        var ang;
        var num;
        this.ctx.fillStyle = '#333';
        this.ctx.font = this.radius*0.15 + "px arial";
        this.ctx.textBaseline="middle";
        this.ctx.textAlign="center";
        for(num = 0; num < 8; num++) {
            ang = num * Math.PI / 4;
            this.ctx.rotate(ang);
            this.ctx.translate(0, -this.radius*0.5);
            this.ctx.rotate(-ang);
            this.ctx.fillText(getAngleName(num*45), 0, 0);
            this.ctx.rotate(ang);
            this.ctx.translate(0, this.radius*0.5);
            this.ctx.rotate(-ang);
            this.drawHand(this.ctx, ang, this.radius*0.96, this.radius*0.02, '#999');
        }

        function getAngleName(angle) {
            var name = "";
            switch (angle) {
                case 0:
                    name = "É";
                    break;
                case 45:
                    name = "ÉK";
                    break;
                case 90:
                    name = "K";
                    break;
                case 135:
                    name = "DK";
                    break;
                case 180:
                    name = "D";
                    break;
                case 225:
                    name = "DNY";
                    break;
                case 270:
                    name = "NY";
                    break;
                case 315:
                    name = "ÉNY";
            }
            return name;
        }
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

    drawAngle(angle) {
        this.drawHand(this.ctx, angle-Math.PI, this.radius*0.94, this.radius*0.07, '#333');
    }
}










class AnalogSunClock {
    constructor(containerID) {
        this.timeCanvas = document.querySelector(containerID);
        this.ctx = this.timeCanvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = true;
        this.radius = this.timeCanvas.height / 2;
        this.ctx.translate(this.radius, this.radius);
        this.radius = this.radius * 0.90;
        this.angle = "";
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