const path  = require('path');
const os    = require('os');

var dist = {
    root:`${path.resolve(__dirname,'../')}/view/`,
    jsserver : `http://${getIp()}:3002/`
}



module.exports = function(env){
    if(env == 'dev'){
       return {
            //js服务器地址
            jsserver: `http://${getIp()}:3002/`,
            //版本号
            ver: '1.0',
            //dns预解析list
            dns: [],
            //模版引擎启动参数
            tpl: {
                root: `${path.resolve(__dirname,'../')}/view/`,
                layout: false,
                viewExt: 'html',
                cache: false,
                debug: true
            },
            enableLiveLoad : true
        };
    }else if(env == 'dist'){
       return {
            //js服务器地址
            jsserver: dist.jsserver,
            //版本号
            ver: '1.0',
            //dns预解析list
            dns: ['http://i.meituan.com','http://www.meituan.com'],
            //模版引擎启动参数
            tpl: {
                root: dist.root,
                layout: false,
                viewExt: 'html',
                cache: true,
                debug: false
            }
        }
    }
}


function getIp() {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses[0];
}