/**
 * 以4x7个圆球来表示0-9
 * @param position ： 左上角位置
 * @param width ：面板的宽
 * @param color
 * @constructor
 */
var Counter = function ( position, width, color ) {
	this.position = (position && position.clone()) || new Vector2(10, 10);
	this.width = width || 110;
    this.height = this.width * 20 / 11;
	this.color = color || "#ff0000";
    this.r = this.width / 11;
};
/**
 * 画数字并返回圆的数组
 * @param context
 * @param num :1-9
 * @returns {Array}
 */
Counter.prototype.draw = function (context, num) {
    var i=0,j = 0, x=0, y=0, ball, balls=[];
    var draw = function (obj) {
        for (i = obj.length - 1; i >= 0; i--) {
            x = this.position.x + (3 * obj[i].y +1) * this.r;
            y = this.position.y + (3 * obj[i].x +1) * this.r;
            ball = new Ball(new Vector2(x, y), this.r);
            ball.draw(context, this.color);
            balls.push(ball);
        }
    }
    switch (num) {
        case 1 :
        	draw.call(this, this.one);
            break;
        case 2 :
            draw.call(this, this.two);
            break;
        case 3 :
            draw.call(this, this.three);
            break;
        case 4 :
            draw.call(this, this.four);
            break;
        case 5 :
            draw.call(this, this.five);
            break;
        case 6 :
            draw.call(this, this.six);
            break;
        case 7 :
            draw.call(this, this.seven);
            break;
        case 8 :
            draw.call(this, this.eight);
              break;
        case 9 :
            draw.call(this, this.nine);
             break;
        case 0 :
            draw.call(this, this.zero);
            break;
        default :
            for (i = 4-1; i>=0;i-- ) {
                for (j = 7-1; j>=0;j-- ) {
                    x = this.position.x + (3 * i +1) * this.r;
                    y = this.position.y + (3 * j +1) * this.r;
                    ball = new Ball(new Vector2(x, y), this.r);
                    ball.draw(context, this.color);
                    balls.push(ball);
                }
            }
    }
    return balls;
};

//矩阵表示法
Counter.prototype.zero = [
	new Vector2(0,0),
	new Vector2(1,0),
	new Vector2(2,0),
	new Vector2(3,0),
	new Vector2(4,0),
	new Vector2(5,0),
	new Vector2(6,0),
	new Vector2(6,1),
	new Vector2(6,2),
	new Vector2(6,3),
	new Vector2(5,3),
	new Vector2(4,3),
	new Vector2(3,3),
	new Vector2(2,3),
	new Vector2(1,3),
	new Vector2(0,3),
	new Vector2(0,2),
	new Vector2(0,1)
];
Counter.prototype.one = [
	new Vector2(0,3),
	new Vector2(1,3),
	new Vector2(2,3),
	new Vector2(3,3),
	new Vector2(4,3),
	new Vector2(5,3),
	new Vector2(6,3)
];
Counter.prototype.two = [
	new Vector2(0,0),
	new Vector2(0,1),
	new Vector2(0,2),
	new Vector2(0,3),
	new Vector2(1,3),
	new Vector2(2,3),
	new Vector2(3,3),
	new Vector2(3,2),
	new Vector2(3,1),
	new Vector2(3,0),
	new Vector2(4,0),
	new Vector2(5,0),
	new Vector2(6,0),
	new Vector2(6,1),
	new Vector2(6,2),
	new Vector2(6,3)
];
Counter.prototype.three = [
	new Vector2(0,0),
	new Vector2(0,1),
	new Vector2(0,2),
	new Vector2(0,3),
	new Vector2(1,3),
	new Vector2(2,3),
	new Vector2(3,3),
	new Vector2(3,2),
	new Vector2(3,1),
	new Vector2(3,0),
	new Vector2(4,3),
	new Vector2(5,3),
	new Vector2(6,3),
	new Vector2(6,2),
	new Vector2(6,1),
	new Vector2(6,0)
];
Counter.prototype.four = [
    new Vector2(0,0),
    new Vector2(1,0),
    new Vector2(2,0),
    new Vector2(3,0),
    new Vector2(3,1),
    new Vector2(3,2),
    new Vector2(3,0),
    new Vector2(0,3),
    new Vector2(1,3),
    new Vector2(2,3),
    new Vector2(3,3),
    new Vector2(4,3),
    new Vector2(5,3),
    new Vector2(6,3)
];
Counter.prototype.five = [
    new Vector2(0,3),
    new Vector2(0,2),
    new Vector2(0,1),
    new Vector2(0,0),
    new Vector2(1,0),
    new Vector2(2,0),
    new Vector2(3,0),
    new Vector2(3,1),
    new Vector2(3,2),
    new Vector2(3,3),
    new Vector2(4,3),
    new Vector2(5,3),
    new Vector2(6,3),
    new Vector2(6,2),
    new Vector2(6,1),
    new Vector2(6,0)
];
Counter.prototype.six = [
    new Vector2(0,3),
    new Vector2(0,2),
    new Vector2(0,1),
    new Vector2(0,0),
    new Vector2(1,0),
    new Vector2(2,0),
    new Vector2(3,0),
    new Vector2(4,0),
    new Vector2(5,0),
    new Vector2(6,0),
    new Vector2(6,1),
    new Vector2(6,2),
    new Vector2(6,3),
    new Vector2(5,3),
    new Vector2(4,3),
    new Vector2(3,3),
    new Vector2(3,2),
    new Vector2(3,1)
];
Counter.prototype.seven = [
    new Vector2(0,0),
    new Vector2(0,1),
    new Vector2(0,2),
    new Vector2(0,3),
    new Vector2(1,3),
    new Vector2(2,3),
    new Vector2(3,3),
    new Vector2(4,3),
    new Vector2(5,3),
    new Vector2(6,3)
];
Counter.prototype.eight = [
    new Vector2(0,0),
    new Vector2(1,0),
    new Vector2(2,0),
    new Vector2(3,0),
    new Vector2(4,0),
    new Vector2(5,0),
    new Vector2(6,0),
    new Vector2(6,1),
    new Vector2(6,2),
    new Vector2(6,3),
    new Vector2(5,3),
    new Vector2(4,3),
    new Vector2(3,3),
    new Vector2(2,3),
    new Vector2(1,3),
    new Vector2(0,3),
    new Vector2(0,2),
    new Vector2(0,1),
    new Vector2(3,1),
    new Vector2(3,2)
];
Counter.prototype.nine = [
    new Vector2(0,0),
    new Vector2(0,1),
    new Vector2(0,2),
    new Vector2(0,3),
    new Vector2(1,3),
    new Vector2(2,3),
    new Vector2(3,3),
    new Vector2(3,2),
    new Vector2(3,1),
    new Vector2(3,0),
    new Vector2(4,3),
    new Vector2(5,3),
    new Vector2(6,3),
    new Vector2(6,2),
    new Vector2(6,1),
    new Vector2(6,0),
    new Vector2(1,0),
    new Vector2(2,0)
];

