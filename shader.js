var glslify = require('glslify')

module.exports = glslify({
    vertex: './shaders/surface.vert'
  , fragment: './shaders/surface.frag'
})
