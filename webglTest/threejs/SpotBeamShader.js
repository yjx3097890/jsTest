/**
 * @author yanjixian
 *
 * spotLight beam
 */

THREE.SpotBeamShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"lightPosition":  { type: "v3", value: new THREE.Vector3(0.0, 0.0, 0.0) },
		"direction":  { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
		"intensity": { type: "f", value: 1.0 },
		"lightColor": { type: "c", value: new THREE.Color( 0xffffff ) },
		"attenuation": { type: "f", value: 0.0 },
		"angle": { type: "f", value: Math.PI/3 }

	},

	vertexShader: [

		"uniform vec3 lightPosition;",

		"varying vec2 vUv;",
		"varying vec3 vlPosition;",

		"void main() {",

			"vUv = uv;",
			"vlPosition = modelViewMatrix * vlPosition;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform vec3 direction;",
		"uniform float intensity;",
		"uniform vec3 lightColor;",
		"uniform float attenuation;",
		"uniform float angle;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",
		"varying vec3 vlPosition;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			
			"gl_FragColor = texel;",

		"}"

	].join("\n")

};
