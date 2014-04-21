# surface-vectors [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) <img src="http://i.imgur.com/hNfGYQ8.png" align="right"> #

Debug utility for drawing surface vectors in WebGL.

Useful for visualising normal/tangent/bitangent vectors across a mesh's surface.

## Usage ##

[![surface-vectors](https://nodei.co/npm/surface-vectors.png?mini=true)](https://nodei.co/npm/surface-vectors)

If you're looking for a complete usage example,
[check out the demo](http://hughsk.io/surface-vectors) and its
[source code](http://github.com/hughsk/surface-vectors/blob/master/demo.js).

### sv = surfaceVectors(gl, cells, positions, vectors) ###

Prepare a pair of positions and vectors for rendering.

* `gl` is the WebGL canvas context.
* `cells` should be a list of element/face indices for your model: either a
  packed `Float32Array`, or a nested 2D array. See the
  [bunny](http://github.com/mikolalysenko/bunny) module's data for an example
  of this.
* `positions` should a list of positions for your model: again, in either of
  the above formats.
* `vectors` same format as `positions` and `cells`, instead containing the
  vectors to render from each point at the same index in `positions`.

### sv.render(length, matrix, [color]) ###

Draws the vectors to the screen.

* `length` is the length at which to draw each vector.
* `matrix` the matrix to multiply each position by. Ordinarily, you'd want this
  to be Projection * View * Model, like you would normally do shader-side.
* `color` the color to use when drawing the vectors: a 3-element long array,
  and should contain RGB values from 0 to 1.

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/surface-vectors/blob/master/LICENSE.md) for details.
