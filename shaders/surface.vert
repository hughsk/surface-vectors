uniform mat4 uTransform;
uniform float uOffset;

attribute vec3 aPosition;
attribute vec3 aSecondary;

precision mediump float;

void main() {
  gl_Position = uTransform * vec4(
    mix(aPosition, aSecondary, uOffset)
  , 1.0);
}
