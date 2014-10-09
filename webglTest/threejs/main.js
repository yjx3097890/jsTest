var context;
var canvas;
var drawContext;
var drawCanvas;
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var ratio = window.devicePixelRatio || 1;
var balls = [];
var boxes = [];
var walls = [];
var resized = false;

var drawScale = 0.1;

var totalBalls = 100;
var screenArea = (winWidth/ratio)*(winHeight/ratio);
totalBalls = Math.max(50, Math.floor(screenArea/11500) );
totalBalls = Math.min(totalBalls, 250 );
console.log("totalBalls:", totalBalls);

var settings = {
	gravity : 60.0,
	friction : 0.01,
	bounce : 0.1,
	damping : 0.01,
	checkBallCollision : true,
	numOfBalls: totalBalls,
}

var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
var time;
var oldTime;
var delta;

var selectedBox = null;

// box2d setup
var scale = 30;

var b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2AABB = Box2D.Collision.b2AABB,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

var world = new b2World(
	new b2Vec2(0, settings.gravity),
	true // sleep
);

createWalls();

for(var i = 0; i < settings.numOfBalls; ++i) {
	createBall();
}

createBox(4,4);
createBox(2,2);

// 
var container;

var camera, scene, renderer, composer;
var attributes;
var effectThreshold;
var scene2;
var spriteArray = [];
var cubeArray = [];
var bg;
var bubbleArray = [];

