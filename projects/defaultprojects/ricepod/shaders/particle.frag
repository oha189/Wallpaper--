
uniform sampler2D g_Texture0;

varying vec2 v_TexCoord;
varying vec4 v_Color;

void main() {
	gl_FragColor = v_Color * texSample2D(g_Texture0, v_TexCoord);
}