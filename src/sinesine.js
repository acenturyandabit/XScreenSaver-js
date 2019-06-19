///////sinesine/////
//How to use:
/*
If using all the animations, and you want to quickly start them all based on the default settings:
xScreenSavers.start();

If using only one or two, start them using:
handle=xScreenSavers['animation-name'](selector, settings)

To pause them, use:
handle.pause();

To resume them, use:
handle.resume();

To use them inside a shadow root, set:
settings.root=document;
*/

//Common animations controller.
if (!xScreenSavers) {
    var xScreenSavers = new (function _() {
        this.screensavers = {};
        this.start = () => {
            for (let i in this.screensavers) {
                this.screensavers[i]("." + i);
            }
        }
    })();
}

(() => {

    function item(ctx, w, h) {
        paramset = "vwpqrgb"
        this.params = {};
        for (let i = 0; i < paramset.length; i++) {
            this.params[paramset[i]] = Math.random();
        }
        this.params.w = 0.5;
        this.params.p *= 2 * Math.PI;
        this.params.q *= 2 * Math.PI;
        this.t = 0;
        this.update = function () {
            this.t += 0.04;
            this.x = Math.sin(this.params.w * this.t + this.params.p) * 0.5;
            this.y = Math.sin(this.params.v * this.t + this.params.q) * 0.5;
        }
        this.draw = function () {
            ctx.fillStyle = `rgb(${Math.abs(this.params.r) * 255},${Math.abs(this.params.g) * 255},${Math.abs(this.params.b) * 255})`;
            ctx.beginPath();
            ctx.arc((this.x + 0.5) * w, (this.y + 0.5) * h, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }










    xScreenSavers.screensavers['sinesine'] = (selector, _settings) => {
        let active = [];
        let settings = {
            root: document
        }
        Object.assign(settings, _settings);
        let things = settings.root.querySelectorAll(selector);
        for (i = 0; i < things.length; i++) {
            _e = things[i];
            e = document.createElement("canvas");
            _e.append(e);
            e.width = _e.clientWidth;
            e.height = _e.clientHeight;
            /////////////////////////////////////////////////////////////
            //INITIALISATION
            let instance = {
                data: {
                    bits: []
                },
                ctx: e.getContext('2d'),
                w: e.width,
                h: e.height
            }
            for (let i = 0; i < 30; i++) {
                instance.data.bits.push(new item(instance.ctx, instance.w, instance.h));
            }
            active.push(instance);
        }
        function loop(){
            /////////////////////////////////////////////////////////////
            /////LOOP
            active.forEach((v, i) => {
                //clear screen
                v.ctx.fillStyle = "rgba(0,0,0,0.3)";
                v.ctx.fillRect(0, 0, v.w, v.h);
                //update and draw all existing elements
                for (i = 0; i < v.data.bits.length; i++) {
                    v.data.bits[i].update();
                    v.data.bits[i].draw();
                }
            })
            window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
        return {
            pause: () => { },
            resume: () => { }
        }
    }
})();