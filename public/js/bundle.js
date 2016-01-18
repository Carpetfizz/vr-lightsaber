(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Corridor(textureLoader){

	var corridor = new THREE.Object3D();

	var wallGeometry = new THREE.PlaneGeometry(100, 150);
	
	var wallTexture = textureLoader.load( "/textures/wall_metal.jpg" );
	wallTexture.wrapS = THREE.RepeatWrapping;
	wallTexture.wrapT = THREE.RepeatWrapping;
	wallTexture.repeat.set(5, 5);
	// Floor Material
	var wallMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 5,
		shading: THREE.FlatShading,
		map: wallTexture
	});


	var ceilGeometry = new THREE.PlaneGeometry(100, 70);
	var ceilMaterial = new THREE.MeshBasicMaterial({color: "green"});

	var doorGeometry = new THREE.PlaneGeometry(70, 150);

	var doorTexture = textureLoader.load( "/textures/door_metal.jpg" );
	doorTexture.wrapS = THREE.RepeatWrapping;
	doorTexture.wrapT = THREE.RepeatWrapping;
	doorTexture.repeat.set(5, 5);
	// Floor Material
	var doorMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 5,
		shading: THREE.FlatShading,
		map: doorTexture
	});

	var wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
	wall1.position.set(20, 0, -35);

	var wall2 = wall1.clone();
	wall2.position.set(20, 0, 35);
	wall2.rotateY(Math.PI);

	var door = new THREE.Mesh(doorGeometry, doorMaterial);
	door.rotateY(Math.PI/2);
	door.position.set(-20, 0, 0);


	var ceil = new THREE.Mesh(ceilGeometry, ceilMaterial);
	ceil.rotateX(-Math.PI/2);
	ceil.position.set(-20, 50, 0);


	corridor.add(wall1, wall2, door, ceil);

	return corridor;
}

module.exports = Corridor;
},{}],2:[function(require,module,exports){
function Enemy(){
	var enemyGeometry = new THREE.SphereGeometry(2, 40, 40);
	var enemyMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.75, color: "red"});

	var enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);

	return enemy;
}