function init() {

	initWebGL();

	drawCanvas = document.getElementById('debugOutline');
	drawCanvas.width = winWidth*drawScale;
	drawCanvas.height = winHeight*drawScale;
	drawContext = drawCanvas.getContext('2d');

	loop();

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	document.addEventListener( 'touchstart', onTouchStart, false );
	document.addEventListener( 'touchmove', onTouchMove, false );
	document.addEventListener( 'touchend', onTouchEnd, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function initWebGL () {
	
	container = document.createElement( 'div' );
	container.id = "container";
	container.style.zIndex = 2;
	document.body.appendChild( container );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 500 );
	camera.position.z = 100;
	camera.lookAt(scene.position);
	scene.add( camera );

	scene2 = new THREE.Scene();


	// sprinkle
	attributes = {

		size: {	type: 'f', value: [] },
		customColor: { type: 'c', value: [] }

	};

	var uniforms = {

		amplitude: { type: "f", value: 1.0 },
		color:     { type: "c", value: new THREE.Color( 0x00ff00 ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "star.png" ) },

	};

	var shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: 		uniforms,
		attributes:     attributes,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

		blending: 		THREE.AdditiveBlending,
		depthTest: 		false,
		transparent:	true

	});


	var radius = 50;
	var geometry = new THREE.Geometry();

	for ( var i = 0; i < 2500; i++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 4 - 2;
		vertex.y = Math.random() * 2 - 1;
		vertex.z = 0;
		vertex.multiplyScalar( radius );

		geometry.vertices.push( vertex );

	}

	var sprinkle = new THREE.ParticleSystem( geometry, shaderMaterial );


	var vertices = sprinkle.geometry.vertices;
	var values_size = attributes.size.value;


	for( var v = 0; v < vertices.length; v++ ) {

		values_size[ v ] = 10;

	}

	scene.add( sprinkle );


	// balls
	var ballMap = THREE.ImageUtils.loadTexture( "ball.png" );
	var ballMaterial = new THREE.SpriteMaterial( { color: 0xffffff, map: ballMap, blending: THREE.AdditiveBlending, alignment: THREE.SpriteAlignment.center, opacity: 1.0 } );
					
	for (var i = 0; i < settings.numOfBalls; i++) {
		var sprite = new THREE.Sprite( ballMaterial );
		scene.add( sprite );

		spriteArray.push(sprite);
	}

	// bubbles
	var bubbleMap = THREE.ImageUtils.loadTexture( "bob.png" );

	for (var i = 0; i < 100; i++) {
		var material = new THREE.SpriteMaterial( { color: 0xffffff, map: bubbleMap, alignment: THREE.SpriteAlignment.center, blending: THREE.AdditiveBlending, opacity: 1.0 } );
		var bubble = new THREE.Sprite( material );
		scene2.add( bubble );

		var metaBubble = new THREE.Sprite( ballMaterial );
		scene.add( metaBubble );

		bubbleArray.push({sprite: bubble, sprite2: metaBubble});
		respawnBubble(i);
	}
	


	// boxes
	var boxMap = THREE.ImageUtils.loadTexture( "box0.png" );
	var material = new THREE.SpriteMaterial( { color: 0xffffff, map: boxMap, alignment: THREE.SpriteAlignment.center, opacity: 1.0 } );

	var boxMap3 = THREE.ImageUtils.loadTexture( "box1.png" );
	var material3 = new THREE.SpriteMaterial( { color: 0xffffff, map: boxMap3, alignment: THREE.SpriteAlignment.center, opacity: 1.0 } );

	var m = [material, material3];

	for (var i = 0; i < boxes.length; i++) {
		var box = new THREE.Sprite( m[i] );
		scene2.add( box );

		cubeArray.push(box);
	}

	// bg
	var bgMaterial = new THREE.SpriteMaterial( { map: THREE.ImageUtils.loadTexture( "gradient.png" ), useScreenCoordinates: true, opacity: 1.0 } );
	bg = new THREE.Sprite( bgMaterial );
	bg.scale.set( winWidth/ratio, winHeight/ratio , 1 );
	bg.position.set((winWidth/ratio)/2, (winHeight/ratio)/2 , 0);
	scene2.add(bg);	

	try {

		// renderer
		renderer = new THREE.WebGLRenderer({antialias: false});
		renderer.setSize( winWidth/ratio, winHeight/ratio );

		// postprocessing
		renderer.autoClear = false;

		var renderModel = new THREE.RenderPass( scene, camera );
		effectThreshold = new THREE.ShaderPass( THREE.ThresholdShader );
		var map = THREE.ImageUtils.loadTexture( "dstripe.jpg" );
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
		effectThreshold.uniforms[ 'texture' ].value = map;
		effectThreshold.renderToScreen = true;
		effectThreshold.material.transparent = true;

		composer = new THREE.EffectComposer( renderer );
		composer.setSize(winWidth, winHeight);
		composer.addPass( renderModel );
		composer.addPass( effectThreshold );

		if (ratio > 1) {
			renderer.domElement.style.webkitTransform = "scale3d("+ratio+", "+ratio+", 1)";
			renderer.domElement.style.webkitTransformOrigin = "0 0 0";

			scale = scale/ratio;
		}

		container.appendChild( renderer.domElement );

	}
	catch (e) {
		// need webgl
		document.getElementById('info').innerHTML = "<P><BR><B>Note.</B> You need a modern browser that supports WebGL for this to run the way it is intended.<BR>For example. <a href='http://www.google.com/landing/chrome/beta/' target='_blank'>Google Chrome 9+</a> or <a href='http://www.mozilla.com/firefox/beta/' target='_blank'>Firefox 4+</a>.<BR><BR>If you are already using one of those browsers and still see this message, it's possible that you<BR>have old blacklisted GPU drivers. Try updating the drivers for your graphic card.<BR>Or try to set a '--ignore-gpu-blacklist' switch for the browser.</P><CENTER><BR><img src='../general/WebGL_logo.png' border='0'></CENTER>";
		document.getElementById('info').style.display = "block";
		return;
	}
}

