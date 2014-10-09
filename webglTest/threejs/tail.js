/* 
 * tail.js - generate the trajectory of any object3D ball .
 * version 0.01
 * author yanjixian
 *
 * This class is dependent on threejs and sparksjs.
 * render方法中需要有： 
 *              tail.geometry.verticesNeedUpdate = true; 
 *              tail.geometry.colorsNeedUpdate = true;
 * 
 *
 */
 
 THREE.Tail = function(position, size, color, length) {
    
    var tail, particles, material, emitterpos, sparksEmitter, args = {};
    var Pool = {
		__pools: [],
		// Get a new Vector
		get: function() {
		if ( this.__pools.length > 0 ) {
			return this.__pools.pop();
		}
		console.log( "pool ran out!" )
		return null;
		},
		// Release a vector back into the pool
		add: function( v ) {
			this.__pools.push( v );
		}
	};
    
    args.size =  size || 10;
    args.color = color || new THREE.Color(0xffffff);
    args.length = length || 1.0;
    args.position = position;
    particles = new THREE.Geometry();
    for(var i=0; i < 5000; i++) {
        particles.vertices.push( new THREE.Vector3( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY  ) );
        particles.colors.push( new THREE.Color( 0x000000 ) );    ////background color
        Pool.add(i);
    }
    var sprite = new THREE.Texture(generateSprite(args.color));
    sprite.needsUpdate = true;
    material = new THREE.ParticleBasicMaterial( { size: args.size,  map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true ,  vertexColors: THREE.VertexColors} );
    tail = new THREE.ParticleSystem(particles, material);
    tail.args = args;            
    //sparks
    sparksEmitter = new SPARKS.Emitter( new SPARKS.SteadyCounter( 1000 ) );
	emitterpos = new THREE.Vector3( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
	sparksEmitter.addInitializer( new SPARKS.Position( new SPARKS.PointZone( emitterpos ) ) );
	sparksEmitter.addInitializer( new SPARKS.Lifetime( 0, args.length ));  //粒子存在时间
	sparksEmitter.addInitializer( new SPARKS.Target( null, setTargetParticle ) );   

	// TOTRY Set velocity to move away from centroid
	sparksEmitter.addAction( new SPARKS.Age() );
	//sparksEmitter.addAction( new SPARKS.Accelerate( 1000 ) ); //设置一个运动的加速度
	sparksEmitter.addAction( new SPARKS.Move() );
	//sparksEmitter.addAction( new SPARKS.RandomDrift( 10, 10, 10 ) );   //粒子位置的最大摆动

	sparksEmitter.addCallback( SPARKS.EVENT_PARTICLE_CREATED, onParticleCreated );
	sparksEmitter.addCallback( SPARKS.EVENT_PARTICLE_DEAD, onParticleDead );
	sparksEmitter.start();

    //sparksEnd
                
    return tail;
    
    function setTargetParticle() {
        var target = Pool.get();
        return target; 
    }
              
    function onParticleCreated(particle) {
        var position = particle.position,
        target = particle.target;
        if(target) {
            emitterpos.copy(args.position);
            particles.colors[target].setRGB(1, 1, 1); 
            particles.vertices[target] = position;
        }
    }
                
    function onParticleDead(particle) {
        var target = particle.target;
        if(target) {
            particles.vertices[target].set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY); 
            particles.colors[target].setRGB(0,0,0);   //background color
            Pool.add(target);
        }
    }
                
   function generateSprite(color) {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 32;
		canvas.height = 32;

		var context = canvas.getContext( '2d' );
		var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.2, 'rgba(' + Math.round(color.r * 255) + ',' + Math.round(color.g * 255) + ',' + Math.round(color.b * 255) + ',0.8)' );
		gradient.addColorStop( 0.4, 'rgba(' + Math.round(color.r * 255 / 2  - 100) + ',' + Math.round(color.g * 255 / 1.5 - 100) + ',' + Math.round(color.b * 255 / 1.5 - 100) + ',0.5)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,0)' );

		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );

		return canvas;

	}    
   
 };