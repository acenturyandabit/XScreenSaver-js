///////roscharch/////
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

// Rorschach
// Code re-implemented from C to Javascript by negaex, 2017
// Original license:

/* xscreensaver, Copyright (c) 1992-2014 Jamie Zawinski <jwz@jwz.org>
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation.  No representations are made about the suitability of this
 * software for any purpose.  It is provided "as is" without express or 
 * implied warranty.
 *
 * 19971004: Johannes Keukelaar <johannes@nada.kth.se>: Use helix screen
 *           eraser.
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
    // setup(config) runs everytime the animation is restarted
    Hack.prototype.setup = function (config) {
        // clearInterval(hack.interval);

        // Configure canvas
        this.pixel = config.pixel;
        this.height = Math.floor(this.canvas.height / this.pixel);
        this.width = Math.floor(this.canvas.width / this.pixel);

        // Colors
        let colour = [];
        colour[0] = R(256);
        colour[1] = R(256);
        colour[2] = Math.floor(255 - (colour[0] + colour[1]) / 2);
        this.colour = shuffleArray(colour);

        // Iteration
        // this.iteration = config.iterations;
        this.remaining_iterations = config.iterations;
        this.offset = config.offset;

        // Symmetry
        this.xsym = config.xsym;
        this.ysym = config.ysym;
        this.xlim = this.width;
        this.ylim = this.height;

        this.current_x = this.xlim / 2;
        this.current_y = this.ylim / 2;
    }

    // Runs 30 times a second
    Hack.prototype.loop = function () {
        if (this.hold)return;
        // Number of dots to add this iteration
        let iter_chunk = this.config.speed * 3;
        let points = [];
        let x = this.current_x;
        let y = this.current_y;
        let i, j = 0;

        for (i = 0; i < 4 * iter_chunk; i++) {
            points[i] = new point(0, 0);
        }

        // Don't go over target # of points
        let this_iterations = iter_chunk;
        if (this_iterations > this.remaining_iterations) {
            this_iterations = this.remaining_iterations;
        }

        // Draw a dot and move
        for (i = 0; i < this_iterations; i++) {

            // Moving logic
            x += (R(1 + (this.offset << 1))) - this.offset;
            y += (R(1 + (this.offset << 1))) - this.offset;

            // Allow dot to go outside screen by 100 pixels
            x = Math.max(-100, x);
            x = Math.min(this.width + 100, x);
            y = Math.max(-100, y);
            y = Math.min(this.height + 100, y);

            points[j].x = x;
            points[j].y = y;
            j++;

            // Symmetries
            if (this.xsym) {
                points[j].x = this.xlim - x;
                points[j].y = y;
                j++;
            }
            if (this.ysym) {
                points[j].x = x;
                points[j].y = this.ylim - y;
                j++;
            }
            if (this.xsym && this.ysym) {
                points[j].x = this.xlim - x;
                points[j].y = this.ylim - y;
                j++;
            }
        }
        for (i = 0; i < points.length; i++) {
            this.draw_pixel(points[i], this.colour);
        }
        this.remaining_iterations -= this_iterations;
        this.current_x = x;
        this.current_y = y;
        if (this.remaining_iterations <= 0) {
            let me=this;
            this.hold=true;
            setTimeout(()=>{me.restart()},me.timeout*1000);
        }
    }





    // Hack-general functions
    // TODO: Consider moving to seperate file for reuse
    let R = function (n) {
        let r = Math.floor(Math.random() * n);
        return r;
    }

    let point = function (x, y) {
        this.x = x;
        this.y = y;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    Hack.prototype.draw_pixel = function (point, colour) {
        this.context.fillStyle = "rgba(" +
            colour[0] + "," +
            colour[1] + "," +
            colour[2] + "," +
            (255 / 255) + ")";
        this.context.fillRect(this.pixel * point.x, this.pixel * point.y,
            this.pixel, this.pixel);
    }


    // Also consider moving to seperate file

    Hack.prototype.restart = function () {
        this.context.fillStyle=this.canvas.style.backgroundColor;
        this.context.fillRect(0,0,this.width,this.height);
        this.setup(this.config);
        this.hold=false;
    }

    function Hack(config) {
        this.fps = 0;
        this.frame_time = new Date;
        // Used for lingering
        this.timeout=config.linger;
        // Used for each frame
        this.interval;
        this.config = config;
    }

    xScreenSavers.screensavers['rorschach'] = (selector, _settings) => {
        let active = [];
        let settings = {
            root: document,
            selector: selector,
            pixel: 1,
            background: 'rgba(0,0,0,0.5)',
            iterations: 10000,
            xsym: true,
            ysym: false,
            linger: 2,
            offset: 4,
            speed: 25,
        }
        Object.assign(settings, _settings);
        let things = settings.root.querySelectorAll(selector);
        for (i = 0; i < things.length; i++) {
            let individual_settings = {};
            Object.assign(individual_settings, settings);
            individual_settings.dom = things[i];
            let hack = new Hack(individual_settings);
            hack.dom = individual_settings.dom;
            hack.canvas = document.createElement("canvas");
            hack.canvas.width = hack.dom.clientWidth;
            hack.canvas.height = hack.dom.clientHeight;
            hack.context = hack.canvas.getContext('2d');
            hack.canvas.style.backgroundColor = individual_settings.background;
            hack.dom.appendChild(hack.canvas);
            hack.restart();
            // 33 fps
            hack.interval = setInterval(()=>{hack.loop()}, 33);
        }
        return {
            pause: () => {},
            resume: () => {}
        }
    }
})();