/**
*
*
*/
var Heart = function ( position, size ) {
	this.position = (position && position.clone()) || new Vector2();
	this.size = size || 10;
}
/**
*
* type : Descartes , Pop, Peach
* 参考：http://blog.csdn.net/decting/article/details/8580634
*/
Heart.prototype.draw = function (context, color, type, diff) {
	var delta = 0, 
		alpha = 0, 
		i,
	 	diff = diff || 1000, 
	 	track = new Vector2();
	context.save();
	context.translate(this.position.x, this.position.y);
	context.scale(1, -1);
	context.strokeStyle = color || "#ffffff";
	context.beginPath();
	switch( type ){
		case "Descartes":
            alpha = 0;
			delta = 2 * Math.PI / diff; 
			for ( i = 0; i < diff; i++) {
				alpha += delta;
				track.x = 2 * this.size * (Math.sin(alpha) - 1 / 2 * Math.sin(2 * alpha));
				track.y = 2 * this.size * (Math.cos(alpha) - 1 / 2 * Math.cos(2 * alpha));
				context.lineTo(track.x, track.y);
			};
			break;
		case "Pop":
            alpha = 0;
			delta = 60 / diff;
			for ( i = 0; i < diff; i++) {
				alpha += delta;
				track.x =  this.size * 0.01 * (- alpha * alpha + 40*alpha + 1200)*Math.sin(alpha*Math.PI/180) ;
				track.y =  this.size * 0.01 * (- alpha * alpha + 40*alpha + 1200)*Math.cos(alpha*Math.PI/180) ;
                context.lineTo(track.x, track.y);
			}
            for ( i = 0; i < diff; i++) {
                alpha -= delta;
                track.x =  - this.size * 0.01 * (- alpha * alpha + 40*alpha + 1200)*Math.sin(alpha*Math.PI/180) ;
                track.y =  this.size * 0.01 * (- alpha * alpha + 40*alpha + 1200)*Math.cos(alpha*Math.PI/180) ;
                context.lineTo(track.x, track.y);
            }
			break;
		case "Peach":
		default:
                alpha = 0;
				delta = 2 * Math.PI / diff; 
			for ( i = 0; i < diff; i++) {
				alpha += delta;
				track.x = this.size * 16 * Math.pow(Math.sin(alpha), 3);
				track.y = this.size * (13 * Math.cos(alpha) - 5 * Math.cos(2 * alpha) - 2 * Math.cos(3 * alpha) - Math.cos(4 * alpha));
				context.lineTo(track.x, track.y);
			};
	}
	context.closePath();
	context.stroke();
	context.restore();
}
