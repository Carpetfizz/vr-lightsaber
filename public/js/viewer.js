/*
	
	(December 2015 - January 2016) - Ajay Ramesh
	ajayramesh@berkeley.edu
	ajayramesh.com
	@carpetfizz

	debug shit to remove:
		- server.js "drake"
		- stereo renderer
		- click fullscreen
		- legit deflection angles for Enemy
		- Confirm button click

	useful links:
		- "What is Gimbal Lock and why does it occur?" http://www.anticz.com/eularqua.htm
		- "Euler (gimbal lock) explained" https://www.youtube.com/watch?v=zc8b2Jo7mno
		- "Rotation of Axes" http://www.stewartcalculus.com/data/CALCULUS%20Early%20Transcendentals/upfiles/RotationofAxes.pdf
		- "W3C DeviceOrientation Event Spec" http://w3c.github.io/deviceorientation/spec-source-orientation.html
		- "THREE.js Pivots" http://stackoverflow.com/questions/15214582/how-do-i-rotate-some-moons-around-a-planet-with-three-js
		- "Detecting if Mobile Device" http://stackoverflow.com/a/24600597/896112 
*/

var socket = io();
var isMobile = false;

var scene,
	width,
	height,
	camera,
	renderer,
	stereo,
	clock,
	textureLoader,
	orbitControls,
	controls,
	container,
	domElement,
	hand,
	enemy,
	enemies,
	lightsaber,
	floor,
	soundDir,
	hitSounds;


var Floor = require('../../assets/Floor');
var Hand = require('../../assets/Hand');
var Lightsaber = require('../../assets/Lightsaber');
var Enemy = require('../../assets/Enemy');
var Utils = require('./utils');

if (/Mobi/.test(navigator.userAgent)) {
   	isMobile = true;
}

function init(){

	width = window.innerWidth;
	height = window.innerHeight;
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, width / height, 0.001, 1000);
	renderer = new THREE.WebGLRenderer();
	stereo = new THREE.StereoEffect(renderer);
	clock = new THREE.Clock();
	textureLoader = new THREE.TextureLoader();
	renderer.setSize( window.innerWidth, window.innerHeight);
	camera.position.set(0, 15, 0);
	
	scene.add(camera);
	
	container = document.getElementById("container");
	domElement = renderer.domElement;

	orbitControls = new THREE.OrbitControls(camera, domElement);

	orbitControls.target.set(
		camera.position.x+0.15,
		camera.position.y,
		camera.position.z
	);

	orbitControls.noPan = true;
	orbitControls.noZoom = true;


	soundDir  = "/sounds/";
	hitSounds = ["hit1.wav", "hit2.wav", "hit3.wav", "hit4.wav"];
	

	if(isMobile){
		controls = new DeviceOrientationController(camera, renderer.domElement);
		controls.connect();
	}

	$('.room-id').hide();
	$('.confirm-button').hide();
	container.appendChild(domElement);
	//domElement.addEventListener('click', fullscreen, false);
	setupScene();
}

