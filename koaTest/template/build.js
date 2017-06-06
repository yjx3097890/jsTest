"use strict";
var fs = require('fs');
var co = require('co');
var path = require('path');
var uglify = require('uglify-js');
var reg = /require(\([^\(\)]*\))/g,
    space = /\s+/g;
/*
 * 解析依赖
 */
function parseDeps(fileStr) {
    var result = [];
    var deps = fileStr.replace(space, '').match(reg) || [];
    for (var i = 0, len = deps.length; i < len; i++) {
        var dep = prefix  + deps[i].replace("require(", '').replace(")", '').replace(/'/ig, '').replace(/"/ig, ''),
            f = dep.indexOf('.js') != -1 ? base + dep : base + dep + '.js';
        result.indexOf(f) == -1 && result.push(f);
    }
    return result;
}
/*
 * 获取依赖
 */
function getDeps(url) {
    console.log(url)
    var data = fs.readFileSync(url).toString();
    return parseDeps(data);
}
var base = __dirname + '/resource/';
var dist = __dirname + '/dist/';
var prefix = 'es5/';
/*
 * 获取文件夹下面的文件
 */
function getAllFiles(url, ext) {
    return fs.readdirSync(url).map(item => url + item);
}

//打包
function build(cfg) {
    Object.keys(cfg).forEach(file => {

        console.log(file);
        console.log(file + ' begin build..........');
        var result = uglify.minify(cfg[file].reverse(), {
            //替换变量的时候,不替换require
            mangle: {
                except: ['require']
            },
            compress: {
                drop_debugger: true,
                //discard unreachable code
                dead_code: true,
                // drop unused variables/functions
                unused: true
            }
        });

        var writeStream = fs.createWriteStream(file.replace(/resource\/es5/ig, 'dist/js'));
        // writeStream.write(out.replace(/(^\s*)|(\s*$)/g, '').replace(/[\r\n]/g, ""));
        writeStream.write(result.code);
        console.log(file + " has bulit");
    })
    console.log('!!!!!!!!!!!!!!!!!!!!!!build all js success!!!!!!!!!!!!!!!!!!!!!!');
}

function buildCss() {
    getAllFiles(base + 'css/').forEach((item, index) => {
        if (item.indexOf('.css') != -1) {
            var arr = item.split('/'),
                fname = arr[arr.length - 1],
                fileStr = fs.readFileSync(item).toString();
            var writeStream = fs.createWriteStream(dist + 'css/' + fname);
            writeStream.write(minCss(fileStr));
        } else {
            //is folder
        }
    })
    console.log('!!!!!!!!!!!!!!!!!!!!!!build all css success!!!!!!!!!!!!!!!!!!!!!!');
}
//临时存放某单个文件的所有依赖
var tem = [];
/**
 * 递归找出所有文件的依赖
 * @param {array} target 文件依赖数组
 * @param {string} file  文件
 */
function addDep(file) {
    var deps = getDeps(file);
    tem = tem.concat(deps);
    if (deps.length > 0) {
        deps.forEach(dep => addDep(dep))
    }
}
//入口
co(function * (arr) {
    //获取需要打包的文件
    var all = {};
    getAllFiles(base + 'es5/page/').forEach(item => all[item] = [item]);
    //找到文件所有依赖
    Object.keys(all).forEach((file, index) => {
        tem = all[file];
        addDep(file);
        all[file] = tem;
    })
    
    build(all);
    //压缩css
    buildCss();
    //归档版本号
    // var version = new Date().getTime() * Math.random();
    // fs.writeFile('./version.js', 'module.exports = { ver: ' + version + '}', err => {
    //     if (err) throw err;
    // });
    //临时
    // temp();
}).catch(function(err) {
    console.log(err)
});

function minCss(css) {
    var hexcolor = /[0-9a-f]/gi;
    // via http://stackoverflow.com/questions/4402220/regex-to-minimize-css
    css = css.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');
    css = css.replace(/ {2,}/g, ' ');
    css = css.replace(/ ([{:}]) /g, '$1');
    css = css.replace(/([;,]) /g, '$1');
    css = css.replace(/ !/g, '!');
    css = css.split(": ").join(":");
    css = css.split(";}").join("}");
    // hex color shrinking
    var cssparts = css.split("#");
    for (var i = 1, len = cssparts.length; i < len; i++) {
        if (!cssparts[i] || cssparts[i].length < 6) {
            continue;
        }
        var color = cssparts[i].substring(0, 6);
        if (color.match(hexcolor) == null) {
            continue;
        }
        if (color[0] != color[1] || color[2] != color[3] || color[4] != color[5]) {
            continue;
        }
        var shrunk = color[0] + color[2] + color[4];
        cssparts[i] = shrunk + cssparts[i].substring(6);
    }
    return cssparts.join("#");
}

function minhtml(html) {
    var stripchars = ["\\n", "\\t", "\\r", "\n", "\r", "\t", "  ", ];
    for (var i = 0, len = stripchars.length; i < len; i++) {
        var char = stripchars[i];
        while (html.indexOf(char) > -1) {
            html = html.split(char).join(" ");
        }
    }
    if (html.indexOf("> <") > -1) {
        html = html.split("> <").join("><");
    }
    return html;
}