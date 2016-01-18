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
				var calibratedOrientation = {g: orientation.g, b: orientation.b, a: orientation.a - Math.abs(originalAlpha), o: orientation.o}
				socket.emit('sendorientation', calibratedOrientation);
				oldOrientation = calibratedOrientation;
			}
		});
	}
});


var muted = true,
	muteClass = "volume fa fa-volume-off",
	volumeClass = "volume fa fa-volume-up",
	volumeButton = document.getElementsByClassName("volume")[0],
	audio = new Audio();
	soundDir  = "/sounds/",
	hitFiles = ["hit1.wav", "hit2.wav", "hit3.wav", "hit4.wav"],
	hitSounds = [];

volumeButton.addEventListener("click", function(){
	if(muted){
		volumeButton.className = volumeClass;
		muted = false;
	}	
	changeAudio();
});

function changeAudio(){
	if(!muted){
		for(var i=0; i<hitFiles.length; i++){
			var newAudio = document.createElement("AUDIO");
			newAudio.id = "audio";
			newAudio.src= soundDir+hitFiles[Math.floor(Math.random() * 3)];
			newAudio.load();
			hitSounds.push(newAudio);
		}
	}
}

socket.on('playsound', function(data){
	hitSounds[Math.floor(Math.random() * 3)].play();
});