module.exports = Enemy;
},{}],3:[function(require,module,exports){
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
	var floorGeometry = new THREE.PlaneGeometry(500,500);
	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2;

	//return floor;
	return floor;
}

module.exports = Floor;
},{}],4:[function(require,module,exports){
function Hand(camera){
	/* HAND */
	var handGeometry = new THREE.SphereGeometry(1, 32, 32 );
	var handMaterial = new THREE.MeshBasicMaterial({color: "#eac086"});
	hand = new THREE.Mesh(handGeometry, handMaterial);
	hand.position.set(15, 6, camera.position.z / 2);
	return hand;
}

module.exports = Hand;
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
function Sky(textureLoader){
	
	var skyGeometry = new THREE.SphereGeometry(10000, 10000, 25, 25);
	var skyMaterial = new THREE.MeshBasicMaterial({
		map: textureLoader.load('textures/sky.jpg'),
		side: THREE.BackSide});
	var skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
	skyDome.rotateY(-Math.PI/2);

	return skyDome;

}

module.exports = Sky;
},{}],7:[function(require,module,exports){
function Utils(){
	this.raycaster = new THREE.Raycaster();
	this.collidableMeshList = []; // All meshes raycaster cares about
	this.collidedMeshes = []; // UUIDs of meshes that have already been collided with
}

Utils.prototype.getRandomInRange = function(min, max){
	/*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random*/
	return Math.random() * (max - min) + min;
}

Utils.prototype.playAudio = function(audio){
	audio.play();
}

Utils.prototype.checkCollision = function(object, targetName, once, cb){
	/*
		Raycaster.
		Iterate through all vertices of an object. Cast a ray from its center to the outside.
		Ray will pick up all of its intersecting objects in raycaster.intersectObjects
		Check if the object picked up is the one we want, "targetName"
		FOR THIS PROJECT: We don't want to multi-count targets that may still be touching, so their UUIDs are cached and checked against
	*/

	if(!once){
		once = false;
	}

	for (var vertexIndex = 0; vertexIndex < object.geometry.vertices.length; vertexIndex++)
	{       
	    var localVertex = object.geometry.vertices[vertexIndex].clone();
	    var globalVertex = localVertex.applyMatrix4(object.matrixWorld)
	    var directionVector = globalVertex.sub( object.position );

	    this.raycaster.set( object.position, directionVector.clone().normalize() );
	    
	    var collisionResults = this.raycaster.intersectObjects( this.collidableMeshList );
	    
	    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
	    {
	    	var result = collisionResults[0].object;

	    	if(result.name==targetName){
	    		
	    		if(once){
	    			for(var i=0; i< this.collidedMeshes.length; i++){
		    			var uuid = this.collidedMeshes[i];
		    			if(result.uuid==uuid){
		    				return;
		    			}
	    			}
	    			
	    			this.collidedMeshes.push(result.uuid);
	    		}
	    		cb(result);
	    	}
	    }
	}
}

Utils.prototype.cameraLookDir =  function(camera) {
	/* http://stackoverflow.com/a/17286752/896112 */
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(camera.rotation, camera.rotation.order);
    return vector;
}

Utils.prototype.debugAxes = function(axisLength, scene){
    //Shorten the vertex function
    function v(x,y,z){ 
            return new THREE.Vector3(x,y,z); 
    }
    
    //Create axis (point1, point2, colour)
    function createAxis(p1, p2, color){
            var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
            lineGeometry.vertices.push(p1, p2);
            line = new THREE.Line(lineGeometry, lineMat);
            scene.add(line);
    }
    
    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
};

var u = new Utils();

module.exports = u;
},{}],8:[function(require,module,exports){
/*
	
	(December 2015 - January 2016) - Ajay Ramesh
	ajayramesh@berkeley.edu
	ajayramesh.com
	@carpetfizz

	//TODO:
		- server.js "drake"
		- Confirm button click

	useful links:
		- "What is Gimbal Lock and why does it occur?" http://www.anticz.com/eularqua.htm
		- "Euler (gimbal lock) explained" https://www.youtube.com/watch?v=zc8b2Jo7mno
		- "Rotation of Axes" http://www.stewartcalculus.com/data/CALCULUS%20Early%20Transcendentals/upfiles/RotationofAxes.pdf
		- "W3C DeviceOrientation Event Spec" http://w3c.github.io/deviceorientation/spec-source-orientation.html
		- "THREE.js Pivots" http://stackoverflow.com/questions/15214582/how-do-i-rotate-some-moons-around-a-planet-with-three-js
		- "Detecting if Mobile Device" http://stackoverflow.com/a/24600597/896112

	resources:
		- Sky Textures from: http://www.sketchuptexture.com/2013/02/panoramic-ski-360.html
		- Lightsaber Sounds from: 	/* http://theforce.net/fanfilms/postproduction/soundfx/saberfx_fergo.asp
*/

var socket = io();

var scene,
	width,
	height,
	camera,
	renderer,
	stereo,
	clock,
	textureLoader,
	controls,
	orbitControls,
	container,
	domElement,
	hand,
	enemy,
	enemies,
	lightsaber,
	floor,
	corridor,
	soundDir,
	started;


var Sky = require('../../assets/Sky');
var Floor = require('../../assets/Floor');
var Corridor = require('../../assets/Corridor');
var Hand = require('../../assets/Hand');
var Lightsaber = require('../../assets/Lightsaber');
var Enemy = require('../../assets/Enemy');
var Utils = require('./utils');

function init(){
	started = false;
	width = window.innerWidth;
	height = window.innerHeight;
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, width / height, 0.001, 20000);
	renderer = new THREE.WebGLRenderer();
	stereo = new THREE.StereoEffect(renderer);
	clock = new THREE.Clock();
	textureLoader = new THREE.TextureLoader();
	renderer.setSize( window.innerWidth, window.innerHeight);
	camera.lookAt(0, 0, 0);
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
	

	if(isMobile){
		controls = new DeviceOrientationController(camera, renderer.domElement);
		controls.connect();
	}

	$('.landing').hide();
	$('.confirm-button').hide();
	container.appendChild(domElement);
	domElement.addEventListener('click', fullscreen, false);
	setupScene();
}

function setupScene(){

	enemies = []; // Keep enemies in here so we can manipulate them in update()
	
	var sky = new Sky(textureLoader);
	console.log(sky);
	scene.add(sky);

	floor = new Floor(textureLoader, renderer);
	scene.add(floor);

	corridor = new Corridor(textureLoader);
	scene.add(corridor);

	//Compound object from parent to child: Camera -> Hand -> Lightsaber -> Glow
	hand = new Hand(camera);
	lightsaber = new Lightsaber();
	hand.add(lightsaber);


	Utils.collidableMeshList.push(lightsaber);

	/* LIGHTING */
	lightAngle = new THREE.PointLight(0x999999, 1, 500);
	lightAngle.position.set(0,50,0);
	scene.add(lightAngle);


	// AXIS 
	var axis = new THREE.AxisHelper(200);
    //scene.add(axis);

    requestAnimationFrame(animate);
}

function setupGame() {
	scene.add(hand);
	enemy = new Enemy();
	
	// Every 1.5 seconds, spawn a new enemy  at random position and set its velocity to -1, to come at the player
	window.setInterval(function(){
		var newEnemy = enemy.clone();
		newEnemy.position.set(200, Utils.getRandomInRange(5, 20), Utils.getRandomInRange(-10, 10));
		newEnemy.name = "enemy";
		newEnemy.velocity = new THREE.Vector3(-1, 0, 0);
		enemies.push(newEnemy);
		Utils.collidableMeshList.push(newEnemy);
		scene.add(newEnemy);
	}, 1500);

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

	/*
		- [BUG] beta jumps to 180 - theta or theta - 180
		
		x = rcos(theta)
		y = rsin(theta)
		beta - Math.PI/2 because we are still dealing with device in upright position
		Added 10 to both to offset the hand in front of the camera
		object.position.z = Math.cos(beta - Math.PI/2) -  10;
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

function update(dt){
  resize();
  camera.updateProjectionMatrix();  
  orbitControls.update(dt);

  var cameraDir = Utils.cameraLookDir(camera);

  if(Math.abs(1 - cameraDir.x) < 0.01 && !started) {
  	setupGame();
  	started = true;
  }
  // Check collision with lightsaber and enemy at every iteration
  Utils.checkCollision(lightsaber.children[0], "enemy", true, function(result){
  	if(result){
  		socket.emit('sendhit');
  		result.velocity = new THREE.Vector3(1, 0, 0);
  	}
  });

  // Apply velocity vector to enemy, check if they are out of bounds to remove them
  for(var i=0; i<enemies.length; i++){
  	var e = enemies[i];
  	e.position.add(e.velocity);
  	if(e.position.x < -10 || e.position.x > 200){
  		scene.remove(e);
  		enemies.splice(i, 1);
  	}

  }

  if(isMobile) {
  	controls.update();
  }

}

$(document).ready(function(){
	$('.confirm-button').click(function(){
		init();
		animate();
	});
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
},{"../../assets/Corridor":1,"../../assets/Enemy":2,"../../assets/Floor":3,"../../assets/Hand":4,"../../assets/Lightsaber":5,"../../assets/Sky":6,"./utils":7}]},{},[8]);