function loop() {
	requestAnimationFrame( loop );

	time = Date.now();
	delta = time - oldTime;
	oldTime = time;	

	if (isNaN(delta) || delta > 1000 || delta == 0 ) {
		delta = 1000/60;
	}

	if(isMouseDown && (!mouseJoint)) {
	   var body = getBodyAtMouse();
	   if(body) {
		  //console.log(body == boxes[1]);
		  //body.m_fixtureList.m_density = 100;
		  if (body == boxes[0] || body == boxes[1]) {
			  body.m_fixtureList.SetDensity((body.m_userData.w*body.m_userData.h)*0.5);
			  body.ResetMassData();
			  selectedBox = body;
			  //console.log(body.m_fixtureList);
		  }

		  var md = new b2MouseJointDef();
		  md.bodyA = world.GetGroundBody();
		  md.bodyB = body;
		  md.target.Set(mouseX, mouseY);
		  md.collideConnected = true;
		  md.maxForce = 40000.0 * body.GetMass();
		  mouseJoint = world.CreateJoint(md);
		  body.SetAwake(true);
	   }
	}
	
	if(mouseJoint) {
	   if(isMouseDown) {
		  mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
	   } else {
		  world.DestroyJoint(mouseJoint);
		  mouseJoint = null;
		  if (selectedBox != null) {
			selectedBox.m_fixtureList.SetDensity(0.1);
			selectedBox.ResetMassData();
		  	selectedBox = null;
		  }
	   }
	}

	if (resized) {
		createWalls();
	}
 
	world.Step(1 / 60, 8, 4);
	//world.ClearForces();

	// drawCanvas
	drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
	drawContext.fillStyle = "#ff0000";

	var pos, r;
	var ds = scale*drawScale;
	var extraRadius = 4/ratio;
	var extraY = 0;

	for (var i=0; i<settings.numOfBalls; ++i ) {

		pos = balls[i].GetPosition();
		r = balls[i].m_fixtureList.m_shape.m_radius*ds + extraRadius;

		// draw
		drawContext.beginPath();
		drawContext.arc(pos.x*ds, pos.y*ds + extraY, r, 0, Math.PI*2, false); 
		drawContext.closePath();
		drawContext.fill();

	}


	var box, cube, angle, w, h;
	for (var i=0; i<boxes.length; ++i ) {

		box = boxes[i];
		cube = cubeArray[i];

		pos = box.GetPosition();
		angle = box.GetAngle();

		w = (box.m_userData.w*ds)*2.1;
		h = (box.m_userData.h*ds)*2.1;

		// draw
		drawContext.save();

		drawContext.fillStyle = "rgb("+(i+1)+",0,0)";

		drawContext.translate(pos.x*ds, pos.y*ds);
		drawContext.rotate(angle);
		drawContext.fillRect(-w/2, -h/2, w, h);

		drawContext.restore();
		
	}

	runBubbles();

	renderWebGL();

}

function renderWebGL () {

	var pos, r, sprite;

	for (var i=0; i<settings.numOfBalls; ++i ) {

		pos = balls[i].GetPosition();
		r = (balls[i].m_fixtureList.m_shape.m_radius*scale)*6;

		// draw
		sprite = spriteArray[i];
		sprite.position.set( pos.x*scale, pos.y*scale, 0 );
		sprite.scale.set( r, r, 1 );

	}

	var box, cube, angle, w, h;
	for (var i = 0; i < boxes.length; i++) {
		box = boxes[i];
		cube = cubeArray[i];

		pos = box.GetPosition();
		angle = box.GetAngle();

		//box.SetLinearVelocity( new b2Vec2(0, -4) );

		w = (box.m_userData.w*scale)*2.1;
		h = (box.m_userData.h*scale)*2.1;

		var yy = (pos.y*scale)/winHeight;
		cube.material.color.setHSL(0, 0, 1-yy*0.75);

		// draw
		cube.position.set( pos.x*scale, pos.y*scale, 0 );
		cube.scale.set( w, h, 1 );
		cube.rotation = -angle;

	}

	effectThreshold.uniforms[ 'globalTime' ].value += 0.001;

	for( var i = 0; i < attributes.size.value.length; i++ ) {

		attributes.size.value[ i ] = 7 + 25 * Math.sin( 0.1 * i + time*0.003 );

	}

	attributes.size.needsUpdate = true;

	renderer.clear();
	renderer.render( scene2, camera );
	composer.render( 0.01 );

}

