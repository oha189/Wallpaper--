
#include "common_fragment.h"

uniform float g_Time;

uniform sampler2D g_Texture0;
uniform sampler2D g_Texture1;
uniform sampler2D g_Texture2;
uniform sampler2D g_Texture3;


uniform vec3 g_ColorOcean; // {"material":"Ocean", "type": "color", "default":"0 0 1"}
uniform vec3 g_ColorOcean2; // {"material":"Ocean2", "type": "color", "default":"0 0 0.5"}
uniform float g_ShoreAmount; // {"material":"Shore", "default":0.5}
uniform vec3 g_ColorSky; // {"material":"Sky", "type": "color", "default":"0.7 0.7 0.7"}
uniform vec3 g_ColorSky2; // {"material":"Sky2", "type": "color", "default":"0.85 0.9 1"}
uniform vec3 g_Clouds; // {"material":"Clouds", "type": "color", "default":"1 1 1"}
uniform vec3 g_CutOutColor; // {"material":"Cut out", "type": "color", "default":"1 1 1"}
uniform float g_CutOutAlpha; // {"material":"Cut alpha", "default":0.7}
uniform float g_WaveAmp; // {"material":"Wave", "default":0.2, "range":[0.0,0.5]}
uniform float g_OceanBend; // {"material":"Bend", "default":0.2, "range":[-0.5,0.5]}


varying vec3 v_TexCoord;
varying vec3 v_OceanCloudSpeed;
varying vec2 v_TexelUVRatio;
varying vec4 v_CausticCenterCoords;
varying vec2 v_BaseCenterCoords;
varying vec2 v_CutUV;


void main() {

	vec4 sines = sin(vec4(v_TexCoord.x * 3.141,
						v_TexCoord.x * 2 + v_OceanCloudSpeed.x,
						v_TexCoord.x * 5 + v_OceanCloudSpeed.x,
						v_TexCoord.x * 10 + v_OceanCloudSpeed.z));
	
	// Skew and offset ocean
	vec2 planeUV = v_TexCoord.xy * v_TexelUVRatio;
	planeUV.y = planeUV.y * 1.3 - 0.5;
	planeUV.y -= sines.x * g_OceanBend;
	vec2 cloudsPlaneUV = planeUV;
	planeUV.y *= 1.0 + sines.y * 0.15;
	planeUV.y += sines.z * 0.02;
	
	// Cloud UVs
	cloudsPlaneUV.x += v_OceanCloudSpeed.y;
	cloudsPlaneUV.x *= 0.7;
	
	float perspectiveScale = 3.0 - pow(planeUV.y, 0.2) * 2.9;
	float waveAmp = texSample2D(g_Texture3, v_TexCoord.z + planeUV.xy * vec2(perspectiveScale, 3)).a * planeUV.y * g_WaveAmp;
	planeUV.y += waveAmp;
	

	
	// Scale caustics by distance
	vec4 causticsUVs = vec4(planeUV.yx + CAST2(v_OceanCloudSpeed.x * 0.05),
						planeUV.yx * 0.7 + vec2(v_OceanCloudSpeed.x, -v_OceanCloudSpeed.x) * 0.02333);
	//vec4 causticsCenter = vec4(CAST2(0.5) * v_TexelUVRatio + CAST2(v_OceanCloudSpeed.x) * 0.05,
	//					CAST2(0.5) * v_TexelUVRatio * 0.7 + vec2(v_OceanCloudSpeed.x, -v_OceanCloudSpeed.x) * 0.02333);
	vec4 causticsDelta = causticsUVs - v_CausticCenterCoords;
	causticsUVs = v_CausticCenterCoords + causticsDelta * perspectiveScale;
	
	
	// Scale caustics noise by distance
	vec2 baseUVs = planeUV.xy * 2.3333;
	//vec2 baseCenter = CAST2(0.5) * v_TexelUVRatio * 2.3333;
	vec2 baseDelta = baseUVs - v_BaseCenterCoords;
	baseUVs = v_BaseCenterCoords + baseDelta * perspectiveScale;


	// Sample caustics noise and caustics
	float wave = texSample2D(g_Texture0, baseUVs).a;
	causticsUVs += wave * 0.2 - 0.1;
	float caustics = texSample2D(g_Texture1, causticsUVs.xy).a;
	float caustics2 = texSample2D(g_Texture1, causticsUVs.zw).a;
	
	wave = smoothstep(0.9, 0.87, caustics);
	wave += smoothstep(1.0, 0.8, caustics2) * 0.4;
	
	// Fade towards top
	wave *= smoothstep(0.0, 0.2, planeUV.y);
	wave *= saturate(1.0 - waveAmp * 5.0);
	
	
	// Sample clouds
	vec4 cloudsSample = texSample2D(g_Texture2, cloudsPlaneUV + vec2(0.0, floor(cloudsPlaneUV.x) * 0.5));
	float cloudAnim = sines.w * 0.25;
	float clouds = smoothstep(0.3 + cloudAnim, 0.5 + cloudAnim, cloudsSample.a);
	vec3 cloudColor = mix(g_Clouds, g_ColorSky2, 0.3 * smoothstep(0.2, 0.6, dot(cloudsSample.xyz * 2 - 1, vec3(v_TexCoord.x * 2 - 1, 0.5, 0.0))));
	clouds *= abs(cloudsPlaneUV.y * 5);
	float cloudAlpha = saturate(clouds);
	
	// Mix ocean and clouds
	vec3 oceanColor = mix(g_ColorOcean, g_ColorOcean2, planeUV.y * 1.5);
	vec3 skyColor = mix(g_ColorSky, g_ColorSky2, -cloudsPlaneUV.y);
	vec3 albedo = mix(oceanColor + CAST3(wave * g_ShoreAmount) + pow(abs(waveAmp), 2.5),
				mix(skyColor, cloudColor, cloudAlpha), smoothstep(0.005, 0, planeUV.y));


	// Cut out
	float cutAmount = dot(v_CutUV, v_CutUV);
	cutAmount = smoothstep(0.299, 0.3, cutAmount) * g_CutOutAlpha;
	albedo = mix(albedo, g_CutOutColor, cutAmount);
	
	gl_FragColor = vec4(albedo, 1);
}
