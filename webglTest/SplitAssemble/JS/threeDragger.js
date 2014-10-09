/**
 * @author caifq 2013.11.15
 */

var ThreeDragger = {
	
	canvas : null,
	
	camera : null,
	
	scene : null,
	
	controls : null,
	
	container : null,
	
	Object3DCollection : [],
	
	
	
	set : function( camera, canvas, scene, controls, container, start ){
		
		ThreeDragger.canvas = canvas;
		ThreeDragger.camera = camera;
		ThreeDragger.scene = scene;
		ThreeDragger.controls = controls;
		ThreeDragger.container = container;
		if( start ) ThreeDragger.StartDrager();
		
	},
	
	AddObject3D : function( objs, enableDrag ){
		
		if( !objs ) return;
		
		if( Object.prototype.toString.call( objs ) === "[object Array]" ){
			
			for( var i = 0; i < objs.length; i++) objs[i] && ThreeDragger.AddObject3D( objs[i], enableDrag );
			
		}
		
		if( objs instanceof THREE.Object3D ) objs.HanderMouseEvent( enableDrag, enableDrag );
		
	},
	
	AddDefaultEvent : null,
	
	RemoveDefaultEvent : null,
	
	StartDrager : null,
	
	EndDrager : null,
	
	
	
	// private
	__HasAttachEvent : false,
	
	__isDragging : false,
	
	__nowDraggingObj : null,
	
	__nowDraggingObjIndex : null,
	
	__MeshCollection : [],
	
	
	__plane : null,
	__stickycamerra : true,
	
	__GetDragerMeshs : function(){
	
		var ret = [];
		
		for( var i = 0; i < ThreeDragger.Object3DCollection.length; i++) ret = ret.concat( ThreeDragger.Object3DCollection[i].__meshs );
		 
		return ThreeDragger.__MeshCollection = ret;
		
	}
	
};




(function(){
	

var DefaultEvents = { mouseenter : [], mouseleave : [], dragstart : [], dragmove : [], dragend : [] };


ThreeDragger.AddDefaultEvent = function( listennrs ){
	
	var eventType, type, events, i, obj;
	
	for( eventType in listennrs ){
		
		if( !(eventType in DefaultEvents) ) continue;
		
		events = listennrs[ eventType ];
		type = Object.prototype.toString.call( events ).slice( 8, -1 ).toLowerCase();
		
		if( type === "array" ){
			
			for( i = 0; i < events.length; i++){
				
				obj = {};
				obj[ eventType ] = events[i];
				ThreeDragger.AddDefaultEvent( obj );
				
			} 
			
		}else if( type === "function" ){
			
			if( DefaultEvents[ eventType ].indexOf( events ) === -1 ) DefaultEvents[ eventType ].push( events );
			
		}
		
	}
	
}


ThreeDragger.RemoveDefaultEvent = function( listennrs ){
	
	var eventType, type, events, i, obj;
	
	for( eventType in listennrs ){
		
		if( !(eventType in DefaultEvents) ) continue;
		
		events = listennrs[ eventType ];
		type = Object.prototype.toString.call( events ).slice( 8, -1 ).toLowerCase();
		
		if( type === "array" ){
			
			for( i = 0; i < events.length; i++){
				
				obj = {};
				obj[ eventType ] = events[i];
				ThreeDragger.RemoveDefaultEvent( obj );
				
			} 
			
		}else if( type === "function" ){
			
			if( ( i = DefaultEvents[ eventType ].indexOf( events ) ) > -1 ) DefaultEvents[ eventType ].splice( i );
			
		}
		
	}
 
};
	
	
THREE.Object3D.prototype.TriggerEvent = function( type, e, index, intersects ){
	
	var info = this._draggerInfo,
		events, i;
	
	if( type && type in DefaultEvents ){
		
		events = DefaultEvents[ type ].concat( info[ type ] );
		for( i = 0; i < events.length; i++) events[i] && events[i].call( this, e, index, intersects );

	}
	
}	
	
	
})();



THREE.Object3D.prototype.GetMeshs = function( extend ){
	
	var rets = [], obj = this;
	
	if( !(obj instanceof THREE.Mesh) ){
		if( obj.children && obj.children.length && obj.children.length > 0 ){
			for(var i = 0; i < obj.children.length; i++){
				var childs = obj.children[i].GetMeshs( false );
				for(var j = 0; j < childs.length; j++) rets.push( childs[j] );			
			}
		}			
	}else{
		rets.push( obj );			
	}	
	
	if( extend !== false ) this.__meshs = rets;
		
	return rets;
	
}


