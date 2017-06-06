r	var eventTarget=function(){
		this.eventHandler={};
	};
	eventTarget.prototype={
		constructor:eventTarget,
		addEvent:function(type,callback){
			if(this.eventHandler[type]==null){  // typeof this.eventHandler == "undefined"
				this.eventHandler[type]=[];
			}
			this.eventHandler[type].push(callback);
		},
		fire:function(event){
			if(!event.target){    //!!!!!
				event.target=this;
			}
			var handler = this.eventHandler[event.type];
			if(handler instanceof Array){
				for(var i=0,len=handler.length;i<len;i++){
					handler[i](event);
				}
			}
		},
		removeEvent:function(type,callback){
			var handler=this.eventHandler[type],index=-1;
			if(handler!=null){  // handler instanceof Array
				for(var i=0,len=handler.length;i<len;i++){
					if(handler[i]===callback){
						index=i;
						break;
					}
				}
				if(index>-1){
					handler.splice(index,1);
				}
			}
		}
	};
	
	var cb = function(){
		console.log("do");
	};
	var test = new eventTarget();
	test.addEvent("do",cb);
	test.fire({type:"do"});
	test.removeEvent("do",cb);
	test.fire({type:"do"});
