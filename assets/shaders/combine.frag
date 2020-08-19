
varying vec2 v_TexCoord;

uniform sampler2D g_Texture0;
uniform sampler2D g_Texture1;

void main() {
	vec3 albedo = texSample2D(g_Texture0, v_TexCoord).rgb;

	//albedo += texSample2D(g_Texture1, v_TexCoord).rgb;
	
	vec3 bloom = texSample2D(g_Texture1, v_TexCoord).rgb;
	//float desat = dot(bloom, vec3(0.299, 0.587, 0.114));
	//albedo += mix(CAST3(desat), bloom, min(length(bloom - albedo) * 0.707, 1.0));
	//albedo += mix(bloom, CAST3(desat), saturate(CAST3(distance(bloom, albedo))));
	
	//albedo = bloom;
	//albedo += 2.0 * bloom * saturate(1.0 - dot(bloom, albedo));
	albedo += bloom;
	
	gl_FragColor = vec4(albedo, 1.0);
}
