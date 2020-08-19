
#include "common_vertex.h"

uniform float g_Time;
uniform vec2 g_TexelSize;
uniform float g_CutOutSkew; // {"material":"Cut skew", "default":-0.3, "range":[-1, 1]}

attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec3 v_TexCoord;
varying vec3 v_OceanCloudSpeed;
varying vec2 v_TexelUVRatio;
varying vec4 v_CausticCenterCoords;
varying vec2 v_BaseCenterCoords;
varying vec2 v_CutUV;


void main() {
	//gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);
	
	gl_Position = vec4(a_Position, 1.0);
	v_TexCoord.xy = a_TexCoord;
	v_TexCoord.z = v_TexCoord.x + g_Time * 0.04;
	
	v_OceanCloudSpeed.x = g_Time * 0.12;
	v_OceanCloudSpeed.y = g_Time * 0.004;
	v_OceanCloudSpeed.z = g_Time * 0.1;
	v_TexelUVRatio = vec2(g_TexelSize.y / g_TexelSize.x, 1);
	
	v_CausticCenterCoords = vec4(CAST2(0.5) * v_TexelUVRatio + CAST2(v_OceanCloudSpeed.x * 0.05),
						CAST2(0.5 * 0.7) * v_TexelUVRatio + vec2(v_OceanCloudSpeed.x, -v_OceanCloudSpeed.x) * 0.02333);
	v_BaseCenterCoords = CAST2(0.5 * 2.3333) * v_TexelUVRatio;
	
	v_CutUV = vec2(0.5 + dot(vec2(v_TexCoord.y, -0.5), CAST2(g_CutOutSkew)), 0.5) - v_TexCoord.xy;
}
