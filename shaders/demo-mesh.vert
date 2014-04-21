precision mediump float;

attribute vec3 position;
attribute vec3 normal;
varying vec3 vnormal;
uniform mat4 matrix;

void main() {
  vnormal = normal;
  gl_Position = matrix * vec4(position, 1.0);
}
