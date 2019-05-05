function JQInit(_f) {
    if (typeof jQuery == 'undefined') {
        // preinject jquery so that noone else after us is going to
        //inject jquery
        scr = document.createElement("script");
        scr.src = src = "https://code.jquery.com/jquery-3.3.1.slim.min.js";
        document.getElementsByTagName("head")[0].appendChild(scr);
        jQuery = "";
    }
    if (typeof jQuery == 'string') {
        function tryStartJQ(f) {
            if (typeof jQuery != 'string' && typeof jQuery != 'undefined') f();
            else setTimeout(() => {
                tryStartJQ(f)
            }, 1000);
        }
        document.addEventListener("ready", tryStartJQ(_f));
    } else {
        $(_f);
    }
}
JQInit(startcolorCycle);


function startcolorCycle() {
    colorCycles = [];
    $(".colorCycle").each((i, _e) => {
        backimg = document.createElement("img");
        backimg.src = "eevee.png";
        backimg.style.display = "none";
        _e.append(backimg);
        e = document.createElement("canvas");
        _e.append(e);
        slen = _e.clientHeight;
        if (slen > _e.clientWidth) slen = e.clientWidth;
        e.width = _e.clientWidth;
        e.height = _e.clientHeight;
        colorCycles.push({
            e:e,
            data: {
                col: 0
            },
            img: backimg,
            ctx: e.getContext('2d'),
            cx: e.width / 2,
            cy: e.height / 2,
        });
    });
    setInterval(() => {
        colorCycles.forEach((v, i) => {
            //draw original image
            v.ctx.globalCompositeOperation="source-over";
            v.ctx.drawImage(v.img,0,0,v.e.width, v.e.height);
            //hue update
            v.data.col++;
            v.data.col%=255;
            //hue cycle
            v.ctx.globalCompositeOperation="hue";
            v.ctx.fillRect(0,0,v.e.width, v.e.height);
        })
    }, 100)
}