THREE.Object3D.prototype.enableDrag = undefined;

THREE.Object3D.prototype.HanderMouseEvent = function( refreshMeshs, enableDrag ){
	
	var index = ThreeDragger.Object3DCollection.indexOf( this ),
		i, meshs;
		
	this.enableDrag = !!enableDrag;
	
	if( index > -1 ){
		
		if( refreshMeshs ){
			
			this.GetMeshs();
			ThreeDragger.__GetDragerMeshs();
			
		} 

		return this;
		
	}
	
	this._draggerInfo = { mouseon : false, mouseenter : [], mouseleave : [], dragstart : [], dragmove : [], dragend : [] };
	
	ThreeDragger.Object3DCollection.push( this );
	
	for( i = 0, meshs = this.GetMeshs(); i < meshs.length; i++ ) ThreeDragger.__MeshCollection.push( meshs[i] );
	
	return this;
	
}

THREE.Object3D.prototype.DisHanderMouseEvent = function(){
	
	var index = ThreeDragger.Object3DCollection.indexOf( this );
	
	if( index > -1 ){
		
		this._draggerInfo = null;
		delete this._draggerInfo;
		
		ThreeDragger.Object3DCollection.splice( index );
		ThreeDragger.__GetDragerMeshs();
		
	} 

	return this;
	
}


THREE.Object3D.prototype.AddDragListenner = function( listennrs ){
	// { mouseenter:null, mouseleave:null, dragstart:null, dragmove:null, dragend:null }
	var type, fun, funs, 
		info = this._draggerInfo;
	
	for( type in listennrs ){
		if( type !== "mouseon" && type in info ){
			
			funs = info[ type ];
			fun = listennrs[ type ];
			if( funs.indexOf( fun ) === -1 ) funs.push( fun );
			
		}  
	}
	
};

THREE.Object3D.prototype.RemoveDragListenner = function( listennrs ){
	
	var type, fun, funs, index,
		info = this._draggerInfo;
	
	for( type in listennrs ){
		if( type !== "mouseon" && type in info ){
			
			funs = info[ type ];
			fun = listennrs[ type ];
			if( ( index = funs.indexOf( fun ) ) > -1 ) funs.splice( index );
			
		}  
	}
 
};







