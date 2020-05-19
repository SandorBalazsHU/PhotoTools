export class Widget {
    constructor(){
        this.subscriptions = ["position"];
        this.time = Time.getTime();
        this.moonTimes = "";
        this.moonIllumination = "";
        this.moonPhaseDrawer = new MoonPhaseDrawer("#moon-phase-canvas");
        this.moonRiseContainer = document.querySelector("#moon-moonrise");
        this.moonSetContainer = document.querySelector("#moon-moonset");
        this.moonAlvaysDawn = document.querySelector("#moon-alvays-dawn");
        this.moonAlvaysUp = document.querySelector("#moon-alvays-up");
        this.moonPhase = document.querySelector("#moon-moonphase");
        this.moonDate = document.querySelector("#moon-date");
        this.currentPosition = new Error("NO POSITION DATA");
        this.setDatePicker();
    }

    load() {
        this.moonIllumination = SunCalc.getMoonIllumination(this.time);
        this.moonPhaseDrawer.print(this.moonIllumination.phase);
        this.moonDate.innerHTML = "<b>" + this.time.toLocaleDateString() + "</b>";
        this.moonPhase.innerHTML = (this.moonIllumination.fraction*100) + "%";
        if(debug) {
            console.log("getMoonIllumination");
            console.log(this.moonIllumination);
        }
    }

    async position(position) {
        if(!(position instanceof Error)) {
            this.currentPosition = position;
            this.moonTimes = SunCalc.getMoonTimes(this.time, position.coords.latitude, position.coords.longitude);
            if(debug) {
                console.log("getMoonTimes");
                console.log(this.moonTimes);
            }
            const moonRise = this.moonTimes.rise;
            this.moonAlvaysDawn.innerHTML =        (typeof moonRise !== 'undefined') ? "" : "A hold nem kel fel.";
            this.moonRiseContainer.innerHTML = (typeof moonRise !== 'undefined') ? moonRise.toLocaleTimeString() : "--:--:--";

            const moonSet = this.moonTimes.set;
            this.moonAlvaysUp.innerHTML =       (typeof moonSet !== 'undefined') ? "" : "A hold nem nyugszik le.";
            this.moonSetContainer.innerHTML = (typeof moonSet !== 'undefined') ? moonSet.toLocaleTimeString() : "--:--:--";
        }
    }

    setDatePicker() {
        this.datapicker = document.querySelector("#moon-datepicker");
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

        this.datapickerForwardButton = document.querySelector("#moon-datepicker-ForwardButton");
        this.datapickerForwardButton.onclick = function() {
            _this.time.setDate(_this.time.getDate()+1);
            _this.datapicker.value = _this.time.toISOString().slice(0, 10);
            if(!(_this.position instanceof Error)) {
                _this.position(_this.currentPosition);
                _this.load();
            }
        };

        this.datapickerBackwardButton = document.querySelector("#moon-datepicker-BackwardButton");
        this.datapickerBackwardButton.onclick = function() {
            _this.time.setDate(_this.time.getDate()-1);
            _this.datapicker.value = _this.time.toISOString().slice(0, 10);
            if(!(_this.position instanceof Error)) {
                _this.position(_this.currentPosition);
                _this.load();
            }
        };

        this.datapickerBackwardButton = document.querySelector("#moon-datepicker-ResetButton");
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

class MoonPhaseDrawer {
    constructor(canvasID){
        this.canvas = document.querySelector(canvasID);
        this.ctx = this.canvas.getContext( '2d' );
        this.ctx.imageSmoothingEnabled = true;
        this.lineWidth = 10;
        this.radius = this.canvas.width / 2 - this.lineWidth / 2;
        this.offset = this.lineWidth / 2;
        this.darkMoonColor = "MidnightBlue";
        this.lightMoonColor = "Gold";
    }
        
    drawDisc() {
        this.ctx.translate( this.offset, this.offset ) ;
        this.ctx.beginPath();
        this.ctx.arc( this.radius, this.radius, this.radius, 0, 2 * Math.PI, true );
        this.ctx.closePath();
        this.ctx.fillStyle = this.lightMoonColor;
        this.ctx.strokeStyle = this.lightMoonColor;
        this.ctx.lineWidth = this.lineWidth;

        this.ctx.fill();			
        this.ctx.stroke();
    }
        
    drawPhase( phase ) {
        this.ctx.beginPath();
        this.ctx.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
        this.ctx.closePath();
        this.ctx.fillStyle = this.darkMoonColor;
        this.ctx.fill();

        this.ctx.translate( this.radius, this.radius );
        this.ctx.scale( phase, 1 );
        this.ctx.translate( -this.radius, -this.radius );
        this.ctx.beginPath();
        this.ctx.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
        this.ctx.closePath();
        this.ctx.fillStyle = phase > 0 ? this.lightMoonColor : this.darkMoonColor;
        this.ctx.fill();
    }
            
    /**
     * @param {Number} The phase expressed as a float in [0,1] range .
     */	
    print( phase ) {
        this.ctx.save();
        this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

        if ( phase <= 0.5 ) {
            this.drawDisc();
            this.drawPhase( 4 * phase - 1 );
        } else {
            this.ctx.translate( this.radius + 2 * this.offset, this.radius + 2 * this.offset );
            this.ctx.rotate( Math.PI );
            this.ctx.translate( -this.radius, -this.radius );

            this.drawDisc();
            this.drawPhase( 4 * ( 1 - phase ) - 1 );
        }

        this.ctx.restore();		
    }
}