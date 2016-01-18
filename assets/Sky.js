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