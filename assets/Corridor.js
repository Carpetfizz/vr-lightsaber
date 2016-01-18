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