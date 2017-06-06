Matrix4 = function ( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ) {
    this.element = new Float32Array(16);
    this.m11 = (m11 !== undefined) ? m11 : 1;this.m12 = m12 || 0;this.m13 = m13 || 0;this.m14 = m14 || 0;
    this.m21 = m21 || 0;this.m22 = (m22 !== undefined) ? m22 : 1;this.m23 = m23 || 0;this.m24 = m24 || 0;
    this.m31 = m31 || 0;this.m32 = m32 || 0;this.m33 = (m33 !== undefined) ? m33 : 1;this.m34 = m34 || 0;
    this.m41 = m41 || 0;this.m42 = m42 || 0;this.m43 = m43 || 0;this.m44 = (m44 !== undefined) ? m44 : 1;
};

Matrix4.prototype = {
    constructor : Matrix4,

    set m11(m11) {
        this.element[0] = m11;     
    },
    get m11() {
        return this.element[0];
    },
    
    set m12(m12) {
        this.element[4] = m12;     
    },
    get m12() {
        return this.element[4];
    },
    
    set m13(m13) {
        this.element[8] = m13;     
    },
    get m13() {
        return this.element[8];
    },
    
    set m14(m14) {
        this.element[12] = m14;     
    },
    get m14() {
        return this.element[12];
    },
    
    set m21(m21) {
        this.element[1] = m21;     
    },
    get m21() {
        return this.element[1];
    },
    
    set m22(m22) {
        this.element[5] = m22;     
    },
    get m22() {
        return this.element[5];
    },
    
    set m23(m23) {
        this.element[9] = m23;     
    },
    get m23() {
        return this.element[9];
    },
    
    set m24(m24) {
        this.element[13] = m24;     
    },
    get m24() {
        return this.element[13];
    },  

    set m31(m31) {
        this.element[2] = m31;     
    },
    get m31() {
        return this.element[2];
    },
    
    set m32(m32) {
        this.element[6] = m32;     
    },
    get m32() {
        return this.element[6];
    },
    
    set m33(m33) {
        this.element[10] = m33;     
    },
    get m33() {
        return this.element[10];
    },
    
    set m34(m34) {
        this.element[14] = m34;     
    },
    get m34() {
        return this.element[14];
    },   

    set m41(m41) {
        this.element[3] = m41;     
    },
    get m41() {
        return this.element[3];
    },
    
    set m42(m42) {
        this.element[7] = m42;     
    },
    get m42() {
        return this.element[7];
    },
    
    set m43(m43) {
        this.element[11] = m43;     
    },
    get m43() {
        return this.element[11];
    },
    
    set m44(m44) {
        this.element[15] = m44;     
    },
    get m44() {
        return this.element[15];
    },
    
    set : function ( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ) {
        this.m11 = (m11 !== undefined) ? m11 : 1;this.m12 = m12 || 0;this.m13 = m13 || 0;this.m14 = m14 || 0;
        this.m21 = m21 || 0;this.m22 = (m22 !== undefined) ? m22 : 1;this.m23 = m23 || 0;this.m24 = m24 || 0;
        this.m31 = m31 || 0;this.m32 = m32 || 0;this.m33 = (m33 !== undefined) ? m33 : 1;this.m34 = m34 || 0;
        this.m41 = m41 || 0;this.m42 = m42 || 0;this.m43 = m43 || 0;this.m44 = (m44 !== undefined) ? m44 : 1;
        return this;
    },
    
    identity : function () {
        this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        return this;
    },
    
    copy : function (mat4) {
        this.element.set( mat4.element );
        return this;
    },
    
    copyArray : function (array, istransversal) {
        if(istransversal){
            this.set(
                array[0], array[4], array[8], array[12], 
                array[1], array[5], array[9], array[13], 
                array[2], array[6], array[10], array[14], 
                array[3], array[7], array[11], array[15] 
            );
        } else {
            this.set(
                array[0], array[1], array[2], array[3], 
                array[4], array[5], array[6], array[7], 
                array[8], array[9], array[10], array[11], 
                array[12], array[13], array[14], array[15] 
            );
        }
        return this;
    },
    
    toArray : function () {
        return Array.prototype.slice.call(this);
    },
    
    clone : function () {
        var sheep = new Matrix4();
        sheep.copy(this);
        return sheep;
    },
    
    equal : function (mat4) {
        var i = 0, len = this.length, result = true;
        for ( i=0; i<len; i++) {
            if ( this.element[i] !== mat4[i] ) {
                result = false;
                break;
            }
        }
        return this;
    },
    
    
    multiplyScalar : function (k) {
        var i = 0, len = this.length, k = k || 0;
        for ( i=0; i<len; i++) {
            this.element[i] *= k;
        }
        return this;
    },
    
    multiply : function (mat4) {
        var that = this.clone();
        return this.multiplyMatrices(that, mat4);
    },
    
    multiplyMatrices : function (m , n) {
        this.m11 = m.m11*n.m11 + m.m12*n.m21 + m.m13*n.m31 + m.m14*n.m41;
        this.m12 = m.m11*n.m12 + m.m12*n.m22 + m.m13*n.m32 + m.m14*n.m42;
        this.m13 = m.m11*n.m13 + m.m12*n.m23 + m.m13*n.m33 + m.m14*n.m43;
        this.m14 = m.m11*n.m14 + m.m12*n.m24 + m.m13*n.m34 + m.m14*n.m44;
        this.m21 = m.m21*n.m11 + m.m22*n.m21 + m.m23*n.m31 + m.m24*n.m41;
        this.m22 = m.m21*n.m12 + m.m22*n.m22 + m.m23*n.m32 + m.m24*n.m42;
        this.m23 = m.m21*n.m13 + m.m22*n.m23 + m.m23*n.m33 + m.m24*n.m43;
        this.m24 = m.m21*n.m14 + m.m22*n.m24 + m.m23*n.m34 + m.m24*n.m44;
        this.m31 = m.m31*n.m11 + m.m32*n.m21 + m.m33*n.m31 + m.m34*n.m41;
        this.m32 = m.m31*n.m12 + m.m32*n.m22 + m.m33*n.m32 + m.m34*n.m42;
        this.m33 = m.m31*n.m13 + m.m32*n.m23 + m.m33*n.m33 + m.m34*n.m43;
        this.m34 = m.m31*n.m14 + m.m32*n.m24 + m.m33*n.m34 + m.m34*n.m44;
        this.m41 = m.m41*n.m11 + m.m42*n.m21 + m.m43*n.m31 + m.m44*n.m41;
        this.m42 = m.m41*n.m12 + m.m42*n.m22 + m.m43*n.m32 + m.m44*n.m42;
        this.m43 = m.m41*n.m13 + m.m42*n.m23 + m.m43*n.m33 + m.m44*n.m43;
        this.m44 = m.m41*n.m14 + m.m42*n.m24 + m.m43*n.m34 + m.m44*n.m44;
        return this;
    },
    
    multiplyVector4 : function (vec4) {
        var result = new Vector4();
        result.x = this.m11*vec4.x + this.m12*vec4.y + this.m13*vec4.z + this.m14*vec4.w;
        result.y = this.m21*vec4.x + this.m22*vec4.y + this.m23*vec4.z + this.m24*vec4.w;
        result.z = this.m31*vec4.x + this.m32*vec4.y + this.m33*vec4.z + this.m34*vec4.w;
        result.w = this.m41*vec4.x + this.m42*vec4.y + this.m43*vec4.z + this.m44*vec4.w;
        return result;
    },
    
    makeRotate : function (alpha, axis) {
        var fns = {
            "x" : function (alpha) {
                 var c = Math.cos(alpha), s = Math.sin(alpha);
                this.set(
                    1, 0, 0, 0,
                    0, c, -s, 0,
                    0, s, c, 0,
                    0, 0, 0, 1
                );
            },
            "y" : function (alpha) {
                 var c = Math.cos(alpha), s = Math.sin(alpha);
                this.set(
                    c, 0, s, 0,
                    0, 1, 0, 0,
                    -s, 0, c, 0,
                    0, 0, 0, 1
                );
            },     
            "z" : function (alpha) {
                 var c = Math.cos(alpha), s = Math.sin(alpha);
                this.set(
                    c, -s, 0, 0,
                    s, c, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                );
            }
        };
        fns[axis].call(this,alpha);
        return this;
    },
    
    makeScale : function (x, y, z) {
        this.set(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        );
        return this;
    },
    
    makeMove : function (vec3) {
        this.set(
            1, 0, 0, vec3.x,
            0, 1, 0, vec3.y,
            0, 0, 1, vec3.z,
            0, 0, 0, 1
        );
        return this;
    },
    
    //绕AB逆时针旋转alpha度
    makeRotateWithLine : function (pointA, pointB, alpha) {
        var T1 = this.clone().makeMove(pointA.clone().getReverse()),
            vec3 = pointB.clone().sub(pointA),
            len = vec3.getLength(),
            lenyz = Math.sqrt(vec3.y * vec3.y + vec3.z * vec3.z),
            R1, R2, R3;
        if (len === 0) {
            console.warn("The two points must not same!");
            return null;
        }
        if (lenyz === 0) {
            R1 = this.clone().identity();
            R2 = this.clone().set(
                vec3.x / len, 0, 0, 0,
                0, vec3.x / len, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            R3 = this.clone().makeRotate(alpha, "x");
        } else {
            R1 = this.clone().set(
                1, 0, 0, 0,
                0, vec3.z / lenyz, - vec3.y / lenyz, 0,
                0, vec3.y / lenyz,   vec3.z / lenyz, 0,
                0, 0, 0, 1        
            ),
            vec3xz = new Vector3(vec3.x, 0, lenyz);
            R2 = this.clone().set(
                vec3xz.z / len, 0, - vec3xz.x / len, 0,
                0, 1, 0, 0,
                vec3xz.x / len, 0, vec3xz.z / len, 0,
                0, 0, 0, 1
            ),
            R3 = this.clone().makeRotate(alpha, "z");
        }  
      //      M = T1.inverse()*R1.inverse()*R2.inverse()*R3*R2*R1*T1
        this.identity().multiply(T1.clone().inverse()).multiply(R1.clone().inverse()).multiply(R2.clone().inverse()).multiply(R3).multiply(R2).multiply(R1).multiply(T1);    
        return this;    
    },
    
    makeShearing : function (s, t, axis) {
        var fns = {
            "x" : function (s, t) {
                    this.set(
                        1, 0, 0, 0,
                        s, 1, 0, 0,
                        t, 0, 1, 0,
                        0, 0, 0, 1
                    );
                },
            "y" : function (s, t) {
                    this.set(
                        1, s, 0, 0,
                        0, 1, 0, 0,
                        0, t, 1, 0,
                        0, 0, 0, 1
                    );
                },
            "z" : function (s, t) {
                    this.set(
                        1, 0, s, 0,
                        0, 1, t, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1
                    );
                }
            };
            fns[axis].call(this, s, t);
        return this;
    },
    
    determinant: function () {
        
		var n11 = this.m11, n12 = this.m12, n13 = this.m13, n14 = this.m14;
		var n21 = this.m21, n22 = this.m22, n23 = this.m23, n24 = this.m24;
		var n31 = this.m31, n32 = this.m32, n33 = this.m33, n34 = this.m34;
		var n41 = this.m41, n42 = this.m42, n43 = this.m43, n44 = this.m44;
        
		return (
        n41 * (
        +n14 * n23 * n32
        -n13 * n24 * n32
        -n14 * n22 * n33
        +n12 * n24 * n33
        +n13 * n22 * n34
        -n12 * n23 * n34
        ) +
        n42 * (
        +n11 * n23 * n34
        -n11 * n24 * n33
        +n14 * n21 * n33
        -n13 * n21 * n34
        +n13 * n24 * n31
        -n14 * n23 * n31
        ) +
        n43 * (
        +n11 * n24 * n32
        -n11 * n22 * n34
        -n14 * n21 * n32
        +n12 * n21 * n34
        +n14 * n22 * n31
        -n12 * n24 * n31
        ) +
        n44 * (
        -n13 * n22 * n31
        -n11 * n23 * n32
        +n11 * n22 * n33
        +n13 * n21 * n32
        -n12 * n21 * n33
        +n12 * n23 * n31
        )      
		);
        
	},
    
    transpose : function () {
       var swap = function (a, b) {
            var temp = a;
            a = b;
            b = temp;
       }; 
       swap(this.m12, this.m21);
       swap(this.m13, this.m31);
       swap(this.m14, this.m41);
       swap(this.m23, this.m32);
       swap(this.m24, this.m42);
       swap(this.m34, this.m43);
       return this;  
    },
    
    inverse: function ( throwOnInvertible ) {
        
		var n11 = this.m11, n12 = this.m12, n13 = this.m13, n14 = this.m14;
		var n21 = this.m21, n22 = this.m22, n23 = this.m23, n24 = this.m24;
		var n31 = this.m31, n32 = this.m32, n33 = this.m33, n34 = this.m34;
		var n41 = this.m41, n42 = this.m42, n43 = this.m43, n44 = this.m44;
        
		this.m11 = n23*n34*n42 - n24*n33*n42 + n24*n32*n43 - n22*n34*n43 - n23*n32*n44 + n22*n33*n44;
		this.m12 = n14*n33*n42 - n13*n34*n42 - n14*n32*n43 + n12*n34*n43 + n13*n32*n44 - n12*n33*n44;
		this.m13 = n13*n24*n42 - n14*n23*n42 + n14*n22*n43 - n12*n24*n43 - n13*n22*n44 + n12*n23*n44;
		this.m14 = n14*n23*n32 - n13*n24*n32 - n14*n22*n33 + n12*n24*n33 + n13*n22*n34 - n12*n23*n34;
		this.m21 = n24*n33*n41 - n23*n34*n41 - n24*n31*n43 + n21*n34*n43 + n23*n31*n44 - n21*n33*n44;
		this.m22 = n13*n34*n41 - n14*n33*n41 + n14*n31*n43 - n11*n34*n43 - n13*n31*n44 + n11*n33*n44;
		this.m23 = n14*n23*n41 - n13*n24*n41 - n14*n21*n43 + n11*n24*n43 + n13*n21*n44 - n11*n23*n44;
		this.m24 = n13*n24*n31 - n14*n23*n31 + n14*n21*n33 - n11*n24*n33 - n13*n21*n34 + n11*n23*n34;
		this.m31 = n22*n34*n41 - n24*n32*n41 + n24*n31*n42 - n21*n34*n42 - n22*n31*n44 + n21*n32*n44;
		this.m32 = n14*n32*n41 - n12*n34*n41 - n14*n31*n42 + n11*n34*n42 + n12*n31*n44 - n11*n32*n44;
		this.m33 = n12*n24*n41 - n14*n22*n41 + n14*n21*n42 - n11*n24*n42 - n12*n21*n44 + n11*n22*n44;
		this.m34 = n14*n22*n31 - n12*n24*n31 - n14*n21*n32 + n11*n24*n32 + n12*n21*n34 - n11*n22*n34;
		this.m41 = n23*n32*n41 - n22*n33*n41 - n23*n31*n42 + n21*n33*n42 + n22*n31*n43 - n21*n32*n43;
		this.m42 = n12*n33*n41 - n13*n32*n41 + n13*n31*n42 - n11*n33*n42 - n12*n31*n43 + n11*n32*n43;
		this.m43 = n13*n22*n41 - n12*n23*n41 - n13*n21*n42 + n11*n23*n42 + n12*n21*n43 - n11*n22*n43;
		this.m44 = n12*n23*n31 - n13*n22*n31 + n13*n21*n32 - n11*n23*n32 - n12*n21*n33 + n11*n22*n33;
        
		var det = n11 * this.m11 + n21 * this.m12 + n31 * this.m13 + n41 * this.m14;
        
		if ( det === 0 ) {
            
			var msg = "Matrix4.inverse(): can't invert matrix, determinant is 0";
            
			if ( throwOnInvertible ) {
                
				throw new Error( msg ); 
                
			} else {
                
				console.warn( msg );
                
			}
            
			this.set(
                n11, n12, n13, n14,
                n21, n22, n23, n24,
                n31, n32, n33, n34,
                n41, n42, n43, n44
            );
            
			return this;
		}
        
		this.multiplyScalar( 1 / det );
        
		return this;
        
	},
    
    
    
    toString : function (n) {
        var str = "", i = 0, ele = this.element;
        for (i=0; i<4 ; i++) {
            str += ele[i].toFixed(n) + " " + ele[i+4].toFixed(n) + " " + ele[i+8].toFixed(n) + " " + ele[i+12].toFixed(n) + "\n";
        }
        return str;
    }
        
};