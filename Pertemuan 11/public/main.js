var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

// Cek browser
if (!gl) { 
    console.log('Browser tidak mendukung WebGL'); 
} else { 
    console.log('Browser mendukung WebGL.'); 
}

const canvasWidth = 650;
const canvasHeight = 650;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

gl.viewport(0, 0, canvas.width, canvas.height);

// Warna canvas 
gl.clearColor(0.4343, 0.2422, 0.3343, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);

// Vertex shader source 
var vertexShaderSource = `
    attribute vec2 a_position;
    uniform float u_rotationAngle; // Menambahkan uniform untuk sudut rotasi
    
    void main() {
        // Membuat matriks rotasi
        float c = cos(u_rotationAngle);
        float s = sin(u_rotationAngle);
        mat2 rotationMatrix = mat2(c, -s, s, c);
        
        // Mengalikan posisi dengan matriks rotasi
        vec2 rotatedPosition = rotationMatrix * a_position;
        
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

// Variabel untuk menyimpan sudut rotasi dan kecepatan
var rotationAngle = 0;
var rotationSpeed = 0.05; // Kecepatan rotasi
var verticalPosition = -1.0; // Posisi vertikal awal

// Tetapkan warna tetap untuk baling-baling
var colorLocation = gl.getUniformLocation(shaderProgram, 'u_color');
gl.uniform4fv(colorLocation, [0.0, 0.5, 1.0, 1.0]); // Warna biru (R, G, B, A)

function drawBlades(rotationAngle, centerX, centerY) {
    // Jumlah bilah baling-baling
    var numBlades = 4;
    var angleIncrement = (2 * Math.PI) / numBlades;

    for (var i = 0; i < numBlades; i++) {
        var angle = rotationAngle + i * angleIncrement;

        // Titik pusat baling-baling 
        var center = [centerX, centerY]; // Mengatur pusat objek secara horizontal

        // Titik-titik untuk segitiga
        var p1 = [Math.cos(angle) * 0.1 + center[0], Math.sin(angle) * 0.1 + center[1]];
        var p2 = [Math.cos(angle + angleIncrement) * 0.3 + center[0], Math.sin(angle + angleIncrement) * 0.3 + center[1]];
        var p3 = [center[0], center[1]];

        // Menggabungkan titik-titik untuk membentuk segitiga
        var vertices = [center[0], center[1], p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]];

        // Buffer segitiga
        var vBuffer = gl.createBuffer(); 
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Location
        var positionLocation = gl.getAttribLocation(shaderProgram, 'a_position'); 
        gl.enableVertexAttribArray(positionLocation);

        // Gambar segitiga.
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0); 
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Menggunakan TRIANGLE_STRIP untuk menggambar segitiga
    }
}

function updatePosition() { 
    rotationAngle += rotationSpeed; // Gunakan kecepatan rotasi
    verticalPosition += 0.01; // Atur kecepatan naik di sini
    
    if (verticalPosition > 1.0) { // Reset ke bawah saat mencapai puncak
        verticalPosition = -1.0;
    }
}

function animateBlades() { 
    gl.clear(gl.COLOR_BUFFER_BIT);
    updatePosition();
    
    // Menggambar baling-baling tunggal
    drawBlades(rotationAngle, 0.0, verticalPosition); 
    
    requestAnimationFrame(animateBlades);
}

animateBlades();