function runBubbles () {
	
	for (var i = 0; i < bubbleArray.length; i++) {
		var bubble = bubbleArray[i];

		bubble.y -= bubble.speed/ratio;
		bubble.x += Math.sin(time/500 + i)*1;

		bubble.sprite.position.set(bubble.x, bubble.y, 0);

		bubble.sprite2.position = bubble.sprite.position;

		var scm = 1;
		
		if (bubble.shouldDie) {
			bubble.life *= 0.9*(16/delta)/ratio;

			if (bubble.life < 0.1) {
				respawnBubble(i);
				continue;
			}

			bubble.sprite.material.opacity = bubble.alpha*bubble.life;

			scm = 1-((1-bubble.life)*0.5);

			var pick = pickDraw(bubble.x, bubble.y);

				if (pick == 1 || pick == 2) {
					var box = boxes[pick-1];
					var vel = box.GetLinearVelocity();
					vel.y -= 0.4;
					box.SetLinearVelocity( vel );
				};
			
		}

		var sc = (bubble.size + Math.sin(time/1000 + i)*5)*scm;

		bubble.sprite.scale.set(sc, sc, 0);
		bubble.sprite2.scale.set(sc*4, sc*4, 0);


		if (bubble.y < winHeight-10 && !bubble.shouldDie) {
			var pick = pickDraw(bubble.x, bubble.y);
			if (pick < 50) {
				bubble.shouldDie = true;
			}
		}
	}

}

function respawnBubble (i) {

	var bubble = bubbleArray[i];

	bubble.x = Math.random()*winWidth/ratio;
	bubble.y = winHeight/ratio+Math.random()*(winHeight/ratio)/4;

	var size = (10 + Math.random()*20)/ratio;
	bubble.size = size;	

	bubble.speed = 0.5 + Math.random()*4;

	bubble.alpha = 0.1 + Math.random()*0.4;
	bubble.sprite.material.opacity = bubble.alpha;

	bubble.shouldDie = false;
	bubble.life = 1;

}

function pickDraw (x,y) {
	var data = drawContext.getImageData(Math.floor(x*drawScale), Math.floor(y*drawScale), 1, 1).data;
    return data[0];
}

function onDocumentMouseDown ( event ) {

	event.preventDefault();
	
	isMouseDown = true;
	onDocumentMouseMove(event);

}

function onDocumentMouseUp ( event ) {

	isMouseDown = false;
	mouseX = undefined;
	mouseY = undefined;

}


function onDocumentMouseMove ( event ) {
	
	var m = renderer.domElement.relMouseCoords(event);
	mouseX = (m.x / scale)/ratio;
	mouseY = (m.y / scale)/ratio;

}

function onTouchStart(event) { 
	
	isMouseDown = true;
	onTouchMove(event);

}

function onTouchMove(event) { 

	event.preventDefault();
	
	mouseX = (event.touches[0].clientX / scale)/ratio;
	mouseY = (event.touches[0].clientY / scale)/ratio;

}

function onTouchEnd(event) { 

	isMouseDown = false;
	mouseX = undefined;
	mouseY = undefined;

}

function onWindowResize ( event ) {
	
	winWidth = window.innerWidth;
	winHeight = window.innerHeight;

	drawCanvas.width = winWidth*drawScale;
	drawCanvas.height = winHeight*drawScale;

	renderer.setSize( winWidth/ratio, winHeight/ratio );

	camera.aspect = winWidth / winHeight;
	camera.updateProjectionMatrix();

	bg.scale.set( winWidth/ratio, winHeight/ratio , 1 );
	bg.position.set((winWidth/ratio)/2, (winHeight/ratio)/2 , 0);

	effectThreshold.uniforms[ 'size' ].value.set( winWidth/3, winHeight/3 );

	composer.reset();
	composer.setSize(winWidth, winHeight);

	resized = true;

}

