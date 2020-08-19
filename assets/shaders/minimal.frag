
#include "common_fragment.h"

uniform sampler2D g_Texture0;

uniform vec2 g_PointerPosition;

varying vec2 v_TexCoord;

void main() {
	gl_FragColor = texSample2D(g_Texture0, v_TexCoord);
	//gl_FragColor = vec4(v_TexCoord, 0, 1);
}
