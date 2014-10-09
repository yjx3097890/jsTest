Vector4 = function (x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1; //1是点，0是向量
}

Vector4.prototype = {
    constructor : Vector4 ,
    
    setX : function (x) {
        this.x = x;
        return this;
    },
    
    setY : function (y) {
        this.y = y;
        return this;
    },
    
    setZ : function (z) {
        this.z = z;
        return this;
    },

    setW : function (w) {
        this.w = w;
        return this;
    },
    
    set : function (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    },
    
    copy : function (vec4) {
        this.x = vec4.x;
        this.y = vec4.y;
        this.z = vec4.z;
        this.w = vec4.w;
        return this;
    },
    
    equals : function (vec4) {
        return this.x === vec4.x && this.y === vec4.y && this.z === vec4.z && this.w === vec4.w;
    },
    
    clone : function () {
        return new Vector4(this.x, this.y, this.z, this.w);
    },
    
    getX : function () {
        return this.x;
    },
    
    getY : function () {
        return this.y;
    },

    getZ : function () {
        return this.z;
    },

    getW : function () {
        return this.w;
    },
    
    getLength : function () {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    },
    
    normalize : function () {
        if (this.x === 0 && this.y === 0 && this.z === 0 && this.z === 0) {
            return new Vector4();
        }
        var length = this.getLength();
        this.x *= 1 / length;
        this.y *= 1 / length;
        this.z *= 1 / length;
        this.w *= 1 / length;
        return this;
    },
    
    add : function (vec4) {
        this.x += vec4.x;
        this.y += vec4.y;
        this.z += vec4.z;
        this.w += vec4.w;
        return this;
    },
    
    sub : function (vec4) {
        this.x -= vec4.x;
        this.y -= vec4.y;
        this.z -= vec4.z;
        this.w -= vec4.w;
        return this;
    },
    
    multiplyScalar : function (k) {
        this.x *= k;
        this.y *= k;
        this.z *= k;
        this.w *= k;
        return this;
    },
    
    dot : function (vec4) {
        return this.x * vec4.x + this.y * vec4.y + this.z * vec4.z + this.w * vec4.w;
    },
    
    getLengthTo : function (vec4) {
        return Math.sqrt( (this.x - vec4.x) * (this.x - vec4.x) + (this.y - vec4.y) * (this.y - vec4.y) + (this.z - vec4.z) * (this.z - vec4.z) + (this.w - vec4.w) * (this.w - vec4.w));
    }, 
    
    getLengthToSquared : function (vec4) {
        return (this.x - vec4.x) * (this.x - vec4.x) + (this.y - vec4.y) * (this.y - vec4.y) + (this.z - vec4.z) * (this.z - vec4.z ) + (this.w - vec4.w) * (this.w - vec4.w);
    },
    
    getVertical : function () {
        return new Vector4(this.y, - this.x , 0, 0);
    },
    
    getReverse : function () {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        this.w *= -1;
        return this;
    },
    
    perspectiveDivision : function() {
        if (this.w !== 0) {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
            this.w /= this.w;
        }
        return this;
    }, 
    
    applyMatrix4 : function (mat4) {
        var vx = this.x, vy = this.y, vz = this.z, vw = this.w;
        this.x = mat4.m11*vx + mat4.m12*vy + mat4.m13*vz + mat4.m14*vw;
        this.y = mat4.m21*vx + mat4.m22*vy + mat4.m23*vz + mat4.m24*vw;
        this.z = mat4.m31*vx + mat4.m32*vy + mat4.m33*vz + mat4.m34*vw;
        this.w = mat4.m41*vx + mat4.m42*vy + mat4.m43*vz + mat4.m44*vw;
        return this;
    },

    
    rotate : function (alpha, axis) {
        var fns = {
            x : function (alpha) {
                var temp = this.y;
                this.y = temp * Math.cos(alpha) - this.z * Math.sin(alpha);
                this.z = temp * Math.sin(alpha) + this.z * Math.cos(alpha);
            },
            y : function (alpha) {
                var temp = this.z;
                this.z = temp * Math.cos(alpha) - this.x * Math.sin(alpha);
                this.x = temp * Math.sin(alpha) + this.x * Math.cos(alpha);
            },
            z : function (alpha) {
                var temp = this.x;
                this.x = temp * Math.cos(alpha) - this.y * Math.sin(alpha);
                this.y = temp * Math.sin(alpha) + this.y * Math.cos(alpha);
            }
        };
        fns[axis].call(this, alpha);
        return this;
    }
    
};
