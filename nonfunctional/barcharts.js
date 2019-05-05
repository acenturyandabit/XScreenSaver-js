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

JQInit(startBarCharts);

function randcol() {
	var output = "#00";
	var ac_char = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'];
	for (var i = 0; i < 2; i++) {
		output += ac_char[Math.floor(Math.random() * 17)];
	}
	output += "00";
	return output;
}
barchartSettings = {
    barWidth: 30,
}
barchartCore = [];


///////barchartCore
function startBarCharts() {
	$(".barcharts").each((i, e) => {
		canvas = document.createElement("canvas");
		canvas.width = e.clientWidth;
		canvas.height = e.clientHeight;
		e.appendChild(barcanvas);
        ctx = canvas.getContext('2d');
        barray=[];
        for (i=0;i<canvas.width/barchartSettings.barWidth;i++)barray.push(Math.random()*canvas.height);
		barchartCore.push({
			ctx: ctx,
			e: canvas,
			phase:0,
			data: {
				bars:barray
			}
		});
	})
	setInterval(() => {
		barchartCore.forEach((v, i) => {
			v.ctx.fillStyle = 'black';
			v.ctx.fillRect(0, 0, v.e.width, v.e.height);
            //update and draw
            v.ctx.fillStyle = 'green';
			for (var i = 0; i < v.data.bars.length; i++) {
                v.ctx.fillRect(i*barchartSettings.barWidth,v.data.bars[i],barchartSettings.barWidth,e.clientHeight-v.data.bars[i]);
                
			}
			//draw centre circle
			//draw eye mask

		});
	},100)
}