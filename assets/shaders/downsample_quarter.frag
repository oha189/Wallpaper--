
varying vec2 v_TexCoord[4];

uniform sampler2D g_Texture0;

void main() {
	vec3 albedo = texSample2D(g_Texture0, v_TexCoord[0]).rgb +
					texSample2D(g_Texture0, v_TexCoord[1]).rgb +
					texSample2D(g_Texture0, v_TexCoord[2]).rgb +
					texSample2D(g_Texture0, v_TexCoord[3]).rgb;
	albedo *= 0.25;
	//albedo = texSample2D(g_Texture0, v_TexCoord[0]).rgb;
	
	//albedo = max(vec3(0.0, 0.0, 0.0), albedo - 0.5) * 3.0;
	//albedo *= 0.1;
	
	//albedo = pow(albedo, CAST3(2.5));
	//albedo *= pow(dot(albedo, albedo), CAST3(5));
	
	albedo *= pow(max(max(albedo.x, albedo.y), albedo.z), 10.0) * 2;
	
	// http://stackoverflow.com/a/34183839
	float grayscale = dot(vec3(0.2989, 0.5870, 0.1140), albedo);
	float sat = 1;
	albedo = -grayscale * sat + albedo * (1+sat);
	saturate(albedo);
	
	//albedo *= pow(dot(albedo, vec3(0.299, 0.587, 0.114)), CAST3(5)) * 20;
	
	gl_FragColor = vec4(albedo, 1.0);
}
