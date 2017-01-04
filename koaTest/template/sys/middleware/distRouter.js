"use strict";
const url = require('url');
const path = require('path');
module.exports = function *(next) {
    //default router
    yield defaultRoute.apply(this, [url.parse(this.req.url.toLowerCase(), true).pathname.split('/'), this.method.toLowerCase()])
    return;
}
/**
 * 默认路由
 */
function * defaultRoute(info, method) {
    let ctlName = (info[1] || 'index').toLowerCase(),
        action = (info.length > 3 ? 'rest' : info[2] || '/').toLowerCase(),
        relativePath = `../../controller/${ctlName}`;
    method != 'get' && (action = `${method}#${action}`);
    try {
        yield require(relativePath)[action];
    } catch (e) {
        console.trace(e.message);
        this.body = JSON.stringify(e.message)
    }
}