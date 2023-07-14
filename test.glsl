precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution * 2.0 - 1.;
  st.x *= u_resolution.x / u_resolution.y;

  float pct = 0.0;
  pct = 1. - length(st);
  
  float radius = .5;

  vec3 color = vec3(0);
  float angle = atan(st.y, st.x);
  float desiredAngle = mod((3.14159 * 2. * u_time), 3.14159 * 2.) - 3.14159;
  if (angle < desiredAngle && angle > desiredAngle - 0.005) {
  float circle = smoothstep(radius - 0.005, radius, pct);
    color = vec3(circle);
  }
  
  gl_FragColor = vec4(color, 1.0);
}