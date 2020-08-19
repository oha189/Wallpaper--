
uniform mat4 g_ModelViewProjectionMatrix;

attribute vec3 a_Position;
attribute vec4 a_Color;

varying vec3 v_Color;

void main() {
	gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);
#ifdef VERTEXCOLOR
	v_Color = a_Color.rgb;
#endif
}
