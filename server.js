var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var shortid = require('shortid');
var googl = require('goo.gl');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', __dirname + '/views');

var rooms = [];

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/viewer', function (req, res){
	//var room = shortid.generate();
	var room = "drake";
	rooms.push(room);
	res.render('viewer', {room: room});
});

app.get('/lightsaber/:roomId', function (req, res){
	res.render('lightsaber', {room: req.params.roomId});
});

var port = 3000;
server.listen(port, function(req, res){
	console.log("Listening on "+port);
});

io.on('connection', function (socket) {

/*
- GET /viewer
- Generate ROOM ID and render it on page
- VIEWER joins socket room with ROOM ID

- GET /lightsaber
- Input ROOM ID from VIEWER
- LIGHTSABER joins socket room with ROOM ID
	- SERVER tells VIEWER and LIGHTSABER to begincalibration
- LIGHTSABER tells SERVER that calibrationcomplete
	- SERVER tells VIEWER that calibrationcomplete
- VIEWER tells SERVER that viewerready
	- SERVER tells LIGHTSABER that viewerready
- LIGHTSABER tells SERVER sendmotion with data
	- SERVER tells VIEWER motionupdate with data
*/

	socket.on('viewerjoin', function(data){
		socket.room = data.room;
		socket.join(socket.room);

		console.log("Viewer joined: "+socket.room);
	});

	socket.on('lightsaberjoin', function(data){
		socket.room = data.room;
		socket.join(socket.room);

		io.sockets.in(socket.room).emit('begincalibration');

		console.log("Lightsaber joined: "+socket.room);
	});

	socket.on('calibrationcomplete', function(data){
		socket.broadcast.to(socket.room).emit('calibrationcomplete');

		console.log("Lightsaber calibration complete: "+socket.room);
	})

	socket.on('viewready', function(data){
		socket.broadcast.to(socket.room).emit('viewready');

		console.log("View ready: "+socket.room);
	});

	socket.on('sendorientation', function(data){
		socket.broadcast.to(socket.room).emit('updateorientation',data);
		console.log("Lightsaber Orientation Data \n");
		console.log(data);
	});

	socket.on('sendmotion', function(data){
		socket.broadcast.to(socket.room).emit('updatemotion',data);
		console.log("Lightsaber Motion Data \n");
		console.log(data);
	});

});