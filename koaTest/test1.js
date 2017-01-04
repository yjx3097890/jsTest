let koa = require('koa');
let app = koa();

// x-response-time

app.use(function *(next){
  var start = new Date;
  console.log('x-response-time1')
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
    console.log('x-response-time2')
});

// logger

app.use(function *(next){
  var start = new Date;
    console.log('logger1')
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function* () {
    this.body = 'hello world';
      console.log('body')
} );
app.listen(3000);