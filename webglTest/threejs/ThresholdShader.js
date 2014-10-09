/**
 * @author @oosmoxiecode
 *
 */

THREE.ThresholdShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"texture": { type: "t", value: null },
		"threshold":{ type: "f", value: 0.7 },
		"color":    { type: "v3", value: new THREE.Vector3( 0.2, 0.8, 0.8 ) },
		"globalTime":{ type: "f", value: 0.0 },
		"size":    { type: "v2", value: new THREE.Vector2( window.innerWidth/2, window.innerHeight/2 ) },

	},

	vertexShader: [

		"uniform float globalTime;",

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D texture;",
		"uniform float threshold;",
		"uniform vec3 color;",
		"uniform vec2 size;",

		"varying vec2 vUv;",


		"vec2 texel = vec2(1.0 / size.x, 1.0 / size.y);",

		"mat3 G[2];",

		"const mat3 g0 = mat3( 1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0 );",
		"const mat3 g1 = mat3( 1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0 );",


		"void main() {",

			"vec4 sample = texture2D(tDiffuse, vUv.xy);",

			"if (sample.r < threshold) {",
				"discard;",
			"}",

			"vec4 sample2 = texture2D(texture, vUv.xy*8.0);",

			"vec2 lightPosition = vec2(0.25, 0.25);",
			"vec3 light0Color = vec3(1.0,1.0,1.0);",

			"vec2 lVector = lightPosition.xy - vUv.xy;",
			"float lightDistance = 0.4;",

			"float lDistance = 1.0;",
			"lDistance = 1.0 - min( ( length( lVector ) / lightDistance ), 1.0 );",

			"light0Color += vec3(2.0,2.0,2.0) * lDistance;",

			// THREE's edge detection
			"mat3 I = mat3( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 );",
			"float cnv[2];",
			"vec3 sample3;",

			"G[0] = g0;",
			"G[1] = g1;",

			/* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
			"for (float i=0.0; i<3.0; i++)",
			"for (float j=0.0; j<3.0; j++) {",
				"sample3 = texture2D( tDiffuse, vUv + texel * vec2(i-1.0,j-1.0) ).rgb;",
				
				"if (sample3.r < threshold) {",
					"sample3 = vec3(0.0, 0.0, 0.0);",
				"}",

				"I[int(i)][int(j)] = length(sample3);",
			"}",

			/* calculate the convolution values for all the masks */
			"for (int i=0; i<2; i++) {",
				"float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);",
				"cnv[i] = dp3 * dp3; ",
			"}",

			"vec3 extra = vec3(1.0, 1.0, 1.0);",
			"if (sample.g > 0.01) {",
				"extra += sample.g*0.5;",
			"}",

			"vec4 edgeColor = vec4( vec3(1.0, 0.5, 1.0)*(vUv.y*1.5), 0.5 * sqrt(cnv[0]*cnv[0]+cnv[1]*cnv[1]));",

			"if (edgeColor.a > 0.5) {",
				"gl_FragColor = vec4(1.0, 1.0, 1.0, 0.7)*(vUv.y*3.5);",
			"} else {",
				"gl_FragColor = vec4(color*sample2.rgb*(vUv.y*1.5)*light0Color*extra, 0.75);",
			"}",

		"}"

	].join("\n")

};
