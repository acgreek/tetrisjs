document.getElementById("myCanvas").style.background = 'black';
var ScoreElement = document.getElementById("Score");

var gameSize = { x: 9, y: 9* 2}; 
var boardMatrix = new Array();

for (var i =0; i < gameSize.y; i ++ ) {
	boardMatrix[i] = new Array();
	for (var j =0; j < gameSize.x; j ++ ) {
		boardMatrix[i][j] = null;
	}
} 

var path = new Path();
var blockWidth = 18; 
var gameBoard = new Path.Rectangle(10,1, blockWidth*gameSize.x,blockWidth*gameSize.y);
gameBoard.fillColor = 'white';
var blist = new Array();

function Piece () {
	this.bstart=0;
	this.bend=4;
  this.blist = new Array();
}
Piece.prototype.getCenter = function (){
	return 2;
}

function Block(x,y) {
	this.x = x;
	this.y = y;
	this.obj = new Path.Rectangle(10+ x*blockWidth,1+ y*blockWidth,blockWidth,blockWidth);
	this.obj.fillColor = 'red';
} 
Block.prototype.moveLeft = function (){
	this.x--;
	this.obj.position.x-=blockWidth;
} 
Block.prototype.moveRight = function (){
	this.x++;
	this.obj.position.x+=blockWidth;
} 
Block.prototype.moveDown= function (){
	this.y++;
	this.obj.position.y+=blockWidth;
} 
Block.prototype.moveUp= function (){
	this.y--;
	this.obj.position.y-=blockWidth;
} 
Block.prototype.moveTo= function (x, y){
	var diff = this.x - x;
	if (diff > 0) 
		while (diff)  {
			this.moveLeft();
			diff--;
		}
	else 
		while (diff != 0)  {
			this.moveRight();
			diff++;
		}
	diff = this.y - y;
	if (diff > 0) 
		while (diff)  {
			this.moveUp();
			diff--;
		}
	else 
		while (diff != 0)  {
			this.moveDown();
			diff++;
		}
} 

function findIf(list, func) {
	for (var i = 0; i < list.length; i++) {
		if (true ==func(list[i])) 
			return list[i];
	}
	return null;
}
function foreach(list, func) {
	for (var i = 0; i < list.length; i++) {
		func(list[i]) ;
	}
}
function Mod (b, dx, dy) {
	this.blockp = b;
	this.nx = dx;
	this.ny = dy;
}


function canmove(ix, iy, dx, dy, mod) {
	if (dy < 0 || dy > gameSize.y-1) 
		return false;
	var findBlock = function (b) { 
		return b.x == ix && b.y == iy; 
	};
	var piece = findIf(blist,findBlock );
	if (null ==piece)  
		return true;
	if (boardMatrix[dy][dx] == null) {
		mod.push(new Mod(piece, dx, dy));
		return true;
	}
	return false;
} 

function isLog(piece) {
	var x= blist[0].x;
	var y= blist[0].y;
	var hlog= true;
	var vlog= true;
	foreach(blist, function (b) { if (b.x != x) vlog =false;if (b.y != y) hlog =false });
	return hlog || vlog
}
Piece.prototype.rotateLogClockwise = function() {
	var b =blist[0];
	if (blist[0].y == blist[1].y) { 
		if (b.y > 0 && null != boardMatrix[b.y-1][b.x+1]){
			return;
		}
		if (b.y + 2 > gameSize.y || null != boardMatrix[b.y+1][b.x+1]) {
			return;
		}
		if (null != boardMatrix[b.y+2][b.x+1]) {
			return;
		}
		blist[0].moveRight();
		blist[0].moveUp();
		blist[2].moveLeft();
		blist[2].moveDown();
		blist[3].moveLeft();
		blist[3].moveLeft();
		blist[3].moveDown();
		blist[3].moveDown();
	}
	else  {
		if (b.x == 0 || null != boardMatrix[b.y+1][b.x-1]) {
			return;
		}
		if (b.x+2 > gameSize.y || null != boardMatrix[b.y+1][b.x+1]) {
			return;
		}
		if (null != boardMatrix[b.x+2][b.y+1]) {
			return;
		}
		blist[0].moveLeft();
		blist[0].moveDown();
		blist[2].moveRight() ;
		blist[2].moveUp();
		blist[3].moveRight();
		blist[3].moveRight();
		blist[3].moveUp();
		blist[3].moveUp();
	}

}
Piece.prototype.rotateClockwise = function() {
	if (isLog(this)) {
		this.rotateLogClockwise();
		return;
	}
	var cx = blist[this.getCenter()].x;
	var cy = blist[this.getCenter()].y;
	var modifications = new Array(); 
	if (canmove(cx-1,cy-1,cx+1,cy-1,modifications) &&
			canmove(cx,cy-1,cx+1,cy,modifications) &&
			canmove(cx+1,cy-1,cx+1,cy+1,modifications) &&
			canmove(cx+1,cy,cx,cy+1,modifications) &&
			canmove(cx+1,cy+1,cx-1,cy+1,modifications) &&
			canmove(cx,cy+1,cx-1,cy,modifications) &&
			canmove(cx-1,cy+1,cx-1,cy-1,modifications) &&
			canmove(cx-1,cy,cx,cy-1,modifications)) {
		foreach(modifications,function (m) {m.blockp.moveTo(m.nx, m.ny); });
	}

} 

function addBlock(x,y) {
	blist.push(new Block(x, y));
}

var curPiece = new Piece();

var pieces = new Array();

function buildSquarePiece() {
	blist = new Array();
	addBlock(0,0);
	addBlock(1,0);
	addBlock(0,1);
	addBlock(1,1);
	return curPiece;
}
pieces.push(buildSquarePiece);

