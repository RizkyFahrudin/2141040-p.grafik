var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

// Cek browser
if (!gl) {
  console.log("Browser tidak mendukung WebGL");
} else {
  console.log("Browser mendukung WebGL.");
}

const canvasWidth = 550;
const canvasHeight = 550;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

gl.viewport(0, 0, canvas.width, canvas.height);

// Warna canvas
gl.clearColor(1.0, 1.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Vertex shader source
var vertexShaderSource = `
        attribute vec2 a_position;
        uniform float u_rotationAngle;
        uniform vec2 u_translation;
        uniform float u_scale;
        void main() {
            float c = cos(u_rotationAngle);
            float s = sin(u_rotationAngle);
            mat2 rotationMatrix = mat2(c, -s, s, c);
            vec2 scaledPosition = a_position * u_scale;
            vec2 rotatedPosition = rotationMatrix * scaledPosition + u_translation;
            gl_Position = vec4(rotatedPosition, 0.0, 1.0);
        }
    `;

// Fragment shader source
var fragmentShaderSource = `
        precision mediump float;
        uniform vec4 u_color;
        void main() {
            gl_FragColor = u_color;
        }
    `;

// Buat vertex shader
var vShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vShader, vertexShaderSource);
gl.compileShader(vShader);

// Buat fragment shader
var fShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fShader, fragmentShaderSource);
gl.compileShader(fShader);

// Program shader
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vShader);
gl.attachShader(shaderProgram, fShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
var rotationLocation = gl.getUniformLocation(shaderProgram, "u_rotationAngle");
var translationLocation = gl.getUniformLocation(shaderProgram, "u_translation");
var scaleLocation = gl.getUniformLocation(shaderProgram, "u_scale");

var vertices = new Float32Array([0, 0.1, -0.1, -0.1, 0.1, -0.1]);

var vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

function randomColor() {
  return [Math.random(), Math.random(), Math.random(), 1.0];
}

function drawTriangle(rotationAngle, translation, scale, color) {
  gl.uniform1f(rotationLocation, rotationAngle);
  gl.uniform2fv(translationLocation, translation);
  gl.uniform1f(scaleLocation, scale);
  gl.uniform4fv(colorLocation, color);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

var solidColors = [
  [1.0, 0.5, 0.0, 1.0], // Biru solid
  [0.0, 0.0, 0.0, 1.0], // Hijau solid
];

var rotationAngle = 0;

function animateTriangles() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  var colors = [randomColor(), randomColor(), solidColors[0], solidColors[1]];
  var scale = 1.5; // Ubah ukuran segitiga di sini

  // Menggambar dua segitiga atas
  drawTriangle(rotationAngle, [-0.5, 0.5], scale, colors[0]);
  drawTriangle(rotationAngle, [0.5, 0.5], scale, colors[1]);

  // Menggambar satu segitiga tengah
  drawTriangle(rotationAngle, [0.0, 0.0], scale, colors[2]);

  // Menggambar satu segitiga bawah
  drawTriangle(rotationAngle, [0.0, -0.5], scale, colors[3]);

  rotationAngle += 0.01;
  requestAnimationFrame(animateTriangles);
}

animateTriangles();
