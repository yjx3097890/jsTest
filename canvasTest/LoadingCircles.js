/**
 * Created by jixian on 13-12-3.
 * Depend on Vector2.js
 * This js is used to make loading image.
 */
var Circle = function (position, radius, color) {
    this.position = position || new Vector2();
    this.radius = radius || 1;
    this.color = color || "#ffffff";
};

Circle.prototype = {
    constructor : Circle,

    draw : function (context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    }
};

/**
 *
 * @param size : loading 图片的变长
 * @param maxRadius ： loading中最大的圆的半径
 * @param color ： 圆的颜色
 * @param density ： 圆的个数
 * @param interval ： 旋转的频率
 * @constructor
 */
var LoadingCircles = function (size, maxRadius, color, density, interval) {
    this.size = size || 100;
    this.maxRadius = maxRadius || 20;
    this.color = color || "#ffffff";
    this.density = density || 10;
    this.interval = interval || 10;

    this.canvas = null;
    this.context = null;
    this.circles = [];
};

LoadingCircles.prototype = {
    constructor : LoadingCircles,

    init : function () {
        var circle, i,
            vec2 = new Vector2( this.size / 2, this.maxRadius ),
            center = new Vector2(this.size / 2, this.size / 2),
            alpha = 4 * Math.PI / 3 / this.density,
            radius = this.maxRadius;
        for (i=0; i < this.density; i++){
            radius *= (this.density - i) / this.density;
            vec2.rotateByPoint(center, alpha);
            circle = new Circle(vec2.clone(), radius, this.color);
            this.circles.push(circle);
        }
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas.height = this.size;
        this.context = this.canvas.getContext('2d');
    },

    drawCircles : function () {
        var i, circle;
        for (i=0; i < this.density; i++) {
            circle = this.circles[i];
            circle.draw(this.context);
        }
    },

    animate : function () {
        var that = this, i, circle, delta = -1,
            center = new Vector2(this.size / 2, this.size / 2);

        that.context.clearRect(0, 0, that.size, that.size);
        for ( i=0; i< that.density; i++) {
            circle = that.circles[i];
            circle.position.rotateByPoint(center, delta);
        }
        that.drawCircles();

        setTimeout(function () {
            LoadingCircles.prototype.animate.call(that);
        },that.interval)
    },

    clear : function () {
        this.interval = Math.POSITIVE_INFINITY;
    }
};
