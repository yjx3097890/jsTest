var Promise = function (resolver) {
  if (typeof resolver !== 'function') {
      throw new TypeError('must pass a function.');
  }
  //防止没有new的调用
  if (!(this instanceof Promise)) {
    return new Promise(resolver);
  }
  var promise = this;
  promise._value;
  promise._reasion;
  promise._status = Promise.PENDING;
  promise._resolves = [];
  promise._rejects = [];

  var resolve = function (value) {
      //状态转换为FULFILLED
      //执行then时保存到_resolves里的回调，
      //如果回调有返回值，更新当前_value
    	if(promise._status !== Promise.PENDING) return;

    		promise._status = Promise.FULFILLED;
        while(fn = promise._resolves.shift()) {
            value = fn.call(promise, value) || value;
        }
        promise._value = value;
    	  promise._resolves = [];
  };
  var reject = function (error) {
    //状态转换为REJECTED
    //执行then时保存到_rejects里的回调，
    //如果回调有返回值，更新当前_rejects
    if(promise._status !== Promise.PENDING) return;

      promise._status = Promise.REJECTED;
      while(fn = promise._rejects.shift()) {
          error = fn.call(promise, error) || error;
      }
      promise._reason = error;
      promise._rejects = [];
  }
  resolver(resolve, reject)
}
Promise.PENDING = 0;
Promise.FULFILLED = 1;
Promise.REJECTED = 2;
Promise.prototype.isPromise = function(obj){
  return obj && obj instanceof Promise;
}
Promise.prototype.then = function (onFulfilled,onRejected) {
  var promise = this;
  return Promise(function (resolve, reject) {
	  if(promise._status === Promise.PENDING){
            promise._resolves.push(callback);
            promise._rejects.push(errback);
        }else if(promise._status === Promise.FULFILLED){ // 状态改变后的then操作，立刻执行
            callback(promise._value);
        }else if(promise._status === Promise.REJECTED){
            errback(promise._reason);
        }
		
      function callback(value){
         var ret = (typeof onFulfilled === 'function') && onFulfilled(value) || value;
         if(promise.isPromise(ret)){
           // 根据返回的promise执行的结果，触发下一个promise相应的状态
           ret.then(resolve, reject);
         }else{
           resolve(ret);
         }
       }
       function errback(reason){
         reason = (typeof onRejected === 'function') && onRejected(reason) || reason;
         reject(reason);
       }
       
     });
  };
