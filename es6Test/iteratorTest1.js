function makeIterator(array) {
	let nextIndex = 0;
	return {
		next () {
			return nextIndex < array.length ?
				{value: array[nextIndex++]} :
				{done: true};
		}
	}
}
let arr = ['s', 'd'];
let it = makeIterator(arr);
console.log(it.next());
console.log(it.next());
console.log(it.next());

//一个对象如果要有可被for...of循环调用的Iterator接口，就必须在Symbol.iterator的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）。
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};

for (let o of obj) {
	console.log(o);
}