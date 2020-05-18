export class Widget {
    constructor(){
        this.subscriptions = ["position"];
        //this.moonPhaseDrawer = new MoonPhaseDrawer("#moon-phase-canvas");
        this.time = Time.getTime();
        /*var testTime = Time.getTime();
        testTime.setDate(testTime.getDate()+12);
        console.log(testTime);
        this.moonIllumination = SunCalc.getMoonIllumination(testTime);*/

            /*var testTime = Time.getTime();
            function test() {
                testTime.setDate(testTime.getDate()+1);
                console.log(testTime);
                console.log(SunCalc.getMoonIllumination(testTime).fraction);
                setTimeout( test, 50 );
            }
            
            test();*/
    }
    load() {
        //this.moonPhaseDrawer.print(this.moonIllumination.phase);
        var testTime = Time.getTime();
        function test() {
            testTime.setDate(testTime.getDate()+1);
            console.log(testTime);
            var moonIllumination = SunCalc.getMoonIllumination(testTime);
            var moonPhaseDrawer = new MoonPhaseDrawer("#moon-phase-canvas");
            moonPhaseDrawer.print(moonIllumination.phase);
            //setTimeout( test, 1000 );
        }
        test();
    }
    async position(position) {
        if(!(position instanceof Error)) {
            const moonTimes = SunCalc.getMoonTimes(this.time, position.coords.latitude, position.coords.longitude);
            var moonrise = document.querySelector("#moon-moonrise");
            moonrise.innerHTML += moonTimes.rise.toLocaleTimeString();
            var moonset = document.querySelector("#moon-moonset");
            moonset.innerHTML += moonTimes.set.toLocaleTimeString();
        }
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