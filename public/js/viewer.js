/*
	debug shit to remove:
		- server.js "drake"
		- document.ready init, render, move back to calibrationcomplete
		- stereo renderer
	ngrok
	http://stackoverflow.com/questions/22417324/rotating-on-multiple-axis-with-three-js
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
	domElement,
	hand,
	cube,
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
	camera.lookAt(new THREE.Vector3(0, 0, 0));

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
	document.body.appendChild(domElement);
	setupScene();
}

function setupScene(){
	
	/* HAND */
	/*var handGeometry = new THREE.SphereGeometry(0.1, 32, 32 );
	var handMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
	hand = new THREE.Mesh(handGeometry, handMaterial);
	hand.position = camera.position;
	hand.position.set(1, camera.position.y - 1, 0);*/


	/* LIGHTSABER MODEL */
	var geometry = new THREE.BoxGeometry(0.1, 2, 0.1);
	var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	cube = new THREE.Mesh( geometry, material );
	cube.position.set(1, 15, camera.position.z / 2);
	scene.add(cube);

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
	var axis = new THREE.AxisHelper(75);
    scene.add(axis); 

}

function setOrientationControls(e){
  if(!e.alpha){
    return;
  }
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();
  domElement.addEventListener('click', fullscreen, false);
  window.removeEventListener('deviceorientation', setOrientationControls, true);
}

window.addEventListener('deviceorientation', setOrientationControls, true);

/* UTILS */
function setObjectQuat(object, data) {

	/* DEGREES to RADIANS */
	var gammaRotation = data.g ? data.g * (Math.PI / 180): 0;
	var betaRotation = data.b ? data.b * (Math.PI / 180) : 0;
	var alphaRotation = data.a ? data.a * (Math.PI / 180): 0;
	var alpha, beta, gamma;
	var euler = new THREE.Euler();
	
	beta = betaRotation;
	gamma = gammaRotation;
	alpha = alphaRotation;

	if(betaRotation > 160 * (Math.PI / 180) || betaRotation < -90 * (Math.PI / 180)) {
		beta = 160 * (Math.PI / 180);
	}

	euler.set(0, -gamma, beta - Math.PI/2, 0);
	
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
	init();
	animate();
});

/* SOCKET.IO */

socket.emit('viewerjoin', {room: roomId});

socket.on('begincalibration', function(data){
	// change display
});

socket.on('calibrationcomplete', function(data){
	// change display
	// init();
	// animate();
	socket.emit('viewready');

});

socket.on('updateorientation', function(data){
	setObjectQuat(cube, data);
});

socket.on('updatemotion', function(data){
});