
#include "common_vertex.h"

uniform mat4 g_ModelViewProjectionMatrix;
uniform vec3 g_LightAmbientColor;

attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;

void main() {
	//gl_Position = mul(vec4(a_Position, 1.0 + g_LightAmbientColor.x * 0.00001), g_ModelViewProjectionMatrix);
	gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);
	v_TexCoord = a_TexCoord;
}
