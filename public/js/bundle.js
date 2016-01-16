(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Enemy(){
	var enemyGeometry = new THREE.SphereGeometry(2, 40, 40);
	var enemyMaterial = new THREE.MeshBasicMaterial({color: "red"});

	var enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);

	return enemy;
}

module.exports = Enemy;
},{}],2:[function(require,module,exports){
function Floor(textureLoader, renderer) {

	/* FLOOR */
	// Floor Texture
	var floorTexture = textureLoader.load( "/textures/floor_metal.jpg" );
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(75, 75);
	floorTexture.anisotropy = renderer.getMaxAnisotropy();

	// Floor Material
	var floorMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 5,
		shading: THREE.FlatShading,
		map: floorTexture
	});


	// Floor Geometry
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000);
	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2;

	//return floor;
	return floor;
}

module.exports = Floor;
},{}],3:[function(require,module,exports){
function Hand(camera){
	/* HAND */
	var handGeometry = new THREE.SphereGeometry(1, 32, 32 );
	var handMaterial = new THREE.MeshBasicMaterial({color: "#eac086"});
	hand = new THREE.Mesh(handGeometry, handMaterial);
	hand.position.set(10, 6, camera.position.z / 2);
	hand.mass = 0;

	return hand;
}

module.exports = Hand;
},{}],4:[function(require,module,exports){
function Lightsaber(){
	/* LIGHTSABER MODEL */
	var lsGeometry = new THREE.CylinderGeometry(0.4, 0.04, 30, 20);
	var lsMaterial = new THREE.MeshBasicMaterial({ color: "white" });
	lightsaber = new THREE.Mesh( lsGeometry, lsMaterial );
	lightsaber.position.setY(15);

	var glowGeometry = new THREE.CylinderGeometry(0.5, 0.5, 30, 20);
	var glowMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.5, color: "#00FFFF" });
	var glow = new THREE.Mesh(glowGeometry, glowMaterial);

	lightsaber.add(glow);

	return lightsaber;
}

module.exports = Lightsaber;
},{}],5:[function(require,module,exports){
/*
	
	2015 - Ajay Ramesh
	ajayramesh@berkeley.edu
	ajayramesh.com
	@carpetfizz

	debug shit to remove:
		- server.js "drake"
		- stereo renderer
		- click fullscreen
		- Confirm button click
		- gravity
		- white screen of death

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
	raycaster,
	orbitControls,
	controls,
	container,
	domElement,
	hand,
	enemy,
	enemies,
	lightsaber,
	floor,
	collidableMeshList,
	soundDir,
	hitSounds;


var Floor = require('../../assets/Floor');
var Hand = require('../../assets/Hand');
var Lightsaber = require('../../assets/Lightsaber');
var Enemy = require('../../assets/Enemy');

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
	raycaster = new THREE.Raycaster();
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

	enemies = [];
	collidableMeshList = [];
	
	floor = new Floor(textureLoader, renderer);
	scene.add(floor);

	hand = new Hand(camera);
	lightsaber = new Lightsaber();
	hand.add(lightsaber);
	scene.add(hand);
	collidableMeshList.push(lightsaber);

	enemy = new Enemy();
	
	window.setInterval(function(){
		var newEnemy = enemy.clone();
		newEnemy.position.set(200, getRandomArbitrary(5, 20), getRandomArbitrary(-15, 15));
		newEnemy.name = "enemy";
		newEnemy.velocity = new THREE.Vector3(-1, 0, 0);
		enemies.push(newEnemy);
		collidableMeshList.push(newEnemy);
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
		x = rcos(theta)
		y = rsin(theta)
		beta - Math.PI/2 because we are still dealing with device in upright position
		Added 10 to both to offset the hand in front of the camera
	
		- [BUG] beta jumps to 180 - theta or theta - 180

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

/*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random*/
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
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
  
  for(var i=0; i<enemies.length; i++){
  	var e = enemies[i];
  	e.position.add(e.velocity);
  	if(e.position.x < -100 || e.position.x > 200){
  		scene.remove(e);
  		enemies.splice(i, 1);
  	}

  }

  checkCollision(lightsaber.children[0], "enemy");

  var cameraDirection = camera.getWorldDirection();

  if(cameraDirection.x < 0){
  	camera.lookAt(0, oldCameraDirection.y, oldCameraDirection.z);
  }

  if(isMobile) {
  	controls.update();
  }
  oldCameraDirection = cameraDirection;
}

function checkCollision(object, targetName){

	for (var vertexIndex = 0; vertexIndex < object.geometry.vertices.length; vertexIndex++)
	{       
	    var localVertex = object.geometry.vertices[vertexIndex].clone();
	    var globalVertex = localVertex.applyMatrix4(object.matrixWorld)
	    var directionVector = globalVertex.sub( object.position );

	    raycaster.set( object.position, directionVector.clone().normalize() );
	    
	    var collisionResults = raycaster.intersectObjects( collidableMeshList );
	    
	    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
	    {
	    	var result = collisionResults[0].object;

	    	if(result.name==targetName){
	    		result.velocity = new THREE.Vector3(1, 0, 0);
	    		playFile(hitSounds[Math.floor(getRandomArbitrary(0, 3))]);
	    	}
	    }
	}

}

function playFile(file){
	/* http://theforce.net/fanfilms/postproduction/soundfx/saberfx_fergo.asp */
	var audio = new Audio(soundDir+file);
	audio.play();
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
},{"../../assets/Enemy":1,"../../assets/Floor":2,"../../assets/Hand":3,"../../assets/Lightsaber":4}]},{},[5]);