function getBodyAtMouse() {
	mousePVec = new b2Vec2(mouseX, mouseY);
	var aabb = new b2AABB();
	aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
	aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

	selectedBody = null;
	world.QueryAABB(getBodyCB, aabb);
	return selectedBody;
}

function getBodyCB(fixture) {
	if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
		if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
			selectedBody = fixture.GetBody();
			return false;
		}
	}
	return true;
}

function createWalls () {
	if (walls.length > 0) {
		world.DestroyBody(walls[0].GetBody());
		world.DestroyBody(walls[1].GetBody());
		world.DestroyBody(walls[2].GetBody());
		world.DestroyBody(walls[3].GetBody());

		delete walls[0];
		delete walls[1];
		delete walls[2];
		delete walls[3];
	}

	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = settings.friction;
	fixDef.restitution = settings.bounce;

	var bodyDef = new b2BodyDef;

	//create ground
	bodyDef.type = b2Body.b2_staticBody;
	var extra = 100000;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(winWidth/2/scale, extra/scale);
	bodyDef.position.Set(winWidth/2/scale, winHeight/scale + extra/scale);
	walls[0] = world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(winWidth/2/scale, -extra/scale);
	walls[1] = world.CreateBody(bodyDef).CreateFixture(fixDef);
	fixDef.shape.SetAsBox(extra/scale, winHeight/2/scale);
	bodyDef.position.Set(-extra/scale, winHeight/2/scale);
	walls[2] = world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(winWidth/scale + extra/scale, winHeight/2/scale);
	walls[3] = world.CreateBody(bodyDef).CreateFixture(fixDef);

	resized = false;

}

function createBall () {
	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = settings.friction;
	fixDef.restitution = settings.bounce;

	var bodyDef = new b2BodyDef;

	bodyDef.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2CircleShape( Math.random()*0.5 + 0.75 );
	
	bodyDef.position.x = Math.random() * winWidth/scale;
	bodyDef.position.y = Math.random() * winHeight/scale;
	bodyDef.linearVelocity = new b2Vec2(Math.random()*20-10, Math.random()*20-10);

	var ball = world.CreateBody(bodyDef).CreateFixture(fixDef);
	ball.GetBody().SetLinearDamping(settings.damping);

	balls.push(ball.GetBody());
}

function createBox (w,h) {
	var fixDef = new b2FixtureDef;
	fixDef.density = 0.1;//(w*h)*0.2;
	fixDef.friction = 0.01;//settings.friction;
	fixDef.restitution = settings.bounce;

	var bodyDef = new b2BodyDef;

	bodyDef.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(
         w //half width
      ,  h //half height
    );

	bodyDef.position.x = Math.random() * winWidth/scale;
	bodyDef.position.y = 50/scale;
	bodyDef.linearVelocity = new b2Vec2(Math.random()*20-10, Math.random()*20-10);

	var box = world.CreateBody(bodyDef).CreateFixture(fixDef);
	box.GetBody().SetLinearDamping(settings.damping);

	box.GetBody().m_userData = {w:w, h:h};

	console.log(box.GetBody());

	boxes.push(box.GetBody());
}


HTMLCanvasElement.prototype.relMouseCoords = function (event) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = this;

	do {
		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;
	}
	while (currentElement = currentElement.offsetParent)

	canvasX = event.pageX - totalOffsetX;
	canvasY = event.pageY - totalOffsetY;

	// Fix for variable canvas width
	canvasX = Math.round( canvasX * (this.width / this.offsetWidth) );
	canvasY = Math.round( canvasY * (this.height / this.offsetHeight) );

	return {x:canvasX, y:canvasY}
}