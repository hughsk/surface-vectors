var createCamera = require('game-shell-orbit-camera')
var pack         = require('array-pack-2d')
var findBasis    = require('find-basis-3d')
var createBuffer = require('gl-buffer')
var glslify      = require('glslify')
var normals      = require('normals')
var createShell  = require('gl-now')
var createVAO    = require('gl-vao')
var bunny        = require('bunny')
var surfaceVecs  = require('./')

var mat4 = require('gl-matrix').mat4

var shader
var camera
var shell
var mesh
var gl

ready()

function ready() {
  shell = createShell({
    clearColor: [0, 0, 0, 1]
  })

  shell.on('gl-init', init)
  shell.on('gl-render', render)

  camera = createCamera(shell)
  camera.distance = 20
  camera.pan([0, 0.2])
}

function init() {
  gl = shell.gl

  bunny.tangents = []
  bunny.bitangents = []
  bunny.normals = normals.vertexNormals(
      bunny.cells
    , bunny.positions
  )

  // generate bitangent/tangent vectors using
  // find-basis-3d. These are two vectors for each
  // normal that form right angles with the normal,
  // and important when implementing bump/normal mapping.
  // see also: http://goo.gl/m0BM8u
  for (var i = 0; i < bunny.normals.length; i++) {
    var vectors = findBasis(bunny.normals[i])

    bunny.tangents.push(vectors[0])
    bunny.bitangents.push(vectors[1])
  }

  // The important part: creating the surface-vector instances.
  // Note that a separate instance is being used for each vector
  // type.
  normalVecs = surfaceVecs(gl, bunny.cells, bunny.positions, bunny.normals)
  tangentVecs = surfaceVecs(gl, bunny.cells, bunny.positions, bunny.tangents)
  bitangentVecs = surfaceVecs(gl, bunny.cells, bunny.positions, bunny.bitangents)

  // A base mesh so that we have some context for
  // these floating vectors.
  mesh = createVAO(gl, [{
      size: 3
    , buffer: createBuffer(gl, pack(bunny.positions))
  }, {
      size: 3
    , buffer: createBuffer(gl, pack(bunny.normals))
  }], createBuffer(gl
    , pack(bunny.cells, 'uint16')
    , gl.ELEMENT_ARRAY_BUFFER
  ))

  mesh.length = bunny.cells.length * 3

  shader = glslify({
      vertex: './shaders/demo-mesh.vert'
    , fragment: './shaders/demo-mesh.frag'
  })(shell.gl)
}

var projection = new Float32Array(16)
var model      = new Float32Array(16)
var view       = new Float32Array(16)
var pmv        = new Float32Array(16)

function render() {
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  camera.view(view)
  mat4.identity(model)
  mat4.perspective(projection
    , Math.PI / 4
    , shell.width / shell.height
    , 0.001
    , 1000
  )

  // pre-multiply all the matrices to
  // be passed into the surface-vectors
  // shader when rendering. i.e.:
  // Projection * View * Model = PMV
  mat4.mul(pmv, projection, view)
  mat4.mul(pmv, pmv, model)

  // optional: adjust the line width before drawing
  gl.lineWidth(1)

  // Draw the surface vectors
  normalVecs.render(0.1, pmv, [0.8, 0.2, 0.2])
  tangentVecs.render(0.1, pmv, [0.2, 0.8, 0.2])
  bitangentVecs.render(0.1, pmv, [0.2, 0.2, 0.8])

  shader.bind()
  shader.attributes.position.location = 0
  shader.attributes.normal.location = 1
  shader.uniforms.matrix = pmv

  mesh.bind()
  mesh.draw(gl.TRIANGLES, mesh.length)
  mesh.unbind()
}
