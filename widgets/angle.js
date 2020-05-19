export class Widget {
    constructor(){
        this.subscriptions = ["position"];
        this.time = Time.getTime();
        this.angleTimes = "";
        this.angleIllumination = "";
        this.sunAngleDrawer = new angleDrawer("#sun-angle-canvas");
        this.moonAngleDrawer = new angleDrawer("#moon-angle-canvas");
        this.angleDate = document.querySelector("#angle-date");
        this.angleSun           = document.querySelector("#angle-sun");
        this.angleSunHeight     = document.querySelector("#angle-sun-height");
        this.angleMoon          = document.querySelector("#angle-moon");
        this.angleMoonHeight    = document.querySelector("#angle-moon-height");
        this.currentPosition = new Error("NO POSITION DATA");
        this.setDatePicker();
    }

    load() {

    }

    async position(position) {
        if(!(position instanceof Error)) {
            this.currentPosition = position;

            this.angleDate.innerHTML = "<b>" + this.time.toLocaleDateString() +
            " " + this.time.toLocaleTimeString() + "</b>";

            this.sunPosition = SunCalc.getPosition(this.time, position.coords.latitude, position.coords.longitude);
            this.moonPosition = SunCalc.getMoonPosition(this.time, position.coords.latitude, position.coords.longitude);
            this.sunAngleDrawer.draw(this.sunPosition.azimuth);
            this.moonAngleDrawer.draw(this.moonPosition.azimuth);

            this.angleSun.innerHTML           = (this.sunPosition.azimuth * (180/Math.PI)) + "°";
            this.angleSunHeight.innerHTML     = (this.sunPosition.altitude * (180/Math.PI)) + "°";
            this.angleMoon.innerHTML          = (this.moonPosition.azimuth * (180/Math.PI)) + "°";
            this.angleMoonHeight.innerHTML    = (this.moonPosition.altitude * (180/Math.PI)) + "°";

            if(debug) {
                console.log("getPosition");
                console.log(this.sunPosition);
                console.log("getMoonPosition");
                console.log(this.moonPosition);
            }
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
            addMinutes(_this.time, 15);
            if(debug) console.log(_this.time);
            _this.datapicker.value = _this.time.toISOString().slice(0, 10);
            if(!(_this.position instanceof Error)) {
                _this.position(_this.currentPosition);
                _this.load();
            }
        };

        this.datapickerBackwardButton = document.querySelector("#angle-datepicker-BackwardButton");
        this.datapickerBackwardButton.onclick = function() {
            addMinutes(_this.time, -15);
            if(debug) console.log(_this.time);
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

        function addMinutes(date, minutes) {
            date.setMinutes ( date.getMinutes() + minutes );
        }
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
        this.ctx.fillStyle = 'Red';
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