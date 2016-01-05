/*
	
	2015 - Ajay Ramesh
	ajayramesh@berkeley.edu
	ajayramesh.com
	@carpetfizz

	debug shit to remove:
		- server.js "drake"
		- stereo renderer
		- controls update for isMobile
		- Click for full screen
		- Confirm button click
	ngrok

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
	cube,
	lightsaber,
	lightAngle,
	lightScene,
	floor;

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
	
	/* HAND */
	var handGeometry = new THREE.SphereGeometry(1, 32, 32 );
	var handMaterial = new THREE.MeshBasicMaterial({color: "#eac086"});
	hand = new THREE.Mesh(handGeometry, handMaterial);
	hand.position.set(10, 6, camera.position.z / 2);
	scene.add(hand);

	/* LIGHTSABER MODEL */
	var lsGeometry = new THREE.CylinderGeometry(0.4, 0.04, 30, 20);
	var lsMaterial = new THREE.MeshBasicMaterial({ color: "white" });
	lightsaber = new THREE.Mesh( lsGeometry, lsMaterial );
	lightsaber.position.setY(15);

	var glowGeometry = new THREE.CylinderGeometry(0.5, 0.5, 30, 20);
	var glowMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.5, color: "#00FFFF" });
	var glow = new THREE.Mesh(glowGeometry, glowMaterial);
	lightsaber.add(glow);

	hand.add(lightsaber);

	/* LIGHTING */
	lightAngle = new THREE.PointLight(0x999999, 2, 100);
	lightAngle.position.set(50,50,50);
	scene.add(lightAngle);

	lightScene = new THREE.PointLight(0x999999, 2, 100);
	lightScene.position.set(0, 5, 0);
	scene.add(lightScene);

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
	var floorGeometry = new THREE.PlaneBufferGeometry(1000, 1000);
	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2;
	scene.add(floor);

	// AXIS 
	var axis = new THREE.AxisHelper(200);
    scene.add(axis); 

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

var oldAlpha = 0;

/* UTILS */
function setObjectQuat(object, data) {

	console.log(data.a);

	/* DEGREES to RADIANS */
	var gammaRotation = data.g ? data.g * (Math.PI / 180): 0;
	var betaRotation = data.b ? data.b * (Math.PI / 180) : 0;
	var alphaRotation = data.a ? data.a * (Math.PI / 180): 0;
	var alpha, beta, gamma;
	var euler = new THREE.Euler();
	
	beta = betaRotation;
	gamma = gammaRotation;
	alpha = alphaRotation;

	// if(betaRotation > 160 * (Math.PI / 180) || betaRotation < -90 * (Math.PI / 180)) {
	// 	beta = 160 * (Math.PI / 180);
	// }

	/*
		var x, z;
		x = object.position.x;
		z = object.position.z;
		alpha*=0.01;
		object.position.x = x * Math.cos(alpha) + z * Math.sin(alpha);
		object.position.z = z * Math.cos(alpha) - x * Math.sin(alpha);
	*/

	
	euler.set(0, -gamma, beta - Math.PI/2);

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
  render(clock.getDelta());
}

function update(dt){
  resize();
  camera.updateProjectionMatrix();
  orbitControls.update(dt);

  if(isMobile) {
  	controls.update();
  }
}

function render(dt){
	if(isMobile){
		stereo.render(scene, camera);
	}else{
		renderer.render(scene, camera);
	}
}

$(document).ready(function(){
	/*$('.confirm-button').click(function(){
		init();
		animate();
	});*/
	init();
	animate();
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