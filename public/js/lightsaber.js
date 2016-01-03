var socket = io();

var alpha, beta, gamma, original;
original = document.getElementById("original");
alpha = document.getElementById("alpha");
beta = document.getElementById("beta");
gamma = document.getElementById("gamma");


socket.emit('lightsaberjoin', {room: roomId});

socket.on('begincalibration', function(data){
	 window.addEventListener("compassneedscalibration", function(event) {
    	alert('Your compass needs calibrating!');
    	event.preventDefault();
    }, true);
	socket.emit('calibrationcomplete');
});

socket.on('viewready', function(data){

	var originalOrientation = {};
	var oldOrientation = {};
	var oldMotion = {};

	originalOrientation.freeze = false;

	if(window.DeviceOrientationEvent){
		window.addEventListener('deviceorientation', function(e){
			var orientation = {g: Math.round(e.gamma), b: Math.round(e.beta), a: Math.round(e.alpha), o: window.orientation || 0};
			if(!originalOrientation.freeze){
				originalOrientation = orientation;
				originalOrientation.freeze = true;
				original.innerHTML = String(orientation.a+", "+orientation.b+", "+orientation.g);
			}
			alpha.innerHTML = orientation.a;
			beta.innerHTML = orientation.b;
			gamma.innerHTML = orientation.g;
			if(JSON.stringify(orientation) != JSON.stringify(oldOrientation)){
				oldOrientation = orientation;
				var calibratedOrientation = {g: orientation.g, b: orientation.b, a: orientation.a, o: orientation.o}
				socket.emit('sendorientation', orientation);
			}
		});
	}

	/*if(window.DeviceMotionEvent){
		window.addEventListener('devicemotion', function(e){
			var acceleration = e.acceleration;
			var motion = {x: Math.round(acceleration.x), y: Math.round(acceleration.y), z: Math.round(acceleration.z)}
			if(JSON.stringify(motion) != JSON.stringify(oldMotion)){
				oldMotion = motion;
				socket.emit('sendmotion', motion);
			}
		});
	}*/

});