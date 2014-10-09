var Word = function (text, position, color, font) {
    this.text = text;
    this.position = position;
    this.font = typeof font === "number" ? new Font(font) : font ;
    this.color = color || "#ffffff";
};

Word.prototype = {
    constructor : Word,

    setContext : function (context) {
        this.position.setFontContext(context);
        context.font = this.font.toString();
        context.fillStyle = this.color;
    },

    draw : function (context, font, color) {
        if (font) {
            context.font = this.font.toString();
        }
        if (color) {
            context.fillStyle = this.color;
        }
        context.fillText(this.text, this.position.x, this.position.y);
    },
    
    getWidth :function (context) {
       context.font = this.font.toString();
       return context.measureText(this.text).width;
    }
    
};

//fontSize 默认px单位
var Font = function (fontSize, fontWeight, fontFamily, fontStyle, other) {
    this.fontSize = fontSize;
    this.fontWeight = fontWeight || "bolder"; //normal|bold|bolder|lighter|100...
    this.fontStyle = fontStyle || ""; //normal|italic|oblique
    this.fontFamily = fontFamily || "宋体";
    this.other = other || "";
};
Font.prototype.toString = function () {
    return this.fontStyle + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily + " " + this.other;
};
Font.prototype.clone = function () {
    var result = new Font(this.fontSize, this.fontWeight, this.fontFamily , this.fontStyle, this.other);
    return result;
};

var Position = function (x, y, textAlign, textBaseline) {
    this.x = x;
    this.y = y;
    this.textAlign = textAlign || "start";  //center|end|left|right|start
    this.textBaseline = textBaseline || "alphabetic";  //alphabetic|top|hanging|middle|ideographic|bottom
};
Position.prototype.setFontContext = function (context) {
    context.textAlign = this.textAlign;
    context.textBaseline = this.textBaseline;
};

var Loading = function (text, font, scale, color, interval) {
    this.text = text;
    this.font = font;
    this.scale = scale;
    this.color = color;
    this.interval = interval;
    this.canvas = null;
    this.context = null;
    this.words = null;
    this.map = 0;
};

Loading.prototype = {
    constructor : Loading,

    generateWords : function (context) {
        var words = this.text.split(""),
            word = null,
            position = null,
            x = this.font.fontSize,
            y = (this.font.fontSize + 1) * this.scale,
            i, len = words.length;
        for (i = 0; i < len; i++) {
            if (i > 0) {
               x += words[i-1].getWidth(context);
            }
            word = words[i];
            position = new Position(x, y);
            words[i] = new Word(word, position, this.color, this.font.clone());
        }
        return words;
    },

    draw : function () {
        var words = this.words,
            i, len = words.length;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for ( i = 0; i < len; i++ ) {
            words[i].setContext(this.context);
            words[i].draw(this.context);
        }
    },

    init : function () {
        var myCanvas = document.createElement("canvas"),
            myContext = myCanvas.getContext("2d");
        myCanvas.width = this.font.fontSize * (this.text.length + 1);
        myCanvas.height = this.font.fontSize * 2 * this.scale;
        this.words = this.generateWords(myContext);
        this.canvas = myCanvas;
        this.context = myContext;
    },

    animate : function () {
        var that = this,
            len = that.words.length,
            size = that.font.fontSize;
        that.draw();

        //改变size
        if (that.map >= len * size){
            this.map = 0;
        }

        that.words[ parseInt(that.map / size, 10) ].font.fontSize = that.scale * size - (that.map % size + 1) * (that.scale - 1);
        if( parseInt(that.map / size, 10) + 1 < len ) {
            that.words[ parseInt(that.map / size, 10) + 1 ].font.fontSize = that.scale * size + (that.map % size + 1) * (that.scale - 1);
        }else {
            that.words[ 0 ].font.fontSize = that.scale * size + (that.map % size + 1) * (that.scale - 1);
        }
        that.map += 3;

        setTimeout(function () {
            Loading.prototype.animate.call(that);
        }, that.interval);
    },

    clear : function () {
        this.interval = Math.POSITIVE_INFINITY;
    }

};