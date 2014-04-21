var createShader = require('./shader')
var createBuffer = require('gl-buffer')
var pack = require('array-pack-2d')
var createVAO = require('gl-vao')

module.exports = SurfaceVectors

function SurfaceVectors(gl, cells, positions, vectors) {
  if (!(this instanceof SurfaceVectors)) {
    return new SurfaceVectors(gl, cells, positions, vectors)
  }

  this.shader = createShader(gl)
  this.gl = gl

  var converted = convert(cells, positions, vectors)
  var index = createBuffer(gl
    , pack(converted.cells, 'uint16')
    , gl.ELEMENT_ARRAY_BUFFER
  )

  this.vao = createVAO(gl, [{
      type: gl.FLOAT
    , size: 3
    , buffer: createBuffer(gl, pack(converted.positions))
  }, {
      type: gl.FLOAT
    , size: 3
    , buffer: createBuffer(gl, pack(converted.combined))
  }], index)

  this.length = converted.cells.length * 3
}

var black = new Float32Array(3)

SurfaceVectors.prototype.render = function(offset, matrix, color) {
  this.vao.bind()
  this.shader.bind()
  this.shader.uniforms.uTransform = matrix
  this.shader.uniforms.uOffset = offset
  this.shader.uniforms.uColor = color || black
  this.shader.attributes.aPosition.location = 0
  this.shader.attributes.aSecondary.location = 1
  this.vao.draw(this.gl.LINES, this.length)
  this.vao.unbind()
}

function convert(cells, positions, vectors) {
  var converted = {}
  var combined = converted.combined = []
  var original = converted.positions = []
  var newcells = converted.cells = []

  for (var i = 0; i < cells.length; i++) {
    newcells.push([
        cells[i][0] * 2
      , cells[i][0] * 2
      , cells[i][0] * 2
    ], [
        cells[i][0] * 2 + 1
      , cells[i][1] * 2 + 1
      , cells[i][1] * 2 + 1
    ])
  }

  for (var i = 0; i < positions.length; i++) {
    original.push(positions[i], positions[i])
    combined.push(positions[i], [
        positions[i][0] + vectors[i][0]
      , positions[i][1] + vectors[i][1]
      , positions[i][2] + vectors[i][2]
    ])
  }

  return converted
}
