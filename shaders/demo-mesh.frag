precision mediump float;

varying vec3 vnormal;

void main() {
  gl_FragColor = vec4(vec3(
    dot(vnormal, vec3(0.0, 1.0, 0.0))
  ) * 0.5 + vec3(0.1), 1.0);
}
