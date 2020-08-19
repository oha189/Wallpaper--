
attribute vec3 a_Position;
attribute vec3 a_TexCoordVec4;
attribute vec4 a_Color;

uniform mat4 g_ModelViewProjectionMatrix;
uniform vec3 g_ViewUp;
uniform vec3 g_ViewRight;

varying vec2 v_TexCoord;
varying vec4 v_Color;

void main() {
	vec3 position = a_Position +
		(a_TexCoordVec4.z * g_ViewRight * (a_TexCoordVec4.x-0.5) +
		a_TexCoordVec4.z * g_ViewUp * (a_TexCoordVec4.y-0.5)) * 0.5;
		
	gl_Position = mul(vec4(position, 1.0), g_ModelViewProjectionMatrix);
	
	v_TexCoord = a_TexCoordVec4.xy;
	v_Color = a_Color;
}
