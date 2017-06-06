"use strict"; 
//形式上，Generator函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield语句，定义不同的内部状态
//调用Generator函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象.
//Generator函数是分段执行的，yield语句是暂停执行的标记，而next方法可以恢复执行。
//每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield语句后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。
//yield语句后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为JavaScript提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。
//yield语句如果用在一个表达式之中，必须放在圆括号里面。

function* helloWorldGenerator() {
  yield 'hello';
  yield 'world'+123;
  return 'ending';
}
//return语句返回{value: return值，done: true}, 所以不包括在for of中。
for (let h of helloWorldGenerator()){
  console.log(h)
}

//next方法可以带一个参数，该参数就会被当作上一个yield语句的返回值。
//没有yield的情况
function* f() {
    console.log('坐下来'+ (yield 123));
}
var it = f();
setTimeout(function () {
  console.log(it.next(1234));
  console.log(it.next(5643));

}, 2000)
console.log('站起来');

//Generator函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。
function* g() {
} 
var gen = g();
console.log(gen === gen[Symbol.iterator]())

//for...of循环可以自动遍历Generator函数时生成的Iterator对象,不需要next.
function* fibo() {
  let [prv, cur] = [0, 1];
  for (;;) {
      [prv, cur] = [cur, prv + cur];
      yield cur;
  }
}
for (let n of fibo()) {
  if (n > 100) {
    break;
  }
  console.log(n);
}

//Generator函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在Generator函数体内捕获。throw方法可以接受一个参数，该参数会被catch语句接收.
var q = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = q();
i.next();

try {
  i.throw(new Error('a'));
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
//throw方法被捕获以后，会附带执行下一条yield语句。也就是说，会附带执行一次next方法.
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}     
var g2 = gen();
g2.next() // a
g2.throw() // b
g2.next() // c
//一旦Generator执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用next方法，将返回一个value属性等于undefined、done属性等于true的对象，即JavaScript引擎认为这个Generator已经运行结束了。

//Generator函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历Generator函数。
//如果return方法调用时，不提供参数，则返回值的value属性为undefined。
function* gen3() {
  yield 1;
  yield 2;
  yield 3;
}

var g3 = gen3();

g3.next()        // { value: 1, done: false }
g3.return('foo') // { value: "foo", done: true }
console.log(g3.return());
g3.next()        // { value: undefined, done: true }
//如果Generator函数内部有try...finally代码块，那么return方法会推迟到finally代码块执行完再执行。

//使用yield*语句，在一个Generator函数里面执行另一个Generator函数。等同于在Generator函数内部，部署一个for...of循环。
//如果被代理(内部)的Generator函数有return语句，那么就可以向代理它的Generator函数返回数据
function *foo() {
  yield 2;
  yield 3;
  return "foo";
}
function *bar() {
  yield 1;
  var v = yield* foo();
  console.log( "v: " + v );
  yield 4;
}
var it = bar();
it.next() // {value: 1, done: false}
it.next() // {value: 2, done: false}
it.next()  // {value: 3, done: false}
it.next();  // "v: foo"  // {value: 4, done: false}
it.next()   // {value: undefined, done: true}

//如果对象属性是Generator函数，可简写为：
// let obj = {
//   * myGeneratorMethod() {
//     ···
//   }
// };

//Generator函数总是返回一个遍历器，ES6规定这个遍历器是Generator函数的实例，也继承了Generator函数的prototype上的方法。
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'

//Generator函数返回的是遍历器对象。而不是this。所以在函数中this上添加的属性，它的实例上拿不到。
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj1 = {};
var f1 = F.call(obj1);

f1.next();  // Object {value: 2, done: false}
f1.next();  // Object {value: 3, done: false}
f1.next();  // Object {value: undefined, done: true}

obj1.a // 1
console.log(11, f1.a, f1.b, f1.c);
obj1.b // 2
obj1.c // 3