function setupScene(){

	enemies = []; // Keep enemies in here so we can manipulate them in update()
	collidableMeshList = []; // All meshes that the raycaster cares about
	collidedMeshes = []; // All meshes that have already collided
	
	floor = new Floor(textureLoader, renderer);
	scene.add(floor);

	//Combound object from parent to child: Hand -> Lightsaber -> Glow

	hand = new Hand(camera);
	lightsaber = new Lightsaber();
	hand.add(lightsaber);
	scene.add(hand);
	Utils.collidableMeshList.push(lightsaber);

	enemy = new Enemy();
	
	// Every 1.5 seconds, spawn a new enemy  at random position and set its velocity to -1, to come at the player
	window.setInterval(function(){
		var newEnemy = enemy.clone();
		newEnemy.position.set(200, Utils.getRandomInRange(5, 20), Utils.getRandomInRange(-15, 15));
		newEnemy.name = "enemy";
		newEnemy.velocity = new THREE.Vector3(-1, 0, 0);
		enemies.push(newEnemy);
		Utils.collidableMeshList.push(newEnemy);
		scene.add(newEnemy);
	}, 1500);

	/* LIGHTING */
	lightAngle = new THREE.PointLight(0x999999, 1, 500);
	lightAngle.position.set(0,50,0);
	scene.add(lightAngle);


	// AXIS 
	var axis = new THREE.AxisHelper(200);
    scene.add(axis);

    requestAnimationFrame(animate);
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

function setOrientationControls(e){
  if(!e.alpha){
    return;
  }
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();
  window.removeEventListener('deviceorientation', setOrientationControls, true);
}

window.addEventListener('deviceorientation', setOrientationControls, true);

/* UTILS */
function setObjectQuat(object, data) {
	
	/* Degrees to radians */
	var gammaRotation = data.g ? data.g * (Math.PI / 180): 0;
	var betaRotation = data.b ? data.b * (Math.PI / 180) : 0;
	var alphaRotation = data.a ? data.a * (Math.PI / 180): 0;
	var alpha, beta, gamma, betaMax, betaMin;
	var euler = new THREE.Euler();
	
	beta = betaRotation;
	gamma = gammaRotation;
	alpha = alphaRotation;
	betaMax = 2*Math.PI/3;
	betaMin = -Math.PI/6;

	/*
		- [BUG] beta jumps to 180 - theta or theta - 180
		
		x = rcos(theta)
		y = rsin(theta)
		beta - Math.PI/2 because we are still dealing with device in upright position
		Added 10 to both to offset the hand in front of the camera
		object.position.x = Math.cos(beta - Math.PI/2) + 10;
		object.position.y = 5 * Math.sin(beta - Math.PI/2) + 10;
	*/

	/*	beta - Math.PI/2 because rotations on z-axis are made when device is in upright position 
		-gamma because of the way the lightsaber is facing the camera
	*/
	euler.set(0, -gamma, beta - Math.PI/2);
	
	/* Using quaternions to combat gimbal lock */ 
	object.quaternion.setFromEuler(euler);	
}

/* RENDER */

function resize() {
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
  stereo.setSize(newWidth, newHeight);
}

function animate(){
	var elapsedSeconds = clock.getElapsedTime();
	requestAnimationFrame(animate);
	update(clock.getDelta());
	if(isMobile){
		stereo.render(scene, camera);
	}else{
		renderer.render(scene, camera);
	}
}

var oldCameraDirection;

function update(dt){
  resize();
  camera.updateProjectionMatrix();
  orbitControls.update(dt);
  
  // Check collision with lightsaber and enemy at every iteration
  Utils.checkCollision(lightsaber.children[0], "enemy", true, function(result){
  	if(result){
  		result.velocity = new THREE.Vector3(1, 0, 0);
  		Utils.playFile(soundDir, hitSounds[Math.floor(Utils.getRandomInRange(0, 3))]);		
  	}
  });

  // Apply velocity vector to enemy, check if they are out of bounds to remove them
  for(var i=0; i<enemies.length; i++){
  	var e = enemies[i];
  	e.position.add(e.velocity);
  	if(e.position.x < -100 || e.position.x > 200){
  		scene.remove(e);
  		enemies.splice(i, 1);
  	}

  }

  var cameraDirection = camera.getWorldDirection();

  if(cameraDirection.x < 0){
  	camera.lookAt(0, oldCameraDirection.y, oldCameraDirection.z);
  }

  if(isMobile) {
  	controls.update();
  }
  oldCameraDirection = cameraDirection;

}

$(document).ready(function(){
	/*$('.confirm-button').click(function(){
		init();
		animate();
	});*/
	init();
});

/* SOCKET.IO */

socket.emit('viewerjoin', {room: roomId});

socket.on('beginsetup', function(data){
	// change display
});

socket.on('setupcomplete', function(data){
	$('.confirm-button').show();
	socket.emit('viewready');

});

socket.on('updateorientation', function(data){
	if(hand){
		setObjectQuat(hand, data);
	}
});

socket.on('updatemotion', function(data){
});