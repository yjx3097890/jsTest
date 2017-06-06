//js中用一个16位float数组，表示4x4矩阵。
// M = |m00 m01 m02 m03| = [m00, m01, m02, m03, m10, m11, ..., m33]
//     |m10 m11 m12 m13|
//     |m20 m21 m22 m23|
//     |m30 m31 m32 m33|

const LIBS={
    //角度转弧度
  degToRad: function(angle){
    return(angle*Math.PI/180);
  },
  //计算投影矩阵
  //angle：摄像机的视角宽度
  get_projection: function(angle, a, zMin, zMax) {
    var tan=Math.tan(LIBS.degToRad(0.5*angle)),
        A=-(zMax+zMin)/(zMax-zMin),
          B=(-2*zMax*zMin)/(zMax-zMin);

    return [
      1/tan, 0 ,   0, 0,
      0, a/tan,  0, 0,
      0, 0,         A, -1,
      0, 0,         B, 0
    ];
  },
  //单位矩阵
  get_I4: function() {
    return [1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1];
  },
  set_I4: function(m) {
    m[0]=1, m[1]=0, m[2]=0, m[3]=0,
      m[4]=0, m[5]=1, m[6]=0, m[7]=0,
      m[8]=0, m[9]=0, m[10]=1, m[11]=0,
      m[12]=0, m[13]=0, m[14]=0, m[15]=1;
  },
  //绕X轴顺时针旋转angle
  rotateX: function(m, angle) {
    var c=Math.cos(angle);
    var s=Math.sin(angle);
    var mv1=m[1], mv5=m[5], mv9=m[9];
    m[1]=m[1]*c-m[2]*s;
    m[5]=m[5]*c-m[6]*s;
    m[9]=m[9]*c-m[10]*s;

    m[2]=m[2]*c+mv1*s;
    m[6]=m[6]*c+mv5*s;
    m[10]=m[10]*c+mv9*s;
  },
  //绕Y轴顺时针旋转angle
  rotateY: function(m, angle) {
    var c=Math.cos(angle);
    var s=Math.sin(angle);
    var mv0=m[0], mv4=m[4], mv8=m[8];
    m[0]=c*m[0]+s*m[2];
    m[4]=c*m[4]+s*m[6];
    m[8]=c*m[8]+s*m[10];

    m[2]=c*m[2]-s*mv0;
    m[6]=c*m[6]-s*mv4;
    m[10]=c*m[10]-s*mv8;
  },
  //绕Z轴顺时针旋转angle
  rotateZ: function(m, angle) {
    var c=Math.cos(angle);
    var s=Math.sin(angle);
    var mv0=m[0], mv4=m[4], mv8=m[8];
    m[0]=c*m[0]-s*m[1];
    m[4]=c*m[4]-s*m[5];
    m[8]=c*m[8]-s*m[9];

    m[1]=c*m[1]+s*mv0;
    m[5]=c*m[5]+s*mv4;
    m[9]=c*m[9]+s*mv8;
  },
  //Z轴平移变换t
   translateZ: function(m, t){
    m[14]+=t;
  },
  translateX: function(m, t){
    m[12]+=t;
  },
  translateY: function(m, t){
    m[13]+=t;
  },
    set_position: function(m,x,y,z) {
    m[12]=x, m[13]=y, m[14]=z;
  },
   scaleX: function(m, t){
    m[0] *= t;
    m[1] *= t;
    m[2] *= t;
  },
  scaleY: function(m, t){
    m[4] *= t;
    m[5] *= t;
    m[6] *= t;
  },
  scaleZ: function(m, t){
     m[8] *= t;
    m[9] *= t;
    m[10] *= t;
  },
   get_json: function(url, func) {
    //create the request
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status==200) {
        //the file is loaded. Parse it as JSON and launch func
        func(JSON.parse(xmlHttp.responseText));
      }
    };
    //send the request
    xmlHttp.send();
  },

};