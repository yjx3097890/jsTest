Vector3 = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z; 
 };
 Vector3.prototype = {
     copy: function () { return new Vector3(this.x, this.y, this.z); },
     length: function () { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); },
     sqrLength: function () { return this.x * this.x + this.y * this.y + this.z * this.z; },
     normalize: function () { var inv = 1 / this.length(); return new Vector3(this.x * inv, this.y * inv, this.z * inv); },
     negate: function () { return new Vector3(-this.x, -this.y, -this.z); },
     add: function (v) { return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z); },
     sub: function (v1, v2) {

         this.x = v1.x - v2.x;
         this.y = v1.y - v2.y;
         this.z = v1.z - v2.z;
         return this;

     },

     subtract: function (v) { return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z); },
     multiply: function (f) { return new Vector3(this.x * f, this.y * f, this.z * f); },
     divide: function (f) { var invf = 1 / f; return new Vector3(this.x * invf, this.y * invf, this.z * invf); },
     dot: function (v) { return this.x * v.x + this.y * v.y + this.z * v.z; },
     cross: function (v) { return new Vector3(-this.z * v.y + this.y * v.z, this.z * v.x - this.x * v.z, -this.y * v.x + this.x * v.y); },

     rotateXSelf: function (p, theta) {
         var v = new Vector3();
         v.sub(this, p);
         theta *= Math.PI / 180;
         var R = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];

         this.y = p.y + R[0][0] * v.y + R[0][1] * v.z;
         this.z = p.z + R[1][0] * v.y + R[1][1] * v.z;
     },
     rotateYSelf: function (p, theta) {
         var v = new Vector3();
         v.sub(this, p);
         theta *= Math.PI / 180;
         var R = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];
         this.x = p.x + R[0][0] * v.x + R[0][1] * v.z;
         this.z = p.z + R[1][0] * v.x + R[1][1] * v.z;
     },
     rotateZSelf: function (p, theta) {
         var v = new Vector3();
         v.sub(this, p);
         theta *= Math.PI / 180;
         var R = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];
         this.x = p.x + R[0][0] * v.x + R[0][1] * v.y;
         this.y = p.y + R[1][0] * v.x + R[1][1] * v.y;
     }

 };
Vector3.zero = new Vector3(0, 0, 0);
Vector3.getLinePlaneCrossPoint = function (x, v1, v2) {

    return new Vector3(x, (v2.x * v1.y - x * v1.y + x * v2.y - v1.x * v2.y) / (v2.x - v1.x), (v2.x * v1.z - x * v1.z + x * v2.z - v1.x * v2.z) / (v2.x - v1.x));
}