function buildLogPiece() {
	blist = new Array();
	addBlock(0,0);
	addBlock(1,0);
	addBlock(2,0);
	addBlock(3,0);
	return curPiece;
}
pieces.push(buildLogPiece);
function buildLZPiece() {
	blist = new Array();
	addBlock(0,1);
	addBlock(1,1);
	addBlock(1,0);
	addBlock(2,0);
	return curPiece;
}
pieces.push(buildLZPiece);
function buildLEPiece() {
	blist = new Array();
	addBlock(0,0);
	addBlock(0,1);
	addBlock(1,1);
	addBlock(2,1);
	return curPiece;
}
pieces.push(buildLEPiece);
function buildELPiece() {
	blist = new Array();
	addBlock(0,1);
	addBlock(0,0);
	addBlock(1,0);
	addBlock(2,0);
	return curPiece;
}
pieces.push(buildELPiece);
function buildPyramidPiece() {
	blist = new Array();
	addBlock(0,1);
	addBlock(1,0);
	addBlock(1,1);
	addBlock(2,1);
	return curPiece;
}
pieces.push(buildPyramidPiece);

function buildPyramidPiece() {
	blist = new Array();
	addBlock(0,1);
	addBlock(1,0);
	addBlock(1,1);
	addBlock(2,1);
	return curPiece;
}
function buildZPiece() {
	blist = new Array();
	addBlock(0,0);
	addBlock(1,0);
	addBlock(1,1);
	addBlock(2,1);
	return curPiece;
}
pieces.push(buildZPiece);

var pieceIdx=0;
function selectPiece() {
	pieceIdx+=1;
	return  pieces[pieceIdx %pieces.length]();
}

var leftIdx= 0 ;
var rightIdx= gameSize.x-1 ;

function canMoveHorizontally(curPiece, idx) {
	var mod = 1;
	if (idx == leftIdx)
		mod =-1;
	for (var i = curPiece.bstart; i < curPiece.bend; i++) {
		if (idx== blist[i].x || null != boardMatrix[blist[i].y][blist[i].x+mod]) {
			return false;
		}
	}
	return true;
}

function canMoveLeft(curPiece) {
	return canMoveHorizontally(curPiece, leftIdx);
}
function canMoveRight(curPiece) {
	return canMoveHorizontally(curPiece, rightIdx);
}

function canMoveDown(curPiece) {
	for (var i = curPiece.bstart; i < curPiece.bend; i++) {
		if (gameSize.y-1==  blist[i].y || null != boardMatrix[blist[i].y+1][blist[i].x]) {
			return false;
		}
	}
	return true;
}
function movePieceHorrizontal(curPiece, q) {
	for (var i = curPiece.bstart; i < curPiece.bend; i++) {
		q >0  ? blist[i].moveRight() : blist[i].moveLeft();
	}
}
function movePieceDown(curPiece) {
	for (var i = curPiece.bstart; i < curPiece.bend; i++) {
		blist[i].moveDown();
	}
}
var curPiece = buildSquarePiece(blist);

function markBoard(curPiece){
	for (var i = curPiece.bstart; i < curPiece.bend; i++) {
		boardMatrix[blist[i].y][blist[i].x] =blist[i];
		blist[i].obj.fillColor.hue +=15;
	}
}

function clearCurrentRow(y) {
	for (var x= 0; x < gameSize.x; x++) {
		if (null !=boardMatrix[y][x]) {   
			boardMatrix[y][x].obj.remove(); 
		}
	} 
}

function movePiecesDown(y) {
	if (y == 0) {
		clearCurrentRow(y);
		return ;
	}
	for (var x= 0; x < gameSize.x; x++) {
		boardMatrix[y][x] =boardMatrix[y-1][x];
		if (null != boardMatrix[y][x]) 
			boardMatrix[y][x].moveDown();
		boardMatrix[y-1][x] = null;
	} 
	movePiecesDown(y-1);
} 

function isRowComplete(y) {
	for (var x= 0; x < gameSize.x; x++) {
		if (null == boardMatrix[y][x] ) 
			return false;
	} 
	return true;
}
function checkForCompleteRow(y) {
	if (y < 0)
		return 0;
	if (isRowComplete(y)) {
		clearCurrentRow(y);
		movePiecesDown(y);
		return 10 + checkForCompleteRow(y);
	}
	return checkForCompleteRow(y-1);
} 
var score = 0;
ScoreElement.value = score;

var date = new Date();
var lastTime = date.getTime();
var readKeyTimeout =  0;

function onFrame(event) {
	date = new Date();
	var now = date.getTime();

	if (Key.isDown('d')) {
		if (canMoveRight(curPiece) && (now- readKeyTimeout) > 150) { 
			movePieceHorrizontal(curPiece, blockWidth);
			readKeyTimeout = now;
		}
	}
	if (Key.isDown('a')) {
		if (canMoveLeft(curPiece) && (now- readKeyTimeout) > 150) {
			movePieceHorrizontal(curPiece, -blockWidth);
			readKeyTimeout = now;
		} 
	}
	if (Key.isDown('c')) {
		if ((now- readKeyTimeout) > 150) {
			curPiece.rotateClockwise();
			readKeyTimeout = now;
		} 
	}
	if (Key.isDown('s')) {
		if (canMoveDown(curPiece) && (now- readKeyTimeout) > 150) {
			movePieceDown(curPiece);
			readKeyTimeout = now;
		} 
	}
	if ((now - lastTime) > 1000) {
		if (!canMoveDown(curPiece)) { 
			markBoard(curPiece);
			score += checkForCompleteRow(gameSize.y-1) ;
			ScoreElement.value = score;
			curPiece = selectPiece();
		}
		else { 
			movePieceDown(curPiece);
		}
		lastTime = now;
	}
}
