///////template/////
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

// Simulates coral growth
// Code wrapped in js closure + some other stuff by acenturyandabit, 2019
// Code re-implemented from C to Javascript by negaex, 2017
// Original license:

/* coral, by "Frederick G.M. Roeber" <roeber@netscape.com>, 15-jul-97.
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation.  No representations are made about the suitability of this
 * software for any purpose.  It is provided "as is" without express or 
 * implied warranty.
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
    //Hack.
    // Random number between 0,n
    let R = function (n) {
        let r = Math.floor(Math.random() * n);
        return r;
    }

    // Shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    //p: percentage
    //n: ???
    //c: color array
    function transition(index, p, n, c) {
        p = Math.min(p, 1);
        let x = Math.floor((n - 1) * 0.99999999 * (1 - p));
        let np = (0.99999999 * p * (n - 1)) % 1;
        return Math.floor(c[x][index] * np + c[x + 1][index] * (1 - np));
    }

    // Arrays of pixels for tracking state
    Hack.prototype.getPixel = function (x, y) {
        cell = Math.floor((y * this.width + x) / this.cs);
        bit = (y * this.width + x) - cell * this.cs;
        return (this.cells[cell] & (2 << bit)) > 0;
    }
    Hack.prototype.getAlive = function (x, y) {
        cell = Math.floor((y * this.width + x) / this.cs);
        bit = (y * this.width + x) - cell * this.cs;
        return (this.coloredCells[cell] & (2 << bit)) > 0;
    }
    Hack.prototype.setPixel = function (x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {} else {
            //this.cells[x][y] = 1;
            cell = Math.floor((y * this.width + x) / this.cs);
            bit = (y * this.width + x) - cell * this.cs;
            this.cells[cell] |= (2 << bit);
        }
    }
    Hack.prototype.setAlive = function (x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

        cell = Math.floor((y * this.width + x) / this.cs);
        bit = (y * this.width + x) - cell * this.cs;
        this.coloredCells[cell] |= (2 << bit);
    }
    Hack.prototype.drawPixel = function (x, y) {
        this.drawn++;
        /*
        let id = this.context.createImageData(1,1); // only do this once per page
        let d  = id.data;                        // only do this once per page
        d[0]   = 255;
        d[1]   = 255;
        d[2]   = 9;
        d[3]   = 255;
        this.context.putImageData( id, x, y );   
        */

        this.context.fillStyle = "rgba(" +
            transition(0, this.drawn / this.maxwalkers, this.ncolors, this.colors) + "," +
            transition(1, this.drawn / this.maxwalkers, this.ncolors, this.colors) + "," +
            transition(2, this.drawn / this.maxwalkers, this.ncolors, this.colors) + "," +
            (255 / 255) + ")";
        this.context.fillRect(this.pixel * x, this.pixel * y, this.pixel, this.pixel);
    }

    Hack.prototype.configure = function () {
        config = this.config;
        this.pixel = this.config.pixel;
        this.height = Math.floor(this.canvas.height / this.pixel);
        this.width = Math.floor(this.canvas.width / this.pixel);
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle="#000000";
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.scaleX = Math.floor(this.canvas.width / this.width);
        this.scaleY = Math.floor(this.canvas.height / this.height);

        // Colors
        this.ncolors = config.colors;
        this.colors = []
        for (let i = 0; i < this.ncolors; i++) {
            a1 = R(256);
            a2 = R(256);
            if (config.density < 100) {
                a3 = Math.floor(255 - (a1 + a2) / 2);
            } else {
                a3 = R(100);
            }
            this.colors[i] = shuffleArray([a1, a2, a3]);
        }
        if (this.ncolors == 1) {
            this.colors[1] = this.colors[0];
        }

        // Density
        this.density = config.density;
        this.nwalkers = Math.floor((this.width - 2) * (this.height - 2) * config.density / 100);
        this.drawn = 0;
        this.maxwalkers = this.nwalkers;
        this.walkers = [];
        for (let i = 0; i < this.nwalkers; i++) {
            this.walkers[i] = {
                x: R(this.width),
                y: R(this.height)
            };
        }

        //cell size
        this.cs = 29
        this.cells = [];
        for (let i = 0; i < (1 + Math.floor(this.height * this.width) / this.cs); i++) {
            this.cells[i] = 0;
        }

        this.coloredCells = [];
        for (let i = 0; i < (1 + Math.floor(this.height * this.width) / this.cs); i++) {
            this.coloredCells[i] = 0;
        }

        this.seeds = config.seeds;
        for (let i = 0; i < this.seeds; i++) {
            let x, y;
            do {
                x = 2 + R(this.width - 2);
                y = 2 + R(this.height - 2);
            } while (this.getPixel(x, y));

            this.setPixel((x - 1), (y - 1));
            this.setPixel(x, (y - 1));
            this.setPixel((x + 1), (y - 1));
            this.setPixel((x - 1), y);
            this.setAlive(x, y);
            this.setPixel((x + 1), y);
            this.setPixel((x - 1), (y + 1));
            this.setPixel(x, (y + 1));
            this.setPixel((x + 1), (y + 1));
            this.drawPixel(x, y);
        }

    }

    function Hack(config) {
        this.fps = 0;
        // Used for lingering
        this.timeout;
        // Used for each frame
        this.interval;
        this.config = config;
    }








    xScreenSavers.screensavers['coral'] = (selector, _settings) => {
        let active = [];
        let settings = {
            root: document,
            selector: selector,
            pixel: 3,
            colors: 3,
            density: 30,
            seeds: 20,
            linger: 3,
            background: "#000000",
        }
        Object.assign(settings, _settings);
        let things = settings.root.querySelectorAll(selector);
        for (i = 0; i < things.length; i++) {
            let individual_settings = {};
            Object.assign(individual_settings, settings);
            individual_settings.dom = things[i];
            let hack = new Hack(individual_settings);
            let runner = function () {

                let thisLoop = new Date;

                // Finished
                if (hack.drawn >= hack.maxwalkers) {
                    clearInterval(hack.interval);
                    hack.timeout = setTimeout(() => {
                        hack.configure();
                        hack.interval = setInterval(runner, 33);
                    }, hack.config.linger * 1000);
                    return;
                }
                let i = 0;
                for (let i = 0; i < hack.nwalkers; i++) {
                    let x = hack.walkers[i].x;
                    let y = hack.walkers[i].y;
                    let outofbounds = (x <= 0 || x >= hack.width - 1 || y <= 0 || y >= hack.height - 1);
                    if (hack.getPixel(x, y) && (!hack.getAlive(x, y) || hack.density < 100) && !outofbounds) {

                        hack.drawPixel(x, y);

                        // Mark all the surrounding pixels to become black
                        hack.setPixel(x - 1, y - 1);
                        hack.setPixel(x, y - 1);
                        hack.setPixel(x + 1, y - 1);
                        hack.setPixel(x - 1, y);
                        hack.setAlive(x, y);
                        hack.setPixel(x + 1, y);
                        hack.setPixel(x - 1, y + 1);
                        hack.setPixel(x, y + 1);
                        hack.setPixel(x + 1, y + 1);

                        if (hack.density < 100) {
                            // One less walker
                            hack.nwalkers--;

                            // Move last walker to this position
                            hack.walkers[i].x = hack.walkers[hack.nwalkers].x;
                            hack.walkers[i].y = hack.walkers[hack.nwalkers].y;
                        }

                    } else {

                        do {
                            switch (R(4)) {
                                case 0:
                                    if (hack.walkers[i].x <= 1) continue;
                                    hack.walkers[i].x--;
                                    break;
                                case 1:
                                    if (hack.walkers[i].x >= (hack.width - 2)) continue;
                                    hack.walkers[i].x++;
                                    break;
                                case 2:
                                    if (hack.walkers[i].y <= 1) continue;
                                    hack.walkers[i].y--;
                                    break;
                                default:
                                    if (hack.walkers[i].y >= (hack.height - 2)) continue;
                                    hack.walkers[i].y++;
                                    break;
                            }
                        } while (0);
                    }
                }
            }
            hack.dom = individual_settings.dom;
            hack.canvas = document.createElement("canvas");
            hack.canvas.width = hack.dom.clientWidth;
            hack.canvas.height = hack.dom.clientHeight;
            hack.dom.appendChild(hack.canvas);
            hack.configure();
            hack.interval = setInterval(runner, 33);
        }
        return {
            pause: () => {},
            resume: () => {}
        }
    }
})();