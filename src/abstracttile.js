///////abstracttile/////
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
    var xScreenSavers = new(function _() {
        this.screensavers = {};
        this.start = () => {
            for (let i in this.screensavers) {
                this.screensavers[i]("." + i);
            }
        }
    })();
}

(() => {
    xScreenSavers.screensavers['template'] = (selector, _settings) => {
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
            active.push({
                data: {
                    bits: []
                },
                ctx: e.getContext('2d'),
                w: e.width,
                h: e.height
            });
        }
        setInterval(() => {
            active.forEach((v, i) => {
                //Generate new elements
                if (Math.random() > (1 - settings.bitprob) * Math.min((v.data.bits.length - 5) / 5, 1)) {
                    v.data.bits.push({
                        cx: v.w * 0.2 + Math.random() * v.w * 0.8,
                        cy: Math.random() * v.h,
                        dist: v.w,
                        dead: false
                    })
                }
                //clear screen
                v.ctx.fillStyle = "rgba(0,0,0,0.3)";
                v.ctx.fillRect(0, 0, v.w, v.h);
                //update and draw all existing elements

                for (i = 0; i < v.data.bits.length; i++) {
                }
                //remove old elements
                while (v.data.bits.length && v.data.bits[0].dist < -10)
                    v.data.bits.shift();
            })
        }, 100);
        return {
            pause: () => {},
            resume: () => {}
        }
    }
})();