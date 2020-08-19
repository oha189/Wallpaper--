
uniform mat4 g_ModelMatrix;
uniform mat4 g_ModelViewProjectionMatrix;

attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;
varying float v_Smoothing;

void main() {

	// Remove smoothing factor from z translate
	mat4 mvp = g_ModelViewProjectionMatrix;
	mvp[3][2] = 0.0;
	gl_Position = mul(vec4(a_Position, 1.0), mvp);
	
	v_TexCoord = a_TexCoord;
	v_Smoothing = abs(g_ModelMatrix[3][2]);
}
