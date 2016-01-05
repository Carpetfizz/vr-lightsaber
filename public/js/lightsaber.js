var socket = io();

var alpha, beta, gamma;
alpha = document.getElementById("alpha");
beta = document.getElementById("beta");
gamma = document.getElementById("gamma");


socket.emit('lightsaberjoin', {room: roomId});

socket.on('beginsetup', function(data){
	 window.addEventListener("compassneedscalibration", function(event) {
    	alert('Your compass needs calibrating!');
    	event.preventDefault();
    }, true);
	socket.emit('setupcomplete');
});

socket.on('viewready', function(data){

	var originalAlpha = 0;
	var freezeAlpha = false;
	var oldOrientation = {};
	var oldMotion = {};

	if(window.DeviceOrientationEvent){
		window.addEventListener('deviceorientation', function(e){
			if(!freezeAlpha) {
				originalAlpha = e.alpha;
				freezeAlpha = true;
			}
			var orientation = {g: Math.round(e.gamma), b: Math.round(e.beta), a: Math.round(e.alpha), o: window.orientation || 0};
			alpha.innerHTML = orientation.a;
			beta.innerHTML = orientation.b;
			gamma.innerHTML = orientation.g;
			if(JSON.stringify(orientation) != JSON.stringify(oldOrientation)){
				/*var a;
				if(!oldOrientation.a) {
					a = originalAlpha;
				}else{
					a = oldOrientation.a - orientation.a;
				}
				var calibratedOrientation = {g: orientation.g, b: orientation.b, a: a, o: orientation.o}*/
				socket.emit('sendorientation', orientation);
				oldOrientation = orientation;
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