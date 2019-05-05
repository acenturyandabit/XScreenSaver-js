///////////////bitstream/////////
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
    xScreenSavers.screensavers['bitstream'] = (selector, _settings) => {
        bitstreams = [];
        settings = {
            spacing: 1,
            stripcount: 6,
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
            //e.height = (v.chipsize + settings.spacing) * settings.stripcount;
            //clear the screen on first run
            _ctx = e.getContext('2d');
            _ctx.fillStyle = "black";
            _ctx.fillRect(0, 0, e.clientWidth, e.clientHeight);
            bitstreams.push({
                data: {
                    selfc: e,
                    pos: 0
                },
                ctx: _ctx,
                chipheight: e.height / settings.stripcount - settings.spacing,
                chipwidth: e.width / settings.stripcount - settings.spacing,
                h: e.height
            });
        }
        setInterval(() => {
            bitstreams.forEach((v, i) => {
                //Generate bit
                v.ctx.fillStyle = "rgb(0," + Math.floor(Math.random() * 255) + ",0)";
                v.ctx.fillRect(settings.spacing, (v.chipheight + settings.spacing) *
                    v.data.pos + 1, v.chipwidth, v.chipheight);
                v.data.pos++;
                //iterate
                if (v.data.pos > settings.stripcount) {
                    v.data.pos = 0;
                    v.ctx.drawImage(v.data.selfc, v.chipwidth + settings.spacing,
                        0);
                    v.ctx.fillStyle = "black";
                    v.ctx.fillRect(0, 0, v.chipwidth +
                        settings.spacing, v.h);
                }
            })
        }, 100)
        return {
            pause: () => {},
            resume: () => {}
        }
    }
})();