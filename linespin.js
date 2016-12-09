// Create a Paper.js Path to draw a line into it:
var path = new Path();
// Give the stroke a color
path.strokeColor = 'red';
var x = 300;
var y = 100;
var start = new Point(x, y);
// Move to start and draw a line from there
path.moveTo(start);
// Note the plus operator on Point objects.
// PaperScript does that for us, and much more!
path.lineTo(start + [ 100, -50 ]);
var rotationRate = 3;

function rotateLine() {
	//    Each framesetcols, rotate the path by 3 degrees:
	path.rotate(rotationRate);
	//    path.fillColor.hue += 1;
}
function onFrame(event) {
	rotateLine();

	document.getElementById('xCord').value = x;
	document.getElementById('yCord').value = y;

	if (Key.isDown('q')) {
		x =  x-1;
	}
	if (Key.isDown('w')) {
		x =  x+1;
	}
	start = new Point(x, y);
	path.position = start;
}
