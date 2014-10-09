/**
 * @author caifq 2013.7.9
 */
(function(){

	function Tips(cfg){
		var D = this;
		cfg = $$.extend( $$.clone(D.defaultOption), cfg );
		$$.extend( D, cfg );
		if( !D.container ) D.container = window.document.body;
		this.dom = getDom( D.container );
		this.offect = {x:0, y:0};
		init.call(D);
	};
	
	Tips.prototype = {
		defaultOption : {
			container : null, type : undefined, edit : false, 
			title : "", content : "",
			closeCall : null, okCall : null,
			x : undefined, y : undefined, width : 300, height : 100,
			hiddenTime : 0, okButton : "确定", closeButton : true,
			needClick : false, needClickCall : null
		},
		
		moveTo : function( x, y, type ){
			var D = this,
				t = type,
				rotate = 80, arrawHalfH = 22,
				dArrow = $$.dom(".tips_arraw", D.dom)[0],
				cont = D.container;
			if( x === undefined && y === undefined ){
				x = (cont.offsetWidth - D.width) / 2;
				y = (cont.offsetHeight - D.height) / 2; 
			}	
			D.x = parseFloat(x);
			D.y = parseFloat(y);
			
			if( t === undefined ){
				t = ( x + D.width >= cont.offsetWidth ) ? "right " : "left ";
				t +=  ( y < D.height + arrawHalfH ) ? "top" : "bottom";
			}
			D.type = t;			
			
			if( t == 1 || t == "left top" ){
				$$.css( dArrow, {left:"5px", top:"-10px"});
				D.offect = { x:0, y:arrawHalfH  };
				rotate = 10;
			}else if( t == 2 || t == "right top" ){
				$$.css( dArrow, {left:(D.width-5-28)+"px", top:"-10px"});
				D.offect = { x:-D.width, y:arrawHalfH  };
				rotate = 80;
			}else if( t == 3 || t == "right bottom" ){
				$$.css( dArrow, {left:(D.width-5-28)+"px", top:(D.height-20)+"px"});
				D.offect = { x:-D.width, y: -D.height-arrawHalfH  };
				rotate = 10;
			}else if( t == 4 || t == "left bottom" ){
				$$.css( dArrow, {left:"5px", top:(D.height-20)+"px"});
				D.offect = { x:0, y: -D.height-arrawHalfH };
			}else{
				dArrow.style.display = "none";
				D.offect = {x:0, y:0};
			}
			if( t !=0 ) getTransform.call( dArrow, rotate );
			$$.css(D.dom, { left : (D.x + D.offect.x)+'px', top : (D.y+D.offect.y)+'px' });
			return this;
		},
		
		shaking : function(){
			var D = this;
			if( D.isShaking || (D.needClickCall && D.needClickCall.call( D ) === false) ) return;
			D.isShaking = true;
			
			var l = parseFloat( D.dom.style.left ),
				ws = 70, totalTime = 500, lastT = sT = now = +new Date(),
				v = ws * 8 / totalTime, 
				s = 0,
			shake = function(){
				now = +new Date();
				if( Math.abs( now - sT - totalTime ) <= 13 ) {
					D.dom.style.left = l +"px";
					D.isShaking = false;
					return;
				}
				s += v*(  - lastT + (lastT = now) );
				if( Math.abs(s) >= ws ) v *= -1; 
				D.dom.style.left = l + s +"px";
				
				setTimeout( shake, 13 );
			};
			shake();
		},
		
		show : function(){
			this.dom.style.display = "block";
			if(this.needClick && this.curtain) this.curtain.style.display = "block";
			return this;
		},
		
		hide : function(destroy){ 
			this.dom.style.display = "none";
			if(this.curtain) this.curtain.style.display = "none";
			destroy && this.destroy(destroy);
			return this;
		},
		
		destroy : function( quote ){
			this.dom.parentNode.removeChild( this.dom );
			if(this.curtain) this.curtain.parentNode.removeChild( this.curtain );
			if( quote ) try{ quote = null; }catch(e){};
		},
		
		noSelect : function(){
			this.dom.setAttribute( "class", this.dom.getAttribute("class") + " __noselect" );
			return this;
		},
		
		set : function( cfg ){
			var D = this, a;
			
			$$.dom(".tips_ok", D.dom)[0].removeEventListener("click", D.okCall, false);
			$$.dom(".tips_close", D.dom)[0].removeEventListener("click", D.closeCall, false);
			for( a in cfg ){
				if( D.hasOwnProperty(a) ) D[a] = cfg[a]; 
			}
			init.call( D );
			return D;
		},
		
		setTitleContent : function( title, content ){
			var D = this,
				dTitle = $$.dom(".tips_title", D.dom)[0], 
				dContent = $$.dom(".tips_content", D.dom)[0];
				
			if( title !== null ) dTitle.innerHTML = D.title = title;
			if( content !== null ) dContent.innerHTML = D.content = content;
			
			return this;
		},
		
		update : function(){
			var D = this,
				dTitle = $$.dom(".tips_title", D.dom)[0], 
				dContent = $$.dom(".tips_content", D.dom)[0],
				tTitle = $$.type(D.title),
				tCont = $$.type(D.content);
				
			dTitle.setAttribute("contenteditable", !!D.edit);
			dContent.setAttribute("contenteditable", !!D.edit);
			if( D.edit ) dTitle.focus();
			
			if( tTitle=="number" || tTitle=="string" ) dTitle.innerHTML = D.title;
			if( tCont=="number" || tCont=="string" ) dContent.innerHTML = D.content;
			
			D.dom.style.width = parseInt( D.width ) +"px";
			D.dom.style.height = parseInt( D.height ) +"px";
			
			$$.dom(".tips_ok", D.dom)[0].style.display = D.okButton ? "block" : "none";
			$$.dom(".tips_close", D.dom)[0].style.display = D.closeButton ? "block" : "none";
			
			if( D.okButton ) $$.dom(".tips_ok", D.dom)[0].innerHTML = D.okButton;
			
			if( D.needClick && !D.curtain ) addCurtain.call( D );
				
			D.moveTo( D.x, D.y, D.type );
			
			if( (D.hiddenTime = parseInt(D.hiddenTime)) > 0 ) setTimeout( function(){ D.hide.call(D, true); }, D.hiddenTime);
			
			return D;
		},
		
		fixProp : function(){
			var D = this,
				t = D.type,
				left = parseFloat($$.css( D.dom, "left" )),
				top = parseFloat($$.css( D.dom, "top" )),
				o = D.offect;
			D.width = parseFloat($$.css( D.dom, "width" ));
			D.height = parseFloat($$.css( D.dom, "height" ));
			
			D.x = left;
			D.y = top;
			if( t == 1 || t == "left top" ){
				D.y = top - o.y;
			}else if( t == 2 || t == "right top" ){
				D.x = left + o.x;
				D.y = top - o.y;
			}else if( t == 3 || t == "right bottom" ){
				D.x = left + o.x;
				D.y = top + o.y;
			}else if( t == 4 || t == "left bottom" ){
				D.y = top + o.y;
			}
			
			return D;
		}
	};
	
	Tips.Init = function( cfg ){
		$$.each( cfg , function(i,v){
			if( i in DefaultAttrs ) DefaultAttrs[i] = v;
		})		
	}
	
	var DefaultAttrs = {
		background : "#fff",
		fontColor : "#555A57"
	};
	
	var getDom = function( container ){
		var ret, html, div = document.createElement("div"),
			style = "style='background-color:" + DefaultAttrs.background + ";color:" +DefaultAttrs.fontColor+ ";'";
		
		html = '<div class="tips" '+style+'><div class="tips_title"></div><div class="tips_content"></div><div class="tips_arraw" '+style+'>';
		html +='</div><div class="dialog_close bg1 tips_close" title="关闭"></div><div class="cButton tips_ok">确定</div></div>';
		//console.log(html); return
		div.innerHTML = html;
		ret = $$.dom(".tips", div)[0];
		container.appendChild( ret );
		div = null; 
		return ret;
	}, 
	
	init = function(){
		var D = this,
			okBut = $$.dom(".tips_ok", D.dom)[0], closeBut = $$.dom(".tips_close", D.dom)[0],
			calls = [ D.okCall, D.closeCall ];

		$$.each( [okBut,closeBut], function(i, b){
			var oldCall = i === 0 ? D.okCall : D.closeCall;
			calls[i] = function(){	
				var ret;
				if( oldCall && (ret = oldCall.call(D) ) === false ) return;			
				D && D.hide();
				if( ret === undefined && D ) D.destroy();
			}
			
			b.addEventListener("click", calls[i], false);
		    i === 0 ? (D.okCall = calls[i]) : (D.closeCall = calls[i]);
		});
		D.update();
	},
	
	getTransform = function(rotate){
		var trans = agent + "transform";
		trans = trans.replace(/-([a-z])/g, function(a,b){
			return (b+"").toUpperCase();
		} );
		this.style[trans]= "rotate("+rotate+"deg) skew(28deg,28deg)";
	},
	
	addCurtain = function(){
		var D = this, 
			cur =  document.createElement("div");
		$$.css( cur, {
			width:(window.innerWidth-5)+"px", height:(window.innerHeight-5)+"px", 
			position:"absolute", left:2+"px", top:2+"px", opacity:0.4, zIndex:999 ,
			background:"#000"
		});
		cur.addEventListener("click", function(){ 
			D.shaking(); 
			if( D.needClickCall )  D.needClickCall.call( D );
		}, false);	
		window.document.body.appendChild(cur);
		D.curtain = cur;
	},
	
	agent;
	
	var $$ = {
		dom : function(selector, context){
			context = context || window.document;
			var rets = [], f = selector.charAt(0), select = selector.substr(1), ret;
			if(f=="#"){ 			
				return context.getElementById(select);			
			}else if(f=="."){ 
				ret = context.getElementsByClassName(select);
				for(var i=0; i<ret.length;i++) rets.push(ret[i]);
			}else{
				ret = context.getElementsByTagName(selector);
				for(var i=0; i<ret.length;i++) rets.push(ret[i]);
			}
			return rets;
		},
		each : function(target, operate){ 
			var key, value, isStop,
				type = this.type( target );
			if(type == "object"){
				for (key in target){
					value = target[key];
					isStop = operate.call( value, key, value );
					if(isStop === false) break;
				}
			}else if(type == "array"){
				for (var i=0; i<target.length;i++){
					value = target[i];
					isStop = operate.call( value, i, value );
					if(isStop === false) break;
				}
			}
			
		},
		type : function(obj){
			if(obj == null) return "null";
			var tt = Object.prototype.toString.call(obj).split(" ");
			if(tt.length<2) return "object";
			return tt[1].substr(0,tt[1].length-1).toLowerCase();
		},
		haskey : function( obj ){
			var type = this.type(obj);
			if(type=="array") return !!obj.length;
			if( type == "object" ) for(var key in obj ){ return true; };	
			return false;
		},	
		extend : function( target, source, deep ){
			var tar_key, tar_val, sou_key, sou_val, 
				type = this.type(source),
				deep = !!deep;
			if( type == "object" ){
				for ( sou_key in source ){
					if( deep && (sou_key in target) && this.haskey( target[sou_key] ) ) 
						this.extend( target[sou_key], source[sou_key], deep );
					else target[sou_key] = source[sou_key];
				}
			}else if( type == "array" ){
				for ( sou_key = 0; sou_key < source.length; sou_key++ ){
					if( deep && (sou_key in target) && this.haskey( target[sou_key] ) ) 
						this.extend( target[sou_key], source[sou_key], deep );
					else target[sou_key] = source[sou_key];
				}
			}
			return target;
		},
		clone : function(obj){
			var key, newObj = this.type(obj) == "array" ? [] : {};
			var key, newObj, type = this.type(obj);
			if( type == "array" ) return obj.slice(0);
			if( type == "object" ){ for ( key in obj ) newObj[key] = obj[key]; }
			else newObj = obj;
			return newObj;
		},
		agent : function(){
			var s = window.navigator.userAgent.toLowerCase();
			if( /msie/.test(s) ){
				return ["-ms-", 1];
			}else if( /firefox/.test(s) ){
				return ["-moz-", 2];
			}else if( /chrome/.test(s) ){
				return ["-webkit-", 3];
			}else if( /safari/.test(s) ){
				return ["-o-", 4];
			}else{
				return ["", 0];
			}
		},
		css : function( obj, name, value){
			if(!obj) return;	
			if(name && value) {
				try{ obj.style[name] = value; }catch(e){ }
			}else if ( this.type(name) == "object" ){
				for(i in name){
					if( name[i] != null ) obj.style[i] = name[i];
				}
			}else if( ( this.type(name) =="string") && !value ){
				return getCss(obj, name);
			}
			return obj;
		}
	};
	
	agent = $$.agent()[0];
	
	function getCss(o, n) {//CSS
		if(window.getComputedStyle) {
			n = n.replace(/([A-Z])/g, '-$1');
			n = n.toLowerCase();
			return window.getComputedStyle(o, null).getPropertyValue(n);
		} else if(o.currentStyle) {
			if(n == 'opacity') {
				return o.currentStyle["filter"].indexOf('opacity') >= 0 ? (parseFloat(o.currentStyle["filter"].match(/\d[\d\.]*(\d?)/g)) / 100) : '1';
			}
			return o.currentStyle[n];
		}
	}
	
	window.Tips = Tips;
	
})(window);