
uniform vec3 g_Color;
uniform float g_Alpha;

uniform sampler2D g_Texture0;

varying vec2 v_TexCoord;
varying float v_Smoothing;

void main() {
	float sample = texSample2D(g_Texture0, v_TexCoord).a;
	
	float smoothing = v_Smoothing;
	sample = smoothstep(0.5 - smoothing, 0.5 + smoothing, sample);
	
	gl_FragColor = vec4(g_Color, sample * g_Alpha);
}