(function(){


var mousedownFun, mousemoveFun, mouseupFun,

	getRaycaster, eachDragerCollection, findTheNearestObj,
	
	colls = ThreeDragger.Object3DCollection;



getRaycaster = function( e ){
	
	var projector = new THREE.Projector(),
		mouse2d = new THREE.Vector3( 0, 0, 0.5  ),
		canvas = ThreeDragger.canvas,
		camera = ThreeDragger.camera;
		
	mouse2d.x = ( e.layerX / canvas.width ) * 2 - 1;
	mouse2d.y = - ( e.layerY / canvas.height ) * 2 + 1;		 
	projector.unprojectVector( mouse2d, camera ); 
	
	return new THREE.Raycaster( camera.position, mouse2d.sub( camera.position ).normalize() );
	
}

findTheNearestObj = function( intersects ){
	
	var nearest, obj, i, index, len = intersects.length;
	
	nearest = intersects[0];
	
	if( len > 1 ){
		
		for( i = 1; i < len; i++ ) if( nearest.distance > intersects[i].distance ) nearest = intersects[i];
		 
	}
	
	obj = nearest.object;
	
	while( !("_draggerInfo" in obj) ) obj = obj.parent;
 	
 	index = colls.indexOf( obj );
 	
	return [ obj, index, nearest ];
	
}
	
eachDragerCollection = function( fun ){ 

	var i, len, obj3d;
	
	for( i = 0, len = colls.length; i < len; i++ ){
		
		obj3d = colls[i];
		if( fun.call( obj3d, i ) === false ) return;
		
	}

}
	

mousedownFun = function( e ){
	
	if( e.button !== 0 ) return;
	
	var raycaster = getRaycaster( e ),
		intersects = raycaster.intersectObjects( ThreeDragger.__MeshCollection ),
		plane = ThreeDragger.__plane,
		nearest, nearestObj, info;
	
	if( intersects.length < 1 ) return;
	
	if( ThreeDragger.controls ) ThreeDragger.controls.enabled = false;
	
	nearest = findTheNearestObj( intersects );
	nearestObj = nearest[0];
	
	//先触发离开事件再触发进入事件
	eachDragerCollection(function(){
		
		var info = this._draggerInfo;	
		
		if( !info.mouseon || this === nearestObj ) return;
			
		info.mouseon = false;
		this.TriggerEvent( "mouseleave", e );
			
	}); 
	
		
	info = nearestObj._draggerInfo;	
	if( !info.mouseon ){
		info.mouseon = true;
		nearestObj.TriggerEvent( "mouseenter", e, nearest[1], nearest[2] );
	}
	
	
	if( nearestObj.enableDrag ){
		
		ThreeDragger.__isDragging = true;
		ThreeDragger.__nowDraggingObj = nearestObj;
		ThreeDragger.__nowDraggingObjIndex = nearest[1];
		
		nearestObj.TriggerEvent( "dragstart", e, nearest[1], nearest[2] );
		
		
		intersects = raycaster.intersectObject( plane );
		plane.__offset.copy( intersects[ 0 ].point ).sub( plane.position );
	
	}
	
	
}

mousemoveFun = function( e ){
	
	var raycaster = getRaycaster( e );
	
	if( ThreeDragger.__isDragging ){
		
		var obj3d = ThreeDragger.__nowDraggingObj,
			plane = ThreeDragger.__plane,
			intersects = raycaster.intersectObject( plane );
		 
		obj3d.position.copy( intersects[ 0 ].point.sub( plane.__offset ) );		
		obj3d.TriggerEvent( "dragmove", e, ThreeDragger.__nowDraggingObjIndex, intersects[ 0 ].point );
		//执行 拖拽动作
		
	}else{

		var intersects = raycaster.intersectObjects( ThreeDragger.__MeshCollection ),
			nearest, nearestObj, info;
	
		if( intersects.length < 1 ){
			
			eachDragerCollection(function(){
				
				if( this._draggerInfo.mouseon ){
					this._draggerInfo.mouseon = false;
					this.TriggerEvent( "mouseleave", e );
				}
				
			});
			
			return;
			
		};
		
		nearest = findTheNearestObj( intersects );
		nearestObj = nearest[0];


		eachDragerCollection(function(){
			
			var info = this._draggerInfo;
			
			if( !info.mouseon || this === nearestObj ) return;
			
			info.mouseon = false;
			this.TriggerEvent( "mouseleave", e );
			
		});
		
		
		ThreeDragger.__plane.position.copy( nearestObj.position );
		if( ThreeDragger.__stickycamerra ) ThreeDragger.__plane.lookAt( ThreeDragger.camera.position );
		
		info = nearestObj._draggerInfo;
		if( !info.mouseon ){
			info.mouseon = true;
			nearestObj.TriggerEvent( "mouseenter", e, nearest[1], nearest[2] );
		}
			
		
	}

}

mouseupFun = function( e ){
	
	if( !ThreeDragger.__isDragging ) return;
	
	var obj3d = ThreeDragger.__nowDraggingObj;
	
	obj3d.TriggerEvent( "mouseleave", e );
	obj3d.TriggerEvent( "dragend", e, ThreeDragger.__nowDraggingObjIndex );
	
	ThreeDragger.__isDragging = false;
	ThreeDragger.__nowDraggingObj = null;
	ThreeDragger.__nowDraggingObjIndex = null;
	
	if( ThreeDragger.controls ) ThreeDragger.controls.enabled = true;
	
}


ThreeDragger.__plane = new THREE.Mesh( 
	new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), 
	new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) 
);

ThreeDragger.__plane.__offset = new THREE.Vector3();
ThreeDragger.__plane.visible = false;


ThreeDragger.StartDrager = function( ){
		
	var canvas = ThreeDragger.container || ThreeDragger.canvas,
	scene = ThreeDragger.scene;
	
	scene.add( ThreeDragger.__plane );
	
	if( !ThreeDragger.__HasAttachEvent ){
		
		canvas.addEventListener( "mousedown", mousedownFun, false );
		canvas.addEventListener( "mousemove", mousemoveFun, false );
		canvas.addEventListener( "mouseup", mouseupFun, false );
		ThreeDragger.__HasAttachEvent = true;
		
	}
	
}
	
