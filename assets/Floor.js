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