Vector3 = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Vector3.prototype = {
    constructor : Vector3,
    
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
    
    set : function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },
    
    copy : function (vec3) {
        this.x = vec3.x;
        this.y = vec3.y;
        this.z = vec3.z;
        return this;
    },
    
    equals : function (vec3) {
        return this.x === vec3.x && this.y === vec3.y && this.z === vec3.z;
    },
    
    clone : function () {
        return new Vector3(this.x, this.y, this.z);
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
    
    getLength : function () {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z);
    },
    
    normalize : function () {
        if (this.x === 0 && this.y === 0 && this.z === 0) {
            return new Vector3();
        }
        var length = this.getLength();
        this.x *= 1 / length;
        this.y *= 1 / length;
        this.z *= 1 / length;
        return this;
    },
    
    add : function (vec3) {
        this.x += vec3.x;
        this.y += vec3.y;
        this.z += vec3.z;
        return this;
    },
    
    sub : function (vec3) {
        this.x -= vec3.x;
        this.y -= vec3.y;
        this.z -= vec3.z;
        return this;
    },
    
    multiplyScalar : function (k) {
        this.x *= k;
        this.y *= k;
        this.z *= k;
        return this;
    },
    
    dot : function (vec3) {
        return this.x * vec3.x + this.y * vec3.y + this.z * vec3.z;
    },
    
    cross : function (vec3) {
        var result = new Vector3();
        result.setX(this.y * vec3.z - this.z * vec3.y);
        result.setY(this.z * vec3.x - this.x * vec3.z);
        result.setZ(this.x * vec3.y - this.y * vec3.x);
        return result;
    },
    
    getLengthTo : function (vec3) {
        return Math.sqrt( (this.x - vec3.x) * (this.x - vec3.x) + (this.y - vec3.y) * (this.y - vec3.y) + (this.z - vec3.z) * (this.z - vec3.z));
    }, 
    
    getLengthToSquared : function (vec3) {
        return (this.x - vec3.x) * (this.x - vec3.x) + (this.y - vec3.y) * (this.y - vec3.y) + (this.z - vec3.z) * (this.z - vec3.z);
    },
    
    getVertical : function () {
        return new Vector3(this.y, - this.x , 0);
    },
    
    getReverse : function () {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    },
    
    getDistanceToFace : function (a, vec3) {
      
    },
    
    reflect : function (normal) {
        if (! (normal instanceof Vector3)) alert("need vector3");
        var nn = normal.normalize().clone();
        this.sub(nn.multiplyScalar(2 * this.dot(nn))); 
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
    },
    
    applyMatrix3 : function (mat3) {
        var vx = this.x, vy = this.y, vz = this.z;
        this.x = mat3.m11*vx + mat3.m12*vy + mat3.m13*vz;
        this.y = mat3.m21*vx + mat3.m22*vy + mat3.m23*vz;
        this.z = mat3.m31*vx + mat3.m32*vy + mat3.m33*vz;
        return this;
    },
    
    applyMatrix4 : function (mat4) {
        var vx = this.x, vy = this.y, vz = this.z;
        this.x = mat4.m11*vx + mat4.m12*vy + mat4.m13*vz + mat4.m14;
        this.y = mat4.m21*vx + mat4.m22*vy + mat4.m23*vz + mat4.m24;
        this.z = mat4.m31*vx + mat4.m32*vy + mat4.m33*vz + mat4.m34;
        return this;
    },
    
    applyProjection : function (mat4) {
        var vx = this.x, vy = this.vy, vz = this.vz,
        d = 1 / (mat4.m41 * vx + mat4.m42 * vy + mat4.m43 * vz + mat4.m44);
        //perspective divide
        this.x = (mat4.m11*vx + mat4.m12*vy + mat4.m13*vz + mat4.m14) * d;
        this.y = (mat4.m21*vx + mat4.m22*vy + mat4.m23*vz + mat4.m24) * d;
        this.z = (mat4.m31*vx + mat4.m32*vy + mat4.m33*vz + mat4.m34) * d;
        return this;
    }
};