ThreeDragger.EndDrager = function( ){
		
	var canvas = ThreeDragger.container || ThreeDragger.canvas;
	
	ThreeDragger.scene.remove( ThreeDragger.__plane );

	canvas.removeEventListener( "mousedown", mousedownFun, false );
	canvas.removeEventListener( "mousemove", mousemoveFun, false );
	canvas.removeEventListener( "mouseup", mouseupFun, false );
	ThreeDragger.__HasAttachEvent =  false;
	
}

	
})();




/*
*   make for SplitAssemble App
*/

var Smooth = {};

(function(){
	//{ obj:objPosition, to:toPosition, /*private*/ v:null, old:objPosition }
	//数据结构需调整，去除重复的元素
	var colls = [],
		moveStatck = [],
		statckActive = { active : null, startTime : 0, during : 0 },
		isRunning, _during, startTime;
	
	Smooth.add = function( objPosition, toPosition, inStatck ){
		var ary = inStatck ? moveStatck : colls,
			i, item;
		
		for( i = 0; i < ary.length; i++ ){
			
			item = ary[i];
			
			if( item.obj === objPosition ){
				ary.splice( i, 1 );
				break;
			} 
			
		}
		
		ary.push( {obj: objPosition, to : toPosition} );
	}
	
	Smooth.clear = function( both ){
		if( both == "both" ){
			colls = [];
			moveStatck = [];
		}else if( both = "statck" ){
			moveStatck = [];
		}else{
			colls = [];
		}
	}
	
	Smooth.start = function( during ){
		
		if( isRunning ) return;
		
		isRunning = true;
		
		if( during ) statckActive.during = during;

		var i, item;
		
		for( i = 0; i < moveStatck.length; i++ ){
			
			item = moveStatck[i];
			item.v = getV( item.obj, item.to, statckActive.during );
			if( item.v ) item.old = { x : item.obj.x, y : item.obj.y, z : item.obj.z };
			else moveStatck.splice( i, 1 );
			
		}
		
		
		_during = statckActive.during * ( moveStatck.length || 1 );
		for( i = 0; i < colls.length; i++ ){
			
			item = colls[i];
			item.v = getV( item.obj, item.to, _during );
			if( item.v ) item.old = { x : item.obj.x, y : item.obj.y, z : item.obj.z };
			else colls.splice( i, 1 );
		}
		
		
		if( moveStatck.length > 0 ) statckActive.active = moveStatck.pop();
		statckActive.startTime = startTime = +new Date();

		running();
		
	}
	
	function running(){
		
		if( !isRunning ) return;
		
		var now = +new Date(),
			usedTime = now - startTime,
			s_usedTime = now - statckActive.startTime,
			sa = statckActive.active,
			i, v, item;
		
		if( s_usedTime >= statckActive.during - 30 ){
			
			if( sa ){
				
				sa.obj.x = sa.to.x;
				sa.obj.y = sa.to.y;
				sa.obj.z = sa.to.z;
				
			}
			
			if( moveStatck.length > 0 ){
				
				statckActive.active = moveStatck.pop();
				statckActive.startTime = now;
				
			}else{
				
				for( i = 0; i < colls.length && colls[i].v; i++ ){
					
					item = colls[i];
					item.obj.x = item.to.x;
					item.obj.y = item.to.y;
					item.obj.z = item.to.z;
					
				}
				
				statckActive.active = null;
				isRunning = false;
				Smooth.clear( "both" );
				return;
				
			}	
			
		}else{
			
		
			if( sa  ){
				
				v = sa.v;
				sa.obj.x = v.x*s_usedTime + sa.old.x;
				sa.obj.y = v.y*s_usedTime + sa.old.y;
				sa.obj.z = v.z*s_usedTime + sa.old.z;
				
			}
	
			for( i = 0; i < colls.length && colls[i].v; i++ ){
				
				item = colls[i];
				v = item.v;
				item.obj.x = v.x*usedTime + item.old.x;
				item.obj.y = v.y*usedTime + item.old.y;
				item.obj.z = v.z*usedTime + item.old.z;
				
			}
		
		}
		 
		setTimeout( running, 30);
		
	}
	
	function getV( a, b, t ){
		if( a.equals( b ) ) return null;
		t = t || _during;
		var x = b.x - a.x,
			y = b.y - a.y,
			z = b.z - a.z;
		return { x : x / t, y : y / t, z : z / t };
	}
	
	
})();
